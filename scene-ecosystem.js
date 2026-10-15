/* 七下 5-3 生態系：生物與非生物環境、生產者／消費者／分解者、食物鏈與食物網、能量流動、物質循環（碳循環） */
(() => {
  const { el, g, text, C } = S;
  const B = S.B5;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const LIFE = '#6fce62', ABIO = '#8fd0ff', CO2 = '#c9d6dc', FOOD = '#9be58c', DECAY = '#d9a066', HEAT = '#ff8a5c';

  S.register({
    id: 'ecosystem', cards: true, section: '下5-3', title: '生態系',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 生物 ＋ 非生物環境 =====
      const P0 = g(root);
      el('rect', { x: 0, y: 440, width: 1200, height: 280, fill: '#22382a' }, P0);
      el('rect', { x: 0, y: 436, width: 1200, height: 10, fill: '#3f6a35' }, P0);
      el('rect', { x: 0, y: 610, width: 1200, height: 110, fill: '#3a2a1c' }, P0);
      for (let k = 0; k < 30; k++) el('ellipse', { cx: 20 + k * 41, cy: 640 + (k * 29) % 60, rx: 6 + (k % 3) * 2, ry: 4 + (k % 2) * 2, fill: '#5a4430' }, P0);
      el('ellipse', { cx: 960, cy: 520, rx: 200, ry: 50, fill: 'rgba(95,184,255,0.25)', stroke: '#8fd0ff', 'stroke-width': 3 }, P0);
      B.fish(P0, { x: 930, y: 528, len: 48, color: '#9ab8a0', fin: '#7a9a80', edge: '#3e5a46' });
      B.tree(P0, { x: 250, y: 444, h: 300, w: 220, seed: 2 });
      B.grass(P0, { x: 470, y: 444, h: 40, w: 46, seed: 3 }); B.grass(P0, { x: 680, y: 446, h: 36, w: 40, seed: 5 }); B.grass(P0, { x: 1150, y: 446, h: 34, w: 40, seed: 8 });
      B.rabbit(P0, { x: 560, y: 470, s: 0.7 });
      B.frog(P0, { x: 780, y: 480, s: 0.75 });
      B.mushrooms(P0, { x: 380, y: 452, s: 0.7 });
      B.hawkFly(P0, { x: 700, y: 240, s: 0.75, r: 12 });
      B.sun(P0, { x: 90, y: 100, rad: 36 });
      B.cloud(P0, { x: 1040, y: 110, w: 150 }); B.rain(P0, { x: 1040, y: 150, w: 90, n: 5 });
      B.wind(P0, { x: 470, y: 150 });
      B.thermo(P0, { x: 1150, y: 320, level: 0.55 });
      const bio = [
        S.callout(P0, 250, 300, 250, 380, '植物', LIFE, { size: 24 }),
        S.callout(P0, 560, 420, 560, 360, '動物', LIFE, { size: 24 }),
        S.callout(P0, 380, 440, 380, 520, '真菌、細菌', LIFE, { size: 24 }),
      ];
      const abio = [
        S.callout(P0, 90, 100, 230, 100, '陽光', ABIO, { size: 24 }),
        S.callout(P0, 520, 160, 600, 100, '空氣', ABIO, { size: 24 }),
        S.callout(P0, 1040, 176, 900, 200, '水', ABIO, { size: 24 }),
        S.callout(P0, 1150, 260, 1050, 280, '溫度', ABIO, { size: 24 }),
        S.callout(P0, 1000, 668, 1000, 604, '土壤', ABIO, { size: 24 }),
      ];
      const eq0 = g(P0, { opacity: 0 });
      S.pill(eq0, 600, 690, '生態系 ＝ 生物 ＋ 非生物環境', { size: 28, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      bio.forEach((c, i) => S.show(tl, c, `s0+=${0.4 + i * 0.4}`, 0.3));
      abio.forEach((c, i) => S.show(tl, c, `s0+=${1.8 + i * 0.4}`, 0.3));
      S.show(tl, eq0, 's0+=4.2', 0.5);

      // ===== 1 生產者、消費者、分解者 =====
      const P1 = g(root, { opacity: 0 });
      const COLS = [[40, '生產者', LIFE, '行光合作用，製造養分', '植物、藻類'], [420, '消費者', '#ffb35c', '直接或間接以生產者為食', '動物'], [800, '分解者', DECAY, '分解生物的遺體和排泄物', '細菌、真菌']];
      const cols1 = COLS.map(([x, n, col, a, b]) => {
        const cg = g(P1, { opacity: 0 });
        el('rect', { x, y: 60, width: 360, height: 520, rx: 16, ...FRAME }, cg);
        S.pill(cg, x + 180, 100, n, { size: 30, color: col, edge: col });
        text(cg, x + 180, 506, a, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
        text(cg, x + 180, 548, `例：${b}`, { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        B.ground(cg, x + 2, 420, 356, 50, { fill: '#33291c', top: '#4f7a3a', seed: x });
        return cg;
      });
      B.sun(cols1[0], { x: 110, y: 190, rad: 26 });
      B.arrow(cols1[0], 140, 214, 210, 270, { color: C.hi, w: 3, head: 12, dash: '9 6' });
      B.tree(cols1[0], { x: 270, y: 424, h: 230, w: 160, seed: 6 });
      B.grass(cols1[0], { x: 110, y: 424, h: 46, w: 50, seed: 2 });
      B.rabbit(cols1[1], { x: 520, y: 424, s: 0.75 });
      B.grass(cols1[1], { x: 610, y: 424, h: 34, w: 40, seed: 4 });
      B.hawk(cols1[1], { x: 680, y: 300, s: 0.72, flip: true });
      text(cols1[1], 500, 296, '初級消費者', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ffd0a0' });
      text(cols1[1], 670, 186, '高級消費者', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ffd0a0' });
      B.log(cols1[2], { x: 960, y: 424, w: 220 });
      B.mushrooms(cols1[2], { x: 900, y: 420, s: 0.8 });
      const lb = B.lens(cols1[2], 1080, 250, 62, 1010, 400);
      B.bacteria(lb.in, { x: 1080, y: 250, s: 1, n: 10 });
      text(cols1[2], 1066, 172, '細菌（放大＊）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const back1 = g(P1, { opacity: 0 });
      el('path', { d: 'M 980,586 L 980,606 C 980,618 972,622 956,622 L 244,622 C 228,622 220,616 220,604 L 220,598', fill: 'none', stroke: DECAY, 'stroke-width': 4, 'stroke-dasharray': '10 7' }, back1);
      el('path', { d: 'M 220,586 l -9,16 l 18,0 Z', fill: DECAY }, back1);
      S.pill(back1, 600, 676, '分解後的物質回到土壤和空氣中，再被生產者利用', { size: 24, color: DECAY, edge: DECAY });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.2);
      cols1.forEach((c, i) => S.show(tl, c, `s1+=${0.4 + i * 1.2}`, 0.5));
      S.show(tl, back1, 's1+=4', 0.5);

      // ===== 2 食物鏈與食物網 =====
      const P2 = g(root, { opacity: 0 });
      const N = {
        grass: [600, 660, '草'], hop: [300, 510, '蚱蜢'], rab: [910, 520, '野兔'], spar: [600, 410, '麻雀'],
        frog: [150, 350, '青蛙'], snake: [370, 230, '蛇'], hawk: [860, 210, '老鷹'],
      };
      const node = {};
      const at = (k) => N[k];
      const ng = g(P2);
      el('ellipse', { cx: 600, cy: 664, rx: 120, ry: 12, fill: '#2a4a2a' }, ng);
      [[520, 0], [565, 1], [610, 2], [655, 3], [690, 4]].forEach(([x, k]) => B.grass(ng, { x, y: 664, h: 50, w: 46, seed: k + 1 }));
      node.hop = B.grasshopper(ng, { x: 300, y: 520, s: 0.85 });
      node.rab = B.rabbit(ng, { x: 910, y: 540, s: 0.7 });
      node.spar = B.sparrow(ng, { x: 600, y: 420, s: 1.3 });
      node.frog = B.frog(ng, { x: 150, y: 368, s: 0.85 });
      node.snake = B.snake(ng, { x: 370, y: 244, s: 1 });
      node.hawk = B.hawk(ng, { x: 860, y: 230, s: 0.85, flip: true });
      const names = g(P2);
      Object.entries(N).forEach(([k, [x, y, s]]) => {
        const off = { grass: [0, 22], hop: [0, 38], rab: [0, 52], spar: [0, 36], frog: [0, 44], snake: [0, 44], hawk: [24, -124] }[k];
        S.pill(names, x + off[0], y + off[1], s, { size: 24, color: C.ink, edge: '#4a6272' });
      });
      // 箭頭：被吃的 → 吃牠的
      const E = [['grass', 'hop', [560, 630], [330, 548]], ['grass', 'rab', [650, 630], [860, 556]], ['grass', 'spar', [600, 624], [600, 470]],
        ['hop', 'frog', [262, 486], [190, 396]], ['hop', 'spar', [350, 492], [540, 424]], ['frog', 'snake', [180, 300], [300, 254]],
        ['spar', 'snake', [560, 360], [430, 262]], ['spar', 'hawk', [640, 360], [790, 236]], ['rab', 'hawk', [900, 440], [870, 274]], ['snake', 'hawk', [460, 214], [770, 196]]];
      const CHAIN = ['grass-hop', 'hop-frog', 'frog-snake', 'snake-hawk'];
      const arrs = E.map(([a, b, p, q]) => {
        const on = CHAIN.includes(`${a}-${b}`);
        return { on, base: B.arrow(P2, p[0], p[1], q[0], q[1], { color: '#8aa1ae', w: 3, head: 14 }), hi: on ? B.arrow(P2, p[0], p[1], q[0], q[1], { color: C.hi, w: 5, head: 18 }) : null };
      });
      arrs.forEach((a) => { a.base.style.opacity = 0; if (a.hi) a.hi.style.opacity = 0; });
      const lv = g(P2, { opacity: 0 });
      [['生產者', 690, 690], ['初級消費者', 300, 600], ['次級消費者', 142, 440], ['三級消費者', 370, 318], ['四級消費者', 720, 162]].forEach(([s, x, y]) => text(lv, x, y, s, { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi }));
      const tag2 = g(P2, { opacity: 0 });
      S.pill(tag2, 1050, 616, '黃色：其中一條食物鏈', { size: 22, color: C.hi, edge: C.hi });
      S.pill(tag2, 1050, 660, '全部交織：食物網', { size: 22, color: C.ink, edge: '#8aa1ae' });
      text(tag2, 1050, 704, '箭頭：被吃的 → 吃牠的', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      arrs.filter((a) => a.on).forEach((a, i) => { S.show(tl, a.base, `s2+=${0.8 + i * 0.6}`, 0.1); S.show(tl, a.hi, `s2+=${0.8 + i * 0.6}`, 0.4); });
      S.show(tl, lv, 's2+=3.2', 0.4);
      arrs.filter((a) => !a.on).forEach((a, i) => S.show(tl, a.base, `s2+=${3.8 + i * 0.3}`, 0.3));
      S.show(tl, tag2, 's2+=5.8', 0.4);

      // ===== 3 能量流動與能量塔 =====
      const P3 = g(root, { opacity: 0 });
      const TIERS = [['生產者', '10000', '#4f9a4a'], ['初級消費者', '1000', '#c88a3a'], ['次級消費者', '100', '#c86a3a'], ['三級消費者', '10', '#b8483a']];
      const PX = 470, PW = [560, 420, 280, 150], PY0 = 610, PH = 92;
      const tiers = TIERS.map(([n, v, col], i) => {
        const tg = g(P3, { opacity: 0 }), y = PY0 - (i + 1) * PH, w = PW[i];
        el('rect', { x: PX - w / 2, y, width: w, height: PH - 4, rx: 6, fill: col, stroke: '#0d1822', 'stroke-width': 2 }, tg);
        text(tg, PX, y + 38, n, { 'font-size': 24, 'text-anchor': 'middle', fill: '#fff', 'font-weight': 700 });
        text(tg, PX, y + 72, `${v} 單位＊`, { 'font-size': 22, 'text-anchor': 'middle', fill: '#fff6e0' });
        const hx = PX + w / 2 + 8, hy = y + 30;
        const hg = g(tg);
        el('path', { d: `M ${hx},${hy} q 12,-6 18,-18 q 6,-12 20,-16`, fill: 'none', stroke: HEAT, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, hg);
        el('path', { d: `M ${hx + 44},${hy - 36} l -14,-1 l 6,12 Z`, fill: HEAT }, hg);
        text(hg, hx + 52, hy - 30, '熱', { 'font-size': 22, fill: HEAT, 'font-weight': 700 });
        return tg;
      });
      const sun3 = B.sun(P3, { x: 90, y: 560, rad: 32 });
      sun3.style.opacity = 0;
      const sa = g(P3, { opacity: 0 });
      B.arrow(sa, 134, 562, 186, 566, { color: C.hi, w: 4, head: 14 });
      text(sa, 90, 650, '光能', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const upA = g(P3, { opacity: 0 });
      B.arrow(upA, PX, 228, PX, 150, { color: C.ink2, w: 4, head: 16 });
      text(upA, PX, 132, '能量往上傳（單向）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const pts3 = [['能量來自太陽', C.hi], ['沿著食物鏈單向流動', C.ink], ['每往上一層，只剩約 10%＊', C.ink], ['大部分在生命活動中', C.ink], ['以熱的形式散失', HEAT]].map(([s, col], i) => { const tg = g(P3, { opacity: 0 }); text(tg, 850, 180 + i * 64 + (i >= 4 ? -24 : 0), s, { 'font-size': 26, fill: col, 'font-weight': i === 2 ? 700 : 400 }); return tg; });
      const tip3 = g(P3, { opacity: 0 });
      S.pill(tip3, 600, 676, '能量塔：越上層能量越少，所以食物鏈不會太長', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.2);
      S.show(tl, sun3, 's3+=0.4', 0.4);
      S.show(tl, sa, 's3+=0.8', 0.4);
      S.show(tl, pts3[0], 's3+=0.8', 0.4);
      tiers.forEach((t, i) => S.show(tl, t, `s3+=${1.2 + i * 0.7}`, 0.4));
      S.show(tl, upA, 's3+=3.4', 0.4);
      pts3.slice(1).forEach((p, i) => S.show(tl, p, `s3+=${2 + i * 0.7}`, 0.4));
      S.show(tl, tip3, 's3+=5', 0.5);

      // ===== 4 物質循環：碳循環 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 0, y: 520, width: 1200, height: 200, fill: '#2a2218' }, P4);
      el('rect', { x: 0, y: 516, width: 1200, height: 8, fill: '#3f6a35' }, P4);
      el('rect', { x: 380, y: 44, width: 440, height: 74, rx: 37, fill: 'rgba(201,214,220,0.12)', stroke: CO2, 'stroke-width': 2.5 }, P4);
      text(P4, 600, 92, '大氣中的二氧化碳（CO₂）', { 'font-size': 28, 'text-anchor': 'middle', fill: CO2, 'font-weight': 700 });
      B.tree(P4, { x: 220, y: 522, h: 270, w: 200, seed: 5 });
      B.rabbit(P4, { x: 520, y: 524, s: 0.8 });
      B.log(P4, { x: 860, y: 524, w: 200 });
      B.factory(P4, { x: 1080, y: 522, s: 0.85 });
      const lab = (p, x, y, s, col) => text(p, x, y, s, { 'font-size': 24, 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
      const C4 = [
        ['光合作用', CO2, (p) => { B.curveArrow(p, 400, 100, 150, 280, 70, { color: LIFE, w: 4.5, head: 18 }); lab(p, 160, 150, '光合作用', LIFE); text(p, 160, 180, '吸收 CO₂', { 'font-size': 20, 'text-anchor': 'middle', fill: LIFE }); }],
        ['攝食', FOOD, (p) => { B.arrow(p, 320, 430, 450, 450, { color: FOOD, w: 4, head: 16 }); lab(p, 385, 420, '攝食', FOOD); }],
        ['呼吸作用', CO2, (p) => { B.arrow(p, 270, 290, 440, 124, { color: CO2, w: 4, head: 16 }); B.arrow(p, 560, 410, 590, 124, { color: CO2, w: 4, head: 16 }); lab(p, 420, 250, '呼吸作用', CO2); lab(p, 640, 300, '呼吸作用', CO2); }],
        ['遺體', DECAY, (p) => { el('path', { d: 'M 250,540 C 300,600 700,610 800,560 M 560,540 C 620,580 720,580 790,556', fill: 'none', stroke: DECAY, 'stroke-width': 4, 'stroke-dasharray': '9 6' }, p); el('path', { d: 'M 806,556 l -16,-2 l 8,14 Z', fill: DECAY }, p); lab(p, 520, 630, '遺體、落葉、排泄物', DECAY); }],
        ['分解作用', DECAY, (p) => { B.arrow(p, 850, 470, 760, 124, { color: CO2, w: 4, head: 16 }); lab(p, 880, 300, '分解作用', DECAY); text(p, 880, 330, '（分解者）', { 'font-size': 20, 'text-anchor': 'middle', fill: DECAY }); }],
        ['燃燒', HEAT, (p) => { B.arrow(p, 1120, 320, 830, 100, { color: CO2, w: 4, head: 16 }); lab(p, 1090, 200, '燃燒', HEAT); text(p, 1090, 230, '化石燃料', { 'font-size': 20, 'text-anchor': 'middle', fill: HEAT }); }],
      ].map(([, , fn]) => { const cg = g(P4, { opacity: 0 }); fn(cg); return cg; });
      const tip4 = g(P4, { opacity: 0 });
      S.pill(tip4, 600, 686, '物質（例如碳）可以循環利用；能量則單向流動，不能循環', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      C4.forEach((c, i) => S.show(tl, c, `s4+=${0.8 + i * 0.8}`, 0.4));
      S.show(tl, tip4, 's4+=5.8', 0.5);

      return {
        tl,
        notes: [
          '非生物環境會影響生物的分布和生存，例如水分多的地方植物長得茂盛，高山溫度低，生物的種類和平地不同。',
          '以生產者為食的是初級消費者，吃初級消費者的是次級消費者，依此類推；次級以上也稱為高級消費者。藍綠菌也能行光合作用，是生產者。＊示意：細菌畫得很大。分解者例如細菌、真菌。',
          '易錯：箭頭從「被吃的生物」指向「吃牠的生物」，表示養分和能量流動的方向。同一種生物在不同的食物鏈中，可能屬於不同級的消費者（例如老鷹）。食物網越複雜，生態系通常越穩定。',
          '＊「約 10%」是常用的估計值，實際比例會因生態系和生物種類而不同；圖中各層的寬度沒有依照比例。把各層的能量由下而上排成塔形，稱為能量塔（能量金字塔）。大部分的能量是在生物的生命活動中散失的。',
          '碳存在於許多物質中，例如二氧化碳、葡萄糖、澱粉、蛋白質。大量燃燒化石燃料會使大氣中的二氧化碳增加（第十二章會再學到）。',
        ],
        steps: [
          '<b>生態系</b>包含一個區域內所有的<b>生物</b>，以及它們生活的<b>非生物環境</b>：陽光、空氣、水、溫度、土壤等。',
          '生物依取得養分的方式分成三種角色：<b>生產者</b>行光合作用製造養分；<b>消費者</b>直接或間接以生產者為食；<b>分解者</b>分解遺體和排泄物。',
          '生物之間「吃與被吃」的關係串成<b>食物鏈</b>；許多食物鏈交錯，形成<b>食物網</b>。箭頭從<b>被吃的</b>指向<b>吃牠的</b>，表示養分和能量的流向。',
          '生態系的能量來自<b>太陽</b>，沿食物鏈<b>單向流動</b>、<b>逐層減少</b>：每一層的能量大部分以<b>熱</b>的形式散失，只有<b>約 10%</b>＊傳到下一層。',
          '<b>物質會循環</b>：二氧化碳經<b>光合作用</b>進入植物，再經<b>攝食</b>進入動物；<b>呼吸作用</b>、分解者的<b>分解作用</b>和<b>燃燒</b>又把碳以二氧化碳送回大氣。',
        ],
      };
    },
  });
})();
