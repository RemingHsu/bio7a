/* 9-3（七下 4-3）動物界：共同特徵與脊椎／無脊椎動物、無脊椎動物的六大類、節肢動物（昆蟲、甲殼類、蛛形類、多足類）、脊椎動物五大類、比較表 */
(() => {
  const { el, g, text, C } = S;
  const D = S.B4;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const INV = '#ffb35c', VER = '#7fd0ff', ENDO = '#ff8f6a', ECTO = '#62a8ff';
  const frame = (p, x, y, w, h, extra = {}) => el('rect', { x, y, width: w, height: h, rx: 16, ...FRAME, ...extra }, p);
  const T = (p, x, y, s, size = 22, fill = C.ink, extra = {}) => text(p, x, y, s, { 'font-size': size, 'text-anchor': 'middle', fill, ...extra });
  const B = (p, x, y, s, size = 28, fill = C.ink) => T(p, x, y, s, size, fill, { 'font-weight': 700 });
  const co = (p, G, pt, lx, ly, s, col, size = 22) => { const [tx, ty] = G.pt(...pt); return S.callout(p, tx, ty, lx, ly, s, col, { size }); };
  const badge = (p, x, y, n, col) => { const b = g(p); el('circle', { cx: x, cy: y, r: 14, fill: col, stroke: '#0d1822', 'stroke-width': 2 }, b); T(b, x, y + 7, String(n), 20, '#0d1822', { 'font-weight': 700 }); return b; };

  S.register({
    id: 'animals', section: '下4-3', title: '動物界',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 共同特徵；脊椎動物與無脊椎動物 =====
      const P0 = g(root);
      const feat = g(P0, { opacity: 0 });
      [['多細胞', 170], ['沒有細胞壁', 350], ['沒有葉綠體', 560], ['攝食其他生物', 780]].forEach(([s, x]) => S.pill(feat, x, 42, s, { size: 24, color: C.hi, edge: C.hi }));
      const fL = g(P0, { opacity: 0 }), fR = g(P0, { opacity: 0 });
      frame(fL, 40, 90, 545, 470, { stroke: VER, 'stroke-opacity': 0.6 }); frame(fR, 615, 90, 545, 470, { stroke: INV, 'stroke-opacity': 0.6 });
      B(fL, 312, 140, '脊椎動物：有脊椎骨', 28, VER);
      const fish = D.fish(fL, 300, 330, 1.25, { xray: true });
      const spine = co(P0, fish, fish.pts.spine, 470, 210, '脊椎骨', '#f4f4f4');
      T(fL, 312, 490, '例：魚類、兩生類、爬蟲類、', 22, C.ink2);
      T(fL, 312, 524, '鳥類、哺乳類', 22, C.ink2);
      B(fR, 887, 140, '無脊椎動物：沒有脊椎骨', 28, INV);
      D.worm(fR, 887, 250, 0.95);
      D.crab(fR, 887, 380, 0.45);
      T(fR, 887, 490, '例：水母、蚯蚓、蝸牛、', 22, C.ink2);
      T(fR, 887, 524, '螃蟹、昆蟲、海星', 22, C.ink2);
      const sum0 = g(P0, { opacity: 0 });
      S.pill(sum0, 600, 620, '依照「有沒有脊椎骨」，動物分成兩大類', { size: 26, color: C.hi, edge: C.hi });
      T(sum0, 600, 676, '地球上的動物大多是無脊椎動物', 22, C.mute);
      tl.addLabel('s0');
      S.show(tl, feat, 's0+=0.2', 0.5);
      S.show(tl, fL, 's0+=1.2', 0.5);
      S.show(tl, spine, 's0+=1.8', 0.4);
      S.show(tl, fR, 's0+=2.6', 0.5);
      S.show(tl, sum0, 's0+=3.6', 0.5);

      // ===== 1 無脊椎動物的六大類 =====
      const P1 = g(root, { opacity: 0 });
      const CX = [220, 600, 980], CY = [30, 362], CW = 360, CH = 316;
      const cards = [
        ['刺絲胞動物', '觸手上有刺絲胞，可捕食、防禦', '例：水母、珊瑚、海葵', (p, x, y) => D.jelly(p, x, y + 84, 0.5)],
        ['扁形動物', '身體的背面和腹面扁平', '例：渦蟲、絛蟲', (p, x, y) => D.planarian(p, x, y + 120, 0.95)],
        ['軟體動物', '身體柔軟、不分節，大多有殼', '例：蝸牛、文蛤、烏賊', (p, x, y) => D.snail(p, x - 6, y + 196, 0.62)],
        ['環節動物', '身體細長，由許多環節組成', '例：蚯蚓、水蛭', (p, x, y) => D.worm(p, x, y + 120, 0.82)],
        ['節肢動物', '有外骨骼，身體和腳都分節', '例：昆蟲、蝦、蟹、蜘蛛', (p, x, y) => D.bee(p, x, y + 120, 0.48)],
        ['棘皮動物', '生活在海中，體表有棘，用管足移動', '例：海星、海膽、海參', (p, x, y) => D.starfish(p, x, y + 116, 0.72, 0)],
      ].map(([n, f, ex, draw], i) => {
        const x = CX[i % 3], y = CY[Math.floor(i / 3)], c = g(P1, { opacity: 0 });
        frame(c, x - CW / 2 + 6, y, CW - 12, CH);
        draw(c, x, y);
        B(c, x, y + 236, n, 26, INV);
        T(c, x, y + 268, f, 20, C.ink);
        T(c, x, y + 298, ex, 20, C.mute);
        return c;
      });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.3);
      cards.forEach((c, i) => S.show(tl, c, `s1+=${0.5 + i * 0.7}`, 0.45));

      // ===== 2 節肢動物 =====
      const P2 = g(root, { opacity: 0 });
      const head2 = g(P2, { opacity: 0 });
      S.pill(head2, 600, 40, '節肢動物：有外骨骼（長大時要蛻皮），身體和腳都分節', { size: 24, color: INV, edge: INV });
      const FX = [40, 330, 620, 910], FW = 250;
      const panels = [
        ['昆蟲', '例：蜜蜂、蝴蝶、螞蟻', ['身體分成頭、胸、腹', '3 對腳、1 對觸角', '大多有 2 對翅'], (p) => D.bee(p, 165, 238, 0.62)],
        ['甲殼類', '例：蝦、蟹', ['身體分成頭胸部、腹部', '蝦、蟹有 5 對腳', '第 1 對常變成螯足'], (p) => D.crab(p, 455, 250, 0.52)],
        ['蛛形類', '例：蜘蛛、蠍子', ['身體分成頭胸部、腹部', '4 對腳', '沒有觸角'], (p) => D.spider(p, 745, 230, 0.6)],
        ['多足類', '例：蜈蚣、馬陸', ['身體由許多體節組成', '每節有 1～2 對腳', '1 對觸角'], (p) => D.centipede(p, 1050, 240, 0.52, -60)],
      ].map(([n, ex, lines, draw], i) => {
        const c = g(P2, { opacity: 0 });
        frame(c, FX[i], 76, FW, 560);
        const d = draw(c);
        B(c, FX[i] + FW / 2, 440, n, 28, INV);
        T(c, FX[i] + FW / 2, 472, ex, 20, C.mute);
        lines.forEach((s, k) => T(c, FX[i] + FW / 2, 516 + k * 36, s, 21, k === 0 ? C.ink : C.hi));
        return { c, d };
      });
      // 數腳（看一側）：昆蟲 3 對、蜘蛛 4 對
      const cnt = g(P2, { opacity: 0 });
      const bee = panels[0].d, sp = panels[2].d;
      [[70, -96], [100, 44], [76, 120]].forEach((pt, k) => { const [x, y] = bee.pt(...pt); badge(cnt, x + 12, y, k + 1, C.hi); });
      sp.pts.leg.forEach((pt, k) => { const [x, y] = sp.pt(...pt); badge(cnt, Math.min(x + 14, 852), y, k + 1, C.hi); });
      const foot2 = g(P2, { opacity: 0 });
      S.pill(foot2, 600, 680, '節肢動物是種類最多的一群動物；蜘蛛有 4 對腳，不是昆蟲', { size: 23, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.3);
      S.show(tl, head2, 's2+=0.4', 0.4);
      panels.forEach(({ c }, i) => S.show(tl, c, `s2+=${0.9 + i * 0.8}`, 0.5));
      S.show(tl, cnt, 's2+=4.2', 0.5);
      S.show(tl, foot2, 's2+=5', 0.5);

      // ===== 3 脊椎動物五大類 =====
      const P3 = g(root, { opacity: 0 });
      const VX = (i) => 40 + i * 226, VW = 214;
      const verts = [
        ['魚類', ['用鰓呼吸', '大多有鱗片', '生活在水中'], (p, x) => D.fish(p, x + 8, 210, 0.56)],
        ['兩生類', ['幼體用鰓呼吸', '成體用肺和皮膚', '皮膚裸露、濕潤'], (p, x) => { D.tadpole(p, x + 40, 120, 0.42); D.frog(p, x, 280, 0.66); }],
        ['爬蟲類', ['用肺呼吸', '有鱗片或骨板', '卵有卵殼'], (p, x) => D.lizard(p, x - 14, 200, 0.5)],
        ['鳥類', ['用肺呼吸', '有羽毛，前肢變成翅膀', '卵有卵殼'], (p, x) => D.bird(p, x + 6, 290, 0.66)],
        ['哺乳類', ['用肺呼吸，體表有毛', '大多胎生', '用乳汁哺育幼兒'], (p, x) => D.rabbit(p, x + 6, 290, 0.66)],
      ].map(([n, lines, draw], i) => {
        const c = g(P3, { opacity: 0 }), cx = VX(i) + VW / 2;
        frame(c, VX(i), 40, VW, 450);
        draw(c, cx);
        B(c, cx, 340, n, 28, VER);
        lines.forEach((s, k) => T(c, cx, 382 + k * 34, s, 20, k === 0 ? C.ink : C.ink2));
        return c;
      });
      const brace = (p, x1, x2, y, s, col) => { el('path', { d: `M ${x1},${y - 12} L ${x1},${y} L ${x2},${y} L ${x2},${y - 12}`, fill: 'none', stroke: col, 'stroke-width': 3 }, p); S.pill(p, (x1 + x2) / 2, y + 32, s, { size: 22, color: col, edge: col }); };
      const temp3 = g(P3, { opacity: 0 });
      brace(temp3, VX(0) + 10, VX(2) + VW - 10, 516, '外溫動物（變溫動物）', ECTO);
      brace(temp3, VX(3) + 10, VX(4) + VW - 10, 516, '內溫動物（恆溫動物）', ENDO);
      const fert3 = g(P3, { opacity: 0 });
      brace(fert3, VX(0) + 10, VX(1) + VW - 10, 616, '大多體外受精', '#9fe8da');
      brace(fert3, VX(2) + 10, VX(4) + VW - 10, 616, '體內受精', '#ffd166');
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      verts.forEach((c, i) => S.show(tl, c, `s3+=${0.5 + i * 0.8}`, 0.45));
      S.show(tl, temp3, 's3+=4.6', 0.5);
      S.show(tl, fert3, 's3+=5.4', 0.5);

      // ===== 4 比較表 =====
      const P4 = g(root, { opacity: 0 });
      const X0 = 40, LW = 170, CWd = 190, Y0 = 30, HH = 70, RH = 84;
      const cols = ['魚類', '兩生類', '爬蟲類', '鳥類', '哺乳類'];
      const rowsT = [
        ['呼吸', ['鰓', '幼體：鰓|成體：肺、皮膚', '肺', '肺', '肺']],
        ['體表', ['大多有鱗片', '皮膚裸露、濕潤', '鱗片或骨板', '羽毛', '毛髮']],
        ['受精', ['大多體外受精', '體外受精', '體內受精', '體內受精', '體內受精']],
        ['生殖', ['大多卵生', '卵生|卵沒有卵殼', '大多卵生|卵有卵殼', '卵生|卵有卵殼', '大多胎生|用乳汁哺育']],
        ['體溫', ['外溫', '外溫', '外溫', '內溫', '內溫']],
        ['例子', ['吳郭魚、鯊魚|海馬', '青蛙、蟾蜍|山椒魚', '蛇、龜、蜥蜴', '麻雀、企鵝', '人、鯨、蝙蝠']],
      ];
      const hdr = g(P4, { opacity: 0 });
      el('rect', { x: X0, y: Y0, width: LW + CWd * 5, height: HH, rx: 10, fill: '#1a3040' }, hdr);
      cols.forEach((n, i) => B(hdr, X0 + LW + CWd * (i + 0.5), Y0 + 46, n, 26, VER));
      const trs = rowsT.map(([n, cells], r) => {
        const rg = g(P4, { opacity: 0 }), y = Y0 + HH + r * RH;
        el('rect', { x: X0, y, width: LW + CWd * 5, height: RH, fill: r % 2 ? '#0f1d29' : '#122230', stroke: '#2b4252', 'stroke-width': 1 }, rg);
        B(rg, X0 + LW / 2, y + RH / 2 + 9, n, 24, C.hi);
        cells.forEach((s, i) => {
          const ls = s.split('|'), cx = X0 + LW + CWd * (i + 0.5);
          const col = n === '體溫' ? (s === '內溫' ? ENDO : ECTO) : C.ink;
          ls.forEach((t, k) => T(rg, cx, y + RH / 2 + 8 + (k - (ls.length - 1) / 2) * 28, t, 20, k ? C.ink2 : col, { 'font-weight': n === '體溫' ? 700 : 400 }));
        });
        return rg;
      });
      const land = g(P4, { opacity: 0 });
      D.arrow(land, 240, 676, 1150, 676, C.ink2, 4, 16);
      T(land, 120, 684, '越往右', 22, C.mute);
      el('rect', { x: 470, y: 656, width: 440, height: 38, rx: 19, fill: '#0d1822' }, land);
      T(land, 690, 684, '越能適應乾燥的陸地環境', 23, C.hi, { 'font-weight': 700 });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.3);
      S.show(tl, hdr, 's4+=0.4', 0.4);
      trs.forEach((r, i) => S.show(tl, r, `s4+=${0.8 + i * 0.6}`, 0.4));
      S.show(tl, land, 's4+=4.6', 0.5);

      return {
        tl,
        notes: [
          '＊示意：魚的身體畫成半透明，看得到脊椎骨。脊椎動物在分類上屬於「脊索動物門」（補充）。',
          '＊示意：動物沒有依照真實比例畫。刺絲胞動物的消化腔只有一個開口；有些扁形動物（例如絛蟲、吸蟲）會寄生在人體。烏賊、章魚的殼已經退化或消失，所以能快速移動。',
          '＊示意：動物沒有依照真實比例畫，蜘蛛前端短短的是觸肢，不是腳。昆蟲的翅：有些只有 1 對（例如蚊子、蒼蠅），有些沒有翅（例如工蟻）。蜈蚣每節 1 對腳，馬陸大多每節 2 對腳。',
          '＊示意：動物沒有依照真實比例畫。也有例外：例如鯊魚是體內受精；鴨嘴獸是卵生的哺乳類；鯨、蝙蝠都是哺乳類。',
          '＊表中是大多數的情況。兩生類的卵沒有卵殼，要產在水中；爬蟲類、鳥類的卵有卵殼，可以防止水分散失。鳥類的肺還連著許多氣囊，可以幫助呼吸（補充）。',
        ],
        steps: [
          '動物都是<b>多細胞</b>，細胞<b>沒有細胞壁</b>、沒有葉綠體，要<b>攝食</b>其他生物。依照有沒有<b>脊椎骨</b>，分成<b>脊椎動物</b>和<b>無脊椎動物</b>。',
          '常見的<b>無脊椎動物</b>：<b>刺絲胞動物、扁形動物、軟體動物、環節動物、節肢動物、棘皮動物</b>。',
          '<b>節肢動物</b>有外骨骼，身體和腳都分節。<b>昆蟲</b>：頭、胸、腹，<b>3 對腳</b>、1 對觸角；<b>蛛形類</b>：<b>4 對腳</b>，沒有觸角；蝦蟹有 5 對腳。',
          '<b>脊椎動物</b>分成<b>魚類、兩生類、爬蟲類、鳥類、哺乳類</b>。魚、兩生、爬蟲類是<b>外溫動物</b>；鳥類、哺乳類是<b>內溫動物</b>。',
          '比一比五大類的呼吸、體表、受精、生殖和體溫：越往右，越能<b>防止水分散失</b>、適應乾燥的陸地。',
        ],
      };
    },
  });
})();
