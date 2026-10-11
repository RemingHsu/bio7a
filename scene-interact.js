/* 七下 5-2 生物間的互動關係：競爭、掠食（含數量變化）、寄生、片利共生、互利共生、比較表 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B5;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const GOOD = '#6fce62', BAD = '#ff8a7a', ZERO = '#b8c4cc';
  // ＋／－／０ 的圓形記號
  const badge = (p, x, y, k, r = 17) => {
    const col = k === '+' ? GOOD : k === '-' ? BAD : ZERO;
    el('circle', { cx: x, cy: y, r, fill: '#0d1822', stroke: col, 'stroke-width': 3 }, p);
    text(p, x, y + r * 0.42, k === '+' ? '＋' : k === '-' ? '－' : '０', { 'font-size': Math.max(20, r * 1.25), 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
  };
  // 角色標籤：記號 ＋ 文字
  const role = (p, x, y, k, str, size = 24) => {
    const rg = g(p);
    const w = S.textWidth(str, size) + 68, h = size * 2;
    el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h / 2, fill: 'rgba(13,24,34,.85)', stroke: k === '+' ? GOOD : k === '-' ? BAD : ZERO, 'stroke-width': 2 }, rg);
    badge(rg, x - w / 2 + 25, y, k, 15);
    text(rg, x - w / 2 + 50, y + size * 0.36, str, { 'font-size': size, fill: C.ink, 'font-weight': 700 });
    return rg;
  };
  const panel = (p, x, y, w, h, title) => {
    const pg = g(p, { opacity: 0 });
    el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME }, pg);
    if (title) text(pg, x + w / 2, y + 40, title, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
    return pg;
  };

  S.register({
    id: 'interact', section: '下5-2', title: '生物間的互動關係',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 競爭 =====
      const P0 = g(root);
      const c1 = panel(P0, 40, 70, 550, 500, '同種：麻雀爭奪食物');
      B.ground(c1, 42, 440, 546, 128, { fill: '#33291c', top: '#4f7a3a', seed: 3 });
      for (let k = 0; k < 30; k++) el('ellipse', { cx: 315 + ((k * 37) % 64) - 32, cy: 437 - (k % 4) * 4 - ((k * 13) % 7), rx: 6.5, ry: 4, fill: '#e8d090', stroke: '#9a8040', 'stroke-width': 1, transform: `rotate(${(k * 47) % 180} ${315 + ((k * 37) % 50) - 25} ${436 - (k % 4) * 3 - ((k * 13) % 7)})` }, c1);
      const spL = B.sparrow(c1, { x: 160, y: 442, s: 2.1 });
      const spR = B.sparrow(c1, { x: 470, y: 442, s: 2.1, flip: true });
      text(c1, 315, 520, '同一種生物需要的資源相同', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const c2 = panel(P0, 610, 70, 550, 500, '不同種：大樹和小草爭奪陽光');
      B.ground(c2, 612, 440, 546, 128, { fill: '#33291c', top: '#4f7a3a', seed: 5 });
      const sun0 = B.sun(c2, { x: 690, y: 170, rad: 30 });
      const shade = el('ellipse', { cx: 950, cy: 446, rx: 170, ry: 14, fill: '#000', opacity: 0 }, c2);
      B.tree(c2, { x: 950, y: 442, h: 300, w: 240, seed: 4 });
      [[700, 440, 1], [760, 442, 0.9], [1020, 444, 0.5], [1110, 442, 0.55]].forEach(([x, y, s], k) => B.grass(c2, { x, y, h: 40 * s, w: 34 * s, seed: k + 2 }));
      const rays0 = g(c2, { opacity: 0 });
      [[720, 200, 860, 230], [730, 214, 820, 330], [714, 220, 750, 400]].forEach(([x1, y1, x2, y2]) => B.arrow(rays0, x1, y1, x2, y2, { color: C.hi, w: 3, head: 12, dash: '10 7' }));
      text(c2, 885, 520, '樹下陰暗，小草長得稀少', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const res0 = g(P0, { opacity: 0 });
      ['食物', '水', '陽光', '生存空間', '配偶'].forEach((s, i, a) => S.pill(res0, 600 + (i - (a.length - 1) / 2) * 150, 610, s, { size: 24, color: C.ink, edge: '#4a6272' }));
      const k0 = g(P0, { opacity: 0 });
      role(k0, 600, 672, '-', '競爭：通常對雙方都不利', 26);
      tl.addLabel('s0');
      S.show(tl, c1, 's0+=0.2', 0.5);
      S.move(tl, spL, { x: 160, y: 442, s: 2.1 }, { x: 214, y: 442, s: 2.1 }, 1, 's0+=0.6');
      S.move(tl, spR, { x: 470, y: 442, s: 2.1 }, { x: 416, y: 442, s: 2.1 }, 1, 's0+=0.6');
      S.show(tl, c2, 's0+=1.6', 0.5);
      S.show(tl, rays0, 's0+=2.2', 0.5);
      tl.fromTo(shade, { opacity: 0 }, { opacity: 0.45, duration: 0.6, immediateRender: false }, 's0+=2.6');
      S.show(tl, res0, 's0+=3.4', 0.5);
      S.show(tl, k0, 's0+=4.2', 0.5);

      // ===== 1 掠食 =====
      const P1 = g(root, { opacity: 0 });
      const m1 = panel(P1, 40, 70, 550, 520, '老鷹捕食野兔');
      B.ground(m1, 42, 470, 546, 118, { fill: '#33291c', top: '#4f7a3a', seed: 7 });
      B.grass(m1, { x: 520, y: 470, h: 40, w: 40, seed: 4 }); B.grass(m1, { x: 110, y: 470, h: 34, w: 36, seed: 6 });
      const rab1 = B.rabbit(m1, { x: 380, y: 474, s: 0.9 });
      const hawk1 = B.hawkSwoop(m1, { x: 180, y: 232, s: 1.1, r: 30 });
      const m2 = panel(P1, 610, 70, 550, 520, '青蛙捕食蚱蜢');
      B.ground(m2, 612, 470, 546, 118, { fill: '#33291c', top: '#4f7a3a', seed: 9 });
      B.frog(m2, { x: 730, y: 474, s: 1.5 });
      const hop = B.grasshopper(m2, { x: 1040, y: 474, s: 0.8, flip: true });
      const tongue = el('line', { x1: 812, y1: 414, x2: 812, y2: 414, stroke: '#e8708a', 'stroke-width': 6, 'stroke-linecap': 'round' }, m2);
      const r1 = g(P1, { opacity: 0 });
      role(r1, 180, 640, '+', '掠食者：老鷹');
      role(r1, 450, 640, '-', '獵物：野兔');
      role(r1, 750, 640, '+', '掠食者：青蛙');
      role(r1, 1020, 640, '-', '獵物：蚱蜢');
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.2);
      S.show(tl, m1, 's1+=0.3', 0.5);
      S.move(tl, hawk1, { x: 180, y: 232, s: 1.1, r: 30 }, { x: 262, y: 330, s: 1.1, r: 30 }, 1.6, 's1+=0.8', 'power2.in');
      S.show(tl, m2, 's1+=1.8', 0.5);
      S.drive(tl, (u) => { tongue.setAttribute('x2', S.lerp(812, 1004, u)); tongue.setAttribute('y2', S.lerp(414, 452, u)); }, 0.5, 's1+=2.8', 'power2.out');
      S.show(tl, r1, 's1+=3.6', 0.5);

      // ===== 2 掠食者與獵物的數量變化 =====
      const P2 = g(root, { opacity: 0 });
      const AX = { x0: 110, x1: 720, y0: 560, y1: 110 };
      el('line', { x1: AX.x0, y1: AX.y0, x2: AX.x1, y2: AX.y0, stroke: C.ink2, 'stroke-width': 2.5 }, P2);
      el('line', { x1: AX.x0, y1: AX.y0, x2: AX.x0, y2: AX.y1, stroke: C.ink2, 'stroke-width': 2.5 }, P2);
      el('path', { d: `M ${AX.x1 + 12},${AX.y0} l -14,-7 l 0,14 Z M ${AX.x0},${AX.y1 - 12} l -7,14 l 14,0 Z`, fill: C.ink2 }, P2);
      text(P2, (AX.x0 + AX.x1) / 2, AX.y0 + 48, '時間＊', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      text(P2, AX.x0 + 14, AX.y1 + 6, '族群的個體數＊', { 'font-size': 26, fill: C.ink2 });
      const PREY = '#8fd0ff', PRED = '#ffb35c', PER = 0.5;
      const prey = (t) => 235 + 110 * Math.sin((2 * Math.PI * t) / PER), pred = (t) => 58 + 34 * Math.sin((2 * Math.PI * (t - PER / 4)) / PER);
      const xs = (t) => AX.x0 + 10 + t * (AX.x1 - AX.x0 - 40), ys = (n) => AX.y0 - n;
      const line = (f, col) => { let d = ''; for (let k = 0; k <= 160; k++) { const t = k / 160; d += `${k ? 'L' : 'M'} ${xs(t).toFixed(1)},${ys(f(t)).toFixed(1)} `; } return el('path', { d, fill: 'none', stroke: col, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, P2); };
      const lPrey = line(prey, PREY), lPred = line(pred, PRED);
      const lab2 = g(P2, { opacity: 0 });
      text(lab2, xs(0.125), ys(prey(0.125)) - 20, '獵物', { 'font-size': 26, fill: PREY, 'font-weight': 700, 'text-anchor': 'middle' });
      text(lab2, xs(0.25), ys(pred(0.25)) - 20, '掠食者', { 'font-size': 26, fill: PRED, 'font-weight': 700, 'text-anchor': 'middle' });
      const CY = [['1', '獵物多'], ['2', '掠食者食物充足，數量增加'], ['3', '獵物被吃得多，數量減少'], ['4', '掠食者食物不足，數量減少']];
      const cyc = CY.map(([n, s], i) => {
        const cg = g(P2, { opacity: 0 }), y = 150 + i * 110;
        el('circle', { cx: 790, cy: y - 8, r: 18, fill: 'none', stroke: C.hi, 'stroke-width': 2.5 }, cg);
        text(cg, 790, y, n, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        text(cg, 820, y, s, { 'font-size': 24, fill: i % 2 ? PRED : PREY });
        if (i < 3) B.arrow(cg, 790, y + 16, 790, y + 76, { color: C.mute, w: 3, head: 12 });
        return cg;
      });
      const back = g(P2, { opacity: 0 });
      el('path', { d: 'M 770,476 C 740,476 740,476 740,440 L 740,170 C 740,142 750,142 768,142', fill: 'none', stroke: C.mute, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, back);
      el('path', { d: 'M 772,142 l -14,-7 l 0,14 Z', fill: C.mute }, back);
      text(back, 820, 540, '……循環下去', { 'font-size': 22, fill: C.mute });
      const tip2 = g(P2, { opacity: 0 });
      S.pill(tip2, 600, 664, '掠食者和獵物的數量互相影響，大致維持平衡', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drawOn(tl, lPrey, 3.6, 's2+=0.7', 'none');
      S.drawOn(tl, lPred, 3.6, 's2+=0.7', 'none');
      S.show(tl, lab2, 's2+=1.2', 0.4);
      cyc.forEach((c, i) => S.show(tl, c, `s2+=${1.6 + i * 0.8}`, 0.4));
      S.show(tl, back, 's2+=4.8', 0.4);
      S.show(tl, tip2, 's2+=5.3', 0.4);

      // ===== 3 寄生 =====
      const P3 = g(root, { opacity: 0 });
      const p1 = panel(P3, 30, 70, 390, 500, '跳蚤：寄生在體表');
      B.ground(p1, 32, 470, 386, 98, { fill: '#33291c', top: '#4f7a3a', seed: 2 });
      B.dog(p1, { x: 190, y: 474, s: 1.25 });
      const ln = B.lens(p1, 330, 210, 66, 196, 396);
      el('rect', { x: 260, y: 230, width: 140, height: 50, fill: '#a87c48' }, ln.in);
      for (let k = 0; k < 10; k++) el('line', { x1: 268 + k * 14, y1: 234, x2: 262 + k * 14, y2: 160, stroke: '#c99a62', 'stroke-width': 3 }, ln.in);
      B.flea(ln.in, { x: 330, y: 205, s: 1.05 });
      const p2 = panel(P3, 430, 70, 340, 500, '菟絲子：寄生植物');
      B.ground(p2, 432, 470, 336, 98, { fill: '#33291c', top: '#4f7a3a', seed: 4 });
      B.dodderHost(p2, { x: 600, y: 474, h: 320 });
      text(p2, 600, 524, '黃色細莖纏繞寄主', { 'font-size': 22, 'text-anchor': 'middle', fill: '#f2c45a' });
      const p3 = panel(P3, 780, 70, 390, 500, '蛔蟲：寄生在腸道內');
      const hb = S.place(g(p3), { x: 975 - 600 * 0.62, y: 142 - 60 * 0.62, s: 0.62 });
      S.human(hb, { fill: 'rgba(52,96,122,0.45)', stroke: C.bodyEdge, sw: 2 });
      const dg = S.digestive(hb);
      S.stomach(dg.stomach, { stubs: false, wall: 6, shade: false, rugae: false });
      dg.stomach.setAttribute('opacity', 0.35);
      [dg.large, dg.eso, dg.liver, dg.pancreas, dg.mouth].forEach((e) => e.setAttribute('opacity', 0.35));
      dg.small.setAttribute('stroke', '#ffb07a'); dg.small.setAttribute('stroke-width', 6);
      const hl = S.callout(p3, 985, 142 - 60 * 0.62 + 345 * 0.62, 1112, 330, '小腸', '#ffb07a', { size: 22 });
      hl.style.opacity = 1;
      const r3 = g(P3, { opacity: 0 });
      role(r3, 420, 630, '+', '寄生者：跳蚤、菟絲子、蛔蟲');
      role(r3, 900, 630, '-', '寄主：被吸取養分');
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.2);
      [p1, p2, p3].forEach((p, i) => S.show(tl, p, `s3+=${0.4 + i * 1.2}`, 0.5));
      S.show(tl, r3, 's3+=4.2', 0.5);

      // ===== 4 片利共生 =====
      const P4 = g(root, { opacity: 0 });
      const q1 = panel(P4, 30, 70, 620, 500, '鮣魚與鯊魚');
      el('rect', { x: 32, y: 130, width: 616, height: 438, fill: 'rgba(40,110,170,0.25)' }, q1);
      B.shark(q1, { x: 330, y: 290, s: 1.45 });
      B.remora(q1, { x: 300, y: 349, s: 1.6 });
      const ql = B.lens(q1, 520, 462, 70, 330, 337);
      el('rect', { x: 440, y: 380, width: 170, height: 52, fill: '#cfd8de' }, ql.in);
      B.remora(ql.in, { x: 512, y: 446, s: 1.75 });
      text(q1, 520, 558, '鮣魚頭頂的吸盤', { 'font-size': 20, 'text-anchor': 'middle', fill: '#c9b89a' });
      const q2 = panel(P4, 670, 70, 500, 500, '附生植物（山蘇）與大樹');
      B.ground(q2, 672, 500, 496, 68, { fill: '#33291c', top: '#4f7a3a', seed: 8 });
      el('path', { d: 'M 880,500 C 884,380 878,260 884,200 L 966,200 C 972,260 966,380 972,500 Z', fill: '#6b4a2e', stroke: '#3e2a18', 'stroke-width': 2.5 }, q2);
      for (let k = 0; k < 7; k++) el('path', { d: `M ${894 + k * 11},${230 + (k % 3) * 20} q ${k % 2 ? 4 : -4},100 0,${240 - (k % 3) * 30}`, fill: 'none', stroke: '#4e3420', 'stroke-width': 2 }, q2);
      el('path', { d: 'M 905,240 C 880,210 840,196 790,190 M 950,236 C 980,206 1020,192 1060,186', fill: 'none', stroke: '#6b4a2e', 'stroke-width': 16, 'stroke-linecap': 'round' }, q2);
      el('path', { d: S.smoothPath(S.blobPts(918, 192, 196, 54, 72, [[7, 0.11, 1], [13, 0.05, 2]])), fill: '#3d8a3e', stroke: '#2a5f2c', 'stroke-width': 2.5 }, q2);
      [[-110, -8, 66, 26], [10, -16, 76, 24], [110, -4, 56, 22]].forEach(([dx, dy, rx, ry], k) => el('path', { d: S.smoothPath(S.blobPts(920 + dx, 190 + dy, rx, ry, 36, [[7, 0.12, k + 1]])), fill: '#55a84c', opacity: 0.75 }, q2));
      B.birdnestFern(q2, { x: 926, y: 340, len: 115, s: 1 });
      B.sun(q2, { x: 1105, y: 320, rad: 26 });
      const r4 = g(P4, { opacity: 0 });
      role(r4, 200, 630, '+', '鮣魚：跟著移動、吃剩食');
      role(r4, 500, 630, '0', '鯊魚：沒有影響');
      role(r4, 790, 630, '+', '山蘇：得到陽光');
      role(r4, 1050, 630, '0', '大樹：沒有影響');
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.2);
      S.show(tl, q1, 's4+=0.4', 0.5);
      S.show(tl, q2, 's4+=1.6', 0.5);
      S.show(tl, r4, 's4+=2.8', 0.5);

      // ===== 5 互利共生 =====
      const P5 = g(root, { opacity: 0 });
      const w1 = panel(P5, 30, 70, 370, 500, '豆科植物與根瘤菌');
      el('rect', { x: 32, y: 320, width: 366, height: 248, fill: '#33291c' }, w1);
      el('rect', { x: 32, y: 316, width: 366, height: 8, fill: '#4f7a3a' }, w1);
      B.legume(w1, { x: 140, y: 320, s: 1.15 });
      const lw1 = B.lens(w1, 300, 450, 66, 186, 405);
      // 根瘤的細胞：被感染的細胞裡充滿桿狀的根瘤菌
      const rr1 = S.rng(31);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
        const cx = 248 + c * 22 + (r % 2) * 11, cy = 398 + r * 21;
        el('rect', { x: cx - 10, y: cy - 9.5, width: 20, height: 19, rx: 4, fill: (r + c) % 3 ? '#c98a8a' : '#e8c8a8', stroke: '#8a5a4a', 'stroke-width': 1.2 }, lw1.in);
        if ((r + c) % 3) for (let j = 0; j < 14; j++) el('circle', { cx: cx - 7 + rr1() * 14, cy: cy - 6.5 + rr1() * 13, r: 1.4, fill: '#6a2a4a' }, lw1.in);
      }
      text(w1, 286, 548, '根瘤的細胞（放大）', { 'font-size': 20, 'text-anchor': 'middle', fill: '#e2b48e' });
      const w2 = panel(P5, 415, 70, 370, 500, '地衣（藻類＋真菌）');
      B.lichenRock(w2, { x: 600, y: 330, s: 1.5 });
      const lw2 = B.lens(w2, 600, 450, 76, 560, 260);
      for (let k = 0; k < 14; k++) el('path', { d: `M ${530 + ((k * 31) % 140)},${380 + ((k * 17) % 20)} C ${560 + ((k * 23) % 60)},${420 + ((k * 7) % 30)} ${540 + ((k * 41) % 90)},${470 + ((k * 13) % 30)} ${560 + ((k * 29) % 110)},${525}`, fill: 'none', stroke: '#e8e4d8', 'stroke-width': 3 }, lw2.in);
      [[570, 420], [620, 432], [590, 470], [640, 480], [560, 490], [615, 400], [655, 445]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 9, fill: '#6fce62', stroke: '#2f7a3a', 'stroke-width': 1.5 }, lw2.in));
      text(w2, 600, 552, '綠色：藻類　白色：真菌的菌絲', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      const w3 = panel(P5, 800, 70, 370, 500, '小丑魚與海葵');
      el('rect', { x: 802, y: 130, width: 366, height: 438, fill: 'rgba(40,110,170,0.25)' }, w3);
      B.anemone(w3, { x: 985, y: 548, s: 1.5, w: 100 });
      el('path', { d: 'M 802,568 L 802,510 C 840,500 880,506 910,512 C 940,520 960,526 985,524 C 1020,522 1040,512 1070,506 C 1110,498 1140,506 1168,512 L 1168,568 Z', fill: '#4a5a5a', stroke: '#2e3a3a', 'stroke-width': 2 }, w3);
      B.clownfish(w3, { x: 930, y: 300, s: 1.3 });
      B.clownfish(w3, { x: 1050, y: 360, s: 1.1, flip: true });
      const r5 = g(P5, { opacity: 0 });
      role(r5, 215, 616, '+', '植物得到含氮養分', 22);
      role(r5, 215, 668, '+', '根瘤菌得到養分', 22);
      role(r5, 600, 616, '+', '藻類：行光合作用', 22);
      role(r5, 600, 668, '+', '真菌：提供水分、保護', 22);
      role(r5, 985, 616, '+', '小丑魚：得到保護', 22);
      role(r5, 985, 668, '+', '海葵：被清潔', 22);
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.2);
      [w1, w2, w3].forEach((w, i) => S.show(tl, w, `s5+=${0.4 + i * 1.2}`, 0.5));
      S.show(tl, r5, 's5+=4', 0.5);

      // ===== 6 比較表 =====
      const P6 = g(root, { opacity: 0 });
      const leg = g(P6);
      [['+', '有利'], ['-', '有害'], ['0', '沒有影響']].forEach(([k, s], i) => { badge(leg, 380 + i * 190, 70, k, 17); text(leg, 406 + i * 190, 79, s, { 'font-size': 26, fill: C.ink }); });
      const COLX = [150, 430, 680, 950];
      el('rect', { x: 40, y: 110, width: 1120, height: 64, rx: 10, fill: '#18303f' }, P6);
      ['關係', '一方', '另一方', '例子'].forEach((s, i) => text(P6, COLX[i], 152, s, { 'font-size': 26, 'text-anchor': 'middle', fill: C.mute, 'font-weight': 700 }));
      const ROWS = [
        ['競爭', ['-', ''], ['-', ''], '大樹與小草、同種的麻雀'],
        ['掠食', ['+', '掠食者'], ['-', '獵物'], '老鷹與野兔'],
        ['寄生', ['+', '寄生者'], ['-', '寄主'], '跳蚤與狗、菟絲子'],
        ['片利共生', ['+', ''], ['0', ''], '鮣魚與鯊魚、山蘇與大樹'],
        ['互利共生', ['+', ''], ['+', ''], '豆科植物與根瘤菌、地衣'],
      ];
      const rows = ROWS.map(([n, a, b, ex], i) => {
        const rg = g(P6, { opacity: 0 }), y = 230 + i * 96;
        el('line', { x1: 40, y1: y + 48, x2: 1160, y2: y + 48, stroke: '#2b4252', 'stroke-width': 1.5 }, rg);
        text(rg, COLX[0], y + 10, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.ink });
        [a, b].forEach(([k, s], j) => {
          const x = COLX[1 + j];
          badge(rg, s ? x - 50 : x, y, k, 20);
          if (s) text(rg, x - 22, y + 9, s, { 'font-size': 24, fill: C.ink2 });
        });
        text(rg, COLX[3], y + 9, ex, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
        return rg;
      });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      rows.forEach((r, i) => S.show(tl, r, `s6+=${0.8 + i * 0.7}`, 0.4));

      return {
        tl,
        notes: [
          '例：榕樹下陽光少，水分和養分又被樹根吸收，地面的植物長得很稀少。同種的個體需要的資源最相近，競爭往往最激烈。',
          '掠食者通常有適合捕捉獵物的構造（例如老鷹銳利的爪和鉤狀的喙）；獵物也有逃避的方法（例如野兔跑得快、毛色和環境相近）。',
          '＊示意曲線，數值不是真實資料。掠食者的數量變化通常比獵物慢一些，數量也比較少。掠食者能控制獵物的數量，對生態系的平衡很重要。',
          '菟絲子幾乎沒有葉綠素，用細長的莖纏繞寄主，伸入寄主體內吸取養分。寄生者通常不會馬上殺死寄主；寄生在體表的叫外寄生，在體內的叫內寄生（補充）。',
          '鮣魚頭頂有吸盤，吸附在鯊魚身上，可以跟著移動、吃鯊魚吃剩的食物。山蘇長在樹幹上，能得到較多陽光，但不會吸取大樹的養分（和寄生不同）。',
          '根瘤菌住在豆科植物根部的根瘤中，能把空氣中的氮變成植物可以利用的含氮養分；植物提供根瘤菌養分。地衣中的藻類行光合作用製造養分，真菌提供水分和保護。小丑魚躲在海葵有刺絲胞的觸手間得到保護，也幫海葵清潔。',
          '寄生和掠食都是「一方有利、一方有害」：掠食通常把獵物吃掉；寄生者則長時間從寄主身上取得養分。',
        ],
        steps: [
          '生物爭奪有限的<b>資源</b>（食物、水、陽光、生存空間、配偶），稱為<b>競爭</b>。<b>同種</b>或<b>不同種</b>的生物之間都會競爭，通常對雙方都<b>不利</b>。',
          '一種動物<b>捕食</b>另一種動物，稱為<b>掠食</b>。捕食的一方是<b>掠食者</b>（得到食物，有利），被吃的一方是<b>獵物</b>（有害）。',
          '掠食者和獵物的數量會<b>互相影響</b>：獵物多 → 掠食者增加 → 獵物減少 → 掠食者因食物不足而減少 → 獵物又增加……',
          '<b>寄生</b>：寄生者生活在另一種生物（<b>寄主</b>）的體表或體內，吸取寄主的養分，對寄生者<b>有利</b>，對寄主<b>有害</b>。',
          '<b>片利共生</b>：兩種生物生活在一起，一方<b>得到好處</b>，另一方<b>沒有好處也沒有壞處</b>。例如鮣魚和鯊魚、山蘇和大樹。',
          '<b>互利共生</b>：兩種生物生活在一起，<b>雙方都得到好處</b>。例如豆科植物和<b>根瘤菌</b>、<b>地衣</b>（藻類和真菌）、小丑魚和海葵。',
          '比一比：用 <b>＋</b>（有利）、<b>－</b>（有害）、<b>０</b>（沒有影響）表示兩種生物各自受到的影響。',
        ],
      };
    },
  });
})();
