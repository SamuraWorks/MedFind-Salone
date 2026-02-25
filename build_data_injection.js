const fs = require('fs');
const path = require('path');

try {
    const hospitals = fs.readFileSync('./data/hospitals_complete.json', 'utf8');
    let dataJs = fs.readFileSync('data.js', 'utf8');

    // Marker to identify where to inject
    const startMarker = 'const FALLBACK_DATA = ';
    const startIndex = dataJs.indexOf(startMarker);

    if (startIndex === -1) {
        throw new Error('Start marker not found');
    }

    // Since the current array is valid JS, we can find the matching closing bracket?
    // Or just search for the known indentation of the closing bracket from my previous edit?
    // In Step 544, it was "    ];"
    // Let's search for "];" starting from startIndex.
    // However, the embedded JSON might contain "];" in a string? Unlikely.

    // Safer approach: Read the file line by line?
    // Or just assume the current file structure is:
    // const FALLBACK_DATA = [ ... ];
    // We can find the first "];" after startIndex because the current array is short.

    const endIndex = dataJs.indexOf('];', startIndex);

    if (endIndex === -1) {
        throw new Error('End marker not found');
    }

    const newContent = dataJs.substring(0, startIndex + startMarker.length) +
        hospitals +
        dataJs.substring(endIndex + 1);

    fs.writeFileSync('data.js', newContent);
    console.log('✅ data.js updated with full dataset (' + hospitals.length + ' bytes injected)');

} catch (err) {
    console.error('❌ Error updating data.js:', err);
    process.exit(1);
}
