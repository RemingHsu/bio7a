/* 場景 4：組成層次 — 細胞 → 組織 → 器官 → 器官系統 → 個體；植物；單細胞生物 */
(() => {
  const { el, g, text, C } = S;
  const T = { cell: '#7a3549', epi: '#ffb3c1', muscle: '#b8434f', conn: '#d6a98c', lumen: '#3e1f2d' };

  // 麵包屑：每個項目有「一般」與「目前」兩層
  function crumbs(parent, names, y) {
    const size = 26, gap = 34;
    const ws = names.map((n) => S.textWidth(n, size) + 32);
    let x = 600 - (ws.reduce((a, b) => a + b, 0) + gap * (names.length - 1)) / 2;
    return names.map((n, i) => {
      const cx = x + ws[i] / 2;
      S.pill(parent, cx, y, n, { size, color: C.mute, bg: 'rgba(13,24,34,.9)', edge: '#2f4556' });
      const on = g(parent, { opacity: 0 });
      S.pill(on, cx, y, n, { size, color: '#06221d', bg: C.membrane, edge: C.membrane });
      if (i < names.length - 1) text(parent, x + ws[i] + gap / 2, y + 9, '›', { 'font-size': 30, fill: C.mute, 'text-anchor': 'middle' });
      x += ws[i] + gap;
      return on;
    });
  }

  function epiCell(p) {
    const c = g(p);
    el('rect', { x: -32, y: -50, width: 64, height: 100, rx: 14, fill: T.cell, stroke: T.epi, 'stroke-width': 3 }, c);
    for (let k = 0; k < 3; k++) el('circle', { cx: -16 + k * 16, cy: -34, r: 5, fill: '#f3d5dd', opacity: 0.5 }, c);
    el('ellipse', { cx: 0, cy: 18, rx: 14, ry: 18, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 2 }, c);
    return c;
  }

  function swatch(p, cx, cy, label, col, fill) {
    const s = g(p, { opacity: 0 });
    el('rect', { x: cx - 210, y: cy - 95, width: 420, height: 190, rx: 16, fill, stroke: col, 'stroke-width': 3 }, s);
    S.pill(s, cx, cy - 122, label, { size: 24, color: col, edge: col });
    return s;
  }

  // 器官系統畫面：人體座標放大 2 倍（p → 2p + (-600,-110)）
  const T3 = { x: -600, y: -110, s: 2 };
  const toStage3 = (x, y) => [2 * x - 600, 2 * y - 110];
  // 器官畫面：胃放大到舞台中央（胃座標 p → 0.72p + (620,410)）
  const BIG = { x: 640, y: 420, s: 0.86 };
  const ST_BIG = { x: (BIG.x - T3.x) / T3.s, y: (BIG.y - T3.y) / T3.s, s: BIG.s / T3.s };

  S.register({
    id: 'levels', section: '1-4', title: '組成層次',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(9);
      const crumbA = g(root);
      const onA = crumbs(crumbA, ['細胞', '組織', '器官', '器官系統', '個體'], 52);
      const crumbP = g(root, { opacity: 0 });
      const onP = crumbs(crumbP, ['細胞', '組織', '器官', '個體'], 52);
      text(crumbP, 600, 106, '植物沒有「器官系統」這一層', { 'font-size': 22, fill: '#ff9aa8', 'text-anchor': 'middle' });
      const crumbU = g(root, { opacity: 0 });
      S.pill(crumbU, 600, 52, '一個細胞 ＝ 一個個體', { size: 26, color: '#06221d', bg: C.membrane, edge: C.membrane });
      const lit = (on, i, pos) => { tl.to(on.filter((_, k) => k !== i), { opacity: 0, duration: 0.3 }, pos); S.show(tl, on[i], pos, 0.4); };

      // ===== 組織圖塊 =====
      const SW = [[330, 270], [870, 270], [330, 525], [870, 525]];
      const swA = swatch(root, ...SW[0], '上皮組織：保護、分泌', T.epi, T.lumen);
      const swB = swatch(root, ...SW[1], '肌肉組織：收縮、運動', '#ff9aa4', '#5e2330');
      for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) {
        const x = 708 + i * 98 + (r % 2) * 30, y = 210 + r * 40;
        el('ellipse', { cx: x, cy: y, rx: 44, ry: 11, fill: T.muscle, stroke: '#ff9aa4', 'stroke-width': 2 }, swB);
        el('ellipse', { cx: x, cy: y, rx: 8, ry: 5, fill: '#4b3d86' }, swB);
      }
      const swC = swatch(root, ...SW[2], '神經組織：傳遞訊息', C.nerve, '#1c2638');
      [[200, 505, 1], [330, 560, 0.7]].forEach(([x, y, k]) => {
        const n = g(swC, { transform: `translate(${x},${y}) scale(${k})` });
        for (let d = 0; d < 6; d++) { const a = 1.6 + d * 0.62; el('path', { d: `M0,0 q${Math.cos(a) * 30},${Math.sin(a) * 30 - 10} ${Math.cos(a) * 52},${Math.sin(a) * 52}`, stroke: C.nerve, 'stroke-width': 4, fill: 'none' }, n); }
        el('path', { d: 'M 0,0 C 80,10 140,-20 260,10 M 260,10 l 24,-18 M 260,10 l 28,8 M 260,10 l 14,24', stroke: C.nerve, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, n);
        el('circle', { cx: 0, cy: 0, r: 17, fill: '#a8862a', stroke: C.nerve, 'stroke-width': 3 }, n);
      });
      const swD = swatch(root, ...SW[3], '結締組織：連接、支持、運輸等（如骨骼、血液）', '#ffe0c8', '#8a6250');
      for (let i = 0; i < 9; i++) { const x = 680 + rnd() * 340, y = 450 + rnd() * 150; el('path', { d: `M${x},${y} q35,${-15 + rnd() * 30} 70,0`, stroke: '#ffe0c8', 'stroke-width': 3, fill: 'none', opacity: 0.8 }, swD); }
      [[720, 490], [800, 560], [900, 470], [1000, 580], [960, 520]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 15, fill: '#c43a4f', stroke: '#ff8094', 'stroke-width': 2 }, swD); el('circle', { cx: x, cy: y, r: 6, fill: '#e0627a' }, swD); });

      // ===== 細胞 =====
      const cells = [];
      for (let i = 0; i < 12; i++) cells.push(epiCell(root));
      const spots = cells.map((_, i) => (i === 0 ? [600, 390] : [600 + Math.cos(((i - 1) / 11) * 6.283) * 240, 390 + Math.sin(((i - 1) / 11) * 6.283) * 165]));
      cells.forEach((c) => { gsap.set(c, { transformOrigin: '50% 50%' }); gsap.set(c, { x: 600, y: 390, scale: 0, opacity: 0 }); });

      // ===== 人體與消化系統（人體座標） =====
      const FIT = { x: 60, y: 76, s: 0.9 }; // 個體畫面：整個人放進麵包屑下方
      const body = S.place(g(root, { opacity: 0 }), FIT);
      S.human(body, { fill: 'rgba(44,82,104,0.55)', stroke: C.bodyEdge, sw: 2.5 });
      const others = g(body, { opacity: 0 });
      S.bodyOthers(others);
      const tract = S.place(g(root), T3);
      const D = S.digestive(tract);
      const st = D.stomach;
      S.place(st, ST_BIG);
      const sto = S.stomach(st, { stubs: false, wall: 6, shade: true });
      // 胃壁三層（由內而外：上皮、結締、肌肉），只畫在胃的輪廓內
      const clipId = 'stClip4';
      el('path', { d: S.STOMACH_D }, el('clipPath', { id: clipId }, el('defs', {}, root)));
      const layers = g(st, { 'clip-path': `url(#${clipId})` });
      const bands = [[92, T.epi], [68, T.conn], [44, T.muscle]].map(([w, col]) => el('path', { d: S.STOMACH_D, fill: 'none', stroke: col, 'stroke-width': w, opacity: 0 }, layers));
      let nd = '';
      for (let f = 0.01; f <= 0.8; f += 0.01) { const [x, y] = S.inset(sto.body, f, 11); nd += (nd ? 'L' : 'M') + `${x.toFixed(1)},${y.toFixed(1)}`; }
      const nerve = el('path', { d: nd, fill: 'none', stroke: C.nerve, 'stroke-width': 4, 'stroke-dasharray': '10 6', opacity: 0 }, st);
      const outline = el('path', { d: S.STOMACH_D, fill: 'none', stroke: '#f2a0b0', 'stroke-width': 4, opacity: 0 }, st);
      // 器官畫面才顯示的食道、十二指腸接口（蓋住切面上賁門的開口）
      const stubs = g(st, { opacity: 0 });
      el('path', { d: S.STOMACH_ESO.replace('-150', '-136'), stroke: '#a24d60', 'stroke-width': 46, fill: 'none', 'stroke-linecap': 'round' }, stubs);
      el('path', { d: S.STOMACH_ESO.replace('-150', '-136'), stroke: '#c56a7d', 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round', opacity: 0.7 }, stubs);
      el('path', { d: S.STOMACH_DUO, stroke: '#c07a5e', 'stroke-width': 42, fill: 'none', 'stroke-linecap': 'round' }, stubs);
      const big = (p) => [BIG.x + BIG.s * p[0], BIG.y + BIG.s * p[1]];
      // 先讓其他器官隱形（胃放大時只看胃）
      const hideOrg = [...tract.children].filter((e) => e !== st);
      hideOrg.forEach((e) => e.setAttribute('opacity', 0));
      st.setAttribute('opacity', 0);

      const callSt = [
        S.callout(root, ...big(S.inset(sto.body, 0.13, 40)), 900, 170, '上皮組織', T.epi),
        S.callout(root, ...big(S.inset(sto.body, 0.47, 28)), 430, 650, '結締組織', '#ffe0c8'),
        S.callout(root, ...big(S.inset(sto.body, 0.28, 6)), 1010, 360, '肌肉組織', '#ff9aa4'),
        S.callout(root, ...big(S.inset(sto.body, 0.37, 11)), 1000, 540, '神經組織', C.nerve),
      ];
      const callSys = [
        [600, 126, 430, 142, '口腔'], [600, 200, 430, 290, '食道'], [562, 285, 360, 450, '肝臟'], [648, 282, 870, 430, '胃'],
        [596, 323, 870, 530, '胰臟'], [612, 352, 870, 620, '小腸'], [555, 345, 360, 580, '大腸'], [602, 395, 790, 682, '肛門'],
      ].map(([x, y, lx, ly, n]) => S.callout(root, ...toStage3(x, y), lx, ly, n, C.ink));
      const chips = g(root, { opacity: 0 });
      [['消化系統', C.membrane], ['呼吸系統', C.vacuole], ['循環系統', C.blood], ['神經系統', C.nerve], ['……等', C.mute]].forEach(([n, col], i) =>
        S.pill(chips, 960, 220 + i * 62, n, { size: 26, color: col, edge: col }));

      // ===== 植物 =====
      const plant = g(root, { opacity: 0 });
      el('line', { x1: 220, y1: 520, x2: 760, y2: 520, stroke: '#7a5a3a', 'stroke-width': 4 }, plant);
      ['M 480,520 C 470,560 450,600 420,640', 'M 480,520 C 490,570 510,610 540,650', 'M 480,520 L 482,665', 'M 458,580 l -40,8', 'M 500,590 l 38,4'].forEach((d) =>
        el('path', { d, stroke: '#c8a27a', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, plant));
      el('path', { d: 'M 480,520 C 475,420 490,320 480,200', stroke: '#5aa04d', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, plant);
      el('path', { d: 'M 482,335 C 540,320 590,322 606,350', stroke: '#5aa04d', 'stroke-width': 7, fill: 'none' }, plant);
      [[436, 430, 30], [528, 395, -30], [438, 300, 30], [522, 255, -28]].forEach(([x, y, r]) => {
        const l = g(plant, { transform: `translate(${x},${y}) rotate(${r})` });
        el('ellipse', { cx: 0, cy: 0, rx: 50, ry: 19, fill: '#4fae4a' }, l);
        el('line', { x1: -44, y1: 0, x2: 44, y2: 0, stroke: '#2f7a2a', 'stroke-width': 3 }, l);
      });
      for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.28; el('ellipse', { cx: 480 + Math.cos(a) * 26, cy: 180 + Math.sin(a) * 26, rx: 22, ry: 14, fill: '#ff8fb1', transform: `rotate(${(a * 180) / Math.PI} ${480 + Math.cos(a) * 26} ${180 + Math.sin(a) * 26})` }, plant); }
      el('circle', { cx: 480, cy: 180, r: 15, fill: C.hi }, plant);
      el('circle', { cx: 610, cy: 388, r: 36, fill: '#e2574c', stroke: '#ff9a8c', 'stroke-width': 3 }, plant);
      el('circle', { cx: 610, cy: 392, r: 24, fill: '#ffd3b0' }, plant);
      [[600, 386], [618, 384], [609, 400]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 5, ry: 8, fill: '#4a2a1a' }, plant));
      const callPl = [
        S.callout(plant, 480, 165, 300, 160, '花', '#ff8fb1'), S.callout(plant, 425, 300, 280, 300, '葉', C.chloro),
        S.callout(plant, 481, 460, 300, 450, '莖', C.chloro), S.callout(plant, 450, 610, 300, 620, '根', '#c8a27a'),
        S.callout(plant, 640, 368, 760, 330, '果實', '#ff8fb1'), S.callout(plant, 618, 386, 760, 420, '種子', '#ff8fb1'),
      ];
      const cards = g(plant);
      [[230, '營養器官', '根、莖、葉', '吸收、運輸、製造養分', C.chloro], [440, '生殖器官', '花、果實、種子', '繁殖下一代', '#ff8fb1']].forEach(([y, h, a, b, col]) => {
        el('rect', { x: 840, y: y - 50, width: 320, height: 160, rx: 16, fill: 'rgba(13,24,34,.85)', stroke: col, 'stroke-width': 2 }, cards);
        text(cards, 864, y - 10, h, { 'font-size': 28, fill: col, 'font-weight': 700 });
        text(cards, 864, y + 36, a, { 'font-size': 30, 'font-weight': 700 });
        text(cards, 864, y + 80, b, { 'font-size': 22, fill: C.mute });
      });

      // ===== 單細胞生物 =====
      const uni = g(root, { opacity: 0 });
      const paraO = S.place(g(uni), { x: 330, y: 400 });
      const para = g(paraO);
      const pPath = 'M -170,0 C -170,-55 -60,-70 40,-60 C 120,-52 175,-30 175,5 C 175,40 120,60 40,62 C -20,64 -40,30 -80,40 C -130,52 -170,40 -170,0 Z';
      const pp = el('path', { d: pPath, fill: 'rgba(99,212,191,0.16)', stroke: C.membrane, 'stroke-width': 4 }, para);
      el('ellipse', { cx: 10, cy: -6, rx: 42, ry: 24, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, para);
      el('circle', { cx: 52, cy: 12, r: 8, fill: '#7b6ad6' }, para);
      [[-112, -12], [118, -6]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 13, fill: 'rgba(98,168,255,0.45)', stroke: C.vacuole, 'stroke-width': 2 }, para); });
      [[-50, 18], [-70, -20], [80, 30]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 7, fill: C.mito, opacity: 0.8 }, para));
      const cilia = [];
      const L = pp.getTotalLength();
      for (let k = 0; k < 64; k++) {
        const s = (k / 64) * L, a = pp.getPointAtLength(s), b = pp.getPointAtLength((s + 2) % L);
        const nx = b.y - a.y, ny = -(b.x - a.x), n = Math.hypot(nx, ny) || 1;
        cilia.push({ x: a.x, y: a.y, nx: nx / n, ny: ny / n, k, l: el('line', { x1: a.x, y1: a.y, x2: a.x, y2: a.y, stroke: '#9fe8da', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, para) });
      }
      const beat = (u) => cilia.forEach((c) => {
        const len = 14, sw = Math.sin(u * 60 - c.k * 0.55) * 0.6;
        const dx = c.nx * Math.cos(sw) - c.ny * Math.sin(sw), dy = c.ny * Math.cos(sw) + c.nx * Math.sin(sw);
        c.l.setAttribute('x2', (c.x + dx * len).toFixed(1)); c.l.setAttribute('y2', (c.y + dy * len).toFixed(1));
      });
      beat(0);

      const amoeba = el('path', { d: '', fill: 'rgba(159,232,218,0.18)', stroke: C.membrane, 'stroke-width': 4 }, uni);
      const AM = [S.blobPts(880, 410, 120, 95, 48, [[3, 0.22, 0], [5, 0.08, 1]]), S.blobPts(880, 410, 120, 95, 48, [[3, 0.18, 1.6], [2, 0.16, 0.4]]), S.blobPts(880, 410, 120, 95, 48, [[4, 0.2, 2.5], [3, 0.1, 0.2]])];
      const amorph = (u) => { const t = u * 2, i = Math.min(1, Math.floor(t)); amoeba.setAttribute('d', S.smoothPath(S.lerpPts(AM[i], AM[i + 1], S.smoothstep(0, 1, t - i)))); };
      amorph(0);
      el('circle', { cx: 880, cy: 410, r: 26, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, uni);
      el('circle', { cx: 830, cy: 440, r: 14, fill: 'rgba(98,168,255,0.45)', stroke: C.vacuole, 'stroke-width': 2 }, uni);
      const ul = [S.pill(g(uni), 330, 560, '草履蟲', { size: 28, color: C.membrane, edge: C.membrane }), S.pill(g(uni), 880, 560, '變形蟲', { size: 28, color: C.membrane, edge: C.membrane })];
      void ul;
      text(uni, 600, 640, '一個細胞就能獨立完成各種生命現象，例如攝食、運動、生殖', { 'font-size': 26, fill: C.mute, 'text-anchor': 'middle' });

      // ---------- 時間軸 ----------
      tl.addLabel('s0');
      lit(onA, 0, 's0');
      tl.to(cells[0], { scale: 1.5, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, 's0+=0.2');
      tl.to(cells[0], { scale: 1, duration: 0.5 }, 's0+=1.3');
      cells.slice(1).forEach((c, i) => tl.to(c, { x: spots[i + 1][0], y: spots[i + 1][1], scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, `s0+=${1.5 + i * 0.12}`));

      tl.addLabel('s1');
      lit(onA, 1, 's1');
      S.show(tl, swA, 's1', 0.5);
      cells.forEach((c, i) => tl.to(c, { x: SW[0][0] - 204 + 17 + i * 34, y: SW[0][1] + 6, scaleX: 0.5, scaleY: 0.8, duration: 1, ease: 'power2.inOut' }, `s1+=${0.1 + i * 0.04}`));
      [swB, swC, swD].forEach((s, i) => S.show(tl, s, `s1+=${1.4 + i * 0.5}`, 0.5));

      tl.addLabel('s2');
      lit(onA, 2, 's2');
      tl.to([swA, swB, swC, swD], { x: (i) => BIG.x - SW[i][0], y: (i) => BIG.y - SW[i][1], scale: 0.15, transformOrigin: '50% 50%', opacity: 0, duration: 1, ease: 'power2.in', stagger: 0.15 }, 's2');
      tl.to(cells, { x: BIG.x, y: BIG.y, scale: 0.05, opacity: 0, duration: 1, ease: 'power2.in' }, 's2');
      S.show(tl, [st, stubs], 's2+=0.8', 0.5);
      bands.forEach((b, i) => S.show(tl, b, `s2+=${1.1 + i * 0.35}`, 0.4));
      S.show(tl, [nerve, outline], 's2+=2.1', 0.4);
      callSt.forEach((c, i) => S.show(tl, c, `s2+=${1.3 + i * 0.35}`, 0.4));

      tl.addLabel('s3');
      lit(onA, 3, 's3');
      S.hide(tl, callSt, 's3', 0.3);
      S.hide(tl, [nerve, outline, stubs], 's3', 0.3);
      bands.forEach((b) => tl.to(b, { opacity: 0, duration: 0.4 }, 's3'));
      S.move(tl, st, ST_BIG, S.BODY.stomach, 1.3, 's3+=0.2');
      S.show(tl, hideOrg, 's3+=1.1', 0.6);
      callSys.forEach((c, i) => S.show(tl, c, `s3+=${1.6 + i * 0.16}`, 0.3));

      tl.addLabel('s4');
      lit(onA, 4, 's4');
      S.hide(tl, callSys, 's4', 0.3);
      S.move(tl, tract, T3, FIT, 1.4, 's4+=0.2');
      S.show(tl, body, 's4+=0.9', 0.6);
      S.show(tl, others, 's4+=1.7', 0.6);
      S.show(tl, chips, 's4+=1.7', 0.3);
      tl.fromTo(chips.children, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.15 }, 's4+=1.7');

      tl.addLabel('s5');
      S.hide(tl, [tract, body, chips, crumbA], 's5', 0.5);
      S.show(tl, crumbP, 's5+=0.3', 0.5);
      lit(onP, 2, 's5+=0.3');
      S.show(tl, plant, 's5+=0.5', 0.6);
      tl.fromTo(callPl, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.15 }, 's5+=1');
      tl.fromTo(cards.children, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 's5+=1.8');

      tl.addLabel('s6');
      S.hide(tl, [plant, crumbP], 's6', 0.5);
      S.show(tl, crumbU, 's6+=0.3', 0.5);
      S.show(tl, uni, 's6+=0.5', 0.6);
      S.drive(tl, beat, 4, 's6+=0.5');
      S.move(tl, paraO, { x: 250, y: 400, r: -4 }, { x: 380, y: 400, r: 3 }, 4, 's6+=0.5', 'sine.inOut');
      S.drive(tl, amorph, 4, 's6+=0.5', 'sine.inOut');

      return {
        tl,
        steps: [
          '<b>細胞</b>是構成生物體的基本單位，多細胞生物由許多細胞組成。',
          '<b>組織</b>：形態相似、功能相同的細胞聚在一起。動物有上皮、肌肉、神經、結締四大類組織。',
          '<b>器官</b>：由多種組織組合，完成特定功能。例如胃：上皮組織分泌胃液，肌肉組織收縮、攪拌食物，神經組織調控胃的活動。',
          '<b>器官系統</b>：多個器官分工合作，完成一類生理功能。口腔、食道、胃、小腸、大腸、肝臟、胰臟等組成消化系統。',
          '<b>個體</b>：多個器官系統互相協調合作，就成為一個完整的人。',
          '植物的層次是 細胞 → 組織 → 器官 → 個體，<b>沒有器官系統</b>。根、莖、葉是營養器官；花、果實、種子是生殖器官。',
          '<b>單細胞生物</b>只有一個細胞，這個細胞就是一個個體，能獨立完成各種生命現象，例如草履蟲、變形蟲能攝食、運動、生殖。',
        ],
      };
    },
  });
})();
