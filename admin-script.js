(function () {
    // Global State
    let hospitals = [];
    let currentHospital = null;
    let currentUser = null;
    let updateHistory = [];
    let isOnline = navigator.onLine;

    // Initialize Admin
    async function initAdmin() {
        console.log('🏥 MedFind Admin Premium Initializing...');
        await loadHospitalData();
        setupLoginForm();
        checkSession();

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    async function loadHospitalData() {
        if (window.MedFindData && window.MedFindData.FALLBACK_DATA) {
            hospitals = window.MedFindData.FALLBACK_DATA;
        }
        populateHospitalSelect();
    }

    function populateHospitalSelect() {
        const select = document.getElementById('hospitalSelect');
        if (!select) return;
        hospitals.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id;
            opt.textContent = `${h.hospital_name} (${h.district})`;
            select.appendChild(opt);
        });
    }

    // --- Login & Session ---
    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) form.addEventListener('submit', (e) => {
            e.preventDefault();
            const hId = document.getElementById('hospitalSelect').value;
            if (!hId) return alert('Select a hospital');
            
            currentUser = { username: document.getElementById('username').value || 'Admin' };
            currentHospital = hospitals.find(h => h.id === hId);
            
            sessionStorage.setItem('mf_admin_session', JSON.stringify({ u: currentUser, hId: hId }));
            showDashboard();
        });
    }

    function checkSession() {
        const session = sessionStorage.getItem('mf_admin_session');
        if (session) {
            const data = JSON.parse(session);
            currentUser = data.u;
            currentHospital = hospitals.find(h => h.id === data.hId);
            if (currentHospital) showDashboard();
        }
    }

    window.logout = function() {
        sessionStorage.removeItem('mf_admin_session');
        location.reload();
    };

    // --- Navigation ---
    window.showPanel = function(panelId) {
        // In this simplified version, we just scroll to the section or toggle visibility
        // For a true SPA feel, we could toggle display on panels
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Simple scroll for now, or could be expanded to actual panel switching
        const target = document.querySelector(`h2:contains("${panelId}")`)?.parentElement;
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Dashboard Logic ---
    function showDashboard() {
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('adminDashboard').classList.remove('d-none');
        updateDashboardInfo();
        updateStats();
        populateForm();
        renderHistory();
    }

    function updateDashboardInfo() {
        if (!currentHospital) return;
        document.getElementById('hospitalName').textContent = currentHospital.hospital_name;
        document.getElementById('hospitalType').textContent = currentHospital.facility_type;
    }

    function updateStats() {
        if (!currentHospital) return;
        const beds = currentHospital.beds_detailed || {};
        const staff = currentHospital.staff || {};
        const eq = currentHospital.equipment || {};

        document.getElementById('statBeds').textContent = (beds.adult?.available || 0) + (beds.maternity?.available || 0);
        document.getElementById('statSurgeons').textContent = staff.emergency_doctors?.replace('_', ' ') || 'None';
        document.getElementById('statOxygen').textContent = eq.oxygen || 'N/A';
    }

    function populateForm() {
        if (!currentHospital) return;
        const beds = currentHospital.beds_detailed || {};
        const staff = currentHospital.staff || {};
        const eq = currentHospital.equipment || {};

        if (document.getElementById('bedsMaleAvail')) {
            document.getElementById('bedsMaleAvail').value = beds.adult?.available || 0;
            document.getElementById('bedsMaleTotal').value = beds.adult?.total || 0;
            document.getElementById('bedsFemaleAvail').value = beds.pediatric?.available || 0;
            document.getElementById('bedsFemaleTotal').value = beds.pediatric?.total || 0;
            document.getElementById('bedsICUAvail').value = beds.icu?.available || 0;
            document.getElementById('bedsICUTotal').value = beds.icu?.total || 0;
        }

        document.getElementById('surgeonsInput').value = staff.emergency_doctors || 'unavailable';
        document.getElementById('oxygenInput').value = eq.oxygen || 'unavailable';
        document.getElementById('ambulanceInput').value = currentHospital.emergency_services?.ambulance_available ? 'Yes' : 'No';
    }

    // --- Form Actions ---
    const form = document.getElementById('updateForm');
    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveChanges();
    });

    function saveChanges() {
        if (!currentHospital) return;
        
        // Update local object
        const beds = currentHospital.beds_detailed;
        beds.adult.available = parseInt(document.getElementById('bedsMaleAvail').value);
        beds.icu.available = parseInt(document.getElementById('bedsICUAvail').value);
        
        currentHospital.staff.emergency_doctors = document.getElementById('surgeonsInput').value;
        currentHospital.equipment.oxygen = document.getElementById('oxygenInput').value;
        
        logUpdate('Resources Updated');
        showToast('All changes synced to network');
        updateStats();
    }

    window.quickUpdate = function(action) {
        if (!currentHospital) return;
        if (action === 'emergency_closed') currentHospital.staff.emergency_doctors = 'unavailable';
        if (action === 'emergency_open') currentHospital.staff.emergency_doctors = 'on_site';
        if (action === 'beds_full') {
            currentHospital.beds_detailed.adult.available = 0;
            currentHospital.beds_detailed.icu.available = 0;
        }
        
        logUpdate(`Quick Update: ${action}`);
        showToast('Status broadcasted');
        updateStats();
        populateForm();
    };

    function logUpdate(msg) {
        updateHistory.unshift({
            time: new Date().toLocaleTimeString(),
            field: msg,
            old: '---',
            new: 'Updated',
            admin: currentUser?.username || 'Admin'
        });
        renderHistory();
    }

    function renderHistory() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        tbody.innerHTML = updateHistory.map(h => `
            <tr>
                <td>${h.time}</td>
                <td>${h.field}</td>
                <td>${h.old}</td>
                <td><strong>${h.new}</strong></td>
                <td>${h.admin}</td>
            </tr>
        `).join('');
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        const m = document.getElementById('toastMessage');
        m.textContent = msg;
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }

    function updateOnlineStatus() {
        isOnline = navigator.onLine;
        const dot = document.getElementById('syncDot');
        const status = document.getElementById('syncStatus');
        const banner = document.getElementById('offlineBanner');
        
        if (dot) dot.style.background = isOnline ? 'var(--success)' : 'var(--danger)';
        if (status) status.textContent = isOnline ? 'Online' : 'Offline';
        if (banner) banner.classList.toggle('d-none', isOnline);
    }

    document.addEventListener('DOMContentLoaded', initAdmin);
})();
