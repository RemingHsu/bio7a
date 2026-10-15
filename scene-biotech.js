/* 七下 2-4 生物技術：發酵、育種、基因轉殖（胰島素、螢光魚、基改作物）、複製動物（桃莉羊）、試管嬰兒、影響與爭議
   試管嬰兒的人物、精子、卵用 scene-humangen.js 的畫法（S.b2）。 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const GENE = '#ffb35c', GLOW = '#7dff8a';

  const arrow = (p, x1, y1, x2, y2, color = C.ink2, w = 4) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p), hl = 10 + w * 2;
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hl * 0.6, y2: y2 - Math.sin(a) * hl * 0.6, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M${x2},${y2} L${x2 - hl * Math.cos(a - 0.42)},${y2 - hl * Math.sin(a - 0.42)} L${x2 - hl * Math.cos(a + 0.42)},${y2 - hl * Math.sin(a + 0.42)}Z`, fill: color }, ag);
    return ag;
  };
  const leafD = (L, W) => `M0,0 C${L * 0.25},${-W} ${L * 0.72},${-W} ${L},0 C${L * 0.72},${W} ${L * 0.25},${W} 0,0Z`;
  const leaf = (p, x, y, ang, L, W, fill, stroke) => { const lg = g(p, { transform: `translate(${x},${y}) rotate(${ang})` }); el('path', { d: leafD(L, W), fill, stroke, 'stroke-width': 2 }, lg); el('line', { x1: 2, y1: 0, x2: L * 0.85, y2: 0, stroke: stroke, 'stroke-width': 1.6, opacity: 0.8 }, lg); return lg; };

  // ---------- 微生物 ----------
  const yeast = (p, x, y, s = 1) => { const yg = S.place(g(p), { x, y, s }); [[0, 0, 16, 12], [20, -10, 8, 6], [-14, 18, 13, 10], [16, 20, 12, 9]].forEach(([a, b, rx, ry]) => { el('ellipse', { cx: a, cy: b, rx, ry, fill: '#f0e2b6', stroke: '#b89a5a', 'stroke-width': 2 }, yg); }); return yg; };
  const lacto = (p, x, y, s = 1) => { const lg = S.place(g(p), { x, y, s }); [[-30, -6, 10], [-6, -2, -8], [18, 4, 12], [-18, 18, 30], [10, 22, 20]].forEach(([a, b, r]) => el('rect', { x: a - 11, y: b - 4.5, width: 22, height: 9, rx: 4.5, fill: '#e6f0ff', stroke: '#8fb3d9', 'stroke-width': 2, transform: `rotate(${r} ${a} ${b})` }, lg)); return lg; };
  const koji = (p, x, y, s = 1) => { const kg = S.place(g(p), { x, y, s }); el('path', { d: 'M -30,30 C -20,10 -10,0 0,-8 M 0,-8 L 0,-14 M 10,30 C 12,16 18,6 26,-2', fill: 'none', stroke: '#cbd8a0', 'stroke-width': 2.5 }, kg); [[0, -22], [28, -10]].forEach(([a, b]) => { el('circle', { cx: a, cy: b, r: 9, fill: '#9fbf4a' }, kg); for (let i = 0; i < 10; i++) { const t = (i / 10) * Math.PI * 2; el('circle', { cx: a + Math.cos(t) * 13, cy: b + Math.sin(t) * 13, r: 3.2, fill: '#c8dc6a' }, kg); } }); return kg; };

  // ---------- 甘藍家族 ----------
  const KALE = '#7fae8a', KALE_D = '#3f6f52';
  function wildCabbage(p, x, y, s) {
    const wg = S.place(g(p), { x, y, s });
    el('path', { d: 'M 0,0 L 0,-60', stroke: '#8fae7a', 'stroke-width': 8, 'stroke-linecap': 'round' }, wg);
    [[-6, -16, -150, 70], [6, -22, -30, 70], [-4, -36, -125, 64], [4, -42, -55, 64], [0, -56, -100, 50], [0, -58, -80, 50]].forEach(([a, b, r, L]) => leaf(wg, a, b, r, L, 20, KALE, KALE_D));
    return wg;
  }
  function cabbage(p, x, y, s) {
    const cg = S.place(g(p), { x, y, s });
    [[-150, 70], [-30, 70], [-170, 60], [-10, 60]].forEach(([r, L]) => leaf(cg, 0, -20, r, L, 26, '#8cc47a', '#4f8a44'));
    el('circle', { cx: 0, cy: -42, r: 44, fill: '#b9e08f', stroke: '#6fa04e', 'stroke-width': 3 }, cg);
    ['M -40,-30 C -30,-70 20,-86 40,-56', 'M -34,-12 C -20,-50 30,-54 42,-28', 'M -42,-46 C -36,-20 -10,-4 16,-2'].forEach((d) => el('path', { d, fill: 'none', stroke: '#7fb45c', 'stroke-width': 3 }, cg));
    return cg;
  }
  function broccoli(p, x, y, s) {
    const bg = S.place(g(p), { x, y, s });
    el('path', { d: 'M -14,0 L -10,-46 L 10,-46 L 14,0 Z', fill: '#a8c98a', stroke: '#6f9a54', 'stroke-width': 2 }, bg);
    leaf(bg, -10, -20, -150, 40, 12, '#7fae6a', '#4f7f44'); leaf(bg, 10, -24, -30, 40, 12, '#7fae6a', '#4f7f44');
    const rnd = S.rng(5);
    for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI, r = 10 + rnd() * 34; el('circle', { cx: Math.cos(a) * r * 1.1, cy: -58 - Math.sin(a) * r * 0.8, r: 11 + rnd() * 5, fill: i % 3 ? '#4f8f3e' : '#5fa34a', stroke: '#2f5f2a', 'stroke-width': 1.5 }, bg); }
    return bg;
  }
  function kohlrabi(p, x, y, s) {
    // 大頭菜：膨大的莖（球狀），葉柄從球的上半部長出、往上彎
    const kg = S.place(g(p), { x, y, s });
    el('path', { d: 'M -3,-2 L -2,10 L 2,10 L 3,-2 Z', fill: '#c9b48a' }, kg);
    el('ellipse', { cx: 0, cy: -28, rx: 38, ry: 30, fill: '#b8d89a', stroke: '#7aa05a', 'stroke-width': 3 }, kg);
    [[-28, -40, -130, 44], [-10, -54, -100, 50], [10, -54, -78, 50], [28, -40, -50, 44]].forEach(([a, b, r, L]) => {
      const ex = a + Math.cos((r * Math.PI) / 180) * L, ey = b + Math.sin((r * Math.PI) / 180) * L;
      el('path', { d: `M ${a},${b} Q ${a + (ex - a) * 0.2},${b + (ey - b) * 0.6} ${ex},${ey}`, fill: 'none', stroke: '#a8c98a', 'stroke-width': 4, 'stroke-linecap': 'round' }, kg);
      leaf(kg, ex, ey, r, 32, 13, KALE, KALE_D);
    });
    [[-30, -22], [28, -18]].forEach(([a, b]) => el('path', { d: `M ${a - 5},${b} q 5,4 10,0`, fill: 'none', stroke: '#8ab06a', 'stroke-width': 2 }, kg)); // 葉痕（在球的兩側）
    return kg;
  }
  // ---------- 魚、水母、木瓜 ----------
  function fish(p, x, y, s, { glow = false, color = '#c9d3d8' } = {}) {
    const fg = S.place(g(p), { x, y, s });
    if (glow) el('ellipse', { cx: 0, cy: 0, rx: 70, ry: 34, fill: GLOW, opacity: 0.25, filter: 'url(#bt-blur)' }, fg);
    el('path', { d: 'M -46,0 L -70,-20 L -64,0 L -70,20 Z', fill: glow ? '#5fe07a' : color, stroke: glow ? '#2fa04a' : '#7a8a92', 'stroke-width': 2 }, fg);
    el('path', { d: 'M -50,0 C -30,-26 30,-30 54,-4 C 30,22 -30,22 -50,0 Z', fill: glow ? '#7dff8a' : color, stroke: glow ? '#2fa04a' : '#7a8a92', 'stroke-width': 2.5 }, fg);
    el('path', { d: 'M -8,-18 C 0,-30 14,-30 20,-20', fill: glow ? '#5fe07a' : color, stroke: glow ? '#2fa04a' : '#7a8a92', 'stroke-width': 2 }, fg);
    el('circle', { cx: 36, cy: -6, r: 4.5, fill: '#1a2228' }, fg);
    el('path', { d: 'M 22,-14 C 26,-6 26,4 22,10', fill: 'none', stroke: glow ? '#2fa04a' : '#7a8a92', 'stroke-width': 2 }, fg);
    return fg;
  }
  function jelly(p, x, y, s) {
    const jg = S.place(g(p), { x, y, s });
    [-20, -8, 4, 16].forEach((a, i) => el('path', { d: `M ${a},0 q ${i % 2 ? 6 : -6},16 0,30 q ${i % 2 ? -6 : 6},14 0,28`, fill: 'none', stroke: '#9fe8b0', 'stroke-width': 2.5, opacity: 0.8 }, jg));
    el('path', { d: 'M -32,0 C -32,-36 32,-36 32,0 C 20,6 -20,6 -32,0 Z', fill: 'rgba(160,240,180,0.45)', stroke: '#7dff8a', 'stroke-width': 2.5 }, jg);
    return jg;
  }
  function papaya(p, x, y, s, sick) {
    const pg = S.place(g(p), { x, y, s });
    el('path', { d: 'M 0,-50 C 26,-50 34,-10 30,20 C 26,46 -26,46 -30,20 C -34,-10 -26,-50 0,-50 Z', fill: sick ? '#c8b45a' : '#e8a640', stroke: sick ? '#8a7a30' : '#b8761e', 'stroke-width': 3 }, pg);
    el('path', { d: 'M -2,-50 L 0,-60', stroke: '#6f5a30', 'stroke-width': 4 }, pg);
    if (sick) [[-12, -20], [10, -6], [-6, 16], [14, 22], [4, -32]].forEach(([a, b]) => el('circle', { cx: a, cy: b, r: 6, fill: 'none', stroke: '#5f6a2a', 'stroke-width': 2.5 }, pg));
    else el('ellipse', { cx: -10, cy: -18, rx: 6, ry: 14, fill: '#ffd28a', opacity: 0.6 }, pg);
    return pg;
  }

  // ---------- 羊（側面，朝右）：face 'w' 白面、'b' 黑面 ----------
  function sheep(p, x, y, s, face) {
    const sg = S.place(g(p), { x, y, s });
    const fc = face === 'b' ? '#3d3632' : '#f2e0d2', fe = face === 'b' ? '#d8cfc2' : '#b39c88'; // 黑面羊的臉加淺色輪廓，在深色舞台上也看得清楚
    [-44, -28, 26, 42].forEach((lx) => { el('rect', { x: lx - 4.5, y: 26, width: 9, height: 52, rx: 3, fill: fc, stroke: fe, 'stroke-width': 1.5 }, sg); el('rect', { x: lx - 5, y: 72, width: 10, height: 8, rx: 2, fill: '#3a3230' }, sg); });
    el('path', { d: S.smoothPath(S.blobPts(0, 0, 76, 44, 64, [[16, 0.05, 0], [9, 0.025, 1]])), fill: '#f3efe6', stroke: '#cfc6b4', 'stroke-width': 2.5 }, sg);
    el('ellipse', { cx: 62, cy: -40, rx: 14, ry: 6, fill: fc, stroke: fe, 'stroke-width': 1.5, transform: 'rotate(-25 62 -40)' }, sg); // 耳朵
    el('ellipse', { cx: 84, cy: -24, rx: 18, ry: 28, fill: fc, stroke: fe, 'stroke-width': 2, transform: 'rotate(-40 84 -24)' }, sg); // 臉
    el('path', { d: S.smoothPath(S.blobPts(70, -46, 16, 10, 24, [[8, 0.1, 0]])), fill: '#f3efe6', stroke: '#cfc6b4', 'stroke-width': 1.5 }, sg); // 頭頂的毛
    el('circle', { cx: 86, cy: -32, r: 3.4, fill: face === 'b' ? '#e8e0d0' : '#2a2220' }, sg);
    el('circle', { cx: 86, cy: -32, r: 1.6, fill: face === 'b' ? '#2a2220' : '#2a2220' }, sg);
    el('path', { d: 'M 98,-6 q 4,2 6,-2', fill: 'none', stroke: face === 'b' ? '#8a8078' : '#8a7a68', 'stroke-width': 2, 'stroke-linecap': 'round' }, sg);
    return sg;
  }
  const cellC = (p, x, y, r, { nuc = true, nucCol = 'rgba(167,150,255,0.5)', fill = 'rgba(255,214,170,0.18)', edge = '#ffd9b0' } = {}) => {
    const cg = g(p);
    el('circle', { cx: x, cy: y, r, fill, stroke: edge, 'stroke-width': 2.5 }, cg);
    if (nuc) el('circle', { cx: x, cy: y, r: r * 0.42, fill: nucCol, stroke: C.nucleus, 'stroke-width': 2 }, cg);
    return cg;
  };

  S.register({
    id: 'biotech', cards: true, section: '下2-4', title: '生物技術',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const defs = el('defs', {}, root);
      const flt = el('filter', { id: 'bt-blur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
      el('feGaussianBlur', { stdDeviation: 8 }, flt);

      // ===== 0 傳統的生物技術：發酵 =====
      const P0 = g(root);
      text(P0, 600, 60, '利用微生物發酵製作食品', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const F = [[40, '酵母菌', '麵包、酒'], [420, '乳酸菌', '優酪乳'], [800, '麴菌', '醬油']].map(([x, m, f]) => {
        const c = g(P0, { opacity: 0 });
        el('rect', { x, y: 96, width: 360, height: 470, rx: 18, ...FRAME }, c);
        el('circle', { cx: x + 180, cy: 200, r: 70, fill: '#0f2230', stroke: '#4a6272', 'stroke-width': 3 }, c);
        text(c, x + 180, 302, `${m}（放大＊）`, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(c, x + 180, 536, f, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
        arrow(c, x + 180, 322, x + 180, 360, C.mute, 3);
        return c;
      });
      yeast(F[0], 220, 200, 1.6); lacto(F[1], 600, 200, 1.6); koji(F[2], 980, 206, 1.6);
      // 麵包
      el('path', { d: 'M 140,490 L 140,430 C 140,380 300,380 300,430 L 300,490 Z', fill: '#d99a52', stroke: '#9a6428', 'stroke-width': 3 }, F[0]);
      ['M 170,410 q 14,-10 28,0', 'M 206,404 q 14,-10 28,0', 'M 242,410 q 14,-10 28,0'].forEach((d) => el('path', { d, fill: 'none', stroke: '#f2c27a', 'stroke-width': 4, 'stroke-linecap': 'round' }, F[0]));
      // 優酪乳
      el('path', { d: 'M 556,400 L 644,400 L 634,494 L 566,494 Z', fill: '#f6f2ea', stroke: '#c9c2b4', 'stroke-width': 3 }, F[1]);
      el('rect', { x: 550, y: 390, width: 100, height: 14, rx: 4, fill: '#8fb3d9' }, F[1]);
      el('rect', { x: 566, y: 434, width: 68, height: 26, rx: 4, fill: '#e6f0ff' }, F[1]);
      // 醬油瓶
      el('path', { d: 'M 962,390 L 998,390 L 998,412 C 1024,420 1026,440 1026,460 L 1026,494 L 934,494 L 934,460 C 934,440 936,420 962,412 Z', fill: '#4a2a18', stroke: '#8a5a38', 'stroke-width': 3 }, F[2]);
      el('rect', { x: 958, y: 376, width: 44, height: 16, rx: 4, fill: '#c0394e' }, F[2]);
      el('rect', { x: 946, y: 444, width: 68, height: 30, rx: 4, fill: '#f2e6c8' }, F[2]);
      const def0 = g(P0, { opacity: 0 });
      S.pill(def0, 600, 630, '生物技術：利用生物或生物的產物（例如酵素），製造產品、改善生活', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      F.forEach((c, i) => S.show(tl, c, `s0+=${0.2 + i * 0.8}`, 0.5));
      S.show(tl, def0, 's0+=2.8', 0.5);

      // ===== 1 育種：選拔與雜交 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 600, 56, '育種：從變異中挑選需要的特徵，一代一代培育', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      el('rect', { x: 40, y: 90, width: 340, height: 480, rx: 18, ...FRAME }, P1);
      wildCabbage(P1, 210, 400, 1.6);
      el('rect', { x: 120, y: 400, width: 180, height: 10, rx: 5, fill: '#6b4a2c' }, P1);
      text(P1, 210, 470, '野生甘藍', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const kinds = [[176, '高麗菜', '挑選葉', cabbage, 216], [336, '青花菜', '挑選花', broccoli, 380], [500, '大頭菜', '挑選莖', kohlrabi, 548]].map(([y, n, why, fn, by], i) => {
        const c = g(P1, { opacity: 0 });
        arrow(c, 390, 330, 510, y, C.ink2, 3.5);
        fn(c, 620, by, 1.1);
        text(c, 740, y + 4, n, { 'font-size': 28, 'font-weight': 700 });
        text(c, 740, y + 40, `（${why}）`, { 'font-size': 22, fill: C.mute });
        return c;
      });
      const cross1 = g(P1, { opacity: 0 });
      el('rect', { x: 900, y: 150, width: 270, height: 300, rx: 18, ...FRAME }, cross1);
      text(cross1, 1035, 196, '雜交', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(cross1, 1035, 248, '讓兩個品種交配，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(cross1, 1035, 280, '結合雙方的優點', { 'font-size': 22, 'text-anchor': 'middle' });
      text(cross1, 1035, 340, '抗病 × 產量高', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(cross1, 1035, 372, '↓', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(cross1, 1035, 410, '抗病又產量高', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: C.membrane });
      const tip1 = g(P1, { opacity: 0 });
      S.pill(tip1, 600, 630, '金魚也是人類從鯽魚中，一代一代挑選培育出來的', { size: 24, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      kinds.forEach((c, i) => S.show(tl, c, `s1+=${0.9 + i * 0.8}`, 0.5));
      S.show(tl, cross1, 's1+=3.4', 0.5);
      S.show(tl, tip1, 's1+=4.2', 0.5);

      // ===== 2 基因轉殖：細菌生產人類胰島素 =====
      const P2 = g(root, { opacity: 0 });
      text(P2, 600, 56, '基因轉殖：把某種生物的基因，放進另一種生物', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      // 人的細胞與基因
      const hc = g(P2);
      el('circle', { cx: 170, cy: 270, r: 110, fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 3 }, hc);
      el('circle', { cx: 170, cy: 270, r: 56, fill: 'rgba(167,150,255,0.25)', stroke: C.nucleus, 'stroke-width': 2.5 }, hc);
      el('path', { d: 'M 130,250 C 150,230 170,290 190,260 C 205,240 215,270 215,280', fill: 'none', stroke: '#a796ff', 'stroke-width': 6, 'stroke-linecap': 'round' }, hc);
      const gA = el('path', { d: 'M 168,272 C 176,268 182,262 190,260', fill: 'none', stroke: GENE, 'stroke-width': 8, 'stroke-linecap': 'round' }, hc);
      text(P2, 170, 420, '人的細胞', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P2, 170, 454, '製造胰島素的基因', { 'font-size': 22, 'text-anchor': 'middle', fill: GENE });
      // 取出的基因
      const gene = g(P2, { opacity: 0 });
      el('rect', { x: 330, y: 254, width: 70, height: 16, rx: 8, fill: GENE }, gene);
      arrow(gene, 290, 262, 322, 262, C.ink2, 3);
      text(gene, 365, 236, '取出基因', { 'font-size': 22, 'text-anchor': 'middle', fill: GENE });
      // 細菌
      const bac = (p, x, y, s, withGene) => { const bg = S.place(g(p), { x, y, s }); el('rect', { x: -60, y: -26, width: 120, height: 52, rx: 26, fill: 'rgba(160,215,255,0.2)', stroke: '#8fc8ef', 'stroke-width': 3 }, bg); el('path', { d: 'M -40,-6 C -20,-18 0,10 20,-4 C 34,-12 40,4 44,8', fill: 'none', stroke: '#62a8ff', 'stroke-width': 3 }, bg); el('circle', { cx: 20, cy: 8, r: 11, fill: 'none', stroke: '#62a8ff', 'stroke-width': 2.5 }, bg); if (withGene) el('path', { d: 'M 13,0 A 11,11 0 0,1 31,6', fill: 'none', stroke: GENE, 'stroke-width': 4.5 }, bg); return bg; };
      const b1 = g(P2, { opacity: 0 });
      arrow(b1, 410, 262, 470, 262, C.ink2, 3);
      bac(b1, 560, 262, 1.3, true);
      text(b1, 560, 340, '基因放進細菌', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const many = g(P2, { opacity: 0 });
      arrow(many, 660, 262, 720, 262, C.ink2, 3);
      [[790, 200], [880, 210], [810, 270], [900, 280], [800, 340], [890, 350]].forEach(([x, y]) => bac(many, x, y, 0.6, true));
      text(many, 845, 410, '細菌大量繁殖', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const ins = g(P2, { opacity: 0 });
      arrow(ins, 950, 262, 1000, 262, C.ink2, 3);
      el('rect', { x: 1030, y: 200, width: 80, height: 120, rx: 10, fill: 'rgba(220,240,255,0.25)', stroke: '#cfe8ff', 'stroke-width': 3 }, ins);
      el('rect', { x: 1046, y: 180, width: 48, height: 24, rx: 4, fill: '#c9d2d8' }, ins);
      el('rect', { x: 1034, y: 240, width: 72, height: 40, rx: 4, fill: '#f2e6c8' }, ins);
      text(ins, 1070, 268, '胰島素', { 'font-size': 20, 'text-anchor': 'middle', fill: '#4a3a20', 'font-weight': 700 });
      text(ins, 1070, 370, '人類胰島素', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(ins, 1070, 404, '治療糖尿病', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const cmp2 = g(P2, { opacity: 0 });
      el('rect', { x: 120, y: 500, width: 960, height: 150, rx: 18, ...FRAME }, cmp2);
      text(cmp2, 160, 556, '以前：', { 'font-size': 24, fill: C.mute, 'font-weight': 700 });
      text(cmp2, 240, 556, '從豬、牛的胰臟萃取，產量少、價格高', { 'font-size': 24, fill: C.ink2 });
      text(cmp2, 160, 612, '現在：', { 'font-size': 24, fill: C.hi, 'font-weight': 700 });
      text(cmp2, 240, 612, '讓細菌生產，產量多、純度高', { 'font-size': 24, fill: C.ink });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, gene, 's2+=1', 0.4);
      S.show(tl, b1, 's2+=1.8', 0.5);
      S.show(tl, many, 's2+=2.8', 0.5);
      S.show(tl, ins, 's2+=3.8', 0.5);
      S.show(tl, cmp2, 's2+=4.8', 0.5);

      // ===== 3 基因轉殖的其他例子 =====
      const P3 = g(root, { opacity: 0 });
      text(P3, 600, 56, '基因轉殖的應用', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const E = [[40, '螢光魚'], [420, '抗病的作物'], [800, '長得快的魚']].map(([x, t]) => {
        const c = g(P3, { opacity: 0 });
        el('rect', { x, y: 90, width: 360, height: 500, rx: 18, ...FRAME }, c);
        text(c, x + 180, 136, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        return c;
      });
      jelly(E[0], 120, 220, 1.2);
      text(E[0], 120, 320, '水母', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      el('rect', { x: 180, y: 206, width: 50, height: 12, rx: 6, fill: GLOW }, E[0]);
      text(E[0], 205, 248, '螢光基因', { 'font-size': 20, 'text-anchor': 'middle', fill: GLOW });
      arrow(E[0], 238, 212, 280, 212, C.ink2, 3);
      el('circle', { cx: 326, cy: 214, r: 20, fill: 'rgba(255,230,180,0.25)', stroke: '#ffd9b0', 'stroke-width': 2.5 }, E[0]); // 魚卵
      el('circle', { cx: 330, cy: 220, r: 10, fill: 'rgba(255,200,120,0.55)' }, E[0]);
      el('path', { d: 'M 316,212 C 316,200 334,198 338,208', fill: 'none', stroke: '#e8f0f2', 'stroke-width': 3, 'stroke-linecap': 'round' }, E[0]);
      text(E[0], 330, 262, '魚的受精卵', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      fish(E[0], 220, 400, 1.3, { glow: true });
      text(E[0], 220, 490, '會發螢光的觀賞魚', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(E[0], 220, 530, '（臺灣研發的觀賞魚）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      papaya(E[1], 530, 300, 1.4, true);
      papaya(E[1], 690, 300, 1.4, false);
      text(E[1], 530, 400, '一般木瓜', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(E[1], 530, 430, '感染病毒', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(E[1], 690, 400, '基改木瓜', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(E[1], 690, 430, '能抵抗病毒', { 'font-size': 22, 'text-anchor': 'middle', fill: C.membrane });
      text(E[1], 600, 500, '轉殖抗病、抗蟲的基因', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(E[1], 600, 536, '減少農藥的使用', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      fish(E[2], 900, 250, 0.9, { color: '#d9a8a0' });
      text(E[2], 900, 320, '一般的鮭魚', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      fish(E[2], 980, 400, 1.5, { color: '#d9a8a0' });
      text(E[2], 980, 476, '轉殖生長激素基因', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(E[2], 980, 512, '同樣的時間長得更大', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const gm3 = g(P3, { opacity: 0 });
      S.pill(gm3, 600, 650, '經過基因轉殖的生物，稱為基因改造生物', { size: 26, color: C.membrane, edge: C.membrane });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      E.forEach((c, i) => S.show(tl, c, `s3+=${0.6 + i * 1}`, 0.5));
      S.show(tl, gm3, 's3+=3.6', 0.5);

      // ===== 4 複製動物：桃莉羊 =====
      const P4 = g(root, { opacity: 0 });
      text(P4, 600, 50, '複製羊「桃莉」（1996 年，英國）', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      sheep(P4, 120, 160, 0.85, 'w');
      text(P4, 120, 252, '白面母羊', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      sheep(P4, 120, 410, 0.85, 'b');
      text(P4, 120, 502, '黑面母羊', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const s41 = g(P4, { opacity: 0 });
      arrow(s41, 220, 150, 268, 150, C.ink2, 3);
      cellC(s41, 320, 150, 38, { nucCol: 'rgba(255,209,102,0.6)' });
      text(s41, 320, 214, '乳腺細胞', { 'font-size': 22, 'text-anchor': 'middle' });
      arrow(s41, 366, 150, 412, 150, C.ink2, 3);
      el('circle', { cx: 440, cy: 150, r: 18, fill: 'rgba(255,209,102,0.6)', stroke: C.nucleus, 'stroke-width': 2.5 }, s41);
      text(s41, 432, 204, '取出細胞核', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      const s42 = g(P4, { opacity: 0 });
      arrow(s42, 220, 400, 268, 400, C.ink2, 3);
      cellC(s42, 320, 400, 42, { nucCol: 'rgba(120,110,160,0.6)' });
      text(s42, 320, 468, '卵細胞', { 'font-size': 22, 'text-anchor': 'middle' });
      arrow(s42, 368, 400, 412, 400, C.ink2, 3);
      cellC(s42, 460, 400, 42, { nuc: false });
      text(s42, 460, 468, '去除細胞核', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const s43 = g(P4, { opacity: 0 });
      arrow(s43, 466, 158, 566, 248, C.ink2, 3);
      arrow(s43, 500, 376, 560, 310, C.ink2, 3);
      cellC(s43, 610, 280, 46, { nucCol: 'rgba(255,209,102,0.6)' });
      text(s43, 610, 352, '兩者結合', { 'font-size': 22, 'text-anchor': 'middle' });
      arrow(s43, 664, 280, 710, 280, C.ink2, 3);
      [[-12, -12], [12, -12], [-12, 12], [12, 12]].forEach(([a, b]) => el('circle', { cx: 752 + a, cy: 280 + b, r: 14, fill: 'rgba(255,214,170,0.25)', stroke: '#ffd9b0', 'stroke-width': 2 }, s43));
      text(s43, 752, 334, '胚胎', { 'font-size': 22, 'text-anchor': 'middle' });
      const s44 = g(P4, { opacity: 0 });
      arrow(s44, 786, 280, 836, 280, C.ink2, 3);
      sheep(s44, 920, 300, 0.85, 'b');
      text(s44, 920, 392, '植入另一隻黑面母羊', { 'font-size': 22, 'text-anchor': 'middle' });
      text(s44, 920, 422, '的子宮（代理孕母）', { 'font-size': 22, 'text-anchor': 'middle' });
      const s45 = g(P4, { opacity: 0 });
      arrow(s45, 920, 440, 980, 486, C.ink2, 3);
      sheep(s45, 1080, 520, 0.62, 'w');
      text(s45, 1080, 600, '桃莉羊：白面', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const con4 = g(P4, { opacity: 0 });
      el('rect', { x: 40, y: 560, width: 860, height: 130, rx: 18, ...FRAME }, con4);
      const t4 = text(con4, 70, 608, '桃莉羊細胞核中的基因和提供細胞核的', { 'font-size': 26 });
      const t4b = el('tspan', { fill: C.hi, 'font-weight': 700 }, t4); t4b.textContent = '白面母羊';
      const t4c = el('tspan', {}, t4); t4c.textContent = '相同';
      text(con4, 70, 660, '沒有精子和卵的結合 → 屬於無性生殖', { 'font-size': 26, fill: C.membrane, 'font-weight': 700 });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.show(tl, s41, 's4+=1', 0.5);
      S.show(tl, s42, 's4+=1.8', 0.5);
      S.show(tl, s43, 's4+=2.6', 0.5);
      S.show(tl, s44, 's4+=3.4', 0.5);
      S.show(tl, s45, 's4+=4.2', 0.5);
      S.show(tl, con4, 's4+=5', 0.5);

      // ===== 5 試管嬰兒：體外受精，再植回子宮（和桃莉羊對照） =====
      const PV = g(root, { opacity: 0 });
      const B2 = S.b2 || {};
      text(PV, 600, 50, '試管嬰兒：在體外受精，再植回母親的子宮', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      // 取出精子和卵
      const v1 = g(PV, { opacity: 0 });
      if (B2.sperm) B2.sperm(v1, 130, 150, 1.3, '', '#cfe3ee');
      text(v1, 92, 200, '精子（父親）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      if (B2.egg) B2.egg(v1, 110, 300, 36, '', '#ffd9b0');
      text(v1, 110, 366, '卵（母親）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      arrow(v1, 180, 168, 266, 222, C.ink2, 3); arrow(v1, 160, 294, 266, 262, C.ink2, 3);
      // 培養皿
      const DX = 370, DY = 244;
      const dish = g(PV, { opacity: 0 });
      el('ellipse', { cx: DX, cy: DY + 10, rx: 96, ry: 34, fill: 'rgba(200,230,255,0.10)', stroke: '#cfe8ff', 'stroke-width': 3 }, dish);
      el('ellipse', { cx: DX, cy: DY + 8, rx: 84, ry: 26, fill: 'rgba(240,220,150,0.30)' }, dish);
      el('ellipse', { cx: DX, cy: DY - 2, rx: 96, ry: 34, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 2, opacity: 0.6 }, dish);
      el('circle', { cx: DX + 6, cy: DY + 6, r: 15, fill: 'rgba(255,214,170,0.35)', stroke: '#ffd9b0', 'stroke-width': 2 }, dish);
      el('circle', { cx: DX + 6, cy: DY + 6, r: 6, fill: 'rgba(167,150,255,0.6)' }, dish);
      const spD = [0, 1, 2].map(() => { const t = g(dish); el('path', { d: 'M -3,0 q -5,-3 -9,0 q -5,3 -9,0', fill: 'none', stroke: '#e8f6ff', 'stroke-width': 1.6 }, t); el('ellipse', { cx: 0, cy: 0, rx: 3.5, ry: 2.5, fill: '#e8f6ff' }, t); return t; });
      const flashV = el('circle', { cx: DX + 6, cy: DY + 6, r: 15, fill: 'none', stroke: C.hi, 'stroke-width': 3, opacity: 0 }, dish);
      text(dish, DX, DY + 82, '在培養皿中受精', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(dish, DX, DY + 112, '（體外受精）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 受精卵 → 胚胎
      const v2 = g(PV, { opacity: 0 });
      arrow(v2, 476, DY, 524, DY, C.ink2, 3);
      cellC(v2, 570, DY, 34, { nucCol: 'rgba(167,150,255,0.5)' });
      text(v2, 570, DY + 70, '受精卵', { 'font-size': 22, 'text-anchor': 'middle' });
      const v3 = g(PV, { opacity: 0 });
      arrow(v3, 614, DY, 662, DY, C.ink2, 3);
      [[-14, -14], [14, -14], [-14, 14], [14, 14]].forEach(([a, b]) => el('circle', { cx: 716 + a, cy: DY + b, r: 17, fill: 'rgba(255,214,170,0.25)', stroke: '#ffd9b0', 'stroke-width': 2 }, v3));
      text(v3, 716, DY + 70, '胚胎', { 'font-size': 22, 'text-anchor': 'middle' });
      S.pill(v3, 716, DY + 108, '培養約 3～5 天＊', { size: 20, color: C.hi });
      // 植回母親的子宮（只畫人物，不畫身體內部）
      const v4 = g(PV, { opacity: 0 });
      arrow(v4, 770, DY, 900, DY, C.ink2, 3);
      text(v4, 835, DY - 16, '植回', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      if (B2.person) B2.person(v4, 1040, 196, 0.72, { adult: true, girl: true, shirt: '#8a5f8f' });
      text(v4, 1040, 322, '母親的子宮', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(v4, 1040, 356, '胎兒在子宮內發育', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      // 對照表：試管嬰兒 vs 桃莉羊
      const tbV = g(PV, { opacity: 0 });
      const TXV = [60, 420, 780, 1140], TYV = 420, RHV = 66;
      const rowsV = [['', '試管嬰兒', '桃莉羊（複製）'], ['精子和卵結合（受精）', '有，在體外受精', '沒有'], ['生殖方式', '有性生殖', '無性生殖'], ['細胞核的基因來自', '父母雙方', '提供細胞核的羊']];
      el('rect', { x: TXV[0], y: TYV, width: TXV[3] - TXV[0], height: RHV * rowsV.length, rx: 14, ...FRAME }, tbV);
      el('rect', { x: TXV[0], y: TYV, width: TXV[3] - TXV[0], height: RHV, rx: 14, fill: '#1a3242' }, tbV);
      rowsV.forEach((r, i) => {
        const y = TYV + i * RHV + RHV / 2 + 9;
        if (i) el('line', { x1: TXV[0] + 10, y1: TYV + i * RHV, x2: TXV[3] - 10, y2: TYV + i * RHV, stroke: '#2b4252', 'stroke-width': 2 }, tbV);
        r.forEach((t, j) => {
          const fill = i === 0 ? (j === 1 ? '#ffb3c0' : '#d6a8ff') : j === 0 ? C.ink2 : i === 2 ? (j === 1 ? C.hi : C.membrane) : C.ink;
          text(tbV, (TXV[j] + TXV[j + 1]) / 2, y, t, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': i === 0 || j === 0 || i === 2 ? 700 : 400, fill });
        });
      });
      [1, 2].forEach((j) => el('line', { x1: TXV[j], y1: TYV + 10, x2: TXV[j], y2: TYV + RHV * rowsV.length - 10, stroke: '#2b4252', 'stroke-width': 2 }, tbV));
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, PV, 's5+=0.3', 0.4);
      S.show(tl, v1, 's5+=0.6', 0.5);
      S.show(tl, dish, 's5+=1.2', 0.4);
      S.drive(tl, (u) => {
        const k = S.smoothstep(0, 0.8, u);
        spD.forEach((t, i) => {
          const a = -2.6 + i * 0.9, r = S.lerp(70, 22, k);
          S.place(t, { x: DX + 6 + Math.cos(a) * r, y: DY + 6 + Math.sin(a) * r * 0.45, r: (a * 180) / Math.PI + 180 }); // 頭朝向卵
          t.style.opacity = i === 0 && u >= 0.9 ? 0 : 1;
        });
        flashV.setAttribute('r', 15 + 14 * S.smoothstep(0.8, 1, u));
        flashV.style.opacity = u > 0.8 && u < 0.999 ? 1 - S.smoothstep(0.8, 1, u) : 0;
      }, 1.8, 's5+=1.4', 'none');
      S.show(tl, v2, 's5+=3.3', 0.4);
      S.show(tl, v3, 's5+=3.9', 0.4);
      S.show(tl, v4, 's5+=4.6', 0.5);
      S.show(tl, tbV, 's5+=5.4', 0.5);

      // ===== 6 生物技術的影響 =====
      const P5 = g(root, { opacity: 0 });
      text(P5, 600, 56, '生物技術帶來好處，也帶來隱憂', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const W = [[40, '生態', '#b9e68f'], [420, '食品安全', '#ffb35c'], [800, '倫理', '#d6a8ff']].map(([x, t, c2]) => {
        const c = g(P5, { opacity: 0 });
        el('rect', { x, y: 90, width: 360, height: 500, rx: 18, ...FRAME }, c);
        text(c, x + 180, 136, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: c2 });
        return c;
      });
      // 生態：田裡的基改作物，花粉飄到野生植物
      el('rect', { x: 60, y: 330, width: 320, height: 10, rx: 5, fill: '#6b4a2c' }, W[0]);
      [90, 130, 170].forEach((x) => { el('line', { x1: x, y1: 330, x2: x, y2: 250, stroke: '#7cc45a', 'stroke-width': 4 }, W[0]); leaf(W[0], x, 300, -140, 30, 9, '#6cbc5a', '#2f7a3a'); leaf(W[0], x, 280, -40, 30, 9, '#6cbc5a', '#2f7a3a'); el('ellipse', { cx: x, cy: 246, rx: 7, ry: 12, fill: '#e8d070' }, W[0]); });
      text(W[0], 130, 366, '基改作物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      [[300, 330], [340, 330]].forEach(([x, y]) => { el('line', { x1: x, y1: y, x2: x, y2: y - 56, stroke: '#8fae7a', 'stroke-width': 3.5 }, W[0]); leaf(W[0], x, y - 26, -140, 24, 8, '#8fae7a', '#4f6f42'); leaf(W[0], x, y - 36, -40, 24, 8, '#8fae7a', '#4f6f42'); });
      text(W[0], 320, 366, '野生植物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      [[200, 236], [232, 226], [262, 240], [286, 252]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4, fill: '#ffe08a' }, W[0]));
      el('path', { d: 'M 180,240 Q 240,200 296,256', fill: 'none', stroke: '#ffe08a', 'stroke-width': 2, 'stroke-dasharray': '5 6' }, W[0]);
      text(W[0], 220, 430, '花粉傳到野生植物，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[0], 220, 462, '基改生物跑到野外，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[0], 220, 494, '可能影響野生的物種', { 'font-size': 22, 'text-anchor': 'middle' });
      // 食品安全：包裝上的標示
      el('path', { d: 'M 540,200 L 660,200 L 670,350 L 530,350 Z', fill: '#e8dcc0', stroke: '#9c8a6a', 'stroke-width': 3 }, W[1]);
      el('rect', { x: 548, y: 270, width: 104, height: 50, rx: 6, fill: '#ffffff', stroke: '#c0394e', 'stroke-width': 2.5 }, W[1]);
      text(W[1], 600, 303, '基因改造', { 'font-size': 20, 'text-anchor': 'middle', fill: '#c0394e', 'font-weight': 700 });
      [[574, 236], [600, 230], [626, 238]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 9, ry: 7, fill: '#e8c860', stroke: '#a88a30', 'stroke-width': 1.5 }, W[1]));
      text(W[1], 600, 430, '對健康的影響', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[1], 600, 462, '還在研究；臺灣規定', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[1], 600, 494, '要標示「基因改造」', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      // 倫理：複製出來的一模一樣的羊
      sheep(W[2], 920, 290, 0.62, 'w'); sheep(W[2], 1060, 290, 0.62, 'w');
      text(W[2], 990, 230, '？', { 'font-size': 40, 'text-anchor': 'middle', fill: '#d6a8ff', 'font-weight': 700 });
      text(W[2], 980, 430, '複製動物、改變生物', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[2], 980, 462, '的基因，應該做到', { 'font-size': 22, 'text-anchor': 'middle' });
      text(W[2], 980, 494, '什麼程度？', { 'font-size': 22, 'text-anchor': 'middle' });
      const end5 = g(P5, { opacity: 0 });
      S.pill(end5, 600, 650, '使用生物技術時，要考慮對生態、健康和社會的影響', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s6');
      S.hide(tl, PV, 's6', 0.4);
      S.show(tl, P5, 's6+=0.3', 0.4);
      W.forEach((c, i) => S.show(tl, c, `s6+=${0.6 + i * 1}`, 0.5));
      S.show(tl, end5, 's6+=3.6', 0.5);

      return {
        tl,
        notes: [
          '＊示意：微生物是放大的樣子，大小和數量都是示意。酵母菌產生的二氧化碳讓麵團膨脹，產生的酒精可以釀酒。',
          '野生甘藍經過長時間的選拔，培育出許多不同的蔬菜。育種也可以利用突變或基因轉殖，縮短培育的時間。',
          '＊示意：細菌和基因都畫得很大。高中會學到用來攜帶基因的環狀 DNA（質體，補充）。用同樣的方法也能生產生長激素、B 型肝炎疫苗等。',
          '螢光魚的螢光蛋白基因最早來自水母。基改木瓜轉殖的是能抵抗木瓜輪點病毒的基因。長得較快的基因轉殖魚也是基因改造生物。',
          '桃莉羊誕生於 1996 年，是第一隻用成體細胞複製成功的哺乳類動物。植物的組織培養也能產生大量和親代基因相同的個體（例如蘭花，見第七章無性生殖）。桃莉羊細胞核中的基因和白面母羊相同。',
          '＊示意：細胞都畫得很大；胚胎在體外培養的天數依情況不同，常見約 3～5 天＊。「試管嬰兒」其實是在培養皿中受精，只有受精和最初幾天在體外，胎兒仍在母親的子宮內發育。這是醫療技術；人類自然的生殖仍是體內受精。桃莉羊沒有受精，是無性生殖。',
          '基因改造食品：用基因改造生物做原料的食品。生物技術的發展常有不同的意見，可以從生態、健康、法律、倫理等角度討論。',
        ],
        steps: [
          '<b>生物技術</b>：利用生物來製造產品、改善生活。傳統的例子是<b>發酵</b>：<b>酵母菌</b>做麵包、釀酒，<b>乳酸菌</b>做優酪乳，<b>麴菌</b>做醬油。',
          '<b>育種</b>：從生物的變異中<b>挑選</b>需要的特徵，一代一代繁殖，例如野生甘藍培育出高麗菜、青花菜、大頭菜；<b>雜交</b>則能結合兩個品種的優點。',
          '<b>基因轉殖</b>：把人類製造<b>胰島素</b>的基因放進<b>細菌</b>，細菌大量繁殖，就能生產人類的胰島素，治療糖尿病。',
          '基因轉殖的應用：把水母的螢光基因轉殖到魚，培育出<b>螢光魚</b>；轉殖抗病、抗蟲基因的<b>基改作物</b>。這些都是<b>基因改造生物</b>。',
          '<b>複製動物</b>：把白面母羊乳腺細胞的<b>細胞核</b>，放進去除細胞核的<b>卵細胞</b>，發育成胚胎，誕生了<b>桃莉羊</b>，屬於<b>無性生殖</b>。',
          '<b>試管嬰兒</b>：卵和精子在體外<b>受精</b>，受精卵發育成胚胎後，再植回母親的<b>子宮</b>。有精子和卵結合，所以是<b>有性生殖</b>。',
          '生物技術也帶來隱憂：基改生物可能影響<b>野生物種</b>；基改食品要<b>標示</b>；複製和改變基因還有<b>倫理</b>上的爭議。',
        ],
      };
    },
  });
})();
