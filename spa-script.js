// ============================================
// MedFind Salone - Single Page Application
// Pure Vanilla JavaScript - No Page Reloads
// ============================================

// Global State
let hospitals = [];
let currentFilter = null;
let currentHospital = null;
let userLocation = null;
let favorites = [];
let currentLanguage = 'en';

// Initialize App
window.addEventListener('load', initApp);

async function initApp() {
    console.log('🚀 Initializing MedFind Salone SPA...');

    // Show loading screen
    showLoading();

    // Load hospital data
    await loadHospitalData();

    // Load favorites
    loadFavorites();

    // Get user location
    getUserLocation();

    // Setup event listeners
    setupEventListeners();

    // Populate district filter
    populateDistrictFilter();

    // Populate district filter
    populateDistrictFilter();

    // Update stats
    updateStats();

    // Hide loading and show home
    hideLoading();
    showSection('homeSection');

    console.log('✅ App initialized with', hospitals.length, 'hospitals');
}

// ====== DATA LOADING ======
async function loadHospitalData() {
    try {
        const response = await fetch('./data/hospitals_complete.json');
        const data = await response.json();
        hospitals = data;

        // Calculate distances if we have user location
        if (userLocation) {
            calculateDistances();
        }

        // Store in localStorage
        localStorage.setItem('hospitals_data', JSON.stringify(hospitals));
        localStorage.setItem('last_sync', new Date().toISOString());

    } catch (error) {
        console.warn('⚠️ Network load failed, using offline data');
        const offlineData = localStorage.getItem('hospitals_data');
        if (offlineData) {
            hospitals = JSON.parse(offlineData);
        } else {
            // Fallback to minimal dataset if nothing cached
            hospitals = getMinimalDataset();
        }
    }
}

// ====== SECTION NAVIGATION (SPA Core) ======
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Service Cards - Click to filter
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            filterByService(service);
        });
    });

    // Emergency SOS Button
    document.getElementById('sosBtn').addEventListener('click', activateEmergency);

    // Search
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Back Buttons
    document.getElementById('resultsBackBtn').addEventListener('click', () => {
        showSection('homeSection');
    });

    document.getElementById('detailBackBtn').addEventListener('click', () => {
        showSection('resultsSection');
    });

    document.getElementById('emergencyBackBtn').addEventListener('click', () => {
        showSection('homeSection');
    });

    // Favorite Button
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);

    // Filter Toggle
    document.getElementById('filterToggleBtn').addEventListener('click', () => {
        const panel = document.getElementById('filtersPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Filter Actions
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Language Toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLanguage = btn.dataset.lang;
        });
    });
}

// ====== SERVICE FILTERING ======
function filterByService(service) {
    currentFilter = service;

    // Filter hospitals by service
    let filtered = hospitals.filter(h => h.key_services[service] === true);

    // Update results title
    const serviceNames = {
        'maternity': 'Maternity Services',
        'surgery': 'Surgery Services',
        'emergency': 'Emergency Services',
        'pediatrics': 'Pediatric Services',
        'icu': 'ICU Services'
    };

    document.getElementById('resultsTitle').textContent = serviceNames[service] || 'Hospitals';

    // Display results
    displayHospitals(filtered);

    // Show results section
    showSection('resultsSection');
}

