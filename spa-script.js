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
        SPA.state.currentLanguage = lang;

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
            PatientApp.reRenderView();
        }
    }
};

// Global Helper exposed
window.setLanguage = (lang) => SPA.setLanguage(lang);

// ============================================
// MODULE: PATIENT APP
// ============================================


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

    reRenderView: function() {
        this.applyFilters();
        if (document.getElementById("detailScreen") && document.getElementById("detailScreen").style.display === "block" && this.currentDetailHospital) {
            this.showDetail(this.currentDetailHospital);
        }
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

        div.innerHTML = translateCardHtml(`
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
        `, SPA.state.currentLanguage || "en");
        return div;
    },

    showDetail: function (hospital) {
        this.currentDetailHospital = hospital;

        const detailScreen = document.getElementById('detailScreen');
        const homeScreen = document.getElementById('homeScreen');
        const content = document.getElementById('detailContent');

        if (detailScreen && homeScreen && content) {
            const avail = hospital.dynamic_availability || {};
            const cap = hospital.static_bed_capacity || {};
            const isFav = this.state.favorites.includes(hospital.id);

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

            // Render detail content
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
            `, SPA.state.currentLanguage || "en");

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
