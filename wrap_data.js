const fs = require('fs');

function wrapData() {
    const dataPath = 'data.js';
    if (!fs.existsSync(dataPath)) return;

    let content = fs.readFileSync(dataPath, 'utf8');

    // Find the start and end of the array
    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']') + 1;

    if (startIdx === -1 || endIdx === 0) {
        console.error("Could not find hospital array in data.js");
        return;
    }

    const arrayStr = content.substring(startIdx, endIdx);

    const wrapper = `const MedFindData = (function() {
    const FALLBACK_DATA = ${arrayStr};

    let hospitals = [];

    return {
        init: async function() {
            const stored = localStorage.getItem('medfind_hospitals');
            if (stored) {
                try {
                    hospitals = JSON.parse(stored);
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

        getAllHospitals: function() {
            return hospitals.length > 0 ? hospitals : JSON.parse(JSON.stringify(FALLBACK_DATA));
        },

        saveHospital: function(hospital) {
            const index = hospitals.findIndex(h => h.id === hospital.id);
            if (index !== -1) {
                hospitals[index] = hospital;
                localStorage.setItem('medfind_hospitals', JSON.stringify(hospitals));
                return true;
            }
            return false;
        },

        FALLBACK_DATA: FALLBACK_DATA
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedFindData;
}
`;

    fs.writeFileSync(dataPath, wrapper, 'utf8');
    console.log("Successfully wrapped data.js in MedFindData module");
}

wrapData();
