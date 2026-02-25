// MedFind Salone - Application JavaScript
// Complete offline-first hospital finder

(function () {

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
            pharmacy: 'Pharmacy',
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
            pharmacy: 'Famesi',
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

        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('app');

        try {
            // Show loading screen
            if (loadingScreen) loadingScreen.style.display = 'flex';

            // CHECK IF RUNNING IN IFRAME (SPA MODE)
            if (window.self !== window.top) {
                console.log('📱 Running in SPA Mode (Iframe)');
                const header = document.querySelector('.app-header');
                if (header) header.style.display = 'none';
                document.body.style.paddingTop = '10px';
            }

            // Load hospitals data - CRITICAL STEP
            await loadHospitalsData();

            // Load favorites
            loadFavorites();

            // Check geolocation (non-blocking)
            getCurrentLocation();

            // Populate district filter
            populateDistrictFilter();

            // Check online status
            checkOnlineStatus();
            window.addEventListener('online', checkOnlineStatus);
            window.addEventListener('offline', checkOnlineStatus);

            // Setup language selector
            setupLanguageSelector();

            // Display hospitals
            // Display hospitals (handles empty state internally)
            // Display hospitals (with safety check)
            if (Array.isArray(hospitals)) {
                displayHospitals(hospitals);
            } else {
                hospitals = [];
                displayHospitals([]);
            }

            console.log('✅ App initialized with', hospitals.length, 'hospitals');

        } catch (error) {
            console.error('❌ Critical Initialization Error:', error);
            // FORCE HIDE LOADER ON ERROR
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
        } finally {
            // FAMOUS "INFINITE LOADING" FIX: Always hide loader
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                if (appContainer) appContainer.style.display = 'block';
            }, 100);
        }
    }

    // Load Hospital Data
    async function loadHospitalsData() {
        try {
            console.log('🔄 Loading hospital data via MedFindData...');
            hospitals = await MedFindData.init();
            currentHospitals = [...hospitals];
            console.log(`✅ Loaded ${hospitals.length} hospitals via MedFindData`);
        } catch (error) {
            console.error('❌ Data load failed:', error);
            hospitals = [];
            currentHospitals = [];
            // Allow the UI to show "No Data" message
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
                    calculateDistances();
                    displayHospitals(currentHospitals); // Re-render with distances
                },
                error => {
                    console.warn('⚠️ Geolocation error:', error.message);
                    // Default: Freetown
                    userLocation = { latitude: 8.4844, longitude: -13.2344 };
                    calculateDistances();
                    displayHospitals(currentHospitals);
                }
            );
        } else {
            // Default: Freetown
            userLocation = { latitude: 8.4844, longitude: -13.2344 };
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

    // Display hospitals
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

        // Update map if visible
        if (mapViewActive && mapInstance) {
            updateMapMarkers(hospitalsToDisplay);
        }

        // Update map count text
        const mapCountEl = document.getElementById('mapHospitalCount');
        if (mapCountEl) mapCountEl.textContent = hospitalsToDisplay.length;
    }

    // Map State
    let mapInstance = null;
    let mapMarkers = [];
    let mapViewActive = false;

    function switchView(view) {
        const listBtn = document.getElementById('listViewBtn');
        const mapBtn = document.getElementById('mapViewBtn');
        const listContainer = document.getElementById('hospitalsContainer');
        const mapContainer = document.getElementById('mapContainer');

        if (view === 'list') {
            listBtn.classList.add('active');
            mapBtn.classList.remove('active');
            listContainer.style.display = 'block';
            mapContainer.style.display = 'none';
            mapViewActive = false;
        } else {
            listBtn.classList.remove('active');
            mapBtn.classList.add('active');
            listContainer.style.display = 'none';
            mapContainer.style.display = 'block';
            mapViewActive = true;

            // Initialize map if needed
            if (!mapInstance) {
                initMap();
            } else {
                // Refresh map size due to display change
                setTimeout(() => {
                    mapInstance.invalidateSize();
                    updateMapMarkers(currentHospitals);
                }, 100);
            }
        }
    }

    function initMap() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) mapPlaceholder.style.display = 'none';

        // Leaflet icon fix
        if (typeof L !== 'undefined') {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'assets/vendor/leaflet/images/marker-icon-2x.png',
                iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
                shadowUrl: 'assets/vendor/leaflet/images/marker-shadow.png',
            });
        }

        // Create map div if it doesn't exist cleaner
        let mapDiv = document.getElementById('appMap');
        if (!mapDiv) {
            mapDiv = document.createElement('div');
            mapDiv.id = 'appMap';
            mapDiv.style.height = '100%';
            mapDiv.style.width = '100%';
            mapDiv.style.minHeight = '500px';
            mapDiv.style.borderRadius = '12px';
            document.getElementById('mapContainer').appendChild(mapDiv);
        }

        // Default to Sierra Leone center
        const defaultCenter = [8.4844, -13.2344];
        const zoomLevel = userLocation ? 10 : 8;
        const center = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;

        if (typeof L !== 'undefined') {
            mapInstance = L.map('appMap').setView(center, zoomLevel);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(mapInstance);

            // Add user location marker
            if (userLocation) {
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2563eb; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20]
                });
                L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
                    .addTo(mapInstance)
                    .bindPopup("You are here");
            }

            updateMapMarkers(currentHospitals);
        } else {
            document.getElementById('mapContainer').innerHTML =
                '<div style="text-align: center; padding: 40px;">Map library not loaded. Please refresh or use List view.</div>';
        }
    }

    function updateMapMarkers(hospitalsToDisplay) {
        if (!mapInstance) return;

        // Clear existing markers
        mapMarkers.forEach(marker => mapInstance.removeLayer(marker));
        mapMarkers = [];

        const group = new L.featureGroup();

        hospitalsToDisplay.forEach(hospital => {
            const marker = L.marker([hospital.latitude, hospital.longitude])
                .bindPopup(`
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">${hospital.hospital_name}</h3>
                    <p style="margin: 0 0 5px 0; color: #666;">${hospital.distance ? hospital.distance + ' km away' : ''}</p>
                    <div style="margin-top: 8px;">
                        <span style="font-weight: bold; color: ${hospital.dynamic_availability.beds_available_now > 0 ? 'green' : 'red'};">
                            ${hospital.dynamic_availability.beds_available_now} Beds
                        </span>
                         • 
                        <span style="font-weight: bold; color: ${hospital.dynamic_availability.oxygen_available === 'Yes' ? 'green' : 'red'};">
                            O₂
                        </span>
                    </div>
                    <button onclick="showHospitalDetail(MedFindData.getHospitalById('${hospital.id}'))" 
                        style="width: 100%; margin-top: 10px; padding: 8px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        View Details
                    </button>
                </div>
            `);

            marker.addTo(mapInstance);
            group.addLayer(marker);
            mapMarkers.push(marker);
        });

        if (hospitalsToDisplay.length > 0) {
            mapInstance.fitBounds(group.getBounds().pad(0.1));
        }
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
    let currentDetailHospital = null;
    function showHospitalDetail(hospital) {
        currentDetailHospital = hospital;

        const avail = hospital.dynamic_availability || {};
        const cap = hospital.static_bed_capacity || {};
        const isFav = PatientApp ? PatientApp.state.favorites.includes(hospital.id) : (SPA ? SPA.state.favorites?.includes(hospital.id) : false);

        // Update favorite button if exists
        const favBtn = document.getElementById('favoriteBtn');
        if (favBtn) {
            favBtn.textContent = isFav ? '⭐' : '☆';
            favBtn.onclick = () => {
                if(typeof PatientApp !== 'undefined') PatientApp.toggleFavorite(hospital.id);
                else if(typeof toggleFavorite !== 'undefined') toggleFavorite(hospital.id);
            };
        }

        // Helpers for safely fetching nested data
        const getV = (obj, path, def = 'Not Updated') => {
            return path.split('.').reduce((o, p) => (o && o[p] !== undefined && o[p] !== null && o[p] !== '') ? o[p] : undefined, obj) ?? def;
        };

        const getCount = (obj, path) => {
            const val = getV(obj, path, null);
            return (val === null || val === 'Not Updated') ? '0' : val;
        };
        
        const getBool = (obj, path) => {
             const val = getV(obj, path, null);
             if (val === true || val === 'Yes') return '✓';
             if (val === false || val === 'No' || val === null || val === 'Not Updated') return '✗';
             return val;
        };
        
        const formatBool = (val) => {
             if (val === true || val === 'Yes') return '<span style="color:#10b981; font-weight:bold;">✓ Yes</span>';
             return '<span style="color:#ef4444; font-weight:bold;">✗ No</span>';
        };

        // 12. DATA TRANSPARENCY logic
        let timestampDisplay = 'Not Updated';
        let timeWarning = '';
        if (avail.last_updated_timestamp) {
            const lastUpdated = new Date(avail.last_updated_timestamp);
            timestampDisplay = lastUpdated.toLocaleString();
            const hoursDiff = (new Date() - lastUpdated) / (1000 * 60 * 60);
            if (hoursDiff > 24) {
                timeWarning = '<div style="background: #fee2e2; color: #b91c1c; padding: 10px; border-radius: 8px; margin-top: 10px; font-weight: bold;">⚠️ Warning: Data May Be Outdated (Over 24h old)</div>';
            } else if (hoursDiff > 6) {
                timeWarning = '<div style="background: #fefce8; color: #a16207; padding: 10px; border-radius: 8px; margin-top: 10px; font-weight: bold;">⚠️ Warning: Data over 6 hours old</div>';
            }
        }

        const noBedsIndicator = (avail.beds_available_now === 0 || avail.beds_available_now === '0') ? 
            '<div style="background: #fee2e2; color: #b91c1c; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; text-align: center; font-size: 16px;">⚠️ No Beds Available</div>' : '';

        // Generate Surgical Services List
        let surgicalSpecialtiesHtml = '<li style="margin-bottom: 5px; color:#6b7280;">Not Updated</li>';
        if (hospital.surgeons_by_specialty && Object.keys(hospital.surgeons_by_specialty).length > 0) {
            surgicalSpecialtiesHtml = Object.keys(hospital.surgeons_by_specialty).map(s => 
                '<li style="margin-bottom: 5px;">' + s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + '</li>'
            ).join('');
        }

        // Generate Procedures List
        let proceduresHtml = '<li style="color:#6b7280;">Not Available</li>';
        if (hospital.technology_services && hospital.technology_services.surgical && hospital.technology_services.surgical.procedures) {
             proceduresHtml = hospital.technology_services.surgical.procedures.map(p => 
                '<li style="margin-bottom: 5px;">' + p + '</li>'
             ).join('');
        }

        content.innerHTML = translateDetailHtml(`
        <!-- 1. HOSPITAL OVERVIEW -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h2 style="font-size:24px; font-weight:bold; color:#1f2937; margin:0 0 5px 0;">${getV(hospital, 'hospital_name')}</h2>
            <p style="color:#2563eb; font-weight:600; margin:0 0 10px 0; font-size:16px;">${getV(hospital, 'facility_type')}</p>
            
            <div style="font-size:15px; color:#4b5563; line-height:1.6; margin-bottom:15px;">
                <div><strong>Province:</strong> ${getV(hospital, 'region')}</div>
                <div><strong>District:</strong> ${getV(hospital, 'district')}</div>
                <div><strong>Full Address:</strong> ${getV(hospital, 'address', hospital.district + ', ' + hospital.region)}</div>
                <div><strong>Phone Number:</strong> <a href="tel:${getV(hospital, 'phone')}" style="color:#2563eb; text-decoration:none;">${getV(hospital, 'phone')}</a></div>
                <div><strong>Email:</strong> ${getV(hospital, 'email')}</div>
                <div><strong>Website:</strong> ${hospital.website ? `<a href="${hospital.website}" target="_blank" style="color:#2563eb;">${hospital.website}</a>` : 'Not Updated'}</div>
                <div><strong>Distance:</strong> <span style="font-weight:bold; color:#2563eb;">${hospital.distance ? hospital.distance + ' km away' : 'Location not enabled'}</span></div>
            </div>
            
            ${hospital.notes ? `<p style="font-size:14px; color:#6b7280; font-style:italic; border-left:4px solid #e5e7eb; padding-left:10px; margin-bottom:15px;">${hospital.notes}</p>` : '<p style="font-size:14px; color:#6b7280; font-style:italic; border-left:4px solid #e5e7eb; padding-left:10px; margin-bottom:15px;">No description provided.</p>'}

            <div style="display:flex; gap:10px;">
                <button onclick="window.location.href='tel:${getV(hospital, 'phone')}'" style="flex:1; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">📞 Call Hospital</button>
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}')" style="flex:1; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">🗺️ Directions</button>
            </div>
        </div>

        <!-- 2. LIVE EMERGENCY STATUS -->
        <div class="detail-section" style="background:#fffafa; border:2px solid #fecaca; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#b91c1c; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #fee2e2; padding-bottom:8px;">🚨 LIVE EMERGENCY STATUS</h3>
            
            <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px 15px; border-radius:8px; border:1px solid #fecaca;">
                    <span style="color:#4b5563; font-weight:600;">Doctors Status</span>
                    <strong style="color:${avail.surgeons_on_duty === 'No' ? '#ef4444' : '#10b981'};">${getV(avail, 'surgeons_on_duty', 'Unavailable')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px 15px; border-radius:8px; border:1px solid #fecaca;">
                    <span style="color:#4b5563; font-weight:600;">Emergency Room Status</span>
                    <strong style="color:${getV(hospital, 'key_services.emergency') === true ? '#10b981' : '#ef4444'};">${getV(hospital, 'key_services.emergency') === true ? 'Open' : 'Closed'}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px 15px; border-radius:8px; border:1px solid #fecaca;">
                    <span style="color:#4b5563; font-weight:600;">Ambulance Dispatch Status</span>
                    <strong style="color:${avail.ambulance_available === 'Yes' ? '#10b981' : '#ef4444'};">${avail.ambulance_available === 'Yes' ? 'Ready' : (avail.ambulance_available === 'No' ? 'Unavailable' : 'Not Updated')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px 15px; border-radius:8px; border:1px solid #fecaca;">
                    <span style="color:#4b5563; font-weight:600;">Operating Theatre Status</span>
                    <strong style="color:${avail.operating_theatre_status === 'Functional' ? '#10b981' : '#ef4444'};">${getV(avail, 'operating_theatre_status', 'Not Updated')}</strong>
                </div>
            </div>
            
            <div style="margin-top:15px; text-align:center; font-size:13px; color:#6b7280;">
                Last Updated: <span style="font-weight:bold;">${timestampDisplay}</span>
            </div>
        </div>

        <!-- 3. CURRENT AVAILABILITY -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">🏥 CURRENT AVAILABILITY</h3>
            
            ${noBedsIndicator}
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">Beds Available / Total Beds</span>
                    <strong style="font-size:16px;">${getV(avail, 'beds_available_now')} / ${getV(cap, 'total')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">ICU Beds Available / Total ICU Beds</span>
                    <strong style="font-size:16px;">${getV(avail, 'icu_beds_available_now')} / ${getV(cap, 'icu')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">Oxygen Units Available</span>
                    <strong style="font-size:16px; color:${avail.oxygen_available === 'Yes' ? '#10b981' : '#ef4444'};">${getV(avail, 'oxygen_available')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">Ventilators</span>
                    <strong style="font-size:16px;">${getV(hospital, 'technology_services.critical_care.ventilators')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">Surgeons on Duty</span>
                    <strong style="font-size:16px;">${getV(avail, 'surgeons_on_duty')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:#f9fafb; border-radius:8px;">
                    <span style="color:#4b5563;">Ambulances Available</span>
                    <strong style="font-size:16px;">${avail.ambulance_available === 'Yes' ? getV(hospital, 'technology_services.other.ambulances', '1') : '0'}</strong>
                </div>
            </div>
        </div>

        <!-- 4. BED BREAKDOWN -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">🛏️ BED BREAKDOWN</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Total Beds</span>
                    <strong>${getV(cap, 'total')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Adult Beds</span>
                    <strong>${getV(cap, 'adult')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Maternity Beds</span>
                    <strong>${getV(cap, 'maternity')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Pediatric Beds</span>
                    <strong>${getV(cap, 'pediatric')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">ICU Beds</span>
                    <strong>${getV(cap, 'icu')}</strong>
                </div>
            </div>
        </div>

        <!-- 5. SURGICAL SERVICES -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">🔪 SURGICAL SERVICES</h3>
            
            <div style="margin-bottom:15px;">
                <strong style="color:#4b5563; display:block; margin-bottom:5px;">Surgical Specialties</strong>
                <ul style="margin:0; padding-left:20px; line-height:1.5;">
                    ${surgicalSpecialtiesHtml}
                </ul>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Number of Surgeons</span>
                    <strong>${getV(hospital, 'staffing.total_surgeons', 'Not Updated')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Operating Theatres</span>
                    <strong>${getV(hospital, 'technology_services.surgical.operating_theatres', 'Not Updated')}</strong>
                </div>
            </div>
            
            <div>
                <strong style="color:#4b5563; display:block; margin-bottom:5px;">Procedures Offered</strong>
                <ul style="margin:0; padding-left:20px; line-height:1.5;">
                    ${proceduresHtml}
                </ul>
            </div>
        </div>

        <!-- 6. MEDICAL SPECIALISTS -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">👨‍⚕️ MEDICAL SPECIALISTS</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">General Practitioners</span>
                    <strong>${getCount(hospital, 'medical_specialists.general_practitioners')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Pediatricians</span>
                    <strong>${getCount(hospital, 'medical_specialists.pediatricians')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Cardiologists</span>
                    <strong>${getCount(hospital, 'medical_specialists.cardiologists')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Obstetricians</span>
                    <strong>${getCount(hospital, 'medical_specialists.obstetricians')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Orthopedic Surgeons</span>
                    <strong>${getCount(hospital, 'medical_specialists.orthopedic_surgeons')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Anesthetists</span>
                    <strong>${getCount(hospital, 'medical_specialists.anesthetists')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Radiologists</span>
                    <strong>${getCount(hospital, 'medical_specialists.radiologists')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Additional Specialties</span>
                    <strong>${getCount(hospital, 'medical_specialists.other')}</strong>
                </div>
            </div>
        </div>

        <!-- 7. SERVICES AVAILABLE -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">⚕️ SERVICES AVAILABLE</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Emergency</span>
                    <strong style="color:${getV(hospital, 'key_services.emergency') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.emergency')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Surgery</span>
                    <strong style="color:${getV(hospital, 'key_services.surgery') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.surgery')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Maternity</span>
                    <strong style="color:${getV(hospital, 'key_services.maternity') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.maternity')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Pediatrics</span>
                    <strong style="color:${getV(hospital, 'key_services.pediatrics') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.pediatrics')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Radiology</span>
                    <strong style="color:${getV(hospital, 'key_services.radiology') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.radiology')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Laboratory</span>
                    <strong style="color:${getV(hospital, 'key_services.laboratory') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.laboratory')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Blood Bank</span>
                    <strong style="color:${getV(hospital, 'key_services.blood_bank') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.blood_bank')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">ICU</span>
                    <strong style="color:${getV(hospital, 'key_services.icu') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.icu')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Mental Health</span>
                    <strong style="color:${getV(hospital, 'key_services.mental_health') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.mental_health')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Pharmacy</span>
                    <strong style="color:${getV(hospital, 'key_services.pharmacy') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.pharmacy')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Dialysis</span>
                    <strong style="color:${getV(hospital, 'key_services.dialysis') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.dialysis')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Outpatient Services</span>
                    <strong style="color:${getV(hospital, 'key_services.outpatient') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.outpatient')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Other</span>
                    <strong style="color:${getV(hospital, 'key_services.other') === true ? '#10b981' : '#ef4444'}; font-size:16px;">${getBool(hospital, 'key_services.other')}</strong>
                </div>
            </div>
        </div>

        <!-- 8. TECHNOLOGY & EQUIPMENT -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">🏥 TECHNOLOGY & EQUIPMENT</h3>
            
            <h4 style="font-size:15px; color:#4b5563; margin:0 0 10px 0;">Imaging & Diagnostics</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px; padding-left:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">X-Ray</span>
                    <span>${formatBool(getV(hospital, 'technology_services.imaging.x_ray'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">Ultrasound</span>
                    <span>${formatBool(getV(hospital, 'technology_services.imaging.ultrasound'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">CT Scan</span>
                    <span>${formatBool(getV(hospital, 'technology_services.imaging.ct_scan'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">MRI</span>
                    <span>${formatBool(getV(hospital, 'technology_services.imaging.mri'))}</span>
                </div>
            </div>

            <h4 style="font-size:15px; color:#4b5563; margin:0 0 10px 0;">Laboratory Services</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px; padding-left:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">Clinical Chemistry</span>
                    <span>${formatBool(getV(hospital, 'technology_services.laboratory.clinical_chemistry'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">Hematology</span>
                    <span>${formatBool(getV(hospital, 'technology_services.laboratory.hematology'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Microbiology</span>
                    <span>${formatBool(getV(hospital, 'technology_services.laboratory.microbiology'))}</span>
                </div>
            </div>

            <h4 style="font-size:15px; color:#4b5563; margin:0 0 10px 0;">Critical Care Equipment</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px; padding-left:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">Ventilators</span>
                    <strong>${getCount(hospital, 'technology_services.critical_care.ventilators')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Patient Monitors</span>
                    <strong>${getCount(hospital, 'technology_services.critical_care.patient_monitors')}</strong>
                </div>
            </div>

            <h4 style="font-size:15px; color:#4b5563; margin:0 0 10px 0;">Dialysis</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; padding-left:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:5px;">
                    <span style="color:#4b5563;">Available</span>
                    <span>${formatBool(getV(hospital, 'technology_services.dialysis.available'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Machines</span>
                    <strong>${getCount(hospital, 'technology_services.dialysis.machines')}</strong>
                </div>
            </div>
        </div>

        <!-- 9. PHARMACY SERVICES -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">💊 PHARMACY SERVICES</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">24-Hour Pharmacy</span>
                    <span>${formatBool(getV(hospital, 'technology_services.pharmacy.24_hour'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Emergency Medication</span>
                    <span>${formatBool(getV(hospital, 'technology_services.pharmacy.emergency_medication'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Prescription Filling</span>
                    <span>${formatBool(getV(hospital, 'technology_services.pharmacy.prescription_filling'))}</span>
                </div>
            </div>
        </div>

        <!-- 10. INFRASTRUCTURE & SUPPORT -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">⚙️ INFRASTRUCTURE & SUPPORT</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Power Status</span>
                    <strong>${getV(hospital, 'infrastructure.power_status', 'Not Updated')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Backup Generator</span>
                    <span>${formatBool(getV(hospital, 'infrastructure.backup_generator'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Water Supply</span>
                    <strong>${getV(hospital, 'infrastructure.water_supply', 'Not Updated')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">24-Hour Security</span>
                    <span>${formatBool(getV(hospital, 'infrastructure.24_hour_security'))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">
                    <span style="color:#4b5563;">Parking</span>
                    <strong>${getV(hospital, 'infrastructure.parking', 'Not Updated')}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#4b5563;">Wheelchair Accessibility</span>
                    <span>${formatBool(getV(hospital, 'infrastructure.wheelchair_accessibility'))}</span>
                </div>
            </div>
        </div>

        <!-- 11. EMERGENCY CONTACT NUMBERS -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">🚨 EMERGENCY CONTACT NUMBERS</h3>
            
            <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                ${hospital.emergency_numbers && hospital.emergency_numbers.length > 0 ? 
                    hospital.emergency_numbers.map(num => 
                        `<button onclick="window.location.href='tel:${num}'" style="width:100%; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; padding:12px; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">📞 ${num}</button>`
                    ).join('')
                    : '<div style="text-align:center; color:#ef4444; font-weight:bold; padding:10px;">No Emergency Numbers Available</div>'
                }
            </div>
        </div>

        <!-- 12. DATA TRANSPARENCY -->
        <div class="detail-section" style="background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
            <h3 style="color:#1f2937; font-size:18px; margin:0 0 15px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px;">📊 DATA TRANSPARENCY</h3>
            <div style="font-size:15px; color:#4b5563;">
                Last Updated: <strong style="color:#1f2937;">${timestampDisplay}</strong>
            </div>
            ${timeWarning}
        </div>
        `, currentLanguage);


        showScreen('detailScreen');
    }

    // Filter Functions
    function filterByService(service) {
        // Toggle logic: if clicking same service, clear it
        if (currentFilters.service === service) {
            currentFilters.service = null;
        } else {
            currentFilters.service = service;
        }

        // Update visual state of service buttons
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('active-service');
            if (currentFilters.service && card.onclick.toString().includes(currentFilters.service)) {
                card.classList.add('active-service');
            }
        });

        applyFilters();

        // Scroll to results if a service is selected
        if (currentFilters.service) {
            document.getElementById('hospitalsContainer').scrollIntoView({ behavior: 'smooth' });
        }
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

        // Update Section Title based on filter
        const titleSpan = document.querySelector('.results-header .section-title span:first-child');
        if (titleSpan) {
            if (currentFilters.service) {
                // Capitalize first letter
                const serviceName = currentFilters.service.charAt(0).toUpperCase() + currentFilters.service.slice(1);
                titleSpan.setAttribute('data-translate', serviceName.toLowerCase());
                titleSpan.textContent = translations[currentLanguage][serviceName.toLowerCase()] || `${serviceName} Services`;
            } else {
                titleSpan.setAttribute('data-translate', 'nearby_hospitals');
                titleSpan.textContent = translations[currentLanguage]['nearby_hospitals'];
            }
        }

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
            // Setup call button - ALWAYS dial 117 for national emergency
            const callBtn = document.getElementById('emergencyCallBtn');
            callBtn.onclick = () => window.location.href = 'tel:117';

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
            // Initialize map if not already done
            if (!mapInstance) {
                initMap();
            } else {
                // Ensure map size is correct
                setTimeout(() => {
                    mapInstance.invalidateSize();
                }, 100);
            }
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
                reRenderView();
            });
        });
    }

    
