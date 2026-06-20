/* ============================================================
   THENUX JARVIS — main.js
   Smooth scroll (Lenis) + scroll-driven animation (GSAP/ScrollTrigger)
   ============================================================ */

/* ---- preloader ---- */
window.addEventListener('load', ()=>{
  const loader = document.getElementById('loader');
  if(!loader) return;
  gsap.to(loader, {
    opacity:0, duration:.6, delay:.2, ease:'power2.out',
    onComplete:()=>{ loader.style.display='none'; document.body.classList.add('loaded'); playHeroIntro(); }
  });
});

/* ---- Lenis smooth scroll, wired into GSAP's ticker ---- */
let lenis;
if(window.Lenis){
  lenis = new Lenis({
    duration: 1.05,
    easing: (t)=> 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });
  gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ()=> ScrollTrigger.update());
}

if(window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- hero intro timeline ---- */
function playHeroIntro(){
  if(!window.gsap) return;
  const tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
  tl.from('.hero .eyebrow', { y:16, opacity:0, duration:.55 })
    .from('.hero h1', { y:34, opacity:0, duration:.75 }, '-=.3')
    .from('.hero .sub', { y:24, opacity:0, duration:.6 }, '-=.45')
    .from('.hero .ctas .btn', { y:18, opacity:0, duration:.5, stagger:.1 }, '-=.35')
    .from('.hero-stats > div', { y:16, opacity:0, duration:.5, stagger:.08 }, '-=.3')
    .from('.radar-wrap', { scale:.85, opacity:0, duration:.9, ease:'back.out(1.4)' }, '-=.7')
    .from('.hero-glyph', { opacity:0, duration:1.2 }, '-=.6');
}

/* ---- scroll-triggered reveals ---- */
function initScrollReveals(){
  if(!window.gsap || !window.ScrollTrigger) return;

  gsap.utils.toArray('[data-reveal]').forEach((el)=>{
    gsap.from(el, {
      y:26, opacity:0, duration:.7, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none reverse' }
    });
  });

  gsap.utils.toArray('.section-head').forEach((el)=>{
    gsap.from(el.children, {
      y:22, opacity:0, duration:.65, stagger:.08, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none reverse' }
    });
  });

  gsap.utils.toArray('.pipe-node').forEach((el,i)=>{
    gsap.from(el, {
      x: 40, opacity:0, duration:.6, delay:(i%5)*0.06, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none reverse' }
    });
  });

  gsap.from('.feat-card', {
    y:30, opacity:0, duration:.6, stagger:{ each:.07, grid:'auto', from:'start' }, ease:'power2.out',
    scrollTrigger:{ trigger:'.feat-grid', start:'top 85%', toggleActions:'play none none reverse' }
  });

  gsap.from('.model-table tbody tr', {
    x:-24, opacity:0, duration:.5, stagger:.06, ease:'power2.out',
    scrollTrigger:{ trigger:'.model-table', start:'top 85%', toggleActions:'play none none reverse' }
  });

  gsap.from('.tool-card.show', {
    y:18, opacity:0, duration:.5, stagger:.05, ease:'power2.out',
    scrollTrigger:{ trigger:'.tool-grid', start:'top 88%', toggleActions:'play none none reverse' }
  });

  gsap.utils.toArray('.log-entry').forEach((el)=>{
    gsap.from(el, {
      y:24, opacity:0, duration:.6, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none reverse' }
    });
  });

  gsap.from('.download .panel', {
    y:30, opacity:0, scale:.97, duration:.7, ease:'power2.out',
    scrollTrigger:{ trigger:'.download .panel', start:'top 85%', toggleActions:'play none none reverse' }
  });

  gsap.to('.radar-wrap', {
    y: 60, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:.6 }
  });
  gsap.to('.hero-glyph', {
    y: 30, opacity:.08, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:.6 }
  });

  ScrollTrigger.create({
    start: 80,
    end: 99999,
    toggleClass: { targets:'.nav', className:'scrolled' },
  });
}

/* ---- radar blips ---- */
(function buildRadar(){
  const radar = document.getElementById('radar');
  if(!radar) return;
  const labels = ['open_app','web_search','code_helper','file_controller','dev_agent','browser_control','reminder','game_updater'];
  labels.forEach((label,i)=>{
    const angle = (360/labels.length)*i - 90;
    const rad = angle * Math.PI/180;
    const distance = 32 + (i % 3) * 8;
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

/* ---- tool tabs, with a soft crossfade ---- */
const tabs = document.querySelectorAll('.tool-tab');
const allCards = document.querySelectorAll('.tool-card');
tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    if(tab.classList.contains('active')) return;
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    const visible = Array.from(allCards).filter(c=>c.dataset.cat === cat);
    const hiding = Array.from(allCards).filter(c=>c.classList.contains('show'));

    if(window.gsap){
      gsap.to(hiding, {
        opacity:0, y:8, duration:.18, ease:'power1.in',
        onComplete:()=>{
          hiding.forEach(c=>c.classList.remove('show'));
          visible.forEach(c=>c.classList.add('show'));
          gsap.fromTo(visible, { opacity:0, y:10 }, { opacity:1, y:0, duration:.35, stagger:.04, ease:'power2.out' });
        }
      });
    }else{
      allCards.forEach(c=> c.classList.toggle('show', c.dataset.cat === cat));
    }
  });
});

/* ---- changelog ---- */
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

window.addEventListener('storage', (e)=>{
  if(e.key === 'jarvis_changelog_md') renderChangelog();
});

/* ---- bootstrap ---- */
window.addEventListener('DOMContentLoaded', ()=>{
  initScrollReveals();
  if(document.readyState === 'complete') {
    const loader = document.getElementById('loader');
    if(loader && loader.style.display !== 'none'){
      gsap.to(loader, { opacity:0, duration:.5, onComplete:()=>{ loader.style.display='none'; playHeroIntro(); } });
    }
  }
});
