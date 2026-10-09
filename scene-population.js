/* 七下 5-1 族群、群集與演替：個體 → 族群 → 群集 → 生態系 → 生物圈、族群大小的變化、族群成長、樣區法、捉放法、演替 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B5;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const UP = '#6fce62', DOWN = '#ff8a7a';

  S.register({
    id: 'population', section: '下5-1', title: '族群、群集與演替',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 共用：池塘的景色（第 0、1 步） =====
      const pond = g(root);
      el('rect', { x: 0, y: 430, width: 1200, height: 290, fill: '#22382a' }, pond);
      el('rect', { x: 0, y: 426, width: 1200, height: 10, fill: '#3f6a35' }, pond);
      const soil = g(pond, { opacity: 0 });
      el('rect', { x: 0, y: 640, width: 200, height: 80, fill: '#4a3624' }, soil);
      for (let k = 0; k < 14; k++) el('circle', { cx: 12 + (k * 37) % 190, cy: 660 + (k * 23) % 50, r: 3 + (k % 3), fill: '#6a5038' }, soil);
      el('ellipse', { cx: 640, cy: 600, rx: 430, ry: 118, fill: 'rgba(95,184,255,0.22)', stroke: '#8fd0ff', 'stroke-width': 3 }, pond);
      el('path', { d: 'M 330,560 q 30,-6 60,0 M 780,640 q 40,-6 80,0 M 560,690 q 30,-5 60,0', fill: 'none', stroke: '#8fd0ff', 'stroke-width': 2, opacity: 0.6 }, pond);
      const tree0 = B.tree(pond, { x: 1120, y: 436, h: 250, w: 170, seed: 3 });
      [[40, 440], [600, 440], [1000, 446]].forEach(([x, y], k) => B.grass(pond, { x, y, h: 34, w: 46, seed: k + 2 }));
      const reeds = [B.reed(pond, { x: 262, y: 500, h: 110 }), B.reed(pond, { x: 1012, y: 500, h: 100, seed: 5 })];
      const pads = [[470, 566, 34], [760, 548, 32], [900, 620, 26]].map(([x, y, r]) => B.lilypad(pond, { x, y, rad: r }));
      const fish = [[560, 650, false], [790, 676, true], [380, 640, false]].map(([x, y, f]) => B.fish(pond, { x, y, len: 54, flip: f, color: '#9ab8a0', fin: '#7a9a80', edge: '#3e5a46', opacity: 0.9 }));
      const egret = B.egret(pond, { x: 150, y: 500, s: 0.85 });
      const frogs = [[330, 452, false], [470, 560, false], [760, 542, true], [930, 450, true]].map(([x, y, f]) => B.frog(pond, { x, y, s: 0.62, flip: f }));
      const flies = [[360, 340, false], [880, 300, true]].map(([x, y, f]) => B.dragonfly(pond, { x, y, s: 1, flip: f }));

      // 層次鏈（上方）
      const CH = ['個體', '族群', '群集', '生態系', '生物圈'];
      const chainG = g(root);
      const ws = CH.map((s) => S.textWidth(s, 26) + 30), tot = ws.reduce((a, b) => a + b, 0) + 46 * (CH.length - 1);
      let cx0 = (1200 - tot) / 2;
      const chainHi = CH.map((s, i) => {
        const x = cx0 + ws[i] / 2;
        S.pill(chainG, x, 50, s, { size: 26, color: C.mute, edge: C.faint });
        const h = g(chainG, { opacity: 0 });
        S.pill(h, x, 50, s, { size: 26, color: C.hi, edge: C.hi });
        if (i < CH.length - 1) text(chainG, cx0 + ws[i] + 23, 59, '→', { 'font-size': 26, 'text-anchor': 'middle', fill: C.mute });
        cx0 += ws[i] + 46;
        return h;
      });

      // 標示圈
      const ring = (p, x, y, rx, ry, color) => el('ellipse', { cx: x, cy: y, rx, ry, fill: 'none', stroke: color, 'stroke-width': 3.5, 'stroke-dasharray': '10 6' }, p);
      const frogXY = [[336, 430], [476, 538], [754, 520], [924, 428]];
      const R0 = g(root, { opacity: 0 });
      ring(R0, ...frogXY[0], 48, 36, C.hi);
      const L0 = g(root, { opacity: 0 });
      S.pill(L0, 600, 170, '個體：一隻澤蛙', { size: 30, color: C.hi, edge: C.hi });
      const R1 = g(root, { opacity: 0 });
      frogXY.slice(1).forEach(([x, y]) => ring(R1, x, y, 48, 36, C.hi));
      const L1 = g(root, { opacity: 0 });
      S.pill(L1, 600, 150, '族群：同一區域內的同種生物', { size: 30, color: C.hi, edge: C.hi });
      text(L1, 600, 210, '例：池塘裡所有的澤蛙', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      const others = [egret, tree0, ...fish, ...pads, ...reeds, ...flies];
      const L2 = g(root, { opacity: 0 });
      S.pill(L2, 600, 150, '群集：同一區域內所有的族群', { size: 30, color: '#8fd0ff', edge: '#8fd0ff' });
      text(L2, 600, 210, '澤蛙、魚、白鷺、蜻蜓、水生植物……', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      const tags = g(root, { opacity: 0 });
      [[150, 330, '白鷺'], [446, 334, '蜻蜓'], [930, 388, '澤蛙'], [470, 652, '魚'], [262, 362, '蘆葦'], [960, 590, '睡蓮'], [1120, 160, '樹']].forEach(([x, y, s]) => S.pill(tags, x, y, s, { size: 22, color: '#8fd0ff', edge: '#4a7a9a' }));
      tl.addLabel('s0');
      S.show(tl, chainHi[0], 's0+=0.3', 0.3);
      S.show(tl, R0, 's0+=0.4', 0.4);
      S.show(tl, L0, 's0+=0.6', 0.4);
      S.hide(tl, L0, 's0+=2', 0.3);
      S.show(tl, chainHi[1], 's0+=2.2', 0.3);
      S.show(tl, R1, 's0+=2.2', 0.5);
      tl.fromTo(others, { opacity: 1 }, { opacity: 0.3, duration: 0.4, immediateRender: false }, 's0+=2.2');
      S.show(tl, L1, 's0+=2.4', 0.4);
      S.hide(tl, L1, 's0+=4.6', 0.3);
      S.hide(tl, [R0, R1], 's0+=4.6', 0.3);
      tl.fromTo(others, { opacity: 0.3 }, { opacity: 1, duration: 0.4, immediateRender: false }, 's0+=4.8');
      S.show(tl, chainHi[2], 's0+=4.8', 0.3);
      S.show(tl, L2, 's0+=5', 0.4);
      S.show(tl, tags, 's0+=5.4', 0.5);

      // ===== 1 生態系、生物圈 =====
      const P1 = g(pond, { opacity: 0 });
      const sunG = B.sun(P1, { x: 96, y: 120, rad: 34 });
      B.wind(P1, { x: 470, y: 290 });
      B.thermo(P1, { x: 740, y: 330, level: 0.55 });
      const co1 = [
        S.callout(P1, 96, 120, 270, 118, '陽光', C.hi, { size: 24 }),
        S.callout(P1, 520, 298, 520, 222, '空氣', '#cfe8ff', { size: 24 }),
        S.callout(P1, 740, 262, 740, 210, '溫度', '#ff9aa8', { size: 24 }),
        S.callout(P1, 690, 610, 690, 690, '水', C.water, { size: 24 }),
        S.callout(P1, 100, 680, 270, 690, '土壤', '#d9a066', { size: 24 }),
      ];
      const L3 = g(root, { opacity: 0 });
      S.pill(L3, 600, 130, '生態系 ＝ 群集 ＋ 非生物環境', { size: 30, color: C.hi, edge: C.hi });
      // 縮小成小圖，旁邊加上其他生態系，合起來是生物圈
      const thumbs = g(root, { opacity: 0 });
      const TB = [[60, 130, '池塘生態系'], [60, 330, '森林生態系'], [60, 530, '海洋生態系']];
      TB.forEach(([x, y, s]) => { el('rect', { x, y, width: 300, height: 150, rx: 12, fill: 'none', stroke: '#4a7a9a', 'stroke-width': 2.5 }, thumbs); text(thumbs, x + 316, y + 84, s, { 'font-size': 24, fill: C.ink }); });
      const fr = g(thumbs);
      el('rect', { x: 62, y: 332, width: 296, height: 146, rx: 10, fill: '#183022' }, fr);
      [[112, 476, 230, 150, 0.5], [182, 476, 200, 80, 0.6], [256, 476, 230, 150, 0.52], [326, 476, 170, 70, 0.6]].forEach(([x, y, h, w, s], k) => (k % 2 ? B.conifer : B.tree)(fr, { x, y, h, w, s, seed: k + 1 }));
      const oc = g(thumbs);
      el('rect', { x: 62, y: 532, width: 296, height: 146, rx: 10, fill: '#123048' }, oc);
      B.water(oc, 62, 560, 296, 118, { fill: 'rgba(60,140,220,0.35)' });
      B.fish(oc, { x: 140, y: 620, len: 50, color: '#e8b04a', fin: '#c8902a', edge: '#6a4a1a' });
      B.fish(oc, { x: 260, y: 640, len: 40, flip: true });
      B.dolphin(oc, { x: 250, y: 600, s: 0.4 });
      B.seaweed(oc, { x: 90, y: 678, h: 50 });
      const earthG = B.earth(root, { x: 860, y: 400, rad: 190 });
      earthG.style.opacity = 0;
      const arr1 = g(root, { opacity: 0 });
      [205, 405, 605].forEach((y) => B.arrow(arr1, 560, y, 660, 400 + (y - 405) * 0.45, { color: C.ink2, w: 3, head: 14 }));
      const L4 = g(root, { opacity: 0 });
      S.pill(L4, 860, 650, '生物圈：地球上所有的生態系', { size: 28, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, [L2, tags], 's1', 0.3);
      S.show(tl, P1, 's1+=0.2', 0.2);
      tl.fromTo(soil, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, 's1+=0.2');
      co1.forEach((c, i) => S.show(tl, c, `s1+=${0.4 + i * 0.4}`, 0.3));
      S.show(tl, chainHi[3], 's1+=2.4', 0.3);
      S.show(tl, L3, 's1+=2.4', 0.4);
      S.hide(tl, [L3, P1], 's1+=4.4', 0.3);
      S.move(tl, pond, { x: 0, y: 0, s: 1 }, { x: 85, y: 130, s: 0.2083 }, 1.2, 's1+=4.6');
      S.show(tl, thumbs, 's1+=5.6', 0.4);
      S.show(tl, earthG, 's1+=5.9', 0.5);
      S.show(tl, arr1, 's1+=6.2', 0.4);
      S.show(tl, chainHi[4], 's1+=6.4', 0.3);
      S.show(tl, L4, 's1+=6.6', 0.4);

      // ===== 2 族群大小的變化 =====
      const P2 = S.place(g(root, { opacity: 0 }), { x: 0, y: -24 });
      el('rect', { x: 330, y: 200, width: 540, height: 330, rx: 26, fill: '#1c3324', stroke: '#4f8a3a', 'stroke-width': 3, 'stroke-dasharray': '12 8' }, P2);
      text(P2, 600, 228, '某一片草地上的野兔族群', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      [[380, 520], [560, 522], [740, 520], [460, 360], [820, 400]].forEach(([x, y], k) => B.grass(P2, { x, y, h: 30, w: 40, seed: k + 7 }));
      const homes = [[400, 310], [500, 300], [720, 305], [815, 312], [420, 478], [560, 470], [735, 490]];
      const buns = homes.map(([x, y], k) => B.rabbit(P2, { x, y, s: 0.42, flip: k % 3 === 0 }));
      const cnt = text(P2, 600, 160, '', { 'font-size': 30, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      // 遷入（左）、遷出（右）、出生、死亡
      const inArr = g(P2, { opacity: 0 }); B.arrow(inArr, 70, 400, 320, 400, { color: UP, w: 6, head: 22 }); text(inArr, 190, 380, '遷入 ＋', { 'font-size': 28, 'text-anchor': 'middle', fill: UP, 'font-weight': 700 });
      const outArr = g(P2, { opacity: 0 }); B.arrow(outArr, 880, 400, 1130, 400, { color: DOWN, w: 6, head: 22 }); text(outArr, 1010, 380, '遷出 －', { 'font-size': 28, 'text-anchor': 'middle', fill: DOWN, 'font-weight': 700 });
      const migIn = B.rabbit(P2, { x: 60, y: 450, s: 0.42 });
      migIn.style.opacity = 0;
      const migOut = B.rabbit(P2, { x: 815, y: 470, s: 0.42 });
      const birthL = g(P2, { opacity: 0 }); S.pill(birthL, 640, 362, '出生 ＋', { size: 28, color: UP, edge: UP });
      const babies = [[612, 432], [672, 432]].map(([x, y]) => B.rabbit(P2, { x, y, s: 0.26 }));
      babies.forEach((b) => { b.style.opacity = 0; });
      const deathL = g(P2, { opacity: 0 }); S.pill(deathL, 430, 466, '死亡 －', { size: 28, color: DOWN, edge: DOWN });
      const sum2 = g(P2, { opacity: 0 });
      S.pill(sum2, 600, 660, '出生＋遷入（3）＞ 死亡＋遷出（2）→ 族群變大', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, [thumbs, earthG, arr1, L4, chainG, pond], 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      const nAt = [[0, 8], [1.6, 9], [2.8, 11], [4.2, 10], [5.6, 9]];
      S.drive(tl, (u) => { const t = u * 7; let n = 8; nAt.forEach(([tt, v]) => { if (t >= tt) n = v; }); cnt.textContent = u > 0 ? `族群的個體數：${n} 隻＊` : ''; }, 7, 's2+=0.5', 'none');
      S.show(tl, inArr, 's2+=0.8', 0.3);
      S.move(tl, migIn, { x: 60, y: 450, s: 0.42 }, { x: 380, y: 420, s: 0.42 }, 1, 's2+=1', 'power1.inOut');
      tl.fromTo(migIn, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 's2+=1');
      S.show(tl, birthL, 's2+=2.2', 0.3);
      babies.forEach((b, i) => tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, `s2+=${2.4 + i * 0.3}`));
      tl.fromTo(buns[4], { opacity: 1 }, { opacity: 0, duration: 0.8, immediateRender: false }, 's2+=3.6');
      S.show(tl, deathL, 's2+=4', 0.3);
      S.show(tl, outArr, 's2+=5', 0.3);
      S.move(tl, migOut, { x: 815, y: 470, s: 0.42 }, { x: 1100, y: 470, s: 0.42 }, 1, 's2+=5.1', 'power1.inOut');
      tl.fromTo(migOut, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's2+=5.9');
      S.show(tl, sum2, 's2+=6.4', 0.4);

      // ===== 3 族群成長：資源有限，數量趨於穩定 =====
      const P3 = g(root, { opacity: 0 });
      const AX = { x0: 150, x1: 740, y0: 560, y1: 130 };
      el('line', { x1: AX.x0, y1: AX.y0, x2: AX.x1, y2: AX.y0, stroke: C.ink2, 'stroke-width': 2.5 }, P3);
      el('line', { x1: AX.x0, y1: AX.y0, x2: AX.x0, y2: AX.y1 - 10, stroke: C.ink2, 'stroke-width': 2.5 }, P3);
      el('path', { d: `M ${AX.x1 + 12},${AX.y0} l -14,-7 l 0,14 Z M ${AX.x0},${AX.y1 - 22} l -7,14 l 14,0 Z`, fill: C.ink2 }, P3);
      text(P3, (AX.x0 + AX.x1) / 2, AX.y0 + 50, '時間＊', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      text(P3, AX.x0 + 14, AX.y1 - 2, '族群的個體數＊', { 'font-size': 26, fill: C.ink2 });
      const K = 220;
      const N = (t) => { const base = K / (1 + Math.exp(-11 * (t - 0.36))); return base + (t > 0.62 ? Math.sin((t - 0.62) * 34) * 9 * S.smoothstep(0.62, 0.75, t) : 0); };
      const xs = (t) => AX.x0 + t * (AX.x1 - AX.x0 - 20), ys = (n) => AX.y0 - n * 1.6;
      const kLine = g(P3, { opacity: 0 });
      el('line', { x1: AX.x0, y1: ys(K), x2: AX.x1 - 10, y2: ys(K), stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '10 8' }, kLine);
      text(kLine, AX.x0 + 10, ys(K) - 14, '環境能供養的最大數量', { 'font-size': 22, fill: C.hi });
      let d3 = '';
      for (let k = 0; k <= 120; k++) { const t = k / 120; d3 += `${k ? 'L' : 'M'} ${xs(t).toFixed(1)},${ys(N(t)).toFixed(1)} `; }
      const curve = el('path', { d: d3, fill: 'none', stroke: '#8fd0ff', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, P3);
      const marks = [[0.12, '1'], [0.36, '2'], [0.82, '3']].map(([t, n]) => {
        const mg = g(P3, { opacity: 0 }), x = xs(t), y = ys(N(t));
        el('circle', { cx: x, cy: y, r: 17, fill: '#0d1822', stroke: C.hi, 'stroke-width': 2.5 }, mg);
        text(mg, x, y + 8, n, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        return mg;
      });
      const notes3 = [
        ['1', '個體少、資源充足，', '數量慢慢增加'],
        ['2', '個體越來越多，', '數量增加得很快'],
        ['3', '食物、空間不夠，競爭激烈，', '數量趨於穩定、上下變動'],
      ].map(([n, a, b], i) => {
        const tg = g(P3, { opacity: 0 }), y = 180 + i * 130;
        el('circle', { cx: 800, cy: y - 8, r: 18, fill: 'none', stroke: C.hi, 'stroke-width': 2.5 }, tg);
        text(tg, 800, y, n, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        text(tg, 832, y, a, { 'font-size': 24, fill: C.ink });
        text(tg, 832, y + 36, b, { 'font-size': 24, fill: C.ink });
        return tg;
      });
      const tip3 = g(P3, { opacity: 0 });
      S.pill(tip3, 600, 666, '資源有限：族群不會一直增加下去', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drawOn(tl, curve, 4, 's3+=0.8', 'none');
      [0.8 + 0.12 * 4, 0.8 + 0.36 * 4, 0.8 + 0.82 * 4].forEach((t, i) => { S.show(tl, marks[i], `s3+=${t}`, 0.3); S.show(tl, notes3[i], `s3+=${t + 0.1}`, 0.4); });
      S.show(tl, kLine, 's3+=4', 0.5);
      S.show(tl, tip3, 's3+=5', 0.5);

      // ===== 4 樣區法 =====
      const P4 = g(root, { opacity: 0 });
      const FX = 60, FY = 150, CW = 80, COLS = 7, ROWS = 5;
      el('rect', { x: FX, y: FY, width: CW * COLS, height: CW * ROWS, fill: '#1f3a26', stroke: '#4f8a3a', 'stroke-width': 3 }, P4);
      text(P4, FX + (CW * COLS) / 2, FY - 22, `一片草地：共 ${COLS * ROWS} 個 1 m² 的方格＊`, { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const rp = S.rng(21), plants = [];
      // 每個方格的株數（不完全平均）；植物在格子裡的位置是隨機的
      const CNT = [[4, 5, 3, 6, 4, 5, 3], [5, 3, 4, 5, 6, 4, 4], [3, 6, 5, 4, 3, 5, 4], [4, 4, 6, 3, 5, 4, 5], [5, 3, 4, 5, 4, 6, 3]];
      CNT.forEach((row, r) => row.forEach((n, c) => { for (let k = 0; k < n; k++) plants.push([FX + c * CW + 10 + rp() * (CW - 20), FY + r * CW + 24 + rp() * (CW - 28)]); }));
      const grid = g(P4, { opacity: 0 });
      for (let c = 1; c < COLS; c++) el('line', { x1: FX + c * CW, y1: FY, x2: FX + c * CW, y2: FY + CW * ROWS, stroke: '#7fb07a', 'stroke-width': 1.2, opacity: 0.6 }, grid);
      for (let r = 1; r < ROWS; r++) el('line', { x1: FX, y1: FY + r * CW, x2: FX + CW * COLS, y2: FY + r * CW, stroke: '#7fb07a', 'stroke-width': 1.2, opacity: 0.6 }, grid);
      plants.forEach(([x, y]) => {
        const pg = g(P4);
        el('path', { d: `M ${x.toFixed(1)},${y.toFixed(1)} l 0,-14`, stroke: '#5faa48', 'stroke-width': 2 }, pg);
        el('path', { d: `M ${x.toFixed(1)},${(y - 6).toFixed(1)} q -6,-3 -8,-8 M ${x.toFixed(1)},${(y - 8).toFixed(1)} q 6,-3 8,-8`, fill: 'none', stroke: '#5faa48', 'stroke-width': 2 }, pg);
        el('circle', { cx: x, cy: y - 16, r: 4.5, fill: '#f4f1e6' }, pg);
        el('circle', { cx: x, cy: y - 16, r: 1.8, fill: '#e8b83a' }, pg);
      });
      const QS = [[1, 1], [4, 3], [2, 4]];
      const inCell = ([c, r]) => plants.filter(([x, y]) => x >= FX + c * CW && x < FX + (c + 1) * CW && y >= FY + r * CW && y < FY + (r + 1) * CW).length;
      const qn = QS.map(inCell), avg = (qn[0] + qn[1] + qn[2]) / 3, est = Math.round(avg * COLS * ROWS);
      const qG = QS.map(([c, r], i) => {
        const q = g(P4, { opacity: 0 });
        el('rect', { x: FX + c * CW, y: FY + r * CW, width: CW, height: CW, fill: 'rgba(255,209,102,0.12)', stroke: C.hi, 'stroke-width': 4 }, q);
        S.pill(q, FX + c * CW + CW / 2, FY + r * CW + CW + 18, `${qn[i]} 株`, { size: 22, color: C.hi, edge: C.hi });
        return q;
      });
      const R4 = [
        `樣區 1、2、3：${qn.join('、')} 株`,
        `族群密度 ≈ ${avg % 1 ? avg.toFixed(1) : avg} 株／m²`,
        `全區 ≈ ${avg % 1 ? avg.toFixed(1) : avg} × ${COLS * ROWS} ≈ ${est} 株`,
      ].map((s, i) => { const tg = g(P4, { opacity: 0 }); text(tg, 680, 230 + i * 110, s, { 'font-size': 28, fill: i === 2 ? C.hi : C.ink, 'font-weight': 700 }); return tg; });
      const lab4 = g(P4, { opacity: 0 });
      text(lab4, 680, 382, '（平均每 1 m² 有幾株）', { 'font-size': 22, fill: C.mute });
      text(lab4, 680, 492, `（實際共有 ${plants.length} 株：估算值是近似值）`, { 'font-size': 22, fill: C.mute });
      const tip4 = g(P4, { opacity: 0 });
      S.pill(tip4, 600, 640, '樣區法：適合植物等不會移動、或移動很慢的生物', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, grid, 's4+=0.9', 0.4);
      qG.forEach((q, i) => S.show(tl, q, `s4+=${1.4 + i * 0.6}`, 0.3));
      R4.forEach((r, i) => S.show(tl, r, `s4+=${3.2 + i * 0.8}`, 0.4));
      S.show(tl, lab4, 's4+=5.2', 0.4);
      S.show(tl, tip4, 's4+=5.8', 0.4);

      // ===== 5 捉放法 =====
      const P5 = g(root, { opacity: 0 });
      const PAN = [[40, '① 第一次捕捉', '捉到 30 隻，做標記後放回'], [430, '② 混合均勻', '等一段時間，和其他魚混在一起'], [820, '③ 第二次捕捉', '捉到 40 隻，其中 6 隻有標記']];
      const pans = PAN.map(([x, a, b]) => {
        const pg = g(P5, { opacity: 0 });
        el('rect', { x, y: 70, width: 340, height: 330, rx: 16, ...FRAME }, pg);
        text(pg, x + 170, 110, a, { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        text(pg, x + 170, 440, b, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
        return pg;
      });
      const mk1 = [];
      for (let k = 0; k < 30; k++) { const c = k % 6, r = Math.floor(k / 6); B.minifish(pans[0], { x: 90 + c * 48, y: 160 + r * 46, s: 1.25 }); mk1.push(B.minifish(pans[0], { x: 90 + c * 48, y: 160 + r * 46, s: 1.25, mark: true })); }
      const mkG1 = g(pans[0]); mk1.forEach((m) => { mkG1.appendChild(m); });
      mkG1.style.opacity = 0;
      B.water(pans[1], 445, 140, 310, 245);
      const rp5 = S.rng(8);
      for (let k = 0; k < 42; k++) { const c = k % 7, r = Math.floor(k / 7); B.minifish(pans[1], { x: 478 + c * 40 + (rp5() - 0.5) * 16, y: 166 + r * 38 + (rp5() - 0.5) * 12, s: 1.15, flip: rp5() > 0.5, mark: c === (r * 3 + 1) % 7 }); }
      const arr5 = g(P5, { opacity: 0 }); B.arrow(arr5, 384, 236, 428, 236, { color: C.hi, w: 4, head: 14 });
      text(arr5, 406, 216, '放回', { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
      for (let k = 0; k < 40; k++) { const c = k % 8, r = Math.floor(k / 8); B.minifish(pans[2], { x: 856 + c * 38, y: 160 + r * 46, s: 1.1, mark: [3, 9, 18, 22, 29, 36].includes(k) }); }
      const f5 = g(P5, { opacity: 0 });
      el('rect', { x: 120, y: 480, width: 960, height: 200, rx: 18, fill: 'rgba(255,209,102,0.06)', stroke: C.hi, 'stroke-width': 2 }, f5);
      text(f5, 600, 528, '有標記的比例：第二次捉到的 6 ／ 40 ≈ 族群中的 30 ／ 總數', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink });
      text(f5, 600, 586, '族群總數 ≈ 第一次標記數 × 第二次捉到的總數 ÷ 其中有標記的數', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(f5, 600, 646, '＝ 30 × 40 ÷ 6 ＝ 200（隻）', { 'font-size': 30, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.2);
      S.show(tl, pans[0], 's5+=0.4', 0.4);
      S.show(tl, mkG1, 's5+=1.2', 0.6);
      S.show(tl, arr5, 's5+=2', 0.3);
      S.show(tl, pans[1], 's5+=2.2', 0.5);
      S.show(tl, pans[2], 's5+=3.4', 0.5);
      S.show(tl, f5, 's5+=4.6', 0.5);

      // ===== 6 演替 =====
      const P6 = g(root, { opacity: 0 });
      const SX = [40, 325, 610, 895], SW = 265;
      const st = ['裸地（崩塌後）', '草本植物', '灌木', '森林'].map((s, i) => {
        const sg = g(P6, { opacity: 0 }), x = SX[i];
        el('rect', { x, y: 90, width: SW, height: 420, rx: 16, ...FRAME }, sg);
        el('path', { d: `M ${x},430 C ${x + 80},418 ${x + 180},424 ${x + SW},412 L ${x + SW},510 L ${x},510 Z`, fill: i ? '#3a3020' : '#5a4632' }, sg);
        text(sg, x + SW / 2, 552, s, { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        return sg;
      });
      [[90, 440, 18], [160, 446, 12], [230, 432, 22], [120, 470, 10]].forEach(([x, y, r]) => el('path', { d: `M ${x - r},${y} L ${x - r * 0.6},${y - r * 0.8} L ${x + r * 0.5},${y - r} L ${x + r},${y} Z`, fill: '#8a8070', stroke: '#5a5248', 'stroke-width': 2 }, st[0]));
      for (let k = 0; k < 5; k++) B.grass(st[1], { x: SX[1] + 46 + k * 43, y: 428 - (k % 2) * 4, h: 44, w: 40, seed: k + 3 });
      B.herb(st[1], { x: SX[1] + 80, y: 430, h: 64 }); B.herb(st[1], { x: SX[1] + 200, y: 428, h: 56 });
      B.grasshopper(st[1], { x: SX[1] + 150, y: 425, s: 0.45 });
      for (let k = 0; k < 4; k++) B.grass(st[2], { x: SX[2] + 44 + k * 58, y: 426, h: 34, w: 36, seed: k + 9 });
      B.shrub(st[2], { x: SX[2] + 80, y: 428, w: 110, h: 80, seed: 2 }); B.shrub(st[2], { x: SX[2] + 190, y: 424, w: 100, h: 90, seed: 4 });
      B.tree(st[2], { x: SX[2] + 140, y: 426, h: 150, w: 90, seed: 2 });
      B.rabbit(st[2], { x: SX[2] + 54, y: 430, s: 0.34 });
      B.tree(st[3], { x: SX[3] + 90, y: 426, h: 300, w: 150, seed: 5 }); B.tree(st[3], { x: SX[3] + 195, y: 420, h: 280, w: 130, seed: 7, color: '#357a3a' });
      B.shrub(st[3], { x: SX[3] + 135, y: 428, w: 90, h: 60, seed: 6 });
      B.herb(st[3], { x: SX[3] + 40, y: 432, h: 50, flower: 'none' }); B.grass(st[3], { x: SX[3] + 236, y: 424, h: 30, w: 30, seed: 4 });
      const tArr = g(P6, { opacity: 0 });
      el('line', { x1: 60, y1: 610, x2: 1140, y2: 610, stroke: C.ink2, 'stroke-width': 3 }, tArr);
      el('path', { d: 'M 1156,610 l -18,-9 l 0,18 Z', fill: C.ink2 }, tArr);
      text(tArr, 70, 650, '時間', { 'font-size': 24, fill: C.ink2 });
      const tl6 = [[317, '數年＊'], [602, '十幾年＊'], [887, '數十年以上＊']].map(([x, s]) => { const tg = g(P6, { opacity: 0 }); el('circle', { cx: x, cy: 610, r: 7, fill: C.hi }, tg); text(tg, x, 650, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi }); return tg; });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.2);
      S.show(tl, st[0], 's6+=0.4', 0.5);
      S.show(tl, tArr, 's6+=0.8', 0.4);
      [1, 2, 3].forEach((i) => { S.show(tl, tl6[i - 1], `s6+=${0.6 + i * 1.3}`, 0.3); S.show(tl, st[i], `s6+=${0.8 + i * 1.3}`, 0.6); });

      return {
        tl,
        notes: [
          '例如池塘裡所有的澤蛙是一個族群；池塘裡所有的魚「不一定」是一個族群，因為可能有好幾種魚。群集也稱為群落。七上學過：細胞 → 組織 → 器官 → 器官系統 → 個體。',
          '生物圈是地球上最大的生態系，包括所有的生物和牠們生存的環境（大氣的下層、水域和陸地的表層）。',
          '＊示意：數目只是舉例。出生＋遷入 ＞ 死亡＋遷出，族群變大；反之變小；兩邊相等時大小不變。',
          '＊示意曲線，不是真實資料。環境所能供養某一族群的最大數量，稱為「負荷量」（補充）。',
          '＊示意：方格大小、植物數目都是舉例。樣區要隨機選取、多選幾個，估算比較準確；估算的結果是近似值。',
          '＊示意數字。標記不能傷害生物、不能脫落，也不能讓生物更容易被捉到；個體分布不平均、數量太少或活動範圍太大的族群，估算的誤差較大。',
          '＊時間為約略值，依環境而不同。例：921 地震後，南投九九峰崩塌的山頭，幾年後陸續長出草本和小型木本植物。演替又稱消長；從沒有生物的地方開始叫初級演替，原本有生物、被破壞後重新開始叫次級演替（補充）。',
        ],
        steps: [
          '從<b>個體</b>看起：同一時間、同一區域內的<b>同種</b>生物，合稱<b>族群</b>；同一區域內<b>所有的族群</b>合起來，稱為<b>群集</b>。',
          '群集加上<b>非生物環境</b>（陽光、空氣、水、溫度、土壤），就是<b>生態系</b>。地球上所有的生態系合起來，稱為<b>生物圈</b>。',
          '族群的大小會改變：<b>出生</b>和<b>遷入</b>使個體增加，<b>死亡</b>和<b>遷出</b>使個體減少。',
          '環境中的食物、空間等<b>資源有限</b>：個體多了，競爭變激烈，族群增加到一定數量後就<b>趨於穩定</b>，在一個範圍內上下變動。',
          '<b>樣區法</b>：選幾個大小相同的樣區，數出樣區內的個體，求出平均的<b>族群密度</b>（單位面積內的個體數），再乘以總面積，估算全區的數量。',
          '<b>捉放法</b>：先捉一些個體做<b>標記</b>後放回，等牠們<b>混合均勻</b>再捉一次，用「有標記的比例」估算族群的總數。適合會移動的動物。',
          '<b>演替</b>：生態系中的生物組成會隨時間改變。例如崩塌後的裸地，先長出<b>草本植物</b>，再出現<b>灌木</b>，最後可能變成<b>森林</b>，動物也跟著改變。',
        ],
      };
    },
  });
})();
