// ==============================================================================
// BookGraph - Vercel Serverless Function Entry Point
// ==============================================================================

const app = require('../src/server');
const { initNeo4j } = require('../src/config/neo4j');

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    try {
      await initNeo4j();
    } catch (err) {
      // Graceful fallback to High-Fidelity Graph Simulation Mode
    }
    isInitialized = true;
  }
  return app(req, res);
};
