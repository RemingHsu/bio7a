/* 場景 3：物質進出細胞 — 擴散、細胞膜的選擇性、氧與二氧化碳、滲透、清水與濃鹽水 */
(() => {
  const { el, g, text, C } = S;

  // ---------- 分子造型 ----------
  const dot = (p, col, r = 7) => { const m = g(p); el('circle', { cx: 0, cy: 0, r, fill: col }, m); return m; };
  const water = (p) => { const m = g(p); el('circle', { cx: 0, cy: 0, r: 7, fill: C.water }, m); el('circle', { cx: -7, cy: 6, r: 4, fill: '#e8f4ff' }, m); el('circle', { cx: 7, cy: 6, r: 4, fill: '#e8f4ff' }, m); return m; };
  const o2 = (p) => { const m = g(p); el('circle', { cx: -6, cy: 0, r: 8, fill: C.oxygen }, m); el('circle', { cx: 6, cy: 0, r: 8, fill: C.oxygen }, m); return m; };
  const co2 = (p) => { const m = g(p); el('circle', { cx: -12, cy: 0, r: 7, fill: C.oxygen }, m); el('circle', { cx: 12, cy: 0, r: 7, fill: C.oxygen }, m); el('circle', { cx: 0, cy: 0, r: 9, fill: '#55626b', stroke: C.co2, 'stroke-width': 2 }, m); return m; };
  const hex = (p, x, r, col) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; d += (i ? 'L' : 'M') + `${(x + Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return el('path', { d: d + 'Z', fill: 'none', stroke: col, 'stroke-width': 4 }, p); };
  const sugar = (p) => { const m = g(p); hex(m, 0, 13, C.sugar); return m; };
  const starch = (p) => { const m = g(p); for (let i = 0; i < 6; i++) hex(m, -75 + i * 30, 13, '#f3e3b0'); return m; };

  // 分子沿折線移動（可倒帶）：pts = [起點, (經過點), 終點]
  const movers = [];
  function mover(m, pts, rnd, { amp = 6, delay = 0.3 } = {}) {
    const o = { m, pts, amp, d: rnd() * delay, fx: 2 + rnd() * 3, fy: 2 + rnd() * 3, ph: rnd() * 6.28 };
    place(o, 0);
    return o;
  }
  function place(o, u) {
    const t = S.smoothstep(0, 1, S.clamp((u - o.d) / (1 - 0.3)));
    const n = o.pts.length - 1, seg = Math.min(n - 1, Math.floor(t * n)), lt = t * n - seg;
    const a = o.pts[seg], b = o.pts[seg + 1];
    const x = S.lerp(a[0], b[0], lt) + o.amp * Math.sin(6.28 * o.fx * u + o.ph);
    const y = S.lerp(a[1], b[1], lt) + o.amp * Math.cos(6.28 * o.fy * u + o.ph);
    o.m.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
  }
  const run = (list) => (u) => list.forEach((o) => place(o, u));

  S.register({
    id: 'transport', section: '2-2', title: '物質進出細胞',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const rnd = S.rng(21);
      // 畫面右上角的「＊示意」標記，對應說明文字下方的備註
      const mark = text(root, 1184, 40, '＊示意', { 'font-size': 22, fill: C.mute, 'text-anchor': 'end' });
      const C2 = { box: '#16293a', edge: '#3b5466' };

      // ===== 0 擴散 =====
      const P0 = g(root);
      el('rect', { x: 200, y: 170, width: 800, height: 380, rx: 20, fill: C2.box, stroke: C2.edge, 'stroke-width': 3 }, P0);
      text(P0, 400, 140, '濃度高', { 'font-size': 30, 'text-anchor': 'middle', fill: '#c7a8ff', 'font-weight': 700 });
      text(P0, 800, 140, '濃度低', { 'font-size': 30, 'text-anchor': 'middle', fill: C.mute, 'font-weight': 700 });
      const d0 = [];
      const starts = [], ends = [];
      for (let i = 0; i < 60; i++) { starts.push([220 + rnd() * 365, 190 + rnd() * 340]); ends.push([220 + rnd() * 760, 190 + rnd() * 340]); }
      starts.sort((a, b) => a[0] - b[0]); ends.sort((a, b) => a[0] - b[0]);
      starts.forEach((s, i) => d0.push(mover(dot(P0, '#b394ff', 9), [s, ends[i]], rnd, { amp: 8 })));
      const divider = el('rect', { x: 594, y: 172, width: 12, height: 376, fill: '#8aa1ae' }, P0);
      const arrow0 = g(P0, { opacity: 0 });
      el('path', { d: 'M 470,612 H 720', stroke: C.hi, 'stroke-width': 6 }, arrow0);
      el('path', { d: 'M 740,612 l -26,-15 v 30 Z', fill: C.hi }, arrow0);
      text(arrow0, 380, 622, '高', { 'font-size': 30, fill: C.hi, 'font-weight': 700, 'text-anchor': 'middle' });
      text(arrow0, 820, 622, '低', { 'font-size': 30, fill: C.hi, 'font-weight': 700, 'text-anchor': 'middle' });
      const count = text(P0, 600, 690, '', { 'font-size': 24, fill: C.mute, 'text-anchor': 'middle', class: 'mono' });
      const diffuse = (u) => {
        run(d0)(u);
        let L = 0; d0.forEach((o) => { const t = o.m.getAttribute('transform'); if (+t.slice(10, t.indexOf(',')) < 600) L++; });
        count.textContent = `左邊 ${L} 個 ： 右邊 ${60 - L} 個`;
      };
      diffuse(0);

      tl.addLabel('s0');
      S.show(tl, P0, 's0', 0.5);
      tl.fromTo(divider, { y: 0, opacity: 1 }, { y: -60, opacity: 0, duration: 0.6 }, 's0+=0.8');
      S.drive(tl, diffuse, 4.2, 's0+=1.1');
      S.show(tl, arrow0, 's0+=1.4', 0.5);

      // ===== 1 細胞膜的選擇性 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 200, y: 170, width: 800, height: 380, rx: 20, fill: C2.box, stroke: C2.edge, 'stroke-width': 3 }, P1);
      const pores = [242, 312, 382, 452, 522];
      for (let y = 172; y + 52 <= 552; y += 70) el('rect', { x: 590, y: y + 18, width: 20, height: 34, rx: 6, fill: C.membrane }, P1);
      text(P1, 600, 150, '細胞膜', { 'font-size': 28, 'text-anchor': 'middle', fill: C.membrane, 'font-weight': 700 });
      const d1 = [];
      for (let i = 0; i < 22; i++) {
        const s = [230 + rnd() * 330, 190 + rnd() * 340], cross = i % 2 === 0;
        const m = i % 3 === 0 ? o2(P1) : water(P1);
        const py = pores[i % 5];
        d1.push(mover(m, cross ? [s, [600, py], [640 + rnd() * 330, 190 + rnd() * 340]] : [s, [230 + rnd() * 330, 190 + rnd() * 340]], rnd, { amp: 5 }));
      }
      const starches = [[360, 250], [400, 380], [330, 480]].map(([x, y]) => ({ m: starch(g(P1, { transform: `translate(${x},${y})` })), x, y }));
      const no1 = g(P1, { opacity: 0 });
      el('path', { d: 'M 560,365 l 30,30 M 590,365 l -30,30', stroke: '#ff6b6b', 'stroke-width': 7, 'stroke-linecap': 'round' }, no1);
      const lab1a = S.pill(g(P1, { opacity: 0 }), 820, 610, '小分子（水、氧）可以通過', { size: 24, color: C.water, edge: C.water });
      const lab1b = S.pill(g(P1, { opacity: 0 }), 380, 610, '大分子（澱粉）不能通過', { size: 24, color: '#f3e3b0', edge: '#f3e3b0' });

      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.5);
      S.drive(tl, run(d1), 3.6, 's1+=0.8');
      starches.forEach((s, k) => {
        tl.fromTo(s.m, { x: 0 }, { x: 580 - 88 - s.x, duration: 0.9, ease: 'power2.in' }, `s1+=${0.9 + k * 0.4}`);
        tl.to(s.m, { x: -30, duration: 0.8, ease: 'power2.out' }, `s1+=${1.8 + k * 0.4}`);
      });
      S.show(tl, no1, 's1+=1.8', 0.2);
      S.show(tl, lab1b.parentNode, 's1+=2.2', 0.4);
      S.show(tl, lab1a.parentNode, 's1+=2.8', 0.4);

      // ===== 2 氧與二氧化碳 =====
      const P2 = g(root, { opacity: 0 });
      const cellPts = S.blobPts(600, 380, 220, 165, 48);
      el('path', { d: S.smoothPath(cellPts), fill: 'rgba(99,212,191,0.12)', stroke: C.membrane, 'stroke-width': 6 }, P2);
      el('circle', { cx: 650, cy: 400, r: 46, fill: '#4b3d86', stroke: C.nucleus, 'stroke-width': 3 }, P2);
      text(P2, 600, 130, '細胞外', { 'font-size': 26, fill: C.mute, 'text-anchor': 'middle' });
      const d2 = [];
      const inside = () => { for (;;) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 0.75, p = [600 + Math.cos(a) * 200 * r, 380 + Math.sin(a) * 145 * r]; if (Math.hypot(p[0] - 650, p[1] - 400) > 70) return p; } };
      const outside = () => { const a = rnd() * 6.28, r = 1.18 + rnd() * 0.3; return [600 + Math.cos(a) * 240 * r, S.clamp(380 + Math.sin(a) * 180 * r, 160, 640)]; };
      for (let i = 0; i < 12; i++) d2.push(mover(o2(P2), [outside(), inside()], rnd, { amp: 4 }));
      for (let i = 0; i < 10; i++) d2.push(mover(co2(P2), [inside(), outside()], rnd, { amp: 4 }));
      const leg2 = g(P2, { opacity: 0 });
      // 圖例放在最下面（細胞外的分子最低到 y≈650），右邊那行要在舞台內
      const k1 = o2(leg2); k1.setAttribute('transform', 'translate(110,674)');
      text(leg2, 135, 684, '氧：外多內少 → 進入', { 'font-size': 26, fill: '#ffb0b0' });
      const k2 = co2(leg2); k2.setAttribute('transform', 'translate(790,674)');
      text(leg2, 820, 684, '二氧化碳：內多外少 → 離開', { 'font-size': 26, fill: C.co2 });

      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.5);
      S.show(tl, leg2, 's2+=0.8', 0.5);
      S.drive(tl, run(d2), 3.6, 's2+=1');

      // ===== 3 滲透作用 =====
      const P3 = g(root, { opacity: 0 });
      el('path', { d: 'M 250,180 V 560 H 950 V 180', fill: 'none', stroke: '#8aa1ae', 'stroke-width': 6 }, P3);
      const wl = el('rect', { x: 253, y: 300, width: 344, height: 257, fill: 'rgba(95,184,255,0.22)' }, P3);
      const wr = el('rect', { x: 603, y: 300, width: 344, height: 257, fill: 'rgba(255,207,92,0.16)' }, P3);
      for (let y = 182; y < 558; y += 44) el('rect', { x: 593, y: y + 10, width: 14, height: 26, rx: 5, fill: C.membrane }, P3);
      text(P3, 425, 150, '清水（水多）', { 'font-size': 28, 'text-anchor': 'middle', fill: C.water, 'font-weight': 700 });
      text(P3, 775, 150, '蔗糖水（水少）', { 'font-size': 28, 'text-anchor': 'middle', fill: C.sugar, 'font-weight': 700 });
      text(P3, 600, 600, '半透膜（只讓水通過）', { 'font-size': 22, 'text-anchor': 'middle', fill: C.membrane });
      const d3 = [];
      for (let i = 0; i < 18; i++) {
        const s = [285 + (i % 6) * 52 + rnd() * 20, 395 + Math.floor(i / 6) * 50 + rnd() * 20];
        const cross = i % 9 < 5;
        const k = d3.length;
        d3.push(mover(water(P3), cross ? [s, [600, 400 + (i % 4) * 40], [650 + (k % 5) * 60 + rnd() * 20, 270 + Math.floor(k / 5) * 75 + rnd() * 25]] : [s, [s[0] + (rnd() - 0.5) * 40, s[1] + (rnd() - 0.5) * 30]], rnd, { amp: 4 }));
      }
      for (let i = 0; i < 6; i++) { const s = [630 + rnd() * 290, 340 + rnd() * 200]; d3.push(mover(water(P3), [s, [630 + rnd() * 290, 340 + rnd() * 200]], rnd, { amp: 4 })); }
      for (let i = 0; i < 9; i++) { const s = [640 + rnd() * 280, 340 + rnd() * 200]; d3.push(mover(sugar(P3), [s, [640 + rnd() * 280, 300 + rnd() * 240]], rnd, { amp: 5 })); }
      const arrow3 = g(P3, { opacity: 0 });
      el('path', { d: 'M 520,250 H 670', stroke: C.hi, 'stroke-width': 6 }, arrow3);
      el('path', { d: 'M 690,250 l -24,-14 v 28 Z', fill: C.hi }, arrow3);
      text(arrow3, 600, 232, '水分子', { 'font-size': 24, fill: C.hi, 'text-anchor': 'middle', 'font-weight': 700 });

      tl.addLabel('s3');
      S.drive(tl, (u) => { mark.textContent = u > 0 ? '＊示意時間' : '＊示意'; }, 0.01, 's3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.5);
      S.drive(tl, run(d3), 4, 's3+=0.9');
      tl.fromTo(wl, { attr: { y: 300, height: 257 } }, { attr: { y: 370, height: 187 }, duration: 3.6, ease: 'power1.inOut' }, 's3+=1.1');
      tl.fromTo(wr, { attr: { y: 300, height: 257 } }, { attr: { y: 230, height: 327 }, duration: 3.6, ease: 'power1.inOut' }, 's3+=1.1');
      S.show(tl, arrow3, 's3+=1.4', 0.5);

      // ===== 4–5 清水、濃鹽水 =====
      const P4 = g(root, { opacity: 0 });
      const bgW = el('rect', { x: 60, y: 120, width: 1080, height: 520, rx: 24, fill: 'rgba(95,184,255,0.10)', stroke: '#2f4c63', 'stroke-width': 2 }, P4);
      const bgS = el('rect', { x: 60, y: 120, width: 1080, height: 520, rx: 24, fill: 'rgba(225,232,236,0.10)', stroke: '#56636b', 'stroke-width': 2, opacity: 0 }, P4);
      const salt = g(P4, { opacity: 0 });
      // 鹽粒不要落在標題（y≈165）和下方標籤（y≈604）上
      for (let i = 0; i < 40; i++) el('rect', { x: 90 + rnd() * 1020, y: 196 + rnd() * 370, width: 7, height: 7, fill: '#f2f5f7', opacity: 0.55, transform: '' }, salt);
      const tW = text(P4, 600, 90, '放進清水', { 'font-size': 34, 'text-anchor': 'middle', fill: C.water, 'font-weight': 700 });
      const tS = text(P4, 600, 90, '放進濃鹽水', { 'font-size': 34, 'text-anchor': 'middle', fill: '#e6edf0', 'font-weight': 700, opacity: 0 });
      text(P4, 330, 175, '紅血球', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P4, 870, 175, '植物細胞', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      el('line', { x1: 600, y1: 150, x2: 600, y2: 610, stroke: '#2f4c63', 'stroke-width': 2, 'stroke-dasharray': '6 8' }, P4);

      const N = 48;
      const circ = (r) => S.blobPts(330, 390, r, r, N, []);
      const RBC = { normal: circ(85), big: circ(118), small: S.blobPts(330, 390, 66, 66, N, [[12, 0.12, 0]]) };
      const rbc = el('path', { d: S.smoothPath(RBC.normal), fill: '#c43a4f', stroke: '#ff8094', 'stroke-width': 4 }, P4);
      const pallor = el('circle', { cx: 330, cy: 390, r: 36, fill: '#e0627a', opacity: 0.85 }, P4);
      const burst = g(P4, { opacity: 0 });
      for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.28; el('path', { d: `M${330 + Math.cos(a) * 132},${390 + Math.sin(a) * 132} l${Math.cos(a) * 22},${Math.sin(a) * 22}`, stroke: C.hi, 'stroke-width': 5, 'stroke-linecap': 'round' }, burst); }
      const setRBC = (A, B) => (u) => rbc.setAttribute('d', S.smoothPath(S.lerpPts(A, B, u)));

      el('rect', { x: 740, y: 280, width: 260, height: 220, rx: 26, fill: 'none', stroke: C.wall, 'stroke-width': 14 }, P4);
      const PL = { normal: S.rectPts(870, 390, 214, 176, 34, N), full: S.rectPts(870, 390, 234, 196, 34, N), shrunk: S.blobPts(870, 390, 82, 64, N, [[2, 0.05, 0.5]]) };
      const pm = el('path', { d: S.smoothPath(PL.normal), fill: 'rgba(99,212,191,0.18)', stroke: C.membrane, 'stroke-width': 5 }, P4);
      const pv = el('ellipse', { cx: 880, cy: 395, rx: 72, ry: 52, fill: 'rgba(98,168,255,0.35)', stroke: C.vacuole, 'stroke-width': 3 }, P4);
      const setPM = (A, B) => (u) => pm.setAttribute('d', S.smoothPath(S.lerpPts(A, B, u)));

      const arrowsIn = g(P4, { opacity: 0 }), arrowsOut = g(P4, { opacity: 0 });
      const arr = (p, x1, y1, x2, y2) => {
        const a = Math.atan2(y2 - y1, x2 - x1);
        el('line', { x1, y1, x2: x2 - Math.cos(a) * 12, y2: y2 - Math.sin(a) * 12, stroke: C.water, 'stroke-width': 5 }, p);
        el('path', { d: `M${x2},${y2} l${(-Math.cos(a - 0.5) * 20).toFixed(1)},${(-Math.sin(a - 0.5) * 20).toFixed(1)} l${(Math.cos(a - 0.5) * 20 - Math.cos(a + 0.5) * 20).toFixed(1)},${(Math.sin(a - 0.5) * 20 - Math.sin(a + 0.5) * 20).toFixed(1)}Z`, fill: C.water }, p);
      };
      [[330, 390], [870, 390]].forEach(([cx, cy]) => [0, 1, 2, 3].forEach((k) => {
        const plant = cx > 600, a = k * 1.5708 + (plant ? 0 : 0.785), r1 = plant ? 235 : 190, r2 = plant ? 168 : 140;
        arr(arrowsIn, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.8, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2 * 0.8);
        arr(arrowsOut, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2 * 0.8, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.8);
      }));
      const n4a = S.pill(g(P4, { opacity: 0 }), 330, 604, '吸水脹大，最後破裂', { size: 24, color: C.hi, edge: C.hi });
      const n4b = S.pill(g(P4, { opacity: 0 }), 870, 604, '細胞壁撐住，不會破', { size: 24, color: C.wall, edge: C.wall });
      const n5a = S.pill(g(P4, { opacity: 0 }), 330, 604, '失水皺縮', { size: 24, color: '#ff9aa8', edge: '#ff9aa8' });
      const n5b = S.pill(g(P4, { opacity: 0 }), 870, 604, '細胞膜和細胞壁分開', { size: 24, color: C.membrane, edge: C.membrane });

      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.5);
      S.show(tl, arrowsIn, 's4+=0.9', 0.4);
      S.drive(tl, setRBC(RBC.normal, RBC.big), 2, 's4+=1.1', 'power2.out');
      tl.to(pallor, { attr: { r: 10 }, opacity: 0, duration: 1.6 }, 's4+=1.1');
      S.drive(tl, setPM(PL.normal, PL.full), 1.6, 's4+=1.1', 'power2.out');
      tl.to(pv, { attr: { rx: 100, ry: 78 }, duration: 1.8, ease: 'power2.out' }, 's4+=1.1');
      tl.fromTo(burst, { opacity: 0 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: 3 }, 's4+=3');
      S.show(tl, [n4a.parentNode, n4b.parentNode], 's4+=3', 0.4);

      tl.addLabel('s5');
      S.hide(tl, [n4a.parentNode, n4b.parentNode, arrowsIn], 's5', 0.3);
      S.hide(tl, [bgW, tW], 's5', 0.5);
      S.show(tl, [bgS, tS, salt], 's5+=0.2', 0.5);
      S.drive(tl, setRBC(RBC.big, RBC.normal), 0.6, 's5+=0.2');
      tl.to(pallor, { attr: { r: 36 }, opacity: 0.85, duration: 0.6 }, 's5+=0.2');
      S.drive(tl, setPM(PL.full, PL.normal), 0.6, 's5+=0.2');
      tl.to(pv, { attr: { rx: 72, ry: 52 }, duration: 0.6 }, 's5+=0.2');
      S.show(tl, arrowsOut, 's5+=1', 0.4);
      S.drive(tl, setRBC(RBC.normal, RBC.small), 2, 's5+=1.2', 'power2.out');
      tl.to(pallor, { attr: { r: 18 }, duration: 2 }, 's5+=1.2');
      S.drive(tl, setPM(PL.normal, PL.shrunk), 2, 's5+=1.2', 'power2.out');
      tl.to(pv, { attr: { rx: 40, ry: 28 }, duration: 2, ease: 'power2.out' }, 's5+=1.2');
      S.show(tl, [n5a.parentNode, n5b.parentNode], 's5+=3', 0.4);

      // ===== 6 生活中的例子 =====
      const P6 = g(root, { opacity: 0 });
      const frame = (x, title, sub, col) => {
        const f = g(P6);
        el('rect', { x: x - 180, y: 120, width: 360, height: 500, rx: 18, fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 }, f);
        text(f, x, 168, title, { 'font-size': 28, 'font-weight': 700, 'text-anchor': 'middle', fill: col });
        S.pill(f, x, 580, sub, { size: 22, color: col, edge: col });
        return f;
      };
      // 肺泡與微血管：擴散
      const F1 = frame(220, '肺泡和血液', '擴散', '#ff8094');
      el('circle', { cx: 200, cy: 360, r: 110, fill: 'rgba(98,168,255,0.12)', stroke: '#9fc4ff', 'stroke-width': 4 }, F1);
      el('path', { d: 'M 60,500 C 140,470 300,480 380,440', stroke: '#c43a4f', 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round' }, F1);
      text(F1, 200, 300, '肺泡', { 'font-size': 22, fill: '#9fc4ff', 'text-anchor': 'middle' });
      text(F1, 330, 520, '微血管', { 'font-size': 20, fill: '#ff8094', 'text-anchor': 'middle' });
      const o2s = [], co2s = [];
      for (let i = 0; i < 4; i++) { const m = o2(F1); o2s.push({ m, a: [160 + i * 26, 360 + (i % 2) * 30], b: [140 + i * 50, 486 - i * 8] }); }
      for (let i = 0; i < 3; i++) { const m = co2(F1); co2s.push({ m, a: [170 + i * 60, 482 - i * 10], b: [170 + i * 30, 330 + (i % 2) * 30] }); }
      const moveMols = (u) => [...o2s, ...co2s].forEach(({ m, a, b }) => m.setAttribute('transform', `translate(${S.lerp(a[0], b[0], u).toFixed(1)},${S.lerp(a[1], b[1], u).toFixed(1)})`));
      moveMols(0);
      // 根毛吸水：滲透
      const F2 = frame(600, '根毛從土壤吸水', '滲透', C.water);
      el('rect', { x: 430, y: 200, width: 340, height: 340, fill: '#3a2c20' }, F2);
      for (let i = 0; i < 26; i++) el('circle', { cx: 440 + ((i * 53) % 320), cy: 210 + ((i * 97) % 320), r: 6 + (i % 3) * 3, fill: '#5a4632' }, F2);
      el('path', { d: 'M 470,230 L 540,230 L 540,330 C 600,330 680,336 740,342 C 750,344 750,362 740,364 C 680,370 600,372 540,372 L 540,520 L 470,520 Z', fill: 'rgba(217,194,124,0.25)', stroke: C.wall, 'stroke-width': 4 }, F2);
      el('ellipse', { cx: 505, cy: 380, rx: 14, ry: 10, fill: '#4b3d86' }, F2);
      const waters = [];
      for (let i = 0; i < 5; i++) { const m = water(F2); waters.push({ m, a: [700 - i * 6, 300 + i * 22 - (i > 2 ? -60 : 0)], b: [600 - i * 18, 352] }); }
      const moveWater = (u) => waters.forEach(({ m, a, b }) => m.setAttribute('transform', `translate(${S.lerp(a[0], b[0], u).toFixed(1)},${S.lerp(a[1], b[1], u).toFixed(1)})`));
      moveWater(0);
      // 醃漬：滲透
      const F3 = frame(980, '鹽醃、糖漬保存食物', '滲透', C.sugar);
      el('path', { d: 'M 870,260 L 1090,260 L 1080,520 C 1060,540 900,540 880,520 Z', fill: 'rgba(242,245,247,0.08)', stroke: '#cfd6dc', 'stroke-width': 4 }, F3);
      for (let i = 0; i < 30; i++) el('rect', { x: 890 + ((i * 37) % 180), y: 290 + ((i * 71) % 220), width: 7, height: 7, fill: '#f2f5f7', opacity: 0.6 }, F3);
      const mic = g(F3);
      const micPath = el('path', { d: S.smoothPath(S.blobPts(980, 400, 40, 26, 24, [])), fill: 'rgba(111,206,98,0.3)', stroke: '#9be58c', 'stroke-width': 4 }, mic);
      const micA = S.blobPts(980, 400, 40, 26, 24, []), micB = S.blobPts(980, 400, 26, 16, 24, [[7, 0.18, 0]]);
      const leave = [];
      for (let i = 0; i < 4; i++) { const m = water(F3); const a = (i / 4) * 6.28; leave.push({ m, a: [980 + Math.cos(a) * 18, 400 + Math.sin(a) * 10], b: [980 + Math.cos(a) * 70, 400 + Math.sin(a) * 52] }); }
      const shrinkMic = (u) => { micPath.setAttribute('d', S.smoothPath(S.lerpPts(micA, micB, u))); leave.forEach(({ m, a, b }) => { m.setAttribute('transform', `translate(${S.lerp(a[0], b[0], u).toFixed(1)},${S.lerp(a[1], b[1], u).toFixed(1)})`); m.setAttribute('opacity', u > 0.02 ? 1 : 0); }); };
      shrinkMic(0);
      text(F3, 980, 214, '細菌、黴菌在濃鹽水', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });
      text(F3, 980, 243, '或濃糖水中失水', { 'font-size': 22, fill: C.mute, 'text-anchor': 'middle' });

      tl.addLabel('s6');
      // 這一步的備註是「＊示意」（不是示意時間），右上角標記跟著換回來
      S.drive(tl, (u) => { mark.textContent = u > 0 ? '＊示意' : '＊示意時間'; }, 0.01, 's6');
      S.hide(tl, P4, 's6', 0.4);
      S.show(tl, P6, 's6+=0.3', 0.5);
      tl.fromTo([F1, F2, F3], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 }, 's6+=0.4');
      S.drive(tl, moveMols, 2, 's6+=1.2', 'power1.inOut');
      S.drive(tl, moveWater, 2, 's6+=1.8', 'power1.inOut');
      S.drive(tl, shrinkMic, 2, 's6+=2.4', 'power1.inOut');

      return {
        tl,
        // 每一步的備註（顯示在說明文字下方）
        notes: [
          '＊示意：分子畫得很大，時間也經過壓縮。真實的擴散，距離越遠越慢，一滴墨水散開要好幾個小時。',
          '＊示意：分子都放大畫了；膜上的缺口只表示「可以通過」，細胞膜不是篩子。',
          '＊示意：細胞只有幾十 μm 寬，真實的氧和二氧化碳擴散進出不到 0.1 秒。',
          '＊示意時間：真實的滲透實驗（例如 U 形管）要幾十分鐘以上，水位才看得出變化。',
          '＊示意時間：真實的紅血球放進清水，幾秒內就會吸水脹大、破裂；植物細胞吸水變飽滿要幾分鐘。',
          '＊示意時間：紅血球幾秒內就會皺縮；植物細胞的細胞膜和細胞壁分開，真實要幾十秒到幾分鐘。',
          '＊示意：構造放大畫，只表示物質移動的方向。',
        ],
        steps: [
          '<b>擴散作用</b>：分子會從濃度高的地方往濃度低的地方移動，最後分布均勻；之後分子仍在運動，只是不再有淨移動。例如一滴紅墨水在靜止的水中，要好幾個小時才會慢慢散開。',
          '細胞膜有<b>選擇性</b>：水、氧、二氧化碳等小分子可以通過；澱粉等大分子不能直接通過。',
          '細胞進行呼吸作用會消耗氧、產生二氧化碳，所以<b>氧氣擴散進入</b>細胞，<b>二氧化碳擴散出去</b>。',
          '<b>滲透作用</b>：水分子通過半透膜（例如細胞膜）的擴散。這個半透膜只讓水通過，蔗糖過不去。兩邊的水都會通過膜，但水會往<b>比較濃（水比較少）</b>的蔗糖水那一邊移動得比較多。',
          '放進<b>清水</b>：水進入細胞。紅血球會吸水脹大，最後破裂；植物細胞有細胞壁撐住，變得飽滿但不會破。',
          '放進<b>濃鹽水</b>：水離開細胞。紅血球皺縮，植物細胞的細胞膜和細胞壁分開。青菜撒鹽會出水變軟，就是這個道理。',
          '生活中的例子：肺泡和血液交換氧與二氧化碳是<b>擴散</b>；根毛從土壤吸水，以及鹽醃、糖漬讓細菌和黴菌失水而能保存食物，都是<b>滲透</b>。',
        ],
      };
    },
  });
})();
