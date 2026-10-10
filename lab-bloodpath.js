/* 互動模型：血液的旅程 — 一滴血在心臟、肺和全身之間流動，每次點選「下一站」；答對血滴就流過去（在微血管改變充氧／缺氧），答錯給提示再選 ＋ 任務：肺循環、體循環、肺動脈與肺靜脈 */
(() => {
  const { el, g, text, C } = S;
  const OXY = '#ff4d5e', DEOX = '#8f6cf2', MUSC_E = '#ffb3bf';
  const STOP = {
    RA: ['右心房', [505, 320]], RV: ['右心室', [512, 422]], PA: ['肺動脈', [510, 212]], LC: ['肺部的微血管', [600, 124]], PV: ['肺靜脈', [780, 240]],
    LA: ['左心房', [695, 320]], LV: ['左心室', [690, 422]], AO: ['主動脈', [840, 530]], BC: ['全身的微血管', [610, 626]], VC: ['上、下腔靜脈', [380, 480]],
  };
  const EDGE = {
    'RA-RV': [[505, 320], [508, 370], [512, 422]],
    'RV-PA': [[512, 422], [572, 400], [600, 346], [600, 212], [510, 212]],
    'PA-LC': [[510, 212], [420, 212], [420, 124], [600, 124]],
    'LC-PV': [[600, 124], [780, 124], [780, 240]],
    'PV-LA': [[780, 240], [780, 335], [762, 335], [695, 320]],
    'LA-LV': [[695, 320], [692, 370], [690, 422]],
    'LV-AO': [[690, 422], [760, 438], [840, 438], [840, 530]],
    'AO-BC': [[840, 530], [840, 626], [610, 626]],
    'BC-VC': [[610, 626], [380, 626], [380, 480]],
    'VC-RA': [[380, 480], [380, 335], [438, 335], [505, 320]],
  };
  const ORDER = ['RA', 'RV', 'PA', 'LC', 'PV', 'LA', 'LV', 'AO', 'BC', 'VC'];
  const TASKS = [
    { title: '肺循環', start: 'RA', oxy: false, intro: '一滴<b>缺氧血</b>剛流回<b>右心房</b>。它接下來會流到哪裡？一次選一站。',
      steps: [
        { to: 'RV', opts: ['LA', 'RV', 'PV', 'AO'], hint: '想一想：在心臟裡，血液是從心房流到哪一種腔室？心臟左右兩邊的血液會直接相通嗎？' },
        { to: 'PA', opts: ['AO', 'VC', 'PA', 'PV'], hint: '把血液送出心臟的是動脈還是靜脈？右心室的血液要送到肺，還是送到全身？' },
        { to: 'LC', opts: ['BC', 'LC', 'LA'], hint: '動脈一路分支，最後會流進管壁很薄、能交換物質的血管。這條動脈通往哪個器官？' },
        { to: 'PV', opts: ['PA', 'VC', 'PV', 'AO'], hint: '離開微血管後，血液要經過哪一種血管回到心臟？血滴現在在身體的哪個器官？' },
        { to: 'LA', opts: ['RA', 'LV', 'LA', 'RV'], hint: '靜脈把血液送回心房。肺循環的血液回到心臟的哪一邊？' },
      ],
      done: '肺循環：右心室 → 肺動脈 → 肺部的微血管 → 肺靜脈 → 左心房。血液在肺部得到氧，由缺氧血變成<b>充氧血</b>。' },
    { title: '體循環', start: 'LA', oxy: true, intro: '這滴<b>充氧血</b>現在在<b>左心房</b>。接下來它要去全身，下一站是哪裡？',
      steps: [
        { to: 'LV', opts: ['RA', 'LV', 'AO', 'PV'], hint: '在心臟裡，血液是從心房流到哪一種腔室？會不會跑到心臟的另一邊？' },
        { to: 'AO', opts: ['PA', 'AO', 'VC', 'PV'], hint: '把血液送出心臟的是動脈還是靜脈？左心室的血液要送到肺，還是送到全身？' },
        { to: 'BC', opts: ['LC', 'RA', 'BC', 'VC'], hint: '血液要經過哪一種血管，才能把氧交給全身的細胞？' },
        { to: 'VC', opts: ['AO', 'PV', 'PA', 'VC'], hint: '交換完物質的血液，要經過靜脈回到心臟。從全身回來的靜脈是哪一條？' },
        { to: 'RA', opts: ['LA', 'RV', 'RA', 'LV'], hint: '靜脈把血液送回心房。體循環的血液回到心臟的哪一邊？' },
      ],
      done: '體循環：左心室 → 主動脈 → 全身的微血管 → 上、下腔靜脈 → 右心房。血液在全身的微血管把氧交給細胞，變成<b>缺氧血</b>。' },
    { title: '血管裡是什麼血？', quiz: { q: '肺動脈和肺靜脈裡，分別流著什麼血？', opts: ['肺動脈：充氧血；肺靜脈：缺氧血', '肺動脈：缺氧血；肺靜脈：充氧血', '兩條都是充氧血', '兩條都是缺氧血'], ans: 1,
      hint: '回想剛才的血滴：進入肺部以前是什麼顏色？離開肺部以後呢？' },
      why: '血液在<b>肺部</b>得到氧，所以流向肺的<b>肺動脈</b>是缺氧血，從肺回來的<b>肺靜脈</b>是充氧血。動脈、靜脈是依「離開或流回心臟」來分，不是依含氧多少。' },
  ];
  const len = (P) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
  const at = (P, t) => { const T = len(P) * S.clamp(t); let s = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (s + d >= T) { const f = (T - s) / (d || 1); return [S.lerp(P[i - 1][0], P[i][0], f), S.lerp(P[i - 1][1], P[i][1], f)]; } s += d; } return P[P.length - 1]; };
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(S.lerp(v, B[i], S.clamp(t)))).join(',')})`; };

  S.registerLab({
    id: 'lab-bloodpath', section: '4-4', title: '血液的旅程',
    mount(box) {
      box.innerHTML = `
