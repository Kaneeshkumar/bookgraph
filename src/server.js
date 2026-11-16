// ==============================================================================
// BookGraph - Express Web Server Entry Point
// Graph-Native Library Recommendation System using Neo4j
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initNeo4j, closeDriver } = require('./config/neo4j');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, '../public')));

// Mount API Routes
app.use('/api', apiRoutes);

// Fallback Route for Single Page Experience
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server and Initialize Neo4j Driver
async function startServer() {
  console.log('================================================================');
  console.log('  BookGraph: Library Book Recommendation Platform (Neo4j)');
  console.log('  Graph-Powered Discovery, Circulation & Analytics');
  console.log('================================================================');

  await initNeo4j();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server listening at: http://localhost:${PORT}`);
    console.log(`📊 Graph Visualizer:    http://localhost:${PORT}/#graph`);
    console.log(`💡 Recommendations:     http://localhost:${PORT}/#recommend`);
    console.log(`⚡ Cypher Lab:          http://localhost:${PORT}/#cypher`);
    console.log(`📚 Library Catalog:     http://localhost:${PORT}/#catalog`);
    console.log(`📈 Network Analytics:   http://localhost:${PORT}/#analytics\n`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\nShutting down server gracefully...');
    server.close(async () => {
      await closeDriver();
      console.log('Neo4j driver connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