// ====== DISPLAY HOSPITALS ======
function displayHospitals(hospitalsToDisplay) {
    const container = document.getElementById('hospitalList');
    const noResultsMsg = document.getElementById('noResultsMsg');

    container.innerHTML = '';

    if (hospitalsToDisplay.length === 0) {
        container.style.display = 'none';
        noResultsMsg.style.display = 'block';
        document.getElementById('resultsCount').textContent = '0 hospitals found';
        return;
    }

    container.style.display = 'grid';
    noResultsMsg.style.display = 'none';

    // Sort by distance if available
    if (userLocation) {
        hospitalsToDisplay.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    hospitalsToDisplay.forEach(hospital => {
        const card = createHospitalCard(hospital);
        container.appendChild(card);
    });

    document.getElementById('resultsCount').textContent =
        `${hospitalsToDisplay.length} hospital${hospitalsToDisplay.length !== 1 ? 's' : ''} found`;
}

// ====== CREATE HOSPITAL CARD ======
function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';

    const avail = hospital.dynamic_availability;
    const bedsStatus = avail.beds_available_now > 0 ? 'available' : 'unavailable';
    const oxygenStatus = avail.oxygen_available === 'Yes' ? 'available' : 'unavailable';
    const surgeonsStatus = avail.surgeons_on_duty !== 'No' ? 'available' : 'unavailable';
    const ambulanceStatus = avail.ambulance_available === 'Yes' ? 'available' : 'unavailable';

    card.innerHTML = `
        <div class="hospital-card-header">
            <div>
                <div class="hospital-name">${hospital.hospital_name}</div>
                <span class="hospital-type">${hospital.facility_type}</span>
                <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                    📍 ${hospital.district}
                </div>
            </div>
            <div class="hospital-distance">
                ${hospital.distance ? hospital.distance + ' km' : ''}
            </div>
        </div>
        
        <div class="hospital-info">
            <div class="info-row">📞 ${hospital.phone}</div>
        </div>
        
        <div class="availability-grid">
            <div class="availability-badge badge-${bedsStatus}">
                🛏️ ${avail.beds_available_now} Beds
            </div>
            <div class="availability-badge badge-${oxygenStatus}">
                💨 Oxygen ${avail.oxygen_available === 'Yes' ? '✓' : '✗'}
            </div>
            <div class="availability-badge badge-${surgeonsStatus}">
                👨‍⚕️ ${avail.surgeons_on_duty}
            </div>
            <div class="availability-badge badge-${ambulanceStatus}">
                🚑 ${avail.ambulance_available === 'Yes' ? '✓' : '✗'}
            </div>
        </div>
        
        <div class="hospital-actions" onclick="event.stopPropagation()">
            <button class="action-btn btn-call" onclick="callHospital('${hospital.phone}')">
                📞 Call
            </button>
            <button class="action-btn btn-directions" onclick="getDirections(${hospital.latitude}, ${hospital.longitude})">
                🗺️ Directions
            </button>
        </div>
    `;

    // Click to view details
    card.addEventListener('click', () => showHospitalDetail(hospital));

    return card;
}

