/* 互動模型：蒸散作用實驗 — 兩支枝條插在量筒中（水面加油層），同時放 1 小時，比較水減少多少：有葉／去葉、照光／黑暗、無風／有風、不套袋／套袋 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const XY = C.water, OIL = '#f1c84a', LEAF = '#4fae4a', LEAF_D = '#2f7a3a';
  const SEC_PER_HOUR = 6; // 動畫 6 秒代表 1 小時＊
  const V0 = 9.0;          // 開始的水量（mL）
  const BASE = 2.4;        // 有葉、照光、無風、不套袋：每小時約減少 2.4 mL（示意）
  const DEF = { leaf: 1, light: 1, wind: 0, bag: 0, oil: 1 };
  // 每小時減少的水量（mL，示意）
  const rateOf = (c) => {
    let r = c.leaf ? BASE * (c.light ? 1 : 0.2) * (c.wind ? 1.5 : 1) * (c.bag ? 0.3 : 1) : 0.1;
    if (!c.oil) r += 0.3 * (c.wind ? 1.5 : 1);
    return r;
  };
  const leafRate = (c) => (c.leaf ? BASE * (c.light ? 1 : 0.2) * (c.wind ? 1.5 : 1) * (c.bag ? 0.3 : 1) : 0);
  const desc = (c) => [c.leaf ? '有葉' : '去葉', c.light ? '照光' : '黑暗', c.wind ? '有風' : '無風', c.bag ? '套袋' : '不套袋'].concat(c.oil ? [] : ['沒有油層']).join('・');
  const fmt = (v) => v.toFixed(1);
  const KEYS = [['leaf', '葉片', [[1, '有葉'], [0, '去葉']]], ['light', '光線', [[1, '照光'], [0, '黑暗']]], ['wind', '風', [[0, '無風'], [1, '有風']]], ['bag', '塑膠袋', [[0, '不套'], [1, '套袋']]], ['oil', '油層', [[1, '有'], [0, '沒有']]]];

  const MISSIONS = [
    { title: '葉的作用', A: { leaf: 1 }, B: { leaf: 0 },
      q: '兩支一樣的枝條：A 保留葉片，B 把葉全部摘掉。放 1 小時後，哪一組量筒的水減少比較多？先預測：', opts: ['A 有葉', 'B 去葉', '差不多'], ans: 0,
      why: '水主要從<b>葉</b>的氣孔散失（蒸散作用），所以有葉的枝條吸水、失水都多；去掉葉片後，水幾乎沒有減少。' },
    { title: '照光與黑暗', A: { light: 1 }, B: { light: 0 },
      q: '兩組都有葉：A 照光，B 放在暗處。哪一組的水減少比較多？先預測：', opts: ['A 照光', 'B 黑暗', '差不多'], ans: 0,
      why: '照光時氣孔張開，蒸散作用旺盛；在黑暗中氣孔大多關閉，水減少得少。' },
    { title: '有風與無風', A: { wind: 0 }, B: { wind: 1 },
      q: 'A 無風，B 用電扇吹。哪一組的水減少比較多？先預測：', opts: ['A 無風', 'B 有風', '差不多'], ans: 1,
      why: '風把葉片附近的水蒸氣吹走，葉片的水分散失得比較快，蒸散作用比較旺盛。' },
    { title: '套上塑膠袋', A: { bag: 0 }, B: { bag: 1 },
      q: 'B 的枝葉套上透明塑膠袋，袋子裡的濕度會越來越高。哪一組的水減少比較<b>少</b>？先預測：', opts: ['A 不套袋', 'B 套袋', '差不多'], ans: 1,
      why: '袋子裡的水蒸氣越來越多（濕度高），蒸散作用變慢，水減少得比較少。袋子內側出現的小水珠，是葉散失的水蒸氣凝結成的。' },
    { title: '為什麼要加油？', quiz: { q: '每個量筒的水面上都加了一層油，目的是什麼？', opts: ['防止水面的水直接蒸發，量到的減少量才是枝條散失的水', '提供枝條養分', '讓枝條站得比較穩'], ans: 0, hint: '想想看：如果水面沒有東西蓋住，水會不會自己從水面跑掉？那量到的結果還準嗎？' },
      why: '油層能防止水從水面直接蒸發（也可以用保鮮膜把量筒口封住）。這樣量筒裡減少的水，才是被枝條吸收、再經由蒸散作用散失的。可以打開「自由探索」，把油層拿掉試試看。' },
    { title: '公平的比較', quiz: { q: '在「照光 vs 黑暗」的實驗中，下列哪一項必須保持相同？', opts: ['光線', '枝條的種類和葉片多少、水量、溫度', '水減少的量'], ans: 1, hint: '哪一項是我們故意改變的？哪一項是我們要測量的結果？剩下的條件應該怎樣？' },
      why: '只改變光線（操縱變因），測量水減少的量（應變變因）；枝條的種類、葉片多少、水量、溫度等都要相同（控制變因），比較才公平。' },
  ];

  S.registerLab({
    id: 'lab-transpiration', section: '4-2', title: '蒸散作用實驗',
    mount(box) {
      const seg = (side, k, label, opts) => `<div class="field"><div class="field-head"><span>${label}</span></div><div class="seg-ctl" role="group" aria-label="${side} 組的${label}" data-side="${side}" data-k="${k}">${opts.map(([v, t]) => `<button type="button" data-v="${v}">${t}</button>`).join('')}</div></div>`;
      box.innerHTML = `
<style>
  .labV { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labV .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labV .pad { padding: 1rem 1.25rem; }
  .labV .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr)); gap: 0 1rem; }
  .labV .seg-ctl button:disabled, .labV .ctl:disabled { opacity: 0.4; cursor: not-allowed; }
  .labV .table-wrap { overflow-x: auto; }
  .labV .tbl { min-width: 26rem; }
  @media (max-width: 900px) {
    .labV { display: flex; flex-direction: column; align-items: stretch; }
    .labV .col { display: contents; }
    .labV .c-stage { order: 1; } .labV .c-mis { order: 2; } .labV .c-table { order: 3; } .labV .c-ctl { order: 4; }
  }
</style>
<div class="labV">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 600" role="img" aria-label="兩支枝條分別插在加了油層的量筒中，比較水減少多少"></svg></div>
      <div class="pad">
        <p class="status-line" id="labV-status" aria-live="polite"></p>
        <p class="footnote">＊示意：動畫中 6 秒代表 1 小時；水減少的量是示意的數字，實際會因枝條大小、葉片多少、光線、溫度而不同。燈太近會讓溫度升高，可以用 LED 燈或保持距離。不用油層時，也可以用保鮮膜把量筒口封住（讓枝條穿過）。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>實驗紀錄（1 小時後減少的水量）</h3><div class="table-wrap" id="labV-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labV-mission"></div>
    <details class="card pad free c-ctl" id="labV-free"><summary>自由探索：自己設定兩組</summary>
      <div class="two">
        <div><h3>A 組</h3>${KEYS.map(([k, l, o]) => seg('A', k, l, o)).join('')}</div>
        <div><h3>B 組</h3>${KEYS.map(([k, l, o]) => seg('B', k, l, o)).join('')}</div>
      </div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labV-go">開始（放 1 小時＊）</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labV-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: C.bg }, svg);
      const root = g(svg);
      const st = { A: { ...DEF }, B: { ...DEF }, runs: [] };
      let run = null; // { t: 分鐘, A: 條件, B: 條件 }

      // ---------- 一組裝置 ----------
      const Y = (mL) => 532 - mL * 26;
      function setup(side, c) {
        const o = { side, c, vol: V0 };
        const sg = g(root);
        // 燈
        o.lamp = g(sg);
        o.beam = el('path', { d: `M ${c - 40},44 L ${c - 130},236 L ${c + 130},236 L ${c + 40},44 Z`, fill: C.hi, opacity: 0.1 }, o.lamp);
        el('path', { d: `M ${c - 50},44 L ${c - 30},16 L ${c + 30},16 L ${c + 50},44 Z`, fill: '#4a6272' }, o.lamp);
        o.bulb = el('ellipse', { cx: c, cy: 46, rx: 34, ry: 7, fill: '#fff3c4' }, o.lamp);
        // 電扇
        o.fan = g(sg);
        const FX = c - 196, FY = 150;
        el('line', { x1: FX, y1: FY + 40, x2: FX, y2: 232, stroke: '#4a6272', 'stroke-width': 6 }, o.fan);
        el('rect', { x: FX - 30, y: 228, width: 60, height: 10, rx: 4, fill: '#4a6272' }, o.fan);
        el('circle', { cx: FX, cy: FY, r: 42, fill: 'none', stroke: '#8aa1ae', 'stroke-width': 3 }, o.fan);
        o.blades = g(o.fan);
        for (let i = 0; i < 3; i++) el('ellipse', { cx: 0, cy: -20, rx: 9, ry: 20, fill: '#8aa1ae', transform: `rotate(${i * 120})` }, o.blades);
        el('circle', { cx: 0, cy: 0, r: 6, fill: '#cfe8ff' }, o.blades);
        o.fanXY = [FX, FY];
        o.wind = [0, 1, 2].map((k) => el('path', { d: `M ${FX + 52},${FY - 24 + k * 24} q 40,-10 80,0 q 30,8 60,0`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '16 12', opacity: 0 }, o.fan));
        // 量筒
        el('rect', { x: c - 34, y: 240, width: 68, height: 306, fill: 'rgba(207,232,255,0.05)' }, sg);
        o.water = el('rect', { x: c - 32, y: Y(V0), width: 64, height: 0, fill: 'rgba(95,184,255,0.35)' }, sg);
        o.oil = el('rect', { x: c - 32, y: Y(V0) - 8, width: 64, height: 8, fill: OIL, opacity: 0.9 }, sg);
        o.oilLbl = text(sg, c + 44, Y(V0), '油層', { 'font-size': 20, fill: OIL });
        el('path', { d: `M ${c - 40},236 L ${c - 34},242 L ${c - 34},546 L ${c + 34},546 L ${c + 34},242 L ${c + 40},236`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linejoin': 'round' }, sg);
        el('rect', { x: c - 58, y: 546, width: 116, height: 12, rx: 4, fill: '#cfe8ff', opacity: 0.55 }, sg);
        for (let i = 0; i <= 20; i++) {
          const y = Y(i / 2), major = i % 2 === 0;
          el('line', { x1: c - 34, y1: y, x2: c - 34 + (major ? 14 : 8), y2: y, stroke: '#cfe8ff', 'stroke-width': 1.5, opacity: 0.8 }, sg);
          if (i % 4 === 0) text(sg, c - 44, y + 7, i === 20 ? '10 mL' : String(i / 2), { 'font-size': 20, 'text-anchor': 'end', fill: C.mute, class: 'mono' });
        }
        // 枝條與葉
        el('line', { x1: c, y1: 530, x2: c, y2: 92, stroke: '#4f8a3a', 'stroke-width': 6, 'stroke-linecap': 'round' }, sg);
        o.leaves = g(sg);
        o.scars = g(sg);
        [[-1, 210], [1, 186], [-1, 160], [1, 136], [-1, 112], [1, 96]].forEach(([s, y]) => {
          const lg = S.place(g(o.leaves), { x: c + s * 34, y, r: s * -24 });
          el('path', { d: 'M -32,0 C -16,-13 16,-13 32,0 C 16,13 -16,13 -32,0 Z', fill: LEAF, stroke: LEAF_D, 'stroke-width': 2 }, lg);
          el('line', { x1: c, y1: y + 6, x2: c + s * 7, y2: y + 1, stroke: '#4f8a3a', 'stroke-width': 3, 'stroke-linecap': 'round' }, o.scars);
        });
        // 塑膠袋與水珠
        o.bag = g(sg);
        el('path', { d: `M ${c - 12},236 C ${c - 120},224 ${c - 118},70 ${c},58 C ${c + 118},70 ${c + 120},224 ${c + 12},236 Z`, fill: 'rgba(220,240,255,0.10)', stroke: '#cfe8ff', 'stroke-width': 2, 'stroke-dasharray': '8 5' }, o.bag);
        el('rect', { x: c - 14, y: 232, width: 28, height: 8, rx: 3, fill: '#cfe8ff' }, o.bag);
        const rr = S.rng(side === 'A' ? 3 : 8);
        o.beads = Array.from({ length: 14 }, () => { const a = rr() * Math.PI * 2, k = 0.82 + rr() * 0.1; return el('circle', { cx: c + Math.cos(a) * 96 * k, cy: 150 + Math.sin(a) * 78 * k, r: 3 + rr() * 2.5, fill: 'rgba(207,232,255,0.8)', opacity: 0 }, o.bag); });
        // 暗箱
        o.dark = g(sg);
        el('rect', { x: c - 150, y: 54, width: 300, height: 512, rx: 12, fill: 'rgba(0,0,0,0.62)', stroke: '#4a6272', 'stroke-width': 3 }, o.dark);
        text(o.dark, c + 140, 86, '放在暗處', { 'font-size': 22, 'text-anchor': 'end', fill: '#8aa1ae' });
        // 水蒸氣
        o.puffs = Array.from({ length: 10 }, (_, k) => ({ e: el('circle', { r: 7, fill: 'rgba(207,232,255,0.12)', stroke: '#cfe8ff', 'stroke-width': 2, 'stroke-dasharray': '4 3', opacity: 0 }, sg), ph: k / 10, x0: c + (k % 2 ? 40 : -40) + ((k * 7) % 5) * 4 }));
        // 讀數
        o.read = text(sg, c + 56, 476, '', { 'font-size': 30, fill: C.ink, 'font-weight': 700, class: 'mono' });
        o.lost = text(sg, c + 56, 512, '', { 'font-size': 22, fill: C.hi, 'font-weight': 700 });
        o.label = text(sg, c, 590, '', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
        return o;
      }
      const SET = { A: setup('A', 300), B: setup('B', 900) };
      el('line', { x1: 600, y1: 80, x2: 600, y2: 570, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 8' }, root);
      const clock = text(root, 600, 44, '', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });

      function apply(side) {
        const o = SET[side], c = st[side];
        o.lamp.style.opacity = c.light ? 1 : 0;
        o.dark.style.opacity = c.light ? 0 : 1;
        o.fan.style.opacity = c.wind ? 1 : 0;
        o.leaves.style.opacity = c.leaf ? 1 : 0;
        o.scars.style.opacity = c.leaf ? 0 : 1;
        o.bag.style.opacity = c.bag ? 1 : 0;
        o.oil.style.opacity = c.oil ? 0.9 : 0;
        o.oilLbl.style.opacity = c.oil ? 1 : 0;
        o.label.textContent = `${side}：${desc(c)}`;
      }
      function draw(side, t) {
        const o = SET[side], c = (run && run[side]) || st[side];
        const vol = V0 - (rateOf(c) * t) / 60;
        o.vol = vol;
        const y = Y(vol);
        o.water.setAttribute('y', y); o.water.setAttribute('height', Y(0) - y + 12);
        o.oil.setAttribute('y', y - 8);
        o.oilLbl.setAttribute('y', y + 2);
        o.read.textContent = `${fmt(vol)} mL`;
        o.lost.textContent = t > 0 ? `減少 ${fmt(V0 - vol)} mL＊` : '';
        const nb = c.bag ? Math.round(o.beads.length * S.clamp(t / 50)) : 0;
        o.beads.forEach((b, i) => b.setAttribute('opacity', i < nb ? 1 : 0));
      }
      let fanA = 0;
      function animate(dt) {
        fanA += dt * 900;
        ['A', 'B'].forEach((side) => {
          const o = SET[side], c = (run && run[side]) || st[side], on = run && !run.done;
          if (c.wind) { o.blades.setAttribute('transform', `translate(${o.fanXY[0]},${o.fanXY[1]}) rotate(${(fanA % 360).toFixed(0)})`); o.wind.forEach((w) => { w.setAttribute('opacity', 0.8); w.setAttribute('stroke-dashoffset', (-fanA / 6) % 28); }); }
          else o.blades.setAttribute('transform', `translate(${o.fanXY[0]},${o.fanXY[1]})`);
          const n = on ? Math.round(Math.min(10, leafRate(c) * 2.6)) : 0;
          o.puffs.forEach((p, k) => {
            p.ph = (p.ph + dt * 0.5) % 1;
            const vis = k < n;
            const top = c.bag ? 110 : 40;
            const x = p.x0 + (c.wind ? p.ph * 70 : Math.sin(p.ph * 6 + k) * 6), yy = S.lerp(200, top, p.ph);
            p.e.setAttribute('cx', x.toFixed(1)); p.e.setAttribute('cy', yy.toFixed(1));
            p.e.setAttribute('opacity', vis ? (1 - p.ph).toFixed(2) : 0);
          });
        });
      }

      // ---------- 執行 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function start() {
        run = { t: 0, A: { ...st.A }, B: { ...st.B }, done: false };
        status('兩組同時開始，觀察量筒的水位…');
        sync(); drawMission();
      }
      function step(dmin) {
        if (!run || run.done) return;
        run.t = Math.min(60, run.t + dmin);
        draw('A', run.t); draw('B', run.t);
        clock.textContent = `經過 ${Math.floor(run.t)} 分鐘＊`;
        if (run.t >= 60) finish();
      }
      function finish() {
        run.done = true;
        const r = { A: run.A, B: run.B, dA: V0 - SET.A.vol, dB: V0 - SET.B.vol };
        st.runs.push(r);
        clock.textContent = '1 小時後＊';
        status(`1 小時後：A 組減少 <b>${fmt(r.dA)} mL</b>，B 組減少 <b>${fmt(r.dB)} mL</b>＊。${Math.abs(r.dA - r.dB) < 0.15 ? '兩組差不多。' : r.dA > r.dB ? 'A 組減少得比較多。' : 'B 組減少得比較多。'}`);
        table(); sync();
        if (phase === 'running') { phase = 'result'; result = r; }
        drawMission();
      }
      function reset() { if (run) run.done = true; run = null; clock.textContent = ''; ['A', 'B'].forEach((s) => { apply(s); draw(s, 0); }); }

      let raf = 0, lastTs = 0;
      const loop = (ts) => {
        const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0);
        lastTs = ts;
        if (run && !run.done) step((dt / SEC_PER_HOUR) * 60);
        animate(dt);
        raf = requestAnimationFrame(loop);
      };

      // ---------- 紀錄 ----------
      function table() {
        $('table').innerHTML = st.runs.length
          ? `<table class="tbl"><thead><tr><th>#</th><th>A 組</th><th>減少</th><th>B 組</th><th>減少</th></tr></thead><tbody>${st.runs.map((r, i) => `<tr><td>${i + 1}</td><td>${desc(r.A)}</td><td><b>${fmt(r.dA)} mL</b></td><td>${desc(r.B)}</td><td><b>${fmt(r.dB)} mL</b></td></tr>`).join('')}</tbody></table><p class="m-hint" style="margin-top:0.4rem">＊數字是示意值。</p>`
          : '<p class="m-hint">每做完一次實驗，結果會列在這裡。</p>';
      }

      // ---------- 自由探索 ----------
      function sync() {
        const busy = run && !run.done;
        box.querySelectorAll('.free .seg-ctl').forEach((sg) => sg.querySelectorAll('button').forEach((b) => { b.setAttribute('aria-pressed', +b.dataset.v === st[sg.dataset.side][sg.dataset.k]); b.disabled = !!busy; }));
        $('go').disabled = !!busy;
      }
      box.querySelectorAll('.free .seg-ctl').forEach((sg) => sg.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b || b.disabled) return;
        st[sg.dataset.side][sg.dataset.k] = +b.dataset.v;
        reset(); sync();
        status(`${sg.dataset.side} 組：${desc(st[sg.dataset.side])}。按「開始」比較兩組。`);
      }));
      $('go').addEventListener('click', () => { if (phase === 'ready' || phase === 'predict') { phase = 'free'; } start(); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, phase = 'predict', pred = -1, picked = -1, solved = false, result = null;
      const firstOk = [];
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? (firstOk[k] === false ? 'miss' : 'ok') : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      function setupMission() {
        const m = MISSIONS[mi];
        phase = m && m.quiz ? 'quiz' : 'predict'; pred = -1; picked = -1; solved = false; result = null;
        if (m && !m.quiz) { st.A = { ...DEF, ...m.A }; st.B = { ...DEF, ...m.B }; }
        reset(); sync();
        if (m && !m.quiz) status(`A 組：${desc(st.A)}；B 組：${desc(st.B)}。先在任務卡預測結果。`);
        drawMission();
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          const ok = firstOk.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <p class="m-text">第一次就答對 <b>${ok} / ${MISSIONS.length}</b> 個。</p>
            <div class="fb ok"><strong>實驗重點</strong>水主要經由葉的氣孔散失（蒸散作用）。<br>光線強、風大時蒸散快；黑暗、濕度高時蒸散慢。<br>水面加油層，防止水從水面直接蒸發；只改變一個條件，比較才公平。</div>
            <p class="m-hint">想自己組合條件，可以打開下面的「自由探索」。</p>
            <button class="ctl primary" type="button" id="labV-again">再做一次</button>`;
          mbox.querySelector('#labV-again').addEventListener('click', () => { mi = 0; firstOk.length = 0; setupMission(); });
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.quiz) {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${solved && k === m.quiz.ans ? 'right' : !solved && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${solved ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!solved && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (solved) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          const lock = phase !== 'predict';
          html += `<p class="m-text">${m.q}</p><div class="opts">${m.opts.map((o, k) => {
            const cls = phase === 'result' ? (k === m.ans ? 'right' : k === pred ? 'wrong' : '') : '';
            return `<button class="opt ${cls}" type="button" data-p="${k}" aria-pressed="${k === pred}" ${lock ? 'disabled' : ''}>${o}</button>`;
          }).join('')}</div>`;
          if (phase === 'ready') html += `<div class="acts"><button class="ctl primary" type="button" id="labV-run">開始：兩組同時放 1 小時＊</button></div>`;
          if (phase === 'running') html += `<p class="m-hint">實驗進行中，觀察兩個量筒的水位…</p>`;
          if (phase === 'free') html += `<div class="fb bad"><strong>注意</strong>你用「自由探索」改了設定。按下面的按鈕，回到這個任務的設定。</div><div class="acts"><button class="ctl primary" type="button" id="labV-back">回到任務設定</button></div>`;
          if (phase === 'result' && result) {
            const okPred = pred === m.ans;
            html += `<div class="fb ${okPred ? 'ok' : 'bad'}"><strong>${okPred ? '預測正確！' : '和你的預測不一樣'}</strong>實驗結果：A 組減少 ${fmt(result.dA)} mL，B 組減少 ${fmt(result.dB)} mL＊。<br>${m.why}</div>`;
          }
        }
        if ((m.quiz && solved) || phase === 'result') html += `<button class="ctl primary" type="button" id="labV-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (firstOk[mi] === undefined) firstOk[mi] = k === m.quiz.ans;
          if (k === m.quiz.ans) solved = true; else picked = k;
          drawMission();
        }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p;
          if (firstOk[mi] === undefined) firstOk[mi] = pred === m.ans;
          phase = 'ready'; drawMission();
        }));
        const on = (id, fn) => { const e = mbox.querySelector('#labV-' + id); if (e) e.addEventListener('click', fn); };
        on('run', () => { phase = 'running'; st.A = { ...DEF, ...m.A }; st.B = { ...DEF, ...m.B }; reset(); sync(); start(); });
        on('back', () => { const p = pred; setupMission(); if (p >= 0) { pred = p; phase = 'ready'; drawMission(); } });
        on('next', () => { mi++; setupMission(); });
      }

      setupMission();
      table();
      raf = requestAnimationFrame(loop);
      S._labV = { st, get run() { return run; }, start, advance(sec) { for (let i = 0; i < sec * 20 && run && !run.done; i++) step((0.05 / SEC_PER_HOUR) * 60); animate(0.05); } }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); delete S._labV; } };
    },
  });
})();
