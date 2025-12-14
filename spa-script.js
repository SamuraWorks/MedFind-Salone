/**
 * MedFind Salone - Consolidated SPA Script
 * Combines Patient App, Admin Portal, and Landing Map Logic
 * Namespaced to prevent conflicts
 */

// ============================================
// SHARED UTILITIES & STATE
// ============================================

const SPA = {
    state: {
        currentView: 'landing-view',
        hospitals: [],
        lastSync: null,
        userLocation: null
    },

    init: async function () {
        console.log('🚀 Initializing SPA...');

        // Load Global Data
        await this.loadData();

        // Setup Navigation
        this.setupNavigation();

        // Initialize Modules
        if (document.getElementById('landingMap')) {
            LandingMap.init();
        }

        // Check Routing
        this.handleRouting();

        // Global Listeners
        window.addEventListener('popstate', () => this.handleRouting());

        // Hide Loading
        setTimeout(() => {
            const loader = document.getElementById('unifiedLoading');
            if (loader) loader.classList.add('hide');
        }, 1500);
    },

    loadData: async function () {
        try {
            // Try network first
            const response = await fetch('./data/hospitals_complete.json');
            const data = await response.json();
            this.state.hospitals = data;

            // Sync to local storage for offline use
            localStorage.setItem('spa_hospitals_data', JSON.stringify(data));

            // Update stats
            this.updateGlobalStats();

        } catch (error) {
            console.warn('Network load failed, using offline data', error);
            const cached = localStorage.getItem('spa_hospitals_data');
            if (cached) {
                this.state.hospitals = JSON.parse(cached);
                this.updateGlobalStats();
            }
        }
    },

    updateGlobalStats: function () {
        // Landing Page Stats
        const countEl = document.getElementById('landingTotalHospitals');
        if (countEl) countEl.textContent = this.state.hospitals.length;
    },

    setupNavigation: function () {
        // Expose navigateTo globally
        window.navigateTo = (viewId) => {
            this.showSection(viewId);
            history.pushState({ view: viewId }, '', `#${viewId}`);
        };
    },

    handleRouting: function () {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            this.showSection(hash);
        } else {
            this.showSection('landing-view');
        }
    },

    showSection: function (viewId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));

        // Show target
        const target = document.getElementById(viewId);
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);

            // Lazy Init Modules
            if (viewId === 'patient-app-view' && !PatientApp.initialized) {
                PatientApp.init();
            }
            if (viewId === 'admin-panel-view' && !AdminApp.initialized) {
                AdminApp.init();
            }
        }
    },

    // Global Save Helper
    saveData: function () {
        localStorage.setItem('spa_hospitals_data', JSON.stringify(this.state.hospitals));
        // Also update Admin backup if needed, but SPA source of truth is enough
    },

    translations: {
        en: {
            nav_home: "Home",
            nav_patient: "Patient App",
            nav_admin: "Admin Portal",
            offline_banner: "You are currently offline. Some features may be limited.",
            hero_subtitle: "Universal Healthcare Access for Sierra Leone",
            hero_tagline: "Find care, manage hospitals, and save lives - all in one place.",
            card_patient_title: "Find Care",
            card_patient_desc: "Locate nearest hospitals and emergency services instantly. Works offline.",
            launch_patient_app: "Launch Patient App",
            card_admin_title: "Hospital Admin",
            card_admin_desc: "Manage hospital resources, beds, and staff availability in real-time.",
            admin_login: "Admin Login",
            landing_map_title: "Live Map",
            map_search_placeholder: "Search map..."
        },
        kr: {
            nav_home: "Om",
            nav_patient: "Peshɛnt App",
            nav_admin: "Admin Pɔtal",
            offline_banner: "Yu nɔ gɛt intanɛt. Sɔm tin dɛn nɔ go wok.",
            hero_subtitle: "Mɛdikal Hɛlp fɔ Ɔlman na Salone",
            hero_tagline: "Fɛn tritmɛnt, manɛj hospital, ɛn sev layf - ɔl na wan ples.",
            card_patient_title: "Fɛn Tritmɛnt",
            card_patient_desc: "Fɛn di hospital dɛn we de klos yu ɛn ɛmajɛnsi savis sharp sharp. I de wok witawt intanɛt.",
            launch_patient_app: "Opun Peshɛnt App",
            card_admin_title: "Hospital Admin",
            card_admin_desc: "Manɛj hospital tin dɛn, bɛd dɛn, ɛn wokman dɛn we de, wantɛm wantɛm.",
            admin_login: "Admin Login",
            landing_map_title: "Layv Map",
            map_search_placeholder: "Fɛn na map..."
        }
    },

    setLanguage: function (lang) {
        console.log('Setting language to:', lang);
        const trans = this.translations[lang];
        if (!trans) return;

        // Update active class on buttons (Global & Internal)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase().includes(lang === 'kr' ? 'kr' : 'en'));
            // Or simpler check if we pass the lang code directly to onclick
            if (btn.getAttribute('onclick')?.includes(lang)) {
                btn.classList.add('active');
            } else if (btn.getAttribute('onclick')) { // only toggle sibling lang buttons
                btn.classList.remove('active');
            }
        });

        // Translate Global Elements
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (trans[key]) el.textContent = trans[key];
        });

        // Also trigger Patient App translation if it has similar logic, or just let PatientApp handle its own
        // We need to bridge them or duplicate data. 
        // Best approach: SPA handles global, PatientApp handles internal view.
        if (PatientApp && PatientApp.setLanguage) {
            PatientApp.setLanguage(lang);
        }
    }
};

