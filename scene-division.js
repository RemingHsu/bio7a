/* 七下 1-1 細胞的分裂：遺傳物質的層次（跨尺度）、成對的染色體、細胞分裂、減數分裂、受精使數目恢復
   這個檔案也提供第七章（生殖）共用的染色體／細胞分裂小工具（S.b1），互動 lab-division.js 會用到。 */
(() => {
  const { el, g, text, C } = S;
  const B1 = (S.b1 = S.b1 || {});
  const FA = '#62a8ff', MO = '#ff7d9a'; // 來自父方（藍）、來自母方（粉紅）
  const CELL_FILL = '#11262e', CELL_EDGE = C.membrane;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  B1.FA = FA; B1.MO = MO; B1.FRAME = FRAME;
  const sm = (a, b, u) => S.smoothstep(a, b, u);

  // ---------- 染色體：一條「分體」是中間有凹（著絲點）的長條；複製後兩條在著絲點相連，成 X 形 ----------
  const rodD = (L, W) => {
    const h = L / 2, r = W / 2, n = Math.max(1, Math.min(5, h - r - 1));
    return `M ${-r},${-h + r} A ${r},${r} 0 0 1 ${r},${-h + r} L ${r},${-n} Q ${r * 0.35},0 ${r},${n} L ${r},${h - r} A ${r},${r} 0 0 1 ${-r},${h - r} L ${-r},${n} Q ${-r * 0.35},0 ${-r},${-n} Z`;
  };
  B1.rodD = rodD;
  B1.rod = (p, L, color, W = 16) => {
    const c = g(p);
    el('path', { d: rodD(L, W), fill: color, stroke: '#0d1822', 'stroke-width': 1.5 }, c);
    const h = L / 2;
    if (h - W * 0.6 > 10) [[-h + W * 0.6, -W * 0.5], [W * 0.5, h - W * 0.6]].forEach(([y1, y2]) => el('line', { x1: -W * 0.18, y1, x2: -W * 0.18, y2, stroke: '#ffffff', 'stroke-width': Math.max(1.5, W * 0.14), 'stroke-linecap': 'round', opacity: 0.35 }, c));
    return c;
  };
  // 一條染色體（兩條分體 a、b；未複製時 b 隱藏）
  B1.chromo = (p, L, color, W = 16) => {
    const o = { L, color, W, g: g(p) };
    o.a = B1.rod(o.g, L, color, W);
    o.b = B1.rod(o.g, L, color, W);
    o.b.setAttribute('opacity', 0);
    return o;
  };
  // X 形（或未複製的一條）：dup 0→1 時第二條分體出現、張開
  B1.xPose = (o, x, y, dup = 0, rot = 0, s = 1) => {
    const t = (rot * Math.PI) / 180, off = 3 * dup * s, ang = 12 * dup;
    S.place(o.a, { x: x - off * Math.cos(t), y: y - off * Math.sin(t), r: rot - ang, s });
    S.place(o.b, { x: x + off * Math.cos(t), y: y + off * Math.sin(t), r: rot + ang, s });
    o.b.setAttribute('opacity', dup > 0.02 ? 1 : 0);
  };
  // 兩條分體分開：a、b 各自到 (ax,ay)、(bx,by)；k 0→1 時夾角變直
  B1.splitPose = (o, ax, ay, bx, by, k, rot = 0, s = 1) => {
    const ang = 12 * (1 - S.clamp(k));
    S.place(o.a, { x: ax, y: ay, r: rot - ang, s });
    S.place(o.b, { x: bx, y: by, r: rot + ang, s });
    o.b.setAttribute('opacity', 1);
  };

  // ---------- 細胞（可以一分為二）：先畫所有外框、再畫所有填色，相連的細胞合成一個輪廓 ----------
  B1.cells = (p, nc = 4, nb = 2, { fill = CELL_FILL, edge = CELL_EDGE, sw = 4 } = {}) => {
    const G = g(p), E = g(G), F = g(G);
    const mk = (n) => Array.from({ length: n }, () => ({ e: el('ellipse', { fill: edge, opacity: 0 }, E), f: el('ellipse', { fill, opacity: 0 }, F) }));
    const cs = mk(nc), bs = mk(nb);
    const setE = (o, x, y, rx, ry, a) => {
      [[o.e, sw], [o.f, 0]].forEach(([e, d]) => {
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1));
        e.setAttribute('rx', Math.max(0, rx + d).toFixed(1)); e.setAttribute('ry', Math.max(0, ry + d).toFixed(1));
        e.setAttribute('transform', `rotate(${a.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`);
        e.setAttribute('opacity', 1);
      });
    };
    const hide = (o) => { o.e.setAttribute('opacity', 0); o.f.setAttribute('opacity', 0); };
    return {
      g: G,
      // circles：[[x, y, r], …]；bridges：[[x1, y1, x2, y2, 半寬], …]（兩個細胞之間的「腰」）
      draw(circles, bridges = []) {
        cs.forEach((o, i) => (circles[i] ? setE(o, circles[i][0], circles[i][1], circles[i][2], circles[i][2], 0) : hide(o)));
        bs.forEach((o, i) => {
          const b = bridges[i];
          if (!b || b[4] <= 0.5) return hide(o);
          const [x1, y1, x2, y2, w] = b, a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
          setE(o, (x1 + x2) / 2, (y1 + y2) / 2, Math.hypot(x2 - x1, y2 - y1) / 2 + 2, w, a);
        });
      },
    };
  };
  const nucleus = (p) => el('circle', { cx: 0, cy: 0, r: 0, fill: 'rgba(167,150,255,0.10)', stroke: C.nucleus, 'stroke-width': 2.5, 'stroke-dasharray': '10 6', opacity: 0 }, p);
  const setNuc = (n, x, y, r, op) => { n.setAttribute('cx', x); n.setAttribute('cy', y); n.setAttribute('r', r); n.setAttribute('opacity', op); };
  const SCAT = [[-50, -26, -24], [48, -8, 28], [-22, 50, 62], [30, -56, -48], [8, 32, 12], [-62, 38, 34]];
  // 兩條相鄰的染色體（同一對）並排的位置
  const pairX = (k, np, Px) => (k - (np - 1) / 2) * Px;
  const makeSet = (p, pairs, W) => {
    const ch = [];
    pairs.forEach((L, k) => [FA, MO].forEach((col, j) => ch.push({ o: B1.chromo(p, L, col, W), k, j, L })));
    return ch;
  };

  // ---------- 細胞分裂：u 0→1。複製 → 排列 → 分開 → 分成兩個子細胞 ----------
  // 回傳 { set(u), phase(u) }；phase：0 複製、1 排列、2 分開、3 分成兩個細胞、4 完成
  B1.mitosis = (p, { cx, cy, R, D, r2, pairs, W = 16 }) => {
    const layer = B1.cells(p, 2, 1);
    const nucs = [0, 1, 2].map(() => nucleus(p));
    const ch = makeSet(p, pairs, W);
    const n = ch.length, np = pairs.length, gap = 10;
    const sum = ch.reduce((a, c) => a + c.L, 0);
    const scale = Math.min(1, (1.75 * R - gap * (n - 1)) / sum);
    // 赤道上由上到下排列
    let yy = cy - (sum * scale + gap * (n - 1)) / 2;
    const eq = ch.map((c) => { const y = yy + (c.L * scale) / 2; yy += c.L * scale + gap; return y; });
    const sep = R * 0.56, Px = Math.min(56, (r2 * 1.1) / np);
    const scat = ch.map((c, i) => [cx + SCAT[i % 6][0] * (R / 150), cy + SCAT[i % 6][1] * (R / 150), SCAT[i % 6][2]]);
    const dest = (c, side) => [cx + side * D + pairX(c.k, np, Px) + (c.j ? 11 : -11) * (W / 16), cy];
    const st = scale;
    const set = (u) => {
      const q = sm(0.42, 0.86, u), d = D * q, r = S.lerp(R, r2, q), w = r * (1 - sm(0.3, 0.98, q));
      layer.draw([[cx - d, cy, r], [cx + d, cy, r]], [[cx - d, cy, cx + d, cy, w]]);
      setNuc(nucs[0], cx, cy, R * 0.62, 1 - sm(0.18, 0.28, u));
      [-1, 1].forEach((s, i) => setNuc(nucs[i + 1], cx + s * D, cy, r2 * 0.64, sm(0.86, 0.98, u)));
      const dup = sm(0.02, 0.18, u), al = sm(0.2, 0.38, u), sp = sm(0.42, 0.58, u), mv = sm(0.6, 0.86, u);
      ch.forEach((c, i) => {
        if (sp <= 0) {
          const [x0, y0, r0] = scat[i];
          B1.xPose(c.o, S.lerp(x0, cx, al), S.lerp(y0, eq[i], al), dup, S.lerp(r0, 0, al), st);
        } else {
          const [ax, ay] = dest(c, -1), [bx, by] = dest(c, 1);
          B1.splitPose(c.o, S.lerp(S.lerp(cx - 3, cx - sep, sp), ax, mv), S.lerp(eq[i], ay, mv), S.lerp(S.lerp(cx + 3, cx + sep, sp), bx, mv), S.lerp(eq[i], by, mv), sp, 0, st);
        }
      });
    };
    const phase = (u) => (u < 0.19 ? 0 : u < 0.4 ? 1 : u < 0.59 ? 2 : u < 0.97 ? 3 : 4);
    set(0);
    return { set, phase, ch };
  };

  // ---------- 減數分裂：複製 → 同源染色體配對 → 第一次分裂（同源染色體分開）→ 第二次分裂（複製的染色體分開）→ 4 個子細胞 ----------
  // 版面：先上下分成兩個，再各自左右分成兩個（2×2）
  B1.meiosis = (p, { cx, cy, R0, D1, R1, D2, R2, pairs, W = 16 }) => {
    const layer = B1.cells(p, 4, 2);
    const nucs = [0, 1, 2, 3, 4].map(() => nucleus(p));
    const ch = makeSet(p, pairs, W);
    const np = pairs.length;
    const up = (c) => (c.k % 2 === 0 ? c.j === 0 : c.j === 1); // 第一次分裂往上的：第 1 對父方、第 2 對母方…（方向是隨機的，這裡選一種）
    const Px = Math.min(76, (R0 * 1.5) / np), Pg = Math.min(34, (R2 * 1.1) / np);
    const scat = ch.map((c, i) => [cx + SCAT[i % 6][0] * (R0 / 150), cy + SCAT[i % 6][1] * (R0 / 150), SCAT[i % 6][2]]);
    const pairPos = (c) => [cx + pairX(c.k, np, Px), cy + (up(c) ? -1 : 1) * (c.L / 2 + 7)];
    // 第一次分裂後：在子細胞的中線上由上到下排好
    const stack = (c) => {
      const mates = ch.filter((x) => up(x) === up(c));
      const sum = mates.reduce((a, x) => a + x.L, 0) + 12 * (mates.length - 1);
      let y = (up(c) ? cy - D1 : cy + D1) - sum / 2;
      for (const x of mates) { if (x === c) return [cx, y + x.L / 2]; y += x.L + 12; }
      return [cx, cy];
    };
    const final = (c, side) => [cx + side * D2 + pairX(c.k, np, Pg), up(c) ? cy - D1 : cy + D1];
    const set = (u) => {
      const q1 = sm(0.28, 0.5, u), q2 = sm(0.56, 0.82, u);
      if (q2 <= 0) {
        const d = D1 * q1, r = S.lerp(R0, R1, q1), w = r * (1 - sm(0.3, 0.98, q1));
        layer.draw([[cx, cy - d, r], [cx, cy + d, r]], [[cx, cy - d, cx, cy + d, w]]);
      } else {
        const d = D2 * q2, r = S.lerp(R1, R2, q2), w = r * (1 - sm(0.3, 0.98, q2));
        const yT = cy - D1, yB = cy + D1;
        layer.draw([[cx - d, yT, r], [cx + d, yT, r], [cx - d, yB, r], [cx + d, yB, r]], [[cx - d, yT, cx + d, yT, w], [cx - d, yB, cx + d, yB, w]]);
      }
      setNuc(nucs[0], cx, cy, R0 * 0.62, 1 - sm(0.12, 0.22, u));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => setNuc(nucs[i + 1], cx + sx * D2, cy + sy * D1, R2 * 0.62, sm(0.85, 0.98, u)));
      const dup = sm(0.02, 0.12, u), al = sm(0.14, 0.26, u);
      ch.forEach((c, i) => {
        if (q2 <= 0) {
          const [x0, y0, r0] = scat[i], [px, py] = pairPos(c), [sx, sy] = stack(c);
          const x = q1 > 0 ? S.lerp(px, sx, sm(0.15, 1, q1)) : S.lerp(x0, px, al);
          const y = q1 > 0 ? S.lerp(py, sy, sm(0.05, 1, q1)) : S.lerp(y0, py, al);
          B1.xPose(c.o, x, y, dup, q1 > 0 ? 0 : S.lerp(r0, 0, al));
        } else {
          const [sx, sy] = stack(c), [ax, ay] = final(c, -1), [bx, by] = final(c, 1), k = sm(0, 0.7, q2);
          B1.splitPose(c.o, S.lerp(sx - 3, ax, k), S.lerp(sy, ay, k), S.lerp(sx + 3, bx, k), S.lerp(sy, by, k), k);
        }
      });
    };
    const phase = (u) => (u < 0.13 ? 0 : u < 0.27 ? 1 : u < 0.53 ? 2 : u < 0.97 ? 3 : 4);
    set(0);
    return { set, phase, ch, centers: [[cx - D2, cy - D1], [cx + D2, cy - D1], [cx - D2, cy + D1], [cx + D2, cy + D1]] };
  };

  // ---------- 精子與卵（示意：精子畫得比實際大很多） ----------
  B1.spermD = (wig, len = 150) => {
    // 尾巴：從頭部後方往後延伸的波浪線
    let d = 'M -26,0';
    for (let i = 1; i <= 24; i++) { const x = -26 - (len * i) / 24; d += ` L ${x.toFixed(1)},${(Math.sin(i * 0.55 + wig) * 9 * (i / 24 + 0.2)).toFixed(1)}`; }
    return d;
  };
  B1.sperm = (p, { s = 1, head = '#cfe8ff' } = {}) => {
    const sp = g(p);
    const inner = S.place(g(sp), { s });
    const tail = el('path', { d: B1.spermD(0), fill: 'none', stroke: '#cfe8ff', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, inner);
    el('rect', { x: -34, y: -5, width: 14, height: 10, rx: 4, fill: '#a9c9dd' }, inner);
    el('ellipse', { cx: 0, cy: 0, rx: 24, ry: 16, fill: head, stroke: '#ffffff', 'stroke-width': 2 }, inner);
    el('ellipse', { cx: 4, cy: 0, rx: 15, ry: 10, fill: FA, opacity: 0.55 }, inner);
    sp.wiggle = (t) => tail.setAttribute('d', B1.spermD(t));
    sp.tail = tail;
    return sp;
  };
  B1.egg = (p, x, y, r) => {
    const e = g(p);
    el('circle', { cx: x, cy: y, r: r + 14, fill: 'rgba(255,214,160,0.07)', stroke: 'rgba(255,214,160,0.35)', 'stroke-width': 2 }, e);
    el('circle', { cx: x, cy: y, r, fill: 'rgba(255,214,160,0.16)', stroke: '#ffd6a0', 'stroke-width': 3 }, e);
    const rnd = S.rng(9);
    for (let i = 0; i < 26; i++) { const a = rnd() * 6.283, rr = r * (0.2 + rnd() * 0.72); el('circle', { cx: x + Math.cos(a) * rr, cy: y + Math.sin(a) * rr, r: 2 + rnd() * 2, fill: '#ffd6a0', opacity: 0.35 }, e); }
    return e;
  };

  // ---------- 動畫 ----------
  S.register({
    id: 'division', section: '下1-1', title: '細胞分裂與減數分裂',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 遺傳物質的層次：細胞 → 細胞核 → 染色體 → DNA → 基因 =====
      const P0 = g(root);
      text(P0, 600, 60, '遺傳物質在哪裡？一層一層放大', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const FX = [24, 256, 488, 720, 952], FW = 214, FY = 96, FH = 384, CX = FX.map((x) => x + FW / 2);
      const fr = FX.map((x) => { const f = g(P0, { opacity: 0 }); el('rect', { x, y: FY, width: FW, height: FH, rx: 16, ...FRAME }, f); return f; });
      // 細胞
      el('path', { d: S.smoothPath(S.blobPts(CX[0], 286, 84, 76)), fill: 'rgba(99,212,191,0.10)', stroke: C.membrane, 'stroke-width': 3 }, fr[0]);
      [[CX[0] - 46, 330, 20], [CX[0] + 44, 250, -30], [CX[0] + 40, 336, 60]].forEach(([x, y, r]) => {
        el('ellipse', { cx: x, cy: y, rx: 14, ry: 7, fill: 'rgba(255,154,92,0.5)', stroke: C.mito, 'stroke-width': 1.5, transform: `rotate(${r} ${x} ${y})` }, fr[0]);
      });
      el('circle', { cx: CX[0] - 6, cy: 280, r: 30, fill: 'rgba(167,150,255,0.4)', stroke: C.nucleus, 'stroke-width': 2.5 }, fr[0]);
      el('circle', { cx: CX[0] - 2, cy: 276, r: 9, fill: 'rgba(120,100,220,0.8)' }, fr[0]);
      // 細胞核：細絲狀的遺傳物質
      el('circle', { cx: CX[1], cy: 280, r: 94, fill: 'rgba(167,150,255,0.12)', stroke: C.nucleus, 'stroke-width': 4 }, fr[1]);
      el('circle', { cx: CX[1], cy: 280, r: 87, fill: 'none', stroke: C.nucleus, 'stroke-width': 1.5, opacity: 0.6 }, fr[1]);
      const rt = S.rng(5);
      for (let i = 0; i < 11; i++) {
        let a = rt() * 6.283, rr = rt() * 60, x = CX[1] + Math.cos(a) * rr, y = 280 + Math.sin(a) * rr, d = `M ${x.toFixed(1)},${y.toFixed(1)}`;
        for (let k = 0; k < 4; k++) {
          const nx = S.clamp(x + (rt() - 0.5) * 70, CX[1] - 70, CX[1] + 70), ny = S.clamp(y + (rt() - 0.5) * 70, 210, 350);
          d += ` Q ${(x + (rt() - 0.5) * 50).toFixed(1)},${(y + (rt() - 0.5) * 50).toFixed(1)} ${nx.toFixed(1)},${ny.toFixed(1)}`; x = nx; y = ny;
        }
        el('path', { d, fill: 'none', stroke: '#cbbcff', 'stroke-width': 2.2, opacity: 0.85, 'stroke-linecap': 'round' }, fr[1]);
      }
      text(fr[1], CX[1], 420, '平時呈細絲狀', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 染色體（複製後的 X 形）
      const bigX = B1.chromo(fr[2], 214, '#b9a8ff', 46);
      B1.xPose(bigX, CX[2], 270, 1, 0, 1);
      text(fr[2], CX[2], 420, '細胞分裂時', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(fr[2], CX[2], 448, '濃縮成棒狀', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // DNA（雙股螺旋）
      const helix = (p, x0, y0, y1, amp, per, cols = null) => {
        const s1 = [], s2 = [];
        for (let y = y0; y <= y1; y += 4) { const ph = ((y - y0) / per) * 6.283; s1.push([x0 + amp * Math.sin(ph), y]); s2.push([x0 + amp * Math.sin(ph + Math.PI), y]); }
        for (let y = y0 + 6; y < y1; y += 13) {
          const ph = ((y - y0) / per) * 6.283;
          el('line', { x1: x0 + amp * Math.sin(ph), y1: y, x2: x0 + amp * Math.sin(ph + Math.PI), y2: y, stroke: ['#ff9a5c', '#6fce62', '#ffd166', '#62a8ff'][Math.round(y / 13) % 4], 'stroke-width': 4, opacity: 0.8 }, p);
        }
        [s1, s2].forEach((s, i) => el('path', { d: 'M ' + s.map(([x, y]) => `${x.toFixed(1)},${y}`).join(' L '), fill: 'none', stroke: i ? '#9be0ff' : '#e8f6ff', 'stroke-width': 5, 'stroke-linecap': 'round' }, p));
      };
      helix(fr[3], CX[3], 126, 396, 40, 112);
      text(fr[3], CX[3], 440, '像扭轉的長梯子', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 基因：DNA 上的一段一段
      [[132, 206, C.hi], [226, 300, '#6fce62'], [320, 392, '#ff9a5c']].forEach(([a, b, c]) => el('rect', { x: CX[4] - 64, y: a, width: 128, height: b - a, rx: 10, fill: c, opacity: 0.22, stroke: c, 'stroke-width': 2 }, fr[4]));
      helix(fr[4], CX[4], 126, 396, 40, 112);
      text(fr[4], CX[4], 440, '一段一段的基因', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      [['細胞', '約 20 μm＊', '人體細胞'], ['細胞核', '約 6 μm＊', '含有遺傳物質'], ['染色體', '約 5 μm＊', 'DNA＋蛋白質'], ['DNA', '寬約 2 nm＊', '遺傳物質'], ['基因', 'DNA 上的片段', '控制特徵']].forEach(([n, s, t], i) => {
        text(fr[i], CX[i], 528, n, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
        S.pill(fr[i], CX[i], 576, s, { size: 22, color: C.hi });
        text(fr[i], CX[i], 630, t, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      });
      const zooms = [[[CX[0] - 6, 280, 74], 1], [[CX[1] + 30, 250, 52], 2], [[CX[2] + 34, 196, 46], 3], [[CX[3], 300, 50], 4]].map(([[x, y, s], j]) => {
        const zg = g(P0, { opacity: 0 });
        el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zg);
        [[y - s / 2, FY], [y + s / 2, FY + FH]].forEach(([y1, y2]) => el('line', { x1: x + s / 2, y1, x2: FX[j], y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.7 }, zg));
        return zg;
      });
      tl.addLabel('s0');
      S.show(tl, fr[0], 's0+=0.2', 0.5);
      zooms.forEach((z, i) => { S.show(tl, z, `s0+=${0.9 + i * 1.1}`, 0.4); S.show(tl, fr[i + 1], `s0+=${1.2 + i * 1.1}`, 0.5); });

      // ===== 1 染色體成對：人的 23 對 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 660, height: 400, rx: 16, ...FRAME }, P1);
      S.pill(P1, 360, 56, '人的體細胞：46 條＝23 對', { size: 26, color: C.hi, edge: C.hi });
      const kar = g(P1);
      const pairsG = [];
      for (let i = 0; i < 23; i++) {
        const L = i < 22 ? 96 - i * 3.1 : 66, row = i < 8 ? 0 : i < 16 ? 1 : 2, col = i - [0, 8, 16][row];
        const x = 80 + col * 80, y = [168, 316, 432][row];
        const pg = g(kar, { opacity: 0 });
        S.place(B1.rod(pg, L, FA, 13), { x: x - 9, y });
        S.place(B1.rod(pg, L, MO, 13), { x: x + 9, y });
        pairsG.push(pg);
      }
      [[110, FA, '來自父方'], [330, MO, '來自母方']].forEach(([x, c, s]) => { S.place(B1.rod(P1, 40, c, 13), { x, y: 540 }); text(P1, x + 22, 549, s, { 'font-size': 24, fill: c, 'font-weight': 700 }); });
      // 放大一對
      const zp = g(P1, { opacity: 0 });
      el('rect', { x: 623, y: 122, width: 34, height: 92, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, zp);
      [[122, 96], [214, 496]].forEach(([y1, y2]) => el('line', { x1: 657, y1, x2: 720, y2, stroke: C.hi, 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.6 }, zp));
      const hom = g(P1, { opacity: 0 });
      el('rect', { x: 720, y: 96, width: 450, height: 400, rx: 16, ...FRAME }, hom);
      text(hom, 945, 140, '同源染色體', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      S.place(B1.rod(hom, 250, FA, 34), { x: 820, y: 316 });
      S.place(B1.rod(hom, 250, MO, 34), { x: 866, y: 316 });
      [['大小、形狀相似', C.ink, 236], ['一條來自父方', FA, 300], ['一條來自母方', MO, 364]].forEach(([s, c, y]) => text(hom, 920, y, s, { 'font-size': 26, fill: c, 'font-weight': 700 }));
      text(hom, 920, 430, '（成對存在）', { 'font-size': 22, fill: C.mute });
      const sets = g(P1, { opacity: 0 });
      S.pill(sets, 330, 614, '體細胞：染色體成對 → 雙套（2n）', { size: 24, color: C.ink, edge: '#4a6272' });
      S.pill(sets, 870, 614, '精子、卵：每對只有一條 → 單套（n）', { size: 24, color: C.hi, edge: C.hi });
      text(P1, 600, 686, '染色體數目因生物而不同：豌豆 14 條、人 46 條、黑猩猩 48 條', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      pairsG.forEach((pg, i) => S.show(tl, pg, `s1+=${0.6 + i * 0.07}`, 0.3));
      S.show(tl, zp, 's1+=2.6', 0.4);
      S.show(tl, hom, 's1+=2.9', 0.5);
      S.show(tl, sets, 's1+=4.2', 0.5);

      // ===== 2 細胞分裂 =====
      const P2 = g(root, { opacity: 0 });
      const mit = B1.mitosis(g(P2), { cx: 390, cy: 340, R: 175, D: 170, r2: 150, pairs: [86, 48], W: 17 });
      const ph2 = ['① 染色體複製一次', '② 排列在細胞中央', '③ 複製的染色體分開', '④ 分成兩個子細胞'].map((s) => { const p = g(P2, { opacity: 0 }); S.pill(p, 390, 52, s, { size: 26, color: C.hi, edge: C.hi }); return p; });
      const cnt2a = g(P2);
      text(cnt2a, 390, 572, '母細胞：4 條（2 對）', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      const cnt2b = g(P2, { opacity: 0 });
      [220, 560].forEach((x) => text(cnt2b, x, 548, '4 條（2 對）', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi }));
      text(cnt2b, 390, 610, '子細胞的染色體數目和原來相同', { 'font-size': 24, 'text-anchor': 'middle', fill: C.ink });
      const use2 = g(P2, { opacity: 0 });
      el('rect', { x: 790, y: 96, width: 380, height: 540, rx: 16, ...FRAME }, use2);
      text(use2, 980, 142, '細胞分裂的功用', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const uses = [['生長', '細胞數目增加，個體長大'], ['更新、修補', '例如：傷口癒合'], ['單細胞生物的生殖', '例如：草履蟲（分裂生殖）']].map(([a, b], i) => {
        const ug = g(use2, { opacity: 0 });
        const y = 214 + i * 130;
        el('circle', { cx: 830, cy: y - 9, r: 16, fill: C.hi }, ug);
        text(ug, 830, y - 1, String(i + 1), { 'font-size': 22, 'text-anchor': 'middle', fill: '#0d1822', 'font-weight': 700 });
        text(ug, 860, y, a, { 'font-size': 26, 'font-weight': 700, fill: C.hi });
        text(ug, 860, y + 40, b, { 'font-size': 22, fill: C.ink2 });
        return ug;
      });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      const T2 = 6, t2 = (f) => `s2+=${(0.8 + f * T2).toFixed(2)}`;
      S.drive(tl, (u) => mit.set(u), T2, 's2+=0.8', 'none');
      [[0, 0.19], [0.19, 0.4], [0.4, 0.59], [0.59, 1]].forEach(([a, b], i) => { S.show(tl, ph2[i], i ? `s2+=${(0.8 + a * T2 + 0.22).toFixed(2)}` : t2(a), 0.25); if (i < 3) S.hide(tl, ph2[i], t2(b), 0.2); });
      S.hide(tl, cnt2a, t2(0.45), 0.3);
      S.show(tl, cnt2b, t2(0.95), 0.4);
      S.show(tl, use2, 's2+=7.2', 0.4);
      uses.forEach((u, i) => S.show(tl, u, `s2+=${7.4 + i * 0.5}`, 0.35));

      // ===== 3 減數分裂 =====
      const P3 = g(root, { opacity: 0 });
      const mei = B1.meiosis(g(P3), { cx: 390, cy: 380, R0: 150, D1: 138, R1: 120, D2: 124, R2: 104, pairs: [80, 46], W: 16 });
      const cnt3a = g(P3);
      text(cnt3a, 556, 388, '4 條（2 對）', { 'font-size': 26, 'font-weight': 700 });
      const cnt3b = g(P3, { opacity: 0 });
      mei.centers.forEach(([x, y]) => text(cnt3b, x < 390 ? x - 116 : x + 116, y + 9, '2 條', { 'font-size': 28, 'font-weight': 700, fill: C.hi, 'text-anchor': x < 390 ? 'end' : 'start' }));
      const list3 = g(P3, { opacity: 0 });
      el('rect', { x: 790, y: 96, width: 380, height: 420, rx: 16, ...FRAME }, list3);
      text(list3, 980, 142, '減數分裂', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700 });
      const steps3 = ['① 染色體複製一次', '② 同源染色體配對', '③ 第一次分裂：|同源染色體分開', '④ 第二次分裂：|複製的染色體分開', '⑤ 4 個子細胞，|各 2 條（單套 n）'];
      let yy3 = 196;
      const items3 = steps3.map((s) => {
        const ig = g(list3, { opacity: 0.25 });
        s.split('|').forEach((line, k) => text(ig, k ? 846 : 816, yy3 + k * 30, line, { 'font-size': 23, fill: k ? C.ink2 : C.ink, 'font-weight': k ? 400 : 700 }));
        yy3 += s.includes('|') ? 72 : 48;
        return ig;
      });
      const hum3 = g(P3, { opacity: 0 });
      S.pill(hum3, 980, 562, '人：46 條 → 精子、卵 23 條', { size: 24, color: C.hi, edge: C.hi });
      text(hum3, 980, 616, '精子在睪丸、卵在卵巢中形成', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, list3, 's3+=0.4', 0.4);
      const T3 = 7, t3 = (f) => `s3+=${(0.9 + f * T3).toFixed(2)}`;
      S.drive(tl, (u) => mei.set(u), T3, 's3+=0.9', 'none');
      [0, 0.14, 0.28, 0.56, 0.9].forEach((f, i) => tl.fromTo(items3[i], { opacity: 0.25 }, { opacity: 1, duration: 0.3, immediateRender: false }, t3(f)));
      S.hide(tl, cnt3a, t3(0.27), 0.3);
      S.show(tl, cnt3b, t3(0.96), 0.4);
      S.show(tl, hum3, 's3+=8.1', 0.5);

      // ===== 4 受精使數目恢復 ＋ 比較表 =====
      const P4 = g(root, { opacity: 0 });
      B1.egg(P4, 330, 270, 110);
      const eggNuc = el('circle', { cx: 340, cy: 274, r: 34, fill: 'rgba(255,125,154,0.35)', stroke: MO, 'stroke-width': 2.5 }, P4);
      const lblEgg = text(P4, 330, 128, '卵：23 條', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: MO });
      const sp4 = B1.sperm(P4, { s: 0.9 });
      const lblSp = text(P4, 110, 168, '精子：23 條', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: FA });
      const zyg = g(P4, { opacity: 0 });
      el('circle', { cx: 330, cy: 270, r: 40, fill: 'rgba(167,150,255,0.35)', stroke: C.nucleus, 'stroke-width': 3 }, zyg);
      text(zyg, 330, 432, '受精卵：46 條（23 對）', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      const flow4 = [['減數分裂：46 → 23', C.ink], ['受精：23 ＋ 23 → 46', C.hi], ['細胞分裂：46 → 46', C.ink]].map(([s, c], i) => { const fg = g(P4, { opacity: 0 }); S.pill(fg, 275, 510 + i * 62, s, { size: 24, color: c, edge: c === C.hi ? C.hi : '#4a6272' }); return fg; });
      // 比較表
      const tbl = g(P4, { opacity: 0 });
      const TX = [545, 735, 952, 1170], TY0 = 104, RH = 70;
      const rows = [['', '細胞分裂', '減數分裂'], ['染色體複製', '1 次', '1 次'], ['細胞分裂', '1 次', '2 次'], ['子細胞數目', '2 個', '4 個'], ['子細胞染色體', '和原來相同', '原來的一半'], ['功用', '生長、修補', '產生精子、卵']];
      el('rect', { x: TX[0], y: TY0, width: TX[3] - TX[0], height: RH * rows.length, rx: 14, ...FRAME }, tbl);
      el('rect', { x: TX[0], y: TY0, width: TX[3] - TX[0], height: RH, rx: 14, fill: '#1a3242' }, tbl);
      rows.forEach((r, i) => {
        const y = TY0 + i * RH + RH / 2 + 9;
        if (i) el('line', { x1: TX[0] + 10, y1: TY0 + i * RH, x2: TX[3] - 10, y2: TY0 + i * RH, stroke: '#2b4252', 'stroke-width': 2 }, tbl);
        r.forEach((s, j) => text(tbl, (TX[j] + TX[j + 1]) / 2, y, s, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': i === 0 || j === 0 ? 700 : 400, fill: i === 0 ? (j === 1 ? C.membrane : C.hi) : j === 0 ? C.ink2 : C.ink }));
      });
      [1, 2].forEach((j) => el('line', { x1: TX[j], y1: TY0 + 10, x2: TX[j], y2: TY0 + RH * rows.length - 10, stroke: '#2b4252', 'stroke-width': 2 }, tbl));
      const hi4 = g(P4, { opacity: 0 });
      [[2, 2], [3, 2], [4, 2]].forEach(([i, j]) => el('rect', { x: TX[j] + 6, y: TY0 + i * RH + 6, width: TX[j + 1] - TX[j] - 12, height: RH - 12, rx: 10, fill: 'none', stroke: C.hi, 'stroke-width': 2.5 }, hi4));
      const keep4 = g(P4, { opacity: 0 });
      S.pill(keep4, 857, 584, '減數分裂＋受精 → 每一代的染色體數目維持一定', { size: 23, color: C.hi, edge: C.hi });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => {
        const k = S.smoothstep(0, 0.8, u);
        S.place(sp4, { x: S.lerp(110, 238, k), y: S.lerp(230, 262, k), r: 12 * (1 - k) });
        sp4.wiggle(u * 30);
        sp4.style.opacity = u < 0.9 ? 1 : 1 - (u - 0.9) * 10;
      }, 2.2, 's4+=0.6', 'none');
      tl.fromTo([lblEgg, lblSp, eggNuc], { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 's4+=2.9');
      S.show(tl, zyg, 's4+=3', 0.5);
      flow4.forEach((f, i) => S.show(tl, f, `s4+=${3.6 + i * 0.4}`, 0.35));
      S.show(tl, tbl, 's4+=4.4', 0.5);
      S.show(tl, hi4, 's4+=5.2', 0.4);
      S.show(tl, keep4, 's4+=5.8', 0.4);

      return {
        tl,
        notes: [
          '＊大小為約略值（以人體細胞為例），染色體的長短差很多。細胞沒有分裂時，遺傳物質呈細絲狀，看不到棒狀的染色體。一個人體細胞內的 DNA 全部拉直，總長約 2 公尺＊。基因在第八章會詳細學習。',
          '＊示意：染色體的長短、形狀都簡化了，顏色只是用來區分來自父方或母方。第 23 對是決定性別的性染色體（第八章會學），男生的這一對大小不同。同一種生物的染色體數目相同。',
          '＊示意：以 2 對染色體為例，畫出的是濃縮成棒狀的染色體；細胞核在分裂過程中的變化簡化了。細胞分裂前後，細胞內的遺傳物質相同。',
          '＊示意：以 2 對染色體為例。每對同源染色體分開的方向是隨機的，所以形成的精子或卵有不同的組合（補充）。卵巢中的減數分裂，最後通常只形成 1 個卵，其他較小的細胞會退化（補充）。',
          '＊示意：精子畫得比實際大很多（卵比精子大很多）。受精卵中的每一對染色體，一條來自父方（精子）、一條來自母方（卵）。',
        ],
        steps: [
          '細胞核內有<b>遺傳物質</b>，控制生物的特徵。細胞分裂時，遺傳物質濃縮成棒狀的<b>染色體</b>；染色體主要由 <b>DNA</b> 和蛋白質組成，<b>基因</b>是 DNA 上的片段。',
          '體細胞的染色體<b>兩兩成對</b>，大小、形狀相似，一條來自父方、一條來自母方，稱為<b>同源染色體</b>。人的體細胞有 46 條（23 對），是<b>雙套（2n）</b>。',
          '<b>細胞分裂</b>：染色體先<b>複製一次</b>，再平均分到兩個子細胞，子細胞的染色體數目和原來<b>相同</b>。生物靠它生長、修補；單細胞生物靠它產生新個體。',
          '<b>減數分裂</b>：在生殖器官中產生精子和卵。染色體複製一次、細胞<b>連續分裂兩次</b>，同源染色體分開，形成 4 個子細胞，染色體數目<b>減半</b>（單套，n）。',
          '<b>受精</b>：精子（23 條）和卵（23 條）結合成受精卵（46 條），染色體又恢復成對。減數分裂和受精，使每一代的染色體數目<b>維持一定</b>。',
        ],
      };
    },
  });
})();
