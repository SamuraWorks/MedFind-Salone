const fs = require('fs');

function upgradeAppMapPopups() {
    const scriptPath = 'app-script.js';
    if (!fs.existsSync(scriptPath)) return;

    let content = fs.readFileSync(scriptPath, 'utf8');

    const oldPopupRegex = /\.bindPopup\(`([\s\S]*?)<button onclick="showHospitalDetail\(MedFindData\.getHospitalById\('\${hospital\.id}'\)\)"([\s\S]*?)View Details([\s\S]*?)<\/button>([\s\S]*?)`\);/;

    const newPopupCode = `.bindPopup(\`
                <div style="min-width: 250px; font-family: -apple-system, sans-serif; padding: 5px;">
                    <h3 style="margin: 0 0 5px 0; color: #2563eb; font-size: 16px;">\${hospital.hospital_name}</h3>
                    <div style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #4b5563; display: inline-block;">\${hospital.facility_type}</div>
                    <p style="margin: 0 0 5px 0; font-size: 12px; line-height: 1.4; color: #374151;">
                        <strong>District:</strong> \${hospital.district}<br>
                        \${hospital.distance ? '<strong>Distance:</strong> ' + hospital.distance + ' km away<br>' : ''}
                        <strong>About:</strong> \${hospital.notes}
                    </p>
                    <div style="display: flex; align-items: center; gap: 8px; border-top: 1px solid #eee; padding-top: 8px; margin-bottom: 10px;">
                        <span style="font-size: 11px; font-weight: 600;">Status:</span>
                        <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: \${hospital.dynamic_availability.beds_available_now > 0 ? '#10b981' : '#ef4444'}">
                            \${hospital.dynamic_availability.beds_available_now} Beds
                        </span>
                        <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: \${hospital.dynamic_availability.oxygen_available === 'Yes' ? '#10b981' : '#ef4444'}">
                            O₂ \${hospital.dynamic_availability.oxygen_available === 'Yes' ? '✓' : '✗'}
                        </span>
                    </div>
                    <button onclick="showHospitalDetail(MedFindData.getHospitalById('\${hospital.id}'))" 
                        style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                        View Full Profile
                    </button>
                </div>
            \`);`;

    // The regex approach might be brittle if whitespace differs, so let's use a more robust replacement if possible.
    // However, I've seen the content in a previous view_file.

    // Simpler match for the start of the bindPopup call in updateMapMarkers
    const markerStart = "const marker = L.marker([hospital.latitude, hospital.longitude])";
    const bindPopupStart = ".bindPopup(`";

    const startIdx = content.indexOf(".bindPopup(`", content.indexOf("function updateMapMarkers"));
    if (startIdx !== -1) {
        // Find the matching backtick ending
        let endIdx = -1;
        let count = 0;
        for (let i = startIdx + 11; i < content.length; i++) {
            if (content[i] === '`') {
                // Check if it's the end of bindPopup
                if (content.substring(i, i + 3) === "`);") {
                    endIdx = i + 3;
                    break;
                }
            }
        }

        if (endIdx !== -1) {
            content = content.substring(0, startIdx) + newPopupCode + content.substring(endIdx);
            fs.writeFileSync(scriptPath, content, 'utf8');
            console.log("Successfully upgraded App Map popups to match rich data standards.");
        } else {
            console.error("Could not find matching end of bindPopup in app-script.js");
        }
    } else {
        console.error("Could not find bindPopup in app-script.js");
    }
}

upgradeAppMapPopups();
