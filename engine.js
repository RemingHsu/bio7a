/* 共用工具 + 播放器。每個場景用 S.register({ title, build(root) }) 註冊，
   build 回傳 { tl, steps:[說明文字…], cleanup? }，時間軸用 's0','s1'… 標出每一步的開頭。 */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const S = (window.S = {});

  // 舞台固定深色，以下顏色只用在舞台上
  S.C = {
    bg: '#0d1822', ink: '#e8f0f2', mute: '#8aa1ae', faint: '#2b3f4d', grid: '#13222e',
    hi: '#ffd166', membrane: '#63d4bf', cyto: '#63d4bf', nucleus: '#a796ff', mito: '#ff9a5c',
    chloro: '#6fce62', wall: '#d9c27c', vacuole: '#62a8ff', blood: '#ff5f74', muscle: '#ff8f8f',
    nerve: '#ffd166', skin: '#f2b38a', body: '#25475b', bodyEdge: '#5f93ad',
    water: '#5fb8ff', oxygen: '#ff6b6b', co2: '#b8c4cc', sugar: '#ffcf5c', ink2: '#c9d6dc',
  };

  S.el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  S.g = (parent, attrs) => S.el('g', attrs, parent);
  S.text = (parent, x, y, str, attrs = {}) => {
    const t = S.el('text', { x, y, fill: S.C.ink, 'font-size': 28, ...attrs }, parent);
    t.textContent = str;
    return t;
  };

  // 估算文字寬度（中文字約 1 em，英數約 0.58 em）
  S.textWidth = (str, size) => {
    let w = 0;
    for (const ch of str) w += /[\u0000-ÿ]/.test(ch) ? 0.58 : 1;
    return w * size;
  };

  // 標籤：圓角底 + 文字，(x,y) 是中心
  // 文字會被放大到最小字級時，外框也要用放大後的字級來算
  S.effSize = (parent, size) => {
    if (!S.fontBump || !S.MIN_FONT || !parent || !parent.closest) return size;
    const min = parent.closest('.lab-stage') ? S.MIN_FONT.lab : parent.closest('#stage') ? S.MIN_FONT.scene : 0;
    return Math.max(size, min);
  };
  S.pill = (parent, x, y, str, { size = 26, color = S.C.ink, bg = 'rgba(13,24,34,.82)', edge = S.C.faint, padX = 14 } = {}) => {
    const g = S.g(parent);
    size = S.effSize(g, size);
    const w = S.textWidth(str, size) + padX * 2, h = size * 1.55;
    S.el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h / 2, fill: bg, stroke: edge, 'stroke-width': 2 }, g);
    S.text(g, x, y + size * 0.36, str, { 'font-size': size, fill: color, 'text-anchor': 'middle', 'font-weight': 700 });
    g.w = w; g.h = h;
    return g;
  };

  // 引線標籤：從 (tx,ty) 指向標籤 (x,y)
  S.callout = (parent, tx, ty, x, y, str, color, opts = {}) => {
    const g = S.g(parent, { opacity: 0 });
    const p = S.pill(g, x, y, str, { color, edge: color, size: opts.size || 26 });
    const ex = x + (tx < x - p.w / 2 ? -p.w / 2 : tx > x + p.w / 2 ? p.w / 2 : 0);
    const ey = ex === x ? y + (ty < y ? -p.h / 2 : p.h / 2) : y;
    const line = S.el('line', { x1: tx, y1: ty, x2: ex, y2: ey, stroke: color, 'stroke-width': 2.5 }, g);
    g.insertBefore(line, g.firstChild);
    S.el('circle', { cx: tx, cy: ty, r: 6, fill: color, stroke: S.C.bg, 'stroke-width': 2 }, g);
    return g;
  };

  // 尺寸標示線（雙箭頭）
  S.dimension = (parent, x1, y1, x2, y2, label, { color = S.C.hi, size = 26, offset = 30, sw = 3 } = {}) => {
    const g = S.g(parent);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const a = 14 * (sw / 3);
    const head = (x, y, dir) => {
      const t = ang + (dir > 0 ? 0 : Math.PI);
      S.el('path', { d: `M${x},${y} L${x - a * Math.cos(t - 0.45)},${y - a * Math.sin(t - 0.45)} L${x - a * Math.cos(t + 0.45)},${y - a * Math.sin(t + 0.45)}Z`, fill: color }, g);
    };
    S.el('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': sw }, g);
    head(x2, y2, 1); head(x1, y1, -1);
    const mx = (x1 + x2) / 2 + Math.sin(ang) * offset, my = (y1 + y2) / 2 - Math.cos(ang) * offset;
    S.text(g, mx, my + size * 0.35, label, { 'font-size': size, fill: color, 'text-anchor': 'middle', 'font-weight': 700 });
    return g;
  };

  // ---------- 數學 ----------
  S.clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  S.smoothstep = (a, b, x) => { const t = S.clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  S.lerp = (a, b, t) => a + (b - a) * t;
  S.lerpPts = (A, B, t) => A.map((p, i) => [S.lerp(p[0], B[i][0], t), S.lerp(p[1], B[i][1], t)]);
  // 可重現的亂數
  S.rng = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  // 閉合平滑曲線（Catmull-Rom → Bezier）；點數相同的兩個形狀可以互相變形
  S.smoothPath = (P) => {
    const n = P.length;
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  };
  // 不規則圓（細胞）的取樣點
  S.blobPts = (cx, cy, rx, ry, n = 48, waves = [[3, 0.05, 0.4], [5, 0.03, 1.3]]) => {
    const P = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      let k = 1;
      for (const [f, amp, ph] of waves) k += amp * Math.sin(f * a + ph);
      P.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return P;
  };
  // 圓角矩形的取樣點（從右邊中點開始，順時針，與 blobPts 對齊）
  S.rectPts = (cx, cy, w, h, r, n = 48) => {
    const P = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const dx = Math.cos(a), dy = Math.sin(a);
      // 射線與圓角矩形求交（以超橢圓近似）
      const e = 2 + 10 * (1 - r / Math.min(w, h)) ** 2;
      const t = 1 / Math.pow(Math.pow(Math.abs(dx) / (w / 2), e) + Math.pow(Math.abs(dy) / (h / 2), e), 1 / e);
      P.push([cx + dx * t, cy + dy * t]);
    }
    return P;
  };

  // ---------- 位置／縮放（直接寫 transform 屬性，避免 GSAP 自動補償變形中心） ----------
  S.xf = ({ x = 0, y = 0, s = 1, r = 0 }) => `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)})`;
  S.lerpXf = (A, B, t) => ({ x: S.lerp(A.x || 0, B.x || 0, t), y: S.lerp(A.y || 0, B.y || 0, t), s: S.lerp(A.s ?? 1, B.s ?? 1, t), r: S.lerp(A.r || 0, B.r || 0, t) });
  S.place = (e, X) => { e.setAttribute('transform', S.xf(X)); return e; };

  // ---------- 時間軸小工具 ----------
  // 用 0→1 的進度驅動自訂繪圖函式（倒帶時也會正確重畫）
  S.drive = (tl, fn, duration, position, ease = 'none') => {
    const o = { u: 0 };
    tl.fromTo(o, { u: 0 }, { u: 1, duration, ease, immediateRender: false, onUpdate: () => fn(o.u) }, position);
  };
  // 讓元素從 A 位置移到 B 位置（可倒帶）
  S.move = (tl, e, A, B, duration, position, ease = 'power2.inOut') => S.drive(tl, (u) => S.place(e, S.lerpXf(A, B, u)), duration, position, ease);
  S.show = (tl, els, position, duration = 0.5, extra = {}) =>
    tl.fromTo(els, { opacity: 0 }, { opacity: 1, duration, ...extra }, position);
  S.hide = (tl, els, position, duration = 0.4) =>
    tl.fromTo(els, { opacity: 1 }, { opacity: 0, duration, immediateRender: false }, position);
  S.pop = (tl, els, position, duration = 0.5, extra = {}) =>
    tl.fromTo(els, { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration, ease: 'back.out(1.7)', ...extra }, position);
  // 描線動畫
  // pad > 1：形狀之後會變長（例如變形）時，避免出現缺口
  S.drawOn = (tl, path, duration, position, ease = 'power1.inOut', pad = 1) => {
    const L = (path.getTotalLength ? path.getTotalLength() : 1000) * pad;
    path.setAttribute('stroke-dasharray', `${L} ${L}`);
    tl.fromTo(path, { attr: { 'stroke-dashoffset': L } }, { attr: { 'stroke-dashoffset': 0 }, duration, ease }, position);
  };

  // ---------- 播放器 ----------
  const scenes = [];
  S.register = (scene) => scenes.push(scene);
  // 互動模型：mount(容器) 回傳 { unmount }
  const labs = [];
  S.registerLab = (lab) => labs.push(lab);
  // 任務／自我檢測的進度圓點，可以點選切換。state(k)：'ok'（完成）、'miss'（第一次答錯）或 ''（還沒做）；目前這一個顯示 'on'
  S.dots = (n, cur, state, unit = '個任務') => {
    // 互動開著時，順便把每個任務的狀態記進學習進度（總整理的自我檢測另外由 summary.js 記）
    if (labIdx >= 0) { try { S.progress.setLab(labs[labIdx].id, n, Array.from({ length: n }, (_, k) => state(k) || '')); } catch (e) {} }
    return `<div class="dots" role="group" aria-label="切換${unit.replace('個', '')}">${Array.from({ length: n }, (_, k) =>
      `<button type="button" class="dot ${k === cur ? 'on' : state(k) || ''}" data-dot="${k}" aria-label="第 ${k + 1} ${unit}"${k === cur ? ' aria-current="step"' : ''}></button>`).join('')}</div>`;
  };
  // 點圓點時呼叫 go(k)。掛在任務框上一次就好（任務框重畫也有效）
  S.onDots = (box, go) => box.addEventListener('click', (e) => { const b = e.target.closest('[data-dot]'); if (b && box.contains(b)) go(+b.dataset.dot); });
  let labIdx = -1, labInst = null, playerEl, labEl, homeEl;

  // ---------- 學習進度：存在這台裝置的瀏覽器裡（localStorage），重新整理、下次打開都接得上 ----------
  // scene[id] = { step: 最後看到的步, max: 看到最遠的步, n: 步數, done: 看到最後一步 }
  // lab[id]   = { n: 任務數, ok: [做完的], miss: [第一次答錯的] }（S.dots 每次重畫時自動記）
  // quiz[id]  = { n: 題數, first: { 題號: 第一次有沒有答對 }, solved: [答對過的題號] }（summary.js 記）
  // wrong[總整理id:題號] = 錯題本 { s, k, due: 下次要問的日期, streak: 連續答對次數, n: 答錯次數, at: 加入日期 }
  const STORE_KEY = 'bio7a.progress.v1';
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => ymd(new Date());
  const addDays = (day, n) => { const d = new Date(day + 'T00:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
  const WRONG_GAP = [1, 3, 7]; // 答錯後隔 1 天再問，答對再隔 3 天、7 天；連續三次答對就移出錯題本
  const blank = () => ({ scene: {}, lab: {}, quiz: {}, wrong: {}, last: null, mastered: 0 });
  let P = blank();
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) P = Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
  let saveT = 0, skipMerge = false;
  const changed = [];
  const dropped = new Map(); // 這個分頁移出錯題本的題（鍵 → 時間），合併時不要從別的分頁撿回來
  // 同時開兩個分頁時，各自存檔會互相覆蓋：存之前先和磁碟上的合併，每一筆以時間 t 較新的為準
  const merge = () => {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
    if (!d) return;
    const newer = (a, b) => (!a ? b : !b ? a : (b.t || 0) > (a.t || 0) ? b : a);
    ['scene', 'lab', 'quiz', 'wrong'].forEach((k) => {
      const disk = d[k] || {}, m = {};
      new Set([...Object.keys(disk), ...Object.keys(P[k])]).forEach((id) => {
        if (k === 'wrong' && !P.wrong[id] && dropped.has(id) && (disk[id].t || 0) <= dropped.get(id)) return;
        m[id] = newer(P[k][id], disk[id]);
      });
      P[k] = m;
    });
    P.mastered = Math.max(P.mastered || 0, d.mastered || 0);
    if (!P.last) P.last = d.last;
  };
  const save = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      if (!skipMerge) merge();
      skipMerge = false;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(P)); } catch (e) {}
      changed.forEach((f) => f());
    }, 150);
  };
  // 別的分頁存了檔：合併進來，首頁和導覽下次重畫就會更新
  window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) { merge(); changed.forEach((f) => f()); } });
  S.QUIZ = {}; // summary.js 登記每份總整理的題目：id → QUIZ
  S.quizJump = {}; // summary.js 登記：id → (題號) => 跳到那一題
  const isQuiz = (id) => !!S.QUIZ[id];
  S.progress = {
    today,
    scene: (id) => P.scene[id] || null,
    lab: (id) => P.lab[id] || null,
    quiz: (id) => P.quiz[id] || null,
    get last() { return P.last; },
    get mastered() { return P.mastered || 0; },
    setLab(id, n, states) {
      const ok = [], miss = [];
      states.forEach((s, k) => { if (s === 'ok') ok.push(k); else if (s === 'miss') miss.push(k); });
      const old = P.lab[id];
      if (old && old.n === n && old.ok.join() === ok.join() && old.miss.join() === miss.join()) return;
      P.lab[id] = { n, ok, miss, t: Date.now() }; save();
    },
    setQuiz(id, n, first, solved) {
      const f = {}; first.forEach((v, k) => { if (v !== undefined) f[k] = v; });
      P.quiz[id] = { n, first: f, solved: [...solved].sort((a, b) => a - b), t: Date.now() }; save();
    },
    // 自我檢測第一次答錯：收進錯題本，明天再問
    wrongAdd(s, k) {
      const key = `${s}:${k}`, w = P.wrong[key];
      if (w) { w.streak = 0; w.n++; w.due = addDays(today(), WRONG_GAP[0]); w.t = Date.now(); }
      else P.wrong[key] = { s, k, due: addDays(today(), WRONG_GAP[0]), streak: 0, n: 1, at: today(), t: Date.now() };
      save();
    },
    // 錯題本裡的題目再問一次的結果
    wrongAnswer(key, correct) {
      const w = P.wrong[key];
      if (!w) return;
      w.t = Date.now();
      if (correct) { w.streak++; if (w.streak >= WRONG_GAP.length) { delete P.wrong[key]; dropped.set(key, w.t); P.mastered = (P.mastered || 0) + 1; } else w.due = addDays(today(), WRONG_GAP[w.streak]); }
      else { w.streak = 0; w.n++; w.due = addDays(today(), WRONG_GAP[0]); }
      save();
    },
    wrongAll: () => Object.entries(P.wrong).map(([key, w]) => ({ key, ...w })).sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0)),
    wrongDue: () => S.progress.wrongAll().filter((w) => w.due <= today()),
    itemDone(id) {
      const it = items.find((x) => x.id === id);
      if (!it) return false;
      if (it.kind === 'scene') { const s = P.scene[id]; return !!(s && s.done); }
      if (isQuiz(id)) { const q = P.quiz[id]; return !!(q && q.n && q.solved.length >= q.n); }
      const l = P.lab[id]; return !!(l && l.n && l.ok.length + l.miss.length >= l.n);
    },
    stat(list) { const total = list.length, done = list.filter((x) => S.progress.itemDone(x.id)).length; return { done, total }; },
    clear() { P = blank(); dropped.clear(); skipMerge = true; save(); },
    onChange(f) { changed.push(f); },
  };
  // 動畫看到第 i 步：記下來，也記「最後開的是哪一個」
  const recordScene = (i) => {
    const id = scenes[idx].id, n = ctx.steps.length, s = P.scene[id] || {};
    P.scene[id] = { step: i, max: Math.max(s.max || 0, i), n, done: !!s.done || i === n - 1, t: Date.now() };
    P.last = { id, step: i }; save();
  };
  // 網址的 # 跟著目前的項目走；第一次進來（沒有 #）用取代，之後用新增，瀏覽器的「上一頁」才能回到前一個項目
  const setHash = (id) => { if (location.hash.slice(1) === id) return; try { history[location.hash ? 'pushState' : 'replaceState'](null, '', '#' + id); } catch (e) {} };

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stage, capEl, capNoteEl, stepNoEl, playBtn, nextBtn, progEl, segs = [];
  // 不自動播放：每一步播完就停，由學生按「下一步」；「再放一次」重播這一步
  let idx = -1, ctx = null, step = 0, cur = null, timer = null, done = false;

    const ICON_AGAIN = '<svg viewBox="0 0 16 16"><path d="M8 2.5a5.5 5.5 0 1 0 5.4 6.5h-1.9A3.7 3.7 0 1 1 8 4.3V6.5l3.2-2.9L8 .7z"/></svg>';

  function bounds(i) {
    const s = ctx.tl.labels['s' + i];
    const e = i + 1 < ctx.steps.length ? ctx.tl.labels['s' + (i + 1)] : ctx.tl.duration();
    return [s, e];
  }

  function setCaption(i) {
    capEl.innerHTML = ctx.steps[i];
    const note = ctx.notes && ctx.notes[i];
    capNoteEl.hidden = !note; capNoteEl.textContent = note || '';
    capEl.classList.remove('enter'); void capEl.offsetWidth; capEl.classList.add('enter');
    stepNoEl.textContent = `${i + 1} / ${ctx.steps.length}`;
  }

  function paintProgress() {
    if (!ctx) return;
    const [s, e] = bounds(step);
    const t = ctx.tl.time();
    segs.forEach((seg, k) => {
      const f = k < step ? 1 : k > step ? 0 : S.clamp((t - s) / Math.max(0.001, e - s));
      seg.firstChild.style.width = (f * 100).toFixed(1) + '%';
    });
  }

  function updatePlayBtn() {
    const last = step === ctx.steps.length - 1;
    playBtn.innerHTML = ICON_AGAIN + '<span class="lbl">再放一次</span>';
    playBtn.hidden = isCard(step); // 重點卡沒有動畫可以重播
    nextBtn.disabled = last;
    nextBtn.classList.toggle('ready', done && !last); // 這一步播完：提示可以按下一步
  }

  function go(i) {
    if (!ctx) return;
    i = S.clamp(i, 0, ctx.steps.length - 1);
    clearTimeout(timer);
    if (cur) cur.kill();
    const [s, e] = bounds(i);
    if (Math.abs(ctx.tl.time() - s) > 1e-4) ctx.tl.seek(s, false);
    step = i; done = false;
    recordScene(i);
    setCaption(i);
    updatePlayBtn();
    // 重點卡（cards: true 的場景）：每一步直接顯示完成的畫面，不播淡入；太長的步最多播 MAX_STEP 秒
    if (reduce || isCard(i)) { ctx.tl.seek(e, false); finish(); return; }
    cur = ctx.tl.tweenTo(e, { ease: 'none', duration: Math.min(e - s, MAX_STEP), onUpdate: paintProgress, onComplete: finish });
  }
  const MAX_STEP = 6;
  // 場景可以標 cards: true（整景是「分步重點卡」），animate: [步的索引] 列出例外、仍然要播動畫的步
  const isCard = (i) => { const sc = scenes[idx]; return !!(sc && sc.cards && !(sc.animate || []).includes(i)); };

  function finish() {
    done = true;
    paintProgress();
    updatePlayBtn();
  }

  function closeLab() {
    if (labInst) { labInst.unmount && labInst.unmount(); labInst = null; }
    labIdx = -1;
    labEl.hidden = true; labEl.innerHTML = '';
    playerEl.hidden = false;
  }

  function loadLab(j) {
    if (j === labIdx) return;
    if (bigEl) setBig(bigEl, false);
    clearTimeout(timer);
    if (cur) cur.kill();
    if (ctx) { ctx.tl.kill(); ctx.cleanup && ctx.cleanup(); ctx = null; }
    idx = -1;
    if (labInst) { labInst.unmount && labInst.unmount(); labInst = null; }
    labIdx = j;
    playerEl.hidden = true;
    labEl.hidden = false; labEl.innerHTML = '';
    labInst = labs[j].mount(labEl) || null;
    addLabBigButtons(labEl);
    markNav(labs[j]);
    P.last = { id: labs[j].id }; save();
    setHash(labs[j].id);
  }

  // ---------- 兩層導覽：小節 → 該小節的動畫／互動 ----------
  // 章 → 小節。七上照課本分成六章（第一、二章對應芬姐 CH1 的前、後半，第三～六章對應芬姐 CH2～CH5）；
  // 七下接著七上編成第七～十二章（小節依課本 7下自然的順序）。
  // 七下的內部代號寫成「下1-1」（＝課本 1-1），畫面上顯示成「7-1」（S.secLabel）
  const CHAPTERS = [['1', '第一章', '生命世界與科學方法', '七上'], ['2', '第二章', '生物體的組成', '七上'], ['3', '第三章', '生物體的養分', '七上'], ['4', '第四章', '生物體的運輸', '七上'], ['5', '第五章', '生物體的協調', '七上'], ['6', '第六章', '生物體的恆定', '七上'],
    ['下1', '第七章', '生殖', '七下'], ['下2', '第八章', '遺傳', '七下'], ['下3', '第九章', '演化與分類', '七下'], ['下4', '第十章', '形形色色的生物', '七下'], ['下5', '第十一章', '生物與環境', '七下'], ['下6', '第十二章', '環境保護與生態平衡', '七下'],
    ['X', '總複習', '跨章比較', '綜合']];
  const SECTIONS = [['1-1', '生命現象', '1'], ['1-2', '生命起源與生物圈', '1'], ['1-3', '科學方法', '1'], ['1-4', '顯微鏡', '1'], ['總1', '總整理', '1'],
    ['2-1', '細胞', '2'], ['2-2', '擴散與滲透', '2'], ['2-3', '組成層次', '2'], ['總2', '總整理', '2'],
    ['3-1', '食物中的養分', '3'], ['3-2', '酵素', '3'], ['3-3', '光合作用', '3'], ['3-4', '消化與吸收', '3'], ['總3', '總整理', '3'],
    ['4-1', '植物的運輸構造', '4'], ['4-2', '植物體內的運輸', '4'], ['4-3', '心臟血管與血液', '4'], ['4-4', '血液循環與淋巴', '4'], ['總4', '總整理', '4'],
    ['5-1', '神經系統', '5'], ['5-2', '內分泌系統', '5'], ['5-3', '行為與感應', '5'], ['總5', '總整理', '5'],
    ['6-1', '呼吸與氣體恆定', '6'], ['6-2', '排泄與水分恆定', '6'], ['6-3', '體溫與血糖恆定', '6'], ['總6', '總整理', '6'],
    ['下1-1', '細胞的分裂', '下1'], ['下1-2', '無性生殖', '下1'], ['下1-3', '有性生殖', '下1'], ['下總1', '總整理', '下1'],
    ['下2-1', '遺傳與基因', '下2'], ['下2-2', '人類的遺傳', '下2'], ['下2-3', '突變與遺傳疾病', '下2'], ['下2-4', '生物技術', '下2'], ['下總2', '總整理', '下2'],
    ['下3-1', '化石', '下3'], ['下3-2', '生物的演化', '下3'], ['下3-3', '生物的分類', '下3'], ['下總3', '總整理', '下3'],
    ['下4-1', '原核、原生與菌物界', '下4'], ['下4-2', '植物界', '下4'], ['下4-3', '動物界', '下4'], ['下總4', '總整理', '下4'],
    ['下5-1', '族群、群集與演替', '下5'], ['下5-2', '生物間的互動', '下5'], ['下5-3', '生態系', '下5'], ['下5-4', '生態系的類型', '下5'], ['下總5', '總整理', '下5'],
    ['下6-1', '生物多樣性', '下6'], ['下6-2', '人類對環境的衝擊', '下6'], ['下6-3', '保育與永續', '下6'], ['下總6', '總整理', '下6'],
    ['X-1', '跨章比較', 'X']];
  // 「總複習」章（X）：跨章比較（summary-x.js），小節標籤顯示「比」
  const isSum = (k) => k.includes('總');
  S.secLabel = (k) => (k.startsWith('X') ? '比' : isSum(k) ? '總' : k.replace(/^下(\d+)/, (m, n) => String(+n + 6)));
  const chapOf = (sec) => (SECTIONS.find(([k]) => k === sec) || [])[2];
  const chapNo = (k) => (CHAPTERS.find(([c]) => c === k) || [])[1] || '';
  const secName = (k) => (SECTIONS.find(([s]) => s === k) || [])[1] || '';
  const OLD_HASH = { s1: 'scale', s2: 'cell', s3: 'transport', s4: 'levels', a1: 'lab-scale', a2: 'lab-transport' };
  let items = [], curSec = null, curChap = null;
  const hasLab = (sec) => items.some((x) => x.section === sec && x.kind === 'lab' && !isQuiz(x.id));
  const kindOf = (x) => (x.kind === 'scene' ? (x.cards ? '重點' : '動畫') : isQuiz(x.id) ? '總整理' : '互動');
  const ICON_LAB = '<svg class="labi" viewBox="0 0 16 16" aria-hidden="true"><title>這一節有互動</title><path d="M6 1h4v1.2H9v4l4.3 7A1.4 1.4 0 0 1 12.1 15H3.9a1.4 1.4 0 0 1-1.2-2.1L7 6.2v-4H6z"/></svg>';
  const open = (it) => { hideHome(); if (it.kind === 'scene') load(scenes.indexOf(it)); else loadLab(labs.indexOf(it)); };
  // 依網址的 # 打開項目；沒有或認不得就顯示首頁
  const route = () => {
    const h = location.hash.slice(1), id = OLD_HASH[h] || h;
    const it = items.find((x) => x.id === id);
    if (it) open(it); else showHome();
  };
  // 打開某一章：第一個還沒做完的項目（都做完了就第一個）
  function openChapter(k) {
    const list = items.filter((x) => chapOf(x.section) === k);
    if (list.length) open(list.find((x) => !S.progress.itemDone(x.id)) || list[0]);
  }
  // 手機上分頁列是橫向捲動：把選中的項目捲進可見範圍（只捲分頁列，不捲整頁）
  const reveal = (bar, t) => {
    if (t && bar.scrollWidth > bar.clientWidth && (t.offsetLeft < bar.scrollLeft || t.offsetLeft + t.offsetWidth > bar.scrollLeft + bar.clientWidth)) bar.scrollLeft = t.offsetLeft - 8;
  };
  function buildSections(chap) {
    const secBar = document.getElementById('sections');
    secBar.innerHTML = '';
    SECTIONS.filter((x) => x[2] === chap).forEach(([k, name]) => {
      const first = items.find((x) => x.section === k);
      if (!first) return;
      const b = document.createElement('button');
      b.className = 'sec'; b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.sec = k;
      b.innerHTML = `<span class="n">${S.secLabel(k)}</span>${name}${hasLab(k) ? ICON_LAB : ''}<span class="st" aria-hidden="true"></span>`;
      b.addEventListener('click', () => { if (curSec !== k || homeOn) open(first); });
      secBar.appendChild(b);
    });
    const [, no, title, grade] = CHAPTERS.find(([k]) => k === chap);
    document.getElementById('chapTitle').innerHTML = `<span class="chap-no">${grade} ${no}</span>${title}`;
    document.querySelectorAll('#chapMenu .ch-main').forEach((b) => b.setAttribute('aria-checked', b.dataset.ch === chap));
  }
  // 選章節：按鈕打開清單（搜尋框＋每章的標題、進度、可以直接點的小節）；點章跳到那一章第一個還沒做完的項目
  let menuShow = () => {};
  const openSearch = () => menuShow(true);
  function setupChapterMenu() {
    const btn = document.getElementById('chapBtn'), menu = document.getElementById('chapMenu');
    const sbox = document.createElement('div');
    sbox.className = 'chap-search';
    sbox.innerHTML = '<input type="search" id="chapSearch" placeholder="搜尋：光合作用、血型、顯微鏡…" aria-label="搜尋小節、動畫或互動" autocomplete="off"><div class="results" id="chapResults" hidden></div>';
    menu.appendChild(sbox);
    const searchEl = sbox.querySelector('input'), results = sbox.querySelector('.results');
    // 依年級分組（七上／七下），寬螢幕時兩組並排
    const cols = {};
    CHAPTERS.forEach(([k, no, title, grade]) => {
      if (!items.some((x) => chapOf(x.section) === k)) return;
      if (!cols[grade]) { cols[grade] = document.createElement('div'); cols[grade].className = 'grp'; cols[grade].setAttribute('role', 'group'); cols[grade].setAttribute('aria-label', grade); cols[grade].innerHTML = `<div class="grp-h" aria-hidden="true">${grade}</div>`; menu.appendChild(cols[grade]); }
      const secs = SECTIONS.filter((x) => x[2] === k && items.some((it) => it.section === x[0]));
      const row = document.createElement('div');
      row.className = 'ch'; row.dataset.ch = k;
      row.innerHTML = `<button type="button" class="ch-main" data-ch="${k}" role="menuitemradio" aria-checked="false"><span class="no">${no}</span><span class="t">${title}</span><span class="pg" aria-hidden="true"></span></button>
        <div class="secs">${secs.map(([sk, name]) => `<button type="button" class="sc" data-sec="${sk}"><span class="n">${S.secLabel(sk)}</span>${name}${hasLab(sk) ? ICON_LAB : ''}<span class="st" aria-hidden="true"></span></button>`).join('')}</div>`;
      row.querySelector('.ch-main').addEventListener('click', () => { close(); if (curChap !== k || homeOn) openChapter(k); });
      row.querySelectorAll('.sc').forEach((b) => b.addEventListener('click', () => { close(); const f = items.find((x) => x.section === b.dataset.sec); if (f && (curSec !== b.dataset.sec || homeOn)) open(f); }));
      cols[grade].appendChild(row);
    });
    // 每章的進度數字、小節的 ✓
    const refresh = () => {
      menu.querySelectorAll('.ch').forEach((row) => {
        const { done, total } = S.progress.stat(items.filter((x) => chapOf(x.section) === row.dataset.ch));
        row.querySelector('.pg').textContent = done ? `${done} / ${total}` : '';
        row.querySelector('.ch-main').setAttribute('aria-checked', row.dataset.ch === curChap && !homeOn);
      });
      menu.querySelectorAll('.sc').forEach((b) => {
        const { done, total } = S.progress.stat(items.filter((x) => x.section === b.dataset.sec));
        b.classList.toggle('done', total > 0 && done === total); b.classList.toggle('part', done > 0 && done < total);
      });
    };
    // 搜尋：比對小節名稱和動畫／互動／總整理的標題
    const doSearch = () => {
      const q = searchEl.value.trim().toLowerCase();
      menu.classList.toggle('searching', !!q);
      results.hidden = !q;
      if (!q) { results.innerHTML = ''; return; }
      const hit = [];
      SECTIONS.forEach(([sk, name, ch]) => { const f = items.find((x) => x.section === sk); if (f && name.toLowerCase().includes(q)) hit.push({ label: `小節：${S.secLabel(sk)} ${name}`, sub: chapNo(ch), id: f.id }); });
      items.forEach((x) => { if (x.title.toLowerCase().includes(q)) hit.push({ label: `${kindOf(x)}：${x.title}`, sub: where(x), id: x.id }); });
      results.innerHTML = hit.length ? hit.slice(0, 14).map((h) => `<button type="button" data-open="${h.id}">${h.label}<small>${h.sub}</small></button>`).join('') : '<div class="none">找不到，換個詞試試（例如「光合」「血型」「顯微鏡」）。</div>';
      results.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { close(); S.openById(b.dataset.open); }));
    };
    searchEl.addEventListener('input', doSearch);
    searchEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const f = results.querySelector('[data-open]'); if (f) f.click(); e.preventDefault(); } });
    const items_ = () => [...menu.querySelectorAll('button')].filter((b) => b.offsetParent);
    const show = (focusSearch) => {
      refresh();
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
      if (focusSearch) searchEl.focus(); else (menu.querySelector('[aria-checked="true"]') || items_()[0]).focus();
    };
    const close = (focusBtn) => { if (menu.hidden) return; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); searchEl.value = ''; doSearch(); if (focusBtn) btn.focus(); };
    menuShow = show;
    btn.addEventListener('click', () => (menu.hidden ? show() : close()));
    document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) close(); });
    menu.addEventListener('keydown', (e) => {
      const list = items_(), i = list.indexOf(document.activeElement);
      if (e.key === 'Escape') { close(true); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { list[(i + 1) % list.length].focus(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { list[(i - 1 + list.length) % list.length].focus(); e.preventDefault(); }
      e.stopPropagation(); // 選單裡的按鍵不要觸發播放器的快捷鍵
    });
  }
  function markNav(it) {
    const secBar = document.getElementById('sections'), tabBar = document.getElementById('tabs');
    const ch = chapOf(it.section);
    if (ch !== curChap) { curChap = ch; buildSections(ch); }
    if (curSec !== it.section) {
      curSec = it.section;
      tabBar.innerHTML = '';
      items.filter((x) => x.section === curSec).forEach((x) => {
        const b = document.createElement('button');
        b.className = 'tab' + (x.kind === 'lab' ? ' lab-tab' : ''); b.type = 'button'; b.setAttribute('role', 'tab');
        b.innerHTML = `<span class="kind">${kindOf(x)}</span>${x.title}<span class="st" aria-hidden="true"></span>`;
        b.addEventListener('click', () => open(x));
        b.item = x;
        tabBar.appendChild(b);
      });
    }
    secBar.querySelectorAll('.sec').forEach((b) => b.setAttribute('aria-selected', b.dataset.sec === curSec ? 'true' : 'false'));
    tabBar.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', b.item === it ? 'true' : 'false'));
    reveal(secBar, secBar.querySelector('.sec[aria-selected="true"]'));
    reveal(tabBar, tabBar.querySelector('.tab[aria-selected="true"]'));
    refreshNav();
  }
  // 小節膠囊、分頁上的 ✓（全部做完）或小點（做了一部分）
  function refreshNav() {
    document.querySelectorAll('#sections .sec').forEach((b) => {
      const { done, total } = S.progress.stat(items.filter((x) => x.section === b.dataset.sec));
      b.classList.toggle('done', total > 0 && done === total); b.classList.toggle('part', done > 0 && done < total);
      b.title = `${done} / ${total} 完成`;
    });
    document.querySelectorAll('#tabs .tab').forEach((b) => b.classList.toggle('done', S.progress.itemDone(b.item.id)));
  }

  // ---------- 首頁：接續上次、今日錯題、章節進度、下一個互動 ----------
  let homeOn = false, savedTitle = '';
  function showHome() {
    if (homeOn) { renderHome(); return; }
    homeOn = true;
    if (bigEl) setBig(bigEl, false);
    if (labIdx >= 0) closeLab();
    clearTimeout(timer); if (cur) cur.kill();
    document.body.classList.add('home-on');
    const h1 = document.getElementById('chapTitle'); savedTitle = h1.innerHTML; h1.textContent = '國中生物';
    playerEl.hidden = true; labEl.hidden = true; homeEl.hidden = false;
    renderHome();
    setHash('home');
    window.scrollTo({ top: 0 });
  }
  function hideHome() {
    if (!homeOn) return;
    homeOn = false;
    document.body.classList.remove('home-on');
    homeEl.hidden = true; homeEl.innerHTML = '';
    document.getElementById('chapTitle').innerHTML = savedTitle;
    playerEl.hidden = false;
    fitSoon();
  }
  const where = (it) => `${chapNo(chapOf(it.section))} ${S.secLabel(it.section)} ${secName(it.section)}`;
  function renderHome() {
    const pr = S.progress, lastIt = pr.last && items.find((x) => x.id === pr.last.id);
    const nLabs = labs.filter((l) => !isQuiz(l.id)).length, nSums = labs.length - nLabs;
    const due = pr.wrongDue(), all = pr.wrongAll();
    const nextLab = items.find((x) => x.kind === 'lab' && !isQuiz(x.id) && !pr.itemDone(x.id));
    const prog = (it) => { // 接續卡上的進度說明
      if (it.kind === 'scene') { const s = pr.scene(it.id); return s ? `第 ${s.step + 1} / ${s.n} 步` : ''; }
      if (isQuiz(it.id)) { const q = pr.quiz(it.id); return q ? `自我檢測答對 ${q.solved.length} / ${q.n} 題` : ''; }
      const l = pr.lab(it.id); return l ? `任務 ${l.ok.length + l.miss.length} / ${l.n} 完成` : '';
    };
    // 接續：上次開的項目；做完了就建議下一個
    let cont = lastIt || items[0];
    if (lastIt && pr.itemDone(lastIt.id)) cont = items[items.indexOf(lastIt) + 1] || lastIt;
    const chRows = CHAPTERS.map(([k, no, title]) => {
      const list = items.filter((x) => chapOf(x.section) === k);
      if (!list.length) return '';
      const { done, total } = pr.stat(list);
      return `<button type="button" class="chRow" data-ch="${k}"><span class="no">${no}</span><span class="t">${title}</span><span class="bar" aria-hidden="true"><i style="width:${total ? Math.round((done / total) * 100) : 0}%"></i></span><span class="num">${done} / ${total}</span></button>`;
    }).join('');
    homeEl.innerHTML = `
<div class="homeGrid">
  <section class="card homeCard hero">
    <h2>${lastIt ? '今天 15 分鐘' : '國中生物，一節一節學'}</h2>
    <p class="m-hint">${lastIt ? '接著上次、複習錯題、再做一個互動。' : `12 章、${scenes.length} 個動畫、${nLabs} 個互動實驗、${nSums} 份總整理（附自我檢測與 PDF 講義）。每一節先看動畫，再做互動，最後用總整理複習。`}</p>
    <div class="homeNext"><span class="k">${!lastIt ? '從這裡開始' : cont === lastIt ? '接續上次' : '上次的做完了，下一個'}</span><b>${kindOf(cont)}：${cont.title}</b><small>${where(cont)}${prog(cont) ? '・' + prog(cont) : ''}</small></div>
    <div class="btn-row"><button class="ctl primary" type="button" data-open="${cont.id}">${lastIt ? '繼續' : '開始'}</button></div>
  </section>
  <section class="card homeCard" id="homeWrong">
    <h2>今日錯題${due.length ? `<span class="badge">${due.length}</span>` : ''}</h2>
    ${due.length ? `<p class="m-hint">有 ${due.length} 題到期了。答錯的題目會隔 1、3、7 天再問一次，連續答對三次就移出錯題本。</p><div class="btn-row"><button class="ctl primary" type="button" id="homeWrongStart">開始複習</button></div>`
      : all.length ? `<p class="m-hint">今天沒有到期的錯題。錯題本還有 ${all.length} 題，下一次是 ${all[0].due.slice(5).replace('-', '/')}。</p>`
      : `<p class="m-hint">自我檢測答錯的題目會收進錯題本，隔 1、3、7 天再問你一次，連續答對三次就移出。${pr.mastered ? `已經有 ${pr.mastered} 題畢業了。` : ''}</p>`}
    ${all.length ? `<div class="btn-row"><button class="ctl small" type="button" id="homeWrongAll" aria-expanded="false">看全部錯題（${all.length}）</button></div><div id="homeWrongList" hidden></div>` : ''}
  </section>
  <section class="card homeCard">
    <h2>章節進度</h2>
    <div class="chRows">${chRows}</div>
  </section>
  <section class="card homeCard">
    <h2>下一個互動</h2>
    ${nextLab ? `<div class="homeNext"><b>互動：${nextLab.title}</b><small>${where(nextLab)}</small></div><div class="btn-row"><button class="ctl primary" type="button" data-open="${nextLab.id}">去做</button></div>` : '<p class="m-hint">所有互動都做過了。</p>'}
    <p class="m-hint homeFoot">進度只存在這台裝置的瀏覽器裡，清除瀏覽資料就會不見。<button class="linklike" type="button" id="homeClear">清除進度</button></p>
  </section>
</div>`;
    homeEl.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.open)));
    homeEl.querySelectorAll('.chRow').forEach((b) => b.addEventListener('click', () => openChapter(b.dataset.ch)));
    homeEl.querySelector('#homeClear').addEventListener('click', () => { if (confirm('要清除這台裝置上的所有學習進度和錯題本嗎？')) { pr.clear(); renderHome(); } });
    const ws = homeEl.querySelector('#homeWrongStart');
    if (ws) ws.addEventListener('click', () => wrongReview(homeEl.querySelector('#homeWrong'), due));
    const wa = homeEl.querySelector('#homeWrongAll');
    if (wa) wa.addEventListener('click', () => { const l = homeEl.querySelector('#homeWrongList'); const show = l.hidden; l.hidden = !show; wa.setAttribute('aria-expanded', show); if (show) renderWrongList(l, all); });
  }
  // 今日錯題：一題一題問；第一次點的選項就算數（答對→下次隔更久，答錯→明天再問），然後顯示解析
  function wrongReview(card, list) {
    let i = 0, right = 0;
    const n = list.length;
    const draw = () => {
      if (i >= n) {
        card.innerHTML = `<h2>今日錯題</h2><p class="m-text">複習了 ${n} 題，答對 <b>${right}</b> 題。</p><p class="m-hint">答對的會隔幾天再問一次確認，答錯的明天再問。</p><div class="btn-row"><button class="ctl" type="button" id="homeBack">回首頁</button></div>`;
        card.querySelector('#homeBack').addEventListener('click', renderHome);
        return;
      }
      const w = list[i], Q = S.QUIZ[w.s] && S.QUIZ[w.s][w.k];
      if (!Q) { i++; draw(); return; }
      const [q, opts, ans, why, link] = Q, it = items.find((x) => x.id === w.s);
      card.innerHTML = `<div class="mission-top"><h2>今日錯題 ${i + 1} / ${n}</h2><span class="m-hint" style="margin:0">${it ? chapNo(chapOf(it.section)) : ''}</span></div><p class="m-text">${q}</p><div class="opts">${opts.map((o, k) => `<button class="opt" type="button" data-k="${k}">${'ABCD'[k]}. ${o}</button>`).join('')}</div><div id="homeFb"></div>`;
      card.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
        const k = +b.dataset.k, ok = k === ans;
        S.progress.wrongAnswer(w.key, ok);
        if (ok) right++;
        card.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (+x.dataset.k === ans) x.classList.add('right'); else if (+x.dataset.k === k) x.classList.add('wrong'); });
        const li = link && S.findItem(link);
        card.querySelector('#homeFb').innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><strong>${ok ? '答對了' : `答錯了，正確是 ${'ABCD'[ans]}`}</strong>${why}${li ? `<div class="btn-row" style="margin-top:0.4rem"><button class="ctl small" type="button" data-open="${link}">${li.kind === 'lab' ? '互動' : '動畫'}：${li.title}</button></div>` : ''}</div><div class="btn-row"><button class="ctl primary" type="button" id="homeWrongNext">${i === n - 1 ? '看結果' : '下一題'}</button></div>`;
        card.querySelector('#homeWrongNext').addEventListener('click', () => { i++; draw(); });
        card.querySelectorAll('[data-open]').forEach((x) => x.addEventListener('click', () => S.openById(x.dataset.open)));
      }));
    };
    draw();
  }
  // 全部錯題：依章列出，點題目就打開那份總整理的那一題
  function renderWrongList(el, all) {
    const groups = {};
    all.forEach((w) => { const it = items.find((x) => x.id === w.s); const ch = it ? chapOf(it.section) : '?'; (groups[ch] = groups[ch] || []).push(w); });
    el.innerHTML = CHAPTERS.filter(([k]) => groups[k]).map(([k, no, title]) => `<h3 class="wl-h">${no} ${title}</h3><ul class="wl">${groups[k].map((w) => {
      const Q = S.QUIZ[w.s] && S.QUIZ[w.s][w.k], stem = Q ? Q[0].replace(/<[^>]+>/g, '') : '';
      return `<li><button type="button" class="linklike" data-s="${w.s}" data-k="${w.k}">${stem.length > 48 ? stem.slice(0, 48) + '…' : stem}</button><small>${w.due <= today() ? '今天' : w.due.slice(5).replace('-', '/')}・答錯 ${w.n} 次</small></li>`;
    }).join('')}</ul>`).join('');
    el.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => { S.openById(b.dataset.s); const j = S.quizJump[b.dataset.s]; if (j) j(+b.dataset.k); }));
  }

  // ---------- 自適應：讓舞台＋說明＋按鈕剛好放進一個畫面 ----------
  // 先量出這個動畫所有步驟裡最高的說明列，固定保留這個高度（換步驟時舞台不會跳動），
  // 再用「視窗高度 − 上方標題 − 說明列 − 按鈕列」換算舞台最大寬度（5:3）。
  let capBar, ctlBar, fitRaf = 0;
  function measureCaption() {
    if (!ctx) return;
    const keep = [capEl.innerHTML, capNoteEl.textContent, capNoteEl.hidden];
    capBar.style.minHeight = '';
    let mx = 0;
    ctx.steps.forEach((txt, i) => {
      capEl.innerHTML = txt;
      const n = ctx.notes && ctx.notes[i];
      capNoteEl.hidden = !n; capNoteEl.textContent = n || '';
      mx = Math.max(mx, capBar.offsetHeight);
    });
    [capEl.innerHTML, capNoteEl.textContent, capNoteEl.hidden] = keep;
    capBar.style.minHeight = mx + 'px';
  }
  function fit() {
    if (!playerEl || playerEl.hidden || playerEl.classList.contains('big')) return;
    const full = playerEl.parentElement.clientWidth;
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const vh = window.innerHeight, pad = rootPx * 0.6;
    const minH = Math.min(vh * 0.5, 20 * rootPx); // 太矮的視窗：舞台至少保留這個高度，其餘改用捲動
    const topOf = () => playerEl.getBoundingClientRect().top + window.scrollY;
    const hintH = () => playerEl.querySelector('.rotate-hint').offsetHeight || 0;

    // 版面一：說明與按鈕在舞台下方
    playerEl.classList.remove('side');
    const stacked = () => {
      const chrome = capBar.offsetHeight + ctlBar.offsetHeight + hintH() + 2;
      return Math.min(full, Math.max(vh - topOf() - chrome - pad, minH) * 5 / 3);
    };
    playerEl.style.setProperty('--fit-w', full + 'px');
    measureCaption();
    let w1 = stacked();
    playerEl.style.setProperty('--fit-w', w1 + 'px');
    measureCaption(); // 寬度改變後說明列的行數可能改變，再量一次
    w1 = stacked();

    // 版面二（寬螢幕）：說明與按鈕在舞台右側
    const sideW = Math.min(30 * rootPx, Math.max(18 * rootPx, window.innerWidth * 0.24));
    const w2 = Math.min(full - sideW, Math.max(vh - topOf() - pad, minH) * 5 / 3);
    if (window.innerWidth >= 700 && w2 > w1 * 1.08) {
      playerEl.classList.add('side');
      capBar.style.minHeight = '';
      playerEl.style.setProperty('--side-h', Math.round((w2 * 3) / 5) + 'px');
      playerEl.style.setProperty('--side-w', Math.round(sideW) + 'px');
      playerEl.style.setProperty('--fit-w', Math.round(w2 + sideW) + 'px');
    } else {
      playerEl.style.removeProperty('--side-h');
      playerEl.style.setProperty('--fit-w', Math.round(w1) + 'px');
    }
  }
  const fitSoon = () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fit); };
  S.fit = fit;

  // ---------- 放大檢視：畫面填滿整個螢幕；手機直拿時自動轉 90°，變成橫向（字約大兩倍） ----------
  // 有支援就順便進入瀏覽器全螢幕（隱藏網址列）；iPhone 不支援，也照樣用 CSS 填滿畫面
  const fsReq = () => {
    const el = document.documentElement, f = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!f || !(document.fullscreenEnabled || document.webkitFullscreenEnabled)) return;
    try { const p = f.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  };
  const fsExit = () => {
    if (!(document.fullscreenElement || document.webkitFullscreenElement)) return;
    try { const p = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  };
  let bigEl = null;
  function sizeBig() {
    if (!bigEl) return;
    const vw = window.innerWidth, vh = window.innerHeight, rot = vh > vw * 1.05;
    const W = rot ? vh : vw, H = rot ? vw : vh;
    bigEl.classList.toggle('rot', rot);
    bigEl.style.setProperty('--bw', W + 'px');
    bigEl.style.setProperty('--bh', H + 'px');
    if (bigEl === playerEl) {
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const side = Math.max(W - (H * 5) / 3, Math.min(W * 0.27, 16 * rootPx), 170);
      bigEl.style.setProperty('--bside', Math.round(side) + 'px');
    }
  }
  function setBig(el, on) {
    if (on) {
      if (bigEl && bigEl !== el) setBig(bigEl, false);
      bigEl = el;
      el.classList.remove('side');
      el.classList.add('big');
      document.body.classList.add('big-on');
      sizeBig();
      fsReq();
    } else {
      el.classList.remove('big', 'rot');
      if (bigEl === el) bigEl = null;
      document.body.classList.remove('big-on');
      fsExit();
      if (el === playerEl) fitSoon();
    }
    if (el === playerEl) {
      const b = document.getElementById('fs');
      b.querySelector('.lbl').textContent = on ? '縮小' : '放大';
      b.setAttribute('aria-label', on ? '縮小畫面' : '放大畫面');
    }
    const eb = el.querySelector(':scope > .big-btn');
    if (eb) { eb.textContent = on ? '✕ 縮小' : '⤢ 放大'; eb.setAttribute('aria-label', on ? '縮小畫面' : '放大畫面'); }
  }
  S.setBig = setBig;
  function setupBigView() {
    const btn = document.getElementById('fs');
    btn.hidden = false;
    btn.addEventListener('click', () => setBig(playerEl, !playerEl.classList.contains('big')));
    window.addEventListener('resize', sizeBig);
    const onFs = () => { if (!(document.fullscreenElement || document.webkitFullscreenElement) && bigEl) setBig(bigEl, false); };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bigEl) setBig(bigEl, false); });
  }
  // 互動的舞台右上角也放一個「放大」按鈕
  function addLabBigButtons(box) {
    box.querySelectorAll('.lab-stage, .dia-wrap').forEach((st) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'big-btn'; b.textContent = '⤢ 放大'; b.setAttribute('aria-label', '放大畫面');
      b.addEventListener('click', () => setBig(st, !st.classList.contains('big')));
      st.appendChild(b);
    });
  }

  function load(i) {
    if (i === idx) return;
    if (bigEl) setBig(bigEl, false);
    if (labIdx >= 0) closeLab();
    clearTimeout(timer);
    if (cur) cur.kill();
    if (ctx) { ctx.tl.kill(); ctx.cleanup && ctx.cleanup(); }
    idx = i;
    stage.innerHTML = '';
    S.el('rect', { x: 0, y: 0, width: 1200, height: 720, fill: S.C.bg }, stage);
    const root = S.g(stage);
    ctx = scenes[i].build(root);
    ctx.tl.pause(0);
    markNav(scenes[i]);
    progEl.innerHTML = '';
    segs = ctx.steps.map((_, k) => {
      const b = document.createElement('button');
      b.className = 'seg'; b.type = 'button'; b.setAttribute('aria-label', `第 ${k + 1} 步`);
      b.appendChild(document.createElement('i'));
      b.addEventListener('click', () => go(k));
      progEl.appendChild(b);
      return b;
    });
    setHash(scenes[i].id);
    const sv = P.scene[scenes[i].id];
    step = 0;
    go(sv && !sv.done && sv.step > 0 && sv.step < ctx.steps.length ? sv.step : 0); // 上次沒看完：接著上次的那一步
    fit();
  }

  // 最小字級：舞台是 1200 寬的座標，在筆電上約縮成 0.65～0.75 倍，太小的字一律放大到 MIN（舞台座標）。
  // 動畫舞台 22、互動舞台 24（互動的舞台比較窄）；個別文字加 data-fs-keep 可保留原字級。
  S.MIN_FONT = { scene: 22, lab: 24 };
  S.fontBump = !/[?&]nobump\b/.test(location.search);
  const bumpText = (t, min) => {
    if (!S.fontBump || t.hasAttribute('data-fs-keep')) return;
    const v = parseFloat(t.getAttribute('font-size'));
    if (v && v < min) { t.setAttribute('data-fs0', v); t.setAttribute('font-size', min); }
  };
  S.bumpFonts = (rootEl, min) => rootEl.querySelectorAll('text, tspan').forEach((t) => bumpText(t, min));
  const watchFonts = (rootEl, minOf) => new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      const min = minOf(n);
      if (!min) continue;
      if (n.tagName === 'text' || n.tagName === 'tspan') bumpText(n, min); else S.bumpFonts(n, min);
    }
  }).observe(rootEl, { childList: true, subtree: true });

  S.start = () => {
    stage = document.getElementById('stage');
    capEl = document.getElementById('caption');
    capNoteEl = document.getElementById('capnote');
    stepNoEl = document.getElementById('stepNo');
    playBtn = document.getElementById('play');
    nextBtn = document.getElementById('next');
    progEl = document.getElementById('progress');
    playerEl = document.querySelector('.player');
    labEl = document.getElementById('lab');
    capBar = document.querySelector('.caption-bar');
    ctlBar = document.querySelector('.controls');
    watchFonts(stage, () => S.MIN_FONT.scene);
    // 互動：整個版面一次放進來時，找出裡面的舞台；之後在舞台裡新增的文字也一起處理
    new MutationObserver((ms) => {
      for (const m of ms) for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.closest('.lab-stage')) { if (n.tagName === 'text' || n.tagName === 'tspan') bumpText(n, S.MIN_FONT.lab); else S.bumpFonts(n, S.MIN_FONT.lab); }
        else n.querySelectorAll('.lab-stage').forEach((st) => S.bumpFonts(st, S.MIN_FONT.lab));
      }
    }).observe(labEl, { childList: true, subtree: true });
    setupBigView();
    window.addEventListener('resize', fitSoon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSoon);
    scenes.forEach((x) => { x.kind = 'scene'; });
    labs.forEach((x) => { x.kind = 'lab'; });
    const order = (x) => SECTIONS.findIndex(([k]) => k === x.section);
    items = [...scenes, ...labs].map((x, n) => ({ x, n })).sort((a, b) => order(a.x) - order(b.x) || a.n - b.n).map((o) => o.x);
    setupChapterMenu();
    homeEl = document.getElementById('home');
    document.getElementById('homeBtn').addEventListener('click', showHome);
    document.getElementById('stageBig').addEventListener('click', () => setBig(playerEl, true));
    S.progress.onChange(refreshNav);
    window.addEventListener('hashchange', route);
    document.getElementById('prev').addEventListener('click', () => go(step - 1));
    document.getElementById('next').addEventListener('click', () => go(step + 1));
    playBtn.addEventListener('click', replay);
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.key === '/') { openSearch(); e.preventDefault(); return; }
      if (labIdx >= 0 || homeOn) return;
      if (e.key === 'ArrowRight') { go(step + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { go(step - 1); e.preventDefault(); }
      else if (e.key === ' ') { replay(); e.preventDefault(); }
      else if (/^[1-9]$/.test(e.key)) { const secs = SECTIONS.filter((x) => x[2] === curChap), sec = secs[+e.key - 1] && secs[+e.key - 1][0], first = sec && items.find((x) => x.section === sec); if (first && sec !== curSec) open(first); }
    });
    route();
  };

  // 總整理等頁面用：依 id 開啟某個動畫／互動，或列出某小節的項目
  S.openById = (id) => { const it = items.find((x) => x.id === id); if (it) { open(it); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  // 打開某個動畫並直接播放第 step 步（step 從 0 開始；總整理的圖表用）
  S.openAt = (id, step) => { S.openById(id); if (step > 0 && ctx && scenes[idx] && scenes[idx].id === id) go(step); };
  S.itemsOf = (sec) => items.filter((x) => x.section === sec).map((x) => ({ id: x.id, title: x.title, kind: x.kind, label: kindOf(x) }));
  // 依 id 找任何一個動畫／互動（跨章比較的連結用）；label：動畫／重點／互動／總整理
  S.findItem = (id) => { const x = items.find((it) => it.id === id); return x ? { id: x.id, title: x.title, kind: x.kind, section: x.section, label: kindOf(x) } : null; };
  S.stageOnly = (on) => { document.body.classList.toggle('stage-only', on !== false); if (on === false) fit(); };
  // 檢查用：直接跳到某一步的結尾畫面
  S.jump = (i, scene) => {
    if (scene != null) load(typeof scene === 'string' ? scenes.findIndex((x) => x.id === scene) : scene);
    go(i);
    if (cur) cur.kill();
    ctx.tl.seek(bounds(step)[1] - 1e-3, false);
    finish();
  };

  // 再放一次：從這一步的開頭重播
  function replay() { go(step); }
})();
