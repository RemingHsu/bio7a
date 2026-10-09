/* 七下 6-1 生物多樣性：三個層次（遺傳、物種、生態系）、重要性、生態系的穩定、臺灣的生物多樣性、減少的原因 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B6;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const panel = (p, x, y, w, h, title, col = C.ink, size = 28) => {
    const q = g(p);
    el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME }, q);
    if (title) text(q, x + w / 2, y + 42, title, { 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
    return q;
  };
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 3, head = 12) => {
    const a = Math.atan2(y2 - y1, x2 - x1), q = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.8, y2: y2 - Math.sin(a) * head * 0.8, stroke: col, 'stroke-width': w }, q);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, q);
    return q;
  };

  S.register({
    id: 'biodiversity', section: '下6-1', title: '生物多樣性',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 上方：三個層次的標籤（第 0～2 步） =====
      const LV = ['遺傳多樣性', '物種多樣性', '生態系多樣性'];
      const LX = [300, 600, 900];
      const track = g(root, { opacity: 0 });
      const dim = LV.map((s, i) => S.pill(track, LX[i], 44, `${i + 1} ${s}`, { size: 24, color: C.mute, edge: '#2b4252' }));
      const lit = LV.map((s, i) => { const q = S.pill(track, LX[i], 44, `${i + 1} ${s}`, { size: 24, color: C.hi, edge: C.hi, bg: C.bg }); q.style.opacity = 0; return q; });
      [443, 737].forEach((x) => el('path', { d: `M ${x},44 l 16,0 m -7,-7 l 7,7 l -7,7`, fill: 'none', stroke: C.mute, 'stroke-width': 2.5 }, track));

      // ===== 0 遺傳多樣性：同一種的個體有差異 =====
      const P0 = g(root);
      const bugs = ['many', 'none', 'red', 'black2', 'black4'].map((k, i) => { const q = at(P0, 240 + i * 180, 196, 1.12); B.ladybug(q, k); q.style.opacity = 0; return q; });
      const bugLbl = g(P0, { opacity: 0 });
      S.pill(bugLbl, 600, 312, '都是同一種：異色瓢蟲', { size: 26, color: C.hi, edge: C.hi });
      const vegs = [[B.cabbage, 380, '高麗菜'], [B.broccoli, 600, '青花菜'], [B.cauliflower, 820, '白花椰菜']].map(([fn, x, name]) => {
        const q = g(P0, { opacity: 0 });
        fn(at(q, x, 548, 1.15));
        text(q, x, 594, name, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        return q;
      });
      const vegLbl = g(P0, { opacity: 0 });
      S.pill(vegLbl, 600, 656, '都是同一種植物（甘藍），由人類選育成不同品種', { size: 24, color: '#9be58c', edge: '#6fae4a' });
      tl.addLabel('s0');
      S.show(tl, track, 's0+=0.1', 0.4);
      S.show(tl, lit[0], 's0+=0.3', 0.4);
      bugs.forEach((b, i) => S.show(tl, b, `s0+=${0.6 + i * 0.35}`, 0.4));
      S.show(tl, bugLbl, 's0+=2.5', 0.4);
      vegs.forEach((v, i) => S.show(tl, v, `s0+=${3.1 + i * 0.4}`, 0.4));
      S.show(tl, vegLbl, 's0+=4.5', 0.4);

      // ===== 1 物種多樣性：天然林 vs 單一樹種的人工林 =====
      const P1 = g(root, { opacity: 0 });
      const natP = panel(P1, 40, 84, 550, 516, null);
      const plaP = panel(P1, 610, 84, 550, 516, '只種一種樹的人工林', C.ink2);
      el('rect', { x: 612, y: 556, width: 546, height: 42, fill: '#3a3020' }, plaP);
      // 天然林：遠景 → 樹冠層 → 下層的灌木、蕨類 → 地面（落葉、溪流、倒木）→ 動物
      const forest = g(P1, { 'clip-path': B.clipBy(P1, 'M 58,86 H 572 Q 588,86 588,102 V 582 Q 588,598 572,598 H 58 Q 42,598 42,582 V 102 Q 42,86 58,86 Z') });
      el('rect', { x: 40, y: 84, width: 550, height: 516, fill: B.grad(forest, [[0, '#16304a'], [0.7, '#1b3a3c'], [1, '#1d3a30']]) }, forest);
      const nat = [];
      const layer = () => { const q = g(forest); q.style.opacity = 0; nat.push(q); return q; };
      const far = layer();
      B.farTrees(far, 30, 610, 430, { c1: '#1b3746', c2: '#203f4a', seed: 5 });
      B.farTrees(far, 30, 610, 490, { c1: '#1d3d34', c2: '#24483c', seed: 9 });
      const canopy = layer();
      B.conifer(at(canopy, 300, 548, 1), { h: 400, c1: '#2a6040', c2: '#357248' });
      B.richTree(at(canopy, 128, 552, 1), { h: 380, w: 240, seed: 3 });
      B.richTree(at(canopy, 522, 552, 1), { h: 330, w: 210, seed: 7, pal: { dark: '#3a6a2a', mid: '#5a9a3a', light: '#9ad06a', trunk: '#7a5a3a', bark: '#4a3424' } });
      B.treefern(at(canopy, 412, 556, 1), { h: 270 });
      const under = layer();
      B.shrub(at(under, 214, 552, 1), { w: 64, c: '#3f8a46' });
      B.shrub(at(under, 572, 552, 1), { w: 56, c: '#4f9a4a' });
      B.fernClump(at(under, 72, 556, 1), { s: 1 });
      B.fernClump(at(under, 352, 556, 1), { s: 0.85 });
      B.fernClump(at(under, 482, 558, 1), { s: 0.8, c: '#5aa646', c2: '#8fd06a' });
      B.herbs(at(under, 440, 558, 1), { s: 0.95 });
      const ground = layer();
      el('path', { d: 'M 40,544 C 120,534 200,548 300,540 C 400,532 480,546 592,538 L 592,600 L 40,600 Z', fill: B.grad(ground, [[0, '#4a3a22'], [1, '#2e2414']]) }, ground);
      B.litter(ground, 44, 588, 546, 596, 90, 6);
      el('path', { d: 'M 40,566 C 96,560 150,574 200,586 C 216,590 226,594 236,600', fill: 'none', stroke: '#3f7fb0', 'stroke-width': 15, 'stroke-linecap': 'round' }, ground);
      [[70, 564], [120, 568], [166, 579], [204, 590]].forEach(([x, y]) => el('path', { d: `M ${x - 9},${y} q 9,-4 18,0`, fill: 'none', stroke: '#a8d8f4', 'stroke-width': 2, opacity: 0.8 }, ground));
      B.log(at(ground, 336, 566, 1), { L: 150 });
      [[290, 551, 1.4, '#c9783a'], [312, 552, 1.05, '#d9a05a'], [380, 550, 1.25, '#c9783a']].forEach(([x, y, k, c]) => B.mushroom(at(ground, x, y, 1), { s: k, cap: c }));
      const ani = [
        (q) => B.magpie(at(q, 262, 300, 0.5)),
        (q) => B.beetle(at(q, 130, 486, 0.9)),
        (q) => B.butterfly(at(q, 472, 470, 0.42)),
        (q) => B.frog(at(q, 256, 580, 0.5)),
        (q) => B.macaque(at(q, 500, 546, 0.52)),
      ].map((fn) => { const q = g(forest); fn(q); q.style.opacity = 0; return q; });
      S.pill(P1, 315, 116, '天然林', { size: 28, color: '#9be58c', edge: '#6fae4a', bg: 'rgba(13,24,34,0.9)' });
      const pla = [];
      [[380, 120, 0.82], [470, 140, 0.9], [560, 160, 1]].forEach(([y, h, k], r) => {
        const half = h * 1.1 * 0.34, x0 = 618 + half + (r % 2) * 14, x1 = 1152 - half - ((r + 1) % 2) * 14;
        for (let i = 0; i < 5; i++) { const q = at(P1, x0 + ((x1 - x0) * i) / 4, y, 1); B.conifer(q, { h: h * 1.1, c1: k > 0.95 ? '#2f6a46' : '#2a5a40', c2: '#356f4c' }); q.style.opacity = 0; pla.push(q); }
      });
      const p1a = g(P1, { opacity: 0 }), p1b = g(P1, { opacity: 0 });
      S.pill(p1a, 315, 646, '種類多：物種多樣性高', { size: 26, color: '#9be58c', edge: '#6fae4a' });
      S.pill(p1b, 885, 646, '種類少：物種多樣性低', { size: 26, color: C.ink2, edge: '#4a6272' });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      tl.fromTo(lit[0], { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's1');
      S.show(tl, lit[1], 's1+=0.3', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      nat.forEach((q, i) => S.show(tl, q, `s1+=${0.5 + i * 0.4}`, 0.4));
      ani.forEach((q, i) => S.show(tl, q, `s1+=${2.1 + i * 0.25}`, 0.35));
      S.show(tl, p1a, 's1+=3.4', 0.4);
      S.show(tl, pla, 's1+=3.8', 0.6);
      S.show(tl, p1b, 's1+=4.6', 0.4);

      // ===== 2 生態系多樣性：從高山到海洋 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 0, y: 84, width: 1200, height: 556, fill: B.grad(P2, [[0, '#16304a'], [1, '#203e52']]) }, P2);
      const sea = 'M 930,470 L 1200,470 L 1200,640 L 930,640 Z';
      el('path', { d: sea, fill: B.grad(P2, [[0, '#2f7ab8'], [1, '#174a7a']]) }, P2);
      el('path', { d: 'M 930,470 q 15,-6 30,0 t 30,0 t 30,0 t 30,0 t 30,0 t 30,0 t 30,0 t 30,0 t 30,0', fill: 'none', stroke: '#9cd0f0', 'stroke-width': 2.5 }, P2);
      const land = 'M 0,640 L 0,300 C 60,220 120,150 170,140 C 220,150 280,230 340,290 C 400,350 460,400 520,430 C 600,455 700,465 760,470 L 930,482 C 948,520 956,590 960,640 Z';
      el('path', { d: land, fill: B.grad(P2, [[0, '#8a9a6a'], [0.35, '#3f7a46'], [1, '#2f5a36']]) }, P2);
      // 高山：低矮灌叢與岩石
      [[120, 190], [160, 168], [205, 182], [235, 210]].forEach(([x, y]) => B.shrub(at(P2, x, y, 0.4), { w: 60, c: '#5f7a4a' }));
      el('path', { d: 'M 150,150 l 14,-10 l 14,12 Z M 96,214 l 10,-8 l 12,9 Z', fill: '#8a8a80' }, P2);
      // 森林
      [[262, 262], [292, 292], [318, 280], [346, 314]].forEach(([x, y]) => B.conifer(at(P2, x, y, 1), { h: 70 }));
      [[380, 345], [416, 372], [452, 392], [490, 418]].forEach(([x, y], i) => B.broadleaf(at(P2, x, y, 1), { h: 74, seed: i + 2 }));
      // 河流
      el('path', { d: 'M 300,270 C 330,330 380,360 430,392 C 480,424 540,452 600,462 C 680,474 720,466 780,478 C 840,488 890,486 935,480', fill: 'none', stroke: '#5fb8ff', 'stroke-width': 9, 'stroke-linecap': 'round' }, P2);
      el('path', { d: 'M 300,270 C 330,330 380,360 430,392', fill: 'none', stroke: '#5fb8ff', 'stroke-width': 4 }, P2);
      [[560, 456], [650, 462], [700, 458]].forEach(([x, y]) => B.shrub(at(P2, x, y, 0.5), { w: 50, c: '#4f8f3a' }));
      // 溼地（河口）：泥灘、紅樹林、白鷺
      el('path', { d: 'M 780,478 C 820,492 880,494 935,482 L 945,520 C 900,530 830,528 790,512 Z', fill: '#6a6248' }, P2);
      [[800, 478], [836, 482], [902, 486]].forEach(([x, y]) => { const q = at(P2, x, y, 0.6); [-10, -3, 4, 11].forEach((dx) => el('path', { d: `M 0,-26 C ${dx * 0.6},-12 ${dx},-4 ${dx * 1.2},6`, fill: 'none', stroke: '#6b4a2e', 'stroke-width': 2.5 }, q)); B.shrub(at(q, 0, -22, 1), { w: 42, c: '#3f7f3a' }); });
      B.wader(at(P2, 866, 468, 0.26));
      // 海洋：珊瑚礁
      const reef = g(P2);
      [[990, 640, '#ff8f7a'], [1060, 640, '#ffcf6a'], [1140, 640, '#c88aff']].forEach(([x, y, c], i) => {
        if (i === 1) { el('path', { d: `M ${x - 30},${y} A 30,24 0 0,1 ${x + 30},${y} Z`, fill: c, opacity: 0.85 }, reef); for (let k = 0; k < 3; k++) el('path', { d: `M ${x - 22 + k * 6},${y} A ${22 - k * 6},${16 - k * 4} 0 0,1 ${x + 22 - k * 6},${y}`, fill: 'none', stroke: '#b88a3a', 'stroke-width': 2 }, reef); }
        else [-18, -6, 6, 18].forEach((dx, k) => el('path', { d: `M ${x},${y} C ${x + dx * 0.4},${y - 20} ${x + dx},${y - 30} ${x + dx * 1.3},${y - 46 - (k % 2) * 10}`, fill: 'none', stroke: c, 'stroke-width': 6, 'stroke-linecap': 'round' }, reef));
      });
      [[1010, 560], [1100, 590], [1150, 530]].forEach(([x, y], i) => B.fish(at(P2, x, y, 0.22), i === 1 ? { back: '#e8862a', mid: '#f2b25a', belly: '#fff2d8', fin: '#f0a040' } : { back: '#2f8fc8', mid: '#7fc8e8', belly: '#e8f8ff', fin: '#5fb0d8' }));
      const zones = [[170, 110, '高山', '#d9e0c0'], [420, 250, '森林', '#9be58c'], [640, 408, '河流', '#8fd0ff'], [862, 380, '溼地', '#d9c27c'], [1070, 420, '海洋', '#8fd0ff']].map(([x, y, s, c]) => { const q = g(P2, { opacity: 0 }); S.pill(q, x, y, s, { size: 26, color: c, edge: c }); return q; });
      const p2b = g(P2, { opacity: 0 });
      S.pill(p2b, 600, 676, '生態系的種類越多，生態系多樣性越高', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      tl.fromTo(lit[1], { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's2');
      S.show(tl, lit[2], 's2+=0.3', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      zones.forEach((z, i) => S.show(tl, z, `s2+=${0.9 + i * 0.5}`, 0.35));
      S.show(tl, p2b, 's2+=3.6', 0.4);

      // ===== 3 生物多樣性的重要 =====
      const P3 = g(root, { opacity: 0 });
      const cards3 = [[60, '食物', '#ffcf5c'], [425, '藥物', '#ff9a8a'], [790, '其他的功能', '#9be58c']].map(([x, t, c]) => { const q = panel(P3, x, 70, 350, 520, t, c, 30); q.style.opacity = 0; return q; });
      // 食物：稻米、魚、蔬菜
      B.rice(at(cards3[0], 150, 430, 1), { h: 170 });
      B.smallFish(at(cards3[0], 310, 230, 0.75));
      B.cabbage(at(cards3[0], 310, 430, 0.9));
      text(cards3[0], 235, 500, '米、魚、蔬菜', { 'font-size': 24, 'text-anchor': 'middle' });
      text(cards3[0], 235, 540, '都來自生物', { 'font-size': 24, 'text-anchor': 'middle' });
      // 藥物：紅豆杉 → 紫杉醇
      B.yew(at(cards3[1], 600, 220, 1.3, -8));
      text(cards3[1], 600, 312, '紅豆杉', { 'font-size': 24, 'text-anchor': 'middle', fill: '#9be58c', 'font-weight': 700 });
      arrow(cards3[1], 600, 330, 600, 384, C.ink2, 4, 14);
      const vial = at(cards3[1], 600, 440, 1);
      el('rect', { x: -26, y: -40, width: 52, height: 76, rx: 8, fill: '#a8642a', stroke: '#e8b880', 'stroke-width': 2.5 }, vial);
      el('rect', { x: -18, y: -54, width: 36, height: 16, rx: 3, fill: '#d0d6dc' }, vial);
      el('rect', { x: -22, y: -18, width: 44, height: 34, fill: '#f4efe2' }, vial);
      el('line', { x1: -14, y1: -6, x2: 14, y2: -6, stroke: '#a8642a', 'stroke-width': 3 }, vial);
      el('line', { x1: -14, y1: 4, x2: 8, y2: 4, stroke: '#a8642a', 'stroke-width': 3 }, vial);
      text(cards3[1], 600, 518, '提煉出抗癌藥物', { 'font-size': 24, 'text-anchor': 'middle' });
      text(cards3[1], 600, 556, '「紫杉醇」', { 'font-size': 24, 'text-anchor': 'middle', fill: '#ff9a8a', 'font-weight': 700 });
      // 其他的功能：授粉、保持水土
      B.flower(at(cards3[2], 880, 300, 1.2));
      B.bee(at(cards3[2], 930, 236, 1.1));
      B.broadleaf(at(cards3[2], 1040, 420, 1), { h: 190, seed: 6 });
      text(cards3[2], 965, 500, '蜜蜂幫植物授粉', { 'font-size': 24, 'text-anchor': 'middle' });
      text(cards3[2], 965, 540, '森林保持水土、淨化空氣', { 'font-size': 24, 'text-anchor': 'middle' });
      const p3b = g(P3, { opacity: 0 });
      S.pill(p3b, 600, 650, '還有許多生物的用途，人類還不知道', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, [P2, track], 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      cards3.forEach((c, i) => S.show(tl, c, `s3+=${0.6 + i * 1}`, 0.5));
      S.show(tl, p3b, 's3+=3.6', 0.4);

      // ===== 4 生態系的穩定：食物網越複雜越穩定 =====
      const P4 = g(root, { opacity: 0 });
      panel(P4, 40, 70, 400, 540, '簡單的食物鏈', C.ink2);
      panel(P4, 460, 70, 700, 540, '複雜的食物網', C.ink2);
      const COL = { p: '#6fce62', h: '#ffcf5c', c: '#ff9a5c', t: '#ff7a7a' };
      const node = (x, y, s, k) => { const q = g(P4); S.pill(q, x, y, s, { size: 26, color: COL[k], edge: COL[k] }); q.cx = x; q.cy = y; return q; };
      const L = { grass: node(170, 540, '草', 'p'), rabbit: node(170, 380, '兔', 'h'), hawk: node(170, 210, '老鷹', 't') };
      const R = {
        grass: node(600, 550, '草', 'p'), tree: node(1000, 550, '樹（果實）', 'p'),
        rabbit: node(540, 420, '兔', 'h'), mouse: node(770, 420, '鼠', 'h'), hopper: node(1030, 420, '蚱蜢', 'h'),
        snake: node(650, 290, '蛇', 'c'), frog: node(880, 300, '青蛙', 'c'), bird: node(1080, 300, '小鳥', 'c'),
        hawk: node(810, 160, '老鷹', 't'),
      };
      const link = (A, Bn, col = C.mute) => {
        const dx = Bn.cx - A.cx, dy = Bn.cy - A.cy, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
        const q = arrow(P4, A.cx + ux * 28, A.cy + uy * 24, Bn.cx - ux * 32, Bn.cy - uy * 26, col, 3, 12);
        P4.insertBefore(q, P4.children[2]);
        return q;
      };
      link(L.grass, L.rabbit); const lRH = link(L.rabbit, L.hawk);
      [[R.grass, R.rabbit], [R.grass, R.mouse], [R.grass, R.hopper], [R.tree, R.mouse], [R.tree, R.hopper], [R.hopper, R.frog], [R.hopper, R.bird], [R.mouse, R.snake], [R.frog, R.snake]].forEach(([a, b]) => link(a, b));
      const rRH = link(R.rabbit, R.hawk);
      [R.mouse, R.snake, R.bird].forEach((n) => link(n, R.hawk));
      text(P4, 600, 704, '箭頭表示「被吃」：由被吃的生物指向吃牠的生物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 事件：兔子大量減少
      const xMark = (n) => { const q = g(P4, { opacity: 0 }); el('path', { d: `M ${n.cx - 30},${n.cy - 22} L ${n.cx + 30},${n.cy + 22} M ${n.cx + 30},${n.cy - 22} L ${n.cx - 30},${n.cy + 22}`, stroke: '#ff5f74', 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.85 }, q); return q; };
      const xL = xMark(L.rabbit), xR = xMark(R.rabbit);
      const ev = g(P4, { opacity: 0 });
      S.pill(ev, 600, 34, '如果兔子大量減少…', { size: 24, color: '#ff8f9a', edge: '#ff5f74' });
      const hawkDim = el('rect', { x: 110, y: 186, width: 120, height: 48, rx: 24, fill: '#0d1822', opacity: 0 }, P4);
      const resL = g(P4, { opacity: 0 });
      text(resL, 320, 282, '老鷹沒有', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff8f9a' });
      text(resL, 320, 310, '其他食物，', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff8f9a' });
      text(resL, 320, 338, '數量也減少', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff8f9a' });
      const hiIn = [R.mouse, R.snake, R.bird].map((n) => link(n, R.hawk, C.hi));
      const resR = g(P4, { opacity: 0 });
      S.pill(resR, 1010, 160, '還能吃其他動物', { size: 22, color: C.hi, edge: C.hi });
      const p4b = g(P4, { opacity: 0 });
      S.pill(p4b, 240, 652, '容易受影響', { size: 26, color: '#ff8f9a', edge: '#ff5f74' });
      S.pill(p4b, 810, 652, '比較穩定', { size: 26, color: '#9be58c', edge: '#6fae4a' });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.show(tl, ev, 's4+=1.6', 0.4);
      S.show(tl, [xL, xR], 's4+=2', 0.4);
      tl.to([lRH, rRH], { opacity: 0.25, duration: 0.4 }, 's4+=2');
      tl.fromTo(hawkDim, { opacity: 0 }, { opacity: 0.6, duration: 0.5, immediateRender: false }, 's4+=2.8');
      S.show(tl, resL, 's4+=2.8', 0.4);
      S.show(tl, hiIn, 's4+=3.5', 0.4);
      S.show(tl, resR, 's4+=3.7', 0.4);
      S.show(tl, p4b, 's4+=4.5', 0.4);

      // ===== 5 臺灣的生物多樣性 =====
      const P5 = g(root, { opacity: 0 });
      const mapG = at(P5, 168, 382, 1);
      el('rect', { x: -150, y: -300, width: 300, height: 560, rx: 16, fill: '#13314a' }, mapG);
      const tw = B.taiwan(mapG, { k: 126 });
      const [tx1, ty] = tw.at(119.95, 23.44), [tx2] = tw.at(122.05, 23.44);
      const tropic = g(mapG, { opacity: 0 });
      el('line', { x1: tx1, y1: ty, x2: tx2, y2: ty, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, tropic);
      text(tropic, tx1 + 4, ty - 10, '北回歸線', { 'font-size': 20, fill: C.hi });
      const [yx, yy] = tw.at(120.957, 23.47);
      const peak = g(mapG, { opacity: 0 });
      el('path', { d: `M ${yx},${yy - 12} l 10,16 l -20,0 Z`, fill: '#ffffff', stroke: '#333', 'stroke-width': 1.5 }, peak);
      S.pill(peak, yx + 52, yy + 30, '玉山', { size: 20, color: C.ink, edge: '#4a6272' });
      const why = [['北回歸線經過：熱帶、亞熱帶', C.hi], ['高山多：海拔從 0 到約 3952 m', '#d9c9a0'], ['海島：四面環海、與大陸隔開', '#8fd0ff']].map(([s, c], i) => { const q = g(P5, { opacity: 0 }); S.pill(q, 470, 200 + i * 86, s, { size: 22, color: c, edge: c }); return q; });
      const sub5 = g(P5, { opacity: 0 });
      text(sub5, 470, 132, '面積不大，生物種類卻很多', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(sub5, 470, 500, '已記錄的物種約 6.5 萬種', { size: 24, color: '#9be58c', edge: '#6fae4a' });
      // 特有生物
      const CX = [800, 1050], CY = [84, 354];
      const ends = [
        [0, 0, '臺灣獼猴', '特有種', (q) => B.macaque(at(q, 790, 182, 0.85))],
        [1, 0, '帝雉（黑長尾雉）', '特有種', (q) => B.pheasant(at(q, 1100, 200, 0.6))],
        [0, 1, '臺灣黑熊', '特有亞種', (q) => B.bear(at(q, 800, 468, 0.62))],
        [1, 1, '櫻花鉤吻鮭', '特有亞種', (q) => B.salmon(at(q, 1050, 452, 0.95))],
      ].map(([i, j, name, tag, draw]) => {
        const q = g(P5, { opacity: 0 });
        el('rect', { x: CX[i] - 120, y: CY[j], width: 240, height: 256, rx: 14, ...FRAME }, q);
        draw(q);
        text(q, CX[i], CY[j] + 196, name, { 'font-size': name.length > 5 ? 22 : 24, 'text-anchor': 'middle', 'font-weight': 700 });
        S.pill(q, CX[i], CY[j] + 230, tag, { size: 20, color: tag === '特有種' ? C.hi : '#ffb35c', edge: tag === '特有種' ? C.hi : '#ffb35c' });
        return q;
      });
      const endT = g(P5, { opacity: 0 });
      text(endT, 470, 600, '只分布在臺灣的生物', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(endT, 470, 632, '→ 臺灣的特有生物', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      S.show(tl, sub5, 's5+=0.6', 0.4);
      S.show(tl, [tropic, why[0]], 's5+=1.2', 0.4);
      S.show(tl, [peak, why[1]], 's5+=2', 0.4);
      S.show(tl, why[2], 's5+=2.8', 0.4);
      ends.forEach((e, i) => S.show(tl, e, `s5+=${3.6 + i * 0.5}`, 0.4));
      S.show(tl, endT, 's5+=5.6', 0.4);

      // ===== 6 生物多樣性減少的原因 =====
      const P6 = g(root, { opacity: 0 });
      text(P6, 600, 96, '生物多樣性減少的主要原因', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const CW = 216, cxs = [126, 363, 600, 837, 1074];
      const causes = [
        ['棲地破壞', ['開發森林', '填平溼地'], (q, x) => { [[-46, 0], [0, 10], [44, -4]].forEach(([dx, dy]) => { el('path', { d: `M ${x + dx - 18},${330 + dy} L ${x + dx - 18},${300 + dy} L ${x + dx + 18},${300 + dy} L ${x + dx + 18},${330 + dy} Z`, fill: '#8a6a44', stroke: '#c8a878', 'stroke-width': 2 }, q); el('ellipse', { cx: x + dx, cy: 300 + dy, rx: 18, ry: 7, fill: '#d9b98a', stroke: '#8a6a44', 'stroke-width': 1.5 }, q); el('ellipse', { cx: x + dx, cy: 300 + dy, rx: 9, ry: 3.5, fill: 'none', stroke: '#a8865a', 'stroke-width': 1.2 }, q); }); el('rect', { x: x - 90, y: 334, width: 180, height: 10, fill: '#4a3a24' }, q); }],
        ['過度利用', ['捕撈、採集', '太多'], (q, x) => { el('path', { d: `M ${x - 60},236 C ${x - 64},300 ${x - 40},340 ${x},344 C ${x + 40},340 ${x + 64},300 ${x + 60},236 Z`, fill: 'rgba(200,220,230,0.12)', stroke: '#cfd8dc', 'stroke-width': 2 }, q); [[-30, 300], [10, 286], [20, 320], [-14, 324]].forEach(([dx, y]) => B.smallFish(at(q, x + dx, y, 0.22))); for (let i = -2; i <= 2; i++) el('path', { d: `M ${x + i * 24},236 C ${x + i * 22},290 ${x + i * 14},330 ${x + i * 6},344`, fill: 'none', stroke: '#cfd8dc', 'stroke-width': 1.2 }, q); for (let k = 1; k < 4; k++) el('path', { d: `M ${x - 62},${236 + k * 26} C ${x - 20},${244 + k * 26} ${x + 20},${244 + k * 26} ${x + 62},${236 + k * 26}`, fill: 'none', stroke: '#cfd8dc', 'stroke-width': 1.2 }, q); }],
        ['環境汙染', ['空氣、水、', '土壤的汙染'], (q, x) => { B.factory(at(q, x - 6, 370, 0.6)); B.smoke(q, x + 18, 272, 0.55); }],
        ['外來入侵種', ['排擠原生', '生物'], (q, x) => { B.snail(at(q, x - 6, 330, 0.95)); B.eggs(at(q, x + 66, 268, 0.9)); }],
        ['氣候變遷', ['全球暖化', '極端天氣'], (q, x) => { B.earth(at(q, x - 26, 290, 0.5)); const th = B.thermo(at(q, x + 56, 320, 0.55)); th.set(0.95); }],
      ].map(([t, sub, draw], i) => {
        const q = g(P6, { opacity: 0 }), x = cxs[i];
        el('rect', { x: x - CW / 2 + 4, y: 150, width: CW - 8, height: 380, rx: 14, ...FRAME }, q);
        text(q, x, 200, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ff9a8a' });
        draw(q, x);
        sub.forEach((s, k) => text(q, x, 420 + k * 34, s, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 }));
        return q;
      });
      const p6b = g(P6, { opacity: 0 });
      S.pill(p6b, 600, 610, '大多和人類活動有關，也都可以靠人類的行動改善', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      causes.forEach((c, i) => S.show(tl, c, `s6+=${0.6 + i * 0.6}`, 0.4));
      S.show(tl, p6b, 's6+=3.9', 0.5);

      return {
        tl,
        notes: [
          '＊示意：瓢蟲畫得很大。異色瓢蟲已記錄的色型超過 200 種（約）。高麗菜、青花菜、白花椰菜都是「甘藍」這一種植物，經人類長期選育成不同的品種。',
          '＊示意：圖中只畫出少數生物；天然林中還有許多昆蟲、真菌和微生物。',
          '＊示意：生態系的大小與距離都經過簡化。',
          '＊紅豆杉生長很慢，不能任意砍伐；現在也用人工栽培、生物技術等方法生產藥物原料（補充）。',
          '＊示意：真實的食物網比圖中複雜很多。生物間的食物關係在第十章學過；這裡只想說明「種類多，比較穩定」。',
          '＊臺灣面積約 3.6 萬 km²；臺灣物種名錄至 2025 年底收錄約 6.5 萬種（約，林業及自然保育署計畫報告）。臺灣黑熊、櫻花鉤吻鮭是「特有亞種」：同一種生物中，只分布在臺灣的一群。冰河時期臺灣曾和大陸相連，之後海水上升而隔開（補充）。',
          '＊11-2 會分別介紹這些原因，11-3 介紹保育的方法。',
        ],
        steps: [
          '生物多樣性有三個層次。<b>遺傳多樣性</b>：同一種生物的個體之間，遺傳（基因）有差異，所以外形、特性不同，例如異色瓢蟲的斑紋有很多種。',
          '<b>物種多樣性</b>：一個地區生物種類的多寡。天然林裡有各種樹木和動物，物種多樣性高；只種一種樹的人工林，種類通常少很多。',
          '<b>生態系多樣性</b>：一個地區生態系種類的多寡，例如高山、森林、河流、溼地、海洋，各有不同的生物生活。',
          '生物多樣性很重要：提供人類<b>食物</b>、<b>藥物</b>和各種原料；生物也幫忙授粉、保持水土、淨化空氣和水。',
          '生物種類越多，食物網越複雜。某種生物（例如兔子）減少時，老鷹還能吃其他動物，生態系比較<b>穩定</b>；簡單的食物鏈就容易受影響。',
          '臺灣面積不大，生物種類卻很多：北回歸線經過、高山多、又是海島。只分布在臺灣的物種稱為<b>特有種</b>，例如臺灣獼猴、帝雉。',
          '生物多樣性正在減少，主要原因有<b>棲地破壞</b>、<b>過度利用</b>、<b>環境汙染</b>、<b>外來入侵種</b>和<b>氣候變遷</b>，大多和人類活動有關。',
        ],
      };
    },
  });
})();
