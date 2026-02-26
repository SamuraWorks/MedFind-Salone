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
            beds_full: "Beds Full",
            no_oxygen: "No Oxygen",
            oxygen_ok: "Oxygen OK",
            surgeon_available: "Surgeon Available",
            surgeon_oncall: "Surgeon On-Call",
            ambulance_out: "Ambulance Out",
            ambulance_ready: "Ambulance Ready",
            detailed_update_title: "📝 Detailed Availability Update",
            beds_input_label: "🛏️ Beds Available Now",
            oxygen_input_label: "💨 Oxygen Availability",
            surgeons_input_label: "👨‍⚕️ Surgeons on Duty",
            theatre_input_label: "🏥 Operating Theatre Status",
            ambulance_input_label: "🚑 Ambulance Availability",
            notes_input_label: "📝 Additional Notes (Optional)",
            save_changes_btn: "💾 Save All Changes",
            reset_btn: "Reset"
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
            beds_full: "Bed Dɛn Dɔn Ful",
            no_oxygen: "Oxygen Nɔ De",
            oxygen_ok: "Oxygen BƐTƐ",
            surgeon_available: "Dɔkta De",
            surgeon_oncall: "Dɔkta De Na Fɔn",
            ambulance_out: "Ambulans Nɔ De",
            ambulance_ready: "Ambulans De Ready",
            detailed_update_title: "📝 Bɛtɛ BɛtƐ Abdeʈ",
            beds_input_label: "🛏️ Bed Dɛn We De Naw",
            oxygen_input_label: "💨 Oxygen Wetin De",
            surgeons_input_label: "👨‍⚕️ Dɔkta Dɛn De",
            theatre_input_label: "🏥 Wok Rum Status",
            ambulance_input_label: "🚑 Ambulans Wetin De",
            notes_input_label: "📝 Oda Tin Dɛn (If I De)",
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

        // CHECK IF RUNNING IN IFRAME (SPA MODE)
        if (window.self !== window.top) {
            console.log('🔐 Running in SPA Mode (Iframe)');
            // Hide Login Header if needed, or adjust padding
            // The Admin Portal uses a different layout, let's just ensure it fits.
            const header = document.querySelector('.login-header');
            // We might want to keep the login header (MedFind Salone) on the login screen?
            // Actually, the main SPA header says 'Admin Portal'. 
            // Let's keep it for context unless it looks redundant.
            // It's fine to leave it for now, as Admin Portal is a distinct "Place".
        }

        // Load hospital data
        await loadHospitalData();
        setAdminLanguage(localStorage.getItem('admin_lang_pref') || 'en');

        // Populate hospital dropdown
        populateHospitalSelect();

        // Setup login form
        setupLoginForm();

        // Load update history
        loadUpdateHistory();

        console.log('✅ Admin Portal Ready');
    }

    // Initialize on load or immediately if already loaded (SPA Support)
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
            console.log('🔄 Loading hospital data via window.MedFindData...');
            hospitals = await window.MedFindData.init();

            if (!hospitals || hospitals.length === 0) {
                console.warn('⚠️ No data returned from window.MedFindData. Attempting emergency fallback...');
                hospitals = [
                    { id: "hosp_001", hospital_name: "Connaught Hospital (Fallback)", district: "Western Area", facility_type: "Government" },
                    { id: "hosp_002", hospital_name: "PCMH (Fallback)", district: "Western Area", facility_type: "Government" }
                ];
                showToast('Loaded emergency fallback data.', 'warning');
            } else {
                console.log(`✅ Loaded ${hospitals.length} hospitals via window.MedFindData`);
            }
        } catch (error) {
            console.error('❌ Data load failed:', error);
            showToast('Failed to load data.', 'error');
        }
    }

    function populateHospitalSelect() {
        console.log('🏗️ Populating hospital dropdown...');
        const select = document.getElementById('hospitalSelect');

        if (!select) {
            console.error('❌ Could not find hospitalSelect element');
            return;
        }

        // Clear existing options except the first one (placeholder)
        while (select.options.length > 1) {
            select.remove(1);
        }

        if (!hospitals || hospitals.length === 0) {
            const option = document.createElement('option');
            option.textContent = "No data available";
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        // Sort hospitals by name
        const sortedHospitals = [...hospitals].sort((a, b) =>
            a.hospital_name.localeCompare(b.hospital_name)
        );

        sortedHospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.id;
            option.textContent = `${hospital.hospital_name} - ${hospital.district}`;
            select.appendChild(option);
        });
    }

    // ============================================
    // LOGIN SYSTEM
    // ============================================

    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', handleLogin);
    }

    function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const hospitalId = document.getElementById('hospitalSelect').value;

        if (!hospitalId) {
            showToast('Please select a hospital', 'error');
            return;
        }

        // Demo mode - accept any username/password
        currentUser = {
            username: username,
            hospitalId: hospitalId,
            loginTime: new Date().toISOString()
        };

        // Find selected hospital
        currentHospital = hospitals.find(h => h.id === hospitalId);

        if (!currentHospital) {
            showToast('Hospital not found', 'error');
            return;
        }

        // Save session
        sessionStorage.setItem('admin_session', JSON.stringify(currentUser));

        // Show dashboard
        showDashboard();

        showToast(`Welcome, ${username}!`, 'success');
    }

    function showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';

        // Populate dashboard
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

            // Reset form
            document.getElementById('loginForm').reset();

            showToast('Logged out successfully', 'success');
        }
    }

    function goToApp() {
        if (window.showSPASection) {
            window.showSPASection('patientSection');
        } else {
            window.location.href = './index.html#patientSection';
        }
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

        const avail = currentHospital.dynamic_availability;
        const capacity = currentHospital.static_bed_capacity;

        // Update stat cards
        document.getElementById('statBeds').textContent = avail.beds_available_now;
        document.getElementById('statBedsTotal').textContent = `of ${capacity.total} total`;
        document.getElementById('statOxygen').textContent = avail.oxygen_available;
        document.getElementById('statSurgeons').textContent = avail.surgeons_on_duty;
        document.getElementById('statAmbulance').textContent = avail.ambulance_available === 'Yes' ? 'Available' : 'Unavailable';

        // Update card colors based on status
        updateCardColors();
    }

    function updateCardColors() {
        if (!currentHospital) return;

        const avail = currentHospital.dynamic_availability;

        // Oxygen card
        const oxygenCard = document.getElementById('oxygenCard');
        oxygenCard.className = 'stat-card';
        if (avail.oxygen_available === 'Yes') {
            oxygenCard.classList.add('stat-success');
        } else if (avail.oxygen_available === 'Limited') {
            oxygenCard.classList.add('stat-warning');
        } else {
            oxygenCard.classList.add('stat-danger');
        }

        // Surgeon card
        const surgeonCard = document.getElementById('surgeonCard');
        surgeonCard.className = 'stat-card';
        if (avail.surgeons_on_duty === 'Yes') {
            surgeonCard.classList.add('stat-success');
        } else if (avail.surgeons_on_duty === 'On Call') {
            surgeonCard.classList.add('stat-warning');
        } else {
            surgeonCard.classList.add('stat-danger');
        }

        // Ambulance card
        const ambulanceCard = document.getElementById('ambulanceCard');
        ambulanceCard.className = 'stat-card';
        if (avail.ambulance_available === 'Yes') {
            ambulanceCard.classList.add('stat-success');
        } else {
            ambulanceCard.classList.add('stat-danger');
        }
    }

    function updateForm() {
        if (!currentHospital) return;

        const avail = currentHospital.dynamic_availability;
        const capacity = currentHospital.static_bed_capacity;

        // Populate form with current values
        document.getElementById('bedsInput').value = avail.beds_available_now;
        document.getElementById('bedCapacity').textContent = `Total capacity: ${capacity.total} beds`;
        document.getElementById('oxygenInput').value = avail.oxygen_available;
        document.getElementById('surgeonsInput').value = avail.surgeons_on_duty;
        document.getElementById('theatreInput').value = avail.operating_theatre_status;
        document.getElementById('ambulanceInput').value = avail.ambulance_available;
    }

    // ============================================
    // QUICK UPDATES
    // ============================================

    function quickUpdate(action) {
        if (!currentHospital) return;

        const avail = currentHospital.dynamic_availability;
        const oldValue = { ...avail };

        switch (action) {
            case 'beds_full':
                avail.beds_available_now = 0;
                logUpdate('Beds Available', oldValue.beds_available_now, 0);
                break;

            case 'beds_available':
                // Restore to half capacity
                const halfCapacity = Math.floor(currentHospital.static_bed_capacity.total / 2);
                avail.beds_available_now = halfCapacity;
                logUpdate('Beds Available', oldValue.beds_available_now, halfCapacity);
                break;

            case 'no_oxygen':
                avail.oxygen_available = 'No';
                logUpdate('Oxygen Available', oldValue.oxygen_available, 'No');
                break;

            case 'oxygen_ok':
                avail.oxygen_available = 'Yes';
                logUpdate('Oxygen Available', oldValue.oxygen_available, 'Yes');
                break;

            case 'surgeon_available':
                avail.surgeons_on_duty = 'Yes';
                logUpdate('Surgeons on Duty', oldValue.surgeons_on_duty, 'Yes');
                break;

            case 'surgeon_oncall':
                avail.surgeons_on_duty = 'On Call';
                logUpdate('Surgeons on Duty', oldValue.surgeons_on_duty, 'On Call');
                break;

            case 'ambulance_out':
                avail.ambulance_available = 'No';
                logUpdate('Ambulance Available', oldValue.ambulance_available, 'No');
                break;

            case 'ambulance_ready':
                avail.ambulance_available = 'Yes';
                logUpdate('Ambulance Available', oldValue.ambulance_available, 'Yes');
                break;
        }

        // Update timestamp
        avail.last_updated_timestamp = new Date().toISOString();

        // Save changes
        saveHospitalData();

        // Update UI
        updateStats();
        updateForm();

        showToast('Update saved successfully!', 'success');
    }

    // ============================================
    // FULL FORM UPDATE
    // ============================================

    document.getElementById('updateForm').addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();

        if (!currentHospital) return;

        const avail = currentHospital.dynamic_availability;
        const oldValues = { ...avail };

        // Get form values
        const newBeds = parseInt(document.getElementById('bedsInput').value);
        const newOxygen = document.getElementById('oxygenInput').value;
        const newSurgeons = document.getElementById('surgeonsInput').value;
        const newTheatre = document.getElementById('theatreInput').value;
        const newAmbulance = document.getElementById('ambulanceInput').value;
        const notes = document.getElementById('notesInput').value;

        // Track changes
        if (oldValues.beds_available_now !== newBeds) {
            logUpdate('Beds Available', oldValues.beds_available_now, newBeds);
        }
        if (oldValues.oxygen_available !== newOxygen) {
            logUpdate('Oxygen Available', oldValues.oxygen_available, newOxygen);
        }
        if (oldValues.surgeons_on_duty !== newSurgeons) {
            logUpdate('Surgeons on Duty', oldValues.surgeons_on_duty, newSurgeons);
        }
        if (oldValues.operating_theatre_status !== newTheatre) {
            logUpdate('Operating Theatre Status', oldValues.operating_theatre_status, newTheatre);
        }
        if (oldValues.ambulance_available !== newAmbulance) {
            logUpdate('Ambulance Available', oldValues.ambulance_available, newAmbulance);
        }

        // Update values
        avail.beds_available_now = newBeds;
        avail.oxygen_available = newOxygen;
        avail.surgeons_on_duty = newSurgeons;
        avail.operating_theatre_status = newTheatre;
        avail.ambulance_available = newAmbulance;
        avail.last_updated_timestamp = new Date().toISOString();

        // Update notes if provided
        if (notes.trim()) {
            currentHospital.notes = notes;
            logUpdate('Notes', '', notes);
        }

        // Save changes
        saveHospitalData();

        // Update UI
        updateStats();

        showToast('All changes saved successfully!', 'success');
    }

    function resetForm() {
        if (confirm('Reset form to current hospital values?')) {
            updateForm();
            document.getElementById('notesInput').value = '';
            showToast('Form reset', 'warning');
        }
    }

    // ============================================
    // DATA PERSISTENCE
    // ============================================

    function saveHospitalData() {
        // Save via Shared Module
        const success = window.MedFindData.saveHospital(currentHospital);

        if (success) {
            console.log('✅ Hospital data saved to persistent storage');
            // Update local array reference just in case
            const index = hospitals.findIndex(h => h.id === currentHospital.id);
            if (index !== -1) hospitals[index] = currentHospital;
        } else {
            console.error('❌ Failed to save hospital data');
            showToast('Failed to save data', 'error');
        }
    }

    // ============================================
    // UPDATE HISTORY
    // ============================================

    function logUpdate(field, oldValue, newValue) {
        const update = {
            timestamp: new Date().toISOString(),
            field: field,
            oldValue: oldValue,
            newValue: newValue,
            updatedBy: currentUser ? currentUser.username : 'Unknown',
            hospitalId: currentHospital.id,
            status: 'Synced'
        };

        updateHistory.unshift(update);

        // Keep only last 50 updates
        if (updateHistory.length > 50) {
            updateHistory = updateHistory.slice(0, 50);
        }

        // Save to localStorage
        localStorage.setItem('update_history', JSON.stringify(updateHistory));

        // Update UI
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

        // Filter history for current hospital
        const hospitalHistory = currentHospital
            ? updateHistory.filter(u => u.hospitalId === currentHospital.id)
            : updateHistory;

        if (hospitalHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No update history yet</td></tr>';
            return;
        }

        tbody.innerHTML = hospitalHistory.slice(0, 20).map(update => {
            const date = new Date(update.timestamp);
            const formattedDate = date.toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
            <tr>
                <td>${formattedDate}</td>
                <td>${update.field}</td>
                <td>${update.oldValue || '-'}</td>
                <td><strong>${update.newValue}</strong></td>
                <td>${update.updatedBy}</td>
                <td><span class="status-badge badge-success">${update.status}</span></td>
            </tr>
        `;
        }).join('');
    }

    // ============================================
    // DATA MANAGEMENT
    // ============================================

    function downloadData() {
        if (!currentHospital) {
            showToast('No hospital selected', 'error');
            return;
        }

        const dataStr = JSON.stringify(currentHospital, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentHospital.id}_data_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        showToast('Data downloaded successfully', 'success');
    }

    function viewAllHospitals() {
        const summary = hospitals.map(h => ({
            name: h.hospital_name,
            district: h.district,
            beds_available: h.dynamic_availability.beds_available_now,
            oxygen: h.dynamic_availability.oxygen_available,
            last_updated: h.dynamic_availability.last_updated_timestamp
        }));

        console.table(summary);
        alert(`Viewing ${hospitals.length} hospitals in console. Press F12 to see details.`);
    }

    async function resetToDefault() {
        if (!confirm('⚠️ This will reset all hospital data to default values. Are you sure?')) {
            return;
        }

        if (!confirm('This action cannot be undone. Continue?')) {
            return;
        }

        try {
            // Reset to FALLBACK_DATA via window.MedFindData
            const data = JSON.parse(JSON.stringify(window.MedFindData.FALLBACK_DATA));
            hospitals = data;

            // Update current hospital reference
            currentHospital = hospitals.find(h => h.id === currentHospital.id);

            // Save
            saveHospitalData();

            // Update UI
            updateStats();
            updateForm();

            // Clear history
            updateHistory = [];
            localStorage.removeItem('update_history');
            renderUpdateHistory();

            showToast('Data reset to default successfully', 'success');
        } catch (error) {
            showToast('Failed to reset data', 'error');
        }
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // AUTO-LOGIN (Development)
    // ============================================

    // Check for existing session
    window.addEventListener('load', () => {
        const session = sessionStorage.getItem('admin_session');
        if (session) {
            try {
                currentUser = JSON.parse(session);
                currentHospital = hospitals.find(h => h.id === currentUser.hospitalId);
                if (currentHospital) {
                    setTimeout(() => {
                        showDashboard();
                    }, 500);
                }
            } catch (error) {
                console.error('Failed to restore session', error);
            }
        }
    });

    console.log('✅ Admin Script Loaded');

    // ============================================
    // GLOBAL SCOPE EXPORTS
    // ============================================
    window.handleLogin = handleLogin;
    window.logout = logout;
    window.goToApp = goToApp;
    window.quickUpdate = quickUpdate;
    window.toggleUpdateForm = toggleUpdateForm;
    window.saveFullUpdate = saveFullUpdate;
    window.downloadData = downloadData;
    window.resetToDefault = resetToDefault;

})();
