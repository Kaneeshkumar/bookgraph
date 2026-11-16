// ==============================================================================
// BookGraph - Library Book Recommendation System
// CSAEC59: AEC-NoSQL (Ramaiah Institute of Technology, Bangalore)
// Script 02: Comprehensive Seed Dataset (Idempotent using MERGE)
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. GENRES
// ------------------------------------------------------------------------------
MERGE (g1:Genre {id: 'GEN01'}) ON CREATE SET g1.name = 'Algorithms & Data Structures', g1.shelf = 'A1-A3'
MERGE (g2:Genre {id: 'GEN02'}) ON CREATE SET g2.name = 'Database & Distributed Systems', g2.shelf = 'B1-B3'
MERGE (g3:Genre {id: 'GEN03'}) ON CREATE SET g3.name = 'Artificial Intelligence & ML', g3.shelf = 'C1-C4'
MERGE (g4:Genre {id: 'GEN04'}) ON CREATE SET g4.name = 'Software Architecture & Design', g4.shelf = 'D1-D2'
MERGE (g5:Genre {id: 'GEN05'}) ON CREATE SET g5.name = 'Operating Systems & Low-Level', g5.shelf = 'E1-E2'
MERGE (g6:Genre {id: 'GEN06'}) ON CREATE SET g6.name = 'Computer Networks & Security', g6.shelf = 'F1-F3'
MERGE (g7:Genre {id: 'GEN07'}) ON CREATE SET g7.name = 'Theory of Computation & Math', g7.shelf = 'G1-G2'
MERGE (g8:Genre {id: 'GEN08'}) ON CREATE SET g8.name = 'Tech Biography & Sci-Fi', g8.shelf = 'H1-H2';

// ------------------------------------------------------------------------------
// 2. AUTHORS
// ------------------------------------------------------------------------------
MERGE (a01:Author {id: 'AUT01'}) ON CREATE SET a01.name = 'Thomas H. Cormen', a01.country = 'USA'
MERGE (a02:Author {id: 'AUT02'}) ON CREATE SET a02.name = 'Robert C. Martin', a02.country = 'USA'
MERGE (a03:Author {id: 'AUT03'}) ON CREATE SET a03.name = 'Martin Kleppmann', a03.country = 'Germany'
MERGE (a04:Author {id: 'AUT04'}) ON CREATE SET a04.name = 'Stuart Russell', a04.country = 'UK'
MERGE (a05:Author {id: 'AUT05'}) ON CREATE SET a05.name = 'Peter Norvig', a05.country = 'USA'
MERGE (a06:Author {id: 'AUT06'}) ON CREATE SET a06.name = 'Andrew S. Tanenbaum', a06.country = 'Netherlands'
MERGE (a07:Author {id: 'AUT07'}) ON CREATE SET a07.name = 'Donald E. Knuth', a07.country = 'USA'
MERGE (a08:Author {id: 'AUT08'}) ON CREATE SET a08.name = 'Ian Goodfellow', a08.country = 'Canada'
MERGE (a09:Author {id: 'AUT09'}) ON CREATE SET a09.name = 'Eric Evans', a09.country = 'USA'
MERGE (a10:Author {id: 'AUT10'}) ON CREATE SET a10.name = 'Michael Sipser', a10.country = 'USA'
MERGE (a11:Author {id: 'AUT11'}) ON CREATE SET a11.name = 'Abraham Silberschatz', a11.country = 'USA'
MERGE (a12:Author {id: 'AUT12'}) ON CREATE SET a12.name = 'Brian W. Kernighan', a12.country = 'Canada'
MERGE (a13:Author {id: 'AUT13'}) ON CREATE SET a13.name = 'Walter Isaacson', a13.country = 'USA'
MERGE (a14:Author {id: 'AUT14'}) ON CREATE SET a14.name = 'Gene Kim', a14.country = 'USA'
MERGE (a15:Author {id: 'AUT15'}) ON CREATE SET a15.name = 'Christopher Bishop', a15.country = 'UK'
MERGE (a16:Author {id: 'AUT16'}) ON CREATE SET a16.name = 'Douglas Adams', a16.country = 'UK'
MERGE (a17:Author {id: 'AUT17'}) ON CREATE SET a17.name = 'Aditya Bhargava', a17.country = 'USA'
MERGE (a18:Author {id: 'AUT18'}) ON CREATE SET a18.name = 'Kyle Simpson', a18.country = 'USA';

