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
  S.pill = (parent, x, y, str, { size = 26, color = S.C.ink, bg = 'rgba(13,24,34,.82)', edge = S.C.faint, padX = 14 } = {}) => {
    const g = S.g(parent);
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
  let labIdx = -1, labInst = null, playerEl, labEl;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stage, capEl, capNoteEl, stepNoEl, playBtn, progEl, segs = [];
  let idx = -1, ctx = null, step = 0, cur = null, timer = null, auto = !reduce, done = false;

  const ICON_PLAY = '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>';
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
    const last = step === ctx.steps.length - 1 && done;
    playBtn.innerHTML = last ? ICON_AGAIN + '重播' : auto ? ICON_PAUSE + '暫停' : ICON_PLAY + '自動播放';
  }

  function holdTime(i) {
    const len = ctx.steps[i].replace(/<[^>]+>/g, '').length;
    return Math.min(7000, 1600 + len * 110);
  }

  function go(i) {
    if (!ctx) return;
    i = S.clamp(i, 0, ctx.steps.length - 1);
    clearTimeout(timer);
    if (cur) cur.kill();
    const [s, e] = bounds(i);
    if (Math.abs(ctx.tl.time() - s) > 1e-4) ctx.tl.seek(s, false);
    step = i; done = false;
    setCaption(i);
    updatePlayBtn();
    if (reduce) { ctx.tl.seek(e, false); finish(); return; }
    cur = ctx.tl.tweenTo(e, { ease: 'none', onUpdate: paintProgress, onComplete: finish });
  }

  function finish() {
    done = true;
    paintProgress();
    if (auto && step < ctx.steps.length - 1) timer = setTimeout(() => go(step + 1), holdTime(step));
    else if (step === ctx.steps.length - 1) auto = false;
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
    clearTimeout(timer);
    if (cur) cur.kill();
    if (ctx) { ctx.tl.kill(); ctx.cleanup && ctx.cleanup(); ctx = null; }
    idx = -1;
    if (labInst) { labInst.unmount && labInst.unmount(); labInst = null; }
    labIdx = j;
    playerEl.hidden = true;
    labEl.hidden = false; labEl.innerHTML = '';
    labInst = labs[j].mount(labEl) || null;
    markNav(labs[j]);
    try { history.replaceState(null, '', '#' + labs[j].id); } catch (e) {}
  }

  // ---------- 兩層導覽：小節 → 該小節的動畫／互動 ----------
  // 章 → 小節。小節代號依芬姐國中生物的 CH1、CH2 編號
  const CHAPTERS = [['1', '第一章', '生物的構造'], ['2', '第二章', '生物體的養分']];
  const SECTIONS = [['1-1', '生命現象', '1'], ['1-2', '細胞', '1'], ['1-3', '擴散與滲透', '1'], ['1-4', '組成層次', '1'], ['1-5', '顯微鏡', '1'], ['1-6', '科學方法', '1'], ['總', '總整理', '1'],
    ['2-1', '食物中的養分', '2'], ['2-2', '酵素', '2'], ['2-3', '光合作用', '2'], ['2-4', '消化與吸收', '2'], ['總2', '總整理', '2']];
  const chapOf = (sec) => (SECTIONS.find(([k]) => k === sec) || [])[2];
  const OLD_HASH = { s1: 'scale', s2: 'cell', s3: 'transport', s4: 'levels', a1: 'lab-scale', a2: 'lab-transport' };
  let items = [], curSec = null, curChap = null;
  const open = (it) => (it.kind === 'scene' ? (auto = !reduce, load(scenes.indexOf(it))) : loadLab(labs.indexOf(it)));
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
      b.innerHTML = `<span class="n">${k.startsWith('總') ? '總' : k}</span>${name}`;
      b.addEventListener('click', () => { if (curSec !== k) open(first); });
      secBar.appendChild(b);
    });
    const [, no, title] = CHAPTERS.find(([k]) => k === chap);
    document.getElementById('chapTitle').textContent = title;
    document.querySelectorAll('#chapters button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.ch === chap));
    void no;
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
        b.innerHTML = `<span class="kind">${x.kind === 'lab' ? '互動' : '動畫'}</span>${x.title}`;
        b.addEventListener('click', () => open(x));
        b.item = x;
        tabBar.appendChild(b);
      });
    }
    secBar.querySelectorAll('.sec').forEach((b) => b.setAttribute('aria-selected', b.dataset.sec === curSec ? 'true' : 'false'));
    tabBar.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', b.item === it ? 'true' : 'false'));
    reveal(secBar, secBar.querySelector('.sec[aria-selected="true"]'));
    reveal(tabBar, tabBar.querySelector('.tab[aria-selected="true"]'));
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
    if (!playerEl || playerEl.hidden || document.fullscreenElement || document.webkitFullscreenElement) return;
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

  // ---------- 全螢幕（支援的瀏覽器才顯示按鈕） ----------
  function setupFullscreen() {
    const btn = document.getElementById('fs');
    const req = playerEl.requestFullscreen || playerEl.webkitRequestFullscreen;
    const ok = !!req && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
    btn.hidden = !ok;
    document.querySelector('.rotate-hint').textContent = ok ? '手機橫放，或按全螢幕按鈕，畫面和字會大一些。' : '手機橫放，畫面和字會大一些。';
    if (!ok) return;
    btn.addEventListener('click', () => {
      const cur = document.fullscreenElement || document.webkitFullscreenElement;
      try {
        const p = cur ? (document.exitFullscreen || document.webkitExitFullscreen).call(document) : req.call(playerEl);
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    });
    const onChange = () => {
      const on = !!(document.fullscreenElement || document.webkitFullscreenElement);
      btn.querySelector('.lbl').textContent = on ? '離開全螢幕' : '全螢幕';
      btn.setAttribute('aria-label', on ? '離開全螢幕' : '全螢幕');
      if (!on) fitSoon();
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
  }

  function load(i) {
    if (i === idx) return;
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
    try { history.replaceState(null, '', '#' + scenes[i].id); } catch (e) {}
    step = 0;
    go(0);
    fit();
  }

  S.start = () => {
    stage = document.getElementById('stage');
    capEl = document.getElementById('caption');
    capNoteEl = document.getElementById('capnote');
    stepNoEl = document.getElementById('stepNo');
    playBtn = document.getElementById('play');
    progEl = document.getElementById('progress');
    playerEl = document.querySelector('.player');
    labEl = document.getElementById('lab');
    capBar = document.querySelector('.caption-bar');
    ctlBar = document.querySelector('.controls');
    setupFullscreen();
    window.addEventListener('resize', fitSoon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSoon);
    scenes.forEach((x) => { x.kind = 'scene'; });
    labs.forEach((x) => { x.kind = 'lab'; });
    const order = (x) => SECTIONS.findIndex(([k]) => k === x.section);
    items = [...scenes, ...labs].map((x, n) => ({ x, n })).sort((a, b) => order(a.x) - order(b.x) || a.n - b.n).map((o) => o.x);
    const chBar = document.getElementById('chapters');
    CHAPTERS.forEach(([k, no, title]) => {
      const first = items.find((x) => chapOf(x.section) === k);
      if (!first) return;
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.ch = k; b.innerHTML = `${no}<span class="ct"> ${title}</span>`; b.setAttribute("aria-label", `${no} ${title}`); // 窄螢幕只留「第一章」
      b.addEventListener('click', () => { if (curChap !== k) open(first); });
      chBar.appendChild(b);
    });
    document.getElementById('prev').addEventListener('click', () => go(step - 1));
    document.getElementById('next').addEventListener('click', () => go(step + 1));
    playBtn.addEventListener('click', togglePlay);
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (labIdx >= 0) return;
      if (e.key === 'ArrowRight') { go(step + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { go(step - 1); e.preventDefault(); }
      else if (e.key === ' ') { togglePlay(); e.preventDefault(); }
      else if (/^[1-9]$/.test(e.key)) { const secs = SECTIONS.filter((x) => x[2] === curChap), sec = secs[+e.key - 1] && secs[+e.key - 1][0], first = sec && items.find((x) => x.section === sec); if (first && sec !== curSec) open(first); }
    });
    const h = location.hash.slice(1), id = OLD_HASH[h] || h;
    open(items.find((x) => x.id === id) || items[0]);
  };

  // 總整理等頁面用：依 id 開啟某個動畫／互動，或列出某小節的項目
  S.openById = (id) => { const it = items.find((x) => x.id === id); if (it) { open(it); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  S.itemsOf = (sec) => items.filter((x) => x.section === sec).map((x) => ({ id: x.id, title: x.title, kind: x.kind }));
  S.stageOnly = (on) => { document.body.classList.toggle('stage-only', on !== false); if (on === false) fit(); };
  // 檢查用：直接跳到某一步的結尾畫面
  S.jump = (i, scene) => {
    if (scene != null) load(typeof scene === 'string' ? scenes.findIndex((x) => x.id === scene) : scene);
    auto = false; go(i);
    if (cur) cur.kill();
    ctx.tl.seek(bounds(step)[1] - 1e-3, false);
    finish();
  };

  function togglePlay() {
    if (step === ctx.steps.length - 1 && done) { auto = !reduce; go(0); return; }
    auto = !auto;
    if (auto && done) go(step + 1);
    else if (!auto) clearTimeout(timer);
    updatePlayBtn();
  }
})();
