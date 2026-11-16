// ==============================================================================
// BookGraph - Graph-Native Library Recommendation System
// Script 01: Schema Definition, Constraints & Indexes
// ==============================================================================

// 1. Uniqueness Constraints (Ensure entity identity and auto-index primary keys)
CREATE CONSTRAINT student_usn_unique IF NOT EXISTS
FOR (s:Student) REQUIRE s.usn IS UNIQUE;

CREATE CONSTRAINT book_id_unique IF NOT EXISTS
FOR (b:Book) REQUIRE b.id IS UNIQUE;

CREATE CONSTRAINT author_id_unique IF NOT EXISTS
FOR (a:Author) REQUIRE a.id IS UNIQUE;

CREATE CONSTRAINT genre_id_unique IF NOT EXISTS
FOR (g:Genre) REQUIRE g.id IS UNIQUE;

// 2. Indexes for Quick Pattern Matching and Search Performance
CREATE INDEX book_title_index IF NOT EXISTS
FOR (b:Book) ON (b.title);

CREATE INDEX author_name_index IF NOT EXISTS
FOR (a:Author) ON (a.name);

CREATE INDEX genre_name_index IF NOT EXISTS
FOR (g:Genre) ON (g.name);

CREATE INDEX student_name_index IF NOT EXISTS
FOR (s:Student) ON (s.name);

// Display active constraints and indexes
SHOW CONSTRAINTS;
SHOW INDEXES;
