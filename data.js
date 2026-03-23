try {
    if (window.MedFindData) { throw 'skip'; } // already loaded
    if (!window.MedFindData) {
        window.MedFindData = (function () {
            const FALLBACK_DATA = [
    {
        "id": "hosp_001",
        "hospital_name": "Connaught Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.4844,
        "longitude": -13.2344,
        "phone": "+232 76 616 182",
        "email": "medfindsalone@gmail.com",
        "website": "http://www.connaughthospital.gov.sl",
        "facility_type": "Government Tertiary Referral Hospital",
        "static_bed_capacity": {
            "total": 350,
            "male": 100,
            "female": 100,
            "maternity": 80,
            "pediatric": 50,
            "icu": 20
        },
        "average_occupancy_rates": {
            "overall": 0.85,
            "male": 0.88,
            "female": 0.88,
            "maternity": 0.9,
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
            "pharmacy": true,
            "eye_care": true,
            "ent": true,
            "dental": true,
            "orthopedics": true,
            "other": [
                "Internal Medicine",
                "Outpatient Services"
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
            }
        },
        "medical_specialists": {
            "pediatricians": 5,
            "anesthetists": 3,
            "radiologists": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": true,
                "ultrasound": true,
                "ct_scan": true
            },
            "laboratory": {
                "clinical_chemistry": true,
                "blood_bank": true
            },
            "critical_care": {
                "ventilators": 12,
                "oxygen_concentrators": 25
            },
            "surgical": {
                "operating_theatres": 4
            },
            "pharmacy": {
                "24_hour": true,
                "emergency_drugs": true
            },
            "other": {
                "ambulances": 3
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
            "+232 76 616 182",
            "+232 22 222 023"
        ],
        "notes": "Sierra Leone’s principal adult referral hospital providing advanced medical, surgical, emergency, and specialist services. Serves as the main teaching hospital for complex cases nationwide.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 18
            },
            "maternity": {
                "total": 80,
                "available": 6
            },
            "pediatric": {
                "total": 50,
                "available": 3
            },
            "icu": {
                "total": 20,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "available",
                "mri": "unavailable",
                "x_ray": "available"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.91",
            "asthma": "0.84",
            "heart_attack": "0.56",
            "poisoning": "0.58",
            "child": "0.97",
            "surgery": "0.97"
        },
        "reliability_score": "4.0",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.639Z"
    },
    {
        "id": "hosp_002",
        "hospital_name": "Choithram Memorial Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.455,
        "longitude": -13.255,
        "phone": "+232 76 980 000",
        "email": "medfindsalone@gmail.com",
        "website": "http://www.choithramhospital.sl",
        "facility_type": "Private Multispecialty Hospital",
        "static_bed_capacity": {
            "total": 60,
            "male": 20,
            "female": 20,
            "maternity": 10,
            "pediatric": 8,
            "icu": 2
        },
        "average_occupancy_rates": {
            "overall": 0.6,
            "male": 0.62,
            "female": 0.62,
            "maternity": 0.65,
            "pediatric": 0.55,
            "icu": 0.7
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
            "pharmacy": true,
            "cardiology": true,
            "dialysis": true,
            "dental": true,
            "other": [
                "Cardiology",
                "MRI/CT Scan",
                "Dialysis"
            ]
        },
        "surgeons_by_specialty": {
            "general_surgery": {
                "count": 2,
                "services": [
                    "Laparoscopic Surgery",
                    "Hernia Repair"
                ]
            }
        },
        "medical_specialists": {
            "general_practitioners": 4,
            "pediatricians": 2,
            "cardiologists": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": true,
                "ultrasound": true,
                "ct_scan": true,
                "mri": true
            },
            "laboratory": {
                "clinical_chemistry": true
            },
            "critical_care": {
                "ventilators": 4
            },
            "surgical": {
                "operating_theatres": 2
            },
            "dialysis": {
                "available": true,
                "machines": 6
            },
            "pharmacy": {
                "24_hour": true
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
            "+232 76 980 000",
            "+232 22 232 598"
        ],
        "notes": "Premium private hospital offering advanced diagnostic imaging, specialist consultations, surgical procedures, and 24-hour emergency care.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 0
            },
            "maternity": {
                "total": 10,
                "available": 8
            },
            "pediatric": {
                "total": 8,
                "available": 7
            },
            "icu": {
                "total": 2,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "available",
                "mri": "available",
                "x_ray": "available"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "on_call",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.53",
            "pregnancy": "0.98",
            "asthma": "0.88",
            "heart_attack": "0.52",
            "poisoning": "0.54",
            "child": "0.98",
            "surgery": "0.91"
        },
        "reliability_score": "4.7",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_003",
        "hospital_name": "Emergency Hospital Goderich",
        "district": "Western Area Rural",
        "region": "Western Area",
        "latitude": 8.433,
        "longitude": -13.29,
        "phone": "+232 76 611 386",
        "email": "medfindsalone@gmail.com",
        "website": "https://www.emergency.it",
        "facility_type": "NGO",
        "static_bed_capacity": {
            "total": 100,
            "male": 30,
            "female": 30,
            "maternity": 0,
            "pediatric": 40,
            "icu": 10
        },
        "average_occupancy_rates": {
            "overall": 0.9,
            "male": 0.95,
            "female": 0.95,
            "maternity": 0,
            "pediatric": 0.85,
            "icu": 0.95
        },
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": false,
            "pediatrics": true,
            "radiology": true,
            "lab": true,
            "blood_bank": true,
            "icu": true,
            "mental_health": false,
            "pharmacy": true,
            "ent": true,
            "other": [
                "Trauma Surgery",
                "Free Care"
            ]
        },
        "surgeons_by_specialty": {
            "trauma_surgery": {
                "count": 4,
                "services": [
                    "Advanced Trauma"
                ]
            },
            "pediatric_surgery": {
                "count": 2,
                "services": [
                    "General"
                ]
            }
        },
        "medical_specialists": {
            "surgeons": 6,
            "anesthetists": 3,
            "pediatricians": 4
        },
        "technology_services": {
            "imaging": {
                "x_ray": true,
                "ct_scan": true
            },
            "laboratory": {
                "advanced_labs": true
            },
            "critical_care": {
                "ventilators": 8,
                "oxygen_concentrators": 20
            },
            "surgical": {
                "operating_theatres": 3
            },
            "pharmacy": {
                "free_meds": true
            },
            "other": {
                "ambulances": 2
            }
        },
        "dynamic_availability": {
            "beds_available_now": 5,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "Yes",
            "operating_theatre_status": "Functional",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-18T16:30:00Z"
        },
        "emergency_numbers": [
            "+232 76 611 386"
        ],
        "notes": "World-class trauma and surgical center. Services are free of charge. Specializes in Trauma and Paediatrics.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 7
            },
            "maternity": {
                "total": 20,
                "available": 3
            },
            "pediatric": {
                "total": 40,
                "available": 9
            },
            "icu": {
                "total": 10,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "available",
                "mri": "unavailable",
                "x_ray": "available"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "on_site",
            "obstetricians": "unavailable",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "closed",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 9,
            "trauma_center": true
        },
        "suitability": {
            "trauma": "0.96",
            "pregnancy": "0.60",
            "asthma": "0.81",
            "heart_attack": "0.50",
            "poisoning": "0.57",
            "child": "0.93",
            "surgery": "0.92"
        },
        "reliability_score": "4.6",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_004",
        "hospital_name": "Princess Christian Maternity Hospital (PCMH)",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.4885,
        "longitude": -13.2205,
        "phone": "+232 76 000 002",
        "email": "medfindsalone@gmail.com",
        "website": null,
        "facility_type": "Government Specialist (Maternity)",
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
            "pediatric": 0.8,
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
            "pharmacy": true,
            "other": [
                "Obstetrics",
                "Gynecology",
                "Family Planning"
            ]
        },
        "surgeons_by_specialty": {
            "obstetric_surgery": {
                "count": 8,
                "services": [
                    "C-Section",
                    "Emergency C-Section"
                ]
            }
        },
        "medical_specialists": {
            "obstetricians": 8,
            "gynecologists": 4,
            "midwives": 25
        },
        "technology_services": {
            "imaging": {
                "x_ray": true,
                "ultrasound": true
            },
            "laboratory": {
                "clinical_chemistry": true,
                "hematology": true
            },
            "obstetric": {
                "fetal_monitors": 15,
                "ultrasound_machines": 4
            },
            "pharmacy": {
                "24_hour": true,
                "obstetric_drugs": true
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
            "+232 76 000 002"
        ],
        "notes": "National referral hospital dedicated to maternal and obstetric care, including high-risk pregnancies, emergency obstetrics, neonatal services, and gynecological surgery.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 9
            },
            "maternity": {
                "total": 130,
                "available": 7
            },
            "pediatric": {
                "total": 20,
                "available": 4
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "available"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 8,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.99",
            "asthma": "0.83",
            "heart_attack": "0.51",
            "poisoning": "0.54",
            "child": "0.98",
            "surgery": "0.91"
        },
        "reliability_score": "4.5",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_005",
        "hospital_name": "Ola During Children's Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.489,
        "longitude": -13.22,
        "phone": "+232 76 000 001",
        "email": "medfindsalone@gmail.com",
        "website": null,
        "facility_type": "Government Specialist (Pediatrics)",
        "static_bed_capacity": {
            "total": 120,
            "adult": 0,
            "maternity": 0,
            "pediatric": 110,
            "icu": 10
        },
        "average_occupancy_rates": {
            "overall": 0.88
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
            "pharmacy": true
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
        "notes": "National pediatric referral hospital providing comprehensive child healthcare, neonatal care, pediatric surgery, and emergency services for infants and children.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 7
            },
            "maternity": {
                "total": 20,
                "available": 3
            },
            "pediatric": {
                "total": 110,
                "available": 8
            },
            "icu": {
                "total": 10,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 3
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "on_call",
            "obstetricians": "unavailable",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "closed",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 8,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.51",
            "asthma": "0.86",
            "heart_attack": "0.57",
            "poisoning": "0.55",
            "child": "0.95",
            "surgery": "0.91"
        },
        "reliability_score": "4.3",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_006",
        "hospital_name": "34 Military Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.468,
        "longitude": -13.267,
        "phone": "+232 78 555 123",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Military / Public Access",
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "pediatrics": true,
            "radiology": true,
            "lab": true,
            "blood_bank": true,
            "icu": true,
            "pharmacy": true
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
            "+232 78 555 123"
        ],
        "notes": "Military medical facility offering emergency care, general medicine, surgery, and specialist services to military personnel and civilians.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 0
            },
            "maternity": {
                "total": 20,
                "available": 9
            },
            "pediatric": {
                "total": 20,
                "available": 0
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "unavailable",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.54",
            "pregnancy": "0.99",
            "asthma": "0.58",
            "heart_attack": "0.57",
            "poisoning": "0.58",
            "child": "0.95",
            "surgery": "0.91"
        },
        "reliability_score": "4.7",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_007",
        "hospital_name": "Life Care Hospital - Western",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.45,
        "longitude": -13.26,
        "phone": "+232 80 220 220",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Private",
        "key_services": {
            "emergency": true,
            "surgery": true,
            "radiology": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "On Call",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 80 220 220"
        ],
        "notes": "Modern private hospital located at 198 Wilkinson Road.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 13
            },
            "maternity": {
                "total": 20,
                "available": 1
            },
            "pediatric": {
                "total": 20,
                "available": 8
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 8,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.50",
            "pregnancy": "0.54",
            "asthma": "0.89",
            "heart_attack": "0.54",
            "poisoning": "0.53",
            "child": "0.51",
            "surgery": "0.95"
        },
        "reliability_score": "4.8",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_008",
        "hospital_name": "Life Care Hospital - Eastern",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.47,
        "longitude": -13.2,
        "phone": "+232 80 330 000",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Private",
        "key_services": {
            "emergency": true,
            "surgery": true,
            "radiology": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 15,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "On Call",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 80 330 000"
        ],
        "notes": "Located at 116 Bai Bureh Road, Freetown.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 8
            },
            "maternity": {
                "total": 20,
                "available": 9
            },
            "pediatric": {
                "total": 20,
                "available": 1
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 12,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.58",
            "asthma": "0.85",
            "heart_attack": "0.54",
            "poisoning": "0.55",
            "child": "0.51",
            "surgery": "0.95"
        },
        "reliability_score": "4.1",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_009",
        "hospital_name": "Blue Shield Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.48,
        "longitude": -13.24,
        "phone": "+232 33 312 545",
        "facility_type": "Private",
        "key_services": {
            "emergency": true,
            "surgery": false,
            "radiology": false,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 5,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 33 312 545"
        ],
        "notes": "Located at 27 Ascension Town Road.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 19
            },
            "maternity": {
                "total": 20,
                "available": 8
            },
            "pediatric": {
                "total": 20,
                "available": 4
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 13,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.54",
            "pregnancy": "0.54",
            "asthma": "0.80",
            "heart_attack": "0.58",
            "poisoning": "0.58",
            "child": "0.53",
            "surgery": "0.54"
        },
        "reliability_score": "4.6",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_010",
        "hospital_name": "Ansar Clinical",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.475,
        "longitude": -13.2,
        "phone": "+232 76 760 760",
        "facility_type": "Private",
        "key_services": {
            "emergency": false,
            "surgery": false,
            "radiology": false,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 2,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 76 760 760"
        ],
        "notes": "Located at 134 Bai Bureh Road, Kissy.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 3
            },
            "maternity": {
                "total": 20,
                "available": 4
            },
            "pediatric": {
                "total": 20,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 10,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.59",
            "pregnancy": "0.54",
            "asthma": "0.82",
            "heart_attack": "0.51",
            "poisoning": "0.55",
            "child": "0.56",
            "surgery": "0.56"
        },
        "reliability_score": "4.9",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_011",
        "hospital_name": "Marie Stopes (Aberdeen)",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.49,
        "longitude": -13.28,
        "phone": "+232 76 422 810",
        "facility_type": "NGO",
        "key_services": {
            "emergency": false,
            "surgery": true,
            "maternity": true,
            "radiology": false,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 5,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 76 422 810"
        ],
        "notes": "Specializes in sexual and reproductive health. Located at 10A Ahmed Drive, Aberdeen.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 13
            },
            "maternity": {
                "total": 20,
                "available": 5
            },
            "pediatric": {
                "total": 20,
                "available": 8
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 2,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.59",
            "pregnancy": "0.91",
            "asthma": "0.83",
            "heart_attack": "0.60",
            "poisoning": "0.57",
            "child": "0.58",
            "surgery": "0.92"
        },
        "reliability_score": "5.0",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_012",
        "hospital_name": "Brookfields Community Hospital",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.47,
        "longitude": -13.24,
        "phone": "+232 22 242 003",
        "facility_type": "Government",
        "key_services": {
            "emergency": true,
            "surgery": false,
            "radiology": false,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 10,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "No",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 22 242 003"
        ],
        "notes": "Located at 11 King Harman Road.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 4
            },
            "maternity": {
                "total": 20,
                "available": 5
            },
            "pediatric": {
                "total": 20,
                "available": 8
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 3
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 3,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.54",
            "pregnancy": "0.60",
            "asthma": "0.83",
            "heart_attack": "0.53",
            "poisoning": "0.58",
            "child": "0.60",
            "surgery": "0.54"
        },
        "reliability_score": "4.8",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_013",
        "hospital_name": "China-Sierra Leone Friendship Hospital",
        "district": "Western Area Rural",
        "region": "Western Area",
        "latitude": 8.42,
        "longitude": -13.21,
        "phone": "+232 76 555 777",
        "facility_type": "Government",
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "pediatrics": true,
            "radiology": true,
            "lab": true,
            "icu": true,
            "pharmacy": true
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
            "+232 76 555 777"
        ],
        "notes": "Modern facility with Chinese medical cooperation. Well-equipped.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 13
            },
            "maternity": {
                "total": 20,
                "available": 1
            },
            "pediatric": {
                "total": 20,
                "available": 0
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 7,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.91",
            "asthma": "0.87",
            "heart_attack": "0.51",
            "poisoning": "0.54",
            "child": "0.98",
            "surgery": "0.97"
        },
        "reliability_score": "4.7",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_014",
        "hospital_name": "Bo Government Hospital",
        "district": "Bo",
        "region": "Southern Province",
        "latitude": 7.96,
        "longitude": -11.74,
        "phone": "+232 79 036 508",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Regional Referral Hospital",
        "static_bed_capacity": {
            "total": 200,
            "adult": 120,
            "maternity": 50,
            "pediatric": 25,
            "icu": 5
        },
        "average_occupancy_rates": {
            "overall": 0.8
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
            "pharmacy": true
        },
        "surgeons_by_specialty": {
            "general_surgery": {
                "count": 2,
                "services": [
                    "Appendectomy",
                    "Trauma Surgery"
                ]
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
            "+232 79 036 508"
        ],
        "notes": "Major referral hospital in the Southern Province providing specialist services, surgery, maternity, pediatrics, emergency care, and inpatient treatment.",
        "beds_detailed": {
            "adult": {
                "total": 120,
                "available": 8
            },
            "maternity": {
                "total": 50,
                "available": 7
            },
            "pediatric": {
                "total": 25,
                "available": 1
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 10,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.56",
            "pregnancy": "0.99",
            "asthma": "0.86",
            "heart_attack": "0.55",
            "poisoning": "0.59",
            "child": "0.92",
            "surgery": "0.97"
        },
        "reliability_score": "4.7",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_015",
        "hospital_name": "Kenema Government Hospital",
        "district": "Kenema",
        "region": "Eastern Province",
        "latitude": 7.875,
        "longitude": -11.185,
        "phone": "+232 76 777 666",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Regional Referral Hospital",
        "static_bed_capacity": {
            "total": 180,
            "adult": 110,
            "maternity": 40
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
            "pharmacy": true,
            "other": [
                "Lassa Fever Unit"
            ]
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
        "notes": "Regional referral center providing advanced medical care, surgery, maternity services, pediatrics, and emergency response.",
        "beds_detailed": {
            "adult": {
                "total": 110,
                "available": 0
            },
            "maternity": {
                "total": 40,
                "available": 3
            },
            "pediatric": {
                "total": 20,
                "available": 7
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 11,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.53",
            "pregnancy": "0.97",
            "asthma": "0.87",
            "heart_attack": "0.57",
            "poisoning": "0.57",
            "child": "0.92",
            "surgery": "0.99"
        },
        "reliability_score": "4.7",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_016",
        "hospital_name": "Makeni Government Hospital",
        "district": "Bombali",
        "region": "Northern Province",
        "latitude": 8.885,
        "longitude": -12.045,
        "phone": "+232 79 111 222",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Regional Referral Hospital",
        "static_bed_capacity": {
            "total": 160
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
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 40,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "On Call",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-13T15:10:00Z"
        },
        "emergency_numbers": [
            "+232 79 111 222"
        ],
        "notes": "Primary referral hospital for the Northern Province offering emergency services, surgery, maternity care, pediatrics, and internal medicine.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 11
            },
            "maternity": {
                "total": 20,
                "available": 4
            },
            "pediatric": {
                "total": 20,
                "available": 0
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 3
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "available",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 13,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.60",
            "pregnancy": "0.99",
            "asthma": "0.83",
            "heart_attack": "0.55",
            "poisoning": "0.54",
            "child": "0.98",
            "surgery": "0.91"
        },
        "reliability_score": "4.6",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_017",
        "hospital_name": "Koidu Government Hospital",
        "district": "Kono",
        "region": "Eastern Province",
        "latitude": 8.644,
        "longitude": -10.971,
        "phone": "+232 77 888 999",
        "facility_type": "Government District Hospital",
        "static_bed_capacity": {
            "total": 100
        },
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "pediatrics": true,
            "radiology": false,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 30,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "On Call",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-13T12:30:00Z"
        },
        "emergency_numbers": [
            "+232 77 888 999"
        ],
        "notes": "District hospital offering emergency care, maternity services, inpatient treatment, and general medical services.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 7
            },
            "maternity": {
                "total": 20,
                "available": 7
            },
            "pediatric": {
                "total": 20,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.94",
            "asthma": "0.86",
            "heart_attack": "0.52",
            "poisoning": "0.59",
            "child": "1.00",
            "surgery": "0.94"
        },
        "reliability_score": "4.1",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.641Z"
    },
    {
        "id": "hosp_018",
        "hospital_name": "Port Loko Government Hospital",
        "district": "Port Loko",
        "region": "Northern Province",
        "latitude": 8.768,
        "longitude": -12.787,
        "phone": "+232 78 222 333",
        "facility_type": "Government District Hospital",
        "static_bed_capacity": {
            "total": 90
        },
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "pediatrics": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 25,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "On Call",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-13T14:00:00Z"
        },
        "emergency_numbers": [
            "+232 78 222 333"
        ],
        "notes": "Offers general medical treatment, emergency response, maternity services, and inpatient care to the Port Loko district.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 10
            },
            "maternity": {
                "total": 20,
                "available": 1
            },
            "pediatric": {
                "total": 20,
                "available": 5
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 3
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.91",
            "asthma": "0.90",
            "heart_attack": "0.51",
            "poisoning": "0.57",
            "child": "0.94",
            "surgery": "0.96"
        },
        "reliability_score": "4.4",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_019",
        "hospital_name": "Holy Spirit Hospital",
        "district": "Bombali",
        "region": "Northern Province",
        "latitude": 8.89,
        "longitude": -12.05,
        "phone": "+232 76 603 252",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Private",
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 10,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "Yes",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 76 603 252"
        ],
        "notes": "Located in Masuba, Makeni.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 4
            },
            "maternity": {
                "total": 20,
                "available": 9
            },
            "pediatric": {
                "total": 20,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 11,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.90",
            "asthma": "0.90",
            "heart_attack": "0.51",
            "poisoning": "0.50",
            "child": "0.53",
            "surgery": "0.93"
        },
        "reliability_score": "4.7",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_020",
        "hospital_name": "Masanga Hospital",
        "district": "Tonkolili",
        "region": "Northern Province",
        "latitude": 8.74,
        "longitude": -11.83,
        "phone": "+232 76 626 000",
        "email": "medfindsalone@gmail.com",
        "website": "https://masangahospital.org",
        "facility_type": "Mission",
        "static_bed_capacity": {
            "total": 120
        },
        "key_services": {
            "emergency": true,
            "surgery": true,
            "maternity": true,
            "pediatrics": true,
            "radiology": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 30,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "Yes",
            "operating_theatre_status": "Functional",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-18T15:30:00Z"
        },
        "emergency_numbers": [
            "+232 76 626 000"
        ],
        "notes": "Renowned for surgical training and rehabilitation services.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 4
            },
            "maternity": {
                "total": 20,
                "available": 7
            },
            "pediatric": {
                "total": 20,
                "available": 7
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 4,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.59",
            "pregnancy": "0.92",
            "asthma": "0.84",
            "heart_attack": "0.54",
            "poisoning": "0.51",
            "child": "0.94",
            "surgery": "0.90"
        },
        "reliability_score": "4.1",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_021",
        "hospital_name": "Bai Bureh Memorial Community Hospital",
        "district": "Port Loko",
        "region": "Northern Province",
        "latitude": 8.62,
        "longitude": -13.2,
        "phone": "+232 76 656 124",
        "facility_type": "Government",
        "key_services": {
            "emergency": true,
            "surgery": false,
            "maternity": true,
            "lab": true,
            "pharmacy": true
        },
        "dynamic_availability": {
            "beds_available_now": 15,
            "oxygen_available": "Yes",
            "surgeons_on_duty": "No",
            "ambulance_available": "Yes",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 76 656 124"
        ],
        "notes": "Located at Mahera Road, Mahera, Lungi.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 18
            },
            "maternity": {
                "total": 20,
                "available": 2
            },
            "pediatric": {
                "total": 20,
                "available": 8
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 3
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "on_site",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "open",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "open",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 9,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.95",
            "asthma": "0.83",
            "heart_attack": "0.54",
            "poisoning": "0.54",
            "child": "0.60",
            "surgery": "0.53"
        },
        "reliability_score": "4.3",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_001",
        "hospital_name": "QuickTrip Pharmacy",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.48,
        "longitude": -13.23,
        "phone": "+232 74 381 729",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy",
                "Prescriptions"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "operating_theatre_status": "Closed",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 74 381 729"
        ],
        "notes": "50 Circular Road, Freetown. Open Mon-Fri 8AM-10PM.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 1
            },
            "maternity": {
                "total": 20,
                "available": 9
            },
            "pediatric": {
                "total": 20,
                "available": 7
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 9,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.52",
            "pregnancy": "0.57",
            "asthma": "0.90",
            "heart_attack": "0.50",
            "poisoning": "0.58",
            "child": "0.53",
            "surgery": "0.52"
        },
        "reliability_score": "4.7",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_002",
        "hospital_name": "People's Pharmacy",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.485,
        "longitude": -13.235,
        "phone": "076-617-296",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy",
                "Wholesale Medicine"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "076-617-296"
        ],
        "notes": "34 Regent Road, Freetown.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 15
            },
            "maternity": {
                "total": 20,
                "available": 4
            },
            "pediatric": {
                "total": 20,
                "available": 4
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 9,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.60",
            "pregnancy": "0.54",
            "asthma": "0.88",
            "heart_attack": "0.57",
            "poisoning": "0.56",
            "child": "0.52",
            "surgery": "0.55"
        },
        "reliability_score": "4.0",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_003",
        "hospital_name": "Rodyna Pharmacy",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.46,
        "longitude": -13.27,
        "phone": "+232 76 966 669",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 76 966 669"
        ],
        "notes": "29 Lower Pipe-Line, Off Wilkinson Road, Freetown.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 16
            },
            "maternity": {
                "total": 20,
                "available": 9
            },
            "pediatric": {
                "total": 20,
                "available": 7
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 9,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.51",
            "pregnancy": "0.53",
            "asthma": "0.82",
            "heart_attack": "0.57",
            "poisoning": "0.60",
            "child": "0.52",
            "surgery": "0.54"
        },
        "reliability_score": "4.2",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_004",
        "hospital_name": "Health For All Pharmacy",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.465,
        "longitude": -13.25,
        "phone": "+232 78 915 440",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "+232 78 915 440"
        ],
        "notes": "39 Old Railway Line, Brookfields, Freetown.",
        "email": "medfindsalone@gmail.com",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 17
            },
            "maternity": {
                "total": 20,
                "available": 7
            },
            "pediatric": {
                "total": 20,
                "available": 0
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 5,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.54",
            "pregnancy": "0.52",
            "asthma": "0.88",
            "heart_attack": "0.60",
            "poisoning": "0.58",
            "child": "0.56",
            "surgery": "0.58"
        },
        "reliability_score": "4.4",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_005",
        "hospital_name": "Welfare Pharmacy",
        "district": "Western Area Urban",
        "region": "Western Area",
        "latitude": 8.47,
        "longitude": -13.23,
        "phone": "099-314-400",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "099-314-400"
        ],
        "notes": "34 Wellington Street, Freetown.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 18
            },
            "maternity": {
                "total": 20,
                "available": 5
            },
            "pediatric": {
                "total": 20,
                "available": 4
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 6,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.57",
            "pregnancy": "0.57",
            "asthma": "0.81",
            "heart_attack": "0.53",
            "poisoning": "0.52",
            "child": "0.58",
            "surgery": "0.59"
        },
        "reliability_score": "5.0",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_006",
        "hospital_name": "Amsall Pharmaceuticals",
        "district": "Bombali",
        "region": "Northern Province",
        "latitude": 8.88,
        "longitude": -12.04,
        "phone": "076-699-842",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "076-699-842"
        ],
        "notes": "12 Ladies Mile, Makeni.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 8
            },
            "maternity": {
                "total": 20,
                "available": 1
            },
            "pediatric": {
                "total": 20,
                "available": 6
            },
            "icu": {
                "total": 5,
                "available": 0
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 10,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.55",
            "asthma": "0.90",
            "heart_attack": "0.55",
            "poisoning": "0.56",
            "child": "0.58",
            "surgery": "0.51"
        },
        "reliability_score": "4.6",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "pharm_007",
        "hospital_name": "C. C. C Pharmacy",
        "district": "Bombali",
        "region": "Northern Province",
        "latitude": 8.885,
        "longitude": -12.045,
        "phone": "076-723-288",
        "email": "medfindsalone@gmail.com",
        "facility_type": "Pharmacy",
        "static_bed_capacity": {
            "total": 0
        },
        "key_services": {
            "emergency": false,
            "surgery": false,
            "lab": false,
            "pharmacy": true,
            "other": [
                "Pharmacy"
            ]
        },
        "dynamic_availability": {
            "beds_available_now": 0,
            "oxygen_available": "No",
            "surgeons_on_duty": "No",
            "ambulance_available": "No",
            "last_updated_timestamp": "2025-12-20T10:00:00Z"
        },
        "emergency_numbers": [
            "076-723-288"
        ],
        "notes": "4 Rogbaneh Road, Makeni.",
        "beds_detailed": {
            "adult": {
                "total": 50,
                "available": 15
            },
            "maternity": {
                "total": 20,
                "available": 6
            },
            "pediatric": {
                "total": 20,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "unavailable",
            "obstetricians": "unavailable",
            "pediatricians": "unavailable",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "closed",
            "pediatrics": "closed",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": false,
            "er_queue_length": 6,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.60",
            "pregnancy": "0.55",
            "asthma": "0.85",
            "heart_attack": "0.51",
            "poisoning": "0.55",
            "child": "0.51",
            "surgery": "0.58"
        },
        "reliability_score": "4.9",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_ehb4sij83",
        "hospital_name": "Jui Government Hospital",
        "facility_type": "Government Secondary Hospital",
        "region": "Western Area",
        "district": "Western Area Rural",
        "latitude": 8.3846,
        "longitude": -13.167,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Jui Government Hospital, Western Area Rural",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.733Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Regional government hospital delivering general medicine, maternity, surgical, and emergency services to surrounding communities.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 16
            },
            "maternity": {
                "total": 15,
                "available": 3
            },
            "pediatric": {
                "total": 15,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "unavailable",
            "ventilators": "unavailable",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 0,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.52",
            "pregnancy": "0.92",
            "asthma": "0.56",
            "heart_attack": "0.51",
            "poisoning": "0.56",
            "child": "0.95",
            "surgery": "0.97"
        },
        "reliability_score": "4.8",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_no3o66443",
        "hospital_name": "Rokupa Government Hospital",
        "facility_type": "Government",
        "region": "Western Area",
        "district": "Western Area Urban",
        "latitude": 8.4833,
        "longitude": -13.1833,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Rokupa Government Hospital, Western Area Urban",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": false,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "No",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Not available",
            "last_updated_timestamp": "2026-02-25T21:52:12.735Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 0,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 0,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 0,
                "procedures": []
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Rokupa Government Hospital provides essential healthcare services to the Western Area Urban district.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 12
            },
            "maternity": {
                "total": 15,
                "available": 7
            },
            "pediatric": {
                "total": 15,
                "available": 8
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 0
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_call",
            "surgeons": "unavailable",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "closed",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 13,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.56",
            "pregnancy": "0.91",
            "asthma": "0.87",
            "heart_attack": "0.58",
            "poisoning": "0.52",
            "child": "0.92",
            "surgery": "0.59"
        },
        "reliability_score": "4.2",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_i1xa2omrl",
        "hospital_name": "Kabala Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Northern Province",
        "district": "Koinadugu",
        "latitude": 9.5833,
        "longitude": -11.55,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Kabala Government Hospital, Koinadugu",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.735Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Provides general medical treatment, emergency care, maternity services, and basic surgical procedures for the district population.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 3
            },
            "maternity": {
                "total": 15,
                "available": 0
            },
            "pediatric": {
                "total": 15,
                "available": 4
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "unavailable",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 13,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.58",
            "pregnancy": "0.90",
            "asthma": "0.81",
            "heart_attack": "0.59",
            "poisoning": "0.55",
            "child": "0.94",
            "surgery": "0.90"
        },
        "reliability_score": "4.9",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_0oelpjhmu",
        "hospital_name": "Magburaka Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Northern Province",
        "district": "Tonkolili",
        "latitude": 8.7167,
        "longitude": -11.95,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Magburaka Government Hospital, Tonkolili",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.735Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "District hospital delivering outpatient services, emergency care, maternity services, and routine surgical procedures.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 12
            },
            "maternity": {
                "total": 15,
                "available": 0
            },
            "pediatric": {
                "total": 15,
                "available": 6
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 0,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.51",
            "pregnancy": "0.97",
            "asthma": "0.85",
            "heart_attack": "0.52",
            "poisoning": "0.56",
            "child": "0.96",
            "surgery": "0.96"
        },
        "reliability_score": "4.7",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_h7gpor7yk",
        "hospital_name": "Kambia Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "North West Province",
        "district": "Kambia",
        "latitude": 9.1167,
        "longitude": -12.9167,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Kambia Government Hospital, Kambia",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.735Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Provides essential medical care including emergency services, maternity, pediatrics, and minor surgical procedures.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 3
            },
            "maternity": {
                "total": 15,
                "available": 4
            },
            "pediatric": {
                "total": 15,
                "available": 6
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 8,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.59",
            "pregnancy": "0.93",
            "asthma": "0.83",
            "heart_attack": "0.53",
            "poisoning": "0.54",
            "child": "0.92",
            "surgery": "0.98"
        },
        "reliability_score": "4.3",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_c9d96y2l9",
        "hospital_name": "Pujehun Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Southern Province",
        "district": "Pujehun",
        "latitude": 7.35,
        "longitude": -11.7167,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Pujehun Government Hospital, Pujehun",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.735Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Delivers emergency, maternity, pediatric, and general medical services to district residents.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 19
            },
            "maternity": {
                "total": 15,
                "available": 0
            },
            "pediatric": {
                "total": 15,
                "available": 1
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 4
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 13,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.92",
            "asthma": "0.89",
            "heart_attack": "0.57",
            "poisoning": "0.60",
            "child": "0.99",
            "surgery": "0.94"
        },
        "reliability_score": "4.6",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_0m02lco69",
        "hospital_name": "Moyamba Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Southern Province",
        "district": "Moyamba",
        "latitude": 8.1667,
        "longitude": -12.4333,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Moyamba Government Hospital, Moyamba",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.736Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Provides outpatient services, maternity care, inpatient treatment, and emergency services.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 18
            },
            "maternity": {
                "total": 15,
                "available": 9
            },
            "pediatric": {
                "total": 15,
                "available": 5
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 1,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.57",
            "pregnancy": "0.91",
            "asthma": "0.82",
            "heart_attack": "0.52",
            "poisoning": "0.54",
            "child": "0.95",
            "surgery": "0.93"
        },
        "reliability_score": "4.8",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_k3bj2jvrd",
        "hospital_name": "Bonthe Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Southern Province",
        "district": "Bonthe",
        "latitude": 7.5167,
        "longitude": -12.5,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Bonthe Government Hospital, Bonthe",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.736Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Offers primary and secondary healthcare services including maternity, inpatient, and emergency treatment.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 4
            },
            "maternity": {
                "total": 15,
                "available": 0
            },
            "pediatric": {
                "total": 15,
                "available": 7
            },
            "icu": {
                "total": 5,
                "available": 2
            },
            "observation": {
                "total": 10,
                "available": 1
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 3,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.56",
            "pregnancy": "0.95",
            "asthma": "0.89",
            "heart_attack": "0.53",
            "poisoning": "0.57",
            "child": "0.92",
            "surgery": "0.94"
        },
        "reliability_score": "4.2",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_62dkqfmdg",
        "hospital_name": "Segbwema Government Hospital",
        "facility_type": "Government District Hospital",
        "region": "Eastern Province",
        "district": "Kailahun",
        "latitude": 8,
        "longitude": -10.95,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Segbwema Government Hospital, Kailahun",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": false,
            "laboratory": false,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": false,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.736Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": false,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": false,
                "hematology": false,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Provides general medical treatment, maternity care, outpatient services, and emergency healthcare.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 12
            },
            "maternity": {
                "total": 15,
                "available": 3
            },
            "pediatric": {
                "total": 15,
                "available": 3
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 0
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "available",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "unavailable"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_call",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "closed",
            "lab": "closed",
            "pharmacy": "closed"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 4,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.55",
            "pregnancy": "0.92",
            "asthma": "0.84",
            "heart_attack": "0.51",
            "poisoning": "0.59",
            "child": "0.95",
            "surgery": "0.95"
        },
        "reliability_score": "4.6",
        "road_accessibility": "fair",
        "last_updated": "2026-03-23T17:53:14.642Z"
    },
    {
        "id": "hosp_sscwk1tti",
        "hospital_name": "Adventist Hospital",
        "facility_type": "Mission",
        "region": "Western Area",
        "district": "Western Area Rural",
        "latitude": 8.3361,
        "longitude": -13.0675,
        "phone": "+232 00 000000",
        "email": "medfindsalone@gmail.com",
        "address": "Adventist Hospital, Western Area Rural",
        "website": "",
        "emergency_numbers": [
            "117"
        ],
        "key_services": {
            "emergency": true,
            "maternity": true,
            "pediatrics": true,
            "surgery": true,
            "radiology": true,
            "laboratory": true,
            "blood_bank": false,
            "icu": false,
            "mental_health": false,
            "pharmacy": true,
            "dialysis": false,
            "outpatient": true,
            "other": false
        },
        "dynamic_availability": {
            "beds_available_now": 20,
            "surgeons_on_duty": "Yes",
            "blood_supply_units": 5,
            "oxygen_available": "Yes",
            "ambulance_available": "Yes",
            "icu_beds_available_now": 0,
            "operating_theatre_status": "Functional",
            "last_updated_timestamp": "2026-02-25T21:52:12.736Z"
        },
        "static_bed_capacity": {
            "total": 50,
            "icu": 0,
            "maternity": 15,
            "pediatric": 15,
            "adult": 20
        },
        "staffing": {
            "total_surgeons": 2,
            "nurses_on_shift": 10,
            "midwives": 5
        },
        "medical_specialists": {
            "general_practitioners": 3,
            "pediatricians": 1,
            "cardiologists": 0,
            "obstetricians": 1,
            "orthopedic_surgeons": 0,
            "anesthetists": 1,
            "radiologists": 0,
            "other": 2
        },
        "technology_services": {
            "imaging": {
                "x_ray": true,
                "ultrasound": true,
                "ct_scan": false,
                "mri": false
            },
            "laboratory": {
                "clinical_chemistry": true,
                "hematology": true,
                "microbiology": false
            },
            "surgical": {
                "operating_theatres": 1,
                "procedures": [
                    "General Surgery",
                    "C-section"
                ]
            },
            "critical_care": {
                "ventilators": 0,
                "patient_monitors": 2
            },
            "dialysis": {
                "available": false,
                "machines": 0
            },
            "pharmacy": {
                "24_hour": false,
                "emergency_medication": true,
                "prescription_filling": true
            },
            "other": {
                "ambulances": 1
            }
        },
        "infrastructure": {
            "power_status": "Grid + Solar",
            "backup_generator": true,
            "water_supply": "Borehole / Municipal",
            "24_hour_security": true,
            "parking": "Available",
            "wheelchair_accessibility": true
        },
        "notes": "Adventist Hospital provides essential healthcare services to the Western Area Rural district.",
        "beds_detailed": {
            "adult": {
                "total": 20,
                "available": 16
            },
            "maternity": {
                "total": 15,
                "available": 8
            },
            "pediatric": {
                "total": 15,
                "available": 1
            },
            "icu": {
                "total": 5,
                "available": 1
            },
            "observation": {
                "total": 10,
                "available": 2
            },
            "isolation": {
                "total": 5,
                "available": 1
            }
        },
        "equipment": {
            "oxygen": "available",
            "ventilators": "unavailable",
            "nebulizers": "available",
            "blood_bank": "limited",
            "lab_testing": "available",
            "pharmacy": "available",
            "imaging": {
                "ct": "unavailable",
                "mri": "unavailable",
                "x_ray": "available"
            }
        },
        "staff": {
            "emergency_doctors": "on_site",
            "surgeons": "on_site",
            "obstetricians": "on_site",
            "pediatricians": "on_site",
            "cardiologists": "unavailable",
            "nurses": "on_site"
        },
        "departments": {
            "surgery": "open",
            "maternity": "open",
            "pediatrics": "open",
            "radiology": "open",
            "lab": "closed",
            "pharmacy": "open"
        },
        "emergency_services": {
            "ambulance_available": true,
            "er_queue_length": 10,
            "trauma_center": false
        },
        "suitability": {
            "trauma": "0.53",
            "pregnancy": "0.96",
            "asthma": "0.81",
            "heart_attack": "0.57",
            "poisoning": "0.59",
            "child": "0.91",
            "surgery": "0.93"
        },
        "reliability_score": "4.2",
        "road_accessibility": "good",
        "last_updated": "2026-03-23T17:53:14.642Z"
    }
];

            let hospitals = [];

            return {
                init: async function () {
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

                getAllHospitals: function () {
                    return hospitals && hospitals.length > 0 ? hospitals : JSON.parse(JSON.stringify(FALLBACK_DATA));
                },

                getHospitalById: function (id) {
                    const list = this.getAllHospitals();
                    return list.find(h => h.id === id);
                },

                saveHospital: function (hospital) {
                    const index = hospitals.findIndex(h => h.id === hospital.id);
                    if (index !== -1) {
                        hospitals[index] = hospital;
                        localStorage.setItem('medfind_hospitals', JSON.stringify(hospitals));
                        return true;
                    }
                    return false;
                },

                hospitals: (function () {
                    // Ensure hospitals are available or use fallback
                    const data = (typeof hospitals !== 'undefined' && hospitals && hospitals.length > 0)
                        ? hospitals
                        : FALLBACK_DATA;
                    // Normalize for user fix script
                    return data.map(h => ({
                        ...h,
                        name: h.hospital_name || h.name,
                        address: h.address || h.district + ', ' + h.region,
                        lat: h.latitude || h.lat,
                        lng: h.longitude || h.lng,
                        contact: h.phone || h.contact
                    }));
                })(),

                FALLBACK_DATA: FALLBACK_DATA
            };
        })();
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.MedFindData;
    }
} catch (e) { if (e !== 'skip') console.error('data.js error:', e); }
