// ==============================================================================
// BookGraph - API Routes Definition
// ==============================================================================

const express = require('express');
const router = express.Router();

const { getConnectionStatus } = require('../config/neo4j');
const graphController = require('../controllers/graphController');
const libraryController = require('../controllers/libraryController');
const recommendationController = require('../controllers/recommendationController');
const cypherController = require('../controllers/cypherController');

// 1. System & Connection Status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    system: 'BookGraph - Library Recommendation Platform',
    institution: 'Ramaiah Institute of Technology (RIT)',
    department: 'Computer Science & Engineering',
    course: 'CSAEC59: AEC-NoSQL (20-Mark Component)',
    databaseStatus: getConnectionStatus()
  });
});

// 2. Graph Visualizer Endpoints
router.get('/graph', graphController.getFullGraph);
router.get('/graph/stats', graphController.getGraphStats);

// 3. Library Management Endpoints
router.get('/books', libraryController.getBooks);
router.get('/students', libraryController.getStudents);
router.post('/library/borrow', libraryController.borrowBook);
router.post('/library/rate', libraryController.rateBook);
router.post('/library/return', libraryController.returnBook);

// 4. Recommendation Engine Endpoints
router.get('/recommendations/collaborative/:usn', recommendationController.getCollaborativeRecommendations);
router.get('/recommendations/content/:usn', recommendationController.getContentBasedRecommendations);
router.get('/recommendations/hybrid/:usn', recommendationController.getHybridRecommendations);
router.get('/recommendations/degrees', recommendationController.getDegreesOfReading);

// 5. Cypher Query Runner Endpoints
router.get('/cypher/predefined', cypherController.getPredefinedQueries);
router.post('/cypher/run', cypherController.runCypher);

module.exports = router;
