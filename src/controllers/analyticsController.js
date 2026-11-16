// ==============================================================================
// BookGraph - Graph Analytics & Network Insights Controller
// Provides Network Centrality, Co-Borrowing Clusters & Domain Metrics
// ==============================================================================

const mockData = require('../data/mockData');
const { getConnectionStatus, executeCypher } = require('../config/neo4j');

function getAnalyticsInsights(req, res) {
  try {
    // 1. Calculate Degree Centrality for Books (Most connected hubs)
    const bookBorrowCounts = {};
    mockData.borrowed.forEach(b => {
      bookBorrowCounts[b.bookId] = (bookBorrowCounts[b.bookId] || 0) + 1;
    });

    const bookRatings = {};
    mockData.rated.forEach(r => {
      if (!bookRatings[r.bookId]) bookRatings[r.bookId] = [];
      bookRatings[r.bookId].push(r.stars);
    });

    const topConnectedBooks = Object.entries(bookBorrowCounts)
      .map(([bookId, borrowCount]) => {
        const book = mockData.books.find(b => b.id === bookId);
        const genre = mockData.genres.find(g => g.id === book?.genreId)?.name || 'General';
        const authors = mockData.authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);
        const ratings = bookRatings[bookId] || [];
        const avgRating = ratings.length > 0
          ? (ratings.reduce((sum, v) => sum + v, 0) / ratings.length).toFixed(1)
          : '4.5';

        return {
          id: bookId,
          title: book?.title || bookId,
          genre,
          authors: authors.join(', '),
          degreeCentrality: borrowCount,
          avgRating,
          ratingsCount: ratings.length
        };
      })
      .sort((a, b) => b.degreeCentrality - a.degreeCentrality)
      .slice(0, 8);

    // 2. Genre Distribution & Share
    const genreDistribution = {};
    mockData.genres.forEach(g => {
      genreDistribution[g.id] = { id: g.id, name: g.name, shelf: g.shelf, count: 0 };
    });

    mockData.borrowed.forEach(b => {
      const book = mockData.books.find(bk => bk.id === b.bookId);
      if (book && genreDistribution[book.genreId]) {
        genreDistribution[book.genreId].count += 1;
      }
    });

    const totalBorrows = mockData.borrowed.length;
    const genreMetrics = Object.values(genreDistribution)
      .map(g => ({
        ...g,
        percentage: totalBorrows > 0 ? Math.round((g.count / totalBorrows) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // 3. Co-Borrowing Frequency (Books read together by the same readers)
    // Build student -> books map
    const studentBooks = {};
    mockData.borrowed.forEach(b => {
      if (!studentBooks[b.studentUsn]) studentBooks[b.studentUsn] = new Set();
      studentBooks[b.studentUsn].add(b.bookId);
    });

    const pairCounts = {};
    Object.values(studentBooks).forEach(booksSet => {
      const arr = Array.from(booksSet);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const key = [arr[i], arr[j]].sort().join('<->');
          pairCounts[key] = (pairCounts[key] || 0) + 1;
        }
      }
    });

    const coBorrowingClusters = Object.entries(pairCounts)
      .map(([pair, count]) => {
        const [id1, id2] = pair.split('<->');
        const b1 = mockData.books.find(b => b.id === id1);
        const b2 = mockData.books.find(b => b.id === id2);
        return {
          book1: b1?.title || id1,
          book2: b2?.title || id2,
          sharedReaders: count,
          clusterStrength: count >= 3 ? 'High' : 'Moderate'
        };
      })
      .sort((a, b) => b.sharedReaders - a.sharedReaders)
      .slice(0, 6);

    // 4. Overall Network Graph Properties
    const totalNodes = mockData.students.length + mockData.books.length + mockData.authors.length + mockData.genres.length;
    // Relationships: Borrowed + Rated + Written_By + Belongs_To
    const writtenByCount = mockData.books.reduce((acc, b) => acc + b.authorIds.length, 0);
    const belongsToCount = mockData.books.length;
    const totalEdges = mockData.borrowed.length + mockData.rated.length + writtenByCount + belongsToCount;
    const avgDegree = Number(((totalEdges * 2) / totalNodes).toFixed(2));
    const density = Number(((2 * totalEdges) / (totalNodes * (totalNodes - 1))).toFixed(4));

    const activeLoans = mockData.borrowed.filter(b => b.status === 'ACTIVE').length;
    const returnedLoans = mockData.borrowed.filter(b => b.status === 'RETURNED').length;

    res.json({
      success: true,
      networkStats: {
        totalNodes,
        totalEdges,
        avgDegree,
        density,
        activeLoans,
        returnedLoans,
        activeLoanRate: Math.round((activeLoans / totalBorrows) * 100)
      },
      topConnectedBooks,
      genreMetrics,
      coBorrowingClusters
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getAnalyticsInsights
};
