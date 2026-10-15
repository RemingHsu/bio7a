/* 互動模型：檢索表 — 用二分法檢索表，一次回答一個是／否問題，找出生物的名稱 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const YES = '#8fd47a', NO = '#ff9a8a';
  const B = () => S.B3;
  // 生物：[名稱, 畫法, 葉節點縮放, 大圖縮放, y 位移]
  const ORG = {
    sparrow: ['麻雀', (p) => B().sparrow(p), 0.62, 1.5, 0],
    butterfly: ['蝴蝶', (p) => B().butterfly(p), 0.52, 1.25, 0],
    cat: ['家貓', (p) => B().cat(p), 0.4, 1.0, 10],
    frog: ['青蛙', (p) => B().frog(p), 0.56, 1.35, 0],
    fish: ['吳郭魚', (p) => B().fish(p), 0.52, 1.25, 0],
    snail: ['蝸牛', (p) => B().snail(p), 0.56, 1.3, 0],
  };
  // 二分法檢索表：每個問題有「是」「否」兩條路
  const NODES = {
    q1: { q: '有翅膀嗎？', x: 600, y: 52, yes: 'q2', no: 'q3', yt: '有翅膀', nt: '沒有翅膀', hint: '看看牠的背上和身體兩側，有沒有可以用來飛的構造。' },
    q2: { q: '體表有羽毛嗎？', x: 300, y: 178, yes: 'sparrow', no: 'butterfly', yt: '有羽毛', nt: '沒有羽毛', hint: '仔細看牠身體和翅膀的表面是什麼樣子。' },
    q3: { q: '有四肢嗎？', x: 860, y: 178, yes: 'q4', no: 'q5', yt: '有四肢', nt: '沒有四肢', hint: '數一數牠有幾隻腳。' },
    q4: { q: '體表有毛嗎？', x: 700, y: 326, yes: 'cat', no: 'frog', yt: '體表有毛', nt: '體表沒有毛', hint: '看看牠的皮膚表面是什麼樣子。' },
    q5: { q: '有鰭嗎？', x: 1030, y: 326, yes: 'fish', no: 'snail', yt: '有鰭', nt: '沒有鰭', hint: '看看牠的背上、腹部和尾巴。' },
  };
  const LEAF = { sparrow: [170, 326], butterfly: [430, 326], cat: [600, 496], frog: [780, 496], fish: [950, 496], snail: [1110, 496] };
  // 從最上面走到某種生物的路線：[[問題, 'yes'|'no'], …]
  const pathTo = (org, n = 'q1', acc = []) => {
    if (n === org) return acc;
    if (!NODES[n]) return null;
    return pathTo(org, NODES[n].yes, [...acc, [n, 'yes']]) || pathTo(org, NODES[n].no, [...acc, [n, 'no']]);
  };

  const MISSIONS = [
    { title: '這是什麼生物？', org: 'frog' },
    { title: '再找一種', org: 'butterfly' },
    { title: '水裡的生物', org: 'fish' },
    { title: '哪一個特徵分開牠們？', quiz: { q: '在這個檢索表上，「家貓」和「青蛙」是在哪一個問題被分開的？', opts: ['有翅膀嗎？', '有四肢嗎？', '體表有毛嗎？', '有鰭嗎？'], ans: 2, hint: '在檢索表上分別找出家貓和青蛙，從最上面往下走，看看兩條路線在哪一個問題開始分岔。' },
      why: '家貓和青蛙都<b>沒有翅膀、有四肢</b>，走到「<b>體表有毛嗎？</b>」才分開。兩種生物的路線一起走得越久，在這張檢索表用到的特徵中，相同的越多。' },
  ];

  S.registerLab({
    id: 'lab-key', section: '下3-3', title: '檢索表',
    mount(box) {
      box.innerHTML = `
<style>
  .labX2 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labX2 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labX2 .pad { padding: 1rem 1.25rem; }
  .labX2 .yn { display: flex; gap: 0.6rem; margin: 0.6rem 0; }
  .labX2 .yn .ctl { flex: 1 1 0; justify-content: center; font-size: 1.15rem; padding: 0.7em 1em; }
  .labX2 .trail { font-size: 0.95rem; color: var(--muted); margin: 0.2rem 0 0.4rem; }
  .labX2 .trail b { color: var(--ink); }
  .labX2 .table-wrap { overflow-x: auto; }
  @media (max-width: 900px) {
    .labX2 { display: flex; flex-direction: column; align-items: stretch; }
    .labX2 .col { display: contents; }
    .labX2 .c-stage { order: 1; } .labX2 .c-mis { order: 2; } .labX2 .c-table { order: 3; } .labX2 .c-ctl { order: 4; }
  }
</style>
<div class="labX2">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 640" role="img" aria-label="二分法檢索表：從「有翅膀嗎？」開始，一路分到麻雀、蝴蝶、家貓、青蛙、吳郭魚、蝸牛"></svg></div>
      <div class="pad">
        <p class="status-line" id="labX2-status" aria-live="polite"></p>
        <p class="footnote">這是只為這 6 種生物設計的簡易二分法檢索表；換成別的生物，就要改用其他特徵。圖中的生物沒有依照真實大小。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>辨識紀錄</h3><div class="table-wrap" id="labX2-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labX2-mission"></div>
    <details class="card pad free c-ctl" id="labX2-free"><summary>自由探索：自己選一種生物來查</summary>
      <div class="btn-row" id="labX2-pick">${Object.entries(ORG).map(([k, [n]]) => `<button class="ctl small" type="button" data-o="${k}">${n}</button>`).join('')}</div>
      <div id="labX2-walk" style="margin-top:0.8rem"></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labX2-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 640, fill: C.bg }, svg);
      const root = g(svg);

      // ---------- 檢索表（樹狀圖）----------
      const edgeG = g(root), nodeG = g(root), leafG = g(root);
      const NH = 46;
      const edges = {};
      const posOf = (k) => (NODES[k] ? [NODES[k].x, NODES[k].y] : LEAF[k]);
      Object.entries(NODES).forEach(([k, n]) => {
        ['yes', 'no'].forEach((a) => {
          const c = n[a], [cx, cy] = posOf(c), top = NODES[c] ? cy - NH / 2 : cy - 44;
          const x1 = n.x + (a === 'yes' ? -24 : 24), y1 = n.y + NH / 2;
          const ln = el('line', { x1, y1, x2: cx, y2: top, stroke: '#4a6272', 'stroke-width': 3, 'stroke-linecap': 'round' }, edgeG);
          const mx = x1 + (cx - x1) * 0.45, my = y1 + (top - y1) * 0.45;
          const lb = g(edgeG); // 圈的半徑 20：字放大到 24 後，圈裡留一點空
          el('circle', { cx: mx, cy: my, r: 20, fill: C.bg, stroke: a === 'yes' ? YES : NO, 'stroke-width': 2 }, lb);
          text(lb, mx, my + 8.5, a === 'yes' ? '是' : '否', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: a === 'yes' ? YES : NO });
          edges[k + a] = ln;
        });
      });
      const nodeEls = {};
      Object.entries(NODES).forEach(([k, n]) => {
        const w = S.textWidth(n.q, 24) + 34;
        const ng = g(nodeG);
        const r = el('rect', { x: n.x - w / 2, y: n.y - NH / 2, width: w, height: NH, rx: 12, fill: '#16293a', stroke: '#4a6272', 'stroke-width': 2.5 }, ng);
        text(ng, n.x, n.y + 8, n.q, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        nodeEls[k] = r;
      });
      const leafEls = {}, leafPics = {};
      const reveal = (k, on = true) => { leafPics[k][0].setAttribute('opacity', on ? 1 : 0); leafPics[k][1].style.display = on ? 'none' : ''; };
      Object.entries(LEAF).forEach(([k, [x, y]]) => {
        const [n, draw, s, , dy] = ORG[k];
        const lg = g(leafG);
        const ring = el('rect', { x: x - 66, y: y - 44, width: 132, height: 110, rx: 14, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, lg);
        const pic = g(lg, { opacity: 0 }); // 查出來以後才顯示圖
        draw(S.place(g(pic), { x, y: y - 6 + dy * s, s }));
        const q = text(lg, x, y + 6, '？', { 'font-size': 34, 'text-anchor': 'middle', fill: '#4a6272', 'font-weight': 700 });
        text(lg, x, y + 54, n, { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
        leafEls[k] = ring; leafPics[k] = [pic, q];
      });
      // 左下角：要辨識的生物
      const spec = g(root);
      el('rect', { x: 24, y: 410, width: 470, height: 214, rx: 18, fill: '#101f2b', stroke: '#4a6272', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, spec);
      const specTitle = text(spec, 44, 446, '', { 'font-size': 24, 'font-weight': 700, fill: C.hi });
      const specPic = g(spec);
      const specName = text(spec, 470, 600, '', { 'font-size': 30, 'text-anchor': 'end', 'font-weight': 700, fill: C.hi });

      // ---------- 走檢索表 ----------
      // 任務和自由探索各有自己的路線；舞台顯示「目前在操作」的那一個（walk）
      const walks = { mission: null, free: null };
      let walk = null;
      function show(w) {
        walk = w;
        specPic.innerHTML = '';
        if (w) {
          const [, draw, , big, dy] = ORG[w.org];
          draw(S.place(g(specPic), { x: 250, y: 536 + dy * big * 0.5, s: big }));
          specTitle.textContent = w.done ? '找到了！這是：' : '這是什麼生物？';
          specName.textContent = w.done ? ORG[w.org][0] : '';
        }
        paint();
      }
      function startWalk(org, mode) { walks[mode] = { org, node: 'q1', path: [], wrong: null, done: false, mode }; show(walks[mode]); }
      function answer(w, a) {
        if (!w || w.done) return;
        if (walk !== w) show(w);
        const truth = pathTo(w.org).find(([q]) => q === w.node)[1];
        if (a !== truth) { w.wrong = a; paint(); return; }
        w.wrong = null;
        w.path.push([w.node, a]);
        const nx = NODES[w.node][a];
        w.node = nx;
        if (!NODES[nx]) { w.done = true; specTitle.textContent = '找到了！這是：'; specName.textContent = ORG[nx][0]; reveal(nx); log.push({ org: nx, path: w.path.slice() }); drawLog(); }
        paint();
      }
      function paint(extra) {
        Object.values(edges).forEach((e) => { e.setAttribute('stroke', '#4a6272'); e.setAttribute('stroke-width', 3); });
        Object.values(nodeEls).forEach((r) => { r.setAttribute('stroke', '#4a6272'); r.setAttribute('fill', '#16293a'); });
        Object.values(leafEls).forEach((r) => { r.setAttribute('stroke', '#2b4252'); r.setAttribute('stroke-width', 2); });
        const lit = (path, col) => path.forEach(([q, a]) => { edges[q + a].setAttribute('stroke', col); edges[q + a].setAttribute('stroke-width', 6); nodeEls[q].setAttribute('stroke', col); });
        if (extra) { extra.forEach(([org, col]) => { lit(pathTo(org), col); leafEls[org].setAttribute('stroke', col); leafEls[org].setAttribute('stroke-width', 4); }); }
        else if (walk) {
          lit(walk.path, C.hi);
          if (walk.done) { leafEls[walk.node].setAttribute('stroke', C.hi); leafEls[walk.node].setAttribute('stroke-width', 5); }
          else { nodeEls[walk.node].setAttribute('stroke', C.hi); nodeEls[walk.node].setAttribute('fill', 'rgba(255,209,102,0.16)'); }
        }
        status();
      }
      const trailText = (path) => path.map(([q, a]) => `<b>${a === 'yes' ? NODES[q].yt : NODES[q].nt}</b>`).join(' → ');
      function status() {
        if (!walk) { $('status').innerHTML = ''; return; }
        if (walk.done) $('status').innerHTML = `${trailText(walk.path)} → 這是<b>${ORG[walk.node][0]}</b>。`;
        else $('status').innerHTML = `目前的問題：<b>${NODES[walk.node].q}</b>（看左下角的生物來回答）`;
      }
      // 是／否按鈕（任務卡和自由探索共用）
      function walkHtml(w) {
        if (!w) return '';
        let h = w.path.length ? `<p class="trail">${trailText(w.path)}</p>` : '';
        if (w.done) return h;
        h += `<p class="m-text">${NODES[w.node].q}</p><div class="yn"><button class="ctl primary" type="button" data-a="yes">是</button><button class="ctl primary" type="button" data-a="no">否</button></div>`;
        if (w.wrong) h += `<div class="fb bad"><strong>再看一次</strong>${NODES[w.node].hint}</div>`;
        return h;
      }
      const bindWalk = (c, w, after) => c.querySelectorAll('.yn [data-a]').forEach((b) => b.addEventListener('click', () => { answer(w, b.dataset.a); after(); }));

      // ---------- 紀錄 ----------
      const log = [];
      function drawLog() {
        if (!log.length) { $('log').innerHTML = '<p class="m-hint">每查出一種生物，路線會列在這裡。</p>'; return; }
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>生物</th><th>檢索的路線</th></tr></thead><tbody>${log.map((r) => `<tr><th>${ORG[r.org][0]}</th><td>${r.path.map(([q, a]) => (a === 'yes' ? NODES[q].yt : NODES[q].nt)).join(' → ')}</td></tr>`).join('')}</tbody></table>`;
      }

      // ---------- 自由探索 ----------
      function drawFree() {
        const c = $('walk'), w = walks.free;
        if (!w) { c.innerHTML = '<p class="m-hint">選一種生物，再一題一題回答。</p>'; return; }
        c.innerHTML = walkHtml(w) + (w.done ? `<div class="fb ok"><strong>找到了：${ORG[w.node][0]}</strong>換另一種生物試試看。</div>` : '');
        bindWalk(c, w, drawFree);
      }
      box.querySelectorAll('#labX2-pick [data-o]').forEach((b) => b.addEventListener('click', () => { startWalk(b.dataset.o, 'free'); drawFree(); }));

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, picked = -1, done = false;
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-key'); // 上次存下的進度（要在第一次畫圓點之前讀）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      function goMission(k) {
        if (done) doneK.add(mi);
        mi = k; setupMission(); drawMission();
      }
      S.onDots(mbox, goMission);
      function setupMission() {
        const m = MISSIONS[mi];
        picked = -1; done = false;
        if (!m) return;
        if (m.org) startWalk(m.org, 'mission');
        else { walks.mission = null; walk = null; specPic.innerHTML = ''; specTitle.textContent = ''; specName.textContent = ''; paint(); B().cat(S.place(g(specPic), { x: 150, y: 540, s: 0.8 })); B().frog(S.place(g(specPic), { x: 360, y: 530, s: 1.1 })); specTitle.textContent = '家貓和青蛙'; $('status').innerHTML = '找出家貓和青蛙在檢索表上的位置。'; }
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>檢索表的用法</strong>從最上面開始，每次只看一個特徵，回答「是」或「否」，一步步縮小範圍，最後找到生物的名稱。<br>兩種生物的路線越晚分開，在這張表用到的特徵中相同的越多；檢索表是用來查名稱的，不代表親緣關係的遠近。</div>
            <button class="ctl primary" type="button" id="labX2-again">再練習一次</button>`;
          mbox.querySelector('#labX2-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.org) {
          const w = walks.mission;
          html += `<p class="m-hint">看左下角的生物，從檢索表最上面開始，一次回答一個問題。</p>` + walkHtml(w);
          if (w && w.done) {
            done = true;
            html += `<div class="fb ok"><strong>找到了：${ORG[m.org][0]}</strong>${trailText(w.path)}。每次只看一個特徵，就能一步步縮小範圍。</div>`;
          }
        } else {
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        }
        if (done) html += `<button class="ctl primary" type="button" id="labX2-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        if (walks.mission) bindWalk(mbox, walks.mission, drawMission);
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === m.quiz.ans) { done = true; reveal('cat'); reveal('frog'); paint([['cat', '#9fd8ff'], ['frog', YES]]); nodeEls.q4.setAttribute('fill', 'rgba(255,209,102,0.16)'); nodeEls.q4.setAttribute('stroke', C.hi); $('status').innerHTML = '藍色：家貓的路線；綠色：青蛙的路線。兩條路線在「<b>體表有毛嗎？</b>」分開。'; }
          else picked = k;
          drawMission();
        }));
        const nx = mbox.querySelector('#labX2-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function reset() {
        log.length = 0; drawLog(); walks.free = null;
        Object.keys(ORG).forEach((k) => reveal(k, false));
        mi = 0; doneK.clear(); setupMission();
        $('free').open = false;
        drawFree(); drawMission();
      }
      reset();
      // 接上上次的進度：圓點照舊，從第一個還沒做的任務開始；全部做完就顯示結果（左下角不留著第 1 題的生物）
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < MISSIONS.length).forEach((k) => doneK.add(k));
        const k0 = MISSIONS.findIndex((_, k) => !doneK.has(k));
        if (k0 < 0) { walks.mission = null; show(null); specTitle.textContent = ''; specName.textContent = ''; }
        goMission(k0 < 0 ? MISSIONS.length : k0);
      }
      S._labX2 = { walks, get walk() { return walk; }, answer, get mi() { return mi; } }; // 測試用
      return { unmount() { delete S._labX2; } };
    },
  });
})();
