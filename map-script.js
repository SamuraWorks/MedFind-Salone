// ============================================
// MedFind Salone - Live Hospital Map
// Interactive Map with Real-Time Availability
// ============================================

let map;
let hospitals = [];
let markers = [];
let activeFilters = new Set();
let selectedHospital = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🗺️ Initializing Live Hospital Map...');

    // Load hospital data
    await loadHospitalData();

    // Initialize map
    initializeMap();

    // Render hospitals
    renderHospitalList();
    renderMapMarkers();

    // Update stats
    updateStats();

    // Setup event listeners
    setupEventListeners();

    // Mobile sidebar toggle
    setupMobileToggle();

    console.log('✅ Map Ready with', hospitals.length, 'hospitals');
});

// ============================================
// DATA LOADING
// ============================================

async function loadHospitalData() {
    try {
        // Try network first
        const response = await fetch('./data/hospitals_complete.json');
        const data = await response.json();
        hospitals = data;

        // Save to localStorage
        localStorage.setItem('map_hospitals_data', JSON.stringify(hospitals));
        console.log(`✅ Loaded ${hospitals.length} hospitals from network`);
    } catch (error) {
        console.warn('⚠️ Network failed, using cached data');

        // Try localStorage
        const cached = localStorage.getItem('map_hospitals_data') ||
            localStorage.getItem('hospitals_data') ||
            localStorage.getItem('admin_hospitals_data');

        if (cached) {
            hospitals = JSON.parse(cached);
            console.log(`✅ Loaded ${hospitals.length} hospitals from cache`);
        } else {
            alert('Failed to load hospital data. Please check internet connection.');
        }
    }
}

// ============================================
// MAP INITIALIZATION
// ============================================