// ------------------------------------------------------------------------------
// 3. STUDENTS (Including Project Team from RIT CSE)
// ------------------------------------------------------------------------------
MERGE (s01:Student {usn: '1MS24CS075'}) ON CREATE SET s01.name = 'Kaneeshkumar G K', s01.branch = 'CSE', s01.sem = 5, s01.email = 'kaneesh@msrit.edu'
MERGE (s02:Student {usn: '1MS24CS080'}) ON CREATE SET s02.name = 'Kaustubh Nadiger', s02.branch = 'CSE', s02.sem = 5, s02.email = 'kaustubh@msrit.edu'
MERGE (s03:Student {usn: '1MS24CS109'}) ON CREATE SET s03.name = 'Neville Richard Smith', s03.branch = 'CSE', s03.sem = 5, s03.email = 'neville@msrit.edu'
MERGE (s04:Student {usn: '1MS24CS012'}) ON CREATE SET s04.name = 'Ananya Sharma', s04.branch = 'CSE', s04.sem = 5, s04.email = 'ananya@msrit.edu'
MERGE (s05:Student {usn: '1MS24CS095'}) ON CREATE SET s05.name = 'Rohan Verma', s05.branch = 'CSE', s05.sem = 5, s05.email = 'rohan@msrit.edu'
MERGE (s06:Student {usn: '1MS24CS088'}) ON CREATE SET s06.name = 'Priya Nair', s06.branch = 'CSE', s06.sem = 5, s06.email = 'priya@msrit.edu'
MERGE (s07:Student {usn: '1MS24CS005'}) ON CREATE SET s07.name = 'Aditya Rao', s07.branch = 'CSE', s07.sem = 5, s07.email = 'aditya@msrit.edu'
MERGE (s08:Student {usn: '1MS24CS112'}) ON CREATE SET s08.name = 'Sneha Patel', s08.branch = 'CSE', s08.sem = 5, s08.email = 'sneha@msrit.edu'
MERGE (s09:Student {usn: '1MS24CS078'}) ON CREATE SET s09.name = 'Rahul Kulkarni', s09.branch = 'CSE', s09.sem = 5, s09.email = 'rahul@msrit.edu'
MERGE (s10:Student {usn: '1MS24CS124'}) ON CREATE SET s10.name = 'Varun Deshmukh', s10.branch = 'CSE', s10.sem = 5, s10.email = 'varun@msrit.edu'
MERGE (s11:Student {usn: '1MS24CS118'}) ON CREATE SET s11.name = 'Tanvi Hegde', s11.branch = 'CSE', s11.sem = 5, s11.email = 'tanvi@msrit.edu'
MERGE (s12:Student {usn: '1MS24CS068'}) ON CREATE SET s12.name = 'Mohammed Zaid', s12.branch = 'CSE', s12.sem = 5, s12.email = 'zaid@msrit.edu';

// ------------------------------------------------------------------------------
// 4. BOOKS AND THEIR AUTHORS & GENRES
// ------------------------------------------------------------------------------

// Book 1: Designing Data-Intensive Applications
MERGE (b01:Book {id: 'BK01'}) ON CREATE SET b01.title = 'Designing Data-Intensive Applications', b01.year = 2017, b01.isbn = '978-1449373320', b01.pages = 616
MERGE (b01)-[:WRITTEN_BY]->(:Author {id: 'AUT03'})
MERGE (b01)-[:BELONGS_TO]->(:Genre {id: 'GEN02'});

