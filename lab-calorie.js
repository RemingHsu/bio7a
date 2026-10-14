/* 互動模型：食物熱量的測定 — 燃燒食物加熱水，讀溫度、自己算熱量；比較包裝標示、防風罩、公平比較 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  // 每公克的熱量（大卡），依一般營養標示的約略值＊
  const FOODS = { peanut: ['花生', 5.8, '#d9a066'], cashew: ['腰果', 5.5, '#efd9a8'], mallow: ['棉花糖', 3.2, '#f6f2f8'] };
  const EFF = { open: 0.25, shield: 0.45 }; // 水真正吸收到的比例（示意）
  const T0 = 25;

  const MISSIONS = [
    { title: '算出熱量', text: '燃燒 <b>1 g 花生</b>，加熱 <b>100 mL 水</b>。燒完後讀出水溫上升多少，算出水吸收了多少熱量。', acts: [['點燃花生', 'peanut', 'open']], calc: (r) => r.food === 'peanut' && r.water === 100 && r.setup === 'open',
      why: '熱量 ＝ 水的質量 × 上升的溫度。100 mL 水約 100 g；1 g 水上升 1 °C 需要 1 卡，1000 卡 ＝ 1 大卡。' },
    { title: '為什麼比較少？', quiz: { q: '包裝上標示 1 g 花生約有 5.8 大卡＊，但我們只測到 1～2 大卡。主要原因是？', opts: ['花生的熱量標示錯了', '很多熱散失到空氣中，沒有被水吸收', '水太多，把熱量稀釋了'], ans: 1, hint: '火焰的熱除了往上加熱鋁罐，還會往哪裡跑？' },
      why: '燃燒時很多熱散失到空氣中，鋁罐和溫度計也會吸熱，有些能量變成光，花生也可能沒燒完，所以水吸收到的熱量比食物實際含有的少。' },
    { title: '減少熱散失', text: '加上<b>防風罩</b>，其他條件不變，再燒一次花生，和剛才比較。', acts: [['加防風罩，再燒一次花生', 'peanut', 'shield']], pre: ['peanut', 'open'], done: (rs) => rs.some((r) => r.food === 'peanut' && r.water === 100 && r.setup === 'shield') && rs.some((r) => r.food === 'peanut' && r.water === 100 && r.setup === 'open'),
      // pre：跳過任務 1 直接來做時，自動補上「剛才」不加防風罩的那一次
      why: '防風罩讓熱比較不容易散失，水吸收到的熱量變多，測得的值更接近實際。' },
    { title: '公平比較', quiz: { q: '想比較「花生和棉花糖哪一個熱量比較多」，下列哪一項<b>必須保持相同</b>？', opts: ['食物的種類', '食物的質量、水量和裝置', '水上升的溫度'], ans: 1, hints: ['如果兩次燒的食物種類都一樣，還比得出哪一種熱量比較多嗎？', '', '水上升幾度，要燒完才量得到。這是能事先保持相同的條件嗎？'] },
      why: '操縱變因是食物種類；食物質量、水量、裝置（有沒有防風罩、距離）都要相同；水上升的溫度是應變變因。' },
    { title: '誰的熱量多？', text: '用相同條件（1 g、100 mL 水、不加防風罩），分別燒<b>花生</b>和<b>棉花糖</b>。', acts: [['燒花生', 'peanut', 'open'], ['燒棉花糖', 'mallow', 'open']], done: (rs) => ['peanut', 'mallow'].every((f) => rs.some((r) => r.food === f && r.water === 100)) && (() => { const a = rs.filter((r) => r.water === 100); return a.some((p) => p.food === 'peanut' && a.some((m) => m.food === 'mallow' && m.setup === p.setup)); })(),
      why: '花生含有很多<b>脂質</b>（每公克約 9 大卡），棉花糖主要是<b>醣類</b>（每公克約 4 大卡），所以相同質量的花生放出的熱量比較多。' },
    { title: '看營養標示', label: true, quiz: { q: '圖中是一包洋芋片的營養標示，熱量那一列先遮起來了。<b>一份</b>大約有多少大卡？', sub: '醣類、蛋白質約 4 大卡／公克，脂質約 9 大卡／公克＊。標示上的「碳水化合物」就是醣類，「脂肪」屬於脂質。飽和脂肪、糖已經算在脂肪、碳水化合物裡，不要再加一次。',
      opts: ['約 112 大卡', '約 162 大卡', '約 252 大卡', '約 540 大卡'], ans: 1,
      hints: ['脂肪每公克的熱量，和蛋白質、碳水化合物一樣嗎？', '', '只有脂肪約 9 大卡／公克，蛋白質和碳水化合物呢？', '題目問的是「一份」，要看標示的哪一欄？'] },
      why: '一份：蛋白質 2 × 4 ＋ 脂肪 10 × 9 ＋ 碳水化合物 16 × 4 ＝ 8 ＋ 90 ＋ 64 ＝ <b>162 大卡</b>。脂肪只有 10 公克，熱量卻超過一半。看標示要分清楚「每份」和「每 100 公克」；這包有 2 份，全部吃完約 324 大卡。' },
  ];

  S.registerLab({
    id: 'lab-calorie', section: '3-1', title: '食物熱量實驗',
    mount(box) {
      box.innerHTML = `
<style>
  .labC { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; min-width: 0; }
  .labC .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labC .pad { padding: 1rem 1.25rem; }
  .labC .seg-ctl button:disabled, .labC .ctl:disabled { opacity: 0.4; cursor: not-allowed; }
  .labC .calc { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin: 0.5rem 0; }
  .labC .calc input { font: inherit; width: 6em; padding: 0.35em 0.5em; border-radius: 0.5rem; border: 1px solid var(--line); background: var(--bg); color: var(--ink); }
  .labC .table-wrap { overflow-x: auto; }
  .labC .tbl { min-width: 22rem; }
  @media (max-width: 900px) {
    .labC { display: flex; flex-direction: column; align-items: stretch; }
    .labC .col { display: contents; }
    .labC .c-stage { order: 1; } .labC .c-mis { order: 2; } .labC .c-table { order: 3; } .labC .c-ctl { order: 4; }
  }
</style>
<div class="labC">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 560" role="img" aria-label="燃燒食物加熱鋁罐中的水，溫度計顯示水溫"></svg></div>
      <div class="pad"><p class="status-line" id="labC-status" aria-live="polite"></p>
        <p class="footnote">＊示意：食物的熱量和洋芋片的營養標示，都是一般市售包裝的約略值；水吸收到的比例（沒有防風罩約 25%、有防風罩約 45%）是為了示範而設定的，真實結果會因裝置而不同。燃燒實驗要在老師指導下進行，注意用火安全。</p></div>
    </div>
    <div class="card pad c-table"><h3>實驗紀錄</h3><div class="table-wrap" id="labC-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labC-mission"></div>
    <details class="card pad free c-ctl" id="labC-free"><summary>自由探索：自己選食物、水量和裝置</summary>
      <div class="field"><div class="field-head"><span>食物（1 g）</span></div>
        <div class="seg-ctl" role="group" aria-label="食物" id="labC-food">${Object.entries(FOODS).map(([k, [n]]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>鋁罐中的水</span></div>
        <div class="seg-ctl" role="group" aria-label="水量" id="labC-water">${[50, 100, 200].map((w) => `<button type="button" data-v="${w}">${w} mL</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>裝置</span></div>
        <div class="seg-ctl" role="group" aria-label="裝置" id="labC-setup"><button type="button" data-v="open">不加防風罩</button><button type="button" data-v="shield">加防風罩</button></div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labC-go">點燃食物</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labC-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 560, fill: C.bg }, svg);
      const top = g(svg);
      const root = g(top); // 燃燒裝置
      const st = { food: 'peanut', water: 100, setup: 'open' };
      const runs = [];
      let tl = null, burning = false;

      // ---------- 裝置 ----------
      const CXc = 480;
      // 鐵架
      el('rect', { x: 150, y: 520, width: 300, height: 14, rx: 4, fill: '#4a5a66' }, root);
      el('rect', { x: 196, y: 100, width: 10, height: 424, fill: '#4a5a66' }, root);
      el('rect', { x: 200, y: 214, width: CXc - 260, height: 8, fill: '#4a5a66' }, root);
      // 鋁罐
      el('rect', { x: CXc - 70, y: 150, width: 140, height: 150, rx: 10, fill: '#9aa8b2', stroke: '#d6e0e6', 'stroke-width': 3 }, root);
      const waterR = el('rect', { x: CXc - 64, y: 200, width: 128, height: 94, rx: 6, fill: 'rgba(95,184,255,0.55)' }, root);
      // 標籤放在鋁罐左上方：放在右邊會被防風罩切過、也會碰到右邊的公式框
      text(root, 490, 104, '鋁罐中的水', { 'font-size': 22, fill: C.mute, 'text-anchor': 'end' });
      const waterLbl = text(root, 490, 136, '', { 'font-size': 22, fill: C.ink2, 'text-anchor': 'end' });
      // 溫度計
      el('rect', { x: CXc + 22, y: 40, width: 14, height: 230, rx: 7, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, root);
      el('circle', { cx: CXc + 29, cy: 276, r: 12, fill: '#ff5f74' }, root);
      const col = el('rect', { x: CXc + 25, y: 200, width: 8, height: 76, fill: '#ff5f74' }, root);
      const tRead = text(root, CXc + 120, 70, '', { 'font-size': 40, 'font-weight': 700, fill: C.hi, class: 'mono' });
      const tSub = text(root, CXc + 120, 112, '水溫', { 'font-size': 20, fill: C.mute });
      // 食物（插在針上）
      el('rect', { x: CXc - 30, y: 500, width: 60, height: 22, rx: 6, fill: '#a8742e' }, root);
      el('line', { x1: CXc, y1: 500, x2: CXc, y2: 440, stroke: '#cfd8dc', 'stroke-width': 3 }, root);
      const foodE = el('ellipse', { cx: CXc, cy: 430, rx: 22, ry: 15, fill: FOODS.peanut[2] }, root);
      const flame = g(root, { opacity: 0 });
      const fl1 = el('path', { d: `M ${CXc},420 C ${CXc - 34},400 ${CXc - 24},350 ${CXc},310 C ${CXc + 24},350 ${CXc + 34},400 ${CXc},420 Z`, fill: '#ff8a3c' }, flame);
      el('path', { d: `M ${CXc},418 C ${CXc - 16},404 ${CXc - 12},372 ${CXc},350 C ${CXc + 12},372 ${CXc + 16},404 ${CXc},418 Z`, fill: '#ffd166' }, flame);
      // 散失的熱（箭頭）
      const loss = g(root, { opacity: 0 });
      [[-1, 360], [1, 380], [-1, 330], [1, 340]].forEach(([d, y], i) => el('path', { d: `M ${CXc + d * 40},${y} q ${d * 30},-10 ${d * 70},${-20 - i * 6}`, fill: 'none', stroke: '#ff9a6c', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '8 8' }, loss));
      // 分兩行：鐵架和防風罩之間只有約 160 寬
      text(loss, CXc - 194, 458, '熱散失', { 'font-size': 22, fill: '#ff9a6c', 'text-anchor': 'middle' });
      text(loss, CXc - 194, 490, '到空氣中', { 'font-size': 22, fill: '#ff9a6c', 'text-anchor': 'middle' });
      // 防風罩
      const shield = g(root, { opacity: 0 });
      el('path', { d: `M ${CXc - 110},520 L ${CXc - 110},170 M ${CXc + 110},520 L ${CXc + 110},170`, stroke: '#cfd8dc', 'stroke-width': 8, 'stroke-linecap': 'round' }, shield);
      text(shield, CXc + 124, 470, '防風罩', { 'font-size': 20, fill: '#cfd8dc' });
      // 公式
      const formula = g(root, { opacity: 0 });
      el('rect', { x: 760, y: 170, width: 410, height: 250, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, formula);
      text(formula, 965, 214, '熱量 ＝ 水的質量 × 上升的溫度', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(formula, 965, 256, '1 g 水上升 1 °C ＝ 1 卡', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(formula, 965, 292, '1 大卡 ＝ 1000 卡', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const fLine = text(formula, 965, 350, '', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const fLine2 = text(formula, 965, 390, '', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });

      // ---------- 營養標示（任務 6） ----------
      const lab = g(top, { opacity: 0 });
      lab.style.display = 'none';
      el('rect', { x: 90, y: 28, width: 470, height: 500, rx: 8, fill: '#fbfaf5', stroke: '#c9c4b4', 'stroke-width': 2 }, lab);
      const LK = '#1d2328', LT = { fill: LK };
      text(lab, 110, 70, '營養標示', { 'font-size': 30, 'font-weight': 700, ...LT });
      el('line', { x1: 106, y1: 84, x2: 544, y2: 84, stroke: LK, 'stroke-width': 4 }, lab);
      text(lab, 110, 116, '每一份量 30 公克', { 'font-size': 22, ...LT });
      text(lab, 110, 148, '本包裝含 2 份', { 'font-size': 22, ...LT });
      el('line', { x1: 106, y1: 164, x2: 544, y2: 164, stroke: LK, 'stroke-width': 2 }, lab);
      text(lab, 380, 194, '每份', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'end', ...LT });
      text(lab, 540, 194, '每 100 公克', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'end', ...LT });
      el('line', { x1: 106, y1: 208, x2: 544, y2: 208, stroke: LK, 'stroke-width': 2 }, lab);
      const ROWS = [['熱量', '162 大卡', '540 大卡'], ['蛋白質', '2.0 公克', '6.7 公克'], ['脂肪', '10.0 公克', '33.3 公克'], ['　飽和脂肪', '4.5 公克', '15.0 公克'], ['　反式脂肪', '0 公克', '0 公克'], ['碳水化合物', '16.0 公克', '53.3 公克'], ['　糖', '0.5 公克', '1.7 公克'], ['鈉', '150 毫克', '500 毫克']];
      const RY = (i) => 240 + i * 36;
      ROWS.forEach(([n, a, b], i) => {
        const sub = n.startsWith('　');
        text(lab, 110, RY(i), n, { 'font-size': sub ? 21 : 23, ...LT, 'font-weight': i === 0 ? 700 : 400 });
        text(lab, 380, RY(i), a, { 'font-size': 23, 'text-anchor': 'end', ...LT, 'font-weight': i === 0 ? 700 : 400 });
        text(lab, 540, RY(i), b, { 'font-size': 23, 'text-anchor': 'end', ...LT, 'font-weight': i === 0 ? 700 : 400 });
        if (i < ROWS.length - 1) el('line', { x1: 106, y1: RY(i) + 12, x2: 544, y2: RY(i) + 12, stroke: '#c9c4b4', 'stroke-width': 1 }, lab);
      });
      const cover = g(lab);
      [[262, 124], [410, 134]].forEach(([x, w]) => {
        el('rect', { x, y: RY(0) - 25, width: w, height: 34, rx: 6, fill: '#7d8b94' }, cover);
        text(cover, x + w / 2, RY(0) + 1, '？', { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle', fill: '#fff' });
      });
      // 標示旁的提示
      const tag = (y, s, c) => { el('line', { x1: 548, y1: y - 8, x2: 580, y2: y - 8, stroke: c, 'stroke-width': 2.5 }, lab); S.pill(lab, 580 + (S.textWidth(s, S.effSize(lab, 22)) + 28) / 2, y - 8, s, { size: 22, color: c, edge: c }); };
      tag(RY(2), '屬於脂質', '#ffb35c');
      tag(RY(5), '＝ 醣類', C.sugar);
      // 洋芋片包裝
      const bag = S.place(g(lab), { x: 850, y: 136 });
      el('path', { d: 'M -70,-86 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-8 l 10,8 C 76,-30 76,30 70,86 l -10,8 l -10,-8 l -10,8 l -10,-8 l -10,8 l -10,-8 l -10,8 l -10,-8 l -10,8 l -10,-8 l -10,8 l -10,-8 l -10,8 l -10,-8 C -76,30 -76,-30 -70,-86 Z', fill: '#e0a43c', stroke: '#f6d78a', 'stroke-width': 3 }, bag);
      el('ellipse', { cx: 0, cy: 36, rx: 40, ry: 26, fill: '#f6d36a', stroke: '#c9932e', 'stroke-width': 2 }, bag);
      el('ellipse', { cx: 18, cy: 54, rx: 30, ry: 18, fill: '#f9df8a', stroke: '#c9932e', 'stroke-width': 2 }, bag);
      text(bag, 0, -38, '洋芋片', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: '#3a2410' });
      text(bag, 0, -4, '60 公克', { 'font-size': 20, 'text-anchor': 'middle', fill: '#3a2410' });
      // 算算看（答對後才出現）
      const calcG = g(lab, { opacity: 0 });
      el('rect', { x: 720, y: 248, width: 440, height: 296, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, calcG);
      text(calcG, 940, 286, '一份（30 公克）的熱量', { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle' });
      const PARTS = [['蛋白質', '2 × 4 ＝ 8', 8, '#ff8f8f'], ['脂肪', '10 × 9 ＝ 90', 90, '#ffb35c'], ['碳水化合物', '16 × 4 ＝ 64', 64, C.sugar]];
      PARTS.forEach(([n, f, , c], i) => { text(calcG, 750, 330 + i * 38, n, { 'font-size': 23, 'font-weight': 700, fill: c }); text(calcG, 1130, 330 + i * 38, f, { 'font-size': 23, 'text-anchor': 'end', fill: C.ink }); });
      el('line', { x1: 750, y1: 434, x2: 1130, y2: 434, stroke: '#4a6272', 'stroke-width': 2 }, calcG);
      text(calcG, 940, 472, '合計約 162 大卡', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      let bx = 750;
      PARTS.forEach(([, , v, c]) => { const w = (v / 162) * 380; el('rect', { x: bx, y: 496, width: w - 2, height: 26, rx: 4, fill: c }, calcG); bx += w; });
      let view = 'app';
      const setView = (v) => {
        view = v;
        root.style.display = v === 'app' ? '' : 'none';
        lab.style.display = v === 'label' ? '' : 'none';
        gsap.set(lab, { opacity: 1 });
      };
      const revealLabel = (on) => { gsap.to(cover, { opacity: on ? 0 : 1, duration: 0.4 }); gsap.to(calcG, { opacity: on ? 1 : 0, duration: 0.5, delay: on ? 0.3 : 0 }); };

      const setTemp = (T) => {
        const h = ((T - 0) / 80) * 220;
        col.setAttribute('y', 276 - h); col.setAttribute('height', h);
        tRead.textContent = `${T.toFixed(1)} °C`;
      };
      function drawSetup() {
        const lvl = { 50: 48, 100: 94, 200: 140 }[st.water];
        waterR.setAttribute('y', 294 - lvl); waterR.setAttribute('height', lvl);
        waterLbl.textContent = `${st.water} mL（約 ${st.water} g）`;
        foodE.setAttribute('fill', FOODS[st.food][2]);
        foodE.setAttribute('rx', 22); foodE.setAttribute('ry', 15);
        shield.setAttribute('opacity', st.setup === 'shield' ? 1 : 0);
      }

      // ---------- 燃燒 ----------
      function burn() {
        if (tl) tl.kill();
        if (view !== 'app') setView('app');
        burning = true; sync(); drawMission();
        const [name, kcal] = FOODS[st.food];
        const heatCal = kcal * 1000 * EFF[st.setup];          // 水吸收的熱（卡）
        const dT = Math.round((heatCal / st.water) * 10) / 10; // 讀到 0.1 °C
        const run = { food: st.food, water: st.water, setup: st.setup, T1: T0 + dT, dT, answered: false };
        const o = { T: T0, s: 1 };
        setTemp(T0); fLine.textContent = ''; fLine2.textContent = '';
        gsap.set(formula, { opacity: 0.35 });
        tl = gsap.timeline();
        tl.to(flame, { opacity: 1, duration: 0.3 });
        tl.to(loss, { opacity: st.setup === 'shield' ? 0.35 : 1, duration: 0.3 }, '<');
        tl.to(o, { T: T0 + dT, s: 0.25, duration: 2.2, ease: 'power1.inOut', onUpdate: () => { setTemp(o.T); foodE.setAttribute('rx', 22 * o.s + 4); foodE.setAttribute('ry', 15 * o.s + 3); foodE.setAttribute('fill', o.s < 0.6 ? '#3a3a3a' : FOODS[st.food][2]); } });
        tl.to([flame, loss], { opacity: 0, duration: 0.3 });
        tl.call(() => {
          burning = false;
          runs.push(run);
          gsap.to(formula, { opacity: 1, duration: 0.3 });
          status(`${name}燒完了：水溫從 ${T0.toFixed(1)} °C 升到 <b>${run.T1.toFixed(1)} °C</b>，上升 <b>${dT.toFixed(1)} °C</b>。`);
          sync(); table(); checkMission(run); drawMission();
        });
      }

      function table() {
        if (!runs.length) { $('table').innerHTML = '<p class="m-hint">燒完一次，結果會列在這裡。</p>'; return; }
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>食物</th><th>水</th><th>裝置</th><th>上升溫度</th><th>水吸收的熱量</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${FOODS[r.food][0]}</td><td>${r.water} mL</td><td>${r.setup === 'shield' ? '有防風罩' : '沒有防風罩'}</td><td>${r.dT.toFixed(1)} °C</td><td>${r.answered ? `<b>${((r.water * r.dT) / 1000).toFixed(2)} 大卡</b>` : '（自己算算看）'}</td></tr>`).join('')}</tbody></table>`;
      }

      // ---------- 控制 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function sync() {
        ['food', 'water', 'setup'].forEach((k) => box.querySelectorAll(`#labC-${k} button`).forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.v) === String(st[k])); b.disabled = burning; }));
        $('go').disabled = burning;
        if (!burning) drawSetup();
      }
      ['food', 'water', 'setup'].forEach((k) => box.querySelectorAll(`#labC-${k} button`).forEach((b) => b.addEventListener('click', () => { st[k] = k === 'water' ? +b.dataset.v : b.dataset.v; setTemp(T0); fLine.textContent = ''; fLine2.textContent = ''; sync(); })));
      $('go').addEventListener('click', burn);

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, calcRun = null, calcWrong = 0;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 切換任務：正在燃燒的先停止（不列入紀錄）
      function goMission(k) {
        if (done) doneK.add(mi);
        if (burning) { tl.kill(); burning = false; gsap.set([flame, loss], { opacity: 0 }); setTemp(T0); sync(); }
        mi = k; done = false; picked = -1; calcRun = null; calcWrong = 0;
        const nm = MISSIONS[mi];
        if (nm && nm.label) { setView('label'); revealLabel(false); status('營養標示上的熱量先遮起來了。用每公克的熱量算算看，一份大約有多少大卡。'); }
        else if (view !== 'app') setView('app');
        if (nm && nm.pre) {
          const [food, setup] = nm.pre;
          if (!runs.some((r) => r.food === food && r.water === 100 && r.setup === setup)) {
            const dT = Math.round(((FOODS[food][1] * 1000 * EFF[setup]) / 100) * 10) / 10; // 和 burn() 的算法相同
            runs.push({ food, water: 100, setup, T1: T0 + dT, dT, answered: true }); table();
            status('還沒有「不加防風罩」燒花生的紀錄，已自動補上一筆，用來比較。');
          }
        }
        drawMission(); checkMission();
      }
      S.onDots(mbox, goMission);
      const actsHtml = (m) => `<div class="acts">${m.acts.map(([label, food, setup], i) => {
        const did = runs.some((r) => r.food === food && r.setup === setup && r.water === 100);
        return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${did}" ${burning ? 'disabled' : ''}>${label}${did ? ' ✓' : ''}</button>`;
      }).join('')}</div>`;
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>實驗重點</strong>熱量 ＝ 水的質量 × 上升的溫度（1 g 水上升 1 °C ＝ 1 卡）。<br>測得的熱量比實際少，因為熱會散失；減少散失，結果更準確。<br>比較不同食物時，質量、水量、裝置都要相同。<br>看營養標示：醣類、蛋白質約 4、脂質約 9 大卡／公克＊；分清楚「每份」和「每 100 公克」。</div>
            <button class="ctl primary" type="button" id="labC-again">再練習一次</button>`;
          mbox.querySelector('#labC-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let h = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.quiz) {
          h += `<p class="m-text">${m.quiz.q}</p>${m.quiz.sub ? `<p class="m-hint">${m.quiz.sub}</p>` : ''}${m.label && view !== 'label' ? '<div class="btn-row"><button class="ctl small" type="button" id="labC-back">看營養標示</button></div>' : ''}<div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) h += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hints ? m.quiz.hints[picked] : m.quiz.hint}</div>`;
          if (done) h += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else if (m.calc) {
          h += `<p class="m-text">${m.text}</p>`;
          if (calcRun && !done) {
            h += `<p class="m-hint">水 ${calcRun.water} g，上升 ${calcRun.dT.toFixed(1)} °C。水吸收了多少大卡？</p><div class="calc"><input id="labC-ans" type="number" inputmode="decimal" step="0.01" aria-label="熱量（大卡）"><span>大卡</span><button class="ctl primary small" type="button" id="labC-check">檢查</button></div>`;
            if (calcWrong) h += `<div class="fb bad"><strong>再算一次</strong>先算「卡」：${calcRun.water} × ${calcRun.dT.toFixed(1)} ＝ ？ 卡，再除以 1000 變成大卡。${calcWrong >= 2 ? `（答案是 ${((calcRun.water * calcRun.dT) / 1000).toFixed(2)} 大卡）` : ''}</div>`;
          } else if (!done) h += actsHtml(m);
          if (done) h += `<div class="fb ok"><strong>算對了</strong>${calcRun.water} × ${calcRun.dT.toFixed(1)} ＝ ${(calcRun.water * calcRun.dT).toFixed(0)} 卡 ＝ ${((calcRun.water * calcRun.dT) / 1000).toFixed(2)} 大卡。${m.why}</div>`;
        } else {
          h += `<p class="m-text">${m.text}</p>`;
          if (done) h += `<div class="fb ok"><strong>完成</strong>${m.why}</div>`;
          else h += actsHtml(m);
        }
        if (done) h += `<button class="ctl primary" type="button" id="labC-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = h;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === m.quiz.ans) {
            done = true;
            if (m.label) { if (view !== 'label') setView('label'); revealLabel(true); status('一份約 <b>162 大卡</b>；這包有 2 份，全部吃完約 324 大卡。'); }
          } else picked = k;
          drawMission();
        }));
        const bk = mbox.querySelector('#labC-back');
        if (bk) bk.addEventListener('click', () => { setView('label'); drawMission(); });
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => {
          const [, food, setup] = m.acts[+b.dataset.a];
          Object.assign(st, { food, water: 100, setup }); sync(); burn();
        }));
        const ck = mbox.querySelector('#labC-check');
        if (ck) {
          const inp = mbox.querySelector('#labC-ans');
          const go = () => {
            const want = (calcRun.water * calcRun.dT) / 1000, v = parseFloat(inp.value);
            if (Number.isFinite(v) && Math.abs(v - want) <= Math.max(0.02, want * 0.02)) { done = true; calcRun.answered = true; table(); showFormula(calcRun); }
            else calcWrong++;
            drawMission();
          };
          ck.addEventListener('click', go);
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        }
        const nx = mbox.querySelector('#labC-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function showFormula(r) {
        fLine.textContent = `${r.water} g × ${r.dT.toFixed(1)} °C ＝ ${(r.water * r.dT).toFixed(0)} 卡`;
        fLine2.textContent = `＝ ${((r.water * r.dT) / 1000).toFixed(2)} 大卡（標示約 ${FOODS[r.food][1]} 大卡＊）`; // 字放大後「包裝標示」會超出公式框
      }
      function checkMission(run) {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.calc) { if (run && m.calc(run)) { calcRun = run; calcWrong = 0; drawMission(); } return; }
        if (m.done && m.done(runs)) { done = true; drawMission(); }
        if (run && run.answered === false && mi > 0) { run.answered = true; table(); showFormula(run); }
      }
      function reset() {
        if (tl) tl.kill();
        burning = false; runs.length = 0;
        Object.assign(st, { food: 'peanut', water: 100, setup: 'open' });
        mi = 0; done = false; picked = -1; calcRun = null; calcWrong = 0; doneK.clear();
        gsap.set([flame, loss], { opacity: 0 }); gsap.set(formula, { opacity: 0 });
        setView('app'); gsap.set(cover, { opacity: 1 }); gsap.set(calcG, { opacity: 0 });
        setTemp(T0);
        status('按任務卡上的按鈕點燃食物，加熱上方鋁罐裡的水。燒完後讀出水溫上升了多少。');
        $('free').open = false;
        sync(); table(); drawMission();
      }

      reset();
      return { unmount() { if (tl) tl.kill(); } };
    },
  });
})();
