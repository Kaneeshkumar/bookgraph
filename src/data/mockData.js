// ==============================================================================
// BookGraph - In-Memory Graph Data Store & Schema Definition
// Mirrors the Neo4j Graph Model for Instant Demo & Auto-Seeding
// ==============================================================================

const genres = [
  { id: 'GEN01', name: 'Algorithms & Data Structures', shelf: 'A1-A3' },
  { id: 'GEN02', name: 'Database & Distributed Systems', shelf: 'B1-B3' },
  { id: 'GEN03', name: 'Artificial Intelligence & ML', shelf: 'C1-C4' },
  { id: 'GEN04', name: 'Software Architecture & Design', shelf: 'D1-D2' },
  { id: 'GEN05', name: 'Operating Systems & Low-Level', shelf: 'E1-E2' },
  { id: 'GEN06', name: 'Computer Networks & Security', shelf: 'F1-F3' },
  { id: 'GEN07', name: 'Theory of Computation & Math', shelf: 'G1-G2' },
  { id: 'GEN08', name: 'Tech Biography & Sci-Fi', shelf: 'H1-H2' }
];

const authors = [
  { id: 'AUT01', name: 'Thomas H. Cormen', country: 'USA' },
  { id: 'AUT02', name: 'Robert C. Martin', country: 'USA' },
  { id: 'AUT03', name: 'Martin Kleppmann', country: 'Germany' },
  { id: 'AUT04', name: 'Stuart Russell', country: 'UK' },
  { id: 'AUT05', name: 'Peter Norvig', country: 'USA' },
  { id: 'AUT06', name: 'Andrew S. Tanenbaum', country: 'Netherlands' },
  { id: 'AUT07', name: 'Donald E. Knuth', country: 'USA' },
  { id: 'AUT08', name: 'Ian Goodfellow', country: 'Canada' },
  { id: 'AUT09', name: 'Eric Evans', country: 'USA' },
  { id: 'AUT10', name: 'Michael Sipser', country: 'USA' },
  { id: 'AUT11', name: 'Abraham Silberschatz', country: 'USA' },
  { id: 'AUT12', name: 'Brian W. Kernighan', country: 'Canada' },
  { id: 'AUT13', name: 'Walter Isaacson', country: 'USA' },
  { id: 'AUT14', name: 'Gene Kim', country: 'USA' },
  { id: 'AUT15', name: 'Christopher Bishop', country: 'UK' },
  { id: 'AUT16', name: 'Douglas Adams', country: 'UK' },
  { id: 'AUT17', name: 'Aditya Bhargava', country: 'USA' },
  { id: 'AUT18', name: 'Kyle Simpson', country: 'USA' }
];

const students = [
  { usn: '1MS24CS075', name: 'Kaneeshkumar G K', branch: 'CSE', sem: 5, email: 'kaneesh@msrit.edu' },
  { usn: '1MS24CS080', name: 'Kaustubh Nadiger', branch: 'CSE', sem: 5, email: 'kaustubh@msrit.edu' },
  { usn: '1MS24CS109', name: 'Neville Richard Smith', branch: 'CSE', sem: 5, email: 'neville@msrit.edu' },
  { usn: '1MS24CS012', name: 'Ananya Sharma', branch: 'CSE', sem: 5, email: 'ananya@msrit.edu' },
  { usn: '1MS24CS095', name: 'Rohan Verma', branch: 'CSE', sem: 5, email: 'rohan@msrit.edu' },
  { usn: '1MS24CS088', name: 'Priya Nair', branch: 'CSE', sem: 5, email: 'priya@msrit.edu' },
  { usn: '1MS24CS005', name: 'Aditya Rao', branch: 'CSE', sem: 5, email: 'aditya@msrit.edu' },
  { usn: '1MS24CS112', name: 'Sneha Patel', branch: 'CSE', sem: 5, email: 'sneha@msrit.edu' },
  { usn: '1MS24CS078', name: 'Rahul Kulkarni', branch: 'CSE', sem: 5, email: 'rahul@msrit.edu' },
  { usn: '1MS24CS124', name: 'Varun Deshmukh', branch: 'CSE', sem: 5, email: 'varun@msrit.edu' },
  { usn: '1MS24CS118', name: 'Tanvi Hegde', branch: 'CSE', sem: 5, email: 'tanvi@msrit.edu' },
  { usn: '1MS24CS068', name: 'Mohammed Zaid', branch: 'CSE', sem: 5, email: 'zaid@msrit.edu' }
];

