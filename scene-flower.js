/* 七下 1-3 植物的有性生殖：花的構造、授粉（蟲媒花與風媒花）、受精（花粉管）、果實與種子的形成、果實與種子的傳播
   這個檔案也提供花的縱切面圖（S.b1.flower）、蜜蜂（S.b1.bee），互動 lab-flower.js 會用到。 */
(() => {
  const { el, g, text, C } = S;
  const B1 = (S.b1 = S.b1 || {});
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const sm = S.smoothstep;
  const PET = '#ff8fb8', PET_E = '#ffd0e2', PET_V = '#e0609a', SEP = '#5fae4a', SEP_E = '#a8e39a';
  const ANT = '#ffd166', FIL = '#f2e6b0', STY = '#a8d878', STG = '#dcef74', OVW = '#7fbf5a', POL = '#ffcf3c';
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };

  // ---------- 花的縱切面（花托在 (0,0)，花朝上；高約 400） ----------
  // 回傳各部位的群組，和局部座標的重點位置 A（用來放標籤、做動畫）
  B1.flower = (p, { x, y, s = 1 } = {}) => {
    const F = S.place(g(p), { x, y, s });
    const o = { g: F, s, x, y };
    o.at = (lx, ly) => [x + lx * s, y + ly * s];
    const mirror = (gp) => { const m = g(gp, { transform: 'scale(-1,1)' }); return m; };
    // 後面的花瓣（淡）
    o.back = g(F);
    el('path', { d: 'M -24,-16 C -76,-86 -62,-196 0,-214 C 62,-196 76,-86 24,-16 Z', fill: PET, opacity: 0.45, stroke: PET_E, 'stroke-width': 1.5 }, o.back);
    // 花梗
    el('path', { d: 'M -8,186 L -8,14 Q 0,6 8,14 L 8,186 Z', fill: '#6fae4a', stroke: '#9fd07a', 'stroke-width': 1.5 }, F);
    // 花萼
    o.sepals = g(F);
    const sepD = 'M -36,-2 C -72,4 -110,-12 -132,-44 C -102,-48 -64,-38 -40,-20 Z';
    [o.sepals, mirror(o.sepals)].forEach((gp) => { el('path', { d: sepD, fill: SEP, stroke: SEP_E, 'stroke-width': 2 }, gp); el('path', { d: 'M -40,-10 C -70,-12 -100,-24 -124,-42', fill: 'none', stroke: SEP_E, 'stroke-width': 1.2, opacity: 0.7 }, gp); });
    // 花瓣（左、右各一片，分開成群組，方便做凋落）
    const petD = 'M -28,-12 C -64,-30 -128,-62 -160,-150 C -166,-172 -150,-188 -128,-178 C -96,-162 -60,-122 -40,-82 C -30,-60 -26,-36 -24,-16 Z';
    o.petals = [-1, 1].map((sd) => {
      const pg = g(F);
      const inner = g(pg, { transform: `scale(${-sd},1)` });
      el('path', { d: petD, fill: PET, stroke: PET_E, 'stroke-width': 2 }, inner);
      el('path', { d: 'M -30,-20 C -60,-60 -100,-110 -140,-166', fill: 'none', stroke: PET_V, 'stroke-width': 1.6, opacity: 0.8 }, inner);
      el('path', { d: 'M -36,-40 C -70,-70 -110,-100 -150,-140 M -34,-30 C -52,-72 -76,-120 -116,-170', fill: 'none', stroke: PET_V, 'stroke-width': 1, opacity: 0.5 }, inner);
      return pg;
    });
    // 花托
    o.recept = el('path', { d: 'M -48,-10 C -44,14 -18,28 0,28 C 18,28 44,14 48,-10 C 30,-16 -30,-16 -48,-10 Z', fill: '#78b85a', stroke: '#a8e39a', 'stroke-width': 2 }, F);
    // 雄蕊：花絲＋花藥
    o.stamens = [];
    [[-1, 'M -26,-16 C -42,-60 -58,-108 -66,-150', -66, -150, -12], [-1, 'M -14,-18 C -22,-72 -34,-124 -40,-168', -40, -168, -8], [1, 'M -26,-16 C -42,-60 -58,-108 -66,-150', -66, -150, -12], [1, 'M -14,-18 C -22,-72 -34,-124 -40,-168', -40, -168, -8]].forEach(([sd, d, ax, ay, r]) => {
      const sg = g(F);
      const inner = g(sg, { transform: `scale(${-sd},1)` });
      el('path', { d, fill: 'none', stroke: FIL, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, inner);
      const an = g(inner, { transform: `translate(${ax},${ay - 10}) rotate(${r})` });
      el('ellipse', { cx: 0, cy: 0, rx: 9, ry: 19, fill: ANT, stroke: '#ffe9a8', 'stroke-width': 1.5 }, an);
      el('line', { x1: 0, y1: -15, x2: 0, y2: 15, stroke: '#d99a20', 'stroke-width': 1.5 }, an);
      [[-11, -6], [10, 4], [-9, 12]].forEach(([px, py]) => el('circle', { cx: px, cy: py, r: 2.6, fill: POL }, an));
      o.stamens.push(sg);
    });
    // 雌蕊：子房（剖開，看得到胚珠）、花柱、柱頭
    o.pistil = g(F);
    o.styleG = g(o.pistil);
    el('path', { d: 'M -7,-84 C -6,-118 -5,-146 -4,-168 L 4,-168 C 5,-146 6,-118 7,-84 Z', fill: STY, stroke: '#d0f0a8', 'stroke-width': 1.5 }, o.styleG);
    el('line', { x1: 0, y1: -90, x2: 0, y2: -166, stroke: '#7aa850', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, o.styleG);
    o.stigma = g(o.styleG);
    el('path', { d: 'M -19,-166 C -28,-176 -20,-191 -9,-184 C -7,-198 7,-198 9,-184 C 20,-191 28,-176 19,-166 Z', fill: STG, stroke: '#f4ffb0', 'stroke-width': 1.5 }, o.stigma);
    [[-12, -176], [0, -188], [12, -176], [-4, -172], [6, -170]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 1.6, fill: '#f4ffb0' }, o.stigma));
    o.ovary = S.place(g(o.pistil), { x: 0, y: -48 });
    o.ovWall = el('ellipse', { cx: 0, cy: 0, rx: 34, ry: 40, fill: OVW, stroke: '#b8e898', 'stroke-width': 2 }, o.ovary);
    o.ovCav = el('ellipse', { cx: 0, cy: 0, rx: 25, ry: 31, fill: '#d8f0c8' }, o.ovary);
    el('line', { x1: 0, y1: -26, x2: 0, y2: 26, stroke: '#a8c890', 'stroke-width': 2 }, o.ovary);
    o.ovules = [[-11, -13], [11, -13], [-11, 13], [11, 13]].map(([cx, cy]) => {
      const og = g(o.ovary);
      el('line', { x1: 0, y1: cy, x2: cx * 0.6, y2: cy, stroke: '#a8c890', 'stroke-width': 1.5 }, og);
      const body = el('ellipse', { cx, cy, rx: 8, ry: 10, fill: '#f6faec', stroke: '#9ab880', 'stroke-width': 1.5 }, og);
      const egg = el('circle', { cx, cy: cy - 3, r: 2.8, fill: '#ffb86a' }, og);
      og.body = body; og.egg = egg;
      return og;
    });
    // 重點位置（局部座標）
    o.A = { stigma: [0, -184], style: [0, -126], ovary: [0, -48], ovule: [-11, -61], anther: [-66, -160], filament: [-48, -90], petal: [-120, -150], sepal: [-110, -34], recept: [0, 18], pedicel: [0, 120] };
    return o;
  };
  // 子房長成果實：k 0→1（花瓣、雄蕊、花柱另外處理）
  B1.fruitGrow = (o, k) => {
    const sc = 1 + 1.7 * k;
    S.place(o.ovary, { x: 0, y: -8 - 40 * sc, s: sc });
    o.ovWall.setAttribute('fill', gsap.utils.interpolate(OVW, '#e0503a', sm(0.2, 1, k)));
    o.ovWall.setAttribute('stroke', gsap.utils.interpolate('#b8e898', '#ff9a7a', sm(0.2, 1, k)));
    o.ovCav.setAttribute('fill', gsap.utils.interpolate('#d8f0c8', '#ffb59a', sm(0.2, 1, k)));
    o.ovules.forEach((og) => {
      og.body.setAttribute('fill', gsap.utils.interpolate('#f6faec', '#f2dc9a', sm(0.3, 1, k)));
      og.body.setAttribute('stroke', gsap.utils.interpolate('#9ab880', '#c9a050', sm(0.3, 1, k)));
      og.egg.style.opacity = 1 - sm(0.2, 0.6, k);
    });
  };
  // 花瓣、雄蕊凋落；花柱、柱頭枯萎：k 0→1
  B1.wither = (o, k, { petals = true, stamens = true, style = true } = {}) => {
    if (petals) o.petals.forEach((pg, i) => { const sd = i ? 1 : -1, t = sm(0, 1, k); S.place(pg, { x: sd * 50 * t, y: 120 * t * t, r: sd * 30 * t }); pg.style.opacity = 1 - sm(0.25, 0.75, k); });
    if (stamens) o.stamens.forEach((sg, i) => { const sd = i < 2 ? -1 : 1, t = sm(0.1, 1, k); S.place(sg, { x: sd * 24 * t, y: 90 * t * t, r: sd * 20 * t }); sg.style.opacity = 1 - sm(0.2, 0.7, k); });
    if (style) { o.styleG.style.opacity = 1 - sm(0.05, 0.45, k); o.back.style.opacity = 1 - sm(0, 0.6, k); }
  };

  // ---------- 蜜蜂（面向右） ----------
  B1.bee = (p, s = 1) => {
    const b = S.place(g(p), { s });
    const w1 = el('ellipse', { cx: -4, cy: -18, rx: 14, ry: 8, fill: 'rgba(230,245,255,0.6)', stroke: '#ffffff', 'stroke-width': 1.2, transform: 'rotate(-20 -4 -18)' }, b);
    [[-8, 12, -14, 22], [2, 13, 0, 23], [12, 12, 16, 22]].forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: '#2a2016', 'stroke-width': 2 }, b));
    el('ellipse', { cx: 0, cy: 0, rx: 24, ry: 15, fill: '#f6c43a', stroke: '#2a2016', 'stroke-width': 2 }, b);
    [-8, 2, 12].forEach((x) => el('path', { d: `M ${x},-14 Q ${x + 4},0 ${x},14`, fill: 'none', stroke: '#2a2016', 'stroke-width': 4 }, b));
    el('circle', { cx: 26, cy: -2, r: 10, fill: '#2a2016' }, b);
    el('circle', { cx: 30, cy: -5, r: 2.5, fill: '#ffffff' }, b);
    el('path', { d: 'M 30,-10 q 6,-12 14,-14 M 26,-11 q 2,-12 8,-16', fill: 'none', stroke: '#2a2016', 'stroke-width': 1.8 }, b);
    el('path', { d: 'M -24,0 l -7,0', stroke: '#2a2016', 'stroke-width': 2 }, b);
    const w2 = el('ellipse', { cx: 6, cy: -20, rx: 16, ry: 9, fill: 'rgba(230,245,255,0.7)', stroke: '#ffffff', 'stroke-width': 1.2, transform: 'rotate(-30 6 -20)' }, b);
    const pol = g(b, { opacity: 0 });
    [[-6, 10], [4, 12], [-14, 6], [10, 8], [0, 4]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 3, fill: POL, stroke: '#a07010', 'stroke-width': 0.8 }, pol));
    b.flap = (t) => { const a = Math.sin(t * 40) * 18; w1.setAttribute('transform', `rotate(${-20 + a} -4 -10)`); w2.setAttribute('transform', `rotate(${-30 - a} 6 -10)`); };
    b.pollen = pol;
    return b;
  };

  // ---------- 玉米（風媒花） ----------
  function corn(p, x, y0, { tassel = true, ear = true } = {}) {
    const c = g(p);
    const top = y0 - 360;
    // 葉：從莖斜向上伸出，葉尖略彎
    [[y0 - 60, -1, 110], [y0 - 120, 1, 120], [y0 - 190, -1, 110], [y0 - 250, 1, 96], [y0 - 300, -1, 80]].forEach(([ly, sd, L]) => {
      el('path', { d: `M ${x},${ly} C ${x + sd * L * 0.4},${ly - L * 0.7} ${x + sd * L * 0.8},${ly - L * 0.6} ${x + sd * L},${ly - L * 0.32} C ${x + sd * L * 0.78},${ly - L * 0.5} ${x + sd * L * 0.38},${ly - L * 0.52} ${x},${ly - 12} Z`, fill: '#5fae4a', stroke: '#a8e39a', 'stroke-width': 1.5 }, c);
    });
    el('path', { d: `M ${x - 6},${y0} L ${x - 5},${top} L ${x + 5},${top} L ${x + 6},${y0} Z`, fill: '#7fbf5a', stroke: '#a8e39a', 'stroke-width': 1.5 }, c);
    [60, 120, 190, 250, 300].forEach((d) => el('line', { x1: x - 7, y1: y0 - d, x2: x + 7, y2: y0 - d, stroke: '#4f8a3a', 'stroke-width': 2 }, c));
    const parts = {};
    if (tassel) {
      const t = g(c);
      [[0, -64], [-32, -48], [32, -48], [-44, -24], [44, -24]].forEach(([dx, dy]) => {
        el('path', { d: `M ${x},${top + 4} Q ${x + dx * 0.4},${top + dy * 0.6} ${x + dx},${top + dy}`, fill: 'none', stroke: '#c9b870', 'stroke-width': 3, 'stroke-linecap': 'round' }, t);
        for (let k = 1; k <= 4; k++) { const fx = x + dx * (k / 4.4), fy = top + 4 + (dy - 4) * (k / 4.4); el('line', { x1: fx, y1: fy, x2: fx + (dx >= 0 ? 3 : -3), y2: fy + 7, stroke: '#ffd166', 'stroke-width': 3, 'stroke-linecap': 'round' }, t); }
      });
      parts.tassel = [x, top - 30];
    }
    if (ear) {
      const ey = y0 - 170;
      const e = g(c);
      el('path', { d: `M ${x + 4},${ey + 10} C ${x + 30},${ey - 6} ${x + 46},${ey - 40} ${x + 50},${ey - 72} C ${x + 36},${ey - 60} ${x + 14},${ey - 30} ${x + 4},${ey - 4} Z`, fill: '#8fcf6a', stroke: '#c8f0a8', 'stroke-width': 2 }, e);
      for (let k = 0; k < 7; k++) el('path', { d: `M ${x + 48},${ey - 70} q ${10 + k * 4},${-10 - k * 2} ${18 + k * 6},${4 + k * 3}`, fill: 'none', stroke: '#e8c070', 'stroke-width': 1.8, opacity: 0.95 }, e);
      parts.silk = [x + 66, ey - 70];
    }
    c.parts = parts;
    return c;
  }

  S.register({
    id: 'flower', section: '下1-3', title: '植物的有性生殖',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 花的構造 =====
      const P0 = g(root);
      const f0 = B1.flower(P0, { x: 360, y: 440, s: 1.12 });
      const L0 = [
        [[0, -186], 110, 196, '柱頭', STG], [[-66, -166], 110, 286, '花藥', ANT], [[-118, -150], 110, 376, '花瓣', PET], [[-104, -32], 110, 466, '花萼', SEP_E], [[-24, 14], 110, 560, '花托', '#a8e39a'],
        [[3, -126], 610, 250, '花柱', STY], [[48, -96], 610, 340, '花絲', FIL], [[30, -36], 610, 430, '子房', OVW], [[11, -61], 610, 506, '胚珠', '#f6faec'],
      ].map(([[lx, ly], x, yy, s, c]) => { const [tx, ty] = f0.at(lx, ly); return S.callout(P0, tx, ty, x, yy, s, c, { size: 24 }); });
      const info0 = g(P0, { opacity: 0 });
      el('rect', { x: 700, y: 96, width: 470, height: 560, rx: 16, ...FRAME }, info0);
      text(info0, 935, 142, '花是生殖器官', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const rows0 = [['雄蕊', '＝花藥＋花絲', '花藥產生花粉', ANT], ['雌蕊', '＝柱頭＋花柱＋子房', '子房內有胚珠，胚珠內有卵', OVW], ['花瓣', '', '通常鮮豔，吸引動物傳粉', PET], ['花萼', '', '通常綠色，保護花的內部', SEP_E]].map(([a, b, c, col], i) => {
        const rg = g(info0, { opacity: 0 });
        const y = 206 + i * 110;
        text(rg, 730, y, a, { 'font-size': 28, 'font-weight': 700, fill: col });
        if (b) text(rg, 790, y, b, { 'font-size': 24, fill: C.ink });
        text(rg, 730, y + 40, c, { 'font-size': 23, fill: C.ink2 });
        return rg;
      });
      tl.addLabel('s0');
      L0.forEach((l, i) => S.show(tl, l, `s0+=${0.5 + i * 0.35}`, 0.3));
      S.show(tl, info0, 's0+=3.6', 0.4);
      rows0.forEach((r, i) => S.show(tl, r, `s0+=${3.8 + i * 0.45}`, 0.35));

      // ===== 1 授粉：蟲媒花與風媒花 =====
      const P1 = g(root, { opacity: 0 });
      S.pill(P1, 600, 46, '授粉：花粉落到雌蕊的柱頭上', { size: 26, color: C.hi, edge: C.hi });
      el('rect', { x: 30, y: 84, width: 560, height: 572, rx: 16, ...FRAME }, P1);
      el('rect', { x: 610, y: 84, width: 560, height: 572, rx: 16, ...FRAME }, P1);
      text(P1, 310, 126, '蟲媒花', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P1, 890, 126, '風媒花', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const fa = B1.flower(P1, { x: 170, y: 420, s: 0.62 }), fb = B1.flower(P1, { x: 440, y: 420, s: 0.62 });
      const bee = B1.bee(P1, 1.1);
      const stgPol = g(P1, { opacity: 0 });
      const [sx, sy] = fb.at(0, -188);
      [[-6, 0], [4, -3], [8, 3], [-2, 4]].forEach(([dx, dy]) => el('circle', { cx: sx + dx, cy: sy + dy, r: 3.2, fill: POL, stroke: '#a07010', 'stroke-width': 0.8 }, stgPol));
      const lb1 = [S.callout(P1, 132, 312, 180, 176, '花粉沾在蜜蜂身上', ANT, { size: 22 }), S.callout(P1, sx, sy, 480, 176, '落到柱頭上', STG, { size: 22 })];
      text(P1, 310, 572, '花瓣鮮豔、有香味或花蜜，', { 'font-size': 23, 'text-anchor': 'middle' });
      text(P1, 310, 604, '花粉較黏，容易沾在昆蟲身上', { 'font-size': 23, 'text-anchor': 'middle' });
      text(P1, 310, 638, '例如：木槿、百日草', { 'font-size': 21, 'text-anchor': 'middle', fill: C.mute });
      const c1 = corn(P1, 760, 530), c2 = corn(P1, 1030, 530);
      el('line', { x1: 630, y1: 530, x2: 1150, y2: 530, stroke: '#7a5634', 'stroke-width': 4 }, P1);
      const wind = g(P1);
      [[628, 150], [628, 180]].forEach(([x, y]) => { const a = arrow(wind, x, y, x + 50, y, '#cfe8ff', 3, 12); a.setAttribute('opacity', 0.8); });
      text(wind, 652, 134, '風', { 'font-size': 22, 'text-anchor': 'middle', fill: '#cfe8ff' });
      const pol1 = Array.from({ length: 16 }, () => el('circle', { r: 3.2, fill: POL, opacity: 0 }, P1));
      const lb1b = [S.callout(P1, c1.parts.tassel[0] + 16, c1.parts.tassel[1] + 10, 850, 170, '雄花', ANT, { size: 22 }), S.callout(P1, c2.parts.silk[0] + 10, c2.parts.silk[1] + 4, 1128, 432, '雌花', '#e8c070', { size: 22 })];
      text(P1, 890, 572, '花小、不鮮豔，沒有香味和花蜜；', { 'font-size': 23, 'text-anchor': 'middle' });
      text(P1, 890, 604, '花粉多而輕，容易被風吹散', { 'font-size': 23, 'text-anchor': 'middle' });
      text(P1, 890, 638, '例如：玉米、稻', { 'font-size': 21, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      const [ax, ay] = fa.at(-60, -168);
      S.drive(tl, (u) => {
        const k1 = sm(0, 0.3, u), k2 = sm(0.45, 0.8, u);
        let bx, by;
        if (u < 0.45) { bx = S.lerp(60, ax + 6, k1); by = S.lerp(250, ay - 18, k1) + Math.sin(u * 30) * 4 * (1 - k1); }
        else { bx = S.lerp(ax + 6, sx - 4, k2); by = S.lerp(ay - 18, sy - 24, k2) - Math.sin(k2 * Math.PI) * 60; }
        S.place(bee, { x: bx, y: by, s: 1.1 });
        bee.flap(u * 8);
        bee.pollen.style.opacity = u > 0.32 && u < 0.86 ? 1 : 0;
        stgPol.style.opacity = u >= 0.84 ? 1 : 0;
      }, 5, 's1+=0.6', 'none');
      S.show(tl, lb1[0], 's1+=2.2', 0.3);
      S.show(tl, lb1[1], 's1+=4.9', 0.3);
      const [tx0, ty0] = c1.parts.tassel, [gx, gy] = c2.parts.silk;
      S.drive(tl, (u) => pol1.forEach((pp, i) => {
        const k = sm(i * 0.03, 0.55 + i * 0.03, u);
        const x = S.lerp(tx0 + (i % 4) * 8 - 12, gx + (i % 5) * 6 - 6, k), y = S.lerp(ty0 + 30 + (i % 3) * 6, gy + (i % 4) * 5 - 6, k) - Math.sin(k * Math.PI) * (40 + (i % 3) * 20);
        pp.setAttribute('cx', x.toFixed(1)); pp.setAttribute('cy', y.toFixed(1)); pp.style.opacity = k > 0 ? 1 : 0;
      }), 4.4, 's1+=1', 'none');
      lb1b.forEach((l, i) => S.show(tl, l, `s1+=${1.2 + i * 3}`, 0.3));

      // ===== 2 受精：花粉管 =====
      const P2 = g(root, { opacity: 0 });
      const X2 = 360, MX = (x) => 2 * X2 - x;
      text(P2, X2, 56, '花的中央：雌蕊放大（縱切面）', { 'font-size': 26, 'text-anchor': 'middle', fill: C.mute });
      // 花的其他部分（淡色）：花瓣、雄蕊、花萼、花托、花梗，讓雌蕊看得出是在花裡面
      const ctx2 = g(P2);
      const petL = 'M 236,600 C 170,566 104,470 84,336 C 80,306 96,290 116,300 C 156,342 200,440 262,566 Z';
      [false, true].forEach((m) => { const pg = g(ctx2, m ? { transform: `translate(${2 * X2},0) scale(-1,1)` } : {}); el('path', { d: petL, fill: '#ffb3d0', opacity: 0.55, stroke: PET_E, 'stroke-width': 1.5 }, pg);
        el('path', { d: 'M 248,580 C 200,520 140,430 104,312', fill: 'none', stroke: PET_V, 'stroke-width': 1.5, opacity: 0.5 }, pg);
        [['M 252,598 C 230,520 204,420 184,334', 182, 318, -12], ['M 268,600 C 256,520 240,430 228,352', 227, 336, -6]].forEach(([d, ax, ay, r]) => {
          el('path', { d, fill: 'none', stroke: FIL, 'stroke-width': 4, opacity: 0.8 }, pg);
          el('ellipse', { cx: ax, cy: ay, rx: 11, ry: 24, fill: ANT, opacity: 0.85, transform: `rotate(${r} ${ax} ${ay})` }, pg);
        });
        el('path', { d: 'M 230,606 C 186,612 134,598 100,560 C 146,556 190,568 232,586 Z', fill: SEP, stroke: SEP_E, 'stroke-width': 2 }, pg);
      });
      el('rect', { x: X2 - 22, y: 640, width: 44, height: 80, fill: '#6fae4a', stroke: '#9fd07a', 'stroke-width': 1.5 }, ctx2);
      el('path', { d: `M 200,584 C 214,636 300,660 ${X2},660 C 420,660 506,636 520,584 C 470,598 250,598 200,584 Z`, fill: '#78b85a', stroke: '#a8e39a', 'stroke-width': 2 }, ctx2);
      // 子房（剖開）與胚珠
      el('ellipse', { cx: X2, cy: 468, rx: 140, ry: 124, fill: OVW, stroke: '#b8e898', 'stroke-width': 3 }, P2);
      el('ellipse', { cx: X2, cy: 472, rx: 116, ry: 102, fill: '#d8f0c8' }, P2);
      [268, MX(268)].forEach((x) => { el('line', { x1: x, y1: 508, x2: x, y2: 568, stroke: '#a8c890', 'stroke-width': 3 }, P2); el('ellipse', { cx: x, cy: 478, rx: 22, ry: 32, fill: '#f6faec', stroke: '#9ab880', 'stroke-width': 2 }, P2); });
      el('line', { x1: X2, y1: 556, x2: X2, y2: 574, stroke: '#a8c890', 'stroke-width': 5 }, P2);
      el('path', { d: `M 352,396 C 304,402 290,450 294,496 C 300,540 326,560 ${X2},560 C 394,560 420,540 426,496 C 430,450 416,402 368,396 Z`, fill: '#f6faec', stroke: '#9ab880', 'stroke-width': 3 }, P2);
      el('ellipse', { cx: X2, cy: 482, rx: 36, ry: 54, fill: '#fffbe8', stroke: '#d8d0a0', 'stroke-width': 2 }, P2);
      const egg2 = el('circle', { cx: X2, cy: 434, r: 14, fill: '#ffcf8a', stroke: '#ff9a5c', 'stroke-width': 2.5 }, P2);
      el('circle', { cx: X2, cy: 436, r: 5, fill: '#c0602a' }, P2);
      const zy2 = el('circle', { cx: X2, cy: 434, r: 16, fill: C.hi, stroke: '#ffffff', 'stroke-width': 3, opacity: 0 }, P2);
      // 花柱（約和子房一樣高，比較短）與分裂成三片的柱頭
      el('path', { d: `M 338,350 C 340,300 342,252 344,214 L 376,214 C 378,252 380,300 382,350 Z`, fill: STY, stroke: '#d0f0a8', 'stroke-width': 2 }, P2);
      el('path', { d: `M 296,216 C 280,192 300,166 324,182 C 328,154 392,154 396,182 C 420,166 440,192 424,216 Z`, fill: STG, stroke: '#f4ffb0', 'stroke-width': 2 }, P2);
      [[312, 196], [336, 176], [360, 170], [384, 176], [408, 196], [350, 196], [372, 200]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 2.5, fill: '#f4ffb0' }, P2));
      const grain = g(P2);
      el('circle', { cx: 400, cy: 158, r: 14, fill: POL, stroke: '#a07010', 'stroke-width': 2 }, grain);
      for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; el('line', { x1: 400 + Math.cos(a) * 14, y1: 158 + Math.sin(a) * 14, x2: 400 + Math.cos(a) * 18, y2: 158 + Math.sin(a) * 18, stroke: '#a07010', 'stroke-width': 2 }, grain); }
      const tube = el('path', { d: `M 394,170 C 380,184 362,196 ${X2},218 L ${X2},350 C ${X2},372 ${X2 + 1},384 ${X2},398`, fill: 'none', stroke: '#fff2c0', 'stroke-width': 6, 'stroke-linecap': 'round' }, P2);
      const spc = [0, 1].map(() => el('ellipse', { rx: 6, ry: 4, fill: '#62a8ff', stroke: '#e8f6ff', 'stroke-width': 1.5, opacity: 0 }, P2));
      const lab2 = [
        S.callout(P2, 410, 150, 640, 100, '花粉', POL, { size: 24 }),
        S.callout(P2, X2 + 2, 262, 640, 196, '花粉管', '#fff2c0', { size: 24 }),
        S.callout(P2, X2 + 2, 322, 640, 282, '精細胞', '#62a8ff', { size: 24 }),
        S.callout(P2, 300, 524, 130, 644, '胚珠', '#f6faec', { size: 24 }),
        S.callout(P2, X2 - 14, 434, 130, 236, '卵（卵細胞）', '#ffcf8a', { size: 24 }),
        S.callout(P2, 226, 468, 110, 460, '子房', OVW, { size: 24 }),
        S.callout(P2, 450, 640, 620, 662, '花托', '#a8e39a', { size: 22 }),
      ];
      const done2 = g(P2, { opacity: 0 });
      S.pill(done2, 640, 404, '受精卵', { size: 26, color: C.hi, edge: C.hi });
      el('line', { x1: X2 + 16, y1: 430, x2: 594, y2: 406, stroke: C.hi, 'stroke-width': 2.5 }, done2);
      const list2 = g(P2, { opacity: 0 });
      el('rect', { x: 740, y: 96, width: 430, height: 420, rx: 16, ...FRAME }, list2);
      const items2 = ['① 花粉落在柱頭上（授粉）', '② 花粉長出花粉管，', '　穿過花柱', '③ 花粉管到達胚珠', '④ 精細胞和卵結合', '　→ 受精卵'].map((s, i) => {
        const ig = g(list2, { opacity: 0.25 });
        text(ig, 768, 150 + i * 60, s, { 'font-size': 25, fill: s.startsWith('　') ? C.ink2 : C.ink, 'font-weight': s.startsWith('　') ? 400 : 700 });
        return ig;
      });
      const note2 = g(P2, { opacity: 0 });
      S.pill(note2, 955, 580, '受精作用在胚珠內進行', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, list2, 's2+=0.4', 0.3);
      lab2.forEach((l, i) => { if (i >= 3) S.show(tl, l, `s2+=${0.6 + (i - 3) * 0.25}`, 0.3); });
      S.show(tl, lab2[0], 's2+=0.8', 0.3);
      S.drawOn(tl, tube, 3, 's2+=1.4', 'power1.inOut');
      S.show(tl, lab2[1], 's2+=2.4', 0.3);
      const tL = tube.getTotalLength();
      S.drive(tl, (u) => {
        const head = sm(0, 1, u) * tL;
        spc.forEach((c, i) => {
          const q = tube.getPointAtLength(Math.max(0, head - 14 - i * 14));
          c.setAttribute('cx', q.x); c.setAttribute('cy', q.y); c.style.opacity = u > 0.05 ? 1 : 0;
        });
      }, 3, 's2+=1.4', 'power1.inOut');
      S.show(tl, lab2[2], 's2+=3.2', 0.3);
      S.drive(tl, (u) => {
        const e = tube.getPointAtLength(tL);
        spc[0].setAttribute('cx', S.lerp(e.x, X2, u)); spc[0].setAttribute('cy', S.lerp(e.y, 430, u)); spc[0].style.opacity = u < 0.95 ? 1 : 0;
        spc[1].setAttribute('cx', S.lerp(e.x, X2 + 6, u)); spc[1].setAttribute('cy', S.lerp(e.y - 10, 490, u)); spc[1].style.opacity = 1 - sm(0.6, 1, u);
        zy2.style.opacity = sm(0.85, 1, u);
        egg2.style.opacity = 1 - sm(0.85, 1, u);
      }, 1.2, 's2+=4.5', 'none');
      S.show(tl, done2, 's2+=5.7', 0.3);
      [0, 1.4, 1.4, 3.6, 4.6, 5.6].forEach((t, i) => tl.fromTo(items2[i], { opacity: 0.25 }, { opacity: 1, duration: 0.3, immediateRender: false }, `s2+=${0.6 + t}`));
      S.show(tl, note2, 's2+=6.2', 0.4);

      // ===== 3 果實與種子 =====
      const P3 = g(root, { opacity: 0 });
      const f3 = B1.flower(P3, { x: 330, y: 460, s: 1.1 });
      const stage3 = text(P3, 330, 70, '受精後……', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.mute });
      const fr3 = g(P3, { opacity: 0 });
      const [fx3, fy3] = f3.at(0, -118);
      S.callout(fr3, fx3 - 88, fy3, 110, 220, '果實', '#ff9a7a', { size: 26 }).style.opacity = 1;
      S.callout(fr3, fx3 + 30, fy3 + 34, 560, 300, '種子', '#f2dc9a', { size: 26 }).style.opacity = 1;
      S.callout(fr3, ...f3.at(-100, -30), 120, 520, '花萼常留著', SEP_E, { size: 22 }).style.opacity = 1;
      el('rect', { x: 640, y: 96, width: 530, height: 440, rx: 16, ...FRAME }, P3);
      text(P3, 905, 142, '花的哪裡變成什麼？', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const map3 = [['子房', '果實', OVW, '#ff9a7a'], ['胚珠', '種子', '#f6faec', '#f2dc9a'], ['受精卵', '胚（在種子內）', '#ffcf8a', C.hi], ['花瓣、雄蕊、', '凋謝掉落', PET, C.mute]].map(([a, b, ca, cb], i) => {
        const mg = g(P3, { opacity: 0 });
        const y = 214 + i * 82;
        text(mg, 818, y, a, { 'font-size': 28, 'font-weight': 700, fill: ca, 'text-anchor': 'end' });
        if (i === 3) text(mg, 818, y + 30, '柱頭、花柱', { 'font-size': 22, fill: ca, 'text-anchor': 'end' });
        arrow(mg, 834, y - 9, 890, y - 9, C.ink2, 4, 14); // 左欄右對齊在 818，「花瓣、雄蕊、」不超出框（框左緣 x=640）
        text(mg, 906, y, b, { 'font-size': 28, 'font-weight': 700, fill: cb });
        return mg;
      });
      const ex3 = g(P3, { opacity: 0 });
      S.pill(ex3, 905, 590, '例如：豌豆的豆莢是果實，豆子是種子', { size: 24, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drive(tl, (u) => { B1.wither(f3, sm(0, 0.45, u)); B1.fruitGrow(f3, sm(0.35, 1, u)); }, 5, 's3+=0.8', 'none');
      tl.fromTo(stage3, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's3+=5.6');
      S.show(tl, fr3, 's3+=5.9', 0.4);
      [3, 0, 1, 2].forEach((k, i) => S.show(tl, map3[k], `s3+=${1.4 + i * 1.2}`, 0.4));
      S.show(tl, ex3, 's3+=6.4', 0.4);

      // ===== 4 果實與種子的傳播 =====
      const P4 = g(root, { opacity: 0 });
      const PX = [24, 315, 606, 897], PW = 279;
      PX.forEach((x) => el('rect', { x, y: 96, width: PW, height: 540, rx: 16, ...FRAME }, P4));
      ['風力', '動物', '水力', '自身的彈力'].forEach((s, i) => text(P4, PX[i] + PW / 2, 142, s, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi }));
      [['輕，有冠毛或翅', '例如：蒲公英、青楓'], ['有鉤刺，或果實被吃', '例如：鬼針草、番茄'], ['外殼厚，能浮在水上', '例如：椰子、棋盤腳'], ['果實成熟裂開，彈出種子', '例如：鳳仙花、酢漿草']].forEach(([a, b], i) => {
        text(P4, PX[i] + PW / 2, 582, a, { 'font-size': 22, 'text-anchor': 'middle' });
        text(P4, PX[i] + PW / 2, 614, b, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      });
      // 風：蒲公英、青楓
      el('path', { d: 'M 110,530 C 106,460 114,400 110,330', fill: 'none', stroke: '#7fae4a', 'stroke-width': 5 }, P4);
      [[-1, 520, 42], [1, 506, 36]].forEach(([sd, ly, L]) => el('path', { d: `M 110,${ly} C ${110 + sd * L * 0.5},${ly - L * 0.9} ${110 + sd * L},${ly - L * 1.2} ${110 + sd * L * 1.1},${ly - L * 1.5} C ${110 + sd * L * 0.6},${ly - L * 1.1} ${110 + sd * 8},${ly - L * 0.5} 110,${ly - 8} Z`, fill: '#5fae4a', stroke: '#a8e39a', 'stroke-width': 1.5 }, P4));
      const dHead = g(P4);
      for (let i = 0; i < 26; i++) { const a = (i / 26) * 6.283; el('line', { x1: 110, y1: 310, x2: 110 + Math.cos(a) * 46, y2: 310 + Math.sin(a) * 46, stroke: '#f4f4f4', 'stroke-width': 1.5, opacity: 0.85 }, dHead); el('circle', { cx: 110 + Math.cos(a) * 47, cy: 310 + Math.sin(a) * 47, r: 3, fill: '#ffffff', opacity: 0.8 }, dHead); }
      el('circle', { cx: 110, cy: 310, r: 10, fill: '#c9a060' }, dHead);
      const dandSeed = () => { const s = g(P4); el('path', { d: 'M 0,0 L 0,-26', stroke: '#e8e8e8', 'stroke-width': 1.5 }, s); el('ellipse', { cx: 0, cy: 6, rx: 2.5, ry: 7, fill: '#9a7040' }, s); for (let k = -4; k <= 4; k++) el('line', { x1: 0, y1: -26, x2: k * 4, y2: -38 + Math.abs(k) * 1.5, stroke: '#f4f4f4', 'stroke-width': 1.3 }, s); return s; };
      const seeds4 = [0, 1, 2].map(() => dandSeed());
      const samara = g(P4);
      el('path', { d: 'M 0,0 C 6,-10 30,-20 52,-12 C 40,-4 20,4 0,0 Z', fill: '#c9a060', stroke: '#e8c88a', 'stroke-width': 1.5 }, samara);
      el('ellipse', { cx: 0, cy: 0, rx: 8, ry: 6, fill: '#9a7040' }, samara);
      const wind4 = g(P4);
      [[44, 200], [44, 240]].forEach(([x, y]) => { const a = arrow(wind4, x, y, x + 54, y, '#cfe8ff', 3, 11); a.setAttribute('opacity', 0.8); });
      // 動物：鬼針草黏在毛上；鳥吃果實
      const fur = g(P4);
      for (let i = 0; i < 18; i++) el('path', { d: `M ${330 + i * 14},${180} q 6,40 -4,${80 + (i % 3) * 8}`, fill: 'none', stroke: '#a07a50', 'stroke-width': 5, 'stroke-linecap': 'round' }, fur);
      text(P4, 454, 300, '動物的毛', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const bidens = [[380, 230, -20], [430, 214, 10], [500, 240, 25]].map(([x, y, r]) => {
        const b = S.place(g(P4, { opacity: 0 }), { x, y, r });
        el('path', { d: 'M -5,0 L -3,54 L 3,54 L 5,0 Z', fill: '#d9b070', stroke: '#f2dca8', 'stroke-width': 1.5 }, b);
        [[-9, -24], [0, -28], [9, -24]].forEach(([dx, dy]) => { el('line', { x1: dx * 0.3, y1: 0, x2: dx, y2: dy, stroke: '#f2dca8', 'stroke-width': 3, 'stroke-linecap': 'round' }, b); el('path', { d: `M ${dx},${dy + 6} l -4,6 M ${dx},${dy + 6} l 4,6 M ${dx},${dy + 14} l -4,6 M ${dx},${dy + 14} l 4,6`, stroke: '#f2dca8', 'stroke-width': 1.6 }, b); });
        return b;
      });
      el('path', { d: 'M 340,470 C 400,462 480,466 580,452', fill: 'none', stroke: '#8a6a40', 'stroke-width': 6, 'stroke-linecap': 'round' }, P4);
      el('path', { d: 'M 560,456 C 540,446 520,436 500,430', fill: 'none', stroke: '#8a6a40', 'stroke-width': 3 }, P4);
      [[494, 428], [506, 438], [498, 444], [512, 426]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 8, fill: '#e0384c', stroke: '#ff8a9a', 'stroke-width': 1.5 }, P4));
      const bird = g(P4);
      el('path', { d: 'M 370,452 L 340,470 L 362,466 Z', fill: '#6a5040' }, bird);
      el('ellipse', { cx: 410, cy: 440, rx: 40, ry: 24, fill: '#8a6a50', stroke: '#c8a888', 'stroke-width': 2 }, bird);
      el('path', { d: 'M 392,432 C 406,424 430,428 440,442 C 424,446 404,444 392,432 Z', fill: '#6a5040' }, bird);
      el('circle', { cx: 450, cy: 414, r: 18, fill: '#8a6a50', stroke: '#c8a888', 'stroke-width': 2 }, bird);
      el('circle', { cx: 456, cy: 410, r: 3.5, fill: '#1a1a1a' }, bird);
      el('path', { d: 'M 466,412 L 484,420 L 466,422 Z', fill: '#f0b840' }, bird);
      el('path', { d: 'M 404,462 l -2,8 M 418,462 l 2,8', stroke: '#c8a888', 'stroke-width': 3 }, bird);
      text(P4, 454, 532, '果實被吃，種子隨糞便排出', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 水：椰子
      const waves = el('path', { d: '', fill: 'rgba(95,184,255,0.25)', stroke: C.water, 'stroke-width': 3 }, P4);
      const coco = g(P4);
      el('ellipse', { cx: 0, cy: 0, rx: 46, ry: 36, fill: '#8a6a3a', stroke: '#c9a060', 'stroke-width': 2.5 }, coco);
      el('path', { d: 'M -30,-20 Q 0,-30 30,-20 M -40,0 Q 0,-8 40,0 M -30,20 Q 0,14 30,20', fill: 'none', stroke: '#b08a50', 'stroke-width': 2 }, coco);
      // 彈力：鳳仙花
      el('path', { d: 'M 990,530 C 986,450 994,380 990,300', fill: 'none', stroke: '#9fc07a', 'stroke-width': 6 }, P4);
      [[-1, 470], [1, 420]].forEach(([sd, ly]) => el('path', { d: `M 990,${ly} C ${990 + sd * 30},${ly - 30} ${990 + sd * 60},${ly - 34} ${990 + sd * 80},${ly - 52} C ${990 + sd * 56},${ly - 10} ${990 + sd * 26},${ly - 2} 990,${ly - 6} Z`, fill: '#5fae4a', stroke: '#a8e39a', 'stroke-width': 1.5 }, P4));
      el('path', { d: 'M 990,340 C 1010,330 1030,320 1044,300', fill: 'none', stroke: '#9fc07a', 'stroke-width': 3 }, P4);
      const pod = g(P4);
      el('ellipse', { cx: 1050, cy: 268, rx: 14, ry: 36, fill: '#7fcf62', stroke: '#c8f0b0', 'stroke-width': 2, transform: 'rotate(20 1050 268)' }, pod);
      el('path', { d: 'M 1040,238 Q 1052,268 1062,298', fill: 'none', stroke: '#c8f0b0', 'stroke-width': 1.5 }, pod);
      const curls = g(P4, { opacity: 0 });
      [[-1, 0], [1, 0], [0, 1]].forEach(([dx]) => el('path', { d: `M 1050,300 c ${dx * 10},-20 ${dx * 30 + 12},-20 ${dx * 24 + 6},-4 c -6,10 -14,6 -10,-2`, fill: 'none', stroke: '#7fcf62', 'stroke-width': 4, 'stroke-linecap': 'round' }, curls));
      const bseeds = [0, 1, 2, 3, 4].map(() => el('circle', { r: 5, fill: '#5a4030', stroke: '#a08060', 'stroke-width': 1, opacity: 0 }, P4));
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      bidens.forEach((b, i) => S.show(tl, b, `s4+=${1 + i * 0.4}`, 0.3));
      S.drive(tl, (u) => {
        seeds4.forEach((s, i) => { const k = sm(i * 0.12, 0.7 + i * 0.1, u), a = -0.6 + i * 0.5; S.place(s, { x: 110 + Math.cos(a) * 46 + k * (110 - i * 20), y: 310 + Math.sin(a) * 46 - k * (70 - i * 30) + Math.sin(k * 8 + i) * 6 }); });
        S.place(samara, { x: 220 - u * 30, y: 210 + u * 220, r: u * 900 });
        let d = 'M 622,470';
        for (let x = 622; x <= 870; x += 8) d += ` L ${x},${(470 + Math.sin((x - 600) / 26 + u * 12) * 7).toFixed(1)}`;
        waves.setAttribute('d', d + ' L 870,560 L 622,560 Z');
        S.place(coco, { x: 690 + u * 110, y: 446 + Math.sin(u * 12 + 3) * 6, r: Math.sin(u * 10) * 8 });
        const kb = sm(0.3, 0.38, u);
        pod.style.opacity = 1 - kb; curls.style.opacity = kb;
        bseeds.forEach((b, i) => {
          const k = sm(0.36, 0.9, u), vx = [-130, -80, 30, 70, 100][i], vy = [-120, -160, -170, -130, -90][i];
          b.setAttribute('cx', (1050 + vx * k * 0.9).toFixed(1)); b.setAttribute('cy', Math.min(526, 290 + vy * k + 380 * k * k).toFixed(1));
          b.style.opacity = k > 0 ? 1 : 0;
        });
      }, 5, 's4+=0.6', 'none');

      return {
        tl,
        notes: [
          '＊示意：典型的花的縱切面，不同植物的花構造會有差異。有些課本把花萼稱為萼片。花萼、花瓣、雄蕊和雌蕊都長在花托上。',
          '＊示意：花粉粒畫得很大。花粉落到同一朵花的柱頭上，也是授粉。玉米的雄花在植株頂端，雌花在莖的中段，玉米鬚是雌花長長的花柱和柱頭（補充）。',
          '＊示意：花粉管和胚珠都畫得很大。補充：花粉管中有兩個精細胞，一個和卵結合成受精卵，另一個參與形成種子中儲存養分的部分（高中再學）。蕨類和蘚苔沒有花粉管，精子要靠水游到卵。',
          '＊示意：以番茄這類果實為例，花萼常留在果實上。子房壁發育成果皮（補充）。種子由種皮包覆，種皮可以保護種子。',
          '＊果實和種子的傳播方式，國小已經學過，這裡是複習。鬼針草的果實有倒鉤，能黏在動物的毛或人的衣服上。',
        ],
        steps: [
          '<b>花</b>是開花植物的生殖器官。<b>雄蕊</b>包括花藥和花絲，花藥產生<b>花粉</b>；<b>雌蕊</b>包括柱頭、花柱和子房，子房內的<b>胚珠</b>中有卵。',
          '<b>授粉</b>：花粉落到雌蕊的<b>柱頭</b>上。<b>蟲媒花</b>靠昆蟲傳粉，花瓣鮮豔、有香味或花蜜；<b>風媒花</b>靠風傳粉，花小、不鮮豔，花粉多而輕。',
          '<b>受精</b>：授粉後，花粉長出<b>花粉管</b>，穿過花柱到達<b>胚珠</b>；花粉管中的<b>精細胞</b>和胚珠內的<b>卵</b>結合，形成受精卵。',
          '受精後，花瓣、雄蕊等逐漸凋謝；<b>子房</b>發育成<b>果實</b>，<b>胚珠</b>發育成<b>種子</b>，受精卵發育成種子內的<b>胚</b>。',
          '果實和種子靠<b>風</b>、<b>動物</b>、<b>水</b>或<b>自身的彈力</b>傳播到各處；落在適當的環境，種子就能萌芽，長成新植株。',
        ],
      };
    },
  });
})();
