/* ============================================================
   SHERISE CHEUNG — PORTFOLIO  |  script.js
   ============================================================ */

/* ── Clock ── */
function tick() {
  const now = new Date();
  document.getElementById('clk').textContent =
    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
}
tick();
setInterval(tick, 15000);

/* ── Window size config (fraction of desktop) ── */
const WIN_SIZES = {
  'win-about':   { w: 0.70, h: 0.82 },
  'win-contact': { w: 0.45, h: null },
  'win-designs': { w: 0.45, h: null },
  'win-resume':  { w: 0.70, h: 0.82 },
  'win-p1':      { w: 0.70, h: 0.82 },
  'win-p2':      { w: 0.70, h: 0.82 },
  'win-p3':      { w: 0.70, h: 0.82 },
  'win-p4':      { w: 0.70, h: 0.82 },
  'win-p5':      { w: 0.70, h: 0.82 },
};

function applySize(id) {
  const el = document.getElementById(id);
  const d  = document.getElementById('desktop');
  const s  = WIN_SIZES[id];
  if (!s) return;
  const w = Math.round(d.offsetWidth * s.w);
  el.style.width = w + 'px';
  const hFrac = s.h || 0.75;
  el.style.maxHeight = Math.round(d.offsetHeight * hFrac) + 'px';
  if (!el._placed) {
    el.style.left = Math.round((d.offsetWidth  - w) / 2) + 'px';
    el.style.top  = Math.max(28, Math.round((d.offsetHeight - d.offsetHeight * hFrac) / 2)) + 'px';
  }
}

/* ── Z-index ── */
let zTop = 10;
function bringToFront(id) {
  zTop++;
  document.getElementById(id).style.zIndex = zTop;
  document.querySelectorAll('.tbar').forEach(t => t.classList.add('inactive'));
  document.getElementById(id).querySelector('.tbar').classList.remove('inactive');
}

/* ── Checklist ── */
const checks = { about: false, designs: false, project: false, resume: false, contact: false };

function tickCheck(key) {
  if (checks[key]) return;
  checks[key] = true;
  const li = document.getElementById('cl-' + key);
  if (li) li.classList.add('done');
  const done = Object.values(checks).filter(Boolean).length;
  document.getElementById('cl-count').textContent = done + ' / 5 explored';
  document.getElementById('cl-bar').style.width = (done / 5 * 100) + '%';
}

/* ── Open / Close ── */
function openW(name) {
  const id = 'win-' + name;
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  applySize(id);
  el._placed = true;
  bringToFront(id);
  if (name === 'about')   tickCheck('about');
  if (name === 'contact') tickCheck('contact');
  if (name === 'designs') tickCheck('designs');
  if (name === 'resume')  tickCheck('resume');
  if (['p1','p2','p3','p4','p5'].includes(name)) tickCheck('project');
}

function closeW(id) {
  document.getElementById(id).classList.add('hidden');
}

/* ── Maximize / Restore ── */
const prevState = {};
function toggleMax(id) {
  const el = document.getElementById(id);
  if (el.classList.contains('maximized')) {
    el.classList.remove('maximized');
    const s = prevState[id];
    if (s) { el.style.top = s.top; el.style.left = s.left; el.style.width = s.width; el.style.maxHeight = s.maxHeight; }
  } else {
    prevState[id] = { top: el.style.top, left: el.style.left, width: el.style.width, maxHeight: el.style.maxHeight };
    el.classList.add('maximized');
    el.style.maxHeight = 'none';
  }
  bringToFront(id);
}

/* ── Drag ── */
let dragging = null, ox = 0, oy = 0;

function startDrag(e, id) {
  const el = document.getElementById(id);
  if (el.classList.contains('maximized')) return;
  bringToFront(id);
  dragging = el;
  ox = e.clientX - el.offsetLeft;
  oy = e.clientY - el.offsetTop;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
}

function onDrag(e) {
  if (!dragging) return;
  const d = document.getElementById('desktop');
  dragging.style.left = Math.max(0, Math.min(e.clientX - ox, d.offsetWidth  - dragging.offsetWidth))  + 'px';
  dragging.style.top  = Math.max(24, Math.min(e.clientY - oy, d.offsetHeight - 30)) + 'px';
}

function stopDrag() {
  dragging = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

/* ── Focus on click ── */
document.querySelectorAll('.win').forEach(w => {
  w.addEventListener('mousedown', () => bringToFront(w.id));
});

/* ── Link button pressed state ── */
document.querySelectorAll('.proj-link').forEach(btn => {
  btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
  btn.addEventListener('mouseup',   () => setTimeout(() => btn.classList.remove('pressed'), 200));
});
