/* 七下 6-3 保育與永續：就地保育、移地保育、復育的例子、法律與公約（移除外來種）、個人可以做的（5R）、永續發展 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B6;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const box = (p, x, y, w, h, title, col = C.ink, size = 28) => {
    const q = g(p);
    el('rect', { x, y, width: w, height: h, rx: 14, ...FRAME }, q);
    if (title) text(q, x + w / 2, y + 40, title, { 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
    return q;
  };
  const lines = (p, x, y, arr, { size = 22, gap = 32, fill = C.ink2, anchor = 'middle', weight } = {}) => arr.forEach((s, i) => text(p, x, y + i * gap, s, { 'font-size': size, 'text-anchor': anchor, fill, 'font-weight': weight }));
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), q = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.8, y2: y2 - Math.sin(a) * head * 0.8, stroke: col, 'stroke-width': w }, q);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, q);
    return q;
  };
  const cross = (p, x, y, r = 26) => el('path', { d: `M ${x - r},${y - r} L ${x + r},${y + r} M ${x + r},${y - r} L ${x - r},${y + r}`, stroke: '#ff5f74', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.9 }, p);

  S.register({
    id: 'conserve', section: '下6-3', title: '保育與永續',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 就地保育：保護區 =====
      const P0 = g(root);
      const mapG = at(P0, 210, 360, 1);
      el('rect', { x: -170, y: -290, width: 340, height: 560, rx: 16, fill: '#13314a' }, mapG);
      const tw = B.taiwan(mapG, { k: 124 });
      const NP = [['陽明山', 121.56, 25.17, 1], ['雪霸', 121.2, 24.42, -1], ['太魯閣', 121.5, 24.17, 1], ['玉山', 120.95, 23.45, -1], ['台江', 120.08, 23.08, -1], ['墾丁', 120.8, 21.98, 1]];
      const marks = NP.map(([n, lon, lat, side]) => {
        const q = g(mapG, { opacity: 0 }), [x, y] = tw.at(lon, lat);
        el('circle', { cx: x, cy: y, r: 9, fill: '#6fce62', stroke: '#0d1822', 'stroke-width': 2.5 }, q);
        text(q, x + side * 16, y + 7, n, { 'font-size': 20, 'text-anchor': side > 0 ? 'start' : 'end', fill: '#d8f5cf', 'font-weight': 700, stroke: '#13314a', 'stroke-width': 5, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }); // 深色描邊：壓在海岸線上也看得清楚
        return q;
      });
      text(mapG, 0, 252, '● 國家公園（例）', { 'font-size': 20, 'text-anchor': 'middle', fill: '#9be58c' });
      const KINDS = [
        ['國家公園', '#9be58c', ['保護自然景觀和生態，', '也提供教育、遊憩', '例：玉山、雪霸、墾丁']],
        ['自然保留區', '#ffb35c', ['保護珍貴的生態系或', '稀有生物，管制最嚴格', '例：淡水河紅樹林']],
        ['野生動物保護區', '#8fd0ff', ['保護野生動物和牠們', '的棲息環境', '例：曾文溪口黑面琵鷺']],
      ].map(([t, c, ls], i) => {
        const q = g(P0, { opacity: 0 }), y = 70 + i * 180;
        el('rect', { x: 420, y, width: 740, height: 166, rx: 14, ...FRAME }, q);
        el('rect', { x: 420, y, width: 12, height: 166, rx: 6, fill: c }, q);
        text(q, 456, y + 48, t, { 'font-size': 30, 'font-weight': 700, fill: c });
        lines(q, 456, y + 92, ls.slice(0, 2), { size: 22, gap: 30, anchor: 'start', fill: C.ink });
        S.pill(q, 1010, y + 48, ls[2], { size: 20, color: c, edge: c });
        return q;
      });
      const p0b = g(P0, { opacity: 0 });
      S.pill(p0b, 790, 640, '就地保育：在生物原本生活的地方保護牠們', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      marks.forEach((m, i) => S.show(tl, m, `s0+=${0.3 + i * 0.2}`, 0.3));
      KINDS.forEach((k, i) => S.show(tl, k, `s0+=${1.4 + i * 0.9}`, 0.5));
      S.show(tl, p0b, 's0+=4.2', 0.4);

      // ===== 1 移地保育 =====
      const P1 = g(root, { opacity: 0 });
      const ex = [['動物園', '#ffcf5c'], ['植物園', '#9be58c'], ['種原庫（種子庫）', '#8fd0ff']].map(([t, c], i) => { const q = box(P1, 50 + i * 372, 70, 356, 470, t, c, 28); q.style.opacity = 0; return q; });
      // 動物園：圍欄裡的熊
      el('rect', { x: 66, y: 420, width: 324, height: 50, fill: '#3f5a36' }, ex[0]);
      B.broadleaf(at(ex[0], 318, 424, 1), { h: 186, seed: 3 });
      el('path', { d: 'M 80,424 C 96,396 130,392 146,424 Z', fill: '#7a7a6e' }, ex[0]);
      B.bear(at(ex[0], 214, 376, 0.82));
      // 低矮的木頭圍欄（在前方）
      [[70, 446], [70, 466]].forEach(([x, y]) => el('line', { x1: x, y1: y, x2: 386, y2: y, stroke: '#a8865a', 'stroke-width': 6, 'stroke-linecap': 'round' }, ex[0]));
      for (let i = 0; i < 6; i++) el('rect', { x: 74 + i * 60, y: 432, width: 10, height: 44, rx: 3, fill: '#8a6a44' }, ex[0]);
      lines(ex[0], 228, 512, ['照顧、繁殖動物'], { size: 22, fill: C.ink });
      // 植物園：溫室
      const gh = at(ex[1], 600, 470, 1);
      el('path', { d: 'M -140,0 L -140,-150 C -140,-230 140,-230 140,-150 L 140,0 Z', fill: 'rgba(160,215,240,0.12)', stroke: '#cfe8ff', 'stroke-width': 3 }, gh);
      [-70, 0, 70].forEach((x) => el('line', { x1: x, y1: 0, x2: x, y2: x === 0 ? -210 : -196, stroke: '#cfe8ff', 'stroke-width': 1.5, opacity: 0.6 }, gh));
      el('line', { x1: -140, y1: -150, x2: 140, y2: -150, stroke: '#cfe8ff', 'stroke-width': 1.5, opacity: 0.6 }, gh);
      B.treefern(at(gh, -48, 0, 1), { h: 140 });
      B.shrub(at(gh, 50, 0, 1), { w: 60 });
      B.flower(at(gh, 100, -64, 0.8));
      lines(ex[1], 600, 512, ['栽培、保存稀有植物'], { size: 22, fill: C.ink });
      // 種原庫：低溫的櫃子裡放著種子
      const sb = at(ex[2], 972, 470, 1);
      el('rect', { x: -130, y: -300, width: 260, height: 300, rx: 10, fill: '#1c3a52', stroke: '#8fd0ff', 'stroke-width': 3 }, sb);
      for (let r = 0; r < 4; r++) {
        el('line', { x1: -120, y1: -230 + r * 66, x2: 120, y2: -230 + r * 66, stroke: '#8fd0ff', 'stroke-width': 2, opacity: 0.6 }, sb);
        for (let k = 0; k < 5; k++) {
          const x = -96 + k * 46, y = -230 + r * 66;
          el('rect', { x: x - 14, y: y - 46, width: 28, height: 44, rx: 4, fill: 'rgba(220,240,255,0.25)', stroke: '#cfe8ff', 'stroke-width': 1.5 }, sb);
          el('rect', { x: x - 12, y: y - 22, width: 24, height: 18, fill: ['#e3c45a', '#b5553a', '#8aa648', '#d9c9a0', '#6a4a2e'][(k + r) % 5] }, sb);
        }
      }
      const th = B.thermo(at(ex[2], 1126, 296, 0.55)); th.set(0.05);
      ['低', '溫'].forEach((c, i) => text(ex[2], 1126, 350 + i * 26, c, { 'font-size': 20, 'text-anchor': 'middle', fill: '#8fd0ff' })); // 直排：夾在櫃子和外框之間
      lines(ex[2], 972, 512, ['在低溫、乾燥下保存種子'], { size: 22, fill: C.ink });
      const p1b = g(P1, { opacity: 0 });
      S.pill(p1b, 600, 600, '移地保育：把生物或種子移到原本棲地以外的地方保存、繁殖', { size: 24, color: C.hi, edge: C.hi });
      const p1c = g(P1, { opacity: 0 });
      lines(p1c, 600, 664, ['數量增加後，有些可以再野放回原本的棲地'], { size: 22, fill: C.ink2 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      ex.forEach((e, i) => S.show(tl, e, `s1+=${0.5 + i * 0.9}`, 0.5));
      S.show(tl, p1b, 's1+=3.3', 0.4);
      S.show(tl, p1c, 's1+=3.9', 0.4);

      // ===== 2 復育成功的例子 =====
      const P2 = g(root, { opacity: 0 });
      const bar = (p, x, base, h, w, col) => el('rect', { x: x - w / 2, y: base - h, width: w, height: h, rx: 4, fill: col }, p);
      const cases = [
        { x: 40, title: '櫻花鉤吻鮭', col: '#ffb3a8', draw: (q) => { el('path', { d: 'M 60,250 C 160,236 300,262 520,244 L 520,300 C 300,316 160,292 60,306 Z', fill: '#2f6aa0', opacity: 0.8 }, q); B.salmon(at(q, 200, 270, 0.62)); B.salmon(at(q, 400, 262, 0.5)); },
          bars: [['1992 年', '約 200 尾', 200], ['2025 年', '約 1.6 萬尾', 16020]], max: 16020, how: ['拆除攔砂壩、人工繁殖放流、', '溪邊種樹讓溪水保持低溫'] },
        { x: 610, title: '黑面琵鷺（全球數量）', col: '#f4f6f1', draw: (q) => { el('path', { d: 'M 640,262 C 760,254 980,260 1130,252 L 1130,300 C 980,306 760,300 640,304 Z', fill: '#2f6aa0', opacity: 0.7 }, q); B.wader(at(q, 760, 196, 0.5), { kind: 'spoon' }); B.wader(at(q, 930, 200, 0.46), { kind: 'spoon' }); },
          bars: [['1990 年代', '不到 300 隻', 300], ['2026 年', '約 7700 隻', 7746]], max: 7746, how: ['保護溼地、劃設保護區，', '鼓勵魚塭收成後保留淺水'] },
      ].map((c) => {
        const q = g(P2, { opacity: 0 });
        el('rect', { x: c.x, y: 70, width: 550, height: 560, rx: 16, ...FRAME }, q);
        text(q, c.x + 275, 112, c.title, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: c.col });
        c.draw(q);
        const base = 520, H = 150;
        el('line', { x1: c.x + 60, y1: base, x2: c.x + 490, y2: base, stroke: C.mute, 'stroke-width': 2 }, q);
        c.bars.forEach(([yr, lab, v], i) => {
          const bx = c.x + 170 + i * 210, h = Math.max(3, (v / c.max) * H);
          q['bar' + i] = bar(q, bx, base, h, 80, i ? '#6fce62' : '#8aa1ae');
          text(q, bx, base + 30, yr, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
          text(q, bx, base - h - 12, lab, { 'font-size': 22, 'text-anchor': 'middle', fill: i ? '#9be58c' : C.ink, 'font-weight': 700 });
        });
        lines(q, c.x + 275, 584, c.how, { size: 20, gap: 28, fill: C.ink2 });
        return q;
      });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      cases.forEach((c, i) => {
        S.show(tl, c, `s2+=${0.6 + i * 1.6}`, 0.5);
        const h = +c.bar1.getAttribute('height'), y = +c.bar1.getAttribute('y');
        tl.fromTo(c.bar1, { attr: { height: 3, y: y + h - 3 } }, { attr: { height: h, y }, duration: 1, ease: 'power2.out' }, `s2+=${1.1 + i * 1.6}`);
      });

      // ===== 3 法律、公約、移除外來種 =====
      const P3 = g(root, { opacity: 0 });
      const law = box(P3, 40, 70, 360, 560, '野生動物保育法', '#ffcf5c', 28); law.style.opacity = 0;
      const doc = at(law, 220, 230, 1);
      el('path', { d: 'M -70,-90 L 50,-90 L 70,-70 L 70,90 L -70,90 Z', fill: '#efe8d6', stroke: '#c9bf9a', 'stroke-width': 2 }, doc);
      for (let i = 0; i < 6; i++) el('line', { x1: -50, y1: -56 + i * 22, x2: i % 2 ? 30 : 50, y2: -56 + i * 22, stroke: '#9a8a6a', 'stroke-width': 3 }, doc);
      el('circle', { cx: 40, cy: 66, r: 16, fill: 'none', stroke: '#c94a3a', 'stroke-width': 3 }, doc);
      text(law, 220, 368, '保育類分成三級：', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink });
      [['瀕臨絕種', '#ff8f9a'], ['珍貴稀有', '#ffb35c'], ['其他應予保育', '#ffcf5c']].forEach(([s, c], i) => S.pill(law, 220, 410 + i * 48, s, { size: 22, color: c, edge: c }));
      lines(law, 220, 576, ['不可以任意獵捕、買賣'], { size: 22, fill: C.hi, weight: 700 });
      const cites = box(P3, 420, 70, 360, 560, '華盛頓公約', '#8fd0ff', 28); cites.style.opacity = 0;
      B.earth(at(cites, 600, 250, 0.82));
      arrow(cites, 520, 180, 680, 180, '#ffcf5c', 4, 14);
      arrow(cites, 680, 320, 520, 320, '#ffcf5c', 4, 14);
      lines(cites, 600, 400, ['管制瀕臨絕種的', '野生動植物', '在國際間買賣'], { size: 22, gap: 32, fill: C.ink });
      lines(cites, 600, 540, ['不買保育類', '動植物的製品'], { size: 22, gap: 32, fill: C.hi, weight: 700 });
      const rm = box(P3, 800, 70, 360, 560, '移除外來入侵種', '#ff9a8a', 28); rm.style.opacity = 0;
      B.wader(at(rm, 964, 264, 0.55), { kind: 'ibis' });
      lines(rm, 980, 400, ['埃及聖䴉：2019 年起', '已移除約 1.8 萬隻'], { size: 22, gap: 32, fill: C.ink });
      lines(rm, 980, 480, ['也動員民眾拔除', '小花蔓澤蘭'], { size: 22, gap: 32, fill: C.ink2 });
      lines(rm, 980, 576, ['讓原生生物恢復'], { size: 22, fill: '#9be58c', weight: 700 });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      S.show(tl, law, 's3+=0.5', 0.5);
      S.show(tl, cites, 's3+=1.7', 0.5);
      S.show(tl, rm, 's3+=2.9', 0.5);

      // ===== 4 每個人都能做的 =====
      const P4 = g(root, { opacity: 0 });
      text(P4, 600, 52, '資源使用的 5R', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const R5 = [
        ['減量', ['少買、少用，', '減少垃圾'], (q, x) => { el('path', { d: `M ${x - 34},176 L ${x + 34},176 L ${x + 28},250 L ${x - 28},250 Z`, fill: '#5f6b74', stroke: '#9fb0bc', 'stroke-width': 2 }, q); el('rect', { x: x - 40, y: 166, width: 80, height: 12, rx: 3, fill: '#7f8a92' }, q); arrow(q, x + 62, 170, x + 62, 240, '#9be58c', 5, 16); }],
        ['拒絕', ['不用一次性的', '塑膠製品'], (q, x) => { el('path', { d: `M ${x - 26},180 L ${x + 26},180 L ${x + 20},252 L ${x - 20},252 Z`, fill: 'rgba(235,240,245,0.4)', stroke: '#e8eef2', 'stroke-width': 2 }, q); el('line', { x1: x + 8, y1: 150, x2: x, y2: 230, stroke: '#ff8fb1', 'stroke-width': 6, 'stroke-linecap': 'round' }, q); cross(q, x, 206, 40); }],
        ['重複使用', ['環保杯、購物袋', '用了再用'], (q, x) => { el('rect', { x: x - 54, y: 160, width: 36, height: 90, rx: 8, fill: '#3a8f7a', stroke: '#9fe0cf', 'stroke-width': 2 }, q); el('rect', { x: x - 50, y: 152, width: 28, height: 12, rx: 3, fill: '#2a6a5a' }, q); el('path', { d: `M ${x},186 L ${x + 60},186 L ${x + 54},252 L ${x + 6},252 Z`, fill: '#d9c9a0', stroke: '#f2e6c8', 'stroke-width': 2 }, q); el('path', { d: `M ${x + 12},186 C ${x + 12},156 ${x + 48},156 ${x + 48},186`, fill: 'none', stroke: '#d9c9a0', 'stroke-width': 4 }, q); }],
        ['回收', ['做好資源', '回收分類'], (q, x) => { [['#3a8fd8', -46], ['#e8c33a', 0], ['#6fae4a', 46]].forEach(([c, dx]) => { el('path', { d: `M ${x + dx - 19},184 L ${x + dx + 19},184 L ${x + dx + 15},252 L ${x + dx - 15},252 Z`, fill: c, stroke: '#e8eef2', 'stroke-width': 1.5 }, q); el('rect', { x: x + dx - 22, y: 176, width: 44, height: 10, rx: 3, fill: c }, q); }); }],
        ['再生', ['回收物製成', '新的產品'], (q, x) => { B.bottle(at(q, x - 46, 222, 0.62)); arrow(q, x - 18, 214, x + 14, 214, C.ink2, 4, 12); el('path', { d: `M ${x + 26},182 L ${x + 44},174 C ${x + 50},182 ${x + 62},182 ${x + 68},174 L ${x + 86},182 L ${x + 80},200 L ${x + 74},198 L ${x + 74},250 L ${x + 38},250 L ${x + 38},198 L ${x + 32},200 Z`, fill: '#5fa8e8', stroke: '#cfe8ff', 'stroke-width': 2 }, q); }],
      ].map(([t, ls, draw], i) => {
        const q = g(P4, { opacity: 0 }), x = 126 + i * 237;
        el('rect', { x: x - 110, y: 76, width: 220, height: 296, rx: 14, ...FRAME }, q);
        text(q, x, 122, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        draw(q, x);
        lines(q, x, 306, ls, { size: 22, gap: 30, fill: C.ink });
        return q;
      });
      const more = [
        ['節約能源', ['隨手關燈、關冷氣，', '多搭大眾運輸'], (q, x) => { el('path', { d: `M ${x - 22},480 C ${x - 46},460 ${x - 40},420 ${x},418 C ${x + 40},420 ${x + 46},460 ${x + 22},480 L ${x + 18},500 L ${x - 18},500 Z`, fill: '#ffe08a', stroke: '#e8c33a', 'stroke-width': 2 }, q); el('rect', { x: x - 16, y: 500, width: 32, height: 20, rx: 4, fill: '#9aa4ab' }, q); }],
        ['在地、當季的食物', ['減少長途運輸', '產生的二氧化碳'], (q, x) => { B.cabbage(at(q, x - 40, 520, 0.6)); B.rice(at(q, x + 40, 522, 0.7), { h: 110 }); }],
        ['不放生、不棄養', ['不讓寵物', '變成入侵種'], (q, x) => { el('rect', { x: x - 60, y: 432, width: 120, height: 86, rx: 8, fill: 'rgba(95,184,255,0.25)', stroke: '#cfe8ff', 'stroke-width': 2.5 }, q); B.fish(at(q, x - 14, 476, 0.3), { back: '#e8862a', mid: '#f2b25a', belly: '#fff2d8', fin: '#f0a040' }); B.plankton(at(q, x + 34, 506, 1.2), 2); }],
      ].map(([t, ls, draw], i) => {
        const q = g(P4, { opacity: 0 }), x = 206 + i * 394;
        el('rect', { x: x - 180, y: 396, width: 360, height: 270, rx: 14, ...FRAME }, q);
        draw(q, x);
        text(q, x, 566, t, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#9be58c' });
        lines(q, x, 604, ls, { size: 22, gap: 30, fill: C.ink });
        return q;
      });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.3);
      R5.forEach((r, i) => S.show(tl, r, `s4+=${0.5 + i * 0.5}`, 0.4));
      more.forEach((r, i) => S.show(tl, r, `s4+=${3.2 + i * 0.6}`, 0.4));

      // ===== 5 永續發展 =====
      const P5 = g(root, { opacity: 0 });
      // 地面與兩棵樹：現在 → 未來
      el('path', { d: 'M 40,420 C 300,400 900,400 1160,420 L 1160,450 L 40,450 Z', fill: '#2f5a36' }, P5);
      // 現在：拿著一盆小苗的學生；未來：牽著手的大人和小孩
      const stu = at(P5, 200, 420, 1);
      B.person(stu, { kind: 'teen', shirt: '#3a8fd8', pants: '#34495e', hands: [[-17, -94], [17, -94]] });
      el('path', { d: 'M -18,-104 L 18,-104 L 13,-78 L -13,-78 Z', fill: '#b0703c', stroke: '#7a4a24', 'stroke-width': 2 }, stu);
      el('path', { d: 'M 0,-104 L 0,-128', stroke: '#6fae4a', 'stroke-width': 4, 'stroke-linecap': 'round' }, stu);
      el('ellipse', { cx: -9, cy: -130, rx: 10, ry: 5, fill: '#7fce5a', transform: 'rotate(30 -9 -130)' }, stu);
      el('ellipse', { cx: 9, cy: -132, rx: 10, ry: 5, fill: '#6fbf4a', transform: 'rotate(-30 9 -132)' }, stu);
      [-17, 17].forEach((x) => el('circle', { cx: x, cy: -94, r: 6.7, fill: '#f2c9a0' }, stu));
      B.person(at(P5, 968, 420, 1.15), { kind: 'child', shirt: '#e8862a', pants: '#3a5a8a', hair: '#4a3020', hands: [null, [33, -73]] });
      B.person(at(P5, 1050, 420, 1), { kind: 'adult', shirt: '#6aae4a', pants: '#4a4a5a', hair: '#2a2420', hands: [[-44, -84], null] });
      text(P5, 200, 486, '現在的我們', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P5, 1000, 486, '未來的世代', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const res = g(P5, { opacity: 0 });
      el('path', { d: 'M 600,250 C 620,276 630,292 630,306 C 630,324 616,336 600,336 C 584,336 570,324 570,306 C 570,292 580,276 600,250 Z', fill: '#5fb8ff' }, res);
      B.smallFish(at(res, 470, 300, 0.42));
      B.conifer(at(res, 740, 340, 1), { h: 100 });
      text(res, 600, 380, '水、森林、魚等自然資源', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const arrs = g(P5, { opacity: 0 });
      arrow(arrs, 330, 300, 400, 300, C.ink2, 4, 14);
      arrow(arrs, 870, 300, 800, 300, C.ink2, 4, 14);
      const def = g(P5, { opacity: 0 });
      S.pill(def, 600, 70, '永續發展', { size: 30, color: C.hi, edge: C.hi });
      text(def, 600, 140, '滿足現在的需求，', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      text(def, 600, 180, '又不損害未來世代滿足需求的能力', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const sdg = g(P5, { opacity: 0 });
      text(sdg, 600, 540, '聯合國在 2015 年訂出 17 項永續發展目標（SDGs），其中包括：', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      [['13', '氣候行動', '#3f7e44'], ['14', '海洋生態', '#0a97d9'], ['15', '陸域生態', '#56a02b']].forEach(([n, t, c], i) => {
        const x = 360 + i * 240;
        el('rect', { x: x - 105, y: 566, width: 210, height: 70, rx: 10, fill: c }, sdg);
        text(sdg, x - 70, 614, n, { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffffff' });
        text(sdg, x + 22, 612, t, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffffff' });
      });
      const end = g(P5, { opacity: 0 });
      S.pill(end, 600, 686, '維持生態平衡，需要每一個人一起行動', { size: 24, color: '#9be58c', edge: '#6fae4a' });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, def, 's5+=0.6', 0.5);
      S.show(tl, [res, arrs], 's5+=1.6', 0.5);
      S.show(tl, sdg, 's5+=3', 0.5);
      S.show(tl, end, 's5+=4', 0.5);

      return {
        tl,
        notes: [
          '＊臺灣以保育為目的劃設的保護區，陸域約占臺灣陸地面積的 19%（約，林業及自然保育署統計）。地圖上只標出部分國家公園，位置是約略的。',
          '＊例如國家作物種原中心（臺中霧峰）用低溫、乾燥的方式長期保存作物的種子（補充）。示意：圖中的大小、數量都經過簡化。',
          '＊數量為約略值：櫻花鉤吻鮭來自雪霸國家公園管理處的調查；黑面琵鷺來自全球同步普查（林業及自然保育署、野鳥學會），2026 年約 6 成在臺灣度冬。長條的高度依數量比例畫出。',
          '＊野生動物保育法在 1989 年公布。違法獵捕、買賣保育類野生動物會受到處罰。埃及聖䴉的移除數量為約略值（林業及自然保育署）。',
          '＊5R 是 108 課綱列出的資源使用原則：減量、拒絕、重複使用、回收、再生。有些課本也介紹 3R（減量、重複使用、回收）。',
          '＊永續發展的說法來自 1987 年聯合國的報告《我們共同的未來》。SDGs 共有 17 項目標，這裡只列出和生物保育最相關的三項；方塊是示意，不是官方圖示。',
        ],
        steps: [
          '<b>就地保育</b>：在生物原本生活的地方保護牠們和棲地，例如設立<b>國家公園</b>、<b>自然保留區</b>、<b>野生動物保護區</b>。',
          '<b>移地保育</b>：把生物或種子移到原本棲地以外的地方保存、繁殖，例如<b>動物園</b>、<b>植物園</b>、<b>種原庫</b>（種子庫）。',
          '<b>復育</b>：幫助數量變少的生物恢復。經過保護棲地、人工繁殖等努力，櫻花鉤吻鮭和黑面琵鷺的數量都明顯增加。',
          '保育也需要法律：<b>野生動物保育法</b>保護保育類動物；<b>華盛頓公約</b>管制瀕危動植物的國際買賣。移除外來入侵種，也能幫助原生生物。',
          '每個人都能做：資源使用的 <b>5R</b>（減量、拒絕、重複使用、回收、再生），節約能源、選擇在地當季的食物，不放生、不棄養寵物。',
          '<b>永續發展</b>：滿足現在的需求，又不損害未來世代滿足需求的能力。保護生物多樣性、維持生態平衡，是永續發展的基礎。',
        ],
      };
    },
  });
})();
