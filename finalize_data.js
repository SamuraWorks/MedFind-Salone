const fs = require('fs');

function finalizeDataJs() {
    let content = fs.readFileSync('data.js', 'utf8');

    // Replace the start
    content = content.replace(/window\.MedFindData = \(function\(\) \{/, 'if (!window.MedFindData) { window.MedFindData = (function() {');

    // The replace_file_content above might have been different, let's just re-read and be careful.
    // Actually, I'll just write the whole wrap logic.

    const startIdx = content.indexOf('if (!window.MedFindData)');
    if (startIdx === -1) {
        // If my previous replacement didn't work as expected, let's try to find the start again
        content = content.replace(/const MedFindData = \(function\(\) \{/, 'if (!window.MedFindData) { window.MedFindData = (function() {');
    }

    // Now fix the end
    // Find the end of the IIFE
    const iifeEndMatch = content.lastIndexOf('})();');
    if (iifeEndMatch !== -1) {
        const beforeEnd = content.substring(0, iifeEndMatch + 5);
        const afterEnd = content.substring(iifeEndMatch + 5);

        // Add closing brace for the 'if'
        let newContent = beforeEnd + ' }';

        // Fix module.exports
        newContent += afterEnd.replace(/module\.exports = MedFindData;/, 'module.exports = window.MedFindData;');

        fs.writeFileSync('data.js', newContent, 'utf8');
        console.log("Successfully fixed data.js for global window integration and module exports.");
    }
}

finalizeDataJs();