// Global Helper exposed
window.setLanguage = (lang) => SPA.setLanguage(lang);

// ============================================
// MODULE: PATIENT APP
// ============================================

const PatientApp = {
    initialized: false,
    state: {
        favorites: [],
    },

    // Translations
    translations: {
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
    },

    setLanguage: function (lang) {
        const trans = this.translations[lang];
        if (!trans) return;

        document.querySelectorAll('#patient-app-view [data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (trans[key]) el.textContent = trans[key];
        });

        const search = document.getElementById('searchInput');
        if (search && trans.search_placeholder) search.placeholder = trans.search_placeholder;
    },

    init: function () {
        console.log('Initializing Patient App...');
        this.initialized = true;

        // Hide internal loading screen and show app
        const loader = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        if (loader) loader.style.display = 'none';
        if (app) app.style.display = 'block';

        this.loadFavorites();
        this.setupEventListeners();
        this.renderHospitals(SPA.state.hospitals);
        this.checkGeolocation();

        // Populate filters
        this.populateDistrictFilter();
    },

    setupEventListeners: function () {
        // Search
        const searchBtn = document.querySelector('#patient-app-view .search-btn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn) searchBtn.onclick = () => this.performSearch();
        if (searchInput) searchInput.onkeyup = (e) => {
            if (e.key === 'Enter') this.performSearch();
        };

        // Filters
        const filters = ['filterBeds', 'filterOxygen', 'filterSurgeons', 'filterAmbulance'];
        filters.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.onchange = () => this.applyFilters();
        });

        const distFilter = document.getElementById('filterDistrict');
        if (distFilter) distFilter.onchange = () => this.applyFilters();
    },

    checkGeolocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    SPA.state.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    // Recalculate distances
                    this.calculateDistances();
                    this.renderHospitals(SPA.state.hospitals);
                },
                err => {
                    console.warn('Geo error', err);
                    // Default Freetown
                    SPA.state.userLocation = { lat: 8.4844, lng: -13.2344 };
                    this.calculateDistances();
                    this.renderHospitals(SPA.state.hospitals);
                }
            );
        } else {
            // Default Freetown
            SPA.state.userLocation = { lat: 8.4844, lng: -13.2344 };
            this.calculateDistances();
            this.renderHospitals(SPA.state.hospitals);
        }
    },

    calculateDistances: function () {
        if (!SPA.state.userLocation) return;
        const { lat, lng } = SPA.state.userLocation;

        SPA.state.hospitals.forEach(h => {
            h.distance = this.getDistanceFromLatLonInKm(lat, lng, h.latitude, h.longitude);
        });
        SPA.state.hospitals.sort((a, b) => a.distance - b.distance);
    },

    getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = this.deg2rad(lat2 - lat1);
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d * 10) / 10;
    },

    deg2rad: function (deg) { return deg * (Math.PI / 180) },

    renderHospitals: function (list) {
        const container = document.getElementById('hospitalList');
        const countSpan = document.getElementById('resultCount');
        if (!container) return;

        container.innerHTML = '';
        if (countSpan) countSpan.textContent = list.length;

        if (list.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px;">No hospitals found</div>';
            return;
        }

        list.forEach(h => {
            const card = this.createCard(h);
            container.appendChild(card);
        });
    },

    createCard: function (hospital) {
        const div = document.createElement('div');
        div.className = 'hospital-card';
        div.onclick = () => this.showDetail(hospital);

        const avail = hospital.dynamic_availability;

        div.innerHTML = `
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
                <div class="info-row">📍 ${hospital.district}, ${hospital.region}</div>
                <div class="info-row">📞 ${hospital.phone}</div>
            </div>
            <div class="availability-grid">
                <div class="availability-badge ${avail.beds_available_now > 0 ? 'badge-available' : 'badge-unavailable'}">
                    🛏️ ${avail.beds_available_now} Beds
                </div>
                <div class="availability-badge ${avail.oxygen_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                    💨 Oxygen
                </div>
                <div class="availability-badge ${avail.surgeons_on_duty !== 'No' ? 'badge-available' : 'badge-limited'}">
                    👨‍⚕️ Surgeons
                </div>
                <div class="availability-badge ${avail.ambulance_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                    🚑 Ambulance
                </div>
            </div>
             <div class="hospital-actions" onclick="event.stopPropagation()">
                <button class="action-btn btn-call" onclick="window.location.href='tel:${hospital.phone}'">📞 Call</button>
                <button class="action-btn btn-directions" onclick="getDirections(${hospital.latitude}, ${hospital.longitude})">🗺️ Directions</button>
            </div>
        `;
        return div;
    },

    showDetail: function (hospital) {
        const detailScreen = document.getElementById('detailScreen');
        const homeScreen = document.getElementById('homeScreen');
        const content = document.getElementById('detailContent');

        if (detailScreen && homeScreen && content) {
            const avail = hospital.dynamic_availability;
            const isFav = this.state.favorites.includes(hospital.id);

            // Render detail content
            content.innerHTML = `
                <div class="detail-hero">
                    <h2>${hospital.hospital_name}</h2>
                    <p>${hospital.facility_type}</p>
                    <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
                        ${hospital.distance ? hospital.distance + ' km away' : 'Distance unknown'}
                    </p>
                </div>
                
                <div class="detail-section">
                    <h3>🏥 Current Availability</h3>
                    <div class="detail-info-grid">
                        <div class="detail-info-row"><span>Beds</span><strong>${avail.beds_available_now}</strong></div>
                        <div class="detail-info-row"><span>Oxygen</span><strong>${avail.oxygen_available}</strong></div>
                        <div class="detail-info-row"><span>Surgeons</span><strong>${avail.surgeons_on_duty}</strong></div>
                        <div class="detail-info-row"><span>Ambulance</span><strong>${avail.ambulance_available}</strong></div>
                    </div>
                </div>
                 <div class="detail-section">
                    <h3>📍 Location</h3>
                    <div class="detail-info-grid">
                        <div class="detail-info-row"><span>District</span><strong>${hospital.district}</strong></div>
                        <div class="detail-info-row"><span>Phone</span><strong>${hospital.phone}</strong></div>
                    </div>
                </div>
            `;

            // Setup Favorite Button in header (assuming html exists)
            const favBtn = document.getElementById('favoriteBtn');
            if (favBtn) {
                favBtn.textContent = isFav ? '⭐' : '☆';
                favBtn.onclick = () => this.toggleFavorite(hospital.id);
            }

            homeScreen.style.display = 'none';
            detailScreen.style.display = 'block';
            window.scrollTo(0, 0);
        }
    },

    toggleFavorite: function (id) {
        if (this.state.favorites.includes(id)) {
            this.state.favorites = this.state.favorites.filter(fid => fid !== id);
        } else {
            this.state.favorites.push(id);
        }
        localStorage.setItem('medfind_favorites', JSON.stringify(this.state.favorites));

        // Update UI if on detail screen
        const favBtn = document.getElementById('favoriteBtn');
        if (favBtn && document.getElementById('detailScreen').style.display === 'block') {
            favBtn.textContent = this.state.favorites.includes(id) ? '⭐' : '☆';
        }
    },

    loadFavorites: function () {
        const saved = localStorage.getItem('medfind_favorites');
        if (saved) this.state.favorites = JSON.parse(saved);
    },

    performSearch: function () {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = SPA.state.hospitals.filter(h =>
            h.hospital_name.toLowerCase().includes(query) ||
            h.district.toLowerCase().includes(query)
        );
        this.renderHospitals(filtered);
    },

    applyFilters: function () {
        let result = SPA.state.hospitals;

        const beds = document.getElementById('filterBeds')?.checked;
        if (beds) result = result.filter(h => h.dynamic_availability.beds_available_now > 0);

        const oxygen = document.getElementById('filterOxygen')?.checked;
        if (oxygen) result = result.filter(h => h.dynamic_availability.oxygen_available === 'Yes');

        const surgeons = document.getElementById('filterSurgeons')?.checked;
        if (surgeons) result = result.filter(h => h.dynamic_availability.surgeons_on_duty !== 'No');

        const ambulance = document.getElementById('filterAmbulance')?.checked;
        if (ambulance) result = result.filter(h => h.dynamic_availability.ambulance_available === 'Yes');

        const dist = document.getElementById('filterDistrict')?.value;
        if (dist) result = result.filter(h => h.district === dist);

        this.renderHospitals(result);
    },

    populateDistrictFilter: function () {
        const select = document.getElementById('filterDistrict');
        if (!select) return;
        const districts = [...new Set(SPA.state.hospitals.map(h => h.district))].sort();
        districts.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            select.appendChild(opt);
        });
    },

    activateEmergency: function () {
        // Sort by distance (already done largely) but ensure
        this.calculateDistances();

        // Filter those with emergency capacity if possible, or just closest
        const emergencyHospitals = SPA.state.hospitals.slice(0, 3); // 3 Nearest

        const container = document.querySelector('.emergency-screen .emergency-content');
        if (container) {
            // Simplify for now, usually we render cards, but we want to preserve the Screen logic
            // The original app has a dedicated screen structure. We will leave it as is, 
            // but just ensure the "Emergency" view is triggered. 
            // The original `activateEmergency` just shows the screen.
            // We may need to populate `hospital-emergency-card` with nearest.

            const card = container.querySelector('.hospital-emergency-card');
            if (card && emergencyHospitals[0]) {
                const h = emergencyHospitals[0];
                card.querySelector('h2').textContent = h.hospital_name;
                card.querySelector('.distance').textContent = h.distance + ' km';
                card.querySelector('.address').textContent = h.district;

                const callBtn = card.querySelector('.emergency-call-btn');
                callBtn.onclick = () => window.location.href = `tel:${h.phone}`;

                const dirBtn = card.querySelector('.emergency-directions-btn');
                dirBtn.onclick = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`);
            }
        }

        window.showScreen('emergencyScreen');
    }
};

// ============================================
// MODULE: ADMIN APP
// ============================================

const AdminApp = {
    initialized: false,
    currentUser: null,
    currentHospital: null,
    updateHistory: [],

    init: function () {
        console.log('Initializing Admin App...');
        this.initialized = true;
        this.populateHospitalSelect();
        this.loadUpdateHistory();

        const form = document.getElementById('loginForm');
        if (form) form.onsubmit = (e) => this.handleLogin(e);

        const updateForm = document.getElementById('updateForm');
        if (updateForm) updateForm.onsubmit = (e) => this.handleUpdateSubmit(e);

        // Auto Login Check
        const session = sessionStorage.getItem('admin_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.currentHospital = SPA.state.hospitals.find(h => h.id === this.currentUser.hospitalId);
            if (this.currentHospital) this.showDashboard();
        }
    },

    populateHospitalSelect: function () {
        const select = document.getElementById('hospitalSelect');
        if (!select) return;
        select.innerHTML = '<option value="">Select your hospital...</option>';

        SPA.state.hospitals.sort((a, b) => a.hospital_name.localeCompare(b.hospital_name))
            .forEach(h => {
                const opt = document.createElement('option');
                opt.value = h.id;
                opt.textContent = h.hospital_name;
                select.appendChild(opt);
            });
    },

    handleLogin: function (e) {
        e.preventDefault();
        const hospId = document.getElementById('hospitalSelect').value;
        const username = document.getElementById('username')?.value || 'Admin';

        if (!hospId) {
            alert('Please select a hospital');
            return;
        }

        this.currentHospital = SPA.state.hospitals.find(h => h.id === hospId);
        this.currentUser = { username: username, hospitalId: hospId };
        sessionStorage.setItem('admin_session', JSON.stringify(this.currentUser));

        this.showDashboard();
    },

    showDashboard: function () {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.updateStats();
        this.updateFormValues();
        this.renderHistory();
    },

    updateStats: function () {
        if (!this.currentHospital) return;
        const h = this.currentHospital;
        const avail = h.dynamic_availability;
        const cap = h.static_bed_capacity;

        document.getElementById('hospitalName').textContent = h.hospital_name;
        document.getElementById('hospitalType').textContent = h.facility_type;

        document.getElementById('statBeds').textContent = avail.beds_available_now;
        document.getElementById('statBedsTotal').textContent = `of ${cap.total} total`;
        document.getElementById('statOxygen').textContent = avail.oxygen_available;
        document.getElementById('statSurgeons').textContent = avail.surgeons_on_duty;
        document.getElementById('statAmbulance').textContent = avail.ambulance_available === 'Yes' ? 'Available' : 'Unavailable';
    },

    updateFormValues: function () {
        if (!this.currentHospital) return;
        const avail = this.currentHospital.dynamic_availability;

        document.getElementById('bedsInput').value = avail.beds_available_now;
        document.getElementById('oxygenInput').value = avail.oxygen_available;
        document.getElementById('surgeonsInput').value = avail.surgeons_on_duty;
        document.getElementById('theatreInput').value = avail.operating_theatre_status;
        document.getElementById('ambulanceInput').value = avail.ambulance_available;
        document.getElementById('notesInput').value = avail.notes || ''; // Assuming notes in avail or root, keeping simple
    },

    quickUpdate: function (action) {
        if (!this.currentHospital) return;
        const avail = this.currentHospital.dynamic_availability;
        const oldVal = { ...avail };

        let field = '';
        let oldV = '';
        let newV = '';

        switch (action) {
            case 'beds_full':
                avail.beds_available_now = 0;
                field = 'Beds'; oldV = oldVal.beds_available_now; newV = 0;
                break;
            case 'beds_available':
                const half = Math.floor(this.currentHospital.static_bed_capacity.total / 2);
                avail.beds_available_now = half;
                field = 'Beds'; oldV = oldVal.beds_available_now; newV = half;
                break;
            case 'no_oxygen':
                avail.oxygen_available = 'No';
                field = 'Oxygen'; oldV = oldVal.oxygen_available; newV = 'No';
                break;
            case 'oxygen_ok':
                avail.oxygen_available = 'Yes';
                field = 'Oxygen'; oldV = oldVal.oxygen_available; newV = 'Yes';
                break;
            case 'surgeon_available':
                avail.surgeons_on_duty = 'Yes';
                field = 'Surgeons'; oldV = oldVal.surgeons_on_duty; newV = 'Yes';
                break;
            case 'surgeon_oncall':
                avail.surgeons_on_duty = 'On Call';
                field = 'Surgeons'; oldV = oldVal.surgeons_on_duty; newV = 'On Call';
                break;
            case 'ambulance_out':
                avail.ambulance_available = 'No';
                field = 'Ambulance'; oldV = oldVal.ambulance_available; newV = 'No';
                break;
            case 'ambulance_ready':
                avail.ambulance_available = 'Yes';
                field = 'Ambulance'; oldV = oldVal.ambulance_available; newV = 'Yes';
                break;
        }

        avail.last_updated_timestamp = new Date().toISOString();
        if (field) this.logUpdate(field, oldV, newV);
        this.saveChanges();
    },

    handleUpdateSubmit: function (e) {
        e.preventDefault();
        if (!this.currentHospital) return;

        const avail = this.currentHospital.dynamic_availability;
        const oldAvail = { ...avail };

        // Capture new values
        const newBeds = document.getElementById('bedsInput').value;
        const newOxy = document.getElementById('oxygenInput').value;
        const newSurg = document.getElementById('surgeonsInput').value;
        const newThea = document.getElementById('theatreInput').value;
        const newAmb = document.getElementById('ambulanceInput').value;

        if (avail.beds_available_now != newBeds) this.logUpdate('Beds', avail.beds_available_now, newBeds);
        if (avail.oxygen_available != newOxy) this.logUpdate('Oxygen', avail.oxygen_available, newOxy);

        avail.beds_available_now = newBeds;
        avail.oxygen_available = newOxy;
        avail.surgeons_on_duty = newSurg;
        avail.operating_theatre_status = newThea;
        avail.ambulance_available = newAmb;
        avail.last_updated_timestamp = new Date().toISOString();

        this.saveChanges();
    },

    saveChanges: function () {
        SPA.saveData(); // Persist to local storage via main SPA
        this.updateStats();
        this.updateFormValues();
        this.showToast('Updated Successfully');
    },

    logUpdate: function (field, oldV, newV) {
        const entry = {
            timestamp: new Date().toISOString(),
            hospital: this.currentHospital.hospital_name,
            user: this.currentUser.username,
            field: field,
            old: oldV,
            new: newV
        };
        this.updateHistory.unshift(entry);
        localStorage.setItem('admin_update_history', JSON.stringify(this.updateHistory));
        this.renderHistory();
    },

    loadUpdateHistory: function () {
        const h = localStorage.getItem('admin_update_history');
        if (h) this.updateHistory = JSON.parse(h);
    },

    renderHistory: function () {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;

        const relevant = this.currentHospital
            ? this.updateHistory.filter(x => x.hospital === this.currentHospital.hospital_name)
            : [];

        if (relevant.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No updates yet</td></tr>';
            return;
        }

        tbody.innerHTML = relevant.slice(0, 10).map(u => `
            <tr>
                <td>${new Date(u.timestamp).toLocaleString()}</td>
                <td>${u.field}</td>
                <td>${u.old}</td>
                <td><strong>${u.new}</strong></td>
                <td>${u.user}</td>
                <td><span class="status-badge badge-success">Synced</span></td>
            </tr>
        `).join('');
    },

    downloadData: function () {
        if (!this.currentHospital) return;
        const str = JSON.stringify(this.currentHospital, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hospital_${this.currentHospital.id}.json`;
        a.click();
    },

    resetData: function () {
        if (confirm('Are you sure you want to reset all data to defaults?')) {
            localStorage.removeItem('spa_hospitals_data');
            location.reload();
        }
    },

    logout: function () {
        sessionStorage.removeItem('admin_session');
        this.currentUser = null;
        this.currentHospital = null;
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginForm').reset();
    },

    showToast: function (msg) {
        const toast = document.getElementById('toast');
        if (toast) {
            document.getElementById('toastMessage').textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        } else {
            alert(msg);
        }
    }
};

// ============================================
// MODULE: LANDING MAP
// ============================================

const LandingMap = {
    map: null,
    markers: [],

    init: function () {
        console.log('Initializing Landing Map...');
        if (this.map) return; // Already init

        const mapEl = document.getElementById('landingMap');
        if (!mapEl) return;

        // Init Leaflet
        this.map = L.map('landingMap').setView([8.4844, -13.2344], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        this.renderMarkers();

        // Search listener for preview logic
        const input = document.getElementById('mapSearchInput');
        if (input) input.addEventListener('keyup', (e) => this.filterMap(e.target.value));
    },

    renderMarkers: function (filterText = '') {
        // Clear existing
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        const listContainer = document.getElementById('landingMapList');
        if (listContainer) listContainer.innerHTML = '';

        SPA.state.hospitals.forEach(h => {
            if (filterText && !h.hospital_name.toLowerCase().includes(filterText.toLowerCase())) return;

            // Marker logic
            const marker = L.marker([h.latitude, h.longitude])
                .addTo(this.map)
                .bindPopup(`<b>${h.hospital_name}</b><br>${h.facility_type}<br><button onclick="navigateTo('patient-app-view')">View Details</button>`);
            this.markers.push(marker);

            // Sidebar List Item
            if (listContainer) {
                const item = document.createElement('div');
                item.textContent = h.hospital_name;
                item.style.padding = '4px 0';
                item.style.cursor = 'pointer';
                item.onclick = () => {
                    this.map.setView([h.latitude, h.longitude], 15);
                    marker.openPopup();
                };
                listContainer.appendChild(item);
            }
        });
    },

    filterMap: function (text) {
        this.renderMarkers(text);
    }
};

// ============================================
// GLOBAL EXPORTS (Preserving HTML Onclick calls)
// ============================================
// The original HTML files use onclick="functionName()". 
// We must expose these functions to the window object.

window.showScreen = (screenId) => {
    // Patient app screen navigation
    const screens = document.querySelectorAll('#patient-app-view .screen');
    screens.forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';

    // Bottom nav update
    document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    // Simple logic to highlight active nav
    if (screenId === 'homeScreen') document.querySelector('.bottom-nav .nav-item:nth-child(1)').classList.add('active');
};

window.switchView = (mode) => {
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    const listContainer = document.getElementById('hospitalsContainer');
    const mapContainer = document.getElementById('mapContainer');

    if (mode === 'list') {
        listBtn?.classList.add('active');
        mapBtn?.classList.remove('active');
        if (listContainer) listContainer.style.display = 'block';
        if (mapContainer) mapContainer.style.display = 'none';
        PatientApp.renderHospitals(SPA.state.hospitals); // re-render ensuring list
    } else {
        listBtn?.classList.remove('active');
        mapBtn?.classList.add('active');
        if (listContainer) listContainer.style.display = 'none';
        if (mapContainer) mapContainer.style.display = 'flex';
        // Map implementation in Patient App is minimal in placeholder code,
        // Assuming mapContainer has an iframe or needs init.
        // Original app used a placeholder image or similar.
    }
};

window.toggleFilters = () => {
    const p = document.getElementById('filtersPanel');
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
};

window.clearFilters = () => {
    document.querySelectorAll('#filtersPanel input').forEach(i => i.checked = false);
    const d = document.getElementById('filterDistrict');
    if (d) d.value = '';
    PatientApp.applyFilters();
};

window.filterByService = (service) => {
    // Basic service filtering
    const res = SPA.state.hospitals.filter(h => {
        // Checking key services
        const key = service.toLowerCase();
        // naive check against key_services
        return h.key_services && h.key_services[key];
    });
    PatientApp.renderHospitals(res);
    window.showScreen('homeScreen'); // Ensure on list view
};

window.showAllHospitals = () => PatientApp.renderHospitals(SPA.state.hospitals);

window.activateEmergency = () => PatientApp.activateEmergency();

window.getDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
};

// Admin Global Exposures
window.logout = () => AdminApp.logout();
window.quickUpdate = (action) => AdminApp.quickUpdate(action);
window.downloadData = () => AdminApp.downloadData();
window.resetToDefault = () => AdminApp.resetData();
window.resetForm = () => AdminApp.updateFormValues();

// Start
document.addEventListener('DOMContentLoaded', () => SPA.init());
