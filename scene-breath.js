/* 6-1 呼吸與氣體恆定：恆定性、呼吸作用與呼吸運動、呼吸系統（跨尺度、呼吸道的防護）、氣體交換、動植物的呼吸構造（植物：氣孔、皮孔、根）、呼吸運動、檢驗（BTB、石灰水、氯化亞鈷試紙）與氣體的恆定 */
(() => {
  const { el, g, text, C } = S;
  const AIR = '#9fd8ff', O2 = C.oxygen, CO2 = C.co2, LUNG = '#e58a9a', LUNG_E = '#ffc2cc', CAP = C.blood, VEIN = '#9b3b55';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const BTB = ['#2f6fd6', '#3fa64a', '#e3c53a'];
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const mol = (p, x, y, label, fill, r = 22) => {
    const m = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 2 }, m);
    text(m, 0, 7, label, { 'font-size': 20, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 });
    return m;
  };
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.7, y2: y2 - Math.sin(a) * head * 0.7, stroke: col, 'stroke-width': w }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  // 一行多色文字
  const tone = (p, x, y, parts, size = 22) => { const t = text(p, x, y, '', { 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700 }); parts.forEach(([str, c]) => { const sp = el('tspan', { fill: c }, t); sp.textContent = str; }); return t; };
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(S.lerp(v, B[i], t))).join(',')})`; };
  const btbCol = (u) => (u < 0.5 ? mix(BTB[0], BTB[1], u * 2) : mix(BTB[1], BTB[2], (u - 0.5) * 2));
  // 肺（人體座標）：左右兩葉
  const LUNG_L = 'M 596,190 C 580,182 558,192 553,222 C 549,246 551,262 557,266 C 570,262 585,259 596,259 Z';
  const LUNG_R = 'M 604,190 C 620,182 642,192 647,222 C 651,246 649,262 643,266 C 632,262 625,262 617,259 C 621,249 613,241 604,239 Z';

  S.register({
    id: 'breath', section: '6-1', title: '呼吸與氣體恆定',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 恆定性 =====
      const P0 = g(root);
      const b0 = S.place(g(P0), { x: 230 - 600 * 0.92, y: 30 - 60 * 0.92, s: 0.92 });
      S.human(b0, { fill: 'rgba(52,96,122,0.45)' });
      S.bodyOthers(b0);
      S.pill(P0, 815, 44, '恆定性：體內環境保持穩定', { size: 26, color: C.hi, edge: C.hi });
      const CARDS = [
        [470, 90, '氣體', '6-1', AIR, '血液中的氧和二氧化碳'],
        [830, 90, '水分', '6-2', C.water, '體內的水分和無機鹽'],
        [470, 375, '體溫', '6-3', '#ff9a5c', '人的體溫約 37 °C'],
        [830, 375, '血糖', '6-3', C.sugar, '血液中的葡萄糖'],
      ];
      const rnd0 = S.rng(3);
      const cards0 = CARDS.map(([x, y, name, sec, col, sub]) => {
        const c = g(P0, { opacity: 0 });
        el('rect', { x, y, width: 330, height: 255, rx: 16, ...FRAME }, c);
        text(c, x + 24, y + 46, name, { 'font-size': 30, 'font-weight': 700, fill: col });
        S.pill(c, x + 290, y + 36, sec, { size: 20, color: C.mute });
        el('rect', { x: x + 24, y: y + 110, width: 282, height: 64, rx: 6, fill: 'rgba(255,209,102,0.10)', stroke: 'rgba(255,209,102,0.35)', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, c);
        text(c, x + 306, y + 100, '正常範圍', { 'font-size': 20, 'text-anchor': 'end', fill: C.hi });
        let d = '';
        for (let i = 0; i <= 28; i++) { const px = x + 24 + i * 10, py = y + 142 + Math.sin(i * 0.7 + rnd0() * 1.2) * 11 + (rnd0() - 0.5) * 5; d += (i ? 'L' : 'M') + `${px.toFixed(1)},${py.toFixed(1)}`; }
        const line = el('path', { d, fill: 'none', stroke: col, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, c);
        text(c, x + 24, y + 222, sub, { 'font-size': 22, fill: C.mute });
        return { c, line };
      });
      const foot0 = text(P0, 815, 682, '外界環境改變時，身體會調節，讓這些狀態維持在正常範圍內', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2, opacity: 0 });
      tl.addLabel('s0');
      cards0.forEach(({ c, line }, i) => { S.show(tl, c, `s0+=${0.4 + i * 0.6}`, 0.4); S.drawOn(tl, line, 1.2, `s0+=${0.5 + i * 0.6}`); });
      S.show(tl, foot0, 's0+=3.2', 0.5);

      // ===== 1 呼吸運動 vs 呼吸作用 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 80, width: 540, height: 540, rx: 18, ...FRAME }, P1);
      el('rect', { x: 620, y: 80, width: 540, height: 540, rx: 18, ...FRAME }, P1);
      text(P1, 310, 130, '呼吸運動', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: AIR });
      text(P1, 310, 166, '吸氣、呼氣：讓空氣進出肺', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(P1, 890, 130, '呼吸作用', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: C.mito });
      text(P1, 890, 166, '細胞分解養分，釋放能量', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 左：上半身＋會脹縮的肺
      el('rect', { x: 40, y: 180, width: 540, height: 340 }, el('clipPath', { id: 'br1clip' }, el('defs', {}, P1)));
      const b1 = S.place(g(g(P1, { 'clip-path': 'url(#br1clip)' })), { x: 310 - 600 * 0.9, y: 196 - 60 * 0.9, s: 0.9 });
      S.human(b1, { fill: 'rgba(52,96,122,0.45)' });
      el('line', { x1: 600, y1: 128, x2: 600, y2: 196, stroke: AIR, 'stroke-width': 4, 'stroke-linecap': 'round' }, b1);
      const lungs1 = g(b1);
      [LUNG_L, LUNG_R].forEach((d) => el('path', { d, fill: LUNG, stroke: LUNG_E, 'stroke-width': 1.5, opacity: 0.85 }, lungs1));
      const inA = arrow(P1, 450, 236, 350, 236, AIR, 5, 18), outA = arrow(P1, 350, 270, 450, 270, CO2, 5, 18);
      const inT = text(P1, 460, 244, '吸氣', { 'font-size': 26, fill: AIR, 'font-weight': 700 });
      const outT = text(P1, 460, 278, '呼氣', { 'font-size': 26, fill: CO2, 'font-weight': 700 });
      text(P1, 310, 560, '胸腔脹大、縮小（肋骨、橫膈的運動）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P1, 310, 594, '是身體的動作', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 右：細胞、粒線體、分子
      el('path', { d: S.smoothPath(S.blobPts(880, 360, 182, 140)), fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 3 }, P1);
      el('circle', { cx: 790, cy: 262, r: 30, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 2.5 }, P1);
      const mito = S.place(g(P1), { x: 930, y: 370 });
      el('ellipse', { cx: 0, cy: 0, rx: 110, ry: 56, fill: C.mito, opacity: 0.85, stroke: '#ffd0b0', 'stroke-width': 3 }, mito);
      el('path', { d: 'M -84,0 C -74,-36 -60,36 -46,0 C -36,-36 -22,36 -8,0 C 2,-36 16,36 30,0 C 40,-36 54,36 68,0 C 74,-20 82,-10 88,0', fill: 'none', stroke: '#8a3f1c', 'stroke-width': 4 }, mito);
      text(P1, 930, 456, '粒線體', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mito, 'font-weight': 700 });
      const gluM = S.place(g(P1), { x: 660, y: 300 });
      el('path', { d: hexD(22), fill: 'rgba(255,207,92,0.3)', stroke: C.sugar, 'stroke-width': 4 }, gluM);
      const o2M = mol(P1, 660, 420, 'O₂', O2);
      const co2M = mol(P1, 930, 370, 'CO₂', CO2), h2oM = mol(P1, 930, 370, 'H₂O', C.water);
      co2M.style.opacity = 0; h2oM.style.opacity = 0;
      const bolt = g(P1, { opacity: 0 });
      el('path', { d: 'M 940,250 L 912,300 L 934,300 L 918,346 L 962,286 L 940,286 L 956,250 Z', fill: C.hi }, bolt);
      text(bolt, 968, 302, '能量', { 'font-size': 24, fill: C.hi, 'font-weight': 700 });
      const eq1 = g(P1, { opacity: 0 });
      el('rect', { x: 640, y: 526, width: 500, height: 76, rx: 14, fill: '#0f1c27', stroke: '#2b4252', 'stroke-width': 2 }, eq1);
      text(eq1, 890, 573, '葡萄糖 ＋ 氧 → 二氧化碳 ＋ 水 ＋ 能量', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const neq = g(P1, { opacity: 0 });
      S.pill(neq, 600, 672, '呼吸運動 ≠ 呼吸作用', { size: 28, color: C.hi, edge: C.hi });
      const breathe1 = (u) => {
        const ph = Math.sin(u * Math.PI * 4 - Math.PI / 2) * 0.5 + 0.5; // 兩次吸吐
        const sx = 1 + 0.13 * ph, sy = 1 + 0.1 * ph;
        lungs1.setAttribute('transform', `translate(600,226) scale(${sx.toFixed(3)},${sy.toFixed(3)}) translate(-600,-226)`);
        const dphase = Math.cos(u * Math.PI * 4 - Math.PI / 2);
        const inhale = u > 0 && u < 1 && dphase > 0;
        [inA, inT].forEach((e) => { e.style.opacity = u <= 0 || u >= 1 ? 1 : inhale ? 1 : 0.15; });
        [outA, outT].forEach((e) => { e.style.opacity = u <= 0 || u >= 1 ? 1 : !inhale ? 1 : 0.15; });
      };
      breathe1(0);
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.drive(tl, breathe1, 4, 's1+=0.7', 'none');
      S.drive(tl, (u) => {
        const a = S.smoothstep(0, 0.5, u);
        S.place(gluM, { x: S.lerp(660, 900, a), y: S.lerp(300, 362, a) }); gluM.style.opacity = a >= 1 ? 0 : 1;
        S.place(o2M, { x: S.lerp(660, 930, a), y: S.lerp(420, 382, a) }); o2M.style.opacity = a >= 1 ? 0 : 1;
        const b = S.smoothstep(0.55, 1, u);
        S.place(co2M, { x: S.lerp(930, 1116, b), y: S.lerp(370, 290, b) }); co2M.style.opacity = b > 0 ? 1 : 0;
        S.place(h2oM, { x: S.lerp(930, 1116, b), y: S.lerp(370, 440, b) }); h2oM.style.opacity = b > 0 ? 1 : 0;
      }, 3.2, 's1+=1', 'power1.inOut');
      S.show(tl, bolt, 's1+=2.8', 0.4);
      S.show(tl, eq1, 's1+=4.3', 0.5);
      S.show(tl, neq, 's1+=5', 0.5);

      // ===== 2 呼吸系統（跨尺度）=====
      const P2 = g(root, { opacity: 0 });
      const SC2 = 1.8, B2 = (x, y) => [270 + (x - 600) * SC2, 70 + (y - 60) * SC2];
      const b2 = S.place(g(P2), { x: 270 - 600 * SC2, y: 70 - 60 * SC2, s: SC2 });
      S.human(b2, { fill: 'rgba(44,82,104,0.35)', stroke: C.bodyEdge, sw: 1.2 });
      [LUNG_L, LUNG_R].forEach((d) => el('path', { d, fill: 'rgba(229,138,154,0.55)', stroke: LUNG_E, 'stroke-width': 1 }, b2));
      el('path', { d: 'M 600,104 L 600,196', stroke: AIR, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round', opacity: 0.35 }, b2);
      ['M 600,196 C 594,202 586,206 578,214', 'M 600,196 C 606,202 614,206 622,214', 'M 578,214 L 566,232 L 560,248', 'M 578,214 L 584,238', 'M 566,232 L 572,252', 'M 622,214 L 634,232 L 640,248', 'M 622,214 L 616,238', 'M 634,232 L 628,252']
        .forEach((d) => el('path', { d, stroke: AIR, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round', opacity: 0.8 }, b2));
      const way = el('path', { d: 'M 600,104 L 600,196 C 606,202 614,206 622,214 L 634,232 L 640,248', stroke: AIR, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }, b2);
      const air2 = [0, 1, 2].map(() => el('circle', { cx: 0, cy: 0, r: 2.6, fill: '#e8f6ff', opacity: 0 }, b2));
      const LBL2 = [['鼻', 600, 104, 110], ['咽', 600, 128, 170], ['喉', 600, 148, 230], ['氣管', 600, 176, 290], ['支氣管', 614, 205, 350], ['肺', 641, 222, 420]];
      const call2 = LBL2.map(([s, bx, by, y]) => { const [tx, ty] = B2(bx, by); return S.callout(P2, tx, ty, 540, y, s, AIR, { size: 24 }); });
      const lungSize = g(P2, { opacity: 0 });
      // 肺的長度不標數字（不是國中的重點）
      const FA = [640, 910], FW2 = 250;
      const fr2 = FA.map((x) => { const f = g(P2, { opacity: 0 }); el('rect', { x, y: 90, width: FW2, height: 430, rx: 16, ...FRAME }, f); return f; });
      // A：支氣管末端與成串的肺泡
      const fa = fr2[0];
      el('path', { d: 'M 765,110 L 765,210 M 765,210 L 705,290 M 765,210 L 765,360 M 765,210 L 830,290', stroke: AIR, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, fa);
      const bunch = (p, cx, cy, r = 15) => {
        [[0, 0], [-1.6, 0.6], [1.6, 0.6], [-0.9, 1.9], [0.9, 1.9], [0, 3], [-1.8, 2.6], [1.8, 2.6], [0, 1.2]].forEach(([dx, dy]) => el('circle', { cx: cx + dx * r, cy: cy + dy * r, r, fill: 'rgba(229,138,154,0.75)', stroke: LUNG_E, 'stroke-width': 2 }, p));
      };
      bunch(fa, 705, 300); bunch(fa, 765, 370); bunch(fa, 830, 300);
      el('path', { d: 'M 680,330 C 700,350 720,320 740,345 M 800,330 C 820,350 840,320 860,345 M 745,410 C 760,430 780,400 795,420', stroke: CAP, 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }, fa);
      // B：一個肺泡與微血管
      const fb = fr2[1];
      el('path', { d: 'M 1035,104 L 1035,200', stroke: AIR, 'stroke-width': 10, 'stroke-linecap': 'round' }, fb);
      el('circle', { cx: 1035, cy: 300, r: 96, fill: 'rgba(159,216,255,0.10)', stroke: LUNG_E, 'stroke-width': 4 }, fb);
      let ring = '';
      for (let i = 0; i <= 72; i++) { const a = (i / 72) * 6.283, rr = 108 + 5 * Math.sin(a * 9); ring += (i ? 'L' : 'M') + `${(1035 + Math.cos(a) * rr).toFixed(1)},${(300 + Math.sin(a) * rr).toFixed(1)}`; }
      el('path', { d: ring, fill: 'none', stroke: CAP, 'stroke-width': 5, 'stroke-dasharray': '120 30' }, fb);
      [0.5, 1.6, 2.7, 3.9, 5.1].forEach((a) => el('line', { x1: 1035 + Math.cos(a) * 98, y1: 300 + Math.sin(a) * 98, x2: 1035 + Math.cos(a) * 128, y2: 300 + Math.sin(a) * 128, stroke: CAP, 'stroke-width': 4 }, fb));
      text(fb, 1035, 308, '肺泡', { 'font-size': 26, 'text-anchor': 'middle', fill: AIR, 'font-weight': 700 });
      S.callout(fb, 1035 + Math.cos(2.1) * 110, 300 + Math.sin(2.1) * 110, 1035, 470, '微血管', CAP, { size: 22 }).style.opacity = 1;
      [['支氣管末端', '連著成串的肺泡'], ['一個肺泡', '約 0.2 mm＊']].forEach(([n, s], i) => {
        const cx = FA[i] + FW2 / 2;
        text(fr2[i], cx, 562, n, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        S.pill(fr2[i], cx, 604, s, { size: 22, color: i ? C.hi : C.ink2 });
      });
      const guard2 = g(P2, { opacity: 0 });
      S.pill(guard2, 900, 668, '鼻毛、黏液、纖毛：擋住灰塵和病菌', { size: 22, color: '#cfe8ff', edge: '#4a6272' });
      const zb = [[B2(634, 254), 24, FA[0]], [[830, 300], 70, FA[1]]].map(([[x, y], s, fx]) => {
        const zg = g(P2, { opacity: 0 });
        el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zg);
        [[y - s / 2, 90], [y + s / 2, 520]].forEach(([y1, y2]) => el('line', { x1: x + s / 2, y1, x2: fx, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zg));
        return zg;
      });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drawOn(tl, way, 3, 's2+=0.6', 'none');
      const wayL = way.getTotalLength();
      S.drive(tl, (u) => air2.forEach((a, i) => {
        const k = S.clamp(u * 1.2 - i * 0.1), q = way.getPointAtLength(wayL * k);
        a.setAttribute('cx', q.x); a.setAttribute('cy', q.y); a.style.opacity = k > 0 && k < 1 ? 1 : 0;
      }), 3, 's2+=0.6', 'none');
      [0, 0.18, 0.34, 0.55, 0.78, 0.98].forEach((f, i) => S.show(tl, call2[i], `s2+=${0.6 + f * 3}`, 0.3));
      S.show(tl, lungSize, 's2+=3.6', 0.4);
      S.show(tl, zb[0], 's2+=4', 0.3); S.show(tl, fr2[0], 's2+=4.2', 0.4);
      S.show(tl, zb[1], 's2+=5', 0.3); S.show(tl, fr2[1], 's2+=5.2', 0.4);
      S.show(tl, guard2, 's2+=5.8', 0.4);

      // ===== 3 氣體交換 =====
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 80, width: 540, height: 480, rx: 18, ...FRAME }, P3);
      el('rect', { x: 620, y: 80, width: 540, height: 480, rx: 18, ...FRAME }, P3);
      text(P3, 310, 124, '在肺：肺泡 ⇄ 微血管', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P3, 890, 124, '在全身：微血管 ⇄ 組織細胞', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const defs3 = el('defs', {}, P3);
      const grad = (id, a, b) => { const lg = el('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs3); el('stop', { offset: 0, 'stop-color': a }, lg); el('stop', { offset: 1, 'stop-color': b }, lg); };
      grad('br3a', VEIN, CAP); grad('br3b', CAP, VEIN);
      // 左：肺泡＋微血管
      el('rect', { x: 80, y: 150, width: 460, height: 170, rx: 30, fill: 'rgba(159,216,255,0.10)', stroke: LUNG_E, 'stroke-width': 4 }, P3);
      text(P3, 310, 190, '肺泡（空氣）', { 'font-size': 24, 'text-anchor': 'middle', fill: AIR });
      tone(P3, 310, 234, [['氧 ↓ 進入血液', O2], ['　　', C.ink], ['二氧化碳 ↑ 進入肺泡', CO2]]);
      el('rect', { x: 80, y: 360, width: 460, height: 80, rx: 40, fill: 'url(#br3a)', opacity: 0.35, stroke: CAP, 'stroke-width': 3 }, P3);
      text(P3, 90, 474, '缺氧血', { 'font-size': 20, fill: '#d98a9a' });
      text(P3, 530, 474, '充氧血', { 'font-size': 20, fill: CAP, 'text-anchor': 'end' });
      text(P3, 310, 474, '微血管 →', { 'font-size': 20, fill: C.ink2, 'text-anchor': 'middle' });
      // 右：微血管＋組織細胞
      el('rect', { x: 660, y: 150, width: 460, height: 80, rx: 40, fill: 'url(#br3b)', opacity: 0.35, stroke: CAP, 'stroke-width': 3 }, P3);
      text(P3, 890, 262, '微血管 →', { 'font-size': 20, fill: C.ink2, 'text-anchor': 'middle' });
      tone(P3, 890, 302, [['氧 ↓ 進入細胞', O2], ['　　', C.ink], ['二氧化碳 ↑ 進入血液', CO2]]);
      [740, 890, 1040].forEach((x) => {
        el('path', { d: S.smoothPath(S.blobPts(x, 390, 62, 64)), fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 2.5 }, P3);
        el('ellipse', { cx: x + 16, cy: 406, rx: 22, ry: 11, fill: C.mito, opacity: 0.8 }, P3);
        el('circle', { cx: x - 18, cy: 376, r: 13, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 2 }, P3);
      });
      text(P3, 890, 492, '組織細胞（進行呼吸作用）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.membrane });
      // 紅血球在微血管中流動
      const rbcs = [];
      for (let i = 0; i < 6; i++) rbcs.push({ e: el('ellipse', { cx: 0, cy: 0, rx: 14, ry: 9, fill: VEIN }, P3), lane: 'L', k: i / 6 });
      for (let i = 0; i < 6; i++) rbcs.push({ e: el('ellipse', { cx: 0, cy: 0, rx: 14, ry: 9, fill: CAP }, P3), lane: 'R', k: i / 6 });
      // 擴散的分子：[起點, 終點]
      const gas3 = [];
      [120, 230, 340, 445].forEach((x, i) => {
        gas3.push({ m: mol(P3, 0, 0, 'O₂', O2, 18), a: [x, 280], b: [x + 14, 400], ph: i * 0.23 });
        gas3.push({ m: mol(P3, 0, 0, 'CO₂', CO2, 20), a: [x + 62, 410], b: [x + 56, 270], ph: 0.5 + i * 0.21 });
      });
      [700, 860, 1010].forEach((x, i) => {
        gas3.push({ m: mol(P3, 0, 0, 'O₂', O2, 18), a: [x + 10, 190], b: [x + 40, 380], ph: i * 0.3 });
        gas3.push({ m: mol(P3, 0, 0, 'CO₂', CO2, 20), a: [x + 70, 400], b: [x + 80, 196], ph: 0.45 + i * 0.27 });
      });
      const flow3 = g(P3, { opacity: 0 });
      arrow(flow3, 400, 610, 800, 610, CAP, 4, 16);
      text(flow3, 600, 596, '血液經心臟送到全身（第四章）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const diff3 = g(P3, { opacity: 0 });
      S.pill(diff3, 600, 676, '擴散：氣體由濃度高的地方移到濃度低的地方', { size: 24, color: C.hi, edge: C.hi });
      const run3 = (u) => {
        rbcs.forEach((r) => {
          const k = (r.k + u * 2) % 1;
          if (r.lane === 'L') { r.e.setAttribute('cx', 100 + k * 420); r.e.setAttribute('cy', 400); r.e.setAttribute('fill', mix(VEIN, CAP, S.smoothstep(0.2, 0.8, k))); }
          else { r.e.setAttribute('cx', 680 + k * 420); r.e.setAttribute('cy', 190); r.e.setAttribute('fill', mix(CAP, VEIN, S.smoothstep(0.2, 0.8, k))); }
        });
        gas3.forEach((o) => {
          const k = (u * 2.2 + o.ph) % 1;
          S.place(o.m, { x: S.lerp(o.a[0], o.b[0], k), y: S.lerp(o.a[1], o.b[1], k) });
          o.m.style.opacity = u <= 0 || u >= 1 ? 0 : Math.min(1, k * 6, (1 - k) * 6, (1 - u) * 20);
        });
      };
      run3(0);
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drive(tl, run3, 5.5, 's3+=0.6', 'none');
      S.show(tl, flow3, 's3+=2.4', 0.4);
      S.show(tl, diff3, 's3+=3.4', 0.5);

      // ===== 4 動植物的呼吸構造 =====
      const P4 = g(root, { opacity: 0 });
      const FX4 = [40, 330, 620, 910], FW4 = 260;
      const fr4 = FX4.map((x) => { const f = g(P4, { opacity: 0 }); el('rect', { x, y: 90, width: FW4, height: 410, rx: 16, ...FRAME }, f); return f; });
      // 魚：鰓
      const fish = fr4[0];
      el('path', { d: 'M 90,300 C 120,240 200,232 240,272 L 278,240 L 272,300 L 278,360 L 240,328 C 200,368 120,360 90,300 Z', fill: '#4a7a9a', stroke: '#9cc6e0', 'stroke-width': 3 }, fish);
      el('circle', { cx: 112, cy: 290, r: 6, fill: '#0d1822' }, fish);
      el('path', { d: 'M 146,262 C 160,282 160,318 146,338', fill: 'none', stroke: '#9cc6e0', 'stroke-width': 4 }, fish);
      [272, 286, 300, 314, 328].forEach((y) => el('path', { d: `M 136,${y} q 8,-4 14,0`, fill: 'none', stroke: CAP, 'stroke-width': 4, 'stroke-linecap': 'round' }, fish));
      const water4 = g(fish);
      const wIn = arrow(water4, 54, 300, 86, 300, C.water, 4, 12), wOut = arrow(water4, 150, 344, 176, 392, C.water, 4, 12);
      text(fish, 60, 280, '水', { 'font-size': 20, fill: C.water });
      S.callout(fish, 142, 300, 170, 170, '鰓', CAP, { size: 24 }).style.opacity = 1;
      // 昆蟲：氣管
      const ins = fr4[1];
      el('ellipse', { cx: 400, cy: 300, rx: 24, ry: 22, fill: '#6b5a3a', stroke: '#d9c27c', 'stroke-width': 2 }, ins);
      el('ellipse', { cx: 450, cy: 300, rx: 30, ry: 26, fill: '#6b5a3a', stroke: '#d9c27c', 'stroke-width': 2 }, ins);
      el('ellipse', { cx: 528, cy: 300, rx: 52, ry: 32, fill: '#6b5a3a', stroke: '#d9c27c', 'stroke-width': 2 }, ins);
      [430, 452, 474].forEach((x, i) => [-1, 1].forEach((s) => el('path', { d: `M ${x},${300 + s * 22} L ${x - 14 + i * 10},${300 + s * 56} L ${x - 24 + i * 16},${300 + s * 74}`, fill: 'none', stroke: '#d9c27c', 'stroke-width': 3 }, ins)));
      el('path', { d: 'M 386,286 C 370,262 356,256 346,252 M 386,314 C 370,338 356,344 346,348', fill: 'none', stroke: '#d9c27c', 'stroke-width': 2.5 }, ins);
      el('path', { d: 'M 400,300 L 568,300 M 440,300 L 440,282 M 470,300 L 470,320 M 500,300 L 500,280 M 530,300 L 530,322 M 556,300 L 556,284 M 500,280 L 512,272 M 530,322 L 520,330', fill: 'none', stroke: AIR, 'stroke-width': 3, 'stroke-linecap': 'round' }, ins);
      [500, 530, 556].forEach((x) => el('circle', { cx: x, cy: 274 + (x % 2) * 0, r: 4, fill: '#e8f6ff' }, ins));
      S.callout(ins, 470, 300, 460, 170, '氣管', AIR, { size: 24 }).style.opacity = 1;
      text(ins, 460, 426, '空氣由身體兩側', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(ins, 460, 452, '的小孔進入氣管', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 青蛙：肺和皮膚
      const frog = fr4[2];
      el('path', { d: 'M 750,214 C 700,214 680,250 682,300 C 684,360 712,392 750,392 C 788,392 816,360 818,300 C 820,250 800,214 750,214 Z', fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 4, 'stroke-dasharray': '10 6' }, frog);
      el('circle', { cx: 728, cy: 226, r: 10, fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 2 }, frog);
      el('circle', { cx: 772, cy: 226, r: 10, fill: '#4f8a3f', stroke: '#a8e39a', 'stroke-width': 2 }, frog);
      [[-1, 0], [1, 0]].forEach(([s]) => {
        el('path', { d: `M ${750 + s * 60},350 C ${750 + s * 100},350 ${750 + s * 104},390 ${750 + s * 80},410 L ${750 + s * 104},414`, fill: 'none', stroke: '#4f8a3f', 'stroke-width': 10, 'stroke-linecap': 'round' }, frog);
        el('path', { d: `M ${750 + s * 60},262 L ${750 + s * 92},250 L ${750 + s * 98},228`, fill: 'none', stroke: '#4f8a3f', 'stroke-width': 8, 'stroke-linecap': 'round' }, frog);
        el('ellipse', { cx: 750 + s * 20, cy: 292, rx: 14, ry: 22, fill: LUNG, stroke: LUNG_E, 'stroke-width': 1.5 }, frog);
      });
      S.callout(frog, 770, 292, 838, 150, '肺', LUNG, { size: 24 }).style.opacity = 1;
      S.callout(frog, 690, 330, 676, 150, '皮膚', '#a8e39a', { size: 24 }).style.opacity = 1;
      text(frog, 750, 452, '皮膚要保持溼潤', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 植物：葉的氣孔、莖的皮孔、根的表皮細胞
      const pl = fr4[3], PX = 975;
      el('rect', { x: 920, y: 388, width: 240, height: 100, rx: 10, fill: '#3a2a1c' }, pl);
      ['M 975,390 L 975,474', 'M 975,410 C 962,424 948,440 936,464', 'M 975,420 C 986,436 994,452 1000,470'].forEach((d) => el('path', { d, fill: 'none', stroke: '#c9a97a', 'stroke-width': 4, 'stroke-linecap': 'round' }, pl));
      [[975, 474], [936, 464], [1000, 470]].forEach(([x, y]) => [-0.9, 0, 0.9].forEach((a) => el('line', { x1: x, y1: y, x2: x + Math.sin(a) * 9, y2: y + Math.cos(a) * 9 - 2, stroke: '#e8d8b0', 'stroke-width': 1.5 }, pl)));
      const leafB = (bx, by, r, L, W) => {
        const lg = S.place(g(pl), { x: bx, y: by, r });
        el('path', { d: `M 0,0 C ${L * 0.3},${-W / 2} ${L * 0.75},${-W / 2} ${L},0 C ${L * 0.75},${W / 2} ${L * 0.3},${W / 2} 0,0 Z`, fill: '#4fae4a', stroke: '#2f7a3a', 'stroke-width': 2.5 }, lg);
        el('line', { x1: 2, y1: 0, x2: L - 6, y2: 0, stroke: '#a8e39a', 'stroke-width': 2 }, lg);
      };
      leafB(PX + 6, 218, -35, 100, 44);
      leafB(PX - 6, 262, -145, 60, 30);
      el('rect', { x: PX - 8, y: 168, width: 16, height: 224, rx: 6, fill: '#7a5a3a', stroke: '#a8845a', 'stroke-width': 2 }, pl);
      el('path', { d: `M ${PX - 3},${180} q 4,40 0,80 q -4,40 0,90`, fill: 'none', stroke: '#5a4028', 'stroke-width': 1.5 }, pl);
      [236, 300, 344].forEach((y) => el('ellipse', { cx: PX + 1, cy: y, rx: 5, ry: 2.2, fill: '#e8d8b0' }, pl));
      // 頂芽和兩片張開的幼葉
      leafB(PX - 2, 166, -62, 26, 12); leafB(PX + 2, 166, -118, 26, 12);
      el('path', { d: `M ${PX},140 C ${PX + 7},150 ${PX + 7},160 ${PX},170 C ${PX - 7},160 ${PX - 7},150 ${PX},140 Z`, fill: '#8be07a', stroke: '#2f7a3a', 'stroke-width': 2 }, pl);
      [[1036, 182, 1094, 120, '葉：氣孔', '#a8e39a'], [PX + 6, 300, 1094, 280, '莖：皮孔', '#e8d8b0'], [1000, 466, 1078, 432, '根：表皮細胞', '#c9a97a']]
        .forEach(([tx, ty, x, y, s2, c]) => { S.callout(pl, tx, ty, x, y, s2, c, { size: 20 }).style.opacity = 1; });
      [['魚', '用鰓'], ['昆蟲', '用氣管'], ['青蛙', '用肺和皮膚'], ['植物', '氣孔、皮孔、根']].forEach(([n, s], i) => {
        const cx = FX4[i] + FW4 / 2;
        text(fr4[i], cx, 548, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        text(fr4[i], cx, 586, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi });
      });
      const common4 = g(P4, { opacity: 0 });
      S.pill(common4, 600, 664, '共同點：交換氣體的表面溼潤、面積大，氣體容易擴散', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.2);
      fr4.forEach((f, i) => S.show(tl, f, `s4+=${0.4 + i * 0.9}`, 0.4));
      S.drive(tl, (u) => { const k = (u * 4) % 1; [wIn, wOut].forEach((a) => { a.style.opacity = 0.35 + 0.65 * Math.sin(k * Math.PI); }); }, 4, 's4+=0.6', 'none');
      S.show(tl, common4, 's4+=4.2', 0.5);

      // ===== 5 呼吸運動 =====
      const P5 = g(root, { opacity: 0 });
      const CX = 330;
      const lungs5 = [el('path', { fill: LUNG, opacity: 0.8, stroke: LUNG_E, 'stroke-width': 3 }, P5), el('path', { fill: LUNG, opacity: 0.8, stroke: LUNG_E, 'stroke-width': 3 }, P5)];
      el('path', { d: `M ${CX},70 L ${CX},200 M ${CX},200 C ${CX - 10},212 ${CX - 30},222 ${CX - 54},236 M ${CX},200 C ${CX + 10},212 ${CX + 30},222 ${CX + 54},236`, stroke: AIR, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, P5);
      const ribs = [];
      for (let k = 0; k < 6; k++) [-1, 1].forEach((s) => ribs.push({ e: el('path', { fill: 'none', stroke: '#e8dcc0', 'stroke-width': 9, 'stroke-linecap': 'round' }, P5), k, s }));
      el('rect', { x: CX - 9, y: 232, width: 18, height: 190, rx: 8, fill: '#e8dcc0' }, P5); // 胸骨
      const dia = el('path', { fill: 'none', stroke: C.muscle, 'stroke-width': 10, 'stroke-linecap': 'round' }, P5);
      const airIn = arrow(P5, CX + 50, 70, CX + 50, 150, AIR, 6, 18), airOut = arrow(P5, CX - 50, 150, CX - 50, 70, CO2, 6, 18);
      const lab5 = [
        S.callout(P5, CX - 160, 270, 70, 230, '肋骨', '#e8dcc0', { size: 24 }),
        S.callout(P5, CX - 90, 380, 70, 380, '肺', LUNG, { size: 24 }),
        S.callout(P5, CX - 150, 528, 70, 600, '橫膈', C.muscle, { size: 24 }),
      ];
      const col5 = [['吸氣', AIR, ['肋骨上舉', '橫膈收縮、下降', '胸腔變大', '肺內氣壓變小', '空氣進入肺']], ['呼氣', CO2, ['肋骨下降', '橫膈舒張、上升', '胸腔變小', '肺內氣壓變大', '空氣排出']]].map(([h, col, rows], i) => {
        const cg = g(P5, { opacity: 0 }), ig = g(cg); // 外層淡入，內層由動畫調亮暗
        const x = 650 + i * 270;
        el('rect', { x, y: 90, width: 250, height: 470, rx: 16, fill: '#122230', stroke: col, 'stroke-width': 2 }, ig);
        text(ig, x + 125, 146, h, { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        rows.forEach((r, k) => text(ig, x + 125, 220 + k * 72, r, { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink }));
        return { cg, ig };
      });
      const note5 = g(P5, { opacity: 0 });
      S.pill(note5, 905, 640, '肺沒有肌肉，跟著胸腔變大、變小', { size: 24, color: C.hi, edge: C.hi });
      const draw5 = (v) => { // v：0 呼氣狀態、1 吸氣狀態
        ribs.forEach(({ e, k, s }) => {
          const y0 = 214 + k * 50 - 14 * v, w = (150 + k * 6) * (1 + 0.07 * v);
          e.setAttribute('d', `M ${CX + s * 12},${y0} C ${CX + s * w * 0.55},${y0 - 22 + 8 * v} ${CX + s * w},${y0 - 8} ${CX + s * w * 1.02},${y0 + 46 - 14 * v}`);
        });
        const base = 520 + 34 * v, apex = 430 + 76 * v;
        dia.setAttribute('d', `M ${CX - 178},${base} C ${CX - 120},${apex - 20} ${CX + 120},${apex - 20} ${CX + 178},${base}`);
        [-1, 1].forEach((s, i) => {
          const w = 128 * (1 + 0.1 * v), top = 216 - 10 * v, bot = apex - 12 + (base - apex) * 0.25;
          lungs5[i].setAttribute('d', `M ${CX + s * 22},${top + 20} C ${CX + s * 40},${top - 10} ${CX + s * w * 0.9},${top} ${CX + s * w},${top + 120} C ${CX + s * (w + 8)},${bot - 40} ${CX + s * w},${bot + 20} ${CX + s * (w - 30)},${bot + 26} C ${CX + s * 70},${bot - 6} ${CX + s * 40},${bot - 10} ${CX + s * 22},${bot - 14} Z`);
        });
      };
      draw5(0);
      airIn.style.opacity = 0; airOut.style.opacity = 0;
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      lab5.forEach((l, i) => S.show(tl, l, `s5+=${0.5 + i * 0.25}`, 0.3));
      col5.forEach(({ cg }, i) => S.show(tl, cg, `s5+=${0.8 + i * 0.3}`, 0.4));
      S.drive(tl, (u) => {
        const inh = u < 0.5, v = inh ? S.smoothstep(0, 0.42, u) : 1 - S.smoothstep(0.55, 0.97, u);
        draw5(v);
        airIn.style.opacity = u > 0.02 && u < 0.45 ? 1 : 0;
        airOut.style.opacity = u > 0.55 && u < 0.98 ? 1 : 0;
        const live = u > 0 && u < 1;
        col5[0].ig.style.opacity = live && !inh ? 0.35 : 1;
        col5[1].ig.style.opacity = live && inh ? 0.35 : 1;
      }, 5, 's5+=1.6', 'none');
      S.show(tl, note5, 's5+=6.4', 0.5);

      // ===== 6 檢驗呼出的氣體＋氣體的恆定 =====
      const P6 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 80, width: 500, height: 570, rx: 18, ...FRAME }, P6);
      el('rect', { x: 580, y: 80, width: 580, height: 570, rx: 18, ...FRAME }, P6);
      text(P6, 290, 126, '檢驗呼出的氣體', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P6, 870, 126, '氣體的恆定', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const tube6 = (x, fill, id) => {
        const tg = g(P6);
        el('path', { d: `M ${x - 30},210 L ${x - 30},450 C ${x - 30},490 ${x + 30},490 ${x + 30},450 L ${x + 30},210 Z` }, el('clipPath', { id }, el('defs', {}, tg)));
        const liq = el('rect', { x: x - 32, y: 314, width: 64, height: 190, fill, 'clip-path': `url(#${id})` }, tg);
        el('path', { d: `M ${x - 36},204 L ${x - 30},210 L ${x - 30},450 C ${x - 30},490 ${x + 30},490 ${x + 30},450 L ${x + 30},210 L ${x + 36},204`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, tg);
        el('line', { x1: x + 6, y1: 186, x2: x + 6, y2: 462, stroke: '#e8f0f2', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 }, tg);
        arrow(tg, x + 6, 146, x + 6, 180, AIR, 4, 12);
        text(tg, x + 22, 168, '吹氣', { 'font-size': 20, fill: AIR });
        const bubs = [0, 1, 2, 3, 4].map(() => el('circle', { cx: 0, cy: 0, r: 5, fill: 'none', stroke: '#e8f6ff', 'stroke-width': 2, opacity: 0 }, tg));
        return { liq, bubs, x };
      };
      const tA = tube6(125, BTB[0], 'br6a'), tB = tube6(290, 'rgba(220,235,245,0.22)', 'br6b');
      // BTB 多一行說明：三行排緊一點，和下方的結論標籤保持距離
      text(P6, 125, 532, 'BTB 溶液', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P6, 125, 560, '（溴瑞香草藍）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const resA = text(P6, 125, 587, '藍 → 綠 → 黃', { 'font-size': 22, 'text-anchor': 'middle', fill: C.sugar, opacity: 0 });
      text(P6, 290, 534, '澄清石灰水', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const resB = text(P6, 290, 568, '變混濁', { 'font-size': 22, 'text-anchor': 'middle', fill: '#f2f2f2', opacity: 0 });
      // 氯化亞鈷試紙：對著乾燥（藍色）的試紙呼氣，遇到水蒸氣變成粉紅色
      const CB = 455;
      arrow(P6, CB, 146, CB, 226, AIR, 4, 12);
      text(P6, CB + 16, 168, '呼氣', { 'font-size': 20, fill: AIR });
      const paper = el('rect', { x: CB - 24, y: 252, width: 48, height: 190, rx: 4, fill: '#2f6fd6', stroke: '#cfe8ff', 'stroke-width': 2 }, P6);
      el('rect', { x: CB - 14, y: 238, width: 28, height: 22, rx: 4, fill: '#8aa1ae', stroke: '#cfe8ff', 'stroke-width': 1.5 }, P6);
      const vap6 = [0, 1, 2, 3].map(() => el('circle', { cx: CB, cy: 0, r: 7, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 2, 'stroke-dasharray': '4 3', opacity: 0 }, P6));
      text(P6, CB, 534, '氯化亞鈷試紙', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const resC = text(P6, CB, 568, '藍 → 粉紅', { 'font-size': 22, 'text-anchor': 'middle', fill: '#f4a6c4', opacity: 0 });
      const conc6 = g(P6, { opacity: 0 });
      S.pill(conc6, 290, 624, '呼出的氣體含較多二氧化碳和水蒸氣', { size: 22, color: C.hi, edge: C.hi });
      const FLOW = ['運動：細胞的呼吸作用旺盛', '血液中的二氧化碳增加', '腦幹：使呼吸加快、加深', '排出較多的二氧化碳', '二氧化碳回到正常範圍'];
      const flow6 = FLOW.map((s, i) => {
        const fg = g(P6, { opacity: 0 });
        S.pill(fg, 870, 180 + i * 64, s, { size: 22, color: i === 2 ? C.hi : C.ink, edge: i === 2 ? C.hi : '#4a6272' });
        if (i) arrow(fg, 870, 180 + i * 64 - 44, 870, 180 + i * 64 - 20, C.ink2, 3, 10);
        return fg;
      });
      // 呼吸曲線（示意）
      const trace = g(P6, { opacity: 0 });
      text(trace, 610, 506, '呼吸（示意）＊', { 'font-size': 20, fill: C.mute });
      el('line', { x1: 610, y1: 580, x2: 1130, y2: 580, stroke: '#2b4252', 'stroke-width': 1.5 }, trace);
      let td = '', ph = 0;
      for (let x = 610; x <= 1130; x += 2) {
        const ex = S.smoothstep(760, 800, x) * (1 - S.smoothstep(960, 1060, x));
        ph += (2 * Math.PI / 52) * (1 + 1.1 * ex);
        td += (x === 610 ? 'M' : 'L') + `${x},${(580 - Math.sin(ph) * (16 + 26 * ex)).toFixed(1)}`;
      }
      const tPath = el('path', { d: td, fill: 'none', stroke: AIR, 'stroke-width': 3 }, trace);
      el('rect', { x: 770, y: 494, width: 230, height: 136, rx: 8, fill: 'rgba(255,209,102,0.06)' }, trace);
      text(trace, 885, 516, '運動中', { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      S.drive(tl, (u) => {
        tA.liq.setAttribute('fill', btbCol(S.smoothstep(0.1, 0.95, u)));
        tB.liq.setAttribute('fill', `rgba(${Math.round(S.lerp(220, 238, u))},${Math.round(S.lerp(235, 238, u))},${Math.round(S.lerp(245, 236, u))},${S.lerp(0.22, 0.85, S.smoothstep(0.15, 0.9, u)).toFixed(2)})`);
        paper.setAttribute('fill', mix('#2f6fd6', '#f4a6c4', S.smoothstep(0.2, 0.9, u)));
        vap6.forEach((v, i) => { const k = (u * 4 + i / 4) % 1; v.setAttribute('cx', CB + Math.sin(k * 9 + i) * 10); v.setAttribute('cy', S.lerp(160, 262, k)); v.style.opacity = u > 0.02 && u < 0.98 ? 0.9 * (1 - k) : 0; });
        [tA, tB].forEach((t) => t.bubs.forEach((b, i) => {
          const k = (u * 5 + i / 5) % 1;
          b.setAttribute('cx', t.x + 6 + Math.sin(k * 12 + i) * 6); b.setAttribute('cy', S.lerp(456, 324, k));
          b.style.opacity = u > 0.02 && u < 0.98 ? 0.9 : 0;
        }));
      }, 3, 's6+=0.7', 'none');
      S.show(tl, [resA, resB, resC], 's6+=3.4', 0.4);
      S.show(tl, conc6, 's6+=3.7', 0.4);
      flow6.forEach((f, i) => S.show(tl, f, `s6+=${4 + i * 0.4}`, 0.35));
      S.show(tl, trace, 's6+=4', 0.3);
      S.drawOn(tl, tPath, 2.4, 's6+=4.1', 'none');

      return {
        tl,
        notes: [
          '＊示意：曲線只表示「在正常範圍內小幅變動」，不是真實數據。這一章依序介紹氣體（6-1）、水分（6-2）、體溫和血糖（6-3）的恆定。',
          '＊示意：分子和粒線體都畫得很大。所有活細胞（包括植物細胞）不論白天或晚上都會進行呼吸作用；有些課本把反應式寫成「養分＋氧 → 二氧化碳＋水＋能量」。',
          '＊大小為約略值。咽是食物和空氣共同經過的通道（見 3-4）；喉裡有聲帶（補充）。兩個肺共約有 3～5 億個肺泡＊，總表面積很大；肺泡壁和微血管壁都很薄。鼻毛、呼吸道的黏液和纖毛能擋住灰塵和病菌，纖毛把沾了灰塵的黏液往喉部推，咳出來就是痰。',
          '＊示意：分子和紅血球都畫得很大。血液在心臟和血管中如何流動（肺循環、體循環），見第四章。',
          '＊示意：構造都簡化了。蚯蚓也是用溼潤的皮膚交換氣體。植物沒有呼吸運動，氣體靠擴散進出；大多數陸生植物的根如果泡水太久，會缺氧而無法進行呼吸作用，甚至死亡。動物交換氣體的表面都溼潤、面積大。',
          '＊示意：構造簡化了，肋骨在前後左右都有。肋骨的上舉和下降，靠肋骨之間的肌肉（補充：肋間肌）。',
          '＊示意：呼吸曲線不是真實數據。BTB（溴瑞香草藍）是一種指示劑，在接近中性（pH 約 7）時會變色，用來檢驗溶液中的二氧化碳：二氧化碳溶在水中呈弱酸性，使 BTB 由藍色經綠色變成黃色。石灰水遇到二氧化碳會變混濁；氯化亞鈷試紙要先烘乾（藍色），遇到水會變成粉紅色。運動時細胞產生較多二氧化碳；腦幹的功能見 5-1。',
        ],
        steps: [
          '生物體能維持體內環境（例如<b>氣體</b>、<b>水分</b>、<b>體溫</b>、<b>血糖</b>）的穩定，稱為<b>恆定性</b>。偏離正常範圍時，身體靠<b>神經系統</b>和<b>內分泌系統</b>協調，加以調節。',
          '<b>呼吸運動</b>是吸氣和呼氣，讓空氣進出肺；<b>呼吸作用</b>是細胞利用氧分解葡萄糖，產生二氧化碳和水並<b>釋放能量</b>，主要在<b>粒線體</b>中進行。',
          '空氣的路徑：鼻 → 咽 → 喉 → 氣管 → 支氣管 → 肺。支氣管在肺中越分越細，末端連著許多<b>肺泡</b>，肺泡外面包著<b>微血管</b>。',
          '<b>氣體交換</b>靠<b>擴散</b>：在肺泡，氧進入微血管、二氧化碳進入肺泡；在全身各處，氧從微血管進入組織細胞，二氧化碳從細胞進入微血管。',
          '其他生物也有交換氣體的構造：魚用<b>鰓</b>、昆蟲用<b>氣管</b>、青蛙用肺和<b>皮膚</b>。植物沒有呼吸器官，經由葉的<b>氣孔</b>、莖的<b>皮孔</b>和根的<b>表皮細胞</b>交換氣體。',
          '<b>吸氣</b>：肋骨上舉、橫膈下降，胸腔變大，空氣進入肺。<b>呼氣</b>：肋骨下降、橫膈上升，胸腔變小，空氣排出。',
          '呼出的氣體使 <b>BTB</b> 由藍變黃、<b>石灰水</b>變混濁（含較多<b>二氧化碳</b>），使<b>氯化亞鈷試紙</b>由藍變粉紅（含<b>水蒸氣</b>）。運動時，<b>腦幹</b>使呼吸加快加深。',
        ],
      };
    },
  });
})();
