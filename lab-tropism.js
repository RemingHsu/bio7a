/* 互動模型：植物的向性 — 光從右邊照（向光性）→ 花盆橫放在暗處（根向地、莖背地）→ 轉盤一直轉（各側輪流照光）→ 生活應用。點預測就開始，快轉幾天看結果 */
(() => {
  const { el, g, text, C } = S;
  const STEM = '#7fcf5a', ROOT = '#e8d8b0', LEAF = '#5fbf4a';
  const DAYS = 4, DAY_SEC = 0.7;             // 每次長 4 天＊；動畫約 0.7 秒代表 1 天＊（4 天約 2.8 秒）
  const SEG = 3, GS = 46, GR = 30;           // 每段 3 px；莖每天長 46 px、根 30 px（示意）
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
  const LIGHT = { right: ['右邊', [1, 0], [1010, 230]], left: ['左邊', [-1, 0], [190, 230]], top: ['上方', [0, -1], [600, 64]], none: ['沒有光（暗處）', null, null] };
  const POT = { up: '直立', side: '橫放' };

  const MISSIONS = [
    { title: '光從右邊照', setup: { light: 'right', pot: 'up', spin: false }, ask: 'stem',
      q: '燈放在幼苗的<b>右邊</b>，只有右邊有光。長幾天後，<b>莖</b>會怎麼長？', opts: ['往右彎（朝向光）', '往左彎（背向光）', '直直往上長'], ans: 0, arrows: [-35, -145, -90],
      why: '莖<b>朝光源彎曲</b>生長，稱為<b>向光性</b>。光從右邊照來時，莖背光的一側（左側）長得比較快，莖就彎向右邊；葉子能照到更多光。' },
    { title: '花盆橫放', setup: { light: 'none', pot: 'side', spin: false }, ask: 'root',
      q: '把花盆<b>橫放</b>，放在<b>暗處</b>（沒有光的影響）。長幾天後，<b>根</b>會往哪裡長？', opts: ['往下彎', '往上彎', '維持水平'], ans: 0, arrows: [90, -90, 180],
      why: '根<b>往下</b>彎曲生長，稱為<b>向地性</b>；莖則<b>往上</b>彎曲（背地性）。就算把植物放倒，根還是往下、莖還是往上長。' },
    { title: '轉盤一直轉', setup: { light: 'right', pot: 'up', spin: true }, ask: 'stem',
      q: '燈還是在右邊，但花盆放在<b>一直慢慢轉動</b>的轉盤上，莖的每一側輪流照到光。長幾天後，莖會怎麼長？', opts: ['往右彎', '往左彎', '直直往上長'], ans: 2, arrows: [-35, -145, -90],
      why: '轉盤一直轉，莖的每一側輪流照到光，兩側生長的速度差不多，所以莖<b>直直往上</b>長。可見莖會彎，是因為<b>光只從一側照過來</b>。' },
    { title: '生活中的向性', quiz: { q: '窗台上的盆栽，莖都往窗戶的方向彎。怎樣做能讓它長得比較直？', opts: ['每隔幾天把花盆轉個方向', '多澆一點水', '把花盆移到完全黑暗的地方'], ans: 0, hint: '莖會彎，是因為光一直從同一個方向照過來。哪一個做法能改變這一點？' },
      why: '常常轉動花盆，莖的各側輪流照到光，就不容易長歪。放在完全黑暗的地方，植物不能進行光合作用，還會長得又細又長、顏色變黃。' },
  ];

  S.registerLab({
    id: 'lab-tropism', section: '5-3', title: '植物的向性',
    mount(box) {
      box.innerHTML = `
<style>
  .labG { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labG .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labG .pad { padding: 1rem 1.25rem; }
  .labG .opt:disabled { cursor: default; }
  .labG .table-wrap { overflow-x: auto; }
  .labG .tbl { min-width: 20rem; }
  @media (max-width: 900px) {
    .labG { display: flex; flex-direction: column; align-items: stretch; }
    .labG .col { display: contents; }
    .labG .c-stage { order: 1; } .labG .c-mis { order: 2; } .labG .c-table { order: 3; } .labG .c-ctl { order: 4; }
  }
</style>
<div class="labG">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 600" role="img" aria-label="花盆裡的幼苗、燈和轉盤；可以看到莖和根怎麼生長"></svg></div>
      <div class="pad">
        <p class="status-line" id="labG-status" aria-live="polite"></p>
        <p class="footnote">＊示意：天數和彎曲的程度都是示意。實際上向光彎曲常在數小時到一兩天內就看得出來，快慢依植物種類而不同。花盆畫成透明的，方便看到根；虛線箭頭是你的預測。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>實驗紀錄</h3><div class="table-wrap" id="labG-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labG-mission"></div>
    <details class="card pad free c-ctl" id="labG-free"><summary>自由探索：自己安排條件</summary>
      <div class="field"><div class="field-head"><span>光從哪裡來</span></div>
        <div class="seg-ctl" role="group" aria-label="光的方向" id="labG-light">${Object.entries(LIGHT).map(([k, [n]]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>花盆</span></div>
        <div class="seg-ctl" role="group" aria-label="花盆" id="labG-pot">${Object.entries(POT).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>轉盤</span></div>
        <div class="seg-ctl" role="group" aria-label="轉盤" id="labG-spin"><button type="button" data-v="0">不轉</button><button type="button" data-v="1">一直轉</button></div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labG-go">種一棵新的，長 ${DAYS} 天＊</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labG-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: C.bg }, svg);
      const root = g(svg);
      const setup = { light: 'right', pot: 'up', spin: false };
      const runs = [];

      // ---------- 燈 ----------
      const lampG = g(root);
      const lampBody = g(lampG);
      el('circle', { cx: 0, cy: 0, r: 70, fill: C.hi, opacity: 0.12 }, lampBody);
      el('circle', { cx: 0, cy: 0, r: 30, fill: C.hi }, lampBody);
      const rays = g(lampBody);
      [-28, -10, 10, 28].forEach((da) => el('line', { x1: 44, y1: 0, x2: 110, y2: 0, transform: `rotate(${da})`, stroke: C.hi, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '10 8' }, rays));
      const dark = g(root);
      el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: '#000', opacity: 0.45 }, dark);
      text(dark, 1160, 60, '暗處（沒有光）', { 'font-size': 26, 'text-anchor': 'end', fill: C.mute });
      // ---------- 轉盤 ----------
      const table = g(root);
      el('ellipse', { cx: 600, cy: 566, rx: 170, ry: 24, fill: '#3a4a56', stroke: '#8aa1ae', 'stroke-width': 2 }, table);
      const tMark = el('circle', { cx: 600, cy: 566, r: 8, fill: C.hi }, table);
      text(table, 800, 590, '轉盤', { 'font-size': 20, fill: C.mute });
      // ---------- 花盆（可轉 90°） ----------
      const potG = g(root);
      el('path', { d: 'M -110,-6 L 110,-6 L 80,150 L -80,150 Z', fill: 'rgba(176,112,60,0.22)', stroke: '#c98a50', 'stroke-width': 4, 'stroke-linejoin': 'round' }, potG);
      el('path', { d: 'M -106,0 L 106,0 L 79,146 L -79,146 Z', fill: 'rgba(90,60,40,0.55)' }, potG);
      el('rect', { x: -120, y: -18, width: 240, height: 16, rx: 5, fill: '#c98a50' }, potG);
      const potMark = el('circle', { cx: 0, cy: 100, r: 7, fill: '#e8c08a', opacity: 0 }, potG);
      // ---------- 植物 ----------
      const rootP = el('path', { d: '', stroke: ROOT, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
      const stemP = el('path', { d: '', stroke: STEM, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
      const leaves = g(root);
      const leavesIn = g(leaves);
      [-1, 1].forEach((s) => el('ellipse', { cx: s * 28, cy: -10, rx: 30, ry: 12, fill: LEAF, stroke: '#3f8a3a', 'stroke-width': 1.5, transform: `rotate(${-s * 28} ${s * 28} -10)` }, leavesIn));
      const seed = el('ellipse', { cx: 0, cy: 0, rx: 14, ry: 9, fill: '#d9b070', stroke: '#f0d8a0', 'stroke-width': 2 }, root);
      const predA = g(root, { opacity: 0 });
      const predLine = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#ffffff', 'stroke-width': 3, 'stroke-dasharray': '8 7' }, predA);
      const predHead = el('path', { d: 'M 0,0 l -14,-8 l 0,16 Z', fill: '#ffffff' }, predA);
      const predTxt = text(predA, 0, 0, '你的預測', { 'font-size': 20, fill: '#ffffff', 'text-anchor': 'middle' });
      const dayLbl = text(root, 40, 60, '', { 'font-size': 30, fill: C.hi, 'font-weight': 700 });
      const resS = text(root, 0, 0, '', { 'font-size': 24, fill: STEM, 'font-weight': 700 });
      const resR = text(root, 0, 0, '', { 'font-size': 24, fill: ROOT, 'font-weight': 700 });

      // ---------- 模擬 ----------
      const sim = { t: 0, S: [], R: [], aS: -90, aR: 90, accS: 0, accR: 0, spin: 0, running: false, end: 0 };
      const origin = () => (setup.pot === 'up' ? { s: [600, 394], r: [600, 406], a0s: -90, a0r: 90, seed: [600, 400, 0] } : { s: [606, 400], r: [594, 400], a0s: 0, a0r: 180, seed: [600, 400, 90] });
      function plant() {
        const o = origin();
        sim.t = 0; sim.accS = 0; sim.accR = 0; sim.aS = o.a0s; sim.aR = o.a0r;
        sim.S = Array(14).fill(o.a0s); sim.R = Array(10).fill(o.a0r);
        sim.running = false;
        resS.textContent = ''; resR.textContent = '';
        draw();
      }
      const turn = (a, target, k) => { let d = target - a; while (d > 180) d -= 360; while (d < -180) d += 360; return a + d * Math.min(1, k); };
      function step(dt) { // dt：天
        sim.t += dt;
        sim.accS += GS * dt; sim.accR += GR * dt;
        // 莖：往上（背地）＋ 朝光；轉盤一直轉時，各方向的光互相抵消
        const L = LIGHT[setup.light][1];
        let vx = 0, vy = -1;
        if (L && !setup.spin) { vx += L[0] * 1.3; vy += L[1] * 1.3; }
        sim.aS = turn(sim.aS, deg(Math.atan2(vy, vx)), 1.1 * dt);
        sim.aR = turn(sim.aR, 90, 0.9 * dt);
        while (sim.accS >= SEG) { sim.S.push(sim.aS); sim.accS -= SEG; }
        while (sim.accR >= SEG) { sim.R.push(sim.aR); sim.accR -= SEG; }
      }
      const trace = ([x, y], arr) => { let d = `M ${x.toFixed(1)},${y.toFixed(1)}`; arr.forEach((a) => { x += SEG * Math.cos(rad(a)); y += SEG * Math.sin(rad(a)); d += ` L ${x.toFixed(1)},${y.toFixed(1)}`; }); return { d, x, y }; };
      function draw() {
        const o = origin();
        // 燈與暗處
        const Lp = LIGHT[setup.light][2];
        lampG.setAttribute('opacity', Lp ? 1 : 0);
        if (Lp) { const ang = deg(Math.atan2(380 - Lp[1], 600 - Lp[0])); lampBody.setAttribute('transform', `translate(${Lp[0]},${Lp[1]})`); rays.setAttribute('transform', `rotate(${ang.toFixed(1)})`); }
        dark.setAttribute('opacity', Lp ? 0 : 1);
        table.setAttribute('opacity', setup.spin ? 1 : 0);
        tMark.setAttribute('cx', (600 + 150 * Math.cos(sim.spin)).toFixed(1)); tMark.setAttribute('cy', (566 + 20 * Math.sin(sim.spin)).toFixed(1));
        tMark.setAttribute('opacity', Math.sin(sim.spin) > -0.2 ? 1 : 0.35);
        potG.setAttribute('transform', setup.pot === 'up' ? 'translate(600,400)' : 'translate(600,400) rotate(90)');
        potMark.setAttribute('opacity', setup.spin ? 1 : 0); potMark.setAttribute('cx', (60 * Math.cos(sim.spin)).toFixed(1));
        // 莖、根、葉
        const s = trace(o.s, sim.S), r = trace(o.r, sim.R);
        stemP.setAttribute('d', s.d); rootP.setAttribute('d', r.d);
        const k = setup.spin ? Math.max(0.15, Math.abs(Math.cos(sim.spin))) : 1;
        leaves.setAttribute('transform', `translate(${s.x.toFixed(1)},${s.y.toFixed(1)}) rotate(${(sim.aS + 90).toFixed(1)})`);
        leavesIn.setAttribute('transform', `scale(${k.toFixed(3)},1)`);
        seed.setAttribute('transform', `translate(${o.seed[0]},${o.seed[1]}) rotate(${o.seed[2]})`);
        dayLbl.textContent = sim.t > 0 ? `第 ${Math.min(DAYS, Math.ceil(sim.t - 1e-6))} 天＊` : '剛發芽';
        sim.tipS = [s.x, s.y]; sim.tipR = [r.x, r.y];
      }
      const descS = (a, pot) => (pot === 'side' ? (a < -60 ? '往上彎' : '幾乎沒有往上') : a > -75 ? '往右彎' : a < -105 ? '往左彎' : '直直往上');
      const descR = (a, pot) => (a > 60 && a < 120 ? (pot === 'side' ? '往下彎' : '往下長') : '沒有往下');
      function finishRun() {
        sim.running = false;
        const r = { ...setup, stem: descS(sim.aS, setup.pot), root: descR(sim.aR, setup.pot) };
        runs.push(r);
        draw();
        const [sx, sy] = sim.tipS, [rx, ry] = sim.tipR;
        // 莖的結果：避開燈、花盆、莖和根、莖頂的葉子（約 ±60），依序找第一個放得下的位置
        const sTxt = `莖：${r.stem}`, sw = S.textWidth(sTxt, S.effSize(resS, 24)), Lp = LIGHT[setup.light][2], o = origin();
        const hit = (a, b) => a[2] > b[0] && a[0] < b[2] && a[3] > b[1] && a[1] < b[3];
        const boxes = [setup.pot === 'up' ? [474, 376, 726, 556] : [444, 274, 624, 526], [sx - 62, sy - 62, sx + 62, sy + 42]];
        if (Lp) boxes.push([Lp[0] - 130, Lp[1] - 80, Lp[0] + 80, Lp[1] + 90]);
        const pts = [];
        [[o.s, sim.S], [o.r, sim.R]].forEach(([[x, y], arr]) => arr.forEach((a) => { x += SEG * Math.cos(rad(a)); y += SEG * Math.sin(rad(a)); pts.push([x, y]); }));
        const ok = (b) => b[0] >= 10 && b[2] <= 1190 && b[1] >= 80 && b[3] <= 590 && !boxes.some((q) => hit(b, q)) && !pts.some(([x, y]) => x > b[0] - 8 && x < b[2] + 8 && y > b[1] - 8 && y < b[3] + 8);
        const cands = [[sx + 66, sy - 10, 'start'], [sx - 66, sy - 10, 'end'], [sx + 66, sy + 40, 'start'], [sx - 66, sy + 40, 'end'], [sx, sy - 70, 'middle'], [sx, sy + 76, 'middle']];
        const fit = cands.find(([x, y, a]) => { const x0 = a === 'start' ? x : a === 'end' ? x - sw : x - sw / 2; return ok([x0, y - 24, x0 + sw, y + 6]); }) || cands[0];
        resS.textContent = sTxt; resS.setAttribute('x', fit[0]); resS.setAttribute('y', fit[1]); resS.setAttribute('text-anchor', fit[2]);
        resR.textContent = `根：${r.root}`; resR.setAttribute('x', setup.pot === 'up' ? rx + 120 : rx - 230); resR.setAttribute('y', setup.pot === 'up' ? ry - 20 : ry + 60);
        status(`第 ${DAYS} 天＊：${LIGHT[setup.light][0] === '沒有光（暗處）' ? '在暗處' : `光從${LIGHT[setup.light][0]}照`}、花盆${POT[setup.pot]}${setup.spin ? '、轉盤一直轉' : ''} → 莖<b>${r.stem}</b>，根<b>${r.root}</b>。`);
        log(); checkMission(); drawMission(); syncFree();
      }
      function startRun() {
        plant();
        sim.running = true; sim.end = DAYS;
        status(`開始長……（約 ${DAY_SEC} 秒代表 1 天＊）`);
        drawMission(); syncFree();
      }
      function advance(sec) { // 真實秒數
        if (setup.spin) sim.spin += sec * 2.2;
        if (sim.running) {
          let left = (sec / DAY_SEC);
          while (left > 0 && sim.running) { const d = Math.min(0.02, left, sim.end - sim.t); step(d); left -= d; if (sim.t >= sim.end - 1e-9) finishRun(); }
        }
        draw();
      }
      let raf = 0, last = 0;
      const loop = (ts) => { const dt = Math.min(0.1, last ? (ts - last) / 1000 : 0); last = ts; if (sim.running || setup.spin) advance(dt); raf = requestAnimationFrame(loop); };

      // 預測的虛線箭頭
      function showPred(m, k) {
        if (k < 0 || !m || !m.arrows) { predA.setAttribute('opacity', 0); return; }
        const [x, y] = m.ask === 'root' ? sim.tipR : sim.tipS, a = rad(m.arrows[k]), L = 110;
        const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L;
        predLine.setAttribute('x1', x); predLine.setAttribute('y1', y); predLine.setAttribute('x2', x2); predLine.setAttribute('y2', y2);
        predHead.setAttribute('transform', `translate(${(x2 + Math.cos(a) * 6).toFixed(1)},${(y2 + Math.sin(a) * 6).toFixed(1)}) rotate(${m.arrows[k]})`);
        predTxt.setAttribute('x', x2 + Math.cos(a) * 40); predTxt.setAttribute('y', y2 + Math.sin(a) * 30 + 6);
        predA.setAttribute('opacity', 0.75);
      }

      const status = (h) => { $('status').innerHTML = h; };
      function log() {
        if (!runs.length) { $('log').innerHTML = '<p class="m-hint">每做完一次，結果會列在這裡。</p>'; return; }
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>光</th><th>花盆</th><th>轉盤</th><th>莖</th><th>根</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${LIGHT[r.light][0]}</td><td>${POT[r.pot]}</td><td>${r.spin ? '一直轉' : '不轉'}</td><td>${r.stem}</td><td>${r.root}</td></tr>`).join('')}</tbody></table>`;
      }

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, pred = -1, picked = -1;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-tropism'); // 存檔的進度（要在第一次畫圓點前讀）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 切換任務：正在長的幼苗先停止（不列入紀錄）
      function goMission(k) {
        if (done) doneK.add(mi);
        if (sim.running) plant();
        mi = k; enterMission();
      }
      S.onDots(mbox, goMission);
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>向性的重點</strong>莖：朝光源彎曲（向光性）、往上長（背地性）。<br>根：往下長（向地性），也會朝水多的地方長（向水性）。<br>向性是植物受到單一方向的刺激，朝向或背向刺激的方向生長，反應比較慢。</div>
            <button class="ctl primary" type="button" id="labG-again">再練習一次</button>`;
          mbox.querySelector('#labG-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.quiz) {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.q}</p><p class="m-hint">點選你的預測，就會開始實驗。</p><div class="opts">${m.opts.map((o, k) => {
            const cls = done ? (k === m.ans ? 'right' : k === pred ? 'wrong' : '') : '';
            return `<button class="opt ${cls}" type="button" data-p="${k}" aria-pressed="${k === pred}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`;
          }).join('')}</div>`;
          if (pred >= 0 && !done) html += '<p class="m-hint">幼苗長大中，看看舞台上的變化……</p>';
          if (done) html += `<div class="fb ${pred === m.ans ? 'ok' : 'bad'}"><strong>${pred === m.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labG-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p;
          Object.assign(setup, m.setup); plant(); showPred(m, pred); startRun();
        }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        const nx = mbox.querySelector('#labG-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done || m.quiz || pred < 0) return;
        const r = runs[runs.length - 1];
        if (r && r.light === m.setup.light && r.pot === m.setup.pot && r.spin === m.setup.spin) done = true;
      }
      function enterMission() {
        done = false; pred = -1; picked = -1;
        showPred(null, -1);
        const m = MISSIONS[mi];
        if (m && m.setup) { Object.assign(setup, m.setup); plant(); status('先預測，再看幼苗長幾天後的樣子。'); }
        else if (m) status('想一想剛才三個實驗的結果。');
        drawMission(); syncFree();
      }

      // ---------- 自由探索 ----------
      function syncFree() {
        box.querySelectorAll('#labG-light button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === setup.light); b.disabled = sim.running; });
        box.querySelectorAll('#labG-pot button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === setup.pot); b.disabled = sim.running; });
        box.querySelectorAll('#labG-spin button').forEach((b) => { b.setAttribute('aria-pressed', +b.dataset.v === +setup.spin); b.disabled = sim.running; });
        $('go').disabled = sim.running;
      }
      const freeSet = (k, v) => { if (sim.running) return; setup[k] = v; showPred(null, -1); plant(); syncFree(); };
      box.querySelectorAll('#labG-light button').forEach((b) => b.addEventListener('click', () => freeSet('light', b.dataset.v)));
      box.querySelectorAll('#labG-pot button').forEach((b) => b.addEventListener('click', () => freeSet('pot', b.dataset.v)));
      box.querySelectorAll('#labG-spin button').forEach((b) => b.addEventListener('click', () => freeSet('spin', b.dataset.v === '1')));
      $('go').addEventListener('click', () => { showPred(null, -1); startRun(); });

      function reset() {
        runs.length = 0; mi = 0; doneK.clear();
        $('free').open = false;
        log(); enterMission();
      }
      reset();
      // 接上存檔的進度：圓點照舊，從第一個還沒做的任務開始（都做完就顯示完成畫面）
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < MISSIONS.length).forEach((k) => doneK.add(k));
        if (doneK.size) { const k0 = MISSIONS.findIndex((_, k) => !doneK.has(k)); goMission(k0 < 0 ? MISSIONS.length : k0); }
      }
      raf = requestAnimationFrame(loop);
      S._labG = { setup, runs, sim, advance, get mission() { return mi; } }; // 測試用：advance(秒)
      return { unmount() { cancelAnimationFrame(raf); delete S._labG; } };
    },
  });
})();
