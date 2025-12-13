// MedFind Salone - Application JavaScript
// Complete offline-first hospital finder

// Global State
let hospitals = [];
let currentHospitals = [];
let userLocation = null;
let favorites = [];
let currentLanguage = 'en';
let currentFilters = {
    service: null,
    bedsAvailable: false,
    oxygenAvailable: false,
    surgeonsOnDuty: false,
    ambulanceAvailable: false,
    district: ''
};

// Translations
const translations = {
    en: {
        emergency_mode: '🚨 EMERGENCY MODE',
        subtitle: 'Find Emergency Medical Services Offline',
        sos: 'SOS - FIND HELP NOW',
        search_placeholder: 'Search hospitals by name, district, or services...',
        quick_services: 'Quick Services',
        emergency: 'Emergency',
        maternity: 'Maternity',
        surgery: 'Surgery',
        pediatrics: 'Pediatrics',
        all_hospitals: 'All Hospitals',
        nearby_hospitals: 'Nearby Hospitals',
        beds_available: 'Beds Available',
        oxygen_available: 'Oxygen Available',
        surgeons_on_duty: 'Surgeons on Duty',
        ambulance: 'Ambulance Available',
        home: 'Home',
        favorites: 'Favorites',
    },
    kr: {
        emergency_mode: '🚨 EMERGENCY MODE',
        subtitle: 'Fɛn Hospital Dɛn We Yu Nɔ Nid Intanɛt',
        sos: 'SOS - FƐNƐ HɛLP NƆNƆW',
        search_placeholder: 'Fɛn hospital bay nem, distrikt, ɔ savis...',
        quick_services: 'Kwik Savis Dɛn',
        emergency: 'Emergency',
        maternity: 'Pikin Bon',
        surgery: 'Wok',
        pediatrics: 'Pikin Dɔkta',
        all_hospitals: 'Ɔl Hospital Dɛn',
        nearby_hospitals: 'Hospital Dɛn We De Ya So',
        beds_available: 'Bed Dɛn We De',
        oxygen_available: 'Oxygen De',
        surgeons_on_duty: 'Dɔkta Dɛn De',
        ambulance: 'Ambulans De',
        home: 'Om',
        favorites: 'Favorites',
    }
};

// Initialize App
async function initApp() {
    console.log('🚀 Initializing MedFind Salone...');
    
    // Show loading screen
    document.getElementById('loadingScreen').style.display = 'flex';
    
    // Load hospitals data
    await loadHospitalsData();
    
    // Load favorites from localStorage
    loadFavorites();
    
    // Check geolocation
    getCurrentLocation();
    
    // Populate district filter
    populateDistrictFilter();
    
    // Check online status
    checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    
    // Setup language selector
    setupLanguageSelector();
    
    // Display all hospitals initially
    displayHospitals(hospitals);
    
    // Hide loading screen and show app
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }, 1500);
    
    console.log('✅ App initialized with', hospitals.length, 'hospitals');
}

// Load Hospital Data
async function loadHospitalsData() {
    try {
        const response = await fetch('./data/hospitals_complete.json');
        const data = await response.json();
        hospitals = data;
        currentHospitals = [...hospitals];
        
        // Store in localStorage for offline access
        localStorage.setItem('hospitals_data', JSON.stringify(hospitals));
        localStorage.setItem('last_sync', new Date().toISOString());
    } catch (error) {
        console.warn('⚠️ Loading from network failed, using offline data');
        // Load from localStorage if network fails
        const offlineData = localStorage.getItem('hospitals_data');
        if (offlineData) {
            hospitals = JSON.parse(offlineData);
            currentHospitals = [...hospitals];
        }
    }
}

