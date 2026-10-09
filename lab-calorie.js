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
    { title: '減少熱散失', text: '加上<b>防風罩</b>，其他條件不變，再燒一次花生，和剛才比較。', acts: [['加防風罩，再燒一次花生', 'peanut', 'shield']], done: (rs) => rs.some((r) => r.food === 'peanut' && r.water === 100 && r.setup === 'shield') && rs.some((r) => r.food === 'peanut' && r.water === 100 && r.setup === 'open'),
      why: '防風罩讓熱比較不容易散失，水吸收到的熱量變多，測得的值更接近實際。' },
    { title: '公平比較', quiz: { q: '想比較「花生和棉花糖哪一個熱量比較多」，下列哪一項<b>必須保持相同</b>？', opts: ['食物的種類', '食物的質量、水量和裝置', '水上升的溫度'], ans: 1, hint: '食物種類是我們要改變的；上升的溫度是要觀察的結果。' },
      why: '操縱變因是食物種類；食物質量、水量、裝置（有沒有防風罩、距離）都要相同；水上升的溫度是應變變因。' },
    { title: '誰的熱量多？', text: '用相同條件（1 g、100 mL 水、不加防風罩），分別燒<b>花生</b>和<b>棉花糖</b>。', acts: [['燒花生', 'peanut', 'open'], ['燒棉花糖', 'mallow', 'open']], done: (rs) => ['peanut', 'mallow'].every((f) => rs.some((r) => r.food === f && r.water === 100)) && (() => { const a = rs.filter((r) => r.water === 100); return a.some((p) => p.food === 'peanut' && a.some((m) => m.food === 'mallow' && m.setup === p.setup)); })(),
      why: '花生含有很多<b>脂質</b>（每公克約 9 大卡），棉花糖主要是<b>醣類</b>（每公克約 4 大卡），所以相同質量的花生放出的熱量比較多。' },
  ];

  S.registerLab({
    id: 'lab-calorie', section: '2-1', title: '食物熱量實驗',
    mount(box) {
      box.innerHTML = `
<style>
  .labC { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
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
        <p class="footnote">＊示意：食物的熱量是一般營養標示的約略值；水吸收到的比例（沒有防風罩約 25%、有防風罩約 45%）是為了示範而設定的，真實結果會因裝置而不同。燃燒實驗要在老師指導下進行，注意用火安全。</p></div>
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
      const root = g(svg);
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
      text(root, 566, 236, '鋁罐中的水', { 'font-size': 22, fill: C.mute });
      const waterLbl = text(root, 566, 268, '', { 'font-size': 22, fill: C.ink2 });
      // 溫度計
      el('rect', { x: CXc + 22, y: 40, width: 14, height: 230, rx: 7, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, root);
      el('circle', { cx: CXc + 29, cy: 276, r: 12, fill: '#ff5f74' }, root);
      const col = el('rect', { x: CXc + 25, y: 200, width: 8, height: 76, fill: '#ff5f74' }, root);
      const tRead = text(root, CXc + 120, 70, '', { 'font-size': 40, 'font-weight': 700, fill: C.hi, class: 'mono' });
      const tSub = text(root, CXc + 120, 104, '水溫', { 'font-size': 20, fill: C.mute });
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
      text(loss, CXc - 190, 470, '熱散失到空氣中', { 'font-size': 22, fill: '#ff9a6c', 'text-anchor': 'middle' });
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
        tl.to(loss, { opacity: st.setup === 'shield' ? 0.35 : 1, duration: 0.4 }, '<');
        tl.to(o, { T: T0 + dT, s: 0.25, duration: 4, ease: 'power1.inOut', onUpdate: () => { setTemp(o.T); foodE.setAttribute('rx', 22 * o.s + 4); foodE.setAttribute('ry', 15 * o.s + 3); foodE.setAttribute('fill', o.s < 0.6 ? '#3a3a3a' : FOODS[st.food][2]); } });
        tl.to([flame, loss], { opacity: 0, duration: 0.4 });
        tl.call(() => {
          burning = false;
          runs.push(run);
          gsap.to(formula, { opacity: 1, duration: 0.3 });
          status(`${name} 燒完了：水溫從 ${T0.toFixed(1)} °C 升到 <b>${run.T1.toFixed(1)} °C</b>，上升 <b>${dT.toFixed(1)} °C</b>。`);
          sync(); table(); checkMission(run); drawMission();
        });
      }

      function table() {
        if (!runs.length) { $('table').innerHTML = '<p class="m-hint">燒完一次，結果會列在這裡。</p>'; return; }
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>食物</th><th>水</th><th>裝置</th><th>上升溫度</th><th>水吸收的熱量</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${FOODS[r.food][0]}</td><td>${r.water} mL</td><td>${r.setup === 'shield' ? '防風罩' : '開放'}</td><td>${r.dT.toFixed(1)} °C</td><td>${r.answered ? `<b>${((r.water * r.dT) / 1000).toFixed(2)} 大卡</b>` : '（自己算算看）'}</td></tr>`).join('')}</tbody></table>`;
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
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? 'ok' : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      const actsHtml = (m) => `<div class="acts">${m.acts.map(([label, food, setup], i) => {
        const did = runs.some((r) => r.food === food && r.setup === setup && r.water === 100);
        return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${did}" ${burning ? 'disabled' : ''}>${label}${did ? ' ✓' : ''}</button>`;
      }).join('')}</div>`;
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>實驗重點</strong>熱量 ＝ 水的質量 × 上升的溫度（1 g 水上升 1 °C ＝ 1 卡）。<br>測得的熱量比實際少，因為熱會散失；減少散失，結果更準確。<br>比較不同食物時，質量、水量、裝置都要相同。</div>
            <button class="ctl primary" type="button" id="labC-again">再練習一次</button>`;
          mbox.querySelector('#labC-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let h = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.quiz) {
          h += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) h += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) h += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else if (m.calc) {
          h += `<p class="m-text">${m.text}</p>`;
          if (calcRun && !done) {
            h += `<p class="m-hint">水 ${calcRun.water} g，上升 ${calcRun.dT.toFixed(1)} °C。水吸收了多少大卡？</p><div class="calc"><input id="labC-ans" type="number" inputmode="decimal" step="0.01" aria-label="熱量（大卡）"><span>大卡</span><button class="ctl primary small" type="button" id="labC-check">檢查</button></div>`;
            if (calcWrong) h += `<div class="fb bad"><strong>再算一次</strong>先算「卡」：${calcRun.water} × ${calcRun.dT.toFixed(1)} ＝ ? 卡，再除以 1000 變成大卡。${calcWrong >= 2 ? `（答案是 ${((calcRun.water * calcRun.dT) / 1000).toFixed(2)} 大卡）` : ''}</div>`;
          } else if (!done) h += actsHtml(m);
          if (done) h += `<div class="fb ok"><strong>算對了</strong>${calcRun.water} × ${calcRun.dT.toFixed(1)} ＝ ${(calcRun.water * calcRun.dT).toFixed(0)} 卡 ＝ ${((calcRun.water * calcRun.dT) / 1000).toFixed(2)} 大卡。${m.why}</div>`;
        } else {
          h += `<p class="m-text">${m.text}</p>`;
          if (done) h += `<div class="fb ok"><strong>完成</strong>${m.why}</div>`;
          else h += actsHtml(m);
        }
        if (done) h += `<button class="ctl primary" type="button" id="labC-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = h;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
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
        if (nx) nx.addEventListener('click', () => { mi++; done = false; picked = -1; calcRun = null; calcWrong = 0; drawMission(); checkMission(); });
      }
      function showFormula(r) {
        fLine.textContent = `${r.water} g × ${r.dT.toFixed(1)} °C ＝ ${(r.water * r.dT).toFixed(0)} 卡`;
        fLine2.textContent = `＝ ${((r.water * r.dT) / 1000).toFixed(2)} 大卡（包裝標示約 ${FOODS[r.food][1]} 大卡＊）`;
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
        mi = 0; done = false; picked = -1; calcRun = null; calcWrong = 0;
        gsap.set([flame, loss], { opacity: 0 }); gsap.set(formula, { opacity: 0 });
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
