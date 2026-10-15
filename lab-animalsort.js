/* 互動：動物分類挑戰 — 一次看一種動物：先問「有脊椎骨嗎？」，再問屬於哪一類（蜘蛛再問：是昆蟲嗎？）。
   答錯給提示（不直接說出答案），答對後動物放進所屬的類別。 */
(() => {
  const { el, g, text, C } = S;
  const D = S.B4;
  const VER = '#7fd0ff', INV = '#ffb35c';
  const VG = [['fish', '魚類'], ['amph', '兩生類'], ['rept', '爬蟲類'], ['bird', '鳥類'], ['mamm', '哺乳類']];
  const IG = [['cnid', '刺絲胞動物'], ['flat', '扁形動物'], ['moll', '軟體動物'], ['anne', '環節動物'], ['arth', '節肢動物'], ['echi', '棘皮動物']];
  const GN = Object.fromEntries([...VG, ...IG]);
  const AX = 300, AY = 360; // 動物的位置
  // q2：正確的類別；insect：節肢動物再問「是昆蟲嗎？」的答案；cues：圖上的標示 [生物座標, 標籤 x, y, 文字]
  const ANIMALS = [
    { k: 'whale', name: '鯨魚', obs: ['浮出水面，從頭頂的噴氣孔換氣', '小鯨在母鯨的身體裡發育，出生後喝母鯨的奶'], vert: true, q2: 'mamm',
      draw: (p) => D.whale(p, AX + 10, AY + 10, 1.05), mini: (p) => D.whale(p, 0, 0, 0.19, { spout: false }),
      cues: [['blow', 470, 190, '噴氣孔'], ['tail', 520, 470, '水平的尾鰭']],
      hint: { vert: '想一想：鯨魚的身體構造比較像魚和人，還是像水母和烏賊？', q2: '看看線索：鯨魚用鰓還是用肺呼吸？小鯨是從卵孵出來，還是直接生出來？' },
      why: '鯨魚有脊椎骨，用<b>肺</b>呼吸、胎生、用<b>乳汁</b>哺育幼體 → <b>哺乳類</b>，不是魚類。' },
    { k: 'star', name: '海星', obs: ['生活在海中，身體是五條腕組成的星形', '用腹面許多細小的管足慢慢移動'], vert: false, q2: 'echi',
      draw: (p) => D.starfish(p, AX, AY + 10, 1.4, 10), mini: (p) => D.starfish(p, 0, 0, 0.3),
      cues: [['arm', 520, 250, '腕']],
      hint: { vert: '海星的身體由五條腕組成。想一想：牠的身體裡有沒有一節一節的脊椎骨？', q2: '想一想：海膽、海參也生活在海中、用管足移動，牠們屬於哪一類？' },
      why: '海星沒有脊椎骨，體表有<b>棘</b>、用<b>管足</b>移動 → <b>棘皮動物</b>。牠生活在海中，但不是魚。' },
    { k: 'bat', name: '蝙蝠', obs: ['身上長著毛，沒有羽毛', '用翅膀飛行，晚上出來活動'], vert: true, q2: 'mamm',
      draw: (p) => D.bat(p, AX + 10, AY + 20, 1.1), mini: (p) => D.bat(p, 0, 0, 0.19),
      cues: [['finger', 150, 190, '翅膀是皮膜，指骨很長'], ['fur', 470, 480, '身上有毛']],
      hint: { vert: '想一想：蝙蝠的身體構造比較像鳥和老鼠，還是像昆蟲？', q2: '鳥類有羽毛、會產卵。蝙蝠身上長的是羽毛嗎？小蝙蝠是怎麼出生的？' },
      why: '蝙蝠有毛、胎生、用<b>乳汁</b>哺育幼體 → <b>哺乳類</b>；牠是哺乳類中會飛的動物，不是鳥類。' },
    { k: 'cuttle', name: '烏賊', obs: ['用很多隻腕捕捉食物', '殼退化，藏在身體裡面'], vert: false, q2: 'moll',
      draw: (p) => D.cuttle(p, AX + 40, AY, 1.2), mini: (p) => D.cuttle(p, 6, 0, 0.26),
      cues: [['arm', 120, 470, '腕']],
      hint: { vert: '烏賊摸起來軟軟的，身體裡只有一片退化的殼。牠有一節一節的脊椎骨嗎？', q2: '烏賊的殼退化了。想一想：蝸牛、文蛤也有殼，牠們屬於哪一類？' },
      why: '烏賊沒有脊椎骨，身體<b>柔軟、不分節</b>，殼退化、藏在身體裡 → <b>軟體動物</b>，不是魚。' },
    { k: 'spider', name: '蜘蛛', obs: ['身體外面有硬硬的外骨骼', '會結網捕捉昆蟲'], vert: false, q2: 'arth', insect: 'no',
      draw: (p) => D.spider(p, AX, AY + 10, 1.2), mini: (p) => D.spider(p, 0, -14, 0.22),
      cues: [], legs: true,
      hint: { vert: '蜘蛛的身體外面有硬硬的外骨骼。身體裡面有脊椎骨嗎？', q2: '蜘蛛和蝦、蟹、昆蟲一樣有外骨骼。牠們屬於哪一類？', insect: '昆蟲有 3 對腳，身體分成頭、胸、腹。數一數蜘蛛有幾對腳？身體分成幾部分？' },
      why: '蜘蛛有外骨骼、腳分節 → <b>節肢動物</b>。', why2: '蜘蛛有 <b>4 對腳</b>、沒有觸角，身體分成頭胸部和腹部 → 屬於<b>蛛形類</b>，<b>不是昆蟲</b>。' },
    { k: 'seahorse', name: '海馬', obs: ['生活在海中，用鰓呼吸', '背上有小小的鰭'], vert: true, q2: 'fish',
      draw: (p) => D.seahorse(p, AX, AY + 20, 1.25), mini: (p) => D.seahorse(p, 0, 0, 0.24),
      cues: [['fin', 140, 330, '背鰭'], ['snout', 470, 150, '管狀的吻']],
      hint: { vert: '想一想：海馬的身體構造比較像金魚，還是像蝦子？', q2: '線索：海馬用什麼呼吸？有沒有鰭？' },
      why: '海馬有脊椎骨、用<b>鰓</b>呼吸、有<b>鰭</b> → <b>魚類</b>，雖然外形不太像魚。' },
  ];
  const EXTRA = [
    { k: 'jelly', name: '水母', obs: ['生活在海中', '傘狀的身體下面有許多觸手'], vert: false, q2: 'cnid', draw: (p) => D.jelly(p, AX, AY - 100, 1.1), mini: (p) => D.jelly(p, 0, -20, 0.22), cues: [['tentacle', 120, 470, '觸手']], hint: { vert: '水母的身體軟軟的、像傘。牠有脊椎骨嗎？', q2: '想一想：水母和珊瑚、海葵是同一類。牠們的觸手碰到會怎樣？' }, why: '水母沒有脊椎骨，觸手上有<b>刺絲胞</b> → <b>刺絲胞動物</b>。' },
    { k: 'plan', name: '渦蟲', obs: ['生活在溪流的石頭下', '頭部有兩個眼點'], vert: false, q2: 'flat', draw: (p) => D.planarian(p, AX, AY, 1.6), mini: (p) => D.planarian(p, 0, 0, 0.32), cues: [], hint: { vert: '渦蟲的身體又軟又扁。牠有脊椎骨嗎？', q2: '從側面看渦蟲，身體是圓滾滾的，還是很薄？' }, why: '渦蟲沒有脊椎骨，身體<b>扁平</b> → <b>扁形動物</b>。' },
    { k: 'snail', name: '蝸牛', obs: ['背著螺旋形的殼', '用腹足慢慢爬'], vert: false, q2: 'moll', draw: (p) => D.snail(p, AX - 10, AY + 90, 1.3), mini: (p) => D.snail(p, -4, 20, 0.26), cues: [], hint: { vert: '蝸牛的身體軟軟的。牠有脊椎骨嗎？', q2: '想一想：蝸牛和烏賊、文蛤是同一類。' }, why: '蝸牛身體柔軟、有殼 → <b>軟體動物</b>。' },
    { k: 'worm', name: '蚯蚓', obs: ['住在潮溼的土裡', '靠身體伸縮爬行'], vert: false, q2: 'anne', draw: (p) => D.worm(p, AX, AY, 1.3), mini: (p) => D.worm(p, 0, 0, 0.24), cues: [['clitellum', 300, 200, '環帶']], hint: { vert: '蚯蚓的身體軟軟的。牠有脊椎骨嗎？', q2: '仔細看蚯蚓的身體表面：是一圈一圈的嗎？' }, why: '蚯蚓身體由許多<b>環節</b>組成 → <b>環節動物</b>。' },
    { k: 'bee', name: '蜜蜂', obs: ['身體外面有外骨骼', '有翅膀和觸角'], vert: false, q2: 'arth', insect: 'yes', draw: (p) => D.bee(p, AX, AY, 1.15), mini: (p) => D.bee(p, 0, 0, 0.22), cues: [], hint: { vert: '蜜蜂的身體外面有外骨骼。身體裡面有脊椎骨嗎？', q2: '蜜蜂和蝦、蟹、蜘蛛一樣有外骨骼。牠們屬於哪一類？', insect: '數一數：有幾對腳？身體分成幾部分？' }, why: '蜜蜂有外骨骼、身體和腳分節 → <b>節肢動物</b>。', why2: '蜜蜂身體分成頭、胸、腹，<b>3 對腳</b>、1 對觸角、2 對翅 → <b>昆蟲</b>。' },
    { k: 'crab', name: '螃蟹', obs: ['有硬殼（外骨骼）', '5 對腳，第 1 對是螯足'], vert: false, q2: 'arth', insect: 'no', draw: (p) => D.crab(p, AX, AY + 20, 1.2), mini: (p) => D.crab(p, 0, 0, 0.22), cues: [], hint: { vert: '螃蟹的硬殼是外骨骼。身體裡面有脊椎骨嗎？', q2: '螃蟹和蜜蜂、蜘蛛一樣有外骨骼。牠們屬於哪一類？', insect: '昆蟲有 3 對腳。螃蟹有幾對腳？' }, why: '螃蟹有外骨骼、腳分節 → <b>節肢動物</b>。', why2: '螃蟹有 5 對腳 → 屬於<b>甲殼類</b>，不是昆蟲。' },
    { k: 'centi', name: '蜈蚣', obs: ['身體有許多體節', '每節有 1 對腳'], vert: false, q2: 'arth', insect: 'no', draw: (p) => D.centipede(p, AX + 30, AY, 1.1), mini: (p) => D.centipede(p, 0, 0, 0.22), cues: [], hint: { vert: '蜈蚣有外骨骼。身體裡面有脊椎骨嗎？', q2: '蜈蚣和蜜蜂、螃蟹一樣有外骨骼。牠們屬於哪一類？', insect: '昆蟲有 3 對腳。蜈蚣有幾對腳？' }, why: '蜈蚣有外骨骼、腳分節 → <b>節肢動物</b>。', why2: '蜈蚣有許多對腳 → 屬於<b>多足類</b>，不是昆蟲。' },
    { k: 'fish', name: '吳郭魚', obs: ['用鰓呼吸', '身上有鱗片'], vert: true, q2: 'fish', draw: (p) => D.fish(p, AX, AY, 1.35), mini: (p) => D.fish(p, 2, 0, 0.24), cues: [['gill', 120, 470, '鰓蓋']], hint: { vert: '想一想：魚的背部有沒有一節一節的骨頭？', q2: '吳郭魚用什麼呼吸？身上有什麼？' }, why: '吳郭魚用鰓呼吸、有鱗片 → <b>魚類</b>。' },
    { k: 'frog', name: '青蛙', obs: ['皮膚溼潤', '幼體（蝌蚪）用鰓呼吸'], vert: true, q2: 'amph', draw: (p) => D.frog(p, AX, AY + 80, 1.6), mini: (p) => D.frog(p, 0, 18, 0.3), cues: [], hint: { vert: '想一想：青蛙的身體構造比較像魚，還是像蚯蚓？', q2: '線索：幼體在水中用鰓呼吸，成體用肺和皮膚呼吸。' }, why: '青蛙幼體用鰓、成體用肺和皮膚呼吸 → <b>兩生類</b>。' },
    { k: 'lizard', name: '蜥蜴', obs: ['體表有鱗片', '產有卵殼的卵'], vert: true, q2: 'rept', draw: (p) => D.lizard(p, AX - 20, AY, 1.2), mini: (p) => D.lizard(p, -4, 0, 0.22), cues: [], hint: { vert: '想一想：蜥蜴的身體構造比較像蛇和鱷魚，還是像蚯蚓？', q2: '線索：用肺呼吸、有鱗片、卵有卵殼。' }, why: '蜥蜴有鱗片、用肺呼吸、卵有卵殼 → <b>爬蟲類</b>。' },
    { k: 'bird', name: '麻雀', obs: ['身上有羽毛', '前肢變成翅膀'], vert: true, q2: 'bird', draw: (p) => D.bird(p, AX + 10, AY + 100, 1.4), mini: (p) => D.bird(p, 0, 24, 0.3), cues: [], hint: { vert: '想一想：麻雀的翅膀裡有骨頭嗎？背部呢？', q2: '線索：有羽毛。' }, why: '麻雀有羽毛、前肢變成翅膀 → <b>鳥類</b>。' },
    { k: 'rabbit', name: '兔', obs: ['身上有毛', '小兔在母兔的身體裡發育後才出生'], vert: true, q2: 'mamm', draw: (p) => D.rabbit(p, AX, AY + 120, 1.4), mini: (p) => D.rabbit(p, 0, 32, 0.28), cues: [], hint: { vert: '想一想：兔子的身體構造比較像人，還是像昆蟲？', q2: '兔子身上長的是毛還是羽毛？小兔是怎麼出生的？' }, why: '兔有毛、用乳汁哺育幼體 → <b>哺乳類</b>。' },
  ];

  S.registerLab({
    id: 'lab-animalsort', section: '下4-3', title: '動物分類挑戰',
    mount(box) {
      box.innerHTML = `
<style>
  .labZ2 { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labZ2 .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labZ2 .pad { padding: 1rem 1.25rem; }
  .labZ2 .crumbs { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0 0 0.6rem; }
  .labZ2 .crumbs span { font-size: 0.92rem; padding: 0.15em 0.6em; border-radius: 999px; border: 1px solid var(--good); color: var(--good); }
  .labZ2 .acts.many .ctl { flex: 1 1 8em; font-size: 1rem; padding: 0.55em 0.7em; }
  .labZ2 .table-wrap { overflow-x: auto; }
  .labZ2 .free-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  @media (max-width: 900px) {
    .labZ2 { display: flex; flex-direction: column; align-items: stretch; }
    .labZ2 .col { display: contents; }
    .labZ2 .c-stage { order: 1; } .labZ2 .c-mis { order: 2; } .labZ2 .c-table { order: 3; } .labZ2 .c-free { order: 4; }
  }
</style>
<div class="labZ2">
  <div class="col">
    <div class="card c-stage">
      <div class="lab-stage"><svg viewBox="0 0 1200 600" role="img" aria-label="動物分類：左邊是要分類的動物，右邊是脊椎動物和無脊椎動物的各個類別"></svg></div>
      <div class="pad">
        <p class="status-line" id="labZ2-status" aria-live="polite"></p>
        <p class="footnote">＊示意：動物沒有依照真實比例畫。先看有沒有脊椎骨，再依照呼吸、體表、生殖等特徵判斷類別。</p>
      </div>
    </div>
    <div class="card pad c-table"><h3>分類紀錄</h3><div class="table-wrap" id="labZ2-table"></div></div>
  </div>
  <div class="col">
    <div class="card pad c-mis" id="labZ2-mission"></div>
    <details class="card pad free c-free" id="labZ2-free"><summary>自由探索：再選一種動物分類看看</summary>
      <div class="free-list" id="labZ2-freelist"></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labZ2-' + id);
      const svg = box.querySelector('svg');
      el('rect', { x: 0, y: 0, width: 1200, height: 600, fill: C.bg }, svg);
      const root = g(svg);
      const tweens = [];
      const tw = (o, v) => { const t = gsap.to(o, v); tweens.push(t); return t; };

      // ---------- 左：動物 ----------
      el('rect', { x: 20, y: 20, width: 580, height: 560, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, root);
      const nameT = text(root, 40, 64, '', { 'font-size': 30, 'font-weight': 700, fill: C.ink });
      const obs = [0, 1].map((k) => text(root, 40, 100 + k * 32, '', { 'font-size': 20, fill: C.ink2 }));
      const aniW = g(root), cueG = g(root);

      // ---------- 右：類別 ----------
      const bx = {};
      const side = (title, col, y) => { text(root, 630, y, title, { 'font-size': 24, fill: col, 'font-weight': 700 }); };
      side('脊椎動物', VER, 78);
      const vHead = el('rect', { x: 620, y: 52, width: 116, height: 36, rx: 8, fill: 'none', stroke: VER, 'stroke-width': 0 }, root);
      VG.forEach(([k, n], i) => { const cx = 676 + i * 111; bx[k] = { cx, y: 96, w: 106, h: 140, col: VER, n }; });
      side('無脊椎動物', INV, 280);
      const iHead = el('rect', { x: 620, y: 254, width: 142, height: 36, rx: 8, fill: 'none', stroke: INV, 'stroke-width': 0 }, root);
      IG.forEach(([k, n], i) => { const cx = 715 + (i % 3) * 186; bx[k] = { cx, y: 298 + Math.floor(i / 3) * 142, w: 180, h: 134, col: INV, n }; });
      Object.values(bx).forEach((b) => {
        b.g = g(root);
        b.frame = el('rect', { x: b.cx - b.w / 2, y: b.y, width: b.w, height: b.h, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: b.col, 'stroke-width': 2, 'stroke-opacity': 0.75 }, b.g);
        text(b.g, b.cx, b.y + 28, b.n, { 'font-size': b.w > 150 ? 22 : 21, 'text-anchor': 'middle', fill: b.col, 'font-weight': 700 });
        b.icons = g(b.g); b.count = 0;
      });

      // ---------- 狀態 ----------
      let list = ANIMALS, ai = 0, step = 'vert', got = {}, wrong = null, done = false, free = false, savedAi = 0;
      const first = [], recs = [];
      const doneK = new Set(); // 分好過的動物（點圓點可以回去再做）
      const sv = S.progress.lab('lab-animalsort'); // 上次存下的進度（要在第一次畫圓點之前讀）
      let firstNow = true;

      function paint() {
        vHead.setAttribute('stroke-width', got.vert === true ? 3 : 0);
        iHead.setAttribute('stroke-width', got.vert === false ? 3 : 0);
        Object.entries(bx).forEach(([k, b]) => { b.frame.setAttribute('stroke-width', got.q2 === k ? 5 : 2); b.frame.setAttribute('stroke-opacity', got.q2 === k ? 1 : 0.75); });
      }
      function showAnimal() {
        const a = list[ai];
        aniW.innerHTML = ''; aniW.removeAttribute('transform'); aniW.style.opacity = 1;
        const G = a.draw(g(aniW));
        nameT.textContent = a.name;
        obs.forEach((t, k) => { t.textContent = a.obs[k] ? '．' + a.obs[k] : ''; });
        cueG.innerHTML = '';
        (a.cues || []).forEach(([pk, lx, ly, s]) => { const pt = G.pts[pk]; if (!pt) return; const [tx, ty] = G.pt(...pt); S.callout(cueG, tx, ty, lx, ly, s, C.hi, { size: 20 }).style.opacity = 1; });
        if (a.legs) G.pts.leg.forEach((pt, k) => { const [x, y] = G.pt(...pt); const b = g(cueG); el('circle', { cx: Math.min(585, x + 16), cy: y, r: 14, fill: C.hi }, b); text(b, Math.min(585, x + 16), y + 7, String(k + 1), { 'font-size': 20, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 }); });
      }
      // 類別裡的小圖示：依數量排開（窄的格子上下排、寬的格子左右排）
      const slots = (b, n) => {
        const f = n === 1 ? 1 : n === 2 ? (b.w < 150 ? 0.66 : 0.8) : 0.55;
        if (b.w < 150) return [[b.y + 88], [b.y + 64, b.y + 114], [b.y + 56, b.y + 88, b.y + 120]][n - 1].map((y) => [b.cx, y, f]);
        return [[0], [-45, 45], [-58, 0, 58]][n - 1].map((dx) => [b.cx + dx, b.y + 86, f]);
      };
      function fly(k) {
        const a = list[ai], b = bx[k], add = b.count < 3 && ![...b.icons.children].some((c) => c.getAttribute('data-name') === a.name);
        if (add) b.count++;
        const pos = slots(b, b.count), [tx, ty, f] = pos[b.count - 1];
        const kk = 0.22 * f, from = { x: 0, y: 0, s: 1 }, to = { x: tx - kk * AX, y: ty - kk * AY, s: kk };
        const o = { u: 0 };
        tw(o, { u: 1, duration: 0.9, ease: 'power2.inOut', onUpdate: () => S.place(aniW, S.lerpXf(from, to, o.u)), onComplete: () => { aniW.style.opacity = 0; } });
        tw(cueG, { opacity: 0, duration: 0.3, onComplete: () => { cueG.innerHTML = ''; cueG.style.opacity = 1; } });
        if (!add) return; // 自由探索時，每一類最多放三個小圖示
        const ic = g(b.icons, { opacity: 0, 'data-name': a.name });
        a.mini(g(ic));
        [...b.icons.children].forEach((c, i) => { const [x, y, ff] = pos[i]; c.setAttribute('transform', `translate(${x},${y}) scale(${ff})`); });
        tw(ic, { opacity: 1, duration: 0.4, delay: 0.85 });
      }
      const OPTS = () => (step === 'vert' ? [['yes', '有脊椎骨'], ['no', '沒有脊椎骨']] : step === 'q2' ? (list[ai].vert ? VG : IG) : [['yes', '是昆蟲'], ['no', '不是昆蟲']]);
      const QTXT = () => (step === 'vert' ? `${list[ai].name}有<b>脊椎骨</b>嗎？` : step === 'q2' ? `${list[ai].name}屬於哪一類${list[ai].vert ? '脊椎動物' : '無脊椎動物'}？` : `${list[ai].name}是<b>昆蟲</b>嗎？`);
      function answer(v) {
        if (done) return;
        const a = list[ai];
        const right = step === 'vert' ? (a.vert ? 'yes' : 'no') : step === 'q2' ? a.q2 : a.insect;
        if (v !== right) { wrong = v; firstNow = false; if (!free && first[ai] === undefined) first[ai] = false; drawMission(); return; }
        wrong = null;
        if (step === 'vert') { got.vert = a.vert; step = 'q2'; }
        else if (step === 'q2') {
          got.q2 = v;
          if (a.insect) step = 'insect';
          else finish();
        } else { got.insect = v; finish(); }
        paint(); drawMission();
      }
      function finish() {
        const a = list[ai];
        done = true;
        fly(a.q2);
        const sub = a.insect ? (a.insect === 'yes' ? '（昆蟲）' : a.k === 'spider' ? '（蛛形類）' : a.k === 'crab' ? '（甲殼類）' : '（多足類）') : '';
        if (!free) { if (first[ai] === undefined) first[ai] = firstNow; doneK.add(ai); }
        recs.push([a.name, GN[a.q2] + sub, free ? '自由探索' : first[ai] ? '✓' : '再想一次後答對']);
        table();
        $('status').innerHTML = `${a.name} → <b>${a.vert ? '脊椎動物' : '無脊椎動物'}・${GN[a.q2]}${sub}</b>`;
      }
      // 還沒答完時，舞台上的小圖示和紀錄表都不顯示「同一種動物」先前的分類（避免洩漏答案）
      const curName = () => (!done && ai < list.length ? list[ai].name : null);
      function mask() { const n = curName(); Object.values(bx).forEach((b) => [...b.icons.children].forEach((c) => { c.style.display = n && c.getAttribute('data-name') === n ? 'none' : ''; })); }
      function table() {
        const n = curName(), rows = recs.filter((r) => r[0] !== n);
        mask();
        if (!rows.length) { $('table').innerHTML = '<p class="m-hint">分好的動物會列在這裡。</p>'; return; }
        $('table').innerHTML = `<table class="tbl"><thead><tr><th>動物</th><th>類別</th><th>第一次就答對</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
      }
      const mbox = $('mission');
      function drawMission() {
        // 這一種分好以後，圓點就顯示結果的顏色
        const dots = free ? '' : S.dots(ANIMALS.length, done ? -1 : ai, (k) => (doneK.has(k) ? (first[k] ? 'ok' : 'miss') : ''), '種動物');
        if (!free && ai >= ANIMALS.length) {
          const ok = first.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>${doneK.size === ANIMALS.length ? '六種動物都分好了' : `分好了 ${doneK.size} / ${ANIMALS.length} 種動物`}</h2>${dots}</div>
            <p class="m-text">第一次就答對：<b>${ok} / ${ANIMALS.length}</b> 種</p>${doneK.size < ANIMALS.length ? '<p class="m-hint">點上面灰色的圓點，可以去分還沒分的動物。</p>' : ''}
            <div class="fb ok"><strong>容易弄錯的動物</strong>鯨魚、蝙蝠是哺乳類（用肺呼吸、用乳汁哺育幼體）；海馬是魚類。<br>海星是棘皮動物、烏賊是軟體動物，都不是魚。<br>蜘蛛有 4 對腳，是節肢動物中的蛛形類，不是昆蟲。</div>
            <button class="ctl primary" type="button" id="labZ2-again">再做一次</button>`;
          mbox.querySelector('#labZ2-again').addEventListener('click', reset);
          $('free').open = true;
          return;
        }
        const a = list[ai];
        let html = `<div class="mission-top"><h2>${free ? '自由探索' : `第 ${ai + 1} 種`}：${a.name}</h2>${dots}</div>`;
        const cr = [];
        if (got.vert !== undefined) cr.push(got.vert ? '有脊椎骨' : '沒有脊椎骨');
        if (got.q2) cr.push(GN[got.q2]);
        if (cr.length) html += `<div class="crumbs">${cr.map((s) => `<span>${s}</span>`).join('')}</div>`;
        if (!done) {
          if (step === 'insect') html += `<div class="fb ok"><strong>${a.name}是節肢動物</strong>${a.why}</div>`;
          const opts = OPTS();
          html += `<p class="m-text">${QTXT()}</p><div class="acts ${opts.length > 2 ? 'many' : ''}">${opts.map(([v, s]) => `<button class="ctl ${wrong === v ? '' : 'primary'}" type="button" data-v="${v}" style="${wrong === v ? 'border-color:var(--bad);color:var(--bad)' : ''}">${s}</button>`).join('')}</div>`;
          if (wrong) html += `<div class="fb bad"><strong>再想想看</strong>${a.hint[step === 'vert' ? 'vert' : step === 'q2' ? 'q2' : 'insect']}</div>`;
        } else {
          html += `<div class="fb ok"><strong>${a.name} → ${GN[a.q2]}${a.insect ? (a.insect === 'yes' ? '（昆蟲）' : a.k === 'spider' ? '（蛛形類）' : a.k === 'crab' ? '（甲殼類）' : '（多足類）') : ''}</strong>${a.why2 || a.why}</div>`;
          html += `<button class="ctl primary" type="button" id="labZ2-next">${free ? '回到任務' : ai === ANIMALS.length - 1 ? '看結果' : '下一種'}</button>`;
        }
        mbox.innerHTML = html;
        mbox.querySelectorAll('.acts [data-v]').forEach((b) => b.addEventListener('click', () => answer(b.dataset.v)));
        const nx = mbox.querySelector('#labZ2-next');
        if (nx) nx.addEventListener('click', next);
      }
      function start() {
        tweens.forEach((t) => t.progress(1)); tweens.length = 0;
        got = {}; step = 'vert'; wrong = null; done = false; firstNow = true;
        if (ai < list.length) { showAnimal(); $('status').innerHTML = '先判斷有沒有脊椎骨，再判斷屬於哪一類。'; }
        else { aniW.innerHTML = ''; cueG.innerHTML = ''; nameT.textContent = ''; obs.forEach((t) => { t.textContent = ''; }); }
        table(); paint(); drawMission();
      }
      // 換一種動物（start 會先把上一種的動畫做完）
      function goAnimal(k) { ai = k; start(); }
      S.onDots(mbox, goAnimal);
      function next() {
        if (free) { free = false; list = ANIMALS; ai = savedAi; start(); return; }
        goAnimal(ai + 1);
      }
      function reset() {
        tweens.forEach((t) => t.kill()); tweens.length = 0;
        Object.values(bx).forEach((b) => { b.icons.innerHTML = ''; b.count = 0; });
        first.length = 0; doneK.clear(); recs.length = 0; free = false; list = ANIMALS; ai = 0;
        $('free').open = false; table(); start();
      }
      const ALL = [...ANIMALS, ...EXTRA];
      $('freelist').innerHTML = ALL.map((a, i) => `<button class="ctl small" type="button" data-i="${i}">${a.name}</button>`).join('');
      $('freelist').querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => {
        if (!free) savedAi = done ? ai + 1 : ai; // 目前這種已經分好，回來時從下一種開始
        free = true; list = ALL; ai = +b.dataset.i; start();
        window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - 10, behavior: 'smooth' });
      }));
      reset();
      // 接上上次的進度：圓點照舊，從第一種還沒分的動物開始；全部分好就顯示結果
      if (sv) {
        [...sv.ok, ...sv.miss].filter((k) => k < ANIMALS.length).forEach((k) => { doneK.add(k); first[k] = sv.ok.includes(k); });
        const k0 = ANIMALS.findIndex((_, k) => !doneK.has(k));
        goAnimal(k0 < 0 ? ANIMALS.length : k0);
      }
      S._labZ2 = { answer, next, state: () => ({ ai, step, done, free, got: { ...got }, wrong }), flush: () => tweens.forEach((t) => t.progress(1)), pick: (i) => $('freelist').querySelectorAll('[data-i]')[i].click() };
      return { unmount() { tweens.forEach((t) => t.kill()); delete S._labZ2; } };
    },
  });
})();
