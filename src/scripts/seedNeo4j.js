// ==============================================================================
// BookGraph - Automated Neo4j Database Seeder Script
// Usage: npm run seed
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { driver, initNeo4j, closeDriver } = require('../config/neo4j');

async function seedDatabase() {
  console.log('--- Starting BookGraph Neo4j Database Seeding ---');
  const connected = await initNeo4j();

  if (!connected) {
    console.error('ERROR: Cannot seed database because Neo4j connection failed.');
    console.error('Please check your .env settings (NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD).');
    process.exit(1);
  }

  const session = driver.session({ database: process.env.NEO4J_DATABASE || 'neo4j' });

  try {
    // 1. Run Schema / Constraints
    const schemaFile = path.join(__dirname, '../../cypher/01_schema.cypher');
    console.log(`Reading schema from: ${schemaFile}`);
    const schemaCypher = fs.readFileSync(schemaFile, 'utf8');

    // Split statements by semicolon
    const schemaStatements = schemaCypher
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('//') && !s.startsWith('SHOW'));

    console.log(`Executing ${schemaStatements.length} schema constraints & indexes...`);
    for (const stmt of schemaStatements) {
      try {
        await session.run(stmt);
      } catch (e) {
        console.warn(`Constraint notice: ${e.message}`);
      }
    }
    console.log('✓ Schema and constraints created successfully.');

    // 2. Run Seed Data
    const seedFile = path.join(__dirname, '../../cypher/02_seed_data.cypher');
    console.log(`Reading seed data from: ${seedFile}`);
    const seedCypher = fs.readFileSync(seedFile, 'utf8');

    const seedStatements = seedCypher
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('//'));

    console.log(`Executing ${seedStatements.length} MERGE seed statements...`);
    let count = 0;
    for (const stmt of seedStatements) {
      await session.run(stmt);
      count++;
      if (count % 10 === 0) {
        process.stdout.write(`  Processed ${count}/${seedStatements.length} statements...\r`);
      }
    }
    console.log(`\n✓ Seed data populated successfully! (${count} statements)`);

    // Verify counts
    const countsResult = await session.run(`
      MATCH (s:Student) WITH count(s) AS students
      MATCH (b:Book) WITH students, count(b) AS books
      MATCH (a:Author) WITH students, books, count(a) AS authors
      MATCH (g:Genre) WITH students, books, authors, count(g) AS genres
      MATCH ()-[br:BORROWED]->() WITH students, books, authors, genres, count(br) AS borrows
      RETURN students, books, authors, genres, borrows
    `);

    const r = countsResult.records[0];
    console.log('\n--- Database Population Summary ---');
    console.log(`Students:     ${r.get('students')}`);
    console.log(`Books:        ${r.get('books')}`);
    console.log(`Authors:      ${r.get('authors')}`);
    console.log(`Genres:       ${r.get('genres')}`);
    console.log(`Borrow Edges: ${r.get('borrows')}`);
    console.log('-----------------------------------');
    console.log('BookGraph database is ready to use!');
  } catch (err) {
    console.error('Failed to seed Neo4j:', err);
  } finally {
    await session.close();
    await closeDriver();
  }
}

seedDatabase();
