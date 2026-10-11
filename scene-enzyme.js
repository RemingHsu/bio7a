/* 3-2 酵素：催化、專一性、可重複使用、溫度與酸鹼值的影響、唾液澱粉酶實驗、不同生物的最適溫度、合成作用 */
(() => {
  const { el, g, text, C } = S;
  const ENZ = '#62d0c0', STARCH = '#ffcf5c', PROT = '#ff8f8f';
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };

  // 酵素：一個有凹槽的形狀（活性部位），原點在凹槽中央
  function enzyme(p, notch = 'hex', col = ENZ) {
    const e = g(p);
    // 活性部位是往下凹的槽，形狀剛好放得下受質
    const cut = notch === 'hex' ? 'L -26,-30 L -14,-8 L 14,-8 L 26,-30' : 'L -24,-30 C -24,-2 24,-2 24,-30';
    el('path', { d: `M -70,-30 ${cut} L 70,-30 C 70,40 40,70 0,70 C -40,70 -70,40 -70,-30 Z`, fill: col, opacity: 0.9, stroke: '#e8fffb', 'stroke-width': 3 }, e);
    text(e, 0, 30, '酵素', { 'font-size': 24, 'text-anchor': 'middle', fill: '#06221d', 'font-weight': 700 });
    return e;
  }
  // 受質：兩個小單元連在一起（被切開後變成兩個）
  function substrate(p, kind) {
    const s = g(p), parts = [];
    [-14, 14].forEach((dx) => {
      const o = S.place(g(s), { x: dx, y: 0 });
      if (kind === 'starch') el('path', { d: hexD(14), fill: 'rgba(255,207,92,0.2)', stroke: STARCH, 'stroke-width': 4 }, o);
      else el('circle', { cx: 0, cy: 0, r: 13, fill: PROT, stroke: '#fff', 'stroke-width': 2 }, o);
      parts.push(o);
    });
    s.parts = parts;
    return s;
  }
  const at = (p, x, y, s = 1) => S.place(g(p), { x, y, s });

  S.register({
    id: 'enzyme', section: '3-2', title: '酵素的特性',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 催化 =====
      const P0 = g(root);
      const lane = (y, title, col) => { const l = g(P0); el('rect', { x: 80, y: y - 110, width: 1040, height: 220, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, l); text(l, 110, y - 70, title, { 'font-size': 28, 'font-weight': 700, fill: col }); return l; };
      lane(220, '沒有酵素：反應很慢', C.mute);
      lane(500, '有酵素：反應快很多', ENZ);
      const slow = [], fast = [];
      for (let i = 0; i < 6; i++) { const o = at(P0, 300 + i * 110, 240); substrate(o, 'starch'); slow.push(o); }
      const enz0 = at(P0, 220, 540, 0.8); enzyme(enz0);
      for (let i = 0; i < 6; i++) { const o = at(P0, 340 + i * 120, 520); substrate(o, 'starch'); fast.push(o); }
      const clock = (x, y) => { const c = g(P0); el('circle', { cx: x, cy: y, r: 26, fill: 'none', stroke: C.mute, 'stroke-width': 3 }, c); const h = el('line', { x1: x, y1: y, x2: x, y2: y - 18, stroke: C.hi, 'stroke-width': 3 }, c); return h; };
      const h1 = clock(1060, 220), h2 = clock(1060, 500);
      const split = (o, u) => { o.firstChild.parts.forEach((pt, k) => S.place(pt, { x: (k ? 14 : -14) + (k ? 1 : -1) * 22 * u, y: (k ? 1 : -1) * 10 * u })); };
      const run0 = (u) => {
        slow.forEach((o, i) => split(o, i === 0 ? S.smoothstep(0.6, 1, u) : 0));
        fast.forEach((o, i) => split(o, S.smoothstep(i / 6, (i + 1) / 6, u)));
        S.place(enz0, { x: 220 + Math.min(u * 6, 5.4) * 120 * (1 / 1.08), y: 540, s: 0.8 });
        h1.setAttribute('transform', `rotate(${u * 300} 1060 220)`); h2.setAttribute('transform', `rotate(${u * 300} 1060 500)`);
      };
      run0(0);
      tl.addLabel('s0');
      S.drive(tl, run0, 3.5, 's0+=0.6');

      // ===== 1 專一性 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 600, 100, '像鑰匙和鎖：形狀吻合，才能作用', { 'font-size': 32, 'font-weight': 700, 'text-anchor': 'middle' });
      const eA = at(P1, 330, 420); enzyme(eA.appendChild(g(eA)) && eA, 'hex');
      const sA = at(P1, 330, 200); substrate(sA, 'starch');
      text(P1, 330, 560, '澱粉酶 ＋ 澱粉 → 分解', { 'font-size': 26, 'text-anchor': 'middle', fill: ENZ, 'font-weight': 700 });
      const eB = at(P1, 870, 420); enzyme(eB, 'hex');
      const sB = at(P1, 870, 200); substrate(sB, 'protein');
      text(P1, 870, 560, '澱粉酶 ＋ 蛋白質 → 不反應', { 'font-size': 26, 'text-anchor': 'middle', fill: '#ff8f8f', 'font-weight': 700 });
      const run1 = (u) => {
        const d = S.smoothstep(0, 0.45, u), sp = S.smoothstep(0.55, 0.85, u);
        S.place(sA, { x: 330, y: S.lerp(200, 362, d) - sp * 120 });
        sA.firstChild.parts.forEach((pt, k) => S.place(pt, { x: (k ? 14 : -14) + (k ? 1 : -1) * 34 * sp, y: 0 }));
        const back = S.smoothstep(0.5, 0.8, u);
        S.place(sB, { x: 870 + back * 60, y: S.lerp(200, 340, d) - back * 160, r: back * 40 });
      };
      run1(0);
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.drive(tl, run1, 3, 's1+=0.8');

      // ===== 2 可重複使用 =====
      const P2 = g(root, { opacity: 0 });
      const eC = at(P2, 600, 440); enzyme(eC, 'hex');
      const queue = [];
      for (let i = 0; i < 4; i++) { const o = at(P2, 200 + i * 60, 160); substrate(o, 'starch'); queue.push(o); }
      const count = text(P2, 600, 640, '', { 'font-size': 28, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const run2 = (u) => {
        let done = 0;
        queue.forEach((o, i) => {
          const t = S.clamp(u * 4 - i, 0, 1);
          const into = S.smoothstep(0, 0.4, t), out = S.smoothstep(0.55, 1, t);
          const x = S.lerp(200 + i * 60, 600, into) + out * (300 + i * 40), y = S.lerp(160, 382, into) - out * (180 - i * 40);
          S.place(o, { x, y });
          o.firstChild.parts.forEach((pt, k) => S.place(pt, { x: (k ? 14 : -14) + (k ? 1 : -1) * 26 * out, y: 0 }));
          if (t > 0.98) done++;
        });
        count.textContent = `已分解 ${done} 個，酵素還是原來的樣子`;
      };
      run2(0);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drive(tl, run2, 4, 's2+=0.6');

      // ===== 3 溫度 =====
      const P3 = g(root, { opacity: 0 });
      const GX = (t) => 140 + t * 11, GY = (a) => 560 - a * 360;
      el('line', { x1: 140, y1: 560, x2: 1060, y2: 560, stroke: '#4a6272', 'stroke-width': 3 }, P3);
      el('line', { x1: 140, y1: 560, x2: 140, y2: 170, stroke: '#4a6272', 'stroke-width': 3 }, P3);
      [0, 20, 40, 60, 80].forEach((t) => text(P3, GX(t), 594, `${t} °C`, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle', class: 'mono' }));
      text(P3, 150, 158, '酵素作用的快慢', { 'font-size': 22, fill: C.mute });
      const act = (t) => (t <= 37 ? Math.pow(t / 37, 1.6) : Math.max(0, 1 - Math.pow((t - 37) / 23, 2)));
      let d3 = '';
      for (let t = 0; t <= 80; t += 1) d3 += (t ? 'L' : 'M') + `${GX(t).toFixed(1)},${GY(act(t)).toFixed(1)}`;
      const curve = el('path', { d: d3, fill: 'none', stroke: ENZ, 'stroke-width': 5 }, P3);
      const dot = el('circle', { cx: GX(0), cy: GY(0), r: 10, fill: C.hi }, P3);
      const ann = [[13, '溫度低：作用慢\n回到適當溫度可恢復', 0.72, '#62a8ff'], [37, '約 37 °C 最快\n（人體酵素）', 1.06, C.hi], [68, '溫度太高：酵素被破壞\n冷卻後也不能恢復', 0.3, '#ff8f8f']].map(([t, s, a, col]) => {
        const g3 = g(P3, { opacity: 0 });
        s.split('\n').forEach((line, i) => text(g3, GX(t), GY(a) - 40 + i * 30, line, { 'font-size': 22, 'text-anchor': 'middle', fill: col, 'font-weight': i ? 400 : 700 }));
        return g3;
      });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drawOn(tl, curve, 1.5, 's3+=0.6');
      S.drive(tl, (u) => { const t = u * 80; dot.setAttribute('cx', GX(t)); dot.setAttribute('cy', GY(act(t))); }, 3, 's3+=0.6');
      ann.forEach((a, i) => S.show(tl, a, `s3+=${1.2 + i * 0.9}`, 0.4));

      // ===== 4 酸鹼值 =====
      const P4 = g(root, { opacity: 0 });
      const PX = (ph) => 140 + (ph - 1) * 83, PY = (a) => 560 - a * 340;
      el('line', { x1: 140, y1: 560, x2: 1060, y2: 560, stroke: '#4a6272', 'stroke-width': 3 }, P4);
      el('line', { x1: 140, y1: 560, x2: 140, y2: 190, stroke: '#4a6272', 'stroke-width': 3 }, P4);
      [1, 3, 5, 7, 9, 11].forEach((ph) => text(P4, PX(ph), 594, `pH ${ph}`, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle', class: 'mono' }));
      text(P4, PX(2), 630, '酸性', { 'font-size': 22, fill: '#ff8f8f', 'text-anchor': 'middle' });
      text(P4, PX(7), 630, '中性', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      text(P4, PX(10), 630, '鹼性', { 'font-size': 22, fill: '#62a8ff', 'text-anchor': 'middle' });
      const bell = (c, w) => (ph) => Math.exp(-Math.pow((ph - c) / w, 2));
      const CUR = [['胃液中的酵素', 2, 1.1, '#ff8f8f'], ['唾液中的酵素', 7, 1.2, STARCH], ['胰液中的酵素', 8, 1.2, ENZ]];
      const curves4 = CUR.map(([n, c, w, col], i) => {
        const f = bell(c, w); let d = '';
        for (let ph = 1; ph <= 12; ph += 0.1) d += (ph === 1 ? 'M' : 'L') + `${PX(ph).toFixed(1)},${PY(f(ph)).toFixed(1)}`;
        const pth = el('path', { d, fill: 'none', stroke: col, 'stroke-width': 5 }, P4);
        const lb = text(P4, PX(c) + (i === 2 ? 40 : i === 1 ? -40 : 0), PY(1) - 18 - (i === 2 ? 0 : 0), n, { 'font-size': 22, 'text-anchor': i === 2 ? 'start' : i === 1 ? 'end' : 'middle', fill: col, 'font-weight': 700, opacity: 0 });
        return [pth, lb];
      });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      curves4.forEach(([pth, lb], i) => { S.drawOn(tl, pth, 1, `s4+=${0.6 + i * 0.8}`); S.show(tl, lb, `s4+=${1.2 + i * 0.8}`, 0.3); });

      // ===== 5 唾液實驗 =====
      const P5 = g(root, { opacity: 0 });
      const TUBES = [['澱粉液＋唾液', '37 °C', '#e8c48a', '不變藍黑色', true], ['澱粉液＋清水', '37 °C', '#1d2a6b', '藍黑色', false], ['澱粉液＋唾液', '0 °C 冰水', '#1d2a6b', '藍黑色', false], ['澱粉液＋煮沸過的唾液', '37 °C', '#1d2a6b', '藍黑色', false]];
      const t5 = TUBES.map(([a, b, endCol, res, ok], i) => {
        const x = 210 + i * 260, t = g(P5);
        text(t, x, 130, a, { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
        text(t, x, 162, b, { 'font-size': 22, 'text-anchor': 'middle', fill: b.includes('0 °C') ? '#62a8ff' : C.hi });
        el('path', { d: `M ${x - 30},190 L ${x - 30},440 C ${x - 30},470 ${x + 30},470 ${x + 30},440 L ${x + 30},190`, fill: 'rgba(200,230,255,0.08)', stroke: '#cfe8ff', 'stroke-width': 4 }, t);
        const liq = el('path', { d: `M ${x - 27},300 L ${x - 27},440 C ${x - 27},466 ${x + 27},466 ${x + 27},440 L ${x + 27},300 Z`, fill: 'rgba(240,240,230,0.6)' }, t);
        const r = g(t, { opacity: 0 });
        S.pill(r, x, 520, res, { size: 22, color: ok ? C.chloro : '#8fa8ff', edge: ok ? C.chloro : '#8fa8ff' });
        text(r, x, 570, ok ? '澱粉被分解了' : '澱粉還在', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        return { liq, endCol, r };
      });
      text(P5, 600, 640, '約 10 分鐘後，各滴入碘液', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      t5.forEach(({ liq, endCol, r }, i) => {
        tl.fromTo(liq, { attr: { fill: 'rgba(240,240,230,0.6)' } }, { attr: { fill: endCol }, duration: 0.8 }, `s5+=${1 + i * 0.5}`);
        S.show(tl, r, `s5+=${1.6 + i * 0.5}`, 0.3);
      });

      // ===== 6 不同生物的酵素：最適溫度不同 =====
      const P6 = g(root, { opacity: 0 });
      const HOT = '#ff9a5c';
      const QX = (t) => 140 + t * 9.2, QY = (a) => 560 - a * 330;
      text(P6, 600, 72, '不同生物的酵素，最適溫度不一樣＊', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle' });
      el('line', { x1: 140, y1: 560, x2: 1060, y2: 560, stroke: '#4a6272', 'stroke-width': 3 }, P6);
      el('line', { x1: 140, y1: 560, x2: 140, y2: 200, stroke: '#4a6272', 'stroke-width': 3 }, P6);
      [0, 20, 40, 60, 80, 100].forEach((t) => text(P6, QX(t), 594, `${t} °C`, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle', class: 'mono' }));
      text(P6, 150, 190, '酵素作用的快慢', { 'font-size': 22, fill: C.mute });
      text(P6, 1072, 568, '溫度', { 'font-size': 22, fill: C.mute });
      const actH = (t) => (t <= 37 ? Math.pow(t / 37, 1.6) : Math.max(0, 1 - Math.pow((t - 37) / 23, 2)));
      const actB = (t) => (t <= 70 ? Math.pow(Math.max(0, t - 25) / 45, 1.6) : Math.max(0, 1 - Math.pow((t - 70) / 20, 2)));
      const curve6 = (f, col) => { let d = ''; for (let t = 0; t <= 100; t += 1) d += (t ? 'L' : 'M') + `${QX(t).toFixed(1)},${QY(f(t)).toFixed(1)}`; return el('path', { d, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linejoin': 'round' }, P6); };
      const cH = curve6(actH, ENZ), cB = curve6(actB, HOT);
      const peak = (t, col) => { const pk = g(P6, { opacity: 0 }); el('line', { x1: QX(t), y1: QY(1) + 10, x2: QX(t), y2: 556, stroke: col, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, pk); el('circle', { cx: QX(t), cy: QY(1), r: 8, fill: col }, pk); return pk; };
      const pkH = peak(37, ENZ), pkB = peak(70, HOT);
      // 直接標示：人（左）、溫泉（右）
      const lbH = g(P6, { opacity: 0 });
      text(lbH, QX(37), 168, '人體的酵素', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle', fill: ENZ });
      text(lbH, QX(37), 200, '約 37 °C 最快', { 'font-size': 22, 'text-anchor': 'middle', fill: ENZ });
      const man = S.place(g(lbH), { x: QX(37) - 120, y: 176 });
      el('circle', { cx: 0, cy: -14, r: 14, fill: ENZ, opacity: 0.85 }, man);
      el('path', { d: 'M -22,24 C -22,6 -12,2 0,2 C 12,2 22,6 22,24 Z', fill: ENZ, opacity: 0.85 }, man);
      const lbB = g(P6, { opacity: 0 });
      text(lbB, QX(70), 168, '溫泉中細菌的酵素', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle', fill: HOT });
      text(lbB, QX(70), 200, '約 70 °C＊ 最快', { 'font-size': 22, 'text-anchor': 'middle', fill: HOT });
      const spring = S.place(g(lbB), { x: QX(70) + 150, y: 186 });
      el('ellipse', { cx: 0, cy: 14, rx: 30, ry: 10, fill: C.water, opacity: 0.8 }, spring);
      [-14, 0, 14].forEach((dx) => el('path', { d: `M ${dx},2 q -6,-8 0,-16 q 6,-8 0,-16`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round' }, spring));
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      S.drawOn(tl, cH, 1.2, 's6+=0.6');
      S.show(tl, [pkH, lbH], 's6+=1.6', 0.4);
      S.drawOn(tl, cB, 1.2, 's6+=2.3');
      S.show(tl, [pkB, lbB], 's6+=3.3', 0.4);

      // ===== 7 酵素也能幫忙合成 =====
      const P7 = g(root, { opacity: 0 });
      text(P7, 600, 72, '酵素也能幫忙「合成」', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle' });
      text(P7, 250, 190, '葡萄糖（小分子）', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle', fill: STARCH });
      const eS = at(P7, 600, 470); enzyme(eS, 'hex');
      const SEAT = [600, 448];
      const START = [[170, 270], [250, 240], [330, 290], [190, 360], [290, 380], [230, 460]];
      const SLOT = (i) => [720 + i * 32, 300];
      const link7 = el('line', { x1: 720, y1: 300, x2: 720, y2: 300, stroke: STARCH, 'stroke-width': 4, opacity: 0 }, P7);
      [[120, 330], [350, 450], [390, 360], [140, 440]].forEach(([x, y]) => { const o = at(P7, x, y); el('path', { d: hexD(15), fill: 'rgba(255,207,92,0.2)', stroke: STARCH, 'stroke-width': 4 }, o); });
      const arr7 = g(P7, { opacity: 0 });
      el('path', { d: 'M 430,392 Q 500,396 540,422', fill: 'none', stroke: C.ink2, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, arr7);
      el('path', { d: 'M 549,429 l -16,-2 l 7,-13 Z', fill: C.ink2 }, arr7);
      el('path', { d: 'M 650,424 Q 690,380 700,336', fill: 'none', stroke: C.ink2, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, arr7);
      el('path', { d: 'M 701,326 l -10,14 l 15,3 Z', fill: C.ink2 }, arr7);
      const units7 = START.map(([x, y]) => { const o = at(P7, x, y); el('path', { d: hexD(15), fill: 'rgba(255,207,92,0.2)', stroke: STARCH, 'stroke-width': 4 }, o); return o; });
      const chainLbl = g(P7, { opacity: 0 });
      text(chainLbl, 800, 250, '澱粉、肝糖（大分子）', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle', fill: STARCH });
      const same7 = g(P7, { opacity: 0 });
      text(same7, 600, 576, '反應前後，酵素本身不變', { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      const run7 = (u) => {
        let n = 0;
        units7.forEach((o, i) => {
          const k = S.clamp(u * 6 - i), a = S.smoothstep(0, 0.45, k), b = S.smoothstep(0.55, 1, k);
          const [x0, y0] = START[i], [x2, y2] = SLOT(i);
          S.place(o, { x: S.lerp(S.lerp(x0, SEAT[0], a), x2, b), y: S.lerp(S.lerp(y0, SEAT[1], a), y2, b) });
          if (k >= 1) n++;
        });
        link7.setAttribute('x2', 720 + Math.max(0, n - 1) * 32);
        link7.setAttribute('opacity', n > 1 ? 1 : 0);
      };
      run7(0);
      const eq7 = g(P7, { opacity: 0 });
      el('rect', { x: 150, y: 606, width: 900, height: 84, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, eq7);
      text(eq7, 200, 658, '許多葡萄糖', { 'font-size': 28, 'font-weight': 700, fill: STARCH });
      el('line', { x1: 360, y1: 648, x2: 548, y2: 648, stroke: C.ink, 'stroke-width': 3 }, eq7);
      el('path', { d: 'M 562,648 l -16,-9 l 0,18 Z', fill: C.ink }, eq7);
      text(eq7, 455, 636, '酵素', { 'font-size': 22, 'text-anchor': 'middle', fill: ENZ, 'font-weight': 700 });
      text(eq7, 580, 658, '澱粉（植物）、肝糖（動物）', { 'font-size': 28, 'font-weight': 700, fill: STARCH });
      tl.addLabel('s7');
      S.hide(tl, P6, 's7', 0.4);
      S.show(tl, P7, 's7+=0.3', 0.4);
      S.show(tl, arr7, 's7+=0.7', 0.3);
      S.drive(tl, run7, 3.6, 's7+=0.8');
      S.show(tl, chainLbl, 's7+=4.1', 0.4);
      S.show(tl, same7, 's7+=4.4', 0.4);
      S.show(tl, eq7, 's7+=4.8', 0.5);

      return {
        tl,
        notes: [
          '＊示意：分子和酵素都畫得很大；大多數酵素是由胺基酸組成的大分子（蛋白質）。科學史：1897 年畢希納發現，磨碎酵母菌得到的汁液（沒有活的細胞）也能讓糖發酵，表示發揮作用的是細胞裡的物質（酵素）。',
          '＊「鎖與鑰匙」是幫助理解的比喻。',
          null,
          '＊示意曲線：不同生物、不同酵素的最適溫度不一樣，這裡以人體的酵素為例。',
          '＊示意曲線：最適酸鹼值依酵素而不同，形狀和數值都是簡化的。',
          '＊碘液本身是黃褐色；澱粉被分解後，加碘液就不會變藍黑色。',
          '＊示意曲線：溫度數值和曲線形狀都是簡化的。生活在溫泉中的細菌，酵素比較耐熱；人體的酵素到了這麼高的溫度早就被破壞了。',
          '＊示意：分子和酵素都畫得很大。合成澱粉、肝糖的酵素，和分解它們的酵素不是同一種。人體把多的葡萄糖合成肝糖，存在肝臟和肌肉中。',
        ],
        steps: [
          '<b>酵素</b>能加快生物體內的化學反應（催化作用），大多數酵素的成分是<b>蛋白質</b>。',
          '酵素有<b>專一性</b>：一種酵素通常只對特定的物質作用。例如澱粉酶能分解澱粉，卻不能分解蛋白質。',
          '酵素在反應前後<b>本身不會改變</b>，可以重複使用，所以只需要少量。',
          '<b>溫度</b>會影響酵素：人體的酵素在約 37 °C 作用最快；溫度太低作用變慢，太高則會被破壞、無法恢復。',
          '<b>酸鹼值</b>也會影響酵素：胃液中的酵素在酸性環境作用最好，唾液、胰液中的酵素則適合中性到弱鹼性。',
          '唾液實驗：只有「澱粉液＋唾液、在 37 °C」那一管加碘液後不變藍黑色，表示澱粉被唾液中的酵素分解了。',
          '不同生物的酵素，<b>最適溫度</b>不一樣：人體的酵素約 37 °C 作用最快；生活在溫泉中的細菌，酵素在較高的溫度＊作用最快。',
          '酵素不只幫忙分解，也能幫忙<b>合成</b>：例如把許多葡萄糖接成<b>澱粉</b>（植物）或<b>肝糖</b>（動物）。反應前後，酵素本身<b>不變</b>。',
        ],
      };
    },
  });
})();
