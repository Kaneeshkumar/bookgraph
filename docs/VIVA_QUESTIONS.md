# BookGraph: 20-Mark Viva Voce Preparation Guide

**Course:** CSAEC59: AEC-NoSQL  
**Department:** Computer Science & Engineering, Ramaiah Institute of Technology  
**Project:** BookGraph - Library Book Recommendation System using Neo4j  
**Students:** Kaneeshkumar G K (1MS24CS075), Kaustubh Nadiger (1MS24CS080), Neville Richard Smith (1MS24CS109)  

---

### **Q1. What type of NoSQL database is Neo4j, and how does it differ from MongoDB or Cassandra?**
**Answer:**
Neo4j is a **Graph Database** based on the **Labeled Property Graph (LPG)** model.
- **MongoDB** is a Document store (hierarchical JSON/BSON documents, best for single entity aggregates).
- **Cassandra** is a Wide-Column store (optimized for high-write throughput and distributed partitioning).
- **Neo4j** treats **relationships as first-class citizens**. Instead of embedding or key lookups, connections between data points are stored as direct physical pointers, making it ideal for highly interconnected data like social networks, fraud detection, and recommendation systems.

---

### **Q2. What is "Index-Free Adjacency" and why does it make Neo4j faster than SQL joins?**
**Answer:**
In an RDBMS (SQL), finding related records requires looking up foreign keys in an index (typically a B-tree costing $O(\log N)$). When joining multiple tables, the query cost grows rapidly with data volume.  
In Neo4j, each node stores direct memory pointers to its adjacent relationships and connected nodes. Traversal is **$O(1)$** per hop—independent of whether the database contains 1,000 nodes or 100,000,000 nodes.

---

### **Q3. Explain the node labels and relationship types used in BookGraph.**
**Answer:**
We modeled four Node labels:
1. `(:Student)`: Properties: `usn`, `name`, `branch`, `sem`, `email`.
2. `(:Book)`: Properties: `id`, `title`, `year`, `isbn`, `pages`.
3. `(:Author)`: Properties: `id`, `name`, `country`.
4. `(:Genre)`: Properties: `id`, `name`, `shelf`.

And four Relationship types:
1. `(Student)-[:BORROWED {borrow_date, return_date, status}]->(Book)`
2. `(Student)-[:RATED {stars, review}]->(Book)`
3. `(Book)-[:WRITTEN_BY]->(Author)`
4. `(Book)-[:BELONGS_TO]->(Genre)`

---

### **Q4. Can you write or explain the Cypher query for Collaborative Recommendation?**
**Answer:**
```cypher
MATCH (me:Student {usn: $usn})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED]->(rec:Book)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
RETURN rec.id AS BookID,
       rec.title AS Title,
       count(DISTINCT peer) AS PeerScore
ORDER BY PeerScore DESC
LIMIT 5;
```
**Explanation:**
1. Hops from `me` to books I borrowed (`shared:Book`).
2. Hops back to other students (`peer:Student`) who also borrowed those same books.
3. Hops forward to books those peers borrowed (`rec:Book`).
4. Filters out books I have already borrowed (`NOT (me)-[:BORROWED]->(rec)`).
5. Ranks recommendations by `count(DISTINCT peer)` (how many peers recommend it).

---

### **Q5. How do you enforce uniqueness and constraints in Neo4j?**
**Answer:**
Using `CREATE CONSTRAINT`:
```cypher
CREATE CONSTRAINT student_usn_unique IF NOT EXISTS
FOR (s:Student) REQUIRE s.usn IS UNIQUE;
```
This guarantees that no two students can share the same USN and automatically generates a fast B-tree index on `s.usn`.

---

### **Q6. What is the difference between `CREATE` and `MERGE` in Cypher?**
**Answer:**
- `CREATE`: Always creates a new node or relationship unconditionally. If run twice, it duplicates data.
- `MERGE`: Acts like an "upsert". It first checks if the pattern exists; if found, it binds to it; if not found, it creates it. It supports `ON CREATE SET` and `ON MATCH SET`. Our seed script uses `MERGE` to remain strictly idempotent.

---

### **Q7. How is Shortest Path ("Degrees of Reading") computed in Neo4j?**
**Answer:**
Neo4j provides built-in graph algorithms like `shortestPath()` using breadth-first search (BFS):
```cypher
MATCH p = shortestPath(
  (s1:Student {usn: '1MS24CS075'})-[:BORROWED*]-(s2:Student {usn: '1MS24CS112'})
)
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence,
       length(p) AS DegreeDistance;
```
This reveals the smallest chain of students and books linking any two college readers.

---

### **Q8. What protocol does the application backend use to talk to Neo4j?**
**Answer:**
We use the **Bolt Protocol** (typically port 7687), which is a binary, multiplexed network protocol designed specifically for high-speed graph queries, authenticated with username and password via `neo4j-driver`.

---

### **Q9. How does Content-Based recommendation differ from Collaborative filtering?**
**Answer:**
- **Collaborative Filtering:** Uses human behavior patterns (who else read what you read). It discovers unexpected cross-genre books based on shared student interests.
- **Content-Based Filtering:** Uses item attributes (Genres and Authors). It computes which genres a student borrows most frequently and recommends unread books within those same categories.

---

### **Q10. What is Degree Centrality and how is it used in the library analytics tab?**
**Answer:**
In graph theory, degree centrality measures the number of incoming or outgoing edges connected to a node.
- **In-Degree of a Book** = number of `(:Student)-[:BORROWED]->(:Book)` edges. The book with the highest in-degree is the most popular book in the college.
- **Out-Degree of a Student** = number of books borrowed by that student. It identifies the most active academic readers in the CSE department.
