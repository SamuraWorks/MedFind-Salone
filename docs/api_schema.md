# MedFind Salone - API Schema & Documentation

## Base URL
```
Production: https://api.medfindsalone.sl/v1
Development: http://localhost:3000/api/v1
```

## Authentication
Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### 1. Get All Hospitals
**Endpoint:** `GET /hospitals`

**Description:** Retrieve all hospitals with optional filtering

**Query Parameters:**
- `district` (optional): Filter by district name
- `region` (optional): Filter by region
- `facility_type` (optional): Government | Private | NGO | Mission
- `service` (optional): Filter by available service (emergency, surgery, maternity, etc.)
- `beds_available` (optional): true | false - Only show hospitals with available beds
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
GET /hospitals?district=Western%20Area%20Urban&service=emergency&beds_available=true
```

**Example Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "hosp_001",
      "hospital_name": "Connaught Hospital",
      "district": "Western Area Urban",
      "region": "Western Area",
      "latitude": 8.4844,
      "longitude": -13.2344,
      "phone": "+232 76 123 456",
      "facility_type": "Government",
      "key_services": {
        "emergency": true,
        "surgery": true,
        "icu": true
      },
      "dynamic_availability": {
        "beds_available_now": 52,
        "oxygen_available": "Yes",
        "surgeons_on_duty": "Yes",
        "operating_theatre_status": "Functional",
        "ambulance_available": "Yes",
        "last_updated_timestamp": "2025-12-13T16:30:00Z"
      }
    }
  ],
  "timestamp": "2025-12-13T17:00:00Z"
}
```

---

### 2. Get Hospital by ID
**Endpoint:** `GET /hospitals/{id}`

**Description:** Retrieve detailed information for a specific hospital

**Path Parameters:**
- `id` (required): Hospital ID (e.g., hosp_001)

**Example Request:**
```bash
GET /hospitals/hosp_001
```

**Example Response:**
```json
{
  "success": true,
  "data": {
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
      "other": ["Internal Medicine", "Outpatient Services", "Pharmacy"]
    },
    "specialists_available": {
      "general_surgeon": 4,
      "obstetrician": 6,
      "pediatrician": 5,
      "anesthetist": 3,
      "radiologist": 2,
      "others": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"]
    },
    "dynamic_availability": {
      "beds_available_now": 52,
      "oxygen_available": "Yes",
      "surgeons_on_duty": "Yes",
      "operating_theatre_status": "Functional",
      "ambulance_available": "Yes",
      "last_updated_timestamp": "2025-12-13T16:30:00Z"
    },
    "emergency_numbers": ["+232 76 123 456", "+232 76 123 457"],
    "notes": "National referral hospital. Main trauma center for Freetown. 24/7 emergency services."
  },
  "timestamp": "2025-12-13T17:00:00Z"
}
```

---

### 3. Search Hospitals
**Endpoint:** `GET /search`

**Description:** Advanced search with location-based filtering

**Query Parameters:**
- `service` (optional): Service type (emergency, surgery, maternity, pediatrics, etc.)
- `latitude` (required for radius search): User's latitude
- `longitude` (required for radius search): User's longitude
- `radius` (optional): Search radius in kilometers (default: 10)
- `beds_available` (optional): true | false
- `oxygen_available` (optional): true | false
- `surgeons_on_duty` (optional): true | false
- `operating_theatre` (optional): Functional | Not Functional
- `ambulance_available` (optional): true | false
- `sort` (optional): distance | beds_available | name (default: distance)