const books = [
  { id: 'BK01', title: 'Designing Data-Intensive Applications', year: 2017, isbn: '978-1449373320', pages: 616, genreId: 'GEN02', authorIds: ['AUT03'] },
  { id: 'BK02', title: 'Clean Code', year: 2008, isbn: '978-0132350884', pages: 464, genreId: 'GEN04', authorIds: ['AUT02'] },
  { id: 'BK03', title: 'Clean Architecture', year: 2017, isbn: '978-0134494166', pages: 432, genreId: 'GEN04', authorIds: ['AUT02'] },
  { id: 'BK04', title: 'Introduction to Algorithms (CLRS)', year: 2022, isbn: '978-0262046305', pages: 1312, genreId: 'GEN01', authorIds: ['AUT01'] },
  { id: 'BK05', title: 'Artificial Intelligence: A Modern Approach', year: 2020, isbn: '978-0134610993', pages: 1152, genreId: 'GEN03', authorIds: ['AUT04', 'AUT05'] },
  { id: 'BK06', title: 'Operating System Concepts', year: 2018, isbn: '978-1119456339', pages: 976, genreId: 'GEN05', authorIds: ['AUT11'] },
  { id: 'BK07', title: 'Modern Operating Systems', year: 2014, isbn: '978-0133591620', pages: 1136, genreId: 'GEN05', authorIds: ['AUT06'] },
  { id: 'BK08', title: 'Computer Networks', year: 2021, isbn: '978-0137523214', pages: 944, genreId: 'GEN06', authorIds: ['AUT06'] },
  { id: 'BK09', title: 'Deep Learning', year: 2016, isbn: '978-0262035613', pages: 800, genreId: 'GEN03', authorIds: ['AUT08'] },
  { id: 'BK10', title: 'Pattern Recognition and Machine Learning', year: 2006, isbn: '978-0387310732', pages: 738, genreId: 'GEN03', authorIds: ['AUT15'] },
  { id: 'BK11', title: 'Domain-Driven Design', year: 2003, isbn: '978-0321125217', pages: 560, genreId: 'GEN04', authorIds: ['AUT09'] },
  { id: 'BK12', title: 'Introduction to the Theory of Computation', year: 2012, isbn: '978-1133187790', pages: 504, genreId: 'GEN07', authorIds: ['AUT10'] },
  { id: 'BK13', title: 'Database System Concepts', year: 2019, isbn: '978-0078022159', pages: 1376, genreId: 'GEN02', authorIds: ['AUT11'] },
  { id: 'BK14', title: 'The Art of Computer Programming: Fundamental Algorithms', year: 1997, isbn: '978-0201896831', pages: 672, genreId: 'GEN01', authorIds: ['AUT07'] },
  { id: 'BK15', title: 'Grokking Algorithms', year: 2016, isbn: '978-1617292231', pages: 256, genreId: 'GEN01', authorIds: ['AUT17'] },
  { id: 'BK16', title: 'The C Programming Language (K&R)', year: 1988, isbn: '978-0131103627', pages: 272, genreId: 'GEN05', authorIds: ['AUT12'] },
  { id: 'BK17', title: 'Steve Jobs', year: 2011, isbn: '978-1451648539', pages: 656, genreId: 'GEN08', authorIds: ['AUT13'] },
  { id: 'BK18', title: 'The Phoenix Project', year: 2013, isbn: '978-0988262591', pages: 345, genreId: 'GEN04', authorIds: ['AUT14'] },
  { id: 'BK19', title: "The Hitchhiker's Guide to the Galaxy", year: 1979, isbn: '978-0345391803', pages: 216, genreId: 'GEN08', authorIds: ['AUT16'] },
  { id: 'BK20', title: "You Don't Know JS Yet: Get Started", year: 2020, isbn: '978-1698748375', pages: 142, genreId: 'GEN04', authorIds: ['AUT18'] },
  { id: 'BK21', title: 'The Clean Coder', year: 2011, isbn: '978-0137081073', pages: 256, genreId: 'GEN04', authorIds: ['AUT02'] },
  { id: 'BK22', title: 'Concrete Mathematics: A Foundation for Computer Science', year: 1994, isbn: '978-0201558029', pages: 672, genreId: 'GEN07', authorIds: ['AUT07'] },
  { id: 'BK23', title: 'The Innovators', year: 2014, isbn: '978-1476708690', pages: 560, genreId: 'GEN08', authorIds: ['AUT13'] },
  { id: 'BK24', title: 'Distributed Systems: Principles and Paradigms', year: 2017, isbn: '978-1530281756', pages: 600, genreId: 'GEN02', authorIds: ['AUT06'] },
  { id: 'BK25', title: 'Reinforcement Learning: An Introduction', year: 2018, isbn: '978-0262039246', pages: 552, genreId: 'GEN03', authorIds: ['AUT04'] }
];

