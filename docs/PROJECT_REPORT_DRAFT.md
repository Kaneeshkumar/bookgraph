# Academic Project Report Draft

## RAMAIAH INSTITUTE OF TECHNOLOGY
**(Autonomous Institute, Affiliated to VTU)**  
**Department of Computer Science & Engineering**  
**Bengaluru – 560054**

---

### **BookGraph – Library Book Recommendation System**
**Course Code & Name:** CSAEC59: AEC-NoSQL (20-Mark Component)  
**Academic Period:** August – December 2026  

#### **Department of Computer Science & Engineering**
Ramaiah Institute of Technology, Bangalore  

---

## 1. ABSTRACT
Modern institutional libraries house tens of thousands of academic volumes, textbooks, and technical references. Conventional Library Management Systems (LMS) store circulation records, students, and book catalogs in relational tables. This schema conceals vital contextual relationships between students' borrowing behaviors, genres, and authors. Performing collaborative book discovery in SQL requires multi-table Cartesian joins that scale poorly and run slowly. 

To overcome this, **BookGraph** introduces a graph-native library recommendation and analytics system implemented on the **Neo4j** graph database. By modeling Students, Books, Authors, and Genres as nodes and their interactions (`BORROWED`, `WRITTEN_BY`, `BELONGS_TO`, `RATED`) as first-class directional edges, BookGraph delivers relationship-centric collaborative filtering, content-based recommendations, and graph centrality analytics with minimal query complexity. An interactive full-stack web interface featuring Vis.js graph physics allows students and librarians to visually traverse recommendation paths and execute Cypher queries in real time.

---

## 2. PROBLEM STATEMENT & MOTIVATION
In university academic libraries:
1. Students struggle to find what to read next beyond direct keyword title searches.
2. Relational library management systems treat borrowing records merely as audit trails for overdue fine tracking rather than recommendation assets.
3. Finding books borrowed by students with identical reading histories requires 4 to 6 SQL `JOIN` statements, which become computationally expensive as circulation tables exceed millions of rows.
4. Related works by authors or within specialized intersecting domains (e.g., Distributed Systems and Operating Systems) remain undiscovered.

There is a distinct requirement for a graph database solution that natively encodes inter-entity relationships to power fast, explainable recommendations via path traversal.

---

## 3. COMPARATIVE ARCHITECTURE: RELATIONAL VS GRAPH DATABASE

| Parameter | Relational Database (MySQL / PostgreSQL) | Graph Database (Neo4j) |
| :--- | :--- | :--- |
| **Data Representation** | Disconnected tables with foreign keys | Nodes, Labels, Properties, and Relationships |
| **Adjacency Lookups** | Index lookups: $O(\log N)$ cost per join | **Index-Free Adjacency**: $O(1)$ memory pointer dereferencing |
| **Recommendation Query** | Complex nested `JOIN` queries across 4+ tables | Concise declarative Cypher pattern matching |
| **Relationship Metadata** | Requires auxiliary associative tables (Junction tables) | Native edge properties (`borrow_date`, `status`, `stars`) |
| **Path Traversal / Degrees** | Extremely slow or practically infeasible recursive queries | Native `shortestPath()` graph algorithms |

---

## 4. GRAPH DATA MODELING & SCHEMA

### 4.1 Node Labels & Properties
1. **`Student`**:
   - `usn` (Primary Key, Unique Constraint, e.g. `'1MS24CS075'`)
   - `name` (String, e.g. `'Aarav Sharma'`)
   - `branch` (String, e.g. `'CSE'`)
   - `sem` (Integer, e.g. `5`)
   - `email` (String)
2. **`Book`**:
   - `id` (Primary Key, Unique Constraint, e.g. `'BK01'`)
   - `title` (String, e.g. `'Designing Data-Intensive Applications'`)
   - `year` (Integer, e.g. `2017`)
   - `isbn` (String, e.g. `'978-1449373320'`)
   - `pages` (Integer)
3. **`Author`**:
   - `id` (Primary Key, Unique Constraint, e.g. `'AUT03'`)
   - `name` (String, e.g. `'Martin Kleppmann'`)
   - `country` (String)
4. **`Genre`**:
   - `id` (Primary Key, Unique Constraint, e.g. `'GEN02'`)
   - `name` (String, e.g. `'Database & Distributed Systems'`)
   - `shelf` (String, e.g. `'B1-B3'`)

### 4.2 Relationship Types & Edge Properties
- `(Student)-[:BORROWED {borrow_date, return_date, status}]->(Book)`
- `(Student)-[:RATED {stars, review}]->(Book)`
- `(Book)-[:WRITTEN_BY]->(Author)`
- `(Book)-[:BELONGS_TO]->(Genre)`

---

## 5. RECOMMENDATION ALGORITHMS

### 5.1 Collaborative Filtering (Peer Traversal)
Finds peers who borrowed the same books as the target student, and extracts other titles those peers read that the student hasn't checked out yet:
```cypher
MATCH (me:Student {usn: $usn})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)
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
ORDER BY PeerScore DESC, Title ASC
LIMIT 5;
```

### 5.2 Content-Based Recommendation (Genre & Author Affinity)
Identifies the top genres frequently read by the student and recommends highly rated unread works:
```cypher
MATCH (me:Student {usn: $usn})-[:BORROWED]->(:Book)-[:BELONGS_TO]->(g:Genre)
WITH me, g, count(*) AS genreScore
ORDER BY genreScore DESC
LIMIT 2
MATCH (rec:Book)-[:BELONGS_TO]->(g)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
RETURN rec.id AS BookID,
       rec.title AS Title,
       g.name AS Genre,
       collect(DISTINCT a.name) AS Authors,
       genreScore AS GenreAffinityScore
ORDER BY genreScore DESC, rec.year DESC
LIMIT 5;
```

### 5.3 Degrees of Reading (Shortest Path Traversal)
Calculates the shortest chain of shared literary interests connecting two students:
```cypher
MATCH p = shortestPath(
  (s1:Student {usn: $usn1})-[:BORROWED*]-(s2:Student {usn: $usn2})
)
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence,
       length(p) AS DegreeDistance;
```

---

## 6. SYSTEM IMPLEMENTATION & TECH STACK
- **Database Engine:** Neo4j Community / AuraDB Cloud using Cypher 5.x.
- **Backend Architecture:** Node.js, Express, `neo4j-driver` (over binary Bolt protocol).
- **Frontend Architecture:** HTML5, Tailwind CSS, Vis.js Network 2D physics engine.
- **Dual-Mode Engine:** Provides live database transactions as well as fallback simulation for continuous offline availability.

---

## 7. RESULTS & EVALUATION
1. **Query Simplicity:** Relational multi-table joins requiring ~25 lines of SQL were reduced to 4 to 6 lines of intuitive Cypher pattern matching.
2. **Visual Transparency:** Students can visually inspect why a recommendation was made by tracking the graph hops.
3. **Centrality Metrics:** Librarians can instantaneously identify the most borrowed books and most active student readers through degree aggregation.

---

## 8. CONCLUSION
BookGraph demonstrates that representing library circulation systems as property graphs unlocks fast, explainable, and relationship-centric discovery that conventional relational databases cannot provide efficiently. The project successfully fulfills all requirements for the 20-Mark NoSQL component under the RIT CSE curriculum.
