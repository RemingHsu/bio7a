/* 七下 5-4 生態系的類型：陸域與水域、森林／草原／沙漠、沙漠生物的適應、臺灣森林隨海拔改變、淡水、海洋、河口與紅樹林 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B5;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const SAND = '#c9a66a', SEA = 'rgba(40,110,170,0.35)', MUD = '#4a3a2a';

  // 裁切成圓角框的小場景
  const box = (p, x, y, w, h, bg) => {
    const id = B.id('bx'), bg0 = g(p);
    el('rect', { x, y, width: w, height: h, rx: 14 }, el('clipPath', { id }, el('defs', {}, bg0)));
    el('rect', { x, y, width: w, height: h, rx: 14, fill: bg || '#122230' }, bg0);
    const c = g(bg0, { 'clip-path': `url(#${id})` });
    el('rect', { x, y, width: w, height: h, rx: 14, fill: 'none', stroke: '#2b4252', 'stroke-width': 2 }, bg0);
    bg0.in = c;
    return bg0;
  };
  // 雨量：雲＋雨滴數
  const rainGauge = (p, x, y, n) => {
    const r = g(p);
    B.cloud(r, { x, y, w: 110, fill: n ? '#b8c4cc' : '#8aa1ae' });
    for (let k = 0; k < n; k++) el('line', { x1: x - 40 + k * (80 / Math.max(1, n - 1)), y1: y + 30 + (k % 2) * 10, x2: x - 46 + k * (80 / Math.max(1, n - 1)), y2: y + 52 + (k % 2) * 10, stroke: '#5fb8ff', 'stroke-width': 3, 'stroke-linecap': 'round' }, r);
    return r;
  };

  S.register({
    id: 'biomes', cards: true, section: '下5-4', title: '生態系的類型',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 陸域與水域 =====
      const P0 = g(root);
      const sides = [[40, '陸域生態系', '依雨量、溫度等區分', '#9be58c'], [610, '水域生態系', '依水中的鹽分多少區分', '#8fd0ff']].map(([x, t, s, col]) => {
        const sg = g(P0, { opacity: 0 });
        el('rect', { x, y: 60, width: 550, height: 600, rx: 18, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': '10 7' }, sg);
        text(sg, x + 275, 106, t, { 'font-size': 32, 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
        text(sg, x + 275, 640, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
        return sg;
      });
      const MINI = [];
      const mini = (side, i, name, draw, bg) => {
        const x = (side ? 630 : 60) + i * 172, b = box(sides[side], x, 130, 160, 400, bg);
        draw(b.in, x, 130);
        text(sides[side], x + 80, 572, name, { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        MINI.push(b);
      };
      mini(0, 0, '森林', (c, x, y) => { el('rect', { x, y: y + 330, width: 160, height: 70, fill: '#2a3a22' }, c); B.tree(c, { x: x + 62, y: y + 336, h: 230, w: 116, seed: 2 }); B.conifer(c, { x: x + 118, y: y + 338, h: 250, w: 70 }); B.shrub(c, { x: x + 90, y: y + 340, w: 70, h: 40 }); });
      mini(0, 1, '草原', (c, x, y) => { el('rect', { x, y: y + 330, width: 160, height: 70, fill: '#3a4a26' }, c); for (let k = 0; k < 5; k++) B.grass(c, { x: x + 18 + k * 31, y: y + 334, h: 56, w: 30, seed: k + 1, colors: ['#8ab84a', '#a8c860', '#7aa840'] }); B.rabbit(c, { x: x + 70, y: y + 372, s: 0.38 }); B.hawkFly(c, { x: x + 90, y: y + 120, s: 0.45 }); });
      mini(0, 2, '沙漠', (c, x, y) => { B.sun(c, { x: x + 120, y: y + 60, rad: 22 }); el('path', { d: `M ${x},${y + 330} C ${x + 40},${y + 300} ${x + 90},${y + 310} ${x + 160},${y + 290} L ${x + 160},${y + 400} L ${x},${y + 400} Z`, fill: SAND }, c); B.cactus(c, { x: x + 70, y: y + 330, s: 0.95 }); });
      mini(1, 0, '淡水', (c, x, y) => { el('rect', { x, y: y + 160, width: 160, height: 240, fill: 'rgba(95,184,255,0.25)' }, c); B.water(c, x, y + 160, 160, 2); B.reed(c, { x: x + 30, y: y + 220, h: 120 }); B.fish(c, { x: x + 90, y: y + 300, len: 70 }); B.lilypad(c, { x: x + 100, y: y + 160, rad: 26 }); });
      mini(1, 1, '河口', (c, x, y) => { el('rect', { x, y: y + 262, width: 160, height: 40, fill: '#2f5f80' }, c); el('rect', { x, y: y + 298, width: 160, height: 102, fill: MUD }, c); B.kandelia(c, { x: x + 96, y: y + 300, h: 200, w: 130 }); B.fiddler(c, { x: x + 40, y: y + 302, s: 0.42, flip: true }); });
      mini(1, 2, '海洋', (c, x, y) => { el('rect', { x, y: y + 80, width: 160, height: 320, fill: SEA }, c); B.water(c, x, y + 80, 160, 2); B.dolphin(c, { x: x + 80, y: y + 180, s: 0.6 }); B.coral(c, { x: x + 50, y: y + 400, len: 34, w: 10 }); B.brainCoral(c, { x: x + 120, y: y + 400, w: 60 }); B.fish(c, { x: x + 110, y: y + 300, len: 50, color: '#e8b04a', fin: '#c8902a', edge: '#6a4a1a' }); });
      tl.addLabel('s0');
      S.show(tl, sides[0], 's0+=0.3', 0.6);
      S.show(tl, sides[1], 's0+=1.8', 0.6);

      // ===== 1 森林、草原、沙漠 =====
      const P1 = g(root, { opacity: 0 });
      const L1 = [
        ['森林', '雨量多', 7, ['生物種類多、層次多', '比較穩定'], (c, x, y) => {
          el('rect', { x, y: y + 300, width: 360, height: 80, fill: '#2a3a22' }, c);
          B.tree(c, { x: x + 80, y: y + 306, h: 290, w: 170, seed: 4 }); B.conifer(c, { x: x + 190, y: y + 308, h: 280, w: 90 }); B.tree(c, { x: x + 290, y: y + 306, h: 250, w: 150, seed: 6, color: '#357a3a' });
          B.shrub(c, { x: x + 140, y: y + 310, w: 90, h: 50, seed: 3 }); B.shrub(c, { x: x + 250, y: y + 312, w: 80, h: 44, seed: 8 });
          B.birdnestFern(c, { x: x + 80, y: y + 200, len: 46 }); B.sparrow(c, { x: x + 300, y: y + 130, s: 0.9, flip: true });
        }],
        ['草原', '雨量較少', 4, ['以草本植物為主', '動物善跑或住在地洞'], (c, x, y) => {
          el('rect', { x, y: y + 300, width: 360, height: 80, fill: '#3a4a26' }, c);
          for (let k = 0; k < 9; k++) B.grass(c, { x: x + 22 + k * 40, y: y + 304, h: 60 + (k % 3) * 8, w: 36, seed: k + 2, colors: ['#8ab84a', '#a8c860', '#7aa840'] });
          B.shrub(c, { x: x + 300, y: y + 304, w: 60, h: 36, seed: 4 });
          B.rabbit(c, { x: x + 120, y: y + 350, s: 0.55 }); B.rabbit(c, { x: x + 230, y: y + 356, s: 0.45, flip: true });
          B.hawkFly(c, { x: x + 250, y: y + 110, s: 0.6 });
        }],
        ['沙漠', '雨量很少', 1, ['乾燥、日夜溫差大', '生物種類少'], (c, x, y) => {
          el('path', { d: `M ${x},${y + 300} C ${x + 80},${y + 260} ${x + 180},${y + 280} ${x + 240},${y + 268} C ${x + 300},${y + 256} ${x + 340},${y + 270} ${x + 360},${y + 262} L ${x + 360},${y + 380} L ${x},${y + 380} Z`, fill: SAND }, c);
          el('path', { d: `M ${x},${y + 340} C ${x + 100},${y + 318} ${x + 220},${y + 336} ${x + 360},${y + 316}`, fill: 'none', stroke: '#e0c088', 'stroke-width': 3 }, c);
          B.cactus(c, { x: x + 110, y: y + 296, s: 1.15 }); B.camel(c, { x: x + 260, y: y + 300, s: 0.75 });
        }],
      ].map(([n, rain, drops, f, draw], i) => {
        const x = 40 + i * 380, cg = g(P1, { opacity: 0 });
        const b = box(cg, x, 150, 360, 380, i === 2 ? '#1a2630' : '#122230');
        draw(b.in, x, 150);
        rainGauge(cg, x + 120, 74, drops);
        text(cg, x + 250, 92, rain, { 'font-size': 26, fill: '#8fd0ff', 'font-weight': 700 });
        text(cg, x + 180, 574, n, { 'font-size': 30, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        f.forEach((s, j) => text(cg, x + 180, 616 + j * 34, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 }));
        return cg;
      });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.2);
      L1.forEach((c, i) => S.show(tl, c, `s1+=${0.4 + i * 1.3}`, 0.6));

      // ===== 2 沙漠生物的適應 =====
      const P2 = g(root, { opacity: 0 });
      el('path', { d: 'M 0,520 C 200,490 400,510 600,492 C 800,476 1000,500 1200,486 L 1200,720 L 0,720 Z', fill: SAND }, P2);
      B.sun(P2, { x: 600, y: 110, rad: 40 });
      // 仙人掌和淺而廣的根
      const roots2 = g(P2);
      ['M 250,520 C 200,540 140,546 80,552', 'M 250,520 C 300,542 360,548 430,552', 'M 250,520 C 230,548 200,566 170,580', 'M 250,520 C 270,550 300,568 330,580'].forEach((d) => el('path', { d, fill: 'none', stroke: '#8a6a40', 'stroke-width': 4, 'stroke-linecap': 'round' }, roots2));
      B.cactus(P2, { x: 250, y: 524, s: 2.1 });
      const co2 = [
        S.callout(P2, 186, 232, 300, 64, '葉變成刺：減少水分散失', C.hi, { size: 24 }),
        S.callout(P2, 262, 420, 590, 400, '莖肥厚：儲存水分、行光合作用', '#9be58c', { size: 24 }),
        S.callout(P2, 380, 550, 520, 620, '根淺而廣：下雨時能很快吸水', '#f4e6c8', { size: 24 }),
      ];
      B.camel(P2, { x: 930, y: 520, s: 1.5 });
      const co2b = [
        S.callout(P2, 905, 300, 980, 160, '駝峰儲存脂肪', C.hi, { size: 24 }),
      ];
      const camelT = g(P2, { opacity: 0 });
      S.pill(camelT, 960, 650, '能長時間不喝水；尿液很濃', { size: 24, color: '#8fd0ff', edge: '#8fd0ff' });
      co2b.push(camelT);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      co2.forEach((c, i) => S.show(tl, c, `s2+=${0.9 + i * 0.8}`, 0.4));
      co2b.forEach((c, i) => S.show(tl, c, `s2+=${3.4 + i * 0.8}`, 0.4));

      // ===== 3 臺灣的森林隨海拔改變 =====
      const P3 = g(root, { opacity: 0 });
      const Y = (m) => 640 - m * 0.1325, MX0 = 230, PKX = 600, MX1 = 930;
      const mtD = `M ${MX0},640 C ${MX0 + 90},560 ${MX0 + 170},420 ${PKX - 120},250 C ${PKX - 60},170 ${PKX - 30},${Y(3952) + 10} ${PKX},${Y(3952)} C ${PKX + 40},${Y(3952) + 20} ${PKX + 90},200 ${PKX + 160},330 C ${PKX + 230},450 ${MX1 - 40},590 ${MX1},640 Z`;
      const mid = B.id('mt');
      el('path', { d: mtD }, el('clipPath', { id: mid }, el('defs', {}, P3)));
      const bands = g(P3, { 'clip-path': `url(#${mid})` });
      const BANDS = [[0, 1800, '#58a83c', '闊葉林'], [1800, 2500, '#2f8f82', '針闊葉混合林'], [2500, 3500, '#1d4f5a', '針葉林'], [3500, 4100, '#b0a060', '高山草原']];
      BANDS.forEach(([a, b, col]) => el('rect', { x: MX0, y: Y(b), width: MX1 - MX0, height: Y(a) - Y(b), fill: col }, bands));
      [1800, 2500, 3500].forEach((m) => el('line', { x1: MX0, y1: Y(m), x2: MX1, y2: Y(m), stroke: '#f4f8f0', 'stroke-width': 3, opacity: 0.85 }, bands));
      // 雲霧帶
      [[420, Y(2150)], [560, Y(2250)], [740, Y(2100)]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 80, ry: 16, fill: '#e8f0f2', opacity: 0.35 }, bands));
      el('path', { d: mtD, fill: 'none', stroke: '#9ab0a0', 'stroke-width': 2.5 }, P3);
      // 坡面上的植物（左坡、右坡）
      const tmp = el('path', { d: mtD, fill: 'none' }, P3);
      const TL = tmp.getTotalLength();
      const veg = g(P3);
      for (let k = 0; k < 46; k++) {
        const q = tmp.getPointAtLength(TL * (0.03 + k * 0.0172));
        if (q.y > 632) continue;
        const m = (640 - q.y) / 0.1325;
        const o = { x: q.x, y: q.y + 6 };
        const BL = { color: '#3f8f2c', edge: '#1f4f1c', light: '#6ab84e' }, CN = { color: '#2a6e5a', edge: '#143a30', light: '#3f8a70' };
        if (m < 1800) B.tree(veg, { ...o, h: 60, w: 50, s: 1, seed: k, ...BL });
        else if (m < 2500) (k % 2 ? B.conifer : B.tree)(veg, { ...o, h: 56, w: k % 2 ? 24 : 44, seed: k, ...(k % 2 ? CN : BL) });
        else if (m < 3500) B.conifer(veg, { ...o, h: 52, w: 24, ...CN });
        else B.grass(veg, { ...o, h: 16, w: 22, seed: k, colors: ['#d8cc8a', '#c0b070'] });
      }
      tmp.remove();
      // 海拔軸
      const ax = g(P3);
      el('line', { x1: 200, y1: 640, x2: 200, y2: Y(4000), stroke: C.ink2, 'stroke-width': 2.5 }, ax);
      el('line', { x1: 200, y1: 640, x2: 1180, y2: 640, stroke: '#4a6272', 'stroke-width': 2 }, ax);
      [[0, '0 m'], [1800, '約 1800 m＊'], [2500, '約 2500 m＊'], [3500, '約 3500 m＊']].forEach(([m, s]) => {
        el('line', { x1: 192, y1: Y(m), x2: 208, y2: Y(m), stroke: C.ink2, 'stroke-width': 2.5 }, ax);
        if (m) el('line', { x1: 208, y1: Y(m), x2: MX1, y2: Y(m), stroke: '#e8f0f2', 'stroke-width': 1.5, 'stroke-dasharray': '6 8', opacity: 0.45 }, ax);
        text(ax, 186, Y(m) + 8, s, { 'font-size': 22, 'text-anchor': 'end', fill: C.ink2 });
      });
      text(ax, 200, Y(4000) - 14, '海拔', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      S.pill(ax, PKX, Y(3952) - 34, '玉山約 3952 m', { size: 22, color: C.ink, edge: '#4a6272' });
      // 右側的名稱
      const labs3 = BANDS.map(([a, b, col, n]) => {
        const lg = g(P3, { opacity: 0 }), yc = (Y(a) + Y(Math.min(b, 3952))) / 2;
        el('rect', { x: 960, y: yc - 18, width: 24, height: 36, rx: 5, fill: col, stroke: '#cfe0d0', 'stroke-width': 1.5 }, lg);
        text(lg, 996, yc + 9, n, { 'font-size': 26, fill: C.ink, 'font-weight': 700 });
        return lg;
      });
      const tip3 = g(P3, { opacity: 0 });
      S.pill(tip3, 600, 688, '海拔越高，溫度越低，森林的種類跟著改變', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.6);
      labs3.forEach((l, i) => S.show(tl, l, `s3+=${1 + i * 0.8}`, 0.4));
      S.show(tl, tip3, 's3+=4.4', 0.5);

      // ===== 4 淡水生態系 =====
      const P4 = g(root, { opacity: 0 });
      const r4 = box(P4, 40, 70, 550, 470, '#14222c');
      const rc = r4.in;
      el('path', { d: 'M 40,400 C 200,380 400,420 590,396 L 590,540 L 40,540 Z', fill: '#3a3024' }, rc);
      el('rect', { x: 40, y: 220, width: 550, height: 190, fill: 'rgba(95,184,255,0.28)' }, rc);
      B.water(rc, 40, 220, 550);
      [[110, 412, 50], [240, 418, 36], [400, 410, 56], [520, 404, 40]].forEach(([x, y, r]) => { el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.55, fill: '#6a6a62', stroke: '#3a3a36', 'stroke-width': 2 }, rc); el('path', { d: `M ${x - r * 0.8},${y - r * 0.3} C ${x - r * 0.4},${y - r * 0.6} ${x + r * 0.4},${y - r * 0.6} ${x + r * 0.8},${y - r * 0.3}`, fill: 'none', stroke: '#5faa48', 'stroke-width': 5 }, rc); });
      const flow = g(rc);
      [[90, 270], [260, 300], [430, 260], [180, 340], [380, 350]].forEach(([x, y]) => B.arrow(flow, x, y, x + 70, y, { color: '#cfe8ff', w: 3, head: 12 }));
      B.fish(rc, { x: 300, y: 300, len: 80, flip: true, color: '#9ab8a0', fin: '#7a9a80', edge: '#3e5a46' });
      B.grass(rc, { x: 80, y: 222, h: 50, w: 50 }); B.grass(rc, { x: 520, y: 222, h: 44, w: 44, seed: 4 });
      text(P4, 315, 116, '河川、溪流（流動的水）', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      const p4 = box(P4, 610, 70, 550, 470, '#14222c');
      const pc = p4.in;
      el('path', { d: 'M 610,520 C 700,500 1000,500 1160,520 L 1160,540 L 610,540 Z', fill: '#3a3024' }, pc);
      el('rect', { x: 610, y: 240, width: 550, height: 290, fill: 'rgba(95,184,255,0.22)' }, pc);
      B.water(pc, 610, 240, 550);
      B.reed(pc, { x: 660, y: 330, h: 170 }); B.reed(pc, { x: 1110, y: 320, h: 150, seed: 6 });
      [[800, 242, 34], [920, 244, 28]].forEach(([x, y, r]) => B.lilypad(pc, { x, y, rad: r }));
      B.frog(pc, { x: 800, y: 236, s: 0.6 });
      B.fish(pc, { x: 900, y: 420, len: 70 });
      for (let k = 0; k < 4; k++) {
        const sx = 700 + k * 120;
        el('path', { d: `M ${sx},520 C ${sx - 6},480 ${sx + 6},440 ${sx},396`, fill: 'none', stroke: '#4f9a4a', 'stroke-width': 3.5 }, pc);
        for (let j = 0; j < 5; j++) [-1, 1].forEach((sd) => { const lf = S.place(g(pc), { x: sx, y: 508 - j * 24, r: sd > 0 ? -40 : -140 }); el('path', { d: 'M 0,0 C 4,-4 12,-4 16,0 C 12,4 4,4 0,0 Z', fill: '#5faa48' }, lf); });
      }
      const lp = B.lens(P4, 1080, 450, 56, 1000, 330);
      B.plankton(lp.in, { x: 1080, y: 450, s: 0.9 });
      text(P4, 885, 116, '湖泊、池塘（靜止的水）', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      const t4 = g(P4, { opacity: 0 });
      ['水流急：生物附著在石頭上，', '或身體呈流線型'].forEach((s, i) => text(t4, 315, 586 + i * 36, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 }));
      ['生產者：浮游藻類（放大＊）', '和水草、水邊的植物'].forEach((s, i) => text(t4, 885, 586 + i * 36, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 }));
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.drive(tl, (u) => flow.setAttribute('transform', `translate(${((u * 6) % 1) * 40 - 20},0)`), 4, 's4+=0.4', 'none');
      S.show(tl, t4, 's4+=2', 0.5);

      // ===== 5 海洋生態系 =====
      const P5 = g(root, { opacity: 0 });
      const OC = [['潮間帶', '漲潮淹沒、退潮露出'], ['珊瑚礁', '溫暖清澈的淺海，生物種類非常多'], ['大洋區', '生產者主要是浮游藻類']];
      const oc = OC.map(([n, s], i) => {
        const x = 40 + i * 380, cg = g(P5, { opacity: 0 });
        const b = box(cg, x, 70, 360, 470, i === 2 ? '#0e2236' : '#14222c');
        text(cg, x + 180, 584, n, { 'font-size': 30, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        const words = s.split('，');
        words.forEach((w, j) => text(cg, x + 180, 626 + j * 34, w + (j < words.length - 1 ? '，' : ''), { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 }));
        return [cg, b.in, x];
      });
      { // 潮間帶
        const [, c, x] = oc[0];
        el('rect', { x, y: 300, width: 360, height: 240, fill: SEA }, c);
        el('path', { d: `M ${x},420 L ${x + 60},360 L ${x + 150},330 L ${x + 240},350 L ${x + 300},330 L ${x + 360},350 L ${x + 360},540 L ${x},540 Z`, fill: '#6a6a62', stroke: '#3a3a36', 'stroke-width': 2 }, c);
        [[x + 10, 230, '滿潮線'], [x + 10, 430, '乾潮線']].forEach(([lx, y, s]) => { el('line', { x1: x, y1: y, x2: x + 360, y2: y, stroke: '#8fd0ff', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, c); text(c, lx + 340, y - 10, s, { 'font-size': 20, 'text-anchor': 'end', fill: '#8fd0ff' }); });
        // 岩石表面的高度（藤壺、海星、螃蟹都放在表面上）
        const RK = [[0, 420], [60, 360], [150, 330], [240, 350], [300, 330], [360, 350]];
        const rockY = (dx) => { for (let k = 1; k < RK.length; k++) if (dx <= RK[k][0]) return S.lerp(RK[k - 1][1], RK[k][1], (dx - RK[k - 1][0]) / (RK[k][0] - RK[k - 1][0])); return 350; };
        [84, 96, 108, 196, 208, 220, 286, 298, 310].forEach((dx) => B.barnacle(c, { x: x + dx, y: rockY(dx) + 2, s: 0.8 }));
        B.seaweed(c, { x: x + 46, y: rockY(46) + 2, h: 50, color: '#6fce62' });
        B.seastar(c, { x: x + 30, y: rockY(30) - 4, rad: 18, r: -45 });
        B.fiddler(c, { x: x + 150, y: rockY(150) + 2, s: 0.6, plain: true });
      }
      { // 珊瑚礁
        const [, c, x] = oc[1];
        el('rect', { x, y: 70, width: 360, height: 470, fill: 'rgba(40,140,190,0.3)' }, c);
        el('path', { d: `M ${x},520 C ${x + 100},500 ${x + 260},510 ${x + 360},500 L ${x + 360},540 L ${x},540 Z`, fill: '#d8c89a' }, c);
        B.coral(c, { x: x + 56, y: 512, len: 44, w: 14, depth: 3, color: '#e8806a' });
        B.coral(c, { x: x + 306, y: 508, len: 40, w: 12, depth: 3, color: '#b86ad0', tip: '#e0b0f0', seed: 3 });
        B.brainCoral(c, { x: x + 132, y: 514, w: 84 });
        B.anemone(c, { x: x + 222, y: 512, s: 0.75, w: 90 });
        B.clownfish(c, { x: x + 232, y: 398, s: 0.9 });
        B.fish(c, { x: x + 100, y: 250, len: 60, color: '#e8d04a', fin: '#c8a02a', edge: '#6a5a1a' });
        B.fish(c, { x: x + 270, y: 200, len: 50, flip: true, color: '#5fb8e8', fin: '#3f98c8', edge: '#1a4a6a' });
      }
      { // 大洋區
        const [, c, x] = oc[2];
        const id = B.id('deep'), lg = el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, el('defs', {}, c));
        el('stop', { offset: 0, 'stop-color': '#2a7ab8' }, lg); el('stop', { offset: 0.5, 'stop-color': '#123a62' }, lg); el('stop', { offset: 1, 'stop-color': '#050c18' }, lg);
        el('rect', { x, y: 110, width: 360, height: 430, fill: `url(#${id})` }, c);
        B.water(c, x, 110, 360, 0, { fill: 'none' });
        B.dolphin(c, { x: x + 200, y: 220, s: 0.85 });
        for (let k = 0; k < 7; k++) B.fish(c, { x: x + 90 + (k % 4) * 30, y: 320 + Math.floor(k / 4) * 24 + (k % 2) * 6, len: 30, color: '#9ab0c0' });
        text(c, x + 180, 500, '越深越暗，深海沒有陽光', { 'font-size': 22, 'text-anchor': 'middle', fill: '#8fb0c8' });
        const lz = B.lens(c, x + 280, 400, 46, x + 250, 160);
        B.plankton(lz.in, { x: x + 280, y: 400, s: 0.75, n: 6 });
      }
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.2);
      oc.forEach(([cg], i) => S.show(tl, cg, `s5+=${0.4 + i * 1.2}`, 0.5));

      // ===== 6 河口與紅樹林 =====
      const P6 = g(root, { opacity: 0 });
      // 泥灘的表面（退潮時露出）；左邊是河水、右邊是海水
      const SURF = 'M 0,468 L 300,461 L 600,465 L 900,466 L 1200,460';
      el('path', { d: SURF + ' L 1200,720 L 0,720 Z', fill: MUD }, P6);
      el('path', { d: SURF, fill: 'none', stroke: '#7a6248', 'stroke-width': 4 }, P6);
      el('path', { d: 'M 0,444 L 210,444 C 236,450 250,458 262,462 L 0,468 Z', fill: '#2f5f80' }, P6);
      el('path', { d: 'M 1200,442 L 1010,442 C 986,448 966,456 950,465 L 1200,460 Z', fill: '#2f5f80' }, P6);
      for (let k = 0; k < 12; k++) el('ellipse', { cx: 60 + k * 100, cy: 560 + (k % 3) * 40, rx: 30, ry: 4, fill: '#3a2c1e' }, P6);
      const inF = g(P6); B.arrow(inF, 30, 428, 220, 428, { color: '#8fd0ff', w: 5, head: 18 }); text(inF, 30, 406, '河水（淡水）', { 'font-size': 24, fill: '#8fd0ff', 'font-weight': 700 });
      const inS = g(P6); B.arrow(inS, 1118, 428, 960, 428, { color: '#5f9ad8', w: 5, head: 18 }); text(inS, 1110, 406, '海水', { 'font-size': 24, 'text-anchor': 'end', fill: '#5f9ad8', 'font-weight': 700 });
      B.kandelia(P6, { x: 400, y: 463, h: 280, w: 260 });
      B.avicennia(P6, { x: 790, y: 467, h: 230, w: 250 });
      const drop = B.propagule(P6, 452, 336, 60);
      const sproutL = g(P6, { opacity: 0 });
      [-1, 1].forEach((sd) => { const lf = S.place(g(sproutL), { x: 492, y: 416, r: sd > 0 ? -40 : -140 }); el('path', { d: 'M 0,0 C 5,-6 16,-6 20,0 C 16,6 5,6 0,0 Z', fill: '#7cc35a' }, lf); });
      B.fiddler(P6, { x: 292, y: 463, s: 0.85 });
      B.fiddler(P6, { x: 975, y: 467, s: 0.7, flip: true });
      B.mudskipper(P6, { x: 604, y: 466, s: 1.1 });
      B.egret(P6, { x: 1150, y: 462, s: 0.9, flip: true });
      const co6 = [
        S.callout(P6, 400, 270, 230, 150, '水筆仔', '#9be58c', { size: 24 }),
        S.callout(P6, 790, 300, 1000, 150, '海茄苳', '#9be58c', { size: 24 }),
      ];
      const co6b = [
        S.callout(P6, 468, 362, 600, 100, '胎生苗：在母樹上發芽，再掉下來', C.hi, { size: 24 }),
        S.callout(P6, 700, 452, 800, 570, '呼吸根：伸出泥面，幫助取得氧', C.hi, { size: 24 }),
      ];
      const t6 = g(P6, { opacity: 0 });
      S.pill(t6, 600, 680, '河口：鹽度變化大、泥灘缺氧，但養分豐富', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.5);
      co6.forEach((c, i) => S.show(tl, c, `s6+=${0.9 + i * 0.5}`, 0.4));
      S.show(tl, co6b[0], 's6+=2', 0.4);
      S.move(tl, drop, { x: 452, y: 336 }, { x: 492, y: 417 }, 1, 's6+=2.6', 'power2.in');
      S.show(tl, sproutL, 's6+=3.9', 0.4);
      S.show(tl, co6b[1], 's6+=4.3', 0.4);
      S.show(tl, t6, 's6+=5', 0.5);

      return {
        tl,
        notes: [
          '地球上所有的生態系合起來就是生物圈。陸域生態系主要受雨量和溫度影響；水域生態系依鹽分多少分成淡水、河口、海洋。',
          '＊示意：雨量只畫出多少的差別。森林有高大的喬木、灌木、草本植物和附生植物等不同層次，生物種類多。草原上沒有地方躲藏，草食動物多半跑得快，或住在地洞中。',
          '仙人掌的表面有蠟質，也能減少水分散失。駱駝的駝峰儲存的是脂肪，不是水；牠的尿液很濃、糞便很乾，能減少水分流失。很多沙漠動物白天躲在洞裡，晚上才出來活動。駱駝能長時間不喝水。',
          '＊海拔界線是約略值，各地不同（北部的界線通常比較低）。針闊葉混合林一帶常有雲霧。高山草原以玉山箭竹和矮小的灌叢（如玉山圓柏、杜鵑）為主；有些課本把森林界線以上的地區稱為高山寒原。',
          '＊示意：浮游藻類畫得很大。溪流水流急，含氧較多；有些生物附著在石頭上，魚的身體多呈流線型，可以減少水流的阻力。',
          '潮間帶的生物要能忍受日曬、乾燥和海浪，例如藤壺緊緊固著在岩石上。珊瑚礁中的珊瑚是動物（補充：珊瑚體內有共生的藻類）。深海沒有陽光，不能進行光合作用。',
          '河口常見招潮蟹、彈塗魚、貝類和水鳥。紅樹林能防風、減緩海浪侵蝕，也是許多生物的棲所。臺灣的紅樹林植物還有欖李、紅海欖（五梨跤）等（補充）。',
        ],
        steps: [
          '生態系依環境可分為<b>陸域生態系</b>（森林、草原、沙漠）和<b>水域生態系</b>（淡水、河口、海洋）。',
          '陸域生態系：<b>雨量多</b>的地方形成<b>森林</b>，生物種類多；雨量較少形成<b>草原</b>，以草本植物為主；雨量很少形成<b>沙漠</b>，生物種類少。',
          '沙漠乾燥、日夜溫差大，生物有特殊的<b>適應</b>：仙人掌的<b>葉變成刺</b>，減少水分散失；<b>莖肥厚</b>能儲存水分，也能行光合作用。',
          '臺灣山多，<b>海拔</b>越高、溫度越低，森林跟著改變：由低到高大致是<b>闊葉林</b> → <b>針闊葉混合林</b> → <b>針葉林</b> → <b>高山草原</b>。',
          '<b>淡水生態系</b>有流動的水（<b>河川、溪流</b>）和靜止的水（<b>湖泊、池塘</b>）。生產者有浮游藻類、水草等。',
          '<b>海洋生態系</b>面積最大：<b>潮間帶</b>隨潮汐淹沒或露出；<b>珊瑚礁</b>生物種類非常多；<b>大洋區</b>的生產者主要是<b>浮游藻類</b>。',
          '<b>河口</b>是河水和海水交會的地方，鹽度變化大、泥灘缺氧。<b>紅樹林</b>植物有特殊的適應：水筆仔有<b>胎生苗</b>，海茄苳有伸出泥面的<b>呼吸根</b>。',
        ],
      };
    },
  });
})();
