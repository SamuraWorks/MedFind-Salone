// ============================================
// MedFind Salone - Admin Portal Script
// Hospital Data Management System
// ============================================

(function () {

    const adminTranslations = {
        en: {
            admin_subtitle: "Hospital Admin Portal",
            username: "Username",
            password: "Password",
            hospital_select_label: "Hospital",
            select_hospital_placeholder: "Select your hospital...",
            login_btn: "Login",
            need_help: "Need help? Contact:",
            demo_note: "🔓 Demo Mode: Use any username/password to login",
            view_patient_app: "View Patient App",
            logout: "Logout",
            beds_available: "Beds Available",
            oxygen_status: "Oxygen Status",
            surgeons_on_duty: "Surgeons on Duty",
            ambulance: "Ambulance",
            quick_updates_title: "⚡ Quick Updates",
            detailed_update_title: "📝 Full Data Update",
            save_changes_btn: "💾 Sync & Save Updates",
            reset_btn: "Discard Changes"
        },
        kr: {
            admin_subtitle: "Hospital Admin Portal",
            username: "Nem",
            password: "Password",
            hospital_select_label: "Hospital",
            select_hospital_placeholder: "Pik yu hospital...",
            login_btn: "Login",
            need_help: "Yu nid hɛlp? Kɔntackt:",
            demo_note: "🔓 Demo Mode: Yu fɔ yuz ɛni nem/password fɔ login",
            view_patient_app: "Luk Peshɛnt App",
            logout: "Lɔgawt",
            beds_available: "Bed Dɛn We De",
            oxygen_status: "Oxygen Wetin De",
            surgeons_on_duty: "Dɔkta Dɛn De",
            ambulance: "Ambulans",
            quick_updates_title: "⚡ Kwik Abdeʈ Dɛn",
            detailed_update_title: "📝 Bɛtɛ BɛtƐ Abdeʈ",
            save_changes_btn: "💾 Sev Ɔl Abdeʈ",
            reset_btn: "Rizɛt"
        }
    };

    let currentAdminLanguage = 'en';

    function setAdminLanguage(lang) {
        currentAdminLanguage = lang;
        const trans = adminTranslations[lang];

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (trans[key]) el.textContent = trans[key];
        });

        const enBtn = document.getElementById('adminLangEn');
        const krBtn = document.getElementById('adminLangKr');
        if (enBtn) enBtn.classList.toggle('active', lang === 'en');
        if (krBtn) krBtn.classList.toggle('active', lang === 'kr');

        localStorage.setItem('admin_lang_pref', lang);
    }
    window.setAdminLanguage = setAdminLanguage;

    let hospitals = [];
    let currentHospital = null;
    let currentUser = null;
    let updateHistory = [];
    let isOnline = navigator.onLine;

    // ============================================
    // INITIALIZATION
    // ============================================

    async function initAdmin() {
        console.log('🏥 Admin Portal Initializing...');

        // Load hospital data
        await loadHospitalData();
        setAdminLanguage(localStorage.getItem('admin_lang_pref') || 'en');

        // Populate hospital dropdown
        populateHospitalSelect();

        // Setup login form
        setupLoginForm();

        // Load update history
        loadUpdateHistory();

        // Online/Offline Listeners
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();

        console.log('✅ Admin Portal Ready');
    }

    function updateOnlineStatus() {
        isOnline = navigator.onLine;
        const syncDot = document.getElementById('syncDot');
        const syncStatus = document.getElementById('syncStatus');
        const banner = document.getElementById('offlineBanner');

        if (syncDot) syncDot.classList.toggle('offline', !isOnline);
        if (syncStatus) syncStatus.textContent = isOnline ? 'Online' : 'Offline (Local Only)';
        if (banner) banner.style.display = isOnline ? 'none' : 'block';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdmin);
    } else {
        initAdmin();
    }

    // ============================================
    // DATA LOADING
    // ============================================

    async function loadHospitalData() {
        try {
            hospitals = await window.MedFindData.init();
            if (!hospitals || hospitals.length === 0) {
                hospitals = JSON.parse(JSON.stringify(window.MedFindData.FALLBACK_DATA));
            }
        } catch (error) {
            console.error('❌ Data load failed:', error);
            showToast('Failed to load data.', 'error');
        }
    }

    function populateHospitalSelect() {
        const select = document.getElementById('hospitalSelect');
        if (!select) return;

        while (select.options.length > 1) select.remove(1);

        const sortedHospitals = [...hospitals].sort((a, b) =>
            a.hospital_name.localeCompare(b.hospital_name)
        );

        sortedHospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.id;
            option.textContent = `${hospital.hospital_name} (${hospital.district})`;
            select.appendChild(option);
        });
    }

    // ============================================
    // LOGIN SYSTEM
    // ============================================

    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) form.addEventListener('submit', handleLogin);
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const hospitalId = document.getElementById('hospitalSelect').value;

        if (!hospitalId) {
            showToast('Please select a hospital', 'error');
            return;
        }

        currentUser = { username, hospitalId, loginTime: new Date().toISOString() };
        currentHospital = hospitals.find(h => h.id === hospitalId);

        if (!currentHospital) {
            showToast('Hospital not found', 'error');
            return;
        }

        sessionStorage.setItem('admin_session', JSON.stringify(currentUser));
        showDashboard();
        showToast(`Welcome, ${username}!`, 'success');
    }

    function showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        updateDashboardInfo();
        updateStats();
        updateForm();
    }

    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('admin_session');
            currentUser = null;
            currentHospital = null;
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('loginForm').reset();
            showToast('Logged out', 'success');
        }
    }

    function goToApp() {
        window.location.href = './index.html';
    }

    // ============================================
    // DASHBOARD UPDATE
    // ============================================

    function updateDashboardInfo() {
        if (!currentHospital) return;
        document.getElementById('hospitalName').textContent = currentHospital.hospital_name;
        document.getElementById('hospitalType').textContent = currentHospital.facility_type;
    }

    function updateStats() {
        if (!currentHospital) return;
        const avail = currentHospital.dynamic_availability || {};

        document.getElementById('statBeds').textContent = avail.beds_available_now || 0;

        if (document.getElementById('statICU')) {
            document.getElementById('statICU').textContent = avail.beds_icu_available || 0;
            document.getElementById('statMat').textContent = avail.beds_mat_available || 0;
            document.getElementById('statPed').textContent = avail.beds_ped_available || 0;
        }

        const breakdown = document.getElementById('bedBreakdown');
        if (breakdown) {
            breakdown.innerHTML = `M: ${avail.beds_male_available || 0} | F: ${avail.beds_female_available || 0} | C: ${avail.beds_ped_available || 0}`;
        }

        document.getElementById('statOxygen').textContent = avail.oxygen_available || 'No';
        document.getElementById('statSurgeons').textContent = avail.surgeons_on_duty || 'No';
        document.getElementById('statAmbulance').textContent = avail.ambulance_available === 'Yes' ? 'Available' : 'Unavailable';

        updateCardColors();
    }

    function updateCardColors() {
        if (!currentHospital) return;
        const avail = currentHospital.dynamic_availability || {};

        const oxyCard = document.getElementById('oxygenCard');
        if (oxyCard) {
            oxyCard.style.borderLeft = `5px solid ${avail.oxygen_available === 'Yes' ? '#10b981' : (avail.oxygen_available === 'Limited' ? '#f59e0b' : '#ef4444')}`;
        }

        const surgCard = document.getElementById('surgeonCard');
        if (surgCard) {
            surgCard.style.borderLeft = `5px solid ${avail.surgeons_on_duty === 'Yes' ? '#10b981' : (avail.surgeons_on_duty === 'On Call' ? '#f59e0b' : '#ef4444')}`;
        }

        const ambCard = document.getElementById('ambulanceCard');
        if (ambCard) {
            ambCard.style.borderLeft = `5px solid ${avail.ambulance_available === 'Yes' ? '#10b981' : '#ef4444'}`;
        }
    }

    function updateForm() {
        if (!currentHospital) return;
        const avail = currentHospital.dynamic_availability || {};
        const cap = currentHospital.static_bed_capacity || {};
        const services = currentHospital.key_services || {};

        if (document.getElementById('bedsMaleAvail')) {
            document.getElementById('bedsMaleAvail').value = avail.beds_male_available || 0;
            document.getElementById('bedsMaleTotal').value = cap.male || 0;
            document.getElementById('bedsFemaleAvail').value = avail.beds_female_available || 0;
            document.getElementById('bedsFemaleTotal').value = cap.female || 0;
            document.getElementById('bedsPedAvail').value = avail.beds_ped_available || 0;
            document.getElementById('bedsPedTotal').value = cap.pediatric || 0;
            document.getElementById('bedsICUAvail').value = avail.beds_icu_available || 0;
            document.getElementById('bedsICUTotal').value = cap.icu || 0;
            document.getElementById('bedsMatAvail').value = avail.beds_mat_available || 0;
            document.getElementById('bedsMatTotal').value = cap.maternity || 0;

            document.getElementById('srvER').checked = !!services.emergency;
            document.getElementById('srvSurgery').checked = !!services.surgery;
            document.getElementById('srvLab').checked = !!services.lab;
            document.getElementById('srvPharm').checked = !!services.pharmacy;
            document.getElementById('srvBlood').checked = !!services.blood_bank;

            // Specialized Services
            if (document.getElementById('srvEye')) document.getElementById('srvEye').checked = !!services.eye_care;
            if (document.getElementById('srvENT')) document.getElementById('srvENT').checked = !!services.ent;
            if (document.getElementById('srvDental')) document.getElementById('srvDental').checked = !!services.dental;
            if (document.getElementById('srvOrtho')) document.getElementById('srvOrtho').checked = !!services.orthopedics;
            if (document.getElementById('srvCardio')) document.getElementById('srvCardio').checked = !!services.cardiology;
            if (document.getElementById('srvDialysis')) document.getElementById('srvDialysis').checked = !!services.dialysis;
        }

        document.getElementById('surgeonsInput').value = avail.surgeons_on_duty || 'No';
        document.getElementById('oxygenInput').value = avail.oxygen_available || 'No';
        document.getElementById('ambulanceInput').value = avail.ambulance_available || 'No';
        document.getElementById('notesInput').value = currentHospital.notes || '';
    }

    function quickUpdate(action) {
        if (!currentHospital) return;
        const avail = currentHospital.dynamic_availability;

        switch (action) {
            case 'emergency_closed':
                currentHospital.key_services.emergency = false;
                logUpdate('ER Status', 'Open', 'Closed');
                break;
            case 'emergency_open':
                currentHospital.key_services.emergency = true;
                logUpdate('ER Status', 'Closed', 'Open');
                break;
            case 'no_oxygen':
                avail.oxygen_available = 'No';
                logUpdate('Oxygen', 'Previous', 'No');
                break;
            case 'oxygen_ok':
                avail.oxygen_available = 'Yes';
                logUpdate('Oxygen', 'Previous', 'Yes');
                break;
            case 'surgeon_oncall':
                avail.surgeons_on_duty = 'On Call';
                logUpdate('Surgery Duty', 'Previous', 'On Call');
                break;
            case 'beds_full':
                avail.beds_available_now = 0;
                avail.beds_male_available = 0;
                avail.beds_female_available = 0;
                avail.beds_icu_available = 0;
                avail.beds_mat_available = 0;
                avail.beds_ped_available = 0;
                logUpdate('Bed Status', 'Previous', 'FULLY OCCUPIED');
                break;
        }

        avail.last_updated_timestamp = new Date().toISOString();
        saveHospitalData();
        updateStats();
        updateForm();
        showToast('Quick update synced!', 'success');
    }

    const form = document.getElementById('updateForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();
        if (!currentHospital) return;

        const avail = currentHospital.dynamic_availability;
        const cap = currentHospital.static_bed_capacity;
        const srv = currentHospital.key_services;

        avail.beds_male_available = parseInt(document.getElementById('bedsMaleAvail').value) || 0;
        cap.male = parseInt(document.getElementById('bedsMaleTotal').value) || 0;
        avail.beds_female_available = parseInt(document.getElementById('bedsFemaleAvail').value) || 0;
        cap.female = parseInt(document.getElementById('bedsFemaleTotal').value) || 0;
        avail.beds_ped_available = parseInt(document.getElementById('bedsPedAvail').value) || 0;
        cap.pediatric = parseInt(document.getElementById('bedsPedTotal').value) || 0;
        avail.beds_icu_available = parseInt(document.getElementById('bedsICUAvail').value) || 0;
        cap.icu = parseInt(document.getElementById('bedsICUTotal').value) || 0;
        avail.beds_mat_available = parseInt(document.getElementById('bedsMatAvail').value) || 0;
        cap.maternity = parseInt(document.getElementById('bedsMatTotal').value) || 0;

        avail.beds_available_now = avail.beds_male_available + avail.beds_female_available + avail.beds_ped_available + avail.beds_icu_available + avail.beds_mat_available;
        cap.total = cap.male + cap.female + cap.pediatric + cap.icu + cap.maternity;

        srv.emergency = document.getElementById('srvER').checked;
        srv.surgery = document.getElementById('srvSurgery').checked;
        srv.lab = document.getElementById('srvLab').checked;
        srv.pharmacy = document.getElementById('srvPharm').checked;
        srv.blood_bank = document.getElementById('srvBlood').checked;

        // Specialized Services
        srv.eye_care = document.getElementById('srvEye').checked;
        srv.ent = document.getElementById('srvENT').checked;
        srv.dental = document.getElementById('srvDental').checked;
        srv.orthopedics = document.getElementById('srvOrtho').checked;
        srv.cardiology = document.getElementById('srvCardio').checked;
        srv.dialysis = document.getElementById('srvDialysis').checked;

        avail.surgeons_on_duty = document.getElementById('surgeonsInput').value;
        avail.oxygen_available = document.getElementById('oxygenInput').value;
        avail.ambulance_available = document.getElementById('ambulanceInput').value;
        currentHospital.notes = document.getElementById('notesInput').value;

        avail.last_updated_timestamp = new Date().toISOString();

        saveHospitalData();
        updateStats();
        logUpdate('Bulk Update', 'Various', 'New Status Synced');
        showToast('All changes synced successfully!', 'success');
    }

    function resetForm() {
        if (confirm('Discard your current changes?')) {
            updateForm();
            showToast('Changes discarded', 'warning');
        }
    }

    function saveHospitalData() {
        const success = window.MedFindData.saveHospital(currentHospital);
        if (success) {
            const index = hospitals.findIndex(h => h.id === currentHospital.id);
            if (index !== -1) hospitals[index] = currentHospital;
        } else {
            showToast('Failed to save data. Still saved locally.', 'warning');
        }
    }

    function logUpdate(field, oldValue, newValue) {
        const update = {
            timestamp: new Date().toISOString(),
            field, oldValue, newValue,
            updatedBy: currentUser ? currentUser.username : 'Staff',
            hospitalId: currentHospital.id,
            status: isOnline ? 'Synced' : 'Local Only'
        };
        updateHistory.unshift(update);
        if (updateHistory.length > 50) updateHistory = updateHistory.slice(0, 50);
        localStorage.setItem('update_history', JSON.stringify(updateHistory));
        renderUpdateHistory();
    }

    function loadUpdateHistory() {
        const stored = localStorage.getItem('update_history');
        if (stored) {
            updateHistory = JSON.parse(stored);
            renderUpdateHistory();
        }
    }

    function renderUpdateHistory() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        const hospitalHistory = currentHospital ? updateHistory.filter(u => u.hospitalId === currentHospital.id) : updateHistory;

        if (hospitalHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No history yet</td></tr>';
            return;
        }

        tbody.innerHTML = hospitalHistory.slice(0, 20).map(update => {
            const date = new Date(update.timestamp).toLocaleString('en-GB');
            return `
            <tr>
                <td>${date}</td>
                <td>${update.field}</td>
                <td>${update.oldValue || '-'}</td>
                <td><strong>${update.newValue}</strong></td>
                <td>${update.updatedBy}</td>
                <td><span class="status-badge ${update.status === 'Synced' ? 'badge-success' : 'badge-pending'}">${update.status}</span></td>
            </tr>`;
        }).join('');
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toastMessage');
        if (!toast || !msgEl) return;
        msgEl.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Exports
    window.handleLogin = handleLogin;
    window.logout = logout;
    window.goToApp = goToApp;
    window.quickUpdate = quickUpdate;
    window.resetForm = resetForm;
    window.downloadData = () => {
        const blob = new Blob([JSON.stringify(currentHospital, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `hospital_${currentHospital.id}.json`; a.click();
    };
    window.viewAllHospitals = () => console.table(hospitals);
    window.resetToDefault = async () => {
        if (confirm('Reset to default?')) {
            hospitals = JSON.parse(JSON.stringify(window.MedFindData.FALLBACK_DATA));
            currentHospital = hospitals.find(h => h.id === currentHospital.id);
            saveHospitalData();
            updateStats();
            updateForm();
            showToast('Data reset', 'success');
        }
    };

    // Auto-login
    window.addEventListener('load', () => {
        const session = sessionStorage.getItem('admin_session');
        if (session) {
            try {
                currentUser = JSON.parse(session);
                currentHospital = hospitals.find(h => h.id === currentUser.hospitalId);
                if (currentHospital) setTimeout(showDashboard, 100);
            } catch (e) { }
        }
    });

})();
