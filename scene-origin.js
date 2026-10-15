/* 1-2 生命的起源與生物圈：原始地球、有機物與無機物、米勒的模擬實驗、巴斯德的鵝頸瓶、最早的生命（深海熱泉）、地球適合生物生存的原因、生物圈 */
(() => {
  const { el, g, text, C } = S;
  let uid = 0;
  const nid = (k) => `og${k}${uid++}`;
  const defs = (p) => el('defs', {}, p);
  // 漸層：stops = [[位置, 顏色, 透明度?]…]
  const lin = (p, stops, x2 = 0, y2 = 1, extra = {}) => {
    const id = nid('l');
    const gr = el('linearGradient', { id, x1: 0, y1: 0, x2, y2, ...extra }, defs(p));
    stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, gr));
    return `url(#${id})`;
  };
  const rad = (p, stops, { cx = 0.5, cy = 0.5, r = 0.5 } = {}) => {
    const id = nid('r');
    const gr = el('radialGradient', { id, cx, cy, r }, defs(p));
    stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, gr));
    return `url(#${id})`;
  };
  const clip = (p, d) => { const id = nid('c'); el('path', { d }, el('clipPath', { id }, defs(p))); return `url(#${id})`; };
  const rectD = (x, y, w, h, r = 0) => `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
  const circD = (cx, cy, r) => `M ${cx - r},${cy} A ${r},${r} 0 1,0 ${cx + r},${cy} A ${r},${r} 0 1,0 ${cx - r},${cy} Z`;
  const P = (p, d, fill, stroke = 'none', sw = 2, extra = {}) => el('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...extra }, p);
  const L = (p, d, stroke, sw = 2, extra = {}) => P(p, d, 'none', stroke, sw, extra);
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const T = (p, x, y, s, size = 24, fill = C.ink, extra = {}) => text(p, x, y, s, { 'font-size': size, fill, ...extra });
  const TM = (p, x, y, s, size = 24, fill = C.ink, extra = {}) => T(p, x, y, s, size, fill, { 'text-anchor': 'middle', ...extra });
  const B = { 'font-weight': 700 };
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const card = (p, x, y, w, h, extra = {}) => el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME, ...extra }, p);
  const f1 = (v) => v.toFixed(1);
  // 點列 → 平滑曲線（第三個值為 1 的點保持尖角）
  const curve = (pts, closed = true, k = 1 / 6) => {
    const n = pts.length;
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    const m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const p0 = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
      const a = p1[2] === 1 ? 0 : k, b = p2[2] === 1 ? 0 : k;
      d += `C${f1(p1[0] + (p2[0] - p0[0]) * a)},${f1(p1[1] + (p2[1] - p0[1]) * a)} ${f1(p2[0] - (p3[0] - p1[0]) * b)},${f1(p2[1] - (p3[1] - p1[1]) * b)} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  };
  // 一團團的外緣（雲、煙）：頂點順時針排列，相鄰頂點之間畫向外鼓起的圓弧；第三個值為 'L' 的頂點用直線連過去
  const lobes = (pts, k = 0.6) => {
    let d = `M ${f1(pts[0][0])},${f1(pts[0][1])}`;
    for (let i = 1; i <= pts.length; i++) {
      const a = pts[i - 1], b = pts[i % pts.length];
      if (b[2] === 'L') { d += ` L ${f1(b[0])},${f1(b[1])}`; continue; }
      const r = Math.hypot(b[0] - a[0], b[1] - a[1]) * (typeof b[3] === 'number' ? b[3] : k);
      d += ` A ${f1(r)},${f1(r)} 0 0 1 ${f1(b[0])},${f1(b[1])}`;
    }
    return d + ' Z';
  };
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.6, y2: y2 - Math.sin(a) * head * 0.6, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  // 折線上依比例取點（t：0～1）
  const polyAt = (pts) => {
    const Ls = [0];
    for (let i = 1; i < pts.length; i++) Ls.push(Ls[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = Ls[Ls.length - 1];
    return (t) => {
      const s = S.clamp(t) * tot;
      let i = 1;
      while (i < Ls.length - 1 && Ls[i] < s) i++;
      const f = (s - Ls[i - 1]) / (Ls[i] - Ls[i - 1] || 1);
      return [S.lerp(pts[i - 1][0], pts[i][0], f), S.lerp(pts[i - 1][1], pts[i][1], f)];
    };
  };
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), Bc = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * S.clamp(t))).join(',')})`; };
  const put = (e, x, y, op = 1) => { e.setAttribute('cx', f1(x)); e.setAttribute('cy', f1(y)); e.style.opacity = op; };
  const badge = (p, x, y, n, col = C.hi) => { const b = g(p); el('circle', { cx: x, cy: y, r: 19, fill: col, stroke: '#0d1822', 'stroke-width': 2 }, b); TM(b, x, y + 8, String(n), 22, '#0d1822', B); return b; };
  // 波浪線（紫外線）
  const wavy = (x1, y1, x2, y2, amp = 6, wl = 22) => {
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, n = Math.max(8, Math.round(len / 4));
    let d = `M ${x1},${y1}`;
    for (let i = 1; i <= n; i++) { const s = (i / n) * len, o = Math.sin((s / wl) * Math.PI * 2) * amp * Math.min(1, (len - s) / 24); d += ` L ${f1(x1 + ux * s - uy * o)},${f1(y1 + uy * s + ux * o)}`; }
    return d;
  };
  const uvRay = (p, x1, y1, x2, y2, col = '#c79bff', w = 3.5) => {
    const rg = g(p), a = Math.atan2(y2 - y1, x2 - x1), hd = 13;
    const path = L(rg, wavy(x1, y1, x2 - Math.cos(a) * hd * 0.7, y2 - Math.sin(a) * hd * 0.7), col, w);
    P(rg, `M ${x2},${y2} L ${f1(x2 - hd * Math.cos(a - 0.5))},${f1(y2 - hd * Math.sin(a - 0.5))} L ${f1(x2 - hd * Math.cos(a + 0.5))},${f1(y2 - hd * Math.sin(a + 0.5))} Z`, col);
    rg.path = path;
    return rg;
  };
  // 閃電：鋸齒折線
  const boltPts = (x1, y1, x2, y2, seed, jag = 16, n = 8) => {
    const r = S.rng(seed), pts = [[x1, y1]];
    for (let i = 1; i < n; i++) { const t = i / n; pts.push([S.lerp(x1, x2, t) + (r() - 0.5) * 2 * jag, S.lerp(y1, y2, t) + (r() - 0.5) * jag * 0.5]); }
    pts.push([x2, y2]);
    return pts;
  };
  const ptsD = (pts) => 'M ' + pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' L ');
  const bolt = (p, x1, y1, x2, y2, seed, jag = 16, n = 8, branch = null) => {
    const bg = g(p), main = boltPts(x1, y1, x2, y2, seed, jag, n);
    const paths = [ptsD(main)];
    if (branch) { const [k, dx, dy] = branch, s = main[k]; paths.push(ptsD(boltPts(s[0], s[1], s[0] + dx, s[1] + dy, seed + 7, jag * 0.6, 4))); }
    paths.forEach((d, i) => L(bg, d, '#b9a8ff', i ? 7 : 11, { opacity: 0.4 }));
    paths.forEach((d, i) => L(bg, d, '#fffbea', i ? 2 : 3.4));
    return bg;
  };

  // ---------- 原子、分子（球棍模型的球） ----------
  const ATOM = { H: ['#f4f6f8', '#ffffff', '#aab4bc'], O: ['#e5534b', '#ffb3a8', '#8f241f'], C: ['#4b5259', '#a3adb6', '#22272c'], N: ['#4d7fe0', '#b4ccff', '#26458f'] };
  const atom = (p, x, y, r, k) => { const [c, h, d] = ATOM[k]; el('circle', { cx: x, cy: y, r, fill: rad(p, [[0, h], [0.5, c], [1, d]], { cx: 0.36, cy: 0.33, r: 0.75 }), stroke: 'rgba(0,0,0,0.35)', 'stroke-width': 1 }, p); };
  const MOL = {
    h2o: [['H', -19, 13, 10], ['H', 19, 13, 10], ['O', 0, 0, 16]],
    ch4: [['H', -19, -14, 10], ['H', 19, -14, 10], ['H', 0, 22, 10], ['C', 0, 0, 15], ['H', 11, 9, 10]],
    nh3: [['H', -21, 12, 10], ['H', 21, 12, 10], ['N', 0, -2, 16], ['H', 0, 21, 10]],
    h2: [['H', -9, 0, 12], ['H', 9, 0, 12]],
    o2: [['O', -11, 0, 14], ['O', 11, 0, 14]],
  };
  const molecule = (p, k) => { const c = g(p); MOL[k].forEach(([a, x, y, r]) => atom(c, x, y, r, a)); return c; };
  // 胺基酸（甘胺酸）的球棍模型
  function aminoAcid(p) {
    const c = g(p);
    const A = { N: [-40, 4], C1: [-12, -6], C2: [16, 4], O1: [22, -22], O2: [38, 18], HO: [54, 12], HN1: [-54, -10], HN2: [-50, 20], HC1: [-18, -26], HC2: [-2, 12] };
    [['N', 'C1'], ['C1', 'C2'], ['C2', 'O1'], ['C2', 'O2'], ['O2', 'HO'], ['N', 'HN1'], ['N', 'HN2'], ['C1', 'HC1'], ['C1', 'HC2']].forEach(([a, b]) => L(c, `M ${A[a][0]},${A[a][1]} L ${A[b][0]},${A[b][1]}`, '#cfd8dc', 4));
    L(c, `M ${A.C2[0] + 4},${A.C2[1] + 1} L ${A.O1[0] + 5},${A.O1[1] + 2}`, '#cfd8dc', 3);
    [['HN1', 'H', 6], ['HN2', 'H', 6], ['HC1', 'H', 6], ['HC2', 'H', 6], ['HO', 'H', 6], ['N', 'N', 10], ['C1', 'C', 10], ['C2', 'C', 10], ['O1', 'O', 10], ['O2', 'O', 10]].forEach(([k, a, r]) => atom(c, A[k][0], A[k][1], r, a));
    return c;
  }

  // ---------- 原始地球 ----------
  // 暴風雨的雲（底部平、上緣一團團）
  function stormCloud(p, x, y, w, h, seed, glow) {
    const r = S.rng(seed), n = Math.max(3, Math.round(w / (h * 0.85)));
    const pts = [[x, y - h * 0.18]];
    for (let i = 1; i < n; i++) pts.push([x + (w * i) / n + (r() - 0.5) * 10, y - h * (0.5 + 0.45 * Math.sin((Math.PI * i) / n)) * (0.85 + 0.3 * r())]);
    pts.push([x + w, y - h * 0.12], [x + w * 0.62, y + h * 0.1, 'L'], [x + w * 0.3, y + h * 0.06, 'L']);
    const d = lobes(pts, 0.62), c = g(p);
    P(c, d, lin(c, [[0, '#4a4352'], [0.6, '#2e2934'], [1, '#1d1a22']]));
    const inside = g(c, { 'clip-path': clip(c, d) });
    if (glow) el('ellipse', { cx: glow, cy: y + h * 0.1, rx: w * 0.4, ry: h * 0.5, fill: rad(c, [[0, '#ff7a3a', 0.45], [1, '#ff7a3a', 0]]) }, inside);
    el('ellipse', { cx: x + w * 0.4, cy: y - h * 0.62, rx: w * 0.35, ry: h * 0.22, fill: '#6a6070', opacity: 0.35 }, inside);
    P(c, d, 'none', '#5a5062', 1.6, { opacity: 0.6 });
    return c;
  }
  // 火山（凹形的山坡、火山口、受光面與背光面）
  function volcano(p, cx, base, peak, hw, cw, seed) {
    const v = g(p), H = base - peak, lx = cx - hw, rx = cx + hw, cl = cx - cw / 2, cr = cx + cw / 2;
    const d = `M ${lx},${base} C ${lx + hw * 0.5},${base - H * 0.1} ${cl - hw * 0.1},${peak + H * 0.32} ${cl},${peak} C ${cl + cw * 0.25},${peak + 7} ${cr - cw * 0.25},${peak + 7} ${cr},${peak} C ${cr + hw * 0.1},${peak + H * 0.32} ${rx - hw * 0.5},${base - H * 0.1} ${rx},${base} Z`;
    P(v, d, '#4a3732');
    const inside = g(v, { 'clip-path': clip(v, d) });
    P(inside, `M ${cx + cw * 0.15},${peak} C ${cx + hw * 0.05},${peak + H * 0.4} ${cx + hw * 0.12},${base - H * 0.2} ${cx + hw * 0.2},${base + 4} L ${rx + 4},${base + 4} L ${rx + 4},${peak - 4} Z`, '#271c1b', 'none', 0, { opacity: 0.8 });
    P(inside, `M ${lx},${base} C ${lx + hw * 0.4},${base - H * 0.12} ${cl - hw * 0.05},${peak + H * 0.4} ${cl + 4},${peak + 4} C ${cl - hw * 0.02},${peak + H * 0.5} ${lx + hw * 0.6},${base - H * 0.05} ${lx + hw * 0.72},${base} Z`, '#6e5246', 'none', 0, { opacity: 0.6 });
    const r = S.rng(seed);
    for (let i = 0; i < 11; i++) {
      const t = (i + 0.5) / 11, x0 = S.lerp(cl + 4, cr - 4, t), xb = S.lerp(lx + hw * 0.2, rx - hw * 0.2, t) + (r() - 0.5) * 26;
      L(inside, `M ${f1(x0)},${peak + 6} C ${f1(S.lerp(x0, xb, 0.25))},${f1(peak + H * 0.35)} ${f1(S.lerp(x0, xb, 0.75))},${f1(peak + H * 0.7)} ${f1(xb)},${base}`, t < 0.45 ? '#86685a' : '#1c1414', 1.8, { opacity: 0.5 });
    }
    // 山腳的碎石帶
    el('rect', { x: lx, y: base - H * 0.08, width: hw * 2, height: H * 0.1, fill: lin(inside, [[0, '#2a1e1c', 0], [1, '#2a1e1c', 0.7]]) }, inside);
    el('ellipse', { cx, cy: peak + 3, rx: cw * 0.62, ry: 9, fill: rad(v, [[0, '#fff0a0'], [0.45, '#ff9a3a'], [1, '#c8381a', 0]]) }, v);
    return v;
  }
  // 熔岩流（外面一層紅光，中間是亮黃）
  function lavaFlow(p, pts) {
    const lg = g(p), d = curve(pts, false);
    const glow = L(lg, d, '#ff5a1f', 13, { opacity: 0.35 });
    const core = L(lg, d, '#ffa63c', 5.5);
    const hot = L(lg, d, '#fff0b0', 1.8, { opacity: 0.9 });
    lg.parts = [glow, core, hot];
    return lg;
  }
  // 火山灰的煙柱（原點在火山口，往上長）
  function ashPlume(p) {
    const c = g(p);
    const pts = [[-22, 0], [-34, -45], [-58, -92], [-92, -136], [-118, -178], [-96, -224], [-48, -250], [10, -258], [66, -240], [112, -204], [122, -160], [96, -116], [64, -72], [38, -30], [24, 0], [0, 4, 'L']];
    const d = lobes(pts, 0.62);
    P(c, d, lin(c, [[0, '#5a4e52'], [0.55, '#3a3034'], [1, '#2a2124']]));
    const inside = g(c, { 'clip-path': clip(c, d) });
    P(inside, lobes([[-84, -150], [-70, -196], [-30, -222], [10, -226], [-10, -190], [-40, -160]], 0.6), '#7a6c70', 'none', 0, { opacity: 0.35 });
    P(inside, lobes([[-44, -70], [-40, -110], [-10, -124], [0, -96], [-20, -70]], 0.6), '#7a6c70', 'none', 0, { opacity: 0.25 });
    el('ellipse', { cx: 0, cy: -10, rx: 70, ry: 70, fill: rad(c, [[0, '#ff7a3a', 0.7], [1, '#ff7a3a', 0]]) }, inside);
    P(c, d, 'none', '#7a6a6a', 1.6, { opacity: 0.55 });
    return c;
  }
  // 水蒸氣
  const wisp = (p) => { const w = g(p); L(w, 'M 0,0 C -12,-18 10,-34 0,-54 C -9,-70 8,-84 0,-102', '#e8eef2', 12, { opacity: 0.12 }); L(w, 'M 0,0 C -12,-18 10,-34 0,-54 C -9,-70 8,-84 0,-102', '#ffffff', 4, { opacity: 0.22 }); return w; };

  // ---------- 有機物、無機物的小圖示（原點在中央，約 120 寬） ----------
  function bread(p) {
    const c = g(p);
    P(c, 'M -48,52 C -50,30 -48,8 -46,-12 C -66,-16 -70,-48 -46,-60 C -26,-72 26,-72 46,-60 C 70,-48 66,-16 46,-12 C 48,8 50,30 48,52 C 20,58 -20,58 -48,52 Z', '#c27a34', '#7a4718', 2.5);
    P(c, 'M -39,44 C -41,26 -39,6 -37,-17 C -55,-21 -58,-45 -40,-53 C -22,-63 22,-63 40,-53 C 58,-45 55,-21 37,-17 C 39,6 41,26 39,44 C 16,49 -16,49 -39,44 Z', lin(c, [[0, '#fbe9c4'], [1, '#efcf8e']]));
    const r = S.rng(5);
    for (let i = 0; i < 24; i++) el('ellipse', { cx: f1(-30 + r() * 60), cy: f1(-44 + r() * 82), rx: f1(1.5 + r() * 2.5), ry: f1(1 + r() * 1.5), fill: '#d6ad66', opacity: 0.7 }, c);
    L(c, 'M -42,-62 C -20,-70 20,-70 42,-62', '#e6a560', 3, { opacity: 0.8 });
    return c;
  }
  function protein(p) {
    const c = g(p);
    const e = at(c, -24, -18);
    P(e, 'M 0,-38 C 20,-38 31,-8 31,12 C 31,30 17,42 0,42 C -17,42 -31,30 -31,12 C -31,-8 -20,-38 0,-38 Z', rad(e, [[0, '#fffaf0'], [0.6, '#f4e2c6'], [1, '#d4b78e']], { cx: 0.38, cy: 0.35, r: 0.75 }), '#a88a62', 2);
    el('ellipse', { cx: -10, cy: -14, rx: 6, ry: 10, fill: '#fff', opacity: 0.75, transform: 'rotate(20 -10 -14)' }, e);
    const m = at(c, 18, 26);
    P(m, 'M -46,-4 C -48,-24 -22,-34 4,-31 C 30,-29 50,-18 48,2 C 46,20 26,30 0,29 C -26,29 -44,16 -46,-4 Z', '#f3e2d2', '#a8786a', 2);
    P(m, 'M -38,-3 C -39,-19 -18,-26 3,-24 C 25,-22 41,-14 39,1 C 37,15 21,22 0,22 C -21,22 -36,12 -38,-3 Z', rad(m, [[0, '#dc6a72'], [1, '#a3323d']]));
    ['M -26,-8 C -14,-14 -2,-6 10,-12', 'M -18,8 C -6,2 8,10 22,2', 'M 14,-18 C 20,-12 28,-10 32,-4'].forEach((d) => L(m, d, '#f6d8d0', 1.6, { opacity: 0.75 }));
    return c;
  }
  const DROP = 'M 0,-54 C 12,-34 36,-12 36,14 C 36,36 20,50 0,50 C -20,50 -36,36 -36,14 C -36,-12 -12,-34 0,-54 Z';
  function drop(p, c1, c2, edge) {
    const c = g(p);
    P(c, DROP, rad(c, [[0, c1], [1, c2]], { cx: 0.42, cy: 0.58, r: 0.7 }), edge, 2.5);
    L(c, 'M -20,10 C -22,-4 -15,-17 -8,-26', '#ffffff', 5, { opacity: 0.6 });
    el('circle', { cx: -15, cy: 24, r: 4, fill: '#fff', opacity: 0.5 }, c);
    return c;
  }
  function bubble(p, x, y, r, lab, col, size) {
    const c = g(p);
    el('circle', { cx: x, cy: y, r, fill: rad(c, [[0, col, 0.05], [0.8, col, 0.18], [1, col, 0.45]]), stroke: col, 'stroke-width': 2.5 }, c);
    L(c, `M ${x - r * 0.62},${y - r * 0.3} A ${r * 0.7},${r * 0.7} 0 0 1 ${x - r * 0.2},${y - r * 0.68}`, '#ffffff', 3.5, { opacity: 0.7 });
    TM(c, x, y + size * 0.36, lab, size, C.ink, { class: 'mono', 'font-weight': 700 });
    return c;
  }
  function gases(p) { const c = g(p); bubble(c, 16, 14, 40, 'CO₂', '#b8c4cc', 22); bubble(c, -34, -34, 27, 'O₂', '#ff8a8a', 20); return c; }
  function cube(p, x, y, s) {
    const h = s * 0.5, w = s * 0.87, E = '#8fa2b0';
    P(p, `M ${x},${y - s} L ${x + w},${y - h} L ${x},${y} L ${x - w},${y - h} Z`, '#ffffff', E, 1.2);
    P(p, `M ${x - w},${y - h} L ${x},${y} L ${x},${y + s} L ${x - w},${y + h} Z`, '#dde6ec', E, 1.2);
    P(p, `M ${x + w},${y - h} L ${x},${y} L ${x},${y + s} L ${x + w},${y + h} Z`, '#b3c3cf', E, 1.2);
  }
  function salt(p) {
    const c = g(p);
    [[-4, -22, 22], [32, -12, 15], [-34, -8, 14], [-20, 26, 21], [22, 28, 22]].forEach(([x, y, s]) => cube(c, x, y, s));
    [[-50, 46], [50, 50], [4, 52], [-44, 20]].forEach(([x, y]) => cube(c, x, y, 4));
    return c;
  }

  // ---------- 實驗器材 ----------
  const GLASS = '#a7d3ea', GLASS_IN = '#16303f';
  // 酒精燈（原點在燈芯頂端；回傳 flame 群組，讓火焰可以閃動）
  function lamp(p) {
    const c = g(p);
    const body = 'M -34,62 C -42,50 -42,30 -30,22 C -22,16 -12,15 -9,10 L 9,10 C 12,15 22,16 30,22 C 42,30 42,50 34,62 Z';
    P(c, body, 'rgba(160,215,240,0.16)', GLASS, 2.5);
    const inner = g(c, { 'clip-path': clip(c, body) });
    el('rect', { x: -44, y: 36, width: 88, height: 30, fill: 'rgba(120,190,230,0.35)' }, inner);
    L(c, 'M -26,30 C -32,38 -32,48 -28,56', '#ffffff', 3, { opacity: 0.45 });
    el('rect', { x: -10, y: 1, width: 20, height: 10, rx: 2, fill: '#8a9aa6', stroke: '#5a6a76', 'stroke-width': 1.2 }, c);
    L(c, 'M 0,2 L 0,-4', '#e8e0c8', 3);
    const fl = g(c);
    P(fl, 'M 0,-50 C 9,-32 15,-17 13,-6 C 11,2 5,6 0,6 C -5,6 -11,2 -13,-6 C -15,-17 -9,-32 0,-50 Z', rad(fl, [[0, '#ffe680'], [0.6, '#ff9a2a'], [1, '#ff5a1f', 0.6]], { cx: 0.5, cy: 0.75, r: 0.7 }));
    P(fl, 'M 0,-28 C 5,-18 7,-10 6,-4 C 5,1 3,3 0,3 C -3,3 -5,1 -6,-4 C -7,-10 -5,-18 0,-28 Z', '#fff7c8', 'none', 0, { opacity: 0.9 });
    c.flame = fl;
    return c;
  }
  const flicker = (fl, u, ph = 0) => { const k = Math.sin(u * 61 + ph) * 0.5 + Math.sin(u * 97 + ph * 2) * 0.5; fl.setAttribute('transform', `scale(${(1 + 0.05 * k).toFixed(3)},${(1 + 0.1 * k).toFixed(3)})`); };

  // ---------- 鵝頸瓶（原點在瓶身中央；瓶頸往上、往右彎下再往上，開口朝右上） ----------
  const NECK = [[0, -150], [8, -188], [34, -207], [70, -204], [100, -180], [124, -142], [146, -120], [168, -122], [188, -146], [206, -174], [216, -190]];
  function swanFlask(p, broken) {
    const f = g(p), R = 90;
    const full = curve([[0, -60], ...NECK], false), stubD = 'M 0,-60 L 0,-140', swanD = curve([[0, -138], ...NECK], false);
    const tubeD = broken ? stubD : full;
    // 外層（玻璃）→ 內層（瓶內）→ 肉湯 → 反光；瓶頸和瓶身合成一個輪廓
    L(f, tubeD, GLASS, 28, { 'stroke-linecap': 'butt' });
    el('circle', { cx: 0, cy: 0, r: R + 4, fill: GLASS }, f);
    L(f, tubeD, GLASS_IN, 20, { 'stroke-linecap': 'butt' });
    el('circle', { cx: 0, cy: 0, r: R, fill: GLASS_IN }, f);
    const inD = circD(0, 0, R - 1);
    const brothG = g(f, { 'clip-path': clip(f, inD) });
    f.broth = el('rect', { x: -R, y: 8, width: R * 2, height: R, fill: '#d9a24a', opacity: 0.85 }, brothG);
    el('ellipse', { cx: 0, cy: 8, rx: R - 4, ry: 4, fill: '#f2cf86', opacity: 0.7 }, brothG);
    f.inside = brothG;
    L(f, 'M -64,-38 A 76,76 0 0 1 -22,-74', '#ffffff', 5, { opacity: 0.45 });
    el('circle', { cx: 46, cy: -46, r: 5, fill: '#fff', opacity: 0.35 }, f);
    if (broken) {
      // 斷口
      P(f, 'M -14,-140 L -8,-146 L -3,-139 L 3,-147 L 9,-140 L 14,-144 L 14,-138 L -14,-138 Z', GLASS, 'none', 0);
      const sw = g(f);
      L(sw, swanD, GLASS, 28, { 'stroke-linecap': 'butt' });
      L(sw, swanD, GLASS_IN, 20, { 'stroke-linecap': 'butt' });
      L(sw, swanD, '#ffffff', 2.5, { opacity: 0.25, transform: 'translate(-6,-2)' });
      L(sw, 'M 205,-200 L 228,-180', GLASS, 4);
      f.swan = sw;
      L(f, 'M -6,-70 L -6,-132', '#ffffff', 2.5, { opacity: 0.3 });
    } else {
      L(f, full, '#ffffff', 2.5, { opacity: 0.25, transform: 'translate(-6,-2)' });
      L(f, 'M 205,-200 L 228,-180', GLASS, 4);
    }
    return f;
  }

  // ---------- 深海熱泉 ----------
  // 熱泉的煙囪：底部是寬寬的礦物堆，往上變成粗糙、凹凸不平的尖塔（礦物一層層沉積）
  function chimney(p, cx, base, top, wb, wt, seed) {
    const c = g(p), r = S.rng(seed), H = base - top, Lp = [], Rp = [];
    const hwAt = (t) => wt / 2 + (wb * 0.9 - wt / 2) * Math.pow(1 - t, 2.4);
    // 凹凸不規則：間距、鼓起的大小都不一樣，有些地方是直的
    const side = (arr, sg) => {
      for (let y = base - 8 - r() * 10; y > top + 8; y -= 9 + r() * 22) {
        const t = (base - y) / H, k = r() < 0.3 ? 'L' : 0.52 + r() * 0.4;
        arr.push([cx + sg * (hwAt(t) * (1 + (r() - 0.35) * 0.24) + (r() < 0.12 ? 5 : 0)), y, k === 'L' ? 'L' : undefined, k === 'L' ? undefined : k]);
      }
    };
    side(Lp, -1); side(Rp, 1);
    const pts = [[cx - wb * 1.2, base + 8], [cx - wb * 1.0, base - 4], ...Lp, [cx - wt * 0.52, top + 2], [cx - wt * 0.44, top - 7, undefined, 0.55], [cx + wt * 0.44, top - 7, 'L'], [cx + wt * 0.52, top + 2, undefined, 0.55], ...Rp.reverse(), [cx + wb * 1.0, base - 4], [cx + wb * 1.2, base + 8], [cx, base + 12, 'L']];
    const d = lobes(pts, 0.64);
    P(c, d, lin(c, [[0, '#4e3c32'], [0.35, '#33292a'], [0.75, '#1c1617'], [1, '#110d0e']], 1, 0));
    const inside = g(c, { 'clip-path': clip(c, d) });
    // 一層層的礦物沉積：鐵鏽色、黑色的橫紋
    for (let i = 0; i < Math.round(H / 22); i++) {
      const y = base - 10 - i * 22 - r() * 8, w = wb * 1.3;
      L(inside, `M ${f1(cx - w)},${f1(y)} C ${f1(cx - w * 0.3)},${f1(y - 4 + r() * 8)} ${f1(cx + w * 0.3)},${f1(y - 4 + r() * 8)} ${f1(cx + w)},${f1(y + (r() - 0.5) * 6)}`, i % 2 ? '#0c0909' : '#8a5428', i % 2 ? 3 : 4 + r() * 3, { opacity: i % 2 ? 0.55 : 0.32 });
    }
    for (let i = 0; i < 40; i++) el('circle', { cx: f1(cx + (r() - 0.5) * wb * 1.6), cy: f1(base - r() * H), r: f1(0.8 + r() * 1.8), fill: r() < 0.5 ? '#c8904a' : '#080606', opacity: 0.5 }, inside);
    // 噴口附近受熱水照亮的一側、底部細菌的白色菌毯
    [[-0.7, 6], [0.6, 10]].forEach(([k, dy]) => el('ellipse', { cx: f1(cx + k * wb), cy: base - dy, rx: f1(wb * 0.3), ry: 4.5, fill: '#efe8c4', opacity: 0.35 }, inside));
    P(c, d, 'none', '#5e4a3e', 1.4, { opacity: 0.6 });
    el('ellipse', { cx, cy: top - 6, rx: wt * 0.3, ry: 4, fill: '#0a0606' }, c);
    el('ellipse', { cx, cy: top - 8, rx: wt * 0.8, ry: 15, fill: rad(c, [[0, '#ff9a4a', 0.6], [1, '#ff6a2a', 0]]) }, c);
    return c;
  }
  // 黑煙（原點在噴口）：往上越來越寬、越來越淡，被海流吹得稍微彎向右邊
  function smoke(p, w0, h, bend, seed) {
    const c = g(p), r = S.rng(seed), n = 8, Lp = [], Rp = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n, y = -h * t, mx = bend * t * t, hw = (w0 / 2) * (1 + 1.7 * Math.pow(t, 0.85));
      Lp.push([mx - hw * (0.92 + r() * 0.2), y]);
      Rp.push([mx + hw * (0.92 + r() * 0.2), y]);
    }
    const pts = [[-w0 * 0.42, 0], ...Lp, [bend - w0 * 0.4, -h * 1.06], [bend + w0 * 0.5, -h * 1.05], ...Rp.reverse(), [w0 * 0.42, 0], [0, 2, 'L']];
    const d = lobes(pts, 0.62);
    P(c, d, lin(c, [[0, '#4a4346', 0], [0.25, '#3a3436', 0.55], [0.6, '#262224', 0.88], [1, '#171415', 0.97]]));
    const inside = g(c, { 'clip-path': clip(c, d) });
    [[0.3, -0.25], [0.55, 0.2], [0.78, -0.15]].forEach(([t, dx]) => {
      const y = -h * t, x = bend * t * t + dx * w0, rr = w0 * 0.45 * (1 + 1.4 * t);
      P(inside, lobes([[x - rr, y + rr * 0.3], [x - rr * 0.7, y - rr * 0.5], [x, y - rr * 0.7], [x + rr * 0.6, y - rr * 0.4], [x + rr * 0.8, y + rr * 0.3], [x, y + rr * 0.5, 'L']], 0.6), '#5a5054', 'none', 0, { opacity: 0.3 * (1 - t * 0.6) });
    });
    L(inside, `M ${f1(-w0 * 0.1)},-6 C ${f1(-w0 * 0.4)},${f1(-h * 0.3)} ${f1(bend * 0.2 + w0 * 0.2)},${f1(-h * 0.55)} ${f1(bend * 0.6)},${f1(-h * 0.9)}`, '#6a6064', 2.5, { opacity: 0.35 });
    el('ellipse', { cx: 0, cy: -10, rx: w0 * 1.1, ry: 24, fill: rad(c, [[0, '#ff8a3a', 0.45], [1, '#ff8a3a', 0]]) }, inside);
    return c;
  }
  function crab(p) {
    const c = g(p);
    for (let i = 0; i < 4; i++) [-1, 1].forEach((s) => L(c, `M ${s * 10},${2 + i * 3} C ${s * 20},${-3 + i * 4} ${s * 27},${3 + i * 5} ${s * 31},${12 + i * 4}`, '#cfc8bc', 2.4));
    [-1, 1].forEach((s) => {
      L(c, `M ${s * 10},-5 C ${s * 17},-12 ${s * 21},-15 ${s * 22},-20`, '#d8d2c6', 3.2);
      P(c, `M ${s * 18},-20 C ${s * 15},-31 ${s * 28},-35 ${s * 31},-26 C ${s * 28},-23 ${s * 25},-23 ${s * 23},-19 Z`, '#ece8e0', '#8f897f', 1.2);
    });
    P(c, 'M -17,-4 C -17,-14 17,-14 17,-4 C 17,7 9,13 0,13 C -9,13 -17,7 -17,-4 Z', rad(c, [[0, '#fbf8f2'], [1, '#c9c2b6']], { cx: 0.4, cy: 0.35, r: 0.7 }), '#8f897f', 1.4);
    [-4, 4].forEach((x) => el('circle', { cx: x, cy: -12, r: 1.8, fill: '#3a3430' }, c));
    return c;
  }
  // 細菌（放大圖）
  function rod(p, x, y, len, w, ang, col, edge, flag) {
    const b = S.place(g(p), { x, y, r: ang }), hl = len / 2, hw = w / 2;
    if (flag) L(b, `M ${hl - 2},0 C ${hl + 8},-7 ${hl + 14},7 ${hl + 22},0 C ${hl + 28},-6 ${hl + 34},6 ${hl + 42},0`, edge, 1.6);
    P(b, `M ${-hl + hw},${-hw} L ${hl - hw},${-hw} A ${hw},${hw} 0 0 1 ${hl - hw},${hw} L ${-hl + hw},${hw} A ${hw},${hw} 0 0 1 ${-hl + hw},${-hw} Z`, rad(b, [[0, '#ffffff', 0.5], [0.35, col], [1, col]], { cx: 0.4, cy: 0.2, r: 0.9 }), edge, 2);
    L(b, `M ${-hl + hw},${f1(-hw * 0.45)} L ${hl - hw},${f1(-hw * 0.45)}`, '#ffffff', 2.4, { opacity: 0.5 });
    [-0.22, 0.05, 0.28].forEach((k) => el('circle', { cx: f1(k * len), cy: f1(hw * 0.25), r: 2, fill: edge, opacity: 0.55 }, b));
    return b;
  }
  function coccus(p, x, y, r, col, edge) {
    el('circle', { cx: x, cy: y, r, fill: rad(p, [[0, '#ffffff', 0.6], [0.4, col], [1, col]], { cx: 0.38, cy: 0.33, r: 0.8 }), stroke: edge, 'stroke-width': 2 }, p);
    el('circle', { cx: x + r * 0.2, cy: y + r * 0.2, r: 1.8, fill: edge, opacity: 0.5 }, p);
  }

  // ---------- 行星、生存條件 ----------
  // 太陽在左邊：右半邊是夜晚
  function planet(p, r, kind) {
    const c = g(p), d = circD(0, 0, r);
    const fill = { mercury: rad(c, [[0, '#c9c4bc'], [1, '#8a857e']], { cx: 0.35, cy: 0.4, r: 0.8 }), earth: rad(c, [[0, '#5aa0e8'], [1, '#1f4f9a']], { cx: 0.35, cy: 0.4, r: 0.8 }), mars: rad(c, [[0, '#e88a5a'], [1, '#a8482a']], { cx: 0.35, cy: 0.4, r: 0.8 }) }[kind];
    el('circle', { cx: 0, cy: 0, r, fill }, c);
    const inside = g(c, { 'clip-path': clip(c, d) });
    const k = r / 44;
    if (kind === 'mercury') {
      [[-8, -8, 5], [8, 6, 4], [-4, 12, 3], [10, -10, 3], [-14, 4, 2.5]].forEach(([x, y, rr]) => { el('circle', { cx: x, cy: y, r: rr, fill: '#7d7871' }, inside); L(inside, `M ${x - rr * 0.7},${y - rr * 0.7} A ${rr},${rr} 0 0 1 ${x + rr * 0.7},${y - rr * 0.7}`, '#e2ddd4', 1, { opacity: 0.7 }); });
    } else if (kind === 'earth') {
      P(inside, curve([[-30, -26], [-12, -34], [2, -24], [-4, -12], [-18, -6], [-14, 8], [-26, 14], [-36, 2]].map(([x, y]) => [x * k, y * k])), '#4f9a46');
      P(inside, curve([[10, -4], [26, -12], [38, 0], [32, 16], [20, 30], [8, 22], [12, 10]].map(([x, y]) => [x * k, y * k])), '#5fa24e');
      P(inside, curve([[-10, 26], [4, 24], [2, 36], [-10, 40]].map(([x, y]) => [x * k, y * k])), '#c9b47a');
      [[-34, -10, 22, -4], [-8, 20, 26, 6], [6, -34, 18, -6], [16, 34, 14, 4]].forEach(([x, y, w, b]) => L(inside, `M ${f1(x * k)},${f1(y * k)} c ${f1(w * 0.4 * k)},${f1(-4 * k)} ${f1(w * 0.8 * k)},${f1(b * 0.5 * k)} ${f1(w * k)},${f1(b * k)}`, '#ffffff', 4.5 * k, { opacity: 0.7 }));
      L(inside, `M ${f1(-20 * k)},${f1(4 * k)} c ${f1(6 * k)},${f1(-8 * k)} ${f1(16 * k)},${f1(-4 * k)} ${f1(14 * k)},${f1(4 * k)}`, '#ffffff', 3.5 * k, { opacity: 0.55 });
    } else {
      [[-10, 4, 12, 6], [8, -8, 9, 5], [6, 12, 7, 4]].forEach(([x, y, rx, ry]) => el('ellipse', { cx: x, cy: y, rx, ry, fill: '#8a3f22', opacity: 0.6 }, inside));
      el('ellipse', { cx: 0, cy: -r + 3, rx: r * 0.42, ry: 6, fill: '#f6f2ee' }, inside);
    }
    // 夜晚的那一半
    el('rect', { x: -r, y: -r, width: 2 * r, height: 2 * r, fill: lin(c, [[0, '#000', 0], [0.5, '#000', 0.05], [0.78, '#000', 0.55], [1, '#000', 0.75]], 1, 0) }, inside);
    if (kind === 'earth') el('circle', { cx: 0, cy: 0, r: r + 3, fill: 'none', stroke: '#9fd4ff', 'stroke-width': 4, opacity: 0.55 }, c);
    return c;
  }
  function sunIcon(p, r = 24) {
    const c = g(p);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; L(c, `M ${f1(Math.cos(a) * (r + 7))},${f1(Math.sin(a) * (r + 7))} L ${f1(Math.cos(a) * (r + 18))},${f1(Math.sin(a) * (r + 18))}`, '#ffd166', 4.5); }
    el('circle', { cx: 0, cy: 0, r, fill: rad(c, [[0, '#fff6c8'], [1, '#ffc53d']]) }, c);
    return c;
  }
  function windIcon(p) {
    const c = g(p), col = '#bfe3ff';
    L(c, 'M -38,-14 L 14,-14 C 28,-14 32,-32 20,-36 C 12,-38 6,-32 8,-26', col, 5);
    L(c, 'M -38,2 L 26,2 C 42,2 46,22 32,26 C 24,28 18,22 20,16', col, 5);
    L(c, 'M -30,18 L 4,18', col, 5, { opacity: 0.7 });
    return c;
  }
  function apple(p) {
    const c = g(p);
    L(c, 'M 0,-24 C 1,-32 4,-38 8,-42', '#6a4a2a', 4);
    const lf = at(c, 5, -36, 1, -35);
    P(lf, 'M 0,0 C 6,-9 18,-10 24,-4 C 18,4 6,5 0,0 Z', '#6fbf4a', '#2f6a2a', 1.4);
    P(c, 'M 0,-22 C 10,-30 32,-30 34,-6 C 36,16 22,34 10,34 C 6,34 3,31 0,31 C -3,31 -6,34 -10,34 C -22,34 -36,16 -34,-6 C -32,-30 -10,-30 0,-22 Z', rad(c, [[0, '#ff8a7a'], [0.6, '#e0403a'], [1, '#a8282a']], { cx: 0.35, cy: 0.35, r: 0.75 }), '#7a1c1c', 2);
    L(c, 'M -22,-12 C -24,-2 -22,6 -18,12', '#ffffff', 4, { opacity: 0.5 });
    return c;
  }
  function thermo(p) {
    const c = g(p);
    el('rect', { x: -9, y: -44, width: 18, height: 62, rx: 9, fill: '#e8f2f8', stroke: '#9ab4c4', 'stroke-width': 2 }, c);
    el('circle', { cx: 0, cy: 28, r: 15, fill: '#ff6b6b', stroke: '#9ab4c4', 'stroke-width': 2 }, c);
    el('rect', { x: -4, y: -14, width: 8, height: 34, fill: '#ff6b6b' }, c);
    for (let i = 0; i < 5; i++) L(c, `M 9,${-36 + i * 10} L 15,${-36 + i * 10}`, '#9ab4c4', 2);
    el('circle', { cx: -4, cy: 23, r: 4, fill: '#fff', opacity: 0.6 }, c);
    return c;
  }

  // ---------- 生物圈剖面用的小生物 ----------
  function goose(p) {
    const c = g(p);
    P(c, 'M -2,2 C 2,10 8,16 16,20 C 8,16 0,12 -6,6 Z', '#9aa4ae', '#4a5460', 1);
    P(c, 'M -24,2 L -31,-3 L -30,7 Z', '#aab2ba', '#4a5460', 1);
    P(c, 'M -24,2 C -18,-5 -4,-6 8,-4 C 14,-4 18,-6 22,-8 C 25,-9 28,-8 29,-6 L 35,-5 L 29,-3 C 26,-2 22,-1 18,0 C 12,4 4,8 -6,8 C -14,8 -22,6 -24,2 Z', '#e4e8ec', '#4a5460', 1.2);
    P(c, 'M 22,-8 C 25,-9 28,-8 29,-6 L 29,-3 C 26,-2 23,-2 21,-3 Z', '#3a3f46');
    P(c, 'M -6,-2 C -10,-14 -18,-24 -30,-30 C -22,-18 -16,-8 -12,2 Z', '#c4ccd4', '#4a5460', 1.1);
    L(c, 'M -10,-6 L -20,-18 M -8,-4 L -14,-12', '#8a949e', 1, { opacity: 0.8 });
    el('circle', { cx: 26, cy: -6.5, r: 1, fill: '#fff' }, c);
    return c;
  }
  function smallFish(p, col = '#9cc4dc') {
    const c = g(p);
    P(c, 'M -12,0 L -20,-6 L -19,6 Z', col, '#2a4a5e', 1);
    P(c, 'M -13,0 C -6,-7 8,-7 14,0 C 8,7 -6,7 -13,0 Z', col, '#2a4a5e', 1.2);
    el('circle', { cx: 8, cy: -1.5, r: 1.6, fill: '#10202a' }, c);
    return c;
  }
  function deepFish(p) {
    const c = g(p);
    L(c, 'M 10,-12 C 14,-26 26,-30 32,-22', '#4a5a6a', 2);
    el('circle', { cx: 32, cy: -20, r: 9, fill: rad(c, [[0, '#d8fbff', 0.9], [1, '#7fe6ff', 0]]) }, c);
    el('circle', { cx: 32, cy: -20, r: 3, fill: '#e8ffff' }, c);
    P(c, 'M -22,0 L -32,-9 L -31,9 Z', '#3a4652', '#1a2228', 1);
    P(c, 'M -22,0 C -18,-14 4,-16 16,-8 C 22,-4 24,2 22,6 C 12,14 -12,14 -22,0 Z', '#3a4652', '#1a2228', 1.4);
    L(c, 'M 22,4 C 16,8 10,8 6,6', '#c8d4dc', 1.6);
    for (let i = 0; i < 3; i++) P(c, `M ${10 + i * 4},5 l 1.5,3 l 1.5,-3 Z`, '#e8eef2');
    el('circle', { cx: 12, cy: -4, r: 2, fill: '#c8e8ff' }, c);
    return c;
  }
  function conifer(p, h = 34, col = '#2f6a46') {
    const c = g(p);
    el('rect', { x: -2, y: -6, width: 4, height: 8, fill: '#5a3e28' }, c);
    for (let i = 0; i < 3; i++) { const y0 = -6 - i * h * 0.26, w = h * (0.38 - i * 0.09); P(c, `M ${f1(-w)},${f1(y0)} C ${f1(-w * 0.5)},${f1(y0 - h * 0.12)} ${f1(-w * 0.2)},${f1(y0 - h * 0.3)} 0,${f1(y0 - h * 0.42)} C ${f1(w * 0.2)},${f1(y0 - h * 0.3)} ${f1(w * 0.5)},${f1(y0 - h * 0.12)} ${f1(w)},${f1(y0)} Z`, i % 2 ? '#3f7f52' : col); }
    return c;
  }
  function broadleaf(p, h = 34) {
    const c = g(p);
    P(c, `M -3,0 L -2,${-h * 0.45} L 2,${-h * 0.45} L 3,0 Z`, '#6b4a2e');
    const d = lobes([[-h * 0.42, -h * 0.5], [-h * 0.4, -h * 0.8], [-h * 0.1, -h], [h * 0.25, -h * 0.95], [h * 0.45, -h * 0.68], [h * 0.3, -h * 0.42], [-h * 0.1, -h * 0.4]], 0.6);
    P(c, d, lin(c, [[0, '#6fbf5a'], [1, '#3f8f46']]));
    return c;
  }
  function ant(p) {
    const c = g(p), col = '#2a1a12';
    [[-2, 0], [2, 0], [6, 0]].forEach(([x], i) => [-1, 1].forEach((s) => L(c, `M ${x},0 L ${x - 3 + i * 2},${s * 6} L ${x - 5 + i * 3},${s * 8}`, col, 1.2)));
    el('ellipse', { cx: -8, cy: 0, rx: 5.5, ry: 3.6, fill: col }, c);
    el('ellipse', { cx: 1, cy: 0, rx: 4, ry: 2.2, fill: col }, c);
    el('circle', { cx: 8, cy: 0, r: 3, fill: col }, c);
    L(c, 'M 10,-1 C 13,-5 15,-6 17,-6 M 10,1 C 13,5 15,6 17,6', col, 1);
    return c;
  }

  S.register({
    id: 'origin', section: '1-2', title: '生命的起源與生物圈',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 原始地球 =====
      const P0 = g(root);
      const X0 = 30, Y0 = 30, W0 = 800, H0 = 660;
      const scn = g(P0, { 'clip-path': clip(P0, rectD(X0, Y0, W0, H0, 18)) });
      el('rect', { x: X0, y: Y0, width: W0, height: H0, fill: lin(scn, [[0, '#0d0a16'], [0.4, '#22162a'], [0.62, '#42211f'], [0.72, '#6e2e1a']]) }, scn);
      // 太陽
      const SX = 150, SY = 190;
      el('circle', { cx: SX, cy: SY, r: 112, fill: rad(scn, [[0, '#ffd27a', 0.6], [0.35, '#ffb347', 0.25], [1, '#ff8a3c', 0]]) }, scn);
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283 + 0.13; L(scn, `M ${f1(SX + Math.cos(a) * 44)},${f1(SY + Math.sin(a) * 44)} L ${f1(SX + Math.cos(a) * 60)},${f1(SY + Math.sin(a) * 60)}`, '#ffd166', 4, { opacity: 0.75 }); }
      el('circle', { cx: SX, cy: SY, r: 35, fill: rad(scn, [[0, '#fffbe6'], [0.55, '#ffe27a'], [1, '#ffb43c']]) }, scn);
      // 雨
      for (let i = 0; i < 15; i++) L(scn, `M ${640 + i * 13},${196 + (i % 3) * 10} L ${626 + i * 13},${470}`, '#9fb3c8', 1.5, { opacity: 0.16 });
      // 遠方的山
      P(scn, curve([[X0, 474, 1], [90, 456], [160, 462], [230, 446], [320, 460], [410, 448], [500, 462], [600, 452], [700, 460], [780, 448], [X0 + W0, 456, 1], [X0 + W0, 530, 1], [X0, 530, 1]]), '#2a1b1f');
      volcano(scn, 300, 488, 340, 160, 40, 3);
      volcano(scn, 545, 492, 248, 255, 62, 9);
      // 雲（在煙柱後面）
      stormCloud(scn, 440, 150, 400, 96, 4, 560);
      stormCloud(scn, 612, 196, 230, 54, 8, null);
      stormCloud(scn, 330, 98, 150, 44, 12, null);
      // 煙柱：外層定位在火山口，內層由 drive 縮放
      const plumeO1 = at(scn, 300, 342), plume1 = g(plumeO1); ashPlume(plume1);
      const plumeO2 = at(scn, 545, 250), plume2 = g(plumeO2); ashPlume(plume2);
      plume1.setAttribute('transform', 'scale(0.42)'); plume2.setAttribute('transform', 'scale(0.78)');
      // 熔岩流
      const lavas = [
        lavaFlow(scn, [[520, 256], [510, 300], [494, 350], [474, 400], [458, 450], [450, 490]]),
        lavaFlow(scn, [[562, 258], [568, 310], [578, 362], [586, 420], [600, 490]]),
        lavaFlow(scn, [[290, 347], [282, 385], [276, 430], [272, 488]]),
      ];
      // 火山彈（噴出的熔岩碎塊）
      const bombs = Array.from({ length: 12 }, (_, i) => el('circle', { cx: 545, cy: 250, r: 2.5 + (i % 3), fill: i % 2 ? '#ffb347' : '#ff7a2a', opacity: 0 }, scn));
      // 原始海洋
      const SEA = 506;
      let sea = `M ${X0},${SEA}`;
      for (let x = X0; x < X0 + W0; x += 40) sea += ` Q ${x + 10},${SEA - 5} ${x + 20},${SEA} T ${x + 40},${SEA}`;
      sea += ` L ${X0 + W0},${Y0 + H0} L ${X0},${Y0 + H0} Z`;
      P(scn, `M ${X0},492 C 200,486 400,494 830,488 L 830,512 L 30,512 Z`, '#231917');
      P(scn, sea, lin(scn, [[0, '#3b4c4c'], [0.4, '#22363a'], [1, '#101e22']]));
      el('ellipse', { cx: 545, cy: 540, rx: 120, ry: 40, fill: rad(scn, [[0, '#ff7a3a', 0.4], [1, '#ff7a3a', 0]]) }, scn);
      for (let i = 0; i < 16; i++) { const x = 60 + ((i * 263) % 740), y = 528 + ((i * 47) % 150); L(scn, `M ${x},${y} q 12,-5 24,0 t 24,0`, x > 470 && x < 620 ? '#ff9a5a' : '#6f9096', 2, { opacity: 0.45 }); }
      const wisps = [70, 160, 300, 390, 640, 720, 790].map((x, i) => { const w = wisp(scn); w.x0 = x; w.ph = i * 0.37; return w; });
      // 閃電
      const flash = el('rect', { x: X0, y: Y0, width: W0, height: H0, fill: '#e8e0ff', opacity: 0 }, scn);
      const bolt1 = bolt(scn, 792, 196, 806, 506, 3, 16, 8, [4, -46, 76]);
      const bolt2 = bolt(scn, 560, 104, 586, 176, 11, 9, 5);
      bolt1.style.opacity = 0; bolt2.style.opacity = 0;
      // 紫外線（從太陽斜射到地面）
      const uvs = [[160, 236, 104, 498], [176, 236, 168, 498], [192, 230, 234, 452]].map(([a, b, c, d]) => uvRay(scn, a, b, c, d));
      uvs.forEach((u) => (u.style.opacity = 0));
      const title0 = g(P0, { opacity: 0 });
      S.pill(title0, 250, 70, '原始地球（約 46 億年前形成＊）', { size: 24, color: C.hi, edge: C.hi });
      const co0 = [
        S.callout(P0, 545, 254, 405, 206, '火山爆發', '#ffa060', { size: 24 }),
        S.callout(P0, 801, 340, 712, 386, '閃電', '#d8ccff', { size: 24 }),
        S.callout(P0, 174, 330, 300, 154, '強烈紫外線', '#c79bff', { size: 24 }),
        S.callout(P0, 420, 600, 230, 640, '原始海洋', '#8fd0e0', { size: 24 }),
      ];
      // 原始大氣（推測）
      const atm = g(P0, { opacity: 0 });
      card(atm, 850, 30, 320, 660);
      TM(atm, 1010, 84, '原始大氣（推測）', 28, C.hi, B);
      const gasRows = [['水蒸氣', 'H₂O', 'h2o'], ['甲烷', 'CH₄', 'ch4'], ['氨', 'NH₃', 'nh3'], ['氫', 'H₂', 'h2']].map(([n, f, k], i) => {
        const rg = g(atm, { opacity: 0 }), y = 168 + i * 98;
        molecule(at(rg, 924, y, 1.15), k);
        T(rg, 984, y + 4, n, 30, C.ink, B);
        T(rg, 984, y + 36, f, 22, C.mute, { class: 'mono' });
        return rg;
      });
      const noO2 = g(atm, { opacity: 0 });
      L(noO2, 'M 872,545 L 1148,545', '#2b4252', 2);
      molecule(at(noO2, 924, 604, 1.1), 'o2');
      L(noO2, 'M 898,578 L 950,630 M 950,578 L 898,630', '#ff6b6b', 6);
      T(noO2, 984, 600, '沒有氧', 30, '#ff8a7a', B);
      T(noO2, 984, 634, 'O₂', 22, C.mute, { class: 'mono' });
      TM(atm, 1010, 676, '＊米勒實驗採用的假設', 20, C.mute);

      tl.addLabel('s0');
      S.show(tl, title0, 's0+=0.2', 0.4);
      S.drive(tl, (u) => {
        // 煙柱長大、火山彈噴出、水蒸氣上升
        const gr = S.smoothstep(0, 0.35, u);
        plume2.setAttribute('transform', `scale(${(0.3 + 0.48 * gr).toFixed(3)})`);
        plume1.setAttribute('transform', `scale(${(0.16 + 0.26 * gr).toFixed(3)})`);
        const tt = u * 7;
        bombs.forEach((b, i) => {
          const k = (tt * 0.9 + i / bombs.length) % 1, a = -1.57 + (((i * 7) % 12) / 11 - 0.5) * 1.5, v = 70 + (i % 4) * 14;
          put(b, 545 + Math.cos(a) * v * k * 1.2, 250 + Math.sin(a) * v * k * 1.2 + 90 * k * k, u > 0.05 ? 1 - k : 0);
        });
        wisps.forEach((w) => { const k = (tt * 0.25 + w.ph) % 1; w.setAttribute('transform', `translate(${w.x0},${(SEA + 4 - k * 50).toFixed(1)})`); w.style.opacity = Math.sin(Math.PI * k).toFixed(2); });
        // 閃電：閃幾次之後留著
        const fl = (a, b) => (u > a && u < b ? 1 : 0);
        const f1on = fl(0.18, 0.21) || fl(0.24, 0.27) || fl(0.55, 0.58) || u > 0.8 ? 1 : 0;
        const f2on = fl(0.4, 0.43) || fl(0.68, 0.71) || u > 0.86 ? 1 : 0;
        bolt1.style.opacity = f1on; bolt2.style.opacity = f2on;
        flash.style.opacity = (fl(0.18, 0.21) || fl(0.55, 0.58) || fl(0.8, 0.82)) ? 0.12 : 0;
      }, 6, 's0', 'none');
      lavas.forEach((lv, i) => lv.parts.forEach((pp) => S.drawOn(tl, pp, 1.6, `s0+=${0.4 + i * 0.3}`)));
      uvs.forEach((uv, i) => { S.show(tl, uv, `s0+=${1.5 + i * 0.15}`, 0.2); S.drawOn(tl, uv.path, 0.8, `s0+=${1.5 + i * 0.15}`); });
      [0.9, 2.0, 1.5, 2.6].forEach((t, i) => S.show(tl, co0[i], `s0+=${t}`, 0.4));
      S.show(tl, atm, 's0+=2.9', 0.4);
      gasRows.forEach((r, i) => S.show(tl, r, `s0+=${3.2 + i * 0.35}`, 0.35));
      S.show(tl, noO2, 's0+=4.8', 0.4);

      // ===== 1 有機物與無機物 =====
      const P1 = g(root, { opacity: 0 });
      const ORG = '#ffb35c', INORG = '#7fc8ff';
      const SIDES = [
        [40, '有機物', '大多是含碳的化合物，構成生物體的重要物質', ORG, [['醣類', '如：米飯、麵包', bread], ['蛋白質', '如：蛋、肉', protein], ['脂質', '如：食用油', (q) => drop(q, '#fff0b8', '#e0a325', '#9a6a14')]]],
        [610, '無機物', '例如水、氧、二氧化碳、礦物質（鹽類）', INORG, [['水', 'H₂O', (q) => drop(q, '#d8f0ff', '#3d8fe0', '#1d5a9a')], ['氧、二氧化碳', '空氣中的氣體', gases], ['礦物質', '如：食鹽等鹽類', salt]]],
      ];
      const sideG = SIDES.map(([x, name, sub, col, tiles]) => {
        const sg = g(P1, { opacity: 0 });
        card(sg, x, 40, 550, 500, { stroke: col });
        T(sg, x + 30, 98, name, 36, col, B);
        T(sg, x + 30, 140, sub, 22, C.ink2);
        sg.tiles = tiles.map(([n, ex, draw], i) => {
          const tg = g(sg, { opacity: 0 }), tx = x + 11 + i * 178;
          el('rect', { x: tx, y: 166, width: 172, height: 352, rx: 14, fill: '#16293a', stroke: '#24394a', 'stroke-width': 1.5 }, tg);
          draw(at(tg, tx + 86, 300, 1.05));
          TM(tg, tx + 86, 436, n, n.length > 4 ? 26 : 28, col, B);
          TM(tg, tx + 86, 474, ex, 22, C.mute, ex === 'H₂O' ? { class: 'mono' } : {});
          return tg;
        });
        return sg;
      });
      const trap1 = g(P1, { opacity: 0 });
      el('rect', { x: 140, y: 562, width: 920, height: 128, rx: 18, fill: 'rgba(255,107,107,0.08)', stroke: '#ff8a7a', 'stroke-width': 2 }, trap1);
      bubble(trap1, 222, 626, 40, 'CO₂', '#b8c4cc', 22);
      S.pill(trap1, 318, 612, '易錯', { size: 24, color: '#ff8a7a', edge: '#ff8a7a' });
      T(trap1, 370, 622, '二氧化碳雖然含碳，仍屬於無機物', 30, C.ink, B);
      T(trap1, 300, 668, '含碳的化合物大多是有機物，但二氧化碳是例外', 22, C.mute);

      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      sideG.forEach((sg, i) => {
        S.show(tl, sg, `s1+=${0.4 + i * 2}`, 0.4);
        sg.tiles.forEach((tg, k) => S.show(tl, tg, `s1+=${0.8 + i * 2 + k * 0.45}`, 0.4));
      });
      S.show(tl, trap1, 's1+=4.6', 0.5);

      // ===== 2 米勒的模擬實驗 =====
      const P2 = g(root, { opacity: 0 });
      card(P2, 30, 30, 760, 630);
      T(P2, 60, 80, '米勒的模擬實驗（1953 年）', 28, C.hi, B);
      S.pill(P2, 742, 64, '補充', { size: 22, color: C.mute, edge: '#4a6272' }); // 米勒、鵝頸瓶、深海熱泉三步是補充內容
      const BF = [250, 505, 66], SF = [540, 250, 112];
      const vaporD = 'M 250,442 L 250,312 Q 250,272 290,272 L 434,272';
      const outD = 'M 540,356 L 540,396';
      const trapD = 'M 540,530 L 540,600 C 540,646 470,646 470,600 L 470,552 Q 470,522 440,522 L 312,522';
      const app = g(P2);
      // 電源與電極的導線
      const wires = g(app);
      L(wires, 'M 424,162 L 424,80 L 480,80 M 656,162 L 656,80 L 600,80', '#8a9aa6', 3);
      el('rect', { x: 480, y: 58, width: 120, height: 44, rx: 8, fill: '#26394a', stroke: '#6f8796', 'stroke-width': 2 }, wires);
      TM(wires, 540, 88, '電源', 22, C.ink2, B);
      // 冷凝管的冷水管
      const cool = g(app);
      [[516], [408]].forEach(([y]) => { L(cool, `M 562,${y} L 612,${y}`, GLASS, 16); L(cool, `M 562,${y} L 612,${y}`, 'rgba(95,184,255,0.55)', 10); });
      arrow(cool, 656, 516, 618, 516, '#5fb8ff', 4, 12);
      arrow(cool, 618, 408, 656, 408, '#5fb8ff', 4, 12);
      T(cool, 664, 523, '冷水進', 20, '#9fd8ff');
      T(cool, 664, 415, '冷水出', 20, '#9fd8ff');
      // 玻璃：外層 → 內層
      [vaporD, outD, trapD].forEach((d) => L(app, d, GLASS, 22, { 'stroke-linecap': 'butt' }));
      el('circle', { cx: BF[0], cy: BF[1], r: BF[2] + 4, fill: GLASS }, app);
      el('circle', { cx: SF[0], cy: SF[1], r: SF[2] + 4, fill: GLASS }, app);
      el('rect', { x: 514, y: 390, width: 52, height: 146, rx: 14, fill: GLASS }, app);
      [vaporD, outD, trapD].forEach((d) => L(app, d, GLASS_IN, 15, { 'stroke-linecap': 'butt' }));
      el('circle', { cx: BF[0], cy: BF[1], r: BF[2], fill: GLASS_IN }, app);
      el('circle', { cx: SF[0], cy: SF[1], r: SF[2], fill: GLASS_IN }, app);
      el('rect', { x: 518, y: 394, width: 44, height: 138, rx: 11, fill: 'rgba(95,184,255,0.3)' }, app);
      L(app, 'M 540,392 L 540,534', GLASS, 16, { 'stroke-linecap': 'butt' });
      L(app, 'M 540,392 L 540,534', GLASS_IN, 9, { 'stroke-linecap': 'butt' });
      // 液體：燒瓶裡的水、U 形管裡收集到的液體
      const bfIn = g(app, { 'clip-path': clip(app, circD(BF[0], BF[1], BF[2] - 1)) });
      const water = el('rect', { x: 180, y: 500, width: 140, height: 80, fill: '#4f9fd8', opacity: 0.55 }, bfIn);
      L(bfIn, 'M 184,500 q 11,-4 22,0 t 22,0 t 22,0 t 22,0 t 22,0 t 22,0', '#bfe3ff', 2, { opacity: 0.7 });
      const boil = Array.from({ length: 9 }, () => el('circle', { cx: 250, cy: 560, r: 3, fill: 'none', stroke: '#dff2ff', 'stroke-width': 1.5, opacity: 0 }, bfIn));
      const trapLiq = L(app, 'M 540,604 C 540,644 470,644 470,604', '#4f9fd8', 9, { opacity: 0.8, 'stroke-linecap': 'butt' });
      // 電極（穿過燒瓶壁的玻璃套管）與火花
      const elec = g(app);
      [[424, 162, 527, 230], [656, 162, 553, 230]].forEach(([x1, y1, x2, y2]) => {
        const sx = S.lerp(x1, x2, 0.12), sy = S.lerp(y1, y2, 0.12), ex = S.lerp(x1, x2, 0.42), ey = S.lerp(y1, y2, 0.42);
        L(elec, `M ${f1(sx)},${f1(sy)} L ${f1(ex)},${f1(ey)}`, GLASS, 14);
        L(elec, `M ${x1},${y1} L ${x2},${y2}`, '#c9d2d8', 3.5);
        el('circle', { cx: x2, cy: y2, r: 4, fill: '#e8eef2' }, elec);
      });
      const spark = g(app, { opacity: 0 });
      const spD = 'M 529,230 L 534,217 L 539,242 L 545,219 L 551,230';
      el('circle', { cx: 540, cy: 230, r: 34, fill: rad(spark, [[0, '#f4f0ff', 0.75], [0.5, '#c9b8ff', 0.3], [1, '#b9a8ff', 0]]) }, spark);
      L(spark, spD, '#b9a8ff', 10, { opacity: 0.55 });
      L(spark, spD, '#fffbe6', 3.5);
      // 燒瓶裡循環的氣體
      const GASC = ['#aab4bc', '#8fb0ff', '#f4f6f8', '#9fd8ff'];
      const gasDots = Array.from({ length: 14 }, (_, i) => el('circle', { cx: 540, cy: 230, r: 4.5, fill: GASC[i % 4], opacity: 0.85 }, app));
      const vapor = Array.from({ length: 7 }, () => el('circle', { cx: 250, cy: 470, r: 4.5, fill: '#dff2ff', opacity: 0 }, app));
      const drops = Array.from({ length: 8 }, () => el('circle', { cx: 540, cy: 360, r: 4, fill: '#8fd0ff', opacity: 0 }, app));
      const vapAt = polyAt([[250, 478], [250, 312], [262, 284], [290, 272], [434, 272], [470, 262]]);
      const dropAt = polyAt([[540, 352], [540, 600], [532, 628], [505, 640], [478, 628], [470, 600], [470, 552], [462, 530], [440, 522], [312, 522], [292, 524]]);
      // 反光
      L(app, `M ${SF[0] - 86},${SF[1] - 40} A 96,96 0 0 1 ${SF[0] - 36},${SF[1] - 92}`, '#ffffff', 6, { opacity: 0.35 });
      L(app, `M ${BF[0] - 50},${BF[1] - 24} A 56,56 0 0 1 ${BF[0] - 20},${BF[1] - 54}`, '#ffffff', 4, { opacity: 0.4 });
      // 燒瓶裡放不下整行氣體名稱：標在燒瓶左上方，用引線指進燒瓶
      L(app, 'M 364,192 L 452,222', C.ink2, 2);
      el('circle', { cx: 452, cy: 222, r: 4, fill: C.ink2 }, app);
      TM(app, 250, 176, '模擬原始大氣', 24, C.hi, B);
      TM(app, 250, 210, '甲烷、氨、氫、水蒸氣', 22, C.ink2);
      const lamp2 = lamp(at(app, 250, 600, 0.75));
      const sea2 = S.callout(P2, 222, 540, 120, 430, '模擬原始海洋', '#8fd0e0', { size: 22 });
      sea2.style.opacity = 1;
      const badges2 = [[330, 598], [540, 160], [484, 462], [430, 612]].map(([x, y], i) => { const b = badge(P2, x, y, i + 1); b.style.opacity = 0; return b; });
      const amino2 = S.callout(P2, 505, 640, 668, 612, '胺基酸等有機物', C.hi, { size: 22 });
      const STEPS2 = [['加熱', '燒瓶中的水沸騰，', '產生水蒸氣'], ['放電', '電極放出火花，', '模擬閃電，提供能量'], ['冷卻', '冷凝管讓水蒸氣冷卻，', '凝結成水滴流回'], ['約一週後＊', '水中出現胺基酸', '等有機物']];
      const cards2 = STEPS2.map(([t, a, b], i) => {
        const cg = g(P2, { opacity: 0 }), y = 30 + i * 161;
        card(cg, 810, y, 360, 145, i === 3 ? { stroke: C.hi } : {});
        badge(cg, 846, y + 40, i + 1);
        T(cg, 878, y + 50, t, 28, C.hi, B);
        T(cg, 834, y + 92, a, 22);
        T(cg, 834, y + 124, b, 22);
        return cg;
      });
      aminoAcid(at(cards2[3], 1104, 30 + 3 * 161 + 98, 0.85));
      const con2 = g(P2, { opacity: 0 });
      S.pill(con2, 600, 692, '在原始地球的條件下，無機物可以形成有機物', { size: 26, color: C.hi, edge: C.hi });

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drive(tl, (u) => {
        const tt = u * 6.6;
        flicker(lamp2.flame, u);
        boil.forEach((b, i) => { const k = (tt * 1.2 + i / boil.length) % 1; put(b, 214 + ((i * 37) % 72), 566 - k * 62, u > 0.08 ? Math.sin(Math.PI * k) : 0); });
        vapor.forEach((v, i) => { const k = (tt * 0.45 + i / vapor.length) % 1, [x, y] = vapAt(k); put(v, x, y, u > 0.1 ? Math.min(1, Math.sin(Math.PI * k) * 2) : 0); });
        gasDots.forEach((d, i) => { const a = tt * 1.1 + (i / gasDots.length) * 6.283, rr = 1 - (i % 3) * 0.16; put(d, 540 + Math.cos(a) * 82 * rr, 230 + Math.sin(a) * 40 * rr); });
        spark.style.opacity = u > 0.22 ? ((Math.sin(tt * 23) > -0.2 || u > 0.97) ? 1 : 0.15) : 0;
        drops.forEach((v, i) => { const k = (tt * 0.32 + i / drops.length) % 1, [x, y] = dropAt(k); put(v, x, y, u > 0.36 ? Math.min(1, Math.sin(Math.PI * k) * 3) : 0); });
        const c = S.smoothstep(0.6, 0.8, u);
        water.setAttribute('fill', mix('#4f9fd8', '#b8823c', c));
        trapLiq.setAttribute('stroke', mix('#4f9fd8', '#c08a40', c));
      }, 6.6, 's2', 'none');
      cards2.forEach((cg, i) => { const t = [0.7, 1.6, 2.5, 3.9][i]; S.show(tl, cg, `s2+=${t}`, 0.4); S.show(tl, badges2[i], `s2+=${t}`, 0.4); });
      S.show(tl, amino2, 's2+=5.2', 0.4);
      S.show(tl, con2, 's2+=5.8', 0.5);

      // ===== 3 巴斯德的鵝頸瓶 =====
      const P3 = g(root, { opacity: 0 });
      TM(P3, 600, 60, '生命會不會「自然發生」？', 32, C.ink, B);
      S.pill(P3, 92, 50, '補充', { size: 22, color: C.mute, edge: '#4a6272' });
      const time3 = g(P3, { opacity: 0 });
      const clk = g(time3);
      el('circle', { cx: 878, cy: 52, r: 18, fill: '#e8f0f2', stroke: '#8aa1ae', 'stroke-width': 2 }, clk);
      const hand = el('line', { x1: 878, y1: 52, x2: 878, y2: 40, stroke: '#0d1822', 'stroke-width': 3, 'stroke-linecap': 'round' }, clk);
      el('line', { x1: 878, y1: 52, x2: 886, y2: 52, stroke: '#0d1822', 'stroke-width': 3, 'stroke-linecap': 'round' }, clk);
      S.pill(time3, 1004, 52, '放置很久以後＊', { size: 24, color: C.hi, edge: C.hi });
      const CARD3 = [[40, '鵝頸瓶（瓶頸完整）', 247, false], [610, '把瓶頸打斷', 817, true]];
      const fl3 = CARD3.map(([x, title, fx, broken]) => {
        const cg = g(P3);
        card(cg, x, 90, 550, 524);
        T(cg, x + 28, 140, title, 28, broken ? '#ffb38a' : '#9be58c', B);
        const lp = lamp(at(cg, fx, 385 + 128, 0.8));
        const fo = at(cg, fx, 385);
        const fk = swanFlask(fo, broken);
        fk.lamp = lp; fk.cg = cg; fk.fx = fx;
        // 煮沸時的氣泡、從開口冒出的水蒸氣
        fk.bub = Array.from({ length: 8 }, () => el('circle', { cx: 0, cy: 60, r: 3.5, fill: 'none', stroke: '#fff3d0', 'stroke-width': 1.5, opacity: 0 }, fk.inside));
        fk.steam = [0, 1, 2].map(() => { const w = wisp(fo); w.style.opacity = 0; return w; });
        return fk;
      });
      const [fA, fB] = fl3;
      // 灰塵與微生物
      // 灰塵（灰褐色）和微生物（綠色）
      const speck = (p, i) => (i % 3 === 0 ? el('ellipse', { cx: 0, cy: 0, rx: 5, ry: 3.2, fill: '#7fd08a', stroke: '#2f6a3a', 'stroke-width': 1, opacity: 0 }, p) : el('circle', { cx: 0, cy: 0, r: 3.4, fill: '#b8ab98', stroke: '#5e5446', 'stroke-width': 1, opacity: 0 }, p));
      const dustA = Array.from({ length: 14 }, (_, i) => speck(fA, i));
      const pathA = polyAt([[300, -262], [262, -228], [216, -190], [206, -174], [188, -146], [168, -122], [150, -118]]);
      const dustB = Array.from({ length: 14 }, (_, i) => speck(fB, i));
      const rB = S.rng(21);
      const microbes = Array.from({ length: 34 }, (_, i) => { const m = el('ellipse', { cx: f1((rB() - 0.5) * 150), cy: f1(18 + rB() * 64), rx: 5, ry: 3.2, fill: '#7fd08a', stroke: '#2f6a3a', 'stroke-width': 0.8, opacity: 0, transform: '' }, fB.inside); m.th = 0.1 + (i / 34) * 0.85; return m; });
      const gasB = Array.from({ length: 5 }, (_, i) => el('circle', { cx: -40 + i * 20, cy: 8, r: 3, fill: 'none', stroke: '#e8e0b0', 'stroke-width': 1.4, opacity: 0 }, fB.inside));
      const airA = g(P3, { opacity: 0 });
      L(airA, 'M 540,140 C 520,156 500,170 486,184', '#cfe8ff', 3, { 'stroke-dasharray': '7 6' });
      P(airA, 'M 476,194 L 480,178 L 492,188 Z', '#cfe8ff');
      TM(airA, 540, 126, '空氣', 22, '#cfe8ff', B);
      const airB = g(P3, { opacity: 0 });
      L(airB, 'M 817,170 L 817,226', '#cfe8ff', 3, { 'stroke-dasharray': '7 6' });
      P(airB, 'M 817,238 L 809,224 L 825,224 Z', '#cfe8ff');
      T(airB, 832, 196, '空氣', 22, '#cfe8ff', B);
      const coA = S.callout(P3, 396, 287, 448, 324, '灰塵、微生物卡在這裡', '#e8d4a8', { size: 22 });
      const coB = S.callout(P3, 822, 252, 990, 252, '微生物落入肉湯', '#e8d4a8', { size: 22 });
      const resA = g(P3, { opacity: 0 }); TM(resA, 315, 596, '肉湯很久都不腐敗', 28, '#9be58c', B);
      const resB = g(P3, { opacity: 0 }); TM(resB, 885, 596, '肉湯腐敗了', 28, '#ffb38a', B);
      const phase3 = ['① 煮沸：殺死肉湯中原有的微生物', '② 放置：空氣可以進入瓶中'].map((s) => { const pg = g(P3, { opacity: 0 }); S.pill(pg, 600, 668, s, { size: 24, color: C.ink, edge: '#4a6272' }); return pg; });
      const con3 = g(P3, { opacity: 0 });
      S.pill(con3, 600, 668, '現今的生物都由原有的生物產生，不會自然發生', { size: 26, color: C.hi, edge: C.hi });

      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, phase3[0], 's3+=0.6', 0.3);
      S.drive(tl, (u) => {
        const tt = u * 7;
        // 0～0.22 煮沸
        const boilOn = u > 0.04 && u < 0.24;
        fl3.forEach((fk, j) => {
          flicker(fk.lamp.flame, u, j);
          fk.bub.forEach((b, i) => { const k = (tt * 1.4 + i / fk.bub.length) % 1; put(b, -60 + ((i * 41) % 120), 84 - k * 76, boilOn ? Math.sin(Math.PI * k) : 0); });
          const end = j === 1 && u > 0.26 ? [0, -140] : [216, -190];
          fk.steam.forEach((w, i) => { const k = (tt * 0.8 + i / 3) % 1; w.setAttribute('transform', `translate(${end[0] + k * 10},${(end[1] - k * 40).toFixed(1)}) scale(0.5)`); w.style.opacity = boilOn ? Math.sin(Math.PI * k).toFixed(2) : 0; });
        });
        // 0.3～0.36 瓶頸斷掉、移走
        const br = S.smoothstep(0.3, 0.38, u);
        fB.swan.setAttribute('transform', `translate(${(br * 60).toFixed(1)},${(-br * 40).toFixed(1)}) rotate(${(br * 18).toFixed(1)} 0 -140)`);
        fB.swan.style.opacity = (1 - S.smoothstep(0.33, 0.4, u)).toFixed(2);
        // 0.42～0.62 灰塵和微生物隨空氣進入
        dustA.forEach((d, i) => {
          const k = S.clamp((u - 0.42 - i * 0.012) / 0.16);
          if (k < 1) { const [x, y] = pathA(k); put(d, x, y, k > 0 ? 1 : 0); } else { const x = 143 + ((i * 7) % 20); put(d, x, (x < 146 ? S.lerp(-142, -120, (x - 124) / 22) : S.lerp(-120, -122, (x - 146) / 22)) + 4 - (i % 3), 1); }
        });
        dustB.forEach((d, i) => {
          const k = S.clamp((u - 0.42 - i * 0.012) / 0.16), x = ((i * 13) % 20) - 10;
          if (k < 0.55) put(d, x, -270 + (k / 0.55) * 270, k > 0 ? 1 : 0);
          else put(d, x + ((i * 29) % 120) - 60 * ((k - 0.55) / 0.45), 10 + ((k - 0.55) / 0.45) * (20 + (i * 17) % 50), 1);
        });
        // 0.62～0.8 很久以後：右邊的肉湯變混濁、微生物變多
        const tp = S.smoothstep(0.62, 0.82, u);
        hand.setAttribute('transform', `rotate(${(tp * 1080).toFixed(0)} 878 52)`);
        fB.broth.setAttribute('fill', mix('#d9a24a', '#8a7a46', tp));
        microbes.forEach((m) => { m.style.opacity = tp > m.th ? 1 : 0; });
        gasB.forEach((b, i) => { const k = (tt * 0.6 + i / 5) % 1; put(b, -40 + i * 20, 70 - k * 60, tp > 0.4 ? Math.sin(Math.PI * k) : 0); });
      }, 7, 's3', 'none');
      fl3.forEach((fk) => tl.to(fk.lamp, { opacity: 0, duration: 0.4 }, 's3+=1.65'));
      S.hide(tl, phase3[0], 's3+=1.85', 0.3);
      S.show(tl, phase3[1], 's3+=2', 0.3);
      S.show(tl, [airA, airB], 's3+=2.7', 0.4);
      S.show(tl, coB, 's3+=3.85', 0.4);
      S.show(tl, coA, 's3+=4.2', 0.4);
      S.hide(tl, phase3[1], 's3+=4.3', 0.3);
      S.show(tl, time3, 's3+=4.3', 0.4);
      S.show(tl, resA, 's3+=5.8', 0.4);
      S.show(tl, resB, 's3+=5.8', 0.4);
      S.show(tl, con3, 's3+=6.3', 0.5);

      // ===== 4 最早的生命：深海熱泉 =====
      const P4 = g(root, { opacity: 0 });
      const X4 = 30, Y4 = 30, W4 = 710, H4 = 660;
      const deep = g(P4, { 'clip-path': clip(P4, rectD(X4, Y4, W4, H4, 18)) });
      el('rect', { x: X4, y: Y4, width: W4, height: H4, fill: lin(deep, [[0, '#0c2438'], [0.5, '#06111e'], [1, '#03070c']]) }, deep);
      const r4 = S.rng(31);
      for (let i = 0; i < 70; i++) el('circle', { cx: f1(X4 + r4() * W4), cy: f1(Y4 + r4() * 560), r: f1(0.8 + r4() * 1.4), fill: '#9fc4dc', opacity: f1(0.12 + r4() * 0.2) }, deep);
      const smokes = [];
      // [x, 底, 頂, 底寬, 頂寬, 煙的高度, 彎曲]
      S.pill(P4, 690, 66, '補充', { size: 22, color: C.mute, edge: '#4a6272' });
      const vents = [[190, 606, 438, 46, 24, 100, 16], [470, 598, 390, 56, 30, 140, 24], [330, 602, 262, 72, 38, 170, 30]];
      // 先畫煙（在煙囪後面），再畫煙囪
      vents.forEach(([cx, , top, , wt, h, bend], i) => { const o = at(deep, cx, top - 7), inner = g(o); smoke(inner, wt * 1.05, h, bend, 60 + i); smokes.push(inner); });
      vents.forEach(([cx, base, top, wb, wt], i) => chimney(deep, cx, base, top, wb, wt, 40 + i));
      // 海床（岩石）
      const FLOOR = curve([[X4, 612, 1], [80, 600], [140, 608], [200, 596], [262, 604], [330, 590], [400, 600], [470, 588], [540, 598], [610, 590], [680, 600], [X4 + W4, 594, 1], [X4 + W4, Y4 + H4, 1], [X4, Y4 + H4, 1]]);
      P(deep, FLOOR, lin(deep, [[0, '#3a3034'], [0.2, '#221c1e'], [1, '#141012']]));
      L(deep, curve([[X4, 612], [80, 600], [140, 608], [200, 596], [262, 604], [330, 590], [400, 600], [470, 588], [540, 598], [610, 590], [680, 600], [X4 + W4, 594]], false), '#5a4c50', 2.5, { opacity: 0.7 });
      for (let i = 0; i < 9; i++) L(deep, `M ${60 + i * 78},${640 + (i % 3) * 14} q 18,-8 36,2 t 30,-4`, '#0c0a0b', 3, { opacity: 0.6 });
      // 細菌形成的菌毯、螃蟹
      [[262, 604, 46], [416, 598, 40], [640, 594, 58], [560, 598, 30]].forEach(([x, y, w]) => { el('ellipse', { cx: x, cy: y + 2, rx: w * 0.6, ry: 7, fill: '#e9e2b0', opacity: 0.28 }, deep); el('ellipse', { cx: x, cy: y + 1, rx: w * 0.4, ry: 4.5, fill: '#f4eec8', opacity: 0.45 }, deep); });
      crab(at(deep, 560, 588, 0.9));
      crab(at(deep, 252, 594, 0.75, -10));
      const pill4 = g(P4, { opacity: 0 });
      S.pill(pill4, 168, 72, '深海：陽光照不到', { size: 24, color: '#9fc4dc', edge: '#4a6c84' });
      const co4 = [
        S.callout(P4, 340, 330, 575, 150, '深海熱泉（海底火山噴口）', '#ffb070', { size: 24 }),
        S.callout(P4, 326, 222, 142, 300, '噴出的水溫度很高', '#ff9a6a', { size: 22 }),
      ];
      // 放大：菌毯裡的細菌
      const LX = 965, LY = 505, LR = 145, MX = 640, MY = 594;
      const zoom4 = g(P4, { opacity: 0 });
      el('circle', { cx: MX, cy: MY, r: 16, fill: 'none', stroke: C.hi, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, zoom4);
      const ang = Math.atan2(MY - LY, MX - LX), dist = Math.hypot(MX - LX, MY - LY), half = Math.acos(LR / dist);
      [ang - half, ang + half].forEach((a) => L(zoom4, `M ${MX + Math.cos(a + Math.PI) * 0},${MY} L ${f1(LX + Math.cos(a) * LR)},${f1(LY + Math.sin(a) * LR)}`, C.hi, 1.8, { 'stroke-dasharray': '6 6', opacity: 0.8 }));
      const lens = g(P4, { opacity: 0 });
      el('circle', { cx: LX, cy: LY, r: LR + 6, fill: '#0d1822', stroke: '#2b4252', 'stroke-width': 2 }, lens);
      const lensIn = g(lens, { 'clip-path': clip(lens, circD(LX, LY, LR)) });
      el('circle', { cx: LX, cy: LY, r: LR, fill: rad(lensIn, [[0, '#f2f8f4'], [1, '#c4ddd2']]) }, lensIn);
      const bac = g(lensIn);
      [[-70, -60, 56, 18, 20, 1], [10, -92, 50, 16, -30, 0], [72, -40, 58, 18, 70, 1], [-94, 20, 48, 16, 80, 0], [-20, 6, 60, 19, -10, 1], [60, 52, 50, 16, 35, 0], [-50, 84, 54, 17, -40, 0], [20, 106, 46, 15, 10, 0], [100, 98, 40, 15, -60, 0]].forEach(([x, y, l, w, a, fg]) => rod(bac, LX + x, LY + y, l, w, a, '#86c4a8', '#2f6f5a', fg));
      [[-22, -40, 11], [-8, -48, 10], [32, 4, 12], [44, 14, 10], [-98, -30, 10], [92, -92, 10], [-62, 126, 10], [114, 30, 9]].forEach(([x, y, r]) => coccus(bac, LX + x, LY + y, r, '#c79ac8', '#7a3f78'));
      el('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 5 }, lens);
      TM(lens, LX, LY + LR + 38, '細菌（放大很多倍＊）', 22, C.ink2);
      const card4 = g(P4, { opacity: 0 });
      card(card4, 760, 30, 410, 300, { stroke: C.hi });
      T(card4, 788, 76, '最早的生命（推測）', 28, C.hi, B);
      T(card4, 788, 118, '構造簡單的單細胞生物（像細菌）', 22, C.ink, B);
      const flow4 = g(card4);
      [['無機物', 825], ['有機物', 945], ['簡單的生命', 1087]].forEach(([s, x]) => S.pill(flow4, x, 166, s, { size: 22, padX: 10, color: s === '簡單的生命' ? '#9be58c' : C.ink, edge: '#4a6272' }));
      arrow(flow4, 873, 166, 897, 166, C.ink2, 3, 10);
      arrow(flow4, 993, 166, 1017, 166, C.ink2, 3, 10);
      const tl4 = g(card4, { opacity: 0 });
      L(tl4, 'M 788,206 L 1144,206', '#2b4252', 2);
      T(tl4, 788, 248, '地球形成：約 46 億年前＊', 22, C.ink2);
      T(tl4, 788, 290, '最早的生物化石：約 35 億年前＊', 22, C.ink2);

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        const gr = S.smoothstep(0, 0.3, u), wob = Math.sin(u * 40) * 0.03;
        smokes.forEach((s, i) => s.setAttribute('transform', `scale(${(0.6 + 0.4 * gr + wob * (i % 2 ? 1 : -1)).toFixed(3)},${(0.15 + 0.85 * gr).toFixed(3)})`));
        bac.setAttribute('transform', `translate(${(Math.sin(u * 30) * 2).toFixed(1)},${(Math.cos(u * 24) * 2).toFixed(1)})`);
      }, 6.2, 's4', 'none');
      S.show(tl, pill4, 's4+=0.8', 0.4);
      S.show(tl, co4[0], 's4+=1.3', 0.4);
      S.show(tl, co4[1], 's4+=1.9', 0.4);
      S.show(tl, zoom4, 's4+=2.6', 0.4);
      S.show(tl, lens, 's4+=3', 0.5);
      S.show(tl, card4, 's4+=3.8', 0.5);
      S.show(tl, tl4, 's4+=4.8', 0.5);

      // ===== 5 地球為什麼適合生物生存 =====
      const P5 = g(root, { opacity: 0 });
      const top5 = g(P5);
      card(top5, 30, 30, 1140, 300);
      const sky5 = g(top5, { 'clip-path': clip(top5, rectD(31, 31, 1138, 298, 15)) });
      el('circle', { cx: -40, cy: 150, r: 210, fill: rad(sky5, [[0.6, '#ffb84a', 0.35], [1, '#ffb84a', 0]]) }, sky5);
      el('circle', { cx: -40, cy: 150, r: 150, fill: rad(sky5, [[0, '#fffbe0'], [0.55, '#ffd75a'], [1, '#ff9d2e']]) }, sky5);
      T(top5, 40, 312, '太陽', 24, '#ffd166', B);
      L(top5, 'M 125,150 L 1150,150', '#3a5566', 2, { 'stroke-dasharray': '8 8' });
      T(top5, 1150, 64, '距離依比例，大小不依比例＊', 20, C.mute, { 'text-anchor': 'end' });
      const PL = [['水星', 'mercury', 237, 22, '太近、太熱', '#ff9a6a', '白天約 430 °C＊'], ['地球', 'earth', 670, 44, '溫度適當，有液態水', '#9be58c', '平均約 15 °C＊'], ['火星', 'mars', 1040, 30, '較遠、較冷，水結成冰', '#9fd8ff', '平均約 −60 °C＊']];
      const plG = PL.map(([n, k, x, r, d, col, t]) => {
        const pg = g(P5, { opacity: 0 });
        planet(at(pg, x, 150), r, k);
        TM(pg, x, 244, n, 28, C.ink, B);
        TM(pg, x, 278, d, 24, col, B);
        TM(pg, x, 310, t, 20, C.mute);
        return pg;
      });
      const ring5 = g(P5, { opacity: 0 });
      el('circle', { cx: 670, cy: 150, r: 56, fill: 'none', stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ring5);
      // 大氣
      const air5 = g(P5, { opacity: 0 });
      card(air5, 30, 350, 560, 340);
      const ad = g(air5, { 'clip-path': clip(air5, rectD(31, 351, 558, 338, 15)) });
      el('circle', { cx: 160, cy: 1000, r: 430, fill: rad(ad, [[0.8, '#6fb4f0', 0.5], [0.9, '#6fb4f0', 0.22], [1, '#6fb4f0', 0.04]]) }, ad);
      el('circle', { cx: 160, cy: 1000, r: 404, fill: 'none', stroke: '#b48cff', 'stroke-width': 8, opacity: 0.6 }, ad);
      el('circle', { cx: 160, cy: 1000, r: 350, fill: lin(ad, [[0, '#5fae4e'], [0.06, '#3d7a3a'], [0.2, '#2a5a8a']]) }, ad);
      T(air5, 44, 648, '大氣', 22, '#cfe8ff', B);
      T(air5, 262, 596, '臭氧層', 22, '#c9b0ff', B);
      T(air5, 216, 680, '地面', 22, '#e8f5d8', B);
      const uv5 = [[64, 430, 94, 593], [124, 424, 142, 590], [184, 430, 198, 648]].map(([a, b, c, d]) => uvRay(air5, a, b, c, d, '#c79bff', 3.5));
      const stops5 = g(air5, { opacity: 0 });
      [[94, 596], [142, 593]].forEach(([x, y]) => { for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283; L(stops5, `M ${f1(x + Math.cos(a) * 5)},${f1(y + Math.sin(a) * 5)} L ${f1(x + Math.cos(a) * 12)},${f1(y + Math.sin(a) * 12)}`, '#e0ccff', 2); } });
      T(air5, 56, 410, '紫外線', 22, '#c79bff', B);
      T(air5, 300, 400, '大氣的功能', 28, C.hi, B);
      const bul5 = ['・提供氧和二氧化碳', '・保溫，減少溫差', '・臭氧層吸收部分紫外線'].map((s, i) => { const bg = g(air5, { opacity: 0 }); T(bg, 300, 452 + i * 52, s, 24); return bg; });
      // 生存條件
      const need5 = g(P5, { opacity: 0 });
      card(need5, 610, 350, 560, 340);
      T(need5, 640, 400, '大多數生物生存需要', 28, C.hi, B);
      const NEEDS = [['陽光', (q) => sunIcon(q, 24)], ['空氣', windIcon], ['水', (q) => drop(at(q, 0, 2, 0.72), '#d8f0ff', '#3d8fe0', '#1d5a9a')], ['養分', apple], ['適當溫度', thermo]];
      const needG = NEEDS.map(([n, draw], i) => { const ng = g(need5, { opacity: 0 }), x = 666 + i * 112; draw(at(ng, x, 510)); TM(ng, x, 596, n, 24, C.ink, B); return ng; });
      T(need5, 640, 656, '例外：深海熱泉的細菌不靠陽光生活', 22, C.mute);
      S.pill(need5, 1044, 649, '補充', { size: 22, color: C.mute, edge: '#4a6272' });

      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      plG.forEach((pg, i) => S.show(tl, pg, `s5+=${0.7 + i * 0.7}`, 0.4));
      S.show(tl, ring5, 's5+=2.8', 0.4);
      S.show(tl, air5, 's5+=3.3', 0.4);
      uv5.forEach((uv, i) => S.drawOn(tl, uv.path, 0.8, `s5+=${3.6 + i * 0.12}`));
      S.show(tl, stops5, 's5+=4.4', 0.3);
      bul5.forEach((b, i) => S.show(tl, b, `s5+=${4.4 + i * 0.35}`, 0.35));
      S.show(tl, need5, 's5+=5.2', 0.4);
      needG.forEach((ng, i) => S.show(tl, ng, `s5+=${5.4 + i * 0.25}`, 0.35));

      // ===== 6 生物圈 =====
      const P6 = g(root, { opacity: 0 });
      const SX0 = 140, SX1 = 780, SY0 = 40, SY1 = 680, yk = (km) => 360 - km * 30;
      const sec = g(P6, { 'clip-path': clip(P6, rectD(SX0, SY0, SX1 - SX0, SY1 - SY0, 14)) });
      el('rect', { x: SX0, y: SY0, width: SX1 - SX0, height: 330, fill: lin(sec, [[0, '#08122a'], [0.5, '#1d3f6e'], [1, '#6aa8dc']]) }, sec);
      [[600, 270, 120, 26], [380, 300, 90, 20], [700, 214, 70, 16]].forEach(([x, y, w, h]) => P(sec, lobes([[x - w / 2, y], [x - w * 0.3, y - h * 0.8], [x, y - h], [x + w * 0.3, y - h * 0.7], [x + w / 2, y], [x, y + 3, 'L']], 0.6), '#e8f2fa', 'none', 0, { opacity: 0.55 }));
      // 岩石（陸地下方與海床）
      const ROCK = 'M 140,364 L 520,364 L 528,366 L 545,372 C 560,400 575,450 590,480 L 600,486 L 700,494 C 712,530 724,600 745,670 C 760,620 770,580 780,550 L 780,680 L 140,680 Z';
      P(sec, ROCK, lin(sec, [[0, '#5a4636'], [0.4, '#3e3128'], [1, '#2a211c']]));
      for (let i = 0; i < 5; i++) L(sec, `M 140,${420 + i * 52} C 260,${410 + i * 52} 400,${430 + i * 52} 560,${416 + i * 54}`, '#241b16', 2, { opacity: 0.45 });
      // 海水
      const SEA6 = 'M 520,362 L 780,362 L 780,550 C 770,580 760,620 745,670 C 724,600 712,530 700,494 L 600,486 L 590,480 C 575,450 560,400 545,372 L 528,366 Z';
      P(sec, SEA6, lin(sec, [[0, '#3b8fd0'], [0.2, '#1f5f98'], [0.45, '#0d2f58'], [1, '#040d1e']], 0, 1, { gradientUnits: 'userSpaceOnUse', x1: 0, y1: 362, x2: 0, y2: 670 }));
      const sseaIn = g(sec, { 'clip-path': clip(sec, SEA6) });
      const shaft = lin(sseaIn, [[0, '#ffffff', 0.14], [1, '#ffffff', 0]], 0, 1, { gradientUnits: 'userSpaceOnUse', x1: 0, y1: 362, x2: 0, y2: 470 });
      [[560, 600], [640, 680], [720, 760]].forEach(([a, b]) => P(sseaIn, `M ${a},362 L ${a + 16},362 L ${b - 14},470 L ${b - 44},470 Z`, shaft));
      L(sec, 'M 520,362 q 10,-4 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0', '#cfe8ff', 2, { opacity: 0.7 });
      // 高山
      const MT = curve([[136, 366, 1], [150, 352], [172, 318], [196, 276], [220, 230], [244, 180], [262, 140], [278, 112], [292, 94, 1], [306, 108], [322, 132], [344, 166], [366, 204], [388, 244], [410, 288], [430, 328], [446, 352], [462, 366, 1]]);
      P(sec, MT, '#77705f');
      const mtIn = g(sec, { 'clip-path': clip(sec, MT) });
      P(mtIn, 'M 130,300 C 170,292 200,306 232,296 C 300,302 380,292 420,300 C 440,296 460,302 470,300 L 470,380 L 130,380 Z', lin(mtIn, [[0, '#4f7a3e'], [1, '#3a6a32']]));
      P(mtIn, 'M 200,80 L 400,80 L 400,196 L 372,206 L 352,190 L 334,206 L 314,192 L 296,208 L 278,194 L 260,210 L 240,198 L 200,206 Z', '#eef4f8');
      P(mtIn, 'M 292,94 C 296,130 290,160 300,190 C 310,222 304,250 322,280 C 338,310 352,336 372,366 L 470,366 L 470,80 Z', '#1a1612', 'none', 0, { opacity: 0.3 });
      const rm = S.rng(23);
      for (let i = 0; i < 14; i++) {
        const t = 0.12 + (i / 14) * 0.8, left = i % 2 === 0, x0 = left ? S.lerp(292, 150, t) + 14 : S.lerp(292, 460, t) - 14, y0 = S.lerp(96, 360, t) - 6, len = 26 + rm() * 34, dx = (left ? -1 : 1) * (6 + rm() * 10);
        L(mtIn, `M ${f1(x0)},${f1(y0)} q ${f1(dx * 0.3)},${f1(len * 0.5)} ${f1(dx)},${f1(len)}`, left ? '#9a927e' : '#3a342c', 2, { opacity: 0.4 });
      }
      [[168, 330], [186, 318], [206, 326], [418, 326], [436, 340], [400, 316]].forEach(([x, y], i) => conifer(at(sec, x, y), 30 + (i % 2) * 6));
      // 低地、土壤
      P(sec, 'M 140,364 L 522,364 L 522,372 L 140,372 Z', '#4a301c');
      L(sec, 'M 456,364 L 522,364', '#6fbf4a', 3);
      [470, 512].forEach((x, i) => broadleaf(at(sec, x, 364), 34 + i * 4));
      // 生物
      const birds6 = g(sec);
      [[430, 186], [478, 204], [436, 232]].forEach(([x, y]) => goose(at(birds6, x, y, 0.8)));
      goose(at(birds6, 230, 266, 0.75));
      const fish6 = g(sec);
      [[610, 424], [636, 432], [622, 446], [650, 418], [662, 444]].forEach(([x, y]) => smallFish(at(fish6, x, y, 1)));
      [[550, 386], [557, 398], [566, 416]].forEach(([x, y], i) => L(sec, `M ${x},${y} C ${x + 6},${y - 6} ${x + 2},${y - 12} ${x + 8},${y - 18 - i * 2}`, '#4f9a3e', 3));
      deepFish(at(sec, 744, 566, 0.7));
      L(sec, 'M 140,60 L 780,60 M 140,660 L 780,660', '#7fe0a0', 2, { 'stroke-dasharray': '10 8', opacity: 0.7 });
      el('rect', { x: SX0, y: SY0, width: SX1 - SX0, height: SY1 - SY0, rx: 14, fill: 'none', stroke: '#2b4252', 'stroke-width': 2 }, P6);
      T(P6, 772, 352, '海平面', 20, '#cfe8ff', { 'text-anchor': 'end' });
      // 高度尺
      const scale6 = g(P6);
      L(scale6, `M 132,${yk(10)} L 132,${yk(-10)}`, C.ink2, 2.5);
      [[10, '+10 km'], [5, '+5 km'], [0, '0 km'], [-5, '−5 km'], [-10, '−10 km']].forEach(([k, s]) => { L(scale6, `M 124,${yk(k)} L 132,${yk(k)}`, C.ink2, 2.5); T(scale6, 118, yk(k) + 7, s, 20, k === 10 || k === -10 ? '#7fe0a0' : C.ink2, { 'text-anchor': 'end', class: 'mono' }); });
      // 土壤的放大圖
      const SLX = 330, SLY = 520, SLR = 98, SMX = 492, SMY = 366;
      const soil = g(P6, { opacity: 0 });
      el('circle', { cx: SMX, cy: SMY, r: 11, fill: 'none', stroke: C.hi, 'stroke-width': 2.5, 'stroke-dasharray': '4 4' }, soil);
      const sa = Math.atan2(SMY - SLY, SMX - SLX), sdist = Math.hypot(SMX - SLX, SMY - SLY), sh = Math.acos(SLR / sdist);
      [sa - sh, sa + sh].forEach((a) => L(soil, `M ${SMX},${SMY} L ${f1(SLX + Math.cos(a) * SLR)},${f1(SLY + Math.sin(a) * SLR)}`, C.hi, 1.8, { 'stroke-dasharray': '6 6', opacity: 0.8 }));
      el('circle', { cx: SLX, cy: SLY, r: SLR + 5, fill: '#0d1822' }, soil);
      const sIn = g(soil, { 'clip-path': clip(soil, circD(SLX, SLY, SLR)) });
      el('rect', { x: SLX - SLR, y: SLY - SLR, width: SLR * 2, height: 60, fill: '#9cc8ea' }, sIn);
      el('rect', { x: SLX - SLR, y: SLY - 40, width: SLR * 2, height: SLR + 40, fill: lin(sIn, [[0, '#6b4a2e'], [1, '#3e2a1a']]) }, sIn);
      const r6 = S.rng(17);
      for (let i = 0; i < 40; i++) el('circle', { cx: f1(SLX - SLR + r6() * SLR * 2), cy: f1(SLY - 34 + r6() * 130), r: f1(1 + r6() * 2), fill: r6() < 0.5 ? '#8a6a48' : '#2e1e12', opacity: 0.7 }, sIn);
      [[SLX - 50, SLY + 40, 12, 8], [SLX + 56, SLY + 10, 9, 6], [SLX + 20, SLY + 70, 14, 9], [SLX - 70, SLY - 6, 8, 5]].forEach(([x, y, rx, ry]) => el('ellipse', { cx: x, cy: y, rx, ry, fill: '#9a9488', stroke: '#5a564e', 'stroke-width': 1.2 }, sIn));
      for (let i = 0; i < 26; i++) { const x = SLX - SLR + 4 + i * 7.6; L(sIn, `M ${f1(x)},${SLY - 40} L ${f1(x + (i % 2 ? 3 : -3))},${SLY - 52 - (i % 3) * 5}`, '#6fbf4a', 2.4); }
      const spX = SLX - 6;
      L(sIn, `M ${spX},${SLY - 40} L ${spX},${SLY - 70}`, '#5aa04d', 3.4);
      [-1, 1].forEach((sd) => { const lf = at(sIn, spX, SLY - 70, 1, sd > 0 ? -38 : -142); P(lf, 'M 0,0 C 6,-8 18,-8 24,0 C 18,8 6,8 0,0 Z', '#7cc35a', '#3f7a2e', 1.2); });
      L(sIn, `M ${spX},${SLY - 40} C ${spX - 2},${SLY - 10} ${spX + 6},${SLY + 20} ${spX + 2},${SLY + 60} M ${spX},${SLY - 20} C ${spX - 14},${SLY - 6} ${spX - 26},${SLY + 4} ${spX - 34},${SLY + 22} M ${spX + 1},${SLY + 4} C ${spX + 14},${SLY + 14} ${spX + 24},${SLY + 22} ${spX + 30},${SLY + 40} M ${spX + 2},${SLY + 30} C ${spX - 8},${SLY + 42} ${spX - 14},${SLY + 56} ${spX - 16},${SLY + 74}`, '#f0e2c0', 2.2);
      L(sIn, `M ${SLX + 30},${SLY - 39} C ${SLX + 40},${SLY - 10} ${SLX + 70},${SLY - 4} ${SLX + 64},${SLY + 30} C ${SLX + 60},${SLY + 44} ${SLX + 52},${SLY + 50} ${SLX + 46},${SLY + 54}`, '#2a1a10', 9, { opacity: 0.55, 'stroke-linecap': 'butt' });
      el('ellipse', { cx: SLX + 34, cy: SLY + 58, rx: 22, ry: 11, fill: '#2a1a10', opacity: 0.55 }, sIn);
      [[SLX + 28, SLY + 58], [SLX + 38, SLY + 60]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 3.4, ry: 2, fill: '#f4eedc' }, sIn));
      ant(at(sIn, SLX + 52, SLY - 4, 1.2, 70));
      ant(at(sIn, SLX + 60, SLY + 40, 1.2, 120));
      el('circle', { cx: SLX, cy: SLY, r: SLR, fill: 'none', stroke: '#e8d4a8', 'stroke-width': 4 }, soil);
      TM(soil, SLX, 652, '岩石圈的表層：土壤（放大＊）', 22, '#e8d4a8', B);
      const sph6 = [
        g(P6, { opacity: 0 }), g(P6, { opacity: 0 }),
      ];
      S.pill(sph6[0], 640, 150, '大氣圈的下層', { size: 24, color: '#bfe3ff', edge: '#8fc8f0' });
      S.pill(sph6[1], 668, 394, '水圈', { size: 24, color: '#8fd0ff', edge: '#5fb8ff' });
      const few6 = [g(P6, { opacity: 0 }), g(P6, { opacity: 0 })];
      S.pill(few6[0], 420, 98, '高山：空氣稀薄、寒冷', { size: 22, color: C.ink, edge: '#8aa1ae' });
      S.callout(few6[1], 742, 600, 630, 612, '深海：沒有陽光', C.ink, { size: 22 }).style.opacity = 1;
      // 右欄
      const bio6 = g(P6, { opacity: 0 });
      const brk = L(bio6, `M 806,${yk(10)} L 796,${yk(10)} M 806,${yk(10)} L 806,${yk(-10)} M 806,${yk(-10)} L 796,${yk(-10)}`, '#7fe0a0', 5);
      T(bio6, 830, 96, '生物圈', 36, '#7fe0a0', B);
      T(bio6, 830, 134, '海平面上下各約 10 km＊', 22, C.ink);
      const list6 = g(P6, { opacity: 0 });
      T(list6, 830, 196, '包括：', 24, C.ink2, B);
      [['大氣圈的下層', '#8fc8f0'], ['整個水圈', '#3b8fd0'], ['岩石圈的表層（土壤）', '#8a5a34']].forEach(([s, col], i) => { el('rect', { x: 832, y: 216 + i * 46, width: 20, height: 20, rx: 4, fill: col }, list6); T(list6, 862, 234 + i * 46, s, 24); });
      const dist6 = g(P6, { opacity: 0 });
      el('rect', { x: 822, y: 380, width: 348, height: 300, rx: 16, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, dist6);
      T(dist6, 844, 424, '陽光、空氣、水的分布', 26, C.hi, B);
      T(dist6, 844, 460, '影響生物的分布', 26, C.hi, B);
      T(dist6, 844, 516, '地表附近、淺海：', 22, C.ink);
      T(dist6, 844, 548, '條件充足，生物最多', 22, '#9be58c', B);
      T(dist6, 844, 604, '高山頂、深海：', 22, C.ink);
      T(dist6, 844, 636, '條件不足，生物較少', 22, '#ffb38a', B);

      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.5);
      S.drive(tl, (u) => {
        birds6.setAttribute('transform', `translate(${(u * 26).toFixed(1)},${(Math.sin(u * 12) * 3).toFixed(1)})`);
        fish6.setAttribute('transform', `translate(${(-u * 18).toFixed(1)},${(Math.sin(u * 16) * 2).toFixed(1)})`);
      }, 6, 's6', 'none');
      S.show(tl, bio6, 's6+=0.9', 0.4);
      S.drawOn(tl, brk, 1, 's6+=0.9');
      S.show(tl, sph6[0], 's6+=1.7', 0.4);
      S.show(tl, sph6[1], 's6+=2.1', 0.4);
      S.show(tl, list6, 's6+=2.1', 0.4);
      S.show(tl, soil, 's6+=2.7', 0.5);
      S.show(tl, few6[0], 's6+=3.6', 0.4);
      S.show(tl, few6[1], 's6+=4', 0.4);
      S.show(tl, dist6, 's6+=4.6', 0.5);

      return {
        tl,
        notes: [
          '＊約 46 億年是推算值。補充：「水蒸氣、甲烷、氨、氫」是米勒採用的假設，後來科學家對原始大氣成分有不同看法（可能有較多二氧化碳和氮），但都認為當時幾乎沒有氧。早期地球火山活動頻繁、常有閃電、紫外線很強，水蒸氣凝結降雨形成原始海洋。',
          '補充：維生素也是有機物；醣類、蛋白質、脂質在第三章「食物中的養分」會再介紹。注意：二氧化碳雖然含碳，仍屬於無機物；一氧化碳也一樣。',
          '＊約一週是米勒實驗進行的時間。米勒（1953 年）把模擬原始大氣的氣體放進燒瓶，加熱水產生水蒸氣、用放電模擬閃電，再冷凝回到水中。補充：米勒的老師尤里也參與研究，所以也叫「米勒－尤里實驗」。注意：這只說明有機物可能自然形成，胺基酸還不是生命。',
          '＊時間是示意。巴斯德約在 1860 年代做這個實驗。肉湯先煮沸，殺死原有的微生物；彎曲的瓶頸讓空氣能進出，但灰塵和微生物被擋在彎曲處，所以肉湯不腐敗並不是因為沒有空氣。瓶頸打斷後，微生物落入，肉湯就腐敗了。',
          '＊示意：細菌實際只有約 1～數 μm；最早的生物化石約 35 億年前＊，年代是約略值（和第九章「化石」相同）。深海熱泉是海底火山的噴口，溫度高、沒有陽光。「無機物 → 有機物 → 簡單的生命」是推測的過程，經過非常長的時間。補充：熱泉的細菌利用噴出的化學物質獲得能量，不靠陽光。（補充）後來出現能行光合作用的藍綠菌，放出氧，大氣中的氧才慢慢增加。',
          '＊距離依比例畫，行星大小不依比例；溫度是約略值。水星離太陽太近，白天很熱、夜晚約 −180 °C；火星較遠較冷，水大多是兩極和地下的冰。地球與太陽的距離約 1.5 億 km。臭氧層能吸收部分紫外線。大氣能保溫，還提供氧和二氧化碳。',
          '＊示意：地球半徑約 6400 km，生物圈只是表面薄薄的一層；土壤圖放大了很多倍。陽光、空氣、水的分布影響生物的分布：深海沒有陽光、高山空氣稀薄又寒冷，生物都比較少。補充：大多數生物集中在地表附近和有陽光照到的淺海（約 200 m 以內＊）。',
        ],
        steps: [
          '地球約在 <b>46 億年前</b>＊形成。科學家推測原始大氣含有<b>水蒸氣、甲烷、氨、氫</b>等，沒有氧。',
          '<b>有機物</b>大多是含碳的化合物，例如<b>醣類、蛋白質、脂質</b>，是構成生物體的重要物質；<b>無機物</b>例如水、氧、二氧化碳和礦物質（鹽類）。',
          '（補充）<b>米勒</b>的模擬實驗：在模擬原始地球的條件下，水中出現了<b>胺基酸</b>等有機物，表示<b>無機物可以形成有機物</b>。',
          '（補充）<b>巴斯德</b>的<b>鵝頸瓶</b>實驗：微生物進不去，肉湯就不腐敗。可見現今的生物都由<b>原有的生物</b>產生，不會<b>自然發生</b>。',
          '（補充）科學家推測<b>最早的生命</b>是構造簡單的<b>單細胞生物</b>（像細菌）；環境和早期地球相似的<b>深海熱泉</b>，現在仍有細菌生活。',
          '地球和太陽的<b>距離適中</b>，溫度適當，才有<b>液態水</b>。大多數生物生存需要<b>陽光、空氣、水、養分和適當的溫度</b>。',
          '地球上有生物生存的範圍叫<b>生物圈</b>：<b>大氣圈的下層、整個水圈和岩石圈的表層</b>（土壤），大約是海平面上下各 10 km＊。',
        ],
      };
    },
  });
})();
