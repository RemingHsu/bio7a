/* 9-1（七下 4-1）原核、原生生物與菌物界：細菌（沒有細胞核、三種形狀）、細菌與人類、藍綠菌、原生動物與眼蟲、藻類與黏菌、菌物界、比一比（含病毒與尺度） */
(() => {
  const { el, g, text, C } = S;
  const D = S.B4;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const GOOD = '#8be07a', BAD = '#ff8f8f', PRO = '#9fe8da', ALG = '#8fd17a', FUN = '#e8c890', VIR = '#f6a6cc';
  const frame = (p, x, y, w, h, extra = {}) => el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME, ...extra }, p);
  const T = (p, x, y, s, size = 22, fill = C.ink, extra = {}) => text(p, x, y, s, { 'font-size': size, 'text-anchor': 'middle', fill, ...extra });
  const B = (p, x, y, s, size = 28, fill = C.ink) => T(p, x, y, s, size, fill, { 'font-weight': 700 });
  const co = (p, G, pt, lx, ly, s, col, size = 22) => { const [tx, ty] = G.pt(...pt); return S.callout(p, tx, ty, lx, ly, s, col, { size }); };

  // ---- 細菌與人類用的小圖 ----
  function deadLeaf(p, x, y) {
    const G = D.put(p, x, y, 1, -20);
    const d = 'M -80,0 C -50,-40 40,-46 84,0 C 40,46 -50,40 -80,0 Z';
    el('path', { d, fill: '#8a6438', stroke: '#5a3e20', 'stroke-width': 2 }, G);
    el('line', { x1: -86, y1: 0, x2: 80, y2: 0, stroke: '#c8a070', 'stroke-width': 2.5 }, G);
    [-40, -10, 20, 50].forEach((vx) => [-1, 1].forEach((sg) => el('path', { d: `M ${vx},0 Q ${vx + 10},${sg * 12} ${vx + 18},${sg * 26}`, fill: 'none', stroke: '#c8a070', 'stroke-width': 1.5 }, G)));
    [[30, 14, 12], [-30, -12, 9], [56, -8, 7]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#122230', stroke: '#5a3e20', 'stroke-width': 1.5 }, G));
    const rr = S.rng(4);
    for (let i = 0; i < 9; i++) { const rod = S.place(g(G), { x: -60 + rr() * 130, y: -20 + rr() * 40, r: rr() * 180 }); el('path', { d: D.capD(16, 6), fill: '#8fe0c8' }, rod); }
    return G;
  }
  function noduleRoots(p, x, y) {
    const G = D.put(p, x, y);
    el('rect', { x: -110, y: -10, width: 220, height: 200, rx: 12, fill: '#2b2118' }, G);
    el('path', { d: 'M -5,-60 L -5,-10 L 5,-10 L 5,-60 Z', fill: '#5a9a3a' }, G);
    [-1, 1].forEach((sg) => { const lf = S.place(g(G), { x: 0, y: -58, r: sg > 0 ? -40 : 220 }); el('ellipse', { cx: 22, cy: 0, rx: 22, ry: 11, fill: '#4fae46', stroke: '#2f7a3a', 'stroke-width': 1.5 }, lf); });
    const RC = '#e8d2a8';
    el('path', { d: 'M -6,-10 C -6,40 -3,110 0,170 C 3,110 6,40 6,-10 Z', fill: RC }, G);
    const lat = [[20, -1, 80], [42, 1, 84], [70, -1, 70], [96, 1, 64], [124, -1, 46]];
    lat.forEach(([yy, sg, L]) => el('path', { d: `M 0,${yy} Q ${sg * L * 0.5},${yy + 8} ${sg * L},${yy + 30}`, fill: 'none', stroke: RC, 'stroke-width': 3, 'stroke-linecap': 'round' }, G));
    const nod = [];
    lat.forEach(([yy, sg, L]) => [0.45, 0.8].forEach((f) => { const nx = sg * L * f, ny = yy + 30 * f * f + 4; nod.push([nx, ny]); el('circle', { cx: nx, cy: ny, r: 7, fill: '#d88a7a', stroke: '#f2c0b0', 'stroke-width': 1.5 }, G); }));
    G.nod = nod;
    return G;
  }
  function yogurt(p, x, y) {
    const G = D.put(p, x, y);
    el('path', { d: 'M -34,-90 L 34,-90 L 34,-70 C 46,-60 46,-40 40,-20 C 34,10 40,50 40,80 C 40,96 -40,96 -40,80 C -40,50 -34,10 -40,-20 C -46,-40 -46,-60 -34,-70 Z', fill: '#f4f0e6', stroke: '#c8c0b0', 'stroke-width': 2 }, G);
    el('rect', { x: -36, y: -104, width: 72, height: 16, rx: 4, fill: '#e05a5a' }, G);
    el('rect', { x: -40, y: 6, width: 80, height: 40, fill: '#e05a5a', opacity: 0.85 }, G);
    el('rect', { x: -26, y: 20, width: 52, height: 6, rx: 3, fill: '#ffffff', opacity: 0.8 }, G);
    const bub = g(G);
    el('circle', { cx: 74, cy: -46, r: 40, fill: '#0d1822', stroke: C.hi, 'stroke-width': 2.5 }, bub);
    const rr = S.rng(8);
    for (let i = 0; i < 6; i++) { const rod = S.place(g(bub), { x: 74 - 20 + rr() * 40, y: -46 - 20 + rr() * 40, r: rr() * 180 }); el('path', { d: D.capD(26, 9), fill: '#8fe0c8', stroke: '#1f6157', 'stroke-width': 1 }, rod); }
    el('line', { x1: 20, y1: -20, x2: 44, y2: -32, stroke: C.hi, 'stroke-width': 2 }, bub);
    return G;
  }
  function riceBall(p, x, y) {
    const G = D.put(p, x, y);
    el('path', { d: 'M 0,-70 C 16,-70 66,10 66,40 C 66,60 50,66 0,66 C -50,66 -66,60 -66,40 C -66,10 -16,-70 0,-70 Z', fill: '#f8f6ee', stroke: '#c8c4b8', 'stroke-width': 2 }, G);
    el('path', { d: 'M -58,20 L 58,20 L 62,66 L -62,66 Z', fill: '#1f2a24' }, G);
    const bub = g(G);
    el('circle', { cx: 70, cy: -46, r: 42, fill: '#0d1822', stroke: BAD, 'stroke-width': 2.5 }, bub);
    D.cocci(bub, 70, -46, 0.55);
    el('line', { x1: 14, y1: -24, x2: 38, y2: -32, stroke: BAD, 'stroke-width': 2 }, bub);
    return G;
  }

  S.register({
    id: 'microbes', section: '下4-1', title: '原核、原生生物與菌物界',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 原核生物：細菌（沒有細胞核）、三種形狀 =====
      const P0 = g(root);
      const fA = g(P0, { opacity: 0 }), fB = g(P0, { opacity: 0 }), fC = g(P0, { opacity: 0 });
      frame(fA, 40, 40, 640, 430); frame(fB, 710, 40, 450, 430); frame(fC, 40, 490, 1120, 210);
      B(fA, 360, 88, '細菌（原核生物）', 30, PRO);
      const bac = D.bacteriumCell(fA, 360, 280, 1.1);
      const c0 = [
        co(P0, bac, bac.pts.wall, 150, 150, '細胞壁', C.wall),
        co(P0, bac, bac.pts.dna, 540, 150, '遺傳物質（DNA）', '#c9b8ff'),
        co(P0, bac, bac.pts.cyto, 150, 425, '細胞質', '#8fd3c4'),
        co(P0, bac, bac.pts.membrane, 560, 425, '細胞膜', C.membrane),
      ];
      B(fB, 935, 88, '真核細胞（例：動物細胞）', 26);
      const euk = D.eukCell(fB, 935, 262, 0.92);
      const [nx, ny] = euk.pt(6, 50);
      const cNuc = S.callout(P0, nx, ny, 935, 432, '細胞核（有核膜包住）', C.nucleus, { size: 22 });
      const noNuc = g(P0, { opacity: 0 });
      S.pill(noNuc, 360, 425, '沒有核膜，沒有細胞核', { size: 24, color: C.hi, edge: C.hi });
      B(fC, 160, 540, '細菌的形狀', 26);
      T(fC, 160, 575, '依形狀分成三類', 20, C.mute);
      const shapes = [[D.cocci, 450, '球菌', 1.1], [D.bacilli, 730, '桿菌', 1.0], [D.spirilla, 1010, '螺旋菌', 1.0]].map(([fn, x, n, s]) => {
        const sg = g(P0, { opacity: 0 });
        fn(sg, x, 585, s);
        B(sg, x, 680, n, 26);
        return sg;
      });
      const size0 = g(P0, { opacity: 0 });
      S.pill(size0, 160, 640, '約 1～5 μm＊', { size: 22, color: C.hi });
      tl.addLabel('s0');
      S.show(tl, fA, 's0+=0.2', 0.5);
      c0.forEach((c, i) => S.show(tl, c, `s0+=${0.8 + i * 0.4}`, 0.35));
      S.show(tl, fB, 's0+=2.6', 0.5);
      S.show(tl, cNuc, 's0+=3', 0.4);
      S.show(tl, noNuc, 's0+=3.6', 0.4);
      S.show(tl, fC, 's0+=4.2', 0.4);
      shapes.forEach((sg, i) => S.show(tl, sg, `s0+=${4.5 + i * 0.4}`, 0.4));
      S.show(tl, size0, 's0+=5.8', 0.4);

      // ===== 1 細菌與人類 =====
      const P1 = g(root, { opacity: 0 });
      const FX = [40, 330, 620, 910], FW = 250;
      const cards1 = [
        ['分解者', GOOD, ['分解生物的遺體', '和排泄物'], (p) => deadLeaf(p, 165, 230)],
        ['根瘤菌', GOOD, ['住在豆科植物的根瘤', '幫植物獲得含氮養分'], (p) => { const r = noduleRoots(p, 455, 200); return r; }],
        ['乳酸菌', GOOD, ['製作優酪乳、乳酸飲料', '有助於腸道健康'], (p) => yogurt(p, 720, 240)],
        ['致病的細菌', BAD, ['結核桿菌：引起肺結核', '金黃色葡萄球菌：', '引起食物中毒'], (p) => riceBall(p, 1010, 250)],
      ].map(([n, col, lines, draw], i) => {
        const c = g(P1, { opacity: 0 });
        frame(c, FX[i], 60, FW, 490, { stroke: col, 'stroke-opacity': 0.6 });
        const d = draw(c);
        B(c, FX[i] + FW / 2, 420, n, 28, col);
        lines.forEach((s, k) => T(c, FX[i] + FW / 2, 458 + k * 32, s, 21, C.ink2));
        return { c, d };
      });
      const nodLbl = (() => { const r = cards1[1].d, [tx, ty] = r.pt(...r.nod[2]); return S.callout(P1, tx, ty, 520, 112, '根瘤', '#f2c0b0', { size: 20 }); })();
      const where1 = g(P1, { opacity: 0 });
      S.pill(where1, 600, 600, '細菌分布很廣：土壤、水中，人的皮膚和腸道裡都有', { size: 24, color: C.ink, edge: '#4a6272' });
      S.pill(where1, 600, 660, '有些細菌對人有益，有些會使人生病', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.3);
      cards1.forEach(({ c }, i) => S.show(tl, c, `s1+=${0.5 + i * 0.8}`, 0.5));
      S.show(tl, nodLbl, 's1+=1.6', 0.3);
      S.show(tl, where1, 's1+=3.9', 0.5);

      // ===== 2 藍綠菌 =====
      const P2 = g(root, { opacity: 0 });
      const fL = g(P2, { opacity: 0 }), fM = g(P2, { opacity: 0 }), fR = g(P2, { opacity: 0 });
      frame(fL, 40, 40, 360, 470); frame(fM, 420, 40, 380, 470); frame(fR, 820, 40, 340, 470);
      B(fL, 220, 90, '藍綠菌', 30, '#6fdcbc');
      D.nostoc(fL, 220, 210, 0.95);
      T(fL, 220, 290, '念珠藻', 22, C.ink2);
      D.oscillatoria(fL, 220, 380, 0.95);
      T(fL, 220, 432, '顫藻', 22, C.ink2);
      T(fL, 220, 480, '（顯微鏡下）', 20, C.mute);
      B(fM, 610, 90, '一個藍綠菌細胞（放大）', 24);
      const cy = D.cyanoCell(fM, 610, 290, 1.05);
      const c2 = [co(P2, cy, cy.pts.pigment, 742, 150, '葉綠素', '#6fce62'), co(P2, cy, cy.pts.dna, 498, 150, '遺傳物質', '#c9b8ff')];
      const cyTxt = g(P2, { opacity: 0 });
      B(cyTxt, 610, 446, '沒有細胞核', 22, C.hi);
      B(cyTxt, 610, 482, '有葉綠素，但沒有葉綠體', 22, C.hi);
      B(fR, 990, 90, '植物細胞', 28);
      const pc = D.plantCellMini(fR, 990, 290, 1.0);
      const c2r = [co(P2, pc, pc.pts.chloro, 1094, 150, '葉綠體', '#6fce62'), co(P2, pc, pc.pts.nucleus, 890, 150, '細胞核', C.nucleus)];
      T(fR, 990, 446, '葉綠素在葉綠體中', 22, C.ink2);
      const pho2 = g(P2, { opacity: 0 });
      S.pill(pho2, 600, 580, '藍綠菌也是原核生物，能行光合作用，自己製造養分', { size: 26, color: C.hi, edge: C.hi });
      T(pho2, 600, 642, '藍綠菌又稱為藍綠藻，但它沒有細胞核，不屬於藻類', 22, C.mute);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.3);
      S.show(tl, fL, 's2+=0.4', 0.5);
      S.show(tl, fM, 's2+=1.3', 0.5);
      c2.forEach((c, i) => S.show(tl, c, `s2+=${1.9 + i * 0.4}`, 0.35));
      S.show(tl, cyTxt, 's2+=2.8', 0.4);
      S.show(tl, fR, 's2+=3.5', 0.5);
      c2r.forEach((c, i) => S.show(tl, c, `s2+=${3.9 + i * 0.3}`, 0.35));
      S.show(tl, pho2, 's2+=4.8', 0.5);

      // ===== 3 原生生物：原生動物、眼蟲 =====
      const P3 = g(root, { opacity: 0 });
      const head3 = g(P3, { opacity: 0 });
      S.pill(head3, 600, 42, '原生生物界：有細胞核，大多是單細胞', { size: 26, color: PRO, edge: PRO });
      const FX3 = [40, 430, 820], FW3 = 340;
      const cols3 = [0, 1, 2].map((i) => { const c = g(P3, { opacity: 0 }); frame(c, FX3[i], 80, FW3, 460); return c; });
      B(cols3[0], 210, 126, '草履蟲', 30);
      const para = D.paramecium(cols3[0], 210, 290, 0.86);
      B(cols3[1], 600, 126, '變形蟲', 30);
      const amo = D.amoeba(cols3[1], 600, 290, 0.86);
      B(cols3[2], 990, 126, '眼蟲', 30);
      const eug = D.euglena(cols3[2], 1050, 290, 0.6);
      const c3 = [
        co(P3, para, [-40, 70], 120, 420, "纖毛", PRO),
        co(P3, para, para.pts.nucleus, 300, 196, '細胞核', C.nucleus, 20),
        co(P3, amo, amo.pts.pseudo, 700, 420, '偽足', PRO),
        co(P3, eug, eug.pts.flag, 890, 196, '鞭毛', PRO),
        co(P3, eug, eug.pts.chloro, 1090, 420, '葉綠體', '#6fce62'),
      ];
      [[210, '用纖毛游動', '約 0.2 mm＊'], [600, '伸出偽足移動、包住食物', '約 0.3 mm＊'], [990, '有葉綠體，能行光合作用', '約 0.05 mm＊']].forEach(([x, s, z], i) => {
        T(cols3[i], x, 480, s, 21, C.ink2);
        S.pill(cols3[i], x, 516, z, { size: 20, color: C.hi });
      });
      const foot3 = g(P3, { opacity: 0 });
      S.pill(foot3, 600, 594, '草履蟲、變形蟲是原生動物：沒有細胞壁，以攝食其他生物維生', { size: 23, color: C.ink, edge: '#4a6272' });
      S.pill(foot3, 600, 652, '眼蟲很特別：有葉綠體、沒有細胞壁，也能攝取外界的養分', { size: 23, color: '#6fce62', edge: '#6fce62' });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      S.show(tl, head3, 's3+=0.4', 0.4);
      cols3.forEach((c, i) => S.show(tl, c, `s3+=${0.9 + i * 0.9}`, 0.5));
      [[0, 1.4], [1, 1.6], [2, 2.3], [3, 3.2], [4, 3.5]].forEach(([k, t]) => S.show(tl, c3[k], `s3+=${t}`, 0.35));
      S.show(tl, foot3, 's3+=4.2', 0.5);
      S.drive(tl, (u) => { S.place(para, { x: 210 - 12 * Math.sin(u * Math.PI), y: 290, s: 0.86 }); }, 3, 's3+=1', 'sine.inOut');

      // ===== 4 原生生物：藻類（單細胞～多細胞）、原生菌類（黏菌）=====
      const P4 = g(root, { opacity: 0 });
      const fAl = g(P4, { opacity: 0 }), fSl = g(P4, { opacity: 0 });
      frame(fAl, 40, 40, 760, 500); frame(fSl, 820, 40, 340, 500);
      B(fAl, 420, 86, '藻類：有細胞壁和葉綠體，能行光合作用', 26, ALG);
      const algae = [
        [120, (p) => { D.diatomP(p, 120, 220, 0.46, -20); D.diatomC(p, 120, 340, 0.46); }, '矽藻', '單細胞'],
        [270, (p) => D.spirogyra(p, 270, 316, 0.6, { n: 4, r: 90 }), '水綿', '絲狀'],
        [420, (p) => D.kelp(p, 420, 440, 0.72, 0.4), '海帶', '褐藻'],
        [560, (p) => D.sheetAlga(p, 560, 440, 0.95, 'nori'), '紫菜', '紅藻'],
        [700, (p) => D.sheetAlga(p, 700, 440, 0.85, 'ulva'), '石蓴', '綠藻'],
      ].map(([x, draw, n, k]) => { const a = g(P4, { opacity: 0 }); draw(a); B(a, x, 488, n, 24); T(a, x, 520, k, 20, C.mute); return a; });
      const algNote = g(P4, { opacity: 0 });
      S.pill(algNote, 420, 590, '藻類不是植物：沒有根、莖、葉，也沒有維管束', { size: 24, color: C.hi, edge: C.hi });
      T(algNote, 420, 648, '大多生活在水中，是水域中重要的生產者', 22, C.ink2);
      B(fSl, 990, 86, '原生菌類：黏菌', 26, '#f2c94c');
      const slime = D.slimeMold(fSl, 990, 230, 0.95);
      const sl4 = co(P4, slime, slime.pts.net, 990, 360, '黃色網狀的黏菌', '#f2c94c', 20);
      ['生活在潮溼的腐木、落葉上', '分解有機物維生', '以孢子繁殖'].forEach((s, k) => T(fSl, 990, 420 + k * 34, s, 21, C.ink2));
      const slNote = g(P4, { opacity: 0 });
      T(slNote, 990, 600, '名字有「菌」，', 22, C.mute);
      T(slNote, 990, 634, '但屬於原生生物', 22, C.mute);
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.3);
      S.show(tl, fAl, 's4+=0.4', 0.5);
      algae.forEach((a, i) => S.show(tl, a, `s4+=${0.9 + i * 0.55}`, 0.45));
      S.show(tl, algNote, 's4+=3.8', 0.5);
      S.show(tl, fSl, 's4+=4.6', 0.5);
      S.show(tl, sl4, 's4+=5', 0.35);
      S.show(tl, slNote, 's4+=5.5', 0.4);

      // ===== 5 菌物界 =====
      const P5 = g(root, { opacity: 0 });
      const head5 = g(P5, { opacity: 0 });
      [['有細胞核', 172], ['有細胞壁', 330], ['沒有葉綠體', 500], ['從外界吸收養分（多為分解者）', 830]].forEach(([s, x]) => S.pill(head5, x, 42, s, { size: 23, color: FUN, edge: FUN }));
      const cols5 = [0, 1, 2].map((i) => { const c = g(P5, { opacity: 0 }); frame(c, FX3[i], 80, FW3, 500); return c; });
      B(cols5[0], 210, 126, '酵母菌', 30);
      const yst = D.yeast(cols5[0], 210, 290, 1.25);
      B(cols5[1], 600, 126, '黴菌（例：黑黴菌）', 28);
      const mold = D.breadMold(cols5[1], 600, 420, 0.95);
      T(cols5[1], 606, 450, '麵包', 20, '#6a4a22', { 'font-weight': 700, stroke: '#d9b06a', 'stroke-width': 4, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }); // 麵包色描邊：蓋住字底下的斑點
      B(cols5[2], 990, 126, '蕈類（例：香菇）', 28);
      const shi = D.shiitake(cols5[2], 990, 400, 0.85);
      const c5 = [
        co(P5, yst, yst.pts.bud, 110, 410, '出芽', FUN),
        co(P5, mold, mold.pts.spor, 700, 190, '孢子囊', '#d0d0d0', 20),
        co(P5, mold, mold.pts.hypha, 500, 196, '菌絲', '#eef3f6', 20),
        co(P5, shi, shi.pts.hypha, 1104, 368, '菌絲', '#f3efe2', 20),
      ];
      [[210, ['單細胞，沒有菌絲', '可以做麵包、釀酒']], [600, ['多細胞，由菌絲組成', '用孢子繁殖，使食物發霉']], [990, ['菌絲長在木頭裡', '分解木材，吸收養分']]].forEach(([x, ls], i) => ls.forEach((s, k) => T(cols5[i], x, 516 + k * 32, s, 21, C.ink2)));
      const foot5 = g(P5, { opacity: 0 });
      S.pill(foot5, 600, 636, '香菇、木耳不是植物：沒有葉綠體，靠菌絲從外界吸收養分', { size: 24, color: C.hi, edge: C.hi });
      // 菌絲分泌酵素、吸收養分（小點）
      const enz = Array.from({ length: 8 }, () => el('circle', { r: 3.5, fill: '#ffd166', opacity: 0 }, P5));
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.3);
      S.show(tl, head5, 's5+=0.4', 0.5);
      cols5.forEach((c, i) => S.show(tl, c, `s5+=${1 + i * 1}`, 0.5));
      [[0, 1.5], [1, 2.5], [2, 2.7], [3, 3.5]].forEach(([k, t]) => S.show(tl, c5[k], `s5+=${t}`, 0.35));
      S.drive(tl, (u) => enz.forEach((e, i) => {
        const k = (u * 2 + i / 8) % 1, [hx, hy] = shi.pt(-50 + (i % 4) * 34, 40 + (i >> 2) * 22);
        e.setAttribute('cx', hx + Math.sin(i * 2) * 16 * (k < 0.5 ? k * 2 : 2 - k * 2)); e.setAttribute('cy', hy + (k < 0.5 ? k : 1 - k) * 18);
        e.style.opacity = u > 0.02 && u < 0.98 ? 0.9 : 0;
      }), 3, 's5+=3.8', 'none');
      S.show(tl, foot5, 's5+=4.4', 0.5);

      // ===== 6 比一比：三界＋病毒；大小（跨尺度）=====
      const P6 = g(root, { opacity: 0 });
      const TX = [40, 250, 550, 860, 1160], ROWY = 40, RH = 44;
      const rows6 = [
        ['', '原核生物界', '原生生物界', '菌物界'],
        ['細胞核', '沒有', '有', '有'],
        ['細胞數目', '單細胞', '大多是單細胞', '大多是多細胞'],
        ['細胞壁', '有', '藻類有，原生動物沒有', '有'],
        ['葉綠體', '沒有', '藻類有', '沒有'],
        ['獲得養分', '分解、寄生；藍綠菌行光合作用', '光合作用、攝食或分解', '吸收外界的養分'],
        ['例子', '細菌、藍綠菌', '草履蟲、矽藻、海帶', '酵母菌、黴菌、香菇'],
      ];
      const tbl = rows6.map((row, r) => {
        const rg = g(P6, { opacity: 0 });
        const y0 = ROWY + r * RH;
        el('rect', { x: TX[0], y: y0, width: TX[4] - TX[0], height: RH, fill: r === 0 ? '#1a3040' : r % 2 ? '#122230' : '#0f1d29', stroke: '#2b4252', 'stroke-width': 1 }, rg);
        row.forEach((s, c) => { if (!s) return; const cx = (TX[c] + TX[c + 1]) / 2; T(rg, cx, y0 + 30, s, r === 0 || c === 0 ? 23 : 21, r === 0 ? [C.ink, PRO, ALG, FUN][c] : c === 0 ? C.hi : C.ink, { 'font-weight': r === 0 || c === 0 ? 700 : 400 }); });
        return rg;
      });
      // 尺度：對數刻度（每格差 10 倍）
      const AX0 = 130, DEC = 200, AY = 600;
      const lx = (um) => AX0 + DEC * (Math.log10(um) + 2);
      const axis = g(P6, { opacity: 0 });
      el('line', { x1: AX0 - 20, y1: AY, x2: lx(1000) + 20, y2: AY, stroke: C.mute, 'stroke-width': 3 }, axis);
      [[0.01, '0.01 μm'], [0.1, '0.1 μm'], [1, '1 μm'], [10, '10 μm'], [100, '0.1 mm'], [1000, '1 mm']].forEach(([v, s]) => { el('line', { x1: lx(v), y1: AY - 8, x2: lx(v), y2: AY + 8, stroke: C.mute, 'stroke-width': 3 }, axis); T(axis, lx(v), AY + 34, s, 20, C.mute, { class: 'mono' }); });
      T(axis, 1110, AY - 18, '每格 ×10', 20, C.mute);
      const sz = [
        [0.1, '病毒', '約 0.1 μm＊', VIR, (p, x) => D.virus(p, x, 520, 0.42)],
        [2, '細菌', '約 2 μm＊', PRO, (p, x) => { const q = S.place(g(p), { x, y: 520, r: -20 }); el('path', { d: D.capD(66, 22), fill: '#4fb3a0', stroke: '#1f6157', 'stroke-width': 1.5, transform: 'scale(1.1)' }, q); }],
        [5, '酵母菌', '約 5 μm＊', FUN, (p, x) => D.yeast(p, x + 4, 520, 0.42)],
        [200, '草履蟲', '約 0.2 mm＊', PRO, (p, x) => D.paramecium(p, x, 520, 0.3)],
      ].map(([um, n, s, col, draw], i) => {
        const x = lx(um), mk = g(P6, { opacity: 0 });
        draw(mk, x);
        el('circle', { cx: x, cy: AY, r: 7, fill: col }, mk);
        B(mk, x, 446 + (i === 2 ? 0 : 0), n, 24, col);
        S.pill(mk, x + (i === 1 ? -30 : i === 2 ? 40 : 0), 664, s, { size: 20, color: col, edge: col });
        return mk;
      });
      const vir6 = g(P6, { opacity: 0 });
      S.pill(vir6, 340, 386, '病毒：沒有細胞構造，只能在活細胞內繁殖，不屬於五界', { size: 22, color: VIR, edge: VIR });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.3);
      tbl.forEach((r, i) => S.show(tl, r, `s6+=${0.4 + i * 0.35}`, 0.35));
      S.show(tl, axis, 's6+=3', 0.5);
      sz.forEach((m, i) => S.show(tl, m, `s6+=${3.5 + i * 0.6}`, 0.4));
      S.show(tl, vir6, 's6+=6', 0.5);

      return {
        tl,
        notes: [
          '＊大小為約略值，不同細菌差異很大，要用顯微鏡才看得到。圖中的細胞都放大、簡化了。原核生物的遺傳物質散布在細胞質中；有些細菌還有鞭毛，圖中沒有畫出。',
          '＊示意：細菌都畫得很大。根瘤菌能把空氣中的氮轉變成植物可以吸收的含氮養分。細菌和黴菌等分解者，讓生物遺體中的物質回到環境中，再被植物利用。',
          '＊示意：細胞畫得很大，膜上的綠色表示葉綠素所在的位置。藍綠菌外面大多有一層黏滑的膠質。藍綠菌大量繁殖時，會使水變成綠色。',
          '＊大小為約略值。草履蟲另有口溝、伸縮泡等構造；眼蟲前端有紅色的眼點（補充）。有些原生動物會寄生，例如瘧原蟲寄生在人的紅血球中，引起瘧疾。',
          '＊示意：各種藻類沒有依照真實比例畫。矽藻要用顯微鏡才看得到；海帶（昆布）可長到數公尺長。紫菜、石花菜屬於紅藻；石花菜可提煉洋菜。綠藻被認為是植物的祖先。',
          '＊示意：酵母菌、黴菌都放大了。菌物界也稱為真菌界。真菌分泌酵素到體外，把大分子分解成小分子後再吸收。有些真菌會寄生，例如引起足癬（香港腳）的黴菌；青黴菌可提煉抗生素（盤尼西林）。',
          '＊大小為約略值，同類生物的大小差異很大；圖示的大小不代表真實比例。尺度軸每一格差 10 倍。病毒由蛋白質外殼和遺傳物質組成（補充）。',
        ],
        steps: [
          '<b>原核生物界</b>：細菌的遺傳物質散布在細胞質中，<b>沒有核膜</b>包住，所以<b>沒有細胞核</b>。細菌依形狀分成<b>球菌、桿菌、螺旋菌</b>。',
          '細菌和人類關係密切：有的是<b>分解者</b>，有的幫助植物（<b>根瘤菌</b>）或用來製作食品（<b>乳酸菌</b>）；也有些會<b>致病</b>。',
          '<b>藍綠菌</b>也是原核生物：細胞中有<b>葉綠素</b>，能行<b>光合作用</b>，但<b>沒有葉綠體</b>，也沒有細胞核。',
          '<b>原生生物界</b>：有細胞核，大多是單細胞。<b>草履蟲</b>用纖毛游動、<b>變形蟲</b>伸出偽足移動；<b>眼蟲</b>有葉綠體，又能攝取養分。',
          '<b>藻類</b>也是原生生物：有細胞壁和葉綠體，能行光合作用；有單細胞的<b>矽藻</b>，也有多細胞的<b>海帶、紫菜</b>。<b>黏菌</b>屬於原生菌類。',
          '<b>菌物界</b>：有細胞核和細胞壁，<b>沒有葉綠體</b>，從外界吸收養分。<b>酵母菌</b>是單細胞；<b>黴菌</b>和<b>蕈類</b>由<b>菌絲</b>組成，用<b>孢子</b>繁殖。',
          '比一比三界的特徵和大小。<b>病毒</b>比細菌小得多，<b>沒有細胞構造</b>，只能在<b>活細胞</b>內繁殖，不屬於五界。',
        ],
      };
    },
  });

})();
