/* 互動模型：天擇模擬（樺尺蛾）— 樹幹顏色改變 → 鳥抓走顯眼的蛾 → 經過好幾代，族群中深色／淺色蛾的比例改變 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const N = 40; // 畫出來的蛾數
  const LIGHT = '#e8e3d4', DARKB = '#5a554e';
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), Bc = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * t)).join(',')})`; };
  const pct = (f) => `${Math.round(f * 100)}%`;

  const MISSIONS = [
    { title: '樹幹被燻黑了', setup: { f: 0.05, bark: 0 }, text: '工業革命時，工廠的煤煙把樹幹燻黑了。按下按鈕，看看樹幹的變化：', env: ['樹幹被煤煙燻黑', 1],
      predict: { q: '經過 10 代以後，哪一種顏色的蛾會變多？', opts: ['淺色的蛾', '深色的蛾', '差不多，不會改變'], ans: 1 },
      why: '樹幹變黑後，淺色的蛾很<b>顯眼</b>，容易被鳥吃掉；深色的蛾不容易被發現，比較容易<b>存活、繁殖</b>。一代代下來，深色的蛾就變多了。' },
    { title: '空氣變乾淨了', setup: 'after0', text: '後來改善了空氣汙染，樹幹又恢復成淺色。按下按鈕：', env: ['空氣變乾淨', 0],
      predict: { q: '再經過 10 代，會怎樣？', opts: ['深色的蛾仍然越來越多', '淺色的蛾又變多', '所有的蛾都變成深色'], ans: 1 },
      why: '樹幹變淺色後，換成<b>深色的蛾比較顯眼</b>，容易被吃掉，淺色的蛾又變多了。哪一種特徵比較有利，要看<b>環境</b>。' },
    { title: '深色的蛾從哪裡來？', quiz: { q: '在樹幹還沒有被燻黑的第 0 代，族群中就已經有少數深色的蛾。樹幹變黑後深色的蛾變多，原因是？', opts: ['煤煙把淺色的蛾染成深色', '蛾為了躲避鳥，讓自己變成深色', '族群中本來就有深色的蛾，樹幹變黑後牠們比較容易存活、繁殖'], ans: 2, hint: '看看長條圖的第 0 代：樹幹還是淺色時，族群裡有哪些顏色的蛾？' },
      why: '深色的特徵是<b>本來就有的變異</b>（可以遺傳），不是環境讓蛾「變」出來的。環境只是讓某一種顏色的蛾比較容易存活、留下後代——這就是<b>天擇</b>。' },
  ];

  S.registerLab({
    id: 'lab-selection', section: '下3-2', title: '天擇模擬',
    mount(box) {
      box.innerHTML = `
<style>
  .labX1 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labX1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labX1 .pad { padding: 1rem 1.25rem; }
  .labX1 .table-wrap { overflow-x: auto; }
  .labX1 .tbl { min-width: 22rem; }
  .labX1 .ctl:disabled { opacity: 0.45; cursor: not-allowed; }
  .labX1 .sw { display: inline-block; width: 0.9em; height: 0.9em; border-radius: 3px; vertical-align: -0.1em; margin-right: 0.3em; box-shadow: 0 0 0 1px rgba(128,128,128,.6); }
  @media (max-width: 900px) {
    .labX1 { display: flex; flex-direction: column; align-items: stretch; }
    .labX1 .col { display: contents; }
    .labX1 .c-stage { order: 1; } .labX1 .c-mis { order: 2; } .labX1 .c-table { order: 3; } .labX1 .c-ctl { order: 4; }
  }
</style>
<div class="labX1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="停在樹幹上的淺色和深色樺尺蛾，以及族群中深色蛾比例的長條圖"></svg></div>
      <div class="pad">
        <p class="status-line" id="labX1-status" aria-live="polite"></p>
        <p class="footnote">＊示意：每一代只畫出 40 隻蛾、只畫出鳥抓走其中幾隻；比例依「和樹幹顏色差越多、越容易被鳥發現」計算，並加入小小的隨機變化。真實的變化約經過數十代（在英國約 50 年＊）。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>實驗紀錄</h3><div class="table-wrap" id="labX1-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labX1-mission"></div>
    <details class="card pad free c-ctl" id="labX1-free"><summary>自由探索：自己改變環境</summary>
      <div class="field"><div class="field-head"><label for="labX1-bark">樹幹的顏色</label><output id="labX1-bark-o"></output></div>
        <input type="range" id="labX1-bark" min="0" max="100" step="5" value="0"><div class="ticks"><span>淺色（乾淨）</span><span>深色（煤煙）</span></div></div>
      <div class="field"><div class="field-head"><label for="labX1-k">鳥捕食的程度</label><output id="labX1-k-o"></output></div>
        <input type="range" id="labX1-k" min="0" max="80" step="5" value="45"></div>
      <div class="field"><div class="field-head"><label for="labX1-f0">重新開始時，深色蛾的比例</label><output id="labX1-f0-o"></output></div>
        <input type="range" id="labX1-f0" min="0" max="100" step="5" value="5"></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labX1-g1">經過 1 代</button><button class="ctl" type="button" id="labX1-g10">經過 10 代</button><button class="ctl" type="button" id="labX1-reset">重新開始（第 0 代）</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labX1-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { bark: 0, barkTo: 0, k: 0.45, f0: 0.05, f: 0.05, gen: 0, hist: [0.05] };
      const runs = [];
      let rnd = S.rng(11);

      // ---------- 樹幹（近看的樹皮）----------
      const TX = 40, TY = 20, TW = 700, TH = 580;
      el('rect', { x: TX, y: TY, width: TW, height: TH, rx: 18 }, el('clipPath', { id: 'labX1clip' }, el('defs', {}, root)));
      const barkG = g(root, { 'clip-path': 'url(#labX1clip)' });
      const barkBg = el('rect', { x: TX, y: TY, width: TW, height: TH, fill: '#bdb6a4' }, barkG);
      const rb = S.rng(5);
      const grooves = [];
      for (let i = 0; i < 26; i++) {
        const xx = TX + 10 + i * 27 + rb() * 8;
        let d = `M ${xx},${TY}`;
        for (let yy = TY + 40; yy <= TY + TH + 40; yy += 40) d += ` L ${(xx + (rb() - 0.5) * 12).toFixed(1)},${yy}`;
        grooves.push(el('path', { d, fill: 'none', stroke: '#948b77', 'stroke-width': 3 + rb() * 2, opacity: 0.8 }, barkG));
      }
      const lichen = g(barkG);
      for (let i = 0; i < 26; i++) {
        const cx = TX + 20 + rb() * (TW - 40), cy = TY + 20 + rb() * (TH - 40);
        for (let k = 0; k < 3; k++) el('ellipse', { cx: cx + (rb() - 0.5) * 30, cy: cy + (rb() - 0.5) * 22, rx: 12 + rb() * 16, ry: 9 + rb() * 10, fill: '#cfd6bf', opacity: 0.75 }, lichen);
      }
      const soot = g(barkG, { opacity: 0 });
      for (let i = 0; i < 160; i++) el('circle', { cx: TX + rb() * TW, cy: TY + rb() * TH, r: 1 + rb() * 3, fill: '#0e0c0b', opacity: 0.6 }, soot);
      el('rect', { x: TX, y: TY, width: TW, height: TH, rx: 18, fill: 'none', stroke: '#4a5a66', 'stroke-width': 3 }, root);
      function paintBark() {
        const b = st.bark;
        barkBg.setAttribute('fill', mix('#bdb6a4', '#2a2623', b));
        grooves.forEach((gv) => gv.setAttribute('stroke', mix('#948b77', '#141210', b)));
        lichen.setAttribute('opacity', (1 - b).toFixed(3));
        soot.setAttribute('opacity', b.toFixed(3));
      }

      // ---------- 蛾（每個位置都準備淺色和深色兩種）----------
      const slots = [];
      const cols = 7, rows = 6;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (slots.length >= N) break;
        const x = TX + 60 + c * ((TW - 120) / (cols - 1)) + (rb() - 0.5) * 26, y = TY + 50 + r * ((TH - 100) / (rows - 1)) + (rb() - 0.5) * 22;
        const sg = S.place(g(root), { x, y, r: (rb() - 0.5) * 70, s: 0.9 + rb() * 0.15 });
        const lt = g(sg), dk = g(sg);
        S.B3.moth(lt, false); S.B3.moth(dk, true);
        slots.push({ x, y, sg, lt, dk, dark: false, alive: true });
      }
      while (slots.length < N) slots.push(slots[slots.length - 1]);
      function layout(f, seed) {
        const r = S.rng(seed);
        let nd = Math.round(f * N);
        if (f > 0.004 && nd === 0) nd = 1;
        if (f < 0.996 && nd === N) nd = N - 1;
        const idx = slots.map((_, i) => i).sort(() => r() - 0.5);
        slots.forEach((s) => { s.dark = false; s.alive = true; });
        idx.slice(0, nd).forEach((i) => { slots[i].dark = true; });
        paintMoths(1);
        return nd;
      }
      function paintMoths(op) {
        slots.forEach((s) => {
          s.lt.style.display = s.dark ? 'none' : '';
          s.dk.style.display = s.dark ? '' : 'none';
          s.sg.style.opacity = s.alive ? op : 0;
        });
      }

      // ---------- 鳥 ----------
      const birdG = g(root);
      const bird = S.B3.tit(birdG);
      birdG.style.display = 'none';
      const setBird = (x, y, face) => birdG.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${face * 1.15},1.15)`);

      // ---------- 長條圖：每一代族群中深色蛾的比例 ----------
      const CX0 = 800, CX1 = 1160, CY0 = 200, CY1 = 480;
      text(root, CX0, 130, '族群中深色蛾的比例＊', { 'font-size': 24, 'font-weight': 700, fill: C.ink });
      const legend = g(root);
      el('rect', { x: CX0, y: 150, width: 18, height: 18, rx: 3, fill: DARKB, stroke: '#a8a294', 'stroke-width': 1.5 }, legend);
      text(legend, CX0 + 26, 166, '深色', { 'font-size': 20, fill: C.ink2 });
      el('rect', { x: CX0 + 90, y: 150, width: 18, height: 18, rx: 3, fill: LIGHT }, legend);
      text(legend, CX0 + 116, 166, '淺色', { 'font-size': 20, fill: C.ink2 });
      [0, 0.5, 1].forEach((v) => {
        const y = CY1 - v * (CY1 - CY0);
        el('line', { x1: CX0 + 44, y1: y, x2: CX1, y2: y, stroke: C.faint, 'stroke-width': 1 }, root);
        text(root, CX0 + 38, y + 7, `${v * 100}%`, { 'font-size': 20, 'text-anchor': 'end', fill: C.mute, class: 'mono' });
      });
      const barsG = g(root);
      const genLbl = text(root, CX1, CY1 + 60, '', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const readout = text(root, (CX0 + CX1) / 2, 580, '', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      function drawChart() {
        barsG.innerHTML = '';
        const MAXB = 21, h = st.hist, start = Math.max(0, h.length - MAXB);
        const bw = (CX1 - CX0 - 44) / MAXB;
        h.slice(start).forEach((f, i) => {
          const x = CX0 + 44 + i * bw, H = CY1 - CY0, dh = Math.max(0, f * H - 1), lh = Math.max(0, (1 - f) * H - 1);
          const gen = start + i;
          if (lh > 0) el('rect', { x, y: CY0, width: bw - 2, height: lh, rx: 2, fill: LIGHT }, barsG);
          if (dh > 0) el('rect', { x, y: CY1 - dh, width: bw - 2, height: dh, rx: 2, fill: DARKB, stroke: '#a8a294', 'stroke-width': 1 }, barsG);
          if (gen % 5 === 0) text(barsG, x + bw / 2 - 1, CY1 + 24, String(gen), { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute, class: 'mono' });
        });
        genLbl.textContent = '代數';
        const nd = slots.filter((s) => s.dark).length;
        readout.textContent = `第 ${st.gen} 代：深色 ${nd} 隻、淺色 ${N - nd} 隻`;
      }

      // ---------- 模型 ----------
      const vis = (dark) => Math.abs((dark ? 0.92 : 0.08) - st.bark);
      function nextF(f) {
        const sl = 1 - st.k * vis(false), sd = 1 - st.k * vis(true);
        let n = (f * sd) / (f * sd + (1 - f) * sl);
        n += (rnd() - 0.5) * 0.03;
        return S.clamp(n, 0.01, 0.99);
      }

      // ---------- 動畫（自己的時鐘：分頁隱藏時可用 advance 推進）----------
      let queue = 0, total = 0, anim = null, barkAnim = null, onDone = null;
      function startGen() {
        // 只經過 1 代：1.5 秒。經過 10 代：第 1 代 0.8 秒（看得到鳥抓蛾），之後每代約 0.22 秒快轉（不畫鳥），10 代約 3 秒
        const T = total <= 1 ? 1.5 : queue === total ? 0.8 : 0.22;
        // 依「顯眼程度」挑出鳥要抓的蛾
        const cand = slots.filter((s) => s.alive);
        const pick = [];
        for (let k = 0; k < 2; k++) {
          const w = cand.map((s) => (pick.includes(s) ? 0 : Math.pow(vis(s.dark), 2) + 0.02));
          let tot = w.reduce((a, b) => a + b, 0), r = rnd() * tot, i = 0;
          while (i < w.length - 1 && r > w[i]) { r -= w[i]; i++; }
          pick.push(cand[i]);
        }
        // 鳥嘴在鳥中心前方約 (53, -14)：依飛行方向算出抓到蛾時鳥的位置
        const pts = [[-60, 120]];
        pick.forEach((m) => { const px = pts[pts.length - 1][0], dir = m.x >= px ? 1 : -1; pts.push([m.x - dir * 53, m.y + 14]); });
        pts.push([820, -80]);
        anim = { t: 0, T, pts, pick, caught: 0, bred: false };
        birdG.style.display = T < 0.5 ? 'none' : '';
      }
      function finishGen() {
        st.f = nextF(st.f);
        st.gen++;
        st.hist.push(st.f);
        layout(st.f, 100 + st.gen * 7 + Math.round(st.f * 1000));
        drawChart();
        status();
      }
      function step(dt) {
        if (barkAnim) {
          barkAnim.t += dt;
          const u = S.clamp(barkAnim.t / barkAnim.T);
          st.bark = S.lerp(barkAnim.a, barkAnim.b, u * u * (3 - 2 * u));
          paintBark();
          if (u >= 1) { const cb = barkAnim.cb; barkAnim = null; if (cb) cb(); }
        }
        if (!anim) return;
        const a = anim;
        a.t += dt;
        const hunt = 0.68 * a.T, u = S.clamp(a.t / hunt);
        // 鳥沿著折線飛：入場 → 第 1 隻 → 第 2 隻 → 離開
        const seg = u * 3, si = Math.min(2, Math.floor(seg)), f = seg - si;
        const [x0, y0] = a.pts[si], [x1, y1] = a.pts[si + 1];
        const e = f * f * (3 - 2 * f);
        setBird(S.lerp(x0, x1, e), S.lerp(y0, y1, e) - Math.sin(f * Math.PI) * 30, x1 >= x0 ? 1 : -1);
        bird.setFlap(Math.sin(a.t * 26));
        if (seg >= 1 && a.caught < 1) { a.pick[0].alive = false; a.caught = 1; paintMoths(1); }
        if (seg >= 2 && a.caught < 2) { a.pick[1].alive = false; a.caught = 2; paintMoths(1); }
        if (u >= 1) birdG.style.display = 'none';
        if (u >= 1 && !a.bred) { a.bred = true; finishGen(); }
        if (a.bred) paintMoths(0.25 + 0.75 * S.clamp((a.t - hunt) / (0.32 * a.T)));
        if (a.t >= a.T) {
          anim = null; queue--;
          paintMoths(1);
          if (queue > 0) startGen();
          else { const cb = onDone; onDone = null; sync(); if (cb) cb(); }
        }
      }
      let raf = 0, lastTs = 0;
      const loop = (ts) => { const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0); lastTs = ts; step(dt); raf = requestAnimationFrame(loop); };
      const busy = () => !!anim || !!barkAnim;
      function runGens(n, cb) { if (busy()) return; queue = n; total = n; onDone = cb || null; startGen(); sync(); drawMission(); }
      function setBarkTo(b, cb) { if (busy()) return; barkAnim = { t: 0, T: 1.3, a: st.bark, b, cb }; sync(); drawMission(); }

      // ---------- 狀態、紀錄 ----------
      const barkName = (b) => (b >= 0.67 ? '深色' : b <= 0.33 ? '淺色' : '中間');
      function status() {
        const nd = slots.filter((s) => s.dark).length;
        $('status').innerHTML = `第 ${st.gen} 代（樹幹：${barkName(st.bark)}）：深色的蛾 <b>${nd}</b> 隻、淺色的蛾 <b>${N - nd}</b> 隻。`;
      }
      function log() {
        if (!runs.length) { $('log').innerHTML = '<p class="m-hint">每次「經過幾代」後，結果會列在這裡。</p>'; return; }
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>樹幹</th><th>經過</th><th>深色蛾的比例</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.bark}</td><td>第 ${r.g0} → ${r.g1} 代</td><td><span class="sw" style="background:${DARKB}"></span>${pct(r.f0)} → <b>${pct(r.f1)}</b></td></tr>`).join('')}</tbody></table>`;
      }
      function record(g0, f0) { runs.push({ bark: barkName(st.bark), g0, g1: st.gen, f0, f1: st.f }); log(); }
      function resetPop(f0) {
        rnd = S.rng(11);
        st.f = f0; st.gen = 0; st.hist = [f0];
        layout(f0, 1);
        drawChart(); status();
      }

      // ---------- 自由探索 ----------
      function sync() {
        const b = busy();
        $('bark').value = Math.round(st.barkTo * 100);
        $('bark-o').textContent = barkName(st.barkTo);
        $('k').value = Math.round(st.k * 100);
        $('k-o').textContent = st.k < 0.2 ? '很少' : st.k < 0.5 ? '中等' : '很多';
        $('f0').value = Math.round(st.f0 * 100);
        $('f0-o').textContent = pct(st.f0);
        ['g1', 'g10', 'reset'].forEach((k) => { $(k).disabled = b; });
      }
      $('bark').addEventListener('input', () => { st.barkTo = +$('bark').value / 100; if (!busy()) { st.bark = st.barkTo; paintBark(); status(); } sync(); });
      $('k').addEventListener('input', () => { st.k = +$('k').value / 100; sync(); });
      $('f0').addEventListener('input', () => { st.f0 = +$('f0').value / 100; sync(); });
      const freeRun = (n) => { const g0 = st.gen, f0 = st.f; st.bark = st.barkTo; paintBark(); runGens(n, () => record(g0, f0)); };
      $('g1').addEventListener('click', () => freeRun(1));
      $('g10').addEventListener('click', () => freeRun(10));
      $('reset').addEventListener('click', () => { if (!busy()) { resetPop(st.f0); sync(); } });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, phase = 'env', pred = -1, picked = -1, done = false, after0 = null;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 沒做任務 1 就跳到任務 2：用同一個模型算出「樹幹變黑後經過 10 代」的族群
      function simAfter0() {
        const keep = [st.bark, st.k, rnd];
        st.bark = 1; st.k = 0.45; rnd = S.rng(11);
        let f = 0.05;
        const hist = [f];
        for (let i = 0; i < 10; i++) { f = nextF(f); hist.push(f); }
        [st.bark, st.k, rnd] = keep;
        return { f, bark: 1, gen: 10, hist };
      }
      function setup(m) {
        if (!m.setup) return;
        const s = m.setup === 'after0' ? (after0 || simAfter0()) : { ...m.setup, gen: 0, hist: null };
        st.k = 0.45;
        st.bark = st.barkTo = s.bark; paintBark();
        if (s.hist) { st.f = s.f; st.gen = s.gen; st.hist = s.hist.slice(); layout(st.f, 100 + st.gen * 7 + Math.round(st.f * 1000)); drawChart(); status(); }
        else resetPop(s.f);
        sync();
      }
      // 停止進行中的動畫（不列入紀錄）：樹幹回到原來的顏色，被抓走的蛾先放回來
      function stopAll() {
        if (barkAnim) { st.bark = barkAnim.a; paintBark(); }
        if (anim) { slots.forEach((s) => { s.alive = true; }); paintMoths(1); }
        anim = null; barkAnim = null; queue = 0; onDone = null; birdG.style.display = 'none';
        status(); sync();
      }
      function goMission(k) {
        if (done || phase === 'done') doneK.add(mi);
        stopAll();
        mi = k; phase = 'env'; pred = -1; picked = -1; done = false; if (MISSIONS[mi]) setup(MISSIONS[mi]); drawMission();
      }
      S.onDots(mbox, goMission);
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>天擇的重點</strong>族群中的個體本來就有差異（變異）。<br>環境（這裡是樹幹顏色和鳥）讓比較適應的個體容易存活、繁殖。<br>經過許多代，有利的特徵在族群中變多；環境改變時，有利的特徵也會跟著改變。</div>
            <button class="ctl primary" type="button" id="labX1-again">再練習一次</button>`;
          mbox.querySelector('#labX1-again').addEventListener('click', reset);
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
          html += `<p class="m-text">${m.text}</p>`;
          if (phase === 'env') html += `<div class="acts"><button class="ctl primary" type="button" data-env="1" ${busy() ? 'disabled' : ''}>${m.env[0]}</button></div>`;
          else {
            html += `<div class="acts"><button class="ctl" type="button" disabled aria-pressed="true">${m.env[0]} ✓</button></div>`;
            if (phase !== 'env' && !barkAnim) {
              html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
            }
            if (phase === 'ready' || phase === 'running') html += `<div class="acts"><button class="ctl primary" type="button" data-run="1" ${phase === 'running' ? 'disabled' : ''}>${phase === 'running' ? '進行中……' : '經過 10 代'}</button></div>`;
            if (phase === 'done') html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
          }
        }
        if (done || phase === 'done') html += `<button class="ctl primary" type="button" id="labX1-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        const envB = mbox.querySelector('[data-env]');
        if (envB) envB.addEventListener('click', () => { setBarkTo(m.env[1], () => { st.barkTo = st.bark; phase = 'predict'; status(); sync(); drawMission(); }); phase = 'changing'; drawMission(); });
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; phase = 'ready'; drawMission(); }));
        const runB = mbox.querySelector('[data-run]');
        if (runB) runB.addEventListener('click', () => {
          const g0 = st.gen, f0 = st.f;
          phase = 'running';
          runGens(10, () => { record(g0, f0); if (mi === 0) after0 = { f: st.f, bark: st.bark, gen: st.gen, hist: st.hist.slice() }; phase = 'done'; drawMission(); });
        });
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        const nx = mbox.querySelector('#labX1-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function reset() {
        anim = null; barkAnim = null; queue = 0; onDone = null; birdG.style.display = 'none';
        runs.length = 0; after0 = null; doneK.clear();
        mi = 0; phase = 'env'; pred = -1; picked = -1; done = false;
        st.f0 = 0.05;
        setup(MISSIONS[0]);
        $('free').open = false;
        log(); drawMission();
        $('status').innerHTML = '按任務卡上的按鈕開始。每一代，鳥會抓走比較顯眼的蛾，存活的蛾繁殖出下一代。';
      }

      paintBark();
      reset();
      raf = requestAnimationFrame(loop);
      S._labX1 = { st, runs, get mission() { return { mi, phase }; }, advance(sec) { for (let i = 0; i < sec * 30; i++) step(1 / 30); } }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); delete S._labX1; } };
    },
  });
})();
