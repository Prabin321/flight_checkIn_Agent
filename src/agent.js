/**
 * agent.js
 * Core logic for the Flight Check-in Agent.
 * Handles: flight state, countdown ticker, alarms, notifications, AI chat.
 */

// ── State ──────────────────────────────────────────────────────────────────
let fd = null;           // current flight data
let ticker = null;       // setInterval handle
let earlyFired = false;  // 30-min warning sent?
let openFired = false;   // open alarm sent?
let titleFlash = null;   // title flash interval
const origTitle = document.title;

// ── Tab switching ──────────────────────────────────────────────────────────
const PANES = ['setup', 'watch', 'notify', 'chat'];

function sw(name) {
  PANES.forEach(p => {
    document.getElementById('pn-' + p).classList.add('hidden');
    document.getElementById('tb-' + p).classList.remove('active');
  });
  document.getElementById('pn-' + name).classList.remove('hidden');
  document.getElementById('tb-' + name).classList.add('active');
  if (name === 'watch' && fd) refreshWatch();
}

// ── Save flight ────────────────────────────────────────────────────────────
function saveFlight() {
  const sel = document.getElementById('airline').value;
  const depDate = document.getElementById('depDate').value;
  const depTime = document.getElementById('depTime').value;

  if (!sel || !depDate || !depTime) {
    alert('Please fill in airline, departure date, and departure time.');
    return;
  }

  const parts = sel.split('|');
  const aiName = parts[0];
  const ai = AIRLINES[aiName] || { windowHrs: 24, baseUrl: parts[1], deepUrl: parts[3] };

  const dep = new Date(depDate + 'T' + depTime);
  const checkin = new Date(dep.getTime() - ai.windowHrs * 3_600_000);
  const early = new Date(checkin.getTime() - 30 * 60_000);
  const lastName = (document.getElementById('lastName').value || '').trim();
  const pnr = (document.getElementById('pnr').value || '').trim().toUpperCase();
  const from = (document.getElementById('fromCity').value || '').trim();
  const to = (document.getElementById('toCity').value || '').trim();
  const flightNum = (document.getElementById('flightNum').value || '').trim();

  const deepUrl = ai.deepUrl
    .replace('{PNR}', encodeURIComponent(pnr))
    .replace('{LAST}', encodeURIComponent(lastName));

  fd = { ai, aiName, dep, checkin, early, lastName, pnr, from, to, flightNum, deepUrl };
  earlyFired = false;
  openFired = false;

  if (ticker) clearInterval(ticker);
  ticker = setInterval(tick, 1000);

  sw('watch');
}

// ── Refresh watch panel ────────────────────────────────────────────────────
function refreshWatch() {
  if (!fd) {
    document.getElementById('no-flight').classList.remove('hidden');
    document.getElementById('watch-content').classList.add('hidden');
    return;
  }
  document.getElementById('no-flight').classList.add('hidden');
  document.getElementById('watch-content').classList.remove('hidden');

  document.getElementById('s-flight').textContent = [fd.aiName, fd.flightNum].filter(Boolean).join(' · ') || '—';
  document.getElementById('s-route').textContent = [fd.from, fd.to].filter(Boolean).join(' → ') || '—';
  document.getElementById('s-dep').textContent = fmt(fd.dep);
  document.getElementById('s-open').textContent = fmt(fd.checkin) + ' (' + fd.ai.windowHrs + 'h before)';
  document.getElementById('s-pnr').textContent = fd.pnr || '—';

  document.getElementById('tl1-sub').textContent = 'Just now';
  document.getElementById('tl2-sub').textContent = fmt(fd.checkin);
  document.getElementById('tl3-sub').textContent = fmt(fd.dep);
  document.getElementById('tl4-sub').textContent = fmt(new Date(fd.dep.getTime() - 3_600_000));
}

