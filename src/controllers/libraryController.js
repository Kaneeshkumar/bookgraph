// ==============================================================================
// BookGraph - Library Operations Controller (CRUD & Transactions)
// ==============================================================================

const mockData = require('../data/mockData');
const { getConnectionStatus, executeCypher } = require('../config/neo4j');

// 1. Get all books with enriched author, genre, and borrow status
function getBooks(req, res) {
  const { genre, search } = req.query;

  let filtered = mockData.books;

  if (genre && genre !== 'all') {
    filtered = filtered.filter(b => b.genreId === genre);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  }

  const enriched = filtered.map(b => {
    const genreObj = mockData.genres.find(g => g.id === b.genreId);
    const authorObjs = mockData.authors.filter(a => b.authorIds.includes(a.id));
    const activeLoan = mockData.borrowed.find(br => br.bookId === b.id && br.status === 'ACTIVE');
    const ratings = mockData.rated.filter(r => r.bookId === b.id);
    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1)
      : 'N/A';
    const totalBorrows = mockData.borrowed.filter(br => br.bookId === b.id).length;

    return {
      ...b,
      genreName: genreObj?.name || 'Unassigned',
      shelf: genreObj?.shelf || 'N/A',
      authors: authorObjs.map(a => a.name),
      isAvailable: !activeLoan,
      borrowedBy: activeLoan ? mockData.students.find(s => s.usn === activeLoan.studentUsn)?.name : null,
      avgRating,
      ratingsCount: ratings.length,
      totalBorrows
    };
  });

  res.json({ success: true, count: enriched.length, books: enriched });
}

// 2. Get all students
function getStudents(req, res) {
  const enriched = mockData.students.map(s => {
    const studentBorrows = mockData.borrowed.filter(b => b.studentUsn === s.usn);
    const activeBorrows = studentBorrows.filter(b => b.status === 'ACTIVE');
    const ratedCount = mockData.rated.filter(r => r.studentUsn === s.usn).length;

    return {
      ...s,
      totalBorrows: studentBorrows.length,
      activeLoans: activeBorrows.length,
      ratedCount
    };
  });

  res.json({ success: true, students: enriched });
}

// 3. Borrow a Book
async function borrowBook(req, res) {
  const { usn, bookId } = req.body;

  if (!usn || !bookId) {
    return res.status(400).json({ success: false, message: 'USN and Book ID are required.' });
  }

  const student = mockData.students.find(s => s.usn === usn);
  const book = mockData.books.find(b => b.id === bookId);

  if (!student || !book) {
    return res.status(404).json({ success: false, message: 'Student or Book not found.' });
  }

  // Check if currently active loan exists for this book
  const activeLoan = mockData.borrowed.find(b => b.bookId === bookId && b.status === 'ACTIVE');
  if (activeLoan) {
    return res.status(400).json({
      success: false,
      message: `Book "${book.title}" is already checked out to another student.`
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newBorrow = {
    studentUsn: usn,
    bookId,
    borrow_date: today,
    return_date: dueDate,
    status: 'ACTIVE'
  };

  mockData.borrowed.push(newBorrow);

  // If live Neo4j connected, run Cypher MERGE
  const status = getConnectionStatus();
  if (status.connected) {
    try {
      await executeCypher(`
        MATCH (s:Student {usn: $usn}), (b:Book {id: $bookId})
        CREATE (s)-[r:BORROWED {borrow_date: $borrow_date, return_date: $return_date, status: 'ACTIVE'}]->(b)
        RETURN r
      `, { usn, bookId, borrow_date: today, return_date: dueDate });
    } catch (err) {
      console.error('Neo4j write error:', err.message);
    }
  }

  res.json({
    success: true,
    message: `Successfully borrowed "${book.title}" for ${student.name}`,
    borrow: newBorrow
  });
}

// 4. Rate a Book
async function rateBook(req, res) {
  const { usn, bookId, stars, review } = req.body;

  if (!usn || !bookId || !stars) {
    return res.status(400).json({ success: false, message: 'USN, Book ID, and Stars (1-5) are required.' });
  }

  const student = mockData.students.find(s => s.usn === usn);
  const book = mockData.books.find(b => b.id === bookId);

  if (!student || !book) {
    return res.status(404).json({ success: false, message: 'Student or Book not found.' });
  }

  const existingRating = mockData.rated.find(r => r.studentUsn === usn && r.bookId === bookId);
  if (existingRating) {
    existingRating.stars = parseInt(stars);
    existingRating.review = review || existingRating.review;
  } else {
    mockData.rated.push({
      studentUsn: usn,
      bookId,
      stars: parseInt(stars),
      review: review || ''
    });
  }

  // If live Neo4j connected, run Cypher MERGE
  const status = getConnectionStatus();
  if (status.connected) {
    try {
      await executeCypher(`
        MATCH (s:Student {usn: $usn}), (b:Book {id: $bookId})
        MERGE (s)-[r:RATED]->(b)
        SET r.stars = $stars, r.review = $review
        RETURN r
      `, { usn, bookId, stars: parseInt(stars), review: review || '' });
    } catch (err) {
      console.error('Neo4j rate error:', err.message);
    }
  }

  res.json({
    success: true,
    message: `Rating recorded: ${stars}★ for "${book.title}" by ${student.name}`
  });
}

// 5. Return a Borrowed Book
function returnBook(req, res) {
  const { usn, bookId } = req.body;

  const loan = mockData.borrowed.find(b => b.studentUsn === usn && b.bookId === bookId && b.status === 'ACTIVE');
  if (!loan) {
    return res.status(404).json({ success: false, message: 'No active borrow loan found for this book and student.' });
  }

  loan.status = 'RETURNED';
  loan.actual_return_date = new Date().toISOString().split('T')[0];

  res.json({
    success: true,
    message: 'Book marked as returned successfully.'
  });
}

module.exports = {
  getBooks,
  getStudents,
  borrowBook,
  rateBook,
  returnBook
};
