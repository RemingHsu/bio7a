/* 互動模型：消化之旅 — 每一站先判斷「哪些養分在這裡被分解」，回饋後才往下走；再把產物分到微血管或乳糜管；最後到大腸 */
(() => {
  const { el, g, text, C } = S;
  const STA = C.sugar, PRO = '#ff8f8f', FAT = '#ffb35c', CAP = '#ff5f74', LAC = '#f3e6b0';
  const NUT = [['s', '澱粉', STA], ['p', '蛋白質', PRO], ['f', '脂質', FAT]];
  const STATIONS = ['口腔', '胃', '小腸', '吸收', '大腸'];
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };

  const STAGES = [
    { st: 0, kind: 'pick', juice: '唾液', ans: ['s'], q: '漢堡（含澱粉、蛋白質、脂質）進入<b>口腔</b>。這裡有哪些養分開始被分解？（可複選）',
      hint: '口腔的消化液是唾液。唾液裡的酵素能分解哪一種養分？', why: '唾液含有<b>澱粉酶</b>，把部分澱粉分解成麥芽糖。牙齒咀嚼、舌頭攪拌則是物理性消化。' },
    { st: 1, kind: 'pick', juice: '胃液（酸性）', ans: ['p'], q: '食物到了<b>胃</b>。這裡主要分解哪一種養分？（可複選）',
      hint: '胃液是酸性的，裡面的酵素主要分解哪一種？唾液的澱粉酶在強酸中還能作用嗎？', why: '胃液含有蛋白酶，把<b>蛋白質</b>初步分解；胃液裡的鹽酸能殺死部分細菌，也讓酵素在酸性中作用。胃的蠕動讓食物和胃液充分混合。' },
    { st: 2, kind: 'pick', juice: '胰液、腸液、膽汁', ans: ['s', 'p', 'f'], q: '食物到了<b>小腸</b>。這裡有哪些養分被分解？（可複選）',
      hint: '小腸是消化的主要場所。想一想：食物到這裡時，還有哪些養分沒有分解完？', why: '胰液能分解澱粉、蛋白質和脂質；腸液能把麥芽糖等醣類分解成葡萄糖，也能分解蛋白質；膽汁把脂質乳化成小油滴。三大類養分都在小腸<b>分解完成</b>。' },
    { st: 2, kind: 'quiz', q: '小腸的三種消化液中，哪一種<b>不含消化酵素</b>？', opts: ['胰液', '膽汁', '腸液'], ans: 1,
      hint: '哪一種消化液是由肝臟製造的？它含有酵素嗎？', why: '<b>膽汁</b>不含酵素，它把大油滴乳化成小油滴，讓酵素更容易分解脂質。' },
    { st: 3, kind: 'sort', q: '分解後的小分子在小腸被吸收。把每種產物送到正確的管道：',
      items: [['glu', '葡萄糖', STA, 'cap'], ['ami', '胺基酸', PRO, 'cap'], ['fat', '脂肪酸和甘油', FAT, 'lac']],
      hint: '先想想每種產物是從哪一類養分分解來的。脂質分解後的產物，會進入哪一種管道？', why: '葡萄糖、胺基酸進入<b>微血管</b>；脂肪酸和甘油進入<b>乳糜管</b>。' },
    { st: 4, kind: 'quiz', q: '到了<b>大腸</b>，剩下的主要是水分和不能消化的殘渣（例如膳食纖維）。大腸主要吸收什麼？', opts: ['葡萄糖', '水分', '胺基酸'], ans: 1,
      hint: '再讀一次題目：到了大腸，剩下的主要是哪些東西？其中哪一種身體還能吸收？', why: '大腸吸收剩下的<b>水分</b>；殘渣形成糞便，由肛門排出（排遺）。' },
  ];

  S.registerLab({
    id: 'lab-digest', section: '3-4', title: '消化之旅',
    mount(box) {
      box.innerHTML = `
<style>
  .labD { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labD .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labD .pad { padding: 1rem 1.25rem; }
  .labD .picks { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0; }
  .labD .picks .opt { flex: 1 1 6em; text-align: center; }
  .labD .sort-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.4rem 0.8rem; padding: 0.4rem 0; border-bottom: 1px solid var(--line); }
  @media (max-width: 900px) { .labD { grid-template-columns: 1fr; } }
</style>
<div class="labD">
  <div class="col"><div class="card">
    <div class="lab-stage"><svg viewBox="0 0 1200 560" role="img" aria-label="消化之旅：食物在各段消化管中的變化"></svg></div>
    <div class="pad"><p class="status-line" id="labD-status" aria-live="polite"></p>
      <p class="footnote">＊示意：分子都畫得很大，數目也是示意；真實的食物含有非常多的分子。</p></div>
  </div></div>
  <div class="col"><div class="card pad" id="labD-panel"></div></div>
</div>`;
      const $ = (id) => box.querySelector('#labD-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 560, fill: C.bg }, svg);
      const root = g(svg);
      let tl = null;

      // ---------- 站名列 ----------
      const SX = (i) => 160 + i * 220;
      el('line', { x1: SX(0), y1: 46, x2: SX(4), y2: 46, stroke: '#2b4252', 'stroke-width': 4 }, root);
      const dotsS = STATIONS.map((s, i) => {
        const d = g(root);
        const c = el('circle', { cx: SX(i), cy: 46, r: 14, fill: '#122230', stroke: '#4a6272', 'stroke-width': 3 }, d);
        const t = text(d, SX(i), 90, s, { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
        return { c, t };
      });

      // ---------- 消化腔 ----------
      const room = el('rect', { x: 40, y: 112, width: 1120, height: 430, rx: 22, fill: '#1c1420', stroke: '#4a3040', 'stroke-width': 3 }, root);
      const roomLbl = text(root, 70, 158, '', { 'font-size': 30, 'font-weight': 700, fill: '#ffc2a8' });
      const juiceLbl = text(root, 70, 192, '', { 'font-size': 22, fill: '#62d0c0' });
      const food = g(root);
      const mkUnit = (kind) => {
        const u = g(food);
        if (kind === 's') el('path', { d: hexD(17), fill: 'rgba(255,207,92,0.25)', stroke: STA, 'stroke-width': 3.5 }, u);
        else el('circle', { cx: 0, cy: 0, r: 14, fill: PRO, stroke: '#fff', 'stroke-width': 1.5 }, u);
        return { e: u, x: 0, y: 0 };
      };
      const put = (o) => o.e.setAttribute('transform', `translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`);
      const sLink = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: STA, 'stroke-width': 3 }, food);
      const pLink = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: PRO, 'stroke-width': 3 }, food);
      const sU = Array.from({ length: 8 }, () => mkUnit('s'));
      const pU = Array.from({ length: 8 }, () => mkUnit('p'));
      const fatBig = el('circle', { cx: 420, cy: 460, r: 48, fill: FAT, opacity: 0.9 }, food);
      const fatSmall = Array.from({ length: 8 }, (_, i) => el('circle', { cx: 0, cy: 0, r: 13, fill: FAT, opacity: 0 }, food));
      const fatProd = Array.from({ length: 5 }, () => { const f = g(food, { opacity: 0 }); el('rect', { x: -5, y: -14, width: 10, height: 28, rx: 5, fill: FAT }, f); el('rect', { x: 8, y: -10, width: 8, height: 20, rx: 4, fill: '#ffe0a8' }, f); return f; });
      const legend = g(root);
      NUT.forEach(([, n, c], i) => text(legend, 1120, 250 + i * 110, n, { 'font-size': 24, 'text-anchor': 'end', fill: c, 'font-weight': 700 }));
      const ROW = { s: 250, p: 360, f: 460 };

      // ---------- 吸收：絨毛 ----------
      const vil = g(root, { opacity: 0 });
      el('path', { d: 'M 520,540 L 520,260 C 520,170 680,170 680,260 L 680,540 Z', fill: '#a84a5c', stroke: '#ffb3c1', 'stroke-width': 3 }, vil);
      el('path', { d: 'M 550,540 L 550,280 C 550,226 650,226 650,280 L 650,540', fill: 'none', stroke: CAP, 'stroke-width': 7 }, vil);
      el('line', { x1: 600, y1: 540, x2: 600, y2: 250, stroke: LAC, 'stroke-width': 16, 'stroke-linecap': 'round' }, vil);
      S.callout(vil, 650, 470, 860, 470, '微血管', CAP, { size: 24 }).style.opacity = 1;
      S.callout(vil, 600, 330, 860, 330, '乳糜管', LAC, { size: 24 }).style.opacity = 1;
      text(vil, 600, 150, '小腸的絨毛（放大）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const chips = {};
      [['glu', STA, '葡萄糖', 230], ['ami', PRO, '胺基酸', 330], ['fat', FAT, '脂肪酸和甘油', 430]].forEach(([k, c, n, y]) => {
        const cg = S.place(g(vil), { x: 250, y });
        S.pill(cg, 0, 0, n, { size: 22, color: c, edge: c });
        chips[k] = { g: cg, x: 250, y, y0: y };
      });

      // ---------- 大腸 ----------
      const col = g(root, { opacity: 0 });
      el('path', { d: 'M 140,300 L 980,300 M 140,440 L 980,440', stroke: '#c88a5a', 'stroke-width': 12, 'stroke-linecap': 'round' }, col);
      text(col, 560, 270, '大腸', { 'font-size': 26, 'text-anchor': 'middle', fill: '#ffb07a', 'font-weight': 700 });
      // 外層 g 定位，GSAP 只動內層，避免改到原本的位移
      const waters = Array.from({ length: 10 }, (_, i) => el('path', { d: 'M 0,-10 C 6,-3 7,1 7,4 C 7,9 4,11 0,11 C -4,11 -7,9 -7,4 C -7,1 -6,-3 0,-10 Z', fill: C.water }, g(col, { transform: `translate(${200 + i * 70},${340 + (i % 3) * 30})` })));
      const resid = el('ellipse', { cx: 300, cy: 400, rx: 60, ry: 22, fill: '#8a5a32' }, col);
      text(col, 1060, 380, '肛門', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });

      // ---------- 版面狀態 ----------
      function layout(state, animate) {
        const d = animate ? 0.9 : 0;
        const mv = (o, x, y) => (d ? gsap.to(o, { x, y, duration: d, ease: 'power2.inOut', onUpdate: () => put(o) }) : (Object.assign(o, { x, y }), put(o)));
        // 澱粉：0 完整、1 部分分解、2 全部變葡萄糖
        sU.forEach((u, i) => {
          if (state.s === 0) mv(u, 300 + i * 46, ROW.s);
          else if (state.s === 1) mv(u, i < 6 ? 300 + i * 46 : 610 + (i - 6) * 36, i < 6 ? ROW.s : ROW.s + 28); // 末端切下一個麥芽糖
          else mv(u, 260 + i * 92, ROW.s + (i % 2 ? -14 : 14));
        });
        sLink.setAttribute('x1', 300); sLink.setAttribute('y1', ROW.s); sLink.setAttribute('y2', ROW.s);
        sLink.setAttribute('x2', state.s === 0 ? 300 + 7 * 46 : 300 + 5 * 46); sLink.style.opacity = state.s === 2 ? 0 : 1;
        // 蛋白質：0 完整、1 切成幾段、2 胺基酸
        pU.forEach((u, i) => {
          if (state.p === 0) mv(u, 300 + i * 40, ROW.p);
          else if (state.p === 1) mv(u, 300 + i * 40 + Math.floor(i / 3) * 60, ROW.p);
          else mv(u, 260 + i * 92, ROW.p + (i % 2 ? 14 : -14));
        });
        pLink.setAttribute('x1', 300); pLink.setAttribute('y1', ROW.p); pLink.setAttribute('x2', 300 + 7 * 40); pLink.setAttribute('y2', ROW.p);
        pLink.style.opacity = state.p === 0 ? 1 : 0;
        // 脂質：0 大油滴、1 乳化（小油滴）、2 脂肪酸和甘油
        gsap.to(fatBig, { opacity: state.f === 0 ? 0.9 : 0, duration: d || 0.001 });
        fatSmall.forEach((f, i) => { f.setAttribute('cx', 330 + i * 40); f.setAttribute('cy', ROW.f + (i % 2 ? 16 : -16)); gsap.to(f, { opacity: state.f === 1 ? 0.9 : 0, duration: d || 0.001 }); });
        fatProd.forEach((f, i) => { f.setAttribute('transform', `translate(${300 + i * 110},${ROW.f})`); gsap.to(f, { opacity: state.f === 2 ? 1 : 0, duration: d || 0.001, delay: d ? 0.4 : 0 }); });
      }

      function showStation(i) {
        dotsS.forEach(({ c, t }, k) => { c.setAttribute('fill', k < i ? '#2f6b4a' : k === i ? C.hi : '#122230'); c.setAttribute('stroke', k <= i ? C.hi : '#4a6272'); t.setAttribute('fill', k === i ? C.hi : C.mute); });
        const inRoom = i <= 2;
        gsap.to([food, legend], { opacity: inRoom ? 1 : 0, duration: 0.4 });
        gsap.to(vil, { opacity: i === 3 ? 1 : 0, duration: 0.4 });
        gsap.to(col, { opacity: i === 4 ? 1 : 0, duration: 0.4 });
        room.setAttribute('fill', ['#24161e', '#261c14', '#1a1c28', '#1a1c28', '#22180f'][i]);
        roomLbl.textContent = inRoom ? STATIONS[i] : '';
        juiceLbl.textContent = inRoom ? `消化液：${['唾液', '胃液（酸性）', '胰液、腸液、膽汁'][i]}` : '';
      }

      // ---------- 流程 ----------
      const panel = $('panel');
      let si = 0, done = false, picks = new Set(), wrong = false, quizPick = -1, sortSel = {}, tries = 0, firstTry = 0;
      const nutState = { s: 0, p: 0, f: 0 };
      const status = (h) => { $('status').innerHTML = h; };
      const dots = () => `<div class="dots" aria-hidden="true">${STAGES.map((_, k) => `<i class="${k < si ? 'ok' : k === si ? 'on' : ''}"></i>`).join('')}</div>`;

      function draw() {
        if (si >= STAGES.length) {
          panel.innerHTML = `<div class="mission-top"><h2>旅程結束</h2>${dots()}</div>
            <p class="m-hint">${firstTry} / ${STAGES.length} 關第一次就答對。</p>
            <div class="fb ok"><strong>重點整理</strong>口腔：澱粉 → 麥芽糖（唾液）。<br>胃：蛋白質初步分解（胃液，酸性）。<br>小腸：三大類養分分解完成並吸收；膽汁不含酵素，能乳化脂質。<br>大腸：吸收水分；殘渣由肛門排出（排遺）。</div>
            <button class="ctl primary" type="button" id="labD-again">再走一次</button>`;
          panel.querySelector('#labD-again').addEventListener('click', reset);
          return;
        }
        const s = STAGES[si];
        let h = `<div class="mission-top"><h2>第 ${si + 1} 關：${STATIONS[s.st]}</h2>${dots()}</div><p class="m-text">${s.q}</p>`;
        if (s.kind === 'pick') {
          h += `<div class="picks">${NUT.map(([k, n]) => `<button class="opt" type="button" data-n="${k}" aria-pressed="${picks.has(k)}" ${done ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
          if (!done) h += `<div class="btn-row"><button class="ctl primary" type="button" id="labD-check">檢查</button></div>`;
        } else if (s.kind === 'quiz') {
          h += `<div class="opts">${s.opts.map((o, k) => `<button class="opt ${done && k === s.ans ? 'right' : !done && k === quizPick ? 'wrong' : ''}" type="button" data-k="${k}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
        } else {
          h += s.items.map(([k, n, c]) => `<div class="sort-row"><span style="color:${c};font-weight:700">${n}</span><span class="seg-ctl" role="group" aria-label="${n}">${[['cap', '微血管'], ['lac', '乳糜管']].map(([v, l]) => `<button type="button" data-i="${k}" data-v="${v}" aria-pressed="${sortSel[k] === v}" ${done ? 'disabled' : ''}>${l}</button>`).join('')}</span></div>`).join('');
          if (!done) h += `<div class="btn-row" style="margin-top:.6rem"><button class="ctl primary" type="button" id="labD-check">送出</button></div>`;
        }
        if (wrong && !done) {
          const bad = s.kind === 'sort' ? s.items.filter(([k, , , v]) => sortSel[k] !== v).map(([, n]) => `「${n}」`).join('、') : '';
          h += `<div class="fb bad"><strong>再想想看</strong>${bad ? `${bad}放錯了或還沒選。` : ''}${s.hint}</div>`;
        }
        if (done) h += `<div class="fb ok"><strong>${tries === 1 ? '一次就答對' : '答對了'}</strong>${s.why}</div><button class="ctl primary" type="button" id="labD-next">${si === STAGES.length - 1 ? '看整理' : '下一站'}</button>`;
        panel.innerHTML = h;
        panel.querySelectorAll('.opt[data-n]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.n; picks.has(k) ? picks.delete(k) : picks.add(k); draw(); }));
        panel.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => { tries++; quizPick = +b.dataset.k; if (quizPick === s.ans) succeed(); else { wrong = true; draw(); } }));
        panel.querySelectorAll('.seg-ctl button').forEach((b) => b.addEventListener('click', () => { sortSel[b.dataset.i] = b.dataset.v; draw(); }));
        const ck = panel.querySelector('#labD-check');
        if (ck) ck.addEventListener('click', () => {
          tries++;
          let ok;
          if (s.kind === 'pick') ok = s.ans.length === picks.size && s.ans.every((k) => picks.has(k));
          else ok = s.items.every(([k, , , v]) => sortSel[k] === v);
          if (ok) succeed(); else { wrong = true; draw(); status('還不對，看看提示再試一次。'); }
        });
        const nx = panel.querySelector('#labD-next');
        if (nx) nx.addEventListener('click', next);
      }

      function succeed() {
        done = true; wrong = false;
        if (tries === 1) firstTry++;
        const s = STAGES[si];
        if (s.kind === 'pick') {
          if (s.st === 0) nutState.s = 1;
          if (s.st === 1) nutState.p = 1;
          if (s.st === 2) Object.assign(nutState, { s: 2, p: 2, f: 1 });
          layout(nutState, true);
          if (s.st === 2) { if (tl) tl.kill(); tl = gsap.timeline({ delay: 1.2 }); tl.call(() => { nutState.f = 2; layout(nutState, true); }); }
          status(['口腔：部分澱粉被分解成麥芽糖。', '胃：蛋白質被初步分解。', '小腸：三大類養分都分解成小分子了。'][s.st]);
        } else if (s.kind === 'sort') {
          if (tl) tl.kill();
          tl = gsap.timeline();
          [['glu', 600 - 50, 300], ['ami', 650, 420], ['fat', 600, 380]].forEach(([k, x, y], i) => {
            const c = chips[k];
            tl.to(c, { x, y, duration: 0.9, ease: 'power2.inOut', onUpdate: () => S.place(c.g, { x: c.x, y: c.y, s: 0.8 }) }, i * 0.3);
          });
          status('小分子養分被吸收進入血液或淋巴，再運送到全身。');
        } else if (si === STAGES.length - 1) {
          if (tl) tl.kill();
          tl = gsap.timeline();
          waters.forEach((w, i) => tl.to(w, { y: i % 2 ? -120 : 120, opacity: 0, duration: 1, ease: 'power1.in' }, i * 0.08));
          tl.to(resid, { attr: { cx: 1000, rx: 34 }, duration: 1.6, ease: 'power1.inOut' }, 0.6);
          status('水分被大腸吸收；殘渣變成糞便，由肛門排出。');
        }
        draw();
      }

      function next() {
        si++; done = false; picks = new Set(); wrong = false; quizPick = -1; sortSel = {}; tries = 0;
        if (si < STAGES.length) {
          const s = STAGES[si];
          showStation(s.st);
          status(s.st === 3 ? '來到小腸內壁的絨毛。' : s.st === 4 ? '剩下的東西進入大腸。' : `食物來到${STATIONS[s.st]}。`);
        }
        draw();
      }

      function reset() {
        if (tl) tl.kill();
        si = 0; done = false; picks = new Set(); wrong = false; quizPick = -1; sortSel = {}; tries = 0; firstTry = 0;
        Object.assign(nutState, { s: 0, p: 0, f: 0 });
        layout(nutState, false);
        Object.values(chips).forEach((c) => { gsap.killTweensOf(c); c.x = 250; c.y = c.y0; S.place(c.g, { x: c.x, y: c.y }); });
        waters.forEach((w) => gsap.set(w, { y: 0, opacity: 1 }));
        resid.setAttribute('cx', 300); resid.setAttribute('rx', 60);
        showStation(0);
        status('跟著食物走一趟消化管。每一站先判斷，再看看發生了什麼。');
        draw();
      }

      reset();
      return { unmount() { if (tl) tl.kill(); } };
    },
  });
})();
