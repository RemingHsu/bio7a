/* 七下 1-3 動物的有性生殖：有性生殖的過程、體外與體內受精、卵生與胎生（雞蛋的構造）、求偶與護卵育幼、人類的生殖、胎兒的發育 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const sm = S.smoothstep;
  const B1 = (S.b1 = S.b1 || {}); // 染色體、精子、卵的畫法在 scene-division.js
  const arrow = (p, x1, y1, x2, y2, color = C.ink2, sw = 4, hd = 14) => {
    const a = Math.atan2(y2 - y1, x2 - x1), ag = g(p);
    el('line', { x1, y1, x2: x2 - Math.cos(a) * hd * 0.6, y2: y2 - Math.sin(a) * hd * 0.6, stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, ag);
    el('path', { d: `M ${x2},${y2} L ${x2 - hd * Math.cos(a - 0.45)},${y2 - hd * Math.sin(a - 0.45)} L ${x2 - hd * Math.cos(a + 0.45)},${y2 - hd * Math.sin(a + 0.45)} Z`, fill: color }, ag);
    return ag;
  };
  // 細胞裡放幾條染色體（橫排、成對時並排）
  const cellWith = (p, x, y, r, rods, { fill = '#11262e', edge = C.membrane } = {}) => {
    const cg = g(p);
    el('circle', { cx: x, cy: y, r, fill, stroke: edge, 'stroke-width': 3.5 }, cg);
    rods.forEach(([dx, L, col, W]) => S.place(B1.rod(cg, L, col, W), { x: x + dx, y }));
    return cg;
  };
  const tinySperm = (p) => {
    const s = g(p);
    el('path', { d: 'M -4,0 q -6,-4 -12,0 q -6,4 -12,0', fill: 'none', stroke: '#e8f6ff', 'stroke-width': 1.6 }, s);
    el('ellipse', { cx: 0, cy: 0, rx: 4.5, ry: 3, fill: '#e8f6ff' }, s);
    return s;
  };

  // ---------- 動物 ----------
  function fish(p, x, y, { s = 1, body = '#e89a50', fin = '#c97a36', flip = false } = {}) {
    const f = S.place(g(p), { x, y, s });
    const i = S.place(g(f), {});
    if (flip) i.setAttribute('transform', 'scale(-1,1)');
    el('path', { d: 'M -78,0 L -112,-28 C -104,-8 -104,8 -112,28 Z', fill: fin }, i);
    el('path', { d: 'M -22,-36 C -8,-56 18,-52 30,-34 Z', fill: fin }, i);
    el('path', { d: 'M -14,28 L -2,46 L 14,29 Z', fill: fin }, i);
    el('path', { d: 'M -80,0 C -60,-36 20,-46 60,-22 C 76,-12 84,-2 82,4 C 76,16 42,34 -8,31 C -48,28 -70,14 -80,0 Z', fill: body, stroke: '#ffd2a0', 'stroke-width': 2 }, i);
    el('path', { d: 'M 42,-20 C 48,-6 48,8 42,20', fill: 'none', stroke: fin, 'stroke-width': 2.5 }, i);
    el('circle', { cx: 60, cy: -8, r: 7, fill: '#ffffff' }, i);
    el('circle', { cx: 62, cy: -8, r: 3.5, fill: '#1a1a1a' }, i);
    return f;
  }
  function hen(p, x, y, s = 1) {
    const h = S.place(g(p), { x, y, s });
    [[-44, 66], [-28, 72]].forEach(([dx, dy]) => el('path', { d: `M ${dx + 30},${30} L ${dx + 30},${dy} M ${dx + 30},${dy} l -10,4 M ${dx + 30},${dy} l 10,4 M ${dx + 30},${dy} l 2,8`, stroke: '#f0b840', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, h));
    el('path', { d: 'M -58,-6 C -78,-30 -84,-56 -70,-70 C -64,-50 -54,-36 -42,-28 Z', fill: '#c9783a' }, h);
    el('path', { d: 'M -60,0 C -60,-34 -20,-40 20,-34 C 34,-46 36,-64 48,-70 C 66,-76 76,-60 68,-46 C 62,-34 58,-10 46,8 C 30,32 -10,42 -36,32 C -54,26 -60,14 -60,0 Z', fill: '#e8a060', stroke: '#ffd2a0', 'stroke-width': 2 }, h);
    el('path', { d: 'M -32,-6 C -10,-20 18,-14 26,4 C 10,18 -20,18 -32,-6 Z', fill: '#c9783a' }, h);
    el('path', { d: 'M 48,-74 q 4,-10 10,-4 q 4,-10 10,-2 q 6,-6 8,4 q -12,4 -28,2 Z', fill: '#e0384c' }, h);
    el('path', { d: 'M 70,-60 L 84,-55 L 70,-50 Z', fill: '#f0b840' }, h);
    el('path', { d: 'M 66,-48 q 6,10 0,16 q -6,-6 0,-16 Z', fill: '#e0384c' }, h);
    el('circle', { cx: 60, cy: -60, r: 3.5, fill: '#1a1a1a' }, h);
    return h;
  }
  function turtle(p, x, y, s = 1) {
    const t = S.place(g(p), { x, y, s });
    [[24, -38, -40], [24, 38, 40]].forEach(([fx, fy, r]) => el('ellipse', { cx: fx, cy: fy, rx: 30, ry: 11, fill: '#7fae6a', stroke: '#b8e0a0', 'stroke-width': 1.5, transform: `rotate(${r} ${fx} ${fy})` }, t));
    [[-40, -28, 30], [-40, 28, -30]].forEach(([fx, fy, r]) => el('ellipse', { cx: fx, cy: fy, rx: 16, ry: 9, fill: '#7fae6a', stroke: '#b8e0a0', 'stroke-width': 1.5, transform: `rotate(${r} ${fx} ${fy})` }, t));
    el('ellipse', { cx: 60, cy: 0, rx: 16, ry: 13, fill: '#7fae6a', stroke: '#b8e0a0', 'stroke-width': 1.5 }, t);
    el('circle', { cx: 66, cy: -6, r: 2.5, fill: '#1a1a1a' }, t); el('circle', { cx: 66, cy: 6, r: 2.5, fill: '#1a1a1a' }, t);
    el('ellipse', { cx: 0, cy: 0, rx: 54, ry: 42, fill: '#7a6a3a', stroke: '#c9b070', 'stroke-width': 2.5 }, t);
    el('path', { d: 'M -20,-14 L 0,-24 L 20,-14 L 20,14 L 0,24 L -20,14 Z M -20,-14 L -40,-20 M 20,-14 L 40,-20 M -20,14 L -40,20 M 20,14 L 40,20 M 0,-24 L 0,-40 M 0,24 L 0,40', fill: 'none', stroke: '#c9b070', 'stroke-width': 2 }, t);
    return t;
  }
  function rabbit(p, x, y, s = 1) {
    const r = S.place(g(p), { x, y, s });
    const fur = '#cdbba6', edge = '#efe2d2';
    el('ellipse', { cx: 30, cy: -66, rx: 8, ry: 26, fill: fur, stroke: edge, 'stroke-width': 1.5, transform: 'rotate(-18 30 -66)' }, r);
    el('ellipse', { cx: 42, cy: -64, rx: 8, ry: 25, fill: fur, stroke: edge, 'stroke-width': 1.5, transform: 'rotate(8 42 -64)' }, r);
    el('ellipse', { cx: -18, cy: 4, rx: 22, ry: 14, fill: fur, stroke: edge, 'stroke-width': 1.5 }, r);
    el('ellipse', { cx: -2, cy: -10, rx: 46, ry: 30, fill: fur, stroke: edge, 'stroke-width': 2 }, r);
    el('circle', { cx: -48, cy: -16, r: 9, fill: '#ffffff' }, r);
    el('ellipse', { cx: 42, cy: -30, rx: 24, ry: 20, fill: fur, stroke: edge, 'stroke-width': 2 }, r);
    el('ellipse', { cx: 30, cy: 14, rx: 7, ry: 12, fill: fur, stroke: edge, 'stroke-width': 1.5 }, r);
    el('ellipse', { cx: -20, cy: 16, rx: 22, ry: 6, fill: fur, stroke: edge, 'stroke-width': 1.5 }, r);
    el('circle', { cx: 50, cy: -34, r: 3.5, fill: '#1a1a1a' }, r);
    el('circle', { cx: 65, cy: -26, r: 3, fill: '#e88aa0' }, r);
    return r;
  }
  function butterfly(p, x, y, s = 1) {
    const b = S.place(g(p), { x, y, s });
    [1, -1].forEach((k) => {
      const w = g(b, { transform: `scale(${k},1)` });
      el('path', { d: 'M 2,-6 C 24,-60 80,-62 74,-18 C 64,-2 26,0 2,-2 Z', fill: '#f08a2a', stroke: '#2a1a10', 'stroke-width': 4 }, w);
      el('path', { d: 'M 2,4 C 26,8 62,30 44,56 C 26,70 8,34 2,10 Z', fill: '#f5a040', stroke: '#2a1a10', 'stroke-width': 4 }, w);
      [[56, -40], [64, -26], [40, 44]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 3, fill: '#ffffff' }, w));
      el('path', { d: 'M 2,-30 C 4,-44 10,-52 16,-56', fill: 'none', stroke: '#2a1a10', 'stroke-width': 2 }, w);
      el('circle', { cx: 16, cy: -56, r: 3, fill: '#2a1a10' }, w);
    });
    el('ellipse', { cx: 0, cy: 4, rx: 5, ry: 32, fill: '#2a1a10' }, b);
    return b;
  }
  function frog(p, x, y, s = 1) {
    const f = S.place(g(p), { x, y, s });
    const G = '#5fae4a', E = '#a8e39a';
    el('path', { d: 'M -46,-14 C -70,-10 -74,4 -50,4 L 10,4 C 20,4 22,-2 12,-4 L -20,-6 Z', fill: '#4f9a3c', stroke: E, 'stroke-width': 2 }, f);
    el('path', { d: 'M -58,-18 C -64,-50 -20,-74 20,-66 C 46,-62 66,-50 74,-38 C 78,-32 76,-26 68,-24 C 56,-20 40,-18 30,-14 C 10,-6 -40,-2 -58,-18 Z', fill: G, stroke: E, 'stroke-width': 2.5 }, f);
    el('path', { d: 'M -40,-30 C -30,-4 -10,0 -2,-6 C -8,-22 -26,-34 -40,-30 Z', fill: '#4f9a3c', stroke: E, 'stroke-width': 2 }, f);
    el('path', { d: 'M 30,-16 L 36,2 M 36,2 l -8,2 M 36,2 l 8,2', fill: 'none', stroke: G, 'stroke-width': 6, 'stroke-linecap': 'round' }, f);
    const sac = el('ellipse', { cx: 52, cy: -18, rx: 8, ry: 7, fill: 'rgba(246,250,232,0.92)', stroke: '#ffffff', 'stroke-width': 2 }, f);
    const sacHi = el('ellipse', { cx: 46, cy: -24, rx: 3, ry: 2, fill: '#ffffff', opacity: 0 }, f);
    el('circle', { cx: 36, cy: -62, r: 13, fill: G, stroke: E, 'stroke-width': 2 }, f);
    el('circle', { cx: 38, cy: -63, r: 8, fill: '#f0d050' }, f);
    el('ellipse', { cx: 39, cy: -63, rx: 6, ry: 3, fill: '#1a1a1a' }, f);
    el('path', { d: 'M 50,-34 Q 64,-32 74,-36', fill: 'none', stroke: '#3a7a2a', 'stroke-width': 2 }, f);
    f.sac = sac; f.sacHi = sacHi;
    // b：0 → 1，鳴囊鼓起成淡色的圓泡，位在下巴下方
    f.puff = (b) => { const r = 8 + 17 * b; sac.setAttribute('rx', r * 1.08); sac.setAttribute('ry', r); sac.setAttribute('cx', 52 + 2 * b); sac.setAttribute('cy', -18 + 13 * b); sacHi.setAttribute('cx', 46 - 3 * b); sacHi.setAttribute('cy', -22 + 4 * b); sacHi.setAttribute('rx', 3 + 4 * b); sacHi.setAttribute('ry', 2 + 2 * b); sacHi.style.opacity = 0.7 * b; };
    return f;
  }
  function penguin(p, x, y, s = 1) {
    const q = S.place(g(p), { x, y, s });
    el('ellipse', { cx: -14, cy: 78, rx: 13, ry: 5, fill: '#f0a030' }, q); el('ellipse', { cx: 14, cy: 78, rx: 13, ry: 5, fill: '#f0a030' }, q);
    el('ellipse', { cx: -40, cy: 6, rx: 10, ry: 36, fill: '#1e2a36', stroke: '#5a6a7a', 'stroke-width': 1.5, transform: 'rotate(18 -40 6)' }, q);
    el('ellipse', { cx: 40, cy: 6, rx: 10, ry: 36, fill: '#1e2a36', stroke: '#5a6a7a', 'stroke-width': 1.5, transform: 'rotate(-18 40 6)' }, q);
    el('ellipse', { cx: 0, cy: 6, rx: 42, ry: 74, fill: '#1e2a36', stroke: '#5a6a7a', 'stroke-width': 2 }, q);
    el('ellipse', { cx: 0, cy: 22, rx: 30, ry: 54, fill: '#f4f6f8' }, q);
    el('ellipse', { cx: -26, cy: -38, rx: 8, ry: 12, fill: '#f0a030', opacity: 0.9 }, q);
    el('ellipse', { cx: 26, cy: -38, rx: 8, ry: 12, fill: '#f0a030', opacity: 0.9 }, q);
    [-12, 12].forEach((dx) => { el('circle', { cx: dx, cy: -48, r: 5, fill: '#ffffff' }, q); el('circle', { cx: dx, cy: -48, r: 2.5, fill: '#1a1a1a' }, q); });
    el('path', { d: 'M -7,-38 L 7,-38 L 0,-22 Z', fill: '#f0a030' }, q);
    return q;
  }
  function chick(p, x, y, s = 1) {
    const c = S.place(g(p), { x, y, s });
    el('ellipse', { cx: -8, cy: 40, rx: 8, ry: 3.5, fill: '#f0a030' }, c); el('ellipse', { cx: 8, cy: 40, rx: 8, ry: 3.5, fill: '#f0a030' }, c);
    el('ellipse', { cx: 0, cy: 8, rx: 28, ry: 34, fill: '#8a8f96', stroke: '#c8ccd2', 'stroke-width': 2 }, c);
    el('circle', { cx: 0, cy: -26, r: 18, fill: '#2e3640', stroke: '#6a7480', 'stroke-width': 1.5 }, c);
    [-7, 7].forEach((dx) => el('circle', { cx: dx, cy: -28, r: 2.5, fill: '#ffffff' }, c));
    el('path', { d: 'M -4,-22 L 4,-22 L 0,-14 Z', fill: '#f0a030' }, c);
    return c;
  }

  // ---------- 女性體內的生殖器官（正面示意） ----------
  const UT = '#d97a88', UT_E = '#ffc2cc', LINING = '#b9485e', CAV = '#5a1f2c';
  function femaleOrgans(p, cx, cy) {
    const o = g(p);
    const tube = (s) => `M ${cx + s * 74},${cy - 92} C ${cx + s * 120},${cy - 112} ${cx + s * 168},${cy - 126} ${cx + s * 200},${cy - 106} C ${cx + s * 226},${cy - 90} ${cx + s * 232},${cy - 62} ${cx + s * 222},${cy - 40}`;
    [-1, 1].forEach((s) => {
      el('path', { d: `M ${cx + s * 70},${cy - 66} C ${cx + s * 110},${cy - 60} ${cx + s * 140},${cy - 40} ${cx + s * 160},${cy - 22}`, fill: 'none', stroke: '#c9909a', 'stroke-width': 4 }, o);
      el('path', { d: tube(s), fill: 'none', stroke: UT_E, 'stroke-width': 18, 'stroke-linecap': 'round' }, o);
      el('path', { d: tube(s), fill: 'none', stroke: UT, 'stroke-width': 14, 'stroke-linecap': 'round' }, o);
      el('path', { d: tube(s), fill: 'none', stroke: CAV, 'stroke-width': 3 }, o);
      [-40, -10, 20, 50, 80].forEach((a) => {
        const r = (a * Math.PI) / 180, bx = cx + s * 222, by = cy - 40;
        el('path', { d: `M ${bx},${by} q ${s * Math.cos(r) * 12},${Math.sin(r) * 6 + 10} ${s * Math.cos(r) * 18},${Math.sin(r) * 14 + 16}`, fill: 'none', stroke: UT, 'stroke-width': 5, 'stroke-linecap': 'round' }, o);
      });
      el('ellipse', { cx: cx + s * 186, cy: cy - 8, rx: 36, ry: 22, fill: '#f0c0b0', stroke: '#ffe0d4', 'stroke-width': 2, transform: `rotate(${s * -20} ${cx + s * 186} ${cy - 8})` }, o);
      [[-10, -4], [8, 6], [14, -8]].forEach(([dx, dy]) => el('circle', { cx: cx + s * (186 + dx), cy: cy - 8 + dy, r: 5, fill: '#fde6dc', stroke: '#e8b0a0', 'stroke-width': 1 }, o));
    });
    // 子宮（倒梨形，壁很厚）＋子宮頸
    el('path', { d: `M ${cx - 86},${cy - 70} C ${cx - 90},${cy - 120} ${cx + 90},${cy - 120} ${cx + 86},${cy - 70} C ${cx + 84},${cy - 20} ${cx + 52},${cy + 40} ${cx + 30},${cy + 70} L ${cx + 28},${cy + 120} C ${cx + 28},${cy + 130} ${cx - 28},${cy + 130} ${cx - 28},${cy + 120} L ${cx - 30},${cy + 70} C ${cx - 52},${cy + 40} ${cx - 84},${cy - 20} ${cx - 86},${cy - 70} Z`, fill: UT, stroke: UT_E, 'stroke-width': 3 }, o);
    el('path', { d: `M ${cx - 56},${cy - 76} C ${cx - 30},${cy - 70} ${cx + 30},${cy - 70} ${cx + 56},${cy - 76} C ${cx + 40},${cy - 30} ${cx + 16},${cy + 20} ${cx + 5},${cy + 48} L ${cx + 4},${cy + 124} L ${cx - 4},${cy + 124} L ${cx - 5},${cy + 48} C ${cx - 16},${cy + 20} ${cx - 40},${cy - 30} ${cx - 56},${cy - 76} Z`, fill: LINING }, o);
    el('path', { d: `M ${cx - 44},${cy - 70} C ${cx - 20},${cy - 64} ${cx + 20},${cy - 64} ${cx + 44},${cy - 70} C ${cx + 30},${cy - 30} ${cx + 12},${cy + 14} ${cx + 3},${cy + 44} L ${cx + 2},${cy + 124} L ${cx - 2},${cy + 124} L ${cx - 3},${cy + 44} C ${cx - 12},${cy + 14} ${cx - 30},${cy - 30} ${cx - 44},${cy - 70} Z`, fill: CAV }, o);
    // 子宮頸以下淡出（不畫外部）
    const gid = 'sxFade';
    const lg = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, el('defs', {}, o));
    el('stop', { offset: 0, 'stop-color': C.bg, 'stop-opacity': 0 }, lg); el('stop', { offset: 1, 'stop-color': C.bg, 'stop-opacity': 1 }, lg);
    el('rect', { x: cx - 40, y: cy + 96, width: 80, height: 40, fill: `url(#${gid})` }, o);
    o.tubePath = (s) => tube(s);
    return o;
  }

  // ---------- 胎兒（頭朝下、身體彎曲；原點約在身體中央） ----------
  const SKIN = '#f3c09a', SKIN_E = '#ffe0c8';
  function fetus(p, x, y, s = 1) {
    const f = S.place(g(p), { x, y, s });
    const SK = '#f5c7a2', OL = '#b8785a';
    // 身體＋頭：先畫外框再畫填色，合成一個輪廓
    const E = g(f), F = g(f);
    const torso = 'M -12,-132 C -62,-126 -80,-62 -72,-6 C -66,30 -42,50 -10,52 C 22,54 44,36 50,6 C 56,-26 46,-72 32,-102 C 22,-124 6,-136 -12,-132 Z';
    el('path', { d: torso, fill: OL, stroke: OL, 'stroke-width': 6, 'stroke-linejoin': 'round' }, E);
    el('circle', { cx: 2, cy: 100, r: 67, fill: OL }, E);
    el('path', { d: torso, fill: SK }, F);
    el('circle', { cx: 2, cy: 100, r: 64, fill: SK }, F);
    // 四肢：各自有外框，看得出手和彎曲的腿
    const limb = (x1, y1, x2, y2, w) => {
      el('line', { x1, y1, x2, y2, stroke: OL, 'stroke-width': w + 6, 'stroke-linecap': 'round' }, f);
      el('line', { x1, y1, x2, y2, stroke: SK, 'stroke-width': w, 'stroke-linecap': 'round' }, f);
    };
    limb(64, -34, 46, -110, 24);                       // 小腿
    el('ellipse', { cx: 60, cy: -120, rx: 19, ry: 10, fill: SK, stroke: OL, 'stroke-width': 3, transform: 'rotate(-15 60 -120)' }, f); // 腳
    limb(2, -98, 64, -34, 36);                         // 大腿（膝蓋彎向胸前）
    limb(18, 22, 52, 32, 17);                          // 上臂
    limb(52, 32, 64, 54, 14);                          // 前臂
    el('circle', { cx: 66, cy: 60, r: 10, fill: SK, stroke: OL, 'stroke-width': 3 }, f); // 手
    // 臉：頭朝下、臉朝右，下巴靠近胸前
    const ln = (d, w = 3, c = '#8a5238') => el('path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' }, f);
    ln('M 40,106 q 9,7 18,0');                        // 閉著的眼睛
    ln('M 42,124 q 9,5 18,0', 2, '#c9906a');           // 眉毛
    ln('M 64,84 q 8,3 6,11', 2.5);                     // 鼻子
    ln('M 54,72 q 6,4 12,1', 2.5);                     // 嘴
    ln('M -22,88 q -10,10 0,20', 3, '#c9906a');        // 耳朵
    el('circle', { cx: 46, cy: 90, r: 9, fill: '#f29a90', opacity: 0.35 }, f); // 臉頰
    return f;
  }

  S.register({
    id: 'sexual', section: '下1-3', title: '動物的有性生殖',
    build(root) {
      const tl = gsap.timeline({ paused: true });
      const FA = B1.FA, MO = B1.MO;

      // ===== 0 有性生殖的過程 =====
      const P0 = g(root);
      const dadC = cellWith(P0, 120, 200, 78, [[-30, 50, FA, 12], [-12, 50, FA, 12], [12, 30, FA, 12], [30, 30, FA, 12]]);
      const momC = cellWith(P0, 120, 470, 78, [[-30, 50, MO, 12], [-12, 50, MO, 12], [12, 30, MO, 12], [30, 30, MO, 12]]);
      text(P0, 120, 312, '父方的細胞', { 'font-size': 24, 'text-anchor': 'middle', fill: FA, 'font-weight': 700 });
      text(P0, 120, 582, '母方的細胞', { 'font-size': 24, 'text-anchor': 'middle', fill: MO, 'font-weight': 700 });
      const step0 = [];
      const g01 = g(P0, { opacity: 0 });
      arrow(g01, 208, 200, 284, 200); arrow(g01, 208, 470, 284, 470);
      text(g01, 246, 184, '減數分裂', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      text(g01, 246, 454, '減數分裂', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      const spm = B1.sperm(g01, { s: 1.1 });
      S.place(spm, { x: 380, y: 200 });
      [[-6, 0], [6, 0]].forEach(([dx], i) => S.place(B1.rod(g01, i ? 12 : 20, FA, 6), { x: 384 + dx, y: 200 }));
      B1.egg(g01, 360, 470, 56);
      [[-10, 40, MO], [10, 24, MO]].forEach(([dx, L, c]) => S.place(B1.rod(g01, L, c, 11), { x: 360 + dx, y: 470 }));
      text(g01, 380, 262, '精子（雄配子）', { 'font-size': 24, 'text-anchor': 'middle', fill: FA, 'font-weight': 700 });
      text(g01, 360, 564, '卵（雌配子）', { 'font-size': 24, 'text-anchor': 'middle', fill: MO, 'font-weight': 700 });
      step0.push(g01);
      const g02 = g(P0, { opacity: 0 });
      arrow(g02, 452, 230, 510, 300); arrow(g02, 430, 440, 510, 380);
      text(g02, 470, 336, '受精', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      cellWith(g02, 600, 340, 84, [[-36, 52, FA, 13], [-18, 52, MO, 13], [18, 32, FA, 13], [36, 32, MO, 13]]);
      text(g02, 600, 456, '受精卵', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(g02, 600, 490, '染色體又成對', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      step0.push(g02);
      const g03 = g(P0, { opacity: 0 });
      arrow(g03, 694, 340, 750, 340);
      text(g03, 722, 318, '細胞分裂', { 'font-size': 20, 'text-anchor': 'middle', fill: C.ink2 });
      const emb = [[0, 0], [-22, -14], [22, -14], [-22, 14], [22, 14], [0, -26], [0, 26], [-34, 0], [34, 0]];
      emb.forEach(([dx, dy]) => el('circle', { cx: 816 + dx, cy: 340 + dy, r: 18, fill: '#2a3a2e', stroke: '#9fe0c8', 'stroke-width': 2 }, g03));
      text(g03, 816, 410, '發育成新個體', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      step0.push(g03);
      const box0 = g(P0, { opacity: 0 });
      el('rect', { x: 892, y: 120, width: 284, height: 440, rx: 16, ...FRAME }, box0);
      text(box0, 1034, 166, '有性生殖的特色', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      [['要經過', '減數分裂和受精'], ['子代有父母雙方', '的遺傳物質'], ['子代和親代', '不完全相同，變異較多'], ['環境改變時，', '族群較能適應']].forEach(([a, b], i) => {
        el('circle', { cx: 914, cy: 214 + i * 86, r: 6, fill: C.hi }, box0);
        text(box0, 930, 222 + i * 86, a, { 'font-size': 22 });
        text(box0, 930, 252 + i * 86, b, { 'font-size': 22, fill: C.ink2 });
      });
      tl.addLabel('s0');
      step0.forEach((s, i) => S.show(tl, s, `s0+=${0.5 + i * 1.3}`, 0.5));
      S.show(tl, box0, 's0+=4.4', 0.5);

      // ===== 1 體外受精與體內受精 =====
      const P1 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 560, height: 560, rx: 16, ...FRAME }, P1);
      el('rect', { x: 610, y: 96, width: 560, height: 560, rx: 16, ...FRAME }, P1);
      text(P1, 310, 142, '體外受精', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P1, 890, 142, '體內受精', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      el('rect', { x: 46, y: 166, width: 528, height: 300, rx: 10, fill: 'rgba(95,184,255,0.13)' }, P1);
      text(P1, 70, 196, '水中', { 'font-size': 20, fill: C.water });
      fish(P1, 170, 300, { s: 0.95 });
      fish(P1, 420, 250, { s: 0.9, body: '#d98a46', fin: '#b0682a', flip: true });
      const eggs = [], spermF = [];
      const re = S.rng(13);
      for (let i = 0; i < 22; i++) eggs.push({ x: 250 + re() * 120, y: 390 + re() * 56, c: el('circle', { cx: 0, cy: 0, r: 7, fill: '#ffb060', stroke: '#ffe0b0', 'stroke-width': 1.5, opacity: 0 }, P1) });
      eggs.forEach((e) => { e.c.setAttribute('cx', e.x.toFixed(1)); e.c.setAttribute('cy', e.y.toFixed(1)); e.dot = el('circle', { cx: e.x, cy: e.y, r: 2.5, fill: '#a0501a', opacity: 0 }, P1); });
      const cloud = el('ellipse', { cx: 330, cy: 330, rx: 10, ry: 8, fill: '#f4f4f0', opacity: 0 }, P1);
      for (let i = 0; i < 16; i++) spermF.push({ s: tinySperm(P1), x0: 360 + re() * 40, y0: 300 + re() * 30, e: eggs[i % eggs.length] });
      spermF.forEach((o) => { o.s.style.opacity = 0; });
      const lblF = [S.callout(P1, 300, 410, 140, 420, '卵', '#ffb060', { size: 22 }), S.callout(P1, 350, 326, 470, 330, '精子', '#f4f4f0', { size: 22 })];
      text(P1, 310, 508, '卵和精子在水中結合', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P1, 310, 546, '產出的卵和精子數量很多，', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P1, 310, 576, '受精的機會較低', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P1, 310, 626, '例如：多數魚類、兩生類', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      const animals = [[hen, 720, 232, 0.85, '鳥類', 342], [turtle, 1040, 236, 0.95, '爬蟲類', 330], [rabbit, 720, 448, 0.95, '哺乳類', 512], [butterfly, 1040, 426, 0.9, '昆蟲', 512]].map(([fn, x, y, s, n, ly]) => {
        const ag = g(P1, { opacity: 0 });
        fn(ag, x, y, s);
        text(ag, x, ly, n, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
        return ag;
      });
      text(P1, 890, 546, '精子進入雌性體內和卵結合，', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P1, 890, 576, '受精機會較高，產卵數通常較少', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      S.drive(tl, (u) => {
        eggs.forEach((e, i) => { e.c.style.opacity = sm(i * 0.012, i * 0.012 + 0.08, u); });
        cloud.setAttribute('rx', 10 + 60 * sm(0.3, 0.6, u)); cloud.setAttribute('ry', 8 + 34 * sm(0.3, 0.6, u));
        cloud.style.opacity = 0.35 * sm(0.3, 0.45, u) * (1 - sm(0.85, 1, u) * 0.6);
        spermF.forEach((o, i) => {
          const k = sm(0.45 + i * 0.01, 0.8 + i * 0.01, u);
          S.place(o.s, { x: S.lerp(o.x0, o.e.x - 8, k), y: S.lerp(o.y0, o.e.y - 2, k), r: (Math.atan2(o.e.y - o.y0, o.e.x - o.x0) * 180) / Math.PI });
          o.s.style.opacity = k > 0 && k < 1 ? 1 : 0;
          o.e.dot.style.opacity = k >= 1 ? 1 : 0;
        });
      }, 4.2, 's1+=0.6', 'none');
      lblF.forEach((l, i) => S.show(tl, l, `s1+=${1.4 + i * 1.2}`, 0.3));
      animals.forEach((a, i) => S.show(tl, a, `s1+=${2.6 + i * 0.4}`, 0.4));

      // ===== 2 卵生與胎生：雞蛋的構造 =====
      const P2 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 700, height: 560, rx: 16, ...FRAME }, P2);
      text(P2, 380, 142, '雞蛋的構造（縱切面）', { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700 });
      const EX = 390, EY = 400;
      const eggD = (k) => `M ${EX - 190 * k},${EY} C ${EX - 190 * k},${EY - 128 * k} ${EX - 70 * k},${EY - 146 * k} ${EX + 20 * k},${EY - 140 * k} C ${EX + 130 * k},${EY - 130 * k} ${EX + 172 * k},${EY - 60 * k} ${EX + 172 * k},${EY} C ${EX + 172 * k},${EY + 60 * k} ${EX + 130 * k},${EY + 130 * k} ${EX + 20 * k},${EY + 140 * k} C ${EX - 70 * k},${EY + 146 * k} ${EX - 190 * k},${EY + 128 * k} ${EX - 190 * k},${EY} Z`;
      el('path', { d: eggD(1), fill: '#f2e6cf', stroke: '#fff6e6', 'stroke-width': 3 }, P2);
      el('path', { d: eggD(0.95), fill: 'rgba(220,235,240,0.55)', stroke: '#c9d6dc', 'stroke-width': 2 }, P2);
      // 氣室（鈍端，兩層殼膜之間）
      el('path', { d: `M ${EX - 178},${EY - 40} C ${EX - 168},${EY - 70} ${EX - 150},${EY - 96} ${EX - 132},${EY - 106} C ${EX - 116},${EY - 50} ${EX - 116},${EY + 50} ${EX - 132},${EY + 106} C ${EX - 150},${EY + 96} ${EX - 168},${EY + 70} ${EX - 178},${EY + 40} Z`, fill: '#2a3f4f', stroke: '#c9d6dc', 'stroke-width': 2 }, P2);
      // 繫帶
      [[-1, EX - 52, EX - 118], [1, EX + 52, EX + 140]].forEach(([s, x1, x2]) => el('path', { d: `M ${x1},${EY} q ${s * 10},-8 ${s * 20},0 q ${s * 10},8 ${s * 20},0 q ${s * 10},-8 ${s * 20},0 L ${x2},${EY}`, fill: 'none', stroke: '#fffbe8', 'stroke-width': 4, opacity: 0.9 }, P2));
      el('circle', { cx: EX, cy: EY, r: 58, fill: '#f6b93a', stroke: '#ffd877', 'stroke-width': 2.5 }, P2);
      el('ellipse', { cx: EX, cy: EY - 52, rx: 13, ry: 6, fill: '#ffffff' }, P2);
      const eggL = [
        [EX - 156, EY - 142, 172, 196, '蛋殼：保護（有氣孔）', '#fff6e6'],
        [EX + 160, EY - 70, 610, 196, '殼膜', '#c9d6dc'],
        [EX - 150, EY + 40, 130, 600, '氣室', '#9fc0d6'],
        [EX + 100, EY + 70, 600, 600, '蛋白：提供養分、水分', '#dfe8ec'],
        [EX + 40, EY + 30, 640, 520, '卵黃：提供養分', '#ffd877'],
        [EX + 100, EY, 650, 440, '繫帶：固定卵黃', '#fffbe8'],
        [EX + 8, EY - 54, 630, 270, '小白點（胚盤）', '#ffffff'],
      ].map(([tx, ty, x, y, s, c]) => S.callout(P2, tx, ty, x, y, s, c, { size: 22 }));
      el('rect', { x: 746, y: 96, width: 424, height: 560, rx: 16, ...FRAME }, P2);
      const ov = g(P2, { opacity: 0 }), vi = g(P2, { opacity: 0 }), embT = g(P2, { opacity: 0 });
      text(ov, 958, 148, '卵生', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(ov, 958, 190, '胚胎在母體外發育，', { 'font-size': 23, 'text-anchor': 'middle' });
      text(ov, 958, 222, '養分來自卵', { 'font-size': 23, 'text-anchor': 'middle' });
      text(ov, 958, 256, '鳥類、兩生類、多數魚類和爬蟲類', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(embT, 958, 294, '雞蛋的小白點（胚盤）受精後發育成小雞', { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
      text(vi, 958, 340, '胎生', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(vi, 958, 382, '胚胎在母體子宮內發育，', { 'font-size': 23, 'text-anchor': 'middle' });
      text(vi, 958, 414, '經胎盤從母體獲得養分', { 'font-size': 23, 'text-anchor': 'middle' });
      text(vi, 958, 452, '多數哺乳類（例如人、狗、牛）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const trap2 = g(P2, { opacity: 0 });
      el('rect', { x: 770, y: 500, width: 376, height: 132, rx: 12, fill: 'rgba(255,143,143,0.08)', stroke: '#ff8f8f', 'stroke-width': 2 }, trap2);
      text(trap2, 958, 540, '易錯：卵生不一定是體外受精', { 'font-size': 22, 'text-anchor': 'middle', fill: '#ff8f8f', 'font-weight': 700 });
      text(trap2, 958, 576, '鳥類是體內受精，', { 'font-size': 22, 'text-anchor': 'middle' });
      text(trap2, 958, 608, '受精卵再產出體外發育（卵生）', { 'font-size': 22, 'text-anchor': 'middle' });
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.4);
      eggL.forEach((l, i) => S.show(tl, l, `s2+=${0.7 + i * 0.45}`, 0.3));
      S.show(tl, ov, 's2+=4', 0.4);
      S.show(tl, embT, 's2+=4.3', 0.3);
      S.show(tl, vi, 's2+=4.6', 0.4);
      S.show(tl, trap2, 's2+=5.3', 0.4);

      // ===== 3 求偶、護卵與育幼 =====
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 96, width: 560, height: 560, rx: 16, ...FRAME }, P3);
      el('rect', { x: 610, y: 96, width: 560, height: 560, rx: 16, ...FRAME }, P3);
      text(P3, 310, 142, '求偶', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      text(P3, 890, 142, '護卵、育幼', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: C.hi });
      el('path', { d: 'M 60,420 C 140,404 240,412 300,420 L 300,440 L 60,440 Z', fill: '#4a5a46' }, P3);
      const fr3 = frog(P3, 190, 414, 1.5);
      const waves = [0, 1, 2].map((i) => el('path', { d: `M ${330 + i * 34},${300} q 20,40 0,80`, fill: 'none', stroke: C.hi, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, P3));
      S.callout(P3, 190 + 56 * 1.5, 414 - 6 * 1.5, 330, 220, '鳴囊', '#f0fadc', { size: 22 }).style.opacity = 1;
      text(P3, 310, 500, '雄蛙鼓起鳴囊鳴叫，', { 'font-size': 24, 'text-anchor': 'middle' });
      text(P3, 310, 534, '吸引同種的雌蛙', { 'font-size': 24, 'text-anchor': 'middle' });
      text(P3, 310, 590, '其他求偶方式：舞蹈、氣味、', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P3, 310, 620, '鮮豔的體色或羽色', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      el('ellipse', { cx: 840, cy: 438, rx: 170, ry: 16, fill: '#c9d6dc', opacity: 0.35 }, P3);
      penguin(P3, 800, 352, 1.1);
      const ch3 = S.place(g(P3), { x: 900, y: 392 });
      chick(ch3, 0, 0, 1);
      text(P3, 890, 500, '企鵝輪流孵卵，', { 'font-size': 24, 'text-anchor': 'middle' });
      text(P3, 890, 534, '幼鳥孵出後還會餵食照顧', { 'font-size': 24, 'text-anchor': 'middle' });
      const care3 = g(P3, { opacity: 0 });
      text(care3, 890, 590, '蝦、蟹把卵帶在身上保護；', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(care3, 890, 620, '哺乳類用乳汁哺育幼兒', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      const sum3 = g(P3, { opacity: 0 });
      S.pill(sum3, 600, 52, '照顧越完善，子代數目通常越少，但存活率較高', { size: 24, color: C.hi, edge: C.hi });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.drive(tl, (u) => {
        const b = 0.5 - 0.5 * Math.cos(u * Math.PI * 5); // 最後停在鼓起的樣子
        fr3.puff(b);
        waves.forEach((w, i) => { const k = (u * 6 - i * 0.25) % 1; w.style.opacity = u <= 0.02 ? 0 : u < 0.98 ? Math.max(0, 1 - k) * b : 0.9 - i * 0.25; });
        S.place(ch3, { x: 900, y: 392 - 6 * Math.abs(Math.sin(u * Math.PI * 4)) });
      }, 4, 's3+=0.6', 'none');
      S.show(tl, care3, 's3+=3', 0.4);
      S.show(tl, sum3, 's3+=3.8', 0.4);

      // ===== 4 人類的生殖 =====
      const P4 = g(root, { opacity: 0 });
      const HX = 500, HY = 372, HS = 1.4, UX = 0, UY = 0;
      const H = S.place(g(P4), { x: HX, y: HY, s: HS });
      const GP = (lx, ly) => [HX + lx * HS, HY + ly * HS];
      const fo = femaleOrgans(H, UX, UY);
      const tubeL = el('path', { d: fo.tubePath(-1), fill: 'none' }, H);
      const tLen = tubeL.getTotalLength();
      const ovum = g(H, { opacity: 0 });
      el('circle', { cx: 0, cy: 0, r: 13, fill: 'rgba(255,214,160,0.25)', stroke: '#ffd6a0', 'stroke-width': 2 }, ovum);
      el('circle', { cx: 0, cy: 0, r: 8, fill: '#ffe8c0' }, ovum);
      const sperms = Array.from({ length: 9 }, () => tinySperm(H));
      sperms.forEach((s) => { s.style.opacity = 0; });
      const zyg = g(H, { opacity: 0 });
      const zc = [0, 1, 2, 3].map(() => el('circle', { cx: 0, cy: 0, r: 7, fill: '#ffe8c0', stroke: '#ffd6a0', 'stroke-width': 1.5 }, zyg));
      el('circle', { cx: 0, cy: 0, r: 15, fill: 'none', stroke: '#ffd6a0', 'stroke-width': 1.5, opacity: 0.7 }, zyg);
      const flash = el('circle', { cx: 0, cy: 0, r: 0, fill: 'none', stroke: C.hi, 'stroke-width': 3, opacity: 0 }, H);
      const lab4 = [
        S.callout(P4, ...GP(-186, -8), 150, 520, '卵巢：產生卵', '#f6c6b6', { size: 24 }),
        S.callout(P4, ...GP(-150, -120), 172, 126, '輸卵管：受精的地方', '#ffc2cc', { size: 24 }),
        S.callout(P4, ...GP(40, 10), 800, 560, '子宮：胎兒發育的地方', '#ff9aa8', { size: 24 }),
      ];
      const tagF = g(P4, { opacity: 0 }), tagI = g(P4, { opacity: 0 });
      const tubePt = (f) => tubeL.getPointAtLength(tLen * f);
      const fp = tubePt(0.42);
      const fpG = GP(fp.x, fp.y);
      S.pill(tagF, fpG[0] + 76, fpG[1] - 62, '受精', { size: 24, color: C.hi, edge: C.hi });
      el('line', { x1: fpG[0] + 8, y1: fpG[1] - 12, x2: fpG[0] + 50, y2: fpG[1] - 48, stroke: C.hi, 'stroke-width': 2 }, tagF);
      const imp = [UX - 22, UY - 60], impG = GP(...imp);
      S.pill(tagI, impG[0] + 190, impG[1] - 110, '著床', { size: 24, color: C.hi, edge: C.hi });
      el('line', { x1: impG[0] + 20, y1: impG[1] - 8, x2: impG[0] + 160, y2: impG[1] - 96, stroke: C.hi, 'stroke-width': 2 }, tagI);
      const card = g(P4, { opacity: 0 });
      el('rect', { x: 880, y: 96, width: 290, height: 250, rx: 16, ...FRAME }, card);
      text(card, 1025, 140, '產生配子的器官', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(card, 904, 196, '男性：睪丸', { 'font-size': 24, fill: FA, 'font-weight': 700 });
      text(card, 904, 230, '→ 產生精子', { 'font-size': 22, fill: C.ink2 });
      text(card, 904, 286, '女性：卵巢', { 'font-size': 24, fill: MO, 'font-weight': 700 });
      text(card, 904, 320, '→ 產生卵', { 'font-size': 22, fill: C.ink2 });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      lab4.forEach((l, i) => S.show(tl, l, `s4+=${0.6 + i * 0.4}`, 0.3));
      S.show(tl, card, 's4+=1.6', 0.4);
      const ovA = [UX - 186, UY - 8];
      const spPath = (i, k) => {
        // 從子宮頸往上，經過子宮腔，進入左側輸卵管
        const jx = (i % 3 - 1) * 10;
        if (k < 0.45) { const t = k / 0.45; return [UX + jx * (1 - t) + S.lerp(0, -40, t), S.lerp(UY + 120, UY - 66, t)]; }
        const t = (k - 0.45) / 0.55, q = tubePt(S.lerp(0, 0.42, t));
        return [q.x, q.y + (i % 2 ? 3 : -3) * (1 - t)];
      };
      S.drive(tl, (u) => {
        // 排卵：卵離開卵巢，進入輸卵管
        const ko = sm(0, 0.25, u), kt = sm(0.25, 0.55, u);
        let ox, oy;
        if (kt <= 0) { const end = tubePt(1); ox = S.lerp(ovA[0] + 10, end.x, ko); oy = S.lerp(ovA[1] - 10, end.y, ko); }
        else { const q = tubePt(S.lerp(1, 0.42, kt)); ox = q.x; oy = q.y; }
        S.place(ovum, { x: ox, y: oy });
        ovum.style.opacity = u > 0.01 && u < 0.62 ? 1 : 0;
        sperms.forEach((s, i) => {
          const k = sm(0.15 + i * 0.015, 0.6 - (i === 0 ? 0.02 : -0.04 * (i % 3)), u);
          const [x, y] = spPath(i, Math.min(k, i === 0 ? 1 : 0.92 - (i % 4) * 0.08));
          const [x2, y2] = spPath(i, Math.min(1, k + 0.02));
          S.place(s, { x, y, r: (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI });
          s.style.opacity = k > 0 && u < 0.62 ? 1 : 0;
        });
        // 受精卵：一面分裂一面移向子宮，最後著床
        const kz = sm(0.62, 1, u);
        let zx, zy;
        if (kz < 0.75) { const q = tubePt(S.lerp(0.42, 0, kz / 0.75)); zx = q.x; zy = q.y; }
        else { const t = (kz - 0.75) / 0.25; zx = S.lerp(UX - 74, imp[0], t); zy = S.lerp(UY - 92, imp[1], t); }
        zyg.style.opacity = u >= 0.62 ? 1 : 0;
        S.place(zyg, { x: zx, y: zy });
        const n = kz < 0.25 ? 1 : kz < 0.5 ? 2 : 4;
        zc.forEach((c, i) => {
          const off = n === 1 ? [[0, 0]] : n === 2 ? [[-5, 0], [5, 0]] : [[-5, -5], [5, -5], [-5, 5], [5, 5]];
          c.style.opacity = i < n ? 1 : 0;
          if (i < n) { c.setAttribute('cx', off[i][0]); c.setAttribute('cy', off[i][1]); c.setAttribute('r', n === 1 ? 9 : n === 2 ? 6 : 5); }
        });
        const kf = sm(0.6, 0.66, u);
        flash.setAttribute('cx', fp.x); flash.setAttribute('cy', fp.y); flash.setAttribute('r', 10 + 30 * kf); flash.style.opacity = kf > 0 && kf < 1 ? 1 - kf : 0;
      }, 6, 's4+=1.2', 'none');
      S.show(tl, tagF, 's4+=4.9', 0.3);
      S.show(tl, tagI, 's4+=7.1', 0.3);

      // ===== 5 胎兒的發育 =====
      const P5 = g(root, { opacity: 0 });
      const WX = 360, WY = 360;
      el('path', { d: `M ${WX - 30},${WY + 262} L ${WX - 28},${WY + 300} L ${WX + 28},${WY + 300} L ${WX + 30},${WY + 262} Z`, fill: UT, stroke: UT_E, 'stroke-width': 3 }, P5);
      el('ellipse', { cx: WX, cy: WY, rx: 250, ry: 272, fill: UT, stroke: UT_E, 'stroke-width': 3 }, P5);
      el('ellipse', { cx: WX, cy: WY, rx: 222, ry: 244, fill: LINING }, P5);
      const fadeId = 'sxFade5';
      const lg5 = el('linearGradient', { id: fadeId, x1: 0, y1: 0, x2: 0, y2: 1 }, el('defs', {}, P5));
      el('stop', { offset: 0, 'stop-color': C.bg, 'stop-opacity': 0 }, lg5); el('stop', { offset: 1, 'stop-color': C.bg, 'stop-opacity': 1 }, lg5);
      el('rect', { x: WX - 40, y: WY + 276, width: 80, height: 30, fill: `url(#${fadeId})` }, P5);
      el('ellipse', { cx: WX, cy: WY + 4, rx: 206, ry: 226, fill: '#3f6f8a', stroke: '#cfe8ff', 'stroke-width': 2, opacity: 0.9 }, P5);
      // 胎盤（附在子宮壁的右上方）
      const pl = [];
      for (let a = -78; a <= -12; a += 3) { const r = (a * Math.PI) / 180; pl.push([WX + 222 * Math.cos(r), WY + 244 * Math.sin(r)]); }
      for (let a = -12; a >= -78; a -= 3) { const r = (a * Math.PI) / 180; pl.push([WX + 186 * Math.cos(r), WY + 206 * Math.sin(r) - 4]); }
      el('path', { d: 'M ' + pl.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ') + ' Z', fill: '#8e2a40', stroke: '#d9707f', 'stroke-width': 2, 'stroke-linejoin': 'round' }, P5);
      const PLC = [WX + 196 * Math.cos(-0.8), WY + 216 * Math.sin(-0.8)];
      const fet = fetus(P5, WX - 30, WY - 16, 1.15);
      const belly = [WX - 30 + 50 * 1.15, WY - 16 - 4 * 1.15];
      let cd = `M ${PLC[0].toFixed(1)},${PLC[1].toFixed(1)}`;
      for (let i = 1; i <= 24; i++) { const t = i / 24, x = S.lerp(PLC[0], belly[0], t) + Math.sin(t * 12) * 9 * (1 - Math.abs(t - 0.5)), y = S.lerp(PLC[1], belly[1], t) + Math.cos(t * 12) * 6; cd += ` L ${x.toFixed(1)},${y.toFixed(1)}`; }
      el('path', { d: cd, fill: 'none', stroke: '#e8a0b0', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, P5);
      el('path', { d: cd, fill: 'none', stroke: '#8f9cff', 'stroke-width': 3 }, P5);
      el('circle', { cx: belly[0], cy: belly[1], r: 7, fill: '#e8a0b0', stroke: '#b8785a', 'stroke-width': 2 }, P5);
      const lab5 = [
        S.callout(P5, WX + 170, WY - 150, 690, 120, '胎盤', '#ff9aa8', { size: 24 }),
        S.callout(P5, WX + 92, WY - 70, 690, 200, '臍帶', '#e8a0b0', { size: 24 }),
        S.callout(P5, WX - 150, WY + 150, 186, 668, '羊水（羊膜內）：減少震動', '#9fd0ff', { size: 22 }),
        S.callout(P5, WX - 228, WY - 60, 92, 100, '子宮', '#ff9aa8', { size: 24 }),
      ];
      // 右側：物質交換、懷孕時間
      const ex5 = g(P5, { opacity: 0 });
      el('rect', { x: 790, y: 96, width: 380, height: 360, rx: 16, ...FRAME }, ex5);
      text(ex5, 980, 138, '經胎盤交換物質', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      S.pill(ex5, 980, 186, '母體的血液', { size: 22, color: '#ff9aa8', edge: '#ff9aa8' });
      S.pill(ex5, 980, 404, '胎兒的血液', { size: 22, color: SKIN, edge: SKIN });
      arrow(ex5, 846, 214, 846, 374, C.sugar, 5); arrow(ex5, 1114, 374, 1114, 214, C.co2, 5);
      text(ex5, 862, 280, '養分', { 'font-size': 22, fill: C.sugar });
      text(ex5, 862, 310, '氧', { 'font-size': 22, fill: C.sugar });
      text(ex5, 1100, 280, '二氧化碳', { 'font-size': 22, fill: C.co2, 'text-anchor': 'end' });
      text(ex5, 1100, 310, '等廢物', { 'font-size': 22, fill: C.co2, 'text-anchor': 'end' });
      text(ex5, 980, 352, '血液不直接相通', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const dots5 = [0, 1, 2, 3].map((i) => el('circle', { r: 7, fill: i % 2 ? C.co2 : C.sugar, opacity: 0 }, ex5));
      const time5 = g(P5, { opacity: 0 });
      el('rect', { x: 790, y: 480, width: 380, height: 176, rx: 16, ...FRAME }, time5);
      el('line', { x1: 822, y1: 566, x2: 1138, y2: 566, stroke: C.ink2, 'stroke-width': 4 }, time5);
      [[822, '受精'], [862, '著床'], [1138, '分娩']].forEach(([x, s], i) => { el('circle', { cx: x, cy: 566, r: 7, fill: C.hi }, time5); text(time5, x, i === 1 ? 606 : 540, s, { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink }); });
      S.pill(time5, 1000, 620, '約 38 週＊', { size: 24, color: C.hi, edge: C.hi });
      text(time5, 980, 516, '從受精到出生', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      lab5.forEach((l, i) => S.show(tl, l, `s5+=${0.7 + i * 0.4}`, 0.3));
      S.show(tl, ex5, 's5+=2.4', 0.4);
      S.drive(tl, (u) => dots5.forEach((d, i) => {
        const k = (u * 3 + i * 0.25) % 1, x = i % 2 ? 1114 : 846, y = i % 2 ? S.lerp(366, 222, k) : S.lerp(222, 366, k);
        d.setAttribute('cx', x); d.setAttribute('cy', y); d.style.opacity = u > 0.02 && u < 0.98 ? 1 : 0;
      }), 3.4, 's5+=2.8', 'none');
      S.show(tl, time5, 's5+=4', 0.4);

      return {
        tl,
        notes: [
          '＊示意：以 2 對染色體為例，藍色代表來自父方、粉紅色代表來自母方；精子畫得比實際大很多。有性生殖要經過減數分裂和受精，無性生殖通常不經過。',
          '＊示意：卵和精子都畫得很大。青蛙也是體外受精：雄蛙抱住雌蛙，雌蛙在水中排卵，雄蛙同時排出精子（假交配）。體內受精的動物，受精的環境比較不受干擾。',
          '＊卵黃和卵黃上的小白點，合起來是卵細胞（補充）。補充：少數動物（例如孔雀魚、某些鯊魚）的卵在母體內孵化後才產出，有些書稱為卵胎生。',
          '＊企鵝由雄企鵝或雌、雄輪流孵卵，幼鳥孵出後雙親共同餵食。動物照顧子代越完善，產生的子代數目通常越少，存活率卻越高。',
          '＊示意：只畫出女性體內的生殖器官（正面看），卵、精子、受精卵都畫得很大。受精卵一面進行細胞分裂、一面移到子宮，大約一週＊後著床。',
          '＊懷孕約 38 週＊是從受精算起；若從最後一次月經的第一天算起，約 40 週。胎兒和母體的血液不直接相通，在胎盤交換物質。分娩時子宮收縮，胎兒產出後，胎盤和臍帶也會排出。',
        ],
        steps: [
          '<b>有性生殖</b>：雙親經減數分裂產生<b>精子</b>和<b>卵</b>，兩者結合（<b>受精</b>）成為受精卵，再經細胞分裂發育成新個體。子代有父母雙方的遺傳物質。',
          '<b>體外受精</b>：卵和精子在水中結合，例如多數魚類、兩生類。<b>體內受精</b>：精子進入雌性體內和卵結合，例如鳥類、爬蟲類、哺乳類、昆蟲。',
          '<b>卵生</b>：胚胎在母體外發育，養分來自卵（例如雞蛋的<b>卵黃</b>和<b>蛋白</b>）；<b>胎生</b>：胚胎在母體子宮內發育，例如多數哺乳類。',
          '許多動物有<b>求偶</b>行為，例如鳴叫、舞蹈、氣味、鮮豔的顏色；有些還會<b>護卵、育幼</b>，提高子代存活的機會。',
          '人類：<b>睪丸</b>產生精子，<b>卵巢</b>產生卵。精子和卵在<b>輸卵管</b>受精；受精卵一面分裂、一面移到<b>子宮</b>，埋入子宮內膜，稱為<b>著床</b>。',
          '胎兒在子宮內發育，經由<b>胎盤</b>和<b>臍帶</b>從母體得到養分和氧，並把廢物送給母體排出。約 38 週＊後，胎兒產出，稱為<b>分娩</b>。',
        ],
      };
    },
  });
})();
