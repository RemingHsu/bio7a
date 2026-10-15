/* 6-3 體溫與血糖恆定：內溫與外溫動物（熱的來源、保溫構造）、外溫動物的行為調節、人體體溫調節、胰島素與升糖素（腎上腺素）、糖尿病、恆定的調節（神經與內分泌） */
(() => {
  const { el, g, text, C } = S;
  const ENDO = '#ff9a5c', ECTO = '#5fb8ff', INS = '#63d4bf', GLUC = '#c9a8ff', GLY = '#d9a066', HEAT = '#ff8a5c';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const GRID = '#22384a';
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const DROP = 'M 0,-10 C 6,-3 7,1 7,4 C 7,9 4,11 0,11 C -4,11 -7,9 -7,4 C -7,1 -6,-3 0,-10 Z';
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.7, y2: y2 - Math.sin(a) * head * 0.7, stroke: col, 'stroke-width': w }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  const glu = (p, x, y, r = 11) => el('path', { d: hexD(r), transform: `translate(${x},${y})`, fill: 'rgba(255,207,92,0.3)', stroke: C.sugar, 'stroke-width': 3 }, p);
  // 肝糖：許多葡萄糖連成的分枝
  const glycogen = (p, x, y) => { const gg = g(p); [[0, 0], [22, -8], [44, 0], [22, 14], [-22, -8], [-44, 0], [-22, 14], [0, 26]].forEach(([dx, dy], i, a) => { if (i) el('line', { x1: x + a[i - 1][0], y1: y + a[i - 1][1], x2: x + dx, y2: y + dy, stroke: GLY, 'stroke-width': 3 }, gg); glu(gg, x + dx, y + dy, 9); }); return gg; };
  const liverShape = (p, x, y, s = 1) => { const lg = S.place(g(p), { x, y, s }); el('path', { d: 'M -64,-16 C -36,-34 24,-32 46,-26 C 58,-22 60,-16 56,-10 C 40,2 18,18 2,28 C -16,38 -36,42 -48,38 C -64,32 -70,16 -68,2 Z', fill: '#7a3f31', stroke: '#c9785f', 'stroke-width': 3 }, lg); return lg; };
  const pancreas = (p, x, y) => { const pg = S.place(g(p), { x, y }); el('path', { d: 'M -90,10 C -70,-14 -20,-14 30,-22 C 60,-27 84,-26 90,-16 C 92,-4 70,0 46,4 C 0,14 -40,30 -76,30 C -92,30 -98,20 -90,10 Z', fill: '#e9c27a', stroke: '#f6dca6', 'stroke-width': 2 }, pg); [[-30, 6], [20, -6], [56, -10]].forEach(([dx, dy]) => el('circle', { cx: dx, cy: dy, r: 7, fill: '#ffeccc', stroke: '#c99a4a', 'stroke-width': 1.5 }, pg)); return pg; };
  const lizard = (p, x, y, s = 1, col = '#7a8a3a') => {
    const lz = S.place(g(p), { x, y, s });
    el('path', { d: 'M -70,0 C -60,-14 -40,-16 -20,-14 L 40,-12 C 60,-12 76,-6 84,0 C 76,6 60,12 40,12 L -20,14 C -40,16 -60,14 -70,0 Z', fill: col, stroke: '#d9e08a', 'stroke-width': 2.5 }, lz);
    el('path', { d: 'M 40,0 C 90,2 120,8 150,16', fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round' }, lz);
    [[-36, 1], [-36, -1], [24, 1], [24, -1]].forEach(([dx, sg]) => el('path', { d: `M ${dx},${sg * 10} L ${dx - 10},${sg * 28} L ${dx - 22},${sg * 30}`, fill: 'none', stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, lz));
    el('circle', { cx: -56, cy: -4, r: 3, fill: '#0d1822' }, lz);
    return lz;
  };
  const thermo = (p, x, y, h = 150) => {
    const tg = g(p);
    el('rect', { x: x - 10, y: y - h, width: 20, height: h, rx: 10, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, tg);
    el('circle', { cx: x, cy: y + 12, r: 16, fill: C.blood }, tg);
    const col = el('rect', { x: x - 5, y, width: 10, height: 0, fill: C.blood }, tg);
    return { set: (f) => { const hh = (h - 10) * f; col.setAttribute('y', y - hh); col.setAttribute('height', hh + 4); } };
  };

  S.register({
    id: 'homeo', section: '6-3', title: '體溫與血糖恆定',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 內溫動物與外溫動物 =====
      const P0 = g(root);
      const X0 = 130, X1 = 610, Y0 = 590, Y1 = 130; // 0～40 °C、0～45 °C
      const cx0 = (t) => X0 + (t / 40) * (X1 - X0), cy0 = (v) => Y0 - (v / 45) * (Y0 - Y1);
      for (let v = 0; v <= 40; v += 10) { el('line', { x1: X0, y1: cy0(v), x2: X1, y2: cy0(v), stroke: GRID, 'stroke-width': 1.5 }, P0); text(P0, X0 - 14, cy0(v) + 7, String(v), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute }); }
      for (let t = 0; t <= 40; t += 10) text(P0, cx0(t), Y0 + 32, String(t), { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      el('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.mute, 'stroke-width': 2 }, P0);
      text(P0, (X0 + X1) / 2, Y0 + 72, '環境溫度（°C）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P0, X0 - 60, Y1 - 30, '體溫（°C）＊', { 'font-size': 22, fill: C.ink2 });
      const lineD = (f) => { let d = ''; for (let t = 0; t <= 40; t += 1) d += (t ? 'L' : 'M') + `${cx0(t).toFixed(1)},${cy0(f(t)).toFixed(1)}`; return d; };
      const endo = el('path', { d: lineD((t) => 37 + 0.4 * Math.sin(t / 6)), fill: 'none', stroke: ENDO, 'stroke-width': 4 }, P0);
      const ecto = el('path', { d: lineD((t) => t + 2), fill: 'none', stroke: ECTO, 'stroke-width': 4 }, P0);
      const lEndo = text(P0, cx0(3), cy0(37) + 36, '內溫動物', { 'font-size': 24, fill: ENDO, 'font-weight': 700, opacity: 0 });
      const lEcto = text(P0, cx0(24), cy0(26) + 34, '外溫動物', { 'font-size': 24, fill: ECTO, 'font-weight': 700, opacity: 0 });
      // 卡片：名稱、例子、體溫、熱從哪裡來（＋保溫的構造）
      const cards0 = [
        [70, 290, '內溫動物（恆溫動物）', ENDO, '鳥類、哺乳類（包括人）', '體溫大致維持恆定', '熱：主要來自身體的代謝（呼吸作用）', '保溫：羽毛、毛髮、皮下脂肪'],
        [390, 250, '外溫動物（變溫動物）', ECTO, '魚類、兩生類、爬蟲類', '體溫隨環境溫度改變', '熱：主要從外界環境吸收', '例如曬太陽'],
      ].map(([y, h, title, col, a, b, heat, extra]) => {
        const cg = g(P0, { opacity: 0 });
        el('rect', { x: 690, y, width: 470, height: h, rx: 16, fill: '#122230', stroke: col, 'stroke-width': 2 }, cg);
        text(cg, 925, y + 48, title, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        text(cg, 925, y + 94, a, { 'font-size': 26, 'text-anchor': 'middle' });
        text(cg, 925, y + 136, b, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
        el('line', { x1: 714, y1: y + 156, x2: 1136, y2: y + 156, stroke: '#2b4252', 'stroke-width': 1.5 }, cg);
        // 小圖示：火焰（產熱）／太陽（吸熱）
        if (col === ENDO) el('path', { d: `M 724,${y + 196} C 712,${y + 184} 718,${y + 172} 726,${y + 164} C 726,${y + 174} 732,${y + 176} 734,${y + 170} C 744,${y + 182} 740,${y + 194} 730,${y + 198} Z`, fill: HEAT }, cg);
        else { el('circle', { cx: 728, cy: y + 186, r: 9, fill: C.hi }, cg); for (let k = 0; k < 8; k++) { const a2 = (k / 8) * 6.283; el('line', { x1: 728 + Math.cos(a2) * 12, y1: y + 186 + Math.sin(a2) * 12, x2: 728 + Math.cos(a2) * 17, y2: y + 186 + Math.sin(a2) * 17, stroke: C.hi, 'stroke-width': 2.5 }, cg); } }
        text(cg, 752, y + 194, heat, { 'font-size': 23, fill: C.ink, 'font-weight': 700 });
        text(cg, 752, y + 232, extra, { 'font-size': 23, fill: col === ENDO ? '#ffd0b0' : C.ink2 });
        if (col === ENDO) { // 羽毛的小圖示
          const fx = 732, fy = y + 226;
          el('path', { d: `M ${fx - 8},${fy + 12} C ${fx - 6},${fy} ${fx},${fy - 10} ${fx + 8},${fy - 14} C ${fx + 8},${fy - 4} ${fx + 2},${fy + 6} ${fx - 8},${fy + 12} Z`, fill: '#e8dcc8', stroke: '#a8987a', 'stroke-width': 1 }, cg);
          el('line', { x1: fx - 10, y1: fy + 14, x2: fx + 6, y2: fy - 10, stroke: '#8a7a5a', 'stroke-width': 1.5 }, cg);
        }
        return cg;
      });
      tl.addLabel('s0');
      S.drawOn(tl, endo, 1.6, 's0+=0.4');
      S.show(tl, [lEndo, cards0[0]], 's0+=1.4', 0.4);
      S.drawOn(tl, ecto, 1.6, 's0+=2.2');
      S.show(tl, [lEcto, cards0[1]], 's0+=3.2', 0.4);

      // ===== 1 外溫動物的行為調節 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 80, width: 540, height: 540, rx: 18, ...FRAME }, P1);
      el('rect', { x: 620, y: 80, width: 540, height: 540, rx: 18, ...FRAME }, P1);
      text(P1, 310, 130, '天冷：曬太陽', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P1, 890, 130, '太熱：躲到陰涼處', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: ECTO });
      // 左：太陽、石頭、蜥蜴
      el('circle', { cx: 130, cy: 200, r: 36, fill: C.hi }, P1);
      const rays1 = [0, 1, 2].map((i) => el('line', { x1: 160 + i * 20, y1: 222 + i * 10, x2: 236 + i * 32, y2: 366 + i * 6, stroke: C.hi, 'stroke-width': 4, 'stroke-dasharray': '12 9', opacity: 0.8 }, P1));
      el('path', { d: 'M 120,470 C 140,410 260,396 360,404 C 440,410 470,440 480,470 Z', fill: '#5a6670', stroke: '#8aa1ae', 'stroke-width': 2 }, P1);
      lizard(P1, 290, 396, 0.9);
      const th1 = thermo(P1, 510, 420, 160);
      text(P1, 510, 480, '體溫', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const r1a = text(P1, 310, 540, '身體變暖，才能活動', { 'font-size': 26, 'text-anchor': 'middle', opacity: 0 });
      // 右：大石頭下的陰影
      el('circle', { cx: 1090, cy: 190, r: 36, fill: C.hi }, P1);
      el('path', { d: 'M 680,470 C 690,330 820,280 920,300 C 1010,316 1040,400 1040,470 Z', fill: '#4a5660', stroke: '#8aa1ae', 'stroke-width': 2 }, P1);
      el('path', { d: 'M 700,470 C 720,420 980,410 1030,470 Z', fill: '#0b141c', opacity: 0.8 }, P1);
      const liz2 = lizard(P1, 1000, 456, 0.9);
      const th2 = thermo(P1, 1100, 420, 160);
      text(P1, 1100, 480, '體溫', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const r1b = text(P1, 890, 540, '避免體溫過高', { 'font-size': 26, 'text-anchor': 'middle', opacity: 0 });
      th1.set(0.25); th2.set(0.85);
      const beh = g(P1, { opacity: 0 });
      S.pill(beh, 600, 670, '外溫動物主要靠「行為」調節體溫', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      rays1.forEach((r) => tl.fromTo(r, { attr: { 'stroke-dashoffset': 42 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 3, ease: 'none', immediateRender: false }, 's1+=0.6'));
      S.drive(tl, (u) => th1.set(S.lerp(0.25, 0.62, u)), 2.4, 's1+=0.8', 'power1.inOut');
      S.show(tl, r1a, 's1+=2.6', 0.4);
      S.move(tl, liz2, { x: 1000, y: 456, s: 0.9 }, { x: 800, y: 446, s: 0.9 }, 1.6, 's1+=3');
      S.drive(tl, (u) => th2.set(S.lerp(0.85, 0.62, u)), 2, 's1+=3.4', 'power1.inOut');
      S.show(tl, r1b, 's1+=4.8', 0.4);
      S.show(tl, beh, 's1+=5.4', 0.5);

      // ===== 2 人體的體溫調節 =====
      const P2 = g(root, { opacity: 0 });
      const skin = (x, hot) => {
        const sg = g(P2);
        el('rect', { x, y: 80, width: 540, height: 570, rx: 18, ...FRAME }, sg);
        text(sg, x + 270, 126, hot ? '熱的時候：增加散熱' : '冷的時候：減少散熱、增加產熱', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: hot ? HEAT : ECTO });
        el('rect', { x: x + 20, y: 250, width: 500, height: 40, fill: 'rgba(242,179,138,0.45)' }, sg);
        el('rect', { x: x + 20, y: 290, width: 500, height: 150, fill: 'rgba(201,138,106,0.18)' }, sg);
        const mus = g(sg);
        el('rect', { x: x + 20, y: 440, width: 500, height: 70, fill: 'rgba(255,143,143,0.3)' }, mus);
        for (let k = 0; k < 4; k++) el('line', { x1: x + 30, y1: 452 + k * 16, x2: x + 510, y2: 452 + k * 16, stroke: C.muscle, 'stroke-width': 3, opacity: 0.7 }, mus);
        text(sg, x + 30, 240, '皮膚', { 'font-size': 20, fill: '#f2b38a' });
        text(sg, x + 30, 534, '肌肉', { 'font-size': 20, fill: C.muscle });
        const ves = el('path', { d: `M ${x + 20},370 C ${x + 140},370 ${x + 160},300 ${x + 270},300 C ${x + 380},300 ${x + 400},370 ${x + 520},370`, fill: 'none', stroke: C.blood, 'stroke-width': 12, 'stroke-linecap': 'round' }, sg);
        text(sg, x + 520, 172, '散出的熱', { 'font-size': 20, 'text-anchor': 'end', fill: HEAT });
        // 熱氣排在「皮膚」和「散出的熱」兩個標籤之間，不穿過文字
        const heat = [0, 1, 2, 3, 4].map((k) => el('path', { d: `M ${x + 90 + k * 80},240 q -10,-16 0,-32 q 10,-16 0,-32`, fill: 'none', stroke: HEAT, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, sg));
        return { sg, ves, heat, mus };
      };
      const H = skin(40, true), Cd = skin(620, false);
      const drops2 = [0, 1, 2, 3].map((k) => S.place(g(P2, { opacity: 0 }), { x: 150 + k * 100, y: 238 }));
      drops2.forEach((d) => el('path', { d: DROP, fill: C.water, transform: 'scale(1.5)' }, d));
      const lab2 = [
        [310, 590, '流汗：汗液蒸發帶走熱', C.water],
        [310, 630, '皮膚血管擴張：散熱增加', C.blood],
        [890, 590, '皮膚血管收縮：減少散熱', C.blood],
        [890, 630, '肌肉顫抖（發抖）：產生熱', C.muscle],
      ].map(([x, y, str, col]) => text(P2, x, y, str, { 'font-size': 24, 'text-anchor': 'middle', fill: col, 'font-weight': 700, opacity: 0 }));
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drive(tl, (u) => {
        H.ves.setAttribute('stroke-width', 12 + 14 * u);
        Cd.ves.setAttribute('stroke-width', 12 - 8 * u);
        H.heat.forEach((h, k) => { const ph = (u * 3 + k / 5) % 1; h.setAttribute('transform', `translate(0,${(-ph * 30).toFixed(1)})`); h.style.opacity = u <= 0 ? 0 : u >= 1 ? 0.9 : 0.9 * Math.sin(ph * Math.PI); });
        Cd.heat.forEach((h, k) => { const ph = (u * 3 + k / 5) % 1; h.setAttribute('transform', `translate(0,${(-ph * 30).toFixed(1)})`); h.style.opacity = k % 2 ? 0 : (u <= 0 ? 0 : (1 - u * 0.75) * 0.9 * (u >= 1 ? 1 : Math.sin(ph * Math.PI))); });
        const j = u > 0.3 && u < 1 ? Math.sin(u * 160) * 3 : 0;
        Cd.mus.setAttribute('transform', `translate(${j.toFixed(1)},0)`);
      }, 4.5, 's2+=0.8', 'none');
      drops2.forEach((d, i) => S.show(tl, d, `s2+=${1.2 + i * 0.3}`, 0.3));
      lab2.forEach((t, i) => S.show(tl, t, `s2+=${1.6 + i * 0.7}`, 0.4));

      // ===== 3–4 血糖（同一張圖）=====
      const CH = g(root, { opacity: 0 });
      const TX0 = 140, TX1 = 1130, TY0 = 330, TY1 = 92, T0 = 18, T1 = 31, V0 = 50, V1 = 200;
      const xt = (t) => TX0 + ((t - T0) / (T1 - T0)) * (TX1 - TX0), yv = (v) => TY0 - ((v - V0) / (V1 - V0)) * (TY0 - TY1);
      el('rect', { x: TX0, y: yv(140), width: TX1 - TX0, height: yv(70) - yv(140), fill: 'rgba(255,209,102,0.08)' }, CH);
      text(CH, TX1 - 8, yv(140) + 26, '正常範圍＊', { 'font-size': 20, 'text-anchor': 'end', fill: C.hi });
      [50, 100, 150, 200].forEach((v) => { el('line', { x1: TX0, y1: yv(v), x2: TX1, y2: yv(v), stroke: GRID, 'stroke-width': 1.5 }, CH); text(CH, TX0 - 12, yv(v) + 7, String(v), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute }); });
      [[18, '18 時'], [21, '21 時'], [24, '0 時'], [27, '3 時'], [30, '6 時']].forEach(([t, s]) => text(CH, xt(t), TY0 + 38, s, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }));
      text(CH, TX0 - 100, 70, '血糖（mg/dL）＊', { 'font-size': 20, fill: C.ink2 });
      const Gt = (t) => {
        const r = (t - 18.5) / 0.7, b = r <= 0 ? 0 : r * Math.exp(1 - r); // 平滑的飯後曲線
        const fall = t > 21 ? 12 * (1 - Math.exp(-(t - 21) / 2)) : 0;
        return 90 + 46 * b - fall;
      };
      const curveD = (a, b) => { let d = ''; for (let t = a; t <= b + 1e-6; t += 0.05) d += (d ? 'L' : 'M') + `${xt(t).toFixed(1)},${yv(Gt(t)).toFixed(1)}`; return d; };
      const cA = el('path', { d: curveD(18, 22.5), fill: 'none', stroke: C.sugar, 'stroke-width': 4, 'stroke-linejoin': 'round' }, CH);
      const cB = el('path', { d: curveD(22.5, 31), fill: 'none', stroke: C.sugar, 'stroke-width': 4, 'stroke-linejoin': 'round' }, CH);
      const meal = g(CH);
      el('line', { x1: xt(18.5), y1: TY1 - 4, x2: xt(18.5), y2: TY0, stroke: C.ink2, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, meal);
      text(meal, xt(18.5) + 8, TY1 + 18, '晚餐', { 'font-size': 22, fill: C.ink2, 'font-weight': 700 });
      const sleep = g(CH, { opacity: 0 });
      el('rect', { x: xt(22.5), y: TY1, width: xt(31) - xt(22.5), height: TY0 - TY1, fill: 'rgba(167,150,255,0.06)' }, sleep);
      text(sleep, (xt(22.5) + xt(31)) / 2, TY1 + 26, '睡覺，很久沒有吃東西', { 'font-size': 22, 'text-anchor': 'middle', fill: GLUC });
      const upLbl = S.callout(CH, xt(19.25), yv(Gt(19.25)), xt(21.4), yv(170), '飯後血糖上升', C.sugar, { size: 22 });
      const dnLbl = S.callout(CH, xt(20.4), yv(Gt(20.4)), xt(23.6), yv(124), '胰島素使血糖下降', INS, { size: 22 });
      const flatLbl = S.callout(CH, xt(28), yv(Gt(28)), xt(27.3), yv(120), '升糖素使血糖不再下降', GLUC, { size: 22 });
      // 下方：作用過程
      const M3 = g(root, { opacity: 0 }), M4 = g(root, { opacity: 0 });
      const mech = (M, hormone, col) => {
        pancreas(M, 160, 520);
        text(M, 160, 590, '胰臟中的胰島', { 'font-size': 22, 'text-anchor': 'middle', fill: '#e9c27a' });
        arrow(M, 262, 520, 404, 520, col, 4, 14);
        text(M, 330, 504, hormone, { 'font-size': 26, 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
        const dots = [0, 1, 2, 3].map(() => el('circle', { cx: 0, cy: 0, r: 6, fill: col, opacity: 0 }, M));
        return dots;
      };
      const dots3 = mech(M3, '胰島素', INS);
      el('rect', { x: 420, y: 392, width: 440, height: 110, rx: 14, fill: '#122230', stroke: INS, 'stroke-width': 2 }, M3);
      el('path', { d: S.smoothPath(S.blobPts(478, 447, 36, 38)), fill: 'rgba(99,212,191,0.12)', stroke: C.membrane, 'stroke-width': 2 }, M3);
      const gIn = glu(M3, 540, 447, 12);
      text(M3, 650, 440, '葡萄糖進入細胞', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(M3, 650, 474, '被利用（呼吸作用）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      el('rect', { x: 420, y: 536, width: 440, height: 110, rx: 14, fill: '#122230', stroke: INS, 'stroke-width': 2 }, M3);
      liverShape(M3, 486, 590, 0.8);
      glycogen(M3, 600, 584);
      text(M3, 730, 584, '肝臟把葡萄糖', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
      text(M3, 730, 614, '合成肝糖儲存', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: GLY });
      arrow(M3, 404, 520, 418, 456, INS, 3, 10); arrow(M3, 404, 520, 418, 584, INS, 3, 10);
      const res3 = g(M3, { opacity: 0 });
      arrow(res3, 870, 520, 920, 520, C.ink2, 4, 14);
      S.pill(res3, 1040, 520, '血糖下降 ↓', { size: 28, color: INS, edge: INS });
      const dots4 = mech(M4, '升糖素', GLUC);
      el('rect', { x: 420, y: 452, width: 440, height: 140, rx: 14, fill: '#122230', stroke: GLUC, 'stroke-width': 2 }, M4);
      liverShape(M4, 486, 520, 0.8);
      const gly4 = glycogen(M4, 610, 504);
      const free4 = [0, 1, 2].map((i) => glu(M4, 556 + i * 32, 566, 10));
      free4.forEach((f) => { f.style.opacity = 0; });
      text(M4, 760, 512, '肝臟把肝糖', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: GLY });
      text(M4, 760, 544, '分解成葡萄糖', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
      text(M4, 760, 574, '送入血液', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const res4 = g(M4, { opacity: 0 });
      arrow(res4, 870, 520, 920, 520, C.ink2, 4, 14);
      S.pill(res4, 1040, 520, '血糖上升 ↑', { size: 28, color: GLUC, edge: GLUC });
      const adr4 = g(M4, { opacity: 0 });
      text(adr4, 1040, 584, '腎上腺素也能', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ffb3c8' });
      text(adr4, 1040, 614, '使血糖上升', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ffb3c8' });
      const flow = (dots) => (u) => dots.forEach((d, i) => { const k = (u * 3 + i / 4) % 1; d.setAttribute('cx', S.lerp(262, 400, k)); d.setAttribute('cy', 520 + Math.sin(k * 9 + i) * 5); d.style.opacity = u <= 0 || u >= 1 ? 0 : Math.sin(k * Math.PI); });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, CH, 's3+=0.3', 0.4);
      S.drawOn(tl, cA, 3, 's3+=0.6', 'none');
      S.show(tl, upLbl, 's3+=1.4', 0.3);
      S.show(tl, M3, 's3+=2', 0.4);
      S.drive(tl, flow(dots3), 3, 's3+=2.2', 'none');
      S.drive(tl, (u) => gIn.setAttribute('transform', `translate(${S.lerp(540, 482, S.smoothstep(0.3, 0.8, u))},447)`), 2, 's3+=2.6', 'none');
      S.show(tl, dnLbl, 's3+=3.2', 0.3);
      S.show(tl, res3, 's3+=4.4', 0.4);
      tl.addLabel('s4');
      S.hide(tl, M3, 's4', 0.4);
      S.show(tl, sleep, 's4+=0.2', 0.4);
      S.drawOn(tl, cB, 3.2, 's4+=0.4', 'none');
      S.show(tl, M4, 's4+=1.6', 0.4);
      S.drive(tl, flow(dots4), 3, 's4+=1.8', 'none');
      S.drive(tl, (u) => { free4.forEach((f, i) => { const k = S.smoothstep(i * 0.2, i * 0.2 + 0.5, u); f.setAttribute('transform', `translate(${S.lerp(600 + i * 30, 556 + i * 32, k)},${S.lerp(504, 566, k)})`); f.style.opacity = k > 0 ? 1 : 0; }); gly4.style.opacity = 1 - 0.4 * u; }, 2, 's4+=2.4', 'none');
      S.show(tl, flatLbl, 's4+=3.4', 0.3);
      S.show(tl, res4, 's4+=4', 0.4);
      S.show(tl, adr4, 's4+=4.6', 0.4);

      // ===== 5 糖尿病 =====
      const P5 = g(root, { opacity: 0 });
      const DX0 = 130, DX1 = 740, DY0 = 560, DY1 = 120, W0 = 50, W1 = 300;
      const dx = (h) => DX0 + (h / 4) * (DX1 - DX0), dy = (v) => DY0 - ((v - W0) / (W1 - W0)) * (DY0 - DY1);
      el('rect', { x: DX0, y: dy(140), width: DX1 - DX0, height: dy(70) - dy(140), fill: 'rgba(255,209,102,0.08)' }, P5);
      text(P5, DX1 - 8, dy(70) - 10, '正常範圍＊', { 'font-size': 20, 'text-anchor': 'end', fill: C.hi });
      [50, 100, 150, 200, 250, 300].forEach((v) => { el('line', { x1: DX0, y1: dy(v), x2: DX1, y2: dy(v), stroke: GRID, 'stroke-width': 1.5 }, P5); text(P5, DX0 - 12, dy(v) + 7, String(v), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute }); });
      [0, 1, 2, 3, 4].forEach((h) => text(P5, dx(h), DY0 + 30, String(h), { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }));
      text(P5, (DX0 + DX1) / 2, DY0 + 68, '吃飯後的時間（小時）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P5, DX0 - 100, 86, '血糖（mg/dL）＊', { 'font-size': 20, fill: C.ink2 });
      const hD = (f) => { let d = ''; for (let h = 0; h <= 4.0001; h += 0.05) d += (h ? 'L' : 'M') + `${dx(h).toFixed(1)},${dy(f(h)).toFixed(1)}`; return d; };
      const bump = (h, hp) => (h / hp) * Math.exp(1 - h / hp);
      const healthy = el('path', { d: hD((h) => 90 + 45 * bump(h, 0.75)), fill: 'none', stroke: INS, 'stroke-width': 4 }, P5);
      const diab = el('path', { d: hD((h) => 150 + 110 * bump(h, 1.5)), fill: 'none', stroke: ENDO, 'stroke-width': 4 }, P5);
      const lH = text(P5, dx(2.4), dy(92) + 34, '健康的人', { 'font-size': 24, fill: INS, 'font-weight': 700, opacity: 0 });
      const lD = text(P5, dx(2.2), dy(250) - 16, '糖尿病患者', { 'font-size': 24, fill: ENDO, 'font-weight': 700, opacity: 0 });
      const side5 = g(P5, { opacity: 0 });
      el('rect', { x: 800, y: 110, width: 360, height: 520, rx: 16, ...FRAME }, side5);
      text(side5, 980, 160, '原因', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(side5, 980, 204, '胰島素分泌不足，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(side5, 980, 236, '（補充）或身體對胰島素反應變差', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(side5, 980, 300, '結果', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(side5, 980, 342, '血糖長期過高', { 'font-size': 22, 'text-anchor': 'middle', fill: ENDO });
      el('path', { d: 'M 930,400 L 930,560 L 1030,560 L 1030,400' }, el('clipPath', { id: 'ho5cup' }, el('defs', {}, side5)));
      el('rect', { x: 930, y: 470, width: 100, height: 90, fill: '#e8c84a', opacity: 0.8, 'clip-path': 'url(#ho5cup)' }, side5);
      el('path', { d: 'M 926,396 L 930,400 L 930,560 L 1030,560 L 1030,400 L 1034,396', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3 }, side5);
      [[958, 500], [998, 518], [970, 538]].forEach(([x, y]) => glu(side5, x, y, 11));
      text(side5, 980, 600, '尿中可能出現葡萄糖', { 'font-size': 24, 'text-anchor': 'middle', fill: C.sugar, 'font-weight': 700 });
      tl.addLabel('s5');
      S.hide(tl, [CH, M4], 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.drawOn(tl, healthy, 2, 's5+=0.6', 'none');
      S.show(tl, lH, 's5+=2.2', 0.3);
      S.drawOn(tl, diab, 2, 's5+=2.6', 'none');
      S.show(tl, lD, 's5+=4.2', 0.3);
      S.show(tl, side5, 's5+=4.6', 0.5);

      // ===== 6 恆定的調節 =====
      const P6 = g(root, { opacity: 0 });
      const LC = [330, 360], LR = 170;
      el('circle', { cx: LC[0], cy: LC[1], r: LR, fill: 'none', stroke: '#2b4252', 'stroke-width': 3 }, P6);
      const nodes6 = [['正常範圍', 0, C.hi], ['偏離（太高或太低）', 1, ENDO], ['身體察覺', 2, C.ink], ['做出反應來調節', 3, INS]].map(([s, k, col]) => {
        const a = -Math.PI / 2 + (k * Math.PI) / 2, ng = g(P6, { opacity: 0 });
        S.pill(ng, LC[0] + Math.cos(a) * LR, LC[1] + Math.sin(a) * LR, s, { size: 24, color: col, edge: col, bg: '#0d1822' });
        return ng;
      });
      const arcs6 = [0, 1, 2, 3].map((k) => {
        const a0 = -Math.PI / 2 + (k * Math.PI) / 2 + 0.42, a1 = a0 + Math.PI / 2 - 0.84, ag = g(P6, { opacity: 0 });
        const p0 = [LC[0] + Math.cos(a0) * LR, LC[1] + Math.sin(a0) * LR], p1 = [LC[0] + Math.cos(a1) * LR, LC[1] + Math.sin(a1) * LR];
        el('path', { d: `M ${p0[0]},${p0[1]} A ${LR},${LR} 0 0,1 ${p1[0]},${p1[1]}`, fill: 'none', stroke: C.ink2, 'stroke-width': 4 }, ag);
        const t = a1 + Math.PI / 2;
        el('path', { d: `M ${p1[0]},${p1[1]} l ${-14 * Math.cos(t - 0.45)},${-14 * Math.sin(t - 0.45)} l ${14 * Math.cos(t - 0.45) - 14 * Math.cos(t + 0.45)},${14 * Math.sin(t - 0.45) - 14 * Math.sin(t + 0.45)} Z`, fill: C.ink2 }, ag);
        return ag;
      });
      text(P6, LC[0], LC[1] + 8, '恆定', { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      // 右：例子
      const ex6 = g(P6, { opacity: 0 });
      el('rect', { x: 640, y: 120, width: 520, height: 400, rx: 16, ...FRAME }, ex6);
      text(ex6, 900, 170, '身體的調節反應', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      [['體溫', '太熱：流汗、皮膚血管擴張', '太冷：發抖、皮膚血管收縮', ENDO], ['血糖', '太高：胰島素', '太低：升糖素', C.sugar], ['水分', '太多：尿量多', '太少：尿量少、口渴', C.water], ['氣體', '二氧化碳太多：呼吸加快加深', '', '#9fd8ff']].forEach(([n, a, b, col], i) => {
        const y = 222 + i * 76;
        text(ex6, 670, y + 8, n, { 'font-size': 26, 'font-weight': 700, fill: col });
        text(ex6, 740, y - 4, a, { 'font-size': 21, fill: C.ink });
        if (b) text(ex6, 740, y + 26, b, { 'font-size': 21, fill: C.ink });
      });
      const ac6 = g(P6, { opacity: 0 });
      S.pill(ac6, 900, 590, '就像冷氣機：太熱就開，夠涼就停', { size: 26, color: C.hi, edge: C.hi });
      const sys6 = g(P6, { opacity: 0 });
      S.pill(sys6, 330, 640, '由神經系統和內分泌系統協調', { size: 24, color: '#9fd8ff', edge: '#9fd8ff' });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      nodes6.forEach((n, i) => { S.show(tl, n, `s6+=${0.6 + i * 0.8}`, 0.4); S.show(tl, arcs6[i], `s6+=${1 + i * 0.8}`, 0.3); });
      S.show(tl, ex6, 's6+=4', 0.5);
      S.show(tl, sys6, 's6+=3.6', 0.4);
      S.show(tl, ac6, 's6+=5', 0.5);

      return {
        tl,
        notes: [
          '＊示意：線只表示趨勢，不是真實數據。內溫動物也稱為恆溫動物，外溫動物也稱為變溫動物。羽毛、毛髮和皮下脂肪能減少體熱散失。內溫動物例如鳥類、哺乳類；外溫動物例如魚類、兩生類、爬蟲類。',
          '＊示意：溫度計只表示體溫的高低。內溫動物也會用行為幫忙調節體溫，例如人會加衣服、搧風、找陰涼的地方。',
          '＊示意：皮膚剖面簡化了。人的體溫約 37 °C，由腦協調這些反應（補充：體溫調節中樞）。冷的時候起雞皮疙瘩，是毛髮旁的小肌肉收縮（補充）。人是內溫動物。',
          '＊示意：數值和曲線都是示意。健康的人空腹血糖約 70～100 mg/dL，飯後會暫時升高，通常不超過約 140 mg/dL。胰島是胰臟中能分泌激素的細胞群，屬於內分泌系統（5-2）。',
          '＊示意：曲線是示意。很久沒吃東西（例如睡了一整晚），靠肝糖分解維持血糖。腎上腺分泌的腎上腺素（例如緊張、緊急時）也能使血糖上升（見 5-2）。',
          '＊示意：曲線不是真實數據。血糖太高時，腎臟來不及把葡萄糖全部送回血液，葡萄糖就會出現在尿中。糖尿病要就醫治療，並注意飲食和運動。',
          '這種「偏離 → 察覺 → 調節 → 回到正常」的過程，高中稱為回饋（負回饋）作用（補充）。恆定不是固定不變，而是在正常範圍內小幅變動。',
        ],
        steps: [
          '<b>內溫動物</b>的熱主要來自身體的<b>代謝</b>，體溫大致恆定；<b>外溫動物</b>主要從<b>外界</b>吸收熱，體溫隨環境溫度改變。',
          '外溫動物主要靠<b>行為</b>調節體溫：天冷時曬太陽，身體變暖才能活動；太熱時躲到<b>陰涼處</b>或洞穴中。',
          '<b>熱</b>的時候：流汗、皮膚血管<b>擴張</b>，增加散熱。<b>冷</b>的時候：皮膚血管<b>收縮</b>減少散熱，肌肉<b>顫抖</b>產生熱。',
          '飯後，葡萄糖被吸收進入血液，<b>血糖上升</b>。胰臟中的<b>胰島</b>分泌<b>胰島素</b>，使葡萄糖進入細胞，並在<b>肝臟</b>合成<b>肝糖</b>儲存，血糖下降。',
          '很久沒有吃東西，血糖逐漸下降。胰島分泌<b>升糖素</b>，使肝臟把<b>肝糖分解</b>成葡萄糖送入血液，血糖上升。<b>腎上腺素</b>也能使血糖上升。',
          '<b>糖尿病</b>：胰島素分泌<b>不足</b>（補充：或身體對胰島素的反應變差），血糖降不下來、長期<b>過高</b>，尿中可能出現<b>葡萄糖</b>。',
          '恆定的調節：體內狀態<b>偏離</b>正常範圍時，身體察覺後做出<b>反應</b>，讓它<b>回到正常範圍</b>。這些調節靠<b>神經系統</b>和<b>內分泌系統</b>協調。',
        ],
      };
    },
  });
})();
