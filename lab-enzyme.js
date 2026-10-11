/* 互動模型：唾液澱粉酶 — 調水浴溫度、酸鹼、酵素來源；每分鐘取一滴加碘液（點滴板），看澱粉何時被分解完 ＋ 任務 */
(() => {
  const { el, g, text, C } = S;
  const ENZ = '#63d4bf', SUG = '#ffcf5c';
  const TMAX = 12, SEC_PER_MIN = 0.6; // 動畫約 0.6 秒代表 1 分鐘＊
  const CLEAR = 0.08; // 澱粉剩下這麼少時，碘液看不出藍黑色
  const curve = (T) => (T <= 37 ? Math.pow(Math.max(0, T) / 37, 1.6) : Math.max(0, 1 - Math.pow((T - 37) / 23, 2)));
  const ENZS = { saliva: '唾液', boiled: '煮沸過的唾液', water: '清水（對照）' };
  const PHS = { neutral: '中性', acid: '酸性（加稀鹽酸）' };
  const band = (T) => (T <= 5 ? 'cold' : T >= 30 && T <= 40 ? 'body' : T >= 70 ? 'hot' : 'other');

  // 把一次實驗的溫度紀錄整理成「區段」（忽略拖動滑桿時的短暫數值）
  const bandsOf = (r) => {
    const out = [];
    r.segs.filter((s) => s.dur >= 0.5).forEach((s) => {
      const b = band(s.T), last = out[out.length - 1];
      if (last && last.b === b) { last.dur += s.dur; last.Ts.push(s.T); } else out.push({ b, dur: s.dur, Ts: [s.T] });
    });
    return out;
  };
  const std = (r) => r.enz === 'saliva' && r.ph === 'neutral';
  const only = (r, b) => { const bs = bandsOf(r); return bs.length === 1 && bs[0].b === b; };
  const seq = (r, a, da, b, db) => { const bs = bandsOf(r); const i = bs.findIndex((x) => x.b === a && x.dur >= da); return i >= 0 && bs.slice(i + 1).some((x) => x.b === b && x.dur >= db); };

  const MISSIONS = [
    { title: '酵素分解澱粉', text: '把<b>唾液</b>加進澱粉液，放在 <b>37 °C</b> 的水浴中，看點滴板上的顏色怎麼變。', acts: [['開始：唾液、37 °C', 'saliva', 'neutral', 37]], done: (rs) => rs.some((r) => std(r) && only(r, 'body') && r.cleared != null),
      why: '一開始碘液變藍黑色（有澱粉）；幾分鐘後不再變藍黑色，表示澱粉被唾液中的<b>澱粉酶</b>分解了（變成麥芽糖等較小的醣）。' },
    { title: '對照組', text: '把唾液換成<b>清水</b>，其他條件不變，再做一次。', acts: [['換成清水，37 °C', 'water', 'neutral', 37]], done: (rs) => rs.some((r) => r.enz === 'water' && r.ph === 'neutral' && only(r, 'body')),
      why: '清水裡沒有酵素，澱粉一直沒被分解，碘液一直變藍黑色。有了對照組，才能確定澱粉是被<b>唾液</b>分解的。' },
    { title: '哪個溫度最快？', predict: { q: '用唾液做實驗，水浴是 <b>0 °C、37 °C、80 °C</b> 時，哪一個溫度澱粉最快被分解？先預測：', opts: ['0 °C', '37 °C', '80 °C'], ans: 1 },
      text: '37 °C 已經做過了，再分別做 <b>0 °C</b> 和 <b>80 °C</b>：', acts: [['0 °C', 'saliva', 'neutral', 0], ['80 °C', 'saliva', 'neutral', 80]], done: (rs) => rs.some((r) => std(r) && only(r, 'cold')) && rs.some((r) => std(r) && only(r, 'hot')),
      why: '<b>37 °C</b> 最快（接近人的體溫）。0 °C 時酵素作用非常慢；80 °C 時酵素被破壞，所以 12 分鐘內澱粉都沒被分解。' },
    { title: '冷了再回溫', text: '先在 <b>0 °C</b> 開始實驗，過 2 分鐘後，把水浴調到 <b>37 °C</b>，看看會怎樣。', acts: [['在 0 °C 開始', 'saliva', 'neutral', 0]], then: { after: 2, label: '把水浴調到 37 °C', T: 37 }, done: (rs) => rs.some((r) => std(r) && seq(r, 'cold', 1.5, 'body', 1) && r.cleared != null),
      why: '低溫只是讓酵素作用變慢，並沒有破壞酵素；回到適當溫度，又能分解澱粉。食物放冰箱能保存比較久，也是因為低溫讓微生物和酵素的作用變慢。' },
    { title: '熱過再降溫', text: '先在 <b>80 °C</b> 開始實驗，過 1 分鐘後，把水浴降回 <b>37 °C</b>，看看會不會恢復。', acts: [['在 80 °C 開始', 'saliva', 'neutral', 80]], then: { after: 1, label: '把水浴降回 37 °C', T: 37 }, done: (rs) => rs.some((r) => std(r) && seq(r, 'hot', 0.8, 'body', 4) && r.cleared == null),
      why: '高溫會使酵素<b>被破壞</b>（形狀改變），降溫後也<b>不能恢復</b>。煮沸過的唾液也是一樣，不能分解澱粉。' },
    { title: '到了胃裡呢？', need: (rs) => rs.some((r) => r.enz === 'saliva' && r.ph === 'acid' && only(r, 'body')), needText: '在唾液和澱粉液中加入<b>稀鹽酸</b>（變成酸性），37 °C 再做一次：', acts: [['加稀鹽酸，37 °C', 'saliva', 'acid', 37]],
      quiz: { q: '胃液是強酸性。唾液中的澱粉酶跟著食物進入胃以後，會怎樣？', opts: ['繼續快速分解澱粉', '幾乎不再分解澱粉', '變成分解蛋白質'], ans: 1, hint: '看看剛剛酸性的實驗：點滴板的顏色有沒有改變？' },
      why: '酵素需要合適的酸鹼環境。唾液中的澱粉酶在中性附近作用最好，在強酸的胃裡幾乎不作用；胃液中的酵素才適合酸性環境。每種酵素只能分解特定的物質，不會「變成」分解別的東西。' },
  ];

  S.registerLab({
    id: 'lab-enzyme', section: '3-2', title: '唾液酵素實驗',
    mount(box) {
      box.innerHTML = `
<style>
  .labE { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; min-width: 0; }
  .labE .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labE .pad { padding: 1rem 1.25rem; }
  .labE .seg-ctl button:disabled { opacity: 0.4; cursor: not-allowed; }
  .labE .quick { display: flex; gap: 0.35rem; flex-wrap: wrap; }
  .labE .table-wrap { overflow-x: auto; }
  .labE .tbl { min-width: 24rem; }
  @media (max-width: 900px) {
    .labE { display: flex; flex-direction: column; align-items: stretch; }
    .labE .col { display: contents; }
    .labE .c-stage { order: 1; } .labE .c-mis { order: 2; } .labE .c-table { order: 3; } .labE .c-ctl { order: 4; }
  }
</style>
<div class="labE">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 620" role="img" aria-label="水浴中的試管、放大的分子和點滴板"></svg></div>
      <div class="pad">
        <p class="status-line" id="labE-status" aria-live="polite"></p>
        <p class="footnote">＊示意：動畫中約 0.6 秒代表 1 分鐘；實際需要的時間會因唾液的濃度而不同。放大圖的分子都畫得很大，數量也是示意。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>實驗紀錄</h3><div class="table-wrap" id="labE-log"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labE-mission"></div>
    <details class="card pad free c-ctl" id="labE-free"><summary>自由探索：自己調整條件</summary>
      <div class="field"><div class="field-head"><span>加入的液體</span></div>
        <div class="seg-ctl" role="group" aria-label="加入的液體" id="labE-enz">${Object.entries(ENZS).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><span>酸鹼</span></div>
        <div class="seg-ctl" role="group" aria-label="酸鹼" id="labE-ph">${Object.entries(PHS).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><div class="field-head"><label for="labE-T">水浴溫度（實驗中也可以調）</label><output id="labE-T-o"></output></div>
        <input type="range" id="labE-T" min="0" max="90" step="1" value="37">
        <div class="quick">${[0, 20, 37, 60, 80].map((t) => `<button class="ctl small" type="button" data-t="${t}">${t} °C</button>`).join('')}</div></div>
      <div class="btn-row"><button class="ctl primary" type="button" id="labE-go">開始實驗</button><button class="ctl" type="button" id="labE-stop">停止</button></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labE-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 620, fill: C.bg }, svg);
      const root = g(svg);
      const defs = el('defs', {}, root);
      const st = { enz: 'saliva', ph: 'neutral', T: 37 };
      const runs = [];
      let run = null;

      // ---------- 水浴＋試管＋溫度計 ----------
      const plate = el('rect', { x: 66, y: 572, width: 308, height: 10, rx: 4, fill: '#5a6670' }, root);
      el('rect', { x: 56, y: 580, width: 328, height: 22, rx: 6, fill: '#3a4a56' }, root);
      const water = el('rect', { x: 76, y: 320, width: 288, height: 248, fill: '#5fb8ff', opacity: 0.18 }, root);
      const ice = g(root, { opacity: 0 });
      [[96, 318], [252, 322]].forEach(([x, y]) => el('rect', { x, y, width: 34, height: 28, rx: 6, fill: 'rgba(230,245,255,0.7)', stroke: '#fff', 'stroke-width': 2 }, ice));
      const steam = g(root, { opacity: 0 });
      [110, 268].forEach((x) => el('path', { d: `M ${x},296 q -10,-14 0,-28 q 10,-14 0,-28`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, steam));
      // 試管
      el('path', { d: 'M 175,214 L 175,496 C 175,530 225,530 225,496 L 225,214 Z' }, el('clipPath', { id: 'labEtube' }, defs));
      const liq = el('rect', { x: 170, y: 380, width: 60, height: 160, fill: '#ece6d4', opacity: 0, 'clip-path': 'url(#labEtube)' }, root);
      el('path', { d: 'M 168,206 L 175,214 L 175,496 C 175,530 225,530 225,496 L 225,214 L 232,206', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, root);
      el('path', { d: 'M 66,300 L 76,308 L 76,560 Q 76,568 84,568 L 356,568 Q 364,568 364,560 L 364,300', fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, root);
      // 溫度計
      el('rect', { x: 312, y: 196, width: 16, height: 340, rx: 8, fill: '#16293a', stroke: '#cfe8ff', 'stroke-width': 2 }, root);
      el('circle', { cx: 320, cy: 546, r: 15, fill: '#ff5f74' }, root);
      const col = el('rect', { x: 316, y: 300, width: 8, height: 240, fill: '#ff5f74' }, root);
      const tLbl = text(root, 320, 182, '', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink, class: 'mono' });
      text(root, 122, 556, '水浴', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }); // 放在水裡左下角：放大後放在底座下面會被舞台下緣切掉
      text(root, 200, 182, '澱粉液', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const addLbl = text(root, 200, 144, '', { 'font-size': 22, 'text-anchor': 'middle', fill: ENZ });

      // ---------- 放大圖 ----------
      const ZX = 600, ZY = 250, ZR = 140;
      el('line', { x1: 228, y1: 440, x2: ZX - ZR * 0.86, y2: ZY + ZR * 0.5, stroke: '#4a6272', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, root);
      el('line', { x1: 228, y1: 400, x2: ZX - ZR * 0.86, y2: ZY - ZR * 0.5, stroke: '#4a6272', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, root);
      el('circle', { cx: ZX, cy: ZY, r: ZR }, el('clipPath', { id: 'labEzoom' }, defs));
      el('circle', { cx: ZX, cy: ZY, r: ZR, fill: '#0f2230', stroke: '#4a6272', 'stroke-width': 3 }, root);
      const zg = g(root, { 'clip-path': 'url(#labEzoom)' });
      text(root, ZX, 92, '放大＊', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 澱粉鏈：6 條 × 4 對；從鏈的末端開始斷成「麥芽糖」（兩個一組）
      const pairs = [];
      for (let c = 0; c < 6; c++) {
        const y = ZY - 92 + c * 37, x0 = ZX - 86;
        el('line', { x1: x0, y1: y, x2: x0 + 7 * 24.5, y2: y, stroke: SUG, 'stroke-width': 3, opacity: 0.5, class: `labE-link${c}` }, zg);
        for (let k = 0; k < 4; k++) {
          const pg = g(zg);
          el('line', { x1: -12, y1: 0, x2: 12, y2: 0, stroke: SUG, 'stroke-width': 3 }, pg);
          el('circle', { cx: -12, cy: 0, r: 9, fill: SUG }, pg);
          el('circle', { cx: 12, cy: 0, r: 9, fill: SUG }, pg);
          pairs.push({ g: pg, c, k, x0: x0 + 12 + k * 49, y0: y, x: 0, y: 0, vx: 0, vy: 0, broken: false });
        }
      }
      const links = [...zg.querySelectorAll('line[class^="labE-link"]')];
      const order = pairs.slice().sort((a, b) => b.k - a.k || ((a.c * 7) % 6) - ((b.c * 7) % 6)); // 先斷末端
      const rnd = S.rng(7);
      const enzymes = [0, 1, 2, 3].map((i) => {
        const eg = g(zg, { opacity: 0 });
        const ok = el('path', { d: 'M 0,0 L 17,-11 A 20,20 0 1,0 17,11 Z', fill: ENZ }, eg);
        const bad = el('path', { d: 'M -18,-6 C -20,-20 0,-22 8,-14 C 20,-18 24,-2 14,6 C 22,16 2,22 -6,14 C -20,18 -24,4 -18,-6 Z', fill: '#7a8a92', opacity: 0 }, eg);
        return { g: eg, ok, bad, x: ZX - 60 + rnd() * 120, y: ZY - 80 + rnd() * 160, a: rnd() * 6.28 };
      });
      // 圖例：x 是文字的開頭，小圖放在文字左邊（字放大到 24 後重新排過間距，避免小圖碰到字）
      [[ZX - 126, '澱粉', 'chain'], [ZX - 25, '麥芽糖', 'pair'], [ZX + 103, '酵素', 'enz']].forEach(([x, s, kind]) => {
        const lg = g(root);
        if (kind === 'chain') [0, 1, 2].forEach((i) => el('circle', { cx: x - 38 + i * 13, cy: 420, r: 6, fill: SUG }, lg));
        if (kind === 'pair') [0, 1].forEach((i) => el('circle', { cx: x - 25 + i * 13, cy: 420, r: 6, fill: SUG }, lg));
        if (kind === 'enz') el('path', { d: `M ${x - 18},420 l 10,-7 a 12,12 0 1,0 0,14 Z`, fill: ENZ }, lg);
        text(lg, x, 428, s, { 'font-size': 22, fill: C.ink2 });
      });
      const clock = text(root, ZX, 500, '', { 'font-size': 34, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });

      // ---------- 點滴板 ----------
      text(root, 960, 92, '點滴板：每 1 分鐘取一滴，加碘液', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      el('rect', { x: 770, y: 110, width: 380, height: 352, rx: 18, fill: '#dfe7ea' }, root);
      const wells = [];
      for (let i = 0; i < TMAX; i++) {
        const cx = 820 + (i % 4) * 94, cy = 160 + Math.floor(i / 4) * 112;
        el('circle', { cx, cy, r: 34, fill: '#f5f8f9', stroke: '#b8c6cc', 'stroke-width': 3 }, root);
        const w = el('circle', { cx, cy, r: 0, fill: '#1f2a66' }, root);
        text(root, cx, cy + 58, `${i + 1} 分`, { 'font-size': 20, 'text-anchor': 'middle', fill: '#4d5d66' });
        wells.push(w);
      }
      const wellCol = (s) => (s > 0.3 ? '#1f2a66' : s > CLEAR ? '#4b3f78' : '#c5852c');

      // ---------- 每一格畫面 ----------
      const act = (r, T) => (r.enz === 'water' ? 0 : curve(T) * r.health * (r.ph === 'acid' ? 0.03 : 1));
      function step(dm) {
        const r = run, T = st.T;
        const last = r.segs[r.segs.length - 1];
        if (!last || last.T !== T) r.segs.push({ T, from: r.t, dur: 0 });
        if (r.enz !== 'water') {
          if (T >= 55) r.health = Math.max(0, r.health - dm * 1.6);
          else if (T > 45) r.health = Math.max(0, r.health - dm * 0.03 * (T - 45));
        }
        r.S = Math.max(0, r.S - (act(r, T) * dm) / 3.8);
        r.t += dm;
        r.segs[r.segs.length - 1].dur = r.t - r.segs[r.segs.length - 1].from;
        while (r.wells.length < Math.min(TMAX, Math.floor(r.t + 1e-6))) {
          const i = r.wells.length;
          r.wells.push(r.S);
          gsap.fromTo(wells[i], { attr: { r: 0, fill: wellCol(r.S) } }, { attr: { r: 26 }, duration: 0.3, ease: 'back.out(2)' });
          if (r.S <= CLEAR) { r.cleared = i + 1; break; }
          status(`第 ${i + 1} 分鐘：碘液變藍黑色 → 還有澱粉。`);
          if (MISSIONS[mi] && MISSIONS[mi].then && !done) drawMission(); // 中途按鈕到時間才能按
        }
        if (r.cleared != null || r.t >= TMAX) finish();
      }

      function render(dtReal) {
        const T = st.T;
        tLbl.textContent = `${T} °C`;
        const h = (T / 100) * 300;
        col.setAttribute('y', 536 - h); col.setAttribute('height', h + 4);
        water.setAttribute('fill', T < 25 ? '#5fb8ff' : T < 55 ? '#8fc8e8' : '#ff9a6c');
        ice.setAttribute('opacity', T <= 5 ? 1 : 0);
        steam.setAttribute('opacity', T >= 60 ? 1 : 0);
        plate.setAttribute('fill', T > 40 ? '#ff6b4a' : '#5a6670');
        const r = run;
        const Sv = r ? r.S : 1;
        liq.setAttribute('opacity', r ? 0.25 + 0.6 * Sv : 0);
        clock.textContent = r ? `經過 ${Math.min(TMAX, Math.floor(r.t))} 分鐘＊` : '';
        // 澱粉鏈
        const intact = Math.round(pairs.length * Sv);
        order.forEach((p, i) => {
          const br = r ? i >= intact : false;
          if (br && !p.broken) { p.broken = true; const a = rnd() * 6.28; p.vx = Math.cos(a) * 70; p.vy = Math.sin(a) * 70; }
          if (!br && p.broken) { p.broken = false; p.x = 0; p.y = 0; }
          if (p.broken) {
            p.vx += (rnd() - 0.5) * 400 * dtReal; p.vy += (rnd() - 0.5) * 400 * dtReal;
            const v = Math.hypot(p.vx, p.vy); if (v > 60) { p.vx *= 60 / v; p.vy *= 60 / v; }
            p.x += p.vx * dtReal; p.y += p.vy * dtReal;
            const d = Math.hypot(p.x0 + p.x - ZX, p.y0 + p.y - ZY);
            if (d > ZR - 16) { p.vx = -p.vx; p.vy = -p.vy; p.x *= 0.97; p.y *= 0.97; }
          }
          p.g.setAttribute('transform', `translate(${(p.x0 + p.x).toFixed(1)},${(p.y0 + p.y).toFixed(1)}) rotate(${p.broken ? ((p.x * 3) % 360).toFixed(0) : 0})`);
        });
        links.forEach((ln, c) => { const n = pairs.filter((p) => p.c === c && !p.broken).length; ln.setAttribute('x2', ZX - 86 + Math.max(0, n * 49 - 25)); ln.setAttribute('opacity', n > 1 ? 0.5 : 0); });
        // 酵素
        const sp = 20 + T * 0.9;
        enzymes.forEach((e) => {
          const on = r && r.enz !== 'water';
          e.g.setAttribute('opacity', on ? 1 : 0);
          if (!on) return;
          e.a += (rnd() - 0.5) * 3 * dtReal;
          e.x += Math.cos(e.a) * sp * dtReal; e.y += Math.sin(e.a) * sp * dtReal;
          if (Math.hypot(e.x - ZX, e.y - ZY) > ZR - 24) { e.a += Math.PI; e.x += (ZX - e.x) * 0.05; e.y += (ZY - e.y) * 0.05; }
          const dead = r.health < 0.5;
          e.ok.setAttribute('opacity', dead ? 0 : 1); e.bad.setAttribute('opacity', dead ? 1 : 0);
          e.g.setAttribute('transform', `translate(${e.x.toFixed(1)},${e.y.toFixed(1)}) rotate(${(e.a * 57.3).toFixed(0)})`);
        });
      }

      let raf = 0, lastTs = 0;
      const loop = (ts) => {
        const dt = Math.min(0.1, lastTs ? (ts - lastTs) / 1000 : 0);
        lastTs = ts;
        if (run && !run.done) step(dt / SEC_PER_MIN);
        render(dt);
        raf = requestAnimationFrame(loop);
      };

      // ---------- 開始／結束 ----------
      const status = (h) => { $('status').innerHTML = h; };
      function start() {
        if (run && !run.done) finish(true);
        run = { enz: st.enz, ph: st.ph, t: 0, S: 1, health: st.enz === 'saliva' ? 1 : 0, segs: [], wells: [], cleared: null, done: false };
        wells.forEach((w) => gsap.set(w, { attr: { r: 0 } }));
        pairs.forEach((p) => { p.broken = false; p.x = 0; p.y = 0; });
        addLbl.textContent = `＋ ${ENZS[st.enz].replace('（對照）', '')}`;
        status(`開始：澱粉液 ＋ ${ENZS[st.enz]}，${PHS[st.ph]}，水浴 ${st.T} °C。`);
        sync(); drawMission();
      }
      function finish(aborted) {
        const r = run;
        r.done = true;
        if (!aborted) {
          runs.push(r);
          if (r.cleared != null) status(`第 ${r.cleared} 分鐘：碘液<b>不再變藍黑色</b> → 澱粉已被分解了。`);
          else status(`${TMAX} 分鐘內，碘液一直變<b>藍黑色</b> → 澱粉幾乎沒有被分解。`);
          log();
          checkMission();
        } else status('已停止，這次不列入紀錄。');
        sync(); drawMission();
      }

      function log() {
        if (!runs.length) { $('log').innerHTML = '<p class="m-hint">每做完一次實驗，結果會列在這裡。</p>'; return; }
        const temps = (r) => { const ts = []; r.segs.filter((s) => s.dur >= 0.5).forEach((s) => { if (ts[ts.length - 1] !== s.T) ts.push(s.T); }); return (ts.length ? ts : [r.segs[0].T]).map((t) => `${t} °C`).join(' → '); };
        $('log').innerHTML = `<table class="tbl"><thead><tr><th>#</th><th>加入</th><th>酸鹼</th><th>水浴溫度</th><th>結果</th></tr></thead><tbody>${runs.map((r, i) => `<tr><td>${i + 1}</td><td>${ENZS[r.enz].replace('（對照）', '')}</td><td>${PHS[r.ph].replace('（加稀鹽酸）', '')}</td><td>${temps(r)}</td><td>${r.cleared != null ? `第 ${r.cleared} 分鐘分解完` : '12 分鐘後仍有澱粉'}</td></tr>`).join('')}</tbody></table>`;
      }

      // ---------- 控制 ----------
      function sync() {
        const running = run && !run.done;
        box.querySelectorAll('#labE-enz button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === st.enz); b.disabled = running; });
        box.querySelectorAll('#labE-ph button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.v === st.ph); b.disabled = running; });
        $('T-o').textContent = `${st.T} °C`;
        $('T').value = st.T;
        $('go').textContent = running ? '重新開始' : '開始實驗';
        $('stop').disabled = !running;
      }
      box.querySelectorAll('#labE-enz button').forEach((b) => b.addEventListener('click', () => { st.enz = b.dataset.v; sync(); }));
      box.querySelectorAll('#labE-ph button').forEach((b) => b.addEventListener('click', () => { st.ph = b.dataset.v; sync(); }));
      $('T').addEventListener('input', () => { st.T = +$('T').value; sync(); });
      box.querySelectorAll('.quick button').forEach((b) => b.addEventListener('click', () => { st.T = +b.dataset.t; sync(); }));
      $('go').addEventListener('click', start);
      $('stop').addEventListener('click', () => { if (run && !run.done) finish(true); });

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, done = false, picked = -1, pred = -1;
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? 'ok' : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      const running = () => run && !run.done;
      const actsHtml = (m) => {
        let h = `<div class="acts">${m.acts.map(([label, enz, ph, T], i) => {
          const did = !m.then && runs.some((r) => r.enz === enz && r.ph === ph && r.segs[0] && r.segs[0].T === T);
          return `<button class="ctl ${did ? '' : 'primary'}" type="button" data-a="${i}" aria-pressed="${did}" ${running() ? 'disabled' : ''}>${label}${did ? ' ✓' : ''}</button>`;
        }).join('')}</div>`;
        if (m.then && running()) {
          const ok = run.t >= m.then.after && st.T !== m.then.T;
          h += `<div class="acts"><button class="ctl primary" type="button" id="labE-then" ${ok ? '' : 'disabled'}>${st.T === m.then.T ? '已調整 ✓' : m.then.label}${ok || st.T === m.then.T ? '' : `（第 ${m.then.after} 分鐘後）`}</button></div>`;
        }
        return h;
      };
      function drawMission() {
        if (mi >= MISSIONS.length) {
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <div class="fb ok"><strong>酵素的特性</strong>能加快分解的速度；人體的酵素在約 37 °C 作用最快。<br>低溫：作用變慢，回溫後可以恢復。高溫：酵素被破壞，不能恢復。<br>每種酵素需要合適的酸鹼環境。</div>
            <button class="ctl primary" type="button" id="labE-again">再練習一次</button>`;
          mbox.querySelector('#labE-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div>`;
        if (m.predict) {
          html += `<p class="m-text">${m.predict.q}</p><div class="opts">${m.predict.opts.map((o, k) => `<button class="opt" type="button" data-p="${k}" aria-pressed="${pred === k}" ${pred >= 0 ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (pred >= 0 && !done) html += `<p class="m-text">${m.text}</p>${actsHtml(m)}`;
          if (done) html += `<div class="fb ${pred === m.predict.ans ? 'ok' : 'bad'}"><strong>${pred === m.predict.ans ? '預測正確' : '和預測不一樣'}</strong>${m.why}</div>`;
        } else if (m.quiz) {
          const ready = !m.need || m.need(runs);
          if (!ready) html += `<p class="m-text">${m.needText}</p>${m.acts ? actsHtml(m) : ''}`;
          html += `<p class="m-text">${m.quiz.q}</p><div class="opts">${m.quiz.opts.map((o, k) => `<button class="opt ${done && k === m.quiz.ans ? 'right' : !done && k === picked ? 'wrong' : ''}" type="button" data-k="${k}" ${done || !ready ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
          if (!done && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.quiz.hint}</div>`;
          if (done) html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div>`;
        } else {
          html += `<p class="m-text">${m.text}</p>`;
          if (done) html += `<div class="fb ok"><strong>完成</strong>${m.why}</div>`;
          else html += actsHtml(m);
        }
        if (done) html += `<button class="ctl primary" type="button" id="labE-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { const k = +b.dataset.k; if (k === m.quiz.ans) done = true; else picked = k; drawMission(); }));
        mbox.querySelectorAll('.opt[data-p]').forEach((b) => b.addEventListener('click', () => { pred = +b.dataset.p; drawMission(); checkMission(); }));
        mbox.querySelectorAll('.acts [data-a]').forEach((b) => b.addEventListener('click', () => {
          const [, enz, ph, T] = m.acts[+b.dataset.a];
          Object.assign(st, { enz, ph, T }); start();
        }));
        const th = mbox.querySelector('#labE-then');
        if (th) th.addEventListener('click', () => { st.T = m.then.T; sync(); drawMission(); });
        const nx = mbox.querySelector('#labE-next');
        if (nx) nx.addEventListener('click', () => { mi++; done = false; picked = -1; pred = -1; drawMission(); checkMission(); });
      }
      function checkMission() {
        const m = MISSIONS[mi];
        if (!m || done) return;
        if (m.quiz) { drawMission(); return; }
        if (m.predict && pred < 0) return;
        if (m.done(runs)) { done = true; drawMission(); }
      }
      function reset() {
        if (run && !run.done) run.done = true;
        run = null; runs.length = 0;
        Object.assign(st, { enz: 'saliva', ph: 'neutral', T: 37 });
        mi = 0; done = false; picked = -1; pred = -1;
        wells.forEach((w) => gsap.set(w, { attr: { r: 0 } }));
        addLbl.textContent = '';
        status('按任務卡上的按鈕開始實驗。實驗中每 1 分鐘會自動取一滴，滴到點滴板上加碘液。');
        $('free').open = false;
        sync(); log(); drawMission();
      }

      reset();
      raf = requestAnimationFrame(loop);
      S._labE = { st, runs, get run() { return run; }, start, advance(min) { for (let i = 0; i < min * 20 && run && !run.done; i++) step(0.05); render(0.05); } }; // 測試用
      return { unmount() { cancelAnimationFrame(raf); delete S._labE; } };
    },
  });
})();
