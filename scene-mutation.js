/* 七下 2-3 突變與遺傳疾病：突變是什麼、誘發突變的因子、體細胞與生殖細胞的突變、遺傳性疾病、隱性遺傳病的推算、預防 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const MUT = '#ff6b6b', OK = '#63d4bf', DOM = '#ffd166', REC = '#8fd3ff';

  // 單條染色體（未複製的樣子），bands：[y, 顏色]
  function rod(p, x, top, bot, w, color, bands = [], cf = 0.32) {
    const cg = g(p), cen = Math.max(top + w / 2 + 2, top + (bot - top) * cf), q = Math.min(10, (bot - top) * 0.12);
    const c1 = Math.max(top + w / 2, cen - q), c2 = Math.min(bot - w / 2, cen + q);
    el('path', { d: `M ${x - w / 2},${top + w / 2} A ${w / 2},${w / 2} 0 0,1 ${x + w / 2},${top + w / 2} L ${x + w / 2},${c1} Q ${x + w / 2 - w * 0.18},${cen} ${x + w / 2},${c2} L ${x + w / 2},${bot - w / 2} A ${w / 2},${w / 2} 0 0,1 ${x - w / 2},${bot - w / 2} L ${x - w / 2},${c2} Q ${x - w / 2 + w * 0.18},${cen} ${x - w / 2},${c1} Z`, fill: color, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }, cg);
    cg.bands = bands.map(([y, c, h = 16]) => el('rect', { x: x - w / 2 + 2, y: y - h / 2, width: w - 4, height: h, fill: c }, cg));
    return cg;
  }
  // 兔子（側面，朝右）：一般的和白化的
  function rabbit(p, x, y, s, albino) {
    const rg = S.place(g(p), { x, y, s });
    const fur = albino ? '#f4f1ec' : '#9a7350', furD = albino ? '#d9d2c8' : '#6f5036', belly = albino ? '#ffffff' : '#c9a882', ear = albino ? '#f5b8c4' : '#c99a8a';
    el('circle', { cx: -88, cy: -6, r: 16, fill: albino ? '#ffffff' : '#e8dccb', stroke: furD, 'stroke-width': 2 }, rg); // 尾巴
    el('ellipse', { cx: -38, cy: 8, rx: 56, ry: 50, fill: fur, stroke: furD, 'stroke-width': 2.5 }, rg); // 後半身
    el('ellipse', { cx: 10, cy: 10, rx: 62, ry: 44, fill: fur, stroke: furD, 'stroke-width': 2.5 }, rg); // 身體
    el('ellipse', { cx: 18, cy: 30, rx: 36, ry: 20, fill: belly, opacity: 0.6 }, rg);
    el('ellipse', { cx: -46, cy: 54, rx: 36, ry: 9, fill: furD }, rg); // 後腳
    el('ellipse', { cx: 52, cy: 52, rx: 14, ry: 8, fill: fur, stroke: furD, 'stroke-width': 2 }, rg); // 前腳
    // 耳朵（往上、稍微往後）
    [[44, -64, -14], [60, -66, 6]].forEach(([ex, ey, r]) => {
      el('ellipse', { cx: ex, cy: ey, rx: 11, ry: 34, fill: fur, stroke: furD, 'stroke-width': 2.5, transform: `rotate(${r} ${ex} ${ey})` }, rg);
      el('ellipse', { cx: ex, cy: ey + 2, rx: 5.5, ry: 25, fill: ear, transform: `rotate(${r} ${ex} ${ey})` }, rg);
    });
    el('ellipse', { cx: 66, cy: -18, rx: 32, ry: 28, fill: fur, stroke: furD, 'stroke-width': 2.5 }, rg); // 頭
    el('circle', { cx: 76, cy: -24, r: 6.5, fill: albino ? '#d0304a' : '#2a1a10' }, rg); // 眼睛（白化：紅色，因為沒有色素）
    el('circle', { cx: 78, cy: -26, r: 2, fill: '#fff' }, rg);
    el('ellipse', { cx: 96, cy: -12, rx: 4, ry: 3, fill: '#e58a9a' }, rg); // 鼻子
    el('path', { d: 'M 96,-9 Q 92,-3 88,-4', fill: 'none', stroke: furD, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, rg);
    return rg;
  }
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, w = 4) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p), hl = 10 + w * 2;
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hl * 0.6, y2: y2 - Math.sin(a) * hl * 0.6, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M${x2},${y2} L${x2 - hl * Math.cos(a - 0.42)},${y2 - hl * Math.sin(a - 0.42)} L${x2 - hl * Math.cos(a + 0.42)},${y2 - hl * Math.sin(a + 0.42)}Z`, fill: color }, ag);
    return ag;
  };
  // 細胞（有細胞核）；mut：細胞核裡有突變（紅點）
  const cell = (p, x, y, r, mut, fill = 'rgba(99,212,191,0.12)') => {
    const cg = g(p);
    el('circle', { cx: x, cy: y, r, fill, stroke: OK, 'stroke-width': 2 }, cg);
    el('circle', { cx: x, cy: y, r: r * 0.42, fill: 'rgba(167,150,255,0.45)', stroke: C.nucleus, 'stroke-width': 1.5 }, cg);
    if (mut) el('circle', { cx: x + r * 0.08, cy: y - r * 0.05, r: Math.max(3, r * 0.17), fill: MUT }, cg);
    return cg;
  };
  function geno(p, x, y, str, size = 30) {
    const t = el('text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'font-weight': 700, class: 'mono' }, p);
    for (const ch of str) { const s = el('tspan', { fill: ch === ch.toUpperCase() ? DOM : REC }, t); s.textContent = ch; }
    return t;
  }
  const sun = (p, x, y, r) => {
    const sg = g(p);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; el('line', { x1: x + Math.cos(a) * (r + 8), y1: y + Math.sin(a) * (r + 8), x2: x + Math.cos(a) * (r + 22), y2: y + Math.sin(a) * (r + 22), stroke: C.hi, 'stroke-width': 4, 'stroke-linecap': 'round' }, sg); }
    el('circle', { cx: x, cy: y, r, fill: C.hi }, sg);
    return sg;
  };

  S.register({
    id: 'mutation', section: '下2-3', title: '突變與遺傳疾病',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 突變：遺傳物質發生改變 =====
      const P0 = g(root);
      el('rect', { x: 30, y: 40, width: 420, height: 560, rx: 18, ...FRAME }, P0);
      text(P0, 240, 86, '基因在染色體上', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const ch0 = rod(P0, 240, 120, 540, 64, '#5f8fbf', [[180, 'rgba(13,24,34,0.5)'], [260, 'rgba(13,24,34,0.5)'], [360, OK, 30], [440, 'rgba(13,24,34,0.5)'], [500, 'rgba(13,24,34,0.5)']]);
      const geneBand = ch0.bands[2];
      text(P0, 286, 352, '控制黑色素', { 'font-size': 22, fill: OK });
      text(P0, 286, 384, '的基因', { 'font-size': 22, fill: OK });
      const mutL = g(P0, { opacity: 0 });
      S.pill(mutL, 240, 574, '這個基因改變了 → 突變', { size: 24, color: MUT, edge: MUT });
      // 右：兔子
      const R0 = g(P0);
      el('rect', { x: 480, y: 40, width: 690, height: 560, rx: 18, ...FRAME }, R0);
      rabbit(R0, 660, 300, 1.1, false);
      text(R0, 660, 440, '一般的兔子', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(R0, 660, 476, '能製造黑色素', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const alb = g(R0, { opacity: 0 });
      rabbit(alb, 990, 300, 1.1, true);
      text(alb, 990, 440, '白化的兔子', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffe0e6' });
      text(alb, 990, 476, '缺乏黑色素：毛白、眼睛紅', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const a0 = arrow(R0, 790, 300, 860, 300, MUT); a0.style.opacity = 0;
      const def0 = g(P0, { opacity: 0 });
      S.pill(def0, 600, 660, '突變：遺傳物質（基因或染色體）發生改變，性狀可能跟著改變', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s0');
      tl.fromTo(geneBand, { attr: { fill: OK } }, { attr: { fill: MUT }, duration: 0.6, immediateRender: false }, 's0+=1.4');
      S.show(tl, mutL, 's0+=1.8', 0.4);
      S.show(tl, a0, 's0+=2.4', 0.3);
      S.show(tl, alb, 's0+=2.7', 0.6);
      S.show(tl, def0, 's0+=3.8', 0.5);

      // ===== 1 誘發突變的因子 =====
      const P1 = g(root, { opacity: 0 });
      text(P1, 600, 60, '突變會自然發生，但機率很低；接觸某些因子，機率會大增', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const card = (x, w, title, col) => { const c = g(P1, { opacity: 0 }); el('rect', { x, y: 100, width: w, height: 470, rx: 18, ...FRAME }, c); S.pill(c, x + w / 2, 136, title, { size: 26, color: col, edge: col }); return c; };
      const phys = card(40, 720, '物理因子', '#ffb35c');
      const chem = card(790, 370, '化學因子', '#b9e68f');
      // 紫外線
      sun(phys, 160, 300, 46);
      text(phys, 160, 440, '紫外線', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(phys, 160, 474, '（強烈的陽光）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // X 光片
      el('rect', { x: 330, y: 220, width: 140, height: 170, rx: 8, fill: '#0a1218', stroke: '#9fb6c4', 'stroke-width': 3 }, phys);
      el('line', { x1: 400, y1: 240, x2: 400, y2: 372, stroke: '#cfe3ee', 'stroke-width': 6, opacity: 0.8 }, phys);
      for (let i = 0; i < 5; i++) [-1, 1].forEach((d) => el('path', { d: `M 400,${256 + i * 22} q ${d * 40},${-6} ${d * 54},${14}`, fill: 'none', stroke: '#cfe3ee', 'stroke-width': 3.5, opacity: 0.7 }, phys));
      text(phys, 400, 440, 'X 光', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(phys, 400, 474, '（檢查時穿防護衣）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 核輻射：警告標誌
      const tri = g(phys);
      el('path', { d: 'M 640,212 L 718,370 L 562,370 Z', fill: C.hi, stroke: '#0d1822', 'stroke-width': 4, 'stroke-linejoin': 'round' }, tri);
      el('circle', { cx: 640, cy: 316, r: 8, fill: '#0d1822' }, tri);
      [-90, 30, 150].forEach((a) => { const r1 = 14, r2 = 40, w = 30; const p = (ang, r) => [640 + Math.cos((ang * Math.PI) / 180) * r, 316 + Math.sin((ang * Math.PI) / 180) * r]; const [ax, ay] = p(a - w, r1), [bx, by] = p(a - w, r2), [cx, cy] = p(a + w, r2), [dx, dy] = p(a + w, r1); el('path', { d: `M ${ax},${ay} L ${bx},${by} A ${r2},${r2} 0 0,1 ${cx},${cy} L ${dx},${dy} A ${r1},${r1} 0 0,0 ${ax},${ay} Z`, fill: '#0d1822' }, tri); });
      text(phys, 640, 440, '核輻射', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(phys, 640, 474, '（輻射物質外洩）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 黃麴毒素：發霉的花生
      const pea = (x, y, r) => { const pg = S.place(g(chem), { x, y, r }); el('path', { d: 'M -34,0 C -34,-20 -14,-22 -6,-12 C 0,-6 4,-6 10,-12 C 18,-22 38,-18 38,0 C 38,18 18,22 10,12 C 4,6 0,6 -6,12 C -14,22 -34,20 -34,0 Z', fill: '#d9b77e', stroke: '#9c7a44', 'stroke-width': 2.5 }, pg); [[-22, -4], [-18, 8], [22, -6], [26, 6], [2, 0]].forEach(([a, b]) => el('circle', { cx: a, cy: b, r: 2, fill: '#9c7a44' }, pg)); return pg; };
      pea(930, 270, -15); pea(1010, 300, 20); pea(950, 340, 5);
      [[912, 262, 10], [1022, 292, 12], [962, 344, 9], [1000, 312, 7]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#8fae3c', opacity: 0.75 }, chem));
      text(chem, 975, 440, '黃麴毒素', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      text(chem, 975, 474, '（花生、玉米發霉）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(chem, 975, 530, '亞硝酸鹽等化學物質', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      const tip1 = g(P1, { opacity: 0 });
      S.pill(tip1, 600, 640, '這些因子會使突變發生的機率大增', { size: 26, color: C.hi, edge: C.hi });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.show(tl, phys, 's1+=0.8', 0.5);
      S.show(tl, chem, 's1+=2.2', 0.5);
      S.show(tl, tip1, 's1+=3.4', 0.5);

      // ===== 2 體細胞與生殖細胞的突變 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 40, width: 550, height: 520, rx: 18, ...FRAME }, P2);
      el('rect', { x: 620, y: 40, width: 550, height: 520, rx: 18, ...FRAME }, P2);
      text(P2, 305, 86, '體細胞的突變', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffb35c' });
      text(P2, 895, 86, '生殖細胞的突變', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      // 左：皮膚細胞
      sun(P2, 110, 160, 26);
      const rays = g(P2);
      [0, 1, 2].forEach((i) => el('line', { x1: 150 + i * 30, y1: 190, x2: 210 + i * 60, y2: 270, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.8 }, rays));
      el('rect', { x: 80, y: 280, width: 450, height: 12, fill: 'rgba(242,179,138,0.5)' }, P2);
      const skin = [];
      for (let i = 0; i < 7; i++) skin.push(cell(P2, 110 + i * 64, 330, 28, false, 'rgba(242,179,138,0.18)'));
      const mutSkin = cell(P2, 110 + 3 * 64, 330, 28, true, 'rgba(255,107,107,0.25)'); mutSkin.style.opacity = 0;
      text(P2, 305, 400, '皮膚細胞（體細胞）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const l2 = g(P2, { opacity: 0 });
      text(l2, 305, 450, '可能影響自己（例如皮膚癌）', { 'font-size': 24, 'text-anchor': 'middle' });
      text(l2, 305, 500, '不會遺傳給子代', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffb35c' });
      // 右：精子＋卵 → 受精卵 → 子代的細胞
      const R2 = g(P2);
      const spm = S.place(g(R2), { x: 708, y: 210, s: 1.45 });
      el('path', { d: 'M -14,0 C -26,-8 -36,8 -50,0', fill: 'none', stroke: '#cfe3ee', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, spm);
      el('ellipse', { cx: 0, cy: 0, rx: 13, ry: 9.5, fill: '#e8f4fa', stroke: '#cfe3ee', 'stroke-width': 2 }, spm);
      el('circle', { cx: 1, cy: 0, r: 4, fill: MUT }, spm);
      text(R2, 690, 252, '精子', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      el('circle', { cx: 800, cy: 210, r: 34, fill: 'rgba(255,214,170,0.22)', stroke: '#ffd9b0', 'stroke-width': 2.5 }, R2);
      el('circle', { cx: 800, cy: 210, r: 13, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 2 }, R2);
      text(R2, 800, 272, '卵', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(R2, 745, 218, '＋', { 'font-size': 26, 'text-anchor': 'middle', fill: C.ink2 });
      const a21 = arrow(R2, 850, 210, 900, 210);
      const zy = cell(R2, 950, 210, 34, true, 'rgba(255,214,170,0.18)');
      text(R2, 950, 272, '受精卵', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const kids2 = g(R2, { opacity: 0 });
      arrow(kids2, 950, 290, 950, 336);
      for (let i = 0; i < 9; i++) cell(kids2, 870 + (i % 5) * 40 + (i >= 5 ? 20 : 0), 362 + Math.floor(i / 5) * 38, 18, true);
      text(kids2, 1110, 376, '子代', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(kids2, 1110, 408, '每個細胞', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(kids2, 1110, 440, '都有', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const r2t = g(P2, { opacity: 0 });
      text(r2t, 895, 500, '可能遺傳給子代', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const eff2 = g(P2, { opacity: 0 });
      S.pill(eff2, 600, 610, '突變大多有害或沒有影響，少數對生物有利', { size: 24, color: C.ink, edge: '#4a6272' });
      S.pill(eff2, 600, 668, '人類可以篩選有利的變化來育種（例如不同品種的玉米、鯉魚）', { size: 24, color: C.membrane, edge: C.membrane });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      tl.fromTo(rays.children, { attr: { 'stroke-dashoffset': 36 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 2, ease: 'none', immediateRender: false }, 's2+=0.6');
      S.show(tl, mutSkin, 's2+=1.6', 0.4);
      S.show(tl, l2, 's2+=2.1', 0.4);
      S.show(tl, kids2, 's2+=3.2', 0.5);
      S.show(tl, r2t, 's2+=3.8', 0.4);
      S.show(tl, eff2, 's2+=4.6', 0.5);

      // ===== 3 遺傳性疾病 =====
      const P3 = g(root, { opacity: 0 });
      text(P3, 200, 64, '染色體數目異常', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffb35c' });
      text(P3, 780, 64, '來自親代的突變基因', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const dcard = (x, y, w, h) => { const c = g(P3, { opacity: 0 }); el('rect', { x, y, width: w, height: h, rx: 18, ...FRAME }, c); return c; };
      const dn = dcard(40, 90, 320, 560);
      text(dn, 200, 136, '唐氏症', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      [150, 200, 250].forEach((x, i) => rod(dn, x, 190, 330, 30, i === 2 ? '#ff9a8a' : '#a796ff', [[262, 'rgba(13,24,34,0.4)', 8], [300, 'rgba(13,24,34,0.4)', 8]], 0.2));
      text(dn, 200, 372, '第 21 號染色體', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(dn, 200, 402, '多了一條（3 條）', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff9a8a', 'font-weight': 700 });
      text(dn, 200, 470, '智力、反應較慢，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(dn, 200, 502, '有些器官發育不完全', { 'font-size': 22, 'text-anchor': 'middle' });
      text(dn, 200, 560, '良好的訓練和照顧，', { 'font-size': 22, 'text-anchor': 'middle', fill: C.membrane });
      text(dn, 200, 592, '能發揮潛能', { 'font-size': 22, 'text-anchor': 'middle', fill: C.membrane });
      const D = [[390, 90, '白化症'], [790, 90, '地中海型貧血'], [390, 375, '血友病'], [790, 375, '紅綠色盲']].map(([x, y, t]) => {
        const c = dcard(x, y, 380, 270);
        text(c, x + 190, y + 44, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
        return c;
      });
      // 白化症：缺乏黑色素
      const mel = (c, x, y, n) => { el('rect', { x: x - 60, y: y - 28, width: 120, height: 56, rx: 10, fill: n ? '#c99a6a' : '#f6ece2', stroke: '#9c7a44', 'stroke-width': 2 }, c); if (n) for (let i = 0; i < 9; i++) el('circle', { cx: x - 44 + (i % 5) * 22, cy: y - 10 + Math.floor(i / 5) * 20, r: 5, fill: '#5a3a22' }, c); };
      mel(D[0], 500, 180, true); mel(D[0], 660, 180, false);
      text(D[0], 500, 232, '一般', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }); text(D[0], 660, 232, '白化', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(D[0], 580, 286, '缺乏黑色素：皮膚、毛髮偏白', { 'font-size': 22, 'text-anchor': 'middle' });
      text(D[0], 580, 318, '眼睛怕光、容易曬傷', { 'font-size': 22, 'text-anchor': 'middle' });
      // 地中海型貧血：紅血球小、容易破
      const rbc = (c, x, y, r, odd) => { if (odd) el('path', { d: S.smoothPath(S.blobPts(x, y, r, r * 0.85, 16, [[3, 0.12, 0.4], [5, 0.08, 1]])), fill: '#d9465c', stroke: '#ff8f9f', 'stroke-width': 1.5 }, c); else { el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.92, fill: '#d9465c', stroke: '#ff8f9f', 'stroke-width': 1.5 }, c); el('ellipse', { cx: x, cy: y, rx: r * 0.45, ry: r * 0.38, fill: '#b02c44' }, c); } };
      rbc(D[1], 870, 178, 24, false); rbc(D[1], 930, 178, 24, false);
      [[1040, 170], [1072, 186], [1100, 168], [1056, 200]].forEach(([x, y]) => rbc(D[1], x, y, 13, true));
      text(D[1], 900, 232, '一般', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute }); text(D[1], 1070, 232, '小、容易破', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(D[1], 980, 286, '紅血球較小、容易破裂', { 'font-size': 22, 'text-anchor': 'middle' });
      text(D[1], 980, 318, '帶氧的能力變差 → 貧血', { 'font-size': 22, 'text-anchor': 'middle' });
      // 血友病：傷口血液不易凝固
      el('rect', { x: 440, y: 436, width: 280, height: 130, rx: 26, fill: 'rgba(242,179,138,0.35)' }, D[2]); // 皮膚
      el('path', { d: 'M 470,460 C 520,452 560,470 610,462', fill: 'none', stroke: '#c0394e', 'stroke-width': 5, 'stroke-linecap': 'round' }, D[2]);
      [[520, 486, 9], [560, 510, 10], [600, 488, 8], [540, 540, 10], [586, 548, 8]].forEach(([x, y, r]) => el('path', { d: `M ${x},${y - r * 1.6} C ${x + r},${y - r * 0.2} ${x + r},${y + r} ${x},${y + r} C ${x - r},${y + r} ${x - r},${y - r * 0.2} ${x},${y - r * 1.6} Z`, fill: '#d9465c' }, D[2]));
      text(D[2], 580, 600, '受傷出血時，血液不容易凝固', { 'font-size': 22, 'text-anchor': 'middle' });
      // 紅綠色盲：紅、綠不容易分辨
      [[880, '#d9463c'], [940, '#4caa48']].forEach(([x, c]) => el('circle', { cx: x, cy: 480, r: 24, fill: c }, D[3]));
      text(D[3], 910, 534, '一般', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      arrow(D[3], 978, 480, 1010, 480, C.mute, 3);
      [[1050, '#8f8a4a'], [1110, '#9a9550']].forEach(([x, c]) => el('circle', { cx: x, cy: 480, r: 24, fill: c }, D[3]));
      text(D[3], 1080, 534, '紅綠色盲看起來', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(D[3], 980, 600, '不容易分辨紅色和綠色', { 'font-size': 22, 'text-anchor': 'middle' });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, dn, 's3+=0.6', 0.5);
      D.forEach((c, i) => S.show(tl, c, `s3+=${1.6 + i * 0.6}`, 0.5));

      // ===== 4 隱性的遺傳性疾病：正常的父母也可能生下白化症的孩子 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 40, width: 440, height: 520, rx: 18, ...FRAME }, P4);
      text(P4, 250, 86, '譜系圖', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const sym = (x, y, male, filled) => male ? el('rect', { x: x - 26, y: y - 26, width: 52, height: 52, fill: filled ? '#8a9aa4' : '#0d1822', stroke: C.ink, 'stroke-width': 3.5 }, P4) : el('circle', { cx: x, cy: y, r: 28, fill: filled ? '#8a9aa4' : '#0d1822', stroke: C.ink, 'stroke-width': 3.5 }, P4);
      el('line', { x1: 176, y1: 200, x2: 322, y2: 200, stroke: C.ink2, 'stroke-width': 3 }, P4);
      el('line', { x1: 250, y1: 200, x2: 250, y2: 362, stroke: C.ink2, 'stroke-width': 3 }, P4);
      sym(150, 200, true, false); sym(350, 200, false, false); sym(250, 390, false, true);
      text(P4, 150, 150, '父親', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P4, 350, 150, '母親', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P4, 250, 450, '孩子：白化症', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ffe0e6' });
      const g4 = g(P4, { opacity: 0 });
      geno(g4, 150, 260, 'Aa', 30); geno(g4, 350, 260, 'Aa', 30); geno(g4, 250, 490, 'aa', 30);
      text(g4, 250, 532, '父母膚色正常，都帶有 a', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      // 棋盤方格
      const GX = 640, GY = 160, CS = 140;
      const grid4 = g(P4, { opacity: 0 });
      text(grid4, GX + CS, 70, '父親 Aa 的精子', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(grid4, GX - 70, GY - 20, '母親 Aa 的卵', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      ['A', 'a'].forEach((ch, j) => geno(grid4, GX + CS / 2 + j * CS, 126, ch, 34));
      ['A', 'a'].forEach((ch, i) => geno(grid4, GX - 40, GY + CS / 2 + i * CS + 12, ch, 34));
      for (let i = 0; i <= 2; i++) { el('line', { x1: GX, y1: GY + i * CS, x2: GX + 2 * CS, y2: GY + i * CS, stroke: '#4a6272', 'stroke-width': 3 }, grid4); el('line', { x1: GX + i * CS, y1: GY, x2: GX + i * CS, y2: GY + 2 * CS, stroke: '#4a6272', 'stroke-width': 3 }, grid4); }
      const cells4 = [['AA', '正常'], ['Aa', '正常'], ['Aa', '正常'], ['aa', '白化症']].map(([gt, ph], k) => {
        const c = g(P4, { opacity: 0 });
        const cx = GX + CS / 2 + (k % 2) * CS, cy = GY + Math.floor(k / 2) * CS;
        if (gt === 'aa') el('rect', { x: cx - CS / 2 + 4, y: cy + 4, width: CS - 8, height: CS - 8, rx: 8, fill: 'rgba(255,107,107,0.15)' }, c);
        geno(c, cx, cy + 62, gt, 36);
        text(c, cx, cy + 104, ph, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: gt === 'aa' ? '#ffb3c0' : C.ink2 });
        return c;
      });
      const res4 = g(P4, { opacity: 0 });
      text(res4, 1050, 260, '孩子是白化症', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink2 });
      text(res4, 1050, 310, '的機率 1/4', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(res4, 1050, 380, '要有兩個 a', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(res4, 1050, 410, '才會表現', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const law4 = g(P4, { opacity: 0 });
      S.pill(law4, 600, 616, '近親結婚，夫妻帶有相同隱性基因的機會較高 → 法律規定近親不能結婚', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.show(tl, g4, 's4+=1.2', 0.5);
      S.show(tl, grid4, 's4+=2', 0.5);
      cells4.forEach((c, i) => S.show(tl, c, `s4+=${2.6 + i * 0.5}`, 0.4));
      S.show(tl, res4, 's4+=4.8', 0.5);
      S.show(tl, law4, 's4+=5.6', 0.5);

      // ===== 5 預防 =====
      const P5 = g(root, { opacity: 0 });
      text(P5, 600, 64, '預防遺傳性疾病', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const pv = [[40, '遺傳諮詢'], [420, '婚前健康檢查'], [800, '產前檢查']].map(([x, t]) => {
        const c = g(P5, { opacity: 0 });
        el('rect', { x, y: 100, width: 360, height: 470, rx: 18, ...FRAME }, c);
        text(c, x + 180, 146, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
        return c;
      });
      // 遺傳諮詢：寫字板上的譜系圖
      el('rect', { x: 150, y: 190, width: 140, height: 180, rx: 10, fill: '#e8e2d8', stroke: '#9c8a6a', 'stroke-width': 3 }, pv[0]);
      el('rect', { x: 196, y: 180, width: 48, height: 20, rx: 6, fill: '#8a9aa4' }, pv[0]);
      const ps = (x, y, m, f) => m ? el('rect', { x: x - 11, y: y - 11, width: 22, height: 22, fill: f ? '#4a5560' : '#e8e2d8', stroke: '#2a3540', 'stroke-width': 2.5 }, pv[0]) : el('circle', { cx: x, cy: y, r: 12, fill: f ? '#4a5560' : '#e8e2d8', stroke: '#2a3540', 'stroke-width': 2.5 }, pv[0]);
      el('path', { d: 'M 192,240 L 248,240 M 220,240 L 220,280 M 190,280 L 250,280 M 190,280 L 190,300 M 250,280 L 250,300', fill: 'none', stroke: '#2a3540', 'stroke-width': 2.5 }, pv[0]);
      ps(180, 240, true, false); ps(260, 240, false, false); ps(190, 312, true, true); ps(250, 312, false, false);
      [0, 1].forEach((i) => el('line', { x1: 170, y1: 342 + i * 14, x2: 270, y2: 342 + i * 14, stroke: '#9c8a6a', 'stroke-width': 3 }, pv[0]));
      text(pv[0], 220, 430, '家族有遺傳性疾病時，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[0], 220, 462, '請醫師評估子女', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[0], 220, 494, '罹病的機率', { 'font-size': 22, 'text-anchor': 'middle' });
      // 婚前健康檢查：試管
      [0, 1, 2].forEach((i) => { const x = 550 + i * 50; el('rect', { x: x - 14, y: 200, width: 28, height: 150, rx: 13, fill: 'rgba(200,230,255,0.15)', stroke: '#cfe8ff', 'stroke-width': 2.5 }, pv[1]); el('rect', { x: x - 12, y: 280, width: 24, height: 68, rx: 11, fill: '#c0394e' }, pv[1]); el('rect', { x: x - 16, y: 192, width: 32, height: 14, rx: 4, fill: ['#62a8ff', '#ffd166', '#a796ff'][i] }, pv[1]); });
      el('rect', { x: 520, y: 330, width: 160, height: 18, rx: 4, fill: '#4a6272' }, pv[1]);
      text(pv[1], 600, 430, '結婚前檢查，了解', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[1], 600, 462, '自己是否帶有', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[1], 600, 494, '某些致病的基因', { 'font-size': 22, 'text-anchor': 'middle' });
      // 產前檢查：檢查胎兒的染色體
      el('rect', { x: 900, y: 190, width: 160, height: 160, rx: 12, fill: '#0a1218', stroke: '#9fb6c4', 'stroke-width': 3 }, pv[2]);
      [66, 60, 54, 48].forEach((h, k) => [-5, 5].forEach((d) => rod(pv[2], 925 + k * 38 + d, 285 - h, 285, 8, '#a796ff')));
      [34, 31, 28, 25, 22].forEach((h, k) => [-5, 5].forEach((d) => rod(pv[2], 920 + k * 30 + d, 338 - h, 338, 8, '#a796ff', [], 0.25)));
      text(pv[2], 980, 430, '懷孕時定期檢查，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[2], 980, 462, '及早發現胎兒是否有', { 'font-size': 22, 'text-anchor': 'middle' });
      text(pv[2], 980, 494, '先天的遺傳性疾病', { 'font-size': 22, 'text-anchor': 'middle' });
      const nb5 = g(P5, { opacity: 0 });
      S.pill(nb5, 600, 630, '寶寶出生後還有新生兒篩檢，及早發現、及早治療', { size: 24, color: C.membrane, edge: C.membrane });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      pv.forEach((c, i) => S.show(tl, c, `s5+=${0.6 + i * 0.8}`, 0.5));
      S.show(tl, nb5, 's5+=3.2', 0.5);

      return {
        tl,
        notes: [
          '＊示意：染色體上的基因位置是示意。白化的動物缺乏黑色素，眼睛看起來是紅的，是因為看得到血管的顏色。',
          '自然發生的突變機率非常低。X 光檢查時穿防護衣，是為了減少不需要檢查的部位受到照射。',
          '皮膚長時間被紫外線曬傷，可能使皮膚細胞突變成癌細胞，但這種突變不會遺傳給子女。',
          '血友病、紅綠色盲的基因在 X 染色體上，所以男性患者比較多（補充）。台灣常見的蠶豆症（G6PD 缺乏症）也是遺傳性疾病，新生兒篩檢會檢查（補充）。',
          '＊示意：譜系圖中 □ 代表男性、○ 代表女性，塗色代表患病。致病的等位基因大多是隱性；帶有一個 a 的人（Aa）通常沒有症狀。',
          '產前檢查例如超音波、抽取羊水檢查胎兒的染色體（羊膜穿刺，補充）。',
        ],
        steps: [
          '<b>突變</b>：遺傳物質（基因或染色體）發生改變。例如控制黑色素的基因突變，動物就會<b>白化</b>：缺乏黑色素，毛色變白。',
          '突變在自然狀態下也會發生，但<b>機率很低</b>。接觸<b>紫外線、X 光、核輻射</b>等物理因子，或<b>黃麴毒素</b>等化學物質，突變的機率會大增。',
          '<b>體細胞</b>的突變只影響自己，不會遺傳；<b>生殖細胞</b>（精子、卵）的突變，才<b>可能遺傳給子代</b>。突變大多有害或沒有影響，少數有利。',
          '<b>遺傳性疾病</b>：原因可能是<b>染色體數目異常</b>（例如<b>唐氏症</b>：第 21 號染色體多一條），或是來自親代的<b>突變基因</b>（白化症、地中海型貧血、血友病、紅綠色盲）。',
          '致病的基因大多是<b>隱性</b>：父母都是 <b>Aa</b>（正常），孩子是 <b>aa</b>（白化症）的機率是 <b>1/4</b>。近親結婚會提高這種機會。',
          '預防遺傳性疾病：<b>遺傳諮詢</b>、<b>婚前健康檢查</b>，懷孕時定期做<b>產前檢查</b>，及早發現、及早治療。',
        ],
      };
    },
  });
})();