// Book 2: Clean Code
MERGE (b02:Book {id: 'BK02'}) ON CREATE SET b02.title = 'Clean Code', b02.year = 2008, b02.isbn = '978-0132350884', b02.pages = 464
MERGE (b02)-[:WRITTEN_BY]->(:Author {id: 'AUT02'})
MERGE (b02)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 3: Clean Architecture
MERGE (b03:Book {id: 'BK03'}) ON CREATE SET b03.title = 'Clean Architecture', b03.year = 2017, b03.isbn = '978-0134494166', b03.pages = 432
MERGE (b03)-[:WRITTEN_BY]->(:Author {id: 'AUT02'})
MERGE (b03)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 4: Introduction to Algorithms (CLRS)
MERGE (b04:Book {id: 'BK04'}) ON CREATE SET b04.title = 'Introduction to Algorithms (CLRS)', b04.year = 2022, b04.isbn = '978-0262046305', b04.pages = 1312
MERGE (b04)-[:WRITTEN_BY]->(:Author {id: 'AUT01'})
MERGE (b04)-[:BELONGS_TO]->(:Genre {id: 'GEN01'});

// Book 5: Artificial Intelligence: A Modern Approach
MERGE (b05:Book {id: 'BK05'}) ON CREATE SET b05.title = 'Artificial Intelligence: A Modern Approach', b05.year = 2020, b05.isbn = '978-0134610993', b05.pages = 1152
MERGE (b05)-[:WRITTEN_BY]->(:Author {id: 'AUT04'})
MERGE (b05)-[:WRITTEN_BY]->(:Author {id: 'AUT05'})
MERGE (b05)-[:BELONGS_TO]->(:Genre {id: 'GEN03'});

// Book 6: Operating Systems: Three Easy Pieces (Silberschatz)
MERGE (b06:Book {id: 'BK06'}) ON CREATE SET b06.title = 'Operating System Concepts', b06.year = 2018, b06.isbn = '978-1119456339', b06.pages = 976
MERGE (b06)-[:WRITTEN_BY]->(:Author {id: 'AUT11'})
MERGE (b06)-[:BELONGS_TO]->(:Genre {id: 'GEN05'});

// Book 7: Modern Operating Systems
MERGE (b07:Book {id: 'BK07'}) ON CREATE SET b07.title = 'Modern Operating Systems', b07.year = 2014, b07.isbn = '978-0133591620', b07.pages = 1136
MERGE (b07)-[:WRITTEN_BY]->(:Author {id: 'AUT06'})
MERGE (b07)-[:BELONGS_TO]->(:Genre {id: 'GEN05'});

// Book 8: Computer Networks
MERGE (b08:Book {id: 'BK08'}) ON CREATE SET b08.title = 'Computer Networks', b08.year = 2021, b08.isbn = '978-0137523214', b08.pages = 944
MERGE (b08)-[:WRITTEN_BY]->(:Author {id: 'AUT06'})
MERGE (b08)-[:BELONGS_TO]->(:Genre {id: 'GEN06'});

// Book 9: Deep Learning
MERGE (b09:Book {id: 'BK09'}) ON CREATE SET b09.title = 'Deep Learning', b09.year = 2016, b09.isbn = '978-0262035613', b09.pages = 800
MERGE (b09)-[:WRITTEN_BY]->(:Author {id: 'AUT08'})
MERGE (b09)-[:BELONGS_TO]->(:Genre {id: 'GEN03'});

// Book 10: Pattern Recognition and Machine Learning
MERGE (b10:Book {id: 'BK10'}) ON CREATE SET b10.title = 'Pattern Recognition and Machine Learning', b10.year = 2006, b10.isbn = '978-0387310732', b10.pages = 738
MERGE (b10)-[:WRITTEN_BY]->(:Author {id: 'AUT15'})
MERGE (b10)-[:BELONGS_TO]->(:Genre {id: 'GEN03'});

// Book 11: Domain-Driven Design
MERGE (b11:Book {id: 'BK11'}) ON CREATE SET b11.title = 'Domain-Driven Design', b11.year = 2003, b11.isbn = '978-0321125217', b11.pages = 560
MERGE (b11)-[:WRITTEN_BY]->(:Author {id: 'AUT09'})
MERGE (b11)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 12: Introduction to the Theory of Computation
MERGE (b12:Book {id: 'BK12'}) ON CREATE SET b12.title = 'Introduction to the Theory of Computation', b12.year = 2012, b12.isbn = '978-1133187790', b12.pages = 504
MERGE (b12)-[:WRITTEN_BY]->(:Author {id: 'AUT10'})
MERGE (b12)-[:BELONGS_TO]->(:Genre {id: 'GEN07'});

