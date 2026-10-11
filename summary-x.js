/* 總複習：跨章比較（版面在 summary.js；導覽的「總複習」章在 engine.js 的 CHAPTERS／SECTIONS）
   表格格子裡的小按鈕（chip）會打開教這個重點的動畫那一步或互動；按鈕上的節號由 S.findItem 自動算出。
   rows／note 寫成 getter：打開這一頁時才產生按鈕（那時所有動畫和互動都已經註冊好）。 */
(() => {
  // 小按鈕和試管色塊的樣式（只在這一頁用到）
  if (!document.getElementById('x-style')) {
    const st = document.createElement('style');
    st.id = 'x-style';
    st.textContent = `
    button.xgo { font: inherit; font-size: 0.88rem; line-height: 1.35; padding: 0.08em 0.55em; margin: 0.12em 0.3em 0.12em 0; border-radius: 999px; border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; white-space: nowrap; vertical-align: 0.06em; font-variant-numeric: tabular-nums; }
    button.xgo.lab { border-style: dashed; }
    button.xgo:hover { background: var(--accent); color: var(--accent-ink); }
    button.xgo:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
    .xtube { display: inline-block; width: 0.75em; height: 1.3em; border-radius: 0.12em 0.12em 0.5em 0.5em; background: var(--c); box-shadow: inset 0 0 0 1px rgba(128, 140, 150, 0.75); vertical-align: -0.3em; margin: 0 0.2em 0 0.12em; }
    .xtube.paper { width: 1.05em; height: 0.75em; border-radius: 0.12em; vertical-align: -0.05em; }
    .xcol { white-space: nowrap; }
    .xarr { margin: 0 0.2em; color: var(--muted); }
    .xw { white-space: nowrap; }
    @media (max-width: 22rem) { table.cmp:has(thead th:nth-child(4)) .xw { white-space: normal; } } /* 很窄的手機：4 欄的表格放不下，才在詞語中間換行 */
    .xchips { display: flex; flex-wrap: wrap; white-space: normal; margin-top: 0.3rem; }
    table.cmp tbody th:has(.xchips) { color: var(--ink); }`;
    document.head.appendChild(st);
  }

  // chip(id, 關鍵字, 補充字)：打開某個互動，或某個動畫裡「說明文字含有這個關鍵字」的第一步。
  // 用關鍵字而不用步驟編號：別的章插入新步驟時，連結也不會跑掉；找不到關鍵字就從第 1 步開始。
  const chip = (id, key = '', word = '') => {
    const it = S.findItem && S.findItem(id);
    if (!it) return '';
    const lab = it.kind === 'lab';
    const tip = `${lab ? '互動' : '動畫'}：${it.title}${!lab && key ? `（${key}）` : ''}`;
    return `<button class="xgo${lab ? ' lab' : ''}" type="button" data-xat="${id}" data-key="${lab ? '' : key}" title="${tip}" aria-label="${tip}">${S.secLabel(it.section)}${word ? ` ${word}` : ''}</button>`;
  };
  const openKey = (id, key) => {
    S.openById(id);
    const it = S.findItem(id), cap = document.getElementById('caption');
    if (!it || it.kind === 'lab' || !key || cap.textContent.includes(key)) return;
    const n = document.querySelectorAll('#progress .seg').length;
    for (let k = 1; k < n; k++) { S.openAt(id, k); if (cap.textContent.includes(key)) return; }
    const first = document.querySelector('#progress .seg');
    if (first) first.click();
  };
  if (!S._xClick) { S._xClick = true; document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-xat]'); if (b) openKey(b.dataset.xat, b.dataset.key); }); }
  const chips = (...L) => L.map((a) => chip(...a)).join('');
  // 列名（表格最左欄）下面放連結
  const named = (name, ...L) => `${name}<span class="xchips">${chips(...L)}</span>`;
  // 一行一個功能，行尾放連結
  const lines = (L) => L.map(([s, id, k]) => `${s} ${chip(id, k)}`).join('<br>');
  // 顏色：試管（液體）或試紙
  const tube = (c, name = '') => `<span class="xcol"><span class="xtube" style="--c:${c}" aria-hidden="true"></span>${name}</span>`;
  const paper = (c, name = '') => `<span class="xcol"><span class="xtube paper" style="--c:${c}" aria-hidden="true"></span>${name}</span>`;
  // 顏色變化：「色塊＋箭頭」連在一起，太窄時才在箭頭後面換行
  const seq = (...L) => L.map((x, i) => (i < L.length - 1 ? `<span class="xcol">${x}<span class="xarr">→</span></span>` : x)).join(' ');
  const nw = (s) => `<span class="xcol">${s}</span>`; // 不換行
  const W = (...p) => p.map((s) => `<span class="xw">${s.trimEnd()}</span>${s.endsWith(' ') ? ' ' : ''}`).join(''); // 只在詞語之間換行（結尾的空格放在外面，才能在那裡換行）
  const K = {
    iod: '#c5852c', bb: '#1f2a66', blue: '#3b78d8', green: '#45a849', yellow: '#e3c53a', orange: '#e8862a', red: '#b8382a',
    btb1: '#2f6fd6', btb2: '#3fa64a', btb3: '#e3c53a', clear: 'transparent', milky: '#e9e6dc', mb: '#2f5fd0', co1: '#3a64c8', co2: '#f08fb0',
  };

  const MAP = [];
  const QUIZ = [
    ['想知道呼出的氣體是否含有較多二氧化碳，可以用哪一種溶液檢驗？', ['碘液', '本氏液', 'BTB 溶液', '亞甲藍液'], 2, '二氧化碳溶在水中呈弱酸性，使 BTB 由藍色經綠色變成黃色（也可以用澄清石灰水，會變混濁）。碘液檢驗澱粉、本氏液檢驗葡萄糖，亞甲藍液用來染色。', 'breath'],
    ['下列「試劑 → 檢驗的物質」，哪一組配對正確？', ['碘液 → 葡萄糖', 'BTB → 二氧化碳', '本氏液 → 澱粉', '亞甲藍液 → 氧'], 1, '碘液檢驗澱粉（變藍黑色）；本氏液檢驗葡萄糖（隔水加熱後變色）；BTB 檢驗二氧化碳；亞甲藍液是染口腔皮膜細胞用的。', 'nutrients'],
    ['對著乾燥（藍色）的氯化亞鈷試紙呼氣，試紙變成粉紅色，表示呼出的氣體含有？', ['氧', '二氧化碳', '水蒸氣', '氮'], 2, '氯化亞鈷試紙遇到水，會由藍色變成粉紅色，表示呼出的氣體含有水蒸氣。檢驗二氧化碳要用 BTB 或澄清石灰水。', 'breath'],
    ['遮光實驗中，同一片葉子一部分照光、一部分遮光，最後加碘液檢驗。這個實驗的操縱變因是？', ['有沒有照光', '加碘液後的顏色', '酒精的量', '葉片的大小'], 0, '刻意改變的條件是「有沒有照光」（操縱變因）；加碘液後的顏色是觀察的結果（應變變因）。', 'photo'],
    ['關於植物的光合作用和呼吸作用，下列何者正確？', ['植物只在晚上進行呼吸作用', '光合作用在粒線體中進行', '呼吸作用的產物是葡萄糖和氧', '植物的細胞白天、晚上都進行呼吸作用'], 3, '所有活細胞（包括植物細胞）白天、晚上都進行呼吸作用；光合作用要有光，在葉綠體中進行。兩者的原料和產物剛好相反。', 'breath'],
    ['下列何者屬於「排泄」？', ['排出糞便', '流汗', '唾腺分泌唾液', '胰島分泌胰島素'], 1, '汗液含有尿素、多餘的水和無機鹽，流汗屬於排泄。排出糞便是排遺；唾液、胰島素是分泌。', 'excretion'],
    ['胰臟同時屬於消化系統和內分泌系統，原因是？', ['它會製造膽汁', '它能吸收養分', '它分泌胰液送到小腸，其中的胰島又分泌激素進入血液', '它能把氨轉變成尿素'], 2, '胰液經導管送到小腸消化養分；胰島分泌胰島素、升糖素，直接進入血液。膽汁、尿素都和肝臟有關。', 'homeo'],
    ['下列哪一項「不是」肝臟的功能？', ['製造膽汁', '把氨轉變成尿素', '把葡萄糖合成肝糖儲存', '過濾血液、形成尿液'], 3, '過濾血液、形成尿液的是腎臟；肝臟製造膽汁、形成尿素、儲存肝糖。', 'excretion'],
    ['蒸散作用實驗中，量筒的水面加一層油，目的是？', ['防止水從水面直接蒸發', '提供枝條養分', '讓枝條長得比較快', '讓枝條站得比較穩'], 0, '油層擋住水面的蒸發，量筒裡減少的水，才是枝條吸收、再由葉散失的水。', 'lab-transpiration'],
    ['植物的「導管」和人體外分泌腺的「導管」，下列敘述何者正確？', ['兩者都運送血液', '植物的導管運輸水和礦物質；腺體的導管送出分泌物', '兩者都運送葉製造的養分', '內分泌腺也有導管'], 1, '名字一樣，功能不同：植物的導管在木質部，運輸水和礦物質；汗腺、唾腺等外分泌腺經由導管送出分泌物，內分泌腺沒有導管。', 'vascular'],
  ];

  const CHARTS = [
    { type: 'table', title: '實驗常用的試劑與試紙', cols: [['檢驗', '#ffd166'], ['顏色變化', '#62d0c0']],
      get rows() {
        return [
          [named('<b>碘液</b>', ['nutrients', '檢測養分', '養分'], ['enzyme', '唾液實驗', '唾液'], ['photo', '遮光實驗', '遮光']), nw('<b>澱粉</b>'), seq(tube(K.iod, '黃褐'), tube(K.bb, '藍黑'))],
          [named('<b>本氏液</b>', ['nutrients', '本氏液', '養分'], ['lab-food', '', '互動']), `${nw('<b>葡萄糖</b>等')}<br><small>${W('要隔水', '加熱')}</small>`, `${seq(tube(K.blue, '藍'), tube(K.green) + tube(K.yellow) + tube(K.orange) + tube(K.red))}<br><small>綠、黃、橙、紅：越多越紅</small>`],
          [named('<b>BTB</b><br><small>溴瑞香草藍</small>', ['breath', 'BTB', '呼氣'], ['lab-breath', '', '互動']), `溶液中的${nw('<b>二氧化碳</b>')}<br><small>在接近中性（pH 約 7）時變色</small>`, seq(tube(K.btb1, '藍'), tube(K.btb2, '綠'), tube(K.btb3, '黃'))],
          [named('<b>澄清石灰水</b>', ['breath', '石灰水', '呼氣']), nw('<b>二氧化碳</b>'), seq(tube(K.clear, '澄清'), tube(K.milky, '混濁'))],
          [named(`<b>${W('氯化亞鈷', '試紙')}</b>`, ['breath', '氯化亞鈷', '呼氣']), `${nw('<b>水</b>')}<br><small>${W('試紙要', '先烘乾')}</small>`, seq(paper(K.co1, '藍'), paper(K.co2, '粉紅'))],
          [named('染色用', ['microscope', '亞甲藍液', '染色']), `${nw('洋蔥表皮')}<br>${nw('口腔皮膜')}`, `${tube(K.iod, '碘液')}<br>${tube(K.mb, '亞甲藍液')}<br><small>${W('細胞核', '更清楚')}</small>`],
        ];
      },
      note: 'BTB 是一種指示劑，在接近中性（pH 約 7）時變色：二氧化碳溶在水中呈弱酸性，所以 BTB 由藍色經綠色變成黃色。碘液、BTB、石灰水不用加熱；本氏液一定要隔水加熱，而且蔗糖、澱粉測不出來。對 BTB、澄清石灰水、氯化亞鈷試紙呼氣都會變色，因為呼出的氣體含較多二氧化碳和水蒸氣。實線框的按鈕打開動畫，虛線框的打開互動。' },

    { type: 'table', title: '實驗中的材料：為什麼要這樣做？', cols: [['目的', '#ffd166']],
      get rows() {
        return [
          [named('葉片先放' + W('<b>暗處</b>一天'), ['photo', '遮光實驗', '遮光']), '消耗葉片中原有的' + W('澱粉')],
          [named('葉片放進' + W('<b>熱水</b>中煮'), ['photo', '遮光實驗', '遮光']), '破壞細胞、讓葉片變軟，酒精和碘液比較容易' + W('進入')],
          [named('<b>酒精</b>隔水加熱', ['photo', '遮光實驗', '遮光']), '溶出葉綠素，碘液的顏色才看得' + W('清楚') + `<br><small>${W('酒精易燃，', '不能直接加熱')}</small>`],
          [named('<b>線香</b>的餘燼', ['photo', '線香', '水蘊草'], ['lab-photo', '', '互動']), '檢驗<b>氧</b>：餘燼復燃'],
          [named('<b>小蘇打水</b>', ['lab-photo', '', '互動']), '提供二氧化碳給' + W('水蘊草')],
          [named('<b>紅墨水</b>', ['plantflow', '紅墨水', '芹菜']), '看出水走的路：' + W('<b>木質部</b>', '變紅')],
          [named('水面的<b>油層</b>', ['lab-transpiration', '', '互動']), '防止水從水面直接' + W('蒸發')],
          [named('<b>凡士林</b>', ['lab-transpiration', '', '互動']), '塗在葉的表皮，把那一面的氣孔' + W('堵住')],
          [named('<b>37 °C</b> 水浴', ['lab-enzyme', '', '互動']), '接近體溫，唾液中的酵素作用' + W('最快')],
          [named('<b>吸水紙</b>', ['microscope', '吸水紙', '染色']), '在蓋玻片另一側吸，讓染液流過' + W('標本') + `<br><small>${W('不必掀開', '蓋玻片')}</small>`],
          [named('<b>鵝頸瓶</b>', ['origin', '鵝頸瓶', '巴斯德']), '彎曲的瓶頸讓空氣進入，擋住' + W('微生物') + '<br><small>（補充）</small>'],
        ];
      } },

    { type: 'table', title: '經典實驗：改變什麼？觀察什麼？', cols: [['改變', '#ffd166'], ['觀察', '#62d0c0'], ['結論', '#c9a7ff']],
      get rows() {
        return [
          [named(W('唾液', '實驗'), ['lab-enzyme']), '加<b>唾液</b>或' + W('清水'), W('加碘液，', '會不會', '變藍黑色'), W('唾液能', '分解澱粉')],
          [named(W('酵素與', '溫度'), ['lab-enzyme']), W('水浴的', '<b>溫度</b>') + `<br><small>${W('0、37、', '80 °C')}</small>`, W('澱粉多快', '被分解'), W('37 °C ', '最快；') + W('高溫會', '破壞酵素')],
          [named(W('遮光', '實驗'), ['photo', '遮光實驗']), W('葉片', '<b>照光</b>', '或遮光'), W('加碘液，', '會不會', '變藍黑色'), W('光合作用', '需要光')],
          [named(W('水蘊草'), ['lab-photo']), W('燈的', '<b>距離</b>') + `<br><small>${W('光的強弱')}</small>`, W('每分鐘的', '氣泡數'), W('光越強，', '光合作用', '越旺盛')],
          [named(W('蒸散', '作用'), ['lab-transpiration']), W('<b>有葉</b>', '或去葉'), W('量筒的水', '減少多少'), W('水主要', '從葉散失')],
          [named(W('凡士林'), ['lab-transpiration']), W('凡士林塗', '<b>上表皮</b>', '或下表皮'), W('量筒的水', '減少多少'), W('多數植物', '下表皮的', '氣孔較多')],
          [named(W('呼出的', '氣體'), ['lab-breath']), W('<b>吹氣</b>', '或打入', '空氣'), W('BTB 的', '顏色'), W('呼出的氣體', '含較多', '二氧化碳')],
          [named(W('發芽的', '種子'), ['lab-breath']), W('<b>發芽</b>的', '種子或') + W('<b>煮過</b>的', '種子') + W('（對照組）'), W('澄清', '石灰水', '會不會', '變混濁'), W('植物也會', '進行', '呼吸作用，') + W('放出', '二氧化碳')],
          [named(W('鵝頸瓶'), ['origin', '鵝頸瓶']), W('瓶頸', '<b>完整</b>', '或打斷'), W('肉湯', '會不會', '腐敗'), W('生物由', '原有的', '生物產生') + '<br><small>（補充）</small>'],
        ];
      },
      get note() { return `「改變」的條件是操縱變因，「觀察」的結果是應變變因；其他條件（控制變因）都要相同。加清水、打入一般空氣的那一組是對照組。 ${chip('method', '操縱變因', '科學方法')}`; } },

    { type: 'svg', title: '光合作用 vs 呼吸作用', w: 600, h: 462,
      get note() { return `兩者的原料和產物剛好相反：光合作用把光能儲存在葡萄糖中，呼吸作用把葡萄糖中的能量釋放出來。植物的細胞白天、晚上都在進行呼吸作用。藍綠菌沒有葉綠體，也能進行光合作用。 ${chip('photo', '利用光能', '光合作用')}${chip('microbes', '藍綠菌', '藍綠菌')}${chip('breath', '呼吸作用', '呼吸作用')}${chip('cell', '粒線體', '粒線體')}`; },
      draw(svg) {
        const { el, text, C } = S;
        const PH = '#6fce62', RS = C.mito;
        const head = (x, y, ang, col) => el('path', { d: `M ${x},${y} L ${x - 13 * Math.cos(ang - 0.45)},${y - 13 * Math.sin(ang - 0.45)} L ${x - 13 * Math.cos(ang + 0.45)},${y - 13 * Math.sin(ang + 0.45)} Z`, fill: col }, svg);
        const multi = (x, y, parts, size) => { const t = text(svg, x, y, '', { 'font-size': size, 'font-weight': 700, 'text-anchor': 'middle' }); parts.forEach(([s, c]) => { el('tspan', { fill: c }, t).textContent = s; }); };
        // 光能 → 光合作用
        const sx = 111, sy = 46;
        for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; el('line', { x1: sx + Math.cos(a) * 23, y1: sy + Math.sin(a) * 23, x2: sx + Math.cos(a) * 30, y2: sy + Math.sin(a) * 30, stroke: C.hi, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg); }
        el('circle', { cx: sx, cy: sy, r: 16, fill: C.hi }, svg);
        text(svg, 150, 54, '光能', { 'font-size': 21, 'font-weight': 700, fill: C.hi });
        el('line', { x1: sx, y1: 84, x2: sx, y2: 134, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, svg);
        head(sx, 145, Math.PI / 2, C.hi);
        // 兩個作用
        const box = (x, col, name, place, who) => {
          el('rect', { x, y: 148, width: 190, height: 112, rx: 16, fill: col, 'fill-opacity': 0.14, stroke: col, 'stroke-width': 2.5 }, svg);
          text(svg, x + 95, 184, name, { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle', fill: col });
          text(svg, x + 95, 214, place, { 'font-size': 19, 'text-anchor': 'middle', fill: C.ink });
          text(svg, x + 95, 242, who, { 'font-size': 17, 'text-anchor': 'middle', fill: C.mute });
        };
        box(16, PH, '光合作用', '在葉綠體', '有葉綠體的細胞');
        box(394, RS, '呼吸作用', '主要在粒線體', '所有活細胞');
        // 呼吸作用 → 釋放能量
        text(svg, 489, 40, '釋放能量', { 'font-size': 21, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
        text(svg, 489, 66, '供生命活動使用', { 'font-size': 17, 'text-anchor': 'middle', fill: C.ink2 });
        el('line', { x1: 489, y1: 146, x2: 489, y2: 92, stroke: C.hi, 'stroke-width': 3 }, svg);
        head(489, 80, -Math.PI / 2, C.hi);
        // 上面：光合作用的產物 → 呼吸作用的原料；下面：反過來
        el('path', { d: 'M 206,174 C 250,104 350,104 388,165', fill: 'none', stroke: C.ink2, 'stroke-width': 3 }, svg);
        head(394, 174, Math.atan2(68, 44), C.ink2);
        multi(300, 100, [['葡萄糖', C.sugar], [' ＋ ', C.ink], ['氧', C.oxygen]], 21);
        el('path', { d: 'M 394,234 C 350,302 250,302 212,243', fill: 'none', stroke: C.ink2, 'stroke-width': 3 }, svg);
        head(206, 234, Math.atan2(-68, -44), C.ink2);
        multi(300, 322, [['二氧化碳', C.co2], [' ＋ ', C.ink], ['水', C.water]], 21);
        text(svg, 300, 198, '原料和產物', { 'font-size': 17, 'text-anchor': 'middle', fill: C.mute });
        text(svg, 300, 222, '剛好相反', { 'font-size': 17, 'text-anchor': 'middle', fill: C.mute });
        // 什麼時候進行：白天、晚上
        el('rect', { x: 120, y: 344, width: 230, height: 104, rx: 8, fill: 'rgba(255,209,102,0.10)' }, svg);
        el('rect', { x: 354, y: 344, width: 230, height: 104, rx: 8, fill: 'rgba(120,140,230,0.16)' }, svg);
        text(svg, 235, 370, '白天（有光）', { 'font-size': 18, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
        text(svg, 469, 370, '晚上（黑暗）', { 'font-size': 18, 'font-weight': 700, 'text-anchor': 'middle', fill: '#a9b8ff' });
        el('rect', { x: 132, y: 386, width: 206, height: 20, rx: 10, fill: PH }, svg);
        el('rect', { x: 132, y: 420, width: 440, height: 20, rx: 10, fill: RS }, svg);
        text(svg, 16, 403, '光合作用', { 'font-size': 19, 'font-weight': 700, fill: PH });
        text(svg, 16, 437, '呼吸作用', { 'font-size': 19, 'font-weight': 700, fill: RS });
      } },

    { type: 'svg', title: '從食物到廢物：養分的旅程', w: 600, h: 500,
      get note() { return `養分被小腸吸收後，由血液送到全身的細胞。多餘的葡萄糖，由胰島素調節，在肝臟合成肝糖儲存。 ${chip('digest', '乳糜管', '吸收')}${chip('circulation', '物質交換', '物質交換')}${chip('breath', '呼吸作用', '呼吸作用')}${chip('excretion', '肝臟', '尿素')}${chip('homeo', '肝糖', '肝糖')}`; },
      draw(svg) {
        const { el, text, C } = S;
        const PRO = '#ff8f8f', RS = C.mito, LX = 262, RX = 476, LINE = '#2b4252';
        const head = (x, y, col) => el('path', { d: `M ${x - 7},${y - 9} L ${x},${y} L ${x + 7},${y - 9} Z`, fill: col }, svg);
        const down = (x, y1, y2, col) => { el('line', { x1: x, y1, x2: x, y2: y2 - 6, stroke: col, 'stroke-width': 3 }, svg); head(x, y2, col); };
        const node = (x, y, w, h, col, a, b) => {
          el('rect', { x: x - w / 2, y, width: w, height: h, rx: 12, fill: '#0f1c26', stroke: col, 'stroke-width': 2.2 }, svg);
          el('rect', { x: x - w / 2, y, width: w, height: h, rx: 12, fill: col, 'fill-opacity': 0.14 }, svg);
          if (b) {
            text(svg, x, y + 27, a, { 'font-size': 21, 'font-weight': 700, 'text-anchor': 'middle', fill: col });
            text(svg, x, y + 52, b, { 'font-size': 17, 'text-anchor': 'middle', fill: C.ink2 });
          } else text(svg, x, y + h / 2 + 7, a, { 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle', fill: col });
        };
        // 四個階段（左邊寫出在哪一節學過）
        [[48, 104, '消化', '3-4'], [160, 92, '吸收、運輸', '3-4・4-4'], [260, 84, '細胞利用', '6-1'], [352, 140, '排泄', '6-2']].forEach(([y, h, n, sec]) => {
          el('rect', { x: 8, y, width: 584, height: h, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: LINE, 'stroke-width': 2 }, svg);
          text(svg, 22, y + 32, n, { 'font-size': 20, 'font-weight': 700, fill: C.ink });
          text(svg, 22, y + 56, sec, { 'font-size': 17, fill: C.mute });
        });
        // 消化
        text(svg, LX, 34, '澱粉（醣類）', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle', fill: C.sugar });
        text(svg, RX, 34, '蛋白質', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle', fill: PRO });
        down(LX, 44, 102, C.sugar);
        down(RX, 44, 102, PRO);
        text(svg, LX + 14, 82, '口腔、小腸', { 'font-size': 17, fill: C.mute });
        text(svg, RX + 14, 82, '胃、小腸', { 'font-size': 17, fill: C.mute });
        node(LX, 104, 130, 38, C.sugar, '葡萄糖');
        node(RX, 104, 130, 38, PRO, '胺基酸');
        // 吸收、運輸
        down(LX, 142, 174, C.sugar);
        down(RX, 142, 174, PRO);
        el('rect', { x: 164, y: 174, width: 410, height: 70, rx: 12, fill: 'rgba(255,95,116,0.12)', stroke: C.blood, 'stroke-width': 2.2 }, svg);
        text(svg, 369, 203, '小腸絨毛的微血管吸收', { 'font-size': 19, 'text-anchor': 'middle', fill: C.ink });
        text(svg, 369, 231, '血液把養分送到全身的細胞', { 'font-size': 19, 'text-anchor': 'middle', fill: C.ink });
        // 細胞利用
        down(LX, 244, 272, C.ink2);
        down(RX, 244, 272, C.ink2);
        node(LX, 272, 196, 64, RS, '呼吸作用', '分解葡萄糖，釋放能量');
        node(RX, 272, 196, 64, PRO, '構成身體', '分解時產生氨');
        // 排泄
        down(LX, 336, 366, C.co2);
        down(RX, 336, 366, PRO);
        node(LX, 366, 196, 64, C.co2, '二氧化碳', '經血液到肺，呼出');
        node(RX, 366, 196, 46, '#e8c84a', '肝臟：氨 → 尿素');
        down(RX, 412, 436, '#e8c84a');
        node(RX, 436, 196, 46, '#e8c84a', '腎臟：形成尿液');
      } },

    { type: 'table', title: '排泄、排遺、分泌', cols: [['排泄', '#e8c84a'], ['排遺', '#b08a5a'], ['分泌', '#63d4bf']],
      get rows() {
        return [
          [W('排出', '什麼'), `${W('細胞代謝', '產生的', '<b>廢物</b>')}<br>${chip('excretion', '稱為排泄')}`, `${W('沒有被', '消化吸收的', '<b>食物殘渣</b>')}<br>${chip('digest', '排遺')}`, `${W('腺體製造的', '<b>有用物質</b>')}<br>${chip('endocrine', '外分泌腺')}`],
          [W('例子'), W('尿液、', '汗液') + '<br>' + W('呼出的', '二氧化碳'), W('糞便'), W('唾液、', '胃液、', '胰液') + '<br>' + W('胰島素等', '激素')],
          [W('經過'), W('腎臟、', '皮膚、', '肺'), W('大腸 → ', '肛門'), W('外分泌腺：', '經<b>導管</b>') + '<br>' + W('內分泌腺：', '直接進入', '<b>血液</b>')],
        ];
      },
      get note() { return `糞便是沒有被消化吸收的食物殘渣，不是細胞代謝產生的廢物，所以<b>排遺不是排泄</b>。汗腺是外分泌腺，但汗液含有尿素等廢物，所以流汗屬於<b>排泄</b>。 ${chip('excretion', '汗腺', '汗液')}`; } },

    { type: 'table', title: '一個器官，多種功能', cols: [['功能', '#ff9a8a']],
      get rows() {
        return [
          ['<b>肝臟</b>', lines([['製造<b>膽汁</b>（膽汁把脂質乳化成小油滴）', 'digest', '乳化'], ['把葡萄糖合成<b>肝糖</b>儲存，需要時再分解', 'homeo', '肝糖'], ['把有毒的氨轉變成<b>尿素</b>', 'excretion', '肝臟']])],
          ['<b>胰臟</b>', lines([['分泌<b>胰液</b>，經導管送到小腸消化養分', 'digest', '胰液'], ['其中的<b>胰島</b>分泌胰島素、升糖素，直接進入血液', 'homeo', '胰島']])],
          ['<b>皮膚</b>', lines([['<b>汗腺</b>排出汗液（排泄）', 'excretion', '汗腺'], ['流汗、血管擴張或收縮，調節<b>體溫</b>', 'homeo', '皮膚血管'], ['阻擋<b>病原體</b>', 'circulation', '黏膜'], ['感覺器官：接受冷、熱、痛等刺激', 'nerve', '受器']])],
          ['<b>肺</b>', lines([['<b>氣體交換</b>：得到氧、放出二氧化碳', 'breath', '氣體交換'], ['呼出二氧化碳和水蒸氣，也是<b>排泄</b>', 'excretion', '稱為排泄']])],
          ['<b>腎臟</b>', lines([['過濾血液，形成<b>尿液</b>', 'excretion', '泌尿系統'], ['調節尿量，維持<b>水分</b>恆定', 'excretion', '水分的恆定']])],
          ['<b>葉</b><br><small>' + W('（氣孔）') + '</small>', lines([['二氧化碳進入、氧離開：<b>光合作用</b>', 'photo', '氣孔'], ['水蒸氣散失：<b>蒸散作用</b>', 'plantflow', '蒸散作用'], ['氧進入、二氧化碳離開：<b>呼吸作用</b>', 'breath', '皮孔'], ['缺水時氣孔關閉，減少水分散失', 'excretion', '保衛細胞']])],
        ];
      } },

    { type: 'table', title: '名字裡有「管」的構造', cols: [[W('運送', '什麼'), '#9fd8ff'], ['說明', '#c9a7ff']],
      get rows() {
        return [
          [W('導管') + `<small>${W('（植物）')}</small>`, '<b>水</b>和' + W('礦物質'), `木質部，由下往上 ${chip('vascular', '導管')}`],
          [W('篩管') + `<small>${W('（植物）')}</small>`, W('葉製造的', '<b>養分</b>'), `韌皮部，可以往上也可以往下 ${chip('vascular', '篩管')}`],
          ['動脈', '血液', `離開心臟；管壁厚、有彈性 ${chip('heart', '管壁')}`],
          ['靜脈', '血液', `流回心臟；有瓣膜 ${chip('heart', '管壁')}`],
          ['微血管', '血液', `管壁只有一層細胞，在這裡<b>物質交換</b> ${chip('circulation', '物質交換')}`],
          ['淋巴管', '淋巴', `在鎖骨附近匯入靜脈，回到血液 ${chip('circulation', '淋巴')}`],
          ['乳糜管', W('脂肪酸', '和甘油'), `在小腸的絨毛裡 ${chip('digest', '乳糜管')}`],
          ['氣管', '空氣', `喉 → 氣管 → 支氣管 → 肺 ${chip('breath', '支氣管')}`],
          ['輸尿管', '尿液', `腎臟 → 膀胱 ${chip('excretion', '輸尿管')}`],
          ['輸卵管', W('卵、', '受精卵'), `精子和卵在這裡<b>受精</b> ${chip('sexual', '輸卵管')}`],
          [W('腺體的', '導管'), W('消化液、', '汗液等'), `外分泌腺才有；內分泌腺沒有導管 ${chip('endocrine', '外分泌腺')}`],
        ];
      },
      note: '同樣叫「<b>導管</b>」：植物的導管運輸水和礦物質；外分泌腺的導管送出分泌物。' },
  ];

  S.summaryLab({ id: 'compare', section: 'X-1', title: '跨章比較', heading: '跨章比較', done: '跨章的比較都掌握了。', MAP, QUIZ, CHARTS });
})();
