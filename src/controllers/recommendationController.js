// ==============================================================================
// BookGraph - Recommendation Engine Controller
// Implements Collaborative Filtering, Content-Based, and Hybrid Graph Algorithms
// ==============================================================================

const mockData = require('../data/mockData');
const { getConnectionStatus, executeCypher } = require('../config/neo4j');

// 1. Collaborative Filtering Recommendation
async function getCollaborativeRecommendations(req, res) {
  const { usn } = req.params;
  const student = mockData.students.find(s => s.usn === usn);

  if (!student) {
    return res.status(404).json({ success: false, message: `Student with USN ${usn} not found.` });
  }

  const cypherQuery = `
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
           count(DISTINCT peer) AS PeerScore,
           collect(DISTINCT peer.name) AS RecommendedByStudents,
           collect(DISTINCT shared.title) AS CommonBooksRead
    ORDER BY PeerScore DESC, Title ASC
    LIMIT 6;
  `;

  try {
    const status = getConnectionStatus();
    if (status.connected) {
      const records = await executeCypher(cypherQuery, { usn });
      return res.json({
        success: true,
        algorithm: 'Collaborative Filtering (Peer Traversal)',
        student,
        cypherQuery,
        recommendations: records
      });
    }

    // High fidelity in-memory graph traversal matching Cypher logic
    const studentBorrows = mockData.borrowed
      .filter(b => b.studentUsn === usn)
      .map(b => b.bookId);

    const bookBorrowMap = {}; // bookId -> [studentUsn]
    mockData.borrowed.forEach(b => {
      if (!bookBorrowMap[b.bookId]) bookBorrowMap[b.bookId] = [];
      bookBorrowMap[b.bookId].push(b.studentUsn);
    });

    // Find peers who read any book the student read
    const peerOverlap = {}; // peerUsn -> [sharedBookIds]
    studentBorrows.forEach(bookId => {
      const readers = bookBorrowMap[bookId] || [];
      readers.forEach(peerUsn => {
        if (peerUsn !== usn) {
          if (!peerOverlap[peerUsn]) peerOverlap[peerUsn] = [];
          peerOverlap[peerUsn].push(bookId);
        }
      });
    });

    // For each peer, find what books they read that student has not read
    const candidateBooks = {}; // bookId -> { peers: Set, sharedBooks: Set }
    Object.keys(peerOverlap).forEach(peerUsn => {
      const peerBorrows = mockData.borrowed
        .filter(b => b.studentUsn === peerUsn)
        .map(b => b.bookId);

      peerBorrows.forEach(recBookId => {
        if (!studentBorrows.includes(recBookId)) {
          if (!candidateBooks[recBookId]) {
            candidateBooks[recBookId] = {
              bookId: recBookId,
              peers: new Set(),
              sharedBooks: new Set()
            };
          }
          candidateBooks[recBookId].peers.add(peerUsn);
          peerOverlap[peerUsn].forEach(sh => candidateBooks[recBookId].sharedBooks.add(sh));
        }
      });
    });

    // Format recommendations
    const recommendations = Object.values(candidateBooks)
      .map(item => {
        const book = mockData.books.find(b => b.id === item.bookId);
        const genre = mockData.genres.find(g => g.id === book.genreId)?.name || 'General';
        const authors = mockData.authors.filter(a => book.authorIds.includes(a.id)).map(a => a.name);
        const peers = Array.from(item.peers).map(pUsn => mockData.students.find(s => s.usn === pUsn)?.name || pUsn);
        const sharedTitles = Array.from(item.sharedBooks).map(shId => mockData.books.find(b => b.id === shId)?.title || shId);

        return {
          BookID: book.id,
          Title: book.title,
          Year: book.year,
          ISBN: book.isbn,
          Authors: authors,
          Genre: genre,
          PeerScore: item.peers.size,
          RecommendedByStudents: peers,
          CommonBooksRead: sharedTitles,
          Reason: `Recommended because ${peers.slice(0, 2).join(' & ')} borrowed it after reading "${sharedTitles[0]}"`
        };
      })
      .sort((a, b) => b.PeerScore - a.PeerScore || a.Title.localeCompare(b.Title))
      .slice(0, 6);

    res.json({
      success: true,
      algorithm: 'Collaborative Filtering (Peer Traversal)',
      student,
      cypherQuery,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 2. Content-Based Recommendation (Genre & Author Affinity)
async function getContentBasedRecommendations(req, res) {
  const { usn } = req.params;
  const student = mockData.students.find(s => s.usn === usn);

  if (!student) {
    return res.status(404).json({ success: false, message: `Student ${usn} not found.` });
  }

  const cypherQuery = `
    MATCH (me:Student {usn: $usn})-[:BORROWED]->(b:Book)-[:BELONGS_TO]->(g:Genre)
    WITH me, g, count(b) AS genreAffinity
    ORDER BY genreAffinity DESC
    LIMIT 2
    MATCH (rec:Book)-[:BELONGS_TO]->(g)
    WHERE NOT (me)-[:BORROWED]->(rec)
    OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
    RETURN rec.id AS BookID,
           rec.title AS Title,
           g.name AS Genre,
           collect(DISTINCT a.name) AS Authors,
           genreAffinity AS AffinityScore
    ORDER BY genreAffinity DESC, rec.year DESC
    LIMIT 6;
  `;

  try {
    const status = getConnectionStatus();
    if (status.connected) {
      const records = await executeCypher(cypherQuery, { usn });
      return res.json({
        success: true,
        algorithm: 'Content-Based Filtering (Genre & Author Affinity)',
        student,
        cypherQuery,
        recommendations: records
      });
    }

    // In-memory graph traversal
    const studentBorrows = mockData.borrowed.filter(b => b.studentUsn === usn).map(b => b.bookId);

    // Calculate genre affinities
    const genreCounts = {};
    studentBorrows.forEach(bId => {
      const book = mockData.books.find(b => b.id === bId);
      if (book) {
        genreCounts[book.genreId] = (genreCounts[book.genreId] || 0) + 1;
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topGenreIds = topGenres.map(g => g[0]);

    const recommendations = mockData.books
      .filter(b => topGenreIds.includes(b.genreId) && !studentBorrows.includes(b.id))
      .map(book => {
        const genre = mockData.genres.find(g => g.id === book.genreId)?.name;
        const authors = mockData.authors.filter(a => book.authorIds.includes(a.id)).map(a => a.name);
        const score = genreCounts[book.genreId] || 1;

        return {
          BookID: book.id,
          Title: book.title,
          Year: book.year,
          ISBN: book.isbn,
          Authors: authors,
          Genre: genre,
          AffinityScore: score,
          Reason: `Matches your strong interest in ${genre} (you borrowed ${score} books in this genre)`
        };
      })
      .sort((a, b) => b.AffinityScore - a.AffinityScore || b.Year - a.Year)
      .slice(0, 6);

    res.json({
      success: true,
      algorithm: 'Content-Based Filtering (Genre & Author Affinity)',
      student,
      cypherQuery,
      topFavoriteGenres: topGenres.map(g => ({
        genre: mockData.genres.find(gen => gen.id === g[0])?.name,
        borrows: g[1]
      })),
      recommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 3. Hybrid Recommendation (Collaborative Overlap + Average Rating)
async function getHybridRecommendations(req, res) {
  const { usn } = req.params;
  const student = mockData.students.find(s => s.usn === usn);

  if (!student) {
    return res.status(404).json({ success: false, message: `Student ${usn} not found.` });
  }

  const cypherQuery = `
    MATCH (me:Student {usn: $usn})-[:BORROWED]->(:Book)<-[:BORROWED]-(peer:Student)
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
           rec.title AS Title,
           authors AS Authors,
           genre AS Genre,
           peerSupport AS PeerSupport,
           round(avgRating, 1) AS AvgRating,
           round((peerSupport * 1.5) + (avgRating * 1.0), 2) AS HybridScore
    ORDER BY HybridScore DESC, peerSupport DESC
    LIMIT 6;
  `;

  try {
    const studentBorrows = mockData.borrowed.filter(b => b.studentUsn === usn).map(b => b.bookId);

    // Get candidate collaborative books
    const candidateBooks = {};
    mockData.borrowed.forEach(b => {
      if (b.studentUsn !== usn && !studentBorrows.includes(b.bookId)) {
        // check if peer has shared borrow
        const peerBorrows = mockData.borrowed.filter(pb => pb.studentUsn === b.studentUsn).map(pb => pb.bookId);
        const hasOverlap = peerBorrows.some(pbId => studentBorrows.includes(pbId));
        if (hasOverlap) {
          if (!candidateBooks[b.bookId]) candidateBooks[b.bookId] = new Set();
          candidateBooks[b.bookId].add(b.studentUsn);
        }
      }
    });

    // If candidate list is small, also bring in top-rated unread books
    mockData.books.forEach(b => {
      if (!studentBorrows.includes(b.id) && !candidateBooks[b.id]) {
        candidateBooks[b.id] = new Set();
      }
    });

    const recommendations = Object.entries(candidateBooks)
      .map(([bookId, peersSet]) => {
        const book = mockData.books.find(b => b.id === bookId);
        const genre = mockData.genres.find(g => g.id === book?.genreId)?.name || 'General';
        const authors = mockData.authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);

        const ratings = mockData.rated.filter(r => r.bookId === bookId);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
          : 4.0;

        const peerCount = peersSet.size;
        const hybridScore = Number(((peerCount * 1.5) + (avgRating * 1.0)).toFixed(2));

        return {
          BookID: book?.id,
          Title: book?.title,
          Year: book?.year,
          ISBN: book?.isbn,
          Authors: authors,
          Genre: genre,
          PeerSupport: peerCount,
          AvgRating: Number(avgRating.toFixed(1)),
          RatingsCount: ratings.length,
          HybridScore: hybridScore,
          Reason: `Weighted score based on ${peerCount} peer recommendation(s) + ${avgRating.toFixed(1)}★ rating`
        };
      })
      .filter(item => item.PeerSupport > 0 || item.AvgRating >= 4.5)
      .sort((a, b) => b.HybridScore - a.HybridScore)
      .slice(0, 6);

    res.json({
      success: true,
      algorithm: 'Hybrid Filtering (Collaborative + Rating Quality)',
      student,
      cypherQuery,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 4. Degrees of Reading / Shortest Path between Two Students
async function getDegreesOfReading(req, res) {
  const { student1, student2 } = req.query;

  const s1 = mockData.students.find(s => s.usn === student1);
  const s2 = mockData.students.find(s => s.usn === student2);

  if (!s1 || !s2) {
    return res.status(400).json({ success: false, message: 'Please provide valid student USNs.' });
  }

  const cypherQuery = `
    MATCH p = shortestPath(
      (s1:Student {usn: $student1})-[:BORROWED*]-(s2:Student {usn: $student2})
    )
    RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS ConnectionPath,
           length(p) AS DegreeDistance;
  `;

  try {
    // Breadth-First-Search to find shortest path in bipartite student-book graph
    const queue = [[{ type: 'Student', id: s1.usn, name: s1.name }]];
    const visited = new Set([s1.usn]);
    let foundPath = null;

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const lastNode = currentPath[currentPath.length - 1];

      if (lastNode.type === 'Student' && lastNode.id === s2.usn) {
        foundPath = currentPath;
        break;
      }

      if (lastNode.type === 'Student') {
        const studentBorrows = mockData.borrowed.filter(b => b.studentUsn === lastNode.id);
        for (const brw of studentBorrows) {
          if (!visited.has(brw.bookId)) {
            visited.add(brw.bookId);
            const bookObj = mockData.books.find(b => b.id === brw.bookId);
            queue.push([...currentPath, { type: 'Book', id: brw.bookId, name: bookObj?.title || brw.bookId }]);
          }
        }
      } else {
        // Book -> find readers
        const bookReaders = mockData.borrowed.filter(b => b.bookId === lastNode.id);
        for (const brw of bookReaders) {
          if (!visited.has(brw.studentUsn)) {
            visited.add(brw.studentUsn);
            const studObj = mockData.students.find(s => s.usn === brw.studentUsn);
            queue.push([...currentPath, { type: 'Student', id: brw.studentUsn, name: studObj?.name || brw.studentUsn }]);
          }
        }
      }
    }

    res.json({
      success: true,
      student1: s1,
      student2: s2,
      cypherQuery,
      path: foundPath,
      distance: foundPath ? foundPath.length - 1 : null
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
  getHybridRecommendations,
  getDegreesOfReading
};
