/* 總整理的共用版面：知識地圖（每小節重點＋易錯）＋自我檢測（答錯附解釋、可跳回動畫） */
(() => {
  // 作答進度放在每個總整理自己的閉包裡：跳去看動畫再回來，進度還在
  S.summaryLab = ({ id, section, title, heading, done, MAP, QUIZ }) => {
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
</style>
<div class="card quizCard" style="background:transparent;border:0;padding:0"><h2 style="font-family:var(--font-label);font-size:1.5rem;margin:0 0 0.2rem">${heading}</h2><p class="m-hint">每一節的重點和易錯觀念。按下按鈕可以直接打開對應的動畫或互動。</p></div>
<div class="sumMap" id="sum-map"></div>
<div class="card quizCard" id="sum-quiz"></div>`;
        const map = box.querySelector('#sum-map');
        MAP.forEach(([sec, name, pts, trap]) => {
          const c = document.createElement('section');
          c.className = 'card sumCard';
          const links = S.itemsOf(sec).map((it) => `<button class="ctl small" type="button" data-id="${it.id}">${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}</button>`).join('');
          c.innerHTML = `<h2><span class="n">${sec}</span>${name}</h2><ul>${pts.map((p) => `<li>${p}</li>`).join('')}</ul><p class="trap"><b>易錯：</b>${trap}</p><div class="btn-row">${links}</div>`;
          map.appendChild(c);
        });
        map.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => S.openById(b.dataset.id)));
        gsap.fromTo(map.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 });

        const qbox = box.querySelector('#sum-quiz');
        const titleOf = (id) => { for (const [sec] of MAP) { const it = S.itemsOf(sec).find((x) => x.id === id); if (it) return `${it.kind === 'lab' ? '互動' : '動畫'}：${it.title}`; } return ''; };
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
