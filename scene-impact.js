/* 七下 6-2 人類對環境的衝擊：棲地破壞與破碎化、過度利用、溫室效應、臭氧層與酸雨、水汙染、外來入侵種、生物放大作用 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B6;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const panel = (p, x, y, w, h, title, col = C.ink, size = 28) => {
    const q = g(p);
    el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME }, q);
    if (title) text(q, x + w / 2, y + 40, title, { 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
    return q;
  };
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 3, head = 12) => {
    const a = Math.atan2(y2 - y1, x2 - x1), q = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.8, y2: y2 - Math.sin(a) * head * 0.8, stroke: col, 'stroke-width': w }, q);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, q);
    return q;
  };
  const mol = (p, x, y, label, fill, r = 25, size = 20) => {
    const m = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 2 }, m);
    text(m, 0, size * 0.36, label, { 'font-size': size, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 });
    return m;
  };
  const lines = (p, x, y, arr, { size = 22, gap = 32, fill = C.ink2, anchor = 'middle', weight } = {}) => arr.forEach((s, i) => text(p, x, y + i * gap, s, { 'font-size': size, 'text-anchor': anchor, fill, 'font-weight': weight }));
  // 俯視的樹冠
  const crown = (p, x, y, r, c = '#3f8a46') => { el('circle', { cx: x, cy: y, r, fill: c, stroke: '#2a5a30', 'stroke-width': 1.5 }, p); el('circle', { cx: x - r * 0.3, cy: y - r * 0.3, r: r * 0.45, fill: '#5fae52', opacity: 0.7 }, p); };
  const cloud = (p, x, y, s = 1, c = '#b8c4cc') => { const q = at(p, x, y, s); [[-40, 6, 26], [-12, -10, 32], [22, -4, 28], [44, 8, 20], [0, 12, 26]].forEach(([dx, dy, r]) => el('circle', { cx: dx, cy: dy, r, fill: c }, q)); return q; };
  const stump = (p, x, y, s = 1) => { const q = at(p, x, y, s); el('path', { d: 'M -16,0 L -16,-24 L 16,-24 L 16,0 Z', fill: '#8a6a44', stroke: '#c8a878', 'stroke-width': 2 }, q); el('ellipse', { cx: 0, cy: -24, rx: 16, ry: 6, fill: '#d9b98a', stroke: '#8a6a44', 'stroke-width': 1.5 }, q); el('ellipse', { cx: 0, cy: -24, rx: 8, ry: 3, fill: 'none', stroke: '#a8865a', 'stroke-width': 1.2 }, q); return q; };

  S.register({
    id: 'impact', section: '下6-2', title: '人類對環境的衝擊',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 人口增加 → 棲地破壞與破碎化 =====
      const P0 = g(root);
      panel(P0, 40, 70, 420, 520, '世界人口', C.ink2);
      const YR = (y) => 110 + ((y - 1800) / 225) * 300, PV = (v) => 520 - v * 4.4; // v：億人
      [0, 20, 40, 60, 80].forEach((v) => { el('line', { x1: 110, y1: PV(v), x2: 420, y2: PV(v), stroke: '#22384a', 'stroke-width': 1.5 }, P0); text(P0, 100, PV(v) + 7, String(v), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute }); });
      [1800, 1900, 2000].forEach((y) => text(P0, YR(y), 558, String(y), { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }));
      text(P0, 64, 134, '億人', { 'font-size': 20, fill: C.mute });
      text(P0, 410, 580, '年', { 'font-size': 20, fill: C.mute });
      const POP = [[1800, 10], [1850, 12], [1900, 16], [1950, 25], [1975, 41], [2000, 61], [2022, 80]];
      const popLine = el('path', { d: 'M ' + POP.map(([y, v]) => `${YR(y).toFixed(1)},${PV(v).toFixed(1)}`).join(' L '), fill: 'none', stroke: C.hi, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, P0);
      const popEnd = g(P0, { opacity: 0 });
      el('circle', { cx: YR(2022), cy: PV(80), r: 7, fill: C.hi }, popEnd);
      text(popEnd, YR(2022) - 12, PV(80) - 10, '約 80 億', { 'font-size': 22, 'text-anchor': 'end', fill: C.hi, 'font-weight': 700 });
      // 右：俯視的森林被開發
      const AX = 490, AY = 70, AW = 670, AH = 520;
      el('rect', { x: AX, y: AY, width: AW, height: AH, rx: 16, ...FRAME }, P0);
      const aer = g(P0, { 'clip-path': B.clipBy(P0, `M ${AX + 2},${AY + 2} h ${AW - 4} v ${AH - 4} h ${-(AW - 4)} Z`) });
      el('rect', { x: AX, y: AY, width: AW, height: AH, fill: '#2f6a3a' }, aer);
      const rr = S.rng(21);
      for (let i = 0; i < 230; i++) crown(aer, AX + rr() * AW, AY + rr() * AH, 14 + rr() * 10, ['#3f8a46', '#357a3e', '#4a9450'][i % 3]);
      const dev = g(aer, { opacity: 0 });
      // 農田
      [[AX + 20, AY + 300, 220, 200], [AX + 420, AY + 40, 230, 150], [AX + 440, AY + 330, 210, 170]].forEach(([x, y, w, h], i) => {
        el('rect', { x, y, width: w, height: h, fill: i === 1 ? '#b9a44a' : '#8aa648', stroke: '#6a7a3a', 'stroke-width': 2 }, dev);
        for (let k = 10; k < w; k += 16) el('line', { x1: x + k, y1: y + 4, x2: x + k, y2: y + h - 4, stroke: '#6a7a3a', 'stroke-width': 1.5, opacity: 0.6 }, dev);
      });
      // 房屋
      for (let i = 0; i < 9; i++) { const x = AX + 270 + (i % 3) * 44, y = AY + 380 + Math.floor(i / 3) * 40; el('rect', { x, y, width: 32, height: 28, fill: i % 2 ? '#c96a4a' : '#9aa4ab', stroke: '#e8e0d0', 'stroke-width': 1.5 }, dev); }
      // 道路
      const roadD = `M ${AX - 10},${AY + 250} C ${AX + 200},${AY + 230} ${AX + 380},${AY + 290} ${AX + AW + 10},${AY + 250}`;
      const roadD2 = `M ${AX + 330},${AY - 10} C ${AX + 320},${AY + 160} ${AX + 350},${AY + 380} ${AX + 340},${AY + AH + 10}`;
      [roadD, roadD2].forEach((d) => { el('path', { d, fill: 'none', stroke: '#6f7478', 'stroke-width': 30 }, dev); el('path', { d, fill: 'none', stroke: '#e8e0b0', 'stroke-width': 2.5, 'stroke-dasharray': '14 12' }, dev); });
      const p0a = g(P0, { opacity: 0 }), p0b = g(P0, { opacity: 0 });
      S.pill(p0a, 700, 630, '森林變小：棲地破壞', { size: 26, color: '#ff9a8a', edge: '#ff7a66' });
      S.pill(p0b, 990, 630, '切成小塊：棲地破碎化', { size: 26, color: C.hi, edge: C.hi });
      const p0c = g(P0, { opacity: 0 });
      S.pill(p0c, 250, 630, '需要更多土地和資源', { size: 26, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s0');
      S.drawOn(tl, popLine, 2, 's0+=0.3');
      S.show(tl, popEnd, 's0+=2.2', 0.4);
      S.show(tl, p0c, 's0+=2.5', 0.4);
      tl.fromTo(dev, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'none' }, 's0+=3');
      S.show(tl, p0a, 's0+=4.5', 0.4);
      S.show(tl, p0b, 's0+=5.1', 0.4);

      // ===== 1 過度利用 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 1120, height: 330, rx: 16, fill: '#1c3a5a' }, P1);
      el('rect', { x: 40, y: 170, width: 1120, height: 230, fill: '#17507a' }, P1);
      el('path', { d: 'M 40,170 ' + Array.from({ length: 28 }, (_, i) => `q 20,-6 40,0`).join(' '), fill: 'none', stroke: '#9cd0f0', 'stroke-width': 2.5 }, P1);
      // 漁船
      const boat = at(P1, 260, 168, 1);
      el('path', { d: 'M -120,-6 L 110,-6 L 90,34 L -100,34 Z', fill: '#c94a3a', stroke: '#f2b0a8', 'stroke-width': 2 }, boat);
      el('rect', { x: -60, y: -50, width: 70, height: 44, rx: 4, fill: '#e8e4d8', stroke: '#9aa4ab', 'stroke-width': 2 }, boat);
      el('rect', { x: -50, y: -42, width: 18, height: 14, fill: '#8fd0ff' }, boat);
      el('rect', { x: -24, y: -42, width: 18, height: 14, fill: '#8fd0ff' }, boat);
      el('line', { x1: 50, y1: -6, x2: 50, y2: -80, stroke: '#9aa4ab', 'stroke-width': 4 }, boat);
      el('line', { x1: 50, y1: -78, x2: 110, y2: -10, stroke: '#9aa4ab', 'stroke-width': 2 }, boat);
      // 網子與魚
      const net = g(P1);
      el('path', { d: 'M 370,170 C 470,220 560,250 640,250 L 860,250 C 900,290 900,350 860,380 L 640,380 C 560,370 470,260 370,170 Z', fill: 'rgba(220,230,235,0.08)', stroke: '#cfd8dc', 'stroke-width': 2.5 }, net);
      for (let i = 0; i < 9; i++) el('line', { x1: 640 + i * 26, y1: 252, x2: 640 + i * 26, y2: 378, stroke: '#cfd8dc', 'stroke-width': 1, opacity: 0.6 }, net);
      for (let k = 0; k < 4; k++) el('line', { x1: 600, y1: 276 + k * 26, x2: 880, y2: 276 + k * 26, stroke: '#cfd8dc', 'stroke-width': 1, opacity: 0.6 }, net);
      const caught = [];
      const rf = S.rng(4);
      for (let i = 0; i < 14; i++) { const q = at(P1, 660 + (i % 5) * 44 + rf() * 10, 280 + Math.floor(i / 5) * 34 + rf() * 6, 0.24); B.smallFish(q); caught.push(q); }
      text(P1, 980, 230, '一次捕撈', { 'font-size': 24, fill: C.ink, 'font-weight': 700 });
      text(P1, 980, 262, '大量的魚', { 'font-size': 24, fill: C.ink, 'font-weight': 700 });
      // 下：族群越來越少
      const POPS = [['一開始', 15], ['持續大量捕撈', 7], ['之後', 2]];
      const pops = POPS.map(([t, n], i) => {
        const q = g(P1, { opacity: 0 }), x = 230 + i * 370;
        el('rect', { x: x - 170, y: 430, width: 340, height: 180, rx: 14, fill: '#123a58', stroke: '#2b5a7a', 'stroke-width': 2 }, q);
        text(q, x, 466, t, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        const r2 = S.rng(9 + i);
        for (let k = 0; k < n; k++) B.smallFish(at(q, x - 130 + (k % 5) * 64 + r2() * 8, 500 + Math.floor(k / 5) * 36 + r2() * 6, 0.24));
        return q;
      });
      [0, 1].forEach((i) => pops.push(arrow(P1, 405 + i * 370, 520, 435 + i * 370, 520, C.ink2, 4, 14)));
      const p1b = g(P1, { opacity: 0 });
      S.pill(p1b, 600, 662, '捕撈得比繁殖得快，族群就越來越少', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.show(tl, caught, 's1+=0.8', 1.2);
      S.show(tl, pops[0], 's1+=2.4', 0.4);
      S.show(tl, [pops[3], pops[1]], 's1+=3', 0.4);
      S.show(tl, [pops[4], pops[2]], 's1+=3.6', 0.4);
      S.show(tl, p1b, 's1+=4.4', 0.4);

      // ===== 2 溫室效應與全球暖化 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 800, height: 560, rx: 16, fill: B.grad(P2, [[0, '#14304c'], [1, '#22465e']]) }, P2);
      B.sun(at(P2, 120, 140, 0.9));
      // 大氣中的溫室氣體層
      el('rect', { x: 42, y: 230, width: 796, height: 70, fill: 'rgba(184,196,204,0.10)' }, P2);
      text(P2, 56, 334, '大氣中的溫室氣體', { 'font-size': 22, fill: C.co2 });
      const rayLayer = g(P2); // 陽光畫在氣體分子後面，才不會穿過 CO₂ 的字
      const GP = Array.from({ length: 11 }, (_, i) => [130 + i * 64, i % 2 ? 282 : 250]);
      GP.filter((_, i) => i % 4 === 1).forEach(([x, y]) => mol(P2, x, y, 'CO₂', C.co2));
      const gasAdd = GP.filter((_, i) => i % 4 !== 1).map(([x, y]) => { const m = mol(P2, x, y, 'CO₂', C.co2); m.style.opacity = 0; return m; });
      // 地面
      el('path', { d: 'M 42,520 L 838,520 L 838,628 L 42,628 Z', fill: '#2f5a36' }, P2);
      const fac = at(P2, 230, 522, 0.75); B.factory(fac);
      const smk = B.smoke(P2, 252, 402, 0.8); smk.style.opacity = 0;
      const car = at(P2, 420, 524, 0.75); B.car(car);
      const exh = g(P2, { opacity: 0 }); [[360, 512, 8], [346, 504, 10], [330, 494, 12]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#9aa4ab', opacity: 0.7 }, exh));
      [600, 650, 700].forEach((x, i) => stump(P2, x, 522, 1 - i * 0.1));
      B.broadleaf(at(P2, 770, 522, 1), { h: 120 });
      lines(P2, 300, 566, ['燃燒化石燃料', '（煤、石油、天然氣）'], { size: 22, gap: 30, fill: C.ink });
      lines(P2, 660, 566, ['砍伐森林'], { size: 22, fill: C.ink });
      lines(P2, 660, 596, ['吸收 CO₂ 的植物變少'], { size: 20, fill: C.mute });
      // 陽光與熱
      const sunRays = [0, 1].map((i) => el('line', { x1: 172 + i * 22, y1: 182 + i * 4, x2: 556 + i * 28, y2: 512, stroke: C.hi, 'stroke-width': 4, 'stroke-dasharray': '14 10' }, rayLayer));
      // 熱：從地面往上，一部分穿出大氣，一部分被溫室氣體留住、再回到地面
      const heat = (x, back) => {
        const q = g(P2, { opacity: 0 });
        const pts = back ? [[x, 510], [x + 14, 304], [x + 40, 470]] : [[x, 510], [x + 12, 118]];
        el('path', { d: 'M ' + pts.map((pt) => pt.join(',')).join(' L '), fill: 'none', stroke: '#ff7a5a', 'stroke-width': 4, 'stroke-dasharray': '10 7', 'stroke-linejoin': 'round' }, q);
        const [a, b] = pts.slice(-2), an = Math.atan2(b[1] - a[1], b[0] - a[0]);
        el('path', { d: `M ${b[0] + Math.cos(an) * 6},${b[1] + Math.sin(an) * 6} L ${b[0] - 14 * Math.cos(an - 0.45)},${b[1] - 14 * Math.sin(an - 0.45)} L ${b[0] - 14 * Math.cos(an + 0.45)},${b[1] - 14 * Math.sin(an + 0.45)} Z`, fill: '#ff7a5a' }, q);
        return q;
      };
      const heatOut = [600, 790].map((x) => heat(x, false));
      const heatBack = [520, 620, 680, 730, 470].map((x) => heat(x, true));
      text(P2, 700, 150, '熱', { 'font-size': 22, fill: '#ff8f7a', 'font-weight': 700 });
      const th = B.thermo(at(P2, 96, 470, 0.8)); th.set(0.3);
      const thL = text(P2, 96, 548, '', { 'font-size': 20, 'text-anchor': 'middle', fill: '#ff8f8f' });
      const hot = { u: 0 };
      // 右：影響
      const fx = g(P2, { opacity: 0 });
      el('rect', { x: 860, y: 70, width: 300, height: 560, rx: 16, ...FRAME }, fx);
      text(fx, 1010, 112, '全球暖化的影響', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ff8f8f' });
      [['海平面上升', '#8fd0ff'], ['極端天氣：暴雨、乾旱', '#d9c9a0'], ['珊瑚白化', '#ffb3a8'], ['生物分布改變：', '#9be58c']].forEach(([s, c], i) => S.pill(fx, 1010, 176 + i * 76, s, { size: i === 1 ? 20 : 22, color: c, edge: c }));
      lines(fx, 1010, 448, ['有些生物往高海拔', '或高緯度移動'], { size: 22, gap: 32, fill: '#9be58c' });
      const p2b = g(P2, { opacity: 0 });
      S.pill(p2b, 440, 676, '溫室氣體變多 → 留住的熱變多 → 全球暖化', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      sunRays.forEach((r) => tl.fromTo(r, { attr: { 'stroke-dashoffset': 48 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 5.5, ease: 'none', immediateRender: false }, 's2+=0.5'));
      S.show(tl, [...heatOut, ...heatBack.slice(0, 2)], 's2+=1', 0.5);
      S.show(tl, [smk, exh], 's2+=2', 0.5);
      gasAdd.forEach((m, i) => S.show(tl, m, `s2+=${2.3 + i * 0.18}`, 0.3));
      S.show(tl, heatBack.slice(2), 's2+=3.4', 0.5);
      S.drive(tl, (u) => { th.set(0.3 + u * 0.55); thL.textContent = u > 0.5 ? '溫度上升' : ''; }, 1.4, 's2+=3.4');
      S.show(tl, p2b, 's2+=4.4', 0.4);
      S.show(tl, fx, 's2+=5', 0.5);

      // ===== 3 臭氧層破洞、酸雨 =====
      const P3 = g(root, { opacity: 0 });
      // 左：臭氧層
      el('rect', { x: 40, y: 70, width: 540, height: 560, rx: 16, fill: B.grad(P3, [[0, '#101e3a'], [1, '#22465e']]) }, P3);
      B.sun(at(P3, 110, 128, 0.7));
      const OZ = 210;
      const ozL = el('rect', { x: 42, y: OZ, width: 230, height: 26, fill: '#7fb8e8', opacity: 0.55 }, P3);
      const ozR = el('rect', { x: 352, y: OZ, width: 226, height: 26, fill: '#7fb8e8', opacity: 0.55 }, P3);
      const ozMid = el('rect', { x: 272, y: OZ, width: 80, height: 26, fill: '#7fb8e8', opacity: 0.55 }, P3);
      text(P3, 566, OZ + 56, '臭氧層', { 'font-size': 24, 'text-anchor': 'end', fill: '#9cd0f0', 'font-weight': 700 });
      const uv = (x, through) => el('path', { d: `M ${x},150 L ${x + 20},${through ? 470 : OZ}`, fill: 'none', stroke: '#c58aff', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, P3);
      const uvBlock = [180, 220, 420, 470].map((x) => uv(x, false));
      const uvIn = [290, 320].map((x) => { const u2 = uv(x, true); u2.style.opacity = 0; return u2; });
      text(P3, 52, 200, '紫外線', { 'font-size': 22, fill: '#c58aff', 'font-weight': 700 });
      el('rect', { x: 42, y: 480, width: 536, height: 148, fill: '#2f5a36' }, P3);
      // 冷媒、噴霧罐釋出氟氯碳化物
      const can = at(P3, 120, 476, 1);
      el('rect', { x: -16, y: -60, width: 32, height: 60, rx: 6, fill: '#c9d2d8', stroke: '#eef3f6', 'stroke-width': 2 }, can);
      el('rect', { x: -8, y: -72, width: 16, height: 12, rx: 2, fill: '#8a949c' }, can);
      el('rect', { x: -16, y: -44, width: 32, height: 18, fill: '#d0574a' }, can);
      const fr = at(P3, 200, 476, 1);
      el('rect', { x: -30, y: -96, width: 60, height: 96, rx: 6, fill: '#e8ecee', stroke: '#9aa4ab', 'stroke-width': 2 }, fr);
      el('line', { x1: -30, y1: -60, x2: 30, y2: -60, stroke: '#9aa4ab', 'stroke-width': 2 }, fr);
      el('line', { x1: 20, y1: -86, x2: 20, y2: -70, stroke: '#9aa4ab', 'stroke-width': 3 }, fr);
      lines(P3, 160, 520, ['過去的噴霧罐、冷氣', '冰箱的冷媒'], { size: 20, gap: 28, fill: C.ink });
      const cfc = [0, 1, 2, 3].map(() => mol(P3, 0, 0, 'CFC', '#ffb35c', 27, 20));
      const eff3 = g(P3, { opacity: 0 });
      lines(eff3, 420, 520, ['紫外線增加：', '皮膚癌、白內障', '也傷害其他生物'], { size: 20, gap: 28, fill: '#c58aff' });
      const p3a = g(P3, { opacity: 0 });
      S.pill(p3a, 310, 676, '限用氟氯碳化物後，臭氧層正慢慢恢復', { size: 22, color: '#9be58c', edge: '#6fae4a' });
      // 右：酸雨
      el('rect', { x: 600, y: 70, width: 560, height: 560, rx: 16, fill: B.grad(P3, [[0, '#2a3440'], [1, '#22465e']]) }, P3);
      const rainCloud = cloud(P3, 900, 150, 1.4, '#8a949c');
      const fac3 = at(P3, 700, 480, 0.62); B.factory(fac3);
      const car3 = at(P3, 820, 482, 0.55); B.car(car3);
      B.smoke(P3, 721, 380, 0.6, '#a8a090');
      const gasUp = [['M 730,340 C 760,290 800,240 850,206'], ['M 774,470 C 800,380 850,290 900,214']].map(([d]) => el('path', { d, fill: 'none', stroke: '#d9c27c', 'stroke-width': 3, 'stroke-dasharray': '8 6', opacity: 0 }, P3));
      text(P3, 640, 300, '硫氧化物', { 'font-size': 22, fill: '#d9c27c' });
      text(P3, 640, 330, '氮氧化物', { 'font-size': 22, fill: '#d9c27c' });
      el('rect', { x: 602, y: 480, width: 556, height: 148, fill: '#2f5a36' }, P3);
      el('path', { d: 'M 980,480 C 1000,520 1100,524 1150,500 L 1158,480 Z', fill: '#2f6aa0' }, P3);
      // 受害的樹：葉子掉落
      const sick = at(P3, 1000, 480, 1);
      el('path', { d: 'M -5,0 L -3,-90 M -3,-60 L -30,-90 M -3,-70 L 24,-104 M -3,-90 L -16,-120 M -30,-90 L -38,-100 M 24,-104 L 34,-110', fill: 'none', stroke: '#7a6a58', 'stroke-width': 5, 'stroke-linecap': 'round' }, sick);
      [[-40, -40, 30], [30, -20, -20], [12, -60, 60]].forEach(([x, y, r]) => el('path', { d: 'M 0,-7 C 5,-3 5,3 0,7 C -5,3 -5,-3 0,-7 Z', fill: '#a8843a', transform: `translate(${x},${y}) rotate(${r})` }, sick));
      B.conifer(at(P3, 1080, 480, 1), { h: 110, c1: '#7a7a3a', c2: '#8a8a46' });
      const drops = [];
      const rd = S.rng(31);
      for (let i = 0; i < 18; i++) drops.push(el('path', { d: 'M 0,-10 C 4,-2 5,4 0,6 C -5,4 -4,-2 0,-10 Z', fill: '#9cd0f0', transform: `translate(${(830 + rd() * 200).toFixed(0)},${(210 + rd() * 230).toFixed(0)})`, opacity: 0 }, P3));
      const eff4 = g(P3, { opacity: 0 });
      lines(eff4, 990, 548, ['植物受傷、湖水變酸', '建築物被侵蝕'], { size: 22, gap: 32, fill: '#ffb3a8' });
      const p3b = g(P3, { opacity: 0 });
      S.pill(p3b, 880, 676, '酸雨：燃燒煤和石油產生的氣體溶在雨中', { size: 22, color: '#d9c27c', edge: '#d9c27c' });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drive(tl, (u) => cfc.forEach((m, i) => { const k = S.clamp(u * 1.4 - i * 0.12); S.place(m, { x: S.lerp(140 + i * 30, 282 + i * 58, k), y: S.lerp(420, OZ + 12, k) }); m.style.opacity = k > 0 && (k < 1 || i < 2) ? 1 : 0; }), 2, 's3+=0.6', 'power1.in');
      tl.fromTo(ozMid, { opacity: 0.55 }, { opacity: 0.08, duration: 0.6, immediateRender: false }, 's3+=2.4');
      S.show(tl, uvIn, 's3+=2.8', 0.4);
      S.show(tl, eff3, 's3+=3.1', 0.4);
      S.show(tl, gasUp, 's3+=3.4', 0.4);
      drops.forEach((d, i) => tl.fromTo(d, { opacity: 0 }, { opacity: 0.9, duration: 0.2, immediateRender: false }, `s3+=${3.9 + (i % 6) * 0.1}`));
      S.show(tl, eff4, 's3+=4.6', 0.4);
      S.show(tl, [p3a, p3b], 's3+=5.1', 0.5);

      // ===== 4 水汙染：優養化、塑膠垃圾 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 680, height: 560, rx: 16, ...FRAME }, P4);
      text(P4, 380, 110, '優養化', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: '#9be58c' });
      // 房子與排水管
      const house = at(P4, 120, 300, 1);
      el('rect', { x: -50, y: -60, width: 100, height: 70, fill: '#c9b89a', stroke: '#e8e0d0', 'stroke-width': 2 }, house);
      el('path', { d: 'M -62,-58 L 0,-110 L 62,-58 Z', fill: '#b04a3a' }, house);
      el('rect', { x: -14, y: -26, width: 28, height: 36, fill: '#6a4a2e' }, house);
      el('path', { d: 'M 120,306 L 190,306 L 190,330', fill: 'none', stroke: '#8a949c', 'stroke-width': 12 }, P4);
      el('path', { d: 'M 42,312 L 200,312 L 200,610 L 42,610 Z', fill: '#4a3a24' }, P4);
      // 池塘
      const pond = 'M 200,330 L 700,330 L 700,610 L 200,610 Z';
      const water = el('path', { d: pond, fill: '#2f6aa0' }, P4);
      const flow = el('path', { d: 'M 190,330 C 192,350 200,360 214,368', fill: 'none', stroke: '#b89a6a', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 }, P4);
      lines(P4, 220, 160, ['家庭廢水', '（含磷、氮等養分）'], { size: 22, gap: 30, fill: '#d9b98a', anchor: 'start' });
      el('path', { d: 'M 250,206 C 230,240 210,280 196,300', fill: 'none', stroke: '#d9b98a', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, P4);
      const algae = el('rect', { x: 200, y: 330, width: 500, height: 0, fill: '#4fae3a' }, P4);
      const algDots = g(P4, { opacity: 0 });
      const ra = S.rng(41);
      for (let i = 0; i < 60; i++) el('circle', { cx: 206 + ra() * 488, cy: 334 + ra() * 18, r: 3 + ra() * 3, fill: '#7fd05a' }, algDots);
      const bubbles = [];
      for (let i = 0; i < 10; i++) bubbles.push(el('circle', { cx: 260 + i * 44, cy: 420 + (i % 3) * 50, r: 6, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 2 }, P4));
      const fishes = [[330, 470, 1], [520, 430, -1], [600, 530, 1]].map(([x, y, d]) => { const q = at(P4, x, y, 1); const inner = at(q, 0, 0, 0.3); if (d < 0) inner.setAttribute('transform', 'scale(-0.3,0.3)'); B.smallFish(inner); return q; });
      const deadFish = [[300, 352], [420, 350], [540, 354]].map(([x, y]) => { const q = at(P4, x, y, 1); const inner = g(q, { transform: 'scale(0.3,-0.3)' }); B.fish(inner, { back: '#8a949c', mid: '#b8c0c6', belly: '#e0e4e6', fin: '#9aa4ab', edge: '#4a545c' }); q.style.opacity = 0; return q; });
      const o2meter = g(P4);
      text(o2meter, 680, 380, '水中的氧', { 'font-size': 20, 'text-anchor': 'end', fill: '#cfe8ff' });
      el('rect', { x: 600, y: 392, width: 80, height: 14, rx: 7, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 1.5 }, o2meter);
      const o2bar = el('rect', { x: 602, y: 394, width: 76, height: 10, rx: 5, fill: '#5fb8ff' }, o2meter);
      const steps4 = ['① 藻類大量繁殖', '② 藻類死亡，分解時用掉大量的氧', '③ 水中缺氧，魚蝦死亡'].map((s, i) => { const q = g(P4, { opacity: 0 }); S.pill(q, 380, 660, s, { size: 22, color: i === 2 ? '#ff8f9a' : '#9be58c', edge: i === 2 ? '#ff5f74' : '#6fae4a' }); return q; });
      // 右：塑膠垃圾
      el('rect', { x: 740, y: 70, width: 420, height: 560, rx: 16, fill: B.grad(P4, [[0, '#1f5a86'], [1, '#123a5a']]) }, P4);
      text(P4, 950, 110, '塑膠垃圾', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: '#8fd0ff' });
      B.turtle(at(P4, 880, 250, 0.95, -10));
      B.bag(at(P4, 1060, 230, 0.9));
      B.bottle(at(P4, 1090, 380, 0.7, 70));
      lines(P4, 950, 352, ['海龜可能把塑膠袋', '當成水母吃下'], { size: 22, gap: 30, fill: C.ink });
      const micro = g(P4, { opacity: 0 });
      const rm = S.rng(51);
      // 每一粒各自繞自己的中心轉（繞同一點轉會散到下面的字上）
      for (let i = 0; i < 26; i++) { const x = 790 + rm() * 300, y = 450 + rm() * 70, w = 3 + rm() * 5, h = 3 + rm() * 4; el('rect', { x, y, width: w, height: h, fill: ['#ff8f7a', '#8fd0ff', '#ffd166', '#ffffff'][i % 4], transform: `rotate(${(rm() * 90).toFixed(0)} ${(x + w / 2).toFixed(1)} ${(y + h / 2).toFixed(1)})` }, micro); }
      B.smallFish(at(micro, 1060, 480, 0.3));
      lines(micro, 950, 560, ['塑膠微粒（小於 5 mm）', '被小生物吃下，進入食物鏈'], { size: 22, gap: 30, fill: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, flow, 's4+=0.8', 0.4);
      S.show(tl, steps4[0], 's4+=1', 0.3);
      tl.fromTo(algae, { attr: { height: 0 } }, { attr: { height: 18 }, duration: 1, immediateRender: false }, 's4+=1.2');
      S.show(tl, algDots, 's4+=1.2', 1);
      S.hide(tl, steps4[0], 's4+=2.4', 0.2);
      S.show(tl, steps4[1], 's4+=2.6', 0.3);
      tl.fromTo(algae, { attr: { fill: '#4fae3a' } }, { attr: { fill: '#6a6a3a' }, duration: 0.8, immediateRender: false }, 's4+=2.6');
      tl.fromTo(water, { attr: { fill: '#2f6aa0' } }, { attr: { fill: '#3a5a4a' }, duration: 1.2, immediateRender: false }, 's4+=2.8');
      tl.fromTo(o2bar, { attr: { width: 76 } }, { attr: { width: 8 }, duration: 1.4, immediateRender: false }, 's4+=2.8');
      S.hide(tl, bubbles, 's4+=2.8', 1.2);
      S.hide(tl, steps4[1], 's4+=4.2', 0.2);
      S.show(tl, steps4[2], 's4+=4.4', 0.3);
      S.hide(tl, fishes, 's4+=4.4', 0.5);
      S.show(tl, deadFish, 's4+=4.6', 0.5);
      S.show(tl, micro, 's4+=5.2', 0.5);

      // ===== 5 外來入侵種 =====
      const P5 = g(root, { opacity: 0 });
      S.pill(P5, 600, 46, '外來種：因為人類活動，被帶到原本沒有分布的地方的生物', { size: 22, color: C.ink, edge: '#4a6272' });
      const sub5 = g(P5, { opacity: 0 });
      S.pill(sub5, 600, 96, '其中大量繁殖、危害原生生物的，稱為外來入侵種', { size: 22, color: '#ff9a8a', edge: '#ff7a66' });
      const KX = [160, 453, 746, 1039];
      const inv = [
        ['福壽螺', ['原產：南美洲', '約 1979～1980 年', '引進養殖，棄養後擴散', '啃食水稻秧苗等作物'], (q, x) => { el('path', { d: `M ${x - 110},330 L ${x + 110},330 L ${x + 110},356 L ${x - 110},356 Z`, fill: '#3a5a7a', opacity: 0.6 }, q); el('path', { d: `M ${x + 60},330 L ${x + 64},210`, stroke: '#6fae4a', 'stroke-width': 5 }, q); B.eggs(at(q, x + 62, 250, 0.9)); B.snail(at(q, x - 20, 334, 1)); }],
        ['小花蔓澤蘭', ['原產：中南美洲', '蔓延得很快', '覆蓋在其他植物上，', '使它們照不到光而死亡'], (q, x) => { B.mikania(at(q, x, 352, 1), { h: 185 }); }],
        ['埃及聖䴉', ['原產：非洲', '私人動物園引進後', '逃到野外大量繁殖，', '和鷺鷥爭奪食物和巢位'], (q, x) => { B.wader(at(q, x - 6, 258, 0.6), { kind: 'ibis' }); }],
        ['銀合歡', ['原產：中美洲', '早年引進作飼料、薪柴', '在恆春半島長成大片', '純林，排擠原生植物'], (q, x) => { B.leucaena(at(q, x, 352, 1), { h: 210 }); }],
      ].map(([name, ls, draw], i) => {
        const q = g(P5, { opacity: 0 }), x = KX[i];
        el('rect', { x: x - 140, y: 130, width: 280, height: 500, rx: 14, ...FRAME }, q);
        draw(q, x);
        text(q, x, 404, name, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ff9a8a' });
        lines(q, x, 448, ls, { size: 21, gap: 34, fill: C.ink2 });
        return q;
      });
      const p5b = g(P5, { opacity: 0 });
      S.pill(p5b, 600, 676, '不隨意放生、棄養寵物，才不會製造新的外來入侵種', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, sub5, 's5+=0.9', 0.4);
      inv.forEach((c, i) => S.show(tl, c, `s5+=${1.4 + i * 0.7}`, 0.5));
      S.show(tl, p5b, 's5+=4.4', 0.4);

      // ===== 6 生物放大作用 =====
      const P6 = g(root, { opacity: 0 });
      S.pill(P6, 600, 46, '難分解、不易排出的物質：例如 DDT（殺蟲劑）、汞和鎘（重金屬）', { size: 22, color: '#ffb35c', edge: '#ffb35c' });
      const COLX = [130, 352, 574, 796, 1040];
      const NAMES = ['水', '浮游植物', '小魚', '大魚', '水鳥'];
      const AMT = [null, 2, 6, 18, 54];
      el('rect', { x: 40, y: 140, width: 180, height: 220, rx: 12, fill: '#2f6aa0' }, P6);
      const rw = S.rng(61);
      const waterDots = g(P6);
      for (let i = 0; i < 5; i++) el('circle', { cx: 60 + rw() * 140, cy: 160 + rw() * 180, r: 4, fill: '#ff5f74' }, waterDots);
      [0, 1, 2].forEach((k) => B.plankton(at(P6, 352 + (k - 1) * 46, 250 + (k % 2) * 30, 2), k));
      B.smallFish(at(P6, 574, 250, 0.7));
      B.bigFish(at(P6, 812, 250, 0.9));
      B.wader(at(P6, 1030, 268, 0.62));
      NAMES.forEach((s, i) => text(P6, COLX[i], 396, s, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 }));
      [0, 1, 2, 3].forEach((i) => arrow(P6, COLX[i] + (i === 3 ? 110 : i ? 70 : 96), 250, COLX[i + 1] - (i === 3 ? 80 : 70), 250, C.ink2, 4, 14));
      text(P6, 248, 232, '吸收', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      [463, 685, 933].forEach((x) => text(P6, x, 232, '被吃', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }));
      // 下方：每一個個體體內的量
      text(P6, 130, 470, '水中的', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(P6, 130, 500, '濃度很低', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const badges = AMT.map((n, i) => {
        if (!n) return null;
        const q = g(P6, { opacity: 0 }), x = COLX[i], R2 = 70;
        el('circle', { cx: x, cy: 500, r: R2, fill: '#16293a', stroke: '#4a6272', 'stroke-width': 2 }, q);
        const rb = S.rng(70 + i);
        for (let k = 0; k < n; k++) { let dx, dy; do { dx = (rb() * 2 - 1) * (R2 - 10); dy = (rb() * 2 - 1) * (R2 - 10); } while (dx * dx + dy * dy > (R2 - 10) ** 2); el('circle', { cx: x + dx, cy: 500 + dy, r: n > 30 ? 4.5 : 5.5, fill: '#ff5f74' }, q); }
        S.pill(q, x, 600, `${n}＊`, { size: 24, color: '#ff8f9a', edge: '#ff5f74' });
        return q;
      });
      text(P6, 600, 660, '每個個體體內累積的有毒物質（紅點，數量是示意）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const p6b = g(P6, { opacity: 0 });
      S.pill(p6b, 600, 700, '越上層的消費者，體內濃度越高：生物放大作用', { size: 22, color: C.hi, edge: C.hi });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      badges.forEach((b, i) => b && S.show(tl, b, `s6+=${0.8 + i * 0.7}`, 0.4));
      S.show(tl, p6b, 's6+=4', 0.4);

      return {
        tl,
        notes: [
          '＊世界人口為約略值（聯合國估計）：1800 年約 10 億，2022 年約 80 億。＊示意：右圖的開發情形經過簡化。道路也會造成「路殺」，例如石虎過馬路被車撞。',
          '＊示意：魚的數量和時間都是示意。除了捕撈，過度採集野生植物、獵捕野生動物也屬於過度利用。',
          '＊示意：分子畫得很大。溫室效應本來就存在，使地球保持適合生物生存的溫度；溫室氣體（二氧化碳、甲烷等）增加，使溫室效應增強，才造成全球暖化。',
          '＊臭氧層在高空（平流層），能吸收大部分的紫外線。1987 年《蒙特婁議定書》限用氟氯碳化物；依聯合國的評估，南極上空的臭氧層約在 2066 年恢復（約）。＊示意：圖中的位置與大小都經過簡化。',
          '＊示意：時間被縮短，真實的優養化可能要幾天到幾週。塑膠微粒的大小一般指小於 5 mm 的塑膠碎片。',
          '＊這些年份、來源為約略的說法（林業及自然保育署、農業部等資料）。埃及聖䴉自 2019 年起大規模移除，已移除約 1.8 萬隻，數量大幅減少（約）。銀合歡會分泌含羞草素，抑制其他植物生長（補充）。',
          '＊示意：數量是示意。真實的例子中，從水到吃魚的鳥，DDT 的濃度可以相差到數百萬倍以上（約）。因為每一層的消費者一生要吃下許多下一層的生物，這些物質又難以分解、排出，就一層層累積。',
        ],
        steps: [
          '人口增加，需要更多土地和資源。開發使森林等棲地變小（<b>棲地破壞</b>），還被道路切成一小塊一小塊（<b>棲地破碎化</b>），生物難以生存和移動。',
          '<b>過度利用</b>：捕撈、採集或獵捕的速度比生物繁殖的速度快，族群就會越來越少，甚至滅絕。',
          '燃燒化石燃料、砍伐森林，使大氣中的二氧化碳等<b>溫室氣體</b>增加，留住更多的熱，造成<b>全球暖化</b>，影響許多生物的生存。',
          '<b>氟氯碳化物</b>會破壞臭氧層，使更多紫外線到達地面；燃燒煤和石油產生的氣體溶在雨水中，形成<b>酸雨</b>，傷害生物。',
          '家庭廢水中的磷、氮使藻類大量繁殖，最後水中缺氧、魚蝦死亡，稱為<b>優養化</b>。塑膠垃圾和<b>塑膠微粒</b>也會危害水中生物。',
          '因人類活動被帶到新地方的生物是<b>外來種</b>；大量繁殖、危害原生生物的，稱為<b>外來入侵種</b>，例如福壽螺、小花蔓澤蘭。',
          '難分解、不易排出的物質，會沿著食物鏈一層層累積，越上層的消費者體內濃度越高，稱為<b>生物放大作用</b>。',
        ],
      };
    },
  });
})();