// Book 13: Database System Concepts
MERGE (b13:Book {id: 'BK13'}) ON CREATE SET b13.title = 'Database System Concepts', b13.year = 2019, b13.isbn = '978-0078022159', b13.pages = 1376
MERGE (b13)-[:WRITTEN_BY]->(:Author {id: 'AUT11'})
MERGE (b13)-[:BELONGS_TO]->(:Genre {id: 'GEN02'});

// Book 14: The Art of Computer Programming, Vol 1
MERGE (b14:Book {id: 'BK14'}) ON CREATE SET b14.title = 'The Art of Computer Programming: Fundamental Algorithms', b14.year = 1997, b14.isbn = '978-0201896831', b14.pages = 672
MERGE (b14)-[:WRITTEN_BY]->(:Author {id: 'AUT07'})
MERGE (b14)-[:BELONGS_TO]->(:Genre {id: 'GEN01'});

// Book 15: Grokking Algorithms
MERGE (b15:Book {id: 'BK15'}) ON CREATE SET b15.title = 'Grokking Algorithms', b15.year = 2016, b15.isbn = '978-1617292231', b15.pages = 256
MERGE (b15)-[:WRITTEN_BY]->(:Author {id: 'AUT17'})
MERGE (b15)-[:BELONGS_TO]->(:Genre {id: 'GEN01'});

// Book 16: The C Programming Language
MERGE (b16:Book {id: 'BK16'}) ON CREATE SET b16.title = 'The C Programming Language (K&R)', b16.year = 1988, b16.isbn = '978-0131103627', b16.pages = 272
MERGE (b16)-[:WRITTEN_BY]->(:Author {id: 'AUT12'})
MERGE (b16)-[:BELONGS_TO]->(:Genre {id: 'GEN05'});

// Book 17: Steve Jobs
MERGE (b17:Book {id: 'BK17'}) ON CREATE SET b17.title = 'Steve Jobs', b17.year = 2011, b17.isbn = '978-1451648539', b17.pages = 656
MERGE (b17)-[:WRITTEN_BY]->(:Author {id: 'AUT13'})
MERGE (b17)-[:BELONGS_TO]->(:Genre {id: 'GEN08'});

// Book 18: The Phoenix Project
MERGE (b18:Book {id: 'BK18'}) ON CREATE SET b18.title = 'The Phoenix Project', b18.year = 2013, b18.isbn = '978-0988262591', b18.pages = 345
MERGE (b18)-[:WRITTEN_BY]->(:Author {id: 'AUT14'})
MERGE (b18)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 19: The Hitchhiker\'s Guide to the Galaxy
MERGE (b19:Book {id: 'BK19'}) ON CREATE SET b19.title = "The Hitchhiker's Guide to the Galaxy", b19.year = 1979, b19.isbn = '978-0345391803', b19.pages = 216
MERGE (b19)-[:WRITTEN_BY]->(:Author {id: 'AUT16'})
MERGE (b19)-[:BELONGS_TO]->(:Genre {id: 'GEN08'});

// Book 20: You Don\'t Know JS Yet: Get Started
MERGE (b20:Book {id: 'BK20'}) ON CREATE SET b20.title = "You Don't Know JS Yet: Get Started", b20.year = 2020, b20.isbn = '978-1698748375', b20.pages = 142
MERGE (b20)-[:WRITTEN_BY]->(:Author {id: 'AUT18'})
MERGE (b20)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 21: The Clean Coder: A Code of Conduct for Professional Programmers
MERGE (b21:Book {id: 'BK21'}) ON CREATE SET b21.title = 'The Clean Coder', b21.year = 2011, b21.isbn = '978-0137081073', b21.pages = 256
MERGE (b21)-[:WRITTEN_BY]->(:Author {id: 'AUT02'})
MERGE (b21)-[:BELONGS_TO]->(:Genre {id: 'GEN04'});

