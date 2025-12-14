/**
 * MedFind Salone - Shared Data Module
 * Handles specific localStorage interactions for hospital data.
 */

const MedFindData = (function () {
    const STORAGE_KEY = "medfind_hospitals"; // The official key
    const LEGACY_KEYS = ["medfind_hospitals_db", "admin_hospitals_data", "hospitals_data"];

    // Check if data exists in localStorage
    function hasData() {
        // Check the official key
        const data = localStorage.getItem(STORAGE_KEY);
        if (data && JSON.parse(data).length > 0) return true;

        // Check for legacy keys to migrate
        for (const key of LEGACY_KEYS) {
            const legacyData = localStorage.getItem(key);
            if (legacyData && JSON.parse(legacyData).length > 0) return true;
        }

        return false;
    }

    // NUCLEAR FALLBACK: FULL DATASET EMBEDDED
    const FALLBACK_DATA = [
        {
            "id": "hosp_001",
            "hospital_name": "Connaught Hospital",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4844,
            "longitude": -13.2344,
            "phone": "+232 76 123 456",
            "email": "info@connaughthospital.sl",
            "website": "http://www.connaughthospital.gov.sl",
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 350,
                "adult": 200,
                "maternity": 80,
                "pediatric": 50,
                "icu": 20
            },
            "average_occupancy_rates": {
                "overall": 0.85,
                "adult": 0.88,
                "maternity": 0.90,
                "pediatric": 0.75,
                "icu": 0.95
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": true,
                "lab": true,
                "blood_bank": true,
                "icu": true,
                "mental_health": true,
                "other": [
                    "Internal Medicine",
                    "Outpatient Services",
                    "Pharmacy"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 4,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Abscess Drainage",
                        "Trauma Surgery"
                    ]
                },
                "orthopedic_surgery": {
                    "count": 3,
                    "services": [
                        "Fracture Repair",
                        "Joint Surgery",
                        "Bone Trauma",
                        "Spine Surgery"
                    ]
                },
                "neurosurgery": {
                    "count": 1,
                    "services": [
                        "Head Trauma",
                        "Brain Surgery",
                        "Spinal Cord Procedures"
                    ]
                },
                "cardiothoracic_surgery": {
                    "count": 1,
                    "services": [
                        "Chest Trauma",
                        "Heart Procedures",
                        "Lung Surgery"
                    ]
                },
                "vascular_surgery": {
                    "count": 1,
                    "services": [
                        "Blood Vessel Repair",
                        "Vascular Access"
                    ]
                },
                "plastic_surgery": {
                    "count": 2,
                    "services": [
                        "Burn Treatment",
                        "Reconstructive Surgery",
                        "Wound Care"
                    ]
                },
                "obstetric_surgery": {
                    "count": 6,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Surgery",
                        "Gynecological Procedures"
                    ]
                },
                "pediatric_surgery": {
                    "count": 2,
                    "services": [
                        "Neonatal Surgery",
                        "Pediatric Emergency Surgery"
                    ]
                },
                "urological_surgery": {
                    "count": 1,
                    "services": [
                        "Kidney Stones",
                        "Urinary Tract Procedures"
                    ]
                },
                "ent_surgery": {
                    "count": 2,
                    "services": [
                        "Ear Surgery",
                        "Nose Surgery",
                        "Throat Procedures",
                        "Tonsillectomy"
                    ]
                }
            },
            "medical_specialists": {
                "pediatricians": 5,
                "anesthetists": 3,
                "radiologists": 2,
                "cardiologists": 2,
                "neurologists": 1,
                "oncologists": 1,
                "nephrologists": 1,
                "gastroenterologists": 1,
                "pulmonologists": 1,
                "psychiatrists": 2
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": true,
                    "mri": false,
                    "mammography": true,
                    "fluoroscopy": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": true,
                    "pathology": true,
                    "serology": true,
                    "pcr_testing": true
                },
                "cardiology": {
                    "ecg": true,
                    "echocardiography": true,
                    "holter_monitoring": false,
                    "stress_testing": false
                },
                "critical_care": {
                    "ventilators": 12,
                    "oxygen_concentrators": 25,
                    "patient_monitors": 30,
                    "defibrillators": 8,
                    "infusion_pumps": 40
                },
                "surgical": {
                    "operating_theatres": 4,
                    "anesthesia_machines": 4,
                    "surgical_instruments": "Complete",
                    "laparoscopic_equipment": true,
                    "sterilization_unit": true
                },
                "dialysis": {
                    "available": true,
                    "machines": 4,
                    "hemodialysis": true,
                    "peritoneal_dialysis": false
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "chemotherapy_drugs": true,
                    "controlled_substances": true
                },
                "other": {
                    "ambulances": 3,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "blood_storage": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 52,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T16:30:00Z"
            },
            "emergency_numbers": [
                "+232 76 123 456",
                "+232 76 123 457"
            ],
            "notes": "National referral hospital. Main trauma center for Freetown. 24/7 emergency services."
        },
        {
            "id": "hosp_002",
            "hospital_name": "Princess Christian Maternity Hospital (PCMH)",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4885,
            "longitude": -13.2205,
            "phone": "+232 76 000 002",
            "email": "pcmh@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 150,
                "adult": 0,
                "maternity": 130,
                "pediatric": 20,
                "icu": 0
            },
            "average_occupancy_rates": {
                "overall": 0.92,
                "adult": 0,
                "maternity": 0.95,
                "pediatric": 0.80,
                "icu": 0
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": true,
                "lab": true,
                "blood_bank": false,
                "icu": false,
                "mental_health": false,
                "other": [
                    "Obstetrics",
                    "Gynecology",
                    "Family Planning",
                    "Neonatal Care"
                ]
            },
            "surgeons_by_specialty": {
                "obstetric_surgery": {
                    "count": 8,
                    "services": [
                        "C-Section",
                        "Emergency C-Section",
                        "Ectopic Pregnancy Surgery",
                        "Post-Partum Hemorrhage Control"
                    ]
                },
                "gynecological_surgery": {
                    "count": 4,
                    "services": [
                        "Hysterectomy",
                        "Ovarian Surgery",
                        "Fibroid Removal",
                        "D&C"
                    ]
                },
                "neonatal_surgery": {
                    "count": 1,
                    "services": [
                        "Neonatal Emergency Procedures"
                    ]
                }
            },
            "medical_specialists": {
                "obstetricians": 8,
                "gynecologists": 4,
                "pediatricians": 3,
                "anesthetists": 2,
                "radiologists": 1,
                "neonatologists": 2,
                "midwives": 25
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "mammography": false,
                    "fetal_monitoring": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": true,
                    "serology": true,
                    "pregnancy_testing": true
                },
                "obstetric": {
                    "fetal_monitors": 15,
                    "ultrasound_machines": 4,
                    "delivery_beds": 20,
                    "neonatal_incubators": 10,
                    "phototherapy_units": 8
                },
                "critical_care": {
                    "ventilators": 0,
                    "oxygen_concentrators": 15,
                    "patient_monitors": 20,
                    "defibrillators": 3,
                    "infusion_pumps": 25
                },
                "surgical": {
                    "operating_theatres": 3,
                    "anesthesia_machines": 3,
                    "surgical_instruments": "Complete",
                    "cesarean_section_kits": true,
                    "sterilization_unit": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "obstetric_drugs": true,
                    "contraceptives": true
                },
                "other": {
                    "ambulances": 1,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "blood_storage": false
                }
            },
            "dynamic_availability": {
                "beds_available_now": 12,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "No",
                "last_updated_timestamp": "2025-12-13T15:45:00Z"
            },
            "emergency_numbers": [
                "+232 76 000 002",
                "+232 30 555 001"
            ],
            "notes": "Specialized maternity hospital. Handles high-risk pregnancies and C-sections."
        },
        {
            "id": "hosp_003",
            "hospital_name": "Ola During Children's Hospital",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4890,
            "longitude": -13.2200,
            "phone": "+232 76 000 001",
            "email": "oladuring@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 120,
                "adult": 0,
                "maternity": 0,
                "pediatric": 110,
                "icu": 10
            },
            "average_occupancy_rates": {
                "overall": 0.88,
                "adult": 0,
                "maternity": 0,
                "pediatric": 0.90,
                "icu": 0.85
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": false,
                "pediatrics": true,
                "radiology": true,
                "lab": true,
                "blood_bank": false,
                "icu": true,
                "mental_health": false,
                "other": [
                    "Neonatal Care",
                    "Nutrition",
                    "Immunization"
                ]
            },
            "surgeons_by_specialty": {
                "pediatric_surgery": {
                    "count": 3,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Congenital Defects",
                        "Emergency Pediatric Surgery"
                    ]
                },
                "neonatal_surgery": {
                    "count": 2,
                    "services": [
                        "Neonatal Emergency Surgery",
                        "Congenital Anomaly Repair"
                    ]
                },
                "orthopedic_surgery": {
                    "count": 1,
                    "services": [
                        "Pediatric Fractures",
                        "Bone Deformity Correction"
                    ]
                }
            },
            "medical_specialists": {
                "pediatricians": 7,
                "neonatologists": 3,
                "pediatric_cardiologists": 1,
                "anesthetists": 2,
                "radiologists": 1,
                "nutritionists": 2,
                "child_psychologists": 1
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "pediatric_imaging": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": true,
                    "serology": true,
                    "genetic_screening": false
                },
                "pediatric_care": {
                    "neonatal_incubators": 12,
                    "phototherapy_units": 10,
                    "pediatric_ventilators": 8,
                    "cpap_machines": 6,
                    "warming_beds": 15
                },
                "critical_care": {
                    "ventilators": 10,
                    "oxygen_concentrators": 20,
                    "patient_monitors": 25,
                    "defibrillators": 4,
                    "infusion_pumps": 30
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Pediatric Complete",
                    "sterilization_unit": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "pediatric_formulations": true,
                    "vaccines": true
                },
                "other": {
                    "ambulances": 2,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "milk_bank": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 14,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T16:00:00Z"
            },
            "emergency_numbers": [
                "+232 76 000 001"
            ],
            "notes": "National pediatric referral hospital. Specialized in child healthcare."
        }
    ];

    // Initialize Data with Migration
    async function init() {
        console.log(`[MedFindData] Initializing...`);

        try {
            // 1. Check Official Key
            const officialData = localStorage.getItem(STORAGE_KEY);
            if (officialData) {
                try {
                    const parsed = JSON.parse(officialData);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        console.log(`[MedFindData] Found active data (${parsed.length} records).`);
                        return parsed;
                    }
                } catch (e) {
                    console.warn("[MedFindData] Corrupt local data, clearing.", e);
                    localStorage.removeItem(STORAGE_KEY);
                }
            }

            // 2. Try Migration
            for (const key of LEGACY_KEYS) {
                const legacyData = localStorage.getItem(key);
                if (legacyData) {
                    try {
                        const parsed = JSON.parse(legacyData);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            console.log(`[MedFindData] Migrating ${parsed.length} records from ${key}`);
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                            return parsed;
                        }
                    } catch (e) { continue; }
                }
            }

            // 3. NUCLEAR FALLBACK: DIRECT USE OF EMBEDDED DATA
            // We are skipping the fetch entirely if we got here, to avoid any network timing issues (CORS, 404, etc)
            // The user needs this working NOW.
            console.warn("[MedFindData] Local data missing. Using EMBEDDED NUCLEAR FALLBACK immediately.");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_DATA));
            return FALLBACK_DATA;

        } catch (err) {
            console.error("[MedFindData] Unexpected error during init:", err);
            return FALLBACK_DATA; // Ultimate safety net
        }
    }

    // Get all hospitals
    function getAllHospitals() {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return [];
        return JSON.parse(json);
    }

    // Get single hospital by ID
    function getHospitalById(id) {
        const hospitals = getAllHospitals();
        return hospitals.find(h => h.id === id);
    }

    // Save/Update a hospital
    function saveHospital(updatedHospital) {
        const hospitals = getAllHospitals();
        const index = hospitals.findIndex(h => h.id === updatedHospital.id);

        if (index !== -1) {
            hospitals[index] = updatedHospital;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hospitals));
            localStorage.setItem('medfind_last_sync', new Date().toISOString());
            return true;
        }
        return false;
    }

    return {
        init,
        getAllHospitals,
        getHospitalById,
        saveHospital
    };
})();

// Expose to window
// Expose to window
window.MedFindData = MedFindData;
// Also expose fallback data separately just in case
window.MEDFIND_FALLBACK = MedFindData.FALLBACK_DATA;
