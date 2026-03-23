const fs = require('fs');

function enhanceLandingMap() {
    const indexPath = 'index.html';
    if (!fs.existsSync(indexPath)) return;

    let content = fs.readFileSync(indexPath, 'utf8');

    // Simpler match for the bindPopup call in index.html
    const startPattern = '.bindPopup(`<div style="min-width: 250px;';
    const startIdx = content.indexOf(startPattern);

    if (startIdx !== -1) {
        // Find the matching end
        let endIdx = -1;
        for (let i = startIdx; i < content.length; i++) {
            if (content.substring(i, i + 3) === "`);") {
                endIdx = i + 3;
                break;
            }
        }

        if (endIdx !== -1) {
            const newPopup = `.bindPopup(\`<div style="min-width: 250px; font-family: -apple-system, sans-serif; padding: 5px;">
                                <h3 style="margin: 0 0 5px 0; color: #667eea; font-size: 16px;">\${hospital.hospital_name}</h3>
                                <div style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #4b5563; display: inline-block;">\${hospital.facility_type}</div>
                                <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.4; color: #374151;">
                                    <strong>District:</strong> \${hospital.district}<br>
                                    <strong>Specialty Insight:</strong> \${hospital.notes}
                                </p>
                                <div style="display: flex; align-items: center; gap: 8px; border-top: 1px solid #eee; padding-top: 8px; margin-bottom: 10px;">
                                    <span style="font-size: 11px; font-weight: 600;">Live Status:</span>
                                    <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: \${statusColor === 'green' ? '#10b981' : '#ef4444'}">
                                        \${statusColor === 'green' ? 'Oxygen Capable' : 'Limited Storage'}
                                    </span>
                                </div>
                                <button onclick="showSPASection('patientSection'); setTimeout(() => { if(window.PatientApp && window.PatientApp.showHospitalDetail) window.PatientApp.showHospitalDetail(MedFindData.getHospitalById('\${hospital.id}')); }, 500)"
                                    style="width: 100%; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                                    🚀 Open in Patient App
                                </button>
                            </div>\`);`;

            content = content.substring(0, startIdx) + newPopup + content.substring(endIdx);
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log("Successfully enhanced Landing Map with App-Integration button.");
        }
    }
}

enhanceLandingMap();
