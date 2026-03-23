(function () {
    // Global State
    let hospitals = [];
    let currentHospitals = [];
    let userLocation = null;
    let favorites = [];
    let currentLanguage = 'en';
    let currentEmergencyType = 'general';

    // Initialize App
    async function initApp() {
        console.log('🚀 Initializing MedFind Salone Premium...');
        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('app');

        try {
            await loadHospitalsData();
            loadFavorites();
            getCurrentLocation();
            checkOnlineStatus();

            window.addEventListener('online', checkOnlineStatus);
            window.addEventListener('offline', checkOnlineStatus);

            console.log('✅ App initialized');
        } catch (error) {
            console.error('❌ Initialization Error:', error);
        } finally {
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                if (appContainer) appContainer.style.display = 'block';
            }, 500);
        }
    }

    async function loadHospitalsData() {
        // Mock data loading from window.MedFindData
        if (window.MedFindData && window.MedFindData.FALLBACK_DATA) {
            hospitals = window.MedFindData.FALLBACK_DATA;
        } else {
            console.warn('Data not found, using empty array');
            hospitals = [];
        }
        currentHospitals = [...hospitals];
        displayHospitals(hospitals);
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    userLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                    calculateDistances();
                    displayHospitals(currentHospitals);
                },
                err => {
                    userLocation = { latitude: 8.4844, longitude: -13.2344 }; // Freetown center
                    calculateDistances();
                    displayHospitals(currentHospitals);
                }
            );
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
    }

    function calculateDistances() {
        if (!userLocation) return;
        hospitals.forEach(h => {
            h.distance = calculateDistance(userLocation.latitude, userLocation.longitude, h.latitude, h.longitude);
        });
        hospitals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // --- 6-Step Scoring Algorithm ---
    function calculateHospitalScore(h, type) {
        let score = 0;

        // 1. Distance (30%)
        const dist = h.distance || 50;
        let distScore = 0;
        if (dist < 5) distScore = 30;
        else if (dist < 15) distScore = 20;
        else if (dist < 30) distScore = 10;
        else distScore = 5;
        score += distScore;

        // 2. Bed Availability (20%)
        const beds = h.beds_detailed || {};
        let bedScore = 0;
        if (type === 'pregnancy' && beds.maternity?.available > 0) bedScore = 20;
        else if (type === 'child' && beds.pediatric?.available > 0) bedScore = 20;
        else if (type === 'heart_attack' && beds.icu?.available > 0) bedScore = 20;
        else if (beds.adult?.available > 0) bedScore = 20;
        else if (beds.adult?.available === 0) bedScore = 5;
        score += bedScore;

        // 3. Critical Equipment (15%)
        const eq = h.equipment || {};
        let eqScore = 0;
        if (type === 'asthma' && eq.oxygen === 'available') eqScore = 15;
        if (type === 'heart_attack' && eq.ventilators === 'available') eqScore = 15;
        if (type === 'trauma' && eq.imaging?.ct === 'available') eqScore = 10;
        if (eq.oxygen === 'available') eqScore += 5;
        score += Math.min(eqScore, 15);

        // 4. Specialist Availability (15%)
        const staff = h.staff || {};
        let staffScore = 0;
        const sStatus = (role) => {
            if (staff[role] === 'on_site') return 15;
            if (staff[role] === 'on_call') return 8;
            return 0;
        };
        if (type === 'pregnancy') staffScore = sStatus('obstetricians');
        else if (type === 'child') staffScore = sStatus('pediatricians');
        else if (type === 'surgery' || type === 'trauma') staffScore = sStatus('surgeons');
        else if (type === 'heart_attack') staffScore = sStatus('cardiologists');
        else staffScore = sStatus('emergency_doctors');
        score += staffScore;

        // 5. Department Status (10%)
        const dept = h.departments || {};
        let deptScore = 0;
        if (type === 'surgery' && dept.surgery === 'open') deptScore = 10;
        if (type === 'pregnancy' && dept.maternity === 'open') deptScore = 10;
        if (dept.pharmacy === 'open') deptScore += 2;
        score += Math.min(deptScore, 10);

        // 6. ER Queue / Inflow (10%)
        const er = h.emergency_services || {};
        let erScore = 10; // Start full
        if (er.er_queue_length > 10) erScore = 2;
        else if (er.er_queue_length > 5) erScore = 5;
        if (!er.ambulance_available) erScore -= 2;
        score += Math.max(erScore, 0);

        return score;
    }

    // --- Emergency Workflow ---
    window.selectEmergencyType = function(type) {
        currentEmergencyType = type;
        
        // Calculate scores for all hospitals
        hospitals.forEach(h => {
            h.currentScore = calculateHospitalScore(h, type);
        });

        // Sort by score (descending)
        const sorted = [...hospitals].sort((a, b) => b.currentScore - a.currentScore);
        
        const best = sorted[0];
        const secondary = sorted.slice(1, 4);

        renderEmergencyResults(best, secondary);
        showScreen('emergencyScreen');
    };

    function renderEmergencyResults(best, secondary) {
        const recContainer = document.getElementById('emergencyRecommendation');
        const secContainer = document.getElementById('secondaryRecommendations');

        recContainer.innerHTML = createHospitalCard(best, true);
        secContainer.innerHTML = '';
        secondary.forEach(h => {
            secContainer.innerHTML += createHospitalCard(h);
        });
    }

    // --- UI Rendering ---
    function displayHospitals(list) {
        const container = document.getElementById('hospitalList');
        if (!container) return;
        container.innerHTML = '';
        list.forEach(h => container.appendChild(createHospitalCard(h)));
        document.getElementById('resultCount').textContent = list.length;
    }

    function createHospitalCard(h, isFeatured = false) {
        const div = document.createElement('div');
        div.className = isFeatured ? 'hospital-card featured' : 'hospital-card';
        if (isFeatured) div.style.borderColor = 'var(--primary)';
        if (isFeatured) div.style.borderWidth = '2px';

        div.onclick = () => showHospitalDetail(h.id);

        const beds = h.beds_detailed || {};
        const staff = h.staff || {};
        const er = h.emergency_services || {};

        const statusPills = [];
        if (h.beds_detailed?.adult?.available > 0) statusPills.push(`<span class="pill pill-green">🛏️ Beds Available</span>`);
        else statusPills.push(`<span class="pill pill-red">🛏️ Beds Full</span>`);

        if (h.equipment?.oxygen === 'available') statusPills.push(`<span class="pill pill-green">💨 Oxygen</span>`);
        if (h.staff?.emergency_doctors === 'on_site') statusPills.push(`<span class="pill pill-green">👨‍⚕️ ER Doctor On-Site</span>`);
        
        const scoreDisplay = h.currentScore ? `<div class="score-badge">Match: ${Math.round(h.currentScore)}%</div>` : '';

        div.innerHTML = `
            <div class="card-header">
                <div>
                    <h4 class="h-name">${h.hospital_name}</h4>
                    <span class="h-type">${h.facility_type}</span>
                </div>
                <div style="text-align: right">
                    <div class="h-dist">${h.distance ? h.distance + ' km' : ''}</div>
                    ${scoreDisplay}
                </div>
            </div>
            <div class="status-pills">
                ${statusPills.join('')}
            </div>
            <div class="card-footer">
                <div class="footer-item">📍 ${h.district}</div>
                <div class="footer-item">⏱️ ER Wait: ${er.er_queue_length || '0'} min</div>
            </div>
        `;
        return isFeatured ? div.outerHTML : div;
    }

    window.showHospitalDetail = function(id) {
        const h = hospitals.find(x => x.id === id);
        if (!h) return;

        const container = document.getElementById('detailContent');
        const beds = h.beds_detailed || {};
        const staff = h.staff || {};
        const eq = h.equipment || {};

        const getDot = (val) => {
            if (val === 'available' || val === 'on_site' || val === 'open') return 'dot-green';
            if (val === 'limited' || val === 'on_call') return 'dot-yellow';
            return 'dot-red';
        };

        container.innerHTML = `
            <div class="detail-hero">
                <h1 class="detail-title">${h.hospital_name}</h1>
                <p class="detail-meta">${h.facility_type} • ${h.district}</p>
                <div class="status-pills">
                    <span class="pill pill-green">Reliability: ${h.reliability_score}/5.0</span>
                    <span class="pill pill-surface">Updated: Just now</span>
                </div>
            </div>

            <div class="resource-section">
                <h3 class="section-title">Emergency Status</h3>
                <div class="resource-grid">
                    <div class="resource-card">
                        <span class="res-label">ER DOCTOR</span>
                        <div class="res-value"><span class="status-dot ${getDot(staff.emergency_doctors)}"></span> ${staff.emergency_doctors.replace('_', ' ')}</div>
                    </div>
                    <div class="resource-card">
                        <span class="res-label">SURGERY</span>
                        <div class="res-value"><span class="status-dot ${getDot(h.departments?.surgery)}"></span> ${h.departments?.surgery}</div>
                    </div>
                </div>
            </div>

            <div class="resource-section">
                <h3 class="section-title">Available Beds</h3>
                <div class="resource-grid">
                    <div class="resource-card">
                        <span class="res-label">ADULT</span>
                        <div class="res-value">${beds.adult?.available} / ${beds.adult?.total}</div>
                    </div>
                    <div class="resource-card">
                        <span class="res-label">MATERNITY</span>
                        <div class="res-value">${beds.maternity?.available} / ${beds.maternity?.total}</div>
                    </div>
                    <div class="resource-card">
                        <span class="res-label">ICU</span>
                        <div class="res-value">${beds.icu?.available} / ${beds.icu?.total}</div>
                    </div>
                    <div class="resource-card">
                        <span class="res-label">PEDIATRIC</span>
                        <div class="res-value">${beds.pediatric?.available} / ${beds.pediatric?.total}</div>
                    </div>
                </div>
            </div>

            <div class="resource-section">
                <h3 class="section-title">Equipment & Services</h3>
                <div class="resource-grid">
                    <div class="resource-card">
                        <span class="res-label">OXYGEN</span>
                        <div class="res-value"><span class="status-dot ${getDot(eq.oxygen)}"></span> ${eq.oxygen}</div>
                    </div>
                    <div class="resource-card">
                        <span class="res-label">AMBULANCE</span>
                        <div class="res-value"><span class="status-dot ${getDot(h.emergency_services?.ambulance_available ? 'open' : 'closed')}"></span> ${h.emergency_services?.ambulance_available ? 'Available' : 'No'}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('callBtn').onclick = () => window.location.href = `tel:${h.phone}`;
        document.getElementById('directionsBtn').onclick = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`, '_blank');

        showScreen('detailScreen');
    };

    // --- Search & Filters ---
    window.performSearch = function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = hospitals.filter(h => 
            h.hospital_name.toLowerCase().includes(query) || 
            h.district.toLowerCase().includes(query)
        );
        displayHospitals(filtered);
    };

    window.filterByService = function(service) {
        let filtered = hospitals;
        if (service === 'emergency') filtered = hospitals.filter(h => h.staff?.emergency_doctors === 'on_site');
        if (service === 'maternity') filtered = hospitals.filter(h => h.departments?.maternity === 'open');
        if (service === 'icu') filtered = hospitals.filter(h => h.beds_detailed?.icu?.total > 0);
        if (service === 'oxygen') filtered = hospitals.filter(h => h.equipment?.oxygen === 'available');
        displayHospitals(filtered);
    };

    // --- Navigation Helpers ---
    window.showScreen = function(id) {
        document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
        const target = document.getElementById(id);
        if (target) target.style.display = 'block';
        
        // Hide map if showing screen
        document.getElementById('mapContainer').style.display = 'none';
        
        // Update tab bar active state
        document.querySelectorAll('.tab-item').forEach(i => i.classList.remove('active'));
        if (id === 'homeScreen') document.querySelector('.tab-bar .tab-item:nth-child(1)').classList.add('active');
        if (id === 'emergencySelectScreen') document.querySelector('.tab-bar .tab-item:nth-child(3)').classList.add('active');
    };

    window.showFavorites = function() {
        if (favorites.length === 0) {
            alert('No saved hospitals yet.');
            return;
        }
        const filtered = hospitals.filter(h => favorites.includes(h.id));
        displayHospitals(filtered);
        showScreen('homeScreen');
    };

    function loadFavorites() {
        const stored = localStorage.getItem('mf_favorites');
        favorites = stored ? JSON.parse(stored) : [];
    }

    function checkOnlineStatus() {
        const banner = document.getElementById('offlineBanner');
        if (banner) {
            banner.style.display = navigator.onLine ? 'none' : 'block';
        }
    }

    // Init call
    document.addEventListener('DOMContentLoaded', initApp);

})();
