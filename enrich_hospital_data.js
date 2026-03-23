const fs = require('fs');
const path = require('path');

const dataPath = 'c:/Users/USER/Downloads/MedFind-Salone-main/MedFind-Salone-main/data.js';
let content = fs.readFileSync(dataPath, 'utf8');

// Extract the array from FALLBACK_DATA
const arrayTag = 'FALLBACK_DATA = [';
const startIdx = content.indexOf(arrayTag);
if (startIdx === -1) {
    console.error('Could not find FALLBACK_DATA in data.js');
    process.exit(1);
}

const startIndex = startIdx + arrayTag.length - 1; // Points to '['
let bracketCount = 0;
let endIndex = -1;

for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    else if (content[i] === ']') bracketCount--;
    
    if (bracketCount === 0) {
        endIndex = i;
        break;
    }
}

if (endIndex === -1) {
    console.error('Could not find end of FALLBACK_DATA array');
    process.exit(1);
}

const arrayStr = content.substring(startIndex, endIndex + 1);
let hospitals = JSON.parse(arrayStr);

const emergencyTypes = ['trauma', 'pregnancy', 'asthma', 'heart_attack', 'poisoning', 'child', 'surgery'];

hospitals = hospitals.map(h => {
    // 1. Detailed Beds
    h.beds_detailed = {
        adult: { total: h.static_bed_capacity?.adult || 50, available: Math.floor(Math.random() * 20) },
        maternity: { total: h.static_bed_capacity?.maternity || 20, available: Math.floor(Math.random() * 10) },
        pediatric: { total: h.static_bed_capacity?.pediatric || 20, available: Math.floor(Math.random() * 10) },
        icu: { total: h.static_bed_capacity?.icu || 5, available: Math.floor(Math.random() * 3) },
        observation: { total: 10, available: Math.floor(Math.random() * 5) },
        isolation: { total: 5, available: Math.floor(Math.random() * 2) }
    };

    // 2. Equipment
    h.equipment = {
        oxygen: Math.random() > 0.1 ? 'available' : 'unavailable',
        ventilators: Math.random() > 0.3 ? 'available' : 'unavailable',
        nebulizers: Math.random() > 0.2 ? 'available' : 'unavailable',
        blood_bank: h.key_services?.blood_bank ? 'available' : 'limited',
        lab_testing: 'available',
        pharmacy: 'available',
        imaging: {
            ct: h.technology_services?.imaging?.ct_scan ? 'available' : 'unavailable',
            mri: h.technology_services?.imaging?.mri ? 'available' : 'unavailable',
            x_ray: h.technology_services?.imaging?.x_ray ? 'available' : 'unavailable'
        }
    };

    // 3. Staff
    h.staff = {
        emergency_doctors: Math.random() > 0.2 ? 'on_site' : 'on_call',
        surgeons: h.key_services?.surgery ? (Math.random() > 0.5 ? 'on_site' : 'on_call') : 'unavailable',
        obstetricians: h.key_services?.maternity ? 'on_site' : 'unavailable',
        pediatricians: h.key_services?.pediatrics ? 'on_site' : 'unavailable',
        cardiologists: h.key_services?.cardiology ? 'on_call' : 'unavailable',
        nurses: 'on_site'
    };

    // 4. Departments
    h.departments = {
        surgery: h.key_services?.surgery ? 'open' : 'closed',
        maternity: h.key_services?.maternity ? 'open' : 'closed',
        pediatrics: h.key_services?.pediatrics ? 'open' : 'closed',
        radiology: h.key_services?.radiology ? 'open' : 'closed',
        lab: h.key_services?.lab ? 'open' : 'closed',
        pharmacy: h.key_services?.pharmacy ? 'open' : 'closed'
    };

    // 5. Emergency Services
    h.emergency_services = {
        ambulance_available: h.dynamic_availability?.ambulance_available === 'Yes',
        er_queue_length: Math.floor(Math.random() * 15),
        trauma_center: h.notes?.toLowerCase().includes('trauma')
    };

    // 6. Suitability Scores (0.0 - 1.0)
    h.suitability = {};
    emergencyTypes.forEach(type => {
        let score = 0.5;
        if (type === 'trauma' && h.emergency_services.trauma_center) score += 0.4;
        if (type === 'pregnancy' && h.departments.maternity === 'open') score += 0.4;
        if (type === 'child' && h.departments.pediatrics === 'open') score += 0.4;
        if (type === 'surgery' && h.departments.surgery === 'open') score += 0.4;
        if (type === 'asthma' && h.equipment.oxygen === 'available') score += 0.3;
        h.suitability[type] = Math.min(score + (Math.random() * 0.1), 1.0).toFixed(2);
    });

    // 7. General
    h.reliability_score = (4 + Math.random()).toFixed(1);
    h.road_accessibility = Math.random() > 0.2 ? 'good' : 'fair';
    h.last_updated = new Date().toISOString();

    return h;
});

const newContent = content.substring(0, startIndex) + 
                   JSON.stringify(hospitals, null, 4) + 
                   content.substring(endIndex + 1);

fs.writeFileSync(dataPath, newContent);
console.log('Enriched ' + hospitals.length + ' hospitals in data.js');
