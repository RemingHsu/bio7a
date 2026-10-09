/* 互動模型 A：尺度 — 自己縮放 + 任務（找到目標 → 回答 → 回饋 → 下一題） */
(() => {
  const TOOL_COLOR = { 肉眼: '#6fce62', 光學顯微鏡: '#62a8ff', 電子顯微鏡: '#a796ff' };
  const MISSIONS = [
    { level: 1, find: '胃', q: '胃屬於哪一個組成層次？', opts: ['細胞', '組織', '器官'], ans: 2,
      hint: '想想看：胃是由好幾種組織組成的。', why: '胃由上皮、肌肉、神經、結締等多種組織組成，能完成消化的功能，所以是器官。' },
    { level: 2, find: '胃壁的切面', q: '胃壁厚約 3 mm，等於多少 μm？', opts: ['3 μm', '300 μm', '3000 μm'], ans: 2,
      hint: '提示：1 mm = 1000 μm。', why: '1 mm = 1000 μm，所以 3 mm = 3 × 1000 = 3000 μm。' },
    { level: 3, find: '一個細胞', q: '細胞高約 25 μm。要看清楚它，至少需要什麼工具？', opts: ['肉眼', '光學顯微鏡', '電子顯微鏡'], ans: 1,
      hint: '看右邊大小尺的色帶：25 μm 落在哪一段？', why: '肉眼大約只能分辨 0.1 mm（100 μm）以上的東西，25 μm 要用光學顯微鏡。看右邊大小尺的色帶也能找到答案。' },
    { level: 4, find: '細胞核', q: '細胞高約 25 μm，細胞核寬約 5 μm。細胞的高度大約是細胞核寬度的幾倍？', opts: ['5 倍', '50 倍', '500 倍'], ans: 0,
      hint: '提示：用 25 除以 5。', why: '25 ÷ 5 = 5，所以細胞的高度大約是細胞核寬度的 5 倍。' },
    { level: 5, find: 'DNA', q: 'DNA 寬約 2 nm，等於多少 μm？', opts: ['0.002 μm', '0.2 μm', '2000 μm'], ans: 0,
      hint: '提示：1 μm = 1000 nm，nm 換成 μm 要除以 1000。', why: '1 μm = 1000 nm，所以 2 nm = 2 ÷ 1000 = 0.002 μm。' },
    { level: 0, find: '人（縮小回去）', q: '人高約 1.6 m，DNA 寬約 2 nm。人的身高大約是 DNA 寬度的幾倍？', opts: ['8000 倍', '800 萬倍', '8 億倍'], ans: 2,
      hint: '提示：1 m = 1,000,000,000 nm（10 億 nm）。', why: '1.6 m = 1,600,000,000 nm，再除以 2 等於 800,000,000，也就是 8 億倍。' },
  ];

  const times = (r) => {
    if (r < 1.5) return '就是人本身';
    if (r < 1e4) return `人約是它的 ${Math.round(r).toLocaleString()} 倍`;
    if (r < 1e8) return `人約是它的 ${(r / 1e4).toFixed(r < 1e5 ? 1 : 0)} 萬倍`;
    return `人約是它的 ${(r / 1e8).toFixed(r < 1e9 ? 1 : 0)} 億倍`;
  };

  S.registerLab({
    id: 'lab-scale', section: '1-4', title: '尺度縮放',
    mount(box) {
      box.innerHTML = `
<div class="card">
  <div class="lab-stage"><svg viewBox="0 0 1200 720" tabindex="0" role="img" aria-label="尺度縮放畫面，可用滑鼠滾輪、雙指或方向鍵上下縮放"></svg></div>
  <div class="lab-row">
    <div>
      <h2>自己放大縮小</h2>
      <div class="field">
        <div class="field-head"><label for="labA-zoom">放大程度</label><output id="labA-out" for="labA-zoom"></output></div>
        <div class="btn-row" style="flex-wrap:nowrap;align-items:center">
          <button class="ctl small" type="button" id="labA-minus" aria-label="縮小">－</button>
          <input type="range" id="labA-zoom" min="0" max="500" step="1" value="0">
          <button class="ctl small" type="button" id="labA-plus" aria-label="放大">＋</button>
        </div>
        <div class="ticks" aria-hidden="true"><span>人</span><span>胃</span><span>胃壁</span><span>細胞</span><span>細胞核</span><span>DNA</span></div>
      </div>
      <div class="btn-row" id="labA-jumps" aria-label="直接跳到"></div>
      <dl class="readout" style="margin-top:1rem">
        <dt>現在看到</dt><dd id="labA-what"></dd>
        <dt>大小約</dt><dd class="big" id="labA-size"></dd>
        <dt>需要的工具</dt><dd id="labA-tool"></dd>
        <dt>和人比</dt><dd id="labA-ratio"></dd>
      </dl>
      <p class="m-hint" style="margin-top:0.75rem">在畫面上滾動滑鼠滾輪、用兩指縮放，或點畫面後按 ↑ ↓，也能放大縮小。</p>
    </div>
    <div id="labA-mission"></div>
  </div>
</div>`;
      const svg = box.querySelector('svg');
      S.el('rect', { x: 0, y: 0, width: 1200, height: 720, fill: S.C.bg }, svg);
      const W = S.scaleWorld(S.g(svg), 'labA');
      const LV = W.LV;
      const $ = (id) => box.querySelector('#labA-' + id);
      const slider = $('zoom');

      const st = { P: 0 };
      let tw = null, snapT = null, last = { level: 0, settled: true };
      function update() {
        const r = W.render(st.P);
        last = r;
        slider.value = Math.round(st.P * 100);
        const i = Math.min(4, Math.floor(st.P));
        $('out').textContent = r.settled ? LV[r.level].short : `${LV[i].short} → ${LV[i + 1].short}`;
        $('what').textContent = r.settled ? `${LV[r.level].short}（${LV[r.level].tag.split('｜')[0]}）` : '縮放中…';
        $('size').textContent = '≈ ' + S.fmtLen(r.size);
        const tool = W.toolFor(r.size), note = r.settled ? LV[r.level].toolNote : '';
        $('tool').innerHTML = `<span class="tool-chip"><i style="display:inline-block;width:0.6em;height:0.6em;border-radius:50%;margin-right:0.4em;background:${TOOL_COLOR[tool]}"></i>${tool}</span>${note ? `<span class="m-hint" style="display:block;margin:0.2rem 0 0">${note}</span>` : ''}`;
        $('ratio').textContent = times(1.6 / r.size);
        checkFind();
      }
      const goTo = (target) => {
        if (tw) tw.kill();
        clearTimeout(snapT);
        const d = Math.abs(target - st.P);
        tw = gsap.to(st, { P: target, duration: Math.min(2.6, 0.4 + d * 0.55), ease: 'power2.inOut', onUpdate: update });
      };
      const nudge = (dP) => { if (tw) tw.kill(); st.P = S.clamp(st.P + dP, 0, 5); update(); snapLater(); };
      const snapLater = () => {
        clearTimeout(snapT);
        snapT = setTimeout(() => { const n = Math.round(st.P); if (Math.abs(st.P - n) < 0.15 && Math.abs(st.P - n) > 1e-3) goTo(n); }, 260);
      };

      slider.addEventListener('input', () => { if (tw) tw.kill(); st.P = slider.value / 100; update(); });
      slider.addEventListener('change', snapLater);
      $('minus').addEventListener('click', () => goTo(Math.max(0, Math.ceil(st.P - 0.01) - 1)));
      $('plus').addEventListener('click', () => goTo(Math.min(5, Math.floor(st.P + 0.01) + 1)));
      LV.forEach((lv, k) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ctl small'; b.textContent = lv.short;
        b.addEventListener('click', () => goTo(k));
        $('jumps').appendChild(b);
      });
      svg.addEventListener('wheel', (e) => { e.preventDefault(); nudge(-e.deltaY * 0.0022); }, { passive: false });
      svg.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === '+' || e.key === '=') { nudge(0.08); e.preventDefault(); }
        else if (e.key === 'ArrowDown' || e.key === '-') { nudge(-0.08); e.preventDefault(); }
      });
      // 兩指縮放
      const pts = new Map(); let pinch0 = null;
      svg.addEventListener('pointerdown', (e) => { pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), P: st.P }; } });
      svg.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2 && pinch0) { const [a, b] = [...pts.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (tw) tw.kill(); st.P = S.clamp(pinch0.P + Math.log(d / pinch0.d) * 1.2, 0, 5); update(); }
      });
      const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2 && pinch0) { pinch0 = null; snapLater(); } };
      svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);

      // ---------- 任務 ----------
      const mbox = $('mission');
      let mi = 0, phase = 'find', picked = -1;
      const result = []; // 'ok' 一次答對、'miss' 曾答錯
      function checkFind() {
        if (phase !== 'find' || mi >= MISSIONS.length) return;
        if (last.settled && last.level === MISSIONS[mi].level) { phase = 'ask'; picked = -1; drawMission(); }
      }
      function dots() {
        return `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${result[k] || (k === mi ? 'on' : '')}"></i>`).join('')}</div>`;
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          const ok = result.filter((r) => r === 'ok').length;
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <p class="m-text">一次就答對 <b>${ok} / ${MISSIONS.length}</b> 題。</p>
            <div class="fb ok"><strong>重點整理</strong>1 m = 1000 mm，1 mm = 1000 μm，1 μm = 1000 nm。<br>器官用肉眼；組織、細胞用光學顯微鏡；DNA 用電子顯微鏡。</div>
            <button class="ctl primary" type="button" id="labA-again">再挑戰一次</button>`;
          mbox.querySelector('#labA-again').addEventListener('click', () => { mi = 0; phase = 'find'; result.length = 0; drawMission(); goTo(0); });
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1} / ${MISSIONS.length}</h2>${dots()}</div>`;
        if (phase === 'find') {
          html += `<p class="m-text">用縮放找到：<b>${m.find}</b></p><p class="m-hint">找到後，畫面停在那一層，題目就會出現。</p>`;
        } else {
          html += `<p class="m-text">找到了！${m.q}</p><div class="opts">${m.opts.map((o, k) => {
            const cls = phase === 'done' && k === m.ans ? 'right' : k === picked && phase !== 'done' && picked !== m.ans ? 'wrong' : '';
            return `<button class="opt ${cls}" type="button" data-k="${k}" ${phase === 'done' ? 'disabled' : ''}>${o}</button>`;
          }).join('')}</div>`;
          if (phase === 'ask' && picked >= 0) html += `<div class="fb bad"><strong>再想想看</strong>${m.hint}</div>`;
          if (phase === 'done') html += `<div class="fb ok"><strong>答對了</strong>${m.why}</div><button class="ctl primary" type="button" id="labA-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`;
        }
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k;
          if (k === m.ans) { if (!result[mi]) result[mi] = 'ok'; phase = 'done'; }
          else { result[mi] = 'miss'; picked = k; }
          drawMission();
        }));
        const nx = mbox.querySelector('#labA-next');
        if (nx) nx.addEventListener('click', () => { mi++; phase = 'find'; picked = -1; drawMission(); checkFind(); });
      }

      drawMission();
      update();
      return { unmount() { if (tw) tw.kill(); clearTimeout(snapT); } };
    },
  });
})();
