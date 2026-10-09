/* 七下第三章（演化與分類）共用圖形：化石、古生物、長頸鹿、樺尺蛾、分類用的生物。
   每個函式畫在 p 裡、原點在圖的中央附近，動物一律面向右（側面）；外層用 S.place 定位、縮放。 */
(() => {
  const { el, g } = S;
  let uid = 0;
  const nid = (k) => `b3${k}${uid++}`;
  const P = (p, d, fill, stroke = 'none', sw = 2, extra = {}) => el('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...extra }, p);
  const line = (p, d, stroke, sw = 2, extra = {}) => P(p, d, 'none', stroke, sw, extra);
  const eye = (p, x, y, r = 4, iris = '#1a1410') => { el('circle', { cx: x, cy: y, r, fill: iris }, p); el('circle', { cx: x + r * 0.32, cy: y - r * 0.32, r: Math.max(0.8, r * 0.34), fill: '#fff' }, p); };
  const rot = (x, y, deg) => { const a = (deg * Math.PI) / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
  const B3 = (S.B3 = {});

  // ---------- 腳（給四足動物用）：x 是腳的中線，從 top 到地面 G ----------
  const leg = (p, x, top, G, w, fill, edge, { hoof = null, paw = false, hock = 0 } = {}) => {
    const w2 = w * 0.7, k = top + (G - top) * 0.5;
    const d = `M ${x - w / 2},${top} C ${x - w / 2 - hock},${k - 6} ${x - w2 / 2 + hock},${k} ${x - w2 / 2},${k + 8} L ${x - w2 / 2},${G - 2} L ${x + w2 / 2 + (paw ? 4 : 0)},${G - 2} L ${x + w2 / 2},${k + 8} C ${x + w2 / 2 + hock},${k} ${x + w / 2 - hock},${k - 6} ${x + w / 2},${top} Z`;
    P(p, d, fill, edge, 1.6);
    if (hoof) P(p, `M ${x - w2 / 2 - 1},${G - 7} L ${x + w2 / 2 + 1},${G - 7} L ${x + w2 / 2 + 2},${G} L ${x - w2 / 2 - 2},${G} Z`, hoof, 'none', 0);
    if (paw) el('ellipse', { cx: x + 2, cy: G - 3, rx: w2 / 2 + 3, ry: 4, fill, stroke: edge, 'stroke-width': 1.6 }, p);
  };

  // ---------- 平滑剪影工具：點列 → 封閉的 Bézier 曲線（第三個值為 1 的點保持尖角，例如蹄尖、耳尖）----------
  const curve = (pts, closed = true, k = 1 / 6) => {
    const n = pts.length, f = (v) => v.toFixed(1);
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    const m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const a = p1[2] === 1 ? 0 : k, b = p2[2] === 1 ? 0 : k;
      d += `C${f(p1[0] + (p2[0] - p0[0]) * a)},${f(p1[1] + (p2[1] - p0[1]) * a)} ${f(p2[0] - (p3[0] - p1[0]) * b)},${f(p2[1] - (p3[1] - p1[1]) * b)} ${f(p2[0])},${f(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  };
  S.B3curve = curve;
  // 先填色，再把陰影、亮面、斑紋剪在剪影裡面，最後描外框（外框在最上層，邊緣乾淨）
  const body = (p, d, fill, edge, sw = 1.8) => {
    const id = nid('c');
    const cp = el('path', { d }, el('clipPath', { id }, el('defs', {}, p)));
    const base = el('path', { d, fill }, p);
    const inside = g(p, { 'clip-path': `url(#${id})` });
    return { inside, cp, base, top: () => el('path', { d, fill: 'none', stroke: edge, 'stroke-width': sw, 'stroke-linejoin': 'round' }, p) };
  };
  const tone = (p, d, fill, op) => el('path', { d, fill, opacity: op }, p);
  const fur = (p, d, col, w = 1.3, op = 0.7) => el('path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', opacity: op }, p);
  const shine = (p, x, y, r, iris, pupil = '#141010', slit = false) => {
    el('circle', { cx: x, cy: y, r, fill: iris }, p);
    if (slit) el('ellipse', { cx: x + r * 0.15, cy: y, rx: r * 0.28, ry: r * 0.9, fill: pupil }, p);
    else el('circle', { cx: x + r * 0.1, cy: y, r: r * 0.62, fill: pupil }, p);
    el('circle', { cx: x + r * 0.42, cy: y - r * 0.4, r: Math.max(0.9, r * 0.3), fill: '#fff' }, p);
  };

  // ---------- 貓（家貓）／沙貓（sand：頭寬、耳朵大而低、沙色、腳上有淡淡的條紋）：腳底 y=58 ----------
  const CAT_BODY = [
    [55, 8], [55, 20], [53, 34], [52, 46], [54, 51], [58, 54], [58, 58, 1], [44, 58, 1], [43, 52], [42, 40], [41, 28], [39, 20],
    [26, 19], [6, 20], [-14, 18], [-24, 14],
    [-28, 20], [-29, 30], [-33, 40], [-37, 48], [-33, 53], [-30, 58, 1], [-46, 58, 1], [-48, 52], [-51, 44], [-56, 34], [-62, 22], [-66, 8],
    [-67, -4], [-64, -13],
    [-73, -16], [-86, -26], [-94, -44], [-92, -62], [-86, -70], [-80, -66], [-84, -50], [-80, -34], [-70, -24], [-58, -22],
    [-38, -28], [-12, -27], [14, -29], [36, -32], [47, -40],
  ];
  const CAT_HEAD = [[50, -48], [52, -56], [54, -75, 1], [62, -61], [68, -62], [77, -76, 1], [83, -57], [88, -47], [92, -38], [94, -30], [92, -25], [86, -21], [76, -18], [66, -13], [58, -4]];
  // 沙貓：頭寬、耳朵大而低、往兩側張開
  const SAND_HEAD = [[49, -44], [45, -50], [36, -66, 1], [52, -59], [62, -61], [72, -61], [88, -71, 1], [90, -53], [94, -44], [96, -34], [95, -27], [88, -19], [76, -15], [66, -11], [58, -2]];
  B3.cat = (p, { fill = '#e8a35c', dark = '#8a541f', light = '#fbe1b8', shadow = '#c2793a', bigEars = false, stripes = true } = {}) => {
    const c = g(p);
    // 遠側的兩隻腳（較暗）
    const sand = bigEars;
    // 沙貓的腳比較短：腳的部分縮短，整隻往下移，腳底仍在 y=58
    const sq = (pts) => (sand ? pts.map(([x, y, k]) => [x, (y > 18 ? 18 + (y - 18) * 0.8 : y) + 8, k]) : pts);
    P(c, curve(sq([[47, 8], [46, 28], [45, 44], [47, 50], [51, 54], [51, 58, 1], [37, 58, 1], [36, 50], [35, 36], [34, 22], [33, 10]])), shadow, dark, 1.4);
    P(c, curve(sq([[-38, 12], [-38, 28], [-42, 40], [-45, 48], [-41, 53], [-38, 58, 1], [-54, 58, 1], [-56, 50], [-58, 40], [-62, 28], [-60, 8]])), shadow, dark, 1.4);
    const d = curve(sq([...(sand ? SAND_HEAD : CAT_HEAD), ...CAT_BODY]));
    const o = body(c, d, fill, dark);
    const dy0 = sand ? 8 : 0, T = (d) => `<g transform="translate(0,${dy0})">${d}</g>`;
    const sh = g(o.inside, { transform: `translate(0,${dy0})` });
    tone(sh, 'M -70,6 C -40,18 20,20 62,2 C 56,20 30,28 0,28 C -32,28 -58,22 -70,6 Z', shadow, 0.6);
    tone(sh, 'M 40,10 C 46,24 46,40 48,60 L 40,60 C 40,40 38,24 36,12 Z', shadow, 0.35);
    tone(sh, 'M -60,-25 C -30,-33 12,-34 44,-33 C 20,-25 -24,-21 -62,-18 Z', light, 0.55);
    tone(sh, 'M 76,-30 C 84,-34 92,-32 94,-26 C 88,-18 78,-16 70,-20 Z', light, 0.85);
    tone(sh, 'M 57,-8 C 61,2 59,12 55,16 C 51,8 51,-2 57,-8 Z', light, 0.6);
    if (stripes) {
      ['M -44,-26 C -40,-16 -44,-8 -48,-4', 'M -28,-28 C -24,-18 -28,-9 -32,-5', 'M -12,-28 C -8,-18 -12,-9 -16,-5', 'M 4,-29 C 8,-20 4,-12 0,-8', 'M 20,-29 C 23,-21 20,-14 16,-10'].forEach((s) => fur(sh, s, dark, 3.4, 0.55));
      ['M -88,-40 L -80,-42', 'M -91,-54 L -82,-54', 'M -50,32 L -40,30', 'M -48,42 L -38,40', 'M 44,28 L 52,28', 'M 44,40 L 52,40'].forEach((s) => fur(sh, s, dark, 3, 0.5));
      fur(sh, 'M 62,-58 C 64,-52 64,-48 62,-44 M 68,-60 C 70,-54 70,-50 68,-46', dark, 2.2, 0.55);
    } else {
      ['M 43,26 L 53,26', 'M 43,36 L 52,36', 'M -52,30 L -42,28', 'M -54,38 L -44,38', 'M -89,-44 L -81,-46', 'M -92,-56 L -84,-58'].forEach((s) => fur(sh, s, '#9a7a48', 2.6, 0.55));
      el('ellipse', { cx: -86, cy: -67, rx: 6, ry: 5, fill: '#2a2018', opacity: 0.9 }, sh);
    }
    fur(sh, 'M -34,8 C -40,0 -46,-2 -54,0', dark, 1.4, 0.5);
    o.top();
    // 耳朵內側
    const dy = sand ? 8 : 0;
    const hd = S.place(g(c), { y: dy });
    if (sand) { P(hd, curve([[74, -60], [86, -69, 1], [86, -55]]), '#e9b6a2', 'none', 0); P(hd, curve([[50, -57], [39, -64, 1], [48, -52]]), '#d9a690', 'none', 0, { opacity: 0.85 }); fur(hd, 'M 82,-40 C 78,-36 72,-34 66,-34', '#b86a3a', 1.6, 0.7); }
    else P(hd, 'M 71,-61 L 76,-72 L 80,-58 Z', '#e9a2a2', 'none', 0);
    // 眼、鼻、嘴、鬍鬚
    P(hd, 'M 70,-42 C 73,-46 79,-46 82,-42 C 79,-38 73,-38 70,-42 Z', sand ? '#a8b84a' : '#8fbf3c', '#3a2a18', 1);
    el('ellipse', { cx: 76.5, cy: -42, rx: 1.4, ry: 3.6, fill: '#141010' }, hd);
    el('circle', { cx: 78, cy: -43.6, r: 1.1, fill: '#fff' }, hd);
    P(hd, 'M 90,-33 L 94,-31 L 91,-28 Z', '#d97c86', 'none', 0);
    fur(hd, 'M 91,-28 C 90,-25 87,-24 84,-25', '#5a3a22', 1.3, 1);
    ['M 84,-27 L 104,-31', 'M 84,-25 L 105,-24', 'M 83,-23 L 102,-17'].forEach((s) => fur(hd, s, '#fff6e6', 1, 0.8));
    return c;
  };

  // ---------- 狗（米克斯／拉不拉多般的中型犬）：腳底 y=58 ----------
  B3.dog = (p, { fill = '#c58c52', dark = '#6e4520', light = '#ecc996', shadow = '#9a6634' } = {}) => {
    const c = g(p);
    const sx = (pts) => pts.map(([x, y, k]) => [x < 40 ? 40 + (x - 40) * 0.86 : x, y, k]); // 身體短一點（狗的體長約等於肩高）
    P(c, curve([[46, 10], [45, 32], [45, 46], [47, 51], [51, 54], [51, 58, 1], [37, 58, 1], [36, 50], [35, 36], [34, 22], [33, 12]]), shadow, dark, 1.4);
    P(c, curve(sx([[-36, 12], [-37, 26], [-41, 38], [-45, 47], [-41, 53], [-38, 58, 1], [-54, 58, 1], [-56, 50], [-58, 40], [-62, 28], [-60, 10]])), shadow, dark, 1.4);
    const d = curve(sx([
      [108, -42], [108, -35], [100, -30], [90, -28], [78, -25], [68, -18], [61, -6], [58, 8],
      [55, 20], [53, 34], [53, 46], [55, 51], [59, 54], [59, 58, 1], [45, 58, 1], [44, 52], [43, 40], [42, 28], [40, 18],
      [28, 17], [12, 13], [-6, 9], [-22, 9],
      [-28, 14], [-28, 26], [-32, 36], [-36, 46], [-34, 52], [-30, 54], [-28, 58, 1], [-44, 58, 1], [-46, 52], [-48, 44], [-52, 34], [-58, 22], [-64, 6],
      [-64, -8], [-70, -16], [-80, -30], [-86, -46], [-88, -57, 1], [-82, -50], [-76, -36], [-66, -22],
      [-50, -26], [-20, -28], [10, -28], [32, -32], [44, -42], [52, -54], [62, -60], [74, -60], [82, -55], [88, -50], [98, -48], [106, -46],
    ]));
    const o = body(c, d, fill, dark);
    tone(o.inside, 'M -56,0 C -34,12 20,14 58,-2 C 52,16 26,22 4,22 C -24,22 -48,16 -56,0 Z', shadow, 0.6);
    tone(o.inside, 'M -48,-26 C -24,-32 10,-32 40,-36 C 18,-26 -20,-22 -50,-18 Z', light, 0.55);
    tone(o.inside, 'M 58,-8 C 64,2 60,14 54,18 C 50,8 52,-2 58,-8 Z', light, 0.7);
    tone(o.inside, 'M 88,-44 C 96,-46 104,-44 108,-40 C 104,-34 96,-30 86,-32 Z', light, 0.55);
    ['M 52,22 L 50,30', 'M -29,24 C -32,30 -34,36 -34,40', 'M -44,10 C -48,4 -50,-2 -50,-6'].forEach((s) => fur(o.inside, s, dark, 1.3, 0.5));
    o.top();
    // 垂耳
    const ear = curve([[60, -60], [70, -61], [74, -50], [72, -36], [66, -28], [59, -33], [57, -48]]);
    P(c, ear, shadow, dark, 1.5);
    fur(c, 'M 64,-52 C 66,-44 66,-38 64,-32', dark, 1.2, 0.5);
    el('ellipse', { cx: 106, cy: -40.5, rx: 5, ry: 4, fill: '#241a14' }, c);
    el('circle', { cx: 107.5, cy: -42, r: 1.2, fill: '#fff', opacity: 0.7 }, c);
    shine(c, 84, -50, 3.4, '#4a2e16');
    fur(c, 'M 80,-54 C 83,-56 87,-56 89,-54', dark, 1.2, 0.8);
    fur(c, 'M 106,-31 C 100,-28 94,-28 90,-30', '#4a2e16', 1.3, 0.9);
    return c;
  };

  // ---------- 獅子（公獅：鬃毛、結實的身體、尾端的毛簇）：腳底 y=60 ----------
  B3.lion = (p, { fill = '#d8a65e', dark = '#7a4e1e', mane = '#8a4a1c', light = '#f2d7a2', shadow = '#b07c3a' } = {}) => {
    const c = g(p);
    P(c, curve([[46, 8], [46, 32], [45, 50], [50, 55], [52, 60, 1], [36, 60, 1], [35, 50], [34, 30], [33, 10]]), shadow, dark, 1.4);
    P(c, curve([[-40, 10], [-41, 28], [-45, 42], [-42, 54], [-40, 60, 1], [-56, 60, 1], [-58, 46], [-62, 30], [-60, 8]]), shadow, dark, 1.4);
    const d = curve([
      [86, -22], [76, -14], [64, -6], [58, 8],
      [56, 22], [55, 40], [55, 52], [60, 55], [62, 60, 1], [44, 60, 1], [43, 52], [42, 36], [40, 20],
      [24, 16], [0, 18], [-26, 16],
      [-32, 22], [-32, 36], [-38, 48], [-33, 55], [-31, 60, 1], [-48, 60, 1], [-52, 48], [-56, 34], [-62, 18], [-68, 2],
      [-72, -4], [-84, 4], [-92, 18], [-95, 36], [-97, 44], [-100, 34], [-97, 14], [-88, -2], [-74, -12],
      [-62, -18], [-40, -24], [-10, -27], [20, -27], [40, -33], [56, -44], [70, -52], [84, -48], [92, -36],
    ]);
    const o = body(c, d, fill, dark);
    tone(o.inside, 'M -70,4 C -40,16 20,18 62,0 C 56,18 30,26 0,26 C -32,26 -58,20 -70,4 Z', shadow, 0.6);
    tone(o.inside, 'M -62,-20 C -30,-28 12,-30 42,-32 C 20,-22 -24,-18 -64,-12 Z', light, 0.55);
    tone(o.inside, 'M 40,10 C 46,26 46,42 48,62 L 40,62 C 40,42 38,26 36,12 Z', shadow, 0.3);
    ['M -44,0 C -50,-8 -56,-10 -62,-8', 'M 24,-4 C 28,4 30,12 30,16', 'M -34,24 C -38,30 -40,36 -40,42'].forEach((s) => fur(o.inside, s, dark, 1.4, 0.45));
    o.top();
    // 尾端的毛簇
    P(c, curve([[-98, 36], [-92, 42], [-92, 54], [-97, 60], [-102, 54], [-103, 44]]), mane, '#4a2a10', 1.2);
    // 鬃毛（波浪狀的外緣）
    // 鬃毛：一圈圈蓬鬆的毛，包住頭的後面、脖子和胸前
    const mp = [];
    for (let i = 0; i < 34; i++) {
      const a = -2.75 + (i / 33) * 4.3, r = 36 * (1 + 0.07 * Math.sin(i * 1.9)), ry = a > 0.6 ? 1.35 : 1.05;
      mp.push([60 + Math.cos(a) * r, -30 + Math.sin(a) * r * ry]);
    }
    mp.push([44, 14], [34, -6], [30, -26]);
    P(c, curve(mp), mane, '#4a2a10', 1.5);
    tone(c, curve([[40, -56], [62, -64], [80, -58], [70, -48], [54, -46], [40, -40]]), '#a8642c', 0.7);
    for (let i = 0; i < 12; i++) { const a = -2.6 + i * 0.36, r0 = 16, r1 = 33; fur(c, `M ${(60 + Math.cos(a) * r0).toFixed(1)},${(-30 + Math.sin(a) * r0).toFixed(1)} Q ${(60 + Math.cos(a + 0.25) * 26).toFixed(1)},${(-30 + Math.sin(a + 0.25) * 26).toFixed(1)} ${(60 + Math.cos(a + 0.1) * r1).toFixed(1)},${(-30 + Math.sin(a + 0.1) * r1 * (a > 0.6 ? 1.3 : 1)).toFixed(1)}`, '#5e3414', 1.6, 0.55); }
    // 臉
    const face = curve([[64, -50], [76, -54], [88, -48], [96, -38], [101, -29], [99, -20], [90, -14], [78, -15], [68, -22], [62, -36]]);
    P(c, face, fill, dark, 1.6);
    tone(c, 'M 86,-30 C 94,-32 100,-28 100,-22 C 96,-15 86,-14 80,-18 C 80,-24 82,-28 86,-30 Z', light, 0.9);
    el('circle', { cx: 70, cy: -50, r: 6, fill: shadow, stroke: dark, 'stroke-width': 1.2 }, c);
    P(c, 'M 96,-32 L 101,-30 L 99,-26 Z', '#5a3a2a', 'none', 0);
    fur(c, 'M 99,-25 C 97,-21 94,-20 90,-21', '#4a2a10', 1.3, 1);
    shine(c, 82, -40, 3.2, '#b07a20');
    fur(c, 'M 78,-44 C 81,-46 85,-46 87,-44', dark, 1.2, 0.8);
    return c;
  };

  // ---------- 兔（坐姿）----------
  B3.rabbit = (p, { fill = '#c9b294', dark = '#6e5a40', light = '#f2e9da', shadow = '#a08a6c' } = {}) => {
    const c = g(p);
    P(c, curve([[24, -44], [20, -64], [22, -86], [28, -94], [33, -86], [32, -64], [30, -46]]), shadow, dark, 1.4);
    const d = curve([
      [60, -22], [58, -15], [52, -10], [44, -6], [38, 4],
      [36, 20], [35, 32], [37, 39], [41, 42], [41, 46, 1], [28, 46, 1], [28, 40], [27, 30], [25, 22],
      [16, 30], [12, 38], [16, 42], [18, 46, 1], [-32, 46, 1], [-44, 40],
      [-54, 24], [-55, 6], [-46, -10], [-28, -21], [-6, -26], [12, -27], [22, -32], [28, -40], [29, -50],
      [28, -70], [32, -90], [37, -97], [43, -89], [43, -68], [41, -50], [48, -42], [56, -33],
    ]);
    const o = body(c, d, fill, dark);
    tone(o.inside, 'M -56,18 C -30,34 10,38 40,30 L 44,50 L -60,50 Z', shadow, 0.5);
    tone(o.inside, 'M -44,-8 C -26,-22 0,-28 22,-30 C 6,-20 -20,-12 -46,-2 Z', light, 0.55);
    tone(o.inside, 'M 35,-86 C 37,-93 40,-93 40,-86 L 39,-60 C 38,-54 36,-54 36,-60 Z', '#e8b0a8', 0.9);
    tone(o.inside, 'M 46,-24 C 52,-28 58,-26 60,-20 C 54,-14 48,-14 44,-18 Z', light, 0.85);
    fur(o.inside, 'M -40,12 C -34,-4 -14,-10 2,-2 C 12,6 14,20 8,30', dark, 1.3, 0.5);
    fur(o.inside, 'M 18,40 L 18,46', dark, 1.2, 0.5);
    o.top();
    P(c, curve([[-56, 14], [-50, 8], [-44, 12], [-46, 20], [-54, 22]]), light, dark, 1.2);
    shine(c, 46, -30, 3.6, '#3a2418');
    P(c, 'M 58,-24 L 61,-22 L 58,-20 Z', '#c97a7a', 'none', 0);
    fur(c, 'M 59,-19 C 58,-16 55,-15 52,-16', dark, 1.1, 0.9);
    return c;
  };

  // ---------- 馬科：馬（可調比例：始祖馬到現代馬）、驢、騾。地面 y=G=14+74×leg ----------
  // 點的標記：'h' 頭、'e' 耳、'n' 頸；其他點中 y>14 的是腳（隨 leg 伸縮）
  const HORSE = [
    [86, -104, 0, 'h'], [92, -106, 0, 'h'],
    [100, -100, 0, 'h'], [108, -86, 0, 'h'], [116, -70, 0, 'h'], [121, -60, 0, 'h'], [125, -53, 0, 'h'], [124, -48, 0, 'h'], [119, -45, 0, 'h'], [112, -47, 0, 'h'], [100, -56, 0, 'h'], [92, -64, 0, 'h'],
    [84, -56, 0, 'n'], [76, -40, 0, 'n'], [70, -22, 0, 'n'],
    [67, -6], [66, 6],
    [64, 16], [62, 30], [63, 44], [61, 52], [61, 64], [63, 72], [65, 79], [66, 84], [68, 88, 1], [55, 88, 1], [56, 81], [55, 76], [53, 70], [54, 58], [53, 46], [52, 30], [50, 18],
    [40, 19], [10, 22], [-20, 20], [-34, 16],
    [-37, 22], [-40, 36], [-46, 50], [-46, 62], [-45, 72], [-43, 79], [-41, 84], [-39, 88, 1], [-52, 88, 1], [-53, 82], [-55, 76], [-56, 70], [-56, 58], [-61, 48], [-62, 36], [-68, 18], [-74, 6],
    [-78, -6], [-78, -18],
    [-68, -32], [-46, -37], [-20, -37], [6, -38], [28, -44],
    [44, -56, 0, 'n'], [60, -76, 0, 'n'], [74, -94, 0, 'n'],
  ];
  const H_FAR_F = [[56, 10], [54, 30], [55, 44], [53, 52], [53, 64], [55, 72], [57, 79], [58, 84], [60, 88, 1], [47, 88, 1], [48, 81], [47, 76], [45, 70], [46, 58], [45, 46], [44, 30], [42, 14]];
  const H_FAR_H = [[-27, 18], [-30, 36], [-36, 50], [-36, 62], [-35, 72], [-33, 79], [-31, 84], [-29, 88, 1], [-42, 88, 1], [-43, 82], [-45, 76], [-46, 70], [-46, 58], [-51, 48], [-52, 36], [-58, 18], [-62, 8]];
  B3.horse = (p, { fill = '#a2683a', dark = '#4e2f16', mane = '#2e1c10', shadow = '#7a4a26', light = '#c9915e', leg: lk = 1, neck: nk = 1, head: hk = 1, arch = 0, ears = 1, muzzle = null, tuft = false, belly = null, shortMane = false, stripe = false } = {}) => {
    const c = g(p);
    const G = 14 + 74 * lk;
    const B = [56, -24], A = [92, -80], EB = [89, -108];
    const tf = ([x, y, k, t]) => {
      if (t === 'h') { const ax = B[0] + (A[0] - B[0]) * nk, ay = B[1] + (A[1] - B[1]) * nk; return [ax + (x - A[0]) * hk, ay + (y - A[1]) * hk, k]; }
      if (t === 'n') return [B[0] + (x - B[0]) * nk, B[1] + (y - B[1]) * nk, k];
      if (y > 14) return [x, 14 + (y - 14) * lk, k];
      if (y < -30 && x > -72 && x < 32) return [x, y - arch * 16 * Math.max(0, Math.sin(Math.PI * (x + 72) / 104)), k];
      return [x, y, k];
    };
    const legT = ([x, y, k]) => [x, y > 14 ? 14 + (y - 14) * lk : y, k];
    // 尾巴（在身體後面）
    if (tuft) {
      fur(c, `M -76,-16 C -86,-4 -90,${14 + 30 * lk} -88,${14 + 44 * lk}`, fill, 4.5, 1);
      P(c, curve([[-88, 10 + 44 * lk], [-84, 18 + 46 * lk], [-86, 30 + 48 * lk], [-91, 32 + 48 * lk], [-94, 20 + 46 * lk]]), mane, 'none', 0);
    } else {
      P(c, curve([[-76, -22], [-88, -16], [-98, 0], [-100, 14 + 28 * lk], [-96, 14 + 54 * lk], [-90, 14 + 62 * lk], [-88, 14 + 50 * lk], [-86, 14 + 24 * lk], [-82, 6], [-72, -10]]), mane, 'none', 0);
      fur(c, `M -86,-6 C -94,8 -94,${14 + 30 * lk} -92,${14 + 52 * lk}`, '#5a3a22', 1.4, 0.6);
    }
    // 耳朵（兩隻，在頭的後面；驢、騾的耳朵長而寬、往後傾）
    const pl = tf([90, -103, 0, 'h']);
    const eLen = 17 * ears * hk, eW = (ears > 1.5 ? 6 + 3.5 * ears : 8) * hk, lean = ears > 1.5 ? -eLen * 0.22 : 2;
    const earD = (bx, by) => curve([[bx - eW / 2, by + 5], [bx - eW * 0.62, by - eLen * 0.45], [bx + lean - eW * 0.12, by - eLen * 0.9], [bx + lean, by - eLen, 1], [bx + lean + eW * 0.18, by - eLen * 0.86], [bx + eW * 0.62, by - eLen * 0.42], [bx + eW / 2, by + 5]]);
    P(c, earD(pl[0] + 5 * hk, pl[1] + 1), shadow, dark, 1.4);
    P(c, earD(pl[0], pl[1]), fill, dark, 1.6);
    if (ears > 1.5) P(c, curve([[pl[0] - eW * 0.2, pl[1] - 2], [pl[0] - eW * 0.3, pl[1] - eLen * 0.45], [pl[0] + lean, pl[1] - eLen * 0.88, 1], [pl[0] + eW * 0.25, pl[1] - eLen * 0.42], [pl[0] + eW * 0.15, pl[1] - 2]]), '#e6dcd0', 'none', 0, { opacity: 0.9 });
    if (ears > 1.5) el('path', { d: `M ${pl[0] + lean - 2},${pl[1] - eLen + 3} L ${pl[0] + lean + 2},${pl[1] - eLen + 3} L ${pl[0] + lean},${pl[1] - eLen} Z`, fill: '#2a2420' }, c);
    // 遠側的腳
    P(c, curve(H_FAR_F.map(legT)), shadow, dark, 1.3);
    P(c, curve(H_FAR_H.map(legT)), shadow, dark, 1.3);
    const pts = HORSE.map(tf);
    const d = curve(pts);
    const o = body(c, d, fill, dark);
    const by = (y) => (y > 14 ? 14 + (y - 14) * lk : y);
    tone(o.inside, `M -80,${by(4)} C -40,${by(18)} 20,${by(20)} 68,${by(4)} L 70,${by(26)} L -80,${by(26)} Z`, shadow, 0.55);
    tone(o.inside, `M -62,-36 C -30,-44 10,-44 30,-46 C 10,-34 -30,-30 -66,-24 Z`, light, 0.5);
    tone(o.inside, `M -78,-10 C -76,10 -72,20 -64,${by(28)} L -56,${by(40)} C -66,20 -70,4 -70,-10 Z`, shadow, 0.35);
    if (belly) tone(o.inside, `M -40,${by(18)} C -10,${by(26)} 30,${by(24)} 50,${by(16)} L 50,${by(30)} L -40,${by(30)} Z`, belly, 0.85);
    if (muzzle) { const m = [[112, -64], [126, -56], [126, -44], [110, -42]].map((q) => tf([q[0], q[1], 0, 'h'])); tone(o.inside, curve(m), muzzle, 0.9); }
    // 下顎的線、肩和臀的肌肉線、蹄
    const jaw = [[96, -62], [104, -66], [110, -60], [108, -52]].map((q) => tf([q[0], q[1], 0, 'h']));
    fur(o.inside, curve(jaw, false), dark, 1.3, 0.6);
    fur(o.inside, `M 44,-30 C 52,-16 54,-2 50,10`, dark, 1.3, 0.4);
    fur(o.inside, `M -50,-30 C -40,-16 -40,0 -46,12`, dark, 1.3, 0.4);
    [[55, 68], [-52, -39]].forEach(([x0, x1]) => tone(o.inside, `M ${Math.min(x0, x1) - 4},${G - 7} L ${Math.max(x0, x1) + 4},${G - 7} L ${Math.max(x0, x1) + 4},${G + 2} L ${Math.min(x0, x1) - 4},${G + 2} Z`, '#2a1c12', 0.85));
    if (stripe) fur(o.inside, `M -74,-26 C -40,-36 0,-36 30,-44`, '#3a3632', 3, 0.5);
    o.top();
    // 鬃毛
    const crest = [[74, -94], [60, -76], [44, -56], [30, -46]].map((q, i) => tf(i < 3 ? [q[0], q[1], 0, 'n'] : [q[0], q[1], 0]));
    const poll = tf([86, -104, 0, 'h']);
    if (shortMane) {
      const mp = [poll, ...crest];
      for (let i = 0; i < mp.length - 1; i++) for (let k = 0; k < 4; k++) {
        const t = k / 4, x = S.lerp(mp[i][0], mp[i + 1][0], t), y = S.lerp(mp[i][1], mp[i + 1][1], t);
        fur(c, `M ${x.toFixed(1)},${y.toFixed(1)} l -4,-7`, mane, 2.6, 0.9);
      }
    } else {
      const outer = [poll, ...crest].map(([x, y], i) => [x - 6 - i * 1.5, y - 6 + i]);
      const inner = [...crest].reverse().map(([x, y]) => [x + 3, y + 4]);
      P(c, curve([[poll[0] + 2, poll[1] + 2], ...outer, ...inner]), mane, 'none', 0);
      P(c, curve([[poll[0] + 4, poll[1] - 2], [poll[0] + 14 * hk, poll[1] + 2], [poll[0] + 10 * hk, poll[1] + 8]]), mane, 'none', 0);
      for (let i = 0; i < 3; i++) fur(c, curve([...crest.slice(i, i + 2)].map(([x, y]) => [x - 4, y - 2 + i]), false), '#5a3a22', 1.2, 0.6);
    }
    const ey = tf([103, -86, 0, 'h']);
    shine(c, ey[0], ey[1], 3.4 * hk, '#2a1a10');
    fur(c, `M ${ey[0] - 4 * hk},${ey[1] - 4 * hk} C ${ey[0]},${ey[1] - 6 * hk} ${ey[0] + 4 * hk},${ey[1] - 5 * hk} ${ey[0] + 6 * hk},${ey[1] - 2 * hk}`, dark, 1.2, 0.8);
    const ns = tf([119, -54, 0, 'h']);
    el('ellipse', { cx: ns[0], cy: ns[1], rx: 2.4 * hk, ry: 1.6 * hk, fill: '#1e1410', transform: `rotate(40 ${ns[0]} ${ns[1]})` }, c);
    const mo = [[124, -48], [118, -47], [114, -48]].map((q) => tf([q[0], q[1], 0, 'h']));
    fur(c, curve(mo, false), '#2a1c12', 1.2, 0.9);
    c.ground = G;
    return c;
  };
  B3.donkey = (p) => B3.horse(p, { fill: '#9a948c', dark: '#4a4642', mane: '#3a3632', shadow: '#76716a', light: '#bdb8b0', leg: 0.85, neck: 0.8, head: 1.08, ears: 2.2, muzzle: '#ece6dc', tuft: true, belly: '#ddd8ce', shortMane: true, stripe: true });
  B3.mule = (p) => B3.horse(p, { fill: '#7a5a3e', dark: '#3e2a18', mane: '#2a1c12', shadow: '#5e432c', light: '#9c7a5a', leg: 0.95, neck: 0.9, head: 1.05, ears: 1.6, muzzle: '#cbb49a', tuft: false, belly: '#a88c70', shortMane: true });

  // ---------- 長頸鹿：脖子長度、角度可以改（set）；原點在身體中央，地面 y=150 ----------
  const GIR_LOW = [ // 從胸前（脖子前緣的根部）往下：前腳 → 腹部 → 後腳 → 尾根 → 斜斜的背 → 鬐甲
    [74, -12], [72, 2], [70, 12],
    [69, 24], [68, 50], [68, 66], [71, 74], [68, 84], [67, 120], [67, 134], [68, 140], [70, 145], [72, 150, 1], [59, 150, 1], [60, 144], [59, 136], [59, 120], [59, 86], [56, 76], [58, 66], [58, 40], [56, 22],
    [44, 20], [10, 24], [-24, 22],
    [-32, 26], [-36, 48], [-42, 70], [-44, 80], [-42, 92], [-41, 130], [-40, 140], [-39, 145], [-37, 150, 1], [-50, 150, 1], [-50, 144], [-51, 134], [-52, 96], [-56, 82], [-58, 70], [-62, 48], [-66, 24], [-68, 6],
    [-66, -8], [-58, -18], [-36, -28], [-8, -38], [16, -46], [34, -52],
  ];
  const GIR_HEAD = [[0, -1], [10, -8], [24, -9], [38, -6], [48, -1], [54, 5], [55, 11], [50, 15], [40, 15], [26, 17]];
  B3.giraffe = (p, { neck = 120, ang = 68, baby = false } = {}) => {
    const c = g(p), BASE = '#f2d9a4', SPOT = '#b9692c', SPOT2 = '#a65a22', EDGE = '#6e4420', MANE = '#8a4e22', SH = '#d1ad72', HI = '#fff0cc', HOOF = '#3a2a1e';
    const rnd = S.rng(baby ? 5 : 3);
    // 尾巴（細長，末端有黑色毛簇）
    fur(c, 'M -66,-6 C -74,10 -78,40 -76,70', EDGE, 3, 1);
    P(c, curve([[-76, 66], [-72, 74], [-73, 88], [-77, 92], [-81, 86], [-80, 72]]), '#2a1e14', 'none', 0);
    // 遠側的腳
    P(c, curve([[60, 16], [59, 50], [59, 66], [62, 74], [59, 84], [58, 120], [58, 134], [59, 140], [61, 145], [63, 150, 1], [50, 150, 1], [51, 144], [50, 136], [50, 120], [50, 86], [47, 76], [49, 66], [49, 40], [48, 20]]), SH, EDGE, 1.4);
    P(c, curve([[-22, 26], [-26, 48], [-32, 70], [-34, 80], [-32, 92], [-31, 130], [-30, 140], [-29, 145], [-27, 150, 1], [-40, 150, 1], [-40, 144], [-41, 134], [-42, 96], [-46, 82], [-48, 70], [-52, 48], [-56, 24]]), SH, EDGE, 1.4);
    [[55, 148], [-34, 148]].forEach(([x, y]) => el('rect', { x: x - 6, y: y - 6, width: 13, height: 8, rx: 2, fill: HOOF }, c));
    const sil = el('path', { d: '' }, c);
    sil.setAttribute('fill', BASE);
    const id = nid('gc');
    const cp = el('path', { d: '' }, el('clipPath', { id }, el('defs', {}, c)));
    const inside = g(c, { 'clip-path': `url(#${id})` });
    // 身體上的網狀斑塊（固定）＋脖子上的斑塊（隨脖子移動）
    const patch = (cx, cy, s, seed) => { const r = S.rng(seed); let d = ''; for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283 + r() * 0.5; const rr = s * (0.78 + r() * 0.3); d += `${k ? 'L' : 'M'} ${(cx + Math.cos(a) * rr * 1.12).toFixed(1)},${(cy + Math.sin(a) * rr * 0.92).toFixed(1)} `; } return d + 'Z'; };
    let k0 = 1;
    for (let yy = -54; yy < 66; yy += 17) for (let xx = -72; xx < 84; xx += 19) {
      const cx = xx + (Math.round((yy + 54) / 17) % 2 ? 9 : 0) + rnd() * 3, cy = yy + rnd() * 3;
      if (cy > 26 && Math.abs(cx - 64) > 10 && Math.abs(cx + 45) > 12) continue; // 腿上只到膝蓋上方
      el('path', { d: patch(cx, cy, 7.2, k0++), fill: (k0 % 3) ? SPOT : SPOT2 }, inside);
    }
    const nspots = Array.from({ length: 54 }, (_, i) => el('path', { d: '', fill: i % 3 ? SPOT : SPOT2 }, inside));
    const shadowP = el('path', { d: '', fill: SH, opacity: 0.55 }, inside);
    const muzzleP = el('path', { d: '', fill: '#e2bf86', opacity: 0.75 }, inside);
    tone(inside, 'M -70,10 C -40,26 20,28 74,10 L 76,34 L -70,34 Z', SH, 0.55);
    tone(inside, 'M -62,-20 C -36,-32 0,-42 32,-52 C 10,-38 -30,-24 -64,-12 Z', HI, 0.5);
    [[64, 74], [-48, 80]].forEach(([x, y]) => fur(inside, `M ${x - 6},${y} C ${x - 2},${y - 3} ${x + 2},${y - 3} ${x + 6},${y}`, EDGE, 1.2, 0.6));
    const top = el('path', { d: '', fill: 'none', stroke: EDGE, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, c);
    [[66, 148], [-44, 148]].forEach(([x, y]) => el('rect', { x: x - 6.5, y: y - 6, width: 13, height: 8, rx: 2, fill: HOOF }, c));
    const maneG = el('path', { d: '', fill: 'none', stroke: MANE, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, c);
    // 頭上的小東西（耳朵、皮骨角、眼、鼻孔、嘴）
    const hg = g(c);
    const ear = P(hg, '', BASE, EDGE, 1.4);
    const earIn = P(hg, '', '#d9a07a', 'none', 0);
    const oss = [0, 1].map(() => [P(hg, '', '#c99a5e', EDGE, 1.2), el('circle', { r: 3.2, fill: '#2a1e14' }, hg)]);
    const eyeG = g(hg);
    const Bb = [40, -50], Bf = [74, -12];
    function set(L, deg) {
      const a = (deg * Math.PI) / 180, ux = Math.cos(a), uy = -Math.sin(a), nx = Math.sin(a), ny = Math.cos(a);
      const mx = (Bb[0] + Bf[0]) / 2, my = (Bb[1] + Bf[1]) / 2, tx = mx + ux * L, ty = my + uy * L;
      const hw = baby ? 10 : 9;
      const Tb = [tx - nx * hw, ty - ny * hw], Tf = [tx + nx * hw, ty + ny * hw];
      const hr = Math.max(18, 100 - deg), hs = baby ? 1.15 : 1;
      const O = [Tb[0] + nx * 1, Tb[1] + ny * 1];
      const H = ([x, y]) => { const [rx, ry] = rot(x * hs, y * hs, hr); return [O[0] + rx, O[1] + ry]; };
      const backEdge = [Bb, [Bb[0] + ux * L * 0.4 + nx * 3, Bb[1] + uy * L * 0.4 + ny * 3], [Tb[0] - ux * 6, Tb[1] - uy * 6]];
      const J = H([12, 20]); // 下顎後方：脖子前緣從這裡往下接到胸前
      const frontEdge = [J, [(J[0] + Bf[0]) / 2 + nx * 1.5, (J[1] + Bf[1]) / 2 + ny * 1.5]];
      const pts = [...GIR_LOW, ...backEdge, ...GIR_HEAD.map(H), ...frontEdge];
      const d = curve(pts);
      sil.setAttribute('d', d); cp.setAttribute('d', d); top.setAttribute('d', d);
      shadowP.setAttribute('d', `M ${Bf[0] + 4},${Bf[1]} L ${Tf[0] + nx * 4},${Tf[1] + ny * 4} L ${Tf[0] - nx * 5},${Tf[1] - ny * 5} L ${Bf[0] - nx * 10},${Bf[1] - ny * 10} Z`);
      maneG.setAttribute('d', curve([[Bb[0] + nx * 1.5, Bb[1] + ny * 1.5], [Bb[0] + ux * L * 0.4 + nx * 4.5, Bb[1] + uy * L * 0.4 + ny * 4.5], [Tb[0] - ux * 7 + nx * 2.5, Tb[1] - uy * 7 + ny * 2.5]], false));
      // 脖子上的斑塊：沿著脖子排三列
      nspots.forEach((s, i) => {
        const row = Math.floor(i / 3), col = i % 3, t = 0.06 + row * (15 / Math.max(L, 1));
        if (t > 1 - 22 / Math.max(L, 30)) { s.setAttribute('d', ''); return; } // 頭的附近不畫脖子的斑塊
        const w = S.lerp(44, 18, t), side = (col - 1) * 0.36 + (row % 2 ? 0.12 : -0.12);
        const cx = mx + ux * L * t + nx * w * side, cy = my + uy * L * t + ny * w * side;
        s.setAttribute('d', patch(cx, cy, S.lerp(7, 4.6, t), 200 + i));
      });
      // 頭部的零件
      const [ox, oy] = O, R = (x, y) => H([x, y]);
      const up = rot(0, -1, -hr), bk = rot(-1, 0, -hr);
      const e0 = R(4, -4);
      const tip = [e0[0] + (bk[0] * 24 + up[0] * 7) * hs, e0[1] + (bk[1] * 24 + up[1] * 7) * hs];
      const eb = [e0[0] + up[0] * 7 * hs, e0[1] + up[1] * 7 * hs];
      ear.setAttribute('d', curve([[e0[0], e0[1]], [eb[0], eb[1]], [tip[0], tip[1], 1]]));
      earIn.setAttribute('d', curve([[e0[0] + bk[0] * 3, e0[1] + bk[1] * 3], [eb[0] + bk[0] * 3 - up[0], eb[1] + bk[1] * 3 - up[1]], [tip[0] - bk[0] * 4, tip[1] - bk[1] * 4, 1]]));
      [[8, -8], [15, -9]].forEach(([x, y], k) => {
        const b = R(x, y), L2 = (baby ? 9 : 13) * hs;
        const t2 = [b[0] + up[0] * L2 - bk[0] * 1.5, b[1] + up[1] * L2 - bk[1] * 1.5];
        oss[k][0].setAttribute('d', `M ${(b[0] - bk[0] * 3).toFixed(1)},${(b[1] - bk[1] * 3).toFixed(1)} L ${(t2[0] - bk[0] * 1.6).toFixed(1)},${(t2[1] - bk[1] * 1.6).toFixed(1)} L ${(t2[0] + bk[0] * 1.6).toFixed(1)},${(t2[1] + bk[1] * 1.6).toFixed(1)} L ${(b[0] + bk[0] * 3).toFixed(1)},${(b[1] + bk[1] * 3).toFixed(1)} Z`);
        oss[k][1].setAttribute('cx', t2[0].toFixed(1)); oss[k][1].setAttribute('cy', t2[1].toFixed(1));
      });
      eyeG.innerHTML = '';
      const ey = R(22, -1);
      shine(eyeG, ey[0], ey[1], (baby ? 4.2 : 3.6) * hs, '#2a1a10');
      const l1 = R(17, -5), l2 = R(27, -5);
      fur(eyeG, `M ${l1[0].toFixed(1)},${l1[1].toFixed(1)} Q ${R(22, -8)[0].toFixed(1)},${R(22, -8)[1].toFixed(1)} ${l2[0].toFixed(1)},${l2[1].toFixed(1)}`, EDGE, 1.2, 0.9);
      const ns = R(47, 2);
      el('ellipse', { cx: ns[0].toFixed(1), cy: ns[1].toFixed(1), rx: 2.2, ry: 1.4, fill: '#4a2e18' }, eyeG);
      const m1 = R(54, 10), m2 = R(44, 11);
      fur(eyeG, `M ${m1[0].toFixed(1)},${m1[1].toFixed(1)} L ${m2[0].toFixed(1)},${m2[1].toFixed(1)}`, EDGE, 1.2, 0.9);
      muzzleP.setAttribute('d', curve([R(44, -3), R(53, 3), R(55, 11), R(46, 14), R(40, 6)]));
    }
    set(neck, ang);
    c.set = set;
    return c;
  };

  // ---------- 馬的前腳骨（趾數）：toes = 4 | 3 | '3s'（中趾大、側趾短）| 1；寬約 70、高約 150 ----------
  B3.foot = (p, toes) => {
    const c = g(p), BONE = '#ece2c8', EDGE = '#9a8c6a', HOOF = '#5a4636';
    P(c, 'M -26,-74 L 26,-74 C 30,-74 32,-70 30,-62 L 26,-54 L -26,-54 L -30,-62 C -32,-70 -30,-74 -26,-74 Z', BONE, EDGE, 2);
    const digit = (x0, x1, len, w, ground = true) => {
      // 掌骨＋三節趾骨＋蹄
      const y0 = -52, y1 = y0 + len * 0.55;
      P(c, `M ${x0 - w / 2},${y0} L ${x0 + w / 2},${y0} L ${x1 + w / 2 - 1},${y1} L ${x1 - w / 2 + 1},${y1} Z`, BONE, EDGE, 1.6);
      let y = y1 + 3;
      [0.18, 0.13, 0.1].forEach((f, i) => {
        const h = len * f;
        el('rect', { x: x1 - w / 2 + 1 + i, y, width: w - 2 - i * 2, height: h - 2, rx: 3, fill: BONE, stroke: EDGE, 'stroke-width': 1.6 }, c);
        y += h;
      });
      if (ground || len > 100) P(c, `M ${x1 - w / 2 - 1},${y} L ${x1 + w / 2 + 1},${y} L ${x1 + w / 2 + 3},${y + 8} L ${x1 - w / 2 - 3},${y + 8} Z`, HOOF, 'none', 0);
      return y + 8;
    };
    if (toes === 4) { [[-21, -27], [-7, -9], [7, 9], [21, 25]].forEach(([a, b], i) => digit(a, b, i === 0 ? 112 : 122, 11)); }
    else if (toes === 3) { digit(-16, -22, 120, 12); digit(16, 22, 120, 12); digit(0, 0, 128, 15); }
    else if (toes === '3s') { digit(-15, -18, 84, 9, false); digit(15, 18, 84, 9, false); digit(0, 0, 132, 18); }
    else { P(c, 'M -14,-52 L -9,-52 L -11,-10 Z', BONE, EDGE, 1.4); P(c, 'M 14,-52 L 9,-52 L 11,-10 Z', BONE, EDGE, 1.4); digit(0, 0, 132, 20); }
    return c;
  };

  // ---------- 金合歡樹（給長頸鹿吃）：樹冠在 y = top 附近 ----------
  B3.acacia = (p, { top = -300, w = 220, leaves = true } = {}) => {
    const c = g(p);
    P(c, `M -10,0 C -8,${top * 0.4} -4,${top * 0.7} -2,${top + 30} L 6,${top + 30} C 8,${top * 0.7} 12,${top * 0.4} 14,0 Z`, '#7a5636', '#5a3e26', 2);
    line(c, `M 2,${top * 0.62} C -20,${top * 0.75} -50,${top * 0.85} -${w * 0.32},${top + 10}`, '#6a4a2e', 7);
    line(c, `M 4,${top * 0.68} C 30,${top * 0.8} 60,${top * 0.88} ${w * 0.34},${top + 12}`, '#6a4a2e', 7);
    const crown = g(c);
    if (leaves) [[-w * 0.3, top, w * 0.3], [w * 0.05, top - 14, w * 0.34], [w * 0.32, top + 2, w * 0.28]].forEach(([x, y, r]) => {
      el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.32, fill: '#4f8f3a', stroke: '#2f6a2a', 'stroke-width': 2 }, crown);
      el('ellipse', { cx: x - r * 0.15, cy: y - r * 0.08, rx: r * 0.7, ry: r * 0.18, fill: '#6fae4a', opacity: 0.8 }, crown);
    });
    c.crown = crown;
    return c;
  };

  // ---------- 樺尺蛾（停在樹幹上、翅膀平攤，俯視）寬約 80 ----------
  B3.moth = (p, dark = false) => {
    const c = g(p);
    const base = dark ? '#2b2926' : '#e8e3d4', fleck = dark ? '#57534c' : '#2e2c28', edge = dark ? '#151412' : '#8c877a';
    [-1, 1].forEach((s) => {
      P(c, `M 0,4 C ${s * 12},6 ${s * 24},12 ${s * 26},20 C ${s * 16},23 ${s * 6},20 0,14 Z`, base, edge, 1.2);
      P(c, `M 0,-10 C ${s * 14},-11 ${s * 32},-5 ${s * 40},8 C ${s * 30},13 ${s * 15},14 0,12 Z`, base, edge, 1.2);
    });
    const r = S.rng(dark ? 9 : 4);
    for (let i = 0; i < (dark ? 10 : 34); i++) {
      const s = r() < 0.5 ? -1 : 1, t = r(), u = r();
      const x = s * (4 + t * 30), y = -8 + u * 18 + t * 6;
      el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: 1.1 + r() * 1.2, ry: 0.8 + r() * 0.6, fill: fleck, transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }, c);
    }
    if (!dark) [-1, 1].forEach((s) => line(c, `M ${s * 6},-4 C ${s * 14},-2 ${s * 22},2 ${s * 32},6`, '#4a4740', 1, { opacity: 0.7 }));
    el('ellipse', { cx: 0, cy: 2, rx: 3.6, ry: 12, fill: dark ? '#1e1d1b' : '#cfc9b8', stroke: edge, 'stroke-width': 1 }, c);
    el('circle', { cx: 0, cy: -11, r: 3, fill: dark ? '#1e1d1b' : '#bdb6a3' }, c);
    [-1, 1].forEach((s) => line(c, `M ${s * 1.5},-13 C ${s * 4},-20 ${s * 9},-23 ${s * 13},-24`, dark ? '#3a3834' : '#6a665c', 1.3));
    return c;
  };

  // ---------- 大山雀（飛行，側面）：setFlap(f) f=1 翅膀向上、-1 向下 ----------
  B3.tit = (p) => {
    const c = g(p);
    const wingBack = S.place(g(c), { x: 4, y: -8 });
    const wb = P(wingBack, 'M -8,0 C -14,-26 -4,-44 14,-50 C 16,-36 14,-16 10,0 Z', '#4e6070', '#2e3a46', 1.5);
    P(c, 'M -30,0 L -54,-6 L -54,6 L -30,6 Z', '#56677a', '#2e3a46', 1.5);
    P(c, 'M -32,2 C -26,-14 0,-18 18,-12 C 30,-8 34,4 26,10 C 14,18 -14,14 -32,2 Z', '#efd04e', '#8a7a2a', 1.5);
    P(c, 'M -30,0 C -24,-12 -2,-17 16,-12 C 6,-8 -14,-4 -30,0 Z', '#8a9a5a', 'none', 0);
    line(c, 'M 30,2 C 18,8 6,12 -6,13', '#1d1d1d', 4);
    el('circle', { cx: 28, cy: -12, r: 11, fill: '#1d1d1d' }, c);
    el('ellipse', { cx: 30, cy: -8.5, rx: 6.5, ry: 4.6, fill: '#f6f4ee' }, c);
    P(c, 'M 38,-14 L 46,-12 L 38,-9 Z', '#3a3a3a', 'none', 0);
    el('circle', { cx: 33, cy: -14.5, r: 1.8, fill: '#fff' }, c);
    const wingFront = S.place(g(c), { x: 0, y: -8 });
    const wf = P(wingFront, 'M -8,0 C -14,-26 -4,-44 14,-50 C 16,-36 14,-16 10,0 Z', '#5f7486', '#2e3a46', 1.5);
    [wb, wf].forEach((w) => line(w.parentNode, 'M 0,-6 L 6,-40', '#e8eef2', 1.4, { opacity: 0.7 }));
    c.setFlap = (f) => { const sy = f.toFixed(3); wingBack.setAttribute('transform', `translate(4,-8) scale(1,${sy})`); wingFront.setAttribute('transform', `translate(0,-8) scale(1,${sy})`); };
    return c;
  };

  // ---------- 化石：三葉蟲（俯視，頭朝上）約 90 × 110 ----------
  B3.trilobite = (p, { fill = '#6b5d49', hi = '#a8987a', edge = '#3e3428' } = {}) => {
    const c = g(p);
    P(c, 'M -40,-26 C -42,-52 -18,-58 0,-58 C 18,-58 42,-52 40,-26 L 46,-6 L 34,-20 L -34,-20 L -46,-6 Z', fill, edge, 2);
    el('ellipse', { cx: 0, cy: -38, rx: 10, ry: 15, fill: hi, stroke: edge, 'stroke-width': 1.5 }, c);
    [-1, 1].forEach((s) => P(c, `M ${s * 16},-40 C ${s * 26},-44 ${s * 28},-32 ${s * 22},-28 C ${s * 20},-32 ${s * 18},-36 ${s * 16},-40 Z`, '#3a3024', 'none', 0));
    for (let i = 0; i < 9; i++) {
      const y = -20 + i * 5.6, hw = 36 - i * 1.3;
      P(c, `M ${-hw},${y} L ${hw},${y} L ${hw - 2},${y + 5.2} L ${-hw + 2},${y + 5.2} Z`, fill, edge, 1.3);
      el('rect', { x: -8, y: y + 0.4, width: 16, height: 4.6, rx: 2, fill: hi, stroke: edge, 'stroke-width': 1 }, c);
    }
    P(c, 'M -24,30 C -24,48 24,48 24,30 Z', fill, edge, 1.6);
    el('ellipse', { cx: 0, cy: 36, rx: 6, ry: 7, fill: hi }, c);
    return c;
  };

  // ---------- 化石：菊石（螺旋殼＋肋紋）半徑約 44 ----------
  B3.ammonite = (p, { fill = '#a8875a', edge = '#5e4428', hi = '#cdb187' } = {}) => {
    const c = g(p);
    el('circle', { cx: 0, cy: 0, r: 44, fill, stroke: edge, 'stroke-width': 2.5 }, c);
    let d = '';
    for (let i = 0; i <= 120; i++) { const t = (i / 120) * 3 * Math.PI, r = 44 * Math.exp(-0.21 * t); d += `${i ? 'L' : 'M'} ${(Math.cos(t + 1.2) * r).toFixed(1)},${(Math.sin(t + 1.2) * r).toFixed(1)} `; }
    line(c, d, edge, 2.2);
    for (let i = 0; i < 46; i++) {
      const t = (i / 46) * 2 * Math.PI, r1 = 44 * Math.exp(-0.21 * 2 * Math.PI) + 1, r2 = 43;
      const t2 = t + 1.2;
      line(c, `M ${(Math.cos(t2) * r1).toFixed(1)},${(Math.sin(t2) * r1).toFixed(1)} L ${(Math.cos(t2 + 0.08) * r2).toFixed(1)},${(Math.sin(t2 + 0.08) * r2).toFixed(1)}`, edge, 1.3, { opacity: 0.8 });
    }
    el('ellipse', { cx: -12, cy: -16, rx: 16, ry: 9, fill: hi, opacity: 0.35, transform: 'rotate(-30 -12 -16)' }, c);
    return c;
  };

  // ---------- 化石：琥珀裡的昆蟲 ----------
  B3.amber = (p) => {
    const c = g(p);
    const id = nid('am');
    const gr = el('radialGradient', { id, cx: 0.4, cy: 0.35, r: 0.7 }, el('defs', {}, c));
    el('stop', { offset: 0, 'stop-color': '#ffd27a' }, gr); el('stop', { offset: 1, 'stop-color': '#c9741c' }, gr);
    P(c, 'M -44,-22 C -24,-48 30,-46 44,-16 C 56,12 32,42 -6,42 C -40,42 -62,8 -44,-22 Z', `url(#${id})`, '#8a4a10', 2.5);
    const ant = S.place(g(c, { opacity: 0.88 }), { x: 0, y: 2, r: -12 });
    const A = '#3a1e0c';
    [[-8, -1], [0, -1], [8, -1]].forEach(([x], i) => [-1, 1].forEach((s) => line(ant, `M ${x},0 L ${x + (i - 1) * 6},${s * 8} L ${x + (i - 1) * 10},${s * 15}`, A, 1.6)));
    el('ellipse', { cx: -16, cy: 0, rx: 9, ry: 6.5, fill: A }, ant);
    el('ellipse', { cx: 0, cy: 0, rx: 7, ry: 3.5, fill: A }, ant);
    el('ellipse', { cx: 13, cy: 0, rx: 5.5, ry: 5, fill: A }, ant);
    [-1, 1].forEach((s) => line(ant, `M 17,${s * 2} L 22,${s * 8} L 27,${s * 7}`, A, 1.4));
    P(c, 'M -30,-26 C -18,-36 0,-38 12,-34', 'none', '#fff2c8', 3, { opacity: 0.55 });
    return c;
  };

  // ---------- 化石：恐龍足跡（三趾）----------
  B3.footprint = (p, s = 1) => {
    const c = S.place(g(p), { s });
    const F = '#3e352c', R = '#a8977c';
    [-34, 0, 34].forEach((deg) => {
      const a = ((deg - 90) * Math.PI) / 180, cx = Math.cos(a) * 26, cy = 4 + Math.sin(a) * 26, tx = Math.cos(a) * 46, ty = 4 + Math.sin(a) * 46;
      el('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: 17, ry: 6.5, fill: F, stroke: R, 'stroke-width': 2, transform: `rotate(${deg - 90} ${cx.toFixed(1)} ${cy.toFixed(1)})` }, c);
      P(c, `M ${(tx - Math.sin(a) * 4).toFixed(1)},${(ty + Math.cos(a) * 4).toFixed(1)} L ${(tx + Math.cos(a) * 8).toFixed(1)},${(ty + Math.sin(a) * 8).toFixed(1)} L ${(tx + Math.sin(a) * 4).toFixed(1)},${(ty - Math.cos(a) * 4).toFixed(1)} Z`, F, 'none', 0);
    });
    el('ellipse', { cx: 0, cy: 8, rx: 12, ry: 10, fill: F, stroke: R, 'stroke-width': 2 }, c);
    return c;
  };

  // ---------- 化石：爬痕（兩列刮痕沿著彎曲的路線）----------
  B3.trail = (p, len = 220) => {
    const c = g(p);
    const pt = (t) => [(-len / 2 + t * len), Math.sin(t * Math.PI * 1.4) * 14];
    let d = '';
    for (let i = 0; i <= 40; i++) { const [x, y] = pt(i / 40); d += `${i ? 'L' : 'M'} ${x.toFixed(1)},${y.toFixed(1)} `; }
    line(c, d, '#a8977c', 26); line(c, d, '#3e352c', 22);
    line(c, d, '#5a4e40', 2);
    for (let i = 1; i < 30; i++) {
      const t = i / 30, [x, y] = pt(t), [x2, y2] = pt(t + 0.01);
      const a = Math.atan2(y2 - y, x2 - x), cx = Math.cos(a), cy = Math.sin(a);
      [-1, 1].forEach((s) => line(c, `M ${(x - cy * s * 2).toFixed(1)},${(y + cx * s * 2).toFixed(1)} L ${(x - cy * s * 9 - cx * 6).toFixed(1)},${(y + cx * s * 9 - cy * 6).toFixed(1)}`, '#8a7a62', 1.8));
    }
    return c;
  };

  // ---------- 魚骨（化石形成用）面向右，約 160 寬 ----------
  B3.fishBones = (p, col = '#efe6cc', wk = 1) => {
    const c = g(p);
    line(c, 'M -62,2 C -30,-4 20,-4 46,0', col, 4 * wk);
    for (let i = 0; i < 11; i++) { const x = -48 + i * 8.6; line(c, `M ${x},-1 C ${x + 2},-12 ${x - 2},-20 ${x - 6},-24`, col, 2.2 * wk); if (i > 1 && i < 9) line(c, `M ${x},1 C ${x + 2},12 ${x - 2},18 ${x - 6},22`, col, 2.2 * wk); }
    P(c, 'M 44,-14 C 60,-16 72,-6 72,2 C 72,10 62,16 48,14 C 40,8 40,-8 44,-14 Z', 'none', col, 2.6 * wk);
    el('circle', { cx: 58, cy: -4, r: 4.5, fill: 'none', stroke: col, 'stroke-width': 2 * wk }, c);
    [[-62, 2, -80, -16], [-62, 2, -82, 0], [-62, 2, -80, 18]].forEach(([x1, y1, x2, y2]) => line(c, `M ${x1},${y1} L ${x2},${y2}`, col, 2 * wk));
    return c;
  };

  // ---------- 魚（吳郭魚）約 150 × 90 ----------
  B3.fish = (p, { fill = '#8a9a90', dark = '#56645c', belly = '#cfd8cc', bars = true } = {}) => {
    const c = g(p);
    P(c, 'M -46,-20 C -40,-40 -10,-50 6,-48 L 4,-44 C 14,-46 24,-42 30,-30 Z', '#6f7f76', dark, 1.5);
    for (let i = 0; i < 6; i++) line(c, `M ${-36 + i * 11},${-28 - i * 1.5} L ${-40 + i * 11},${-44 + Math.abs(i - 3)}`, dark, 1.2, { opacity: 0.7 });
    P(c, 'M -54,0 L -80,-26 C -84,-10 -84,10 -80,26 Z', '#7a8a80', dark, 1.6);
    P(c, 'M -30,22 C -22,36 -2,38 6,28 Z', '#7a8a80', dark, 1.5);
    P(c, 'M -58,0 C -44,-28 6,-38 36,-26 C 52,-18 62,-8 62,2 C 60,12 50,20 34,26 C 6,34 -38,28 -58,0 Z', fill, dark, 2);
    P(c, 'M -50,8 C -30,24 10,30 34,24 C 46,20 54,14 58,8 C 40,14 0,18 -50,8 Z', belly, 'none', 0, { opacity: 0.9 });
    if (bars) for (let i = 0; i < 5; i++) line(c, `M ${-34 + i * 13},${-20 + Math.abs(i - 2) * 2} C ${-36 + i * 13},-4 ${-36 + i * 13},8 ${-38 + i * 13},${18 - Math.abs(i - 2)}`, dark, 3, { opacity: 0.35 });
    line(c, 'M 30,-20 C 22,-6 22,10 30,22', dark, 2);
    P(c, 'M 22,4 C 10,8 4,18 6,22 C 14,20 22,14 22,4 Z', '#9aa9a0', dark, 1.3);
    eye(c, 46, -8, 4.6, '#20262a');
    el('circle', { cx: 46, cy: -8, r: 6.4, fill: 'none', stroke: '#e8d090', 'stroke-width': 1.5 }, c);
    line(c, 'M 62,2 L 56,4', dark, 2);
    return c;
  };

  // ---------- 青蛙（坐姿）約 130 × 90 ----------
  B3.frog = (p, { fill = '#6aa84f', dark = '#2f6a2a', belly = '#e3ebbd', spot = '#3c7a30' } = {}) => {
    const c = g(p);
    // 後腳：小腿和長長的蹼足（貼在地上、往前伸），在身體下面
    P(c, 'M 4,32 C -14,40 -34,42 -50,38 L -48,31 C -32,33 -14,31 2,26 Z', fill, dark, 1.8);
    P(c, 'M -50,38 C -30,41 -10,41 6,39 L 24,34 L 17,41 L 28,42 L 15,45 L 22,49 L 3,46 C -16,46 -36,46 -52,43 Z', fill, dark, 1.8);
    line(c, 'M 6,40 L 21,36 M 6,42 L 25,43 M 5,44 L 19,48', dark, 1, { opacity: 0.6 });
    // 身體＋頭（坐姿：頭抬高，背往後斜到臀部）
    P(c, 'M -52,28 C -58,14 -50,-2 -34,-8 C -20,-14 -4,-16 10,-20 C 22,-24 34,-28 46,-22 C 56,-16 64,-8 64,-2 C 62,4 56,8 48,10 C 36,14 26,20 16,26 C 0,34 -30,38 -52,28 Z', fill, dark, 2);
    P(c, 'M 48,10 C 36,14 26,20 16,26 C 4,32 -18,36 -36,34 C -16,30 4,22 18,16 C 30,11 40,9 48,10 Z', belly, 'none', 0);
    line(c, 'M 26,-20 C 6,-14 -18,-8 -40,4', '#a9d886', 2.2, { opacity: 0.8 });
    [[-6, -8, 4.5], [-24, -2, 4], [8, -12, 3.5], [-38, 8, 3.5], [-14, 6, 3]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: r * 1.3, ry: r, fill: spot }, c));
    // 大腿（摺起來，在身體側面）
    el('ellipse', { cx: -22, cy: 16, rx: 25, ry: 13, fill, stroke: dark, 'stroke-width': 2, transform: 'rotate(22 -22 16)' }, c);
    [[-30, 10, 3.5], [-16, 18, 3], [-6, 24, 2.6]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: r * 1.3, ry: r, fill: spot }, c));
    // 前腳：短短的，指頭張開
    P(c, 'M 25,13 C 29,21 31,29 31,37 L 37,38 C 35,30 35,21 33,12 Z', fill, dark, 1.6);
    line(c, 'M 32,38 L 25,42 M 34,38 L 34,44 M 36,38 L 42,42', dark, 1.8);
    // 鼓膜、眼睛（凸在頭頂）、鼻孔、寬寬的嘴
    el('circle', { cx: 23, cy: -9, r: 6.5, fill: '#5e9a44', stroke: dark, 'stroke-width': 1.5 }, c);
    el('circle', { cx: 38, cy: -26, r: 10, fill, stroke: dark, 'stroke-width': 2 }, c);
    el('circle', { cx: 39, cy: -27, r: 6.6, fill: '#d4b03c' }, c);
    el('ellipse', { cx: 39, cy: -27, rx: 5, ry: 2.4, fill: '#1a1410' }, c);
    el('circle', { cx: 41, cy: -29, r: 1.4, fill: '#fff' }, c);
    el('circle', { cx: 57, cy: -11, r: 1.4, fill: dark }, c);
    line(c, 'M 63,0 C 52,5 38,5 24,0', dark, 2);
    return c;
  };

  // ---------- 骨頭（長骨，兩端有關節的突起）長約 120 ----------
  B3.bone = (p, { col = '#e3d6b4', edge = '#7a6a4a' } = {}) => {
    const c = g(p);
    const shaft = 'M -46,-7 C -20,-3 18,-11 46,-6 L 46,7 C 18,3 -20,11 -46,8 Z';
    const knobs = [[-52, -8, 10], [-53, 9, 9], [52, -8, 9], [53, 8, 10]];
    P(c, shaft, edge, edge, 4); knobs.forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r: r + 2, fill: edge }, c));
    P(c, shaft, col, 'none', 0); knobs.forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: col }, c));
    line(c, 'M -40,-2 C -14,0 14,-6 40,-2', '#fff7e0', 2, { opacity: 0.5 });
    return c;
  };

  // ---------- 麻雀（停在樹枝上）約 100 × 90 ----------
  B3.sparrow = (p) => {
    const c = g(p);
    line(c, 'M -60,42 L 60,42', '#7a5636', 6);
    line(c, 'M -4,22 L -6,40 M -6,40 L -12,44 M -6,40 L 0,44', '#8a6a52', 2);
    line(c, 'M 6,22 L 6,40 M 6,40 L 0,44 M 6,40 L 12,44', '#8a6a52', 2);
    P(c, 'M -26,8 L -54,26 L -48,32 L -20,16 Z', '#5e4630', '#3a2a1a', 1.4);
    P(c, 'M -30,8 C -32,-10 -14,-22 6,-22 C 24,-22 32,-10 30,4 C 28,18 12,26 -6,26 C -20,26 -30,20 -30,8 Z', '#d6cbb8', '#6a5a46', 1.6);
    P(c, 'M -30,4 C -24,-14 0,-18 16,-10 C 12,6 -4,16 -30,14 Z', '#9a6a3e', '#5a3e22', 1.4);
    [['M -22,0 L -2,-8', 2.2], ['M -24,6 L 0,0', 2.2], ['M -20,11 L 2,5', 2]].forEach(([d, w]) => line(c, d, '#2e2218', w));
    line(c, 'M -12,-10 L 8,-14', '#f2ece0', 2.4);
    el('circle', { cx: 22, cy: -24, r: 14, fill: '#f2ede2', stroke: '#6a5a46', 'stroke-width': 1.5 }, c);
    P(c, 'M 8,-26 C 8,-40 34,-42 36,-26 C 28,-30 16,-30 8,-26 Z', '#8a4a26', 'none', 0);
    el('ellipse', { cx: 21, cy: -19, rx: 3.6, ry: 3.2, fill: '#1e1a16' }, c);
    P(c, 'M 30,-14 C 34,-12 34,-6 30,-4 C 26,-6 26,-12 30,-14 Z', '#1e1a16', 'none', 0);
    P(c, 'M 34,-26 L 45,-23 L 34,-19 Z', '#2a2622', 'none', 0);
    eye(c, 29, -27, 2.4);
    return c;
  };

  // ---------- 蝴蝶（紋白蝶，俯視）寬約 130 ----------
  B3.butterfly = (p, { fill = '#f4f1e4', edge = '#8f8a78', tip = '#2a2824' } = {}) => {
    const c = g(p);
    [-1, 1].forEach((s) => {
      P(c, `M 0,8 C ${s * 26},4 ${s * 50},16 ${s * 46},36 C ${s * 32},46 ${s * 10},32 0,14 Z`, fill, edge, 1.6);
      P(c, `M 0,-2 C ${s * 10},-30 ${s * 40},-46 ${s * 60},-40 C ${s * 64},-22 ${s * 48},-2 ${s * 4},6 Z`, fill, edge, 1.6);
      P(c, `M ${s * 46},-43 C ${s * 56},-44 ${s * 63},-40 ${s * 61},-30 C ${s * 56},-34 ${s * 50},-38 ${s * 46},-43 Z`, tip, 'none', 0);
      el('circle', { cx: s * 32, cy: -16, r: 4.5, fill: tip }, c);
      line(c, `M ${s * 3},-2 L ${s * 40},-34 M ${s * 3},2 L ${s * 46},-20 M ${s * 3},10 L ${s * 34},30`, '#c9c3ae', 1, { opacity: 0.8 });
    });
    el('ellipse', { cx: 0, cy: 8, rx: 4.5, ry: 22, fill: '#3a3a34' }, c);
    el('circle', { cx: 0, cy: -16, r: 4.5, fill: '#3a3a34' }, c);
    [-1, 1].forEach((s) => { line(c, `M ${s * 2},-19 C ${s * 6},-30 ${s * 10},-38 ${s * 14},-44`, '#3a3a34', 1.6); el('ellipse', { cx: s * 14.5, cy: -45, rx: 2.2, ry: 3, fill: '#3a3a34' }, c); });
    return c;
  };

  // ---------- 蝸牛 約 130 × 80 ----------
  B3.snail = (p) => {
    const c = g(p);
    const BODY = '#cdbb9e', EDGE = '#8a765a';
    P(c, 'M -56,32 C -46,24 10,22 36,16 C 48,12 54,2 58,-8 C 62,-12 70,-10 70,-4 C 70,12 60,28 40,34 L -56,36 C -62,36 -62,32 -56,32 Z', BODY, EDGE, 2);
    [[60, -8, 66, -40], [64, -6, 82, -32]].forEach(([x1, y1, x2, y2]) => { line(c, `M ${x1},${y1} L ${x2},${y2}`, BODY, 4.5); el('circle', { cx: x2, cy: y2, r: 3.4, fill: '#3a2e22' }, c); });
    line(c, 'M 66,2 L 76,6 M 66,6 L 74,12', EDGE, 3);
    el('circle', { cx: -8, cy: -10, r: 38, fill: '#b5793f', stroke: '#6a4220', 'stroke-width': 2.5 }, c);
    let d = '';
    for (let i = 0; i <= 120; i++) { const t = (i / 120) * 2.6 * Math.PI, r = 36 * Math.exp(-0.25 * t); d += `${i ? 'L' : 'M'} ${(-8 + Math.cos(t + 0.6) * r).toFixed(1)},${(-10 + Math.sin(t + 0.6) * r).toFixed(1)} `; }
    line(c, d, '#6a4220', 3);
    let d2 = '';
    for (let i = 0; i <= 100; i++) { const t = (i / 100) * 2 * Math.PI, r = 30 * Math.exp(-0.25 * t); d2 += `${i ? 'L' : 'M'} ${(-8 + Math.cos(t + 0.6) * r).toFixed(1)},${(-10 + Math.sin(t + 0.6) * r).toFixed(1)} `; }
    line(c, d2, '#e0b07a', 2, { opacity: 0.7 });
    return c;
  };

  // ---------- 蜥脚類恐龍（側面）約 300 × 230，地面 y=80 ----------
  B3.sauropod = (p) => {
    const c = g(p), F = '#7d9a6a', D = '#4f6a40', L = '#a8c08e';
    P(c, 'M -60,-10 C -110,-6 -160,12 -196,26 C -160,22 -110,22 -56,22 Z', F, D, 2);
    [[40, 80, 20], [-40, 80, 22]].forEach(([x, G, w]) => leg(c, x, 0, G, w, D, D));
    P(c, 'M 40,-20 C 62,-60 80,-120 104,-150 C 112,-160 126,-160 130,-150 L 138,-146 C 146,-142 146,-134 138,-132 L 122,-132 C 108,-110 94,-60 82,-6 Z', F, D, 2);
    el('ellipse', { cx: 0, cy: 0, rx: 76, ry: 40, fill: F, stroke: D, 'stroke-width': 2 }, c);
    P(c, 'M -50,22 C -20,36 30,36 60,20 C 40,30 -20,32 -50,22 Z', L, 'none', 0);
    [[54, 80, 22], [-28, 80, 24]].forEach(([x, G, w]) => { leg(c, x, 4, G, w, F, D); [-1, 0, 1].forEach((k) => el('ellipse', { cx: x + k * 6 + 2, cy: G - 3, rx: 2.6, ry: 2, fill: '#e8e0c8' }, c)); });
    eye(c, 126, -146, 3);
    line(c, 'M 140,-134 C 134,-132 128,-132 124,-134', D, 1.5);
    return c;
  };

  // ---------- 蕨類（葉從基部斜向上伸出）----------
  B3.fern = (p, { h = 120, n = 5, col = '#4f9a42' } = {}) => {
    const c = g(p);
    for (let k = 0; k < n; k++) {
      const ang = -90 + (k - (n - 1) / 2) * 17; // 偏離垂直的角度
      const a = (ang * Math.PI) / 180, len = h * (1 - Math.abs(k - (n - 1) / 2) * 0.12);
      const tx = Math.cos(a) * len, ty = Math.sin(a) * len, bend = (k - (n - 1) / 2) * 6;
      const pt = (t) => [tx * t + bend * t * t, ty * t + Math.abs(bend) * 0.6 * t * t];
      let d = 'M 0,0';
      for (let i = 1; i <= 20; i++) { const [x, y] = pt(i / 20); d += ` L ${x.toFixed(1)},${y.toFixed(1)}`; }
      line(c, d, '#3a6a2e', 2.4);
      for (let i = 2; i < 18; i++) {
        const t = i / 20, [x, y] = pt(t), [x2, y2] = pt(t + 0.02);
        const dir = Math.atan2(y2 - y, x2 - x), pl = (1 - t) * 18 + 4;
        [-1, 1].forEach((s) => {
          const pa = dir + s * 1.0; // 小葉朝葉尖方向斜伸
          el('ellipse', { cx: (x + Math.cos(pa) * pl / 2).toFixed(1), cy: (y + Math.sin(pa) * pl / 2).toFixed(1), rx: (pl / 2).toFixed(1), ry: 2.6, fill: col, transform: `rotate(${((pa * 180) / Math.PI).toFixed(0)} ${(x + Math.cos(pa) * pl / 2).toFixed(1)} ${(y + Math.sin(pa) * pl / 2).toFixed(1)})` }, c);
        });
      }
    }
    return c;
  };

  // ---------- 長毛象（新生代）約 230 × 180，地面 y=70 ----------
  B3.mammoth = (p) => {
    const c = g(p), F = '#7a5434', D = '#4e321c', H = '#5e3e22';
    line(c, 'M -70,-10 C -80,0 -82,16 -80,26', D, 5);
    [[36, 70, 24], [-48, 70, 26]].forEach(([x, G, w]) => leg(c, x, 0, G, w, D, D));
    P(c, 'M -72,14 C -80,-26 -46,-58 -6,-60 C 26,-62 54,-56 66,-38 C 76,-22 70,8 60,22 L -62,26 C -70,24 -72,20 -72,14 Z', F, D, 2);
    let fr = 'M -64,18';
    for (let i = 0; i <= 14; i++) fr += ` L ${-62 + i * 9},${32 + (i % 3) * 4} L ${-58 + i * 9},${22}`;
    P(c, fr + ' L 64,16 Z', H, 'none', 0);
    [[50, 70, 26], [-30, 70, 28]].forEach(([x, G, w]) => leg(c, x, 4, G, w, F, D));
    el('circle', { cx: 70, cy: -46, r: 28, fill: F, stroke: D, 'stroke-width': 2 }, c);
    el('ellipse', { cx: 52, cy: -40, rx: 10, ry: 14, fill: H }, c);
    P(c, 'M 84,-34 C 98,-16 100,10 92,36 C 90,44 82,46 80,40 C 86,16 84,-6 74,-22 Z', F, D, 2);
    line(c, 'M 80,-14 C 112,-6 132,-26 120,-58', '#f2ead8', 8);
    line(c, 'M 80,-14 C 112,-6 132,-26 120,-58', '#d9cdb0', 2, { opacity: 0.6 });
    eye(c, 78, -50, 3);
    for (let i = 0; i < 6; i++) line(c, `M ${-40 + i * 16},-56 C ${-38 + i * 16},-50 ${-42 + i * 16},-44 ${-44 + i * 16},-40`, H, 2, { opacity: 0.6 });
    return c;
  };

  // ---------- 始祖鳥（復原圖，側面）約 300 × 220，地面 y=70 ----------
  B3.archaeopteryx = (p) => {
    const c = g(p), F = '#8a6a48', D = '#4e3826', W = '#6a4e32', BONE = '#efe2c0';
    // 長尾巴：中間有一節一節的尾椎骨，兩側長羽毛
    const tail = (t) => [-20 - t * 124, 6 + t * 14 + Math.sin(t * 3) * 4];
    for (let i = 0; i < 14; i++) {
      const t = 0.06 + i * 0.068, [x, y] = tail(t);
      [-1, 1].forEach((s) => el('ellipse', { cx: (x - 10).toFixed(1), cy: (y + s * 9).toFixed(1), rx: 15, ry: 4.2, fill: W, stroke: D, 'stroke-width': 1, transform: `rotate(${s * 26} ${(x - 10).toFixed(1)} ${(y + s * 9).toFixed(1)})` }, c));
    }
    for (let i = 0; i < 18; i++) {
      const t = 0.02 + i * 0.053, [x, y] = tail(t);
      el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: 3.6, ry: 2.6, fill: BONE, stroke: '#a8987a', 'stroke-width': 0.8 }, c);
    }
    // 遠側的腳
    line(c, 'M 6,16 L 2,40 L 8,66', '#a88a5a', 4);
    line(c, 'M 8,66 L 20,68 M 8,66 L 16,72 M 8,66 L -2,68', '#a88a5a', 2.4);
    // 身體
    P(c, 'M -26,-6 C -14,-32 28,-38 46,-24 C 58,-12 54,10 36,18 C 14,26 -18,20 -26,-6 Z', F, D, 2);
    // 脖子與頭（嘴裡有牙齒）
    P(c, 'M 30,-30 C 44,-44 54,-56 62,-66 L 74,-56 C 66,-44 56,-30 46,-16 Z', F, D, 2);
    P(c, 'M 56,-70 C 62,-82 82,-82 90,-72 L 116,-66 C 118,-64 116,-61 112,-61 L 90,-60 C 78,-58 64,-58 58,-62 Z', F, D, 2);
    P(c, 'M 66,-58 C 78,-56 94,-56 108,-56 C 106,-52 96,-50 84,-50 C 74,-50 66,-54 66,-58 Z', F, D, 1.8);
    for (let i = 0; i < 5; i++) { const x = 84 + i * 5.6; P(c, `M ${x},-60.5 l 2,4.6 l 2,-4.6 Z`, '#fffaf0', 'none', 0); if (i < 4) P(c, `M ${x + 1.5},-55.5 l 2,-4 l 2,4 Z`, '#fffaf0', 'none', 0); }
    eye(c, 76, -71, 3.6);
    // 張開的翅膀（向上、往後）：前緣有三根帶爪的指頭
    const E = [4, -60], Wr = [26, -100], H2 = [16, -126];
    for (let i = 5; i >= 0; i--) { // 次級飛羽：沿著前臂，往後
      const t = i / 5, bx = S.lerp(E[0], Wr[0], t), by = S.lerp(E[1], Wr[1], t), L = 62 + t * 18, a = (196 + t * 10) * Math.PI / 180;
      const cx = bx + Math.cos(a) * L / 2, cy = by + Math.sin(a) * L / 2;
      el('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: (L / 2).toFixed(1), ry: 8, fill: W, stroke: D, 'stroke-width': 1.2, transform: `rotate(${(a * 180 / Math.PI).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})` }, c);
    }
    for (let i = 0; i < 6; i++) { // 初級飛羽：沿著手部，往上後方
      const t = i / 5, bx = S.lerp(Wr[0], H2[0], t), by = S.lerp(Wr[1], H2[1], t), L = 84 + t * 14, a = (214 + t * 22) * Math.PI / 180;
      const cx = bx + Math.cos(a) * L / 2, cy = by + Math.sin(a) * L / 2;
      el('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: (L / 2).toFixed(1), ry: 7.5, fill: i % 2 ? W : '#5e4430', stroke: D, 'stroke-width': 1.2, transform: `rotate(${(a * 180 / Math.PI).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})` }, c);
    }
    line(c, `M 28,-20 L ${E[0]},${E[1]} L ${Wr[0]},${Wr[1]} L ${H2[0]},${H2[1]}`, F, 9);
    line(c, `M 28,-20 L ${E[0]},${E[1]} L ${Wr[0]},${Wr[1]} L ${H2[0]},${H2[1]}`, D, 1.4, { opacity: 0.5 });
    // 翅膀前端的三根指頭（有爪）
    [[44, -112], [48, -100], [44, -90]].forEach(([x, y]) => {
      line(c, `M ${Wr[0]},${Wr[1]} L ${x},${y}`, BONE, 3.4);
      P(c, `M ${x - 1},${y - 3} C ${x + 8},${y - 4} ${x + 11},${y + 3} ${x + 7},${y + 9} C ${x + 6},${y + 4} ${x + 3},${y + 1} ${x - 1},${y + 2} Z`, '#2a1d10', '#efe2c0', 1);
    });
    // 近側的腳
    P(c, 'M -2,4 C 8,2 22,6 24,18 C 22,26 14,30 8,30 Z', F, D, 1.6);
    line(c, 'M 14,26 L 12,46 L 20,66', '#c4a06a', 4.2);
    line(c, 'M 20,66 L 34,68 M 20,66 L 30,73 M 20,66 L 8,68', '#c4a06a', 2.6);
    c.ground = 70;
    return c;
  };

  // ---------- 細菌（桿菌）----------
  B3.bacterium = (p, { fill = '#7fc6a4', edge = '#3f8a6a', flag = false } = {}) => {
    const c = g(p);
    if (flag) line(c, 'M -28,0 C -36,-6 -40,6 -48,0 C -54,-5 -58,4 -64,0', edge, 1.6);
    el('rect', { x: -28, y: -11, width: 56, height: 22, rx: 11, fill, stroke: edge, 'stroke-width': 2 }, c);
    el('ellipse', { cx: 0, cy: 0, rx: 14, ry: 5, fill: edge, opacity: 0.35 }, c);
    [[-16, -4], [14, 4], [18, -3]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.8, fill: edge, opacity: 0.6 }, c));
    return c;
  };

  // ---------- 草履蟲 ----------
  B3.paramecium = (p) => {
    const c = g(p), E = '#3f8a9a';
    const body = 'M -60,0 C -58,-24 -10,-28 24,-22 C 54,-16 64,4 52,16 C 36,28 -34,28 -60,0 Z';
    const tmp = P(c, body, 'none', 'none', 0);
    const L = tmp.getTotalLength ? (() => { try { return tmp.getTotalLength(); } catch (e) { return 0; } })() : 0;
    if (L > 0) for (let i = 0; i < 64; i++) { const q = tmp.getPointAtLength((L * i) / 64), q2 = tmp.getPointAtLength((L * (i + 0.5)) / 64); const a = Math.atan2(q2.y - q.y, q2.x - q.x) - Math.PI / 2; line(c, `M ${q.x.toFixed(1)},${q.y.toFixed(1)} L ${(q.x + Math.cos(a) * 6).toFixed(1)},${(q.y + Math.sin(a) * 6).toFixed(1)}`, '#9fd8e0', 1.1); }
    tmp.remove();
    P(c, body, 'rgba(159,216,224,0.35)', E, 2);
    P(c, 'M 4,-4 C 14,2 22,12 20,20 C 12,12 6,6 4,-4 Z', 'rgba(63,138,154,0.45)', 'none', 0);
    el('ellipse', { cx: -10, cy: 2, rx: 14, ry: 8, fill: 'rgba(167,150,255,0.6)', stroke: '#a796ff', 'stroke-width': 1.5 }, c);
    [[-40, -2], [34, -6]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 4, fill: 'rgba(255,255,255,0.5)' }, c); for (let k = 0; k < 6; k++) { const a = k * 1.047; line(c, `M ${x + Math.cos(a) * 4},${y + Math.sin(a) * 4} L ${x + Math.cos(a) * 9},${y + Math.sin(a) * 9}`, 'rgba(255,255,255,0.5)', 1.2); } });
    return c;
  };

  // ---------- 香菇 ----------
  B3.mushroom = (p) => {
    const c = g(p);
    P(c, 'M -11,-2 L -9,38 C -7,44 7,44 9,38 L 11,-2 Z', '#efe2c4', '#b8a888', 1.6);
    P(c, 'M -46,-4 C -30,4 30,4 46,-4 C 40,2 -40,2 -46,-4 Z', '#d9c8a4', 'none', 0);
    for (let i = -4; i <= 4; i++) line(c, `M ${i * 4},0 L ${i * 9.5},-3`, '#b8a888', 1);
    P(c, 'M -48,-4 C -46,-38 46,-38 48,-4 C 30,0 -30,0 -48,-4 Z', '#8a5a34', '#5a3a1e', 2);
    [[-24, -18, 5], [-6, -26, 4], [14, -20, 5], [30, -12, 3.5], [-34, -8, 3]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: r * 1.4, ry: r * 0.8, fill: '#d9b48a', opacity: 0.85 }, c));
    return c;
  };

  // ---------- 開花植物（葉子斜向上）----------
  B3.plant = (p) => {
    const c = g(p);
    line(c, 'M 0,50 C -2,20 2,-10 0,-46', '#4f8f3a', 4);
    const lf = (x, y, len, deg) => { const lg = S.place(g(c), { x, y, r: deg }); P(lg, `M 0,0 C ${len * 0.3},-${len * 0.22} ${len * 0.75},-${len * 0.2} ${len},0 C ${len * 0.75},${len * 0.2} ${len * 0.3},${len * 0.22} 0,0 Z`, '#6fbe52', '#2f6a2a', 1.4); line(lg, `M 2,0 L ${len - 4},0`, '#2f6a2a', 1); };
    lf(0, 34, 34, -32); lf(0, 26, 34, 180 + 32); lf(0, 6, 28, -36); lf(0, -4, 28, 180 + 36);
    for (let k = 0; k < 5; k++) { const a = (k / 5) * 6.283 - 1.57; el('ellipse', { cx: Math.cos(a) * 9, cy: -54 + Math.sin(a) * 9, rx: 8, ry: 5, fill: '#ff9ab8', transform: `rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 9} ${-54 + Math.sin(a) * 9})` }, c); }
    el('circle', { cx: 0, cy: -54, r: 5, fill: '#ffd166' }, c);
    return c;
  };

  // ---------- 病毒（球形，有突起）----------
  B3.virus = (p, { fill = '#d96a8a', spike = '#f2a6bc' } = {}) => {
    const c = g(p);
    for (let k = 0; k < 14; k++) { const a = (k / 14) * 6.283; line(c, `M ${Math.cos(a) * 22},${Math.sin(a) * 22} L ${Math.cos(a) * 32},${Math.sin(a) * 32}`, spike, 3); el('circle', { cx: Math.cos(a) * 33, cy: Math.sin(a) * 33, r: 4, fill: spike }, c); }
    el('circle', { cx: 0, cy: 0, r: 25, fill, stroke: '#a84a66', 'stroke-width': 2 }, c);
    line(c, 'M -10,-6 C -4,-12 4,-2 10,-8 M -12,6 C -6,0 4,10 12,4', '#f8c8d6', 1.6, { opacity: 0.7 });
    return c;
  };

  // ---------- 馬鈴薯、花生（俗名的例子）----------
  B3.potato = (p) => {
    const c = g(p);
    P(c, 'M -44,-6 C -42,-28 -10,-34 16,-30 C 40,-26 52,-10 48,8 C 44,26 18,32 -8,30 C -34,28 -46,14 -44,-6 Z', '#c9a066', '#7a5a2e', 2);
    [[-24, -12], [6, -18], [26, 2], [-8, 12], [30, -14]].forEach(([x, y]) => P(c, `M ${x - 4},${y} C ${x - 2},${y - 3} ${x + 2},${y - 3} ${x + 4},${y}`, 'none', '#7a5a2e', 1.6));
    el('ellipse', { cx: -18, cy: -18, rx: 12, ry: 5, fill: '#e2c08a', opacity: 0.6, transform: 'rotate(-12 -18 -18)' }, c);
    return c;
  };
  B3.peanut = (p) => {
    const c = g(p);
    P(c, 'M -44,0 C -46,-20 -26,-26 -14,-16 C -6,-10 6,-10 14,-16 C 26,-26 46,-20 44,0 C 46,20 26,26 14,16 C 6,10 -6,10 -14,16 C -26,26 -46,20 -44,0 Z', '#e0c48e', '#9a7a44', 2);
    for (let i = -3; i <= 3; i++) line(c, `M ${i * 11},-14 C ${i * 11 + 3},-4 ${i * 11 - 3},4 ${i * 11},14`, '#b8985a', 1.2, { opacity: 0.8 });
    line(c, 'M -40,-4 L 40,-4 M -40,6 L 40,6', '#b8985a', 1, { opacity: 0.6 });
    return c;
  };
})();