<style>
  .labQ { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labQ .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labQ .pad { padding: 1rem 1.25rem; }
  .labQ .choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; margin: 0.5rem 0; }
  .labQ .choices .opt { text-align: center; font-size: 1.1rem; padding: 0.75em 0.5em; font-family: var(--font-label); }
  .labQ .opt:disabled { cursor: default; }
  .labQ .trail { font-size: 0.95rem; line-height: 1.8; margin: 0; }
  .labQ .trail i { display: inline-block; width: 0.75em; height: 0.75em; border-radius: 50%; margin: 0 0.25em; vertical-align: -0.05em; }
  @media (max-width: 900px) {
    .labQ { display: flex; flex-direction: column; align-items: stretch; }
    .labQ .col { display: contents; }
    .labQ .c-stage { order: 1; } .labQ .c-mis { order: 2; } .labQ .c-log { order: 3; } .labQ .c-ctl { order: 4; }
  }
</style>
<div class="labQ">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 720" role="img" aria-label="心臟、肺和全身的血液循環路線圖，一滴血在其中流動"></svg></div>
      <div class="pad">
        <p class="status-line" id="labQ-status" aria-live="polite"></p>
        <p class="footnote">＊示意：心臟和血管都畫成簡單的方塊和管子，左右依「面對面」畫：畫面左邊是人的右邊。紅色表示充氧血（含氧較多），紫色表示缺氧血（含氧較少）；真實的缺氧血是暗紅色。</p>
      </div>
    </div>
    <div class="card pad c-log"><h3>血滴走過的路線</h3><p class="trail" id="labQ-trail"></p></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labQ-mission"></div>
    <details class="card pad free c-ctl" id="labQ-free"><summary>自由探索：看血液流完整一圈</summary>
      <p class="m-hint">從右心房出發，依序經過肺循環和體循環，再回到右心房。</p>
      <div class="btn-row"><button class="ctl primary" type="button" id="labQ-loop">播放完整的一圈</button><button class="ctl" type="button" id="labQ-stop">停止</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labQ-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 720, fill: C.bg }, svg);
      const root = g(svg);
      const defs = el('defs', {}, root);
      const grad = (id, a, b) => { const lg = el('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs); el('stop', { offset: 0, 'stop-color': a }, lg); el('stop', { offset: 1, 'stop-color': b }, lg); return `url(#${id})`; };

      // ---------- 循環路線圖（和 3-4 動畫相同的版面） ----------
      [[505, 116], [695, 116]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 115, ry: 78, fill: 'rgba(255,170,190,0.12)', stroke: '#ffb3c8', 'stroke-width': 2 }, root));
      text(root, 600, 34, '肺', { 'font-size': 26, 'text-anchor': 'middle', fill: '#ffb3c8', 'font-weight': 700 });
      const gL = grad('lqLung', DEOX, OXY), gB = grad('lqBody', DEOX, OXY);
      for (let k = 0; k < 4; k++) { let d = `M 420,${102 + k * 12}`; for (let x = 420; x < 780; x += 30) d += ` q 15,${k % 2 ? 9 : -9} 30,0`; el('path', { d, fill: 'none', stroke: gL, 'stroke-width': 4, opacity: 0.7 }, root); }
      for (let k = 0; k < 4; k++) { let d = `M 380,${612 + k * 12}`; for (let x = 380; x < 840; x += 30) d += ` q 15,${k % 2 ? 9 : -9} 30,0`; el('path', { d, fill: 'none', stroke: gB, 'stroke-width': 4, opacity: 0.7 }, root); }
      for (let i = 0; i < 9; i++) el('rect', { x: 392 + i * 50, y: 668, width: 42, height: 30, rx: 10, fill: 'rgba(99,212,191,0.12)', stroke: '#63d4bf', 'stroke-width': 1.5 }, root);
      text(root, 870, 690, '全身的細胞', { 'font-size': 20, fill: '#63d4bf' });
      const vessel = (d) => el('path', { d, fill: 'none', stroke: '#3a3a4e', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, root);
      vessel('M 572,400 C 590,380 600,366 600,346 L 600,212 L 420,212 L 420,146');
      vessel('M 780,146 L 780,335 L 762,335');
      vessel('M 760,438 L 840,438 L 840,626');
      vessel('M 380,626 L 380,335 L 438,335');
      el('rect', { x: 425, y: 276, width: 350, height: 222, rx: 30, fill: 'rgba(217,112,127,0.2)', stroke: MUSC_E, 'stroke-width': 2 }, root);
      [[440, 290, 130], [630, 290, 130], [440, 392, 145], [615, 392, 145]].forEach(([x, y, w]) => el('rect', { x, y, width: w, height: 90, rx: 16, fill: '#3a2a3a', stroke: '#6a4a5a', 'stroke-width': 2 }, root));
      const trailG = g(root);
      // 站名
      const LBL = { RA: [505, 368, 'middle'], LA: [695, 368, 'middle'], RV: [512, 470, 'middle'], LV: [688, 470, 'middle'], PA: [510, 252, 'middle'], LC: [600, 172, 'middle'], PV: [800, 246, 'start'], AO: [858, 536, 'start'], BC: [610, 600, 'middle'], VC: [362, 486, 'end'] };
      const lbl = {}, mark = {};
      ORDER.forEach((k) => {
        const [x, y, a] = LBL[k], chamber = ['RA', 'LA', 'RV', 'LV'].includes(k);
        if (!chamber) mark[k] = el('circle', { cx: STOP[k][1][0], cy: STOP[k][1][1], r: 9, fill: '#0d1822', stroke: '#8aa1ae', 'stroke-width': 3 }, root);
        lbl[k] = text(root, x, y, STOP[k][0], { 'font-size': chamber ? 26 : 22, 'text-anchor': a, fill: chamber ? '#e8f0f2' : C.ink2, 'font-weight': 700 });
      });
      const legend = g(root);
      el('circle', { cx: 940, cy: 40, r: 10, fill: OXY }, legend); text(legend, 958, 48, '充氧血', { 'font-size': 22, fill: C.ink2 });
      el('circle', { cx: 1060, cy: 40, r: 10, fill: DEOX }, legend); text(legend, 1078, 48, '缺氧血', { 'font-size': 22, fill: C.ink2 });
      text(root, 40, 48, '面對面：左邊是人的右邊', { 'font-size': 20, fill: C.mute });
      // 血滴
      const ring = el('circle', { r: 24, fill: 'none', stroke: C.hi, 'stroke-width': 3, opacity: 0 }, root);
      const drop = el('circle', { r: 15, fill: DEOX, stroke: '#fff', 'stroke-width': 3, opacity: 0 }, root);

      // ---------- 狀態 ----------
      const st = { at: 'RA', oxy: false, trail: [] };
      let tw = null, ti = 0, si = 0, picked = [], done = false, qPicked = -1, qSolved = false, firstOk = [], loopTl = null;
      const status = (h) => { $('status').innerHTML = h; };
      const colorOf = (o) => (o ? OXY : DEOX);
      function place(k) {
        const [x, y] = STOP[k][1];
        drop.setAttribute('cx', x); drop.setAttribute('cy', y); drop.setAttribute('fill', colorOf(st.oxy)); drop.style.opacity = 1;
        ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.style.opacity = 1;
        Object.entries(mark).forEach(([kk, m]) => m.setAttribute('stroke', kk === k ? C.hi : '#8aa1ae'));
      }
      function trail() {
        $('trail').innerHTML = st.trail.length ? st.trail.map(([k, o], i) => `${i ? ' → ' : ''}<i style="background:${colorOf(o)}"></i>${STOP[k][0]}`).join('') : '選出下一站後，路線會記在這裡。';
      }
      // 沿著一段血管流過去；經過微血管時改變充氧／缺氧
      function travel(from, to, cb, dur = 1.4) {
        const P = EDGE[`${from}-${to}`];
        const flip = to === 'LC' ? true : to === 'BC' ? false : null;
        const o0 = st.oxy, path = el('path', { d: 'M ' + P.map((p) => p.join(',')).join(' L '), fill: 'none', stroke: colorOf(o0), 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, trailG);
        const L = len(P);
        path.setAttribute('stroke-dasharray', `${L} ${L}`); path.setAttribute('stroke-dashoffset', L);
        ring.style.opacity = 0;
        const o = { u: 0 };
        tw = gsap.to(o, {
          u: 1, duration: dur, ease: 'power1.inOut',
          onUpdate: () => {
            const [x, y] = at(P, o.u);
            drop.setAttribute('cx', x); drop.setAttribute('cy', y);
            path.setAttribute('stroke-dashoffset', L * (1 - o.u));
            if (flip !== null) { const k = S.smoothstep(0.55, 1, o.u), c = flip ? mix(DEOX, OXY, k) : mix(OXY, DEOX, k); drop.setAttribute('fill', c); }
          },
          onComplete: () => { tw = null; if (flip !== null) st.oxy = flip; st.at = to; st.trail.push([to, st.oxy]); place(to); trail(); cb && cb(flip); },
        });
      }

      // ---------- 任務 ----------
      const mbox = $('mission');
      const dots = () => `<div class="dots" aria-hidden="true">${TASKS.map((_, k) => `<i class="${k < ti ? (firstOk[k] ? 'ok' : 'miss') : k === ti ? 'on' : ''}"></i>`).join('')}</div>`;
      function startTask() {
        const T = TASKS[ti];
        si = 0; picked = []; done = false; qPicked = -1; qSolved = false;
        if (tw) { tw.kill(); tw = null; }
        trailG.innerHTML = '';
        if (T && !T.quiz) { st.at = T.start; st.oxy = T.oxy; st.trail = [[T.start, T.oxy]]; place(T.start); status(T.intro); }
        trail(); draw();
      }
      function draw() {
        if (ti >= TASKS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>重點整理</strong>肺循環：右心室 → 肺動脈 → 肺部的微血管 → 肺靜脈 → 左心房。<br>體循環：左心室 → 主動脈 → 全身的微血管 → 上、下腔靜脈 → 右心房。<br>血液在肺部變成充氧血，在全身的微血管變成缺氧血。</div>
            <p class="m-hint">打開下面的「自由探索」，可以看血液流完整的一圈。</p>
            <button class="ctl primary" type="button" id="labQ-again">再玩一次</button>`;
          mbox.querySelector('#labQ-again').addEventListener('click', () => { ti = 0; firstOk = []; startTask(); });
          $('free').open = true;
          return;
        }
        const T = TASKS[ti];
        let html = `<div class="mission-top"><h2>任務 ${ti + 1}：${T.title}</h2>${dots()}</div>`;
        if (T.quiz) {
          html += `<p class="m-text">${T.quiz.q}</p><div class="opts">${T.quiz.opts.map((o, k) => `<button class="opt ${qSolved && k === T.quiz.ans ? 'right' : !qSolved && k === qPicked ? 'wrong' : ''}" type="button" data-k="${k}" ${qSolved ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!qSolved && qPicked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${T.quiz.hint}</div>`;
          if (qSolved) html += `<div class="fb ok"><strong>答對了</strong>${T.why}</div><button class="ctl primary" type="button" id="labQ-next">看結果</button>`;
        } else if (done) {
          html += `<div class="fb ok"><strong>完成</strong>${T.done}</div><button class="ctl primary" type="button" id="labQ-next">下一個任務</button>`;
        } else {
          const s = T.steps[si], moving = !!tw;
          html += `<p class="m-text">${si === 0 ? T.intro : `血滴現在在<b>${STOP[st.at][0]}</b>，是<b>${st.oxy ? '充氧血' : '缺氧血'}</b>。下一站是？`}</p>`;
          html += `<p class="m-hint">第 ${si + 1} / ${T.steps.length} 站</p><div class="choices">${s.opts.map((k) => `<button class="opt ${picked.includes(k) ? 'wrong' : ''}" type="button" data-s="${k}" ${moving || picked.includes(k) ? 'disabled' : ''}>${STOP[k][0]}</button>`).join('')}</div>`;
          if (picked.length && !moving) html += `<div class="fb bad"><strong>再想想看</strong>${s.hint}</div>`;
          if (moving) html += `<p class="m-hint">血滴流動中…</p>`;
        }
        mbox.innerHTML = html;
        mbox.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.s)));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (firstOk[ti] === undefined) firstOk[ti] = k === T.quiz.ans;
          if (k === T.quiz.ans) qSolved = true; else qPicked = k;
          draw();
        }));
        const nx = mbox.querySelector('#labQ-next');
        if (nx) nx.addEventListener('click', () => { ti++; startTask(); });
      }
      function pick(k) {
        const T = TASKS[ti];
        if (!T || T.quiz || done || tw) return;
        const s = T.steps[si];
        if (k !== s.to) {
          picked.push(k); if (firstOk[ti] === undefined) firstOk[ti] = false;
          status(`血滴不會直接流到<b>${STOP[k][0]}</b>。看看提示，再選一次。`);
          draw(); return;
        }
        const from = st.at;
        picked = [];
        travel(from, k, (flip) => {
          if (flip === true) status('在<b>肺部的微血管</b>放出二氧化碳、得到氧，變成<b>充氧血</b>了！');
          else if (flip === false) status('在<b>全身的微血管</b>把氧交給細胞、帶走二氧化碳，變成<b>缺氧血</b>了。');
          else status(`流到<b>${STOP[k][0]}</b>了。`);
          si++;
          if (si >= T.steps.length) { done = true; if (firstOk[ti] === undefined) firstOk[ti] = true; }
          draw();
        });
        draw();
      }

      // ---------- 自由探索：完整的一圈 ----------
      function playLoop() {
        stopLoop();
        if (tw) { tw.kill(); tw = null; }
        trailG.innerHTML = '';
        st.at = 'RA'; st.oxy = false; st.trail = [['RA', false]]; place('RA'); trail();
        let i = 0;
        const next = () => { if (!loopTl) return; const a = ORDER[i % 10], b = ORDER[(i + 1) % 10]; i++; if (i > 10) { loopTl = null; status('血液流完了完整的一圈：肺循環＋體循環。'); return; } travel(a, b, () => setTimeout(next, 150), 1); };
        loopTl = true; status('從右心房出發，看血液流完整的一圈…'); next();
      }
      function stopLoop() { loopTl = null; }
      $('loop').addEventListener('click', playLoop);
      $('stop').addEventListener('click', () => { stopLoop(); if (tw) tw.progress(1); });

      startTask();
      S._labQ = { st, pick, get task() { return ti; }, get step() { return si; }, skip() { if (tw) tw.progress(1); } }; // 測試用
      return { unmount() { stopLoop(); if (tw) tw.kill(); delete S._labQ; } };
    },
  });
})();
