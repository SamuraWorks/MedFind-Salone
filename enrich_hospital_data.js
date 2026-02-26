const fs = require('fs');

const hospitalUpdates = {
    "hosp_001": {
        facility_type: "Government Tertiary Referral Hospital",
        notes: "National referral hospital. Sierra Leone’s principal adult referral hospital providing advanced medical, surgical, emergency, and specialist services. Serves as the main teaching hospital for complex cases nationwide."
    },
    "hosp_004": {
        facility_type: "Government Specialist (Maternity)",
        notes: "National referral hospital dedicated to maternal and obstetric care, including high-risk pregnancies, emergency obstetrics, neonatal services, and gynecological surgery."
    },
    "hosp_005": {
        facility_type: "Government Specialist (Pediatrics)",
        notes: "National pediatric referral hospital providing comprehensive child healthcare, neonatal care, pediatric surgery, and emergency services for infants and children."
    },
    "hosp_006": {
        facility_type: "Military / Public Access",
        notes: "Military medical facility offering emergency care, general medicine, surgery, and specialist services to military personnel and civilians."
    },
    "hosp_016": {
        facility_type: "Regional Referral Hospital",
        notes: "Primary referral hospital for the Northern Province offering emergency services, surgery, maternity care, pediatrics, and internal medicine."
    },
    "hosp_014": {
        facility_type: "Regional Referral Hospital",
        notes: "Major referral hospital in the Southern Province providing specialist services, surgery, maternity, pediatrics, emergency care, and inpatient treatment."
    },
    "hosp_015": {
        facility_type: "Regional Referral Hospital",
        notes: "Regional referral center providing advanced medical care, surgery, maternity services, pediatrics, and emergency response."
    },
    "hosp_002": {
        facility_type: "Private Multispecialty Hospital",
        notes: "Premium private hospital offering advanced diagnostic imaging, specialist consultations, surgical procedures, and 24-hour emergency care."
    }
    // Add logic for others in script...
};

const mapDescriptions = {
    "Lumley Government Hospital": {
        type: "Government Secondary Hospital",
        desc: "Provides general medical services, emergency care, maternity, surgical services, and outpatient treatment to residents in the western coastal region."
    },
    "Jui Government Hospital": {
        type: "Government Secondary Hospital",
        desc: "Regional government hospital delivering general medicine, maternity, surgical, and emergency services to surrounding communities."
    },
    "Aberdeen Women’s Centre": {
        type: "Private Specialist (Women’s Health)",
        desc: "Specialized women’s healthcare center providing obstetric care, gynecology, fistula repair, reproductive health services, and maternity care."
    },
    "Kabala Government Hospital": {
        type: "Government District Hospital",
        desc: "Provides general medical treatment, emergency care, maternity services, and basic surgical procedures for the district population."
    },
    "Magburaka Government Hospital": {
        type: "Government District Hospital",
        desc: "District hospital delivering outpatient services, emergency care, maternity services, and routine surgical procedures."
    },
    "Kambia Government Hospital": {
        type: "Government District Hospital",
        desc: "Provides essential medical care including emergency services, maternity, pediatrics, and minor surgical procedures."
    },
    "Port Loko Government Hospital": {
        type: "Government District Hospital",
        desc: "Offers general medical treatment, emergency response, maternity services, and inpatient care to the Port Loko district."
    },
    "Pujehun Government Hospital": {
        type: "Government District Hospital",
        desc: "Delivers emergency, maternity, pediatric, and general medical services to district residents."
    },
    "Moyamba Government Hospital": {
        type: "Government District Hospital",
        desc: "Provides outpatient services, maternity care, inpatient treatment, and emergency services."
    },
    "Bonthe Government Hospital": {
        type: "Government District Hospital",
        desc: "Offers primary and secondary healthcare services including maternity, inpatient, and emergency treatment."
    },
    "Koidu Government Hospital": {
        type: "Government District Hospital",
        desc: "District hospital offering emergency care, maternity services, inpatient treatment, and general medical services."
    },
    "Segbwema Government Hospital": {
        type: "Government District Hospital",
        desc: "Provides general medical treatment, maternity care, outpatient services, and emergency healthcare."
    }
};

function updateData() {
    const dataPath = 'data.js';
    let content = fs.readFileSync(dataPath, 'utf8');

    // Extract the json array from the module
    const startIdx = content.indexOf('FALLBACK_DATA = ') + 'FALLBACK_DATA = '.length;
    const endIdx = content.indexOf(';', startIdx);
    const hospitals = JSON.parse(content.substring(startIdx, endIdx));

    hospitals.forEach(h => {
        // Update IDs we know
        if (hospitalUpdates[h.id]) {
            h.facility_type = hospitalUpdates[h.id].facility_type;
            h.notes = hospitalUpdates[h.id].notes;
        }

        // Update by name for district/regional hospitals
        if (mapDescriptions[h.hospital_name]) {
            h.facility_type = mapDescriptions[h.hospital_name].type;
            h.notes = mapDescriptions[h.hospital_name].desc;
        }
    });

    // Write back to data.js preserving the wrapper
    const newContent = content.substring(0, startIdx) + JSON.stringify(hospitals, null, 4) + content.substring(endIdx);
    fs.writeFileSync(dataPath, newContent, 'utf8');
    console.log("Updated data.js with rich hospital descriptions");
}

updateData();
