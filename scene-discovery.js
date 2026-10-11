/* 2-1 細胞的發現與種類：虎克、雷文霍克、細胞學說；細胞的形狀與功能；大小與單／多細胞 */
(() => {
  const { el, g, text, C } = S;
  const at = (p, x, y, s = 1) => g(S.place(g(p), { x, y, s }));
  const card = (p, x, y, w, h, title, sub, col) => {
    const c = g(p);
    el('rect', { x: x - w / 2, y, width: w, height: h, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, c);
    text(c, x, y + h - 62, title, { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: col });
    text(c, x, y + h - 24, sub, { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
    return c;
  };

  // ---------- 細胞圖 ----------
  function neuron(p) {
    const n = g(p);
    for (let k = 0; k < 6; k++) { const a = 2 + k * 0.5; el('path', { d: `M 0,0 q ${Math.cos(a) * 30},${Math.sin(a) * 30 - 8} ${Math.cos(a) * 55},${Math.sin(a) * 55} m 0,0 l ${Math.cos(a - 0.5) * 16},${Math.sin(a - 0.5) * 16}`, stroke: C.nerve, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, n); }
    el('path', { d: 'M 0,0 C 40,6 70,-8 110,0 M 110,0 l 14,-12 M 110,0 l 16,4 M 110,0 l 8,14', stroke: C.nerve, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, n);
    el('circle', { cx: 0, cy: 0, r: 18, fill: '#a8862a', stroke: C.nerve, 'stroke-width': 3 }, n);
    el('circle', { cx: 0, cy: 0, r: 7, fill: '#4b3d86' }, n);
    return n;
  }
  function rbc(p) {
    const r = g(p);
    el('circle', { cx: -30, cy: -20, r: 40, fill: '#c43a4f', stroke: '#ff8094', 'stroke-width': 3 }, r);
    el('circle', { cx: -30, cy: -20, r: 16, fill: '#e0627a' }, r);
    el('path', { d: 'M 30,30 C 30,10 60,10 70,22 C 80,10 110,10 110,30 C 110,50 80,50 70,38 C 60,50 30,50 30,30 Z', fill: '#c43a4f', stroke: '#ff8094', 'stroke-width': 3 }, r);
    text(r, -30, 46, '正面', { 'font-size': 18, fill: C.mute, 'text-anchor': 'middle' });
    text(r, 70, 72, '側面', { 'font-size': 18, fill: C.mute, 'text-anchor': 'middle' });
    return r;
  }
  function muscle(p) {
    const m = g(p);
    el('path', { d: 'M -110,0 C -60,-22 60,-22 110,0 C 60,22 -60,22 -110,0 Z', fill: '#b8434f', stroke: '#ff9aa4', 'stroke-width': 3 }, m);
    el('ellipse', { cx: 0, cy: 0, rx: 16, ry: 7, fill: '#4b3d86' }, m);
    return m;
  }
  function sperm(p) {
    const s = g(p);
    const tail = el('path', { d: '', stroke: '#cfe3ff', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, s);
    el('ellipse', { cx: -70, cy: 0, rx: 18, ry: 12, fill: '#9fc4ff', stroke: '#cfe3ff', 'stroke-width': 2 }, s);
    el('rect', { x: -54, y: -4, width: 20, height: 8, rx: 4, fill: '#9fc4ff' }, s);
    s.wave = (u) => { let d = 'M -34,0'; for (let x = -34; x <= 110; x += 6) d += ` L ${x},${(Math.sin(x / 18 - u * 18) * 10 * (x + 34) / 144).toFixed(1)}`; tail.setAttribute('d', d); };
    s.wave(0);
    return s;
  }
  function guard(p) {
    const gd = g(p);
    const L = el('path', { d: '', fill: '#3f8a3a', stroke: '#9be58c', 'stroke-width': 3 }, gd);
    const R = el('path', { d: '', fill: '#3f8a3a', stroke: '#9be58c', 'stroke-width': 3 }, gd);
    const dots = g(gd);
    gd.open = (u) => { // u：0 關、1 開
      const w = 6 + u * 16;
      L.setAttribute('d', `M 0,-60 C -70,-60 -70,60 0,60 C ${-w},40 ${-w - 4},-40 0,-60 Z`);
      R.setAttribute('d', `M 0,-60 C 70,-60 70,60 0,60 C ${w},40 ${w + 4},-40 0,-60 Z`);
      dots.setAttribute('transform', `translate(${u * 4},0)`);
    };
    [[-36, -20], [-40, 10], [-32, 36], [36, -20], [40, 10], [32, 36]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 6, fill: '#9be58c' }, dots));
    gd.open(0.8);
    return gd;
  }
  function rootHair(p) {
    const r = g(p);
    el('path', { d: 'M -60,-40 L 10,-40 L 10,-20 C 40,-20 90,-16 120,-12 C 126,-10 126,4 120,6 C 90,10 40,12 10,12 L 10,40 L -60,40 Z', fill: 'rgba(217,194,124,0.25)', stroke: C.wall, 'stroke-width': 4, 'stroke-linejoin': 'round' }, r);
    el('ellipse', { cx: -26, cy: 0, rx: 14, ry: 10, fill: '#4b3d86' }, r);
    [[140, -24], [150, 10], [135, 30]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 5, fill: C.water }, r));
    return r;
  }
  function palisade(p) {
    const c = g(p);
    el('rect', { x: -38, y: -80, width: 76, height: 160, rx: 22, fill: 'rgba(217,194,124,0.18)', stroke: C.wall, 'stroke-width': 4 }, c);
    for (let i = 0; i < 12; i++) el('ellipse', { cx: (i % 2 ? 20 : -20), cy: -62 + i * 11.5, rx: 13, ry: 7, fill: '#3f8a3a', stroke: '#9be58c', 'stroke-width': 2 }, c);
    return c;
  }

  S.register({
    id: 'discovery', section: '2-1', title: '細胞的發現與種類',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(4);

      // 年代軸
      const axis = g(root);
      el('line', { x1: 120, y1: 64, x2: 1080, y2: 64, stroke: '#3b5466', 'stroke-width': 3 }, axis);
      const YEARS = [[200, '1665', '虎克'], [470, '1674', '雷文霍克'], [760, '1838–39', '細胞學說'], [1010, '1855', '菲爾紹']];
      const yearOn = YEARS.map(([x, y, who]) => {
        el('circle', { cx: x, cy: 64, r: 9, fill: '#3b5466' }, axis);
        text(axis, x, 44, y, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle', class: 'mono' });
        text(axis, x, 98, who, { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
        const on = g(axis, { opacity: 0 });
        el('circle', { cx: x, cy: 64, r: 12, fill: C.hi }, on);
        text(on, x, 98, who, { 'font-size': 22, fill: C.hi, 'text-anchor': 'middle', 'font-weight': 700 });
        return on;
      });
      const lit = (i, pos) => { tl.to(yearOn.filter((_, k) => k !== i), { opacity: 0, duration: 0.3 }, pos); if (i >= 0) S.show(tl, yearOn[i], pos, 0.4); };

      // ===== 0 虎克 =====
      const P0 = g(root);
      const scope = at(P0, 300, 400);
      // 底座、立柱、夾住鏡筒的環、斜放的長鏡筒、下方的標本針、旁邊的油燈
      el('path', { d: 'M -60,150 L 60,150 L 50,172 L -50,172 Z', fill: '#8a6a40' }, scope);
      el('rect', { x: -6, y: -70, width: 12, height: 222, fill: '#8a6a40' }, scope);
      const tube = g(scope, { transform: 'rotate(-18 0 -60)' });
      el('rect', { x: -24, y: -190, width: 48, height: 200, rx: 10, fill: '#b98a4a', stroke: '#e0b070', 'stroke-width': 3 }, tube);
      el('rect', { x: -30, y: -200, width: 60, height: 22, rx: 6, fill: '#8a6a40' }, tube);
      el('rect', { x: -14, y: 10, width: 28, height: 24, rx: 4, fill: '#8a6a40' }, tube);
      el('rect', { x: -14, y: -70, width: 28, height: 20, rx: 4, fill: '#6b5030' }, scope);
      el('path', { d: 'M 40,80 L 40,40', stroke: '#cfd6dc', 'stroke-width': 4 }, scope);
      el('rect', { x: 28, y: 80, width: 24, height: 8, rx: 2, fill: '#6b5030' }, scope);
      el('rect', { x: -150, y: 70, width: 50, height: 80, rx: 10, fill: '#7a5a34' }, scope);
      el('path', { d: 'M -125,70 q -12,-24 0,-44 q 12,20 0,44 Z', fill: C.hi, opacity: 0.9 }, scope);
      text(P0, 300, 640, '虎克的顯微鏡（示意）', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const view0 = g(P0);
      const clip0 = el('clipPath', { id: 'dsClip0' }, el('defs', {}, root));
      el('circle', { cx: 800, cy: 380, r: 220 }, clip0);
      el('circle', { cx: 800, cy: 380, r: 220, fill: '#efe3c8' }, view0);
      const cork = g(view0, { 'clip-path': 'url(#dsClip0)' });
      for (let r = 0; r < 10; r++) for (let c = 0; c < 9; c++) {
        const x = 580 + c * 52 + (r % 2) * 22 + (rnd() - 0.5) * 6, y = 160 + r * 46 + (rnd() - 0.5) * 6;
        el('rect', { x, y, width: 46, height: 40, rx: 6, fill: '#f6efdc', stroke: '#7a5a34', 'stroke-width': 4 }, cork);
      }
      el('circle', { cx: 800, cy: 380, r: 220, fill: 'none', stroke: '#2b4252', 'stroke-width': 8 }, view0);
      const cellWord = S.pill(g(P0, { opacity: 0 }), 800, 640, '軟木塞薄片：一格一格的「cell（小房間）」', { size: 24, color: C.hi, edge: C.hi });

      tl.addLabel('s0');
      lit(0, 's0');
      S.show(tl, scope, 's0', 0.6);
      tl.fromTo(view0, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 's0+=0.6');
      S.show(tl, cellWord.parentNode, 's0+=1.6', 0.4);

      // ===== 1 雷文霍克 =====
      const P1 = g(root, { opacity: 0 });
      const plate = at(P1, 280, 390);
      el('rect', { x: -50, y: -150, width: 100, height: 260, rx: 16, fill: '#b98a4a', stroke: '#e0b070', 'stroke-width': 3 }, plate);
      el('circle', { cx: 0, cy: -80, r: 12, fill: '#cfe8ff', stroke: '#fff', 'stroke-width': 2 }, plate);
      el('path', { d: 'M -8,110 L -8,170 M 8,110 L 8,200', stroke: '#8a6a40', 'stroke-width': 6 }, plate);
      text(P1, 280, 640, '只有一片小鏡片的顯微鏡（示意）', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const clip1 = el('clipPath', { id: 'dsClip1' }, root.querySelector('defs'));
      el('circle', { cx: 800, cy: 380, r: 220 }, clip1);
      el('circle', { cx: 800, cy: 380, r: 220, fill: '#cfe4dc' }, P1);
      const pond = g(P1, { 'clip-path': 'url(#dsClip1)' });
      const swimmers = [];
      for (let i = 0; i < 9; i++) {
        const o = at(pond, 0, 0);
        const kind = i % 3;
        if (kind === 0) { el('ellipse', { cx: 0, cy: 0, rx: 34, ry: 14, fill: 'rgba(60,140,120,0.35)', stroke: '#2f7a6a', 'stroke-width': 3 }, o); el('ellipse', { cx: 4, cy: 0, rx: 9, ry: 6, fill: '#4b3d86' }, o); }
        else if (kind === 1) el('rect', { x: -10, y: -4, width: 20, height: 8, rx: 4, fill: '#5a7a3a' }, o);
        else el('path', { d: 'M -16,0 q 4,-8 8,0 q 4,8 8,0 q 4,-8 8,0 q 4,8 8,0', stroke: '#5a5a8a', 'stroke-width': 3, fill: 'none' }, o);
        const a = rnd() * 6.283, rr = 40 + rnd() * 120;
        swimmers.push({ o: o.parentNode, x0: 800 + Math.cos(a) * rr, y0: 380 + Math.sin(a) * rr, ax: 30 + rnd() * 40, ay: 20 + rnd() * 30, w: 0.8 + rnd() * 1.2, ph: rnd() * 6 });
      }
      // 在視野裡繞小圈游動（不會游出去）
      const swim = (u) => swimmers.forEach((s) => {
        const t = u * 4 * s.w + s.ph;
        const x = s.x0 + Math.sin(t) * s.ax, y = s.y0 + Math.sin(t * 2) * s.ay * 0.5;
        S.place(s.o, { x, y, r: Math.atan2(Math.cos(t * 2) * s.ay, Math.cos(t) * s.ax) * 57.3 });
      });
      swim(0);
      el('circle', { cx: 800, cy: 380, r: 220, fill: 'none', stroke: '#2b4252', 'stroke-width': 8 }, P1);
      S.pill(P1, 800, 640, '池水裡活的微生物', { size: 24, color: C.hi, edge: C.hi });

      tl.addLabel('s1');
      lit(1, 's1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.5);
      S.drive(tl, swim, 4, 's1+=0.5');

      // ===== 2 細胞學說 =====
      const P2 = g(root, { opacity: 0 });
      const plantCard = card(P2, 300, 140, 420, 330, '許來登', '研究植物', C.chloro);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const x = 168 + c * 66, y = 170 + r * 52;
        el('rect', { x, y, width: 62, height: 48, rx: 6, fill: 'rgba(111,206,98,0.18)', stroke: C.wall, 'stroke-width': 3 }, plantCard);
        el('ellipse', { cx: x + 16, cy: y + 22, rx: 7, ry: 5, fill: '#2f7a2a' }, plantCard);
        el('circle', { cx: x + 42, cy: y + 26, r: 7, fill: '#4b3d86' }, plantCard);
      }
      const animalCard = card(P2, 900, 140, 420, 330, '許旺', '研究動物', C.membrane);
      [[790, 210], [870, 200], [960, 215], [1030, 205], [820, 285], [910, 290], [1000, 285]].forEach(([x, y]) => {
        el('path', { d: S.smoothPath(S.blobPts(x, y, 36, 28, 16, [[3, 0.08, rnd() * 6]])), fill: 'rgba(99,212,191,0.18)', stroke: C.membrane, 'stroke-width': 3 }, animalCard);
        el('circle', { cx: x, cy: y, r: 8, fill: '#4b3d86' }, animalCard);
      });
      const theory = g(P2, { opacity: 0 });
      el('rect', { x: 170, y: 500, width: 860, height: 150, rx: 18, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 3 }, theory);
      text(theory, 600, 545, '細胞學說', { 'font-size': 32, 'font-weight': 700, fill: C.hi, 'text-anchor': 'middle' });
      text(theory, 600, 590, '① 生物都是由細胞構成的', { 'font-size': 26, 'text-anchor': 'middle' });
      text(theory, 600, 630, '② 細胞是生物體構造和功能的基本單位', { 'font-size': 26, 'text-anchor': 'middle' });
      const arrowsT = g(P2, { opacity: 0 });
      el('path', { d: 'M 360,476 L 470,500 M 840,476 L 730,500', stroke: C.hi, 'stroke-width': 4 }, arrowsT);

      tl.addLabel('s2');
      lit(2, 's2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      tl.fromTo([plantCard, animalCard], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.4 }, 's2+=0.4');
      S.show(tl, arrowsT, 's2+=1.4', 0.4);
      S.show(tl, theory, 's2+=1.6', 0.6);
      lit(3, 's2+=3');

      // ===== 3 動物細胞的形狀與功能 =====
      const P3 = g(root, { opacity: 0 });
      const A = [['神經細胞', '很長、有分支：傳遞訊息', C.nerve, neuron, 0.9], ['人的紅血球', '雙凹圓盤狀、沒有細胞核：運送氧', '#ff8094', rbc, 1], ['肌肉細胞', '細長：收縮、產生運動', '#ff9aa4', muscle, 0.95], ['精子', '有尾巴：游向卵', '#9fc4ff', sperm, 1]];
      let spermEl = null;
      const cardsA = A.map(([n, f, col, draw, k], i) => {
        const x = 165 + i * 290, c = card(P3, x, 140, 270, 470, n, '', col);
        c.lastChild.remove();
        const lines = f.split('：');
        text(c, x, 560, lines[0], { 'font-size': 21, fill: C.mute, 'text-anchor': 'middle' });
        text(c, x, 590, lines[1], { 'font-size': 21, fill: C.ink, 'text-anchor': 'middle', 'font-weight': 700 });
        const d = draw(at(c, x - (draw === neuron ? 40 : draw === sperm ? 20 : draw === rbc ? 0 : 0), 330, k));
        if (draw === sperm) spermEl = d;
        return c;
      });
      cardsA.forEach((c) => { const t = c.querySelector('text'); t.setAttribute('y', 520); });

      tl.addLabel('s3');
      lit(-1, 's3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      tl.fromTo(cardsA, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.3 }, 's3+=0.4');
      S.drive(tl, (u) => spermEl.wave(u), 3, 's3+=1');

      // ===== 4 植物細胞的形狀與功能 =====
      const P4 = g(root, { opacity: 0 });
      let guardEl = null;
      const B = [['保衛細胞', '兩個圍成氣孔：控制氣孔開關', C.chloro, guard], ['根毛細胞', '向外突出：增加吸水面積', C.wall, rootHair], ['葉肉細胞', '葉綠體多：進行光合作用', '#9be58c', palisade]];
      const cardsB = B.map(([n, f, col, draw], i) => {
        const x = 230 + i * 370, c = card(P4, x, 140, 340, 470, n, '', col);
        c.lastChild.remove();
        c.querySelector('text').setAttribute('y', 520);
        const [a, b] = f.split('：');
        text(c, x, 560, a, { 'font-size': 21, fill: C.mute, 'text-anchor': 'middle' });
        text(c, x, 590, b, { 'font-size': 21, fill: C.ink, 'text-anchor': 'middle', 'font-weight': 700 });
        const d = draw(at(c, x - (draw === rootHair ? 30 : 0), 320, draw === palisade ? 1.1 : 1.2));
        if (draw === guard) guardEl = d;
        return c;
      });

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      tl.fromTo(cardsB, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.3 }, 's4+=0.4');
      S.drive(tl, (u) => guardEl.open(0.5 + 0.5 * Math.cos(u * Math.PI * 4)), 3, 's4+=1.4', 'none');

      // ===== 5 大小：大小尺 =====
      const P5 = g(root, { opacity: 0 });
      const X = (m) => 140 + (Math.log10(m) + 7) * 135; // 0.1 μm … 1 m
      el('line', { x1: X(3e-7), y1: 300, x2: X(1.4), y2: 300, stroke: '#4a6272', 'stroke-width': 4 }, P5);
      [['1 μm', 1e-6], ['10 μm', 1e-5], ['100 μm', 1e-4], ['1 mm', 1e-3], ['1 cm', 1e-2], ['10 cm', 0.1], ['1 m', 1]].forEach(([l, m]) => {
        el('line', { x1: X(m), y1: 292, x2: X(m), y2: 308, stroke: C.ink, 'stroke-width': 3 }, P5);
        text(P5, X(m), 280, l, { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle', class: 'mono' });
      });
      el('rect', { x: X(1e-4), y: 222, width: X(1.4) - X(1e-4), height: 12, rx: 6, fill: C.chloro, opacity: 0.8 }, P5);
      text(P5, X(1e-4) + 10, 210, '肉眼看得到（約 0.1 mm 以上＊）', { 'font-size': 20, fill: C.chloro });
      el('rect', { x: X(3e-7), y: 222, width: X(1e-4) - X(3e-7) - 4, height: 12, rx: 6, fill: C.vacuole, opacity: 0.8 }, P5);
      text(P5, X(3e-7) + 4, 210, '要用顯微鏡', { 'font-size': 20, fill: C.vacuole });
      const SZ = [['細菌', 2e-6, 420], ['紅血球', 8e-6, 490], ['口腔皮膜細胞', 6e-5, 420], ['洋蔥表皮細胞', 3e-4, 490], ['雞蛋的蛋黃', 3e-2, 420], ['坐骨神經細胞', 1, 490]];
      const markers = SZ.map(([n, m, y]) => {
        const mk = g(P5);
        el('line', { x1: X(m), y1: 312, x2: X(m), y2: y - 26, stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, mk);
        el('circle', { cx: X(m), cy: 300, r: 9, fill: C.hi }, mk);
        S.pill(mk, Math.min(1090, Math.max(110, X(m))), y, n, { size: 22, color: C.ink, edge: '#3d5666' });
        return mk;
      });
      const uni = g(P5, { opacity: 0 });
      el('rect', { x: 140, y: 560, width: 920, height: 110, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, uni);
      text(uni, 170, 605, '單細胞生物：一個細胞就是一個個體（草履蟲、變形蟲、細菌、酵母菌）', { 'font-size': 24 });
      text(uni, 170, 645, '多細胞生物：由許多細胞組成，細胞分工合作（人和其他動物、植物）', { 'font-size': 24 });

      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      tl.fromTo(markers, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.25 }, 's5+=0.8');
      S.show(tl, uni, 's5+=2.6', 0.5);

      return {
        tl,
        notes: [
          '＊示意：顯微鏡和觀察到的畫面都是簡化畫法。',
          '＊示意：微生物的形狀和游動都是簡化畫法。',
          '＊補充：1855 年菲爾紹提出「細胞都是由原來的細胞分裂而來」，讓細胞學說更完整。',
          '＊示意：各種細胞都放大到差不多大，真實大小差很多（紅血球約 8 μm，神經細胞可長達約 1 m）。',
          '＊示意：各種細胞都放大到差不多大；葉肉細胞指含葉綠體多的葉肉細胞（例如柵狀組織的細胞）。',
          '＊大小為約略值，依種類和個體而不同：細菌約 1～數 μm、紅血球約 8 μm、口腔皮膜細胞約 60 μm、洋蔥表皮細胞約 0.3 mm、蛋黃約 3 cm、坐骨神經細胞可長達約 1 m。',
        ],
        steps: [
          '1665 年，<b>虎克</b>用自製的顯微鏡觀察軟木塞薄片，看到許多小格子，命名為「<b>細胞</b>」。他看到的其實是死細胞留下的細胞壁。',
          '<b>雷文霍克</b>用自己磨的鏡片，第一次看到池水裡活生生的微小生物（微生物）。',
          '1838～1839 年，<b>許來登</b>研究植物、<b>許旺</b>研究動物，提出<b>細胞學說</b>：生物都由細胞構成，細胞是構造和功能的基本單位。',
          '細胞的<b>形狀和功能有關</b>：神經細胞很長、有分支，能傳遞訊息；人的紅血球呈雙凹圓盤狀、沒有細胞核，適合運送氧；肌肉細胞能收縮；精子有尾巴能游動。',
          '植物細胞也一樣：<b>保衛細胞</b>控制氣孔開關；<b>根毛細胞</b>向外突出，增加吸水的面積；<b>葉肉細胞</b>有很多葉綠體。',
          '大多數動植物細胞約 10～100 μm＊，要用顯微鏡才看得到；洋蔥表皮細胞較長，但又薄又透明，仍要用顯微鏡觀察。也有很大的細胞：<b>雞蛋的蛋黃</b>是一個細胞，坐骨神經細胞可長達約 1 m＊。',
        ],
      };
    },
  });
})();
