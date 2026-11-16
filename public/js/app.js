// ==============================================================================
// BookGraph - Core Application Logic
// ==============================================================================

const API_BASE = '/api';
let currentTab = 'graph';
let studentsList = [];
let booksList = [];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  await checkSystemStatus();
  await loadStudents();
  await loadCatalog();
  await loadGraphView();
  await loadPredefinedQueries();

  // Listen for hash change for direct bookmarking
  window.addEventListener('hashchange', handleHashRouting);
  handleHashRouting();
});

// 1. Navigation Routing
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-target');
      window.location.hash = target;
    });
  });
}

function handleHashRouting() {
  const hash = window.location.hash.replace('#', '') || 'graph';
  switchTab(hash);
}

function switchTab(tabId) {
  currentTab = tabId;

  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-target') === tabId) {
      tab.classList.add('bg-blue-800', 'text-white', 'shadow');
      tab.classList.remove('text-slate-600', 'hover:bg-slate-100');
    } else {
      tab.classList.remove('bg-blue-800', 'text-white', 'shadow');
      tab.classList.add('text-slate-600', 'hover:bg-slate-100');
    }
  });

  // Update view visibility
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.add('hidden');
  });

  const activeView = document.getElementById(`view-${tabId}`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  // Action on switch
  if (tabId === 'graph') {
    setTimeout(() => {
      if (network) network.fit();
    }, 200);
  }
}

// 2. System Status & Neo4j Connectivity
async function checkSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    const data = await res.json();
    const pill = document.getElementById('db-status-pill');

    if (data.databaseStatus?.connected) {
      pill.innerHTML = `
        <span class="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2"></span>
        <span class="text-xs font-semibold text-emerald-800">Neo4j Live: ${data.databaseStatus.uri}</span>
      `;
      pill.className = 'flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full';
    } else {
      pill.innerHTML = `
        <span class="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full mr-2"></span>
        <span class="text-xs font-semibold text-amber-800">Graph Simulation Mode (Ready)</span>
      `;
      pill.className = 'flex items-center px-3 py-1 bg-amber-50 border border-amber-200 rounded-full cursor-pointer';
      pill.title = 'Running high-fidelity graph simulator. Click for Neo4j connection guide.';
      pill.onclick = () => window.location.hash = 'docs';
    }
  } catch (err) {
    console.warn('Status check warning:', err.message);
  }
}

// 3. Load Graph Visualizer
async function loadGraphView() {
  try {
    const res = await fetch(`${API_BASE}/graph`);
    const data = await res.json();

    if (data.success) {
      document.getElementById('stat-nodes').innerText = data.stats.totalNodes;
      document.getElementById('stat-edges').innerText = data.stats.totalEdges;
      document.getElementById('stat-students').innerText = data.stats.students;
      document.getElementById('stat-books').innerText = data.stats.books;

      initNetwork('network-container', data);
    }
  } catch (err) {
    console.error('Failed to load graph:', err);
  }
}

// 4. Load Students into Selectors
async function loadStudents() {
  try {
    const res = await fetch(`${API_BASE}/students`);
    const data = await res.json();
    studentsList = data.students || [];

    const recStudentSelect = document.getElementById('rec-student-select');
    const egoStudentSelect = document.getElementById('filter-student-ego');
    const modalStudentSelect = document.getElementById('borrow-student-select');
    const pathStudent1 = document.getElementById('path-student-1');
    const pathStudent2 = document.getElementById('path-student-2');

    let optionsHtml = '';
    studentsList.forEach(s => {
      // Default to Kaneeshkumar G K (1MS24CS075)
      const selected = s.usn === '1MS24CS075' ? 'selected' : '';
      optionsHtml += `<option value="${s.usn}" ${selected}>${s.name} (${s.usn})</option>`;
    });

    if (recStudentSelect) recStudentSelect.innerHTML = optionsHtml;
    if (egoStudentSelect) egoStudentSelect.innerHTML = '<option value="all">Entire Campus Graph</option>' + optionsHtml;
    if (modalStudentSelect) modalStudentSelect.innerHTML = optionsHtml;
    if (pathStudent1) pathStudent1.innerHTML = optionsHtml;

    if (pathStudent2) {
      let pathOptions = '';
      studentsList.forEach(s => {
        const selected = s.usn === '1MS24CS112' ? 'selected' : ''; // Sneha Patel
        pathOptions += `<option value="${s.usn}" ${selected}>${s.name} (${s.usn})</option>`;
      });
      pathStudent2.innerHTML = pathOptions;
    }

    // Auto-run recommendation for initial student
    generateRecommendations();
  } catch (err) {
    console.error('Failed to load students:', err);
  }
}

