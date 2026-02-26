const fs = require('fs');

function updateIndexHtml() {
    const indexHtml = 'index.html';
    if (!fs.existsSync(indexHtml)) return;
    let content = fs.readFileSync(indexHtml, 'utf8');

    // Add data-translate attributes to index.html
    content = content.replace(/<div class="header-title">MedFind Salone<\/div>/, '<div class="header-title" data-translate="header_title">MedFind Salone</div>');
    content = content.replace(/<div class="header-subtitle">Healthcare Access for Sierra Leone<\/div>/, '<div class="header-subtitle" data-translate="header_subtitle">Healthcare Access for Sierra Leone</div>');
    content = content.replace(/🏠 Home/, '<span data-translate="nav_home">🏠 Home</span>');
    content = content.replace(/📱 Patient App/, '<span data-translate="nav_patient">📱 Patient App</span>');
    content = content.replace(/🔐 Admin Portal/, '<span data-translate="nav_admin">🔐 Admin Portal</span>');

    content = content.replace(/<h1>Welcome to MedFind Salone<\/h1>/, '<h1 data-translate="hero_title">Welcome to MedFind Salone</h1>');
    content = content.replace(/<p class="subtitle">Your Complete Healthcare Access Platform for Sierra Leone<\/p>/, '<p class="subtitle" data-translate="hero_subtitle">Your Complete Healthcare Access Platform for Sierra Leone</p>');
    content = content.replace(/<p class="description">Find emergency medical services instantly, manage hospital availability data in\s+real-time, and access comprehensive healthcare information across all 16 districts<\/p>/, '<p class="description" data-translate="hero_desc">Find emergency medical services instantly, manage hospital availability data in real-time, and access comprehensive healthcare information across all 16 districts</p>');

    content = content.replace(/<h2>For Patients<\/h2>/, '<h2 data-translate="card_patient_title">For Patients</h2>');
    content = content.replace(/<p>Find hospitals, emergency services, and healthcare facilities near you<\/p>/, '<p data-translate="card_patient_desc">Find hospitals, emergency services, and healthcare facilities near you</p>');
    content = content.replace(/Open Patient App →/, '<span data-translate="launch_patient_app">Open Patient App →</span>');

    content = content.replace(/<h2>For Hospital Staff<\/h2>/, '<h2 data-translate="card_admin_title">For Hospital Staff</h2>');
    content = content.replace(/<p>Update your hospital's availability status and manage data securely<\/p>/, '<p data-translate="card_admin_desc">Update your hospital\'s availability status and manage data securely</p>');
    content = content.replace(/Open Admin Portal →/, '<span data-translate="launch_admin_app">Open Admin Portal →</span>');

    content = content.replace(/<h2>Interactive Map<\/h2>/, '<h2 data-translate="card_map_title">Interactive Map</h2>');
    content = content.replace(/Explore hospitals across Sierra Leone on our interactive map \(below\)/, '<span data-translate="card_map_desc">Explore hospitals across Sierra Leone on our interactive map (below)</span>');

    content = content.replace(/🗺️ Live Hospital Map/, '<span data-translate="map_title">🗺️ Live Hospital Map</span>');
    content = content.replace(/Explore all healthcare facilities across Sierra Leone's 16 districts/, '<span data-translate="map_subtitle">Explore all healthcare facilities across Sierra Leone\'s 16 districts</span>');

    const landingTranslations = `
        const landingTranslations = {
            en: {
                header_title: "MedFind Salone",
                header_subtitle: "Healthcare Access for Sierra Leone",
                nav_home: "🏠 Home",
                nav_patient: "📱 Patient App",
                nav_admin: "🔐 Admin Portal",
                hero_title: "Welcome to MedFind Salone",
                hero_subtitle: "Your Complete Healthcare Access Platform for Sierra Leone",
                hero_desc: "Find emergency medical services instantly, manage hospital availability data in real-time, and access comprehensive healthcare information across all 16 districts",
                card_patient_title: "For Patients",
                card_patient_desc: "Find hospitals, emergency services, and healthcare facilities near you",
                launch_patient_app: "Open Patient App →",
                card_admin_title: "For Hospital Staff",
                card_admin_desc: "Update your hospital's availability status and manage data securely",
                launch_admin_app: "Open Admin Portal →",
                card_map_title: "Interactive Map",
                card_map_desc: "Explore hospitals across Sierra Leone on our interactive map (below)",
                map_title: "🗺️ Live Hospital Map",
                map_subtitle: "Explore all healthcare facilities across Sierra Leone's 16 districts"
            },
            kr: {
                header_title: "MedFind Salone",
                header_subtitle: "Mɛdikal Hɛlp fɔ Ɔlman na Salone",
                nav_home: "🏠 Om",
                nav_patient: "📱 Peshɛnt App",
                nav_admin: "🔐 Admin Portal",
                hero_title: "Wɛlkɔm na MedFind Salone",
                hero_subtitle: "Yu BɛtƐ Ples fɔ Fɛn MƐdikal HƐlp na Salone",
                hero_desc: "FƐn hospital dƐn we de wok wantƐm wantƐm, manƐj hospital tin dƐn, ɛn sev layf - ɔl na wan ples.",
                card_patient_title: "Fɔ Peshɛnt Dɛn",
                card_patient_desc: "FƐn hospital dƐn, ɛmajɛnsi savis dƐn, ɛn ples fɔ trit yu we de klos yu",
                launch_patient_app: "Opun Peshɛnt App →",
                card_admin_title: "Fɔ Hospital Wokman Dɛn",
                card_admin_desc: "Abdeʈ yu hospital status ɛn manɛj data wit bƐtƐ sekuriti",
                launch_admin_app: "Opun Admin Portal →",
                card_map_title: "Map We De Wok",
                card_map_desc: "Luk hospital dƐn na ɔl Salone na wi map (na bɔtɔm)",
                map_title: "🗺️ Layv Hospital Map",
                map_subtitle: "Luk ɔl hospital dƐn na Salone na ɔl di 16 distrikt dɛn"
            }
        };
    `;

    // Inject translations and update switchGlobalLanguage
    if (!content.includes('const landingTranslations =')) {
        content = content.replace(/let currentSection = 'homeSection';/, landingTranslations + '\n        let currentSection = \'homeSection\';');
    }

    content = content.replace(/function switchGlobalLanguage\(lang\) \{([\s\S]*?)localStorage\.setItem\('medfind_lang_pref', lang\);/,
        `function switchGlobalLanguage(lang) {
            console.log('Switching language to:', lang);
            const trans = landingTranslations[lang];
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                if (trans[key]) el.textContent = trans[key];
            });
            localStorage.setItem('medfind_lang_pref', lang);`);

    fs.writeFileSync(indexHtml, content, 'utf8');
    console.log('✅ index.html updated');
}

updateIndexHtml();
