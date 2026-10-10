/* 七下 3-3 生物的分類：為什麼要分類、分類階層（界門綱目科屬種）、二名法與學名、種的定義（馬×驢＝騾）、五界與病毒 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const at = (p, x, y, s = 1, r = 0) => S.place(g(p), { x, y, s, r });
  const arrow = (p, x1, y1, x2, y2, col = C.ink2, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.6, y2: y2 - Math.sin(a) * head * 0.6, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };
  const SAND = { fill: '#e2c995', dark: '#b0905a', light: '#f4e6c4', bigEars: true, stripes: false };
  // 分類用的動物：[名稱, 畫法, 縮放, y 位移]
  const ANIMALS = (B) => [
    ['蝴蝶', (p) => B.butterfly(p), 0.5, 0],
    ['蝸牛', (p) => B.snail(p), 0.5, 0],
    ['吳郭魚', (p) => B.fish(p), 0.48, 0],
    ['青蛙', (p) => B.frog(p), 0.5, 0],
    ['麻雀', (p) => B.sparrow(p), 0.55, -4],
    ['兔', (p) => B.rabbit(p), 0.45, 2],
    ['狗', (p) => B.dog(p), 0.36, 4],
    ['獅子', (p) => B.lion(p), 0.36, 4],
    ['沙貓', (p) => B.cat(p, SAND), 0.36, 4],
    ['家貓', (p) => B.cat(p), 0.36, 4],
  ];

  S.register({
    id: 'classify', section: '下3-3', title: '生物的分類',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const B = S.B3;
      const AN = ANIMALS(B);

      // ===== 0 為什麼要分類：依形態和構造分群 =====
      const P0 = g(root);
      const many = g(P0, { opacity: 0 });
      S.pill(many, 600, 44, '生物的種類非常多（已命名的約 200 萬種＊）', { size: 28, color: C.hi, edge: C.hi });
      const START = [[180, 200], [430, 170], [700, 210], [960, 180], [300, 330], [560, 340], [820, 330], [1050, 330], [180, 450], [420, 470]];
      const pick0 = [0, 1, 2, 3, 4, 5, 6, 9];
      const END = { 0: [880, 430], 1: [1020, 520], 2: [190, 430], 3: [350, 430], 4: [510, 430], 5: [190, 560], 6: [350, 560], 9: [510, 560] };
      const icons0 = pick0.map((k, i) => { const [n, f, s, dy] = AN[k]; const o = g(P0, { opacity: 0 }); const ig = at(o, START[i][0], START[i][1] + dy, s * 1.5); f(ig); return { o, ig, k, s: s * 1.5, dy }; });
      const grp0 = g(P0, { opacity: 0 });
      el('rect', { x: 90, y: 360, width: 520, height: 280, rx: 30, fill: 'rgba(98,168,255,0.08)', stroke: '#62a8ff', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, grp0);
      el('rect', { x: 770, y: 360, width: 360, height: 280, rx: 30, fill: 'rgba(255,179,92,0.08)', stroke: '#ffb35c', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, grp0);
      text(grp0, 350, 680, '有脊椎骨的動物', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#8fc0ff' });
      text(grp0, 950, 680, '沒有脊椎骨的動物', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffc98a' });
      const basis0 = g(P0, { opacity: 0 });
      el('rect', { x: 250, y: 140, width: 700, height: 150, rx: 18, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, basis0);
      text(basis0, 600, 196, '分類的依據：生物形態和構造的特徵', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(basis0, 600, 248, '構造越相似，親緣關係越近', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink });
      tl.addLabel('s0');
      S.show(tl, many, 's0+=0.2', 0.4);
      icons0.forEach((c, i) => S.show(tl, c.o, `s0+=${0.4 + i * 0.12}`, 0.3));
      S.drive(tl, (u) => icons0.forEach((c, i) => { const [x0, y0] = START[i], [x1, y1] = END[c.k]; S.place(c.ig, { x: S.lerp(x0, x1, u), y: S.lerp(y0, y1, u) + c.dy, s: S.lerp(c.s, c.s * 0.8, u) }); }), 1.6, 's0+=2', 'power2.inOut');
      S.show(tl, grp0, 's0+=3.4', 0.5);
      S.show(tl, basis0, 's0+=4', 0.5);

      // ===== 1 分類階層：界、門、綱、目、科、屬、種（以家貓為例）=====
      const P1 = g(root, { opacity: 0 });
      const RANKS = [['界', '動物界', 0], ['門', '脊索動物門', 2], ['綱', '哺乳綱', 5], ['目', '食肉目', 6], ['科', '貓科', 7], ['屬', '貓屬', 8], ['種', '家貓', 9]];
      const COLX = (j) => 340 + j * 84, RY = (i) => 120 + i * 84;
      const head1 = g(P1, { opacity: 0 });
      AN.forEach(([n], j) => text(head1, COLX(j), 70, n, { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 }));
      const rows1 = RANKS.map(([r, name, s0], i) => {
        const rg = g(P1, { opacity: 0 });
        const y = RY(i), x0 = COLX(s0) - 40;
        el('rect', { x: x0, y: y - 38, width: 1170 - x0, height: 76, rx: 14, fill: `rgba(255,209,102,${0.04 + i * 0.025})`, stroke: '#4a5a66', 'stroke-width': 1.5 }, rg);
        el('rect', { x: 30, y: y - 34, width: 260, height: 68, rx: 12, ...FRAME }, rg);
        text(rg, 70, y + 12, r, { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(rg, 110, y + 10, name, { 'font-size': 26, fill: C.ink, 'font-weight': 700 });
        for (let j = s0; j < AN.length; j++) { const [, f, sc, dy] = AN[j]; f(at(rg, COLX(j), y + dy, sc * 0.86)); }
        return rg;
      });
      const catCol = g(P1, { opacity: 0 });
      el('rect', { x: COLX(9) - 40, y: RY(0) - 42, width: 80, height: RY(6) - RY(0) + 84, rx: 14, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, catCol);
      const con1 = g(P1, { opacity: 0 });
      S.pill(con1, 640, 696, '階層越低：生物越少、共同特徵越多、親緣關係越近', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.2);
      S.show(tl, head1, 's1+=0.4', 0.4);
      rows1.forEach((r, i) => S.show(tl, r, `s1+=${0.7 + i * 0.6}`, 0.4));
      S.show(tl, catCol, 's1+=5', 0.4);
      S.show(tl, con1, 's1+=5.5', 0.5);

      // ===== 2 二名法：俗名會混淆，學名全世界通用 =====
      const P2 = g(root, { opacity: 0 });
      const potato = g(P2, { opacity: 0 }), peanut = g(P2, { opacity: 0 });
      el('rect', { x: 30, y: 60, width: 560, height: 272, rx: 16, ...FRAME }, potato);
      el('rect', { x: 30, y: 380, width: 560, height: 272, rx: 16, ...FRAME }, peanut);
      B.potato(at(potato, 130, 170, 1.4));
      B.peanut(at(peanut, 130, 480, 1.3));
      const nm = (p, x, y, s, red) => S.pill(p, x, y, s, { size: 24, color: red ? '#ff9a8a' : C.ink, edge: red ? '#ff9a8a' : '#4a6272' });
      nm(potato, 330, 112, '馬鈴薯（臺灣）'); nm(potato, 330, 170, '土豆（中國大陸）', true); nm(potato, 490, 228, '洋芋');
      nm(peanut, 330, 440, '花生'); nm(peanut, 390, 498, '土豆（臺語）', true);
      const sci2 = g(P2, { opacity: 0 });
      [[300, 'Solanum tuberosum'], [622, 'Arachis hypogaea']].forEach(([y, n]) => {
        text(sci2, 160, y, '學名', { 'font-size': 22, 'text-anchor': 'end', fill: C.mute });
        text(sci2, 176, y, n, { 'font-size': 30, 'font-style': 'italic', fill: C.hi, 'font-family': 'Georgia, "Times New Roman", serif' });
      });
      const conf2 = g(P2, { opacity: 0 });
      S.pill(conf2, 310, 355, '同一個俗名，可能指不同的生物', { size: 22, color: '#ff9a8a', edge: '#ff9a8a' });
      const fmt2 = g(P2, { opacity: 0 });
      el('rect', { x: 620, y: 60, width: 550, height: 590, rx: 16, ...FRAME }, fmt2);
      text(fmt2, 895, 108, '林奈的二名法', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      text(fmt2, 895, 150, '學名 ＝ 屬名 ＋ 種小名', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const SERIF = { 'font-family': 'Georgia, "Times New Roman", serif', 'font-style': 'italic' };
      text(fmt2, 800, 262, 'Homo', { 'font-size': 54, 'text-anchor': 'middle', fill: '#9fd8ff', ...SERIF });
      text(fmt2, 990, 262, 'sapiens', { 'font-size': 54, 'text-anchor': 'middle', fill: '#ffc98a', ...SERIF });
      el('path', { d: 'M 740,284 L 740,296 L 860,296 L 860,284', fill: 'none', stroke: '#9fd8ff', 'stroke-width': 3 }, fmt2);
      el('path', { d: 'M 910,284 L 910,296 L 1070,296 L 1070,284', fill: 'none', stroke: '#ffc98a', 'stroke-width': 3 }, fmt2);
      text(fmt2, 800, 330, '屬名', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: '#9fd8ff' });
      text(fmt2, 800, 360, '第一個字母大寫', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      text(fmt2, 990, 330, '種小名', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffc98a' });
      text(fmt2, 990, 360, '全部小寫', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      text(fmt2, 895, 200, '人的學名', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      ['・用拉丁文，印刷時用斜體', '・一種生物只有一個學名', '・全世界的科學家都通用'].forEach((s, i) => text(fmt2, 670, 430 + i * 44, s, { 'font-size': 24, fill: C.ink }));
      text(fmt2, 670, 590, '例：家貓', { 'font-size': 24, fill: C.ink2 });
      text(fmt2, 790, 590, 'Felis catus', { 'font-size': 30, fill: C.hi, ...SERIF });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.2);
      S.show(tl, potato, 's2+=0.4', 0.4);
      S.show(tl, peanut, 's2+=1.2', 0.4);
      S.show(tl, conf2, 's2+=2.2', 0.4);
      S.show(tl, fmt2, 's2+=3.2', 0.5);
      S.show(tl, sci2, 's2+=4.4', 0.5);

      // ===== 3 種：能交配並產生有生殖能力的後代 =====
      const P3 = g(root, { opacity: 0 });
      const GY = 380;
      const horse = g(P3, { opacity: 0 }), donkey = g(P3, { opacity: 0 }), mule = g(P3, { opacity: 0 });
      B.horse(at(horse, 200, GY - 88 * 0.95, 0.95));
      B.donkey(at(donkey, 560, GY - (14 + 74 * 0.85) * 0.95, 0.95));
      B.mule(at(mule, 960, GY - (14 + 74 * 0.95) * 0.95, 0.95));
      [[horse, 200, '馬', 'Equus caballus'], [donkey, 560, '驢', 'Equus asinus'], [mule, 960, '騾', '馬和驢的後代']].forEach(([p, x, n, s], i) => {
        el('line', { x1: x - 130, y1: GY, x2: x + 130, y2: GY, stroke: '#3d5666', 'stroke-width': 3 }, p);
        text(p, x, GY + 46, n, { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700 });
        text(p, x, GY + 82, s, i < 2 ? { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-family': 'Georgia, "Times New Roman", serif', 'font-style': 'italic' } : { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      });
      const plus3 = g(P3, { opacity: 0 });
      text(plus3, 380, 270, '×', { 'font-size': 64, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(plus3, 380, 316, '交配', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      arrow(plus3, 700, 260, 790, 260, C.hi, 5, 18);
      const ster = g(P3, { opacity: 0 });
      S.pill(ster, 960, 130, '通常不能生殖（不孕）', { size: 24, color: '#ff9a8a', edge: '#ff9a8a' });
      const def3 = g(P3, { opacity: 0 });
      el('rect', { x: 120, y: 530, width: 960, height: 150, rx: 18, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 2 }, def3);
      text(def3, 600, 584, '同一種生物：能互相交配，並產生有生殖能力的後代', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(def3, 600, 636, '馬和驢同屬（Equus），但是不同的種', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.2);
      S.show(tl, horse, 's3+=0.4', 0.4);
      S.show(tl, donkey, 's3+=1', 0.4);
      S.show(tl, plus3, 's3+=1.6', 0.4);
      S.show(tl, mule, 's3+=2.2', 0.5);
      S.show(tl, ster, 's3+=3', 0.4);
      S.show(tl, def3, 's3+=3.8', 0.5);

      // ===== 4 五界與病毒 =====
      const P4 = g(root, { opacity: 0 });
      const KX = (j) => 279 + j * 198;
      const K = [
        ['原核生物界', (p) => { B.bacterium(at(p, -16, -18, 0.9)); B.bacterium(at(p, 22, 20, 0.9, 30)); }, '沒有細胞核', '單細胞', '依種類不同', '細菌、藍綠菌'],
        ['原生生物界', (p) => B.paramecium(at(p, 0, 0, 0.95)), '有細胞核', '多為單細胞', '自製或攝食', '草履蟲、矽藻'],
        ['菌物界', (p) => B.mushroom(at(p, 0, 0, 1.15)), '有細胞核', '多為多細胞', '吸收外界養分', '香菇、黴菌'],
        ['植物界', (p) => B.plant(at(p, 0, 4, 1)), '有細胞核', '多細胞', '光合作用自製', '蕨類、開花植物'],
        ['動物界', (p) => B.cat(at(p, -6, 10, 0.6)), '有細胞核', '多細胞', '攝食其他生物', '昆蟲、魚、鳥、貓'],
      ];
      const ROWY = { name: 250, nuc: 302, cell: 346, food: 390, ex: 436 };
      const lab4 = g(P4, { opacity: 0 });
      [['細胞核', ROWY.nuc], ['細胞數目', ROWY.cell], ['獲得養分', ROWY.food], ['例子', ROWY.ex]].forEach(([s, y]) => text(lab4, 40, y, s, { 'font-size': 22, fill: C.mute, 'font-weight': 700 }));
      el('line', { x1: 30, y1: 270, x2: 1170, y2: 270, stroke: '#2b4252', 'stroke-width': 2 }, lab4);
      const cols4 = K.map(([n, draw, a, b, c, d], j) => {
        const cg = g(P4, { opacity: 0 });
        const x = KX(j);
        el('rect', { x: x - 94, y: 60, width: 188, height: 400, rx: 16, ...FRAME }, cg);
        draw(at(cg, x, 150));
        text(cg, x, ROWY.name, n, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(cg, x, ROWY.nuc, a, { 'font-size': 21, 'text-anchor': 'middle', fill: j ? C.ink : '#ff9a8a', 'font-weight': j ? 400 : 700 });
        text(cg, x, ROWY.cell, b, { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink });
        text(cg, x, ROWY.food, c, { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink });
        text(cg, x, ROWY.ex, d, { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
        return cg;
      });
      const vir4 = g(P4, { opacity: 0 });
      el('rect', { x: 30, y: 490, width: 820, height: 200, rx: 16, fill: 'rgba(217,106,138,0.08)', stroke: '#d96a8a', 'stroke-width': 2, 'stroke-dasharray': '10 8' }, vir4);
      B.virus(at(vir4, 120, 590, 1.3));
      text(vir4, 220, 560, '病毒：沒有細胞構造', { 'font-size': 30, 'font-weight': 700, fill: '#f2a6bc' });
      text(vir4, 220, 604, '必須在其他生物的活細胞內才能繁殖', { 'font-size': 24, fill: C.ink });
      text(vir4, 220, 646, '→ 不屬於五界中的任何一界', { 'font-size': 24, fill: C.ink, 'font-weight': 700 });
      const crit4 = g(P4, { opacity: 0 });
      el('rect', { x: 880, y: 490, width: 290, height: 200, rx: 16, ...FRAME }, crit4);
      text(crit4, 1025, 532, '分界的依據', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      ['・有沒有細胞核', '・單細胞或多細胞', '・獲得養分的方式'].forEach((t, i) => text(crit4, 910, 578 + i * 38, t, { 'font-size': 23, fill: C.ink }));
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.2);
      S.show(tl, lab4, 's4+=0.4', 0.4);
      cols4.forEach((c, i) => S.show(tl, c, `s4+=${0.6 + i * 0.6}`, 0.4));
      S.show(tl, crit4, 's4+=3.6', 0.5);
      S.show(tl, vir4, 's4+=4', 0.5);

      return {
        tl,
        notes: [
          '＊約略值：目前已經命名的生物約 200 萬種，實際的種數更多。鯨生活在水中，但用肺呼吸、以乳汁哺育幼體，構造和哺乳類相似，所以是哺乳類，不是魚類。',
          '每一層只畫出幾種動物做例子。獅子也是貓科，但屬於豹屬，不是貓屬；沙貓和家貓同屬貓屬，但是不同的種。',
          '手寫學名時，可以在學名下面畫底線代替斜體。林奈是 18 世紀的瑞典生物學家。',
          '騾是驢和馬交配生下的後代，極少數曾生下後代，但非常罕見。外形差很多的狗（例如吉娃娃和黃金獵犬）能交配並生下有生殖能力的後代，所以都是同一種。',
          '＊示意：圖中的生物沒有依照真實大小（細菌和草履蟲要用顯微鏡才看得到）。原生生物界也有多細胞的藻類（如海帶）；菌物界的酵母菌是單細胞。各界的詳細內容在第十章。',
        ],
        steps: [
          '生物的種類非常多。依照<b>形態和構造的特徵</b>把生物<b>分類</b>，比較容易認識和研究；構造越相似，<b>親緣關係越近</b>。',
          '<b>分類階層</b>由大到小是<b>界、門、綱、目、科、屬、種</b>。以家貓為例：階層越低，包含的生物越少，彼此的<b>共同特徵越多</b>，親緣關係越近。',
          '同一種生物在各地的<b>俗名</b>不同，同一個俗名也可能指不同的生物。林奈的<b>二名法</b>：<b>學名＝屬名＋種小名</b>，用拉丁文、<b>斜體</b>，屬名第一個字母<b>大寫</b>。',
          '<b>種</b>是分類的基本單位：同一種的生物能互相交配，並產生<b>有生殖能力的後代</b>。馬和驢生下的騾通常不能生殖，所以馬和驢是<b>不同的種</b>。',
          '依<b>有沒有細胞核</b>、<b>細胞的數目</b>和<b>獲得養分的方式</b>，把生物分成<b>五界</b>。<b>病毒</b>沒有細胞構造，不屬於任何一界。',
        ],
      };
    },
  });
})();
