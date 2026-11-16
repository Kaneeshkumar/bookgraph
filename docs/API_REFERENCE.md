# BookGraph REST API Reference

The BookGraph Express backend exposes REST endpoints for graph visualization, recommendation generation, library management, and analytics.

---

## 1. System & Health
- **`GET /api/status`**
  - Returns connection status to Neo4j, active database URI, and operational mode (`LIVE_NEO4J` or `SIMULATION_MODE`).

---

## 2. Graph Visualizer
- **`GET /api/graph`**
  - **Query Parameters:**
    - `filterType` (optional): `all`, `student`, `book`, `author`, `genre`
    - `studentUsn` (optional): Filter to a specific student's ego network
  - **Response:** Nodes and edges formatted for Vis.js Network rendering.
- **`GET /api/graph/stats`**
  - Returns node and relationship totals.

---

## 3. Recommendation Engine
- **`GET /api/recommendations/collaborative/:usn`**
  - Computes collaborative filtering recommendations based on peer borrowing overlap.
- **`GET /api/recommendations/content/:usn`**
  - Computes content-based recommendations ranked by student's top borrowed genres.
- **`GET /api/recommendations/hybrid/:usn`**
  - Computes composite weighted recommendation score combining peer support and rating quality.
- **`GET /api/recommendations/degrees?student1=<usn>&student2=<usn>`**
  - Executes shortest path traversal discovering alternating student-book connection chains.

---

## 4. Graph Analytics & Centrality
- **`GET /api/analytics/insights`**
  - Returns:
    - Degree Centrality rankings (top borrowed books & key hubs).
    - Genre circulation distribution and percentages.
    - Co-borrowing clusters (pairs of books read together by the same users).
    - Network graph properties (total nodes, edges, density, average degree).

---

## 5. Library Operations (Circulation)
- **`GET /api/books`**
  - Lists books with search query (`?search=`), genre filter (`?genre=`), and borrow status.
- **`GET /api/students`**
  - Lists all registered student members.
- **`POST /api/library/borrow`**
  - **Body:** `{ "usn": "1MS24CS075", "bookId": "BK01" }`
  - Creates a `[:BORROWED]` relationship edge.
- **`POST /api/library/rate`**
  - **Body:** `{ "usn": "1MS24CS075", "bookId": "BK01", "stars": 5, "review": "Excellent!" }`
  - Creates or updates a `[:RATED]` relationship edge.
- **`POST /api/library/return`**
  - **Body:** `{ "usn": "1MS24CS075", "bookId": "BK01" }`
  - Updates active loan status to `RETURNED`.

---

## 6. Cypher Query Runner
- **`GET /api/cypher/predefined`**
  - Returns curated Cypher queries with descriptions.
- **`POST /api/cypher/run`**
  - **Body:** `{ "query": "MATCH (b:Book) RETURN b.title LIMIT 5" }`
  - Runs raw Cypher against live Neo4j (or simulation engine) and returns execution time, record counts, and JSON rows.
