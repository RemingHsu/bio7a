/* 3-1 植物的運輸構造：跨尺度（植物 → 莖的橫切面 → 維管束 → 導管和篩管）、運輸方向、雙子葉與單子葉的莖、木本莖、年輪、根莖葉的維管束相連 */
(() => {
  const { el, g, text, C } = S;
  const XY = C.water, PH = C.sugar, CAM = '#8be07a', VAS = '#9fe7ff';
  const STEM = '#5f9e46', LEAF = '#4fae4a', LEAF_D = '#2f7a3a', SOIL = '#2b2118', ROOT = '#c9a97a';
  const BARK = '#6e4528', PHL = '#d9a93c', WOOD_L = '#e8cf98', WOOD_D = '#9a6a36', PITH = '#d8bd86';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };

  // 葉片：中心在 (0,0)，寬 w、高 h（和 2-3 光合作用的畫法相同）
  const leafD = (w, h) => `M ${-w / 2},0 C ${-w / 4},${-h / 2} ${w / 4},${-h / 2} ${w / 2},0 C ${w / 4},${h / 2} ${-w / 4},${h / 2} ${-w / 2},0 Z`;
  function leaf(p, x, y, w, h, { r = 0, fill = LEAF, veins = true, vein = '#a8e39a' } = {}) {
    const lg = S.place(g(p), { x, y, r });
    el('path', { d: leafD(w, h), fill, stroke: LEAF_D, 'stroke-width': Math.max(2, w / 80) }, lg);
    if (veins) {
      el('line', { x1: -w / 2 + 4, y1: 0, x2: w / 2 - 6, y2: 0, stroke: vein, 'stroke-width': Math.max(1.5, w / 90) }, lg);
      for (let i = 1; i <= 3; i++) {
        const vx = -w / 2 + (w * i) / 4.2;
        [-1, 1].forEach((s) => el('path', { d: `M ${vx},0 Q ${vx + w * 0.06},${s * h * 0.16} ${vx + w * 0.13},${s * h * 0.3}`, fill: 'none', stroke: vein, 'stroke-width': Math.max(1.2, w / 140) }, lg));
      }
    }
    return lg;
  }
  // 沿折線取點：t 從 0 到 1
  const polyAt = (pts) => {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const T = L[L.length - 1];
    return (t) => {
      const s = S.clamp(t) * T;
      let i = 1;
      while (i < L.length - 1 && L[i] < s) i++;
      const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return [S.lerp(pts[i - 1][0], pts[i][0], f), S.lerp(pts[i - 1][1], pts[i][1], f)];
    };
  };
  const DROP = 'M 0,-9 C 5,-3 6,1 6,3 C 6,7 3,9 0,9 C -3,9 -6,7 -6,3 C -6,1 -5,-3 0,-9 Z';
  const drop = (p, s = 1) => { const d = g(p); el('path', { d: DROP, fill: XY, stroke: '#0d1822', 'stroke-width': 1, transform: `scale(${s})` }, d); return d; };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const sugar = (p, r = 9) => { const h = g(p); el('path', { d: hexD(r), fill: 'rgba(255,207,92,0.35)', stroke: PH, 'stroke-width': 2.5 }, h); return h; };
  const at = (e, [x, y], op = 1) => { e.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`); e.style.opacity = op; };
  const arrow = (p, x1, y1, x2, y2, color, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };

  // 維管束（小）：外側（−y）是韌皮部、內側（+y）是木質部；cam：畫形成層
  function bundle(p, x, y, s, r, cam = true) {
    const b = S.place(g(p), { x, y, s, r });
    el('ellipse', { cx: 0, cy: -8, rx: 10, ry: 8, fill: PH, opacity: 0.9 }, b);
    el('ellipse', { cx: 0, cy: 8, rx: 11, ry: 10, fill: XY, opacity: 0.9 }, b);
    if (cam) el('line', { x1: -10.5, y1: -0.5, x2: 10.5, y2: -0.5, stroke: CAM, 'stroke-width': 2.5 }, b);
    return b;
  }
  // 莖的橫切面：di＝雙子葉（環狀、有形成層）、mono＝單子葉（散生）
  function section(p, cx, cy, R, kind, seed = 3) {
    const sg = g(p);
    el('circle', { cx, cy, r: R, fill: '#1d3a2a', stroke: '#a8e39a', 'stroke-width': Math.max(2.5, R / 36) }, sg);
    const out = { g: sg, bundles: [] };
    if (kind === 'di') {
      const rb = R * 0.7, n = 10, s = R / 80;
      out.ring = el('circle', { cx, cy, r: rb + s * 0.5, fill: 'none', stroke: CAM, 'stroke-width': Math.max(2, s * 1.6) }, sg);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        out.bundles.push(bundle(sg, cx + rb * Math.cos(a), cy + rb * Math.sin(a), s, (a * 180) / Math.PI + 90, true));
      }
      out.rb = rb;
    } else {
      const rnd = S.rng(seed), s = R / 150, pts = [];
      for (let k = 0; pts.length < 26 && k < 4000; k++) {
        const r = R * 0.86 * Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        if (pts.every(([px, py]) => Math.hypot(px - x, py - y) > 44 * s)) pts.push([x, y, a]);
      }
      pts.forEach(([x, y, a]) => out.bundles.push(bundle(sg, x, y, s, (a * 180) / Math.PI + 90, false)));
      out.pts = pts;
    }
    return out;
  }

  // 樹幹橫切面（年輪）：set(R) 設定木材目前的半徑
  const YEARS = [34, 30, 36, 22, 32, 30], R0 = 16, EARLY = 0.7;
  const RING = (() => { const r = [R0]; YEARS.forEach((w) => r.push(r[r.length - 1] + w)); return r; })();
  const RMAX = RING[RING.length - 1];
  function trunk(p, cx, cy) {
    const tg = g(p);
    const bark = el('path', { fill: BARK, stroke: '#4a2c18', 'stroke-width': 2 }, tg);
    const phl = el('circle', { cx, cy, r: 0, fill: PHL }, tg);
    const cam = el('circle', { cx, cy, r: 0, fill: 'none', stroke: CAM, 'stroke-width': 3 }, tg);
    const bands = [];
    for (let i = YEARS.length; i >= 1; i--) {
      const e = RING[i - 1] + YEARS[i - 1] * EARLY;
      bands.push({ c: el('circle', { cx, cy, r: 0, fill: WOOD_D }, tg), from: e, to: RING[i] });
      bands.push({ c: el('circle', { cx, cy, r: 0, fill: WOOD_L }, tg), from: RING[i - 1], to: e });
    }
    el('circle', { cx, cy, r: R0, fill: PITH }, tg);
    const set = (R) => {
      bands.forEach((b) => { b.c.setAttribute('r', R > b.from ? Math.min(R, b.to) : 0); });
      cam.setAttribute('r', R + 1.5);
      phl.setAttribute('r', R + 15);
      bark.setAttribute('d', S.smoothPath(S.blobPts(cx, cy, R + 36, R + 36, 72, [[11, 0.012, 0.2], [23, 0.008, 1.1]])));
    };
    set(RMAX);
    return { g: tg, set };
  }

  S.register({
    id: 'vascular', section: '3-1', title: '植物的運輸構造',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 跨尺度：植物 → 莖的橫切面 → 維管束 → 導管和篩管 =====
      const P0 = g(root);
      const FX = [40, 330, 620, 910], FW = 250, FY = 100, FH = 400;
      const frames = FX.map((x) => { const f = g(P0, { opacity: 0 }); el('rect', { x, y: FY, width: FW, height: FH, rx: 16, ...FRAME }, f); return f; });
      // 植物
      const pl = frames[0];
      el('rect', { x: 44, y: 432, width: 242, height: 64, rx: 12, fill: SOIL }, pl);
      ['M 166,434 C 160,455 150,470 136,488', 'M 166,434 C 168,458 170,474 166,492', 'M 166,434 C 176,452 188,468 200,484'].forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 3, 'stroke-linecap': 'round' }, pl));
      el('path', { d: 'M 166,434 C 162,360 170,260 166,172', fill: 'none', stroke: STEM, 'stroke-width': 8, 'stroke-linecap': 'round' }, pl);
      [[134, 392, 64, 26, 25], [198, 352, 68, 28, -25], [132, 300, 62, 26, 28], [200, 262, 64, 26, -22], [140, 214, 54, 22, 30]].forEach(([x, y, w, h, r]) => leaf(pl, x, y, w, h, { r, veins: false }));
      for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; el('ellipse', { cx: 166 + Math.cos(a) * 16, cy: 156 + Math.sin(a) * 16, rx: 10, ry: 5, fill: '#ffd166', transform: `rotate(${(a * 180) / Math.PI} ${166 + Math.cos(a) * 16} ${156 + Math.sin(a) * 16})` }, pl); }
      el('circle', { cx: 166, cy: 156, r: 11, fill: '#8a5a32' }, pl);
      // 莖的橫切面
      const sec1 = section(frames[1], 455, 290, 100, 'di');
      // 一個維管束（放大）
      const bf = frames[2], BX = 745, BY = 300;
      el('ellipse', { cx: BX, cy: BY, rx: 80, ry: 122, fill: '#1a3324', stroke: '#6fae4a', 'stroke-width': 2 }, bf);
      for (let y = BY - 108; y <= BY - 32; y += 15) for (let x = BX - 70; x <= BX + 70; x += 15) {
        const xx = x + (((y - BY) / 15) % 2 ? 7 : 0);
        if (((xx - BX) / 70) ** 2 + ((y - BY) / 110) ** 2 < 1) el('circle', { cx: xx, cy: y, r: 6.5, fill: 'rgba(255,207,92,0.18)', stroke: PH, 'stroke-width': 1.8 }, bf);
      }
      for (let row = 0; row < 2; row++) for (let x = BX - 70; x <= BX + 62; x += 16) {
        if (((x + 7 - BX) / 74) ** 2 + ((BY - 20 + row * 8 - BY) / 120) ** 2 < 1) el('rect', { x, y: BY - 24 + row * 8, width: 14, height: 6, rx: 2, fill: 'none', stroke: CAM, 'stroke-width': 1.5 }, bf);
      }
      [[0, 22, 16], [-34, 32, 12], [34, 32, 12], [-14, 60, 14], [20, 64, 13], [-42, 70, 9], [44, 72, 9], [0, 94, 12], [-24, 100, 8], [24, 100, 8]]
        .forEach(([x, y, r]) => el('circle', { cx: BX + x, cy: BY + y, r, fill: 'rgba(95,184,255,0.3)', stroke: XY, 'stroke-width': 2.5 }, bf));
      S.pill(bf, BX - 26, BY - 66, '韌皮部', { size: 22, color: PH, edge: PH });
      S.pill(bf, BX - 26, BY + 58, '木質部', { size: 22, color: XY, edge: XY });
      text(bf, BX, 138, '↑ 莖的外側', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 導管和篩管（縱切）
      const tf = frames[3];
      text(tf, 985, 152, '導管', { 'font-size': 22, 'text-anchor': 'middle', fill: XY, 'font-weight': 700 });
      text(tf, 1088, 152, '篩管', { 'font-size': 22, 'text-anchor': 'middle', fill: PH, 'font-weight': 700 });
      el('rect', { x: 960, y: 172, width: 50, height: 284, fill: 'rgba(95,184,255,0.14)' }, tf);
      for (let k = 0; k < 3; k++) {
        const y0 = 172 + k * 95;
        for (let j = 0; j < 7; j++) el('line', { x1: 962, y1: y0 + 6 + j * 13, x2: 1008, y2: y0 + 14 + j * 13, stroke: XY, 'stroke-width': 1.6, opacity: 0.6 }, tf);
        if (k) [[954, 966], [1004, 1016]].forEach(([a, b]) => el('line', { x1: a, y1: y0, x2: b, y2: y0, stroke: XY, 'stroke-width': 3 }, tf));
      }
      [960, 1010].forEach((x) => el('line', { x1: x, y1: 172, x2: x, y2: 456, stroke: XY, 'stroke-width': 3 }, tf));
      el('rect', { x: 1066, y: 172, width: 44, height: 284, fill: 'rgba(255,207,92,0.12)', stroke: PH, 'stroke-width': 3 }, tf);
      [267, 362].forEach((y) => el('line', { x1: 1066, y1: y, x2: 1110, y2: y, stroke: PH, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, tf));
      // 名稱與大小
      [['植物', '約 50 cm＊'], ['莖的橫切面', '直徑約 1 cm＊'], ['一個維管束', '約 1 mm＊'], ['導管和篩管（縱切）', '粗約 0.05 mm＊']].forEach(([n, s], i) => {
        const cx = FX[i] + FW / 2;
        text(frames[i], cx, 548, n, { 'font-size': i === 3 ? 26 : 30, 'text-anchor': 'middle', 'font-weight': 700 });
        S.pill(frames[i], cx, 596, s, { size: 22, color: C.hi });
      });
      // 放大框
      const zoom = (x, y, w, h, j) => {
        const zg = g(P0, { opacity: 0 });
        el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zg);
        [[y - h / 2, FY], [y + h / 2, FY + FH]].forEach(([y1, y2]) => el('line', { x1: x + w / 2, y1, x2: FX[j], y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zg));
        return zg;
      };
      const zooms = [zoom(166, 330, 36, 36, 1), zoom(455, 290 - sec1.rb, 40, 52, 2), zoom(BX + 48, BY + 2, 32, 178, 3)];
      tl.addLabel('s0');
      S.show(tl, frames[0], 's0+=0.2', 0.5);
      zooms.forEach((z, i) => { S.show(tl, z, `s0+=${0.9 + i * 1.2}`, 0.4); S.show(tl, frames[i + 1], `s0+=${1.2 + i * 1.2}`, 0.5); });

      // ===== 1 運輸的方向 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 560, width: 520, height: 140, rx: 12, fill: SOIL }, P1);
      const rootsD = ['M 300,560 L 300,690', 'M 300,598 C 280,620 250,640 228,664', 'M 300,618 C 330,640 360,660 378,682', 'M 300,590 C 330,600 360,612 390,628', 'M 300,640 C 280,660 260,676 244,692'];
      rootsD.forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 6, 'stroke-linecap': 'round' }, P1));
      el('rect', { x: 284, y: 150, width: 32, height: 414, rx: 14, fill: '#2f5a2a', stroke: STEM, 'stroke-width': 2 }, P1);
      const lfL = leaf(P1, 175, 300, 230, 96, { r: 12, veins: false });
      const lfR = leaf(P1, 425, 420, 230, 96, { r: -12, veins: false });
      [[lfL, 1], [lfR, -1]].forEach(([lg, s]) => {
        el('line', { x1: s * 112, y1: -3, x2: -s * 100, y2: -3, stroke: XY, 'stroke-width': 4 }, lg);
        el('line', { x1: s * 112, y1: 3, x2: -s * 100, y2: 3, stroke: PH, 'stroke-width': 4 }, lg);
      });
      el('circle', { cx: 300, cy: 112, r: 40, fill: '#e0563f', stroke: '#ff9a7a', 'stroke-width': 2 }, P1);
      el('path', { d: 'M 300,74 l -16,-8 l 10,14 l -14,4 l 20,0 l 0,0 Z M 300,74 l 16,-8 l -10,14 l 14,4 l -20,0 Z', fill: '#4fae4a' }, P1);
      const xyLine = el('path', { d: 'M 293,690 L 293,152', fill: 'none', stroke: XY, 'stroke-width': 6 }, P1);
      const phLine = el('path', { d: 'M 307,152 L 307,690', fill: 'none', stroke: PH, 'stroke-width': 6 }, P1);
      [['果實', 372, 118], ['葉', 66, 360], ['莖', 350, 250], ['根', 420, 690]].forEach(([s, x, y]) => text(P1, x, y, s, { 'font-size': 24, fill: C.mute }));
      // 水：根 → 莖 → 葉；養分：葉 → 往上到果實、往下到根
      const wPaths = [polyAt([[228, 664], [300, 598], [293, 560], [293, 330], [288, 324], [66, 276]]), polyAt([[378, 682], [300, 618], [293, 560], [293, 446], [312, 444], [536, 397]])];
      const sUp = polyAt([[460, 412], [312, 444], [307, 444], [307, 152], [300, 118]]);
      const sDown = polyAt([[460, 412], [312, 444], [307, 444], [307, 560], [300, 600], [300, 686]]);
      const wd = Array.from({ length: 10 }, () => drop(P1, 1.1));
      const sd = Array.from({ length: 8 }, () => sugar(P1, 10));
      // 右：導管與篩管
      const R1 = g(P1, { opacity: 0 });
      el('rect', { x: 600, y: 70, width: 560, height: 580, rx: 18, ...FRAME }, R1);
      S.pill(R1, 720, 112, '木質部', { size: 26, color: XY, edge: XY });
      S.pill(R1, 990, 112, '韌皮部', { size: 26, color: PH, edge: PH });
      el('rect', { x: 690, y: 150, width: 60, height: 370, fill: 'rgba(95,184,255,0.14)' }, R1);
      [690, 750].forEach((x) => el('line', { x1: x, y1: 150, x2: x, y2: 520, stroke: XY, 'stroke-width': 3 }, R1));
      for (let k = 1; k < 4; k++) [[684, 696], [744, 756]].forEach(([a, b]) => el('line', { x1: a, y1: 150 + k * 92.5, x2: b, y2: 150 + k * 92.5, stroke: XY, 'stroke-width': 3 }, R1));
      [925, 1055].forEach((x) => {
        el('rect', { x: x - 25, y: 150, width: 50, height: 370, fill: 'rgba(255,207,92,0.12)', stroke: PH, 'stroke-width': 3 }, R1);
        for (let k = 1; k < 4; k++) el('line', { x1: x - 25, y1: 150 + k * 92.5, x2: x + 25, y2: 150 + k * 92.5, stroke: PH, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, R1);
      });
      arrow(R1, 790, 470, 790, 200, XY, 5, 18);
      arrow(R1, 975, 470, 975, 200, PH, 5, 18);
      arrow(R1, 1105, 200, 1105, 470, PH, 5, 18);
      [['導管', 720, XY], ['篩管', 925, PH], ['篩管', 1055, PH]].forEach(([s, x, c]) => text(R1, x, 556, s, { 'font-size': 24, 'text-anchor': 'middle', fill: c, 'font-weight': 700 }));
      text(R1, 720, 598, '水、礦物質：往上', { 'font-size': 22, 'text-anchor': 'middle', fill: XY });
      text(R1, 990, 598, '養分：往上或往下', { 'font-size': 22, 'text-anchor': 'middle', fill: PH });
      text(R1, 720, 632, '（根 → 莖 → 葉）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(R1, 990, 632, '（葉 → 果實、根等）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const rw = Array.from({ length: 4 }, () => drop(R1, 1.6));
      const ru = Array.from({ length: 4 }, () => sugar(R1, 13));
      const rdn = Array.from({ length: 4 }, () => sugar(R1, 13));
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.drawOn(tl, xyLine, 1.2, 's1+=0.6');
      S.drawOn(tl, phLine, 1.2, 's1+=0.6');
      S.show(tl, R1, 's1+=1.4', 0.5);
      S.drive(tl, (u) => {
        const k = S.clamp(u * 1.25);
        wd.forEach((d, i) => { const t = (k * 2 + i / wd.length) % 1; at(d, wPaths[i % 2](t), u > 0 && u < 1 ? 1 : 0); });
        sd.forEach((s, i) => { const t = (k * 1.6 + (i >> 1) / 4) % 1; at(s, (i % 2 ? sDown : sUp)(t), u > 0.08 && u < 1 ? 1 : 0); });
        rw.forEach((d, i) => { const t = (k * 2 + i / 4) % 1; at(d, [720, S.lerp(500, 170, t)], u > 0 && u < 1 ? 1 : 0); });
        ru.forEach((s, i) => { const t = (k * 1.6 + i / 4) % 1; at(s, [925, S.lerp(500, 170, t)], u > 0 && u < 1 ? 1 : 0); });
        rdn.forEach((s, i) => { const t = (k * 1.6 + i / 4) % 1; at(s, [1055, S.lerp(170, 500, t)], u > 0 && u < 1 ? 1 : 0); });
      }, 5, 's1+=1.4', 'none');

      // ===== 2 雙子葉 vs 單子葉 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 540, height: 570, rx: 18, ...FRAME }, P2);
      el('rect', { x: 620, y: 70, width: 540, height: 570, rx: 18, ...FRAME }, P2);
      text(P2, 310, 118, '雙子葉植物的莖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P2, 890, 118, '單子葉植物的莖', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const di = section(P2, 310, 334, 170, 'di');
      const mono = section(P2, 890, 334, 170, 'mono', 7);
      const ta = (-90 + 18) * Math.PI / 180;
      const camCo = S.callout(P2, 310 + (di.rb + 1) * Math.cos(ta), 334 + (di.rb + 1) * Math.sin(ta), 500, 150, '形成層', CAM, { size: 22 });
      const bdl = di.bundles[7].transform.baseVal.consolidate().matrix;
      const vbL = S.callout(P2, bdl.e, bdl.f, 106, 170, '維管束', C.ink, { size: 22 });
      const mp = mono.pts.reduce((a, b) => (b[0] - b[1] < a[0] - a[1] ? b : a));
      const vbR = S.callout(P2, mp[0], mp[1], 688, 160, '維管束', C.ink, { size: 22 });
      const lblL = g(P2, { opacity: 0 }), lblR = g(P2, { opacity: 0 });
      text(lblL, 310, 556, '維管束排成環狀，有形成層', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(lblL, 310, 598, '例：向日葵、菜豆', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(lblR, 890, 556, '維管束散生，沒有形成層', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(lblR, 890, 598, '例：玉米、竹子', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const leg = g(P2);
      [[XY, '木質部', 430], [PH, '韌皮部', 600], [CAM, '形成層', 770]].forEach(([c, s, x]) => { el('circle', { cx: x - 50, cy: 676, r: 11, fill: c }, leg); text(leg, x - 30, 684, s, { 'font-size': 22, fill: C.ink2 }); });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.show(tl, vbL, 's2+=0.9', 0.4);
      S.show(tl, lblL, 's2+=1.4', 0.4);
      S.show(tl, camCo, 's2+=1.9', 0.4);
      tl.fromTo(di.ring, { attr: { 'stroke-width': 3.6 } }, { attr: { 'stroke-width': 9 }, duration: 0.4, yoyo: true, repeat: 1, immediateRender: false }, 's2+=2.1');
      S.show(tl, vbR, 's2+=3', 0.4);
      S.show(tl, lblR, 's2+=3.5', 0.4);

      // ===== 3 木本植物的莖 =====
      const P3 = g(root, { opacity: 0 });
      const T3 = trunk(P3, 300, 380);
      const pr = (r, deg) => [300 + r * Math.cos((deg * Math.PI) / 180), 380 + r * Math.sin((deg * Math.PI) / 180)];
      const c3 = [
        [...pr(RMAX + 27, -52), 870, 120, '樹皮', '#d9a066'],
        [...pr(RMAX + 9, -40), 870, 188, '韌皮部（樹皮的內層）', PH],
        [...pr(RMAX + 1.5, -27), 870, 256, '形成層', CAM],
        [...pr(RMAX - 40, -10), 870, 324, '木質部（就是木材）', WOOD_L],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P3, tx, ty, x, y, s, c, { size: 24 }));
      // 一小塊放大：由內到外 木質部｜形成層｜韌皮部｜樹皮外層
      const z3 = g(P3, { opacity: 0 });
      el('rect', { x: 498, y: 366, width: 40, height: 28, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, z3);
      [[366, 470], [394, 570]].forEach(([y1, y2]) => el('line', { x1: 538, y1, x2: 640, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, z3));
      const SY = 470, SH = 100;
      for (let x = 640; x < 800; x += 20) for (let y = SY; y < SY + SH; y += 20) el('rect', { x: x + 1, y: y + 1, width: 18, height: 18, rx: 3, fill: x < 740 ? '#e0c088' : '#d6b47a', stroke: '#8a6a3a', 'stroke-width': 1.5 }, z3);
      for (let x = 800; x < 840; x += 10) for (let y = SY; y < SY + SH; y += 20) el('rect', { x: x + 1, y: y + 1, width: 8, height: 18, rx: 2, fill: '#2f5a2a', stroke: CAM, 'stroke-width': 1.5 }, z3);
      for (let x = 840; x < 960; x += 20) for (let y = SY; y < SY + SH; y += 20) el('rect', { x: x + 1, y: y + 1, width: 18, height: 18, rx: 3, fill: '#6a5420', stroke: PH, 'stroke-width': 1.5 }, z3);
      el('rect', { x: 960, y: SY, width: 140, height: SH, fill: BARK, stroke: '#4a2c18', 'stroke-width': 2 }, z3);
      for (let i = 0; i < 5; i++) el('path', { d: `M ${975 + i * 26},${SY + 6} q 8,${SH / 2 - 6} 0,${SH - 12}`, fill: 'none', stroke: '#4a2c18', 'stroke-width': 2 }, z3);
      [['木質部', 720, WOOD_L], ['形成層', 820, CAM], ['韌皮部', 900, PH], ['樹皮外層', 1030, '#d9a066']].forEach(([s, x, c]) => text(z3, x, 604, s, { 'font-size': 20, 'text-anchor': 'middle', fill: c, 'font-weight': 700 }));
      text(z3, 870, 410, '放大一小塊（由內到外）＊', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const ar3 = g(P3, { opacity: 0 });
      arrow(ar3, 806, 446, 690, 446, WOOD_L, 4, 14);
      arrow(ar3, 834, 446, 930, 446, PH, 4, 14);
      text(ar3, 690, 438, '向內', { 'font-size': 20, fill: WOOD_L, 'text-anchor': 'start' });
      text(ar3, 930, 438, '向外', { 'font-size': 20, fill: PH, 'text-anchor': 'end' });
      const grow3 = g(P3, { opacity: 0 });
      S.pill(grow3, 870, 664, '形成層不斷產生新細胞，莖逐年變粗', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      c3.forEach((c, i) => S.show(tl, c, `s3+=${0.8 + i * 0.5}`, 0.35));
      S.show(tl, z3, 's3+=3', 0.5);
      S.show(tl, ar3, 's3+=3.8', 0.4);
      S.show(tl, grow3, 's3+=4.6', 0.4);

      // ===== 4 年輪 =====
      const P4 = g(root, { opacity: 0 });
      const T4 = trunk(P4, 300, 380);
      const ringCo = S.callout(P4, ...pr(RING[3] - 3, -130), 110, 120, '年輪', C.hi, { size: 24 });
      const lg4 = g(P4);
      el('rect', { x: 650, y: 178, width: 60, height: 40, rx: 6, fill: WOOD_L }, lg4);
      text(lg4, 730, 208, '春夏：長得快，細胞大、顏色淺', { 'font-size': 24, fill: C.ink });
      el('rect', { x: 650, y: 248, width: 60, height: 40, rx: 6, fill: WOOD_D }, lg4);
      text(lg4, 730, 278, '秋冬：長得慢，細胞小、顏色深', { 'font-size': 24, fill: C.ink });
      S.pill(lg4, 890, 356, '一淺一深，合成一圈年輪', { size: 26, color: C.ink, edge: '#4a6272' });
      const yearT = text(P4, 890, 466, '', { 'font-size': 38, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const age4 = g(P4, { opacity: 0 });
      S.pill(age4, 890, 566, '數一數年輪，可以推算樹的年齡', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        const R = S.lerp(R0, RMAX, u);
        T4.set(R);
        let y = 1; while (y < YEARS.length && R >= RING[y]) y++;
        const early = R < RING[y - 1] + YEARS[y - 1] * EARLY;
        yearT.textContent = u >= 1 ? `${YEARS.length} 圈 → 約 ${YEARS.length} 年＊` : u > 0 ? `第 ${y} 年：${early ? '春夏' : '秋冬'}` : '';
      }, 6, 's4+=0.6', 'none');
      S.show(tl, ringCo, 's4+=6.7', 0.4);
      S.show(tl, age4, 's4+=7.2', 0.4);

      // ===== 5 根、莖、葉的維管束相連 =====
      const P5 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 440, width: 520, height: 260, rx: 12, fill: SOIL }, P5);
      const rootP = ['M 300,442 L 300,690', 'M 300,500 C 280,560 250,620 232,664', 'M 300,520 C 320,580 356,640 380,680', 'M 300,470 C 340,500 380,520 420,548', 'M 300,480 C 260,500 210,520 170,560'];
      rootP.forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 9, 'stroke-linecap': 'round' }, P5));
      [[232, 664], [380, 680], [420, 548], [170, 560], [300, 690]].forEach(([x, y]) => { for (let k = 0; k < 6; k++) { const a = k * 1.05; el('line', { x1: x, y1: y, x2: x + Math.cos(a) * 12, y2: y + Math.sin(a) * 12 - 4, stroke: '#e8d8b0', 'stroke-width': 1.5 }, P5); } });
      el('path', { d: 'M 300,442 L 300,110', fill: 'none', stroke: '#3f6e3a', 'stroke-width': 24, 'stroke-linecap': 'round' }, P5);
      const L5 = [[190, 340, 210, 88, 12, 1], [410, 250, 210, 88, -12, -1], [205, 170, 180, 76, 16, 1]].map(([x, y, w, h, r, s]) => {
        const lg = leaf(P5, x, y, w, h, { r, veins: false });
        const v = el('path', { d: `M ${(s * w) / 2},0 L ${(-s * w) / 2 + 8},0 ` + [0.25, 0.5, 0.72].map((f) => { const vx = s * (w / 2 - w * f); return `M ${vx},0 Q ${vx - s * w * 0.06},${-h * 0.18} ${vx - s * w * 0.14},${-h * 0.34} M ${vx},0 Q ${vx - s * w * 0.06},${h * 0.18} ${vx - s * w * 0.14},${h * 0.34}`; }).join(' '), fill: 'none', stroke: VAS, 'stroke-width': 3, 'stroke-linecap': 'round' }, lg);
        return v;
      });
      const net = rootP.slice(1).map((d) => el('path', { d, fill: 'none', stroke: VAS, 'stroke-width': 3.5 }, P5));
      net.unshift(el('path', { d: 'M 300,690 L 300,442', fill: 'none', stroke: VAS, 'stroke-width': 3.5 }, P5));
      const stemV = el('path', { d: 'M 300,442 L 300,116', fill: 'none', stroke: VAS, 'stroke-width': 4 }, P5);
      S.pill(P5, 300, 44, '亮線：維管束', { size: 22, color: VAS, edge: VAS });
      // 葉的放大
      const Z5 = g(P5, { opacity: 0 });
      el('rect', { x: 382, y: 222, width: 56, height: 56, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, Z5);
      [[222, 60], [278, 360]].forEach(([y1, y2]) => el('line', { x1: 438, y1, x2: 600, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, Z5));
      el('rect', { x: 600, y: 60, width: 560, height: 300, rx: 16, ...FRAME }, Z5);
      text(Z5, 1140, 92, '葉（放大＊）', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const bigLeaf = S.place(g(Z5), { x: 850, y: 214 });
      el('path', { d: leafD(420, 190), fill: LEAF, stroke: LEAF_D, 'stroke-width': 3 }, bigLeaf);
      const vr = S.rng(4);
      let vd = 'M -230,0 L 200,0 ';
      [-150, -90, -30, 30, 90].forEach((x) => [-1, 1].forEach((s) => { vd += `M ${x},0 Q ${x + 30},${s * 34} ${x + 64},${s * 64} `; for (let k = 1; k <= 2; k++) { const px = x + 22 * k, py = s * (16 + 18 * k); vd += `M ${px},${py} l ${18 + vr() * 10},${s * (-6 - vr() * 8)} `; } }));
      el('path', { d: vd, fill: 'none', stroke: VAS, 'stroke-width': 3, 'stroke-linecap': 'round' }, bigLeaf);
      const vCo = S.callout(Z5, 920, 262, 1040, 334, '葉脈：葉中的維管束', VAS, { size: 22 });
      vCo.style.opacity = 1;
      // 根毛的放大
      const R5 = g(P5, { opacity: 0 });
      el('rect', { x: 205, y: 636, width: 52, height: 52, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, R5);
      [[636, 390], [688, 690]].forEach(([y1, y2]) => el('line', { x1: 257, y1, x2: 600, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, R5));
      el('rect', { x: 600, y: 390, width: 560, height: 300, rx: 16, ...FRAME }, R5);
      text(R5, 1140, 422, '根的末端（放大＊）', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const sr = S.rng(9);
      for (let i = 0; i < 40; i++) el('circle', { cx: 620 + sr() * 520, cy: 440 + sr() * 200, r: 2 + sr() * 3, fill: '#5a4430' }, R5);
      el('path', { d: 'M 610,520 L 1050,520 C 1100,520 1112,545 1112,545 C 1112,545 1100,570 1050,570 L 610,570 Z', fill: '#c9a97a', stroke: '#e8d8b0', 'stroke-width': 2 }, R5);
      el('line', { x1: 612, y1: 545, x2: 1040, y2: 545, stroke: VAS, 'stroke-width': 6 }, R5);
      const hairs = [];
      for (let i = 0; i < 16; i++) {
        const x = 740 + i * 18, up = i % 2 === 0, len = 34 + ((i * 7) % 4) * 7;
        const y0 = up ? 520 : 570, y1 = up ? y0 - len : y0 + len;
        el('path', { d: `M ${x},${y0} Q ${x + 6},${(y0 + y1) / 2} ${x + 2},${y1}`, fill: 'none', stroke: '#e8d8b0', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, R5);
        hairs.push([x + 2, y1, y0]);
      }
      const hCo = S.callout(R5, hairs[8][0], hairs[8][1], 1080, 446, '根毛', '#e8d8b0', { size: 24 });
      hCo.style.opacity = 1;
      S.pill(R5, 880, 654, '根毛增加吸收水分的表面積', { size: 22, color: C.hi, edge: C.hi });
      const rdrops = Array.from({ length: 6 }, () => drop(R5, 1.1));
      // 水滴：根 → 莖 → 葉
      const pL = [[[232, 664], [300, 500], [300, 362], [292, 362], [88, 318]], [[380, 680], [300, 520], [300, 272], [308, 272], [512, 228]], [[300, 690], [300, 196], [292, 195], [118, 145]]].map(polyAt);
      const pdrops = Array.from({ length: 9 }, () => drop(P5, 1.1));
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      net.forEach((n) => S.drawOn(tl, n, 0.9, 's5+=0.6'));
      S.drawOn(tl, stemV, 0.9, 's5+=1.5');
      L5.forEach((v) => S.drawOn(tl, v, 0.9, 's5+=2.4'));
      S.drive(tl, (u) => {
        pdrops.forEach((d, i) => { const t = (u * 2 + Math.floor(i / 3) / 3) % 1; at(d, pL[i % 3](t), u > 0 && u < 1 ? 1 : 0); });
      }, 4.5, 's5+=3.3', 'none');
      S.show(tl, R5, 's5+=3.4', 0.5);
      S.drive(tl, (u) => {
        rdrops.forEach((d, i) => {
          const [hx, hy, hy0] = hairs[2 + i * 2], k = (u * 2 + i / 6) % 1;
          const p = k < 0.5 ? [hx, S.lerp(hy + (hy < hy0 ? -50 : 50), hy0, k * 2)] : [S.lerp(hx, 640, (k - 0.5) * 2), 545];
          at(d, p, u > 0 && u < 1 ? 1 : 0);
        });
      }, 4, 's5+=3.8', 'none');
      S.show(tl, Z5, 's5+=4.4', 0.5);

      return {
        tl,
        notes: [
          '＊大小為約略值，不同植物差異很大；圖中的細胞都簡化了。這裡畫的是雙子葉植物（例如向日葵）的草本莖。',
          '＊示意：管子和粒子都畫得很大，數量也是示意。導管是許多細胞上下相連、形成中空的管子；篩管上下相連的地方有像篩子一樣的小孔。',
          '＊示意：維管束的數目和大小都簡化了。竹子等單子葉植物沒有形成層，長高以後莖幾乎不會再變粗。',
          '＊示意：各層的厚度都畫得比較誇張。國中課本把形成層以外的部分（包括韌皮部）都稱為樹皮。',
          '＊示意：動畫中約 1 秒代表 1 年。補充：四季分明的地方年輪比較清楚；終年溫暖潮濕的熱帶地區，有些樹的年輪不明顯。',
          '＊示意：維管束畫成一條亮線；真實的根、莖、葉中有許多維管束。根毛是根的表皮細胞向外突出形成的，水和礦物質主要由根毛吸收。',
        ],
        steps: [
          '植物靠<b>維管束</b>運輸物質。從植物一路放大：莖的橫切面上有一束束的維管束，每個維管束裡有<b>木質部</b>和<b>韌皮部</b>。',
          '<b>木質部</b>的<b>導管</b>運輸<b>水和礦物質</b>，由下往上；<b>韌皮部</b>的<b>篩管</b>運輸葉製造的<b>養分</b>，可以往上，也可以往下。',
          '<b>雙子葉植物</b>的莖：維管束排成<b>環狀</b>，有<b>形成層</b>；<b>單子葉植物</b>的莖：維管束<b>散生</b>，沒有形成層。',
          '木本植物的莖：<b>形成層</b>向內產生<b>木質部</b>（木材），向外產生<b>韌皮部</b>，莖就逐年變粗。<b>樹皮</b>包含了韌皮部。',
          '春夏長得快、秋冬長得慢，木材一圈淺、一圈深，形成<b>年輪</b>。通常一年形成一圈，數年輪可以推算樹的年齡。',
          '根、莖、葉的維管束<b>彼此相連</b>：<b>根毛</b>吸收的水，經根、莖的維管束送到<b>葉脈</b>。根毛讓根吸收水分的表面積大大增加。',
        ],
      };
    },
  });
})();
