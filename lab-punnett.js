/* 互動模型：棋盤方格（七下 2-1）— 豌豆種子的形狀：圓形（R，顯性）、皺縮（r，隱性）。
   任務：配對 Rr × Rr → 比例；預測 Rr × rr；由子代反推親代的基因型。完整設定收在「自由探索」。 */
(() => {
  const { el, g, text, C } = S;
  const DOM = '#ffd166', REC = '#8fd3ff';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const GTS = ['RR', 'Rr', 'rr'];
  const phen = (gt) => (gt.includes('R') ? '圓形' : '皺縮');
  const sortG = (a, b) => (a === 'R' && b === 'r' ? 'Rr' : b === 'R' && a === 'r' ? 'Rr' : a + b);

  // 種子：圓形或皺縮（和動畫「孟德爾的遺傳法則」同樣的畫法）
  function seed(p, x, y, r, round) {
    const sg = S.place(g(p), { x, y });
    const f = '#93c95a', e = '#557f2c', hl = '#d4f0a8';
    if (round) {
      el('circle', { cx: 0, cy: 0, r, fill: f, stroke: e, 'stroke-width': Math.max(1.5, r / 14) }, sg);
      el('ellipse', { cx: -r * 0.32, cy: -r * 0.34, rx: r * 0.3, ry: r * 0.2, fill: hl, opacity: 0.55, transform: `rotate(-35 ${-r * 0.32} ${-r * 0.34})` }, sg);
      el('ellipse', { cx: r * 0.55, cy: r * 0.1, rx: r * 0.1, ry: r * 0.2, fill: e, opacity: 0.5 }, sg);
    } else {
      const pts = S.blobPts(0, 0, r * 0.95, r * 0.9, 48, [[4, 0.05, 0.5], [7, 0.035, 1.7], [2, 0.03, 0.2]]);
      el('path', { d: S.smoothPath(pts), fill: f, stroke: e, 'stroke-width': Math.max(1.5, r / 14) }, sg);
      const Q = (a, b, c, d, e2, f2) => `M${a * r},${b * r} Q${c * r},${d * r} ${e2 * r},${f2 * r}`;
      const cr = [Q(-0.78, -0.12, -0.3, -0.02, 0.02, -0.38), Q(0.02, -0.38, 0.32, -0.2, 0.7, -0.3), Q(0.02, -0.38, 0.14, 0.02, -0.04, 0.36),
        Q(-0.04, 0.36, 0.3, 0.42, 0.62, 0.26), Q(-0.04, 0.36, -0.34, 0.46, -0.6, 0.4), Q(0.02, -0.38, -0.1, -0.62, -0.3, -0.78)];
      cr.forEach((d) => el('path', { d, fill: 'none', stroke: e, 'stroke-width': r / 5, 'stroke-linecap': 'round', opacity: 0.18 }, sg));
      cr.forEach((d) => el('path', { d, fill: 'none', stroke: e, 'stroke-width': Math.max(1.2, r / 16), 'stroke-linecap': 'round', opacity: 0.85 }, sg));
      el('ellipse', { cx: -r * 0.36, cy: -r * 0.42, rx: r * 0.16, ry: r * 0.1, fill: hl, opacity: 0.5, transform: `rotate(-30 ${-r * 0.36} ${-r * 0.42})` }, sg);
    }
    return sg;
  }
  function geno(p, x, y, str, size = 30, attrs = {}) {
    const t = el('text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', ...attrs }, p);
    for (const ch of str) { const s = el('tspan', { fill: ch === 'R' ? DOM : REC }, t); s.textContent = ch; }
    return t;
  }
  const gamete = (p, x, y, ch, r = 26) => {
    const gg = S.place(g(p), { x, y });
    el('circle', { cx: 0, cy: 0, r, fill: '#1a2c3a', stroke: ch === 'R' ? DOM : REC, 'stroke-width': 3 }, gg);
    geno(gg, 0, r * 0.36, ch, r * 1.05);
    return gg;
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 比例文字：省略 0，約分
  const ratio = (names, counts) => {
    const pairs = names.map((n, i) => [n, counts[i]]).filter(([, c]) => c > 0);
    if (pairs.length === 1) return `全部是${/^[A-Za-z]/.test(pairs[0][0]) ? ' ' : ''}${pairs[0][0]}`;
    const d = pairs.reduce((m, [, c]) => gcd(m, c), 0);
    return `${pairs.map(([n]) => n).join('：')} ＝ ${pairs.map(([, c]) => c / d).join('：')}`;
  };
  function cross(a, b) {
    const top = [a[0], a[1]], left = [b[0], b[1]];
    const cells = left.map((l) => top.map((t) => sortG(l, t)));
    const flat = cells.flat();
    const nG = GTS.map((x) => flat.filter((y) => y === x).length);
    const nRound = flat.filter((x) => x.includes('R')).length;
    return { a, b, top, left, cells, nG, nRound, phen: ratio(['圓形', '皺縮'], [nRound, 4 - nRound]), gRatio: ratio(GTS, nG) };
  }

  const MISSIONS = [
    { title: '把方格填滿', text: '兩株都是 <b>Rr</b>（種子圓形）的豌豆交配。按「配對」，把精細胞和卵細胞的遺傳因子兩兩組合：', acts: [['配對 Rr × Rr', 'Rr', 'Rr']], need: (L) => L.some((r) => r.a === 'Rr' && r.b === 'Rr'),
      quiz: { q: '子代種子的表現型，圓形：皺縮是多少？', opts: ['3：1', '1：1', '1：2：1', '全部是圓形'], ans: 0, hint: '表現型看的是外表。數一數：哪幾格有 R（圓形）？哪幾格是 rr（皺縮）？' },
      why: '4 格中有 3 格帶有 R（RR、Rr、Rr）表現圓形，1 格 rr 表現皺縮：圓形：皺縮 ＝ <b>3：1</b>。基因型 RR：Rr：rr ＝ 1：2：1，不要和表現型比例搞混。' },
    { title: '和隱性的交配', predict: { q: '<b>Rr</b>（圓形）和 <b>rr</b>（皺縮）交配，子代會怎樣？點一下你的預測，就開始配對：', opts: ['全部是圓形', '圓形：皺縮 ＝ 1：1', '圓形：皺縮 ＝ 3：1'], ans: 1, cross: ['Rr', 'rr'] },
      why: 'rr 的配子都帶 r；Rr 的配子一半帶 R、一半帶 r。所以子代一半是 Rr（圓形）、一半是 rr（皺縮）：<b>1：1</b>。' },
    { title: '反推親代（一）', pick: { q: '一株種子圓形的豌豆和 <b>rr</b> 交配，子代<b>全部是圓形</b>。這株圓形豌豆的基因型是？點一下，用棋盤方格驗證：', opts: [['RR', 'RR', 'rr'], ['Rr', 'Rr', 'rr']], show: ['?R', 'rr'], ok: (c) => c.nRound === 4, wrong: '這樣配對會出現皺縮（rr）的子代，和題目「全部是圓形」不一樣。' },
      why: '<b>RR</b> 的配子都帶 R，不論和誰配對，子代都至少有一個 R，所以全部是圓形。只要親代帶有 r，就可能出現皺縮。' },
    { title: '反推親代（二）', pick: { q: '兩株豌豆交配，子代的圓形：皺縮 ≈ <b>1：1</b>。親代的基因型可能是？點一下驗證：', opts: [['RR × rr', 'RR', 'rr'], ['Rr × rr', 'Rr', 'rr'], ['Rr × Rr', 'Rr', 'Rr'], ['RR × Rr', 'RR', 'Rr']], show: ['??', '??'], ok: (c) => c.nRound === 2, wrong: '看看右邊的結果：圓形和皺縮的比例是 1：1 嗎？' },
      why: '1：1 表示一半的子代是 rr：一方是 Rr（一半配子帶 r），另一方是 rr（配子都帶 r），所以是 <b>Rr × rr</b>。' },
    { title: '反推親代（三）', pick: { q: '兩株種子圓形的豌豆交配，子代<b>出現了皺縮</b>的種子。這兩株的基因型是？點一下驗證：', opts: [['RR × RR', 'RR', 'RR'], ['RR × Rr', 'RR', 'Rr'], ['Rr × Rr', 'Rr', 'Rr']], show: ['?R', '?R'], ok: (c) => c.nRound < 4, wrong: '這樣配對，子代會出現 rr（皺縮）嗎？看看方格裡有沒有 rr。' },
      why: '子代要表現皺縮，必須是 <b>rr</b>：兩個 r 分別來自父方和母方。所以兩株圓形的親代都帶有 r，都是 <b>Rr</b>。親代都表現顯性，子代卻出現另一種特徵，這種特徵就是隱性。' },
  ];

  S.registerLab({
    id: 'lab-punnett', section: '下2-1', title: '棋盤方格',
    mount(box) {
      box.innerHTML = `
<style>
  .labU1 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labU1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labU1 .pad { padding: 1rem 1.25rem; }
  .labU1 .table-wrap { overflow-x: auto; }
  .labU1 .tbl { min-width: 22rem; }
  .labU1 .mono { font-family: var(--font-mono); }
  @media (max-width: 900px) {
    .labU1 { display: flex; flex-direction: column; align-items: stretch; }
    .labU1 .col { display: contents; }
    .labU1 .c-stage { order: 1; } .labU1 .c-mis { order: 2; } .labU1 .c-table { order: 3; } .labU1 .c-ctl { order: 4; }
  }
</style>
<div class="labU1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="棋盤方格：上面是精細胞，左邊是卵細胞，方格裡是子代"></svg></div>
      <div class="pad">
        <p class="status-line" id="labU1-status" aria-live="polite"></p>
        <p class="footnote">＊四個方格代表四種機會相同的組合（各 1/4），不是真的只會生出 4 顆種子；子代越多，結果越接近算出來的比例。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>配對紀錄</h3><div class="table-wrap" id="labU1-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labU1-mission"></div>
    <details class="card pad free c-ctl" id="labU1-free"><summary>自由探索：自己選親代的基因型</summary>
      <div class="field"><div class="field-head"><span>親代甲（提供精細胞）</span></div>
        <div class="seg-ctl" role="group" aria-label="親代甲" id="labU1-a">${GTS.map((x) => `<button type="button" class="mono" data-v="${x}">${x}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>親代乙（提供卵細胞）</span></div>
        <div class="seg-ctl" role="group" aria-label="親代乙" id="labU1-b">${GTS.map((x) => `<button type="button" class="mono" data-v="${x}">${x}</button>`).join('')}</div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labU1-go">配對</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labU1-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { a: 'Rr', b: 'Rr' };
      const log = [];
      let tl = null, busy = false, cur = null;

      // ---------- 固定的版面 ----------
      const GX = 420, GY = 170, CS = 160;
      text(root, GX + CS, 60, '精細胞（來自親代甲）', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(root, GX - 50, 196, '卵細胞', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      const arw = (x1, y1, x2, y2) => { el('line', { x1, y1, x2: x2 - 10, y2, stroke: '#4a6272', 'stroke-width': 3 }, root); el('path', { d: `M${x2},${y2} l-14,-8 l0,16 Z`, fill: '#4a6272' }, root); };
      arw(296, 110, 466, 110); arw(290, 330, 336, 330);
      for (let i = 0; i <= 2; i++) {
        el('line', { x1: GX, y1: GY + i * CS, x2: GX + 2 * CS, y2: GY + i * CS, stroke: '#4a6272', 'stroke-width': 3 }, root);
        el('line', { x1: GX + i * CS, y1: GY, x2: GX + i * CS, y2: GY + 2 * CS, stroke: '#4a6272', 'stroke-width': 3 }, root);
      }
      text(root, GX + CS, GY + 2 * CS + 52, '每一格的機會都一樣（各 1/4）＊', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 親代（左上、左下）
      const parA = g(root), parB = g(root);
      // gt 開頭是「?」：基因型未知（'?R' 表示種子是圓形，'??' 表示連表現型也不知道）
      const parAt = (grp, x, y, gt, label) => {
        grp.innerHTML = '';
        const unk = gt[0] === '?', knownRound = unk ? gt[1] === 'R' : gt.includes('R');
        if (unk && gt[1] === '?') { el('circle', { cx: x - 52, cy: y, r: 30, fill: 'none', stroke: '#4a6272', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, grp); }
        else seed(grp, x - 52, y, 30, knownRound);
        if (unk) text(grp, x + 22, y + 13, '？', { 'font-size': 38, 'text-anchor': 'middle', 'font-weight': 700, fill: C.ink2 });
        else geno(grp, x + 22, y + 13, gt, 38);
        text(grp, x - 14, y + 64, unk && gt[1] === '?' ? label : `${label}（${knownRound ? '圓形' : '皺縮'}）`, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      };
      // 配子與方格內容
      const layer = g(root);
      // 右：結果
      const RX = 790, RW = 380;
      el('rect', { x: RX, y: 170, width: RW, height: 310, rx: 18, ...FRAME }, root);
      text(root, RX + RW / 2, 214, '子代', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const resG = g(root);

      function drawParents(a, b) {
        parAt(parA, 196, 110, a, '親代甲');
        parAt(parB, 196, 330, b, '親代乙');
      }
      function clearCells() { layer.innerHTML = ''; resG.innerHTML = ''; }
      function showWait() {
        resG.innerHTML = '';
        text(resG, RX + RW / 2, 310, '先數一數方格裡的種子，', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        text(resG, RX + RW / 2, 346, '回答問題後再顯示比例', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      }
      function showResult(c) {
        resG.innerHTML = '';
        text(resG, RX + RW / 2, 260, '表現型', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        const n = c.nRound, bw = 300, x0 = RX + (RW - bw) / 2;
        if (n > 0) el('rect', { x: x0, y: 278, width: (bw * n) / 4, height: 40, rx: 8, fill: 'rgba(255,209,102,0.25)', stroke: DOM, 'stroke-width': 2 }, resG);
        if (n < 4) el('rect', { x: x0 + (bw * n) / 4, y: 278, width: (bw * (4 - n)) / 4, height: 40, rx: 8, fill: 'rgba(143,211,255,0.2)', stroke: REC, 'stroke-width': 2 }, resG);
        for (let i = 0; i < 4; i++) seed(resG, x0 + bw / 8 + (i * bw) / 4, 298, 15, i < n);
        text(resG, RX + RW / 2, 362, c.phen, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        text(resG, RX + RW / 2, 408, '基因型', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        text(resG, RX + RW / 2, 448, c.gRatio, { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono' });
      }

      function run(a, b, done) {
        if (tl) tl.kill();
        busy = true;
        st.a = a; st.b = b; sync();
        drawParents(a, b);
        clearCells();
        const c = cross(a, b);
        cur = c;
        $('status').innerHTML = `親代甲 <b class="mono">${a}</b> × 親代乙 <b class="mono">${b}</b>：先寫出配子，再兩兩組合……`;
        const topG = c.top.map((ch, j) => gamete(layer, GX + CS / 2 + j * CS, 110, ch, 26));
        const leftG = c.left.map((ch, i) => gamete(layer, GX - 50, GY + CS / 2 + i * CS, ch, 26));
        topG.concat(leftG).forEach((x) => { x.style.opacity = 0; });
        const cellG = [];
        tl = gsap.timeline({ onComplete: () => { busy = false; finish(c, done); } });
        tl.to(topG, { opacity: 1, duration: 0.3, stagger: 0.1 });
        tl.to(leftG, { opacity: 1, duration: 0.3, stagger: 0.1 });
        // 每一格：上面和左邊的配子各飛一個進來
        c.cells.forEach((row, i) => row.forEach((gt, j) => {
          const cx = GX + CS / 2 + j * CS, cy = GY + CS / 2 + i * CS;
          const m1 = gamete(layer, 0, 0, c.top[j], 20), m2 = gamete(layer, 0, 0, c.left[i], 20);
          m1.style.opacity = 0; m2.style.opacity = 0;
          const cg = g(layer, { opacity: 0 });
          geno(cg, cx - 30, cy + 10, gt, 40);
          seed(cg, cx + 40, cy + 2, 24, gt.includes('R'));
          text(cg, cx - 30, cy + 56, phen(gt), { 'font-size': 22, 'text-anchor': 'middle', fill: gt.includes('R') ? DOM : REC });
          cellG.push(cg);
          const o = { u: 0 };
          tl.set([m1, m2], { opacity: 1 });
          tl.to(o, { u: 1, duration: 0.3, ease: 'power2.inOut', onUpdate: () => {
            S.place(m1, { x: S.lerp(cx, cx - 14, o.u), y: S.lerp(110, cy, o.u) });
            S.place(m2, { x: S.lerp(GX - 50, cx + 14, o.u), y: S.lerp(cy, cy, o.u) });
          } });
          tl.set([m1, m2], { opacity: 0 });
          tl.to(cg, { opacity: 1, duration: 0.2 });
        }));
        return c;
      }

      function finish(c, done) {
        c.mi = mi;
        log.push(c);
        if (done) done(c);
        present(c);
        drawMission();
      }
      // 任務的問題還沒答對時，不能先把答案（比例）顯示在舞台、說明列或紀錄上
      const hidden = () => { const m = MISSIONS[mi]; return !!m && ((m.quiz && !done) || (m.predict && pred < 0)); };
      function present(c) {
        if (hidden()) {
          showWait();
          $('status').innerHTML = '四個方格都填好了。數一數方格裡的種子，再回答任務卡上的問題。';
        } else {
          showResult(c);
          $('status').innerHTML = `親代甲 <b class="mono">${c.a}</b> × 親代乙 <b class="mono">${c.b}</b> → 子代基因型 <span class="mono">${c.gRatio}</span>；表現型 <b>${c.phen}</b>。`;
        }
        drawLog();
      }

      // 做任務時只列出這個任務的配對（前面任務的結果可能就是後面任務的答案）；全部完成後列出全部
      function drawLog() {
        const rows = mi >= MISSIONS.length ? log : log.filter((c) => c.mi === mi);
        if (!rows.length) { $('log').innerHTML = `<p class="m-hint">${mi >= MISSIONS.length || !log.length ? '每配對一次，結果會列在這裡。' : '這個任務的配對結果會列在這裡。'}</p>`; return; }
        const hide = hidden();
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>親代甲 × 親代乙</th><th>子代基因型</th><th>子代表現型</th></tr></thead><tbody>${rows.map((c, i) => `<tr><td>${i + 1}</td><td class="mono">${c.a} × ${c.b}</td>${hide && c.mi === mi ? '<td colspan="2" class="m-hint">回答問題後顯示</td>' : `<td class="mono">${c.gRatio}</td><td>${c.phen}</td>`}</tr>`).join('')}</tbody></table>`;
      }

      // ---------- 自由探索 ----------
      function sync() {
        box.querySelectorAll('#labU1-a button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.a));
        box.querySelectorAll('#labU1-b button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.b));
      }
      box.querySelectorAll('#labU1-a button').forEach((b) => b.addEventListener('click', () => { st.a = b.dataset.v; sync(); drawParents(st.a, st.b); clearCells(); }));
      box.querySelectorAll('#labU1-b button').forEach((b) => b.addEventListener('click', () => { st.b = b.dataset.v; sync(); drawParents(st.a, st.b); clearCells(); }));
      $('go').addEventListener('click', () => { if (!busy) run(st.a, st.b); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, tried = [];
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const sv = S.progress.lab('lab-punnett'); // 上次存下的進度（要在第一次畫圓點之前讀）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      const START ='豌豆種子的形狀：<b>圓形（R）</b>是顯性，<b>皺縮（r）</b>是隱性。按任務卡上的按鈕開始。';
      // 切換任務：正在配對的動畫先停止（不列入紀錄），清掉上一個任務的方格和結果，親代改成這個任務的條件
      function goMission(k) {
        if (done) doneK.add(mi);
        mi = k; done = false; picked = -1; pred = -1; tried = [];
        const nm = MISSIONS[mi];
        if (nm) {
          if (tl) tl.kill(); busy = false; cur = null;
          clearCells();
          if (nm.predict) drawParents(nm.predict.cross[0], nm.predict.cross[1]);
          else if (nm.pick) drawParents(nm.pick.show[0], nm.pick.show[1]);
          else drawParents(nm.acts[0][1], nm.acts[0][2]);
          $('status').innerHTML = nm.predict ? '先預測，再看棋盤方格的結果。' : nm.pick ? '點一個選項，就用棋盤方格驗證。' : START;
        }
        drawLog(); drawMission();
      }
      S.onDots(mbox, goMission);
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>棋盤方格的重點</strong>上面寫一方的配子，左邊寫另一方的配子，兩兩組合。<br>有 R 就表現顯性（圓形），rr 才表現隱性（皺縮）。<br>Rr × Rr → 3：1；Rr × rr → 1：1；親代有一方是 RR → 子代全部顯性。</div>
            <button class="ctl primary" type="button" id="labU1-again">再練習一次</button>`;
          mbox.querySelector('#labU1-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (done) html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else if (m.pick) {
          html += `<p class="m-text">${m.pick.q}</p><div class="opts">${m.pick.opts.map(([lab], k) => `<button class="opt mono ${done && tried[tried.length - 1] === k ? 'right' : tried.includes(k) ? 'wrong' : ''}" type="button" data-k="${k}" ${done || busy ? 'disabled' : ''}>${lab}</button>`).join('')}</div>`;
          if (!done && tried.length && !busy) html += `<div class="fb bad"><strong>不符合</strong>${m.pick.wrong}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          const ready = m.need(log.filter((c) => c.mi === mi)); // 只看這個任務的配對（回到這個任務時要重新配對）
          html += `<p class="m-text">${m.text}</p>`;
          if (!ready) html += `<div class="acts">${m.acts.map(([label], i) => `<button class="ctl primary" type="button" data-a="${i}" ${busy ? 'disabled' : ''}>${label}</button>`).join('')}</div>`;
          else {
            html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
            if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
            if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
          }
        }
        if (done) html += `<button class="ctl primary" type="button" id="labU1-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => { const [, a, bb] = m.acts[+b.dataset.a]; run(a, bb); drawMission(); }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p; drawMission();
          run(m.predict.cross[0], m.predict.cross[1], () => { done = true; });
        }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (m.pick) {
            if (busy) return;
            const [, a, bb] = m.pick.opts[k];
            if (!tried.includes(k)) tried.push(k); else { tried.splice(tried.indexOf(k), 1); tried.push(k); }
            run(a, bb, (c) => { if (m.pick.ok(c)) done = true; });
            drawMission();
            return;
          }
          if (k === m.quiz.ans) { done = true; if (cur) present(cur); } else picked = k;
          drawMission();
        }));
        const nx = mbox.querySelector('#labU1-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function reset() {
        if (tl) tl.kill();
        busy = false; log.length = 0; cur = null;
        mi = 0; done = false; picked = -1; pred = -1; tried = []; doneK.clear();
        st.a = 'Rr'; st.b = 'Rr'; sync();
        drawParents(st.a, st.b); clearCells();
        $('status').innerHTML = START;
        $('free').open = false;
        drawLog(); drawMission();
      }

      reset();
      // 接上上次的進度：圓點照舊，從第一個還沒做的任務開始；全部做完就顯示結果
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < MISSIONS.length).forEach((k) => doneK.add(k));
        const k0 = MISSIONS.findIndex((_, k) => !doneK.has(k));
        goMission(k0 < 0 ? MISSIONS.length : k0);
      }
      S._labU1 = { st, log, run, cross, get busy() { return busy; }, finishNow() { if (tl) tl.progress(1); } }; // 測試用
      return { unmount() { if (tl) tl.kill(); delete S._labU1; } };
    },
  });
})();
