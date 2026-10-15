/* SMJC 3263 Separation Process 1 — Gamified Leaderboard: state, logic and rendering */
(() => {
  'use strict';

  // ---------- Config ----------
  const COURSE = { code: 'SMJC 3263', name: 'Separation Process 1', session: '2026/2027-I',
    lecturer: 'AP Ir Ts Dr Mariam Firdhaus Md Nordin' };
  const PM_TASK_REQ = 90; // Plant Manager also needs Task Completion ≥ 90%
  const GOALS = { attendance: 80, tasks: 80 };

  // Career ladder follows the course's unit-operation sequence
  const ROLES = [
    { name: 'Separation Intern', icon: '🦺', min: 0, desc: 'Types of separation processes' },
    { name: 'Humidification Operator', icon: '💨', min: 300, desc: 'Continuous humidification' },
    { name: 'Absorption Tower Technician', icon: '🗼', min: 450, desc: 'Plate & packed tower absorption' },
    { name: 'Leaching Specialist', icon: '🍃', min: 600, desc: 'Single & counter-current multistage leaching' },
    { name: 'Head of Process Engineer', icon: '👷', min: 750, desc: 'VLE & McCabe-Thiele distillation' },
    { name: 'Plant Manager', icon: '🧑‍💼', min: 900, desc: `Liquid-liquid extraction mastery · needs ≥${PM_TASK_REQ}% tasks` },
  ];

  // XP activities mapped to the course's T&L methods (Lecture/Discussion, Active learning, PBL)
  const ACTIVITIES = [
    { id: 'al', name: 'In-class Active-Learning Activity', xp: 30, badge: '⚡ Active Learner' },
    { id: 'quiz', name: 'Quiz / Assignment Submitted', xp: 40, badge: '📝 Quiz Finisher' },
    { id: 'tut', name: 'Tutorial Problem Solved on Whiteboard', xp: 50, badge: '📐 Whiteboard Solver' },
    { id: 'proj', name: 'Project Progress Presentation (PBL)', xp: 75, badge: '🏗️ Project Presenter' },
    { id: 'peer', name: 'Teamwork / Peer Mentorship (CLO4)', xp: 30, badge: '🤝 Team Player' },
  ];

  const WEEKS = [
    { w: 1, t: 'Introduction; Types of Separation Processes', clo: [1] },
    { w: 2, t: 'Continuous Humidification Processes', clo: [1, 2, 3] },
    { w: 3, t: 'Absorption in Plate and Packed Towers', clo: [1, 2, 3] },
    { w: 4, t: 'Absorption of Concentrated Mixtures', clo: [2, 3] },
    { w: 5, t: 'Mass Transfer Coefficients for Packed Towers', clo: [2, 3] },
    { w: 6, t: 'Leaching Equipment & Single-Stage Leaching', clo: [1] },
    { w: 7, t: 'Counter-Current Multistage Leaching', clo: [2, 3] },
    { w: 8, t: 'Vapour-Liquid Equilibrium Relation', clo: [1, 2] },
    { w: 9, t: 'Single-Stage Equilibrium Contact (VLE)', clo: [1, 2] },
    { w: 10, t: 'Simple Distillation Methods', clo: [2, 3] },
    { w: 11, t: 'Binary Fractional Distillation (McCabe-Thiele)', clo: [2, 3] },
    { w: 12, t: 'Single-Stage Liquid-Liquid Extraction', clo: [2, 3] },
    { w: 13, t: 'Equipment for Liquid-Liquid Extraction', clo: [1] },
    { w: 14, t: 'Project Presentations and Revisions', clo: [4, 5] },
  ];

  // Unit-operation badges: earned when every week of that unit is completed
  const UNITS = [
    { id: 'hum', name: 'Humidification', badge: '💨 Humidity Handler', weeks: [2] },
    { id: 'abs', name: 'Absorption', badge: '🗼 Tower Tamer', weeks: [3, 4, 5] },
    { id: 'lea', name: 'Leaching', badge: '🍃 Leaching Lead', weeks: [6, 7] },
    { id: 'dis', name: 'VLE & Distillation', badge: '📐 McCabe-Thiele Master', weeks: [8, 9, 10, 11] },
    { id: 'lle', name: 'Liquid-Liquid Extraction', badge: '🧴 Extraction Expert', weeks: [12, 13] },
  ];

  // Official assessment weightings (Section 6 of the course information)
  const ASSESS = [
    { id: 'quiz', name: 'Quiz / Assignment', w: 20 },
    { id: 't1', name: 'Test 1', w: 20 },
    { id: 'proj', name: 'Project', w: 20 },
    { id: 'final', name: 'Final Examination', w: 40 },
  ];

  const AVATARS = ['🦺','⚙️','🧪','🔬','👷','🧑‍💼','⚗️','🧫','🛢️','🏭','🌡️','💧','🔥','🧊','🧲','🦉','🐼','🦊','🐯','🚀'];

const STUDENT_NAMES = [
  'AAINAA AAQILAH BINTI MOHAMAD YUSOF','DZILHAMADIL AKHYAR BIN HAMRAN',
  'HANAN NABIL MOHAMMED ABDO ALABSI','MUQRI NAUFAL BIN MOHD NAJIB',
  'NASHVIN A/L MANIARASAN','NURUL AIDA BATRISYIA BINTI ROSLI',
  'TEHSIGAN A/L SARAVANAN','YASHWINI A/P VIJENTHRAN',
  'ALISSA BINTI REDUAN CHIN','AMMAR ARSYAD BIN MD.MOHTAR',
  'ARTHUR LO WEI HAO','CHIEW XIN RONG','HAU LEE MIN',
  'IRINA SYUHADA BINTI FADIL','MUHAMMAD ARIFF HUSNI BIN ABDUL RAZAK',
  'NEHAVATHI A/P VALLMURUGAN','NOR ALYA FARISHA BINTI LATIF','PEK JIE MIN',
  'PUTERI AINA MAISYARAH BINTI SULAIMAN','PUTRI NUR AFIQAH AUNI BINTI NUR MIZHUARI',
  'SITI NUR AMALINA BINTI AZHARI','TAN SEE JIE',
  'VIVIANA ARLIN ANAK VINCENT','IZZAT BIN MAZLAN'
];

  // ---------- Seed dataset (N = 24) ----------
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const pad = n => String(n).padStart(2, '0');
  function seed() {
    const s = [];
    const top = [960, 925, 880, 850, 820];
    top.forEach((xp, i) => s.push({
      id: i + 1, tier: 'Top', pseudo: `Participant_Top_${pad(i + 1)}`, xp,
      att: [98, 96, 95, 93, 92][i], task: [97, 95, 92, 90, 88][i], mid: [88, 86, 84, 82, 80][i],
    }));
    for (let i = 0; i < 15; i++) {
      const t = i / 14, n = i + 6;
      s.push({
        id: n, tier: 'Mid', pseudo: `Participant_Mid_${pad(n)}`,
        xp: i === 7 ? s[s.length - 1].xp : lerp(740, 320, t), // deliberate XP tie to showcase tie-breaking
        att: lerp(88, 65, t) + (i % 3 === 0 ? 1 : 0), task: lerp(80, 48, t) - (i % 4 === 1 ? 2 : 0), mid: lerp(77, 50, t),
      });
    }
    for (let i = 0; i < 4; i++) {
      const t = i / 4, n = i + 21;
      s.push({
        id: n, tier: 'Low', pseudo: `Participant_Low_${pad(n)}`,
        xp: lerp(280, 110, t), att: lerp(62, 50, t), task: lerp(45, 25, t), mid: lerp(48, 35, t),
      });
    }
    s.forEach((st, i) => {
      st.avatar = AVATARS[(i * 7) % AVATARS.length];
      st.realName = STUDENT_NAMES[i] || null;
      st.showReal = !!STUDENT_NAMES[i];
      // seed some prior activity history for badges
      st.acts = {};
      ACTIVITIES.forEach((a, j) => { if ((st.id + j) % (st.tier === 'Top' ? 2 : st.tier === 'Mid' ? 3 : 5) === 0) st.acts[a.id] = 1; });
      st.weeks = [1];
      st.marks = { quiz: Math.min(100, st.mid + 5), t1: st.mid, proj: null, final: null };
    });
    return s;
  }

  // ---------- State & Firebase Firestore Integration ----------
  const firebaseConfig = {
    apiKey: "AIzaSyAKHHzWtUu_AcKttp0RmIAgkSkO6NlFNyQ",
    authDomain: "smjc3263.firebaseapp.com",
    projectId: "smjc3263",
    storageBucket: "smjc3263.firebasestorage.app",
    messagingSenderId: "917322283917",
    appId: "1:917322283917:web:cb0729e3d23a06bdb79bc4",
    measurementId: "G-7268PHL9RT"
  };

  let db = null;
  let isFirestoreOnline = false;
  try {
    if (window.firebase) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
    }
  } catch (err) {
    console.warn('Firebase init warning:', err);
  }

  const STORE_KEY = 'smjc3263_state_v1';
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  const legacy = JSON.parse(localStorage.getItem('smjc3283_state_v1') || 'null'); // keep issued logins
  const state = saved || {
    students: seed(), meId: 12, mode: 'absolute', search: '', role: '',
    creds: legacy?.creds, adminPw: legacy?.adminPw,
    stream: [
      { msg: `Semester ${COURSE.session} leaderboard initialised for ${COURSE.code} ${COURSE.name} (N = 24).`, ts: Date.now() - 3600e3, promo: false },
    ],
  };
  function enforceRoster() {
    if (!Array.isArray(state.students)) return false;
    const before = state.students.length;
    state.students = state.students.filter(s => s.id >= 1 && s.id <= STUDENT_NAMES.length);
    let changed = state.students.length !== before;
    if (state.creds) Object.keys(state.creds).forEach(k => {
      if (+k < 1 || +k > STUDENT_NAMES.length) { delete state.creds[k]; changed = true; }
    });
    if (state.meId < 1 || state.meId > STUDENT_NAMES.length) { state.meId = 1; changed = true; }
    return changed;
  }
  enforceRoster();

  function updateCloudStatus(status, text) {
    const el = document.getElementById('cloud-status');
    if (!el) return;
    el.className = 'cloud-status ' + (status || '');
    el.innerHTML = text;
  }

  let isApplyingRemoteUpdate = false;
  let cloudReady = false; // don't write to cloud until we've loaded the cloud copy first
  let saveTimer = null;
  const persist = (syncCloud = true) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    if (db && syncCloud && cloudReady && !isApplyingRemoteUpdate) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          updateCloudStatus('online', '☁️ Synced');
          await db.collection('leaderboard').doc('main_state').set({
            students: state.students,
            creds: state.creds,
            adminPw: state.adminPw,
            stream: state.stream,
            updatedAt: Date.now()
          });
          updateCloudStatus('online', '☁️ Synced');
        } catch (e) {
          console.warn('Firestore write error:', e);
          updateCloudStatus('offline', '☁️ Offline');
        }
      }, 500);
    }
  };

  function initFirestoreSync() {
    if (!db) {
      updateCloudStatus('offline', '☁️ Offline');
      return;
    }
    updateCloudStatus('', '☁️ Syncing...');
    db.collection('leaderboard').doc('main_state').onSnapshot((doc) => {
      if (doc.exists) {
        const cloudData = doc.data();
        let changed = false;
        let restoreCloud = false;
        const isEmpty = v => v == null || v === '' ||
          (Array.isArray(v) ? v.length === 0 : typeof v === 'object' && Object.keys(v).length === 0);
        // For every saved field: cloud wins when it has data; an empty/missing cloud field never
        // wipes local data. Instead, this browser pushes its copy back to the cloud.
        ['students', 'creds', 'adminPw', 'stream'].forEach(key => {
          const cloudVal = cloudData[key];
          if (key === 'students' && cloudVal != null && !Array.isArray(cloudVal)) return;
          if (!isEmpty(cloudVal)) {
            if (JSON.stringify(state[key]) !== JSON.stringify(cloudVal)) {
              state[key] = cloudVal;
              changed = true;
            }
          } else if (!isEmpty(state[key]) && !cloudReady) {
            restoreCloud = true;
          }
        });
        state.students.forEach(prepareStudent);
        // The cloud copy may predate a roster change; never restore removed participants.
        if (enforceRoster()) restoreCloud = true;
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        updateCloudStatus('online', '☁️ Synced');
        cloudReady = true;
        if (changed) {
          isApplyingRemoteUpdate = true;
          render(false);
          isApplyingRemoteUpdate = false;
        }
        if (restoreCloud) persist(true);
      } else {
        cloudReady = true;
        persist(true);
      }
    }, (err) => {
      console.warn('Firestore listener error:', err);
      updateCloudStatus('offline', '☁️ Offline');
    });
  }

  state.creds = state.creds || {};          // { [studentId]: { uid, pw } }
  state.adminPw = state.adminPw || 'admin123';
  state.students.forEach(prepareStudent);

  // Attendance is stored per class session: 14 weeks × 2 sessions = 28 ticks.
  // Existing percentage-only data is converted once so established records are retained.
  function prepareStudent(s) {
    s.weeks = s.weeks || [];
    s.marks = s.marks || {};
    if (!Array.isArray(s.attendance) || s.attendance.length !== 28) {
      const attended = Math.max(0, Math.min(28, Math.round((Number(s.att) || 0) * 28 / 100)));
      s.attendance = Array.from({ length: 28 }, (_, i) => i < attended);
    }
    s.att = Math.round(s.attendance.filter(Boolean).length / 28 * 1000) / 10;
    if (!s.realName) {
      s.realName = STUDENT_NAMES[s.id - 1] || null;
      s.showReal = !!s.realName;
    }
  }

  // ---------- Logic ----------
  function roleIndex(st) {
    let idx = 0;
    ROLES.forEach((r, i) => { if (st.xp >= r.min) idx = i; });
    if (idx === 5 && st.task < PM_TASK_REQ) idx = 4;
    return idx;
  }
  function badgesOf(st) {
    const b = [];
    if (st.att >= 90) b.push('📅 Perfect Presence');
    if (st.task >= 85) b.push('✅ Task Master');
    const tests = [st.marks.t1].filter(v => v != null);
    if (tests.length && tests.reduce((a, v) => a + v, 0) / tests.length >= 80) b.push('🎯 Test Ace');
    ACTIVITIES.forEach(a => { if (st.acts[a.id]) b.push(a.badge + (st.acts[a.id] > 1 ? ` ×${st.acts[a.id]}` : '')); });
    UNITS.forEach(u => { if (u.weeks.every(w => st.weeks.includes(w))) b.push(u.badge); });
    return b;
  }
  const fmt = v => String(Math.round(v * 10) / 10);
  const carryMark = st => ASSESS.slice(0, 4).reduce((a, x) => a + (st.marks[x.id] != null ? x.w * st.marks[x.id] / 100 : 0), 0);
  const totalMark = st => ASSESS.reduce((a, x) => a + (st.marks[x.id] != null ? x.w * st.marks[x.id] / 100 : 0), 0);
  const GRADES = [[90, 'A+'], [80, 'A'], [75, 'A-'], [70, 'B+'], [65, 'B'], [60, 'B-'], [55, 'C+'], [50, 'C'], [45, 'C-'], [40, 'D+'], [35, 'D'], [30, 'D-'], [0, 'E']];
  const grade = t => GRADES.find(([min]) => t >= min)[1];
  function ranked() {
    const sorted = [...state.students].sort((a, b) => b.xp - a.xp || b.task - a.task || b.att - a.att || a.id - b.id);
    let rank = 0, prev = null;
    return sorted.map((st, i) => {
      if (i === 0 || st.xp !== prev.xp || st.att !== prev.att) {
        rank = i + 1;
      }
      prev = st;
      return { ...st, rank, ri: roleIndex(st) };
    });
  }
  const me = () => state.students.find(s => s.id === state.meId);
  // Display name: real name only when the participant has opted in, otherwise their pseudonym
  const dn = s => (s.showReal && s.realName) ? s.realName : s.pseudo;

  // ---------- Helpers ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const timeAgo = ts => {
    const d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return `${Math.floor(d / 60)} min ago`;
    if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
    return `${Math.floor(d / 86400)} d ago`;
  };
  function toast(msg, promo = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (promo ? ' promo' : '');
    el.innerHTML = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, promo ? 5000 : 3200);
  }
  let flashId = null;

  // ---------- Render ----------
  function renderHub(list) {
    const m = list.find(s => s.id === state.meId);
    const r = ROLES[m.ri];
    $('#btn-avatar').textContent = m.avatar;
    $('#my-pseudo').textContent = dn(m);
    $('#toggle-real').checked = !!(m.showReal && m.realName);
    $('#real-hint').textContent = m.showReal && m.realName
      ? 'Classmates see your real name'
      : `Anonymous · shown as ${m.pseudo}`;
    $('#my-role').className = `role-chip r${m.ri}`;
    $('#my-role').textContent = `${r.icon} ${r.name}`;
    $('#my-rank').textContent = `#${m.rank}`;
    $('#my-xp').textContent = `${m.xp} XP`;

    let pct, next;
    if (m.ri < 5) {
      const nx = ROLES[m.ri + 1];
      const lo = r.min, hi = nx.min;
      if (m.xp >= hi) { // eligible by XP but blocked by task gate
        pct = 100; next = `Raise tasks to ${PM_TASK_REQ}% to become ${nx.icon} ${nx.name}`;
      } else {
        pct = ((m.xp - lo) / (hi - lo)) * 100;
        next = `${hi - m.xp} XP to ${nx.icon} ${nx.name}`;
      }
    } else { pct = 100; next = '🏅 Top tier reached'; }
    $('#progress-fill').style.width = `${Math.max(3, Math.min(100, pct))}%`;
    $('#next-tier').textContent = next;

    const metric = (lbl, v, goal) => `<div class="lbl">${lbl}</div><div class="val">${v}%</div>` +
      (goal != null ? `<div class="goal ${v >= goal ? 'ok' : 'no'}">${v >= goal ? '✓ Goal' : 'Goal'} ≥${goal}%</div>` : `<div class="goal">Assessment</div>`);
    $('#m-att').innerHTML = metric('Attendance', m.att, GOALS.attendance);
    $('#m-task').innerHTML = metric('Tasks Done', m.task, GOALS.tasks);
    $('#m-mid').innerHTML = `<div class="lbl">Carry Mark</div><div class="val">${fmt(carryMark(m))}<small>/50</small></div><div class="goal">Coursework</div>`;

    $('#my-marks').innerHTML = ASSESS.map(a => {
      const v = m.marks[a.id];
      return `<div class="mk ${v == null ? 'pending' : ''}"><div class="mk-n">${a.name}</div>
        <div class="mk-v mono">${v == null ? '—' : v + '%'}</div>
        <div class="mk-w mono">${v == null ? `worth ${a.w}%` : `${fmt(a.w * v / 100)} / ${a.w}`}</div></div>`;
    }).join('') + `<div class="mk total"><div class="mk-n">Running Total</div><div class="mk-v mono">${fmt(totalMark(m))}</div><div class="mk-w">/ 100</div></div>`;

    const done = new Set(m.weeks);
    $('#week-count').textContent = `${done.size}/14 weeks completed`;
    $('#week-grid').innerHTML = WEEKS.map(w =>
      `<div class="wk ${done.has(w.w) ? 'done' : ''}" title="Week ${w.w}: ${w.t}"><b>W${w.w}</b><span>${w.t}</span><em>${w.clo.map(c => 'CLO' + c).join(' · ')}</em></div>`
    ).join('');

    const earned = badgesOf(m);
    const all = ['📅 Perfect Presence', '✅ Task Master', '🎯 Test Ace', ...ACTIVITIES.map(a => a.badge), ...UNITS.map(u => u.badge)];
    const locked = all.filter(b => !earned.some(e => e.startsWith(b)));
    $('#my-badges').innerHTML = earned.map(b => `<span class="badge">${esc(b)}</span>`).join('') +
      locked.map(b => `<span class="badge locked" title="Not yet earned">${esc(b)}</span>`).join('');

    $('#ladder').innerHTML = ROLES.map((ro, i) => {
      const hi = ROLES[i + 1] ? `${ro.min}–${ROLES[i + 1].min - 1}` : `${ro.min}+`;
      return `<li class="r${i} ${i === m.ri ? 'cur' : i < m.ri ? 'done' : ''}"><span>${ro.icon}</span><span>${ro.name}</span><span class="rng">${hi} XP</span></li>`;
    }).join('');
  }

  function renderBoard(list) {
    const isGuest = sess?.role === 'guest';
    const m = isGuest ? null : list.find(s => s.id === state.meId);
    let rows = list;
    if (state.mode === 'relative' && !isGuest && m) {
      const i = m.rank - 1;
      let a = Math.max(0, i - 2), b = Math.min(list.length, a + 5);
      a = Math.max(0, b - 5);
      rows = list.slice(a, b);
      $('#mode-hint').textContent = 'Safe view: just you and the 2 peers directly above and below. Aim for the next step, not the summit.';
    } else {
      $('#mode-hint').textContent = isGuest
        ? 'Public view: full cohort ranking with active participants.'
        : 'Full cohort ranking. Everyone is shown under a de-identified pseudonym.';
    }
    const q = state.search.trim().toLowerCase();
    rows = rows.filter(s => {
      if (state.role !== '' && s.ri !== +state.role) return false;
      if (!q) return true;
      return dn(s).toLowerCase().includes(q) || ROLES[s.ri].name.toLowerCase().includes(q) ||
        badgesOf(s).some(b => b.toLowerCase().includes(q));
    });

    $('#lb-body').innerHTML = rows.map(s => {
      const r = ROLES[s.ri];
      const g = s.rank <= 3 ? ` g${s.rank}` : '';
      const isMe = !isGuest && s.id === state.meId;
      const gap = !isGuest && m && state.mode === 'relative' && !isMe
        ? `<span class="gap">${s.xp > m.xp ? '+' + (s.xp - m.xp) + ' ahead' : s.xp < m.xp ? (m.xp - s.xp) + ' behind' : 'level'}</span>` : '';
      return `<tr class="${isMe ? 'me' : ''} ${s.id === flashId ? 'flash' : ''}">
        <td><span class="rk${g}">${s.rank}</span></td>
        <td><div class="who"><span class="av">${s.avatar}</span><div><span class="nm">${esc(dn(s))}</span>${isMe ? '<span class="you">YOU</span>' : ''}</div></div></td>
        <td class="hide-sm"><span class="role-pill r${s.ri}">${r.icon} ${r.name}</span></td>
        <td class="num"><span class="xp">${s.xp}</span>${gap}</td>
        <td class="num hide-md">${s.task}%</td>
        <td class="num hide-md">${s.att}%</td></tr>`;
    }).join('');
    $('#lb-empty').hidden = rows.length > 0;
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  }

  function renderStream() {
    const html = state.stream.slice(0, 40).map(e =>
      `<li class="${e.promo ? 'promo' : ''}"><span>${e.promo ? '🎉' : '⚡'}</span><div><div>${e.msg}</div><div class="t">${timeAgo(e.ts)}</div></div></li>`
    ).join('');
    const el = $('#stream-list');
    if (el && el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }

  function renderSelectors(list) {
    const opt = s => `<option value="${s.id}">${s.tier === 'Top' ? '🟢' : s.tier === 'Mid' ? '🟡' : '🔴'} #${s.rank} ${esc(s.realName || s.pseudo)}</option>`;
    const grp = (t, l) => `<optgroup label="${l}">${list.filter(s => s.tier === t).map(opt).join('')}</optgroup>`;
    const html = grp('Top', 'High engagement') + grp('Mid', 'Moderate engagement') + grp('Low', 'At-risk engagement');
    const va = $('#view-as'), ss = $('#sync-student');
    const keep = ss.value;
    va.innerHTML = html; va.value = state.meId;
    ss.innerHTML = list.map(opt).join(''); ss.value = keep || state.meId;
  }

  function render(triggerCloudSync = true) {
    const list = ranked();
    renderHub(list); renderBoard(list); renderStream(); renderSelectors(list);
    persist(triggerCloudSync);
  }

  // ---------- Static UI init ----------
  $('#role-filter').innerHTML += ROLES.map((r, i) => `<option value="${i}">${r.icon} ${r.name}</option>`).join('');
  $('#sync-acts').innerHTML += ACTIVITIES.map((a, i) =>
    `<label class="act"><input type="radio" name="act" value="${a.id}" ${i === 0 ? 'checked' : ''}/> <span>${a.name}</span><span class="pts">+${a.xp}</span></label>`).join('');

  // ---------- Modals ----------
  const open = id => { $(id).hidden = false; };
  const closeAll = () => document.querySelectorAll('.modal').forEach(m => m.hidden = true);
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) closeAll(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  $('#btn-research').onclick = () => open('#modal-research');
  $('#btn-sync').onclick = () => { $('#sync-student').value = state.meId; open('#modal-sync'); };
  $('#btn-avatar').onclick = () => {
    const cur = me().avatar;
    $('#avatar-grid').innerHTML = AVATARS.map(a => `<button class="${a === cur ? 'sel' : ''}" data-av="${a}">${a}</button>`).join('');
    open('#modal-avatar');
  };
  $('#avatar-grid').onclick = e => {
    const b = e.target.closest('[data-av]'); if (!b) return;
    me().avatar = b.dataset.av; closeAll(); toast(`Avatar updated to ${b.dataset.av}`); render();
  };
  $('#toggle-real').onchange = e => {
    const m = me();
    if (e.target.checked && !m.realName) {
      const v = (prompt('Enter your real name as you want classmates to see it:') || '').trim();
      if (!v) { e.target.checked = false; return; }
      m.realName = v.slice(0, 40);
    }
    m.showReal = e.target.checked;
    toast(m.showReal ? `👤 Now showing your real name: <b>${esc(m.realName)}</b>` : `🕶️ Back to anonymous: <b>${esc(m.pseudo)}</b>`);
    render();
  };
  $('#btn-edit-name').onclick = () => { $('#name-input').value = me().pseudo; open('#modal-name'); setTimeout(() => $('#name-input').select(), 50); };
  $('#name-form').onsubmit = e => {
    e.preventDefault();
    const v = $('#name-input').value.trim().replace(/\s+/g, '_');
    if (state.students.some(s => s.id !== state.meId && s.pseudo.toLowerCase() === v.toLowerCase())) {
      toast('⚠️ That pseudonym is already taken.'); return;
    }
    me().pseudo = v; closeAll(); toast(`Pseudonym saved: <b>${esc(v)}</b>`); render();
  };

  // Participant account settings (Change Login ID / Password)
  const btnToggleAccPw = $('#btn-toggle-acc-pw');
  const accPwInput = $('#acc-pw-input');
  if (btnToggleAccPw && accPwInput) {
    btnToggleAccPw.onclick = () => {
      const isPassword = accPwInput.type === 'password';
      accPwInput.type = isPassword ? 'text' : 'password';
      btnToggleAccPw.textContent = isPassword ? '🙈' : '👁️';
      btnToggleAccPw.title = isPassword ? 'Hide password' : 'Show password';
      btnToggleAccPw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    };
  }

  $('#btn-edit-account').onclick = () => {
    const m = me();
    const c = state.creds[m.id] || { uid: '', pw: '' };
    $('#acc-uid-input').value = c.uid || '';
    $('#acc-pw-input').value = c.pw || '';
    $('#acc-pw-input').type = 'password';
    if (btnToggleAccPw) btnToggleAccPw.textContent = '👁️';
    $('#acc-err').textContent = '';
    open('#modal-account');
    setTimeout(() => $('#acc-uid-input').focus(), 50);
  };

  $('#account-form').onsubmit = e => {
    e.preventDefault();
    const m = me();
    const newUid = $('#acc-uid-input').value.trim().toUpperCase();
    const newPw = $('#acc-pw-input').value.trim();

    // Check if new ID is already taken by another participant
    const duplicate = Object.entries(state.creds || {}).find(([id, c]) => +id !== m.id && c.uid && c.uid.toUpperCase() === newUid);
    if (duplicate) {
      $('#acc-err').textContent = '⚠️ That Login ID is already taken by another participant.';
      return;
    }
    if (newPw.length < 4) {
      $('#acc-err').textContent = '⚠️ Password must be at least 4 characters long.';
      return;
    }

    state.creds[m.id] = { uid: newUid, pw: newPw };
    $('#who').textContent = `🎓 ${newUid}`;
    closeAll();
    toast(`🔑 Login ID updated to <b>${esc(newUid)}</b> and password saved!`);
    render();
  };

  // ---------- Sync submit ----------
  $('#sync-form').onsubmit = e => {
    e.preventDefault();
    const id = +$('#sync-student').value;
    const act = ACTIVITIES.find(a => a.id === document.querySelector('input[name="act"]:checked').value);
    const st = state.students.find(s => s.id === id);
    const before = ranked().find(s => s.id === id);
    st.xp += act.xp;
    st.acts[act.id] = (st.acts[act.id] || 0) + 1;
    st.task = Math.min(100, st.task + 1); // completed in-class task nudges completion rate
    const after = ranked().find(s => s.id === id);
    const note = $('#sync-note').value.trim();
    const wk = +$('#sync-week').value;
    if (wk && !st.weeks.includes(wk)) {
      st.weeks.push(wk); st.weeks.sort((a, b) => a - b);
      const u = UNITS.find(x => x.weeks.includes(wk) && x.weeks.every(w => st.weeks.includes(w)));
      if (u) {
        state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> completed the <b>${u.name}</b> unit and earned ${u.badge}!`, ts: Date.now(), promo: true });
        toast(`🏅 <b>${esc(dn(st))}</b> earned ${u.badge}`, true);
      }
    }

    state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> earned <b>+${act.xp} XP</b> for ${act.name}${note ? ` · <i>${esc(note)}</i>` : ''}`, ts: Date.now() });
    if (after.rank < before.rank) {
      state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> climbed from #${before.rank} to <b>#${after.rank}</b> 📈`, ts: Date.now() });
    }
    if (after.ri > before.ri) {
      const r = ROLES[after.ri];
      state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> promoted to <b>${r.icon} ${r.name}</b>!`, ts: Date.now(), promo: true });
      toast(`🎉 <b>${esc(dn(st))}</b> promoted to ${r.icon} <b>${r.name}</b>!`, true);
    }
    toast(`✅ +${act.xp} XP awarded to <b>${esc(dn(st))}</b> · now #${after.rank}`);
    $('#sync-note').value = '';
    flashId = id; closeAll(); render();
    setTimeout(() => { flashId = null; }, 1700);
  };

  // ---------- Controls ----------
  $('#view-as').onchange = e => { state.meId = +e.target.value; toast(`Now viewing as <b>${esc(me().pseudo)}</b>`); render(); };
  document.querySelectorAll('.seg-btn').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; render(); });
  $('#search').oninput = e => { state.search = e.target.value; render(); };
  $('#role-filter').onchange = e => { state.role = e.target.value; render(); };
  $('#btn-reset').onclick = () => {
    state.search = ''; state.role = ''; state.mode = 'absolute';
    $('#search').value = ''; $('#role-filter').value = '';
    toast('Filters and sort reset'); render();
  };
  $('#btn-clear-all-xp').onclick = () => {
    if (confirm('Clear ALL XP for ALL participants? This cannot be undone.')) {
        state.students.forEach(s => {
            s.xp = 0; s.acts = {}; s.weeks = [1]; s.task = 0;
            prepareStudent(s);
        });
        state.stream = [{ msg: 'Leaderboard XP reset.', ts: Date.now(), promo: false }];
        render(); toast('⚡ All XP cleared.');
    }
  };
  $('#btn-reset').ondblclick = () => {
    if (confirm('Restore the original cohort dataset? This will erase all awarded XP.')) { localStorage.removeItem(STORE_KEY); location.reload(); }
  };

  // ---------- Auth & access management ----------
  const SESS_KEY = 'smjc3283_session';
  let sess = JSON.parse(sessionStorage.getItem(SESS_KEY) || 'null');
  let loginMode = 'participant';
  const rand = (alpha, n) => {
    const a = crypto.getRandomValues(new Uint32Array(n));
    return Array.from(a, x => alpha[x % alpha.length]).join('');
  };
  const genPw = () => rand('ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', 8);
  function genUid() {
    const used = new Set(Object.values(state.creds).map(c => c.uid));
    let u; do { u = 'SP-' + rand('0123456789', 4); } while (used.has(u));
    return u;
  }
  function generateFor(id) { state.creds[id] = { uid: genUid(), pw: genPw() }; }

  function applySession() {
    const ok = !!sess;
    const isGuest = sess?.role === 'guest';
    document.body.classList.toggle('locked', !ok);
    document.body.classList.toggle('is-admin', ok && sess.role === 'admin');
    document.body.classList.toggle('is-guest', ok && isGuest);
    if (!ok) return;
    if (sess.role === 'participant') state.meId = sess.id;
    if (isGuest) {
      state.mode = 'absolute';
      $('#who').textContent = '👀 Guest Viewer';
    } else {
      $('#who').textContent = sess.role === 'admin' ? '🛡️ Admin' : `🎓 ${state.creds[sess.id]?.uid || ''}`;
    }
    render();
  }

  function showLoginScreen() {
    sess = null;
    sessionStorage.removeItem(SESS_KEY);
    closeAll();
    applySession();
  }

  $('#btn-guest-view').onclick = () => {
    sess = { role: 'guest' };
    sessionStorage.setItem(SESS_KEY, JSON.stringify(sess));
    applySession();
    toast('👀 Viewing leaderboard as <b>Guest</b>');
  };

  $('#btn-guest-login').onclick = showLoginScreen;
  const bannerLogin = $('#btn-banner-login');
  if (bannerLogin) bannerLogin.onclick = showLoginScreen;

  document.querySelectorAll('[data-login]').forEach(b => b.onclick = () => {
    loginMode = b.dataset.login;
    document.querySelectorAll('[data-login]').forEach(x => x.classList.toggle('active', x === b));
    $('#lbl-uid').hidden = loginMode === 'admin';
    $('#login-hint').textContent = loginMode === 'admin'
      ? 'Enter the admin password to manage the leaderboard.'
      : 'Your ID and password are issued by your instructor.';
    $('#login-err').textContent = '';
  });

  const pwInput = $('#login-pw');
  const btnTogglePw = $('#btn-toggle-pw');
  if (btnTogglePw && pwInput) {
    btnTogglePw.onclick = () => {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      btnTogglePw.textContent = isPassword ? '🙈' : '👁️';
      btnTogglePw.title = isPassword ? 'Hide password' : 'Show password';
      btnTogglePw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    };
  }

  $('#login-form').onsubmit = e => {
    e.preventDefault();
    const pw = $('#login-pw').value.trim();
    if (loginMode === 'admin') {
      if (pw !== state.adminPw) { $('#login-err').textContent = 'Incorrect admin password.'; return; }
      sess = { role: 'admin' };
    } else {
      const uid = $('#login-uid').value.trim().toUpperCase();
      const hit = Object.entries(state.creds || {}).find(([, c]) => 
        c && c.uid && c.uid.trim().toUpperCase() === uid && c.pw && c.pw.trim() === pw
      );
      if (!hit) {
        if (!state.creds || Object.keys(state.creds).length === 0) {
          $('#login-err').textContent = 'No participant accounts generated yet. Please log in as Admin first to generate IDs.';
        } else {
          $('#login-err').textContent = 'Invalid participant ID or password. Check case sensitivity.';
        }
        return;
      }
      sess = { role: 'participant', id: +hit[0] };
    }
    sessionStorage.setItem(SESS_KEY, JSON.stringify(sess));
    $('#login-pw').value = ''; $('#login-err').textContent = '';
    applySession();
    toast(sess.role === 'admin' ? 'Signed in as <b>Admin</b>' : `Welcome back, <b>${esc(dn(me()))}</b>!`);
  };

  $('#btn-logout').onclick = () => {
    sess = null; sessionStorage.removeItem(SESS_KEY); closeAll(); applySession();
  };

  function renderAdmin() {
    const list = ranked().slice().sort((a, b) => a.id - b.id);
    $('#adm-body').innerHTML = list.map(s => {
      const c = state.creds[s.id];
      return `<tr>
        <td><div class="who-cell"><span class="av">${s.avatar}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>
        <td><input class="rn-in" data-rn="${s.id}" value="${esc(s.realName || '')}" placeholder="Real name" maxlength="40" />${s.showReal ? ' <span title="Shown publicly">👤</span>' : ''}</td>
        <td class="mono">${c ? c.uid : '<span class="muted">—</span>'}</td>
        <td class="mono">${c ? c.pw : '<span class="muted">—</span>'}</td>
        <td class="num adm-act">
          <button class="btn btn-outline sm" data-gen="${s.id}">${c ? '↻ Regenerate' : '✨ Generate'}</button>
          ${c ? `<button class="btn btn-outline sm" data-copy="${s.id}">📋</button><button class="btn btn-outline sm" data-revoke="${s.id}">✕</button>` : ''}
          <button class="btn btn-outline sm" data-remove="${s.id}">🗑️ Remove</button>
        </td></tr>`;
    }).join('');
  }
  const credLine = id => { const s = state.students.find(x => x.id === id), c = state.creds[id]; return `${s.pseudo}\t${c.uid}\t${c.pw}`; };

  $('#btn-admin').onclick = () => { renderAdmin(); open('#modal-admin'); };
  $('#adm-body').onchange = e => {
    const i = e.target; if (!i.dataset.rn) return;
    const st = state.students.find(s => s.id === +i.dataset.rn);
    st.realName = i.value.trim().slice(0, 40);
    if (!st.realName) st.showReal = false;
    toast('Real name saved'); render(); renderAdmin();
  };
  $('#adm-body').onclick = e => {
    const g = e.target.closest('[data-gen]'), cp = e.target.closest('[data-copy]'), rv = e.target.closest('[data-revoke]');
    if (g) {
      const id = +g.dataset.gen;
      if (state.creds[id] && !confirm('Regenerate? The old ID and password will stop working.')) return;
      generateFor(id); toast('🔑 Credentials generated'); 
    } else if (cp) {
      navigator.clipboard.writeText(credLine(+cp.dataset.copy)); toast('📋 Copied'); return;
    } else if (rv) {
      if (!confirm('Revoke access for this participant?')) return;
      delete state.creds[+rv.dataset.revoke]; toast('Access revoked');
    } else {
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        const id = +rm.dataset.remove;
        if (!confirm('Remove this participant?')) return;
        state.students = state.students.filter(s => s.id !== id);
        delete state.creds[id];
        persist(); renderAdmin(); render(); toast('🗑️ Participant removed'); return;
      }
    }
    persist(); renderAdmin();
  };
  $('#adm-gen-missing').onclick = () => {
    let n = 0; state.students.forEach(s => { if (!state.creds[s.id]) { generateFor(s.id); n++; } });
    persist(); renderAdmin(); toast(n ? `✨ Generated ${n} new credential${n > 1 ? 's' : ''}` : 'Everyone already has credentials');
  };
  $('#adm-add').onclick = () => {
    const name = (prompt('New participant pseudonym:') || '').trim();
    if (!name) return;
    const newId = (state.students.reduce((a,st)=>Math.max(a,st.id),0) || 0) + 1;
    const st = {
      id: newId, tier: 'Mid', pseudo: name.replace(/\s+/g,'_'),
      xp: 0, att: 0, task: 0, mid: 50, avatar: AVATARS[(newId*7)%AVATARS.length],
      acts: {}, weeks: [1], marks: { quiz: null, t1: null, proj: null, final: null },
      realName: null, showReal: false,
      attendance: Array(28).fill(false)
    };
    prepareStudent(st);
    state.students.push(st);
    persist(); renderAdmin(); render(); toast('➕ Participant added');
  };
  const issued = () => state.students.filter(s => state.creds[s.id]).sort((a, b) => a.id - b.id);
  $('#adm-copy').onclick = () => {
    const rows = issued(); if (!rows.length) return toast('No credentials yet');
    navigator.clipboard.writeText('Pseudonym\tLogin ID\tPassword\n' + rows.map(s => credLine(s.id)).join('\n'));
    toast(`📋 Copied ${rows.length} credentials`);
  };
  $('#adm-export').onclick = () => {
    const rows = issued(); if (!rows.length) return toast('No credentials yet');
    const csv = 'Pseudonym,Tier,Login ID,Password\n' + rows.map(s => `${s.pseudo},${s.tier},${state.creds[s.id].uid},${state.creds[s.id].pw}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'smjc3263_credentials.csv'; a.click();
  };
  $('#adm-admin-pw').onclick = () => {
    const v = prompt('New admin password (min 6 characters):');
    if (v == null) return;
    if (v.length < 6) return toast('⚠️ Password too short');
    state.adminPw = v; persist(); toast('🛡️ Admin password updated');
  };

  // ---------- Course weeks in sync form ----------
  $('#sync-week').innerHTML += WEEKS.map(w => `<option value="${w.w}">Week ${w.w} · ${w.t}</option>`).join('');

  // ---------- Admin: attendance ----------
  function attendanceRow(s) {
    const onGoal = s.att >= GOALS.attendance;
    const cells = Array.from({ length: 14 }, (_, week) => {
      const first = week * 2, second = first + 1;
      return `<td class="attendance-week"><label title="Week ${week + 1}, session 1"><input type="checkbox" data-att-session="${first}" ${s.attendance[first] ? 'checked' : ''} /><span>1</span></label><label title="Week ${week + 1}, session 2"><input type="checkbox" data-att-session="${second}" ${s.attendance[second] ? 'checked' : ''} /><span>2</span></label></td>`;
    }).join('');
    return `<tr data-att-student="${s.id}"><td><div class="who-cell"><span class="av">${s.avatar}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>` +
      cells + `<td class="attendance-all"><input type="checkbox" data-att-all ${s.attendance.every(Boolean) ? 'checked' : ''} aria-label="Mark all sessions for ${esc(s.realName || s.pseudo)}" /></td>` +
      `<td class="num mono" data-attendance-total>${s.att}%<small> (${s.attendance.filter(Boolean).length}/28)</small></td>` +
      `<td class="num" data-attendance-status><span class="goal ${onGoal ? 'ok' : 'no'}">${onGoal ? '✓ Goal met' : `Goal ≥${GOALS.attendance}%`}</span></td></tr>`;
  }
  function renderAttendance() {
    const everyonePresent = state.students.every(s => s.attendance.every(Boolean));
    const weeklyTicks = Array.from({ length: 14 }, (_, i) => {
      const allWk = state.students.every(s => s.attendance[i * 2] && s.attendance[i * 2 + 1]);
      return `<th class="attendance-head">W${i + 1}<br><input type="checkbox" class="att-tick-wk" data-wk="${i}" ${allWk ? 'checked' : ''} title="Tick all for week ${i + 1}"/><small>1 · 2</small></th>`;
    }).join('');
    $('#attendance-head').innerHTML = `<tr><th>Participant</th>${weeklyTicks}<th>All<br><input type="checkbox" id="attendance-all-students" title="Mark every participant present for all sessions" ${everyonePresent ? 'checked' : ''} /></th><th class="num">Total</th><th class="num">Status</th></tr>`;
    $('#attendance-body').innerHTML = [...state.students].sort((a, b) => a.id - b.id)
      .map(attendanceRow).join('');
  }
  $('#btn-attendance').onclick = () => { renderAttendance(); open('#modal-attendance'); };
  
  // New handler for weekly tick
  $('#attendance-head').onchange = e => {
    if (e.target.classList.contains('att-tick-wk')) {
        const wk = +e.target.dataset.wk;
        const checked = e.target.checked;
        state.students.forEach(s => {
            s.attendance[wk * 2] = checked;
            s.attendance[wk * 2 + 1] = checked;
            prepareStudent(s);
        });
        renderAttendance(); render();
        toast(`${checked ? '✅' : '❌'} Week ${wk + 1} attendance updated`);
    } else if (e.target.id === 'attendance-all-students') {
        state.students.forEach(s => { s.attendance = Array(28).fill(e.target.checked); prepareStudent(s); });
        renderAttendance(); render();
        toast(e.target.checked ? '📅 All participants marked present for all sessions' : '📅 Attendance cleared for all participants');
    }
  };
  $('#attendance-export').onclick = () => {
    const rows = [...state.students].sort((a, b) => a.id - b.id)
      .map(s => `"${s.pseudo.replace(/"/g, '""')}",${s.tier},${s.attendance.map(v => v ? 'Present' : 'Absent').join(',')},${s.att}%`);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([['Pseudonym,Tier,' + Array.from({ length: 14 }, (_, i) => `Week ${i + 1} Session 1,Week ${i + 1} Session 2`).join(',') + ',Attendance', ...rows].join('\n')], { type: 'text/csv' }));
    a.download = 'smjc3263_attendance.csv'; a.click();
  };

  // ---------- Admin: assessment marks ----------
  function marksRow(s) {
    const t = totalMark(s);
    return `<td><div class="who-cell"><span class="av">${s.avatar}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>` +
      ASSESS.map(a => `<td><input class="mk-in mono" type="number" min="0" max="100" step="0.5" data-id="${s.id}" data-a="${a.id}" value="${s.marks[a.id] ?? ''}" placeholder="—" /></td>`).join('') +
      `<td class="num mono" data-carry>${fmt(carryMark(s))}</td><td class="num mono" data-total><b>${fmt(t)}</b> <span class="gr">${grade(t)}</span></td>`;
  }
  function renderMarks() {
    $('#marks-body').innerHTML = [...state.students].sort((a, b) => a.id - b.id)
      .map(s => `<tr data-row="${s.id}">${marksRow(s)}</tr>`).join('');
  }
  $('#btn-marks').onclick = () => { renderMarks(); open('#modal-marks'); };
  $('#btn-clear-all-marks').onclick = () => {
    if (confirm('Clear ALL marks for ALL participants? This cannot be undone.')) {
        state.students.forEach(s => { s.marks = { quiz: null, t1: null, proj: null, final: null }; });
        renderMarks(); render(); toast('📝 All assessment marks cleared.');
    }
  };
  $('#marks-body').onchange = e => {
    const i = e.target; if (!i.dataset.a) return;
    const st = state.students.find(s => s.id === +i.dataset.id);
    const raw = i.value.trim();
    if (raw === '') st.marks[i.dataset.a] = null;
    else {
      const v = +raw;
      if (isNaN(v) || v < 0 || v > 100) { toast('⚠️ Marks must be between 0 and 100'); i.value = st.marks[i.dataset.a] ?? ''; return; }
      st.marks[i.dataset.a] = Math.round(v * 10) / 10;
    }
    const row = i.closest('tr');
    row.querySelector('[data-carry]').textContent = fmt(carryMark(st));
    const t = totalMark(st);
    row.querySelector('[data-total]').innerHTML = `<b>${fmt(t)}</b> <span class="gr">${grade(t)}</span>`;
    render();
  };
  $('#marks-export').onclick = () => {
    const head = ['Pseudonym', ...ASSESS.map(a => `${a.name} (${a.w}%)`), 'Carry /50', 'Total /100', 'Grade'];
    const rows = [...state.students].sort((a, b) => a.id - b.id).map(s => [s.pseudo, ...ASSESS.map(a => s.marks[a.id] ?? ''), fmt(carryMark(s)), fmt(totalMark(s)), grade(totalMark(s))]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([[head, ...rows].map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = 'smjc3263_marks.csv'; a.click();
  };

  // ---------- Admin: Research Data Tracker & Excel Export ----------
  function renderResearchTracker() {
    const list = ranked();
    const totalXp = list.reduce((sum, s) => sum + s.xp, 0);
    const avgXp = Math.round(totalXp / list.length);
    const topTierCount = list.filter(s => s.tier === 'Top').length;
    $('#rt-summary').textContent = `Cohort: N = ${list.length} | Avg XP: ${avgXp} | Top: ${topTierCount}`;

    $('#rt-body').innerHTML = list.map(s => {
      const r = ROLES[s.ri];
      const t = totalMark(s);
      const weeksDone = s.weeks ? s.weeks.length : 0;
      const acts = s.acts || {};
      return `<tr>
        <td class="mono">#${s.rank}</td>
        <td><div class="who-cell"><span class="av">${s.avatar}</span><span><b>${esc(s.pseudo)}</b>${s.realName ? ` <small class="muted">(${esc(s.realName)})</small>` : ''}</span></div></td>
        <td>${s.tier}</td>
        <td class="num"><b>${s.xp}</b></td>
        <td>${r.icon} ${r.name}</td>
        <td class="num">${s.task}%</td>
        <td class="num">${s.att}%</td>
        <td class="num">${weeksDone}/14</td>
        <td class="num">${acts.al || 0}</td>
        <td class="num">${acts.quiz || 0}</td>
        <td class="num">${acts.tut || 0}</td>
        <td class="num">${acts.proj || 0}</td>
        <td class="num">${acts.peer || 0}</td>
        <td class="num">${fmt(carryMark(s))}</td>
        <td class="num"><b>${fmt(t)}</b></td>
        <td><span class="gr">${grade(t)}</span></td>
      </tr>`;
    }).join('');
  }

  $('#btn-research-tracker').onclick = () => {
    renderResearchTracker();
    open('#modal-research-tracker');
  };

  $('#rt-export-excel').onclick = () => {
    const list = ranked();
    const headers = [
      'Rank', 'Participant_ID', 'Pseudonym', 'Real_Name', 'Showing_Real_Name', 'Tier',
      'XP', 'Career_Role', 'Task_Completion_Rate_Pct', 'Attendance_Rate_Pct',
      'Weeks_Completed_Count', 'Completed_Week_Numbers',
      'Active_Learning_Count', 'Quizzes_Submitted_Count', 'Tutorial_Whiteboard_Count',
      'Project_Presentation_Count', 'Peer_Mentorship_Count',
      'Quiz_Mark_Pct', 'Test1_Mark_Pct', 'Test2_Mark_Pct', 'Project_Mark_Pct', 'Final_Exam_Mark_Pct',
      'Carry_Mark_Over_50', 'Total_Mark_Over_100', 'Grade',
      'Badges_Earned'
    ];

    const rows = list.map(s => {
      const c = state.creds[s.id] || {};
      const r = ROLES[s.ri];
      const acts = s.acts || {};
      const bList = badgesOf(s).join('; ');
      const wList = (s.weeks || []).join('; ');
      return [
        s.rank,
        `"${c.uid || ''}"`,
        `"${s.pseudo || ''}"`,
        `"${s.realName || ''}"`,
        s.showReal ? 'YES' : 'NO',
        `"${s.tier}"`,
        s.xp,
        `"${r.name}"`,
        s.task,
        s.att,
        (s.weeks || []).length,
        `"${wList}"`,
        acts.al || 0,
        acts.quiz || 0,
        acts.tut || 0,
        acts.proj || 0,
        acts.peer || 0,
        s.marks.quiz ?? '',
        s.marks.t1 ?? '',
        s.marks.proj ?? '',
        s.marks.final ?? '',
        fmt(carryMark(s)),
        fmt(totalMark(s)),
        grade(totalMark(s)),
        `"${bList}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SMJC3263_Research_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast('📊 Research dataset exported for Excel / SPSS');
  };

  $('#rt-export-logs').onclick = () => {
    if (!state.stream || !state.stream.length) {
      toast('No stream logs to export.');
      return;
    }
    const headers = ['Timestamp', 'Date_Time_ISO', 'Activity_Message', 'Is_Promotion'];
    const rows = state.stream.map(e => {
      const cleanMsg = (e.msg || '').replace(/<[^>]+>/g, '');
      return [
        e.ts,
        `"${new Date(e.ts).toISOString()}"`,
        `"${cleanMsg.replace(/"/g, '""')}"`,
        e.promo ? 'YES' : 'NO'
      ];
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SMJC3263_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast('📜 Activity stream logs exported');
  };

  $('#btn-course').onclick = () => open('#modal-course');

  $('#search').value = state.search; $('#role-filter').value = state.role;
  applySession();
  initFirestoreSync();
  if (!sess) render();
  setInterval(renderStream, 30000);
})();
