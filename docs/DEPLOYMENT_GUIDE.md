# BookGraph Deployment Guide: Render & Vercel

This guide provides end-to-end instructions for deploying **BookGraph – Library Book Recommendation System** to **Render** or **Vercel** with a public, shareable URL.

---

## 🚀 Pre-requisite: Push Code to GitHub

Both Render and Vercel support direct continuous deployment from GitHub.

If you haven't pushed this repository to GitHub yet:

1. Create a new repository on [GitHub](https://github.com/new) named `bookgraph` (keep it Public or Private).
2. Open terminal in `C:\Users\kanee\.gemini\antigravity\scratch\bookgraph` and run:
   ```bash
   git remote add origin https://github.com/<your-username>/bookgraph.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Method 1: Deploy to Render (Recommended for Express & Node.js)

Render runs full persistent Node.js web services with built-in HTTPS and support for live database pooling.

### Steps:

1. **Log in to Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.

2. **Create New Web Service**:
   - Click the blue **"New +"** button in the top right.
   - Select **"Web Service"**.
   - Choose **"Build and deploy from a Git repository"** and click **Next**.
   - Select your `bookgraph` repository.

3. **Configure Settings**:
   - **Name**: `bookgraph-app` (or any custom name)
   - **Region**: Choose the closest region (e.g., *Singapore*, *Frankfurt*, or *Oregon*)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root `./`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Environment Variables (Optional for Live Neo4j)**:
   - Click **"Advanced"** -> **"Add Environment Variable"**:
     | Key | Recommended Value | Note |
     | :--- | :--- | :--- |
     | `NODE_ENV` | `production` | Enables production optimizations |
     | `NEO4J_URI` | `neo4j+s://<db-id>.databases.neo4j.io` | *(Optional)* If using Neo4j AuraDB |
     | `NEO4J_USER` | `neo4j` | *(Optional)* AuraDB username |
     | `NEO4J_PASSWORD` | `<your-password>` | *(Optional)* AuraDB password |
     | `NEO4J_DATABASE` | `neo4j` | Default database |
   > **Note:** If you do not provide Neo4j credentials, BookGraph will automatically run in **High-Fidelity Graph Simulation Mode**, so the site will work 100% out of the box!

5. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will build the package and deploy. Within 1–2 minutes, your website is live at:
     `https://bookgraph-app.onrender.com`

---

## ⚡ Method 2: Deploy to Vercel (Fast Serverless Deployment)

BookGraph includes full Vercel serverless adapter configuration (`vercel.json` and `api/index.js`).

### Option A: 1-Command CLI Deployment (Fastest)

1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd C:\Users\kanee\.gemini\antigravity\scratch\bookgraph
   npx vercel
   ```
2. Log in with your browser (GitHub, GitLab, or Email).
3. Answer the interactive setup prompts:
   - *Set up and deploy?* `Y`
   - *Which scope?* (Select your personal account)
   - *Link to existing project?* `N`
   - *What's your project's name?* `bookgraph`
   - *In which directory is your code located?* `./` (Press Enter)
   - *Want to modify these settings?* `N` (Press Enter)
4. Vercel will upload and deploy the application. It will print your live URL:
   `https://bookgraph-<your-username>.vercel.app`

### Option B: Deploy via Vercel Web Dashboard

1. Visit [vercel.com/new](https://vercel.com/new).
2. Click **"Import"** next to your `bookgraph` GitHub repository.
3. Keep default settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: (leave blank or `npm install`)
   - **Output Directory**: (leave blank)
4. (Optional) Under **Environment Variables**, add `NEO4J_URI`, `NEO4J_USER`, and `NEO4J_PASSWORD` if connecting to a live Neo4j AuraDB cloud instance.
5. Click **"Deploy"**. Your application will be live in ~30 seconds.

---

## ☁️ Optional: Setting up Free Neo4j AuraDB Cloud Database

If you want the deployed web application to query a live graph database in the cloud:

1. Sign up for free at [neo4j.com/cloud/platform/aura-graph-database/](https://neo4j.com/cloud/platform/aura-graph-database/).
2. Click **"New Instance"** and select **"AuraDB Free"**.
3. Download the `.txt` credentials file containing your **URI** (`neo4j+s://...`) and **Password**.
4. Open the **Neo4j Workspace / Query Editor** in your browser.
5. Copy and execute the contents of:
   - `cypher/01_schema.cypher` (creates constraints and indexes)
   - `cypher/02_seed_data.cypher` (populates 40 books, 12 students, 18 authors, genres, and loans)
6. Add the credentials to your Render or Vercel environment variables.

---

## 🔍 Verification Checklist

After deploying to Render or Vercel, verify these endpoints:

| Feature | URL Path | Verification |
| :--- | :--- | :--- |
| **Homepage** | `/` | Responsive UI with tabs |
| **API Health** | `/api/status` | Returns `{ success: true, databaseStatus: ... }` |
| **Interactive Graph** | `/#graph` | Vis.js network canvas with physics nodes |
| **Recommendations** | `/#recommend` | Collaborative, content & hybrid cards render |
| **Cypher Lab** | `/#cypher` | Predefined queries execute and return results |
| **Circulation** | `/#catalog` | Book borrowing, returns, and reviews operate |
| **Analytics** | `/#analytics` | Degree centrality, co-borrowing clusters, & metrics display |
