const fs = require('fs');

function updateAdminHtml() {
    const adminHtml = 'admin.html';
    if (!fs.existsSync(adminHtml)) return;
    let content = fs.readFileSync(adminHtml, 'utf8');

    // Add language selector to admin.html login screen if not present
    if (!content.includes('class="language-selector"')) {
        const langSelector = `
            <div class="language-selector" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
                <button class="lang-btn active" onclick="setAdminLanguage('en')" id="adminLangEn">EN</button>
                <button class="lang-btn" onclick="setAdminLanguage('kr')" id="adminLangKr">KR</button>
            </div>
        `;
        content = content.replace(/<div class="login-header">/, langSelector + '<div class="login-header">');
    }

    // Add data-translate attributes
    content = content.replace(/<h2>Hospital Admin Portal<\/h2>/, '<h2 data-translate="admin_subtitle">Hospital Admin Portal</h2>');
    content = content.replace(/<label for="username">Username<\/label>/, '<label for="username" data-translate="username">Username</label>');
    content = content.replace(/<label for="password">Password<\/label>/, '<label for="password" data-translate="password">Password</label>');
    content = content.replace(/<label for="hospitalSelect">Hospital<\/label>/, '<label for="hospitalSelect" data-translate="hospital_select_label">Hospital</label>');
    content = content.replace(/<option value="">Select your hospital\.\.\.<\/option>/, '<option value="" data-translate="select_hospital_placeholder">Select your hospital...</option>');
    content = content.replace(/<button type="submit" class="login-btn">Login<\/button>/, '<button type="submit" class="login-btn" data-translate="login_btn">Login</button>');
    content = content.replace(/<p>Need help\? Contact:/, '<p><span data-translate="need_help">Need help? Contact:</span>');
    content = content.replace(/🔓 Demo Mode: Use any username\/password to login/, '<span data-translate="demo_note">🔓 Demo Mode: Use any username/password to login</span>');

    // Dashboard Header
    content = content.replace(/<button class="btn-secondary" onclick="goToApp\(\)">View Patient App<\/button>/, '<button class="btn-secondary" onclick="goToApp()" data-translate="view_patient_app">View Patient App</button>');
    content = content.replace(/<button class="btn-danger" onclick="logout\(\)">Logout<\/button>/, '<button class="btn-danger" onclick="logout()" data-translate="logout">Logout</button>');

    // Dashboard Stats
    content = content.replace(/<div class="stat-label">Beds Available<\/div>/g, '<div class="stat-label" data-translate="beds_available">Beds Available</div>');
    content = content.replace(/<div class="stat-label">Oxygen Status<\/div>/, '<div class="stat-label" data-translate="oxygen_status">Oxygen Status</div>');
    content = content.replace(/<div class="stat-label">Surgeons on Duty<\/div>/, '<div class="stat-label" data-translate="surgeons_on_duty">Surgeons on Duty</div>');
    content = content.replace(/<div class="stat-label">Ambulance<\/div>/, '<div class="stat-label" data-translate="ambulance">Ambulance</div>');

    // Quick Updates
    content = content.replace(/<h2 class="panel-title">⚡ Quick Updates<\/h2>/, '<h2 class="panel-title" data-translate="quick_updates_title">⚡ Quick Updates</h2>');
    content = content.replace(/<span class="btn-text">Beds Full<\/span>/, '<span class="btn-text" data-translate="beds_full">Beds Full</span>');
    content = content.replace(/<span class="btn-text">No Oxygen<\/span>/, '<span class="btn-text" data-translate="no_oxygen">No Oxygen</span>');
    content = content.replace(/<span class="btn-text">Oxygen OK<\/span>/, '<span class="btn-text" data-translate="oxygen_ok">Oxygen OK</span>');
    content = content.replace(/<span class="btn-text">Surgeon Available<\/span>/, '<span class="btn-text" data-translate="surgeon_available">Surgeon Available</span>');
    content = content.replace(/<span class="btn-text">Surgeon On-Call<\/span>/, '<span class="btn-text" data-translate="surgeon_oncall">Surgeon On-Call</span>');
    content = content.replace(/<span class="btn-text">Ambulance Out<\/span>/, '<span class="btn-text" data-translate="ambulance_out">Ambulance Out</span>');
    content = content.replace(/<span class="btn-text">Ambulance Ready<\/span>/, '<span class="btn-text" data-translate="ambulance_ready">Ambulance Ready</span>');

    // Detailed Update
    content = content.replace(/<h2 class="panel-title">📝 Detailed Availability Update<\/h2>/, '<h2 class="panel-title" data-translate="detailed_update_title">📝 Detailed Availability Update</h2>');
    content = content.replace(/<label for="bedsInput">🛏️ Beds Available Now<\/label>/, '<label for="bedsInput" data-translate="beds_input_label">🛏️ Beds Available Now</label>');
    content = content.replace(/<label for="oxygenInput">💨 Oxygen Availability<\/label>/, '<label for="oxygenInput" data-translate="oxygen_input_label">💨 Oxygen Availability</label>');
    content = content.replace(/<label for="surgeonsInput">👨‍⚕️ Surgeons on Duty<\/label>/, '<label for="surgeonsInput" data-translate="surgeons_input_label">👨‍⚕️ Surgeons on Duty</label>');
    content = content.replace(/<label for="theatreInput">🏥 Operating Theatre Status<\/label>/, '<label for="theatreInput" data-translate="theatre_input_label">🏥 Operating Theatre Status</label>');
    content = content.replace(/<label for="ambulanceInput">🚑 Ambulance Availability<\/label>/, '<label for="ambulanceInput" data-translate="ambulance_input_label">🚑 Ambulance Availability</label>');
    content = content.replace(/<label for="notesInput">📝 Additional Notes \(Optional\)<\/label>/, '<label for="notesInput" data-translate="notes_input_label">📝 Additional Notes (Optional)</label>');
    content = content.replace(/<button type="submit" class="btn-primary">💾 Save All Changes<\/button>/, '<button type="submit" class="btn-primary" data-translate="save_changes_btn">💾 Save All Changes</button>');

    fs.writeFileSync(adminHtml, content, 'utf8');
    console.log('✅ admin.html updated');
}

updateAdminHtml();
