/* 互動模型：保持平衡 — 體溫或血糖偏離正常範圍時，由學生選出身體的反應，看曲線能不能回到正常範圍（恆定的調節）；也從身體的反應反推環境的冷熱 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const TEMP_C = '#ff9a5c', SUG_C = C.sugar, INS = '#63d4bf', GLUC = '#c9a8ff';
  const HOT = 0.06, COLD = -0.06, MEAL = 4, MEAL_SEC = 15, FAST = -1.5; // 每秒的變化（示意＊）
  const WIN = 40; // 圖上顯示最近 40 秒（示意＊）
  const SPEED = 5; // 模擬的時間比畫面快 5 倍：狀況發生後約 2～3 秒就看得到偏離正常範圍（示意＊）
  const MODES = {
    temp: { name: '體溫', unit: '°C', set: 37, lo: 36.5, hi: 37.5, min: 34.5, max: 39.5, ticks: [35, 36, 37, 38, 39], col: TEMP_C, fmt: (v) => `${v.toFixed(1)} °C` },
    sugar: { name: '血糖', unit: 'mg/dL', set: 90, lo: 70, hi: 140, min: 40, max: 280, ticks: [50, 100, 150, 200, 250], col: SUG_C, fmt: (v) => `${Math.round(v)} mg/dL＊` },
  };
  const EVENTS = { hot: ['temp', '在大太陽下跑步', '跑步'], cold: ['temp', '走進很冷的冷氣房', '冷氣房'], meal: ['sugar', '吃完一頓飯', '吃飯'], fast: ['sugar', '很久沒有吃東西', '沒吃東西'] };
  const RESPS = { cool: ['temp', '流汗、皮膚血管擴張'], warm: ['temp', '發抖、皮膚血管收縮'], ins: ['sugar', '胰島分泌胰島素'], glu: ['sugar', '胰島分泌升糖素'] };
  const RIGHT = { hot: 'cool', cold: 'warm', meal: 'ins', fast: 'glu' };
  const HINTS = {
    'hot-warm': '體溫離 37 °C 更遠了。發抖會產生熱，皮膚血管收縮會讓熱不容易散出去——現在身體需要的是這樣嗎？',
    'cold-cool': '體溫更低了。流汗和皮膚血管擴張都會讓身體散失更多熱——天冷時需要這樣嗎？',
    'meal-glu': '血糖更高了。升糖素會讓肝臟把肝糖分解成葡萄糖——現在血糖已經偏高，還需要更多葡萄糖嗎？',
    'fast-ins': '血糖更低了。胰島素會讓葡萄糖進入細胞、合成肝糖，使血糖下降——現在血糖已經偏低，還需要再降低嗎？',
  };

  const MISSIONS = [
    { title: '大熱天', ev: 'hot', text: '你是身體的「控制中心」。先讓身體在<b>大太陽下跑步</b>，看看體溫怎麼變：', why: '<b>流汗</b>時汗液蒸發帶走熱，<b>皮膚血管擴張</b>讓更多血液流到皮膚散熱，體溫回到約 37 °C。' },
    { title: '冷氣房', ev: 'cold', text: '這次讓身體<b>走進很冷的冷氣房</b>：', why: '<b>皮膚血管收縮</b>減少散熱，<b>肌肉顫抖</b>（發抖）產生熱，體溫回到約 37 °C。' },
    { title: '看反應猜環境', guess: true,
      quiz: { q: '小華的身體正在<b>發抖</b>，皮膚的血管<b>收縮</b>（看左邊的人）。他最可能在怎樣的環境中？', opts: ['很冷的地方', '很熱的地方', '從身體的反應看不出來'], ans: 0, hint: '發抖會產生熱，皮膚血管收縮會讓熱不容易散出去。身體在什麼時候需要多產生熱、少散失熱？' },
      why: '發抖產生熱、皮膚血管收縮減少散熱，表示身體正在「保住熱」，所以他在<b>很冷</b>的環境中。反過來，看到大量流汗、皮膚血管擴張（皮膚發紅），表示環境<b>很熱</b>。' },
    { title: '吃完飯', ev: 'meal', text: '換成血糖。讓身體<b>吃完一頓飯</b>，看看血糖怎麼變：', why: '飯後血糖上升，胰島分泌<b>胰島素</b>，使葡萄糖進入細胞，並在肝臟合成<b>肝糖</b>儲存，血糖回到正常範圍。' },
    { title: '很久沒吃', ev: 'fast', text: '這次讓身體<b>很久沒有吃東西</b>：', why: '血糖下降時，胰島分泌<b>升糖素</b>，使肝臟把<b>肝糖分解</b>成葡萄糖送入血液，血糖回到正常範圍。' },
    { title: '胰島素不足', diab: true, need: (s) => s.urineGlu, needText: '如果胰島分泌的<b>胰島素不足</b>，吃完飯會怎樣？', act: '胰島素不足的人吃完飯',
      quiz: { q: '血糖一直降不下來、太高了。這時尿中可能檢驗出什麼？', opts: ['葡萄糖', '澱粉', '胰島素'], ans: 0, hint: '血糖太高時，腎臟來不及送回的是什麼？' },
      why: '胰島素不足（補充：或身體對胰島素反應變差），血糖長期過高，腎臟來不及把葡萄糖全部送回血液，尿中就出現<b>葡萄糖</b>，這就是<b>糖尿病</b>。' },
  ];

  S.registerLab({
    id: 'lab-balance', section: '6-3', title: '保持平衡',
    mount(box) {
      box.innerHTML = `
<style>
  .labK { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labK .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labK .pad { padding: 1rem 1.25rem; }
  .labK .seg-ctl button:disabled, .labK .ctl:disabled { opacity: 0.4; cursor: not-allowed; }
  .labK .table-wrap { overflow-x: auto; }
  .labK .chk { display: flex; gap: 0.5rem; align-items: center; font-size: 0.95rem; }
  @media (max-width: 900px) {
    .labK { display: flex; flex-direction: column; align-items: stretch; }
    .labK .col { display: contents; }
    .labK .c-stage { order: 1; } .labK .c-mis { order: 2; } .labK .c-log { order: 3; } .labK .c-ctl { order: 4; }
  }
</style>
<div class="labK">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="人體的反應，以及體溫或血糖隨時間變化的曲線"></svg></div>
      <div class="pad">
        <p class="status-line" id="labK-status" aria-live="polite"></p>
        <p class="footnote">＊示意：時間大幅縮短了，真實的體溫或血糖變化要幾十分鐘到幾小時；數值是約略值（人的體溫約 37 °C；健康的人空腹血糖約 70～100 mg/dL，飯後通常不超過約 140 mg/dL）。</p>
      </div>
    </div>
    <div class="card pad c-log"><h3>紀錄</h3><div class="table-wrap" id="labK-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labK-mission"></div>
    <details class="card pad free c-ctl" id="labK-free"><summary>自由探索：自己安排狀況和反應</summary>
      <div class="field"><div class="field-head"><span>觀察</span></div>
        <div class="seg-ctl" role="group" aria-label="觀察" id="labK-mode"><button type="button" data-v="temp">體溫</button><button type="button" data-v="sugar">血糖</button></div></div>
      <div class="field"><div class="field-head"><span>發生的狀況</span></div><div class="btn-row" id="labK-evs"></div></div>
      <div class="field"><div class="field-head"><span>身體的反應</span></div><div class="btn-row" id="labK-rs"></div></div>
      <label class="chk" id="labK-diab-row"><input type="checkbox" id="labK-diab"> 胰島素分泌不足</label>
      <div class="btn-row" style="margin-top:0.8rem"><button class="ctl" type="button" id="labK-restart">重新開始</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labK-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { mode: 'temp', v: 37, t: 0, vt: 0, hist: [], marks: [], ev: null, evT: 0, resp: null, lowIns: false, gly: 0.5, urineGlu: false, okT: 0 };
      const log = [];

      // ---------- 人體 ----------
      const BS = 0.8, bx = 230 - 600 * BS, by = 46 - 60 * BS;
      const bodyO = S.place(g(root), { x: bx, y: by, s: BS });
      const body = g(bodyO);
      S.human(body);
      const tint = S.human(body, { fill: 'rgba(0,0,0,0)', stroke: 'none', sw: 0 });
      const organs = g(body, { opacity: 0 });
      el('path', { d: 'M 541,262 C 560,252 600,253 620,257 C 628,259 633,262 632,266 C 620,272 604,280 594,288 C 580,298 568,304 557,304 C 546,304 540,294 540,282 Z', fill: '#7a3f31', stroke: '#c9785f', 'stroke-width': 1.5 }, organs);
      el('path', { d: 'M 592,318 C 600,312 620,312 640,306 C 650,303 657,302 660,305 C 660,310 650,312 640,314 C 622,320 606,326 594,326 Z', fill: '#e9c27a', stroke: '#f6dca6', 'stroke-width': 1 }, organs);
      const hormone = [0, 1, 2, 3, 4, 5].map(() => el('circle', { cx: 0, cy: 0, r: 4, fill: INS, opacity: 0 }, body));
      const drops = [[574, 92], [626, 96], [522, 300], [678, 300], [560, 200], [640, 205]].map(([x, y]) => ({ e: el('path', { d: 'M 0,-7 C 4,-2 5,1 5,3 C 5,6 3,8 0,8 C -3,8 -5,6 -5,3 C -5,1 -4,-2 0,-7 Z', fill: C.water, opacity: 0 }, body), x, y }));
      const labOrg = g(root, { opacity: 0 });
      S.callout(labOrg, bx + 560 * BS, by + 275 * BS, 80, 300, '肝臟', '#c9785f', { size: 20 }).style.opacity = 1;
      S.callout(labOrg, bx + 645 * BS, by + 310 * BS, 400, 330, '胰島', '#e9c27a', { size: 20 }).style.opacity = 1;
      // 肝糖量
      const glyG = g(root, { opacity: 0 });
      el('rect', { x: 50, y: 360, width: 26, height: 150, rx: 6, fill: '#16293a', stroke: '#8aa1ae', 'stroke-width': 2 }, glyG);
      const glyBar = el('rect', { x: 54, y: 435, width: 18, height: 71, rx: 3, fill: '#d9a066' }, glyG);
      text(glyG, 63, 540, '肝糖', { 'font-size': 20, 'text-anchor': 'middle', fill: '#d9a066' });
      // 尿液杯（糖尿病）
      const cup = g(root, { opacity: 0 });
      el('path', { d: 'M 372,420 L 376,424 L 376,510 L 444,510 L 444,424 L 448,420', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3 }, cup);
      el('rect', { x: 377, y: 456, width: 66, height: 53, fill: '#e8c84a', opacity: 0.8 }, cup);
      const uGlu = g(cup, { opacity: 0 });
      [[396, 474], [422, 490], [400, 498]].forEach(([x, y]) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(x + Math.cos(a) * 9).toFixed(1)},${(y + Math.sin(a) * 9).toFixed(1)}`; } el('path', { d: d + 'Z', fill: 'rgba(255,207,92,0.35)', stroke: C.sugar, 'stroke-width': 2.5 }, uGlu); });
      text(cup, 410, 540, '尿液', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 狀況圖示
      const icons = {};
      icons.hot = g(root, { opacity: 0 });
      el('circle', { cx: 90, cy: 90, r: 30, fill: C.hi }, icons.hot);
      for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; el('line', { x1: 90 + Math.cos(a) * 38, y1: 90 + Math.sin(a) * 38, x2: 90 + Math.cos(a) * 50, y2: 90 + Math.sin(a) * 50, stroke: C.hi, 'stroke-width': 4 }, icons.hot); }
      icons.cold = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 60, width: 110, height: 40, rx: 8, fill: '#dfe7ea' }, icons.cold);
      [0, 1, 2].forEach((k) => el('line', { x1: 52, y1: 86 + k * 4, x2: 138, y2: 86 + k * 4, stroke: '#8aa1ae', 'stroke-width': 1.5 }, icons.cold));
      [0, 1, 2].forEach((k) => el('path', { d: `M ${62 + k * 30},108 q -8,14 0,28 q 8,14 0,28`, fill: 'none', stroke: '#9fd8ff', 'stroke-width': 3 }, icons.cold));
      text(icons.cold, 95, 50, '冷氣', { 'font-size': 20, 'text-anchor': 'middle', fill: '#9fd8ff' });
      icons.meal = g(root, { opacity: 0 });
      el('path', { d: 'M 50,90 L 130,90 C 128,122 112,136 90,136 C 68,136 52,122 50,90 Z', fill: '#e8dcc0', stroke: '#fff', 'stroke-width': 2 }, icons.meal);
      el('ellipse', { cx: 90, cy: 90, rx: 40, ry: 10, fill: '#f6f2e6' }, icons.meal);
      text(icons.meal, 90, 66, '吃飯', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      icons.fast = g(root, { opacity: 0 });
      el('circle', { cx: 90, cy: 96, r: 32, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, icons.fast);
      el('path', { d: 'M 90,96 L 90,74 M 90,96 L 106,104', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linecap': 'round' }, icons.fast);
      text(icons.fast, 90, 158, '很久沒吃', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      const shiverG = g(root, { opacity: 0 }); // 發抖的記號
      [[108, 250], [96, 330], [352, 250], [364, 330]].forEach(([x, y]) => el('path', { d: `M ${x},${y} l 6,-8 l 6,8 l 6,-8 l 6,8`, fill: 'none', stroke: '#9fd8ff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, shiverG));
      const respLbl = text(root, 230, 600, '', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });

      // ---------- 圖表 ----------
      const PX0 = 600, PX1 = 1160, PY0 = 520, PY1 = 92;
      const chart = g(root);
      const chartTitle = text(root, PX0, 44, '', { 'font-size': 26, 'font-weight': 700 });
      const readout = text(root, PX1, 46, '', { 'font-size': 30, 'text-anchor': 'end', 'font-weight': 700, class: 'mono' });
      const plot = g(root);
      const line = el('path', { fill: 'none', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, root);
      const dot = el('circle', { r: 8, stroke: C.bg, 'stroke-width': 2 }, root);
      text(root, (PX0 + PX1) / 2, 566, '時間（示意）＊ →', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const yOf = (v) => { const M = MODES[st.mode]; return PY0 - ((S.clamp(v, M.min, M.max) - M.min) / (M.max - M.min)) * (PY0 - PY1); };
      function drawAxes() {
        const M = MODES[st.mode];
        chart.innerHTML = '';
        el('rect', { x: PX0, y: yOf(M.hi), width: PX1 - PX0, height: yOf(M.lo) - yOf(M.hi), fill: 'rgba(255,209,102,0.10)' }, chart);
        text(chart, PX1 - 8, yOf(M.hi) - 8, '正常範圍＊', { 'font-size': 20, 'text-anchor': 'end', fill: C.hi });
        M.ticks.forEach((v) => { el('line', { x1: PX0, y1: yOf(v), x2: PX1, y2: yOf(v), stroke: '#22384a', 'stroke-width': 1.5 }, chart); text(chart, PX0 - 10, yOf(v) + 7, String(v), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute }); });
        el('line', { x1: PX0, y1: PY0, x2: PX1, y2: PY0, stroke: C.mute, 'stroke-width': 2 }, chart);
        chartTitle.textContent = `${M.name}（${M.unit}）${st.mode === 'sugar' ? '＊' : ''}`;
        line.setAttribute('stroke', M.col); dot.setAttribute('fill', M.col);
      }
      function drawPlot() {
        const M = MODES[st.mode], t0 = Math.max(0, st.t - WIN), xOf = (t) => PX0 + ((t - t0) / WIN) * (PX1 - PX0);
        let d = '';
        st.hist.forEach((h) => { if (h.t >= t0) d += (d ? 'L' : 'M') + `${xOf(h.t).toFixed(1)},${yOf(h.v).toFixed(1)}`; });
        line.setAttribute('d', d);
        const cx = xOf(st.t);
        dot.setAttribute('cx', cx); dot.setAttribute('cy', yOf(st.v));
        plot.innerHTML = '';
        st.marks.filter((m) => m.t >= t0).forEach((m, i) => {
          const x = xOf(m.t);
          el('line', { x1: x, y1: PY1, x2: x, y2: PY0, stroke: m.col, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.8 }, plot);
          text(plot, x + 6, PY1 + 22 + (i % 2) * 30, m.label, { 'font-size': 20, fill: m.col });
        });
        readout.textContent = M.fmt(st.v);
        const inBand = st.v >= M.lo && st.v <= M.hi;
        readout.setAttribute('fill', inBand ? C.ink : '#ff8f8f');
      }

      // ---------- 模擬 ----------
      function step(dtReal) {
        const M = MODES[st.mode], s = st, dt = dtReal * SPEED; // dt：模擬的時間；流汗、發抖等小動畫用真實時間 vt
        s.vt += dtReal;
        s.t += dt;
        let load = 0, I = 0;
        if (s.ev === 'hot') load = HOT;
        if (s.ev === 'cold') load = COLD;
        if (s.ev === 'meal') { s.evT += dt; I = s.evT < MEAL_SEC ? MEAL : 0; load = I; }
        if (s.ev === 'fast') load = FAST;
        let E = 0;
        const dev = s.v - M.set;
        if (s.resp === 'cool') E = dev > 0 ? -(Math.max(load, 0) + 0.3 * dev) : -0.05;
        if (s.resp === 'warm') E = dev < 0 ? Math.max(-load, 0) - 0.3 * dev : 0.05;
        if (s.resp === 'ins') { E = dev > 0 ? -(I + 0.3 * dev) : -0.9; if (s.lowIns) E *= 0.05; if (E < 0) s.gly = Math.min(1, s.gly - E * dt * 0.004); }
        if (s.resp === 'glu') { E = s.gly > 0.02 ? (dev < 0 ? -load - 0.3 * dev : 0.9) : 0; if (E > 0) s.gly = Math.max(0, s.gly - E * dt * 0.004); }
        s.v = S.clamp(s.v + (load + E) * dt, M.min + 0.3, M.max - 0.3);
        if (!s.hist.length || s.t - s.hist[s.hist.length - 1].t >= 0.2) s.hist.push({ t: s.t, v: s.v });
        while (s.hist.length && s.hist[0].t < s.t - WIN - 2) s.hist.shift();
        if (s.mode === 'sugar' && s.lowIns && s.v > 180 && !s.urineGlu) { s.urineGlu = true; status('血糖一直降不下來，太高了，尿中出現了一些小分子……'); addLog('胰島素不足的人吃完飯', '血糖一直很高（超過正常範圍）'); missionTick(dt, true); }
        missionTick(dt);
        render();
      }
      let jitter = 0;
      function render() {
        const s = st, temp = s.mode === 'temp';
        Object.entries(icons).forEach(([k, ic]) => { ic.style.opacity = s.ev === k && !s.hideEv ? 1 : 0; });
        // 體溫反應
        const sweat = temp && s.resp === 'cool', shiver = temp && s.resp === 'warm';
        tint.setAttribute('fill', sweat ? 'rgba(255,95,116,0.28)' : shiver ? 'rgba(170,200,255,0.25)' : 'rgba(0,0,0,0)');
        drops.forEach((d, i) => { const k = ((s.vt * 0.7 + i / drops.length) % 1); d.e.setAttribute('transform', `translate(${d.x},${d.y + k * 30})`); d.e.style.opacity = sweat ? Math.sin(k * Math.PI) : 0; });
        jitter = shiver ? Math.sin(s.vt * 60) * 1.6 : 0;
        body.setAttribute('transform', `translate(${jitter.toFixed(2)},0)`);
        shiverG.style.opacity = shiver ? 1 : 0;
        // 血糖：器官、激素、肝糖
        organs.style.opacity = temp ? 0 : 1; labOrg.style.opacity = temp ? 0 : 1; glyG.style.opacity = temp ? 0 : 1;
        glyBar.setAttribute('y', 506 - 142 * s.gly); glyBar.setAttribute('height', 142 * s.gly);
        const horm = !temp && (s.resp === 'ins' || s.resp === 'glu');
        hormone.forEach((h, i) => {
          const k = (s.vt * 0.5 + i / hormone.length) % 1, toLiver = s.resp === 'glu' || i % 2 === 0;
          const tx = toLiver ? 575 : (i % 4 === 1 ? 520 : 680), ty = toLiver ? 280 : 300 + (i % 3) * 40;
          h.setAttribute('cx', S.lerp(640, tx, k)); h.setAttribute('cy', S.lerp(310, ty, k));
          h.setAttribute('fill', s.resp === 'glu' ? GLUC : INS);
          h.style.opacity = horm ? Math.sin(k * Math.PI) * (s.lowIns && s.resp === 'ins' ? 0.35 : 1) : 0;
        });
        cup.style.opacity = !temp && s.lowIns ? 1 : 0;
        uGlu.style.opacity = s.urineGlu ? 1 : 0;
        respLbl.textContent = s.resp ? `身體的反應：${RESPS[s.resp][1]}${s.lowIns && s.resp === 'ins' ? '（不足）' : ''}` : '';
        respLbl.setAttribute('fill', s.resp === 'cool' ? '#ff8f8f' : s.resp === 'warm' ? '#9fd8ff' : s.resp === 'glu' ? GLUC : INS);
        drawPlot();
      }
      let raf = 0, lastTs = 0;
      const loop = (ts) => { const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0); lastTs = ts; if (dt > 0) step(dt); raf = requestAnimationFrame(loop); };

      // ---------- 操作 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function addLog(a, r) { log.push([a, r]); $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>狀況與反應</th><th>結果</th></tr></thead><tbody>${log.map(([x, y], i) => `<tr><td>${i + 1}</td><td>${x}</td><td>${y}</td></tr>`).join('')}</tbody></table>`; }
      // 胰島素不足的人，空腹血糖就已經偏高（示意＊）
      const baseV = (mode) => (mode === 'sugar' && st.lowIns ? 150 : MODES[mode].set);
      function setMode(mode) {
        if (st.mode === mode && st.hist.length) return;
        if (mode === 'temp') st.lowIns = false;
        Object.assign(st, { mode, v: baseV(mode), t: 0, hist: [], marks: [], ev: null, evT: 0, resp: null, urineGlu: false, okT: 0, hideEv: false });
        drawAxes(); render(); syncFree();
      }
      function startEvent(ev, fresh = true) {
        const [mode, , short] = EVENTS[ev];
        if (st.mode !== mode) setMode(mode);
        if (fresh) Object.assign(st, { v: baseV(mode), t: 0, hist: [], marks: [], gly: ev === 'fast' ? 0.7 : 0.5, urineGlu: false });
        Object.assign(st, { ev, evT: 0, resp: null, okT: 0, hideEv: false });
        st.marks.push({ t: st.t, label: short, col: C.ink2 });
        status(ev === 'hot' ? '在大太陽下跑步，身體產生很多熱……看看體溫曲線。' : ev === 'cold' ? '走進很冷的冷氣房，身體的熱散失得很快……' : ev === 'meal' ? '吃完飯，葡萄糖被吸收進入血液……看看血糖曲線。' : '很久沒有吃東西，血液中的葡萄糖慢慢被用掉……');
        syncFree();
      }
      function respond(r) {
        st.resp = r; st.okT = 0;
        st.marks.push({ t: st.t, label: r === 'cool' ? '流汗' : r === 'warm' ? '發抖' : r === 'ins' ? '胰島素' : '升糖素', col: r === 'cool' ? '#ff8f8f' : r === 'warm' ? '#9fd8ff' : r === 'ins' ? INS : GLUC });
        syncFree();
      }

      // ---------- 自由探索 ----------
      function syncFree() {
        box.querySelectorAll('#labK-mode button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.mode));
        const evs = Object.entries(EVENTS).filter(([, [m]]) => m === st.mode), rs = Object.entries(RESPS).filter(([, [m]]) => m === st.mode);
        $('evs').innerHTML = evs.map(([k, [, n]]) => `<button class="ctl small" type="button" data-e="${k}" aria-pressed="${st.ev === k && !st.hideEv}">${n}</button>`).join('') + `<button class="ctl small" type="button" data-e="" aria-pressed="${!st.ev}">沒有特別狀況</button>`;
        $('rs').innerHTML = rs.map(([k, [, n]]) => `<button class="ctl small" type="button" data-r="${k}" aria-pressed="${st.resp === k}">${n}</button>`).join('') + `<button class="ctl small" type="button" data-r="" aria-pressed="${!st.resp}">不反應</button>`;
        $('evs').querySelectorAll('[data-e]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.e) startEvent(b.dataset.e, false); else { st.ev = null; syncFree(); } }));
        $('rs').querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.r) respond(b.dataset.r); else { st.resp = null; syncFree(); } }));
        $('diab-row').hidden = st.mode !== 'sugar';
        $('diab').checked = st.lowIns;
      }
      box.querySelectorAll('#labK-mode button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.v)));
      $('diab').addEventListener('change', () => { st.lowIns = $('diab').checked; st.mode = ''; setMode('sugar'); status(st.lowIns ? '胰島素分泌不足：空腹時血糖就比較高。試試看讓他吃飯。' : '胰島素分泌正常。'); });
      $('restart').addEventListener('click', () => { const m = st.mode; st.mode = ''; setMode(m); status('重新開始。'); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, phase = 'idle', wrong = null, done = false, picked = -1, needShown = null;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-balance'); // 存檔的進度（要在第一次畫圓點前讀）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 切換任務：enter() 會把曲線重新開始，正在進行的狀況不列入紀錄
      function goMission(k) {
        if (done) doneK.add(mi);
        mi = k; done = false; picked = -1; phase = 'idle'; wrong = null; needShown = null; enter(); drawMission();
      }
      S.onDots(mbox, goMission);
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>恆定的調節</strong>偏離正常範圍 → 身體察覺 → 做出反應 → 回到正常範圍。<br>體溫：熱時流汗、皮膚血管擴張；冷時發抖、皮膚血管收縮。看到這些反應，也能反推環境是熱還是冷。<br>血糖：飯後胰島素使血糖下降；很久沒吃，升糖素使肝糖分解、血糖上升。<br>胰島素不足，血糖長期過高，尿中可能出現葡萄糖（糖尿病）。</div>
            <button class="ctl primary" type="button" id="labK-again">再練習一次</button>`;
          mbox.querySelector('#labK-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.guess) {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else if (m.diab) {
          const ready = m.need(st);
          needShown = ready;
          if (!ready) html += `<p class="m-text">${m.needText}</p><div class="acts"><button class="ctl primary" type="button" id="labK-go" ${phase === 'idle' ? '' : 'disabled'}>${m.act}</button></div>${phase !== 'idle' ? '<p class="m-hint">看看血糖曲線和左邊的尿液杯……</p>' : ''}`;
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done || !ready ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          const [, evName] = EVENTS[m.ev];
          html += `<p class="m-text">${m.text}</p>`;
          html += `<div class="acts"><button class="ctl ${phase === 'idle' ? 'primary' : ''}" type="button" id="labK-go" aria-pressed="${phase !== 'idle'}" ${phase === 'idle' ? '' : 'disabled'}>${evName}${phase === 'idle' ? '' : ' ✓'}</button></div>`;
          if (phase === 'rising') html += '<p class="m-hint">觀察右邊的曲線……</p>';
          if (phase === 'choose' || phase === 'recover') {
            const rs = Object.entries(RESPS).filter(([, [md]]) => md === EVENTS[m.ev][0]);
            html += `<p class="m-text">${MODES[EVENTS[m.ev][0]].name}偏離正常範圍了！身體要怎麼反應？</p><div class="acts">${rs.map(([k, [, n]]) => `<button class="ctl primary" type="button" data-r="${k}" aria-pressed="${st.resp === k}" ${phase === 'recover' ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
            if (wrong && phase === 'choose') html += `<div class="fb bad"><strong>再想想看</strong>${HINTS[wrong]}</div>`;
            if (phase === 'recover' && !done) html += `<p class="m-hint">選對了！看看${MODES[EVENTS[m.ev][0]].name}能不能回到正常範圍……</p>`;
          }
          if (done) html += `<div class="fb ok"><strong>回到正常範圍了</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labK-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        const go = mbox.querySelector('#labK-go');
        if (go) go.addEventListener('click', () => {
          if (m.diab) { setMode('sugar'); st.lowIns = true; startEvent('meal'); respond('ins'); st.marks.pop(); st.marks.push({ t: st.t, label: '胰島素（不足）', col: INS }); phase = 'rising'; }
          else { startEvent(m.ev); phase = 'rising'; wrong = null; }
          drawMission();
        });
        mbox.querySelectorAll('.acts [data-r]').forEach((b) => b.addEventListener('click', () => {
          const r = b.dataset.r;
          respond(r);
          if (r === RIGHT[m.ev]) { phase = 'recover'; wrong = null; status('身體做出反應了，看看曲線的變化。'); }
          else { wrong = `${m.ev}-${r}`; status(`${MODES[st.mode].name}離正常範圍更遠了！再想一想。`); addLog(`${EVENTS[m.ev][2]} → ${RESPS[r][1]}`, `${MODES[st.mode].name}${m.ev === 'hot' || m.ev === 'meal' ? '繼續上升' : '繼續下降'}，離正常範圍更遠`); }
          drawMission();
        }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === m.quiz.ans) { done = true; if (m.guess) { st.hideEv = false; syncFree(); status('答對了：他在很冷的冷氣房裡（左上角）。發抖、皮膚血管收縮讓體溫維持在約 37 °C。'); addLog('看到發抖、皮膚血管收縮', '推測環境很冷'); } } else picked = k;
          drawMission();
        }));
        const nx = mbox.querySelector('#labK-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      // 每一格都會呼叫：只有階段改變時才重畫
      function missionTick(dt, force) {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.guess) return;
        if (m.diab) { if (force || m.need(st) !== needShown) drawMission(); return; }
        const M = MODES[st.mode];
        if (!M || st.ev !== m.ev) return;
        if (phase === 'rising' && (st.v > M.hi || st.v < M.lo)) { phase = 'choose'; status(`${M.name}已經偏離正常範圍了！在任務卡上選出身體的反應。`); drawMission(); }
        if (phase === 'recover') {
          // 回到設定值附近並維持一下，才算完成
          if (Math.abs(st.v - M.set) < (st.mode === 'temp' ? 0.15 : 6)) st.okT += dt; else st.okT = 0;
          if (st.okT > 1.5) { done = true; status(`${M.name}回到正常範圍了（${M.fmt(st.v)}）。`); addLog(`${EVENTS[m.ev][2]} → ${RESPS[st.resp][1]}`, `回到正常範圍（${M.fmt(st.v)}）`); drawMission(); }
        }
      }
      function enter() {
        const m = MISSIONS[mi];
        if (!m) return;
        const mode = m.diab ? 'sugar' : m.guess ? 'temp' : EVENTS[m.ev][0];
        st.lowIns = false; // 先關掉，從「胰島素不足」跳到別的血糖任務時，曲線才會從正常的血糖開始
        st.mode = ''; setMode(mode);
        // 反推環境：身體已經在反應，但先不顯示環境的圖示
        if (m.guess) Object.assign(st, { ev: 'cold', resp: 'warm', hideEv: true });
        status(m.diab ? '如果胰島素分泌不足……' : m.guess ? '看看左邊的人：身體出現了什麼反應？' : `觀察的是<b>${MODES[mode].name}</b>。按任務卡上的按鈕開始。`);
        syncFree();
      }
      function reset() {
        log.length = 0; $('log').innerHTML = '<p class="m-hint">每次的狀況、身體的反應和結果會列在這裡。</p>';
        mi = 0; done = false; picked = -1; phase = 'idle'; wrong = null; needShown = null; doneK.clear();
        $('free').open = false;
        enter(); drawMission();
      }

      reset();
      // 接上存檔的進度：圓點照舊，從第一個還沒做的任務開始（都做完就顯示完成畫面）
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < MISSIONS.length).forEach((k) => doneK.add(k));
        if (doneK.size) { const k0 = MISSIONS.findIndex((_, k) => !doneK.has(k)); goMission(k0 < 0 ? MISSIONS.length : k0); }
      }
      raf = requestAnimationFrame(loop);
      S._labK = { st, advance(sec) { for (let i = 0; i < sec * 20; i++) step(0.05); }, get phase() { return phase; } }; // 測試用：advance(真實秒數)
      return { unmount() { cancelAnimationFrame(raf); delete S._labK; } };
    },
  });
})();
