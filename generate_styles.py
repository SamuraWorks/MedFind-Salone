
import re
import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_map_styles(html_content):
    match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
    if match:
        return match.group(1)
    return ""

def process_css(css_content, scope_selector):
    # 1. Extract Keyframes (Global)
    keyframes = []
    def kf_repl(m):
        keyframes.append(m.group(0))
        return ""
    
    # Regex for @keyframes blocks (simple balanced brace approximation or just assuming they are at top level)
    # This regex is a bit simplistic, assumes } closes the keyframe. 
    # Better: finding @keyframes and matching braces.
    # Given the simplicity of the source files, we can try to separate them.
    # However, for this task, copying keyframes to global scope is best.
    
    # Let's simple-parse: Split by '}'
    # It leads to issues.
    
    # Alternative: Just replace :root with scope_selector, body with & (nested), and wrap everything.
    # Keyframes inside a selector are invalid in older CSS but valid in some preprocessors? 
    # In Native CSS Nesting: @keyframes can be nested, but they define global names usually.
    # To be safe, we should try to extract them, but if we nest them, they might still work in modern browsers? 
    # Actually, @keyframes inside a style rule IS valid but scope is global? 
    # "The @keyframes at-rule defines keyframes for use by the animation-name property. It can be used at the top level of a stylesheet, or inside a conditional group at-rule... It cannot be nested inside a style rule."
    # ERROR: We CANNOT nest @keyframes inside `#scope { ... }`.
    
    # We MUST extract keyframes.
    
    processed_css = css_content
    found_keyframes = []
    
    # Regex to capture @keyframes name { ... }
    # Utilizing the recursive nature is hard with regex.
    # We will assume standard indentation or reliable formatting from the source files.
    # Source files viewed showed standard formatting.
    
    # Let's iterate through the file to find @keyframes
    # A robust brace counter is better.
    
    output_css = ""
    global_sink = ""
    
    i = 0
    length = len(css_content)
    depth = 0
    buffer = ""
    in_keyframes = False
    
    while i < length:
        char = css_content[i]
        
        # Check for @keyframe start
        if not in_keyframes and css_content[i:].startswith("@keyframes"):
            in_keyframes = True
            buffer += char
        elif in_keyframes:
            buffer += char
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    in_keyframes = False
                    global_sink += buffer + "\n"
                    buffer = ""
        else:
            output_css += char
            
        i += 1
        
    # Replace :root
    # We want :root properties to be applied to the scope_selector
    output_css = output_css.replace(":root", "&")
    
    # Replace html, body
    output_css = output_css.replace("html", "&")
    output_css = re.sub(r'^\s*body', '&', output_css, flags=re.MULTILINE) # Start of line body
    output_css = re.sub(r'}\s*body', '} &', output_css) # Body after a block
    output_css = output_css.replace(" body {", " & {")
    output_css = output_css.replace(", body", ", &")
    
    # Remove @charset if exists
    output_css = re.sub(r'@charset[^;]+;', '', output_css)

    return global_sink, f"{scope_selector} {{\n{output_css}\n}}"

# Paths
base_dir = r"c:\Users\User\.gemini\antigravity\scratch\MedFind_Salone"
app_css_path = os.path.join(base_dir, "app-styles.css")
admin_css_path = os.path.join(base_dir, "admin-styles.css")
map_html_path = os.path.join(base_dir, "map.html")
map_script_path = os.path.join(base_dir, "map-script.js") # referenced just in case
output_path = os.path.join(base_dir, "spa-styles.css")

