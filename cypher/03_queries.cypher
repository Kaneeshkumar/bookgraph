// ==============================================================================
// BookGraph - Library Book Recommendation System
// CSAEC59: AEC-NoSQL (Ramaiah Institute of Technology, Bangalore)
// Script 03: Complete Cypher Query Suite for Evaluation & Report
// ==============================================================================

// ==============================================================================
// PART 1: CORE / BASIC LIBRARY QUERIES
// ==============================================================================

// 1.1 List all books borrowed by a specific student (e.g. Student 1MS24CS075)
// Parameters: $usn = '1MS24CS075'
MATCH (s:Student {usn: '1MS24CS075'})-[rel:BORROWED]->(b:Book)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       rel.borrow_date AS BorrowDate,
       rel.status AS Status
ORDER BY rel.borrow_date DESC;

// 1.2 Find all books written by a specific author
// Parameters: $authorName = 'Robert C. Martin'
MATCH (a:Author {name: 'Robert C. Martin'})<-[:WRITTEN_BY]-(b:Book)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID,
       b.title AS Title,
       b.year AS YearPublished,
       g.name AS Genre
ORDER BY b.year DESC;

// 1.3 Find all books belonging to a specific genre
// Parameters: $genreName = 'Database & Distributed Systems'
MATCH (g:Genre {name: 'Database & Distributed Systems'})<-[:BELONGS_TO]-(b:Book)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(a.name) AS Authors,
       b.year AS Year
ORDER BY b.title ASC;

// 1.4 Top Most Borrowed Books (Popularity / Degree Centrality)
MATCH (b:Book)<-[r:BORROWED]-(s:Student)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       count(r) AS BorrowCount
ORDER BY BorrowCount DESC
LIMIT 5;

// ==============================================================================
// PART 2: RECOMMENDATION ALGORITHMS
// ==============================================================================

// 2.1 Collaborative Filtering Recommendation
// Logic: (Student A) -> (Shared Book) <- (Peer Student) -> (Recommended Book)
// Where Student A has NOT yet borrowed the Recommended Book.
// Parameter: $usn = '1MS24CS075'
MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED]->(rec:Book)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
RETURN rec.id AS BookID,
       rec.title AS RecommendedBook,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       count(DISTINCT peer) AS RecommendedByPeerCount,
       collect(DISTINCT peer.name) AS RecommendedByStudents,
       collect(DISTINCT shared.title) AS BasedOnCommonBooksRead
ORDER BY RecommendedByPeerCount DESC, rec.title ASC
LIMIT 5;

// 2.2 Content-Based Recommendation: Top Genres Read by Student
// Logic: Identify genres the student reads most often, recommend unread books in those genres.
// Parameter: $usn = '1MS24CS075'
MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(:Book)-[:BELONGS_TO]->(g:Genre)
WITH me, g, count(*) AS genreScore
ORDER BY genreScore DESC
LIMIT 2
MATCH (rec:Book)-[:BELONGS_TO]->(g)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
RETURN rec.id AS BookID,
       rec.title AS RecommendedBook,
       g.name AS Genre,
       collect(DISTINCT a.name) AS Authors,
       genreScore AS GenreAffinityScore
ORDER BY genreScore DESC, rec.year DESC
LIMIT 5;

// 2.3 Content-Based Recommendation: Favorite Authors
// Logic: Find authors whose books the student has borrowed, suggest other works by those authors.
// Parameter: $usn = '1MS24CS075'
MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(:Book)-[:WRITTEN_BY]->(a:Author)
MATCH (rec:Book)-[:WRITTEN_BY]->(a)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
RETURN rec.id AS BookID,
       rec.title AS RecommendedBook,
       a.name AS Author,
       g.name AS Genre
ORDER BY rec.year DESC;

// 2.4 Hybrid Recommendation (Collaborative Overlap + Rating Score)
// Logic: Combine peer borrowing frequency with average student rating for high precision.
MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(:Book)<-[:BORROWED]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED]->(rec:Book)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (allRaters:Student)-[rate:RATED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
WITH rec,
     count(DISTINCT peer) AS peerSupport,
     avg(coalesce(rate.stars, 3.5)) AS avgRating,
     collect(DISTINCT a.name) AS authors,
     g.name AS genre
RETURN rec.id AS BookID,
       rec.title AS RecommendedBook,
       authors AS Authors,
       genre AS Genre,
       peerSupport,
       round(avgRating, 1) AS AvgRating,
       round((peerSupport * 1.5) + (avgRating * 1.0), 2) AS HybridScore
ORDER BY HybridScore DESC, peerSupport DESC
LIMIT 5;

// ==============================================================================
// PART 3: ADVANCED GRAPH ANALYTICS & INSIGHTS
// ==============================================================================

// 3.1 Degrees of Reading / Shortest Path Between Two Students
// Finds how Student 1 (1MS24CS075) and Sneha Patel (1MS24CS112) are connected via shared books.
MATCH p = shortestPath(
  (s1:Student {usn: '1MS24CS075'})-[:BORROWED*]-(s2:Student {usn: '1MS24CS112'})
)
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS ConnectionPath,
       length(p) AS DegreeDistance;

// 3.2 Most Active Readers in the Library
MATCH (s:Student)-[r:BORROWED]->(b:Book)
RETURN s.usn AS USN,
       s.name AS StudentName,
       s.branch AS Branch,
       count(r) AS TotalBooksBorrowed
ORDER BY TotalBooksBorrowed DESC
LIMIT 5;

// 3.3 Most Popular Genres Across College CSE Department
MATCH (s:Student)-[:BORROWED]->(b:Book)-[:BELONGS_TO]->(g:Genre)
RETURN g.name AS GenreName,
       count(b) AS TotalBorrows,
       count(DISTINCT s) AS UniqueStudentsReading
ORDER BY TotalBorrows DESC;

// 3.4 Average Rating and Review Count per Book
MATCH (b:Book)
OPTIONAL MATCH (b)<-[r:RATED]-(s:Student)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       count(r) AS RatingsCount,
       coalesce(round(avg(r.stars), 1), 0.0) AS AverageStars
ORDER BY AverageStars DESC, RatingsCount DESC;

// ==============================================================================
// PART 4: LIBRARY MUTATION TRANSACTIONS (CRUD)
// ==============================================================================

// 4.1 Borrow a Book (Transactional edge creation)
// Parameters: $usn, $bookId, $todayDate, $dueDate
MATCH (s:Student {usn: '1MS24CS075'})
MATCH (b:Book {id: 'BK03'})
MERGE (s)-[r:BORROWED]->(b)
ON CREATE SET r.borrow_date = '2026-11-16',
              r.return_date = '2026-12-01',
              r.status = 'ACTIVE'
RETURN s.name AS Student, b.title AS BorrowedBook, r.status AS Status;

// 4.2 Rate a Book
// Parameters: $usn, $bookId, $stars, $review
MATCH (s:Student {usn: '1MS24CS075'})
MATCH (b:Book {id: 'BK03'})
MERGE (s)-[r:RATED]->(b)
SET r.stars = 5,
    r.review = 'Remarkable architectural clarity!'
RETURN s.name AS Student, b.title AS Book, r.stars AS Stars;

// 4.3 Return a Borrowed Book
MATCH (s:Student {usn: '1MS24CS075'})-[r:BORROWED {status: 'ACTIVE'}]->(b:Book {id: 'BK04'})
SET r.status = 'RETURNED',
    r.actual_return_date = '2026-11-16'
RETURN s.name AS Student, b.title AS ReturnedBook, r.status AS NewStatus;
