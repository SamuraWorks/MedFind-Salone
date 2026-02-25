# MedFind Salone - User Flow Diagrams

## 1. Patient/User Flows

### Flow A: Emergency Hospital Search (Critical Path)

```mermaid
flowchart TD
    A[User Opens App] --> B{Internet Available?}
    B -->|Yes| C[Load Latest Data from Server]
    B -->|No| D[Load from Local Database]
    C --> E[Show Home Screen]
    D --> E
    E --> F[User Taps 'EMERGENCY' Button]
    F --> G{GPS Permission?}
    G -->|Granted| H[Get User Location]
    G -->|Denied| I[Show Manual Location Entry]
    I --> J[User Enters Location]
    J --> H
    H --> K[Calculate Distances to All Hospitals]
    K --> L[Filter: Emergency Services Available]
    L --> M[Sort by Distance]
    M --> N[Display Nearest Hospital Card]
    N --> O{User Action?}
    O -->|Call| P[Dial Emergency Number]
    O -->|Directions| Q[Open Maps App with Coordinates]
    O -->|View Details| R[Show Full Hospital Profile]
    P --> END[Emergency Contact Made]
    Q --> END
    R --> O
```

**Key Features:**
- Works 100% offline after initial data load
- GPS-based automatic location detection
- One-tap emergency call
- Fallback to manual location entry

---

### Flow B: Search by Service (Maternity Example)

```mermaid
flowchart TD
    A[User on Home Screen] --> B[Taps 'Maternity' Service Card]
    B --> C{Location Available?}
    C -->|Yes| D[Show Hospitals with Maternity Services]
    C -->|No| E[Prompt for Location or Show All]
    E --> D
    D --> F[Display Results - Map View]
    F --> G{User Switches View?}
    G -->|List View| H[Show Scrollable Hospital Cards]
    G -->|Stay on Map| I[User Taps Hospital Pin]
    H --> J[User Taps Hospital Card]
    I --> K[Show Hospital Quick Info Popup]
    J --> L[Navigate to Hospital Detail Screen]
    K --> L
    L --> M{User Action?}
    M -->|Call| N[Dial Hospital]
    M -->|Directions| O[Open Maps]
    M -->|Add to Favorites| P[Save to Favorites List]
    M -->|Share| Q[Share Hospital Info via SMS/WhatsApp]
    N --> END[Action Completed]
    O --> END
    P --> END
    Q --> END
```

**Key Features:**
- Service-specific filtering
- Toggle between map and list views
- Favorites for quick access
- Social sharing capability

---

### Flow C: Filter & Advanced Search

```mermaid
flowchart TD
    A[User on Home Screen] --> B[Taps Search Bar]
    B --> C[Search Interface Opens]
    C --> D{Search Type?}
    D -->|By Name| E[Type Hospital Name]
    D -->|By Service| F[Select Service Filters]
    D -->|By Location| G[Select District/Region]
    D -->|Advanced| H[Open Advanced Filters]
    E --> I[Show Matching Results]
    F --> J[Apply Service Filters]
    G --> K[Apply Location Filters]
    H --> L[Multi-Filter Selection Panel]
    L --> M{Filter Options}
    M -->|Beds Available| N[Toggle: Only Show Available Beds]
    M -->|Oxygen Available| O[Toggle: Only Show Oxygen Available]
    M -->|Surgeons on Duty| P[Toggle: Surgeons Available]
    M -->|Operating Theatre| Q[Toggle: Functional Theatre]
    M -->|24/7 Service| R[Toggle: Open 24/7]
    N --> S[Combine All Active Filters]
    O --> S
    P --> S
    Q --> S
    R --> S
    J --> S
    K --> S
    S --> T[Display Filtered Results]
    T --> U[User Selects Hospital]
    U --> V[Navigate to Hospital Detail]
    I --> V
```

**Key Features:**
- Multiple filter combinations
- Real-time availability filtering
- District/region-based search
- Name-based quick search