let borrowed = [
  // Kaneeshkumar (1MS24CS075)
  { studentUsn: '1MS24CS075', bookId: 'BK01', borrow_date: '2026-08-10', return_date: '2026-08-25', status: 'RETURNED' },
  { studentUsn: '1MS24CS075', bookId: 'BK02', borrow_date: '2026-09-02', return_date: '2026-09-18', status: 'RETURNED' },
  { studentUsn: '1MS24CS075', bookId: 'BK15', borrow_date: '2026-10-01', return_date: '2026-10-15', status: 'RETURNED' },
  { studentUsn: '1MS24CS075', bookId: 'BK04', borrow_date: '2026-11-01', return_date: '2026-11-20', status: 'ACTIVE' },

  // Kaustubh (1MS24CS080)
  { studentUsn: '1MS24CS080', bookId: 'BK01', borrow_date: '2026-08-15', return_date: '2026-08-30', status: 'RETURNED' },
  { studentUsn: '1MS24CS080', bookId: 'BK02', borrow_date: '2026-09-05', return_date: '2026-09-20', status: 'RETURNED' },
  { studentUsn: '1MS24CS080', bookId: 'BK03', borrow_date: '2026-09-25', return_date: '2026-10-10', status: 'RETURNED' },
  { studentUsn: '1MS24CS080', bookId: 'BK24', borrow_date: '2026-10-12', return_date: '2026-10-28', status: 'RETURNED' },
  { studentUsn: '1MS24CS080', bookId: 'BK18', borrow_date: '2026-11-02', return_date: '2026-11-19', status: 'ACTIVE' },

  // Neville (1MS24CS109)
  { studentUsn: '1MS24CS109', bookId: 'BK01', borrow_date: '2026-08-20', return_date: '2026-09-05', status: 'RETURNED' },
  { studentUsn: '1MS24CS109', bookId: 'BK04', borrow_date: '2026-09-10', return_date: '2026-09-26', status: 'RETURNED' },
  { studentUsn: '1MS24CS109', bookId: 'BK21', borrow_date: '2026-10-02', return_date: '2026-10-18', status: 'RETURNED' },
  { studentUsn: '1MS24CS109', bookId: 'BK05', borrow_date: '2026-10-20', return_date: '2026-11-08', status: 'RETURNED' },
  { studentUsn: '1MS24CS109', bookId: 'BK13', borrow_date: '2026-11-10', return_date: '2026-11-25', status: 'ACTIVE' },

  // Ananya (1MS24CS012)
  { studentUsn: '1MS24CS012', bookId: 'BK05', borrow_date: '2026-08-12', return_date: '2026-08-28', status: 'RETURNED' },
  { studentUsn: '1MS24CS012', bookId: 'BK09', borrow_date: '2026-09-01', return_date: '2026-09-17', status: 'RETURNED' },
  { studentUsn: '1MS24CS012', bookId: 'BK10', borrow_date: '2026-09-20', return_date: '2026-10-06', status: 'RETURNED' },
  { studentUsn: '1MS24CS012', bookId: 'BK25', borrow_date: '2026-10-15', return_date: '2026-11-01', status: 'RETURNED' },

  // Rohan (1MS24CS095)
  { studentUsn: '1MS24CS095', bookId: 'BK06', borrow_date: '2026-08-14', return_date: '2026-08-30', status: 'RETURNED' },
  { studentUsn: '1MS24CS095', bookId: 'BK07', borrow_date: '2026-09-05', return_date: '2026-09-22', status: 'RETURNED' },
  { studentUsn: '1MS24CS095', bookId: 'BK08', borrow_date: '2026-09-28', return_date: '2026-10-15', status: 'RETURNED' },
  { studentUsn: '1MS24CS095', bookId: 'BK16', borrow_date: '2026-10-18', return_date: '2026-11-04', status: 'RETURNED' },

  // Priya (1MS24CS088)
  { studentUsn: '1MS24CS088', bookId: 'BK02', borrow_date: '2026-08-25', return_date: '2026-09-10', status: 'RETURNED' },
  { studentUsn: '1MS24CS088', bookId: 'BK20', borrow_date: '2026-09-15', return_date: '2026-10-01', status: 'RETURNED' },
  { studentUsn: '1MS24CS088', bookId: 'BK19', borrow_date: '2026-10-05', return_date: '2026-10-20', status: 'RETURNED' },

  // Aditya (1MS24CS005)
  { studentUsn: '1MS24CS005', bookId: 'BK04', borrow_date: '2026-09-01', return_date: '2026-09-18', status: 'RETURNED' },
  { studentUsn: '1MS24CS005', bookId: 'BK12', borrow_date: '2026-09-22', return_date: '2026-10-09', status: 'RETURNED' },
  { studentUsn: '1MS24CS005', bookId: 'BK22', borrow_date: '2026-10-14', return_date: '2026-10-31', status: 'RETURNED' },

  // Sneha (1MS24CS112)
  { studentUsn: '1MS24CS112', bookId: 'BK05', borrow_date: '2026-08-30', return_date: '2026-09-15', status: 'RETURNED' },
  { studentUsn: '1MS24CS112', bookId: 'BK09', borrow_date: '2026-09-18', return_date: '2026-10-04', status: 'RETURNED' },
  { studentUsn: '1MS24CS112', bookId: 'BK15', borrow_date: '2026-10-10', return_date: '2026-10-27', status: 'RETURNED' },

  // Rahul (1MS24CS078)
  { studentUsn: '1MS24CS078', bookId: 'BK01', borrow_date: '2026-09-08', return_date: '2026-09-24', status: 'RETURNED' },
  { studentUsn: '1MS24CS078', bookId: 'BK06', borrow_date: '2026-09-29', return_date: '2026-10-16', status: 'RETURNED' },
  { studentUsn: '1MS24CS078', bookId: 'BK13', borrow_date: '2026-10-20', return_date: '2026-11-05', status: 'RETURNED' },

  // Varun (1MS24CS124)
  { studentUsn: '1MS24CS124', bookId: 'BK02', borrow_date: '2026-08-18', return_date: '2026-09-03', status: 'RETURNED' },
  { studentUsn: '1MS24CS124', bookId: 'BK17', borrow_date: '2026-09-12', return_date: '2026-09-29', status: 'RETURNED' },
  { studentUsn: '1MS24CS124', bookId: 'BK23', borrow_date: '2026-10-06', return_date: '2026-10-23', status: 'RETURNED' },

  // Tanvi (1MS24CS118)
  { studentUsn: '1MS24CS118', bookId: 'BK03', borrow_date: '2026-09-04', return_date: '2026-09-21', status: 'RETURNED' },
  { studentUsn: '1MS24CS118', bookId: 'BK11', borrow_date: '2026-09-25', return_date: '2026-10-12', status: 'RETURNED' },

  // Zaid (1MS24CS068)
  { studentUsn: '1MS24CS068', bookId: 'BK01', borrow_date: '2026-09-14', return_date: '2026-09-30', status: 'RETURNED' },
  { studentUsn: '1MS24CS068', bookId: 'BK08', borrow_date: '2026-10-05', return_date: '2026-10-22', status: 'RETURNED' },
  { studentUsn: '1MS24CS068', bookId: 'BK24', borrow_date: '2026-10-26', return_date: '2026-11-12', status: 'RETURNED' }
];

