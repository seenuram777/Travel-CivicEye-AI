// CivicEye AI - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- NAVBAR SCROLL ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('scrolled'); // keep it scrolled style for better contrast in prototype
    }
  });
  
  // Set initial state
  navbar.classList.add('scrolled');

  // --- STATS ANIMATION ---
  const stats = document.querySelectorAll('.stat-num, .stat-card-num');
  
  const animateStats = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += Math.ceil(target / 100);
        if (current >= target) {
          stat.innerText = target.toLocaleString();
          clearInterval(timer);
        } else {
          stat.innerText = current.toLocaleString();
        }
      }, stepTime > 10 ? stepTime : 10);
    });
  };
  
  // Trigger stats on load
  setTimeout(animateStats, 500);

  // --- MAP INITIALIZATION ---
  let map;
  let markers = [];
  
  const initMap = () => {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Default to Bengaluru
    map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView(mapCenter, 13);
    
    // Add custom zoom control position
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Dark theme map tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add mock hazards
    renderMarkers('all');
  };

  const getMarkerColor = (severity) => {
    if (severity === 'high') return '#ef4444'; // danger
    if (severity === 'moderate') return '#f59e0b'; // warning
    return '#3b82f6'; // low
  };

  const renderMarkers = (filterType) => {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    mockHazards.forEach(hazard => {
      if (filterType !== 'all' && hazard.type !== filterType) return;

      const color = getMarkerColor(hazard.severity);
      
      // Create custom div icon for glowing effect
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px ${color}; display: flex; align-items: center; justify-content: center; font-size: 10px;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const popupContent = `
        <div class="custom-popup">
          <div class="popup-title">${hazard.icon} ${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)} Hazard</div>
          <div class="popup-desc">${hazard.desc}</div>
          <div class="popup-meta">
            <span>📍 ${hazard.location}</span>
            <span>⏱️ ${hazard.time}</span>
          </div>
        </div>
      `;

      const marker = L.marker([hazard.lat, hazard.lng], { icon: customIcon })
        .bindPopup(popupContent, {
          closeButton: false,
          className: 'custom-popup-wrapper'
        })
        .addTo(map);
        
      markers.push(marker);
    });
  };

  // Map Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderMarkers(e.target.dataset.filter);
    });
  });

  // Initialize map if on page
  if (document.getElementById('map')) {
    initMap();
  }

  // --- ROUTE PLANNER SIMULATION ---
  const planBtn = document.getElementById('plan-route-btn');
  const emptyState = document.getElementById('empty-state');
  const aiLoading = document.getElementById('ai-loading');
  const routeResults = document.getElementById('route-results');
  
  if (planBtn) {
    planBtn.addEventListener('click', () => {
      const fromVal = document.getElementById('from-input').value;
      const toVal = document.getElementById('to-input').value;
      
      if (!fromVal || !toVal) {
        alert('Please enter both origin and destination');
        return;
      }
      
      // Hide empty state, show loading
      emptyState.style.display = 'none';
      routeResults.style.display = 'none';
      aiLoading.style.display = 'block';
      
      // Simulate AI analysis steps
      const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4')
      ];
      
      steps.forEach(s => s.classList.remove('active'));
      
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex > 0) steps[stepIndex-1].classList.remove('active');
        if (stepIndex < steps.length) {
          steps[stepIndex].classList.add('active');
          stepIndex++;
        } else {
          clearInterval(stepInterval);
          // Show results
          aiLoading.style.display = 'none';
          renderRouteResults();
        }
      }, 800); // 800ms per step
    });
  }
  
  // Swap from/to
  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const fromInput = document.getElementById('from-input');
      const toInput = document.getElementById('to-input');
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
    });
  }
  
  // Travel Modes
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const renderRouteResults = () => {
    routeResults.style.display = 'block';
    
    // Populate cards
    const cardsContainer = document.getElementById('route-cards');
    cardsContainer.innerHTML = `
      <!-- Alternate (Recommended) -->
      <div class="route-card recommended">
        <div class="route-header">
          <div class="route-title">${routeMockData.alternateRoute.name}</div>
          <div class="route-time" style="color: var(--success); font-weight: 700;">${routeMockData.alternateRoute.time}</div>
        </div>
        <div class="route-meta">
          <span>📏 ${routeMockData.alternateRoute.distance}</span>
          <span>✅ Hazard-Free</span>
        </div>
        <div class="safety-score">
          <span style="font-size: 0.85rem; color: var(--text-secondary);">AI Safety Score</span>
          <div class="score-bar">
            <div class="score-fill high" style="width: ${routeMockData.alternateRoute.safetyScore}%"></div>
          </div>
          <span class="score-value" style="color: var(--success)">${routeMockData.alternateRoute.safetyScore}/100</span>
        </div>
      </div>
      
      <!-- Primary (Unsafe) -->
      <div class="route-card" style="opacity: 0.7;">
        <div class="route-header">
          <div class="route-title">${routeMockData.primaryRoute.name}</div>
          <div class="route-time">${routeMockData.primaryRoute.time}</div>
        </div>
        <div class="route-meta">
          <span>📏 ${routeMockData.primaryRoute.distance}</span>
          <span style="color: var(--danger)">⚠️ ${routeMockData.primaryRoute.issues.join(', ')}</span>
        </div>
        <div class="safety-score">
          <span style="font-size: 0.85rem; color: var(--text-secondary);">AI Safety Score</span>
          <div class="score-bar">
            <div class="score-fill low" style="width: ${routeMockData.primaryRoute.safetyScore}%"></div>
          </div>
          <span class="score-value" style="color: var(--danger)">${routeMockData.primaryRoute.safetyScore}/100</span>
        </div>
      </div>
    `;
    
    // Populate Advisory
    const advisoryText = document.getElementById('advisory-text');
    const advisoryTags = document.getElementById('advisory-tags');
    
    advisoryText.innerHTML = `Avoid the primary route via Outer Ring Road. Civic intelligence indicates severe flooding (90% probability) and multiple deep potholes. <strong>Alternate route via Inner Ring Road is 10 mins longer but improves your safety score by 53%.</strong>`;
    
    advisoryTags.innerHTML = `
      <span class="tag" style="border-color: rgba(16,185,129,0.3); color: var(--success);">✅ Flood Avoided</span>
      <span class="tag" style="border-color: rgba(16,185,129,0.3); color: var(--success);">✅ Smoother Surface</span>
      <span class="tag" style="border-color: rgba(139,92,246,0.3); color: var(--accent-purple);">🤖 AI Optimized</span>
    `;
    
    // Update map to show routes if map exists
    if (map) {
      // Clear old route layers if any
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
      
      // Mock coordinates for primary route (danger)
      const primaryCoords = [
        [12.9569, 77.7011], // Marathahalli
        [12.9345, 77.6746], // Bellandur
        [12.9121, 77.6446]  // HSR
      ];
      
      // Mock coordinates for alt route (safe)
      const altCoords = [
        [12.9569, 77.7011], // Marathahalli
        [12.9698, 77.6499], // Indiranagar
        [12.9279, 77.6271], // Koramangala
        [12.9121, 77.6446]  // HSR
      ];
      
      // Draw routes
      L.polyline(primaryCoords, { color: '#ef4444', weight: 4, dashArray: '5, 10', opacity: 0.6 }).addTo(map);
      L.polyline(altCoords, { color: '#10b981', weight: 6, opacity: 0.9 }).addTo(map);
      
      // Zoom to fit bounds
      const bounds = L.latLngBounds([...primaryCoords, ...altCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  // --- REPORT HAZARD SIMULATION ---
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const reportEmpty = document.getElementById('report-empty');
  const detectionResult = document.getElementById('detection-result');
  
  if (uploadZone) {
    // Drag & Drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFile(e.target.files[0]);
      }
    });
  }
  
  const handleFile = (file) => {
    // Simulate image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('upload-preview');
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.style.display = 'block';
      
      // Update form
      document.querySelector('.hazard-type-btn[data-type="flood"]').click();
      document.getElementById('report-location').value = 'Bellandur Lake Road, Bengaluru';
    };
    reader.readAsDataURL(file);
  };
  
  // Hazard Type selection
  const hazardTypeBtns = document.querySelectorAll('.hazard-type-btn');
  hazardTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hazardTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const preview = document.getElementById('upload-preview');
      if (preview.style.display === 'none' || !preview.style.backgroundImage) {
        alert('Please upload an image first for AI analysis.');
        return;
      }
      
      const originalText = analyzeBtn.innerHTML;
      analyzeBtn.innerHTML = '<span class="pulse-dot sm" style="display:inline-block; margin-right:8px"></span> Analyzing with Gemini Vision...';
      analyzeBtn.disabled = true;
      
      // Simulate AI processing delay
      setTimeout(() => {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
        
        reportEmpty.style.display = 'none';
        detectionResult.style.display = 'block';
        
        // Populate results
        document.getElementById('detection-grid').innerHTML = `
          <div class="detection-item">
            <div class="detection-label">Hazard Class</div>
            <div class="detection-val">🌊 Severe Waterlogging</div>
          </div>
          <div class="detection-item">
            <div class="detection-label">Water Depth</div>
            <div class="detection-val">~18-24 inches</div>
          </div>
          <div class="detection-item">
            <div class="detection-label">Vehicle Risk</div>
            <div class="detection-val" style="color: var(--danger)">High (2W/4W)</div>
          </div>
          <div class="detection-item">
            <div class="detection-label">Road Condition</div>
            <div class="detection-val">Invisible Surface</div>
          </div>
        `;
        
        // Animate severity bar
        setTimeout(() => {
          document.getElementById('severity-bar').style.width = '85%';
        }, 100);
        
        document.getElementById('detection-advisory').innerHTML = `
          <strong>AI Action:</strong> Incident classified as High Risk. This will automatically reroute ~1,240 nearby commuters and alert the BBMP control room.
        `;
        
      }, 2000);
    });
  }

  // --- DASHBOARD DATA POPULATION ---
  const populateList = (containerId, data) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    data.forEach(item => {
      html += `
        <div class="list-item">
          <div class="item-icon">${item.icon}</div>
          <div class="item-content">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <div class="item-time">${item.time}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  };
  
  populateList('risk-list', dashboardData.riskZones);
  populateList('predictions-list', dashboardData.predictions);
  populateList('reports-feed', dashboardData.reports);

});
