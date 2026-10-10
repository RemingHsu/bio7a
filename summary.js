/* 總整理的共用版面：重點圖表（比較表、流程圖、圖解）＋知識地圖（每小節重點＋易錯）＋自我檢測（答錯附解釋、可跳回動畫）
   CHARTS（可省略）每一項：
   { type: 'table', title, cols: [['欄名', 顏色], …], rows: [['列名', 格1, 格2, …], …], note, link: [id, 第幾步] }
   { type: 'flow', title, nodes: [['名稱', '小字說明', 顏色], …], loop: '回頭的箭頭說明（可省略）', note, link }
   { type: 'svg', title, w, h, draw(svg) { 用 S.el / S.text / S.pill 畫 }, note, link }
   格子裡可以用 <b>、<small>；link 的「第幾步」從 1 開始（和動畫上的 1 / 7 一樣），互動可以只寫 [id]。 */
(() => {
  // 作答進度放在每個總整理自己的閉包裡：跳去看動畫再回來，進度還在
  S.summaryLab = ({ id, section, title, heading, done, MAP, QUIZ, CHARTS = [] }) => {
    let qi = 0, picked = -1, solved = false;
    const first = [];

    S.registerLab({
      id, section, title,
      mount(box) {
        box.innerHTML = `
<style>
    .sumMap { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr)); gap: 0.9rem; }
    .sumCard { padding: 1rem 1.25rem; display: grid; gap: 0.5rem; align-content: start; }
    .sumCard h2 { display: flex; align-items: center; gap: 0.5rem; }
    .sumCard h2 .n { font-family: var(--font-mono); font-size: 0.75em; padding: 0.1em 0.5em; border-radius: 999px; background: var(--bg); color: var(--muted); font-weight: 500; }
    .sumCard ul { margin: 0; padding-left: 1.1em; display: grid; gap: 0.3rem; font-size: 0.95rem; line-height: 1.55; }
    .sumCard .trap { font-size: 0.9rem; color: var(--muted); border-left: 3px solid var(--bad); padding-left: 0.6rem; margin: 0.2rem 0; }
    .sumCard .trap b { color: var(--bad); }
    .quizCard { padding: 1rem 1.25rem; }
    .lab h3.sumHead { font-family: var(--font-label); font-size: 1.3rem; font-weight: 700; letter-spacing: 0; margin: 0.8rem 0 0; color: var(--ink); border-left: 4px solid var(--accent); padding-left: 0.6rem; }
    .sumCharts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 27rem), 1fr)); gap: 0.9rem; }
    .chartCard { padding: 1rem 1.25rem; display: grid; gap: 0.6rem; align-content: start; min-width: 0; }
    .lab .chartCard h3 { margin: 0; font-family: var(--font-label); font-size: 1.2rem; font-weight: 700; letter-spacing: 0; color: var(--ink); }
    .chartCard .note { font-size: 0.88rem; color: var(--muted); margin: 0; line-height: 1.5; }
    .tblWrap { overflow-x: auto; }
    table.cmp { width: 100%; border-collapse: collapse; font-size: 0.95rem; line-height: 1.45; }
    table.cmp th, table.cmp td { padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }
    table.cmp thead th { font-weight: 700; color: var(--ink); border-bottom: 3px solid var(--c, var(--line)); white-space: nowrap; }
    table.cmp .sw { display: inline-block; width: 0.7em; height: 0.7em; border-radius: 0.2em; background: var(--c); margin-right: 0.4em; vertical-align: 0.02em; }
    table.cmp tbody th { color: var(--muted); font-weight: 500; white-space: nowrap; }
    table.cmp tbody tr:last-child > * { border-bottom: 0; }
    table.cmp small, .flow small { color: var(--muted); font-size: 0.85em; }
    .flow { display: flex; flex-wrap: wrap; align-items: stretch; gap: 0.35rem 0.3rem; }
    .flow .node { background: var(--bg); border: 1px solid var(--line); border-top: 3px solid var(--c, var(--accent)); border-radius: 0.6rem; padding: 0.4rem 0.65rem; display: grid; gap: 0.1rem; align-content: start; flex: 1 1 6.5rem; }
    .flow .node b { font-size: 1rem; }
    .flow .arr { align-self: center; color: var(--muted); font-size: 1.1rem; }
    .flow .loop { flex-basis: 100%; font-size: 0.88rem; color: var(--muted); border-top: 1px dashed var(--line); padding-top: 0.35rem; margin-top: 0.15rem; }
    .svgWrap { overflow-x: auto; }
    .chartCard svg.dia { display: block; width: 100%; min-width: 440px; height: auto; background: #0f1c26; border-radius: 0.6rem; }
</style>
<div class="card quizCard" style="background:transparent;border:0;padding:0"><h2 style="font-family:var(--font-label);font-size:1.5rem;margin:0 0 0.2rem">${heading}</h2><p class="m-hint">${CHARTS.length ? '先看重點圖表，再看每一節的重點和易錯觀念。' : '每一節的重點和易錯觀念。'}按下按鈕可以直接打開對應的動畫或互動。</p></div>
${CHARTS.length ? '<h3 class="sumHead">重點圖表</h3><div class="sumCharts" id="sum-charts"></div><h3 class="sumHead">各節重點</h3>' : ''}
<div class="sumMap" id="sum-map"></div>
<div class="card quizCard" id="sum-quiz"></div>`;
        // 重點圖表
        const findItem = (iid) => { for (const [sec] of MAP) { const it = S.itemsOf(sec).find((x) => x.id === iid); if (it) return it; } return null; };
        const linkBtn = (link) => {
          if (!link) return '';
          const [iid, k] = link, it = findItem(iid);
          if (!it) return '';
          return `<div class="btn-row"><button class="ctl small" type="button" data-at="${iid}" data-k="${k || 1}">${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}${it.kind !== 'lab' && k > 1 ? `（第 ${k} 步）` : ''}</button></div>`;
        };
        const chartsBox = box.querySelector('#sum-charts');
        CHARTS.forEach((ch) => {
          const f = document.createElement('figure');
          f.className = 'card chartCard';
          f.style.margin = '0';
          let body = '';
          if (ch.type === 'table') {
            body = `<div class="tblWrap"><table class="cmp"><thead><tr><th></th>${ch.cols.map(([n, c]) => (c ? `<th style="--c:${c}"><span class="sw" aria-hidden="true"></span>${n}</th>` : `<th>${n}</th>`)).join('')}</tr></thead><tbody>${ch.rows.map(([h, ...cells]) => `<tr><th scope="row">${h}</th>${cells.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
          } else if (ch.type === 'flow') {
            body = `<div class="flow">${ch.nodes.map(([n, sub, c], k) => `${k ? '<span class="arr" aria-hidden="true">→</span>' : ''}<div class="node" style="--c:${c || 'var(--accent)'}"><b>${n}</b>${sub ? `<small>${sub}</small>` : ''}</div>`).join('')}${ch.loop ? `<div class="loop">↺ ${ch.loop}</div>` : ''}</div>`;
          }
          f.innerHTML = `<figcaption><h3>${ch.title}</h3></figcaption>${body}${ch.note ? `<p class="note">${ch.note}</p>` : ''}${linkBtn(ch.link)}`;
          if (ch.type === 'svg') {
            const wrap = document.createElement('div');
            wrap.className = 'svgWrap';
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
        MAP.forEach(([sec, name, pts, trap]) => {
          const c = document.createElement('section');
          c.className = 'card sumCard';
          const links = S.itemsOf(sec).map((it) => `<button class="ctl small" type="button" data-id="${it.id}">${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}</button>`).join('');
          c.innerHTML = `<h2><span class="n">${S.secLabel(sec)}</span>${name}</h2><ul>${pts.map((p) => `<li>${p}</li>`).join('')}</ul><p class="trap"><b>易錯：</b>${trap}</p><div class="btn-row">${links}</div>`;
          map.appendChild(c);
        });
        map.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
        gsap.fromTo(map.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 });

        const qbox = box.querySelector('#sum-quiz');
        const titleOf = (iid) => { const it = findItem(iid); return it ? `${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}` : ''; };
        function drawQuiz() {
          const dots = `<div class="dots" aria-hidden="true">${QUIZ.map((_, k) => `<i class="${k < qi ? (first[k] ? 'ok' : 'miss') : k === qi ? 'on' : ''}"></i>`).join('')}</div>`;
          if (qi >= QUIZ.length) {
            const ok = first.filter(Boolean).length;
            const review = QUIZ.map((q, k) => (first[k] ? null : q[4])).filter((v, i, a) => v && a.indexOf(v) === i);
            qbox.innerHTML = `<div class="mission-top"><h2>自我檢測結果</h2>${dots}</div>
              <p class="m-text">第一次就答對 <b>${ok} / ${QUIZ.length}</b> 題。</p>
              ${review.length ? `<p class="m-hint">建議再看一次：</p><div class="btn-row">${review.map((id) => `<button class="ctl small" type="button" data-id="${id}">${titleOf(id)}</button>`).join('')}</div>` : `<div class="fb ok"><strong>全部一次答對</strong>${done}</div>`}
              <div class="btn-row" style="margin-top:0.8rem"><button class="ctl primary" type="button" id="sum-again">重新作答</button></div>`;
            qbox.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
            qbox.querySelector('#sum-again').addEventListener('click', () => { qi = 0; picked = -1; solved = false; first.length = 0; drawQuiz(); });
            return;
          }
          const [q, opts, ans, why, link] = QUIZ[qi];
          let html = `<div class="mission-top"><h2>自我檢測 ${qi + 1} / ${QUIZ.length}</h2>${dots}</div><p class="m-text">${q}</p><div class="opts">${opts.map((o, k) => `<button class="opt ${solved && k === ans ? 'right' : !solved && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${solved ? 'disabled' : ''}>${'ABCD'[k]}. ${o}</button>`).join('')}</div>`;
          if (!solved && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>可以先看相關內容再回來作答。<div class="btn-row" style="margin-top:0.4rem"><button class="ctl small" type="button" data-id="${link}">${titleOf(link)}</button></div></div>`;
          if (solved) html += `<div class="fb ok"><strong>答對了</strong>${why}</div><button class="ctl primary" type="button" id="sum-next">${qi === QUIZ.length - 1 ? '看結果' : '下一題'}</button>`;
          qbox.innerHTML = html;
          qbox.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
            const k = +b.dataset.k;
            if (first[qi] === undefined) first[qi] = k === ans;
            if (k === ans) solved = true; else picked = k;
            drawQuiz();
          }));
          qbox.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
          const nx = qbox.querySelector('#sum-next');
          if (nx) nx.addEventListener('click', () => { qi++; picked = -1; solved = false; drawQuiz(); });
        }
        drawQuiz();
      },
    });
  };
})();
