/* 互動模型：食物中的養分檢測 — 選樣品 → 選試劑（碘液／本氏液／紙片）→ 要不要隔水加熱 → 看顏色 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;

  // 顏色：[色碼, 名稱]
  const COL = {
    iod: ['#c5852c', '黃褐色'], bb: ['#1f2a66', '藍黑色'],
    blue: ['#3b78d8', '藍色'], green: ['#45a849', '綠色'], yellow: ['#e3c53a', '黃色'], orange: ['#e8862a', '橙色'], red: ['#b8382a', '磚紅色'],
  };
  const BSTEP = ['blue', 'green', 'yellow', 'orange', 'red'];

  // glu：葡萄糖的多少（0 沒有、1 少、2 多）
  const SAMP = [
    { k: 'rice', name: '米飯糊', fill: '#ebe4cf', starch: true, glu: 0 },
    { k: 'gluA', name: '葡萄糖水 A', fill: 'rgba(170,215,240,0.45)', glu: 1 },
    { k: 'gluB', name: '葡萄糖水 B', fill: 'rgba(170,215,240,0.45)', glu: 2 },
    { k: 'suc', name: '砂糖水', fill: 'rgba(170,215,240,0.45)', glu: 0 },
    { k: 'egg', name: '蛋白液', fill: '#efeccf', glu: 0 },
    { k: 'oil', name: '沙拉油', fill: '#f1c84a', glu: 0, oil: true },
  ];
  const TESTS = { iod: '碘液', ben: '本氏液', paper: '紙片（補充）' };
  const COLS = [['iod', '碘液'], ['ben0', '本氏液<br>不加熱'], ['ben1', '本氏液<br>隔水加熱'], ['paper', '紙片<br>（補充）']];

  // 檢測結果（顏色 key 或 true/false）
  const outcome = (s, key) => {
    if (key === 'iod') return s.starch ? 'bb' : 'iod';
    if (key === 'ben0') return 'blue';
    if (key === 'ben1') return BSTEP[[0, 1, 4][s.glu]];
    return !!s.oil; // paper
  };

  const MISSIONS = [
    { title: '澱粉檢測', text: '用<b>碘液</b>檢測<b>米飯糊</b>，看看顏色怎麼變。', acts: [['米飯糊 ＋ 碘液', 0, 'iod']], done: (R) => R.rice.iod,
      why: '米飯含有很多澱粉，澱粉遇碘液變成<b>藍黑色</b>。碘液檢測不需要加熱。' },
    { title: '本氏液要加熱', text: '用<b>本氏液</b>檢測<b>葡萄糖水 B</b>：先<b>不加熱</b>，再<b>隔水加熱</b>，比較結果。', acts: [['不加熱', 2, 'ben', 0], ['隔水加熱', 2, 'ben', 1]], done: (R) => R.gluB.ben0 && R.gluB.ben1,
      why: '本氏液原本是藍色。加入含葡萄糖的溶液後，要<b>隔水加熱</b>才會變色；不加熱就看不出來。' },
    { title: '比一比多少', need: (R) => R.gluA.ben1 && R.gluB.ben1, needText: '用本氏液<b>隔水加熱</b>，分別檢測兩杯葡萄糖水：', acts: [['檢測 A', 1, 'ben', 1], ['檢測 B', 2, 'ben', 1]],
      quiz: { q: '哪一杯的葡萄糖比較多？', opts: ['葡萄糖水 A', '葡萄糖水 B', '兩杯一樣多'], ans: 1, hint: '比較兩支試管的顏色：越接近紅色，表示葡萄糖越多。' },
      why: 'A 只變成綠色，B 變成磚紅色。葡萄糖越多，本氏液加熱後的顏色越往<b>黃、橙、紅</b>變化。' },
    { title: '甜的就有葡萄糖嗎？', predict: { q: '砂糖水很甜。用本氏液<b>隔水加熱</b>檢測，會變色嗎？先預測：', opts: ['會變成黃、橙或紅色', '仍然是藍色'], ans: 1 },
      text: '做實驗看看預測對不對：', acts: [['砂糖水 ＋ 本氏液（隔水加熱）', 3, 'ben', 1]], done: (R) => R.suc.ben1,
      why: '砂糖的成分是<b>蔗糖</b>，雖然很甜，卻不會讓本氏液變色。本氏液只能檢測出葡萄糖等<b>部分</b>醣類，所以「甜」不代表含有葡萄糖。' },
    { title: '油脂（補充）', text: '把<b>沙拉油</b>和<b>葡萄糖水</b>分別滴在紙上，等紙乾了再比較。', acts: [['沙拉油滴在紙上', 5, 'paper'], ['葡萄糖水滴在紙上', 1, 'paper']], done: (R) => R.oil.paper !== undefined && SAMP.some((s) => s.k !== 'oil' && R[s.k].paper !== undefined),
      why: '油脂會讓紙留下<b>半透明的油斑</b>，乾了也不會消失；水分乾了就看不出痕跡。' },
    { title: '判斷養分', quiz: { q: '某種食物磨碎加水：加碘液變藍黑色；加本氏液隔水加熱，仍是藍色。這種食物主要含有哪種養分？', opts: ['澱粉', '葡萄糖', '油脂'], ans: 0, hint: '碘液和本氏液各自檢測哪一種養分？' },
      why: '碘液變藍黑色 → 含有澱粉；本氏液沒有變色 → 沒有檢測出葡萄糖。米飯、馬鈴薯就是這樣。' },
  ];

  S.registerLab({
    id: 'lab-food', section: '3-1', title: '養分檢測實驗室',
    mount(box) {
      box.innerHTML = `
<style>
  .labT { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labT .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labT .pad { padding: 1rem 1.25rem; }
  .labT .tbl td, .labT .tbl th { vertical-align: middle; }
  .labT .tbl th:first-child { white-space: nowrap; }
  .labT .chip { display: inline-block; width: 0.8em; height: 0.8em; border-radius: 50%; background: var(--c); margin-right: 0.3em; vertical-align: -0.05em; box-shadow: 0 0 0 1px rgba(255,255,255,.35); }
  .labT .seg-ctl button:disabled { opacity: 0.4; cursor: not-allowed; }
  .labT .table-wrap { overflow-x: auto; }
  .labT .tbl { min-width: 26rem; }
  @media (max-width: 900px) {
    .labT { display: flex; flex-direction: column; align-items: stretch; }
    .labT .col { display: contents; }
    .labT .c-stage { order: 1; } .labT .c-mis { order: 2; } .labT .c-table { order: 3; } .labT .c-ctl { order: 4; }
  }
</style>
<div class="labT">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="養分檢測：樣品、試劑、試管、隔水加熱和紙片"></svg></div>
      <div class="pad">
        <p class="status-line" id="labT-status" aria-live="polite"></p>
        <p class="footnote">＊示意：顏色和加熱時間都是示意，實際隔水加熱約需數分鐘；本氏液最後的顏色會依葡萄糖多少而不同。紙片油斑法是補充的簡易方法。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>結果紀錄</h3><div class="table-wrap" id="labT-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labT-mission"></div>
    <details class="card pad free c-ctl" id="labT-free"><summary>自由探索：自己選樣品和試劑</summary>
      <div class="field"><div class="field-head"><span>1. 選樣品</span></div>
        <div class="seg-ctl" role="group" aria-label="樣品" id="labT-samp">${SAMP.map((s, i) => `<button type="button" data-v="${i}">${s.name}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>2. 檢測方法</span></div>
        <div class="seg-ctl" role="group" aria-label="檢測方法" id="labT-test">${Object.entries(TESTS).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>3. 加熱</span><output id="labT-heat-o"></output></div>
        <div class="seg-ctl" role="group" aria-label="加熱" id="labT-heat"><button type="button" data-v="0">不加熱</button><button type="button" data-v="1">隔水加熱</button></div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labT-go">開始檢測</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labT-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { si: 0, test: 'iod', heat: 0 };
      const R = {}; SAMP.forEach((s) => { R[s.k] = {}; });
      let tl = null;

      // ---------- 上排：樣品燒杯 ----------
      const SX = (i) => 140 + i * 184;
      const selRing = el('rect', { x: -84, y: -48, width: 168, height: 150, rx: 16, fill: 'none', stroke: C.hi, 'stroke-width': 4 }, root);
      SAMP.forEach((s, i) => {
        const b = g(root, { transform: `translate(${SX(i)},70)`, style: 'cursor:pointer' });
        el('rect', { x: -84, y: -48, width: 168, height: 150, fill: 'transparent' }, b);
        el('path', { d: 'M -36,-8 L -36,30 Q -36,40 -26,40 L 26,40 Q 36,40 36,30 L 36,-8 Z', fill: s.fill }, b);
        el('path', { d: 'M -42,-34 L -36,-30 L -36,30 Q -36,40 -26,40 L 26,40 Q 36,40 36,30 L 36,-34', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, b);
        text(b, 0, 82, s.name, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
        b.addEventListener('click', () => { st.si = i; sync(); });
      });

      // ---------- 試劑瓶 ----------
      const bottle = (x, label, col) => {
        const b = g(root);
        el('path', { d: `M ${x - 44},560 L ${x - 44},470 Q ${x - 44},440 ${x - 18},436 L ${x - 18},418 L ${x + 18},418 L ${x + 18},436 Q ${x + 44},440 ${x + 44},470 L ${x + 44},560 Z`, fill: '#16293a', stroke: '#5f7d8f', 'stroke-width': 3 }, b);
        el('rect', { x: x - 38, y: 480, width: 76, height: 74, rx: 6, fill: col, opacity: 0.85 }, b);
        text(b, x, 596, label, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
        return b;
      };
      bottle(110, '碘液', COL.iod[0]);
      bottle(240, '本氏液', COL.blue[0]);
      const BOT = { iod: { x: 110 }, ben: { x: 240 } };

      // ---------- 隔水加熱 ----------
      const BX = 760, TBX = BX + 44; // 水浴中心、試管在水浴裡的位置
      // 整組往上移 24：字放大後，下方的「水浴（隔水加熱）」才不會壓在底座上、也不會被舞台下緣切掉
      const BDY = -24;
      const bath = g(root, { transform: `translate(0,${BDY})` });
      el('rect', { x: BX - 146, y: 584, width: 292, height: 22, rx: 6, fill: '#3a4a56' }, bath);
      const plate = el('rect', { x: BX - 130, y: 576, width: 260, height: 8, rx: 3, fill: '#5a6670' }, bath);
      el('rect', { x: BX - 126, y: 426, width: 252, height: 148, fill: 'rgba(95,184,255,0.16)' }, bath);
      el('path', { d: `M ${BX - 134},410 L ${BX - 126},416 L ${BX - 126},566 Q ${BX - 126},574 ${BX - 118},574 L ${BX + 118},574 Q ${BX + 126},574 ${BX + 126},566 L ${BX + 126},410`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bath);
      const steam = g(bath, { opacity: 0 });
      [-80, 96].forEach((dx) => el('path', { d: `M ${BX + dx},414 q -10,-14 0,-28 q 10,-14 0,-28`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, steam));
      text(bath, BX, 610 - BDY, '水浴（隔水加熱）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const heatLbl = text(bath, BX - 52, 512, '約 3 分鐘＊', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, opacity: 0 });

      // ---------- 紙片 ----------
      const PX = 1060;
      text(root, PX, 296, '紙片（補充）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      el('rect', { x: PX - 100, y: 312, width: 200, height: 200, rx: 4, fill: '#efe6c8' }, root);
      const spot = el('circle', { cx: PX, cy: 412, r: 0, fill: '#cdbf8e' }, root);
      const spotLbl = text(root, PX, 548, '', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });

      // ---------- 試管（可移動）----------
      const HOME = { x: 470, y: 300 };
      const tp = { x: HOME.x, y: HOME.y };
      const tube = g(root);
      const setTube = () => tube.setAttribute('transform', `translate(${tp.x.toFixed(1)},${tp.y.toFixed(1)})`);
      const clipId = 'labTclip';
      el('path', { d: 'M -22,0 L -22,188 C -22,214 22,214 22,188 L 22,0 Z' }, el('clipPath', { id: clipId }, el('defs', {}, root)));
      const liqG = g(tube, { 'clip-path': `url(#${clipId})` });
      const B = 212; // 試管底
      const low = el('rect', { x: -24, y: B, width: 48, height: 0, fill: COL.blue[0] }, liqG);
      const top = el('rect', { x: -24, y: B, width: 48, height: 0, fill: '#f1c84a' }, liqG);
      el('path', { d: 'M -28,-6 L -22,0 L -22,188 C -22,214 22,214 22,188 L 22,0 L 28,-6', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, tube);
      const lv = { low: 0, top: 0 };
      const setLiq = () => {
        low.setAttribute('y', B - lv.low); low.setAttribute('height', lv.low);
        top.setAttribute('y', B - lv.low - lv.top); top.setAttribute('height', lv.top);
      };
      const tubeLbl = text(root, HOME.x, 556, '', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const addLbl = text(root, HOME.x + 46, 340, '', { 'font-size': 22, fill: C.mute });
      setTube(); setLiq();

      // ---------- 滴管 ----------
      const dp = { x: 110, y: 380 };
      const dropper = g(root);
      el('path', { d: 'M -5,0 L -5,70 L 0,84 L 5,70 L 5,0 Z', fill: 'rgba(200,230,255,0.3)', stroke: '#cfe8ff', 'stroke-width': 2 }, dropper);
      el('path', { d: 'M -10,0 L -10,-22 Q -10,-40 0,-40 Q 10,-40 10,-22 L 10,0 Z', fill: '#d0574a' }, dropper);
      const setDrop = () => dropper.setAttribute('transform', `translate(${dp.x.toFixed(1)},${dp.y.toFixed(1)})`);
      const drops = [0, 1, 2].map(() => el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 9, opacity: 0 }, root));
      const restDropper = (k) => { dp.x = BOT[k].x; dp.y = 360; setDrop(); };
      restDropper('iod');
      const dropper2 = g(root, { transform: `translate(${BOT.ben.x},360)` }); // 另一瓶的滴管（靜止）
      el('path', { d: 'M -5,0 L -5,70 L 0,84 L 5,70 L 5,0 Z', fill: 'rgba(200,230,255,0.3)', stroke: '#cfe8ff', 'stroke-width': 2 }, dropper2);
      el('path', { d: 'M -10,0 L -10,-22 Q -10,-40 0,-40 Q 10,-40 10,-22 L 10,0 Z', fill: '#d0574a' }, dropper2);

      // ---------- 動畫 ----------
      const mv = (o, set, to, dur, pos) => tl.to(o, { ...to, duration: dur, ease: 'power2.inOut', onUpdate: set }, pos);

      function freshTube() {
        if (tl) tl.kill();
        tp.x = HOME.x; tp.y = HOME.y; setTube();
        lv.low = 0; lv.top = 0; setLiq();
        low.setAttribute('fill', COL.blue[0]);
        tubeLbl.textContent = ''; addLbl.textContent = '';
        gsap.set(drops, { opacity: 0 });
        gsap.set([steam, heatLbl], { opacity: 0 }); plate.setAttribute('fill', '#5a6670');
      }

      let busy = false;
      function run() {
        busy = true; drawMission();
        const s = SAMP[st.si], test = st.test, heat = test === 'ben' && st.heat === 1;
        const key = test === 'ben' ? (heat ? 'ben1' : 'ben0') : test;
        const res = outcome(s, key);
        freshTube();
        spot.setAttribute('r', 0); spotLbl.textContent = '';
        tl = gsap.timeline();
        if (test === 'paper') return runPaper(s, res);

        // 1. 倒入樣品（每次都用乾淨的試管）
        addLbl.textContent = `加入${s.name}`;
        tl.to(lv, { [s.oil ? 'top' : 'low']: s.oil ? 56 : 80, duration: 0.3, ease: 'power1.out', onUpdate: setLiq });
        tl.set(low, { attr: { fill: s.oil ? (test === 'iod' ? COL.iod[0] : COL.blue[0]) : s.fill } }, 0);

        // 2. 滴入試劑
        const rc = test === 'iod' ? COL.iod[0] : COL.blue[0];
        const others = test === 'iod' ? 'ben' : 'iod';
        dropper2.setAttribute('transform', `translate(${BOT[others].x},360)`);
        restDropper(test);
        tl.call(() => { addLbl.textContent = `滴入${TESTS[test]}`; });
        mv(dp, setDrop, { y: 250 }, 0.15);
        mv(dp, setDrop, { x: HOME.x }, 0.25);
        const surf = () => HOME.y + B - lv.low - lv.top;
        drops.forEach((d, i) => {
          tl.set(d, { attr: { cx: HOME.x, cy: 340, fill: rc }, opacity: 1 });
          tl.to(d, { attr: { cy: () => surf() - 6 }, duration: 0.15, ease: 'power2.in' });
          tl.set(d, { opacity: 0 });
        });
        if (s.oil) tl.to(lv, { low: 30, duration: 0.3, onUpdate: setLiq }, '<');
        else tl.to(lv, { low: 104, duration: 0.3, onUpdate: setLiq }, '<');
        const mixed = test === 'iod' ? COL.iod[0] : COL.blue[0];
        tl.to(low, { attr: { fill: s.oil ? rc : (test === 'iod' && s.starch ? COL.bb[0] : mixed) }, duration: 0.3 }, '<');
        const back = tl.duration(); // 滴管放回去的同時，試管就可以拿去加熱
        mv(dp, setDrop, { x: BOT[test].x }, 0.25);
        mv(dp, setDrop, { y: 360 }, 0.15);

        // 3. 隔水加熱
        if (heat) {
          tl.call(() => { addLbl.textContent = '放進熱水中加熱'; }, null, back);
          mv(tp, setTube, { y: 190 }, 0.15, back);
          mv(tp, setTube, { x: TBX }, 0.25, '>');
          mv(tp, setTube, { y: 330 + BDY }, 0.15, '>');
          tl.call(() => { addLbl.textContent = ''; }, null, '>');
          tl.to(plate, { attr: { fill: '#ff6b4a' }, duration: 0.2 }, '<');
          tl.to([steam, heatLbl], { opacity: 1, duration: 0.25 }, '<');
          const n = BSTEP.indexOf(res);
          // 放進熱水就開始變色（一格約 0.15 秒）
          if (!s.oil) for (let i = 1; i <= n; i++) tl.to(low, { attr: { fill: COL[BSTEP[i]][0] }, duration: 0.15, ease: 'none' }, i === 1 ? '<' : '>');
          if (n && !s.oil) tl.to({}, { duration: 0.15 });
          else tl.to({}, { duration: 0.7 }, '<');
          tl.call(() => finish(s, key, res)); // 顏色變好就出結果；試管再自己放回原位
          tl.to([steam, heatLbl], { opacity: 0, duration: 0.25 });
          tl.to(plate, { attr: { fill: '#5a6670' }, duration: 0.25 }, '<');
          mv(tp, setTube, { y: 190 }, 0.2);
          mv(tp, setTube, { x: HOME.x }, 0.3);
          mv(tp, setTube, { y: HOME.y }, 0.2);
        } else tl.call(() => finish(s, key, res));
      }

      function runPaper(s, oily) {
        addLbl.textContent = '';
        const d = drops[0];
        tl.set(d, { attr: { cx: PX, cy: 230, fill: s.fill }, opacity: 1 });
        tl.to(d, { attr: { cy: 404 }, duration: 0.35, ease: 'power2.in' });
        tl.set(d, { opacity: 0 });
        tl.set(spot, { attr: { fill: '#cdbf8e' }, opacity: 1 });
        tl.to(spot, { attr: { r: 44 }, duration: 0.4, ease: 'power1.out' });
        tl.call(() => { spotLbl.textContent = '等紙乾……'; spotLbl.setAttribute('fill', C.mute); });
        tl.to({}, { duration: 0.8 });
        if (!oily) tl.to(spot, { opacity: 0, duration: 0.7 });
        else tl.to(spot, { attr: { fill: '#f8f1d6' }, duration: 0.7 }); // 油斑：透光、看起來較亮
        tl.call(() => finish(s, 'paper', oily));
      }

      function finish(s, key, res) {
        R[s.k][key] = res; busy = false;
        let msg;
        if (key === 'paper') {
          spotLbl.textContent = res ? '半透明油斑' : '沒有痕跡';
          spotLbl.setAttribute('fill', res ? C.hi : C.ink2);
          msg = res ? '紙乾了以後，仍留下<b>半透明的油斑</b>：含有油脂。' : '水分乾了，紙上沒有留下油斑：沒有檢測出油脂。';
        } else {
          const [hex, nm] = COL[res];
          tubeLbl.textContent = s.oil ? `下層：${nm}` : nm;
          tubeLbl.setAttribute('fill', res === 'bb' ? '#8fa8ff' : hex);
          if (key === 'iod') msg = res === 'bb' ? '變成<b>藍黑色</b>：含有澱粉。' : `仍是碘液的<b>黃褐色</b>：沒有檢測出澱粉。`;
          else if (key === 'ben0') msg = '還是<b>藍色</b>。本氏液要<b>隔水加熱</b>，才能判斷有沒有葡萄糖。';
          else msg = res === 'blue' ? '加熱後仍是<b>藍色</b>：沒有檢測出葡萄糖。' : `加熱後變成<b>${nm}</b>：含有葡萄糖。顏色越接近紅色，葡萄糖越多。`;
          if (s.oil) msg = `油比水輕，浮在上層；下層的試劑沒有變色。${key === 'iod' ? '沒有檢測出澱粉。' : key === 'ben1' ? '沒有檢測出葡萄糖。' : ''}`;
          if (s.k === 'suc' && key === 'ben1') msg += '砂糖（蔗糖）雖然很甜，卻不會讓本氏液變色。';
          if (s.k === 'egg' && key !== 'ben0') msg += '蛋白液主要含有蛋白質，這個試劑檢測不到蛋白質。';
        }
        $('status').innerHTML = `${s.name} ＋ ${TESTS[key === 'ben0' || key === 'ben1' ? 'ben' : key]}${key === 'ben1' ? '（隔水加熱）' : key === 'ben0' ? '（不加熱）' : ''} → ${msg}`;
        table();
        checkMission(); drawMission();
      }

      // ---------- 結果表 ----------
      function table() {
        const cell = (s, k) => {
          const v = R[s.k][k];
          if (v === undefined) return '<td class="m-hint">—</td>';
          if (k === 'paper') return `<td>${v ? '油斑' : '沒有痕跡'}</td>`;
          return `<td><span class="chip" style="--c:${COL[v][0]}"></span>${COL[v][1]}</td>`;
        };
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>樣品</th>${COLS.map(([, h]) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${SAMP.map((s) => `<tr><th>${s.name}</th>${COLS.map(([k]) => cell(s, k)).join('')}</tr>`).join('')}</tbody></table>`;
      }

      // ---------- 控制 ----------
      function sync() {
        box.querySelectorAll('#labT-samp button').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.v === st.si));
        box.querySelectorAll('#labT-test button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.test));
        const canHeat = st.test === 'ben';
        box.querySelectorAll('#labT-heat button').forEach((b) => { b.disabled = !canHeat; b.setAttribute('aria-pressed', canHeat && +b.dataset.v === st.heat); });
        $('heat-o').textContent = canHeat ? '' : st.test === 'iod' ? '碘液不需要加熱' : '紙片不需要加熱';
        selRing.setAttribute('transform', `translate(${SX(st.si)},70)`);
      }
      box.querySelectorAll('#labT-samp button').forEach((b) => b.addEventListener('click', () => { st.si = +b.dataset.v; sync(); }));
      box.querySelectorAll('#labT-test button').forEach((b) => b.addEventListener('click', () => { st.test = b.dataset.v; sync(); }));
      box.querySelectorAll('#labT-heat button').forEach((b) => b.addEventListener('click', () => { st.heat = +b.dataset.v; sync(); }));
      $('go').addEventListener('click', run);

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-food'); // 上次存的進度：要在第一次畫圓點之前讀，reset() 之後再套用
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 正在做的檢測先停止（不列入紀錄）：動畫跳到最後但不執行回呼，器材回到原位，換一支乾淨的試管
      function stopRun() {
        if (!busy) return;
        tl.progress(1, true); busy = false;
        freshTube(); setDrop(); spot.setAttribute('r', 0); spotLbl.textContent = '';
      }
      function goMission(k) {
        if (done) doneK.add(mi);
        stopRun();
        mi = k; done = false; picked = -1; pred = -1; drawMission(); checkMission();
      }
      S.onDots(mbox, goMission);
      // 任務卡上的大按鈕：一按就做那個檢測
      const actsHtml = (m) => `<div class="acts">${m.acts.map(([label, si, test, heat], i) => {
        const key = test === 'ben' ? (heat ? 'ben1' : 'ben0') : test, did = R[SAMP[si].k][key] !== undefined;
        return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${did}" ${busy ? 'disabled' : ''}>${label}${did ? ' ✓' : ''}</button>`;
      }).join('')}</div>`;
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>檢測重點</strong>澱粉 ＋ 碘液 → 藍黑色（不用加熱）。<br>葡萄糖 ＋ 本氏液 → 隔水加熱後，由藍色變成綠、黃、橙、紅；越多越偏紅。<br>甜不代表有葡萄糖：蔗糖不會讓本氏液變色。</div>
            <button class="ctl primary" type="button" id="labT-again">再練習一次</button>`;
          mbox.querySelector('#labT-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (pred >= 0 && !done) html += `<p class="m-text">${m.text}</p>${actsHtml(m)}`;
          if (done) html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else if (m.quiz) {
          const ready = !m.need || m.need(R);
          if (!ready) html += `<p class="m-text">${m.needText}</p>${m.acts ? actsHtml(m) : ''}`;
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done || !ready ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.text}</p>`;
          if (done) html += `<div class="fb ok"><strong>完成</strong>${m.why}</div>`;
          else html += actsHtml(m);
        }
        if (done) html += `<button class="ctl primary" type="button" id="labT-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; drawMission(); checkMission(); }));
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => {
          const [, si, test, heat] = m.acts[+b.dataset.a];
          Object.assign(st, { si, test, heat: heat || 0 }); sync(); run();
        }));
        const nx = mbox.querySelector('#labT-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.quiz) { drawMission(); return; } // 條件達成後解鎖選項
        if (m.predict && pred < 0) return;
        if (m.done(R)) { done = true; drawMission(); }
      }
      function reset() {
        SAMP.forEach((s) => { R[s.k] = {}; });
        Object.assign(st, { si: 0, test: 'iod', heat: 0 });
        stopRun();
        mi = 0; done = false; picked = -1; pred = -1; doneK.clear();
        freshTube(); spot.setAttribute('r', 0); spotLbl.textContent = '';
        $('status').innerHTML = '按任務卡上的按鈕開始檢測。每次都會換一支乾淨的試管。';
        $('free').open = false;
        sync(); table(); drawMission();
      }

      reset();
      // 接上次的進度：做完的任務打勾，從第一個還沒做的開始
      if (sv) [...sv.ok, ...sv.miss].forEach((k) => { if (k < MISSIONS.length) doneK.add(k); });
      let k0 = 0; while (k0 < MISSIONS.length && doneK.has(k0)) k0++;
      goMission(k0);
      S._labT = { st, R, run };
      return { unmount() { if (tl) tl.kill(); delete S._labT; } };
    },
  });
})();
