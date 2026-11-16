# BookGraph - Library Book Recommendation System

> **A Graph-Powered Academic Library Recommendation Platform Built with Neo4j**  
> **Course:** CSAEC59: AEC-NoSQL (20-Mark Component)  
> **Institution:** Ramaiah Institute of Technology (Autonomous Institute, Affiliated to VTU), Bangalore  
> **Department:** Department of Computer Science & Engineering  
> **Academic Period:** August – December 2026  

---

### **Project Team**
| Student Name | USN | Branch | Role |
| :--- | :--- | :--- | :--- |
| **Kaneeshkumar G K** | 1MS24CS075 | CSE, Sem 5 | Graph Data Modeling & Collaborative Engine |
| **Kaustubh Nadiger** | 1MS24CS080 | CSE, Sem 5 | Cypher Query Optimization & Backend API |
| **Neville Richard Smith** | 1MS24CS109 | CSE, Sem 5 | Graph Visualization & UI Development |

**Under the Guidance of:**  
**Prof. Akshatha Kamath**, Assistant Professor, Department of Computer Science & Engineering, Ramaiah Institute of Technology

---

## 🌟 Key Highlights
- **Property Graph Model:** Replaces slow multi-table relational joins with directed graph traversals connecting `Student`, `Book`, `Author`, and `Genre` nodes.
- **Multiple Recommendation Algorithms:**
  1. **Collaborative Filtering:** $(Student_A) \rightarrow (Book_X) \leftarrow (Peer) \rightarrow (Book_Y)$
  2. **Content-Based Filtering:** Top genres and favorite authors.
  3. **Hybrid Quality Score:** Weighted score combining peer borrowing overlap with rating stars ($1-5\star$).
  4. **Degrees of Reading:** Shortest path traversal between two students via shared books.
- **Interactive 2D Graph Visualizer:** Built with **Vis.js Network**, featuring color-coded nodes, physics force layout, ego-network filtering, and click-to-inspect properties.
- **Live Cypher Query Lab:** Interactive console with preloaded syllabus queries, custom Cypher editor, execution timing metrics, and dynamic results tables.
- **Library Circulation Operations:** Live book checkout (`[:BORROWED]`), rating reviews (`[:RATED]`), and catalog search.
- **Dual-Mode Engine:** Connects to live Neo4j (Local, Docker, or Cloud AuraDB) or runs in high-fidelity simulation mode for zero-setup demonstrations.

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
│   │   ├── libraryController.js # Book catalog, borrow, rate, return operations
│   │   └── cypherController.js # Predefined syllabus queries & custom query runner
│   ├── data/
│   │   └── mockData.js         # In-memory graph data store mirroring the Neo4j schema
│   ├── routes/
│   │   └── api.js              # REST API endpoints
│   ├── scripts/
│   │   └── seedNeo4j.js        # Automated CLI seeder script for live Neo4j
│   └── server.js               # Express application entry point
├── public/
│   ├── index.html              # Sleek RIT dashboard with tabbed UI
│   ├── css/
│   │   └── style.css           # Styling & animations
│   └── js/
│       ├── app.js              # Client state, tabs, modals & API caller
│       └── graph-vis.js        # Vis.js network renderer with physics controls
├── docs/
│   ├── PROJECT_REPORT_DRAFT.md # Formatted academic report matching RIT/VTU standards
│   ├── VIVA_QUESTIONS.md       # 20-mark viva preparation cheat sheet (10+ technical Q&As)
│   └── SETUP_GUIDE.md          # Setup instructions for Neo4j Aura (Free Cloud), Docker & Desktop
├── package.json
└── .env.example
```

---

## 🚀 Quickstart

### 1. Run Instantly (Simulation Mode)
No database installation or Java required:
```bash
cd scratch/bookgraph
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

## 🧪 Cypher Queries Quick Reference

### Collaborative Filtering
```cypher
MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED]->(rec:Book)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
RETURN rec.id AS BookID,
       rec.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       count(DISTINCT peer) AS PeerScore
ORDER BY PeerScore DESC
LIMIT 5;
```

### Degrees of Reading (Shortest Path)
```cypher
MATCH p = shortestPath(
  (s1:Student {usn: '1MS24CS075'})-[:BORROWED*]-(s2:Student {usn: '1MS24CS112'})
)
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence,
       length(p) AS DegreeDistance;
```

---

## 📜 License
MIT License. Developed for Ramaiah Institute of Technology Department of Computer Science & Engineering.
