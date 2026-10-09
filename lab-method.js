/* 互動模型：設計公平的實驗 — 變因分類 → 設計兩組（只改一個條件）→ 重複實驗 → 下結論 */
(() => {
  const { el, g, text, C } = S;
  const KIND = { m: '操縱變因', c: '控制變因', r: '應變變因' };
  const KCOL = { m: '#ffb35c', c: '#62a8ff', r: '#6fce62' };

  const SC = [
    {
      title: '光照與綠豆芽', question: '光照會影響綠豆芽長高嗎？', hypothesis: '照光的綠豆芽會長得比較高。',
      vars: [['有沒有照光', 'm'], ['每天澆水量', 'c'], ['溫度', 'c'], ['綠豆的品種和數量', 'c'], ['5 天後綠豆芽的高度', 'r']],
      factors: [['light', '光照', ['照光', '放在暗處']], ['water', '澆水', ['每天 20 mL', '每天 5 mL']], ['temp', '溫度', ['25 °C', '10 °C']]],
      manip: 'light', unit: 'cm', resName: '5 天後的平均高度',
      outcome: (f) => 6 + (f.light ? 3.5 : 0) - (f.water ? 2.5 : 0) - (f.temp ? 3 : 0),
      noise: 0.4,
      concl: ['照光的長得比較高，支持假說', '放在暗處的反而長得比較高，不支持假說', '兩組差不多，看不出光照有影響'],
      judge: (a, b, design) => (Math.abs(a - b) < 0.8 ? 2 : (design.A.light ? b > a : a > b) ? 0 : 1),
      why: '放在暗處的綠豆芽會長得又細又長、顏色偏黃（黃化現象），所以「照光會比較高」的假說不被支持。這時要修正假說，例如改成「照光的綠豆芽比較綠、比較粗壯」，再設計新的實驗。',
      draw: 'bean',
    },
    {
      title: '水分與麵包發霉', question: '水分會影響麵包發霉嗎？', hypothesis: '水分多的麵包比較容易發霉。',
      vars: [['有沒有滴水', 'm'], ['麵包的種類和大小', 'c'], ['放置的溫度', 'c'], ['放置的天數', 'c'], ['發霉的面積', 'r']],
      factors: [['wet', '水分', ['滴 10 滴水', '不滴水']], ['temp', '溫度', ['25 °C', '5 °C（冰箱）']], ['type', '麵包', ['白吐司', '含防腐劑的麵包']]],
      manip: 'wet', unit: '%', resName: '5 天後的平均發霉面積',
      outcome: (f) => (10 + (f.wet ? 0 : 60)) * (f.temp ? 0.2 : 1) * (f.type ? 0.3 : 1),
      noise: 4,
      concl: ['滴水的發霉面積比較大，支持假說', '不滴水的發霉比較多，不支持假說', '兩組差不多，看不出水分有影響'],
      judge: (a, b, design) => (Math.abs(a - b) < 5 ? 2 : (design.A.wet ? b > a : a > b) ? 0 : 1),
      why: '黴菌生長需要水分，潮濕的麵包比較容易發霉，結果支持假說。放冰箱、加防腐劑也能減緩發霉，但那些要另外設計實驗來檢驗。',
      draw: 'bread',
    },
    {
      title: '溫度與酵母菌', question: '溫度會影響酵母菌產生氣體嗎？', hypothesis: '溫暖（約 35 °C）時，酵母菌產生的氣體比低溫（約 5 °C）時多。',
      vars: [['水溫', 'm'], ['糖和酵母粉的量', 'c'], ['水量', 'c'], ['瓶子和氣球的大小', 'c'], ['氣球脹大的程度（周長）', 'r']],
      factors: [['temp', '水溫', ['35 °C', '5 °C']], ['sugar', '糖', ['加 1 匙糖', '不加糖']], ['yeast', '酵母粉', ['1 匙', '半匙']]],
      manip: 'temp', unit: 'cm', resName: '30 分鐘後氣球的平均周長',
      outcome: (f) => 8 + (f.temp ? 2 : 14) * (f.sugar ? 0.15 : 1) * (f.yeast ? 0.6 : 1),
      noise: 0.6,
      concl: ['35 °C 的氣球比較大，支持假說', '5 °C 的氣球比較大，不支持假說', '兩組差不多，看不出溫度有影響'],
      judge: (a, b, design) => (Math.abs(a - b) < 1.2 ? 2 : (design.A.temp ? b > a : a > b) ? 0 : 1),
      why: '酵母菌分解糖會產生二氧化碳，讓氣球脹大。溫度低時酵母菌的作用很慢；溫度太高（例如滾水）會讓酵母菌死亡。之後學酵素時，會知道這和「酵素受溫度影響」有關。',
      draw: 'yeast',
    },
  ];

  // ---------- 結果的小圖 ----------
  const DRAW = {
    bean(p, x) {
      const gp = g(p);
      el('path', { d: `M ${x - 90},400 L ${x + 90},400 L ${x + 74},470 L ${x - 74},470 Z`, fill: '#b0703c' }, gp);
      const stems = [-50, -18, 18, 50].map((dx) => el('line', { x1: x + dx, y1: 400, x2: x + dx, y2: 400, stroke: '#9be58c', 'stroke-width': 6, 'stroke-linecap': 'round' }, gp));
      const leaves = [-50, -18, 18, 50].map((dx) => el('ellipse', { cx: x + dx, cy: 400, rx: 12, ry: 6, fill: '#6fce62' }, gp));
      return (v, f) => {
        const pale = f.light; // 放在暗處：黃白色
        stems.forEach((s, i) => { const h = Math.max(0, v * 24 + (i % 2 ? 6 : -4)); s.setAttribute('y2', 400 - h); s.setAttribute('stroke', pale ? '#e8e2a0' : '#9be58c'); leaves[i].setAttribute('cy', 400 - h); leaves[i].setAttribute('fill', pale ? '#f2e58a' : '#6fce62'); });
      };
    },
    bread(p, x) {
      const gp = g(p);
      el('path', { d: `M ${x - 90},460 L ${x - 90},360 C ${x - 90},300 ${x + 90},300 ${x + 90},360 L ${x + 90},460 Z`, fill: '#e3b46a', stroke: '#a8742e', 'stroke-width': 5 }, gp);
      el('path', { d: `M ${x - 76},450 L ${x - 76},364 C ${x - 76},318 ${x + 76},318 ${x + 76},364 L ${x + 76},450 Z`, fill: '#f6e2b0' }, gp);
      const rnd = S.rng(Math.round(x));
      const spots = [];
      for (let i = 0; i < 40; i++) spots.push(el('circle', { cx: x - 66 + rnd() * 132, cy: 336 + rnd() * 108, r: 0, fill: i % 3 ? '#4f7a4a' : '#2f5a6a' }, gp));
      return (v) => spots.forEach((s, i) => s.setAttribute('r', i < (v / 100) * 40 ? 9 + (i % 3) * 3 : 0));
    },
    yeast(p, x) {
      const gp = g(p);
      const balloon = el('ellipse', { cx: x, cy: 300, rx: 10, ry: 12, fill: '#ff8fb1', stroke: '#ffc2d4', 'stroke-width': 3 }, gp);
      el('path', { d: `M ${x - 22},330 L ${x - 22},350 C ${x - 60},360 ${x - 60},470 ${x - 50},470 L ${x + 50},470 C ${x + 60},470 ${x + 60},360 ${x + 22},350 L ${x + 22},330 Z`, fill: 'rgba(160,215,255,0.25)', stroke: '#cfe8ff', 'stroke-width': 4 }, gp);
      el('rect', { x: x - 48, y: 400, width: 96, height: 66, rx: 10, fill: 'rgba(240,220,160,0.5)' }, gp);
      return (v) => { const r = v * 3.2; balloon.setAttribute('rx', r * 0.85); balloon.setAttribute('ry', r); balloon.setAttribute('cy', 330 - r); };
    },
  };

  S.registerLab({
    id: 'lab-method', section: '1-6', title: '設計公平的實驗',
    mount(box) {
      box.innerHTML = `
<style>
  .labF { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labF .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labF .pad { padding: 1rem 1.25rem; }
  .labF .vrow { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.4rem 0.8rem; padding: 0.45rem 0; border-bottom: 1px solid var(--line); }
  .labF .vrow .nm { font-size: 0.95rem; min-width: 0; }
  .labF .vrow .mark { font-weight: 700; margin-left: 0.4rem; }
  .labF .design { display: grid; grid-template-columns: auto 1fr 1fr; gap: 0.5rem 0.8rem; align-items: center; font-size: 0.95rem; }
  .labF .design select { font: inherit; font-size: 0.9rem; padding: 0.3em 0.4em; border-radius: 0.4rem; border: 1px solid var(--line); background: var(--bg); color: var(--ink); min-width: 0; width: 100%; }
  .labF .design .diff { outline: 2px solid var(--accent); }
  @media (max-width: 900px) { .labF { grid-template-columns: 1fr; } }
</style>
<div class="labF">
  <div class="col">
    <div class="card">
      <div class="lab-stage"><svg viewBox="0 0 1200 560" role="img" aria-label="實驗結果"></svg></div>
      <div class="pad"><div id="labF-table"></div><p class="footnote">＊示意數據：結果由模擬產生，加入了小小的隨機誤差；趨勢依照一般的實驗結果設定。</p></div>
    </div>
  </div>
  <div class="col"><div class="card pad" id="labF-flow"></div></div>
</div>`;
      const $ = (id) => box.querySelector('#labF-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 560, fill: C.bg }, svg);
      const stage = g(svg);
      let vi = 0, vOk = false, vWrong = null, dPick = null, varsFirst = true; // 目前問到第幾項變因、設計時選錯的條件
      const VWRONG = { m: '操縱變因只有一個，就是問題想知道的那個條件。這一項是問題要問的嗎？', c: '控制變因是兩組要保持相同的條件。這一項是要保持相同、要刻意改變，還是要測量的？', r: '應變變因是實驗最後要測量、記錄的結果。這一項是要測量的結果嗎？' };
      const VHINT = { m: '問題想知道的就是這個條件，所以要刻意改變它（操縱變因）。', c: '這個條件也會影響結果，但不是問題要問的，所以兩組要保持相同（控制變因）。', r: '這是實驗最後要測量、記錄的結果（應變變因）。' };
      let si = 0, phase = 'vars', picks = {}, checked = false, design = null, results = null, picked = -1;
      const scoreFirst = [];
      let vis = null, anim = null;

      function drawStage() {
        stage.innerHTML = '';
        const sc = SC[si];
        text(stage, 600, 60, `情境 ${si + 1}：${sc.title}`, { 'font-size': 34, 'font-weight': 700, 'text-anchor': 'middle' });
        text(stage, 600, 104, `問題：${sc.question}`, { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi });
        text(stage, 600, 140, `假說：${sc.hypothesis}`, { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        const upA = DRAW[sc.draw](stage, 330), upB = DRAW[sc.draw](stage, 870);
        const lab = (x, t) => S.pill(stage, x, 520, t, { size: 24, color: C.ink, edge: '#3d5666' });
        lab(330, 'A 組'); lab(870, 'B 組');
        const valA = text(stage, 330, 200, '', { 'font-size': 26, 'text-anchor': 'middle', class: 'mono', fill: C.hi });
        const valB = text(stage, 870, 200, '', { 'font-size': 26, 'text-anchor': 'middle', class: 'mono', fill: C.hi });
        vis = { upA, upB, valA, valB };
        const z = {}; SC[si].factors.forEach(([k]) => { z[k] = 0; });
        upA(0, z); upB(0, z);
      }

      function runAnimation(a, b) {
        const o = { u: 0 }, unit = SC[si].unit, v = vis, dA = design.A, dB = design.B; // 先記下來，切換情境時不會讀到別的資料
        if (anim) anim.kill();
        anim = gsap.to(o, { u: 1, duration: 1.8, ease: 'power1.out', onUpdate: () => {
          v.upA(a * o.u, dA); v.upB(b * o.u, dB);
          v.valA.textContent = `${(a * o.u).toFixed(1)} ${unit}`; v.valB.textContent = `${(b * o.u).toFixed(1)} ${unit}`;
        } });
      }

      function table() {
        if (!results) { $('table').innerHTML = '<p class="m-hint">設計好實驗、按「開始實驗」後，三次結果會列在這裡。</p>'; return; }
        const sc = SC[si];
        const row = (n, arr, avg) => `<tr><th>${n}</th>${arr.map((v) => `<td>${v.toFixed(1)}</td>`).join('')}<td><b>${avg.toFixed(1)}</b></td></tr>`;
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>${sc.resName}（${sc.unit}）</th><th>第 1 次</th><th>第 2 次</th><th>第 3 次</th><th>平均</th></tr></thead><tbody>${row('A 組', results.A, results.a)}${row('B 組', results.B, results.b)}</tbody></table>`;
      }

      function flow() {
        const sc = SC[si], fl = $('flow');
        const dots = `<div class="dots" aria-hidden="true">${SC.map((_, k) => `<i class="${k < si ? (scoreFirst[k] ? 'ok' : 'miss') : k === si ? 'on' : ''}"></i>`).join('')}</div>`;
        if (si >= SC.length) {
          const ok = scoreFirst.filter(Boolean).length;
          fl.innerHTML = `<div class="mission-top"><h2>完成三個情境</h2>${dots}</div>
            <p class="m-text">一次就設計出公平實驗的情境：<b>${ok} / ${SC.length}</b></p>
            <div class="fb ok"><strong>重點整理</strong>操縱變因只有一個；其他條件都要相同（控制變因）；要觀察記錄的是應變變因。<br>每組重複幾次取平均，結果比較可靠。<br>結果不支持假說時，修正假說再實驗。</div>
            <button class="ctl primary" type="button" id="labF-again">再做一次</button>`;
          fl.querySelector('#labF-again').addEventListener('click', () => { si = 0; scoreFirst.length = 0; start(); });
          return;
        }
        let html = `<div class="mission-top"><h2>${['① 分類變因', '② 設計實驗', '③ 下結論'][{ vars: 0, design: 1, concl: 2 }[phase]]}</h2>${dots}</div>`;
        if (phase === 'vars') {
          // 一次只問一項，答對自動換下一項
          const [n, ans] = sc.vars[vi];
          html += `<p class="m-hint">問題：「${sc.question}」　第 ${vi + 1} / ${sc.vars.length} 項</p>`;
          html += `<p class="m-text">「<b>${n}</b>」是哪一種變因？</p><div class="acts">${['m', 'c', 'r'].map((k) => `<button class="ctl ${vWrong === k ? '' : 'primary'}" type="button" data-k="${k}" ${vOk ? 'disabled' : ''} style="${vWrong === k ? 'border-color:var(--bad);color:var(--bad)' : vOk && k === ans ? 'background:var(--good);border-color:var(--good)' : ''}">${KIND[k]}</button>`).join('')}</div>`;
          if (vWrong) html += `<div class="fb bad"><strong>再想想看</strong>${VWRONG[vWrong]}</div>`;
          if (vOk) html += `<div class="fb ok"><strong>答對了</strong>${VHINT[ans]}</div>`;
          if (sc.vars.slice(0, vi).length) html += `<p class="m-hint">${sc.vars.slice(0, vi).map(([vn, va]) => `${vn}：<b style="color:${KCOL[va]}">${KIND[va]}</b>`).join('　')}</p>`;
        } else if (phase === 'design') {
          const manipName = sc.factors.find(([k]) => k === sc.manip)[1];
          html += `<p class="m-text">設計 A、B 兩組實驗。哪一個條件要讓兩組<b>不同</b>？</p><div class="opts">${sc.factors.map(([k, nm, opts]) => `<button class="opt ${dPick === k ? 'wrong' : ''}" type="button" data-f="${k}">${nm}（${opts[0]} ／ ${opts[1]}）</button>`).join('')}<button class="opt ${dPick === 'all' ? 'wrong' : ''}" type="button" data-f="all">三個條件都改，差異比較明顯</button></div>`;
          if (dPick === 'all') html += `<div class="fb bad"><strong>有 3 個條件不同</strong>就算結果有差異，也無法判斷是哪一個條件造成的。只能改變一個條件。</div>`;
          else if (dPick) html += `<div class="fb bad"><strong>改錯條件了</strong>你改變的是「${sc.factors.find(([k]) => k === dPick)[1]}」，但問題想知道的是「${manipName}」。</div>`;
        } else {
          html += `<p class="m-hint">比較兩組的平均結果，哪一個結論正確？</p><div class="opts">${sc.concl.map((c, k) => `<button class="opt ${picked === k ? (k === results.right ? 'right' : 'wrong') : ''}" type="button" data-k="${k}" ${picked === results.right ? 'disabled' : ''}>${c}</button>`).join('')}</div>`;
          if (picked >= 0 && picked !== results.right) html += `<div class="fb bad"><strong>再看一次數據</strong>比較 A、B 兩組的「平均」，哪一組比較大？再對照假說。</div>`;
          if (picked === results.right) html += `<div class="fb ok"><strong>${picked === 1 ? '結果不支持假說' : '結論正確'}</strong>${sc.why}</div><button class="ctl primary" type="button" id="labF-next">${si === SC.length - 1 ? '看總結' : '下一個情境'}</button>`;
        }
        fl.innerHTML = html;
        const on = (id, fn) => { const e = fl.querySelector('#labF-' + id); if (e) e.addEventListener('click', fn); };
        if (phase === 'vars') fl.querySelectorAll('.acts [data-k]').forEach((b) => b.addEventListener('click', () => {
          const ans = sc.vars[vi][1];
          if (b.dataset.k !== ans) { vWrong = b.dataset.k; varsFirst = false; flow(); return; }
          vOk = true; vWrong = null; flow();
          setTimeout(() => { if (phase !== 'vars') return; vOk = false; vi++; if (vi >= sc.vars.length) phase = 'design'; flow(); }, 1100);
        }));
        fl.querySelectorAll('.opt[data-f]').forEach((b) => b.addEventListener('click', () => {
          const f = b.dataset.f;
          if (scoreFirst[si] === undefined) scoreFirst[si] = varsFirst && f === sc.manip;
          if (f !== sc.manip) { dPick = f; flow(); return; }
          const z = {}; sc.factors.forEach(([k]) => { z[k] = 0; });
          design = { A: { ...z }, B: { ...z, [sc.manip]: 1 }, msg: null };
          run();
        }));
        fl.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => { picked = +b.dataset.k; flow(); }));
        on('next', () => { si++; start(); });
      }

      function run() {
        const sc = SC[si];
        const diffs = sc.factors.filter(([k]) => design.A[k] !== design.B[k]).map(([k, n]) => [k, n]);
        const manipName = sc.factors.find(([k]) => k === sc.manip)[1];
        if (scoreFirst[si] === undefined) scoreFirst[si] = diffs.length === 1 && diffs[0][0] === sc.manip;
        if (!diffs.length) { design.msg = ['兩組完全一樣', `沒有改變任何條件，就沒辦法知道「${manipName}」有沒有影響。`]; flow(); return; }
        if (diffs.length > 1) { design.msg = [`有 ${diffs.length} 個條件不同`, `${diffs.map((d) => d[1]).join('、')}都不一樣。就算結果有差異，也無法判斷是哪一個造成的。只能改變「${manipName}」。`]; flow(); return; }
        if (diffs[0][0] !== sc.manip) { design.msg = ['改錯條件了', `你改變的是「${diffs[0][1]}」，但問題想知道的是「${manipName}」。`]; flow(); return; }
        const rnd = () => (Math.random() - 0.5) * 2 * sc.noise;
        const A = [0, 1, 2].map(() => Math.max(0, sc.outcome(design.A) + rnd())), B = [0, 1, 2].map(() => Math.max(0, sc.outcome(design.B) + rnd()));
        const a = (A[0] + A[1] + A[2]) / 3, b = (B[0] + B[1] + B[2]) / 3;
        results = { A, B, a, b, right: sc.judge(a, b, design) };
        table();
        runAnimation(a, b);
        phase = 'concl'; picked = -1;
        flow();
      }

      function start() {
        if (anim) { anim.kill(); anim = null; }
        results = null; picks = {}; checked = false; phase = 'vars'; picked = -1; vi = 0; vOk = false; vWrong = null; dPick = null; varsFirst = true;
        if (si < SC.length) {
          const z = {}; SC[si].factors.forEach(([k]) => { z[k] = 0; });
          design = { A: { ...z }, B: { ...z }, msg: null };
          drawStage();
        }
        table(); flow();
      }
      start();
      return { unmount() { if (anim) anim.kill(); } };
    },
  });
})();
