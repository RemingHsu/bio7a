/* 總整理的共用版面：重點圖表（比較表、流程圖、圖解）＋知識地圖（每小節重點＋易錯）＋自我檢測（答錯附解釋、可跳回動畫）
   CHARTS（可省略）每一項：
   { type: 'table', title, cols: [['欄名', 顏色], …], rows: [['列名', 格1, 格2, …], …], note, link: [id, 第幾步] }
   { type: 'flow', title, nodes: [['名稱', '小字說明', 顏色], …], loop: '回頭的箭頭說明（可省略）', note, link }
   { type: 'svg', title, w, h, draw(svg) { 用 S.el / S.text / S.pill 畫 }, note, link }
   格子裡可以用 <b>、<small>；link 的「第幾步」從 1 開始（和動畫上的 1 / 7 一樣），互動可以只寫 [id]；可以連到任何一章（S.findItem）。
   MAP 每一項：[小節代號, 小節名稱, 重點[], 易錯]
     重點的每一條可以是 '文字'，或 ['文字', ['小點', …]]（下一層條列，可以再巢狀）；易錯可以是 '文字' 或 ['…', '…']。
     各節重點同時是可以列印的複習講義：列印時用淺色、隱藏按鈕；預設不印自我檢測，網址加 ?pq=qa 才印題目＋解答。
     做好的 PDF 講義放在 pdf/（tools/make_pdfs.py），有的話標題旁會出現下載連結。
   MAP 可以是 []（例如 summary-x.js 的跨章比較），就不顯示「各節重點」。 */
