/* 七下第六章共用圖形（S.B6）：魚、鳥、熊、獼猴、瓢蟲、植物、外來種、地圖…
   每個函式在區域座標畫圖（原點在圖的中心或腳底，面向右），外層用 S.place 定位、縮放。 */
(() => {
  const { el, g } = S;
  const B = (S.B6 = {});
  let uid = 0;
  const nid = (k) => `b6${k}${uid++}`;
  const defs = (p) => el('defs', {}, p);
  // 線性漸層（預設由上到下）
  B.grad = (p, stops, { x2 = 0, y2 = 1 } = {}) => {
    const id = nid('g');
    const lg = el('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs(p));
    stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, lg));
    return `url(#${id})`;
  };
  const clipBy = (p, d) => {
    const id = nid('c');
    el('path', { d }, el('clipPath', { id }, defs(p)));
    return `url(#${id})`;
  };
  B.clipBy = clipBy;

  // ---------- 魚（側面、朝右；全長約 200：x -102～100） ----------
  B.fish = (p, { back = '#5d7f95', mid = '#a9c2cf', belly = '#eef4f6', fin = '#8fa9b8', edge = '#1d313c', deep = 1, parr = false, spots = false, adipose = false, blush = null } = {}) => {
    const f = g(p);
    const h = 31 * deep;
    const body = `M 100,2 C 93,${-h * 0.5} 72,${-h * 0.92} 30,${-h} C -10,${-h * 1.04} -44,${-h * 0.72} -70,-9 L -70,9 C -44,${h * 0.72} -10,${h * 1.03} 30,${h * 0.97} C 72,${h * 0.88} 93,${h * 0.48} 100,2 Z`;
    const fp = { fill: fin, stroke: edge, 'stroke-width': 2, 'stroke-linejoin': 'round' };
    el('path', { d: 'M -64,0 L -103,-33 Q -88,0 -103,33 Z', ...fp }, f); // 尾鰭（叉形）
    el('path', { d: `M -4,${-h * 0.98} L 8,${-h - 20} C 20,${-h - 23} 36,${-h - 15} 42,${-h * 0.95} Z`, ...fp }, f); // 背鰭
    el('path', { d: `M -36,${h * 0.7} L -48,${h + 9} C -40,${h + 11} -30,${h + 5} -24,${h * 0.8} Z`, ...fp }, f); // 臀鰭
    el('path', { d: `M 10,${h * 0.97} L -2,${h + 13} C 6,${h + 14} 16,${h + 8} 20,${h * 0.95} Z`, ...fp }, f); // 腹鰭
    if (adipose) el('path', { d: `M -54,${-h * 0.62} C -50,${-h * 0.62 - 9} -42,${-h * 0.62 - 9} -40,${-h * 0.7} Z`, ...fp }, f); // 脂鰭
    el('path', { d: body, fill: B.grad(f, [[0, back], [0.5, mid], [0.78, belly], [1, belly]]), stroke: edge, 'stroke-width': 2.5 }, f);
    const inner = g(f, { 'clip-path': clipBy(f, body) });
    if (blush) el('path', { d: `M 70,-4 C 30,-8 -20,-6 -70,-2 L -70,8 C -20,8 30,10 70,8 Z`, fill: blush, opacity: 0.45 }, inner);
    if (parr) for (let i = 0; i < 8; i++) el('ellipse', { cx: 52 - i * 15, cy: -2, rx: 5.5, ry: h * 0.32, fill: '#3b3f2a', opacity: 0.55 }, inner);
    if (spots) {
      const r = S.rng(7);
      for (let i = 0; i < 16; i++) el('circle', { cx: 60 - r() * 120, cy: -h * 0.85 + r() * h * 0.6, r: 1.8 + r() * 1.4, fill: '#1c1f18', opacity: 0.8 }, inner);
    }
    el('path', { d: `M 62,-3 C 20,-2 -30,0 -68,0`, fill: 'none', stroke: '#ffffff', 'stroke-width': 1.2, opacity: 0.45 }, f); // 側線
    el('path', { d: `M 68,${-h * 0.72} Q 55,0 68,${h * 0.72}`, fill: 'none', stroke: edge, 'stroke-width': 2, opacity: 0.8 }, f); // 鰓蓋
    el('path', { d: 'M 58,8 C 46,16 36,22 30,20 C 38,12 48,7 58,5 Z', fill: fin, stroke: edge, 'stroke-width': 1.5, opacity: 0.95 }, f); // 胸鰭
    el('circle', { cx: 80, cy: -6, r: 6.5, fill: '#f2f2e8', stroke: edge, 'stroke-width': 1.5 }, f);
    el('circle', { cx: 81, cy: -6, r: 3.6, fill: '#121212' }, f);
    el('path', { d: 'M 100,2 L 91,5', stroke: edge, 'stroke-width': 2, 'stroke-linecap': 'round' }, f);
    f.bodyD = body;
    return f;
  };
  B.smallFish = (p) => B.fish(p, { back: '#4f7896', mid: '#a6c3d4', belly: '#f1f6f8', fin: '#9fb8c6' });
  B.bigFish = (p) => B.fish(p, { back: '#46604a', mid: '#8aa07a', belly: '#e6ead6', fin: '#7d8f68', deep: 1.18, edge: '#1f2b1c' });
  // 櫻花鉤吻鮭：橄欖色的背、身體兩側有橢圓形的斑（幼鮭斑）、背上有黑點、脂鰭
  B.salmon = (p) => B.fish(p, { back: '#5b6a43', mid: '#a7a77e', belly: '#f0eadb', fin: '#8f8a66', parr: true, spots: true, adipose: true, blush: '#d98a8a', edge: '#262a1a' });

  // ---------- 鷺科水鳥（側面站立、朝右；腳底 y=150，頭頂約 y=-165） ----------
  // kind: 'egret' 大白鷺、'spoon' 黑面琵鷺、'ibis' 埃及聖䴉
  B.wader = (p, { kind = 'egret' } = {}) => {
    if (kind === 'spoon') return B.spoonbill(S.place(g(p), { y: 30 }));
    const b = g(p);
    const WHITE = '#f4f6f1', SHADE = '#b9c4c8', LEG = kind === 'egret' ? '#1f2326' : '#262626';
    const legs = [[4, 0], [-16, 1]];
    legs.forEach(([dx, k]) => {
      const c = k ? '#3a3f42' : LEG;
      el('path', { d: `M ${dx},18 L ${dx + 4},82 L ${dx},146`, fill: 'none', stroke: c, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
      el('path', { d: `M ${dx},146 L ${dx + 24},150 M ${dx},146 L ${dx + 16},154 M ${dx},146 L ${dx - 12},149`, fill: 'none', stroke: c, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, b);
    });
    const body = 'M 46,-30 C 63,-19 60,4 40,14 C 14,28 -40,30 -96,16 C -78,6 -70,-12 -56,-22 C -30,-40 20,-44 46,-30 Z';
    el('path', { d: body, fill: WHITE, stroke: SHADE, 'stroke-width': 2.5 }, b);
    el('path', { d: 'M 38,-10 C 10,6 -40,11 -90,15', fill: 'none', stroke: SHADE, 'stroke-width': 2.5 }, b); // 翅膀
    el('path', { d: 'M 10,0 C -10,8 -40,12 -70,13', fill: 'none', stroke: SHADE, 'stroke-width': 1.5, opacity: 0.7 }, b);
    if (kind === 'ibis') { // 尾部黑色的飾羽
      el('path', { d: 'M -40,6 C -60,14 -86,22 -104,30 C -84,30 -60,26 -40,18 C -54,26 -72,34 -84,40 C -64,38 -44,30 -30,16 Z', fill: '#1e1e22' }, b);
    }
    const neck = kind === 'spoon' ? 'M 44,-26 C 60,-40 62,-64 56,-84 C 52,-98 56,-110 66,-116' : 'M 44,-26 C 66,-48 66,-80 50,-100 C 36,-118 44,-142 64,-150';
    const hy = kind === 'spoon' ? -118 : -152;
    const neckCol = kind === 'ibis' ? '#1e1e22' : WHITE;
    el('path', { d: neck, fill: 'none', stroke: kind === 'ibis' ? '#4a4a50' : SHADE, 'stroke-width': 19, 'stroke-linecap': 'round' }, b);
    el('path', { d: neck, fill: 'none', stroke: neckCol, 'stroke-width': 15, 'stroke-linecap': 'round' }, b);
    el('ellipse', { cx: 68, cy: hy, rx: 15, ry: 11.5, fill: kind === 'ibis' ? '#1e1e22' : WHITE, stroke: kind === 'ibis' ? '#4a4a50' : SHADE, 'stroke-width': 2 }, b);
    if (kind === 'egret') {
      el('path', { d: `M 76,${hy - 5} L 140,${hy + 2} L 76,${hy + 6} Z`, fill: '#e8c33a', stroke: '#a88a1c', 'stroke-width': 1.5 }, b);
      el('circle', { cx: 72, cy: hy - 3, r: 3.6, fill: '#e8c33a' }, b);
      el('circle', { cx: 72.5, cy: hy - 3, r: 1.8, fill: '#111' }, b);
    } else if (kind === 'spoon') {
      el('path', { d: `M 60,${hy - 9} C 72,${hy - 12} 80,${hy - 8} 82,${hy + 4} C 74,${hy + 9} 64,${hy + 8} 58,${hy + 4} Z`, fill: '#1a1a1a' }, b); // 黑色的臉
      el('path', { d: `M 78,${hy - 4} L 122,${hy - 1} C 134,${hy - 5} 146,${hy + 1} 143,${hy + 8} C 139,${hy + 15} 126,${hy + 12} 121,${hy + 7} L 78,${hy + 6} Z`, fill: '#1a1a1a', stroke: '#555', 'stroke-width': 1.5 }, b); // 湯匙形的嘴
      el('circle', { cx: 70, cy: hy - 3, r: 2.4, fill: '#c9302c' }, b);
    } else {
      el('path', { d: `M 76,${hy - 5} C 110,${hy - 5} 132,${hy + 12} 141,${hy + 40} L 136,${hy + 42} C 126,${hy + 18} 106,${hy + 6} 76,${hy + 6} Z`, fill: '#1e1e22', stroke: '#4a4a50', 'stroke-width': 1.5 }, b); // 下彎的嘴
      el('circle', { cx: 71, cy: hy - 3, r: 2.4, fill: '#9a2a2a' }, b);
    }
    return b;
  };

  // 黑面琵鷺（側面站立、朝右；腳底 y=120）：湯匙形的黑色長嘴、嘴基到眼睛的黑色裸皮、白色身體、黑腳
  B.spoonbill = (p) => {
    const b = g(p);
    const WHITE = '#f4f6f1', SHADE = '#b9c4c8';
    [[4, '#1a1a1a'], [-16, '#333']].forEach(([dx, c]) => {
      el('path', { d: `M ${dx},18 L ${dx + 3},68 L ${dx},116`, fill: 'none', stroke: c, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
      el('path', { d: `M ${dx},116 L ${dx + 20},120 M ${dx},116 L ${dx + 13},124 M ${dx},116 L ${dx - 11},119`, fill: 'none', stroke: c, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, b);
    });
    el('path', { d: 'M 50,-22 C 66,-10 60,14 38,22 C 10,32 -44,30 -90,14 C -72,4 -66,-14 -50,-24 C -26,-38 26,-38 50,-22 Z', fill: WHITE, stroke: SHADE, 'stroke-width': 2.5 }, b);
    el('path', { d: 'M 40,-6 C 12,10 -40,12 -84,14', fill: 'none', stroke: SHADE, 'stroke-width': 2.5 }, b);
    const neck = 'M 42,-16 C 54,-28 56,-44 60,-56';
    el('path', { d: neck, fill: 'none', stroke: SHADE, 'stroke-width': 23, 'stroke-linecap': 'round' }, b);
    el('path', { d: neck, fill: 'none', stroke: WHITE, 'stroke-width': 19, 'stroke-linecap': 'round' }, b);
    const hd = g(b, { transform: 'translate(0,18)' });
    el('ellipse', { cx: 68, cy: -82, rx: 16, ry: 13, fill: WHITE, stroke: SHADE, 'stroke-width': 2 }, hd);
    // 嘴：先畫，嘴基藏在黑臉下；尖端擴大成湯匙形
    const bill = S.place(g(hd), { x: 80, y: -84, r: 20 });
    el('path', { d: 'M 0,-6 L 56,-4 C 62,-11 80,-14 90,-7 C 96,-1 92,9 82,10 C 70,11 62,7 56,4 L 0,6 Z', fill: '#16171a', stroke: '#6a6f76', 'stroke-width': 1.8 }, bill);
    // 黑色的臉：從嘴基包住眼睛
    el('path', { d: 'M 60,-92 C 68,-98 82,-96 88,-88 C 90,-80 86,-74 78,-72 C 70,-72 64,-76 60,-82 C 58,-86 58,-90 60,-92 Z', fill: '#16171a' }, hd);
    el('circle', { cx: 71, cy: -86, r: 3.4, fill: '#c0392b' }, hd);
    el('circle', { cx: 71.6, cy: -86.6, r: 1.2, fill: '#ffd0c8' }, hd);
    return b;
  };
  // 友善的人物（正面、腳底在 y=0）：圓臉、短脖子（約臉長的 1/3）、肩膀平
  // kind：'teen' 學生、'adult' 大人、'child' 小孩；hands：[[x,y] 或 null（自然下垂）, …]（畫面的左、右手）
  const BODY = { teen: { r: 24, cy: -170, sw: 34, hip: -82, tw: 30 }, adult: { r: 24, cy: -200, sw: 38, hip: -100, tw: 33 }, child: { r: 20, cy: -104, sw: 24, hip: -46, tw: 21 } };
  B.person = (p, { kind = 'teen', shirt = '#3a8fd8', pants = '#34495e', hair = '#3a2a20', skin = '#f2c9a0', hands = [null, null] } = {}) => {
    const b = g(p);
    const { r, cy, sw, hip, tw } = BODY[kind];
    const chin = cy + r, neckB = chin + Math.round(((r * 1.45) / 3)), sy = neckB;
    // 腿與鞋
    [-1, 1].forEach((s) => {
      el('path', { d: `M ${s * 2},${hip} L ${s * tw * 0.9},${hip} L ${s * tw * 0.78},-8 L ${s * 4},-8 Z`, fill: pants, stroke: '#1d2a36', 'stroke-width': 1.5 }, b);
      el('ellipse', { cx: s * tw * 0.5, cy: -4, rx: tw * 0.42, ry: 5.5, fill: '#2a2a2e' }, b);
    });
    // 身體（平肩）
    el('path', { d: `M ${-sw},${sy + 8} Q ${-sw},${sy} ${-sw + 8},${sy} L ${sw - 8},${sy} Q ${sw},${sy} ${sw},${sy + 8} L ${tw},${hip + 4} L ${-tw},${hip + 4} Z`, fill: shirt, stroke: '#1d2a36', 'stroke-width': 1.5 }, b);
    el('path', { d: `M -7,${sy} Q 0,${sy + 7} 7,${sy}`, fill: 'none', stroke: '#1d2a36', 'stroke-width': 1.5, opacity: 0.6 }, b);
    // 手臂（袖子＋前臂）
    const sh = [[-sw + 4, sy + 6], [sw - 4, sy + 6]];
    const arms = sh.map(([x, y], i) => {
      const s = i ? 1 : -1, h = hands[i] || [s * (sw + 4), hip + 10];
      const ex = (x + h[0]) / 2 + s * 6, ey = (y + h[1]) / 2;
      el('path', { d: `M ${x},${y} Q ${ex},${ey} ${h[0]},${h[1]}`, fill: 'none', stroke: skin, 'stroke-width': r * 0.48, 'stroke-linecap': 'round' }, b);
      el('path', { d: `M ${x},${y} L ${S.lerp(x, ex, 0.75)},${S.lerp(y, ey, 0.75)}`, fill: 'none', stroke: shirt, 'stroke-width': r * 0.62, 'stroke-linecap': 'round' }, b);
      return h;
    });
    arms.forEach(([x, y]) => el('circle', { cx: x, cy: y, r: r * 0.28, fill: skin }, b));
    // 脖子（短）
    el('rect', { x: -r * 0.32, y: chin - 4, width: r * 0.64, height: neckB - chin + 5, fill: skin }, b);
    // 耳朵、臉、頭髮
    [-1, 1].forEach((s) => el('circle', { cx: s * r * 0.98, cy: cy + 3, r: r * 0.22, fill: skin }, b));
    el('circle', { cx: 0, cy, r, fill: skin }, b);
    el('path', { d: `M ${-r - 2},${cy + 3} C ${-r - 3},${cy - r * 1.3} ${r + 3},${cy - r * 1.3} ${r + 2},${cy + 3} C ${r * 0.8},${cy - r * 0.3} ${r * 0.2},${cy - r * 0.5} ${-r * 0.1},${cy - r * 0.42} C ${-r * 0.5},${cy - r * 0.45} ${-r * 0.85},${cy - r * 0.3} ${-r - 2},${cy + 3} Z`, fill: hair }, b);
    [-1, 1].forEach((s) => { el('ellipse', { cx: s * r * 0.36, cy: cy + r * 0.08, rx: r * 0.08, ry: r * 0.11, fill: '#2a1e18' }, b); el('circle', { cx: s * r * 0.55, cy: cy + r * 0.38, r: r * 0.14, fill: '#f08a8a', opacity: 0.45 }, b); });
    el('path', { d: `M ${-r * 0.28},${cy + r * 0.42} Q 0,${cy + r * 0.66} ${r * 0.28},${cy + r * 0.42}`, fill: 'none', stroke: '#9a4a3a', 'stroke-width': 2, 'stroke-linecap': 'round' }, b);
    b.hands = arms;
    return b;
  };
  // ---------- 帝雉（黑長尾雉，雄鳥；側面、朝右；腳底 y=70） ----------
  B.pheasant = (p) => {
    const b = g(p);
    const tail = 'M -24,-8 C -90,4 -170,24 -250,40 L -252,50 C -170,38 -90,20 -20,10 Z';
    el('path', { d: tail, fill: '#15171d', stroke: '#596273', 'stroke-width': 2 }, b);
    const tg = g(b, { 'clip-path': clipBy(b, tail) });
    for (let i = 0; i < 9; i++) { const x = -60 - i * 22; el('line', { x1: x, y1: -20, x2: x - 8, y2: 60, stroke: '#eef0f2', 'stroke-width': 4 }, tg); }
    [[0, 0], [16, 1]].forEach(([dx, k]) => el('path', { d: `M ${dx},24 L ${dx + 4},50 L ${dx + 2},70 M ${dx + 2},70 l 14,2 M ${dx + 2},70 l -9,2`, fill: 'none', stroke: k ? '#7d8790' : '#99a3ab', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b));
    el('path', { d: 'M 50,-30 C 70,-18 66,10 44,22 C 20,34 -28,30 -48,12 C -58,0 -50,-20 -30,-30 C -10,-38 30,-38 50,-30 Z', fill: B.grad(b, [[0, '#2c3d6e'], [0.6, '#1a2242'], [1, '#12162a']]), stroke: '#5a6890', 'stroke-width': 2 }, b);
    el('path', { d: 'M 40,-14 C 18,-4 -14,4 -46,6 C -20,-6 10,-16 40,-14 Z', fill: '#121730' }, b); // 翅膀
    el('path', { d: 'M 30,-10 C 10,-2 -10,2 -30,4 M 22,-4 C 4,3 -16,6 -36,8', fill: 'none', stroke: '#f0f2f4', 'stroke-width': 3, 'stroke-linecap': 'round' }, b); // 翅上白斑
    el('path', { d: 'M 42,-26 C 52,-40 58,-54 58,-68', fill: 'none', stroke: '#1d2850', 'stroke-width': 20, 'stroke-linecap': 'round' }, b);
    el('ellipse', { cx: 64, cy: -72, rx: 15, ry: 13, fill: '#1d2850', stroke: '#5a6890', 'stroke-width': 2 }, b);
    el('ellipse', { cx: 67, cy: -74, rx: 9, ry: 7.5, fill: '#d22f38' }, b); // 紅色的臉
    el('circle', { cx: 68, cy: -75, r: 2.4, fill: '#111' }, b);
    el('path', { d: 'M 77,-74 C 85,-73 87,-67 84,-64 L 77,-68 Z', fill: '#cfd2c4' }, b);
    return b;
  };

  // ---------- 臺灣藍鵲（停在樹枝上、朝右；腳在 y=0） ----------
  B.magpie = (p, { branch = true } = {}) => {
    const b = g(p);
    if (branch) {
      el('path', { d: 'M -130,12 C -60,6 20,0 96,-12', stroke: '#8a6a44', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, b);
      el('path', { d: 'M 60,-6 C 72,-20 80,-30 92,-40', stroke: '#8a6a44', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, b);
      [[92, -40, -50], [80, -30, -25], [104, -14, -12]].forEach(([x, y, r]) => el('ellipse', { cx: x + 10, cy: y - 4, rx: 13, ry: 6, fill: '#5fae52', transform: `rotate(${r} ${x} ${y})` }, b));
    }
    // 長尾：好幾根長短不同的尾羽（中間最長），末端白色，白色前有黑帶
    const bx = -18, by = 0, A = (112 * Math.PI) / 180;
    [[-8, 92], [8, 96], [-4, 122], [4, 126], [0, 158]].forEach(([da, L]) => {
      const a = A + (da * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      const P = (u, w) => `${(bx + ux * L * u + nx * w).toFixed(1)},${(by + uy * L * u + ny * w).toFixed(1)}`;
      const strip = (u0, u1, w0, w1, fill) => el('path', { d: `M ${P(u0, w0)} L ${P(u1, w1)} L ${P(u1, -w1)} L ${P(u0, -w0)} Z`, fill, stroke: '#0d1822', 'stroke-width': 0.8 }, b);
      strip(0, 0.8, 7, 6.2, '#2f68c8');
      strip(0.8, 0.88, 6.2, 6, '#16181c');
      strip(0.88, 1, 6, 5.6, '#f2f4f6');
      el('circle', { cx: bx + ux * L, cy: by + uy * L, r: 5.6, fill: '#f2f4f6' }, b);
      el('line', { x1: bx, y1: by, x2: bx + ux * L * 0.8, y2: by + uy * L * 0.8, stroke: '#24569e', 'stroke-width': 1.2 }, b);
    });
    // 身體（藍色）、翅膀（白色羽端）
    el('path', { d: 'M 36,-36 C 46,-22 40,-6 24,0 C 6,6 -16,6 -28,-2 C -36,-10 -28,-26 -12,-34 C 4,-42 26,-44 36,-36 Z', fill: '#3474d8', stroke: '#9cc0f4', 'stroke-width': 2 }, b);
    el('path', { d: 'M 24,-26 C 8,-18 -10,-12 -32,-6 C -14,-16 6,-26 22,-32 Z', fill: '#24569e' }, b);
    [[-4, -16], [-14, -12], [-24, -8]].forEach(([x, y]) => el('path', { d: `M ${x},${y} l -7,3`, stroke: '#f2f4f6', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, b));
    // 黑色的頭、頸、上胸
    el('path', { d: 'M 22,-58 C 34,-64 50,-58 50,-44 C 50,-34 46,-26 40,-20 C 32,-20 26,-26 22,-32 C 18,-40 16,-52 22,-58 Z', fill: '#141519', stroke: '#4a5060', 'stroke-width': 1.5 }, b);
    el('path', { d: 'M 49,-49 C 58,-49 66,-46 71,-42 C 64,-39 56,-38 49,-39 Z', fill: '#d8313a', stroke: '#9a1a20', 'stroke-width': 1 }, b); // 紅色的嘴
    // 紅色的腳抓著樹枝
    [-4, 10].forEach((x) => el('path', { d: `M ${x},-2 L ${x + 2},5 M ${x + 2},5 l 7,0 M ${x + 2},5 l -6,2`, fill: 'none', stroke: '#e0403e', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, b));
    el('circle', { cx: 41, cy: -47, r: 3.6, fill: '#f0d64a' }, b);
    el('circle', { cx: 41.6, cy: -47, r: 1.7, fill: '#111' }, b);
    return b;
  };

  // ---------- 臺灣黑熊（正面坐著；底部 y≈90） ----------
  B.bear = (p) => {
    const b = g(p);
    const FUR = '#1b1c21', RIM = '#5b6574', SEP = '#30343c';
    [-1, 1].forEach((s) => el('ellipse', { cx: s * 46, cy: 80, rx: 26, ry: 13, fill: FUR, stroke: RIM, 'stroke-width': 2.5 }, b));
    el('path', { d: 'M -62,76 C -76,24 -62,-28 -36,-48 C -20,-58 20,-58 36,-48 C 62,-28 76,24 62,76 C 30,88 -30,88 -62,76 Z', fill: FUR, stroke: RIM, 'stroke-width': 3 }, b);
    [-1, 1].forEach((s) => {
      el('path', { d: `M ${s * 6},20 C ${s * 4},44 ${s * 6},64 ${s * 10},78 M ${s * 40},76 C ${s * 44},54 ${s * 42},30 ${s * 36},8`, fill: 'none', stroke: SEP, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, b);
      el('ellipse', { cx: s * 25, cy: 81, rx: 17, ry: 8.5, fill: '#15161a', stroke: RIM, 'stroke-width': 2 }, b);
      [-1, 0, 1].forEach((k) => el('line', { x1: s * 25 + k * 7, y1: 86, x2: s * 25 + k * 7, y2: 91, stroke: '#cfc9bb', 'stroke-width': 2, 'stroke-linecap': 'round' }, b));
    });
    el('path', { d: 'M -36,-36 Q -16,-16 0,-4 Q 16,-16 36,-36 L 29,-42 Q 14,-26 0,-16 Q -14,-26 -29,-42 Z', fill: '#f1e9d2' }, b); // V 字形白斑
    [-1, 1].forEach((s) => { el('circle', { cx: s * 34, cy: -122, r: 15, fill: FUR, stroke: RIM, 'stroke-width': 2.5 }, b); el('circle', { cx: s * 34, cy: -122, r: 7, fill: '#3a3b44' }, b); });
    el('circle', { cx: 0, cy: -88, r: 42, fill: FUR, stroke: RIM, 'stroke-width': 3 }, b);
    el('ellipse', { cx: 0, cy: -72, rx: 21, ry: 16, fill: '#8a6a4c' }, b);
    el('ellipse', { cx: 0, cy: -80, rx: 8.5, ry: 6, fill: '#0b0b0d' }, b);
    el('path', { d: 'M -7,-67 Q 0,-62 7,-67', fill: 'none', stroke: '#2a1e14', 'stroke-width': 2, 'stroke-linecap': 'round' }, b);
    [-1, 1].forEach((s) => { el('circle', { cx: s * 16, cy: -98, r: 4.2, fill: '#08080a' }, b); el('circle', { cx: s * 16 + 1.4, cy: -99.5, r: 1.4, fill: '#ffffff' }, b); });
    return b;
  };

  // ---------- 臺灣獼猴（側面、四肢著地、朝右；腳底 y=60） ----------
  B.macaque = (p) => {
    const b = g(p);
    const FUR = '#8c7c66', FAR = '#6f604e', LINE = '#c4b49a', HAND = '#5a4a3a';
    const limb = (d, c, w) => el('path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    el('path', { d: 'M -60,-18 C -84,-34 -100,-14 -100,14 C -100,30 -96,42 -92,50', fill: 'none', stroke: FUR, 'stroke-width': 8, 'stroke-linecap': 'round' }, b); // 尾巴
    limb('M -36,0 C -42,18 -36,30 -28,36 C -30,44 -30,52 -28,58', FAR, 11); // 遠側後腳
    limb('M 30,4 C 30,22 26,38 28,58', FAR, 9); // 遠側前腳
    el('path', { d: 'M 52,-26 C 30,-44 -24,-46 -52,-30 C -66,-22 -68,-4 -56,6 C -30,16 24,14 48,6 C 60,0 62,-18 52,-26 Z', fill: FUR, stroke: LINE, 'stroke-width': 2 }, b);
    limb('M -48,-4 C -56,18 -50,30 -42,36 C -44,44 -44,52 -44,58', FUR, 13); // 近側後腳（膝蓋向前）
    limb('M 42,0 C 46,20 42,38 44,58', FUR, 10); // 近側前腳
    [[-28, 60, FAR], [28, 60, FAR], [-42, 60, HAND], [46, 60, HAND]].forEach(([x, y, c]) => el('ellipse', { cx: x + 4, cy: y, rx: 9, ry: 4, fill: c }, b));
    el('ellipse', { cx: 62, cy: -46, rx: 7, ry: 8, fill: '#c98a80' }, b);
    el('circle', { cx: 74, cy: -38, r: 24, fill: FUR, stroke: LINE, 'stroke-width': 2 }, b);
    el('path', { d: 'M 78,-52 C 96,-54 104,-40 102,-26 C 100,-14 90,-10 82,-14 C 74,-20 72,-42 78,-52 Z', fill: '#e2a395' }, b); // 粉紅色的臉
    el('path', { d: 'M 82,-45 C 88,-48 96,-48 100,-44', fill: 'none', stroke: '#6a4a3e', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, b);
    el('circle', { cx: 92, cy: -40, r: 2.8, fill: '#1b120e' }, b);
    el('circle', { cx: 100, cy: -29, r: 1.4, fill: '#7a4a40' }, b);
    el('path', { d: 'M 90,-20 Q 95,-18 99,-21', fill: 'none', stroke: '#7a4a40', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, b);
    return b;
  };

  // ---------- 異色瓢蟲（俯視；約 100 寬） ----------
  // 色型：'many' 橙色多斑、'none' 橙色無斑、'red' 紅色少斑、'black2' 黑色二紅斑、'black4' 黑色四紅斑
  const LB = {
    many: { c: '#e98a2c', s: '#1a120c', pts: [[14, -22, 6], [30, -10, 6], [12, 2, 6.5], [30, 14, 6], [16, 24, 6.5], [30, 32, 5.5], [8, 40, 5.5], [20, 44, 5], [32, -26, 5]] },
    none: { c: '#ef9a3a', s: '#1a120c', pts: [] },
    red: { c: '#cf3a2c', s: '#1a120c', pts: [[18, -12, 7], [22, 20, 7.5]] },
    black2: { c: '#1d1b1a', s: '#e5462e', pts: [[18, -14, 12]] },
    black4: { c: '#1d1b1a', s: '#e5462e', pts: [[18, -18, 9], [20, 22, 9]] },
  };
  B.ladybug = (p, kind = 'many') => {
    const b = g(p);
    const t = LB[kind];
    [-1, 1].forEach((s) => [-22, 0, 22].forEach((y, i) => el('path', { d: `M ${s * 30},${y} L ${s * 50},${y + (i - 1) * 8 + 2} L ${s * 56},${y + (i - 1) * 10 + 10}`, fill: 'none', stroke: '#2b2420', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b)));
    el('ellipse', { cx: 0, cy: -52, rx: 14, ry: 9, fill: '#151210' }, b);
    [-1, 1].forEach((s) => el('ellipse', { cx: s * 6, cy: -55, rx: 3.2, ry: 2.2, fill: '#efe6cc' }, b));
    el('ellipse', { cx: 0, cy: -40, rx: 30, ry: 12, fill: '#f0e8d0', stroke: '#3a2c20', 'stroke-width': 2 }, b);
    el('path', { d: 'M -14,-31 L -10,-44 L 0,-36 L 10,-44 L 14,-31 L 6,-31 L 0,-36 L -6,-31 Z', fill: '#151210' }, b); // 前胸背板的 M 形黑紋
    const ely = 'M 0,-32 C 26,-34 44,-16 44,8 C 44,34 26,52 0,54 C -26,52 -44,34 -44,8 C -44,-16 -26,-34 0,-32 Z';
    el('path', { d: ely, fill: t.c, stroke: kind.startsWith('black') ? '#6a5a50' : '#3a2410', 'stroke-width': 2.5 }, b);
    t.pts.forEach(([x, y, r]) => [-1, 1].forEach((s) => el('circle', { cx: s * x, cy: y, r, fill: t.s }, b)));
    if (kind === 'many') el('circle', { cx: 0, cy: -27, r: 5, fill: t.s }, b);
    el('line', { x1: 0, y1: -32, x2: 0, y2: 54, stroke: kind.startsWith('black') ? '#5a4a40' : '#5a2a10', 'stroke-width': 2 }, b);
    el('ellipse', { cx: -18, cy: -14, rx: 10, ry: 5, fill: '#ffffff', opacity: 0.25, transform: 'rotate(-35 -18 -14)' }, b);
    return b;
  };

  // ---------- 甘藍家族（同一種植物經人類選育）：高麗菜、青花菜、白花椰菜；底部 y=0 ----------
  B.cabbage = (p) => {
    const b = g(p);
    [[-46, -6, 30, '#6fa34a'], [46, -6, -30, '#6fa34a']].forEach(([x, y, r, c]) => el('path', { d: 'M 0,0 C -16,-10 -20,-40 0,-56 C 20,-40 16,-10 0,0 Z', fill: c, stroke: '#3f6e2c', 'stroke-width': 2, transform: `translate(${x},${y}) rotate(${r * 2.4})` }, b));
    el('circle', { cx: 0, cy: -44, r: 44, fill: '#bfe08f', stroke: '#6f9a48', 'stroke-width': 3 }, b);
    ['M -30,-70 C -10,-84 20,-80 34,-60', 'M -40,-40 C -20,-60 18,-62 40,-40', 'M -36,-14 C -10,-30 20,-30 38,-14'].forEach((d) => el('path', { d, fill: 'none', stroke: '#8fbf5c', 'stroke-width': 3 }, b));
    el('path', { d: 'M 0,-86 L 0,-6', stroke: '#e6f3c8', 'stroke-width': 3 }, b);
    return b;
  };
  B.broccoli = (p) => {
    const b = g(p);
    el('path', { d: 'M -14,0 L -10,-50 L 10,-50 L 14,0 Z', fill: '#8fc06a', stroke: '#4f7f3a', 'stroke-width': 2 }, b);
    el('path', { d: 'M -8,-46 L -30,-66 M 8,-46 L 30,-66 M 0,-50 L 0,-72', stroke: '#8fc06a', 'stroke-width': 8, 'stroke-linecap': 'round' }, b);
    [[-34, -76, 22], [0, -92, 26], [34, -76, 22], [-16, -74, 18], [18, -72, 18]].forEach(([x, y, r]) => {
      el('circle', { cx: x, cy: y, r, fill: '#3f7a3a', stroke: '#285a2a', 'stroke-width': 2 }, b);
      for (let i = 0; i < 6; i++) { const a = i * 1.05; el('circle', { cx: x + Math.cos(a) * r * 0.5, cy: y + Math.sin(a) * r * 0.5, r: r * 0.28, fill: '#4f8f46' }, b); }
    });
    return b;
  };
  B.cauliflower = (p) => {
    const b = g(p);
    [[-50, 30], [50, -30], [-34, 12], [34, -12]].forEach(([x, r]) => el('path', { d: 'M 0,0 C -14,-12 -18,-44 0,-60 C 18,-44 14,-12 0,0 Z', fill: '#5f9a46', stroke: '#3f6e2c', 'stroke-width': 2, transform: `translate(${x * 0.3},-4) rotate(${r * 2})` }, b));
    el('path', { d: 'M -46,-40 C -46,-74 -20,-90 0,-90 C 20,-90 46,-74 46,-40 C 30,-30 -30,-30 -46,-40 Z', fill: '#f2ecd6', stroke: '#c9bf9a', 'stroke-width': 2.5 }, b);
    [[-24, -58], [0, -70], [24, -58], [-10, -48], [14, -46]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 12, fill: 'none', stroke: '#d8cfaa', 'stroke-width': 2 }, b));
    return b;
  };

  // ---------- 樹（底部在 (0,0)） ----------
  B.broadleaf = (p, { h = 160, c1 = '#3f8f46', c2 = '#5fae52', trunk = '#6b4a2e', seed = 3 } = {}) => {
    const t = g(p);
    const w = h * 0.42;
    el('path', { d: `M ${-h * 0.05},0 C ${-h * 0.04},${-h * 0.25} ${-h * 0.03},${-h * 0.4} ${-h * 0.02},${-h * 0.5} L ${h * 0.02},${-h * 0.5} C ${h * 0.03},${-h * 0.4} ${h * 0.04},${-h * 0.25} ${h * 0.05},0 Z`, fill: trunk }, t);
    el('path', { d: `M 0,${-h * 0.42} L ${-h * 0.14},${-h * 0.6} M 0,${-h * 0.46} L ${h * 0.13},${-h * 0.64}`, stroke: trunk, 'stroke-width': h * 0.03, 'stroke-linecap': 'round' }, t);
    const r = S.rng(seed);
    const blobs = [[0, -0.72, 0.3], [-0.2, -0.62, 0.22], [0.2, -0.64, 0.22], [-0.1, -0.86, 0.2], [0.12, -0.86, 0.2], [0, -0.55, 0.2]];
    blobs.forEach(([x, y, rr]) => el('circle', { cx: x * h * 1.1 + (r() - 0.5) * 6, cy: y * h, r: rr * h * 0.9, fill: c1 }, t));
    blobs.slice(0, 5).forEach(([x, y, rr]) => el('circle', { cx: x * h * 1.1 - rr * h * 0.2, cy: y * h - rr * h * 0.25, r: rr * h * 0.55, fill: c2, opacity: 0.85 }, t));
    t.w = w;
    return t;
  };
  B.conifer = (p, { h = 180, c1 = '#2f6a46', c2 = '#3f7f52', trunk = '#5a3e28' } = {}) => {
    const t = g(p);
    el('rect', { x: -h * 0.03, y: -h * 0.2, width: h * 0.06, height: h * 0.2, fill: trunk }, t);
    const n = 5;
    for (let i = 0; i < n; i++) {
      const yb = -h * 0.12 - i * h * 0.16, w = h * (0.34 - i * 0.055), top = yb - h * 0.3;
      el('path', { d: `M 0,${top} C ${w * 0.3},${top + h * 0.12} ${w * 0.7},${yb - h * 0.04} ${w},${yb} C ${w * 0.5},${yb - h * 0.02} ${-w * 0.5},${yb - h * 0.02} ${-w},${yb} C ${-w * 0.7},${yb - h * 0.04} ${-w * 0.3},${top + h * 0.12} 0,${top} Z`, fill: i % 2 ? c2 : c1, stroke: '#1f4a32', 'stroke-width': 1.2 }, t);
    }
    return t;
  };
  // 筆筒樹（樹蕨）
  // 筆筒樹（樹蕨）：粗壯的樹幹上有葉柄脫落的痕跡，頂端長出大型的羽狀複葉，向外拱出、末端下垂
  B.treefern = (p, { h = 170 } = {}) => {
    const t = g(p);
    const TH = h * 0.64, top = [0, -TH];
    const w0 = h * 0.055, w1 = h * 0.042;
    el('path', { d: `M ${-w0 * 1.3},0 C ${-w0},${-TH * 0.3} ${-w1},${-TH * 0.7} ${-w1},${-TH} L ${w1},${-TH} C ${w1},${-TH * 0.7} ${w0},${-TH * 0.3} ${w0 * 1.3},0 Z`, fill: '#4a3a2c', stroke: '#2e241a', 'stroke-width': 1.5 }, t);
    // 葉痕：斜排的橢圓形疤痕
    for (let i = 0; i < 14; i++) for (let k = -1; k <= 1; k++) {
      const y = -TH * (0.06 + i * 0.065), x = k * w1 * 0.55 + (i % 2 ? w1 * 0.28 : 0);
      if (Math.abs(x) > w1 * 0.8) continue;
      el('ellipse', { cx: x, cy: y, rx: w1 * 0.2, ry: w1 * 0.3, fill: '#6e5a44', opacity: 0.85 }, t);
    }
    // 頂端下方枯黃下垂的老葉
    [-1, 1].forEach((s) => [0.16, 0.22].forEach((L, j) => {
      const ex = s * h * L * 0.4, ey = -TH + h * (0.14 + j * 0.05);
      el('path', { d: `M ${s * 2},${-TH + 4} Q ${s * h * L * 0.4},${-TH - 4} ${ex},${ey}`, fill: 'none', stroke: '#8a6a3a', 'stroke-width': 3, 'stroke-linecap': 'round' }, t);
      for (let k = 1; k < 6; k++) { const u = k / 6, x = S.lerp(s * 2, ex, u), y = S.lerp(-TH + 2, ey, u * u); el('line', { x1: x, y1: y, x2: x - s * 3, y2: y + 7, stroke: '#9a7a46', 'stroke-width': 2 }, t); }
    }));
    // 綠色的大羽狀葉
    const fronds = [[-168, 0.62], [-150, 0.66], [-128, 0.6], [-104, 0.5], [-78, 0.5], [-52, 0.6], [-30, 0.66], [-12, 0.62], [-90, 0.42]];
    fronds.forEach(([ang, L], fi) => {
      const a = (ang * Math.PI) / 180, len = h * L;
      const dx = Math.cos(a), dy = Math.sin(a);
      const cx = top[0] + dx * len * 0.55, cy = top[1] + dy * len * 0.55 - len * 0.12;
      const ex = top[0] + dx * len, ey = top[1] + dy * len * 0.55 + len * 0.28 * Math.abs(dx);
      const col = fi % 2 ? '#5fae4a' : '#4f9a3e', light = fi % 2 ? '#8fd06a' : '#7fc25a';
      for (let k = 1; k < 15; k++) {
        const u = k / 15;
        const qx = (1 - u) * (1 - u) * top[0] + 2 * (1 - u) * u * cx + u * u * ex, qy = (1 - u) * (1 - u) * top[1] + 2 * (1 - u) * u * cy + u * u * ey;
        let tx = 2 * (1 - u) * (cx - top[0]) + 2 * u * (ex - cx), ty = 2 * (1 - u) * (cy - top[1]) + 2 * u * (ey - cy);
        const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
        const ll = h * 0.075 * Math.sin(Math.PI * (0.15 + u * 0.85)) + 2;
        [-1, 1].forEach((s) => {
          const px = qx + (-ty * s * 0.85 + tx * 0.5) * ll, py = qy + (tx * s * 0.85 + ty * 0.5) * ll;
          const ang2 = (Math.atan2(py - qy, px - qx) * 180) / Math.PI;
          el('ellipse', { cx: (qx + px) / 2, cy: (qy + py) / 2, rx: ll / 2, ry: Math.max(1.6, ll * 0.16), fill: s > 0 ? col : light, transform: `rotate(${ang2.toFixed(1)} ${((qx + px) / 2).toFixed(1)} ${((qy + py) / 2).toFixed(1)})` }, t);
        });
      }
      el('path', { d: `M ${top[0]},${top[1]} Q ${cx},${cy} ${ex},${ey}`, fill: 'none', stroke: '#3f7a2e', 'stroke-width': 2.4 }, t);
    });
    return t;
  };
  B.shrub = (p, { w = 70, c = '#4f9a4a' } = {}) => {
    const t = g(p);
    [[-0.3, 0.32], [0.3, 0.3], [0, 0.42]].forEach(([x, r]) => el('circle', { cx: x * w, cy: -r * w * 0.8, r: r * w, fill: c }, t));
    [[-0.28, 0.16], [0.08, 0.2]].forEach(([x, r]) => el('circle', { cx: x * w, cy: -w * 0.5, r: r * w, fill: '#6fbf5a', opacity: 0.8 }, t));
    return t;
  };

  // ---------- 森林用的圖：有深淺層次的闊葉樹、遠方的樹、蕨類、草花、倒木、蕈類、甲蟲、落葉 ----------
  // 闊葉樹（底部在 (0,0)）：樹冠由許多葉團組成，三種深淺表現立體感
  B.richTree = (p, { h = 300, w = 200, seed = 1, pal = {} } = {}) => {
    const t = g(p);
    const P = { dark: '#24583a', mid: '#3a8046', light: '#6fb35a', trunk: '#6b4c32', bark: '#4a3424', ...pal };
    const r = S.rng(seed);
    const CY = -h * 0.7, RX = w / 2, RY = h * 0.27;
    // 樹幹與主枝
    const tw = h * 0.045;
    el('path', { d: `M ${-tw * 1.8},0 C ${-tw},${-h * 0.05} ${-tw},${-h * 0.3} ${-tw * 0.7},${-h * 0.55} L ${tw * 0.7},${-h * 0.55} C ${tw},${-h * 0.3} ${tw},${-h * 0.05} ${tw * 1.8},0 Z`, fill: P.trunk, stroke: P.bark, 'stroke-width': 1.5 }, t);
    for (let i = 0; i < 4; i++) el('path', { d: `M ${-tw * 0.5 + i * tw * 0.35},${-h * 0.04} C ${-tw * 0.4 + i * tw * 0.3},${-h * 0.2} ${-tw * 0.5 + i * tw * 0.35},${-h * 0.35} ${-tw * 0.3 + i * tw * 0.2},${-h * 0.5}`, fill: 'none', stroke: P.bark, 'stroke-width': 1.2, opacity: 0.7 }, t);
    [[-0.32, -0.74], [0.3, -0.78], [0.02, -0.86]].forEach(([ex, ey]) => el('path', { d: `M 0,${-h * 0.5} Q ${ex * RX * 0.5},${-h * 0.62} ${ex * RX},${ey * h}`, fill: 'none', stroke: P.trunk, 'stroke-width': tw * 0.9, 'stroke-linecap': 'round' }, t));
    // 葉團
    const blobs = [];
    for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.82;
      blobs.push([Math.cos(a) * RX * d, CY + Math.sin(a) * RY * d, RX * (0.26 + r() * 0.12)]);
    }
    blobs.sort((A, Bb) => A[1] - Bb[1]);
    blobs.forEach(([x, y, rr]) => el('circle', { cx: x + rr * 0.16, cy: y + rr * 0.2, r: rr, fill: P.dark }, t));
    blobs.forEach(([x, y, rr]) => el('circle', { cx: x, cy: y, r: rr * 0.88, fill: P.mid }, t));
    blobs.forEach(([x, y, rr]) => { if (y < CY + RY * 0.2) el('circle', { cx: x - rr * 0.28, cy: y - rr * 0.3, r: rr * 0.48, fill: P.light, opacity: 0.85 }, t); });
    t.crown = { cx: 0, cy: CY, rx: RX, ry: RY };
    return t;
  };
  // 遠方的樹林：一排顏色較暗的樹冠
  B.farTrees = (p, x0, x1, y, { c1 = '#1d3d34', c2 = '#23493c', seed = 2 } = {}) => {
    const t = g(p), r = S.rng(seed);
    for (let x = x0; x < x1; x += 26 + r() * 20) { const rr = 22 + r() * 22; el('circle', { cx: x, cy: y - rr * 0.6 - r() * 30, r: rr, fill: r() < 0.5 ? c1 : c2 }, t); }
    el('rect', { x: x0 - 30, y: y - 30, width: x1 - x0 + 60, height: 200, fill: c1 }, t);
    return t;
  };
  // 一叢蕨類（底部在 (0,0)）：拱起的羽狀葉，葉片朝上斜伸
  B.fernClump = (p, { s = 1, c = '#4f9a3e', c2 = '#6fbf4a' } = {}) => {
    const t = g(p);
    [-62, -48, -34, -146, -132, -118, -90, -76, -104].forEach((ang, i) => {
      const a = (ang * Math.PI) / 180, L = (40 + (i % 3) * 8) * s;
      const ex = Math.cos(a) * L * 1.1, ey = Math.sin(a) * L * 0.75 + L * 0.25 * Math.abs(Math.cos(a));
      const cx = Math.cos(a) * L * 0.5, cy = Math.sin(a) * L * 0.9;
      for (let k = 1; k < 9; k++) {
        const u = k / 9, qx = 2 * (1 - u) * u * cx + u * u * ex, qy = 2 * (1 - u) * u * cy + u * u * ey;
        let tx = 2 * (1 - u) * cx + 2 * u * (ex - cx), ty = 2 * (1 - u) * cy + 2 * u * (ey - cy); const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
        const ll = 8 * s * (1 - u * 0.6);
        [-1, 1].forEach((sd) => el('line', { x1: qx, y1: qy, x2: qx + (-ty * sd + tx * 0.6) * ll, y2: qy + (tx * sd + ty * 0.6) * ll, stroke: sd > 0 ? c : c2, 'stroke-width': 2.6 * s, 'stroke-linecap': 'round' }, t));
      }
      el('path', { d: `M 0,0 Q ${cx},${cy} ${ex},${ey}`, fill: 'none', stroke: '#3f7a2e', 'stroke-width': 1.6 * s }, t);
    });
    return t;
  };
  // 開花的草本植物（底部在 (0,0)）
  B.herbs = (p, { s = 1, flower = '#f6f2e6', center = '#e8b23a' } = {}) => {
    const t = g(p);
    [[-14, -48], [0, -62], [14, -44], [26, -30]].forEach(([dx, hh]) => {
      el('path', { d: `M ${dx * 0.3 * s},0 C ${dx * 0.5 * s},${hh * 0.4 * s} ${dx * s},${hh * 0.7 * s} ${dx * s},${hh * s}`, fill: 'none', stroke: '#5f9a46', 'stroke-width': 2.2 * s }, t);
      [[0.45, -1], [0.62, 1]].forEach(([u, sd]) => { const x = dx * s * (0.4 + u * 0.5), y = hh * s * u; el('ellipse', { cx: x + sd * 7 * s, cy: y - 3 * s, rx: 8 * s, ry: 3.2 * s, fill: '#6fae4a', transform: `rotate(${sd * -30} ${x} ${y})` }, t); });
      for (let k = 0; k < 5; k++) { const a = (k / 5) * 6.283; el('ellipse', { cx: dx * s + Math.cos(a) * 4.5 * s, cy: hh * s + Math.sin(a) * 4.5 * s, rx: 3.6 * s, ry: 2.6 * s, fill: flower, transform: `rotate(${(a * 180) / Math.PI} ${dx * s + Math.cos(a) * 4.5 * s} ${hh * s + Math.sin(a) * 4.5 * s})` }, t); }
      el('circle', { cx: dx * s, cy: hh * s, r: 2.4 * s, fill: center }, t);
    });
    return t;
  };
  // 長滿苔蘚的倒木（中心在 (0,0)，長 L）
  B.log = (p, { L = 140 } = {}) => {
    const t = g(p);
    el('path', { d: `M ${-L / 2},-14 L ${L / 2 - 8},-17 C ${L / 2 + 4},-17 ${L / 2 + 4},13 ${L / 2 - 8},13 L ${-L / 2},14 Z`, fill: '#6b4c32', stroke: '#3e2a1a', 'stroke-width': 2 }, t);
    el('ellipse', { cx: -L / 2, cy: 0, rx: 9, ry: 14, fill: '#b08a5a', stroke: '#3e2a1a', 'stroke-width': 2 }, t);
    el('ellipse', { cx: -L / 2, cy: 0, rx: 4.5, ry: 7, fill: 'none', stroke: '#8a6a44', 'stroke-width': 1.5 }, t);
    [[-L * 0.3, -14, 22], [L * 0.05, -16, 28], [L * 0.32, -15, 16]].forEach(([x, y, w]) => el('path', { d: `M ${x - w / 2},${y + 3} C ${x - w / 3},${y - 5} ${x + w / 3},${y - 6} ${x + w / 2},${y + 3} Z`, fill: '#6fa83a' }, t));
    for (let i = 0; i < 5; i++) el('line', { x1: -L * 0.4 + i * L * 0.18, y1: -4, x2: -L * 0.3 + i * L * 0.18, y2: 6, stroke: '#4a3424', 'stroke-width': 1.5 }, t);
    return t;
  };
  // 傘形的小蕈（菌蓋寬、柄短）
  B.mushroom = (p, { s = 1, cap = '#c9783a' } = {}) => {
    const t = g(p);
    el('path', { d: `M ${-2 * s},0 L ${-1.6 * s},${-6 * s} L ${1.6 * s},${-6 * s} L ${2 * s},0 Z`, fill: '#efe6cc' }, t);
    el('path', { d: `M ${-10 * s},${-5.5 * s} C ${-9 * s},${-13 * s} ${9 * s},${-13 * s} ${10 * s},${-5.5 * s} Z`, fill: cap, stroke: '#7a4a24', 'stroke-width': 1 }, t);
    [[-4, -9], [3, -10]].forEach(([x, y]) => el('circle', { cx: x * s, cy: y * s, r: 1.2 * s, fill: '#f6efdc' }, t));
    return t;
  };
  // 甲蟲（俯視、頭朝上；長約 34）
  B.beetle = (p) => {
    const t = g(p);
    [[-1, -4], [-1, 3], [-1, 10], [1, -4], [1, 3], [1, 10]].forEach(([s, y], i) => el('path', { d: `M ${s * 6},${y} L ${s * 13},${y + (i % 3 - 1) * 4 - 2} L ${s * 15},${y + (i % 3 - 1) * 6 + 2}`, fill: 'none', stroke: '#1a120c', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, t));
    el('path', { d: 'M -3,-16 L -6,-24 M 3,-16 L 6,-24', stroke: '#1a120c', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, t);
    el('ellipse', { cx: 0, cy: -13, rx: 4, ry: 3.5, fill: '#2a1a10' }, t);
    el('ellipse', { cx: 0, cy: -7, rx: 7, ry: 5, fill: '#4a2614', stroke: '#c8925a', 'stroke-width': 1 }, t);
    el('path', { d: 'M -8,-2 C -9,8 -6,16 0,18 C 6,16 9,8 8,-2 Z', fill: '#5a2c16', stroke: '#c8925a', 'stroke-width': 1 }, t);
    el('line', { x1: 0, y1: -2, x2: 0, y2: 17, stroke: '#2a1408', 'stroke-width': 1 }, t);
    el('ellipse', { cx: -3.5, cy: 4, rx: 1.6, ry: 5, fill: '#e8b88a', opacity: 0.55 }, t);
    return t;
  };
  // 森林地面的落葉
  B.litter = (p, x0, x1, y0, y1, n = 60, seed = 4) => {
    const t = g(p), r = S.rng(seed), cols = ['#a8642a', '#c98a3a', '#8a5a2a', '#d9b04a', '#6a7a3a'];
    for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); el('ellipse', { cx: x, cy: y, rx: 4 + r() * 3, ry: 1.8 + r() * 1.4, fill: cols[i % cols.length], transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`, opacity: 0.9 }, t); }
    return t;
  };

  // ---------- 小動物 ----------
  B.butterfly = (p, { c = '#f0a030', c2 = '#2a2a2a' } = {}) => {
    const b = g(p);
    [-1, 1].forEach((s) => {
      el('path', { d: `M 0,-4 C ${s * 14},-30 ${s * 44},-40 ${s * 50},-26 C ${s * 54},-12 ${s * 30},-2 0,0 Z`, fill: c, stroke: c2, 'stroke-width': 2.5 }, b);
      el('path', { d: `M 0,2 C ${s * 26},2 ${s * 40},12 ${s * 34},28 C ${s * 26},40 ${s * 8},26 0,6 Z`, fill: c, stroke: c2, 'stroke-width': 2.5 }, b);
      el('circle', { cx: s * 40, cy: -26, r: 4, fill: '#f6f2e6' }, b);
      el('circle', { cx: s * 24, cy: 22, r: 3.5, fill: c2 }, b);
      el('path', { d: `M ${s * 2},-12 C ${s * 6},-26 ${s * 12},-34 ${s * 16},-38`, fill: 'none', stroke: c2, 'stroke-width': 2 }, b);
    });
    el('ellipse', { cx: 0, cy: 2, rx: 3.5, ry: 16, fill: c2 }, b);
    return b;
  };
  B.frog = (p) => {
    const b = g(p);
    const SKIN = '#6fbf4a', DARK = '#2f6a2a';
    // 摺起來的後腳：大腿、小腿、長長的腳趾向前
    el('path', { d: 'M -46,14 C -54,26 -44,32 -30,30 L 6,30 C 12,30 12,26 6,25 L -24,22 Z', fill: '#5aa63e', stroke: DARK, 'stroke-width': 2 }, b);
    el('path', { d: 'M 2,28 l 14,-3 M 2,30 l 16,1 M 2,31 l 13,4', stroke: DARK, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, b);
    // 身體：頭在右、背部斜向後方
    el('path', { d: 'M 48,-4 C 46,-16 36,-24 24,-24 C 12,-24 4,-20 -8,-18 C -28,-14 -46,-4 -50,10 C -52,22 -42,28 -28,28 L 18,28 C 36,26 48,12 48,-4 Z', fill: SKIN, stroke: DARK, 'stroke-width': 2.5 }, b);
    el('path', { d: 'M 40,10 C 30,22 4,26 -24,26 C -6,22 20,18 40,10 Z', fill: '#d8ecb0', opacity: 0.8 }, b); // 淺色的腹部
    [[-20, -6, 4], [-4, -12, 3], [-32, 6, 3.5]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#4a9a34' }, b));
    // 大腿（摺在身體旁）
    el('ellipse', { cx: -26, cy: 10, rx: 22, ry: 11, fill: '#5fb040', stroke: DARK, 'stroke-width': 2, transform: 'rotate(-18 -26 10)' }, b);
    // 前腳
    el('path', { d: 'M 22,6 L 26,28 M 26,28 l 8,1 M 26,28 l -6,2', fill: 'none', stroke: DARK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, b);
    // 鼓膜、嘴線
    el('circle', { cx: 10, cy: -10, r: 5.5, fill: '#4f9a3a', stroke: DARK, 'stroke-width': 1.5 }, b);
    el('path', { d: 'M 48,-3 C 38,0 28,0 18,-4', fill: 'none', stroke: DARK, 'stroke-width': 2 }, b);
    // 突出頭頂的眼睛
    el('circle', { cx: 28, cy: -24, r: 8.5, fill: SKIN, stroke: DARK, 'stroke-width': 2 }, b);
    el('circle', { cx: 29, cy: -25, r: 5.5, fill: '#e8c84a' }, b);
    el('ellipse', { cx: 29, cy: -25, rx: 3.6, ry: 2, fill: '#111' }, b);
    return b;
  };
  // 赤腹松鼠（側面、坐著、朝右；底部 y=30）
  B.squirrel = (p) => {
    const b = g(p);
    el('path', { d: 'M -14,24 C -60,26 -70,-20 -50,-56 C -40,-74 -16,-76 -10,-60 C -26,-50 -34,-20 -14,0 Z', fill: '#7d6a58', stroke: '#b8a48c', 'stroke-width': 2 }, b);
    el('path', { d: 'M 22,-30 C 36,-20 34,10 22,26 L -14,28 C -22,10 -16,-20 0,-30 C 8,-34 16,-34 22,-30 Z', fill: '#7d6a58', stroke: '#b8a48c', 'stroke-width': 2 }, b);
    el('path', { d: 'M 18,-18 C 26,-6 24,12 16,24 L 4,24 C 10,10 12,-6 8,-16 Z', fill: '#b5553a' }, b); // 紅褐色的腹部
    el('ellipse', { cx: 28, cy: -40, rx: 17, ry: 14, fill: '#7d6a58', stroke: '#b8a48c', 'stroke-width': 2 }, b);
    el('path', { d: 'M 20,-50 L 22,-64 L 30,-52 Z', fill: '#6a5848' }, b);
    el('circle', { cx: 34, cy: -43, r: 3, fill: '#111' }, b);
    el('circle', { cx: 44, cy: -38, r: 2, fill: '#3a2a20' }, b);
    el('path', { d: 'M 24,-14 L 36,-8', stroke: '#6a5848', 'stroke-width': 4, 'stroke-linecap': 'round' }, b);
    return b;
  };
  // 樹幹上的層孔菌（扁平、像架子）
  B.bracket = (p) => {
    const b = g(p);
    [[0, 0, 1], [8, 18, 0.8], [-6, 32, 0.65]].forEach(([x, y, s]) => el('path', { d: `M ${x},${y} C ${x + 10 * s},${y - 10 * s} ${x + 40 * s},${y - 12 * s} ${x + 46 * s},${y - 2 * s} C ${x + 44 * s},${y + 4 * s} ${x + 20 * s},${y + 6 * s} ${x},${y + 4 * s} Z`, fill: '#c9925a', stroke: '#7a5030', 'stroke-width': 2 }, b));
    return b;
  };

  // ---------- 浮游植物（矽藻、綠藻） ----------
  B.plankton = (p, kind = 0) => {
    const b = g(p);
    if (kind === 0) { // 長形的矽藻
      el('rect', { x: -16, y: -6, width: 32, height: 12, rx: 6, fill: '#c9b45a', stroke: '#7a6a2a', 'stroke-width': 1.5 }, b);
      for (let i = -12; i <= 12; i += 4) el('line', { x1: i, y1: -5, x2: i, y2: 5, stroke: '#8a7a3a', 'stroke-width': 1 }, b);
    } else if (kind === 1) { // 圓形的矽藻
      el('circle', { cx: 0, cy: 0, r: 10, fill: '#b9c46a', stroke: '#6a7a2a', 'stroke-width': 1.5 }, b);
      for (let i = 0; i < 8; i++) { const a = i * 0.785; el('line', { x1: Math.cos(a) * 3, y1: Math.sin(a) * 3, x2: Math.cos(a) * 9, y2: Math.sin(a) * 9, stroke: '#7a8a3a', 'stroke-width': 1 }, b); }
    } else { // 綠藻的一串細胞
      [-10, 0, 10].forEach((x) => el('ellipse', { cx: x, cy: 0, rx: 6, ry: 7.5, fill: '#6fce62', stroke: '#2f7a3a', 'stroke-width': 1.5 }, b));
    }
    return b;
  };

  // ---------- 外來入侵種 ----------
  // 福壽螺（側面、朝右；腹足在 y=0）
  B.snail = (p) => {
    const b = g(p);
    el('path', { d: 'M -30,0 C -34,-4 -20,-10 0,-8 L 52,-6 C 66,-6 72,0 66,4 L -26,6 Z', fill: '#8a7a64', stroke: '#c4b496', 'stroke-width': 2 }, b); // 腹足
    el('path', { d: 'M 50,-6 C 62,-20 72,-30 84,-34 M 44,-6 C 52,-22 58,-34 66,-42', fill: 'none', stroke: '#8a7a64', 'stroke-width': 4, 'stroke-linecap': 'round' }, b); // 觸角
    const shell = 'M 40,-8 C 50,-40 30,-74 -6,-76 C -24,-77 -36,-70 -40,-62 L -46,-74 L -54,-66 C -50,-58 -54,-48 -52,-38 C -48,-12 -20,0 4,-2 C 22,-4 34,-4 40,-8 Z';
    el('path', { d: shell, fill: B.grad(b, [[0, '#a2803a'], [0.6, '#7a5a26'], [1, '#5a3e1a']], { x2: 1, y2: 1 }), stroke: '#d8c08a', 'stroke-width': 2.5 }, b);
    const sc = g(b, { 'clip-path': clipBy(b, shell) });
    ['M -50,-50 C -30,-62 10,-62 36,-40', 'M -48,-34 C -24,-48 14,-48 40,-26', 'M -40,-18 C -16,-30 18,-30 40,-14'].forEach((d) => el('path', { d, fill: 'none', stroke: '#3e2a12', 'stroke-width': 3, opacity: 0.7 }, sc));
    el('path', { d: 'M -40,-62 C -30,-56 -20,-58 -12,-64', fill: 'none', stroke: '#3e2a12', 'stroke-width': 2 }, b);
    el('path', { d: 'M 34,-10 C 38,-24 32,-36 20,-40 C 26,-28 26,-18 20,-8 Z', fill: '#4a3a24' }, b); // 殼口
    return b;
  };
  // 福壽螺的卵塊（粉紅色，產在水面上的莖上）
  B.eggs = (p) => {
    const b = g(p);
    const r = S.rng(5);
    for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = Math.sqrt(r()); el('circle', { cx: Math.cos(a) * d * 12, cy: Math.sin(a) * d * 26, r: 3.6, fill: i % 3 ? '#f06a9a' : '#ff8fb6', stroke: '#b83a6a', 'stroke-width': 0.8 }, b); }
    return b;
  };
  // 被小花蔓澤蘭覆蓋的樹
  B.mikania = (p, { h = 170, cover = 1 } = {}) => {
    const t = g(p);
    B.broadleaf(t, { h, c1: '#3f7f46', c2: '#4f9452', seed: 9 });
    const v = g(t, { opacity: cover });
    const r = S.rng(12);
    for (let i = 0; i < 9; i++) { const x = -h * 0.45 + i * h * 0.11; el('path', { d: `M ${x},${-h * 0.82 + r() * 20} C ${x + 10},${-h * 0.5} ${x - 8},${-h * 0.3} ${x + 4},${-h * 0.08}`, fill: 'none', stroke: '#9acd5a', 'stroke-width': 2.2 }, v); }
    const heart = 'M 0,6 C -10,-2 -10,-10 -4,-11 C -1,-11 0,-8 0,-7 C 0,-8 1,-11 4,-11 C 10,-10 10,-2 0,6 Z';
    for (let i = 0; i < 70; i++) {
      const a = r() * 6.28, d = Math.sqrt(r());
      const x = Math.cos(a) * d * h * 0.42, y = -h * 0.7 + Math.sin(a) * d * h * 0.3 + (r() < 0.3 ? h * 0.35 * r() : 0);
      el('path', { d: heart, fill: i % 4 ? '#a6d96a' : '#c6e98a', stroke: '#6a9a3a', 'stroke-width': 0.8, transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)}) scale(${(0.9 + r() * 0.5).toFixed(2)})` }, v);
    }
    for (let i = 0; i < 12; i++) { const x = (r() - 0.5) * h * 0.7, y = -h * (0.6 + r() * 0.3); for (let k = 0; k < 4; k++) el('circle', { cx: x + (k % 2) * 4, cy: y + Math.floor(k / 2) * 4, r: 2.4, fill: '#f6f6ee' }, v); }
    return t;
  };
  // 銀合歡（小喬木：羽狀複葉、白色球形花、扁平豆莢）
  B.leucaena = (p, { h = 180 } = {}) => {
    const t = g(p);
    el('path', { d: `M -5,0 C -4,${-h * 0.3} -2,${-h * 0.45} 0,${-h * 0.55} L 5,${-h * 0.55} C 5,${-h * 0.45} 5,${-h * 0.3} 7,0 Z`, fill: '#7a6a58' }, t);
    el('path', { d: `M 1,${-h * 0.42} L ${-h * 0.18},${-h * 0.58} M 3,${-h * 0.45} L ${h * 0.17},${-h * 0.6}`, stroke: '#7a6a58', 'stroke-width': 4, 'stroke-linecap': 'round' }, t);
    // 豆莢：扁平細長，成串垂下
    [[-h * 0.24, -h * 0.5], [h * 0.22, -h * 0.52], [h * 0.02, -h * 0.47]].forEach(([x, y]) => [-7, 0, 7].forEach((dx, i) => {
      const L = 44 + i * 4, cx = x + dx;
      el('path', { d: `M ${cx},${y} C ${cx - 3},${y + L * 0.4} ${cx + 1},${y + L * 0.75} ${cx - 2},${y + L} C ${cx + 4},${y + L * 0.75} ${cx + 6},${y + L * 0.4} ${cx + 4},${y} Z`, fill: i === 1 ? '#8a5a2e' : '#a06c38', stroke: '#5a3a1a', 'stroke-width': 1 }, t);
    }));
    // 二回羽狀複葉：每一根羽片兩側排滿小葉
    const pinna = (x0, y0, ang, L, col) => {
      const a = (ang * Math.PI) / 180, ex = x0 + Math.cos(a) * L, ey = y0 + Math.sin(a) * L;
      el('line', { x1: x0, y1: y0, x2: ex, y2: ey, stroke: '#5f8a40', 'stroke-width': 1.5 }, t);
      const nx = -Math.sin(a), ny = Math.cos(a), ux = Math.cos(a), uy = Math.sin(a);
      for (let i = 1; i <= 9; i++) {
        const u = i / 10, x = x0 + (ex - x0) * u, y = y0 + (ey - y0) * u, ll = 7;
        [-1, 1].forEach((s) => el('line', { x1: x, y1: y, x2: x + (nx * s + ux * 0.35) * ll, y2: y + (ny * s + uy * 0.35) * ll, stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' }, t));
      }
    };
    const cy = -h * 0.72;
    for (let i = 0; i < 16; i++) { const ang = -180 + i * 12 + (i % 2) * 4; pinna(2 + Math.cos((ang * Math.PI) / 180) * 12, cy + 18 + Math.sin((ang * Math.PI) / 180) * 8, ang, h * (0.26 + (i % 3) * 0.04), i % 2 ? '#7fbf5a' : '#6aae4a'); }
    for (let i = 0; i < 9; i++) { const ang = -160 + i * 18; pinna(2, cy + 10, ang, h * 0.16, '#8fd06a'); }
    // 白色的球形花
    [[-h * 0.22, cy - h * 0.02], [h * 0.2, cy - h * 0.04], [-h * 0.02, cy - h * 0.2], [h * 0.12, cy - h * 0.16]].forEach(([fx, fy]) => {
      for (let i = 0; i < 14; i++) { const b2 = i * 0.449; el('line', { x1: fx, y1: fy, x2: fx + Math.cos(b2) * 9, y2: fy + Math.sin(b2) * 9, stroke: '#f8f6ea', 'stroke-width': 2 }, t); }
      el('circle', { cx: fx, cy: fy, r: 4, fill: '#ffffff' }, t);
    });
    return t;
  };

  // ---------- 海龜（俯視、朝右） ----------
  B.turtle = (p) => {
    const b = g(p);
    const FL = { fill: '#8a8a5a', stroke: '#c8c89a', 'stroke-width': 2 };
    el('path', { d: 'M 20,-26 C 40,-56 70,-66 84,-60 C 70,-48 50,-30 34,-18 Z', ...FL }, b);
    el('path', { d: 'M 20,26 C 40,56 70,66 84,60 C 70,48 50,30 34,18 Z', ...FL }, b);
    el('path', { d: 'M -40,-20 C -56,-36 -70,-40 -76,-34 C -66,-26 -54,-18 -44,-12 Z M -40,20 C -56,36 -70,40 -76,34 C -66,26 -54,18 -44,12 Z', ...FL }, b);
    el('ellipse', { cx: 62, cy: 0, rx: 18, ry: 13, ...FL }, b);
    el('circle', { cx: 70, cy: -6, r: 2.6, fill: '#111' }, b);
    el('ellipse', { cx: 0, cy: 0, rx: 58, ry: 40, fill: '#6a5a32', stroke: '#c8b88a', 'stroke-width': 3 }, b);
    [[-24, 0], [6, 0], [32, 0]].forEach(([x]) => el('path', { d: `M ${x - 12},-12 L ${x},-18 L ${x + 12},-12 L ${x + 12},12 L ${x},18 L ${x - 12},12 Z`, fill: '#7d6a3c', stroke: '#b8a476', 'stroke-width': 1.5 }, b));
    return b;
  };
  B.bag = (p) => {
    const b = g(p);
    el('path', { d: 'M -30,-30 C -34,-56 -14,-60 -12,-34 M 12,-34 C 14,-60 34,-56 30,-30', fill: 'none', stroke: 'rgba(240,244,248,0.75)', 'stroke-width': 4 }, b);
    el('path', { d: 'M -34,-32 L 34,-32 C 40,0 36,30 26,40 C 10,46 -12,46 -26,40 C -38,28 -40,0 -34,-32 Z', fill: 'rgba(235,240,245,0.35)', stroke: 'rgba(240,244,248,0.85)', 'stroke-width': 2.5 }, b);
    el('path', { d: 'M -18,-20 C -16,0 -20,20 -14,34 M 8,-24 C 12,0 6,20 12,36', fill: 'none', stroke: 'rgba(255,255,255,0.45)', 'stroke-width': 1.5 }, b);
    return b;
  };
  B.bottle = (p, { c = 'rgba(160,215,240,0.35)' } = {}) => {
    const b = g(p);
    el('path', { d: 'M -8,-60 L 8,-60 L 8,-50 C 8,-40 20,-36 20,-22 L 20,40 C 20,48 -20,48 -20,40 L -20,-22 C -20,-36 -8,-40 -8,-50 Z', fill: c, stroke: '#cfe8ff', 'stroke-width': 2.5 }, b);
    el('rect', { x: -10, y: -70, width: 20, height: 12, rx: 3, fill: '#3a8fd8' }, b);
    el('rect', { x: -20, y: -6, width: 40, height: 20, fill: 'rgba(255,255,255,0.25)' }, b);
    return b;
  };

  // ---------- 工廠、汽車、地球、太陽、溫度計 ----------
  B.factory = (p) => {
    const b = g(p);
    el('rect', { x: 30, y: -150, width: 22, height: 110, fill: '#7f8a92', stroke: '#b8c4cc', 'stroke-width': 2 }, b);
    el('rect', { x: 70, y: -120, width: 18, height: 80, fill: '#7f8a92', stroke: '#b8c4cc', 'stroke-width': 2 }, b);
    [[30, -150], [70, -120]].forEach(([x, y], i) => el('rect', { x, y: y + 12, width: i ? 18 : 22, height: 8, fill: '#c94a3a' }, b));
    el('path', { d: 'M -90,0 L -90,-60 L -60,-40 L -60,-60 L -30,-40 L -30,-60 L 0,-40 L 0,-60 L 100,-60 L 100,0 Z', fill: '#5f6b74', stroke: '#9fb0bc', 'stroke-width': 2, 'stroke-linejoin': 'round' }, b);
    for (let i = 0; i < 5; i++) el('rect', { x: -80 + i * 34, y: -32, width: 20, height: 14, fill: '#e8d68a', opacity: 0.8 }, b);
    return b;
  };
  B.smoke = (p, x, y, s = 1, col = '#9aa4ab') => {
    const b = g(p);
    [[0, 0, 14], [10, -16, 18], [-4, -36, 22], [14, -58, 26]].forEach(([dx, dy, r]) => el('circle', { cx: x + dx * s, cy: y + dy * s, r: r * s, fill: col, opacity: 0.75 }, b));
    return b;
  };
  B.car = (p, { c = '#d0574a' } = {}) => {
    const b = g(p);
    el('path', { d: 'M -70,-10 L -66,-30 C -60,-36 -50,-38 -40,-38 L -30,-58 C -26,-62 -20,-64 -12,-64 L 30,-64 C 38,-64 44,-60 48,-54 L 58,-38 C 68,-36 74,-30 74,-20 L 74,-10 Z', fill: c, stroke: '#f2b0a8', 'stroke-width': 2 }, b);
    el('path', { d: 'M -26,-40 L -16,-58 L 6,-58 L 6,-40 Z M 12,-40 L 12,-58 L 30,-58 C 36,-58 40,-54 44,-48 L 50,-40 Z', fill: '#bfe2f2' }, b);
    [-40, 46].forEach((x) => { el('circle', { cx: x, cy: -10, r: 15, fill: '#222' }, b); el('circle', { cx: x, cy: -10, r: 6, fill: '#999' }, b); });
    el('rect', { x: -76, y: -18, width: 8, height: 5, fill: '#666' }, b);
    return b;
  };
  B.earth = (p, r = 100) => {
    const b = g(p);
    const d = `M ${-r},0 A ${r},${r} 0 1,0 ${r},0 A ${r},${r} 0 1,0 ${-r},0 Z`;
    el('circle', { cx: 0, cy: 0, r, fill: '#2f6ab0' }, b);
    const cg = g(b, { 'clip-path': clipBy(b, d) });
    [['M -0.2,-0.85 C 0.2,-0.9 0.5,-0.6 0.4,-0.3 C 0.3,-0.1 0.5,0.1 0.3,0.3 C 0.1,0.4 -0.1,0.2 -0.1,0 C -0.3,-0.1 -0.5,-0.4 -0.2,-0.85 Z'], ['M -0.9,-0.2 C -0.7,-0.4 -0.5,-0.2 -0.55,0.1 C -0.6,0.4 -0.75,0.6 -0.9,0.5 Z'], ['M 0.45,0.45 C 0.65,0.4 0.8,0.55 0.7,0.75 C 0.55,0.85 0.4,0.7 0.45,0.45 Z']].forEach(([s]) => {
      const dd = s.replace(/-?\d*\.?\d+/g, (m) => (parseFloat(m) * r).toFixed(1));
      el('path', { d: dd, fill: '#5aa24a' }, cg);
    });
    el('circle', { cx: -r * 0.35, cy: -r * 0.35, r: r * 0.7, fill: '#ffffff', opacity: 0.08 }, cg);
    el('circle', { cx: 0, cy: 0, r, fill: 'none', stroke: '#9cc8f0', 'stroke-width': 2 }, b);
    return b;
  };
  B.sun = (p, r = 40) => {
    const b = g(p);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; el('line', { x1: Math.cos(a) * (r + 8), y1: Math.sin(a) * (r + 8), x2: Math.cos(a) * (r + 22), y2: Math.sin(a) * (r + 22), stroke: '#ffd166', 'stroke-width': 5, 'stroke-linecap': 'round' }, b); }
    el('circle', { cx: 0, cy: 0, r, fill: '#ffd166' }, b);
    return b;
  };
  // 溫度計：回傳 set(0..1) 調整液柱
  B.thermo = (p, h = 160) => {
    const b = g(p);
    el('rect', { x: -11, y: -h, width: 22, height: h, rx: 11, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2.5 }, b);
    el('circle', { cx: 0, cy: 10, r: 18, fill: '#ff6b6b', stroke: '#cfe8ff', 'stroke-width': 2.5 }, b);
    const col = el('rect', { x: -5, y: -h * 0.4, width: 10, height: h * 0.4 + 10, fill: '#ff6b6b' }, b);
    b.set = (u) => { const top = -h * (0.25 + 0.65 * u); col.setAttribute('y', top); col.setAttribute('height', 10 - top); };
    return b;
  };

  // ---------- 其他植物 ----------
  // 水稻（一叢；底部 y=0）
  B.rice = (p, { h = 120 } = {}) => {
    const b = g(p);
    [[-14, -0.6], [-8, -0.25], [0, 0], [8, 0.25], [14, 0.6]].forEach(([x, k]) => el('path', { d: `M ${x},0 C ${x + k * 10},${-h * 0.4} ${x + k * 30},${-h * 0.7} ${x + k * 50},${-h * 0.95}`, fill: 'none', stroke: '#6fae4a', 'stroke-width': 4, 'stroke-linecap': 'round' }, b));
    [[-4, -1], [6, 1]].forEach(([x, s]) => {
      const sx = x, sy = -h * 0.9, ex = x + s * 34, ey = -h * 0.62;
      el('path', { d: `M ${sx},${-h * 0.2} L ${sx},${sy} Q ${sx + s * 20},${sy - 12} ${ex},${ey}`, fill: 'none', stroke: '#b9a24a', 'stroke-width': 2.5 }, b);
      for (let i = 1; i <= 7; i++) { const u = i / 8, qx = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * (sx + s * 20) + u * u * ex, qy = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * (sy - 12) + u * u * ey; el('ellipse', { cx: qx + s * 3, cy: qy + 4, rx: 3, ry: 5.5, fill: '#e3c45a', stroke: '#9a7a2a', 'stroke-width': 0.8, transform: `rotate(${s * 30} ${qx + s * 3} ${qy + 4})` }, b); }
    });
    return b;
  };
  // 紅豆杉的枝條（扁平的線形葉排成兩列，紅色的假種皮）
  B.yew = (p) => {
    const b = g(p);
    el('path', { d: 'M -90,20 C -40,10 20,0 90,-20', fill: 'none', stroke: '#6a4a2e', 'stroke-width': 4 }, b);
    for (let i = 0; i < 16; i++) {
      const u = i / 15, x = -84 + u * 168, y = 18 - u * 36;
      [-1, 1].forEach((s) => el('path', { d: `M ${x},${y} L ${x + 10},${y + s * 22}`, stroke: s > 0 ? '#2f6a3a' : '#3f7f46', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, b));
    }
    [[-30, 12], [24, -2], [60, -12]].forEach(([x, y]) => { el('circle', { cx: x, cy: y + 14, r: 8, fill: '#d8313a', stroke: '#8a1a20', 'stroke-width': 1.5 }, b); el('circle', { cx: x, cy: y + 12, r: 3.2, fill: '#2a3a2a' }, b); });
    return b;
  };
  B.flower = (p, { c = '#f2d04a', center = '#c06a2a' } = {}) => {
    const b = g(p);
    el('path', { d: 'M 0,0 L 0,60', stroke: '#5f9a46', 'stroke-width': 4 }, b);
    el('path', { d: 'M 0,40 C -14,30 -26,32 -30,22 C -18,20 -6,28 0,36 Z', fill: '#6fae4a' }, b);
    for (let i = 0; i < 6; i++) el('ellipse', { cx: 0, cy: -14, rx: 8, ry: 14, fill: c, stroke: '#b89a2a', 'stroke-width': 1, transform: `rotate(${i * 60} 0 0)` }, b);
    el('circle', { cx: 0, cy: 0, r: 8, fill: center }, b);
    return b;
  };
  B.bee = (p) => {
    const b = g(p);
    [[-6, -14, -25, 13], [6, -13, 20, 11]].forEach(([x, y, r, w]) => el('ellipse', { cx: x, cy: y, rx: w, ry: 6.5, fill: 'rgba(220,240,255,0.55)', stroke: '#cfe8ff', 'stroke-width': 1.2, transform: `rotate(${r} ${x} ${y})` }, b));
    el('ellipse', { cx: 0, cy: 0, rx: 18, ry: 11, fill: '#e8b23a', stroke: '#3a2a10', 'stroke-width': 1.5 }, b);
    [-6, 4].forEach((x) => el('rect', { x, y: -10, width: 5, height: 20, fill: '#2a1e10' }, b));
    el('circle', { cx: 19, cy: -1, r: 7, fill: '#2a1e10' }, b);
    el('path', { d: 'M -18,0 L -24,0', stroke: '#2a1e10', 'stroke-width': 2 }, b);
    return b;
  };

  // ---------- 臺灣地圖（用經緯度投影，北方朝上） ----------
  const TW = [[121.537, 25.3], [121.64, 25.23], [121.75, 25.16], [121.92, 25.13], [122.0, 25.01], [121.87, 24.86], [121.84, 24.7], [121.88, 24.58], [121.8, 24.45], [121.76, 24.3], [121.67, 24.16], [121.62, 23.98], [121.52, 23.6], [121.38, 23.1], [121.22, 22.9], [121.15, 22.76], [121.0, 22.6], [120.9, 22.33], [120.89, 22.2], [120.85, 21.9], [120.79, 21.95], [120.73, 21.93], [120.7, 22.08], [120.59, 22.37], [120.45, 22.46], [120.27, 22.6], [120.18, 22.9], [120.15, 23.0], [120.09, 23.15], [120.14, 23.45], [120.19, 23.79], [120.32, 23.97], [120.5, 24.27], [120.67, 24.5], [120.92, 24.82], [121.08, 25.04], [121.41, 25.18]];
  const MTN = [[121.5, 24.86], [121.72, 24.6], [121.62, 24.3], [121.5, 24.05], [121.36, 23.72], [121.22, 23.35], [121.08, 23.0], [120.96, 22.62], [120.86, 22.2], [120.78, 22.28], [120.7, 22.6], [120.7, 23.0], [120.66, 23.4], [120.82, 23.82], [120.96, 24.2], [121.1, 24.55], [121.3, 24.8]];
  const COAST_RANGE = [[121.56, 23.92], [121.46, 23.58], [121.32, 23.18], [121.18, 22.86], [121.14, 22.9], [121.26, 23.24], [121.4, 23.62], [121.5, 23.94]];
  // map(p, {k}) 回傳群組，group.at(lon, lat) 得到座標（相對於群組原點＝經緯度 (121, 23.65)）
  B.taiwan = (p, { k = 120, land = '#4f8f52', edge = '#a8d8a0', mountain = true } = {}) => {
    const t = g(p);
    const cx = 121, cy = 23.65, kx = k * Math.cos((23.7 * Math.PI) / 180);
    const at = (lon, lat) => [(lon - cx) * kx, (cy - lat) * k];
    t.at = at;
    const pts = (arr) => arr.map(([a, b]) => at(a, b));
    el('path', { d: S.smoothPath(pts(TW)), fill: land, stroke: edge, 'stroke-width': 3, 'stroke-linejoin': 'round' }, t);
    if (mountain) {
      el('path', { d: S.smoothPath(pts(MTN)), fill: '#7a8a52', opacity: 0.9 }, t);
      el('path', { d: S.smoothPath(pts(MTN.map(([a, b]) => [a + (121.1 - a) * 0.4, b + (23.6 - b) * 0.25]))), fill: '#9a8a5a', opacity: 0.9 }, t);
      el('path', { d: S.smoothPath(pts(COAST_RANGE)), fill: '#7a8a52', opacity: 0.85 }, t);
    }
    return t;
  };
})();
