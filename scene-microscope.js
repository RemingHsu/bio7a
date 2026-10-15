/* 1-4 認識顯微鏡：構造、倍率、倒像與移動玻片、低倍換高倍、操作步驟、玻片標本。
   複式與解剖顯微鏡的比較（成像方向、移動方向、光線、倍率、比較表）在 scene-microscope2.js。 */
(() => {
  const { el, g, text, C } = S;
  const M = { body: '#a9bccb', edge: '#4c697d', dark: '#6f8797', glass: 'rgba(160,215,255,0.35)' };
  const OBJ = [[4, 34], [10, 50], [40, 70]]; // 倍率、長度
  const OBJ_COLOR = ['#e85d5d', '#f2c24a', '#5d9de8'];

  // 金屬烤漆的明暗（光從左上方來）；漸層 id 全域遞增，同一頁畫好幾台也不會撞名
  let gid = 0;
  const grad = (defs, stops, { v = false, r = false } = {}) => {
    const id = 'msG' + ++gid;
    const gr = r ? el('radialGradient', { id, cx: 0.38, cy: 0.32, r: 0.75 }, defs)
      : el('linearGradient', { id, x1: 0, y1: 0, x2: v ? 0 : 1, y2: v ? 1 : 0 }, defs);
    stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gr));
    return `url(#${id})`;
  };
  const SH = {
    bodyH: [[0, '#7d95a5'], [0.22, '#cad8e1'], [0.55, '#a9bccb'], [1, '#687f90']],
    bodyV: [[0, '#d6e2e9'], [0.45, '#a9bccb'], [1, '#6f8797']],
    darkH: [[0, '#44586a'], [0.28, '#8ba1b0'], [0.6, '#61798a'], [1, '#3a4c5b']],
    darkV: [[0, '#8ba1b0'], [0.5, '#5f7686'], [1, '#3a4c5b']],
    chrome: [[0, '#7f92a0'], [0.3, '#f3f7f9'], [0.58, '#c2ced7'], [1, '#6f8496']],
    knob: [[0, '#a3b6c2'], [0.55, '#62798a'], [1, '#34444f']],
  };
  const fills = (defs) => { const f = {}; for (const k in SH) f[k] = grad(defs, SH[k], { v: k.endsWith('V'), r: k === 'knob' }); return f; };
  // 有刻紋的旋鈕：底盤不轉，刻紋、軸心和指示線放在會轉的群組裡（群組的中心＝旋鈕中心）
  const knob = (m, f, cx, cy, r, n) => {
    el('circle', { cx, cy, r, fill: f.knob, stroke: M.edge, 'stroke-width': 2.5 }, m);
    const k = g(m);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      el('line', { x1: (cx + Math.cos(a) * (r - 5)).toFixed(1), y1: (cy + Math.sin(a) * (r - 5)).toFixed(1), x2: (cx + Math.cos(a) * (r - 1.5)).toFixed(1), y2: (cy + Math.sin(a) * (r - 1.5)).toFixed(1), stroke: '#2f3e4a', 'stroke-width': 1.6, opacity: 0.75 }, k);
    }
    el('circle', { cx, cy, r: r * 0.42, fill: '#7d93a2', stroke: M.edge, 'stroke-width': 1.5 }, k);
    return k;
  };
  // 給 scene-microscope2.js（解剖顯微鏡）用同一種畫風
  S.msShade = { grad, fills, knob, edge: M.edge };

  // 複式顯微鏡側面圖。原點在光軸與底座底部；回傳各部位，方便強調或做動作
  S.drawMicroscope = (p) => {
    const m = g(p), parts = {};
    const f = fills(el('defs', {}, m));
    const E = M.edge, sw = 2.5;
    const shine = (d, w = 2.5, op = 0.7) => el('path', { d, fill: 'none', stroke: '#eef4f7', 'stroke-width': w, 'stroke-linecap': 'round', opacity: op }, m);
    // 鏡座
    parts.base = el('path', { d: 'M -124,-8 C -124,-30 -110,-42 -88,-44 L 126,-46 C 141,-46 150,-37 150,-24 L 150,-8 C 150,-3 146,0 140,0 L -116,0 C -121,0 -124,-3 -124,-8 Z', fill: f.bodyV, stroke: E, 'stroke-width': sw }, m);
    shine('M -106,-37 C -98,-40 -92,-41 -86,-41 L 124,-43');
    // 鏡臂（上端托住鏡筒）＋調節輪的座
    parts.arm = el('path', { d: 'M 84,-44 L 84,-196 C 84,-282 70,-344 42,-390 L 22,-390 L 22,-450 L 40,-450 C 62,-450 78,-440 90,-422 C 114,-382 124,-300 124,-196 L 124,-44 Z', fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    shine('M 91,-60 L 91,-196 C 91,-286 77,-350 50,-398', 2.5, 0.5);
    el('rect', { x: 76, y: -290, width: 56, height: 108, rx: 12, fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    // 光源（燈泡在底座上，往上照）
    parts.light = g(m);
    el('path', { d: 'M -30,-44 L -30,-94 C -30,-101 -25,-104 -18,-104 L 18,-104 C 25,-104 30,-101 30,-94 L 30,-44 Z', fill: f.darkH, stroke: E, 'stroke-width': sw }, parts.light);
    parts.bulb = el('path', { d: 'M -19,-103 C -19,-122 19,-122 19,-103 Z', fill: grad(el('defs', {}, parts.light), [[0, '#fffdf0'], [0.55, '#ffe9a8'], [1, '#e2b84c']], { r: true }), stroke: E, 'stroke-width': 2 }, parts.light);
    // 載物台（含光圈、玻片、壓片夾），整組可以上下移動
    const stageG = g(m); parts.stageG = stageG;
    el('path', { d: 'M 34,-186 L 86,-186 L 86,-170 L 46,-170 Z', fill: f.darkH, stroke: E, 'stroke-width': 2 }, stageG);
    parts.diaphragm = el('path', { d: 'M -38,-180 L 38,-180 L 35,-168 C 34,-165 32,-164 29,-164 L -29,-164 C -32,-164 -34,-165 -35,-168 Z', fill: f.darkV, stroke: E, 'stroke-width': 2 }, stageG);
    el('rect', { x: 36, y: -175, width: 16, height: 5, rx: 2.5, fill: '#5f7686', stroke: E, 'stroke-width': 1.5 }, stageG);
    parts.stage = el('rect', { x: -112, y: -194, width: 198, height: 14, rx: 4, fill: f.bodyV, stroke: E, 'stroke-width': sw }, stageG);
    el('line', { x1: -106, y1: -191, x2: 80, y2: -191, stroke: '#f2f7fa', 'stroke-width': 2, opacity: 0.75, 'stroke-linecap': 'round' }, stageG);
    parts.slide = el('rect', { x: -70, y: -201, width: 140, height: 7, rx: 2, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 1.5 }, stageG);
    parts.clips = g(stageG);
    [[-99, -60], [78, 40]].forEach(([x0, x1]) => {
      const dir = Math.sign(x1 - x0);
      el('rect', { x: x0 - 6, y: -202, width: 12, height: 8, rx: 2, fill: '#5f7686', stroke: E, 'stroke-width': 1.5 }, parts.clips);
      el('path', { d: `M ${x0},-201 C ${x0 + dir * 8},-210 ${x0 + dir * 22},-209 ${x1},-202.5`, fill: 'none', stroke: '#e3eaef', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, parts.clips);
    });
    // 鏡筒、目鏡
    parts.tube = el('rect', { x: -22, y: -468, width: 44, height: 172, rx: 4, fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    el('rect', { x: -25, y: -476, width: 50, height: 12, rx: 3, fill: f.darkH, stroke: E, 'stroke-width': 2 }, m);
    parts.eyepiece = g(m);
    el('rect', { x: -15, y: -516, width: 30, height: 42, rx: 3, fill: f.darkH, stroke: E, 'stroke-width': sw }, parts.eyepiece);
    el('rect', { x: -18, y: -528, width: 36, height: 14, rx: 4, fill: '#3b4d5b', stroke: E, 'stroke-width': 2 }, parts.eyepiece);
    el('path', { d: 'M -11,-527 L 11,-527', stroke: '#9fd0f0', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.85 }, parts.eyepiece);
    // 旋轉盤與物鏡（物鏡越長倍率越高；色環代表倍率）
    parts.nose = g(m);
    const objs = OBJ.map(([mag, len], i) => {
      const o = g(parts.nose);
      const y0 = -290, yb = y0 + len * 0.66, yt = y0 + len;
      el('path', { d: `M -12,${y0} L 12,${y0} L 12,${yb} L 8,${yb + 4} L 8,${yt - 3} Q 8,${yt} 5,${yt} L -5,${yt} Q -8,${yt} -8,${yt - 3} L -8,${yb + 4} L -12,${yb} Z`, fill: f.chrome, stroke: E, 'stroke-width': 2 }, o);
      el('rect', { x: -12, y: y0 + 14 + len * 0.08, width: 24, height: 5, fill: OBJ_COLOR[i] }, o);
      el('line', { x1: -5, y1: yt, x2: 5, y2: yt, stroke: '#1d2c37', 'stroke-width': 3, 'stroke-linecap': 'round' }, o);
      return o;
    });
    const cap = el('path', { d: 'M -48,-302 C -36,-313 36,-313 48,-302 L 38,-282 C 18,-276 -18,-276 -38,-282 Z', fill: f.darkV, stroke: E, 'stroke-width': sw }, parts.nose);
    el('path', { d: 'M -40,-303 C -26,-310 26,-310 40,-303', fill: 'none', stroke: '#c9d8e1', 'stroke-width': 2, opacity: 0.7 }, parts.nose);
    parts.objectives = objs;
    // 粗／細調節輪
    parts.coarse = knob(m, f, 100, -252, 27, 24);
    parts.coarseTick = el('line', { x1: 100, y1: -252, x2: 100, y2: -276, stroke: '#eef4f7', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, parts.coarse);
    parts.fine = knob(m, f, 100, -206, 15, 14);
    parts.fineTick = el('line', { x1: 100, y1: -206, x2: 100, y2: -219, stroke: '#eef4f7', 'stroke-width': 3, 'stroke-linecap': 'round' }, parts.fine);
    parts.root = m;
    // 旋轉盤轉到第 k 個物鏡（0:4×、1:10×、2:40×）；k 可以是小數，做轉動動畫
    // 正在使用（最接近直立）的物鏡畫在最前面
    parts.turnTo = (k) => {
      objs.forEach((o, i) => o.setAttribute('transform', `rotate(${((i - k) * 34).toFixed(2)} 0 -292)`));
      objs.map((o, i) => [Math.abs(i - k), o]).sort((a, b) => b[0] - a[0]).forEach(([, o]) => parts.nose.insertBefore(o, cap));
    };
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
    id: 'microscope', section: '1-4', title: '認識顯微鏡',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(15);
      const PLACE0 = { x: 480, y: 660, s: 1 }, PLACE1 = { x: 300, y: 660, s: 1 };
      const msG = S.place(g(root), PLACE0);
      const ms = S.drawMicroscope(msG);
      const W = (lx, ly) => [lx + PLACE0.x, ly + PLACE0.y];

      // ===== 0 構造 =====
      const L = [['目鏡', 0, -500, 'L', 150], ['鏡筒', -22, -390, 'L', 235], ['旋轉盤', -40, -290, 'L', 320], ['物鏡', -10, -262, 'L', 400], ['載物台', -108, -187, 'L', 480], ['壓片夾', -80, -205, 'L', 555], ['光圈', -30, -171, 'L', 630],
        ['鏡臂', 96, -330, 'R', 210], ['粗調節輪', 120, -260, 'R', 330], ['細調節輪', 112, -206, 'R', 420], ['光源', 0, -112, 'R', 520], ['鏡座', 120, -20, 'R', 620]];
      const calls = L.map(([n, x, y, side, ly]) => S.callout(root, ...W(x, y), side === 'L' ? 230 : 780, ly, n, n.includes('調節') ? C.hi : C.ink, { size: 24 }));

      tl.addLabel('s0');
      tl.fromTo(msG, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 's0');
      calls.forEach((c, i) => S.show(tl, c, `s0+=${0.6 + i * 0.18}`, 0.3));

      // ===== 1 放大倍率 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 880, 150, '總放大倍率 ＝ 目鏡倍率 × 物鏡倍率', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      const f1 = fills(el('defs', {}, P1));
      OBJ.forEach(([mag, len], i) => {
        const x = 700 + i * 130, L = len * 2.2, yb = 220 + L * 0.66, yt = 220 + L;
        el('rect', { x: x - 23, y: 211, width: 46, height: 11, rx: 3, fill: f1.darkH, stroke: M.edge, 'stroke-width': 2 }, P1);
        el('path', { d: `M ${x - 20},220 L ${x + 20},220 L ${x + 20},${yb} L ${x + 14},${yb + 6} L ${x + 14},${yt - 5} Q ${x + 14},${yt} ${x + 9},${yt} L ${x - 9},${yt} Q ${x - 14},${yt} ${x - 14},${yt - 5} L ${x - 14},${yb + 6} L ${x - 20},${yb} Z`, fill: f1.chrome, stroke: M.edge, 'stroke-width': 2.5 }, P1);
        el('rect', { x: x - 20, y: 220 + len, width: 40, height: 10, fill: OBJ_COLOR[i] }, P1);
        el('line', { x1: x - 8, y1: yt, x2: x + 8, y2: yt, stroke: '#1d2c37', 'stroke-width': 4, 'stroke-linecap': 'round' }, P1);
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
      const STAIN = 'rgba(196,140,40,0.6)';
      text(P6, 260, 96, '製作玻片標本', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle' });
      // ① 先滴一滴水、放標本，蓋玻片斜斜放下
      el('rect', { x: 60, y: 126, width: 400, height: 96, rx: 6, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 3 }, P6);
      const drop = el('ellipse', { cx: 260, cy: 172, rx: 34, ry: 14, fill: 'rgba(160,215,255,0.6)' }, P6);
      const tissue = el('rect', { x: 230, y: 160, width: 60, height: 24, rx: 4, fill: 'rgba(240,220,160,0.9)' }, P6);
      const coverO = S.place(g(P6), { x: 200, y: 160, r: -45 });
      el('rect', { x: 0, y: -4, width: 130, height: 8, rx: 2, fill: 'rgba(200,235,255,0.6)', stroke: '#e8f6ff', 'stroke-width': 2 }, coverO);
      text(P6, 260, 262, '① 蓋玻片斜斜放下，避免氣泡', { 'font-size': 22, fill: C.hi, 'text-anchor': 'middle' });
      // ② 染色：一側滴染液，另一側用吸水紙吸（從斜上方看玻片）
      const stainG = g(P6, { opacity: 0 });
      el('rect', { x: 60, y: 400, width: 400, height: 128, rx: 6, fill: M.glass, stroke: '#cfe8ff', 'stroke-width': 3 }, stainG);
      const CV = { x: 180, y: 408, w: 160, h: 112 };
      const spec = g(stainG);
      el('rect', { x: 214, y: 432, width: 92, height: 64, rx: 6, fill: 'rgba(240,225,180,0.55)', stroke: '#c8b27a', 'stroke-width': 1.5 }, spec);
      [237, 260, 283].forEach((x) => el('line', { x1: x, y1: 434, x2: x, y2: 494, stroke: '#c8b27a', 'stroke-width': 1.2 }, spec));
      [453, 475].forEach((y) => el('line', { x1: 216, y1: y, x2: 304, y2: y, stroke: '#c8b27a', 'stroke-width': 1.2 }, spec));
      el('rect', { x: CV.x, y: CV.y, width: CV.w, height: CV.h }, el('clipPath', { id: 'msClip6' }, el('defs', {}, stainG)));
      const stainL = el('rect', { x: CV.x, y: CV.y, width: 0, height: CV.h, fill: STAIN, 'clip-path': 'url(#msClip6)' }, stainG);
      el('rect', { x: CV.x, y: CV.y, width: CV.w, height: CV.h, rx: 3, fill: 'rgba(200,235,255,0.18)', stroke: '#e8f6ff', 'stroke-width': 2 }, stainG);
      const flowA = g(stainG, { opacity: 0 });
      el('line', { x1: 200, y1: 508, x2: 306, y2: 508, stroke: C.hi, 'stroke-width': 4 }, flowA);
      el('path', { d: 'M 320,508 l -16,-9 l 0,18 Z', fill: C.hi }, flowA);
      // 滴管：在蓋玻片左側滴染液
      const dropper = S.place(g(stainG), { x: 172, y: 446 });
      el('path', { d: 'M -5,-16 L -2,0 L 2,0 L 5,-16 Z', fill: 'rgba(200,230,255,0.5)', stroke: '#cfe8ff', 'stroke-width': 1.5 }, dropper);
      el('rect', { x: -6, y: -78, width: 12, height: 64, rx: 3, fill: 'rgba(200,230,255,0.25)', stroke: '#cfe8ff', 'stroke-width': 2 }, dropper);
      el('rect', { x: -4, y: -42, width: 8, height: 27, fill: 'rgba(196,140,40,0.85)' }, dropper);
      el('ellipse', { cx: 0, cy: -92, rx: 10, ry: 16, fill: '#d0574a' }, dropper);
      text(stainG, 150, 376, '染液', { 'font-size': 22, 'text-anchor': 'end', fill: '#e0b45a', 'font-weight': 700 });
      const sDrop = el('ellipse', { cx: 176, cy: 466, rx: 14, ry: 20, fill: 'rgba(196,140,40,0.85)', opacity: 0 }, stainG);
      // 吸水紙：放在蓋玻片右側
      const paper = g(stainG, { opacity: 0 });
      const paperO = S.place(g(paper), { x: 384, y: 466, r: -8 });
      el('rect', { x: -48, y: -26, width: 100, height: 52, rx: 3, fill: '#f4f1e8', stroke: '#d8d2c0', 'stroke-width': 2 }, paperO);
      const wet = el('ellipse', { cx: -40, cy: 0, rx: 0, ry: 0, fill: 'rgba(196,140,40,0.55)' }, paperO);
      text(paper, 400, 388, '吸水紙', { 'font-size': 22, 'text-anchor': 'middle', fill: '#e8e2cf', 'font-weight': 700 });
      text(stainG, 260, 572, '② 染色：一側滴染液，', { 'font-size': 22, fill: C.hi, 'text-anchor': 'middle' });
      text(stainG, 260, 604, '另一側用吸水紙吸，染液流過標本', { 'font-size': 22, fill: C.hi, 'text-anchor': 'middle' });
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
      S.move(tl, coverO, { x: 200, y: 160, r: -45 }, { x: 196, y: 154, r: 0 }, 1.4, 's6+=1.6', 'power1.in');
      S.show(tl, stainG, 's6+=3.1', 0.4);
      tl.fromTo(sDrop, { opacity: 0, attr: { cy: 448, rx: 4, ry: 6 } }, { opacity: 1, attr: { cy: 466, rx: 14, ry: 20 }, duration: 0.5, ease: 'power1.in', immediateRender: false }, 's6+=3.6');
      S.show(tl, paper, 's6+=4.1', 0.4);
      S.drive(tl, (u) => {
        stainL.setAttribute('width', (CV.w * u).toFixed(1));
        sDrop.setAttribute('rx', (14 - 10 * u).toFixed(1)); sDrop.setAttribute('ry', (20 - 14 * u).toFixed(1));
        const w = S.smoothstep(0.7, 1, u);
        wet.setAttribute('rx', (34 * w).toFixed(1)); wet.setAttribute('ry', (20 * w).toFixed(1));
        flowA.setAttribute('opacity', u > 0 ? 1 : 0);
      }, 1.8, 's6+=4.6', 'power1.inOut');
      tl.fromTo(specimens, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.3 }, 's6+=6.4');

      return {
        tl,
        notes: [
          '＊顯微鏡的樣式各家不同：有的調節輪是讓載物台上下移動，有的是讓鏡筒上下移動；有的用反光鏡代替光源。',
          '＊目鏡剛好相反：目鏡越短，倍率越高。',
          null,
          '＊記法：像偏哪一邊，玻片就往哪一邊移。',
          '＊高倍物鏡較長、離玻片較近，所以換高倍後只能用細調節輪；視野變暗時把光圈開大或調亮光源。',
          '最後，目標移到中央再換高倍。',
          '＊洋蔥表皮細胞沒有葉綠體，染色是為了讓細胞核看得更清楚。也可以先滴染液、放標本，再蓋上蓋玻片；吸水紙還能吸掉蓋玻片外多餘的液體。洋蔥表皮用碘液、口腔皮膜細胞用亞甲藍液。',
        ],
        steps: [
          '<b>複式顯微鏡</b>的構造：光線從光源經過光圈、玻片，再經過<b>物鏡</b>和<b>目鏡</b>放大；用<b>粗調節輪</b>和<b>細調節輪</b>對焦。',
          '<b>總放大倍率 ＝ 目鏡倍率 × 物鏡倍率</b>。轉動旋轉盤可以換物鏡；物鏡越長，倍率越高。',
          '複式顯微鏡看到的像，<b>上下、左右都顛倒</b>，等於轉了 180°。',
          '要把左上方的細胞移到視野中央：<b>像在哪個方向，玻片就往哪個方向移</b>。',
          '從低倍換成高倍：<b>視野範圍變小、看到的細胞數目變少、細胞的像變大、視野變暗</b>。',
          '操作順序：先用低倍、調亮視野 → 固定玻片 → 從側面看讓物鏡接近玻片 → 從目鏡看慢慢調遠、對焦。',
          '製作玻片標本：蓋玻片要<b>斜斜放下</b>，避免氣泡。染色時從蓋玻片<b>一側滴染液</b>、<b>另一側用吸水紙吸</b>，讓染液流過標本。',
        ],
      };
    },
  });
})();
