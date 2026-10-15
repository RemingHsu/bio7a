/* 互動模型：呼吸運動模型 — 鐘形罩模型（瓶內＝胸腔、氣球＝肺、橡皮膜＝橫膈）＋ 人體胸腔示意 ＋ BTB 檢驗呼出的氣體 ＋ 種子的呼吸作用（發芽中 vs 煮過，石灰水）＋ 運動後的呼吸 */
(() => {
  const { el, g, text, C } = S;
  const AIR = '#9fd8ff', LUNG = '#e58a9a', LUNG_E = '#ffc2cc', RIB = '#e8dcc0', DIA = C.muscle;
  const BTB = ['#2f6fd6', '#3fa64a', '#e3c53a'];
  const REST = { rate: 16, depth: 0.55 }, EX = { rate: 30, depth: 1 }; // 每分鐘呼吸次數（約略值＊）
  const EX_SEC = 14, REC_SEC = 8; // 運動後加快的時間、恢復的時間（示意＊）
  const SEED_SEC = 2.5; // 倒入清水、把氣體壓進石灰水的時間（示意＊）
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(S.lerp(v, B[i], t))).join(',')})`; };
  const btbCol = (u) => (u < 0.5 ? mix(BTB[0], BTB[1], u * 2) : mix(BTB[1], BTB[2], (u - 0.5) * 2));
  const btbName = (u) => (u < 0.3 ? '藍色' : u < 0.75 ? '綠色' : '黃色');
  const arrow = (p, x1, y1, x2, y2, col, w = 4, head = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * head * 0.7, y2: y2 - Math.sin(a) * head * 0.7, stroke: col, 'stroke-width': w }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(a - 0.45)},${y2 - head * Math.sin(a - 0.45)} L ${x2 - head * Math.cos(a + 0.45)},${y2 - head * Math.sin(a + 0.45)} Z`, fill: col }, ag);
    return ag;
  };

  const MISSIONS = [
    { title: '拉下橡皮膜', predict: { q: '把鐘形罩底部的<b>橡皮膜往下拉</b>，瓶裡的氣球會怎樣？點選你的預測，實驗就會開始：', opts: ['氣球變大（脹起來）', '氣球變小', '不會改變'], ans: 0 }, onPredict: 'pull', done: (s) => s.pulled,
      why: '橡皮膜往下拉，瓶內的空間變大、氣壓變小，外面的空氣就經由 Y 形管進入氣球，氣球<b>脹大</b>。' },
    { title: '放開橡皮膜', need: (s) => s.released, needText: '再把橡皮膜<b>放開</b>，讓它回到原來的位置：', acts: [{ label: '放開橡皮膜', then: 'release' }],
      quiz: { q: '模型中，氣球代表肺、橡皮膜代表橫膈。拉下橡皮膜、氣球脹大，相當於人的哪一個動作？', opts: ['吸氣', '呼氣'], ans: 0, hint: '回想一下：拉下橡皮膜時，Y 形管上方的箭頭表示空氣往哪裡流？' },
      why: '拉下橡皮膜就像<b>橫膈下降</b>：胸腔變大，肺跟著脹大，空氣進入，是<b>吸氣</b>。放開橡皮膜就像橫膈上升：胸腔變小，空氣排出，是呼氣。' },
    { title: '人的胸腔', auto: 'rest', quiz: { q: '模型的鐘形罩是硬的，不會變大。人吸氣時，除了橫膈下降，還有什麼讓胸腔變大？', opts: ['肋骨上舉', '肺自己用力脹大', '心臟變大'], ans: 0, hint: '肺沒有肌肉，不能自己脹大。看看中間的人體示意圖：除了橫膈，還有哪個構造跟著呼吸在動？' },
      why: '吸氣時<b>肋骨上舉</b>、<b>橫膈下降</b>，胸腔變大，肺跟著擴張，空氣進入；呼氣時肋骨下降、橫膈上升，胸腔變小，空氣排出。肺本身沒有肌肉。' },
    { title: '呼出的氣體', setup: 'btb', predict: { q: '用吸管對藍色的 <b>BTB 溶液</b>（溴瑞香草藍）吹氣（呼出的氣體），溶液的顏色會怎樣？先預測：', opts: ['由藍色變成黃色', '一直是藍色'], ans: 0 },
      text: '用吸管吹氣，再用打氣筒打入一般空氣做對照：', acts: [{ label: '用吸管吹氣', then: 'blow', did: (s) => s.blown }, { label: '打入空氣（對照）', then: 'pump', did: (s) => s.pumped }], done: (s) => s.blown && s.pumped,
      why: '呼出的氣體含較多<b>二氧化碳</b>，二氧化碳溶在水中呈弱酸性，使 BTB 由藍色經綠色變成<b>黃色</b>；一般空氣中的二氧化碳很少，短時間內幾乎不變色。二氧化碳是細胞進行<b>呼吸作用</b>產生的。' },
    { title: '種子也會呼吸嗎？', setup: 'seed', predict: { q: 'A 瓶裝<b>發芽中的綠豆</b>，B 瓶裝<b>煮過的綠豆（對照組）</b>，兩瓶都密封放置一段時間＊。接著從漏斗倒入清水，把瓶內的氣體壓進<b>澄清石灰水</b>。哪一瓶的石灰水會變混濁？先預測：', opts: ['只有 A（發芽中）', '只有 B（煮過的）', '兩瓶都會', '兩瓶都不會'], ans: 0 },
      text: '從漏斗倒入清水，把兩瓶裡的氣體壓進石灰水：', acts: [{ label: '從漏斗倒入清水', then: 'pour', did: (s) => s.poured }], done: (s) => s.poured,
      why: '只有 A 瓶的石灰水變混濁。發芽中的種子是活的，細胞進行<b>呼吸作用</b>，放出<b>二氧化碳</b>；煮過的種子已經死亡，不進行呼吸作用（<b>對照組</b>）。所以植物也會進行呼吸作用。' },
    { title: '運動之後', setup: 'ex', need: (s) => s.ran, needText: '先原地跑步，再看看模型和人體示意圖的呼吸有什麼變化：', acts: [{ label: '原地跑步 1 分鐘', then: 'run' }],
      quiz: { q: '運動後，呼吸變得又快又深。這主要是因為血液中哪一種氣體變多了？', opts: ['氧', '二氧化碳', '氮'], ans: 1, hint: '運動時，肌肉細胞的呼吸作用變得旺盛。呼吸作用會產生哪些物質？' },
      why: '運動時細胞的呼吸作用旺盛，產生較多<b>二氧化碳</b>。<b>腦幹</b>使呼吸加快、加深，把多餘的二氧化碳排出，也吸進更多氧，維持<b>氣體的恆定</b>。' },
  ];

  S.registerLab({
    id: 'lab-breath', section: '6-1', title: '呼吸運動模型',
    mount(box) {
      box.innerHTML = `
<style>
  .labH { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labH .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labH .pad { padding: 1rem 1.25rem; }
  .labH .seg-ctl button:disabled, .labH .ctl:disabled { opacity: 0.4; cursor: not-allowed; }
  .labH .table-wrap { overflow-x: auto; }
  @media (max-width: 900px) {
    .labH { display: flex; flex-direction: column; align-items: stretch; }
    .labH .col { display: contents; }
    .labH .c-stage { order: 1; } .labH .c-mis { order: 2; } .labH .c-log { order: 3; } .labH .c-ctl { order: 4; }
  }
</style>
<div class="labH">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="鐘形罩呼吸模型、人體胸腔示意圖和 BTB 溶液試管"></svg></div>
      <div class="pad">
        <p class="status-line" id="labH-status" aria-live="polite"></p>
        <p class="footnote">＊示意：呼吸次數是約略值（安靜時每分鐘十幾次，因人而異）；運動後加快的時間和 BTB、石灰水變色的時間都縮短了。模型的鐘形罩不會變大，所以無法表示肋骨的運動。種子實驗也可以用乾燥的種子當對照組（乾種子的呼吸作用很微弱）。</p>
      </div>
    </div>
    <div class="card pad c-log"><h3>實驗紀錄</h3><div class="table-wrap" id="labH-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labH-mission"></div>
    <details class="card pad free c-ctl" id="labH-free"><summary>自由探索：自己操作模型</summary>
      <div class="field"><div class="field-head"><label for="labH-p">橡皮膜往下拉</label><output id="labH-p-o"></output></div>
        <input type="range" id="labH-p" min="0" max="100" step="1" value="0"></div>
      <div class="field"><div class="field-head"><span>自動呼吸</span></div>
        <div class="seg-ctl" role="group" aria-label="自動呼吸" id="labH-auto"><button type="button" data-v="off">停止</button><button type="button" data-v="rest">安靜時</button><button type="button" data-v="ex">運動後</button></div></div>
      <div class="field"><div class="field-head"><span>BTB 溶液（溴瑞香草藍）</span></div>
        <div class="btn-row"><button class="ctl" type="button" id="labH-blow">吹氣</button><button class="ctl" type="button" id="labH-pump">打入空氣</button><button class="ctl" type="button" id="labH-fresh">換新的 BTB 溶液</button></div></div>
      <div class="field"><div class="field-head"><span>種子的呼吸作用</span></div>
        <div class="btn-row"><button class="ctl" type="button" id="labH-seedgo">倒入清水（種子實驗）</button><button class="ctl" type="button" id="labH-seednew">重新準備種子實驗</button></div></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labH-' + id);
      const svg = box.querySelector('svg');
      const pIn = $('p'), pOut = $('p-o');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { p: 0, b: 0, auto: 'off', ph: 0, exT: 0, btb: [0, 0], pulled: false, released: false, blown: false, pumped: false, ran: false, busy: false, poured: false, seedT: -1 };
      const log = [];
      let mv = null;

      // ---------- 鐘形罩模型 ----------
      const MX = 250;
      text(root, MX, 30, '鐘形罩模型', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      el('path', { d: `M ${MX - 120},480 L ${MX - 120},212 C ${MX - 120},164 ${MX - 82},144 ${MX - 42},140 L ${MX - 42},120 L ${MX + 42},120 L ${MX + 42},140 C ${MX + 82},144 ${MX + 120},164 ${MX + 120},212 L ${MX + 120},480`, fill: 'rgba(159,216,255,0.05)', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, root);
      el('rect', { x: MX - 46, y: 104, width: 92, height: 26, rx: 6, fill: '#7a5a3a' }, root);
      el('path', { d: `M ${MX},62 L ${MX},236 M ${MX},236 L ${MX - 40},276 M ${MX},236 L ${MX + 40},276`, stroke: '#cfe8ff', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
      el('path', { d: `M ${MX},62 L ${MX},236 M ${MX},236 L ${MX - 40},276 M ${MX},236 L ${MX + 40},276`, stroke: AIR, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
      const balloons = [-1, 1].map((s) => el('ellipse', { cx: MX + s * 46, cy: 300, rx: 26, ry: 34, fill: LUNG, stroke: LUNG_E, 'stroke-width': 3, opacity: 0.9 }, root));
      const mem = el('path', { fill: 'rgba(255,143,143,0.25)', stroke: DIA, 'stroke-width': 6, 'stroke-linecap': 'round' }, root);
      const handle = el('line', { stroke: '#cfe8ff', 'stroke-width': 4 }, root);
      const knob = el('circle', { r: 12, fill: DIA, stroke: '#ffd0d0', 'stroke-width': 2 }, root);
      const inArr = arrow(root, MX + 34, 44, MX + 34, 86, AIR, 4, 14), outArr = arrow(root, MX + 34, 86, MX + 34, 44, C.co2, 4, 14);
      const flowLbl = text(root, MX + 50, 72, '', { 'font-size': 20, fill: AIR });
      [[MX - 4, 62, 72, 62, 'Y 形管', AIR], [MX - 66, 300, 64, 330, '氣球', LUNG], [MX - 120, 420, 64, 420, '鐘形罩', '#cfe8ff'], [MX - 100, 486, 64, 520, '橡皮膜', DIA]]
        .forEach(([tx, ty, x, y, s, c]) => { S.callout(root, tx, ty, x, y, s, c, { size: 20 }).style.opacity = 1; });

      // ---------- 人體胸腔（示意）----------
      const HK = 0.72, HX = 690, hx0 = HX - 330 * HK, hy0 = 100 - 70 * HK, H2S = (x, y) => [hx0 + x * HK, hy0 + y * HK];
      text(root, HX, 30, '人體胸腔（示意）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const chest = S.place(g(root), { x: hx0, y: hy0, s: HK });
      const hl = [el('path', { fill: LUNG, opacity: 0.8, stroke: LUNG_E, 'stroke-width': 3 }, chest), el('path', { fill: LUNG, opacity: 0.8, stroke: LUNG_E, 'stroke-width': 3 }, chest)];
      el('path', { d: 'M 330,70 L 330,200 M 330,200 C 320,212 300,222 276,236 M 330,200 C 340,212 360,222 384,236', stroke: AIR, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, chest);
      const hribs = [];
      for (let k = 0; k < 6; k++) [-1, 1].forEach((s) => hribs.push({ e: el('path', { fill: 'none', stroke: RIB, 'stroke-width': 9, 'stroke-linecap': 'round' }, chest), k, s }));
      el('rect', { x: 321, y: 232, width: 18, height: 190, rx: 8, fill: RIB }, chest);
      const hdia = el('path', { fill: 'none', stroke: DIA, 'stroke-width': 10, 'stroke-linecap': 'round' }, chest);
      [['氣管', 330, 120, 150, AIR], ['肋骨', 172, 268, 250, RIB], ['肺', 240, 380, 350, LUNG], ['橫膈', 172, 520, 450, DIA]].forEach(([s, bx, by, y, c]) => {
        const [tx, ty] = H2S(bx, by);
        S.callout(root, tx, ty, 498, y, s, c, { size: 20 }).style.opacity = 1; // 字放大後標籤變寬，往左一點，不要貼到肋骨
      });
      const drawChest = (v) => {
        const CX = 330;
        hribs.forEach(({ e, k, s }) => {
          const y0 = 214 + k * 50 - 14 * v, w = (150 + k * 6) * (1 + 0.07 * v);
          e.setAttribute('d', `M ${CX + s * 12},${y0} C ${CX + s * w * 0.55},${y0 - 22 + 8 * v} ${CX + s * w},${y0 - 8} ${CX + s * w * 1.02},${y0 + 46 - 14 * v}`);
        });
        const base = 520 + 34 * v, apex = 430 + 76 * v;
        hdia.setAttribute('d', `M ${CX - 178},${base} C ${CX - 120},${apex - 20} ${CX + 120},${apex - 20} ${CX + 178},${base}`);
        [-1, 1].forEach((s, i) => {
          const w = 128 * (1 + 0.1 * v), top = 216 - 10 * v, bot = apex - 12 + (base - apex) * 0.25;
          hl[i].setAttribute('d', `M ${CX + s * 22},${top + 20} C ${CX + s * 40},${top - 10} ${CX + s * w * 0.9},${top} ${CX + s * w},${top + 120} C ${CX + s * (w + 8)},${bot - 40} ${CX + s * w},${bot + 20} ${CX + s * (w - 30)},${bot + 26} C ${CX + s * 70},${bot - 6} ${CX + s * 40},${bot - 10} ${CX + s * 22},${bot - 14} Z`);
        });
      };
      const rateLbl = text(root, HX, 520, '', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const modeLbl = text(root, HX, 552, '', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(root, 430, 610, '對應：氣球＝肺　橡皮膜＝橫膈　鐘形罩內＝胸腔　Y 形管＝氣管、支氣管', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });

      // ---------- BTB 溶液 ----------
      const TXS = [930, 1090];
      text(root, 975, 30, 'BTB 溶液', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      text(root, 975, 60, '（溴瑞香草藍）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const tubes = TXS.map((x, i) => {
        const tg = g(root);
        el('path', { d: `M ${x - 30},220 L ${x - 30},450 C ${x - 30},490 ${x + 30},490 ${x + 30},450 L ${x + 30},220 Z` }, el('clipPath', { id: 'labHt' + i }, el('defs', {}, tg)));
        const liq = el('rect', { x: x - 32, y: 320, width: 64, height: 180, fill: BTB[0], 'clip-path': `url(#labHt${i})` }, tg);
        el('path', { d: `M ${x - 36},214 L ${x - 30},220 L ${x - 30},450 C ${x - 30},490 ${x + 30},490 ${x + 30},450 L ${x + 30},220 L ${x + 36},214`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, tg);
        el('line', { x1: x + 6, y1: i ? 156 : 150, x2: x + 6, y2: 462, stroke: '#e8f0f2', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 }, tg);
        const bubs = Array.from({ length: 6 }, () => el('circle', { cx: 0, cy: 0, r: 5, fill: 'none', stroke: '#e8f6ff', 'stroke-width': 2, opacity: 0 }, tg));
        const cLbl = text(tg, x, 560, '藍色', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: '#8fb4ff' });
        return { liq, bubs, cLbl, x, blowT: 0 };
      });
      // A：吸管吹氣；B：打氣筒
      const breath = g(root, { opacity: 0 });
      arrow(breath, TXS[0] + 6, 100, TXS[0] + 6, 142, AIR, 4, 12);
      text(root, TXS[0], 524, '吹氣', { 'font-size': 22, 'text-anchor': 'middle' });
      text(root, TXS[0] - 20, 136, '吸管', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const pump = g(root);
      el('rect', { x: TXS[1] - 22, y: 96, width: 56, height: 60, rx: 8, fill: '#3a4a56', stroke: '#8aa1ae', 'stroke-width': 2 }, pump);
      const plunger = g(pump);
      el('line', { x1: TXS[1] + 6, y1: 60, x2: TXS[1] + 6, y2: 98, stroke: '#cfe8ff', 'stroke-width': 5 }, plunger);
      el('line', { x1: TXS[1] - 16, y1: 60, x2: TXS[1] + 28, y2: 60, stroke: '#cfe8ff', 'stroke-width': 6, 'stroke-linecap': 'round' }, plunger);
      text(root, TXS[1], 524, '打入空氣（對照）', { 'font-size': 22, 'text-anchor': 'middle' });
      text(root, TXS[1] - 30, 132, '打氣筒', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });

      // ---------- 種子的呼吸作用（蓋住整個舞台的另一個畫面）----------
      const seedG = g(root, { display: 'none' });
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, seedG);
      text(seedG, 600, 36, '種子的呼吸作用（示意＊）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      el('line', { x1: 600, y1: 64, x2: 600, y2: 560, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 8' }, seedG);
      const LIME0 = 'rgba(220,235,245,0.22)', LIME1 = 'rgba(240,240,236,0.88)';
      const bean = (p, x, y, r, live) => {
        const bg = S.place(g(p), { x, y, r });
        if (live) el('path', { d: 'M 6,1 C 14,6 17,14 12,22', fill: 'none', stroke: '#f4f0dc', 'stroke-width': 3, 'stroke-linecap': 'round' }, bg); // 長出來的白色胚根
        el('ellipse', { cx: 0, cy: 0, rx: live ? 9 : 10, ry: live ? 6.5 : 7.5, fill: live ? '#5f9e3f' : '#b3ad78', stroke: live ? '#2f6a24' : '#7a744a', 'stroke-width': 1.5 }, bg);
        if (!live) el('path', { d: 'M -6,-2 C -2,1 2,-1 6,2', fill: 'none', stroke: '#7a744a', 'stroke-width': 1.2 }, bg); // 煮過：種皮脹破、起皺
        el('ellipse', { cx: -3, cy: -2.5, rx: 3.2, ry: 1.4, fill: '#fff', opacity: 0.3 }, bg);
        el('line', { x1: 3, y1: -3.5, x2: 7, y2: -1.5, stroke: '#f4f0dc', 'stroke-width': 1.4 }, bg);
        return bg;
      };
      const flaskD = (cx) => `M ${cx - 22},172 L ${cx - 22},232 L ${cx - 110},450 Q ${cx - 114},470 ${cx - 94},470 L ${cx + 94},470 Q ${cx + 114},470 ${cx + 110},450 L ${cx + 22},232 L ${cx + 22},172`;
      const tubeD = (tx) => `M ${tx - 26},250 L ${tx - 26},446 C ${tx - 26},476 ${tx + 26},476 ${tx + 26},446 L ${tx + 26},250`;
      const seedSet = [[230, 430, true, 'A：發芽中的綠豆', '#a8e39a'], [770, 970, false, 'B：煮過的綠豆（對照組）', '#e8d8a0']].map(([cx, tx, live, name, col], i) => {
        const o = { cx, tx, live };
        // 錐形瓶裡的水（倒入清水後上升）
        el('path', { d: flaskD(cx) + ' Z' }, el('clipPath', { id: 'labHf' + i }, el('defs', {}, seedG)));
        o.water = el('rect', { x: cx - 120, y: 470, width: 240, height: 0, fill: 'rgba(95,184,255,0.35)', 'clip-path': `url(#labHf${i})` }, seedG);
        const rnd = S.rng(i ? 11 : 5);
        [[458, 9, 20], [444, 7, 20], [432, 4, 22]].forEach(([y, n, gap]) => { for (let k = 0; k < n; k++) bean(seedG, cx - ((n - 1) * gap) / 2 + k * gap + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 4, (rnd() - 0.5) * 120, live); });
        el('path', { d: flaskD(cx), fill: 'rgba(207,232,255,0.05)', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linejoin': 'round' }, seedG);
        // 漏斗（長管伸到瓶底附近）與導管
        el('line', { x1: cx - 8, y1: 138, x2: cx - 8, y2: 420, stroke: '#cfe8ff', 'stroke-width': 6 }, seedG);
        o.stem = el('line', { x1: cx - 8, y1: 140, x2: cx - 8, y2: 140, stroke: C.water, 'stroke-width': 3 }, seedG);
        el('path', { d: `M ${cx - 50},88 L ${cx + 34},88 L ${cx - 4},138 L ${cx - 12},138 Z`, fill: 'rgba(207,232,255,0.08)', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linejoin': 'round' }, seedG);
        o.pourL = el('line', { x1: cx - 8, y1: 52, x2: cx - 8, y2: 132, stroke: C.water, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, seedG);
        const pipe = `M ${cx + 12},176 L ${cx + 12},150 L ${tx},150 L ${tx},440`; // 在漏斗下方轉彎，不和漏斗重疊
        el('path', { d: pipe, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 8, 'stroke-linejoin': 'round' }, seedG);
        el('path', { d: pipe, fill: 'none', stroke: C.bg, 'stroke-width': 3, 'stroke-linejoin': 'round' }, seedG);
        el('rect', { x: cx - 28, y: 158, width: 56, height: 22, rx: 4, fill: '#7a5a3a' }, seedG); // 瓶塞
        // 試管裡的澄清石灰水
        el('path', { d: tubeD(tx) + ' Z' }, el('clipPath', { id: 'labHq' + i }, el('defs', {}, seedG)));
        o.lime = el('rect', { x: tx - 30, y: 330, width: 60, height: 150, fill: LIME0, 'clip-path': `url(#labHq${i})` }, seedG);
        el('path', { d: `M ${tx - 30},244 L ${tx - 26},250 ` + tubeD(tx).slice(tubeD(tx).indexOf('L')) + ` L ${tx + 30},244`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3.5 }, seedG);
        o.bubs = [0, 1, 2, 3, 4].map(() => el('circle', { cx: tx, cy: 0, r: 5, fill: 'none', stroke: '#e8f6ff', 'stroke-width': 2, opacity: 0 }, seedG));
        text(seedG, cx, 522, name, { 'font-size': 24, 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
        text(seedG, tx, 500, '石灰水', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        o.res = text(seedG, tx, 532, live ? '變混濁' : '仍然澄清', { 'font-size': 22, 'text-anchor': 'middle', fill: live ? '#f2f2f2' : '#9fd8ff', 'font-weight': 700, opacity: 0 });
        return o;
      });
      text(seedG, 600, 596, '兩瓶都已密封放置一段時間＊，再倒入清水把瓶內的氣體壓進石灰水', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      let view = 'model';
      const showView = (v) => { view = v; seedG.setAttribute('display', v === 'seed' ? 'inline' : 'none'); };
      const seedBusy = () => st.seedT >= 0 && st.seedT < SEED_SEC;
      function drawSeed() {
        const k = st.seedT < 0 ? 0 : S.clamp(st.seedT / SEED_SEC), run = seedBusy();
        seedSet.forEach((o) => {
          const lv = 70 * S.smoothstep(0.05, 0.6, k);
          o.water.setAttribute('y', 470 - lv); o.water.setAttribute('height', lv);
          o.pourL.setAttribute('opacity', run && k < 0.6 ? 0.9 : 0);
          o.stem.setAttribute('y2', run || k >= 1 ? 140 + 280 * S.smoothstep(0, 0.12, k) : 140);
          o.lime.setAttribute('fill', o.live ? mix('#dcebf5', '#f0f0ec', S.smoothstep(0.3, 0.95, k)) : '#dcebf5');
          o.lime.setAttribute('fill-opacity', o.live ? S.lerp(0.22, 0.88, S.smoothstep(0.3, 0.95, k)).toFixed(2) : 0.22);
          o.bubs.forEach((b, i) => { const q = (performance.now() / 600 + i / 5) % 1; b.setAttribute('cx', o.tx + Math.sin(q * 10 + i) * 6); b.setAttribute('cy', S.lerp(438, 336, q)); b.setAttribute('opacity', run && k > 0.12 && k < 0.92 ? 0.9 : 0); });
          o.res.setAttribute('opacity', k >= 1 ? 1 : 0);
        });
      }
      function resetSeed() { st.seedT = -1; st.poured = false; drawSeed(); }

      // ---------- 畫面更新 ----------
      let lastB = 0;
      function render(dt) {
        // 氣球跟著瓶內空間變化（略有延遲）
        st.b += (st.p - st.b) * Math.min(1, dt * 7);
        const b = st.b, db = dt > 0 ? (b - lastB) / dt : 0;
        lastB = b;
        balloons.forEach((e, i) => { const rx = 24 + 22 * b, ry = 32 + 30 * b; e.setAttribute('rx', rx); e.setAttribute('ry', ry); e.setAttribute('cy', 276 + ry - 4); e.setAttribute('cx', MX + (i ? 1 : -1) * (40 + 14 * b)); });
        const py = 480 + 60 * st.p;
        mem.setAttribute('d', `M ${MX - 120},480 Q ${MX},${480 + 120 * st.p} ${MX + 120},480`);
        handle.setAttribute('x1', MX); handle.setAttribute('x2', MX); handle.setAttribute('y1', py); handle.setAttribute('y2', py + 22);
        knob.setAttribute('cx', MX); knob.setAttribute('cy', py + 30);
        const flowIn = db > 0.04, flowOut = db < -0.04;
        inArr.style.opacity = flowIn ? 1 : 0; outArr.style.opacity = flowOut ? 1 : 0;
        flowLbl.textContent = flowIn ? '空氣進入' : flowOut ? '空氣排出' : '';
        flowLbl.setAttribute('fill', flowIn ? AIR : C.co2);
        drawChest(b);
        const pv = Math.round(st.p * 100); // 滑桿跟著顯示目前的位置
        if (+pIn.value !== pv) { pIn.value = pv; pOut.textContent = `${pv}%`; }
        // 呼吸次數
        if (st.auto === 'off') { rateLbl.textContent = ''; modeLbl.textContent = ''; }
        else { const { rate } = breathNow(); rateLbl.textContent = `呼吸：約 ${Math.round(rate)} 次／分＊`; modeLbl.textContent = st.auto === 'ex' ? (st.exT > 0 ? '運動後：又快又深' : '慢慢恢復中') : '安靜時'; }
        // BTB
        tubes.forEach((t, i) => {
          t.liq.setAttribute('fill', btbCol(st.btb[i]));
          t.cLbl.textContent = btbName(st.btb[i]);
          t.cLbl.setAttribute('fill', st.btb[i] < 0.3 ? '#8fb4ff' : st.btb[i] < 0.75 ? '#6fd06f' : C.sugar);
          t.bubs.forEach((bb, k) => {
            const on = t.blowT > 0, q = (performance.now() / 700 + k / t.bubs.length) % 1;
            bb.setAttribute('cx', t.x + 6 + Math.sin(q * 12 + k) * 7); bb.setAttribute('cy', S.lerp(456, 330, q));
            bb.style.opacity = on ? 0.9 : 0;
          });
        });
        breath.style.opacity = tubes[0].blowT > 0 ? 1 : 0;
        if (view === 'seed') drawSeed();
        plunger.setAttribute('transform', `translate(0,${tubes[1].blowT > 0 ? (Math.sin(performance.now() / 120) * 0.5 + 0.5) * 30 : 0})`);
      }
      const breathNow = () => {
        if (st.auto === 'rest') return REST;
        const rec = st.exT > 0 ? 0 : S.clamp(-st.exT / REC_SEC);
        return { rate: S.lerp(EX.rate, REST.rate, rec), depth: S.lerp(EX.depth, REST.depth, rec) };
      };
      function step(dt) {
        if (mv) {
          mv.t += dt;
          const k = S.clamp(mv.t / mv.dur), e = k * k * (3 - 2 * k);
          st.p = S.lerp(mv.from, mv.to, e);
          if (k >= 1) { const d = mv.done; mv = null; st.busy = false; d && d(); sync(); drawMission(); }
        }
        if (st.auto !== 'off') {
          if (st.auto === 'ex') { st.exT -= dt; if (st.exT < -REC_SEC) { st.auto = 'rest'; status('呼吸已經恢復到安靜時的樣子。'); sync(); } }
          const { rate, depth } = breathNow();
          st.ph += dt * 2 * Math.PI * (rate / 60);
          st.p = depth * (0.5 - 0.5 * Math.cos(st.ph));
        }
        if (seedBusy()) {
          st.seedT += dt;
          if (st.seedT >= SEED_SEC) { st.poured = true; status('倒入清水後：<b>A 瓶</b>（發芽中的綠豆）的石灰水變混濁，<b>B 瓶</b>（煮過的綠豆）仍然澄清。'); addLog('種子實驗：倒入清水', 'A（發芽中）變混濁；B（煮過的）仍然澄清'); sync(); checkMission(); drawMission(); }
        }
        tubes.forEach((t, i) => {
          if (t.blowT > 0) {
            t.blowT -= dt;
            if (i === 0) st.btb[0] = Math.min(1, st.btb[0] + dt * 0.36);
            else st.btb[1] = Math.min(0.05, st.btb[1] + dt * 0.004);
            if (t.blowT <= 0) { t.blowT = 0; blowDone(i); }
          }
        });
        render(dt);
      }
      let raf = 0, lastTs = 0;
      const loop = (ts) => { const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0); lastTs = ts; step(dt); raf = requestAnimationFrame(loop); };

      // ---------- 動作 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function addLog(what, result) { log.push([what, result]); drawLog(); }
      function drawLog() {
        $('log').innerHTML = log.length ? `<table class="tbl"><thead><tr><th>#</th><th>操作</th><th>結果</th></tr></thead><tbody>${log.map(([a, r], i) => `<tr><td>${i + 1}</td><td>${a}</td><td>${r}</td></tr>`).join('')}</tbody></table>` : '<p class="m-hint">做過的操作和結果會列在這裡。</p>';
      }
      // 拉動／放開橡皮膜：在自己的動畫迴圈裡推進（分頁隱藏時也能用 advance 測試）
      function moveP(to, dur, done) {
        st.auto = 'off'; st.busy = true;
        mv = { from: st.p, to, t: 0, dur, done };
        sync(); drawMission();
      }
      const ACT = {
        pull() {
          status('把橡皮膜往下拉……');
          moveP(1, 1.6, () => { st.pulled = true; status('橡皮膜往下拉：瓶內空間變大，空氣經 Y 形管進入，<b>氣球脹大</b>。'); addLog('拉下橡皮膜', '氣球脹大'); checkMission(); });
        },
        release() {
          status('放開橡皮膜……');
          moveP(0, 1.6, () => { st.released = true; status('放開橡皮膜：瓶內空間變小，空氣排出，<b>氣球變小</b>。'); addLog('放開橡皮膜', '氣球變小'); checkMission(); });
        },
        blow() { if (tubes[0].blowT > 0) return; tubes[0].blowT = 3; status('用吸管對 BTB 溶液吹氣……'); sync(); drawMission(); },
        pump() { if (tubes[1].blowT > 0) return; tubes[1].blowT = 3; status('用打氣筒打入一般空氣……'); sync(); drawMission(); },
        pour() { if (seedBusy()) return; showView('seed'); if (st.seedT >= SEED_SEC) resetSeed(); st.seedT = 0; status('從漏斗倒入清水，瓶內的氣體被壓進石灰水……'); sync(); drawMission(); },
        run() {
          mv = null; st.busy = false;
          st.auto = 'ex'; st.exT = EX_SEC; st.ran = true;
          status('原地跑步 1 分鐘後：呼吸變得<b>又快又深</b>。看看模型和人體示意圖。');
          addLog('原地跑步 1 分鐘', `呼吸約 ${EX.rate} 次／分＊（安靜時約 ${REST.rate} 次／分＊）`);
          sync(); checkMission(); drawMission();
        },
      };
      function blowDone(i) {
        if (i === 0) { st.blown = true; status(`吹氣後，BTB 溶液變成<b>${btbName(st.btb[0])}</b>：呼出的氣體含有較多二氧化碳。`); addLog('對 BTB 溶液吹氣', btbName(st.btb[0])); }
        else { st.pumped = true; status(`打入一般空氣，BTB 溶液仍是<b>${btbName(st.btb[1])}</b>。`); addLog('打入一般空氣（對照）', btbName(st.btb[1])); }
        sync(); checkMission(); drawMission();
      }

      // ---------- 自由探索 ----------
      function sync() {
        $('p').value = Math.round(st.p * 100); $('p-o').textContent = `${Math.round(st.p * 100)}%`;
        $('p').disabled = st.busy;
        box.querySelectorAll('#labH-auto button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.auto));
        const blowing = tubes.some((t) => t.blowT > 0) || seedBusy();
        ['blow', 'pump', 'fresh', 'seedgo', 'seednew'].forEach((k) => { $(k).disabled = blowing; });
      }
      $('p').addEventListener('input', () => { showView('model'); mv = null; st.auto = 'off'; st.busy = false; st.p = +$('p').value / 100; sync(); });
      box.querySelectorAll('#labH-auto button').forEach((b) => b.addEventListener('click', () => {
        showView('model'); mv = null; st.busy = false;
        st.auto = b.dataset.v;
        if (st.auto === 'ex') { st.exT = EX_SEC; status('運動後：呼吸又快又深。'); }
        else if (st.auto === 'rest') status('安靜時的呼吸。');
        else status('停止自動呼吸。可以拖動滑桿，自己拉動橡皮膜。');
        sync(); drawMission();
      }));
      $('blow').addEventListener('click', () => { showView('model'); ACT.blow(); });
      $('pump').addEventListener('click', () => { showView('model'); ACT.pump(); });
      $('fresh').addEventListener('click', () => { showView('model'); st.btb = [0, 0]; status('換上新的藍色 BTB 溶液。'); });
      $('seedgo').addEventListener('click', () => ACT.pour());
      $('seednew').addEventListener('click', () => { showView('seed'); resetSeed(); status('重新準備：A 瓶是發芽中的綠豆，B 瓶是煮過的綠豆，石灰水都是澄清的。'); sync(); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, needShown = null;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-breath'); // 存檔的進度（要在第一次畫圓點前讀）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 切換任務：拉動橡皮膜、吹氣、倒水先停止（不列入紀錄），回呼不會影響新的任務
      function goMission(k) {
        if (done) doneK.add(mi);
        mv = null; st.busy = false;
        tubes.forEach((t) => { t.blowT = 0; });
        if (seedBusy()) resetSeed();
        mi = k; done = false; picked = -1; pred = -1; enter(); drawMission(); checkMission();
      }
      S.onDots(mbox, goMission);
      const busyNow = () => st.busy || tubes.some((t) => t.blowT > 0) || seedBusy();
      const actsHtml = (m) => `<div class="acts">${m.acts.map((a, i) => {
        const did = a.did && a.did(st);
        return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${!!did}" ${busyNow() ? 'disabled' : ''}>${a.label}${did ? ' ✓' : ''}</button>`;
      }).join('')}</div>`;
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>呼吸運動重點</strong>吸氣：肋骨上舉、橫膈下降 → 胸腔變大 → 空氣進入肺。<br>呼氣：肋骨下降、橫膈上升 → 胸腔變小 → 空氣排出。<br>呼出的氣體含較多二氧化碳（BTB 由藍變黃）；發芽中的種子也會呼吸，放出二氧化碳（煮過的種子不會）。<br>運動後二氧化碳增加，呼吸加快加深。</div>
            <button class="ctl primary" type="button" id="labH-again">再練習一次</button>`;
          mbox.querySelector('#labH-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (pred >= 0 && !done && m.acts) html += `<p class="m-text">${m.text}</p>${actsHtml(m)}`;
          if (pred >= 0 && !done && !m.acts) html += '<p class="m-hint">實驗進行中，看看左邊的模型……</p>';
          if (done) html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else if (m.quiz) {
          const ready = !m.need || m.need(st);
          needShown = ready;
          if (!ready) html += `<p class="m-text">${m.needText}</p>${m.acts ? actsHtml(m) : ''}`;
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done || !ready ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labH-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p;
          if (m.onPredict) ACT[m.onPredict]();
          drawMission(); checkMission();
        }));
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => { const a = m.acts[+b.dataset.a]; ACT[a.then](); drawMission(); }));
        const nx = mbox.querySelector('#labH-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.quiz) { if (m.need && m.need(st) !== needShown) drawMission(); return; }
        if (m.predict && pred < 0) return;
        if (m.done(st)) { done = true; drawMission(); }
      }
      // 進入任務時自動完成設定
      function enter() {
        const m = MISSIONS[mi];
        if (!m) return;
        showView(m.setup === 'seed' ? 'seed' : 'model');
        // 用圓點跳到任務時也準備好：拉下橡皮膜從原位開始；放開橡皮膜時，橡皮膜已經拉下
        if (m.onPredict === 'pull') { st.auto = 'off'; mv = null; st.busy = false; st.p = 0; st.pulled = false; status('鐘形罩模型：瓶子代表胸腔，氣球代表肺，底部的橡皮膜代表橫膈。'); }
        if (m.acts && m.acts[0].then === 'release') { st.auto = 'off'; mv = null; st.busy = false; st.p = 1; st.released = false; status('橡皮膜往下拉：瓶內空間變大，空氣經 Y 形管進入，<b>氣球脹大</b>。'); }
        if (m.auto) { mv = null; st.busy = false; st.auto = m.auto; status('模型和人體示意圖正在呼吸（安靜時）。注意看中間的人體示意圖。'); }
        if (m.setup === 'btb') { st.auto = 'off'; mv = null; st.p = 0; st.btb = [0, 0]; st.blown = false; st.pumped = false; status('準備好兩支裝了藍色 BTB 溶液的試管。'); }
        if (m.setup === 'seed') { st.auto = 'off'; mv = null; st.p = 0; resetSeed(); status('A 瓶：發芽中的綠豆；B 瓶：煮過的綠豆（對照組）。兩支試管都裝了澄清石灰水。'); }
        if (m.setup === 'ex') { st.auto = 'rest'; st.ran = false; status('先看看安靜時的呼吸：每分鐘約十幾次。'); }
        sync();
      }
      function reset() {
        mv = null;
        Object.assign(st, { p: 0, b: 0, auto: 'off', ph: 0, exT: 0, btb: [0, 0], pulled: false, released: false, blown: false, pumped: false, ran: false, busy: false, poured: false, seedT: -1 });
        showView('model'); drawSeed();
        tubes.forEach((t) => { t.blowT = 0; });
        log.length = 0; drawLog();
        mi = 0; done = false; picked = -1; pred = -1; needShown = null; doneK.clear();
        status('鐘形罩模型：瓶子代表胸腔，氣球代表肺，底部的橡皮膜代表橫膈。');
        $('free').open = false;
        sync(); render(0); drawMission();
      }

      reset();
      // 接上存檔的進度：圓點照舊，從第一個還沒做的任務開始（都做完就顯示完成畫面）
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < MISSIONS.length).forEach((k) => doneK.add(k));
        if (doneK.size) { const k0 = MISSIONS.findIndex((_, k) => !doneK.has(k)); goMission(k0 < 0 ? MISSIONS.length : k0); }
      }
      raf = requestAnimationFrame(loop);
      S._labH = { st, advance(sec) { for (let i = 0; i < sec * 20; i++) step(0.05); }, act: (k) => ACT[k]() }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); mv = null; delete S._labH; } };
    },
  });
})();