---

### Flow D: Hospital Detail View & Actions

```mermaid
flowchart TD
    A[User Selects Hospital] --> B[Load Hospital Detail Screen]
    B --> C[Display Hospital Information]
    C --> D[Show Static Info: Name, Address, Services]
    C --> E[Show Dynamic Info: Beds, Oxygen, Surgeons]
    C --> F[Show Contact Info & Emergency Numbers]
    D --> G{User Action?}
    E --> G
    F --> G
    G -->|Call Hospital| H[Show Call Options]
    G -->|Get Directions| I[Launch Maps App]
    G -->|Share Hospital| J[Open Share Sheet]
    G -->|Add to Favorites| K[Save to Favorites]
    G -->|Report Issue| L[Open Report Form]
    H --> M{Which Number?}
    M -->|Main Line| N[Dial Main Number]
    M -->|Emergency Line| O[Dial Emergency Number]
    N --> END[Call Initiated]
    O --> END
    I --> P[Navigate with Google Maps/Waze]
    P --> END
    J --> Q{Share Via?}
    Q -->|SMS| R[Send Hospital Info via SMS]
    Q -->|WhatsApp| S[Send via WhatsApp]
    Q -->|Copy Link| T[Copy to Clipboard]
    R --> END
    S --> END
    T --> END
    K --> U[Add Star Icon & Save Locally]
    U --> END
    L --> V[User Fills Report: Incorrect Info/Closed/etc]
    V --> W{Internet Available?}
    W -->|Yes| X[Submit Report to Server]
    W -->|No| Y[Queue for Later Sync]
    X --> END
    Y --> END
```

**Key Features:**
- Multiple contact options
- Integrated navigation
- Social sharing
- User-generated reports for data quality
- Offline report queuing

---

### Flow E: Favorites & Recent Access

```mermaid
flowchart TD
    A[User Opens App] --> B[Taps 'Favorites' Tab]
    B --> C{Has Favorites?}
    C -->|Yes| D[Display Saved Hospitals]
    C -->|No| E[Show Empty State with Suggestion]
    E --> F[Suggest Adding Nearby Hospitals]
    D --> G[Show Distance from Current Location]
    G --> H[User Taps Favorite Hospital]
    H --> I[Navigate to Hospital Detail]
    
    A --> J[Taps 'Recent' Tab]
    J --> K{Has Recent History?}
    K -->|Yes| L[Display Recently Viewed Hospitals]
    K -->|No| M[Show Empty State]
    L --> N[Show Last Accessed Timestamp]
    N --> O[User Taps Recent Hospital]
    O --> I
    
    I --> P{User Action?}
    P -->|Remove from Favorites| Q[Confirm Removal]
    P -->|Call/Navigate| R[Standard Actions]
    Q --> S[Update Local Database]
    S --> T[Refresh Favorites List]
```

**Key Features:**
- Quick access to frequently used hospitals
- History tracking
- Distance updates based on current location

---

### Flow F: Multi-Language Support (English/Krio)

```mermaid
flowchart TD
    A[User Opens App First Time] --> B{Detect System Language}
    B -->|Krio/Other| C[Default to English]
    B -->|English| D[Set English]
    C --> E[Show Language Selector]
    D --> E
    E --> F[User Opens Settings]
    F --> G[Taps Language Option]
    G --> H{Select Language}
    H -->|English| I[Load English Strings]
    H -->|Krio| J[Load Krio Strings]
    I --> K[Update All UI Text]
    J --> K
    K --> L[Save Preference Locally]
    L --> M{Audio Prompts Enabled?}
    M -->|Yes| N[Load Audio Files for Selected Language]
    M -->|No| O[Text Only Mode]
    N --> P[App Ready in Selected Language]
    O --> P
```

**Key Features:**
- Automatic language detection
- Easy language switching
- Optional audio prompts for low-literacy users
- Persistent language preference

---

### Flow G: Offline Sync & Data Updates

