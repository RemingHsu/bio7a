/* 4-3 心臟、血管與血液：循環系統、心臟的四個腔室與瓣膜（收縮與舒張）、心壁厚度、動脈／微血管／靜脈、血液的組成、心跳與脈搏、開放式與閉鎖式循環 */
(() => {
  const { el, g, text, C } = S;
  const ART = '#ff5f74', VEIN = '#8f9cff', BLOOD = '#8c1c2e', MUSC = '#d9707f', MUSC_E = '#ffb3bf', VALVE = '#ffe9a8';
  const RBC = '#e0384c', PLASMA = '#f3d37a';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  // 心臟外觀的小圖（面對面：心尖在畫面右下）；原點約在中央，大小約 ±65
  function heartIcon(p, sw = 3) {
    const hg = g(p);
    el('path', { d: 'M -34,-34 L -34,-66', stroke: '#8f9cff', 'stroke-width': 13, 'stroke-linecap': 'round' }, hg);
    el('path', { d: 'M -4,-40 C -8,-64 10,-76 28,-72 C 44,-68 48,-54 44,-38', fill: 'none', stroke: '#ff5f74', 'stroke-width': 14, 'stroke-linecap': 'round' }, hg);
    el('path', { d: 'M -42,-30 C -64,-22 -68,12 -56,36 C -42,62 -4,80 32,86 C 54,64 68,30 64,0 C 60,-26 42,-44 16,-44 C -6,-44 -26,-38 -42,-30 Z', fill: '#d9475c', stroke: '#ffd0d8', 'stroke-width': sw, 'stroke-linejoin': 'round' }, hg);
    el('path', { d: 'M 10,-40 C 4,-58 -12,-62 -24,-56', fill: 'none', stroke: '#9b8cff', 'stroke-width': 12, 'stroke-linecap': 'round' }, hg);
    el('path', { d: 'M 2,-30 C 8,6 20,46 30,80', fill: 'none', stroke: '#a32a3c', 'stroke-width': 3, opacity: 0.8 }, hg);
    return hg;
  }
  const polyAt = (pts) => {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const T = L[L.length - 1];
    return (t) => {
      const s = S.clamp(t) * T;
      let i = 1;
      while (i < L.length - 1 && L[i] < s) i++;
      const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return [S.lerp(pts[i - 1][0], pts[i][0], f), S.lerp(pts[i - 1][1], pts[i][1], f)];
    };
  };
  // 先畫所有外框、再畫所有填色：相連的部位（手掌、手指…）合成一個乾淨的輪廓
  // parts：{ d } 是路徑；[x1, y1, x2, y2, 寬] 是圓頭的粗線（手指）
  const blob = (p, parts, fill, edge, sw = 2) => {
    parts.forEach((q) => (q.d ? el('path', { d: q.d, fill: edge, stroke: edge, 'stroke-width': sw * 2, 'stroke-linejoin': 'round' }, p)
      : el('line', { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: edge, 'stroke-width': q[4] + sw * 2, 'stroke-linecap': 'round' }, p)));
    parts.forEach((q) => (q.d ? el('path', { d: q.d, fill }, p)
      : el('line', { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: fill, 'stroke-width': q[4], 'stroke-linecap': 'round' }, p)));
  };
  const dot = (p, r = 7, fill = RBC) => el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 1 }, p);
  const put = (e, [x, y], op = 1) => { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.style.opacity = op; };
  const arrow = (p, x1, y1, x2, y2, color, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };

  // ---------- 心臟剖面（面對面：畫面左邊是人的右邊） ----------
  // 右半邊（缺氧血）藍紫色、左半邊（充氧血）紅色；左心室壁最厚
  const RB = '#5b4a9c', LB = '#b3283d', V_EDGE = '#e9c4cc';
  function heartDiagram(p) {
    const h = g(p);
    const vessel = (d, color, w) => { el('path', { d, fill: 'none', stroke: V_EDGE, 'stroke-width': w + 6 }, h); return el('path', { d, fill: 'none', stroke: color, 'stroke-width': w }, h); };
    // 血管（在心肌後面）：主動脈弓、下大靜脈、肺靜脈
    vessel('M 640,215 L 640,140 C 640,98 688,86 730,90 C 780,94 806,120 808,150 L 808,176', LB, 36); // 主動脈弓：往下的一段藏在肺動脈後面
    vessel('M 420,338 C 398,360 382,392 378,440 L 376,526', RB, 34);
    vessel('M 962,262 L 836,280', LB, 26);
    vessel('M 962,316 L 838,318', LB, 26);
    // 肺動脈：主幹往上，分成兩條到左右兩肺（從主動脈前面、上大靜脈後面經過）
    vessel('M 575,215 L 575,166', RB, 38);
    vessel('M 575,168 C 540,160 470,160 384,164', RB, 30);
    vessel('M 575,168 C 640,162 760,170 930,176', RB, 30);
    vessel('M 452,92 L 452,236', RB, 40); // 上大靜脈
    // 心肌
    h.outline = el('path', { d: 'M 470,205 C 430,205 395,240 395,290 C 395,340 405,385 430,430 C 470,505 560,590 715,655 C 790,600 845,520 852,420 C 857,360 850,310 838,270 C 825,232 800,212 765,208 Z', fill: MUSC, stroke: MUSC_E, 'stroke-width': 3, 'stroke-linejoin': 'round' }, h);
    // 腔室
    h.ra = el('path', { d: 'M 470,222 C 432,222 412,252 412,292 C 412,326 420,346 434,358 L 545,358 L 545,226 C 525,222 500,222 470,222 Z', fill: RB }, h);
    h.la = el('path', { d: 'M 668,226 L 668,358 L 822,358 C 834,330 838,298 830,270 C 820,240 798,224 768,222 C 728,220 698,222 668,226 Z', fill: LB }, h);
    h.rv = el('path', { d: 'M 440,392 L 600,392 L 604,500 C 598,548 566,566 530,552 C 488,534 458,488 444,436 Z', fill: RB }, h);
    h.lv = el('path', { d: 'M 632,392 L 798,392 C 806,450 792,512 760,556 C 732,592 694,604 672,584 C 650,562 638,510 634,450 Z', fill: LB }, h);
    // 血管進出腔室的通道（畫在心肌上面）
    const throat = (d, color, w) => el('path', { d, fill: 'none', stroke: color, 'stroke-width': w }, h);
    throat('M 452,196 L 452,240', RB, 34);
    throat('M 426,334 L 404,356', RB, 30);
    throat('M 846,281 L 822,284', LB, 22);
    throat('M 848,317 L 822,318', LB, 22);
    throat('M 562,430 C 570,412 575,384 575,200', RB, 34);
    throat('M 652,430 C 646,412 640,384 640,200', LB, 34);
    // 房室之間的開口
    el('rect', { x: 456, y: 354, width: 94, height: 42, fill: RB }, h);
    el('rect', { x: 684, y: 354, width: 92, height: 42, fill: LB }, h);
    // 血流方向的小箭頭
    h.chev = g(h, { opacity: 0 });
    const chev = (x, y, ang) => el('path', { d: 'M -7,-8 L 5,0 L -7,8', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: `translate(${x},${y}) rotate(${ang})`, opacity: 0.85 }, h.chev);
    [[452, 130, 90], [380, 470, -90], [430, 162, 180], [880, 175, 0], [640, 170, -90], [808, 136, 90], [910, 269, 172], [910, 316, 180]].forEach(([x, y, a]) => chev(x, y, a));
    // 瓣膜：房室之間（打開時往下）、心室和動脈之間（打開時往上）
    const flap = (hx, hy, len) => ({ e: el('line', { x1: hx, y1: hy, x2: hx, y2: hy, stroke: VALVE, 'stroke-width': 6, 'stroke-linecap': 'round' }, h), hx, hy, len });
    h.av = [flap(456, 375, 47), flap(550, 375, 47), flap(684, 375, 46), flap(776, 375, 46)];
    h.sl = [flap(558, 404, 17), flap(592, 404, 17), flap(623, 404, 17), flap(657, 404, 17)];
    // open：0 關、1 開
    h.set = (avOpen, slOpen) => {
      h.av.forEach((f, i) => { const a = (i % 2 ? Math.PI : 0) + (i % 2 ? -1 : 1) * avOpen * 1.35; f.e.setAttribute('x2', f.hx + Math.cos(a) * f.len); f.e.setAttribute('y2', f.hy + Math.sin(a) * f.len); });
      h.sl.forEach((f, i) => { const a = (i % 2 ? Math.PI : 0) - (i % 2 ? -1 : 1) * slOpen * 1.35; f.e.setAttribute('x2', f.hx + Math.cos(a) * f.len); f.e.setAttribute('y2', f.hy + Math.sin(a) * f.len); });
    };
    h.set(0, 0);
    [['右心房', 478, 300], ['左心房', 752, 300], ['右心室', 520, 480], ['左心室', 712, 490]].forEach(([s, x, y]) => text(h, x, y, s, { 'font-size': 26, 'text-anchor': 'middle', fill: '#fff', 'font-weight': 700 }));
    // 血管名稱
    const vn = (x, y, s, c, anchor = 'middle') => text(h, x, y, s, { 'font-size': 20, 'text-anchor': anchor, fill: c });
    vn(452, 82, '上大靜脈', '#c9b8ff');
    vn(376, 552, '下大靜脈', '#c9b8ff');
    vn(376, 150, '肺動脈（往肺）', '#c9b8ff', 'end');
    vn(940, 160, '肺動脈（往肺）', '#c9b8ff', 'start');
    vn(840, 92, '主動脈（往全身）', '#ffb3bf', 'start'); // 放在主動脈弓右邊：放在弓上方會碰到弓的外緣
    vn(972, 296, '肺靜脈', '#ffb3bf', 'start');
    // 圖例
    const lg = g(h);
    el('circle', { cx: 990, cy: 612, r: 9, fill: RB }, lg); text(lg, 1006, 619, '缺氧血', { 'font-size': 20, fill: C.ink2 });
    el('circle', { cx: 990, cy: 646, r: 9, fill: LB }, lg); text(lg, 1006, 653, '充氧血', { 'font-size': 20, fill: C.ink2 });
    return h;
  }

  S.register({
    id: 'heart', section: '4-3', title: '心臟、血管與血液',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 循環系統 =====
      const P0 = g(root);
      const body = S.place(g(P0), { x: 300 - 600 * 0.95, y: 10 - 60 * 0.95, s: 0.95 });
      S.human(body, { fill: 'rgba(44,82,104,0.35)', stroke: C.bodyEdge, sw: 2 });
      const VD = ['M 610,232 L 606,200 C 606,170 602,150 600,112', 'M 606,196 C 640,184 676,200 684,256 C 690,320 698,372 706,410', 'M 600,196 C 560,184 524,200 516,256 C 510,320 502,372 494,410', 'M 612,246 L 608,390 C 608,420 620,450 625,520 C 628,600 622,650 620,690', 'M 608,390 C 600,420 582,450 576,520 C 572,600 578,650 580,690'];
      const arts = VD.map((d) => el('path', { d, fill: 'none', stroke: ART, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, body));
      const veins = VD.map((d) => el('path', { d, fill: 'none', stroke: VEIN, 'stroke-width': 3.2, 'stroke-linecap': 'round', transform: 'translate(-7,2)' }, body));
      const hb0 = S.place(g(body), { x: 612, y: 236, s: 0.3 });
      heartIcon(hb0, 4);
      const flowA = Array.from({ length: 10 }, () => dot(body, 3.2, '#ffd0d8'));
      const flowV = Array.from({ length: 10 }, () => dot(body, 3.2, '#d6dcff'));
      const coH = S.callout(P0, 300 + 12 * 0.95, 10 + (236 - 60) * 0.95, 120, 140, '心臟', '#ff8a9a', { size: 24 });
      const coV = S.callout(P0, 300 + 90 * 0.95, 10 + (330 - 60) * 0.95, 480, 300, '血管', ART, { size: 24 });
      const coB = S.callout(P0, 300 + 25 * 0.95, 10 + (560 - 60) * 0.95, 490, 520, '血液在血管中流動', '#ffd0d8', { size: 22 });
      const cards0 = [
        ['心臟', '推動血液，在全身循環流動', '#ff8a9a'],
        ['血管', '血液流動的管道：動脈、微血管、靜脈', ART],
        ['血液', '運送氧、養分、二氧化碳和廢物等', '#ffd0d8'],
      ].map(([t, s, c], i) => {
        const cg = g(P0, { opacity: 0 }), y = 130 + i * 160;
        el('rect', { x: 640, y, width: 520, height: 130, rx: 16, ...FRAME }, cg);
        text(cg, 670, y + 52, t, { 'font-size': 32, fill: c, 'font-weight': 700 });
        text(cg, 670, y + 98, s, { 'font-size': 24, fill: C.ink });
        return cg;
      });
      const sys0 = g(P0, { opacity: 0 });
      S.pill(sys0, 900, 64, '循環系統 ＝ 心臟 ＋ 血管 ＋ 血液', { size: 28, color: C.hi, edge: C.hi });
      const aL = arts.map((a) => a.getTotalLength()), vL = veins.map((v) => v.getTotalLength());
      tl.addLabel('s0');
      S.drive(tl, (u) => {
        S.place(hb0, { x: 612, y: 236, s: 0.3 * (1 - 0.12 * Math.max(0, Math.sin(u * 6.283 * 7))) });
        flowA.forEach((d, i) => { const k = (u * 2.2 + i / 10) % 1, a = arts[i % 5], q = a.getPointAtLength(aL[i % 5] * k); put(d, [q.x, q.y], u > 0 && u < 1 ? 1 : 0); });
        flowV.forEach((d, i) => { const k = (u * 2.2 + i / 10) % 1, v = veins[i % 5], q = v.getPointAtLength(vL[i % 5] * (1 - k)); put(d, [q.x - 7, q.y + 2], u > 0 && u < 1 ? 1 : 0); });
      }, 7, 's0+=0.2', 'none');
      [coH, coV, coB].forEach((c, i) => S.show(tl, c, `s0+=${0.6 + i * 0.6}`, 0.35));
      cards0.forEach((c, i) => S.show(tl, c, `s0+=${2.4 + i * 0.7}`, 0.4));
      S.show(tl, sys0, 's0+=4.6', 0.5);

      // ===== 1 心臟的四個腔室與瓣膜 =====
      const P1 = g(root, { opacity: 0 });
      const H1 = heartDiagram(P1);
      S.pill(P1, 600, 30, '面對面看：畫面的左邊，是這個人的右邊', { size: 22, color: C.hi, edge: C.hi });
      text(P1, 200, 430, '人的右邊', { 'font-size': 26, 'text-anchor': 'middle', fill: C.mute, 'font-weight': 700 });
      text(P1, 1000, 430, '人的左邊', { 'font-size': 26, 'text-anchor': 'middle', fill: C.mute, 'font-weight': 700 });
      const io1 = H1.chev; // 血流方向的小箭頭
      const room1 = g(P1, { opacity: 0 });
      S.pill(room1, 160, 560, '心房：接受流回心臟的血液', { size: 22, color: C.ink, edge: '#4a6272' });
      S.pill(room1, 1040, 560, '心室：把血液送出心臟', { size: 22, color: C.ink, edge: '#4a6272' });
      const vco = [S.callout(P1, 470, 375, 200, 330, '瓣膜', VALVE, { size: 24 }), S.callout(P1, 566, 404, 200, 330, '瓣膜', VALVE, { size: 24 })];
      const one1 = g(P1, { opacity: 0 });
      S.pill(one1, 600, 690, '瓣膜只朝一個方向打開，防止血液倒流', { size: 24, color: VALVE, edge: VALVE });
      // 舒張與收縮：動畫中亮起正在進行的那一個
      const cyc1 = g(P1, { opacity: 0 });
      const relax1 = g(cyc1), squeeze1 = g(cyc1);
      S.pill(relax1, 196, 200, '舒張：血液由靜脈流回心房', { size: 22, color: '#c9b8ff', edge: '#c9b8ff' });
      S.pill(squeeze1, 196, 252, '收縮：心室把血液擠進動脈', { size: 22, color: '#ffb3bf', edge: '#ffb3bf' });
      // 心室收縮時，心壁往內擠（箭頭垂直心臟外框、指向內側）
      const sqA = g(P1, { opacity: 0 });
      const oL = H1.outline.getTotalLength(), oPts = Array.from({ length: 200 }, (_, i) => { const q = H1.outline.getPointAtLength((oL * i) / 200); return [q.x, q.y, i]; });
      const lowL = oPts.filter((q) => q[1] > 450 && q[0] < 600).reduce((a, b) => (b[0] < a[0] ? b : a));
      const lowR = oPts.filter((q) => q[1] > 420 && q[0] > 620).reduce((a, b) => (b[0] > a[0] ? b : a));
      const apex = oPts.reduce((a, b) => (b[1] > a[1] ? b : a));
      [lowL, lowR, [apex[0] - 30, apex[1] - 14, apex[2]]].forEach(([x, y]) => {
        let nx = 640 - x, ny = 470 - y; const n = Math.hypot(nx, ny); nx /= n; ny /= n;
        arrow(sqA, x - nx * 40, y - ny * 40, x - nx * 6, y - ny * 6, C.hi, 4, 14);
      });
      const vScale = (k) => {
        H1.rv.setAttribute('transform', k ? `translate(522,392) scale(${(1 - 0.1 * k).toFixed(3)},${(1 - 0.16 * k).toFixed(3)}) translate(-522,-392)` : '');
        H1.lv.setAttribute('transform', k ? `translate(715,392) scale(${(1 - 0.1 * k).toFixed(3)},${(1 - 0.16 * k).toFixed(3)}) translate(-715,-392)` : '');
      };
      // 血流路徑：前半段（心房 → 心室）在房室瓣打開時走，後半段（心室 → 動脈）在動脈瓣打開時走
      const RP = [[452, 100], [452, 240], [478, 300], [503, 375], [515, 470], [565, 425], [575, 300], [575, 168], [400, 164]];
      const LP = [[955, 264], [836, 282], [752, 300], [730, 375], [712, 480], [650, 425], [640, 300], [640, 128], [700, 92], [790, 112], [808, 160]];
      const frac = (P, k) => { let a = 0, t = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); t += d; if (i <= k) a += d; } return a / t; };
      const pR = polyAt(RP), pL = polyAt(LP), KVR = frac(RP, 4), KVL = frac(LP, 4);
      const bd1 = Array.from({ length: 12 }, (_, i) => dot(P1, 7, i % 2 ? '#ff6b7d' : '#ff9aa8'));
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.show(tl, io1, 's1+=0.8', 0.4);
      S.show(tl, room1, 's1+=1.2', 0.4);
      S.drive(tl, (u) => {
        const c = (u * 2) % 1, A = c < 0.5, f = A ? c / 0.5 : (c - 0.5) / 0.5;
        const sm = (x) => S.smoothstep(0, 0.15, x) * (1 - S.smoothstep(0.85, 1, x));
        H1.set(A ? sm(f) : 0, A ? 0 : sm(f));
        const live = u > 0 && u < 0.995, k = live && !A ? sm(f) : 0;
        vScale(k);
        sqA.style.opacity = k;
        relax1.style.opacity = !live || A ? 1 : 0.3;
        squeeze1.style.opacity = !live || !A ? 1 : 0.3;
        bd1.forEach((d, i) => {
          const j = i >> 1, off = (j % 3) * 0.06 - 0.06, side = i % 2 ? pL : pR, KV = i % 2 ? KVL : KVR;
          const t = A ? KV * S.clamp(f * 1.1 + off) : KV + (1 - KV) * S.clamp(f * 1.1 + off);
          const [x, y] = side(t);
          put(d, [x + ((j * 13) % 3 - 1) * 6, y + (j > 2 ? 6 : -4)], u > 0 && u < 1 ? (t > 0.97 ? 0 : 1) : 0);
        });
      }, 6, 's1+=1.6', 'none');
      S.show(tl, cyc1, 's1+=1.5', 0.4);
      vco.forEach((c) => S.show(tl, c, 's1+=3', 0.4));
      S.show(tl, one1, 's1+=4.8', 0.4);

      // ===== 2 心壁的厚度 =====
      const P2 = g(root, { opacity: 0 });
      const H2 = heartDiagram(P2);
      H2.set(0, 0);
      const wall2 = [
        S.callout(P2, 403, 290, 200, 220, '心房壁：比較薄', '#ffd0d8', { size: 24 }),
        S.callout(P2, 436, 470, 200, 470, '右心室壁：較厚', '#ffd0d8', { size: 24 }),
        S.callout(P2, 826, 470, 1030, 520, '左心室壁：最厚', C.hi, { size: 24 }),
      ];
      // 左心室壁：心臟右下的外框減去左心室腔（evenodd 只留下壁）
      const lvHi = el('path', { d: 'M 618,384 L 853,384 C 851,470 800,590 715,655 C 680,640 648,622 618,600 Z M 632,392 L 798,392 C 806,450 792,512 760,556 C 732,592 694,604 672,584 C 650,562 638,510 634,450 Z', 'fill-rule': 'evenodd', fill: C.hi, opacity: 0 }, P2);
      const bars = g(P2, { opacity: 0 });
      text(bars, 40, 540, '心壁的厚度（成人）＊', { 'font-size': 22, fill: C.mute });
      [['心房', 2, '#ffd0d8'], ['右心室', 4, '#ffd0d8'], ['左心室', 10, C.hi]].forEach(([s, mm, c], i) => {
        const y = 580 + i * 38;
        text(bars, 40, y + 8, s, { 'font-size': 22, fill: C.ink });
        el('rect', { x: 120, y: y - 11, width: mm * 9, height: 22, rx: 4, fill: c }, bars);
        text(bars, 130 + mm * 9, y + 8, `約 ${mm} mm＊`, { 'font-size': 20, fill: c });
      });
      const why2 = g(P2, { opacity: 0 });
      S.pill(why2, 600, 690, '左心室要把血液送到全身，所以壁最厚、收縮最有力', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      wall2.forEach((c, i) => S.show(tl, c, `s2+=${0.8 + i * 0.7}`, 0.4));
      tl.fromTo(lvHi, { opacity: 0 }, { opacity: 0.45, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false }, 's2+=2.4');
      S.show(tl, bars, 's2+=3', 0.5);
      S.show(tl, why2, 's2+=4', 0.5);

      // ===== 3 血管：動脈、微血管、靜脈 =====
      const P3 = g(root, { opacity: 0 });
      S.pill(P3, 600, 38, '心臟 → 動脈 → 微血管 → 靜脈 → 心臟', { size: 26, color: C.hi, edge: C.hi });
      const VC = [
        ['動脈', ART, ['把血液帶離心臟', '管壁厚、有彈性', '血壓高、血流快']],
        ['微血管', '#ff9aa8', ['管壁只有一層細胞', '血流最慢', '和細胞進行物質交換']],
        ['靜脈', VEIN, ['把血液帶回心臟', '管壁較薄、血壓較低', '有瓣膜，防止血液倒流']],
      ];
      const cards3 = [], flows3 = [];
      VC.forEach(([name, col, pts], i) => {
        const x0 = 40 + i * 380, cx = x0 + 180, cg = g(P3, { opacity: 0 });
        el('rect', { x: x0, y: 70, width: 360, height: 580, rx: 16, ...FRAME }, cg);
        text(cg, cx, 116, name, { 'font-size': 32, 'text-anchor': 'middle', fill: col, 'font-weight': 700 });
        // 橫切面
        if (i === 0) { el('circle', { cx, cy: 220, r: 72, fill: MUSC, stroke: MUSC_E, 'stroke-width': 3 }, cg); el('circle', { cx, cy: 220, r: 48, fill: 'none', stroke: '#ffe0e6', 'stroke-width': 3 }, cg); el('circle', { cx, cy: 220, r: 32, fill: BLOOD }, cg); }
        if (i === 2) { el('ellipse', { cx, cy: 220, rx: 80, ry: 64, fill: MUSC, stroke: MUSC_E, 'stroke-width': 3 }, cg); el('ellipse', { cx, cy: 220, rx: 68, ry: 52, fill: BLOOD }, cg); }
        if (i === 1) {
          el('circle', { cx, cy: 220, r: 40, fill: BLOOD }, cg);
          [0, 1, 2].forEach((k) => { const a0 = k * 2.094 + 0.1, a1 = a0 + 1.95; el('path', { d: `M ${cx + Math.cos(a0) * 46},${220 + Math.sin(a0) * 46} A 46,46 0 0,1 ${cx + Math.cos(a1) * 46},${220 + Math.sin(a1) * 46}`, fill: 'none', stroke: MUSC_E, 'stroke-width': 10, 'stroke-linecap': 'round' }, cg); const am = (a0 + a1) / 2; el('ellipse', { cx: cx + Math.cos(am) * 46, cy: 220 + Math.sin(am) * 46, rx: 9, ry: 6, fill: '#a796ff', transform: `rotate(${(am * 180) / Math.PI + 90} ${cx + Math.cos(am) * 46} ${220 + Math.sin(am) * 46})` }, cg); });
          el('ellipse', { cx, cy: 220, rx: 24, ry: 24, fill: RBC }, cg); el('ellipse', { cx, cy: 220, rx: 9, ry: 9, fill: '#ff8a96' }, cg);
        }
        text(cg, cx, 322, i === 1 ? '橫切面（放大更多倍＊）' : '橫切面', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        // 縱切
        const half = [26, 14, 30][i], wall = [16, 4, 7][i], Y0 = 400;
        el('rect', { x: x0 + 24, y: Y0 - half - wall, width: 312, height: (half + wall) * 2, fill: MUSC, stroke: MUSC_E, 'stroke-width': 2 }, cg);
        el('rect', { x: x0 + 24, y: Y0 - half, width: 312, height: half * 2, fill: BLOOD }, cg);
        if (i === 2) [[150, 1], [250, 1]].forEach(([dx]) => [-1, 1].forEach((s) => el('line', { x1: x0 + dx, y1: Y0 + s * half, x2: x0 + dx + 30, y2: Y0 + s * 6, stroke: VALVE, 'stroke-width': 5, 'stroke-linecap': 'round' }, cg)));
        arrow(cg, cx - 50, Y0 - half - wall - 18, cx + 50, Y0 - half - wall - 18, col, 3, 12);
        const ds = Array.from({ length: i === 1 ? 6 : 8 }, (_, k) => (i === 1 ? el('ellipse', { rx: 11, ry: 9, fill: RBC, stroke: '#0d1822', 'stroke-width': 1 }, cg) : dot(cg, 7, k % 2 ? RBC : '#ff6b7d')));
        flows3.push({ ds, x0: x0 + 30, x1: x0 + 330, y: Y0, half, speed: [3, 0.8, 1.6][i] });
        pts.forEach((s, k) => text(cg, x0 + 30, 506 + k * 42, '• ' + s, { 'font-size': 23, fill: C.ink }));
        if (i === 1) S.pill(cg, cx, 620, '直徑約 8 μm＊', { size: 22, color: C.hi, edge: C.hi });
        cards3.push(cg);
      });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.3);
      cards3.forEach((c, i) => S.show(tl, c, `s3+=${0.5 + i * 1}`, 0.5));
      S.drive(tl, (u) => flows3.forEach(({ ds, x0, x1, y, half, speed }, i) => ds.forEach((d, k) => {
        const pulse = i === 0 ? 1 + 0.6 * Math.sin(u * 6.283 * 6) : 1;
        const t = (u * speed * pulse * 0.9 + k / ds.length) % 1;
        put(d, [S.lerp(x0, x1, t), y + (i === 1 ? 0 : ((k * 7) % 3 - 1) * half * 0.45)], u > 0 && u < 1 ? 1 : 0);
      })), 6, 's3+=0.5', 'none');

      // ===== 4 血液的組成 =====
      const P4 = g(root, { opacity: 0 });
      const TX = 150, TT = 150, TB = 560, TH = TB - TT;
      el('path', { d: `M ${TX - 40},${TT} L ${TX - 40},${TB - 30} C ${TX - 40},${TB + 18} ${TX + 40},${TB + 18} ${TX + 40},${TB - 30} L ${TX + 40},${TT} Z` }, el('clipPath', { id: 'hrTube' }, el('defs', {}, P4)));
      const tube = g(P4, { 'clip-path': 'url(#hrTube)' });
      const plasma = el('rect', { x: TX - 42, y: TT + 20, width: 84, height: 0, fill: PLASMA }, tube);
      const cells = el('rect', { x: TX - 42, y: TT + 20, width: 84, height: TH, fill: '#a3202f' }, tube);
      const buffy = el('rect', { x: TX - 42, y: TT, width: 84, height: 6, fill: '#f4f0ea', opacity: 0 }, tube);
      el('path', { d: `M ${TX - 48},${TT - 8} L ${TX - 40},${TT} L ${TX - 40},${TB - 30} C ${TX - 40},${TB + 18} ${TX + 40},${TB + 18} ${TX + 40},${TB - 30} L ${TX + 40},${TT} L ${TX + 48},${TT - 8}`, fill: 'none', stroke: '#cfe8ff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, P4);
      const sepLbl = text(P4, TX, 110, '', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const BND = TT + 20 + (TH - 20) * 0.55;
      const lay4 = [S.callout(P4, TX + 30, TT + 120, 330, 240, '血漿約 55%＊', PLASMA, { size: 24 }), S.callout(P4, TX + 30, BND + 100, 330, 470, '血球約 45%＊', '#ff6b7d', { size: 24 })];
      const rows = [];
      const row = (y, draw, t1, t2, c) => { const rg = g(P4, { opacity: 0 }); el('rect', { x: 450, y: y - 62, width: 710, height: 124, rx: 16, ...FRAME }, rg); draw(rg, 530, y); text(rg, 620, y - 10, t1, { 'font-size': 26, fill: c, 'font-weight': 700 }); text(rg, 620, y + 32, t2, { 'font-size': 22, fill: C.ink2 }); rows.push(rg); return rg; };
      row(110, (p, x, y) => el('rect', { x: x - 40, y: y - 26, width: 80, height: 52, rx: 10, fill: PLASMA }, p), '血漿：淡黃色的液體', '運送養分、激素和廢物（例如二氧化碳）等', PLASMA);
      row(250, (p, x, y) => { el('circle', { cx: x, cy: y, r: 24, fill: RBC }, p); el('circle', { cx: x, cy: y, r: 10, fill: '#ff8a96' }, p); }, '紅血球：含血紅素，運送氧', '雙凹圓盤狀，成熟後沒有細胞核；數量最多', '#ff6b7d');
      row(390, (p, x, y) => { el('circle', { cx: x, cy: y, r: 38, fill: '#e8e4f0', stroke: '#fff', 'stroke-width': 2 }, p); el('path', { d: `M ${x - 18},${y - 4} C ${x - 22},${y - 22} ${x - 2},${y - 22} ${x},${y - 8} C ${x + 4},${y - 22} ${x + 24},${y - 16} ${x + 16},${y + 2} C ${x + 26},${y + 16} ${x + 6},${y + 24} ${x},${y + 10} C ${x - 8},${y + 24} ${x - 26},${y + 14} ${x - 18},${y - 4} Z`, fill: '#8a6ad8' }, p); }, '白血球：有細胞核，能對抗病原體', '能吞噬病菌，保護身體；體積最大、數量最少', '#c8b8ff');
      row(530, (p, x, y) => { [[-18, -8, 0], [6, -12, 40], [18, 10, 80], [-6, 12, 120]].forEach(([dx, dy, r]) => el('path', { d: 'M -8,-4 L 2,-8 L 9,-1 L 4,7 L -6,6 Z', fill: '#f2b0c8', transform: `translate(${x + dx},${y + dy}) rotate(${r})` }, p)); }, '血小板：碎屑狀，沒有細胞核', '幫助血液凝固，傷口才能止血；體積最小', '#f2b0c8');
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        const k = S.smoothstep(0.1, 0.9, u);
        plasma.setAttribute('height', (BND - TT - 20) * k);
        cells.setAttribute('y', TT + 20 + (BND - TT - 20) * k); cells.setAttribute('height', TH - (BND - TT - 20) * k);
        cells.setAttribute('fill', k > 0.5 ? '#c0283c' : '#a3202f');
        buffy.setAttribute('y', BND - 3); buffy.style.opacity = k > 0.9 ? 1 : 0;
        sepLbl.textContent = u <= 0 ? '' : u < 1 ? '血液分層中…＊' : '分層後＊';
      }, 2.4, 's4+=0.6', 'none');
      lay4.forEach((c, i) => S.show(tl, c, `s4+=${3 + i * 0.5}`, 0.4));
      rows.forEach((r, i) => S.show(tl, r, `s4+=${3.8 + i * 0.8}`, 0.4));

      // ===== 5 心跳、脈搏與心音 =====
      const P5 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 500, height: 520, rx: 16, ...FRAME }, P5);
      el('rect', { x: 580, y: 70, width: 580, height: 520, rx: 16, ...FRAME }, P5);
      text(P5, 290, 116, '心跳', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P5, 870, 116, '脈搏（手腕內側的動脈）', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const hb5 = S.place(g(P5), { x: 260, y: 290, s: 1.6 });
      heartIcon(hb5, 3);
      const lub = text(P5, 430, 240, '撲', { 'font-size': 40, 'text-anchor': 'middle', fill: VALVE, 'font-weight': 700, opacity: 0 });
      const dub = text(P5, 460, 320, '通', { 'font-size': 40, 'text-anchor': 'middle', fill: VALVE, 'font-weight': 700, opacity: 0 });
      S.pill(P5, 290, 480, '心音：瓣膜關閉時發出的聲音', { size: 22, color: VALVE, edge: VALVE });
      const cntH = text(P5, 290, 552, '', { 'font-size': 28, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      // 手腕：右前臂手掌朝上（手指朝左、拇指在上方）；另一隻手（手背朝上）從右上方伸過來，
      // 用食指和中指輕按「拇指這一側」的手腕內側，下面就是動脈
      const SK = '#f2b38a', SK2 = '#e6a176', SK_E = '#ffdcc4', CRE = '#c98762', SLV = '#4f7896', SLV_E = '#8db6d2';
      el('rect', { x: 582, y: 72, width: 576, height: 516, rx: 15 }, el('clipPath', { id: 'hrWrist' }, el('defs', {}, P5)));
      const wr = g(P5, { 'clip-path': 'url(#hrWrist)' });
      blob(wr, [
        { d: 'M 1170,266 C 1080,268 990,274 904,282 L 904,350 C 990,354 1080,360 1170,366 Z' }, // 前臂
        { d: 'M 910,282 C 884,276 852,270 828,273 C 808,276 794,280 788,287 C 781,306 783,334 793,354 C 822,364 872,362 910,350 Z' }, // 手掌
        [856, 286, 783, 254, 22], // 拇指
        [792, 292, 716, 284, 18], [792, 311, 706, 307, 18], [792, 330, 714, 331, 18], [795, 347, 738, 354, 16], // 食指～小指
      ], SK, SK_E, 2);
      const crease = (d, op = 0.5) => el('path', { d, fill: 'none', stroke: CRE, 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: op }, wr);
      [[716, 284], [706, 307], [714, 331], [738, 354]].forEach(([tx, ty], i) => {
        const bx = [792, 792, 792, 795][i], by = [292, 311, 330, 347][i];
        [0.36, 0.66].forEach((f) => { const x = S.lerp(tx, bx, f), y = S.lerp(ty, by, f); crease(`M ${x.toFixed(1)},${(y - 6).toFixed(1)} L ${(x + 1).toFixed(1)},${(y + 6).toFixed(1)}`); });
      });
      crease('M 808,262 l 6,10'); // 拇指關節
      crease('M 880,292 C 860,300 850,322 862,348', 0.45); // 掌紋
      crease('M 868,330 C 846,322 818,324 800,334', 0.4);
      crease('M 914,290 C 910,306 910,328 914,344', 0.45); crease('M 924,288 C 920,306 920,328 924,346', 0.35); // 手腕的橫紋
      const artery5 = el('path', { d: 'M 1170,288 C 1080,288 990,290 916,293', fill: 'none', stroke: ART, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 }, wr);
      el('path', { d: 'M 1124,254 L 1170,254 L 1170,378 L 1124,378 C 1116,340 1116,292 1124,254 Z', fill: SLV, stroke: SLV_E, 'stroke-width': 2 }, wr); // 袖口
      // 另一隻手：手指朝左下，指尖落在動脈上
      const ph = g(wr, { transform: 'translate(956,296) rotate(118)' }); // 局部座標：手指朝 +x，指尖在 x≈0；+y 是拇指那一側
      blob(ph, [
        { d: 'M -150,22 L -150,-46 L -352,-150 L -350,-74 Z' }, // 前臂（手腕略為彎曲）
        { d: 'M -66,22 C -90,28 -122,28 -152,22 L -152,-46 C -122,-54 -94,-62 -70,-60 C -64,-42 -62,0 -66,22 Z' }, // 手背
        [-136, 28, -86, 36, 19], // 拇指（收在下面）
        [-68, 10.5, -9.5, 10.5, 19], [-74, -10.5, -9.5, -10.5, 19], // 食指、中指（伸直，輕按）
        [-72, -31, -52, -32, 18], [-74, -50, -60, -51, 16], // 無名指、小指（彎起來）
      ], SK2, SK_E, 2);
      [10.5, -10.5].forEach((y) => {
        el('rect', { x: -26, y: y - 6, width: 17, height: 12, rx: 6, fill: '#f8cdb6', stroke: '#ffe8da', 'stroke-width': 1.2 }, ph); // 指甲
        el('path', { d: `M -44,${y - 6} q 4,6 0,12`, fill: 'none', stroke: CRE, 'stroke-width': 1.6, opacity: 0.6 }, ph);
      });
      [[-70, 10], [-74, -12], [-70, -32], [-72, -50]].forEach(([x, y]) => el('path', { d: `M ${x},${y - 6} q -5,6 0,12`, fill: 'none', stroke: CRE, 'stroke-width': 1.6, opacity: 0.5 }, ph)); // 指節
      el('path', { d: 'M -212,-82 L -370,-164 L -398,-104 L -240,-22 C -232,-42 -224,-64 -212,-82 Z', fill: SLV, stroke: SLV_E, 'stroke-width': 2 }, ph); // 袖子
      const ring5 = el('ellipse', { cx: 956, cy: 294, rx: 20, ry: 11, fill: 'none', stroke: '#ff8a9a', 'stroke-width': 3, opacity: 0 }, wr);
      const press5 = S.callout(P5, 963, 258, 690, 200, '食指和中指輕壓', C.ink2, { size: 22 });
      el('rect', { x: 620, y: 384, width: 520, height: 120, rx: 10, fill: '#0d1822', stroke: '#2b4252', 'stroke-width': 2 }, P5);
      const trace = el('path', { d: '', fill: 'none', stroke: ART, 'stroke-width': 3 }, P5);
      text(P5, 630, 410, '脈搏的跳動＊', { 'font-size': 20, fill: C.mute });
      const cntP = text(P5, 870, 552, '', { 'font-size': 28, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      const eq5 = g(P5, { opacity: 0 });
      S.pill(eq5, 600, 652, '脈搏是動脈隨著心跳的搏動：脈搏的次數 ＝ 心跳的次數', { size: 24, color: C.hi, edge: C.hi });
      const BEAT = 60 / 72, DUR5 = 6.4, T0 = 0.3;
      const bump = (t) => (t < 0 ? 0 : t < 0.12 ? t / 0.12 : Math.exp(-(t - 0.12) * 7) * (1 + 0.25 * Math.exp(-((t - 0.35) ** 2) * 200)));
      const sig = (t) => { let s = 0; for (let k = 0; k < 9; k++) s += bump(t - T0 - 0.12 - k * BEAT); return s; };
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, press5, 's5+=0.7', 0.4);
      S.drive(tl, (u) => {
        const t = u * DUR5, ph = t - T0, k = Math.floor(ph / BEAT), f = ph - k * BEAT;
        const beats = ph >= 0 ? k + 1 : 0;
        const sq = ph >= 0 ? Math.max(0, Math.sin(Math.min(1, f / 0.35) * Math.PI)) : 0;
        S.place(hb5, { x: 260, y: 290, s: 1.6 * (1 - 0.12 * sq) });
        lub.style.opacity = ph >= 0 && f < 0.25 ? 1 : 0;
        dub.style.opacity = ph >= 0 && f >= 0.3 && f < 0.55 ? 1 : 0;
        cntH.textContent = u >= 0.985 ? '1 分鐘約 72 次＊' : `心跳 ${beats} 次`;
        const pk = Math.floor((ph - 0.12) / BEAT) + 1;
        cntP.textContent = u >= 0.985 ? '1 分鐘約 72 次＊' : `脈搏 ${ph - 0.12 >= 0 ? pk : 0} 次`;
        artery5.setAttribute('stroke-width', 6 + 6 * Math.min(1, sig(t)));
        // 指尖感覺到的搏動：每次脈搏擴散一圈
        const pp = t - T0 - 0.24, pf = pp >= 0 ? (pp % BEAT) / 0.5 : 1;
        ring5.setAttribute('rx', (22 + 26 * Math.min(1, pf)).toFixed(1)); ring5.setAttribute('ry', (12 + 14 * Math.min(1, pf)).toFixed(1));
        ring5.style.opacity = pf < 1 && u < 0.985 ? (0.9 * (1 - pf)).toFixed(2) : 0;
        let d = '';
        for (let i = 0; i <= 120; i++) { const tt = t - 4 + (i / 120) * 4; d += (i ? 'L' : 'M') + `${(630 + i * 4.2).toFixed(1)},${(490 - 70 * Math.min(1.2, sig(tt))).toFixed(1)}`; }
        trace.setAttribute('d', d);
      }, DUR5, 's5+=0.6', 'none');
      S.show(tl, eq5, 's5+=5.6', 0.5);

      // ===== 6 開放式循環與閉鎖式循環 =====
      const P6 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 70, width: 540, height: 580, rx: 16, ...FRAME }, P6);
      el('rect', { x: 620, y: 70, width: 540, height: 580, rx: 16, ...FRAME }, P6);
      text(P6, 310, 118, '開放式循環', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: '#ffb35c' });
      text(P6, 890, 118, '閉鎖式循環', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: ART });
      S.pill(P6, 600, 38, '補充', { size: 22, color: C.mute, edge: '#4a6272' });
      // (a) 蝗蟲（側面，像透視圖一樣畫出體內）：背側有管狀的心臟（背管），
      //     血液從前端流出到體腔，流過各器官之間，再由背管上的開口流回
      const ins = S.place(g(P6), { x: -13, y: -8, s: 1.08 });
      const BUG = '#a8d070', BUGF = 'rgba(150,196,90,0.18)', VES = '#ff8a5c';
      const ip = (T) => (x) => { let i = 1; while (i < T.length - 1 && x > T[i][0]) i++; return S.lerp(T[i - 1][1], T[i][1], S.clamp((x - T[i - 1][0]) / (T[i][0] - T[i - 1][0]))); };
      const topY = ip([[150, 228], [250, 232], [320, 236], [400, 242], [470, 252], [515, 266]]);
      const botY = ip([[130, 336], [250, 342], [320, 340], [400, 330], [470, 316], [515, 304]]);
      const vY = ip([[146, 256], [200, 248], [250, 246], [330, 247], [400, 251], [470, 260], [512, 270]]);
      const gutY = ip([[150, 300], [320, 302], [480, 294], [530, 294]]);
      const leg = (d, w) => el('path', { d, fill: 'none', stroke: BUG, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ins);
      leg('M 172,330 L 164,372 L 150,404 L 128,410', 5); // 前腳
      leg('M 214,336 L 222,376 L 240,404 L 264,410', 5); // 中腳
      leg('M 424,338 L 372,402 L 344,410', 4.5); // 後腳的脛節（摺在腿節下面）
      el('path', { d: S.smoothPath([[100, 240], [150, 226], [200, 221], [248, 230], [320, 236], [400, 242], [470, 252], [515, 266], [536, 286], [522, 302], [470, 316], [400, 330], [320, 340], [255, 343], [205, 343], [160, 337], [124, 339], [100, 331], [88, 308], [86, 280], [90, 256]]), fill: BUGF, stroke: BUG, 'stroke-width': 3, 'stroke-linejoin': 'round' }, ins);
      el('path', { d: 'M 150,228 C 172,220 222,220 250,232 C 254,262 252,294 246,322 C 220,328 180,328 156,322 C 150,292 148,260 150,228 Z', fill: 'rgba(150,196,90,0.14)', stroke: BUG, 'stroke-width': 2 }, ins); // 前胸背板
      [285, 320, 355, 390, 425, 460, 495].forEach((x) => el('path', { d: `M ${x},${(topY(x) + 3).toFixed(1)} Q ${x - 7},${((topY(x) + botY(x)) / 2).toFixed(1)} ${x},${(botY(x) - 3).toFixed(1)}`, fill: 'none', stroke: BUG, 'stroke-width': 1.5, opacity: 0.4 }, ins)); // 腹部的分節
      el('path', { d: 'M 250,334 C 300,322 380,318 424,328 C 436,331 438,343 426,346 C 380,356 300,366 262,362 C 246,360 240,340 250,334 Z', fill: '#4d6b30', stroke: BUG, 'stroke-width': 2.5 }, ins); // 後腳的腿節（粗大，用來跳躍）
      [290, 320, 350, 380].forEach((x) => el('path', { d: `M ${x},${(337 - (x - 290) * 0.06).toFixed(1)} l 12,${(9 - (x - 290) * 0.02).toFixed(1)} l 12,${(-9 + (x - 290) * 0.02).toFixed(1)}`, fill: 'none', stroke: BUG, 'stroke-width': 1.5, opacity: 0.6 }, ins));
      el('ellipse', { cx: 120, cy: 262, rx: 13, ry: 18, fill: '#2f3d22', stroke: BUG, 'stroke-width': 2 }, ins); // 複眼
      el('circle', { cx: 124, cy: 255, r: 4, fill: '#fff', opacity: 0.6 }, ins);
      leg('M 108,244 C 96,214 80,186 62,160', 3); leg('M 116,240 C 110,206 100,180 88,152', 3); // 觸角
      leg('M 96,332 l -4,12 M 106,336 l -2,12', 2.5); // 口器
      el('path', { d: 'M 108,326 C 120,314 138,302 168,300 C 220,298 262,301 320,302 C 380,303 440,296 480,293 C 505,292 520,293 532,294', fill: 'none', stroke: '#c9a26a', 'stroke-width': 11, 'stroke-linecap': 'round', opacity: 0.45 }, ins); // 消化道
      // 背管：腹部的一段是心臟（有開口），往前延伸到頭部，前端是開放的
      el('path', { d: 'M 512,270 C 470,260 400,251 330,247 C 300,246 270,246 250,246', fill: 'none', stroke: VES, 'stroke-width': 12, 'stroke-linecap': 'round' }, ins);
      el('path', { d: 'M 252,246 C 210,246 172,250 146,256', fill: 'none', stroke: VES, 'stroke-width': 8 }, ins);
      const OST = [290, 340, 390, 440, 488];
      OST.forEach((x) => el('ellipse', { cx: x, cy: vY(x), rx: 4.5, ry: 3, fill: '#0d1822', stroke: '#ffd0b0', 'stroke-width': 1 }, ins));
      const lab6 = (x, y, s, tx, ty) => { el('line', { x1: x, y1: y + 6, x2: tx, y2: ty, stroke: VES, 'stroke-width': 2 }, ins); text(ins, x, y, s, { 'font-size': 21, 'text-anchor': 'middle', fill: VES, 'font-weight': 700 }); };
      lab6(320, 204, '背管（心臟）', 320, 240);
      lab6(472, 204, '開口', 443, 250);
      // 血液的路線：背管內往前 → 從前端流出 → 在體腔中往後流 → 由開口流回背管
      const loops6 = OST.map((xo, j) => {
        const up = j % 2 === 0, f = [0.5, 0.42, 0.62, 0.4, 0.7][j];
        const lane = (x) => (up ? S.lerp(vY(x) + 7, gutY(x) - 8, f) : S.lerp(gutY(x) + 8, botY(x) - 7, f));
        const pts = [];
        for (let x = xo; x > 150; x -= 8) pts.push([x, vY(x)]);
        pts.push([146, 256], [139, 270], [137, 288]);
        if (!up) pts.push([142, 306]);
        for (let x = 160; x <= xo + 14; x += 10) pts.push([x, lane(x) + Math.sin(x / 26 + j * 1.7) * 3]);
        pts.push([xo + 8, (lane(xo + 8) + vY(xo)) / 2], [xo, vY(xo)]);
        return polyAt(pts);
      });
      const open6 = Array.from({ length: 15 }, (_, i) => dot(ins, 5, i % 2 ? '#ffb35c' : '#ffd08a'));
      text(P6, 310, 540, '血液會流出血管，', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      text(P6, 310, 576, '在身體的空腔中和細胞直接接觸', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      text(P6, 310, 624, '例：昆蟲、蝦等節肢動物', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // (b) 閉鎖式：心臟 → 動脈 → 微血管網（在身體各處的組織中）→ 靜脈 → 心臟
      const clo = g(P6);
      const vd = (d, color, w) => el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, clo);
      const gd = el('linearGradient', { id: 'hrCap', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 256, x2: 0, y2: 404 }, el('defs', {}, clo));
      [[0, ART], [0.5, '#c58ad6'], [1, VEIN]].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gd));
      // 微血管周圍的細胞
      [1063, 1085, 1107].forEach((x) => [291, 331, 371].forEach((y) => { el('ellipse', { cx: x, cy: y, rx: 8, ry: 13, fill: 'rgba(99,212,191,0.12)', stroke: 'rgba(99,212,191,0.5)', 'stroke-width': 1.5 }, clo); el('circle', { cx: x, cy: y, r: 2.8, fill: 'rgba(167,150,255,0.7)' }, clo); }));
      const CX6 = [1052, 1074, 1096, 1118];
      const caps = CX6.map((x) => vd(`M ${x},256 C ${x - 4},286 ${x + 4},318 ${x},336 C ${x - 4},356 ${x + 4},384 ${x},402`, 'url(#hrCap)', 3));
      CX6.slice(0, 3).forEach((x, k) => [311, 351].forEach((y, m) => vd(`M ${x},${y + (k + m) % 2 * 3} L ${x + 22},${y + (k + m + 1) % 2 * 3}`, 'url(#hrCap)', 2.5)));
      vd('M 1038,252 C 1060,250 1100,252 1124,258', ART, 6); // 小動脈
      vd('M 1124,402 C 1100,408 1060,408 1038,404', VEIN, 6); // 小靜脈
      const artP = vd('M 774,268 C 806,206 880,180 950,184 C 1000,188 1030,214 1038,252', ART, 10);
      const veinP = vd('M 1038,404 C 1022,444 962,468 882,468 C 792,468 702,464 668,430 C 638,396 640,302 660,262 C 674,234 704,226 723,242 L 723,274', VEIN, 10);
      const hb6 = S.place(g(clo), { x: 752, y: 330, s: 0.85 });
      heartIcon(hb6, 3);
      const chev6 = (pa, f) => {
        const L = pa.getTotalLength(), a = pa.getPointAtLength(L * f), b = pa.getPointAtLength(Math.min(L, L * f + 2));
        el('path', { d: 'M -5,-6 L 4,0 L -5,6', fill: 'none', stroke: '#fff', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85, transform: `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI).toFixed(1)})` }, clo);
      };
      chev6(artP, 0.3); chev6(artP, 0.7); chev6(veinP, 0.3); chev6(veinP, 0.62);
      text(clo, 900, 164, '動脈', { 'font-size': 22, 'text-anchor': 'middle', fill: ART, 'font-weight': 700 });
      text(clo, 870, 506, '靜脈', { 'font-size': 22, 'text-anchor': 'middle', fill: '#aab4ff', 'font-weight': 700 });
      text(clo, 1086, 236, '微血管', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff9aa8', 'font-weight': 700 });
      text(clo, 1098, 446, '身體的細胞', { 'font-size': 20, 'text-anchor': 'middle', fill: '#8fe0cf' });
      text(clo, 824, 346, '心臟', { 'font-size': 22, fill: '#ff8a9a', 'font-weight': 700 });
      // 血液的路線（經過其中一條微血管）；在心臟裡的一段不畫
      const samp = (pa, n) => { const L = pa.getTotalLength(); return Array.from({ length: n + 1 }, (_, i) => { const q = pa.getPointAtLength((L * i) / n); return [q.x, q.y]; }); };
      const plen = (P) => P.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]) : 0), 0);
      const artPts = samp(artP, 40), veinPts = samp(veinP, 50);
      const routes6 = caps.map((cp, c) => {
        const a = [...artPts, [CX6[c], 254]], cap = samp(cp, 16), v = [[1038, 404], ...veinPts], h = [[723, 300], [742, 336], [772, 304], [774, 268]];
        const all = [...a, ...cap, ...v, ...h], T = plen(all);
        return { at: polyAt(all), fv: plen([...a, ...cap.slice(0, 9)]) / T, fh: plen([...a, ...cap, ...v]) / T };
      });
      const clo6 = Array.from({ length: 16 }, () => dot(P6, 5.5, RBC));
      text(P6, 890, 540, '血液一直在血管中流動，', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      text(P6, 890, 576, '經由微血管和細胞交換物質', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      text(P6, 890, 624, '例：蚯蚓、魚、人', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      S.drive(tl, (u) => {
        const on = u > 0 && u < 1;
        open6.forEach((d, i) => { const k = (u * 1.3 + i / open6.length) % 1; put(d, loops6[i % 5](k), on ? 1 : 0); });
        clo6.forEach((d, i) => {
          const r = routes6[i % 4], k = (u * 1.2 + i / clo6.length) % 1;
          put(d, r.at(k), on && k < r.fh ? 1 : 0);
          d.setAttribute('fill', k < r.fv ? RBC : '#9a86f0');
        });
      }, 6, 's6+=0.6', 'none');

      return {
        tl,
        notes: [
          '＊示意：血管只畫出主要的幾條，紅色表示動脈、藍紫色表示靜脈（真實的血液都是紅色）。成人的心臟大約和自己的拳頭一樣大。',
          '＊示意：形狀、血管和收縮的幅度都簡化了。四個腔室：右心房、右心室、左心房、左心室；心房接受流回的血液，心室把血液送出，左右兩邊不相通。看圖要「面對面」：圖的左邊是這個人的右邊。上、下大靜脈也稱為上、下腔靜脈。',
          '＊厚度是成人的約略值，每個人不同；圖中的心壁厚度只是示意。',
          '＊示意：血管的粗細和管壁厚度都不是真實比例。瓣膜在較大的靜脈中（例如四肢的靜脈）；動脈中沒有瓣膜。微血管非常細，直徑只比紅血球大一點，紅血球要排成一列通過。微血管的管壁只有一層細胞。',
          '＊比例是約略值。血液加入防止凝固的物質後離心或靜置，會分成兩層；血球層的最上面還有一層很薄的白色層，主要是白血球和血小板。大小約為：紅血球直徑 7～8 μm、血小板 2～3 μm，白血球大多更大（醫學參考值）。',
          '＊示意：72 次只是舉例；成人安靜時的心跳每分鐘約 60～100 次，運動時會變快。心音「撲—通」的兩個聲音，分別是房室之間和心室出口的瓣膜關閉的聲音。',
          '＊補充：108 課綱以人體的循環系統為主，這一步是補充內容。昆蟲的身體和血管都簡化了；昆蟲的血液主要運送養分和廢物，氧主要靠氣管直接送到細胞。開放式循環的例子：昆蟲；閉鎖式循環的例子：人、魚、蚯蚓。',
        ],
        steps: [
          '<b>循環系統</b>由<b>心臟</b>、<b>血管</b>和<b>血液</b>組成。心臟推動血液，經由血管流到全身，再流回心臟。',
          '心臟<b>舒張</b>時，血液由靜脈流回<b>心房</b>；心房收縮，血液流進心室；<b>心室收縮</b>，把血液擠進動脈。<b>瓣膜</b>讓血液只朝一個方向流。',
          '<b>心室壁</b>比心房壁厚；<b>左心室</b>要把血液送到全身，所以壁<b>最厚</b>。',
          '血管有三種：<b>動脈</b>把血液帶離心臟，管壁厚有彈性；<b>靜脈</b>把血液帶回心臟，管壁較薄，有<b>瓣膜</b>；<b>微血管</b>是物質交換的地方。',
          '血液由<b>血漿</b>和<b>血球</b>組成。<b>紅血球</b>含血紅素、運送氧，成熟後沒有細胞核；<b>白血球</b>有細胞核，能對抗病原體；<b>血小板</b>幫助血液凝固。',
          '心臟收縮時，動脈跟著搏動，叫做<b>脈搏</b>，次數和<b>心跳</b>相同。用聽診器聽到的<b>心音</b>，是瓣膜關閉的聲音。',
          '（補充）<b>開放式循環</b>：血液會流出血管，在身體的空腔中流動。<b>閉鎖式循環</b>：血液一直在血管中流動。',
        ],
      };
    },
  });
})();
