/* 1-3 科學方法：觀察 → 提出問題 → 形成假說 → 設計實驗（實驗組／對照組、三種變因）→ 進行實驗、記錄 → 分析 → 結論 */
(() => {
  const { el, g, text, C } = S;
  const VAR = { m: ['操縱變因', '#ffb35c'], c: ['控制變因', '#62a8ff'], r: ['應變變因', '#6fce62'] };

  // 麵包：mold 是 0～1 的發霉程度
  function bread(p, x, y, moldSeed) {
    const b = g(p);
    el('path', { d: `M ${x - 80},${y + 50} L ${x - 80},${y - 20} C ${x - 80},${y - 70} ${x + 80},${y - 70} ${x + 80},${y - 20} L ${x + 80},${y + 50} Z`, fill: '#e3b46a', stroke: '#a8742e', 'stroke-width': 5 }, b);
    el('path', { d: `M ${x - 66},${y + 40} L ${x - 66},${y - 14} C ${x - 66},${y - 52} ${x + 66},${y - 52} ${x + 66},${y - 14} L ${x + 66},${y + 40} Z`, fill: '#f6e2b0' }, b);
    const rnd = S.rng(moldSeed);
    // 黴斑只畫在麵包切面上
    const cid = 'breadClip' + (bread.n = (bread.n || 0) + 1);
    el('path', { d: `M ${x - 66},${y + 40} L ${x - 66},${y - 14} C ${x - 66},${y - 52} ${x + 66},${y - 52} ${x + 66},${y - 14} L ${x + 66},${y + 40} Z` }, el('clipPath', { id: cid }, el('defs', {}, b)));
    const sg = g(b, { 'clip-path': `url(#${cid})` });
    const spots = [];
    for (let i = 0; i < 14; i++) spots.push(el('circle', { cx: x - 50 + rnd() * 100, cy: y - 30 + rnd() * 64, r: 0, fill: i % 3 ? '#4f7a4a' : '#2f5a6a', opacity: 0.9 }, sg));
    b.mold = (m) => spots.forEach((s, i) => s.setAttribute('r', Math.max(0, (m * 14 - i) * 3 + (m > i / 14 ? 4 : 0)).toFixed(1)));
    b.mold(0);
    return b;
  }
  const dish = (p, x, y, wet) => {
    const d = g(p);
    el('ellipse', { cx: x, cy: y + 60, rx: 120, ry: 22, fill: '#2a3c4a', stroke: '#5f7f94', 'stroke-width': 3 }, d);
    if (wet) [[-40, -70], [10, -84], [50, -66], [-10, -60]].forEach(([dx, dy]) => el('path', { d: `M ${x + dx},${y + dy} q -7,12 0,18 q 7,-6 0,-18 Z`, fill: C.water }, d));
    return d;
  };

  S.register({
    id: 'method', section: '1-3', title: '科學方法',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 流程 =====
      const P0 = g(root);
      const FLOW = [['觀察', 170, 200], ['提出問題', 450, 200], ['形成假說', 730, 200], ['設計實驗', 1010, 200], ['進行實驗、記錄', 1010, 430], ['分析結果', 730, 430], ['得到結論', 450, 430]];
      const nodes = FLOW.map(([n, x, y], i) => {
        const b = g(P0);
        el('rect', { x: x - 115, y: y - 46, width: 230, height: 92, rx: 18, fill: '#122230', stroke: C.membrane, 'stroke-width': 3 }, b);
        // 編號放左上角、名稱稍微往下，長名稱（進行實驗、記錄）才不會碰到編號
        text(b, x - 100, y - 16, `${i + 1}`, { 'font-size': 22, fill: C.mute, class: 'mono' });
        text(b, x, y + 18, n, { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle' });
        return b;
      });
      const defs = el('defs', {}, root);
      const mk = el('marker', { id: 'mtArrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, defs);
      el('path', { d: 'M 0,0 L 10,5 L 0,10 Z', fill: C.mute }, mk);
      const ARW = ['M 290,200 L 330,200', 'M 570,200 L 610,200', 'M 850,200 L 890,200', 'M 1010,250 L 1010,380', 'M 890,430 L 850,430', 'M 610,430 L 570,430'];
      const arrows = ARW.map((d) => el('path', { d, stroke: C.mute, 'stroke-width': 4, fill: 'none', 'marker-end': 'url(#mtArrow)', opacity: 0 }, P0));
      const loop = g(P0, { opacity: 0 });
      // 從「得到結論」上方走兩排之間的空隙回到「形成假說」，不穿過「分析結果」
      el('path', { d: 'M 500,384 L 500,331 Q 500,315 516,315 L 684,315 Q 700,315 700,299 L 700,254', stroke: '#ff8f8f', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '10 8', 'marker-end': 'url(#mtArrow)' }, loop);
      S.pill(loop, 600, 315, '結果不支持假說 → 修正假說，再實驗', { size: 22, color: '#ff8f8f', edge: '#ff8f8f', bg: '#0d1822' });

      tl.addLabel('s0');
      nodes.forEach((n, i) => { tl.fromTo(n, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35 }, `s0+=${0.2 + i * 0.4}`); if (i) tl.to(arrows[i - 1], { opacity: 1, duration: 0.2 }, `s0+=${0.1 + i * 0.4}`); });
      S.show(tl, loop, 's0+=3.2', 0.5);

      // ===== 1 觀察與問題 =====
      const P1 = g(root, { opacity: 0 });
      dish(P1, 320, 360, true); const bWet = bread(P1, 320, 360, 3);
      dish(P1, 760, 360, false); const bDry = bread(P1, 760, 360, 8);
      text(P1, 320, 500, '放在潮溼的地方', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      text(P1, 760, 500, '放在乾燥的地方', { 'font-size': 24, 'text-anchor': 'middle', fill: C.mute });
      const q1 = g(P1, { opacity: 0 });
      el('rect', { x: 330, y: 560, width: 540, height: 80, rx: 40, fill: '#122230', stroke: C.hi, 'stroke-width': 3 }, q1);
      text(q1, 600, 610, '問題：水分會影響麵包發霉嗎？', { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: C.hi });
      text(P1, 600, 140, '觀察：潮溼的麵包好像比較快發霉', { 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle' });

      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.5);
      S.drive(tl, (u) => { bWet.mold(u * 0.8); bDry.mold(u * 0.2); }, 2, 's1+=0.8');
      S.show(tl, q1, 's1+=2.6', 0.5);

      // ===== 2 假說 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 200, y: 180, width: 800, height: 140, rx: 22, fill: 'rgba(255,209,102,0.08)', stroke: C.hi, 'stroke-width': 3 }, P2);
      text(P2, 600, 235, '假說', { 'font-size': 28, fill: C.hi, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P2, 600, 285, '水分多的麵包，比較容易發霉', { 'font-size': 34, 'font-weight': 700, 'text-anchor': 'middle' });
      const good = g(P2, { opacity: 0 });
      [['根據觀察和已知的知識提出', 400], ['可以用實驗來檢驗', 470], ['是「暫時的答案」，實驗結果可能支持或不支持它', 540]].forEach(([t, y]) => {
        el('path', { d: `M 250,${y - 6} l 10,11 l 20,-24`, stroke: C.chloro, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, good);
        text(good, 300, y + 4, t, { 'font-size': 28 });
      });

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      tl.fromTo(good.children, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1 }, 's2+=1');
      S.show(tl, good, 's2+=1', 0.01);

      // ===== 3 設計實驗 =====
      const P3 = g(root, { opacity: 0 });
      dish(P3, 260, 330, true); bread(P3, 260, 330, 3);
      dish(P3, 640, 330, false); bread(P3, 640, 330, 8);
      S.pill(P3, 260, 160, '實驗組：滴水', { size: 26, color: VAR.m[1], edge: VAR.m[1] });
      S.pill(P3, 640, 160, '對照組：不滴水', { size: 26, color: C.ink, edge: '#3d5666' });
      text(P3, 450, 480, '兩組只有「滴不滴水」不同', { 'font-size': 26, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const vbox = (y, kind, body) => {
        const b = g(P3, { opacity: 0 });
        el('rect', { x: 850, y, width: 320, height: 150, rx: 16, fill: '#122230', stroke: VAR[kind][1], 'stroke-width': 3 }, b);
        text(b, 870, y + 38, VAR[kind][0], { 'font-size': 26, 'font-weight': 700, fill: VAR[kind][1] });
        body.forEach((t, i) => text(b, 870, y + 78 + i * 32, t, { 'font-size': 22 }));
        return b;
      };
      const vb = [vbox(120, 'm', ['刻意改變的條件：', '有沒有滴水']), vbox(290, 'c', ['保持相同：麵包種類、大小、', '溫度、放置時間、容器']), vbox(460, 'r', ['觀察記錄的結果：', '麵包發霉的面積'])];

      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      vb.forEach((b, i) => S.show(tl, b, `s3+=${1 + i * 0.7}`, 0.4));

      // ===== 4 進行實驗、記錄 =====
      const P4 = g(root, { opacity: 0 });
      dish(P4, 200, 300, true); const e1 = bread(P4, 200, 300, 3);
      dish(P4, 200, 520, false); const e2 = bread(P4, 200, 520, 8);
      text(P4, 360, 300, '實驗組', { 'font-size': 24, fill: VAR.m[1] });
      text(P4, 360, 520, '對照組', { 'font-size': 24, fill: C.mute });
      // 長條圖：每天的發霉面積（示意數據）
      const X0 = 520, Y0 = 600, BW = 46;
      el('line', { x1: X0, y1: Y0, x2: 1160, y2: Y0, stroke: '#4a6272', 'stroke-width': 2 }, P4);
      el('line', { x1: X0, y1: Y0, x2: X0, y2: 180, stroke: '#4a6272', 'stroke-width': 2 }, P4);
      text(P4, X0 - 10, 170, '發霉面積（%）', { 'font-size': 20, fill: C.mute });
      [0, 50, 100].forEach((v) => { const y = Y0 - v * 3.8; el('line', { x1: X0, y1: y, x2: 1160, y2: y, stroke: '#22333d', 'stroke-width': 1 }, P4); text(P4, X0 - 10, y + 6, `${v}`, { 'font-size': 18, fill: C.mute, 'text-anchor': 'end', class: 'mono' }); });
      const WET = [0, 5, 20, 45, 70, 90], DRY = [0, 0, 3, 8, 15, 22];
      const bars = [];
      for (let d = 0; d < 6; d++) {
        const x = X0 + 30 + d * 105;
        text(P4, x + BW, Y0 + 28, `第 ${d + 1} 天`, { 'font-size': 18, fill: C.mute, 'text-anchor': 'middle' });
        bars.push([el('rect', { x, y: Y0, width: BW - 4, height: 0, rx: 4, fill: VAR.m[1] }, P4), el('rect', { x: x + BW, y: Y0, width: BW - 4, height: 0, rx: 4, fill: '#7f95a4' }, P4)]);
      }
      const legend = g(P4);
      el('rect', { x: 940, y: 134, width: 18, height: 18, rx: 3, fill: VAR.m[1] }, legend); text(legend, 966, 151, '實驗組（滴水）', { 'font-size': 22 });
      el('rect', { x: 940, y: 168, width: 18, height: 18, rx: 3, fill: '#7f95a4' }, legend); text(legend, 966, 185, '對照組（不滴水）', { 'font-size': 22 });
      const grow = (u) => {
        const t = u * 6;
        bars.forEach(([a, b], d) => {
          const k = S.clamp(t - d, 0, 1);
          const ha = WET[d] * 3.8 * k, hb = DRY[d] * 3.8 * k;
          a.setAttribute('height', ha); a.setAttribute('y', Y0 - ha);
          b.setAttribute('height', hb); b.setAttribute('y', Y0 - hb);
        });
        const day = Math.min(5, Math.floor(t));
        e1.mold(WET[day] / 100 + 0.05 * (t - day)); e2.mold(DRY[day] / 100);
      };
      grow(0);

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.drive(tl, grow, 4, 's4+=0.8');

      // ===== 5 分析與結論 =====
      const P5 = g(root, { opacity: 0 });
      const res = g(P5);
      el('rect', { x: 150, y: 140, width: 900, height: 120, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, res);
      text(res, 180, 190, '分析：滴水的麵包發霉面積一天比一天大，從第 2 天起都比不滴水的大。', { 'font-size': 26 });
      text(res, 180, 232, '結論：實驗結果支持假說——水分多的麵包比較容易發霉。', { 'font-size': 26, fill: C.chloro, 'font-weight': 700 });
      const tips = g(P5, { opacity: 0 });
      [['每組多放幾片、重複實驗，結論比較可靠', 330], ['結果不支持假說也有價值：修正假說，再設計實驗', 400], ['結論只適用於實驗的條件（例如這種麵包、這個溫度）', 470]].forEach(([t, y]) => {
        el('circle', { cx: 190, cy: y - 8, r: 8, fill: C.hi }, tips);
        text(tips, 215, y, t, { 'font-size': 26 });
      });

      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.5);
      tl.fromTo(res, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 's5+=0.5');
      S.show(tl, tips, 's5+=1.4', 0.5);
      tl.fromTo(tips.children, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.15 }, 's5+=1.4');

      return {
        tl,
        notes: [
          '＊各版本課本的步驟寫法略有不同（有的會加上「蒐集資料」），重點是：先有可檢驗的假說，再用公平的實驗檢驗。結果不支持假說，就修正假說再實驗。',
          null, null,
          '＊實驗組與對照組之間，只能有一個條件（操縱變因）不同。',
          '＊示意數據：數字只是示範用，不是真實測量結果。',
          null,
        ],
        steps: [
          '科學方法的流程：<b>觀察 → 提出問題 → 形成假說 → 設計實驗 → 進行實驗、記錄 → 分析結果 → 得到結論</b>。',
          '<b>觀察</b>：放在潮溼地方的麵包好像比較快發霉。於是<b>提出問題</b>：水分會影響麵包發霉嗎？',
          '<b>形成假說</b>：根據觀察提出一個可以用實驗檢驗的「暫時答案」——水分多的麵包比較容易發霉。實驗結果可能支持它，也可能不支持它。',
          '<b>設計實驗</b>：<b>實驗組</b>滴水、<b>對照組</b>不滴水。改變的條件叫<b>操縱變因</b>；保持相同的叫<b>控制變因</b>；要觀察記錄的結果叫<b>應變變因</b>。',
          '<b>進行實驗並記錄</b>：每天記錄兩組麵包發霉的面積，畫成圖表比較。',
          '<b>分析與結論</b>：實驗組發霉得比較多，結果支持假說。每組多放幾片、重複實驗，結論比較可靠。',
        ],
      };
    },
  });
})();