// Book 22: Concrete Mathematics
MERGE (b22:Book {id: 'BK22'}) ON CREATE SET b22.title = 'Concrete Mathematics: A Foundation for Computer Science', b22.year = 1994, b22.isbn = '978-0201558029', b22.pages = 672
MERGE (b22)-[:WRITTEN_BY]->(:Author {id: 'AUT07'})
MERGE (b22)-[:BELONGS_TO]->(:Genre {id: 'GEN07'});

// Book 23: The Innovators
MERGE (b23:Book {id: 'BK23'}) ON CREATE SET b23.title = 'The Innovators: How a Group of Hackers, Geniuses, and Geeks Created the Digital Revolution', b23.year = 2014, b23.isbn = '978-1476708690', b23.pages = 560
MERGE (b23)-[:WRITTEN_BY]->(:Author {id: 'AUT13'})
MERGE (b23)-[:BELONGS_TO]->(:Genre {id: 'GEN08'});

// Book 24: Distributed Systems: Principles and Paradigms
MERGE (b24:Book {id: 'BK24'}) ON CREATE SET b24.title = 'Distributed Systems: Principles and Paradigms', b24.year = 2017, b24.isbn = '978-1530281756', b24.pages = 600
MERGE (b24)-[:WRITTEN_BY]->(:Author {id: 'AUT06'})
MERGE (b24)-[:BELONGS_TO]->(:Genre {id: 'GEN02'});

// Book 25: Reinforcement Learning: An Introduction
MERGE (b25:Book {id: 'BK25'}) ON CREATE SET b25.title = 'Reinforcement Learning: An Introduction', b25.year = 2018, b25.isbn = '978-0262039246', b25.pages = 552
MERGE (b25)-[:WRITTEN_BY]->(:Author {id: 'AUT04'})
MERGE (b25)-[:BELONGS_TO]->(:Genre {id: 'GEN03'});

// ------------------------------------------------------------------------------
// 5. BORROWING HISTORY (Student -[:BORROWED]-> Book)
// ------------------------------------------------------------------------------

// Kaneeshkumar G K (1MS24CS075) - Reads Distributed Systems, Clean Code, Algorithms
MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s01)-[:BORROWED {borrow_date: '2026-08-10', return_date: '2026-08-25', status: 'RETURNED'}]->(b01);

MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b02:Book {id: 'BK02'})
MERGE (s01)-[:BORROWED {borrow_date: '2026-09-02', return_date: '2026-09-18', status: 'RETURNED'}]->(b02);

MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b15:Book {id: 'BK15'})
MERGE (s01)-[:BORROWED {borrow_date: '2026-10-01', return_date: '2026-10-15', status: 'RETURNED'}]->(b15);

MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b04:Book {id: 'BK04'})
MERGE (s01)-[:BORROWED {borrow_date: '2026-11-01', return_date: '2026-11-20', status: 'ACTIVE'}]->(b04);

// Kaustubh Nadiger (1MS24CS080) - Overlaps with Kaneesh on BK01, BK02; also read BK03 (Clean Arch), BK24 (Dist Systems), BK18
MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s02)-[:BORROWED {borrow_date: '2026-08-15', return_date: '2026-08-30', status: 'RETURNED'}]->(b01);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b02:Book {id: 'BK02'})
MERGE (s02)-[:BORROWED {borrow_date: '2026-09-05', return_date: '2026-09-20', status: 'RETURNED'}]->(b02);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b03:Book {id: 'BK03'})
MERGE (s02)-[:BORROWED {borrow_date: '2026-09-25', return_date: '2026-10-10', status: 'RETURNED'}]->(b03);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b24:Book {id: 'BK24'})
MERGE (s02)-[:BORROWED {borrow_date: '2026-10-12', return_date: '2026-10-28', status: 'RETURNED'}]->(b24);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b18:Book {id: 'BK18'})
MERGE (s02)-[:BORROWED {borrow_date: '2026-11-02', return_date: '2026-11-19', status: 'ACTIVE'}]->(b18);

