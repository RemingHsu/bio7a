/* 七下第五章（生物與環境）共用圖形：植物、動物、地形與小工具。
   每個函式 S.B5.xxx(parent, {x, y, s, r, flip, ...}) 回傳已定位的群組（外層 transform，內層可左右翻轉）。
   原點：陸上生物在「腳底／地面的中央」，水中生物在「身體中央」。預設面向右，flip:true 面向左。
   動畫時不要用 GSAP 改這些群組的 transform（見製作規範），請用 S.place／S.move 或只改透明度。 */
(() => {
  const { el, g } = S;
  const B = (S.B5 = {});
  let uid = 0;
  B.id = (k) => `b5${k}${uid++}`;
  const f1 = (v) => (+v).toFixed(1);
  const P = (pts) => pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join(' L ');

  // ---------- 小工具 ----------
  B.base = (p, { x = 0, y = 0, s = 1, r = 0, flip = false, opacity } = {}) => {
    const o = S.place(g(p, opacity != null ? { opacity } : {}), { x, y, s, r });
    o.inner = flip ? g(o, { transform: 'scale(-1,1)' }) : o;
    return o;
  };
  // 輪廓聯集：先畫加粗的描邊，再畫填色，重疊處不會出現接縫線。shape = [tag, attrs, 線寬（只有線條才給）]
  B.union = (p, shapes, fill, edge, sw = 2) => {
    const u = g(p);
    const lw = (w) => ({ fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': w });
    shapes.forEach(([tag, a, w]) => el(tag, w ? { ...a, ...lw(w + sw * 2), stroke: edge } : { ...a, fill: edge, stroke: edge, 'stroke-width': sw * 2, 'stroke-linejoin': 'round' }, u));
    shapes.forEach(([tag, a, w]) => el(tag, w ? { ...a, ...lw(w), stroke: fill } : { ...a, fill }, u));
    return u;
  };
  // 三次貝茲曲線取樣：segs = [[P0,P1,P2,P3], …]
  B.bez = (segs, n = 16) => {
    const out = [];
    segs.forEach(([a, b, c, d], k) => {
      for (let i = k ? 1 : 0; i <= n; i++) {
        const t = i / n, u = 1 - t;
        out.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
      }
    });
    return out;
  };
  // 沿中心線的漸細帶狀；wf(t) 是 t（0→1）處的寬度
  B.ribbon = (pts, wf) => {
    const L = [], R = [];
    pts.forEach((q, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
      const w = wf(i / (pts.length - 1)) / 2;
      L.push([q[0] + nx * w, q[1] + ny * w]); R.push([q[0] - nx * w, q[1] - ny * w]);
    });
    return `M ${P(L)} L ${P(R.reverse())} Z`;
  };
  const eye = (p, x, y, r, iris = '#1b140e') => {
    el('circle', { cx: x, cy: y, r, fill: iris }, p);
    el('circle', { cx: x + r * 0.3, cy: y - r * 0.35, r: Math.max(0.8, r * 0.32), fill: '#fff' }, p);
  };
  // 單一輪廓的動物：先填底色，再畫裁切在輪廓內的明暗（in），最後描外框（line()）
  const sil = (p, d, fill, edge, sw = 2) => {
    const id = B.id('sil');
    el('path', { d }, el('clipPath', { id }, el('defs', {}, p)));
    el('path', { d, fill }, p);
    const inn = g(p, { 'clip-path': `url(#${id})` });
    return { in: inn, line: () => el('path', { d, fill: 'none', stroke: edge, 'stroke-width': sw, 'stroke-linejoin': 'round' }, p) };
  };
  const P2 = (p, d, fill, extra = {}) => el('path', { d, fill, ...extra }, p);
  const ST = (p, d, stroke, w = 1.2, extra = {}) => el('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, p);
  // 箭頭（線＋三角形箭頭），回傳群組
  B.arrow = (p, x1, y1, x2, y2, { color = '#c9d6dc', w = 4, head = 16, dash } = {}) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.7, y2: y2 - Math.sin(a) * head * 0.7, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': dash }, ag);
    el('path', { d: `M ${f1(x2)},${f1(y2)} L ${f1(x2 - head * Math.cos(a - 0.42))},${f1(y2 - head * Math.sin(a - 0.42))} L ${f1(x2 - head * Math.cos(a + 0.42))},${f1(y2 - head * Math.sin(a + 0.42))} Z`, fill: color }, ag);
    return ag;
  };
  // 彎曲箭頭（二次曲線），bend > 0 往左彎
  B.curveArrow = (p, x1, y1, x2, y2, bend, { color = '#c9d6dc', w = 4, head = 16, dash } = {}) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const cx = mx - (dy / L) * bend, cy = my + (dx / L) * bend;
    const a = Math.atan2(y2 - cy, x2 - cx), ag = g(p);
    const ex = x2 - Math.cos(a) * head * 0.7, ey = y2 - Math.sin(a) * head * 0.7;
    el('path', { d: `M ${f1(x1)},${f1(y1)} Q ${f1(cx)},${f1(cy)} ${f1(ex)},${f1(ey)}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': dash }, ag);
    el('path', { d: `M ${f1(x2)},${f1(y2)} L ${f1(x2 - head * Math.cos(a - 0.42))},${f1(y2 - head * Math.sin(a - 0.42))} L ${f1(x2 - head * Math.cos(a + 0.42))},${f1(y2 - head * Math.sin(a + 0.42))} Z`, fill: color }, ag);
    return ag;
  };
  // 放大鏡：在 (cx,cy) 畫半徑 r 的圓框，虛線連到 (tx,ty)；回傳 {g, in}，in 是被圓形裁切的內容群組
  B.lens = (p, cx, cy, r, tx, ty, { color = '#ffd166', bg = '#0f1d28' } = {}) => {
    const lg = g(p), id = B.id('lens');
    if (tx != null) {
      const a = Math.atan2(ty - cy, tx - cx);
      [-1, 1].forEach((k) => el('line', { x1: cx + Math.cos(a + k * 1.2) * r, y1: cy + Math.sin(a + k * 1.2) * r, x2: tx, y2: ty, stroke: color, 'stroke-width': 1.5, 'stroke-dasharray': '6 5', opacity: 0.75 }, lg));
      el('circle', { cx: tx, cy: ty, r: 9, fill: 'none', stroke: color, 'stroke-width': 2.5 }, lg);
    }
    el('circle', { cx, cy, r }, el('clipPath', { id }, el('defs', {}, lg)));
    el('circle', { cx, cy, r, fill: bg }, lg);
    const inner = g(lg, { 'clip-path': `url(#${id})` });
    el('circle', { cx, cy, r, fill: 'none', stroke: color, 'stroke-width': 4 }, lg);
    return { g: lg, in: inner };
  };

  // ---------- 天空與環境 ----------
  B.sun = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, r = o.rad || 40;
    el('circle', { cx: 0, cy: 0, r: r + 12, fill: '#ffd166', opacity: 0.16 }, i);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * 6.283;
      el('line', { x1: Math.cos(a) * (r + 8), y1: Math.sin(a) * (r + 8), x2: Math.cos(a) * (r + 22), y2: Math.sin(a) * (r + 22), stroke: '#ffd166', 'stroke-width': 4, 'stroke-linecap': 'round' }, i);
    }
    el('circle', { cx: 0, cy: 0, r, fill: '#ffd166' }, i);
    el('circle', { cx: -r * 0.22, cy: -r * 0.22, r: r * 0.55, fill: '#ffe7a0', opacity: 0.55 }, i);
    return s;
  };
  B.cloud = (p, o = {}) => {
    const s = B.base(p, o), w = o.w || 120;
    B.union(s.inner, [[-0.32, 0, 0.26], [-0.05, -0.12, 0.32], [0.26, -0.02, 0.24], [0.06, 0.08, 0.28]].map(([dx, dy, r]) => ['circle', { cx: dx * w, cy: dy * w, r: r * w }]), o.fill || '#c9d6dc', o.edge || '#8aa1ae', 1.5);
    return s;
  };
  B.rain = (p, o = {}) => {
    const s = B.base(p, o), n = o.n || 6, w = o.w || 100;
    for (let k = 0; k < n; k++) el('line', { x1: -w / 2 + (k / (n - 1)) * w, y1: (k % 2) * 14, x2: -w / 2 + (k / (n - 1)) * w - 8, y2: (k % 2) * 14 + 26, stroke: '#5fb8ff', 'stroke-width': 3, 'stroke-linecap': 'round' }, s.inner);
    return s;
  };
  B.thermo = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, lv = o.level == null ? 0.6 : o.level;
    el('rect', { x: -9, y: -80, width: 18, height: 80, rx: 9, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2.5 }, i);
    el('circle', { cx: 0, cy: 6, r: 15, fill: '#ff5f74', stroke: '#cfe8ff', 'stroke-width': 2.5 }, i);
    el('rect', { x: -4.5, y: -70 * lv, width: 9, height: 70 * lv + 6, fill: '#ff5f74' }, i);
    for (let k = 1; k < 6; k++) el('line', { x1: 9, y1: -k * 13, x2: 15, y2: -k * 13, stroke: '#cfe8ff', 'stroke-width': 2 }, i);
    return s;
  };
  B.wind = (p, o = {}) => {
    const s = B.base(p, o);
    [0, 1, 2].forEach((k) => el('path', { d: `M ${-50 + k * 8},${k * 18} q 34,-10 68,0 q 18,5 12,-12`, fill: 'none', stroke: o.color || '#cfe8ff', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, s.inner));
    return s;
  };
  B.earth = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, r = o.rad || 80, id = B.id('earth');
    el('circle', { cx: 0, cy: 0, r: r + 8, fill: '#5fb8ff', opacity: 0.18 }, i);
    el('circle', { cx: 0, cy: 0, r }, el('clipPath', { id }, el('defs', {}, i)));
    const c = g(i, { 'clip-path': `url(#${id})` });
    el('circle', { cx: 0, cy: 0, r, fill: '#2d6fae' }, c);
    const land = (pts, fill) => el('path', { d: S.smoothPath(pts.map(([x, y]) => [x * r, y * r])), fill }, c);
    land([[-0.55, -0.7], [-0.15, -0.8], [0.05, -0.55], [-0.1, -0.3], [-0.35, -0.2], [-0.5, 0.05], [-0.7, -0.15], [-0.8, -0.45]], '#5a9a4a');
    land([[-0.35, 0.2], [-0.1, 0.25], [-0.05, 0.55], [-0.25, 0.9], [-0.45, 0.6]], '#7aa84a');
    land([[0.25, -0.6], [0.7, -0.55], [0.9, -0.2], [0.75, 0.05], [0.45, 0.0], [0.3, -0.25]], '#9a9a52');
    land([[0.4, 0.25], [0.65, 0.3], [0.7, 0.55], [0.5, 0.65], [0.35, 0.45]], '#5a9a4a');
    el('ellipse', { cx: 0, cy: -r * 0.92, rx: r * 0.5, ry: r * 0.12, fill: '#e8f0f2', opacity: 0.9 }, c);
    el('circle', { cx: -r * 0.3, cy: -r * 0.3, r: r * 0.7, fill: '#ffffff', opacity: 0.08 }, c);
    el('circle', { cx: 0, cy: 0, r, fill: 'none', stroke: '#9fd2ff', 'stroke-width': 3 }, i);
    return s;
  };
  B.factory = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    el('rect', { x: 30, y: -150, width: 22, height: 110, fill: '#6f7f8a', stroke: '#3e4a52', 'stroke-width': 2 }, i);
    el('path', { d: 'M -60,0 L -60,-60 L -30,-80 L -30,-60 L 0,-80 L 0,-60 L 30,-80 L 70,-80 L 70,0 Z', fill: '#8a99a3', stroke: '#3e4a52', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, i);
    [[-48, -40], [-18, -40], [12, -40], [42, -40]].forEach(([x, y]) => el('rect', { x, y, width: 18, height: 16, fill: '#ffd166', opacity: 0.8 }, i));
    B.union(i, [[52, -166, 14], [64, -184, 18], [82, -200, 22], [104, -214, 24]].map(([x, y, r]) => ['circle', { cx: x, cy: y, r }]), '#7c868c', '#5a6268', 1);
    return s;
  };

  // ---------- 植物 ----------
  B.grass = (p, o = {}) => {
    const s = B.base(p, o), n = o.n || 7, h = o.h || 60, w = o.w || 50, rnd = S.rng(o.seed || 1);
    const cols = o.colors || ['#4f9d3e', '#6fbe52', '#5aae46'];
    for (let k = 0; k < n; k++) {
      const bx = (k / Math.max(1, n - 1) - 0.5) * w, lean = (bx / w) * h * 0.9 + (rnd() - 0.5) * 12, hh = h * (0.6 + rnd() * 0.45), bw = 2.6 + rnd() * 1.8;
      el('path', { d: `M ${f1(bx - bw)},0 Q ${f1(bx - bw * 0.4 + lean * 0.15)},${f1(-hh * 0.55)} ${f1(bx + lean)},${f1(-hh)} Q ${f1(bx + bw * 0.6 + lean * 0.2)},${f1(-hh * 0.5)} ${f1(bx + bw)},0 Z`, fill: cols[k % cols.length] }, s.inner);
    }
    return s;
  };
  B.tree = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 220, w = o.w || 180, sd = o.seed || 1;
    const cy = -h * 0.64, ry = h * 0.34;
    const t = (k) => f1(-h * k);
    const bs = Math.min(1, w / 180), tw = Math.max(0.45, Math.min(1, h / 220));
    el('path', { d: `M ${f1(-15 * tw)},0 C ${f1(-10 * tw)},${t(0.12)} ${f1(-9 * tw)},${t(0.26)} ${f1(-8 * tw)},${t(0.4)} L ${f1(-34 * bs)},${t(0.56)} L ${f1(-27 * bs)},${t(0.6)} L ${f1(-4 * tw)},${t(0.47)} L ${f1(-3 * tw)},${t(0.66)} L ${f1(4 * tw)},${t(0.66)} L ${f1(5 * tw)},${t(0.47)} L ${f1(28 * bs)},${t(0.58)} L ${f1(33 * bs)},${t(0.54)} L ${f1(9 * tw)},${t(0.39)} C ${f1(10 * tw)},${t(0.26)} ${f1(11 * tw)},${t(0.12)} ${f1(16 * tw)},0 Z`, fill: o.trunk || '#6b4a2e', stroke: '#47301c', 'stroke-width': 2 }, i);
    el('path', { d: S.smoothPath(S.blobPts(0, cy, w / 2, ry, 64, [[8, 0.07, sd], [13, 0.04, sd * 2.3]])), fill: o.color || '#3d8a3e', stroke: o.edge || '#2a5f2c', 'stroke-width': 2.5 }, i);
    [[-0.2, -0.22, 0.44], [0.2, -0.3, 0.34], [-0.02, 0.06, 0.3]].forEach(([dx, dy, k]) =>
      el('path', { d: S.smoothPath(S.blobPts(dx * w, cy + dy * ry * 2, w * k * 0.5, ry * k * 1.1, 40, [[7, 0.09, sd + dx * 9]])), fill: o.light || '#55a84c', opacity: 0.7 }, i));
    return s;
  };
  B.conifer = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 200, w = o.w || 90, n = 6;
    el('rect', { x: -5, y: -h * 0.22, width: 10, height: h * 0.22, fill: '#5a3d26' }, i);
    for (let k = n - 1; k >= 0; k--) {
      const t = k / (n - 1), top = -h + t * h * 0.6, bot = top + h * 0.27, hw = (w / 2) * (0.22 + 0.78 * t), mid = top + (bot - top) * 0.5;
      el('path', { d: `M 0,${f1(top)} C ${f1(hw * 0.3)},${f1(mid)} ${f1(hw * 0.7)},${f1(bot - 6)} ${f1(hw)},${f1(bot)} Q ${f1(hw * 0.5)},${f1(bot - 5)} 0,${f1(bot - 2)} Q ${f1(-hw * 0.5)},${f1(bot - 5)} ${f1(-hw)},${f1(bot)} C ${f1(-hw * 0.7)},${f1(bot - 6)} ${f1(-hw * 0.3)},${f1(mid)} 0,${f1(top)} Z`, fill: o.color || '#2f6b48', stroke: o.edge || '#1d4430', 'stroke-width': 2 }, i);
      el('path', { d: `M 0,${f1(top + 4)} C ${f1(-hw * 0.25)},${f1(mid)} ${f1(-hw * 0.6)},${f1(bot - 7)} ${f1(-hw * 0.85)},${f1(bot - 3)} Q ${f1(-hw * 0.4)},${f1(bot - 7)} 0,${f1(bot - 5)} Z`, fill: o.light || '#3f8458', opacity: 0.8 }, i);
    }
    return s;
  };
  B.shrub = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, w = o.w || 120, h = o.h || 70, sd = o.seed || 3;
    el('path', { d: S.smoothPath(S.blobPts(0, -h * 0.5, w / 2, h * 0.52, 48, [[6, 0.08, sd], [11, 0.05, sd * 1.7]])), fill: o.color || '#4a8a3c', stroke: o.edge || '#2c5a28', 'stroke-width': 2 }, i);
    el('path', { d: S.smoothPath(S.blobPts(-w * 0.12, -h * 0.66, w * 0.28, h * 0.26, 32, [[6, 0.1, sd]])), fill: o.light || '#62a64f', opacity: 0.75 }, i);
    return s;
  };
  // 有花的草本植物（例如鬼針草）：莖、斜向上的葉、頂端的花
  B.herb = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 70, fc = o.flower || '#f4f1e6';
    el('path', { d: `M 0,0 C -2,${-h * 0.4} 2,${-h * 0.7} 0,${-h}`, fill: 'none', stroke: '#4f8a3a', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, i);
    [[0.3, 1], [0.5, -1], [0.7, 1]].forEach(([k, sg]) => {
      const lw = h * 0.36;
      const lf = S.place(g(i), { x: 0, y: -h * k, r: sg > 0 ? -35 : -145 });
      el('path', { d: `M 0,0 C ${lw * 0.3},${-lw * 0.22} ${lw * 0.7},${-lw * 0.2} ${lw},0 C ${lw * 0.7},${lw * 0.2} ${lw * 0.3},${lw * 0.22} 0,0 Z`, fill: '#5faa48', stroke: '#356a2c', 'stroke-width': 1.2 }, lf);
    });
    if (fc !== 'none') {
      for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283; el('ellipse', { cx: Math.cos(a) * 7, cy: -h + Math.sin(a) * 7, rx: 5.5, ry: 3.4, fill: fc, transform: `rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 7} ${-h + Math.sin(a) * 7})` }, i); }
      el('circle', { cx: 0, cy: -h, r: 4.5, fill: '#e8b83a' }, i);
    }
    return s;
  };
  // 幼苗：V 字形的兩片子葉
  B.sprout = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 26;
    el('path', { d: `M 0,0 C -1,${-h * 0.5} 1,${-h * 0.8} 0,${-h}`, fill: 'none', stroke: '#6fae4a', 'stroke-width': 3, 'stroke-linecap': 'round' }, i);
    [-1, 1].forEach((sg) => { const lf = S.place(g(i), { x: 0, y: -h, r: sg > 0 ? -38 : -142 }); el('path', { d: 'M 0,0 C 4,-5 12,-5 15,0 C 12,5 4,5 0,0 Z', fill: '#7cc35a' }, lf); });
    return s;
  };
  // 倒在地上的枯木（給分解者用）
  B.log = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, w = o.w || 220;
    el('path', { d: `M ${-w / 2},-4 L ${-w / 2},-44 L ${w / 2},-38 L ${w / 2},-2 Z`, fill: '#6b4a2e', stroke: '#3e2a18', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, i);
    for (let k = 0; k < 5; k++) el('path', { d: `M ${-w / 2 + 20 + k * w * 0.18},-40 q 10,18 -2,36`, fill: 'none', stroke: '#4e3420', 'stroke-width': 2 }, i);
    el('ellipse', { cx: w / 2, cy: -20, rx: 10, ry: 19, fill: '#b08a5a', stroke: '#3e2a18', 'stroke-width': 2.5 }, i);
    [12, 7, 3].forEach((r) => el('ellipse', { cx: w / 2, cy: -20, rx: r * 0.5, ry: r, fill: 'none', stroke: '#7a5a36', 'stroke-width': 1.5 }, i));
    // 樹幹上的層狀真菌
    [[-w * 0.18, -40, 26], [-w * 0.05, -42, 20], [w * 0.22, -37, 22]].forEach(([x, y, r]) => {
      el('path', { d: `M ${x - r},${y} C ${x - r * 0.8},${y - r * 0.55} ${x + r * 0.8},${y - r * 0.55} ${x + r},${y} C ${x + r * 0.5},${y + 4} ${x - r * 0.5},${y + 4} ${x - r},${y} Z`, fill: '#d9a35a', stroke: '#7a5226', 'stroke-width': 2 }, i);
      el('path', { d: `M ${x - r * 0.7},${y - r * 0.2} C ${x - r * 0.3},${y - r * 0.4} ${x + r * 0.3},${y - r * 0.4} ${x + r * 0.7},${y - r * 0.2}`, fill: 'none', stroke: '#f2d39a', 'stroke-width': 2 }, i);
    });
    return s;
  };
  // 蕈類：寬傘、短柄，傘下有蕈褶
  B.mushrooms = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    [[-26, 0, 0.8, -8], [10, 0, 1, 6], [40, 0, 0.62, 12]].forEach(([x, y, k, r]) => {
      const m = S.place(g(i), { x, y, s: k, r });
      el('path', { d: 'M -7,0 C -6,-8 -6,-14 -5,-20 L 5,-20 C 6,-14 6,-8 7,0 Z', fill: '#efe3c8', stroke: '#8a7350', 'stroke-width': 2 }, m);
      el('path', { d: 'M -32,-18 C -30,-40 30,-40 32,-18 C 20,-22 -20,-22 -32,-18 Z', fill: '#b5743c', stroke: '#6a4020', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, m);
      for (let k2 = -3; k2 <= 3; k2++) el('line', { x1: k2 * 7, y1: -20.5, x2: k2 * 4, y2: -19, stroke: '#7a5a36', 'stroke-width': 1.2 }, m);
      el('path', { d: 'M -20,-28 C -14,-34 -2,-35 6,-33', fill: 'none', stroke: '#d9a066', 'stroke-width': 3, 'stroke-linecap': 'round' }, m);
    });
    return s;
  };
  // 細菌（放大）：桿菌與球菌
  B.bacteria = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, rnd = S.rng(o.seed || 4);
    for (let k = 0; k < (o.n || 9); k++) {
      const x = (rnd() - 0.5) * 90, y = (rnd() - 0.5) * 70, a = rnd() * 180;
      if (k % 3) el('rect', { x: x - 13, y: y - 5, width: 26, height: 10, rx: 5, fill: o.color || '#9ad0a0', stroke: '#4a8a5a', 'stroke-width': 1.5, transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` }, i);
      else el('circle', { cx: x, cy: y, r: 6, fill: '#c9b0e8', stroke: '#7a5aa8', 'stroke-width': 1.5 }, i);
    }
    return s;
  };

  // ---------- 動物 ----------
  // 野兔（坐姿，面向右）：長耳直立、大眼、圓背、強壯的後腳、短尾、鬍鬚；褐色雜斑毛、腹部淺色
  B.rabbit = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#4a3422';
    const D = 'M 68,-62 C 64,-72 54,-82 44,-86 C 46,-102 38,-128 28,-140 C 24,-145 18,-144 17,-138 C 19,-124 23,-112 27,-102 C 22,-114 15,-126 9,-133 C 5,-138 -1,-136 0,-130 C 3,-112 8,-94 14,-82 C 10,-74 4,-68 -6,-68 C -26,-70 -48,-72 -62,-58 C -70,-52 -74,-44 -74,-36 C -80,-38 -86,-32 -84,-26 C -86,-20 -80,-16 -76,-18 C -76,-10 -70,-5 -60,-3 C -52,0 -40,1 -20,1 L 12,1 C 18,1 20,-4 14,-7 C 20,-14 28,-16 32,-12 C 33,-8 34,-4 34,1 C 42,1 52,1 54,-2 C 56,-5 50,-7 46,-8 C 44,-20 46,-32 48,-40 C 50,-46 52,-49 56,-51 C 60,-52 64,-54 66,-56 C 68,-58 69,-60 68,-62 Z';
    const b = sil(i, D, o.fur || '#a47c52', edge, 2);
    const c = b.in;
    P2(c, 'M 16,-84 C 6,-70 -30,-76 -62,-58 C -74,-48 -78,-36 -76,-26 L -66,-30 C -64,-44 -50,-58 -20,-62 C 0,-64 10,-70 16,-76 Z', '#86603a', { opacity: 0.85 });
    P2(c, 'M -60,-6 C -72,-24 -62,-50 -36,-50 C -16,-50 -6,-34 -8,-18 C -10,-10 -20,-6 -30,-6 Z', '#946c44');
    P2(c, 'M 50,-44 C 42,-34 36,-22 34,-12 C 28,-16 20,-14 14,-8 C 12,-14 18,-24 30,-34 C 38,-40 44,-44 50,-44 Z', '#eadcc4');
    P2(c, 'M 58,-50 C 52,-50 46,-46 44,-42 C 50,-44 56,-48 62,-54 Z', '#eadcc4');
    el('ellipse', { cx: 60, cy: -58, rx: 9, ry: 6, fill: '#c9a47a', opacity: 0.8 }, c);
    P2(c, 'M -74,-36 C -82,-38 -88,-30 -84,-24 C -86,-18 -78,-16 -74,-20 Z', '#f4efe6');
    ST(c, 'M -73,-36 C -79,-39 -85,-35 -86,-30', '#3a2a1a', 3);
    el('ellipse', { cx: 21, cy: -141, rx: 6, ry: 5, fill: '#2e2016' }, c);
    el('ellipse', { cx: 3, cy: -134, rx: 5, ry: 4.5, fill: '#2e2016' }, c);
    P2(c, 'M 40,-90 C 40,-106 34,-124 26,-134 C 24,-124 26,-106 32,-92 Z', '#c99286', { opacity: 0.85 });
    // 雜斑（褐色毛尖）與毛流
    const rs = S.rng(17);
    for (let k = 0; k < 26; k++) { const x = -60 + rs() * 70, y = -66 + rs() * 22 + (x < -40 ? (x + 40) * -0.6 : 0); el('line', { x1: x, y1: y, x2: x - 3, y2: y + 1.5, stroke: '#4a3422', 'stroke-width': 1.1, opacity: 0.55 }, c); }
    ST(c, 'M -66,-14 C -66,-40 -40,-54 -20,-46 C -8,-40 -6,-26 -10,-16', '#5e4430', 1.6);
    ST(c, 'M 30,-46 C 26,-40 24,-34 24,-28 M 20,-60 C 16,-56 14,-52 14,-46', '#6a4c32', 1.2);
    ST(c, 'M 4,-2 L 6,1 M 8,-3 L 10,1 M 46,-3 L 47,1 M 50,-3 L 51,1', '#5e4430', 1);
    ST(c, 'M 27,-102 C 24,-96 20,-90 16,-86', edge, 1.4);
    b.line();
    el('ellipse', { cx: 46, cy: -70, rx: 8, ry: 7, fill: '#e2cba8' }, i);
    el('circle', { cx: 46, cy: -70, r: 5.6, fill: '#6a3a14' }, i);
    el('circle', { cx: 46, cy: -70, r: 3.6, fill: '#160c06' }, i);
    el('circle', { cx: 48, cy: -72.2, r: 1.7, fill: '#fff' }, i);
    el('circle', { cx: 44.4, cy: -68, r: 0.8, fill: '#fff', opacity: 0.8 }, i);
    P2(i, 'M 65,-61 C 67,-62.5 69.5,-61 68.5,-59 C 67.5,-57.8 66,-58 65,-61 Z', '#7a4636');
    ST(i, 'M 67,-58 C 66,-55 64,-54 61,-54', edge, 1.3);
    [[90, -63], [92, -56], [88, -49], [80, -66]].forEach(([x, y]) => ST(i, `M 63,-57 Q ${(63 + x) / 2},${(y - 57) / 2 - 1} ${x},${y}`, '#efe6d6', 1, { opacity: 0.9 }));
    return s;
  };
  // 蚱蜢（側面，面向右）：身體一個輪廓（頭、前胸背板、腹部、收合的翅），後腳的腿節粗大
  B.grasshopper = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#3e5f22', body = o.color || '#86b84a';
    // 遠側的腳
    ST(i, 'M 18,-15 L 22,-7 L 28,0 M 6,-15 L 2,-7 L -4,0 M -2,-20 L -30,-40 L -16,-1', '#5f8a34', 2.2);
    const D = 'M 44,-40 C 50,-34 50,-24 46,-17 C 44,-14 40,-14 38,-16 C 32,-16 24,-14 16,-14 C 4,-14 -10,-16 -24,-17 C -40,-18 -56,-20 -64,-23 C -68,-24 -68,-27 -64,-28 C -72,-28 -80,-28 -84,-31 C -86,-33 -84,-35 -80,-35 C -60,-38 -30,-40 -4,-40 C 6,-41 14,-43 22,-43 C 26,-43 28,-44 30,-45 C 34,-47 40,-46 44,-40 Z';
    const b = sil(i, D, body, edge, 1.8);
    const c = b.in;
    P2(c, 'M -70,-20 C -40,-16 0,-12 50,-16 L 50,-8 L -70,-8 Z', '#5f8f34', { opacity: 0.8 });
    // 翅（覆在背上）
    P2(c, 'M -86,-33 C -60,-38 -30,-40 -2,-40 C 0,-36 -2,-33 -6,-31 C -30,-30 -60,-29 -86,-29 Z', '#a3c86a');
    ST(c, 'M -80,-32 C -56,-34 -30,-35 -6,-35 M -70,-30 C -50,-31 -30,-32 -10,-32', '#6e9a3e', 1);
    for (let k = 0; k < 8; k++) ST(c, `M ${-74 + k * 9},-35 l 2,4`, '#6e9a3e', 0.8);
    // 腹部的環節、前胸背板的邊緣
    for (let k = 0; k < 6; k++) ST(c, `M ${-58 + k * 9},-28 q 2,6 0,11`, '#4e7a2a', 1, { opacity: 0.7 });
    ST(c, 'M -2,-40 C 0,-32 2,-24 4,-16 M 30,-45 C 30,-36 28,-26 26,-16', '#4e7a2a', 1.3);
    ST(c, 'M 4,-36 C 12,-37 20,-38 28,-40', '#c8e08a', 1.2, { opacity: 0.8 });
    b.line();
    // 複眼、觸角、口器
    el('ellipse', { cx: 40, cy: -33, rx: 4.2, ry: 6, fill: '#5a4426', transform: 'rotate(15 40 -33)' }, i);
    el('circle', { cx: 41, cy: -35.5, r: 1.4, fill: '#fff' }, i);
    ST(i, 'M 43,-41 C 50,-54 58,-62 72,-68 M 40,-42 C 44,-56 50,-66 60,-74', edge, 1.5);
    ST(i, 'M 45,-17 l 2,5 l 3,-3', edge, 1.4);
    // 近側的中、前腳
    ST(i, 'M 24,-15 L 30,-7 L 38,0 M 12,-15 L 10,-7 L 6,0', '#4e7a2a', 2.4);
    // 近側的後腳：腿節粗大（有羽狀紋），脛節細長有刺
    const fem = 'M 6,-24 C -6,-34 -24,-44 -40,-50 C -44,-51 -46,-47 -42,-44 C -26,-36 -10,-24 2,-14 Z';
    P2(i, fem, '#7aae42', { stroke: edge, 'stroke-width': 1.6, 'stroke-linejoin': 'round' });
    for (let k = 1; k < 6; k++) { const x = 4 - k * 7.6, y = -19 - k * 5.2; ST(i, `M ${x + 2},${y - 4} L ${x - 2},${y} L ${x + 2},${y + 4}`, '#4e7a2a', 1); }
    ST(i, 'M -42,-47 L -22,-2 L -34,-1', edge, 2.6);
    for (let k = 1; k < 5; k++) { const x = -42 + k * 4, y = -47 + k * 9; ST(i, `M ${x},${y} l -4,1`, edge, 1.1); }
    return s;
  };
  // 青蛙（坐姿，面向右）：一個輪廓；眼睛凸起、鼓膜、背側褶、斑點、折起的後腳
  B.frog = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#2c5a27';
    P2(i, 'M 22,-2 C 26,-4 32,-4 34,-1 L 22,0 Z', '#4f8f3e');
    const D = 'M 54,-40 C 54,-46 46,-52 38,-55 C 36,-66 22,-68 18,-58 C 10,-56 0,-54 -10,-50 C -20,-50 -28,-46 -34,-40 C -42,-34 -46,-26 -44,-18 C -46,-10 -42,-4 -34,-3 C -24,-2 -8,-1 4,0 C 8,0 10,-1 10,-3 C 6,-4 0,-5 -6,-6 C 0,-10 6,-12 8,-16 C 14,-18 20,-18 24,-16 C 26,-10 28,-4 30,-1 C 34,0 40,0 44,-1 C 44,-3 40,-4 36,-5 C 36,-14 38,-22 42,-28 C 46,-32 50,-34 54,-36 C 55,-37 55,-39 54,-40 Z';
    const b = sil(i, D, o.color || '#62a84c', edge, 1.8);
    const c = b.in;
    P2(c, 'M 40,-54 C 20,-60 -10,-52 -36,-38 L -40,-46 C -10,-62 20,-66 40,-60 Z', '#4a8c3a', { opacity: 0.9 });
    P2(c, 'M 52,-36 C 44,-30 36,-24 26,-18 C 16,-16 4,-14 -6,-8 L 40,-4 L 60,-30 Z', '#d6e6a8');
    [[-22, -40, 5], [-4, -46, 4], [-32, -28, 4], [8, -38, 3], [-14, -30, 3.5], [-28, -14, 3], [-14, -12, 3]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: r * 1.3, ry: r, fill: '#3a7430' }, c));
    ST(c, 'M -40,-20 C -30,-26 -10,-22 6,-15', edge, 1.6);
    ST(c, 'M -36,-6 C -20,-10 -6,-10 4,-14', edge, 1.4);
    ST(c, 'M 20,-56 C 0,-54 -22,-46 -38,-32', '#9ad27a', 2, { opacity: 0.8 });
    ST(c, 'M 4,-1 l -2,-3 M 8,-1 l -1,-3 M 42,-1 l -1,-3 M 38,-1 l -1,-3', edge, 1);
    b.line();
    el('circle', { cx: 12, cy: -47, r: 6, fill: '#4f8f3e', stroke: edge, 'stroke-width': 1.4 }, i);
    el('circle', { cx: 12, cy: -47, r: 3, fill: '#5fa04c' }, i);
    el('circle', { cx: 28, cy: -59, r: 7.4, fill: '#e8c440', stroke: edge, 'stroke-width': 1.2 }, i);
    el('ellipse', { cx: 28, cy: -59, rx: 4.8, ry: 2.5, fill: '#111' }, i);
    el('circle', { cx: 30.5, cy: -61.5, r: 1.6, fill: '#fff' }, i);
    ST(i, 'M 54,-38 C 44,-36 30,-40 20,-44', edge, 1.8);
    el('circle', { cx: 48, cy: -47, r: 1.2, fill: edge }, i);
    return s;
  };
  // 蛇：一個漸細的輪廓（含圓鈍的頭），背上有斑紋、腹側較淺
  B.snake = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, col = o.color || '#9a8a4a', edge = '#3e3020';
    const pts = B.bez([[[-92, -6], [-76, -6], [-72, -26], [-52, -26]], [[-52, -26], [-30, -26], [-30, -4], [-8, -4]], [[-8, -4], [14, -4], [18, -26], [38, -28]], [[38, -28], [50, -29], [58, -26], [66, -24]], [[66, -24], [72, -23], [80, -23], [90, -24]]], 16);
    const wAt = (x) => {
      let w = 1.5 + 13.5 * S.clamp((x + 92) / 80);
      if (x > 48) w = S.lerp(w, 11, S.smoothstep(48, 60, x));
      if (x > 60) w = 11 + 5 * S.smoothstep(60, 70, x);
      if (x > 78) w *= Math.sqrt(Math.max(0, 1 - ((x - 78) / 12) ** 2));
      return w;
    };
    const wf = (t) => wAt(pts[Math.round(t * (pts.length - 1))][0]);
    const D = B.ribbon(pts, wf);
    const b = sil(i, D, col, edge, 1.8);
    const c = b.in;
    // 腹側較淺、背側的亮線
    const side = (k) => pts.map((q, n) => { const a = pts[Math.max(0, n - 1)], z = pts[Math.min(pts.length - 1, n + 1)]; let nx = -(z[1] - a[1]), ny = z[0] - a[0]; const L = Math.hypot(nx, ny) || 1; const w = wAt(q[0]) * k; return [q[0] + (nx / L) * w, q[1] + (ny / L) * w]; });
    ST(c, 'M ' + side(0.42).map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L '), '#d8cc98', 3.5, { opacity: 0.8 });
    ST(c, 'M ' + side(-0.25).map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L '), '#b8a86a', 2, { opacity: 0.7 });
    for (let k = 8; k < pts.length - 22; k += 6) {
      const [x, y] = pts[k], [x2, y2] = pts[k + 1], a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI, w = wAt(x);
      el('path', { d: `M ${-w * 0.25},${-w * 0.42} C ${w * 0.25},${-w * 0.42} ${w * 0.3},${w * 0.1} 0,${w * 0.3} C ${-w * 0.3},${w * 0.1} ${-w * 0.25},${-w * 0.42} ${-w * 0.25},${-w * 0.42} Z`, fill: '#5a4426', transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)})` }, c);
    }
    P2(c, 'M 66,-30 C 72,-33 80,-32 86,-28 C 80,-28 72,-28 66,-26 Z', '#6a5430', { opacity: 0.8 });
    b.line();
    eye(i, 80, -27, 2.5);
    el('circle', { cx: 87, cy: -25, r: 0.9, fill: edge }, i);
    ST(i, 'M 89,-22 l 9,1 l 5,-4 M 98,-21 l 5,3', '#e0455a', 1.5);
    return s;
  };
  // 老鷹（停棲，像大冠鷲）：鉤狀的喙、銳利的眼、層疊的翼羽、有白色橫帶的尾、黃色的腳和黑色的爪
  B.hawk = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#24180e';
    if (o.perch !== false) {
      ST(i, 'M -74,4 C -30,0 30,6 74,1', '#6b4a2e', 10);
      ST(i, 'M -60,2 C -40,1 -20,2 0,3', '#8a6a48', 2, { opacity: 0.6 });
    }
    const D = 'M 39,-93 C 41,-100 38,-108 30,-111 C 24,-120 14,-126 4,-124 C -2,-123 -6,-122 -10,-118 C -14,-121 -19,-119 -19,-114 C -21,-106 -26,-94 -30,-80 C -34,-66 -38,-48 -40,-30 C -42,-18 -44,-8 -46,0 C -48,10 -52,22 -54,30 L -38,36 C -36,26 -32,12 -26,0 C -20,-8 -12,-12 -6,-12 L -4,-6 L 8,-6 C 12,-14 16,-26 22,-36 C 30,-50 34,-66 30,-82 C 28,-88 27,-92 27,-95 C 30,-96 33,-97 35,-97 C 37,-97 38,-95 39,-93 Z';
    const b = sil(i, D, '#5a3f28', edge, 2);
    const c = b.in;
    // 胸腹：較淺，有白色斑點
    P2(c, 'M 30,-84 C 34,-66 30,-50 22,-36 C 16,-26 10,-16 8,-6 L -4,-6 C -2,-30 6,-60 20,-90 Z', '#7a5638');
    for (let r = 0; r < 7; r++) for (let k = 0; k < 3; k++) { const y = -78 + r * 10, x = 22 - r * 2.4 - k * 7 + (r % 2) * 3; if (x < -2) continue; el('ellipse', { cx: x, cy: y, rx: 2, ry: 1.4, fill: '#f0e6d4', opacity: 0.9 }, c); }
    // 收合的翅膀：覆羽成排、飛羽長條
    P2(c, 'M 8,-96 C -10,-94 -26,-72 -32,-46 C -36,-28 -40,-12 -46,0 C -34,-10 -22,-26 -12,-42 C -4,-56 4,-74 8,-96 Z', '#46301e');
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const x = 2 - r * 6 - k * 4, y = -86 + r * 12 + k * 6; ST(c, `M ${x},${y} q 3,4 7,1`, '#2a1c12', 1.2); }
    [[-14, -46, -40, -6], [-18, -42, -43, -3], [-10, -50, -36, -10], [-22, -36, -45, -1]].forEach(([x1, y1, x2, y2]) => { ST(c, `M ${x1},${y1} L ${x2},${y2}`, '#2a1c12', 1.4); ST(c, `M ${x1 + 1.6},${y1} L ${x2 + 1.6},${y2}`, '#8a6a48', 0.8, { opacity: 0.8 }); });
    [[-6, -70], [-12, -62], [-4, -58], [-16, -74]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.2, fill: '#e8dcc8', opacity: 0.8 }, c));
    // 尾：黑褐色，中間一條寬的白色橫帶
    P2(c, 'M -60,2 L -20,2 L -20,40 L -60,40 Z', '#2a1c12');
    P2(c, 'M -60,13 L -20,8 L -20,17 L -60,22 Z', '#efe8dc');
    // 腿上的羽毛（褲子）
    P2(c, 'M -6,-12 C -8,-20 2,-26 10,-20 L 8,-6 L -4,-6 Z', '#6a4a30');
    ST(c, 'M -4,-14 l 10,-2 M -4,-10 l 11,-1', '#3e2a1a', 1);
    // 頭：深色頭頂和冠羽、黃色的臉和蠟膜、深灰色的鉤狀喙
    P2(c, 'M 30,-112 C 24,-122 12,-128 0,-125 C -8,-124 -16,-122 -20,-114 L -16,-108 C -6,-114 8,-116 22,-110 Z', '#2e2016');
    [[-14, -117], [-18, -113], [-10, -119]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.1, fill: '#f0e6d4' }, c));
    P2(c, 'M 30,-112 C 31,-106 30,-101 26,-99 C 22,-100 20,-104 21,-108 C 24,-110 27,-112 30,-112 Z', '#f2c23a');
    P2(c, 'M 39,-93 C 41,-100 38,-108 30,-111 L 29,-104 C 32,-102 34,-99 35,-97 C 37,-97 38,-95 39,-93 Z', '#3a3a3a');
    ST(c, 'M 31,-109 C 36,-106 38,-101 38,-96', '#8a8a8a', 1);
    P2(c, 'M 35,-97 C 33,-97 30,-96 27,-95 L 28,-99 C 31,-99 33,-98 35,-97 Z', '#6a6a6a');
    b.line();
    el('circle', { cx: 18, cy: -109, r: 4.6, fill: '#f2c23a', stroke: '#1a120a', 'stroke-width': 1 }, i);
    el('circle', { cx: 18.6, cy: -109, r: 2.4, fill: '#111' }, i);
    el('circle', { cx: 19.6, cy: -110.2, r: 0.9, fill: '#fff' }, i);
    ST(i, 'M 10,-114 C 15,-116.5 21,-115.5 26,-112', '#1a120a', 2.6);
    // 黃色的腳、黑色的爪抓住樹枝
    ST(i, 'M -1,-7 L -2,-1 M 6,-7 L 7,-1', '#e8c440', 4.5);
    ['M -2,-1 C 2,-1 5,1 5,5', 'M -2,-1 C -6,-1 -9,1 -9,5', 'M 7,-1 C 11,-1 14,1 14,5', 'M 7,-1 C 3,-1 1,1 1,4'].forEach((d) => ST(i, d, '#e8c440', 3.2));
    [[5, 5], [-9, 5], [14, 5], [1, 4]].forEach(([x, y]) => ST(i, `M ${x},${y} q 0,3 -2,4`, '#1a1a1a', 1.8));
    return s;
  };
  // 飛行中的老鷹（從下方看，翅膀展開）：翼端有分開的初級飛羽、尾羽展開有白色橫帶；可以用 r 轉向
  B.hawkFly = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#24180e';
    const RW = [
      [[10, -18], [34, -28], [62, -35], [84, -31]],
      [[84, -31], [92, -33], [102, -38], [106, -37]], [[106, -37], [109, -35], [100, -29], [95, -28]],
      [[95, -28], [101, -29], [108, -29], [112, -27]], [[112, -27], [114, -25], [103, -20], [97, -20]],
      [[97, -20], [103, -21], [110, -19], [114, -17]], [[114, -17], [116, -15], [103, -11], [97, -11]],
      [[97, -11], [102, -11], [108, -9], [111, -6]], [[111, -6], [113, -4], [100, -2], [94, -3]],
      [[94, -3], [98, -3], [102, 0], [104, 3]], [[104, 3], [105, 6], [94, 7], [88, 6]],
      [[88, 6], [76, 14], [58, 24], [40, 22]], [[40, 22], [28, 21], [18, 18], [10, 16]],
    ];
    const m = ([x, y]) => [-x, y];
    const LW = RW.slice().reverse().map(([a, b2, c2, d]) => [m(d), m(c2), m(b2), m(a)]);
    const TAIL = [[[10, 16], [13, 28], [18, 42], [24, 52]], [[24, 52], [14, 60], [-14, 60], [-24, 52]], [[-24, 52], [-18, 42], [-13, 28], [-10, 16]]];
    const HEAD = [[[-10, -18], [-12, -24], [-14, -30], [-13, -36]], [[-13, -36], [-12, -42], [-8, -46], [-4, -47]], [[-4, -47], [-3, -50], [-2, -53], [0, -54]], [[0, -54], [2, -53], [3, -50], [4, -47]], [[4, -47], [8, -46], [12, -42], [13, -36]], [[13, -36], [14, -30], [12, -24], [10, -18]]];
    const segs = [...RW, ...TAIL, ...LW, ...HEAD];
    const D = `M ${segs[0][0].join(',')} ` + segs.map(([, b2, c2, d]) => `C ${b2.join(',')} ${c2.join(',')} ${d.join(',')}`).join(' ') + ' Z';
    const b = sil(i, D, '#5a3f28', edge, 2);
    const c = b.in;
    [1, -1].forEach((k) => {
      const X = (x) => x * k;
      // 飛羽（翅膀後半）淺色、後緣深色、翼端深色
      P2(c, `M ${X(12)},6 C ${X(40)},4 ${X(70)},-4 ${X(92)},-14 L ${X(118)},-22 L ${X(118)},14 L ${X(12)},32 Z`, '#d8d0c2');
      ST(c, `M ${X(10)},16 C ${X(18)},18 ${X(28)},21 ${X(40)},22 C ${X(58)},24 ${X(76)},14 ${X(88)},6`, '#2a1c12', 8);
      P2(c, `M ${X(98)},-42 L ${X(122)},-42 L ${X(122)},12 L ${X(96)},12 C ${X(100)},-6 ${X(100)},-24 ${X(98)},-42 Z`, '#2a1c12');
      [[95, -28, 76, -20], [97, -20, 78, -13], [97, -11, 78, -6], [94, -3, 76, 0]].forEach(([x1, y1, x2, y2]) => ST(c, `M ${X(x1)},${y1} L ${X(x2)},${y2}`, '#5a4a38', 1));
      [30, 42, 54, 66, 78].forEach((x) => ST(c, `M ${X(x)},${21 - (x - 30) * 0.2} L ${X(x - 2)},${4 - (x - 30) * 0.2}`, '#9a8a76', 0.9));
      for (let r = 0; r < 2; r++) for (let n = 0; n < 5; n++) ST(c, `M ${X(18 + n * 13 + r * 6)},${-17 - n * 2 + r * 8} q ${X(3)},4 ${X(7)},1`, '#3e2a1a', 1.1);
    });
    // 身體：較淺、有白斑
    el('ellipse', { cx: 0, cy: -2, rx: 10, ry: 18, fill: '#7a5638' }, c);
    for (let r = 0; r < 4; r++) for (let n = -1; n <= 1; n++) el('ellipse', { cx: n * 5 + (r % 2) * 2.5, cy: -10 + r * 6, rx: 1.6, ry: 1.2, fill: '#f0e6d4' }, c);
    // 尾：深色、中間一條白色橫帶
    P2(c, 'M -30,18 L 30,18 L 30,64 L -30,64 Z', '#3a2818');
    P2(c, 'M -30,34 L 30,34 L 30,43 L -30,43 Z', '#efe8dc');
    // 頭（從下方看）：深色頭頂、黃色的臉、鉤狀的喙
    P2(c, 'M -16,-30 C -10,-36 10,-36 16,-30 L 16,-56 L -16,-56 Z', '#3a2818');
    P2(c, 'M -8,-44 C -6,-41 -3,-40 0,-41 C 3,-40 6,-41 8,-44 L 6,-47 L -6,-47 Z', '#f2c23a');
    P2(c, 'M -4,-47 C -3,-50 -2,-53 0,-54 C 2,-53 3,-50 4,-47 C 2,-46 -2,-46 -4,-47 Z', '#3a3a3a');
    b.line();
    [-1, 1].forEach((k) => { el('circle', { cx: k * 7.5, cy: -40, r: 2.8, fill: '#f2c23a' }, i); el('circle', { cx: k * 7.5, cy: -40, r: 1.4, fill: '#111' }, i); ST(i, `M ${k * 3.5},-44 L ${k * 11},-43`, '#1a120a', 1.8); });
    // 腳和爪：平時收在尾羽前；o.talons 時向前伸出、張開爪子（準備抓獵物）
    [-1, 1].forEach((k) => {
      if (o.talons) {
        ST(i, `M ${k * 5},10 C ${k * 9},0 ${k * 10},-12 ${k * 11},-22`, '#e8c440', 4);
        ST(i, `M ${k * 11},-22 l ${k * 5},-6 M ${k * 11},-22 l ${k * 0},-8 M ${k * 11},-22 l ${k * -5},-5 M ${k * 11},-22 l ${k * 2},5`, '#e8c440', 2.6);
        ST(i, `M ${k * 16},-28 q ${k * 2},-3 0,-5 M ${k * 11},-30 q ${k * 1},-3 ${k * -2},-4 M ${k * 6},-27 q ${k * -1},-3 ${k * -3},-3`, '#1a1a1a', 1.5);
      } else {
        ST(i, `M ${k * 5},14 L ${k * 7},24`, '#e8c440', 3.6);
        ST(i, `M ${k * 7},24 l ${k * 4},4 M ${k * 7},24 l ${k * -1},5 M ${k * 7},24 l ${k * -4},3`, '#e8c440', 2.4);
        ST(i, `M ${k * 11},28 q ${k * 1},2 ${k * -1},3 M ${k * 6},29 q 0,2 ${k * -2},2`, '#1a1a1a', 1.4);
      }
    });
    return s;
  };
  // 俯衝的老鷹（側面，頭朝右；放置時用 r 讓身體朝下）：翅膀向上向後舉成 V 字、初級飛羽分開、
  // 頭和鉤狀的喙在前面、爪子向前伸出、尾羽展開有白色橫帶
  B.hawkSwoop = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#24180e';
    const WING = 'M 14,-8 C 12,-26 6,-42 -2,-52 C -8,-64 -15,-80 -20,-92 C -21,-95 -21,-98 -23,-99 C -25,-99 -27,-92 -27,-86 C -29,-90 -31,-96 -33,-97 C -36,-97 -36,-89 -35,-83 C -37,-87 -40,-92 -42,-93 C -45,-93 -45,-85 -43,-79 C -45,-82 -49,-86 -51,-86 C -54,-85 -52,-78 -49,-73 C -51,-75 -55,-77 -57,-76 C -59,-74 -56,-68 -52,-64 C -48,-52 -42,-40 -36,-30 C -32,-22 -28,-12 -22,-8 Z';
    const paintWing = (wg, dark) => {
      const id = B.id('wing');
      el('path', { d: WING }, el('clipPath', { id }, el('defs', {}, wg)));
      el('path', { d: WING, fill: dark ? '#3a2818' : '#5a3f28' }, wg);
      const c = g(wg, { 'clip-path': `url(#${id})` });
      if (!dark) {
        P2(c, 'M 16,-6 C 12,-30 2,-48 -10,-62 C -20,-74 -28,-80 -34,-82 C -30,-66 -22,-50 -16,-36 C -10,-24 -4,-14 2,-8 Z', '#6e4e32');
        for (let r = 0; r < 3; r++) for (let n = 0; n < 4; n++) ST(c, `M ${8 - r * 7 - n * 5},${-18 - n * 10 - r * 4} q -2,5 2,8`, '#3e2a1a', 1.2);
        [[-24, -86, -10, -50], [-32, -84, -16, -46], [-40, -80, -22, -42], [-47, -74, -28, -38], [-30, -40, -20, -16], [-36, -34, -26, -12]].forEach(([x1, y1, x2, y2]) => ST(c, `M ${x1},${y1} L ${x2},${y2}`, '#2a1c12', 1.2));
        P2(c, 'M -18,-88 L -30,-104 L -60,-80 L -50,-70 C -40,-80 -30,-86 -18,-88 Z', '#2a1c12');
      }
      el('path', { d: WING, fill: 'none', stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, wg);
    };
    // 遠側的翅膀（在身體後面，較暗）
    paintWing(g(i, { transform: 'translate(16,-4) rotate(-20 2 -8) scale(0.9)' }), true);
    // 遠側的腳
    ST(i, 'M 6,6 C 12,12 20,18 28,20', '#c8a030', 3.4);
    ST(i, 'M 28,20 l 9,-3 M 28,20 l 9,2 M 28,20 l 6,6', '#c8a030', 2.2);
    const D = 'M 53,5 C 53,-4 49,-10 42,-12 C 38,-16 30,-17 25,-14 C 18,-13 8,-13 -4,-12 C -20,-11 -36,-10 -48,-10 C -58,-14 -70,-18 -80,-18 C -86,-14 -88,0 -84,8 C -80,12 -72,12 -66,10 C -56,7 -46,10 -36,11 C -20,14 0,15 14,12 C 24,10 32,5 38,2 C 41,2 44,2 46,2 C 49,2 51,3 53,5 Z';
    const b = sil(i, D, '#5a3f28', edge, 2);
    const c = b.in;
    P2(c, 'M 40,0 C 24,6 0,11 -36,8 L -36,20 L 44,20 Z', '#7a5638');
    for (let n = 0; n < 6; n++) el('ellipse', { cx: 18 - n * 7, cy: 7 + (n % 2) * 2, rx: 1.8, ry: 1.2, fill: '#f0e6d4' }, c);
    P2(c, 'M -46,-30 L -100,-30 L -100,30 L -46,30 Z', '#2a1c12');
    P2(c, 'M -68,-30 L -60,-30 L -60,30 L -68,30 Z', '#efe8dc');
    P2(c, 'M 42,-12 C 38,-17 28,-17 22,-12 C 18,-10 12,-9 8,-9 L 10,-4 C 18,-6 26,-8 34,-8 Z', '#2e2016');
    P2(c, 'M 42,-12 C 43,-8 42,-4 39,-2 C 36,-3 34,-6 35,-9 Z', '#f2c23a');
    P2(c, 'M 53,5 C 53,-4 49,-10 42,-12 L 41,-4 C 44,-2 46,0 46,2 C 49,2 51,3 53,5 Z', '#3a3a3a');
    ST(c, 'M 43,-10 C 48,-8 51,-3 52,2', '#8a8a8a', 1);
    b.line();
    // 近側的翅膀（向上向後舉起）
    paintWing(g(i, { transform: 'rotate(-30 2 -8)' }), false);
    // 頭：銳利的眼
    el('circle', { cx: 32, cy: -8, r: 3.8, fill: '#f2c23a', stroke: '#1a120a', 'stroke-width': 1 }, i);
    el('circle', { cx: 32.6, cy: -8, r: 2, fill: '#111' }, i);
    el('circle', { cx: 33.4, cy: -9, r: 0.8, fill: '#fff' }, i);
    ST(i, 'M 26,-12.5 C 30,-14 35,-13.5 39,-11', '#1a120a', 2.2);
    // 近側的腳：羽毛褲、黃色的腳、張開的爪子向前
    P2(i, 'M -2,4 C 2,0 12,2 16,10 C 14,16 6,16 0,12 Z', '#6a4a30', { stroke: edge, 'stroke-width': 1.4 });
    ST(i, 'M 12,12 C 18,16 24,20 32,22', '#e8c440', 4);
    ST(i, 'M 32,22 l 10,-4 M 32,22 l 11,2 M 32,22 l 7,7 M 32,22 l -3,6', '#e8c440', 2.6);
    ST(i, 'M 42,18 q 3,0 3,3 M 43,24 q 3,1 2,4 M 39,29 q 2,2 0,4 M 29,28 q 0,3 -2,3', '#1a1a1a', 1.6);
    return s;
  };
  // 麻雀（面向右）：栗色頭頂、白臉頰有黑斑、黑色喉斑、褐色背有黑色縱紋、白色翼帶、短圓錐形的喙
  B.sparrow = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#3a2414';
    ST(i, 'M -2,-8 L -4,0 M 5,-8 L 6,0 M -8,0 L 0,0 M 2,0 L 10,0', '#c8957a', 1.8);
    const D = 'M 33,-37 C 30,-40 27,-42 24,-42 C 22,-50 10,-52 3,-47 C -4,-44 -14,-40 -22,-34 C -30,-30 -36,-26 -44,-20 C -46,-16 -44,-14 -40,-15 C -34,-16 -28,-16 -22,-14 C -14,-8 -4,-6 6,-8 C 14,-10 20,-18 22,-26 C 23,-30 24,-33 26,-34 C 29,-34 31,-35 33,-37 Z';
    const b = sil(i, D, '#a87a50', edge, 1.6);
    const c = b.in;
    P2(c, 'M 25,-33 C 22,-24 14,-12 0,-8 C -10,-8 -18,-12 -24,-15 L -24,0 L 30,0 Z', '#ddd5c8');
    P2(c, 'M 24,-42 C 22,-50 10,-52 3,-47 C 1,-45 -1,-43 -3,-41 C 5,-44 14,-44 22,-40 Z', '#8a3f22');
    P2(c, 'M 6,-38 C 10,-41 18,-40 21,-35 C 18,-31 10,-31 6,-38 Z', '#f2eee6');
    el('ellipse', { cx: 12.5, cy: -35.5, rx: 2.3, ry: 2, fill: '#222' }, c);
    P2(c, 'M 26,-34 C 24,-30 21,-28 18,-27 C 19,-30 21,-33 24,-35 Z', '#222');
    P2(c, 'M 6,-30 C -2,-36 -18,-32 -28,-22 C -16,-20 -4,-20 6,-24 Z', '#7a4a2a');
    ST(c, 'M 2,-30 L -14,-24 M 4,-27 L -10,-22 M -4,-33 L -18,-27', '#2a1a10', 1.3);
    ST(c, 'M -2,-33 L -12,-30', '#f2eee6', 1.8);
    P2(c, 'M -30,-28 C -36,-24 -42,-20 -46,-18 L -38,-14 C -34,-18 -30,-22 -26,-24 Z', '#6a4a30');
    P2(c, 'M 33,-37 C 30,-40 27,-42 24,-42 L 24,-34 C 28,-34 31,-35 33,-37 Z', '#2e2e2e');
    b.line();
    eye(i, 20.5, -40.5, 2.6);
    return s;
  };
  // 魚（一般），len 是身長；背部較深、腹部較淺
  B.fish = (p, o = {}) => {
    const s = B.base(p, { ...o, s: (o.s || 1) * ((o.len || 100) / 100) }), i = s.inner, col = o.color || '#8fb8c8', fin = o.fin || '#6f98aa', edge = o.edge || '#3e5f6e';
    P2(i, 'M 2,-20 C -4,-34 -22,-32 -28,-15 Z', fin, { stroke: edge, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    P2(i, 'M -14,17 C -20,28 -28,26 -30,13 Z', fin, { stroke: edge, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    const D = 'M 50,0 C 44,-16 16,-24 -14,-18 C -28,-15 -36,-8 -40,-4 C -46,-10 -50,-16 -55,-19 C -53,-8 -53,8 -55,19 C -50,16 -46,10 -40,4 C -36,8 -28,15 -14,18 C 16,24 44,16 50,0 Z';
    const b = sil(i, D, col, edge, 2);
    const c = b.in;
    P2(c, 'M 52,-2 C 30,-8 0,-10 -44,-4 L -60,-30 L 60,-30 Z', edge, { opacity: 0.32 });
    P2(c, 'M 50,4 C 30,12 0,14 -36,8 L -60,30 L 60,30 Z', '#ffffff', { opacity: 0.28 });
    for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) ST(c, `M ${14 - k * 10 + r * 5},${-9 + r * 9} q 4,4 0,8`, edge, 0.9, { opacity: 0.45 });
    ST(c, 'M 34,-2 C 10,-3 -14,-1 -38,0', edge, 1, { opacity: 0.5, 'stroke-dasharray': '3 3' });
    ST(c, 'M -44,-6 L -53,-14 M -44,0 L -54,0 M -44,6 L -53,14', edge, 0.9, { opacity: 0.5 });
    b.line();
    ST(i, 'M 30,-12 Q 24,0 30,12', edge, 1.8);
    P2(i, 'M 18,4 C 10,10 6,16 3,14 C 6,8 10,4 18,4 Z', fin, { stroke: edge, 'stroke-width': 1.2 });
    eye(i, 38, -4, 3.6);
    return s;
  };
  B.minifish = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    el('path', { d: 'M 12,0 C 9,-6 0,-7 -6,-3 L -12,-7 L -11,0 L -12,7 L -6,3 C 0,7 9,6 12,0 Z', fill: o.color || '#8fb8c8', stroke: '#3e5f6e', 'stroke-width': 1.2 }, i);
    el('circle', { cx: 7, cy: -1.5, r: 1.3, fill: '#111' }, i);
    if (o.mark) el('circle', { cx: 0, cy: -1, r: 3.2, fill: '#ffd166', stroke: '#8a6a1a', 'stroke-width': 1 }, i);
    return s;
  };
  B.shark = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, col = '#6f8796', edge = '#3e5463';
    el('path', { d: 'M 60,14 C 46,40 32,58 14,66 C 20,46 28,28 34,14 Z', fill: '#5f7786', stroke: edge, 'stroke-width': 2 }, i);
    el('path', { d: 'M 32,-33 C 18,-52 2,-74 -16,-82 C -12,-62 -16,-44 -30,-32 Z', fill: col, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M -80,-19 L -92,-34 L -98,-15 Z', fill: col, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M -40,24 L -58,40 L -60,19 Z', fill: col, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 150,0 C 140,-16 110,-28 60,-32 C 10,-36 -60,-28 -110,-10 L -150,-48 C -146,-26 -140,-8 -136,0 C -140,6 -144,14 -148,26 L -110,8 C -60,26 10,34 60,30 C 110,26 140,14 150,0 Z', fill: col, stroke: edge, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 142,5 C 110,22 40,32 -20,28 C -60,24 -90,16 -110,8 C -60,16 20,22 142,5 Z', fill: '#cfd8de' }, i);
    for (let k = 0; k < 5; k++) el('path', { d: `M ${88 + k * 5},-12 q -4,9 0,18`, fill: 'none', stroke: edge, 'stroke-width': 1.6 }, i);
    el('path', { d: 'M 130,10 Q 118,16 106,14', fill: 'none', stroke: edge, 'stroke-width': 2 }, i);
    eye(i, 118, -8, 3.8);
    return s;
  };
  // 鮣魚：頭頂有吸盤（背面朝上貼著鯊魚的腹面）
  B.remora = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#2e3430';
    el('path', { d: 'M 44,0 C 40,-7 22,-9 -10,-7 L -32,-13 L -27,0 L -32,13 L -10,7 C 22,9 40,7 44,0 Z', fill: '#77806e', stroke: edge, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 40,1 C 20,3 0,3 -24,2', fill: 'none', stroke: '#2e3430', 'stroke-width': 3, opacity: 0.7 }, i);
    el('ellipse', { cx: 20, cy: -7.5, rx: 15, ry: 3.6, fill: '#c9b89a', stroke: edge, 'stroke-width': 1.2 }, i);
    for (let k = -4; k <= 4; k++) el('line', { x1: 20 + k * 3.2, y1: -10, x2: 20 + k * 3.2, y2: -5, stroke: edge, 'stroke-width': 0.9 }, i);
    eye(i, 36, -1, 2);
    return s;
  };
  B.clownfish = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, id = B.id('cf'), edge = '#3a1a08';
    const D = 'M 34,0 C 30,-14 12,-19 -8,-16 C -18,-14 -24,-9 -28,-5 L -40,-14 C -42,-6 -42,6 -40,14 L -28,5 C -24,9 -18,14 -8,16 C 12,19 30,14 34,0 Z';
    el('path', { d: 'M 6,-17 C 0,-28 -18,-26 -22,-12 Z M -6,16 C -12,25 -20,23 -22,11 Z', fill: '#ff8a2a', stroke: '#111', 'stroke-width': 2 }, i);
    el('path', { d: D }, el('clipPath', { id }, el('defs', {}, i)));
    el('path', { d: D, fill: '#ff8a2a' }, i);
    const cl = g(i, { 'clip-path': `url(#${id})` });
    [[18, 7], [-4, 8], [-27, 5]].forEach(([x, w]) => el('rect', { x: x - w / 2, y: -30, width: w, height: 60, fill: '#fafafa', stroke: '#111', 'stroke-width': 2.2 }, cl));
    el('path', { d: D, fill: 'none', stroke: '#111', 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 14,4 C 8,10 6,12 4,11 C 6,6 9,4 14,4 Z', fill: '#ff9a3a', stroke: edge, 'stroke-width': 1 }, i);
    eye(i, 26, -3, 3);
    return s;
  };
  B.anemone = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, rnd = S.rng(o.seed || 7), w = o.w || 90;
    const tents = [];
    for (let k = 0; k < 19; k++) {
      const t = k / 18, bx = (t - 0.5) * w * 0.9, a = (t - 0.5) * 2.2 + (rnd() - 0.5) * 0.3, L = 46 + rnd() * 18;
      const ex = bx + Math.sin(a) * L, ey = -40 - Math.cos(a) * L * 0.9;
      const cx1 = bx + Math.sin(a) * L * 0.4 + (rnd() - 0.5) * 18, cy1 = -40 - Math.cos(a) * L * 0.4;
      tents.push([B.bez([[[bx, -38], [cx1, cy1], [ex - (rnd() - 0.5) * 14, ey + 10], [ex, ey]]], 10), k]);
    }
    tents.sort((a, b) => (a[1] % 2) - (b[1] % 2));
    tents.forEach(([pts, k]) => {
      el('path', { d: B.ribbon(pts, (t) => 9 - 3 * t), fill: k % 2 ? '#d9c08a' : '#c8ab70', stroke: '#8a6a3a', 'stroke-width': 1.2 }, i);
      const [x, y] = pts[pts.length - 1];
      el('circle', { cx: x, cy: y, r: 3.6, fill: '#b78ad0' }, i);
    });
    el('path', { d: `M ${-w * 0.46},0 C ${-w * 0.36},-14 ${-w * 0.34},-28 ${-w * 0.42},-40 L ${w * 0.42},-40 C ${w * 0.34},-28 ${w * 0.36},-14 ${w * 0.46},0 Z`, fill: '#8a4a6a', stroke: '#4a1e38', 'stroke-width': 2 }, i);
    el('ellipse', { cx: 0, cy: -40, rx: w * 0.42, ry: 6, fill: '#a85a84', stroke: '#4a1e38', 'stroke-width': 1.5 }, i);
    return s;
  };
  // 狗（側面，面向右）：友善的樣子；豎耳、捲尾，背部較深、胸腹淺色
  B.dog = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, fur = o.fur || '#c99a62', edge = '#5a3e22';
    P2(i, 'M 28,-50 C 30,-34 30,-18 30,-5 C 30,-1 34,0 40,0 C 44,0 46,-3 44,-5 C 42,-18 42,-34 42,-50 Z', '#a87c48', { stroke: edge, 'stroke-width': 1.6 });
    P2(i, 'M -40,-48 C -40,-34 -40,-18 -40,-5 C -40,-1 -36,0 -30,0 C -26,0 -24,-3 -26,-5 C -28,-18 -28,-34 -26,-48 Z', '#a87c48', { stroke: edge, 'stroke-width': 1.6 });
    const D = 'M 96,-96 C 92,-100 86,-102 80,-106 C 76,-112 72,-118 66,-122 C 66,-128 64,-136 61,-142 C 56,-138 52,-132 50,-124 C 44,-120 40,-112 38,-102 C 30,-92 10,-90 -20,-90 C -40,-90 -52,-88 -58,-84 C -62,-92 -66,-104 -58,-114 C -52,-118 -45,-114 -47,-108 C -51,-102 -54,-96 -54,-88 C -58,-82 -64,-74 -64,-62 C -64,-52 -60,-44 -58,-36 C -58,-24 -58,-12 -58,-5 C -58,-1 -54,0 -48,0 C -44,0 -42,-3 -44,-5 C -46,-12 -46,-26 -42,-40 C -30,-48 0,-50 18,-46 C 20,-34 20,-18 20,-5 C 20,-1 24,0 30,0 C 34,0 36,-3 34,-5 C 33,-20 34,-34 36,-46 C 40,-60 46,-74 54,-82 C 60,-86 70,-88 78,-88 C 86,-88 92,-90 96,-96 Z';
    const b = sil(i, D, fur, edge, 2);
    const c = b.in;
    P2(c, 'M 40,-106 C 30,-94 10,-92 -20,-92 C -40,-92 -52,-90 -60,-84 L -60,-76 C -48,-82 -30,-84 -10,-84 C 14,-84 30,-90 42,-100 Z', '#a87a46', { opacity: 0.9 });
    P2(c, 'M 98,-94 C 90,-92 80,-90 70,-88 C 60,-84 50,-76 44,-62 C 40,-52 36,-40 34,-28 L 46,-28 C 48,-48 56,-68 70,-80 C 80,-86 90,-88 100,-90 Z', '#f0dcb8');
    P2(c, 'M -42,-42 C -20,-48 0,-50 20,-46 L 20,-38 C 0,-42 -20,-42 -42,-36 Z', '#f0dcb8', { opacity: 0.85 });
    P2(c, 'M 61,-138 C 59,-132 56,-128 54,-124 C 58,-126 61,-128 63,-130 Z', '#d8907a', { opacity: 0.8 });
    P2(c, 'M -56,-108 C -55,-112 -50,-114 -48,-108 C -51,-103 -53,-99 -54,-92 Z', '#f0dcb8');
    ST(c, 'M -42,-40 C -50,-46 -60,-54 -63,-64', edge, 1.3, { opacity: 0.7 });
    ST(c, 'M 20,-44 C 24,-54 28,-62 34,-70 M 56,-104 C 58,-98 62,-94 66,-92', edge, 1.1, { opacity: 0.5 });
    ST(c, 'M -52,-3 L -52,0 M 26,-3 L 26,0', edge, 1);
    b.line();
    eye(i, 70, -110, 3.8);
    ST(i, 'M 65,-115.5 C 68,-117.5 72,-117.5 75,-115.5', edge, 1.2);
    el('ellipse', { cx: 94.5, cy: -96.5, rx: 4.6, ry: 3.6, fill: '#1e1e1e' }, i);
    ST(i, 'M 93,-92 C 90,-89 84,-88 78,-90', edge, 1.6);
    return s;
  };
  // 跳蚤（放大）：身體左右扁、一節一節，有向後的剛毛；後腳粗大善跳
  B.flea = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#2e1a0a', leg = '#8a5a2c';
    const seg = (pts, w) => { for (let k = 0; k < pts.length - 1; k++) ST(i, `M ${pts[k][0]},${pts[k][1]} L ${pts[k + 1][0]},${pts[k + 1][1]}`, edge, w[k] + 2); for (let k = 0; k < pts.length - 1; k++) ST(i, `M ${pts[k][0]},${pts[k][1]} L ${pts[k + 1][0]},${pts[k + 1][1]}`, leg, w[k]); };
    seg([[-8, 10], [-20, 24], [-6, 32], [-22, 40], [-30, 46]], [8, 5.5, 4, 2.6]);
    seg([[6, 14], [2, 26], [12, 32], [6, 42]], [6, 4, 3]);
    seg([[20, 12], [26, 22], [18, 28], [24, 36]], [5, 3.6, 2.6]);
    const D = 'M 36,10 C 37,4 34,-2 28,-6 C 20,-18 6,-24 -10,-24 C -26,-24 -36,-12 -36,2 C -36,14 -24,22 -8,22 C 6,22 16,18 22,16 C 26,16 30,15 33,16 C 36,16 37,13 36,10 Z';
    const b = sil(i, D, '#8a5a2c', edge, 1.6);
    const c = b.in;
    P2(c, 'M -40,8 C -20,18 10,20 40,10 L 40,30 L -40,30 Z', '#5a3418', { opacity: 0.6 });
    P2(c, 'M -22,-22 C -6,-26 10,-20 20,-12 C 6,-16 -8,-18 -22,-16 Z', '#c89060', { opacity: 0.6 });
    for (let k = 0; k < 6; k++) ST(c, `M ${-24 + k * 8},${-22 + k * 2} C ${-20 + k * 8},${-8 + k * 2} ${-20 + k * 8},${6 + k} ${-24 + k * 8},${20 - k}`, edge, 1, { opacity: 0.55 });
    ST(c, 'M 22,-10 C 18,-2 18,8 22,16', edge, 1.2, { opacity: 0.7 });
    b.line();
    for (let k = 0; k < 8; k++) { const x = -28 + k * 7, y = -20 + (k > 4 ? (k - 4) * 3 : -1); ST(i, `M ${x},${y} l -5,-4`, edge, 1.1); }
    eye(i, 29, 3, 1.8);
    ST(i, 'M 34,14 L 37,22', edge, 1.6);
    return s;
  };
  // 單峰駱駝（面向右）：一個輪廓；長頸彎曲、駝峰、膝上的硬皮，遠側的腳較暗
  B.camel = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, fur = '#c8a066', edge = '#6e522c';
    P2(i, 'M 38,-84 C 40,-60 40,-30 40,-6 C 40,-2 44,0 50,0 L 52,-2 C 50,-4 46,-6 46,-8 C 46,-30 46,-60 46,-84 Z', '#a8834e', { stroke: edge, 'stroke-width': 1.5 });
    P2(i, 'M -46,-84 C -46,-60 -44,-30 -46,-6 C -46,-2 -42,0 -36,0 L -34,-2 C -36,-4 -40,-6 -40,-8 C -38,-30 -38,-60 -38,-84 Z', '#a8834e', { stroke: edge, 'stroke-width': 1.5 });
    const D = 'M 112,-150 C 108,-158 100,-164 92,-166 C 86,-168 80,-168 76,-164 C 74,-170 72,-172 70,-168 C 70,-160 72,-146 70,-134 C 68,-122 60,-112 50,-112 C 40,-114 30,-124 18,-146 C 8,-166 -26,-168 -38,-146 C -44,-136 -52,-128 -60,-124 C -68,-122 -72,-116 -72,-108 C -72,-96 -64,-88 -60,-80 C -58,-64 -56,-52 -56,-46 C -58,-30 -58,-14 -58,-6 C -60,-2 -60,0 -54,0 L -42,0 C -40,-2 -44,-4 -46,-6 C -46,-20 -46,-38 -44,-50 C -42,-60 -40,-72 -36,-82 C -20,-86 10,-86 26,-84 C 28,-70 30,-56 30,-48 C 30,-32 30,-16 30,-6 C 28,-2 28,0 34,0 L 46,0 C 48,-2 44,-4 42,-6 C 42,-18 42,-34 42,-48 C 42,-60 44,-72 46,-84 C 52,-96 64,-100 74,-110 C 82,-118 88,-130 94,-140 C 98,-144 104,-146 112,-146 C 114,-147 114,-149 112,-150 Z';
    const b = sil(i, D, fur, edge, 1.8);
    const c = b.in;
    P2(c, 'M 18,-146 C 8,-166 -26,-168 -38,-146 C -44,-136 -52,-128 -60,-124 L -60,-112 C -48,-122 -36,-140 -20,-150 C -4,-156 10,-150 18,-140 Z', '#a8804a', { opacity: 0.8 });
    P2(c, 'M -36,-82 C -20,-90 10,-90 26,-86 L 26,-80 C 10,-82 -20,-82 -36,-78 Z', '#e0c08a', { opacity: 0.8 });
    P2(c, 'M -10,-158 C -2,-162 8,-158 14,-150', 'none', { stroke: '#e8cc98', 'stroke-width': 3, opacity: 0.8 });
    [[36, -52], [-50, -52]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 7, ry: 5, fill: '#9a7848', opacity: 0.8 }, c));
    ST(c, 'M -72,-110 C -76,-98 -76,-90 -74,-82', edge, 2.2);
    b.line();
    el('ellipse', { cx: -74, cy: -80, rx: 3, ry: 6, fill: '#6e522c' }, i);
    eye(i, 92, -158, 2.6);
    ST(i, 'M 88,-162 l 7,-1 M 89,-161 l -1,-3 M 92,-161.5 l 0,-3', edge, 1.2);
    ST(i, 'M 112,-147 Q 106,-144 100,-146', edge, 1.5);
    el('ellipse', { cx: 108, cy: -154, rx: 1.4, ry: 2.4, fill: edge }, i);
    return s;
  };
  // 仙人掌（扁平的肉質莖一節一節，葉變成刺）
  B.cactus = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    const pads = [[0, -48, 30, 48, 0], [-30, -116, 26, 38, -28], [34, -112, 25, 36, 24], [-46, -168, 18, 26, -10]];
    pads.forEach(([cx, cy, rx, ry, r]) => {
      const pg = S.place(g(i), { x: cx, y: cy, r });
      el('ellipse', { cx: 0, cy: 0, rx, ry, fill: '#5aa258', stroke: '#2e6a36', 'stroke-width': 2.5 }, pg);
      el('ellipse', { cx: -rx * 0.3, cy: -ry * 0.15, rx: rx * 0.35, ry: ry * 0.6, fill: '#7cbc6a', opacity: 0.55 }, pg);
      for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
        const u = a * rx * 0.44 + (b % 2 ? rx * 0.22 : 0), v = b * ry * 0.4;
        if ((u / rx) ** 2 + (v / ry) ** 2 > 0.6) continue;
        el('circle', { cx: u, cy: v, r: 2.2, fill: '#d8cf98' }, pg);
        [[-0.9, -0.45, 8], [0.15, -1, 10], [0.95, -0.3, 7]].forEach(([dx, dy, L]) => el('line', { x1: u, y1: v, x2: u + dx * L, y2: v + dy * L, stroke: '#f4efd8', 'stroke-width': 1, 'stroke-linecap': 'round' }, pg));
      }
    });
    const fx = 48, fy = -146;
    for (let k = 0; k < 7; k++) { const a = (k / 7) * 6.283 - 1.57; el('ellipse', { cx: fx + Math.cos(a) * 7, cy: fy + Math.sin(a) * 7 - 4, rx: 7, ry: 4.5, fill: '#f2d23a', stroke: '#b89a1a', 'stroke-width': 1, transform: `rotate(${f1((a * 180) / Math.PI)} ${f1(fx + Math.cos(a) * 7)} ${f1(fy + Math.sin(a) * 7 - 4)})` }, i); }
    el('circle', { cx: fx, cy: fy - 4, r: 4, fill: '#c8a020' }, i);
    return s;
  };
  // 小白鷺（站立，面向右）：S 形的頸、細長的黑色喙、頭上的飾羽、黑腳黃趾
  B.egret = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#8a9aa3';
    ST(i, 'M -4,-56 L -2,-32 L -6,0 M 6,-56 L 8,-32 L 10,0', '#1e1e1e', 3);
    ST(i, 'M -12,0 L 0,0 M -6,0 L -2,-3 M 4,0 L 16,0 M 10,0 L 13,-3', '#e8c440', 2.2);
    const D = 'M 62,-136 C 50,-138 40,-140 32,-141 C 28,-146 20,-146 17,-141 C 12,-136 6,-128 6,-118 C 6,-108 14,-100 16,-90 C 6,-88 -16,-88 -34,-80 C -44,-76 -54,-68 -56,-62 C -50,-60 -42,-60 -34,-60 C -18,-54 6,-54 16,-60 C 26,-66 30,-80 28,-92 C 28,-104 18,-112 18,-120 C 18,-126 24,-130 30,-130 C 40,-132 50,-134 62,-136 Z';
    const b = sil(i, D, '#f6f8f8', edge, 1.6);
    const c = b.in;
    P2(c, 'M -56,-62 C -30,-62 0,-60 30,-68 L 30,-40 L -56,-40 Z', '#d2dce0');
    P2(c, 'M 18,-120 C 18,-108 26,-100 28,-90 L 34,-90 L 34,-122 Z', '#dfe7ea');
    ST(c, 'M 14,-84 C 0,-82 -24,-78 -50,-65', '#c0ccd2', 1.4);
    ST(c, 'M 6,-78 C -6,-76 -20,-72 -34,-67 M 0,-72 C -10,-70 -22,-68 -32,-64', '#c8d4d8', 1);
    P2(c, 'M 62,-136 C 50,-138 40,-140 32,-141 L 31,-131 C 40,-132 50,-134 62,-136 Z', '#1e1e1e');
    P2(c, 'M 32,-141 C 30,-139 28,-136 28,-133 L 31,-131 Z', '#e8c440');
    b.line();
    ST(i, 'M 16,-142 C 6,-142 -4,-136 -12,-128 M 15,-140 C 6,-138 -2,-132 -8,-124', '#e8eef0', 1.3);
    eye(i, 25, -138.5, 1.8, '#d8b030');
    return s;
  };
  // 蜻蜓（從上方看，頭朝右）：大複眼、胸部、細長分節的腹部、兩對平展的透明翅（有翅脈和翅痣）
  B.dragonfly = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#123a5a';
    const FW = 'M 8,-5 C 13,-20 14,-40 10,-52 C 8,-57 3,-57 1,-52 C -1,-40 -1,-20 2,-5 Z';
    const HW = 'M 1,-5 C 2,-20 0,-40 -4,-50 C -6,-55 -11,-55 -12,-50 C -15,-34 -14,-16 -9,-4 Z';
    const wing = (d, costa, lines, stig, sy) => {
      const wg = g(i, { transform: `scale(1,${sy})` });
      el('path', { d, fill: 'rgba(214,236,255,0.30)', stroke: '#d6ecff', 'stroke-width': 1.1, 'stroke-linejoin': 'round' }, wg);
      lines.forEach((l) => ST(wg, l, '#b8d4e8', 0.7, { opacity: 0.9 }));
      ST(wg, costa, '#9cc0d8', 1.4);
      for (let y = -10; y > -48; y -= 4.5) ST(wg, `M ${costa === FWC ? 2 : -10},${y} L ${costa === FWC ? 11 : 0},${y - 1}`, '#c8e0f0', 0.5, { opacity: 0.7 });
      el('path', { d: stig, fill: '#2a3a4a' }, wg);
    };
    const FWC = 'M 8,-5 C 13,-20 14,-40 10,-52';
    const HWC = 'M 1,-5 C 2,-20 0,-40 -4,-50';
    [-1, 1].forEach((sy) => {
      wing(HW, HWC, ['M -3,-5 C -3,-22 -5,-38 -7,-50', 'M -7,-5 C -9,-20 -10,-36 -10,-48'], 'M -1.4,-43 L -2.6,-48 L -5,-47.6 L -3.6,-42.6 Z', sy);
      wing(FW, FWC, ['M 5,-5 C 8,-22 8,-40 6,-52', 'M 3,-6 C 3,-24 3,-40 3,-52'], 'M 11.6,-43 L 11.6,-48.5 L 9.2,-49 L 9,-43.4 Z', sy);
    });
    const D = 'M 25,0 C 25,-7 22,-11 17,-11 C 12,-11 10,-9 9,-7 C 7,-7 6,-6 5,-6 C 1,-6 -2,-5 -3,-3 C -5,-2.6 -7,-2.6 -9,-2.6 L -78,-2.2 C -82,-2.2 -86,-1.6 -86,0 C -86,1.6 -82,2.2 -78,2.2 L -9,2.6 C -7,2.6 -5,2.6 -3,3 C -2,5 1,6 5,6 C 6,6 7,7 9,7 C 10,9 12,11 17,11 C 22,11 25,7 25,0 Z';
    const b = sil(i, D, '#3a8ac8', edge, 1.2);
    const c = b.in;
    P2(c, 'M -4,-8 L 9,-8 L 9,8 L -4,8 Z', '#2f6f8a');
    ST(c, 'M -2,-3 L 8,-4 M -2,3 L 8,4', '#9fe0f0', 1.4);
    [-1, 1].forEach((k) => { el('circle', { cx: 17, cy: k * 5.6, r: 6.2, fill: '#2a76b8' }, c); el('circle', { cx: 18.5, cy: k * 5.6 - 2, r: 1.8, fill: '#bfe6ff', opacity: 0.9 }, c); });
    el('ellipse', { cx: 23.5, cy: 0, rx: 2.4, ry: 3.4, fill: '#8fd0e8' }, c);
    ST(c, 'M -9,0 L -80,0', '#8fd0f0', 1, { opacity: 0.8 });
    for (let k = 0; k < 10; k++) ST(c, `M ${-12 - k * 7},-3 L ${-12 - k * 7},3`, '#123a5a', 1.2);
    P2(c, 'M -78,-3 L -90,-3 L -90,3 L -78,3 Z', '#1a3a5a');
    b.line();
    return s;
  };
  // 招潮蟹（正面）：雄蟹一隻大螯
  B.fiddler = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#2a2a2a';
    [-1, 1].forEach((sd) => [0, 1, 2, 3].forEach((k) => el('path', { d: `M ${sd * 18},${-22 + k * 4} L ${sd * (34 + k * 4)},${-30 + k * 3} L ${sd * (40 + k * 5)},0`, fill: 'none', stroke: '#6a5a4a', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, i)));
    el('path', { d: 'M -10,-34 L -12,-50 M 10,-34 L 12,-50', stroke: edge, 'stroke-width': 2.5 }, i);
    el('circle', { cx: -12, cy: -51, r: 3.5, fill: '#1a1a1a' }, i); el('circle', { cx: 12, cy: -51, r: 3.5, fill: '#1a1a1a' }, i);
    el('path', { d: 'M -26,-30 C -20,-38 20,-38 26,-30 L 22,-14 C 10,-10 -10,-10 -22,-14 Z', fill: o.plain ? '#7a5a4a' : '#4a6a8a', stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M -16,-28 C -8,-32 8,-32 16,-28', fill: 'none', stroke: '#8ab0d0', 'stroke-width': 2 }, i);
    if (o.plain) [-1, 1].forEach((sd) => el('path', { d: `M ${sd * 20},-22 L ${sd * 32},-34 L ${sd * 40},-30 M ${sd * 32},-34 L ${sd * 36},-40`, fill: 'none', stroke: '#c86a4a', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, i));
    else {
      el('path', { d: 'M 20,-20 L 40,-30', stroke: '#e8803a', 'stroke-width': 7, 'stroke-linecap': 'round' }, i);
      el('path', { d: 'M 38,-40 C 56,-58 84,-54 88,-38 C 82,-32 64,-32 58,-30 L 84,-26 C 80,-14 60,-12 40,-22 Z', fill: '#f08a3a', stroke: '#7a3a10', 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
      el('path', { d: 'M -20,-20 L -30,-26 L -34,-20', fill: 'none', stroke: '#e8a05a', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, i);
    }
    return s;
  };
  B.mudskipper = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, edge = '#3a3a2a';
    el('path', { d: 'M 6,-26 C 0,-46 -22,-48 -30,-24 Z', fill: '#7a7a5a', stroke: edge, 'stroke-width': 1.5 }, i);
    el('path', { d: 'M -32,-20 C -40,-30 -60,-26 -66,-14 L -30,-14 Z', fill: '#7a7a5a', stroke: edge, 'stroke-width': 1.5 }, i);
    el('path', { d: 'M 40,-12 C 40,-26 26,-30 10,-26 C -10,-22 -40,-16 -64,-10 L -76,-20 L -74,-6 L -80,6 L -64,-2 C -40,0 -10,0 10,-2 C 26,-2 40,0 40,-12 Z', fill: '#8a8a64', stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    [[0, -16], [-14, -14], [-28, -12], [-8, -8], [-40, -10]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.8, fill: '#8ad0ff' }, i));
    el('path', { d: 'M 14,-6 C 20,0 22,4 26,0 C 24,-4 20,-8 14,-6 Z', fill: '#6a6a4a', stroke: edge, 'stroke-width': 1.5 }, i);
    [[28, -28], [34, -27]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 5, fill: '#9a9a74', stroke: edge, 'stroke-width': 1.5 }, i); el('circle', { cx: x + 1, cy: y - 1, r: 2.4, fill: '#111' }, i); });
    el('path', { d: 'M 40,-10 Q 34,-8 30,-10', fill: 'none', stroke: edge, 'stroke-width': 1.5 }, i);
    return s;
  };
  B.dolphin = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, col = '#7f9cb0', edge = '#3e5463';
    el('path', { d: 'M 0,-29 C -2,-46 -12,-56 -26,-58 C -19,-46 -19,-36 -23,-26 Z', fill: col, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    // 尾鰭是水平的：從側面看只是一片細長的鰭
    el('path', { d: 'M 98,4 C 92,2 86,0 80,-2 C 76,-6 72,-12 68,-16 C 58,-28 40,-32 20,-30 C -20,-28 -60,-18 -92,-6 L -104,-4 L -128,-12 C -134,-8 -132,0 -124,3 L -104,5 C -60,14 0,24 40,18 C 62,14 78,10 88,8 Z', fill: col, stroke: edge, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 90,7 C 70,12 30,21 -14,16 C 20,13 62,9 90,7 Z', fill: '#d6e2ea' }, i);
    el('path', { d: 'M 42,12 C 36,24 28,30 18,33 C 22,24 28,16 33,10 Z', fill: '#6a879a', stroke: edge, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, i);
    el('path', { d: 'M 98,4 Q 90,6 80,5', fill: 'none', stroke: edge, 'stroke-width': 1.5 }, i);
    eye(i, 64, -8, 2.6);
    return s;
  };
  // 珊瑚（分枝狀）
  B.coral = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, col = o.color || '#e8806a', rnd = S.rng(o.seed || 5);
    const br = (x, y, a, len, w, d) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      el('line', { x1: x, y1: y, x2, y2, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, i);
      if (d > 0) { br(x2, y2, a - 0.45 - rnd() * 0.2, len * 0.78, w * 0.78, d - 1); br(x2, y2, a + 0.45 + rnd() * 0.2, len * 0.78, w * 0.78, d - 1); }
      else el('circle', { cx: x2, cy: y2, r: w * 0.55, fill: o.tip || '#ffc2a8' }, i);
    };
    br(0, 0, -1.57, o.len || 30, o.w || 10, o.depth || 3);
    return s;
  };
  B.brainCoral = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, w = o.w || 90;
    el('path', { d: `M ${-w / 2},0 C ${-w / 2},${-w * 0.55} ${w / 2},${-w * 0.55} ${w / 2},0 Z`, fill: o.color || '#d8b24a', stroke: '#8a6a1a', 'stroke-width': 2 }, i);
    for (let k = 1; k < 4; k++) el('path', { d: `M ${-w * 0.45 + k * 4},-4 C ${-w * 0.4},${-w * 0.12 * k} ${w * 0.4},${-w * 0.12 * k} ${w * 0.45 - k * 4},-4`, fill: 'none', stroke: '#a8862a', 'stroke-width': 2, 'stroke-dasharray': '9 4' }, i);
    return s;
  };
  B.seaweed = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 60, col = o.color || '#5fbf6a';
    [-10, 0, 10].forEach((dx, k) => el('path', { d: `M ${dx - 5},0 C ${dx - 14},${-h * 0.35} ${dx + 8},${-h * 0.6} ${dx - 2 + k * 3},${-h * (0.85 + k * 0.08)} C ${dx + 12},${-h * 0.6} ${dx - 2},${-h * 0.35} ${dx + 5},0 Z`, fill: col, stroke: '#2f7a3a', 'stroke-width': 1.2, opacity: 0.95 }, i));
    return s;
  };
  B.barnacle = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    el('path', { d: 'M -10,0 L -6,-11 L 6,-11 L 10,0 Z', fill: '#d8d2c2', stroke: '#6a645a', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, i);
    el('ellipse', { cx: 0, cy: -11, rx: 5, ry: 1.8, fill: '#3a3a3a' }, i);
    el('line', { x1: 0, y1: -1, x2: 0, y2: -10, stroke: '#a8a294', 'stroke-width': 1 }, i);
    return s;
  };
  B.seastar = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, R = o.rad || 22, pts = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.283 - 1.57, r = k % 2 ? R * 0.42 : R; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    el('path', { d: S.smoothPath(pts), fill: o.color || '#f08a3a', stroke: '#8a3a10', 'stroke-width': 1.5 }, i);
    for (let k = 0; k < 5; k++) { const a = (k / 5) * 6.283 - 1.57; for (let j = 1; j < 4; j++) el('circle', { cx: Math.cos(a) * R * 0.22 * j, cy: Math.sin(a) * R * 0.22 * j, r: 1.4, fill: '#ffd0a0' }, i); }
    return s;
  };
  // 浮游藻類（放大）
  B.plankton = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, rnd = S.rng(o.seed || 9);
    for (let k = 0; k < (o.n || 8); k++) {
      const x = (rnd() - 0.5) * 100, y = (rnd() - 0.5) * 70, a = rnd() * 180;
      if (k % 2) { el('rect', { x: x - 12, y: y - 6, width: 24, height: 12, rx: 3, fill: 'rgba(160,220,120,0.5)', stroke: '#9ad27a', 'stroke-width': 1.5, transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` }, i); el('line', { x1: x - 8, y1: y, x2: x + 8, y2: y, stroke: '#9ad27a', 'stroke-width': 1, transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` }, i); }
      else { el('circle', { cx: x, cy: y, r: 8, fill: 'rgba(160,220,120,0.45)', stroke: '#9ad27a', 'stroke-width': 1.5 }, i); el('circle', { cx: x, cy: y, r: 3, fill: '#6fce62' }, i); }
    }
    return s;
  };

  // ---------- 紅樹林 ----------
  // 胎生苗：上端的萼片、下端尖（筆的形狀）
  const propagule = (p, x, y, L, r = 0, col = '#6a8a3a') => {
    const q = S.place(g(p), { x, y, r });
    el('path', { d: `M -1.6,0 C -2.4,${f1(L * 0.4)} -3.4,${f1(L * 0.72)} 0,${f1(L)} C 3.4,${f1(L * 0.72)} 2.4,${f1(L * 0.4)} 1.6,0 Z`, fill: col, stroke: '#3a4a1a', 'stroke-width': 1 }, q);
    el('path', { d: 'M -4,1 L 0,-3 L 4,1 Z', fill: '#7a5a2a' }, q);
    return q;
  };
  B.propagule = propagule;
  B.kandelia = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 170, w = o.w || 170;
    el('path', { d: `M -30,0 C -18,-6 -12,-16 -10,${-h * 0.3} L -14,${-h * 0.5} L -6,${-h * 0.5} L 0,${-h * 0.36} L 6,${-h * 0.52} L 14,${-h * 0.5} L 10,${-h * 0.3} C 12,-16 18,-6 30,0 Z`, fill: '#7a5a3a', stroke: '#3e2a18', 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    const cy = -h * 0.66;
    el('path', { d: S.smoothPath(S.blobPts(0, cy, w / 2, h * 0.27, 60, [[9, 0.06, 1], [14, 0.04, 2]])), fill: '#3a7a44', stroke: '#24522c', 'stroke-width': 2.5 }, i);
    [[-0.22, -0.3, 0.4], [0.2, -0.25, 0.32]].forEach(([dx, dy, k]) => el('path', { d: S.smoothPath(S.blobPts(dx * w, cy + dy * h * 0.4, w * k * 0.5, h * k * 0.3, 36, [[7, 0.08, dx * 9]])), fill: '#4f9455', opacity: 0.7 }, i));
    if (o.props !== false) [-0.36, -0.24, -0.12, 0.02, 0.14, 0.26, 0.36].forEach((t, k) => propagule(i, t * w, cy + h * 0.2 - Math.abs(t) * h * 0.12, 44 + (k % 3) * 8, (k % 2 ? 3 : -3)));
    return s;
  };
  B.avicennia = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 150, w = o.w || 170, rnd = S.rng(o.seed || 11);
    if (o.roots !== false) for (let k = 0; k < 22; k++) {
      const x = (k / 21 - 0.5) * w * 1.3 + (rnd() - 0.5) * 8; if (Math.abs(x) < 12) continue;
      const hh = 14 + rnd() * 14;
      el('path', { d: `M ${f1(x - 2.6)},2 L ${f1(x + (rnd() - 0.5) * 2)},${f1(-hh)} L ${f1(x + 2.6)},2 Z`, fill: '#9a7a5a', stroke: '#5a4430', 'stroke-width': 1 }, i);
    }
    el('path', { d: `M -14,0 C -8,-20 -8,${-h * 0.3} -6,${-h * 0.46} L -30,${-h * 0.58} L -26,${-h * 0.62} L 0,${-h * 0.5} L 26,${-h * 0.62} L 30,${-h * 0.58} L 6,${-h * 0.46} C 8,${-h * 0.3} 8,-20 14,0 Z`, fill: '#8a7a6a', stroke: '#4a4038', 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    el('path', { d: S.smoothPath(S.blobPts(0, -h * 0.68, w / 2, h * 0.25, 60, [[8, 0.07, 3], [13, 0.04, 5]])), fill: '#6f9a6a', stroke: '#3e6a40', 'stroke-width': 2.5 }, i);
    el('path', { d: S.smoothPath(S.blobPts(-w * 0.15, -h * 0.76, w * 0.22, h * 0.1, 32, [[6, 0.1, 2]])), fill: '#8ab486', opacity: 0.7 }, i);
    return s;
  };
  B.reed = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 110, rnd = S.rng(o.seed || 2);
    for (let k = 0; k < 6; k++) {
      const x = (k - 2.5) * 7, lean = (k - 2.5) * 5 + (rnd() - 0.5) * 6, hh = h * (0.7 + rnd() * 0.3);
      el('path', { d: `M ${x},0 Q ${x + lean * 0.3},${-hh * 0.5} ${x + lean},${-hh}`, fill: 'none', stroke: '#8aa860', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, i);
      if (k % 2) el('ellipse', { cx: x + lean, cy: -hh - 6, rx: 4, ry: 12, fill: '#b89a6a', transform: `rotate(${f1(lean)} ${f1(x + lean)} ${f1(-hh - 6)})` }, i);
      else { const lf = S.place(g(i), { x: x + lean * 0.5, y: -hh * 0.5, r: k < 3 ? -140 : -40 }); el('path', { d: 'M 0,0 C 10,-3 24,-3 34,2 C 24,1 10,2 0,0 Z', fill: '#7a9a50' }, lf); }
    }
    return s;
  };
  B.lilypad = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, r = o.rad || 30;
    el('path', { d: `M 0,0 L ${r * 0.95},${-r * 0.12} A ${r},${r * 0.36} 0 1,0 ${r * 0.95},${r * 0.12} Z`, fill: '#4f9a4a', stroke: '#2c6a2c', 'stroke-width': 2 }, i);
    return s;
  };
  // 地衣（附著在岩石上）
  B.lichenRock = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, w = o.w || 200;
    el('path', { d: `M ${-w / 2},0 L ${-w * 0.47},${-w * 0.12} L ${-w * 0.36},${-w * 0.27} L ${-w * 0.18},${-w * 0.34} L ${-w * 0.02},${-w * 0.4} L ${w * 0.16},${-w * 0.36} L ${w * 0.3},${-w * 0.3} L ${w * 0.42},${-w * 0.16} L ${w / 2},0 Z`, fill: '#7f8a90', stroke: '#4a5458', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, i);
    el('path', { d: `M ${-w * 0.18},${-w * 0.34} L ${-w * 0.1},${-w * 0.12} L ${-w * 0.2},0 M ${w * 0.16},${-w * 0.36} L ${w * 0.2},${-w * 0.14} L ${w * 0.3},${-w * 0.3}`, fill: 'none', stroke: '#5f6a70', 'stroke-width': 2 }, i);
    el('path', { d: `M ${-w * 0.36},${-w * 0.12} C ${-w * 0.3},${-w * 0.28} ${-w * 0.1},${-w * 0.34} ${w * 0.1},${-w * 0.32}`, fill: 'none', stroke: '#a8b2b8', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }, i);
    const rnd = S.rng(o.seed || 6);
    [[-0.25, -0.2, 0.13], [0.05, -0.28, 0.11], [0.28, -0.14, 0.1], [-0.05, -0.1, 0.08], [0.18, -0.3, 0.07]].forEach(([x, y, r]) => {
      el('path', { d: S.smoothPath(S.blobPts(x * w, y * w, r * w, r * w * 0.7, 40, [[9, 0.16, rnd() * 6], [5, 0.08, rnd() * 6]])), fill: '#b5c98a', stroke: '#7a9a5a', 'stroke-width': 1.5 }, i);
      el('path', { d: S.smoothPath(S.blobPts(x * w, y * w, r * w * 0.5, r * w * 0.35, 30, [[7, 0.15, rnd() * 6]])), fill: '#cfe0a8' }, i);
    });
    return s;
  };
  // 豆科植物：上面是三出複葉，下面的根有根瘤
  B.legume = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner;
    el('path', { d: 'M 0,0 C -2,-30 2,-60 0,-96', fill: 'none', stroke: '#5a8a3a', 'stroke-width': 4, 'stroke-linecap': 'round' }, i);
    const trif = (x, y, r) => {
      const t = S.place(g(i), { x, y, r });
      el('line', { x1: 0, y1: 0, x2: 22, y2: 0, stroke: '#5a8a3a', 'stroke-width': 2.5 }, t);
      [[22, 0, 0], [20, 0, -55], [20, 0, 55]].forEach(([lx, ly, a]) => { const l = S.place(g(t), { x: lx, y: ly, r: a }); el('path', { d: 'M 0,0 C 6,-9 22,-9 28,0 C 22,9 6,9 0,0 Z', fill: '#62ad4e', stroke: '#356a2c', 'stroke-width': 1.3 }, l); el('line', { x1: 2, y1: 0, x2: 25, y2: 0, stroke: '#a8e39a', 'stroke-width': 1 }, l); });
    };
    trif(0, -40, -40); trif(0, -64, -140); trif(0, -94, -90);
    const roots = ['M 0,0 L 0,90', 'M 0,18 C -16,30 -34,44 -48,66', 'M 0,30 C 18,42 34,56 46,78', 'M 0,52 C -12,62 -22,74 -28,92', 'M 0,62 C 10,72 18,82 22,96'];
    roots.forEach((d) => el('path', { d, fill: 'none', stroke: '#d8c49a', 'stroke-width': 3, 'stroke-linecap': 'round' }, i));
    [[-20, 34], [-40, 56], [24, 46], [40, 70], [0, 44], [-22, 78], [16, 84], [0, 74], [-10, 26]].forEach(([x, y], k) => el('circle', { cx: x, cy: y, r: 4.5 + (k % 3), fill: '#e2b48e', stroke: '#9a6a4a', 'stroke-width': 1.3 }, i));
    return s;
  };
  // 菟絲子纏在寄主植物上：寄主是綠色的莖和葉，菟絲子是黃橙色的細莖（幾乎沒有葉綠素）
  B.dodderHost = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, h = o.h || 200;
    el('path', { d: `M 0,0 C -4,${-h * 0.4} 4,${-h * 0.7} 0,${-h}`, fill: 'none', stroke: '#4f8a3a', 'stroke-width': 9, 'stroke-linecap': 'round' }, i);
    [[0.25, 1], [0.42, -1], [0.6, 1], [0.78, -1], [0.95, 1]].forEach(([k, sg]) => {
      const lw = 58;
      const lf = S.place(g(i), { x: 0, y: -h * k, r: sg > 0 ? -32 : -148 });
      el('path', { d: `M 0,0 C ${lw * 0.3},${-lw * 0.24} ${lw * 0.7},${-lw * 0.22} ${lw},0 C ${lw * 0.7},${lw * 0.22} ${lw * 0.3},${lw * 0.24} 0,0 Z`, fill: '#5faa48', stroke: '#356a2c', 'stroke-width': 1.5 }, lf);
      el('line', { x1: 3, y1: 0, x2: lw - 6, y2: 0, stroke: '#a8e39a', 'stroke-width': 1.2 }, lf);
    });
    // 菟絲子：繞著莖（前段畫在莖前面，後段淡一點）
    const coil = (y0, y1, ph) => {
      let back = '', front = '';
      const n = 60;
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n, a0 = ph + t0 * 6.283 * ((y1 - y0) / -40), a1 = ph + t1 * 6.283 * ((y1 - y0) / -40);
        const seg = `M ${f1(Math.sin(a0) * 9)},${f1(y0 + (y1 - y0) * t0 + Math.cos(a0) * 3)} L ${f1(Math.sin(a1) * 9)},${f1(y0 + (y1 - y0) * t1 + Math.cos(a1) * 3)} `;
        if (Math.cos(a0) > 0) front += seg; else back += seg;
      }
      return [back, front];
    };
    const [bk, fr] = coil(-h * 0.1, -h * 0.85, 0);
    el('path', { d: bk, fill: 'none', stroke: '#c88a20', 'stroke-width': 3, 'stroke-linecap': 'round' }, i);
    i.appendChild(i.firstChild); // 讓莖蓋在後段之上
    el('path', { d: fr, fill: 'none', stroke: '#f2b632', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, i);
    el('path', { d: `M 6,${-h * 0.5} C 40,${-h * 0.55} 60,${-h * 0.4} 70,${-h * 0.2} C 76,${-h * 0.1} 74,-10 80,0`, fill: 'none', stroke: '#f2b632', 'stroke-width': 3, 'stroke-linecap': 'round' }, i);
    el('path', { d: `M -6,${-h * 0.7} C -40,${-h * 0.72} -64,${-h * 0.6} -72,${-h * 0.45}`, fill: 'none', stroke: '#f2b632', 'stroke-width': 3, 'stroke-linecap': 'round' }, i);
    [[-72, -h * 0.45], [70, -h * 0.2], [10, -h * 0.3]].forEach(([x, y]) => { for (let k = 0; k < 5; k++) el('circle', { cx: x + Math.cos(k * 1.26) * 5, cy: y + Math.sin(k * 1.26) * 5, r: 3.4, fill: '#f6f1e2', stroke: '#c8b88a', 'stroke-width': 0.8 }, i); });
    return s;
  };
  // 山蘇（附生在樹幹上）：鳥巢狀的長帶形葉
  B.birdnestFern = (p, o = {}) => {
    const s = B.base(p, o), i = s.inner, L = o.len || 110;
    const angs = [-170, -150, -128, -108, -90, -72, -52, -30, -10];
    angs.forEach((a, k) => {
      const lf = S.place(g(i), { x: 0, y: 0, r: a });
      const l = L * (0.75 + (k % 3) * 0.12), w = 26;
      el('path', { d: `M 0,${f1(-w * 0.2)} C ${f1(l * 0.3)},${f1(-w * 0.62)} ${f1(l * 0.8)},${f1(-w * 0.58)} ${f1(l * 0.96)},${f1(-w * 0.22)} C ${f1(l * 1.02)},${f1(-w * 0.02)} ${f1(l * 0.98)},${f1(w * 0.18)} ${f1(l * 0.9)},${f1(w * 0.3)} C ${f1(l * 0.6)},${f1(w * 0.5)} ${f1(l * 0.3)},${f1(w * 0.48)} 0,${f1(w * 0.2)} Z`, fill: k % 2 ? '#7cc84e' : '#62b240', stroke: '#2f6a28', 'stroke-width': 1.5 }, lf);
      el('path', { d: `M 4,0 C ${f1(l * 0.4)},-2 ${f1(l * 0.7)},-2 ${f1(l * 0.9)},0`, fill: 'none', stroke: '#2a3a1a', 'stroke-width': 2 }, lf);
    });
    el('ellipse', { cx: 0, cy: 6, rx: 20, ry: 12, fill: '#6b4a2e', stroke: '#3e2a18', 'stroke-width': 1.5 }, i);
    for (let k = 0; k < 6; k++) el('line', { x1: -14 + k * 5, y1: 0, x2: -16 + k * 6, y2: 14, stroke: '#4a321e', 'stroke-width': 1.2 }, i);
    return s;
  };

  // ---------- 地面、水面 ----------
  B.ground = (p, x, y, w, h, { fill = '#3a2c1e', top = '#5a7a3a', grass = true, seed = 1 } = {}) => {
    const gg = g(p);
    el('rect', { x, y, width: w, height: h, fill }, gg);
    if (grass) {
      el('rect', { x, y: y - 3, width: w, height: 8, fill: top }, gg);
      const rnd = S.rng(seed);
      for (let k = 0; k < w / 14; k++) { const gx = x + k * 14 + rnd() * 8; el('path', { d: `M ${f1(gx)},${y} l ${f1(-2 + rnd() * 2)},${f1(-6 - rnd() * 6)} l 3,${f1(6 + rnd() * 2)}`, fill: top }, gg); }
    }
    return gg;
  };
  B.water = (p, x, y, w, h, { fill = 'rgba(95,184,255,0.22)', line = '#8fd0ff' } = {}) => {
    const gg = g(p);
    el('rect', { x, y, width: w, height: h, fill }, gg);
    let d = `M ${x},${y}`;
    for (let k = 0; k + 30 <= w; k += 30) d += ` q 7.5,-4 15,0 q 7.5,4 15,0`;
    el('path', { d, fill: 'none', stroke: line, 'stroke-width': 2.5 }, gg);
    return gg;
  };
})();
