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
        },
        {
            "id": "hosp_004",
            "hospital_name": "Bo Government Hospital",
            "district": "Bo",
            "region": "Southern Province",
            "latitude": 7.9600,
            "longitude": -11.7400,
            "phone": "+232 75 333 444",
            "email": "bogovhospital@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 200,
                "adult": 120,
                "maternity": 50,
                "pediatric": 25,
                "icu": 5
            },
            "average_occupancy_rates": {
                "overall": 0.80,
                "adult": 0.82,
                "maternity": 0.85,
                "pediatric": 0.70,
                "icu": 0.90
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
                "mental_health": false,
                "other": [
                    "General Practice",
                    "Outpatient",
                    "Dental"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 2,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery",
                        "Abscess Drainage"
                    ]
                },
                "orthopedic_surgery": {
                    "count": 1,
                    "services": [
                        "Fracture Repair",
                        "Joint Surgery"
                    ]
                },
                "obstetric_surgery": {
                    "count": 3,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Procedures"
                    ]
                },
                "pediatric_surgery": {
                    "count": 1,
                    "services": [
                        "Pediatric Emergency Surgery"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 8,
                "pediatricians": 2,
                "obstetricians": 3,
                "anesthetists": 1,
                "radiologists": 1,
                "dentists": 2,
                "internists": 3
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "mammography": false,
                    "dental_x_ray": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": true,
                    "pathology": true,
                    "serology": true,
                    "malaria_testing": true
                },
                "critical_care": {
                    "ventilators": 5,
                    "oxygen_concentrators": 15,
                    "patient_monitors": 18,
                    "defibrillators": 3,
                    "infusion_pumps": 20
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Complete",
                    "sterilization_unit": true
                },
                "dental": {
                    "dental_chairs": 3,
                    "x_ray": true,
                    "extraction_tools": true,
                    "sterilization": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "antimalarials": true,
                    "antibiotics": true
                },
                "other": {
                    "ambulances": 2,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "blood_storage": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 40,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T14:20:00Z"
            },
            "emergency_numbers": [
                "+232 75 333 444",
                "+232 75 333 445"
            ],
            "notes": "Regional referral hospital for Southern Province."
        },
        {
            "id": "hosp_005",
            "hospital_name": "Kenema Government Hospital",
            "district": "Kenema",
            "region": "Eastern Province",
            "latitude": 7.8750,
            "longitude": -11.1850,
            "phone": "+232 76 777 666",
            "email": "kenemahosp@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 180,
                "adult": 110,
                "maternity": 40,
                "pediatric": 25,
                "icu": 5
            },
            "average_occupancy_rates": {
                "overall": 0.78,
                "adult": 0.80,
                "maternity": 0.82,
                "pediatric": 0.68,
                "icu": 0.85
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
                "mental_health": false,
                "other": [
                    "Lassa Fever Unit",
                    "Infectious Diseases"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 2,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery"
                    ]
                },
                "obstetric_surgery": {
                    "count": 2,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Surgery"
                    ]
                },
                "pediatric_surgery": {
                    "count": 1,
                    "services": [
                        "Pediatric Emergency Procedures"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 6,
                "pediatricians": 2,
                "obstetricians": 2,
                "anesthetists": 1,
                "radiologists": 1,
                "infectious_disease_specialists": 2,
                "internists": 2
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "portable_x_ray": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": true,
                    "pathology": true,
                    "serology": true,
                    "lassa_fever_testing": true,
                    "pcr_lab": true
                },
                "infectious_disease": {
                    "isolation_units": 10,
                    "biosafety_cabinets": 2,
                    "protective_equipment": true,
                    "negative_pressure_rooms": 4
                },
                "critical_care": {
                    "ventilators": 5,
                    "oxygen_concentrators": 12,
                    "patient_monitors": 15,
                    "defibrillators": 3,
                    "infusion_pumps": 18
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Complete",
                    "sterilization_unit": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "antivirals": true,
                    "antibiotics": true
                },
                "other": {
                    "ambulances": 1,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "blood_storage": true,
                    "incinerator": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 39,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "No",
                "last_updated_timestamp": "2025-12-13T13:50:00Z"
            },
            "emergency_numbers": [
                "+232 76 777 666"
            ],
            "notes": "Regional hospital with specialized Lassa Fever treatment unit."
        },
        {
            "id": "hosp_006",
            "hospital_name": "Makeni Government Hospital",
            "district": "Bombali",
            "region": "Northern Province",
            "latitude": 8.8850,
            "longitude": -12.0450,
            "phone": "+232 79 111 222",
            "email": "makenihospital@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 160,
                "adult": 100,
                "maternity": 35,
                "pediatric": 20,
                "icu": 5
            },
            "average_occupancy_rates": {
                "overall": 0.75,
                "adult": 0.78,
                "maternity": 0.80,
                "pediatric": 0.65,
                "icu": 0.80
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
                "mental_health": false,
                "other": [
                    "Eye Clinic",
                    "Dental",
                    "General Practice"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 2,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery",
                        "Abscess Drainage"
                    ]
                },
                "obstetric_surgery": {
                    "count": 2,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Procedures"
                    ]
                },
                "ophthalmic_surgery": {
                    "count": 1,
                    "services": [
                        "Cataract Surgery",
                        "Eye Trauma",
                        "Pterygium Surgery"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 6,
                "pediatricians": 2,
                "obstetricians": 2,
                "anesthetists": 1,
                "radiologists": 1,
                "ophthalmologists": 2,
                "dentists": 2,
                "internists": 2
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "dental_x_ray": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": true,
                    "pathology": true,
                    "serology": true
                },
                "ophthalmology": {
                    "slit_lamp": 2,
                    "tonometer": 2,
                    "surgical_microscope": 1,
                    "phacoemulsification": true
                },
                "critical_care": {
                    "ventilators": 5,
                    "oxygen_concentrators": 12,
                    "patient_monitors": 15,
                    "defibrillators": 3,
                    "infusion_pumps": 18
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Complete",
                    "sterilization_unit": true
                },
                "dental": {
                    "dental_chairs": 2,
                    "x_ray": true,
                    "extraction_tools": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "eye_medications": true
                },
                "other": {
                    "ambulances": 2,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "blood_storage": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 40,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T15:10:00Z"
            },
            "emergency_numbers": [
                "+232 79 111 222",
                "+232 79 111 223"
            ],
            "notes": "Regional referral hospital for Northern Province. Eye clinic available."
        },
        {
            "id": "hosp_007",
            "hospital_name": "Koidu Government Hospital",
            "district": "Kono",
            "region": "Eastern Province",
            "latitude": 8.6440,
            "longitude": -10.9710,
            "phone": "+232 77 888 999",
            "email": "koiduhospital@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 100,
                "adult": 60,
                "maternity": 25,
                "pediatric": 12,
                "icu": 3
            },
            "average_occupancy_rates": {
                "overall": 0.70,
                "adult": 0.72,
                "maternity": 0.75,
                "pediatric": 0.60,
                "icu": 0.80
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": false,
                "lab": true,
                "blood_bank": false,
                "icu": true,
                "mental_health": false,
                "other": [
                    "General Practice",
                    "Outpatient"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 1,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Basic Trauma"
                    ]
                },
                "obstetric_surgery": {
                    "count": 1,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Surgery"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 5,
                "pediatricians": 1,
                "obstetricians": 1,
                "anesthetists": 1,
                "nurses": 15,
                "midwives": 8
            },
            "technology_services": {
                "imaging": {
                    "x_ray": false,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": false,
                    "serology": true,
                    "rapid_diagnostic_tests": true
                },
                "critical_care": {
                    "ventilators": 2,
                    "oxygen_concentrators": 8,
                    "patient_monitors": 10,
                    "defibrillators": 2,
                    "infusion_pumps": 12
                },
                "surgical": {
                    "operating_theatres": 1,
                    "anesthesia_machines": 1,
                    "surgical_instruments": "Basic",
                    "sterilization_unit": true
                },
                "pharmacy": {
                    "24_hour": false,
                    "emergency_drugs": true,
                    "basic_medications": true
                },
                "other": {
                    "ambulances": 1,
                    "emergency_generator": true,
                    "oxygen_cylinders": 20
                }
            },
            "dynamic_availability": {
                "beds_available_now": 30,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "No",
                "last_updated_timestamp": "2025-12-13T12:30:00Z"
            },
            "emergency_numbers": [
                "+232 77 888 999"
            ],
            "notes": "District hospital serving Kono region."
        },
        {
            "id": "hosp_008",
            "hospital_name": "Port Loko Government Hospital",
            "district": "Port Loko",
            "region": "Northern Province",
            "latitude": 8.7680,
            "longitude": -12.7870,
            "phone": "+232 78 222 333",
            "email": "portlokohospital@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 90,
                "adult": 55,
                "maternity": 20,
                "pediatric": 12,
                "icu": 3
            },
            "average_occupancy_rates": {
                "overall": 0.72,
                "adult": 0.75,
                "maternity": 0.78,
                "pediatric": 0.62,
                "icu": 0.75
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": false,
                "lab": true,
                "blood_bank": false,
                "icu": true,
                "mental_health": false,
                "other": [
                    "General Practice"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 1,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery"
                    ]
                },
                "obstetric_surgery": {
                    "count": 1,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Procedures"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 4,
                "pediatricians": 1,
                "obstetricians": 1,
                "anesthetists": 1,
                "nurses": 12,
                "midwives": 6
            },
            "technology_services": {
                "imaging": {
                    "x_ray": false,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": false,
                    "serology": true,
                    "malaria_testing": true
                },
                "critical_care": {
                    "ventilators": 2,
                    "oxygen_concentrators": 6,
                    "patient_monitors": 8,
                    "defibrillators": 2,
                    "infusion_pumps": 10
                },
                "surgical": {
                    "operating_theatres": 1,
                    "anesthesia_machines": 1,
                    "surgical_instruments": "Basic",
                    "sterilization_unit": true
                },
                "pharmacy": {
                    "24_hour": false,
                    "emergency_drugs": true,
                    "basic_medications": true
                },
                "other": {
                    "ambulances": 1,
                    "emergency_generator": true,
                    "oxygen_cylinders": 15
                }
            },
            "dynamic_availability": {
                "beds_available_now": 25,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T14:00:00Z"
            },
            "emergency_numbers": [
                "+232 78 222 333"
            ],
            "notes": "District hospital for Port Loko area."
        },
        {
            "id": "hosp_009",
            "hospital_name": "China-Sierra Leone Friendship Hospital",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4200,
            "longitude": -13.2100,
            "phone": "+232 76 555 777",
            "email": "cslf.hospital@health.gov.sl",
            "website": "http://www.cslhospital.sl",
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 100,
                "adult": 60,
                "maternity": 20,
                "pediatric": 15,
                "icu": 5
            },
            "average_occupancy_rates": {
                "overall": 0.68,
                "adult": 0.70,
                "maternity": 0.72,
                "pediatric": 0.60,
                "icu": 0.75
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
                "mental_health": false,
                "other": [
                    "Orthopedics",
                    "ENT",
                    "Ophthalmology"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 3,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery",
                        "Laparoscopic Surgery"
                    ]
                },
                "orthopedic_surgery": {
                    "count": 2,
                    "services": [
                        "Fracture Repair",
                        "Joint Surgery",
                        "Spine Surgery",
                        "Arthroscopy"
                    ]
                },
                "obstetric_surgery": {
                    "count": 2,
                    "services": [
                        "C-Section",
                        "Gynecological Surgery"
                    ]
                },
                "ent_surgery": {
                    "count": 1,
                    "services": [
                        "Tonsillectomy",
                        "Adenoidectomy",
                        "Sinus Surgery",
                        "Ear Surgery"
                    ]
                },
                "ophthalmic_surgery": {
                    "count": 1,
                    "services": [
                        "Cataract Surgery",
                        "Eye Trauma",
                        "Glaucoma Surgery"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 5,
                "pediatricians": 2,
                "obstetricians": 2,
                "anesthetists": 2,
                "radiologists": 1,
                "orthopedic_surgeons": 2,
                "ent_specialists": 1,
                "ophthalmologists": 1,
                "internists": 3
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
                    "immunology": true
                },
                "critical_care": {
                    "ventilators": 5,
                    "oxygen_concentrators": 12,
                    "patient_monitors": 18,
                    "defibrillators": 4,
                    "infusion_pumps": 20
                },
                "surgical": {
                    "operating_theatres": 3,
                    "anesthesia_machines": 3,
                    "surgical_instruments": "Advanced",
                    "laparoscopic_equipment": true,
                    "arthroscopic_equipment": true,
                    "sterilization_unit": true
                },
                "orthopedics": {
                    "c_arm_fluoroscopy": true,
                    "traction_beds": 4,
                    "orthopedic_instruments": "Complete"
                },
                "ophthalmology": {
                    "slit_lamp": 2,
                    "surgical_microscope": 1,
                    "phacoemulsification": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "specialized_medications": true
                },
                "other": {
                    "ambulances": 2,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "blood_storage": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 32,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T16:15:00Z"
            },
            "emergency_numbers": [
                "+232 76 555 777",
                "+232 76 555 778"
            ],
            "notes": "Modern facility with Chinese medical cooperation. Well-equipped."
        },
        {
            "id": "hosp_010",
            "hospital_name": "Waterloo Hospital (Adventist)",
            "district": "Western Area Rural",
            "region": "Western Area",
            "latitude": 8.3380,
            "longitude": -13.0700,
            "phone": "+232 76 444 555",
            "email": "waterloo.hospital@adventist.sl",
            "website": "http://www.adventisthealthsl.org",
            "facility_type": "Mission",
            "static_bed_capacity": {
                "total": 80,
                "adult": 45,
                "maternity": 20,
                "pediatric": 12,
                "icu": 3
            },
            "average_occupancy_rates": {
                "overall": 0.65,
                "adult": 0.68,
                "maternity": 0.70,
                "pediatric": 0.55,
                "icu": 0.70
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": true,
                "lab": true,
                "blood_bank": false,
                "icu": true,
                "mental_health": false,
                "other": [
                    "General Practice",
                    "Dental"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 2,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Trauma Surgery",
                        "Abscess Drainage"
                    ]
                },
                "obstetric_surgery": {
                    "count": 2,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Surgery"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 4,
                "pediatricians": 1,
                "obstetricians": 2,
                "anesthetists": 1,
                "radiologists": 1,
                "dentists": 2,
                "internists": 2
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "dental_x_ray": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": true,
                    "serology": true
                },
                "critical_care": {
                    "ventilators": 3,
                    "oxygen_concentrators": 10,
                    "patient_monitors": 12,
                    "defibrillators": 2,
                    "infusion_pumps": 15
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Complete",
                    "sterilization_unit": true
                },
                "dental": {
                    "dental_chairs": 2,
                    "x_ray": true,
                    "extraction_tools": true
                },
                "pharmacy": {
                    "24_hour": false,
                    "emergency_drugs": true,
                    "basic_medications": true
                },
                "other": {
                    "ambulances": 1,
                    "emergency_generator": true,
                    "central_oxygen_system": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 28,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "On Call",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T15:30:00Z"
            },
            "emergency_numbers": [
                "+232 76 444 555"
            ],
            "notes": "Mission hospital run by Seventh-day Adventist Church. Quality care."
        },
        {
            "id": "hosp_011",
            "hospital_name": "34 Military Hospital",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4680,
            "longitude": -13.2670,
            "phone": "+232 78 555 123",
            "email": "34military@mod.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": {
                "total": 120,
                "adult": 80,
                "maternity": 20,
                "pediatric": 15,
                "icu": 5
            },
            "average_occupancy_rates": {
                "overall": 0.70,
                "adult": 0.72,
                "maternity": 0.75,
                "pediatric": 0.62,
                "icu": 0.80
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
                "mental_health": false,
                "other": [
                    "General Practice",
                    "Infectious Diseases",
                    "Trauma"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 3,
                    "services": [
                        "Appendectomy",
                        "Hernia Repair",
                        "Gunshot Wounds",
                        "Blast Injuries"
                    ]
                },
                "trauma_surgery": {
                    "count": 2,
                    "services": [
                        "Emergency Trauma",
                        "Penetrating Trauma",
                        "Blunt Trauma"
                    ]
                },
                "orthopedic_surgery": {
                    "count": 2,
                    "services": [
                        "Fracture Repair",
                        "Combat Injuries",
                        "Joint Surgery"
                    ]
                },
                "obstetric_surgery": {
                    "count": 2,
                    "services": [
                        "C-Section",
                        "Emergency Obstetric Procedures"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 6,
                "pediatricians": 2,
                "obstetricians": 2,
                "anesthetists": 2,
                "radiologists": 1,
                "trauma_specialists": 2,
                "internists": 3,
                "emergency_physicians": 2
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": false,
                    "mri": false,
                    "portable_x_ray": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": true,
                    "pathology": true,
                    "serology": true,
                    "toxicology": true
                },
                "critical_care": {
                    "ventilators": 5,
                    "oxygen_concentrators": 15,
                    "patient_monitors": 18,
                    "defibrillators": 5,
                    "infusion_pumps": 20
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Advanced",
                    "trauma_kits": true,
                    "sterilization_unit": true
                },
                "emergency": {
                    "trauma_bay": true,
                    "resuscitation_room": true,
                    "emergency_kits": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "antibiotics": true,
                    "pain_management": true
                },
                "other": {
                    "ambulances": 3,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "blood_storage": true,
                    "helipad": false
                }
            },
            "dynamic_availability": {
                "beds_available_now": 36,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T16:20:00Z"
            },
            "emergency_numbers": [
                "+232 78 555 123",
                "+232 78 555 124"
            ],
            "notes": "Military hospital that also serves civilians. Well-equipped emergency department."
        },
        {
            "id": "hosp_012",
            "hospital_name": "Choithram Memorial Hospital",
            "district": "Western Area Urban",
            "region": "Western Area",
            "latitude": 8.4550,
            "longitude": -13.2550,
            "phone": "+232 88 999 888",
            "email": "info@choithram.sl",
            "website": "http://www.choithramhospital.sl",
            "facility_type": "Private",
            "static_bed_capacity": {
                "total": 60,
                "adult": 40,
                "maternity": 10,
                "pediatric": 8,
                "icu": 2
            },
            "average_occupancy_rates": {
                "overall": 0.60,
                "adult": 0.62,
                "maternity": 0.65,
                "pediatric": 0.55,
                "icu": 0.70
            },
            "key_services": {
                "emergency": true,
                "surgery": true,
                "maternity": true,
                "pediatrics": true,
                "radiology": true,
                "lab": true,
                "blood_bank": false,
                "icu": true,
                "mental_health": false,
                "other": [
                    "Cardiology",
                    "MRI/CT Scan",
                    "Dialysis",
                    "Pharmacy"
                ]
            },
            "surgeons_by_specialty": {
                "general_surgery": {
                    "count": 2,
                    "services": [
                        "Laparoscopic Surgery",
                        "Hernia Repair",
                        "Appendectomy",
                        "Gallbladder Surgery"
                    ]
                },
                "cardiothoracic_surgery": {
                    "count": 1,
                    "services": [
                        "Cardiac Procedures",
                        "Thoracic Surgery"
                    ]
                },
                "obstetric_surgery": {
                    "count": 1,
                    "services": [
                        "C-Section",
                        "Gynecological Surgery"
                    ]
                },
                "urological_surgery": {
                    "count": 1,
                    "services": [
                        "Prostate Surgery",
                        "Kidney Stones",
                        "Urinary Tract Procedures"
                    ]
                }
            },
            "medical_specialists": {
                "general_practitioners": 4,
                "pediatricians": 2,
                "obstetricians": 1,
                "anesthetists": 2,
                "radiologists": 2,
                "cardiologists": 2,
                "nephrologists": 1,
                "endocrinologists": 1,
                "internists": 3
            },
            "technology_services": {
                "imaging": {
                    "x_ray": true,
                    "ultrasound": true,
                    "ct_scan": true,
                    "mri": true,
                    "mammography": true,
                    "fluoroscopy": true,
                    "doppler_ultrasound": true
                },
                "laboratory": {
                    "clinical_chemistry": true,
                    "hematology": true,
                    "microbiology": true,
                    "blood_bank": false,
                    "pathology": true,
                    "serology": true,
                    "immunology": true,
                    "endocrinology": true,
                    "molecular_diagnostics": true
                },
                "cardiology": {
                    "ecg": true,
                    "echocardiography": true,
                    "holter_monitoring": true,
                    "stress_testing": true,
                    "cardiac_cathlab": false
                },
                "critical_care": {
                    "ventilators": 4,
                    "oxygen_concentrators": 10,
                    "patient_monitors": 15,
                    "defibrillators": 4,
                    "infusion_pumps": 18
                },
                "surgical": {
                    "operating_theatres": 2,
                    "anesthesia_machines": 2,
                    "surgical_instruments": "Premium",
                    "laparoscopic_equipment": true,
                    "endoscopy": true,
                    "sterilization_unit": true
                },
                "dialysis": {
                    "available": true,
                    "machines": 6,
                    "hemodialysis": true,
                    "peritoneal_dialysis": true
                },
                "pharmacy": {
                    "24_hour": true,
                    "emergency_drugs": true,
                    "specialized_medications": true,
                    "chemotherapy_drugs": false
                },
                "other": {
                    "ambulances": 2,
                    "emergency_generator": true,
                    "central_oxygen_system": true,
                    "medical_gas_system": true,
                    "vip_rooms": 5,
                    "telemedicine": true
                }
            },
            "dynamic_availability": {
                "beds_available_now": 24,
                "oxygen_available": "Yes",
                "surgeons_on_duty": "Yes",
                "operating_theatre_status": "Functional",
                "ambulance_available": "Yes",
                "last_updated_timestamp": "2025-12-13T16:25:00Z"
            },
            "emergency_numbers": [
                "+232 88 999 888",
                "+232 88 999 889"
            ],
            "notes": "Premium private hospital with advanced diagnostic equipment including MRI and CT scan."
        },
        {
            "id": "hosp_012",
            "hospital_name": "Bonthe Government Hospital",
            "district": "Bonthe",
            "region": "Southern Province",
            "latitude": 7.526,
            "longitude": -12.505,
            "phone": "+232 76 000 012",
            "email": "bonthe@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 50, "adult": 30, "maternity": 10, "pediatric": 10, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.60, "adult": 0.65, "maternity": 0.55, "pediatric": 0.50, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": false, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Basic Trauma"] } },
            "medical_specialists": { "general_practitioners": 2, "nurses": 8 },
            "technology_services": { "imaging": { "ultrasound": true }, "laboratory": { "malaria_testing": true }, "critical_care": { "oxygen_concentrators": 2 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 1, "boat_ambulance": true } },
            "dynamic_availability": { "beds_available_now": 20, "oxygen_available": "Limited", "surgeons_on_duty": "No", "operating_theatre_status": "Limited", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T08:00:00Z" },
            "emergency_numbers": ["+232 76 000 012"],
            "notes": "Access via boat available."
        },
        {
            "id": "hosp_013",
            "hospital_name": "Kabala Government Hospital",
            "district": "Koinadugu",
            "region": "Northern Province",
            "latitude": 9.588,
            "longitude": -11.551,
            "phone": "+232 76 000 013",
            "email": "kabala@health.gov.sl",
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 80, "adult": 40, "maternity": 20, "pediatric": 20, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.70, "adult": 0.75, "maternity": 0.65, "pediatric": 0.60, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": true, "lab": true, "blood_bank": true, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Hernia", "Appendectomy"] } },
            "medical_specialists": { "general_practitioners": 3, "midwives": 5 },
            "technology_services": { "imaging": { "x_ray": true, "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 4 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "essential_drugs": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 15, "oxygen_available": "Yes", "surgeons_on_duty": "On Call", "operating_theatre_status": "Functional", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T09:30:00Z" },
            "emergency_numbers": ["+232 76 000 013"],
            "notes": "Main referral for Koinadugu."
        },
        {
            "id": "hosp_014",
            "hospital_name": "Moyamba Government Hospital",
            "district": "Moyamba",
            "region": "Southern Province",
            "latitude": 8.160,
            "longitude": -12.433,
            "phone": "+232 76 000 014",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 70, "adult": 40, "maternity": 20, "pediatric": 10, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.65, "adult": 0.70, "maternity": 0.60, "pediatric": 0.50, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": false, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Basic"] } },
            "medical_specialists": { "general_practitioners": 3 },
            "technology_services": { "imaging": { "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 3 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 25, "oxygen_available": "Yes", "surgeons_on_duty": "No", "operating_theatre_status": "Limited", "ambulance_available": "No", "last_updated_timestamp": "2025-12-18T10:00:00Z" },
            "emergency_numbers": ["+232 76 000 014"],
            "notes": "District hospital."
        },
        {
            "id": "hosp_015",
            "hospital_name": "Pujehun Government Hospital",
            "district": "Pujehun",
            "region": "Southern Province",
            "latitude": 7.356,
            "longitude": -11.725,
            "phone": "+232 76 000 015",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 60, "adult": 30, "maternity": 20, "pediatric": 10, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.60, "adult": 0.65, "maternity": 0.55, "pediatric": 0.40, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": false, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Basic"] } },
            "medical_specialists": { "general_practitioners": 2 },
            "technology_services": { "imaging": { "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 2 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 22, "oxygen_available": "Limited", "surgeons_on_duty": "No", "operating_theatre_status": "Functional", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T11:00:00Z" },
            "emergency_numbers": ["+232 76 000 015"],
            "notes": "Serving Pujehun district."
        },
        {
            "id": "hosp_016",
            "hospital_name": "Magburaka Government Hospital",
            "district": "Tonkolili",
            "region": "Northern Province",
            "latitude": 8.717,
            "longitude": -11.950,
            "phone": "+232 76 000 016",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 100, "adult": 60, "maternity": 25, "pediatric": 15, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.75, "adult": 0.78, "maternity": 0.72, "pediatric": 0.65, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": true, "lab": true, "blood_bank": true, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["General"] } },
            "medical_specialists": { "general_practitioners": 4, "midwives": 6 },
            "technology_services": { "imaging": { "x_ray": true, "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 5 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "essential_drugs": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 30, "oxygen_available": "Yes", "surgeons_on_duty": "On Call", "operating_theatre_status": "Functional", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T12:00:00Z" },
            "emergency_numbers": ["+232 76 000 016"],
            "notes": "Key hospital for Tonkolili."
        },
        {
            "id": "hosp_017",
            "hospital_name": "Kambia Government Hospital",
            "district": "Kambia",
            "region": "Northern Province",
            "latitude": 9.125,
            "longitude": -12.918,
            "phone": "+232 76 000 017",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 60, "adult": 30, "maternity": 20, "pediatric": 10, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.68, "adult": 0.70, "maternity": 0.65, "pediatric": 0.60, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": false, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Basic"] } },
            "medical_specialists": { "general_practitioners": 3 },
            "technology_services": { "imaging": { "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 3 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 18, "oxygen_available": "Yes", "surgeons_on_duty": "No", "operating_theatre_status": "Functional", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T13:00:00Z" },
            "emergency_numbers": ["+232 76 000 017"],
            "notes": "Border district hospital."
        },
        {
            "id": "hosp_018",
            "hospital_name": "Kailahun Government Hospital",
            "district": "Kailahun",
            "region": "Eastern Province",
            "latitude": 8.276,
            "longitude": -10.573,
            "phone": "+232 76 000 018",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 70, "adult": 40, "maternity": 20, "pediatric": 10, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.70, "adult": 0.72, "maternity": 0.68, "pediatric": 0.65, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": true, "icu": false, "mental_health": false, "other": ["General Practice", "Infectious Disease"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["Basic"] } },
            "medical_specialists": { "general_practitioners": 3, "infectious_disease_specialists": 1 },
            "technology_services": { "imaging": { "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 3 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 20, "oxygen_available": "Yes", "surgeons_on_duty": "On Call", "operating_theatre_status": "Functional", "ambulance_available": "No", "last_updated_timestamp": "2025-12-18T14:00:00Z" },
            "emergency_numbers": ["+232 76 000 018"],
            "notes": "Regional importance."
        },
        {
            "id": "hosp_019",
            "hospital_name": "Kamakwie Wesleyan Hospital",
            "district": "Karene",
            "region": "Northern Province",
            "latitude": 9.497,
            "longitude": -12.240,
            "phone": "+232 76 000 019",
            "email": null,
            "website": null,
            "facility_type": "Mission",
            "static_bed_capacity": { "total": 80, "adult": 40, "maternity": 20, "pediatric": 20, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.75, "adult": 0.80, "maternity": 0.70, "pediatric": 0.70, "icu": 0 },
            "key_services": { "emergency": true, "surgery": true, "maternity": true, "pediatrics": true, "radiology": true, "lab": true, "blood_bank": true, "icu": false, "mental_health": false, "other": ["General Practice"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 1, "services": ["General"] } },
            "medical_specialists": { "general_practitioners": 3 },
            "technology_services": { "imaging": { "x_ray": true, "ultrasound": true }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 4 }, "surgical": { "operating_theatres": 1 }, "pharmacy": { "essential_drugs": true }, "other": { "ambulances": 1 } },
            "dynamic_availability": { "beds_available_now": 10, "oxygen_available": "Yes", "surgeons_on_duty": "Yes", "operating_theatre_status": "Functional", "ambulance_available": "Yes", "last_updated_timestamp": "2025-12-18T15:00:00Z" },
            "emergency_numbers": ["+232 76 000 019"],
            "notes": "Mission hospital serving Karene."
        },
        {
            "id": "hosp_020",
            "hospital_name": "Falaba Community Health Centre",
            "district": "Falaba",
            "region": "Northern Province",
            "latitude": 9.850,
            "longitude": -11.300,
            "phone": "+232 76 000 020",
            "email": null,
            "website": null,
            "facility_type": "Government",
            "static_bed_capacity": { "total": 30, "adult": 15, "maternity": 10, "pediatric": 5, "icu": 0 },
            "average_occupancy_rates": { "overall": 0.50, "adult": 0.55, "maternity": 0.50, "pediatric": 0.40, "icu": 0 },
            "key_services": { "emergency": true, "surgery": false, "maternity": true, "pediatrics": true, "radiology": false, "lab": true, "blood_bank": false, "icu": false, "mental_health": false, "other": ["Primary Care"] },
            "surgeons_by_specialty": { "general_surgery": { "count": 0, "services": [] } },
            "medical_specialists": { "nurses": 5, "midwives": 2 },
            "technology_services": { "imaging": { "ultrasound": false }, "laboratory": { "basic_labs": true }, "critical_care": { "oxygen_concentrators": 1 }, "surgical": { "operating_theatres": 0 }, "pharmacy": { "basic_medications": true }, "other": { "ambulances": 0 } },
            "dynamic_availability": { "beds_available_now": 15, "oxygen_available": "Limited", "surgeons_on_duty": "No", "operating_theatre_status": "Not Functional", "ambulance_available": "No", "last_updated_timestamp": "2025-12-18T16:00:00Z" },
            "emergency_numbers": ["+232 76 000 020"],
            "notes": "Primary care facility."
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
        saveHospital,
        FALLBACK_DATA // Expose for debugging
    };
})();

// Expose to window
// Expose to window
window.MedFindData = MedFindData;
// Also expose fallback data separately just in case
window.MEDFIND_FALLBACK = MedFindData.FALLBACK_DATA;