**Example Request:**
```bash
GET /search?latitude=8.4844&longitude=-13.2344&radius=5&service=maternity&beds_available=true&sort=distance
```

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "search_params": {
    "latitude": 8.4844,
    "longitude": -13.2344,
    "radius": 5,
    "service": "maternity"
  },
  "data": [
    {
      "id": "hosp_002",
      "hospital_name": "Princess Christian Maternity Hospital (PCMH)",
      "distance_km": 0.8,
      "latitude": 8.4885,
      "longitude": -13.2205,
      "phone": "+232 76 000 002",
      "key_services": {
        "maternity": true,
        "emergency": true
      },
      "dynamic_availability": {
        "beds_available_now": 12,
        "oxygen_available": "Yes",
        "surgeons_on_duty": "On Call",
        "last_updated_timestamp": "2025-12-13T15:45:00Z"
      },
      "emergency_numbers": ["+232 76 000 002", "+232 30 555 001"]
    }
  ],
  "timestamp": "2025-12-13T17:00:00Z"
}
```

---

### 4. Get Nearest Hospital
**Endpoint:** `GET /nearest`

**Description:** Find the nearest hospital with emergency services

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `service` (optional): Specific service required (default: emergency)

**Example Request:**
```bash
GET /nearest?latitude=8.4844&longitude=-13.2344&service=emergency
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "hosp_001",
    "hospital_name": "Connaught Hospital",
    "distance_km": 0.2,
    "estimated_travel_time_minutes": 5,
    "latitude": 8.4844,
    "longitude": -13.2344,
    "phone": "+232 76 123 456",
    "emergency_numbers": ["+232 76 123 456", "+232 76 123 457"],
    "dynamic_availability": {
      "beds_available_now": 52,
      "oxygen_available": "Yes",
      "surgeons_on_duty": "Yes",
      "operating_theatre_status": "Functional",
      "ambulance_available": "Yes",
      "last_updated_timestamp": "2025-12-13T16:30:00Z"
    },
    "directions_url": "https://maps.google.com/?q=8.4844,-13.2344"
  },
  "timestamp": "2025-12-13T17:00:00Z"
}
```

---

### 5. Get Sync Data
**Endpoint:** `GET /sync`

**Description:** Get incremental updates since last sync (for offline-first apps)

**Query Parameters:**
- `last_sync` (required): ISO 8601 timestamp of last successful sync
- `device_id` (optional): Unique device identifier for tracking

**Example Request:**
```bash
GET /sync?last_sync=2025-12-13T10:00:00Z&device_id=abc123
```

**Example Response:**
```json
{
  "success": true,
  "sync_timestamp": "2025-12-13T17:00:00Z",
  "updates": {
    "hospitals_updated": [
      {
        "id": "hosp_001",
        "dynamic_availability": {
          "beds_available_now": 52,
          "oxygen_available": "Yes",
          "surgeons_on_duty": "Yes",
          "operating_theatre_status": "Functional",
          "ambulance_available": "Yes",
          "last_updated_timestamp": "2025-12-13T16:30:00Z"
        }
      }
    ],
    "hospitals_added": [],
    "hospitals_removed": []
  },
  "next_sync_recommended": "2025-12-13T18:00:00Z"
}
```

---

## Admin Endpoints (Authentication Required)

### 6. Admin Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate hospital staff/admin

**Request Body:**
```json
{
  "email": "admin@connaughthospital.sl",
  "password": "securepassword123",
  "hospital_id": "hosp_001"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_001",
      "name": "Dr. John Kamara",
      "email": "admin@connaughthospital.sl",
      "hospital_id": "hosp_001",
      "role": "admin"
    },
    "expires_at": "2025-12-14T17:00:00Z"
  }
}
```

---

### 7. Update Hospital Availability
**Endpoint:** `POST /update_availability`

**Description:** Update dynamic availability fields (admin only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "hospital_id": "hosp_001",
  "dynamic_availability": {
    "beds_available_now": 48,
    "oxygen_available": "Yes",
    "surgeons_on_duty": "Yes",
    "operating_theatre_status": "Functional",
    "ambulance_available": "No"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": {
    "hospital_id": "hosp_001",
    "dynamic_availability": {
      "beds_available_now": 48,
      "oxygen_available": "Yes",
      "surgeons_on_duty": "Yes",
      "operating_theatre_status": "Functional",
      "ambulance_available": "No",
      "last_updated_timestamp": "2025-12-13T17:05:00Z"
    },
    "updated_by": "user_001"
  },
  "timestamp": "2025-12-13T17:05:00Z"
}
```

---

### 8. Quick Update (One-Tap)
**Endpoint:** `POST /quick_update`

**Description:** Simplified endpoint for rapid status updates

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "hospital_id": "hosp_001",
  "field": "beds_available_now",
  "value": 45
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Quick update successful",
  "data": {
    "hospital_id": "hosp_001",
    "field": "beds_available_now",
    "old_value": 48,
    "new_value": 45,
    "last_updated_timestamp": "2025-12-13T17:10:00Z"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "HOSPITAL_NOT_FOUND",
    "message": "Hospital with ID hosp_999 not found",
    "details": null
  },
  "timestamp": "2025-12-13T17:00:00Z"
}
```

### Common Error Codes:
- `HOSPITAL_NOT_FOUND` (404): Hospital ID doesn't exist
- `INVALID_PARAMETERS` (400): Missing or invalid query parameters
- `UNAUTHORIZED` (401): Missing or invalid authentication token
- `FORBIDDEN` (403): User doesn't have permission for this action
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Rate Limiting

- **Public endpoints**: 100 requests per minute per IP
- **Admin endpoints**: 300 requests per minute per user
- **Sync endpoint**: 10 requests per minute per device

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702483200
```

