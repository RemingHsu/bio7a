/* 互動模型：反應時間 — 看到紅色圓形就按（測 3 次取平均）→ 先判斷再按（紅色才按、綠色不按）→ 接尺實驗與換算 → 反射還是意識行為（一次一題） */
(() => {
  const { el, g, text, C } = S;
  const RED = '#ff4d5e', GREEN = '#3fbf6a', SCR = '#1b2a36';
  const RULER_CM = 50, PXCM = 9, RTOP = 40, RBOT = RTOP + RULER_CM * PXCM; // 尺：50 cm，每 cm 9 px
  const dist = (t) => 490 * t * t; // 從靜止開始掉落 t 秒的距離（cm），g ≈ 980 cm/s²
  const timeOf = (d) => Math.sqrt(d / 490);
  const f2 = (v) => v.toFixed(2);
  const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;

  const ITEMS = [
    ['手碰到很燙的鍋子，立刻縮回', 'r', '一碰到就縮手，不經大腦思考，中樞在<b>脊髓</b>。縮手之後，訊息才傳到大腦，感到痛。'],
    ['看到紅燈，停下腳步', 'v', '要先看懂紅燈的意思，由<b>大腦</b>判斷後才停下來。'],
    ['灰塵跑進鼻子，打噴嚏', 'r', '打噴嚏是<b>反射</b>，不必想就會發生，中樞在<b>腦幹</b>。'],
    ['接尺時，看到尺掉下來就接住', 'v', '要看到尺開始掉、由<b>大腦</b>決定合起手指，是意識行為。所以接尺測到的，是意識行為的反應時間。'],
    ['強光照到眼睛，瞳孔縮小', 'r', '瞳孔縮小是<b>反射</b>，自己無法控制，中樞在<b>腦幹</b>。'],
  ];
  const KIND = { r: '反射', v: '意識行為' };

  const MISSIONS = [
    { title: '測反應時間', kind: 'simple', text: '畫面出現<b>紅色圓形</b>時，立刻按下按鈕（或點畫面、按空白鍵）。共測 <b>3 次</b>，算平均。', need: 3 },
    { title: '先判斷再按', kind: 'choice', predict: { q: '改成：出現<b>紅色圓形</b>才按，出現<b>綠色方形</b>不要按。和任務 1 比，反應時間會怎樣？先預測：', opts: ['變長', '差不多', '變短'] },
      text: '紅色圓形才按、綠色方形不要按。測到 <b>3 次紅色</b>為止。', need: 3 },
    { title: '接尺實驗', kind: 'ruler', text: '按「準備」後，同學會在某個時候放開尺。看到尺<b>開始掉</b>，就立刻按下按鈕把尺接住。',
      quiz: { q: '小明接尺時，尺落下 25 cm；小華落下 10 cm。誰的反應時間比較短？', opts: ['小明', '小華', '兩人一樣'], ans: 1, hint: '對照換算表，分別查出兩人的反應時間，再比一比。' },
      why: '小華的尺只落下 10 cm（約 0.14 秒），小明落下 25 cm（約 0.23 秒）。尺掉得越久，落下得越遠；所以<b>落下距離越短，反應時間越短</b>。' },
    { title: '反射還是意識行為？', kind: 'quiz' },
  ];

  S.registerLab({
    id: 'lab-reaction', section: '5-1', title: '反應時間',
    mount(box) {
      box.innerHTML = `
<style>
  .labR { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labR .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labR .pad { padding: 1rem 1.25rem; }
  .labR .lab-stage svg { cursor: pointer; }
  .labR .press { width: 100%; min-height: 4.2rem; font-size: 1.5rem; font-weight: 700; justify-content: center; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .labR .press.go { background: var(--bad); border-color: var(--bad); color: #fff; }
  .labR .table-wrap { overflow-x: auto; }
  .labR .tbl { min-width: 20rem; }
  .labR .tbl td:nth-child(2) { font-family: var(--font-mono); font-size: 0.8rem; }
  @media (max-width: 900px) {
    .labR { display: flex; flex-direction: column; align-items: stretch; }
    .labR .col { display: contents; }
    .labR .c-stage { order: 1; } .labR .c-mis { order: 2; } .labR .c-table { order: 3; } .labR .c-ctl { order: 4; }
  }
</style>
<div class="labR">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 560" role="button" tabindex="-1" aria-label="反應時間測量畫面：出現紅色圓形或尺開始掉落時，點畫面或按空白鍵"></svg></div>
      <div class="pad">
        <p class="status-line" id="labR-status" aria-live="polite"></p>
        <p class="footnote">＊電腦螢幕和按鍵本身會多出一點延遲（約幾十毫秒），所以測到的時間會比真正的反應時間稍長；每個人、每次測量的結果都不一樣。「一般人約 0.2～0.3 秒」只是約略值。接尺換算表是依照尺從靜止開始掉落的距離算出的；課本常用 30 cm 的尺，這裡用 50 cm 的尺，比較不容易漏接。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>測量紀錄（秒）</h3><div class="table-wrap" id="labR-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labR-mission"></div>
    <details class="card pad free c-ctl" id="labR-free"><summary>自由探索：再測幾次</summary>
      <div class="field"><div class="field-head"><span>測量方式</span></div>
        <div class="seg-ctl" role="group" aria-label="測量方式" id="labR-kind"><button type="button" data-v="simple">看到紅色就按</button><button type="button" data-v="choice">紅色才按、綠色不按</button><button type="button" data-v="ruler">接尺</button></div></div>
      <div class="acts"><button class="ctl primary press" type="button" id="labR-press2">開始</button></div>
      <div class="btn-row"><button class="ctl small" type="button" id="labR-clear">清除紀錄</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labR-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 560, fill: C.bg }, svg);
      const root = g(svg);
      const R = { simple: [], choice: [], ruler: [], wrong: 0 };
      const st = { phase: 'idle', kind: 'simple', t0: 0, timer: 0, color: null, greens: 0, free: false, freeKind: 'simple' };

      // ---------- 畫面一：螢幕（紅色圓形／綠色方形） ----------
      const scr = g(root);
      const panel = el('rect', { x: 40, y: 24, width: 1120, height: 400, rx: 24, fill: SCR, stroke: '#3a5060', 'stroke-width': 3 }, scr);
      const redC = el('circle', { cx: 600, cy: 224, r: 120, fill: RED, opacity: 0 }, scr);
      const greenS = el('rect', { x: 490, y: 114, width: 220, height: 220, rx: 18, fill: GREEN, opacity: 0 }, scr);
      const big = text(scr, 600, 252, '', { 'font-size': 76, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700, class: 'mono' });
      const msg = text(scr, 600, 232, '', { 'font-size': 46, 'text-anchor': 'middle', fill: C.ink2 });
      const sub = text(scr, 600, 300, '', { 'font-size': 30, 'text-anchor': 'middle', fill: C.mute });
      const chainG = g(scr);
      let cx = 0;
      const chain = [['眼（受器）', '#62a8ff'], ['感覺神經', '#62a8ff'], ['大腦', '#e8a0b4'], ['運動神經', '#ff9a5c'], ['手指肌肉（動器）', '#ff9a5c']];
      const widths = chain.map(([s]) => S.textWidth(s, 22) + 26), total = widths.reduce((a, b) => a + b, 0) + 40 * (chain.length - 1);
      cx = 600 - total / 2;
      chain.forEach(([s, c], i) => {
        S.pill(chainG, cx + widths[i] / 2, 500, s, { size: 22, color: c, edge: c });
        if (i < chain.length - 1) { el('line', { x1: cx + widths[i] + 6, y1: 500, x2: cx + widths[i] + 28, y2: 500, stroke: C.ink2, 'stroke-width': 2.5 }, chainG); el('path', { d: `M ${cx + widths[i] + 34},500 l -9,-6 l 0,12 Z`, fill: C.ink2 }, chainG); }
        if (i === 2) chainG.brainX = cx + widths[i] / 2;
        cx += widths[i] + 40;
      });
      const judge = text(chainG, chainG.brainX, 462, '先判斷顏色', { 'font-size': 20, 'text-anchor': 'middle', fill: '#e8a0b4', opacity: 0 });

      // ---------- 畫面二：接尺 ----------
      const rul = g(root, { opacity: 0 });
      const holder = g(rul);
      const hl = el('rect', { x: 540, y: 26, width: 26, height: 44, rx: 10, fill: C.skin }, holder);
      const hr = el('rect', { x: 634, y: 26, width: 26, height: 44, rx: 10, fill: C.skin }, holder);
      const ruler = g(rul);
      el('rect', { x: 570, y: RTOP, width: 60, height: RULER_CM * PXCM, rx: 4, fill: '#e9dcb0', stroke: '#b8a670', 'stroke-width': 2 }, ruler);
      for (let cm = 0; cm <= RULER_CM; cm++) {
        const y = RBOT - cm * PXCM;
        el('line', { x1: 570, y1: y, x2: 570 + (cm % 5 ? 10 : 22), y2: y, stroke: '#5a4a20', 'stroke-width': cm % 5 ? 1.5 : 2.5 }, ruler);
        if (cm % 5 === 0 && cm > 0 && cm < RULER_CM) text(ruler, 612, y + 7, String(cm), { 'font-size': 20, 'text-anchor': 'middle', fill: '#3a2a10', 'font-weight': 700 });
      }
      const catchLine = el('line', { x1: 500, y1: RBOT, x2: 700, y2: RBOT, stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0 }, rul);
      const fl = el('rect', { x: 516, y: RBOT - 18, width: 46, height: 36, rx: 16, fill: C.skin }, rul);
      const fr = el('rect', { x: 638, y: RBOT - 18, width: 46, height: 36, rx: 16, fill: C.skin }, rul);
      text(rul, 490, RBOT + 7, '你的手指（對準 0 cm）', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const rTitle = text(rul, 270, 110, '接尺實驗', { 'font-size': 34, 'text-anchor': 'middle', 'font-weight': 700 });
      const rMsg = text(rul, 270, 180, '', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      const rD = text(rul, 270, 270, '', { 'font-size': 40, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const rT = text(rul, 270, 330, '', { 'font-size': 28, 'text-anchor': 'middle', fill: C.ink });
      // 換算表
      const TX = 790, TW = 340;
      el('rect', { x: TX, y: 40, width: TW, height: 470, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, rul);
      text(rul, TX + TW / 2, 76, '換算表', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(rul, TX + 90, 112, '落下距離', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(rul, TX + 250, 112, '反應時間', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const rowHi = el('rect', { x: TX + 12, y: 0, width: TW - 24, height: 34, rx: 8, fill: 'rgba(255,209,102,0.22)', opacity: 0 }, rul);
      const DS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
      DS.forEach((d, i) => {
        const y = 150 + i * 36;
        text(rul, TX + 90, y, `${d} cm`, { 'font-size': 22, 'text-anchor': 'middle', class: 'mono' });
        text(rul, TX + 250, y, `${f2(timeOf(d))} 秒`, { 'font-size': 22, 'text-anchor': 'middle', class: 'mono' });
      });
      const setRuler = (d) => ruler.setAttribute('transform', `translate(0,${(d * PXCM).toFixed(1)})`);
      const setFingers = (closed) => { fl.setAttribute('x', closed ? 528 : 516); fr.setAttribute('x', closed ? 626 : 638); };
      const setHolder = (open) => { hl.setAttribute('x', open ? 520 : 540); hr.setAttribute('x', open ? 654 : 634); };
      const markRow = (d) => {
        if (d == null) { rowHi.setAttribute('opacity', 0); return; }
        const i = DS.reduce((b, v, k) => (Math.abs(v - d) < Math.abs(DS[b] - d) ? k : b), 0);
        rowHi.setAttribute('y', 150 + i * 36 - 25); rowHi.setAttribute('opacity', 1);
      };

      // ---------- 畫面三：判斷題 ----------
      const qz = g(root, { opacity: 0 });
      const qText = text(qz, 600, 110, '', { 'font-size': 40, 'text-anchor': 'middle', 'font-weight': 700 });
      const qSub = text(qz, 600, 160, '', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const paths = { r: g(qz, { opacity: 0.35 }), v: g(qz, { opacity: 0.35 }) };
      [['r', 300, '反射', [['受器', '#62a8ff'], ['感覺神經', '#62a8ff'], ['脊髓或腦幹', C.hi], ['運動神經', '#ff9a5c'], ['動器', '#ff9a5c']]],
        ['v', 430, '意識行為', [['受器', '#62a8ff'], ['感覺神經', '#62a8ff'], ['大腦（判斷）', '#e8a0b4'], ['運動神經', '#ff9a5c'], ['動器', '#ff9a5c']]]].forEach(([k, y, name, ch]) => {
        const p = paths[k];
        el('rect', { x: 40, y: y - 52, width: 1120, height: 104, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, p);
        text(p, 70, y + 9, name, { 'font-size': 26, 'font-weight': 700, fill: k === 'r' ? C.hi : '#e8a0b4' });
        let x = 250;
        ch.forEach(([s, c], i) => {
          const w = S.textWidth(s, 22) + 26;
          S.pill(p, x + w / 2, y, s, { size: 22, color: c, edge: c });
          if (i < ch.length - 1) { el('line', { x1: x + w + 6, y1: y, x2: x + w + 26, y2: y, stroke: C.ink2, 'stroke-width': 2.5 }, p); el('path', { d: `M ${x + w + 32},${y} l -9,-6 l 0,12 Z`, fill: C.ink2 }, p); }
          x += w + 38;
        });
      });
      text(qz, 600, 528, '反射不經大腦思考，路徑較短，反應較快', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });

      const view = (v) => { scr.setAttribute('opacity', v === 'screen' ? 1 : 0); rul.setAttribute('opacity', v === 'ruler' ? 1 : 0); qz.setAttribute('opacity', v === 'quiz' ? 1 : 0); };
      const status = (h) => { $('status').innerHTML = h; };

      // ---------- 測量 ----------
      const curKind = () => (st.free ? st.freeKind : (MISSIONS[mi] || {}).kind);
      const screenIdle = (m, s = '') => {
        redC.setAttribute('opacity', 0); greenS.setAttribute('opacity', 0); panel.setAttribute('fill', SCR);
        msg.textContent = m; sub.textContent = s; big.textContent = '';
      };
      function labelPress() {
        const k = curKind();
        const L = { idle: k === 'ruler' ? '準備' : '開始', wait: '等一下…', go: '按！', nogo: '按！', rwait: '注意看尺…', rfall: '接住！' }[st.phase];
        box.querySelectorAll('.press').forEach((b) => { b.textContent = L; b.classList.toggle('go', st.phase === 'go' || st.phase === 'nogo' || st.phase === 'rfall'); });
      }
      function setPhase(p) { st.phase = p; labelPress(); }
      function startTrial() {
        const k = curKind();
        clearTimeout(st.timer);
        if (k === 'ruler') {
          view('ruler'); setRuler(0); setFingers(false); setHolder(false); markRow(null); catchLine.setAttribute('opacity', 0);
          rMsg.textContent = '注意看尺，掉下來就接住！'; rD.textContent = ''; rT.textContent = '';
          setPhase('rwait');
          st.timer = setTimeout(drop, 1200 + Math.random() * 2300);
          status('準備好了。尺隨時會掉下來……');
          return;
        }
        view('screen'); judge.setAttribute('opacity', k === 'choice' ? 1 : 0);
        screenIdle('等一下……', k === 'choice' ? '紅色圓形才按，綠色方形不要按' : '紅色圓形出現就按');
        setPhase('wait');
        st.timer = setTimeout(stimulus, 1500 + Math.random() * 2000);
        status('注意看畫面……');
      }
      function stimulus() {
        const k = curKind();
        const red = k !== 'choice' || st.greens >= 2 || Math.random() < 0.6;
        st.color = red ? 'red' : 'green';
        st.greens = red ? 0 : st.greens + 1;
        msg.textContent = ''; sub.textContent = '';
        (red ? redC : greenS).setAttribute('opacity', 1);
        st.t0 = performance.now();
        setPhase(red ? 'go' : 'nogo');
        st.timer = setTimeout(() => {
          if (st.phase === 'nogo') { screenIdle('很好，綠色沒有按', '再按一次「開始」繼續'); setPhase('idle'); status('看到綠色方形，忍住沒有按，很好！'); after(); }
          else if (st.phase === 'go') { screenIdle('太慢了，這次不算', '再按一次「開始」'); setPhase('idle'); status('超過 1.5 秒都沒有按，這次不算。'); }
        }, red ? 1500 : 1200);
      }
      let raf = 0;
      function drop() {
        setHolder(true);
        st.t0 = performance.now();
        setPhase('rfall');
        status('尺掉下來了！');
        const loop = () => { if (st.phase !== 'rfall') return; setRuler(Math.min(RULER_CM + 20, dist((performance.now() - st.t0) / 1000))); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
        st.timer = setTimeout(() => {
          if (st.phase !== 'rfall') return;
          setRuler(RULER_CM + 20); setPhase('idle');
          rMsg.textContent = '沒接到！'; rD.textContent = ''; rT.textContent = '';
          status(`沒接到：尺已經掉了超過 ${RULER_CM} cm（反應時間超過約 ${f2(timeOf(RULER_CM))} 秒）。專心看尺，再按「準備」試一次。`);
        }, timeOf(RULER_CM) * 1000 + 15);
      }
      function press(now = performance.now()) {
        const k = curKind();
        if (!k || k === 'quiz') return;
        if (st.phase === 'idle') { startTrial(); return; }
        clearTimeout(st.timer);
        if (st.phase === 'wait' || st.phase === 'rwait') {
          setPhase('idle');
          if (k === 'ruler') { rMsg.textContent = '太早了！'; setHolder(false); }
          else screenIdle('太早按了！', '這次不算，再按一次「開始」');
          status(k === 'ruler' ? '尺還沒掉就按了，這次不算。要看到尺<b>開始掉</b>才按。' : '紅色圓形還沒出現就按了，這次不算。要<b>看到</b>才按喔。');
          return;
        }
        const t = (now - st.t0) / 1000;
        if (st.phase === 'nogo') {
          R.wrong++; setPhase('idle'); screenIdle('綠色不要按喔！', '這次不算，再按一次「開始」');
          status('出現的是<b>綠色方形</b>，不要按。這次不算。'); log(); return;
        }
        if (t < 0.1) { setPhase('idle'); if (k === 'ruler') { rMsg.textContent = '太快了，可能是猜的'; setHolder(false); setRuler(0); } else screenIdle('太快了，可能是猜的', '這次不算，再按一次「開始」'); status('不到 0.1 秒就按了，可能是用猜的，這次不算。'); return; }
        if (st.phase === 'rfall') {
          cancelAnimationFrame(raf);
          const d = dist(t);
          setRuler(d); setFingers(true); catchLine.setAttribute('opacity', 1); markRow(d);
          R.ruler.push({ d, t });
          rMsg.textContent = '接住了！'; rD.textContent = `尺落下 ${d.toFixed(1)} cm`; rT.textContent = `反應時間約 ${f2(t)} 秒`;
          setPhase('idle');
          status(`尺落下 <b>${d.toFixed(1)} cm</b>。對照換算表，反應時間約 <b>${f2(t)} 秒</b>。`);
          log(); after(); return;
        }
        // 紅色：記錄
        R[k].push(t);
        redC.setAttribute('opacity', 0.25);
        big.textContent = `${f2(t)} 秒`;
        const n = R[k].length;
        sub.textContent = '';
        setPhase('idle');
        status(`第 ${n} 次：<b>${f2(t)} 秒</b>${n >= 3 ? `　目前平均 <b>${f2(avg(R[k]))} 秒</b>` : ''}。按「開始」可以再測一次。`);
        log(); after();
      }

      function log() {
        const row = (name, arr, fmt, mean) => `<tr><th>${name}</th><td>${arr.length ? arr.slice(-6).map(fmt).join('、') : '—'}</td><td>${arr.length ? mean : '—'}</td></tr>`;
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>測量</th><th>每次的結果</th><th>平均</th></tr></thead><tbody>
          ${row('看到紅色就按', R.simple, f2, R.simple.length ? `${f2(avg(R.simple))} 秒` : '')}
          ${row('紅色才按、綠色不按', R.choice, f2, R.choice.length ? `${f2(avg(R.choice))} 秒` : '')}
          ${row('接尺', R.ruler, (r) => `${r.d.toFixed(0)} cm（${f2(r.t)}）`, R.ruler.length ? `${f2(avg(R.ruler.map((r) => r.t)))} 秒` : '')}
          </tbody></table>${R.wrong ? `<p class="m-hint" style="margin-top:0.4rem">看到綠色卻按下去：${R.wrong} 次</p>` : ''}`;
      }

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, pred = -1, picked = -1, qi = 0, qOk = false, qWrong = null, base = { simple: 0, choice: 0, ruler: 0 };
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? 'ok' : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      const pressHtml = () => `<div class="acts"><button class="ctl primary press" type="button" id="labR-press">開始</button></div>`;
      const cnt = (k) => R[k].length - base[k];
      function after() { if (mi < MISSIONS.length) { checkMission(); drawMission(); } }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>重點整理</strong>反應時間：從受到刺激到做出反應所經過的時間。<br>要先判斷再反應時，大腦要多花時間，反應時間會變長。<br>接尺：尺落下的距離越短，反應時間越短。<br>反射不經大腦思考，比意識行為快。</div>
            <button class="ctl primary" type="button" id="labR-again">再練習一次</button>`;
          mbox.querySelector('#labR-again').addEventListener('click', reset);
          if (!st.free) { st.free = true; $('free').open = true; prepView(st.freeKind); status('任務完成！可以在「自由探索」再多測幾次。'); syncFree(); }
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.kind === 'quiz') {
          const [s, ans, why] = ITEMS[qi];
          html += `<p class="m-hint">第 ${qi + 1} / ${ITEMS.length} 題</p><p class="m-text">「<b>${s}</b>」是哪一種？</p>
            <div class="acts">${['r', 'v'].map((k) => `<button class="ctl ${qWrong === k ? '' : 'primary'}" type="button" data-q="${k}" ${qOk ? 'disabled' : ''} style="${qWrong === k ? 'border-color:var(--bad);color:var(--bad)' : qOk && k === ans ? 'background:var(--good);border-color:var(--good)' : ''}">${KIND[k]}</button>`).join('')}</div>`;
          if (qWrong) html += `<div class="fb bad"><strong>再想想看</strong>這個反應需要大腦先想一想、做決定嗎？還是一碰到就自動發生？</div>`;
          if (qOk) html += `<div class="fb ok"><strong>答對了：${KIND[ans]}</strong>${why}</div><button class="ctl primary" type="button" id="labR-qnext">${qi === ITEMS.length - 1 ? '完成' : '下一題'}</button>`;
        } else if (m.predict && pred < 0) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}">${o}</button>`).join('')}</div>`;
        } else {
          if (m.predict) html += `<p class="m-hint">你的預測：${m.predict.opts[pred]}</p>`;
          if (!done) {
            html += `<p class="m-text">${m.text}</p>${pressHtml()}`;
            if (m.need) html += `<p class="m-hint">已測 ${Math.min(m.need, cnt(m.kind))} / ${m.need} 次</p>`;
          }
          if (m.quiz) {
            const ready = cnt('ruler') > 0;
            if (ready) {
              html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
              if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
              if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
            } else html += '<p class="m-hint">先接住一次尺，再回答問題。</p>';
          } else if (done) html += feedback(m);
        }
        if (done && m.kind !== 'quiz') html += `<button class="ctl primary" type="button" id="labR-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; drawMission(); }));
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        mbox.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => {
          const ans = ITEMS[qi][1];
          if (st.free) { st.free = false; prepView('quiz'); syncFree(); }
          if (b.dataset.q === ans) { qOk = true; qWrong = null; paths[ans].setAttribute('opacity', 1); paths[ans === 'r' ? 'v' : 'r'].setAttribute('opacity', 0.2); } else qWrong = b.dataset.q;
          drawMission();
        }));
        const qn = mbox.querySelector('#labR-qnext');
        if (qn) qn.addEventListener('click', () => { if (qi < ITEMS.length - 1) { qi++; qOk = false; qWrong = null; showItem(); drawMission(); } else { mi++; enterMission(); } });
        const nx = mbox.querySelector('#labR-next');
        if (nx) nx.addEventListener('click', () => { mi++; enterMission(); });
        bindPress(mbox.querySelector('#labR-press'));
        labelPress();
      }
      function feedback(m) {
        if (m.kind === 'simple') {
          const a = avg(R.simple.slice(base.simple));
          return `<div class="fb ok"><strong>你的平均：${f2(a)} 秒</strong>從眼睛看到、訊息經神經傳到大腦，大腦再命令手指的肌肉收縮，都需要時間。一般人看到後按下按鈕，大約要 0.2～0.3 秒＊。</div>`;
        }
        const a1 = avg(R.simple), a2 = avg(R.choice.slice(base.choice)), d = a2 - a1;
        const res = d > 0.02 ? 0 : d < -0.02 ? 2 : 1;
        const ok = res === pred;
        return `<div class="fb ${ok ? 'ok' : 'bad'}"><strong>${ok ? '和你的預測一樣' : '和你的預測不一樣'}</strong>你的平均：看到紅色就按 ${f2(a1)} 秒 → 先判斷再按 ${f2(a2)} 秒（${['變長', '差不多', '變短'][res]}）。<br>要先<b>判斷</b>是哪一種顏色，再決定要不要按，大腦要多花時間，所以反應時間通常會<b>變長</b>。${res !== 0 ? '這次的差別不明顯，可以在做完任務後打開「自由探索」多測幾次再比較。' : ''}</div>`;
      }
      function showItem() {
        const [s] = ITEMS[qi];
        qText.textContent = s; qSub.textContent = '是反射，還是意識行為？';
        paths.r.setAttribute('opacity', 0.35); paths.v.setAttribute('opacity', 0.35);
      }
      // 依測量方式準備畫面
      function prepView(k) {
        clearTimeout(st.timer); cancelAnimationFrame(raf); setPhase('idle');
        if (k === 'simple' || k === 'choice') { view('screen'); judge.setAttribute('opacity', k === 'choice' ? 1 : 0); screenIdle('按「開始」', k === 'choice' ? '紅色圓形才按，綠色方形不要按' : '紅色圓形出現時，立刻按'); status('按下「開始」，然後注意看畫面。'); }
        else if (k === 'ruler') { view('ruler'); setRuler(0); setFingers(false); setHolder(false); markRow(null); catchLine.setAttribute('opacity', 0); rMsg.textContent = '按「準備」開始'; rD.textContent = ''; rT.textContent = ''; status('按「準備」，然後盯著尺。'); }
        else if (k === 'quiz') { view('quiz'); showItem(); status('一次一題：判斷是反射還是意識行為。'); }
      }
      function enterMission() {
        done = false; pred = -1; picked = -1; qi = 0; qOk = false; qWrong = null;
        base = { simple: R.simple.length, choice: R.choice.length, ruler: R.ruler.length };
        st.free = false;
        if (MISSIONS[mi]) prepView(MISSIONS[mi].kind);
        else { clearTimeout(st.timer); setPhase('idle'); }
        drawMission();
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done || m.quiz || m.kind === 'quiz') return;
        if (m.need && cnt(m.kind) >= m.need) done = true;
      }

      // ---------- 按鈕、畫面、空白鍵 ----------
      // 任務卡上的按鈕回到任務；自由探索的按鈕用自由探索的設定
      function bindPress(b, free = false) {
        if (!b || b.bound) return;
        b.bound = true;
        b.addEventListener('pointerdown', (e) => {
          if (e.button > 0) return;
          e.preventDefault();
          if (free !== st.free && (free || mi < MISSIONS.length)) { st.free = free; prepView(curKind()); syncFree(); }
          press();
        });
      }
      svg.addEventListener('pointerdown', (e) => { if (e.button > 0) return; press(); });
      const onKey = (e) => {
        if (e.key !== ' ' || e.repeat) return;
        if (e.target.closest && e.target.closest('input,textarea,select,summary')) return;
        const k = curKind();
        if (!k || k === 'quiz') return;
        if (!st.free && MISSIONS[mi] && ((MISSIONS[mi].predict && pred < 0) || done)) return;
        e.preventDefault();
        press();
      };
      document.addEventListener('keydown', onKey);

      // ---------- 自由探索 ----------
      function syncFree() { box.querySelectorAll('#labR-kind button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === st.freeKind)); labelPress(); }
      box.querySelectorAll('#labR-kind button').forEach((b) => b.addEventListener('click', () => {
        st.free = true; st.freeKind = b.dataset.v; prepView(st.freeKind); syncFree();
      }));
      bindPress($('press2'), true);
      $('clear').addEventListener('click', () => { R.simple.length = 0; R.choice.length = 0; R.ruler.length = 0; R.wrong = 0; log(); status('紀錄已清除。'); });

      function reset() {
        clearTimeout(st.timer); cancelAnimationFrame(raf);
        R.simple.length = 0; R.choice.length = 0; R.ruler.length = 0; R.wrong = 0;
        st.free = false; st.freeKind = 'simple'; st.greens = 0;
        $('free').open = false;
        mi = 0; log(); enterMission(); syncFree();
      }
      reset();

      // 測試用：fire() 立刻出現刺激（或放開尺）；sim(ms) 在刺激後 ms 毫秒按下
      S._labR = {
        R, st, press, get mission() { return mi; },
        fire() { if (st.phase === 'wait') { clearTimeout(st.timer); stimulus(); } else if (st.phase === 'rwait') { clearTimeout(st.timer); drop(); } return st.phase; },
        sim(ms) { if (['go', 'nogo', 'rfall'].includes(st.phase)) { press(st.t0 + ms); } return st.phase; },
        answer(k) { const b = mbox.querySelector(`[data-q="${k}"]`); if (b) b.click(); },
      };
      return { unmount() { clearTimeout(st.timer); cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); delete S._labR; } };
    },
  });
})();