```mermaid
flowchart TD
    A[App Running] --> B{Internet Connection?}
    B -->|No| C[Show Offline Banner]
    B -->|Yes| D[Check Last Sync Time]
    C --> E[Continue Using Local Data]
    E --> F[Display Last Updated Timestamp]
    D --> G{Sync Needed?}
    G -->|No - Recent Sync| H[Continue Normal Operation]
    G -->|Yes - Stale Data| I[Initiate Background Sync]
    I --> J[Call /sync API Endpoint]
    J --> K[Send Last Sync Timestamp]
    K --> L[Receive Differential Updates]
    L --> M{Updates Available?}
    M -->|Yes| N[Download Changed Records Only]
    M -->|No| O[Mark as Up-to-Date]
    N --> P[Update Local Database]
    P --> Q[Show Sync Success Notification]
    O --> Q
    Q --> R[Update Last Sync Timestamp]
    R --> H
    
    B -->|Connection Restored| S[Trigger Auto-Sync]
    S --> I
```

**Key Features:**
- Automatic background sync when online
- Differential updates (only changed data)
- Clear offline indicators
- Last updated timestamp display

---

## 2. Admin/Hospital Staff Flows

### Flow H: Admin Login & Authentication

```mermaid
flowchart TD
    A[Staff Opens Admin Panel] --> B[Show Login Screen]
    B --> C[Enter Email & Password]
    C --> D[Enter Hospital ID]
    D --> E[Tap Login Button]
    E --> F{Validate Credentials}
    F -->|Invalid| G[Show Error Message]
    F -->|Valid| H[Generate JWT Token]
    G --> B
    H --> I[Store Token Securely]
    I --> J[Load Admin Dashboard]
    J --> K[Display Hospital Name & Staff Info]
    K --> L{Token Expired?}
    L -->|Yes| M[Auto Logout]
    L -->|No| N[Continue Session]
    M --> B
    N --> O[Admin Actions Available]
```

**Key Features:**
- Secure JWT-based authentication
- Hospital-specific access control
- Auto-logout on token expiry

---

### Flow I: Update Dynamic Availability (Full Update)

```mermaid
flowchart TD
    A[Admin on Dashboard] --> B[Tap 'Update Availability']
    B --> C[Show Current Status Form]
    C --> D[Display All Dynamic Fields]
    D --> E{Admin Updates Fields}
    E -->|Beds Available| F[Enter Number of Available Beds]
    E -->|Oxygen Status| G[Toggle Yes/No]
    E -->|Surgeons on Duty| H[Select: Yes/No/On Call]
    E -->|Operating Theatre| I[Select: Functional/Not Functional]
    E -->|Ambulance Available| J[Toggle Yes/No]
    F --> K[Validate Input]
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L{Valid Data?}
    L -->|No| M[Show Validation Errors]
    L -->|Yes| N[Show Confirmation Dialog]
    M --> E
    N --> O{Confirm Update?}
    O -->|Cancel| C
    O -->|Confirm| P{Internet Available?}
    P -->|Yes| Q[POST to /update_availability]
    P -->|No| R[Queue Update Locally]
    Q --> S{API Response?}
    S -->|Success| T[Update Local Database]
    S -->|Error| U[Show Error & Retry Option]
    R --> V[Show 'Queued for Sync' Message]
    T --> W[Show Success Message]
    U --> O
    V --> W
    W --> X[Update Timestamp Display]
    X --> Y[Return to Dashboard]
```

**Key Features:**
- Comprehensive form for all dynamic fields
- Input validation
- Offline queue for updates
- Confirmation before submission

---

### Flow J: Quick Update (One-Tap Updates)

