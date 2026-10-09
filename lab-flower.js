/* 互動模型（七下 1-3）：花變成果實 — 點花的部位回答：花粉要落在哪裡（授粉 → 花粉管 → 受精）→ 哪些部分凋謝 → 哪裡變成果實 → 哪裡變成種子。
   花的縱切面圖來自 scene-flower.js（S.b1.flower）。 */
(() => {
  const { el, g, text, C } = S;
  const NAME = { anther: '花藥', stigma: '柱頭', petal: '花瓣', ovary: '子房', ovule: '胚珠', sepal: '花萼', recept: '花托', filament: '花絲', pollen: '花粉' };

  const MISSIONS = [
    { title: '授粉', q: '蜜蜂帶著花粉飛來了。花粉要落在哪裡，才算完成<b>授粉</b>？', opts: [['anther', '花藥'], ['stigma', '柱頭'], ['petal', '花瓣'], ['ovary', '子房']], ans: 1, run: 'pollinate',
      hints: { anther: '花藥是<b>產生</b>花粉的地方。授粉要把花粉送到「雌蕊」上。', petal: '花瓣的功用是吸引昆蟲，它不會接收花粉。', ovary: '子房包在花的基部裡面，花粉碰不到它。花粉要先落在雌蕊露在外面的部分。' },
      why: '花粉落到雌蕊的<b>柱頭</b>上，就是<b>授粉</b>。接著花粉長出<b>花粉管</b>，穿過花柱到達胚珠，精細胞和胚珠內的卵結合（<b>受精</b>）。' },
    { title: '凋謝', q: '受精以後，花的哪些部分會<b>凋謝掉落</b>？', opts: [['petal', '花瓣和雄蕊'], ['ovary', '子房'], ['ovule', '胚珠']], ans: 0, run: 'wither',
      hints: { ovary: '子房受精後還有重要的任務，會繼續長大。', ovule: '胚珠受精後還會繼續發育，不會掉落。' },
      why: '<b>花瓣</b>和<b>雄蕊</b>完成吸引昆蟲、提供花粉的任務後，就凋謝掉落；柱頭和花柱也會枯萎。<b>花萼</b>常常留下來（例如番茄）。' },
    { title: '果實', q: '剩下的部分裡，哪一個會長成<b>果實</b>？', opts: [['ovary', '子房'], ['ovule', '胚珠'], ['recept', '花托']], ans: 0, run: 'fruit',
      hints: { ovule: '胚珠很小，一個果實裡常常有好幾個。果實是「包在外面」的構造長大而成的。', recept: '花托是花的各部分長出來的地方。一般的果實，是雌蕊的一部分長大而成的。' },
      why: '受精後，<b>子房</b>膨大，發育成<b>果實</b>（子房壁變成果皮）。' },
    { title: '種子', q: '果實裡的<b>種子</b>，是由哪一個部分發育而成的？', opts: [['pollen', '花粉'], ['ovule', '胚珠'], ['ovary', '子房'], ['anther', '花藥']], ans: 1, run: 'seed',
      hints: { pollen: '花粉只是送來精細胞，花粉粒本身不會留在果實裡長大。', ovary: '子房已經長成果實了。種子在果實的裡面。', anther: '花藥屬於雄蕊，已經凋謝掉落了。' },
      why: '受精後，<b>胚珠</b>發育成<b>種子</b>；種子裡的<b>胚</b>由受精卵發育而成，將來長成新植物。' },
  ];
  const SUM = [['柱頭：接住花粉（授粉）', '#dcef74'], ['花瓣、雄蕊：凋謝掉落', '#ff8fb8'], ['子房 → 果實', '#ff9a7a'], ['胚珠 → 種子', '#f2dc9a']];

  S.registerLab({
    id: 'lab-flower', section: '下1-3', title: '花變成果實',
    mount(box) {
      box.innerHTML = `
<style>
  .labN2 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labN2 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labN2 .pad { padding: 1rem 1.25rem; }
  .labN2 .opt:disabled { cursor: default; }
  .labN2 .hit { cursor: pointer; }
  @media (max-width: 900px) {
    .labN2 { display: flex; flex-direction: column; align-items: stretch; }
    .labN2 .col { display: contents; }
    .labN2 .c-stage { order: 1; } .labN2 .c-mis { order: 2; } .labN2 .c-ctl { order: 4; }
  }
</style>
<div class="labN2">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="花的縱切面：可以點選花的各個部位"></svg></div>
      <div class="pad">
        <p class="status-line" id="labN2-status" aria-live="polite"></p>
        <p class="footnote">＊示意：花的構造簡化了，花粉、花粉管、胚珠都畫得很大；從授粉到果實成熟，實際上要好幾天到好幾週，依植物而不同。</p>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labN2-mission"></div>
    <details class="card pad free c-ctl" id="labN2-free"><summary>自由探索：拉動時間</summary>
      <div class="field"><div class="field-head"><label for="labN2-t">從開花到結果</label><output id="labN2-t-o"></output></div>
        <input type="range" id="labN2-t" min="0" max="100" step="1" value="0">
        <div class="ticks"><span>開花</span><span>授粉、受精</span><span>凋謝</span><span>果實</span></div></div>
      <div class="field"><div class="field-head"><span>名稱</span></div>
        <div class="seg-ctl" role="group" aria-label="名稱" id="labN2-lbl"><button type="button" data-v="1">顯示</button><button type="button" data-v="0">隱藏</button></div></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labN2-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const B1 = S.b1;
      const FX = 420, FY = 388, FS = 1.2;
      const fl = B1.flower(root, { x: FX, y: FY, s: FS });
      const P = (lx, ly) => [FX + lx * FS, FY + ly * FS];

      // 花粉管（在花的座標裡）、柱頭上的花粉、受精的閃光、種子的標示
      const tube = el('path', { d: 'M 4,-182 C 2,-172 0,-166 0,-150 L 0,-92 C 0,-80 -5,-75 -10,-72', fill: 'none', stroke: '#fff2c0', 'stroke-width': 3, 'stroke-linecap': 'round' }, fl.g);
      const tL = tube.getTotalLength();
      tube.setAttribute('stroke-dasharray', `${tL} ${tL}`);
      const stgPol = g(fl.stigma, { opacity: 0 });
      [[-6, -190], [5, -192], [9, -185], [-1, -185]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 3.2, fill: '#ffcf3c', stroke: '#a07010', 'stroke-width': 0.8 }, stgPol));
      const spc = el('ellipse', { rx: 3.5, ry: 2.5, fill: '#62a8ff', opacity: 0 }, fl.g);
      const flash = el('circle', { cx: -11, cy: -61, r: 0, fill: 'none', stroke: C.hi, 'stroke-width': 2, opacity: 0 }, fl.g);
      const seedRings = fl.ovules.map((og) => { const b = og.body; return el('ellipse', { cx: b.getAttribute('cx'), cy: b.getAttribute('cy'), rx: 12, ry: 14, fill: 'none', stroke: C.hi, 'stroke-width': 2, opacity: 0 }, og); });
      const bee = B1.bee(root, 1.2);
      bee.style.opacity = 0;

      // 各部位的點擊區（畫在部位的群組裡，跟著一起移動、縮放）
      const hits = [];
      const hit = (gp, kind, shape) => { const h = el(shape[0], { ...shape[1], fill: 'transparent', class: 'hit' }, gp); h.dataset.k = kind; hits.push({ h, kind, gp }); return h; };
      hit(fl.stigma, 'stigma', ['circle', { cx: 0, cy: -182, r: 24 }]);
      fl.stamens.forEach((sg) => { hit(sg.firstChild, 'anther', ['circle', { cx: sg === fl.stamens[0] || sg === fl.stamens[2] ? -66 : -40, cy: sg === fl.stamens[0] || sg === fl.stamens[2] ? -160 : -178, r: 20 }]); });
      fl.petals.forEach((pg) => { pg.querySelectorAll('path').forEach((pa) => { pa.dataset.k = 'petal'; pa.classList.add('hit'); }); });
      fl.sepals.querySelectorAll('path').forEach((pa) => { pa.dataset.k = 'sepal'; pa.classList.add('hit'); });
      fl.recept.dataset.k = 'recept'; fl.recept.classList.add('hit');
      fl.ovWall.dataset.k = 'ovary'; fl.ovWall.classList.add('hit'); fl.ovCav.dataset.k = 'ovary'; fl.ovCav.classList.add('hit');
      fl.ovules.forEach((og) => { hit(og, 'ovule', ['ellipse', { cx: og.body.getAttribute('cx'), cy: og.body.getAttribute('cy'), rx: 11, ry: 13 }]); });
      svg.addEventListener('click', (e) => {
        const t = e.target.closest && e.target.closest('[data-k]');
        if (!t || !svg.contains(t)) return;
        tapPart(t.dataset.k);
      });

      // 名稱標籤（答對後出現；自由探索可以全部顯示）
      const LBL = {
        stigma: [[0, -188], 250, 110], anther: [[-66, -166], 130, 190], petal: [[-118, -150], 110, 300], sepal: [[-104, -32], 110, 470], recept: [[-24, 14], 140, 560],
        ovary: [[30, -36], 640, 400], ovule: [[11, -61], 640, 300], filament: [[48, -96], 640, 200],
      };
      const labels = {};
      Object.entries(LBL).forEach(([k, [[lx, ly], x, y]]) => { const [tx, ty] = P(lx, ly); labels[k] = S.callout(root, tx, ty, x, y, NAME[k], C.hi, { size: 22 }); });
      const sumG = g(root);
      const sums = SUM.map(([s, c], i) => { const sg = g(sumG, { opacity: 0 }); S.pill(sg, 960, 220 + i * 72, s, { size: 23, color: c, edge: c }); return sg; });
      const stageTitle = text(root, 960, 160, '學到了', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute, opacity: 0 });

      // ---------- 畫面狀態 ----------
      const st = { pol: 0, tube: 0, wither: 0, fruit: 0, seed: 0, labels: 'auto' };
      const shown = new Set();
      function render() {
        stgPol.style.opacity = st.pol > 0.5 ? 1 : 0;
        tube.setAttribute('stroke-dashoffset', (tL * (1 - st.tube)).toFixed(1));
        tube.style.opacity = st.tube > 0 ? 1 - S.smoothstep(0.2, 0.6, st.wither) : 0;
        const q = tube.getPointAtLength(tL * st.tube);
        spc.setAttribute('cx', q.x); spc.setAttribute('cy', q.y);
        spc.style.opacity = st.tube > 0.05 && st.tube < 0.99 ? 1 : 0;
        const fk = S.smoothstep(0.92, 1, st.tube) * (1 - S.smoothstep(0, 0.3, st.wither));
        flash.setAttribute('r', 6 + 10 * fk); flash.style.opacity = st.tube >= 0.99 ? 1 - S.smoothstep(0, 0.5, st.wither) : 0;
        B1.wither(fl, st.wither);
        B1.fruitGrow(fl, st.fruit);
        seedRings.forEach((r) => { r.style.opacity = st.seed; });
        // 已經凋謝的部位不能再點
        const gone = st.wither > 0.5;
        hits.forEach(({ h, kind }) => { h.style.pointerEvents = gone && (kind === 'stigma' || kind === 'anther') ? 'none' : ''; });
        fl.petals.forEach((pg) => { pg.style.pointerEvents = gone ? 'none' : ''; });
        Object.entries(labels).forEach(([k, lg]) => {
          const witheredPart = ['stigma', 'anther', 'petal', 'filament'].includes(k) && st.wither > 0.3;
          const on = st.labels === 'all' ? !witheredPart : st.labels === 'none' ? false : shown.has(k) && !witheredPart;
          lg.style.opacity = on ? 1 : 0;
        });
        if (st.fruit > 0.5) { labels.ovary.querySelector('text').textContent = '果實'; } else labels.ovary.querySelector('text').textContent = '子房';
        if (st.fruit > 0.5 || st.seed > 0.5) labels.ovule.querySelector('text').textContent = st.seed > 0.5 ? '種子' : '胚珠'; else labels.ovule.querySelector('text').textContent = '胚珠';
      }

      // ---------- 動畫（rAF；分頁隱藏時用 advance 測試） ----------
      let anim = null, raf = 0, last = 0;
      const RUNS = {
        pollinate: { dur: 6, fn(u) {
          const k1 = S.smoothstep(0, 0.35, u);
          const [sx, sy] = P(0, -184);
          bee.style.opacity = u < 0.5 ? 1 : 1 - S.smoothstep(0.5, 0.6, u);
          S.place(bee, { x: S.lerp(1000, sx + 26, k1) + (u > 0.35 ? (u - 0.35) * 600 : 0), y: S.lerp(140, sy - 30, k1) - (u > 0.35 ? (u - 0.35) * 500 : 0) + Math.sin(u * 40) * 3 * (1 - k1), s: 1.2 });
          bee.flap(u * 10);
          bee.pollen.style.opacity = u < 0.34 ? 1 : 0;
          st.pol = u >= 0.34 ? 1 : 0;
          st.tube = S.smoothstep(0.45, 0.95, u);
        }, texts: [[0, '蜜蜂帶著花粉飛到花上……'], [0.36, '花粉落在柱頭上：授粉。'], [0.45, '花粉長出花粉管，穿過花柱……'], [0.95, '花粉管到達胚珠，精細胞和卵結合：受精。']] },
        wither: { dur: 3, fn(u) { st.wither = u; }, texts: [[0, '花瓣和雄蕊漸漸凋謝……'], [0.95, '花瓣、雄蕊掉落了，柱頭和花柱也枯萎了。']] },
        fruit: { dur: 3.5, fn(u) { st.fruit = u; }, texts: [[0, '子房漸漸膨大……'], [0.95, '子房長成了果實。']] },
        seed: { dur: 2.5, fn(u) { st.seed = S.smoothstep(0, 0.6, u) * (0.6 + 0.4 * Math.abs(Math.sin(u * 9))); }, texts: [[0, '看看果實的裡面……'], [0.95, '胚珠發育成種子。']] },
      };
      function play(kind, done) {
        const R = RUNS[kind];
        anim = { R, t: 0, done, ti: -1 };
        tick(0);
        drawMission(); syncFree();
      }
      function tick(dt) {
        if (!anim) return;
        const R = anim.R;
        anim.t = Math.min(R.dur, anim.t + dt);
        const u = anim.t / R.dur;
        R.fn(u);
        let ti = -1; R.texts.forEach(([f], i) => { if (u >= f) ti = i; });
        if (ti !== anim.ti) { anim.ti = ti; status(R.texts[ti][1]); }
        render();
        if (anim.t >= R.dur) { const d = anim.done; anim = null; d && d(); drawMission(); syncFree(); }
      }
      const loop = (ts) => { const dt = Math.min(0.1, last ? (ts - last) / 1000 : 0); last = ts; tick(dt); raf = requestAnimationFrame(loop); };
      const busy = () => !!anim;
      const status = (h) => { $('status').innerHTML = h; };

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = null, hintK = null;
      const first = [];
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? (first[k] ? 'ok' : 'miss') : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      function tapPart(k) {
        if (busy() || mi >= MISSIONS.length || done) return;
        const m = MISSIONS[mi];
        const oi = m.opts.findIndex(([kk]) => kk === k || (mi === 1 && k === 'anther' && kk === 'petal') || (mi === 1 && k === 'filament' && kk === 'petal'));
        if (oi < 0) { hintK = k; picked = null; drawMission(); return; }
        answer(oi);
      }
      function answer(oi) {
        const m = MISSIONS[mi];
        if (first[mi] === undefined) first[mi] = oi === m.ans;
        if (oi !== m.ans) { picked = oi; hintK = null; drawMission(); return; }
        picked = null; hintK = null;
        const k = mi;
        const key = m.opts[m.ans][0];
        play(m.run, () => {
          if (mi !== k) return;
          done = true;
          shown.add(key === 'petal' ? 'petal' : key);
          if (key === 'petal') shown.add('anther');
          sums[k].style.opacity = 1; stageTitle.style.opacity = 1;
          render();
        });
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          const ok = first.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <p class="m-text">第一次就答對 <b>${ok} / ${MISSIONS.length}</b> 題。</p>
            <div class="fb ok"><strong>花變成果實</strong>授粉：花粉落到柱頭上 → 花粉管到達胚珠，精細胞和卵結合（受精）。<br>花瓣、雄蕊凋謝；子房 → 果實；胚珠 → 種子；受精卵 → 胚。</div>
            <button class="ctl primary" type="button" id="labN2-again">再練習一次</button>`;
          mbox.querySelector('#labN2-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div><p class="m-text">${m.q}</p><p class="m-hint">點花的部位，或點下面的按鈕。</p>`;
        html += `<div class="opts">${m.opts.map(([k, s], i) => `<button class="opt ${done && i === m.ans ? 'right' : !done && i === picked ? 'wrong' : ''}" type="button" data-k="${i}" ${done || busy() ? 'disabled' : ''}>${s}</button>`).join('')}</div>`;
        if (!done && picked != null) html += `<div class="fb bad"><strong>再想想看</strong>${m.hints[m.opts[picked][0]] || '再想想看。'}</div>`;
        else if (!done && hintK) html += `<div class="fb bad"><strong>這是${NAME[hintK] || '這個部位'}</strong>再找找看其他的部位。</div>`;
        if (busy()) html += '<p class="m-hint">看看舞台上的變化……</p>';
        if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div><button class="ctl primary" type="button" id="labN2-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { if (!busy()) answer(+b.dataset.k); }));
        const nx = mbox.querySelector('#labN2-next');
        if (nx) nx.addEventListener('click', () => { mi++; done = false; picked = null; hintK = null; status(mi < MISSIONS.length ? '點選花的部位作答。' : '可以在「自由探索」拉動時間，重看整個過程。'); drawMission(); });
      }

      // ---------- 自由探索 ----------
      function fromSlider(t) {
        st.pol = t > 0.08 ? 1 : 0; st.tube = S.smoothstep(0.1, 0.28, t); st.wither = S.smoothstep(0.32, 0.48, t);
        st.fruit = S.smoothstep(0.5, 0.86, t); st.seed = S.smoothstep(0.88, 1, t);
        bee.style.opacity = 0;
        $('t-o').textContent = t < 0.08 ? '開花' : t < 0.3 ? '授粉、受精' : t < 0.5 ? '凋謝' : t < 0.88 ? '果實長大' : '種子';
        render();
      }
      $('t').addEventListener('input', () => { if (!busy()) fromSlider(+$('t').value / 100); });
      function syncFree() {
        $('t').disabled = busy();
        box.querySelectorAll('#labN2-lbl button').forEach((b) => b.setAttribute('aria-pressed', (b.dataset.v === '1') === (st.labels === 'all')));
      }
      box.querySelectorAll('#labN2-lbl button').forEach((b) => b.addEventListener('click', () => { st.labels = b.dataset.v === '1' ? 'all' : 'auto'; syncFree(); render(); }));

      function reset() {
        mi = 0; done = false; picked = null; hintK = null; first.length = 0; shown.clear();
        Object.assign(st, { pol: 0, tube: 0, wither: 0, fruit: 0, seed: 0, labels: 'auto' });
        sums.forEach((s) => { s.style.opacity = 0; }); stageTitle.style.opacity = 0;
        bee.style.opacity = 0; $('t').value = 0; $('t-o').textContent = '開花';
        $('free').open = false;
        status('點選花的部位作答。答對了，就會看到花的變化。');
        render(); drawMission(); syncFree();
      }
      reset();
      raf = requestAnimationFrame(loop);
      S._labN2 = { advance(sec) { for (let i = 0; i < sec * 30 && anim; i++) tick(1 / 30); }, tap: tapPart, get mission() { return mi; }, get busy() { return busy(); }, st }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); anim = null; delete S._labN2; } };
    },
  });
})();
