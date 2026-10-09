/* 2-3 光合作用：在哪裡進行（跨尺度）、原料與產物、葉的構造、遮光實驗、水蘊草實驗、養分的去向 */
(() => {
  const { el, g, text, C } = S;
  const LEAF = '#4fae4a', LEAF_D = '#2f7a3a', CHL = '#6fce62', O2 = C.oxygen, CO2 = C.co2, H2O = C.water, GLU = C.sugar;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };

  // 葉片：中心在 (0,0)，寬 w、高 h
  const leafD = (w, h) => `M ${-w / 2},0 C ${-w / 4},${-h / 2} ${w / 4},${-h / 2} ${w / 2},0 C ${w / 4},${h / 2} ${-w / 4},${h / 2} ${-w / 2},0 Z`;
  function leaf(p, x, y, w, h, { r = 0, fill = LEAF, veins = true, vein = '#a8e39a' } = {}) {
    const lg = S.place(g(p), { x, y, r });
    const body = el('path', { d: leafD(w, h), fill, stroke: LEAF_D, 'stroke-width': Math.max(2, w / 80) }, lg);
    if (veins) {
      el('line', { x1: -w / 2 + 4, y1: 0, x2: w / 2 - 6, y2: 0, stroke: vein, 'stroke-width': Math.max(1.5, w / 90) }, lg);
      for (let i = 1; i <= 3; i++) {
        const vx = -w / 2 + (w * i) / 4.2;
        [-1, 1].forEach((s) => el('path', { d: `M ${vx},0 Q ${vx + w * 0.06},${s * h * 0.16} ${vx + w * 0.13},${s * h * 0.3}`, fill: 'none', stroke: vein, 'stroke-width': Math.max(1.2, w / 140) }, lg));
      }
    }
    lg.body = body;
    return lg;
  }
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const mol = (p, x, y, label, fill, r = 22) => {
    const m = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 2 }, m);
    text(m, 0, 6, label, { 'font-size': 16, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 });
    return m;
  };
  const flame = (p, x, y, s = 1) => {
    const f = S.place(g(p), { x, y, s });
    el('path', { d: 'M 0,0 C -16,-10 -12,-30 0,-48 C 12,-30 16,-10 0,0 Z', fill: '#ff8a3c' }, f);
    el('path', { d: 'M 0,-2 C -7,-8 -6,-20 0,-30 C 6,-20 7,-8 0,-2 Z', fill: '#ffd166' }, f);
    return f;
  };

  S.register({
    id: 'photo', section: '2-3', title: '光合作用',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 跨尺度：植物 → 葉 → 葉肉細胞 → 葉綠體 =====
      const P0 = g(root);
      const FX = [40, 330, 620, 910], FW = 250, FY = 110, FH = 400;
      const frames = FX.map((x, i) => {
        const f = g(P0, { opacity: 0 });
        el('rect', { x, y: FY, width: FW, height: FH, rx: 16, ...FRAME }, f);
        return f;
      });
      // 植物
      const pl = frames[0];
      el('path', { d: 'M 120,440 L 210,440 L 200,490 L 130,490 Z', fill: '#b0703c' }, pl);
      el('path', { d: 'M 165,440 C 160,360 172,280 166,190', fill: 'none', stroke: '#6fae4a', 'stroke-width': 7, 'stroke-linecap': 'round' }, pl);
      [[140, 390, 70, 30, -20], [196, 350, 74, 32, 22], [138, 300, 68, 28, -26], [198, 256, 72, 30, 18], [150, 214, 60, 26, -30], [184, 190, 54, 24, 30]]
        .forEach(([x, y, w, h, r]) => leaf(pl, x, y, w, h, { r, veins: false }));
      // 葉
      const lf = frames[1];
      el('path', { d: 'M 455,470 C 452,440 455,420 455,405', fill: 'none', stroke: '#6fae4a', 'stroke-width': 6, 'stroke-linecap': 'round' }, lf);
      leaf(lf, 455, 290, 300, 160, { r: -90 });
      // 葉肉細胞
      const cl = frames[2];
      el('rect', { x: 680, y: 140, width: 130, height: 340, rx: 34, fill: 'rgba(217,194,124,0.12)', stroke: C.wall, 'stroke-width': 6 }, cl);
      el('rect', { x: 690, y: 150, width: 110, height: 320, rx: 26, fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 2.5 }, cl);
      el('rect', { x: 712, y: 196, width: 66, height: 230, rx: 26, fill: 'rgba(98,168,255,0.22)', stroke: C.vacuole, 'stroke-width': 2 }, cl);
      el('circle', { cx: 745, cy: 172, r: 16, fill: 'rgba(167,150,255,0.5)', stroke: C.nucleus, 'stroke-width': 2.5 }, cl);
      const cps = [];
      for (let i = 0; i < 7; i++) [700, 790].forEach((x) => cps.push([x, 200 + i * 38]));
      [[730, 444], [760, 444]].forEach((p) => cps.push(p));
      cps.forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 8, ry: 14, fill: CHL, stroke: '#2f7a3a', 'stroke-width': 1.5 }, cl));
      // 葉綠體
      const ch = frames[3];
      const chG = S.place(g(ch), { x: 1035, y: 300, r: -12 });
      el('ellipse', { cx: 0, cy: 0, rx: 112, ry: 66, fill: '#5fbf5a', stroke: '#2f7a3a', 'stroke-width': 4 }, chG);
      el('ellipse', { cx: 0, cy: 0, rx: 102, ry: 57, fill: '#9be58c', opacity: 0.55 }, chG);
      [-64, -30, 4, 38, 70].forEach((x, i) => {
        const yy = i % 2 ? 14 : -12;
        for (let k = 0; k < 4; k++) el('rect', { x: x - 14, y: yy - 16 + k * 9, width: 28, height: 7, rx: 3.5, fill: '#2f8a3a' }, chG);
        if (i < 4) el('line', { x1: x + 14, y1: yy, x2: x + 20, y2: i % 2 ? -12 : 14, stroke: '#2f8a3a', 'stroke-width': 3 }, chG);
      });
      text(ch, 1035, 420, '含有葉綠素', { 'font-size': 22, 'text-anchor': 'middle', fill: CHL });
      text(ch, 1035, 450, '能吸收光', { 'font-size': 22, 'text-anchor': 'middle', fill: CHL });
      // 名稱與大小
      [['植物', '約 30 cm＊'], ['葉', '約 5 cm＊'], ['葉肉細胞', '約 50 μm＊'], ['葉綠體', '約 5 μm＊']].forEach(([n, s], i) => {
        const cx = FX[i] + FW / 2;
        text(frames[i], cx, 556, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        S.pill(frames[i], cx, 600, s, { size: 22, color: C.hi });
      });
      // 放大框與連線
      const zooms = [[[194, 236, 52], 1], [[452, 236, 40], 2], [[778, 232, 40], 3]].map(([[x, y, s], j]) => {
        const zg = g(P0, { opacity: 0 });
        el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zg);
        [[y - s / 2, FY], [y + s / 2, FY + FH]].forEach(([y1, y2]) => el('line', { x1: x + s / 2, y1, x2: FX[j], y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zg));
        return zg;
      });
      tl.addLabel('s0');
      S.show(tl, frames[0], 's0+=0.2', 0.5);
      zooms.forEach((z, i) => { S.show(tl, z, `s0+=${0.9 + i * 1.1}`, 0.4); S.show(tl, frames[i + 1], `s0+=${1.2 + i * 1.1}`, 0.5); });

      // ===== 1 原料與產物 =====
      const P1 = g(root, { opacity: 0 });
      el('path', { d: 'M 600,440 C 598,500 600,560 600,610', fill: 'none', stroke: '#6fae4a', 'stroke-width': 10, 'stroke-linecap': 'round' }, P1);
      leaf(P1, 600, 300, 440, 260);
      const cpI = S.place(g(P1), { x: 600, y: 300 });
      el('ellipse', { cx: 0, cy: 0, rx: 62, ry: 38, fill: '#2f7a3a', stroke: '#9be58c', 'stroke-width': 3 }, cpI);
      text(cpI, 0, 8, '葉綠體', { 'font-size': 22, 'text-anchor': 'middle', fill: '#e8ffe0', 'font-weight': 700 });
      // 太陽
      const sun = g(P1);
      el('circle', { cx: 130, cy: 120, r: 46, fill: C.hi }, sun);
      const rays = [0, 1, 2].map((i) => el('line', { x1: 180 + i * 10, y1: 140 + i * 26, x2: 430 + i * 30, y2: 210 + i * 40, stroke: C.hi, 'stroke-width': 5, 'stroke-dasharray': '14 10', opacity: 0.8 }, sun));
      text(sun, 130, 200, '光能', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      // 二氧化碳：從左邊空氣進入
      const co2 = [0, 1, 2].map((i) => mol(P1, 0, 0, 'CO₂', CO2));
      const co2Path = (i, u) => ({ x: S.lerp(110, 520, u), y: S.lerp(330 + i * 56, 300 + (i - 1) * 24, u) });
      text(P1, 110, 470, '二氧化碳', { 'font-size': 26, 'text-anchor': 'middle', fill: CO2, 'font-weight': 700 });
      text(P1, 110, 502, '從空氣經氣孔進入', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 水：從莖往上
      const h2o = [0, 1, 2].map(() => mol(P1, 0, 0, 'H₂O', H2O));
      text(P1, 700, 590, '水', { 'font-size': 26, 'fill': H2O, 'font-weight': 700 });
      text(P1, 730, 590, '從根吸收、經葉脈運來', { 'font-size': 20, fill: C.mute });
      // 產物：氧往右出去、葡萄糖留在葉中
      const o2 = [0, 1, 2].map(() => mol(P1, 0, 0, 'O₂', O2));
      text(P1, 1090, 250, '氧', { 'font-size': 26, 'text-anchor': 'middle', fill: O2, 'font-weight': 700 });
      text(P1, 1090, 282, '經氣孔釋出', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const glus = [0, 1, 2, 3].map((i) => { const h = S.place(g(P1, { opacity: 0 }), { x: 548 + i * 34, y: 380 }); el('path', { d: hexD(15), fill: 'rgba(255,207,92,0.25)', stroke: GLU, 'stroke-width': 4 }, h); return h; });
      const gluLbl = text(P1, 600, 430, '葡萄糖（可轉變成澱粉儲存）', { 'font-size': 22, 'text-anchor': 'middle', fill: GLU, 'font-weight': 700, opacity: 0 });
      // 反應式
      const eq = g(P1, { opacity: 0 });
      el('rect', { x: 150, y: 620, width: 900, height: 84, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, eq);
      text(eq, 330, 672, '二氧化碳 ＋ 水', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      el('line', { x1: 460, y1: 662, x2: 700, y2: 662, stroke: C.ink, 'stroke-width': 3 }, eq);
      el('path', { d: 'M 700,662 l -14,-8 l 0,16 Z', fill: C.ink }, eq);
      text(eq, 580, 650, '光', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      text(eq, 580, 690, '葉綠體', { 'font-size': 22, 'text-anchor': 'middle', fill: CHL });
      text(eq, 860, 672, '葡萄糖 ＋ 氧', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      rays.forEach((r) => tl.fromTo(r, { attr: { 'stroke-dashoffset': 48 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 3, ease: 'none', immediateRender: false }, 's1+=0.6'));
      S.drive(tl, (u) => {
        co2.forEach((m, i) => { const k = S.clamp(u * 1.4 - i * 0.15); S.place(m, co2Path(i, k)); m.style.opacity = k >= 1 ? 0 : 1; });
        h2o.forEach((m, i) => { const k = S.clamp(u * 1.4 - i * 0.15); S.place(m, { x: 600 + (i - 1) * 4, y: S.lerp(600, 350, k) }); m.style.opacity = k >= 1 ? 0 : 1; });
      }, 2.4, 's1+=0.7', 'power1.inOut');
      S.drive(tl, (u) => {
        o2.forEach((m, i) => { const k = S.clamp(u * 1.4 - i * 0.15); S.place(m, { x: S.lerp(680, 1090, k), y: S.lerp(280, 330 + (i - 1) * 60, k) }); m.style.opacity = k <= 0 ? 0 : 1; });
      }, 2.4, 's1+=3.1', 'power1.inOut');
      glus.forEach((h, i) => S.show(tl, h, `s1+=${3.1 + i * 0.25}`, 0.3));
      S.show(tl, gluLbl, 's1+=4', 0.4);
      S.show(tl, eq, 's1+=4.6', 0.5);

      // ===== 2 葉的構造（橫切面）=====
      const P2 = g(root, { opacity: 0 });
      const X0 = 90, X1 = 820;
      el('rect', { x: X0, y: 140, width: X1 - X0, height: 12, fill: 'rgba(207,232,255,0.35)' }, P2); // 角質層
      for (let x = X0; x < X1; x += 58) el('rect', { x: x + 2, y: 154, width: 54, height: 44, rx: 6, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, P2);
      const rp = S.rng(11);
      for (let x = X0; x < X1 - 30; x += 50) {
        el('rect', { x: x + 3, y: 204, width: 44, height: 140, rx: 14, fill: '#1c3a2c', stroke: '#6fce62', 'stroke-width': 2 }, P2);
        for (let k = 0; k < 5; k++) [x + 12, x + 38].forEach((cx) => el('ellipse', { cx, cy: 222 + k * 26, rx: 6, ry: 9, fill: CHL }, P2));
      }
      // 海綿狀的葉肉（有空隙）
      for (let i = 0; i < 26; i++) {
        const cx = X0 + 30 + (i % 13) * 58 + rp() * 10, cy = 392 + Math.floor(i / 13) * 74 + rp() * 8;
        if (Math.abs(cx - 470) < 70) continue; // 葉脈的位置
        el('ellipse', { cx, cy, rx: 24 + rp() * 6, ry: 22 + rp() * 6, fill: '#1c3a2c', stroke: '#6fce62', 'stroke-width': 2 }, P2);
        el('ellipse', { cx: cx - 8, cy: cy - 6, rx: 5, ry: 8, fill: CHL }, P2);
        el('ellipse', { cx: cx + 9, cy: cy + 6, rx: 5, ry: 8, fill: CHL }, P2);
      }
      // 葉脈（維管束）
      el('circle', { cx: 470, cy: 430, r: 58, fill: '#2e2a1c', stroke: '#d9c27c', 'stroke-width': 3 }, P2);
      for (let i = 0; i < 14; i++) { const a = i * 2.4, rr = 12 + (i % 3) * 14; el('circle', { cx: 470 + Math.cos(a) * rr, cy: 430 + Math.sin(a) * rr, r: 8, fill: 'none', stroke: '#d9c27c', 'stroke-width': 2 }, P2); }
      // 下表皮與氣孔
      const ST = [300, 680];
      for (let x = X0; x < X1; x += 58) { if (ST.some((s) => Math.abs(x + 29 - s) < 50)) continue; el('rect', { x: x + 2, y: 518, width: 54, height: 40, rx: 6, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, P2); }
      ST.forEach((s) => {
        el('rect', { x: s - 72, y: 518, width: 24, height: 40, rx: 6, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, P2);
        el('rect', { x: s + 48, y: 518, width: 24, height: 40, rx: 6, fill: '#1d3442', stroke: '#7fb7c9', 'stroke-width': 2 }, P2);
        [-1, 1].forEach((d) => {
          el('path', { d: `M ${s + d * 12},520 C ${s + d * 42},516 ${s + d * 46},560 ${s + d * 12},556 C ${s + d * 20},546 ${s + d * 20},530 ${s + d * 12},520 Z`, fill: '#1c3a2c', stroke: '#6fce62', 'stroke-width': 2.5 }, P2);
          el('ellipse', { cx: s + d * 28, cy: 538, rx: 4, ry: 6, fill: CHL }, P2);
        });
      });
      el('rect', { x: X0, y: 560, width: X1 - X0, height: 8, fill: 'rgba(207,232,255,0.3)' }, P2);
      // 氣體進出
      const gas2 = [0, 1].map((k) => ({ c: mol(P2, 0, 0, 'CO₂', CO2, 18), o: mol(P2, 0, 0, 'O₂', O2, 18) }));
      text(P2, 470, 690, '葉片橫切面（示意）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 靜態標示：二氧化碳進、氧出
      const io = g(P2, { opacity: 0 });
      [[ST[0] - 34, 1, CO2, '二氧化碳'], [ST[0] + 34, -1, O2, '氧']].forEach(([x, dir, col, s]) => {
        const y1 = dir > 0 ? 640 : 582, y2 = dir > 0 ? 582 : 640;
        el('line', { x1: x, y1, x2: x, y2, stroke: col, 'stroke-width': 4 }, io);
        el('path', { d: `M ${x},${y2} l -8,${dir * 12} l 16,0 Z`, fill: col }, io);
        text(io, x + (dir > 0 ? -12 : 12), 660, s, { 'font-size': 20, 'text-anchor': dir > 0 ? 'end' : 'start', fill: col, 'font-weight': 700 });
      });
      const lab2 = [
        [400, 146, 1010, 120, '角質層：減少水分散失', '#cfe8ff'],
        [560, 176, 1010, 180, '表皮：保護（大多沒有葉綠體）', '#7fb7c9'],
        [800, 280, 1010, 270, '葉肉：含許多葉綠體', CHL],
        [500, 410, 1010, 380, '葉脈：運輸水分和養分', '#d9c27c'],
        [680, 548, 1010, 500, '氣孔：氣體進出', C.ink],
        [710, 538, 1010, 580, '保衛細胞：控制氣孔開閉', CHL],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P2, tx, ty, x, y, s, c, { size: 22 }));
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      lab2.forEach((l, i) => S.show(tl, l, `s2+=${0.8 + i * 0.45}`, 0.35));
      S.show(tl, io, 's2+=3.4', 0.4);
      S.drive(tl, (u) => {
        gas2.forEach(({ c, o }, i) => {
          const s = ST[i], k = S.clamp(u * 1.3 - i * 0.2);
          S.place(c, { x: s, y: S.lerp(660, 380, k) }); c.style.opacity = k > 0 && k < 1 ? 1 : 0;
          const k2 = S.clamp(u * 1.3 - 0.3 - i * 0.2);
          S.place(o, { x: s + 6, y: S.lerp(470, 660, k2) }); o.style.opacity = k2 > 0 && k2 < 1 ? 1 : 0;
        });
      }, 3.6, 's2+=3.6', 'none');

      // ===== 3 遮光實驗 =====
      const P3 = g(root, { opacity: 0 });
      const CX = (i) => 132 + i * 234;
      const cards = ['① 放在暗處一天|消耗原有的澱粉', '② 部分遮光|照光數小時', '③ 放入熱水中煮|破壞細胞', '④ 酒精隔水加熱|溶出葉綠素', '⑤ 清水沖洗後|滴入碘液'].map((s, i) => {
        const c = g(P3, { opacity: 0 });
        el('rect', { x: CX(i) - 108, y: 80, width: 216, height: 230, rx: 16, ...FRAME }, c);
        const [a, b] = s.split('|');
        text(c, CX(i), 346, a, { 'font-size': 23, 'text-anchor': 'middle', 'font-weight': 700 });
        text(c, CX(i), 376, b, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        return c;
      });
      // ①
      el('rect', { x: CX(0) - 80, y: 110, width: 160, height: 180, rx: 8, fill: '#060b10', stroke: '#4a6272', 'stroke-width': 2 }, cards[0]);
      el('path', { d: `M ${CX(0) - 30},280 L ${CX(0) + 30},280 L ${CX(0) + 24},250 L ${CX(0) - 24},250 Z`, fill: '#6b4a2c' }, cards[0]);
      el('line', { x1: CX(0), y1: 250, x2: CX(0), y2: 170, stroke: '#3f6e3a', 'stroke-width': 4 }, cards[0]);
      leaf(cards[0], CX(0) - 24, 200, 50, 24, { r: -25, fill: '#2f5a2e', veins: false });
      leaf(cards[0], CX(0) + 24, 180, 50, 24, { r: 25, fill: '#2f5a2e', veins: false });
      el('path', { d: `M ${CX(0) + 50},124 a 16,16 0 1,0 12,26 a 13,13 0 1,1 -12,-26 Z`, fill: '#ffe9a8' }, cards[0]);
      // ②
      el('circle', { cx: CX(1) - 70, cy: 112, r: 18, fill: C.hi }, cards[1]);
      leaf(cards[1], CX(1), 210, 170, 92);
      el('rect', { x: CX(1) - 24, y: 162, width: 48, height: 96, fill: '#c9d2d8', stroke: '#eef3f6', 'stroke-width': 2 }, cards[1]);
      text(cards[1], CX(1), 290, '鋁箔紙', { 'font-size': 18, 'text-anchor': 'middle', fill: '#c9d2d8' });
      // ③
      el('path', { d: `M ${CX(2) - 70},130 L ${CX(2) - 70},262 Q ${CX(2) - 70},270 ${CX(2) - 62},270 L ${CX(2) + 62},270 Q ${CX(2) + 70},270 ${CX(2) + 70},262 L ${CX(2) + 70},130`, fill: 'rgba(95,184,255,0.18)', stroke: '#cfe8ff', 'stroke-width': 3 }, cards[2]);
      leaf(cards[2], CX(2), 216, 100, 50, { r: 15, fill: '#3f8a3a' });
      flame(cards[2], CX(2), 302, 0.6);
      [CX(2) - 30, CX(2) + 28].forEach((x) => el('path', { d: `M ${x},126 q -8,-10 0,-20 q 8,-10 0,-20`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 2.5, opacity: 0.6 }, cards[2]));
      // ④
      el('path', { d: `M ${CX(3) - 84},120 L ${CX(3) - 84},264 Q ${CX(3) - 84},272 ${CX(3) - 76},272 L ${CX(3) + 76},272 Q ${CX(3) + 84},272 ${CX(3) + 84},264 L ${CX(3) + 84},120`, fill: 'rgba(95,184,255,0.16)', stroke: '#cfe8ff', 'stroke-width': 3 }, cards[3]);
      const alc = el('rect', { x: CX(3) - 40, y: 150, width: 80, height: 110, rx: 6, fill: 'rgba(240,240,230,0.25)', stroke: '#cfe8ff', 'stroke-width': 2.5 }, cards[3]);
      const leaf4 = leaf(cards[3], CX(3), 214, 66, 34, { r: 70, fill: '#3f8a3a' });
      text(cards[3], CX(3), 142, '酒精', { 'font-size': 18, 'text-anchor': 'middle', fill: C.mute });
      flame(cards[3], CX(3), 304, 0.6);
      // ⑤
      el('ellipse', { cx: CX(4), cy: 250, rx: 92, ry: 26, fill: '#dfe7ea' }, cards[4]);
      const leaf5 = leaf(cards[4], CX(4), 236, 150, 70, { fill: '#efe6b4', vein: '#d7cc95' });
      el('path', { d: leafD(150, 70) }, el('clipPath', { id: 'ph3clip5' }, el('defs', {}, P3)));
      const band5 = el('rect', { x: -17, y: -40, width: 34, height: 80, fill: '#d9a54a', opacity: 0, 'clip-path': 'url(#ph3clip5)' }, leaf5);
      const drop5 = el('ellipse', { cx: CX(4) - 40, cy: 160, rx: 6, ry: 9, fill: '#b5651d', opacity: 0 }, cards[4]);
      el('path', { d: `M ${CX(4) - 45},100 L ${CX(4) - 35},100 L ${CX(4) - 37},140 L ${CX(4) - 43},140 Z`, fill: 'rgba(200,230,255,0.4)', stroke: '#cfe8ff', 'stroke-width': 2 }, cards[4]);
      el('rect', { x: CX(4) - 49, y: 84, width: 18, height: 18, rx: 6, fill: '#d0574a' }, cards[4]);
      // 結果
      const res3 = g(P3, { opacity: 0 });
      const big = leaf(res3, 330, 560, 420, 210, { fill: '#1f2a66', vein: '#3a4a8a' });
      el('path', { d: 'M -50,-92 L 50,-92 L 50,92 L -50,92 Z', fill: '#d9a54a', 'clip-path': 'url(#ph3clip)' }, big);
      el('path', { d: leafD(420, 210) }, el('clipPath', { id: 'ph3clip' }, el('defs', {}, P3)));
      el('line', { x1: -206, y1: 0, x2: 204, y2: 0, stroke: '#3a4a8a', 'stroke-width': 4 }, big);
      S.callout(res3, 230, 520, 120, 440, '照光：藍黑色', '#8fa8ff', { size: 22 }).style.opacity = 1;
      S.callout(res3, 330, 600, 330, 700, '遮光：沒有變藍黑色', '#d9a54a', { size: 22 }).style.opacity = 1;
      const conc3 = g(P3, { opacity: 0 });
      S.pill(conc3, 860, 500, '照光部分有澱粉', { size: 28, color: '#8fa8ff', edge: '#8fa8ff' });
      S.pill(conc3, 860, 570, '光合作用需要光', { size: 30, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      cards.forEach((c, i) => S.show(tl, c, `s3+=${0.5 + i * 0.7}`, 0.4));
      tl.fromTo(leaf4.body, { attr: { fill: '#3f8a3a' } }, { attr: { fill: '#efe6b4' }, duration: 1, immediateRender: false }, 's3+=3');
      tl.fromTo(alc, { attr: { fill: 'rgba(240,240,230,0.25)' } }, { attr: { fill: 'rgba(80,180,70,0.55)' }, duration: 1, immediateRender: false }, 's3+=3');
      tl.fromTo(drop5, { attr: { cy: 150 }, opacity: 0 }, { attr: { cy: 226 }, opacity: 1, duration: 0.5, ease: 'power2.in', immediateRender: false }, 's3+=3.6');
      tl.to(drop5, { opacity: 0, duration: 0.1 }, 's3+=4.1');
      tl.fromTo(leaf5.body, { attr: { fill: '#efe6b4' } }, { attr: { fill: '#1f2a66' }, duration: 0.6, immediateRender: false }, 's3+=4.1');
      tl.fromTo(band5, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, 's3+=4.1');
      S.show(tl, res3, 's3+=4.6', 0.6);
      S.show(tl, conc3, 's3+=5.4', 0.5);

      // ===== 4 水蘊草實驗 =====
      const P4 = g(root, { opacity: 0 });
      // 燈
      el('path', { d: 'M 40,300 L 110,270 L 110,370 L 40,340 Z', fill: '#4a6272' }, P4);
      el('rect', { x: 20, y: 300, width: 24, height: 40, rx: 4, fill: '#3a4a56' }, P4);
      const glow = el('path', { d: 'M 110,270 L 230,220 L 230,420 L 110,370 Z', fill: C.hi, opacity: 0.18 }, P4);
      text(P4, 70, 410, '光源', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 燒杯＋水蘊草＋漏斗＋試管
      el('rect', { x: 236, y: 300, width: 328, height: 316, fill: 'rgba(95,184,255,0.16)' }, P4);
      el('path', { d: 'M 228,280 L 236,288 L 236,608 Q 236,616 244,616 L 556,616 Q 564,616 564,608 L 564,280', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, P4);
      text(P4, 400, 650, '燒杯：小蘇打水（提供二氧化碳）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      for (let i = 0; i < 5; i++) {
        const x = 340 + i * 30;
        el('path', { d: `M ${x},600 C ${x - 10},540 ${x + 10},480 ${x - 4 + (i % 2) * 8},430`, fill: 'none', stroke: '#4fae4a', 'stroke-width': 4 }, P4);
        for (let k = 0; k < 6; k++) [-1, 1].forEach((s) => el('ellipse', { cx: x + s * 9 + (k % 2) * 2, cy: 590 - k * 28, rx: 8, ry: 3.5, fill: '#6fce62', transform: `rotate(${s * -30} ${x + s * 9} ${590 - k * 28})` }, P4));
      }
      el('path', { d: 'M 300,600 L 380,410 L 380,330 M 500,600 L 420,410 L 420,330', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3.5 }, P4);
      // 倒置試管：上方收集氣體
      el('path', { d: 'M 378,340 L 378,110 C 378,86 422,86 422,110 L 422,340', fill: 'rgba(95,184,255,0.2)', stroke: '#cfe8ff', 'stroke-width': 3.5 }, P4);
      const gas = el('rect', { x: 380, y: 96, width: 40, height: 0, fill: '#0d1822' }, P4);
      const gasLbl = text(P4, 440, 130, '收集到的氣體', { 'font-size': 20, fill: C.ink2, opacity: 0 });
      const bub = Array.from({ length: 12 }, (_, i) => el('circle', { cx: 0, cy: 0, r: 5 + (i % 3), fill: 'none', stroke: '#e8f6ff', 'stroke-width': 2, opacity: 0 }, P4));
      // 線香測試
      const T4 = g(P4, { opacity: 0 });
      el('path', { d: 'M 800,620 L 800,330 C 800,306 860,306 860,330 L 860,620', transform: 'rotate(180 830 470)', fill: 'rgba(220,240,255,0.08)', stroke: '#cfe8ff', 'stroke-width': 3.5 }, T4);
      text(T4, 830, 660, '把收集到的氣體', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(T4, 830, 690, '用線香的餘燼測試', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const stick = S.place(g(T4), { x: 1010, y: 420, r: 20 });
      el('line', { x1: 0, y1: 0, x2: 0, y2: -260, stroke: '#a8742e', 'stroke-width': 6, 'stroke-linecap': 'round' }, stick);
      const ember = el('circle', { cx: 0, cy: 0, r: 7, fill: '#ff6b4a' }, stick);
      const fl4 = flame(stick, 0, -2, 0.7); fl4.style.opacity = 0;
      const res4 = g(P4, { opacity: 0 });
      S.pill(res4, 1010, 560, '餘燼復燃', { size: 28, color: C.hi, edge: C.hi });
      S.pill(res4, 1010, 620, '→ 氣體是氧', { size: 28, color: O2, edge: O2 });
      const tip4 = g(P4, { opacity: 0 });
      S.pill(tip4, 400, 40, '光越強（燈越近），氣泡越多', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        bub.forEach((b, i) => {
          const k = (u * 5 + i / bub.length) % 1, x = 340 + (i % 5) * 30 + Math.sin(k * 9 + i) * 4;
          const y = S.lerp(500 - (i % 4) * 20, 110 + u * 70, Math.min(1, k * 1.1));
          const inTube = k > 0.55;
          b.setAttribute('cx', inTube ? 400 + Math.sin(k * 20 + i) * 5 : S.lerp(x, 400, S.clamp((k - 0.3) / 0.25)));
          b.setAttribute('cy', y);
          b.style.opacity = u > 0.02 ? 0.9 : 0;
        });
        gas.setAttribute('height', u * 70);
      }, 5, 's4+=0.6', 'none');
      S.show(tl, gasLbl, 's4+=3', 0.4);
      S.show(tl, tip4, 's4+=1.2', 0.4);
      S.show(tl, T4, 's4+=5.6', 0.4);
      S.move(tl, stick, { x: 1010, y: 420, r: 20 }, { x: 830, y: 450, r: 0 }, 1.2, 's4+=6.2');
      tl.fromTo(fl4, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 's4+=7.5');
      tl.fromTo(ember, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's4+=7.5');
      S.show(tl, res4, 's4+=7.9', 0.4);

      // ===== 5 養分的去向 =====
      const P5 = g(root, { opacity: 0 });
      const hub = S.place(g(P5), { x: 600, y: 330 });
      el('path', { d: hexD(62), fill: 'rgba(255,207,92,0.18)', stroke: GLU, 'stroke-width': 6 }, hub);
      text(hub, 0, 10, '葡萄糖', { 'font-size': 30, 'text-anchor': 'middle', fill: GLU, 'font-weight': 700 });
      text(P5, 600, 430, '光合作用製造', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const arrow = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1), ag = g(P5, { opacity: 0 }); el('line', { x1, y1, x2, y2, stroke: C.ink2, 'stroke-width': 4 }, ag); el('path', { d: `M ${x2},${y2} l ${-16 * Math.cos(a - 0.4)},${-16 * Math.sin(a - 0.4)} l ${16 * Math.cos(a - 0.4) - 16 * Math.cos(a + 0.4)},${16 * Math.sin(a - 0.4) - 16 * Math.sin(a + 0.4)} Z`, fill: C.ink2 }, ag); return ag; };
      const ways = [];
      // 儲存成澱粉
      const w1 = g(P5, { opacity: 0 });
      el('ellipse', { cx: 160, cy: 300, rx: 54, ry: 40, fill: '#c9a05a', stroke: '#8a6a30', 'stroke-width': 3 }, w1);
      [[145, 290], [175, 310], [160, 280]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 3, fill: '#6b4a2c' }, w1));
      el('path', { d: 'M 230,330 C 250,290 300,284 320,300 C 300,330 260,346 230,330 Z', fill: '#b5487a' }, w1);
      for (let i = 0; i < 5; i++) el('ellipse', { cx: 132 + i * 26, cy: 372, rx: 9, ry: 5, fill: '#f6f2e6' }, w1);
      text(w1, 210, 220, '轉變成澱粉儲存', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      text(w1, 210, 420, '馬鈴薯、地瓜、米', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      ways.push([arrow(530, 330, 360, 310), w1]);
      // 構成身體
      const w2 = g(P5, { opacity: 0 });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) el('rect', { x: 900 + c * 52, y: 120 + r * 44, width: 48, height: 40, rx: 4, fill: 'rgba(217,194,124,0.15)', stroke: C.wall, 'stroke-width': 3 }, w2);
      text(w2, 978, 248, '構成身體', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      text(w2, 978, 280, '例如纖維素組成細胞壁', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      ways.push([arrow(670, 300, 870, 220), w2]);
      // 呼吸作用
      const w3 = g(P5, { opacity: 0 });
      el('path', { d: 'M 990,380 L 950,450 L 984,450 L 960,520 L 1020,430 L 986,430 L 1010,380 Z', fill: C.hi }, w3);
      text(w3, 985, 562, '呼吸作用分解', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      text(w3, 985, 594, '釋放能量，供生命活動使用', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      ways.push([arrow(670, 360, 920, 450), w3]);
      const food = g(P5, { opacity: 0 });
      S.pill(food, 600, 660, '動物直接或間接以植物為食，也得到這些養分和能量', { size: 24, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      ways.forEach(([a, w], i) => { S.show(tl, a, `s5+=${0.8 + i * 0.8}`, 0.3); S.show(tl, w, `s5+=${1 + i * 0.8}`, 0.4); });
      S.show(tl, food, 's5+=3.6', 0.5);

      // ===== 6 植物的養分從哪裡來？（柳樹實驗、肥料的迷思）=====
      const P6 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 80, width: 640, height: 560, rx: 18, ...FRAME }, P6);
      el('rect', { x: 710, y: 80, width: 450, height: 560, rx: 18, ...FRAME }, P6);
      text(P6, 360, 126, '范．海爾蒙特的柳樹實驗', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const pot = (x, y) => { const p = g(P6); el('path', { d: `M ${x - 70},${y} L ${x + 70},${y} L ${x + 56},${y + 90} L ${x - 56},${y + 90} Z`, fill: '#b0703c' }, p); el('rect', { x: x - 74, y: y - 10, width: 148, height: 14, rx: 4, fill: '#7a4a24' }, p); return p; };
      pot(170, 440); pot(520, 440);
      // 小柳樹
      el('path', { d: 'M 170,432 C 168,410 172,390 170,372', stroke: '#8a6a40', 'stroke-width': 5, fill: 'none' }, P6);
      [[160, 380, -30], [182, 376, 30], [170, 368, 0]].forEach(([x, y, r]) => leaf(P6, x, y, 26, 9, { r: r - 90, veins: false }));
      // 大柳樹
      const big6 = g(P6, { opacity: 0 });
      el('path', { d: 'M 520,432 C 512,360 528,280 520,190 M 520,300 C 480,270 460,240 450,210 M 522,260 C 560,230 580,206 590,180', stroke: '#8a6a40', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, big6);
      for (let i = 0; i < 26; i++) { const a = (i / 26) * 6.28, r = 60 + (i % 3) * 18; leaf(big6, 520 + Math.cos(a) * r, 230 + Math.sin(a) * r * 0.7, 30, 9, { r: (a * 180) / Math.PI, veins: false }); }
      const arr6 = g(P6, { opacity: 0 });
      el('line', { x1: 260, y1: 470, x2: 410, y2: 470, stroke: C.ink2, 'stroke-width': 4 }, arr6);
      el('path', { d: 'M 418,470 l -16,-9 l 0,18 Z', fill: C.ink2 }, arr6);
      text(arr6, 335, 456, '5 年，只澆水', { 'font-size': 22, 'text-anchor': 'middle', fill: C.water });
      text(P6, 170, 570, '柳樹約 2.3 kg＊', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const res6 = g(P6, { opacity: 0 });
      text(res6, 520, 570, '柳樹約 76.7 kg＊', { 'font-size': 24, 'text-anchor': 'middle', fill: CHL, 'font-weight': 700 });
      text(res6, 360, 610, '土壤只少了約 57 g＊', { 'font-size': 24, 'text-anchor': 'middle', fill: '#d9a066', 'font-weight': 700 });
      // 右：當時的想法 vs 現在的知識
      const think = g(P6, { opacity: 0 });
      text(think, 935, 130, '增加的質量從哪裡來？', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(think, 935, 186, '他當時認為：', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      S.pill(think, 935, 226, '全部來自水', { size: 26, color: C.water, edge: C.water });
      const know = g(P6, { opacity: 0 });
      text(know, 935, 300, '現在知道：', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      S.pill(know, 935, 342, '主要來自二氧化碳和水', { size: 26, color: C.hi, edge: C.hi });
      text(know, 935, 388, '（經由光合作用製造養分）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const fert = g(P6, { opacity: 0 });
      el('path', { d: 'M 790,450 L 860,450 L 868,560 L 782,560 Z', fill: '#4a7a9a', stroke: '#9cc6e0', 'stroke-width': 2 }, fert);
      text(fert, 825, 512, '肥料', { 'font-size': 22, 'text-anchor': 'middle', fill: '#e8f6ff', 'font-weight': 700 });
      text(fert, 890, 482, '主要提供礦物質', { 'font-size': 22, fill: C.ink });
      text(fert, 890, 516, '不是植物的能量來源', { 'font-size': 22, fill: C.ink });
      text(fert, 890, 550, '（養分要靠光合作用）', { 'font-size': 20, fill: C.mute });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      S.show(tl, arr6, 's6+=0.9', 0.4);
      S.show(tl, big6, 's6+=1.3', 0.8);
      S.show(tl, res6, 's6+=2.1', 0.5);
      S.show(tl, think, 's6+=2.9', 0.5);
      S.show(tl, know, 's6+=3.8', 0.5);
      S.show(tl, fert, 's6+=4.8', 0.5);

      return {
        tl,
        notes: [
          '＊大小為約略值，不同植物會有差異；圖中的細胞和葉綠體都簡化了。',
          '＊示意：分子都畫得很大，數量也是示意。有些課本把反應式寫成「…→ 葡萄糖＋氧＋水」。',
          '＊示意：葉片橫切面的細胞形狀和數目都簡化了。保衛細胞有葉綠體，也能進行光合作用；大多數陸生植物的氣孔，下表皮比上表皮多（可用鴨跖草的下表皮觀察）。',
          '＊先放暗處一天，是為了消耗葉片中原有的澱粉；酒精容易著火，所以要隔水加熱，不能直接加熱。',
          '＊示意：氣泡的大小和數量都是示意。',
          null,
          '＊17 世紀的實驗，數字是換算後的約略值。植物增加的質量，主要來自光合作用固定的二氧化碳和吸收的水；土壤減少的一點點，主要是礦物質。肥料太濃時，反而會讓根部細胞失水（滲透作用）。',
        ],
        steps: [
          '植物的綠色部分（主要是<b>葉</b>）含有<b>葉綠體</b>。從植物一路放大到葉肉細胞、再到葉綠體：光合作用就在<b>葉綠體</b>中進行。',
          '<b>光合作用</b>：葉綠體利用<b>光能</b>，把<b>二氧化碳</b>和<b>水</b>合成<b>葡萄糖</b>，並放出<b>氧</b>。光能轉變成化學能，儲存在養分中。',
          '葉的構造：<b>表皮</b>保護葉片；<b>葉肉</b>細胞含許多葉綠體，是光合作用的主要位置；<b>葉脈</b>運輸水分和養分；<b>氣孔</b>讓二氧化碳進入、氧離開。',
          '遮光實驗：照光的部分加碘液變<b>藍黑色</b>（有澱粉），遮光的部分沒有。表示光合作用<b>需要光</b>，製造的葡萄糖會轉變成<b>澱粉</b>儲存。',
          '水蘊草在光下會冒出氣泡。收集到的氣體能使<b>線香的餘燼復燃</b>，表示是<b>氧</b>。燈越近（光越強），氣泡越多。',
          '光合作用製造的葡萄糖：可以轉變成<b>澱粉</b>儲存、用來<b>構成身體</b>，或經由<b>呼吸作用</b>分解、釋放能量。',
          '植物的養分從哪裡來？范．海爾蒙特的柳樹長大了很多，土壤卻幾乎沒有減少。增加的質量主要來自<b>二氧化碳和水</b>；肥料主要提供<b>礦物質</b>，不是能量來源。',
        ],
      };
    },
  });
})();
