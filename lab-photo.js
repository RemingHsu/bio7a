/* 互動模型：水蘊草實驗 — 調燈的距離、開關燈、換水（小蘇打水／煮沸後冷卻的開水），數 1 分鐘的氣泡；收集氣體用線香測試 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const SEC_PER_MIN = 6;            // 6 秒代表 1 分鐘＊
  const PX_CM = 10.5, PLANT_X = 720;
  const WATERS = { soda: '小蘇打水', boiled: '煮沸後冷卻的開水' };
  const GAS_MAX = 190, GAS_TEST = 30;
  // 每分鐘的氣泡數（示意）：光越強越多，但會漸漸趨緩；缺少二氧化碳時很少
  const rateOf = (s) => {
    if (!s.light) return 0;
    const L = (15 / s.d) ** 2;
    return 30 * (L / (L + 0.35)) * (s.water === 'soda' ? 1 : 0.12);
  };

  const MISSIONS = [
    { title: '開燈看看', text: '把燈<b>打開</b>，觀察水蘊草有沒有冒出氣泡。', acts: [{ label: '開燈', set: { light: 1 }, did: (s) => s.light === 1 }], done: (s) => s.light && s.emitted >= 5,
      why: '照光時，水蘊草進行光合作用，產生的<b>氧</b>在水中形成氣泡冒出來。' },
    { title: '燈的遠近', predict: { q: '燈越靠近水蘊草（光越強），每分鐘的氣泡數會怎樣？先預測：', opts: ['越多', '越少', '不會改變'], ans: 0 },
      text: '在 3 種距離各數 1 分鐘的氣泡，比較看看：', acts: [15, 30, 60].map((d) => ({ label: `燈在 ${d} cm`, set: { d, light: 1, water: 'soda' }, then: 'count', did: (s) => s.data.some((r) => r.water === 'soda' && r.light && r.d === d) })), done: (s) => new Set(s.data.filter((r) => r.water === 'soda' && r.light).map((r) => r.d)).size >= 3,
      why: '燈越近、光越強，光合作用越旺盛，氣泡越多。' },
    { title: '哪些要相同？', quiz: { q: '這個實驗要比較「燈的距離」對氣泡數的影響。下列哪一項必須保持相同？', opts: ['燈的距離', '水的種類、水蘊草的量和水溫', '每分鐘的氣泡數'], ans: 1, hint: '燈的距離是我們故意改變的（操縱變因），氣泡數是我們要觀察的（應變變因）。' },
      why: '只改變燈的距離（操縱變因），觀察氣泡數（應變變因）；水的種類、水蘊草的量、水溫等都要相同（控制變因），實驗才公平。' },
    { title: '缺少二氧化碳', text: '把水換成<b>煮沸後冷卻的開水</b>（水中的二氧化碳被趕走了），燈一樣放 30 cm，和小蘇打水比較。', acts: [{ label: '換水，30 cm 數 1 分鐘', set: { d: 30, light: 1, water: 'boiled' }, then: 'count', did: (s) => s.data.some((r) => r.water === 'boiled' && r.light) }],
      done: (s) => s.data.some((r) => r.water === 'boiled' && r.light && s.data.some((q) => q.water === 'soda' && q.light && q.d === r.d)),
      why: '煮沸會趕走水中的二氧化碳，原料不夠，光合作用很少，氣泡也很少。小蘇打水能提供二氧化碳。' },
    { title: '氣泡是什麼氣體？', text: '先讓試管收集多一點氣體，再用線香的餘燼測試。', acts: [{ label: '燈移到 15 cm，收集氣體', set: { d: 15, light: 1, water: 'soda' }, did: (s) => s.light && s.d === 15 && s.water === 'soda' }, { label: '用線香測試', then: 'test', ready: (s) => s.gas >= GAS_TEST }], done: (s) => s.tested === 'ok',
      why: '收集到的氣體能使線香的<b>餘燼復燃</b>，表示這種氣體能幫助燃燒，是<b>氧</b>。' },
    { title: '關燈呢？', need: (s) => s.data.some((r) => !r.light), needText: '把燈<b>關掉</b>，數 1 分鐘的氣泡：', acts: [{ label: '關燈，數 1 分鐘', set: { light: 0 }, then: 'count', did: (s) => s.data.some((r) => !r.light) }],
      quiz: { q: '在黑暗中，水蘊草還會冒出氧的氣泡嗎？', opts: ['會，和照光時一樣多', '幾乎不會'], ans: 1, hint: '看看剛才關燈時數到的氣泡數。' },
      why: '光合作用需要<b>光</b>。黑暗中不進行光合作用，所以沒有產生氧的氣泡。' },
  ];

  S.registerLab({
    id: 'lab-photo', section: '3-3', title: '水蘊草實驗',
    mount(box) {
      box.innerHTML = `
<style>
  .labP { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labP .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labP .pad { padding: 1rem 1.25rem; }
  .labP .seg-ctl button:disabled, .labP .ctl:disabled { opacity: 0.4; cursor: not-allowed; }
  .labP .chartwrap { position: relative; }
  .labP .chartwrap svg { display: block; width: 100%; height: auto; }
  .labP .chart text { font-size: 16px; }
  .labP .table-wrap { overflow-x: auto; }
  .labP .tbl { min-width: 20rem; }
  @media (max-width: 900px) {
    .labP { display: flex; flex-direction: column; align-items: stretch; }
    .labP .col { display: contents; }
    .labP .c-stage { order: 1; } .labP .c-mis { order: 2; } .labP .c-data { order: 3; } .labP .c-ctl { order: 4; }
  }
</style>
<div class="labP">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 560" role="img" aria-label="燈、燒杯中的水蘊草、收集氣體的試管和線香測試"></svg></div>
      <div class="pad">
        <p class="status-line" id="labP-status" aria-live="polite"></p>
        <p class="footnote">＊示意：動畫中 6 秒代表 1 分鐘，氣泡數也是示意；實際數目和水蘊草的多少、燈的種類有關。燈很近時水溫可能升高，實驗時可以用 LED 燈，或在燈和燒杯之間放一杯水隔熱。</p>
      </div>
    </div>
    <div class="card pad c-data"><h3>實驗紀錄（每分鐘的氣泡數）</h3>
      <div class="legend" id="labP-legend"></div>
      <div class="chartwrap chart" id="labP-chart"></div>
      <div class="table-wrap" id="labP-table"></div>
    </div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labP-mission"></div>
    <details class="card pad free c-ctl" id="labP-free"><summary>自由探索：自己調整燈和水</summary>
      <div class="field"><div class="field-head"><label for="labP-d">燈和水蘊草的距離</label><output id="labP-d-o"></output></div>
        <input type="range" id="labP-d" min="15" max="60" step="5" value="30"></div>
      <div class="field"><div class="field-head"><span>燈</span></div>
        <div class="seg-ctl" role="group" aria-label="燈" id="labP-light"><button type="button" data-v="1">開</button><button type="button" data-v="0">關</button></div></div>
      <div class="field"><div class="field-head"><span>燒杯裡的水</span></div>
        <div class="seg-ctl" role="group" aria-label="燒杯裡的水" id="labP-water">${Object.entries(WATERS).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labP-count">數 1 分鐘</button><button class="ctl" type="button" id="labP-test">用線香測試</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labP-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 560, fill: C.bg }, svg);
      const root = g(svg);
      const st = { d: 30, light: 0, water: 'soda', emitted: 0, gas: 0, data: [], tested: null };
      let counting = null; // { left, n }

      // ---------- 燒杯、水蘊草、漏斗、試管 ----------
      el('rect', { x: 602, y: 210, width: 316, height: 290, fill: 'rgba(95,184,255,0.16)' }, root);
      el('path', { d: 'M 594,190 L 602,198 L 602,494 Q 602,502 610,502 L 910,502 Q 918,502 918,494 L 918,190', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4 }, root);
      const waterLbl = text(root, 760, 540, '', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      for (let i = 0; i < 5; i++) {
        const x = PLANT_X - 50 + i * 25;
        el('path', { d: `M ${x},496 C ${x - 8},450 ${x + 8},400 ${x - 3 + (i % 2) * 6},350`, fill: 'none', stroke: '#4fae4a', 'stroke-width': 4 }, root);
        for (let k = 0; k < 5; k++) [-1, 1].forEach((s) => el('ellipse', { cx: x + s * 8, cy: 486 - k * 28, rx: 8, ry: 3.5, fill: '#6fce62', transform: `rotate(${s * -30} ${x + s * 8} ${486 - k * 28})` }, root));
      }
      el('path', { d: `M ${PLANT_X - 90},498 L ${PLANT_X - 20},320 L ${PLANT_X - 20},270 M ${PLANT_X + 90},498 L ${PLANT_X + 20},320 L ${PLANT_X + 20},270`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3.5 }, root);
      el('path', { d: `M ${PLANT_X - 22},290 L ${PLANT_X - 22},56 C ${PLANT_X - 22},30 ${PLANT_X + 22},30 ${PLANT_X + 22},56 L ${PLANT_X + 22},290`, fill: 'rgba(95,184,255,0.2)', stroke: '#cfe8ff', 'stroke-width': 3.5 }, root);
      const gasR = el('rect', { x: PLANT_X - 20, y: 40, width: 40, height: 0, fill: '#0d1822' }, root);
      const gasLbl = text(root, PLANT_X + 34, 80, '收集到的氣體', { 'font-size': 20, fill: C.ink2, opacity: 0 });
      const bubG = g(root);
      const bubbles = [];

      // ---------- 燈 ----------
      const lamp = g(root);
      const beam = el('path', { d: '', fill: C.hi, opacity: 0 }, root);
      root.insertBefore(beam, lamp);
      el('path', { d: 'M -60,-34 L 0,-50 L 0,50 L -60,34 Z', fill: '#4a6272' }, lamp);
      el('rect', { x: -84, y: -14, width: 26, height: 28, rx: 4, fill: '#3a4a56' }, lamp);
      el('line', { x1: -70, y1: 14, x2: -70, y2: 130, stroke: '#3a4a56', 'stroke-width': 6 }, lamp);
      el('rect', { x: -110, y: 128, width: 80, height: 12, rx: 4, fill: '#3a4a56' }, lamp);
      const bulb = el('ellipse', { cx: -2, cy: 0, rx: 6, ry: 44, fill: '#5a6670' }, lamp);
      const dimG = g(root);

      // ---------- 線香測試（右側）----------
      const TX = 1080;
      text(root, TX, 486, '線香測試', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      el('path', { d: `M ${TX - 22},180 L ${TX - 22},430 C ${TX - 22},456 ${TX + 22},456 ${TX + 22},430 L ${TX + 22},180`, fill: 'rgba(220,240,255,0.08)', stroke: '#cfe8ff', 'stroke-width': 3.5 }, root);
      const testGas = el('rect', { x: TX - 20, y: 180, width: 40, height: 0, fill: 'rgba(255,255,255,0.08)' }, root);
      const sp = { x: TX + 70, y: 250, r: 10 };
      const stick = g(root);
      el('line', { x1: 0, y1: 0, x2: 0, y2: -200, stroke: '#a8742e', 'stroke-width': 6, 'stroke-linecap': 'round' }, stick);
      const ember = el('circle', { cx: 0, cy: 0, r: 7, fill: '#ff6b4a' }, stick);
      const fl = g(stick, { opacity: 0 });
      el('path', { d: 'M 0,0 C -11,-7 -8,-21 0,-34 C 8,-21 11,-7 0,0 Z', fill: '#ff8a3c' }, fl);
      el('path', { d: 'M 0,-2 C -5,-6 -4,-14 0,-21 C 4,-14 5,-6 0,-2 Z', fill: '#ffd166' }, fl);
      const placeStick = () => stick.setAttribute('transform', S.xf(sp));
      placeStick();
      const testLbl = text(root, TX, 530, '', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      let testTl = null;

      // ---------- 計數 ----------
      const counter = text(root, 300, 60, '', { 'font-size': 30, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });

      function drawLamp() {
        const fx = PLANT_X - st.d * PX_CM;
        lamp.setAttribute('transform', `translate(${fx},330)`);
        bulb.setAttribute('fill', st.light ? '#fff3c4' : '#5a6670');
        beam.setAttribute('d', `M ${fx},282 L ${PLANT_X - 40},250 L ${PLANT_X - 40},500 L ${fx},378 Z`);
        beam.setAttribute('opacity', st.light ? 0.06 + 0.16 * (15 / st.d) : 0);
        dimG.innerHTML = '';
        S.dimension(dimG, fx, 512, PLANT_X, 512, `${st.d} cm`, { size: 22, offset: -24, color: C.ink2, sw: 2 });
        waterLbl.textContent = `燒杯：${WATERS[st.water]}`;
      }

      // ---------- 動畫 ----------
      const rnd = S.rng(5);
      let nextIn = 0;
      function spawn() {
        st.emitted++;
        const b = el('circle', { cx: PLANT_X - 50 + rnd() * 100, cy: 360 + rnd() * 120, r: 4 + rnd() * 3, fill: 'none', stroke: '#e8f6ff', 'stroke-width': 2 }, bubG);
        bubbles.push({ e: b, x: +b.getAttribute('cx'), y: +b.getAttribute('cy'), ph: rnd() * 6 });
        if (counting) counting.n++;
      }
      function step(dt) {
        // 氣泡出現：間隔有一點隨機（平均每分鐘 rate 個；取 6 段平均，讓數目不會差太多）
        const rate = rateOf(st) / SEC_PER_MIN; // 每秒
        if (rate > 0) {
          nextIn -= dt;
          while (nextIn <= 0) { spawn(); let e = 0; for (let k = 0; k < 6; k++) e -= Math.log(1 - Math.random() * 0.999); nextIn += e / 6 / rate; }
        } else nextIn = 0.2;
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          b.y -= 150 * dt; b.ph += dt * 8;
          if (b.y < 330) b.x += (PLANT_X - b.x) * Math.min(1, dt * 6);
          const top = 40 + st.gas;
          b.e.setAttribute('cx', (b.x + Math.sin(b.ph) * 2).toFixed(1)); b.e.setAttribute('cy', b.y.toFixed(1));
          if (b.y <= top + 6) { b.e.remove(); bubbles.splice(i, 1); st.gas = Math.min(GAS_MAX, st.gas + 0.8); }
        }
        gasR.setAttribute('height', st.gas);
        gasLbl.setAttribute('opacity', st.gas > 12 ? 1 : 0);
        if (counting) {
          counting.left -= dt;
          counter.textContent = `計數中：${counting.n} 個（剩 ${Math.max(0, Math.ceil(counting.left))} 秒＊）`;
          if (counting.left <= 0) finishCount();
        }
        checkMission();
      }
      let raf = 0, lastTs = 0;
      const loop = (ts) => { const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0); lastTs = ts; step(dt); raf = requestAnimationFrame(loop); };

      function startCount() {
        counting = { left: SEC_PER_MIN, n: 0, d: st.d, light: st.light, water: st.water };
        status('開始計數：數 1 分鐘內冒出的氣泡。');
        sync(); drawMission();
      }
      function finishCount() {
        const c = counting; counting = null;
        st.data.push({ d: c.d, light: c.light, water: c.water, n: c.n });
        counter.textContent = `1 分鐘：${c.n} 個氣泡`;
        status(c.light ? `距離 ${c.d} cm、${WATERS[c.water]}：1 分鐘冒出 <b>${c.n}</b> 個氣泡。` : `關燈時，1 分鐘冒出 <b>${c.n}</b> 個氣泡。`);
        sync(); drawData(); checkMission(true); drawMission();
      }
      function runTest() {
        if (testTl) testTl.kill();
        const ok = st.gas >= GAS_TEST;
        const filled = st.gas;
        st.gas = 0; // 把試管裡的氣體拿去測試
        testGas.setAttribute('height', Math.min(250, filled * 1.3));
        Object.assign(sp, { x: TX + 70, y: 250, r: 10 }); placeStick();
        gsap.set(fl, { opacity: 0 }); gsap.set(ember, { opacity: 1 }); testLbl.textContent = '';
        testTl = gsap.timeline();
        testTl.to(sp, { x: TX, y: 330, r: 0, duration: 1, ease: 'power2.inOut', onUpdate: placeStick });
        testTl.call(() => {
          if (ok) { gsap.to(fl, { opacity: 1, duration: 0.3 }); gsap.to(ember, { opacity: 0, duration: 0.3 }); testLbl.textContent = '餘燼復燃！'; testLbl.setAttribute('fill', C.hi); st.tested = 'ok'; status('線香的餘燼<b>復燃</b>了：收集到的氣體是<b>氧</b>。'); }
          else { testLbl.textContent = '氣體太少'; testLbl.setAttribute('fill', C.mute); st.tested = 'few'; status('收集到的氣體太少，看不出結果。先開燈、讓燈近一點，多收集一些氣體再測試。'); }
          checkMission(true); drawMission();
        });
      }

      // ---------- 紀錄圖表 ----------
      const CH = { w: 600, h: 300, l: 56, r: 16, t: 16, b: 46 };
      const SER = { soda: ['#5fb8ff', '小蘇打水'], boiled: ['#ffb35c', '煮沸後冷卻的開水'] };
      $('legend').innerHTML = Object.values(SER).map(([c, n]) => `<span style="--c:${c}">${n}</span>`).join('');
      function drawData() {
        const xs = (d) => CH.l + ((d - 10) / 55) * (CH.w - CH.l - CH.r), ys = (n) => CH.h - CH.b - (n / 40) * (CH.h - CH.t - CH.b);
        let s = `<svg viewBox="0 0 ${CH.w} ${CH.h}" role="img" aria-label="燈的距離與每分鐘氣泡數">`;
        for (let n = 0; n <= 40; n += 10) s += `<line x1="${CH.l}" x2="${CH.w - CH.r}" y1="${ys(n)}" y2="${ys(n)}" style="stroke:var(--line)" stroke-width="1"/><text x="${CH.l - 8}" y="${ys(n) + 5}" text-anchor="end">${n}</text>`;
        for (let d = 15; d <= 60; d += 15) s += `<text x="${xs(d)}" y="${CH.h - CH.b + 22}" text-anchor="middle">${d}</text>`;
        s += `<text x="${(CH.l + CH.w - CH.r) / 2}" y="${CH.h - 4}" text-anchor="middle">燈的距離（cm）</text>`;
        s += `<text x="14" y="${CH.t + 4}" transform="rotate(-90 14 ${CH.t + 4})" text-anchor="end">氣泡數／分鐘＊</text>`;
        st.data.filter((r) => r.light).forEach((r) => {
          const [c] = SER[r.water];
          s += `<circle cx="${xs(r.d)}" cy="${ys(r.n)}" r="7" fill="${c}" style="stroke:var(--surface)" stroke-width="2"><title>${r.d} cm、${WATERS[r.water]}：${r.n} 個</title></circle>`;
        });
        s += '</svg>';
        $('chart').innerHTML = s;
        $('table').innerHTML = st.data.length ? `<table class="tbl"><thead><tr><th>#</th><th>燈</th><th>距離</th><th>水</th><th>氣泡數</th></tr></thead><tbody>${st.data.map((r, i) => `<tr><td>${i + 1}</td><td>${r.light ? '開' : '關'}</td><td>${r.d} cm</td><td>${WATERS[r.water]}</td><td><b>${r.n}</b></td></tr>`).join('')}</tbody></table>` : '<p class="m-hint">按「數 1 分鐘」後，結果會列在這裡。</p>';
      }

      // ---------- 控制 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function sync() {
        const busy = !!counting;
        $('d-o').textContent = `${st.d} cm`; $('d').value = st.d; $('d').disabled = busy;
        box.querySelectorAll('#labP-light button').forEach((b) => { b.setAttribute('aria-pressed', +b.dataset.v === st.light); b.disabled = busy; });
        box.querySelectorAll('#labP-water button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === st.water); b.disabled = busy; });
        $('count').disabled = busy; $('test').disabled = busy;
        drawLamp();
      }
      $('d').addEventListener('input', () => { st.d = +$('d').value; sync(); });
      box.querySelectorAll('#labP-light button').forEach((b) => b.addEventListener('click', () => { st.light = +b.dataset.v; sync(); }));
      box.querySelectorAll('#labP-water button').forEach((b) => b.addEventListener('click', () => { st.water = b.dataset.v; sync(); status(`換成${WATERS[st.water]}。`); }));
      $('count').addEventListener('click', startCount);
      $('test').addEventListener('click', runTest);

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, needShown = null;
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? 'ok' : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      let gasReady = null;
      const actsHtml = (m) => `<div class="acts">${m.acts.map((a, i) => {
        const did = a.did && a.did(st), ok = !counting && (!a.ready || a.ready(st));
        return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${!!did}" ${ok ? '' : 'disabled'}>${a.label}${did ? ' ✓' : ''}</button>`;
      }).join('')}</div>${m.acts.some((a) => a.ready) ? `<p class="m-hint">試管中的氣體：${st.gas >= GAS_TEST ? '夠了，可以測試' : '還不夠，等一下…'}</p>` : ''}`;
      function doAct(a) {
        if (a.set) { Object.assign(st, a.set); sync(); }
        if (a.then === 'count') startCount();
        else if (a.then === 'test') runTest();
        drawMission();
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>實驗重點</strong>水蘊草照光時放出氧（氣泡），能使線香餘燼復燃。<br>光越強（燈越近）氣泡越多；缺少二氧化碳或沒有光時，氣泡很少。<br>只改變一個條件，其他保持相同，比較才公平。</div>
            <button class="ctl primary" type="button" id="labP-again">再練習一次</button>`;
          mbox.querySelector('#labP-again').addEventListener('click', reset);
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
          const ready = !m.need || m.need(st);
          needShown = ready;
          if (!ready) html += `<p class="m-text">${m.needText}</p>${m.acts ? actsHtml(m) : ''}`;
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done || !ready ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.text}</p>`;
          if (done) html += `<div class="fb ok"><strong>完成</strong>${m.why}</div>`;
          else html += actsHtml(m);
        }
        if (done) html += `<button class="ctl primary" type="button" id="labP-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; drawMission(); checkMission(true); }));
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => doAct(m.acts[+b.dataset.a])));
        gasReady = st.gas >= GAS_TEST;
        const nx = mbox.querySelector('#labP-next');
        if (nx) nx.addEventListener('click', () => { mi++; done = false; picked = -1; pred = -1; drawMission(); checkMission(true); });
      }
      // 每一格都會呼叫：只有狀態改變時才重畫
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.quiz) { if (m.need && m.need(st) !== needShown) drawMission(); return; }
        if (m.acts && m.acts.some((a) => a.ready) && (st.gas >= GAS_TEST) !== gasReady) drawMission();
        if (m.predict && pred < 0) return;
        if (m.done(st)) { done = true; drawMission(); }
      }
      function reset() {
        if (testTl) testTl.kill();
        bubbles.forEach((b) => b.e.remove()); bubbles.length = 0;
        Object.assign(st, { d: 30, light: 0, water: 'soda', emitted: 0, gas: 0, data: [], tested: null });
        counting = null; counter.textContent = '';
        mi = 0; done = false; picked = -1; pred = -1; needShown = null;
        testGas.setAttribute('height', 0); testLbl.textContent = '';
        Object.assign(sp, { x: TX + 70, y: 250, r: 10 }); placeStick(); gsap.set(fl, { opacity: 0 }); gsap.set(ember, { opacity: 1 });
        status('按任務卡上的按鈕操作，觀察水蘊草冒出的氣泡。');
        $('free').open = false;
        sync(); drawData(); drawMission();
      }

      reset();
      raf = requestAnimationFrame(loop);
      S._labP = { st, advance(sec) { for (let i = 0; i < sec * 20; i++) step(0.05); }, startCount, runTest }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); if (testTl) testTl.kill(); delete S._labP; } };
    },
  });
})();
