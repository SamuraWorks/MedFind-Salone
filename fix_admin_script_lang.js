const fs = require('fs');

function updateAdminScript() {
    const adminScript = 'admin-script.js';
    if (!fs.existsSync(adminScript)) return;
    let content = fs.readFileSync(adminScript, 'utf8');

    const adminTranslations = `
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
`;

    if (!content.includes('const adminTranslations =')) {
        content = content.replace(/let hospitals = \[\];/, adminTranslations + '\n    let hospitals = [];');
    }

    // Add call to setAdminLanguage in initAdmin
    if (!content.includes('setAdminLanguage(localStorage.getItem(\'admin_lang_pref\') || \'en\');')) {
        content = content.replace(/await loadHospitalData\(\);/, 'await loadHospitalData();\n        setAdminLanguage(localStorage.getItem(\'admin_lang_pref\') || \'en\');');
    }

    fs.writeFileSync(adminScript, content, 'utf8');
    console.log('✅ admin-script.js updated');
}

updateAdminScript();
