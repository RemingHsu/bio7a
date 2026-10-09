/* 9-2（七下 4-2）植物界：共同特徵與分類依據（有無維管束、種子、花和果實）、蘚苔植物、蕨類植物、裸子植物、被子植物、單子葉與雙子葉 */
(() => {
  const { el, g, text, C } = S;
  const D = S.B4;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const MOSS = '#9be58c', FERN = '#6fd0a0', GYM = '#7fc8e0', ANG = '#ffb3d0', VAS = '#9fe7ff';
  const frame = (p, x, y, w, h, extra = {}) => el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME, ...extra }, p);
  const T = (p, x, y, s, size = 22, fill = C.ink, extra = {}) => text(p, x, y, s, { 'font-size': size, 'text-anchor': 'middle', fill, ...extra });
  const B = (p, x, y, s, size = 28, fill = C.ink) => T(p, x, y, s, size, fill, { 'font-weight': 700 });
  const co = (p, G, pt, lx, ly, s, col, size = 22) => { const [tx, ty] = G.pt(...pt); return S.callout(p, tx, ty, lx, ly, s, col, { size }); };
  const bullets = (p, x, y, items, size = 23, gap = 44) => items.forEach(([s, col], k) => { el('circle', { cx: x, cy: y + k * gap - size * 0.32, r: 5, fill: col || C.hi }, p); text(p, x + 16, y + k * gap, s, { 'font-size': size, fill: col || C.ink }); });

  S.register({
    id: 'plants', section: '下4-2', title: '植物界',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 共同特徵、分類依據（檢索表）=====
      const P0 = g(root);
      const feat = g(P0, { opacity: 0 });
      [['多細胞', 170], ['有細胞壁', 340], ['有葉綠體', 530], ['行光合作用，自己製造養分', 820]].forEach(([s, x]) => S.pill(feat, x, 40, s, { size: 23, color: MOSS, edge: MOSS }));
      const GX = [160, 450, 740, 1030], GY = 520;
      const groups = [
        ['蘚苔植物', MOSS, '例：土馬騌、地錢', (p) => D.moss(p, GX[0], GY, 0.62, { ground: true })],
        ['蕨類植物', FERN, '例：腎蕨、筆筒樹', (p) => D.fern(p, GX[1], GY, 0.44, { under: false })],
        ['裸子植物', GYM, '例：松、杉、蘇鐵', (p) => D.pine(p, GX[2], GY, 0.36, { cones: false })],
        ['被子植物', ANG, '例：稻、油菜、榕樹', (p) => D.flowerPlant(p, GX[3], GY, 0.52)],
      ].map(([n, col, ex, draw], i) => {
        const gg = g(P0, { opacity: 0 });
        draw(gg);
        B(gg, GX[i], 572, n, 28, col);
        T(gg, GX[i], 606, ex, 20, C.mute);
        return gg;
      });
      // 一次問一個問題的檢索路徑
      const Q = [['有維管束嗎？', 330, 120], ['有種子嗎？', 620, 200], ['有花和果實嗎？', 905, 280]];
      const qs = Q.map(([s, x, y]) => { const q = g(P0, { opacity: 0 }); S.pill(q, x, y, s, { size: 24, color: C.hi, edge: C.hi }); return q; });
      const edge = (x1, y1, x2, y2, lbl, lx, ly) => {
        const e = g(P0, { opacity: 0 });
        el('path', { d: `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2}`, fill: 'none', stroke: C.ink2, 'stroke-width': 3 }, e);
        el('path', { d: `M ${x2},${y2 + 2} l -7,-12 l 14,0 Z`, fill: C.ink2 }, e);
        T(e, lx, ly, lbl, 20, lbl === '有' ? '#8be07a' : '#ff9a8a', { 'font-weight': 700 });
        return e;
      };
      const ed = [
        edge(258, 120, GX[0], 300, '沒有', 200, 108),
        edge(402, 120, 560, 180, '有', 470, 108),
        edge(565, 200, GX[1], 320, '沒有', 510, 188),
        edge(675, 200, 840, 260, '有', 760, 188),
        edge(830, 280, GX[2], 330, '沒有', 785, 268),
        edge(980, 280, GX[3], 300, '有', 1010, 268),
      ];
      const repro = g(P0, { opacity: 0 });
      [[GX[0], GX[1], '靠孢子繁殖', '#d9b98a'], [GX[2], GX[3], '靠種子繁殖', '#ffd166']].forEach(([a, b, s, col]) => {
        el('path', { d: `M ${a - 40},640 L ${a - 40},650 L ${b + 40},650 L ${b + 40},640`, fill: 'none', stroke: col, 'stroke-width': 2.5 }, repro);
        S.pill(repro, (a + b) / 2, 680, s, { size: 22, color: col, edge: col });
      });
      tl.addLabel('s0');
      S.show(tl, feat, 's0+=0.2', 0.5);
      [[0, 1.2], [1, 1.6], [2, 2.1]].forEach(([k, t]) => S.show(tl, qs[k], `s0+=${t}`, 0.35));
      [[0, 1.5], [1, 1.5], [2, 2.0], [3, 2.0], [4, 2.5], [5, 2.5]].forEach(([k, t]) => S.show(tl, ed[k], `s0+=${t + 0.3}`, 0.35));
      [[0, 2.1], [1, 2.6], [2, 3.1], [3, 3.1]].forEach(([k, t]) => S.show(tl, groups[k], `s0+=${t + 0.4}`, 0.45));
      S.show(tl, repro, 's0+=4.4', 0.5);

      // ===== 1 蘚苔植物 =====
      const P1 = g(root, { opacity: 0 });
      const f1 = g(P1);
      frame(f1, 40, 40, 620, 640);
      B(f1, 350, 88, '土馬騌（蘚苔植物）', 28, MOSS);
      const moss = D.moss(f1, 340, 520, 1.55);
      const c1 = [
        co(P1, moss, moss.pts.capsule, 520, 150, '孢子囊（內有孢子）', '#e0b070'),
        co(P1, moss, [-80, -60], 160, 300, '類似莖和葉的構造', MOSS, 20),
        co(P1, moss, moss.pts.rhizoid, 470, 640, '假根：固著在土壤上', '#d9b98a'),
      ];
      const f1r = g(P1, { opacity: 0 });
      frame(f1r, 690, 40, 470, 270);
      B(f1r, 925, 86, '地錢（蘚苔植物）', 26, MOSS);
      D.liverwort(f1r, 925, 200, 0.95);
      T(f1r, 925, 292, '扁平，貼在潮濕的地面上', 21, C.ink2);
      const f1t = g(P1, { opacity: 0 });
      frame(f1t, 690, 330, 470, 350);
      B(f1t, 925, 376, '蘚苔植物的特徵', 26);
      bullets(f1t, 716, 432, [['沒有維管束，植物體矮小', VAS], ['沒有真正的根、莖、葉', C.ink], ['用假根固著在土壤、岩石上', C.ink], ['靠孢子繁殖', '#e0b070'], ['生長在潮濕的地方', C.water]], 22, 50);
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      c1.forEach((c, i) => S.show(tl, c, `s1+=${0.9 + i * 0.6}`, 0.35));
      S.show(tl, f1r, 's1+=2.8', 0.5);
      S.show(tl, f1t, 's1+=3.6', 0.5);

      // ===== 2 蕨類植物 =====
      const P2 = g(root, { opacity: 0 });
      const f2 = g(P2);
      frame(f2, 40, 40, 620, 650);
      B(f2, 350, 86, '腎蕨（蕨類植物）', 28, FERN);
      const fern = D.fern(f2, 350, 530, 1.2);
      const c2 = [
        co(P2, fern, fern.pts.frond, 560, 150, '葉（羽狀複葉）', FERN),
        co(P2, fern, fern.pts.fiddle, 150, 160, '幼葉捲曲', '#b8e070'),
        co(P2, fern, fern.pts.rhizome, 150, 600, '地下莖', '#d9a066'),
        co(P2, fern, [60, 70], 520, 650, '根', '#e8d8b0'),
      ];
      const f2r = g(P2, { opacity: 0 });
      frame(f2r, 690, 40, 470, 400);
      B(f2r, 925, 86, '翻到葉背看看', 26);
      const pin = D.pinnaSori(f2r, 925, 170, 0.92);
      const soriCo = co(f2r, pin, pin.pts.sorus, 800, 250, '孢子囊堆', '#d9a066');
      soriCo.style.opacity = 1;
      const zz = g(f2r);
      const [sx, sy] = pin.pt(...pin.pts.sorus);
      el('circle', { cx: sx, cy: sy, r: 14, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zz);
      el('line', { x1: sx + 10, y1: sy + 10, x2: 980, y2: 290, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6' }, zz);
      D.sporangium(f2r, 1000, 350, 0.9, { open: true });
      T(f2r, 900, 362, '孢子囊', 22, '#e0b070', { 'font-weight': 700 });
      T(f2r, 1110, 340, '孢子', 22, '#e0b070', { 'font-weight': 700 });
      const f2t = g(P2, { opacity: 0 });
      frame(f2t, 690, 460, 470, 230);
      bullets(f2t, 716, 510, [['有維管束，有真正的根、莖、葉', VAS], ['莖大多長在地下（地下莖）', '#d9a066'], ['不開花，靠孢子繁殖', '#e0b070'], ['喜歡陰涼潮濕的地方', C.water]], 22, 46);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      c2.forEach((c, i) => S.show(tl, c, `s2+=${0.9 + i * 0.5}`, 0.35));
      S.show(tl, f2r, 's2+=3', 0.5);
      S.show(tl, f2t, 's2+=4.2', 0.5);

      // ===== 3 裸子植物 =====
      const P3 = g(root, { opacity: 0 });
      const f3 = g(P3);
      frame(f3, 40, 40, 360, 650);
      B(f3, 220, 86, '松（裸子植物）', 26, GYM);
      const pine = D.pine(f3, 220, 640, 0.86);
      const f3b = g(P3, { opacity: 0 });
      frame(f3b, 420, 40, 740, 380);
      B(f3b, 600, 86, '松的枝條（放大）', 24);
      const br = D.pineBranch(f3b, 640, 230, 0.86);
      const c3 = [
        co(P3, br, br.pts.needle, 760, 86, '針狀葉', '#6fbf6a'),
        co(P3, br, br.pts.female, 520, 380, '雌毬果', '#d9a066'),
        co(P3, br, br.pts.male, 830, 380, '雄毬果（產生花粉）', '#e8b04a'),
      ];
      const f3c = g(P3, { opacity: 0 });
      frame(f3c, 420, 440, 360, 250);
      B(f3c, 600, 478, '雌毬果的一片鱗片（放大）', 22);
      const scl = D.coneScale(f3c, 500, 598, 0.6);
      [co(f3c, scl, scl.pts.wing, 598, 540, '翅', '#f0d7a0', 20), co(f3c, scl, scl.pts.seed, 598, 640, '種子', '#d9a066', 20)].forEach((c) => { c.style.opacity = 1; });
      B(f3c, 712, 566, '種子裸露', 24, C.hi);
      T(f3c, 712, 604, '沒有果實包住', 21, C.ink2);
      const f3d = g(P3, { opacity: 0 });
      frame(f3d, 800, 440, 360, 250);
      bullets(f3d, 822, 490, [['有維管束、有種子', VAS], ['沒有花，也沒有果實', C.hi], ['葉子大多是針狀', '#6fbf6a'], ['例：松、杉、柏、蘇鐵、銀杏', C.ink2]], 21, 46);
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, f3b, 's3+=1', 0.5);
      c3.forEach((c, i) => S.show(tl, c, `s3+=${1.5 + i * 0.5}`, 0.35));
      S.show(tl, f3c, 's3+=3.2', 0.5);
      S.show(tl, f3d, 's3+=4', 0.5);
      void pine;

      // ===== 4 被子植物：有花，種子包在果實裡 =====
      const P4 = g(root, { opacity: 0 });
      const f4 = g(P4);
      frame(f4, 40, 40, 520, 650);
      B(f4, 300, 86, '花（縱切）', 28, ANG);
      const fl = D.flowerSection(f4, 300, 500, 1.3);
      const c4 = [
        co(P4, fl, fl.pts.petal, 110, 160, '花瓣', '#f29ac4'),
        co(P4, fl, fl.pts.stamen, 480, 150, '雄蕊', '#ffd166'),
        co(P4, fl, fl.pts.pistil, 480, 230, '雌蕊', '#8fcf6a'),
        co(P4, fl, fl.pts.ovary, 470, 560, '子房', '#8fcf6a'),
        co(P4, fl, fl.pts.ovule, 110, 600, '胚珠', '#f6f2e0'),
      ];
      const f4r = g(P4, { opacity: 0 });
      frame(f4r, 600, 40, 560, 370);
      B(f4r, 880, 86, '果實（剖開的豆莢）', 26);
      const pod = D.podOpen(f4r, 880, 230, 1.35);
      const c4r = [co(P4, pod, pod.pts.seed, 1010, 340, '種子', '#d6f2a0'), co(P4, pod, pod.pts.fruit, 760, 340, '果實', '#8fcf6a')];
      const map4 = g(P4, { opacity: 0 });
      D.arrow(map4, 520, 470, 640, 470, C.ink2, 4, 14);
      B(map4, 860, 456, '子房 → 果實', 26, '#8fcf6a');
      B(map4, 860, 500, '胚珠 → 種子', 26, '#d6f2a0');
      T(map4, 860, 540, '（受精以後發育而成）', 20, C.mute);
      const f4t = g(P4, { opacity: 0 });
      S.pill(f4t, 880, 600, '被子植物：有花，種子包在果實裡', { size: 24, color: ANG, edge: ANG });
      T(f4t, 880, 650, '又稱開花植物；常見的花草、樹木、蔬菜大多是', 21, C.ink2);
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      c4.forEach((c, i) => S.show(tl, c, `s4+=${0.8 + i * 0.4}`, 0.35));
      S.show(tl, f4r, 's4+=3', 0.5);
      c4r.forEach((c, i) => S.show(tl, c, `s4+=${3.5 + i * 0.3}`, 0.35));
      S.show(tl, map4, 's4+=4.2', 0.5);
      S.show(tl, f4t, 's4+=5', 0.5);

      // ===== 5 單子葉 vs 雙子葉 =====
      const P5 = g(root, { opacity: 0 });
      const RY = [166, 276, 386, 496, 606], XD = 400, XM = 820;
      const head5 = g(P5);
      el('rect', { x: 40, y: 30, width: 1120, height: 84, rx: 12, fill: '#1a3040' }, head5);
      B(head5, 520, 68, '雙子葉植物', 28, '#ffd166');
      T(head5, 520, 100, '例：綠豆、花生、向日葵', 20, C.mute);
      B(head5, 950, 68, '單子葉植物', 28, '#7fd0ff');
      T(head5, 950, 100, '例：玉米、稻、百合', 20, C.mute);
      const rows = [
        ['子葉', (p) => D.beanSeed(p, XD, RY[0], 0.62), '2 片子葉', (p) => D.cornSeed(p, XM, RY[0], 0.6), '1 片子葉'],
        ['葉脈', (p) => D.leafNet(p, XD - 70, RY[1] + 12, 0.62, -16), '網狀脈', (p) => D.leafPar(p, XM - 64, RY[1] + 16, 0.58, -16), '平行脈'],
        ['莖的維管束', (p) => D.stemSection(p, XD, RY[2], 0.82, true), '排成環狀', (p) => D.stemSection(p, XM, RY[2], 0.82, false), '散生'],
        ['花瓣數', (p) => D.flowerTop(p, XD, RY[3], 0.78, 5), '4 或 5 的倍數', (p) => D.flowerTop(p, XM, RY[3], 0.78, 3, { fill: '#c86ad0', edge: '#f0b0f0' }), '3 的倍數'],
        ['根', (p) => D.roots(p, XD, RY[4] - 30, 0.62, true), '軸根（有主根）', (p) => D.roots(p, XM, RY[4] - 30, 0.62, false), '鬚根'],
      ].map(([n, dDi, tDi, dMo, tMo], i) => {
        const rg = g(P5, { opacity: 0 });
        el('rect', { x: 40, y: RY[i] - 52, width: 1120, height: 104, rx: 10, fill: i % 2 ? '#0f1d29' : '#122230' }, rg);
        B(rg, 135, RY[i] + 9, n, 24, C.hi);
        dDi(rg); dMo(rg);
        text(rg, XD + 80, RY[i] + 9, tDi, { 'font-size': 24, fill: '#ffd166', 'font-weight': 700 });
        text(rg, XM + 80, RY[i] + 9, tMo, { 'font-size': 24, fill: '#7fd0ff', 'font-weight': 700 });
        return rg;
      });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      rows.forEach((r, i) => S.show(tl, r, `s5+=${0.7 + i * 0.8}`, 0.45));

      return {
        tl,
        notes: [
          '＊示意：植物沒有依照真實比例畫。植物是由水中的藻類演化而來；「有沒有維管束」「有沒有種子」「有沒有花和果實」，一次只看一個特徵，就能把植物分成四大類。',
          '＊示意：植物體放大了，真實的土馬騌只有幾公分高。蘚苔植物外表有角質層；沒有維管束，水分和養分的運輸較慢，所以個體矮小。受精需要水，因此要生長在潮濕的地方。',
          '＊示意：葉背的孢子囊堆是許多孢子囊聚在一起；孢子囊和孢子要用顯微鏡才看得清楚。少數蕨類的莖直立在地面上，例如筆筒樹；臺灣有很多種蕨類。',
          '＊示意：枝條和鱗片都放大了。毬果是裸子植物的生殖構造，分成雌毬果和雄毬果；雄毬果的花粉靠風傳到雌毬果上。銀杏是裸子植物，葉子是扇形的，種子俗稱白果。',
          '＊示意：花的構造簡化了。被子植物的種子外面有果實保護，後代存活率高，所以種類最多。',
          '＊示意：各部分沒有依照比例畫。大多數情況是這樣，也有例外。雙子葉植物的莖有形成層；單子葉植物通常沒有形成層。',
        ],
        steps: [
          '植物都是<b>多細胞</b>、有<b>細胞壁</b>和<b>葉綠體</b>，能行光合作用。依序問：<b>有維管束嗎？有種子嗎？有花和果實嗎？</b>就能分成四大類。',
          '<b>蘚苔植物</b>（例：土馬騌、地錢）：<b>沒有維管束</b>，植物體矮小；沒有真正的根莖葉，用<b>假根</b>固著；靠<b>孢子</b>繁殖，生長在潮濕的地方。',
          '<b>蕨類植物</b>：<b>有維管束</b>，有根、莖、葉，莖常長在地下；<b>幼葉捲曲</b>。葉背的<b>孢子囊堆</b>裡有許多孢子囊，靠<b>孢子</b>繁殖。',
          '<b>裸子植物</b>（例：松、杉、蘇鐵、銀杏）：有種子，但<b>沒有花，也沒有果實</b>，種子長在毬果的鱗片上，<b>裸露</b>在外。',
          '<b>被子植物</b>有<b>花</b>：受精後，<b>子房</b>發育成<b>果實</b>，<b>胚珠</b>發育成<b>種子</b>，所以種子<b>包在果實裡</b>。',
          '被子植物分成<b>雙子葉</b>和<b>單子葉</b>植物：比較子葉數、葉脈、莖的維管束、花瓣數和根。',
        ],
      };
    },
  });
})();
