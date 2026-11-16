// ==============================================================================
// BookGraph - Vis.js Network Visualization Handler
// ==============================================================================

let network = null;
let allNodes = [];
let allEdges = [];
let nodesDataSet = null;
let edgesDataSet = null;

function initNetwork(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  allNodes = data.nodes || [];
  allEdges = data.edges || [];

  nodesDataSet = new vis.DataSet(allNodes);
  edgesDataSet = new vis.DataSet(allEdges);

  const graphData = {
    nodes: nodesDataSet,
    edges: edgesDataSet
  };

  const options = {
    nodes: {
      borderWidth: 2,
      shadow: true,
      font: {
        face: 'Inter',
        size: 12
      }
    },
    edges: {
      width: 1.5,
      shadow: false,
      smooth: {
        type: 'continuous',
        roundness: 0.2
      },
      arrows: {
        to: { enabled: true, scaleFactor: 0.6 }
      }
    },
    physics: {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -40,
        centralGravity: 0.008,
        springLength: 120,
        springConstant: 0.08,
        damping: 0.4
      },
      stabilization: {
        iterations: 150,
        updateInterval: 25
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 100,
      zoomView: true,
      dragView: true,
      navigationButtons: true
    }
  };

  network = new vis.Network(container, graphData, options);

  // Node selection event
  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      const selectedId = params.nodes[0];
      const node = allNodes.find(n => n.id === selectedId);
      displayNodeInspector(node);
    } else {
      hideNodeInspector();
    }
  });

  network.on('stabilizationProgress', function (params) {
    const loader = document.getElementById('graph-loader');
    if (loader) {
      const pct = Math.round((params.iterations / params.total) * 100);
      loader.innerText = `Stabilizing graph layout... ${pct}%`;
    }
  });

  network.on('stabilizationIterationsDone', function () {
    const loader = document.getElementById('graph-loader');
    if (loader) loader.style.display = 'none';
  });

  return network;
}

// Display Node Inspector Panel on Click
function displayNodeInspector(node) {
  const panel = document.getElementById('node-inspector');
  if (!panel || !node) return;

  panel.classList.remove('hidden');

  document.getElementById('inspector-title').innerText = node.label || node.id;
  document.getElementById('inspector-type').innerText = node.group;
  document.getElementById('inspector-type').className = `px-2 py-0.5 text-xs font-semibold rounded-full ${
    node.group === 'Student' ? 'bg-blue-100 text-blue-800' :
    node.group === 'Book' ? 'bg-emerald-100 text-emerald-800' :
    node.group === 'Author' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
  }`;

  // Connected edges count
  const connectedEdges = allEdges.filter(e => e.from === node.id || e.to === node.id);
  document.getElementById('inspector-connections').innerText = `${connectedEdges.length} relationship(s)`;

  // Details
  const detailsContainer = document.getElementById('inspector-details');
  detailsContainer.innerHTML = node.title || 'No additional properties';
}

function hideNodeInspector() {
  const panel = document.getElementById('node-inspector');
  if (panel) panel.classList.add('hidden');
}

// Filter nodes by group or student
function filterGraph(group, studentUsn) {
  if (!nodesDataSet || !edgesDataSet) return;

  let filteredNodes = allNodes;

  if (studentUsn && studentUsn !== 'all') {
    // Student Ego Network
    const directEdges = allEdges.filter(e => e.from === studentUsn || e.to === studentUsn);
    const neighborIds = new Set([studentUsn, ...directEdges.map(e => e.from === studentUsn ? e.to : e.from)]);

    // Expand 1 more hop for books to show authors/genres
    allEdges.forEach(e => {
      if (neighborIds.has(e.from)) neighborIds.add(e.to);
    });

    filteredNodes = allNodes.filter(n => neighborIds.has(n.id));
  } else if (group && group !== 'all') {
    filteredNodes = allNodes.filter(n => n.group.toLowerCase() === group.toLowerCase());
  }

  const visibleIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = allEdges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to));

  nodesDataSet.clear();
  edgesDataSet.clear();
  nodesDataSet.add(filteredNodes);
  edgesDataSet.add(filteredEdges);

  if (network) network.fit();
}

function resetGraphView() {
  if (!nodesDataSet || !edgesDataSet) return;
  nodesDataSet.clear();
  edgesDataSet.clear();
  nodesDataSet.add(allNodes);
  edgesDataSet.add(allEdges);
  if (network) network.fit();
}

function togglePhysics(enabled) {
  if (network) {
    network.setOptions({ physics: { enabled } });
  }
}

// Select, zoom to, and open inspector for a specific node
function focusNode(nodeId) {
  if (!network || !nodesDataSet) return;

  // Ensure node is currently in the dataset
  if (!nodesDataSet.get(nodeId)) {
    resetGraphView();
  }

  network.selectNodes([nodeId]);
  network.focus(nodeId, {
    scale: 1.3,
    animation: {
      duration: 800,
      easingFunction: 'easeInOutQuad'
    }
  });

  const node = allNodes.find(n => n.id === nodeId);
  if (node) {
    displayNodeInspector(node);
  }
}
