/* 2-3 組成物質與細胞分工：原子 → 分子 → 細胞（跨尺度）、生物體的組成物質（水最多；無機物與有機物）、細胞分裂與分化 → 組織 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const ATOM = { O: '#ff6b6b', H: '#e8f0f2', C: '#5a6670', N: '#62a8ff' };
  // 人體的組成物質（質量百分比，約略值＊）：前兩項是無機物，後三項是有機物
  const COMP = [['水', 60, '#5fb8ff'], ['礦物質', 6, '#c9d6dc'], ['蛋白質', 17, '#ff8f8f'], ['脂質', 15, '#ffb35c'], ['醣類等', 2, '#ffcf5c']];

  const atom = (p, x, y, k, r = 14) => { el('circle', { cx: x, cy: y, r, fill: ATOM[k], stroke: '#0d1822', 'stroke-width': 2 }, p); if (r >= 12) text(p, x, y + 6, k, { 'font-size': 16, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 }); };
  const water = (p, x, y, s = 1) => { const w = S.place(g(p), { x, y, s }); el('line', { x1: -20, y1: 14, x2: 0, y2: 0, stroke: '#cfd8dc', 'stroke-width': 4 }, w); el('line', { x1: 20, y1: 14, x2: 0, y2: 0, stroke: '#cfd8dc', 'stroke-width': 4 }, w); atom(w, 0, 0, 'O', 16); atom(w, -22, 16, 'H', 11); atom(w, 22, 16, 'H', 11); return w; };

  S.register({
    id: 'matter', cards: true, section: '2-3', title: '組成物質與細胞分工',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 從原子到細胞 =====
      const P0 = g(root);
      const PX = [40, 320, 600, 880], PW = 260;
      const pan = PX.map((x) => { const p = g(P0, { opacity: 0 }); el('rect', { x, y: 110, width: PW, height: 400, rx: 16, ...FRAME }, p); return p; });
      // 原子
      atom(pan[0], 110, 260, 'O', 26); atom(pan[0], 190, 250, 'H', 18); atom(pan[0], 150, 340, 'C', 24); atom(pan[0], 220, 330, 'N', 22);
      // 分子：水、葡萄糖
      water(pan[1], 400, 250, 1.5);
      const glc = S.place(g(pan[1]), { x: 500, y: 340 });
      el('path', { d: 'M 0,-30 L 26,-15 L 26,15 L 0,30 L -26,15 L -26,-15 Z', fill: 'rgba(255,207,92,0.2)', stroke: C.sugar, 'stroke-width': 4 }, glc);
      text(pan[1], 400, 310, '水', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      text(pan[1], 500, 400, '葡萄糖', { 'font-size': 20, 'text-anchor': 'middle', fill: C.sugar });
      // 大分子：蛋白質（摺疊的長鏈）、DNA
      const prot = el('path', { d: 'M 650,200 C 700,180 760,220 720,250 C 680,280 760,300 790,270 C 820,240 840,300 800,320 C 760,340 690,320 680,350', fill: 'none', stroke: '#ff8f8f', 'stroke-width': 8, 'stroke-linecap': 'round' }, pan[2]);
      text(pan[2], 730, 372, '蛋白質', { 'font-size': 20, 'text-anchor': 'middle', fill: '#ff8f8f' });
      let dna = '';
      for (let i = 0; i <= 40; i++) { const y = 400 + i * 2.2, x = 730 + Math.sin(i / 4) * 34; dna += (i ? 'L' : 'M') + `${x.toFixed(1)},${y.toFixed(1)}`; }
      el('path', { d: dna, fill: 'none', stroke: '#a796ff', 'stroke-width': 4 }, pan[2]);
      text(pan[2], 800, 470, 'DNA', { 'font-size': 20, fill: '#a796ff' });
      // 細胞
      el('ellipse', { cx: 1010, cy: 300, rx: 104, ry: 82, fill: 'rgba(99,212,191,0.12)', stroke: C.membrane, 'stroke-width': 4 }, pan[3]);
      el('circle', { cx: 1000, cy: 296, r: 30, fill: 'rgba(167,150,255,0.45)', stroke: C.nucleus, 'stroke-width': 3 }, pan[3]);
      [[950, 250], [1066, 270], [1060, 338], [960, 350]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 15, ry: 8, fill: C.mito, opacity: 0.85 }, pan[3]));
      [['原子', '約 0.1 nm＊'], ['分子', '水約 0.3 nm|葡萄糖約 1 nm＊'], ['大分子', '蛋白質約數 nm|～十幾 nm＊'], ['細胞', '約 10～100 μm＊']].forEach(([n, s], i) => {
        const cx = PX[i] + PW / 2;
        text(pan[i], cx, 158, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        const ls = s.split('|');
        ls.forEach((t, k) => text(pan[i], cx, 554 + (k - (ls.length - 1) / 2) * 28, t, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi }));
      });
      const arrows0 = [0, 1, 2].map((i) => { const a = g(P0, { opacity: 0 }); const x = PX[i] + PW + 10; el('path', { d: `M ${x - 4},310 l 14,0 m -6,-7 l 7,7 l -7,7`, fill: 'none', stroke: C.ink2, 'stroke-width': 3 }, a); return a; });
      const tip0 = g(P0, { opacity: 0 });
      S.pill(tip0, 600, 620, '原子組成分子，許多分子組成細胞的各種構造', { size: 26, color: C.ink, edge: '#4a6272' });
      tl.addLabel('s0');
      pan.forEach((p, i) => { S.show(tl, p, `s0+=${0.3 + i * 0.9}`, 0.5); if (i < 3) S.show(tl, arrows0[i], `s0+=${0.7 + i * 0.9}`, 0.3); });
      S.drawOn(tl, prot, 0.8, 's0+=2.2');
      S.show(tl, tip0, 's0+=3.5', 0.5);

      // ===== 1 生物體的組成物質 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 600, 120, '人體的組成物質（質量）＊', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const BX = 100, BW = 1000, BY = 220, BH = 90;
      const segs = [];
      let acc = 0;
      COMP.forEach(([n, v, c], i) => {
        const x = BX + (acc / 100) * BW, w = (v / 100) * BW - 2;
        const sg = g(P1);
        const r = el('rect', { x, y: BY, width: 0, height: BH, rx: 4, fill: c }, sg);
        segs.push({ r, w });
        acc += v;
      });
      // 標籤：大的寫在色塊裡，小的用引線
      const lab1 = g(P1, { opacity: 0 });
      acc = 0;
      COMP.forEach(([n, v, c], i) => {
        const cx = BX + ((acc + v / 2) / 100) * BW;
        if (v >= 10) { text(lab1, cx, BY + 40, n, { 'font-size': 26, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 }); text(lab1, cx, BY + 72, `約 ${v}%`, { 'font-size': 22, 'text-anchor': 'middle', fill: '#0d1822' }); }
        else { const ly = BY + BH + 40 + (i % 2) * 52; el('line', { x1: cx, y1: BY + BH, x2: cx, y2: ly - 22, stroke: C.ink2, 'stroke-width': 2 }, lab1); text(lab1, cx, ly, `${n} 約 ${v}%`, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink }); }
        acc += v;
      });
      // 上方的括號：無機物（水、礦物質）／有機物（蛋白質、脂質、醣類）
      const kinds = g(P1, { opacity: 0 });
      const brace = (x0, x1, y, label, sub, col) => {
        const m = (x0 + x1) / 2;
        el('path', { d: `M ${x0 + 2},${y + 14} Q ${x0 + 2},${y} ${x0 + 16},${y} L ${m - 12},${y} Q ${m},${y} ${m},${y - 12} Q ${m},${y} ${m + 12},${y} L ${x1 - 16},${y} Q ${x1 - 2},${y} ${x1 - 2},${y + 14}`, fill: 'none', stroke: col, 'stroke-width': 3 }, kinds);
        text(kinds, m, y - 22, label, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        if (sub) text(kinds, m + 76, y - 22, sub, { 'font-size': 20, fill: C.mute });
      };
      brace(BX, BX + 0.66 * BW, BY - 14, '無機物', '', '#9fd8ff');
      brace(BX + 0.66 * BW, BX + BW, BY - 14, '有機物', '（大多含碳）', '#ffb3a0');
      const facts1 = g(P1, { opacity: 0 });
      S.pill(facts1, 600, 480, '含量最多的是水', { size: 30, color: '#5fb8ff', edge: '#5fb8ff' });
      text(facts1, 600, 560, '細胞裡還有 DNA 等物質；這些物質大多要從食物中獲得（第三章）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.3);
      segs.forEach(({ r, w }, i) => tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: w }, duration: 0.5, ease: 'power2.out', immediateRender: false }, `s1+=${0.6 + i * 0.35}`));
      S.show(tl, lab1, 's1+=2.4', 0.5);
      S.show(tl, kinds, 's1+=3', 0.5);
      S.show(tl, facts1, 's1+=3.6', 0.5);

      // ===== 2 細胞分裂與分化 =====
      const P2 = g(root, { opacity: 0 });
      const cellAt = (p, x, y, r = 22) => { const c = S.place(g(p), { x, y }); el('circle', { cx: 0, cy: 0, r, fill: 'rgba(99,212,191,0.18)', stroke: C.membrane, 'stroke-width': 3 }, c); el('circle', { cx: 0, cy: 0, r: r * 0.35, fill: 'rgba(167,150,255,0.6)' }, c); return c; };
      const gens = [[[150, 300]], [[290, 270], [290, 330]], [[430, 240], [430, 290], [430, 340], [430, 390]]];
      const genG = gens.map((pts, k) => { const gg = g(P2, { opacity: 0 }); pts.forEach(([x, y]) => cellAt(gg, x, y, 24 - k * 3)); return gg; });
      text(P2, 150, 380, '一個細胞', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const divLbl = g(P2, { opacity: 0 });
      text(divLbl, 290, 470, '細胞分裂：數目變多', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      // 分化成不同的細胞
      const types = [
        ['神經細胞', C.nerve, (p) => { el('circle', { cx: 0, cy: 0, r: 14, fill: C.nerve, opacity: 0.8 }, p); [0, 1.6, 3.4, 4.8].forEach((a) => el('line', { x1: 0, y1: 0, x2: Math.cos(a) * 34, y2: Math.sin(a) * 30, stroke: C.nerve, 'stroke-width': 3 }, p)); el('line', { x1: 14, y1: 0, x2: 90, y2: 6, stroke: C.nerve, 'stroke-width': 3 }, p); }],
        ['肌肉細胞', C.muscle, (p) => el('path', { d: 'M -60,0 C -40,-14 40,-14 70,0 C 40,14 -40,14 -60,0 Z', fill: C.muscle, opacity: 0.85 }, p)],
        ['紅血球', '#ff8094', (p) => { el('ellipse', { cx: 0, cy: 0, rx: 26, ry: 26, fill: '#ff5f74' }, p); el('ellipse', { cx: 0, cy: 0, rx: 11, ry: 11, fill: '#ff9aa8' }, p); }], // 中央較薄、顏色較淡（不是細胞核）
        ['上皮細胞', '#ffc2a8', (p) => { [-34, 0, 34].forEach((x) => el('rect', { x: x - 16, y: -22, width: 32, height: 44, rx: 4, fill: 'rgba(255,194,168,0.35)', stroke: '#ffc2a8', 'stroke-width': 2.5 }, p)); }],
      ];
      const diff = types.map(([n, c, draw], i) => {
        const d = g(P2, { opacity: 0 });
        const o = S.place(g(d), { x: 760, y: 170 + i * 120 });
        draw(o);
        text(d, 900, 178 + i * 120, n, { 'font-size': 24, fill: c, 'font-weight': 700 });
        return d;
      });
      const arr2 = g(P2, { opacity: 0 });
      [170, 290, 410, 530].forEach((y) => el('path', { d: `M 470,315 Q 560,315 650,${y}`, fill: 'none', stroke: '#4a6272', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, arr2));
      const difLbl = g(P2, { opacity: 0 });
      text(difLbl, 760, 640, '細胞分工：形態和功能變得不同', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      const tis = g(P2, { opacity: 0 });
      S.pill(tis, 1070, 640, '→ 再組成組織', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.2);
      genG.forEach((gg, k) => { S.show(tl, gg, `s2+=${0.4 + k * 0.8}`, 0.4); if (k < 2) tl.to(gg, { opacity: 0.25, duration: 0.3 }, `s2+=${1.0 + k * 0.8}`); });
      S.show(tl, divLbl, 's2+=2.2', 0.4);
      S.show(tl, arr2, 's2+=2.8', 0.4);
      diff.forEach((d, i) => S.show(tl, d, `s2+=${3.1 + i * 0.35}`, 0.4));
      S.show(tl, difLbl, 's2+=4.6', 0.4);
      S.show(tl, tis, 's2+=5.2', 0.4);

      return {
        tl,
        notes: [
          '＊大小為約略值。原子、分子太小，光學顯微鏡看不到。',
          '＊約略值：水約占 60～70%，會因年齡、體型而不同（脂質差異最大）；這裡把含量很少的物質併入「醣類等」。有機物大多含碳，但二氧化碳等雖含碳，仍屬於無機物（1-2「生命的起源與生物圈」有說明）。水和礦物質是無機物；蛋白質、脂質、醣類是有機物。',
          '＊示意：細胞的大小、形狀和數目都簡化了。細胞變得形態和功能不同的過程，稱為「細胞分化」（補充）；細胞分裂在七下會詳細學到。',
        ],
        steps: [
          '物質由<b>原子</b>組成，原子結合成<b>分子</b>；許多分子再組成細胞的各種構造。從原子到細胞，大小差了約十萬倍以上。',
          '生物體的組成物質包括<b>水</b>、<b>蛋白質</b>、<b>脂質</b>、<b>醣類</b>、<b>礦物質</b>等，其中含量最多的是<b>水</b>。',
          '多細胞生物的細胞有<b>分工</b>：一個細胞經細胞分裂，數目變多；細胞再逐漸變得<b>形態和功能不同</b>，各自負責特定的工作，再組成組織。',
        ],
      };
    },
  });
})();
