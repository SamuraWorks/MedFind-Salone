const fs = require('fs');

function updatePopups() {
    const indexHtml = 'index.html';
    if (!fs.existsSync(indexHtml)) return;

    let content = fs.readFileSync(indexHtml, 'utf8');

    const oldPopupCode = /\.bindPopup\(`([\s\S]*?)`\);/;

    // We target the specific marker logic in initializeHomeMap
    const newPopupCode = `.bindPopup(\`<div style="min-width: 250px; font-family: -apple-system, sans-serif; padding: 5px;">
                                <h3 style="margin: 0 0 5px 0; color: #2563eb; font-size: 16px;">\${hospital.hospital_name}</h3>
                                <div style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #4b5563; display: inline-block;">\${hospital.facility_type}</div>
                                <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.4; color: #374151;">
                                    <strong>District:</strong> \${hospital.district}<br>
                                    <strong>About:</strong> \${hospital.notes}
                                </p>
                                <div style="display: flex; align-items: center; gap: 8px; border-top: 1px solid #eee; padding-top: 8px;">
                                    <span style="font-size: 11px; font-weight: 600;">Live Status:</span>
                                    <span style="padding: 2px 8px; border-radius: 10px; font-size: 10px; color: white; background: \${statusColor === 'green' ? '#10b981' : '#ef4444'}">
                                        \${statusColor === 'green' ? 'Oxygen Capable' : 'Limited Storage'}
                                    </span>
                                </div>
                            </div>\`);`;

    content = content.replace(oldPopupCode, newPopupCode);
    fs.writeFileSync(indexHtml, content, 'utf8');
    console.log("Updated Landing Map Popups with High-Value Rich Content");
}

updatePopups();