(() => {
  // 作答進度放在每個總整理自己的閉包裡：跳去看動畫再回來，進度還在
  S.summaryLab = ({ id, section, title, heading, done, MAP, QUIZ, CHARTS = [] }) => {
    let qi = 0, picked = -1, solved = false;
    // 做好的 PDF 講義（tools/make_pdfs.py 產生在 pdf/ 資料夾）：總1 → ch01，下總1 → ch07，跨章比較 → cross
    const chNo = /^下總(\d+)$/.test(section) ? +RegExp.$1 + 6 : /^總(\d+)$/.test(section) ? +RegExp.$1 : 0;
    const pdfBase = chNo ? `ch${String(chNo).padStart(2, '0')}` : 'cross';
    const pdfName = chNo ? heading.replace(/\s*知識地圖$/, '') : '跨章比較';
    const first = [], solvedK = new Set(); // first[k]：第一次有沒有答對；solvedK：已經答對的題目
    let restored = false; // 第一次打開時從學習進度把作答狀態讀回來
    S.QUIZ[id] = QUIZ; // 首頁的錯題本要用

    S.registerLab({
      id, section, title,
      mount(box) {
        box.innerHTML = `
<style>
    .sumMap { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.9rem; }
    .sumCard { padding: 1rem 1.25rem; display: grid; gap: 0.5rem; align-content: start; }
    .sumCard h2 { display: flex; align-items: center; gap: 0.5rem; }
    .sumCard h2 .n { font-family: var(--font-mono); font-size: 0.75em; padding: 0.1em 0.5em; border-radius: 999px; background: var(--bg); color: var(--muted); font-weight: 500; }
    .sumCard > ul { margin: 0; padding-left: 1.1em; columns: 2 24rem; column-gap: 2.2rem; font-size: 1rem; line-height: 1.65; }
    .sumCard li { break-inside: avoid; margin: 0 0 0.3rem; }
    .sumCard li ul { margin: 0.2rem 0 0; padding-left: 1.1em; list-style: circle; font-size: 0.97em; }
    .sumCard li ul li { margin-bottom: 0.15rem; }
    .sumCard .trap { font-size: 0.97rem; color: var(--muted); border-left: 3px solid var(--bad); padding-left: 0.6rem; margin: 0.2rem 0; }
    .sumCard .trap ul { margin: 0.15rem 0 0; padding-left: 1.1em; }
    .sumHeadRow { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.4rem 1rem; }
    .sumPrintOpt { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem 0.6rem; }
    .sumPdf { font-size: 0.92rem; color: var(--muted); }
    .sumPdf a { color: var(--accent); }
    #sum-printquiz { display: none; }
    /* 列印用的外框表格：螢幕上不影響版面；列印時 thead/tfoot 在每一頁重複，當作上下留白 */
    table.pwrap, .pwrap > tbody, .pwrap > tbody > tr, .pwrap > tbody > tr > td { display: contents; }
    .pwrap > thead, .pwrap > tfoot { display: none; }
    .sumCard .trap b { color: var(--bad); }
    .quizCard { padding: 1rem 1.25rem; }
    .lab h3.sumHead { font-family: var(--font-label); font-size: 1.3rem; font-weight: 700; letter-spacing: 0; margin: 0.8rem 0 0; color: var(--ink); border-left: 4px solid var(--accent); padding-left: 0.6rem; }
    .sumCharts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 27rem), 1fr)); gap: 0.9rem; }
    .chartCard { padding: 1rem 1.25rem; display: grid; gap: 0.6rem; align-content: start; min-width: 0; }
    .lab .chartCard h3 { margin: 0; font-family: var(--font-label); font-size: 1.2rem; font-weight: 700; letter-spacing: 0; color: var(--ink); }
    .chartCard .note { font-size: 0.95rem; color: var(--muted); margin: 0; line-height: 1.5; }
    .tblWrap { overflow-x: auto; }
    table.cmp { width: 100%; border-collapse: collapse; font-size: 1rem; line-height: 1.5; }
    table.cmp th, table.cmp td { padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }
    table.cmp thead th { font-weight: 700; color: var(--ink); border-bottom: 3px solid var(--c, var(--line)); white-space: nowrap; }
    table.cmp .sw { display: inline-block; width: 0.7em; height: 0.7em; border-radius: 0.2em; background: var(--c); margin-right: 0.4em; vertical-align: 0.02em; }
    table.cmp tbody th { color: var(--muted); font-weight: 500; white-space: nowrap; }
    table.cmp tbody tr:last-child > * { border-bottom: 0; }
    table.cmp .swn { white-space: nowrap; }
    table.cmp small, .flow small { color: var(--muted); font-size: 0.92em; }
    .flow { display: flex; flex-wrap: wrap; align-items: stretch; gap: 0.35rem 0.3rem; }
    .flow .node { background: var(--bg); border: 1px solid var(--line); border-top: 3px solid var(--c, var(--accent)); border-radius: 0.6rem; padding: 0.4rem 0.65rem; display: grid; gap: 0.1rem; align-content: start; flex: 1 1 6.5rem; }
    .flow .node b { font-size: 1rem; }
    .flow .arr { align-self: center; color: var(--muted); font-size: 1.1rem; }
    .flow .loop { flex-basis: 100%; font-size: 0.88rem; color: var(--muted); border-top: 1px dashed var(--line); padding-top: 0.35rem; margin-top: 0.15rem; }
    .svgWrap { overflow-x: auto; }
    .chartCard svg.dia { display: block; width: 100%; min-width: 440px; height: auto; background: #0f1c26; border-radius: 0.6rem; }
    /* 圖解也可以「放大」（手機直拿時會轉成橫向）：借用互動舞台的放大按鈕 */
    .dia-wrap { padding-top: 0 !important; background: transparent; border: 0; display: block; }
    .dia-wrap .big-btn { top: 0.4rem; right: 0.4rem; }
    .dia-wrap.big { background: var(--stage); }
    .dia-wrap.big svg.dia { width: 100%; height: 100%; max-height: 100%; min-width: 0; border-radius: 0; }
    /* 章內目錄：直接跳到重點圖表、某一節、自我檢測 */
    .sumToc { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.4rem; }
    .sumToc button { font: inherit; font-size: 0.88rem; padding: 0.25em 0.7em; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; white-space: nowrap; }
    .sumToc button:hover, .sumToc button:focus-visible { border-color: var(--accent); outline: none; }
    .sumToc button .n { font-family: var(--font-mono); font-size: 0.85em; color: var(--muted); margin-right: 0.3em; }
    .sumJump { display: none; position: fixed; right: 0.9rem; bottom: 0.9rem; z-index: 40; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25); }
    @media screen and (max-width: 600px) {
      .sumJump { display: inline-flex; }
      .chartCard svg.dia { min-width: 0; } /* 手機：圖解縮到卡片寬度，不左右捲；看不清楚就按「放大」 */
    }
    /* 表格裡少數用淺色字標示的內容（為深色主題設計）：淺色主題和列印時調深，白底上才看得清楚 */
    :root[data-theme="light"] :is(table.cmp, .flow) [style^="color:#"] { filter: brightness(0.55) saturate(1.4); }
    @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) :is(table.cmp, .flow) [style^="color:#"] { filter: brightness(0.55) saturate(1.4); } }
    @media screen and (max-width: 30rem) {
      table.cmp { font-size: 0.92rem; }
      table.cmp th, table.cmp td { padding: 0.4rem 0.3rem; }
      table.cmp thead th, table.cmp tbody th { white-space: normal; }
      .chartCard, .sumCard { padding: 0.9rem 0.8rem; }
    }
    @media print {
      :root { --bg: #fff !important; --surface: #fff !important; --ink: #111 !important; --muted: #444 !important; --line: #bbb !important; --accent: #0b6b5c !important; --bad: #b03020 !important; }
      html { font-size: 10.5pt !important; -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
      /* 自己的頁碼放在頁尾；指定了頁邊內容，瀏覽器就不會再印網址、日期 */
      @page {
        size: A4;
        margin: 12mm 13mm 14mm;
        @top-left { content: ''; } @top-center { content: ''; } @top-right { content: ''; }
        @bottom-left { content: ''; } @bottom-right { content: ''; }
        @bottom-center { content: counter(page) ' / ' counter(pages); font-size: 9pt; color: #555; }
      }
      body { background: #fff !important; color: #111 !important; padding: 0 !important; margin: 0 !important; }
      /* 列印用電腦內建的中文字型（蘋方、微軟正黑體）：PDF 只要嵌一套字型，檔案小很多 */
      body, .lab, .lab :is(h2, h3, p, li, td, th, b, small, span, div, ol, ul, button) { font-family: "PingFang TC", "Microsoft JhengHei", "Heiti TC", "Noto Sans TC", sans-serif !important; }
      header, .player, p.hint, .lab .btn-row, .lab button, #sum-quiz, .sumIntro .m-hint, .sumToc, .sumJump { display: none !important; }
      .lab { display: block !important; padding: 0 !important; }
      .sumCharts { display: block; }
      .sumCharts > *, .sumMap > * { opacity: 1 !important; transform: none !important; }
      .chartCard { break-inside: avoid; margin: 0 0 0.7rem !important; padding: 0.7rem 0.9rem !important; border: 1px solid #bbb !important; box-shadow: none !important; }
      .chartCard:has(table) { break-inside: auto; }
      .chartCard h3 { break-after: avoid; }
      table.cmp tr { break-inside: avoid; }
      .sumCard { margin: 0 0 0.7rem; border: 1px solid #bbb !important; box-shadow: none !important; }
      .sumCard h2, .lab h3.sumHead { break-after: avoid; }
      .sumCard > ul { columns: 1; }
      .sumCard, .chartCard { display: block !important; }
      .sumCard > * + * { margin-top: 0.45rem; }
      .chartCard > * + * { margin-top: 0.5rem; }
      .sumCard li { break-inside: auto; }
      .sumCard li li, .sumCard .trap li { break-inside: avoid; }
      .tblWrap, .svgWrap { overflow: visible; }
      .chartCard svg.dia { min-width: 0; max-height: 120mm; background: transparent !important; filter: invert(1) hue-rotate(180deg); }
      .chartCard svg.dia :is([fill="#0f1c26"], [fill="#0d1822"], [fill="#122230"], [fill="#16293a"], [fill="#1a2c3a"], [fill="#173238"], [fill="#1d2328"], [fill="#0f1d29"], [fill="#091015"], [fill="#111b22"]) { fill: #000 !important; }
      table.cmp .sw { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      :is(table.cmp, .flow) [style^="color:#"] { filter: brightness(0.5) saturate(1.4); }
      #sum-printquiz { display: block; break-before: page; }
      #sum-printquiz:not([data-mode="qa"]) { display: none !important; }
      .sumPrintOpt { display: none !important; }
      #sum-printquiz ol { padding-left: 2.2em; }
      #sum-printquiz li { break-inside: avoid; margin-bottom: 0.5rem; }
      #sum-printquiz .po { display: flex; flex-wrap: wrap; gap: 0.1rem 1.4rem; }
      #sum-printquiz .key li { margin-bottom: 0.25rem; }
    }
</style>
<table class="pwrap"><thead><tr><td><div class="pspace"></div></td></tr></thead><tbody><tr><td>
<div class="card quizCard sumIntro" style="background:transparent;border:0;padding:0"><div class="sumHeadRow"><h2 style="font-family:var(--font-label);font-size:1.5rem;margin:0 0 0.2rem">${heading}</h2><div class="sumPrintOpt"><span class="sumPdf" id="sum-pdf" hidden>PDF：<a href="pdf/${pdfBase}.pdf" download="${pdfName}-重點.pdf">重點</a>・<a href="pdf/${pdfBase}-qa.pdf" download="${pdfName}-含自我檢測與解答.pdf">含自我檢測與解答</a></span></div></div><p class="m-hint">${!MAP.length ? '先看重點圖表，再做自我檢測。' : CHARTS.length ? '先看重點圖表，再看每一節的重點和易錯觀念。' : '每一節的重點和易錯觀念。'}按下按鈕可以直接打開對應的動畫或互動。</p>
<div class="sumToc" aria-label="章內目錄">${CHARTS.length ? '<button type="button" data-go="#sum-charts">重點圖表</button>' : ''}${MAP.map(([sec, name], i) => `<button type="button" data-go="#sum-sec-${i}"><span class="n">${S.secLabel(sec)}</span>${name}</button>`).join('')}<button type="button" data-go="#sum-quiz">自我檢測</button></div></div>
${CHARTS.length ? `<h3 class="sumHead">重點圖表</h3><div class="sumCharts" id="sum-charts"></div>${MAP.length ? '<h3 class="sumHead">各節重點</h3>' : ''}` : ''}
${MAP.length ? '<div class="sumMap" id="sum-map"></div>' : ''}
<div class="card quizCard" id="sum-quiz"></div>
<section id="sum-printquiz"></section>
</td></tr></tbody><tfoot><tr><td><div class="pspace"></div></td></tr></tfoot></table>
<button class="ctl primary sumJump" type="button" data-go="#sum-quiz">↓ 自我檢測</button>`;
        // 章內目錄與手機上的「自我檢測」浮動鈕：捲到對應的位置
        box.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { const t = box.querySelector(b.dataset.go); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
        // 列印（瀏覽器的列印、或 tools/make_pdfs.py 產生 PDF）：預設只印重點圖表和各節重點；網址加 ?pq=qa 才加印自我檢測和解答
        box.querySelector('#sum-printquiz').dataset.mode = new URLSearchParams(location.search).get('pq') === 'qa' ? 'qa' : 'none';
        // 有做好的 PDF 才顯示下載連結（離線單檔沒有 pdf 資料夾）
        if (location.protocol !== 'file:') fetch(`pdf/${pdfBase}.pdf`, { method: 'HEAD' }).then((r) => { if (r.ok) box.querySelector('#sum-pdf').hidden = false; }).catch(() => {});
        // 重點圖表
        const findItem = (iid) => S.findItem(iid); // 任何一章的動畫／互動都可以連結
        const linkBtn = (link) => {
          if (!link) return '';
          const [iid, k] = link, it = findItem(iid);
          if (!it) return '';
          return `<div class="btn-row"><button class="ctl small" type="button" data-at="${iid}" data-k="${k || 1}">${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}${it.kind !== 'lab' && k > 1 ? `（第 ${k} 步）` : ''}</button></div>`;
        };
        // 表頭的色塊和第一個字黏在一起，換行時色塊不會自己掉成一行
        const swHead = (n) => { const m = /^([^<&\s])([\s\S]*)$/u.exec(n); return m ? `<span class="swn"><span class="sw" aria-hidden="true"></span>${m[1]}</span>${m[2]}` : `<span class="sw" aria-hidden="true"></span>${n}`; };
        // 很短的列名（例如「大腦」）不要在手機上被拆成一字一行
        const rowHead = (h) => (String(h).replace(/<[^>]+>/g, '').length <= 3 && !/<br/i.test(h) ? `<span class="swn">${h}</span>` : h);
        const chartsBox = box.querySelector('#sum-charts');
        CHARTS.forEach((ch) => {
          const f = document.createElement('figure');
          f.className = 'card chartCard';
          f.style.margin = '0';
          let body = '';
          if (ch.type === 'table') {
            body = `<div class="tblWrap"><table class="cmp"><thead><tr><th></th>${ch.cols.map(([n, c]) => (c ? `<th style="--c:${c}">${swHead(n)}</th>` : `<th>${n}</th>`)).join('')}</tr></thead><tbody>${ch.rows.map(([h, ...cells]) => `<tr><th scope="row">${rowHead(h)}</th>${cells.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
          } else if (ch.type === 'flow') {
            body = `<div class="flow">${ch.nodes.map(([n, sub, c], k) => `${k ? '<span class="arr" aria-hidden="true">→</span>' : ''}<div class="node" style="--c:${c || 'var(--accent)'}"><b>${n}</b>${sub ? `<small>${sub}</small>` : ''}</div>`).join('')}${ch.loop ? `<div class="loop">↺ ${ch.loop}</div>` : ''}</div>`;
          }
          f.innerHTML = `<figcaption><h3>${ch.title}</h3></figcaption>${body}${ch.note ? `<p class="note">${ch.note}</p>` : ''}${linkBtn(ch.link)}`;
          if (ch.type === 'svg') {
            const wrap = document.createElement('div');
            wrap.className = 'svgWrap lab-stage dia-wrap'; // lab-stage：引擎會替它加上「放大」按鈕
            const sv = S.el('svg', { viewBox: `0 0 ${ch.w} ${ch.h}`, class: 'dia', role: 'img', 'aria-label': ch.title }, wrap);
            f.insertBefore(wrap, f.children[1]);
            ch.draw(sv);
          }
          chartsBox.appendChild(f);
        });
        if (chartsBox) {
          chartsBox.querySelectorAll('[data-at]').forEach((b) => b.addEventListener('click', () => S.openAt(b.dataset.at, +b.dataset.k - 1)));
          gsap.fromTo(chartsBox.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 });
        }

        const map = box.querySelector('#sum-map');
        const li = (p) => (Array.isArray(p) ? `<li>${p[0]}<ul>${p[1].map(li).join('')}</ul></li>` : `<li>${p}</li>`);
        if (map) MAP.forEach(([sec, name, pts, trap], i) => {
          const c = document.createElement('section');
          c.className = 'card sumCard'; c.id = `sum-sec-${i}`;
          const links = S.itemsOf(sec).map((it) => `<button class="ctl small" type="button" data-id="${it.id}">${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}</button>`).join('');
          const traps = (Array.isArray(trap) ? trap : [trap]).filter(Boolean);
          const trapHtml = !traps.length ? '' : traps.length === 1 ? `<p class="trap"><b>易錯：</b>${traps[0]}</p>` : `<div class="trap"><b>易錯：</b><ul>${traps.map((t) => `<li>${t}</li>`).join('')}</ul></div>`;
          c.innerHTML = `<h2><span class="n">${S.secLabel(sec)}</span>${name}</h2><ul>${pts.map(li).join('')}</ul>${trapHtml}<div class="btn-row">${links}</div>`;
          map.appendChild(c);
        });
        if (map) {
          map.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
          gsap.fromTo(map.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 });
        }

        // 列印用：自我檢測的題目＋最後的解答與解析（螢幕上不顯示）
        const pq = box.querySelector('#sum-printquiz');
        if (pq && QUIZ.length) pq.innerHTML = `<h3 class="sumHead">自我檢測</h3><ol>${QUIZ.map(([q, o]) => `<li><p style="margin:0 0 0.15rem">${q}</p><div class="po">${o.map((x, k) => `<span>（${'ABCD'[k]}）${x}</span>`).join('')}</div></li>`).join('')}</ol>
          <div class="pq-key"><h3 class="sumHead">解答與解析</h3><ol class="key">${QUIZ.map(([, , a, why]) => `<li><b>${'ABCD'[a]}</b>　${why}</li>`).join('')}</ol></div>`;

        const qbox = box.querySelector('#sum-quiz');
        const titleOf = (iid) => { const it = findItem(iid); return it ? `${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}` : ''; };
        // 點圓點切換題目：答對過的題目直接顯示解析
        S.onDots(qbox, (k) => { qi = k; picked = -1; solved = solvedK.has(k); drawQuiz(); });
        function drawQuiz() {
          const dots = S.dots(QUIZ.length, qi, (k) => (first[k] === false ? 'miss' : solvedK.has(k) ? 'ok' : ''), '題');
          if (qi >= QUIZ.length) {
            const ok = first.filter(Boolean).length;
            const review = QUIZ.map((q, k) => (first[k] === false ? q[4] : null)).filter((v, i, a) => v && a.indexOf(v) === i); // 只列第一次答錯的題目
            qbox.innerHTML = `<div class="mission-top"><h2>自我檢測結果</h2>${dots}</div>
              <p class="m-text">第一次就答對 <b>${ok} / ${QUIZ.length}</b> 題。</p>
              ${solvedK.size < QUIZ.length ? `<p class="m-hint">還有 ${QUIZ.length - solvedK.size} 題還沒答對，點上面的圓點可以回去作答。</p>` : ''}
              ${review.length ? `<p class="m-hint">建議再看一次：</p><div class="btn-row">${review.map((id) => `<button class="ctl small" type="button" data-id="${id}">${titleOf(id)}</button>`).join('')}</div>` : ok === QUIZ.length ? `<div class="fb ok"><strong>全部一次答對</strong>${done}</div>` : ''}
              <div class="btn-row" style="margin-top:0.8rem"><button class="ctl primary" type="button" id="sum-again">重新作答</button></div>`;
            qbox.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
            qbox.querySelector('#sum-again').addEventListener('click', () => { qi = 0; picked = -1; solved = false; first.length = 0; solvedK.clear(); S.progress.setQuiz(id, QUIZ.length, first, solvedK); drawQuiz(); });
            return;
          }
          const [q, opts, ans, why, link] = QUIZ[qi];
          let html = `<div class="mission-top"><h2>自我檢測 ${qi + 1} / ${QUIZ.length}</h2>${dots}</div><p class="m-text">${q}</p><div class="opts">${opts.map((o, k) => `<button class="opt ${solved && k === ans ? 'right' : !solved && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${solved ? 'disabled' : ''}>${'ABCD'[k]}. ${o}</button>`).join('')}</div>`;
          if (!solved && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>可以先看相關內容再回來作答。<div class="btn-row" style="margin-top:0.4rem"><button class="ctl small" type="button" data-id="${link}">${titleOf(link)}</button></div></div>`;
          if (solved) html += `<div class="fb ok"><strong>答對了</strong>${why}</div><button class="ctl primary" type="button" id="sum-next">${qi === QUIZ.length - 1 ? '看結果' : '下一題'}</button>`;
          qbox.innerHTML = html;
          qbox.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
            const k = +b.dataset.k;
            if (first[qi] === undefined) { first[qi] = k === ans; if (!first[qi]) S.progress.wrongAdd(id, qi); } // 第一次答錯：收進錯題本
            if (k === ans) { solved = true; solvedK.add(qi); } else picked = k;
            S.progress.setQuiz(id, QUIZ.length, first, solvedK);
            drawQuiz();
          }));
          qbox.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
          const nx = qbox.querySelector('#sum-next');
          if (nx) nx.addEventListener('click', () => { qi++; picked = -1; solved = false; drawQuiz(); });
        }
        // 上次的作答狀態（存在這台裝置）：讀回來，從第一題還沒答對的開始
        if (!restored) {
          restored = true;
          const sv = S.progress.quiz(id);
          if (sv) {
            Object.entries(sv.first).forEach(([k, v]) => { first[+k] = v; });
            sv.solved.forEach((k) => solvedK.add(k));
            const nx = QUIZ.findIndex((_, k) => !solvedK.has(k));
            qi = nx < 0 ? QUIZ.length : nx;
          }
        }
        // 首頁的錯題本：跳到這份總整理的第 k 題
        S.quizJump[id] = (k) => { qi = k; picked = -1; solved = solvedK.has(k); drawQuiz(); qbox.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        drawQuiz();
      },
    });
  };
})();
