/* 4-1 神經系統：刺激與反應、神經元（跨尺度）、中樞與周圍神經、腦、感覺（感覺疲勞、視覺暫留）、反射、意識行為與反應時間 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const NEU = '#8fd0e6', SENS = '#62a8ff', MOT = '#ff9a5c', CNS = C.hi, PNS = '#ffb35c';

  // 箭頭線
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, sw = 3, head = 12) => {
    const a = g(p);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    el('line', { x1, y1, x2: x2 - Math.cos(ang) * head * 0.8, y2: y2 - Math.sin(ang) * head * 0.8, stroke: color, 'stroke-width': sw }, a);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(ang - 0.45)},${y2 - head * Math.sin(ang - 0.45)} L ${x2 - head * Math.cos(ang + 0.45)},${y2 - head * Math.sin(ang + 0.45)} Z`, fill: color }, a);
    return a;
  };
  // 先畫所有外框、再畫所有填色：相連的部位（手臂、手掌、手指）合成一個乾淨的輪廓
  // parts：{ d } 是封閉的形狀；{ s, w } 是寬度 w 的圓頭曲線（手指）
  const blob = (p, parts, fill, edge, sw = 2) => {
    parts.forEach((q) => (q.d ? el('path', { d: q.d, fill: edge, stroke: edge, 'stroke-width': sw * 2, 'stroke-linejoin': 'round' }, p)
      : el('path', { d: q.s, fill: 'none', stroke: edge, 'stroke-width': q.w + sw * 2, 'stroke-linecap': 'round' }, p)));
    parts.forEach((q) => (q.d ? el('path', { d: q.d, fill }, p)
      : el('path', { d: q.s, fill: 'none', stroke: fill, 'stroke-width': q.w, 'stroke-linecap': 'round' }, p)));
  };
  // 通過各點的平滑曲線（不閉合）
  const curve = (P) => {
    let d = `M ${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };
  // 會發光的訊號點
  const pulse = (p, color = C.hi, r = 9) => {
    const q = g(p, { opacity: 0 });
    el('circle', { cx: 0, cy: 0, r: r * 2, fill: color, opacity: 0.25 }, q);
    el('circle', { cx: 0, cy: 0, r, fill: color, stroke: '#fff', 'stroke-width': 2 }, q);
    return q;
  };
  // 把多段路徑取樣成點列（之後讓訊號點沿著走）
  const sample = (parts) => {
    const pts = [];
    parts.forEach((pt) => {
      if (Array.isArray(pt)) { pts.push(pt); return; }
      const L = pt.getTotalLength(), n = Math.max(4, Math.round(L / 6));
      for (let i = 0; i <= n; i++) { const q = pt.getPointAtLength((L * i) / n); pts.push([q.x, q.y]); }
    });
    // 依弧長重新參數化
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const at = (u) => {
      const s = S.clamp(u) * acc[acc.length - 1];
      let i = 1; while (i < acc.length - 1 && acc[i] < s) i++;
      const f = (s - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
      return [S.lerp(pts[i - 1][0], pts[i][0], f), S.lerp(pts[i - 1][1], pts[i][1], f)];
    };
    at.len = acc[acc.length - 1];
    return at;
  };
  const ride = (tl, dot, at, dur, pos, ease = 'none') => S.drive(tl, (u) => {
    const [x, y] = at(u); S.place(dot, { x, y }); dot.style.opacity = u > 0 && u < 0.995 ? 1 : 0;
  }, dur, pos, ease);

  S.register({
    id: 'nerve', section: '5-1', title: '神經系統',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 刺激與反應 =====
      const P0 = g(root);
      S.pill(P0, 600, 38, '受器：接受刺激的構造（感覺器官）', { size: 24, color: C.hi, edge: C.hi });
      const CX = [160, 380, 600, 820, 1040];
      const organs = [['眼', '光'], ['耳', '聲音'], ['鼻', '氣味'], ['舌', '味道'], ['皮膚', '觸、壓、冷、熱、痛']].map(([n, s], i) => {
        const c = g(P0, { opacity: 0 });
        el('rect', { x: CX[i] - 104, y: 72, width: 208, height: 222, rx: 16, ...FRAME }, c);
        const x = CX[i], y = 150;
        if (i === 0) { // 眼
          el('path', { d: `M ${x - 56},${y} Q ${x},${y - 44} ${x + 56},${y} Q ${x},${y + 44} ${x - 56},${y} Z`, fill: '#f4f1ea', stroke: '#c9d6dc', 'stroke-width': 3 }, c);
          el('circle', { cx: x, cy: y, r: 20, fill: '#5a8fc2' }, c);
          el('circle', { cx: x, cy: y, r: 9, fill: '#0d1822' }, c);
          [-1, 0, 1].forEach((k) => el('line', { x1: x - 92, y1: y - 46 + k * 22, x2: x - 64, y2: y - 14 + k * 10, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, c));
        } else if (i === 1) { // 耳：耳廓的外緣在左、耳孔朝右，聲音從右邊傳來
          const ex = x - 18;
          el('path', { d: `M ${ex - 6},${y - 52} C ${ex - 52},${y - 52} ${ex - 58},${y + 4} ${ex - 32},${y + 26} C ${ex - 18},${y + 38} ${ex - 22},${y + 56} ${ex - 2},${y + 56} C ${ex + 14},${y + 56} ${ex + 18},${y + 40} ${ex + 10},${y + 30}`, fill: 'none', stroke: C.skin, 'stroke-width': 9, 'stroke-linecap': 'round' }, c);
          el('path', { d: `M ${ex - 8},${y - 26} C ${ex - 30},${y - 26} ${ex - 32},${y} ${ex - 16},${y + 10}`, fill: 'none', stroke: C.skin, 'stroke-width': 5, 'stroke-linecap': 'round' }, c);
          // 聲波：以右邊的聲源為中心的圓弧，越靠近耳朵越大
          const sx = x + 112;
          [34, 52, 70].forEach((r) => { const dx = r * 0.766, dy = r * 0.643; el('path', { d: `M ${sx - dx},${y - dy} A ${r},${r} 0 0,0 ${sx - dx},${y + dy}`, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, c); });
        } else if (i === 2) { // 鼻：鼻尖朝右，氣味從前方（右邊）飄向鼻孔
          const nx = x - 16;
          el('path', { d: `M ${nx + 4},${y - 56} C ${nx + 6},${y - 20} ${nx + 26},${y + 8} ${nx + 30},${y + 26} C ${nx + 32},${y + 40} ${nx + 14},${y + 44} ${nx},${y + 36} C ${nx - 12},${y + 44} ${nx - 30},${y + 38} ${nx - 26},${y + 24}`, fill: 'none', stroke: C.skin, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c);
          [-1, 0, 1].forEach((k) => el('path', { d: `M ${x + 92},${y + 22 + k * 20} q -12,-10 -24,0 q -12,10 -24,0`, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, c));
        } else if (i === 3) { // 舌
          el('path', { d: `M ${x - 40},${y - 30} L ${x + 40},${y - 30} L ${x + 40},${y + 10} C ${x + 40},${y + 56} ${x - 40},${y + 56} ${x - 40},${y + 10} Z`, fill: '#e98a9a', stroke: '#ffc2cc', 'stroke-width': 3 }, c);
          el('line', { x1: x, y1: y - 24, x2: x, y2: y + 26, stroke: '#c0566b', 'stroke-width': 3 }, c);
          [[-20, -8], [18, 2], [-10, 20], [24, -16]].forEach(([dx, dy]) => el('circle', { cx: x + dx, cy: y + dy, r: 4, fill: C.hi }, c));
        } else { // 皮膚
          el('rect', { x: x - 76, y: y - 6, width: 152, height: 22, fill: C.skin }, c);
          el('rect', { x: x - 76, y: y + 16, width: 152, height: 34, fill: '#c98a6a' }, c);
          [-50, -10, 34].forEach((dx) => el('circle', { cx: x + dx, cy: y + 30, r: 6, fill: NEU }, c));
          el('path', { d: `M ${x - 10},${y - 56} L ${x - 10},${y - 16} M ${x - 22},${y - 28} L ${x - 10},${y - 14} L ${x + 2},${y - 28}`, fill: 'none', stroke: C.hi, 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
        }
        text(c, x, 236, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        text(c, x, 272, s, { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
        return c;
      });
      // 刺激 → 反應 的流程
      const chain = [['刺激', C.ink], ['受器', C.hi], ['神經', NEU], ['腦、脊髓', CNS], ['神經', NEU], ['動器', MOT], ['反應', C.ink]];
      const ex1 = ['紅燈的光', '眼', '', '大腦判斷', '', '腿的肌肉', '停下腳步'];
      const ex2 = ['食物香味', '鼻', '', '腦', '', '唾腺', '分泌唾液'];
      const cg = [];
      let cx = 60;
      const centers = [];
      chain.forEach(([s, col], i) => {
        const w = S.textWidth(s, 26) + 28;
        const c = g(P0, { opacity: 0 });
        S.pill(c, cx + w / 2, 400, s, { size: 26, color: col, edge: col });
        if (ex1[i]) text(c, cx + w / 2, 462, ex1[i], { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        if (ex2[i]) text(c, cx + w / 2, 496, ex2[i], { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        if (i < chain.length - 1) arrow(c, cx + w + 10, 400, cx + w + 66, 400, C.ink2, 3);
        centers.push(cx + w / 2);
        cg.push(c);
        cx += w + 76;
      });
      const notes0 = g(P0, { opacity: 0 });
      text(notes0, 600, 572, '中樞神經：腦、脊髓（處理訊息、下達命令）', { 'font-size': 24, 'text-anchor': 'middle', fill: CNS });
      text(notes0, 600, 618, '動器：做出反應的構造 — 肌肉（產生動作）、腺體（分泌物質）', { 'font-size': 24, 'text-anchor': 'middle', fill: MOT });
      const dot0 = pulse(P0);
      tl.addLabel('s0');
      organs.forEach((o, i) => S.show(tl, o, `s0+=${0.2 + i * 0.35}`, 0.4));
      cg.forEach((c, i) => S.show(tl, c, `s0+=${2.1 + i * 0.25}`, 0.3));
      S.drive(tl, (u) => {
        const k = u * (centers.length - 1), i = Math.min(centers.length - 2, Math.floor(k));
        S.place(dot0, { x: S.lerp(centers[i], centers[i + 1], k - i), y: 372 });
        dot0.style.opacity = u > 0 && u < 0.995 ? 1 : 0;
      }, 2.6, 's0+=3.9', 'none');
      S.show(tl, notes0, 's0+=4.6', 0.5);

      // ===== 1 神經元（跨尺度） =====
      const P1 = g(root, { opacity: 0 });
      const NB = [300, 420]; // 細胞本體中心
      const nG = g(P1);
      const dends = [];
      [110, 140, 165, 192, 220, 248, 280].forEach((deg, i) => {
        const a = (deg * Math.PI) / 180, L = 100 + (i % 3) * 14;
        const x1 = NB[0] + Math.cos(a) * 46, y1 = NB[1] + Math.sin(a) * 42;
        const x2 = NB[0] + Math.cos(a) * L, y2 = NB[1] + Math.sin(a) * L;
        const d = el('path', { d: `M ${x1},${y1} L ${x2},${y2}`, stroke: NEU, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, nG);
        [-0.42, 0.42].forEach((da) => {
          const xm = NB[0] + Math.cos(a) * L * 0.62, ym = NB[1] + Math.sin(a) * L * 0.62;
          el('line', { x1: xm, y1: ym, x2: xm + Math.cos(a + da) * 46, y2: ym + Math.sin(a + da) * 46, stroke: NEU, 'stroke-width': 4, 'stroke-linecap': 'round' }, nG);
        });
        el('line', { x1: x2, y1: y2, x2: x2 + Math.cos(a + 0.3) * 26, y2: y2 + Math.sin(a + 0.3) * 26, stroke: NEU, 'stroke-width': 3, 'stroke-linecap': 'round' }, nG);
        dends.push([x2, y2, d]);
      });
      const axon = el('path', { d: `M 352,${NB[1]} C 500,${NB[1] - 12} 640,${NB[1] + 12} 780,${NB[1] - 2} C 880,${NB[1] - 10} 940,${NB[1] + 4} 1000,${NB[1]}`, stroke: NEU, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, nG);
      const terms = [[1062, NB[1] - 52], [1080, NB[1] - 12], [1074, NB[1] + 30], [1054, NB[1] + 66]];
      const termPaths = terms.map(([x, y]) => {
        const tp = el('path', { d: `M 1000,${NB[1]} Q 1030,${(NB[1] + y) / 2} ${x},${y}`, stroke: NEU, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, nG);
        el('circle', { cx: x, cy: y, r: 9, fill: NEU }, nG);
        return tp;
      });
      el('path', { d: S.smoothPath(S.blobPts(NB[0], NB[1], 58, 50, 32)), fill: '#2d5566', stroke: NEU, 'stroke-width': 4 }, nG);
      el('circle', { cx: NB[0] - 4, cy: NB[1] - 2, r: 19, fill: 'rgba(167,150,255,0.55)', stroke: C.nucleus, 'stroke-width': 3 }, nG);
      // 標示
      const lab1 = [
        [dends[5][0], dends[5][1], 250, 150, '樹突：接收訊息', NEU],
        [NB[0], NB[1] + 30, 300, 610, '細胞本體（含細胞核）', C.ink],
        [650, NB[1] + 3, 640, 310, '軸突：把訊息傳出去', NEU],
        [1074, NB[1] + 30, 1000, 560, '末梢：傳給下一個細胞', NEU],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P1, tx, ty, x, y, s, c, { size: 24 }));
      const dir1 = g(P1, { opacity: 0 });
      arrow(dir1, 300, 676, 760, 676, C.hi, 4, 16);
      text(dir1, 790, 684, '訊息傳遞方向（電訊號）', { 'font-size': 24, fill: C.hi, 'font-weight': 700 });
      // 小圖：人體最長的神經元
      const inset = g(P1, { opacity: 0 });
      el('rect', { x: 860, y: 30, width: 312, height: 260, rx: 14, ...FRAME }, inset);
      text(inset, 1016, 64, '人體最長的神經元', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink });
      const ib = S.place(g(inset), { x: 780, y: 62, s: 0.3 });
      S.human(ib, { fill: 'rgba(52,96,122,0.5)', sw: 4 });
      el('path', { d: 'M 600,330 C 612,370 628,400 632,450 L 631,560 L 628,696', stroke: C.hi, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, ib);
      el('circle', { cx: 600, cy: 330, r: 12, fill: C.hi }, ib);
      const iy1 = 62 + 330 * 0.3, iy2 = 62 + 696 * 0.3;
      el('line', { x1: 1046, y1: iy1, x2: 1046, y2: iy2, stroke: C.hi, 'stroke-width': 2.5 }, inset);
      [[iy1, 1], [iy2, -1]].forEach(([y, d]) => el('path', { d: `M 1046,${y} l -7,${d * 12} l 14,0 Z`, fill: C.hi }, inset));
      text(inset, 1060, (iy1 + iy2) / 2 - 6, '約 1 m＊', { 'font-size': 22, fill: C.hi, 'font-weight': 700 });
      text(inset, 1060, (iy1 + iy2) / 2 + 24, '脊髓 → 腳', { 'font-size': 20, fill: C.mute });
      const dots1 = [0, 1].map(() => pulse(P1));
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      lab1.forEach((l, i) => S.show(tl, l, `s1+=${0.7 + i * 0.4}`, 0.35));
      const route1 = sample([[dends[2][0], dends[2][1]], [NB[0], NB[1]], axon, termPaths[1]]);
      dots1.forEach((d, i) => ride(tl, d, route1, 2.2, `s1+=${2.4 + i * 0.9}`, 'power1.in'));
      S.show(tl, dir1, 's1+=2.6', 0.4);
      S.show(tl, inset, 's1+=4.4', 0.5);

      // ===== 2 中樞神經與周圍神經 =====
      const P2 = g(root, { opacity: 0 });
      const B2 = g(P2, { transform: S.xf({ x: -270, y: 0, s: 1 }) });
      S.human(B2, { fill: 'rgba(44,82,104,0.45)', sw: 2 });
      const pns = g(B2);
      const nervesD = [];
      // 脊神經：手臂、軀幹、腿（左右對稱）
      ['M 600,176 C 640,172 670,180 680,200 L 688,260 L 696,320 L 703,370 L 708,414',
        'M 600,356 C 615,380 630,402 632,440 L 631,520 L 629,600 L 626,684',
        ...[204, 232, 260, 288, 318].map((y) => `M 600,${y} Q 622,${y + 2} 648,${y + 14}`)]
        .forEach((d) => { nervesD.push(d); nervesD.push(d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, x, y) => `${(1200 - +x).toFixed(0)},${y}`)); });
      const pnsPaths = nervesD.map((d) => el('path', { d, stroke: PNS, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round', opacity: 0.9 }, pns));
      // 腦神經（臉部）
      const cran = g(B2);
      ['M 590,96 L 582,100', 'M 610,96 L 618,100', 'M 594,104 C 588,112 586,120 590,126', 'M 606,104 C 612,112 614,120 610,126', 'M 600,108 L 600,118'].forEach((d) => el('path', { d, stroke: PNS, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, cran));
      const cns = g(B2);
      el('ellipse', { cx: 600, cy: 88, rx: 26, ry: 21, fill: CNS, opacity: 0.9 }, cns);
      el('line', { x1: 600, y1: 108, x2: 600, y2: 362, stroke: CNS, 'stroke-width': 7, 'stroke-linecap': 'round' }, cns);
      const boxA = g(P2, { opacity: 0 });
      el('rect', { x: 560, y: 50, width: 610, height: 250, rx: 16, fill: 'rgba(255,209,102,0.06)', stroke: CNS, 'stroke-width': 2 }, boxA);
      text(boxA, 590, 100, '中樞神經', { 'font-size': 32, 'font-weight': 700, fill: CNS });
      text(boxA, 590, 170, '腦', { 'font-size': 28, 'font-weight': 700 });
      text(boxA, 650, 170, '在頭骨裡', { 'font-size': 24, fill: C.mute });
      text(boxA, 590, 250, '脊髓', { 'font-size': 28, 'font-weight': 700 });
      text(boxA, 676, 250, '在脊椎骨裡，連接腦和身體', { 'font-size': 24, fill: C.mute });
      [[330, 88, 560, 160], [330, 250, 560, 240]].forEach(([x1, y1, x2, y2]) => { el('line', { x1, y1, x2, y2, stroke: CNS, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, boxA); el('circle', { cx: x1, cy: y1, r: 6, fill: CNS, stroke: C.bg, 'stroke-width': 2 }, boxA); });
      const boxB = g(P2, { opacity: 0 });
      el('rect', { x: 560, y: 340, width: 610, height: 300, rx: 16, fill: 'rgba(255,179,92,0.06)', stroke: PNS, 'stroke-width': 2 }, boxB);
      text(boxB, 590, 390, '周圍神經', { 'font-size': 32, 'font-weight': 700, fill: PNS });
      text(boxB, 590, 456, '腦神經', { 'font-size': 28, 'font-weight': 700 });
      text(boxB, 690, 456, '由腦發出，12 對', { 'font-size': 24, fill: C.mute });
      text(boxB, 590, 530, '脊神經', { 'font-size': 28, 'font-weight': 700 });
      text(boxB, 690, 530, '由脊髓發出，31 對', { 'font-size': 24, fill: C.mute });
      text(boxB, 590, 604, '分布到全身，連接受器、動器和中樞', { 'font-size': 24, fill: C.ink2 });
      [[318, 103, 560, 446], [408, 290, 560, 520]].forEach(([x1, y1, x2, y2]) => { el('line', { x1, y1, x2, y2, stroke: PNS, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, boxB); el('circle', { cx: x1, cy: y1, r: 6, fill: PNS, stroke: C.bg, 'stroke-width': 2 }, boxB); });
      // 訊號：手 → 脊髓 → 腦
      const route2 = sample([[708 - 270, 414], [703 - 270, 370], [696 - 270, 320], [688 - 270, 260], [680 - 270, 200], [670 - 270, 180], [640 - 270, 172], [600 - 270, 176], [330, 110], [330, 88]]);
      const dot2 = pulse(P2);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      gsap.set([cns, cran, pns], { opacity: 0 });
      S.show(tl, cns, 's2+=0.7', 0.5);
      S.show(tl, boxA, 's2+=1.0', 0.5);
      S.show(tl, [pns, cran], 's2+=2.0', 0.3);
      pnsPaths.forEach((p) => S.drawOn(tl, p, 1.2, 's2+=2.0'));
      S.show(tl, boxB, 's2+=2.8', 0.5);
      ride(tl, dot2, route2, 1.8, 's2+=3.8', 'power1.inOut');

      // ===== 3 腦 =====
      const P3 = g(root, { opacity: 0 });
      const CER = '#e8a0b4', CBL = '#b9a0f0', STEM = '#f0c080';
      const cord3 = el('path', { d: 'M 478,560 L 478,700 L 508,700 L 508,560 Z', fill: CNS, opacity: 0.85 }, P3);
      const stem = el('path', { d: 'M 452,392 C 458,450 470,505 478,562 L 508,562 C 506,505 508,452 522,400 Z', fill: STEM, stroke: '#fff3d6', 'stroke-width': 2 }, P3);
      const cbl = g(P3);
      el('path', { d: 'M 516,432 C 528,396 622,384 684,404 C 720,420 710,474 662,488 C 612,502 540,494 518,462 Z', fill: CBL, stroke: '#e2d6ff', 'stroke-width': 2 }, cbl);
      [0, 1, 2, 3].forEach((k) => el('path', { d: `M ${534 + k * 4},${426 + k * 16} C ${580},${414 + k * 16} ${650},${414 + k * 16} ${694 - k * 8},${428 + k * 14}`, stroke: '#8f78c8', 'stroke-width': 2.5, fill: 'none' }, cbl));
      const cer = g(P3);
      el('path', { d: 'M 180,330 C 160,220 230,110 370,90 C 500,70 640,110 690,210 C 722,282 702,356 650,390 C 600,420 520,402 470,412 C 400,426 330,420 270,402 C 220,386 190,364 180,330 Z', fill: CER, stroke: '#ffd6e0', 'stroke-width': 3 }, cer);
      ['M 250,170 C 280,190 270,230 300,250 C 330,270 320,320 350,340', 'M 360,110 C 380,150 350,180 380,210 C 410,240 390,280 420,300', 'M 470,100 C 470,140 500,160 490,200 C 480,240 520,260 510,300 C 505,330 530,350 540,380', 'M 580,130 C 560,170 600,190 590,230 C 580,270 620,290 610,330', 'M 660,200 C 630,220 660,260 640,290 C 625,315 650,340 640,370', 'M 210,280 C 240,290 250,320 240,350', 'M 300,140 C 320,160 300,190 320,210']
        .forEach((d) => el('path', { d, stroke: '#b86a80', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, cer));
      text(P3, 200, 470, '（腦的側面，臉朝左）＊', { 'font-size': 20, fill: C.mute });
      const blk = (y, name, col, lines) => {
        const b = g(P3, { opacity: 0 });
        text(b, 800, y, name, { 'font-size': 32, 'font-weight': 700, fill: col });
        lines.forEach((s, i) => text(b, 800, y + 38 + i * 32, s, { 'font-size': 24, fill: C.ink }));
        return b;
      };
      const L3 = [
        [blk(100, '大腦', CER, ['感覺、思考、記憶、語言', '控制意識行為（例如寫字）']), [600, 170], [790, 100]],
        [blk(270, '小腦', CBL, ['協調動作、維持身體平衡']), [640, 445], [790, 270]],
        [blk(480, '腦幹', STEM, ['控制心跳、呼吸等', '維持生命的活動']), [488, 545], [790, 480]],
        [blk(600, '脊髓', CNS, ['傳遞腦和身體之間的訊息', '也是部分反射的中樞']), [494, 640], [790, 600]],
      ];
      const leads = L3.map(([, [x1, y1], [x2, y2]], i) => {
        const l = g(P3, { opacity: 0 });
        el('line', { x1, y1, x2: x2 - 8, y2: y2 - 10, stroke: [CER, CBL, STEM, CNS][i], 'stroke-width': 2.5 }, l);
        el('circle', { cx: x1, cy: y1, r: 7, fill: [CER, CBL, STEM, CNS][i], stroke: C.bg, 'stroke-width': 2 }, l);
        return l;
      });
      const glow = (e, pos) => tl.fromTo(e, { opacity: 0.45 }, { opacity: 1, duration: 0.4, immediateRender: false }, pos);
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      gsap.set([cer, cbl, stem, cord3], { opacity: 0.45 });
      [cer, cbl, stem, cord3].forEach((e, i) => { glow(e, `s3+=${0.8 + i * 1.1}`); S.show(tl, L3[i][0], `s3+=${0.9 + i * 1.1}`, 0.4); S.show(tl, leads[i], `s3+=${0.9 + i * 1.1}`, 0.4); });

      // ===== 4 感覺在大腦產生；感覺疲勞；視覺暫留 =====
      const P4 = g(root, { opacity: 0 });
      const PX4 = [40, 420, 800];
      PX4.forEach((x) => el('rect', { x, y: 70, width: 360, height: 560, rx: 18, ...FRAME }, P4));
      [['感覺在大腦產生', C.hi], ['感覺疲勞', '#ffb35c'], ['視覺暫留', '#8fd0e6']].forEach(([s, c], i) => text(P4, PX4[i] + 180, 118, s, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: c }));
      // (a) 眼 → 神經 → 大腦
      const a4 = g(P4);
      el('path', { d: 'M 70,330 Q 120,290 170,330 Q 120,370 70,330 Z', fill: '#f4f1ea', stroke: '#c9d6dc', 'stroke-width': 3 }, a4);
      el('circle', { cx: 120, cy: 330, r: 17, fill: '#5a8fc2' }, a4);
      el('circle', { cx: 120, cy: 330, r: 7, fill: '#0d1822' }, a4);
      const br4 = el('ellipse', { cx: 300, cy: 230, rx: 70, ry: 52, fill: '#e8a0b4', opacity: 0.45, stroke: '#ffd6e0', 'stroke-width': 2 }, a4);
      const opt = el('path', { d: 'M 172,330 C 220,330 240,280 262,268', stroke: NEU, 'stroke-width': 4, fill: 'none' }, a4);
      const ray4 = el('line', { x1: 60, y1: 240, x2: 100, y2: 316, stroke: C.hi, 'stroke-width': 4, 'stroke-dasharray': '8 6', opacity: 0 }, a4);
      const seen = S.pill(g(P4, { opacity: 0 }), 300, 150, '看見了！', { size: 22, color: C.hi, edge: C.hi }).parentNode;
      text(a4, 220, 440, '受器只負責接受刺激，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(a4, 220, 474, '訊息傳到大腦後，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(a4, 220, 508, '才產生「感覺」。', { 'font-size': 22, 'text-anchor': 'middle' });
      text(a4, 220, 576, '例：看見、聽到、覺得燙，', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(a4, 220, 604, '都是在大腦產生的感覺', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const dot4 = pulse(P4, C.hi, 7);
      const route4 = sample([[172, 330], opt, [300, 230]]);
      // (b) 感覺疲勞：曲線
      const b4 = g(P4);
      el('path', { d: 'M 470,232 C 472,262 492,282 496,300 C 498,312 486,316 476,310 C 470,316 456,312 458,300', fill: 'none', stroke: C.skin, 'stroke-width': 6, 'stroke-linecap': 'round' }, b4);
      const odor = [0, 1, 2].map((k) => el('path', { d: `M 640,${206 + k * 28} q -14,-10 -28,0 q -14,10 -28,0 q -14,-10 -28,0`, fill: 'none', stroke: '#ffb35c', 'stroke-width': 3, opacity: 0 }, b4));
      text(b4, 600, 330, '麵包的香味', { 'font-size': 20, 'text-anchor': 'middle', fill: '#ffb35c' });
      el('line', { x1: 460, y1: 380, x2: 460, y2: 500, stroke: C.ink2, 'stroke-width': 2 }, b4);
      el('line', { x1: 460, y1: 500, x2: 750, y2: 500, stroke: C.ink2, 'stroke-width': 2 }, b4);
      text(b4, 470, 376, '覺得多香＊', { 'font-size': 20, fill: C.mute });
      text(b4, 750, 528, '時間 →', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      const fat = el('path', { d: 'M 462,400 C 520,404 560,470 620,486 C 660,494 700,496 746,496', fill: 'none', stroke: '#ffb35c', 'stroke-width': 4 }, b4);
      text(b4, 600, 572, '同一種刺激持續一段時間，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(b4, 600, 604, '感覺會變弱（嗅覺最明顯）', { 'font-size': 22, 'text-anchor': 'middle' });
      // (c) 視覺暫留：翻轉卡片（鳥 ＋ 籠子）
      const c4 = g(P4);
      el('line', { x1: 860, y1: 300, x2: 1140, y2: 300, stroke: C.ink2, 'stroke-width': 2, 'stroke-dasharray': '4 6' }, c4);
      const card = g(c4, { transform: 'translate(980,300)' });
      const cardIn = g(card);
      el('rect', { x: -90, y: -90, width: 180, height: 180, rx: 14, fill: '#f4f1ea' }, cardIn);
      const bird = g(cardIn);
      el('ellipse', { cx: 0, cy: 10, rx: 34, ry: 24, fill: '#e8862a' }, bird);
      el('circle', { cx: 26, cy: -14, r: 16, fill: '#e8862a' }, bird);
      el('path', { d: 'M 40,-16 l 14,4 l -14,4 Z', fill: '#c0392b' }, bird);
      el('circle', { cx: 30, cy: -18, r: 3, fill: '#13232b' }, bird);
      el('path', { d: 'M -30,4 l -24,-10 l 4,18 Z', fill: '#c06a1a' }, bird);
      const cage = g(cardIn, { style: 'opacity:0' });
      for (let k = -3; k <= 3; k++) el('line', { x1: k * 22, y1: -62, x2: k * 22, y2: 62, stroke: '#3a4a56', 'stroke-width': 4 }, cage);
      el('path', { d: 'M -70,-62 Q 0,-100 70,-62', fill: 'none', stroke: '#3a4a56', 'stroke-width': 4 }, cage);
      el('line', { x1: -72, y1: 62, x2: 72, y2: 62, stroke: '#3a4a56', 'stroke-width': 6 }, cage);
      const both = text(c4, 980, 436, '', { 'font-size': 22, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      text(c4, 980, 532, '影像消失後，視覺還會', { 'font-size': 22, 'text-anchor': 'middle' });
      text(c4, 980, 564, '保留很短的時間', { 'font-size': 22, 'text-anchor': 'middle' });
      text(c4, 980, 604, '例：快速翻轉的卡片、動畫', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      tl.fromTo(ray4, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 's4+=0.7');
      ride(tl, dot4, route4, 1, 's4+=1.0', 'power1.in');
      tl.fromTo(br4, { opacity: 0.45 }, { opacity: 1, duration: 0.3, immediateRender: false }, 's4+=2.0');
      S.show(tl, seen, 's4+=2.0', 0.3);
      S.show(tl, odor, 's4+=2.4', 0.4);
      S.drawOn(tl, fat, 2, 's4+=2.6');
      tl.fromTo(odor, { opacity: 1 }, { opacity: 0.25, duration: 1.6, immediateRender: false }, 's4+=3.0');
      S.drive(tl, (u) => {
        // 一開始慢慢翻，之後越翻越快；快的時候兩個影像疊在一起
        const ph = 14 * u * u;
        const k = Math.abs(Math.cos(ph * Math.PI));
        const fast = S.smoothstep(0.55, 0.8, u);
        cardIn.setAttribute('transform', `scale(${Math.max(0.04, S.lerp(k, 1, fast)).toFixed(3)},1)`);
        const front = Math.floor(ph + 0.5) % 2 === 0;
        bird.style.opacity = u <= 0 ? 1 : S.lerp(front ? 1 : 0, 0.85, fast);
        cage.style.opacity = u <= 0 ? 0 : S.lerp(front ? 0 : 1, 0.85, fast);
        both.textContent = fast > 0.5 ? '看起來：鳥在籠子裡' : '';
      }, 3.6, 's4+=2.6', 'none');

      // ===== 5 反射：縮手 =====
      const P5 = g(root, { opacity: 0 });
      // 熱鍋（在爐火上）
      const pot = g(P5);
      el('ellipse', { cx: 125, cy: 664, rx: 104, ry: 12, fill: '#ff6b4a', opacity: 0.4 }, pot);
      [72, 104, 136, 168].forEach((x) => { el('path', { d: `M ${x},668 C ${x - 9},658 ${x - 5},646 ${x},636 C ${x + 5},646 ${x + 9},658 ${x},668 Z`, fill: '#ff8a4a' }, pot); el('path', { d: `M ${x},668 C ${x - 4},662 ${x - 3},656 ${x},650 C ${x + 3},656 ${x + 4},662 ${x},668 Z`, fill: C.hi }, pot); });
      el('path', { d: 'M 40,566 L 210,566 L 204,632 C 202,644 192,650 180,650 L 70,650 C 58,650 48,644 46,632 Z', fill: '#5a6670', stroke: '#9aa8b1', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pot);
      ['M 42,580 C 20,580 12,584 12,592 C 12,600 20,604 42,604', 'M 208,580 C 230,580 238,584 238,592 C 238,600 230,604 208,604'].forEach((d) => el('path', { d, fill: 'none', stroke: '#9aa8b1', 'stroke-width': 6, 'stroke-linecap': 'round' }, pot)); // 把手
      el('rect', { x: 30, y: 552, width: 190, height: 16, rx: 8, fill: '#aab8c1', stroke: '#c9d6dc', 'stroke-width': 1.5 }, pot); // 鍋緣
      el('rect', { x: 60, y: 576, width: 10, height: 60, rx: 5, fill: '#fff', opacity: 0.12 }, pot);
      text(pot, 125, 622, '熱鍋', { 'font-size': 24, 'text-anchor': 'middle', fill: '#fff', 'font-weight': 700 });
      [62, 100, 138].forEach((x) => el('path', { d: `M ${x},546 q -10,-11 0,-22 q 10,-11 0,-22`, fill: 'none', stroke: '#ff9a7a', 'stroke-width': 3, 'stroke-linecap': 'round' }, pot));
      // 手臂：上臂固定，前臂繞手肘轉。局部座標：+x 沿著手臂往手的方向、−y 是手臂的上側（手背）
      const SH = [600, 244], EL = [440, 364], BA = 143.13, FA = 145;
      const map = (deg) => { const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180); return (x, y) => [x * c + y * s, x * s - y * c]; };
      const UA = map(BA), FO = map(FA);
      const U = (x, y) => { const [a, b] = UA(x, y); return [SH[0] + a, SH[1] + b]; };
      const SKIN = C.skin, SK_E = '#ffdcc4', CRE = '#c98762';
      const fore = S.place(g(P5), { x: EL[0], y: EL[1] });
      const fi = g(fore, { transform: `rotate(${FA}) scale(1,-1)` });
      blob(fi, [{ s: 'M 240,-17 Q 264,-21 286,-16', w: 11 }, { s: 'M 244,-13 Q 276,-16 300,-10', w: 13 }, { s: 'M 246,-8 Q 286,-9 311,-1', w: 14 }], '#e3a07a', SK_E, 1.6); // 後面的手指（小指、無名指、中指）
      blob(fi, [
        { d: 'M 0,-24 C 30,-29 64,-27 100,-22 C 140,-18 160,-17 180,-16 L 180,16 C 150,18 110,22 64,26 C 32,28 10,27 0,24 A 24,24 0 0,1 0,-24 Z' }, // 前臂
        { d: 'M 172,-17 C 200,-21 228,-21 246,-17 C 257,-13 260,-2 256,9 C 249,19 228,23 204,23 C 190,23 180,20 172,17 Z' }, // 手掌
        { s: 'M 210,12 Q 236,24 258,27', w: 15 }, // 拇指
        { s: 'M 248,-2 Q 282,0 305,8', w: 15 }, // 食指：指尖碰到熱鍋
      ], SKIN, SK_E, 2);
      [[270, -1], [289, 3]].forEach(([x, y]) => el('path', { d: `M ${x},${y - 6} q 2,6 0,12`, fill: 'none', stroke: CRE, 'stroke-width': 1.5, opacity: 0.6 }, fi)); // 指節
      el('path', { d: 'M 293,-1 q 8,1 12,5', fill: 'none', stroke: '#ffe8da', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, fi); // 指甲
      el('path', { d: 'M 216,8 q 10,-4 22,-2', fill: 'none', stroke: CRE, 'stroke-width': 1.5, opacity: 0.45 }, fi);
      el('path', { d: 'M 168,-14 q -3,14 0,28', fill: 'none', stroke: CRE, 'stroke-width': 1.5, opacity: 0.45 }, fi); // 手腕
      const ua = g(P5, { transform: `translate(${SH[0]},${SH[1]}) rotate(${BA}) scale(1,-1)` });
      blob(ua, [{ d: 'M -30,-33 C 20,-37 60,-40 100,-38 C 140,-36 176,-29 200,-23 A 23,23 0 0,1 200,23 C 170,27 120,31 80,32 C 40,33 0,34 -30,33 Z' }], SKIN, SK_E, 2);
      el('path', { d: 'M -50,-42 C -10,-47 26,-47 44,-44 C 50,-20 50,20 44,42 C 20,44 -10,44 -50,42 C -64,20 -64,-24 -50,-42 Z', fill: '#4f7896', stroke: '#8db6d2', 'stroke-width': 2 }, ua); // 袖子
      el('path', { d: 'M 36,-44 C 41,-20 41,20 36,42', fill: 'none', stroke: '#8db6d2', 'stroke-width': 2, opacity: 0.7 }, ua);
      // 動器：上臂前側的肌肉（收縮時變短變粗，把前臂拉起來）
      const musc = el('ellipse', { cx: 108, cy: -15, rx: 50, ry: 13, fill: C.muscle, stroke: '#ffd0d0', 'stroke-width': 2, opacity: 0.9 }, ua);
      // 指尖的受器到手肘的感覺神經（在前臂群組裡，縮手時跟著轉）
      const TIP = FO(311, 9);
      const sensF = el('path', { d: curve([[311, 9], [290, 5], [250, 2], [210, 4], [150, 6], [80, 6], [20, 3], [0, 0]].map(([x, y]) => FO(x, y))), stroke: SENS, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, fore);
      el('circle', { cx: TIP[0], cy: TIP[1], r: 7, fill: SENS, stroke: '#fff', 'stroke-width': 2 }, fore);
      // 脊髓橫切面（上面是背側、下面是腹側）
      el('ellipse', { cx: 800, cy: 430, rx: 84, ry: 64, fill: '#24384a', stroke: '#9fc1d3', 'stroke-width': 3 }, P5);
      el('path', { d: 'M 0,-18 C -6,-34 -22,-50 -38,-48 C -48,-46 -44,-30 -30,-16 C -40,-6 -60,8 -58,24 C -56,40 -32,42 -16,28 C -8,20 -4,16 0,16 C 4,16 8,20 16,28 C 32,42 56,40 58,24 C 60,8 40,-6 30,-16 C 44,-30 48,-46 38,-48 C 22,-50 6,-34 0,-18 Z', fill: '#6b7f8a', transform: 'translate(800,430)' }, P5);
      el('circle', { cx: 800, cy: 432, r: 4, fill: '#24384a' }, P5);
      el('path', { d: 'M 800,367 L 800,382 M 800,493 L 800,480', stroke: '#9fc1d3', 'stroke-width': 2.5 }, P5);
      text(P5, 820, 528, '脊髓（橫切面）', { 'font-size': 22, 'text-anchor': 'middle', fill: CNS });
      // 神經路徑：感覺神經沿上臂到脊髓背側 → 脊髓 → 運動神經從腹側出來，回到上臂的肌肉
      const sens2 = el('path', { d: curve([EL, U(160, 8), U(100, 9), U(40, 8), U(0, 6), [652, 240], [726, 270], [756, 326], [762, 386]]), stroke: SENS, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, P5);
      const inter = el('path', { d: 'M 762,386 C 774,410 772,440 752,452', stroke: CNS, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, P5);
      const mot = el('path', { d: 'M 752,452 C 744,466 738,476 728,488 C 690,530 620,500 592,446 C 568,402 540,340 508,298', stroke: MOT, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, P5);
      const up = el('path', { d: 'M 806,368 C 830,280 900,200 990,166', stroke: CNS, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '10 8' }, P5);
      // 大腦
      const brain5 = g(P5);
      el('path', { d: 'M 980,160 C 960,110 1010,60 1070,62 C 1130,64 1170,110 1160,160 C 1150,196 1100,206 1060,200 C 1020,196 990,190 980,160 Z', fill: '#e8a0b4', stroke: '#ffd6e0', 'stroke-width': 2 }, brain5);
      ['M 1010,110 C 1030,130 1010,160 1040,180', 'M 1070,80 C 1060,120 1090,140 1080,180', 'M 1120,90 C 1110,130 1140,150 1130,180'].forEach((d) => el('path', { d, stroke: '#b86a80', 'stroke-width': 3, fill: 'none' }, brain5));
      text(P5, 1070, 236, '大腦', { 'font-size': 24, 'text-anchor': 'middle', fill: '#e8a0b4', 'font-weight': 700 });
      const pain = g(P5, { opacity: 0 });
      S.pill(pain, 1070, 290, '好燙！好痛！', { size: 26, color: '#ff8f8f', edge: '#ff8f8f' });
      const upTxt = g(P5, { opacity: 0 });
      text(upTxt, 878, 340, '訊息也傳到大腦', { 'font-size': 22, fill: CNS });
      text(upTxt, 878, 372, '→ 產生痛的感覺', { 'font-size': 22, fill: CNS });
      const onPath = (pa, f) => { const q = pa.getPointAtLength(pa.getTotalLength() * f); return [q.x, q.y]; };
      const lab5 = [
        [EL[0] + TIP[0], EL[1] + TIP[1], 96, 468, '受器（皮膚）', SENS],
        [...onPath(sens2, 0.66), 720, 176, '感覺神經', SENS],
        [...onPath(mot, 0.3), 640, 580, '運動神經', MOT],
        [...U(86, -20), 430, 180, '動器（肌肉）', MOT],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P5, tx, ty, x, y, s, c, { size: 24 }));
      const order = [g(P5, { opacity: 0 }), g(P5, { opacity: 0 })];
      S.pill(order[0], 150, 60, '① 先縮手（反射）', { size: 24, color: C.hi, edge: C.hi });
      S.pill(order[1], 150, 112, '② 才覺得痛', { size: 24, color: '#ff8f8f', edge: '#ff8f8f' });
      // 下方：反射路徑
      const ch5 = [['受器', SENS], ['感覺神經', SENS], ['脊髓', CNS], ['運動神經', MOT], ['動器', MOT]];
      const chain5 = [];
      let x5 = 310;
      ch5.forEach(([s, c], i) => {
        const w = S.textWidth(s, 22) + 26, q = g(P5, { opacity: 0.25 });
        S.pill(q, x5 + w / 2, 690, s, { size: 22, color: c, edge: c });
        if (i < ch5.length - 1) arrow(q, x5 + w + 6, 690, x5 + w + 36, 690, C.ink2, 2.5, 10);
        chain5.push(q); x5 += w + 44;
      });
      const dot5 = pulse(P5, C.hi, 8), dot5b = pulse(P5, CNS, 7);
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      gsap.set(lab5, { opacity: 0 });
      S.show(tl, lab5[0], 's5+=0.6', 0.3);
      tl.to(chain5[0], { opacity: 1, duration: 0.3 }, 's5+=0.6');
      // 1. 感覺神經（前臂上的一段在前臂群組內，先走完再縮手）
      const fRoute = sample([sensF]);
      S.drive(tl, (u) => { const [lx, ly] = fRoute(u); S.place(dot5, { x: EL[0] + lx, y: EL[1] + ly }); dot5.style.opacity = u > 0 && u < 0.995 ? 1 : 0; }, 0.6, 's5+=1.0', 'none');
      S.show(tl, lab5[1], 's5+=1.2', 0.3);
      tl.to(chain5[1], { opacity: 1, duration: 0.3 }, 's5+=1.2');
      ride(tl, dot5, sample([sens2]), 0.9, 's5+=1.6');
      tl.to(chain5[2], { opacity: 1, duration: 0.3 }, 's5+=2.4');
      ride(tl, dot5, sample([inter, mot]), 1.1, 's5+=2.5');
      S.show(tl, lab5[2], 's5+=2.8', 0.3);
      tl.to(chain5[3], { opacity: 1, duration: 0.3 }, 's5+=2.8');
      S.show(tl, lab5[3], 's5+=3.5', 0.3);
      tl.to(chain5[4], { opacity: 1, duration: 0.3 }, 's5+=3.5');
      tl.fromTo(musc, { attr: { rx: 50, ry: 13 } }, { attr: { rx: 42, ry: 19 }, duration: 0.3, immediateRender: false }, 's5+=3.6');
      // 縮手：前臂繞手肘轉；「受器」標示的引線跟著指尖移動
      const recLine = lab5[0].querySelector('line'), recDot = lab5[0].lastChild;
      S.drive(tl, (u) => {
        const r = 62 * u, a = (r * Math.PI) / 180;
        S.place(fore, { x: EL[0], y: EL[1], r });
        const fx = EL[0] + TIP[0] * Math.cos(a) - TIP[1] * Math.sin(a), fy = EL[1] + TIP[0] * Math.sin(a) + TIP[1] * Math.cos(a);
        recLine.setAttribute('x1', fx); recLine.setAttribute('y1', fy);
        recDot.setAttribute('cx', fx); recDot.setAttribute('cy', fy);
      }, 0.45, 's5+=3.6', 'power2.out');
      S.show(tl, order[0], 's5+=3.8', 0.3);
      ride(tl, dot5b, sample([up]), 1.2, 's5+=4.0');
      S.show(tl, upTxt, 's5+=4.2', 0.4);
      S.show(tl, pain, 's5+=5.2', 0.3);
      S.show(tl, order[1], 's5+=5.3', 0.3);

      // ===== 6 意識行為 vs 反射；反應時間 =====
      const P6 = g(root, { opacity: 0 });
      const panel = (x0, title, col, viaBrain) => {
        const p = g(P6);
        const cx = x0 + 270;
        el('rect', { x: x0, y: 40, width: 540, height: 440, rx: 18, ...FRAME }, p);
        text(p, cx, 86, title, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: col });
        el('ellipse', { cx, cy: 160, rx: 64, ry: 40, fill: viaBrain ? '#e8a0b4' : 'rgba(232,160,180,0.2)', stroke: '#ffd6e0', 'stroke-width': 2 }, p);
        text(p, cx, 168, '大腦', { 'font-size': 22, 'text-anchor': 'middle', fill: viaBrain ? '#3a1f28' : C.mute, 'font-weight': 700 });
        el('line', { x1: cx, y1: 200, x2: cx, y2: 420, stroke: CNS, 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.85 }, p);
        text(p, cx + 18, 300, '脊髓', { 'font-size': 20, fill: CNS });
        S.pill(p, cx - 190, 420, '受器', { size: 22, color: SENS, edge: SENS });
        S.pill(p, cx + 190, 420, '動器', { size: 22, color: MOT, edge: MOT });
        const a = el('path', { d: `M ${cx - 160},420 C ${cx - 100},420 ${cx - 40},400 ${cx - 8},372`, stroke: SENS, 'stroke-width': 4, fill: 'none' }, p);
        const b = el('path', { d: `M ${cx + 8},388 C ${cx + 40},410 ${cx + 100},420 ${cx + 160},420`, stroke: MOT, 'stroke-width': 4, fill: 'none' }, p);
        const parts = viaBrain ? [a, [cx, 372], [cx, 200], [cx, 160], [cx, 200], [cx, 388], b] : [a, [cx, 372], [cx, 388], b];
        if (!viaBrain) { el('line', { x1: cx - 26, y1: 206, x2: cx + 26, y2: 250, stroke: '#ff7a66', 'stroke-width': 4 }, p); el('line', { x1: cx + 26, y1: 206, x2: cx - 26, y2: 250, stroke: '#ff7a66', 'stroke-width': 4 }, p); text(p, cx + 40, 236, '不經大腦', { 'font-size': 20, fill: '#ff7a66' }); }
        return { route: sample(parts), cx };
      };
      const pv = panel(40, '意識行為（經過大腦）', '#e8a0b4', true);
      const pr = panel(620, '反射（不經大腦思考）', C.hi, false);
      text(P6, 310, 520, '例：被蚊子叮，用手去打；看到紅燈停下來', { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink2 });
      text(P6, 890, 520, '例：碰到燙的東西縮手、膝反射、眨眼', { 'font-size': 21, 'text-anchor': 'middle', fill: C.ink2 });
      const dv = pulse(P6, C.hi, 8), dr = pulse(P6, C.hi, 8);
      const doneV = g(P6, { opacity: 0 }), doneR = g(P6, { opacity: 0 });
      S.pill(doneV, pv.cx + 190, 360, '較慢', { size: 22, color: C.ink, edge: C.ink2 });
      S.pill(doneR, pr.cx + 190, 360, '較快', { size: 22, color: C.hi, edge: C.hi });
      const rt = g(P6, { opacity: 0 });
      el('rect', { x: 40, y: 560, width: 1120, height: 140, rx: 16, fill: 'rgba(255,209,102,0.06)', stroke: '#4a5a3a', 'stroke-width': 2 }, rt);
      // 小尺
      el('rect', { x: 76, y: 576, width: 26, height: 110, rx: 3, fill: '#e9dcb0' }, rt);
      for (let i = 0; i < 9; i++) el('line', { x1: 76, y1: 586 + i * 11, x2: i % 2 ? 86 : 92, y2: 586 + i * 11, stroke: '#6b5a2a', 'stroke-width': 2 }, rt);
      text(rt, 130, 612, '反應時間：從受到刺激到做出反應所經過的時間', { 'font-size': 26, 'font-weight': 700, fill: C.hi });
      text(rt, 130, 656, '接尺實驗：尺落下的距離越短，反應時間越短；一般人約 0.2 秒＊', { 'font-size': 22, fill: C.ink });
      text(rt, 130, 686, '疲勞、分心時，反應時間會變長', { 'font-size': 20, fill: C.mute });
      tl.addLabel('s6');
      S.hide(tl, P5, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.4);
      const v = 260; // 兩個訊號點同速前進
      ride(tl, dv, pv.route, pv.route.len / v, 's6+=1.0');
      ride(tl, dr, pr.route, pr.route.len / v, 's6+=1.0');
      S.show(tl, doneR, `s6+=${1.0 + pr.route.len / v}`, 0.3);
      S.show(tl, doneV, `s6+=${1.0 + pv.route.len / v}`, 0.3);
      S.show(tl, rt, `s6+=${1.4 + pv.route.len / v}`, 0.5);

      return {
        tl,
        notes: [
          '＊動器包括肌肉和腺體。受器和動器之間的訊息，都要經過神經傳遞。',
          '＊示意：神經元畫得非常大，樹突、軸突的數目和長短都簡化了。人體最長的神經元從脊髓延伸到腳，軸突可長達約 1 m（依身高而不同）。神經元和神經元之間是以化學物質傳遞訊息（補充）。',
          '＊腦由頭骨保護，脊髓由脊椎骨保護。腦神經和脊神經的對數是人體的數目。',
          '＊示意：腦的形狀簡化了。喝酒後走路不穩，和小腦的作用受影響有關；脊髓受傷時，受傷處以下的感覺和動作可能會消失。',
          '＊示意：感覺強弱的曲線只是示意，不同的人、不同的刺激，變化快慢都不一樣。',
          '＊示意：神經元畫得很簡化。頸部以下的反射（例如縮手、膝反射）中樞在脊髓；眨眼、打噴嚏、咳嗽、瞳孔縮小等反射，中樞在腦幹。',
          '＊反應時間因人、因狀況而不同，0.2 秒只是約略值；可以在「反應時間」互動中測測看自己的反應時間。',
        ],
        steps: [
          '生物能察覺環境的變化（<b>刺激</b>）並產生<b>反應</b>：<b>受器</b>（眼、耳、鼻、舌、皮膚等感覺器官）接受刺激，訊息經<b>神經</b>傳到腦或脊髓，再傳到<b>動器</b>（肌肉、腺體）產生反應。',
          '神經系統由<b>神經元</b>（神經細胞）組成。<b>樹突</b>接收訊息，經過<b>細胞本體</b>，再由<b>軸突</b>傳出去；訊息在神經元上以<b>電訊號</b>傳遞。',
          '<b>中樞神經</b>包括<b>腦</b>和<b>脊髓</b>；由腦發出的<b>腦神經</b>和由脊髓發出的<b>脊神經</b>分布到全身，合稱<b>周圍神經</b>。',
          '腦分為<b>大腦</b>、<b>小腦</b>、<b>腦幹</b>：大腦負責感覺、思考、記憶，控制意識行為；小腦協調動作、維持<b>平衡</b>；腦幹控制<b>心跳</b>、<b>呼吸</b>等維持生命的活動。',
          '<b>感覺</b>是在<b>大腦</b>產生的。同一種刺激持續太久，感覺會變弱，稱為<b>感覺疲勞</b>；影像消失後，視覺還會保留很短的時間，稱為<b>視覺暫留</b>。',
          '<b>反射</b>不經大腦思考，反應很快。手碰到很燙的東西會立刻縮回：受器 → 感覺神經 → <b>脊髓</b> → 運動神經 → 動器；之後訊息才傳到大腦，產生<b>痛</b>的感覺。',
          '<b>意識行為</b>要經過<b>大腦</b>判斷；<b>反射</b>不經大腦，路徑較短、反應較快。從受到刺激到做出反應所經過的時間，稱為<b>反應時間</b>。',
        ],
      };
    },
  });
})();
