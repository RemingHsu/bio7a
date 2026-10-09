/* 1-1 生命現象：代謝、生長與發育、感應與運動、生殖；生物 vs 非生物；生存條件與生物圈 */
(() => {
  const { el, g, text, C } = S;
  const OK = '#6fce62', NO = '#ff7a66';

  // ---------- 小圖示（原點在圖示中心） ----------
  function cat(p) {
    const c = g(p);
    el('path', { d: 'M 48,8 C 90,-10 92,-60 70,-70', stroke: '#e8944a', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, c);
    el('ellipse', { cx: 10, cy: 18, rx: 58, ry: 36, fill: '#f2a65a' }, c);
    [[-30, 48], [-8, 50], [28, 50], [48, 46]].forEach(([x, y]) => el('rect', { x: x - 7, y, width: 14, height: 26, rx: 6, fill: '#e8944a' }, c));
    el('path', { d: 'M -78,-40 L -70,-78 L -50,-52 Z M -30,-52 L -14,-80 L -8,-44 Z', fill: '#e8944a' }, c);
    el('circle', { cx: -44, cy: -28, r: 32, fill: '#f2a65a' }, c);
    [[-56, -32], [-32, -32]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 4, ry: 6, fill: '#2b1a10' }, c));
    el('path', { d: 'M -48,-18 l 4,4 l 4,-4', stroke: '#2b1a10', 'stroke-width': 2.5, fill: 'none' }, c);
    return c;
  }
  function sprout(p) {
    const s = g(p);
    el('path', { d: 'M -46,30 L 46,30 L 36,84 L -36,84 Z', fill: '#b0703c' }, s);
    el('rect', { x: -50, y: 22, width: 100, height: 14, rx: 4, fill: '#8a5530' }, s);
    el('path', { d: 'M 0,26 C 0,-10 -4,-40 2,-70', stroke: '#6fce62', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, s);
    el('ellipse', { cx: -26, cy: -72, rx: 28, ry: 13, fill: '#6fce62', transform: 'rotate(-25 -26 -72)' }, s);
    el('ellipse', { cx: 30, cy: -76, rx: 28, ry: 13, fill: '#58b84e', transform: 'rotate(25 30 -76)' }, s);
    return s;
  }
  function robot(p) {
    const r = g(p);
    el('line', { x1: 0, y1: -108, x2: 0, y2: -88, stroke: '#9fb3c1', 'stroke-width': 4 }, r);
    el('circle', { cx: 0, cy: -112, r: 7, fill: C.hi }, r);
    el('rect', { x: -38, y: -88, width: 76, height: 56, rx: 12, fill: '#9fb3c1' }, r);
    [[-15, -60], [15, -60]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 8, fill: '#62d0ff' }, r));
    el('rect', { x: -46, y: -26, width: 92, height: 76, rx: 10, fill: '#7f95a4' }, r);
    el('rect', { x: -66, y: -20, width: 16, height: 56, rx: 7, fill: '#9fb3c1' }, r);
    el('rect', { x: 50, y: -20, width: 16, height: 56, rx: 7, fill: '#9fb3c1' }, r);
    el('rect', { x: -32, y: 50, width: 20, height: 36, rx: 6, fill: '#9fb3c1' }, r);
    el('rect', { x: 12, y: 50, width: 20, height: 36, rx: 6, fill: '#9fb3c1' }, r);
    el('circle', { cx: 0, cy: 10, r: 10, fill: '#ff6b6b' }, r);
    return r;
  }
  function stalactite(p) {
    const s = g(p);
    el('path', { d: 'M -100,-110 L 100,-110 L 100,-80 C 60,-70 -60,-72 -100,-80 Z', fill: '#8a7a62' }, s);
    [[-60, 70], [-20, 130], [22, 90], [62, 50]].forEach(([x, h]) => el('path', { d: `M ${x - 18},-80 L ${x + 18},-80 L ${x},${-80 + h} Z`, fill: '#d9c9a8' }, s));
    el('path', { d: 'M -20,62 q -6,10 0,16 q 6,-6 0,-16 Z', fill: '#62a8ff' }, s);
    el('path', { d: 'M -46,86 L 6,86 L -20,60 Z', fill: '#d9c9a8', opacity: 0.8 }, s);
    return s;
  }
  const ICONS = [['貓', cat], ['綠豆芽', sprout], ['機器人', robot], ['鐘乳石', stalactite]];

  // 1＝有、0＝沒有、2＝看起來類似但原因不同
  const check = (p, x, y, v) => el('path', v === 1
    ? { d: `M ${x - 18},${y} l 12,13 l 24,-28`, stroke: OK, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
    : v === 2 ? { d: `M ${x},${y - 18} L ${x + 18},${y + 14} L ${x - 18},${y + 14} Z`, stroke: C.hi, 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round' }
    : { d: `M ${x - 14},${y - 14} l 28,28 M ${x + 14},${y - 14} l -28,28`, stroke: NO, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, p);
  const panel = (p, x, y, w, h, title, col) => {
    const q = g(p);
    el('rect', { x, y, width: w, height: h, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, q);
    text(q, x + 24, y + 42, title, { 'font-size': 30, 'font-weight': 700, fill: col || C.ink });
    return q;
  };
  const hexAt = (p, x, y, r, col) => {
    let d = '';
    for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`; }
    return el('path', { d: d + 'Z', fill: 'none', stroke: col, 'stroke-width': 5 }, p);
  };
  // 外層 g 放位置、內層給 GSAP 做動畫
  const at = (p, x, y, s = 1) => g(S.place(g(p), { x, y, s }));

  S.register({
    id: 'life', section: '1-1', title: '生命現象',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 生物還是非生物 =====
      const P0 = g(root);
      text(P0, 600, 92, '哪些是生物？', { 'font-size': 40, 'font-weight': 700, 'text-anchor': 'middle' });
      const cards = ICONS.map(([name, draw], i) => {
        const x = 180 + i * 280, c = g(P0);
        el('rect', { x: x - 120, y: 150, width: 240, height: 330, rx: 22, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, c);
        draw(at(c, x, 310, 1));
        text(c, x, 450, name, { 'font-size': 32, 'font-weight': 700, 'text-anchor': 'middle' });
        return c;
      });
      const four = g(P0, { opacity: 0 });
      [['代謝', '#ffb35c'], ['生長與發育', OK], ['感應與運動', '#62a8ff'], ['生殖', '#ff8fb1']].forEach(([n, col], i) => S.pill(four, 210 + i * 260, 570, n, { size: 30, color: col, edge: col }));
      text(four, 600, 650, '常見的四類生命現象', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });

      tl.addLabel('s0');
      tl.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 's0');
      S.show(tl, four, 's0+=1', 0.4);
      tl.fromTo(four.children, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.15, ease: 'back.out(2)' }, 's0+=1');

      // ===== 1 代謝 =====
      const P1 = g(root, { opacity: 0 });
      panel(P1, 60, 120, 520, 480, '分解：大分子 → 小分子 ＋ 能量', '#ffb35c');
      panel(P1, 620, 120, 520, 480, '合成：小分子 ＋ 能量 → 大分子', OK);
      const brk = [], sparkA = [];
      for (let i = 0; i < 6; i++) brk.push(at(P1, 200 + i * 48, 330));
      brk.forEach((b) => hexAt(b, 0, 0, 22, C.sugar));
      for (let i = 0; i < 6; i++) { const s = at(P1, 320, 330); el('path', { d: 'M 0,-14 L 4,-4 L 14,0 L 4,4 L 0,14 L -4,4 L -14,0 L -4,-4 Z', fill: C.hi }, s); sparkA.push(s); }
      text(P1, 320, 545, '例：呼吸作用分解養分，放出能量', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
      const join = [];
      [[700, 220], [1060, 240], [720, 470], [1040, 460], [880, 200], [900, 500]].forEach(([x, y]) => { const b = at(P1, x, y); el('circle', { cx: 0, cy: 0, r: 18, fill: '#7fd0a8' }, b); join.push({ b, x, y }); });
      const bond = el('line', { x1: 760, y1: 350, x2: 1000, y2: 350, stroke: '#7fd0a8', 'stroke-width': 6, opacity: 0 }, P1);
      P1.insertBefore(bond, join[0].b.parentNode);
      const sparkB = at(P1, 880, 230); el('path', { d: 'M 0,-18 L 5,-5 L 18,0 L 5,5 L 0,18 L -5,5 L -18,0 L -5,-5 Z', fill: C.hi }, sparkB);
      text(P1, 880, 545, '例：把小分子組合成身體需要的物質', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });

      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.5);
      brk.forEach((b, i) => tl.fromTo(b, { x: 0, y: 0, rotation: 0 }, { x: (i - 2.5) * 34, y: (i % 2 ? 1 : -1) * 70, rotation: (i - 2.5) * 30, duration: 1, ease: 'power2.out' }, 's1+=1.2'));
      sparkA.forEach((s, i) => tl.fromTo(s, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, x: Math.cos(i) * 120, y: Math.sin(i) * 90, duration: 0.8, ease: 'power2.out' }, 's1+=1.4'));
      tl.to(sparkA, { opacity: 0, duration: 0.5 }, 's1+=2.4');
      tl.fromTo(sparkB, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.2, duration: 0.4 }, 's1+=1.4');
      tl.to(sparkB, { opacity: 0, scale: 0.2, y: 120, duration: 0.6 }, 's1+=2');
      join.forEach((o, i) => tl.fromTo(o.b, { x: 0, y: 0 }, { x: 760 + i * 48 - o.x, y: 350 - o.y, duration: 1, ease: 'power2.inOut' }, 's1+=2.1'));
      S.show(tl, bond, 's1+=3', 0.4);

      // ===== 2 生長與發育 =====
      const P2 = g(root, { opacity: 0 });
      panel(P2, 40, 110, 660, 520, '生長：綠豆芽一天天長高', OK);
      const stems = [];
      for (let d = 0; d < 5; d++) {
        const x = 130 + d * 125, base = 520, h = [8, 60, 130, 210, 290][d];
        el('path', { d: `M ${x - 38},${base} L ${x + 38},${base} L ${x + 30},${base + 56} L ${x - 30},${base + 56} Z`, fill: '#b0703c' }, P2);
        const st = g(P2);
        el('line', { x1: x, y1: base, x2: x, y2: base - h, stroke: '#cfe8a8', 'stroke-width': 7, 'stroke-linecap': 'round' }, st);
        if (d > 0) { el('ellipse', { cx: x - 14, cy: base - h, rx: 16, ry: 8, fill: '#6fce62', transform: `rotate(-30 ${x - 14} ${base - h})` }, st); el('ellipse', { cx: x + 14, cy: base - h, rx: 16, ry: 8, fill: '#58b84e', transform: `rotate(30 ${x + 14} ${base - h})` }, st); }
        else el('ellipse', { cx: x, cy: base - 6, rx: 12, ry: 9, fill: '#7cc46a' }, st);
        text(P2, x, base + 86, `第 ${d * 2 + 1} 天`, { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
        stems.push(st);
      }
      panel(P2, 730, 110, 430, 250, '細胞分裂、長大', '#62a8ff');
      const cellA = at(P2, 860, 250), cellB1 = at(P2, 860, 250), cellB2 = at(P2, 860, 250);
      [cellA, cellB1, cellB2].forEach((c) => { el('circle', { cx: 0, cy: 0, r: 34, fill: 'rgba(99,212,191,0.2)', stroke: C.membrane, 'stroke-width': 4 }, c); el('circle', { cx: 0, cy: 0, r: 11, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 2 }, c); });
      const big = at(P2, 1070, 250); el('circle', { cx: 0, cy: 0, r: 34, fill: 'rgba(99,212,191,0.2)', stroke: C.membrane, 'stroke-width': 4 }, big); el('circle', { cx: 0, cy: 0, r: 11, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 2 }, big);
      text(P2, 1000, 330, '數目變多 → 每個再長大', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      panel(P2, 730, 380, 430, 250, '發育：蝌蚪變青蛙', '#ffb35c');
      const tad = at(P2, 820, 530); el('ellipse', { cx: 0, cy: 0, rx: 30, ry: 22, fill: '#5b6b4a' }, tad); el('path', { d: 'M 26,0 C 60,-16 80,16 110,0', stroke: '#5b6b4a', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, tad);
      const frog = at(P2, 1060, 525);
      el('ellipse', { cx: 0, cy: 10, rx: 44, ry: 28, fill: '#6fae4a' }, frog);
      [[-26, -14], [26, -14]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 13, fill: '#6fae4a' }, frog); el('circle', { cx: x, cy: y, r: 5, fill: '#1b2a12' }, frog); });
      el('path', { d: 'M -40,24 q -30,20 -12,34 M 40,24 q 30,20 12,34', stroke: '#6fae4a', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, frog);
      const arrow2 = g(P2); el('path', { d: 'M 960,528 H 1000', stroke: C.mute, 'stroke-width': 4 }, arrow2); el('path', { d: 'M 1012,528 l -14,-9 v 18 Z', fill: C.mute }, arrow2);

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      stems.forEach((st, i) => tl.fromTo(st, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, `s2+=${0.6 + i * 0.35}`));
      tl.to(cellA, { opacity: 0, duration: 0.2 }, 's2+=1.2');
      tl.fromTo(cellB1, { x: 0 }, { x: -46, duration: 0.8 }, 's2+=1.2');
      tl.fromTo(cellB2, { x: 0 }, { x: 46, duration: 0.8 }, 's2+=1.2');
      tl.fromTo(big, { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1.3, opacity: 1, duration: 0.9 }, 's2+=2');
      tl.fromTo(frog, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6 }, 's2+=2.6');

      // ===== 3 感應與運動 =====
      const P3 = g(root, { opacity: 0 });
      panel(P3, 40, 110, 560, 520, '含羞草：被碰就合起來', '#62a8ff');
      el('path', { d: 'M 110,360 L 520,360', stroke: '#5aa04d', 'stroke-width': 8, 'stroke-linecap': 'round' }, P3);
      el('path', { d: 'M 110,360 C 100,450 120,520 130,590', stroke: '#5aa04d', 'stroke-width': 10, fill: 'none' }, P3);
      const leaflets = [];
      for (let i = 0; i < 9; i++) {
        const x = 150 + i * 42;
        [-1, 1].forEach((sd) => {
          const o = S.place(g(P3), { x, y: 360 });
          const lf = g(o);
          el('ellipse', { cx: 0, cy: sd * 30, rx: 12, ry: 30, fill: '#7cc46a', stroke: '#4f9a42', 'stroke-width': 2 }, lf);
          leaflets.push({ lf, sd, i });
        });
      }
      const hand = at(P3, 600, 300);
      el('path', { d: 'M 0,0 L -60,-8 Q -70,-8 -70,2 Q -70,10 -60,10 L -10,12 L 30,30 L 60,30 L 60,-20 L 20,-20 Z', fill: '#f2c9a0', stroke: '#c99a70', 'stroke-width': 2 }, hand);
      panel(P3, 640, 110, 520, 520, '植物向著光生長', C.hi);
      const sun = g(P3); el('circle', { cx: 1090, cy: 210, r: 40, fill: C.hi }, sun);
      for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; el('line', { x1: 1090 + Math.cos(a) * 52, y1: 210 + Math.sin(a) * 52, x2: 1090 + Math.cos(a) * 70, y2: 210 + Math.sin(a) * 70, stroke: C.hi, 'stroke-width': 4 }, sun); }
      el('path', { d: 'M 790,540 L 900,540 L 885,600 L 805,600 Z', fill: '#b0703c' }, P3);
      const stemA = 'M 845,540 C 845,480 845,420 845,330', stemB = 'M 845,540 C 845,470 880,400 960,350';
      const stem = el('path', { d: stemA, stroke: '#6fce62', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, P3);
      const head = el('ellipse', { cx: 845, cy: 330, rx: 26, ry: 12, fill: '#58b84e' }, P3);
      const nums = (d) => d.match(/-?\d+(\.\d+)?/g).map(Number);
      const A3 = nums(stemA), B3 = nums(stemB);

      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      tl.fromTo(hand, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 's3+=0.8');
      // 從碰觸點往回一對一對合起來
      // 小葉以葉軸上的點為軸心轉動：上方小葉轉底端、下方小葉轉頂端
      leaflets.forEach(({ lf, sd, i }) => tl.fromTo(lf, { rotation: 0, transformOrigin: sd < 0 ? '50% 100%' : '50% 0%' }, { rotation: sd * -62, duration: 0.25, ease: 'power2.in' }, `s3+=${1.7 + (8 - i) * 0.08}`));
      S.drive(tl, (u) => {
        const P = A3.map((a, k) => S.lerp(a, B3[k], u));
        stem.setAttribute('d', `M ${P[0]},${P[1]} C ${P[2]},${P[3]} ${P[4]},${P[5]} ${P[6]},${P[7]}`);
        head.setAttribute('cx', P[6]); head.setAttribute('cy', P[7]);
      }, 2.2, 's3+=1.2', 'power1.inOut');

      // ===== 4 生殖 =====
      const P4 = g(root, { opacity: 0 });
      panel(P4, 40, 110, 520, 520, '草履蟲：一分為二', '#ff8fb1');
      const halfL = at(P4, 300, 380), halfR = at(P4, 300, 380);
      [[halfL, -1], [halfR, 1]].forEach(([h, sd]) => {
        el('path', { d: sd < 0 ? 'M 0,-48 C -50,-50 -120,-38 -120,0 C -120,38 -50,50 0,48 Z' : 'M 0,-48 C 50,-50 120,-30 120,2 C 120,40 50,50 0,48 Z', fill: 'rgba(99,212,191,0.2)', stroke: C.membrane, 'stroke-width': 4 }, h);
        el('ellipse', { cx: sd * 50, cy: 0, rx: 24, ry: 15, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 2 }, h);
      });
      // 分開後各自長成完整的草履蟲
      const PARA = 'M -100,0 C -100,-40 -30,-50 20,-46 C 70,-42 100,-22 100,2 C 100,30 70,46 20,46 C -10,46 -20,24 -40,30 C -70,40 -100,30 -100,0 Z';
      const daughters = [225, 375].map((x) => { const d = at(P4, x, 380, 0.62); el('path', { d: PARA, fill: 'rgba(99,212,191,0.2)', stroke: C.membrane, 'stroke-width': 5 }, d); el('ellipse', { cx: 10, cy: -4, rx: 30, ry: 18, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, d); return d; });
      text(P4, 300, 520, '一個細胞 → 兩個新的個體', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
      panel(P4, 600, 110, 560, 520, '植物：開花結出種子', '#ff8fb1');
      const cyc = [['種子', 880, 230], ['幼苗', 1040, 380], ['開花', 880, 530], ['結果實', 720, 380]];
      const cycNodes = cyc.map(([n, x, y]) => { const c = g(P4); el('circle', { cx: x, cy: y, r: 52, fill: '#1a2c3a', stroke: '#ff8fb1', 'stroke-width': 3 }, c); text(c, x, y + 10, n, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 }); return c; });
      const cycArrows = [[930, 260, 1005, 325], [1005, 435, 930, 500], [830, 500, 755, 435], [755, 325, 830, 260]].map(([x1, y1, x2, y2]) => {
        const a = g(P4); el('path', { d: `M ${x1},${y1} Q ${(x1 + x2) / 2 + (y2 - y1) * 0.25},${(y1 + y2) / 2 - (x2 - x1) * 0.25} ${x2},${y2}`, stroke: C.mute, 'stroke-width': 4, fill: 'none', 'marker-end': 'url(#lifeArrow)' }, a); return a;
      });
      const defs = el('defs', {}, root);
      const mk = el('marker', { id: 'lifeArrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, defs);
      el('path', { d: 'M 0,0 L 10,5 L 0,10 Z', fill: C.mute }, mk);

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      tl.fromTo(halfL, { x: 0 }, { x: -70, duration: 1.2, ease: 'power2.inOut' }, 's4+=1');
      tl.fromTo(halfR, { x: 0 }, { x: 70, duration: 1.2, ease: 'power2.inOut' }, 's4+=1');
      tl.to([halfL, halfR], { opacity: 0, duration: 0.5 }, 's4+=2.3');
      tl.fromTo(daughters, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6 }, 's4+=2.3');
      cycNodes.forEach((c, i) => { S.pop(tl, c, `s4+=${0.8 + i * 0.5}`, 0.4); S.show(tl, cycArrows[i], `s4+=${1.1 + i * 0.5}`, 0.3); });

      // ===== 5 生物 vs 非生物 =====
      const P5 = g(root, { opacity: 0 });
      const rows = [['代謝', '#ffb35c'], ['生長與發育', OK], ['感應與運動', '#62a8ff'], ['生殖', '#ff8fb1']];
      const COLX = [500, 660, 820, 980];
      ICONS.forEach(([n, draw], i) => { draw(at(P5, COLX[i], 150, 0.5)); text(P5, COLX[i], 232, n, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 }); });
      rows.forEach(([n, col], r) => {
        const y = 300 + r * 80;
        el('rect', { x: 150, y: y - 32, width: 920, height: 64, rx: 12, fill: r % 2 ? '#122230' : '#162a3a' }, P5);
        text(P5, 180, y + 10, n, { 'font-size': 28, fill: col, 'font-weight': 700 });
      });
      // 欄：貓、綠豆芽、機器人、鐘乳石；列：代謝、生長與發育、感應與運動、生殖
      const TRUTH = [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 2, 0], [0, 2, 0, 0]];
      const marks = [];
      for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) marks.push({ m: check(P5, COLX[c], 300 + r * 80, TRUTH[c][r]), c, r });
      const verdict = g(P5, { opacity: 0 });
      [['生物', OK], ['生物', OK], ['非生物', NO], ['非生物', NO]].forEach(([t, col], i) => S.pill(verdict, COLX[i], 610, t, { size: 26, color: col, edge: col }));
      const legend5 = g(P5, { opacity: 0 });
      check(legend5, 196, 676, 2);
      text(legend5, 226, 686, '看起來類似，但原因不同：機器人靠電池和程式；鐘乳石是礦物堆積', { 'font-size': 22, fill: C.mute });

      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      marks.forEach(({ m, c, r }) => tl.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.2 }, `s5+=${0.9 + c * 0.45 + r * 0.08}`));
      S.show(tl, legend5, 's5+=3', 0.4);
      S.show(tl, verdict, 's5+=3.4', 0.4);

      // ===== 6 生存條件與生物圈 =====
      const P6 = g(root, { opacity: 0 });
      const conds = [['陽光', C.hi], ['空氣', '#bfe3ff'], ['水', C.water], ['養分', '#d9a66b'], ['適當溫度', '#ff8f8f']];
      conds.forEach(([n, col], i) => S.pill(P6, 170 + i * 215, 80, n, { size: 28, color: col, edge: col }));
      // 地球與放大的剖面
      el('circle', { cx: 300, cy: 420, r: 200, fill: '#1d4f7a' }, P6);
      el('path', { d: 'M 170,300 C 220,260 300,300 280,350 C 260,400 200,380 170,420 C 150,380 140,330 170,300 Z M 330,430 C 380,400 450,440 440,500 C 420,560 350,560 330,520 Z', fill: '#4f8a46' }, P6);
      const shell = el('circle', { cx: 300, cy: 420, r: 205, fill: 'none', stroke: '#7fe0a0', 'stroke-width': 10, opacity: 0.85 }, P6);
      el('circle', { cx: 455, cy: 290, r: 34, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, P6);
      el('path', { d: 'M 488,282 L 640,170 M 488,300 L 640,600', stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, P6);
      const col = g(P6);
      const cx0 = 640, cw = 480, top = 160, mid = 385, bot = 610;
      el('rect', { x: cx0, y: top, width: cw, height: mid - top, fill: '#1f3e5c' }, col);
      el('rect', { x: cx0, y: top, width: cw, height: 60, fill: '#16263a' }, col);
      el('path', { d: `M ${cx0},${mid} L ${cx0},${mid - 40} L ${cx0 + 90},${mid - 180} L ${cx0 + 150},${mid - 110} L ${cx0 + 200},${mid - 60} L ${cx0 + 230},${mid} Z`, fill: '#6b7f5a' }, col);
      el('rect', { x: cx0 + 230, y: mid, width: cw - 230, height: bot - mid, fill: '#1d4f7a' }, col);
      el('rect', { x: cx0, y: mid, width: 230, height: bot - mid, fill: '#5a4a38' }, col);
      el('line', { x1: cx0, y1: mid, x2: cx0 + cw, y2: mid, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '8 6' }, col);
      el('rect', { x: cx0, y: top, width: cw, height: bot - top, fill: 'none', stroke: '#7fe0a0', 'stroke-width': 3 }, col);
      // 生物圖示：鳥、樹、魚、深海魚
      el('path', { d: `M ${cx0 + 330},${top + 90} q 14,-12 28,0 q 14,-12 28,0`, stroke: C.ink, 'stroke-width': 4, fill: 'none' }, col);
      el('path', { d: `M ${cx0 + 175},${mid - 70} l 0,-30`, stroke: '#8a6a40', 'stroke-width': 6 }, col);
      el('circle', { cx: cx0 + 175, cy: mid - 108, r: 20, fill: '#4f9a42' }, col);
      el('path', { d: `M ${cx0 + 330},${mid + 60} q 30,-22 60,0 q -30,22 -60,0 Z M ${cx0 + 390},${mid + 60} l 18,-12 v 24 Z`, fill: '#ffcf5c' }, col);
      el('path', { d: `M ${cx0 + 300},${bot - 40} q 24,-16 48,0 q -24,16 -48,0 Z`, fill: '#9fb3c1' }, col);
      el('circle', { cx: cx0 + 318, cy: bot - 50, r: 3, fill: C.hi }, col);
      text(col, cx0 + cw - 10, top + 30, '約 +10 km', { 'font-size': 22, fill: C.ink, 'text-anchor': 'end', class: 'mono' });
      text(col, cx0 + cw - 10, mid - 10, '海平面', { 'font-size': 22, fill: C.ink, 'text-anchor': 'end' });
      text(col, cx0 + cw - 10, bot - 12, '約 −10 km', { 'font-size': 22, fill: C.ink, 'text-anchor': 'end', class: 'mono' });
      const bioLabel = S.pill(g(P6, { opacity: 0 }), 300, 660, '生物圈：海平面上下各約 10 km', { size: 26, color: '#7fe0a0', edge: '#7fe0a0' });
      text(P6, 1184, 150, '＊示意', { 'font-size': 22, fill: C.mute, 'text-anchor': 'end' });

      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.5);
      tl.fromTo([...P6.children].slice(0, 5), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.12 }, 's6+=0.5');
      tl.fromTo(shell, { opacity: 0 }, { opacity: 0.85, duration: 0.3, repeat: 4, yoyo: true }, 's6+=1.3');
      tl.fromTo(col, { opacity: 0, scale: 0.4, transformOrigin: '0% 30%' }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 's6+=1.8');
      S.show(tl, bioLabel.parentNode, 's6+=2.6', 0.4);

      return {
        tl,
        notes: [null, null, null, null, null,
          '＊補充：生物都由細胞構成；火會燃燒、消耗氧並產生二氧化碳，但不是生物。',
          '＊示意：生物圈的厚度放大畫了。地球半徑約 6400 km，生物圈約 20 km 厚，只有半徑的 0.3%。如果地球縮成一顆籃球，生物圈只有約 0.4 mm 厚。'],
        steps: [
          '生物和非生物怎麼分？要看有沒有<b>生命現象</b>。常見的生命現象分成四類：代謝、生長與發育、感應與運動、生殖。',
          '<b>代謝</b>：生物體內進行的各種化學反應。例如把養分分解、放出能量（呼吸作用），或把小分子合成身體需要的物質。',
          '<b>生長與發育</b>：細胞分裂讓數目變多、細胞再長大，個體就長大；發育是形態構造和功能逐漸改變、變得成熟，例如蝌蚪變成青蛙。',
          '<b>感應與運動</b>：生物能接受刺激並做出反應。例如含羞草被碰觸，葉子會合起來；植物會朝著光的方向生長。',
          '<b>生殖</b>：生物能產生下一代，讓生命延續。例如草履蟲一分為二，植物開花、結出種子。',
          '生物由<b>細胞</b>構成，並表現這些<b>生命現象</b>；只有其中一項很像，不代表是生物。鐘乳石會變長，是礦物一層層堆積，不是生長；機器人有感應器、會動，但不會代謝、也不會生殖。',
          '大多數生物生存需要<b>陽光、空氣、水、養分和適當的溫度</b>。地球上有生物生存的範圍叫<b>生物圈</b>，大約是海平面上下各 10 km。',
        ],
      };
    },
  });
})();
