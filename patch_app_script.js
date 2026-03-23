const fs = require('fs');

function fixAppScript() {
    let content = fs.readFileSync('app-script.js', 'utf8');

    // Fix loadHospitalsData
    const oldLoad = `    // Load Hospital Data
    async function loadHospitalsData() {
        try {
            console.log('🔄 Loading hospital data via MedFindData...');
            hospitals = await MedFindData.init();
            currentHospitals = [...hospitals];
            console.log(\`✅ Loaded \${hospitals.length} hospitals via MedFindData\`);
        } catch (error) {
            console.error('❌ Data load failed:', error);
            hospitals = [];
            currentHospitals = [];
            // Allow the UI to show "No Data" message
        }
    }`;

    const newLoad = `    // Load Hospital Data
    async function loadHospitalsData() {
        try {
            console.log('🔄 Loading hospital data via MedFindData...');
            const data = await MedFindData.init();
            if (data && Array.isArray(data) && data.length > 0) {
                hospitals = data;
            } else {
                console.warn('⚠️ MedFindData.init() empty, using getAllHospitals()...');
                hospitals = MedFindData.getAllHospitals();
            }
            currentHospitals = [...hospitals];
            console.log(\`✅ Data ready: \${hospitals.length} hospitals\`);
        } catch (error) {
            console.error('❌ Data load failed:', error);
            hospitals = MedFindData.getAllHospitals() || [];
            currentHospitals = [...hospitals];
        }
    }`;

    if (content.includes('async function loadHospitalsData()')) {
        // We might need a more flexible match if whitespace differs
        // Let's just find the function start and end
        const startIdx = content.indexOf('async function loadHospitalsData()');
        const endIdx = content.indexOf('}', startIdx + 30) + 1;
        // Wait, there might be nested braces. Better match with a known landmark.
        // Actually, let's use the exact string I saw in view_file.
    }

    // Safer replacement using a unique enough substring
    content = content.replace(/async function loadHospitalsData\(\) \{[\s\S]*?\n    \}/, newLoad);
    content = content.replace(/function applyFilters\(\) \{[\s\S]*?let filtered = \[\.\.\.hospitals\];/, `function applyFilters() {
        if (!hospitals || hospitals.length === 0) {
            hospitals = MedFindData.getAllHospitals() || [];
        }
        let filtered = [...hospitals];`);

    fs.writeFileSync('app-script.js', content, 'utf8');
    console.log("Successfully patched app-script.js");
}

fixAppScript();