function translateDetailHtml(html, lang) {
    if (lang !== 'kr') return html;
    return html
        .replace(/HOSPITAL OVERVIEW/g, "HOSPITAL INFOR")
        .replace(/LIVE EMERGENCY STATUS/g, "ƐMAJƐNSI WETIN DE")
        .replace(/CURRENT AVAILABILITY/g, "WETIN DE YASO NYA")
        .replace(/BED BREAKDOWN/g, "BED DƐN BƐTƐ BƐTƐ")
        .replace(/SURGICAL SERVICES/g, "SƆJIKAL SAVIS")
        .replace(/MEDICAL SPECIALISTS/g, "MƐDIKAL DƆKTA DƐN")
        .replace(/SERVICES AVAILABLE/g, "SAVIS DƐN WE DE")
        .replace(/TECHNOLOGY &amp; EQUIPMENT/g, "MASHIN ƐN TIN DƐN")
        .replace(/PHARMACY SERVICES/g, "FAMESI SAVIS DƐN")
        .replace(/INFRASTRUCTURE &amp; SUPPORT/g, "PƆWA ƐN WATA")
        .replace(/EMERGENCY CONTACT NUMBERS/g, "ƐMAJƐNSI KƆNTACKT DƐN")
        .replace(/DATA TRANSPARENCY/g, "DATA INFOR")
        .replace(/Province:/g, "Rijɔn:")
        .replace(/District:/g, "Distrikt:")
        .replace(/Full Address:/g, "Kɔmplɛt Adrɛs:")
        .replace(/Phone Number:/g, "Fɔn Nɔmba:")
        .replace(/Distance:/g, "A Faa I De:")
        .replace(/Call Hospital/g, "Kɔl Hospital")
        .replace(/Directions/g, "Fɛn Di Rod")
        .replace(/Beds Available \/ Total Beds/g, "Bed Dɛn We De / Ɔl Bɛd Dɛn")
        .replace(/ICU Beds/g, "ICU Bed Dɛn")
        .replace(/Oxygen Units Available/g, "Oxygen We De")
        .replace(/Surgeons on Duty/g, "Dɔkta Dɛn De")
        .replace(/Ambulances Available/g, "Ambulans Dɛn We De")
        .replace(/Not Updated/g, "Nɔ Abdeʈ")
        .replace(/Not Available/g, "Nɔ De Yaso")
        .replace(/>Unavailable</g, ">Nɔ De Yaso<")
        .replace(/>Available</g, ">I De<")
        .replace(/Functional/g, "I De Wok")
        .replace(/Closed/g, "Lɔk")
        .replace(/Adult Beds/g, "Big Mɔtɔ Bɛd Dɛn")
        .replace(/Maternity Beds/g, "Pikin Bɔn Bɛd Dɛn")
        .replace(/Pediatric Beds/g, "Pikin Bɛd Dɛn")
        .replace(/Total Beds/g, "Ɔl Bɛd Dɛn");
}