```mermaid
flowchart TD
    A[Admin on Dashboard] --> B[View Quick Update Panel]
    B --> C[Display Large Action Buttons]
    C --> D{Select Quick Action}
    D -->|Beds -5| E[Decrement Beds by 5]
    D -->|Beds +5| F[Increment Beds by 5]
    D -->|No Oxygen| G[Set Oxygen to 'No']
    D -->|Oxygen OK| H[Set Oxygen to 'Yes']
    D -->|No Ambulance| I[Set Ambulance to 'No']
    D -->|Ambulance OK| J[Set Ambulance to 'Yes']
    D -->|Theatre Down| K[Set Theatre to 'Not Functional']
    D -->|Theatre Up| L[Set Theatre to 'Functional']
    
    E --> M[Calculate New Bed Count]
    F --> M
    G --> N[Prepare Update Payload]
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    
    N --> O{Internet Available?}
    O -->|Yes| P[POST to /quick_update]
    O -->|No| Q[Queue Locally]
    P --> R{Success?}
    R -->|Yes| S[Update UI Immediately]
    R -->|No| T[Show Error Toast]
    Q --> S
    S --> U[Show Visual Feedback - Green Flash]
    T --> V[Retry Button Appears]
    U --> W[Update Timestamp]
    V --> D
    W --> B
```

**Key Features:**
- One-tap updates for common changes
- Immediate visual feedback
- Offline queuing
- No confirmation needed (speed priority)

---

### Flow K: Admin View Analytics & History

```mermaid
flowchart TD
    A[Admin on Dashboard] --> B[Tap 'View History']
    B --> C[Load Update History]
    C --> D[Display Timeline of Changes]
    D --> E[Show: Date, Time, Field, Old Value, New Value, Updated By]
    E --> F{Filter Options}
    F -->|By Date| G[Select Date Range]
    F -->|By Field| H[Select Specific Field]
    F -->|By User| I[Select Staff Member]
    G --> J[Apply Filters]
    H --> J
    I --> J
    J --> K[Display Filtered Results]
    K --> L{Export Data?}
    L -->|Yes| M[Generate CSV Report]
    L -->|No| N[Continue Viewing]
    M --> O[Download/Share CSV]
    O --> END[Return to Dashboard]
    N --> END
```

**Key Features:**
- Complete audit trail
- Filtering and search
- Export capability
- Accountability tracking

---

## 3. Emergency Mode Flows

### Flow L: SOS Emergency Mode

```mermaid
flowchart TD
    A[User in Distress] --> B[Opens App]
    B --> C[Taps Large Red 'SOS' Button]
    C --> D[Activate Emergency Mode]
    D --> E[Screen Turns Red with Pulsing Animation]
    E --> F{GPS Available?}
    F -->|Yes| G[Get Precise Location]
    F -->|No| H[Use Last Known Location]
    G --> I[Find Nearest Hospital with Emergency Services]
    H --> I
    I --> J[Display Hospital in Large Text]
    J --> K[Show Distance & Estimated Time]
    K --> L[Display Emergency Number in HUGE Font]
    L --> M{User Action - Auto-prompt after 3 seconds}
    M -->|Call Now| N[Auto-dial Emergency Number]
    M -->|Send Location SMS| O[Prepare SMS with Location]
    M -->|Get Directions| P[Launch Maps with Route]
    N --> Q[Call Connected]
    O --> R[Select Emergency Contact]
    R --> S[Send: 'EMERGENCY at [Hospital Name], [Address], [Maps Link]']
    P --> T[Turn-by-Turn Navigation Starts]
    Q --> END[Help on the Way]
    S --> END
    T --> END
```

**Key Features:**
- High-contrast emergency UI
- Auto-prompt for action
- One-tap emergency call
- Location sharing via SMS
- Works offline with cached data

---

### Flow M: Voice-Activated Emergency (Future Enhancement)

