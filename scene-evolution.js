/* 七下 3-2 生物的演化：拉馬克的用進廢退說、達爾文的天擇說（長頸鹿）、天擇的過程、樺尺蛾、細菌的抗藥性 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const OK = '#6fce62', NO = '#ff7a66';
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.6, y2: y2 - Math.sin(a) * head * 0.6, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  const cross = (p, x, y, r = 14, col = NO) => el('path', { d: `M ${x - r},${y - r} L ${x + r},${y + r} M ${x + r},${y - r} L ${x - r},${y + r}`, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, p);
  const tick = (p, x, y, r = 14, col = OK) => el('path', { d: `M ${x - r},${y} L ${x - r * 0.3},${y + r * 0.7} L ${x + r},${y - r * 0.8}`, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, p);
  // 樹幹（樹皮紋路；淺色時有地衣，被煤煙燻黑時沒有）
  const trunk = (p, x, y, w, h, dark, seed = 3) => {
    const t = g(p), r = S.rng(seed);
    el('rect', { x, y, width: w, height: h, rx: 10, fill: dark ? '#2b2724' : '#bdb6a4', stroke: dark ? '#4a443e' : '#8a8270', 'stroke-width': 2 }, t);
    for (let i = 0; i < Math.floor(w / 14); i++) {
      const xx = x + 8 + i * 14 + r() * 4;
      let d = `M ${xx},${y + 4}`;
      for (let yy = y + 30; yy <= y + h - 4; yy += 30) d += ` L ${(xx + (r() - 0.5) * 6).toFixed(1)},${yy}`;
      el('path', { d, fill: 'none', stroke: dark ? '#1a1715' : '#948b77', 'stroke-width': 2, opacity: 0.7 }, t);
    }
    if (!dark) for (let i = 0; i < 9; i++) el('ellipse', { cx: x + 12 + r() * (w - 24), cy: y + 20 + r() * (h - 40), rx: 10 + r() * 12, ry: 7 + r() * 8, fill: '#c9d1b8', opacity: 0.75 }, t);
    return t;
  };

  S.register({
    id: 'evolution', cards: true, animate: [4], section: '下3-2', title: '生物的演化',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const B = S.B3;
      const GY = 500; // 長頸鹿站的地面

      // ===== 0 拉馬克：用進廢退說 =====
      const P0 = g(root);
      const head0 = g(P0, { opacity: 0 });
      S.pill(head0, 600, 36, '拉馬克的「用進廢退說」', { size: 28, color: C.hi, edge: C.hi });
      const PX = [30, 420, 810];
      const pan0 = PX.map((x) => { const pg = g(P0, { opacity: 0 }); el('rect', { x, y: 70, width: 360, height: 460, rx: 16, ...FRAME }, pg); el('line', { x1: x + 10, y1: GY, x2: x + 350, y2: GY, stroke: '#4a5a3a', 'stroke-width': 3 }, pg); return pg; });
      PX.forEach((x, i) => B.acacia(at(pan0[i], x + 262, GY, 1), { top: -250, w: 150 }));
      // A：祖先常伸長脖子
      const gA = B.giraffe(at(pan0[0], 130, GY - 83, 0.55), { neck: 40, ang: 60 });
      // B：脖子變長的特徵「遺傳」給後代
      const gB = B.giraffe(at(pan0[1], 500, GY - 83, 0.55), { neck: 96, ang: 74 });
      B.giraffe(at(pan0[1], 612, GY - 46, 0.3), { neck: 104, ang: 72, baby: true });
      // C：很多代以後
      B.giraffe(at(pan0[2], 880, GY - 83, 0.55), { neck: 218, ang: 76 });
      const cap0 = [['常伸長脖子吃高處的葉子，', '脖子漸漸變長'], ['變長的脖子遺傳給後代', '（後天獲得的特徵會遺傳）'], ['一代一代累積，', '脖子越來越長']].map(([a, b], i) => {
        const cg = g(P0, { opacity: 0 });
        text(cg, PX[i] + 180, 568, a, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        text(cg, PX[i] + 180, 600, b, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
        return cg;
      });
      const ar0 = [arrow(P0, 393, 420, 417, 420, C.hi, 4, 12), arrow(P0, 783, 420, 807, 420, C.hi, 4, 12)];
      ar0.forEach((a) => a.setAttribute('opacity', 0));
      const no0 = g(P0, { opacity: 0 });
      el('rect', { x: 60, y: 628, width: 1080, height: 76, rx: 16, fill: 'rgba(255,122,102,0.10)', stroke: NO, 'stroke-width': 2 }, no0);
      cross(no0, 100, 666, 13);
      text(no0, 130, 676, '不被接受：後天獲得的特徵（例如練出來的肌肉）不會遺傳給後代', { 'font-size': 26, fill: '#ffb3a8', 'font-weight': 700 });
      tl.addLabel('s0');
      S.show(tl, head0, 's0+=0.2', 0.4);
      S.show(tl, pan0[0], 's0+=0.4', 0.4);
      S.show(tl, cap0[0], 's0+=0.6', 0.4);
      S.drive(tl, (u) => gA.set(40 + 56 * u, 60 + 14 * u), 1.8, 's0+=0.9', 'power1.inOut');
      S.show(tl, ar0[0], 's0+=2.8', 0.3);
      S.show(tl, pan0[1], 's0+=3', 0.4);
      S.show(tl, cap0[1], 's0+=3.2', 0.4);
      S.show(tl, ar0[1], 's0+=4.2', 0.3);
      S.show(tl, pan0[2], 's0+=4.4', 0.4);
      S.show(tl, cap0[2], 's0+=4.6', 0.4);
      S.show(tl, no0, 's0+=5.8', 0.5);

      // ===== 1 達爾文：天擇說（同樣用長頸鹿）=====
      const P1 = g(root, { opacity: 0 });
      S.pill(P1, 600, 36, '達爾文的「天擇說」', { size: 28, color: C.hi, edge: C.hi });
      const GEN = [['第 1 代', [44, 110, 190]], ['第 2 代', [110, 170, 210]], ['很多代以後', [200, 230, 250]]];
      const pan1 = [], gir1 = [];
      GEN.forEach(([name, necks], i) => {
        const pg = g(P1, { opacity: 0 });
        const x = PX[i];
        el('rect', { x, y: 70, width: 360, height: 460, rx: 16, ...FRAME }, pg);
        el('line', { x1: x + 10, y1: GY, x2: x + 350, y2: GY, stroke: '#4a5a3a', 'stroke-width': 3 }, pg);
        B.acacia(at(pg, x + 284, GY, 1), { top: -212, w: 106 }); // 樹冠不超出框（框寬 360）
        S.pill(pg, x + 70, 104, name, { size: 22, color: C.ink, edge: '#4a6272' });
        gir1.push(necks.map((n, k) => { const gg = at(pg, x + 62 + k * 82, GY - 64, 0.43); B.giraffe(gg, { neck: n, ang: 74 }); return gg; }));
        pan1.push(pg);
      });
      const weak1 = g(P1, { opacity: 0 });
      S.pill(weak1, 70, 360, '吃不到', { size: 20, color: NO, edge: NO });
      const cap1 = [['脖子有長有短', '（個體間有變異）'], ['脖子長的容易存活、', '留下較多後代'], ['有利的特徵', '一代代累積']].map(([a, b], i) => {
        const cg = g(P1, { opacity: 0 });
        text(cg, PX[i] + 180, 568, a, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        text(cg, PX[i] + 180, 600, b, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
        return cg;
      });
      const food1 = g(P1, { opacity: 0 });
      S.pill(food1, 210, 160, '食物不足時', { size: 22, color: C.hi, edge: C.hi });
      const ar1 = [arrow(P1, 393, 420, 417, 420, C.hi, 4, 12), arrow(P1, 783, 420, 807, 420, C.hi, 4, 12)];
      ar1.forEach((a) => a.setAttribute('opacity', 0));
      const ok1 = g(P1, { opacity: 0 });
      el('rect', { x: 60, y: 628, width: 1080, height: 76, rx: 16, fill: 'rgba(111,206,98,0.10)', stroke: OK, 'stroke-width': 2 }, ok1);
      tick(ok1, 100, 666, 13);
      text(ok1, 130, 676, '適者生存：適應環境的個體，比較容易存活並繁殖後代', { 'font-size': 26, fill: '#bff0b4', 'font-weight': 700 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.3);
      S.show(tl, pan1[0], 's1+=0.4', 0.4);
      S.show(tl, cap1[0], 's1+=0.7', 0.4);
      S.show(tl, food1, 's1+=1.5', 0.4);
      tl.fromTo(gir1[0][0], { opacity: 1 }, { opacity: 0.3, duration: 0.6, immediateRender: false }, 's1+=2.1');
      S.show(tl, weak1, 's1+=2.1', 0.4);
      S.show(tl, ar1[0], 's1+=2.8', 0.3);
      S.show(tl, pan1[1], 's1+=3', 0.4);
      S.show(tl, cap1[1], 's1+=3.2', 0.4);
      S.show(tl, ar1[1], 's1+=4.2', 0.3);
      S.show(tl, pan1[2], 's1+=4.4', 0.4);
      S.show(tl, cap1[2], 's1+=4.6', 0.4);
      S.show(tl, ok1, 's1+=5.6', 0.5);

      // ===== 2 天擇的過程 =====
      const P2 = g(root, { opacity: 0 });
      const FL = [
        ['個體有變異', '同一種生物，', '個體間有差異'],
        ['過度繁殖', '產生的後代比', '能存活的多'],
        ['生存競爭', '食物、空間有限，', '彼此競爭'],
        ['適者生存', '適應環境的個體', '容易存活、繁殖'],
        ['逐代累積', '有利的特徵', '一代代累積'],
      ];
      const BX = (i) => 30 + i * 230;
      const box2 = FL.map(([t1, a, b], i) => {
        const bg = g(P2, { opacity: 0 });
        el('rect', { x: BX(i), y: 120, width: 210, height: 430, rx: 16, ...FRAME }, bg);
        el('circle', { cx: BX(i) + 105, cy: 160, r: 22, fill: C.hi }, bg);
        text(bg, BX(i) + 105, 169, String(i + 1), { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#0d1822' });
        text(bg, BX(i) + 105, 440, t1, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(bg, BX(i) + 105, 486, a, { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink });
        text(bg, BX(i) + 105, 516, b, { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink });
        return bg;
      });
      // 小圖
      [40, 100, 170].forEach((n, k) => B.giraffe(at(box2[0], BX(0) + 52 + k * 52, 340, 0.26), { neck: n, ang: 74 }));
      B.giraffe(at(box2[1], BX(1) + 70, 330, 0.3), { neck: 140, ang: 74 });
      [0, 1, 2, 3].forEach((k) => B.giraffe(at(box2[1], BX(1) + 120 + (k % 2) * 46, 300 + Math.floor(k / 2) * 64, 0.16), { neck: 110, ang: 70, baby: true }));
      B.acacia(at(box2[2], BX(2) + 146, 390, 1), { top: -150, w: 84 });
      [60, 150].forEach((n, k) => B.giraffe(at(box2[2], BX(2) + 50 + k * 50, 344, 0.26), { neck: n, ang: 74 }));
      B.giraffe(at(box2[3], BX(3) + 120, 344, 0.26), { neck: 200, ang: 74 });
      const faded = at(box2[3], BX(3) + 60, 344, 0.26); faded.setAttribute('opacity', 0.3); B.giraffe(faded, { neck: 40, ang: 74 });
      tick(box2[3], BX(3) + 176, 250, 11); cross(box2[3], BX(3) + 40, 286, 9);
      // 5：長脖子的比例越來越高（長條）
      // 橫條：左邊寫第幾代，條越長＝長脖子的比例越高（直條的標籤放大後會擠在一起）
      el('line', { x1: BX(4) + 82, y1: 226, x2: BX(4) + 82, y2: 380, stroke: C.mute, 'stroke-width': 1.5 }, box2[4]);
      [[0.34, '第 1 代'], [0.6, '第 2 代'], [0.9, '很多代']].forEach(([f, s], k) => {
        const y = 236 + k * 52;
        el('rect', { x: BX(4) + 84, y, width: 110 * f, height: 30, rx: 4, fill: '#d9a85c' }, box2[4]);
        text(box2[4], BX(4) + 74, y + 23, s, { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      });
      text(box2[4], BX(4) + 105, 206, '長脖子的比例', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const ar2 = [0, 1, 2, 3].map((i) => { const a = arrow(P2, BX(i) + 212, 335, BX(i + 1) - 2, 335, C.hi, 3, 10); a.setAttribute('opacity', 0); return a; });
      const con2 = g(P2, { opacity: 0 });
      S.pill(con2, 600, 70, '環境把比較適應的個體「挑選」出來 → 天擇', { size: 28, color: C.hi, edge: C.hi });
      S.pill(con2, 600, 620, '變異是本來就有的，不是環境讓生物「需要」才產生', { size: 24, color: '#9fd8ff', edge: '#9fd8ff' });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.2);
      box2.forEach((b, i) => { S.show(tl, b, `s2+=${0.5 + i * 0.8}`, 0.4); if (i) S.show(tl, ar2[i - 1], `s2+=${0.4 + i * 0.8}`, 0.3); });
      S.show(tl, con2, 's2+=4.6', 0.5);

      // ===== 3 樺尺蛾（工業黑化）=====
      const P3 = g(root, { opacity: 0 });
      const ENV = [['工業革命前', false, 1], ['工業革命後', true, 5], ['空氣變乾淨後', false, 1]];
      const pan3 = ENV.map(([name, dark, nDark], i) => {
        const pg = g(P3, { opacity: 0 });
        const x = PX[i];
        el('rect', { x, y: 70, width: 360, height: 470, rx: 16, ...FRAME }, pg);
        S.pill(pg, x + 180, 98, name, { size: 24, color: C.ink, edge: '#4a6272' });
        trunk(pg, x + 90, 134, 180, 300, dark, i + 3);
        const spots = [[130, 190, -20], [222, 222, 15], [150, 300, 8], [240, 330, -10], [126, 390, 25], [210, 410, -5]];
        spots.forEach(([dx, dy, r], k) => B.moth(at(pg, x + dx, dy, 0.78, r), k < nDark));
        return pg;
      });
      // 鳥抓走顯眼的蛾
      const birds3 = [[PX[0] + 130, 190], [PX[1] + 210, 410], [PX[2] + 130, 190]].map(([mx, my]) => {
        const bg = g(P3, { opacity: 0 });
        const bd = g(bg, { transform: `translate(${mx + 78},${my - 36}) scale(-0.9,0.9)` }); // 從右邊飛來、面向蛾
        const tt = B.tit(bd); tt.setFlap(0.7);
        el('circle', { cx: mx, cy: my, r: 26, fill: 'none', stroke: NO, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, bg);
        return bg;
      });
      // 深色蛾的比例
      const bars3 = [0.08, 0.95, 0.12].map((f, i) => {
        const bg = g(P3, { opacity: 0 });
        const x = PX[i] + 30, w = 300;
        el('rect', { x, y: 466, width: w, height: 26, rx: 6, fill: '#e8e3d4' }, bg);
        el('rect', { x, y: 466, width: w * f, height: 26, rx: 6, fill: '#2b2926', stroke: '#8a857a', 'stroke-width': 1.5 }, bg);
        text(bg, PX[i] + 180, 524, ['深色蛾很少', '深色蛾占大多數', '深色蛾又變少'][i], { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: C.ink });
        return bg;
      });
      const key3 = g(P3, { opacity: 0 });
      text(key3, 600, 588, '鳥比較容易發現、吃掉和樹幹顏色不同的蛾', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(key3, 600, 628, '煤煙把樹幹燻黑後，深色的蛾不容易被發現，比較容易存活、繁殖', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(key3, 600, 690, '長條：族群中深色蛾的比例＊（深色部分）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.2);
      pan3.forEach((p, i) => { S.show(tl, p, `s3+=${0.4 + i * 1.5}`, 0.4); S.show(tl, birds3[i], `s3+=${0.9 + i * 1.5}`, 0.4); S.show(tl, bars3[i], `s3+=${1.3 + i * 1.5}`, 0.4); });
      S.show(tl, key3, 's3+=5', 0.5);

      // ===== 4 細菌的抗藥性 =====
      const P4 = g(root, { opacity: 0 });
      const DX = 380, DY = 390, DR = 250;
      el('circle', { cx: DX, cy: DY, r: DR + 10, fill: 'rgba(207,232,255,0.06)', stroke: '#cfe8ff', 'stroke-width': 4 }, P4);
      el('circle', { cx: DX, cy: DY, r: DR, fill: 'rgba(240,226,180,0.12)' }, P4);
      text(P4, DX, 700, '細菌（放大＊）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const rb = S.rng(17);
      const cells = [];
      for (let i = 0; i < 46; i++) {
        let x, y;
        do { x = DX + (rb() - 0.5) * DR * 1.8; y = DY + (rb() - 0.5) * DR * 1.8; } while (Math.hypot(x - DX, y - DY) > DR - 34);
        cells.push({ x, y, r: rb() * 180, res: i % 11 === 3 });
      }
      const resCol = { fill: '#f0a050', edge: '#a86020' };
      const cellG = cells.map((c) => { const cg = at(P4, c.x, c.y, 0.62, c.r); B.bacterium(cg, c.res ? resCol : {}); return cg; });
      // 繁殖出的新細菌（都有抗藥性）
      const kids = [];
      for (let i = 0; i < 30; i++) {
        let x, y;
        do { x = DX + (rb() - 0.5) * DR * 1.8; y = DY + (rb() - 0.5) * DR * 1.8; } while (Math.hypot(x - DX, y - DY) > DR - 34 || cells.some((c) => c.res && Math.hypot(c.x - x, c.y - y) < 40));
        const cg = at(P4, x, y, 0.62, rb() * 180); cg.setAttribute('opacity', 0); B.bacterium(cg, resCol); kids.push(cg);
      }
      const pill4 = g(P4, { opacity: 0 });
      for (let i = 0; i < 4; i++) { const pg = at(pill4, DX - 120 + i * 80, DY - 60 + (i % 2) * 90, 1, 30 + i * 20); el('rect', { x: -22, y: -9, width: 44, height: 18, rx: 9, fill: '#f2f2f2' }, pg); el('rect', { x: 0, y: -9, width: 22, height: 18, rx: 9, fill: '#e05a6a' }, pg); el('rect', { x: 0, y: -9, width: 10, height: 18, fill: '#e05a6a' }, pg); }
      const ST = ['① 細菌之間有差異：少數本來就有抗藥性', '② 使用抗生素：沒有抗藥性的被殺死', '③ 存活的細菌繁殖：有抗藥性的越來越多'].map((s, i) => {
        const sg = g(P4, { opacity: 0 });
        el('rect', { x: 680, y: 110 + i * 110, width: 490, height: 90, rx: 14, ...FRAME }, sg);
        const [a, b] = s.split('：');
        text(sg, 700, 148 + i * 110, a, { 'font-size': 24, 'font-weight': 700, fill: C.hi });
        text(sg, 700, 182 + i * 110, b, { 'font-size': 22, fill: C.ink });
        return sg;
      });
      const leg4 = g(P4, { opacity: 0 });
      B.bacterium(at(leg4, 80, 70, 0.55));
      text(leg4, 108, 78, '沒有抗藥性', { 'font-size': 20, fill: C.ink2 });
      B.bacterium(at(leg4, 270, 70, 0.55), resCol);
      text(leg4, 298, 78, '有抗藥性', { 'font-size': 20, fill: C.ink2 });
      const con4 = g(P4, { opacity: 0 });
      el('rect', { x: 680, y: 450, width: 490, height: 160, rx: 14, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, con4);
      text(con4, 925, 494, '抗生素不會讓細菌「變」出抗藥性，', { 'font-size': 23, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(con4, 925, 530, '而是把本來就有抗藥性的留下來', { 'font-size': 23, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(con4, 925, 578, '濫用抗生素 → 抗藥性細菌變多', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, leg4, 's4+=0.5', 0.4);
      S.show(tl, ST[0], 's4+=0.8', 0.4);
      S.show(tl, ST[1], 's4+=2', 0.4);
      S.show(tl, pill4, 's4+=2.2', 0.4);
      cells.forEach((c, i) => { if (!c.res) tl.fromTo(cellG[i], { opacity: 1 }, { opacity: 0, duration: 0.5, immediateRender: false }, `s4+=${2.8 + (i % 8) * 0.12}`); });
      tl.fromTo(pill4, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 's4+=4');
      S.show(tl, ST[2], 's4+=4.2', 0.4);
      kids.forEach((k, i) => S.show(tl, k, `s4+=${4.5 + (i % 6) * 0.15}`, 0.4));
      S.show(tl, con4, 's4+=5.8', 0.5);

      return {
        tl,
        notes: [
          '拉馬克（法國）在 1809 年提出。現在知道，只有生殖細胞中遺傳物質的改變才會遺傳給後代；身體在一生中因使用或鍛鍊而產生的改變，不會遺傳。補充：演化學說在高中會再詳細學習。因為後天獲得的特徵不會遺傳，所以這個學說不被接受。',
          '達爾文（英國）在 1859 年出版《物種起源》提出天擇說。＊示意：長頸鹿的數量和脖子長度都是示意；真實的變化要經過非常多代。',
          '演化發生在「族群」：個體一生中不會因為需要而改變特徵；天擇改變的是下一代中各種特徵所占的比例。適者生存：適應環境的個體容易存活、繁殖。',
          '＊示意：長條的長短只表示多或少。英國工業革命時，煤煙燻黑樹幹（樹上淺色的地衣也死了），深色樺尺蛾變得很常見；空氣汙染改善後，淺色的蛾又變多。',
          '＊示意：細菌畫得很大，顏色只是為了區分有沒有抗藥性。昆蟲對殺蟲劑產生抗藥性也是同樣的道理。抗生素要依照醫師指示使用，不可以濫用。',
        ],
        steps: [
          '<b>拉馬克</b>的<b>用進廢退說</b>：常用的器官會發達、不用的會退化，而且這些<b>後天獲得的特徵會遺傳</b>給後代。但這個學說<b>不被接受</b>。',
          '<b>達爾文</b>的<b>天擇說</b>：長頸鹿的祖先脖子<b>有長有短</b>。食物不足時，脖子長的比較容易吃到食物、存活並繁殖，長脖子的特徵一代代<b>累積</b>下來。',
          '天擇的過程：個體有<b>變異</b> → 產生的後代多於能存活的數量 → <b>生存競爭</b> → <b>適者生存</b> → 有利的變異<b>逐代累積</b>。',
          '<b>樺尺蛾</b>：工廠的煤煙把樹幹燻黑後，淺色的蛾容易被鳥發現吃掉，<b>深色的蛾</b>比較容易存活，數量變多；空氣變乾淨後，淺色的蛾又變多。',
          '<b>細菌的抗藥性</b>：使用抗生素時，本來就有抗藥性的細菌活了下來並繁殖，有抗藥性的細菌就越來越多。這也是<b>天擇</b>。',
        ],
      };
    },
  });
})();