function translateCardHtml(html, lang) {
    if (lang !== 'kr') return html;
    return html
        .replace(/ Beds/g, " Bed Dɛn")
        .replace(/Oxygen/g, "Oxygen")
        .replace(/Surgeons/g, "Dɔkta")
        .replace(/Ambulance/g, "Ambulans")
        .replace(/Call/g, "Kɔl")
        .replace(/Directions/g, "Fɛn Di Rod")
        .replace(/km/g, "km")
        .replace(/Distance/g, "A Faa I De");
}

    function reRenderView() {
        applyFilters();
        if (document.getElementById("detailScreen") && document.getElementById("detailScreen").style.display === "block" && currentDetailHospital) {
            showHospitalDetail(currentDetailHospital);
        }
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
    // Initialize on load or immediately if already loaded (SPA Support)
    if (document.readyState === 'complete') {
        initApp();
    } else {
        window.addEventListener('load', initApp);
    }

    // Expose functions globally for HTML event handlers
    window.activateEmergency = activateEmergency;
    window.performSearch = performSearch;
    window.filterByService = filterByService;
    window.showAllHospitals = showAllHospitals;
    window.switchView = switchView;
    window.toggleFilters = toggleFilters;
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.showHospitalDetail = showHospitalDetail;
    window.showScreen = showScreen;
    window.toggleFavorite = toggleFavorite;
    window.showFavorites = showFavorites;
    window.callHospital = callHospital;
    window.getDirections = getDirections;

})();