// ====== SHOW HOSPITAL DETAIL ======
function showHospitalDetail(hospital) {
    currentHospital = hospital;
    const content = document.getElementById('detailContent');
    const avail = hospital.dynamic_availability;

    // Update favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    favoriteBtn.textContent = favorites.includes(hospital.id) ? '⭐' : '☆';

    content.innerHTML = `
        <div class="detail-hero">
            <h2>${hospital.hospital_name}</h2>
            <p style="color: #6b7280; margin-bottom: 10px;">${hospital.facility_type}</p>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
                ${hospital.distance ? hospital.distance + ' km away' : '📍 ' + hospital.district}
            </p>
        </div>
        
        <div class="detail-section">
            <h3>📍 Location & Contact</h3>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span>District</span>
                    <strong>${hospital.district}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Region</span>
                    <strong>${hospital.region}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Phone</span>
                    <strong>${hospital.phone}</strong>
                </div>
                ${hospital.email ? `
                <div class="detail-info-row">
                    <span>Email</span>
                    <strong>${hospital.email}</strong>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="detail-section">
            <h3>🏥 Current Availability</h3>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span>Beds Available</span>
                    <strong style="color: ${avail.beds_available_now > 0 ? '#10b981' : '#ef4444'}">
                        ${avail.beds_available_now} / ${hospital.static_bed_capacity.total}
                    </strong>
                </div>
                <div class="detail-info-row">
                    <span>Oxygen</span>
                    <strong style="color: ${avail.oxygen_available === 'Yes' ? '#10b981' : '#ef4444'}">
                        ${avail.oxygen_available}
                    </strong>
                </div>
                <div class="detail-info-row">
                    <span>Surgeons on Duty</span>
                    <strong style="color: ${avail.surgeons_on_duty !== 'No' ? '#10b981' : '#ef4444'}">
                        ${avail.surgeons_on_duty}
                    </strong>
                </div>
                <div class="detail-info-row">
                    <span>Ambulance</span>
                    <strong style="color: ${avail.ambulance_available === 'Yes' ? '#10b981' : '#ef4444'}">
                        ${avail.ambulance_available}
                    </strong>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>⚕️ Services Available</h3>
            <div class="availability-grid">
                ${Object.entries(hospital.key_services)
            .filter(([key]) => typeof hospital.key_services[key] === 'boolean')
            .map(([service, available]) => `
                        <div class="availability-badge badge-${available ? 'available' : 'unavailable'}">
                            ${service.replace(/_/g, ' ').toUpperCase()} ${available ? '✓' : '✗'}
                        </div>
                    `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h3>🛏️ Bed Capacity</h3>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span>Total Beds</span>
                    <strong>${hospital.static_bed_capacity.total}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Adult Beds</span>
                    <strong>${hospital.static_bed_capacity.adult}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Maternity Beds</span>
                    <strong>${hospital.static_bed_capacity.maternity}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Pediatric Beds</span>
                    <strong>${hospital.static_bed_capacity.pediatric}</strong>
                </div>
                <div class="detail-info-row">
                    <span>ICU Beds</span>
                    <strong>${hospital.static_bed_capacity.icu}</strong>
                </div>
            </div>
        </div>
        
        ${hospital.emergency_numbers && hospital.emergency_numbers.length > 0 ? `
        <div class="detail-section">
            <h3>🚨 Emergency Numbers</h3>
            ${hospital.emergency_numbers.map(num => `
                <button class="action-btn btn-call" style="width: 100%; margin-bottom: 10px;" onclick="callHospital('${num}')">
                    📞 ${num}
                </button>
            `).join('')}
        </div>
        ` : ''}
        
        ${hospital.notes ? `
        <div class="detail-section">
            <h3>ℹ️ Additional Information</h3>
            <p style="color: #6b7280; line-height: 1.6;">${hospital.notes}</p>
        </div>
        ` : ''}
        
        <div class="detail-section">
            <button class="action-btn btn-call" style="width: 100%; padding: 15px; margin-bottom: 10px;" onclick="callHospital('${hospital.phone}')">
                📞 Call Hospital
            </button>
            <button class="action-btn btn-directions" style="width: 100%; padding: 15px;" onclick="getDirections(${hospital.latitude}, ${hospital.longitude})">
                🗺️ Get Directions
            </button>
        </div>
    `;

    showSection('detailSection');
}

// ====== SEARCH ======
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!query) {
        // Show all hospitals
        document.getElementById('resultsTitle').textContent = 'All Hospitals';
        displayHospitals(hospitals);
        showSection('resultsSection');
        return;
    }

    const results = hospitals.filter(hospital =>
        hospital.hospital_name.toLowerCase().includes(query) ||
        hospital.district.toLowerCase().includes(query) ||
        hospital.region.toLowerCase().includes(query) ||
        Object.keys(hospital.key_services).some(service =>
            service.toLowerCase().includes(query) && hospital.key_services[service]
        )
    );

    document.getElementById('resultsTitle').textContent = `Search: "${query}"`;
    displayHospitals(results);
    showSection('resultsSection');
}

// ====== FILTER FUNCTIONS ======
function applyFilters() {
    let filtered = [...hospitals];

    // Apply current service filter if any
    if (currentFilter) {
        filtered = filtered.filter(h => h.key_services[currentFilter] === true);
    }

    // Availability filters
    if (document.getElementById('filterBeds').checked) {
        filtered = filtered.filter(h => h.dynamic_availability.beds_available_now > 0);
    }

    if (document.getElementById('filterOxygen').checked) {
        filtered = filtered.filter(h => h.dynamic_availability.oxygen_available === 'Yes');
    }

    if (document.getElementById('filterSurgeons').checked) {
        filtered = filtered.filter(h => h.dynamic_availability.surgeons_on_duty !== 'No');
    }

    if (document.getElementById('filterAmbulance').checked) {
        filtered = filtered.filter(h => h.dynamic_availability.ambulance_available === 'Yes');
    }

    // District filter
    const districtSelect = document.getElementById('filterDistrict');
    if (districtSelect.value) {
        filtered = filtered.filter(h => h.district === districtSelect.value);
    }

    displayHospitals(filtered);

    // Hide filters panel
    document.getElementById('filtersPanel').style.display = 'none';
}

function clearFilters() {
    document.getElementById('filterBeds').checked = false;
    document.getElementById('filterOxygen').checked = false;
    document.getElementById('filterSurgeons').checked = false;
    document.getElementById('filterAmbulance').checked = false;
    document.getElementById('filterDistrict').value = '';

    applyFilters();
}

function populateDistrictFilter() {
    const select = document.getElementById('filterDistrict');
    const districts = [...new Set(hospitals.map(h => h.district))].sort();

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        select.appendChild(option);
    });
}

// ====== EMERGENCY SOS ======
function activateEmergency() {
    // Find nearest hospital with emergency services
    const emergencyHospitals = hospitals.filter(h => h.key_services.emergency === true);

    if (!emergencyHospitals.length) {
        alert('No emergency hospitals found in database');
        return;
    }

    // Sort by distance
    if (userLocation) {
        emergencyHospitals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    const nearest = emergencyHospitals[0];

    document.getElementById('emergencyHospitalName').textContent = nearest.hospital_name;
    document.getElementById('emergencyDistance').textContent =
        nearest.distance ? `${nearest.distance} km away` : 'Distance calculating...';
    document.getElementById('emergencyAddress').textContent =
        `${nearest.district}, ${nearest.region}`;

    // Setup call button
    document.getElementById('emergencyCallBtn').onclick = () => {
        callHospital(nearest.emergency_numbers?.[0] || nearest.phone);
    };

    // Setup directions button
    document.getElementById('emergencyDirectionsBtn').onclick = () => {
        getDirections(nearest.latitude, nearest.longitude);
    };

    showSection('emergencySection');
}

// ====== ACTIONS ======
function callHospital(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

function getDirections(lat, lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, '_blank');
}

// Make functions globally accessible
window.callHospital = callHospital;
window.getDirections = getDirections;

// ====== FAVORITES ======
function loadFavorites() {
    const stored = localStorage.getItem('favorites');
    favorites = stored ? JSON.parse(stored) : [];
}

function toggleFavorite() {
    if (!currentHospital) return;

    const btn = document.getElementById('favoriteBtn');
    const hospitalId = currentHospital.id;

    if (favorites.includes(hospitalId)) {
        favorites = favorites.filter(id => id !== hospitalId);
        btn.textContent = '☆';
    } else {
        favorites.push(hospitalId);
        btn.textContent = '⭐';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ====== LOCATION ======
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log('📍 Location obtained:', userLocation);
                calculateDistances();
            },
            error => {
                console.warn('⚠️ Geolocation error:', error.message);
                // Use default location (Freetown)
                userLocation = {
                    latitude: 8.4844,
                    longitude: -13.2344
                };
                calculateDistances();
            }
        );
    } else {
        // Use default location
        userLocation = {
            latitude: 8.4844,
            longitude: -13.2344
        };
        calculateDistances();
    }
}

function calculateDistances() {
    if (!userLocation) return;

    hospitals.forEach(hospital => {
        hospital.distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            hospital.latitude,
            hospital.longitude
        );
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// ====== STATS ======
function updateStats() {
    document.getElementById('totalHospitals').textContent = hospitals.length;

    const districts = new Set(hospitals.map(h => h.district));
    document.getElementById('districtsCount').textContent = districts.size;
}

// ====== LOADING SCREEN ======
function showLoading() {
    document.getElementById('loadingScreen').style.display = 'flex';
}

function hideLoading() {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1500);
}

// ====== MINIMAL FALLBACK DATA ======
function getMinimalDataset() {
    // Minimal dataset if network fails and no cache
    return [
        {
            "id": "hosp_emergency",
            "hospital_name": "Emergency: Call 117 or 999",
            "district": "National",
            "region": "Sierra Leone",
            "latitude": 8.4844,
            "longitude": -13.2344,
            "phone": "117",
            "facility_type": "Emergency",
            "static_bed_capacity": { "total": 0, "adult": 0, "maternity": 0, "pediatric": 0, "icu": 0 },
            "key_services": { "emergency": true, "surgery": false, "maternity": false, "pediatrics": false, "icu": false },
            "dynamic_availability": {
                "beds_available_now": 0,
                "oxygen_available": "Unknown",
                "surgeons_on_duty": "Unknown",
                "operating_theatre_status": "Unknown",
                "ambulance_available": "Unknown",
                "last_updated_timestamp": new Date().toISOString()
            },
            "emergency_numbers": ["117", "999"],
            "notes": "National emergency numbers. App data not available offline."
        }
    ];
}

console.log('✅ MedFind Salone SPA Script Loaded');
