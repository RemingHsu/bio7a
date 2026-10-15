/* 互動模型：顯微鏡操作 — 換物鏡、粗／細調節輪、光圈、移動玻片（像會往反方向移）＋任務 */
(() => {
  const { el, g, text, C } = S;
  // 物鏡：倍率、視野直徑（μm，目鏡 10×）、景深造成的模糊係數、亮度係數
  const OBJ = [{ mag: 4, fov: 4500, blur: 0.35, light: 1 }, { mag: 10, fov: 1800, blur: 0.9, light: 0.85 }, { mag: 40, fov: 450, blur: 2.6, light: 0.55 }];
  const ZF = 50, CRASH = 55, ZMAX = 60; // 焦點位置、40× 會撞到玻片的高度、載物台最高
  const VC = { x: 860, y: 360, r: 300 };

  const MISSIONS = [
    { ctl: ['iris'], title: '調亮視野', text: '先把<b>光圈</b>打開，讓視野亮度達到 60% 以上。', done: (s) => s.bright >= 0.6,
      why: '光線不夠時看不清楚。光圈開大、光源調亮，進入視野的光就變多。' },
    { ctl: ['coarse', 'fine'], title: '用低倍對焦', text: '用<b>低倍物鏡</b>（4× 或 10×），轉<b>粗調節輪</b>再用<b>細調節輪</b>，把細胞看清楚。', done: (s) => s.obj < 2 && Math.abs(s.z - ZF) <= 1.5,
      why: '先用低倍：視野大、比較容易找到目標，物鏡也離玻片比較遠，不容易撞到。' },
    { ctl: ['pad'], title: '移到視野中央', text: '用<b>移動玻片</b>的按鈕，把藍色記號的細胞移到視野正中央。', done: (s) => s.targetDist <= 28 && s.obj < 2 && Math.abs(s.z - ZF) <= 3,
      why: '複式顯微鏡的像上下左右顛倒：像在左上方，玻片就要往左上方移。' },
    { ctl: ['obj', 'coarse', 'fine'], title: '換成 400 倍', text: '轉旋轉盤換成 <b>40× 物鏡</b>（總倍率 400 倍），只用<b>細調節輪</b>對焦。', done: (s) => s.obj === 2 && Math.abs(s.z - ZF) <= 0.6 && !s.crashed,
      why: '高倍物鏡較長、離玻片很近，只能用細調節輪微調，否則可能壓破玻片、損壞鏡頭。' },
    { ctl: ['iris'], title: '高倍也要夠亮', text: '換成高倍後視野變暗了。調整光圈，讓亮度回到 50% 以上。', done: (s) => s.obj === 2 && s.bright >= 0.5,
      why: '高倍時進入眼睛的光變少，所以視野變暗，要把光圈開大。' },
    { ctl: [], title: '想一想', quiz: { q: '用 100 倍看到一排 8 個細胞剛好排滿視野直徑。換成 400 倍，這一排大約能看到幾個？', opts: ['2 個', '4 個', '32 個'], ans: 0 },
      why: '倍率變成原來的 4 倍，視野直徑變成原來的 1/4，所以 8 ÷ 4 ＝ 2 個。（如果是整個視野塞滿細胞，面積變成 1/16。）' },
  ];

  S.registerLab({
    id: 'lab-microscope', section: '1-4', title: '顯微鏡操作',
    mount(box) {
      box.innerHTML = `
<style>
  .labM { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labM .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labM .pad { padding: 1rem 1.25rem; }
  .labM .pad-btns { display: grid; grid-template-columns: repeat(3, 2.6rem); grid-template-rows: repeat(3, 2.4rem); gap: 0.25rem; justify-content: start; }
  .labM .pad-btns button { padding: 0; justify-content: center; }
  @media (max-width: 900px) { .labM { grid-template-columns: 1fr; } }
</style>
<div class="labM">
  <div class="col">
    <div class="card">
      <div class="lab-stage"><svg viewBox="0 0 1200 720" tabindex="0" role="img" aria-label="顯微鏡與視野，可用方向鍵移動玻片"></svg></div>
      <div class="pad"><p class="status-line" id="labM-status"></p><p class="footnote">＊示意：視野大小以目鏡 10× 估算（40 倍約 4.5 mm、100 倍約 1.8 mm、400 倍約 0.45 mm）；不同顯微鏡會有差異。</p></div>
    </div>
  </div>
  <div class="col">
    <div class="card pad" id="labM-mission"></div>
    <div class="card pad">
      <div class="field" data-c="obj"><div class="field-head"><span>物鏡（轉動旋轉盤）</span><output id="labM-mag"></output></div>
        <div class="seg-ctl" role="group" aria-label="物鏡" id="labM-obj"><button type="button" data-v="0">4×</button><button type="button" data-v="1">10×</button><button type="button" data-v="2">40×</button></div></div>
      <div class="field" data-c="coarse"><div class="field-head"><label for="labM-coarse">粗調節輪（大幅升降載物台）</label><output id="labM-coarse-o"></output></div><input type="range" id="labM-coarse" min="0" max="${ZMAX}" step="1" value="20"></div>
      <div class="field" data-c="fine"><div class="field-head"><label for="labM-fine">細調節輪（微調）</label><output id="labM-fine-o"></output></div><input type="range" id="labM-fine" min="-3" max="3" step="0.05" value="0"></div>
      <div class="field" data-c="iris"><div class="field-head"><label for="labM-iris">光圈</label><output id="labM-iris-o"></output></div><input type="range" id="labM-iris" min="0" max="100" step="1" value="25"></div>
      <div class="field" data-c="pad"><div class="field-head"><span>移動玻片（從上方看玻片）</span></div>
        <div class="pad-btns">
          <span></span><button class="ctl small" type="button" data-d="0,-1" aria-label="玻片往上">↑</button><span></span>
          <button class="ctl small" type="button" data-d="-1,0" aria-label="玻片往左">←</button><span></span><button class="ctl small" type="button" data-d="1,0" aria-label="玻片往右">→</button>
          <span></span><button class="ctl small" type="button" data-d="0,1" aria-label="玻片往下">↓</button><span></span>
        </div></div>
      <dl class="readout" id="labM-read"></dl>
    </div>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labM-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 720, fill: C.bg }, svg);
      const root = g(svg);
      const defs = el('defs', {}, root);
      const filt = el('filter', { id: 'labMBlur', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
      const gb = el('feGaussianBlur', { stdDeviation: 0 }, filt);
      el('circle', { cx: VC.x, cy: VC.y, r: VC.r }, el('clipPath', { id: 'labMClip' }, defs));

      // 左：顯微鏡側面圖
      const msG = S.place(g(root), { x: 250, y: 660, s: 0.95 });
      const ms = S.drawMicroscope(msG);
      const glow = el('circle', { cx: 0, cy: -112, r: 26, fill: '#ffe9a8', opacity: 0 }, ms.root);
      ms.root.insertBefore(glow, ms.light.nextSibling);
      const crashMark = g(ms.root, { opacity: 0 });
      el('path', { d: 'M -30,-206 l 14,8 l 8,-10 l 12,9 l 10,-8 l 14,10', stroke: '#ff6b6b', 'stroke-width': 4, fill: 'none' }, crashMark);

      // 右：視野
      el('circle', { cx: VC.x, cy: VC.y, r: VC.r, fill: '#f3ecd6' }, root);
      const blurG = g(g(root, { 'clip-path': 'url(#labMClip)' }), { filter: 'url(#labMBlur)' });
      const spec = g(blurG);
      const rnd = S.rng(31);
      // 洋蔥表皮：每個細胞約 250 μm × 75 μm，樣本約 5 mm × 5 mm
      const CW = 250, CH = 75, NX = 20, NY = 66;
      for (let r = 0; r < NY; r++) for (let c = 0; c < NX; c++) {
        const x = -2500 + c * CW + (r % 2) * CW * 0.45 + (rnd() - 0.5) * 20, y = -2500 + r * CH;
        el('rect', { x, y, width: CW - 10, height: CH - 8, rx: 14, fill: '#ecd592', stroke: '#9a7a3a', 'stroke-width': 7 }, spec);
        el('ellipse', { cx: x + CW * (0.25 + rnd() * 0.5), cy: y + CH * 0.45, rx: 18, ry: 14, fill: '#8a5a20' }, spec);
      }
      // 藍色記號的細胞：在視野左上方
      const TGT = { x: 450, y: 450 };
      el('rect', { x: TGT.x - 120, y: TGT.y - 34, width: 240, height: 68, rx: 14, fill: 'rgba(80,140,255,0.55)', stroke: '#2a5fbf', 'stroke-width': 10 }, spec);
      const dark = el('circle', { cx: VC.x, cy: VC.y, r: VC.r, fill: '#000', opacity: 0.5, 'pointer-events': 'none' }, root);
      el('path', { d: `M ${VC.x - 16},${VC.y} H ${VC.x + 16} M ${VC.x},${VC.y - 16} V ${VC.y + 16}`, stroke: 'rgba(192,57,43,0.7)', 'stroke-width': 2 }, root);
      el('circle', { cx: VC.x, cy: VC.y, r: VC.r, fill: 'none', stroke: '#2b4252', 'stroke-width': 14 }, root);
      text(root, VC.x, 700, '從目鏡看到的視野', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle' });
      const warn = g(root, { opacity: 0 });
      el('rect', { x: 540, y: 300, width: 640, height: 120, rx: 16, fill: 'rgba(13,24,34,0.92)', stroke: '#ff6b6b', 'stroke-width': 3 }, warn);
      const warnT1 = text(warn, 860, 350, '', { 'font-size': 28, 'font-weight': 700, fill: '#ff8f8f', 'text-anchor': 'middle' });
      const warnT2 = text(warn, 860, 392, '', { 'font-size': 22, fill: C.ink, 'text-anchor': 'middle' });

      // ---------- 狀態 ----------
      const st = { obj: 0, coarse: 20, fine: 0, iris: 25, T: { x: 0, y: 0 }, crashed: false, coarseAtHigh: 0, z: 20, bright: 0, targetDist: 999 };
      let warnTimer = 0;
      const showWarn = (a, b, keep) => {
        warnT1.textContent = a; warnT2.textContent = b;
        gsap.to(warn, { opacity: 1, duration: 0.2 });
        clearTimeout(warnTimer);
        if (!keep) warnTimer = setTimeout(() => gsap.to(warn, { opacity: 0, duration: 0.4 }), 2600);
      };
      function update() {
        const o = OBJ[st.obj];
        st.z = Math.max(0, Math.min(ZMAX, st.coarse + st.fine));
        if (st.obj === 2 && st.z >= CRASH && !st.crashed) {
          st.crashed = true;
          showWarn('物鏡撞到玻片了！', '玻片可能破裂、鏡頭受損。點 4× 或 10× 換回低倍。', true);
        }
        const k = (2 * VC.r) / o.fov;
        spec.setAttribute('transform', `translate(${VC.x},${VC.y}) scale(${(-k).toFixed(4)}) translate(${st.T.x.toFixed(1)},${st.T.y.toFixed(1)})`);
        gb.setAttribute('stdDeviation', st.crashed ? 6 : Math.min(14, Math.abs(st.z - ZF) * o.blur).toFixed(2));
        st.bright = Math.max(0, Math.min(1, (0.15 + 0.85 * st.iris / 100) * o.light));
        dark.setAttribute('opacity', (0.9 * (1 - st.bright)).toFixed(3));
        // 目標在畫面上的位置（像旋轉 180°）
        const tx = VC.x - k * (TGT.x + st.T.x), ty = VC.y - k * (TGT.y + st.T.y);
        st.targetDist = Math.hypot(tx - VC.x, ty - VC.y);
        // 側面圖
        ms.turnTo(st.obj);
        ms.stageG.setAttribute('transform', `translate(0,${(-(st.z - ZF) * 1.1).toFixed(1)})`); // 載物台上下移動的距離（示意）：最低時也不碰到光源
        ms.coarse.setAttribute('transform', `rotate(${st.coarse * 6} 100 -252)`);
        ms.fine.setAttribute('transform', `rotate(${st.fine * 60} 100 -206)`);
        glow.setAttribute('opacity', (0.2 + 0.7 * st.iris / 100).toFixed(2));
        crashMark.setAttribute('opacity', st.crashed ? 1 : 0);
        // 讀數
        box.querySelectorAll('#labM-obj button').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.v === st.obj));
        $('mag').textContent = `10 × ${o.mag} ＝ ${10 * o.mag} 倍`;
        $('coarse-o').textContent = `高度 ${st.coarse}`;
        $('fine-o').textContent = (st.fine >= 0 ? '+' : '') + st.fine.toFixed(2);
        $('iris-o').textContent = `${st.iris}%`;
        const off = Math.abs(st.z - ZF) * o.blur;
        const focus = st.crashed ? '撞到玻片' : off < 0.8 ? '清楚' : off < 3 ? '有點模糊' : '很模糊';
        $('read').innerHTML = `<dt>總放大倍率</dt><dd>${10 * o.mag} 倍</dd><dt>視野寬約</dt><dd>${o.fov >= 1000 ? (o.fov / 1000).toFixed(1) + ' mm' : o.fov + ' μm'}</dd><dt>亮度</dt><dd>${Math.round(st.bright * 100)}%</dd><dt>影像</dt><dd>${focus}</dd>`;
        $('status').textContent = st.crashed ? '物鏡撞到玻片。請先換回低倍物鏡，再把載物台降低。'
          : st.obj === 2 ? '高倍：視野小、比較暗，只能用細調節輪。'
          : '低倍：視野大，先在這裡找到目標並對焦。';
        checkMission();
      }

      // ---------- 控制 ----------
      $('obj').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        const v = +b.dataset.v;
        if (v === 2 && st.coarse + st.fine >= CRASH) { st.obj = 2; update(); return; }
        if (v < 2 && st.crashed) { st.crashed = false; st.coarse = 25; st.fine = 0; $('coarse').value = 25; $('fine').value = 0; gsap.to(warn, { opacity: 0, duration: 0.3 }); }
        st.obj = v; update();
      });
      $('coarse').addEventListener('input', (e) => {
        if (st.obj === 2) {
          e.target.value = st.coarse; st.coarseAtHigh++;
          showWarn('高倍時不能用粗調節輪！', '40× 物鏡離玻片很近，請改用細調節輪微調。');
          return;
        }
        st.coarse = +e.target.value; update();
      });
      $('fine').addEventListener('input', (e) => { st.fine = +e.target.value; update(); });
      $('iris').addEventListener('input', (e) => { st.iris = +e.target.value; update(); });
      const move = (dx, dy) => { const step = OBJ[st.obj].fov * 0.06; st.T.x = S.clamp(st.T.x + dx * step, -2200, 2200); st.T.y = S.clamp(st.T.y + dy * step, -2200, 2200); update(); };
      box.querySelectorAll('.pad-btns button').forEach((b) => b.addEventListener('click', () => { const [dx, dy] = b.dataset.d.split(',').map(Number); move(dx, dy); }));
      svg.addEventListener('keydown', (e) => {
        const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
        if (d) { move(...d); e.preventDefault(); }
      });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1;
      const result = [];
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 跳著做任務：先把這個任務沒有顯示的旋鈕調到做得完的狀態（照順序做時不會改到）
      function prep(k) {
        const crashed = st.crashed;
        if (k <= 2 && st.obj === 2) { st.obj = 1; if (st.crashed) { st.crashed = false; st.coarse = 25; st.fine = 0; } } // 任務 1～3 要用低倍
        if ((k === 2 || (k === 3 && st.obj < 2)) && Math.abs(st.coarse + st.fine - ZF) > 3) { st.coarse = ZF; st.fine = 0; } // 任務 3、4 要先對好焦
        if (k === 4 && (st.obj !== 2 || st.crashed)) { st.obj = 2; st.crashed = false; st.coarse = ZF; st.fine = 0; } // 任務 5 要在高倍
        $('coarse').value = st.coarse; $('fine').value = st.fine;
        if (crashed && !st.crashed) gsap.to(warn, { opacity: 0, duration: 0.3 });
      }
      function goMission(k) {
        if (done) doneK.add(mi);
        mi = k; done = false; picked = -1; prep(k); drawMission(); update();
      }
      S.onDots(mbox, goMission);
      // 只顯示這個任務要用的旋鈕；做完全部任務後全部打開
      const showCtl = (keys) => box.querySelectorAll('[data-c]').forEach((f) => { f.hidden = keys ? !keys.includes(f.dataset.c) : false; });
      function drawMission() {
        if (mi >= MISSIONS.length) {
          showCtl(null);
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>操作重點</strong>先低倍、調亮、對焦 → 目標移到中央 → 換高倍只用細調節輪 → 視野變暗就開大光圈。<br>像在哪個方向，玻片就往哪個方向移。</div>
            ${st.coarseAtHigh ? `<p class="m-hint">這次在高倍時試著轉了 ${st.coarseAtHigh} 次粗調節輪，下次記得只用細調節輪。</p>` : ''}
            <button class="ctl primary" type="button" id="labM-again">再練習一次</button>`;
          mbox.querySelector('#labM-again').addEventListener('click', reset);
          return;
        }
        const m = MISSIONS[mi];
        showCtl(m.ctl);
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.quiz) {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>倍率變成原來的 4 倍時，視野的直徑會怎麼變？</div>`;
        } else html += `<p class="m-text">${m.text}</p>`;
        if (done) html += `<div class="fb ok"><strong>完成</strong>${m.why}</div><button class="ctl primary" type="button" id="labM-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        else if (!m.quiz) html += `<p class="m-hint">完成後會自動打勾。</p>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        const nx = mbox.querySelector('#labM-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done || m.quiz) return;
        if (m.done(st)) { done = true; drawMission(); }
      }
      function reset() {
        Object.assign(st, { obj: 0, coarse: 20, fine: 0, iris: 25, T: { x: 0, y: 0 }, crashed: false, coarseAtHigh: 0 });
        $('coarse').value = 20; $('fine').value = 0; $('iris').value = 25;
        mi = 0; done = false; picked = -1; doneK.clear();
        gsap.to(warn, { opacity: 0, duration: 0.2 });
        drawMission(); update();
      }

      // 接上次的進度：做完的任務打勾，從第一個還沒做的開始（goMission 會先把旋鈕調到做得完的狀態）
      const sv = S.progress.lab('lab-microscope');
      if (sv) [...sv.ok, ...sv.miss].forEach((k) => { if (k < MISSIONS.length) doneK.add(k); });
      let k0 = 0; while (k0 < MISSIONS.length && doneK.has(k0)) k0++;
      goMission(k0);
      S._labM = { st, update };
      return { unmount() { clearTimeout(warnTimer); delete S._labM; } };
    },
  });
})();
