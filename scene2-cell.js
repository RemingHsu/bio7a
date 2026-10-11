/* 場景 2：細胞的構造 — 動物細胞逐一出現構造，再變成植物細胞，最後比較 */
(() => {
  const { el, g, text, C } = S;
  const CX = 690, CY = 380;

  function mito(p) {
    const m = g(p);
    el('rect', { x: -32, y: -15, width: 64, height: 30, rx: 15, fill: '#b85a2a', stroke: C.mito, 'stroke-width': 3 }, m);
    el('path', { d: 'M -22,-7 L -14,7 L -6,-7 L 2,7 L 10,-7 L 18,7', stroke: '#ffd0ad', 'stroke-width': 2.5, fill: 'none', 'stroke-linejoin': 'round' }, m);
    return m;
  }
  function chloro(p) {
    const c = g(p);
    el('ellipse', { cx: 0, cy: 0, rx: 34, ry: 16, fill: '#2f7a2a', stroke: C.chloro, 'stroke-width': 3 }, c);
    [-18, -6, 6, 18].forEach((x) => el('rect', { x: x - 4, y: -8, width: 8, height: 16, rx: 2, fill: '#9be58c' }, c));
    return c;
  }
  function nucleus(p) {
    const n = g(p);
    el('circle', { cx: 0, cy: 0, r: 62, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 4 }, n);
    const dna = ['M -40,-20 C -20,-40 0,-10 20,-30 S 40,-10 30,10', 'M -30,25 C -10,10 10,40 35,20', 'M -10,-45 C 0,-30 -25,-5 -5,5'].map((d) =>
      el('path', { d, stroke: '#d6ccff', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, n));
    el('circle', { cx: -14, cy: 12, r: 16, fill: '#7b6ad6' }, n);
    n.dna = dna;
    return n;
  }
  function vacuole(p) {
    return el('path', { d: S.smoothPath(S.blobPts(0, 0, 175, 140, 32, [[2, 0.04, 0.3], [3, 0.04, 1.1]])), fill: 'rgba(98,168,255,0.32)', stroke: C.vacuole, 'stroke-width': 3 }, p);
  }

  const ANIMAL_PTS = S.blobPts(CX, CY, 250, 195, 64);
  const PLANT_PTS = S.rectPts(CX, CY, 520, 400, 70, 64);
  const MITO_A = [[560, 300, 30], [820, 470, -20], [815, 285, 60], [575, 470, -50]];
  const MITO_P = [[495, 505, 30], [575, 543, -10], [918, 480, 90], [540, 222, 0]];
  const CHLORO = [[620, 216, 0], [760, 214, 0], [880, 234, 20], [916, 380, 90], [856, 546, 0], [690, 548, 0], [470, 420, 90]];

  // 靜態的小動物細胞（比較用）
  function staticAnimal(p) {
    el('path', { d: S.smoothPath(ANIMAL_PTS), fill: 'rgba(99,212,191,0.16)', stroke: C.membrane, 'stroke-width': 6 }, p);
    MITO_A.forEach(([x, y, r]) => mito(S.place(g(p), { x, y, r })));
    nucleus(S.place(g(p), { x: CX, y: CY }));
  }

  S.register({
    id: 'cell', section: '2-1', title: '細胞的構造',
    build(root) {
      // 左側清單
      const legend = g(root);
      const headA = text(legend, 48, 92, '動物細胞', { 'font-size': 36, 'font-weight': 700 });
      const headP = text(legend, 48, 92, '植物細胞', { 'font-size': 36, 'font-weight': 700, fill: C.chloro, opacity: 0 });
      const item = (y, name, col) => {
        const it = g(legend, { opacity: 0 });
        el('circle', { cx: 62, cy: y - 9, r: 10, fill: col }, it);
        text(it, 84, y, name, { 'font-size': 28 });
        return it;
      };
      const items = [item(160, '細胞膜', C.membrane), item(210, '細胞質', '#9fe8da'), item(260, '細胞核', C.nucleus), item(310, '粒線體', C.mito)];
      const plantHead = g(legend, { opacity: 0 });
      el('line', { x1: 48, y1: 350, x2: 290, y2: 350, stroke: C.faint, 'stroke-width': 2 }, plantHead);
      text(plantHead, 48, 388, '植物細胞還有', { 'font-size': 24, fill: C.mute });
      items.push(item(436, '細胞壁', C.wall), item(486, '葉綠體', C.chloro), item(536, '大液胞', C.vacuole));

      // 主細胞
      const cell = g(root);
      const wall = el('rect', { x: 414, y: 164, width: 552, height: 432, rx: 56, fill: 'none', stroke: C.wall, 'stroke-width': 16, opacity: 0 }, cell);
      const memb = el('path', { d: S.smoothPath(ANIMAL_PTS), fill: C.cyto, 'fill-opacity': 0.08, stroke: C.membrane, 'stroke-width': 6 }, cell);
      const rnd = S.rng(3);
      const grains = [];
      for (let i = 0; i < 30; i++) {
        const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
        grains.push(el('circle', { cx: CX + Math.cos(a) * 205 * rr, cy: CY + Math.sin(a) * 150 * rr, r: 3 + rnd() * 3, fill: '#9fe8da', opacity: 0 }, cell));
      }
      // 外層 g 只負責位置（transform 屬性），內層 g 才交給 GSAP 做縮放／淡入，避免位置被自動補償而跑掉
      const vac = vacuole(g(S.place(g(cell), { x: 735, y: 395 })));
      const mitoO = MITO_A.map(([x, y, r]) => S.place(g(cell), { x, y, r }));
      const mitos = mitoO.map((o) => mito(o));
      const chloros = CHLORO.map(([x, y, r]) => chloro(S.place(g(cell), { x, y, r })));
      const nucO = S.place(g(cell), { x: CX, y: CY });
      const nuc = nucleus(nucO);

      // 穿過細胞膜的小分子
      const movers = [];
      for (let k = 0; k < 8; k++) {
        const a = -2.6 + k * 0.72, inward = k % 2 === 0;
        const pin = [CX + Math.cos(a) * 250 * 0.8, CY + Math.sin(a) * 195 * 0.8], pout = [CX + Math.cos(a) * 250 * 1.25, CY + Math.sin(a) * 195 * 1.25];
        const d = el('circle', { cx: 0, cy: 0, r: 8, fill: inward ? C.oxygen : C.water, opacity: 0 }, root);
        movers.push({ d, from: inward ? pout : pin, to: inward ? pin : pout });
      }
      const sparks = MITO_A.map(([x, y]) => {
        const s = g(root, { opacity: 0 });
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => el('path', { d: `M${x + dx * 40},${y + dy * 30} l${dx * 14},${dy * 10}`, stroke: C.hi, 'stroke-width': 4, 'stroke-linecap': 'round' }, s));
        return s;
      });

      const call = [
        S.callout(root, 815, 211, 1080, 140, '細胞膜', C.membrane),
        S.callout(root, 600, 250, 1080, 240, '細胞質', '#9fe8da'),
        S.callout(root, 740, 345, 1080, 340, '細胞核', C.nucleus),
        S.callout(root, 820, 470, 1080, 470, '粒線體', C.mito),
        S.callout(root, 966, 300, 1080, 260, '細胞壁', C.wall),
        S.callout(root, 885, 230, 1080, 160, '葉綠體', C.chloro),
        S.callout(root, 790, 450, 1080, 470, '液胞', C.vacuole),
      ];

      // 細胞壁放大：纖維素交錯排列（示意）
      const wz = g(root, { opacity: 0 });
      el('path', { d: 'M 968,372 L 1000,340 M 968,428 L 1000,516', stroke: C.wall, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, wz);
      el('rect', { x: 960, y: 372, width: 14, height: 56, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, wz);
      el('rect', { x: 1000, y: 330, width: 180, height: 196, rx: 14, fill: '#122230', stroke: C.wall, 'stroke-width': 2 }, wz);
      el('rect', { x: 1014, y: 344, width: 152, height: 96 }, el('clipPath', { id: 'cellWallZoom' }, el('defs', {}, wz)));
      const fib = g(wz, { 'clip-path': 'url(#cellWallZoom)' });
      el('rect', { x: 1014, y: 344, width: 152, height: 96, fill: '#2e2a1c' }, fib);
      for (let i = -8; i < 16; i++) {
        el('line', { x1: 1000 + i * 16, y1: 450, x2: 1060 + i * 16, y2: 330, stroke: '#b9a35f', 'stroke-width': 5, 'stroke-linecap': 'round' }, fib);
        el('line', { x1: 1000 + i * 16, y1: 330, x2: 1060 + i * 16, y2: 450, stroke: C.wall, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.9 }, fib);
      }
      text(wz, 1090, 474, '主要成分', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(wz, 1090, 508, '纖維素', { 'font-size': 28, 'text-anchor': 'middle', fill: C.wall, 'font-weight': 700 });

      // 比較畫面
      const cmp = g(root, { opacity: 0 });
      const mini = g(cmp);
      staticAnimal(mini);
      gsap.set(mini, { svgOrigin: `${CX} ${CY}`, x: 250 - CX, y: 400 - CY, scale: 0.55 });
      text(cmp, 250, 150, '動物細胞', { 'font-size': 32, 'font-weight': 700, 'text-anchor': 'middle' });
      text(cmp, 950, 150, '植物細胞', { 'font-size': 32, 'font-weight': 700, 'text-anchor': 'middle', fill: C.chloro });
      const table = g(root, { opacity: 0 });
      const rows = [['細胞膜', '✓', '✓'], ['細胞質', '✓', '✓'], ['細胞核', '✓', '✓'], ['粒線體', '✓', '✓'], ['細胞壁', '✗', '✓'], ['葉綠體', '✗', '✓'], ['液胞', '小', '大']];
      text(table, 600, 150, '動物', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
      text(table, 690, 150, '植物', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
      const rowEls = rows.map(([n, a, p], k) => {
        const y = 200 + k * 56, plantOnly = k >= 4;
        const r = g(table);
        el('rect', { x: 410, y: y - 24, width: 330, height: 48, rx: 10, fill: plantOnly ? 'rgba(111,206,98,0.16)' : 'rgba(99,212,191,0.10)' }, r);
        text(r, 430, y + 10, n, { 'font-size': 28, 'font-weight': 700 });
        text(r, 600, y + 10, a, { 'font-size': 28, 'text-anchor': 'middle', fill: a === '✓' ? C.membrane : C.mute, 'font-weight': 700 });
        text(r, 690, y + 10, p, { 'font-size': 28, 'text-anchor': 'middle', fill: plantOnly ? C.chloro : C.membrane, 'font-weight': 700 });
        return r;
      });
      const note = text(root, 600, 668, '＊植物的根等照不到光的細胞，通常沒有葉綠體', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle', opacity: 0 });

      // ---------- 時間軸 ----------
      const tl = gsap.timeline({ paused: true });
      const step = (i) => { tl.addLabel('s' + i); if (i > 1) S.hide(tl, call[i - 2], 's' + i, 0.3); };
      const say = (i, k, t = 0.6) => { S.show(tl, call[k], `s${i}+=${t}`, 0.4); tl.fromTo(items[k], { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5 }, `s${i}+=${t}`); };

      step(0);
      S.drawOn(tl, memb, 1.6, 's0', 'power1.in', 1.35);
      tl.fromTo(memb, { attr: { 'fill-opacity': 0 } }, { attr: { 'fill-opacity': 0.08 }, duration: 0.8 }, 's0+=1');

      step(1);
      tl.to(memb, { attr: { 'stroke-width': 12 }, stroke: C.hi, duration: 0.35, yoyo: true, repeat: 1 }, 's1');
      say(1, 0, 0.3);
      movers.forEach((m, k) => {
        tl.fromTo(m.d, { attr: { cx: m.from[0], cy: m.from[1] }, opacity: 0 }, { attr: { cx: m.to[0], cy: m.to[1] }, opacity: 1, duration: 1.4, ease: 'power1.inOut' }, `s1+=${0.8 + k * 0.12}`);
        tl.to(m.d, { opacity: 0, duration: 0.3 }, `s1+=${2.2 + k * 0.12}`);
      });

      step(2);
      tl.to(memb, { attr: { 'fill-opacity': 0.28 }, duration: 0.5 }, 's2');
      tl.to(memb, { attr: { 'fill-opacity': 0.14 }, duration: 0.6 }, 's2+=0.6');
      tl.fromTo(grains, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 0.7, scale: 1, duration: 0.4, stagger: 0.025 }, 's2+=0.2');
      tl.to(grains, { x: () => (Math.random() - 0.5) * 30, y: () => (Math.random() - 0.5) * 20, duration: 2, ease: 'sine.inOut' }, 's2+=0.8');
      say(2, 1, 0.4);

      step(3);
      S.pop(tl, nuc, 's3', 0.7);
      nuc.dna.forEach((d, k) => S.drawOn(tl, d, 0.8, `s3+=${0.6 + k * 0.15}`));
      say(3, 2, 0.6);

      step(4);
      tl.fromTo(mitos, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.18 }, 's4');
      tl.fromTo(sparks, { opacity: 0 }, { opacity: 1, duration: 0.25, yoyo: true, repeat: 3, stagger: 0.1 }, 's4+=1');
      say(4, 3, 0.6);

      step(5);
      S.drive(tl, (u) => memb.setAttribute('d', S.smoothPath(S.lerpPts(ANIMAL_PTS, PLANT_PTS, u))), 1.6, 's5', 'power2.inOut');
      mitoO.forEach((o, k) => S.move(tl, o, { x: MITO_A[k][0], y: MITO_A[k][1], r: MITO_A[k][2] }, { x: MITO_P[k][0], y: MITO_P[k][1], r: MITO_P[k][2] }, 1.6, 's5'));
      tl.to(grains, { x: 0, y: 0, duration: 1.6 }, 's5');
      S.hide(tl, headA, 's5', 0.4);
      S.show(tl, [headP], 's5+=0.4', 0.4);
      tl.set(wall, { opacity: 1 }, 's5+=1.4');
      S.drawOn(tl, wall, 1.2, 's5+=1.4');
      S.show(tl, plantHead, 's5+=1.6', 0.4);
      say(5, 4, 2.2);
      S.show(tl, wz, 's5+=2.8', 0.5);

      step(6);
      S.hide(tl, wz, 's6', 0.3);
      tl.fromTo(chloros, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.12 }, 's6');
      tl.to(chloros, { scale: 1.2, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.05 }, 's6+=1.3');
      say(6, 5, 0.8);

      step(7);
      tl.fromTo(vac, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }, 's7');
      S.move(tl, nucO, { x: CX, y: CY, s: 1 }, { x: 505, y: 300, s: 0.85 }, 1.6, 's7+=0.2', 'power2.out');
      tl.to(grains.slice(0, 18), { opacity: 0, duration: 0.6 }, 's7+=0.3');
      say(7, 6, 1);

      step(8);
      S.hide(tl, legend, 's8', 0.4);
      tl.to(cell, { svgOrigin: `${CX} ${CY}`, x: 950 - CX, y: 400 - CY, scale: 0.55, duration: 1.2, ease: 'power2.inOut' }, 's8+=0.2');
      S.show(tl, cmp, 's8+=1', 0.6);
      S.show(tl, table, 's8+=1.3', 0.3);
      tl.fromTo(rowEls, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.18 }, 's8+=1.3');
      S.show(tl, note, 's8+=2.8', 0.5);

      return {
        tl,
        notes: [null,
          '＊補充：細胞膜主要由脂質和蛋白質構成。氧、二氧化碳等能直接通過；葡萄糖、胺基酸等要靠膜上特殊的蛋白質幫忙才能進出。',
          null,
          '＊補充：細胞核裡的遺傳物質（DNA）和蛋白質組成染色體，細胞分裂時最容易看到。',
          null,
          '細胞壁沒有選擇性，水和大多數溶在水中的物質都能通過；控制物質進出的是細胞膜。纖維素也是一種醣類（第三章）。＊放大圖中纖維的排列是示意。',
          '＊補充：不是所有植物細胞都有葉綠體，例如根的細胞、洋蔥表皮細胞就沒有。',
          '＊補充：有些花瓣、果實的顏色來自液胞裡的色素；動物細胞的液胞小或不明顯。',
          null],
        steps: [
          '細胞是生物體<b>構造與功能的基本單位</b>。先看一個動物細胞，例如口腔皮膜細胞。',
          '<b>細胞膜</b>：包在細胞最外層，控制物質進出細胞。',
          '<b>細胞質</b>：細胞膜以內、細胞核以外的膠狀物質，許多生命活動在這裡進行。',
          '<b>細胞核</b>：含有遺傳物質（DNA），控制細胞的生命活動。',
          '<b>粒線體</b>：進行呼吸作用，分解養分、釋放能量。',
          '換成植物細胞：細胞膜外面多了一層<b>細胞壁</b>，主要成分是<b>纖維素</b>，可以支持和保護細胞，讓形狀比較固定。',
          '<b>葉綠體</b>：含有葉綠素，能進行光合作用、製造養分。',
          '<b>液胞</b>：儲存水分和物質。成熟的植物細胞通常有一個很大的液胞，把細胞核擠到旁邊。',
          '比一比：前四種構造兩者都有；<b>細胞壁、葉綠體、大液胞</b>是植物細胞的特色。',
        ],
      };
    },
  });
})();
