/* 互動模型：生物放大作用 — 水 → 浮游植物 → 小魚 → 大魚 → 水鳥；預測哪一層最多 → 「吃！」 → 換成容易排出的物質 → 應用 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B6;
  const RED = '#ff5f74';
  // 每一層的代表個體（x：舞台上的位置）
  const LV = [
    { k: 'pp', name: '浮游植物', x: 180, mouth: [180, 336] },
    { k: 'sf', name: '小魚', x: 430, mouth: [490, 338] },
    { k: 'bf', name: '大魚', x: 708, mouth: [802, 338] },
    { k: 'bird', name: '水鳥', x: 1050, mouth: [1092, 134] },
  ];
  const SUB = { stay: '難分解、不易排出的物質', go: '容易分解或排出的物質' };
  const BY = 524, BR = 54; // 下方圓圈（每個個體體內的量）
  const START = 2; // 每個浮游植物從水中吸收的量＊

  const MISSIONS = [
    { title: '哪一種最多？', run: { sub: 'stay', n: 3 },
      predict: { q: '水中有一點點<b>難分解、不易排出</b>的有毒物質（例如 DDT）。經過食物鏈以後，哪一種生物體內的濃度會<b>最高</b>？點舞台上的生物或下面的按鈕預測：', opts: LV.map((l) => l.name), ans: 3 },
      text: '按「吃！」，看看有毒物質怎麼沿著食物鏈移動。',
      why: '每一層的消費者一生要吃下<b>許多</b>下一層的生物；這種物質難分解、不易排出，就留在體內越積越多。所以食物鏈<b>最上層的水鳥</b>濃度最高，這就是<b>生物放大作用</b>。' },
    { title: '換一種物質', run: { sub: 'go', n: 3 },
      predict: { q: '如果換成<b>容易被分解或排出</b>的物質，水鳥體內也會累積很多嗎？先預測：', opts: ['會，和剛才一樣越來越多', '不會，每一層都只留下一點點'], ans: 1 },
      text: '按「吃！」看看結果。',
      why: '容易分解或排出的物質，吃進去以後大部分很快就離開身體，每一層都只留下一點點，<b>不會</b>沿著食物鏈累積。會發生生物放大作用的，是<b>難分解、不易排出</b>的物質，例如 DDT、汞、鎘。' },
    { title: '生活中的應用', quiz: { q: '海洋中的汞會發生生物放大作用。下列哪一種魚，體內可能累積最多的汞？', opts: ['小型魚，例如沙丁魚', '大型的肉食性魚，例如鮪魚、旗魚、鯊魚', '每一種魚都差不多'], ans: 1, hint: '想一想：這種魚在食物鏈的哪一層？牠一生要吃下多少其他的魚？' },
      why: '鮪魚、旗魚、鯊魚是海洋食物鏈上層的大型魚，一生吃下大量的魚，體內的汞比較多。所以衛生單位建議孕婦和幼兒少吃或避免這類大型魚。人類也在食物鏈的上層，減少汙染物排放，就是保護自己。' },
  ];

  S.registerLab({
    id: 'lab-magnify', section: '下6-2', title: '生物放大作用',
    mount(box) {
      box.innerHTML = `
<style>
  .labS1 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labS1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labS1 .pad { padding: 1rem 1.25rem; }
  .labS1 .table-wrap { overflow-x: auto; }
  .labS1 .tbl { min-width: 22rem; }
  .labS1 .tbl td.max { color: var(--bad); font-weight: 700; }
  .labS1 .acts .ctl.eat { font-size: 1.25rem; }
  @media (max-width: 900px) {
    .labS1 { display: flex; flex-direction: column; align-items: stretch; }
    .labS1 .col { display: contents; }
    .labS1 .c-stage { order: 1; } .labS1 .c-mis { order: 2; } .labS1 .c-table { order: 3; } .labS1 .c-free { order: 4; }
  }
</style>
<div class="labS1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="食物鏈：水、浮游植物、小魚、大魚、水鳥，以及每個個體體內累積的有毒物質"></svg></div>
      <div class="pad">
        <p class="status-line" id="labS1-status" aria-live="polite"></p>
        <p class="footnote">＊示意：紅點的數量和倍數都是示意。每一層只畫一個代表的個體，假設牠吃下 3 個下一層的生物；真實的生物一生要吃下多得多。真實的 DDT 例子中，從水到吃魚的鳥，濃度可以相差數百萬倍以上（約）。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>結果紀錄（每個個體體內的量＊）</h3><div class="table-wrap" id="labS1-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labS1-mission"></div>
    <details class="card pad free c-free" id="labS1-free"><summary>自由探索：自己選物質和吃的數量</summary>
      <div class="field"><div class="field-head"><span>水中的有毒物質</span></div>
        <div class="seg-ctl" role="group" aria-label="物質" id="labS1-sub">${Object.entries(SUB).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>每個消費者吃下幾個下一層的生物＊</span></div>
        <div class="seg-ctl" role="group" aria-label="吃下的數量" id="labS1-n">${[2, 3, 4].map((n) => `<button type="button" data-v="${n}">${n} 個</button>`).join('')}</div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labS1-go">吃！</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labS1-' + id);
      const svg = box.querySelector('svg');
      const at = (p, x, y, s = 1) => S.place(g(p), { x, y, s });
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      // ---------- 背景：天空、湖水、岸邊 ----------
      el('rect', { x: 0, y: 0, width: 1200, height: 262, fill: B.grad(root, [[0, '#13283c'], [1, '#1f3f58']]) }, root);
      el('rect', { x: 0, y: 262, width: 980, height: 358, fill: B.grad(root, [[0, '#2a6a9a'], [1, '#143a5a']]) }, root);
      el('path', { d: 'M 0,262 ' + Array.from({ length: 24 }, () => 'q 20,-6 40,0').join(' ') + ' L 980,262', fill: 'none', stroke: '#9cd0f0', 'stroke-width': 2.5 }, root);
      el('path', { d: 'M 940,620 L 952,284 C 980,272 1010,268 1200,268 L 1200,620 Z', fill: '#4a5a36' }, root);
      [[1000, 272], [1018, 270], [1150, 270], [1170, 270]].forEach(([x, y], i) => { [-6, 0, 7].forEach((dx, k) => el('path', { d: `M ${x + dx},${y} C ${x + dx * 1.5},${y - 30} ${x + dx * 2},${y - 50} ${x + dx * 2.6},${y - 64 - k * 8}`, fill: 'none', stroke: '#7a9a46', 'stroke-width': 3, 'stroke-linecap': 'round' }, root)); });
      [[180, 96, 1], [560, 70, 0.8], [800, 130, 0.6]].forEach(([x, y, k]) => { const q = at(root, x, y, k); [[-40, 6, 26], [-12, -10, 32], [22, -4, 28], [44, 8, 20], [0, 12, 26]].forEach(([dx, dy, r]) => el('circle', { cx: dx, cy: dy, r, fill: '#2c4a62' }, q)); });
      // 水中的少量有毒物質
      const rw = S.rng(3);
      const waterDots = [];
      for (let i = 0; i < 9; i++) waterDots.push([30 + rw() * 900, 282 + rw() * 126]);
      waterDots.forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4, fill: RED, opacity: 0.85 }, root));
      text(root, 20, 248, '水中：有毒物質的濃度很低', { 'font-size': 22, fill: '#cfe8ff' });
      // ---------- 生物 ----------
      const orgs = LV.map((l) => {
        const q = g(root, { style: 'cursor:pointer' });
        if (l.k === 'pp') [[-40, 342, 0], [6, 314, 1], [40, 356, 2]].forEach(([dx, y, k]) => B.plankton(at(q, l.x + dx, y, 2.2), k));
        if (l.k === 'sf') B.smallFish(at(q, l.x, 336, 0.62));
        if (l.k === 'bf') B.bigFish(at(q, l.x, 336, 0.95));
        if (l.k === 'bird') B.wader(at(q, l.x, 203, 0.46));
        el('rect', { x: l.x - 110, y: l.k === 'bird' ? 100 : 280, width: 220, height: l.k === 'bird' ? 360 : 180, fill: 'transparent' }, q);
        text(q, l.x, 446, l.name, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
        return q;
      });
      const ring = el('rect', { x: 0, y: 0, width: 220, height: 0, rx: 18, fill: 'none', stroke: C.hi, 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: 0 }, root);
      const eatLbl = [0, 1, 2].map((i) => {
        const [x1, x2] = [[262, 340], [512, 600], [820, 960]][i], y = 306;
        el('line', { x1, y1: y, x2: x2 - 10, y2: y, stroke: C.ink2, 'stroke-width': 3 }, root);
        el('path', { d: `M ${x2},${y} l -14,-8 l 0,16 Z`, fill: C.ink2 }, root);
        // 第三段：字放大後會碰到水鳥的虛線框，往左挪一點；字加一圈水色描邊，預測時的虛線框穿過字的地方會被蓋住
        return text(root, i === 2 ? 878 : (x1 + x2) / 2, y - 12, '', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2, stroke: '#27648f', 'stroke-width': 6, 'stroke-linejoin': 'round', 'paint-order': 'stroke' });
      });
      // ---------- 下方：每個個體體內的量 ----------
      const badges = LV.map((l) => {
        const q = g(root);
        el('circle', { cx: l.x, cy: BY, r: BR, fill: 'rgba(13,24,34,0.88)', stroke: '#4a6272', 'stroke-width': 2 }, q);
        q.dots = g(q);
        q.num = text(q, l.x, BY + BR + 30, '', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ff8f9a' });
        q.hl = el('circle', { cx: l.x, cy: BY, r: BR + 6, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, q);
        return q;
      });
      const outLbl = text(root, 560, 150, '', { 'font-size': 24, 'text-anchor': 'middle', fill: '#ffcf9a' });
      // 圓圈裡的位置（固定的亂數，數量多時點變小）
      const spots = (i, n) => {
        const r = S.rng(11 + i * 7), out = [], R2 = BR - 9;
        while (out.length < n) { const dx = (r() * 2 - 1) * R2, dy = (r() * 2 - 1) * R2; if (dx * dx + dy * dy <= R2 * R2) out.push([LV[i].x + dx, BY + dy]); }
        return out;
      };
      const dotR = (n) => S.clamp(6 - n / 22, 2.6, 6);

      const st = { sub: 'stay', n: 3 };
      const R = []; // 紀錄
      let tl = null, busy = false, counts = [0, 0, 0, 0];

      function clearStage() {
        if (tl) tl.kill();
        badges.forEach((b) => { b.dots.innerHTML = ''; b.num.textContent = ''; b.hl.setAttribute('opacity', 0); });
        root.querySelectorAll('.labS1-fly').forEach((e) => e.remove());
        outLbl.textContent = '';
        counts = [0, 0, 0, 0];
      }
      const ghost = (i, s) => {
        const q = g(root, { class: 'labS1-fly', opacity: 0 });
        const inner = g(q);
        if (i === 0) B.plankton(inner, 1);
        if (i === 1) B.smallFish(inner);
        if (i === 2) B.bigFish(inner);
        q.s = s;
        return q;
      };

      function run() {
        clearStage();
        busy = true; sync(); drawMission();
        const { sub, n } = st;
        const keep = (k, eaten) => (sub === 'stay' ? eaten : START);
        counts[0] = START;
        for (let k = 1; k < 4; k++) counts[k] = keep(k, counts[k - 1] * n);
        eatLbl.forEach((t) => { t.textContent = `吃 ${n} 個＊`; });
        $('status').innerHTML = sub === 'stay' ? '有毒物質（難分解、不易排出）沿著食物鏈移動中……' : '有毒物質（容易分解或排出）沿著食物鏈移動中……';
        tl = gsap.timeline({ onComplete: finish });
        // 1. 浮游植物從水中吸收
        const P0 = spots(0, counts[0]);
        P0.forEach(([x, y], j) => {
          const [sx, sy] = waterDots[j % waterDots.length];
          const d = el('circle', { cx: sx, cy: sy, r: dotR(counts[0]), fill: RED }, badges[0].dots);
          tl.fromTo(d, { attr: { cx: sx, cy: sy } }, { attr: { cx: x, cy: y }, duration: 0.9, ease: 'power1.inOut' }, 0.2 + j * 0.1);
        });
        tl.call(() => { badges[0].num.textContent = `${counts[0]}＊`; });
        // 2. 每一層吃下 n 個下一層的生物
        let prev = P0;
        for (let k = 1; k < 4; k++) {
          const t0 = tl.duration() + 0.3;
          const from = LV[k - 1], to = LV[k];
          for (let j = 0; j < n; j++) {
            const gq = ghost(k - 1, k - 1 === 0 ? 1.6 : k - 1 === 1 ? 0.42 : 0.6);
            const o = { u: 0 }, sx = from.x + (j - (n - 1) / 2) * 30, sy = 336;
            tl.set(gq, { opacity: 1 }, t0 + j * 0.25);
            tl.to(o, { u: 1, duration: 0.9, ease: 'power1.in', onUpdate: () => S.place(gq, { x: S.lerp(sx, to.mouth[0], o.u), y: S.lerp(sy + (j - 1) * 10, to.mouth[1], o.u), s: gq.s * (1 - o.u * 0.5) }) }, t0 + j * 0.25);
            tl.set(gq, { opacity: 0 }, t0 + j * 0.25 + 0.9);
          }
          const eaten = counts[k - 1] * n, tgt = spots(k, eaten), t1 = t0 + 0.4 + n * 0.25;
          const dots = [];
          for (let j = 0; j < eaten; j++) {
            const [sx, sy] = prev[j % prev.length];
            const d = el('circle', { cx: sx, cy: sy, r: dotR(eaten), fill: RED, opacity: 0 }, badges[k].dots);
            dots.push(d);
            tl.set(d, { opacity: 1 }, t1);
            tl.fromTo(d, { attr: { cx: sx, cy: sy } }, { attr: { cx: tgt[j][0], cy: tgt[j][1] }, duration: 0.9, ease: 'power1.inOut', immediateRender: false }, t1 + (j % 9) * 0.03);
          }
          if (sub === 'go') { // 大部分被分解或排出
            const t2 = t1 + 1.3;
            tl.call(() => { outLbl.textContent = '大部分被分解或排出體外'; }, null, t2);
            dots.slice(counts[k]).forEach((d, j) => tl.to(d, { attr: { cy: BY + BR + 40 }, opacity: 0, duration: 0.7, ease: 'power1.in' }, t2 + (j % 6) * 0.04));
            const keepPts = spots(k, counts[k]);
            dots.slice(0, counts[k]).forEach((d, j) => tl.to(d, { attr: { cx: keepPts[j][0], cy: keepPts[j][1], r: dotR(counts[k]) }, duration: 0.5 }, t2));
            prev = keepPts;
          } else prev = tgt;
          tl.call(() => { badges[k].num.textContent = `${counts[k]}＊`; }, null, '+=0.1');
        }
      }

      function finish() {
        busy = false;
        const mx = Math.max(...counts), top = counts.indexOf(mx);
        if (st.sub === 'stay') badges[top].hl.setAttribute('opacity', 1);
        outLbl.textContent = '';
        R.push({ sub: st.sub, n: st.n, c: counts.slice() });
        $('status').innerHTML = st.sub === 'stay'
          ? `每一層都吃下好幾個下一層的生物，有毒物質難分解、不易排出，就越積越多：水鳥體內最多（${counts[3]}＊），是浮游植物的 ${counts[3] / counts[0]} 倍＊。`
          : '這種物質吃進去以後，大部分被分解或排出，每一層都只留下一點點，<b>沒有</b>越積越多。';
        table(); checkMission(); drawMission(); sync();
      }

      function table() {
        if (!R.length) { $('table').innerHTML = '<p class="m-hint">按「吃！」之後，結果會列在這裡。</p>'; return; }
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>物質</th><th>吃幾個＊</th>${LV.map((l) => `<th>${l.name}</th>`).join('')}</tr></thead><tbody>${R.map((r) => { const mx = Math.max(...r.c); return `<tr><th>${r.sub === 'stay' ? '難分解' : '易排出'}</th><td>${r.n}</td>${r.c.map((v) => `<td class="${r.sub === 'stay' && v === mx ? 'max' : ''}">${v}</td>`).join('')}</tr>`; }).join('')}</tbody></table>`;
      }

      // ---------- 自由探索 ----------
      function sync() {
        box.querySelectorAll('#labS1-sub button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === st.sub); b.disabled = busy; });
        box.querySelectorAll('#labS1-n button').forEach((b) => { b.setAttribute('aria-pressed', +b.dataset.v === st.n); b.disabled = busy; });
        $('go').disabled = busy;
      }
      box.querySelectorAll('#labS1-sub button').forEach((b) => b.addEventListener('click', () => { st.sub = b.dataset.v; sync(); }));
      box.querySelectorAll('#labS1-n button').forEach((b) => b.addEventListener('click', () => { st.n = +b.dataset.v; sync(); }));
      $('go').addEventListener('click', () => { if (!busy) run(); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, ranHere = false;
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? 'ok' : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      const showRing = (i) => {
        if (i < 0) { ring.setAttribute('opacity', 0); return; }
        const l = LV[i], bird = l.k === 'bird';
        ring.setAttribute('x', l.x - 110); ring.setAttribute('y', bird ? 116 : 274); ring.setAttribute('height', bird ? 348 : 190); ring.setAttribute('opacity', 1);
      };
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>重點</strong>難分解、不易排出的物質（例如 DDT、汞、鎘）會沿著食物鏈一層層累積，食物鏈越上層，體內濃度越高：<b>生物放大作用</b>。容易分解或排出的物質不會這樣累積。</div>
            <button class="ctl primary" type="button" id="labS1-again">再練習一次</button>`;
          mbox.querySelector('#labS1-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (pred >= 0 && !done) html += `<p class="m-text">${m.text}</p><div class="acts"><button class="ctl primary eat" type="button" id="labS1-eat" ${busy ? 'disabled' : ''}>${busy ? '吃吃吃……' : '吃！'}</button></div>`;
          if (done) html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labS1-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => choose(+b.dataset.p)));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        const eat = mbox.querySelector('#labS1-eat');
        if (eat) eat.addEventListener('click', () => { if (busy) return; Object.assign(st, m.run); ranHere = true; run(); });
        const nx = mbox.querySelector('#labS1-next');
        if (nx) nx.addEventListener('click', () => { mi++; done = false; picked = -1; pred = -1; ranHere = false; showRing(-1); prep(); drawMission(); });
      }
      function choose(k) {
        const m = MISSIONS[mi];
        if (!m || !m.predict || pred >= 0 || busy) return;
        pred = k;
        if (mi === 0) showRing(k);
        drawMission();
      }
      // 點舞台上的生物也可以預測（第一個任務）
      orgs.forEach((q, i) => q.addEventListener('click', () => { if (mi === 0) choose(i); }));
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done || !m.predict || pred < 0 || !ranHere) return;
        done = true;
      }
      // 每個任務開始時自動設定
      function prep() {
        const m = MISSIONS[mi];
        if (m && m.run) { Object.assign(st, m.run); clearStage(); eatLbl.forEach((t) => { t.textContent = `吃 ${st.n} 個＊`; }); $('status').innerHTML = m.run.sub === 'stay' ? '水中有一點點<b>難分解、不易排出</b>的有毒物質。' : '這次水中的有毒物質<b>容易被分解或排出</b>。'; }
        sync();
      }
      function reset() {
        clearStage();
        R.length = 0;
        mi = 0; done = false; picked = -1; pred = -1; ranHere = false;
        showRing(-1);
        $('free').open = false;
        prep(); table(); drawMission();
      }

      reset();
      S._labS1 = { st, run, skip() { if (tl) tl.progress(1); }, get counts() { return counts.slice(); }, choose };
      return { unmount() { if (tl) tl.kill(); delete S._labS1; } };
    },
  });
})();
