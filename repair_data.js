const fs = require('fs');

function repairData() {
    const content = fs.readFileSync('data.js', 'utf8');

    // Attempt to extract the array using balancing
    let startIdx = content.indexOf('FALLBACK_DATA = [') + 'FALLBACK_DATA = '.length;
    let braceCount = 1;
    let endIdx = -1;

    for (let i = startIdx + 1; i < content.length; i++) {
        if (content[i] === '[') braceCount++;
        if (content[i] === ']') braceCount--;

        if (braceCount === 0) {
            endIdx = i + 1;
            break;
        }
    }

    if (endIdx === -1) {
        console.error("COULD NOT FIND CLOSING BRACKET FOR FALLBACK_DATA");
        return;
    }

    const arrayStr = content.substring(startIdx, endIdx);
    let hospitals;
    try {
        hospitals = JSON.parse(arrayStr);
        console.log("Successfully parsed", hospitals.length, "hospitals.");
    } catch (e) {
        console.error("JSON PARSE ERROR:", e.message);
        // Fallback: try to fix common issues or just use a dummy to see if it works
        return;
    }

    // List of updates from the user
    const userUpdates = [
        { name: "Connaught Hospital", type: "Government Tertiary Referral Hospital", note: "Sierra Leone’s principal adult referral hospital providing advanced medical, surgical, emergency, and specialist services. Serves as the main teaching hospital for complex cases nationwide." },
        { name: "Princess Christian Maternity Hospital (PCMH)", type: "Government Specialist (Maternity)", note: "National referral hospital dedicated to maternal and obstetric care, including high-risk pregnancies, emergency obstetrics, neonatal services, and gynecological surgery." },
        { name: "Ola During Children's Hospital", type: "Government Specialist (Pediatrics)", note: "National pediatric referral hospital providing comprehensive child healthcare, neonatal care, pediatric surgery, and emergency services for infants and children." },
        { name: "34 Military Hospital", type: "Military / Public Access", note: "Military medical facility offering emergency care, general medicine, surgery, and specialist services to military personnel and civilians." },
        { name: "Lumley Government Hospital", type: "Government Secondary Hospital", note: "Provides general medical services, emergency care, maternity, surgical services, and outpatient treatment to residents in the western coastal region." },
        { name: "Jui Government Hospital", type: "Government Secondary Hospital", note: "Regional government hospital delivering general medicine, maternity, surgical, and emergency services to surrounding communities." },
        { name: "Choithram Memorial Hospital", type: "Private Multispecialty Hospital", note: "Premium private hospital offering advanced diagnostic imaging, specialist consultations, surgical procedures, and 24-hour emergency care." },
        { name: "Aberdeen Women’s Centre", type: "Private Specialist (Women’s Health)", note: "Specialized women’s healthcare center providing obstetric care, gynecology, fistula repair, reproductive health services, and maternity care." },
        { name: "Makeni Government Hospital", type: "Regional Referral Hospital", note: "Primary referral hospital for the Northern Province offering emergency services, surgery, maternity care, pediatrics, and internal medicine." },
        { name: "Kabala Government Hospital", type: "Government District Hospital", note: "Provides general medical treatment, emergency care, maternity services, and basic surgical procedures for the district population." },
        { name: "Magburaka Government Hospital", type: "Government District Hospital", note: "District hospital delivering outpatient services, emergency care, maternity services, and routine surgical procedures." },
        { name: "Kambia Government Hospital", type: "Government District Hospital", note: "Provides essential medical care including emergency services, maternity, pediatrics, and minor surgical procedures." },
        { name: "Port Loko Government Hospital", type: "Government District Hospital", note: "Offers general medical treatment, emergency response, maternity services, and inpatient care to the Port Loko district." },
        { name: "Bo Government Hospital", type: "Regional Referral Hospital", note: "Major referral hospital in the Southern Province providing specialist services, surgery, maternity, pediatrics, emergency care, and inpatient treatment." },
        { name: "Pujehun Government Hospital", type: "Government District Hospital", note: "Delivers emergency, maternity, pediatric, and general medical services to district residents." },
        { name: "Moyamba Government Hospital", type: "Government District Hospital", note: "Provides outpatient services, maternity care, inpatient treatment, and emergency services." },
        { name: "Bonthe Government Hospital", type: "Government District Hospital", note: "Offers primary and secondary healthcare services including maternity, inpatient, and emergency treatment." },
        { name: "Kenema Government Hospital", type: "Regional Referral Hospital", note: "Regional referral center providing advanced medical care, surgery, maternity services, pediatrics, and emergency response." },
        { name: "Koidu Government Hospital", type: "Government District Hospital", note: "District hospital offering emergency care, maternity services, inpatient treatment, and general medical services." },
        { name: "Segbwema Government Hospital", type: "Government District Hospital", note: "Provides general medical treatment, maternity care, outpatient services, and emergency healthcare." }
    ];

    hospitals.forEach(h => {
        const update = userUpdates.find(u => u.name.toLowerCase() === h.hospital_name.toLowerCase());
        if (update) {
            h.facility_type = update.type;
            h.notes = update.note;
        }
    });

    const finalCode = `const MedFindData = (function() {
    const FALLBACK_DATA = ${JSON.stringify(hospitals, null, 4)};

    let hospitals = [];

    return {
        init: async function() {
            console.log("MedFindData: Initializing...");
            const stored = localStorage.getItem('medfind_hospitals');
            if (stored) {
                try {
                    hospitals = JSON.parse(stored);
                    // Force refresh if stale or empty
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
                console.log("No stored data found, using fallback...");
                hospitals = JSON.parse(JSON.stringify(FALLBACK_DATA));
                localStorage.setItem('medfind_hospitals', JSON.stringify(hospitals));
            }
            console.log("MedFindData: Initialized with", hospitals.length, "hospitals.");
            return hospitals;
        },

        getAllHospitals: function() {
            return hospitals && hospitals.length > 0 ? hospitals : JSON.parse(JSON.stringify(FALLBACK_DATA));
        },

        getHospitalById: function(id) {
            const list = this.getAllHospitals();
            return list.find(h => h.id === id);
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

    fs.writeFileSync('data.js', finalCode, 'utf8');
    console.log("Successfully repaired data.js and applied rich descriptions.");
}

repairData();
