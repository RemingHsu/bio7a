/* 2-4 消化與吸收：消化管與消化腺、物理性與化學性消化、各段的消化、小腸的吸收（跨尺度）、大腸與排遺 */
(() => {
  const { el, g, text, C } = S;
  const STA = C.sugar, PRO = '#ff8f8f', FAT = '#ffb35c', CAP = '#ff5f74', LAC = '#f3e6b0', ENZ = '#62d0c0';
  const TD = { x: -760, y: -120, s: 2 }; // 消化系統的放大倍率（人體座標 → 畫面）
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const B2S = (x, y) => [TD.x + x * TD.s, TD.y + y * TD.s];

  // 小分子
  const glu = (p, x, y, r = 12) => el('path', { d: hexD(r), transform: `translate(${x},${y})`, fill: 'rgba(255,207,92,0.25)', stroke: STA, 'stroke-width': 3 }, p);
  const amino = (p, x, y, r = 10) => el('circle', { cx: x, cy: y, r, fill: PRO, stroke: '#fff', 'stroke-width': 1.5 }, p);
  const fattyGly = (p, x, y) => { const f = g(p); el('rect', { x: x - 5, y: y - 14, width: 10, height: 28, rx: 5, fill: FAT }, f); el('rect', { x: x + 8, y: y - 10, width: 8, height: 20, rx: 4, fill: '#ffe0a8' }, f); return f; };
  const chain = (p, x, y, n, kind, gap = 26) => { const c = g(p); el('line', { x1: x, y1: y, x2: x + (n - 1) * gap, y2: y, stroke: kind === 's' ? STA : PRO, 'stroke-width': 3 }, c); for (let i = 0; i < n; i++) (kind === 's' ? glu : amino)(c, x + i * gap, y); return c; };

  S.register({
    id: 'digest', section: '2-4', title: '消化與吸收',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 消化管與消化腺 =====
      const P0 = g(root);
      const bodyG = S.place(g(P0), TD);
      S.human(bodyG, { fill: 'rgba(44,82,104,0.35)', stroke: C.bodyEdge, sw: 1.2 });
      const D = S.digestive(bodyG);
      S.stomach(D.stomach, { stubs: false, wall: 6, shade: true });
      // 唾腺、膽囊（人體座標）
      const sal = g(bodyG);
      [[586, 121], [614, 121], [592, 133], [608, 133]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 4.5, ry: 3, fill: '#f0b6c2', stroke: '#ffd6de', 'stroke-width': 0.6 }, sal));
      el('ellipse', { cx: 578, cy: 300, rx: 5, ry: 7.5, fill: '#6fae4a', stroke: '#a8e39a', 'stroke-width': 0.8 }, bodyG);
      // 食物經過的路線
      const route = (() => {
        const pts = [];
        const add = (path, n) => { const L = path.getTotalLength(); for (let i = 0; i <= n; i++) { const q = path.getPointAtLength((L * i) / n); pts.push([q.x, q.y]); } };
        const tmp = (d) => el('path', { d, fill: 'none' }, bodyG);
        add(D.eso, 30);
        const sp = tmp('M 630,274 C 642,280 652,292 648,304 C 642,314 620,312 606,304 C 602,302 600,300 598,299'); add(sp, 14); sp.remove();
        add(D.small, 60); add(D.large, 40);
        pts.push([602, 400]);
        return pts;
      })();
      const food = el('circle', { cx: route[0][0], cy: route[0][1], r: 5, fill: C.hi, stroke: '#fff', 'stroke-width': 1, opacity: 0 }, bodyG);
      const tube = [
        [600, 126, 860, 112, '口腔'], [600, 142, 860, 168, '咽'], [601, 220, 860, 236, '食道'], [650, 285, 860, 330, '胃（有胃腺）'],
        [590, 345, 860, 520, '小腸（有腸腺）'], [657, 320, 860, 410, '大腸'], [602, 396, 860, 640, '肛門'],
      ].map(([bx, by, x, y, s]) => { const [tx, ty] = B2S(bx, by); return S.callout(P0, tx, ty, x, y, s, '#ffc2a8', { size: 24 }); });
      const glands = [
        [586, 121, 150, 96, '唾腺'], [570, 270, 150, 300, '肝臟（製造膽汁）'], [578, 302, 150, 420, '膽囊（儲存膽汁）'], [632, 312, 150, 540, '胰臟'],
      ].map(([bx, by, x, y, s]) => { const [tx, ty] = B2S(bx, by); return S.callout(P0, tx, ty, x, y, s, '#a8e39a', { size: 24 }); });
      const heads = g(P0, { opacity: 0 });
      S.pill(heads, 1060, 40, '消化管：食物經過的管道', { size: 22, color: '#ffc2a8', edge: '#ffc2a8' });
      S.pill(heads, 170, 40, '消化腺：分泌消化液', { size: 22, color: '#a8e39a', edge: '#a8e39a' });
      tl.addLabel('s0');
      S.show(tl, heads, 's0+=0.2', 0.4);
      S.drive(tl, (u) => {
        const k = u * (route.length - 1), i = Math.min(route.length - 2, Math.floor(k)), f = k - i;
        food.setAttribute('cx', S.lerp(route[i][0], route[i + 1][0], f)); food.setAttribute('cy', S.lerp(route[i][1], route[i + 1][1], f));
        food.style.opacity = u > 0 && u < 1 ? 1 : 0;
      }, 6, 's0+=0.6', 'none');
      [0, 0.05, 0.16, 0.3, 0.5, 0.75, 0.98].forEach((u, i) => S.show(tl, tube[i], `s0+=${0.6 + u * 6}`, 0.3));
      glands.forEach((gl, i) => S.show(tl, gl, `s0+=${6.8 + i * 0.35}`, 0.3));

      // ===== 1 物理性與化學性消化 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 90, width: 540, height: 560, rx: 18, ...FRAME }, P1);
      el('rect', { x: 620, y: 90, width: 540, height: 560, rx: 18, ...FRAME }, P1);
      text(P1, 310, 140, '物理性消化', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffc2a8' });
      text(P1, 310, 176, '食物變小塊，分子沒有改變', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(P1, 890, 140, '化學性消化', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: ENZ });
      text(P1, 890, 176, '酵素把大分子分解成小分子', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 物理：咀嚼、蠕動、乳化
      const rows = [['牙齒咀嚼', 260], ['胃腸蠕動', 400], ['膽汁乳化脂質', 540]];
      rows.forEach(([s, y]) => text(P1, 70, y + 8, s, { 'font-size': 24, 'font-weight': 700 }));
      const chunk = el('path', { d: 'M 300,230 L 350,224 L 362,262 L 330,292 L 290,280 Z', fill: '#c9a05a' }, P1);
      const bits = g(P1, { opacity: 0 });
      [[420, 238], [452, 262], [430, 282], [470, 236], [488, 276], [508, 252]].forEach(([x, y], i) => el('path', { d: `M ${x},${y} l 14,-3 l 4,12 l -10,9 l -11,-4 Z`, fill: '#c9a05a', transform: `rotate(${i * 40} ${x} ${y})` }, bits));
      el('path', { d: 'M 372,260 L 404,260', stroke: C.ink2, 'stroke-width': 3 }, P1);
      el('path', { d: 'M 404,260 l -10,-6 l 0,12 Z', fill: C.ink2 }, P1);
      const gut = el('path', { d: '', fill: 'rgba(231,160,127,0.3)', stroke: '#e7a07f', 'stroke-width': 4 }, P1);
      const bolus = el('circle', { cx: 280, cy: 400, r: 14, fill: '#c9a05a' }, P1);
      const bigDrop = el('circle', { cx: 330, cy: 540, r: 40, fill: FAT, opacity: 0.9 }, P1);
      const drops = g(P1, { opacity: 0 });
      for (let i = 0; i < 9; i++) el('circle', { cx: 420 + (i % 3) * 38, cy: 506 + Math.floor(i / 3) * 34, r: 12, fill: FAT, opacity: 0.9 }, drops);
      el('path', { d: 'M 380,540 L 404,540', stroke: C.ink2, 'stroke-width': 3 }, P1);
      el('path', { d: 'M 404,540 l -10,-6 l 0,12 Z', fill: C.ink2 }, P1);
      text(P1, 310, 618, '膽汁不含酵素', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 化學：澱粉鏈被酵素切開
      const cg = g(P1);
      const units = [];
      for (let i = 0; i < 8; i++) units.push(glu(cg, 700 + i * 54, 330, 20));
      const link = el('line', { x1: 700, y1: 330, x2: 700 + 7 * 54, y2: 330, stroke: STA, 'stroke-width': 4 }, cg);
      cg.insertBefore(link, cg.firstChild);
      text(P1, 890, 260, '澱粉（大分子）', { 'font-size': 24, 'text-anchor': 'middle', fill: STA, 'font-weight': 700 });
      const enz = S.place(g(P1), { x: 660, y: 410 });
      el('path', { d: 'M 0,0 L 22,-14 A 26,26 0 1,0 22,14 Z', fill: ENZ, transform: 'rotate(-90)' }, enz);
      text(enz, 0, 50, '酵素', { 'font-size': 20, 'text-anchor': 'middle', fill: ENZ });
      const gluLbl = text(P1, 890, 520, '葡萄糖（小分子）', { 'font-size': 24, 'text-anchor': 'middle', fill: STA, 'font-weight': 700, opacity: 0 });
      text(P1, 890, 600, '小分子才能被吸收', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      tl.fromTo(chunk, { opacity: 1 }, { opacity: 0.25, duration: 0.4, immediateRender: false }, 's1+=1');
      S.show(tl, bits, 's1+=1', 0.4);
      S.drive(tl, (u) => {
        const ph = u * 6.283 * 2;
        const top = [], bot = [];
        for (let x = 250; x <= 540; x += 10) { const w = 22 - 10 * Math.max(0, Math.sin((x - 250) / 30 - ph)); top.push(`${x},${400 - w}`); bot.unshift(`${x},${400 + w}`); }
        gut.setAttribute('d', `M ${top.join(' L ')} L ${bot.join(' L ')} Z`);
        bolus.setAttribute('cx', 270 + u * 250);
      }, 3, 's1+=1.2', 'none');
      tl.fromTo(bigDrop, { opacity: 0.9 }, { opacity: 0.25, duration: 0.4, immediateRender: false }, 's1+=2.6');
      S.show(tl, drops, 's1+=2.6', 0.4);
      S.drive(tl, (u) => {
        S.place(enz, { x: S.lerp(660, 700 + 7 * 54, u), y: 410 });
        const cut = Math.floor(u * 8);
        units.forEach((h, i) => { const done = i < cut; h.setAttribute('transform', `translate(${700 + i * 54},${done ? 460 + (i % 2) * 6 : 330})`); });
        link.setAttribute('x1', 700 + Math.min(7, cut) * 54);
        link.style.opacity = cut >= 7 ? 0 : 1;
      }, 3, 's1+=3.4', 'none');
      S.show(tl, gluLbl, 's1+=6.2', 0.4);

      // ===== 2 各段的消化 =====
      const P2 = g(root, { opacity: 0 });
      const COLX = [340, 580, 830, 1060], ROWY = [230, 380, 530];
      const cols = [['口腔', '唾液'], ['胃', '胃液（酸性）'], ['小腸', '胰液、腸液、膽汁'], ['最後產物', '']];
      const colG = cols.map(([n, j], i) => {
        const cgp = g(P2, { opacity: 0 });
        el('rect', { x: COLX[i] - 112, y: 86, width: 224, height: 530, rx: 16, fill: i === 3 ? 'rgba(255,209,102,0.06)' : '#122230', stroke: i === 3 ? C.hi : '#2b4252', 'stroke-width': 2 }, cgp);
        text(cgp, COLX[i], 128, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: i === 3 ? C.hi : C.ink });
        if (j) text(cgp, COLX[i], 160, j, { 'font-size': 20, 'text-anchor': 'middle', fill: ENZ });
        return cgp;
      });
      [['澱粉', STA], ['蛋白質', PRO], ['脂質', FAT]].forEach(([s, c], i) => text(P2, 40, ROWY[i] + 9, s, { 'font-size': 28, 'font-weight': 700, fill: c }));
      // 口腔
      const c0 = g(colG[0]);
      chain(c0, COLX[0] - 70, ROWY[0] - 14, 4, 's', 24);
      [[COLX[0] - 60, ROWY[0] + 26], [COLX[0] + 20, ROWY[0] + 26]].forEach(([x, y]) => chain(c0, x, y, 2, 's', 24));
      text(c0, COLX[0], ROWY[0] + 70, '部分分解成麥芽糖', { 'font-size': 18, 'text-anchor': 'middle', fill: C.mute });
      chain(c0, COLX[0] - 78, ROWY[1], 7, 'p', 26);
      el('circle', { cx: COLX[0], cy: ROWY[2], r: 40, fill: FAT, opacity: 0.9 }, c0);
      // 胃
      const c1 = g(colG[1]);
      text(c1, COLX[1], ROWY[0] + 8, '（不再分解）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      [[COLX[1] - 74, ROWY[1] - 18], [COLX[1] + 4, ROWY[1] - 18], [COLX[1] - 40, ROWY[1] + 22]].forEach(([x, y], i) => chain(c1, x, y, i === 2 ? 3 : 2, 'p', 24));
      text(c1, COLX[1], ROWY[1] + 66, '初步分解', { 'font-size': 18, 'text-anchor': 'middle', fill: C.mute });
      el('circle', { cx: COLX[1], cy: ROWY[2], r: 40, fill: FAT, opacity: 0.9 }, c1);
      // 小腸
      const c2 = g(colG[2]);
      for (let i = 0; i < 6; i++) glu(c2, COLX[2] - 70 + (i % 3) * 70, ROWY[0] - 16 + Math.floor(i / 3) * 34);
      for (let i = 0; i < 7; i++) amino(c2, COLX[2] - 75 + (i % 4) * 50, ROWY[1] - 16 + Math.floor(i / 4) * 34);
      for (let i = 0; i < 3; i++) fattyGly(c2, COLX[2] - 60 + i * 56, ROWY[2]);
      text(c2, COLX[2], ROWY[2] + 52, '膽汁先乳化，再由酵素分解', { 'font-size': 17, 'text-anchor': 'middle', fill: C.mute });
      // 產物
      const c3 = g(colG[3]);
      [['葡萄糖', STA], ['胺基酸', PRO], ['脂肪酸＋甘油', FAT]].forEach(([s, c], i) => S.pill(c3, COLX[3], ROWY[i], s, { size: 24, color: c, edge: c }));
      const neutral = g(P2, { opacity: 0 });
      S.pill(neutral, 600, 672, '小腸是消化的主要場所：三大類養分都在這裡分解完成', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.3);
      colG.forEach((c, i) => S.show(tl, c, `s2+=${0.6 + i * 1.1}`, 0.5));
      S.show(tl, neutral, 's2+=5', 0.5);

      // ===== 3 小腸的吸收（跨尺度）=====
      const P3 = g(root, { opacity: 0 });
      const FX = [40, 330, 650], FW = [260, 290, 510], FY = 90, FH = 470;
      const fr = FX.map((x, i) => { const f = g(P3, { opacity: 0 }); el('rect', { x, y: FY, width: FW[i], height: FH, rx: 16, ...FRAME }, f); return f; });
      // 小腸（盤曲）
      el('path', { d: 'M 90,180 C 250,170 250,230 100,240 C -10,250 260,300 230,320 C 200,340 80,320 90,360 C 100,400 250,380 240,420 C 230,460 90,440 120,480 C 140,510 220,500 240,520', fill: 'none', stroke: '#e7a07f', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, fr[0]);
      const zb0 = g(P3, { opacity: 0 });
      el('rect', { x: 196, y: 300, width: 44, height: 44, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zb0);
      [[300, FY], [344, FY + FH]].forEach(([y1, y2]) => el('line', { x1: 240, y1, x2: FX[1], y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zb0));
      // 內壁：皺褶上有絨毛
      const wall = fr[1];
      let wd = 'M 345,520 ';
      for (let i = 0; i <= 4; i++) { const x = 352 + i * 64; wd += `L ${x},430 C ${x},300 ${x + 52},300 ${x + 52},430 `; }
      wd += 'L 620,520 Z';
      el('path', { d: wd, fill: '#b5596b', stroke: '#ffb3c1', 'stroke-width': 2 }, wall);
      for (let i = 0; i <= 4; i++) for (let k = 0; k < 7; k++) {
        const x = 352 + i * 64, a = Math.PI * (k / 6), cx = x + 26 - Math.cos(a) * 26, cy = 410 - Math.sin(a) * 92;
        el('path', { d: `M ${cx - 4},${cy + 6} L ${cx - 4},${cy - 8} C ${cx - 4},${cy - 16} ${cx + 4},${cy - 16} ${cx + 4},${cy - 8} L ${cx + 4},${cy + 6} Z`, fill: '#e58a9a', transform: `rotate(${(a * 180) / Math.PI - 90} ${cx} ${cy})` }, wall);
      }
      const zb1 = g(P3, { opacity: 0 });
      el('rect', { x: 466, y: 286, width: 40, height: 40, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zb1);
      [[286, FY], [326, FY + FH]].forEach(([y1, y2]) => el('line', { x1: 506, y1, x2: FX[2], y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zb1));
      // 一根絨毛
      const vil = fr[2];
      const VX = 840;
      el('path', { d: `M ${VX - 90},540 L ${VX - 90},270 C ${VX - 90},180 ${VX + 90},180 ${VX + 90},270 L ${VX + 90},540 Z`, fill: '#a84a5c', stroke: '#ffb3c1', 'stroke-width': 3 }, vil);
      // 微絨毛（表面細毛）
      for (let t = 0; t <= 1.0001; t += 0.04) {
        let x, y, nx, ny;
        if (t < 0.3) { const k = t / 0.3; x = VX - 90; y = 540 - k * 270; nx = -1; ny = 0; }
        else if (t < 0.7) { const a = Math.PI * (1 - (t - 0.3) / 0.4); x = VX + Math.cos(a) * 90; y = 270 - Math.sin(a) * 68; nx = Math.cos(a); ny = -Math.sin(a); }
        else { const k = (t - 0.7) / 0.3; x = VX + 90; y = 270 + k * 270; nx = 1; ny = 0; }
        el('line', { x1: x, y1: y, x2: x + nx * 9, y2: y + ny * 9, stroke: '#ffb3c1', 'stroke-width': 2 }, vil);
      }
      const capG = g(vil);
      el('path', { d: `M ${VX - 60},540 L ${VX - 60},280 C ${VX - 60},225 ${VX + 60},225 ${VX + 60},280 L ${VX + 60},540`, fill: 'none', stroke: CAP, 'stroke-width': 7 }, capG);
      [300, 360, 420, 480].forEach((y) => el('path', { d: `M ${VX - 60},${y} C ${VX - 40},${y - 16} ${VX - 26},${y + 14} ${VX - 14},${y - 4} M ${VX + 60},${y + 20} C ${VX + 40},${y + 4} ${VX + 26},${y + 32} ${VX + 14},${y + 12}`, fill: 'none', stroke: CAP, 'stroke-width': 4 }, capG));
      el('path', { d: `M ${VX},540 L ${VX},262`, stroke: LAC, 'stroke-width': 16, 'stroke-linecap': 'round' }, vil);
      const absorb = [];
      [[VX - 150, 200, 's', VX - 60, 270], [VX - 150, 330, 'a', VX - 60, 380], [VX + 200, 250, 'f', VX, 300]].forEach(([x0, y0, k, x1, y1]) => {
        const m = g(vil);
        if (k === 's') glu(m, 0, 0, 14); else if (k === 'a') amino(m, 0, 0, 12); else fattyGly(m, 0, 0);
        absorb.push({ m, x0, y0, x1, y1 });
      });
      const cl = [
        S.callout(P3, VX - 60, 470, 745, 600, '微血管：葡萄糖、胺基酸', CAP, { size: 22 }),
        S.callout(P3, VX, 500, 1030, 600, '乳糜管：脂肪酸、甘油', LAC, { size: 22 }),
      ];
      [['小腸', '長約 6～7 m＊'], ['內壁的皺褶和絨毛', '絨毛約 1 mm＊'], ['一根絨毛', '表面還有微絨毛']].forEach(([n, s], i) => {
        const cx = FX[i] + FW[i] / 2;
        text(fr[i], cx, 128, n, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        text(fr[i], cx, 158, s, { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
      });
      const area = g(P3, { opacity: 0 });
      S.pill(area, 600, 672, '皺褶、絨毛和微絨毛使小腸內壁的表面積大幅增加，有利吸收', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.2);
      S.show(tl, fr[0], 's3+=0.4', 0.4);
      S.show(tl, zb0, 's3+=1.1', 0.3); S.show(tl, fr[1], 's3+=1.3', 0.4);
      S.show(tl, zb1, 's3+=2.1', 0.3); S.show(tl, fr[2], 's3+=2.3', 0.4);
      S.drive(tl, (u) => absorb.forEach(({ m, x0, y0, x1, y1 }, i) => { const k = S.clamp(u * 1.3 - i * 0.15); m.setAttribute('transform', `translate(${S.lerp(x0, x1, k)},${S.lerp(y0, y1, k)})`); m.style.opacity = k >= 1 ? 0.35 : 1; }), 2.4, 's3+=3', 'power1.inOut');
      cl.forEach((c, i) => S.show(tl, c, `s3+=${4.6 + i * 0.4}`, 0.35));
      S.show(tl, area, 's3+=5.6', 0.5);

      // ===== 4 大腸與排遺 =====
      const P4 = g(root, { opacity: 0 });
      const b4 = S.place(g(P4), TD);
      S.human(b4, { fill: 'rgba(44,82,104,0.25)', stroke: C.bodyEdge, sw: 1.2 });
      const D4 = S.digestive(b4);
      S.stomach(D4.stomach, { stubs: false, wall: 6, shade: true });
      [D4.eso, D4.small, D4.liver, D4.pancreas, D4.stomach].forEach((e) => e.setAttribute('opacity', 0.3));
      D4.large.setAttribute('stroke', '#ffb07a');
      const wdrops = [];
      for (let i = 0; i < 6; i++) wdrops.push(el('path', { d: 'M 0,-7 C 4,-2 5,1 5,3 C 5,6 3,8 0,8 C -3,8 -5,6 -5,3 C -5,1 -4,-2 0,-7 Z', fill: C.water, opacity: 0 }, b4));
      const dLen = D4.large.getTotalLength();
      const feces = el('ellipse', { cx: 0, cy: 0, rx: 4, ry: 3, fill: '#8a5a32', opacity: 0 }, b4);
      const t4 = g(P4, { opacity: 0 });
      S.pill(t4, 900, 300, '大腸：吸收剩下的水分', { size: 28, color: C.water, edge: C.water });
      S.pill(t4, 900, 390, '殘渣形成糞便', { size: 28, color: '#d9a066', edge: '#d9a066' });
      S.pill(t4, 900, 480, '由肛門排出：排遺', { size: 28, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        wdrops.forEach((w, i) => {
          const k = S.clamp(u * 1.6 - i * 0.1), q = D4.large.getPointAtLength(dLen * (0.15 + i * 0.13));
          w.setAttribute('transform', `translate(${q.x + (i % 2 ? 1 : -1) * k * 16},${q.y - k * 10})`);
          w.style.opacity = k > 0 && k < 1 ? 1 : 0;
        });
        const q = D4.large.getPointAtLength(dLen * S.clamp(u));
        feces.setAttribute('cx', u >= 1 ? 602 : q.x); feces.setAttribute('cy', u >= 1 ? 398 : q.y);
        feces.style.opacity = u > 0 ? 1 : 0;
      }, 4, 's4+=0.8', 'none');
      S.show(tl, t4, 's4+=1.6', 0.5);

      return {
        tl,
        notes: [
          '＊示意：器官的位置和大小都簡化了。胃腺、腸腺分布在胃和小腸的內壁，圖中沒有畫出。咽是食物和空氣共同經過的通道（補充：吞嚥時，會厭會蓋住喉的入口，避免食物進入氣管）。',
          '＊示意：分子都畫得很大。膽汁由肝臟製造、儲存在膽囊，不含酵素。',
          '＊示意：分子數目為示意。胃液含有鹽酸，能殺死部分細菌，並讓胃中的酵素在酸性環境下作用（鹽酸本身不能分解蛋白質）。胰液和膽汁經由導管送到小腸的前段；進入小腸後，鹼性的消化液會中和胃酸。科學史：1836 年許旺從胃液中找到能分解蛋白質的物質，命名為胃蛋白酶。',
          '＊長度為約略值。脂溶性的維生素（A、D、E、K）也經由乳糜管吸收；水、無機鹽和水溶性維生素主要經由微血管吸收。',
          '＊大部分的水在小腸就被吸收了，大腸再吸收剩下的水分。排遺是排出沒有被消化吸收的食物殘渣，和「排泄」（排出細胞產生的廢物）不同。',
        ],
        steps: [
          '消化系統由<b>消化管</b>和<b>消化腺</b>組成。食物依序經過：口腔 → 咽 → 食道 → 胃 → 小腸 → 大腸 → 肛門。',
          '消化分成兩種：<b>物理性消化</b>讓食物變小塊（咀嚼、蠕動、膽汁乳化）；<b>化學性消化</b>靠<b>酵素</b>把大分子分解成小分子。',
          '口腔：唾液把部分<b>澱粉</b>分解成麥芽糖；胃：胃液初步分解<b>蛋白質</b>；<b>小腸</b>：胰液、腸液和膽汁讓三大類養分都分解完成。',
          '小分子養分在<b>小腸</b>被吸收：葡萄糖、胺基酸進入<b>微血管</b>，脂肪酸和甘油進入<b>乳糜管</b>。皺褶和絨毛讓吸收的面積大幅增加。',
          '<b>大腸</b>吸收剩下的水分；沒有被消化吸收的殘渣形成糞便，由肛門排出，稱為<b>排遺</b>。',
        ],
      };
    },
  });
})();
