/* 6-2 排泄與水分恆定：代謝廢物與排泄、含氮廢物（氨、尿素、尿酸）、泌尿系統（腎臟過濾）、皮膚排汗、水分的恆定、植物（氣孔、泌液作用）和動物的水分調節 */
(() => {
  const { el, g, text, C } = S;
  const UREA = '#c9a8ff', NH3 = '#ff9fb1', H2O = C.water, SALT = '#e8f0f2', CO2 = C.co2, URINE = '#e8c84a', VEIN = '#7f9cf0';
  const LIVER = '#7a3f31', LIVER_E = '#c9785f', KID = '#9c4a52', KID_E = '#e39aa0';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const DROP = 'M 0,-10 C 6,-3 7,1 7,4 C 7,9 4,11 0,11 C -4,11 -7,9 -7,4 C -7,1 -6,-3 0,-10 Z';
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.7, y2: y2 - Math.sin(a) * head * 0.7, stroke: col, 'stroke-width': w }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  // 腎臟（豆形），凹處朝向 side（-1 左、1 右）
  const kidney = (p, x, y, side, s = 1) => {
    const k = S.place(g(p), { x, y, s });
    el('path', { d: `M 0,-52 C ${-side * 34},-52 ${-side * 40},-20 ${-side * 38},4 C ${-side * 36},34 ${-side * 26},54 0,52 C ${side * 20},50 ${side * 28},36 ${side * 20},20 C ${side * 14},10 ${side * 14},-10 ${side * 20},-20 C ${side * 28},-36 ${side * 20},-52 0,-52 Z`, fill: KID, stroke: KID_E, 'stroke-width': 3 }, k);
    return k;
  };
  const particle = (p, kind) => {
    const m = g(p);
    if (kind === 'urea') el('circle', { cx: 0, cy: 0, r: 8, fill: UREA, stroke: '#0d1822', 'stroke-width': 1.5 }, m);
    else if (kind === 'water') el('path', { d: DROP, fill: H2O }, m);
    else if (kind === 'glu') el('path', { d: hexD(10), fill: 'rgba(255,207,92,0.35)', stroke: C.sugar, 'stroke-width': 3 }, m);
    else if (kind === 'salt') el('rect', { x: -6, y: -6, width: 12, height: 12, fill: SALT, rx: 2 }, m);
    else el('ellipse', { cx: 0, cy: 0, rx: 16, ry: 10, fill: C.blood }, m);
    return m;
  };

  S.register({
    id: 'excretion', section: '6-2', title: '排泄與水分恆定',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 代謝廢物與排泄 =====
      const P0 = g(root);
      el('path', { d: S.smoothPath(S.blobPts(170, 340, 120, 132)), fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 3 }, P0);
      el('circle', { cx: 140, cy: 300, r: 32, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 2.5 }, P0);
      [[200, 390, 20], [130, 410, -30], [215, 290, 60]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: 26, ry: 13, fill: C.mito, opacity: 0.85, transform: `rotate(${r} ${x} ${y})` }, P0));
      text(P0, 170, 180, '細胞的代謝', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.membrane });
      text(P0, 170, 506, '呼吸作用、分解蛋白質等', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const chipAt = (x, y, s, col) => { const c = S.place(g(P0, { opacity: 0 }), { x, y }); S.pill(c, 0, 0, s, { size: 24, color: col, edge: col }); return c; };
      const cCO2 = chipAt(420, 170, '二氧化碳', CO2);
      const cNH3 = chipAt(390, 340, '氨（有毒）', NH3);
      const cH2O = chipAt(440, 510, '多餘的水、無機鹽', H2O);
      const livG = g(P0, { opacity: 0 });
      el('path', { d: 'M 512,318 C 540,300 600,302 622,308 C 634,312 636,318 632,324 C 616,336 594,352 578,362 C 560,372 540,376 528,372 C 512,366 506,350 508,336 Z', fill: LIVER, stroke: LIVER_E, 'stroke-width': 2.5 }, livG);
      text(livG, 572, 296, '肝臟', { 'font-size': 24, 'text-anchor': 'middle', fill: LIVER_E, 'font-weight': 700 });
      arrow(livG, 470, 340, 504, 340, C.ink2, 3, 12);
      const cUrea = chipAt(702, 340, '尿素', UREA);
      const ua = g(P0, { opacity: 0 }); arrow(ua, 638, 340, 660, 340, C.ink2, 3, 12);
      text(cUrea, 0, 44, '毒性較低', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 血液運送
      const blood0 = g(P0, { opacity: 0 });
      el('rect', { x: 764, y: 120, width: 26, height: 440, rx: 13, fill: 'rgba(255,95,116,0.3)', stroke: C.blood, 'stroke-width': 2 }, blood0);
      text(blood0, 777, 104, '經血液運送', { 'font-size': 20, 'text-anchor': 'middle', fill: C.blood });
      [[520, 170], [744, 340], [590, 510]].forEach(([x1, y]) => arrow(blood0, x1, y, 760, y, C.ink2, 3, 12));
      const ORG = [
        [190, '肺', '呼氣', '二氧化碳、水蒸氣', '#9fd8ff'],
        [350, '腎臟', '尿液', '尿素、水、無機鹽', KID_E],
        [510, '皮膚', '汗液', '水、無機鹽、少量尿素', '#f2b38a'],
      ];
      const orgs = ORG.map(([y, n, how, what, col]) => {
        const og = g(P0, { opacity: 0 });
        arrow(og, 794, y, 830, y, C.ink2, 3, 12);
        el('rect', { x: 836, y: y - 56, width: 330, height: 112, rx: 14, fill: '#122230', stroke: col, 'stroke-width': 2 }, og);
        text(og, 860, y - 12, `${n}：${how}`, { 'font-size': 28, 'font-weight': 700, fill: col });
        text(og, 860, y + 30, what, { 'font-size': 22, fill: C.ink });
        return og;
      });
      const not0 = g(P0, { opacity: 0 });
      S.pill(not0, 600, 664, '排遺（排出糞便）不是排泄：糞便主要是沒有被消化吸收的食物殘渣', { size: 22, color: C.ink2, edge: '#4a6272' });
      tl.addLabel('s0');
      S.move(tl, cCO2, { x: 220, y: 250 }, { x: 420, y: 170 }, 0.8, 's0+=0.5');
      S.show(tl, cCO2, 's0+=0.5', 0.3);
      S.move(tl, cNH3, { x: 220, y: 340 }, { x: 390, y: 340 }, 0.8, 's0+=1.2');
      S.show(tl, cNH3, 's0+=1.2', 0.3);
      S.show(tl, livG, 's0+=2', 0.4);
      S.show(tl, [cUrea, ua], 's0+=2.6', 0.4);
      S.move(tl, cH2O, { x: 220, y: 430 }, { x: 440, y: 510 }, 0.8, 's0+=3.2');
      S.show(tl, cH2O, 's0+=3.2', 0.3);
      S.show(tl, blood0, 's0+=4', 0.4);
      orgs.forEach((o, i) => S.show(tl, o, `s0+=${4.4 + i * 0.4}`, 0.4));
      S.show(tl, not0, 's0+=6', 0.5);

      // ===== 1 含氮廢物：氨、尿素、尿酸 =====
      const PN = g(root, { opacity: 0 });
      const B4 = S.B4, URIC = '#efe8d2';
      const headN = g(PN, { opacity: 0 });
      S.pill(headN, 600, 36, '蛋白質分解會產生有毒的氨，不同的動物用不同的方式排出', { size: 22, color: C.ink, edge: '#4a6272' });
      const KINDS = [
        ['氨', NH3, '許多水中的動物（例如多數魚類）', ['直接排到水中，', '靠大量的水稀釋'], ['最強', 3], 3],
        ['尿素', UREA, '人和其他哺乳類', ['在肝臟把氨變成尿素，', '溶在尿液中排出'], ['較弱', 2], 2],
        ['尿酸', URIC, '鳥類、昆蟲', ['不容易溶在水中，', '混在糞便中排出'], ['最弱', 1], 1],
      ];
      const nh3dots = [];
      const cardsN = KINDS.map(([name, col, who, how, [tox, tn], wn], i) => {
        const x0 = 40 + i * 380, cx = x0 + 180, cg = g(PN, { opacity: 0 });
        el('rect', { x: x0, y: 70, width: 360, height: 540, rx: 16, fill: '#122230', stroke: col, 'stroke-width': 2 }, cg);
        text(cg, cx, 120, name, { 'font-size': 36, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        if (i === 0) {
          el('rect', { x: x0 + 16, y: 140, width: 328, height: 190, rx: 12, fill: 'rgba(95,184,255,0.14)', stroke: 'rgba(95,184,255,0.4)', 'stroke-width': 1.5 }, cg);
          B4.fish(cg, cx + 14, 238, 0.78);
          for (let k = 0; k < 8; k++) { const d = el('circle', { cx: 0, cy: 0, r: 6, fill: NH3, stroke: '#0d1822', 'stroke-width': 1.2, opacity: 0 }, cg); nh3dots.push({ d, a: Math.PI * (0.55 + (k % 4) * 0.22), ph: k / 8, x: cx - 46, y: 240 }); }
        } else if (i === 1) {
          const hb = S.place(g(cg), { x: cx - 74 - 600 * 0.27, y: 146 - 60 * 0.27, s: 0.27 });
          S.human(hb, { fill: 'rgba(52,96,122,0.55)', sw: 5 });
          el('path', { d: 'M 541,262 C 560,252 600,253 620,257 C 628,259 633,262 632,266 C 620,272 604,280 594,288 C 580,298 568,304 557,304 C 546,304 540,294 540,282 Z', fill: '#7a3f31', stroke: '#c9785f', 'stroke-width': 3 }, hb);
          B4.rabbit(cg, cx + 72, 322, 0.55);
          S.callout(cg, cx - 74 - 13, 146 + (276 - 60) * 0.27, cx - 134, 300, '肝臟', '#c9785f', { size: 20 }).style.opacity = 1;
        } else {
          B4.bird(cg, cx - 60, 316, 0.56);
          B4.bee(cg, cx + 92, 238, 0.32);
        }
        text(cg, cx, 370, who, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        how.forEach((h, k) => text(cg, cx, 408 + k * 30, h, { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink2 }));
        el('line', { x1: x0 + 20, y1: 462, x2: x0 + 340, y2: 462, stroke: '#2b4252', 'stroke-width': 1.5 }, cg);
        const rows = g(cg, { opacity: 0 });
        text(rows, x0 + 24, 506, '毒性', { 'font-size': 21, fill: C.mute });
        for (let k = 0; k < tn; k++) el('circle', { cx: x0 + 150 + k * 30, cy: 499, r: 10, fill: '#ff8a7a' }, rows);
        text(rows, x0 + 336, 506, tox, { 'font-size': 21, 'text-anchor': 'end', fill: '#ff8a7a', 'font-weight': 700 });
        text(rows, x0 + 24, 562, '排出時', { 'font-size': 21, fill: C.mute });
        text(rows, x0 + 24, 592, '需要的水', { 'font-size': 21, fill: C.mute });
        for (let k = 0; k < wn; k++) el('path', { d: DROP, fill: H2O, transform: `translate(${x0 + 150 + k * 30},${568}) scale(1.5)` }, rows);
        text(rows, x0 + 336, 580, ['最多', '較多', '最少'][i], { 'font-size': 21, 'text-anchor': 'end', fill: H2O, 'font-weight': 700 });
        cg.rows = rows;
        return cg;
      });
      const sumN = g(PN, { opacity: 0 });
      S.pill(sumN, 600, 664, '鳥類和昆蟲排尿酸，最節省水分', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, PN, 's1+=0.3', 0.3);
      S.show(tl, headN, 's1+=0.4', 0.4);
      cardsN.forEach((c, i) => S.show(tl, c, `s1+=${0.9 + i * 1.1}`, 0.4));
      S.drive(tl, (u) => nh3dots.forEach(({ d, a, ph, x, y }) => {
        const k = (u * 3 + ph) % 1, r = 10 + k * 70;
        d.setAttribute('cx', (x + Math.cos(a) * r).toFixed(1)); d.setAttribute('cy', (y - Math.sin(a) * r * 0.9).toFixed(1));
        d.style.opacity = u > 0 && u < 1 ? (1 - k).toFixed(2) : 0;
      }), 4.5, 's1+=1', 'none');
      cardsN.forEach((c, i) => S.show(tl, c.rows, `s1+=${4.2 + i * 0.3}`, 0.4));
      S.show(tl, sumN, 's1+=5.4', 0.5);

      // ===== 2 泌尿系統與腎臟的過濾 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 60, width: 580, height: 600, rx: 18, ...FRAME }, P1);
      el('rect', { x: 640, y: 60, width: 530, height: 600, rx: 18, ...FRAME }, P1);
      el('rect', { x: 30, y: 60, width: 580, height: 600, rx: 18 }, el('clipPath', { id: 'ex1clip' }, el('defs', {}, P1)));
      const b1 = S.place(g(g(P1, { 'clip-path': 'url(#ex1clip)' })), { x: 330 - 600 * 2.6, y: 60 - 250 * 2.6, s: 2.6 });
      S.human(b1, { fill: 'rgba(44,82,104,0.3)', stroke: C.bodyEdge, sw: 0.8 });
      const sys = g(P1);
      el('path', { d: 'M 318,70 L 318,330 L 290,384', fill: 'none', stroke: C.blood, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sys);
      el('path', { d: 'M 342,70 L 342,330 L 370,384', fill: 'none', stroke: VEIN, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sys);
      [[-1, 238], [1, 422]].forEach(([s, kx]) => {
        el('path', { d: `M 318,170 L ${kx - s * 26},170`, stroke: C.blood, 'stroke-width': 8 }, sys);
        el('path', { d: `M 342,194 L ${kx - s * 26},194`, stroke: VEIN, 'stroke-width': 8 }, sys);
      });
      kidney(sys, 238, 182, 1); kidney(sys, 422, 182, -1);
      const ureters = [el('path', { d: 'M 262,214 C 270,290 286,350 306,404', fill: 'none', stroke: URINE, 'stroke-width': 7, 'stroke-linecap': 'round' }, sys), el('path', { d: 'M 398,214 C 390,290 374,350 354,404', fill: 'none', stroke: URINE, 'stroke-width': 7, 'stroke-linecap': 'round' }, sys)];
      const bladFill = el('ellipse', { cx: 330, cy: 438, rx: 48, ry: 38, fill: URINE, opacity: 0.2 }, sys);
      el('ellipse', { cx: 330, cy: 438, rx: 48, ry: 38, fill: 'none', stroke: URINE, 'stroke-width': 4 }, sys);
      el('line', { x1: 330, y1: 476, x2: 330, y2: 560, stroke: URINE, 'stroke-width': 7, 'stroke-linecap': 'round' }, sys);
      const uDrops = [0, 1, 2, 3].map(() => el('circle', { cx: 0, cy: 0, r: 5, fill: URINE, opacity: 0 }, sys));
      const call1 = [[200, 160, 110, 120, '腎臟', KID_E], [276, 300, 110, 300, '輸尿管', URINE], [284, 446, 110, 446, '膀胱', URINE], [330, 530, 110, 560, '尿道', URINE], [318, 100, 500, 90, '主動脈', C.blood], [342, 130, 500, 150, '下大靜脈', VEIN]]
        .map(([tx, ty, x, y, s, c]) => S.callout(P1, tx, ty, x, y, s, c, { size: 24 }));
      text(P1, 320, 640, '泌尿系統（示意）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 右：腎臟的過濾（示意）
      text(P1, 905, 104, '腎臟：過濾血液', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      el('path', { d: 'M 905,150 C 1010,150 1050,200 1050,280 C 1050,360 1010,420 905,420 C 800,420 760,360 760,280 C 760,200 800,150 905,150 Z', fill: 'rgba(156,74,82,0.35)', stroke: KID_E, 'stroke-width': 3 }, P1);
      el('rect', { x: 660, y: 196, width: 490, height: 52, rx: 26, fill: 'rgba(255,95,116,0.18)', stroke: C.blood, 'stroke-width': 3 }, P1);
      el('line', { x1: 840, y1: 248, x2: 970, y2: 248, stroke: '#f2e6c0', 'stroke-width': 4, 'stroke-dasharray': '10 7' }, P1);
      el('path', { d: 'M 880,252 L 880,490 L 930,490 L 930,252', fill: 'rgba(232,200,74,0.12)', stroke: URINE, 'stroke-width': 3 }, P1);
      text(P1, 700, 184, '腎動脈', { 'font-size': 22, 'text-anchor': 'middle', fill: C.blood, 'font-weight': 700 });
      text(P1, 1110, 184, '腎靜脈', { 'font-size': 22, 'text-anchor': 'middle', fill: C.blood, 'font-weight': 700 });
      text(P1, 905, 186, '腎臟', { 'font-size': 22, 'text-anchor': 'middle', fill: KID_E });
      const lbl1 = [
        text(P1, 700, 284, '尿素較多', { 'font-size': 22, 'text-anchor': 'middle', fill: UREA, opacity: 0 }),
        text(P1, 1110, 284, '尿素較少', { 'font-size': 22, 'text-anchor': 'middle', fill: UREA, opacity: 0 }),
      ];
      const back1 = g(P1, { opacity: 0 });
      el('path', { d: 'M 940,360 C 990,350 1000,300 990,262', fill: 'none', stroke: C.sugar, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, back1);
      arrow(back1, 992, 276, 990, 254, C.sugar, 3, 10);
      // 標在腎臟輪廓外面（輪廓右緣 x ≈ 1050），不要壓在輪廓線上
      text(back1, 1062, 332, '有用物質', { 'font-size': 22, fill: C.sugar });
      text(back1, 1062, 360, '送回血液', { 'font-size': 22, fill: C.sugar });
      const urine1 = g(P1, { opacity: 0 });
      S.pill(urine1, 905, 530, '尿液：尿素、多餘的水和無機鹽', { size: 22, color: URINE, edge: URINE });
      text(urine1, 905, 580, '→ 輸尿管 → 膀胱 → 尿道 → 排出', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 粒子：t 從 0 到 1 走完自己的路線
      const parts1 = [];
      const addP = (kind, n, route) => { for (let i = 0; i < n; i++) parts1.push({ m: particle(P1, kind), kind, ph: i / n, route: route(i) }); };
      addP('rbc', 5, (i) => ({ type: 'through', y: 222 + (i % 2 ? -6 : 6) }));
      addP('urea', 8, (i) => (i % 4 === 3 ? { type: 'through', y: 212 + (i % 3) * 8 } : { type: 'down', y: 214 + (i % 3) * 9, dx: (i % 3) * 12 - 12 }));
      addP('water', 6, (i) => (i % 2 ? { type: 'through', y: 230 } : { type: 'down', y: 226, dx: 10 - (i % 3) * 8 }));
      addP('salt', 3, (i) => (i % 3 === 2 ? { type: 'through', y: 218 } : { type: 'down', y: 218, dx: 4 }));
      addP('glu', 3, () => ({ type: 'back', y: 220 }));
      const pos1 = (o, t) => {
        const r = o.route;
        if (r.type === 'through') return [S.lerp(650, 1160, t), r.y, 1];
        if (r.type === 'down') {
          if (t < 0.45) return [S.lerp(650, 900 + r.dx, t / 0.45), r.y, 1];
          const k = (t - 0.45) / 0.55; return [905 + r.dx * 0.8 + Math.sin(k * 8) * 4, S.lerp(r.y, 476, k), k > 0.85 ? (1 - k) / 0.15 : 1];
        }
        // 葡萄糖：先被過濾，再送回血液
        if (t < 0.3) return [S.lerp(650, 900, t / 0.3), r.y, 1];
        if (t < 0.5) { const k = (t - 0.3) / 0.2; return [900 + k * 20, S.lerp(r.y, 350, k), 1]; }
        if (t < 0.7) { const k = (t - 0.5) / 0.2; return [S.lerp(920, 990, k), S.lerp(350, r.y, k * k), 1]; }
        return [S.lerp(990, 1160, (t - 0.7) / 0.3), r.y, 1];
      };
      const run1 = (u) => parts1.forEach((o) => {
        const t = (u * 2 + o.ph * 0.97) % 1, [x, y, a] = pos1(o, t);
        o.m.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        o.m.style.opacity = u <= 0 ? 0 : a * Math.min(1, t * 12, (1 - t) * 12);
      });
      run1(0);
      const legend1 = g(P1);
      [['urea', '尿素', 672], ['water', '水', 764], ['salt', '無機鹽', 836], ['glu', '葡萄糖', 950], ['rbc', '血球', 1074]].forEach(([k, n, x]) => {
        particle(S.place(g(legend1), { x, y: 630 }), k);
        text(legend1, x + 22, 637, n, { 'font-size': 20, fill: C.ink2 });
      });
      tl.addLabel('s2');
      S.hide(tl, PN, 's2', 0.4);
      S.show(tl, P1, 's2+=0.3', 0.4);
      call1.forEach((c, i) => S.show(tl, c, `s2+=${0.6 + i * 0.3}`, 0.3));
      S.drive(tl, (u) => {
        uDrops.forEach((d, i) => {
          const k = (u * 3 + i / 4) % 1, path = ureters[i % 2], L = path.getTotalLength(), q = path.getPointAtLength(L * k);
          d.setAttribute('cx', q.x); d.setAttribute('cy', q.y); d.style.opacity = u > 0 && u < 1 ? 1 : 0;
        });
        bladFill.setAttribute('opacity', 0.2 + 0.4 * u);
      }, 5, 's2+=1', 'none');
      S.drive(tl, run1, 6, 's2+=1.2', 'none');
      S.show(tl, lbl1, 's2+=3', 0.4);
      S.show(tl, back1, 's2+=4', 0.4);
      S.show(tl, urine1, 's2+=5', 0.4);

      // ===== 3 皮膚排汗 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 200, width: 660, height: 52, fill: 'rgba(242,179,138,0.45)' }, P2);
      el('rect', { x: 40, y: 252, width: 660, height: 360, fill: 'rgba(201,138,106,0.18)' }, P2);
      el('path', { d: 'M 40,200 C 120,192 200,208 280,200 C 360,192 440,208 520,200 C 600,192 660,206 700,200', fill: 'none', stroke: '#f2b38a', 'stroke-width': 3 }, P2);
      text(P2, 60, 186, '皮膚表面', { 'font-size': 20, fill: C.mute });
      text(P2, 690, 236, '表皮', { 'font-size': 20, 'text-anchor': 'end', fill: '#f2b38a' });
      text(P2, 690, 290, '真皮', { 'font-size': 20, 'text-anchor': 'end', fill: '#d9a07f' });
      // 毛髮（參考）
      el('path', { d: 'M 590,560 C 586,480 596,320 600,120', fill: 'none', stroke: '#5a4030', 'stroke-width': 5 }, P2);
      el('ellipse', { cx: 590, cy: 560, rx: 14, ry: 20, fill: 'rgba(90,64,48,0.4)', stroke: '#8a6a50', 'stroke-width': 2 }, P2);
      // 汗腺：捲曲的管＋導管
      const duct = 'M 360,520 L 360,300 C 360,260 362,226 366,202';
      const gland = g(P2);
      [[0, 0, 0], [14, 8, 40], [-12, 10, -30], [4, -10, 70], [-6, 18, 15]].forEach(([dx, dy, r]) => {
        el('ellipse', { cx: 360 + dx, cy: 530 + dy, rx: 30, ry: 15, fill: 'none', stroke: '#f2c86b', 'stroke-width': 12, transform: `rotate(${r} ${360 + dx} ${530 + dy})` }, gland);
        el('ellipse', { cx: 360 + dx, cy: 530 + dy, rx: 30, ry: 15, fill: 'none', stroke: '#2a3b48', 'stroke-width': 4, transform: `rotate(${r} ${360 + dx} ${530 + dy})` }, gland);
      });
      el('path', { d: duct, fill: 'none', stroke: '#f2c86b', 'stroke-width': 14, 'stroke-linecap': 'round' }, gland);
      const ductIn = el('path', { d: duct, fill: 'none', stroke: '#2a3b48', 'stroke-width': 5 }, gland);
      // 微血管
      el('path', { d: 'M 220,470 C 260,430 300,600 360,580 C 420,560 440,460 500,500 C 540,526 560,470 600,470', fill: 'none', stroke: C.blood, 'stroke-width': 6 }, P2);
      const sweat = [0, 1, 2].map((i) => S.place(g(P2, { opacity: 0 }), { x: 366 + (i - 1) * 26, y: 186 }));
      sweat.forEach((s) => el('path', { d: DROP, fill: H2O, transform: 'scale(1.6)' }, s));
      const sw2 = [];
      [['urea', 0], ['salt', 0.33], ['water', 0.66], ['water', 0.15], ['salt', 0.5]].forEach(([k, ph]) => { const m = particle(P2, k); m.style.opacity = 0; sw2.push({ m, ph }); });
      const call2 = [[366, 202, 200, 120, '汗孔', H2O], [400, 530, 200, 640, '汗腺', '#f2c86b'], [470, 486, 560, 640, '微血管', C.blood]].map(([tx, ty, x, y, s, c]) => S.callout(P2, tx, ty, x, y, s, c, { size: 24 }));
      const card2 = g(P2, { opacity: 0 });
      el('rect', { x: 760, y: 140, width: 400, height: 300, rx: 16, ...FRAME }, card2);
      text(card2, 960, 192, '汗液的成分', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      [['water', '水（大部分）', H2O], ['salt', '無機鹽（鹽分）', SALT], ['urea', '少量尿素', UREA]].forEach(([k, s, c], i) => {
        const y = 256 + i * 64;
        particle(S.place(g(card2), { x: 816, y }), k);
        text(card2, 846, y + 9, s, { 'font-size': 26, fill: c });
      });
      const heat2 = g(P2, { opacity: 0 });
      S.pill(heat2, 960, 500, '汗液蒸發會帶走熱（見 6-3）', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P1, 's3', 0.4);
      S.show(tl, P2, 's3+=0.3', 0.4);
      call2.forEach((c, i) => S.show(tl, c, `s3+=${0.6 + i * 0.3}`, 0.3));
      const ductL = ductIn.getTotalLength();
      S.drive(tl, (u) => sw2.forEach((o) => {
        const k = (u * 2 + o.ph) % 1;
        let x, y;
        if (k < 0.3) { const a = k / 0.3; x = S.lerp(440, 360, a); y = S.lerp(500, 520, a); }
        else { const q = ductIn.getPointAtLength(ductL * ((k - 0.3) / 0.7)); x = q.x; y = q.y; }
        o.m.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(0.8)`);
        o.m.style.opacity = u <= 0 || u >= 1 ? 0 : Math.min(1, k * 10, (1 - k) * 10, (1 - u) * 20);
      }), 4.5, 's3+=1', 'none');
      sweat.forEach((s, i) => S.show(tl, s, `s3+=${2.4 + i * 0.6}`, 0.4));
      S.show(tl, card2, 's3+=3', 0.5);
      S.show(tl, heat2, 's3+=4.4', 0.5);

      // ===== 4 水分的恆定 =====
      const P3 = g(root, { opacity: 0 });
      const io = g(P3);
      el('rect', { x: 80, y: 60, width: 440, height: 150, rx: 16, ...FRAME }, io);
      el('rect', { x: 680, y: 60, width: 440, height: 150, rx: 16, ...FRAME }, io);
      text(io, 300, 106, '攝取的水', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: H2O });
      text(io, 300, 156, '喝水、食物中的水', { 'font-size': 24, 'text-anchor': 'middle' });
      text(io, 900, 106, '排出的水', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: H2O });
      text(io, 900, 156, '尿液、汗液、呼氣、糞便', { 'font-size': 24, 'text-anchor': 'middle' });
      // 天平
      el('path', { d: 'M 600,110 L 580,200 L 620,200 Z', fill: '#4a6272' }, io);
      el('line', { x1: 548, y1: 104, x2: 652, y2: 104, stroke: C.hi, 'stroke-width': 5, 'stroke-linecap': 'round' }, io);
      text(io, 600, 240, '保持平衡', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const scen = [
        [40, '喝了很多水', '尿量多、顏色淡', '#f3eba6', 150],
        [620, '大量流汗、喝水很少', '尿量少、顏色深', '#d99a1e', 56],
      ].map(([x, title, res, col, lv], i) => {
        const sg = g(P3, { opacity: 0 });
        el('rect', { x, y: 280, width: 540, height: 380, rx: 18, ...FRAME }, sg);
        text(sg, x + 270, 326, title, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
        // 左：原因圖示
        if (i === 0) {
          el('path', { d: `M ${x + 60},400 L ${x + 70},540 L ${x + 130},540 L ${x + 140},400 Z`, fill: 'rgba(95,184,255,0.4)', stroke: '#cfe8ff', 'stroke-width': 3 }, sg);
          el('path', { d: `M ${x + 63},430 L ${x + 137},430`, stroke: H2O, 'stroke-width': 3 }, sg);
        } else {
          el('circle', { cx: x + 100, cy: 420, r: 30, fill: C.hi }, sg);
          [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => { const a = (k / 8) * 6.283; el('line', { x1: x + 100 + Math.cos(a) * 38, y1: 420 + Math.sin(a) * 38, x2: x + 100 + Math.cos(a) * 50, y2: 420 + Math.sin(a) * 50, stroke: C.hi, 'stroke-width': 4 }, sg); });
          [[x + 74, 500], [x + 104, 524], [x + 132, 496]].forEach(([dx, dy]) => el('path', { d: DROP, fill: H2O, transform: `translate(${dx},${dy}) scale(1.5)` }, sg));
        }
        arrow(sg, x + 160, 470, x + 210, 470, C.ink2, 3, 12);
        kidney(sg, x + 260, 470, 1, 0.7);
        text(sg, x + 260, 540, '腎臟', { 'font-size': 20, 'text-anchor': 'middle', fill: KID_E });
        arrow(sg, x + 300, 470, x + 350, 470, C.ink2, 3, 12);
        // 量杯
        el('path', { d: `M ${x + 380},380 L ${x + 380},560 L ${x + 480},560 L ${x + 480},380` }, el('clipPath', { id: 'ex3c' + i }, el('defs', {}, sg)));
        const liq = el('rect', { x: x + 380, y: 560, width: 100, height: 0, fill: col, 'clip-path': `url(#ex3c${i})` }, sg);
        el('path', { d: `M ${x + 376},376 L ${x + 380},380 L ${x + 380},560 L ${x + 480},560 L ${x + 480},380 L ${x + 484},376`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3 }, sg);
        text(sg, x + 430, 362, '尿液', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        const resT = text(sg, x + 270, 620, res, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: i ? '#e8b04a' : '#f3eba6', opacity: 0 });
        return { sg, liq, lv, resT };
      });
      tl.addLabel('s4');
      S.hide(tl, P2, 's4', 0.4);
      S.show(tl, P3, 's4+=0.3', 0.4);
      scen.forEach(({ sg, liq, lv, resT }, i) => {
        S.show(tl, sg, `s4+=${1 + i * 1.6}`, 0.4);
        S.drive(tl, (u) => { liq.setAttribute('y', 560 - lv * u); liq.setAttribute('height', lv * u); }, 1.2, `s4+=${1.5 + i * 1.6}`, 'power1.out');
        S.show(tl, resT, `s4+=${2.6 + i * 1.6}`, 0.4);
      });

      // ===== 5 植物的水分調節：氣孔開閉、泌液作用、沙漠植物 =====
      const P4 = g(root, { opacity: 0 });
      [[40, 380, '氣孔的開和關'], [440, 360, '泌液作用'], [820, 340, '沙漠植物（仙人掌）']].forEach(([x, w, t]) => {
        el('rect', { x, y: 80, width: w, height: 570, rx: 18, ...FRAME }, P4);
        text(P4, x + w / 2, 126, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      });
      // (a) 保衛細胞控制氣孔開閉
      const stoma = (cx, cy, open) => {
        const sg = S.place(g(P4), { x: cx, y: cy, s: 0.62 });
        const w = open ? 30 : 10;
        [-1, 1].forEach((s) => el('path', { d: `M 0,-80 C ${s * (w + 70)},-84 ${s * (w + 70)},84 0,80 C ${s * w},60 ${s * w},-60 0,-80 Z`, fill: open ? '#6fce62' : '#5a9a50', stroke: '#2f7a3a', 'stroke-width': 4 }, sg));
        [-1, 1].forEach((s) => [-40, 0, 40].forEach((y) => el('ellipse', { cx: s * (w + 34), cy: y, rx: 7, ry: 10, fill: '#2f8a3a' }, sg)));
        if (open) el('ellipse', { cx: 0, cy: 0, rx: w - 4, ry: 56, fill: '#0d1822' }, sg);
        return sg;
      };
      stoma(135, 300, true); stoma(325, 300, false);
      const vap = g(P4);
      const vaps = [0, 1, 2].map((i) => S.place(g(vap), { x: 135 + (i - 1) * 12, y: 290 }));
      vaps.forEach((v) => { el('path', { d: 'M 0,0 q -6,-8 0,-16 q 6,-8 0,-16', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round' }, v); });
      text(P4, 135, 420, '水分充足', { 'font-size': 24, 'text-anchor': 'middle', fill: C.water, 'font-weight': 700 });
      text(P4, 135, 454, '氣孔張開', { 'font-size': 22, 'text-anchor': 'middle' });
      text(P4, 135, 486, '水蒸氣散失', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const dry = g(P4, { opacity: 0 });
      text(dry, 325, 420, '缺水', { 'font-size': 24, 'text-anchor': 'middle', fill: '#e8b04a', 'font-weight': 700 });
      text(dry, 325, 454, '氣孔關閉', { 'font-size': 22, 'text-anchor': 'middle' });
      text(dry, 325, 486, '減少水分散失', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const arr4 = g(P4, { opacity: 0 }); arrow(arr4, 206, 300, 254, 300, C.ink2, 3, 12);
      text(P4, 230, 600, '保衛細胞（放大＊）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // (b) 泌液作用：空氣潮溼、根吸水多時，水從葉緣或葉尖排出成水珠
      const gut = g(P4, { opacity: 0 });
      [[528, 172, 22], [552, 162, 26], [578, 172, 20]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#8aa1ae' }, gut));
      el('rect', { x: 512, y: 172, width: 84, height: 20, rx: 10, fill: '#8aa1ae' }, gut);
      text(gut, 610, 190, '空氣潮溼', { 'font-size': 20, fill: '#cfe8ff' });
      el('rect', { x: 456, y: 468, width: 328, height: 64, rx: 10, fill: '#3a2a1c' }, gut);
      // 水滴放在文字（x 545～655）兩側，不碰到「土壤水分多」
      [[480, 492], [516, 514], [700, 492], [748, 514], [684, 518]].forEach(([x, y]) => el('path', { d: DROP, fill: H2O, transform: `translate(${x},${y}) scale(0.8)` }, gut));
      text(gut, 600, 518, '土壤水分多', { 'font-size': 20, 'text-anchor': 'middle', fill: C.water });
      el('path', { d: 'M 620,470 C 618,430 622,380 620,326', fill: 'none', stroke: '#4f8a3f', 'stroke-width': 8, 'stroke-linecap': 'round' }, gut);
      const LEAF_N = 9, toothD = (L, W) => {
        const h = (t) => (W / 2) * Math.pow(Math.sin(Math.PI * t), 0.9), up = [], dn = [];
        for (let i = 1; i <= LEAF_N; i++) {
          const t0 = (i - 0.5) / LEAF_N, t1 = i / LEAF_N;
          up.push(`L ${(L * t0).toFixed(1)},${(-(h(t0) + 5)).toFixed(1)} L ${(L * t1).toFixed(1)},${(-h(t1)).toFixed(1)}`);
          dn.unshift(`L ${(L * t1).toFixed(1)},${h(t1).toFixed(1)} L ${(L * t0).toFixed(1)},${(h(t0) + 5).toFixed(1)}`);
        }
        return { d: `M 0,0 ${up.join(' ')} ${dn.join(' ')} L 0,0 Z`, tip: (i, sg) => [(L * (i - 0.5)) / LEAF_N, sg * (h((i - 0.5) / LEAF_N) + 5)] };
      };
      const beads = [];
      [[616, 362, -150, 150, 78], [624, 332, -30, 150, 78]].forEach(([bx, by, r, L, W]) => {
        const lg = S.place(g(gut), { x: bx, y: by, r });
        const T = toothD(L, W);
        el('path', { d: T.d, fill: '#4fae4a', stroke: '#2f7a3a', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, lg);
        el('line', { x1: 2, y1: 0, x2: L - 4, y2: 0, stroke: '#a8e39a', 'stroke-width': 2.5 }, lg);
        [0.25, 0.45, 0.65].forEach((f) => [-1, 1].forEach((sg) => el('path', { d: `M ${L * f},0 Q ${L * f + 14},${sg * 12} ${L * f + 26},${sg * 26}`, fill: 'none', stroke: '#a8e39a', 'stroke-width': 1.6 }, lg)));
        const ca = Math.cos((r * Math.PI) / 180), sa = Math.sin((r * Math.PI) / 180);
        const W2 = (lx, ly) => [bx + lx * ca - ly * sa, by + lx * sa + ly * ca];
        // 水珠掛在葉緣的鋸齒尖和葉尖（只取朝下的那一邊）
        const pts = [...[3, 5, 7].map((i) => T.tip(i, 1)), ...[3, 5, 7].map((i) => T.tip(i, -1)), [L, 0]].map(([lx, ly]) => W2(lx, ly));
        pts.forEach(([wx, wy]) => {
          const bd = S.place(g(gut), { x: wx, y: wy + 7, s: 0 });
          el('path', { d: DROP, fill: 'rgba(160,215,255,0.9)', stroke: '#e8f6ff', 'stroke-width': 1 }, bd);
          el('ellipse', { cx: -2, cy: 3, rx: 1.8, ry: 2.5, fill: '#fff', opacity: 0.8 }, bd);
          beads.push({ bd, x: wx, y: wy + 7 });
        });
      });
      const gutT = g(P4, { opacity: 0 });
      text(gutT, 620, 576, '空氣潮溼、根吸水多時，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(gutT, 620, 610, '水從葉緣或葉尖排出成水珠', { 'font-size': 22, 'text-anchor': 'middle', fill: C.water, 'font-weight': 700 });
      // (c) 仙人掌
      const cac = g(P4, { opacity: 0 });
      const cacIn = S.place(g(cac), { x: 342, y: 44, s: 0.7 });
      el('path', { d: 'M 800,560 L 800,230 C 800,180 880,180 880,230 L 880,560 Z', fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 5 }, cacIn);
      el('path', { d: 'M 800,400 L 760,400 C 730,400 720,380 720,350 L 720,300 C 720,280 750,280 750,300 L 750,360 L 800,360', fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 5 }, cacIn);
      el('path', { d: 'M 880,440 L 920,440 C 950,440 960,420 960,390 L 960,330 C 960,310 930,310 930,330 L 930,400 L 880,400', fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 5 }, cacIn);
      [820, 840, 860].forEach((x) => el('line', { x1: x, y1: 210, x2: x, y2: 556, stroke: '#3a6a30', 'stroke-width': 3 }, cacIn));
      const rs = S.rng(5);
      for (let i = 0; i < 22; i++) {
        const x = 806 + rs() * 68, y = 230 + rs() * 320;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => el('line', { x1: x, y1: y, x2: x + dx * 7, y2: y + dy * 7, stroke: '#f2e6c0', 'stroke-width': 2.5 }, cacIn));
      }
      el('rect', { x: 770, y: 556, width: 140, height: 18, rx: 6, fill: '#b0703c' }, cacIn);
      const call4 = [[930, 190, 1094, 178, '葉變成刺', '#f2e6c0'], [998, 300, 1094, 300, '莖能儲水', '#a8e39a'], [958, 400, 1094, 410, '角質層厚', '#cfe8ff']].map(([tx, ty, x, y, s, c]) => S.callout(P4, tx, ty, x, y, s, c, { size: 22 }));
      text(P4, 990, 600, '都能減少水分散失', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      tl.addLabel('s5');
      S.hide(tl, P3, 's5', 0.4);
      S.show(tl, P4, 's5+=0.3', 0.4);
      S.drive(tl, (u) => vaps.forEach((v, i) => { const k = (u * 3 + i / 3) % 1; S.place(v, { x: 135 + (i - 1) * 12, y: 290 - k * 60 }); v.style.opacity = u <= 0 ? 0.8 : Math.min(1, (1 - k) * 3); }), 3, 's5+=0.6', 'none');
      S.show(tl, arr4, 's5+=1.4', 0.3);
      S.show(tl, dry, 's5+=1.8', 0.4);
      S.show(tl, gut, 's5+=2.6', 0.4);
      S.drive(tl, (u) => beads.forEach((b, i) => { const k = S.smoothstep(i * 0.06, i * 0.06 + 0.45, u); S.place(b.bd, { x: b.x, y: b.y + 3 * k, s: 1.15 * k }); }), 2.2, 's5+=3', 'none');
      S.show(tl, gutT, 's5+=4.4', 0.4);
      S.show(tl, cac, 's5+=4.9', 0.4);
      call4.forEach((c, i) => S.show(tl, c, `s5+=${5.3 + i * 0.3}`, 0.3));

      // ===== 6 動物的水分調節 =====
      const P5 = g(root, { opacity: 0 });
      const FX5 = [40, 330, 620, 910], FW5 = 260;
      const fr5 = FX5.map((x) => { const f = g(P5, { opacity: 0 }); el('rect', { x, y: 90, width: FW5, height: 400, rx: 16, ...FRAME }, f); return f; });
      // 蜥蜴（鱗片）
      const liz = fr5[0];
      el('path', { d: 'M 170,140 C 186,140 192,162 186,184 C 196,230 196,300 186,350 C 182,380 176,420 172,470 C 168,420 160,380 156,350 C 146,300 146,230 156,184 C 150,162 156,140 170,140 Z', fill: '#7a8a3a', stroke: '#d9e08a', 'stroke-width': 3 }, liz);
      [[-1, 220], [1, 220], [-1, 320], [1, 320]].forEach(([s, y]) => el('path', { d: `M ${170 + s * 18},${y} L ${170 + s * 54},${y - 20} L ${170 + s * 64},${y - 6}`, fill: 'none', stroke: '#7a8a3a', 'stroke-width': 8, 'stroke-linecap': 'round' }, liz));
      for (let y = 200; y < 350; y += 14) for (let x = 156; x <= 184; x += 14) el('path', { d: `M ${x - 6},${y} q 6,6 12,0`, fill: 'none', stroke: '#d9e08a', 'stroke-width': 1.5 }, liz);
      // 甲蟲（外骨骼）
      const bug = fr5[1];
      el('ellipse', { cx: 460, cy: 330, rx: 62, ry: 90, fill: '#3a4a7a', stroke: '#9fb4ff', 'stroke-width': 4 }, bug);
      el('line', { x1: 460, y1: 250, x2: 460, y2: 420, stroke: '#9fb4ff', 'stroke-width': 3 }, bug);
      el('ellipse', { cx: 460, cy: 228, rx: 30, ry: 22, fill: '#3a4a7a', stroke: '#9fb4ff', 'stroke-width': 3 }, bug);
      [[-1, 290], [1, 290], [-1, 340], [1, 340], [-1, 390], [1, 390]].forEach(([s, y]) => el('path', { d: `M ${460 + s * 58},${y} L ${460 + s * 92},${y - 14} L ${460 + s * 104},${y + 10}`, fill: 'none', stroke: '#9fb4ff', 'stroke-width': 3 }, bug));
      el('path', { d: 'M 448,208 C 440,180 428,170 416,166 M 472,208 C 480,180 492,170 504,166', fill: 'none', stroke: '#9fb4ff', 'stroke-width': 3 }, bug);
      // 卵
      const egg = fr5[2];
      el('path', { d: 'M 750,170 C 800,170 830,250 830,320 C 830,380 796,420 750,420 C 704,420 670,380 670,320 C 670,250 700,170 750,170 Z', fill: '#efe6c8', stroke: '#fff7dd', 'stroke-width': 4 }, egg);
      [[720, 260], [770, 300], [736, 350], [790, 360], [760, 230]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 5, fill: '#c9b48a' }, egg));
      // 青蛙（皮膚溼潤）
      const frog = fr5[3];
      el('path', { d: 'M 1040,200 C 990,200 970,240 972,290 C 974,350 1002,380 1040,380 C 1078,380 1106,350 1108,290 C 1110,240 1090,200 1040,200 Z', fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 3 }, frog);
      [-1, 1].forEach((s) => {
        el('circle', { cx: 1040 + s * 22, cy: 212, r: 10, fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 2 }, frog);
        el('path', { d: `M ${1040 + s * 60},340 C ${1040 + s * 100},340 ${1040 + s * 104},380 ${1040 + s * 80},400 L ${1040 + s * 104},404`, fill: 'none', stroke: '#4f8a3f', 'stroke-width': 10, 'stroke-linecap': 'round' }, frog);
      });
      [[1010, 260], [1070, 280], [1030, 330]].forEach(([x, y]) => el('path', { d: DROP, fill: H2O, transform: `translate(${x},${y})` }, frog));
      [['爬蟲類', '鱗片或骨板'], ['昆蟲', '外骨骼'], ['鳥類、爬蟲類的卵', '有卵殼'], ['兩生類', '皮膚溼潤、易失水']].forEach(([n, s], i) => {
        const cx = FX5[i] + FW5 / 2;
        text(fr5[i], cx, 536, n, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
        text(fr5[i], cx, 574, s, { 'font-size': 24, 'text-anchor': 'middle', fill: i === 3 ? '#e8b04a' : C.hi });
      });
      const sum5 = g(P5, { opacity: 0 });
      S.pill(sum5, 450, 650, '前三種構造都能防止水分散失', { size: 24, color: C.hi, edge: C.hi });
      S.pill(sum5, 970, 650, '多住在潮溼的地方', { size: 24, color: '#e8b04a', edge: '#e8b04a' });
      tl.addLabel('s6');
      S.hide(tl, P4, 's6', 0.4);
      S.show(tl, P5, 's6+=0.3', 0.2);
      fr5.forEach((f, i) => S.show(tl, f, `s6+=${0.4 + i * 0.8}`, 0.4));
      S.show(tl, sum5, 's6+=3.8', 0.5);

      return {
        tl,
        notes: [
          '＊示意：細胞和分子都畫得很大。肺排出二氧化碳和水蒸氣，也和氣體的恆定有關（6-1）。糞便是沒有被消化吸收的食物殘渣（3-4），不是細胞代謝產生的廢物，所以排遺不屬於排泄。含氮廢物是蛋白質分解產生的氨，在肝臟轉變成尿素；無機鹽就是第三章說的礦物質，例如食鹽。',
          '＊示意：動物、水滴和圓點只表示多少的順序。毒性：氨 ＞ 尿素 ＞ 尿酸；排出時需要的水也是氨最多、尿酸最少。鳥糞中白色的部分主要就是尿酸：鳥類的尿酸和糞便從同一個開口一起排出；排出尿酸仍屬於排泄。',
          '＊示意：器官的位置和大小都簡化了；腎臟在腰部後方，左右各一。腎臟裡負責過濾的小單位叫腎元（補充）。健康的人尿中幾乎沒有葡萄糖。有用的物質送回血液，所以腎靜脈的尿素比腎動脈少。',
          '＊示意：皮膚剖面簡化了，汗腺畫得很大。汗嚐起來鹹鹹的，是因為含有無機鹽。',
          '＊示意：杯中尿液的多少和顏色只是比較。身體缺水時會覺得口渴，提醒我們喝水；腎臟如何調節尿量，高中會再學。',
          '＊示意：保衛細胞和水珠都畫得很大。泌液作用常在清晨看到，葉緣的水珠是植物自己排出的，不是露水。沙漠植物的葉變成刺、莖能儲水、角質層較厚。',
          '＊示意：動物都簡化了。兩生類的皮膚溼潤、容易失水，多生活在潮溼的地方；皮膚還能交換氣體（6-1）。',
        ],
        steps: [
          '細胞代謝會產生廢物：<b>二氧化碳</b>、<b>含氮廢物</b>，還有多餘的水和無機鹽。把它們排出體外，稱為<b>排泄</b>。',
          '蛋白質分解產生的<b>氨</b>有毒。許多水中的動物直接把氨排到水中；人和其他哺乳類在<b>肝臟</b>把氨變成<b>尿素</b>；鳥類、昆蟲排出<b>尿酸</b>。',
          '<b>泌尿系統</b>：腎臟 → 輸尿管 → 膀胱 → 尿道。血液流經<b>腎臟</b>時被過濾，尿素、多餘的水和無機鹽形成<b>尿液</b>。',
          '<b>皮膚</b>也能排泄：<b>汗腺</b>形成的<b>汗液</b>含有水、無機鹽和少量尿素，由汗孔排出。汗液蒸發時還會帶走熱（見 6-3）。',
          '<b>水分的恆定</b>：攝取和排出的水要保持平衡。喝水多，尿量<b>多</b>、顏色淡；流汗多或喝水少，尿量<b>少</b>、顏色深。',
          '缺水時，<b>保衛細胞</b>使<b>氣孔關閉</b>，減少水分散失；空氣潮溼、根吸水多時，水從葉緣或葉尖排出成水珠，叫做<b>泌液作用</b>。',
          '動物也有防止水分散失的構造：爬蟲類有<b>鱗片</b>或骨板、昆蟲有<b>外骨骼</b>，鳥類和爬蟲類的卵有<b>卵殼</b>。',
        ],
      };
    },
  });
})();
