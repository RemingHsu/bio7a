/* 共用圖形：人體輪廓、胃、消化系統（依解剖位置）。
   人體座標：中線 x=600，頭頂 y=60，腳底 y≈702（約 1.6 m → 1 m ≈ 400 單位）。
   畫面左邊 = 人的右邊（正面看）。 */
(() => {
  const { el, g, C } = S;

  // ---------- 胃（寬約 500 單位，原點在胃體中央附近） ----------
  S.STOMACH_D = 'M 9,-154.8 C 18,-211.5 81,-235.8 135,-220.5 C 189,-205.2 220.5,-153 225,-85.5 C 230.4,0 211.5,94.5 153,148.5 C 99,198 9,208.8 -63,190.8 C -126,175.5 -175.5,139.5 -211.5,106.2 C -225,93.6 -235.8,90 -248.4,90.9 L -270,92.7 L -270,52.2 C -252,51.3 -241.2,51.3 -229.5,54 C -193.5,59.4 -148.5,63 -108,49.5 C -63,34.2 -43.2,0 -40.5,-54 C -38.7,-99 -41.4,-130.5 -40.5,-151.2 C -27,-162 0,-162 9,-154.8 Z';
  const ESO_D = 'M -24.3,-320 C -23.4,-252 -18,-198 -14.4,-150';
  const DUO_D = 'M -268,72 C -301.5,72 -322.2,94.5 -324,135 L -324,216 C -322.2,261 -292.5,280.8 -252,280.8';
  S.STOMACH_ESO = ESO_D; S.STOMACH_DUO = DUO_D;
  let uid = 0;

  // opts: stubs（畫食道與十二指腸接頭）, wall（外壁線寬）, rugae（皺褶）, shade（立體感）
  S.stomach = (p, { stubs = true, wall = 10, rugae = true, shade = true } = {}) => {
    const id = 'stg' + uid++;
    const root = g(p);
    const defs = el('defs', {}, root);
    const lg = el('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': '#d9788c' }, lg);
    el('stop', { offset: 0.55, 'stop-color': '#b9566b' }, lg);
    el('stop', { offset: 1, 'stop-color': '#7f3346' }, lg);
    if (stubs) {
      el('path', { d: ESO_D, stroke: '#a24d60', 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, root);
      el('path', { d: ESO_D, stroke: '#c56a7d', 'stroke-width': 20, fill: 'none', 'stroke-linecap': 'round', opacity: 0.6 }, root);
      el('path', { d: DUO_D, stroke: '#c07a5e', 'stroke-width': 42, fill: 'none', 'stroke-linecap': 'round' }, root);
      el('path', { d: DUO_D, stroke: '#dd9a7c', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round', opacity: 0.5 }, root);
    }
    const body = el('path', { d: S.STOMACH_D, fill: shade ? `url(#${id})` : '#b9566b', stroke: '#f2a0b0', 'stroke-width': wall, 'stroke-linejoin': 'round' }, root);
    if (rugae) {
      ['M 150,-190 C 190,-120 196,-20 160,70', 'M 95,-200 C 140,-110 145,20 90,120', 'M 40,-150 C 80,-60 70,70 0,150', 'M -20,-60 C 0,40 -40,110 -110,130', 'M -110,90 C -160,105 -200,95 -240,78']
        .forEach((d) => el('path', { d, stroke: '#8e3a50', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', opacity: 0.55 }, root));
    }
    if (shade) el('ellipse', { cx: 120, cy: -150, rx: 70, ry: 38, fill: '#ffffff', opacity: 0.12, transform: 'rotate(-25 120 -150)' }, root);
    // 幽門括約肌
    el('rect', { x: -262, y: 50, width: 12, height: 46, rx: 5, fill: '#8e3a50' }, root);
    root.body = body;
    return root;
  };

  // 從路徑上某一點往內縮 depth（用來放組織層的標示）
  S.inset = (path, frac, depth) => {
    const L = path.getTotalLength(), s = frac * L;
    const a = path.getPointAtLength(s), b = path.getPointAtLength(Math.min(L, s + 1));
    let nx = -(b.y - a.y), ny = b.x - a.x; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
    const probe = new DOMPoint(a.x + nx * 3, a.y + ny * 3);
    if (!path.isPointInFill(probe)) { nx = -nx; ny = -ny; }
    return [a.x + nx * depth, a.y + ny * depth];
  };

  // ---------- 人體輪廓 ----------
  const R = [[0, 60], [15, 62], [26, 69], [31, 82], [32, 98], [30, 114], [26, 127], [19, 137], [12, 142], [11, 148], [12, 160],
    [24, 165], [48, 169], [68, 174], [80, 184], [86, 205], [91, 250], [98, 300], [105, 345], [110, 378], [115, 394], [117, 414], [112, 432], [103, 436], [97, 422], [94, 400], [92, 380], [87, 345], [81, 300], [75, 252], [69, 214],
    [65, 230], [66, 268], [63, 300], [61, 322], [64, 350], [68, 372], [66, 398],
    [61, 450], [56, 500], [51, 540], [49, 580], [44, 630], [38, 668], [41, 688], [50, 696], [46, 702], [22, 702], [16, 690], [14, 668], [16, 630], [14, 580], [12, 540], [10, 490], [6, 430], [2, 404], [0, 400]];
  const PTS = [...R.map(([dx, y]) => [600 + dx, y]), ...R.slice(1, -1).reverse().map(([dx, y]) => [600 - dx, y])];
  S.HUMAN_D = (() => {
    // 開放折線的 Catmull-Rom（頭頂、胯下保持連續）
    const P = PTS, n = P.length;
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      const t = 0.18;
      d += `C${(p1[0] + (p2[0] - p0[0]) * t).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) * t).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * t).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) * t).toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d + 'Z';
  })();

  S.human = (p, { fill = 'rgba(52,96,122,0.55)', stroke = C.bodyEdge, sw = 3 } = {}) =>
    el('path', { d: S.HUMAN_D, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' }, p);

  // ---------- 消化系統（人體座標） ----------
  S.BODY = { stomach: { x: 632, y: 290, s: 0.125 } };
  S.digestive = (p) => {
    const o = {};
    o.large = el('path', { d: 'M 556,376 L 554,330 C 554,318 560,312 572,313 C 595,316 610,330 628,322 C 640,316 650,306 657,310 C 662,314 661,322 660,330 L 659,360 C 658,372 650,378 636,380 C 622,382 612,382 606,386 L 602,395', stroke: '#c88a5a', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    el('circle', { cx: 556, cy: 377, r: 6, fill: '#c88a5a' }, p);
    el('path', { d: 'M 558,382 q 3,6 0,10', stroke: '#c88a5a', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, p);
    o.pancreas = el('path', { d: 'M 592,318 C 600,312 620,312 640,306 C 650,303 657,302 660,305 C 660,310 650,312 640,314 C 622,320 606,326 594,326 Z', fill: '#e9c27a', stroke: '#f6dca6', 'stroke-width': 1 }, p);
    o.small = el('path', { d: 'M 598,299 C 590,299 583,304 582,313 C 581,322 586,329 596,330 C 606,331 610,330 616,334 C 630,336 640,340 636,346 C 630,352 578,344 574,352 C 570,360 634,354 636,362 C 638,370 584,364 580,370 C 577,376 568,378 561,376', stroke: '#e7a07f', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    o.eso = el('path', { d: 'M 600,132 C 600,150 599,170 600,200 C 601,230 606,250 618,262 C 624,267 628,270 630,274', stroke: '#b65a6c', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, p);
    const st = g(p, { transform: S.xf(S.BODY.stomach) });
    o.stomach = st;
    o.liver = el('path', { d: 'M 541,262 C 560,252 600,253 620,257 C 628,259 633,262 632,266 C 620,272 604,280 594,288 C 580,298 568,304 557,304 C 546,304 540,294 540,282 Z', fill: '#7a3f31', stroke: '#c9785f', 'stroke-width': 1.5 }, p);
    o.mouth = el('ellipse', { cx: 600, cy: 126, rx: 8, ry: 3.5, fill: '#d9707c', stroke: '#ffb3c1', 'stroke-width': 1 }, p);
    el('circle', { cx: 602, cy: 396, r: 2.5, fill: '#ffb3c1' }, p);
    return o;
  };

  // 其他器官系統（淡色）：腦與脊髓、肺、心臟
  S.bodyOthers = (p) => {
    el('ellipse', { cx: 600, cy: 90, rx: 24, ry: 19, fill: 'rgba(255,209,102,0.35)' }, p);
    el('line', { x1: 600, y1: 110, x2: 600, y2: 360, stroke: 'rgba(255,209,102,0.35)', 'stroke-width': 4 }, p);
    el('path', { d: 'M 596,190 C 580,182 558,192 553,222 C 549,246 551,262 557,266 C 570,262 585,259 596,259 Z', fill: 'rgba(98,168,255,0.32)' }, p);
    el('path', { d: 'M 604,190 C 620,182 642,192 647,222 C 651,246 649,262 643,266 C 632,262 625,262 617,259 C 621,249 613,241 604,239 Z', fill: 'rgba(98,168,255,0.32)' }, p);
    el('ellipse', { cx: 612, cy: 238, rx: 13, ry: 16, fill: 'rgba(255,95,116,0.6)', transform: 'rotate(-25 612 238)' }, p);
  };
})();
