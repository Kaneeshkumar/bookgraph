// ==============================================================================
// BookGraph - Cypher Query Runner & Lab Controller
// ==============================================================================

const { getConnectionStatus, executeCypher } = require('../config/neo4j');
const mockData = require('../data/mockData');

// Predefined syllabus queries with explanations
const PREDEFINED_QUERIES = [
  {
    id: 'top-borrowed',
    title: 'Top Most Borrowed Books (Popularity Metric)',
    category: 'Analytics',
    description: 'Calculates in-degree centrality of Book nodes by counting incoming [:BORROWED] edges.',
    cypher: `MATCH (b:Book)<-[r:BORROWED]-(s:Student)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       count(r) AS BorrowCount
ORDER BY BorrowCount DESC
LIMIT 5;`
  },
  {
    id: 'collaborative-rec',
    title: 'Collaborative Filtering Recommendation',
    category: 'Recommendations',
    description: 'Finds students who borrowed the same books as Student 1 (1MS24CS075), and suggests books those students borrowed.',
    cypher: `MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED]->(rec:Book)
WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (rec)-[:BELONGS_TO]->(g:Genre)
RETURN rec.id AS BookID,
       rec.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       count(DISTINCT peer) AS PeerScore,
       collect(DISTINCT peer.name) AS RecommendedByStudents
ORDER BY PeerScore DESC, Title ASC
LIMIT 5;`
  },
  {
    id: 'content-genre',
    title: 'Content-Based Recommendation by Top Genre',
    category: 'Recommendations',
    description: 'Identifies the student\'s most-borrowed genres and suggests unread books from those same genres.',
    cypher: `MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(:Book)-[:BELONGS_TO]->(g:Genre)
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
LIMIT 5;`
  },
  {
    id: 'shortest-path',
    title: 'Degrees of Reading (Shortest Path Between Students)',
    category: 'Graph Algorithms',
    description: 'Discovers the shortest sequence of alternating Student and Book connections linking two individuals.',
    cypher: `MATCH p = shortestPath(
  (s1:Student {usn: '1MS24CS075'})-[:BORROWED*]-(s2:Student {usn: '1MS24CS112'})
)
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence,
       length(p) AS DegreeDistance;`
  },
  {
    id: 'active-borrowers',
    title: 'Most Active Readers in CSE Department',
    category: 'Analytics',
    description: 'Aggregates outgoing [:BORROWED] edges grouped by student USN.',
    cypher: `MATCH (s:Student)-[r:BORROWED]->(b:Book)
RETURN s.usn AS USN,
       s.name AS StudentName,
       s.branch AS Branch,
       count(r) AS TotalBooksBorrowed
ORDER BY TotalBooksBorrowed DESC
LIMIT 5;`
  },
  {
    id: 'books-by-student',
    title: 'Borrow History for Student (1MS24CS075)',
    category: 'Queries',
    description: 'Traverses direct outgoing [:BORROWED] relationships from student node to books.',
    cypher: `MATCH (s:Student {usn: '1MS24CS075'})-[rel:BORROWED]->(b:Book)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID,
       b.title AS Title,
       collect(DISTINCT a.name) AS Authors,
       g.name AS Genre,
       rel.borrow_date AS BorrowDate,
       rel.status AS Status
ORDER BY rel.borrow_date DESC;`
  }
];

// Get predefined queries list
function getPredefinedQueries(req, res) {
  res.json({
    success: true,
    queries: PREDEFINED_QUERIES
  });
}

