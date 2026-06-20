/* ============================================================
   THENUX JARVIS — admin.js
   Client-side password gate + changelog editor.
   NOTE: this is a convenience lock for a single-operator static
   site, not a secure auth system — anyone with the password (or
   browser devtools) can edit. Don't store real secrets here.
   ============================================================ */

const ADMIN_PASSWORD = "DMS535688";
const STORAGE_KEY = "jarvis_changelog_md";
const SESSION_KEY = "jarvis_admin_unlocked";

const loginScreen = document.getElementById('loginScreen');
const adminPanel  = document.getElementById('adminPanel');
const pwInput     = document.getElementById('pwInput');
const loginBtn    = document.getElementById('loginBtn');
const loginError  = document.getElementById('loginError');

const mdInput     = document.getElementById('mdInput');
const previewBox  = document.getElementById('previewBox');
const saveBtn     = document.getElementById('saveBtn');
const resetBtn    = document.getElementById('resetBtn');
const logoutBtn   = document.getElementById('logoutBtn');
const saveStatus  = document.getElementById('saveStatus');

function unlock(){
  loginScreen.style.display = 'none';
  adminPanel.style.display = 'block';
  loadEditor();
}

function tryLogin(){
  if(pwInput.value === ADMIN_PASSWORD){
    sessionStorage.setItem(SESSION_KEY, '1');
    unlock();
  }else{
    loginError.classList.add('show');
    pwInput.value = '';
    pwInput.focus();
  }
}

loginBtn.addEventListener('click', tryLogin);
pwInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') tryLogin(); });

if(sessionStorage.getItem(SESSION_KEY) === '1'){
  unlock();
}

logoutBtn?.addEventListener('click', ()=>{
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ---- editor ---- */
function loadEditor(){
  const stored = localStorage.getItem(STORAGE_KEY);
  mdInput.value = stored && stored.trim().length ? stored : '';
  if(!mdInput.value){
    mdInput.placeholder = "Paste your UPDATES.md changelog here, then click Save.";
  }
  updatePreview();
}

function updatePreview(){
  if(window.marked){
    previewBox.innerHTML = window.marked.parse(mdInput.value || "_Nothing here yet — paste your changelog markdown on the left._");
  }
}

mdInput.addEventListener('input', updatePreview);

saveBtn.addEventListener('click', ()=>{
  localStorage.setItem(STORAGE_KEY, mdInput.value);
  flashStatus('Saved — live on site.');
});

resetBtn.addEventListener('click', ()=>{
  if(confirm('Reset to the default changelog? This clears your custom edits.')){
    localStorage.removeItem(STORAGE_KEY);
    mdInput.value = '';
    updatePreview();
    flashStatus('Reset to default.');
  }
});

function flashStatus(msg){
  saveStatus.textContent = msg;
  saveStatus.classList.add('show');
  setTimeout(()=> saveStatus.classList.remove('show'), 2200);
}