---

## Database Schema (PostgreSQL)

### hospitals table
```sql
CREATE TABLE hospitals (
  id VARCHAR(20) PRIMARY KEY,
  hospital_name VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  facility_type VARCHAR(20) CHECK (facility_type IN ('Government', 'Private', 'NGO', 'Mission')),
  static_bed_capacity JSONB NOT NULL,
  average_occupancy_rates JSONB NOT NULL,
  key_services JSONB NOT NULL,
  specialists_available JSONB NOT NULL,
  emergency_numbers TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hospitals_district ON hospitals(district);
CREATE INDEX idx_hospitals_region ON hospitals(region);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST(ll_to_earth(latitude, longitude));
```

### dynamic_availability table
```sql
CREATE TABLE dynamic_availability (
  id SERIAL PRIMARY KEY,
  hospital_id VARCHAR(20) REFERENCES hospitals(id) ON DELETE CASCADE,
  beds_available_now INTEGER NOT NULL,
  oxygen_available VARCHAR(3) CHECK (oxygen_available IN ('Yes', 'No')),
  surgeons_on_duty VARCHAR(10) CHECK (surgeons_on_duty IN ('Yes', 'No', 'On Call')),
  operating_theatre_status VARCHAR(20) CHECK (operating_theatre_status IN ('Functional', 'Not Functional')),
  ambulance_available VARCHAR(3) CHECK (ambulance_available IN ('Yes', 'No')),
  last_updated_timestamp TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(50),
  UNIQUE(hospital_id)
);

CREATE INDEX idx_dynamic_hospital_id ON dynamic_availability(hospital_id);
CREATE INDEX idx_dynamic_updated ON dynamic_availability(last_updated_timestamp DESC);
```

### users table (Admin)
```sql
CREATE TABLE users (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  hospital_id VARCHAR(20) REFERENCES hospitals(id),
  role VARCHAR(20) CHECK (role IN ('admin', 'staff', 'super_admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_hospital ON users(hospital_id);
```

### sync_log table
```sql
CREATE TABLE sync_log (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(100),
  last_sync_timestamp TIMESTAMP NOT NULL,
  sync_status VARCHAR(20) CHECK (sync_status IN ('success', 'failed')),
  records_synced INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_device ON sync_log(device_id);
```

---

## WebSocket Support (Real-time Updates)

**Endpoint:** `wss://api.medfindsalone.sl/v1/ws`

**Description:** Real-time updates for hospital availability changes

**Connection:**
```javascript
const ws = new WebSocket('wss://api.medfindsalone.sl/v1/ws');

ws.onopen = () => {
  // Subscribe to specific hospital updates
  ws.send(JSON.stringify({
    action: 'subscribe',
    hospital_ids: ['hosp_001', 'hosp_002']
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Real-time update:', update);
};
```

**Update Message Format:**
```json
{
  "type": "availability_update",
  "hospital_id": "hosp_001",
  "changes": {
    "beds_available_now": {
      "old": 52,
      "new": 48
    }
  },
  "timestamp": "2025-12-13T17:15:00Z"
}
```

---

## Implementation Notes

### Offline-First Synchronization Strategy

1. **Initial Load**: Download complete hospital dataset on first app launch
2. **Local Storage**: Store in IndexedDB/SQLite for offline access
3. **Background Sync**: Check for updates every 30 minutes when online
4. **Differential Updates**: Only sync changed records using `last_sync` timestamp
5. **Conflict Resolution**: Server timestamp always wins for dynamic data

### Recommended Client Libraries

- **React Native**: `@react-native-async-storage/async-storage` + `watermelondb`
- **Web**: `localforage` or `Dexie.js` (IndexedDB wrapper)
- **Sync**: `workbox` (for service workers) or custom sync logic

---

*API Version: 1.0.0*  
*Last Updated: 2025-12-13*