# Global SPA Styles (from our design)
spa_global_css = """
/* ============================================
   MedFind Salone - Consolidated SPA Styles
   ============================================ */

/* Global Resets & Typography */
* { box-sizing: border-box; }
body { 
    margin: 0; 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1f2937;
    background-color: #f9fafb;
}

/* Unified Navigation */
.app-nav {
    position: sticky;
    top: 0;
    z-index: 9999;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.nav-title { font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.nav-links { display: flex; gap: 10px; }
.nav-menu-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}
.nav-menu-btn:hover { background: rgba(255,255,255,0.3); }

/* Global Loading & Banners */
.unified-loading {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    z-index: 10000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: white;
    transition: opacity 0.5s;
}
.unified-loading.hide { opacity: 0; pointer-events: none; }
.loading-spinner {
    width: 60px; height: 60px;
    border: 5px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}
.offline-banner {
    display: none;
    background: #1f2937; color: white;
    text-align: center; padding: 10px;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 10000;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Section Management */
.section { display: none; min-height: calc(100vh - 70px); }
.section.active { display: block; animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Landing Page Styles */
.landing-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero-header { text-align: center; margin-bottom: 60px; padding: 40px 0; }
.hero-logo { font-size: 80px; margin-bottom: 20px; }
.hero-title { 
    font-size: 56px; font-weight: 900; margin: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-subtitle { font-size: 24px; color: #374151; margin: 10px 0; }
.hero-tagline { color: #6b7280; font-size: 18px; }

.nav-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 60px; }
.nav-card {
    background: white; padding: 40px 30px; border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer; border: 2px solid transparent;
}
.nav-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.patient-card:hover { border-color: #3b82f6; }
.admin-card:hover { border-color: #764ba2; }
.card-icon { font-size: 60px; margin-bottom: 20px; }
.nav-card h2 { font-size: 28px; margin-bottom: 10px; color: #111827; }
.card-features { list-style: none; padding: 0; margin: 20px 0; }
.card-features li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
.card-btn {
    width: 100%; padding: 15px; border: none; border-radius: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; font-weight: 600; cursor: pointer;
}

.landing-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 60px; }
.stat-box { background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.stat-value { font-size: 48px; font-weight: bold; color: #667eea; }
.stat-label { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

.landing-footer { text-align: center; margin-top: 60px; color: #9ca3af; padding-bottom: 20px; }

/* Responsive */
@media (max-width: 768px) {
    .nav-links { display: none; } /* Hide in mobile not ideal, but for now focusing on content */
    .hero-title { font-size: 36px; }
}
"""

def generate_styles():
    print("Reading files...")
    app_css = read_file(app_css_path)
    admin_css = read_file(admin_css_path)
    map_html = read_file(map_html_path)
    map_css = extract_map_styles(map_html)
    
    print("Processing Patient App Styles...")
    # Clean app css - remove body styling that might conflict if not scoped properly
    # The scoping logic handles body replacement
    app_global_kfs, app_scoped_css = process_css(app_css, "#patient-app-view")
    
    print("Processing Admin Portal Styles...")
    admin_global_kfs, admin_scoped_css = process_css(admin_css, "#admin-panel-view")
    
    print("Processing Map Styles...")
    # Wrap in .map-wrapper for Landing usage
    map_global_kfs, map_scoped_css = process_css(map_css, ".map-wrapper")
    
    # Specific Map View override: Map also needs to be usable as a view?
    # No, it's embedded in landing.
    
    final_css = (
        spa_global_css + "\n" +
        "/* ========================================= */\n" +
        "/* SHARED KEYFRAMES (Extracted)              */\n" +
        "/* ========================================= */\n" +
        app_global_kfs + "\n" +
        admin_global_kfs + "\n" +
        map_global_kfs + "\n" +
        "/* ========================================= */\n" +
        "/* SCOPED PATIENT APP STYLES                 */\n" +
        "/* ========================================= */\n" +
        app_scoped_css + "\n" +
        "/* ========================================= */\n" +
        "/* SCOPED ADMIN PORTAL STYLES                */\n" +
        "/* ========================================= */\n" +
        admin_scoped_css + "\n" +
        "/* ========================================= */\n" +
        "/* SCOPED MAP STYLES                         */\n" +
        "/* keyframes may overlap but browsers handle it*/\n" +
        "/* ========================================= */\n" +
        map_scoped_css
    )
    
    print(f"Writing unified styles to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_css)
    
    print("Done!")

if __name__ == "__main__":
    generate_styles()