// ── Countdown tick ─────────────────────────────────────────────────────────
function tick() {
  if (!fd) return;
  const now = new Date();
  const msOpen = fd.checkin - now;
  const msDep  = fd.dep - now;

  const cd  = document.getElementById('cd-display');
  const cl  = document.getElementById('cd-label');
  const ab  = document.getElementById('agent-badge');
  const sb  = document.getElementById('sum-badge');

  if (msDep < 0) {
    cd.textContent = 'Departed';
    cl.textContent = 'Your flight has taken off';
    ab.className = 'badge badge-danger';
    ab.innerHTML = '<span class="dot"></span> Departed';
    sb.className = 'badge badge-danger';
    sb.textContent = 'Departed';
    clearInterval(ticker);
    stopTitleFlash();
    return;
  }

  if (msOpen <= 0) {
    // Check-in is open
    const h = Math.floor(msDep / 3_600_000);
    const m = Math.floor((msDep % 3_600_000) / 60_000);
    const s = Math.floor((msDep % 60_000) / 1_000);
    cd.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    cl.textContent = 'until departure — CHECK IN NOW!';
    ab.className = 'badge badge-success pulse-badge';
    ab.innerHTML = '<span class="dot pulse"></span> Check-in OPEN';
    sb.className = 'badge badge-success';
    sb.textContent = 'Check-in open';
    document.getElementById('launch-zone').classList.remove('hidden');
    document.getElementById('waiting-zone').classList.add('hidden');
    document.getElementById('tl2').classList.add('done');
    if (!openFired) { openFired = true; fireAlarm('open'); }
  } else {
    // Still waiting
    const d = Math.floor(msOpen / 86_400_000);
    const h = Math.floor((msOpen % 86_400_000) / 3_600_000);
    const m = Math.floor((msOpen % 3_600_000) / 60_000);
    const s = Math.floor((msOpen % 60_000) / 1_000);
    cd.textContent = d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${pad(h)}:${pad(m)}:${pad(s)}`;
    cl.textContent = 'until check-in opens — agent is watching';
    ab.className = 'badge badge-warning pulse-badge';
    ab.innerHTML = '<span class="dot pulse"></span> Agent watching';
    sb.className = 'badge badge-info';
    sb.textContent = 'Not open yet';

    if (!earlyFired && msOpen <= 30 * 60_000) {
      earlyFired = true;
      if (document.getElementById('tog-early').checked) fireAlarm('early');
    }
  }
}

// ── Launch check-in ────────────────────────────────────────────────────────
function launchCheckin() {
  window.open(fd.deepUrl, '_blank');
}

// ── Alarms ────────────────────────────────────────────────────────────────
function playChime(type) {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const notes = type === 'open' ? [523, 659, 784, 1047] : [523, 659];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ac.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
      gain.gain.linearRampToValueAtTime(0, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch (e) { /* AudioContext not available */ }
}

function testAlarm() { playChime('open'); }

function fireAlarm(type) {
  if (document.getElementById('tog-sound').checked) playChime(type);

  if (document.getElementById('tog-browser').checked && Notification.permission === 'granted') {
    const body = type === 'open'
      ? `Check-in is OPEN for ${fd.aiName} ${fd.flightNum || ''}! Launch now.`
      : `Check-in opens in 30 minutes — get ready!`;
    new Notification('✈ Flight Check-in Agent', { body });
  }

  if (type === 'open' && document.getElementById('tog-title').checked) startTitleFlash();
}

function startTitleFlash() {
  let on = true;
  titleFlash = setInterval(() => {
    document.title = on ? '✈ CHECK IN NOW!' : origTitle;
    on = !on;
  }, 800);
}

function stopTitleFlash() {
  if (titleFlash) { clearInterval(titleFlash); document.title = origTitle; }
}

async function reqNotifPermission() {
  const st = document.getElementById('notif-status');
  if (!('Notification' in window)) { st.textContent = 'Notifications not supported in this browser.'; return; }
  const p = await Notification.requestPermission();
  st.textContent = p === 'granted'
    ? '✓ Permission granted — you will get pop-up alerts.'
    : `Permission ${p}. Enable in browser settings if you want notifications.`;
}

function toggleBrowser(cb) {
  if (cb.checked) reqNotifPermission();
}

// ── AI Chat ────────────────────────────────────────────────────────────────
async function sendChat() {
  const inp = document.getElementById('chat-in');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';

  const box = document.getElementById('chat-msgs');
  appendMsg(box, msg, 'user');

  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg';
  typingEl.innerHTML = 'Thinking<span id="ld-dots">...</span>';
  box.appendChild(typingEl);
  box.scrollTop = box.scrollHeight;

  let ctx = '';
  if (fd) {
    ctx = `User's flight: ${fd.aiName} ${fd.flightNum || ''}, from ${fd.from || '?'} to ${fd.to || '?'}, ` +
          `departs ${fmt(fd.dep)}, check-in opens ${fmt(fd.checkin)}, ` +
          `PNR: ${fd.pnr || 'not provided'}, last name: ${fd.lastName || 'not provided'}.`;
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You are a friendly, expert flight assistant. Answer in 2-4 concise sentences. ${ctx}`,
        messages: [{ role: 'user', content: msg }],
      }),
    });
    const data = await res.json();
    const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, I could not get a response. Please try again.';
    typingEl.remove();
    appendMsg(box, reply, 'agent');
  } catch (e) {
    typingEl.remove();
    appendMsg(box, 'Connection error. Please try again.', 'agent');
  }
  box.scrollTop = box.scrollHeight;
}

function appendMsg(box, text, role) {
  const el = document.createElement('div');
  el.className = 'chat-msg' + (role === 'user' ? ' user' : '');
  el.textContent = text;
  box.appendChild(el);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function fmt(dt) {
  return dt.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('depDate');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
});
