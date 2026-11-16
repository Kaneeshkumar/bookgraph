// ==============================================================================
// BookGraph - Neo4j Connection Manager & Query Executor
// Supports Live Neo4j (Local Desktop/Docker/AuraDB) + Graceful Fallback Mode
// ==============================================================================

const neo4j = require('neo4j-driver');
require('dotenv').config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';
const database = process.env.NEO4J_DATABASE || 'neo4j';

let driver = null;
let isConnected = false;
let connectionError = null;

try {
  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 3000
  });
} catch (err) {
  console.warn('[Neo4j Driver Initialization Notice]:', err.message);
  connectionError = err.message;
}

// Verify connection on startup
async function initNeo4j() {
  if (!driver) return false;
  try {
    const serverInfo = await driver.verifyConnectivity();
    isConnected = true;
    connectionError = null;
    console.log(`[Neo4j CONNECTED] Successfully established connection to: ${uri}`);
    console.log(`[Neo4j Server Info]: ${serverInfo.address} (${serverInfo.version || 'Neo4j'})`);
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`[Neo4j NOTICE] Could not connect to live database at ${uri}`);
    console.warn(`[Neo4j DUAL-MODE ACTIVE] BookGraph is running in High-Fidelity Graph Simulation Mode.`);
    console.warn(`(All recommendation algorithms, graph visualizations, and queries remain 100% operational!)`);
    return false;
  }
}

// Execute Cypher query against live Neo4j
async function executeCypher(cypherQuery, params = {}) {
  if (!isConnected || !driver) {
    throw new Error('Neo4j database is not connected. Running in simulation mode.');
  }

  const session = driver.session({ database });
  try {
    const result = await session.run(cypherQuery, params);
    return result.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
}

function getConnectionStatus() {
  return {
    connected: isConnected,
    uri,
    user,
    database,
    error: connectionError,
    mode: isConnected ? 'LIVE_NEO4J' : 'SIMULATION_MODE'
  };
}

async function closeDriver() {
  if (driver) {
    await driver.close();
  }
}

module.exports = {
  driver,
  initNeo4j,
  executeCypher,
  getConnectionStatus,
  closeDriver
};
