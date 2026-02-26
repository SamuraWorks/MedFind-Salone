const fs = require('fs');

function globalNormalize(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace MedFindData with window.MedFindData, but only when it's not preceded by a dot or 'window.'
    // A simplified regex: match MedFindData not preceded by '.', then check if it's already 'window.'

    // Better: replace all instances of 'MedFindData.init' with 'window.MedFindData.init' etc.
    // Or just all 'MedFindData' where it's a separate identifier.

    content = content.replace(/(?<![.\w])MedFindData(?!\w)/g, 'window.MedFindData');

    // Fix double 'window.' if any were introduced
    content = content.replace(/window\.window\.MedFindData/g, 'window.MedFindData');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Normalized ${file}`);
}

globalNormalize('index.html');
globalNormalize('app-script.js');
globalNormalize('admin-script.js');
globalNormalize('spa-script.js');
globalNormalize('app.html');
globalNormalize('admin.html');
globalNormalize('spa.html');
