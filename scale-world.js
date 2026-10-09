/* 尺度世界：人 → 胃 → 胃壁 → 細胞 → 細胞核 → DNA 六層圖與連續縮放。
   動畫（場景 1）與互動模型共用。 */
(() => {
  const { el, g, text, C } = S;
  const VP = { x: 24, y: 24, w: 840, h: 672 };
  const CX = VP.x + VP.w / 2, CY = VP.y + VP.h / 2;
  const TISSUE = { lumen: '#3e1f2d', mucosa: '#9c4a5f', gland: '#5a2638', epi: '#ffb3c1', sub: '#b98a72', fiber: '#e2bfa5', muscle: '#8f3a47', spindle: '#d9707c', cell: '#7a3549' };
  const BODY_K = 0.65; // 人體座標 → 第 0 層
  const BS = S.BODY.stomach;

  // 每一層：名稱、代表物大小（公尺）、聚焦點（本層座標）、到下一層的放大倍率
  // tool＝看這一層代表物需要的工具（和 toolFor() 依大小判斷的結果一致）；
  // hud＝畫面右上角的工具標籤（可分兩行，省略時為「工具：tool」）；toolNote＝讀數旁的補充說明
  const LV = [
    { tag: '個體｜人', tool: '肉眼', short: '人', name: '人（身高）', size: 1.6, f: [BS.x * BODY_K - 600 * BODY_K, BS.y * BODY_K - 381 * BODY_K], r: 1 / (BS.s * BODY_K) },
    { tag: '器官｜胃', tool: '肉眼', short: '胃', name: '胃（寬）', size: 0.15, f: null, r: 65.6 },
    { tag: '組織｜胃壁切面', tool: '肉眼', hud: ['肉眼看得到胃壁；分辨組織要低倍顯微鏡'], toolNote: '分辨組織要低倍顯微鏡', short: '胃壁', name: '胃壁（厚）', size: 0.003, f: [0, -212.4], r: 66.67 },
    { tag: '細胞｜胃壁的上皮細胞', tool: '光學顯微鏡', short: '細胞', name: '一個細胞（高）', size: 25e-6, f: [0, 75], r: 5 },
    { tag: '細胞內的構造｜細胞核、粒線體', tool: '光學顯微鏡', hud: ['工具：光學顯微鏡', '（粒線體要電子顯微鏡才看得清楚）'], toolNote: '粒線體要電子顯微鏡才看得清楚', short: '細胞核', name: '細胞核（寬）', size: 5e-6, f: [40, -60], r: 500 },
    { tag: '分子｜DNA、水、葡萄糖', tool: '電子顯微鏡', short: 'DNA', name: 'DNA（寬）', size: 2e-9 },
  ];
  S.SCALE_LV = LV;

  const fmt = (m) => {
    const sig = (v) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)).replace(/\.?0+$/, '');
    if (m >= 1) return sig(m) + ' m';
    if (m >= 0.01) return sig(m * 100) + ' cm';
    if (m >= 1e-3) return sig(m * 1e3) + ' mm';
    if (m >= 1e-6) return sig(m * 1e6) + ' μm';
    return sig(m * 1e9) + ' nm';
  };
  S.fmtLen = fmt;
  const ladderY = (m) => 96 - Math.log10(m) * 56;

  // ---------- 各層圖 ----------
  function drawPerson(p, o) {
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: '#0f1c27' }, p);
    const H = g(p, { transform: `translate(${-600 * BODY_K},${-381 * BODY_K}) scale(${BODY_K})` });
    S.human(H, { fill: '#2c5268', stroke: '#6fa3bd', sw: 3 });
    const org = S.digestive(g(H, { opacity: 0.9 }));
    [org.liver, org.pancreas].forEach((e) => e.setAttribute('opacity', 0.45));
    [org.large, org.small, org.eso].forEach((e) => e.setAttribute('opacity', 0.7));
    S.stomach(org.stomach, { wall: 10 });
    org.stomach.parentNode.appendChild(org.stomach);
    o.ring = el('circle', { cx: LV[0].f[0], cy: LV[0].f[1], r: 34, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, p);
    o.dim = S.dimension(p, -112, 209, -112, -208, '約 1.6 m', { offset: 84 });
  }

  function drawStomach(p, o) {
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: '#0f1c27' }, p);
    const st = S.stomach(p, { wall: 10 });
    // 胃底部（胃大彎最低點）＝下一層的聚焦點；往胃腔內移一點，讓上皮落在下一層的固定位置
    const body = st.body, L = body.getTotalLength();
    let best = { y: -1e9 };
    for (let s = 0; s < L; s += 2) { const q = body.getPointAtLength(s); if (q.y > best.y) best = { x: q.x, y: q.y }; }
    LV[1].f = [best.x, best.y - 5 + 215 / LV[1].r];
    o.dim = S.dimension(p, -270, 314, 230, 314, '寬約 15 cm', { offset: 26 });
    o.labels = [S.callout(p, -23, -290, 140, -296, '食道', C.ink2, { size: 24 }), S.callout(p, -324, 180, -180, 262, '小腸', C.ink2, { size: 24 })];
    o.ring = el('circle', { cx: LV[1].f[0], cy: LV[1].f[1], r: 26, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, p);
  }

  function drawWall(p, o) {
    const T = TISSUE;
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: T.muscle }, p);
    el('rect', { x: -440, y: -356, width: 880, height: 141, fill: T.lumen }, p);
    el('rect', { x: -440, y: -215, width: 880, height: 189, fill: T.mucosa }, p);
    el('rect', { x: -440, y: -26, width: 880, height: 126, fill: T.sub }, p);
    const rnd = S.rng(7);
    for (let i = 0; i < 26; i++) {
      const x = -440 + rnd() * 880, y = -20 + rnd() * 112;
      el('path', { d: `M${x},${y} q30,${-10 + rnd() * 20} 60,0`, stroke: T.fiber, 'stroke-width': 3, fill: 'none', opacity: 0.7 }, p);
    }
    [[-250, 40, 16], [130, 55, 12], [330, 30, 14]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: C.blood, stroke: '#ffd0d6', 'stroke-width': 3 }, p));
    for (let row = 0; row < 5; row++) for (let i = 0; i < 9; i++) {
      const x = -440 + i * 110 + (row % 2) * 55, y = 130 + row * 46;
      el('ellipse', { cx: x, cy: y, rx: 50, ry: 9, fill: T.spindle, opacity: 0.85 }, p);
      el('ellipse', { cx: x, cy: y, rx: 7, ry: 4, fill: '#5b2330' }, p);
    }
    el('line', { x1: -440, y1: -212.4, x2: 440, y2: -212.4, stroke: T.epi, 'stroke-width': 5.25 }, p);
    [-420, -300, -180, -60, 60, 180, 300, 420].forEach((x) => {
      el('path', { d: `M${x - 16},-218 L${x - 16},-62 Q${x - 16},-42 ${x},-42 Q${x + 16},-42 ${x + 16},-62 L${x + 16},-218 Z`, fill: T.gland }, p);
      el('path', { d: `M${x - 16},-212 L${x - 16},-62 Q${x - 16},-42 ${x},-42 Q${x + 16},-42 ${x + 16},-62 L${x + 16},-212`, fill: 'none', stroke: T.epi, 'stroke-width': 5.25 }, p);
    });
    o.labels = [
      S.callout(p, 240, -212, 310, -258, '上皮組織', T.epi),
      S.callout(p, -120, 40, -270, -80, '結締組織', '#ffe0c8'),
      S.callout(p, 0, 200, 250, 250, '肌肉組織', '#ffb0b8'),
    ];
    S.text(p, -376, -228, '胃的內部（胃腔）', { 'font-size': 22, fill: '#e8b8c4' });
    o.ring = el('circle', { cx: LV[2].f[0], cy: LV[2].f[1], r: 26, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, p);
  }

  function cellUnit(p, x, hi) {
    const cg = g(p, { opacity: hi ? 1 : 0.62 });
    el('rect', { x: x - 53, y: -173, width: 106, height: 350, rx: 18, fill: TISSUE.cell, stroke: TISSUE.epi, 'stroke-width': 4 }, cg);
    for (let k = 0; k < 6; k++) el('circle', { cx: x - 30 + (k % 3) * 30, cy: -148 + Math.floor(k / 3) * 26, r: 10, fill: '#f3d5dd', opacity: 0.45 }, cg);
    el('rect', { x: x - 49, y: 86, width: 12, height: 26, rx: 6, fill: C.mito }, cg);
    el('rect', { x: x + 37, y: 38, width: 12, height: 26, rx: 6, fill: C.mito }, cg);
    el('ellipse', { cx: x, cy: 75, rx: 33, ry: 42, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, cg);
    el('circle', { cx: x - 6, cy: 87, r: 9, fill: '#7b6ad6' }, cg);
    return cg;
  }

  function drawCells(p, o) {
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: TISSUE.sub }, p);
    el('rect', { x: -440, y: -356, width: 880, height: 183, fill: TISSUE.lumen }, p);
    for (let i = -3; i <= 3; i++) if (i) cellUnit(p, i * 112, false);
    o.focus = cellUnit(p, 0, true);
    el('line', { x1: -440, y1: 184, x2: 440, y2: 184, stroke: '#f0d0b8', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, p);
    o.dim = S.dimension(p, 74, 177, 74, -173, '約 25 μm', { offset: -80 });
    o.labels = [S.callout(p, 33, 75, 230, 260, '細胞核', C.nucleus, { size: 24 }), S.callout(p, -53, -40, -250, -260, '細胞膜', TISSUE.epi, { size: 24 })];
    o.ring = el('circle', { cx: LV[3].f[0], cy: LV[3].f[1], r: 52, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, p);
  }

  function mitochondrion(p, x, y, rot) {
    const m = g(p, { transform: `translate(${x},${y}) rotate(${rot})` });
    el('rect', { x: -30, y: -65, width: 60, height: 130, rx: 30, fill: '#b85a2a', stroke: C.mito, 'stroke-width': 5 }, m);
    el('path', { d: 'M -22,-40 L 8,-30 L -22,-15 L 8,-2 L -22,12 L 8,24 L -22,38', stroke: '#ffd0ad', 'stroke-width': 4, fill: 'none', 'stroke-linejoin': 'round' }, m);
  }

  function drawNucleus(p, o) {
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: '#5e2638' }, p);
    el('rect', { x: -265, y: -356, width: 530, height: 712, fill: TISSUE.cell }, p);
    [-265, 265].forEach((x) => el('line', { x1: x, y1: -356, x2: x, y2: 356, stroke: TISSUE.epi, 'stroke-width': 20 }, p));
    mitochondrion(p, -215, 120, 0);
    mitochondrion(p, 215, -120, 0);
    el('ellipse', { cx: 0, cy: 0, rx: 165, ry: 210, fill: '#3a2f6c', stroke: C.nucleus, 'stroke-width': 10 }, p);
    el('ellipse', { cx: 0, cy: 0, rx: 152, ry: 197, fill: 'none', stroke: '#6f5fc4', 'stroke-width': 3 }, p);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      el('circle', { cx: Math.cos(a) * 160, cy: Math.sin(a) * 205, r: 6, fill: '#1c1638' }, p);
    }
    el('circle', { cx: -40, cy: 70, r: 44, fill: '#6e5dc8' }, p);
    const rnd = S.rng(11);
    for (let k = 0; k < 7; k++) {
      let x = -110 + rnd() * 220, y = -150 + rnd() * 300, d = `M${x.toFixed(0)},${y.toFixed(0)}`;
      for (let s = 0; s < 6; s++) { x = S.clamp(x + (rnd() - 0.5) * 90, -120, 120); y = S.clamp(y + (rnd() - 0.5) * 90, -160, 160); d += ` Q${(x + 20).toFixed(0)},${(y - 25).toFixed(0)} ${x.toFixed(0)},${y.toFixed(0)}`; }
      el('path', { d, stroke: '#c9bdff', 'stroke-width': 4, fill: 'none', opacity: 0.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    }
    el('path', { d: 'M -10,-50 C 10,-62 25,-60 40,-60 C 60,-60 80,-56 100,-70', stroke: '#e3dbff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, p);
    o.dim = S.dimension(p, -165, 250, 165, 250, '約 5 μm', { offset: -36 });
    o.labels = [
      // 標籤放左上：右上角有兩行的工具標籤
      S.callout(p, -120, -150, -330, -240, '細胞核', C.nucleus, { size: 24 }),
      S.callout(p, -215, 175, -300, 280, '粒線體', C.mito, { size: 24 }),
      S.callout(p, 265, 150, 340, 60, '細胞膜', TISSUE.epi, { size: 24 }),
    ];
    o.ring = el('circle', { cx: LV[4].f[0], cy: LV[4].f[1], r: 30, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, p);
  }

  function drawDNA(p, o) {
    el('rect', { x: -440, y: -356, width: 880, height: 712, fill: '#2a2250' }, p);
    const A = 35, P = 119, base = ['#ff6b6b', '#ffd166', '#62a8ff', '#6fce62'];
    const strand = (ph) => { let d = ''; for (let x = -460; x <= 460; x += 6) d += (d ? 'L' : 'M') + `${x},${(A * Math.sin((x / P) * 2 * Math.PI + ph)).toFixed(1)}`; return d; };
    el('path', { d: strand(Math.PI * 0.75), stroke: '#8fd9ff', 'stroke-width': 8, fill: 'none', opacity: 0.55 }, p);
    let k = 0;
    for (let x = -455; x <= 455; x += 11.3) {
      const y1 = A * Math.sin((x / P) * 2 * Math.PI), y2 = A * Math.sin((x / P) * 2 * Math.PI + Math.PI * 0.75);
      el('line', { x1: x, y1, x2: x, y2, stroke: base[k++ % 4], 'stroke-width': 5 }, p);
    }
    el('path', { d: strand(0), stroke: '#cbbfff', 'stroke-width': 8, fill: 'none' }, p);
    const water = (x, y, rot) => {
      const w = g(p, { transform: `translate(${x},${y}) rotate(${rot})` });
      el('circle', { cx: 0, cy: 0, r: 6, fill: C.oxygen }, w);
      el('circle', { cx: -6, cy: 6, r: 3.6, fill: '#f4f7f9' }, w);
      el('circle', { cx: 6, cy: 6, r: 3.6, fill: '#f4f7f9' }, w);
    };
    const rnd = S.rng(5);
    for (let i = 0; i < 26; i++) {
      const x = -420 + rnd() * 840, y = (rnd() < 0.5 ? -1 : 1) * (80 + rnd() * 250);
      water(x, y, rnd() * 360);
    }
    const glucose = (x, y) => {
      const gg = g(p, { transform: `translate(${x},${y})` });
      let d = '';
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; d += (i ? 'L' : 'M') + `${(Math.cos(a) * 15).toFixed(1)},${(Math.sin(a) * 15).toFixed(1)}`; }
      el('path', { d: d + 'Z', fill: 'none', stroke: C.sugar, 'stroke-width': 4 }, gg);
      [[15, -9], [-15, 9], [0, -15]].forEach(([cx, cy]) => el('circle', { cx: cx * 1.25, cy: cy * 1.25, r: 3, fill: C.oxygen }, gg));
    };
    glucose(-230, -170); glucose(270, 190);
    o.dim = S.dimension(p, -300, 38, -300, -38, '', { size: 24 });
    S.pill(o.dim, -300, -82, '寬約 2 nm', { size: 24, color: C.hi, edge: C.hi });
    o.labels = [
      S.callout(p, 120, 2, 230, 120, 'DNA（遺傳物質）', '#cbbfff', { size: 24 }),
      S.callout(p, -230, -170, -90, -250, '葡萄糖', C.sugar, { size: 24 }),
    ];
    o.waterLabel = S.pill(g(p, { opacity: 0 }), 230, 290, '紅白小點：水分子 約 0.3 nm', { size: 22, color: '#ffd0d0', edge: C.oxygen });
    o.labels.push(o.waterLabel.parentNode);
  }

  const DRAW = [drawPerson, drawStomach, drawWall, drawCells, drawNucleus, drawDNA];

  // 建立整個尺度世界。回傳可直接控制的物件。
  S.scaleWorld = (root, idp = 'sw') => {
    const defs = el('defs', {}, root);
    el('clipPath', { id: idp + 'Clip' }, defs).appendChild(el('rect', { x: VP.x, y: VP.y, width: VP.w, height: VP.h, rx: 18 }));
    const rg = el('radialGradient', { id: idp + 'Soft' }, defs);
    el('stop', { offset: '0', 'stop-color': '#fff' }, rg);
    el('stop', { offset: '0.72', 'stop-color': '#fff' }, rg);
    el('stop', { offset: '1', 'stop-color': '#000' }, rg);

    const view = g(root, { 'clip-path': `url(#${idp}Clip)` });
    el('rect', { x: VP.x, y: VP.y, width: VP.w, height: VP.h, fill: '#0f1c27' }, view);
    const levels = LV.map((lv, i) => {
      const mask = el('mask', { id: idp + 'Mk' + i, maskUnits: 'userSpaceOnUse', x: -6000, y: -6000, width: 12000, height: 12000 }, defs);
      const mc = el('circle', { cx: 0, cy: 0, r: 900, fill: `url(#${idp}Soft)` }, mask);
      const wrap = g(view, { mask: `url(#${idp}Mk${i})`, transform: `translate(${CX},${CY})` });
      wrap.style.opacity = i ? 0 : 1;
      const o = { wrap, mc };
      DRAW[i](g(wrap), o);
      return o;
    });
    el('rect', { x: VP.x, y: VP.y, width: VP.w, height: VP.h, rx: 18, fill: 'none', stroke: '#2b4252', 'stroke-width': 2 }, root);

    // HUD：每層的名稱與工具
    const huds = LV.map((lv) => {
      const h = g(root, { opacity: 0 });
      const t = S.pill(h, 0, 0, lv.tag, { size: 24, color: C.ink, edge: '#3d5666' });
      t.setAttribute('transform', `translate(${VP.x + 18 + t.w / 2},${VP.y + 34})`);
      // 工具標籤靠右上；第二行（補充說明）字小一點，接在下面
      let ty = VP.y + 34;
      (lv.hud || ['工具：' + lv.tool]).forEach((s, k) => {
        const tool = S.pill(h, 0, 0, s, { size: k ? 20 : 22, color: C.hi, edge: '#6b5a2a' });
        if (k) ty += 36;
        tool.setAttribute('transform', `translate(${VP.x + VP.w - 18 - tool.w / 2},${ty})`);
      });
      text(h, 1028, 656, lv.name, { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      return h;
    });

    // 大小尺
    const lad = g(root);
    text(lad, 1028, 50, '大小尺', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
    el('line', { x1: 960, y1: ladderY(10 ** 0.35), x2: 960, y2: ladderY(1e-9), stroke: '#4a6272', 'stroke-width': 3 }, lad);
    const units = ['1 m', '10 cm', '1 cm', '1 mm', '100 μm', '10 μm', '1 μm', '100 nm', '10 nm', '1 nm'];
    const ticks = units.map((u, i) => {
      const y = ladderY(10 ** -i), major = i % 3 === 0;
      el('line', { x1: 960, y1: y, x2: major ? 976 : 970, y2: y, stroke: major ? C.ink : '#4a6272', 'stroke-width': major ? 3 : 2 }, lad);
      return text(lad, 982, y + 7, u, { 'font-size': major ? 21 : 18, fill: major ? C.ink : C.mute, class: 'mono', 'font-weight': major ? 700 : 500 });
    });
    [['肉眼', 1.6, 1e-4, C.chloro], ['光學顯微鏡', 1e-4, 2e-7, C.vacuole], ['電子顯微鏡', 2e-7, 1e-9, C.nucleus]].forEach(([n, a, b, col]) => {
      const y1 = ladderY(a) + 2, y2 = ladderY(b) - 2;
      el('rect', { x: 934, y: y1, width: 12, height: y2 - y1, rx: 6, fill: col, opacity: 0.85 }, lad);
      text(lad, 912, (y1 + y2) / 2, n, { 'font-size': 19, fill: col, 'writing-mode': 'vertical-rl', 'text-anchor': 'middle', 'letter-spacing': 2 });
    });
    const marker = g(lad);
    el('path', { d: 'M 940,-11 L 958,0 L 940,11 Z', fill: C.hi }, marker);
    el('circle', { cx: 960, cy: 0, r: 8, fill: C.hi, stroke: C.bg, 'stroke-width': 3 }, marker);
    el('line', { x1: 968, y1: 0, x2: 1170, y2: 0, stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '4 5', opacity: 0.8 }, marker);
    el('rect', { x: 896, y: 628, width: 264, height: 84, rx: 14, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, root);
    huds.forEach((h) => root.appendChild(h));
    const readout = text(root, 1028, 698, '', { 'font-size': 34, fill: C.hi, 'text-anchor': 'middle', class: 'mono', 'font-weight': 700 });
    let curSize = LV[0].size;
    const setSize = (m) => { curSize = m; readout.textContent = '≈ ' + fmt(m); marker.setAttribute('transform', `translate(0,${ladderY(m).toFixed(1)})`); };
    setSize(LV[0].size);

    // 放大轉場：A 放大淡出，B 從聚焦點長出來
    const zoom = (i) => (w) => {
      const A = levels[i], B = levels[i + 1], { f, r } = LV[i];
      const z = Math.pow(r, w), v = S.smoothstep(0, 0.75, w), k = 1 - (1 - v) / z;
      const qx = f[0] * k, qy = f[1] * k;
      A.wrap.setAttribute('transform', `translate(${CX - z * qx},${CY - z * qy}) scale(${z})`);
      B.wrap.setAttribute('transform', `translate(${CX + z * (f[0] - qx)},${CY + z * (f[1] - qy)}) scale(${z / r})`);
      A.wrap.style.opacity = 1 - S.smoothstep(0.6, 0.93, w);
      B.wrap.style.opacity = S.smoothstep(0.22, 0.7, w);
      B.mc.setAttribute('r', S.lerp(330, 900, S.smoothstep(0.55, 1, w)));
      A.mc.setAttribute('r', 900);
      setSize(Math.pow(LV[i].size, 1 - w) * Math.pow(LV[i + 1].size, w));
    };
    const extras = (o) => [o.dim, ...(o.labels || [])].filter(Boolean);
    levels.forEach((o) => extras(o).forEach((e) => e.setAttribute('opacity', 0)));

    // 連續位置 P（0＝人 … 5＝DNA），互動模型用
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const render = (P) => {
      P = S.clamp(P, 0, 5);
      const i = Math.min(4, Math.floor(P)), u = P - i;
      levels.forEach((o, k) => { if (k !== i && k !== i + 1) o.wrap.style.opacity = 0; });
      zoom(i)(ease(u));
      const near = Math.round(P), d = Math.abs(P - near);
      const a = 1 - S.smoothstep(0.04, 0.14, d);
      huds.forEach((h, k) => h.setAttribute('opacity', k === near ? a : 0));
      levels.forEach((o, k) => extras(o).forEach((e) => e.setAttribute('opacity', k === near ? a : 0)));
      return { level: near, settled: d < 0.04, size: curSize };
    };
    const toolFor = (m) => (m >= 1e-4 ? '肉眼' : m >= 2e-7 ? '光學顯微鏡' : '電子顯微鏡');

    return { root, levels, huds, LV, zoom, extras, setSize, render, ladderY, ticks, marker, fmt, toolFor, VP, CX, CY, get size() { return curSize; } };
  };
})();