// Neville Richard Smith (1MS24CS109) - Overlaps with Kaneesh & Kaustubh on BK01, BK04; also read BK21 (Clean Coder), BK05 (AI), BK13 (DB Concepts)
MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s03)-[:BORROWED {borrow_date: '2026-08-20', return_date: '2026-09-05', status: 'RETURNED'}]->(b01);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b04:Book {id: 'BK04'})
MERGE (s03)-[:BORROWED {borrow_date: '2026-09-10', return_date: '2026-09-26', status: 'RETURNED'}]->(b04);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b21:Book {id: 'BK21'})
MERGE (s03)-[:BORROWED {borrow_date: '2026-10-02', return_date: '2026-10-18', status: 'RETURNED'}]->(b21);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b05:Book {id: 'BK05'})
MERGE (s03)-[:BORROWED {borrow_date: '2026-10-20', return_date: '2026-11-08', status: 'RETURNED'}]->(b05);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b13:Book {id: 'BK13'})
MERGE (s03)-[:BORROWED {borrow_date: '2026-11-10', return_date: '2026-11-25', status: 'ACTIVE'}]->(b13);

// Ananya Sharma (1MS24CS012) - AI & Deep Learning Enthusiast
MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b05:Book {id: 'BK05'})
MERGE (s04)-[:BORROWED {borrow_date: '2026-08-12', return_date: '2026-08-28', status: 'RETURNED'}]->(b05);

MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b09:Book {id: 'BK09'})
MERGE (s04)-[:BORROWED {borrow_date: '2026-09-01', return_date: '2026-09-17', status: 'RETURNED'}]->(b09);

MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b10:Book {id: 'BK10'})
MERGE (s04)-[:BORROWED {borrow_date: '2026-09-20', return_date: '2026-10-06', status: 'RETURNED'}]->(b10);

MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b25:Book {id: 'BK25'})
MERGE (s04)-[:BORROWED {borrow_date: '2026-10-15', return_date: '2026-11-01', status: 'RETURNED'}]->(b25);

// Rohan Verma (1MS24CS095) - Systems & Networks Focus
MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b06:Book {id: 'BK06'})
MERGE (s05)-[:BORROWED {borrow_date: '2026-08-14', return_date: '2026-08-30', status: 'RETURNED'}]->(b06);

MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b07:Book {id: 'BK07'})
MERGE (s05)-[:BORROWED {borrow_date: '2026-09-05', return_date: '2026-09-22', status: 'RETURNED'}]->(b07);

MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b08:Book {id: 'BK08'})
MERGE (s05)-[:BORROWED {borrow_date: '2026-09-28', return_date: '2026-10-15', status: 'RETURNED'}]->(b08);

MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b16:Book {id: 'BK16'})
MERGE (s05)-[:BORROWED {borrow_date: '2026-10-18', return_date: '2026-11-04', status: 'RETURNED'}]->(b16);

// Priya Nair (1MS24CS088) - Web, Clean Code, Sci-Fi
MERGE (s06:Student {usn: '1MS24CS088'})
MERGE (b02:Book {id: 'BK02'})
MERGE (s06)-[:BORROWED {borrow_date: '2026-08-25', return_date: '2026-09-10', status: 'RETURNED'}]->(b02);

MERGE (s06:Student {usn: '1MS24CS088'})
MERGE (b20:Book {id: 'BK20'})
MERGE (s06)-[:BORROWED {borrow_date: '2026-09-15', return_date: '2026-10-01', status: 'RETURNED'}]->(b20);

MERGE (s06:Student {usn: '1MS24CS088'})
MERGE (b19:Book {id: 'BK19'})
MERGE (s06)-[:BORROWED {borrow_date: '2026-10-05', return_date: '2026-10-20', status: 'RETURNED'}]->(b19);

