// ============================================
// MedFind Salone - Unified Single-Page App
// Hash-Based Routing & Dynamic Content Loading
// ============================================

let currentSection = 'homeSection';
let loadedSections = new Set(['homeSection']);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing MedFind Salone Unified App...');

    // Hide loading screen after delay
    setTimeout(() => {
        document.getElementById('unifiedLoading').classList.add('hide');
    }, 1000);

    // Setup hash routing
    setupHashRouting();

    // Load initial section based on hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateTo(hash);
    } else {
        navigateTo('homeSection');
    }

    // Update landing stats
    updateLandingStats();

    console.log('✅ Unified App Initialized');

    // Check connectivity status
    updateConnectivityStatus();

    // Add connectivity listeners
    window.addEventListener('online', updateConnectivityStatus);
    window.addEventListener('offline', updateConnectivityStatus);
});

function updateConnectivityStatus() {
    const banner = document.getElementById('offlineBanner');
    const syncTime = document.getElementById('lastSyncTime');

    if (banner && syncTime) {
        if (!navigator.onLine) {
            banner.style.display = 'block';
            syncTime.textContent = new Date().toLocaleTimeString();
        } else {
            banner.style.display = 'none';
        }
    }
}

// ============================================
// HASH-BASED ROUTING
// ============================================

function setupHashRouting() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showSection(hash);
        }
    });
}

function navigateTo(sectionId) {
    // Update URL hash
    window.location.hash = sectionId;

    // Show section
    showSection(sectionId);
}

