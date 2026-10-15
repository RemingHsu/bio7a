/* 七下 3-1 化石：化石是什麼、化石的形成、地層的先後、地質年代、演化的證據（始祖鳥、馬）、演化的趨勢 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const ROCK = '#6f6656', ROCK_E = '#9a8f7a';
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.6, y2: y2 - Math.sin(a) * head * 0.6, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  // 不規則的岩石板
  const slab = (p, x, y, w, h, seed = 1, fill = ROCK) => {
    const r = S.rng(seed), pts = [];
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; pts.push([x + Math.cos(a) * (w / 2) * (0.9 + r() * 0.1), y + Math.sin(a) * (h / 2) * (0.88 + r() * 0.12)]); }
    el('path', { d: S.smoothPath(pts), fill, stroke: ROCK_E, 'stroke-width': 2 }, p);
    for (let i = 0; i < 26; i++) el('circle', { cx: x + (r() - 0.5) * w * 0.8, cy: y + (r() - 0.5) * h * 0.75, r: 0.8 + r() * 1.6, fill: '#a89c84', opacity: 0.4 }, p);
  };

  S.register({
    id: 'fossil', section: '下3-1', title: '化石',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const B = S.B3;

      // ===== 0 化石是什麼：遺體與遺跡 =====
      const P0 = g(root);
      const head0 = g(P0, { opacity: 0 });
      S.pill(head0, 305, 70, '遺體：生物的身體或身體的一部分', { size: 24, color: '#ffc98a', edge: '#ffc98a' });
      S.pill(head0, 895, 70, '遺跡：生物活動留下的痕跡', { size: 24, color: '#9fd8ff', edge: '#9fd8ff' });
      const CX0 = [165, 445, 755, 1035];
      const cards0 = CX0.map((x, i) => {
        const c = g(P0, { opacity: 0 });
        el('rect', { x: x - 125, y: 120, width: 250, height: 260, rx: 16, ...FRAME }, c);
        return c;
      });
      slab(cards0[0], 165, 250, 210, 220, 3);
      B.trilobite(at(cards0[0], 165, 252, 1.55));
      B.amber(at(cards0[1], 445, 252, 2));
      slab(cards0[2], 755, 250, 220, 220, 7);
      B.footprint(at(cards0[2], 716, 306, 1.1, -8));
      B.footprint(at(cards0[2], 796, 200, 1.1, 8));
      slab(cards0[3], 1035, 250, 220, 220, 11);
      B.trail(at(cards0[3], 1035, 250, 0.8, -30), 220);
      [['三葉蟲化石', '外殼'], ['琥珀中的昆蟲', '整隻身體'], ['恐龍足跡', '走路留下'], ['爬痕', '爬行留下']].forEach(([a, b], i) => {
        text(cards0[i], CX0[i], 420, a, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        text(cards0[i], CX0[i], 452, b, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      });
      const def0 = g(P0, { opacity: 0 });
      el('rect', { x: 130, y: 510, width: 940, height: 130, rx: 18, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, def0);
      text(def0, 600, 562, '化石：古代生物的遺體或遺跡，', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(def0, 600, 606, '經過很長的時間，保存在地層（岩層）中', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      tl.addLabel('s0');
      S.show(tl, head0, 's0+=0.2', 0.4);
      cards0.forEach((c, i) => S.show(tl, c, `s0+=${0.5 + i * 0.6}`, 0.4));
      S.show(tl, def0, 's0+=3.2', 0.5);

      // ===== 1 化石的形成（剖面）=====
      const P1 = g(root, { opacity: 0 });
      const X0 = 60, X1 = 1140, Y0 = 96, Y1 = 640;
      el('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0 }, el('clipPath', { id: 'fo1clip' }, el('defs', {}, P1)));
      const box = g(P1, { 'clip-path': 'url(#fo1clip)' });
      el('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, fill: '#16283a' }, box);
      const water = g(box);
      el('rect', { x: X0, y: 160, width: X1 - X0, height: 480, fill: 'rgba(70,140,200,0.32)' }, water);
      let wv = `M ${X0},160`;
      for (let x = X0; x <= X1; x += 40) wv += ` q 10,-8 20,0 q 10,8 20,0`;
      el('path', { d: wv, fill: 'none', stroke: '#9fd2ff', 'stroke-width': 3 }, water);
      text(water, 1110, 200, '水（湖或海）', { 'font-size': 22, 'text-anchor': 'end', fill: '#9fd2ff' });
      const land = g(box); // 抬升時整塊移動
      const layer = (y, h, fill) => el('rect', { x: X0, y, width: X1 - X0, height: h, fill, stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 1.5 }, land);
      layer(580, 320, '#6e5f48'); layer(530, 50, '#7f6e54');
      // 新沉積的泥沙層：[底, 最後的厚度, 顏色]
      const NL = [[530, 100, '#a08a66'], [430, 40, '#8b7758'], [390, 40, '#b29c74'], [350, 40, '#937e5e']];
      const newL = NL.map(([b, , f]) => layer(b, 0, f));
      const setLayer = (i, h, cut = 0) => { const [b] = NL[i]; newL[i].setAttribute('y', b - h); newL[i].setAttribute('height', Math.max(0, h - cut)); newL[i].setAttribute('y', b - h + cut); };
      const fishG = at(land, 260, 260, 1.3);
      const bonesW = g(fishG, { opacity: 0 }); B.fishBones(bonesW, '#efe6cc');
      const bonesS = g(fishG, { opacity: 0 }); B.fishBones(bonesS, '#2e2418', 2); B.fishBones(bonesS, '#d8bf8a');
      const flesh = g(fishG); B.fish(flesh);
      const grains = Array.from({ length: 26 }, (_, i) => el('circle', { cx: 0, cy: 0, r: 2.5 + (i % 3), fill: '#c9b48a', opacity: 0 }, box));
      const phases = ['① 生物死亡，沉到水底', '② 很快被泥沙掩埋', '③ 柔軟的部分分解，堅硬的部分被礦物質慢慢取代', '④ 地殼抬升、侵蝕後，化石露出地表'].map((s) => {
        const pg = g(P1, { opacity: 0 });
        S.pill(pg, 600, 50, s, { size: 26, color: C.hi, edge: C.hi });
        return pg;
      });
      const bury = S.callout(P1, 760, 520, 900, 470, '泥沙一層層堆積', '#e8d4a8', { size: 22 });
      const mineral = S.callout(P1, 640, 476, 880, 380, '骨骼變成像石頭一樣的化石', '#e8d4a8', { size: 22 });
      const found = S.callout(P1, 640, 312, 880, 230, '化石露出來，被人發現', C.hi, { size: 24 });
      const surf = text(P1, 90, 294, '地表', { 'font-size': 22, fill: C.mute, opacity: 0 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.show(tl, phases[0], 's1+=0.5', 0.3);
      // 魚游過來、死亡後沉到水底
      S.drive(tl, (u) => {
        const a = S.clamp(u / 0.45), b = S.clamp((u - 0.45) / 0.55);
        S.place(fishG, { x: S.lerp(260, 600, a), y: S.lerp(260, 474, b) + Math.sin(a * 12) * 6 * (1 - b), s: 1.3, r: b * 6 });
        flesh.style.opacity = 1 - b * 0.25;
      }, 2.2, 's1+=0.6', 'power1.inOut');
      S.hide(tl, phases[0], 's1+=2.9', 0.3);
      S.show(tl, phases[1], 's1+=3.1', 0.3);
      // 泥沙落下、第一層掩埋
      S.drive(tl, (u) => {
        grains.forEach((gr, i) => { const k = (u * 3 + i / grains.length) % 1; gr.setAttribute('cx', 120 + ((i * 397) % 960)); gr.setAttribute('cy', 170 + k * 300); gr.style.opacity = u > 0 && u < 1 ? 0.8 : 0; });
        setLayer(0, NL[0][1] * u);
      }, 1.8, 's1+=3.2', 'none');
      S.show(tl, bury, 's1+=4.4', 0.3);
      S.hide(tl, phases[1], 's1+=5', 0.3);
      S.show(tl, phases[2], 's1+=5.2', 0.3);
      S.hide(tl, bury, 's1+=5.2', 0.3);
      tl.fromTo(flesh, { opacity: 0.75 }, { opacity: 0, duration: 1, immediateRender: false }, 's1+=5.4');
      tl.fromTo(bonesW, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, 's1+=5.5');
      tl.fromTo(bonesS, { opacity: 0 }, { opacity: 1, duration: 1.2, immediateRender: false }, 's1+=6.6');
      S.drive(tl, (u) => { [1, 2, 3].forEach((i) => setLayer(i, NL[i][1] * S.clamp(u * 3 - (i - 1)))); }, 1.8, 's1+=6.6', 'none');
      S.show(tl, mineral, 's1+=7.6', 0.3);
      S.hide(tl, phases[2], 's1+=8.6', 0.3);
      S.hide(tl, mineral, 's1+=8.6', 0.3);
      S.show(tl, phases[3], 's1+=8.8', 0.3);
      // 抬升、水退去，再被侵蝕
      S.drive(tl, (u) => { S.place(land, { y: -150 * u }); water.style.opacity = 1 - u; }, 1.6, 's1+=9', 'power1.inOut');
      S.drive(tl, (u) => {
        [3, 2, 1].forEach((i, k) => setLayer(i, NL[i][1], NL[i][1] * S.clamp(u * 4 - k)));
        setLayer(0, NL[0][1], 26 * S.clamp(u * 4 - 3));
      }, 1.8, 's1+=10.7', 'none');
      S.show(tl, surf, 's1+=12.4', 0.3);
      S.show(tl, found, 's1+=12.6', 0.4);

      // ===== 2 地層：越下層越古老 =====
      const P2 = g(root, { opacity: 0 });
      const LX0 = 80, LX1 = 720;
      const LAY = ['#9a8462', '#7f6e54', '#a8906a', '#8a7658', '#6e5f48']; // 上→下
      const wave = (i, x) => (i >= 5 ? 590 : 130 + i * 92 + Math.sin(x * 0.012 + i * 1.7) * 7 + (i ? 0 : 0));
      const layG = LAY.map((f, i) => {
        const lg = g(P2, { opacity: 0 });
        let d = '';
        for (let x = LX0; x <= LX1; x += 20) d += `${x === LX0 ? 'M' : 'L'} ${x},${wave(i, x).toFixed(1)} `;
        for (let x = LX1; x >= LX0; x -= 20) d += `L ${x},${wave(i + 1, x).toFixed(1)} `;
        el('path', { d: d + 'Z', fill: f, stroke: 'rgba(0,0,0,0.3)', 'stroke-width': 1.5 }, lg);
        const r = S.rng(i + 4), y = 130 + i * 92;
        for (let k = 0; k < 30; k++) el('circle', { cx: LX0 + 10 + r() * (LX1 - LX0 - 20), cy: y + 16 + r() * 64, r: 1 + r() * 1.8, fill: '#000', opacity: 0.12 }, lg);
        return lg;
      });
      // 各層的化石（下→上）
      const fos2 = [
        () => B.trilobite(at(layG[4], 400, 545, 0.62)),
        () => B.fishBones(at(layG[3], 250, 452, 0.9), '#e8dcc0'),
        () => B.ammonite(at(layG[2], 520, 362, 0.62)),
        () => { B.footprint(at(layG[1], 300, 286, 0.55, 80)); B.footprint(at(layG[1], 380, 262, 0.55, 80)); },
        () => B.bone(at(layG[0], 540, 178, 0.85, -14)),
      ];
      fos2.forEach((f) => f());
      const NAMES2 = ['哺乳類的骨頭', '恐龍足跡', '菊石', '魚', '三葉蟲'];
      const lab2 = NAMES2.map((s, i) => { const lg = g(P2, { opacity: 0 }); S.pill(lg, 830, 176 + i * 92, s, { size: 22, color: C.ink, edge: '#4a6272' }); el('line', { x1: LX1 + 4, y1: 176 + i * 92, x2: 830 - S.textWidth(s, 22) / 2 - 16, y2: 176 + i * 92, stroke: '#4a6272', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, lg); return lg; });
      const age2 = g(P2, { opacity: 0 });
      arrow(age2, 960, 160, 960, 560, C.hi, 6, 20);
      text(age2, 960, 140, '較新', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(age2, 960, 600, '較古老', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const con2 = g(P2, { opacity: 0 });
      S.pill(con2, 600, 660, '沒有翻轉的地層：越下層越古老 → 推測生物出現的先後', { size: 26, color: C.hi, edge: C.hi });
      text(P2, 400, 100, '地層剖面（示意）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.3);
      [4, 3, 2, 1, 0].forEach((i, k) => { S.show(tl, layG[i], `s2+=${0.5 + k * 0.45}`, 0.35); S.show(tl, lab2[i], `s2+=${0.7 + k * 0.45}`, 0.35); });
      S.show(tl, age2, 's2+=3', 0.5);
      S.show(tl, con2, 's2+=3.8', 0.5);

      // ===== 3 地質年代（跨尺度：地球歷史 → 放大最近的 5.4 億年）=====
      const P3 = g(root, { opacity: 0 });
      const TX0 = 80, TX1 = 1120, TW = TX1 - TX0;
      const xFull = (ya) => TX0 + ((46 - ya) / 46) * TW; // ya：億年前
      const full = g(P3, { opacity: 0 });
      text(full, 600, 44, '地球的歷史約 46 億年＊', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle' });
      el('rect', { x: TX0, y: 96, width: xFull(5.4) - TX0, height: 36, rx: 6, fill: '#3a4a56' }, full);
      el('rect', { x: xFull(5.4), y: 96, width: TX1 - xFull(5.4), height: 36, fill: C.hi }, full);
      text(full, (TX0 + xFull(5.4)) / 2, 122, '更早的時期：生物大多是微小的單細胞生物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      const tick = (x, s) => { el('line', { x1: x, y1: 78, x2: x, y2: 96, stroke: C.ink2, 'stroke-width': 2 }, full); text(full, x + (x > TX0 ? -8 : 8), 86, s, { 'font-size': 20, 'text-anchor': x > TX0 ? 'end' : 'start', fill: C.ink2, transform: x > TX0 ? '' : null }); };
      tick(TX0, '地球形成'); el('line', { x1: xFull(35), y1: 78, x2: xFull(35), y2: 96, stroke: C.ink2, 'stroke-width': 2 }, full); text(full, xFull(35) + 8, 86, '最早的生物化石（約 35 億年前＊）', { 'font-size': 20, fill: C.ink2 });
      const zoom3 = g(P3, { opacity: 0 });
      el('path', { d: `M ${xFull(5.4)},132 L ${TX0},236 M ${TX1},132 L ${TX1},236`, stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '7 6', fill: 'none' }, zoom3);
      text(zoom3, 1100, 196, '放大最近約 5.4 億年＊', { 'font-size': 22, 'text-anchor': 'end', fill: C.hi });
      const xZ = (ya) => TX0 + ((5.4 - ya) / 5.4) * TW;
      const ERAS = [['古生代', 5.4, 2.5, '#6a8fb0'], ['中生代', 2.5, 0.66, '#7fae6a'], ['新生代', 0.66, 0, '#d9a066']];
      const eraG = ERAS.map(([n, a, b, col], i) => {
        const eg = g(P3, { opacity: 0 });
        el('rect', { x: xZ(a), y: 240, width: xZ(b) - xZ(a) - (i < 2 ? 3 : 0), height: 48, rx: 6, fill: col }, eg);
        text(eg, (xZ(a) + xZ(b)) / 2, 274, n, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: '#0d1822' });
        return eg;
      });
      text(eraG[0], TX0, 318, '約 5.4 億年前＊', { 'font-size': 20, fill: C.ink2 });
      text(eraG[1], xZ(2.5), 318, '約 2.5 億年前＊', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      text(eraG[2], xZ(0.66) - 6, 318, '約 6600 萬年前＊', { 'font-size': 20, 'text-anchor': 'end', fill: C.ink2 });
      text(eraG[2], TX1, 318, '現在', { 'font-size': 20, 'text-anchor': 'end', fill: C.ink2 });
      // 各時代的代表生物
      const org3 = [g(P3, { opacity: 0 }), g(P3, { opacity: 0 }), g(P3, { opacity: 0 })];
      B.trilobite(at(org3[0], 170, 460, 0.95));
      B.fish(at(org3[0], 345, 450, 0.9));
      B.fern(at(org3[0], 530, 560, 1.05), { h: 130 });
      B.sauropod(at(org3[1], 770, 526, 0.6));
      B.ammonite(at(org3[1], 924, 430, 0.62));
      B.mammoth(at(org3[2], 1058, 518, 0.48));
      const lab3 = (p, x, s, sub) => { text(p, x, 614, s, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 }); if (sub) text(p, x, 644, sub, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }); };
      lab3(org3[0], 170, '三葉蟲', '生活在海中'); lab3(org3[0], 345, '魚類'); lab3(org3[0], 530, '蕨類森林');
      lab3(org3[1], 760, '恐龍'); lab3(org3[1], 924, '菊石');
      lab3(org3[2], 1058, '長毛象', '哺乳類');
      const ext3 = g(P3, { opacity: 0 });
      S.pill(ext3, 455, 690, '三葉蟲、恐龍、菊石都已經滅絕', { size: 22, color: '#ff9a8a', edge: '#ff9a8a' });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      S.show(tl, full, 's3+=0.4', 0.5);
      S.show(tl, zoom3, 's3+=1.4', 0.5);
      eraG.forEach((e, i) => { S.show(tl, e, `s3+=${2 + i * 1}`, 0.4); S.show(tl, org3[i], `s3+=${2.3 + i * 1}`, 0.5); });
      S.show(tl, ext3, 's3+=5.2', 0.5);

      // ===== 4 始祖鳥 =====
      const P4 = g(root, { opacity: 0 });
      const RC = '#9be07a', BC = '#8fc8ff';
      el('path', { d: 'M 150,540 C 260,530 560,528 700,540 L 700,560 L 150,560 Z', fill: '#3a3226' }, P4);
      text(P4, 420, 658, '始祖鳥（復原圖＊）約 1.5 億年前＊', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const bird = at(P4, 420, 440, 1.4);
      B.archaeopteryx(bird);
      const bpt = (x, y) => [420 + x * 1.4, 440 + y * 1.4];
      const co4 = [
        [...bpt(92, -57), 660, 300, '嘴裡有牙齒', RC],
        [...bpt(50, -98), 600, 120, '翅膀前端有爪', RC],
        [...bpt(-92, 14), 220, 600, '長尾巴有尾椎骨', RC],
        [...bpt(-46, -120), 190, 130, '有羽毛、翅膀', BC],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P4, tx, ty, x, y, s, c, { size: 24 }));
      const side4 = g(P4, { opacity: 0 });
      el('rect', { x: 790, y: 90, width: 370, height: 380, rx: 16, ...FRAME }, side4);
      text(side4, 975, 136, '像爬蟲類', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: RC });
      ['・有牙齒', '・翅膀前端有爪', '・長長的尾椎骨'].forEach((s, i) => text(side4, 830, 180 + i * 38, s, { 'font-size': 24, fill: C.ink }));
      text(side4, 975, 330, '像鳥類', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: BC });
      ['・有羽毛', '・有翅膀'].forEach((s, i) => text(side4, 830, 374 + i * 38, s, { 'font-size': 24, fill: C.ink }));
      const con4 = g(P4, { opacity: 0 });
      el('rect', { x: 790, y: 500, width: 370, height: 120, rx: 16, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, con4);
      text(con4, 975, 548, '推測鳥類可能是', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(con4, 975, 588, '由爬蟲類演化而來', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      co4.forEach((c, i) => S.show(tl, c, `s4+=${0.9 + i * 0.6}`, 0.35));
      S.show(tl, side4, 's4+=3.4', 0.5);
      S.show(tl, con4, 's4+=4.4', 0.5);

      // ===== 5 馬的演化 =====
      const P5 = g(root, { opacity: 0 });
      const GY = 330;
      const H5 = [
        ['始祖馬', '約 5500 萬年前＊', 160, 0.42, { leg: 0.6, neck: 0.5, head: 0.85, arch: 1, fill: '#8a6a44', dark: '#5a4028', mane: '#5a4028' }, 4, '前腳 4 趾'],
        ['漸新馬', '約 3500 萬年前＊', 420, 0.56, { leg: 0.78, neck: 0.72, head: 0.9, arch: 0.5, fill: '#94683e' }, 3, '3 趾'],
        ['中新馬', '約 1500 萬年前＊', 700, 0.74, { leg: 0.9, neck: 0.88, head: 0.95, arch: 0.15, fill: '#9a6a3c' }, '3s', '3 趾（中趾大）'],
        ['現代馬', '現在', 1000, 0.92, {}, 1, '1 趾'],
      ];
      el('line', { x1: 50, y1: GY, x2: 1150, y2: GY, stroke: '#3d5666', 'stroke-width': 3 }, P5);
      const horses5 = H5.map(([n, t, x, s, o, toes, ts]) => {
        const hg = g(P5, { opacity: 0 });
        const G = 14 + 74 * (o.leg || 1);
        B.horse(at(hg, x, GY - G * s, s), o);
        text(hg, x, GY + 40, n, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
        text(hg, x, GY + 70, t, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        const fg = g(P5, { opacity: 0 });
        el('rect', { x: x - 80, y: 428, width: 160, height: 200, rx: 14, ...FRAME }, fg);
        B.foot(at(fg, x, 530, 0.95), toes);
        text(fg, x, 662, ts, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        return [hg, fg];
      });
      const big5 = g(P5, { opacity: 0 });
      arrow(big5, 150, 70, 880, 70, C.hi, 5, 18);
      text(big5, 515, 56, '體型變大', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const toe5 = g(P5, { opacity: 0 });
      arrow(toe5, 250, 700, 900, 700, C.hi, 4, 14);
      text(toe5, 1100, 708, '腳趾數變少', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const env5 = g(P5, { opacity: 0 });
      S.pill(env5, 1040, 70, '森林 → 草原', { size: 22, color: '#a8e39a', edge: '#a8e39a' });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.3);
      horses5.forEach(([hg, fg], i) => { S.show(tl, hg, `s5+=${0.5 + i * 0.7}`, 0.4); S.show(tl, fg, `s5+=${3.6 + i * 0.4}`, 0.4); });
      S.show(tl, big5, 's5+=3', 0.4);
      S.show(tl, toe5, 's5+=5.4', 0.4);
      S.show(tl, env5, 's5+=6', 0.4);

      // ===== 6 演化的趨勢 =====
      const P6 = g(root, { opacity: 0 });
      const row = (y, title, col) => { const rg = g(P6, { opacity: 0 }); el('rect', { x: 50, y: y - 80, width: 1100, height: 160, rx: 16, ...FRAME }, rg); text(rg, 80, y + 10, title, { 'font-size': 30, 'font-weight': 700, fill: col }); return rg; };
      const r1 = row(130, '由簡單到複雜', '#9fd8ff');
      B.bacterium(at(r1, 440, 130, 1.1));
      text(r1, 440, 186, '單細胞', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      B.trilobite(at(r1, 680, 128, 0.85));
      B.cat(at(r1, 940, 136, 0.7));
      text(r1, 810, 196, '多細胞', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      [[510, 590], [760, 840]].forEach(([a, b]) => arrow(r1, a, 130, b, 130, C.ink2, 4, 14));
      const r2 = row(330, '由水中到陸地', '#a8e39a');
      B.fish(at(r2, 420, 320, 0.75));
      B.frog(at(r2, 610, 318, 0.8));
      B.sauropod(at(r2, 830, 336, 0.32));
      B.horse(at(r2, 1040, 306, 0.42));
      [[420, '魚類'], [610, '兩生類'], [830, '爬蟲類'], [1040, '哺乳類']].forEach(([x, s]) => text(r2, x, 398, s, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }));
      [[490, 550], [670, 740], [900, 970]].forEach(([a, b]) => arrow(r2, a, 320, b, 320, C.ink2, 4, 14));
      const r3 = row(530, '種類由少到多', '#ffc98a');
      // 分支越來越多的樹
      const tree = g(r3);
      const br = (x, y, lv) => {
        if (lv > 4) { el('line', { x1: x, y1: y, x2: 1080, y2: y, stroke: '#ffc98a', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, tree); return; }
        const dx = 140, dy = 64 / Math.pow(2, lv);
        [-1, 1].forEach((s) => { const x2 = x + dx, y2 = y + s * dy; el('path', { d: `M ${x},${y} C ${x + dx * 0.5},${y} ${x + dx * 0.4},${y2} ${x2},${y2}`, fill: 'none', stroke: '#ffc98a', 'stroke-width': 6 - lv, 'stroke-linecap': 'round' }, tree); br(x2, y2, lv + 1); });
      };
      el('line', { x1: 420, y1: 530, x2: 470, y2: 530, stroke: '#ffc98a', 'stroke-width': 6, 'stroke-linecap': 'round' }, tree);
      br(470, 530, 1);
      text(r3, 400, 600, '古', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(r3, 1100, 600, '今', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const con6 = g(P6, { opacity: 0 });
      S.pill(con6, 600, 676, '化石是研究生物演化最直接的證據', { size: 28, color: C.hi, edge: C.hi });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.2);
      [r1, r2, r3].forEach((r, i) => S.show(tl, r, `s6+=${0.5 + i * 1.1}`, 0.5));
      S.show(tl, con6, 's6+=4', 0.5);

      return {
        tl,
        notes: [
          '化石大多保存在沉積岩中。琥珀是古代樹脂變硬形成的，偶爾會把小昆蟲完整保存下來；在寒冷的永凍層中，也發現過保有皮肉的長毛象。',
          '＊示意：動畫把很長的時間（往往是數百萬年以上）縮短成幾秒，地層的厚度也是示意。大多數生物死後很快被分解，沒有機會變成化石。化石要等地殼抬升、侵蝕後才露出地表。',
          '＊示意：各層的化石是舉例。有些化石能推測古代的環境，例如珊瑚生活在溫暖、清澈的淺海，在陸地上發現珊瑚化石，表示那裡以前可能是淺海。地殼變動可能讓地層彎曲、翻轉，這時就要另外判斷。',
          '＊年代都是約略值，不同資料略有差異；古生代以前的時期（前寒武紀）占了地球歷史的大部分。古生代末和中生代末都發生過大規模的生物滅絕，恐龍在中生代末滅絕。例如三葉蟲、恐龍都已經滅絕。',
          '＊示意：依化石畫出的復原圖，羽毛顏色是推測的。始祖鳥的化石在德國發現，生存於約 1.5 億年前（中生代），體型大約像烏鴉。',
          '＊年代為約略值；馬的大小比例與骨骼都簡化了（始祖馬實際上只有狐狸般大小）。牙齒的咀嚼面也越來越大，適合磨碎草。馬的演化其實像一棵有許多分支的樹，圖中只挑出其中幾種。',
          '＊示意：每一列只挑幾種生物做代表。目前發現最古老的生物化石約 35 億年前＊，是生活在海中的微小生物（例如藍綠菌）。',
        ],
        steps: [
          '<b>化石</b>：古代生物的<b>遺體</b>（外殼、骨骼……）或<b>遺跡</b>（足跡、爬痕、糞便……），經過很長的時間保存在<b>地層</b>（岩層）中。',
          '化石的形成：生物死亡後很快被<b>泥沙掩埋</b>，柔軟的部分被分解，<b>堅硬的部分</b>（骨骼、牙齒、外殼）被礦物質慢慢取代。',
          '地層是一層層堆積起來的。沒有翻轉的地層，<b>越下層越古老</b>。比較各層的化石，可以推測生物<b>出現的先後</b>。',
          '依化石紀錄把地球的歷史分成<b>地質年代</b>：<b>古生代</b>有三葉蟲；<b>中生代</b>恐龍興盛；<b>新生代</b>哺乳類興盛。有些生物已經<b>滅絕</b>。',
          '<b>始祖鳥</b>的化石同時有<b>爬蟲類</b>的特徵（牙齒、爪、長尾椎骨）和<b>鳥類</b>的特徵（羽毛、翅膀），推測鳥類可能是由爬蟲類演化而來。',
          '比較不同年代的<b>馬的化石</b>：體型<b>由小變大</b>，腳趾數<b>由多變少</b>（4 趾 → 1 趾），有利於在草原上奔跑。',
          '化石顯示生物由<b>簡單到複雜</b>、由<b>水中到陸地</b>，種類由<b>少到多</b>。這種長時間的改變就是<b>演化</b>，化石是最直接的證據。',
        ],
      };
    },
  });
})();
