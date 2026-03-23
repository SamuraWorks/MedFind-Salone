# 🏥 MedFind Salone - Emergency Hospital Finder for Sierra Leone

**Offline-first, life-saving mobile web application connecting Sierra Leoneans to emergency medical services**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-hackathon_ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Technical Architecture](#technical-architecture)
- [Hospital Dataset](#hospital-dataset)
- [API Documentation](#api-documentation)
- [User Flows](#user-flows)
- [Offline Functionality](#offline-functionality)
- [Multi-Language Support](#multi-language-support)
- [For Judges & Evaluators](#for-judges--evaluators)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**MedFind Salone** addresses a critical challenge in Sierra Leone's healthcare system: **finding emergency medical services quickly, even without internet access.**

### The Problem
- Limited access to real-time hospital information
- Unreliable internet connectivity, especially in rural areas
- No centralized database of hospital services and availability
- Time wasted during medical emergencies searching for available facilities

### Our Solution
A **progressive web application** (PWA) that:
- ✅ Works 100% offline after initial data load
- ✅ Uses GPS to find nearest hospitals with specific services
- ✅ Provides real-time availability (beds, oxygen, surgeons, ambulances)
- ✅ Supports both English and Krio languages
- ✅ One-tap emergency calling and navigation
- ✅ Admin panel for hospital staff to update availability

---

## ⚡ Key Features

### For Patients & Public

#### 🚨 Emergency SOS Mode
- **One-tap emergency access** to nearest hospital
- **Auto-location detection** with fallback to manual entry
- **Large, accessible buttons** for calling and navigation
- **High-contrast red UI** for visibility in distress situations

#### 🔍 Smart Search & Filtering
- Search by hospital name, district, or services
- Filter by:
  - Beds available
  - Oxygen availability
  - Surgeons on duty
  - Operating theatre status
  - Ambulance availability
  - District/region

#### 🗺️ Dual View Modes
- **List View**: Scrollable cards with distance and availability
- **Map View**: Visual representation with hospital pins

#### ⭐ Favorites & History
- Save frequently accessed hospitals
- Quick access to recent searches
- Offline storage of preferences

#### 🌍 Multi-Language
- **English** (default)
- **Krio** (Sierra Leone Creole)
- Future: Mende, Temne, Limba

#### 📱 Progressive Web App
- Install on home screen
- Works like a native app
- Offline-first with automatic sync
- Low data usage (differential updates only)

### For Hospital Administrators

#### 🎛️ Admin Dashboard
- Secure login per hospital
- Real-time availability updates
- **Quick update buttons** for common changes
- **Full update form** for comprehensive data entry
- Update history and audit trail

#### ⚡ One-Tap Quick Updates
- ✓/✗ Oxygen Available
- ✓/✗ Ambulance Available
- ✓/✗ Operating Theatre Status
- +/- Bed Adjustments (increment/decrement by 5)

#### 📊 Analytics & Reporting
- View update history
- Track changes over time
- Export data to CSV

#### 📡 Offline Queue
- Updates queued when offline
- Automatic sync when connection restored
- No data loss guarantee

---

## 🎮 Live Demo

### Patient App
**Open:** `app.html` in any modern browser

**Quick Demo Steps:**
1. Click "SOS - FIND HELP NOW" to see emergency mode
2. Use quick service buttons (Emergency, Maternity, Surgery)
3. Try the search bar: "Connaught" or "Freetown"
4. Apply filters for beds, oxygen, surgeons
5. Click any hospital card to view full details
6. Test call and directions buttons
7. Switch language to Krio (top-right buttons)

### Admin Panel
**Open:** `design/admin_interface.html`

---

> ⚠️ **Final Maintainer Note:** The `admin.html` and `app.html` (the patient-facing pages) are critical to the project's offline-first guarantees.
> Do **not** change their structure, IDs, classes, asset links, or offline hooks without explicit coordination. All designs and page contents must be preserved exactly to ensure full offline functionality.
> If changes are necessary, update the service worker, run visual regression tests, and confirm end-to-end offline behavior before merging.

**Demo Features:**
- Quick update buttons
- Full availability form
- Update history table
- Offline mode simulation (disconnect internet)

### UI Mockups
**Open:** `design/mockups.html`

Visual designs for all screens and user flows

---

## 📁 Project Structure

```
MedFind_Salone/
├── 📄 app.html                          # Main patient-facing application
├── 🎨 app-styles.css                    # Application styling
├── ⚙️ app-script.js                     # Application logic & offline sync
├── 📖 README.md                         # This file
├── 📝 BLUEPRINT.md                      # Project overview & roadmap
│
├── 📊 data/
│   ├── hospitals_complete.json          # Full dataset (12 hospitals)
│   └── hospitals_complete.csv           # CSV export
│
├── 🎨 design/
│   ├── mockups.html                     # Patient UI mockups
│   └── admin_interface.html             # Admin panel mockup
│
├── 📚 docs/
│   ├── api_schema.md                    # Complete API documentation
│   ├── architecture.md                  # Technical architecture
│   ├── user_flows.md                    # User journey diagrams
│   └── offline_sync_implementation.md   # Sync logic & code samples
│
└── 🚀 (Future: React Native mobile app)
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required for demo
- For production: Node.js 18+ (optional)

### Quick Start (Demo)

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/MedFind_Salone.git
   cd MedFind_Salone
   ```

2. **Open in Browser**
   ```bash
   # Open app.html directly
   # OR use a simple HTTP server (recommended)
   
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

3. **Access**
   - Patient App: `http://localhost:8000/app.html`
   - Admin Panel: `http://localhost:8000/design/admin_interface.html`

### For Mobile Testing

1. **Enable Developer Mode** on your phone
2. **Use ngrok** or similar for HTTPS tunnel
   ```bash
   npx ngrok http 8000
   ```
3. **Visit** the ngrok URL on your mobile device
4. **Add to Home Screen** for full PWA experience

---

## 🏗️ Technical Architecture

### Frontend Stack
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No framework dependencies (lightweight)
- **LocalStorage** - Offline data persistence
- **Geolocation API** - GPS positioning

### Database (Local)
- **LocalStorage** for offline hospital data
- **JSON** format for easy parsing
- **Indexed** by hospital ID
- **Searchable** across all fields

### Sync Strategy
- **Initial Load**: Download complete dataset (~50KB)
- **Storage**: Persist in LocalStorage
- **Updates**: Check server every 30 minutes when online
- **Differential Sync**: Only download changed records
- **Conflict Resolution**: Server timestamp always wins

### Backend (Proposed)
- **Supabase** (PostgreSQL + Edge Functions)
- **REST API** with JWT authentication
- **WebSocket** for real-time updates (optional)
- **Cloudflare Workers** for edge caching

### Maps Integration
- **Google Maps** (current prototype)
- **Future**: Mapbox GL with offline tiles

---

## 📊 Hospital Dataset

### Coverage
**12 Major Hospitals** across Sierra Leone:

#### Western Area (7 hospitals)
1. **Connaught Hospital** - National referral, trauma center
2. **Princess Christian Maternity Hospital** - Specialized maternity
3. **Ola During Children's Hospital** - Pediatric care
4. **34 Military Hospital** - Military & civilian
5. **Choithram Memorial Hospital** - Private, advanced diagnostics
6. **China-Sierra Leone Friendship Hospital** - Modern facility
7. **Waterloo Hospital** - Mission hospital

#### Provincial (5 hospitals)
8. **Bo Government Hospital** - Southern Province
9. **Kenema Government Hospital** - Eastern Province (Lassa unit)
10. **Makeni Government Hospital** - Northern Province
11. **Koidu Government Hospital** - Kono District
12. **Port Loko Government Hospital** - Port Loko District

### Data Fields (per hospital)

#### Static Information
- Hospital name, district, region
- GPS coordinates (latitude, longitude)
- Contact (phone, email, website)
- Facility type (Government/Private/NGO/Mission)
- Static bed capacity (total, adult, maternity, pediatric, ICU)
- Average occupancy rates
- Services available (emergency, surgery, maternity, etc.)
- Specialists on staff (surgeons, obstetricians, etc.)
- Emergency contact numbers

#### Dynamic Availability (Updated by Admins)
- Beds available NOW
- Oxygen available (Yes/No)
- Surgeons on duty (Yes/No/On Call)
- Operating theatre status (Functional/Not Functional)
- Ambulance available (Yes/No)
- Last updated timestamp

### Data Sources
- Ministry of Health & Sanitation (Sierra Leone)
- World Health Organization (WHO) reports
- Hospital websites & public records
- On-ground verification (recommended before production)

---

## 🔌 API Documentation

**Full documentation:** `docs/api_schema.md`

### Public Endpoints

#### Get All Hospitals
```http
GET /hospitals?district=Western%20Area&service=emergency
```

#### Search by Location
```http
GET /search?latitude=8.4844&longitude=-13.2344&radius=5&service=maternity
```

#### Find Nearest Hospital
```http
GET /nearest?latitude=8.4844&longitude=-13.2344&service=emergency
```

#### Sync Updates
```http
GET /sync?last_sync=2025-12-13T10:00:00Z
```

### Admin Endpoints (Authenticated)

#### Login
```http
POST /auth/login
{
  "email": "admin@hospital.sl",
  "password": "***",
  "hospital_id": "hosp_001"
}
```

#### Update Availability
```http
POST /update_availability
Authorization: Bearer <token>
{
  "hospital_id": "hosp_001",
  "dynamic_availability": {
    "beds_available_now": 48,
    "oxygen_available": "Yes",
    ...
  }
}
```

#### Quick Update
```http
POST /quick_update
Authorization: Bearer <token>
{
  "hospital_id": "hosp_001",
  "field": "beds_available_now",
  "value": 45
}
```

---

## 🧭 User Flows

**Full diagrams:** `docs/user_flows.md`

### Critical User Journeys

#### Emergency Search (3 taps)
1. Open app
2. Tap "SOS - FIND HELP NOW"
3. Tap "CALL NOW" or "GET DIRECTIONS"

**Target Time:** < 10 seconds from app open to call initiated

#### Service Search (4 taps)
1. Open app
2. Tap service card (e.g., "Maternity")
3. Tap hospital card
4. Tap "Call" or "Directions"

#### Admin Update (2 taps)
1. Login to admin panel
2. Tap quick update button (e.g., "NO OXYGEN")

---

## 📡 Offline Functionality

### How It Works

1. **First Launch**
   - Download complete hospital database (50KB)
   - Store in LocalStorage
   - Enable geolocation

2. **Offline Use**
   - All searches work locally
   - Distance calculations use cached GPS
   - No network requests needed

3. **When Online**
   - Background sync every 30 minutes
   - Download only changed records
   - Update local database
   - Show "last synced" timestamp

4. **Admin Offline**
   - Queue updates locally
   - Show "pending sync" indicator
   - Auto-upload when connection restored

### Implementation Details

**See:** `docs/offline_sync_implementation.md` for production-ready code

---

## 🌍 Multi-Language Support

### Current Languages
- **English** (en) - Default
- **Krio** (kr) - Sierra Leone Creole

### Translation Coverage
- All UI labels and buttons
- Search placeholders
- System messages
- Service names

### Adding New Languages

1. Edit `app-script.js`
2. Add translation object:
   ```javascript
   translations.tem = {
     emergency_mode: 'EMERGENCY MODE',
     subtitle: 'Subtitle in Temne',
     ...
   }
   ```
3. Add language button in `app.html`

---

## 🏆 For Judges & Evaluators

### Hackathon Readiness Checklist

#### ✅ Complete Deliverables
- [x] National hospital dataset (JSON + CSV)
- [x] Fully functional web demo
- [x] Admin panel mockup
- [x] API schema documentation
- [x] Technical architecture document
- [x] User flow diagrams
- [x] Offline sync implementation guide
- [x] Multi-language support

#### ✅ Technical Demonstration
- [x] Works 100% offline
- [x] GPS-based distance calculation
- [x] Real-time search and filtering
- [x] Emergency mode with one-tap calling
- [x] Responsive mobile design
- [x] Language switching

#### ✅ Innovation Points
- **Offline-first** design for low-connectivity areas
- **Life-saving** emergency features
- **Dual interface** (patient + admin)
- **Real-time availability** tracking
- **Localized** for Sierra Leone (Krio support)
- **Scalable** to other countries

### Live Demo Script (5 minutes)

1. **Opening** (30s)
   - Problem: Finding hospitals in emergencies without internet
   - Solution: Offline-first mobile app

2. **Patient Demo** (2min)
   - Emergency SOS button
   - GPS-based nearest hospital
   - Service filtering (maternity, surgery)
   - Hospital detail view
   - One-tap call & navigation

3. **Admin Demo** (1min)
   - Quick update buttons
   - Offline queue demonstration

4. **Technical Highlights** (1min)
   - Show offline banner
   - Demonstrate LocalStorage data
   - Explain sync strategy

5. **Impact & Scale** (30s)
   - 12 hospitals, expandable to 100+
   - Target: 1M+ Sierra Leoneans
   - Lives saved in emergencies

### Testing Scenarios

#### Test Case 1: Emergency Search
1. Open app
2. Click SOS button
3. Verify nearest hospital shown
4. Test call button (should dial emergency number)

#### Test Case 2: Offline Mode
1. Disconnect internet
2. Refresh app
3. Verify all features work
4. Check "offline" banner appears

#### Test Case 3: Filtering
1. Click "Maternity" service
2. Apply "Beds Available" filter
3. Select specific district
4. Verify results update correctly

#### Test Case 4: Language Switch
1. Click "KR" button (top-right)
2. Verify UI updates to Krio
3. Switch back to "EN"

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-3) ✅ COMPLETE
- [x] Hospital dataset collection
- [x] Patient web app
- [x] Admin interface design
- [x] Offline functionality
- [x] Multi-language support

### Phase 2: Mobile App (Weeks 4-6)
- [ ] React Native implementation
- [ ] iOS & Android builds
- [ ] Push notifications
- [ ] Map integration with offline tiles

### Phase 3: Backend & Scale (Weeks 7-9)
- [ ] Supabase backend deployment
- [ ] Real-time sync
- [ ] User authentication
- [ ] Admin portal full implementation

### Phase 4: Enhanced Features (Weeks 10-12)
- [ ] SMS integration for feature phones
- [ ] USSD access (*###)
- [ ] Voice commands for low-literacy users
- [ ] Ambulance dispatch integration

### Phase 5: National Rollout (Months 4-6)
- [ ] Expand to 100+ hospitals
- [ ] Partner with Ministry of Health
- [ ] Community health worker training
- [ ] Public awareness campaign

---

## 🤝 Contributing

We welcome contributions from:
- **Healthcare Professionals** - Validate and expand hospital data
- **Developers** - Improve features and fix bugs
- **Designers** - Enhance UI/UX
- **Translators** - Add more languages (Mende, Temne, Limba)
- **Data Collectors** - Verify hospital information

### How to Contribute

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Contact & Support

- **Project Lead:** [Your Name]
- **Email:** info@medfindsalone.sl
- **GitHub:** [Repository URL]
- **Demo:** [Live Demo URL]

---

## 🙏 Acknowledgments

- **Ministry of Health & Sanitation, Sierra Leone**
- **World Health Organization (WHO)**
- **All hospital staff** providing data
- **Open source community**

---

## 📊 Impact Metrics (Goals)

- **10,000+** app installs in first 3 months
- **70%+** offline usage rate
- **<10 seconds** average time to emergency contact
- **100+** hospitals by end of year 1
- **Lives saved:** Immeasurable 💙

---

**Built with ❤️ for Sierra Leone**

*Making healthcare accessible, one tap at a time.*
#   M e d F i n d - S a l o n e 
 
 