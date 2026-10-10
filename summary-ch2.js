/* 第三章總整理：資料（版面在 summary.js） */
(() => {
  const MAP = [
    ['3-1', '食物中的養分', ['六大類養分：醣類、蛋白質、脂質、維生素、礦物質、水', '能提供能量的是醣類、蛋白質（每公克約 4 大卡）和脂質（每公克約 9 大卡）；醣類是最主要的能量來源', '大分子要分解成小分子才能被吸收：澱粉 → 葡萄糖、蛋白質 → 胺基酸、脂肪 → 脂肪酸＋甘油', '檢測：澱粉遇碘液變藍黑色；葡萄糖加本氏液、隔水加熱，依含量由藍變綠、黃、橙、紅', '測量熱量：燃燒食物加熱水，熱量 ＝ 水的質量 × 上升的溫度（1 g 水上升 1 °C ＝ 1 卡）'], '本氏液要隔水加熱才會變色；砂糖（蔗糖）雖然甜，也不會讓本氏液變色。燃燒測得的熱量比包裝標示少，因為熱會散失'],
    ['3-2', '酵素', ['酵素能加快生物體內的化學反應，大多數是蛋白質', '專一性：一種酵素通常只對特定的物質作用（例如澱粉酶只分解澱粉）', '反應前後酵素本身不變，可以重複使用', '人體酵素在約 37 °C 作用最快；每種酵素有適合的酸鹼環境（胃液中的酵素適合酸性）'], '低溫只讓酵素作用變慢，回溫可以恢復；高溫使酵素被破壞，降溫也不能恢復。「溫度越高，酵素作用越快」是錯的'],
    ['3-3', '光合作用', ['在葉綠體中進行：二氧化碳 ＋ 水 →（光、葉綠體）→ 葡萄糖 ＋ 氧', '光能轉變成化學能，儲存在葡萄糖中；葡萄糖可轉變成澱粉儲存', '葉的構造：表皮（保護）、葉肉（含許多葉綠體）、葉脈（運輸）、氣孔（氣體進出，由保衛細胞控制）', '遮光實驗：熱水煮 → 酒精隔水加熱去除葉綠素 → 滴碘液；照光部分變藍黑色', '植物增加的質量主要來自二氧化碳和水；肥料主要提供礦物質，不是能量來源'], '放暗處一天是為了消耗葉片原有的澱粉；酒精易燃，要隔水加熱。水蘊草冒出的氣泡是氧（能使線香餘燼復燃）'],
    ['3-4', '消化與吸收', ['消化管：口腔 → 咽 → 食道 → 胃 → 小腸 → 大腸 → 肛門；消化腺：唾腺、胃腺、肝臟、胰臟、腸腺', '口腔：澱粉 → 麥芽糖；胃：蛋白質初步分解；小腸：三大類養分分解完成', '小腸絨毛吸收：葡萄糖、胺基酸 → 微血管；脂肪酸、甘油 → 乳糜管', '大腸吸收剩下的水分；殘渣由肛門排出（排遺）'], '膽汁由肝臟製造、儲存在膽囊，不含酵素，只能乳化脂質（物理性消化）'],
  ];
  const QUIZ = [
    ['下列哪一類養分「不能」提供能量？', ['醣類', '脂質', '維生素', '蛋白質'], 2, '醣類、蛋白質、脂質能提供能量；維生素、礦物質、水不提供能量，但能調節生理作用。', 'nutrients'],
    ['相同質量時，哪一種養分提供的能量最多？', ['醣類', '蛋白質', '脂質', '水'], 2, '每公克脂質約 9 大卡，醣類和蛋白質約 4 大卡。', 'nutrients'],
    ['某食物加碘液變藍黑色，加本氏液隔水加熱仍為藍色。它主要含有？', ['澱粉', '葡萄糖', '脂質', '蛋白質'], 0, '碘液變藍黑色 → 有澱粉；本氏液沒有變色 → 沒有檢測出葡萄糖。', 'lab-food'],
    ['燃燒 1 g 花生加熱 100 g 水，水溫上升 15 °C。水吸收了多少熱量？', ['15 卡', '1500 卡', '15 大卡', '150 大卡'], 1, '熱量 ＝ 水的質量 × 上升的溫度 ＝ 100 × 15 ＝ 1500 卡（＝ 1.5 大卡）。', 'lab-calorie'],
    ['用本氏液檢測葡萄糖，下列操作何者正確？', ['直接觀察，不必加熱', '要隔水加熱', '要放進冰箱', '要先加碘液'], 1, '本氏液要隔水加熱才會變色；葡萄糖越多，顏色越往黃、橙、紅變化。', 'lab-food'],
    ['唾液中的澱粉酶不能分解蛋白質，這表示酵素具有什麼特性？', ['專一性', '可以重複使用', '都是蛋白質', '只在高溫作用'], 0, '一種酵素通常只對特定的物質作用，稱為專一性。', 'enzyme'],
    ['把唾液和澱粉液放在 80 °C 一段時間，再移到 37 °C，澱粉會被分解嗎？', ['會，回到 37 °C 就恢復', '不會，酵素已被高溫破壞', '會，而且更快'], 1, '高溫使酵素被破壞，降溫也不能恢復；低溫只是讓酵素作用變慢。', 'lab-enzyme'],
    ['食物放冰箱比較不容易壞，主要原因是？', ['低溫破壞了所有酵素', '低溫讓微生物和酵素的作用變慢', '冰箱裡沒有空氣'], 1, '低溫使酵素作用變慢，並沒有破壞酵素；拿出來回溫後，作用又會變快。', 'lab-enzyme'],
    ['光合作用的原料是？', ['葡萄糖和氧', '二氧化碳和水', '澱粉和水', '氧和水'], 1, '二氧化碳 ＋ 水 →（光、葉綠體）→ 葡萄糖 ＋ 氧。', 'photo'],
    ['遮光實驗中，把葉片放入酒精「隔水加熱」，目的是？', ['破壞細胞', '溶出葉綠素，方便觀察顏色', '產生澱粉', '殺死細菌'], 1, '酒精能溶出葉綠素，葉片變成黃白色，滴碘液後比較容易看出顏色；酒精易燃，所以要隔水加熱。', 'photo'],
    ['一棵樹長大後增加的質量，主要來自哪裡？', ['土壤', '肥料', '空氣中的二氧化碳和水', '陽光'], 2, '光合作用把二氧化碳和水合成葡萄糖，再用來構成身體；陽光提供的是能量，肥料主要提供礦物質。', 'photo'],
    ['水蘊草在光下冒出的氣泡，能使線香的餘燼復燃，這種氣體是？', ['二氧化碳', '氧', '水蒸氣', '氮'], 1, '光合作用放出氧，氧能幫助燃燒，使餘燼復燃。', 'lab-photo'],
    ['蛋白質最早在哪裡開始被分解？', ['口腔', '胃', '小腸', '大腸'], 1, '胃液含有蛋白酶，在胃裡初步分解蛋白質；在小腸分解完成。', 'lab-digest'],
    ['關於膽汁，下列何者正確？', ['由膽囊製造', '含有分解脂質的酵素', '能把脂質乳化成小油滴', '在胃中作用'], 2, '膽汁由肝臟製造、儲存在膽囊，不含酵素，能把脂質乳化成小油滴。', 'digest'],
    ['脂肪酸和甘油被小腸絨毛吸收後，主要進入？', ['微血管', '乳糜管', '大腸', '食道'], 1, '葡萄糖、胺基酸進入微血管；脂肪酸和甘油進入乳糜管。', 'lab-digest'],
    ['大腸的主要功能是？', ['分解蛋白質', '吸收剩下的水分', '分泌膽汁', '吸收大部分的葡萄糖'], 1, '養分大多在小腸被吸收；大腸吸收剩下的水分，殘渣形成糞便排出。', 'digest'],
  ];

  const CHARTS = [
    { type: 'table', title: '六大類養分', cols: [['主要功能', ''], ['能量', '#ffd166'], ['檢測', '#62d0c0']],
      rows: [
        ['醣類', '最主要的能量來源', '約 4 大卡＊', '澱粉：<b>碘液</b><br>葡萄糖：<b>本氏液</b>'],
        ['蛋白質', '構成身體，<br>幫助生長和修補', '約 4 大卡＊', '—'],
        ['脂質', '儲存能量、保持體溫', '約 9 大卡＊<br><small>同質量時最多</small>', '紙片油斑<br><small>（補充）</small>'],
        ['維生素', '調節生理作用<br><small>例：缺維生素 C 會壞血病</small>', '不提供', '—'],
        ['礦物質', '調節生理作用<br><small>例：鈣構成骨骼和牙齒</small>', '不提供', '—'],
        ['水', '運送物質、調節體溫', '不提供', '—'],
      ], note: '＊每公克提供的能量，是常用的近似值（1 大卡 ＝ 1000 卡）。澱粉遇碘液變藍黑色；葡萄糖加本氏液要隔水加熱，依含量由藍變綠、黃、橙、紅。蛋白質用這兩種試劑都測不出來。', link: ['nutrients', 2] },
    { type: 'svg', title: '消化與吸收：養分在哪裡被分解？', w: 600, h: 476, link: ['digest', 3],
      note: '膽汁由肝臟製造、儲存在膽囊，不含酵素，只把脂質乳化成小油滴（物理性消化）。小腸是消化和吸收的主要場所。',
      draw(svg) {
        const { el, text, C } = S;
        const STA = C.sugar, PRO = '#ff8f8f', FAT = '#ffb35c', ENZ = '#62d0c0';
        const X = [250, 380, 510], NUT = [['澱粉', STA], ['蛋白質', PRO], ['脂質', FAT]];
        const band = (y, h) => el('rect', { x: 8, y, width: 584, height: h, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: '#2b4252', 'stroke-width': 2 }, svg);
        const arrowDown = (x, y, c) => el('path', { d: `M ${x - 7},${y - 7} L ${x},${y} L ${x + 7},${y - 7}`, fill: 'none', stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
        // 四段消化管
        [[56, 80], [146, 70], [226, 158], [394, 70]].forEach(([y, h]) => band(y, h));
        el('line', { x1: 24, y1: 316, x2: 576, y2: 316, stroke: '#2b4252', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
        [['口腔', '唾液', 88], ['胃', '胃液（酸性）', 173], ['小腸', '胰液、腸液、膽汁', 258]].forEach(([n, j, y]) => {
          text(svg, 24, y, n, { 'font-size': 22, 'font-weight': 700, fill: C.ink });
          text(svg, 24, y + 24, j, { 'font-size': 17, fill: ENZ });
        });
        text(svg, 24, 357, '絨毛吸收', { 'font-size': 19, 'font-weight': 700, fill: C.ink2 });
        text(svg, 24, 437, '大腸', { 'font-size': 22, 'font-weight': 700, fill: C.ink });
        text(svg, 185, 424, '吸收剩下的水分', { 'font-size': 20, 'font-weight': 700, fill: C.water });
        text(svg, 185, 450, '殘渣形成糞便，由肛門排出（排遺）', { 'font-size': 17, fill: C.mute });
        // 三種養分往下經過各段：虛線表示這一段沒有分解
        NUT.forEach(([n, c], i) => {
          const x = X[i];
          text(svg, x, 38, n, { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle', fill: c });
          el('line', { x1: x, y1: 48, x2: x, y2: 220, stroke: c, 'stroke-width': 2.5, 'stroke-dasharray': '4 6', opacity: 0.6 }, svg);
          [142, 222].forEach((y) => arrowDown(x, y, c));
        });
        const act = (x, y1, y2, w, c, lines) => {
          el('rect', { x: x - w / 2, y: y1, width: w, height: y2 - y1, rx: 10, fill: '#0f1c26', stroke: c, 'stroke-width': 2 }, svg);
          el('rect', { x: x - w / 2, y: y1, width: w, height: y2 - y1, rx: 10, fill: c, 'fill-opacity': 0.16 }, svg);
          lines.forEach(([s, f, b], k) => text(svg, x, y1 + 25 + k * 23, s, { 'font-size': 18, 'font-weight': b ? 700 : 400, 'text-anchor': 'middle', fill: f }));
        };
        act(X[0], 68, 124, 116, STA, [['部分分解', STA, 1], ['→ 麥芽糖', C.ink]]);
        act(X[1], 160, 202, 116, PRO, [['初步分解', PRO, 1]]);
        // 小腸：三大類都分解完成 → 最後產物
        [['葡萄糖', 100], ['胺基酸', 100], ['脂肪酸＋甘油', 130]].forEach(([p, w], i) => {
          const x = X[i], c = NUT[i][1];
          text(svg, x, 252, '分解完成', { 'font-size': 17, 'text-anchor': 'middle', fill: C.mute });
          el('rect', { x: x - w / 2, y: 264, width: w, height: 38, rx: 19, fill: '#0f1c26', stroke: c, 'stroke-width': 2.5 }, svg);
          text(svg, x, 290, p, { 'font-size': 19, 'font-weight': 700, 'text-anchor': 'middle', fill: c });
          el('line', { x1: x, y1: 306, x2: x, y2: 334, stroke: C.mute, 'stroke-width': 2.5 }, svg);
          arrowDown(x, 336, C.mute);
        });
        [['微血管', '#ff5f74'], ['微血管', '#ff5f74'], ['乳糜管', '#f3e6b0']].forEach(([s, c], i) => text(svg, X[i], 362, s, { 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle', fill: c }));
      } },
    { type: 'svg', title: '光合作用', w: 600, h: 390, link: ['photo', 2],
      note: '在葉綠體中進行，需要光（遮光的部分不會產生澱粉）。光能轉變成化學能，儲存在葡萄糖中；葡萄糖可轉變成澱粉儲存、用來構成身體，或經呼吸作用釋放能量。',
      draw(svg) {
        const { el, text, C } = S;
        const CHL = '#6fce62';
        const arrow = (x1, y1, x2, y2, c, dash) => {
          const a = Math.atan2(y2 - y1, x2 - x1), h = 11;
          el('line', { x1, y1, x2: x2 - Math.cos(a) * 4, y2: y2 - Math.sin(a) * 4, stroke: c, 'stroke-width': 3, 'stroke-dasharray': dash || null }, svg);
          el('path', { d: `M ${x2},${y2} L ${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L ${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} Z`, fill: c }, svg);
        };
        // 光能
        for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; el('line', { x1: 300 + Math.cos(a) * 26, y1: 44 + Math.sin(a) * 26, x2: 300 + Math.cos(a) * 34, y2: 44 + Math.sin(a) * 34, stroke: C.hi, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg); }
        el('circle', { cx: 300, cy: 44, r: 19, fill: C.hi }, svg);
        text(svg, 346, 52, '光能', { 'font-size': 22, 'font-weight': 700, fill: C.hi });
        text(svg, 254, 51, '條件', { 'font-size': 18, 'font-weight': 700, 'text-anchor': 'end', fill: C.mute });
        text(svg, 216, 111, '場所', { 'font-size': 18, 'font-weight': 700, fill: C.mute });
        arrow(300, 84, 300, 116, C.hi, '6 5');
        // 葉綠體（場所）
        el('rect', { x: 210, y: 120, width: 180, height: 118, rx: 18, fill: CHL, 'fill-opacity': 0.14, stroke: CHL, 'stroke-width': 2.5 }, svg);
        text(svg, 300, 160, '葉綠體', { 'font-size': 24, 'font-weight': 700, 'text-anchor': 'middle', fill: CHL });
        text(svg, 300, 188, '（主要在葉肉細胞）', { 'font-size': 17, 'text-anchor': 'middle', fill: C.ink2 });
        text(svg, 300, 220, '光能 → 化學能', { 'font-size': 18, 'text-anchor': 'middle', fill: C.hi });
        // 原料
        text(svg, 16, 108, '原料', { 'font-size': 18, 'font-weight': 700, fill: C.mute });
        text(svg, 16, 146, '二氧化碳', { 'font-size': 22, 'font-weight': 700, fill: C.co2 });
        text(svg, 16, 170, '從空氣經氣孔進入', { 'font-size': 17, fill: C.mute });
        text(svg, 16, 214, '水', { 'font-size': 22, 'font-weight': 700, fill: C.water });
        text(svg, 16, 238, '從根吸收、', { 'font-size': 17, fill: C.mute });
        text(svg, 16, 260, '經葉脈運來', { 'font-size': 17, fill: C.mute });
        arrow(162, 150, 204, 166, C.co2);
        arrow(52, 207, 204, 194, C.water);
        // 產物
        text(svg, 440, 108, '產物', { 'font-size': 18, 'font-weight': 700, fill: C.mute });
        text(svg, 440, 146, '葡萄糖', { 'font-size': 22, 'font-weight': 700, fill: C.sugar });
        text(svg, 440, 170, '可轉變成澱粉儲存', { 'font-size': 17, fill: C.mute });
        text(svg, 440, 214, '氧', { 'font-size': 22, 'font-weight': 700, fill: C.oxygen });
        text(svg, 440, 238, '經氣孔釋出', { 'font-size': 17, fill: C.mute });
        arrow(396, 166, 432, 150, C.sugar);
        arrow(396, 194, 432, 207, C.oxygen);
        // 反應式
        el('rect', { x: 16, y: 290, width: 568, height: 84, rx: 16, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, svg);
        text(svg, 130, 340, '二氧化碳 ＋ 水', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle', fill: C.ink });
        arrow(226, 332, 372, 332, C.ink);
        text(svg, 298, 320, '光', { 'font-size': 18, 'text-anchor': 'middle', fill: C.hi });
        text(svg, 298, 358, '葉綠體', { 'font-size': 18, 'text-anchor': 'middle', fill: CHL });
        text(svg, 470, 340, '葡萄糖 ＋ 氧', { 'font-size': 22, 'font-weight': 700, 'text-anchor': 'middle', fill: C.ink });
      } },
  ];

  S.summaryLab({ id: 'summary2', section: '總3', title: '知識地圖與自我檢測', heading: '第三章 知識地圖', done: '第三章的重點都掌握了。', MAP, QUIZ, CHARTS });
})();
