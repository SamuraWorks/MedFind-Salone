// 🚀 MedFind-Salone: Full Map & Hospital Fix
// Integrated Google Maps Solution

// 1️⃣ Ensure Google Maps loads properly
function initMap() {
    console.log("🗺️ Google Maps Initializing...");
    // Default center (Freetown, Sierra Leone)
    const center = { lat: 8.4844, lng: -13.2344 };

    // Create map
    const mapElement = document.getElementById('map') || document.getElementById('homeMapContainer') || document.getElementById('appMap');

    if (!mapElement) {
        console.error('❌ Map container not found!');
        return;
    }

    const map = new google.maps.Map(mapElement, {
        center: center,
        zoom: 10,
        mapTypeId: 'roadmap',
    });

    // Attach markers for all hospitals
    if (window.MedFindData && MedFindData.hospitals && MedFindData.hospitals.length > 0) {
        console.log(`📍 Adding ${MedFindData.hospitals.length} markers to map...`);

        MedFindData.hospitals.forEach(hospital => {
            if (hospital.lat && hospital.lng) {
                // Determine marker color based on oxygen availability
                const hasOxygen = (hospital.dynamic_availability && hospital.dynamic_availability.oxygen_available === 'Yes');
                const markerColor = hasOxygen ? '#10b981' : '#ef4444'; // Green vs Red

                const marker = new google.maps.Marker({
                    position: { lat: hospital.lat, lng: hospital.lng },
                    map: map,
                    title: hospital.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: markerColor,
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 10
                    }
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                    <div style="min-width: 250px; font-family: -apple-system, sans-serif; padding: 5px; color: #333;">
                        <h3 style="margin: 0 0 5px 0; color: #1a202c; font-size: 16px;">${hospital.name}</h3>
                        <div style="background: #ebf4ff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #2b6cb0; display: inline-block;">${hospital.facility_type || 'Hospital'}</div>
                        <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.4; color: #4a5568;">
                            📍 ${hospital.address || hospital.district}
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #edf2f7; padding-top: 8px; margin-bottom: 12px;">
                            <span style="font-size: 12px; font-weight: 700; color: #2d3748;">Oxygen: <span style="color: ${hasOxygen ? '#10b981' : '#dc2626'}">${hasOxygen ? '✅' : '❌'}</span></span>
                            <span style="font-size: 11px; color: #718096;">Updated: Just Now</span>
                        </div>
                        <button onclick="window.PatientAppDetail.show('${hospital.id}');" 
                            style="width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
                            View Full Profile
                        </button>
                    </div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }
        });
    } else {
        console.warn('⚠️ No hospitals found to display on map!');
    }

    // Store globally
    window.HomeMap = { map };

    // Bridge for Map -> Detail
    window.PatientAppDetail = {
        show: function (id) {
            if (window.showSPASection) window.showSPASection('patientSection');
            if (window.MedFindData) {
                const h = window.MedFindData.getHospitalById(id);
                if (h && typeof window.showHospitalDetail === 'function') {
                    window.showHospitalDetail(h);
                }
            }
        }
    };

    console.log("✅ Map loaded successfully.");
}

// 2️⃣ Load Google Maps dynamically if not loaded
function loadGoogleMaps(apiKey) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        initMap();
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// 3️⃣ Fix offline fallback
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('✅ ServiceWorker registered and caching assets'))
        .catch(err => console.error('❌ ServiceWorker failed:', err));
}

// 4️⃣ Initialize everything after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual Google Maps API Key
    // NOTE: Using a placeholder, user should replace this if they have a real key.
    // If no key is provided, Google Maps may show "for development purposes only".
    const GOOGLE_MAPS_KEY = 'YOUR_API_KEY_HERE';

    console.log("🚀 Initializing Full Fix...");
    loadGoogleMaps(GOOGLE_MAPS_KEY);

    // Optional: show hospital list in sidebar
    const listContainer = document.getElementById('hospital-list') || document.getElementById('hospitalList');
    if (listContainer && window.MedFindData && MedFindData.hospitals) {
        listContainer.innerHTML = MedFindData.hospitals.map(h => `
            <div class="hospital-card" style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;">
                <b style="color: #667eea;">${h.name}</b><br>
                <small>${h.address}</small><br>
                <span style="font-size: 12px; color: #666;">${h.contact || ''}</span>
            </div>
        `).join('');
    }
});