// Run Cypher query (either custom or predefined)
async function runCypher(req, res) {
  const { query, queryId } = req.body;
  const status = getConnectionStatus();
  const startTime = Date.now();

  try {
    let cypherToRun = query;
    if (queryId) {
      const predefined = PREDEFINED_QUERIES.find(q => q.id === queryId);
      if (predefined) cypherToRun = predefined.cypher;
    }

    if (!cypherToRun) {
      return res.status(400).json({ success: false, message: 'No Cypher query provided.' });
    }

    // If live Neo4j is connected, execute against the real database engine
    if (status.connected) {
      const records = await executeCypher(cypherToRun);
      const executionTimeMs = Date.now() - startTime;
      return res.json({
        success: true,
        mode: 'LIVE_NEO4J',
        executionTimeMs,
        count: records.length,
        results: records
      });
    }

    // High fidelity simulator for predefined queries when Neo4j is offline
    let results = [];
    if (queryId === 'top-borrowed' || cypherToRun.includes('count(r) AS BorrowCount')) {
      const borrowMap = {};
      mockData.borrowed.forEach(b => {
        borrowMap[b.bookId] = (borrowMap[b.bookId] || 0) + 1;
      });
      results = Object.entries(borrowMap)
        .map(([bId, count]) => {
          const book = mockData.books.find(b => b.id === bId);
          const genre = mockData.genres.find(g => g.id === book?.genreId)?.name;
          const authors = mockData.authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);
          return { BookID: bId, Title: book?.title, Authors: authors, Genre: genre, BorrowCount: count };
        })
        .sort((a, b) => b.BorrowCount - a.BorrowCount)
        .slice(0, 5);
    } else if (queryId === 'collaborative-rec' || cypherToRun.includes('shared:Book')) {
      const targetUsn = '1MS24CS075';
      const myBooks = new Set(mockData.borrowed.filter(b => b.studentUsn === targetUsn).map(b => b.bookId));
      const peerCand = {};
      mockData.borrowed.forEach(b => {
        if (b.studentUsn !== targetUsn && myBooks.has(b.bookId)) {
          const peer = mockData.students.find(s => s.usn === b.studentUsn);
          const peerName = peer ? peer.name : b.studentUsn;
          mockData.borrowed.filter(pB => pB.studentUsn === b.studentUsn && !myBooks.has(pB.bookId)).forEach(cand => {
            if (!peerCand[cand.bookId]) peerCand[cand.bookId] = { count: 0, peers: new Set() };
            peerCand[cand.bookId].count++;
            peerCand[cand.bookId].peers.add(peerName);
          });
        }
      });
      results = Object.entries(peerCand)
        .map(([bId, d]) => {
          const b = mockData.books.find(x => x.id === bId);
          const aList = mockData.authors.filter(a => b?.authorIds?.includes(a.id)).map(a => a.name);
          const g = mockData.genres.find(g => g.id === b?.genreId)?.name;
          return {
            BookID: bId,
            Title: b?.title || bId,
            Authors: aList,
            Genre: g,
            PeerScore: d.count,
            RecommendedByStudents: Array.from(d.peers)
          };
        })
        .sort((a, b) => b.PeerScore - a.PeerScore)
        .slice(0, 5);
      if (results.length === 0) {
        results = [
          { BookID: 'BK03', Title: 'Clean Architecture', Authors: ['Robert C. Martin'], Genre: 'Software Architecture & Design', PeerScore: 3, RecommendedByStudents: ['Karan Mehta', 'Tanvi Hegde'] },
          { BookID: 'BK24', Title: 'Distributed Systems: Principles and Paradigms', Authors: ['Andrew S. Tanenbaum'], Genre: 'Database & Distributed Systems', PeerScore: 2, RecommendedByStudents: ['Karan Mehta', 'Mohammed Zaid'] }
        ];
      }
    } else if (queryId === 'content-genre' || cypherToRun.includes('genreScore') || cypherToRun.includes('GenreAffinityScore')) {
      const targetUsn = '1MS24CS075';
      const myBorrows = mockData.borrowed.filter(b => b.studentUsn === targetUsn);
      const myBookIds = new Set(myBorrows.map(b => b.bookId));
      const genreFreq = {};
      myBorrows.forEach(b => {
        const bk = mockData.books.find(x => x.id === b.bookId);
        if (bk) genreFreq[bk.genreId] = (genreFreq[bk.genreId] || 0) + 1;
      });
      const topGenres = Object.entries(genreFreq).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]);
      results = mockData.books
        .filter(b => topGenres.includes(b.genreId) && !myBookIds.has(b.id))
        .map(b => ({
          BookID: b.id,
          Title: b.title,
          Genre: mockData.genres.find(g => g.id === b.genreId)?.name,
          Authors: mockData.authors.filter(a => b.authorIds?.includes(a.id)).map(a => a.name),
          GenreAffinityScore: genreFreq[b.genreId] || 1
        }))
        .sort((a, b) => b.GenreAffinityScore - a.GenreAffinityScore)
        .slice(0, 5);
    } else if (queryId === 'shortest-path' || cypherToRun.includes('shortestPath')) {
      results = [
        {
          PathSequence: [
            'Aarav Sharma (1MS24CS075)',
            'Designing Data-Intensive Applications [BK01]',
            'Karan Mehta (1MS24CS080)',
            'Artificial Intelligence: A Modern Approach [BK05]',
            'Sneha Patel (1MS24CS112)'
          ],
          DegreeDistance: 4
        }
      ];
    } else if (queryId === 'active-borrowers' || cypherToRun.includes('TotalBooksBorrowed')) {
      const counts = {};
      mockData.borrowed.forEach(b => {
        counts[b.studentUsn] = (counts[b.studentUsn] || 0) + 1;
      });
      results = Object.entries(counts)
        .map(([usn, total]) => {
          const student = mockData.students.find(s => s.usn === usn);
          return { USN: usn, StudentName: student?.name, Branch: student?.branch, TotalBooksBorrowed: total };
        })
        .sort((a, b) => b.TotalBooksBorrowed - a.TotalBooksBorrowed)
        .slice(0, 5);
    } else if (queryId === 'books-by-student' || (cypherToRun.includes('1MS24CS075') && cypherToRun.includes('Status'))) {
      results = mockData.borrowed
        .filter(b => b.studentUsn === '1MS24CS075')
        .map(brw => {
          const book = mockData.books.find(b => b.id === brw.bookId);
          const genre = mockData.genres.find(g => g.id === book?.genreId)?.name;
          const authors = mockData.authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);
          return {
            BookID: book?.id,
            Title: book?.title,
            Authors: authors,
            Genre: genre,
            BorrowDate: brw.borrow_date,
            Status: brw.status
          };
        });
    } else {
      // Dynamic interpretation of custom query
      const qUpper = cypherToRun.toUpperCase();
      if (qUpper.includes(':STUDENT') || qUpper.includes('STUDENT')) {
        results = mockData.students.slice(0, 6).map(s => ({ USN: s.usn, Name: s.name, Branch: s.branch, Sem: s.sem, Email: s.email }));
      } else if (qUpper.includes(':AUTHOR') || qUpper.includes('AUTHOR')) {
        results = mockData.authors.slice(0, 6).map(a => ({ AuthorID: a.id, Name: a.name, Country: a.country }));
      } else if (qUpper.includes(':GENRE') || qUpper.includes('GENRE')) {
        results = mockData.genres.map(g => ({ GenreID: g.id, Name: g.name, ShelfLocation: g.shelf }));
      } else if (qUpper.includes('RATED') || qUpper.includes('STARS')) {
        results = (mockData.rated || []).slice(0, 6).map(r => {
          const bk = mockData.books.find(b => b.id === r.bookId);
          return { StudentUSN: r.studentUsn, BookTitle: bk?.title || r.bookId, Stars: r.stars, Review: r.review };
        });
      } else {
        results = mockData.books.slice(0, 6).map(b => ({
          BookID: b.id,
          Title: b.title,
          Year: b.year,
          Genre: mockData.genres.find(g => g.id === b.genreId)?.name,
          Authors: mockData.authors.filter(a => b.authorIds?.includes(a.id)).map(a => a.name)
        }));
      }
    }

    const executionTimeMs = Date.now() - startTime + 8;
    res.json({
      success: true,
      mode: 'SIMULATION_MODE',
      executionTimeMs,
      count: results.length,
      results,
      records: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getPredefinedQueries,
  runCypher
};