let rated = [
  { studentUsn: '1MS24CS075', bookId: 'BK01', stars: 5, review: 'Masterpiece on distributed data systems!' },
  { studentUsn: '1MS24CS075', bookId: 'BK02', stars: 5, review: 'Must read for writing maintainable software.' },
  { studentUsn: '1MS24CS075', bookId: 'BK15', stars: 4, review: 'Intuitive illustrations for algorithmic basics.' },

  { studentUsn: '1MS24CS080', bookId: 'BK01', stars: 5, review: 'Unparalleled clarity on consensus and replication.' },
  { studentUsn: '1MS24CS080', bookId: 'BK03', stars: 5, review: 'Solidified my understanding of SOLID & decoupled boundaries.' },
  { studentUsn: '1MS24CS080', bookId: 'BK24', stars: 4, review: 'Rigorous academic textbook on distributed computing.' },

  { studentUsn: '1MS24CS109', bookId: 'BK01', stars: 5, review: 'Best computer science book I have read in engineering.' },
  { studentUsn: '1MS24CS109', bookId: 'BK04', stars: 4, review: 'The bible of algorithms. Heavy proofs but invaluable.' },
  { studentUsn: '1MS24CS109', bookId: 'BK21', stars: 5, review: 'Great insights on professional ethics and estimation.' },

  { studentUsn: '1MS24CS012', bookId: 'BK05', stars: 5, review: 'Comprehensive survey of classic and modern AI.' },
  { studentUsn: '1MS24CS012', bookId: 'BK09', stars: 5, review: 'Essential deep learning theory and backpropagation math.' },

  { studentUsn: '1MS24CS095', bookId: 'BK06', stars: 4, review: 'Standard reference for OS concepts and virtual memory.' },
  { studentUsn: '1MS24CS095', bookId: 'BK08', stars: 4, review: 'Thorough coverage of OSI and TCP/IP stack.' },

  { studentUsn: '1MS24CS088', bookId: 'BK19', stars: 5, review: 'Hilarious sci-fi classic! 42 is the answer.' },
  { studentUsn: '1MS24CS112', bookId: 'BK05', stars: 5, review: 'Excellent textbook for our AI course.' },
  { studentUsn: '1MS24CS124', bookId: 'BK17', stars: 5, review: 'Fascinating story of visionary tech leadership.' }
];

module.exports = {
  genres,
  authors,
  students,
  books,
  borrowed,
  rated
};
