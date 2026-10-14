/* 互動模型：食物網 — 找生產者、找初級消費者、老鷹是第幾級、蛇減少的影響（點預測就開始）、能量傳遞 ＋ 自由探索 */
(() => {
  const { el, g, text, C } = S;
  const B = S.B5;
  const ORG = {
    grass: { name: '草', x: 420, y: 560, nx: 420, ny: 598, box: [300, 500, 240, 112] },
    hop: { name: '蚱蜢', x: 215, y: 440, s: 0.95, nx: 205, ny: 474, box: [120, 370, 190, 122] },
    rab: { name: '野兔', x: 640, y: 450, s: 0.75, nx: 646, ny: 482, box: [570, 340, 150, 160] },
    frog: { name: '青蛙', x: 140, y: 290, s: 0.95, nx: 124, ny: 196, box: [70, 172, 150, 130] },
    snake: { name: '蛇', x: 360, y: 172, s: 1.05, nx: 360, ny: 204, box: [262, 120, 210, 104] },
    hawk: { name: '老鷹', x: 650, y: 172, s: 0.85, flip: true, nx: 770, ny: 120, box: [585, 50, 140, 140] },
  };
  const KEYS = Object.keys(ORG);
  // 吃與被吃：[被吃的, 吃牠的, 箭頭起點, 箭頭終點]
  const EDGES = [['grass', 'hop', [370, 530], [262, 470]], ['grass', 'rab', [470, 530], [596, 486]], ['hop', 'frog', [186, 392], [152, 318]],
    ['frog', 'snake', [178, 236], [270, 186]], ['snake', 'hawk', [470, 150], [588, 128]], ['rab', 'hawk', [646, 336], [656, 200]]];
  const eats = (k) => EDGES.filter((e) => e[1] === k).map((e) => e[0]);
  const eatenBy = (k) => EDGES.filter((e) => e[0] === k).map((e) => e[1]);
  const names = (arr) => arr.map((k) => ORG[k].name).join('、') || '—';
  // ↑↓ 記號的位置：放在生物旁邊、避開箭頭
  const MK = { grass: [552, 604, 'start'], hop: [128, 452, 'end'], rab: [728, 432, 'start'], frog: [84, 292, 'end'], snake: [350, 140, 'middle'], hawk: [760, 194, 'start'] };
  const ROLE = { grass: '生產者', hop: '初級消費者', rab: '初級消費者', frog: '次級消費者', snake: '三級消費者', hawk: '次級、四級消費者' };

  const MISSIONS = [
    { type: 'tap', title: '找出生產者', text: '食物網的起點是誰？點一下食物網中的<b>生產者</b>。', targets: ['grass'],
      why: '草能行<b>光合作用</b>，自己製造養分，是<b>生產者</b>。所有消費者的養分，最後都來自生產者。' },
    { type: 'tap', title: '找出初級消費者', text: '點出<b>所有的初級消費者</b>（共 2 種）。', targets: ['hop', 'rab'],
      why: '蚱蜢和野兔都<b>直接吃草</b>（生產者），是<b>初級消費者</b>。' },
    { type: 'quiz', title: '老鷹是第幾級？', q: '沿著箭頭看，老鷹屬於第幾級消費者？', opts: ['次級消費者', '四級消費者', '兩種都是：在不同的食物鏈中，級別不同'], ans: 2,
      hint: '從草開始，沿著箭頭走到老鷹，數一數老鷹是第幾個消費者。每一條走得到老鷹的路都要數。',
      why: '草 → 野兔 → 老鷹：老鷹是<b>次級</b>消費者；草 → 蚱蜢 → 青蛙 → 蛇 → 老鷹：老鷹是<b>四級</b>消費者。同一種生物在不同的食物鏈中，級別可能不同。', show: 'chains' },
    { type: 'predict', title: '蛇變少了', q: '如果<b>蛇</b>被大量捕捉、數量變少，短時間內<b>青蛙</b>的數量會怎樣？點選你的預測：', opts: ['增加', '減少', '不變'], ans: 0,
      why: '青蛙的天敵（蛇）變少，被吃掉的青蛙減少，所以青蛙<b>增加</b>；青蛙多了，吃掉更多蚱蜢，蚱蜢可能<b>減少</b>。食物網中一種生物改變，會連帶影響其他生物。' },
    { type: 'quiz', title: '能量傳到哪裡？', q: '草的能量約 10000 單位＊。沿著「草 → 蚱蜢 → 青蛙」，傳到<b>青蛙</b>的能量大約是多少？', opts: ['約 1000 單位', '約 100 單位', '約 10 單位'], ans: 1,
      hint: '能量每往上傳一層，大約只剩下原來的 10%。先算算蚱蜢得到多少。',
      why: '草 10000 → 蚱蜢約 1000 → 青蛙約 100 單位。每一層的能量大部分在生命活動中以<b>熱</b>的形式散失，只有約 10% 傳到下一層。', show: 'energy' },
  ];

  S.registerLab({
    id: 'lab-foodweb', section: '下5-3', title: '食物網',
    mount(box) {
      box.innerHTML = `
<style>
  .labL1 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; min-width: 0; }
  .labL1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labL1 .pad { padding: 1rem 1.25rem; }
  .labL1 .table-wrap { overflow-x: auto; }
  .labL1 .tbl { min-width: 0; }
  .labL1 .tbl th, .labL1 .tbl td { overflow-wrap: anywhere; }
  .labL1 .tbl td.new { color: var(--accent); font-weight: 700; }
  .labL1 svg .hit { cursor: pointer; }
  .labL1 svg .hit:focus { outline: none; }
  .labL1 svg .hit:focus-visible .focus { stroke: var(--accent); stroke-width: 4; }
  .labL1 .seg-ctl button:disabled { opacity: 0.4; cursor: not-allowed; }
  @media (max-width: 900px) {
    .labL1 { display: flex; flex-direction: column; align-items: stretch; }
    .labL1 .col { display: contents; }
    .labL1 .c-stage { order: 1; } .labL1 .c-mis { order: 2; } .labL1 .c-table { order: 3; } .labL1 .c-ctl { order: 4; }
  }
</style>
<div class="labL1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="group" aria-label="食物網：草、蚱蜢、野兔、青蛙、蛇、老鷹；可以點選每一種生物"></svg></div>
      <div class="pad">
        <p class="status-line" id="labL1-status" aria-live="polite"></p>
        <p class="footnote">＊示意：族群數量和能量的數值都是示意，長條的長短沒有依照比例；真實的食物網中生物種類更多，一種生物改變後，整個食物網都可能受到影響，而且需要一段時間。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>食物網紀錄</h3><div class="table-wrap" id="labL1-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labL1-mission"></div>
    <details class="card pad free c-ctl" id="labL1-free"><summary>自由探索：讓一種生物大量減少</summary>
      <p class="m-hint">選一種生物，看看牠大量減少時，哪些生物會<b>直接</b>受到影響。</p>
      <div class="seg-ctl" role="group" aria-label="讓哪一種生物減少" id="labL1-pick">${KEYS.map((k) => `<button type="button" data-k="${k}">${ORG[k].name}</button>`).join('')}</div>
      <div class="btn-row"><button class="ctl" type="button" id="labL1-reset">恢復原狀</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labL1-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      let anim = null;

      // ---------- 箭頭（底層）----------
      const arrG = g(root);
      EDGES.forEach(([, , p, q]) => B.arrow(arrG, p[0], p[1], q[0], q[1], { color: '#8aa1ae', w: 3.5, head: 16 }));
      const chainA = g(root, { opacity: 0 }), chainB = g(root, { opacity: 0 });
      EDGES.forEach(([a, b, p, q]) => {
        if ((a === 'grass' && b === 'rab') || (a === 'rab' && b === 'hawk')) B.arrow(chainA, p[0], p[1], q[0], q[1], { color: '#8fd0ff', w: 6, head: 18 });
        else if (!(a === 'grass' && b === 'rab') && !(a === 'rab' && b === 'hawk')) B.arrow(chainB, p[0], p[1], q[0], q[1], { color: C.hi, w: 6, head: 18 });
      });

      // ---------- 生物 ----------
      const rings = {}, marks = {}, orgG = {};
      KEYS.forEach((k) => {
        const o = ORG[k], [bx, by, bw, bh] = o.box;
        rings[k] = el('rect', { x: bx, y: by, width: bw, height: bh, rx: 18, fill: 'none', stroke: C.hi, 'stroke-width': 4, opacity: 0 }, root);
        const hg = g(root, { class: 'hit', tabindex: 0, role: 'button', 'aria-label': o.name });
        el('rect', { class: 'focus', x: bx, y: by, width: bw, height: bh, rx: 18, fill: 'transparent', stroke: 'none' }, hg);
        orgG[k] = g(hg);
        if (k === 'grass') { el('ellipse', { cx: 420, cy: 562, rx: 110, ry: 10, fill: '#2a4a2a' }, orgG[k]); [[350, 1], [390, 2], [430, 3], [470, 4], [500, 5]].forEach(([x, sd]) => B.grass(orgG[k], { x, y: 562, h: 48, w: 44, seed: sd })); }
        else B[{ hop: 'grasshopper', rab: 'rabbit', frog: 'frog', snake: 'snake', hawk: 'hawk' }[k]](orgG[k], { x: o.x, y: o.y, s: o.s, flip: o.flip });
        S.pill(hg, o.nx, o.ny, o.name, { size: 24, color: C.ink, edge: '#4a6272' });
        const on = () => tap(k);
        hg.addEventListener('click', on);
        hg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); on(); } });
        const [mx, my, ma] = MK[k];
        marks[k] = text(root, mx, my, '', { 'font-size': 40, 'text-anchor': ma, 'font-weight': 700 });
      });

      // ---------- 右側的資訊區（右上角留給「放大」按鈕）----------
      const PX = 870, PW = 300;
      el('rect', { x: PX, y: 140, width: PW, height: 460, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, root);
      const panel = g(root);
      const ptitle = (s) => text(panel, PX + PW / 2, 184, s, { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      function panelLegend() {
        panel.innerHTML = '';
        ptitle('怎麼看食物網');
        B.arrow(panel, PX + 50, 250, PX + 250, 250, { color: '#8aa1ae', w: 4, head: 16 });
        text(panel, PX + 50, 296, '被吃的', { 'font-size': 24, fill: C.ink2 });
        text(panel, PX + 250, 296, '吃牠的', { 'font-size': 24, 'text-anchor': 'end', fill: C.ink2 });
        text(panel, PX + PW / 2, 370, '箭頭也是養分和', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
        text(panel, PX + PW / 2, 404, '能量流動的方向', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
        text(panel, PX + PW / 2, 490, '點選生物來作答', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi });
      }
      function panelChains() {
        panel.innerHTML = '';
        ptitle('到老鷹的兩條路');
        [['#8fd0ff', ['草 → 野兔 → 老鷹'], '老鷹：次級消費者'], [C.hi, ['草 → 蚱蜢 → 青蛙', '→ 蛇 → 老鷹'], '老鷹：四級消費者']].forEach(([col, lines, res], i) => {
          const y0 = 240 + i * 160;
          lines.forEach((s, j) => text(panel, PX + 28, y0 + j * 40, s, { 'font-size': 24, fill: col }));
          text(panel, PX + 28, y0 + lines.length * 40 + 14, res, { 'font-size': 26, fill: col, 'font-weight': 700 });
        });
      }
      const BAR = { y0: 520, max: 300 };
      function bars(list) {
        panel.innerHTML = '';
        ptitle('族群的個體數＊');
        el('line', { x1: PX + 24, y1: BAR.y0, x2: PX + PW - 24, y2: BAR.y0, stroke: C.ink2, 'stroke-width': 2 }, panel);
        const n = list.length, gap = (PW - 48) / n, bw = Math.min(56, gap * 0.62);
        return list.map(([k, v], i) => {
          const cx = PX + 24 + gap * (i + 0.5);
          const r = el('rect', { x: cx - bw / 2, y: BAR.y0 - v, width: bw, height: v, rx: 4, fill: '#5f93ad' }, panel);
          text(panel, cx, BAR.y0 + 32 + (n > 4 && i % 2 ? 34 : 0), ORG[k].name, { 'font-size': n > 4 ? 22 : 24, 'text-anchor': 'middle', fill: C.ink });
          const a = text(panel, cx, BAR.y0 - v - 12, '', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
          return { k, r, a, cx, v };
        });
      }
      const setBar = (b, v) => { b.v = v; b.r.setAttribute('y', BAR.y0 - v); b.r.setAttribute('height', v); b.a.setAttribute('y', BAR.y0 - v - 12); };
      const UP = '#6fce62', DN = '#ff8a7a';
      function panelEnergy() {
        if (anim) anim.kill();
        anim = gsap.timeline();
        panel.innerHTML = '';
        ptitle('能量（單位＊）');
        // 框的寬度：字放大到 24 後，最上層「約 100」左右還有空
        [['草', '10000', 260, '#4f9a4a'], ['蚱蜢', '約 1000', 180, '#c88a3a'], ['青蛙', '約 100', 110, '#c86a3a']].forEach(([n, v, w, col], i) => {
          const y = 470 - i * 110, cg = g(panel, { opacity: 0 });
          el('rect', { x: PX + PW / 2 - w / 2, y, width: w, height: 70, rx: 8, fill: col }, cg);
          text(cg, PX + PW / 2, y + 30, n, { 'font-size': 24, 'text-anchor': 'middle', fill: '#fff', 'font-weight': 700 });
          text(cg, PX + PW / 2, y + 60, v, { 'font-size': 22, 'text-anchor': 'middle', fill: '#fff6e0' });
          if (i) B.arrow(cg, PX + PW / 2, y + 104, PX + PW / 2, y + 74, { color: C.ink2, w: 3, head: 10 });
          anim.to(cg, { opacity: 1, duration: 0.4 }, 0.2 + i * 0.6);
        });
        text(panel, PX + PW / 2, 224, '每往上一層約剩 10%', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi });
      }

      // ---------- 狀態、紀錄 ----------
      const status = (h) => { $('status').innerHTML = h; };
      const known = new Set();
      function table() {
        // 還沒答對相關任務的生物，整列都先用「？」，避免提前看到答案
        // 列表中的生物也要已經答對過，才顯示名字（例如任務 2 還沒完成時，草的「被誰吃」不能先出現）
        const kn = (arr) => (arr.length ? arr.map((x) => (known.has(x) ? ORG[x].name : '？')).join('、') : '—');
        const cell = (k, v, cls = '') => (known.has(k) ? `<td class="${cls}">${v}</td>` : '<td class="m-hint">？</td>');
        $('table').innerHTML = `<p class="m-hint">答對相關的任務後，才會填入那一列。</p><table class="tbl"><thead><tr><th>生物</th><th>吃什麼</th><th>被誰吃</th><th>角色</th></tr></thead><tbody>${KEYS.map((k) => `<tr><th>${ORG[k].name}</th>${cell(k, k === 'grass' ? '（自己製造養分）' : kn(eats(k)))}${cell(k, kn(eatenBy(k)))}${cell(k, ROLE[k], 'new')}</tr>`).join('')}</tbody></table>`;
      }
      const timers = [];
      // 圈出點選的生物：答對保持綠框；答錯紅框一下就消失
      const flash = (k, col) => { const r = rings[k]; r.setAttribute('stroke', col); r.setAttribute('opacity', 1); if (col === DN) timers.push(setTimeout(() => r.setAttribute('opacity', 0), 900)); };
      const clearMarks = () => KEYS.forEach((k) => { marks[k].textContent = ''; orgG[k].style.opacity = 1; });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, found = new Set(), wrongTap = null, running = false;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      const INTRO = '箭頭從「被吃的」指向「吃牠的」。按照任務卡的說明，點選舞台上的生物。';
      const CHAIN_KNOWN = ['frog', 'snake', 'hawk']; // 答對「老鷹是第幾級」後，紀錄表填入的生物
      // 切換任務：動畫先停止（不執行完成後的動作），紀錄表只填入前面做完過的任務
      function goMission(k) {
        if (done) doneK.add(mi);
        if (anim) anim.kill();
        running = false; timers.forEach(clearTimeout); timers.length = 0;
        mi = k; done = false; picked = -1; pred = -1; found = new Set(); wrongTap = null;
        known.clear();
        MISSIONS.slice(0, mi).forEach((m, j) => { if (doneK.has(j)) (m.targets || (m.show === 'chains' ? CHAIN_KNOWN : [])).forEach((x) => known.add(x)); });
        KEYS.forEach((x) => rings[x].setAttribute('opacity', 0)); chainA.style.opacity = 0; chainB.style.opacity = 0; clearMarks(); panelLegend();
        table(); drawMission();
        status(mi === 0 ? INTRO : mi < MISSIONS.length ? '' : '全部完成！可以打開「自由探索」，讓其他生物減少看看。');
      }
      S.onDots(mbox, goMission);
      function tap(k) {
        const m = MISSIONS[mi];
        if (m && (m.type !== 'tap' || done)) { status(done ? '按任務卡上的「下一個任務」繼續。' : '這個任務請在任務卡上作答。'); return; }
        if (!m) { status(`${ORG[k].name}（${ROLE[k]}）：${k === 'grass' ? '自己製造養分' : `吃${names(eats(k))}`}；${eatenBy(k).length ? `被${names(eatenBy(k))}吃` : '這個食物網中沒有吃牠的生物'}。`); return; }
        if (m.targets.includes(k)) {
          if (found.has(k)) { wrongTap = 'again'; drawMission(); return; }
          found.add(k); known.add(k); flash(k, UP); wrongTap = null;
          status(`${ORG[k].name}：答對了。`);
          if (m.targets.every((t) => found.has(t))) done = true;
        } else {
          flash(k, DN);
          if (mi === 0) wrongTap = `${ORG[k].name}要吃其他生物才能得到養分，是消費者。生產者能自己製造養分。`;
          else wrongTap = k === 'grass' ? '草是生產者。初級消費者是「直接吃生產者」的動物。' : `${ORG[k].name}不是直接吃生產者的。看看指向${ORG[k].name}的箭頭，是從哪裡來的？`;
          status(`${ORG[k].name}：不對喔。`);
        }
        table(); drawMission();
      }
      function runSnake() {
        running = true; drawMission();
        clearMarks();
        const bs = bars([['snake', 130], ['frog', 150], ['hop', 210]]);
        const [sn, fr, hp] = bs;
        if (anim) anim.kill();
        const o = { a: 0, b: 0, c: 0 };
        anim = gsap.timeline({ onComplete: () => { running = false; done = true; drawMission(); } });
        anim.to(o, { a: 1, duration: 0.7, ease: 'power1.inOut', onUpdate: () => setBar(sn, S.lerp(130, 40, o.a)) });
        anim.call(() => { sn.a.textContent = '↓'; sn.a.setAttribute('fill', DN); marks.snake.textContent = '↓'; marks.snake.setAttribute('fill', DN); orgG.snake.style.opacity = 0.35; status('蛇大量減少了……'); });
        anim.to(o, { b: 1, duration: 0.8, ease: 'power1.inOut', onUpdate: () => setBar(fr, S.lerp(150, 250, o.b)) }, '+=0.3');
        anim.call(() => { fr.a.textContent = '↑'; fr.a.setAttribute('fill', UP); marks.frog.textContent = '↑'; marks.frog.setAttribute('fill', UP); status('青蛙的天敵變少，青蛙增加了。'); });
        anim.to(o, { c: 1, duration: 0.8, ease: 'power1.inOut', onUpdate: () => setBar(hp, S.lerp(210, 140, o.c)) }, '+=0.3');
        anim.call(() => { hp.a.textContent = '↓'; hp.a.setAttribute('fill', DN); marks.hop.textContent = '↓'; marks.hop.setAttribute('fill', DN); status('接著：青蛙多了，蚱蜢被吃得更多，蚱蜢可能減少。'); });
      }
      function showAfter(m) {
        if (m.show === 'chains') { chainA.style.opacity = 1; chainB.style.opacity = 1; panelChains(); CHAIN_KNOWN.forEach((k) => known.add(k)); table(); }
        if (m.show === 'energy') { clearMarks(); chainA.style.opacity = 0; chainB.style.opacity = 0; panelEnergy(); }
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>重點整理</strong>生產者（草）自己製造養分；直接吃生產者的是初級消費者。<br>同一種生物在不同的食物鏈中，級別可能不同。<br>一種生物的數量改變，會影響食物網中的其他生物。<br>能量沿食物鏈逐層減少，每往上一層約剩 10%＊。</div>
            <button class="ctl primary" type="button" id="labL1-again">再練習一次</button>`;
          mbox.querySelector('#labL1-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.type === 'tap') {
          html += `<p class="m-text">${m.text}</p>`;
          if (m.targets.length > 1) html += `<p class="m-hint">已找到：${found.size ? [...found].map((k) => ORG[k].name).join('、') : '還沒有'}（${found.size} / ${m.targets.length}）</p>`;
          if (!done && wrongTap) html += `<div class="fb bad"><strong>再想想看</strong>${wrongTap === 'again' ? '這個已經找到了，還有另一種。' : wrongTap}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else if (m.type === 'quiz') {
          html += `<p class="m-text">${m.q}</p><div class="opts">${m.opts.map((o, k) => `<button class="opt ${done && k === m.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.q}</p><div class="acts">${m.opts.map((o, k) => `<button class="ctl ${pred < 0 || pred === k ? 'primary' : ''}" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (running) html += '<p class="m-hint">觀察右邊的長條……</p>';
          if (done) html += `<div class="fb ${pred === m.ans ? 'ok' : 'bad'}"><strong>${pred === m.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labL1-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === m.ans) { done = true; showAfter(m); } else picked = k;
          drawMission();
        }));
        mbox.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; runSnake(); }));
        const nx = mbox.querySelector('#labL1-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }

      // ---------- 自由探索：讓一種生物減少 ----------
      function freeRun(k) {
        if (anim) anim.kill();
        chainA.style.opacity = 0; chainB.style.opacity = 0;
        clearMarks();
        const prey = eats(k), preds = eatenBy(k);
        const bs = bars(KEYS.map((x) => [x, 150]));
        box.querySelectorAll('#labL1-pick button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === k));
        const o = { u: 0 };
        anim = gsap.to(o, { u: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: () => bs.forEach((b) => setBar(b, 150 + o.u * (b.k === k ? -110 : prey.includes(b.k) ? 80 : preds.includes(b.k) ? -60 : 0))),
          onComplete: () => bs.forEach((b) => { const d = b.k === k || preds.includes(b.k) ? '↓' : prey.includes(b.k) ? '↑' : ''; b.a.textContent = d; b.a.setAttribute('fill', d === '↑' ? UP : DN); marks[b.k].textContent = d; marks[b.k].setAttribute('fill', d === '↑' ? UP : DN); }) });
        orgG[k].style.opacity = 0.35;
        let msg = `<b>${ORG[k].name}</b>大量減少：`;
        if (prey.length) msg += `牠吃的<b>${names(prey)}</b>少了天敵，可能<b>增加</b>；`;
        if (preds.length) msg += `吃牠的<b>${names(preds)}</b>少了食物，可能<b>減少</b>`;
        else msg += '這個食物網中沒有牠的天敵';
        if (k === 'grass') msg = '<b>草</b>大量減少：直接吃草的<b>蚱蜢、野兔</b>少了食物，可能<b>減少</b>，接著整個食物網都會受影響。';
        if (k === 'hawk') msg = '<b>老鷹</b>大量減少：牠吃的<b>蛇、野兔</b>少了天敵，可能<b>增加</b>。';
        status(msg + '（只畫出直接的影響）');
      }
      box.querySelectorAll('#labL1-pick button').forEach((b) => b.addEventListener('click', () => freeRun(b.dataset.k)));
      $('reset').addEventListener('click', () => { if (anim) anim.kill(); clearMarks(); panelLegend(); box.querySelectorAll('#labL1-pick button').forEach((b) => b.setAttribute('aria-pressed', 'false')); status('恢復原狀。'); });

      function reset() {
        if (anim) anim.kill();
        mi = 0; done = false; picked = -1; pred = -1; found = new Set(); wrongTap = null; running = false;
        known.clear(); doneK.clear(); clearMarks(); chainA.style.opacity = 0; chainB.style.opacity = 0; KEYS.forEach((k) => rings[k].setAttribute('opacity', 0));
        panelLegend(); table();
        status(INTRO);
        $('free').open = false;
        drawMission();
      }
      reset();
      S._labL1 = { tap, get mi() { return mi; }, finish() { if (anim) anim.progress(1); }, freeRun };
      return { unmount() { if (anim) anim.kill(); timers.forEach(clearTimeout); delete S._labL1; } };
    },
  });
})();