function showSection(sectionId) {
    console.log(`📍 Navigating to: ${sectionId}`);

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;

        // Load section content if not loaded
        if (!loadedSections.has(sectionId)) {
            loadSectionContent(sectionId);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// ============================================
// DYNAMIC CONTENT LOADING
// ============================================

async function loadSectionContent(sectionId) {
    console.log(`📥 Loading content for: ${sectionId}`);

    try {
        switch (sectionId) {
            case 'patientSection':
                await loadPatientApp();
                break;
            case 'adminSection':
                await loadAdminApp();
                break;
            case 'mapSection':
                await loadMapApp();
                break;
        }

        loadedSections.add(sectionId);
        console.log(`✅ Content loaded: ${sectionId}`);
    } catch (error) {
        console.error(`❌ Failed to load ${sectionId}:`, error);
    }
}

// ============================================
// LOAD PATIENT APP
// ============================================

async function loadPatientApp() {
    const container = document.getElementById('patientAppContainer');

    // Create patient app structure
    container.innerHTML = `
        <!-- Patient App Content -->
        <div id="app" class="app-container">
            <!-- HOME SECTION -->
            <section id="patientHomeSection" class="section active">
                <header class="app-header">
                    <img src="./assets/logo.svg" alt="MedFind Logo" class="app-logo" onerror="this.style.display='none'">
                    <h1>MedFind Salone</h1>
                    <p class="subtitle">Find Emergency Medical Services</p>
                </header>

                <!-- Emergency SOS Button -->
                <button class="emergency-btn" id="sosBtn">
                    🚨 SOS - FIND HELP NOW
                </button>

                <!-- Search Bar -->
                <div class="search-container">
                    <input type="text" id="searchInput" class="search-input"
                        placeholder="Search hospitals by name, district, or service...">
                    <button class="search-btn" id="searchBtn">🔍</button>
                </div>

                <!-- Service Cards -->
                <div class="services-grid">
                    <div class="service-card" data-service="maternity">
                        <div class="service-icon">👶</div>
                        <h3>Maternity</h3>
                        <p>Delivery & Obstetric Care</p>
                    </div>
                    <div class="service-card" data-service="surgery">
                        <div class="service-icon">🔪</div>
                        <h3>Surgery</h3>
                        <p>Operating Theatre Services</p>
                    </div>
                    <div class="service-card" data-service="emergency">
                        <div class="service-icon">🚨</div>
                        <h3>Emergency</h3>
                        <p>24/7 Emergency Care</p>
                    </div>
                    <div class="service-card" data-service="pediatrics">
                        <div class="service-icon">🧒</div>
                        <h3>Pediatrics</h3>
                        <p>Children's Healthcare</p>
                    </div>
                    <div class="service-card" data-service="icu">
                        <div class="service-icon">🏥</div>
                        <h3>ICU</h3>
                        <p>Intensive Care Unit</p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats-container">
                    <div class="stat">
                        <span class="stat-number" id="totalHospitals">0</span>
                        <span class="stat-label">Hospitals</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number" id="districtsCount">16</span>
                        <span class="stat-label">Districts Covered</span>
                    </div>
                </div>
            </section>

            <!-- Results, Detail, and Emergency sections loaded dynamically -->
            <section id="resultsSection" class="section"></section>
            <section id="detailSection" class="section"></section>
            <section id="emergencySection" class="section emergency-section"></section>
        </div>
    `;

    // Load and execute patient app script
    await loadScript('./spa-script.js');
}

// ============================================
// LOAD ADMIN APP
// ============================================

async function loadAdminApp() {
    const container = document.getElementById('adminAppContainer');

    // Load admin content from admin.html body
    container.innerHTML = `
        <div id="adminContent">
            <!-- Admin content will be loaded here -->
            <p style="text-align: center; padding: 40px; color: #6b7280;">
                Loading Admin Portal...
            </p>
        </div>
    `;

    // Load admin script
    await loadScript('./admin-script.js');

    // The admin script will populate the container
    setTimeout(() => {
        if (document.getElementById('loginScreen')) {
            container.innerHTML = '';
            container.appendChild(document.getElementById('loginScreen'));
            if (document.getElementById('adminDashboard')) {
                container.appendChild(document.getElementById('adminDashboard'));
            }
        }
    }, 100);
}

// ============================================
// LOAD MAP APP
// ============================================

async function loadMapApp() {
    const container = document.getElementById('mapAppContainer');

    container.innerHTML = `
        <div class="map-wrapper" style="display: flex; height: calc(100vh - 60px);">
            <!-- Sidebar -->
            <aside class="sidebar" id="mapSidebar" style="width: 350px; overflow-y: auto;">
                <div class="stats-summary">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="mapTotalHospitals">0</div>
                            <div class="stat-label">Hospitals</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="mapDistrictsCount">16</div>
                            <div class="stat-label">Districts</div>
                        </div>
                    </div>
                </div>
                <div class="sidebar-header">
                    <h2>Find Hospitals</h2>
                    <input type="text" id="mapSearchInput" class="search-box" placeholder="Search...">
                </div>
                <div id="mapHospitalList" class="hospital-list"></div>
            </aside>
            
            <!-- Map Container -->
            <div id="hospitalMap" style="flex: 1; height: 100%;"></div>
        </div>
    `;

    // Load map script
    await loadScript('./map-script.js');
}

// ============================================
// UTILITY: LOAD EXTERNAL SCRIPT
// ============================================

function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// ============================================
// QUICK MENU
// ============================================

function showQuickMenu() {
    document.getElementById('quickMenu').classList.add('show');
}

function hideQuickMenu() {
    document.getElementById('quickMenu').classList.remove('show');
}

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideQuickMenu();
    }
});

// ============================================
// LANDING PAGE STATS
// ============================================

async function updateLandingStats() {
    try {
        // Load hospital data for stats
        const response = await fetch('./data/hospitals_complete.json');
        const hospitals = await response.json();

        document.getElementById('landingTotalHospitals').textContent = hospitals.length;
    } catch (error) {
        console.warn('Could not load hospital stats:', error);
    }
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================

// Make navigateTo available globally
window.navigateTo = navigateTo;
window.showQuickMenu = showQuickMenu;
window.hideQuickMenu = hideQuickMenu;

// ============================================
// SERVICE WORKER (Future Enhancement)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ SW registration failed:', err));
    });
}

console.log('✅ Unified Script Loaded');
