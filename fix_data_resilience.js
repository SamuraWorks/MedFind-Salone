const fs = require('fs');

function fixDataResilience() {
    const dataPath = 'data.js';
    if (!fs.existsSync(dataPath)) return;

    let content = fs.readFileSync(dataPath, 'utf8');

    // We want to update the init function to be more aggressive about loading data
    const newInitLogic = `
        init: async function() {
            const stored = localStorage.getItem('medfind_hospitals');
            if (stored) {
                try {
                    hospitals = JSON.parse(stored);
                    // Force refresh if empty or significantly stale
                    if (!hospitals || hospitals.length === 0 || !hospitals[0].notes || hospitals[0].notes.includes('Government Hospital – Provides healthcare')) {
                        console.log("Data stale or empty, refreshing from fallback...");
                        hospitals = JSON.parse(JSON.stringify(FALLBACK_DATA));
                        localStorage.setItem('medfind_hospitals', JSON.stringify(hospitals));
                    }
                } catch (e) {
                    console.error("Failed to parse stored hospitals", e);
                    hospitals = JSON.parse(JSON.stringify(FALLBACK_DATA));
                }
            } else {
                hospitals = JSON.parse(JSON.stringify(FALLBACK_DATA));
                localStorage.setItem('medfind_hospitals', JSON.stringify(hospitals));
            }
            return hospitals;
        },
    `;

    // Replace the old init function
    const initStart = content.indexOf('init: async function() {');
    const initEnd = content.indexOf('},', initStart) + 2;

    if (initStart !== -1) {
        content = content.substring(0, initStart) + newInitLogic.trim() + content.substring(initEnd);
    }

    fs.writeFileSync(dataPath, content, 'utf8');
    console.log("Successfully fixed data.js resilience logic");
}

fixDataResilience();