function initializeMap() {
    // Center on Sierra Leone
    map = L.map('map').setView([8.4844, -13.2344], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add scale
    L.control.scale().addTo(map);
}

// ============================================
// MARKER RENDERING
// ============================================

function renderMapMarkers() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Get filtered hospitals
    const filtered = getFilteredHospitals();

    filtered.forEach(hospital => {
        const color = getHospitalColor(hospital);
        const icon = createColoredIcon(color);

        const marker = L.marker([hospital.latitude, hospital.longitude], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(hospital), {
                maxWidth: 300,
                className: 'custom-popup'
            });

        // Click handler
        marker.on('click', () => {
            selectHospital(hospital);
        });

        // Store reference
        marker.hospitalId = hospital.id;
        markers.push(marker);
    });

    // Fit bounds if we have markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function createColoredIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 30px;
            height: 30px;
            background: ${color};
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

function getHospitalColor(hospital) {
    const avail = hospital.dynamic_availability;

    // Critical (no beds or no oxygen)
    if (avail.beds_available_now === 0 || avail.oxygen_available === 'No') {
        return '#ef4444'; // Red
    }

    // Limited (low beds or limited oxygen)
    if (avail.beds_available_now < 5 || avail.oxygen_available === 'Limited') {
        return '#f59e0b'; // Yellow
    }

    // Good availability
    if (avail.beds_available_now > 0 && avail.oxygen_available === 'Yes') {
        return '#10b981'; // Green
    }

    // Unknown/No data
    return '#6b7280'; // Gray
}

function createPopupContent(hospital) {
    const avail = hospital.dynamic_availability;

    return `
        <div class="popup-content">
            <div class="popup-header">${hospital.hospital_name}</div>
            <div class="popup-type">${hospital.facility_type}</div>
            
            <div class="popup-info">
                <div class="popup-row">
                    <span class="popup-label">Location</span>
                    <span class="popup-value">${hospital.district}</span>
                </div>
                <div class="popup-row">
                    <span class="popup-label">Beds Available</span>
                    <span class="popup-value" style="color: ${avail.beds_available_now > 0 ? '#10b981' : '#ef4444'}">
                        ${avail.beds_available_now}
                    </span>
                </div>
                <div class="popup-row">
                    <span class="popup-label">Oxygen</span>
                    <span class="popup-value" style="color: ${avail.oxygen_available === 'Yes' ? '#10b981' : '#ef4444'}">
                        ${avail.oxygen_available}
                    </span>
                </div>
                <div class="popup-row">
                    <span class="popup-label">Surgeons</span>
                    <span class="popup-value">${avail.surgeons_on_duty}</span>
                </div>
                <div class="popup-row">
                    <span class="popup-label">Ambulance</span>
                    <span class="popup-value">${avail.ambulance_available}</span>
                </div>
            </div>
            
            <div class="popup-actions">
                <button class="popup-btn popup-btn-call" onclick="window.location.href='tel:${hospital.phone}'">
                    📞 Call
                </button>
                <button class="popup-btn popup-btn-directions" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}', '_blank')">
                    🗺️ Directions
                </button>
            </div>
        </div>
    `;
}

// ============================================
// HOSPITAL LIST RENDERING
// ============================================

function renderHospitalList() {
    const container = document.getElementById('hospitalList');
    const filtered = getFilteredHospitals();

    if (filtered.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No hospitals found</div>';
        return;
    }

    container.innerHTML = filtered.map(hospital => createHospitalCard(hospital)).join('');

    // Add click handlers
    document.querySelectorAll('.hospital-item').forEach(item => {
        item.addEventListener('click', () => {
            const hospitalId = item.dataset.hospitalId;
            const hospital = hospitals.find(h => h.id === hospitalId);
            selectHospital(hospital);
        });
    });
}

function createHospitalCard(hospital) {
    const avail = hospital.dynamic_availability;

    return `
        <div class="hospital-item ${selectedHospital?.id === hospital.id ? 'selected' : ''}" 
             data-hospital-id="${hospital.id}">
            <div class="hospital-name">${hospital.hospital_name}</div>
            <div class="hospital-location">📍 ${hospital.district}, ${hospital.region}</div>
            <div class="hospital-status">
                ${avail.beds_available_now > 0
            ? `<span class="status-badge badge-green">🛏️ ${avail.beds_available_now} Beds</span>`
            : `<span class="status-badge badge-red">🛏️ No Beds</span>`
        }
                ${avail.oxygen_available === 'Yes'
            ? `<span class="status-badge badge-green">💨 Oxygen</span>`
            : `<span class="status-badge badge-red">💨 No Oxygen</span>`
        }
                ${avail.surgeons_on_duty === 'Yes'
            ? `<span class="status-badge badge-green">👨‍⚕️ Surgeon</span>`
            : `<span class="status-badge badge-yellow">⏰ ${avail.surgeons_on_duty}</span>`
        }
            </div>
        </div>
    `;
}

function selectHospital(hospital) {
    selectedHospital = hospital;

    // Update list
    renderHospitalList();

    // Pan to marker
    map.setView([hospital.latitude, hospital.longitude], 15);

    // Find and open popup
    const marker = markers.find(m => m.hospitalId === hospital.id);
    if (marker) {
        marker.openPopup();
    }

    // Scroll to hospital in list
    const item = document.querySelector(`[data-hospital-id="${hospital.id}"]`);
    if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============================================
// FILTERING
// ============================================

function getFilteredHospitals() {
    let filtered = [...hospitals];

    // Apply search
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(h =>
            h.hospital_name.toLowerCase().includes(searchTerm) ||
            h.district.toLowerCase().includes(searchTerm) ||
            h.region.toLowerCase().includes(searchTerm)
        );
    }

    // Apply filters
    if (activeFilters.has('beds')) {
        filtered = filtered.filter(h => h.dynamic_availability.beds_available_now > 0);
    }

    if (activeFilters.has('oxygen')) {
        filtered = filtered.filter(h => h.dynamic_availability.oxygen_available === 'Yes');
    }

    if (activeFilters.has('surgeons')) {
        filtered = filtered.filter(h =>
            h.dynamic_availability.surgeons_on_duty === 'Yes' ||
            h.dynamic_availability.surgeons_on_duty === 'On Call'
        );
    }

    return filtered;
}

function applyFilters() {
    renderHospitalList();
    renderMapMarkers();
    updateStats();
}

// ============================================
// STATS UPDATE
// ============================================

function updateStats() {
    const filtered = getFilteredHospitals();

    // Total hospitals
    document.getElementById('totalHospitals').textContent = filtered.length;

    // Districts
    const districts = new Set(filtered.map(h => h.district));
    document.getElementById('districtsCount').textContent = districts.size;

    // Available beds
    const totalBeds = filtered.reduce((sum, h) => sum + h.dynamic_availability.beds_available_now, 0);
    document.getElementById('availableBeds').textContent = totalBeds;

    // Emergency ready
    const emergencyReady = filtered.filter(h =>
        h.key_services.emergency &&
        h.dynamic_availability.beds_available_now > 0
    ).length;
    document.getElementById('emergencyReady').textContent = emergencyReady;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    // Filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const filter = pill.dataset.filter;

            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
                pill.classList.remove('active');
            } else {
                activeFilters.add(filter);
                pill.classList.add('active');
            }

            applyFilters();
        });
    });
}

function setupMobileToggle() {
    const toggle = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    // Show toggle button on mobile
    if (window.innerWidth <= 768) {
        toggle.style.display = 'block';
    }

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        toggle.textContent = sidebar.classList.contains('show') ? '✖ Close' : '📋 Hospitals';
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            toggle.style.display = 'block';
        } else {
            toggle.style.display = 'none';
            sidebar.classList.remove('show');
        }
    });
}

// ============================================
// AUTO-REFRESH
// ============================================

// Reload data every 5 minutes
setInterval(async () => {
    console.log('🔄 Refreshing hospital data...');
    await loadHospitalData();
    applyFilters();
}, 5 * 60 * 1000);

console.log('✅ Map Script Loaded');
