/* ============================================================
   THENUX JARVIS — main.js
   ============================================================ */

/* ---- scroll reveal ---- */
const revealEls = document.querySelectorAll('[data-reveal], .pipe-node, .feat-card');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
},{ threshold:.15 });
revealEls.forEach((el,i)=>{
  el.style.transitionDelay = (i % 6) * 60 + 'ms';
  io.observe(el);
});

/* ---- radar blips: place tool markers around the rings ---- */
(function buildRadar(){
  const radar = document.getElementById('radar');
  if(!radar) return;
  const labels = ['open_app','web_search','code_helper','file_controller','dev_agent','browser_control','reminder','game_updater'];
  const radii = [50,50,50,50,50,50,50,50]; // percent placeholder, real calc below
  labels.forEach((label,i)=>{
    const angle = (360/labels.length)*i - 90;
    const rad = angle * Math.PI/180;
    const distance = 32 + (i % 3) * 8; // vary ring distance
    const x = 50 + distance * Math.cos(rad);
    const y = 50 + distance * Math.sin(rad);

    const blip = document.createElement('div');
    blip.className = 'blip';
    blip.style.left = x + '%';
    blip.style.top = y + '%';
    blip.style.animationDelay = (i*0.3) + 's';
    radar.appendChild(blip);

    const lab = document.createElement('div');
    lab.className = 'label';
    lab.textContent = label;
    lab.style.left = x + '%';
    lab.style.top = (y + (y>50?6:-6)) + '%';
    radar.appendChild(lab);
  });
})();

/* ---- tool tabs ---- */
const tabs = document.querySelectorAll('.tool-tab');
const cards = document.querySelectorAll('.tool-card');
tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    cards.forEach(c=>{
      c.classList.toggle('show', c.dataset.cat === cat);
    });
  });
});

/* ---- changelog: load from shared storage (admin panel writes here), fallback to default ---- */
const DEFAULT_CHANGELOG = `# 🚀 THENUX Jarvis — Recent System Updates & Changelog
This document tracks all recent features, optimizations, and bug fixes added to the **THENUX Jarvis** assistant.

---

## 📅 June 2026

### 🛠 Core & API Fixes
* **Thenux AI Message Sanitizer**: Resolved the \`500 Internal Server Error\` (deprecated model pipeline error) when running agent/tool histories. Implemented \`_sanitize_messages_for_thenux\` to format tool execution outputs and nested \`tool_calls\` payloads into standard user/assistant messages before sending them to the endpoint.
* **Zero-Window Console Execution (Flicker Fix)**: Monkeypatched \`subprocess.Popen\` globally on Windows to inject the \`CREATE_NO_WINDOW\` flag. Eliminated all command prompt window flashes during background task execution (VAD, Edge-TTS, and status checks).

### 📦 Branded Game-Like Installer
* **Release Pipeline** (\`build_installer.py\` & \`installer.iss\`): Built an automated builder using PyInstaller and Inno Setup to create \`dist/THENUX_Jarvis_Setup.exe\`. Integrated custom visual branding assets and developer credits on the installation screen.

### 🔌 New Workspace & Git Automation Tools
* **Workspace Launcher**: Preserves and triggers workspace setups — \`coding\` (VS Code + Chrome), \`design\` (Figma + Spotify), \`relax\` (Steam + Spotify).
* **Git Assistant**: Execute repository commands directly via voice or text chat — \`status\`, \`commit_push\`, \`pull\`, and branch switching/listing.

### 📂 File & Web Automation
* **Prompt-to-Save Folder Chooser**: Integrated the folder selector dialog across all file saving tools — Web Clipper, YouTube Video Summarizer, and Flight Finder. Falls back automatically to OneDrive Desktop, Downloads, or local directories if canceled.
* **Desktop File Watcher**: Added a background directory watcher that scans the Desktop every 10 seconds and vocally alerts the user when a new file appears.

### 🖥 UI & Dashboard Enhancements
* **Website Latency Ping Monitor**: Added a live PING label inside the HUD system monitor panel, testing latency every 12 seconds.

---

## 🔒 Security & Repository Preparation
* **GitHub Exclusion System**: Created \`.gitignore\` to prevent uploading private API keys, local memory records, and heavy build artifact directories. Added \`config/api_keys.json.example\` as a template for other developers.
`;

function renderChangelog(){
  const target = document.getElementById('changelogContent');
  if(!target) return;
  let md = DEFAULT_CHANGELOG;
  try{
    const stored = localStorage.getItem('jarvis_changelog_md');
    if(stored && stored.trim().length > 0) md = stored;
  }catch(e){ /* storage unavailable, use default */ }

  if(window.marked){
    target.innerHTML = window.marked.parse(md);
  }else{
    target.textContent = md;
  }
}
renderChangelog();

/* keep changelog in sync if admin panel updates it in another tab */
window.addEventListener('storage', (e)=>{
  if(e.key === 'jarvis_changelog_md') renderChangelog();
});
