/* 互動模型（七下 1-1）：染色體數目追蹤 — 2 對染色體的細胞：細胞分裂 → 減數分裂 → 受精 → 換成人的數字 → 判斷哪個過程使數目減半。
   點選預測就開始動畫。染色體、細胞的畫法來自 scene-division.js（S.b1）。 */
(() => {
  const { el, g, text, C } = S;
  const SEC = { mit: 6.5, mei: 9, fert: 5.5, human: 5 }; // 動畫長度（秒）

  const MISSIONS = [
    { title: '細胞分裂', run: 'mit', q: '這個細胞有 <b>4 條</b>染色體（2 對）。進行<b>細胞分裂</b>後，每個子細胞有幾條？', opts: ['2 條', '4 條', '8 條'], ans: 1, res: '4 條',
      why: '染色體先<b>複製一次</b>，再平均分到兩個子細胞，所以每個子細胞仍有 <b>4 條（2 對）</b>，和原來的細胞相同。' },
    { title: '減數分裂', run: 'mei', q: '一樣有 4 條染色體的生殖母細胞，進行<b>減數分裂</b>產生精子或卵。每個精子或卵有幾條？', opts: ['1 條', '2 條', '4 條'], ans: 1, res: '2 條',
      why: '染色體複製一次、細胞<b>連續分裂兩次</b>。第一次分裂時<b>同源染色體分開</b>，所以每個子細胞只有每對中的一條，共 <b>2 條</b>（單套，n），是原來的一半。' },
    { title: '受精', run: 'fert', q: '精子有 2 條、卵有 2 條染色體。受精後，<b>受精卵</b>有幾條？', opts: ['2 條', '4 條', '8 條'], ans: 1, res: '4 條',
      why: '精子和卵的染色體合在一起，受精卵有 <b>4 條</b>，又恢復<b>成對</b>：每一對中，一條來自父方（精子）、一條來自母方（卵）。' },
    { title: '換成人', run: 'human', q: '人的體細胞有 <b>46 條</b>染色體（23 對）。精子有幾條？', opts: ['23 條', '46 條', '92 條'], ans: 0, res: '23 條',
      why: '減數分裂使染色體數目減半，精子和卵各有 <b>23 條</b>；受精後，受精卵恢復成 46 條（23 對）。' },
    { title: '哪個過程使數目減半？', quiz: { q: '下列哪一個過程，會使細胞的染色體數目<b>減半</b>？', opts: ['細胞分裂', '減數分裂', '受精'], ans: 1, hint: '回想剛才的動畫：哪一個過程產生的細胞，每一對染色體只剩一條？' },
      why: '<b>減數分裂</b>使染色體數目減半（2n → n）；<b>受精</b>使數目恢復（n ＋ n → 2n）；<b>細胞分裂</b>前後數目不變。' },
  ];
  const RUN_NAME = { mit: '細胞分裂', mei: '減數分裂', fert: '受精', human: '人的減數分裂' };
  const PH = {
    mit: (n) => ['染色體複製一次……', '複製的染色體排列在細胞中央……', '複製的染色體分開，移向兩邊……', '細胞分成兩個子細胞……', `完成：每個子細胞都有 ${n * 2} 條染色體，和原來相同。`],
    mei: (n) => ['染色體複製一次……', '同源染色體配對……', '第一次分裂：同源染色體分開……', '第二次分裂：複製的染色體分開……', `完成：4 個子細胞，每個有 ${n} 條染色體（原來的一半）。`],
  };

  S.registerLab({
    id: 'lab-division', section: '下1-1', title: '染色體數目追蹤',
    mount(box) {
      box.innerHTML = `
<style>
  .labN1 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labN1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labN1 .pad { padding: 1rem 1.25rem; }
  .labN1 .opt:disabled { cursor: default; }
  .labN1 .table-wrap { overflow-x: auto; }
  .labN1 .tbl { min-width: 20rem; }
  @media (max-width: 900px) {
    .labN1 { display: flex; flex-direction: column; align-items: stretch; }
    .labN1 .col { display: contents; }
    .labN1 .c-stage { order: 1; } .labN1 .c-mis { order: 2; } .labN1 .c-table { order: 3; } .labN1 .c-ctl { order: 4; }
  }
</style>
<div class="labN1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="細胞中的染色體：藍色來自父方、粉紅色來自母方"></svg></div>
      <div class="pad">
        <p class="status-line" id="labN1-status" aria-live="polite"></p>
        <p class="footnote" id="labN1-note">＊示意：以 2 對染色體為例，藍色來自父方、粉紅色來自母方；畫出的是濃縮成棒狀的染色體。精子畫得比實際大很多。動畫的快慢是示意，不是真實時間。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>紀錄</h3><div class="table-wrap" id="labN1-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labN1-mission"></div>
    <details class="card pad free c-ctl" id="labN1-free"><summary>自由探索：自己選過程</summary>
      <div class="field"><div class="field-head"><span>染色體的對數</span></div>
        <div class="seg-ctl" role="group" aria-label="染色體的對數" id="labN1-np"><button type="button" data-v="2">2 對（4 條）</button><button type="button" data-v="3">3 對（6 條）</button></div></div>
      <div class="btn-row"><button class="ctl primary" type="button" data-r="mit">細胞分裂</button><button class="ctl primary" type="button" data-r="mei">減數分裂</button><button class="ctl primary" type="button" data-r="fert">受精</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labN1-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const B1 = S.b1;
      const legend = g(svg);
      [[40, B1.FA, '來自父方'], [200, B1.MO, '來自母方']].forEach(([x, c, s]) => { S.place(B1.rod(legend, 30, c, 11), { x, y: 584 }); text(legend, x + 16, 592, s, { 'font-size': 22, fill: c }); });
      let np = 2, scene = null, anim = null;
      const runs = [];

      // ---------- 每一種過程的畫面 ----------
      const PAIRS = { 2: [84, 48], 3: [80, 62, 44] };
      const lbl = (p, x, y, s, extra = {}) => text(p, x, y, s, { 'font-size': 28, 'font-weight': 700, fill: C.hi, 'text-anchor': 'middle', ...extra });
      function build(kind) {
        root.innerHTML = '';
        const p = g(root), top = g(root);
        if (kind === 'mit') {
          const m = B1.mitosis(p, { cx: 600, cy: 300, R: 160, D: 165, r2: 140, pairs: PAIRS[np], W: 15 });
          const before = lbl(top, 600, 512, `母細胞：${np * 2} 條（${np} 對）`, { fill: C.ink });
          const after = g(top, { opacity: 0 });
          [435, 765].forEach((x) => lbl(after, x, 498, `${np * 2} 條`));
          return { dur: SEC.mit, set(u) { m.set(u); before.style.opacity = 1 - S.smoothstep(0.42, 0.5, u); after.style.opacity = S.smoothstep(0.95, 1, u); }, phase: m.phase, texts: PH.mit(np), result: `${np * 2} 條` };
        }
        if (kind === 'mei') {
          const m = B1.meiosis(p, { cx: 600, cy: 300, R0: 140, D1: 128, R1: 112, D2: 118, R2: 98, pairs: PAIRS[np], W: 15 });
          const before = lbl(top, 790, 309, `${np * 2} 條（${np} 對）`, { fill: C.ink, 'text-anchor': 'start' });
          const after = g(top, { opacity: 0 });
          m.centers.forEach(([x, y]) => lbl(after, x < 600 ? x - 112 : x + 112, y + 10, `${np} 條`, { 'text-anchor': x < 600 ? 'end' : 'start' }));
          text(after, 600, 590, '精子或卵（單套 n）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
          return { dur: SEC.mei, set(u) { m.set(u); before.style.opacity = 1 - S.smoothstep(0.26, 0.32, u); after.style.opacity = S.smoothstep(0.95, 1, u); }, phase: m.phase, texts: PH.mei(np), result: `${np} 條` };
        }
        if (kind === 'fert') return buildFert(p, top);
        return buildHuman(p, top);
      }

      // 受精：精子游到卵，父方的染色體進入卵，和母方的配成對
      function buildFert(p, top) {
        const EX = 700, EY = 300, ER = 160;
        B1.egg(p, EX, EY, ER);
        const nuc = el('circle', { cx: EX, cy: EY, r: 92, fill: 'rgba(255,125,154,0.08)', stroke: B1.MO, 'stroke-width': 2.5, 'stroke-dasharray': '10 6' }, p);
        const zn = el('circle', { cx: EX, cy: EY, r: 92, fill: 'rgba(167,150,255,0.12)', stroke: C.nucleus, 'stroke-width': 3, opacity: 0 }, p);
        const L = PAIRS[np], Px = 56;
        const mom = L.map((l) => B1.chromo(p, l, B1.MO, 15));
        const sp = B1.sperm(p, { s: 1.15 });
        const dad = L.map((l) => B1.chromo(p, l, B1.FA, 15));
        const eggL = lbl(top, EX, 106, `卵：${np} 條`, { fill: B1.MO });
        const spL = lbl(top, 190, 220, `精子：${np} 條`, { fill: B1.FA });
        const after = g(top, { opacity: 0 });
        lbl(after, EX, 520, `受精卵：${np * 2} 條（${np} 對）`);
        const px = (k) => EX + (k - (L.length - 1) / 2) * Px;
        return {
          dur: SEC.fert, texts: ['精子游向卵……', '精子進入卵……', '父方和母方的染色體配成對……', '完成：受精卵的染色體又成對了。'],
          phase: (u) => (u < 0.4 ? 0 : u < 0.55 ? 1 : u < 0.97 ? 2 : 3), result: `${np * 2} 條`,
          set(u) {
            const sw = S.smoothstep(0, 0.4, u), inn = S.smoothstep(0.4, 0.55, u), pr = S.smoothstep(0.55, 0.9, u);
            const hx = S.lerp(160, EX - ER - 6, sw) + inn * 40, hy = S.lerp(330, EY, sw);
            S.place(sp, { x: hx, y: hy, r: 10 * (1 - sw) });
            sp.wiggle(u * 40);
            sp.style.opacity = 1 - S.smoothstep(0.5, 0.62, u);
            mom.forEach((o, k) => B1.xPose(o, S.lerp(px(k) + 8, px(k) + 12, pr), EY, 0, 0));
            dad.forEach((o, k) => {
              const s = S.lerp(0.32, 1, S.smoothstep(0.45, 0.75, u));
              const x0 = hx + 2 + (k - (L.length - 1) / 2) * 12, x1 = px(k) - 12;
              const t = S.smoothstep(0.5, 0.9, u);
              B1.xPose(o, S.lerp(x0, x1, t), S.lerp(hy, EY, t), 0, 0, s);
              o.g.style.opacity = u < 0.02 ? 0 : 1;
            });
            nuc.style.opacity = 1 - S.smoothstep(0.85, 0.95, u);
            zn.style.opacity = S.smoothstep(0.88, 0.98, u);
            eggL.style.opacity = spL.style.opacity = 1 - S.smoothstep(0.85, 0.95, u);
            after.style.opacity = S.smoothstep(0.95, 1, u);
          },
        };
      }

      // 人：46 條的生殖母細胞經減數分裂，形成 23 條的精子
      function buildHuman(p, top) {
        const cell = g(p);
        el('circle', { cx: 230, cy: 300, r: 130, fill: '#11262e', stroke: C.membrane, 'stroke-width': 4 }, cell);
        el('circle', { cx: 230, cy: 300, r: 80, fill: 'rgba(167,150,255,0.12)', stroke: C.nucleus, 'stroke-width': 2.5, 'stroke-dasharray': '10 6' }, cell);
        lbl(cell, 230, 296, '46 條', { fill: C.ink, 'font-size': 34 });
        text(cell, 230, 330, '（23 對）', { 'font-size': 22, fill: C.ink2, 'text-anchor': 'middle' });
        text(cell, 230, 474, '生殖母細胞（在睪丸中）', { 'font-size': 22, fill: C.ink2, 'text-anchor': 'middle' });
        const arr = g(p, { opacity: 0 });
        el('line', { x1: 390, y1: 300, x2: 560, y2: 300, stroke: C.ink2, 'stroke-width': 5 }, arr);
        el('path', { d: 'M 576,300 l -20,-12 l 0,24 Z', fill: C.ink2 }, arr);
        text(arr, 476, 280, '減數分裂', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
        const sps = [130, 250, 370, 490].map((y) => {
          const sg = g(p, { opacity: 0 });
          const s = B1.sperm(sg, { s: 1.05 });
          S.place(s, { x: 720, y });
          const t = text(sg, 820, y + 10, '？', { 'font-size': 30, 'font-weight': 700, fill: C.hi });
          return { sg, s, t };
        });
        return {
          dur: SEC.human, texts: ['生殖母細胞進行減數分裂……', '形成精子……', '完成：每個精子有 23 條染色體。'],
          phase: (u) => (u < 0.3 ? 0 : u < 0.97 ? 1 : 2), result: '23 條',
          set(u) {
            arr.style.opacity = S.smoothstep(0.05, 0.25, u);
            sps.forEach(({ sg, s, t }, i) => {
              sg.style.opacity = S.smoothstep(0.3 + i * 0.1, 0.42 + i * 0.1, u);
              s.wiggle(u * 30 + i);
              t.textContent = u >= 0.97 ? '23 條' : '？';
            });
          },
        };
      }

      // ---------- 動畫迴圈（分頁隱藏時 rAF 會暫停，測試用 advance） ----------
      let raf = 0, last = 0, lastPh = -1;
      const NOTE = (n) => `＊示意：${kind0() === 'human' ? '人的體細胞有 23 對染色體，這裡只寫出數目' : `以 ${n} 對染色體為例`}，藍色來自父方、粉紅色來自母方；畫出的是濃縮成棒狀的染色體。精子畫得比實際大很多。動畫的快慢是示意，不是真實時間。`;
      let curKind = 'mit';
      const kind0 = () => curKind;
      const setNote = () => { $('note').textContent = NOTE(np); };
      function play(kind, onDone) {
        curKind = kind; setNote();
        scene = build(kind);
        anim = { t: 0, onDone };
        lastPh = -1;
        tick(0);
        drawMission(); syncFree();
      }
      function tick(dt) {
        if (!anim || !scene) return;
        anim.t = Math.min(scene.dur, anim.t + dt);
        const u = anim.t / scene.dur;
        scene.set(u);
        const ph = scene.phase(u);
        if (ph !== lastPh) { lastPh = ph; status(scene.texts[ph]); }
        if (anim.t >= scene.dur) { const d = anim.onDone; anim = null; d && d(); drawMission(); syncFree(); }
      }
      const loop = (ts) => { const dt = Math.min(0.1, last ? (ts - last) / 1000 : 0); last = ts; tick(dt); raf = requestAnimationFrame(loop); };
      const busy = () => !!anim;

      const status = (h) => { $('status').innerHTML = h; };
      function log() {
        if (!runs.length) { $('log').innerHTML = '<p class="m-hint">每做完一次，結果會列在這裡。</p>'; return; }
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>過程</th><th>你的預測</th><th>結果</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.name}</td><td>${r.pred || '—'}</td><td>${r.res}</td></tr>`).join('')}</tbody></table>`;
      }

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, pred = -1, picked = -1;
      const first = [];
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? (first[k] ? 'ok' : 'miss') : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      function drawMission() {
        if (mi >= MISSIONS.length) {
          const ok = first.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <p class="m-text">第一次就答對 <b>${ok} / ${MISSIONS.length}</b> 題。</p>
            <div class="fb ok"><strong>染色體數目的變化</strong>細胞分裂：2n → 2n（數目不變）。<br>減數分裂：2n → n（數目減半，產生精子和卵）。<br>受精：n ＋ n → 2n（恢復成對）。人：46 → 23 → 46。</div>
            <button class="ctl primary" type="button" id="labN1-again">再練習一次</button>`;
          mbox.querySelector('#labN1-again').addEventListener('click', reset);
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
          html += `<p class="m-text">${m.q}</p><p class="m-hint">點選你的預測，就會開始動畫。</p><div class="opts">${m.opts.map((o, k) => {
            const cls = done ? (k === m.ans ? 'right' : k === pred ? 'wrong' : '') : '';
            return `<button class="opt ${cls}" type="button" data-p="${k}" aria-pressed="${k === pred}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`;
          }).join('')}</div>`;
          if (pred >= 0 && !done) html += '<p class="m-hint">看看舞台上的變化……</p>';
          if (done) html += `<div class="fb ${pred === m.ans ? 'ok' : 'bad'}"><strong>${pred === m.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labN1-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p;
          first[mi] = pred === m.ans;
          const k = mi;
          np = 2;
          play(m.run, () => {
            runs.push({ name: RUN_NAME[m.run], pred: m.opts[pred], res: scene.result });
            log();
            if (mi === k) done = true;
          });
        }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (first[mi] === undefined) first[mi] = k === m.quiz.ans;
          if (k === m.quiz.ans) done = true; else picked = k;
          drawMission();
        }));
        const nx = mbox.querySelector('#labN1-next');
        if (nx) nx.addEventListener('click', () => { mi++; enter(); });
      }
      function enter() {
        done = false; pred = -1; picked = -1;
        const m = MISSIONS[mi];
        if (m && m.run) { np = 2; anim = null; curKind = m.run; setNote(); scene = build(m.run); scene.set(0); status('先預測，再看動畫。'); }
        else if (m) status('想一想剛才的幾個過程。');
        drawMission(); syncFree();
      }

      // ---------- 自由探索 ----------
      function syncFree() {
        box.querySelectorAll('#labN1-np button').forEach((b) => { b.setAttribute('aria-pressed', +b.dataset.v === np); b.disabled = busy(); });
        box.querySelectorAll('#labN1-free [data-r]').forEach((b) => { b.disabled = busy(); });
      }
      box.querySelectorAll('#labN1-np button').forEach((b) => b.addEventListener('click', () => { if (busy()) return; np = +b.dataset.v; if (curKind === 'human') curKind = 'mit'; setNote(); syncFree(); }));
      box.querySelectorAll('#labN1-free [data-r]').forEach((b) => b.addEventListener('click', () => {
        if (busy()) return;
        const kind = b.dataset.r;
        play(kind, () => { runs.push({ name: `${RUN_NAME[kind]}（${np} 對）`, pred: '', res: scene.result }); log(); });
      }));

      function reset() {
        runs.length = 0; first.length = 0; mi = 0;
        $('free').open = false;
        log(); enter();
      }
      reset();
      raf = requestAnimationFrame(loop);
      S._labN1 = { advance(sec) { for (let i = 0; i < sec * 30 && anim; i++) tick(1 / 30); }, get mission() { return mi; }, get busy() { return busy(); }, runs }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); anim = null; delete S._labN1; } };
    },
  });
})();