// Get User Location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log('📍 Location obtained:', userLocation);
                // Recalculate distances and re-render
                calculateDistances();
                displayHospitals(currentHospitals);
            },
            error => {
                console.warn('⚠️ Geolocation error:', error.message);
                // Use default location (Freetown center)
                userLocation = {
                    latitude: 8.4844,
                    longitude: -13.2344
                };
                calculateDistances();
                displayHospitals(currentHospitals);
            }
        );
    } else {
        // Use default location
        userLocation = {
            latitude: 8.4844,
            longitude: -13.2344
        };
        calculateDistances();
        displayHospitals(currentHospitals);
    }
}

// Calculate Distance (Haversine Formula)
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
    
    // Sort by distance
    hospitals.sort((a, b) => a.distance - b.distance);
}

// Display Hospitals
function displayHospitals(hospitalsToDisplay) {
    const container = document.getElementById('hospitalList');
    container.innerHTML = '';
    
    if (hospitalsToDisplay.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <p style="font-size: 48px; margin-bottom: 15px;">🏥</p>
                <p style="font-size: 18px; font-weight: 600;">No hospitals found</p>
                <p style="font-size: 14px; margin-top: 10px;">Try adjusting your filters</p>
            </div>
        `;
        document.getElementById('resultCount').textContent = '0';
        return;
    }
    
    hospitalsToDisplay.forEach(hospital => {
        const card = createHospitalCard(hospital);
        container.appendChild(card);
    });
    
    document.getElementById('resultCount').textContent = hospitalsToDisplay.length;
    document.getElementById('mapHospitalCount').textContent = hospitalsToDisplay.length;
}

// Create Hospital Card
function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.onclick = () => showHospitalDetail(hospital);
    
    const isFavorite = favorites.includes(hospital.id);
    const avail = hospital.dynamic_availability;
    
    card.innerHTML = `
        <div class="hospital-card-header">
            <div>
                <div class="hospital-name">${hospital.hospital_name}</div>
                <span class="hospital-type">${hospital.facility_type}</span>
            </div>
            <div class="hospital-distance">
                ${hospital.distance ? hospital.distance + ' km' : ''}
            </div>
        </div>
        
        <div class="hospital-info">
            <div class="info-row">
                📍 ${hospital.district}, ${hospital.region}
            </div>
            <div class="info-row">
                📞 ${hospital.phone}
            </div>
        </div>
        
        <div class="availability-grid">
            <div class="availability-badge ${avail.beds_available_now > 0 ? 'badge-available' : 'badge-unavailable'}">
                🛏️ ${avail.beds_available_now} Beds
            </div>
            <div class="availability-badge ${avail.oxygen_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                💨 Oxygen ${avail.oxygen_available === 'Yes' ? '✓' : '✗'}
            </div>
            <div class="availability-badge ${avail.surgeons_on_duty !== 'No' ? 'badge-available' : 'badge-limited'}">
                👨‍⚕️ Surgeons ${avail.surgeons_on_duty}
            </div>
            <div class="availability-badge ${avail.ambulance_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                🚑 Ambulance ${avail.ambulance_available === 'Yes' ? '✓' : '✗'}
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
    
    return card;
}

// Show Hospital Detail
function showHospitalDetail(hospital) {
    const content = document.getElementById('detailContent');
    const isFavorite = favorites.includes(hospital.id);
    const avail = hospital.dynamic_availability;
    
    // Update favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    favoriteBtn.textContent = isFavorite ? '⭐' : '☆';
    favoriteBtn.dataset.hospitalId = hospital.id;
    
    content.innerHTML = `
        <div class="detail-hero">
            <h2>${hospital.hospital_name}</h2>
            <p style="color: #6b7280; margin-bottom: 10px;">${hospital.facility_type}</p>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
                ${hospital.distance ? hospital.distance + ' km away' : 'Distance unknown'}
            </p>
        </div>
        
        <div class="detail-section">
            <h3>📍 Location & Contact</h3>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span>Address</span>
                    <strong>${hospital.district}, ${hospital.region}</strong>
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
                ${hospital.website ? `
                <div class="detail-info-row">
                    <span>Website</span>
                    <strong><a href="${hospital.website}" target="_blank">Visit Site</a></strong>
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
                    <span>Operating Theatre</span>
                    <strong style="color: ${avail.operating_theatre_status === 'Functional' ? '#10b981' : '#ef4444'}">
                        ${avail.operating_theatre_status}
                    </strong>
                </div>
                <div class="detail-info-row">
                    <span>Ambulance</span>
                    <strong style="color: ${avail.ambulance_available === 'Yes' ? '#10b981' : '#ef4444'}">
                        ${avail.ambulance_available}
                    </strong>
                </div>
                <div class="detail-info-row">
                    <span>Last Updated</span>
                    <strong>${new Date(avail.last_updated_timestamp).toLocaleString()}</strong>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>⚕️ Services Available</h3>
            <div class="services-grid">
                ${Object.entries(hospital.key_services).map(([service, available]) => `
                    <div class="service-badge ${available ? 'service-available' : 'service-unavailable'}">
                        ${service.replace(/_/g, ' ').toUpperCase()} ${available ? '✓' : '✗'}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h3>👨‍⚕️ Medical Staff</h3>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span>General Surgeons</span>
                    <strong>${hospital.specialists_available.general_surgeon}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Obstetricians</span>
                    <strong>${hospital.specialists_available.obstetrician}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Pediatricians</span>
                    <strong>${hospital.specialists_available.pediatrician}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Anesthetists</span>
                    <strong>${hospital.specialists_available.anesthetist}</strong>
                </div>
                <div class="detail-info-row">
                    <span>Radiologists</span>
                    <strong>${hospital.specialists_available.radiologist}</strong>
                </div>
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
    
    showScreen('detailScreen');
}

// Filter Functions
function filterByService(service) {
    currentFilters.service = service;
    applyFilters();
}

function showAllHospitals() {
    currentFilters.service = null;
    applyFilters();
}

function applyFilters() {
    let filtered = [...hospitals];
    
    // Service filter
    if (currentFilters.service) {
        filtered = filtered.filter(h => h.key_services[currentFilters.service] === true);
    }
    
    // Availability filters
    if (currentFilters.bedsAvailable || document.getElementById('filterBeds')?.checked) {
        filtered = filtered.filter(h => h.dynamic_availability.beds_available_now > 0);
    }
    
    if (currentFilters.oxygenAvailable || document.getElementById('filterOxygen')?.checked) {
        filtered = filtered.filter(h => h.dynamic_availability.oxygen_available === 'Yes');
    }
    
    if (currentFilters.surgeonsOnDuty || document.getElementById('filterSurgeons')?.checked) {
        filtered = filtered.filter(h => h.dynamic_availability.surgeons_on_duty !== 'No');
    }
    
    if (currentFilters.ambulanceAvailable || document.getElementById('filterAmbulance')?.checked) {
        filtered = filtered.filter(h => h.dynamic_availability.ambulance_available === 'Yes');
    }
    
    // District filter
    const districtSelect = document.getElementById('filterDistrict');
    if (districtSelect && districtSelect.value) {
        filtered = filtered.filter(h => h.district === districtSelect.value);
    }
    
    currentHospitals = filtered;
    displayHospitals(currentHospitals);
    
    // Update filter count
    const activeFilters = [
        currentFilters.service,
        document.getElementById('filterBeds')?.checked,
        document.getElementById('filterOxygen')?.checked,
        document.getElementById('filterSurgeons')?.checked,
        document.getElementById('filterAmbulance')?.checked,
        districtSelect?.value
    ].filter(Boolean).length;
    
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        filterCount.textContent = activeFilters > 0 ? `(${activeFilters})` : '';
    }
}

function clearFilters() {
    currentFilters = {
        service: null,
        bedsAvailable: false,
        oxygenAvailable: false,
        surgeonsOnDuty: false,
        ambulanceAvailable: false,
        district: ''
    };
    
    document.getElementById('filterBeds').checked = false;
    document.getElementById('filterOxygen').checked = false;
    document.getElementById('filterSurgeons').checked = false;
    document.getElementById('filterAmbulance').checked = false;
    document.getElementById('filterDistrict').value = '';
    
    currentHospitals = [...hospitals];
    displayHospitals(currentHospitals);
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Search Function
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (!query) {
        displayHospitals(hospitals);
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
    
    currentHospitals = results;
    displayHospitals(results);
}

// Emergency Mode
function activateEmergency() {
    if (!userLocation) {
        alert('Getting your location...');
        getCurrentLocation();
    }
    
    // Find nearest hospital with emergency services
    const emergencyHospitals = hospitals.filter(h => h.key_services.emergency === true);
    const nearest = emergencyHospitals[0]; // Already sorted by distance
    
    if (nearest) {
        document.getElementById('emergencyHospitalName').textContent = nearest.hospital_name;
        document.getElementById('emergencyDistance').textContent = 
            nearest.distance ? `${nearest.distance} km away` : 'Distance calculating...';
        document.getElementById('emergencyAddress').textContent = 
            `${nearest.district}, ${nearest.region}`;
        
        // Setup call button
        const callBtn = document.getElementById('emergencyCallBtn');
        callBtn.onclick = () => callHospital(nearest.emergency_numbers?.[0] || nearest.phone);
        
        // Setup directions button
        const directionsBtn = document.getElementById('emergencyDirectionsBtn');
        directionsBtn.onclick = () => getDirections(nearest.latitude, nearest.longitude);
        
        showScreen('emergencyScreen');
    }
}

// Actions
function callHospital(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

function getDirections(lat, lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, '_blank');
}

// Favorites
function loadFavorites() {
    const stored = localStorage.getItem('favorites');
    favorites = stored ? JSON.parse(stored) : [];
}

function toggleFavorite() {
    const btn = document.getElementById('favoriteBtn');
    const hospitalId = btn.dataset.hospitalId;
    
    if (favorites.includes(hospitalId)) {
        favorites = favorites.filter(id => id !== hospitalId);
        btn.textContent = '☆';
    } else {
        favorites.push(hospitalId);
        btn.textContent = '⭐';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function showFavorites() {
    if (favorites.length === 0) {
        alert('No favorites yet! Add hospitals to your favorites by tapping the star icon.');
        return;
    }
    
    const favoriteHospitals = hospitals.filter(h => favorites.includes(h.id));
    currentHospitals = favoriteHospitals;
    displayHospitals(favoriteHospitals);
    showScreen('homeScreen');
}

// UI Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

function switchView(view) {
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    const listContainer = document.getElementById('hospitalList');
    const mapContainer = document.getElementById('mapContainer');
    
    if (view === 'list') {
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
        listContainer.style.display = 'flex';
        mapContainer.style.display = 'none';
    } else {
        mapBtn.classList.add('active');
        listBtn.classList.remove('active');
        listContainer.style.display = 'none';
        mapContainer.style.display = 'flex';
    }
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

// Language Support
function setupLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLanguage = btn.dataset.lang;
            updateTranslations();
        });
    });
}

function updateTranslations() {
    const trans = translations[currentLanguage];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (trans[key]) {
            element.textContent = trans[key];
        }
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.dataset.translatePlaceholder;
        if (trans[key]) {
            element.placeholder = trans[key];
        }
    });
}

// Online/Offline Status
function checkOnlineStatus() {
    const banner = document.getElementById('offlineBanner');
    const lastSync = localStorage.getItem('last_sync');
    
    if (!navigator.onLine) {
        banner.classList.add('show');
        document.getElementById('lastSyncTime').textContent = 
            lastSync ? new Date(lastSync).toLocaleString() : 'Never';
    } else {
        banner.classList.remove('show');
    }
}

// Enable search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Initialize on load
window.addEventListener('load', initApp);
