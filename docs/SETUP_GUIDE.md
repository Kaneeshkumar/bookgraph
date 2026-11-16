# BookGraph - Setup & Deployment Guide

This guide explains how to run **BookGraph** locally on your machine and connect it to a Neo4j database (either free cloud **Neo4j AuraDB**, local **Neo4j Desktop**, or **Docker**).

---

## Quickstart (Zero-Setup Mode)
You can run the full application right now without installing Java or Neo4j. The backend includes an integrated high-fidelity graph simulator that delivers all interactive Vis.js visualizations, Cypher queries, and recommendations out of the box.

```bash
cd C:\Users\kanee\.gemini\antigravity\scratch\bookgraph
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Option A: Connect to Free Cloud Neo4j (Neo4j AuraDB) – Recommended
Neo4j Aura is a free, managed cloud graph database hosted by Neo4j. It requires **no local software installation** and works from anywhere.

1. **Create Free Account:**
   - Go to [https://neo4j.com/cloud/aura-free/](https://neo4j.com/cloud/aura-free/) and sign up.
2. **Create an Instance:**
   - Select **AuraDB Free**.
   - Download the generated credentials file containing your **Username** (`neo4j`) and **Password**.
   - Note your Connection URI (e.g. `neo4j+s://a1b2c3d4.databases.neo4j.io`).
3. **Configure `.env`:**
   In `scratch/bookgraph/.env`, update:
   ```env
   PORT=3000
   NEO4J_URI=neo4j+s://<your-instance-id>.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<your-generated-password>
   NEO4J_DATABASE=neo4j
   ```
4. **Seed Database:**
   Run the automated seeder script from your terminal:
   ```bash
   npm run seed
   ```
   This will automatically execute the schema constraints and populate all 40 books, 12 students, authors, genres, and borrowing histories into your cloud Neo4j database!
5. **Start Application:**
   ```bash
   npm start
   ```
   The header pill will now display: `Neo4j Live: Connected` in green!

---

## Option B: Run with Docker
If you have Docker Desktop installed:
```bash
docker run -d --name bookgraph-neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:5.26-community
```
Once started, run:
```bash
npm run seed
npm start
```

---

## Option C: Run in Neo4j Browser Manually
If you prefer to run queries directly inside Neo4j Browser (`http://localhost:7474`):
1. Open the Neo4j Browser interface.
2. Open and copy the contents of `cypher/01_schema.cypher` into the query editor bar and press **Ctrl+Enter** (or Run).
3. Open and copy `cypher/02_seed_data.cypher` and execute it.
4. Test any query from `cypher/03_queries.cypher` to view visual graph nodes and relationships!

---

## Verification
- Visit [http://localhost:3000](http://localhost:3000)
- Navigate to **Recommendation Engine** tab, select **Kaneeshkumar G K (1MS24CS075)**, and click **Compute Recommendations**.
- Switch to the **Cypher Query Lab** and execute `Collaborative Filtering Recommendation`.
- Switch to the **Graph Visualizer** to interact with the 2D physics network!
