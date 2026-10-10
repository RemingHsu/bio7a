/* 1-4 複式與解剖顯微鏡：兩種顯微鏡的構造、成像方向、移動方向、光線與標本、倍率與立體感、比較表。
   複式顯微鏡的圖用 scene-microscope.js 的 S.drawMicroscope；解剖顯微鏡用同一種畫風（S.msShade）。
   左邊卡片一律是複式顯微鏡（青色），右邊一律是解剖顯微鏡（綠色）。 */
(() => {
  const { el, g, text, C } = S;
  const TEAL = C.membrane, GREEN = C.chloro;
  const CARD = '#102131', LINE = '#2b4252';
  let nid = 0;
  const uid = (k) => `mic2-${k}-${++nid}`;
  const R = Math.PI / 180;

  // ---------- 小工具 ----------
  // 圓形視野：底色、裁切後的內容層、外框
  const view = (p, cx, cy, r, fill) => {
    const v = g(p), id = uid('clip');
    el('circle', { cx, cy, r }, el('clipPath', { id }, el('defs', {}, v)));
    el('circle', { cx, cy, r, fill }, v);
    v.inner = g(v, { 'clip-path': `url(#${id})` });
    el('circle', { cx, cy, r, fill: 'none', stroke: LINE, 'stroke-width': 8 }, v);
    return v;
  };
  // 箭頭（線＋三角形箭頭）
  const arrow = (p, x1, y1, x2, y2, color, w = 5, head = 16) => {
    const a = g(p), t = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - Math.cos(t) * head, by = y2 - Math.sin(t) * head;
    const px = -Math.sin(t) * head * 0.6, py = Math.cos(t) * head * 0.6;
    el('line', { x1, y1, x2: bx, y2: by, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, a);
    el('path', { d: `M ${x2},${y2} L ${(bx + px).toFixed(1)},${(by + py).toFixed(1)} L ${(bx - px).toFixed(1)},${(by - py).toFixed(1)} Z`, fill: color }, a);
    return a;
  };
  // 光線上的小箭頭（朝 deg 方向；0 = 往上）
  const ray = (p, x, y, deg, color = '#fff7d6', s = 9) =>
    el('path', { d: `M 0,${-s * 1.2} L ${s * 0.6},${s * 0.6} L ${-s * 0.6},${s * 0.6} Z`, fill: color, transform: `translate(${x},${y}) rotate(${deg})` }, p);
  // 一行文字，可以混不同顏色／粗細：parts = [[字, 屬性], …]
  const rich = (p, x, y, parts, attrs = {}) => {
    const t = text(p, x, y, '', { 'font-size': 24, 'text-anchor': 'middle', ...attrs });
    parts.forEach(([s, a = {}]) => { const sp = el('tspan', a, t); sp.textContent = s; });
    return t;
  };
  const B = (s, fill = C.hi) => [s, { fill, 'font-weight': 700 }];
  // 眼睛（正面），s 是大小
  const eyeIcon = (p, x, y, s = 1) => {
    const e = S.place(g(p), { x, y, s });
    el('path', { d: 'M -28,0 C -16,-18 16,-18 28,0 C 16,18 -16,18 -28,0 Z', fill: '#f4f7f8', stroke: '#9fb3c0', 'stroke-width': 2 }, e);
    el('circle', { cx: 0, cy: 0, r: 10, fill: '#4f86b0' }, e);
    el('circle', { cx: 0, cy: 0, r: 4.5, fill: '#0f1c26' }, e);
    el('circle', { cx: -3.5, cy: -3.5, r: 2.2, fill: '#fff' }, e);
    el('path', { d: 'M -30,1 C -17,-21 17,-21 30,1', fill: 'none', stroke: '#e8f0f2', 'stroke-width': 3, 'stroke-linecap': 'round' }, e);
    return e;
  };
  // 寫著 F 的小紙片（中心在原點）
  const paperF = (p) => {
    const o = g(p);
    el('rect', { x: -23, y: -22, width: 52, height: 52, rx: 2, fill: 'rgba(0,0,0,0.28)' }, o);
    el('rect', { x: -26, y: -26, width: 52, height: 52, rx: 2, fill: '#fbf8ee', stroke: '#cfc7ae', 'stroke-width': 1.5 }, o);
    bigF(o, 40);
    return o;
  };
  const bigF = (p, size, fill = '#1f2a33') => text(p, 0, size * 0.36, 'F', { 'font-size': size, 'font-weight': 700, 'text-anchor': 'middle', fill, 'font-family': 'Arial, Helvetica, sans-serif' });

  // ---------- 解剖顯微鏡（側面，稍微斜一點看得到兩個目鏡）。原點在光軸與底座底部 ----------
  const drawStereo = (p) => {
    const { grad, fills, knob, edge: E } = S.msShade;
    const m = g(p), defs = el('defs', {}, m), f = fills(defs), sw = 2.5, parts = { root: m };
    const shine = (d, w = 2.5, op = 0.7) => el('path', { d, fill: 'none', stroke: '#eef4f7', 'stroke-width': w, 'stroke-linecap': 'round', opacity: op }, m);
    // 底座
    el('path', { d: 'M -122,-8 C -122,-34 -112,-46 -92,-46 L 96,-46 C 108,-46 114,-38 114,-26 L 114,-8 C 114,-3 110,0 104,0 L -114,0 C -119,0 -122,-3 -122,-8 Z', fill: f.bodyV, stroke: E, 'stroke-width': sw }, m);
    shine('M -104,-38 C -98,-41 -94,-42 -90,-42 L 100,-42');
    // 支柱
    el('rect', { x: 74, y: -392, width: 24, height: 348, fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    el('rect', { x: 71, y: -400, width: 30, height: 10, rx: 3, fill: f.darkH, stroke: E, 'stroke-width': 2 }, m);
    // 亮度調整鈕
    el('circle', { cx: -96, cy: -22, r: 9, fill: f.knob, stroke: E, 'stroke-width': 2 }, m);
    el('line', { x1: -96, y1: -22, x2: -96, y2: -29, stroke: '#eef4f7', 'stroke-width': 2, 'stroke-linecap': 'round' }, m);
    // 載物台：圓形的板子（側面看是扁橢圓）
    el('ellipse', { cx: -10, cy: -46, rx: 80, ry: 9, fill: '#4d6070', stroke: E, 'stroke-width': 2 }, m);
    el('ellipse', { cx: -10, cy: -50, rx: 78, ry: 8, fill: grad(defs, [[0, '#ffffff'], [0.6, '#e4eaee'], [1, '#b9c6cf']], { r: true }), stroke: '#8aa0ae', 'stroke-width': 1.5 }, m);
    // 上方光源：夾在支柱上，斜斜照向載物台
    el('rect', { x: 68, y: -202, width: 36, height: 18, rx: 4, fill: f.darkH, stroke: E, 'stroke-width': 2 }, m);
    el('rect', { x: 42, y: -198, width: 30, height: 9, rx: 3, fill: f.darkV, stroke: E, 'stroke-width': 2 }, m);
    const lamp = S.place(g(m), { x: 46, y: -190, r: 22 });
    el('path', { d: 'M -11,-6 L 11,-6 L 13,22 C 13,26 10,28 6,28 L -6,28 C -10,28 -13,26 -13,22 Z', fill: f.darkH, stroke: E, 'stroke-width': 2 }, lamp);
    el('ellipse', { cx: 0, cy: 28, rx: 10, ry: 3.2, fill: '#fff1b8', stroke: '#e2b84c', 'stroke-width': 1.5 }, lamp);
    parts.lens = [35.5, -164]; // 燈罩出光口（局部座標）
    // 對焦座＋調節輪
    el('rect', { x: 52, y: -318, width: 64, height: 88, rx: 12, fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    el('rect', { x: 38, y: -306, width: 18, height: 54, rx: 3, fill: f.darkH, stroke: E, 'stroke-width': 2 }, m);
    parts.knob = knob(m, f, 90, -274, 30, 28);
    // 鏡身
    el('path', { d: 'M -42,-262 C -44,-292 -38,-316 -16,-322 L 30,-322 C 44,-320 48,-308 48,-294 L 48,-262 C 48,-254 42,-250 34,-250 L -30,-250 C -38,-250 -42,-254 -42,-262 Z', fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    shine('M -34,-262 C -36,-288 -31,-306 -15,-313', 2.5, 0.55);
    // 換倍率的轉環（有刻紋）
    el('rect', { x: -43, y: -296, width: 92, height: 14, rx: 3, fill: f.darkH, stroke: E, 'stroke-width': 2 }, m);
    for (let i = 0; i < 15; i++) el('line', { x1: -37 + i * 5.8, y1: -294, x2: -37 + i * 5.8, y2: -284, stroke: '#2f3e4a', 'stroke-width': 1.4, opacity: 0.6 }, m);
    // 物鏡（朝下）
    el('path', { d: 'M -34,-252 L 34,-252 L 30,-222 C 29,-216 25,-212 19,-212 L -19,-212 C -25,-212 -29,-216 -30,-222 Z', fill: f.darkH, stroke: E, 'stroke-width': sw }, m);
    el('rect', { x: -33, y: -246, width: 66, height: 6, fill: f.chrome }, m);
    el('ellipse', { cx: 0, cy: -212, rx: 19, ry: 3.5, fill: '#22384a', stroke: '#9fd0f0', 'stroke-width': 1.2 }, m);
    // 雙眼目鏡（朝使用者斜斜伸出；後面那支畫暗一點）
    const tube = (x, y, back) => {
      const t = S.place(g(m), { x, y, r: -38 });
      el('rect', { x: -12, y: -86, width: 24, height: 90, rx: 3, fill: back ? f.darkH : f.bodyH, stroke: E, 'stroke-width': 2 }, t);
      el('rect', { x: -14, y: -100, width: 28, height: 18, rx: 3, fill: back ? '#3a4c5a' : f.darkH, stroke: E, 'stroke-width': 2 }, t);
      el('rect', { x: -16, y: -112, width: 32, height: 14, rx: 5, fill: back ? '#2c3a45' : '#3b4d5b', stroke: E, 'stroke-width': 2 }, t);
      return t;
    };
    tube(6, -332, true);
    el('path', { d: 'M -36,-320 C -38,-340 -24,-352 -4,-352 C 14,-352 26,-342 26,-322 Z', fill: f.bodyH, stroke: E, 'stroke-width': sw }, m);
    tube(-10, -334, false);
    parts.eyeTop = [-79, -422];
    return parts;
  };

  // ---------- 螞蟻 ----------
  // 從上面看（頭朝上）：頭、胸、腰（結節）、腹 一條外框；觸角有「肘」；3 對腳都長在胸部。約 200 × 330，原點在胸、腹之間
  const ANT_P0 = [0, -130];
  const ANT_SEGS = [
    [[14, -132], [30, -128], [36, -112]], [[40, -100], [38, -82], [28, -74]], [[20, -70], [13, -70], [12, -67]],
    [[22, -64], [25, -52], [20, -43]], [[16, -35], [14, -30], [14, -24]], [[14, -14], [10, -6], [6, -3]],
    [[4, 0], [4, 2], [6, 4]], [[13, 6], [13, 16], [6, 19]], [[4, 21], [6, 23], [9, 25]],
    [[40, 28], [50, 70], [44, 106]], [[38, 134], [16, 146], [0, 146]],
  ];
  const symPath = (P0, segs) => {
    const pt = (q, sx = 1) => `${sx * q[0]},${q[1]}`;
    let d = `M ${pt(P0)}`;
    segs.forEach(([a, b, c]) => { d += ` C ${pt(a)} ${pt(b)} ${pt(c)}`; });
    for (let i = segs.length - 1; i >= 0; i--) {
      const [a, b] = segs[i], prev = i ? segs[i - 1][2] : P0;
      d += ` C ${pt(b, -1)} ${pt(a, -1)} ${pt(prev, -1)}`;
    }
    return d + ' Z';
  };
  const ANT_BODY = symPath(ANT_P0, ANT_SEGS);
  const ANT_LEGS = [
    [[18, -57], [46, -80], [60, -112], [68, -140]],
    [[17, -38], [54, -44], [82, -16], [98, 8]],
    [[13, -18], [50, -6], [78, 42], [92, 82]],
  ];
  const limb = (p, P, widths, color, extra = {}) => {
    for (let i = 0; i < P.length - 1; i++) el('line', { x1: P[i][0], y1: P[i][1], x2: P[i + 1][0], y2: P[i + 1][1], stroke: color, 'stroke-width': widths[i], 'stroke-linecap': 'round', ...extra }, p);
  };
  const antTop = (p, x, y, s, { shadow = false } = {}) => {
    const G = S.place(g(p), { x, y, s });
    const defs = el('defs', {}, G);
    const ink = shadow ? '#000' : '#24160c';
    const mir = (P) => P.map(([a, b]) => [-a, b]);
    // 腳（3 對）：腿節粗、脛節較細、跗節最細，末端有小爪
    ANT_LEGS.forEach((P) => [P, mir(P)].forEach((Q) => {
      limb(G, Q, [7, 5, 3.2], ink);
      const [a, b] = Q[3], [c, d] = Q[2], t = Math.atan2(b - d, a - c);
      [-0.5, 0.5].forEach((k) => el('line', { x1: a, y1: b, x2: (a + Math.cos(t + k) * 7).toFixed(1), y2: (b + Math.sin(t + k) * 7).toFixed(1), stroke: ink, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, G));
      if (!shadow) el('line', { x1: Q[0][0] + (Q[1][0] - Q[0][0]) * 0.25, y1: Q[0][1] + (Q[1][1] - Q[0][1]) * 0.25 - 1.5, x2: Q[0][0] + (Q[1][0] - Q[0][0]) * 0.8, y2: Q[0][1] + (Q[1][1] - Q[0][1]) * 0.8 - 1.5, stroke: '#9a7656', 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0.7 }, G);
    }));
    // 觸角：柄節往外，鞭節往前彎，末端稍粗
    [1, -1].forEach((sx) => {
      el('path', { d: `M ${sx * 12},-124 L ${sx * 46},-142`, stroke: ink, 'stroke-width': 4.5, 'stroke-linecap': 'round', fill: 'none' }, G);
      el('path', { d: `M ${sx * 46},-142 C ${sx * 56},-152 ${sx * 58},-166 ${sx * 56},-178`, stroke: ink, 'stroke-width': 3.2, 'stroke-linecap': 'round', fill: 'none' }, G);
      el('ellipse', { cx: sx * 56, cy: -180, rx: 3.2, ry: 6, fill: ink, transform: `rotate(${sx * -6} ${sx * 56} -180)` }, G);
    });
    // 大顎
    [1, -1].forEach((sx) => el('path', { d: `M ${sx * 2},-128 L ${sx * 20},-127 C ${sx * 22},-138 ${sx * 16},-149 ${sx * 5},-155 L ${sx * 6},-150 L ${sx * 2.5},-148 L ${sx * 5},-144 L ${sx * 1.5},-142 L ${sx * 4},-138 L ${sx * 1.5},-134 Z`, fill: shadow ? ink : '#3a2414', stroke: shadow ? 'none' : '#140c06', 'stroke-width': 1, 'stroke-linejoin': 'round' }, G));
    // 身體（一條外框）
    const body = el('path', { d: ANT_BODY, fill: ink, stroke: shadow ? 'none' : '#120a05', 'stroke-width': 1.5 }, G);
    if (shadow) return G;
    const gr = el('radialGradient', { id: uid('ant'), cx: 0.42, cy: 0.42, r: 0.65 }, defs);
    [[0, '#7a5236'], [0.45, '#3e2717'], [1, '#170d07']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gr));
    body.setAttribute('fill', `url(#${gr.id})`);
    // 腹部的分節線、頭和胸的弧面（裁在身體外框裡）
    const cid = uid('antc');
    el('path', { d: ANT_BODY }, el('clipPath', { id: cid }, defs));
    const ov = g(G, { 'clip-path': `url(#${cid})` });
    [[50, 38], [78, 46], [104, 42], [126, 30]].forEach(([yy, w]) => el('path', { d: `M ${-w},${yy - 4} C ${-w / 2},${yy + 5} ${w / 2},${yy + 5} ${w},${yy - 4}`, fill: 'none', stroke: '#9a7656', 'stroke-width': 2, opacity: 0.55 }, ov));
    el('path', { d: 'M -14,-62 C -6,-58 6,-58 14,-62', fill: 'none', stroke: '#9a7656', 'stroke-width': 1.5, opacity: 0.5 }, ov);
    // 反光（2～3 層明暗的最亮那層）
    [[-12, -108, 10, 6, -25, 0.3], [-7, -52, 5, 9, -10, 0.25], [-3, 12, 3, 4, 0, 0.3], [-16, 62, 11, 26, 15, 0.2], [-20, 54, 4, 8, 15, 0.4]].forEach(([cx, cy, rx, ry, rot, op]) =>
      el('ellipse', { cx, cy, rx, ry, fill: '#fff', opacity: op, transform: `rotate(${rot} ${cx} ${cy})` }, ov));
    // 腹部尾端的細毛
    [[-30, 128, -6, 7], [-16, 138, -3, 8], [0, 142, 0, 8], [16, 138, 3, 8], [30, 128, 6, 7], [-42, 96, -8, 3], [42, 96, 8, 3]].forEach(([hx, hy, dx, dy]) =>
      el('line', { x1: hx, y1: hy, x2: hx + dx, y2: hy + dy, stroke: '#6a4a32', 'stroke-width': 1.3, 'stroke-linecap': 'round' }, G));
    // 複眼（有反光）
    [1, -1].forEach((sx) => {
      el('ellipse', { cx: sx * 31, cy: -98, rx: 5.5, ry: 8.5, fill: '#0d0907', stroke: '#5a3a28', 'stroke-width': 1, transform: `rotate(${sx * 12} ${sx * 31} -98)` }, G);
      el('circle', { cx: sx * 31 - 2, cy: -101, r: 2, fill: '#fff', opacity: 0.9 }, G);
    });
    return G;
  };
  // 有影子的螞蟻（從上面打光，影子落在右下方）
  const antWithShadow = (p, x, y, s) => {
    const fid = uid('blur');
    el('feGaussianBlur', { stdDeviation: 6 }, el('filter', { id: fid, x: '-30%', y: '-30%', width: '160%', height: '160%' }, el('defs', {}, p)));
    const sh = g(p, { opacity: 0.3, filter: `url(#${fid})` });
    antTop(sh, x + 10 * s, y + 14 * s, s, { shadow: true });
    return antTop(p, x, y, s);
  };
  // 從側面看（頭朝左），站在 y = 0；約 125 × 55
  const antSide = (p, x, y, s) => {
    const G = S.place(g(p), { x, y, s });
    const ink = '#2a190e';
    // 遠側的腳（較暗）
    [[[-18, -20], [-24, -8], [-29, 0]], [[-8, -19], [-2, -8], [2, 0]], [[0, -20], [18, -12], [32, 0]]].forEach((P) => limb(G, P, [3, 2], '#4a3424'));
    const gr = el('linearGradient', { id: uid('ants'), x1: 0, y1: 0, x2: 0, y2: 1 }, el('defs', {}, G));
    [[0, '#6e4a30'], [0.5, '#3a2416'], [1, '#170d07']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gr));
    el('path', { d: 'M -57,-21 C -57,-30 -50,-40 -40,-40 C -32,-40 -28,-35 -27,-32 C -24,-36 -18,-38 -12,-36 C -6,-34 -2,-31 1,-26 C 3,-24 4,-24 5,-25 C 6,-31 10,-33 12,-27 C 13,-25 14,-25 16,-27 C 22,-37 46,-40 56,-30 C 61,-24 56,-13 44,-12 C 32,-11 22,-14 17,-19 C 15,-21 13,-21 11,-20 L 4,-20 C 0,-18 -8,-17 -16,-19 C -22,-20 -26,-22 -29,-24 C -32,-19 -38,-17 -44,-18 C -50,-18 -53,-17 -57,-21 Z', fill: `url(#${gr.id})`, stroke: '#120a05', 'stroke-width': 1.2 }, G);
    // 近側的腳、觸角
    [[[-20, -20], [-30, -10], [-38, -1], [-44, 0]], [[-10, -19], [-8, -8], [-14, 0], [-19, 0]], [[-2, -20], [10, -10], [20, -1], [26, 0]]].forEach((P) => limb(G, P, [3.6, 2.6, 1.8], ink));
    el('path', { d: 'M -46,-38 L -50,-54 C -56,-52 -62,-48 -68,-42', fill: 'none', stroke: ink, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
    el('path', { d: 'M -40,-37 C -34,-38 -30,-36 -29,-33 M -18,-35 C -12,-35 -6,-33 -3,-30 M 26,-35 C 36,-38 46,-36 52,-30', fill: 'none', stroke: '#b08a66', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.7 }, G);
    el('ellipse', { cx: -44, cy: -30, rx: 3.6, ry: 3, fill: '#0d0907' }, G);
    el('circle', { cx: -45, cy: -31, r: 1.1, fill: '#fff' }, G);
    return G;
  };

  // ---------- 洋蔥表皮細胞（碘液染色，平面） ----------
  // 一排排細長的細胞，長短不一、兩端斜斜的，相鄰的排錯開；底色就是細胞壁的顏色
  const onionCells = (p, x0, y0, width, rows, h, w, rnd) => {
    const gid = uid('cell');
    const gr = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, el('defs', {}, p));
    [[0, '#f6e9bc'], [0.5, '#efdc9e'], [1, '#e0c47e']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gr));
    const inset = 4.5;
    for (let r = 0; r < rows; r++) {
      const y = y0 + r * h;
      const B = []; // 細胞之間的分界：[x, 斜度]
      for (let x = x0 - rnd() * w; x < x0 + width + w; x += w * (0.75 + rnd() * 0.5)) B.push([x, (rnd() - 0.5) * h * 0.6]);
      for (let i = 0; i < B.length - 1; i++) {
        const [xa, a] = B[i], [xb, b] = B[i + 1];
        const yt = y + inset, yb = y + h - inset, k = (inset / h) * 2;
        const pts = [[xa + a * (1 - k) + inset, yt], [xb + b * (1 - k) - inset, yt], [xb - b * (1 - k) - inset, yb], [xa - a * (1 - k) + inset, yb]];
        el('path', { d: 'M ' + pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L ') + ' Z', fill: `url(#${gid})`, stroke: '#ead597', 'stroke-width': 3, 'stroke-linejoin': 'round' }, p);
        const nx = (xa + xb) / 2 + (rnd() - 0.5) * (xb - xa) * 0.4, ny = y + h / 2 + (rnd() - 0.5) * h * 0.12;
        el('ellipse', { cx: nx.toFixed(1), cy: ny.toFixed(1), rx: (h * 0.24).toFixed(1), ry: (h * 0.18).toFixed(1), fill: '#94622a', stroke: '#6a4214', 'stroke-width': 1 }, p);
        el('circle', { cx: (nx + h * 0.05).toFixed(1), cy: (ny + h * 0.02).toFixed(1), r: (h * 0.06).toFixed(1), fill: '#4e300c' }, p);
        el('ellipse', { cx: (nx - h * 0.08).toFixed(1), cy: (ny - h * 0.07).toFixed(1), rx: (h * 0.07).toFixed(1), ry: (h * 0.04).toFixed(1), fill: '#e8c48a', opacity: 0.6 }, p);
      }
    }
  };

  // ---------- 花（從上面看）：5 片花瓣、一圈雄蕊、中間的雌蕊 ----------
  const flower = (p, x, y, s) => {
    const G = S.place(g(p), { x, y, s });
    const gr = el('linearGradient', { id: uid('pet'), x1: 0, y1: 1, x2: 0, y2: 0 }, el('defs', {}, G));
    [[0, '#fff1c8'], [0.3, '#ffc2d4'], [1, '#e8527f']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gr));
    for (let k = 0; k < 5; k++) {
      const pg = g(G, { transform: `rotate(${k * 72})` });
      el('path', { d: 'M 0,-6 C -20,-12 -36,-36 -26,-54 C -18,-66 -6,-62 0,-54 C 6,-62 18,-66 26,-54 C 36,-36 20,-12 0,-6 Z', fill: `url(#${gr.id})`, stroke: '#c8406a', 'stroke-width': 1.5 }, pg);
      el('path', { d: 'M 0,-10 L 0,-48 M 0,-18 C -6,-30 -12,-40 -15,-50 M 0,-18 C 6,-30 12,-40 15,-50', fill: 'none', stroke: '#c8406a', 'stroke-width': 1, opacity: 0.45 }, pg);
    }
    for (let k = 0; k < 10; k++) {
      const a = (k * 36 + 18) * R, ax = Math.cos(a) * 19, ay = Math.sin(a) * 19;
      el('line', { x1: 0, y1: 0, x2: ax.toFixed(1), y2: ay.toFixed(1), stroke: '#f6e6a8', 'stroke-width': 1.6 }, G);
      el('ellipse', { cx: ax.toFixed(1), cy: ay.toFixed(1), rx: 4, ry: 2.6, fill: '#ffd23a', stroke: '#b8860b', 'stroke-width': 1, transform: `rotate(${k * 36 + 18} ${ax.toFixed(1)} ${ay.toFixed(1)})` }, G);
    }
    el('circle', { cx: 0, cy: 0, r: 7, fill: '#9ccf5a', stroke: '#5f8f2a', 'stroke-width': 1.2 }, G);
    [0, 120, 240].forEach((d) => el('circle', { cx: (Math.cos((d - 90) * R) * 3).toFixed(1), cy: (Math.sin((d - 90) * R) * 3).toFixed(1), r: 2.2, fill: '#eef7b0' }, G));
    return G;
  };

  S.register({
    id: 'microscope2', section: '1-4', title: '複式與解剖顯微鏡',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(23);
      const CX = [305, 895];

      // ===== 左右兩張卡片（第 1～5 步共用）=====
      const cards = g(root);
      [20, 610].forEach((x) => el('rect', { x, y: 14, width: 570, height: 692, rx: 18, fill: CARD, stroke: LINE, 'stroke-width': 2 }, cards));
      text(cards, CX[0], 58, '複式顯微鏡', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: TEAL });
      rich(cards, CX[1], 58, [['解剖顯微鏡', { 'font-size': 30, 'font-weight': 700, fill: GREEN }], ['（也叫立體顯微鏡）', { 'font-size': 24, fill: C.mute }]]);

      // ===== 0 兩種顯微鏡 =====
      const msA = S.place(g(root), { x: 315, y: 664, s: 0.9 });
      S.drawMicroscope(msA);
      const stA = S.place(g(root), { x: 900, y: 664, s: 1.1 });
      drawStereo(stA);
      const W0 = (x, y) => [315 + 0.9 * x, 664 + 0.9 * y], W1 = (x, y) => [900 + 1.1 * x, 664 + 1.1 * y];
      const calls0 = [
        [W0(-46, -298), 125, 360, '旋轉盤'], [W0(-6, -270), 125, 430, '物鏡'], [W0(-106, -187), 125, 500, '載物台'], [W0(-14, -110), 125, 572, '光源在下方', C.hi],
        [W0(14, -505), 515, 210, '目鏡'], [W0(124, -262), 515, 400, '粗調節輪'], [W0(114, -206), 515, 478, '細調節輪'],
        [W1(-40.8, -373.4), 695, 236, '雙眼目鏡', C.hi], [W1(-30, -232), 695, 410, '物鏡'], [W1(-70, -50), 695, 590, '載物台'],
        [W1(112, -282), 1115, 300, '調節輪'], [W1(41.5, -178.9), 1105, 470, '上方光源', C.hi],
      ].map(([[tx, ty], x, y, s, col = C.ink]) => S.callout(root, tx, ty, x, y, s, col, { size: 24 }));

      tl.addLabel('s0');
      S.show(tl, cards, 's0', 0.4);
      S.show(tl, msA, 's0+=0.3', 0.6);
      S.show(tl, stA, 's0+=0.5', 0.6);
      calls0.forEach((c, i) => S.show(tl, c, `s0+=${1 + i * 0.2}`, 0.3));

      // ===== 1 成像方向 =====
      const Y = 340, DX = 28, IMG = 72; // 紙片中心高度、物體移動距離、像移動距離
      const P1 = g(root, { opacity: 0 });
      const sub1 = CX.map((cx) => text(P1, cx, 140, '放同一張寫著 F 的小紙片', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' }));
      const sub2 = CX.map((cx, k) => text(P1, cx, 140, k ? '把紙片往左移' : '把玻片往左移', { 'font-size': 24, fill: C.ink, 'text-anchor': 'middle', 'font-weight': 700, opacity: 0 }));
      // 解剖顯微鏡的圓形載物台（固定不動）
      const pl = g(P1);
      const plG = el('radialGradient', { id: uid('pl'), cx: 0.4, cy: 0.35, r: 0.75 }, el('defs', {}, pl));
      [[0, '#ffffff'], [0.7, '#e2e8ec'], [1, '#b9c6cf']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, plG));
      el('circle', { cx: CX[1] - 165, cy: Y, r: 62, fill: `url(#${plG.id})`, stroke: '#8aa0ae', 'stroke-width': 2.5 }, pl);
      const objs = CX.map((cx, k) => {
        const o = S.place(g(P1), { x: cx - 165, y: Y });
        if (!k) {
          el('rect', { x: -65, y: -30, width: 130, height: 60, rx: 4, fill: 'rgba(170,215,245,0.32)', stroke: '#cfe8ff', 'stroke-width': 2.5 }, o);
          el('rect', { x: 40, y: -28.5, width: 23.5, height: 57, rx: 2, fill: 'rgba(255,255,255,0.22)' }, o);
        }
        paperF(o);
        return o;
      });
      // 物鏡正下方的位置（第 2 步才出現，畫在紙片上面）
      const marks = CX.map((cx) => {
        const mk = g(P1, { opacity: 0 });
        el('circle', { cx: cx - 165, cy: Y, r: 37, fill: 'none', stroke: C.hi, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, mk);
        return mk;
      });
      CX.forEach((cx, k) => {
        text(P1, cx - 165, Y + 100, k ? '紙片（從上面看）' : '玻片（從上面看）', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
        arrow(P1, cx - 92, Y, cx - 24, Y, C.mute, 5, 18);
        text(P1, cx + 120, Y + 172, '從目鏡看到的像', { 'font-size': 24, fill: C.ink, 'text-anchor': 'middle' });
      });
      const fields = CX.map((cx, k) => view(P1, cx + 120, Y, 135, k ? '#f4f6f4' : '#f7f2e3'));
      const IMG0 = CX.map((cx, k) => ({ x: cx + 120, y: Y, r: k ? 0 : 180 }));
      const imgs = [], imgPos = []; // imgs：淡入用的外層；imgPos：決定位置的內層
      fields.forEach((v, k) => { const w = g(v.inner, { opacity: 0 }), o = S.place(g(w), IMG0[k]); bigF(o, 100); imgs.push(w); imgPos.push(o); });
      // 從紙片「飛」到視野的 F（複式顯微鏡的在途中轉 180°）
      const fly = CX.map(() => { const o = g(P1, { opacity: 0 }); bigF(S.place(g(o), { x: 0, y: 0 }), 100, '#e8f0f2'); return o; }); // 深色卡片上用淺色
      const res1 = [S.pill(g(P1, { opacity: 0 }), CX[0], 600, '上下、左右都顛倒（轉了 180°）', { size: 26, color: TEAL, edge: TEAL }),
        S.pill(g(P1, { opacity: 0 }), CX[1], 600, '和實物同方向（正立）', { size: 26, color: GREEN, edge: GREEN })].map((x) => x.parentNode);

      tl.addLabel('s1');
      S.hide(tl, [msA, stA, ...calls0], 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.show(tl, fly, 's1+=1', 0.2);
      // 飛行中的 F：在深色卡片上是淺色，進入淺色視野時漸漸變深
      const ink = (u) => { const t = S.smoothstep(0.45, 0.8, u); return `rgb(${[[232, 31], [240, 42], [242, 51]].map(([a, b]) => Math.round(S.lerp(a, b, t))).join(',')})`; };
      S.drive(tl, (u) => fly.forEach((o, k) => {
        S.place(o.firstChild, { x: S.lerp(CX[k] - 165, CX[k] + 120, u), y: Y - Math.sin(Math.PI * u) * 60, s: S.lerp(0.4, 1, u), r: k ? 0 : 180 * u });
        o.firstChild.firstChild.setAttribute('fill', ink(u));
      }), 1.6, 's1+=1.1', 'power1.inOut');
      S.show(tl, imgs, 's1+=2.6', 0.2);
      S.hide(tl, fly, 's1+=2.7', 0.2);
      S.show(tl, res1, 's1+=3', 0.4);

      // ===== 2 移動方向 =====
      const P2 = g(root, { opacity: 0 });
      const objArrows = CX.map((cx) => arrow(g(P2), cx - 135, Y - 80, cx - 205, Y - 80, C.hi, 6, 20));
      const fieldArrows = CX.map((cx, k) => {
        const a = g(root, { opacity: 0 });
        arrow(a, cx + 120 + (k ? 44 : -44), Y + 96, cx + 120 + (k ? -44 : 44), Y + 96, '#e0901a', 6, 20);
        return a;
      });
      const res2 = [S.pill(g(P2, { opacity: 0 }), CX[0], 600, '玻片往左 → 像往右（方向相反）', { size: 26, color: TEAL, edge: TEAL }),
        S.pill(g(P2, { opacity: 0 }), CX[1], 600, '紙片往左 → 像也往左（方向相同）', { size: 26, color: GREEN, edge: GREEN })].map((x) => x.parentNode);

      tl.addLabel('s2');
      S.hide(tl, [...res1, ...sub1], 's2', 0.3);
      S.show(tl, [...sub2, ...marks], 's2+=0.2', 0.3);
      S.show(tl, P2, 's2+=0.4', 0.3);
      S.drive(tl, (u) => {
        objs.forEach((o, k) => S.place(o, { x: CX[k] - 165 - DX * u, y: Y }));
        imgPos.forEach((o, k) => S.place(o, { ...IMG0[k], x: IMG0[k].x + (k ? -IMG : IMG) * u }));
      }, 1.6, 's2+=0.9', 'power2.inOut');
      S.show(tl, fieldArrows, 's2+=2.6', 0.3);
      S.show(tl, res2, 's2+=3', 0.4);

      // ===== 3 光線與標本 =====
      const P3 = g(root, { opacity: 0 });
      const msB = S.place(g(P3), { x: 420, y: 560, s: 0.8 });
      const mB = S.drawMicroscope(msB);
      el('rect', { x: -24, y: -203.5, width: 48, height: 2.5, fill: '#e8cf8a' }, mB.stageG); // 洋蔥表皮
      el('rect', { x: -28, y: -206, width: 56, height: 2.5, fill: 'rgba(210,240,255,0.8)' }, mB.stageG); // 蓋玻片
      // 光從燈泡往上，穿過光圈、玻片、物鏡、鏡筒、目鏡
      const beamA = g(msB);
      const bcid = uid('beam');
      const bclip = el('rect', { x: -20, y: -112, width: 40, height: 0 }, el('clipPath', { id: bcid }, el('defs', {}, beamA)));
      const bg = g(beamA, { 'clip-path': `url(#${bcid})` });
      const bgr = el('linearGradient', { id: uid('bg'), x1: 0, y1: 1, x2: 0, y2: 0 }, el('defs', {}, beamA));
      [[0, 'rgba(255,233,140,0.95)'], [1, 'rgba(255,233,140,0.6)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, bgr));
      el('rect', { x: -7, y: -556, width: 14, height: 444, rx: 7, fill: `url(#${bgr.id})` }, bg);
      [-150, -240, -350, -440, -540].forEach((yy) => ray(bg, 0, yy, 0, '#7a5a10', 8));
      const eyeA = eyeIcon(g(P3, { opacity: 0 }), 420, 100, 0.9).parentNode;
      // 解剖顯微鏡：上方光源照在螞蟻上，反射的光往上進入物鏡、目鏡
      const stB = S.place(g(P3), { x: 1040, y: 560, s: 0.95 });
      const sB = drawStereo(stB);
      const [lx, ly] = sB.lens;
      const cone = g(stB, { opacity: 0 });
      const cgr = el('linearGradient', { id: uid('cone'), x1: 0.9, y1: 0, x2: 0.2, y2: 1 }, el('defs', {}, cone));
      [[0, 'rgba(255,233,140,0.85)'], [1, 'rgba(255,233,140,0.25)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, cgr));
      el('path', { d: `M ${lx - 9.3},${ly - 3.8} L ${lx + 9.3},${ly + 3.8} L 26,-52 L -44,-54 Z`, fill: `url(#${cgr.id})` }, cone);
      ray(cone, 22, -130, -158, '#7a5a10', 8);
      antSide(stB, -8, -50, 0.6); // 螞蟻畫在光的上面，才看得清楚
      const refl = el('path', { d: 'M -8,-72 L -8,-330 L -86,-431', fill: 'none', stroke: 'rgba(255,225,120,0.9)', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, stB);
      const reflHeads = g(stB, { opacity: 0 });
      ray(reflHeads, -8, -140, 0, '#7a5a10', 8); ray(reflHeads, -8, -290, 0, '#7a5a10', 8); ray(reflHeads, -60, -397, -38, '#7a5a10', 8);
      const eyeB = eyeIcon(g(P3, { opacity: 0 }), 930, 114, 0.9).parentNode;
      const W3 = (x, y) => [420 + 0.8 * x, 560 + 0.8 * y], W4 = (x, y) => [1040 + 0.95 * x, 560 + 0.95 * y];
      const calls3 = [
        [W3(-8, -400), 160, 240, '經過物鏡、目鏡', C.ink], [W3(-18, -203), 160, 398, '光穿過薄薄的標本', C.hi], [W3(-14, -110), 160, 480, '光源在下方', C.ink],
        [W4(-8, -160), 760, 380, '反射的光進入物鏡', C.ink], [W4(14, -110), 760, 450, '光從上方照下來', C.hi], [W4(-43, -62), 760, 520, '不透光的螞蟻', C.ink],
      ].map(([[tx, ty], x, y, s, col]) => S.callout(P3, tx, ty, x, y, s, col, { size: 24 }));
      calls3[5].lastChild.setAttribute('r', 3.5); // 指向螞蟻的圓點小一點，不要蓋住螞蟻
      const note3 = g(P3, { opacity: 0 });
      rich(note3, CX[0], 624, [['標本要'], B('薄而透光'), ['，光才穿得過']]);
      rich(note3, CX[0], 664, [['→ 做成'], B('玻片標本'), ['（例：洋蔥表皮）']]);
      rich(note3, CX[1], 624, [['可以直接看'], B('較大、不透光'), ['的物體']]);
      rich(note3, CX[1], 664, [B('不必切薄、不必做玻片')]);

      tl.addLabel('s3');
      S.hide(tl, [P1, P2, ...fieldArrows], 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      S.show(tl, eyeA, 's3+=0.8', 0.3);
      S.drive(tl, (u) => { bclip.setAttribute('y', (-112 - 446 * u).toFixed(1)); bclip.setAttribute('height', (446 * u).toFixed(1)); }, 1.4, 's3+=0.9', 'power1.inOut');
      S.show(tl, cone, 's3+=1', 0.6);
      S.drawOn(tl, refl, 1.2, 's3+=1.6');
      S.show(tl, [reflHeads, eyeB], 's3+=2.6', 0.3);
      calls3.forEach((c, i) => S.show(tl, c, `s3+=${2.4 + (i % 3) * 0.3 + (i >= 3 ? 0.15 : 0)}`, 0.3));
      S.show(tl, note3, 's3+=3.6', 0.5);

      // ===== 4 倍率與立體感 =====
      const P4 = g(root, { opacity: 0 });
      const FY = 330, FR = 168;
      const fA = view(P4, CX[0], FY, FR, '#b8954a');
      onionCells(fA.inner, CX[0] - FR, FY - FR - 8, FR * 2, 12, 30, 120, rnd);
      const fB = view(P4, CX[1], FY, FR, '#f3f4f0');
      const vg = el('radialGradient', { id: uid('vig'), cx: 0.5, cy: 0.5, r: 0.5 }, el('defs', {}, fB));
      [[0.7, 'rgba(0,0,0,0)'], [1, 'rgba(60,70,80,0.25)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, vg));
      const antG = g(fB.inner, { opacity: 0 });
      antWithShadow(antG, CX[1], FY + 18, 0.82);
      el('circle', { cx: CX[1], cy: FY, r: FR, fill: `url(#${vg.id})` }, fB.inner);
      // 眼睛：複式（多為單眼）一隻；解剖（雙眼）兩隻，從稍微不同的角度看
      const eyes4 = g(P4, { opacity: 0 });
      const sight = (ex, ey, tx, ty, cx, cy) => {
        // 從眼睛往目標畫虛線，停在視野邊緣
        const dx = tx - ex, dy = ty - ey, L = Math.hypot(dx, dy);
        let t = 0;
        while (t < L && Math.hypot(ex + (dx * t) / L - cx, ey + (dy * t) / L - cy) > FR + 6) t += 1;
        el('line', { x1: ex + (dx * 22) / L, y1: ey + (dy * 22) / L, x2: ex + (dx * t) / L, y2: ey + (dy * t) / L, stroke: C.mute, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, eyes4);
      };
      sight(CX[0], 106, CX[0], FY, CX[0], FY);
      sight(CX[1] - 48, 106, CX[1], FY + 18, CX[1], FY);
      sight(CX[1] + 48, 106, CX[1], FY + 18, CX[1], FY);
      eyeIcon(eyes4, CX[0], 104, 0.85);
      eyeIcon(eyes4, CX[1] - 48, 104, 0.85);
      eyeIcon(eyes4, CX[1] + 48, 104, 0.85);
      const txt4 = CX.map((cx, k) => {
        const t = g(P4, { opacity: 0 });
        text(t, cx, 554, k ? '約 10～40 倍＊' : '約 40～400 倍＊', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
        rich(t, cx, 598, k ? [['倍率'], B('較低', GREEN), ['：看整隻螞蟻']] : [['倍率'], B('較高', TEAL), ['：看得到細胞']]);
        rich(t, cx, 638, k ? [['用雙眼看，像是'], B('立體', GREEN), ['的']] : [['看到的像是'], B('平面', TEAL), ['的']]);
        return t;
      });

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.show(tl, eyes4, 's4+=0.9', 0.4);
      S.show(tl, antG, 's4+=1.3', 0.6);
      S.show(tl, txt4[0], 's4+=2.2', 0.4);
      S.show(tl, txt4[1], 's4+=2.8', 0.4);

      // ===== 5 比較表＋什麼時候用哪一種 =====
      const P5 = g(root, { opacity: 0 });
      const COLX = [145, 478, 933], RH = 52, TY = 20;
      const ROWS = [
        ['觀察方式', '多為單眼', '雙眼'],
        ['像的方向', '上下左右顛倒（移動方向相反）', '和實物同方向（正立）'],
        ['立體感', '平面', '立體'],
        ['放大倍率', '較高（約 40～400 倍＊）', '較低（約 10～40 倍＊）'],
        ['光源', '在下方，光要穿過標本', '可從上方照光（有的也有下方光源）'],
        ['適合觀察', '微小、薄而透光的玻片標本', '較大、不透光的完整物體'],
      ];
      const head5 = g(P5);
      text(head5, COLX[1], TY + 36, '複式顯微鏡', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: TEAL });
      text(head5, COLX[2], TY + 36, '解剖顯微鏡', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: GREEN });
      const rows5 = ROWS.map((r, i) => {
        const y = TY + (i + 1) * RH + 4, row = g(P5, { opacity: 0 });
        el('rect', { x: 40, y, width: 1120, height: RH - 6, rx: 10, fill: i % 2 ? '#162a3a' : '#122230' }, row);
        text(row, COLX[0], y + 31, r[0], { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
        text(row, COLX[1], y + 31, r[1], { 'font-size': 24, 'text-anchor': 'middle' });
        text(row, COLX[2], y + 31, r[2], { 'font-size': 24, 'text-anchor': 'middle' });
        return row;
      });
      el('line', { x1: 250, y1: TY + RH, x2: 250, y2: TY + 7 * RH + 2, stroke: LINE, 'stroke-width': 2 }, P5);
      el('line', { x1: 705, y1: TY + 8, x2: 705, y2: TY + 7 * RH + 2, stroke: LINE, 'stroke-width': 2 }, P5);
      const q5 = text(P5, 600, 434, '要觀察下面這些，用哪一種顯微鏡？', { 'font-size': 26, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi, opacity: 0 });
      const EX = [
        ['觀察洋蔥表皮細胞', '細胞很小，標本薄而透光', 0],
        ['觀察螞蟻的外形', '較大、不透光，看立體外形', 1],
        ['觀察花的構造', '例如雄蕊、雌蕊的樣子', 1],
      ];
      const exCards = [], exAns = [];
      EX.forEach(([t1, t2, k], i) => {
        const x = 40 + i * 380, c = g(P5, { opacity: 0 });
        el('rect', { x, y: 456, width: 360, height: 244, rx: 16, fill: CARD, stroke: LINE, 'stroke-width': 2 }, c);
        const ic = view(c, x + 120, 534, 58, i === 0 ? '#b8954a' : '#f3f4f0');
        if (i === 0) onionCells(ic.inner, x + 60, 472, 120, 6, 22, 66, rnd);
        else if (i === 1) antWithShadow(ic.inner, x + 120, 539, 0.29);
        else flower(ic.inner, x + 120, 534, 0.78);
        text(c, x + 180, 630, t1, { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle' });
        text(c, x + 180, 664, t2, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' });
        exCards.push(c);
        const a = g(P5, { opacity: 0 });
        arrow(a, x + 190, 534, x + 222, 534, C.mute, 4, 12);
        S.pill(a, x + 268, 534, k ? '解剖' : '複式', { size: 26, color: k ? GREEN : TEAL, edge: k ? GREEN : TEAL });
        exAns.push(a);
      });

      tl.addLabel('s5');
      S.hide(tl, [P4, cards], 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      rows5.forEach((r, i) => S.show(tl, r, `s5+=${0.5 + i * 0.25}`, 0.3));
      S.show(tl, q5, 's5+=2.2', 0.3);
      exCards.forEach((c, i) => S.show(tl, c, `s5+=${2.4 + i * 0.2}`, 0.3));
      exAns.forEach((a, i) => S.show(tl, a, `s5+=${3.4 + i * 0.4}`, 0.3));

      return {
        tl,
        steps: [
          '<b>複式顯微鏡</b>的光源在載物台<b>下方</b>；<b>解剖顯微鏡</b>（也叫<b>立體顯微鏡</b>）有<b>兩個目鏡</b>，可以從<b>上方</b>照光。',
          '同一張寫著 F 的紙片：複式顯微鏡看到的像<b>上下、左右都顛倒</b>；解剖顯微鏡看到的像<b>和實物同方向（正立）</b>。',
          '把玻片（紙片）往左移：複式顯微鏡的像往<b>右</b>移，<b>方向相反</b>；解剖顯微鏡的像也往<b>左</b>移，<b>方向相同</b>。',
          '複式顯微鏡的光要<b>穿過標本</b>，所以標本要<b>薄而透光</b>、做成玻片；解剖顯微鏡可以從上方照光，直接看<b>較大、不透光</b>的物體。',
          '複式顯微鏡<b>倍率較高</b>，看到<b>平面</b>的像；解剖顯微鏡<b>倍率較低</b>，用<b>雙眼</b>看到<b>立體</b>的像。',
          '看<b>細胞</b>等微小、透光的玻片標本用<b>複式顯微鏡</b>；看<b>昆蟲、花</b>等較大物體的外形用<b>解剖顯微鏡</b>。',
        ],
        notes: [
          '＊顯微鏡的樣式各家不同：有的解剖顯微鏡用旋鈕換倍率；許多解剖顯微鏡上方、下方都有光源；也有雙眼的複式顯微鏡。',
          '＊視野裡的 F 只是示意大小。實驗時可以用報紙上的字或寫了字的小紙片，在兩種顯微鏡下比較看看。',
          '＊記法：複式顯微鏡的像偏哪一邊，玻片就往哪一邊移，才能把像移到視野中央；解剖顯微鏡則和平常移動物體一樣。',
          '＊示意：螞蟻畫得比實際大，光線只畫出主要的路徑。看透光的標本時，解剖顯微鏡也可以改用下方光源。',
          '＊倍率依機型而不同：學校常見的複式顯微鏡約 40～400 倍（有的可到 1000 倍以上）；解剖顯微鏡常見 20 倍、40 倍。',
          '＊表中的倍率是學校常見機型的大約範圍。',
        ],
      };
    },
  });
})();
