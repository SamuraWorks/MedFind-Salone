const fs = require('fs');

function injectTranslations(file, isSpa) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Hook currentLanguage changing
    // In spa context, PatientApp.setLanguage is called.
    // In app context, currentLanguage is updated locally.

    const translateFunctionHTML = `
function translateDetailHtml(html, lang) {
    if (lang !== 'kr') return html;
    return html
        .replace(/HOSPITAL OVERVIEW/g, "HOSPITAL INFOR")
        .replace(/LIVE EMERGENCY STATUS/g, "ƐMAJƐNSI WETIN DE")
        .replace(/CURRENT AVAILABILITY/g, "WETIN DE YASO NYA")
        .replace(/BED BREAKDOWN/g, "BED DƐN BƐTƐ BƐTƐ")
        .replace(/SURGICAL SERVICES/g, "SƆJIKAL SAVIS")
        .replace(/MEDICAL SPECIALISTS/g, "MƐDIKAL DƆKTA DƐN")
        .replace(/SERVICES AVAILABLE/g, "SAVIS DƐN WE DE")
        .replace(/TECHNOLOGY &amp; EQUIPMENT/g, "MASHIN ƐN TIN DƐN")
        .replace(/PHARMACY SERVICES/g, "FAMESI SAVIS DƐN")
        .replace(/INFRASTRUCTURE &amp; SUPPORT/g, "PƆWA ƐN WATA")
        .replace(/EMERGENCY CONTACT NUMBERS/g, "ƐMAJƐNSI KƆNTACKT DƐN")
        .replace(/DATA TRANSPARENCY/g, "DATA INFOR")
        .replace(/Province:/g, "Rijɔn:")
        .replace(/District:/g, "Distrikt:")
        .replace(/Full Address:/g, "Kɔmplɛt Adrɛs:")
        .replace(/Phone Number:/g, "Fɔn Nɔmba:")
        .replace(/Distance:/g, "A Faa I De:")
        .replace(/Call Hospital/g, "Kɔl Hospital")
        .replace(/Directions/g, "Fɛn Di Rod")
        .replace(/Beds Available \\/ Total Beds/g, "Bed Dɛn We De / Ɔl Bɛd Dɛn")
        .replace(/ICU Beds/g, "ICU Bed Dɛn")
        .replace(/Oxygen Units Available/g, "Oxygen We De")
        .replace(/Surgeons on Duty/g, "Dɔkta Dɛn De")
        .replace(/Ambulances Available/g, "Ambulans Dɛn We De")
        .replace(/Not Updated/g, "Nɔ Abdeʈ")
        .replace(/Not Available/g, "Nɔ De Yaso")
        .replace(/>Unavailable</g, ">Nɔ De Yaso<")
        .replace(/>Available</g, ">I De<")
        .replace(/Functional/g, "I De Wok")
        .replace(/Closed/g, "Lɔk")
        .replace(/Adult Beds/g, "Big Mɔtɔ Bɛd Dɛn")
        .replace(/Maternity Beds/g, "Pikin Bɔn Bɛd Dɛn")
        .replace(/Pediatric Beds/g, "Pikin Bɛd Dɛn")
        .replace(/Total Beds/g, "Ɔl Bɛd Dɛn");
}

function translateCardHtml(html, lang) {
    if (lang !== 'kr') return html;
    return html
        .replace(/ Beds/g, " Bed Dɛn")
        .replace(/Oxygen/g, "Oxygen")
        .replace(/Surgeons/g, "Dɔkta")
        .replace(/Ambulance/g, "Ambulans")
        .replace(/Call/g, "Kɔl")
        .replace(/Directions/g, "Fɛn Di Rod")
        .replace(/km/g, "km")
        .replace(/Distance/g, "A Faa I De");
}
`;

    // Make sure we only inject once
    if (!content.includes('translateDetailHtml(')) {
        if (isSpa) {
            content = content.replace(/const PatientApp = \{/, translateFunctionHTML + '\nconst PatientApp = {');
        } else {
            content = content.replace(/function updateTranslations\(\) \{/, translateFunctionHTML + '\n    function updateTranslations() {');
        }
    }

    // Wrap the card HTML assignment
    if (isSpa) {
        content = content.replace(/div\.innerHTML = `([\s\S]*?)`;/g, 'div.innerHTML = translateCardHtml(`$1`, SPA.state.currentLanguage || "en");');
        content = content.replace(/content\.innerHTML = `([\s\S]*?)`;/g, 'content.innerHTML = translateDetailHtml(`$1`, SPA.state.currentLanguage || "en");');

        // Track currentLanguage in SPA
        if (!content.includes('SPA.state.currentLanguage = lang;')) {
            content = content.replace(/setLanguage: function \(lang\) \{/, 'setLanguage: function (lang) {\n        SPA.state.currentLanguage = lang;\n');
        }

        // Re-render views when language changes
        if (!content.includes('PatientApp.reRenderView();')) {
            content = content.replace(/PatientApp\.setLanguage\(lang\);/, 'PatientApp.setLanguage(lang);\n            PatientApp.reRenderView();');
        }

        // Add reRenderView to PatientApp
        if (!content.includes('reRenderView: function()')) {
            content = content.replace(/init: function \(\) \{/, 'reRenderView: function() {\n        this.applyFilters();\n        if (document.getElementById("detailScreen") && document.getElementById("detailScreen").style.display === "block" && this.currentDetailHospital) {\n            this.showDetail(this.currentDetailHospital);\n        }\n    },\n\n    init: function () {');
        }

        // Track current hospital
        if (!content.includes('this.currentDetailHospital = hospital;')) {
            content = content.replace(/showDetail: function \(hospital\) \{/, 'showDetail: function (hospital) {\n        this.currentDetailHospital = hospital;\n');
        }

    } else {
        // App Script Replacement
        content = content.replace(/div\.innerHTML = `([\s\S]*?)`;/g, 'div.innerHTML = translateCardHtml(`$1`, currentLanguage);');
        content = content.replace(/content\.innerHTML = `([\s\S]*?)`;/g, 'content.innerHTML = translateDetailHtml(`$1`, currentLanguage);');

        // Track current details
        if (!content.includes('let currentDetailHospital = null;')) {
            content = content.replace(/function showHospitalDetail\(hospital\) \{/, 'let currentDetailHospital = null;\n    function showHospitalDetail(hospital) {\n        currentDetailHospital = hospital;\n');
        }

        // Apply translations on language switch
        if (!content.includes('reRenderView();')) {
            content = content.replace(/updateTranslations\(\);/g, 'updateTranslations();\n                reRenderView();');

            content = content.replace(/function updateTranslations\(\) \{/, 'function reRenderView() {\n        applyFilters();\n        if (document.getElementById("detailScreen") && document.getElementById("detailScreen").style.display === "block" && currentDetailHospital) {\n            showHospitalDetail(currentDetailHospital);\n        }\n    }\n\n    function updateTranslations() {');
        }

        // Ensure filters get translated correctly
        content = content.replace(/titleSpan\.textContent = 'Nearby Hospitals';/g, "titleSpan.setAttribute('data-translate', 'nearby_hospitals');\n                titleSpan.textContent = translations[currentLanguage]['nearby_hospitals'];");
        content = content.replace(/titleSpan\.textContent = `\${serviceName} Services`;/g, "titleSpan.setAttribute('data-translate', serviceName.toLowerCase());\n                titleSpan.textContent = translations[currentLanguage][serviceName.toLowerCase()] || `${serviceName} Services`;");
    }

    fs.writeFileSync(file, content, 'utf8');
}

injectTranslations('app-script.js', false);
injectTranslations('spa-script.js', true);