// 5. Recommendation Engine
async function generateRecommendations() {
  const usn = document.getElementById('rec-student-select')?.value || '1MS24CS075';
  const algo = document.getElementById('rec-algo-select')?.value || 'collaborative';
  const container = document.getElementById('recommendations-container');
  const queryBox = document.getElementById('rec-cypher-code');
  const badgeBox = document.getElementById('rec-algo-badge');

  if (!container) return;

  container.innerHTML = `
    <div class="col-span-full py-12 text-center text-slate-500">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600 mb-3"></i>
      <p>Traversing graph relationships and computing recommendations...</p>
    </div>
  `;

  try {
    let endpoint = `${API_BASE}/recommendations/${algo}/${usn}`;
    if (algo === 'degrees') {
      const s1 = document.getElementById('path-student-1')?.value;
      const s2 = document.getElementById('path-student-2')?.value;
      endpoint = `${API_BASE}/recommendations/degrees?student1=${s1}&student2=${s2}`;
    }

    const res = await fetch(endpoint);
    const data = await res.json();

    if (!data.success) {
      container.innerHTML = `<div class="col-span-full p-4 bg-red-50 text-red-700 rounded-lg">${data.message || 'Error'}</div>`;
      return;
    }

    // Display Cypher statement
    if (queryBox) queryBox.innerText = data.cypherQuery.trim();
    if (badgeBox) badgeBox.innerText = data.algorithm;

    // Special view for Degrees of Reading (Shortest Path)
    if (algo === 'degrees') {
      renderShortestPathResult(container, data);
      return;
    }

    const recs = data.recommendations || [];
    if (recs.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
          <i class="fa-solid fa-book-open text-4xl text-slate-400 mb-2"></i>
          <p class="font-medium text-slate-700">No new recommendations found with current parameters.</p>
          <p class="text-sm text-slate-500 mt-1">Try switching the algorithm or selecting another student.</p>
        </div>
      `;
      return;
    }

    let cardsHtml = '';
    recs.forEach((rec, idx) => {
      const scoreBadge = rec.PeerScore
        ? `<span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Peer Support: ${rec.PeerScore}</span>`
        : rec.HybridScore
        ? `<span class="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Hybrid Score: ${rec.HybridScore}</span>`
        : `<span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Affinity Score: ${rec.AffinityScore}</span>`;

      cardsHtml += `
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="text-xs font-mono font-bold text-slate-400">#${idx + 1} • ${rec.BookID}</span>
              ${scoreBadge}
            </div>
            <h4 class="font-bold text-slate-800 text-base leading-snug mb-1">${rec.Title}</h4>
            <p class="text-xs text-slate-500 mb-2">By <span class="font-medium text-slate-700">${rec.Authors ? rec.Authors.join(', ') : 'Unknown'}</span></p>
            <div class="mb-3">
              <span class="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">${rec.Genre}</span>
            </div>
            <div class="bg-blue-50/70 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-900 mb-4">
              <i class="fa-solid fa-circle-nodes text-blue-600 mr-1.5"></i>
              <span>${rec.Reason || 'Matches your reading network preferences.'}</span>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-400">RIT Library</span>
            <button onclick="openBorrowModal('${rec.BookID}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5">
              <i class="fa-solid fa-bookmark"></i> Borrow Book
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;
  } catch (err) {
    container.innerHTML = `<div class="col-span-full p-4 bg-red-50 text-red-700 rounded-lg">${err.message}</div>`;
  }
}

function renderShortestPathResult(container, data) {
  if (!data.path) {
    container.innerHTML = `<div class="col-span-full p-6 text-center text-slate-500">No connection path found between these two students.</div>`;
    return;
  }

  let stepsHtml = '';
  data.path.forEach((node, idx) => {
    const isStudent = node.type === 'Student';
    stepsHtml += `
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center ${isStudent ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'} shadow-sm">
          <i class="fa-solid ${isStudent ? 'fa-user-graduate' : 'fa-book'} text-lg"></i>
        </div>
        <span class="text-xs font-semibold text-slate-800 mt-2 text-center max-w-[130px] line-clamp-2">${node.name}</span>
        <span class="text-[10px] text-slate-400 font-mono">${node.type}</span>
      </div>
    `;

    if (idx < data.path.length - 1) {
      stepsHtml += `
        <div class="flex items-center text-slate-400 px-2">
          <i class="fa-solid fa-arrow-right-long text-xl"></i>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="col-span-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 class="font-bold text-slate-800 text-lg">Degrees of Reading Distance: ${data.distance} Hop(s)</h3>
          <p class="text-xs text-slate-500">Shows how ${data.student1.name} and ${data.student2.name} are interconnected through library books.</p>
        </div>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-xs">shortestPath Cypher</span>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2 py-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
        ${stepsHtml}
      </div>
    </div>
  `;
}

// 6. Cypher Query Lab
async function loadPredefinedQueries() {
  try {
    const res = await fetch(`${API_BASE}/cypher/predefined`);
    const data = await res.json();
    const container = document.getElementById('predefined-queries-list');
    if (!container || !data.queries) return;

    let html = '';
    data.queries.forEach(q => {
      html += `
        <button onclick="selectQuery('${q.id}', \`${escapeQuery(q.cypher)}\`)" class="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition mb-2">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-slate-800 text-xs">${q.title}</span>
            <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">${q.category}</span>
          </div>
          <p class="text-xs text-slate-500 line-clamp-1">${q.description}</p>
        </button>
      `;
    });
    container.innerHTML = html;

    // Select first query by default
    if (data.queries.length > 0) {
      selectQuery(data.queries[0].id, data.queries[0].cypher);
    }
  } catch (err) {
    console.error('Failed to load predefined queries:', err);
  }
}

function selectQuery(id, cypher) {
  const editor = document.getElementById('cypher-editor');
  if (editor) editor.value = cypher.trim();
  editor.dataset.currentQueryId = id;
}

function escapeQuery(str) {
  return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

async function executeCypherQuery() {
  const editor = document.getElementById('cypher-editor');
  const query = editor?.value;
  const queryId = editor?.dataset.currentQueryId;
  const resultsContainer = document.getElementById('cypher-results');

  if (!query) return;

  resultsContainer.innerHTML = `
    <div class="py-8 text-center text-slate-500">
      <i class="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
      <p class="text-xs">Executing Cypher query against graph engine...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/cypher/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, queryId })
    });
    const data = await res.json();

    if (!data.success) {
      resultsContainer.innerHTML = `<div class="p-4 bg-red-50 text-red-700 text-xs rounded-lg">${data.error || 'Execution failed'}</div>`;
      return;
    }

    document.getElementById('cypher-execution-time').innerText = `${data.executionTimeMs} ms`;
    document.getElementById('cypher-record-count').innerText = `${data.count} rows`;
    document.getElementById('cypher-engine-mode').innerText = data.mode;

    const results = data.results || [];
    if (results.length === 0) {
      resultsContainer.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">Query completed successfully (0 rows returned).</div>`;
      return;
    }

    // Dynamic Table Generation
    const headers = Object.keys(results[0]);
    let tableHtml = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              ${headers.map(h => `<th class="px-4 py-2.5">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            ${results.map(row => `
              <tr class="hover:bg-slate-50/80">
                ${headers.map(h => {
                  let val = row[h];
                  if (Array.isArray(val)) val = val.join(', ');
                  if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                  return `<td class="px-4 py-2 text-slate-700">${val ?? 'null'}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    resultsContainer.innerHTML = tableHtml;
  } catch (err) {
    resultsContainer.innerHTML = `<div class="p-4 bg-red-50 text-red-700 text-xs rounded-lg">${err.message}</div>`;
  }
}

// 7. Library Catalog & Actions
async function loadCatalog() {
  const container = document.getElementById('books-catalog-grid');
  if (!container) return;

  const search = document.getElementById('catalog-search')?.value || '';
  const genre = document.getElementById('catalog-genre-filter')?.value || 'all';

  try {
    const res = await fetch(`${API_BASE}/books?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(genre)}`);
    const data = await res.json();
    booksList = data.books || [];

    let cardsHtml = '';
    booksList.forEach(b => {
      const isAvail = b.isAvailable;
      const statusBadge = isAvail
        ? `<span class="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">Available</span>`
        : `<span class="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold pulse-badge">Checked Out (${b.borrowedBy})</span>`;

      cardsHtml += `
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono font-bold text-slate-400">${b.id}</span>
              ${statusBadge}
            </div>
            <h4 class="font-bold text-slate-800 text-sm mb-1 leading-snug">${b.title}</h4>
            <p class="text-xs text-slate-500 mb-2">By ${b.authors.join(', ')}</p>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span class="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded">${b.genreName}</span>
              <span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-mono">Shelf: ${b.shelf}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-500 mb-4">
              <span><i class="fa-solid fa-star text-amber-400 mr-1"></i>${b.avgRating} (${b.ratingsCount})</span>
              <span>•</span>
              <span><i class="fa-solid fa-clock-rotate-left mr-1"></i>${b.totalBorrows} borrows</span>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button onclick="openRateModal('${b.id}', '${escapeQuery(b.title)}')" class="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-600 transition flex items-center gap-1">
              <i class="fa-regular fa-star text-amber-500"></i> Rate
            </button>
            <button onclick="openBorrowModal('${b.id}')" ${!isAvail ? 'disabled' : ''} class="px-3 py-1.5 ${isAvail ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} rounded-lg text-xs font-medium transition flex items-center gap-1.5">
              <i class="fa-solid fa-bookmark"></i> ${isAvail ? 'Borrow' : 'Loaned'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = cardsHtml;
  } catch (err) {
    console.error('Failed to load catalog:', err);
  }
}

// 8. Borrow & Rate Modals
let activeModalBookId = null;

function openBorrowModal(bookId) {
  activeModalBookId = bookId;
  const book = booksList.find(b => b.id === bookId);
  document.getElementById('modal-borrow-title').innerText = book ? `Borrow "${book.title}"` : 'Borrow Book';
  document.getElementById('borrow-modal').classList.remove('hidden');
}

function closeBorrowModal() {
  document.getElementById('borrow-modal').classList.add('hidden');
}

async function submitBorrow() {
  const usn = document.getElementById('borrow-student-select').value;
  try {
    const res = await fetch(`${API_BASE}/library/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usn, bookId: activeModalBookId })
    });
    const data = await res.json();
    alert(data.message || (data.success ? 'Book Borrowed!' : 'Error'));
    closeBorrowModal();
    await loadCatalog();
    await loadGraphView();
  } catch (err) {
    alert('Failed to borrow book: ' + err.message);
  }
}

function openRateModal(bookId, title) {
  activeModalBookId = bookId;
  document.getElementById('modal-rate-title').innerText = `Rate "${title}"`;
  document.getElementById('rate-modal').classList.remove('hidden');
}

function closeRateModal() {
  document.getElementById('rate-modal').classList.add('hidden');
}

async function submitRating() {
  const usn = document.getElementById('borrow-student-select').value;
  const stars = document.getElementById('rate-stars').value;
  const review = document.getElementById('rate-review').value;

  try {
    const res = await fetch(`${API_BASE}/library/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usn, bookId: activeModalBookId, stars, review })
    });
    const data = await res.json();
    alert(data.message || 'Rating submitted!');
    closeRateModal();
    await loadCatalog();
    await loadGraphView();
  } catch (err) {
    alert('Failed to rate: ' + err.message);
  }
}
