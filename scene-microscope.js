/* 1-5 認識顯微鏡：構造、倍率、倒像與移動玻片、低倍換高倍、操作步驟、玻片標本、解剖顯微鏡 */
(() => {
  const { el, g, text, C } = S;
  const M = { body: '#a9bccb', edge: '#5f7f94', dark: '#6f8797', glass: 'rgba(160,215,255,0.35)' };
  const OBJ = [[4, 34], [10, 50], [40, 70]]; // 倍率、長度

  // 複式顯微鏡側面圖。原點在光軸與底座底部；回傳各部位，方便強調或做動作
  S.drawMicroscope = (p) => {
    const m = g(p), parts = {};
    parts.base = el('rect', { x: -120, y: -40, width: 270, height: 40, rx: 14, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, m);
    parts.arm = el('path', { d: 'M 112,-40 L 112,-200 C 112,-300 84,-380 40,-424 L 18,-404 C 58,-362 80,-290 80,-200 L 80,-40 Z', fill: M.body, stroke: M.edge, 'stroke-width': 3 }, m);
    parts.light = g(m);
    el('rect', { x: -26, y: -112, width: 52, height: 40, rx: 8, fill: M.dark }, parts.light);
    parts.bulb = el('circle', { cx: 0, cy: -112, r: 15, fill: '#ffe9a8', stroke: M.edge, 'stroke-width': 2 }, parts.light);
    const stageG = g(m); parts.stageG = stageG;
    el('rect', { x: 0, y: -186, width: 82, height: 12, fill: M.dark }, stageG);
    parts.stage = el('rect', { x: -112, y: -194, width: 196, height: 14, rx: 4, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, stageG);
    parts.diaphragm = el('rect', { x: -34, y: -176, width: 68, height: 10, rx: 4, fill: M.dark, stroke: M.edge, 'stroke-width': 2 }, stageG);
    parts.slide = el('rect', { x: -70, y: -201, width: 140, height: 7, rx: 2, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 1.5 }, stageG);
    parts.clips = g(stageG);
    [-86, 66].forEach((x) => el('path', { d: `M ${x},-196 q 10,-12 22,-6`, stroke: '#e0e8ee', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, parts.clips));
    parts.tube = el('rect', { x: -22, y: -470, width: 44, height: 172, rx: 6, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, m);
    parts.eyepiece = el('rect', { x: -16, y: -524, width: 32, height: 56, rx: 5, fill: M.dark, stroke: M.edge, 'stroke-width': 3 }, m);
    parts.nose = g(m);
    const objs = OBJ.map(([mag, len], i) => {
      const o = g(parts.nose, { transform: `rotate(${(i - 2) * 34} 0 -292)` });
      el('rect', { x: -11, y: -290, width: 22, height: len, rx: 4, fill: '#d6e0e7', stroke: M.edge, 'stroke-width': 2 }, o);
      el('rect', { x: -11, y: -290 + len * 0.45, width: 22, height: 6, fill: ['#e85d5d', '#f2c24a', '#5d9de8'][i] }, o);
      return o;
    });
    el('path', { d: 'M -46,-298 L 46,-298 L 34,-280 L -34,-280 Z', fill: M.dark, stroke: M.edge, 'stroke-width': 3 }, parts.nose);
    parts.objectives = objs;
    parts.coarse = g(m); el('circle', { cx: 100, cy: -252, r: 27, fill: M.dark, stroke: M.edge, 'stroke-width': 3 }, parts.coarse);
    parts.coarseTick = el('line', { x1: 100, y1: -252, x2: 100, y2: -276, stroke: '#e0e8ee', 'stroke-width': 4 }, parts.coarse);
    parts.fine = g(m); el('circle', { cx: 100, cy: -206, r: 15, fill: M.dark, stroke: M.edge, 'stroke-width': 3 }, parts.fine);
    parts.fineTick = el('line', { x1: 100, y1: -206, x2: 100, y2: -219, stroke: '#e0e8ee', 'stroke-width': 3 }, parts.fine);
    parts.root = m;
    // 旋轉盤轉到第 k 個物鏡（0:4×、1:10×、2:40×）；k 可以是小數，做轉動動畫
    parts.turnTo = (k) => objs.forEach((o, i) => o.setAttribute('transform', `rotate(${((i - k) * 34).toFixed(2)} 0 -292)`));
    parts.turnTo(0);
    return parts;
  };

  const view = (p, cx, cy, r, id, fill = '#efe6c8') => {
    const v = g(p);
    const cp = el('clipPath', { id }, el('defs', {}, v));
    el('circle', { cx, cy, r }, cp);
    el('circle', { cx, cy, r, fill }, v);
    // 裁切框固定不動，內容放在裡面另一層，移動內容時視野圓框不會跟著跑
    const inner = g(g(v, { 'clip-path': `url(#${id})` }));
    el('circle', { cx, cy, r, fill: 'none', stroke: '#2b4252', 'stroke-width': 8 }, v);
    v.inner = inner;
    return v;
  };
  // 洋蔥表皮細胞（磚形、碘液染色）
  const onion = (p, x0, y0, cols, rows, w, h, rnd) => {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * w + (r % 2) * w * 0.45, y = y0 + r * h;
      el('rect', { x, y, width: w - 4, height: h - 4, rx: 4, fill: '#e8cf8a', stroke: '#9a7a3a', 'stroke-width': 2.5 }, p);
      el('ellipse', { cx: x + w * (0.3 + rnd() * 0.4), cy: y + h * 0.5, rx: w * 0.07 + 2, ry: h * 0.12 + 2, fill: '#8a5a20' }, p);
    }
  };

  S.register({
    id: 'microscope', section: '1-5', title: '認識顯微鏡',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(15);
      const PLACE0 = { x: 480, y: 660, s: 1 }, PLACE1 = { x: 300, y: 660, s: 1 };
      const msG = S.place(g(root), PLACE0);
      const ms = S.drawMicroscope(msG);
      const W = (lx, ly) => [lx + PLACE0.x, ly + PLACE0.y];

      // ===== 0 構造 =====
      const L = [['目鏡', 0, -500, 'L', 150], ['鏡筒', -22, -390, 'L', 235], ['旋轉盤', -40, -290, 'L', 320], ['物鏡', -10, -262, 'L', 400], ['載物台', -108, -187, 'L', 480], ['壓片夾', -78, -198, 'L', 555], ['光圈', -30, -171, 'L', 630],
        ['鏡臂', 96, -330, 'R', 210], ['粗調節輪', 120, -260, 'R', 330], ['細調節輪', 112, -206, 'R', 420], ['光源', 0, -112, 'R', 520], ['鏡座', 120, -20, 'R', 620]];
      const calls = L.map(([n, x, y, side, ly]) => S.callout(root, ...W(x, y), side === 'L' ? 230 : 780, ly, n, n.includes('調節') ? C.hi : C.ink, { size: 24 }));

      tl.addLabel('s0');
      tl.fromTo(msG, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 's0');
      calls.forEach((c, i) => S.show(tl, c, `s0+=${0.6 + i * 0.18}`, 0.3));

      // ===== 1 放大倍率 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 880, 150, '總放大倍率 ＝ 目鏡倍率 × 物鏡倍率', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      OBJ.forEach(([mag, len], i) => {
        const x = 700 + i * 130;
        el('rect', { x: x - 20, y: 220, width: 40, height: len * 2.2, rx: 6, fill: '#d6e0e7', stroke: M.edge, 'stroke-width': 3 }, P1);
        el('rect', { x: x - 20, y: 220 + len, width: 40, height: 10, fill: ['#e85d5d', '#f2c24a', '#5d9de8'][i] }, P1);
        text(P1, x, 220 + len * 2.2 + 36, `${mag}×`, { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', class: 'mono' });
      });
      text(P1, 1090, 250, '物鏡越長', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      text(P1, 1090, 284, '倍率越高', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      // 一行算式：目鏡 10× × 物鏡 4× ＝ 40 倍（物鏡用對應的顏色）
      const eq = OBJ.map(([mag], i) => {
        const r = g(P1, { opacity: 0 });
        el('rect', { x: 660, y: 470 + i * 58, width: 440, height: 48, rx: 10, fill: '#122230' }, r);
        const t = text(r, 690, 503 + i * 58, '', { 'font-size': 24, fill: C.hi });
        [['目鏡 10×', C.hi], ['×', C.ink], [`物鏡 ${mag}×`, ['#ff9a9a', '#f2c24a', '#8fbaff'][i]], [`＝ ${10 * mag} 倍`, C.hi]].forEach(([s, fill], k) => {
          el('tspan', { fill, dx: k ? 12 : null }, t).textContent = s;
        });
        return r;
      });

      tl.addLabel('s1');
      S.hide(tl, calls, 's1', 0.3);
      S.move(tl, msG, PLACE0, PLACE1, 1, 's1+=0.2');
      S.show(tl, P1, 's1+=0.8', 0.5);
      eq.forEach((r, i) => S.show(tl, r, `s1+=${1.4 + i * 0.4}`, 0.3));
      S.drive(tl, (u) => ms.turnTo(u * 2), 1.6, 's1+=1.6', 'power1.inOut');

      // ===== 2 倒像 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 640, y: 250, width: 200, height: 90, rx: 6, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 3 }, P2);
      text(P2, 740, 316, 'F', { 'font-size': 64, 'font-weight': 700, 'text-anchor': 'middle', fill: '#2a2a2a' });
      text(P2, 740, 380, '玻片上的字', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      el('path', { d: 'M 860,295 H 920', stroke: C.mute, 'stroke-width': 5 }, P2);
      el('path', { d: 'M 936,295 l -20,-12 v 24 Z', fill: C.mute }, P2);
      const v2 = view(P2, 1040, 300, 110, 'msV2');
      const Fimg = text(v2.inner, 1040, 330, 'F', { 'font-size': 120, 'font-weight': 700, 'text-anchor': 'middle', fill: '#2a2a2a' });
      text(P2, 1040, 450, '從目鏡看到的像', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const rule2 = S.pill(g(P2, { opacity: 0 }), 900, 540, '上下顛倒、左右也顛倒（轉了 180°）', { size: 28, color: C.hi, edge: C.hi });

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      tl.fromTo(Fimg, { rotation: 0, svgOrigin: '1040 296' }, { rotation: 180, svgOrigin: '1040 296', duration: 1.2, ease: 'power2.inOut' }, 's2+=1');
      S.show(tl, rule2.parentNode, 's2+=2.2', 0.4);

      // ===== 3 移動玻片 =====
      const P3 = g(root, { opacity: 0 });
      const v3 = view(P3, 1000, 330, 170, 'msV3');
      onion(v3.inner, 700, 60, 12, 13, 52, 40, rnd);
      const targetO = S.place(g(v3.inner), { x: 920, y: 250 });
      el('circle', { cx: 0, cy: 0, r: 24, fill: 'rgba(98,168,255,0.55)', stroke: '#2a5fbf', 'stroke-width': 4 }, targetO);
      const ch = g(P3); el('path', { d: 'M 1000,315 V 345 M 985,330 H 1015', stroke: '#c0392b', 'stroke-width': 3 }, ch);
      text(P3, 1000, 540, '視野', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const slide3 = S.place(g(P3), { x: 700, y: 330 });
      el('rect', { x: -70, y: -30, width: 140, height: 60, rx: 4, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 3 }, slide3);
      text(P3, 700, 420, '玻片', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const arrow3 = g(P3, { opacity: 0 }); el('path', { d: 'M 700,330 L 660,296', stroke: C.hi, 'stroke-width': 5 }, arrow3); el('path', { d: 'M 650,288 l 22,4 l -10,14 Z', fill: C.hi }, arrow3);
      const rule3 = S.pill(g(P3, { opacity: 0 }), 880, 610, '像在左上方 → 玻片也往左上方移', { size: 26, color: C.hi, edge: C.hi });

      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      tl.fromTo(targetO.firstChild, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.3, duration: 0.3, yoyo: true, repeat: 3 }, 's3+=0.8');
      S.show(tl, arrow3, 's3+=1.6', 0.3);
      S.move(tl, slide3, { x: 700, y: 330 }, { x: 660, y: 296 }, 1.4, 's3+=2');
      tl.fromTo(v3.inner, { x: 0, y: 0 }, { x: 80, y: 80, duration: 1.4, ease: 'power2.inOut' }, 's3+=2');
      S.show(tl, rule3.parentNode, 's3+=3.4', 0.4);

      // ===== 4 低倍換高倍 =====
      const P4 = g(root, { opacity: 0 });
      const vl = view(P4, 300, 330, 190, 'msV4a');
      onion(vl.inner, 90, 120, 9, 11, 50, 40, rnd);
      const vh = view(P4, 900, 330, 190, 'msV4b');
      onion(vh.inner, 640, 150, 3, 3, 200, 160, rnd);
      const dark = el('circle', { cx: 900, cy: 330, r: 190, fill: '#000', opacity: 0 }, vh.inner);
      const box = el('rect', { x: 252, y: 282, width: 96, height: 96, fill: 'none', stroke: C.hi, 'stroke-width': 5, opacity: 0 }, P4);
      text(P4, 300, 560, '低倍（10 × 10 ＝ 100 倍）', { 'font-size': 24, 'text-anchor': 'middle' });
      text(P4, 900, 560, '高倍（10 × 40 ＝ 400 倍）', { 'font-size': 24, 'text-anchor': 'middle' });
      const zoomLines = g(P4, { opacity: 0 });
      el('path', { d: 'M 348,282 L 760,190 M 348,378 L 760,470', stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, zoomLines);
      const cmp = g(P4, { opacity: 0 });
      [['視野範圍', '大 → 小'], ['看到的細胞數', '多 → 少'], ['細胞看起來', '小 → 大'], ['視野亮度', '亮 → 暗']].forEach(([a, b], i) => {
        const x = 150 + i * 260;
        el('rect', { x: x - 115, y: 600, width: 230, height: 70, rx: 12, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, cmp);
        text(cmp, x, 628, a, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' });
        text(cmp, x, 658, b, { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      });

      tl.addLabel('s4');
      S.hide(tl, [P3, msG], 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, box, 's4+=0.8', 0.3);
      S.show(tl, zoomLines, 's4+=1.2', 0.3);
      tl.fromTo(vh, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 's4+=1.4');
      tl.to(dark, { opacity: 0.35, duration: 0.6 }, 's4+=2.1');
      tl.fromTo(cmp.children, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, 's4+=2.4');
      S.show(tl, cmp, 's4+=2.4', 0.01);

      // ===== 5 操作步驟 =====
      const P5 = g(root, { opacity: 0 });
      // 每一步手動分行（在詞語之間斷開），一行最多約 22 字
      const STEPS = [
        ['① 用低倍物鏡，打開光源、調光圈讓視野變亮'],
        ['② 玻片放在載物台中央，用壓片夾固定'],
        ['③ 從側面看，轉粗調節輪，', '讓物鏡接近玻片（不能碰到）'],
        ['④ 從目鏡看，反方向慢慢轉粗調節輪，', '看到影像後，用細調節輪調清楚'],
        ['⑤ 把目標移到視野中央，再換高倍物鏡，', '只用細調節輪'],
      ];
      const stepEls = STEPS.map((words, i) => {
        const r = g(P5, { opacity: 0.35 });
        el('rect', { x: 600, y: 150 + i * 96, width: 570, height: 82, rx: 12, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, r);
        words.forEach((w, k) => text(r, 620, 184 + i * 96 + k * 30 - (words.length > 1 ? 10 : 0), w, { 'font-size': 22 }));
        return r;
      });
      const eye = g(root, { opacity: 0 });
      el('path', { d: 'M -26,0 Q 0,-20 26,0 Q 0,20 -26,0 Z', fill: '#e8f0f2' }, eye);
      el('circle', { cx: 0, cy: 0, r: 8, fill: '#2b4252' }, eye);
      const eyeO = S.place(g(root), { x: 300, y: 110 });
      eyeO.appendChild(eye);
      const glow = el('circle', { cx: 300, cy: 548, r: 30, fill: '#ffe9a8', opacity: 0 }, root);
      const hiPart = (els, pos) => tl.fromTo(els, { opacity: 0.4 }, { opacity: 1, duration: 0.25, repeat: 3, yoyo: true }, pos);
      const on = (i, pos) => { tl.to(stepEls, { opacity: 0.35, duration: 0.2 }, pos); tl.to(stepEls[i], { opacity: 1, duration: 0.3 }, pos); };

      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      ms.turnTo(0);
      S.drive(tl, (u) => ms.turnTo(2 - 2 * u), 0.01, 's5');
      S.show(tl, msG, 's5+=0.3', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      on(0, 's5+=0.6'); tl.to(glow, { opacity: 0.6, duration: 0.4 }, 's5+=0.8'); hiPart(ms.diaphragm, 's5+=0.8');
      on(1, 's5+=2'); hiPart([ms.slide, ms.clips], 's5+=2.2');
      on(2, 's5+=3.4');
      S.move(tl, eyeO, { x: 300, y: 110 }, { x: 470, y: 440 }, 0.01, 's5+=3.4');
      S.show(tl, eye, 's5+=3.5', 0.3);
      tl.fromTo(ms.coarse, { rotation: 0, transformOrigin: '50% 50%' }, { rotation: -120, duration: 1 }, 's5+=3.7');
      tl.to(ms.stageG, { y: -30, duration: 1 }, 's5+=3.7');
      on(3, 's5+=5'); S.move(tl, eyeO, { x: 470, y: 440 }, { x: 300, y: 110 }, 0.6, 's5+=5');
      tl.to(ms.coarse, { rotation: 0, duration: 1 }, 's5+=5.6');
      tl.to(ms.stageG, { y: -16, duration: 1 }, 's5+=5.6');
      tl.fromTo(ms.fine, { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 90, duration: 0.6 }, 's5+=6.7');
      on(4, 's5+=7.5');
      S.drive(tl, (u) => ms.turnTo(u * 2), 1.2, 's5+=7.8', 'power1.inOut');
      hiPart(ms.fine, 's5+=9');

      // ===== 6 玻片標本 =====
      const P6 = g(root, { opacity: 0 });
      el('rect', { x: 60, y: 300, width: 400, height: 110, rx: 6, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 3 }, P6);
      const drop = el('ellipse', { cx: 260, cy: 352, rx: 34, ry: 14, fill: 'rgba(214,170,60,0.7)' }, P6);
      const tissue = el('rect', { x: 230, y: 340, width: 60, height: 24, rx: 4, fill: 'rgba(240,220,160,0.9)' }, P6);
      const coverO = S.place(g(P6), { x: 200, y: 340, r: -45 });
      el('rect', { x: 0, y: -4, width: 130, height: 8, rx: 2, fill: 'rgba(200,235,255,0.6)', stroke: '#e8f6ff', 'stroke-width': 2 }, coverO);
      text(P6, 260, 470, '蓋玻片斜斜地慢慢放下，避免產生氣泡', { 'font-size': 22, fill: C.hi, 'text-anchor': 'middle' });
      text(P6, 260, 270, '製作玻片標本', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle' });
      const vOn = view(P6, 690, 340, 140, 'msV6a');
      onion(vOn.inner, 540, 200, 5, 7, 66, 44, rnd);
      const vCh = view(P6, 1030, 340, 140, 'msV6b', '#e6eef6');
      [[980, 290], [1060, 300], [1010, 380], [1080, 390], [950, 380]].forEach(([x, y]) => {
        el('path', { d: S.smoothPath(S.blobPts(x, y, 46, 34, 16, [[3, 0.1, rnd() * 6], [5, 0.05, rnd() * 6]])), fill: 'rgba(120,150,220,0.25)', stroke: '#5a78c8', 'stroke-width': 2 }, vCh.inner);
        el('circle', { cx: x + 4, cy: y, r: 8, fill: '#2a4fa8' }, vCh.inner);
      });
      text(P6, 690, 520, '洋蔥表皮細胞', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle' });
      text(P6, 690, 556, '滴碘液染色（黃褐色）', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      text(P6, 1030, 520, '口腔皮膜細胞', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle' });
      text(P6, 1030, 556, '滴亞甲藍液染色（藍色）', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      const specimens = [vOn, vCh];

      tl.addLabel('s6');
      S.hide(tl, [P5, msG, eye, glow], 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      tl.fromTo(drop, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4 }, 's6+=0.6');
      tl.fromTo(tissue, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.5 }, 's6+=1');
      S.move(tl, coverO, { x: 200, y: 340, r: -45 }, { x: 196, y: 334, r: 0 }, 1.4, 's6+=1.6', 'power1.in');
      tl.fromTo(specimens, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.3 }, 's6+=3');

      // ===== 7 解剖顯微鏡 =====
      const P7 = g(root, { opacity: 0 });
      const st = g(P7);
      el('rect', { x: 120, y: 560, width: 260, height: 40, rx: 14, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, st);
      el('rect', { x: 300, y: 260, width: 34, height: 300, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, st);
      el('rect', { x: 170, y: 300, width: 150, height: 90, rx: 18, fill: M.body, stroke: M.edge, 'stroke-width': 3 }, st);
      [[200, 0], [258, 0]].forEach(([x]) => el('rect', { x: x - 14, y: 220, width: 30, height: 86, rx: 6, fill: M.dark, stroke: M.edge, 'stroke-width': 3, transform: `rotate(-12 ${x} 300)` }, st));
      el('rect', { x: 210, y: 388, width: 70, height: 40, rx: 8, fill: '#d6e0e7', stroke: M.edge, 'stroke-width': 2 }, st);
      el('circle', { cx: 318, cy: 340, r: 22, fill: M.dark, stroke: M.edge, 'stroke-width': 3 }, st);
      el('ellipse', { cx: 245, cy: 545, rx: 90, ry: 14, fill: '#e0e8ee' }, st);
      const ant = g(st);
      el('ellipse', { cx: 225, cy: 532, rx: 12, ry: 8, fill: '#3a2a20' }, ant); el('ellipse', { cx: 245, cy: 530, rx: 9, ry: 7, fill: '#3a2a20' }, ant); el('ellipse', { cx: 266, cy: 532, rx: 14, ry: 9, fill: '#3a2a20' }, ant);
      text(P7, 250, 650, '解剖顯微鏡（雙眼）', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const rows7 = [['', '複式顯微鏡', '解剖顯微鏡'], ['觀察方式', '多為單眼', '雙眼'], ['看到的像', '上下左右顛倒', '正立、和實物同方向'], ['立體感', '平面', '立體'], ['放大倍率', '高（數十～數百倍）', '低（約 10～40 倍）'], ['適合觀察', '薄而透光的玻片', '較大的物體（昆蟲、花）']];
      const tbl = rows7.map((r, i) => {
        const y = 170 + i * 76, row = g(P7, { opacity: 0 });
        el('rect', { x: 470, y: y - 34, width: 700, height: 66, rx: 10, fill: i === 0 ? 'transparent' : i % 2 ? '#122230' : '#162a3a' }, row);
        text(row, 490, y + 9, r[0], { 'font-size': 22, fill: C.mute });
        text(row, 760, y + 9, r[1], { 'font-size': i ? 22 : 26, 'text-anchor': 'middle', 'font-weight': i ? 400 : 700, fill: i ? C.ink : C.membrane });
        text(row, 1010, y + 9, r[2], { 'font-size': i ? 22 : 26, 'text-anchor': 'middle', 'font-weight': i ? 400 : 700, fill: i ? C.ink : C.chloro });
        return row;
      });

      tl.addLabel('s7');
      S.hide(tl, P6, 's7', 0.4);
      S.show(tl, P7, 's7+=0.3', 0.4);
      tl.to(tbl, { opacity: 1, duration: 0.3, stagger: 0.2 }, 's7+=0.8');

      return {
        tl,
        notes: [
          '＊顯微鏡的樣式各家不同：有的調節輪是讓載物台上下移動，有的是讓鏡筒上下移動；有的用反光鏡代替光源。',
          '＊目鏡剛好相反：目鏡越短，倍率越高。',
          null,
          '＊記法：像偏哪一邊，玻片就往哪一邊移。',
          '＊高倍物鏡較長、離玻片較近，所以換高倍後只能用細調節輪；視野變暗時把光圈開大或調亮光源。',
          null,
          '＊洋蔥表皮細胞沒有葉綠體，染色是為了讓細胞核看得更清楚。',
          null,
        ],
        steps: [
          '<b>複式顯微鏡</b>的構造：光線從光源經過光圈、玻片，再經過<b>物鏡</b>和<b>目鏡</b>放大；用<b>粗調節輪</b>和<b>細調節輪</b>對焦。',
          '<b>總放大倍率 ＝ 目鏡倍率 × 物鏡倍率</b>。轉動旋轉盤可以換物鏡；物鏡越長，倍率越高。',
          '複式顯微鏡看到的像，<b>上下、左右都顛倒</b>，等於轉了 180°。',
          '要把左上方的細胞移到視野中央：<b>像在哪個方向，玻片就往哪個方向移</b>。',
          '從低倍換成高倍：<b>視野範圍變小、看到的細胞數目變少、細胞的像變大、視野變暗</b>。',
          '操作順序：先用低倍、調亮視野 → 固定玻片 → 從側面看讓物鏡接近玻片 → 從目鏡看慢慢調遠、對焦 → 目標移到中央再換高倍。',
          '製作玻片標本：洋蔥表皮用<b>碘液</b>、口腔皮膜細胞用<b>亞甲藍液</b>染色；蓋玻片要<b>斜斜放下</b>，避免氣泡。',
          '<b>解剖顯微鏡</b>用雙眼看，像是<b>正立、立體</b>的，倍率較低，適合觀察昆蟲、花等較大的物體。',
        ],
      };
    },
  });
})();