// Aditya Rao (1MS24CS005) - Theory of Computation, Algorithms
MERGE (s07:Student {usn: '1MS24CS005'})
MERGE (b04:Book {id: 'BK04'})
MERGE (s07)-[:BORROWED {borrow_date: '2026-09-01', return_date: '2026-09-18', status: 'RETURNED'}]->(b04);

MERGE (s07:Student {usn: '1MS24CS005'})
MERGE (b12:Book {id: 'BK12'})
MERGE (s07)-[:BORROWED {borrow_date: '2026-09-22', return_date: '2026-10-09', status: 'RETURNED'}]->(b12);

MERGE (s07:Student {usn: '1MS24CS005'})
MERGE (b22:Book {id: 'BK22'})
MERGE (s07)-[:BORROWED {borrow_date: '2026-10-14', return_date: '2026-10-31', status: 'RETURNED'}]->(b22);

// Sneha Patel (1MS24CS112) - AI & Algorithms
MERGE (s08:Student {usn: '1MS24CS112'})
MERGE (b05:Book {id: 'BK05'})
MERGE (s08)-[:BORROWED {borrow_date: '2026-08-30', return_date: '2026-09-15', status: 'RETURNED'}]->(b05);

MERGE (s08:Student {usn: '1MS24CS112'})
MERGE (b09:Book {id: 'BK09'})
MERGE (s08)-[:BORROWED {borrow_date: '2026-09-18', return_date: '2026-10-04', status: 'RETURNED'}]->(b09);

MERGE (s08:Student {usn: '1MS24CS112'})
MERGE (b15:Book {id: 'BK15'})
MERGE (s08)-[:BORROWED {borrow_date: '2026-10-10', return_date: '2026-10-27', status: 'RETURNED'}]->(b15);

// Rahul Kulkarni (1MS24CS078) - Databases & Operating Systems
MERGE (s09:Student {usn: '1MS24CS078'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s09)-[:BORROWED {borrow_date: '2026-09-08', return_date: '2026-09-24', status: 'RETURNED'}]->(b01);

MERGE (s09:Student {usn: '1MS24CS078'})
MERGE (b06:Book {id: 'BK06'})
MERGE (s09)-[:BORROWED {borrow_date: '2026-09-29', return_date: '2026-10-16', status: 'RETURNED'}]->(b06);

MERGE (s09:Student {usn: '1MS24CS078'})
MERGE (b13:Book {id: 'BK13'})
MERGE (s09)-[:BORROWED {borrow_date: '2026-10-20', return_date: '2026-11-05', status: 'RETURNED'}]->(b13);

// Varun Deshmukh (1MS24CS124) - Clean Code, Biographies
MERGE (s10:Student {usn: '1MS24CS124'})
MERGE (b02:Book {id: 'BK02'})
MERGE (s10)-[:BORROWED {borrow_date: '2026-08-18', return_date: '2026-09-03', status: 'RETURNED'}]->(b02);

MERGE (s10:Student {usn: '1MS24CS124'})
MERGE (b17:Book {id: 'BK17'})
MERGE (s10)-[:BORROWED {borrow_date: '2026-09-12', return_date: '2026-09-29', status: 'RETURNED'}]->(b17);

MERGE (s10:Student {usn: '1MS24CS124'})
MERGE (b23:Book {id: 'BK23'})
MERGE (s10)-[:BORROWED {borrow_date: '2026-10-06', return_date: '2026-10-23', status: 'RETURNED'}]->(b23);

// Tanvi Hegde (1MS24CS118) - Clean Architecture, Software Design
MERGE (s11:Student {usn: '1MS24CS118'})
MERGE (b03:Book {id: 'BK03'})
MERGE (s11)-[:BORROWED {borrow_date: '2026-09-04', return_date: '2026-09-21', status: 'RETURNED'}]->(b03);

MERGE (s11:Student {usn: '1MS24CS118'})
MERGE (b11:Book {id: 'BK11'})
MERGE (s11)-[:BORROWED {borrow_date: '2026-09-25', return_date: '2026-10-12', status: 'RETURNED'}]->(b11);

// Mohammed Zaid (1MS24CS068) - Distributed Systems, Networks
MERGE (s12:Student {usn: '1MS24CS068'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s12)-[:BORROWED {borrow_date: '2026-09-14', return_date: '2026-09-30', status: 'RETURNED'}]->(b01);

MERGE (s12:Student {usn: '1MS24CS068'})
MERGE (b08:Book {id: 'BK08'})
MERGE (s12)-[:BORROWED {borrow_date: '2026-10-05', return_date: '2026-10-22', status: 'RETURNED'}]->(b08);

MERGE (s12:Student {usn: '1MS24CS068'})
MERGE (b24:Book {id: 'BK24'})
MERGE (s12)-[:BORROWED {borrow_date: '2026-10-26', return_date: '2026-11-12', status: 'RETURNED'}]->(b24);

// ------------------------------------------------------------------------------
// 6. RATINGS & REVIEWS (Student -[:RATED]-> Book)
// ------------------------------------------------------------------------------
MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s01)-[:RATED {stars: 5, review: 'Masterpiece on distributed data systems!'}]->(b01);

MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b02:Book {id: 'BK02'})
MERGE (s01)-[:RATED {stars: 5, review: 'Must read for writing maintainable software.'}]->(b02);

