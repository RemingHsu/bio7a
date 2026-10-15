/* 七下 1-2 無性生殖：意義、分裂生殖、出芽生殖、斷裂生殖、孢子繁殖、營養器官繁殖、組織培養與人為方法、優缺點 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const LEAF = '#4fae4a', LEAF_D = '#2f7a3a', STEM = '#6fae4a', SOIL = '#5a3e26', SOIL_T = '#7a5634';
  const sm = S.smoothstep;

  // 葉：基部在 (x, y)，往 ang 度的方向長（0＝向右、-90＝向上；往上斜的葉：右側用 -20～-70，左側用 -110～-160）
  const leafPath = (L, W) => `M 0,0 C ${L * 0.25},${-W * 0.62} ${L * 0.7},${-W * 0.55} ${L},0 C ${L * 0.7},${W * 0.55} ${L * 0.25},${W * 0.62} 0,0 Z`;
  const leaf = (p, x, y, L, W, ang, { fill = LEAF, edge = LEAF_D, vein = '#a8e39a', s = 1 } = {}) => {
    const lg = S.place(g(p), { x, y, r: ang, s });
    el('path', { d: leafPath(L, W), fill, stroke: edge, 'stroke-width': 1.8 }, lg);
    el('line', { x1: 2, y1: 0, x2: L * 0.9, y2: 0, stroke: vein, 'stroke-width': 1.5, opacity: 0.8 }, lg);
    return lg;
  };
  // 心形葉（番薯）：葉柄接在凹口
  const heartPath = (L, W) => `M 0,0 C ${-L * 0.2},${-W * 0.3} ${-L * 0.1},${-W * 0.64} ${L * 0.25},${-W * 0.62} C ${L * 0.6},${-W * 0.56} ${L * 0.86},${-W * 0.26} ${L},0 C ${L * 0.86},${W * 0.26} ${L * 0.6},${W * 0.56} ${L * 0.25},${W * 0.62} C ${-L * 0.1},${W * 0.64} ${-L * 0.2},${W * 0.3} 0,0 Z`;
  const heart = (p, x, y, L, W, ang) => {
    const lg = S.place(g(p), { x, y, r: ang });
    el('path', { d: heartPath(L, W), fill: '#5cb84f', stroke: LEAF_D, 'stroke-width': 1.8 }, lg);
    el('line', { x1: 0, y1: 0, x2: L * 0.85, y2: 0, stroke: '#a8e39a', 'stroke-width': 1.5 }, lg);
    return lg;
  };
  // 鋸齒小葉（草莓）
  const toothPath = (L, W, n = 7) => {
    const top = [], bot = [];
    for (let i = 0; i <= n * 2; i++) {
      const t = i / (n * 2), w = W * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 0.75) * (i % 2 ? 1.12 : 0.92);
      top.push([L * t, -w]); bot.unshift([L * t, w]);
    }
    return 'M 0,0 ' + top.concat(bot).map(([x, y]) => `L ${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';
  };
  const trifol = (p, bx, by, tx, ty, s = 1) => {
    el('path', { d: `M ${bx},${by} Q ${(bx + tx) / 2 + (tx - bx) * 0.15},${(by + ty) / 2} ${tx},${ty}`, stroke: '#7fae4a', 'stroke-width': 4 * s, fill: 'none', 'stroke-linecap': 'round' }, p);
    const a = (Math.atan2(ty - by, tx - bx) * 180) / Math.PI;
    [-48, 0, 48].forEach((d) => {
      const lg = S.place(g(p), { x: tx, y: ty, r: a + d, s });
      el('path', { d: toothPath(44, 17), fill: '#4fae4a', stroke: LEAF_D, 'stroke-width': 1.6 }, lg);
      el('line', { x1: 2, y1: 0, x2: 38, y2: 0, stroke: '#a8e39a', 'stroke-width': 1.3 }, lg);
    });
  };
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };
  const soil = (p, x, y, w, h = 70) => {
    el('rect', { x, y, width: w, height: h, rx: 8, fill: SOIL, opacity: 0.85 }, p);
    el('line', { x1: x, y1: y, x2: x + w, y2: y, stroke: SOIL_T, 'stroke-width': 4 }, p);
  };

  // ---------- 草履蟲（橫向，可以從中間縊縮） ----------
  function paramecium(p) {
    const o = { g: g(p) };
    o.cil = el('path', { d: '', stroke: '#bfeedd', 'stroke-width': 1.6, fill: 'none', opacity: 0.85 }, o.g);
    o.body = el('path', { d: '', fill: 'rgba(160,215,190,0.22)', stroke: '#9fe0c8', 'stroke-width': 3 }, o.g);
    o.groove = el('path', { d: '', fill: 'none', stroke: '#9fe0c8', 'stroke-width': 2, opacity: 0.8 }, o.g);
    o.food = [0, 1, 2, 3].map(() => el('circle', { r: 7, fill: 'rgba(217,166,102,0.55)', stroke: '#d9a666', 'stroke-width': 1.2 }, o.g));
    o.cv = [0, 1, 2, 3].map(() => { const c = g(o.g); for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; el('line', { x1: Math.cos(a) * 7, y1: Math.sin(a) * 7, x2: Math.cos(a) * 15, y2: Math.sin(a) * 15, stroke: '#7fc4ff', 'stroke-width': 2 }, c); } el('circle', { r: 7, fill: 'rgba(127,196,255,0.6)' }, c); return c; });
    o.mac = [0, 1].map(() => el('ellipse', { rx: 26, ry: 15, fill: 'rgba(167,150,255,0.55)', stroke: C.nucleus, 'stroke-width': 2 }, o.g));
    o.set = (cx, cy, a, b, pinch = 0, split = 0) => {
      const pts = [], n = 80;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * 6.283, x = a * Math.cos(t);
        let y = b * Math.sin(t) * (1 + 0.1 * Math.cos(t));
        if (Math.sin(t) > 0) y -= b * 0.2 * Math.exp(-(((x + 0.15 * a) / (0.3 * a)) ** 2)) * (1 - pinch);
        y *= 1 - pinch * Math.exp(-((x / (0.2 * a)) ** 2));
        pts.push([cx + x, cy + y]);
      }
      o.body.setAttribute('d', S.smoothPath(pts));
      let d = '';
      pts.forEach(([x, y], i) => {
        if (i % 2) return;
        const t = (i / n) * 6.283;
        let nx = Math.cos(t) / a, ny = Math.sin(t) / b;
        const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
        d += `M ${x.toFixed(1)},${y.toFixed(1)} l ${(nx * 9).toFixed(1)},${(ny * 9).toFixed(1)} `;
      });
      o.cil.setAttribute('d', d);
      o.groove.setAttribute('d', `M ${cx - a * 0.55},${cy + b * 0.35} Q ${cx - a * 0.15},${cy + b * 0.05} ${cx + a * 0.1},${cy + b * 0.15}`);
      o.groove.style.opacity = 0.8 * (1 - pinch);
      const s = split;
      [[-0.35, 0.1], [-0.05, -0.3], [0.3, 0.25], [0.55, -0.15]].forEach(([fx, fy], i) => { o.food[i].setAttribute('cx', cx + fx * a); o.food[i].setAttribute('cy', cy + fy * b); });
      [[-0.72, 0], [0.72, 0], [-0.22, 0], [0.22, 0]].forEach(([fx, fy], i) => { S.place(o.cv[i], { x: cx + fx * a, y: cy + fy * b - b * 0.2 }); o.cv[i].style.opacity = i < 2 ? 1 : s; });
      o.mac.forEach((m, i) => { m.setAttribute('cx', cx + (i ? 1 : -1) * s * a * 0.45 + 0.05 * a); m.setAttribute('cy', cy + 2); m.setAttribute('rx', a * 0.17); m.setAttribute('ry', b * 0.27); });
    };
    return o;
  }

  // ---------- 水螅（基部在 (0,0)，往上長） ----------
  const HYD = '#a9c98c', HYD_E = '#dff2c8';
  // 觸手：細長、微微波動，末端稍微下垂
  const tentacle = (p, x, y, ang, L, sw = 3, amp = 6, ph = 0) => {
    const a = (ang * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a);
    let d = `M ${x.toFixed(1)},${y.toFixed(1)}`;
    for (let i = 1; i <= 20; i++) {
      const t = i / 20, w = amp * Math.sin(t * Math.PI * 2.6 + ph) * Math.pow(t, 0.7);
      d += ` L ${(x + dx * L * t - dy * w).toFixed(1)},${(y + dy * L * t + dx * w + L * 0.16 * t * t).toFixed(1)}`;
    }
    el('path', { d, fill: 'none', stroke: '#c4dcaa', 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  };
  function hydra(p) {
    const h = g(p);
    el('ellipse', { cx: 40, cy: 14, rx: 150, ry: 18, fill: '#4a5a64' }, h);
    [[-152, -20, 120], [-132, -14, 144], [-108, -6, 160], [-78, 6, 156], [-48, 14, 148], [-16, 20, 132]].forEach(([a, bx, L], i) => tentacle(h, bx, -236 + Math.abs(bx) * 0.3, a, L, 3, 6, i * 1.3));
    el('path', { d: 'M -18,0 C -20,-80 -27,-160 -23,-228 Q -12,-246 -6,-246 Q 0,-256 6,-246 Q 12,-246 23,-228 C 27,-160 20,-80 18,0 Z', fill: HYD, stroke: HYD_E, 'stroke-width': 2.5 }, h);
    el('ellipse', { cx: 0, cy: -2, rx: 22, ry: 6, fill: '#8fb070' }, h);
    return h;
  }
  // 芽體：基部在 (0,0)，往 +x 方向長；末端有幾條細小的觸手
  function hydraBud(p) {
    const b = g(p);
    [-60, -22, 22, 60].forEach((a, i) => tentacle(b, 64, a * 0.12, a, 34, 2, 2.5, i));
    el('path', { d: 'M 0,-10 C 24,-12 50,-13 64,-10 Q 72,0 64,10 C 50,13 24,12 0,10 Z', fill: HYD, stroke: HYD_E, 'stroke-width': 2 }, b);
    return b;
  }

  // ---------- 渦蟲：一段（前端可以是頭或切口，後端可以是尾或切口） ----------
  const WORM = '#b58a6a', WORM_E = '#e8c8a8', WORM_NEW = '#e3ccb4';
  const HEAD_D = 'M 0,-27 C -22,-27 -36,-29 -48,-40 C -54,-30 -60,-16 -70,-6 Q -74,0 -70,6 C -60,16 -54,30 -48,40 C -36,29 -22,27 0,27 Z';
  const TAIL_D = 'M 0,-27 C 24,-25 46,-13 58,0 C 46,13 24,25 0,27 Z';
  // L：{ E, F, T } 共用的外框層、填色層、上層（兩段相接時，接縫不會出現線）
  function wormPiece(Ly, kind) {
    // kind 'head'：有頭的前段（原點在頭和身體的接點，身體往 +x）；'tail'：有尾的後段（原點在尾和身體的接點，身體往 -x）
    const o = {};
    const E = g(Ly.E), F = g(Ly.F), T = g(Ly.T);
    const part = (d, fill) => { const e = el('path', { d, fill: WORM_E, stroke: WORM_E, 'stroke-width': 5, 'stroke-linejoin': 'round' }, E); const f = el('path', { d, fill }, F); return [e, f]; };
    const body = part('', WORM), ext = part('', WORM_NEW);
    part(kind === 'head' ? HEAD_D : TAIL_D, WORM);
    const capNew = part(kind === 'head' ? TAIL_D : HEAD_D, WORM_NEW);
    const eyes = g(T);
    const eyeAt = (gp) => [-1, 1].forEach((s) => { el('ellipse', { cx: -42, cy: s * 9, rx: 7, ry: 5, fill: '#f6efe6' }, gp); el('circle', { cx: -40, cy: s * 7.5, r: 3, fill: '#1a1a1a' }, gp); });
    const eyesNew = g(T);
    if (kind === 'head') eyeAt(eyes); else eyeAt(eyesNew);
    const rect = (x0, x1) => { const a = Math.min(x0, x1), b = Math.max(x0, x1), m = (a + b) / 2, w = 27 + Math.min(5, (b - a) / 30); return `M ${a},-27 Q ${m},${-w * 1.08} ${b},-27 L ${b},27 Q ${m},${w * 1.08} ${a},27 Z`; };
    o.set = (x, y, Lb, ex, cs) => {
      [E, F, T].forEach((e) => S.place(e, { x, y }));
      const dir = kind === 'head' ? 1 : -1;
      body.forEach((e) => e.setAttribute('d', rect(0, dir * Lb)));
      ext.forEach((e) => { e.setAttribute('d', ex > 0.5 ? rect(dir * (Lb - 1), dir * (Lb + ex)) : ''); });
      capNew.forEach((e) => { e.setAttribute('transform', `translate(${dir * (Lb + ex)},0) scale(${Math.max(0.001, cs).toFixed(3)})`); e.style.opacity = cs > 0.02 ? 1 : 0; });
      S.place(eyesNew, { x: dir * (Lb + ex), y: 0, s: Math.max(0.001, cs) }); eyesNew.style.opacity = cs > 0.3 ? 1 : 0;
    };
    return o;
  }

  // ---------- 壁虎（從背面看，頭朝左；原點在身體中央，長約 170）：tail 'full' | 'cut'（斷尾）| 'regrown'（長回來的尾巴顏色較淡） ----------
  function gecko(p, x, y, s, tail = 'full') {
    const G = S.place(g(p), { x, y, s });
    const SK = '#c9b68a', ED = '#6f5f3c', NEW = '#e6dcc0';
    // 四肢：先畫外框再畫填色；腳趾末端有圓圓的趾墊
    [[-32, -1], [-32, 1], [12, -1], [12, 1]].forEach(([lx, sd]) => {
      const back = lx > 0, kx = lx + (back ? 12 : -4), ky = sd * 22, fx = lx + (back ? 4 : -14), fy = sd * 30;
      const d = `M ${lx},${sd * 8} Q ${kx},${ky - sd * 6} ${kx},${ky} T ${fx},${fy}`;
      el('path', { d, fill: 'none', stroke: ED, 'stroke-width': 7.5, 'stroke-linecap': 'round' }, G);
      el('path', { d, fill: 'none', stroke: SK, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, G);
      // 腳趾張開成扇形：前腳朝外、朝前，後腳朝外、朝後
      const base = (back ? 45 : 135) * sd;
      [-50, -25, 0, 25, 50].forEach((da) => {
        const r = ((base + da) * Math.PI) / 180, ex = fx + Math.cos(r) * 7, ey = fy + Math.sin(r) * 7;
        el('line', { x1: fx, y1: fy, x2: ex, y2: ey, stroke: SK, 'stroke-width': 2, 'stroke-linecap': 'round' }, G);
        el('circle', { cx: ex, cy: ey, r: 1.8, fill: SK, stroke: ED, 'stroke-width': 0.8 }, G);
      });
    });
    // 尾巴：原本的尾巴（深）＋長回來的部分（淡）
    const tailD = (x0, x1, w0, w1) => `M ${x0},${-w0} C ${(x0 + x1) / 2},${-w0 * 0.9} ${x1 - 10},${-w1 - 1} ${x1},${-w1 + 2} C ${x1 + 3},0 ${x1 + 3},0 ${x1},${w1 + 2} C ${x1 - 10},${w1 + 1} ${(x0 + x1) / 2},${w0 * 0.9} ${x0},${w0} Z`;
    if (tail === 'full') el('path', { d: tailD(18, 98, 7, 0.5), fill: SK, stroke: ED, 'stroke-width': 1.6 }, G);
    else {
      el('path', { d: tailD(18, 50, 7, 5), fill: SK, stroke: ED, 'stroke-width': 1.6 }, G);
      if (tail === 'regrown') {
        el('path', { d: tailD(48, 90, 5, 0.6), fill: NEW, stroke: ED, 'stroke-width': 1.6 }, G);
        el('line', { x1: 49, y1: -5, x2: 49, y2: 5, stroke: ED, 'stroke-width': 1.4, 'stroke-dasharray': '2 2' }, G);
      } else el('path', { d: 'M 50,-5 L 47,-2 L 51,1 L 47,5', fill: 'none', stroke: ED, 'stroke-width': 1.4 }, G);
    }
    // 頭＋身體：一條平滑的外框
    el('path', { d: 'M -74,0 C -74,-9 -66,-14 -57,-14 C -49,-14 -45,-11 -40,-8 C -28,-13 -8,-15 8,-12 C 16,-10 22,-7 24,-3 L 24,3 C 22,7 16,10 8,12 C -8,15 -28,13 -40,8 C -45,11 -49,14 -57,14 C -66,14 -74,9 -74,0 Z', fill: SK, stroke: ED, 'stroke-width': 1.8 }, G);
    [[-24, -4], [-12, 5], [0, -5], [10, 3], [-34, 2], [32, 0]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 2.2, fill: '#a8946a' }, G));
    [-1, 1].forEach((sd) => { el('ellipse', { cx: -60, cy: sd * 10, rx: 4.5, ry: 3.6, fill: '#3a2e1c' }, G); el('circle', { cx: -61.5, cy: sd * 10 - 1.2, r: 1.2, fill: '#ffffff' }, G); });
    return G;
  }
  // 斷掉的一截尾巴
  function geckoTail(p, x, y, s, r = 0) {
    const G = S.place(g(p), { x, y, s, r });
    el('path', { d: 'M 0,-6 C 16,-7 32,-5 46,1 C 48,2 48,4 46,5 C 32,3 16,6 0,6 L 3,2 L -1,-1 Z', fill: '#c9b68a', stroke: '#6f5f3c', 'stroke-width': 1.6 }, G);
    return G;
  }

  // ---------- 蘭花（盆栽） ----------
  function orchid(p, x, y, s = 1) {
    const o = S.place(g(p), { x, y, s });
    el('path', { d: 'M -14,-8 C -18,-110 30,-190 96,-206', fill: 'none', stroke: '#6f8f4a', 'stroke-width': 4, 'stroke-linecap': 'round' }, o);
    [[-150, 30, 82], [-30, 30, 86], [-100, 26, 64]].forEach(([a, w, L]) => leaf(o, 0, -12, L, w, a, { fill: '#3f9a4a', vein: '#8fd08a' }));
    [[28, -168, 0.85], [62, -196, 0.95], [100, -206, 1]].forEach(([fx, fy, k]) => {
      const f = S.place(g(o), { x: fx, y: fy, s: k });
      [[0, -16, 7, 15, 0], [-12, 10, 6, 13, 40], [12, 10, 6, 13, -40]].forEach(([cx, cy, rx, ry, r]) => el('ellipse', { cx, cy, rx, ry, fill: '#f8e6ef', stroke: '#e7b8cf', 'stroke-width': 1, transform: `rotate(${r} ${cx} ${cy})` }, f));
      [-1, 1].forEach((sd) => el('ellipse', { cx: sd * 15, cy: -2, rx: 14, ry: 13, fill: '#fbeef4', stroke: '#e7b8cf', 'stroke-width': 1 }, f));
      el('path', { d: 'M -6,2 Q 0,18 6,2 Q 0,8 -6,2 Z', fill: '#c2457a' }, f);
      el('circle', { cx: 0, cy: -1, r: 3.5, fill: '#ffd166' }, f);
    });
    el('path', { d: 'M -42,-6 L 42,-6 L 32,54 L -32,54 Z', fill: '#c98a50', stroke: '#e0a870', 'stroke-width': 2 }, o);
    el('rect', { x: -46, y: -12, width: 92, height: 10, rx: 3, fill: '#a96f3c' }, o);
    return o;
  }
  // 簡單的植物（優缺點用）：莖＋上斜的葉＋頂端的花
  function plant(p, x, y, { h = 120, leafC = LEAF, flower = '#ff9ec4', lw = 1 } = {}) {
    const o = g(p);
    const parts = [];
    parts.push(el('path', { d: `M ${x},${y} C ${x - 4},${y - h * 0.4} ${x + 4},${y - h * 0.7} ${x},${y - h}`, fill: 'none', stroke: STEM, 'stroke-width': 4, 'stroke-linecap': 'round' }, o));
    [[0.3, -1], [0.5, 1], [0.7, -1]].forEach(([f, s]) => {
      const lg = leaf(o, x, y - h * f, 34 * lw, 13 * lw, s > 0 ? -35 : -145, { fill: leafC });
      parts.push(lg.firstChild);
    });
    const fl = g(o);
    for (let i = 0; i < 5; i++) { const a = (i / 5) * 6.283; el('circle', { cx: x + Math.cos(a) * 8, cy: y - h - 6 + Math.sin(a) * 8, r: 7, fill: flower }, fl); }
    el('circle', { cx: x, cy: y - h - 6, r: 5, fill: C.hi }, fl);
    o.parts = parts; o.fl = fl;
    return o;
  }

  S.register({
    id: 'asexual', section: '下1-2', title: '無性生殖',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 無性生殖的意義 =====
      const P0 = g(root);
      S.pill(P0, 360, 52, '無性生殖：一個親代就能產生子代', { size: 26, color: C.hi, edge: C.hi });
      const mit = S.b1.mitosis(g(P0), { cx: 360, cy: 300, R: 150, D: 170, r2: 130, pairs: [72, 42], W: 16 });
      const l0a = text(P0, 360, 492, '親代', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const l0b = g(P0, { opacity: 0 });
      [190, 530].forEach((x) => text(l0b, x, 470, '子代', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 }));
      const same0 = g(P0, { opacity: 0 });
      S.pill(same0, 360, 548, '子代和親代的遺傳物質相同', { size: 26, color: C.hi, edge: C.hi });
      text(same0, 360, 614, '不需要精子和卵結合（沒有配子結合）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const ways = g(P0, { opacity: 0 });
      el('rect', { x: 740, y: 96, width: 430, height: 540, rx: 16, ...FRAME }, ways);
      text(ways, 955, 146, '無性生殖的方式', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const wayItems = ['分裂生殖', '出芽生殖', '斷裂生殖', '孢子繁殖', '營養器官繁殖', '組織培養（人為）'].map((s, i) => {
        const wg = g(ways, { opacity: 0 });
        el('circle', { cx: 800, cy: 208 + i * 66, r: 7, fill: C.hi }, wg);
        text(wg, 822, 217 + i * 66, s, { 'font-size': 26 });
        return wg;
      });
      tl.addLabel('s0');
      S.drive(tl, (u) => mit.set(u), 4.5, 's0+=0.4', 'none');
      S.hide(tl, l0a, 's0+=2.4', 0.3);
      S.show(tl, l0b, 's0+=4.7', 0.4);
      S.show(tl, same0, 's0+=5.1', 0.4);
      S.show(tl, ways, 's0+=5.6', 0.4);
      wayItems.forEach((w, i) => S.show(tl, w, `s0+=${5.8 + i * 0.25}`, 0.3));

      // ===== 1 分裂生殖、出芽生殖 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 560, height: 540, rx: 16, ...FRAME }, P1);
      el('rect', { x: 610, y: 96, width: 560, height: 540, rx: 16, ...FRAME }, P1);
      text(P1, 310, 144, '分裂生殖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P1, 890, 144, '出芽生殖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const pm = paramecium(P1), pd = [paramecium(P1), paramecium(P1)];
      pd.forEach((d) => { d.g.style.opacity = 0; });
      pm.set(310, 320, 170, 58, 0, 0);
      text(P1, 310, 470, '草履蟲', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(P1, 310, 512, '約 0.2 mm＊', { size: 22, color: C.hi });
      text(P1, 310, 574, '單細胞生物：一個變成兩個', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(P1, 310, 612, '例如：草履蟲、變形蟲', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 水螅
      const hyG = S.place(g(P1), { x: 730, y: 520, s: 0.88 });
      hydra(hyG);
      const bud = S.place(g(hyG), { x: 23, y: -110, r: -40, s: 0.05 });
      hydraBud(bud);
      const young = S.place(g(hyG, { opacity: 0 }), { x: 160, y: 0, r: -90, s: 0.95 });
      hydraBud(young);
      const budL = S.callout(P1, 790, 404, 880, 330, '芽體', C.hi, { size: 24 });
      const momL = S.callout(P1, 722, 440, 650, 472, '母體', C.ink, { size: 22 });
      const newL = g(P1, { opacity: 0 });
      text(newL, 900, 476, '新個體', { 'font-size': 24, 'font-weight': 700, fill: C.hi });
      text(P1, 760, 574, '水螅', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(P1, 760, 612, '約 1 cm＊', { size: 22, color: C.hi });
      // 酵母菌
      const yg = g(P1);
      el('ellipse', { cx: 1000, cy: 330, rx: 40, ry: 33, fill: 'rgba(240,220,160,0.25)', stroke: '#f0dca0', 'stroke-width': 2.5 }, yg);
      el('circle', { cx: 996, cy: 334, r: 9, fill: 'rgba(167,150,255,0.5)' }, yg);
      el('ellipse', { cx: 1066, cy: 280, rx: 46, ry: 37, fill: 'rgba(240,220,160,0.25)', stroke: '#f0dca0', 'stroke-width': 2.5 }, yg);
      el('circle', { cx: 1060, cy: 284, r: 10, fill: 'rgba(167,150,255,0.5)' }, yg);
      const ybud = el('circle', { cx: 1110, cy: 246, r: 0, fill: 'rgba(240,220,160,0.25)', stroke: '#f0dca0', 'stroke-width': 2.5 }, yg);
      const yL = S.callout(P1, 1124, 236, 1110, 160, '芽體', C.hi, { size: 22 });
      text(P1, 1060, 440, '酵母菌', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(P1, 1060, 482, '約 5 μm＊', { size: 22, color: C.hi });
      text(P1, 1000, 574, '長出芽體，長大後脫離母體', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.drive(tl, (u) => {
        const k1 = sm(0, 0.6, u), k2 = sm(0.6, 1, u);
        pm.set(310, 320, 170, 58, k1 * 0.92, sm(0, 0.5, u));
        pm.g.style.opacity = u < 0.62 ? 1 : 0;
        pd.forEach((d, i) => { const s = i ? 1 : -1; d.set(310 + s * S.lerp(100, 142, k2), 320, S.lerp(84, 118, k2), S.lerp(54, 52, k2), 0, 0); d.g.style.opacity = u < 0.6 ? 0 : 1; });
      }, 3.6, 's1+=0.6', 'none');
      S.drive(tl, (u) => {
        const gr = sm(0, 0.6, u), det = sm(0.7, 1, u);
        S.place(bud, { x: 23, y: -110, r: -40, s: S.lerp(0.05, 1, gr) }); // 芽體一直長在母體側面
        young.style.opacity = det;                                          // 另一個已經脫離、長成的新個體
        ybud.setAttribute('r', 22 * sm(0, 0.6, u));
        ybud.setAttribute('cx', 1104 + 12 * sm(0, 0.6, u) + 4 * det); ybud.setAttribute('cy', 250 - 10 * sm(0, 0.6, u) - 3 * det);
      }, 5, 's1+=0.8', 'none');
      S.show(tl, momL, 's1+=1.2', 0.3);
      S.show(tl, budL, 's1+=3.4', 0.3);
      S.show(tl, yL, 's1+=3.4', 0.3);
      S.show(tl, newL, 's1+=5.8', 0.4);

      // ===== 2 斷裂生殖、孢子繁殖 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 560, height: 556, rx: 16, ...FRAME }, P2);
      el('rect', { x: 610, y: 96, width: 560, height: 556, rx: 16, ...FRAME }, P2);
      text(P2, 310, 144, '斷裂生殖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P2, 890, 144, '孢子繁殖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const WL = { E: g(P2), F: g(P2), T: g(P2) };
      const wA = wormPiece(WL, 'head'), wB = wormPiece(WL, 'tail');
      const LB = 125;
      wA.set(160, 300, LB, 0, 0); wB.set(410, 300, LB, 0, 0);
      const cut = g(P2, { opacity: 0 });
      el('line', { x1: 285, y1: 240, x2: 285, y2: 360, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, cut);
      text(cut, 285, 226, '切成兩段', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      const regenA = g(P2, { opacity: 0 }), regenB = g(P2, { opacity: 0 });
      text(regenA, 400, 254, '長出新的尾部', { 'font-size': 22, fill: WORM_NEW, 'font-weight': 700 });
      text(regenB, 345, 470, '長出新的頭部', { 'font-size': 22, 'text-anchor': 'middle', fill: WORM_NEW, 'font-weight': 700 });
      text(P2, 250, 193, '渦蟲', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(P2, 370, 184, '約 1～2 cm＊', { size: 20, color: C.hi });
      text(P2, 310, 506, '1 隻斷成 2 段 → 長成 2 隻：數目增加', { 'font-size': 23, 'text-anchor': 'middle', fill: C.ink2 });
      text(P2, 310, 538, '例如：渦蟲、海星、水綿', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 對照：壁虎斷尾再長出來，數目沒有增加 → 只是再生
      const regen2 = g(P2, { opacity: 0 });
      el('rect', { x: 46, y: 556, width: 528, height: 86, rx: 12, fill: 'rgba(255,143,143,0.07)', stroke: '#ff8f8f', 'stroke-width': 2 }, regen2);
      gecko(regen2, 104, 598, 0.6, 'cut');
      geckoTail(regen2, 148, 614, 0.6, 10);
      arrow(regen2, 192, 598, 226, 598, C.ink2, 3, 11);
      gecko(regen2, 288, 598, 0.6, 'regrown');
      text(regen2, 362, 590, '壁虎斷尾再長出來：', { 'font-size': 21, fill: C.ink });
      text(regen2, 362, 622, '是再生，不是生殖', { 'font-size': 22, fill: '#ff8f8f', 'font-weight': 700 });
      // 黑黴菌
      const bread = g(P2);
      el('path', { d: 'M 640,560 L 640,450 C 640,400 690,388 712,410 C 740,384 800,392 806,440 L 806,560 Z', fill: '#d9a35a', stroke: '#a8742e', 'stroke-width': 4 }, bread);
      el('path', { d: 'M 652,550 L 652,452 C 652,414 690,404 712,424 C 736,402 790,410 794,446 L 794,550 Z', fill: '#f2dcae' }, bread);
      const rm = S.rng(4);
      for (let i = 0; i < 16; i++) { const x = 680 + rm() * 90, y = 440 + rm() * 70; el('line', { x1: x, y1: y, x2: x + (rm() - 0.5) * 8, y2: y - 10 - rm() * 8, stroke: '#ffffff', 'stroke-width': 1.5, opacity: 0.8 }, bread); el('circle', { cx: x + (rm() - 0.5) * 6, cy: y - 16 - rm() * 6, r: 3.5, fill: '#2a2a2a' }, bread); }
      el('ellipse', { cx: 726, cy: 470, rx: 52, ry: 36, fill: 'none', stroke: C.hi, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, bread);
      el('line', { x1: 778, y1: 460, x2: 880, y2: 380, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, bread);
      text(P2, 723, 588, '發霉的麵包', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const ZX = 1010, ZY = 330, ZR = 135;
      el('circle', { cx: ZX, cy: ZY, r: ZR, fill: '#0f2230', stroke: '#4a6272', 'stroke-width': 3 }, P2);
      el('path', { d: `M ${ZX - 120},${ZY + 80} C ${ZX - 60},${ZY + 70} ${ZX + 40},${ZY + 90} ${ZX + 120},${ZY + 76}`, fill: 'none', stroke: '#e8e8e8', 'stroke-width': 3 }, P2);
      for (let i = 0; i < 6; i++) { const x = ZX - 100 + i * 40; el('path', { d: `M ${x},${ZY + 80} l -6,16 M ${x},${ZY + 80} l 5,18`, stroke: '#cfcfcf', 'stroke-width': 2 }, P2); }
      const sporangia = [[ZX - 70, ZY - 10], [ZX - 10, ZY - 60], [ZX + 60, ZY - 20]].map(([x, y]) => {
        el('path', { d: `M ${x},${ZY + 80} C ${x - 4},${(y + ZY + 80) / 2} ${x + 4},${(y + ZY + 80) / 2} ${x},${y + 18}`, fill: 'none', stroke: '#e8e8e8', 'stroke-width': 3 }, P2);
        const sg = g(P2);
        el('circle', { cx: x, cy: y, r: 24, fill: '#2b2b30', stroke: '#8a8a95', 'stroke-width': 2 }, sg);
        for (let k = 0; k < 9; k++) el('circle', { cx: x + Math.cos(k * 0.7) * 12, cy: y + Math.sin(k * 1.3) * 12, r: 3, fill: '#55555f' }, sg);
        return sg;
      });
      const spores = Array.from({ length: 14 }, () => el('ellipse', { rx: 4.5, ry: 3.5, fill: '#4a4a55', stroke: '#9a9aa5', 'stroke-width': 1, opacity: 0 }, P2));
      const sproutPath = el('path', { d: `M 1094,560 C 1100,548 1112,546 1124,550 C 1136,554 1146,548 1150,540`, fill: 'none', stroke: '#e8e8e8', 'stroke-width': 2.5 }, P2);
      const sporeL = [S.callout(P2, ZX - 10 - 20, ZY - 60 - 10, 870, 210, '孢子囊', '#cfcfcf', { size: 22 }), S.callout(P2, ZX - 40, ZY + 80, 930, 500, '菌絲', '#e8e8e8', { size: 22 })];
      const sporeT = g(P2, { opacity: 0 });
      text(sporeT, 1090, 590, '孢子散播出去', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P2, 890, 630, '例如：黴菌、蕈類、蕨類', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, cut, 's2+=0.8', 0.3);
      S.drive(tl, (u) => {
        const sep = sm(0, 0.25, u), gr = sm(0.3, 0.9, u);
        wA.set(S.lerp(160, 140, sep), S.lerp(300, 260, sep), LB, 40 * gr, gr);
        wB.set(S.lerp(410, 450, sep), S.lerp(300, 400, sep), LB, 40 * gr, gr);
      }, 4.2, 's2+=1.3', 'none');
      S.hide(tl, cut, 's2+=1.4', 0.3);
      S.show(tl, regenA, 's2+=4.6', 0.3);
      S.show(tl, regenB, 's2+=4.6', 0.3);
      sporeL.forEach((l) => S.show(tl, l, 's2+=0.9', 0.3));
      S.drive(tl, (u) => {
        const burst = sm(0, 0.15, u);
        sporangia[1].style.opacity = 1 - burst * 0.75;
        spores.forEach((s, i) => {
          const k = sm(0.05 + i * 0.02, 0.75 + i * 0.015, u), a = -2.4 + (i / 13) * 2.6;
          const x0 = ZX - 10, y0 = ZY - 60;
          const x = x0 + Math.cos(a) * 30 * Math.min(1, k * 4) + k * (60 + (i % 5) * 14), y = y0 + Math.sin(a) * 30 * Math.min(1, k * 4) + k * k * (260 - (i % 4) * 25);
          s.setAttribute('cx', x.toFixed(1)); s.setAttribute('cy', Math.min(y, 556 - (i % 3) * 4).toFixed(1));
          s.style.opacity = u > 0.02 ? 1 : 0;
        });
        sproutPath.style.opacity = sm(0.85, 1, u);
      }, 4, 's2+=2', 'none');
      S.show(tl, sporeT, 's2+=5.2', 0.4);
      S.show(tl, regen2, 's2+=5.6', 0.5);

      // ===== 3 營養器官繁殖：根、莖、葉 =====
      const P3 = g(root, { opacity: 0 });
      const PX = [24, 315, 606, 897], PW = 279;
      PX.forEach((x) => el('rect', { x, y: 96, width: PW, height: 476, rx: 16, ...FRAME }, P3));
      [['以根繁殖', '#e8b86a'], ['以莖繁殖', '#8fd07a'], ['以莖繁殖', '#8fd07a'], ['以葉繁殖', '#6fce62']].forEach(([s, c], i) => text(P3, PX[i] + PW / 2, 142, s, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: c }));
      ['番薯的塊根', '馬鈴薯的塊莖', '草莓的匍匐莖', '落地生根的葉'].forEach((s, i) => text(P3, PX[i] + PW / 2, 548, s, { 'font-size': 25, 'text-anchor': 'middle', 'font-weight': 700 }));
      const grow3 = [];
      // 番薯
      soil(P3, 40, 400, 247, 110);
      const sw = g(P3);
      [[100, 440, 70, 470], [130, 452, 120, 496], [220, 440, 252, 470], [190, 452, 200, 498]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M ${x1},${y1} Q ${(x1 + x2) / 2 + 6},${(y1 + y2) / 2} ${x2},${y2}`, fill: 'none', stroke: '#e8d8b0', 'stroke-width': 2 }, sw));
      el('path', { d: 'M 70,420 C 80,396 140,392 190,400 C 232,406 262,420 258,434 C 252,452 200,462 150,460 C 104,458 66,446 70,420 Z', fill: '#b5487a', stroke: '#e07aa8', 'stroke-width': 2.5 }, sw);
      el('path', { d: 'M 110,412 q 30,-8 60,-4 M 150,440 q 40,4 70,-6', fill: 'none', stroke: '#8a2f5a', 'stroke-width': 2 }, sw);
      const swS = g(P3);
      [[120, 402, -98, 190], [196, 402, -80, 170]].forEach(([x, y, a, L]) => {
        const r = (a * Math.PI) / 180, ex = x + Math.cos(r) * L, ey = y + Math.sin(r) * L;
        el('path', { d: `M ${x},${y} Q ${x + Math.cos(r) * L * 0.5 + 10},${y + Math.sin(r) * L * 0.5} ${ex},${ey}`, fill: 'none', stroke: '#7fae4a', 'stroke-width': 4, 'stroke-linecap': 'round' }, swS);
        [[0.35, -1], [0.62, 1], [0.92, -1]].forEach(([f, s]) => heart(swS, x + (ex - x) * f, y + (ey - y) * f, 40, 22, s > 0 ? -40 : -140));
      });
      grow3.push(swS);
      // 馬鈴薯
      soil(P3, 331, 430, 247, 80);
      const po = g(P3);
      [[400, 470, 380, 500], [460, 480, 466, 506], [510, 470, 536, 498]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M ${x1},${y1} Q ${x2},${y1} ${x2},${y2}`, fill: 'none', stroke: '#e8d8b0', 'stroke-width': 2 }, po));
      el('ellipse', { cx: 455, cy: 410, rx: 92, ry: 56, fill: '#c9a05a', stroke: '#e8c88a', 'stroke-width': 2.5, transform: 'rotate(-6 455 410)' }, po);
      [[400, 392], [460, 372], [512, 392], [432, 430], [492, 432]].forEach(([x, y]) => el('path', { d: `M ${x - 7},${y} q 7,-6 14,0`, fill: 'none', stroke: '#7a5a2c', 'stroke-width': 2.5 }, po));
      const poS = g(P3);
      [[460, 368, -92, 130], [400, 388, -118, 96], [512, 388, -62, 104]].forEach(([x, y, a, L]) => {
        const r = (a * Math.PI) / 180, ex = x + Math.cos(r) * L, ey = y + Math.sin(r) * L;
        el('line', { x1: x, y1: y, x2: ex, y2: ey, stroke: '#8fc06a', 'stroke-width': 5, 'stroke-linecap': 'round' }, poS);
        leaf(poS, x + (ex - x) * 0.6, y + (ey - y) * 0.6, 32, 14, a + 45);
        leaf(poS, x + (ex - x) * 0.85, y + (ey - y) * 0.85, 30, 13, a - 45);
        leaf(poS, ex, ey, 28, 12, a);
      });
      grow3.push(poS);
      const eyeL = S.callout(P3, 492, 432, 552, 482, '芽眼', C.hi, { size: 22 });
      // 草莓：母株（有根、葉斜向上、掛著果實）→ 匍匐莖沿著地面爬 → 節上長出有根有葉的新植株 → 莖尖繼續往前長
      soil(P3, 622, 450, 247, 60);
      const sb = g(P3);
      [[686, 452, 668, 490], [688, 452, 690, 498], [690, 452, 710, 488]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M ${x1},${y1} Q ${x2},${y1 + 12} ${x2},${y2}`, fill: 'none', stroke: '#e8d8b0', 'stroke-width': 2 }, sb));
      [[-108, 120], [-84, 150], [-62, 118]].forEach(([a, L]) => { const r = (a * Math.PI) / 180; trifol(sb, 686, 448, 686 + Math.cos(r) * L, 448 + Math.sin(r) * L, 0.75); });
      el('path', { d: 'M 680,446 C 668,432 660,422 654,412', fill: 'none', stroke: '#7fae4a', 'stroke-width': 3 }, sb);
      el('path', { d: 'M 642,402 C 640,388 666,384 668,398 C 670,416 656,430 652,430 C 646,428 642,414 642,402 Z', fill: '#e0384c', stroke: '#ff8a9a', 'stroke-width': 1.5 }, sb);
      [[650, 400], [660, 404], [652, 414], [658, 418]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.6, fill: '#ffd166' }, sb));
      el('path', { d: 'M 646,392 l 6,-8 l 4,8 l 8,-4 l -4,8', fill: '#4fae4a' }, sb);
      const runner = el('path', { d: 'M 694,447 C 730,437 776,437 806,447 C 826,442 846,441 860,445', fill: 'none', stroke: '#c0506a', 'stroke-width': 4, 'stroke-linecap': 'round' }, P3);
      const baby = g(P3, { opacity: 0 });
      [[806, 452, 792, 482], [808, 452, 810, 490], [810, 452, 826, 480]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M ${x1},${y1} Q ${x2},${y1 + 10} ${x2},${y2}`, fill: 'none', stroke: '#e8d8b0', 'stroke-width': 2 }, baby));
      [[784, 392], [810, 378], [836, 394]].forEach(([tx, ty]) => trifol(baby, 808, 447, tx, ty, 0.6));
      leaf(baby, 860, 444, 13, 6, -122, { fill: '#7fcf62' });
      leaf(baby, 860, 444, 13, 6, -58, { fill: '#7fcf62' });
      const runL = S.callout(P3, 752, 440, 735, 490, '匍匐莖', '#ff9ab0', { size: 22 });
      const babyL = S.callout(P3, 810, 394, 838, 250, '新植株', C.hi, { size: 22 });
      // 落地生根
      el('rect', { x: 913, y: 440, width: 247, height: 40, rx: 10, fill: '#e8eef2', opacity: 0.9 }, P3);
      text(P3, 1036, 506, '溼棉花', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const LCX = 1036, LCY = 400, LRX = 112, LRY = 40;
      const lp = [], notch = [];
      for (let i = 0; i < 112; i++) {
        const t = (i / 112) * 6.283, f = 1 - 0.09 * Math.pow(1 - Math.abs(Math.sin(7 * t)), 3);
        lp.push([LCX + LRX * f * Math.cos(t), LCY + LRY * f * Math.sin(t)]);
      }
      for (let k = 0; k < 14; k++) { const t = (k * Math.PI) / 7; notch.push([LCX + LRX * 0.91 * Math.cos(t), LCY + LRY * 0.91 * Math.sin(t), Math.sin(t)]); }
      const kal = g(P3);
      el('path', { d: S.smoothPath(lp), fill: '#5e9e4a', stroke: '#9fd27a', 'stroke-width': 2.5 }, kal);
      el('path', { d: `M ${LCX - LRX + 14},${LCY} Q ${LCX},${LCY - 6} ${LCX + LRX - 14},${LCY}`, fill: 'none', stroke: '#a8e39a', 'stroke-width': 2 }, kal);
      const kalS = g(P3);
      notch.forEach(([x, y, sn]) => {
        if (Math.abs(x - LCX) > LRX * 0.9) return;
        const front = sn > 0.2;
        if (front) [[-6, 22], [0, 28], [6, 22]].forEach(([dx, L]) => el('path', { d: `M ${x},${y + 2} Q ${x + dx},${y + L * 0.6} ${x + dx * 1.6},${y + L + 14}`, fill: 'none', stroke: '#f2ead0', 'stroke-width': 2 }, kalS));
        const by = front ? y : y - 2;
        leaf(kalS, x, by, 18, 8, -125, { fill: '#7fcf62', vein: '#c8f0b0' });
        leaf(kalS, x, by, 18, 8, -55, { fill: '#7fcf62', vein: '#c8f0b0' });
      });
      grow3.push(kalS);
      const kalL = S.callout(P3, LCX - 32, 365, 1012, 230, '葉緣長出新芽和根', C.hi, { size: 20 });
      const p3txt = g(P3, { opacity: 0 });
      S.pill(p3txt, 600, 628, '根、莖、葉是營養器官：不用種子，也能長出新植株', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      grow3.forEach((gp, i) => tl.fromTo(gp, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, `s3+=${0.8 + i * 0.9}`));
      S.drawOn(tl, runner, 1, 's3+=1.6');
      S.show(tl, baby, 's3+=2.6', 0.5);
      S.show(tl, eyeL, 's3+=1.9', 0.3);
      S.show(tl, runL, 's3+=2.2', 0.3);
      S.show(tl, babyL, 's3+=3', 0.3);
      S.show(tl, kalL, 's3+=3.6', 0.3);
      S.show(tl, p3txt, 's3+=4.4', 0.4);

      // ===== 4 組織培養與人為的方法 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 24, y: 96, width: 676, height: 540, rx: 16, ...FRAME }, P4);
      el('rect', { x: 716, y: 96, width: 460, height: 540, rx: 16, ...FRAME }, P4);
      text(P4, 362, 144, '組織培養', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P4, 946, 140, '其他人為的繁殖方法', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const tc = [g(P4, { opacity: 0 }), g(P4, { opacity: 0 }), g(P4, { opacity: 0 }), g(P4, { opacity: 0 })];
      orchid(tc[0], 110, 460, 0.95);
      // 一小塊組織
      el('ellipse', { cx: 280, cy: 430, rx: 56, ry: 18, fill: 'rgba(200,230,255,0.15)', stroke: '#cfe8ff', 'stroke-width': 2.5 }, tc[1]);
      el('ellipse', { cx: 280, cy: 428, rx: 44, ry: 12, fill: 'rgba(240,220,150,0.45)' }, tc[1]);
      el('path', { d: 'M 270,424 q 8,-12 18,-2 q 4,8 -6,10 q -10,2 -12,-8 Z', fill: '#4fae4a', stroke: '#a8e39a', 'stroke-width': 1.5 }, tc[1]);
      const flask = (p, x, y) => {
        el('path', { d: `M ${x - 14},${y - 120} L ${x - 14},${y - 70} L ${x - 54},${y} Q ${x - 58},${y + 8} ${x - 48},${y + 8} L ${x + 48},${y + 8} Q ${x + 58},${y + 8} ${x + 54},${y} L ${x + 14},${y - 70} L ${x + 14},${y - 120}`, fill: 'rgba(200,230,255,0.10)', stroke: '#cfe8ff', 'stroke-width': 3 }, p);
        el('path', { d: `M ${x - 44},${y - 16} L ${x + 44},${y - 16} L ${x + 52},${y + 2} Q ${x + 54},${y + 6} ${x + 48},${y + 6} L ${x - 48},${y + 6} Q ${x - 54},${y + 6} ${x - 52},${y + 2} Z`, fill: 'rgba(240,220,150,0.5)' }, p);
        el('rect', { x: x - 18, y: y - 132, width: 36, height: 14, rx: 4, fill: '#d0d8de' }, p);
      };
      flask(tc[2], 440, 460);
      const rp = S.rng(8);
      for (let i = 0; i < 9; i++) { const x = 404 + i * 9, y = 446 - (i % 3) * 3; el('line', { x1: x, y1: y, x2: x + (rp() - 0.5) * 4, y2: y - 14 - rp() * 6, stroke: '#7fcf62', 'stroke-width': 2 }, tc[2]); leaf(tc[2], x, y - 16, 10, 4, -130); leaf(tc[2], x, y - 16, 10, 4, -50); }
      [560, 602, 644].forEach((x) => orchid(tc[3], x, 470, 0.34)); // 最右邊的花不超出框（框右緣 x=700）
      ['蘭花', '取一小塊組織|放在培養基上', '細胞分裂，|長成許多小苗', '許多相同的蘭花'].forEach((s, i) => s.split('|').forEach((line, k) => text(tc[i], [110, 280, 440, 602][i], 556 + k * 28, line, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 })));
      const tcA = [arrow(P4, 192, 410, 220, 410), arrow(P4, 342, 410, 378, 410), arrow(P4, 502, 410, 530, 410)];
      tcA.forEach((a) => a.setAttribute('opacity', 0));
      text(P4, 362, 182, '培養基含有養分和激素', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const tcNote = g(P4, { opacity: 0 });
      S.pill(tcNote, 362, 222, '短時間內大量繁殖，特徵和親代相同', { size: 22, color: C.hi, edge: C.hi });
      // 扦插、壓條、嫁接
      const man = [0, 1, 2].map(() => g(P4, { opacity: 0 }));
      // 扦插
      soil(man[0], 736, 250, 110, 48);
      el('line', { x1: 790, y1: 280, x2: 794, y2: 180, stroke: '#8a6a40', 'stroke-width': 6, 'stroke-linecap': 'round' }, man[0]);
      leaf(man[0], 793, 200, 34, 13, -140); leaf(man[0], 793, 190, 34, 13, -40);
      [[784, 276, 770, 296], [794, 280, 806, 296], [790, 282, 790, 298]].forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: '#e8d8b0', 'stroke-width': 2 }, man[0]));
      text(man[0], 870, 206, '扦插', { 'font-size': 26, 'font-weight': 700, fill: C.hi });
      text(man[0], 870, 240, '剪一段莖插在土中，', { 'font-size': 22, fill: C.ink2 });
      text(man[0], 870, 270, '長出根和芽', { 'font-size': 22, fill: C.ink2 });
      // 壓條
      soil(man[1], 736, 420, 110, 46);
      el('path', { d: 'M 752,420 L 752,330', stroke: '#8a6a40', 'stroke-width': 7, 'stroke-linecap': 'round' }, man[1]);
      leaf(man[1], 752, 336, 30, 12, -130); leaf(man[1], 752, 344, 30, 12, -50);
      el('path', { d: 'M 752,370 C 780,370 796,404 806,428 C 814,410 820,390 826,360', fill: 'none', stroke: '#8a6a40', 'stroke-width': 5, 'stroke-linecap': 'round' }, man[1]);
      leaf(man[1], 826, 364, 26, 11, -120); leaf(man[1], 826, 362, 26, 11, -40);
      [[804, 430, 794, 452], [808, 430, 816, 452]].forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: '#e8d8b0', 'stroke-width': 2 }, man[1]));
      text(man[1], 870, 368, '壓條', { 'font-size': 26, 'font-weight': 700, fill: C.hi });
      text(man[1], 870, 402, '枝條埋入土中長根後，', { 'font-size': 22, fill: C.ink2 });
      text(man[1], 870, 432, '再剪離母株', { 'font-size': 22, fill: C.ink2 });
      // 嫁接
      el('path', { d: 'M 778,606 L 776,546 L 806,546 L 804,606 Z', fill: '#7a5634', stroke: '#a8865a', 'stroke-width': 2 }, man[2]);
      el('path', { d: 'M 784,548 L 786,500 L 798,500 L 800,548 Z', fill: '#6f8f4a', stroke: '#9fc07a', 'stroke-width': 2 }, man[2]);
      leaf(man[2], 792, 508, 30, 12, -135); leaf(man[2], 792, 512, 30, 12, -45);
      el('rect', { x: 772, y: 538, width: 38, height: 14, rx: 3, fill: '#e8e0c0', opacity: 0.9 }, man[2]);
      text(man[2], 870, 532, '嫁接', { 'font-size': 26, 'font-weight': 700, fill: C.hi });
      text(man[2], 870, 566, '把一段枝條接到', { 'font-size': 22, fill: C.ink2 });
      text(man[2], 870, 596, '另一株植物的莖上', { 'font-size': 22, fill: C.ink2 });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      tc.forEach((t, i) => { S.show(tl, t, `s4+=${0.6 + i * 0.8}`, 0.4); if (i < 3) S.show(tl, tcA[i], `s4+=${1 + i * 0.8}`, 0.3); });
      S.show(tl, tcNote, 's4+=3.6', 0.4);
      man.forEach((m, i) => S.show(tl, m, `s4+=${4.2 + i * 0.4}`, 0.4));

      // ===== 5 優點與缺點 =====
      const P5 = g(root, { opacity: 0 });
      el('rect', { x: 24, y: 96, width: 410, height: 540, rx: 16, ...FRAME }, P5);
      text(P5, 60, 150, '優點', { 'font-size': 30, 'font-weight': 700, fill: '#6fce62' });
      text(P5, 60, 198, '繁殖快、數量多', { 'font-size': 26 });
      text(P5, 60, 240, '子代保留親代的特徵', { 'font-size': 26 });
      text(P5, 60, 276, '例如：鳳梨的甜度、蘭花的花色', { 'font-size': 20, fill: C.mute });
      const bad5 = g(P5, { opacity: 0 });
      text(bad5, 60, 360, '缺點', { 'font-size': 30, 'font-weight': 700, fill: '#ff8f8f' });
      text(bad5, 60, 408, '子代的遺傳物質都相同，', { 'font-size': 25 });
      text(bad5, 60, 446, '變異少', { 'font-size': 25 });
      text(bad5, 60, 496, '環境改變時（例如病害），', { 'font-size': 25 });
      text(bad5, 60, 534, '可能全部受到影響', { 'font-size': 25 });
      el('rect', { x: 452, y: 96, width: 724, height: 262, rx: 16, ...FRAME }, P5);
      el('rect', { x: 452, y: 374, width: 724, height: 262, rx: 16, ...FRAME }, P5);
      text(P5, 476, 136, '無性生殖產生的一群：遺傳物質都相同', { 'font-size': 24, 'font-weight': 700 });
      text(P5, 476, 414, '有性生殖產生的一群：彼此有差異', { 'font-size': 24, 'font-weight': 700 });
      const rowA = [], rowB = [];
      const rv = S.rng(21);
      for (let i = 0; i < 8; i++) {
        rowA.push(plant(P5, 520 + i * 84, 330, {}));
        rowB.push(plant(P5, 520 + i * 84, 608, { h: 90 + rv() * 60, leafC: ['#4fae4a', '#6fce62', '#3f9a4a', '#8fd07a'][i % 4], flower: ['#ff9ec4', '#ffd166', '#c8a8ff', '#ffffff', '#ff8f6a'][(i * 3) % 5], lw: 0.85 + rv() * 0.35 }));
      }
      el('line', { x1: 470, y1: 332, x2: 1158, y2: 332, stroke: SOIL_T, 'stroke-width': 4 }, P5);
      el('line', { x1: 470, y1: 610, x2: 1158, y2: 610, stroke: SOIL_T, 'stroke-width': 4 }, P5);
      const sick = new Set([1, 4, 6]);
      const dis = g(P5, { opacity: 0 });
      S.pill(dis, 814, 52, '環境改變：出現病害＊', { size: 26, color: '#ff8f8f', edge: '#ff8f8f' });
      const resA = g(P5, { opacity: 0 }), resB = g(P5, { opacity: 0 });
      text(resA, 1150, 136, '全部受害', { 'font-size': 26, 'font-weight': 700, fill: '#ff8f8f', 'text-anchor': 'end' });
      text(resB, 1150, 414, '有些能存活', { 'font-size': 26, 'font-weight': 700, fill: '#6fce62', 'text-anchor': 'end' });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, dis, 's5+=1.4', 0.4);
      const BROWN = '#8a6a3a';
      S.drive(tl, (u) => {
        const col = (c, k) => gsap.utils.interpolate(c, BROWN, k);
        rowA.forEach((pl, i) => { const k = sm(i * 0.06, 0.5 + i * 0.06, u); pl.parts.forEach((pa, j) => pa.setAttribute(j ? 'fill' : 'stroke', col(j ? LEAF : STEM, k))); pl.fl.style.opacity = 1 - k * 0.8; });
        rowB.forEach((pl, i) => { if (!sick.has(i)) return; const k = sm(i * 0.05, 0.6 + i * 0.05, u); pl.parts.forEach((pa, j) => pa.setAttribute(j ? 'fill' : 'stroke', col(j ? pl.parts[j].dataset.c : STEM, k))); pl.fl.style.opacity = 1 - k * 0.8; });
      }, 2.8, 's5+=1.9', 'none');
      S.show(tl, resA, 's5+=4.4', 0.4);
      S.show(tl, resB, 's5+=4.6', 0.4);
      S.show(tl, bad5, 's5+=4.9', 0.5);
      rowB.forEach((pl) => pl.parts.forEach((pa, j) => { if (j) pa.dataset.c = pa.getAttribute('fill'); }));

      return {
        tl,
        notes: [
          '＊示意：以 2 對染色體為例。無性生殖靠細胞分裂產生子代，通常不經過減數分裂，所以子代的遺傳物質和親代相同。',
          '＊大小為約略值，圖中的生物都放大了。細菌也是一分為二地繁殖。酵母菌是單細胞生物，水螅是多細胞動物。',
          '＊示意：孢子非常小，圖中畫得很大；渦蟲的大小為約略值。渦蟲切成兩段後，前段長出尾部、後段長出頭部，變成 2 隻。壁虎斷尾、傷口癒合只是把缺少的部分長回來（再生），個體數目沒有增加，不是生殖。蕈類和蕨類也用孢子繁殖，第十章會再學。斷裂生殖例如渦蟲；孢子繁殖例如黴菌。',
          '市面上的番薯，大多是取一段番薯的莖插在土中繁殖（扦插）。用來繁殖的根、莖、葉都是營養器官；花、果實、種子才是生殖器官。',
          '扦插、壓條、嫁接是人為的繁殖方法，也是利用營養器官的無性生殖。目前市面上的蘭花，大多用組織培養大量繁殖。',
          '＊示意：植株的數目和受害的情形都是示意。例如香蕉多用無性生殖繁殖，植株的遺傳物質幾乎相同，遇到黃葉病時可能大片受害（補充）。',
        ],
        steps: [
          '<b>無性生殖</b>：親代產生子代時，<b>不需要</b>精子和卵（配子）結合。子代由親代的細胞分裂而來，遺傳物質和親代<b>相同</b>。',
          '<b>分裂生殖</b>：單細胞生物（例如草履蟲）經細胞分裂，一個變成兩個。<b>出芽生殖</b>：長出<b>芽體</b>，長大後脫離母體（例如水螅、酵母菌）。',
          '<b>斷裂生殖</b>：身體斷成幾段，每段長成一個新個體，數目增加。<b>孢子繁殖</b>：產生大量<b>孢子</b>，散播到適當環境就能長成新個體。',
          '<b>營養器官繁殖</b>：植物用<b>根、莖、葉</b>長出新植株，例如番薯的塊根、馬鈴薯的塊莖、草莓的匍匐莖、落地生根的葉。',
          '<b>組織培養</b>：把植物的一小塊組織放在含養分和激素的培養基中，經細胞分裂長成許多新植株，例如蘭花。',
          '無性生殖<b>繁殖快</b>，子代能保留親代的特徵；但子代的遺傳物質都相同、<b>變異少</b>，環境改變時，可能全部都受到影響。',
        ],
      };
    },
  });
})();
