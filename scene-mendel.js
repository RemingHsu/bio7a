/* 七下 2-1 孟德爾的遺傳法則：性狀與特徵、為什麼用豌豆、高莖 × 矮莖的實驗、遺傳因子、棋盤方格法、基因與等位基因 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const DOM = '#ffd166', REC = '#8fd3ff'; // 顯性、隱性遺傳因子的顏色
  const STEM = '#7cc45a', LEAF = '#5fae4f', LEAF_D = '#2f7a3a', LEAF_L = '#a8e39a';
  const SOIL = '#6b4a2c';

  // 葉片（基部在原點，沿 +x 長出）：長 L、寬 W
  const leafletD = (L, W) => `M0,0 C${L * 0.25},${-W} ${L * 0.72},${-W} ${L},0 C${L * 0.72},${W} ${L * 0.25},${W} 0,0Z`;
  const pol = (x, y, a, r) => [x + Math.cos((a * Math.PI) / 180) * r, y + Math.sin((a * Math.PI) / 180) * r];
  const leaflet = (p, x, y, ang, L, W, fill = LEAF) => {
    const lg = g(p, { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})` });
    el('path', { d: leafletD(L, W), fill, stroke: LEAF_D, 'stroke-width': Math.max(1, L / 22) }, lg);
    el('line', { x1: 2, y1: 0, x2: L * 0.82, y2: 0, stroke: LEAF_L, 'stroke-width': Math.max(0.8, L / 30), opacity: 0.8 }, lg);
    return lg;
  };
  // 捲鬚：細細的螺旋
  const tendril = (p, x, y, ang, len, k) => {
    const [x1, y1] = pol(x, y, ang, len * 0.6);
    const [x2, y2] = pol(x1, y1, ang - 40, len * 0.25);
    const r = 4.5 * k;
    el('path', { d: `M${x.toFixed(1)},${y.toFixed(1)} Q${pol(x, y, ang - 12, len * 0.4).map((v) => v.toFixed(1)).join(',')} ${x1.toFixed(1)},${y1.toFixed(1)} T${x2.toFixed(1)},${y2.toFixed(1)} a${r},${r} 0 1,1 ${(-r * 1.2).toFixed(1)},${(r * 0.6).toFixed(1)} a${r * 0.6},${r * 0.6} 0 1,1 ${(r * 0.7).toFixed(1)},${(-r * 0.3).toFixed(1)}`, fill: 'none', stroke: LEAF_L, 'stroke-width': Math.max(1, 1.6 * k), 'stroke-linecap': 'round' }, p);
  };
  // 豌豆的羽狀複葉：葉柄從節斜向上長出，兩對小葉，末端是捲鬚；節上有一對托葉
  function compoundLeaf(p, x, y, side, k) {
    const a0 = side > 0 ? -38 : -142; // 斜向上
    // 托葉（豌豆的托葉很大，包住莖）
    leaflet(p, x, y + 2, side > 0 ? -60 : -120, 18 * k, 7 * k, '#6cbc5a');
    leaflet(p, x, y + 2, side > 0 ? -125 : -55, 15 * k, 6 * k, '#6cbc5a');
    const L = 54 * k;
    const [ex, ey] = pol(x, y, a0, L);
    el('line', { x1: x, y1: y, x2: ex, y2: ey, stroke: STEM, 'stroke-width': Math.max(1.2, 2.2 * k), 'stroke-linecap': 'round' }, p);
    [0.38, 0.74].forEach((f) => {
      const [lx, ly] = pol(x, y, a0, L * f);
      const up = side > 0 ? a0 - 48 : a0 + 48, out = side > 0 ? a0 + 34 : a0 - 34;
      leaflet(p, lx, ly, up, 24 * k, 9 * k);
      leaflet(p, lx, ly, out, 24 * k, 9 * k);
    });
    tendril(p, ex, ey, a0 - 10 * side, 22 * k, k);
    tendril(p, ex, ey, a0 + 18 * side, 18 * k, k);
  }
  // 小的豌豆花（側面）：旗瓣在後、翼瓣與龍骨瓣在前
  function peaFlower(p, x, y, k, side, color = '#f6f2ff') {
    const fg = g(p, { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${side > 0 ? k : -k},${k})` });
    el('path', { d: 'M -4,2 C -2,-6 6,-8 12,-6 L 16,-10 L 15,-4 L 19,-2 L 13,1 C 8,5 0,6 -4,2 Z', fill: '#6cbc5a', stroke: LEAF_D, 'stroke-width': 0.8 }, fg); // 花萼
    el('path', { d: 'M 10,-4 C 2,-14 0,-30 10,-36 C 20,-40 28,-30 24,-18 C 22,-10 18,-6 12,-4 Z', fill: color, stroke: '#c9c2e6', 'stroke-width': 1 }, fg); // 旗瓣
    el('path', { d: 'M 12,-4 C 18,-16 34,-16 38,-8 C 40,-2 30,4 13,1 Z', fill: color, stroke: '#c9c2e6', 'stroke-width': 1 }, fg); // 翼瓣
    el('path', { d: 'M 13,1 C 22,6 34,6 40,-4 C 36,-2 26,-2 14,-2 Z', fill: '#e6e0f8', stroke: '#c9c2e6', 'stroke-width': 0.8 }, fg); // 龍骨瓣
    return fg;
  }
  // 豆莢：從節上垂下
  function peaPod(p, x, y, k, side) {
    const pg = g(p, { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${side > 0 ? 70 : 110}) scale(${k})` });
    el('path', { d: 'M 0,0 L 8,0', stroke: STEM, 'stroke-width': 2 }, pg);
    el('path', { d: 'M 8,0 C 14,-8 40,-9 50,-4 C 54,-2 54,3 50,5 C 40,9 14,8 8,0 Z', fill: '#79c35c', stroke: LEAF_D, 'stroke-width': 1.2 }, pg);
    [18, 28, 38].forEach((cx) => el('ellipse', { cx, cy: 0, rx: 4.6, ry: 4, fill: '#9ad77c', opacity: 0.8 }, pg));
    return pg;
  }
  // 豌豆植株：(x, y0) 是莖的基部；矮莖是節間很短（不是葉子比較小）
  function peaPlant(p, x, y0, { h = 300, k = 1, dwarf = false, flowers = 2, pods = 1, stake = false } = {}) {
    const pg = g(p);
    const n = Math.max(4, Math.round(h / ((dwarf ? 22 : 46) * Math.max(0.7, k))));
    const step = h / n;
    const pts = [[x, y0]];
    for (let i = 1; i <= n; i++) pts.push([x + (i % 2 ? 2.5 : -2.5) * k, y0 - i * step]);
    if (stake) el('line', { x1: x + 12 * k, y1: y0 + 6, x2: x + 12 * k, y2: y0 - h - 14 * k, stroke: '#b58a52', 'stroke-width': Math.max(2, 4 * k), 'stroke-linecap': 'round' }, pg);
    el('path', { d: 'M' + pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L'), fill: 'none', stroke: STEM, 'stroke-width': Math.max(2, 4.5 * k), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, pg);
    for (let i = 1; i < n; i++) {
      const [nx, ny] = pts[i], side = i % 2 ? 1 : -1;
      compoundLeaf(pg, nx, ny, side, k);
      const fromTop = n - i;
      if (fromTop <= flowers && fromTop >= 1) {
        const [fx, fy] = pol(nx, ny, side > 0 ? -150 : -30, 20 * k);
        el('line', { x1: nx, y1: ny, x2: fx, y2: fy, stroke: STEM, 'stroke-width': Math.max(1, 1.6 * k) }, pg);
        peaFlower(pg, fx, fy, 0.9 * k, -side);
      } else if (pods && i >= Math.floor(n * 0.35) && i < Math.floor(n * 0.35) + pods) peaPod(pg, nx, ny + 2, k, -side);
    }
    // 頂芽：兩片張成 V 字的幼葉
    const [tx, ty] = pts[n];
    leaflet(pg, tx, ty, -62, 14 * k, 5 * k, '#7fcf68');
    leaflet(pg, tx, ty, -118, 14 * k, 5 * k, '#7fcf68');
    el('ellipse', { cx: tx, cy: ty - 3 * k, rx: 3 * k, ry: 5 * k, fill: '#9ae07f' }, pg);
    return pg;
  }
  const soil = (p, x1, x2, y) => { el('rect', { x: x1, y, width: x2 - x1, height: 14, rx: 7, fill: SOIL }, p); };

  // 種子：圓形或皺縮、黃色或綠色
  const SEEDC = { y: ['#ecd25e', '#a8892c', '#fff3b0'], g: ['#93c95a', '#557f2c', '#d4f0a8'] };
  function seed(p, x, y, r, { shape = 'round', color = 'y' } = {}) {
    const sg = S.place(g(p), { x, y });
    const [f, e, hl] = SEEDC[color];
    if (shape === 'round') {
      el('circle', { cx: 0, cy: 0, r, fill: f, stroke: e, 'stroke-width': Math.max(1.5, r / 14) }, sg);
      el('ellipse', { cx: -r * 0.32, cy: -r * 0.34, rx: r * 0.3, ry: r * 0.2, fill: hl, opacity: 0.55, transform: `rotate(-35 ${-r * 0.32} ${-r * 0.34})` }, sg);
      el('ellipse', { cx: r * 0.55, cy: r * 0.1, rx: r * 0.1, ry: r * 0.2, fill: e, opacity: 0.5 }, sg); // 種臍
    } else {
      // 皺縮的種子：大致還是圓的，表面有凹下去的皺褶
      const pts = S.blobPts(0, 0, r * 0.95, r * 0.9, 48, [[4, 0.05, 0.5], [7, 0.035, 1.7], [2, 0.03, 0.2]]);
      el('path', { d: S.smoothPath(pts), fill: f, stroke: e, 'stroke-width': Math.max(1.5, r / 14) }, sg);
      const Q = (a, b, c, d, e2, f2) => `M${a * r},${b * r} Q${c * r},${d * r} ${e2 * r},${f2 * r}`;
      const creases = [Q(-0.78, -0.12, -0.3, -0.02, 0.02, -0.38), Q(0.02, -0.38, 0.32, -0.2, 0.7, -0.3), Q(0.02, -0.38, 0.14, 0.02, -0.04, 0.36),
        Q(-0.04, 0.36, 0.3, 0.42, 0.62, 0.26), Q(-0.04, 0.36, -0.34, 0.46, -0.6, 0.4), Q(0.02, -0.38, -0.1, -0.62, -0.3, -0.78)];
      creases.forEach((d) => el('path', { d, fill: 'none', stroke: e, 'stroke-width': r / 5, 'stroke-linecap': 'round', opacity: 0.18 }, sg));
      creases.forEach((d) => el('path', { d, fill: 'none', stroke: e, 'stroke-width': Math.max(1.2, r / 16), 'stroke-linecap': 'round', opacity: 0.85 }, sg));
      el('ellipse', { cx: -r * 0.36, cy: -r * 0.42, rx: r * 0.16, ry: r * 0.1, fill: hl, opacity: 0.5, transform: `rotate(-30 ${-r * 0.36} ${-r * 0.42})` }, sg);
      el('ellipse', { cx: r * 0.36, cy: r * 0.02, rx: r * 0.14, ry: r * 0.09, fill: hl, opacity: 0.35 }, sg);
    }
    return sg;
  }

  // 遺傳因子組合：大寫（顯性）黃色、小寫（隱性）藍色
  function geno(p, x, y, str, size = 30, attrs = {}) {
    const t = el('text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', ...attrs }, p);
    for (const ch of str) {
      const s = el('tspan', { fill: ch === ch.toUpperCase() ? DOM : REC }, t);
      s.textContent = ch;
    }
    return t;
  }
  // 配子（小圓，帶一個遺傳因子）
  const gamete = (p, x, y, ch, r = 26) => {
    const gg = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill: '#1a2c3a', stroke: ch === ch.toUpperCase() ? DOM : REC, 'stroke-width': 3 }, gg);
    geno(gg, 0, r * 0.36, ch, r * 1.05);
    return gg;
  };
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, w = 4) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p), hl = 8 + w * 2;
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hl * 0.6, y2: y2 - Math.sin(a) * hl * 0.6, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M${x2},${y2} L${x2 - hl * Math.cos(a - 0.42)},${y2 - hl * Math.sin(a - 0.42)} L${x2 - hl * Math.cos(a + 0.42)},${y2 - hl * Math.sin(a + 0.42)}Z`, fill: color }, ag);
    return ag;
  };

  // 豌豆花的剖面（側面，花朝右）：旗瓣在後，龍骨瓣剖開，看得到裡面的雄蕊和雌蕊
  const ANTH = [[156, -44], [151, -48], [160, -50], [146, -42], [167, -47], [143, -37]];
  function flowerCut(p, x, y, s, { anthers = true, pedicel = true } = {}) {
    const f = S.place(g(p), { x, y, s });
    const sw = (w) => w / Math.max(0.6, s / 1.6);
    if (pedicel) el('path', { d: 'M -70,70 C -46,44 -24,18 -6,4', fill: 'none', stroke: STEM, 'stroke-width': 5, 'stroke-linecap': 'round' }, f);
    el('path', { d: 'M 26,-14 C 4,-42 -6,-94 18,-118 C 40,-138 80,-128 88,-98 C 94,-66 72,-34 40,-16 Z', fill: '#f6f2ff', stroke: '#c9c2e6', 'stroke-width': sw(2) }, f); // 旗瓣
    [[6, -90], [28, -118], [58, -120], [80, -84]].forEach(([ex, ey]) => el('path', { d: `M 32,-20 Q ${(32 + ex) / 2 + 6},${(-20 + ey) / 2} ${ex},${ey}`, fill: 'none', stroke: '#ddd5f2', 'stroke-width': sw(1.4) }, f));
    el('path', { d: 'M 34,-16 C 60,-52 122,-54 142,-32 C 152,-18 126,-2 40,-4 Z', fill: '#d9d1f0', stroke: '#bfb6e0', 'stroke-width': sw(1.6) }, f); // 翼瓣（另一側）
    el('path', { d: 'M 36,-4 C 70,22 132,22 162,0 C 174,-10 178,-26 172,-40 C 162,-30 148,-22 130,-18 C 100,-14 64,-15 36,-12 Z', fill: '#efeafc', stroke: '#c9c2e6', 'stroke-width': sw(2) }, f); // 龍骨瓣（剖開：看到的是後半邊）
    el('path', { d: 'M 44,-13 C 80,-17 128,-20 150,-27 L 153,-17 C 130,-9 80,-4 44,-5 Z', fill: '#f3e6b0', stroke: '#d9c98a', 'stroke-width': sw(1) }, f); // 花絲（大多連在一起）
    el('path', { d: 'M 52,-9 C 80,-14 126,-16 146,-18 C 153,-18 153,-11 146,-10 C 126,-8 80,-5 52,-9 Z', fill: '#79c35c', stroke: LEAF_D, 'stroke-width': sw(1.4) }, f); // 子房
    el('path', { d: 'M 148,-14 C 158,-17 163,-26 164,-38', fill: 'none', stroke: '#79c35c', 'stroke-width': sw(3.2), 'stroke-linecap': 'round' }, f); // 花柱
    el('circle', { cx: 164, cy: -41, r: 4.2, fill: '#b9e68f', stroke: LEAF_D, 'stroke-width': sw(1.1) }, f); // 柱頭
    if (anthers) ANTH.forEach(([ax, ay]) => {
      el('line', { x1: 150, y1: -22, x2: ax, y2: ay, stroke: '#f3e6b0', 'stroke-width': 1.3 }, f);
      el('ellipse', { cx: ax, cy: ay, rx: 3.6, ry: 2.4, fill: '#f2c94c', stroke: '#b8902a', 'stroke-width': 0.8, transform: `rotate(-60 ${ax} ${ay})` }, f);
    });
    el('path', { d: 'M -6,4 C -6,-10 8,-18 30,-16 L 38,-28 L 37,-13 L 50,-14 L 39,-5 L 48,4 L 33,3 C 18,12 0,14 -6,4 Z', fill: '#6cbc5a', stroke: LEAF_D, 'stroke-width': sw(1.5) }, f); // 花萼
    return f;
  }

  S.register({
    id: 'mendel', section: '下2-1', title: '孟德爾的遺傳法則',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 性狀與特徵 =====
      const P0 = g(root);
      text(P0, 600, 62, '豌豆的性狀與特徵', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700 });
      const CW = 360, CX = [50, 420, 790];
      const cards = [['莖的高矮', '高莖', '矮莖'], ['種子的形狀', '圓形', '皺縮'], ['種子的顏色', '黃色', '綠色']].map(([trait, a, b], i) => {
        const c = g(P0, { opacity: 0 });
        const cx = CX[i] + CW / 2;
        el('rect', { x: CX[i], y: 96, width: CW, height: 456, rx: 18, ...FRAME }, c);
        text(c, cx, 136, '性狀', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        text(c, cx, 174, trait, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(c, cx, 500, '特徵', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        text(c, cx - 85, 536, a, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        text(c, cx + 85, 536, b, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        el('line', { x1: cx, y1: 210, x2: cx, y2: 470, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, c);
        return c;
      });
      soil(cards[0], CX[0] + 30, CX[0] + CW - 30, 462);
      peaPlant(cards[0], CX[0] + 95, 462, { h: 240, k: 0.72, stake: true, flowers: 2, pods: 1 });
      peaPlant(cards[0], CX[0] + 265, 462, { h: 64, k: 0.72, dwarf: true, flowers: 1, pods: 0 });
      seed(cards[1], CX[1] + 95, 330, 54, { shape: 'round', color: 'g' });
      seed(cards[1], CX[1] + 265, 330, 54, { shape: 'wrinkled', color: 'g' });
      seed(cards[2], CX[2] + 95, 330, 54, { shape: 'round', color: 'y' });
      seed(cards[2], CX[2] + 265, 330, 54, { shape: 'round', color: 'g' });
      const def0 = g(P0, { opacity: 0 });
      S.pill(def0, 330, 600, '性狀：生物的構造或生理特性', { size: 24, color: C.hi, edge: C.hi });
      S.pill(def0, 870, 600, '特徵：同一性狀的不同表現', { size: 24, color: C.ink, edge: '#4a6272' });
      const def0b = g(P0, { opacity: 0 });
      S.pill(def0b, 600, 666, '遺傳：親代經由生殖，把性狀的特徵傳給子代', { size: 26, color: C.membrane, edge: C.membrane });
      tl.addLabel('s0');
      cards.forEach((c, i) => S.show(tl, c, `s0+=${0.2 + i * 0.7}`, 0.5));
      S.show(tl, def0, 's0+=2.4', 0.5);
      S.show(tl, def0b, 's0+=3.3', 0.5);

      // ===== 1 為什麼用豌豆：自花授粉、能控制授粉 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 70, width: 560, height: 610, rx: 18, ...FRAME }, P1);
      text(P1, 310, 112, '豌豆花（剖開龍骨瓣，示意）', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      // 大的豌豆花：原點在花萼，花朝右
      const FX0 = 190, FY0 = 450, FS = 2;
      const FL = flowerCut(P1, FX0, FY0, FS, { anthers: true, pedicel: true });
      const pollen = [0, 1, 2, 3, 4].map(() => el('circle', { cx: 0, cy: 0, r: 2.6, fill: '#ffe08a', opacity: 0 }, FL));
      const fp = (x, y) => [FX0 + x * FS, FY0 + y * FS];
      const lab1 = [
        [...fp(36, -96), 100, 190, '花瓣', '#d8d0f0'],
        [...fp(158, -48), 500, 236, '雄蕊', '#f2c94c'],
        [...fp(100, -12), 380, 560, '雌蕊', '#9ad77c'],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P1, tx, ty, x, y, s, c, { size: 24 }));
      const self1 = g(P1, { opacity: 0 });
      text(self1, 310, 620, '花瓣包住雄蕊和雌蕊：', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      text(self1, 310, 656, '花粉落在同一朵花的雌蕊上（自花授粉）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      // 右：豌豆的優點
      const why = g(P1, { opacity: 0 });
      text(why, 880, 112, '豌豆適合做遺傳實驗', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const pros = ['生長期短', '容易大量栽種', '特徵明顯，容易觀察', '能控制授粉的過程'].map((s, i) => {
        const r = g(why, { opacity: 0 });
        S.pill(r, 880, 166 + i * 56, s, { size: 26, color: i === 3 ? C.hi : C.ink, edge: i === 3 ? C.hi : '#4a6272' });
        return r;
      });
      // 人工授粉
      const art = g(P1, { opacity: 0 });
      el('rect', { x: 620, y: 400, width: 550, height: 280, rx: 18, ...FRAME }, art);
      text(art, 895, 440, '人工授粉：自己決定和哪一株授粉', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      // ① 摘除雄蕊（鑷子夾出花藥）
      flowerCut(art, 670, 612, 0.8, { anthers: false, pedicel: false });
      const twz = g(art);
      el('path', { d: 'M 868,478 L 812,566 M 882,482 L 818,570', stroke: '#c9d2d8', 'stroke-width': 4, 'stroke-linecap': 'round' }, twz);
      [[808, 570], [816, 574], [820, 566]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 4, ry: 2.6, fill: '#f2c94c', stroke: '#b8902a', 'stroke-width': 0.8 }, twz));
      text(art, 740, 662, '① 先摘除雄蕊', { 'font-size': 24, 'text-anchor': 'middle' });
      // ② 塗上別株的花粉（毛筆）
      flowerCut(art, 940, 612, 0.8, { anthers: false, pedicel: false });
      const brush = g(art);
      el('line', { x1: 1130, y1: 480, x2: 1090, y2: 560, stroke: '#b58a52', 'stroke-width': 6, 'stroke-linecap': 'round' }, brush);
      el('path', { d: 'M 1090,560 C 1082,566 1078,574 1078,580 C 1086,578 1094,570 1096,563 Z', fill: '#e8d6a8' }, brush);
      [[1076, 580], [1080, 576], [1073, 576]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 2.6, fill: '#ffe08a' }, brush));
      text(art, 1040, 662, '② 塗上另一株的花粉', { 'font-size': 24, 'text-anchor': 'middle' });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      lab1.forEach((l, i) => S.show(tl, l, `s1+=${0.8 + i * 0.4}`, 0.35));
      S.drive(tl, (u) => {
        pollen.forEach((d, i) => {
          const k = S.clamp(u * 1.6 - i * 0.15), [sx, sy] = ANTH[i];
          d.setAttribute('cx', S.lerp(sx, 164, k)); d.setAttribute('cy', S.lerp(sy, -41, k) - Math.sin(k * Math.PI) * 5);
          d.style.opacity = k > 0 && k < 1 ? 1 : 0;
        });
      }, 2.2, 's1+=2', 'none');
      S.show(tl, self1, 's1+=2.4', 0.5);
      S.show(tl, why, 's1+=3.2', 0.3);
      pros.forEach((r, i) => S.show(tl, r, `s1+=${3.3 + i * 0.35}`, 0.35));
      S.show(tl, art, 's1+=5', 0.5);

      // ===== 2 高莖 × 矮莖 =====
      const P2 = g(root, { opacity: 0 });
      const colT = [['親代', 215], ['第一子代', 575], ['第二子代', 960]];
      colT.forEach(([s, x]) => text(P2, x, 62, s, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 }));
      const G2 = 500;
      const par = g(P2);
      soil(par, 50, 380, G2);
      peaPlant(par, 120, G2, { h: 330, k: 0.85, stake: true, flowers: 2, pods: 2 });
      peaPlant(par, 315, G2, { h: 80, k: 0.85, dwarf: true, flowers: 1, pods: 0 });
      text(par, 215, 452, '×', { 'font-size': 44, 'text-anchor': 'middle', fill: C.ink2 });
      text(par, 120, 550, '純品系高莖', { 'font-size': 24, 'text-anchor': 'middle' });
      text(par, 315, 550, '純品系矮莖', { 'font-size': 24, 'text-anchor': 'middle' });
      S.pill(par, 215, 606, '人工授粉', { size: 22, color: C.mute });
      const f1 = g(P2, { opacity: 0 });
      soil(f1, 440, 710, G2);
      [490, 575, 660].forEach((x) => peaPlant(f1, x, G2, { h: 300, k: 0.68, stake: false, flowers: 2, pods: 1 }));
      text(f1, 575, 550, '全部是高莖', { 'font-size': 26, 'text-anchor': 'middle', fill: DOM, 'font-weight': 700 });
      S.pill(f1, 575, 606, '自花授粉', { size: 22, color: C.mute });
      const a21 = arrow(P2, 390, 330, 432, 330); a21.style.opacity = 0;
      const a22 = arrow(P2, 718, 330, 760, 330); a22.style.opacity = 0;
      const f2 = g(P2, { opacity: 0 });
      soil(f2, 770, 1170, G2);
      [810, 885, 960].forEach((x) => peaPlant(f2, x, G2, { h: 300, k: 0.62, flowers: 2, pods: 1 }));
      peaPlant(f2, 1090, G2, { h: 70, k: 0.62, dwarf: true, flowers: 1, pods: 0 });
      const cnt = g(P2, { opacity: 0 });
      text(cnt, 885, 550, '高莖 787 株', { 'font-size': 26, 'text-anchor': 'middle', fill: DOM, 'font-weight': 700 });
      text(cnt, 1090, 550, '矮莖 277 株', { 'font-size': 26, 'text-anchor': 'middle', fill: REC, 'font-weight': 700 });
      S.pill(cnt, 975, 606, '高莖：矮莖 ≈ 3：1', { size: 26, color: C.hi, edge: C.hi });
      const dr = g(P2, { opacity: 0 });
      S.pill(dr, 330, 672, '顯性特徵：第一子代表現出來的（高莖）', { size: 24, color: DOM, edge: DOM });
      S.pill(dr, 880, 672, '隱性特徵：第一子代沒有表現的（矮莖）', { size: 24, color: REC, edge: REC });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, a21, 's2+=1.2', 0.3);
      S.show(tl, f1, 's2+=1.5', 0.6);
      S.show(tl, a22, 's2+=2.6', 0.3);
      S.show(tl, f2, 's2+=2.9', 0.6);
      S.show(tl, cnt, 's2+=3.6', 0.5);
      S.show(tl, dr, 's2+=4.6', 0.5);

      // ===== 3 遺傳因子：成對、分離、再配對 =====
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 40, width: 560, height: 650, rx: 18, ...FRAME }, P3);
      const G3 = 220, XA = 200, XB = 460;
      soil(P3, 130, 540, G3);
      peaPlant(P3, XA, G3, { h: 140, k: 0.5, flowers: 2, pods: 1 });
      peaPlant(P3, XB, G3, { h: 40, k: 0.5, dwarf: true, flowers: 1, pods: 0 });
      text(P3, 330, 186, '×', { 'font-size': 40, 'text-anchor': 'middle', fill: C.ink2 });
      text(P3, 52, 140, '親代', { 'font-size': 24, fill: C.mute });
      geno(P3, XA, 264, 'TT', 36); text(P3, XA + 64, 262, '高莖', { 'font-size': 22, fill: C.ink2 });
      geno(P3, XB, 264, 'tt', 36); text(P3, XB + 50, 262, '矮莖', { 'font-size': 22, fill: C.ink2 });
      text(P3, 52, 352, '配子', { 'font-size': 24, fill: C.mute });
      const gm0 = [['T', XA], ['t', XB]].map(([ch, x]) => gamete(P3, x, 344, ch, 28));
      const gm = [['T', XA], ['t', XB]].map(([ch, x]) => gamete(P3, x, 344, ch, 28));
      const ar3 = g(P3, { opacity: 0 });
      arrow(ar3, XA, 280, XA, 308, C.ink2, 3); arrow(ar3, XB, 280, XB, 308, C.ink2, 3);
      const fert = g(P3, { opacity: 0 });
      el('rect', { x: 330 - 74, y: 430 - 40, width: 148, height: 80, rx: 40, fill: 'none', stroke: C.membrane, 'stroke-width': 3 }, fert);
      text(fert, 52, 438, '受精', { 'font-size': 24, fill: C.mute });
      const f1z = g(P3, { opacity: 0 });
      arrow(f1z, 330, 474, 330, 504, C.ink2, 3);
      text(f1z, 52, 600, '第一子代', { 'font-size': 24, fill: C.mute });
      soil(f1z, 250, 410, 650);
      peaPlant(f1z, 330, 650, { h: 120, k: 0.48, flowers: 2, pods: 1 });
      geno(f1z, 450, 600, 'Tt', 36);
      text(f1z, 450, 636, '高莖', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const rules = [
        ['遺傳因子是成對的', C.ink, 160],
        ['顯性用大寫 T，隱性用小寫 t', C.ink, 230],
        ['形成配子時，成對的遺傳因子分開，', C.ink, 300],
        ['　每個配子只帶一個', C.ink, 340],
        ['受精時，兩個配子結合，又成對', C.ink, 410],
        ['有 T 就表現高莖（TT、Tt）', DOM, 500],
        ['只有 tt 才表現矮莖', REC, 560],
      ].map(([s, c, y], i) => text(P3, 630, y, s, { 'font-size': 26, fill: c, 'font-weight': i >= 5 ? 700 : 400, opacity: 0 }));
      text(P3, 630, 96, '孟德爾的推論', { 'font-size': 28, 'font-weight': 700, fill: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, rules[0], 's3+=0.8', 0.4);
      S.show(tl, rules[1], 's3+=1.4', 0.4);
      S.show(tl, ar3, 's3+=2', 0.3);
      S.show(tl, [...gm0, ...gm], 's3+=2.2', 0.4);
      S.show(tl, [rules[2], rules[3]], 's3+=2.3', 0.4);
      S.move(tl, gm[0], { x: XA, y: 344 }, { x: 302, y: 430 }, 0.9, 's3+=3.4');
      S.move(tl, gm[1], { x: XB, y: 344 }, { x: 358, y: 430 }, 0.9, 's3+=3.4');
      S.show(tl, fert, 's3+=4.2', 0.3);
      S.show(tl, rules[4], 's3+=3.6', 0.4);
      S.show(tl, f1z, 's3+=4.6', 0.5);
      S.show(tl, rules[5], 's3+=5.3', 0.4);
      S.show(tl, rules[6], 's3+=5.8', 0.4);

      // ===== 4 棋盤方格法：Tt × Tt =====
      const P4 = g(root, { opacity: 0 });
      const GX = 400, GY4 = 210, CS = 170;
      text(P4, GX + CS, 64, '高莖 Tt 的精細胞（在花粉中）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(P4, 190, GY4 + CS - 18, '高莖 Tt 的', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(P4, 190, GY4 + CS + 16, '卵細胞', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const topG = ['T', 't'].map((ch, j) => gamete(P4, GX + CS / 2 + j * CS, 140, ch, 30));
      const leftG = ['T', 't'].map((ch, i) => gamete(P4, GX - 54, GY4 + CS / 2 + i * CS, ch, 30));
      for (let i = 0; i <= 2; i++) {
        el('line', { x1: GX, y1: GY4 + i * CS, x2: GX + 2 * CS, y2: GY4 + i * CS, stroke: '#4a6272', 'stroke-width': 3 }, P4);
        el('line', { x1: GX + i * CS, y1: GY4, x2: GX + i * CS, y2: GY4 + 2 * CS, stroke: '#4a6272', 'stroke-width': 3 }, P4);
      }
      const cells = [];
      [['T', 'T'], ['T', 't']].forEach(([a], i) => ['T', 't'].forEach((b, j) => {
        const egg = i ? 't' : 'T', sp = b;
        const gt = [egg, sp].sort((x, y) => (x === x.toUpperCase() ? -1 : 1) - (y === y.toUpperCase() ? -1 : 1)).join('');
        const c = g(P4, { opacity: 0 });
        const cx = GX + CS / 2 + j * CS, cy = GY4 + i * CS;
        geno(c, cx - 34, cy + 66, gt, 38);
        const tall = gt.includes('T');
        if (tall) peaPlant(c, cx + 40, cy + 150, { h: 110, k: 0.38, flowers: 1, pods: 0 });
        else peaPlant(c, cx + 40, cy + 150, { h: 30, k: 0.38, dwarf: true, flowers: 1, pods: 0 });
        el('line', { x1: cx + 8, y1: cy + 151, x2: cx + 72, y2: cy + 151, stroke: SOIL, 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
        text(c, cx - 34, cy + 110, tall ? '高莖' : '矮莖', { 'font-size': 24, 'text-anchor': 'middle', fill: tall ? DOM : REC, 'font-weight': 700 });
        cells.push(c);
      }));
      const hint4 = g(P4, { opacity: 0 });
      text(hint4, GX + CS, GY4 + 2 * CS + 56, '每一格出現的機會都一樣（各 1/4）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const res4 = g(P4, { opacity: 0 });
      el('rect', { x: 800, y: 210, width: 370, height: 340, rx: 18, ...FRAME }, res4);
      text(res4, 985, 256, '遺傳因子的組合', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const r4a = g(res4);
      geno(r4a, 890, 306, 'TT', 34); text(r4a, 935, 306, '：', { 'font-size': 30, 'text-anchor': 'middle' });
      geno(r4a, 980, 306, 'Tt', 34); text(r4a, 1025, 306, '：', { 'font-size': 30, 'text-anchor': 'middle' });
      geno(r4a, 1070, 306, 'tt', 34);
      text(r4a, 985, 352, '＝ 1：2：1', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const r4b = g(res4, { opacity: 0 });
      text(r4b, 985, 420, '表現出的特徵', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      text(r4b, 985, 470, '高莖：矮莖 ＝ 3：1', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(r4b, 985, 516, '（孟德爾：787：277）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, topG, 's4+=0.5', 0.4);
      S.show(tl, leftG, 's4+=1', 0.4);
      cells.forEach((c, i) => S.show(tl, c, `s4+=${1.8 + i * 0.6}`, 0.4));
      S.show(tl, hint4, 's4+=4.3', 0.4);
      S.show(tl, res4, 's4+=4.8', 0.5);
      S.show(tl, r4b, 's4+=5.6', 0.5);

      // ===== 5 基因、等位基因、基因型與表現型 =====
      const P5 = g(root, { opacity: 0 });
      text(P5, 270, 62, '成對的染色體（同源染色體）', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const chromo = (x, col, bands) => {
        const cg = g(P5);
        const top = 110, bot = 600, cen = 250, w = 54;
        el('path', { d: `M ${x - w / 2},${top + w / 2} A ${w / 2},${w / 2} 0 0,1 ${x + w / 2},${top + w / 2} L ${x + w / 2},${cen - 14} Q ${x + w / 2 - 9},${cen} ${x + w / 2},${cen + 14} L ${x + w / 2},${bot - w / 2} A ${w / 2},${w / 2} 0 0,1 ${x - w / 2},${bot - w / 2} L ${x - w / 2},${cen + 14} Q ${x - w / 2 + 9},${cen} ${x - w / 2},${cen - 14} Z`, fill: col, stroke: '#e8f0f2', 'stroke-width': 2, opacity: 0.95 }, cg);
        bands.forEach(([y, ch, hl]) => {
          el('rect', { x: x - w / 2 + 2, y: y - 17, width: w - 4, height: 34, fill: hl ? '#16293a' : 'rgba(13,24,34,0.55)' }, cg);
          geno(cg, x, y + 10, ch, 28);
        });
        return cg;
      };
      chromo(200, '#5f8fbf', [[180, 'A', 0], [380, 'T', 1], [520, 'B', 0]]);
      chromo(340, '#c77e9a', [[180, 'a', 0], [380, 't', 1], [520, 'B', 0]]);
      text(P5, 200, 640, '來自父方', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P5, 340, 640, '來自母方', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const al = g(P5, { opacity: 0 });
      el('rect', { x: 160, y: 356, width: 220, height: 48, rx: 10, fill: 'none', stroke: C.hi, 'stroke-width': 3.5 }, al);
      el('line', { x1: 380, y1: 380, x2: 420, y2: 380, stroke: C.hi, 'stroke-width': 3 }, al);
      text(al, 430, 372, '等位基因', { 'font-size': 28, fill: C.hi, 'font-weight': 700 });
      text(al, 430, 404, '相同位置，控制同一性狀', { 'font-size': 22, fill: C.ink2 });
      text(al, 430, 434, '（莖的高矮）', { 'font-size': 22, fill: C.ink2 });
      const gn = g(P5, { opacity: 0 });
      text(gn, 270, 690, '基因：控制性狀的基本單位，位在染色體上', { 'font-size': 24, 'text-anchor': 'middle', fill: C.membrane });
      // 右：基因型與表現型
      const tb = g(P5, { opacity: 0 });
      const TX = 700, TW = 450;
      el('rect', { x: TX, y: 90, width: TW, height: 420, rx: 18, ...FRAME }, tb);
      text(tb, TX + 120, 140, '基因型', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      text(tb, TX + 330, 140, '表現型', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      el('line', { x1: TX + 20, y1: 160, x2: TX + TW - 20, y2: 160, stroke: '#4a6272', 'stroke-width': 2 }, tb);
      [['TT', '高莖'], ['Tt', '高莖'], ['tt', '矮莖']].forEach(([gt, ph], i) => {
        const y = 236 + i * 100;
        geno(tb, TX + 120, y + 12, gt, 40);
        const tall = ph === '高莖';
        peaPlant(tb, TX + 250, y + 36, tall ? { h: 72, k: 0.32, flowers: 1, pods: 0 } : { h: 22, k: 0.32, dwarf: true, flowers: 1, pods: 0 });
        text(tb, TX + 360, y + 12, ph, { 'font-size': 28, fill: tall ? DOM : REC, 'font-weight': 700 });
        if (i < 2) el('line', { x1: TX + 20, y1: y + 50, x2: TX + TW - 20, y2: y + 50, stroke: '#2b4252', 'stroke-width': 1.5 }, tb);
      });
      const defs5 = g(P5, { opacity: 0 });
      text(defs5, TX, 572, '基因型：等位基因的組合（例如 Tt）', { 'font-size': 24, fill: C.ink });
      text(defs5, TX, 616, '表現型：表現出來的特徵（例如高莖）', { 'font-size': 24, fill: C.ink });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      S.show(tl, al, 's5+=1.3', 0.5);
      S.show(tl, gn, 's5+=2.2', 0.5);
      S.show(tl, tb, 's5+=3', 0.5);
      S.show(tl, defs5, 's5+=4', 0.5);

      return {
        tl,
        notes: [
          '＊示意：植株和種子都畫得比實際大。親代和子代之間、兄弟姊妹之間的差異稱為「變異」（見第六章有性生殖）。',
          '＊示意：豌豆花的構造簡化了；真正的豌豆花有 10 枚雄蕊。人工授粉要在花還沒成熟、雄蕊還沒散出花粉前，先摘除雄蕊。',
          '＊數字是孟德爾的實驗紀錄（1860 年代）：第二子代共 1064 株，787：277 約為 2.84：1。高度比例畫得比較小：他的高莖約 2 m，矮莖只有約 0.2～0.5 m。',
          '孟德爾當時還不知道基因和染色體，他用「遺傳因子」說明實驗結果。後人把他的推論稱為孟德爾遺傳法則。',
          '＊示意：上面填精細胞（來自花粉）、左邊填卵細胞，兩兩組合。比例是「機率」，子代數量越多，結果越接近 3：1。',
          '＊示意：染色體上的基因位置、A／B 等字母都是示意。有些課本寫成「遺傳因子」或「對偶基因」，和等位基因指的是同一件事。',
        ],
        steps: [
          '生物的構造或生理特性稱為<b>性狀</b>，同一性狀有不同的<b>特徵</b>，例如莖有<b>高莖</b>和<b>矮莖</b>。親代把性狀的特徵傳給子代，稱為<b>遺傳</b>。',
          '孟德爾用<b>豌豆</b>做實驗：生長期短、容易栽種、特徵明顯。豌豆花通常<b>自花授粉</b>，也可以<b>人工授粉</b>，自己決定親代。',
          '<b>純品系</b>高莖 × 矮莖 → 第一子代<b>全部高莖</b>；第一子代自花授粉 → 第二子代高莖：矮莖 ≈ <b>3：1</b>。高莖是<b>顯性</b>特徵，矮莖是<b>隱性</b>特徵。',
          '遺傳因子是<b>成對</b>的：形成配子時<b>分開</b>，每個配子只帶一個；受精時再<b>配成對</b>。TT × tt → 第一子代都是 <b>Tt</b>，表現高莖。',
          '<b>棋盤方格法</b>：Tt × Tt，把精細胞和卵細胞的遺傳因子兩兩組合 → TT：Tt：tt ＝ <b>1：2：1</b>，高莖：矮莖 ＝ <b>3：1</b>。',
          '<b>基因</b>位在染色體上。成對染色體<b>相同位置</b>、控制同一性狀的基因稱為<b>等位基因</b>。等位基因的組合是<b>基因型</b>，表現出來的特徵是<b>表現型</b>。',
        ],
      };
    },
  });
})();
