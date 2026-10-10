/* 3-2 植物體內的運輸：水的路徑與蒸散作用、氣孔與保衛細胞、影響蒸散的因素、養分的運輸、環狀剝皮、紅墨水實驗 */
(() => {
  const { el, g, text, C } = S;
  const XY = C.water, PH = C.sugar, CAM = '#8be07a', INK = '#e2364f';
  const LEAF = '#4fae4a', LEAF_D = '#2f7a3a', SOIL = '#2b2118', ROOT = '#c9a97a', CHL = '#6fce62';
  const BARK = '#6e4528', PHL = '#d9a93c', WOOD = '#e8cf98';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };

  const leafD = (w, h) => `M ${-w / 2},0 C ${-w / 4},${-h / 2} ${w / 4},${-h / 2} ${w / 2},0 C ${w / 4},${h / 2} ${-w / 4},${h / 2} ${-w / 2},0 Z`;
  function leaf(p, x, y, w, h, { r = 0, fill = LEAF, veins = true, vein = '#a8e39a' } = {}) {
    const lg = S.place(g(p), { x, y, r });
    lg.body = el('path', { d: leafD(w, h), fill, stroke: LEAF_D, 'stroke-width': Math.max(2, w / 80) }, lg);
    if (veins) {
      el('line', { x1: -w / 2 + 4, y1: 0, x2: w / 2 - 6, y2: 0, stroke: vein, 'stroke-width': Math.max(1.5, w / 90) }, lg);
      for (let i = 1; i <= 3; i++) {
        const vx = -w / 2 + (w * i) / 4.2;
        [-1, 1].forEach((s) => el('path', { d: `M ${vx},0 Q ${vx + w * 0.06},${s * h * 0.16} ${vx + w * 0.13},${s * h * 0.3}`, fill: 'none', stroke: vein, 'stroke-width': Math.max(1.2, w / 140) }, lg));
      }
    }
    return lg;
  }
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
  const puff = (p, r = 9) => { const d = g(p); el('circle', { cx: 0, cy: 0, r, fill: 'rgba(207,232,255,0.15)', stroke: '#cfe8ff', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, d); return d; };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const sugar = (p, r = 9) => { const h = g(p); el('path', { d: hexD(r), fill: 'rgba(255,207,92,0.35)', stroke: PH, 'stroke-width': 2.5 }, h); return h; };
  const at = (e, [x, y], op = 1) => { e.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`); e.style.opacity = op; };
  const arrow = (p, x1, y1, x2, y2, color, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };
  const sun = (p, x, y, r = 22) => { const s = g(p); el('circle', { cx: x, cy: y, r, fill: C.hi }, s); for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; el('line', { x1: x + Math.cos(a) * (r + 6), y1: y + Math.sin(a) * (r + 6), x2: x + Math.cos(a) * (r + 14), y2: y + Math.sin(a) * (r + 14), stroke: C.hi, 'stroke-width': 3, 'stroke-linecap': 'round' }, s); } return s; };
  const moon = (p, x, y, r = 20) => { const m = g(p); el('path', { d: `M ${x},${y - r} A ${r},${r} 0 0,0 ${x},${y + r} A ${r * 1.3},${r * 1.3} 0 0,1 ${x},${y - r} Z`, fill: '#ffe9a8' }, m); return m; };

  S.register({
    id: 'plantflow', section: '4-2', title: '植物體內的運輸',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 水的路徑與蒸散作用 =====
      const P0 = g(root);
      el('rect', { x: 40, y: 440, width: 420, height: 160, rx: 12, fill: SOIL }, P0);
      const rts = ['M 250,442 L 250,592', 'M 250,480 C 220,510 180,540 150,590', 'M 250,500 C 290,530 330,560 352,594', 'M 250,462 C 200,476 150,494 100,520'];
      rts.forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 7, 'stroke-linecap': 'round' }, P0));
      [[150, 590], [352, 594], [100, 520], [250, 592]].forEach(([x, y]) => { for (let k = 0; k < 6; k++) { const a = k * 1.05; el('line', { x1: x, y1: y, x2: x + Math.cos(a) * 12, y2: y + Math.sin(a) * 12 - 4, stroke: '#e8d8b0', 'stroke-width': 1.5 }, P0); } });
      el('line', { x1: 250, y1: 446, x2: 250, y2: 112, stroke: '#3f6e3a', 'stroke-width': 20, 'stroke-linecap': 'round' }, P0);
      [[150, 300, 190, 80, 12, 1], [350, 220, 190, 80, -12, -1], [180, 150, 140, 62, 16, 1]].forEach(([x, y, w, h, r, s]) => {
        const lg = leaf(P0, x, y, w, h, { r, veins: false });
        el('line', { x1: (s * w) / 2, y1: 0, x2: (-s * w) / 2 + 10, y2: 0, stroke: XY, 'stroke-width': 3.5 }, lg);
      });
      rts.forEach((d) => el('path', { d, fill: 'none', stroke: XY, 'stroke-width': 3 }, P0));
      el('line', { x1: 250, y1: 446, x2: 250, y2: 116, stroke: XY, 'stroke-width': 4 }, P0);
      const wP = [polyAt([[150, 590], [220, 510], [250, 480], [250, 240], [257, 240], [350, 220], [372, 216]]), polyAt([[352, 594], [290, 530], [250, 500], [250, 320], [243, 320], [150, 300], [70, 283]])];
      const wd = Array.from({ length: 8 }, () => drop(P0, 1.1));
      // 葉的橫切面
      const ZS = g(P0, { opacity: 0 });
      el('rect', { x: 352, y: 192, width: 48, height: 48, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, ZS);
      [[192, 50], [240, 600]].forEach(([y1, y2]) => el('line', { x1: 400, y1, x2: 500, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, ZS));
      el('rect', { x: 500, y: 50, width: 660, height: 550, rx: 16, ...FRAME }, ZS);
      text(ZS, 522, 90, '葉的橫切面（放大＊）', { 'font-size': 22, fill: C.mute });
      const X0 = 520, X1 = 1000, STX = 900, VX = 700, VY = 330;
      for (let x = X0; x < X1; x += 40) el('rect', { x: x + 2, y: 112, width: 36, height: 28, rx: 5, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, ZS);
      for (let x = X0; x < X1 - 10; x += 36) {
        el('rect', { x: x + 3, y: 146, width: 30, height: 100, rx: 10, fill: '#1c3a2c', stroke: CHL, 'stroke-width': 2 }, ZS);
        for (let k = 0; k < 4; k++) el('ellipse', { cx: x + 18, cy: 164 + k * 22, rx: 5, ry: 7, fill: CHL }, ZS);
      }
      const rs = S.rng(5);
      for (let i = 0; i < 24; i++) {
        const cx = X0 + 26 + (i % 8) * 60 + rs() * 8, cy = 286 + Math.floor(i / 8) * 52 + rs() * 8;
        if (Math.hypot(cx - VX, cy - VY) < 70 || Math.hypot(cx - STX, cy - 410) < 44) continue;
        el('ellipse', { cx, cy, rx: 22, ry: 19, fill: '#1c3a2c', stroke: CHL, 'stroke-width': 2 }, ZS);
        el('ellipse', { cx: cx - 6, cy: cy - 4, rx: 4, ry: 6, fill: CHL }, ZS);
      }
      el('circle', { cx: VX, cy: VY, r: 46, fill: '#22301c', stroke: '#d9c27c', 'stroke-width': 3 }, ZS);
      [[-14, -6, 11], [12, -10, 9], [-2, 14, 12], [18, 14, 8]].forEach(([x, y, r]) => el('circle', { cx: VX + x, cy: VY + y, r, fill: 'rgba(95,184,255,0.3)', stroke: XY, 'stroke-width': 2.5 }, ZS));
      for (let x = X0; x < X1; x += 40) { if (Math.abs(x + 20 - STX) < 40) continue; el('rect', { x: x + 2, y: 426, width: 36, height: 28, rx: 5, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, ZS); }
      [-1, 1].forEach((d) => el('ellipse', { cx: STX + d * 16, cy: 440, rx: 10, ry: 15, fill: '#1c3a2c', stroke: CHL, 'stroke-width': 2.5 }, ZS));
      const lab0 = [[985, 200, 1080, 190, '葉肉', CHL], [744, 318, 1080, 290, '葉脈', '#d9c27c'], [STX, 446, 1080, 460, '氣孔', C.ink], [930, 520, 1080, 550, '水蒸氣', '#cfe8ff']].map(([tx, ty, x, y, s, c]) => S.callout(ZS, tx, ty, x, y, s, c, { size: 22 }));
      const lp = polyAt([[VX + 4, VY], [790, 360], [840, 380]]), vp = polyAt([[848, 386], [886, 404], [STX, 440], [STX + 6, 500], [940, 540]]);
      const ld = Array.from({ length: 4 }, () => drop(ZS, 1.2)), lv = Array.from({ length: 4 }, () => puff(ZS, 10));
      // 路徑鏈
      const CH = ['根毛', '根的木質部', '莖的木質部', '葉脈', '葉肉細胞', '氣孔', '空氣'];
      const ws = CH.map((s) => S.textWidth(s, 22) + 28), tot = ws.reduce((a, b) => a + b, 0) + 40 * (CH.length - 1);
      let cx0 = (1200 - tot) / 2;
      const hiCh = CH.map((s, i) => {
        const x = cx0 + ws[i] / 2;
        S.pill(P0, x, 636, s, { size: 22, color: C.mute, edge: C.faint });
        const h = g(P0, { opacity: 0 });
        S.pill(h, x, 636, s, { size: 22, color: i < 3 ? XY : i === 6 ? '#cfe8ff' : C.hi, edge: i < 3 ? XY : C.hi });
        if (i < CH.length - 1) text(P0, cx0 + ws[i] + 20, 644, '→', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        cx0 += ws[i] + 40;
        return h;
      });
      const key0 = g(P0, { opacity: 0 });
      S.pill(key0, 600, 692, '蒸散作用：水分從氣孔散失，是水往上運送的主要動力', { size: 22, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      S.drive(tl, (u) => { wd.forEach((d, i) => { const t = (u * 1.6 + (i >> 1) / 4) % 1; at(d, wP[i % 2](t), u > 0 && u < 1 ? 1 : 0); }); }, 6.4, 's0+=0.2', 'none');
      [0.3, 0.8, 1.5].forEach((t, i) => S.show(tl, hiCh[i], `s0+=${t}`, 0.3));
      S.show(tl, ZS, 's0+=2', 0.5);
      S.show(tl, hiCh[3], 's0+=2.6', 0.3);
      S.drive(tl, (u) => {
        ld.forEach((d, i) => { const k = (u * 1.5 + i / 4) % 1; at(d, lp(k * 2), u > 0 && u < 1 && k < 0.5 ? 1 : 0); });
        lv.forEach((d, i) => { const k = (u * 1.5 + i / 4) % 1; at(d, vp((k - 0.5) * 2), u > 0 && u < 1 && k >= 0.5 ? 1 : 0); });
      }, 4.4, 's0+=2.6', 'none');
      lab0.forEach((l, i) => S.show(tl, l, `s0+=${2.8 + i * 0.5}`, 0.3));
      [3.4, 4.4, 5].forEach((t, i) => S.show(tl, hiCh[4 + i], `s0+=${t}`, 0.3));
      S.show(tl, key0, 's0+=5.6', 0.5);

      // ===== 1 氣孔與保衛細胞 =====
      const P1 = g(root, { opacity: 0 });
      const FX = 400, FYc = 380, FR = 262;
      el('circle', { cx: FX, cy: FYc, r: FR }, el('clipPath', { id: 'pfField' }, el('defs', {}, P1)));
      const field = g(P1, { 'clip-path': 'url(#pfField)' });
      el('rect', { x: FX - FR, y: FYc - FR, width: FR * 2, height: FR * 2, fill: '#1b3040' }, field);
      const rw = S.rng(12);
      for (let y = FYc - FR; y <= FYc + FR + 70; y += 74) {
        let d = `M ${FX - FR - 20},${y}`;
        for (let x = FX - FR - 20; x < FX + FR + 20; x += 24) d += ` Q ${x + 12},${y + (rw() - 0.5) * 16} ${x + 24},${y}`;
        el('path', { d, fill: 'none', stroke: '#7fb7c9', 'stroke-width': 2.5 }, field);
        const off = ((y - FYc) / 74) % 2 ? 55 : 0;
        for (let x = FX - FR - 40 + off; x < FX + FR + 40; x += 110) el('path', { d: `M ${x},${y} Q ${x + (rw() - 0.5) * 22},${y + 37} ${x + (rw() - 0.5) * 8},${y + 74}`, fill: 'none', stroke: '#7fb7c9', 'stroke-width': 2.5 }, field);
      }
      el('ellipse', { cx: FX, cy: FYc, rx: 112, ry: 146, fill: '#1b3040', stroke: '#7fb7c9', 'stroke-width': 2.5 }, field);
      el('circle', { cx: FX, cy: FYc, r: FR, fill: 'none', stroke: '#4a6272', 'stroke-width': 6 }, P1);
      text(P1, FX, 92, '葉的下表皮（顯微鏡下＊）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const H = 112, G = 50;
      const pore = el('path', { fill: '#05090c' }, field);
      const gcs = [-1, 1].map(() => el('path', { fill: 'none', stroke: '#2f7a3a', 'stroke-width': G, 'stroke-linecap': 'round' }, field));
      const gin = [-1, 1].map(() => el('path', { fill: 'none', stroke: '#4fae4a', 'stroke-width': G - 12, 'stroke-linecap': 'round', opacity: 0.7 }, field));
      const chs = [-1, 1].map(() => Array.from({ length: 6 }, () => el('ellipse', { rx: 6, ry: 9, fill: CHL }, field)));
      const vap = Array.from({ length: 5 }, () => el('circle', { cx: FX, cy: FYc, r: 6, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 2.5, opacity: 0 }, field));
      const qb = (p0, p1, p2, t) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
      const setStoma = (aw) => {
        pore.setAttribute('d', `M ${FX},${FYc - H} Q ${FX - 2 * aw},${FYc} ${FX},${FYc + H} Q ${FX + 2 * aw},${FYc} ${FX},${FYc - H} Z`);
        [-1, 1].forEach((s, i) => {
          const c = FX + s * 2 * (aw + G / 2);
          const d = `M ${FX},${FYc - H} Q ${c},${FYc} ${FX},${FYc + H}`;
          gcs[i].setAttribute('d', d); gin[i].setAttribute('d', d);
          chs[i].forEach((e, k) => { const t = 0.2 + k * 0.12; e.setAttribute('cx', qb(FX, c, FX, t)); e.setAttribute('cy', qb(FYc - H, FYc, FYc + H, t)); });
        });
      };
      setStoma(3);
      const co1 = [S.callout(P1, FX + 40, FYc - 60, 790, 210, '保衛細胞', CHL, { size: 26 }), S.callout(P1, FX, FYc, 790, 330, '氣孔', C.ink, { size: 26 })];
      const dayG = g(P1, { opacity: 0 }), nightG = g(P1, { opacity: 0 });
      sun(dayG, 1090, 120, 24);
      S.pill(dayG, 930, 470, '有光：氣孔通常張開', { size: 26, color: CHL, edge: CHL });
      moon(nightG, 1090, 120, 24);
      S.pill(nightG, 930, 470, '黑暗或缺水：氣孔關閉', { size: 26, color: '#ff9a8a', edge: '#ff9a8a' });
      const use1 = g(P1, { opacity: 0 });
      S.pill(use1, 930, 590, '氣孔：二氧化碳、氧和水蒸氣進出的通道', { size: 22, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      co1.forEach((c, i) => S.show(tl, c, `s1+=${0.7 + i * 0.4}`, 0.35));
      S.show(tl, dayG, 's1+=1.4', 0.4);
      S.drive(tl, (u) => setStoma(S.lerp(3, 24, u)), 1.2, 's1+=1.6', 'power2.inOut');
      S.drive(tl, (u) => vap.forEach((v, i) => { const k = (u * 3 + i / 5) % 1; v.setAttribute('r', 6 + k * 40); v.style.opacity = u > 0 && u < 1 ? (1 - k) * 0.9 : 0; }), 2.2, 's1+=2.6', 'none');
      S.hide(tl, dayG, 's1+=4.9', 0.3);
      S.show(tl, nightG, 's1+=5', 0.4);
      S.drive(tl, (u) => setStoma(S.lerp(24, 3, u)), 1.2, 's1+=5.1', 'power2.inOut');
      S.show(tl, use1, 's1+=6.4', 0.4);

      // ===== 2 影響蒸散作用的因素 =====
      const P2 = g(root, { opacity: 0 });
      const CARD = [
        ['光線', '暗', '亮', 'light', '光線強，蒸散快', '（氣孔張開）', [1, 6]],
        ['溫度', '低溫', '高溫', 'temp', '溫度高，蒸散快', '（水蒸發得快）', [2, 6]],
        ['風', '無風', '有風', 'wind', '風大，蒸散快', '（水蒸氣被吹走）', [2, 6]],
        ['濕度', '乾燥', '潮濕', 'hum', '濕度高，蒸散慢', '（空氣中水蒸氣多）', [6, 2]],
      ];
      const cards = [], puffs2 = [];
      CARD.forEach(([name, a, b, kind, res, why, rates], i) => {
        const x0 = 40 + i * 285, cg = g(P2, { opacity: 0 });
        el('rect', { x: x0, y: 70, width: 265, height: 560, rx: 16, ...FRAME }, cg);
        text(cg, x0 + 132, 116, name, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        [[a, x0 + 68], [b, x0 + 198]].forEach(([s, x], j) => {
          if (kind === 'light') (j ? sun : moon)(cg, x, 180, 20);
          if (kind === 'temp') {
            el('rect', { x: x - 8, y: 150, width: 16, height: 56, rx: 8, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, cg);
            el('circle', { cx: x, cy: 212, r: 12, fill: '#ff5f74' }, cg);
            el('rect', { x: x - 4, y: j ? 156 : 190, width: 8, height: j ? 54 : 20, fill: '#ff5f74' }, cg);
          }
          if (kind === 'wind' && j) [0, 1, 2].forEach((k) => el('path', { d: `M ${x - 40},${162 + k * 16} q 30,-8 60,0 q 12,4 8,-8`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round' }, cg));
          if (kind === 'wind' && !j) el('line', { x1: x - 30, y1: 180, x2: x + 30, y2: 180, stroke: '#4a6272', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, cg);
          if (kind === 'hum') {
            if (j) { el('ellipse', { cx: x, cy: 172, rx: 40, ry: 20, fill: '#8aa1ae' }, cg); [-18, 0, 18].forEach((dx) => el('path', { d: DROP, fill: XY, transform: `translate(${x + dx},${206}) scale(0.8)` }, cg)); }
            else sun(cg, x, 180, 16);
          }
          text(cg, x, 252, s, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
          el('line', { x1: x, y1: 450, x2: x, y2: 400, stroke: '#4f8a3a', 'stroke-width': 5 }, cg);
          leaf(cg, x - 20, 392, 60, 26, { r: 30, veins: false });
          leaf(cg, x + 20, 380, 60, 26, { r: -30, veins: false });
          el('path', { d: `M ${x - 36},450 L ${x + 36},450 L ${x + 28},490 L ${x - 28},490 Z`, fill: '#b0703c' }, cg);
          const n = rates[j];
          for (let k = 0; k < 6; k++) { const p = puff(cg, 7); p.style.opacity = 0; puffs2.push({ p, x, k, n, wind: kind === 'wind' && j }); }
        });
        el('line', { x1: x0 + 132, y1: 150, x2: x0 + 132, y2: 500, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '4 6' }, cg);
        text(cg, x0 + 132, 554, res, { 'font-size': 24, 'text-anchor': 'middle', fill: kind === 'hum' ? '#ff9a8a' : C.hi, 'font-weight': 700 });
        text(cg, x0 + 132, 592, why, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        cards.push(cg);
      });
      const tip2 = g(P2, { opacity: 0 });
      S.pill(tip2, 600, 676, '蒸散作用越旺盛，根吸水、往上運水也越快', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.2);
      cards.forEach((c, i) => S.show(tl, c, `s2+=${0.4 + i * 0.9}`, 0.4));
      S.drive(tl, (u) => puffs2.forEach(({ p, x, k, n, wind }) => {
        const t = (u * 4 + k / 6) % 1, on = k < n && u > 0 && u < 1;
        at(p, [x + (k % 2 ? 10 : -10) + (wind ? t * 50 : Math.sin(t * 6 + k) * 6), S.lerp(360, 280, t)], on ? 1 - t : 0);
      }), 5.5, 's2+=0.6', 'none');
      S.show(tl, tip2, 's2+=4.4', 0.5);

      // ===== 3 養分的運輸 =====
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 480, width: 620, height: 220, rx: 12, fill: SOIL }, P3);
      const SX = 360;
      el('path', { d: `M ${SX},486 C ${SX - 10},420 ${SX + 6},300 ${SX},120`, fill: 'none', stroke: '#3f6e3a', 'stroke-width': 22, 'stroke-linecap': 'round' }, P3);
      el('path', { d: `M ${SX},200 C ${SX + 50},180 ${SX + 100},170 ${SX + 130},180`, fill: 'none', stroke: '#3f6e3a', 'stroke-width': 10, 'stroke-linecap': 'round' }, P3);
      el('circle', { cx: SX + 140, cy: 222, r: 38, fill: '#e0563f', stroke: '#ff9a7a', 'stroke-width': 2 }, P3);
      [[-12, -8], [10, -12], [0, 10], [-14, 12], [14, 8]].forEach(([dx, dy]) => el('ellipse', { cx: SX + 140 + dx, cy: 222 + dy, rx: 3.5, ry: 5, fill: '#ffe9a8' }, P3));
      el('ellipse', { cx: SX, cy: 112, rx: 12, ry: 20, fill: '#8be07a' }, P3);
      el('path', { d: `M ${SX},486 C ${SX - 4},520 ${SX + 4},540 ${SX},560`, fill: 'none', stroke: ROOT, 'stroke-width': 10 }, P3);
      el('ellipse', { cx: SX, cy: 600, rx: 72, ry: 44, fill: '#b5487a', stroke: '#e38ab4', 'stroke-width': 2 }, P3);
      ['M 300,620 C 270,640 240,650 210,660', `M ${SX},640 L ${SX},690`, 'M 420,620 C 450,640 480,650 510,664'].forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 4 }, P3));
      [[250, 330, 220, 92, 12, 1], [470, 380, 220, 92, -12, -1]].map(([x, y, w, h, r]) => leaf(P3, x, y, w, h, { r }));
      const phl3 = el('path', { d: `M ${SX + 5},120 C ${SX + 10},300 ${SX - 5},420 ${SX + 5},486 L ${SX + 5},580 M ${SX},200 C ${SX + 50},180 ${SX + 100},170 ${SX + 130},188`, fill: 'none', stroke: PH, 'stroke-width': 5 }, P3);
      sun(P3, 110, 110, 30);
      const s3 = [
        polyAt([[300, 340], [SX + 4, 360], [SX + 4, 200], [SX + 60, 180], [SX + 130, 210]]),
        polyAt([[430, 390], [SX + 4, 410], [SX + 4, 140], [SX, 118]]),
        polyAt([[300, 340], [SX + 4, 360], [SX + 4, 480], [SX + 4, 590]]),
        polyAt([[430, 390], [SX + 4, 410], [SX + 4, 480], [SX + 4, 600]]),
      ];
      const sg3 = Array.from({ length: 12 }, () => sugar(P3, 10));
      const up3 = g(P3, { opacity: 0 }), dn3 = g(P3, { opacity: 0 });
      arrow(up3, SX - 44, 300, SX - 44, 170, PH, 5, 18); text(up3, SX - 58, 236, '往上', { 'font-size': 22, fill: PH, 'text-anchor': 'end', 'font-weight': 700 });
      arrow(dn3, SX + 44, 430, SX + 44, 540, PH, 5, 18); text(dn3, SX + 58, 500, '往下', { 'font-size': 22, fill: PH, 'font-weight': 700 });
      const co3 = [
        [SX, 112, 860, 90, '芽、新葉：生長需要養分', CHL],
        [SX + 150, 210, 860, 190, '果實、種子：儲存養分', '#ff9a7a'],
        [SX - 2, 450, 860, 420, '莖：使用或儲存（例如甘蔗）', C.ink],
        [SX + 60, 610, 860, 600, '根：使用或儲存（例如地瓜）', '#e38ab4'],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P3, tx, ty, x, y, s, c, { size: 24 }));
      const src3 = S.callout(P3, 200, 320, 130, 230, '葉：製造養分', CHL, { size: 24 });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, src3, 's3+=0.8', 0.4);
      S.drawOn(tl, phl3, 1.2, 's3+=1.2');
      S.drive(tl, (u) => sg3.forEach((s, i) => { const t = (u * 1.8 + Math.floor(i / 4) / 3) % 1; at(s, s3[i % 4](t), u > 0 && u < 1 ? 1 : 0); }), 6, 's3+=1.6', 'none');
      S.show(tl, up3, 's3+=2', 0.4);
      S.show(tl, dn3, 's3+=2.4', 0.4);
      co3.forEach((c, i) => S.show(tl, c, `s3+=${2.9 + i * 0.6}`, 0.35));

      // ===== 4 環狀剝皮 =====
      const P4 = g(root, { opacity: 0 });
      const TX = 330, TW = 150, TOP = 150, BOT = 560, CUT0 = 390, CUT1 = 430;
      el('rect', { x: 40, y: BOT, width: 580, height: 140, rx: 12, fill: SOIL }, P4);
      const canopy = el('path', { d: S.smoothPath(S.blobPts(TX, 110, 210, 90, 40, [[5, 0.08, 0.3], [9, 0.04, 1]])), fill: '#3f8a3a', stroke: '#6fce62', 'stroke-width': 3 }, P4);
      const roots4 = g(P4);
      ['M 300,560 C 280,600 230,640 170,660', 'M 330,560 L 330,690', 'M 360,560 C 380,600 430,640 490,664', 'M 310,570 C 290,620 270,660 250,690', 'M 350,570 C 370,620 390,660 410,690'].forEach((d) => el('path', { d, fill: 'none', stroke: ROOT, 'stroke-width': 9, 'stroke-linecap': 'round' }, roots4));
      // 木質部（中間）＋ 兩側的樹皮（含韌皮部）
      const XL = TX - TW / 2, XR = TX + TW / 2, BW = 26;
      el('rect', { x: XL + BW, y: TOP, width: TW - BW * 2, height: BOT - TOP, fill: WOOD }, P4);
      for (let k = 0; k < 4; k++) el('line', { x1: XL + BW + 18 + k * 22, y1: TOP, x2: XL + BW + 18 + k * 22, y2: BOT, stroke: XY, 'stroke-width': 3, opacity: 0.55 }, P4);
      const barkL = el('path', { fill: PHL, stroke: BARK, 'stroke-width': 3 }, P4);
      const barkR = el('path', { fill: PHL, stroke: BARK, 'stroke-width': 3 }, P4);
      const setBark = (bulge, cut) => {
        const mk = (s) => {
          const xin = s < 0 ? XL + BW : XR - BW, xo = s < 0 ? XL : XR;
          const b = s * bulge;
          const upper = `M ${xin},${TOP} L ${xo},${TOP} L ${xo},${CUT0 - 90} C ${xo},${CUT0 - 50} ${xo + b},${CUT0 - 30} ${xo + b * 0.8},${CUT0} L ${xin},${CUT0} Z`;
          const lower = `M ${xin},${CUT1} L ${xo},${CUT1} L ${xo},${BOT} L ${xin},${BOT} Z`;
          const mid = cut ? '' : `M ${xin},${CUT0 - 1} L ${xo + b * 0.8},${CUT0 - 1} L ${xo},${CUT1 + 1} L ${xin},${CUT1 + 1} Z`;
          return upper + ' ' + mid + ' ' + lower;
        };
        barkL.setAttribute('d', mk(-1)); barkR.setAttribute('d', mk(1));
      };
      setBark(0, false);
      const cutLbl = g(P4, { opacity: 0 });
      el('line', { x1: XR + 10, y1: CUT0, x2: XR + 40, y2: CUT0, stroke: C.hi, 'stroke-width': 2 }, cutLbl);
      el('line', { x1: XR + 10, y1: CUT1, x2: XR + 40, y2: CUT1, stroke: C.hi, 'stroke-width': 2 }, cutLbl);
      text(cutLbl, XR + 48, CUT1 - 12, '剝掉一圈樹皮', { 'font-size': 22, fill: C.hi });
      const sg4 = Array.from({ length: 10 }, () => sugar(P4, 9));
      const pile = Array.from({ length: 8 }, (_, i) => { const s = sugar(P4, 9); at(s, [i % 2 ? XR - 13 + (i % 4 > 1 ? 10 : 0) : XL + 13 - (i % 4 > 1 ? 10 : 0), CUT0 - 14 - Math.floor(i / 4) * 18], 0); return s; });
      const wd4 = Array.from({ length: 6 }, () => drop(P4, 1.1));
      const tip4 = [
        ['1', '剝掉一圈樹皮（連同韌皮部）', ''],
        ['2', '養分往下運送被擋住，', '堆積在切口上方，上方膨大'],
        ['3', '木質部沒有被切斷，水仍能', '往上運送，葉暫時不會枯萎'],
        ['4', '根得不到養分，', '一段時間後＊整棵樹死亡'],
      ].map(([n, a, b], i) => {
        const tg = g(P4, { opacity: 0 }), y = 160 + i * 118;
        el('circle', { cx: 690, cy: y - 8, r: 20, fill: 'none', stroke: C.hi, 'stroke-width': 2.5 }, tg);
        text(tg, 690, y, String(i + 1), { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        text(tg, 726, y, a, { 'font-size': 24, fill: C.ink });
        if (b) text(tg, 726, y + 36, b, { 'font-size': 24, fill: C.ink });
        return tg;
      });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, tip4[0], 's4+=0.6', 0.4);
      S.show(tl, cutLbl, 's4+=1.1', 0.4);
      S.drive(tl, (u) => {
        sg4.forEach((s, i) => { const t = (u * 2.5 + i / 10) % 1, y = S.lerp(TOP, CUT0 - 50, t); at(s, [i % 2 ? XR - 13 : XL + 13, y], u > 0 && u < 1 ? 1 - S.smoothstep(0.85, 1, t) : 0); });
        pile.forEach((s, i) => { s.style.opacity = u > (i + 1) / 10 ? 1 : 0; });
      }, 3.6, 's4+=1.6', 'none');
      S.drive(tl, (u) => setBark(14 * S.smoothstep(0.3, 1, u), u > 0.02), 4.6, 's4+=1.0', 'none');
      S.show(tl, tip4[1], 's4+=2.4', 0.4);
      S.drive(tl, (u) => wd4.forEach((d, i) => { const t = (u * 2 + i / 6) % 1; at(d, [TX + (i % 3 - 1) * 26, S.lerp(BOT + 60, TOP - 10, t)], u > 0 && u < 1 ? 1 : 0); }), 3, 's4+=4.4', 'none');
      S.show(tl, tip4[2], 's4+=4.6', 0.4);
      tl.fromTo(roots4, { opacity: 1 }, { opacity: 0.25, duration: 1.2, immediateRender: false }, 's4+=7.6');
      tl.fromTo(canopy, { attr: { fill: '#3f8a3a' } }, { attr: { fill: '#7a5a2a' }, duration: 1.2, immediateRender: false }, 's4+=8.2');
      S.show(tl, tip4[3], 's4+=7.8', 0.4);

      // ===== 5 紅墨水實驗 =====
      const P5 = g(root, { opacity: 0 });
      const BXc = 230;
      el('rect', { x: BXc - 96, y: 500, width: 192, height: 130, fill: 'rgba(226,54,79,0.55)' }, P5);
      el('path', { d: `M ${BXc - 108},440 L ${BXc - 100},448 L ${BXc - 100},630 Q ${BXc - 100},640 ${BXc - 90},640 L ${BXc + 90},640 Q ${BXc + 100},640 ${BXc + 100},630 L ${BXc + 100},448 L ${BXc + 108},440`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, P5);
      text(P5, BXc, 680, '紅色墨水', { 'font-size': 22, 'text-anchor': 'middle', fill: INK });
      el('rect', { x: BXc - 14, y: 120, width: 28, height: 500, rx: 12, fill: 'rgba(143,214,120,0.45)', stroke: '#8fd678', 'stroke-width': 2 }, P5);
      [[BXc - 70, 170, 130, 56, 18], [BXc + 70, 230, 130, 56, -18], [BXc - 60, 320, 120, 52, 14]].forEach(([x, y, w, h, r]) => leaf(P5, x, y, w, h, { r, veins: false, fill: 'rgba(79,174,74,0.85)' }));
      const lines5 = [BXc - 6, BXc + 6].map((x) => el('line', { x1: x, y1: 618, x2: x, y2: 124, stroke: INK, 'stroke-width': 4, 'stroke-dasharray': '494 494', 'stroke-dashoffset': 494 }, P5));
      text(P5, BXc + 40, 110, '芹菜', { 'font-size': 22, fill: C.mute });
      const cut5 = g(P5, { opacity: 0 });
      el('line', { x1: BXc - 60, y1: 400, x2: BXc + 60, y2: 400, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, cut5);
      text(cut5, BXc - 66, 408, '橫切', { 'font-size': 22, 'text-anchor': 'end', fill: C.hi, 'font-weight': 700 });
      const time5 = text(P5, BXc + 116, 560, '', { 'font-size': 22, fill: C.hi });
      const X5 = g(P5, { opacity: 0 });
      el('line', { x1: BXc + 64, y1: 400, x2: 582, y2: 330, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, X5);
      // 芹菜的橫切面：外側較圓、內側凹進去；維管束排在外側附近
      const CX5 = 760, CY5 = 390;
      const outerD = 'M 590,250 C 570,380 650,500 760,505 C 870,500 950,380 930,250';
      el('path', { d: outerD + ' C 900,232 860,236 840,262 C 800,300 720,300 680,262 C 660,236 620,232 590,250 Z', fill: 'rgba(143,214,120,0.18)', stroke: '#a8e39a', 'stroke-width': 4 }, X5);
      const op = el('path', { d: outerD, fill: 'none' }, X5);
      const OL = op.getTotalLength(), bp = [];
      for (let i = 0; i < 9; i++) {
        const s0 = OL * (0.06 + i * 0.11), q = op.getPointAtLength(s0), q2 = op.getPointAtLength(Math.min(OL, s0 + 1));
        let nx = -(q2.y - q.y), ny = q2.x - q.x; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
        if ((CX5 - q.x) * nx + (CY5 - q.y) * ny < 0) { nx = -nx; ny = -ny; }
        const x = q.x + nx * 36, y = q.y + ny * 36;
        const b = S.place(g(X5), { x, y, s: 1.8, r: (Math.atan2(-ny, -nx) * 180) / Math.PI + 90 });
        el('ellipse', { cx: 0, cy: -8, rx: 10, ry: 8, fill: 'rgba(255,207,92,0.35)', stroke: PH, 'stroke-width': 1 }, b);
        el('ellipse', { cx: 0, cy: 8, rx: 11, ry: 10, fill: INK, stroke: '#ff8a9a', 'stroke-width': 1 }, b);
        bp.push([x, y, nx, ny]);
      }
      text(X5, CX5, 556, '芹菜的橫切面（放大＊）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const [xa, ya, na, ma] = bp[7], [xb, yb, nb, mb] = bp[5];
      const co5 = S.callout(P5, xa + na * 14, ya + ma * 14, 1060, 300, '木質部變紅', INK, { size: 24 });
      const co6 = S.callout(P5, xb - nb * 14, yb - mb * 14, 1050, 470, '韌皮部沒有變紅', PH, { size: 24 });
      const con5 = g(P5, { opacity: 0 });
      S.pill(con5, 820, 640, '水由木質部（導管）往上運送', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      lines5.forEach((l) => tl.fromTo(l, { attr: { 'stroke-dashoffset': 494 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 2.6, ease: 'power1.out', immediateRender: false }, 's5+=0.8'));
      S.drive(tl, (u) => { time5.textContent = u > 0 ? `經過一段時間＊` : ''; }, 0.1, 's5+=0.8');
      S.show(tl, cut5, 's5+=3.6', 0.4);
      S.show(tl, X5, 's5+=4.2', 0.5);
      S.show(tl, co5, 's5+=5', 0.4);
      S.show(tl, co6, 's5+=5.5', 0.4);
      S.show(tl, con5, 's5+=6.1', 0.4);

      return {
        tl,
        notes: [
          '＊示意：水滴、細胞和氣孔都畫得很大。植物吸收的水，大部分經由蒸散作用散失，只有少部分用在光合作用等生理作用。',
          '＊示意：保衛細胞畫得很大。保衛細胞吸水膨脹時氣孔張開，失水時氣孔關閉。保衛細胞含有葉綠體，一般表皮細胞大多沒有。大多數陸生植物，下表皮的氣孔比上表皮多。',
          '＊示意：水蒸氣的多少是示意。蒸散作用也能幫助葉片散熱。',
          '＊示意：養分以葡萄糖表示；在韌皮部中運送的主要是由葡萄糖轉變成的醣類（例如蔗糖，補充）。',
          '＊示意：各層的厚度都畫得比較誇張。樹死亡需要的時間因樹種而不同，通常要幾個月以上。',
          '＊示意時間：真實的實驗大約要數十分鐘到幾小時才會明顯變紅；縱切可以看到紅色的細線由下往上。芹菜平常吃的部分其實是葉柄（補充）。剪莖時最好在水中剪，避免空氣進入導管。',
        ],
        steps: [
          '水的路徑：<b>根毛</b>吸水 → 根、莖的<b>木質部</b> → <b>葉脈</b> → 葉肉細胞 → 由<b>氣孔</b>散失。水以水蒸氣的形式散失，叫做<b>蒸散作用</b>，是水往上運送的主要動力。',
          '<b>氣孔</b>由一對<b>保衛細胞</b>圍成，保衛細胞控制氣孔的開和關。有光時氣孔通常張開；黑暗或缺水時氣孔關閉，減少水分散失。',
          '影響蒸散作用的因素：<b>光線強、溫度高、風大</b>時，蒸散作用比較旺盛；<b>濕度高</b>時，蒸散作用比較慢。',
          '葉製造的<b>養分</b>，經由<b>韌皮部</b>的篩管，運送到芽、果實、種子、莖和根等部位使用或儲存，<b>可以往上，也可以往下</b>。',
          '<b>環狀剝皮</b>：剝掉一圈樹皮（含韌皮部），養分不能往下運送，切口<b>上方膨大</b>；水仍經木質部往上，但根得不到養分，最後整棵樹死亡。',
          '<b>紅墨水實驗</b>：把芹菜插在紅色墨水中，一段時間後橫切，<b>維管束</b>中<b>木質部</b>的位置變紅，表示水由木質部往上運送。',
        ],
      };
    },
  });
})();
