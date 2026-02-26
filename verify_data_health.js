const fs = require('fs');

function verifyHealth() {
    console.log("--- Checking data.js ---");
    const dataContent = fs.readFileSync('data.js', 'utf8');

    // Check if MedFindData exists
    if (dataContent.includes('const MedFindData = (function()')) {
        console.log("✅ MedFindData module found.");
    } else {
        console.log("❌ MedFindData module MISSING!");
    }

    // Check FALLBACK_DATA length
    const match = dataContent.match(/FALLBACK_DATA = (\[[\s\S]*?\]);/);
    if (match) {
        try {
            const hospitals = JSON.parse(match[1]);
            console.log(`✅ FALLBACK_DATA parsed correctly. Count: ${hospitals.length}`);
            if (hospitals.length === 0) {
                console.log("❌ FALLBACK_DATA IS EMPTY!");
            }
        } catch (e) {
            console.log("❌ FALLBACK_DATA JSON IS CORRUPTED!");
            console.log(e.message);
        }
    } else {
        console.log("❌ FALLBACK_DATA pattern not found!");
    }

    console.log("\n--- Checking app-script.js ---");
    const appContent = fs.readFileSync('app-script.js', 'utf8');

    // Check loadHospitalsData
    if (appContent.includes('hospitals = await MedFindData.init()')) {
        console.log("✅ app-script.js is calling MedFindData.init().");
    } else {
        console.log("❌ app-script.js NOT calling MedFindData.init()!");
    }

    // Check displayHospitals
    if (appContent.includes('if (hospitalsToDisplay.length === 0)')) {
        console.log("✅ displayHospitals has empty state logic.");
    }

    console.log("\n--- Checking index.html ---");
    const indexContent = fs.readFileSync('index.html', 'utf8');
    if (indexContent.includes('switchGlobalLanguage')) {
        console.log("✅ switchGlobalLanguage found in index.html.");
    }
}

verifyHealth();
