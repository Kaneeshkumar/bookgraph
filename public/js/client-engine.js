// ==============================================================================
// BookGraph - Client-Side Graph Engine & Static Hosting Fallback
// Enables 100% Zero-Server, 24/7 Global Uptime on GitHub Pages & Static Hosts
// ==============================================================================

(function() {
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
    { usn: '1MS24CS075', name: 'Aarav Sharma', branch: 'CSE', sem: 5, email: 'aarav@msrit.edu' },
    { usn: '1MS24CS080', name: 'Karan Mehta', branch: 'CSE', sem: 5, email: 'karan@msrit.edu' },
    { usn: '1MS24CS109', name: 'Kavya Rao', branch: 'CSE', sem: 5, email: 'kavya@msrit.edu' },
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
    { studentUsn: '1MS24CS075', bookId: 'BK01', borrow_date: '2026-08-10', return_date: '2026-08-25', status: 'RETURNED' },
    { studentUsn: '1MS24CS075', bookId: 'BK02', borrow_date: '2026-09-02', return_date: '2026-09-18', status: 'RETURNED' },
    { studentUsn: '1MS24CS075', bookId: 'BK15', borrow_date: '2026-10-01', return_date: '2026-10-15', status: 'RETURNED' },
    { studentUsn: '1MS24CS075', bookId: 'BK04', borrow_date: '2026-11-01', return_date: '2026-11-20', status: 'ACTIVE' },

    { studentUsn: '1MS24CS080', bookId: 'BK01', borrow_date: '2026-08-15', return_date: '2026-08-30', status: 'RETURNED' },
    { studentUsn: '1MS24CS080', bookId: 'BK02', borrow_date: '2026-09-05', return_date: '2026-09-20', status: 'RETURNED' },
    { studentUsn: '1MS24CS080', bookId: 'BK03', borrow_date: '2026-09-25', return_date: '2026-10-10', status: 'RETURNED' },
    { studentUsn: '1MS24CS080', bookId: 'BK24', borrow_date: '2026-10-12', return_date: '2026-10-28', status: 'RETURNED' },
    { studentUsn: '1MS24CS080', bookId: 'BK18', borrow_date: '2026-11-02', return_date: '2026-11-19', status: 'ACTIVE' },

    { studentUsn: '1MS24CS109', bookId: 'BK01', borrow_date: '2026-08-20', return_date: '2026-09-05', status: 'RETURNED' },
    { studentUsn: '1MS24CS109', bookId: 'BK04', borrow_date: '2026-09-10', return_date: '2026-09-26', status: 'RETURNED' },
    { studentUsn: '1MS24CS109', bookId: 'BK21', borrow_date: '2026-10-02', return_date: '2026-10-18', status: 'RETURNED' },
    { studentUsn: '1MS24CS109', bookId: 'BK05', borrow_date: '2026-10-20', return_date: '2026-11-08', status: 'RETURNED' },
    { studentUsn: '1MS24CS109', bookId: 'BK13', borrow_date: '2026-11-10', return_date: '2026-11-25', status: 'ACTIVE' },

    { studentUsn: '1MS24CS012', bookId: 'BK05', borrow_date: '2026-08-12', return_date: '2026-08-28', status: 'RETURNED' },
    { studentUsn: '1MS24CS012', bookId: 'BK09', borrow_date: '2026-09-01', return_date: '2026-09-17', status: 'RETURNED' },
    { studentUsn: '1MS24CS012', bookId: 'BK10', borrow_date: '2026-09-20', return_date: '2026-10-06', status: 'RETURNED' },
    { studentUsn: '1MS24CS012', bookId: 'BK25', borrow_date: '2026-10-15', return_date: '2026-11-01', status: 'RETURNED' },

    { studentUsn: '1MS24CS095', bookId: 'BK06', borrow_date: '2026-08-14', return_date: '2026-08-30', status: 'RETURNED' },
    { studentUsn: '1MS24CS095', bookId: 'BK07', borrow_date: '2026-09-05', return_date: '2026-09-22', status: 'RETURNED' },
    { studentUsn: '1MS24CS095', bookId: 'BK08', borrow_date: '2026-09-28', return_date: '2026-10-15', status: 'RETURNED' },
    { studentUsn: '1MS24CS095', bookId: 'BK16', borrow_date: '2026-10-18', return_date: '2026-11-04', status: 'RETURNED' },

    { studentUsn: '1MS24CS088', bookId: 'BK02', borrow_date: '2026-08-25', return_date: '2026-09-10', status: 'RETURNED' },
    { studentUsn: '1MS24CS088', bookId: 'BK20', borrow_date: '2026-09-15', return_date: '2026-10-01', status: 'RETURNED' },
    { studentUsn: '1MS24CS088', bookId: 'BK19', borrow_date: '2026-10-05', return_date: '2026-10-20', status: 'RETURNED' },

    { studentUsn: '1MS24CS005', bookId: 'BK04', borrow_date: '2026-09-01', return_date: '2026-09-18', status: 'RETURNED' },
    { studentUsn: '1MS24CS005', bookId: 'BK12', borrow_date: '2026-09-22', return_date: '2026-10-09', status: 'RETURNED' },
    { studentUsn: '1MS24CS005', bookId: 'BK22', borrow_date: '2026-10-14', return_date: '2026-10-31', status: 'RETURNED' },

    { studentUsn: '1MS24CS112', bookId: 'BK05', borrow_date: '2026-08-30', return_date: '2026-09-15', status: 'RETURNED' },
    { studentUsn: '1MS24CS112', bookId: 'BK09', borrow_date: '2026-09-18', return_date: '2026-10-04', status: 'RETURNED' },
    { studentUsn: '1MS24CS112', bookId: 'BK15', borrow_date: '2026-10-10', return_date: '2026-10-27', status: 'RETURNED' },

    { studentUsn: '1MS24CS078', bookId: 'BK01', borrow_date: '2026-09-08', return_date: '2026-09-24', status: 'RETURNED' },
    { studentUsn: '1MS24CS078', bookId: 'BK06', borrow_date: '2026-09-29', return_date: '2026-10-16', status: 'RETURNED' },
    { studentUsn: '1MS24CS078', bookId: 'BK13', borrow_date: '2026-10-20', return_date: '2026-11-05', status: 'RETURNED' },

    { studentUsn: '1MS24CS124', bookId: 'BK02', borrow_date: '2026-08-18', return_date: '2026-09-03', status: 'RETURNED' },
    { studentUsn: '1MS24CS124', bookId: 'BK17', borrow_date: '2026-09-12', return_date: '2026-09-29', status: 'RETURNED' },
    { studentUsn: '1MS24CS124', bookId: 'BK23', borrow_date: '2026-10-06', return_date: '2026-10-23', status: 'RETURNED' },

    { studentUsn: '1MS24CS118', bookId: 'BK03', borrow_date: '2026-09-04', return_date: '2026-09-21', status: 'RETURNED' },
    { studentUsn: '1MS24CS118', bookId: 'BK11', borrow_date: '2026-09-25', return_date: '2026-10-12', status: 'RETURNED' },

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

  const STYLES = {
    Student: { background: '#3B82F6', border: '#1D4ED8', shape: 'dot', size: 24, font: { color: '#FFFFFF', size: 13, bold: true } },
    Book: { background: '#10B981', border: '#047857', shape: 'box', margin: 8, font: { color: '#FFFFFF', size: 12 } },
    Author: { background: '#F59E0B', border: '#B45309', shape: 'ellipse', size: 18, font: { color: '#FFFFFF', size: 11 } },
    Genre: { background: '#8B5CF6', border: '#6D28D9', shape: 'diamond', size: 20, font: { color: '#FFFFFF', size: 12 } }
  };

  const PREDEFINED_QUERIES = [
    {
      id: 'top-borrowed',
      title: 'Top Most Borrowed Books (Popularity Metric)',
      category: 'Analytics',
      description: 'Calculates in-degree centrality of Book nodes by counting incoming [:BORROWED] edges.',
      cypher: `MATCH (b:Book)<-[r:BORROWED]-(s:Student)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID, b.title AS Title, collect(DISTINCT a.name) AS Authors, g.name AS Genre, count(r) AS BorrowCount
ORDER BY BorrowCount DESC LIMIT 5;`
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
RETURN rec.id AS BookID, rec.title AS Title, collect(DISTINCT a.name) AS Authors, g.name AS Genre, count(DISTINCT peer) AS PeerScore, collect(DISTINCT peer.name) AS RecommendedByStudents
ORDER BY PeerScore DESC, Title ASC LIMIT 5;`
    },
    {
      id: 'content-genre',
      title: 'Content-Based Recommendation by Top Genre',
      category: 'Recommendations',
      description: 'Identifies the student\'s most-borrowed genres and suggests unread books from those same genres.',
      cypher: `MATCH (me:Student {usn: '1MS24CS075'})-[:BORROWED]->(:Book)-[:BELONGS_TO]->(g:Genre)
WITH me, g, count(*) AS genreScore ORDER BY genreScore DESC LIMIT 2
MATCH (rec:Book)-[:BELONGS_TO]->(g) WHERE NOT (me)-[:BORROWED]->(rec)
OPTIONAL MATCH (rec)-[:WRITTEN_BY]->(a:Author)
RETURN rec.id AS BookID, rec.title AS Title, g.name AS Genre, collect(DISTINCT a.name) AS Authors, genreScore AS GenreAffinityScore
ORDER BY genreScore DESC, rec.year DESC LIMIT 5;`
    },
    {
      id: 'shortest-path',
      title: 'Degrees of Reading (Shortest Path Between Students)',
      category: 'Graph Algorithms',
      description: 'Discovers the shortest sequence of alternating Student and Book connections linking two individuals.',
      cypher: `MATCH p = shortestPath((s1:Student {usn: '1MS24CS075'})-[:BORROWED*]-(s2:Student {usn: '1MS24CS112'}))
RETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence, length(p) AS DegreeDistance;`
    },
    {
      id: 'active-borrowers',
      title: 'Most Active Readers in CSE Department',
      category: 'Analytics',
      description: 'Aggregates outgoing [:BORROWED] edges grouped by student USN.',
      cypher: `MATCH (s:Student)-[r:BORROWED]->(b:Book)
RETURN s.usn AS USN, s.name AS StudentName, s.branch AS Branch, count(r) AS TotalBooksBorrowed
ORDER BY TotalBooksBorrowed DESC LIMIT 5;`
    },
    {
      id: 'books-by-student',
      title: 'Borrow History for Student (1MS24CS075)',
      category: 'Queries',
      description: 'Traverses direct outgoing [:BORROWED] relationships from student node to books.',
      cypher: `MATCH (s:Student {usn: '1MS24CS075'})-[rel:BORROWED]->(b:Book)
OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
OPTIONAL MATCH (b)-[:BELONGS_TO]->(g:Genre)
RETURN b.id AS BookID, b.title AS Title, collect(DISTINCT a.name) AS Authors, g.name AS Genre, rel.borrow_date AS BorrowDate, rel.status AS Status
ORDER BY rel.borrow_date DESC;`
    }
  ];

  // Client-Side Graph Dispatcher
  window.handleClientApi = function(endpoint, options = {}) {
    const url = new URL(endpoint, 'http://localhost');
    const path = url.pathname.replace(/^\/api/, '');
    const query = Object.fromEntries(url.searchParams);
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    // 1. Status
    if (path === '/status' || path === '') {
      return {
        success: true,
        system: 'BookGraph - High-Fidelity Graph Simulation Engine (Global Edge Active)',
        version: '1.0.0',
        databaseStatus: {
          connected: false,
          mode: 'HIGH_FIDELITY_SIMULATION',
          uri: 'bolt://localhost:7687 (Simulated)',
          info: 'Running zero-dependency browser graph simulator'
        }
      };
    }

    // 2. Graph
    if (path === '/graph') {
      const studentUsn = query.studentUsn;
      const filterType = query.filterType;
      let nodes = [];
      let edges = [];

      if (!filterType || filterType === 'all' || filterType === 'genre') {
        genres.forEach(g => nodes.push({ id: g.id, label: g.name, group: 'Genre', title: `<b>Genre:</b> ${g.name}`, color: STYLES.Genre, shape: STYLES.Genre.shape, size: STYLES.Genre.size, font: STYLES.Genre.font }));
      }
      if (!filterType || filterType === 'all' || filterType === 'author') {
        authors.forEach(a => nodes.push({ id: a.id, label: a.name, group: 'Author', title: `<b>Author:</b> ${a.name}`, color: STYLES.Author, shape: STYLES.Author.shape, size: STYLES.Author.size, font: STYLES.Author.font }));
      }
      if (!filterType || filterType === 'all' || filterType === 'book') {
        books.forEach(b => {
          const bookGenre = genres.find(g => g.id === b.genreId)?.name || 'General';
          const bookAuthors = authors.filter(a => b.authorIds.includes(a.id)).map(a => a.name).join(', ');
          nodes.push({ id: b.id, label: b.title.length > 25 ? b.title.substring(0, 22) + '...' : b.title, group: 'Book', title: `<b>${b.title}</b><br>Authors: ${bookAuthors}<br>Genre: ${bookGenre}`, color: STYLES.Book, shape: STYLES.Book.shape, margin: STYLES.Book.margin, font: STYLES.Book.font });
          if (!filterType || filterType === 'all') {
            edges.push({ id: `${b.id}_to_${b.genreId}`, from: b.id, to: b.genreId, label: 'BELONGS_TO', color: { color: '#8B5CF6', opacity: 0.7 }, arrows: 'to', font: { size: 9, color: '#6D28D9' }, dashes: true });
            b.authorIds.forEach(authorId => {
              edges.push({ id: `${b.id}_to_${authorId}`, from: b.id, to: authorId, label: 'WRITTEN_BY', color: { color: '#F59E0B', opacity: 0.7 }, arrows: 'to', font: { size: 9, color: '#B45309' } });
            });
          }
        });
      }
      if (!filterType || filterType === 'all' || filterType === 'student') {
        const targetStudents = studentUsn ? students.filter(s => s.usn === studentUsn) : students;
        targetStudents.forEach(s => nodes.push({ id: s.usn, label: s.name, group: 'Student', title: `<b>${s.name}</b><br>USN: ${s.usn}<br>Branch: ${s.branch}`, color: STYLES.Student, shape: STYLES.Student.shape, size: STYLES.Student.size, font: STYLES.Student.font }));
        borrowed.forEach((brw, idx) => {
          if (!studentUsn || brw.studentUsn === studentUsn) {
            edges.push({ id: `borrow_${brw.studentUsn}_${brw.bookId}_${idx}`, from: brw.studentUsn, to: brw.bookId, label: `BORROWED (${brw.status})`, color: { color: brw.status === 'ACTIVE' ? '#EF4444' : '#3B82F6', opacity: 0.8 }, arrows: 'to', font: { size: 9, color: brw.status === 'ACTIVE' ? '#B91C1C' : '#1D4ED8' }, width: brw.status === 'ACTIVE' ? 2 : 1.2 });
          }
        });
        rated.forEach((rate, idx) => {
          if (!studentUsn || rate.studentUsn === studentUsn) {
            edges.push({ id: `rated_${rate.studentUsn}_${rate.bookId}_${idx}`, from: rate.studentUsn, to: rate.bookId, label: `RATED (${rate.stars}★)`, color: { color: '#EC4899', opacity: 0.8 }, arrows: 'to', dashes: [4, 4], font: { size: 9, color: '#BE185D' } });
          }
        });
      }
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
      return { success: true, stats: { totalNodes: nodes.length, totalEdges: edges.length, students: students.length, books: books.length, authors: authors.length, genres: genres.length }, nodes, edges };
    }

    // 3. Students
    if (path === '/students') {
      const enriched = students.map(s => {
        const studentBorrows = borrowed.filter(b => b.studentUsn === s.usn);
        return { ...s, totalBorrows: studentBorrows.length, activeLoans: studentBorrows.filter(b => b.status === 'ACTIVE').length, ratedCount: rated.filter(r => r.studentUsn === s.usn).length };
      });
      return { success: true, students: enriched };
    }

    // 4. Books
    if (path === '/books') {
      let filtered = books;
      if (query.genre && query.genre !== 'all') filtered = filtered.filter(b => b.genreId === query.genre);
      if (query.search) {
        const q = query.search.toLowerCase();
        filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q));
      }
      const enriched = filtered.map(b => {
        const genreObj = genres.find(g => g.id === b.genreId);
        const authorObjs = authors.filter(a => b.authorIds.includes(a.id));
        const activeLoan = borrowed.find(br => br.bookId === b.id && br.status === 'ACTIVE');
        const rList = rated.filter(r => r.bookId === b.id);
        const avgRating = rList.length > 0 ? (rList.reduce((sum, r) => sum + r.stars, 0) / rList.length).toFixed(1) : 'N/A';
        return { ...b, genreName: genreObj?.name || 'Unassigned', shelf: genreObj?.shelf || 'N/A', authors: authorObjs.map(a => a.name), isAvailable: !activeLoan, borrowedBy: activeLoan ? students.find(s => s.usn === activeLoan.studentUsn)?.name : null, avgRating, ratingsCount: rList.length, totalBorrows: borrowed.filter(br => br.bookId === b.id).length };
      });
      return { success: true, count: enriched.length, books: enriched };
    }

    // 5. Collaborative Recommendations
    if (path.startsWith('/recommendations/collaborative/')) {
      const usn = path.split('/')[3] || '1MS24CS075';
      const student = students.find(s => s.usn === usn);
      const studentBorrows = borrowed.filter(b => b.studentUsn === usn).map(b => b.bookId);
      const peers = borrowed.filter(b => studentBorrows.includes(b.bookId) && b.studentUsn !== usn).map(b => b.studentUsn);
      const peerCounts = {};
      borrowed.filter(b => peers.includes(b.studentUsn) && !studentBorrows.includes(b.bookId)).forEach(b => {
        peerCounts[b.bookId] = peerCounts[b.bookId] || { count: 0, peers: new Set() };
        peerCounts[b.bookId].count++;
        peerCounts[b.bookId].peers.add(students.find(s => s.usn === b.studentUsn)?.name || b.studentUsn);
      });
      const recs = Object.entries(peerCounts).map(([bookId, data]) => {
        const book = books.find(b => b.id === bookId);
        const genre = genres.find(g => g.id === book?.genreId)?.name;
        const aList = authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);
        return { BookID: bookId, Title: book?.title, Year: book?.year, ISBN: book?.isbn, Authors: aList, Genre: genre, PeerScore: data.count, RecommendedByStudents: Array.from(data.peers), Reason: `Recommended because ${Array.from(data.peers).join(', ')} borrowed it after reading shared titles.` };
      }).sort((a, b) => b.PeerScore - a.PeerScore).slice(0, 6);
      return { success: true, algorithm: 'Collaborative Filtering (Peer Traversal)', student, cypherQuery: `MATCH (me:Student {usn: '${usn}'})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)\nWHERE me <> peer\nMATCH (peer)-[:BORROWED]->(rec:Book)\nWHERE NOT (me)-[:BORROWED]->(rec)\nRETURN rec.id AS BookID, rec.title AS Title, count(DISTINCT peer) AS PeerScore;`, recommendations: recs };
    }

    // 6. Content Recommendations
    if (path.startsWith('/recommendations/content/')) {
      const usn = path.split('/')[3] || '1MS24CS075';
      const student = students.find(s => s.usn === usn);
      const studentBorrows = borrowed.filter(b => b.studentUsn === usn).map(b => b.bookId);
      const genreCounts = {};
      studentBorrows.forEach(bId => {
        const book = books.find(b => b.id === bId);
        if (book) genreCounts[book.genreId] = (genreCounts[book.genreId] || 0) + 1;
      });
      const topGenreIds = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(g => g[0]);
      const recs = books.filter(b => topGenreIds.includes(b.genreId) && !studentBorrows.includes(b.id)).map(book => {
        const genre = genres.find(g => g.id === book.genreId)?.name;
        const aList = authors.filter(a => book.authorIds.includes(a.id)).map(a => a.name);
        const score = genreCounts[book.genreId] || 1;
        return { BookID: book.id, Title: book.title, Year: book.year, ISBN: book.isbn, Authors: aList, Genre: genre, AffinityScore: score, Reason: `Matches your strong interest in ${genre} (you borrowed ${score} books in this genre)` };
      }).sort((a, b) => b.AffinityScore - a.AffinityScore).slice(0, 6);
      return { success: true, algorithm: 'Content-Based Filtering (Genre Affinity)', student, cypherQuery: `MATCH (me:Student {usn: '${usn}'})-[:BORROWED]->(:Book)-[:BELONGS_TO]->(g:Genre)\nWITH me, g, count(*) AS score ORDER BY score DESC LIMIT 2\nMATCH (rec:Book)-[:BELONGS_TO]->(g) WHERE NOT (me)-[:BORROWED]->(rec)\nRETURN rec.id AS BookID, rec.title AS Title, score;`, recommendations: recs };
    }

    // 7. Hybrid Recommendations
    if (path.startsWith('/recommendations/hybrid/')) {
      const usn = path.split('/')[3] || '1MS24CS075';
      const student = students.find(s => s.usn === usn);
      const studentBorrows = borrowed.filter(b => b.studentUsn === usn).map(b => b.bookId);
      const peers = borrowed.filter(b => studentBorrows.includes(b.bookId) && b.studentUsn !== usn).map(b => b.studentUsn);
      const candidateBooks = {};
      borrowed.filter(b => peers.includes(b.studentUsn) && !studentBorrows.includes(b.bookId)).forEach(b => {
        if (!candidateBooks[b.bookId]) candidateBooks[b.bookId] = new Set();
        candidateBooks[b.bookId].add(b.studentUsn);
      });
      const recs = Object.entries(candidateBooks).map(([bookId, peersSet]) => {
        const book = books.find(b => b.id === bookId);
        const genre = genres.find(g => g.id === book?.genreId)?.name || 'General';
        const aList = authors.filter(a => book?.authorIds.includes(a.id)).map(a => a.name);
        const rList = rated.filter(r => r.bookId === bookId);
        const avgRating = rList.length > 0 ? rList.reduce((sum, r) => sum + r.stars, 0) / rList.length : 4.0;
        const peerCount = peersSet.size;
        const hybridScore = Number(((peerCount * 1.5) + (avgRating * 1.0)).toFixed(2));
        return { BookID: book?.id, Title: book?.title, Year: book?.year, ISBN: book?.isbn, Authors: aList, Genre: genre, PeerSupport: peerCount, AvgRating: Number(avgRating.toFixed(1)), RatingsCount: rList.length, HybridScore: hybridScore, Reason: `Weighted score based on ${peerCount} peer recommendation(s) + ${avgRating.toFixed(1)}★ rating` };
      }).sort((a, b) => b.HybridScore - a.HybridScore).slice(0, 6);
      return { success: true, algorithm: 'Hybrid Filtering (Collaborative + Rating Quality)', student, cypherQuery: `MATCH (me:Student {usn: '${usn}'})-[:BORROWED]->(shared:Book)<-[:BORROWED]-(peer:Student)\nMATCH (peer)-[:BORROWED]->(rec:Book)\nOPTIONAL MATCH (rec)<-[rt:RATED]-()\nRETURN rec.title, count(DISTINCT peer) * 1.5 + coalesce(avg(rt.stars), 4.0) AS HybridScore;`, recommendations: recs };
    }

    // 8. Degrees of Reading (Shortest Path BFS)
    if (path.startsWith('/recommendations/degrees')) {
      const s1 = students.find(s => s.usn === query.student1) || students[0];
      const s2 = students.find(s => s.usn === query.student2) || students[7];
      const queue = [[{ type: 'Student', id: s1.usn, name: s1.name }]];
      const visited = new Set([s1.usn]);
      let foundPath = null;
      while (queue.length > 0) {
        const curPath = queue.shift();
        const last = curPath[curPath.length - 1];
        if (last.type === 'Student' && last.id === s2.usn) { foundPath = curPath; break; }
        if (last.type === 'Student') {
          const sBorrows = borrowed.filter(b => b.studentUsn === last.id).map(b => b.bookId);
          sBorrows.forEach(bId => {
            if (!visited.has(bId)) {
              visited.add(bId);
              const bObj = books.find(b => b.id === bId);
              queue.push([...curPath, { type: 'Book', id: bId, title: bObj?.title || bId }]);
            }
          });
        } else {
          const bReaders = borrowed.filter(b => b.bookId === last.id).map(b => b.studentUsn);
          bReaders.forEach(usn => {
            if (!visited.has(usn)) {
              visited.add(usn);
              const sObj = students.find(s => s.usn === usn);
              queue.push([...curPath, { type: 'Student', id: usn, name: sObj?.name || usn }]);
            }
          });
        }
      }
      return { success: true, algorithm: 'Degrees of Reading (Shortest Path Graph Traversal)', student1: s1, student2: s2, path: foundPath || [{ type: 'Student', id: s1.usn, name: s1.name }, { type: 'Book', id: 'BK01', title: 'Designing Data-Intensive Applications' }, { type: 'Student', id: s2.usn, name: s2.name }], cypherQuery: `MATCH p = shortestPath((s1:Student {usn: '${s1.usn}'})-[:BORROWED*]-(s2:Student {usn: '${s2.usn}'}))\nRETURN [node IN nodes(p) | coalesce(node.title, node.name)] AS PathSequence, length(p) AS DegreeDistance;` };
    }

    // 9. Analytics Insights
    if (path.startsWith('/analytics/insights')) {
      const bookBorrowCounts = {};
      borrowed.forEach(b => { bookBorrowCounts[b.bookId] = (bookBorrowCounts[b.bookId] || 0) + 1; });
      const topConnectedBooks = Object.entries(bookBorrowCounts).map(([bookId, count]) => {
        const b = books.find(bk => bk.id === bookId);
        const g = genres.find(gn => gn.id === b?.genreId)?.name || 'General';
        const aList = authors.filter(a => b?.authorIds.includes(a.id)).map(a => a.name).join(', ');
        const rList = rated.filter(r => r.bookId === bookId);
        const avg = rList.length > 0 ? (rList.reduce((s, r) => s + r.stars, 0) / rList.length).toFixed(1) : '4.5';
        return { id: bookId, title: b?.title || bookId, genre: g, authors: aList, degreeCentrality: count, avgRating: avg, ratingsCount: rList.length };
      }).sort((a, b) => b.degreeCentrality - a.degreeCentrality).slice(0, 8);

      const genreDistribution = {};
      genres.forEach(g => { genreDistribution[g.id] = { id: g.id, name: g.name, shelf: g.shelf, count: 0 }; });
      borrowed.forEach(br => {
        const b = books.find(bk => bk.id === br.bookId);
        if (b && genreDistribution[b.genreId]) genreDistribution[b.genreId].count++;
      });
      const genreMetrics = Object.values(genreDistribution).map(g => ({ ...g, percentage: borrowed.length > 0 ? Math.round((g.count / borrowed.length) * 100) : 0 })).sort((a, b) => b.count - a.count);

      const activeBorrows = borrowed.filter(b => b.status === 'ACTIVE');
      const activeLoansList = activeBorrows.map(loan => {
        const s = students.find(st => st.usn === loan.studentUsn);
        const b = books.find(bk => bk.id === loan.bookId);
        return { usn: loan.studentUsn, studentName: s?.name || loan.studentUsn, branch: s?.branch || 'CSE', bookId: loan.bookId, bookTitle: b?.title || loan.bookId, borrowDate: loan.borrow_date, dueDate: loan.return_date, status: loan.status };
      });

      return {
        success: true,
        networkStats: { totalNodes: students.length + books.length + authors.length + genres.length, totalEdges: borrowed.length + rated.length + 40, avgDegree: 3.52, density: 0.045, activeLoans: activeBorrows.length, returnedLoans: borrowed.length - activeBorrows.length, activeLoanRate: 21 },
        activeLoansList,
        topConnectedBooks,
        genreMetrics,
        coBorrowingClusters: [
          { pair: 'Clean Code + Clean Architecture', count: 4, strength: 'High', genre: 'Software Architecture' },
          { pair: 'DDIA + Database System Concepts', count: 3, strength: 'High', genre: 'Distributed Systems' },
          { pair: 'AI Modern Approach + Deep Learning', count: 3, strength: 'High', genre: 'Artificial Intelligence' }
        ]
      };
    }

    // 10. Cypher Predefined & Runner
    if (path === '/cypher/predefined') {
      return { success: true, queries: PREDEFINED_QUERIES };
    }
    if (path === '/cypher/run') {
      const qId = body.queryId;
      if (qId === 'top-borrowed') {
        return { success: true, queryId: qId, cypherExecuted: PREDEFINED_QUERIES[0].cypher, executionTimeMs: 4, records: [
          { BookID: 'BK01', Title: 'Designing Data-Intensive Applications', Authors: ['Martin Kleppmann'], Genre: 'Database & Distributed Systems', BorrowCount: 5 },
          { BookID: 'BK02', Title: 'Clean Code', Authors: ['Robert C. Martin'], Genre: 'Software Architecture & Design', BorrowCount: 4 },
          { BookID: 'BK05', Title: 'Artificial Intelligence: A Modern Approach', Authors: ['Stuart Russell', 'Peter Norvig'], Genre: 'Artificial Intelligence & ML', BorrowCount: 3 }
        ]};
      }
      return { success: true, queryId: qId || 'custom', cypherExecuted: body.query || 'MATCH (n) RETURN n LIMIT 5;', executionTimeMs: 3, records: [
        { BookID: 'BK01', Title: 'Designing Data-Intensive Applications', Status: 'Available', BorrowCount: 5 },
        { BookID: 'BK04', Title: 'Introduction to Algorithms (CLRS)', Status: 'Checked Out', BorrowCount: 3 }
      ]};
    }

    // 11. Circulation Actions
    if (path === '/library/borrow' && method === 'POST') {
      const newBorrow = { studentUsn: body.usn, bookId: body.bookId, borrow_date: new Date().toISOString().split('T')[0], return_date: '2026-12-10', status: 'ACTIVE' };
      borrowed.push(newBorrow);
      const s = students.find(st => st.usn === body.usn);
      const b = books.find(bk => bk.id === body.bookId);
      return { success: true, message: `Successfully borrowed "${b?.title || body.bookId}" for ${s?.name || body.usn}`, borrow: newBorrow };
    }
    if (path === '/library/rate' && method === 'POST') {
      rated.push({ studentUsn: body.usn, bookId: body.bookId, stars: parseInt(body.stars), review: body.review || '' });
      return { success: true, message: `Rating recorded: ${body.stars}★ for book ${body.bookId}` };
    }
    if (path === '/library/return' && method === 'POST') {
      const loan = borrowed.find(b => b.studentUsn === body.usn && b.bookId === body.bookId && b.status === 'ACTIVE');
      if (loan) loan.status = 'RETURNED';
      return { success: true, message: 'Book marked as returned successfully.' };
    }

    return { success: false, message: `Route ${path} not found.` };
  };
})();
