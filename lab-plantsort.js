/* 互動：植物分類 — 一次看一株植物，沿著檢索表一次回答一個問題（有維管束嗎？→ 有種子嗎？→ 有花和果實嗎？），
   答對後植物落到所屬的類別；被子植物再判斷單子葉或雙子葉。 */
(() => {
  const { el, g, text, C } = S;
  const D = S.B4;
  const COL = { moss: '#9be58c', fern: '#6fd0a0', gym: '#7fc8e0', ang: '#ffb3d0' };
  const GNAME = { moss: '蘚苔植物', fern: '蕨類植物', gym: '裸子植物', ang: '被子植物' };
  const QS = {
    vasc: { q: '它有<b>維管束</b>嗎？', opts: [['yes', '有'], ['no', '沒有']] },
    seed: { q: '它會產生<b>種子</b>嗎？', opts: [['yes', '會'], ['no', '不會']] },
    flower: { q: '它有<b>花</b>嗎？種子包在<b>果實</b>裡嗎？', opts: [['yes', '有花，有果實'], ['no', '沒有花和果實']] },
    mono: { q: '它是<b>單子葉</b>還是<b>雙子葉</b>植物？', opts: [['mono', '單子葉植物'], ['di', '雙子葉植物']] },
  };
  // 植物：ans 是每個問題的正確答案；hint 是答錯時的提示（不直接說出答案）
  const PX = 210, PY = 520; // 植物的地面中央
  const PLANTS = [
    { k: 'moss', name: '土馬騣', obs: '長在潮溼的地上，只有幾公分高＊', ans: { vasc: 'no' },
      draw: (p) => D.moss(p, PX + 20, PY - 20, 1.38), mini: (p, x, y) => D.moss(p, x, y, 0.24, { spores: false }),
      hint: { vasc: '維管束可以把水分送到高處。土馬騣長得高嗎？它是用什麼固著在土裡的？' },
      why: '土馬騣<b>沒有維管束</b>，所以長得很矮，用假根固著，靠孢子繁殖 → <b>蘚苔植物</b>。' },
    { k: 'fern', name: '腎蕨', obs: '葉子很長，嫩葉捲曲；葉背有褐色的小點', ans: { vasc: 'yes', seed: 'no' },
      draw: (p) => D.fern(p, PX + 15, PY - 60, 0.8), mini: (p, x, y) => D.fern(p, x, y, 0.13, { under: false, fiddle: false }),
      clue: { seed: (p) => { D.pinnaSori(p, 0, 0, 0.36); text(p, 0, 52, '葉背（放大）', { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' }); } },
      hint: { vasc: '腎蕨有根、莖、葉，葉子可以長得很長。水分要怎麼送到長長的葉子？', seed: '翻到葉背看看：那些褐色的小點裡面裝的是種子嗎？' },
      why: '腎蕨<b>有維管束</b>，但<b>不產生種子</b>；葉背的孢子囊堆裡是孢子 → <b>蕨類植物</b>。' },
    { k: 'pine', name: '松', obs: '高大的樹，葉子像針，枝上掛著毬果', ans: { vasc: 'yes', seed: 'yes', flower: 'no' },
      draw: (p) => D.pine(p, PX + 10, PY + 20, 1.0), mini: (p, x, y) => D.pine(p, x, y, 0.16, { ground: false, cones: false }),
      clue: { seed: (p) => { D.coneScale(p, 0, -10, 0.5); text(p, 0, 66, '毬果的一片鱗片', { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' }); }, flower: (p) => { D.coneScale(p, 0, -10, 0.5); text(p, 0, 66, '毬果的一片鱗片', { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' }); } },
      hint: { vasc: '松可以長成很高的樹。沒有運輸的管道，水分能送到樹頂嗎？', seed: '看看毬果鱗片上長著什麼？', flower: '毬果是花嗎？鱗片上的種子，外面有沒有果實包著？' },
      why: '松有維管束、有種子，但<b>沒有花和果實</b>，種子裸露在毬果的鱗片上 → <b>裸子植物</b>。' },
    { k: 'ginkgo', name: '銀杏', obs: '高大的樹（圖是一段枝條）：葉子像扇子，結出「白果」', ans: { vasc: 'yes', seed: 'yes', flower: 'no' },
      draw: (p) => D.ginkgo(p, PX + 25, PY - 250, 0.92), mini: (p, x, y) => D.ginkgo(p, x, y - 40, 0.19),
      hint: { vasc: '銀杏能長成十幾公尺高的大樹。水分要怎麼送到樹頂的葉子？', seed: '那些黃色、圓圓的「白果」是銀杏的什麼構造？', flower: '果實是由花的子房發育成的。銀杏會開花嗎？' },
      why: '銀杏的葉子雖然是扇形，但它和松一樣<b>沒有花和果實</b>；「白果」是它的<b>種子</b> → <b>裸子植物</b>。' },
    { k: 'lily', name: '百合', obs: '開白色喇叭形的花，葉子細長', ans: { vasc: 'yes', seed: 'yes', flower: 'yes', mono: 'mono' },
      draw: (p) => D.lily(p, PX, PY + 20, 1.04), mini: (p, x, y) => D.lily(p, x, y, 0.2, { ground: false }),
      clue: { mono: (p) => { D.flowerTop(p, -40, -40, 0.55, 6, { fill: '#fbfbf4', edge: '#c8c8b8', center: '#c8782a' }); D.leafPar(p, -60, 50, 0.5, -10); text(p, 0, 100, '花（正面）和葉', { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' }); } },
      hint: { vasc: '看看細長的葉子上一條條的葉脈——葉脈裡是什麼構造？', seed: '百合開花以後，會結出什麼？', flower: '頂端那朵白色喇叭形的是什麼構造？', mono: '數一數花被片有幾片，是幾的倍數？葉脈是網狀還是平行的？' },
      why: '百合<b>有花</b>，種子包在果實裡 → <b>被子植物</b>。', why2: '百合的葉是<b>平行脈</b>，花被片 6 片（3 片花瓣和 3 片花萼長得很像）是 <b>3 的倍數</b> → <b>單子葉植物</b>。' },
  ];
  const EXTRA = [
    { k: 'liver', name: '地錢', obs: '扁平地貼在潮溼的地面上', ans: { vasc: 'no' },
      draw: (p) => { D.liverwort(p, PX, PY - 140, 1.5); }, mini: (p, x, y) => D.liverwort(p, x, y - 20, 0.24),
      hint: { vasc: '地錢長得高嗎？它有沒有真正的根、莖、葉？' }, why: '地錢<b>沒有維管束</b>，扁平地貼著地面生長 → <b>蘚苔植物</b>。' },
    { k: 'rape', name: '油菜', obs: '開黃色的花，葉子寬大', ans: { vasc: 'yes', seed: 'yes', flower: 'yes', mono: 'di' },
      draw: (p) => D.flowerPlant(p, PX, PY + 10, 1.35, { petals: 4 }), mini: (p, x, y) => D.flowerPlant(p, x, y, 0.22, { ground: false, petals: 4 }),
      clue: { mono: (p) => { D.leafNet(p, -70, 40, 0.6, -15); text(p, 0, 100, '葉（放大）', { 'font-size': 20, fill: C.mute, 'text-anchor': 'middle' }); } },
      hint: { vasc: '油菜有根、莖、葉，葉上有葉脈。葉脈裡是什麼構造？', seed: '油菜開花以後會結出什麼？', flower: '頂端黃色的是什麼構造？', mono: '數一數花瓣有幾片？葉脈是網狀還是平行的？' },
      why: '油菜<b>有花</b>，種子包在果實裡 → <b>被子植物</b>。', why2: '油菜的花瓣 <b>4 片</b>，葉是<b>網狀脈</b> → <b>雙子葉植物</b>。' },
  ];
  const ORDER = ['vasc', 'seed', 'flower'];
  const groupOf = (a) => (a.vasc === 'no' ? 'moss' : a.seed === 'no' ? 'fern' : a.flower === 'no' ? 'gym' : 'ang');

  S.registerLab({
    id: 'lab-plantsort', section: '下4-2', title: '植物分類',
    mount(box) {
      box.innerHTML = `
<style>
  .labZ1 { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labZ1 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labZ1 .pad { padding: 1rem 1.25rem; }
  .labZ1 .crumbs { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0 0 0.6rem; }
  .labZ1 .crumbs span { font-size: 0.92rem; padding: 0.15em 0.6em; border-radius: 999px; border: 1px solid var(--good); color: var(--good); }
  .labZ1 .table-wrap { overflow-x: auto; }
  .labZ1 .free-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  @media (max-width: 900px) {
    .labZ1 { display: flex; flex-direction: column; align-items: stretch; }
    .labZ1 .col { display: contents; }
    .labZ1 .c-stage { order: 1; } .labZ1 .c-mis { order: 2; } .labZ1 .c-table { order: 3; } .labZ1 .c-free { order: 4; }
  }
</style>
<div class="labZ1">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 600" role="img" aria-label="植物分類：左邊是要分類的植物，右邊是檢索表和四大類植物"></svg></div>
      <div class="pad">
        <p class="status-line" id="labZ1-status" aria-live="polite"></p>
        <p class="footnote">＊示意：植物沒有依照真實比例畫。植物都是多細胞、有細胞壁和葉綠體的生物；檢索表一次只看一個特徵。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>分類紀錄</h3><div class="table-wrap" id="labZ1-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labZ1-mission"></div>
    <details class="card pad free c-free" id="labZ1-free"><summary>自由探索：再選一種植物分類看看</summary>
      <div class="free-list" id="labZ1-freelist"></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labZ1-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: C.bg }, svg);
      const root = g(svg);
      const tweens = [];
      const tw = (o, v) => { const t = gsap.to(o, v); tweens.push(t); return t; };

      // ---------- 左：植物 ----------
      el('rect', { x: 20, y: 20, width: 590, height: 560, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, root);
      const nameT = text(root, 40, 64, '', { 'font-size': 30, 'font-weight': 700, fill: C.ink });
      const obsT = text(root, 40, 100, '', { 'font-size': 20, fill: C.mute });
      // 觀察說明太長（字放大後會超出左邊的框）就在標點後面分成兩行
      const setObs = (s) => {
        obsT.textContent = '';
        const sz = S.effSize(obsT, 20), max = 550;
        let lines = [s];
        if (S.textWidth(s, sz) > max) {
          let cut = -1;
          for (let i = 0; i < s.length; i++) if ('，：、'.includes(s[i]) && S.textWidth(s.slice(0, i + 1), sz) <= max) cut = i + 1;
          if (cut > 0) lines = [s.slice(0, cut), s.slice(cut)];
        }
        lines.forEach((ln, i) => { const t = el('tspan', { x: 40, dy: i ? sz * 1.3 : null }, obsT); t.textContent = ln; });
      };
      const plantW = g(root);
      const clueG = g(root);

      // ---------- 右：檢索表 ----------
      const BX = { moss: 694, fern: 816, gym: 938, ang: 1102 }, BW = 116, BY = 420, BH = 160; // 框寬 116：類別名稱放大到 24 後，左右留一點空
      const key = g(root);
      const edgeEls = {};
      const edge = (id, d, lbl, lx, ly, yes) => {
        const e = el('path', { d, fill: 'none', stroke: '#4a6272', 'stroke-width': 3.5 }, key);
        text(key, lx, ly, lbl, { 'font-size': 20, 'text-anchor': 'middle', fill: yes ? '#8be07a' : '#ff9a8a', 'font-weight': 700 });
        edgeEls[id] = e;
      };
      edge('vasc-no', `M ${BX.moss},98 L ${BX.moss},${BY}`, '沒有', BX.moss - 30, 150, false); // 字放大後離線遠一點
      edge('vasc-yes', 'M 850,80 L 900,80 L 900,152', '有', 875, 68, true);
      edge('seed-no', `M ${BX.fern},188 L ${BX.fern},${BY}`, '不會', BX.fern - 30, 240, false);
      edge('seed-yes', 'M 980,170 L 1030,170 L 1030,246', '會', 1005, 158, true);
      edge('flower-no', `M ${BX.gym},282 L ${BX.gym},${BY}`, '沒有', BX.gym - 30, 330, false);
      edge('flower-yes', `M ${BX.ang},282 L ${BX.ang},${BY}`, '有', BX.ang + 20, 330, true);
      const qNode = {};
      [['vasc', '有維管束嗎？', 770, 80], ['seed', '有種子嗎？', 900, 170], ['flower', '有花和果實嗎？', 1030, 264]].forEach(([k, s, x, y]) => {
        const w = s.length * 24 + 30, n = g(key);
        const r = el('rect', { x: x - w / 2, y: y - 20, width: w, height: 40, rx: 20, fill: '#0d1822', stroke: '#4a6272', 'stroke-width': 2.5 }, n);
        text(n, x, y + 8, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
        qNode[k] = r;
      });
      const boxG = {};
      Object.keys(BX).forEach((k) => {
        const b = g(key);
        el('rect', { x: BX[k] - BW / 2, y: BY, width: BW, height: BH, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: COL[k], 'stroke-width': 2.5 }, b);
        text(b, BX[k], BY + 30, GNAME[k], { 'font-size': 21, 'text-anchor': 'middle', fill: COL[k], 'font-weight': 700 });
        boxG[k] = { g: b, icons: g(b), n: 0, frame: b.firstChild };
      });

      // ---------- 狀態 ----------
      let list = PLANTS, pi = 0, qk = 'vasc', ans = {}, wrong = null, done = false, stage2 = false, free = false;
      const first = [], recs = [];
      const doneK = new Set(); // 分好過的植物（點圓點可以回去再做）
      const sv = S.progress.lab('lab-plantsort'); // 上次存下的進度（要在第一次畫圓點之前讀）
      let firstNow = true;

      function paintKey() {
        Object.entries(edgeEls).forEach(([id, e]) => {
          const [q, a] = id.split('-');
          const on = ans[q] === a;
          e.setAttribute('stroke', on ? C.hi : '#4a6272');
          e.setAttribute('stroke-width', on ? 5 : 3.5);
        });
        Object.entries(qNode).forEach(([k, r]) => r.setAttribute('stroke', !done && qk === k ? C.hi : ans[k] ? '#8be07a' : '#4a6272'));
        Object.entries(boxG).forEach(([k, b]) => b.frame.setAttribute('stroke-width', done && groupOf(ans) === k ? 5 : 2.5));
      }
      function showPlant() {
        const pl = list[pi];
        plantW.innerHTML = ''; plantW.removeAttribute('transform'); plantW.style.opacity = 1;
        const inner = g(plantW);
        pl.draw(inner);
        nameT.textContent = pl.name;
        setObs('觀察：' + pl.obs);
        showClue();
      }
      function showClue() {
        clueG.innerHTML = '';
        const pl = list[pi], fn = pl.clue && pl.clue[qk];
        if (!fn || done) return;
        const cg = S.place(g(clueG), { x: 492, y: 450 });
        el('rect', { x: -102, y: -110, width: 204, height: 230, rx: 12, fill: '#0d1822', stroke: C.hi, 'stroke-width': 2 }, cg);
        text(cg, 0, -84, '線索', { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        fn(cg);
      }
      function flyToBox(k) {
        const pl = list[pi], b = boxG[k], add = b.n < 2 && ![...b.icons.children].some((c) => c.getAttribute('data-name') === pl.name);
        if (add) b.n++;
        const tx = BX[k] + (b.n === 2 && add ? 26 : 0), ty = BY + BH - 12;
        const kk = 0.2, from = { x: 0, y: 0, s: 1 }, to = { x: tx - kk * PX, y: ty - kk * PY, s: kk };
        const o = { u: 0 };
        tw(o, { u: 1, duration: 0.9, ease: 'power2.inOut', onUpdate: () => S.place(plantW, S.lerpXf(from, to, o.u)), onComplete: () => { plantW.style.opacity = 0; } });
        if (!add) return; // 自由探索時，每一類最多放兩個小圖示
        // 類別裡的小圖示（第二株放在右邊，第一株往左移）
        const ic = g(b.icons, { opacity: 0, 'data-name': pl.name });
        pl.mini(ic, tx, ty);
        if (b.n === 2) S.place(b.icons.firstChild, { x: -26, y: 0 });
        tw(ic, { opacity: 1, duration: 0.4, delay: 0.85 });
      }

      function answer(v) {
        if (done) return;
        const pl = list[pi], right = pl.ans[qk];
        if (v !== right) { wrong = v; firstNow = false; if (!free && first[pi] === undefined) first[pi] = false; drawMission(); return; }
        wrong = null; ans[qk] = v;
        if (qk === 'mono') { stage2 = false; done = true; flyToBox('ang'); finishPlant(); return; }
        const nextQ = ORDER[ORDER.indexOf(qk) + 1];
        const leaf = v === 'no' || !nextQ;
        if (leaf) {
          if (pl.ans.mono) { stage2 = true; qk = 'mono'; } // 被子植物：先判斷單子葉或雙子葉，再放進類別
          else { done = true; flyToBox(groupOf(ans)); finishPlant(); }
        } else qk = nextQ;
        showClue(); paintKey(); drawMission();
      }
      function finishPlant() {
        const pl = list[pi];
        if (!free) { if (first[pi] === undefined) first[pi] = firstNow; doneK.add(pi); }
        recs.push([pl.name, GNAME[groupOf(ans)] + (ans.mono ? `（${ans.mono === 'mono' ? '單子葉' : '雙子葉'}）` : ''), free ? '自由探索' : first[pi] ? '✓' : '再想一次後答對']);
        table();
        $('status').innerHTML = `${pl.name} → <b>${GNAME[groupOf(ans)]}</b>${ans.mono ? `（${ans.mono === 'mono' ? '單子葉植物' : '雙子葉植物'}）` : ''}`;
        showClue(); paintKey(); drawMission();
      }

      // 還沒答完時，舞台上的小圖示和紀錄表都不顯示「同一株植物」先前的分類（避免洩漏答案）
      const curName = () => (!done && pi < list.length ? list[pi].name : null);
      function mask() { const n = curName(); Object.values(boxG).forEach((b) => [...b.icons.children].forEach((c) => { c.style.display = n && c.getAttribute('data-name') === n ? 'none' : ''; })); }
      function table() {
        const n = curName(), rows = recs.filter((r) => r[0] !== n);
        mask();
        if (!rows.length) { $('table').innerHTML = '<p class="m-hint">分好的植物會列在這裡。</p>'; return; }
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>植物</th><th>類別</th><th>第一次就答對</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
      }

      const mbox = $('mission');
      function drawMission() {
        // 這一株分好以後，圓點就顯示結果的顏色
        const dots = free ? '' : S.dots(PLANTS.length, done ? -1 : pi, (k) => (doneK.has(k) ? (first[k] ? 'ok' : 'miss') : ''), '種植物');
        if (!free && pi >= PLANTS.length) {
          const ok = first.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>${doneK.size === PLANTS.length ? '五株植物都分好了' : `分好了 ${doneK.size} / ${PLANTS.length} 株植物`}</h2>${dots}</div>
            <p class="m-text">第一次就答對：<b>${ok} / ${PLANTS.length}</b> 株</p>${doneK.size < PLANTS.length ? '<p class="m-hint">點上面灰色的圓點，可以去分還沒分的植物。</p>' : ''}
            <div class="fb ok"><strong>檢索的順序</strong>有維管束嗎？沒有 → 蘚苔植物。<br>有種子嗎？沒有 → 蕨類植物。<br>有花和果實嗎？沒有 → 裸子植物；有 → 被子植物（再分單子葉、雙子葉）。</div>
            <button class="ctl primary" type="button" id="labZ1-again">再做一次</button>`;
          mbox.querySelector('#labZ1-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const pl = list[pi];
        let html = `<div class="mission-top"><h2>${free ? '自由探索' : `第 ${pi + 1} 株`}：${pl.name}</h2>${dots}</div>`;
        const crumbs = ORDER.filter((k) => ans[k]).map((k) => `<span>${{ vasc: ans.vasc === 'yes' ? '有維管束' : '沒有維管束', seed: ans.seed === 'yes' ? '有種子' : '沒有種子', flower: ans.flower === 'yes' ? '有花和果實' : '沒有花和果實' }[k]}</span>`).join('');
        if (crumbs) html += `<div class="crumbs">${crumbs}</div>`;
        if (!done) {
          const Q = QS[qk];
          if (stage2) html += `<div class="fb ok"><strong>${pl.name}是被子植物</strong>${pl.why}</div>`;
          html += `<p class="m-text">${Q.q}</p><div class="acts">${Q.opts.map(([v, s]) => `<button class="ctl ${wrong === v ? '' : 'primary'}" type="button" data-v="${v}" style="${wrong === v ? 'border-color:var(--bad);color:var(--bad)' : ''}">${s}</button>`).join('')}</div>`;
          if (wrong) html += `<div class="fb bad"><strong>再想想看</strong>${pl.hint[qk]}</div>`;
        } else {
          html += `<div class="fb ok"><strong>${pl.name} → ${GNAME[groupOf(ans)]}</strong>${pl.why2 || pl.why}</div>`;
          html += `<button class="ctl primary" type="button" id="labZ1-next">${free ? '回到任務' : pi === PLANTS.length - 1 ? '看結果' : '下一株'}</button>`;
        }
        mbox.innerHTML = html;
        mbox.querySelectorAll('.acts [data-v]').forEach((b) => b.addEventListener('click', () => answer(b.dataset.v)));
        const nx = mbox.querySelector('#labZ1-next');
        if (nx) nx.addEventListener('click', next);
      }
      function startPlant() {
        tweens.forEach((t) => t.progress(1)); tweens.length = 0; // 上一株的動畫先做完，才不會影響這一株
        ans = {}; qk = 'vasc'; wrong = null; done = false; stage2 = false; firstNow = true;
        if (pi < list.length) { showPlant(); $('status').innerHTML = '沿著右邊的檢索表，一次回答一個問題。'; }
        else { plantW.innerHTML = ''; clueG.innerHTML = ''; nameT.textContent = ''; obsT.textContent = ''; }
        table(); paintKey(); drawMission();
      }
      // 換一株植物（startPlant 會先把上一株的動畫做完）
      function goPlant(k) { pi = k; startPlant(); }
      S.onDots(mbox, goPlant);
      let savedPi = 0;
      function next() {
        if (free) { free = false; list = PLANTS; pi = savedPi; startPlant(); return; }
        goPlant(pi + 1);
      }
      function reset() {
        tweens.forEach((t) => t.kill()); tweens.length = 0;
        Object.values(boxG).forEach((b) => { b.icons.innerHTML = ''; b.n = 0; });
        first.length = 0; doneK.clear(); recs.length = 0; free = false; list = PLANTS; pi = 0;
        $('free').open = false; table(); startPlant();
      }
      $('freelist').innerHTML = [...PLANTS, ...EXTRA].map((p, i) => `<button class="ctl small" type="button" data-i="${i}">${p.name}</button>`).join('');
      $('freelist').querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => {
        if (!free) savedPi = done ? pi + 1 : pi; // 目前這株已經分好，回來時從下一株開始
        free = true; list = [...PLANTS, ...EXTRA]; pi = +b.dataset.i; startPlant();
        window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - 10, behavior: 'smooth' });
      }));
      reset();
      // 接上上次的進度：圓點照舊，從第一株還沒分的植物開始；全部分好就顯示結果
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < PLANTS.length).forEach((k) => { doneK.add(k); first[k] = sv.ok.includes(k); });
        const k0 = PLANTS.findIndex((_, k) => !doneK.has(k));
        goPlant(k0 < 0 ? PLANTS.length : k0);
      }
      S._labZ1 = { answer, next, state: () => ({ pi, qk, done, free, ans: { ...ans }, wrong }), flush: () => tweens.forEach((t) => t.progress(1)) };
      return { unmount() { tweens.forEach((t) => t.kill()); delete S._labZ1; } };
    },
  });
})();
