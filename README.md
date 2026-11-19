# BookGraph - Library Book Recommendation System

> **A Graph-Native Library Recommendation & Circulation Analytics Platform Built with Neo4j**  

---

## 🌟 Key Features

- **Property Graph Architecture:** Eliminates expensive multi-table relational joins with directed graph traversals connecting `Student`, `Book`, `Author`, and `Genre` nodes.
- **Multiple Graph Recommendation Algorithms:**
  1. **Collaborative Filtering:** $(Student_A) \rightarrow (Book_X) \leftarrow (Peer) \rightarrow (Book_Y)$
  2. **Content-Based Filtering:** Top genres and author affinity scoring.
  3. **Hybrid Quality Score:** Weighted composite scoring combining peer support and rating quality ($1-5\star$).
  4. **Degrees of Reading:** Shortest path BFS traversal between two readers via shared books.
- **Interactive 2D Graph Visualizer:** Built with **Vis.js Network**, featuring color-coded nodes, physics force layout, ego-network filtering, and click-to-inspect properties.
- **📈 Graph Analytics & Centrality Dashboard:**
  - Degree Centrality (most connected books & key literary hubs)
  - Genre circulation metrics with visual progress bars
  - Co-borrowing clusters (books frequently checked out together)
  - Network density, graph diameter, and active loan metrics
- **⚡ Live Cypher Query Lab:** Interactive console with curated queries, custom Cypher editor, execution timing metrics, and dynamic results tables.
- **📚 Library Circulation Operations:** Real-time book checkout (`[:BORROWED]`), rating reviews (`[:RATED]`), and catalog search.
- **Dual-Mode Engine:** Seamlessly connects to live Neo4j (Local, Docker, or Cloud AuraDB) or runs in high-fidelity simulation mode for instant zero-setup demonstrations.

---

## 📁 Repository Structure
```
bookgraph/
├── cypher/
│   ├── 01_schema.cypher        # Constraints, indexes & uniqueness rules
│   ├── 02_seed_data.cypher     # 40 books, 12 students, 18 authors, 8 genres, borrows & ratings
│   └── 03_queries.cypher       # Annotated queries for basic ops, analytics & recommendations
├── src/
│   ├── config/
│   │   └── neo4j.js            # Neo4j driver connection with dual-mode fallback
│   ├── controllers/
│   │   ├── graphController.js  # Node/edge formatting for Vis.js
│   │   ├── recommendationController.js # Collaborative, content, hybrid & shortest path algorithms
│   │   ├── analyticsController.js # Degree centrality, co-borrowing clusters & network metrics
│   │   ├── libraryController.js # Book catalog, borrow, rate, return operations
│   │   └── cypherController.js # Curated queries & custom query runner
│   ├── data/
│   │   └── mockData.js         # In-memory graph data store mirroring the Neo4j schema
│   ├── routes/
│   │   └── api.js              # REST API endpoints
│   ├── scripts/
│   │   └── seedNeo4j.js        # Automated CLI seeder script for live Neo4j
│   └── server.js               # Express application entry point
├── public/
│   ├── index.html              # Modern dashboard with tabbed UI
│   ├── css/
│   │   └── style.css           # Styling & animations
│   └── js/
│       ├── app.js              # Client state, tabs, analytics loader & API caller
│       └── graph-vis.js        # Vis.js network renderer with physics controls
├── docs/
│   ├── ARCHITECTURE.md         # System design, graph data model & query patterns
│   ├── API_REFERENCE.md        # Complete REST API documentation
│   └── SETUP_GUIDE.md          # Setup instructions for Neo4j Aura (Free Cloud), Docker & Desktop
├── package.json
└── .env.example
```

---

## 🚀 Quickstart

### 1. Run Instantly (Zero-Setup Mode)
No database installation or Java required:
```bash
npm install
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Connect to Live Neo4j (Free Cloud Neo4j AuraDB)
1. Create a free database at [https://neo4j.com/cloud/aura-free/](https://neo4j.com/cloud/aura-free/).
2. Copy your URI and password into `.env`:
   ```env
   NEO4J_URI=neo4j+s://<your-instance>.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<your-password>
   ```
3. Seed the database with one command:
   ```bash
   npm run seed
   ```
4. Start the app:
   ```bash
   npm start
   ```

---

## 🌐 Cloud Deployment (Render & Vercel)

BookGraph comes pre-configured for instant 1-click cloud deployment:
- **Render**: Full persistent Express Node.js web service (configured via `render.yaml`).
- **Vercel**: Edge/Serverless deployment (configured via `vercel.json` & `api/index.js`).

For complete step-by-step instructions with environment variable setup, see the **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**.

---

## 📜 License
MIT License.
