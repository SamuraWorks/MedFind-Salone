// MedFind Salone - Application JavaScript (Google Maps Integrated)
// Complete offline-first hospital finder

(function () {
    // Global State
    let hospitals = [];
    let currentHospitals = [];
    let userLocation = null;
    let favorites = [];
    let currentLanguage = 'en';
    let currentFilters = {
        service: null,
        bedsAvailable: false,
        oxygenAvailable: false,
        surgeonsOnDuty: false,
        ambulanceAvailable: false,
        district: ''
    };

    // Map State
    let mapInstance = null;
    let mapMarkers = [];
    let mapViewActive = false;

    // Detail State
    let currentDetailHospital = null;

    // Translations
    const translations = {
        en: {
            emergency_mode: '🚨 EMERGENCY MODE',
            subtitle: 'Find Emergency Medical Services Offline',
            sos: 'SOS - FIND HELP NOW',
            search_placeholder: 'Search hospitals by name, district, or services...',
            quick_services: 'Quick Services',
            emergency: 'Emergency',
            maternity: 'Maternity',
            surgery: 'Surgery',
            pediatrics: 'Pediatrics',
            pharmacy: 'Pharmacy',
            all_hospitals: 'All Hospitals',
            nearby_hospitals: 'Nearby Hospitals',
            beds_available: 'Beds Available',
            oxygen_available: 'Oxygen Available',
            surgeons_on_duty: 'Surgeons on Duty',
            ambulance: 'Ambulance Available',
            home: 'Home',
            favorites: 'Favorites'
        },
        kr: {
            emergency_mode: '🚨 EMERGENCY MODE',
            subtitle: 'Fɛn Hospital Dɛn We Yu Nɔ Nid Intanɛt',
            sos: 'SOS - FƐNƐ HɛLP NƆNƆW',
            search_placeholder: 'Fɛn hospital bay nem, distrikt, ɔ savis...',
            quick_services: 'Kwik Savis Dɛn',
            emergency: 'Emergency',
            maternity: 'Pikin Bon',
            surgery: 'Wok',
            pediatrics: 'Pikin Dɔkta',
            pharmacy: 'Famesi',
            all_hospitals: 'Ɔl Hospital Dɛn',
            nearby_hospitals: 'Hospital Dɛn We De Ya So',
            beds_available: 'Bed Dɛn We De',
            oxygen_available: 'Oxygen De',
            surgeons_on_duty: 'Dɔkta Dɛn De',
            ambulance: 'Ambulans De',
            home: 'Om',
            favorites: 'Favorites'
        }
    };

    // Initialize App
    async function initApp() {
        console.log('🚀 Initializing MedFind Salone...');

        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('app');

        try {
            if (loadingScreen) loadingScreen.style.display = 'flex';

            if (window.self !== window.top) {
                const header = document.querySelector('.app-header');
                if (header) header.style.display = 'none';
                document.body.style.paddingTop = '10px';
            }

            await loadHospitalsData();
            loadFavorites();
            getCurrentLocation();
            populateDistrictFilter();
            checkOnlineStatus();

            window.addEventListener('online', checkOnlineStatus);
            window.addEventListener('offline', checkOnlineStatus);
            setupLanguageSelector();

            if (Array.isArray(hospitals)) {
                displayHospitals(hospitals);
            } else {
                hospitals = [];
                displayHospitals([]);
            }

            console.log('✅ App initialized with', hospitals.length, 'hospitals');
        } catch (error) {
            console.error('❌ Critical Initialization Error:', error);
        } finally {
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                if (appContainer) appContainer.style.display = 'block';
            }, 100);
        }
    }

    async function loadHospitalsData() {
        try {
            const data = await window.MedFindData.init();
            if (data && Array.isArray(data) && data.length > 0) {
                hospitals = data;
            } else {
                hospitals = window.MedFindData.getAllHospitals();
            }
            currentHospitals = [...hospitals];
        } catch (error) {
            hospitals = window.MedFindData.getAllHospitals() || [];
            currentHospitals = [...hospitals];
        }
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    calculateDistances();
                    displayHospitals(currentHospitals);
                },
                error => {
                    userLocation = { latitude: 8.4844, longitude: -13.2344 };
                    calculateDistances();
                    displayHospitals(currentHospitals);
                }
            );
        } else {
            userLocation = { latitude: 8.4844, longitude: -13.2344 };
            calculateDistances();
            displayHospitals(currentHospitals);
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
    }

    function calculateDistances() {
        if (!userLocation) return;
        hospitals.forEach(h => {
            h.distance = calculateDistance(userLocation.latitude, userLocation.longitude, h.latitude, h.longitude);
        });
        hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    function displayHospitals(hospitalsToDisplay) {
        const container = document.getElementById('hospitalList');
        if (!container) return;
        container.innerHTML = '';

        if (hospitalsToDisplay.length === 0) {
            container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280; width: 100%;">
                <p style="font-size: 48px; margin-bottom: 15px;">🏥</p>
                <p style="font-size: 18px; font-weight: 600;">No hospitals found</p>
                <p style="font-size: 14px; margin-top: 10px;">Try adjusting your filters</p>
            </div>`;
            const countEl = document.getElementById('resultCount');
            if (countEl) countEl.textContent = '0';
            return;
        }

        hospitalsToDisplay.forEach(h => container.appendChild(createHospitalCard(h)));
        const countEl = document.getElementById('resultCount');
        if (countEl) countEl.textContent = hospitalsToDisplay.length;

        if (mapViewActive && mapInstance) updateMapMarkers(hospitalsToDisplay);
        const mapCountEl = document.getElementById('mapHospitalCount');
        if (mapCountEl) mapCountEl.textContent = hospitalsToDisplay.length;
    }

    function switchView(view) {
        const listBtn = document.getElementById('listViewBtn');
        const mapBtn = document.getElementById('mapViewBtn');
        const listContainer = document.getElementById('hospitalsContainer');
        const mapContainer = document.getElementById('mapContainer');

        if (view === 'list') {
            if (listBtn) listBtn.classList.add('active');
            if (mapBtn) mapBtn.classList.remove('active');
            if (listContainer) listContainer.style.display = 'block';
            if (mapContainer) mapContainer.style.display = 'none';
            mapViewActive = false;
        } else {
            if (listBtn) listBtn.classList.remove('active');
            if (mapBtn) mapBtn.classList.add('active');
            if (listContainer) listContainer.style.display = 'none';
            if (mapContainer) mapContainer.style.display = 'block';
            mapViewActive = true;

            if (!mapInstance) {
                initMap();
            } else if (typeof google !== 'undefined') {
                google.maps.event.trigger(mapInstance, 'resize');
                updateMapMarkers(currentHospitals);
            }
        }
    }

    function initMap() {
        const placeholder = document.querySelector('.map-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        let mapDiv = document.getElementById('appMap');
        if (!mapDiv) {
            mapDiv = document.createElement('div');
            mapDiv.id = 'appMap';
            mapDiv.style.height = '100%';
            mapDiv.style.width = '100%';
            mapDiv.style.minHeight = '500px';
            mapDiv.style.borderRadius = '12px';
            const container = document.getElementById('mapContainer');
            if (container) container.appendChild(mapDiv);
            else return;
        }

        const center = userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 8.4844, lng: -13.2344 };
        if (typeof google !== 'undefined' && google.maps) {
            mapInstance = new google.maps.Map(mapDiv, {
                center: center,
                zoom: userLocation ? 11 : 8,
                mapTypeId: 'roadmap'
            });

            if (userLocation) {
                new google.maps.Marker({
                    position: center,
                    map: mapInstance,
                    title: "You are here",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#2563eb", fillOpacity: 1, strokeWeight: 2, strokeColor: "white"
                    }
                });
            }
            updateMapMarkers(currentHospitals);
        } else {
            const container = document.getElementById('mapContainer');
            if (container) container.innerHTML = '<div style="text-align: center; padding: 40px;">Google Maps loading... If this persists, check connection or API key.</div>';
        }
    }

    function updateMapMarkers(hospitalsToDisplay) {
        if (!mapInstance || typeof google === 'undefined') return;
        mapMarkers.forEach(m => m.setMap(null));
        mapMarkers = [];
        const bounds = new google.maps.LatLngBounds();

        hospitalsToDisplay.forEach(h => {
            if (!h.latitude || !h.longitude) return;
            const avail = h.dynamic_availability || {};
            const isAvailable = avail.oxygen_available === 'Yes';
            const markerColor = isAvailable ? '#10b981' : '#ef4444';

            const marker = new google.maps.Marker({
                position: { lat: h.latitude, lng: h.longitude },
                map: mapInstance,
                title: h.hospital_name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: markerColor,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8
                }
            });

            const content = `
                <div style="min-width: 250px; font-family: sans-serif; padding: 5px; color: #333;">
                    <h3 style="margin: 0 0 5px 0; color: #2563eb; font-size: 16px;">${h.hospital_name}</h3>
                    <div style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #4b5563; display: inline-block;">${h.facility_type}</div>
                    <p style="margin: 0 0 5px 0; font-size: 12px; line-height: 1.4; color: #374151;">
                        <strong>District:</strong> ${h.district}<br>
                        ${h.distance ? '<strong>Distance:</strong> ' + h.distance + ' km away<br>' : ''}
                        <strong>Address:</strong> ${h.address || (h.district + ', ' + h.region)}
                    </p>
                    <div style="display: flex; align-items: center; gap: 8px; border-top: 1px solid #eee; padding-top: 8px; margin-bottom: 10px;">
                        <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: ${avail.beds_available_now > 0 ? '#10b981' : '#ef4444'}">
                            ${avail.beds_available_now || 0} Beds
                        </span>
                        <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: ${avail.oxygen_available === 'Yes' ? '#10b981' : '#ef4444'}">
                            O₂ ${avail.oxygen_available === 'Yes' ? '✓' : '✗'}
                        </span>
                    </div>
                    <button onclick="window.PatientAppDetail.show('${h.id}')" 
                        style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                        View Full Profile
                    </button>
                </div>`;

            const infoWindow = new google.maps.InfoWindow({ content: content });
            marker.addListener('click', () => infoWindow.open(mapInstance, marker));
            bounds.extend(marker.getPosition());
            mapMarkers.push(marker);
        });

        if (hospitalsToDisplay.length > 0) mapInstance.fitBounds(bounds);
    }

    // Bridge for InfoWindow button
    window.PatientAppDetail = {
        show: function (id) {
            const h = window.MedFindData.getHospitalById(id);
            if (h) showHospitalDetail(h);
        }
    };

    function createHospitalCard(hospital) {
        const card = document.createElement('div');
        card.className = 'hospital-card';
        card.onclick = () => showHospitalDetail(hospital);

        const isFavorite = favorites.includes(hospital.id);
        const avail = hospital.dynamic_availability || {};

        card.innerHTML = `
            <div class="hospital-card-header">
                <div>
                    <div class="hospital-name">${hospital.hospital_name}</div>
                    <span class="hospital-type">${hospital.facility_type}</span>
                </div>
                <div class="hospital-distance">
                    ${hospital.distance ? hospital.distance + ' km' : ''}
                </div>
            </div>
            <div class="hospital-info">
                <div class="info-row">📍 ${hospital.district}, ${hospital.region}</div>
                <div class="info-row">📞 ${hospital.phone}</div>
            </div>
            <div class="availability-grid">
                <div class="availability-badge ${avail.beds_available_now > 0 ? 'badge-available' : 'badge-unavailable'}">
                    🛏️ ${avail.beds_available_now || 0} Beds
                </div>
                <div class="availability-badge ${avail.oxygen_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                    💨 Oxygen ${avail.oxygen_available === 'Yes' ? '✓' : '✗'}
                </div>
                <div class="availability-badge ${avail.surgeons_on_duty !== 'No' ? 'badge-available' : 'badge-limited'}">
                    👨‍⚕️ Surgeons ${avail.surgeons_on_duty}
                </div>
                <div class="availability-badge ${avail.ambulance_available === 'Yes' ? 'badge-available' : 'badge-unavailable'}">
                    🚑 Ambulance ${avail.ambulance_available === 'Yes' ? '✓' : '✗'}
                </div>
            </div>
            <div class="hospital-actions" onclick="event.stopPropagation()">
                <button class="action-btn btn-call" onclick="window.PatientApp_Call('${hospital.phone}')">📞 Call</button>
                <button class="action-btn btn-directions" onclick="window.PatientApp_Directions(${hospital.latitude}, ${hospital.longitude})">🗺️ Directions</button>
            </div>`;

        if (currentLanguage === 'kr') {
            card.innerHTML = translateCardHtml(card.innerHTML, 'kr');
        }

        return card;
    }

    // Global Exposures for card buttons
    window.PatientApp_Call = (phone) => window.location.href = `tel:${phone}`;
    window.PatientApp_Directions = (lat, lon) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');

    function showHospitalDetail(idOrHospital) {
        const hospital = typeof idOrHospital === 'string'
            ? hospitals.find(h => h.id === idOrHospital)
            : idOrHospital;

        if (!hospital) return;
        currentDetailHospital = hospital;

        const avail = hospital.dynamic_availability || {};
        const cap = hospital.static_bed_capacity || {};
        const resources = hospital.technology_services || {};
        const isFav = favorites.includes(hospital.id);

        const favBtn = document.getElementById('favoriteBtn');
        if (favBtn) {
            favBtn.textContent = isFav ? '⭐' : '☆';
            favBtn.onclick = (e) => { e.stopPropagation(); toggleFavorite(hospital.id); };
        }

        const detailContent = document.getElementById('detailContent');
        if (!detailContent) return;

        // Helper for status classes
        const getStatusClass = (val) => {
            if (!val || val === 'No' || val === 'Closed' || val === 'Offline') return 'status-unavailable';
            if (val === 'Limited' || val === 'On Call' || val === 'Functional (Limited)') return 'status-limited';
            return 'status-available';
        };

        const getPulse = (val) => {
            const cls = getStatusClass(val);
            const color = cls === 'status-available' ? '#10b981' : (cls === 'status-limited' ? '#f59e0b' : '#ef4444');
            return `<span class="pulse-dot" style="background: ${color}"></span>`;
        };

        detailContent.innerHTML = `
            <div class="detail-card detail-title-section">
                <h2>${hospital.hospital_name}</h2>
                <span class="detail-type-badge">${hospital.facility_type || 'General Hospital'}</span>
                <p style="margin-top: 10px; font-size: 14px; color: #4a5568;">
                    📍 ${hospital.address || hospital.district}<br>
                    📞 ${hospital.phone || 'Contact not listed'}<br>
                    🕒 Hours: ${hospital.hours || '24/7'}
                </p>
                <div class="action-bar" style="margin-top: 15px;">
                    <button class="btn-primary" onclick="window.PatientApp_Call('${hospital.phone}')">📞 Call</button>
                    <button class="btn-secondary" onclick="window.PatientApp_Directions(${hospital.latitude}, ${hospital.longitude})">🗺️ Directions</button>
                    <button class="btn-ambulance" onclick="window.PatientApp_Call('${hospital.emergency_numbers?.[0] || '117'}')">🚑 Request Ambulance</button>
                </div>
            </div>

            <div class="detail-card">
                <h3 style="font-size: 16px; margin-bottom: 15px;">🛏️ Bed Availability</h3>
                <div class="bed-grid">
                    <div class="bed-item">
                        <div class="bed-count">${avail.beds_male_available || 0}</div>
                        <div class="bed-label">Male Ward / ${cap.male || 0}</div>
                    </div>
                    <div class="bed-item">
                        <div class="bed-count">${avail.beds_female_available || 0}</div>
                        <div class="bed-label">Female Ward / ${cap.female || 0}</div>
                    </div>
                    <div class="bed-item">
                        <div class="bed-count">${avail.beds_ped_available || 0}</div>
                        <div class="bed-label">Children / ${cap.pediatric || 0}</div>
                    </div>
                    <div class="bed-item">
                        <div class="bed-count">${avail.beds_icu_available || 0}</div>
                        <div class="bed-label">ICU / ${cap.icu || 0}</div>
                    </div>
                </div>
            </div>

            <div class="detail-card">
                <h3 style="font-size: 16px; margin-bottom: 12px;">🏥 Services & Resources</h3>
                <div class="resource-grid">
                    <div class="resource-item">
                        <div class="resource-label">Surgery</div>
                        <div class="resource-status">${getPulse(avail.operating_theatre_status)} ${avail.operating_theatre_status || 'Functional'}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">Oxygen</div>
                        <div class="resource-status">${getPulse(avail.oxygen_available)} ${avail.oxygen_available || 'Available'}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">Blood Bank</div>
                        <div class="resource-status">${getPulse(hospital.key_services?.blood_bank ? 'Yes' : 'No')} ${hospital.key_services?.blood_bank ? 'Available' : 'No'}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">Ambulance</div>
                        <div class="resource-status">${getPulse(avail.ambulance_available)} ${avail.ambulance_available || 'Ready'}</div>
                    </div>
                </div>
            </div>

            ${(hospital.key_services?.eye_care || hospital.key_services?.ent || hospital.key_services?.dental || hospital.key_services?.orthopedics) ? `
            <div class="detail-card">
                <h3 style="font-size: 16px; margin-bottom: 12px;">🩺 Specialized Services</h3>
                <div class="resource-grid">
                    ${hospital.key_services?.eye_care ? `
                    <div class="resource-item">
                        <div class="resource-label">Eye Care</div>
                        <div class="resource-status">${getPulse('Yes')} Available</div>
                    </div>` : ''}
                    ${hospital.key_services?.ent ? `
                    <div class="resource-item">
                        <div class="resource-label">ENT (Ear/Nose)</div>
                        <div class="resource-status">${getPulse('Yes')} Available</div>
                    </div>` : ''}
                    ${hospital.key_services?.dental ? `
                    <div class="resource-item">
                        <div class="resource-label">Dental (Tooth)</div>
                        <div class="resource-status">${getPulse('Yes')} Available</div>
                    </div>` : ''}
                    ${hospital.key_services?.orthopedics ? `
                    <div class="resource-item">
                        <div class="resource-label">Orthopedic</div>
                        <div class="resource-status">${getPulse('Yes')} Available</div>
                    </div>` : ''}
                </div>
            </div>` : ''}

            <div class="detail-card">
                <h3 style="font-size: 16px; margin-bottom: 12px;">👨‍⚕️ Specialists Available</h3>
                <div class="specialist-list">
                    <div class="specialist-item">
                        <div class="specialist-info">
                            <div class="specialist-name">Surgeons</div>
                            <div class="specialist-title">General & Specialty</div>
                        </div>
                        <div class="status-badge ${getStatusClass(avail.surgeons_on_duty)}">${avail.surgeons_on_duty || 'On Call'}</div>
                    </div>
                    <div class="specialist-item">
                        <div class="specialist-info">
                            <div class="specialist-name">Pediatricians</div>
                            <div class="specialist-title">Childhood Specialists</div>
                        </div>
                        <div class="status-badge ${hospital.medical_specialists?.pediatricians > 0 ? 'status-available' : 'status-limited'}">${hospital.medical_specialists?.pediatricians > 0 ? 'On-site' : 'On Call'}</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 10px;">
                Last Sync: ${avail.last_updated_timestamp ? new Date(avail.last_updated_timestamp).toLocaleString() : 'Just now'}
            </div>
        `;

        showScreen('detailScreen');
    }

    function toggleFavorite(id) {
        if (favorites.includes(id)) {
            favorites = favorites.filter(fid => fid !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        reRenderView();
    }

    function showFavorites() {
        if (favorites.length === 0) {
            alert('No favorites saved yet. Tap ☆ on a hospital card to favorite it.');
            return;
        }
        currentHospitals = hospitals.filter(h => favorites.includes(h.id));
        displayHospitals(currentHospitals);
        showScreen('homeScreen');
    }

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
        const target = document.getElementById(screenId);
        if (target) target.style.display = 'block';
    }

    function applyFilters() {
        let filtered = [...hospitals];
        if (currentFilters.service) filtered = filtered.filter(h => h.key_services?.[currentFilters.service] === true);

        const beds = document.getElementById('filterBeds');
        if (beds && beds.checked) filtered = filtered.filter(h => (h.dynamic_availability?.beds_available_now || 0) > 0);

        const oxy = document.getElementById('filterOxygen');
        if (oxy && oxy.checked) filtered = filtered.filter(h => h.dynamic_availability?.oxygen_available === 'Yes');

        const district = document.getElementById('filterDistrict');
        if (district && district.value) filtered = filtered.filter(h => h.district === district.value);

        currentHospitals = filtered;
        displayHospitals(currentHospitals);
    }

    function clearFilters() {
        currentFilters.service = null;
        const checks = ['filterBeds', 'filterOxygen', 'filterSurgeons', 'filterAmbulance'];
        checks.forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
        const district = document.getElementById('filterDistrict');
        if (district) district.value = '';
        currentHospitals = [...hospitals];
        displayHospitals(currentHospitals);
    }

    function toggleFilters() {
        const panel = document.getElementById('filtersPanel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function performSearch() {
        const query = document.getElementById('searchInput')?.value.toLowerCase();
        if (!query) { displayHospitals(hospitals); return; }
        const results = hospitals.filter(h =>
            h.hospital_name.toLowerCase().includes(query) || h.district.toLowerCase().includes(query)
        );
        currentHospitals = results;
        displayHospitals(results);
    }

    function activateEmergency() {
        const emergencyHospitals = hospitals.filter(h => h.key_services?.emergency === true);
        const nearest = emergencyHospitals[0];
        if (nearest) {
            document.getElementById('emergencyHospitalName').textContent = nearest.hospital_name;
            document.getElementById('emergencyDistance').textContent = nearest.distance ? `${nearest.distance} km` : '---';
            const callBtn = document.getElementById('emergencyCallBtn');
            if (callBtn) callBtn.onclick = () => window.location.href = 'tel:117';
            showScreen('emergencyScreen');
        }
    }

    function populateDistrictFilter() {
        const select = document.getElementById('filterDistrict');
        if (!select) return;
        const districts = [...new Set(hospitals.map(h => h.district))].sort();
        districts.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d; opt.textContent = d; select.appendChild(opt);
        });
    }

    function setupLanguageSelector() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLanguage = btn.dataset.lang;
                updateTranslations();
                reRenderView();
            };
        });
    }

    function updateTranslations() {
        const trans = translations[currentLanguage];
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (trans[key]) el.textContent = trans[key];
        });
    }

    function reRenderView() {
        applyFilters();
        if (currentDetailHospital) showHospitalDetail(currentDetailHospital);
    }

    function translateDetailHtml(html, lang) {
        if (lang !== 'kr') return html;
        return html.replace(/Beds/g, "Bɛd Dɛn").replace(/District:/g, "Distrikt:");
    }

    function translateCardHtml(html, lang) {
        if (lang !== 'kr') return html;
        return html.replace(/Beds/g, "Bɛd Dɛn");
    }

    function checkOnlineStatus() {
        const banner = document.getElementById('offlineBanner');
        if (banner) banner.style.display = navigator.onLine ? 'none' : 'block';
    }

    function loadFavorites() {
        const stored = localStorage.getItem('favorites');
        favorites = stored ? JSON.parse(stored) : [];
    }

    // Exposures
    window.showScreen = showScreen;
    window.switchView = switchView;
    window.filterByService = (s) => { currentFilters.service = s; applyFilters(); };
    window.showAllHospitals = () => { currentFilters.service = null; applyFilters(); };
    window.toggleFilters = toggleFilters;
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.performSearch = performSearch;
    window.activateEmergency = activateEmergency;
    window.showFavorites = showFavorites;
    window.toggleFavorite = toggleFavorite;

    // Guard against double-init
    if (!window._medfindAppLoaded) {
        window._medfindAppLoaded = true;
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initApp();
        } else {
            document.addEventListener('DOMContentLoaded', initApp);
        }
    }
})();
