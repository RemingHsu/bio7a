/* 2-1 食物中的養分：六大類養分、哪些提供能量、大分子與小分子、功能與缺乏、養分的檢測 */
(() => {
  const { el, g, text, C } = S;
  const at = (p, x, y, s = 1) => g(S.place(g(p), { x, y, s }));
  const COL = { carb: '#ffcf5c', prot: '#ff8f8f', fat: '#ffb35c', vit: '#9be58c', min: '#c9d6dc', water: '#5fb8ff' };

  // ---------- 食物小圖（原點在中心） ----------
  const ICON = {
    rice(p) { el('path', { d: 'M -60,0 L 60,0 C 56,44 -56,44 -60,0 Z', fill: '#5f93ad' }, p); for (let i = 0; i < 9; i++) el('ellipse', { cx: -44 + i * 11, cy: -6 - (i % 3) * 8, rx: 9, ry: 6, fill: '#f6f2e6' }, p); el('ellipse', { cx: 0, cy: -10, rx: 52, ry: 14, fill: '#f6f2e6' }, p); },
    egg(p) { el('ellipse', { cx: 0, cy: 6, rx: 56, ry: 40, fill: '#fbfbf5' }, p); el('circle', { cx: 4, cy: 4, r: 20, fill: '#ffc93c' }, p); },
    oil(p) { el('path', { d: 'M -22,-56 L 22,-56 L 22,-40 C 40,-30 40,-10 40,0 L 40,50 L -40,50 L -40,0 C -40,-10 -40,-30 -22,-40 Z', fill: 'rgba(255,200,80,0.7)', stroke: '#e8b040', 'stroke-width': 3 }, p); el('rect', { x: -14, y: -70, width: 28, height: 14, rx: 3, fill: '#c0392b' }, p); },
    fruit(p) { el('circle', { cx: 0, cy: 6, r: 44, fill: '#ff9a3c' }, p); el('path', { d: 'M 0,-38 q 6,-16 22,-18 q -4,16 -22,18 Z', fill: '#6fce62' }, p); el('circle', { cx: -14, cy: -6, r: 8, fill: '#ffb766' }, p); },
    milk(p) { el('path', { d: 'M -32,-30 L 0,-58 L 32,-30 L 32,56 L -32,56 Z', fill: '#f2f5f7', stroke: '#5f93ad', 'stroke-width': 3 }, p); el('rect', { x: -32, y: 0, width: 64, height: 26, fill: '#5f93ad' }, p); },
    water(p) { el('path', { d: 'M 0,-56 C 26,-20 40,0 40,18 C 40,42 22,56 0,56 C -22,56 -40,42 -40,18 C -40,0 -26,-20 0,-56 Z', fill: '#5fb8ff', opacity: 0.9 }, p); el('ellipse', { cx: -14, cy: 16, rx: 8, ry: 14, fill: '#cfe8ff', opacity: 0.8 }, p); },
  };
  const SIX = [['醣類', 'carb', 'rice', '米飯、麵包、地瓜'], ['蛋白質', 'prot', 'egg', '蛋、肉、豆腐'], ['脂質', 'fat', 'oil', '油、奶油、堅果'], ['維生素', 'vit', 'fruit', '蔬菜、水果'], ['礦物質', 'min', 'milk', '牛奶（鈣）、深綠色蔬菜（鐵）'], ['水', 'water', 'water', '飲水、湯、食物中的水']];

  // 由小分子組成的長鏈：kind = 'carb'（葡萄糖）、'prot'（胺基酸）
  const unit = (p, kind) => (kind === 'carb'
    ? (() => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * 18).toFixed(1)},${(Math.sin(a) * 18).toFixed(1)}`; } return el('path', { d: d + 'Z', fill: 'rgba(255,207,92,0.15)', stroke: COL.carb, 'stroke-width': 5 }, p); })()
    : el('circle', { cx: 0, cy: 0, r: 16, fill: ['#ff8f8f', '#ffb0b0', '#e86a6a', '#ffc9c9'][(unit.n = ((unit.n || 0) + 1) % 4)], stroke: '#fff', 'stroke-width': 2 }, p));

  S.register({
    id: 'nutrients', section: '2-1', title: '六大類養分',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(8);

      // ===== 0 六大類養分 =====
      const P0 = g(root);
      const cards = SIX.map(([n, k, ic, ex], i) => {
        const x = 60 + (i % 3) * 370, y = 80 + Math.floor(i / 3) * 300, cx = x + 170, c = g(P0);
        el('rect', { x, y, width: 340, height: 270, rx: 20, fill: '#122230', stroke: COL[k], 'stroke-width': 3 }, c);
        ICON[ic](at(c, cx, y + 85));
        text(c, cx, y + 190, n, { 'font-size': 38, 'font-weight': 700, fill: COL[k], 'text-anchor': 'middle' });
        text(c, cx, y + 235, ex, { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' });
        return c;
      });
      tl.addLabel('s0');
      tl.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.2 }, 's0');

      // ===== 1 能量 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 600, 92, '每 1 公克能提供的能量（約）', { 'font-size': 32, 'font-weight': 700, 'text-anchor': 'middle' });
      const BAR = [['醣類', 'carb', 4], ['蛋白質', 'prot', 4], ['脂質', 'fat', 9]];
      const bars = BAR.map(([n, k, kcal], i) => {
        const y = 170 + i * 110, b = g(P1);
        text(b, 250, y + 42, n, { 'font-size': 32, 'font-weight': 700, fill: COL[k], 'text-anchor': 'end' });
        const r = el('rect', { x: 280, y: y + 10, width: 0, height: 46, rx: 8, fill: COL[k] }, b);
        const t = text(b, 300, y + 45, `${kcal} 大卡`, { 'font-size': 28, class: 'mono', 'font-weight': 700, opacity: 0 });
        return { r, t, w: kcal * 86 };
      });
      const noE = g(P1, { opacity: 0 });
      el('rect', { x: 140, y: 520, width: 920, height: 140, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, noE);
      text(noE, 170, 570, '不提供能量：維生素、礦物質、水', { 'font-size': 30, 'font-weight': 700 });
      text(noE, 170, 620, '需要量不多（水除外），但能調節身體的各種生理作用，缺少了會生病。', { 'font-size': 24, fill: C.mute });

      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      bars.forEach(({ r, t, w }, i) => {
        tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: w }, duration: 0.8, ease: 'power2.out' }, `s1+=${0.6 + i * 0.35}`);
        tl.fromTo(t, { opacity: 0, attr: { x: 300 } }, { opacity: 1, attr: { x: 300 + w }, duration: 0.8, ease: 'power2.out' }, `s1+=${0.6 + i * 0.35}`);
      });
      S.show(tl, noE, 's1+=2', 0.5);

      // ===== 2 大分子由小分子組成 =====
      const P2 = g(root, { opacity: 0 });
      const rowY = [200, 380, 560];
      [['澱粉（醣類）', '葡萄糖（約 1 nm＊）', 'carb'], ['蛋白質', '胺基酸', 'prot'], ['脂肪（脂質）', '脂肪酸 ＋ 甘油', 'fat']].forEach(([a, b, k], r) => {
        text(P2, 90, rowY[r] - 60, a, { 'font-size': 28, 'font-weight': 700, fill: COL[k] });
        text(P2, 1110, rowY[r] - 60, b, { 'font-size': 28, 'font-weight': 700, fill: COL[k], 'text-anchor': 'end' });
      });
      const chains = [];
      ['carb', 'prot'].forEach((k, r) => {
        const units = [];
        for (let i = 0; i < 9; i++) { const o = S.place(g(P2), { x: 140 + i * 38, y: rowY[r] }); unit(o, k); units.push({ o, x0: 140 + i * 38, y0: rowY[r], x1: 640 + (i % 5) * 96 + (rnd() - 0.5) * 20, y1: rowY[r] + (i < 5 ? -26 : 26) }); }
        chains.push({ units, y: rowY[r] });
      });
      // 脂肪：甘油（梳子形）＋ 3 條脂肪酸
      const fat0 = S.place(g(P2), { x: 160, y: 560 });
      el('rect', { x: -10, y: -50, width: 20, height: 100, rx: 6, fill: '#ffe0a8' }, fat0);
      const fas = [-34, 0, 34].map((dy) => { const o = S.place(g(fat0), { x: 0, y: dy }); el('path', { d: 'M 10,0 l 18,-8 l 18,8 l 18,-8 l 18,8 l 18,-8 l 18,8 l 18,-8 l 18,8', stroke: COL.fat, 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round' }, o); return o; });
      const arrow2 = g(P2, { opacity: 0 });
      rowY.forEach((y) => { el('path', { d: `M 520,${y} H 580`, stroke: C.mute, 'stroke-width': 4 }, arrow2); el('path', { d: `M 594,${y} l -16,-10 v 20 Z`, fill: C.mute }, arrow2); });
      const breakApart = (u) => {
        chains.forEach(({ units }) => units.forEach((un) => S.place(un.o, { x: S.lerp(un.x0, un.x1, u), y: S.lerp(un.y0, un.y1, u) })));
        S.place(fat0, { x: S.lerp(160, 720, u), y: 560 });
        fas.forEach((o, i) => S.place(o, { x: S.lerp(0, 120 + i * 60, u), y: S.lerp([-34, 0, 34][i], [-30, 0, 30][i], u) }));
      };
      breakApart(0);
      text(P2, 600, 690, '消化：把大分子分解成小分子，身體才能吸收（第 2-4 節）', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      S.show(tl, arrow2, 's2+=1', 0.3);
      S.drive(tl, breakApart, 1.8, 's2+=1.3', 'power2.inOut');

      // ===== 3 功能 =====
      const P3 = g(root, { opacity: 0 });
      const FN = [['醣類', 'carb', '最主要的能量來源；植物以澱粉、動物以肝糖儲存'], ['蛋白質', 'prot', '構成身體（肌肉、酵素等），幫助生長和修補'], ['脂質', 'fat', '儲存能量、保持體溫，也是細胞膜的成分'], ['維生素', 'vit', '調節生理作用；例：缺維生素 A 容易夜盲，缺維生素 C 會壞血病'], ['礦物質', 'min', '鈣：骨骼和牙齒；鐵：製造紅血球裡的血紅素'], ['水', 'water', '約占身體重量的 2/3；運送物質、調節體溫']];
      const rows3 = FN.map(([n, k, t], i) => {
        const y = 130 + i * 92, r = g(P3, { opacity: 0 });
        el('rect', { x: 100, y, width: 1000, height: 76, rx: 14, fill: '#122230' }, r);
        el('rect', { x: 100, y, width: 10, height: 76, rx: 4, fill: COL[k] }, r);
        text(r, 136, y + 48, n, { 'font-size': 30, 'font-weight': 700, fill: COL[k] });
        text(r, 290, y + 47, t, { 'font-size': 25 });
        return r;
      });

      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      tl.to(rows3, { opacity: 1, duration: 0.35, stagger: 0.3 }, 's3+=0.5');

      // ===== 4 檢測 =====
      const P4 = g(root, { opacity: 0 });
      const tube = (x, liquid) => {
        const t = g(P4);
        el('path', { d: `M ${x - 30},180 L ${x - 30},420 C ${x - 30},450 ${x + 30},450 ${x + 30},420 L ${x + 30},180`, fill: 'rgba(200,230,255,0.08)', stroke: '#cfe8ff', 'stroke-width': 4 }, t);
        const liq = el('path', { d: `M ${x - 27},300 L ${x - 27},420 C ${x - 27},446 ${x + 27},446 ${x + 27},420 L ${x + 27},300 Z`, fill: liquid }, t);
        return { t, liq };
      };
      // 碘液＋澱粉
      text(P4, 220, 120, '澱粉 ＋ 碘液', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: COL.carb });
      const iod = tube(220, 'rgba(240,240,230,0.7)');
      const drop1 = el('ellipse', { cx: 220, cy: 150, rx: 7, ry: 10, fill: '#b5651d', opacity: 0 }, P4);
      text(P4, 220, 500, '變成藍黑色', { 'font-size': 26, 'text-anchor': 'middle', fill: '#8fa8ff', 'font-weight': 700 });
      text(P4, 220, 536, '（碘液本身是黃褐色）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 本氏液＋葡萄糖：隔水加熱，依含量變色
      text(P4, 640, 120, '葡萄糖 ＋ 本氏液，隔水加熱', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: COL.carb });
      const BEN = [['#2f6fd0', '#2f6fd0', '沒有'], ['#2f6fd0', '#4caf50', '少'], ['#2f6fd0', '#e8c23a', ''], ['#2f6fd0', '#e8862a', ''], ['#2f6fd0', '#c0392b', '多']];
      const ben = BEN.map(([a, b, lab], i) => { const tb = tube(500 + i * 70, a); tb.to = b; text(P4, 500 + i * 70, 534, lab, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }); return tb; });
      el('path', { d: 'M 480,544 H 800', stroke: C.mute, 'stroke-width': 2 }, P4);
      text(P4, 640, 572, '葡萄糖含量：少 → 多', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(P4, 640, 606, '藍 → 綠 → 黃 → 橙 → 紅', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const bath = g(P4, { opacity: 0 });
      el('rect', { x: 450, y: 330, width: 380, height: 128, rx: 10, fill: 'rgba(95,184,255,0.15)', stroke: '#5fb8ff', 'stroke-width': 3 }, bath);
      const flames = g(P4, { opacity: 0 });
      [530, 640, 750].forEach((x) => el('path', { d: `M ${x},506 q -12,-20 0,-40 q 12,20 0,40 Z`, fill: '#ff8a3c' }, flames));
      // 脂質：紙上油斑
      text(P4, 1020, 120, '補充：脂質滴在紙上', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: COL.fat });
      el('rect', { x: 920, y: 180, width: 200, height: 260, rx: 6, fill: '#efe6c8' }, P4);
      const spot = el('ellipse', { cx: 1020, cy: 310, rx: 0, ry: 0, fill: 'rgba(255,255,255,0.55)', stroke: 'rgba(200,180,120,0.6)', 'stroke-width': 2 }, P4);
      text(P4, 1020, 500, '留下半透明的油斑', { 'font-size': 24, 'text-anchor': 'middle', fill: COL.fat, 'font-weight': 700 });
      text(P4, 1020, 536, '（水滴乾了就不見）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      tl.fromTo(drop1, { opacity: 0, attr: { cy: 150 } }, { opacity: 1, attr: { cy: 300 }, duration: 0.6, ease: 'power1.in' }, 's4+=0.8');
      tl.to(drop1, { opacity: 0, duration: 0.2 }, 's4+=1.4');
      tl.fromTo(iod.liq, { attr: { fill: 'rgba(240,240,230,0.7)' } }, { attr: { fill: '#1d2a6b' }, duration: 0.8 }, 's4+=1.4');
      S.show(tl, [bath, flames], 's4+=1.8', 0.4);
      ben.forEach((b, i) => tl.fromTo(b.liq, { attr: { fill: BEN[i][0] } }, { attr: { fill: b.to }, duration: 1.2 }, 's4+=2.4'));
      tl.fromTo(spot, { attr: { rx: 0, ry: 0 } }, { attr: { rx: 46, ry: 34 }, duration: 0.8 }, 's4+=3');

      // ===== 5 測量食物的熱量（燃燒花生加熱水）=====
      const P5 = g(root, { opacity: 0 });
      const KX = 330;
      el('rect', { x: 120, y: 600, width: 300, height: 14, rx: 4, fill: '#4a5a66' }, P5);
      el('rect', { x: 150, y: 150, width: 10, height: 454, fill: '#4a5a66' }, P5);
      el('rect', { x: 154, y: 264, width: KX - 160, height: 8, fill: '#4a5a66' }, P5);
      el('rect', { x: KX - 75, y: 200, width: 150, height: 160, rx: 10, fill: '#9aa8b2', stroke: '#d6e0e6', 'stroke-width': 3 }, P5);
      el('rect', { x: KX - 69, y: 250, width: 138, height: 104, rx: 6, fill: 'rgba(95,184,255,0.55)' }, P5);
      text(P5, KX, 394, '鋁罐：水 100 mL', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      el('rect', { x: KX + 24, y: 90, width: 14, height: 240, rx: 7, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, P5);
      el('circle', { cx: KX + 31, cy: 336, r: 12, fill: '#ff5f74' }, P5);
      const col5 = el('rect', { x: KX + 27, y: 286, width: 8, height: 50, fill: '#ff5f74' }, P5);
      const t5 = text(P5, KX + 60, 130, '', { 'font-size': 34, 'font-weight': 700, fill: C.hi, class: 'mono' });
      el('rect', { x: KX - 30, y: 580, width: 60, height: 22, rx: 6, fill: '#a8742e' }, P5);
      el('line', { x1: KX, y1: 580, x2: KX, y2: 524, stroke: '#cfd8dc', 'stroke-width': 3 }, P5);
      const nut = el('ellipse', { cx: KX, cy: 514, rx: 22, ry: 15, fill: '#d9a066' }, P5);
      text(P5, KX + 40, 540, '花生 1 g', { 'font-size': 22, fill: COL.fat });
      const fire = g(P5, { opacity: 0 });
      el('path', { d: `M ${KX},504 C ${KX - 34},484 ${KX - 24},434 ${KX},394 C ${KX + 24},434 ${KX + 34},484 ${KX},504 Z`, fill: '#ff8a3c' }, fire);
      el('path', { d: `M ${KX},502 C ${KX - 16},488 ${KX - 12},456 ${KX},434 C ${KX + 12},456 ${KX + 16},488 ${KX},502 Z`, fill: '#ffd166' }, fire);
      const box5 = g(P5, { opacity: 0 });
      el('rect', { x: 560, y: 150, width: 580, height: 330, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, box5);
      text(box5, 850, 206, '熱量 ＝ 水的質量 × 上升的溫度', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      text(box5, 850, 250, '1 g 水上升 1 °C 需要 1 卡', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      text(box5, 850, 320, '100 g × 14.5 °C ＝ 1450 卡', { 'font-size': 30, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(box5, 850, 364, '＝ 1.45 大卡', { 'font-size': 30, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(box5, 850, 432, '包裝標示：1 g 花生約 5.8 大卡＊', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const why5 = g(P5, { opacity: 0 });
      S.pill(why5, 850, 540, '測得比較少：很多熱散失到空氣中', { size: 26, color: '#ff9a6c', edge: '#ff9a6c' });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, fire, 's5+=0.8', 0.3);
      S.drive(tl, (u) => {
        const T = 25 + 14.5 * u, h = (T / 80) * 230;
        col5.setAttribute('y', 336 - h); col5.setAttribute('height', h);
        t5.textContent = `${T.toFixed(1)} °C`;
        nut.setAttribute('rx', 22 - 14 * u); nut.setAttribute('ry', 15 - 9 * u);
        nut.setAttribute('fill', u > 0.6 ? '#3a3a3a' : '#d9a066');
      }, 3.5, 's5+=0.9', 'power1.inOut');
      tl.fromTo(fire, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's5+=4.4');
      S.show(tl, box5, 's5+=4.6', 0.5);
      S.show(tl, why5, 's5+=5.4', 0.5);

      return {
        tl,
        notes: [
          null,
          '＊熱量是常用的近似值；1 大卡（kcal）＝ 1000 卡。',
          '＊示意：分子畫得很大，也把長鏈畫得很短；真實的澱粉由成千上萬個葡萄糖連成。一個葡萄糖分子大約 1 nm（奈米），要用小分子的形式才能進入細胞。',
          null,
          '＊本氏液是淡藍色，要隔水加熱才會變色；它能檢測葡萄糖、麥芽糖等醣類，蔗糖和澱粉測不出來。脂質的油斑檢測是補充，不是每個版本都有教。',
          '＊示意：水溫從 25 °C 開始；上升多少會因裝置而不同。包裝標示是一般花生的約略值。',
        ],
        steps: [
          '食物中的養分分成六大類：<b>醣類、蛋白質、脂質、維生素、礦物質、水</b>。',
          '<b>醣類、蛋白質、脂質</b>可以提供能量，其中醣類是最主要的來源；<b>維生素、礦物質、水</b>不提供能量，但能調節生理作用。',
          '醣類、蛋白質、脂質大多是<b>大分子</b>：澱粉由許多葡萄糖連成，蛋白質由許多胺基酸連成，脂肪由甘油和脂肪酸組成。',
          '各類養分的功能：醣類供應能量；蛋白質構成身體；脂質儲存能量；維生素、礦物質調節生理作用；水運送物質、調節體溫。',
          '檢測養分：澱粉遇<b>碘液</b>變藍黑色；葡萄糖加<b>本氏液</b>並<b>隔水加熱</b>，依含量由藍變綠、黃、橙到紅。',
          '測量食物的熱量：燃燒食物加熱水，<b>熱量 ＝ 水的質量 × 上升的溫度</b>。熱會散失，所以測得的值比包裝標示少。',
        ],
      };
    },
  });
})();