```mermaid
flowchart TD
    A[User Says 'Emergency Hospital'] --> B[Voice Recognition Activated]
    B --> C[Parse Voice Command]
    C --> D{Understand Intent?}
    D -->|Yes| E[Trigger Emergency Mode]
    D -->|No| F[Ask for Clarification - Audio Prompt]
    F --> G[User Repeats Command]
    G --> C
    E --> H[Speak: 'Finding nearest emergency hospital']
    H --> I[Get Location & Find Hospital]
    I --> J[Speak: 'Connaught Hospital, 0.5 kilometers away']
    J --> K[Speak: 'Say CALL to dial emergency number']
    K --> L{Voice Command?}
    L -->|'CALL'| M[Initiate Call]
    L -->|'DIRECTIONS'| N[Start Navigation]
    L -->|'DETAILS'| O[Read Hospital Info Aloud]
    M --> END[Call Connected]
    N --> END
    O --> K
```

**Key Features:**
- Hands-free operation
- Audio feedback in selected language
- Voice commands for actions
- Accessibility for visually impaired users

---

## 4. System Flows

### Flow N: First-Time App Setup

```mermaid
flowchart TD
    A[User Installs App] --> B[First Launch]
    B --> C[Show Welcome Screen]
    C --> D[Request Location Permission]
    D --> E{Permission Granted?}
    E -->|Yes| F[Request Notification Permission]
    E -->|No| G[Explain Why Location Needed]
    G --> H[Retry Permission Request]
    H --> E
    F --> I{Permission Granted?}
    I -->|Yes| J[Select Language: English/Krio]
    I -->|No| K[Continue Without Notifications]
    K --> J
    J --> L[Show Quick Tutorial - 3 Slides]
    L --> M[Slide 1: Search Hospitals]
    M --> N[Slide 2: Emergency Button]
    N --> O[Slide 3: Offline Access]
    O --> P{Internet Available?}
    P -->|Yes| Q[Download Complete Hospital Database]
    P -->|No| R[Load Bundled Offline Database]
    Q --> S[Show Download Progress]
    R --> T[Show 'Using Offline Data' Message]
    S --> U[Save to Local Database]
    T --> U
    U --> V[Mark Setup Complete]
    V --> W[Navigate to Home Screen]
```

**Key Features:**
- Permission requests with explanations
- Quick onboarding tutorial
- Automatic data download
- Bundled offline database as fallback

---

### Flow O: Background Sync Process

```mermaid
flowchart TD
    A[App in Background] --> B{Sync Interval Reached?}
    B -->|No| C[Wait]
    B -->|Yes| D{Internet Available?}
    C --> B
    D -->|No| E[Skip Sync Cycle]
    D -->|Yes| F[Wake Background Service]
    E --> C
    F --> G[Call /sync API]
    G --> H[Send Last Sync Timestamp]
    H --> I[Receive Updates]
    I --> J{Data Changed?}
    J -->|No| K[Update Sync Timestamp Only]
    J -->|Yes| L[Download Changed Records]
    L --> M[Update Local Database]
    M --> N{App in Foreground?}
    N -->|Yes| O[Refresh UI Immediately]
    N -->|No| P[Queue UI Refresh for Next Open]
    K --> Q[Log Sync Success]
    O --> Q
    P --> Q
    Q --> R{Show Notification?}
    R -->|Important Update| S[Push Notification: 'Hospital Data Updated']
    R -->|Minor Update| T[Silent Update]
    S --> END[Sync Complete]
    T --> END
```

**Key Features:**
- Periodic background sync (every 30 min)
- Battery-efficient (only when online)
- Smart notifications
- UI refresh handling

---

## User Journey Summary

### Critical User Journeys (Must Work Offline)

1. **Emergency Search**: Home → Emergency Button → Nearest Hospital → Call (3 taps)
2. **Service Search**: Home → Service Card → Hospital List → Details → Call (4 taps)
3. **Favorites Access**: Home → Favorites → Hospital → Call (3 taps)

### Average Time to Emergency Contact
- **Target**: < 10 seconds from app open to call initiated
- **Offline**: 100% functional
- **Online**: Enhanced with real-time availability

---

*Document Version: 1.0*  
*Last Updated: 2025-12-13*