MERGE (s01:Student {usn: '1MS24CS075'})
MERGE (b15:Book {id: 'BK15'})
MERGE (s01)-[:RATED {stars: 4, review: 'Intuitive illustrations for algorithmic basics.'}]->(b15);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s02)-[:RATED {stars: 5, review: 'Unparalleled clarity on consensus and replication.'}]->(b01);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b03:Book {id: 'BK03'})
MERGE (s02)-[:RATED {stars: 5, review: 'Solidified my understanding of SOLID & decoupled boundaries.'}]->(b03);

MERGE (s02:Student {usn: '1MS24CS080'})
MERGE (b24:Book {id: 'BK24'})
MERGE (s02)-[:RATED {stars: 4, review: 'Rigorous academic textbook on distributed computing.'}]->(b24);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b01:Book {id: 'BK01'})
MERGE (s03)-[:RATED {stars: 5, review: 'Best computer science book I have read in engineering.'}]->(b01);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b04:Book {id: 'BK04'})
MERGE (s03)-[:RATED {stars: 4, review: 'The bible of algorithms. Heavy proofs but invaluable.'}]->(b04);

MERGE (s03:Student {usn: '1MS24CS109'})
MERGE (b21:Book {id: 'BK21'})
MERGE (s03)-[:RATED {stars: 5, review: 'Great insights on professional ethics and estimation.'}]->(b21);

MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b05:Book {id: 'BK05'})
MERGE (s04)-[:RATED {stars: 5, review: 'Comprehensive survey of classic and modern AI.'}]->(b05);

MERGE (s04:Student {usn: '1MS24CS012'})
MERGE (b09:Book {id: 'BK09'})
MERGE (s04)-[:RATED {stars: 5, review: 'Essential deep learning theory and backpropagation math.'}]->(b09);

MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b06:Book {id: 'BK06'})
MERGE (s05)-[:RATED {stars: 4, review: 'Standard reference for OS concepts and virtual memory.'}]->(b06);

MERGE (s05:Student {usn: '1MS24CS095'})
MERGE (b08:Book {id: 'BK08'})
MERGE (s05)-[:RATED {stars: 4, review: 'Thorough coverage of OSI and TCP/IP stack.'}]->(b08);

MERGE (s06:Student {usn: '1MS24CS088'})
MERGE (b19:Book {id: 'BK19'})
MERGE (s06)-[:RATED {stars: 5, review: 'Hilarious sci-fi classic! 42 is the answer.'}]->(b19);

MERGE (s08:Student {usn: '1MS24CS112'})
MERGE (b05:Book {id: 'BK05'})
MERGE (s08)-[:RATED {stars: 5, review: 'Excellent textbook for our AI course.'}]->(b05);

MERGE (s10:Student {usn: '1MS24CS124'})
MERGE (b17:Book {id: 'BK17'})
MERGE (s10)-[:RATED {stars: 5, review: 'Fascinating story of visionary tech leadership.'}]->(b17);
