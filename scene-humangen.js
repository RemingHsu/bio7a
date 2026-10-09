/* 七下 2-2 人類的遺傳：看得到的性狀、23 對染色體、性別的決定、ABO 血型、血型的推算、譜系圖 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const SKN = '#f2b38a', SKN_E = '#ffdcc4', HAIR = '#4a3426', BLUSH = '#ff9aa8';
  const AC = { A: '#ffb35c', B: '#7fe0c8', AB: '#d6a8ff', O: '#8fd3ff' };
  const XC = '#ff9ec4', YC = '#7fc8ff', AUTO = '#a796ff';

  // ---------- 人物（頭肩像）：(x,y) 是頭的中心。臉圓、脖子很短（下巴到衣領約為臉長的 1/6，肩膀緊接在下巴下方）、肩膀平 ----------
  // opts: girl（長髮）、adult（大人，肩膀寬一點）、shirt（衣服顏色）、hairline（'v' 美人尖）、dimple（酒窩）、tongue（'roll' | 'flat'）
  function person(p, x, y, s, { girl = false, adult = false, shirt = '#4f7896', hairline = '', dimple = false, tongue = '' } = {}) {
    const pg = S.place(g(p), { x, y, s });
    const k = 1 / Math.max(0.35, s); // 線條不要因為縮小而變得太細
    if (girl) el('path', { d: adult ? 'M -52,-6 C -58,-60 58,-60 52,-6 L 56,64 C 50,74 36,72 32,62 L -32,62 C -36,72 -50,74 -56,64 Z' : 'M -52,-6 C -58,-58 58,-58 52,-6 L 54,44 C 48,54 36,52 32,42 L -32,42 C -36,52 -48,54 -54,44 Z', fill: HAIR }, pg);
    const sh = adult ? 'M -80,127 C -80,88 -68,71 -30,65 L 30,65 C 68,71 80,88 80,127 Z' : 'M -64,119 C -64,86 -54,71 -24,65 L 24,65 C 54,71 64,86 64,119 Z';
    el('rect', { x: -15, y: 36, width: 30, height: 34, fill: SKN }, pg); // 脖子（短）
    el('path', { d: sh, fill: shirt, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 1.5 * k }, pg);
    el('path', { d: 'M -16,65 Q 0,78 16,65', fill: 'none', stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 2.5 * k, 'stroke-linecap': 'round' }, pg); // 領口
    [-47, 47].forEach((ex) => el('ellipse', { cx: ex, cy: 8, rx: 8, ry: 12, fill: SKN, stroke: SKN_E, 'stroke-width': 1.2 * k }, pg));
    el('ellipse', { cx: 0, cy: 4, rx: 46, ry: 48, fill: SKN, stroke: SKN_E, 'stroke-width': 1.2 * k }, pg);
    // 前面的頭髮（髮際線）
    const front = hairline === 'v'
      ? 'M -48,2 C -54,-46 -22,-62 0,-62 C 22,-62 54,-46 48,2 C 44,-18 32,-30 13,-32 L 0,-18 L -13,-32 C -32,-30 -44,-18 -48,2 Z'
      : girl ? 'M -50,6 C -56,-50 -20,-64 4,-62 C 32,-62 56,-46 50,6 C 44,-20 30,-32 10,-34 C -6,-26 -26,-24 -40,-18 Z'
        : 'M -48,2 C -54,-46 -22,-62 0,-62 C 22,-62 54,-46 48,2 C 44,-18 32,-30 0,-32 C -32,-30 -44,-18 -48,2 Z';
    el('path', { d: front, fill: HAIR }, pg);
    // 臉
    el('path', { d: 'M -25,-7 Q -16,-12 -7,-7 M 7,-7 Q 16,-12 25,-7', fill: 'none', stroke: HAIR, 'stroke-width': 2.6 * Math.min(k, 2), 'stroke-linecap': 'round' }, pg);
    [-16, 16].forEach((ex) => { el('ellipse', { cx: ex, cy: 8, rx: 5, ry: 6.5, fill: '#3a2a20' }, pg); el('circle', { cx: ex + 1.8, cy: 5.5, r: 1.8, fill: '#fff' }, pg); });
    el('path', { d: 'M 0,15 Q -3,22 2,24', fill: 'none', stroke: '#c98762', 'stroke-width': 2 * Math.min(k, 2), 'stroke-linecap': 'round' }, pg);
    [-27, 27].forEach((ex) => el('ellipse', { cx: ex, cy: 25, rx: 8, ry: 5, fill: BLUSH, opacity: 0.35 }, pg));
    if (tongue) {
      el('path', { d: 'M -15,29 C -12,48 12,48 15,29 Z', fill: '#7a2e36', stroke: '#a0523c', 'stroke-width': 1.5 * Math.min(k, 2) }, pg); // 張開的嘴
      if (tongue === 'roll') {
        // 捲起來的舌頭：從正面看像「U」字，兩側往上捲、中間是空的管子
        el('path', { d: 'M -12,33 C -14,49 -6,57 0,57 C 6,57 14,49 12,33 C 10,35 8,36 6,36 C 6,44 3,48 0,48 C -3,48 -6,44 -6,36 C -8,36 -10,35 -12,33 Z', fill: '#f08a9a', stroke: '#c85a6c', 'stroke-width': 1.2 * Math.min(k, 2) }, pg);
        el('ellipse', { cx: 0, cy: 40, rx: 4.6, ry: 6.5, fill: '#6a2430' }, pg);
        [-1, 1].forEach((d) => el('path', { d: `M ${d * 9},36 C ${d * 10},44 ${d * 6},51 ${d * 2},53`, fill: 'none', stroke: '#f9b8c3', 'stroke-width': 1.6 * Math.min(k, 2), 'stroke-linecap': 'round' }, pg));
      } else {
        el('path', { d: 'M -10,37 C -11,48 -5,54 0,54 C 5,54 11,48 10,37 Z', fill: '#f08a9a', stroke: '#c85a6c', 'stroke-width': 1.2 * Math.min(k, 2) }, pg);
        el('line', { x1: 0, y1: 40, x2: 0, y2: 50, stroke: '#c85a6c', 'stroke-width': 1.2 * Math.min(k, 2) }, pg);
      }
    } else {
      el('path', { d: dimple ? 'M -14,31 Q 0,42 14,31' : 'M -11,32 Q 0,40 11,32', fill: 'none', stroke: '#a0523c', 'stroke-width': 3 * Math.min(k, 2), 'stroke-linecap': 'round' }, pg);
      if (dimple) [-1, 1].forEach((d) => el('path', { d: `M ${d * 23 - 3},35 q 3,3.2 6,0`, fill: 'none', stroke: '#c98762', 'stroke-width': 2 * Math.min(k, 2), 'stroke-linecap': 'round' }, pg)); // 酒窩：每邊臉頰一個小凹痕
    }
    if (girl && !adult) el('rect', { x: 22, y: -38, width: 14, height: 7, rx: 3.5, fill: '#ffd166', transform: 'rotate(-20 29 -34)' }, pg); // 髮夾
    return pg;
  }
  // 眼睛特寫：雙眼皮（有摺痕）或單眼皮
  function eye(p, x, y, s, double) {
    const eg = S.place(g(p), { x, y, s });
    el('circle', { cx: 0, cy: -8, r: 64, fill: SKN, stroke: '#4a6272', 'stroke-width': 3 }, eg); // 放大的圓框：皮膚
    el('path', { d: 'M -40,-38 Q 0,-54 42,-36', fill: 'none', stroke: HAIR, 'stroke-width': 7, 'stroke-linecap': 'round' }, eg); // 眉毛
    el('path', { d: 'M -40,0 C -24,-18 24,-18 40,0 C 24,13 -24,13 -40,0 Z', fill: '#fbfbf6' }, eg);
    el('circle', { cx: 0, cy: -1, r: 11.5, fill: '#5a3c28' }, eg);
    el('circle', { cx: 0, cy: -1, r: 5.5, fill: '#1c120c' }, eg);
    el('circle', { cx: 3.5, cy: -4.5, r: 2.6, fill: '#fff' }, eg);
    el('path', { d: 'M -40,0 C -24,-18 24,-18 40,0', fill: 'none', stroke: '#3a2a20', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, eg); // 睫毛線
    if (double) el('path', { d: 'M -34,-9 C -18,-25 20,-25 37,-8', fill: 'none', stroke: '#b9785a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, eg); // 雙眼皮的摺痕
    return eg;
  }

  // ---------- ABO 的基因寫法：I 加上標 A、B，i 是小寫 ----------
  const ALC = { A: AC.A, B: AC.B, i: AC.O };
  function abo(p, x, y, str, size = 30, attrs = {}) {
    const t = el('text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', ...attrs }, p);
    let back = 0;
    for (let k = 0; k < str.length; k++) {
      const ch = str[k];
      if (ch === ' ') { const sp = el('tspan', { dy: back || null }, t); sp.textContent = ' '; back = 0; continue; }
      if (ch === 'I' && 'AB'.includes(str[k + 1])) {
        const a = el('tspan', { fill: ALC[str[k + 1]], dy: back || null }, t); a.textContent = 'I';
        const sup = el('tspan', { fill: ALC[str[k + 1]], 'font-size': size * 0.62, dy: -size * 0.4 }, t); sup.textContent = str[k + 1];
        back = size * 0.4; k++;
      } else {
        const a = el('tspan', { fill: ch === 'i' ? ALC.i : C.ink, dy: back || null }, t); a.textContent = ch;
        back = 0;
      }
    }
    return t;
  }
  // 紅血球（雙凹圓盤）
  const rbc = (p, x, y, r = 16) => { const c = g(p); el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.92, fill: '#d9465c', stroke: '#ff8f9f', 'stroke-width': 1.5 }, c); el('ellipse', { cx: x, cy: y, rx: r * 0.45, ry: r * 0.38, fill: '#b02c44' }, c); return c; };

  // ---------- 染色體（複製後的樣子：兩條染色分體在著絲點相連） ----------
  function chromo(p, x, yBot, len, cf, w, color) {
    const cg = g(p);
    const top = yBot - len, yc = top + len * cf, r = w / 2, d = w * 0.38;
    [-1, 1].forEach((side) => {
      const x0 = side < 0 ? x - w : x, xo = side < 0 ? x0 : x0 + w, xi = side < 0 ? x0 + w : x0; // 外側、內側
      const cut = Math.min(5, len * 0.08), sw = side > 0 ? 1 : 0;
      const y1 = Math.max(top + r, yc - cut), y2 = Math.min(yBot - r, yc + cut);
      el('path', { d: `M ${xi},${top + r} A ${r},${r} 0 0,${sw} ${xo},${top + r} L ${xo},${y1} Q ${xo - side * d},${yc} ${xo},${y2} L ${xo},${yBot - r} A ${r},${r} 0 0,${sw} ${xi},${yBot - r} Z`, fill: color, stroke: 'rgba(255,255,255,0.45)', 'stroke-width': 1 }, cg);
    });
    // 簡單的帶紋
    const rnd = S.rng(Math.round(len * 7) + 3); // 同一對的帶紋相同
    const nb = Math.max(1, Math.round(len / 22));
    for (let i = 0; i < nb; i++) {
      const by = top + r + rnd() * (len - 2 * r - 4);
      if (Math.abs(by - yc) < 5) continue;
      el('rect', { x: x - w + 1, y: by, width: 2 * w - 2, height: 2.6, fill: 'rgba(13,24,34,0.35)' }, cg);
    }
    return cg;
  }
  const CHR = [[249, 0.5], [242, 0.39], [198, 0.46], [190, 0.26], [181, 0.27], [171, 0.35], [159, 0.38], [145, 0.31], [138, 0.35], [134, 0.3], [135, 0.4], [133, 0.27], [114, 0.15], [107, 0.15], [102, 0.17], [90, 0.41], [83, 0.31], [80, 0.23], [59, 0.45], [64, 0.45], [47, 0.25], [51, 0.28]];
  const SEXC = { X: [156, 0.39], Y: [57, 0.2] };

  // 精子（頭在右）與卵
  function sperm(p, x, y, s, label, col) {
    const sg = S.place(g(p), { x, y, s });
    el('path', { d: 'M -14,0 C -30,-8 -40,8 -56,0 C -66,-6 -74,6 -86,0', fill: 'none', stroke: '#cfe3ee', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, sg);
    el('rect', { x: -16, y: -3, width: 8, height: 6, rx: 3, fill: '#cfe3ee' }, sg);
    el('ellipse', { cx: 2, cy: 0, rx: 13, ry: 9.5, fill: '#e8f4fa', stroke: col, 'stroke-width': 2.5 }, sg);
    text(sg, 2, 6, label, { 'font-size': 17, 'text-anchor': 'middle', 'font-weight': 700, fill: '#0d1822' });
    return sg;
  }
  function egg(p, x, y, r, label, col) {
    const eg = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill: 'rgba(255,214,170,0.22)', stroke: '#ffd9b0', 'stroke-width': 2.5 }, eg);
    el('circle', { cx: 0, cy: 0, r: r * 0.5, fill: 'rgba(167,150,255,0.35)', stroke: col, 'stroke-width': 2.5 }, eg);
    text(eg, 0, r * 0.24, label, { 'font-size': r * 0.7, 'text-anchor': 'middle', 'font-weight': 700, fill: C.ink });
    return eg;
  }
  const gridLines = (p, GX, GY, CS) => { for (let i = 0; i <= 2; i++) { el('line', { x1: GX, y1: GY + i * CS, x2: GX + 2 * CS, y2: GY + i * CS, stroke: '#4a6272', 'stroke-width': 3 }, p); el('line', { x1: GX + i * CS, y1: GY, x2: GX + i * CS, y2: GY + 2 * CS, stroke: '#4a6272', 'stroke-width': 3 }, p); } };
  const arrow = (p, x1, y1, x2, y2, color = '#4a6272', w = 3) => { const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p), hl = 14; el('line', { x1, y1, x2: x2 - Math.cos(a) * hl * 0.7, y2: y2 - Math.sin(a) * hl * 0.7, stroke: color, 'stroke-width': w }, ag); el('path', { d: `M${x2},${y2} L${x2 - hl * Math.cos(a - 0.45)},${y2 - hl * Math.sin(a - 0.45)} L${x2 - hl * Math.cos(a + 0.45)},${y2 - hl * Math.sin(a + 0.45)}Z`, fill: color }, ag); return ag; };

  S.register({
    id: 'humangen', section: '下2-2', title: '人類的遺傳',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 人類的性狀 =====
      const P0 = g(root);
      text(P0, 600, 56, '用肉眼就看得到的性狀', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const CX0 = [30, 320, 610, 900], CW0 = 270;
      const cards0 = [['額頭的髮際', '有美人尖', '沒有美人尖'], ['眼皮', '雙眼皮', '單眼皮'], ['臉頰', '有酒窩', '沒有酒窩'], ['舌頭', '能捲舌', '不能捲舌']].map(([t, a, b], i) => {
        const c = g(P0, { opacity: 0 });
        const cx = CX0[i] + CW0 / 2;
        el('rect', { x: CX0[i], y: 84, width: CW0, height: 440, rx: 18, ...FRAME }, c);
        text(c, cx, 126, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(c, cx - 66, 482, a, { 'font-size': 23, 'text-anchor': 'middle', 'font-weight': 700 });
        text(c, cx + 66, 482, b, { 'font-size': 23, 'text-anchor': 'middle', 'font-weight': 700 });
        return c;
      });
      const cx0 = (i) => CX0[i] + CW0 / 2;
      person(cards0[0], cx0(0) - 66, 272, 1, { hairline: 'v', shirt: '#4f7896' });
      person(cards0[0], cx0(0) + 66, 272, 1, { shirt: '#5f8f6a' });
      eye(cards0[1], cx0(1) - 66, 300, 0.95, true);
      eye(cards0[1], cx0(1) + 66, 300, 0.95, false);
      person(cards0[2], cx0(2) - 66, 272, 1, { girl: true, dimple: true, shirt: '#8a6fb0' });
      person(cards0[2], cx0(2) + 66, 272, 1, { girl: true, shirt: '#b0785f' });
      person(cards0[3], cx0(3) - 66, 272, 1, { tongue: 'roll', shirt: '#4f7896' });
      person(cards0[3], cx0(3) + 66, 272, 1, { tongue: 'flat', shirt: '#5f8f6a' });
      [0, 2, 3].forEach((i) => el('line', { x1: cx0(i), y1: 160, x2: cx0(i), y2: 450, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, cards0[i]));
      el('line', { x1: cx0(1), y1: 160, x2: cx0(1), y2: 450, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, cards0[1]);
      const foot0 = g(P0, { opacity: 0 });
      S.pill(foot0, 600, 584, '人類有許多性狀由基因控制，有些用肉眼就看得到', { size: 26, color: C.ink, edge: '#4a6272' });
      const foot0b = g(P0, { opacity: 0 });
      S.pill(foot0b, 600, 650, '有些性狀要檢驗才知道，例如 ABO 血型', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      cards0.forEach((c, i) => S.show(tl, c, `s0+=${0.2 + i * 0.6}`, 0.5));
      S.show(tl, foot0, 's0+=2.8', 0.5);
      S.show(tl, foot0b, 's0+=3.6', 0.5);

      // ===== 1 23 對染色體 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 400, 52, '人類體細胞的染色體（排列整理後）', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const SC = 0.6, W = 8;
      const rows = [[0, 8, 250], [8, 16, 420], [16, 22, 590]];
      const pairX = (j) => 70 + j * 88;
      rows.forEach(([a, b, yb]) => {
        for (let n = a; n < b; n++) {
          const j = n - a, x = pairX(j), [L, cf] = CHR[n];
          chromo(P1, x - 12, yb, L * SC, cf, W, AUTO);
          chromo(P1, x + 12, yb, L * SC, cf, W, AUTO);
          text(P1, x, yb + 30, String(n + 1), { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        }
      });
      // 第 23 對：女 XX、男 XY
      const sx = g(P1, { opacity: 0 });
      el('rect', { x: 580, y: 468, width: 200, height: 180, rx: 14, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, sx);
      chromo(sx, 618, 590, SEXC.X[0] * SC, SEXC.X[1], W, XC); chromo(sx, 642, 590, SEXC.X[0] * SC, SEXC.X[1], W, XC);
      chromo(sx, 718, 590, SEXC.X[0] * SC, SEXC.X[1], W, XC); chromo(sx, 742, 590, SEXC.Y[0] * SC, SEXC.Y[1], W, YC);
      text(sx, 630, 622, '女 XX', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: XC });
      text(sx, 730, 622, '男 XY', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: YC });
      text(sx, 680, 686, '第 23 對：性染色體', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const auto1 = g(P1, { opacity: 0 });
      el('rect', { x: 40, y: 640, width: 520, height: 64, rx: 14, fill: 'none', stroke: AUTO, 'stroke-width': 2.5 }, auto1);
      text(auto1, 300, 682, '第 1～22 對：體染色體（男女都一樣）', { 'font-size': 24, 'text-anchor': 'middle', fill: AUTO, 'font-weight': 700 });
      const info1 = g(P1, { opacity: 0 });
      el('rect', { x: 830, y: 100, width: 340, height: 420, rx: 18, ...FRAME }, info1);
      text(info1, 1000, 150, '23 對 ＝ 46 條', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(info1, 1000, 196, '每一對：一條來自父親', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(info1, 1000, 226, '一條來自母親', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      el('line', { x1: 860, y1: 256, x2: 1140, y2: 256, stroke: '#2b4252', 'stroke-width': 2 }, info1);
      text(info1, 1000, 306, '女性', { 'font-size': 24, 'text-anchor': 'middle', fill: XC, 'font-weight': 700 });
      text(info1, 1000, 348, '44 ＋ XX', { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono' });
      text(info1, 1000, 414, '男性', { 'font-size': 24, 'text-anchor': 'middle', fill: YC, 'font-weight': 700 });
      text(info1, 1000, 456, '44 ＋ XY', { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono' });
      text(info1, 1000, 500, '（44 條體染色體）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.6);
      S.show(tl, auto1, 's1+=1.4', 0.5);
      S.show(tl, sx, 's1+=2.4', 0.5);
      S.show(tl, info1, 's1+=3.4', 0.5);

      // ===== 2 生男生女 =====
      const P2 = g(root, { opacity: 0 });
      const GX = 520, GY = 210, CS = 150;
      person(P2, 150, 120, 0.72, { adult: true, shirt: '#3f6f8f' });
      text(P2, 150, 248, '父親 44＋XY', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      person(P2, 150, 400, 0.72, { adult: true, girl: true, shirt: '#8a5f8f' });
      text(P2, 150, 528, '母親 44＋XX', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const sp2 = g(P2, { opacity: 0 });
      arrow(sp2, 250, 130, 470, 130);
      text(sp2, 360, 112, '減數分裂', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(sp2, GX + CS, 70, '精子', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      sperm(sp2, GX + CS / 2 + 26, 130, 1.3, 'X', XC); sperm(sp2, GX + CS * 1.5 + 26, 130, 1.3, 'Y', YC);
      text(sp2, GX + CS / 2, 180, '22＋X', { 'font-size': 22, 'text-anchor': 'middle', fill: XC });
      text(sp2, GX + CS * 1.5, 180, '22＋Y', { 'font-size': 22, 'text-anchor': 'middle', fill: YC });
      const eg2 = g(P2, { opacity: 0 });
      arrow(eg2, 250, 400, 418, 400);
      text(eg2, 334, 382, '減數分裂', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(eg2, GX - 58, GY - 16, '卵', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      [0, 1].forEach((i) => egg(eg2, GX - 58, GY + CS / 2 + i * CS, 32, 'X', XC));
      text(eg2, GX - 58, GY + 2 * CS + 32, '22＋X', { 'font-size': 22, 'text-anchor': 'middle', fill: XC });
      gridLines(P2, GX, GY, CS);
      const kids2 = [];
      [0, 1].forEach((i) => ['X', 'Y'].forEach((sc, j) => {
        const c = g(P2, { opacity: 0 });
        const cx = GX + CS / 2 + j * CS, cy = GY + i * CS;
        const girl = sc === 'X';
        person(c, cx, cy + 56, 0.42, { girl, shirt: girl ? '#8a6fb0' : '#4f7896' });
        text(c, cx, cy + 136, girl ? 'XX 女' : 'XY 男', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: girl ? XC : YC });
        kids2.push(c);
      }));
      const res2 = g(P2, { opacity: 0 });
      el('rect', { x: 860, y: 210, width: 310, height: 300, rx: 18, ...FRAME }, res2);
      text(res2, 1015, 262, '女：男', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink2 });
      text(res2, 1015, 314, '＝ 1：1', { 'font-size': 36, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(res2, 1015, 380, '每生一胎，', { 'font-size': 24, 'text-anchor': 'middle' });
      text(res2, 1015, 416, '是男孩的機率', { 'font-size': 24, 'text-anchor': 'middle' });
      text(res2, 1015, 462, '都是 1/2', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const key2 = g(P2, { opacity: 0 });
      S.pill(key2, 600, 620, '卵都帶 X；精子帶 X 或 Y（各一半）→ 由精子決定性別', { size: 24, color: C.ink, edge: '#4a6272' });
      S.pill(key2, 600, 680, '前一胎是男是女，不會影響下一胎', { size: 24, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, sp2, 's2+=0.9', 0.5);
      S.show(tl, eg2, 's2+=1.6', 0.5);
      kids2.forEach((c, i) => S.show(tl, c, `s2+=${2.4 + i * 0.45}`, 0.4));
      S.show(tl, res2, 's2+=4.4', 0.5);
      S.show(tl, key2, 's2+=5.2', 0.5);

      // ===== 3 ABO 血型：三種等位基因、六種基因型、四種血型 =====
      const P3 = g(root, { opacity: 0 });
      text(P3, 600, 56, 'ABO 血型由一對等位基因決定', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const al3 = g(P3);
      el('rect', { x: 60, y: 90, width: 1080, height: 110, rx: 18, ...FRAME }, al3);
      text(al3, 180, 138, '等位基因有', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(al3, 180, 172, '三種', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      [['IA', 380, '顯性'], ['IB', 560, '顯性'], ['i', 740, '隱性']].forEach(([a, x, d]) => {
        abo(al3, x, 160, a, 48);
        text(al3, x + 58, 160, d, { 'font-size': 22, fill: d === '顯性' ? C.hi : C.mute });
      });
      text(al3, 990, 140, '每個人有其中兩個', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(al3, 990, 172, '（可以相同，例如 ii）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const TY = 240, rowsABO = [['A', ['IAIA', 'IAi']], ['B', ['IBIB', 'IBi']], ['AB', ['IAIB']], ['O', ['ii']]];
      const tb3 = g(P3, { opacity: 0 });
      el('rect', { x: 60, y: TY, width: 1080, height: 330, rx: 18, ...FRAME }, tb3);
      text(tb3, 180, TY + 46, '血型', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(tb3, 600, TY + 46, '基因型', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      el('line', { x1: 80, y1: TY + 66, x2: 1120, y2: TY + 66, stroke: '#4a6272', 'stroke-width': 2 }, tb3);
      const rowG3 = rowsABO.map(([bt, gts], i) => {
        const r = g(tb3, { opacity: 0 });
        const y = TY + 112 + i * 62;
        rbc(r, 130, y - 9, 16);
        text(r, 196, y, `${bt} 型`, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: AC[bt] });
        gts.forEach((gt, k) => abo(r, gts.length === 1 ? 600 : 500 + k * 200, y + 2, gt, 34));
        if (gts.length === 2) text(r, 600, y, '或', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        if (i < 3) el('line', { x1: 80, y1: y + 22, x2: 1120, y2: y + 22, stroke: '#2b4252', 'stroke-width': 1.5 }, r);
        return r;
      });
      const ab3 = g(P3, { opacity: 0 });
      el('line', { x1: 690, y1: TY + 236, x2: 820, y2: TY + 236, stroke: AC.AB, 'stroke-width': 2.5 }, ab3);
      text(ab3, 830, TY + 244, '兩種顯性基因都表現出來', { 'font-size': 22, fill: AC.AB });
      const cnt3 = g(P3, { opacity: 0 });
      S.pill(cnt3, 600, 630, '6 種基因型 → 4 種血型', { size: 28, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      S.show(tl, tb3, 's3+=1.2', 0.4);
      rowG3.forEach((r, i) => S.show(tl, r, `s3+=${1.5 + i * 0.6}`, 0.4));
      S.show(tl, ab3, 's3+=4', 0.4);
      S.show(tl, cnt3, 's3+=4.6', 0.5);

      // ===== 4 例題：A 型（IAi）× B 型（IBi） =====
      const P4 = g(root, { opacity: 0 });
      const GX4 = 520, GY4 = 210, CS4 = 150;
      person(P4, 150, 120, 0.72, { adult: true, shirt: '#3f6f8f' });
      text(P4, 150, 244, '父親：A 型', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: AC.A });
      abo(P4, 150, 294, 'IAi', 32);
      person(P4, 150, 400, 0.72, { adult: true, girl: true, shirt: '#8a5f8f' });
      text(P4, 150, 524, '母親：B 型', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: AC.B });
      abo(P4, 150, 574, 'IBi', 32);
      gridLines(P4, GX4, GY4, CS4);
      text(P4, GX4 + CS4, 76, '精子', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      text(P4, GX4 - 58, GY4 - 16, '卵', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      const hd4 = g(P4, { opacity: 0 });
      ['IA', 'i'].forEach((a, j) => { const cx = GX4 + CS4 / 2 + j * CS4; el('circle', { cx, cy: 140, r: 30, fill: '#1a2c3a', stroke: '#cfe3ee', 'stroke-width': 2.5 }, hd4); abo(hd4, cx, 152, a, 32); });
      ['IB', 'i'].forEach((a, i) => { const cy = GY4 + CS4 / 2 + i * CS4; el('circle', { cx: GX4 - 58, cy, r: 30, fill: '#1a2c3a', stroke: '#ffd9b0', 'stroke-width': 2.5 }, hd4); abo(hd4, GX4 - 58, cy + 12, a, 32); });
      arrow(hd4, 250, 140, 470, 140);
      arrow(hd4, 250, 400, 420, 362);
      const cells4 = [];
      [['IB', 'i'], ['i', 'i']].forEach((_, i) => ['IA', 'i'].forEach((sp, j) => {
        const eggA = ['IB', 'i'][i];
        const gt = sp === 'IA' ? (eggA === 'IB' ? 'IAIB' : 'IAi') : eggA === 'IB' ? 'IBi' : 'ii';
        const bt = { IAIB: 'AB', IAi: 'A', IBi: 'B', ii: 'O' }[gt];
        const c = g(P4, { opacity: 0 });
        const cx = GX4 + CS4 / 2 + j * CS4, cy = GY4 + i * CS4;
        abo(c, cx, cy + 66, gt, 36);
        rbc(c, cx - 48, cy + 106, 13);
        text(c, cx + 10, cy + 115, `${bt} 型`, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: AC[bt] });
        cells4.push(c);
      }));
      const res4 = g(P4, { opacity: 0 });
      el('rect', { x: 860, y: 210, width: 310, height: 300, rx: 18, ...FRAME }, res4);
      text(res4, 1015, 256, '子女的血型', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      [['A', 0], ['B', 1], ['AB', 2], ['O', 3]].forEach(([bt, k]) => {
        const y = 304 + k * 50;
        text(res4, 960, y, `${bt} 型`, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: AC[bt] });
        text(res4, 1080, y, '1/4', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono' });
      });
      const key4 = g(P4, { opacity: 0 });
      S.pill(key4, 680, 610, 'A 型和 B 型的父母，也可能生下 O 型或 AB 型的孩子', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, hd4, 's4+=1', 0.5);
      cells4.forEach((c, i) => S.show(tl, c, `s4+=${1.8 + i * 0.6}`, 0.4));
      S.show(tl, res4, 's4+=4.4', 0.5);
      S.show(tl, key4, 's4+=5.2', 0.5);

      // ===== 5 譜系圖：能不能捲舌 =====
      const P5 = g(root, { opacity: 0 });
      text(P5, 330, 56, '一個家族的譜系圖（能不能捲舌）', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const LG = g(P5);
      el('rect', { x: 52, y: 84, width: 30, height: 30, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, LG);
      text(LG, 92, 108, '男', { 'font-size': 22 });
      el('circle', { cx: 152, cy: 99, r: 16, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, LG);
      text(LG, 176, 108, '女', { 'font-size': 22 });
      text(LG, 220, 108, '｜', { 'font-size': 22, fill: C.mute });
      el('rect', { x: 250, y: 88, width: 22, height: 22, fill: 'none', stroke: C.ink, 'stroke-width': 2.5 }, LG);
      el('circle', { cx: 292, cy: 99, r: 11, fill: 'none', stroke: C.ink, 'stroke-width': 2.5 }, LG);
      text(LG, 312, 108, '能捲舌', { 'font-size': 22 });
      el('rect', { x: 400, y: 88, width: 22, height: 22, fill: '#8a9aa4', stroke: C.ink, 'stroke-width': 2.5 }, LG);
      el('circle', { cx: 442, cy: 99, r: 11, fill: '#8a9aa4', stroke: C.ink, 'stroke-width': 2.5 }, LG);
      text(LG, 462, 108, '不能捲舌', { 'font-size': 22 });
      const REC = '#8fd3ff';
      const sym = (p, x, y, male, filled) => {
        const s = g(p);
        if (male) el('rect', { x: x - 24, y: y - 24, width: 48, height: 48, fill: filled ? '#8a9aa4' : '#0d1822', stroke: C.ink, 'stroke-width': 3.5 }, s);
        else el('circle', { cx: x, cy: y, r: 26, fill: filled ? '#8a9aa4' : '#0d1822', stroke: C.ink, 'stroke-width': 3.5 }, s);
        return s;
      };
      const ln = (p, x1, y1, x2, y2) => el('line', { x1, y1, x2, y2, stroke: C.ink2, 'stroke-width': 3 }, p);
      const ped = g(P5);
      const Y1 = 200, Y2 = 380, Y3 = 560;
      ln(ped, 224, Y1, 374, Y1); ln(ped, 300, Y1, 300, 290); ln(ped, 220, 290, 460, 290);
      [220, 340, 460].forEach((x) => ln(ped, x, 290, x, Y2 - 26));
      ln(ped, 106, Y2, 196, Y2); ln(ped, 150, Y2, 150, Y3 - 26);
      sym(ped, 200, Y1, true, false); sym(ped, 400, Y1, false, false);
      sym(ped, 80, Y2, false, false); sym(ped, 220, Y2, true, false); sym(ped, 340, Y2, false, true); sym(ped, 460, Y2, true, true);
      sym(ped, 150, Y3, false, false);
      [[200, Y1 - 40, '祖父'], [400, Y1 - 40, '祖母'], [80, Y2 + 52, '母親'], [220, Y2 + 52, '父親'], [340, Y2 + 52, '姑姑'], [460, Y2 + 52, '叔叔'], [150, Y3 + 54, '孩子']]
        .forEach(([x, y, s2]) => text(ped, x, y, s2, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 }));
      // 推理後標上基因型
      const gl = (p2, x, y, s2, c, size = 24) => text(p2, x, y, s2, { 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', fill: c });
      const gtx2 = g(P5, { opacity: 0 });
      gl(gtx2, 340, Y2 + 84, 'rr', REC); gl(gtx2, 460, Y2 + 84, 'rr', REC);
      const gtx = g(P5, { opacity: 0 });
      gl(gtx, 200, Y1 + 58, 'Rr', C.hi); gl(gtx, 400, Y1 + 58, 'Rr', C.hi);
      gl(gtx, 220, Y2 + 84, 'RR 或 Rr', C.hi, 20);
      const why5 = [
        '祖父母都能捲舌，', '卻生出不能捲舌的子女',
        '→ 不能捲舌是隱性（rr）', '→ 能捲舌是顯性（R）',
        '→ 祖父母都帶有 r：都是 Rr',
      ].map((s, i) => text(P5, 650, 200 + i * 56 + (i >= 2 ? 24 : 0), s, { 'font-size': 26, fill: i >= 2 ? C.hi : C.ink, 'font-weight': i >= 2 ? 700 : 400, opacity: 0 }));
      const tip5 = g(P5, { opacity: 0 });
      S.pill(tip5, 870, 560, '父親能捲舌：可能是 RR，也可能是 Rr', { size: 24, color: C.ink, edge: '#4a6272' });
      S.pill(tip5, 870, 626, '看譜系圖：先找「親代相同、子代不同」', { size: 24, color: C.membrane, edge: C.membrane });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      S.show(tl, [why5[0], why5[1]], 's5+=1.2', 0.4);
      S.show(tl, [why5[2], why5[3]], 's5+=2.2', 0.4);
      S.show(tl, gtx2, 's5+=2.4', 0.4);
      S.show(tl, why5[4], 's5+=3.2', 0.4);
      S.show(tl, gtx, 's5+=3.4', 0.4);
      S.show(tl, tip5, 's5+=4.4', 0.5);

      return {
        tl,
        notes: [
          '這些性狀在課本中常當作「一對等位基因控制」的例子；實際上大多比較複雜，可能受多個基因和環境影響（補充）。',
          '＊示意：染色體的長短大致依真實比例，帶紋是示意。這種排列圖是在細胞分裂時拍攝、整理的，染色體已經複製，所以每條看起來像兩條並排。',
          '＊示意：人物、精子和卵都不是真實比例（卵比精子大很多）。生男生女的比例是機率，家庭裡的孩子不一定剛好一半一半。',
          '血型的等位基因寫成大寫 I 右上角加 A 或 B，以及小寫 i。帶 A 和帶 B 的基因在一起時，兩種都表現出來（高中稱為「共顯性」，補充）。輸血時血型要吻合。',
          '比例是「機率」：這對父母生的每一個孩子，是 O 型的機率都是 1/4，不表示生 4 個就一定有 1 個 O 型。',
          '會考題常用譜系圖：□ 代表男性、○ 代表女性，塗色代表具有某種特徵。能否捲舌在課本中當作一對等位基因的例子（實際比較複雜，補充）。',
        ],
        steps: [
          '人類有許多<b>性狀</b>由基因控制，例如有沒有<b>美人尖</b>、<b>雙眼皮</b>、<b>酒窩</b>，能不能<b>捲舌</b>。也有些性狀要檢驗才知道，例如 <b>ABO 血型</b>。',
          '人類體細胞有 <b>23 對</b>染色體：<b>22 對體染色體</b>男女都一樣，<b>1 對性染色體</b>決定性別。女性是 <b>XX</b>，男性是 <b>XY</b>。',
          '減數分裂後，卵都帶 <b>X</b>；精子一半帶 <b>X</b>、一半帶 <b>Y</b>。卵和帶 X 的精子結合是女孩（XX），和帶 Y 的結合是男孩（XY）：機率各 <b>1/2</b>。',
          'ABO 血型由 <b>I<sup>A</sup>、I<sup>B</sup>、i</b> 三種等位基因決定，I<sup>A</sup>、I<sup>B</sup> 對 i 是<b>顯性</b>。每個人有其中兩個（可以相同）：6 種基因型 → <b>A、B、AB、O</b> 四種血型。',
          '父親 A 型（<b>I<sup>A</sup>i</b>）、母親 B 型（<b>I<sup>B</sup>i</b>）：用棋盤方格推算，孩子可能是 <b>AB、A、B、O</b> 型，機率各 <b>1/4</b>。',
          '<b>譜系圖</b>：祖父母都能捲舌，卻有子女不能捲舌，表示<b>不能捲舌是隱性</b>；祖父母的基因型都是 <b>Rr</b>。',
        ],
      };
    },
  });
})();
