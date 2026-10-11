/* 4-4 血液循環與淋巴：體循環、肺循環（充氧血／缺氧血）、微血管的物質交換、小魚尾鰭的血流、淋巴系統、人體的防禦（非專一性、發炎反應、專一性） */
(() => {
  const { el, g, text, C } = S;
  const OXY = '#ff4d5e', DEOX = '#8f6cf2', LYM = '#7fdc8a', MUSC = '#d9707f', MUSC_E = '#ffb3bf', RBC = '#e0384c';
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(S.lerp(v, B[i], S.clamp(t)))).join(',')})`; };
  // 依「時間」走折線：每段有速度 v（越大越快）
  const route = (segs) => {
    const P = [], W = [0];
    segs.forEach(({ pts, v = 1 }) => pts.forEach((q, i) => {
      if (P.length && i === 0) return;
      if (P.length) W.push(W[W.length - 1] + Math.hypot(q[0] - P[P.length - 1][0], q[1] - P[P.length - 1][1]) / v);
      P.push(q);
    }));
    const T = W[W.length - 1];
    return (t) => {
      const s = S.clamp(t) * T;
      let i = 1;
      while (i < W.length - 1 && W[i] < s) i++;
      const f = (s - W[i - 1]) / (W[i] - W[i - 1] || 1);
      return [S.lerp(P[i - 1][0], P[i][0], f), S.lerp(P[i - 1][1], P[i][1], f)];
    };
  };
  const polyAt = (pts) => route([{ pts }]);
  const dot = (p, r = 8, fill = RBC) => el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 1.5, opacity: 0 }, p);
  const put = (e, [x, y], op = 1) => { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.style.opacity = op; };
  const tr = (e, [x, y], op = 1) => { e.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`); e.style.opacity = op; };
  const arrow = (p, x1, y1, x2, y2, color, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const mol = (p, label, fill, r = 15) => { const m = g(p); el('circle', { cx: 0, cy: 0, r, fill, stroke: '#0d1822', 'stroke-width': 1.5 }, m); text(m, 0, 7, label, { 'font-size': 20, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 }); return m; };
  const chain = (p, x, y0, gap, items, color) => items.map((s, i) => {
    const cg = g(p, { opacity: 0 });
    S.pill(cg, x, y0 + i * gap, s, { size: 22, color, edge: color });
    if (i < items.length - 1) arrow(cg, x, y0 + i * gap + 19, x, y0 + (i + 1) * gap - 19, color, 3, 10);
    return cg;
  });
  const grad = (defs, id, a, b, vertical) => { const lg = el('linearGradient', { id, x1: 0, y1: 0, x2: vertical ? 0 : 1, y2: vertical ? 1 : 0 }, defs); el('stop', { offset: 0, 'stop-color': a }, lg); el('stop', { offset: 1, 'stop-color': b }, lg); return `url(#${id})`; };

  S.register({
    id: 'circulation', section: '4-4', title: '血液循環與淋巴',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const defs = el('defs', {}, root);
      const gLung = grad(defs, 'ciLung', DEOX, OXY), gBody = grad(defs, 'ciBody', DEOX, OXY);

      // ===== 0、1 體循環與肺循環（同一張圖） =====
      const D = g(root);
      const lungs = g(D);
      [[505, 116], [695, 116]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 115, ry: 78, fill: 'rgba(255,170,190,0.16)', stroke: '#ffb3c8', 'stroke-width': 2 }, lungs));
      text(lungs, 600, 34, '肺', { 'font-size': 26, 'text-anchor': 'middle', fill: '#ffb3c8', 'font-weight': 700 });
      const lungBed = g(D);
      for (let k = 0; k < 4; k++) { let d = `M 420,${102 + k * 12}`; for (let x = 420; x < 780; x += 30) d += ` q 15,${k % 2 ? 9 : -9} 30,0`; el('path', { d, fill: 'none', stroke: gLung, 'stroke-width': 4 }, lungBed); }
      // 標在右肺外側、緊接微血管的末端：放在肺裡會被兩片肺的輪廓線和微血管穿過
      text(lungBed, 822, 130, '肺部的微血管', { 'font-size': 22, fill: '#ffb3c8' });
      const bodyBed = g(D);
      for (let k = 0; k < 4; k++) { let d = `M 380,${612 + k * 12}`; for (let x = 380; x < 840; x += 30) d += ` q 15,${k % 2 ? 9 : -9} 30,0`; el('path', { d, fill: 'none', stroke: gBody, 'stroke-width': 4 }, bodyBed); }
      for (let i = 0; i < 9; i++) el('rect', { x: 392 + i * 50, y: 668, width: 42, height: 30, rx: 10, fill: 'rgba(99,212,191,0.12)', stroke: '#63d4bf', 'stroke-width': 1.5 }, bodyBed);
      text(bodyBed, 610, 600, '全身各處的微血管', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      el('rect', { x: 425, y: 276, width: 350, height: 222, rx: 30, fill: 'rgba(217,112,127,0.25)', stroke: MUSC_E, 'stroke-width': 2 }, D);
      const CH = [['右心房', 440, 290, 130, DEOX], ['左心房', 630, 290, 130, OXY], ['右心室', 440, 392, 145, DEOX], ['左心室', 615, 392, 145, OXY]];
      CH.forEach(([s, x, y, w, c]) => { el('rect', { x, y, width: w, height: 90, rx: 16, fill: c, opacity: 0.55 }, D); text(D, x + w / 2, y + 54, s, { 'font-size': 24, 'text-anchor': 'middle', fill: '#fff', 'font-weight': 700 }); });
      const ves = (d, c) => el('path', { d, fill: 'none', stroke: c, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, D);
      const pulm = g(D), sys = g(D);
      D.insertBefore(pulm, lungs); D.insertBefore(sys, lungs);
      pulm.appendChild(ves('M 572,400 C 590,380 600,366 600,346 L 600,212 L 420,212 L 420,146', DEOX));
      pulm.appendChild(ves('M 780,146 L 780,335 L 762,335', OXY));
      sys.appendChild(ves('M 760,438 L 840,438 L 840,626', OXY));
      sys.appendChild(ves('M 380,626 L 380,335 L 438,335', DEOX));
      const vl = g(D);
      text(vl, 508, 250, '肺動脈', { 'font-size': 22, 'text-anchor': 'middle', fill: '#c8b8ff', 'font-weight': 700 });
      text(vl, 796, 250, '肺靜脈', { 'font-size': 22, fill: '#ffb0b8', 'font-weight': 700 });
      text(vl, 856, 530, '主動脈', { 'font-size': 22, fill: '#ffb0b8', 'font-weight': 700 });
      text(vl, 366, 560, '上、下大靜脈', { 'font-size': 22, 'text-anchor': 'end', fill: '#c8b8ff', 'font-weight': 700 });
      const leg = g(D);
      el('circle', { cx: 940, cy: 40, r: 10, fill: OXY }, leg); text(leg, 958, 48, '充氧血', { 'font-size': 22, fill: C.ink2 });
      el('circle', { cx: 1060, cy: 40, r: 10, fill: DEOX }, leg); text(leg, 1078, 48, '缺氧血', { 'font-size': 22, fill: C.ink2 });
      S.pill(D, 150, 40, '面對面：左邊是人的右邊', { size: 20, color: C.mute, edge: '#4a6272' });
      // 血液的路線
      const sysR = route([{ pts: [[690, 438], [760, 438], [840, 438], [840, 626]], v: 1.4 }, { pts: [[840, 626], [380, 626]], v: 0.6 }, { pts: [[380, 626], [380, 335], [438, 335], [505, 335]], v: 1 }]);
      const pulR = route([{ pts: [[512, 438], [572, 400], [600, 346], [600, 212], [420, 212], [420, 124]], v: 1.2 }, { pts: [[420, 124], [780, 124]], v: 0.6 }, { pts: [[780, 124], [780, 335], [762, 335], [695, 335]], v: 1 }]);
      const sysC = (x, y) => (y > 600 ? mix(OXY, DEOX, (840 - x) / 460) : x > 600 ? OXY : DEOX);
      const pulC = (x, y) => (y < 130 && x >= 420 ? mix(DEOX, OXY, (x - 420) / 360) : x > 700 && y < 340 ? OXY : DEOX);
      const sd = Array.from({ length: 8 }, () => dot(D, 9)), pd = Array.from({ length: 8 }, () => dot(D, 9));
      const ch0 = chain(D, 1040, 190, 82, ['左心室', '主動脈', '全身的微血管', '上、下大靜脈', '右心房'], '#ffd0d8');
      const ch1 = chain(D, 160, 180, 82, ['右心室', '肺動脈', '肺部的微血管', '肺靜脈', '左心房'], '#ffd0d8');
      const trap = g(D, { opacity: 0 });
      el('rect', { x: 900, y: 250, width: 270, height: 170, rx: 16, fill: 'rgba(255,107,107,0.08)', stroke: '#ff9a8a', 'stroke-width': 2 }, trap);
      text(trap, 1035, 292, '易錯', { 'font-size': 24, 'text-anchor': 'middle', fill: '#ff9a8a', 'font-weight': 700 });
      text(trap, 1035, 340, '肺動脈：缺氧血', { 'font-size': 24, 'text-anchor': 'middle', fill: '#c8b8ff', 'font-weight': 700 });
      text(trap, 1035, 384, '肺靜脈：充氧血', { 'font-size': 24, 'text-anchor': 'middle', fill: '#ffb0b8', 'font-weight': 700 });
      tl.addLabel('s0');
      tl.fromTo([pulm, lungs, lungBed], { opacity: 1 }, { opacity: 0.2, duration: 0.4, immediateRender: false }, 's0+=0.1');
      S.drive(tl, (u) => sd.forEach((d, i) => { const t = (u * 1.5 + i / 8) % 1, q = sysR(t); put(d, q, u > 0 && u < 1 ? 1 : 0); d.setAttribute('fill', sysC(...q)); }), 6.5, 's0+=0.4', 'none');
      ch0.forEach((c, i) => S.show(tl, c, `s0+=${0.5 + i * 0.9}`, 0.35));
      tl.addLabel('s1');
      tl.fromTo([pulm, lungs, lungBed], { opacity: 0.2 }, { opacity: 1, duration: 0.4, immediateRender: false }, 's1');
      tl.fromTo([sys, bodyBed], { opacity: 1 }, { opacity: 0.2, duration: 0.4, immediateRender: false }, 's1');
      S.hide(tl, ch0, 's1', 0.3);
      S.drive(tl, (u) => pd.forEach((d, i) => { const t = (u * 1.5 + i / 8) % 1, q = pulR(t); put(d, q, u > 0 && u < 1 ? 1 : 0); d.setAttribute('fill', pulC(...q)); }), 6.5, 's1+=0.4', 'none');
      ch1.forEach((c, i) => S.show(tl, c, `s1+=${0.5 + i * 0.9}`, 0.35));
      S.show(tl, trap, 's1+=5', 0.5);
      tl.fromTo([sys, bodyBed], { opacity: 0.2 }, { opacity: 1, duration: 0.5, immediateRender: false }, 's1+=6');

      // ===== 2 微血管的物質交換 =====
      const P2 = g(root, { opacity: 0 });
      const gCap = grad(defs, 'ciCap', OXY, DEOX);
      for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) {
        const x = 90 + i * 150, y = r ? 440 : 150;
        el('rect', { x, y, width: 128, height: 112, rx: 26, fill: 'rgba(99,212,191,0.10)', stroke: '#63d4bf', 'stroke-width': 2 }, P2);
        el('circle', { cx: x + 64, cy: y + 56, r: 14, fill: 'rgba(167,150,255,0.5)', stroke: C.nucleus, 'stroke-width': 2 }, P2);
      }
      text(P2, 600, 128, '組織細胞', { 'font-size': 22, 'text-anchor': 'middle', fill: '#63d4bf' });
      el('rect', { x: 60, y: 324, width: 1080, height: 72, rx: 36, fill: 'none', stroke: gCap, 'stroke-width': 6 }, P2);
      el('rect', { x: 66, y: 330, width: 1068, height: 60, rx: 30, fill: 'rgba(140,28,46,0.35)' }, P2);
      for (let x = 100; x < 1120; x += 70) el('line', { x1: x, y1: 324, x2: x, y2: 332, stroke: '#0d1822', 'stroke-width': 2 }, P2);
      text(P2, 70, 314, '← 由小動脈流來', { 'font-size': 20, fill: '#ffb0b8' });
      text(P2, 1130, 314, '流向小靜脈 →', { 'font-size': 20, 'text-anchor': 'end', fill: '#c8b8ff' });
      const rbc2 = Array.from({ length: 9 }, () => el('ellipse', { rx: 22, ry: 17, fill: OXY, stroke: '#0d1822', 'stroke-width': 1.5 }, P2));
      const ex = [];
      for (let i = 0; i < 7; i++) {
        const x = 154 + i * 150;
        if (i % 2 === 0) { ex.push({ m: mol(P2, 'O₂', OXY, 22), x: x - 20, a: 340, b: 220 }); ex.push({ m: (() => { const h = g(P2); el('path', { d: hexD(13), fill: 'rgba(255,207,92,0.35)', stroke: C.sugar, 'stroke-width': 3 }, h); return h; })(), x: x + 22, a: 380, b: 500 }); }
        else { ex.push({ m: mol(P2, 'CO₂', '#b8c4cc', 25), x: x - 20, a: 220, b: 340 }); ex.push({ m: (() => { const h = g(P2); el('rect', { x: -10, y: -10, width: 20, height: 20, rx: 5, fill: '#c89a5a', stroke: '#0d1822', 'stroke-width': 1.5 }, h); return h; })(), x: x + 22, a: 500, b: 380 }); }
      }
      for (let i = 1; i < 6; i++) {
        const x = 154 + i * 150 + 40, up = i % 2 === 0;
        arrow(P2, x, up ? 318 : 268, x, up ? 268 : 318, up ? '#ffb0b8' : '#d0d8de', 3, 10);
        arrow(P2, x, up ? 402 : 436, x, up ? 436 : 402, up ? C.sugar : '#c89a5a', 3, 10);
      }
      const wall2 = S.callout(P2, 529, 394, 529, 590, '微血管的管壁只有一層細胞，物質容易通過', C.hi, { size: 22 });
      const lg2 = g(P2, { opacity: 0 });
      S.pill(lg2, 330, 640, '氧、養分：血液 → 細胞', { size: 24, color: '#ffb0b8', edge: '#ffb0b8' });
      S.pill(lg2, 870, 640, '二氧化碳、廢物：細胞 → 血液', { size: 24, color: '#d0d8de', edge: '#d0d8de' });
      tl.addLabel('s2');
      S.hide(tl, D, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      S.drive(tl, (u) => {
        rbc2.forEach((e, i) => { const t = (u * 1.2 + i / 9) % 1, x = S.lerp(90, 1110, t); e.setAttribute('cx', x); e.setAttribute('cy', 360); e.setAttribute('fill', mix(OXY, DEOX, (x - 200) / 800)); e.style.opacity = u > 0 && u < 1 ? 1 : 0; });
        ex.forEach(({ m, x, a, b }, i) => { const t = S.clamp((u * 2.2 - (i % 4) * 0.12) % 1.1); tr(m, [x, S.lerp(a, b, t)], u > 0.05 && u < 1 ? (t < 0.95 ? 1 : 0) : 0); });
      }, 6, 's2+=0.6', 'none');
      S.show(tl, wall2, 's2+=1', 0.4);
      S.show(tl, lg2, 's2+=2.4', 0.5);

      // ===== 3 小魚尾鰭的血流 =====
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 60, width: 440, height: 300, rx: 16, ...FRAME }, P3);
      el('ellipse', { cx: 260, cy: 230, rx: 190, ry: 86, fill: 'rgba(95,184,255,0.12)', stroke: '#cfe8ff', 'stroke-width': 3 }, P3);
      el('path', { d: 'M 130,230 C 160,196 250,190 300,214 L 370,186 L 360,230 L 370,274 L 300,246 C 250,270 160,264 130,230 Z', fill: '#ffb35c', stroke: '#ffd08a', 'stroke-width': 2 }, P3);
      el('path', { d: 'M 112,232 C 120,186 210,180 268,204 C 284,226 284,236 268,258 C 210,282 120,276 112,232 Z', fill: '#f4f4f0', stroke: '#fff', 'stroke-width': 2 }, P3);
      for (let i = 0; i < 6; i++) el('circle', { cx: 140 + i * 22, cy: 216 + (i % 2) * 22, r: 12, fill: '#ffffff', opacity: 0.8 }, P3);
      el('circle', { cx: 352, cy: 230, r: 34, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, P3);
      text(P3, 260, 104, '用浸溼的棉花包住魚身，露出尾鰭', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink });
      text(P3, 260, 344, '放在顯微鏡下，用低倍鏡觀察', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink });
      el('line', { x1: 386, y1: 230, x2: 560, y2: 250, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, P3);
      const FC = [850, 370], FR = 300;
      el('circle', { cx: FC[0], cy: FC[1], r: FR }, el('clipPath', { id: 'ciField' }, defs));
      const fld = g(P3, { 'clip-path': 'url(#ciField)' });
      el('rect', { x: FC[0] - FR, y: FC[1] - FR, width: FR * 2, height: FR * 2, fill: '#2a2418' }, fld);
      for (let k = 0; k < 7; k++) el('line', { x1: 540 + k * 90, y1: 60, x2: 660 + k * 90, y2: 700, stroke: '#4a3e28', 'stroke-width': 16, opacity: 0.6 }, fld);
      const A0 = [[560, 170], [680, 240], [760, 300]];
      const AB = [[[760, 300], [830, 250], [880, 236]], [[760, 300], [840, 320], [890, 330]], [[760, 300], [810, 382], [860, 420]]];
      const CP = [[[880, 236], [930, 246], [972, 292], [1000, 352]], [[890, 330], [944, 338], [1000, 352]], [[860, 420], [920, 452], [968, 446], [1004, 444]]];
      const VB = [[[1000, 352], [1036, 420]], [[1000, 352], [1036, 420]], [[1004, 444], [1036, 420]]];
      const V0 = [[1036, 420], [1066, 500], [1100, 600]];
      const tube = (pts, w, c) => el('path', { d: 'M ' + pts.map((p) => p.join(',')).join(' L '), fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, fld);
      tube(A0, 34, '#7a2030'); AB.forEach((p) => tube(p, 18, '#7a2030')); CP.forEach((p) => tube(p, 12, '#6a2a3a')); VB.forEach((p) => tube(p, 18, '#5a2a46')); tube(V0, 38, '#5a2a46');
      const fr = [0, 1, 2].map((k) => route([{ pts: A0, v: 2.2 }, { pts: AB[k], v: 1.6 }, { pts: CP[k], v: 0.35 }, { pts: VB[k], v: 0.9 }, { pts: V0, v: 1.2 }]));
      const fd = Array.from({ length: 18 }, () => el('ellipse', { rx: 7, ry: 5.5, fill: '#ff6b7d', stroke: '#2a0a12', 'stroke-width': 1 }, fld));
      el('circle', { cx: FC[0], cy: FC[1], r: FR, fill: 'none', stroke: '#4a6272', 'stroke-width': 6 }, P3);
      const tags3 = g(P3, { opacity: 0 });
      S.pill(tags3, 640, 150, '動脈', { size: 22, color: '#ff8a9a', edge: '#ff8a9a' });
      S.pill(tags3, 960, 214, '微血管', { size: 22, color: C.hi, edge: C.hi });
      S.pill(tags3, 1000, 560, '靜脈', { size: 22, color: '#c8b8ff', edge: '#c8b8ff' });
      const desc3 = [['動脈：血液由主幹流向分支，流速快', '#ff8a9a'], ['微血管：紅血球排成一列，流速最慢', C.hi], ['靜脈：血液由分支匯合到主幹', '#c8b8ff']].map(([s, c], i) => { const dg = g(P3, { opacity: 0 }); el('circle', { cx: 56, cy: 430 + i * 64, r: 9, fill: c }, dg); text(dg, 76, 438 + i * 64, s, { 'font-size': 23, fill: C.ink }); return dg; });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drive(tl, (u) => fd.forEach((d, i) => { const t = (u * 1.3 + Math.floor(i / 3) / 6) % 1, q = fr[i % 3](t); put(d, q, u > 0 && u < 1 ? 1 : 0); }), 7, 's3+=0.6', 'none');
      S.show(tl, tags3, 's3+=1.2', 0.4);
      desc3.forEach((d, i) => S.show(tl, d, `s3+=${1.8 + i * 0.9}`, 0.4));

      // ===== 4 淋巴系統 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 60, width: 600, height: 500, rx: 16, ...FRAME }, P4);
      const gCap4 = grad(defs, 'ciCap4', OXY, DEOX);
      el('rect', { x: 70, y: 100, width: 540, height: 44, rx: 22, fill: 'rgba(140,28,46,0.45)', stroke: gCap4, 'stroke-width': 4 }, P4);
      text(P4, 80, 168, '微血管', { 'font-size': 20, fill: '#ffb0b8' });
      for (let i = 0; i < 8; i++) { const x = 90 + (i % 4) * 130 + (i > 3 ? 60 : 0), y = i > 3 ? 330 : 210; el('rect', { x, y, width: 100, height: 84, rx: 22, fill: 'rgba(99,212,191,0.10)', stroke: '#63d4bf', 'stroke-width': 2 }, P4); el('circle', { cx: x + 50, cy: y + 42, r: 10, fill: 'rgba(167,150,255,0.5)' }, P4); }
      el('path', { d: 'M 600,454 L 130,454 C 96,454 96,500 130,500 L 600,500', fill: 'rgba(127,220,138,0.18)', stroke: LYM, 'stroke-width': 4 }, P4);
      text(P4, 330, 540, '微淋巴管（一端封閉）', { 'font-size': 22, 'text-anchor': 'middle', fill: LYM });
      arrow(P4, 604, 477, 636, 477, LYM, 4, 12);
      const tf4 = g(P4, { opacity: 0 });
      S.pill(tf4, 520, 196, '組織液', { size: 22, color: '#9fd8ff', edge: '#9fd8ff' });
      const fl4 = Array.from({ length: 12 }, (_, i) => el('circle', { r: 6, fill: '#9fd8ff', opacity: 0 }, P4));
      const flP = (i) => { const x = 130 + (i % 6) * 80; return polyAt([[x, 140], [x + 10, 190], [x + (i % 2 ? 40 : -30), 312], [x + 20, 430], [x + 24, 476], [600, 477]]); };
      const flR = fl4.map((_, i) => flP(i));
      // 右：全身的淋巴系統
      const H2S = (x, y) => [860 + (x - 600) * 0.86, 60 + (y - 60) * 0.86];
      const hb = S.place(g(P4), { x: 860 - 600 * 0.86, y: 60 - 60 * 0.86, s: 0.86 });
      S.human(hb, { fill: 'rgba(44,82,104,0.3)', stroke: C.bodyEdge, sw: 2 });
      const LD = ['M 588,150 C 590,170 596,180 604,186', 'M 612,186 C 640,190 660,200 676,214 L 690,330', 'M 600,186 C 570,192 540,204 526,220 L 510,330', 'M 604,190 L 606,360 C 600,400 590,440 582,470 L 578,600', 'M 606,360 C 612,400 620,440 624,470 L 626,600'];
      LD.forEach((d) => el('path', { d, fill: 'none', stroke: LYM, 'stroke-width': 3, opacity: 0.85 }, hb));
      const NODES = [[588, 150], [612, 152], [676, 214], [526, 220], [606, 300], [582, 470], [624, 470], [598, 250]];
      NODES.forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 7, ry: 5, fill: LYM, stroke: '#d8ffd8', 'stroke-width': 1 }, hb));
      el('path', { d: 'M 560,182 C 580,176 600,176 620,182', fill: 'none', stroke: DEOX, 'stroke-width': 5 }, hb);
      const co4 = [S.callout(P4, ...H2S(608, 184), 1062, 110, '匯入鎖骨附近的靜脈', '#c8b8ff', { size: 22 }), S.callout(P4, ...H2S(676, 214), 1090, 250, '淋巴結', LYM, { size: 22 }), S.callout(P4, ...H2S(690, 300), 1090, 440, '淋巴管', LYM, { size: 22 })];
      const node4 = g(P4, { opacity: 0 });
      el('ellipse', { cx: 1090, cy: 316, rx: 34, ry: 24, fill: 'rgba(127,220,138,0.3)', stroke: LYM, 'stroke-width': 3 }, node4);
      [[-14, -6], [6, -10], [14, 8], [-6, 10], [0, 0]].forEach(([dx, dy]) => el('circle', { cx: 1090 + dx, cy: 316 + dy, r: 5, fill: '#e8e4f0' }, node4));
      text(node4, 1090, 372, '有許多白血球，', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink });
      text(node4, 1090, 398, '能消滅病原體', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink });
      const ch4 = g(P4, { opacity: 0 });
      const CH4 = ['組織液', '微淋巴管', '淋巴管', '淋巴結', '鎖骨附近的靜脈'];
      const w4 = CH4.map((s) => S.textWidth(s, 22) + 28), t4 = w4.reduce((a, b) => a + b, 0) + 44 * 4;
      let cx4 = (1200 - t4) / 2;
      CH4.forEach((s, i) => { S.pill(ch4, cx4 + w4[i] / 2, 640, s, { size: 22, color: i === 4 ? '#c8b8ff' : i === 0 ? '#9fd8ff' : LYM, edge: i === 4 ? '#c8b8ff' : i === 0 ? '#9fd8ff' : LYM }); if (i < 4) text(ch4, cx4 + w4[i] + 22, 648, '→', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute }); cx4 += w4[i] + 44; });
      const lymR = [polyAt([[578, 600], [582, 470], [606, 360], [604, 190], [608, 184]]), polyAt([[690, 330], [676, 214], [612, 186], [608, 184]]), polyAt([[510, 330], [526, 220], [600, 186], [608, 184]])];
      const ld = Array.from({ length: 9 }, () => el('circle', { r: 4, fill: '#d8ffd8', opacity: 0 }, hb));
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, tf4, 's4+=1', 0.4);
      S.drive(tl, (u) => {
        fl4.forEach((d, i) => { const t = (u * 1.4 + i / 12) % 1; put(d, flR[i](t), u > 0 && u < 1 ? 0.9 : 0); });
        ld.forEach((d, i) => { const t = (u * 1.6 + Math.floor(i / 3) / 3) % 1; put(d, lymR[i % 3](t), u > 0 && u < 1 ? 1 : 0); });
      }, 7, 's4+=0.6', 'none');
      co4.forEach((c, i) => S.show(tl, c, `s4+=${2.2 + i * 0.6}`, 0.35));
      S.show(tl, node4, 's4+=4.2', 0.4);
      S.show(tl, ch4, 's4+=5', 0.5);

      // ===== 5 人體的防禦 =====
      const P5 = g(root, { opacity: 0 });
      const BAC = '#7fdc8a';
      const bac = (p) => { const b = g(p); el('rect', { x: -14, y: -7, width: 28, height: 14, rx: 7, fill: BAC, stroke: '#2f7a3a', 'stroke-width': 2 }, b); return b; };
      const cards5 = [['第一道防線', '皮膚、黏膜', ['阻擋病原體進入身體', '黏膜分泌黏液，黏住灰塵和細菌']], ['第二道防線', '發炎反應', ['白血球聚集，吞噬病原體', '受傷處紅、腫、熱、痛']], ['第三道防線', '淋巴球產生抗體', ['抗體和特定的病原體結合', '一種抗體只對付一種病原體']]].map(([t, s, pts], i) => {
        const x0 = 40 + i * 380, cg = g(P5, { opacity: 0 });
        el('rect', { x: x0, y: 60, width: 360, height: 470, rx: 16, ...FRAME }, cg);
        text(cg, x0 + 180, 102, t, { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
        text(cg, x0 + 180, 140, s, { 'font-size': 30, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
        pts.forEach((q, k) => text(cg, x0 + 20, 440 + k * 36, '• ' + q, { 'font-size': 22, fill: C.ink }));
        return cg;
      });
      // 非專一性（第一、二道）與專一性（第三道）
      const br5 = g(P5, { opacity: 0 });
      [[50, 750, '非專一性防禦：不分病原體', '#9fd8ff'], [810, 1150, '專一性防禦', C.hi]].forEach(([xa, xb, s, c]) => {
        el('path', { d: `M ${xa},54 L ${xa},32 L ${xb},32 L ${xb},54`, fill: 'none', stroke: c, 'stroke-width': 2.5 }, br5);
        S.pill(br5, (xa + xb) / 2, 32, s, { size: 22, color: c, edge: c, bg: C.bg });
      });
      // 1 皮膚
      const c1 = cards5[0];
      el('rect', { x: 60, y: 300, width: 320, height: 26, fill: '#f2b38a' }, c1);
      el('rect', { x: 60, y: 326, width: 320, height: 60, fill: '#d98f78' }, c1);
      for (let x = 60; x < 380; x += 32) el('line', { x1: x, y1: 300, x2: x, y2: 326, stroke: '#c07a5e', 'stroke-width': 1.5 }, c1);
      text(c1, 220, 360, '皮膚', { 'font-size': 22, 'text-anchor': 'middle', fill: '#3a1e14', 'font-weight': 700 });
      const b1 = [0, 1, 2].map(() => bac(c1));
      // 2 發炎反應：病原體從傷口進入，受傷處的血管擴張（紅、熱）、組織腫起來，白血球從微血管鑽出、聚集吞噬病原體
      const c2 = cards5[1], WX = 600, ST = 214;
      const glow = el('ellipse', { cx: WX, cy: 262, rx: 130, ry: 78, fill: 'url(#ciInfl)', opacity: 0 }, c2);
      const rg5 = el('radialGradient', { id: 'ciInfl' }, defs);
      el('stop', { offset: 0, 'stop-color': '#ff4d5e', 'stop-opacity': 0.9 }, rg5); el('stop', { offset: 1, 'stop-color': '#ff4d5e', 'stop-opacity': 0 }, rg5);
      const derm = el('path', { fill: 'rgba(217,143,120,0.28)' }, c2);
      c2.insertBefore(derm, glow); // 真皮在紅色光暈的下面
      const epi = [el('path', { fill: '#f2b38a', stroke: '#c07a5e', 'stroke-width': 1.5 }, c2), el('path', { fill: '#f2b38a', stroke: '#c07a5e', 'stroke-width': 1.5 }, c2)];
      // 皮膚：sw 是受傷處腫起來的高度；表皮厚 22，中間有一道傷口
      const setSkin = (sw) => {
        const top = (x) => ST - sw * Math.exp(-(((x - WX) / 95) ** 2));
        const line = (xa, xb, dy, rev) => { const P = []; for (let x = xa; x <= xb + 0.1; x += 5) P.push(`${x.toFixed(1)},${(top(x) + dy).toFixed(1)}`); return (rev ? P.reverse() : P).join(' L '); };
        [[440, WX - 10, WX - 3], [WX + 10, 760, WX + 3]].forEach(([xa, xb, xv], i) => {
          const v = `${xv},${(top(WX) + 26).toFixed(1)}`;
          epi[i].setAttribute('d', i ? `M ${v} L ${line(xa, xb, 0)} L ${line(xa, xb, 22, true)} Z` : `M ${line(xa, xb, 0)} L ${v} L ${line(xa, xb, 22, true)} Z`);
        });
        derm.setAttribute('d', `M ${line(440, 760, 22)} L 760,410 L 440,410 Z`);
      };
      setSkin(0);
      el('rect', { x: 440, y: 362, width: 320, height: 26, rx: 13, fill: 'rgba(140,28,46,0.65)', stroke: '#ff5f74', 'stroke-width': 2.5 }, c2);
      [470, 530, 660, 730].forEach((x) => el('ellipse', { cx: x, cy: 375, rx: 9, ry: 6, fill: RBC }, c2));
      // 標在微血管左上方：放在下面會壓到微血管和組織的下緣（第一個白血球改從右邊一點出發，不經過標籤）
      text(c2, 448, 352, '微血管', { 'font-size': 22, fill: '#ff8a9a' });
      const wbcs = [[530, 375, 572, 266], [600, 375, 628, 276], [716, 375, 600, 300]].map(([x, y, tx, ty]) => {
        const w = g(c2);
        el('circle', { cx: 0, cy: 0, r: 15, fill: 'rgba(232,228,240,0.92)', stroke: '#fff', 'stroke-width': 2 }, w);
        el('path', { d: 'M -7,-2 C -9,-10 -1,-10 0,-4 C 2,-10 10,-7 7,1 C 10,7 2,10 0,5 C -3,10 -11,6 -7,-2 Z', fill: '#8a6ad8' }, w);
        tr(w, [x, y]);
        return { w, x, y, tx, ty };
      });
      const b2 = [[-30, 588, 262], [10, 616, 274], [-6, 598, 296]].map(([dx, tx, ty]) => ({ b: bac(c2), dx, tx, ty }));
      const infl = g(c2, { opacity: 0 });
      S.pill(infl, WX, 176, '紅、腫、熱、痛', { size: 22, color: '#ff8a7a', edge: '#ff8a7a' });
      const wLbl = text(c2, 744, 318, '白血球聚集', { 'font-size': 20, 'text-anchor': 'end', fill: '#e8e4f0', opacity: 0 });
      // 3 抗體
      const c3 = cards5[2];
      const lym3 = g(c3);
      el('circle', { cx: 900, cy: 300, r: 46, fill: 'rgba(232,228,240,0.85)', stroke: '#fff', 'stroke-width': 3 }, lym3);
      el('circle', { cx: 900, cy: 300, r: 30, fill: '#8a6ad8' }, lym3);
      text(c3, 900, 374, '淋巴球', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      text(c3, 900, 400, '（白血球的一種）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const Y = (p) => { const y = g(p); el('path', { d: 'M 0,12 L 0,0 L -8,-10 M 0,0 L 8,-10', fill: 'none', stroke: C.hi, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, y); return y; };
      const abs = Array.from({ length: 6 }, () => Y(c3));
      const b3 = [bac(c3), bac(c3)];
      b3.forEach((b, i) => tr(b, [1060, 230 + i * 120]));
      // 疫苗
      const vac = g(P5, { opacity: 0 });
      el('rect', { x: 40, y: 550, width: 1120, height: 150, rx: 16, fill: 'rgba(255,209,102,0.06)', stroke: C.hi, 'stroke-width': 2 }, vac);
      const syr = S.place(g(vac), { x: 120, y: 625, r: -30 });
      el('rect', { x: -50, y: -12, width: 80, height: 24, rx: 4, fill: 'rgba(207,232,255,0.3)', stroke: '#cfe8ff', 'stroke-width': 2 }, syr);
      el('rect', { x: -48, y: -10, width: 46, height: 20, fill: '#9fd8ff', opacity: 0.6 }, syr);
      el('line', { x1: 30, y1: 0, x2: 64, y2: 0, stroke: '#cfe8ff', 'stroke-width': 3 }, syr);
      el('rect', { x: -72, y: -4, width: 22, height: 8, fill: '#cfe8ff' }, syr);
      text(vac, 210, 600, '疫苗（預防注射）：用失去致病力的病原體或它的成分，讓身體', { 'font-size': 24, fill: C.ink });
      text(vac, 210, 640, '自己產生抗體，並且記住這種病原體。下次同一種病原體入侵時，', { 'font-size': 24, fill: C.ink });
      text(vac, 210, 680, '身體能很快產生大量抗體，不容易生病。', { 'font-size': 24, fill: C.ink });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.2);
      cards5.forEach((c, i) => S.show(tl, c, `s5+=${0.4 + i * 1.2}`, 0.4));
      S.drive(tl, (u) => {
        b1.forEach((b, i) => { const t = S.clamp(u * 2.4 - i * 0.3); const y = t < 0.5 ? S.lerp(190, 292, t * 2) : S.lerp(292, 210, (t - 0.5) * 2); tr(b, [120 + i * 100 + t * 30, y], u > 0 && u < 1 ? 1 : 0); });
        abs.forEach((a, i) => { const t = S.clamp(u * 1.6 - 0.6 - i * 0.05), tgt = [1060 + (i % 3 - 1) * 22, 230 + Math.floor(i / 3) * 120 + (i % 3 === 1 ? -14 : 8)]; tr(a, [S.lerp(900, tgt[0], t), S.lerp(300, tgt[1], t)], u > 0 && t > 0 ? 1 : 0); });
      }, 5.5, 's5+=0.6', 'none');
      S.drive(tl, (u) => {
        const t1 = S.smoothstep(0, 0.3, u), k2 = S.smoothstep(0.25, 0.6, u), t3 = S.smoothstep(0.3, 0.78, u), eat = S.smoothstep(0.78, 0.95, u);
        glow.setAttribute('opacity', (0.55 * k2).toFixed(2));
        setSkin(12 * k2);
        infl.style.opacity = k2;
        b2.forEach(({ b, dx, tx, ty }, i) => {
          const p = [S.lerp(WX + dx * 0.25, tx, t1), S.lerp(188 + i * 6, ty, t1)];
          const w = wbcs[i];
          tr(b, [S.lerp(p[0], w.tx, eat), S.lerp(p[1], w.ty, eat)], u > 0 ? 1 - 0.65 * eat : 0);
        });
        wbcs.forEach(({ w, x, y, tx, ty }) => {
          // 先往上鑽出微血管，再走到病原體旁邊
          const up = S.smoothstep(0, 0.35, t3), go = S.smoothstep(0.25, 1, t3);
          tr(w, [S.lerp(x, tx, go), S.lerp(y, 340, up) + (ty - 340) * go]);
        });
        wLbl.style.opacity = S.smoothstep(0.8, 1, u);
      }, 3.6, 's5+=1.8', 'none');
      S.show(tl, br5, 's5+=4.4', 0.5);
      S.show(tl, vac, 's5+=4.9', 0.5);

      return {
        tl,
        notes: [
          '＊示意：心臟和血管都畫成簡單的方塊和管子。充氧血是含氧較多的血液（圖中紅色），缺氧血是含氧較少的血液（圖中紫色）；真實的缺氧血是暗紅色。',
          '＊示意：血液在肺部的微血管放出二氧化碳、得到氧，變成充氧血。易錯：動脈不一定流充氧血，靜脈也不一定流缺氧血，要看血管連接心臟的哪裡。',
          '＊示意：分子和細胞都畫得很大。物質主要以擴散的方式在血液和細胞之間移動（2-2 擴散）。',
          '＊示意：視野中的血管和血球都簡化了。先找到紅血球只能排成一列通過的微血管，再依血流方向判斷：流向微血管的是小動脈，從微血管流出的是小靜脈。複式顯微鏡的像上下左右顛倒：視野中往右流，實際上是往左流。',
          '＊示意：淋巴結和淋巴管只畫出一部分。淋巴管中有瓣膜，淋巴只朝一個方向流動；推動淋巴的主要是周圍肌肉的運動。',
          '＊示意：細胞和病原體都畫得很大。發炎反應：受傷處紅、腫、熱、痛，因為血管擴張、血流增加，白血球從微血管鑽出來聚集。疫苗讓身體預先產生抗體和記憶，疫苗裡沒有抗體。（補充）白血球還分成好幾種，其他種類的名稱高中才會學。',
        ],
        steps: [
          '<b>體循環</b>：<b>左心室</b> → 主動脈 → 全身各處的微血管 → 上、下大靜脈 → <b>右心房</b>。血液在全身微血管把氧交給細胞，由<b>充氧血</b>變成<b>缺氧血</b>。',
          '<b>肺循環</b>：<b>右心室</b> → 肺動脈 → 肺部的微血管 → 肺靜脈 → <b>左心房</b>。血液在肺部得到氧，變成充氧血。注意：<b>肺動脈</b>裡是缺氧血，<b>肺靜脈</b>裡是充氧血。',
          '<b>微血管</b>的管壁很薄：<b>氧和養分</b>由血液進入細胞，<b>二氧化碳和廢物</b>由細胞進入血液，這就是<b>物質交換</b>。',
          '觀察<b>小魚尾鰭</b>：<b>動脈</b>的血液由主幹流向分支、流速快；<b>微血管</b>中紅血球排成一列、流速最慢；<b>靜脈</b>的血液由分支匯合到主幹。',
          '<b>淋巴系統</b>：組織液進入<b>微淋巴管</b>成為淋巴，經<b>淋巴管</b>和<b>淋巴結</b>，最後匯入<b>鎖骨附近的靜脈</b>，回到心臟。淋巴結中有許多白血球，能消滅病原體。',
          '<b>非專一性防禦</b>：皮膚、黏膜阻擋病原體，白血球吞噬病原體（<b>發炎反應</b>）。<b>專一性防禦</b>：淋巴球產生<b>抗體</b>，對付特定的病原體。',
        ],
      };
    },
  });
})();
