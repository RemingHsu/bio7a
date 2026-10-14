/* 互動模型：血型推理（七下 2-2）— ABO 血型的棋盤方格、模擬生孩子（機率與樣本數）、由孩子反推父母、生男生女的機率 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const SKN = '#f2b38a', SKN_E = '#ffdcc4', HAIR = '#4a3426';
  const AC = { A: '#ffb35c', B: '#7fe0c8', AB: '#d6a8ff', O: '#8fd3ff' };
  const XC = '#ff9ec4', YC = '#7fc8ff';
  const ALC = { A: AC.A, B: AC.B, i: AC.O };
  const ORD = { A: 0, B: 1, i: 2 };
  const GTS = ['AA', 'Ai', 'BB', 'Bi', 'AB', 'ii'];
  const pair = (a, b) => (ORD[a] <= ORD[b] ? a + b : b + a);
  const btype = (gt) => (gt.includes('A') && gt.includes('B') ? 'AB' : gt.includes('A') ? 'A' : gt.includes('B') ? 'B' : 'O');
  const toI = (gt) => [...gt].map((c) => (c === 'i' ? 'i' : 'I' + c)).join(''); // 'Ai' → 'IAi'
  const html = (gt) => [...gt].map((c) => (c === 'i' ? 'i' : `I<sup>${c}</sup>`)).join('');

  // 頭肩像（和動畫「人類的遺傳」同樣的畫法）：臉圓、脖子短、肩膀平
  function person(p, x, y, s, { girl = false, adult = false, shirt = '#4f7896' } = {}) {
    const pg = S.place(g(p), { x, y, s });
    const k = Math.min(2, 1 / Math.max(0.35, s));
    if (girl) el('path', { d: adult ? 'M -52,-6 C -58,-60 58,-60 52,-6 L 56,64 C 50,74 36,72 32,62 L -32,62 C -36,72 -50,74 -56,64 Z' : 'M -52,-6 C -58,-58 58,-58 52,-6 L 54,44 C 48,54 36,52 32,42 L -32,42 C -36,52 -48,54 -54,44 Z', fill: HAIR }, pg);
    el('rect', { x: -15, y: 36, width: 30, height: 34, fill: SKN }, pg);
    el('path', { d: adult ? 'M -80,127 C -80,88 -68,71 -30,65 L 30,65 C 68,71 80,88 80,127 Z' : 'M -64,119 C -64,86 -54,71 -24,65 L 24,65 C 54,71 64,86 64,119 Z', fill: shirt, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 1.5 * k }, pg);
    el('path', { d: 'M -16,65 Q 0,78 16,65', fill: 'none', stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 2.5 * k, 'stroke-linecap': 'round' }, pg);
    [-47, 47].forEach((ex) => el('ellipse', { cx: ex, cy: 8, rx: 8, ry: 12, fill: SKN, stroke: SKN_E, 'stroke-width': 1.2 * k }, pg));
    el('ellipse', { cx: 0, cy: 4, rx: 46, ry: 48, fill: SKN, stroke: SKN_E, 'stroke-width': 1.2 * k }, pg);
    el('path', { d: girl ? 'M -50,6 C -56,-50 -20,-64 4,-62 C 32,-62 56,-46 50,6 C 44,-20 30,-32 10,-34 C -6,-26 -26,-24 -40,-18 Z' : 'M -48,2 C -54,-46 -22,-62 0,-62 C 22,-62 54,-46 48,2 C 44,-18 32,-30 0,-32 C -32,-30 -44,-18 -48,2 Z', fill: HAIR }, pg);
    el('path', { d: 'M -25,-7 Q -16,-12 -7,-7 M 7,-7 Q 16,-12 25,-7', fill: 'none', stroke: HAIR, 'stroke-width': 2.6 * k, 'stroke-linecap': 'round' }, pg);
    [-16, 16].forEach((ex) => { el('ellipse', { cx: ex, cy: 8, rx: 5, ry: 6.5, fill: '#3a2a20' }, pg); el('circle', { cx: ex + 1.8, cy: 5.5, r: 1.8, fill: '#fff' }, pg); });
    el('path', { d: 'M 0,15 Q -3,22 2,24', fill: 'none', stroke: '#c98762', 'stroke-width': 2 * k, 'stroke-linecap': 'round' }, pg);
    [-27, 27].forEach((ex) => el('ellipse', { cx: ex, cy: 25, rx: 8, ry: 5, fill: '#ff9aa8', opacity: 0.35 }, pg));
    el('path', { d: 'M -11,32 Q 0,40 11,32', fill: 'none', stroke: '#a0523c', 'stroke-width': 3 * k, 'stroke-linecap': 'round' }, pg);
    return pg;
  }
  function abo(p, x, y, str, size = 30, attrs = {}) {
    const t = el('text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', ...attrs }, p);
    let back = 0;
    for (let k = 0; k < str.length; k++) {
      const ch = str[k];
      if (ch === 'I' && 'AB'.includes(str[k + 1])) {
        const a = el('tspan', { fill: ALC[str[k + 1]], dy: back || null }, t); a.textContent = 'I';
        const sup = el('tspan', { fill: ALC[str[k + 1]], 'font-size': size * 0.62, dy: -size * 0.4 }, t); sup.textContent = str[k + 1];
        back = size * 0.4; k++;
      } else {
        const col = ch === 'i' ? ALC.i : ch === 'X' ? XC : ch === 'Y' ? YC : C.ink;
        const a = el('tspan', { fill: col, dy: back || null }, t); a.textContent = ch;
        back = 0;
      }
    }
    return t;
  }
  const rbc = (p, x, y, r = 12) => { el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.92, fill: '#d9465c', stroke: '#ff8f9f', 'stroke-width': 1.5 }, p); el('ellipse', { cx: x, cy: y, rx: r * 0.45, ry: r * 0.38, fill: '#b02c44' }, p); };

  const MISSIONS = [
    { title: '孩子可能是什麼血型？', predict: { q: '父親 A 型（<b>I<sup>A</sup>i</b>）、母親 B 型（<b>I<sup>B</sup>i</b>）。孩子可能是哪些血型？點一下預測，就用棋盤方格驗證：', opts: ['只可能是 A 型或 B 型', '可能是 A、B 或 AB 型', 'A、B、AB、O 型都有可能'], ans: 2, cross: ['Ai', 'Bi'] },
      why: '父親的精子帶 I<sup>A</sup> 或 i，母親的卵帶 I<sup>B</sup> 或 i，組合出 I<sup>A</sup>I<sup>B</sup>（AB）、I<sup>A</sup>i（A）、I<sup>B</sup>i（B）、ii（O），機率<b>各 1/4</b>。A 型和 B 型的父母也可能生下 O 型的孩子。' },
    { title: '生 10 個和生 200 個', text: '同一對父母（I<sup>A</sup>i × I<sup>B</sup>i）。模擬生孩子：每個孩子從父親、母親各<b>隨機</b>得到一個等位基因。兩種都試試看：', acts: [['生 10 個孩子', 10], ['全班合計 200 個', 200]], need: (R) => R.births.some((b) => b.n === 10 && b.mode === 'abo') && R.births.some((b) => b.n === 200 && b.mode === 'abo'),
      quiz: { q: '孩子的數量越多，四種血型的比例會怎樣？', opts: ['越接近 1：1：1：1', '越不接近 1：1：1：1', '和數量沒有關係'], ans: 0, hint: '比較 10 個和 200 個的結果：哪一次四種血型的數量比較平均？可以多按幾次再比較。' },
      why: '每個孩子是 O 型的機率都是 1/4，但只生 10 個時，結果常常不平均；數量越多，比例越接近棋盤方格算出的 <b>1：1：1：1</b>。所以實驗要統計全班的資料。' },
    { title: 'AB 型和 O 型的父母', predict: { q: '父親 AB 型（<b>I<sup>A</sup>I<sup>B</sup></b>）、母親 O 型（<b>ii</b>）。他們的孩子會是什麼血型？點一下預測：', opts: ['可能是 O 型', '可能是 AB 型', '只會是 A 型或 B 型'], ans: 2, cross: ['AB', 'ii'] },
      why: '父親的精子帶 I<sup>A</sup> 或 I<sup>B</sup>，母親的卵都帶 i：孩子是 I<sup>A</sup>i（A 型）或 I<sup>B</sup>i（B 型），<b>不會是 AB 型，也不會是 O 型</b>。' },
    { title: '由孩子反推', pick: { q: '父親 A 型、母親 O 型（ii），生下一個 <b>O 型</b>的孩子。父親的基因型是？點一下，用棋盤方格驗證：', opts: [['I<sup>A</sup>I<sup>A</sup>', 'AA', 'ii'], ['I<sup>A</sup>i', 'Ai', 'ii']], show: ['A', 'ii'], ok: (c) => c.flat.includes('ii'), wrong: '這樣配對，孩子會出現 ii（O 型）嗎？看看方格裡有沒有 ii。' },
      why: 'O 型孩子是 <b>ii</b>：一個 i 來自母親、一個 i 來自父親。所以 A 型的父親一定帶有 i，是 <b>I<sup>A</sup>i</b>。' },
    { title: '生男生女的機率', text: '人類的性別由性染色體決定：父親 XY、母親 XX。按按看，模擬生 10 個孩子（可以多按幾次）：', acts: [['生 10 個孩子', 'sex']], need: (R) => R.births.some((b) => b.mode === 'sex'),
      quiz: { q: '這對父母再生一個孩子，是男孩的機率是多少？', opts: ['1/2', '要看前面已經生了幾個男孩', '1/4'], ans: 0, hint: '看看棋盤方格：精子帶 X 或 Y，每一次受精都是重新隨機的，和前面生的孩子有關係嗎？' },
      why: '卵都帶 X，精子帶 X 或 Y 各一半：每一胎是男孩的機率都是 <b>1/2</b>，不受前面生的孩子影響。只生 10 個時，男女常常不剛好一半。' },
  ];

  S.registerLab({
    id: 'lab-blood', section: '下2-2', title: '血型推理',
    mount(box) {
      box.innerHTML = `
<style>
  .labU2 { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labU2 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labU2 .pad { padding: 1rem 1.25rem; }
  .labU2 .table-wrap { overflow-x: auto; }
  .labU2 .tbl { min-width: 24rem; }
  .labU2 .mono { font-family: var(--font-mono); }
  .labU2 select { font: inherit; font-size: 0.95rem; padding: 0.35em 0.5em; border-radius: 0.5rem; border: 1px solid var(--line); background: var(--bg); color: var(--ink); }
  @media (max-width: 900px) {
    .labU2 { display: flex; flex-direction: column; align-items: stretch; }
    .labU2 .col { display: contents; }
    .labU2 .c-stage { order: 1; } .labU2 .c-mis { order: 2; } .labU2 .c-table { order: 3; } .labU2 .c-ctl { order: 4; }
  }
</style>
<div class="labU2">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="父母、棋盤方格和模擬生下的孩子"></svg></div>
      <div class="pad">
        <p class="status-line" id="labU2-status" aria-live="polite"></p>
        <p class="footnote">＊「生孩子」是用亂數模擬的：每個孩子從父親、母親各隨機得到一個等位基因（或性染色體），所以每次按的結果都不一樣。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>紀錄</h3><div class="table-wrap" id="labU2-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labU2-mission"></div>
    <details class="card pad free c-ctl" id="labU2-free"><summary>自由探索：自己選父母的基因型</summary>
      <div class="field"><div class="field-head"><label for="labU2-fa">父親的基因型</label></div>
        <select id="labU2-fa">${GTS.map((x) => `<option value="${x}">${toI(x)}（${btype(x)} 型）</option>`).join('')}</select></div>
      <div class="field"><div class="field-head"><label for="labU2-mo">母親的基因型</label></div>
        <select id="labU2-mo">${GTS.map((x) => `<option value="${x}">${toI(x)}（${btype(x)} 型）</option>`).join('')}</select></div>
      <p class="m-hint">選單裡的 IA、IB 就是 I<sup>A</sup>、I<sup>B</sup>。</p>
      <div class="btn-row"><button class="ctl primary" type="button" id="labU2-go">棋盤方格</button><button class="ctl" type="button" id="labU2-kids">生 10 個孩子</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labU2-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const st = { fa: 'Ai', mo: 'Bi', mode: 'abo' };
      const R = { crosses: [], births: [] };
      let tl = null, busy = false;

      // ---------- 父母 ----------
      const parG = g(root);
      function drawParents() {
        parG.innerHTML = '';
        person(parG, 130, 104, 0.58, { adult: true, shirt: '#3f6f8f' });
        person(parG, 130, 340, 0.58, { adult: true, girl: true, shirt: '#8a5f8f' });
        if (st.mode === 'sex') {
          text(parG, 130, 214, '父親', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
          abo(parG, 130, 256, 'XY', 30);
          text(parG, 130, 450, '母親', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
          abo(parG, 130, 492, 'XX', 30);
        } else {
          [[st.faType ? null : st.fa, 214, '父親'], [st.mo, 450, '母親']].forEach(([gt, y, who]) => {
            const bt = gt ? btype(gt) : st.faType; // 只知道血型、不知道基因型時顯示「？」
            text(parG, 130, y, `${who}：${bt} 型`, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: AC[bt] });
            if (gt) abo(parG, 130, y + 42, toI(gt), 30);
            else text(parG, 130, y + 42, '？', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.ink2 });
          });
        }
      }

      // ---------- 棋盤方格 ----------
      const GX = 400, GY = 170, CS = 140;
      const gridG = g(root);
      for (let i = 0; i <= 2; i++) {
        el('line', { x1: GX, y1: GY + i * CS, x2: GX + 2 * CS, y2: GY + i * CS, stroke: '#4a6272', 'stroke-width': 3 }, gridG);
        el('line', { x1: GX + i * CS, y1: GY, x2: GX + i * CS, y2: GY + 2 * CS, stroke: '#4a6272', 'stroke-width': 3 }, gridG);
      }
      text(gridG, GX + CS, 50, '精子', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      text(gridG, GX - 52, GY - 18, '卵', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2, 'font-weight': 700 });
      text(gridG, GX + CS, GY + 2 * CS + 46, '每一格的機會各 1/4', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const layer = g(root);
      const head = (p, x, y, a, edge) => { const h = S.place(g(p), { x, y }); el('circle', { cx: 0, cy: 0, r: 28, fill: '#1a2c3a', stroke: edge, 'stroke-width': 2.5 }, h); abo(h, 0, 11, a, 30); return h; };

      // ---------- 右：孩子 ----------
      const KX = 740, KW = 430;
      el('rect', { x: KX, y: 130, width: KW, height: 484, rx: 18, ...FRAME }, root);
      const kidsT = text(root, KX + KW / 2, 170, '模擬生孩子＊', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      const kidG = g(root), barG = g(root);

      function crossOf(fa, mo, mode) {
        const top = mode === 'sex' ? ['X', 'Y'] : [fa[0], fa[1]], left = mode === 'sex' ? ['X', 'X'] : [mo[0], mo[1]];
        const cells = left.map((l) => top.map((t) => (mode === 'sex' ? 'X' + t : pair(t, l))));
        return { fa, mo, mode, top, left, cells, flat: cells.flat() };
      }
      const cellInfo = (gt, mode) => (mode === 'sex' ? (gt === 'XX' ? ['XX', '女', XC] : ['XY', '男', YC]) : [toI(gt), `${btype(gt)} 型`, AC[btype(gt)]]);
      const alleleI = (a, mode) => (mode === 'sex' ? a : a === 'i' ? 'i' : 'I' + a);

      function runCross(fa, mo, mode, done) {
        if (tl) tl.kill();
        busy = true; st.mode = mode; st.faType = null;
        if (mode === 'abo') { st.fa = fa; st.mo = mo; syncFree(); }
        drawParents();
        layer.innerHTML = '';
        const c = crossOf(fa, mo, mode);
        status(mode === 'sex' ? '父親 XY × 母親 XX：精子帶 X 或 Y，卵都帶 X……' : `父親 ${html(fa)} × 母親 ${html(mo)}：先寫出精子和卵帶的等位基因，再兩兩組合……`);
        const tops = c.top.map((a, j) => head(layer, GX + CS / 2 + j * CS, 106, alleleI(a, mode), '#cfe3ee'));
        const lefts = c.left.map((a, i) => head(layer, GX - 52, GY + CS / 2 + i * CS, alleleI(a, mode), '#ffd9b0'));
        [...tops, ...lefts].forEach((h) => { h.style.opacity = 0; });
        tl = gsap.timeline({ onComplete: () => { busy = false; c.mi = mi; R.crosses.push(c); if (done) done(c); status(hidden() ? '方格填好了。看看每一格，再回答任務卡上的問題。' : summary(c)); drawLog(); drawMission(); } });
        tl.to(tops, { opacity: 1, duration: 0.3, stagger: 0.12 });
        tl.to(lefts, { opacity: 1, duration: 0.3, stagger: 0.12 });
        c.cells.forEach((row, i) => row.forEach((gt, j) => {
          const cx = GX + CS / 2 + j * CS, cy = GY + CS / 2 + i * CS;
          const [lab, sub, col] = cellInfo(gt, mode);
          const cg = g(layer, { opacity: 0 });
          abo(cg, cx, cy - 4, lab, 32);
          if (mode === 'abo') rbc(cg, cx - 40, cy + 34, 11);
          text(cg, mode === 'abo' ? cx + 10 : cx, cy + 42, sub, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
          tl.to(cg, { opacity: 1, duration: 0.3 }, '+=0.15');
        }));
        return c;
      }
      function summary(c) {
        if (c.mode === 'sex') return '子代：XX（女）和 XY（男）各占一半 → 每一胎是男孩的機率是 1/2。';
        const cnt = {}; c.flat.forEach((gt) => { const b = btype(gt); cnt[b] = (cnt[b] || 0) + 1; });
        return `父親 ${html(c.fa)} × 母親 ${html(c.mo)} → 孩子的血型：${Object.entries(cnt).map(([b, n]) => `${b} 型 ${n}/4`).join('、')}。`;
      }

      // ---------- 模擬生孩子（亂數） ----------
      const rand2 = () => (Math.random() < 0.5 ? 0 : 1);
      function births(n, mode) {
        if (tl && busy) tl.progress(1); // 棋盤方格還在畫：直接畫完
        st.mode = mode; drawParents();
        const fa = mode === 'sex' ? 'XY' : st.fa, mo = mode === 'sex' ? 'XX' : st.mo;
        if (!layer.childNodes.length || (R.crosses.length && R.crosses[R.crosses.length - 1].mode !== mode)) runCross(fa, mo, mode);
        const kids = [];
        for (let k = 0; k < n; k++) {
          if (mode === 'sex') kids.push(rand2() ? 'XY' : 'XX');
          else kids.push(pair(fa[rand2()], mo[rand2()]));
        }
        const cats = mode === 'sex' ? ['男', '女'] : ['A', 'B', 'AB', 'O'];
        const catOf = (gt) => (mode === 'sex' ? (gt === 'XY' ? '男' : '女') : btype(gt));
        const counts = cats.map((cname) => kids.filter((gt) => catOf(gt) === cname).length);
        const b = { n, mode, fa, mo, counts, cats, mi };
        R.births.push(b);
        drawKids(kids, b);
        status(`模擬生了 ${n} 個孩子：${cats.map((cname, i) => `${mode === 'sex' ? cname : cname + ' 型'} ${counts[i]} 個`).join('、')}。`);
        drawLog(); drawMission();
        return b;
      }
      function drawKids(kids, b) {
        kidG.innerHTML = ''; barG.innerHTML = '';
        kidsT.textContent = b.n > 10 ? `全班合計：${b.n} 個孩子＊` : `模擬生 ${b.n} 個孩子＊`;
        if (b.n <= 10) {
          kids.forEach((gt, k) => {
            const x = KX + 58 + (k % 5) * 78, y = 214 + Math.floor(k / 5) * 104;
            const girl = b.mode === 'sex' ? gt === 'XX' : Math.random() < 0.5;
            const kg = g(kidG, { opacity: 0 });
            person(kg, x, y, 0.34, { girl, shirt: girl ? '#8a6fb0' : '#4f7896' });
            const [, sub, col] = cellInfo(gt, b.mode);
            text(kg, x, y + 65, b.mode === 'sex' ? sub : sub.replace(' 型', ''), { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
            gsap.to(kg, { opacity: 1, duration: 0.25, delay: k * 0.06 });
          });
        } else {
          text(kidG, KX + KW / 2, 300, '（數量太多，只畫出統計）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        }
        // 長條
        const nC = b.cats.length, bw = 64, step = nC === 2 ? 180 : 100, base = 578, maxH = 108;
        const mx = Math.max(...b.counts, 1);
        b.cats.forEach((cname, i) => {
          const x = KX + KW / 2 + (i - (nC - 1) / 2) * step - bw / 2;
          const h = (b.counts[i] / mx) * maxH;
          const col = b.mode === 'sex' ? (cname === '男' ? YC : XC) : AC[cname];
          el('rect', { x, y: base - h, width: bw, height: Math.max(h, 1), rx: 6, fill: col, opacity: 0.75 }, barG);
          text(barG, x + bw / 2, base - h - 8, String(b.counts[i]), { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono', fill: C.ink });
          text(barG, x + bw / 2, base + 27, b.mode === 'sex' ? cname : `${cname} 型`, { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        });
      }
      function clearKids() { kidG.innerHTML = ''; barG.innerHTML = ''; kidsT.textContent = '模擬生孩子＊'; }

      // ---------- 紀錄 ----------
      // 問題還沒答對時，不能先把答案顯示在說明列或紀錄上
      const hidden = () => { const m = MISSIONS[mi]; return !!m && ((m.quiz && !done) || (m.predict && pred < 0)); };
      // 做任務時只列出這個任務的紀錄（前面任務的結果可能就是後面任務的答案）；全部完成後列出全部
      function drawLog() {
        const rows = [], mine = (x) => mi >= MISSIONS.length || x.mi === mi;
        R.crosses.filter(mine).forEach((c) => rows.push(['棋盤方格', c.mode === 'sex' ? 'XY × XX' : `${html(c.fa)} × ${html(c.mo)}`, hidden() && c.mi === mi ? '<span class="m-hint">回答問題後顯示</span>' : summary(c).split('→ ')[1] || '']));
        R.births.filter(mine).forEach((b) => rows.push([`模擬 ${b.n} 個`, b.mode === 'sex' ? 'XY × XX' : `${html(b.fa)} × ${html(b.mo)}`, b.cats.map((cname, i) => `${b.mode === 'sex' ? cname : cname + ' 型'} ${b.counts[i]}`).join('、')]));
        $('log').innerHTML = rows.length ? `<table class="tbl"><thead><tr><th>方法</th><th>父親 × 母親</th><th>結果</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>` : '<p class="m-hint">做過的推算和模擬會列在這裡。</p>';
      }
      const status = (h) => { $('status').innerHTML = h; };

      // ---------- 自由探索 ----------
      function syncFree() { $('fa').value = st.fa; $('mo').value = st.mo; }
      $('fa').addEventListener('change', () => { st.fa = $('fa').value; st.faType = null; st.mode = 'abo'; drawParents(); layer.innerHTML = ''; clearKids(); });
      $('mo').addEventListener('change', () => { st.mo = $('mo').value; st.mode = 'abo'; drawParents(); layer.innerHTML = ''; clearKids(); });
      $('go').addEventListener('click', () => { if (!busy) { clearKids(); runCross(st.fa, st.mo, 'abo'); } });
      $('kids').addEventListener('click', () => { st.mode = 'abo'; births(10, 'abo'); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1, tried = [];
      const doneK = new Set(); // 做完過的任務（點圓點可以回去再做）
      const dots = () => S.dots(MISSIONS.length, mi, (k) => (doneK.has(k) ? 'ok' : ''));
      // 切換任務：還在畫的棋盤方格先停止（不列入紀錄），換成新任務的條件
      function goMission(k) {
        if (done) doneK.add(mi);
        if (tl && busy) { if (done) tl.progress(1); else tl.kill(); } // 已完成的任務：方格直接畫完；沒完成的：停止，回呼不會影響新的任務
        busy = false;
        mi = k; done = false; picked = -1; pred = -1; tried = [];
        const nm = MISSIONS[mi];
        // 換任務：清掉上一個任務的方格和孩子，父母改成這個任務的條件
        if (nm) {
          if (tl) tl.kill(); busy = false;
          clearKids(); layer.innerHTML = '';
          if (nm.acts && nm.acts[0][1] === 'sex') runCross('XY', 'XX', 'sex');
          else if (nm.acts) runCross('Ai', 'Bi', 'abo');
          else {
            st.mode = 'abo';
            if (nm.predict) { st.fa = nm.predict.cross[0]; st.mo = nm.predict.cross[1]; st.faType = null; }
            else { st.faType = nm.pick.show[0]; st.mo = nm.pick.show[1]; }
            syncFree(); drawParents();
            status(nm.predict ? '先預測，再看棋盤方格的結果。' : '點一個選項，就用棋盤方格驗證。');
          }
        }
        drawLog(); drawMission();
      }
      S.onDots(mbox, goMission);
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>血型與性別的推理</strong>ABO 血型：I<sup>A</sup>、I<sup>B</sup> 對 i 是顯性；O 型一定是 ii，AB 型一定是 I<sup>A</sup>I<sup>B</sup>。<br>棋盤方格算出的是機率；孩子越多，結果越接近算出的比例。<br>每一胎是男孩的機率都是 1/2。</div>
            <button class="ctl primary" type="button" id="labU2-again">再練習一次</button>`;
          mbox.querySelector('#labU2-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let h = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          h += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (done) h += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else if (m.pick) {
          h += `<p class="m-text">${m.pick.q}</p><div class="opts">${m.pick.opts.map(([lab], k) => `<button class="opt mono ${done && tried[tried.length - 1] === k ? 'right' : tried.includes(k) ? 'wrong' : ''}" type="button" data-k="${k}" ${done || busy ? 'disabled' : ''}>${lab}</button>`).join('')}</div>`;
          if (!done && tried.length && !busy) h += `<div class="fb bad"><strong>不符合</strong>${m.pick.wrong}</div>`;
          if (done) h += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          const ready = m.need(R);
          h += `<p class="m-text">${m.text}</p><div class="acts">${m.acts.map(([label, n], i) => { const did = R.births.some((b) => (n === 'sex' ? b.mode === 'sex' : b.mode === 'abo' && b.n === n)); return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${did}">${label}${did ? ' ✓' : ''}</button>`; }).join('')}</div>`;
          if (ready) {
            h += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
            if (!done && picked >= 0) h += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
            if (done) h += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
          }
        }
        if (done) h += `<button class="ctl primary" type="button" id="labU2-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = h;
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.p; clearKids();
          runCross(m.predict.cross[0], m.predict.cross[1], 'abo', () => { done = true; });
          drawMission();
        }));
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => {
          const [, n] = m.acts[+b.dataset.a];
          if (n === 'sex') births(10, 'sex');
          else { st.fa = 'Ai'; st.mo = 'Bi'; syncFree(); births(n, 'abo'); }
        }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (m.pick) {
            if (busy) return;
            const [, fa, mo] = m.pick.opts[k];
            tried = tried.filter((x) => x !== k).concat(k);
            clearKids();
            runCross(fa, mo, 'abo', (c) => { if (m.pick.ok(c)) done = true; });
            drawMission();
            return;
          }
          if (k === m.quiz.ans) { done = true; const lc = R.crosses[R.crosses.length - 1]; if (lc && lc.mi === mi) status(summary(lc)); drawLog(); } else picked = k;
          drawMission();
        }));
        const nx = mbox.querySelector('#labU2-next');
        if (nx) nx.addEventListener('click', () => goMission(mi + 1));
      }
      function reset() {
        if (tl) tl.kill();
        busy = false; R.crosses.length = 0; R.births.length = 0;
        mi = 0; done = false; picked = -1; pred = -1; tried = []; doneK.clear();
        Object.assign(st, { fa: 'Ai', mo: 'Bi', mode: 'abo', faType: null }); syncFree();
        drawParents(); layer.innerHTML = ''; clearKids();
        status('ABO 血型：I<sup>A</sup>、I<sup>B</sup> 對 i 是顯性。按任務卡上的選項或按鈕開始。');
        $('free').open = false;
        drawLog(); drawMission();
      }

      reset();
      S._labU2 = { st, R, runCross, births, get busy() { return busy; }, finishNow() { if (tl) tl.progress(1); } }; // 測試用
      return { unmount() { if (tl) tl.kill(); gsap.killTweensOf(kidG.childNodes); delete S._labU2; } };
    },
  });
})();
