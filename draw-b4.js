/* 第九章（七下 4）「形形色色的生物」共用圖形：微生物、植物、動物（接近課本插圖）。
   每個函式 D.xxx(p, x, y, s, opts) 在 p 裡畫一個生物，原點是生物的中心（另有註明者除外），
   回傳外層群組 G；G.pt(lx, ly) 把生物自己的座標換算成舞台座標（放標籤用）。 */
(() => {
  const { el, g, C } = S;
  const D = (S.B4 = {});
  let uidN = 0;
  const uid = () => 'b4g' + uidN++;
  const R = Math.PI / 180;

  D.put = (p, x, y, s = 1, r = 0) => {
    const G = S.place(g(p), { x, y, s, r });
    G.pt = (lx, ly) => [x + s * (lx * Math.cos(r * R) - ly * Math.sin(r * R)), y + s * (lx * Math.sin(r * R) + ly * Math.cos(r * R))];
    return G;
  };
  // 漸層（物件外框座標，0～1），回傳 url(#id)
  D.lg = (p, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => {
    const id = uid(), gr = el('linearGradient', { id, x1, y1, x2, y2 }, el('defs', {}, p));
    stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, gr));
    return `url(#${id})`;
  };
  D.rg = (p, stops, cx = 0.5, cy = 0.5, r = 0.5) => {
    const id = uid(), gr = el('radialGradient', { id, cx, cy, r }, el('defs', {}, p));
    stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, gr));
    return `url(#${id})`;
  };
  D.clip = (p, d) => { const id = uid(); el('path', { d }, el('clipPath', { id }, el('defs', {}, p))); return `url(#${id})`; };
  D.arrow = (p, x1, y1, x2, y2, color, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };
  // 開放的平滑折線（Catmull-Rom）
  D.curve = (P, t = 1 / 6) => {
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      d += `C${(p1[0] + (p2[0] - p0[0]) * t).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) * t).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * t).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) * t).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };
  // 沿中心線畫粗細不同的條帶（身體、葉片、藻體）：pts 中心線，wFn(t) 半寬
  D.ribbon = (pts, wFn) => {
    const L = [], Rr = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
      const w = wFn(i / (n - 1));
      L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); Rr.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
    }
    return D.curve(L) + ' L' + D.curve(Rr.reverse()).slice(1) + ' Z';
  };
  const capD = (w, h) => { const r = h / 2; return `M ${-w / 2 + r},${-r} L ${w / 2 - r},${-r} A ${r},${r} 0 0 1 ${w / 2 - r},${r} L ${-w / 2 + r},${r} A ${r},${r} 0 0 1 ${-w / 2 + r},${-r} Z`; };
  D.capD = capD;
  const DNA = '#c9b8ff';
  // 遺傳物質：在範圍內纏繞的一條細絲（隨機走動再平滑）
  const tangle = (G, cx, cy, rx, ry, seeds = [[0, 0.3]], sw = 3.5) => seeds.forEach(([ph], k) => {
    const rr = S.rng(11 + Math.round(ph * 10) + k * 7);
    let px = 0, py = 0, a = ph;
    const P = [];
    for (let i = 0; i < 95; i++) {
      P.push([cx + px * rx, cy + py * ry]);
      a += (rr() - 0.5) * 1.3;
      const out = Math.hypot(px, py);
      if (out > 0.78) a = Math.atan2(-py, -px) + (rr() - 0.5) * 0.9;
      px += Math.cos(a) * 0.16; py += Math.sin(a) * 0.16;
    }
    el('path', { d: D.curve(P), fill: 'none', stroke: DNA, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
  });

  // =====================================================================
  //  原核生物
  // =====================================================================
  // 細菌（桿菌）的構造圖：寬約 420、高約 180
  D.bacteriumCell = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: capD(420, 170), fill: 'rgba(217,194,124,0.12)', stroke: C.wall, 'stroke-width': 10 }, G);
    el('path', { d: capD(394, 144), fill: D.rg(G, [[0, '#2c6058'], [1, '#163633']], 0.45, 0.4, 0.7), stroke: C.membrane, 'stroke-width': 4 }, G);
    const r = S.rng(5);
    for (let i = 0; i < 70; i++) { const px = -175 + r() * 350, py = -58 + r() * 116; if (Math.hypot(px / 100, py / 46) < 1 || Math.abs(py) > 60 - Math.max(0, Math.abs(px) - 125) * 0.9) continue; el('circle', { cx: px, cy: py, r: 2.4, fill: '#8fd3c4', opacity: 0.5 }, G); }
    tangle(G, 0, 0, 82, 34);
    G.pts = { wall: [-120, -84], membrane: [150, 64], dna: [70, -14], cyto: [-150, 22] };
    return G;
  };
  // 真核細胞（動物細胞）：寬約 300
  D.eukCell = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: S.smoothPath(S.blobPts(0, 0, 150, 118, 48)), fill: D.rg(G, [[0, '#24524c'], [1, '#14302d']], 0.45, 0.4, 0.7), stroke: C.membrane, 'stroke-width': 4 }, G);
    [[-88, 40, 20], [70, 62, -30], [92, -50, 60], [-70, -62, 10]].forEach(([mx, my, mr]) => {
      const m = S.place(g(G), { x: mx, y: my, r: mr });
      el('ellipse', { cx: 0, cy: 0, rx: 22, ry: 11, fill: '#7a4a33', stroke: C.mito, 'stroke-width': 2.5 }, m);
      el('path', { d: 'M -14,0 l 5,-6 l 5,12 l 5,-12 l 5,12 l 5,-6', fill: 'none', stroke: C.mito, 'stroke-width': 1.6 }, m);
    });
    el('circle', { cx: 6, cy: -4, r: 54, fill: 'rgba(167,150,255,0.28)', stroke: C.nucleus, 'stroke-width': 6 }, G);
    tangle(G, 0, 0, 30, 24, [[0.4, 1.2]], 2.5);
    G.pts = { nucleus: [6, -58], membrane: [-140, 30] };
    return G;
  };
  const BAC = ['#c9f2e6', '#4fb3a0', '#1f6157'];
  const bacFill = (G) => D.rg(G, [[0, BAC[0]], [0.55, BAC[1]], [1, BAC[2]]], 0.38, 0.32, 0.75);
  // 球菌：一串葡萄狀（約 100 × 90）
  D.cocci = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s), f = bacFill(G);
    [[-34, -16], [-8, -26], [18, -30], [42, -16], [-22, 8], [4, 2], [30, 8], [-6, 28], [20, 32], [50, 12], [-46, 12]]
      .forEach(([a, b]) => el('circle', { cx: a, cy: b, r: 14, fill: f, stroke: BAC[2], 'stroke-width': 1.5 }, G));
    return G;
  };
  // 桿菌（約 160 × 90）
  D.bacilli = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    [[-40, -26, 20], [34, -30, -15], [-6, 4, 60], [44, 20, 10], [-50, 30, -25]].forEach(([a, b, r]) => {
      const rod = S.place(g(G), { x: a, y: b, r });
      el('path', { d: capD(66, 22), fill: bacFill(rod), stroke: BAC[2], 'stroke-width': 1.5 }, rod);
    });
    return G;
  };
  // 螺旋菌（約 150 × 70）
  D.spirilla = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    [[-6, -16, 0], [10, 22, 8]].forEach(([dx, dy, r]) => {
      const sp = S.place(g(G), { x: dx, y: dy, r });
      const P = []; for (let i = 0; i <= 40; i++) { const t = i / 40; P.push([-72 + 144 * t, 12 * Math.sin(t * Math.PI * 5)]); }
      el('path', { d: D.curve(P), fill: 'none', stroke: BAC[2], 'stroke-width': 15, 'stroke-linecap': 'round' }, sp);
      el('path', { d: D.curve(P), fill: 'none', stroke: BAC[1], 'stroke-width': 12, 'stroke-linecap': 'round' }, sp);
      el('path', { d: D.curve(P), fill: 'none', stroke: BAC[0], 'stroke-width': 3.5, 'stroke-linecap': 'round', transform: 'translate(-1,-3)', opacity: 0.8 }, sp);
    });
    return G;
  };
  const CY = ['#b9f0d6', '#3ea58c', '#1c5e50'];
  // 念珠藻（藍綠菌）：一串念珠，外面有膠質（約 320 × 120）
  D.nostoc = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const P = []; for (let i = 0; i <= 60; i++) { const t = i / 60; P.push([-150 + 300 * t, 36 * Math.sin(t * Math.PI * 2 + 0.3)]); }
    el('path', { d: D.curve(P), fill: 'none', stroke: 'rgba(150,225,200,0.16)', 'stroke-width': 54, 'stroke-linecap': 'round' }, G);
    const path = el('path', { d: D.curve(P), fill: 'none' }, G);
    const L = path.getTotalLength(), f = D.rg(G, [[0, CY[0]], [0.55, CY[1]], [1, CY[2]]], 0.38, 0.32, 0.75);
    for (let s2 = 6; s2 < L - 4; s2 += 25) { const q = path.getPointAtLength(s2); el('circle', { cx: q.x, cy: q.y, r: 12.5, fill: f, stroke: CY[2], 'stroke-width': 1.5 }, G); }
    return G;
  };
  // 顫藻（藍綠菌）：一條由許多扁圓細胞相連的絲（約 300 × 30）
  D.oscillatoria = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    el('path', { d: capD(300, 28), fill: D.lg(G, [[0, '#7fd6b8'], [0.45, '#3ea58c'], [1, '#1f6a58']]), stroke: CY[2], 'stroke-width': 1.5 }, G);
    for (let xx = -138; xx <= 138; xx += 8) el('line', { x1: xx, y1: -12, x2: xx, y2: 12, stroke: '#1c5e50', 'stroke-width': 1.3 }, G);
    return G;
  };
  // 藍綠菌的一個細胞（放大）：沒有細胞核、沒有葉綠體，葉綠素分布在細胞質的膜上（約 240 × 200）
  D.cyanoCell = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('rect', { x: -120, y: -100, width: 240, height: 200, rx: 70, fill: 'rgba(150,225,200,0.12)', stroke: 'rgba(150,225,200,0.35)', 'stroke-width': 10 }, G);
    el('rect', { x: -104, y: -84, width: 208, height: 168, rx: 58, fill: 'rgba(217,194,124,0.1)', stroke: C.wall, 'stroke-width': 6 }, G);
    el('rect', { x: -96, y: -76, width: 192, height: 152, rx: 52, fill: '#173a30', stroke: C.membrane, 'stroke-width': 3 }, G);
    [[176, 136, 46], [150, 110, 36], [124, 84, 26]].forEach(([w, h, r]) => el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: r, fill: 'none', stroke: '#6fce62', 'stroke-width': 4, 'stroke-dasharray': '22 6' }, G));
    tangle(G, 0, 0, 34, 20, [[0.8, 0.2]], 3);
    G.pts = { pigment: [74, -40], dna: [20, 14], wall: [-60, -86] };
    return G;
  };
  // 植物細胞（小，對照用）：約 240 × 200
  D.plantCellMini = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('rect', { x: -120, y: -100, width: 240, height: 200, rx: 18, fill: 'rgba(217,194,124,0.12)', stroke: C.wall, 'stroke-width': 8 }, G);
    el('rect', { x: -110, y: -90, width: 220, height: 180, rx: 12, fill: '#16302a', stroke: C.membrane, 'stroke-width': 3 }, G);
    el('rect', { x: -60, y: -44, width: 150, height: 110, rx: 30, fill: 'rgba(98,168,255,0.2)', stroke: C.vacuole, 'stroke-width': 2.5 }, G);
    el('circle', { cx: -72, cy: -50, r: 24, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 4 }, G);
    [[-88, 20, 70], [-72, 66, 20], [-20, 78, 0], [40, 78, 0], [96, 40, 80], [96, -30, 100], [40, -70, 0], [-18, -72, 10]].forEach(([cx, cy, r]) => {
      const c = S.place(g(G), { x: cx, y: cy, r });
      el('ellipse', { cx: 0, cy: 0, rx: 15, ry: 8, fill: '#4fae4a', stroke: '#9be58c', 'stroke-width': 1.5 }, c);
      [-7, 0, 7].forEach((dx) => el('line', { x1: dx, y1: -4, x2: dx, y2: 4, stroke: '#1f5a24', 'stroke-width': 2 }, c));
    });
    G.pts = { chloro: [96, -30], nucleus: [-72, -74] };
    return G;
  };

  // =====================================================================
  //  病毒
  // =====================================================================
  // 病毒顆粒：二十面體的蛋白質外殼（中心在原點，半徑約 60＋棘突）
  D.virus = (p, x, y, s = 1, { core = true, spikes = true } = {}) => {
    const G = D.put(p, x, y, s);
    const V = []; for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * R; V.push([Math.cos(a) * 60, Math.sin(a) * 60]); }
    if (spikes) V.forEach(([vx, vy]) => { const m = Math.hypot(vx, vy); el('line', { x1: vx, y1: vy, x2: vx * (1 + 22 / m), y2: vy * (1 + 22 / m), stroke: '#f6c7dc', 'stroke-width': 3 }, G); el('circle', { cx: vx * (1 + 26 / m), cy: vy * (1 + 26 / m), r: 5, fill: '#f6c7dc' }, G); });
    el('path', { d: 'M' + V.map((v) => v.join(',')).join(' L') + ' Z', fill: D.rg(G, [[0, '#f7b9d4'], [1, '#b0507e']], 0.4, 0.35, 0.8), stroke: '#ffd6e8', 'stroke-width': 3, 'stroke-linejoin': 'round', 'fill-opacity': core ? 0.55 : 0.9 }, G);
    const T = [0, 2, 4].map((k) => [V[k][0] * 0.42, V[k][1] * 0.42]);
    el('path', { d: `M ${T[0]} L ${T[1]} L ${T[2]} Z`, fill: 'none', stroke: '#ffd6e8', 'stroke-width': 2, opacity: 0.8 }, G);
    [[0, 0], [0, 1], [0, 5], [1, 1], [1, 2], [1, 3], [2, 3], [2, 4], [2, 5]].forEach(([t, v]) => el('line', { x1: T[t][0], y1: T[t][1], x2: V[v][0], y2: V[v][1], stroke: '#ffd6e8', 'stroke-width': 2, opacity: 0.8 }, G));
    if (core) { const P = []; for (let i = 0; i <= 80; i++) { const t = i / 80, a = t * Math.PI * 8; P.push([Math.cos(a) * (8 + 26 * t) * 0.9, Math.sin(a) * (8 + 26 * t) * 0.9]); } el('path', { d: D.curve(P), fill: 'none', stroke: '#ffe08a', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, G); }
    G.pts = { coat: [52, -30], core: [10, 12] };
    return G;
  };

  // =====================================================================
  //  原生生物
  // =====================================================================
  const CILIA = '#9fe8da';
  // 草履蟲：前端（左）較窄、後端較寬，腹面有口溝；長約 350
  D.paramecium = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const P = [[-172, 0], [-162, -26], [-124, -46], [-62, -58], [0, -62], [70, -62], [128, -54], [166, -30], [178, 0], [170, 32], [136, 56], [80, 66], [28, 64], [-2, 54], [-34, 40], [-76, 34], [-118, 30], [-154, 22]];
    const d = S.smoothPath(P);
    const tmp = el('path', { d, fill: 'none' }, G), L = tmp.getTotalLength();
    for (let k = 0; k < 84; k++) {
      const a = tmp.getPointAtLength((k / 84) * L), b = tmp.getPointAtLength(((k / 84) * L + 2) % L);
      let nx = b.y - a.y, ny = -(b.x - a.x); const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
      const bx = (b.x - a.x) / 2, by = (b.y - a.y) / 2; // 往後擺
      el('line', { x1: a.x, y1: a.y, x2: a.x + nx * 12 + bx * 3, y2: a.y + ny * 12 + by * 3, stroke: CILIA, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, G);
    }
    tmp.remove();
    el('path', { d, fill: D.rg(G, [[0, '#2f6a5f'], [1, '#183a35']], 0.5, 0.4, 0.7), stroke: C.membrane, 'stroke-width': 3.5 }, G);
    // 口溝與胞口
    el('path', { d: 'M -60,36 C -30,34 -6,40 14,30 C 26,24 30,16 30,10', fill: 'none', stroke: '#7fd3c2', 'stroke-width': 3 }, G);
    el('circle', { cx: 32, cy: 6, r: 8, fill: 'rgba(201,160,90,0.7)', stroke: '#e0c080', 'stroke-width': 1.5 }, G);
    // 食泡
    [[-40, -8, 8], [-82, 6, 7], [86, 30, 7], [110, -18, 6], [-6, -34, 7]].forEach(([cx, cy, rr]) => el('circle', { cx, cy, r: rr, fill: 'rgba(201,160,90,0.65)', stroke: '#e0c080', 'stroke-width': 1.5 }, G));
    // 伸縮泡（星形）
    [[-112, -14], [124, -4]].forEach(([cx, cy]) => {
      for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2; el('path', { d: `M ${cx},${cy} L ${cx + Math.cos(a - 0.12) * 22},${cy + Math.sin(a - 0.12) * 22} L ${cx + Math.cos(a) * 26},${cy + Math.sin(a) * 26} L ${cx + Math.cos(a + 0.12) * 22},${cy + Math.sin(a + 0.12) * 22} Z`, fill: 'rgba(98,168,255,0.5)' }, G); }
      el('circle', { cx, cy, r: 10, fill: 'rgba(98,168,255,0.65)', stroke: C.vacuole, 'stroke-width': 1.5 }, G);
    });
    // 細胞核（大核＋小核）
    el('path', { d: 'M 18,-10 C 18,-34 76,-38 82,-14 C 86,4 66,4 52,0 C 38,-4 18,10 18,-10 Z', fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, G);
    el('circle', { cx: 74, cy: -32, r: 6, fill: '#7b6ad6', stroke: C.nucleus, 'stroke-width': 1.5 }, G);
    G.pts = { cilia: [-62, -72], nucleus: [50, -24], groove: [-30, 40], cv: [-112, -14] };
    return G;
  };
  // 變形蟲：有數個偽足（約 260 × 220）
  D.amoeba = (p, x, y, s = 1, ph = 0) => {
    const G = D.put(p, x, y, s);
    const lobes = [[-2.55, 0.42, 0.36], [-1.35, 0.3, 0.32], [0.0, 0.5, 0.34], [1.3, 0.26, 0.3], [2.3, 0.36, 0.34]];
    const rad = (a) => { let k = 0.8; lobes.forEach(([c, A, w]) => { let da = Math.atan2(Math.sin(a - c - ph), Math.cos(a - c - ph)); k += A * Math.exp(-((da / w) ** 4)); }); return 92 * k * (1 + 0.025 * Math.sin(7 * a + 1)); };
    const P = []; for (let i = 0; i < 90; i++) { const a = (i / 90) * Math.PI * 2; P.push([Math.cos(a) * rad(a), Math.sin(a) * rad(a) * 0.85]); }
    el('path', { d: S.smoothPath(P), fill: D.rg(G, [[0, '#2d5f57'], [0.8, '#1d423d'], [1, '#2a5a52']], 0.5, 0.5, 0.6), stroke: C.membrane, 'stroke-width': 3.5 }, G);
    const rr = S.rng(17);
    for (let i = 0; i < 150; i++) { const a = rr() * Math.PI * 2, f = Math.sqrt(rr()) * 0.78; el('circle', { cx: Math.cos(a) * rad(a) * f, cy: Math.sin(a) * rad(a) * 0.85 * f, r: 1.8, fill: '#9fe8da', opacity: 0.45 }, G); }
    el('circle', { cx: -14, cy: 10, r: 26, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, G);
    el('circle', { cx: 44, cy: -30, r: 14, fill: 'rgba(98,168,255,0.5)', stroke: C.vacuole, 'stroke-width': 2 }, G);
    el('circle', { cx: -54, cy: -30, r: 15, fill: 'rgba(201,160,90,0.35)', stroke: '#e0c080', 'stroke-width': 1.5 }, G);
    el('ellipse', { cx: -54, cy: -30, rx: 8, ry: 5, fill: '#6fae4a' }, G);
    const tip = lobes[2][0] + ph;
    G.pts = { pseudo: [Math.cos(tip) * rad(tip) * 0.96, Math.sin(tip) * rad(tip) * 0.85 * 0.96], nucleus: [-14, 10] };
    return G;
  };
  // 眼蟲：紡錘形，前端（左）有一條鞭毛（身體長約 300，加鞭毛約 480）
  D.euglena = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const body = 'M -150,0 C -150,-28 -112,-42 -60,-42 C 10,-40 90,-22 150,0 C 90,22 10,40 -60,42 C -112,42 -150,28 -150,0 Z';
    el('path', { d: 'M -146,-8 C -190,-36 -214,20 -252,-6 S -300,-44 -336,-12', fill: 'none', stroke: CILIA, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, G);
    el('path', { d: body, fill: D.rg(G, [[0, '#2d6248'], [1, '#183a2c']], 0.45, 0.4, 0.7), stroke: '#8fe0a6', 'stroke-width': 3.5 }, G);
    const cl = D.clip(G, body);
    const st = g(G, { 'clip-path': cl });
    for (let k = -200; k < 200; k += 18) el('line', { x1: k, y1: -50, x2: k + 40, y2: 50, stroke: '#8fe0a6', 'stroke-width': 1.2, opacity: 0.35 }, st);
    el('ellipse', { cx: -132, cy: -6, rx: 12, ry: 8, fill: 'rgba(200,240,220,0.25)', stroke: '#8fe0a6', 'stroke-width': 1.2 }, G);
    [[-84, -18, 20], [-60, 18, -30], [-26, -24, 40], [6, 22, 10], [34, -16, -20], [62, 12, 30], [88, -6, 0], [-96, 14, 60], [112, 4, 10]].forEach(([cx, cy, rr]) => {
      const c = S.place(g(G), { x: cx, y: cy, r: rr });
      el('ellipse', { cx: 0, cy: 0, rx: 13, ry: 7, fill: '#6fce62', stroke: '#2f7a3a', 'stroke-width': 1.2 }, c);
    });
    el('circle', { cx: -22, cy: 4, r: 17, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, G);
    el('ellipse', { cx: -116, cy: -20, rx: 8, ry: 6, fill: '#ff5a4a' }, G);
    G.pts = { flag: [-252, -6], chloro: [62, 12], eye: [-116, -20], nucleus: [-22, 4] };
    return G;
  };
  const DIA = ['#f2d78a', '#c79a3a', '#8a6420'];
  // 矽藻（羽紋矽藻，船形，長約 240）
  D.diatomP = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const d = 'M -120,0 C -96,-34 96,-34 120,0 C 96,34 -96,34 -120,0 Z';
    el('path', { d, fill: D.lg(G, [[0, DIA[0]], [0.5, DIA[1]], [1, DIA[2]]]), stroke: '#fff0c0', 'stroke-width': 2.5 }, G);
    const st = g(G, { 'clip-path': D.clip(G, d) });
    for (let xx = -110; xx <= 110; xx += 9) if (Math.abs(xx) > 8) [-1, 1].forEach((sg) => el('line', { x1: xx, y1: sg * 5, x2: xx * 1.02, y2: sg * 30, stroke: '#7a5418', 'stroke-width': 2.2, opacity: 0.55 }, st));
    el('line', { x1: -104, y1: 0, x2: -10, y2: 0, stroke: '#7a5418', 'stroke-width': 2 }, G);
    el('line', { x1: 10, y1: 0, x2: 104, y2: 0, stroke: '#7a5418', 'stroke-width': 2 }, G);
    el('rect', { x: -8, y: -8, width: 16, height: 16, rx: 4, fill: '#7a5418' }, G);
    return G;
  };
  // 矽藻（圓盤狀，半徑約 70）
  D.diatomC = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('circle', { cx: 0, cy: 0, r: 70, fill: D.rg(G, [[0, DIA[0]], [0.7, DIA[1]], [1, DIA[2]]], 0.45, 0.4, 0.7), stroke: '#fff0c0', 'stroke-width': 2.5 }, G);
    for (let k = 0; k < 48; k++) { const a = (k / 48) * Math.PI * 2; el('line', { x1: Math.cos(a) * 14, y1: Math.sin(a) * 14, x2: Math.cos(a) * 64, y2: Math.sin(a) * 64, stroke: '#7a5418', 'stroke-width': 1.8, opacity: 0.55 }, G); }
    el('circle', { cx: 0, cy: 0, r: 52, fill: 'none', stroke: '#7a5418', 'stroke-width': 2, opacity: 0.6 }, G);
    el('circle', { cx: 0, cy: 0, r: 12, fill: '#c79a3a', stroke: '#7a5418', 'stroke-width': 2 }, G);
    return G;
  };
  // 水綿：絲狀，細胞內有螺旋帶狀的葉綠體（長 L，粗 40）
  D.spirogyra = (p, x, y, s = 1, { n = 4, r = 0 } = {}) => {
    const G = D.put(p, x, y, s, r), W = 92, H = 40, L = n * W;
    const d = `M ${-L / 2},${-H / 2} L ${L / 2},${-H / 2} L ${L / 2},${H / 2} L ${-L / 2},${H / 2} Z`;
    el('path', { d, fill: 'rgba(160,230,150,0.14)' }, G);
    const st = g(G, { 'clip-path': D.clip(G, d) });
    const P = []; for (let i = 0; i <= n * 40; i++) { const xx = -L / 2 + (i / (n * 40)) * L; P.push([xx, 15 * Math.sin((xx / 46) * Math.PI)]); }
    el('path', { d: D.curve(P), fill: 'none', stroke: '#2f7a3a', 'stroke-width': 10 }, st);
    el('path', { d: D.curve(P), fill: 'none', stroke: '#79d26a', 'stroke-width': 6, 'stroke-dasharray': '3 2' }, st);
    for (let k = 0; k < n; k++) { const cx = -L / 2 + W * (k + 0.5); el('circle', { cx, cy: 0, r: 5, fill: '#a796ff' }, G); el('rect', { x: -L / 2 + W * k, y: -H / 2, width: W, height: H, rx: 3, fill: 'none', stroke: '#cfe8c0', 'stroke-width': 2.5 }, G); }
    G.pts = { chloro: [-L / 2 + W * 1.25, 8] };
    return G;
  };
  // 黏菌（原生菌類）：從上往下看，黃色的網狀體在腐木表面蔓延（約 300 × 170）
  D.slimeMold = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('rect', { x: -150, y: -85, width: 300, height: 170, rx: 14, fill: '#4a3424', stroke: '#6b4a30', 'stroke-width': 2 }, G);
    for (let k = 0; k < 9; k++) el('path', { d: `M -146,${-72 + k * 18} C -60,${-78 + k * 18} 40,${-66 + k * 18} 146,${-74 + k * 18}`, fill: 'none', stroke: '#3a2818', 'stroke-width': 2 }, G);
    const net = g(G, { 'clip-path': D.clip(G, 'M -146,-81 L 146,-81 L 146,81 L -146,81 Z') });
    el('path', { d: 'M -130,0 L 60,-76 C 120,-60 146,-26 146,0 C 146,26 120,60 60,76 Z', fill: 'rgba(242,201,76,0.22)' }, net);
    const rr = S.rng(23);
    const branch = (x0, y0, a, len, w, depth) => {
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
      el('path', { d: `M ${x0},${y0} Q ${(x0 + x1) / 2 + (rr() - 0.5) * 14},${(y0 + y1) / 2 + (rr() - 0.5) * 14} ${x1},${y1}`, fill: 'none', stroke: '#f2c94c', 'stroke-width': w, 'stroke-linecap': 'round' }, net);
      if (depth > 0) [-0.42, 0.42].forEach((da) => branch(x1, y1, a + da + (rr() - 0.5) * 0.25, len * 0.74, w * 0.72, depth - 1));
    };
    branch(-130, 0, 0, 56, 10, 4);
    G.pts = { net: [10, -20] };
    return G;
  };
  // 海帶（昆布，褐藻）：原點在固著器（下端），往上長約 330
  D.kelp = (p, x, y, s = 1, sway = 0) => {
    const G = D.put(p, x, y, s);
    el('ellipse', { cx: 0, cy: 10, rx: 60, ry: 16, fill: '#4a5560' }, G);
    [[-1, 0.6], [-1, 1.2], [1, 0.7], [1, 1.3], [0, 1]].forEach(([sg, k]) => el('path', { d: `M 0,-14 C ${sg * 12 * k},-8 ${sg * 24 * k},-2 ${sg * 34 * k},6`, fill: 'none', stroke: '#6b4a1e', 'stroke-width': 5, 'stroke-linecap': 'round' }, G));
    el('path', { d: 'M -5,-12 C -5,-30 -5,-46 -4,-64 L 4,-64 C 5,-46 5,-30 5,-12 Z', fill: '#6b4a1e' }, G);
    const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([sway * 40 * Math.sin(t * 2.4) + 14 * Math.sin(t * 5), -60 - 280 * t]); }
    const bl = D.ribbon(pts, (t) => (t < 0.1 ? 8 + (t / 0.1) * 40 : 48 * (1 - 0.35 * t) * (t > 0.92 ? Math.sqrt((1 - t) / 0.08) : 1)) + 5 * Math.sin(t * 70));
    el('path', { d: bl, fill: D.lg(G, [[0, '#6e5216'], [0.5, '#a4842e'], [1, '#6e5216']], 0, 0, 1, 0), stroke: '#c9a85a', 'stroke-width': 2 }, G);
    el('path', { d: D.curve(pts.slice(2)), fill: 'none', stroke: '#c9a85a', 'stroke-width': 10, opacity: 0.25 }, G);
    return G;
  };
  // 紫菜（紅藻）：幾片細長、邊緣皺摺的薄葉狀藻體；石蓴（綠藻）：寬大的薄片。原點在基部（下端），高約 200
  D.sheetAlga = (p, x, y, s = 1, kind = 'nori') => {
    const G = D.put(p, x, y, s);
    const col = kind === 'nori' ? ['rgba(150,40,95,0.82)', '#e08ab8', '#5e1a3c'] : ['rgba(110,200,90,0.78)', '#c8f0a8', '#2f7a3a'];
    el('ellipse', { cx: 0, cy: 6, rx: 34, ry: 9, fill: '#4a5560' }, G);
    const blades = kind === 'nori' ? [[-24, 190, 26, 0.3], [20, 200, 24, 2.1], [-4, 170, 22, 4], [34, 150, 20, 1.2]] : [[-30, 150, 52, 0.4], [26, 170, 56, 2.2], [0, 130, 46, 3.6]];
    blades.forEach(([ang, len, w, ph]) => {
      const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([Math.sin(ang * R) * len * t + 8 * Math.sin(t * 4 + ph), -Math.cos(ang * R) * len * t]); }
      const d = D.ribbon(pts, (t) => w * Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.95)) * (0.75 + 0.25 * Math.sin(t * 3 + ph)) + 3.5 * Math.sin(t * 46 + ph));
      el('path', { d, fill: col[0], stroke: col[1], 'stroke-width': 2 }, G);
    });
    return G;
  };

  // =====================================================================
  //  菌物界
  // =====================================================================
  // 酵母菌：幾個橢圓形細胞，有的正在出芽（約 200 × 140）
  D.yeast = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const cell = (cx, cy, rx, ry, r) => {
      const c = S.place(g(G), { x: cx, y: cy, r });
      el('ellipse', { cx: 0, cy: 0, rx, ry, fill: D.rg(c, [[0, '#fbf3da'], [0.7, '#e1cf98'], [1, '#b39e62']], 0.4, 0.35, 0.75), stroke: '#fff4d6', 'stroke-width': 2 }, c);
      if (rx > 20) { el('circle', { cx: rx * 0.2, cy: -ry * 0.1, r: ry * 0.38, fill: 'rgba(98,168,255,0.35)', stroke: '#9cc6e0', 'stroke-width': 1.2 }, c); el('circle', { cx: -rx * 0.35, cy: ry * 0.2, r: ry * 0.2, fill: '#8a7ad6' }, c); }
      return c;
    };
    const mother = (cx, cy, rx, ry, r, bud) => { const a = r * R; if (bud) cell(cx + Math.cos(a) * (rx + bud * 0.7), cy + Math.sin(a) * (rx + bud * 0.7), bud, bud * 0.8, r); cell(cx, cy, rx, ry, r); };
    mother(-50, -20, 36, 27, -25, 16);
    mother(36, -34, 32, 25, 30, 0);
    mother(-6, 34, 35, 26, 10, 20);
    mother(70, 30, 30, 23, -60, 11);
    G.pts = { bud: [-50 + Math.cos(-25 * R) * 47, -20 + Math.sin(-25 * R) * 47] };
    return G;
  };
  // 麵包上的黑黴菌（放大）：菌絲、孢子囊（約 300 × 220，原點在麵包表面中央）
  D.breadMold = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -160,0 C -100,-6 -40,4 20,-2 C 80,-8 130,2 160,0 L 160,40 L -160,40 Z', fill: '#d9b06a' }, G);
    const rr = S.rng(31);
    for (let i = 0; i < 40; i++) el('circle', { cx: -150 + rr() * 300, cy: 8 + rr() * 28, r: 2 + rr() * 4, fill: '#b98a48', opacity: 0.7 }, G);
    // 匍匐的菌絲
    el('path', { d: 'M -160,-4 C -120,-20 -96,-6 -70,-10 C -40,-16 -16,-2 10,-8 C 40,-14 70,0 100,-8 C 126,-14 146,-6 160,-10', fill: 'none', stroke: '#eef3f6', 'stroke-width': 3 }, G);
    el('path', { d: 'M -130,-10 C -110,-2 -100,6 -80,2 M 30,-10 C 50,-2 60,4 84,0', fill: 'none', stroke: '#eef3f6', 'stroke-width': 2.2 }, G);
    // 假根（伸入麵包）、直立的菌絲與孢子囊
    [-110, -36, 50, 124].forEach((sx, i) => {
      [-10, 0, 10].forEach((dx) => el('path', { d: `M ${sx},-6 q ${dx * 0.6},14 ${dx},${22 + (dx === 0 ? 6 : 0)}`, fill: 'none', stroke: '#eef3f6', 'stroke-width': 1.6 }, G));
      const h = [150, 180, 160, 130][i];
      [[-12, h - 30], [0, h], [12, h - 18]].forEach(([dx, hh], j) => {
        if (i % 2 && j === 2) return;
        const tx = sx + dx * 1.6, ty = -6 - hh;
        el('path', { d: `M ${sx},-6 C ${sx + dx * 0.2},${-6 - hh * 0.5} ${tx},${ty + hh * 0.3} ${tx},${ty}`, fill: 'none', stroke: '#eef3f6', 'stroke-width': 2.4 }, G);
        el('circle', { cx: tx, cy: ty - 12, r: 14, fill: D.rg(G, [[0, '#4a4a4a'], [1, '#121212']], 0.4, 0.35, 0.7), stroke: '#6a6a6a', 'stroke-width': 1.5 }, G);
        for (let k = 0; k < 6; k++) el('circle', { cx: tx - 7 + (k % 3) * 7, cy: ty - 16 + Math.floor(k / 3) * 8, r: 1.6, fill: '#9a9a9a' }, G);
      });
    });
    G.pts = { hypha: [-70, -10], spor: [-36, -192] };
    return G;
  };
  // 發霉的吐司（一片）：約 220 × 230
  D.moldyBread = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const d = 'M -100,110 L -100,-40 C -134,-48 -128,-118 -64,-112 C -30,-128 30,-128 64,-112 C 128,-118 134,-48 100,-40 L 100,110 Z';
    el('path', { d, fill: '#b9773a' }, G);
    el('path', { d: 'M -88,98 L -88,-46 C -114,-54 -106,-104 -60,-100 C -28,-114 28,-114 60,-100 C 106,-104 114,-54 88,-46 L 88,98 Z', fill: '#f2dfb0' }, G);
    const rr = S.rng(41);
    [[-30, -40, 30], [40, 20, 24], [-40, 60, 18]].forEach(([cx, cy, R0]) => {
      el('circle', { cx, cy, r: R0 * 1.3, fill: '#9aa58a', opacity: 0.45 }, G);
      for (let i = 0; i < 70; i++) { const a = rr() * 6.283, f = Math.sqrt(rr()) * R0; el('circle', { cx: cx + Math.cos(a) * f, cy: cy + Math.sin(a) * f, r: 1.5 + rr() * 2.5, fill: rr() < 0.6 ? '#2a2a2a' : '#5a6a4a' }, G); }
    });
    for (let i = 0; i < 30; i++) el('circle', { cx: -80 + rr() * 160, cy: -90 + rr() * 180, r: 1.5, fill: '#d9b878' }, G);
    G.pts = { spot: [-30, -40] };
    return G;
  };
  // 段木上的香菇：原點在木頭頂面中央，菇高約 190；木頭內畫出菌絲（剖面）
  D.shiitake = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    // 段木（剖開，看得到裡面的菌絲）
    el('path', { d: 'M -170,0 L 170,0 L 170,90 L -170,90 Z', fill: '#8a5a32' }, G);
    el('path', { d: 'M -170,0 L 170,0 L 170,12 L -170,12 Z', fill: '#5a3a22' }, G);
    for (let k = 0; k < 6; k++) el('path', { d: `M -170,${22 + k * 12} C -60,${18 + k * 12} 60,${26 + k * 12} 170,${20 + k * 12}`, fill: 'none', stroke: '#6e4426', 'stroke-width': 2 }, G);
    const rr = S.rng(7);
    const hy = g(G);
    for (let i = 0; i < 16; i++) { let x0 = -60 + rr() * 120, y0 = 14 + rr() * 10; let d = `M ${x0},${y0}`; for (let k = 0; k < 4; k++) { x0 += (rr() - 0.5) * 70; y0 += 8 + rr() * 14; d += ` L ${x0.toFixed(1)},${Math.min(86, y0).toFixed(1)}`; } el('path', { d, fill: 'none', stroke: '#f3efe2', 'stroke-width': 1.6, opacity: 0.85 }, hy); }
    // 菇柄
    el('path', { d: 'M -16,-104 C -18,-70 -20,-30 -24,0 L 24,0 C 20,-30 18,-70 16,-104 Z', fill: D.lg(G, [[0, '#d8c8a0'], [0.5, '#f4ead0'], [1, '#c8b488']], 0, 0, 1, 0) }, G);
    // 菌褶（菌蓋下方）
    el('path', { d: 'M -112,-118 C -70,-98 70,-98 112,-118 C 84,-92 -84,-92 -112,-118 Z', fill: '#efe3c8' }, G);
    for (let k = -9; k <= 9; k++) el('line', { x1: k * 11.5, y1: -112 + Math.abs(k) * 0.3, x2: k * 2.2, y2: -100, stroke: '#c8b488', 'stroke-width': 1.3 }, G);
    // 菌蓋
    el('path', { d: 'M -114,-118 C -112,-176 -56,-196 0,-196 C 56,-196 112,-176 114,-118 C 76,-108 -76,-108 -114,-118 Z', fill: D.rg(G, [[0, '#9a5a2e'], [0.7, '#7a4220'], [1, '#5a2e14']], 0.5, 0.3, 0.8), stroke: '#4a2410', 'stroke-width': 2 }, G);
    for (let i = 0; i < 18; i++) { const a = rr() * Math.PI, rx2 = 20 + rr() * 80, cx = Math.cos(a) * rx2 * (rr() < 0.5 ? -1 : 1), cy = -150 - Math.sin(a) * 30 - rr() * 10; el('path', { d: `M ${cx},${cy} l ${4 + rr() * 6},${-2 - rr() * 3} l ${3 + rr() * 4},${4} l ${-6},${3} Z`, fill: '#ecdcc0', opacity: 0.7 }, G); }
    G.pts = { cap: [60, -170], gill: [80, -108], hypha: [30, 60] };
    return G;
  };
  // 木耳：耳朵形的膠質子實體（約 200 × 160）
  D.woodEar = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -110,60 L 110,60 L 110,100 L -110,100 Z', fill: '#7a4e2c' }, G);
    [[-40, 0, 1, 0.3], [40, 10, 0.85, 2.2]].forEach(([cx, cy, k, ph]) => {
      const P = S.blobPts(cx, cy, 70 * k, 56 * k, 60, [[3, 0.14, ph], [7, 0.05, ph], [13, 0.03, ph]]);
      el('path', { d: S.smoothPath(P), fill: D.rg(G, [[0, '#7a3e2a'], [0.8, '#4a2218'], [1, '#2e140e']], 0.5, 0.45, 0.6), stroke: '#a8604a', 'stroke-width': 2.5 }, G);
      for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.5; el('path', { d: `M ${cx},${cy + 30 * k} Q ${cx + Math.cos(a) * 30 * k},${cy + Math.sin(a) * 30 * k} ${cx + Math.cos(a) * 58 * k},${cy + Math.sin(a) * 46 * k}`, fill: 'none', stroke: '#8a4a36', 'stroke-width': 1.5, opacity: 0.7 }, G); }
    });
    return G;
  };

  // =====================================================================
  //  植物
  // =====================================================================
  const SOIL = '#3a2a1c', SOIL_E = '#5a4430';
  const soil = (G, x0, x1, y0 = 0, h = 50) => {
    el('path', { d: `M ${x0},${y0 + 2} C ${(x0 * 2 + x1) / 3},${y0 - 4} ${(x0 + x1 * 2) / 3},${y0 + 4} ${x1},${y0} L ${x1},${y0 + h} L ${x0},${y0 + h} Z`, fill: SOIL, stroke: SOIL_E, 'stroke-width': 2 }, G);
  };
  // 細長的小葉（往 +x 方向），長 L、寬 w
  const lanceD = (L, w) => `M 0,0 Q ${L * 0.45},${-w} ${L},0 Q ${L * 0.45},${w} 0,0 Z`;
  // 蘚苔：土馬騌（直立的小株，有假根，頂端長出孢子囊）。原點在地面中央，寬約 260、高約 210
  D.moss = (p, x, y, s = 1, { spores = true, ground = true } = {}) => {
    const G = D.put(p, x, y, s);
    const rr = S.rng(3);
    const xs = [-104, -78, -52, -26, 0, 26, 52, 78, 104];
    const shoots = xs.map((sx) => ({ sx, h: 74 + rr() * 40, lean: (rr() - 0.5) * 0.22 + sx * 0.0018 }));
    if (ground) soil(G, -140, 140, 0, 46);
    // 假根：細細的絲，伸進土中
    shoots.forEach(({ sx }) => { for (let k = 0; k < 4; k++) { const ex = (rr() - 0.5) * 22, ey = 16 + rr() * 22; el('path', { d: `M ${sx},2 q ${ex * 0.3},${ey * 0.6} ${ex},${ey}`, fill: 'none', stroke: '#d9b98a', 'stroke-width': 1.6 }, G); } });
    shoots.forEach(({ sx, h, lean }, i) => {
      const tx = sx + Math.sin(lean) * h, ty = -h;
      el('path', { d: `M ${sx},2 Q ${sx + (tx - sx) * 0.3},${-h * 0.5} ${tx},${ty}`, fill: 'none', stroke: '#5f7a2a', 'stroke-width': 3 }, G);
      const n = 15;
      for (let k = 1; k <= n; k++) {
        const t = k / n, px = S.lerp(sx, tx, t * t * 0.3 + t * 0.7), py = -h * t;
        const side = k % 2 ? -1 : 1, spread = t > 0.85 ? 60 : 34;
        const ang = -90 + side * spread + lean * 57, len = 13 + (1 - t) * 5;
        const lf = S.place(g(G), { x: px, y: py, r: ang });
        el('path', { d: lanceD(len, 2.6), fill: t < 0.35 ? '#3f7a28' : t < 0.7 ? '#5aa338' : '#7ccf4a' }, lf);
      }
      if (spores && (i === 1 || i === 4 || i === 7)) {
        const sx2 = tx + (i - 4) * 4, sy2 = ty - 78;
        el('path', { d: `M ${tx},${ty} Q ${tx + (sx2 - tx) * 0.2},${(ty + sy2) / 2} ${sx2},${sy2}`, fill: 'none', stroke: '#b5652e', 'stroke-width': 2.2 }, G);
        const cp = S.place(g(G), { x: sx2, y: sy2, r: (i - 4) * 4 + 8 });
        el('rect', { x: -5.5, y: -24, width: 11, height: 26, rx: 4, fill: '#a8742e', stroke: '#e0b070', 'stroke-width': 1.2 }, cp);
        el('path', { d: 'M -7,-16 L 0,-34 L 7,-16 Z', fill: '#e8cf8a' }, cp);
        for (let k = -3; k <= 3; k++) el('line', { x1: k * 2, y1: -16, x2: k * 2.6, y2: -10, stroke: '#e8cf8a', 'stroke-width': 1 }, cp);
        if (i === 4) G.capsule = [sx2, sy2 - 14];
      }
    });
    G.pts = { rhizoid: [26, 22], capsule: G.capsule || [0, -160], plant: [0, -60] };
    return G;
  };
  // 蘚苔：地錢（扁平、叉狀分枝的葉狀體，從上往下看），約 220 × 150
  D.liverwort = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const parts = [];
    const fork = (x0, y0, a, len, depth) => {
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
      parts.push([x0, y0, x1, y1, depth]);
      if (depth > 0) [-0.42, 0.42].forEach((da) => fork(x1, y1, a + da, len * 0.85, depth - 1));
    };
    [-2.6, -0.5, 1.6].forEach((a) => fork(0, 0, a, 40, 1));
    const W = 17;
    const seg = ([x0, y0, x1, y1, dep]) => { const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * W, ny = Math.cos(a) * W; return dep === 0 ? `M ${x0 + nx},${y0 + ny} L ${x1 + nx},${y1 + ny} C ${x1 + nx + Math.cos(a) * 14},${y1 + ny + Math.sin(a) * 14} ${x1 + Math.cos(a) * 10},${y1 + Math.sin(a) * 10} ${x1 + Math.cos(a) * 4},${y1 + Math.sin(a) * 4} C ${x1 + Math.cos(a) * 10},${y1 + Math.sin(a) * 10} ${x1 - nx + Math.cos(a) * 14},${y1 - ny + Math.sin(a) * 14} ${x1 - nx},${y1 - ny} L ${x0 - nx},${y0 - ny} Z` : `M ${x0 + nx},${y0 + ny} L ${x1 + nx * 1.1},${y1 + ny * 1.1} L ${x1 - nx * 1.1},${y1 - ny * 1.1} L ${x0 - nx},${y0 - ny} Z`; };
    parts.forEach((q) => el('path', { d: seg(q), fill: '#2f6a24', stroke: '#2f6a24', 'stroke-width': 6, 'stroke-linejoin': 'round' }, G));
    el('circle', { cx: 0, cy: 0, r: W + 3, fill: '#2f6a24' }, G);
    parts.forEach((q) => el('path', { d: seg(q), fill: '#5aa53e' }, G));
    el('circle', { cx: 0, cy: 0, r: W, fill: '#5aa53e' }, G);
    parts.forEach(([x0, y0, x1, y1]) => el('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: '#3f8a2c', 'stroke-width': 3 }, G));
    [[parts[0], 0.6], [parts[6], 0.55]].forEach(([[x0, y0, x1, y1], t]) => { const cx = S.lerp(x0, x1, t), cy = S.lerp(y0, y1, t); el('circle', { cx, cy, r: 7, fill: '#2f6a24', stroke: '#9be58c', 'stroke-width': 1.5 }, G); [[-2, -1], [2, 0], [0, 2]].forEach(([a, b]) => el('circle', { cx: cx + a, cy: cy + b, r: 1.4, fill: '#9be58c' }, G)); });
    return G;
  };
  // 蕨類：腎蕨。原點在地面中央；葉高約 330；under：畫出土中的地下莖和根
  D.fern = (p, x, y, s = 1, { fiddle = true, under = true, fronds = null } = {}) => {
    const G = D.put(p, x, y, s);
    if (under) {
      soil(G, -170, 170, 0, 90);
      for (let k = 0; k < 22; k++) { const rx0 = -120 + k * 11.5, rx1 = rx0 + ((k * 37) % 23) - 11; el('path', { d: `M ${rx0},${24} Q ${rx0 + 4},${48} ${rx1},${62 + ((k * 13) % 22)}`, fill: 'none', stroke: '#c9a97a', 'stroke-width': 1.8 }, G); }
      el('path', { d: 'M -140,24 C -70,18 30,30 140,20', fill: 'none', stroke: '#8a5e34', 'stroke-width': 13, 'stroke-linecap': 'round' }, G);
      el('path', { d: 'M -140,22 C -70,16 30,28 140,18', fill: 'none', stroke: '#b07a46', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }, G);
    } else soil(G, -150, 150, 0, 30);
    const FR = fronds || [[-50, 250, -60], [-30, 300, -36], [-12, 330, -12], [8, 320, 12], [28, 300, 34], [48, 250, 58]];
    const cols = ['#4fae46', '#5cbc4c', '#47a240'];
    FR.forEach(([ang, len, bx], fi) => {
      const a = ang * R, b0 = [bx * 0.6, under ? 18 : 2];
      const tip = [b0[0] + Math.sin(a) * len * 0.92 + Math.sign(ang || 1) * len * 0.12, b0[1] - Math.cos(a) * len * 0.86];
      const c1 = [b0[0] + Math.sin(a) * len * 0.35, b0[1] - Math.cos(a) * len * 0.7];
      const P = (t) => [(1 - t) ** 2 * b0[0] + 2 * (1 - t) * t * c1[0] + t * t * tip[0], (1 - t) ** 2 * b0[1] + 2 * (1 - t) * t * c1[1] + t * t * tip[1]];
      const T = (t) => [2 * (1 - t) * (c1[0] - b0[0]) + 2 * t * (tip[0] - c1[0]), 2 * (1 - t) * (c1[1] - b0[1]) + 2 * t * (tip[1] - c1[1])];
      el('path', { d: `M ${b0[0]},${b0[1]} Q ${c1[0]},${c1[1]} ${tip[0]},${tip[1]}`, fill: 'none', stroke: '#3f6e2a', 'stroke-width': 3.2 }, G);
      const n = 24, col = cols[fi % 3];
      for (let i = 0; i < n; i++) {
        [-1, 1].forEach((side) => {
          const t = 0.1 + (0.88 * (i + (side > 0 ? 0.5 : 0))) / n;
          const [px, py] = P(t), [tx, ty] = T(t), ta = Math.atan2(ty, tx);
          const Lp = 6 + 46 * (1 - Math.pow(t, 1.7)) * (0.55 + 0.45 * Math.min(1, (t - 0.1) / 0.22));
          const pg = S.place(g(G), { x: px, y: py, r: (ta + side * 62 * R) / R });
          const w = Lp * 0.2;
          el('path', { d: `M 0,${-w * 0.55} C ${Lp * 0.35},${-w * 1.05} ${Lp * 0.82},${-w} ${Lp},0 C ${Lp * 0.82},${w} ${Lp * 0.35},${w * 1.05} 0,${w * 0.55} Z`, fill: col, stroke: '#2a6a28', 'stroke-width': 1 }, pg);
        });
      }
      if (fi === 2) G.frondPt = P(0.55);
    });
    if (fiddle) {
      const fx = under ? 22 : 18, fy = under ? 18 : 2;
      el('path', { d: `M ${fx},${fy} C ${fx + 4},${fy - 50} ${fx + 18},${fy - 100} ${fx + 30},${fy - 120}`, fill: 'none', stroke: '#8fcf5a', 'stroke-width': 6, 'stroke-linecap': 'round' }, G);
      const cx = fx + 42, cy = fy - 128, P = [];
      for (let i = 0; i <= 50; i++) { const t = i / 50, an = Math.PI + t * Math.PI * 3.2, r0 = 16 * (1 - t * 0.78); P.push([cx + Math.cos(an) * r0, cy + Math.sin(an) * r0]); }
      el('path', { d: D.curve(P), fill: 'none', stroke: '#8fcf5a', 'stroke-width': 6, 'stroke-linecap': 'round' }, G);
      for (let k = 0; k < 9; k++) { const yy = fy - 14 - k * 12; el('line', { x1: fx + 2 + k * 2.6, y1: yy, x2: fx - 4 + k * 2.6, y2: yy - 5, stroke: '#a8743a', 'stroke-width': 1.4 }, G); }
      G.fiddlePt = [cx, cy];
    }
    G.pts = { frond: G.frondPt, rhizome: [-80, 20], root: [-100, 66], fiddle: G.fiddlePt || [0, -100] };
    return G;
  };
  // 一片小葉的背面：兩排褐色的孢子囊堆（腎蕨，長約 440、寬約 120）
  D.pinnaSori = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const L = 440, w = 58, d = `M ${-L / 2},${-w * 0.45} C ${-L * 0.2},${-w * 1.05} ${L * 0.3},${-w} ${L / 2},0 C ${L * 0.3},${w} ${-L * 0.2},${w * 1.05} ${-L / 2},${w * 0.45} Z`;
    el('path', { d, fill: D.lg(G, [[0, '#8fd17a'], [0.5, '#6fbf5a'], [1, '#8fd17a']]), stroke: '#2f7a3a', 'stroke-width': 3 }, G);
    const vg = g(G, { 'clip-path': D.clip(G, d) });
    el('line', { x1: -L / 2, y1: 0, x2: L / 2 - 6, y2: 0, stroke: '#cdeeb8', 'stroke-width': 4 }, vg);
    for (let xx = -L / 2 + 24; xx < L / 2 - 20; xx += 26) [-1, 1].forEach((sg) => el('path', { d: `M ${xx},0 Q ${xx + 12},${sg * 22} ${xx + 22},${sg * 44}`, fill: 'none', stroke: '#cdeeb8', 'stroke-width': 1.6 }, vg));
    const sori = [];
    for (let xx = -L / 2 + 40; xx < L / 2 - 90; xx += 26) [-1, 1].forEach((sg) => {
      const wy = sg * w * 0.55 * Math.min(1, (L / 2 - xx - 14) / 120), cx = xx + 14, cy = wy;
      el('circle', { cx, cy, r: 9, fill: '#7a4a1e', stroke: '#4a2a10', 'stroke-width': 1.2 }, G);
      el('path', { d: `M ${cx - 7},${cy - 3} A 8,8 0 0 1 ${cx + 7},${cy - 3} L ${cx + 2},${cy} L ${cx - 2},${cy} Z`, fill: '#c9955a' }, G);
      sori.push([cx, cy]);
    });
    G.pts = { sorus: sori[4] };
    return G;
  };
  // 孢子囊（放大）：有柄、邊緣有一圈加厚的細胞（環帶）；open：裂開、散出孢子（約 120 × 150）
  D.sporangium = (p, x, y, s = 1, { open = false } = {}) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M 0,70 C 2,50 -2,40 0,26', fill: 'none', stroke: '#c9a060', 'stroke-width': 6, 'stroke-linecap': 'round' }, G);
    el('ellipse', { cx: 0, cy: -4, rx: 40, ry: 32, fill: D.rg(G, [[0, '#f0d08a'], [1, '#b8862e']], 0.4, 0.35, 0.8), stroke: '#8a5a1a', 'stroke-width': 2 }, G);
    for (let k = 0; k < 14; k++) { const a = (-200 + k * 13) * R; el('rect', { x: -4, y: -6, width: 8, height: 12, rx: 2, fill: '#8a5a1a', transform: `translate(${Math.cos(a) * 38},${-4 + Math.sin(a) * 30}) rotate(${a / R + 90})` }, G); }
    const rr = S.rng(9);
    for (let i = 0; i < 10; i++) el('ellipse', { cx: -22 + rr() * 44, cy: -20 + rr() * 30, rx: 5, ry: 3.5, fill: '#6a4214', transform: `rotate(${rr() * 180} ${0} ${0})`, opacity: 0.9 }, G);
    if (open) for (let i = 0; i < 9; i++) { const a = (-150 + i * 16) * R, d0 = 56 + rr() * 30; el('ellipse', { cx: 34 + Math.cos(a) * d0 * 0.6 + 30, cy: -30 + Math.sin(a) * d0 * 0.7, rx: 6, ry: 4, fill: '#a8742e', stroke: '#e0b070', 'stroke-width': 1 }, G); }
    return G;
  };
  // 一顆孢子（放大），r 約 10
  D.spore = (p, x, y, s = 1) => { const G = D.put(p, x, y, s); el('ellipse', { cx: 0, cy: 0, rx: 14, ry: 10, fill: '#a8742e', stroke: '#e0b070', 'stroke-width': 1.5 }, G); return G; };

  // 針葉的一簇（在 (0,0)，往 a 方向張開），k 大小
  const tuft = (G, x0, y0, k, dark) => {
    el('ellipse', { cx: x0, cy: y0, rx: 24 * k, ry: 11 * k, fill: dark ? '#24543a' : '#2f6a42' }, G);
    for (let i = 0; i < 13; i++) { const a = (-170 + i * 13) * R; el('line', { x1: x0 + Math.cos(a) * 8 * k, y1: y0 + Math.sin(a) * 5 * k, x2: x0 + Math.cos(a) * 30 * k, y2: y0 + Math.sin(a) * 15 * k - 2 * k, stroke: dark ? '#3a7a50' : '#4f9a5c', 'stroke-width': 2 * Math.max(0.8, k) }, G); }
    for (let i = 0; i < 5; i++) { const a = (20 + i * 35) * R; el('line', { x1: x0, y1: y0, x2: x0 + Math.cos(a) * 22 * k, y2: y0 + Math.sin(a) * 9 * k, stroke: '#24543a', 'stroke-width': 1.6 * k }, G); }
  };
  // 松樹（裸子植物，錐形樹冠、針狀葉）：原點在地面中央，高約 430
  D.pine = (p, x, y, s = 1, { ground = true, cones = true } = {}) => {
    const G = D.put(p, x, y, s);
    if (ground) soil(G, -170, 170, 0, 26);
    el('path', { d: 'M -16,2 C -12,-150 -8,-300 -3,-420 L 3,-420 C 8,-300 12,-150 16,2 Z', fill: D.lg(G, [[0, '#5a3418'], [0.5, '#8a5a32'], [1, '#4a2a12']], 0, 0, 1, 0) }, G);
    const rr = S.rng(12);
    for (let i = 0; i < 10; i++) {
      const yy = -96 - i * 32, hw = 150 * (1 - i / 10.6) + 10;
      [-1, 1].forEach((sg) => {
        const ex = sg * hw, ey = yy - 14 - rr() * 10;
        el('path', { d: `M ${sg * 3},${yy + 6} Q ${ex * 0.5},${yy + 4} ${ex},${ey}`, fill: 'none', stroke: '#6a4222', 'stroke-width': 4 - i * 0.25 }, G);
        [0.45, 0.72, 1].forEach((u, j) => { if (hw * u < 18 && j < 2) return; tuft(G, S.lerp(0, ex, u), S.lerp(yy + 5, ey, u * u), 0.75 + 0.3 * (1 - i / 10) - j * 0.05, (i + j) % 2 === 0); });
      });
      tuft(G, 0, yy - 8, 0.7, i % 2 === 1);
    }
    tuft(G, 0, -420, 0.6, false);
    if (cones) [[-70, -150], [86, -190], [-40, -250]].forEach(([cx, cy]) => { el('ellipse', { cx, cy: cy + 10, rx: 7, ry: 11, fill: '#8a5a2e', stroke: '#c08a4a', 'stroke-width': 1.5 }, G); });
    G.pts = { needle: [60, -250], trunk: [0, -60], cone: [-70, -140] };
    return G;
  };
  // 松枝（放大）：成對的針狀葉、雌毬果、雄毬果。約 460 × 300，原點在中央
  D.pineBranch = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const A = [-230, 50], B = [210, -40];
    const at = (u) => [S.lerp(A[0], B[0], u), S.lerp(A[1], B[1], u) - Math.sin(u * Math.PI) * 18];
    // 雌毬果（成熟、木質，掛在枝下）
    const fc = S.place(g(G), { x: -70, y: 96, r: 18 });
    const coneD = 'M 0,-78 C 34,-74 44,-20 40,20 C 36,58 18,82 0,86 C -18,82 -36,58 -40,20 C -44,-20 -34,-74 0,-78 Z';
    el('path', { d: coneD, fill: '#5a3418' }, fc);
    const sc = g(fc, { 'clip-path': D.clip(fc, coneD) });
    for (let row = -8; row <= 9; row++) for (let col = -3; col <= 3; col++) {
      const cx = col * 22 + (row % 2 ? 11 : 0), cy = row * 10;
      el('path', { d: `M ${cx},${cy - 9} L ${cx + 11},${cy} L ${cx},${cy + 9} L ${cx - 11},${cy} Z`, fill: '#9a6a3a', stroke: '#4a2a12', 'stroke-width': 1.5 }, sc);
      el('circle', { cx, cy: cy + 1, r: 2, fill: '#4a2a12' }, sc);
    }
    el('path', { d: coneD, fill: 'none', stroke: '#c08a4a', 'stroke-width': 2 }, fc);
    el('path', { d: 'M -60,40 Q -66,10 -72,-6', fill: 'none', stroke: '#6a4222', 'stroke-width': 6 }, G);
    // 枝條
    const tw = []; for (let i = 0; i <= 20; i++) tw.push(at(i / 20));
    el('path', { d: D.curve(tw), fill: 'none', stroke: '#7a4a26', 'stroke-width': 11, 'stroke-linecap': 'round' }, G);
    // 針葉：兩針一束，從枝條往前、往上下張開
    for (let u = 0.05; u < 0.97; u += 0.075) {
      const [px, py] = at(u);
      [[-58, 1], [-30, 0.9], [34, 0.7]].forEach(([da, k], j) => {
        if (j === 2 && (u < 0.15 || u > 0.7)) return;
        const a = (-14 + da + ((u * 97) % 7)) * R, L = 96 * k;
        [-4, 4].forEach((off) => el('path', { d: `M ${px},${py} q ${Math.cos(a + off * R) * L * 0.5},${Math.sin(a + off * R) * L * 0.5 - 2} ${Math.cos(a + off * R) * L},${Math.sin(a + off * R) * L}`, fill: 'none', stroke: j === 2 ? '#2f6a42' : '#3f8a4a', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, G));
        el('line', { x1: px, y1: py, x2: px + Math.cos(a) * 8, y2: py + Math.sin(a) * 8, stroke: '#5a3418', 'stroke-width': 4.5 }, G);
      });
    }
    // 雄毬果（一叢，枝條前端附近）
    const [mx, my] = at(0.8);
    el('path', { d: `M ${mx - 2},${my} L ${mx + 6},${my + 40}`, stroke: '#7a4a26', 'stroke-width': 5, 'stroke-linecap': 'round' }, G);
    for (let k = 0; k < 16; k++) { const row = Math.floor(k / 4), col = k % 4, cx = mx - 8 + col * 7 + row * 2, cy = my + 10 + row * 8; el('ellipse', { cx, cy, rx: 3.8, ry: 8, fill: col % 2 ? '#e8b04a' : '#f2c25a', stroke: '#a8742e', 'stroke-width': 1, transform: `rotate(${(col - 1.5) * 22} ${cx} ${cy})` }, G); }
    const rr = S.rng(8);
    for (let i = 0; i < 14; i++) el('circle', { cx: mx + 30 + rr() * 90, cy: my + 30 + rr() * 70, r: 2.2, fill: '#ffe08a', opacity: 0.85 }, G);
    G.pts = { female: [-70 + 30, 96], male: [mx + 6, my + 36], needle: at(0.3), pollen: [mx + 80, my + 70] };
    return G;
  };
  // 毬果的一片鱗片（從上面看）：基部有兩顆種子，種子上有薄翅；種子裸露在鱗片上，外面沒有果實包住。約 170 × 200
  D.coneScale = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -14,100 C -20,70 -60,30 -74,-20 C -86,-64 -50,-86 0,-88 C 50,-86 86,-64 74,-20 C 60,30 20,70 14,100 Z', fill: D.lg(G, [[0, '#8a5a30'], [1, '#c89a5a']], 0, 1, 0, 0), stroke: '#e0b070', 'stroke-width': 2 }, G);
    el('path', { d: 'M -10,-70 L 0,-80 L 10,-70 L 0,-60 Z', fill: '#6a4222' }, G);
    [-1, 1].forEach((sg) => {
      const sd = S.place(g(G), { x: sg * 22, y: 62, r: sg * 10 });
      el('path', { d: 'M -8,0 C -16,-30 -22,-70 -10,-104 C 4,-110 18,-96 16,-70 C 14,-40 10,-14 8,0 Z', fill: 'rgba(245,225,175,0.82)', stroke: '#f6dfa8', 'stroke-width': 1.5 }, sd);
      for (let k = 0; k < 4; k++) el('path', { d: `M ${-2 + k * 3},-6 C ${-6 + k * 3},-40 ${-8 + k * 4},-70 ${-4 + k * 4},-96`, fill: 'none', stroke: '#d8b878', 'stroke-width': 1, opacity: 0.8 }, sd);
      el('path', { d: 'M 0,-14 C 12,-14 14,4 8,14 C 4,20 -4,20 -8,14 C -14,4 -12,-14 0,-14 Z', fill: '#6a3e1c', stroke: '#c08a4a', 'stroke-width': 1.5 }, sd);
    });
    G.pts = { seed: [24, 64], wing: [36, -10] };
    return G;
  };
  // 銀杏：扇形的葉、成對掛著的種子（白果）。約 300 × 260
  D.ginkgo = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -150,40 C -60,20 40,30 150,-10', fill: 'none', stroke: '#7a5a3a', 'stroke-width': 9, 'stroke-linecap': 'round' }, G);
    const fan = (fx, fy, r, sz) => {
      const lf = S.place(g(G), { x: fx, y: fy, r });
      el('line', { x1: 0, y1: 0, x2: 0, y2: -46 * sz, stroke: '#6a9a3a', 'stroke-width': 2.5 }, lf);
      const d = `M 0,${-44 * sz} C ${-30 * sz},${-60 * sz} ${-62 * sz},${-80 * sz} ${-56 * sz},${-104 * sz} C ${-30 * sz},${-120 * sz} ${-8 * sz},${-116 * sz} ${-3 * sz},${-104 * sz} L 0,${-90 * sz} L ${3 * sz},${-104 * sz} C ${8 * sz},${-116 * sz} ${30 * sz},${-120 * sz} ${56 * sz},${-104 * sz} C ${62 * sz},${-80 * sz} ${30 * sz},${-60 * sz} 0,${-44 * sz} Z`;
      el('path', { d, fill: '#7cc84a', stroke: '#3f7a28', 'stroke-width': 1.5 }, lf);
      for (let k = -5; k <= 5; k++) el('line', { x1: 0, y1: -46 * sz, x2: k * 10 * sz, y2: (-108 + Math.abs(k) * 2.2) * sz, stroke: '#a8e080', 'stroke-width': 1 }, lf);
    };
    [[-120, 34, -40, 0.85], [-90, 30, 10, 0.9], [-30, 28, -20, 1], [10, 28, 25, 0.95], [70, 14, -10, 0.9], [120, -2, 30, 0.8]].forEach(([fx, fy, r, sz]) => fan(fx, fy, r, sz));
    [[-60, 30], [40, 22]].forEach(([sx, sy]) => [-1, 1].forEach((sg) => {
      const ex = sx + sg * 16, ey = sy + 78;
      el('path', { d: `M ${sx},${sy} Q ${sx + sg * 6},${sy + 40} ${ex},${ey}`, fill: 'none', stroke: '#6a9a3a', 'stroke-width': 2.5 }, G);
      el('circle', { cx: ex, cy: ey + 14, r: 15, fill: D.rg(G, [[0, '#ffe39a'], [1, '#d9a23a']], 0.4, 0.35, 0.8), stroke: '#a8742e', 'stroke-width': 1.5 }, G);
    }));
    G.pts = { leaf: [-30, -60], seed: [56, 114] };
    return G;
  };
  // 花（縱切）：花瓣、雄蕊、雌蕊（子房中有胚珠）。原點在花托，高約 250
  D.flowerSection = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -6,130 C -6,90 -8,40 -10,18 L 10,18 C 8,40 6,90 6,130 Z', fill: '#5a9a3a' }, G);
    [-1, 1].forEach((sg) => el('path', { d: `M ${sg * 8},14 C ${sg * 30},10 ${sg * 52},-4 ${sg * 64},-22 C ${sg * 44},-16 ${sg * 26},-6 ${sg * 6},2 Z`, fill: '#5fae46', stroke: '#2f7a3a', 'stroke-width': 1.5 }, G));
    el('path', { d: 'M -30,-6 C -40,-80 -24,-150 0,-176 C 24,-150 40,-80 30,-6 Z', fill: '#d97aa8', stroke: '#f2b0cf', 'stroke-width': 2 }, G);
    [-1, 1].forEach((sg) => el('path', { d: `M ${sg * 12},4 C ${sg * 50},-10 ${sg * 110},-70 ${sg * 130},-150 C ${sg * 90},-136 ${sg * 50},-90 ${sg * 22},-30 Z`, fill: '#f29ac4', stroke: '#ffc6df', 'stroke-width': 2 }, G));
    el('path', { d: 'M -26,6 C -30,-10 30,-10 26,6 C 20,16 -20,16 -26,6 Z', fill: '#7ab84a' }, G);
    [[-1, 0.9], [-1, 0.6], [1, 0.6], [1, 0.9]].forEach(([sg, k]) => { const ax = sg * 64 * k, ay = -112 * k - 14; el('path', { d: `M ${sg * 14},-4 Q ${sg * 30 * k},${-60 * k} ${ax},${ay}`, fill: 'none', stroke: '#f6e0a0', 'stroke-width': 3 }, G); el('ellipse', { cx: ax, cy: ay - 7, rx: 6, ry: 11, fill: '#ffd166', stroke: '#c8962a', 'stroke-width': 1.2, transform: `rotate(${sg * 20} ${ax} ${ay - 7})` }, G); });
    el('path', { d: 'M -18,-2 C -24,-30 -20,-64 -8,-80 L -4,-118 L 4,-118 L 8,-80 C 20,-64 24,-30 18,-2 Z', fill: '#8fcf6a', stroke: '#2f7a3a', 'stroke-width': 2 }, G);
    el('ellipse', { cx: 0, cy: -124, rx: 11, ry: 7, fill: '#c8e87a', stroke: '#2f7a3a', 'stroke-width': 1.5 }, G);
    [-62, -48, -34, -20].forEach((oy) => el('ellipse', { cx: 0, cy: oy + 6, rx: 6, ry: 5, fill: '#f6f2e0', stroke: '#9ac07a', 'stroke-width': 1 }, G));
    G.pts = { petal: [-100, -120], stamen: [58, -130], pistil: [0, -124], ovary: [16, -40], ovule: [0, -28] };
    return G;
  };
  // 豆莢（果實）剖開：裡面一排種子。約 300 × 110
  D.podOpen = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -150,6 C -120,-34 110,-38 150,-8 C 110,-20 -110,-14 -150,6 Z', fill: '#6fbf4a', stroke: '#2f7a3a', 'stroke-width': 2 }, G);
    el('path', { d: 'M -150,6 C -110,52 110,48 150,-8 C 110,22 -110,26 -150,6 Z', fill: '#4f9a3a', stroke: '#2f7a3a', 'stroke-width': 2 }, G);
    el('path', { d: 'M -150,6 C -110,14 110,6 150,-8', fill: 'none', stroke: '#2f7a3a', 'stroke-width': 1.5 }, G);
    el('path', { d: 'M -150,6 L -172,10', stroke: '#5a8a3a', 'stroke-width': 5, 'stroke-linecap': 'round' }, G);
    el('path', { d: 'M 150,-8 L 166,-20', stroke: '#c8b47a', 'stroke-width': 3, 'stroke-linecap': 'round' }, G);
    [-96, -48, 0, 48, 96].forEach((sx) => el('circle', { cx: sx, cy: 2 - sx * 0.04, r: 19, fill: D.rg(G, [[0, '#d6f2a0'], [1, '#6fae3a']], 0.4, 0.35, 0.8), stroke: '#3f7a28', 'stroke-width': 1.5 }, G));
    G.pts = { seed: [48, 0], fruit: [120, 22] };
    return G;
  };
  // 一般的開花植物（例：油菜花）：莖、斜向上的葉、頂端的花。原點在地面，高約 300
  const netLeafD = (L, w) => `M 0,0 C ${L * 0.2},${-w * 0.9} ${L * 0.65},${-w * 0.95} ${L},0 C ${L * 0.65},${w * 0.95} ${L * 0.2},${w * 0.9} 0,0 Z`;
  D.flowerPlant = (p, x, y, s = 1, { ground = true, petals = 5 } = {}) => {
    const G = D.put(p, x, y, s);
    if (ground) soil(G, -110, 110, 0, 26);
    el('path', { d: 'M 0,2 C -4,-80 6,-180 0,-250', fill: 'none', stroke: '#5a9a3a', 'stroke-width': 7, 'stroke-linecap': 'round' }, G);
    [[-1, -40, 100, 0.9], [1, -90, 96, 0.85], [-1, -140, 86, 0.8], [1, -186, 72, 0.7]].forEach(([sg, ly, L, k]) => {
      const lf = S.place(g(G), { x: sg * 2, y: ly, r: sg > 0 ? -35 : 180 + 35 });
      el('path', { d: netLeafD(L, 26 * k), fill: '#4fae46', stroke: '#2f7a3a', 'stroke-width': 1.5 }, lf);
      const vg = g(lf, { 'clip-path': D.clip(lf, netLeafD(L, 26 * k)) });
      el('line', { x1: 2, y1: 0, x2: L - 6, y2: 0, stroke: '#a8e39a', 'stroke-width': 1.6 }, vg);
      for (let i = 1; i <= 3; i++) [-1, 1].forEach((t) => el('path', { d: `M ${L * i / 4.4},0 Q ${L * i / 4.4 + 8},${t * 8} ${L * i / 4.4 + 16},${t * 16 * k}`, fill: 'none', stroke: '#a8e39a', 'stroke-width': 1.2 }, vg));
    });
    const fl = S.place(g(G), { x: 0, y: -262 });
    for (let k = 0; k < petals; k++) { const da = 360 / petals, a = (k * da - 90 + (petals === 4 ? 45 : 0)) * R; el('ellipse', { cx: Math.cos(a) * 20, cy: Math.sin(a) * 20, rx: 18, ry: petals === 4 ? 14 : 12, fill: '#ffd84a', stroke: '#e0a020', 'stroke-width': 1.5, transform: `rotate(${a / R} ${Math.cos(a) * 20} ${Math.sin(a) * 20})` }, fl); }
    el('circle', { cx: 0, cy: 0, r: 10, fill: '#e8902a' }, fl);
    G.pts = { flower: [0, -262], leaf: [60, -110] };
    return G;
  };

  // ----- 單子葉／雙子葉 比較用的小圖 -----
  // 菜豆種子剝開：2 片子葉（約 170 × 110）
  D.beanSeed = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const kid = 'M 0,-46 C 40,-50 66,-20 62,10 C 58,40 30,52 4,44 C -10,40 -14,26 -6,14 C 0,4 -4,-6 -10,-14 C -18,-30 -16,-44 0,-46 Z';
    [-1, 1].forEach((sg) => {
      const h = S.place(g(G), { x: sg * 44, y: 0 });
      el('path', { d: kid, fill: D.rg(h, [[0, '#fbf1d0'], [1, '#d8c08a']], 0.5, 0.4, 0.7), stroke: '#a88a4a', 'stroke-width': 2, transform: sg < 0 ? 'scale(-1,1)' : '' }, h);
    });
    // 胚（胚芽＋胚根）在右半邊的內側
    el('path', { d: 'M 40,-12 C 30,-14 28,-2 34,4 C 30,12 34,22 42,24', fill: 'none', stroke: '#c8a24a', 'stroke-width': 4, 'stroke-linecap': 'round' }, G);
    el('path', { d: 'M 34,-10 l -10,-8 l 4,10 Z', fill: '#d9e08a' }, G);
    G.pts = { cot: [70, 10] };
    return G;
  };
  // 玉米種子縱切：1 片子葉（約 110 × 150）
  D.cornSeed = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const d = 'M -44,-60 C -30,-74 30,-74 44,-60 C 52,-30 40,30 14,66 C 6,76 -6,76 -14,66 C -40,30 -52,-30 -44,-60 Z';
    el('path', { d, fill: '#f2c84a', stroke: '#c8962a', 'stroke-width': 2.5 }, G);
    el('path', { d: 'M -36,-56 C -24,-66 24,-66 36,-56 C 40,-30 30,-6 6,6 C -16,-4 -40,-30 -36,-56 Z', fill: '#f8e08a' }, G);
    el('path', { d: 'M -4,-8 C 18,-4 28,24 14,56 C 6,66 -8,62 -12,50 C -20,24 -20,0 -4,-8 Z', fill: '#f4ecd0', stroke: '#c8a24a', 'stroke-width': 1.5 }, G);
    el('path', { d: 'M -2,0 C 6,4 8,40 2,52', fill: 'none', stroke: '#9ac04a', 'stroke-width': 4, 'stroke-linecap': 'round' }, G);
    el('path', { d: 'M -4,6 C 14,8 20,34 8,54', fill: 'none', stroke: '#e0b860', 'stroke-width': 2 }, G);
    G.pts = { cot: [16, 20], endo: [0, -40] };
    return G;
  };
  // 網狀脈的葉（長 L，往 +x），原點在葉柄基部
  D.leafNet = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r), L = 170, w = 52;
    el('line', { x1: 0, y1: 0, x2: 26, y2: 0, stroke: '#5a9a3a', 'stroke-width': 4 }, G);
    const lf = S.place(g(G), { x: 24, y: 0 });
    el('path', { d: netLeafD(L, w), fill: '#4fae46', stroke: '#2f7a3a', 'stroke-width': 2 }, lf);
    const vg = g(lf, { 'clip-path': D.clip(lf, netLeafD(L, w - 3)) });
    el('line', { x1: 0, y1: 0, x2: L - 4, y2: 0, stroke: '#c8f0b0', 'stroke-width': 2.6 }, vg);
    const rr = S.rng(14);
    [0.16, 0.32, 0.48, 0.64, 0.8].forEach((f) => [-1, 1].forEach((sg) => {
      const x0 = L * f, wy = w * 0.78 * Math.sin(Math.PI * Math.min(1, f + 0.12));
      el('path', { d: `M ${x0},0 Q ${x0 + 14},${sg * wy * 0.4} ${x0 + 30},${sg * wy * 0.82}`, fill: 'none', stroke: '#c8f0b0', 'stroke-width': 1.6 }, vg);
      for (let k = 0; k < 3; k++) { const ax = x0 + 8 + k * 9, ay = sg * wy * (0.2 + k * 0.2); el('path', { d: `M ${ax},${ay} l ${10 + rr() * 6},${sg * (rr() - 0.3) * 8} l ${4 + rr() * 6},${sg * (6 + rr() * 6)}`, fill: 'none', stroke: '#b0e098', 'stroke-width': 1 }, vg); }
    }));
    return G;
  };
  // 平行脈的葉（細長，往 +x）
  D.leafPar = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r), L = 230, w = 22;
    const d = `M 0,${-w * 0.8} C ${L * 0.3},${-w} ${L * 0.7},${-w * 0.8} ${L},0 C ${L * 0.7},${w * 0.8} ${L * 0.3},${w} 0,${w * 0.8} Z`;
    el('path', { d, fill: '#5cb84a', stroke: '#2f7a3a', 'stroke-width': 2 }, G);
    [-0.6, -0.3, 0, 0.3, 0.6].forEach((f) => el('path', { d: `M 2,${f * w * 1.1} C ${L * 0.4},${f * w * 1.2} ${L * 0.75},${f * w * 0.7} ${L - 3},0`, fill: 'none', stroke: '#c8f0b0', 'stroke-width': f === 0 ? 2.2 : 1.4 }, G));
    return G;
  };
  // 莖的橫切面：ring＝維管束環狀排列；否則散生（半徑約 60）
  D.stemSection = (p, x, y, s = 1, ring = true) => {
    const G = D.put(p, x, y, s);
    el('circle', { cx: 0, cy: 0, r: 60, fill: '#1d3a2a', stroke: '#a8e39a', 'stroke-width': 3 }, G);
    const pts = [];
    if (ring) { for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; pts.push([Math.cos(a) * 42, Math.sin(a) * 42, a]); } el('circle', { cx: 0, cy: 0, r: 42, fill: 'none', stroke: '#8be07a', 'stroke-width': 2 }, G); }
    else { const rr = S.rng(7); for (let k = 0; pts.length < 18 && k < 2000; k++) { const rad = 52 * Math.sqrt(rr()), a = rr() * 6.283, px = Math.cos(a) * rad, py = Math.sin(a) * rad; if (pts.every(([qx, qy]) => Math.hypot(qx - px, qy - py) > 20)) pts.push([px, py, a]); } }
    pts.forEach(([px, py, a]) => { const b = S.place(g(G), { x: px, y: py, r: a / R + 90 }); el('ellipse', { cx: 0, cy: -3, rx: 5, ry: 4, fill: C.sugar }, b); el('ellipse', { cx: 0, cy: 4, rx: 5.5, ry: 5, fill: C.water }, b); });
    return G;
  };
  // 花（正面）：n 片花瓣（5：雙子葉常見；3：單子葉常見），半徑約 60
  D.flowerTop = (p, x, y, s = 1, n = 5, { fill = '#f6f0f4', edge = '#d8a8c0', center = '#ffd166' } = {}) => {
    const G = D.put(p, x, y, s);
    for (let k = 0; k < n; k++) {
      const a = k * 360 / n - 90, pg = S.place(g(G), { x: 0, y: 0, r: a });
      const L = n === 3 ? 62 : 58, w = n === 3 ? 30 : 22;
      el('path', { d: `M 4,0 C ${L * 0.3},${-w} ${L * 0.9},${-w * 1.05} ${L},0 C ${L * 0.9},${w * 1.05} ${L * 0.3},${w} 4,0 Z`, fill, stroke: edge, 'stroke-width': 2 }, pg);
      el('line', { x1: 8, y1: 0, x2: L * 0.7, y2: 0, stroke: edge, 'stroke-width': 1.2, opacity: 0.8 }, pg);
    }
    for (let k = 0; k < (n === 3 ? 6 : 10); k++) { const a = (k / (n === 3 ? 6 : 10)) * Math.PI * 2; el('line', { x1: 0, y1: 0, x2: Math.cos(a) * 16, y2: Math.sin(a) * 16, stroke: center, 'stroke-width': 2 }, G); el('circle', { cx: Math.cos(a) * 17, cy: Math.sin(a) * 17, r: 3.5, fill: center }, G); }
    el('circle', { cx: 0, cy: 0, r: 6, fill: '#9ac04a' }, G);
    return G;
  };
  // 根：tap＝軸根（明顯的主根＋側根）；否則鬚根。原點在地面，向下約 140
  D.roots = (p, x, y, s = 1, tap = true) => {
    const G = D.put(p, x, y, s);
    el('line', { x1: -80, y1: 0, x2: 80, y2: 0, stroke: SOIL_E, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, G);
    el('path', { d: 'M -5,-40 L -5,0 L 5,0 L 5,-40 Z', fill: '#5a9a3a' }, G);
    const RC = '#e8d2a8';
    if (tap) {
      el('path', { d: 'M -7,0 C -7,40 -4,90 0,140 C 4,90 7,40 7,0 Z', fill: RC }, G);
      [[16, -1, 54], [30, 1, 60], [50, -1, 50], [68, 1, 44], [88, -1, 34], [106, 1, 24]].forEach(([yy, sg, L]) => el('path', { d: `M 0,${yy} Q ${sg * L * 0.5},${yy + 6} ${sg * L},${yy + 22}`, fill: 'none', stroke: RC, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, G));
    } else {
      for (let k = 0; k < 13; k++) { const a = (-60 + k * 10) * R, L = 100 + ((k * 29) % 30); el('path', { d: `M ${(k - 6) * 0.8},0 Q ${Math.sin(a) * L * 0.35},${L * 0.5} ${Math.sin(a) * L * 0.62},${Math.cos(a) * L}`, fill: 'none', stroke: RC, 'stroke-width': 3, 'stroke-linecap': 'round' }, G); }
    }
    return G;
  };
  // 百合（單子葉）：直立的莖、細長斜向上的葉（平行脈）、頂端喇叭狀的白花。原點在地面，高約 380
  D.lily = (p, x, y, s = 1, { ground = true } = {}) => {
    const G = D.put(p, x, y, s);
    if (ground) soil(G, -110, 110, 0, 26);
    el('path', { d: 'M 0,2 C -3,-100 4,-200 2,-262', fill: 'none', stroke: '#4f8a34', 'stroke-width': 7, 'stroke-linecap': 'round' }, G);
    [[-1, -30, 110], [1, -62, 112], [-1, -96, 104], [1, -130, 98], [-1, -164, 88], [1, -196, 76], [-1, -224, 62]].forEach(([sg, ly, L]) => {
      const lf = S.place(g(G), { x: sg * 2, y: ly, r: sg > 0 ? -58 : 180 + 58 });
      const d = `M 0,-5 C ${L * 0.3},-10 ${L * 0.7},-7 ${L},${-sg * 6} C ${L * 0.7},3 ${L * 0.3},8 0,5 Z`;
      el('path', { d, fill: '#5cb84a', stroke: '#2f7a3a', 'stroke-width': 1.3 }, lf);
      const vg = g(lf, { 'clip-path': D.clip(lf, d) });
      [-3, 0, 3].forEach((f) => el('path', { d: `M 2,${f} C ${L * 0.5},${f * 1.1} ${L * 0.8},${f * 0.5} ${L - 3},${-sg * 5}`, fill: 'none', stroke: '#c8f0b0', 'stroke-width': 1 }, vg));
    });
    // 花：側面看的喇叭形，花被的尖端向外翻
    const fl = S.place(g(G), { x: 2, y: -262, r: -12 });
    el('path', { d: 'M -6,2 C -8,-20 -14,-44 -30,-70 L 30,-70 C 14,-44 8,-20 6,2 Z', fill: D.lg(fl, [[0, '#cfe0b0'], [1, '#fbfbf4']]), stroke: '#c8c8b8', 'stroke-width': 1.5 }, fl);
    [[-1, 1], [1, 1]].forEach(([sg]) => el('path', { d: `M ${sg * 6},-20 C ${sg * 18},-50 ${sg * 30},-74 ${sg * 58},-96 C ${sg * 64},-100 ${sg * 70},-96 ${sg * 66},-90 C ${sg * 52},-80 ${sg * 40},-66 ${sg * 30},-60 C ${sg * 22},-44 ${sg * 14},-30 ${sg * 6},-20 Z`, fill: '#ffffff', stroke: '#c8c8b8', 'stroke-width': 1.5 }, fl));
    el('path', { d: 'M -10,-30 C -20,-60 -22,-84 -12,-110 C -4,-118 4,-118 12,-110 C 22,-84 20,-60 10,-30 Z', fill: '#fbfbf4', stroke: '#c8c8b8', 'stroke-width': 1.5 }, fl);
    el('path', { d: 'M -12,-110 C -6,-122 6,-122 12,-110', fill: 'none', stroke: '#c8c8b8', 'stroke-width': 1.5 }, fl);
    [-30, -12, 10, 28].forEach((ax) => { el('path', { d: `M 0,-40 Q ${ax * 0.6},-70 ${ax},-90`, fill: 'none', stroke: '#d8e8b8', 'stroke-width': 2 }, fl); el('ellipse', { cx: ax, cy: -94, rx: 3.5, ry: 7, fill: '#c8782a' }, fl); });
    G.pts = { flower: [-8, -360], leaf: [-70, -90] };
    return G;
  };

  // =====================================================================
  //  動物
  // =====================================================================
  // 兩段折線（腳）：p0 → p1 → p2，粗細 w0 → w1
  const limb = (G, P, w, col) => {
    for (let i = 0; i < P.length - 1; i++) el('line', { x1: P[i][0], y1: P[i][1], x2: P[i + 1][0], y2: P[i + 1][1], stroke: col, 'stroke-width': Array.isArray(w) ? w[Math.min(i, w.length - 1)] : w, 'stroke-linecap': 'round' }, G);
    for (let i = 1; i < P.length - 1; i++) el('circle', { cx: P[i][0], cy: P[i][1], r: (Array.isArray(w) ? w[Math.min(i, w.length - 1)] : w) * 0.55, fill: col }, G);
  };
  const mirror = (P) => P.map(([a, b]) => [-a, b]);
  const eye = (G, x0, y0, r, { iris = '#1a1a1a', ring = '#f4f4f4' } = {}) => { el('circle', { cx: x0, cy: y0, r, fill: ring }, G); el('circle', { cx: x0, cy: y0, r: r * 0.68, fill: iris }, G); el('circle', { cx: x0 - r * 0.25, cy: y0 - r * 0.28, r: r * 0.22, fill: '#ffffff' }, G); };

  // 水母（刺絲胞動物）：傘狀的身體、口腕、邊緣許多細長的觸手。原點在傘的中央，約 200 × 330
  D.jelly = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    for (let k = 0; k < 23; k++) { const x0 = -86 + k * 7.8, L = 150 + ((k * 37) % 50); const P = []; for (let i = 0; i <= 12; i++) { const t = i / 12; P.push([x0 * (1 - 0.15 * t) + 7 * Math.sin(t * 7 + k), 8 + L * t]); } el('path', { d: D.curve(P), fill: 'none', stroke: '#cfeeff', 'stroke-width': 1.4, opacity: 0.75 }, G); }
    [-30, -10, 10, 30].forEach((ox, k) => {
      const P = []; for (let i = 0; i <= 20; i++) { const t = i / 20; P.push([ox * (1 + t * 0.8) + 10 * Math.sin(t * 5 + k), 4 + 190 * t]); }
      el('path', { d: D.ribbon(P, (t) => 11 * (1 - t * 0.6) + 3.5 * Math.sin(t * 40 + k)), fill: 'rgba(255,190,225,0.5)', stroke: '#ffd6ec', 'stroke-width': 1.5 }, G);
    });
    const bell = 'M -92,6 C -96,-58 -50,-96 0,-96 C 50,-96 96,-58 92,6 C 60,14 -60,14 -92,6 Z';
    el('path', { d: bell, fill: D.rg(G, [[0, '#e6f6ff', 0.75], [0.7, '#8fcff0', 0.45], [1, '#5fa8d8', 0.35]], 0.5, 0.35, 0.7), stroke: '#e0f4ff', 'stroke-width': 2.5 }, G);
    [[-34, -36], [0, -48], [34, -36]].forEach(([cx, cy]) => el('path', { d: `M ${cx - 16},${cy + 6} C ${cx - 18},${cy - 16} ${cx + 18},${cy - 16} ${cx + 16},${cy + 6}`, fill: 'none', stroke: '#ff9ccf', 'stroke-width': 5, opacity: 0.75, 'stroke-linecap': 'round' }, G));
    for (let k = 0; k < 16; k++) el('path', { d: `M ${-92 + k * 11.5},${6 + Math.sin(k) } q 5.75,6 11.5,0`, fill: 'none', stroke: '#e0f4ff', 'stroke-width': 1.5 }, G);
    G.pts = { tentacle: [-70, 120], bell: [40, -70], arm: [10, 120] };
    return G;
  };
  // 渦蟲（扁形動物）：從背面看，扁平，頭部有兩個眼點。頭朝左，長約 270
  D.planarian = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const d = 'M -136,0 C -134,-10 -122,-26 -108,-30 C -104,-24 -100,-18 -92,-16 C -60,-24 0,-28 50,-24 C 96,-20 124,-10 136,0 C 124,10 96,20 50,24 C 0,28 -60,24 -92,16 C -100,18 -104,24 -108,30 C -122,26 -134,10 -136,0 Z';
    el('path', { d, fill: D.lg(G, [[0, '#5a4a3a'], [0.5, '#8a7058'], [1, '#5a4a3a']]), stroke: '#b89a7a', 'stroke-width': 2 }, G);
    el('path', { d: 'M -80,0 C -20,-8 60,-6 120,0 C 60,6 -20,8 -80,0 Z', fill: '#4a3a2c', opacity: 0.4 }, G);
    el('ellipse', { cx: 10, cy: 0, rx: 26, ry: 6, fill: '#c8ae90', opacity: 0.55 }, G);
    [-1, 1].forEach((sg) => { el('ellipse', { cx: -110, cy: sg * 8, rx: 7, ry: 5.5, fill: '#f4ece0' }, G); el('circle', { cx: -108, cy: sg * 7, r: 3.2, fill: '#1a1a1a' }, G); });
    G.pts = { body: [40, 0], head: [-112, 0] };
    return G;
  };
  // 蝸牛（軟體動物）：殼、腹足、兩對觸角（上面一對的末端有眼）。頭朝右，原點在腹足下緣中央，約 300 × 200
  D.snail = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -126,2 C -122,-10 -60,-18 30,-20 C 70,-22 94,-34 108,-52 C 118,-64 140,-62 142,-46 C 144,-28 132,-12 118,-4 C 96,6 -60,8 -126,2 Z', fill: D.lg(G, [[0, '#d8c0a0'], [1, '#a88a6a']]), stroke: '#e8d4b8', 'stroke-width': 2 }, G);
    for (let k = 0; k < 14; k++) el('path', { d: `M ${-110 + k * 16},-4 q 6,-6 12,0`, fill: 'none', stroke: '#9a7a5a', 'stroke-width': 1.2, opacity: 0.7 }, G);
    [[120, -58, 168, -128], [112, -60, 148, -132]].forEach(([x0, y0, x1, y1]) => { el('path', { d: `M ${x0},${y0} Q ${(x0 + x1) / 2 + 4},${(y0 + y1) / 2} ${x1},${y1}`, fill: 'none', stroke: '#c8ad8a', 'stroke-width': 5, 'stroke-linecap': 'round' }, G); el('circle', { cx: x1, cy: y1, r: 5, fill: '#2a2018' }, G); });
    [[136, -44, 160, -60], [130, -46, 152, -66]].forEach(([x0, y0, x1, y1]) => el('path', { d: `M ${x0},${y0} L ${x1},${y1}`, fill: 'none', stroke: '#c8ad8a', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, G));
    const cx = -18, cy = -78;
    el('circle', { cx, cy, r: 70, fill: D.rg(G, [[0, '#e0b070'], [0.6, '#b07a3a'], [1, '#6a4220']], 0.4, 0.35, 0.75), stroke: '#4a2a12', 'stroke-width': 2.5 }, G);
    const P = []; const b = Math.log(64 / 5) / (4.5 * Math.PI);
    for (let i = 0; i <= 120; i++) { const th = (i / 120) * 4.5 * Math.PI, rr = 5 * Math.exp(b * th); P.push([cx + Math.cos(th + 1.2) * rr, cy + Math.sin(th + 1.2) * rr]); }
    el('path', { d: D.curve(P), fill: 'none', stroke: '#4a2a12', 'stroke-width': 3 }, G);
    const P2 = P.map(([a, c], i) => { const th = (i / 120) * 4.5 * Math.PI, rr = 5 * Math.exp(b * th) * 0.86; return [cx + Math.cos(th + 1.2) * rr, cy + Math.sin(th + 1.2) * rr]; });
    el('path', { d: D.curve(P2.slice(30)), fill: 'none', stroke: '#6a3a14', 'stroke-width': 5, opacity: 0.45 }, G);
    G.pts = { shell: [-18, -140], foot: [-60, -4], tentacle: [168, -128] };
    return G;
  };
  // 烏賊（軟體動物）：從背面看，頭朝左；外套膜兩側有鰭，8 隻腕＋2 隻較長的觸腕。約 330 × 150
  D.cuttle = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const arm = (x0, y0, a, L, w0) => { const P = []; for (let i = 0; i <= 12; i++) { const t = i / 12; P.push([x0 + Math.cos(a + 0.25 * Math.sin(t * 3)) * L * t, y0 + Math.sin(a + 0.25 * Math.sin(t * 3)) * L * t]); } el('path', { d: D.ribbon(P, (t) => w0 * (1 - t * 0.85)), fill: '#c49a72', stroke: '#8a6a4a', 'stroke-width': 1.2 }, G); };
    [[-150, 18, 150], [-210, -18, 150]].forEach(([a0, , L], k) => { const a = (k ? -164 : 164) * R; const P = []; for (let i = 0; i <= 14; i++) { const t = i / 14; P.push([-70 + Math.cos(a) * L * t, (k ? -6 : 6) + Math.sin(a) * L * t + (k ? -1 : 1) * 10 * Math.sin(t * 3)]); } el('path', { d: D.curve(P), fill: 'none', stroke: '#b88a62', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, G); const e = P[P.length - 1]; el('ellipse', { cx: e[0] + 6, cy: e[1], rx: 12, ry: 5, fill: '#c49a72', stroke: '#8a6a4a', 'stroke-width': 1.2, transform: `rotate(${k ? 12 : -12} ${e[0] + 6} ${e[1]})` }, G); });
    [-150, -165, 165, 150, -175, 175, -140, 140].forEach((deg, i) => arm(-74, (deg < 0 ? -1 : 1) * (4 + (i % 3) * 5), deg * R, 60 + (i % 3) * 8, 7));
    const fin = 'M -20,-46 C 30,-70 120,-62 162,-20 C 172,-6 172,6 162,20 C 120,62 30,70 -20,46 Z';
    el('path', { d: fin, fill: 'rgba(230,200,160,0.55)', stroke: '#e8d0b0', 'stroke-width': 1.5 }, G);
    const mant = 'M -30,-38 C 20,-54 110,-50 150,-14 C 158,-6 158,6 150,14 C 110,50 20,54 -30,38 Z';
    el('path', { d: mant, fill: D.lg(G, [[0, '#a87a52'], [0.5, '#d8b088'], [1, '#a87a52']]), stroke: '#8a6a4a', 'stroke-width': 2 }, G);
    const st = g(G, { 'clip-path': D.clip(G, mant) });
    const rr = S.rng(19);
    for (let k = 0; k < 9; k++) { const x0 = -10 + k * 18; el('path', { d: `M ${x0},-52 C ${x0 + 10},-36 ${x0 - 6},-24 ${x0 + 4},-10`, fill: 'none', stroke: '#6a4026', 'stroke-width': 2.2, opacity: 0.5 }, st); el('path', { d: `M ${x0},52 C ${x0 + 10},36 ${x0 - 6},24 ${x0 + 4},10`, fill: 'none', stroke: '#6a4026', 'stroke-width': 2.2, opacity: 0.5 }, st); }
    for (let i = 0; i < 26; i++) el('circle', { cx: -16 + rr() * 160, cy: -30 + rr() * 60, r: 1.5 + rr() * 2.5, fill: '#f4e0c0', opacity: 0.5 }, st);
    el('ellipse', { cx: -52, cy: 0, rx: 30, ry: 32, fill: '#c49a72', stroke: '#8a6a4a', 'stroke-width': 2 }, G);
    [-1, 1].forEach((sg) => { el('ellipse', { cx: -52, cy: sg * 26, rx: 13, ry: 9, fill: '#e8e0c8', stroke: '#8a6a4a', 'stroke-width': 1.5 }, G); el('ellipse', { cx: -52, cy: sg * 27, rx: 8, ry: 4, fill: '#2a2018' }, G); });
    G.pts = { mantle: [60, 0], arm: [-130, 30], fin: [100, -54] };
    return G;
  };
  // 蚯蚓（環節動物）：身體細長、由許多環節組成；靠近頭端有環帶。頭朝左，長約 380
  D.worm = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const P = []; for (let i = 0; i <= 80; i++) { const t = i / 80; P.push([-190 + 380 * t, 18 * Math.sin(t * Math.PI * 3.2 + 0.3)]); }
    const W = (t) => (t < 0.05 ? 3 + Math.sqrt(t / 0.05) * 7.5 : t > 0.88 ? 10.5 * (1 - ((t - 0.88) / 0.12) * 0.6) : 10.5);
    const body = D.ribbon(P, W);
    el('path', { d: body, fill: D.lg(G, [[0, '#e0a090'], [0.5, '#c87868'], [1, '#9a5048']]), stroke: '#7a3a34', 'stroke-width': 1.5 }, G);
    const st = g(G, { 'clip-path': D.clip(G, body) });
    const tmp = el('path', { d: D.curve(P), fill: 'none' }, st), L = tmp.getTotalLength();
    for (let d0 = 6; d0 < L - 4; d0 += 7) { const a = tmp.getPointAtLength(d0), b2 = tmp.getPointAtLength(d0 + 1); const nx = -(b2.y - a.y), ny = b2.x - a.x, m = Math.hypot(nx, ny) || 1; el('line', { x1: a.x - (nx / m) * 18, y1: a.y - (ny / m) * 18, x2: a.x + (nx / m) * 18, y2: a.y + (ny / m) * 18, stroke: '#8a4a42', 'stroke-width': 1.1, opacity: 0.8 }, st); }
    const c0 = tmp.getPointAtLength(L * 0.27), c1 = tmp.getPointAtLength(L * 0.36);
    tmp.remove();
    const cl = P.slice(21, 30);
    el('path', { d: D.ribbon(cl, (t) => 13.5 - Math.pow(Math.abs(t - 0.5) * 2, 4) * 2.5), fill: '#e8a48c', stroke: '#9a5048', 'stroke-width': 1.2 }, G);
    G.pts = { clitellum: [(c0.x + c1.x) / 2, (c0.y + c1.y) / 2], body: [80, 18 * Math.sin(0.71 * Math.PI * 3.2 + 0.3)], seg: [120, 0] };
    return G;
  };
  // 海星（棘皮動物）：五隻腕，體表有許多棘。半徑約 120
  D.starfish = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const P = [];
    for (let k = 0; k < 5; k++) {
      const a = (-90 + k * 72) * R;
      [[-36, 36], [-14, 70], [-5, 108], [0, 118], [5, 108], [14, 70], [36, 36]].forEach(([da, rr]) => P.push([Math.cos(a + da * R * (rr > 60 ? 0.5 : 1)) * rr, Math.sin(a + da * R * (rr > 60 ? 0.5 : 1)) * rr]));
    }
    const d = S.smoothPath(P);
    el('path', { d, fill: D.rg(G, [[0, '#ffb070'], [0.6, '#e8763a'], [1, '#b84a1e']], 0.5, 0.5, 0.6), stroke: '#ffcf9a', 'stroke-width': 2.5 }, G);
    for (let k = 0; k < 5; k++) {
      const a = (-90 + k * 72) * R;
      for (let i = 1; i <= 8; i++) { const rr = 16 + i * 11.5; el('circle', { cx: Math.cos(a) * rr, cy: Math.sin(a) * rr, r: 3.6 - i * 0.2, fill: '#ffe0b8' }, G); [-1, 1].forEach((sg) => { if (i < 7) el('circle', { cx: Math.cos(a) * rr + Math.cos(a + sg * Math.PI / 2) * (14 - i * 1.6), cy: Math.sin(a) * rr + Math.sin(a + sg * Math.PI / 2) * (14 - i * 1.6), r: 2.4, fill: '#ffd09a' }, G); }); }
    }
    el('circle', { cx: 10, cy: 8, r: 5, fill: '#ffe8a0', stroke: '#c8803a', 'stroke-width': 1 }, G);
    G.pts = { spine: [Math.cos(-90 * R) * 62, Math.sin(-90 * R) * 62], arm: [Math.cos(-18 * R) * 90, Math.sin(-18 * R) * 90] };
    return G;
  };
  // 管足（海星腕的腹面，放大）：約 160 × 70
  D.tubeFeet = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -80,-30 L 80,-30 L 80,-6 L -80,-6 Z', fill: '#e8763a', stroke: '#ffcf9a', 'stroke-width': 2 }, G);
    for (let k = 0; k < 9; k++) { const xx = -68 + k * 17, L = 22 + (k % 3) * 5; el('path', { d: `M ${xx},-6 L ${xx + 2},${-6 + L}`, stroke: '#ffd9b0', 'stroke-width': 7, 'stroke-linecap': 'round' }, G); el('ellipse', { cx: xx + 2, cy: -6 + L + 2, rx: 6, ry: 3.5, fill: '#fff0d8' }, G); }
    return G;
  };

  // ----- 節肢動物 -----
  // 蜜蜂（昆蟲，從背面看，頭朝上）：頭、胸、腹三部分；1 對觸角、3 對腳、2 對翅。約 300 × 300，原點在胸部
  D.bee = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const LEG = '#3a2a1a';
    [[[22, -26], [54, -52], [62, -86], [70, -96]], [[28, -8], [76, -6], [96, 30], [100, 44]], [[22, 10], [62, 54], [74, 104], [76, 120]]].forEach((P) => { limb(G, P, [5, 4, 3], LEG); limb(G, mirror(P), [5, 4, 3], LEG); });
    [-1, 1].forEach((sg) => { el('path', { d: `M ${sg * 8},-82 L ${sg * 18},-116 L ${sg * 44},-132`, fill: 'none', stroke: LEG, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G); });
    const ab = 'M 0,4 C 36,4 42,60 34,96 C 26,128 -26,128 -34,96 C -42,60 -36,4 0,4 Z';
    el('path', { d: ab, fill: '#f2c040', stroke: '#8a5a1a', 'stroke-width': 2 }, G);
    const st = g(G, { 'clip-path': D.clip(G, ab) });
    [30, 56, 82, 106].forEach((yy) => el('rect', { x: -50, y: yy, width: 100, height: 12, fill: '#3a2a1a' }, st));
    el('ellipse', { cx: 0, cy: -16, rx: 30, ry: 28, fill: '#a8762e', stroke: '#6a4a1a', 'stroke-width': 2 }, G);
    for (let k = 0; k < 40; k++) { const a = (k / 40) * Math.PI * 2; el('line', { x1: Math.cos(a) * 22, y1: -16 + Math.sin(a) * 20, x2: Math.cos(a) * 32, y2: -16 + Math.sin(a) * 30, stroke: '#d8a850', 'stroke-width': 1.4 }, G); }
    el('ellipse', { cx: 0, cy: -62, rx: 24, ry: 20, fill: '#3a2a1a', stroke: '#6a4a1a', 'stroke-width': 2 }, G);
    [-1, 1].forEach((sg) => el('ellipse', { cx: sg * 18, cy: -62, rx: 9, ry: 15, fill: '#1a1410', stroke: '#6a5a3a', 'stroke-width': 1.5 }, G));
    [-1, 1].forEach((sg) => {
      el('path', { d: `M ${sg * 22},-28 C ${sg * 70},-60 ${sg * 140},-58 ${sg * 152},-36 C ${sg * 160},-18 ${sg * 120},-6 ${sg * 26},-14 Z`, fill: 'rgba(225,240,255,0.32)', stroke: '#e8f4ff', 'stroke-width': 2 }, G);
      el('path', { d: `M ${sg * 26},-22 C ${sg * 70},-40 ${sg * 110},-40 ${sg * 140},-34 M ${sg * 60},-40 L ${sg * 80},-22 M ${sg * 96},-46 L ${sg * 110},-24`, fill: 'none', stroke: '#e8f4ff', 'stroke-width': 1.2, opacity: 0.8 }, G);
      el('path', { d: `M ${sg * 26},-6 C ${sg * 66},-4 ${sg * 108},6 ${sg * 112},22 C ${sg * 114},36 ${sg * 70},30 ${sg * 26},4 Z`, fill: 'rgba(225,240,255,0.28)', stroke: '#e8f4ff', 'stroke-width': 1.8 }, G);
    });
    G.pts = { head: [0, -62], thorax: [0, -16], abdomen: [0, 70], antenna: [44, -132], leg: [100, 44], wing: [-130, -40], wing2: [-100, 20] };
    return G;
  };
  // 螃蟹（甲殼類，從背面看）：5 對腳，第 1 對是螯足。約 380 × 280，原點在殼的中央
  D.crab = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const LC = '#c8502e', LE = '#7a2a14';
    for (let k = 0; k < 4; k++) {
      const y0 = -14 + k * 22, P = [[80, y0], [140, y0 - 30 + k * 12], [176 - k * 6, y0 + 10 + k * 14], [186 - k * 10, y0 + 40 + k * 14]];
      [P, mirror(P)].forEach((Q) => { limb(G, Q, [11, 9, 5], LE); limb(G, Q, [8, 6.5, 3], LC); });
    }
    [-1, 1].forEach((sg) => {
      const Q = [[sg * 70, -44], [sg * 100, -88], [sg * 104, -118]];
      limb(G, Q, [14, 13], LE); limb(G, Q, [11, 10], LC);
      const cl = S.place(g(G), { x: sg * 104, y: -124, r: sg * -20 });
      el('path', { d: `M -20,10 C -26,-14 -18,-44 0,-56 C 10,-48 14,-36 10,-24 L 4,-18 C 18,-30 26,-44 26,-56 C 34,-40 30,-6 20,8 C 12,18 -12,20 -20,10 Z`, fill: LC, stroke: LE, 'stroke-width': 2.5, transform: sg < 0 ? 'scale(-1,1)' : '' }, cl);
    });
    el('path', { d: 'M -96,-30 C -96,-60 -60,-72 0,-72 C 60,-72 96,-60 96,-30 C 100,10 70,62 0,66 C -70,62 -100,10 -96,-30 Z', fill: D.rg(G, [[0, '#e8784a'], [0.7, '#c8502e'], [1, '#8a3418']], 0.5, 0.4, 0.7), stroke: LE, 'stroke-width': 3 }, G);
    for (let k = -4; k <= 4; k++) el('path', { d: `M ${k * 18 - 6},-70 l 6,-8 l 6,8`, fill: LC, stroke: LE, 'stroke-width': 1.5 }, G);
    el('path', { d: 'M -40,-30 C -20,-14 20,-14 40,-30 M -30,10 C -10,24 10,24 30,10 M 0,-40 L 0,40', fill: 'none', stroke: '#8a3418', 'stroke-width': 2, opacity: 0.6 }, G);
    [-1, 1].forEach((sg) => { el('line', { x1: sg * 18, y1: -70, x2: sg * 24, y2: -92, stroke: LE, 'stroke-width': 5 }, G); el('circle', { cx: sg * 24, cy: -94, r: 6, fill: '#1a1a1a', stroke: '#e8e0d0', 'stroke-width': 1.5 }, G); });
    G.pts = { claw: [120, -160], leg: [176, 64], shell: [0, 0] };
    return G;
  };
  // 蝦（甲殼類，側面）：頭胸部＋腹部、長觸角、5 對步足（看得到一側的 5 隻）。頭朝左，約 380 × 200
  D.shrimp = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const C1 = '#e88a6a', C2 = '#a8483a';
    el('path', { d: 'M -100,-26 C -160,-60 -220,-50 -260,-30 M -96,-22 C -150,-40 -200,-26 -240,0', fill: 'none', stroke: C1, 'stroke-width': 2, 'stroke-linecap': 'round' }, G);
    for (let k = 0; k < 5; k++) { const x0 = -70 + k * 22; limb(G, [[x0, 16], [x0 - 10, 46], [x0 - 4, 76]], [4, 3], C2); }
    for (let k = 0; k < 5; k++) { const x0 = 40 + k * 22; el('path', { d: `M ${x0},${14 - k * 2} q -6,16 0,26`, fill: 'none', stroke: C1, 'stroke-width': 3 }, G); }
    el('path', { d: 'M -110,-14 C -110,-40 -60,-44 10,-38 C 10,-38 14,12 10,20 C -50,24 -100,16 -110,-14 Z', fill: D.lg(G, [[0, '#f0a080'], [1, '#c86a4a']]), stroke: C2, 'stroke-width': 2 }, G);
    el('path', { d: 'M -110,-20 L -170,-28 L -110,-30 Z', fill: C1, stroke: C2, 'stroke-width': 1.5 }, G);
    for (let k = 0; k < 6; k++) el('path', { d: `M ${8 + k * 26},${-38 + k * 4} C ${22 + k * 26},${-42 + k * 6} ${36 + k * 26},${-36 + k * 8} ${36 + k * 26},${-30 + k * 8} L ${34 + k * 24},${14 - k * 2} L ${8 + k * 24},${18 - k * 1} Z`, fill: k % 2 ? '#e88a6a' : '#f09a7a', stroke: C2, 'stroke-width': 1.8 }, G);
    el('path', { d: 'M 164,-6 L 200,-26 L 206,8 L 196,30 L 164,10 Z', fill: '#f0a080', stroke: C2, 'stroke-width': 2 }, G);
    eye(G, -96, -30, 6, { ring: '#2a1a14', iris: '#000' });
    G.pts = { leg: [-26, 60], antenna: [-230, -40] };
    return G;
  };
  // 蜘蛛（蛛形類，從背面看）：頭胸部＋腹部、4 對腳、沒有觸角。約 320 × 320，原點在頭胸部
  D.spider = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const LG = '#4a3220';
    [[[20, -18], [70, -70], [96, -138]], [[26, -4], [96, -50], [138, -96]], [[26, 10], [100, 0], [146, 64]], [[18, 22], [70, 52], [96, 132]]].forEach((P) => { [P, mirror(P)].forEach((Q) => { limb(G, Q, [7, 4.5], LG); }); });
    [-1, 1].forEach((sg) => limb(G, [[sg * 10, -32], [sg * 22, -50], [sg * 18, -62]], [4, 3], LG));
    el('ellipse', { cx: 0, cy: 66, rx: 46, ry: 60, fill: D.rg(G, [[0, '#9a7650'], [1, '#5a3e24']], 0.5, 0.4, 0.7), stroke: '#2a1a10', 'stroke-width': 2 }, G);
    el('path', { d: 'M 0,20 C 22,40 26,80 0,118 C -26,80 -22,40 0,20 Z', fill: '#c8a878', opacity: 0.5 }, G);
    el('ellipse', { cx: 0, cy: -6, rx: 30, ry: 34, fill: D.rg(G, [[0, '#8a6a48'], [1, '#4a3220']], 0.5, 0.4, 0.7), stroke: '#2a1a10', 'stroke-width': 2 }, G);
    [[-8, -32], [8, -32], [-15, -26], [15, -26], [-4, -24], [4, -24], [-10, -36], [10, -36]].forEach(([ex, ey]) => el('circle', { cx: ex, cy: ey, r: 2.6, fill: '#101010' }, G));
    G.pts = { ceph: [0, -6], abdomen: [0, 66], leg: [[96, -138], [138, -96], [146, 64], [96, 132]] };
    return G;
  };
  // 蜈蚣（多足類，從背面看）：身體分成許多節，每節 1 對腳，頭上有 1 對觸角。頭朝左，約 380 × 150
  D.centipede = (p, x, y, s = 1, r = 0) => {
    const G = D.put(p, x, y, s, r);
    const n = 15, P = []; for (let i = 0; i < n; i++) { const t = i / (n - 1); P.push([-150 + t * 300, 18 * Math.sin(t * Math.PI * 1.6)]); }
    P.forEach(([px, py], i) => { if (i === 0) return; const a = Math.atan2((P[Math.min(n - 1, i + 1)][1] - P[i - 1][1]), (P[Math.min(n - 1, i + 1)][0] - P[i - 1][0])); [-1, 1].forEach((sg) => { const L = i === n - 1 ? 52 : 30; const nx = -Math.sin(a) * sg, ny = Math.cos(a) * sg; limb(G, [[px + nx * 8, py + ny * 8], [px + nx * L * 0.7 + Math.cos(a) * 4, py + ny * L * 0.7 + Math.sin(a) * 4], [px + nx * L + Math.cos(a) * (i === n - 1 ? 34 : 12), py + ny * L + Math.sin(a) * (i === n - 1 ? 34 : 12)]], [3.5, 2.5], '#e8b040'); }); });
    P.forEach(([px, py], i) => { if (i === 0) return; el('ellipse', { cx: px, cy: py, rx: 12, ry: i === n - 1 ? 10 : 15, fill: '#a8402a', stroke: '#5a1a10', 'stroke-width': 2, transform: `rotate(${Math.atan2(18 * Math.PI * 1.6 / 300 * Math.cos(((i / (n - 1)) * Math.PI * 1.6)), 1) / R} ${px} ${py})` }, G); });
    const [hx, hy] = P[0];
    [-1, 1].forEach((sg) => el('path', { d: `M ${hx - 8},${hy + sg * 6} C ${hx - 40},${hy + sg * 16} ${hx - 64},${hy + sg * 40} ${hx - 80},${hy + sg * 64}`, fill: 'none', stroke: '#e8b040', 'stroke-width': 3, 'stroke-linecap': 'round' }, G));
    el('ellipse', { cx: hx, cy: hy, rx: 14, ry: 15, fill: '#5a1a10', stroke: '#2a0a06', 'stroke-width': 2 }, G);
    [-1, 1].forEach((sg) => el('path', { d: `M ${hx + 6},${hy + sg * 12} q -14,${sg * 8} -20,${sg * 2}`, fill: 'none', stroke: '#2a0a06', 'stroke-width': 3 }, G));
    G.pts = { antenna: [hx - 70, hy + 54], leg: [P[6][0], P[6][1] + 30], body: [P[8][0], P[8][1]] };
    return G;
  };

  // ----- 脊椎動物 -----
  // 魚（硬骨魚，側面，頭朝左）：鰓蓋、鱗片、各種鰭。約 340 × 170；xray：顯示脊椎骨
  D.fish = (p, x, y, s = 1, { xray = false } = {}) => {
    const G = D.put(p, x, y, s);
    const finF = 'rgba(200,220,210,0.55)', finE = '#dfeee6';
    const fin = (d, rays) => { el('path', { d, fill: finF, stroke: finE, 'stroke-width': 1.5 }, G); if (rays) el('path', { d: rays, fill: 'none', stroke: finE, 'stroke-width': 1.2, opacity: 0.8 }, G); };
    fin('M -60,-58 L -52,-92 L -36,-96 L -20,-98 L 0,-98 L 20,-96 L 40,-92 L 62,-84 L 88,-66 L 100,-44 C 60,-58 0,-62 -60,-58 Z', 'M -52,-60 L -52,-92 M -36,-62 L -36,-96 M -20,-62 L -20,-98 M 0,-62 L 0,-98 M 20,-61 L 20,-96 M 40,-60 L 40,-92 M 62,-56 L 62,-84 M 84,-50 L 88,-66');
    fin('M 40,52 C 60,70 86,74 104,62 C 108,50 100,40 96,32 C 80,44 60,50 40,52 Z', 'M 54,54 L 60,70 M 70,50 L 80,72 M 86,44 L 98,66');
    fin('M 120,-8 C 140,-30 156,-54 178,-66 C 170,-24 170,24 178,66 C 156,54 140,30 120,8 Z', 'M 126,-4 L 172,-56 M 128,0 L 170,-20 M 128,0 L 170,20 M 126,4 L 172,56');
    const body = 'M -150,4 C -146,-34 -96,-60 -14,-62 C 56,-62 100,-34 126,-12 L 126,12 C 100,34 56,56 -14,58 C -96,58 -146,40 -150,4 Z';
    el('path', { d: body, fill: D.lg(G, [[0, '#4f7a6a'], [0.45, '#8ab0a0'], [1, '#e0ece4']]), stroke: '#2f5a4a', 'stroke-width': 2.5, 'fill-opacity': xray ? 0.45 : 1 }, G);
    const st = g(G, { 'clip-path': D.clip(G, body) });
    if (!xray) for (let row = -6; row <= 6; row++) for (let col = 0; col < 18; col++) { const cx = -76 + col * 12 + (row % 2 ? 6 : 0), cy = row * 9; el('path', { d: `M ${cx},${cy - 5} A 6,6 0 0 1 ${cx},${cy + 5}`, fill: 'none', stroke: '#2f5a4a', 'stroke-width': 1.2, opacity: 0.5 }, st); }
    if (xray) {
      el('path', { d: 'M -140,-4 C -120,-34 -96,-40 -82,-30', fill: 'none', stroke: '#f4f4f4', 'stroke-width': 3 }, G);
      for (let k = 0; k < 20; k++) { const vx = -78 + k * 10, vy = -10 + Math.sin(k / 20 * 3) * 2; el('rect', { x: vx, y: vy - 5, width: 8, height: 10, rx: 2, fill: '#f4f4f4' }, G); el('line', { x1: vx + 4, y1: vy - 5, x2: vx + 8, y2: vy - 22 - Math.sin(k / 19 * Math.PI) * 18, stroke: '#f4f4f4', 'stroke-width': 1.6 }, G); if (k < 11) el('path', { d: `M ${vx + 4},${vy + 5} Q ${vx + 6},${vy + 30} ${vx + 2},${vy + 48 - k * 1.5}`, fill: 'none', stroke: '#f4f4f4', 'stroke-width': 1.6 }, G); }
    } else el('path', { d: 'M -84,-24 C -20,-30 60,-22 122,-2', fill: 'none', stroke: '#2f5a4a', 'stroke-width': 2, 'stroke-dasharray': '3 4' }, G);
    el('path', { d: 'M -86,-46 C -70,-20 -70,20 -86,44', fill: 'none', stroke: '#2f5a4a', 'stroke-width': 3 }, G);
    fin('M -74,8 C -54,-4 -30,0 -24,14 C -36,24 -56,24 -74,8 Z', 'M -70,8 L -30,6 M -70,8 L -32,16');
    fin('M -40,50 C -30,60 -10,74 0,74 C -6,62 -16,54 -28,48 Z');
    el('path', { d: 'M -150,6 L -136,8', stroke: '#1f3a30', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, G);
    eye(G, -118, -16, 10, { ring: '#e8e0b0' });
    G.pts = { gill: [-76, 0], scale: [30, 20], fin: [150, 40], spine: [20, -10], body: [10, 30] };
    return G;
  };
  // 青蛙（兩生類，側面坐姿，頭朝左）：大眼、鼓膜、摺起來的長後腿、有蹼的腳。原點在地面中央，約 250 × 150
  D.frog = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const GR = '#5aa04a', GD = '#2a5a24', BELLY = '#e6e6b4';
    // 身體
    const body = 'M -122,-66 C -120,-84 -100,-100 -70,-104 C -30,-108 20,-100 60,-80 C 92,-64 108,-42 104,-24 C 100,-12 80,-10 40,-14 C 0,-16 -40,-22 -70,-34 C -96,-44 -118,-52 -122,-66 Z';
    el('path', { d: body, fill: D.lg(G, [[0, '#6cbc58'], [0.62, '#4f9a3f'], [0.8, '#a8c878'], [1, BELLY]]), stroke: GD, 'stroke-width': 2.5 }, G);
    [[-30, -92, 8], [6, -94, 7], [40, -80, 9], [-6, -74, 6], [72, -58, 6]].forEach(([cx, cy, rr]) => el('ellipse', { cx, cy, rx: rr, ry: rr * 0.7, fill: '#2f6a2a', opacity: 0.55 }, G));
    // 前腳
    el('path', { d: 'M -68,-40 C -64,-26 -66,-14 -72,-4', fill: 'none', stroke: GR, 'stroke-width': 11, 'stroke-linecap': 'round' }, G);
    el('path', { d: 'M -68,-40 C -64,-26 -66,-14 -72,-4', fill: 'none', stroke: GD, 'stroke-width': 1.5, opacity: 0.5 }, G);
    el('path', { d: 'M -72,-2 l -16,2 M -72,-2 l -8,7 M -72,-2 l 4,6', fill: 'none', stroke: GR, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, G);
    // 後腳：腳掌（往前平貼地面，有蹼）、小腿（往後摺）、大腿
    el('path', { d: 'M 66,-6 C 40,-4 10,-2 -18,-2 L -34,-8 L -30,-1 L -40,2 L -28,4 L -34,10 L -16,6 C 10,6 40,6 66,4 Z', fill: GR, stroke: GD, 'stroke-width': 2 }, G);
    el('path', { d: 'M -32,-6 L -36,7 L -18,4 Z', fill: 'rgba(160,210,140,0.75)' }, G);
    el('path', { d: 'M 6,-28 C 30,-30 60,-22 76,-10 C 80,-2 70,4 60,0 C 44,-6 22,-14 6,-16 Z', fill: '#57a046', stroke: GD, 'stroke-width': 2 }, G);
    el('path', { d: 'M 96,-44 C 104,-24 86,-10 60,-14 C 30,-18 6,-18 2,-24 C 0,-32 20,-44 50,-52 C 74,-58 90,-56 96,-44 Z', fill: D.lg(G, [[0, '#5fac4c'], [1, '#4a8a3a']]), stroke: GD, 'stroke-width': 2.5 }, G);
    // 頭：嘴、眼、鼓膜、鼻孔
    el('path', { d: 'M -122,-64 C -104,-60 -82,-60 -60,-66', fill: 'none', stroke: GD, 'stroke-width': 2.5 }, G);
    el('circle', { cx: -88, cy: -98, r: 15, fill: '#4f9a3f', stroke: GD, 'stroke-width': 2 }, G);
    el('circle', { cx: -88, cy: -100, r: 11, fill: '#d8b040' }, G);
    el('ellipse', { cx: -88, cy: -100, rx: 8, ry: 4, fill: '#101010' }, G);
    el('circle', { cx: -91, cy: -103, r: 2.2, fill: '#ffffff' }, G);
    el('circle', { cx: -54, cy: -80, r: 11, fill: '#6a7a3a', stroke: GD, 'stroke-width': 2 }, G);
    el('circle', { cx: -114, cy: -82, r: 2, fill: GD }, G);
    G.pts = { skin: [20, -98], eye: [-88, -100], leg: [60, -40], ear: [-54, -80] };
    return G;
  };
  // 蝌蚪（兩生類的幼體）：用鰓呼吸、有尾。頭朝左，約 180 × 70
  D.tadpole = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -10,-6 C 30,-26 70,-24 110,-4 C 70,0 70,6 110,4 C 70,26 30,24 -10,8 Z', fill: 'rgba(120,110,80,0.6)', stroke: '#b8a880', 'stroke-width': 1.5 }, G);
    el('ellipse', { cx: -40, cy: 0, rx: 46, ry: 30, fill: D.rg(G, [[0, '#7a6a4a'], [1, '#3a3020']], 0.45, 0.4, 0.7), stroke: '#b8a880', 'stroke-width': 2 }, G);
    [-1, 1].forEach(() => {});
    for (let k = 0; k < 3; k++) el('path', { d: `M -18,${-26 + k * 5} q 6,${-10} 12,${-6} q -4,6 2,10`, fill: 'none', stroke: '#e8a0a0', 'stroke-width': 2.5 }, G);
    eye(G, -66, -8, 6, { ring: '#d8c890' });
    G.pts = { gill: [-10, -32], tail: [80, 0] };
    return G;
  };
  // 蜥蜴（爬蟲類，從背面看，頭朝左）：身體有鱗片、四肢向兩側伸出、長尾巴。約 400 × 200
  D.lizard = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const C1 = '#8a9a4a', C2 = '#4a5a22';
    const legs = [[-70, -1, -40], [-70, 1, -40], [60, -1, 40], [60, 1, 40]];
    legs.forEach(([lx, sg, tilt]) => {
      const kx = lx + (tilt < 0 ? -10 : 18), ky = sg * 48, fx = lx + (tilt < 0 ? -30 : 34), fy = sg * 70;
      limb(G, [[lx, sg * 14], [kx, ky], [fx, fy]], [12, 9], C2); limb(G, [[lx, sg * 14], [kx, ky], [fx, fy]], [9, 6.5], C1);
      for (let k = 0; k < 5; k++) { const a = (tilt < 0 ? -150 : -30) * R + sg * (k - 2) * 0.35 + (sg > 0 ? (tilt < 0 ? -0.6 : 0.6) : (tilt < 0 ? 0.6 : -0.6)); el('line', { x1: fx, y1: fy, x2: fx + Math.cos(a) * 16, y2: fy + Math.sin(a) * 16 * sg * -1 * -1, stroke: C1, 'stroke-width': 3, 'stroke-linecap': 'round' }, G); }
    });
    const P = []; for (let i = 0; i <= 50; i++) { const t = i / 50; P.push([-150 + 380 * t, 16 * Math.sin(t * Math.PI * 1.8 + 0.4) * t]); }
    const body = D.ribbon(P, (t) => (t < 0.1 ? 10 + t * 120 : t < 0.42 ? 22 + 6 * Math.sin(((t - 0.1) / 0.32) * Math.PI) : 22 * Math.pow(Math.max(0, 1 - (t - 0.42) / 0.58), 1.2) + 1));
    el('path', { d: body, fill: D.lg(G, [[0, '#6a7a32'], [0.5, '#a8b860'], [1, '#6a7a32']]), stroke: C2, 'stroke-width': 2 }, G);
    const st = g(G, { 'clip-path': D.clip(G, body) });
    for (let xx = -150; xx < 240; xx += 8) for (let yy = -30; yy <= 30; yy += 8) el('path', { d: `M ${xx + ((yy / 8) % 2 ? 4 : 0)},${yy} q 4,4 8,0`, fill: 'none', stroke: C2, 'stroke-width': 1, opacity: 0.55 }, st);
    el('path', { d: 'M -176,0 C -172,-8 -150,-18 -124,-20 C -110,-20 -102,-14 -98,-10 L -98,10 C -102,14 -110,20 -124,20 C -150,18 -172,8 -176,0 Z', fill: '#7a8a3a', stroke: C2, 'stroke-width': 2 }, G);
    [-1, 1].forEach((sg) => el('circle', { cx: -170, cy: sg * 3, r: 1.5, fill: C2 }, G));
    [-1, 1].forEach((sg) => eye(G, -132, sg * 14, 4.5, { ring: '#d8c060' }));
    G.pts = { scale: [-20, -10], tail: [180, 10], leg: [-100, -60] };
    return G;
  };
  // 麻雀（鳥類，側面，停在樹枝上，頭朝左）：喙、羽毛、翅膀。約 260 × 220，原點在樹枝上
  D.bird = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    el('path', { d: 'M -130,6 C -60,0 60,8 140,2', fill: 'none', stroke: '#6a4a2a', 'stroke-width': 9, 'stroke-linecap': 'round' }, G);
    el('path', { d: 'M 40,-60 L 130,-10 L 136,-24 L 140,-6 L 128,0 L 50,-36 Z', fill: '#6a4a2a', stroke: '#3a2614', 'stroke-width': 2 }, G);
    [[-6, -30], [10, -28]].forEach(([lx, ly]) => { el('path', { d: `M ${lx},${ly} L ${lx - 4},2 M ${lx - 4},2 l -12,2 M ${lx - 4},2 l 2,8 M ${lx - 4},2 l 10,4`, fill: 'none', stroke: '#c8a07a', 'stroke-width': 3, 'stroke-linecap': 'round' }, G); });
    el('path', { d: 'M -60,-110 C -40,-128 0,-120 30,-96 C 60,-74 74,-46 56,-30 C 30,-14 -20,-20 -46,-40 C -64,-56 -70,-90 -60,-110 Z', fill: D.lg(G, [[0, '#a8784a'], [0.6, '#c8a07a'], [1, '#e8dcc8']]), stroke: '#5a3a1e', 'stroke-width': 2 }, G);
    el('path', { d: 'M -30,-96 C 10,-104 54,-80 76,-46 C 64,-40 40,-40 20,-48 C 0,-58 -20,-76 -30,-96 Z', fill: '#8a5a32', stroke: '#4a2a12', 'stroke-width': 1.8 }, G);
    for (let k = 0; k < 4; k++) el('path', { d: `M ${-10 + k * 16},${-86 + k * 8} q 8,6 14,0`, fill: 'none', stroke: '#e8d4b0', 'stroke-width': 1.6 }, G);
    for (let k = 0; k < 5; k++) el('path', { d: `M ${16 + k * 12},${-56 + k * 3} L ${70 + k * 4},${-44 + k * 2}`, fill: 'none', stroke: '#3a2010', 'stroke-width': 1.6 }, G);
    el('circle', { cx: -62, cy: -122, r: 30, fill: '#d8c8b0', stroke: '#5a3a1e', 'stroke-width': 2 }, G);
    el('path', { d: 'M -90,-130 C -80,-152 -44,-156 -34,-130 C -50,-136 -70,-134 -90,-130 Z', fill: '#8a4a2a' }, G);
    el('path', { d: 'M -86,-114 C -82,-100 -72,-94 -62,-96 L -70,-90 C -80,-92 -88,-100 -88,-110 Z', fill: '#1a1410' }, G);
    eye(G, -74, -126, 4.5, { ring: '#1a1410', iris: '#000' });
    el('path', { d: 'M -90,-124 L -112,-118 L -90,-112 Z', fill: '#4a4040', stroke: '#2a2020', 'stroke-width': 1.2 }, G);
    G.pts = { feather: [10, -70], beak: [-104, -118], wing: [40, -60] };
    return G;
  };
  // 兔（哺乳類，側面坐姿，頭朝左）：全身有毛、長耳朵。原點在地面，約 240 × 240
  D.rabbit = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const F = D.lg(G, [[0, '#a88a68'], [0.7, '#c8aa88'], [1, '#e8dcc8']]), E = '#5a4430';
    el('path', { d: 'M -40,-150 C -46,-196 -30,-230 -14,-228 C 0,-224 -8,-180 -16,-146 Z', fill: '#b8987a', stroke: E, 'stroke-width': 2 }, G);
    el('path', { d: 'M -36,-152 C -40,-190 -30,-216 -20,-214 C -12,-206 -18,-176 -22,-150 Z', fill: '#e0b0a8' }, G);
    el('path', { d: 'M -60,-90 C -70,-130 -20,-160 40,-130 C 100,-100 120,-40 100,-6 C 90,6 -10,6 -40,-4 C -64,-14 -56,-60 -60,-90 Z', fill: F, stroke: E, 'stroke-width': 2 }, G);
    el('path', { d: 'M 40,-4 C 50,-34 96,-36 104,-10 C 106,0 60,4 40,-4 Z', fill: '#b8987a', stroke: E, 'stroke-width': 2 }, G);
    el('path', { d: 'M 40,0 C 20,2 -10,2 -24,0 C -26,-6 -10,-10 30,-8 Z', fill: '#c8aa88', stroke: E, 'stroke-width': 1.5 }, G);
    el('circle', { cx: 112, cy: -46, r: 14, fill: '#f4ece0', stroke: '#c8b8a0', 'stroke-width': 1.5 }, G);
    el('path', { d: 'M -52,-64 C -46,-44 -48,-20 -54,-6 C -58,0 -44,4 -36,-2 C -32,-20 -32,-44 -34,-58 Z', fill: '#d8c4a8', stroke: E, 'stroke-width': 1.5 }, G);
    el('path', { d: 'M -100,-120 C -104,-150 -70,-170 -40,-160 C -14,-150 -6,-120 -20,-100 C -36,-82 -80,-82 -96,-100 C -100,-106 -100,-114 -100,-120 Z', fill: F, stroke: E, 'stroke-width': 2 }, G);
    el('path', { d: 'M -56,-156 C -60,-200 -46,-232 -30,-232 C -16,-228 -22,-186 -32,-152 Z', fill: '#c8aa88', stroke: E, 'stroke-width': 2 }, G);
    el('path', { d: 'M -50,-156 C -52,-192 -42,-218 -34,-220 C -26,-212 -30,-184 -36,-154 Z', fill: '#f0c0b8' }, G);
    eye(G, -66, -130, 7, { ring: '#2a1a10', iris: '#100806' });
    el('path', { d: 'M -100,-112 l 6,-4 l 0,8 Z', fill: '#c87878' }, G);
    [[-30, -2], [-20, 6], [-10, 0]].forEach(() => {});
    [[-96, -110, -130, -118], [-96, -108, -132, -104], [-96, -106, -126, -92]].forEach(([a, b, c, d]) => el('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#e8e0d0', 'stroke-width': 1.2 }, G));
    for (let k = 0; k < 16; k++) { const xx = -40 + k * 9, yy = -110 + Math.abs(k - 8) * 6; el('path', { d: `M ${xx},${yy} q 3,6 1,12`, fill: 'none', stroke: '#8a6a4a', 'stroke-width': 1.2, opacity: 0.6 }, G); }
    G.pts = { fur: [40, -110], ear: [-36, -210], body: [40, -60] };
    return G;
  };
  // 鯨（大翅鯨，哺乳類，側面，頭朝左）：用肺呼吸（頭頂有噴氣孔）、水平的尾鰭。約 460 × 200
  D.whale = (p, x, y, s = 1, { spout = true } = {}) => {
    const G = D.put(p, x, y, s);
    const BD = '#3a4a5e', BL = '#c8d4dc';
    el('path', { d: 'M 168,-10 C 196,-40 226,-50 240,-46 C 232,-30 214,-14 196,-4 C 214,6 234,22 240,40 C 222,40 194,30 168,6 Z', fill: BD, stroke: '#1a2a3a', 'stroke-width': 2 }, G);
    const body = 'M -230,-6 C -226,-40 -170,-58 -90,-62 C 0,-66 100,-50 170,-8 L 170,4 C 110,30 20,44 -80,44 C -170,44 -226,30 -230,-6 Z';
    el('path', { d: body, fill: D.lg(G, [[0, '#2a3a4e'], [0.6, BD], [1, '#6a7a8a']]), stroke: '#1a2a3a', 'stroke-width': 2.5 }, G);
    const st = g(G, { 'clip-path': D.clip(G, body) });
    el('path', { d: 'M -230,8 C -170,30 -60,46 40,34 L 40,60 L -230,60 Z', fill: BL, opacity: 0.85 }, st);
    for (let k = 0; k < 9; k++) el('path', { d: `M -210,${12 + k * 3.5} C -150,${26 + k * 3} -90,${30 + k * 2.5} -20,${30 + k * 1.5}`, fill: 'none', stroke: '#7a8a9a', 'stroke-width': 1.3 }, st);
    [[-206, -30], [-186, -40], [-160, -46], [-196, -18]].forEach(([kx, ky]) => el('circle', { cx: kx, cy: ky, r: 3.5, fill: '#5a6a7a' }, G));
    el('path', { d: 'M -230,-4 C -200,4 -150,10 -110,8', fill: 'none', stroke: '#1a2a3a', 'stroke-width': 2 }, G);
    el('circle', { cx: -118, cy: -4, r: 4, fill: '#0a1018' }, G);
    el('path', { d: 'M -96,20 C -70,40 -30,90 0,118 C 8,122 12,116 6,108 C -14,80 -40,40 -60,16 Z', fill: '#d8e0e6', stroke: '#5a6a7a', 'stroke-width': 2 }, G);
    el('path', { d: 'M 90,-46 C 100,-60 112,-66 118,-66 C 116,-56 112,-44 112,-36 Z', fill: BD, stroke: '#1a2a3a', 'stroke-width': 2 }, G);
    el('ellipse', { cx: -150, cy: -54, rx: 7, ry: 3, fill: '#0a1018' }, G);
    if (spout) [-1, 1].forEach((sg) => el('path', { d: `M -150,-60 C ${-150 + sg * 6},-90 ${-150 + sg * 24},-120 ${-150 + sg * 40},-134`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7, 'stroke-dasharray': '2 9' }, G));
    G.pts = { blow: [-150, -56], tail: [230, -40], flipper: [-20, 90], body: [0, -30] };
    return G;
  };
  // 蝙蝠（哺乳類，張開翅膀，從背面看）：有毛的身體、大耳朵；翅膀是指骨間的皮膜。約 460 × 220
  D.bat = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const BONE = '#a8866a', MEM = 'rgba(90,62,48,0.9)', ME = '#c8a888';
    [-1, 1].forEach((sg) => {
      const sh = [sg * 18, -24], el2 = [sg * 76, -54], wr = [sg * 120, -36];
      const f2 = [sg * 214, -44], f3 = [sg * 224, 14], f4 = [sg * 186, 58], f5 = [sg * 128, 66], foot = [sg * 34, 76];
      const mem = `M ${sh[0]},${sh[1]} L ${el2[0]},${el2[1]} L ${wr[0]},${wr[1]} L ${f2[0]},${f2[1]} Q ${sg * 204},${-6} ${f3[0]},${f3[1]} Q ${sg * 186},${26} ${f4[0]},${f4[1]} Q ${sg * 150},${46} ${f5[0]},${f5[1]} Q ${sg * 80},${52} ${foot[0]},${foot[1]} L ${sg * 14},${30} Z`;
      el('path', { d: mem, fill: MEM, stroke: ME, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, G);
      limb(G, [sh, el2, wr], [5, 4], BONE);
      [f2, f3, f4, f5].forEach((f) => el('line', { x1: wr[0], y1: wr[1], x2: f[0], y2: f[1], stroke: BONE, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, G));
      el('path', { d: `M ${wr[0]},${wr[1]} l ${sg * 6},-14 l ${sg * 6},2`, fill: 'none', stroke: BONE, 'stroke-width': 3, 'stroke-linecap': 'round' }, G);
      el('path', { d: `M ${sg * 16},34 L ${foot[0]},${foot[1]} l ${sg * 6},8 M ${foot[0]},${foot[1]} l 0,9 M ${foot[0]},${foot[1]} l ${-sg * 5},8`, fill: 'none', stroke: BONE, 'stroke-width': 3, 'stroke-linecap': 'round' }, G);
    });
    el('path', { d: 'M -34,76 Q 0,104 34,76 L 0,40 Z', fill: MEM, stroke: ME, 'stroke-width': 1.5 }, G);
    el('ellipse', { cx: 0, cy: 6, rx: 24, ry: 42, fill: D.rg(G, [[0, '#9a7254'], [1, '#5a3e2c']], 0.5, 0.4, 0.7), stroke: '#3a2618', 'stroke-width': 2 }, G);
    for (let k = 0; k < 18; k++) { const xx = -16 + (k % 6) * 6.5, yy = -20 + Math.floor(k / 6) * 16; el('path', { d: `M ${xx},${yy} q 2,5 0,10`, fill: 'none', stroke: '#c8a080', 'stroke-width': 1, opacity: 0.6 }, G); }
    [-1, 1].forEach((sg) => { el('path', { d: `M ${sg * 6},-50 C ${sg * 10},-80 ${sg * 26},-92 ${sg * 32},-84 C ${sg * 32},-70 ${sg * 24},-56 ${sg * 16},-46 Z`, fill: '#7a5440', stroke: '#3a2618', 'stroke-width': 1.5 }, G); el('path', { d: `M ${sg * 12},-54 C ${sg * 16},-74 ${sg * 24},-80 ${sg * 26},-76`, fill: 'none', stroke: '#c8908a', 'stroke-width': 3 }, G); });
    el('ellipse', { cx: 0, cy: -40, rx: 18, ry: 17, fill: '#8a6248', stroke: '#3a2618', 'stroke-width': 1.5 }, G);
    [-1, 1].forEach((sg) => el('circle', { cx: sg * 7, cy: -43, r: 2.8, fill: '#100806' }, G));
    el('ellipse', { cx: 0, cy: -32, rx: 5, ry: 3.5, fill: '#4a2e20' }, G);
    G.pts = { wing: [-170, 10], fur: [0, 10], ear: [-28, -84], finger: [-200, -40] };
    return G;
  };
  // 海馬（魚類，側面，頭朝右）：管狀的吻、身體有一節節的骨板、尾巴可以捲起來。約 160 × 300
  D.seahorse = (p, x, y, s = 1) => {
    const G = D.put(p, x, y, s);
    const C1 = '#e8a83a', C2 = '#8a5a1a';
    const P = [[6, -118], [-10, -96], [-22, -66], [-26, -34], [-20, -2], [-4, 28], [10, 54], [12, 82], [0, 104], [-20, 114], [-36, 104], [-36, 86], [-22, 80], [-14, 90]];
    const body = D.ribbon(P, (t) => (t < 0.08 ? 16 : t < 0.45 ? 16 + 12 * Math.sin(((t - 0.08) / 0.37) * Math.PI * 0.9) : 18 * Math.pow(Math.max(0, 1 - (t - 0.45) / 0.55), 0.9) + 2));
    el('path', { d: 'M -32,-30 C -60,-40 -66,-10 -40,6 Z', fill: 'rgba(240,200,120,0.6)', stroke: '#f8e0a8', 'stroke-width': 1.5 }, G);
    el('path', { d: body, fill: D.lg(G, [[0, '#c8862a'], [0.5, C1], [1, '#f0c870']], 0, 0, 1, 0), stroke: C2, 'stroke-width': 2 }, G);
    const st = g(G, { 'clip-path': D.clip(G, body) });
    const tmp = el('path', { d: D.curve(P), fill: 'none' }, st), L = tmp.getTotalLength();
    for (let d0 = 20; d0 < L - 10; d0 += 11) { const a = tmp.getPointAtLength(d0), b2 = tmp.getPointAtLength(d0 + 1), nx = -(b2.y - a.y), ny = b2.x - a.x, m = Math.hypot(nx, ny) || 1; el('line', { x1: a.x - (nx / m) * 34, y1: a.y - (ny / m) * 34, x2: a.x + (nx / m) * 34, y2: a.y + (ny / m) * 34, stroke: C2, 'stroke-width': 1.5, opacity: 0.7 }, st); }
    tmp.remove();
    el('path', { d: 'M -8,-130 C -12,-150 10,-160 24,-150 C 40,-144 62,-132 84,-128 C 90,-126 90,-118 84,-116 C 62,-114 40,-110 26,-102 C 10,-94 -4,-110 -8,-130 Z', fill: C1, stroke: C2, 'stroke-width': 2 }, G);
    el('path', { d: 'M 0,-150 L 4,-166 L 10,-152 L 16,-164 L 18,-148 Z', fill: C1, stroke: C2, 'stroke-width': 1.5 }, G);
    el('path', { d: 'M 6,-112 C 2,-104 -2,-98 -8,-94', fill: 'none', stroke: C2, 'stroke-width': 2 }, G);
    el('path', { d: 'M 2,-108 C 14,-104 20,-96 16,-86 C 10,-90 4,-96 2,-108 Z', fill: 'rgba(240,200,120,0.7)', stroke: '#f8e0a8', 'stroke-width': 1.2 }, G);
    eye(G, 14, -134, 6, { ring: '#f4e0b0' });
    G.pts = { snout: [84, -122], fin: [-50, -14], tail: [-30, 104], body: [-20, -20] };
    return G;
  };
})();
