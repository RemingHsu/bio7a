/* 4-2 內分泌系統：內分泌腺與外分泌腺、主要內分泌腺的位置、激素與作用、分泌異常、神經與內分泌的比較、共同協調 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const HOR = '#c58cff', GL = '#7fe0c8', BLOOD = C.blood, NV = C.hi;
  // 腺體顏色
  const GC = { pit: '#ffb3c7', thy: '#7fe0c8', para: '#3fb08f', isl: '#ffd166', adr: '#ff9a5c', gon: '#9fb8ff' };

  const arrow = (p, x1, y1, x2, y2, color = C.ink2, sw = 3, head = 12) => {
    const a = g(p);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    el('line', { x1, y1, x2: x2 - Math.cos(ang) * head * 0.8, y2: y2 - Math.sin(ang) * head * 0.8, stroke: color, 'stroke-width': sw }, a);
    el('path', { d: `M ${x2},${y2} L ${x2 - head * Math.cos(ang - 0.45)},${y2 - head * Math.sin(ang - 0.45)} L ${x2 - head * Math.cos(ang + 0.45)},${y2 - head * Math.sin(ang + 0.45)} Z`, fill: color }, a);
    return a;
  };
  const hexD = (r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283 + 0.52; d += (i ? 'L' : 'M') + `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } return d + 'Z'; };
  const along = (path) => { const L = path.getTotalLength(); return (u) => { const q = path.getPointAtLength(S.clamp(u) * L); return [q.x, q.y]; }; };

  // 人體上的內分泌腺（人體座標，大小誇大＊）
  function glands(p) {
    const o = {};
    el('ellipse', { cx: 600, cy: 88, rx: 24, ry: 19, fill: 'rgba(232,160,180,0.28)' }, p); // 腦
    o.pit = el('ellipse', { cx: 601, cy: 107, rx: 4.5, ry: 3.5, fill: GC.pit, stroke: '#fff', 'stroke-width': 0.8 }, p);
    o.thy = g(p);
    el('path', { d: 'M 600,150 C 596,141 586,142 586,152 C 586,162 596,164 600,156 C 604,164 614,162 614,152 C 614,142 604,141 600,150 Z', fill: GC.thy, stroke: '#fff', 'stroke-width': 0.8 }, o.thy);
    o.para = g(p);
    [[589, 147], [611, 147], [589, 158], [611, 158]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 2, fill: GC.para, stroke: '#fff', 'stroke-width': 0.5 }, o.para));
    // 腎臟（淡）與腎上腺
    [[578, 345], [622, 342]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 8, ry: 13, fill: 'rgba(200,120,110,0.45)' }, p));
    o.adr = g(p);
    [[578, 329], [622, 326]].forEach(([x, y]) => el('path', { d: `M ${x - 7},${y + 4} Q ${x},${y - 9} ${x + 7},${y + 4} Z`, fill: GC.adr, stroke: '#fff', 'stroke-width': 0.6 }, o.adr));
    // 胰臟與胰島
    o.pan = el('path', { d: 'M 588,302 C 600,294 622,296 642,291 C 650,289 654,296 646,301 C 628,306 610,309 592,311 C 584,312 582,305 588,302 Z', fill: 'rgba(233,194,122,0.55)', stroke: '#f6dca6', 'stroke-width': 0.8 }, p);
    o.isl = g(p);
    [[598, 304], [612, 302], [626, 299], [638, 296]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 1.8, fill: GC.isl }, o.isl));
    // 性腺（示意位置）
    o.gon = g(p);
    [[588, 392], [612, 392]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 5, ry: 3.6, fill: GC.gon, stroke: '#fff', 'stroke-width': 0.6 }, o.gon));
    return o;
  }

  S.register({
    id: 'endocrine', section: '5-2', title: '內分泌系統',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 外分泌腺 vs 內分泌腺 =====
      const P0 = g(root);
      el('rect', { x: 40, y: 40, width: 520, height: 600, rx: 18, ...FRAME }, P0);
      el('rect', { x: 600, y: 40, width: 560, height: 600, rx: 18, ...FRAME }, P0);
      text(P0, 300, 92, '外分泌腺：有導管', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: GL });
      text(P0, 880, 92, '內分泌腺：沒有導管', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: HOR });
      // 皮膚與汗腺
      el('rect', { x: 70, y: 200, width: 460, height: 40, fill: C.skin }, P0);
      el('rect', { x: 70, y: 240, width: 460, height: 300, fill: 'rgba(201,138,106,0.35)' }, P0);
      text(P0, 90, 190, '皮膚表面', { 'font-size': 20, fill: C.mute });
      const duct = el('path', { d: 'M 300,200 L 300,240 C 296,300 304,360 300,420', stroke: '#e8f6ff', 'stroke-width': 10, fill: 'none' }, P0);
      el('path', { d: 'M 300,420 C 250,420 250,480 300,480 C 350,480 350,430 310,436 C 280,440 280,470 305,466', stroke: '#e8f6ff', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, P0);
      text(P0, 380, 470, '汗腺', { 'font-size': 26, 'font-weight': 700, fill: GL });
      const ductLbl = S.callout(P0, 300, 320, 420, 330, '導管', GL, { size: 22 });
      const sweat = [0, 1, 2].map(() => el('ellipse', { cx: 300, cy: 400, rx: 6, ry: 8, fill: C.water, opacity: 0 }, P0));
      const drop = el('path', { d: 'M 300,150 C 288,170 288,186 300,190 C 312,186 312,170 300,150 Z', fill: C.water, opacity: 0 }, P0);
      text(P0, 300, 584, '分泌物經導管送出', { 'font-size': 24, 'text-anchor': 'middle' });
      text(P0, 300, 618, '例：汗腺、唾腺', { 'font-size': 22, 'text-anchor': 'middle', fill: C.mute });
      // 內分泌腺 → 血管 → 特定器官
      el('ellipse', { cx: 720, cy: 250, rx: 70, ry: 50, fill: 'rgba(197,140,255,0.25)', stroke: HOR, 'stroke-width': 3 }, P0);
      text(P0, 720, 258, '內分泌腺', { 'font-size': 22, 'text-anchor': 'middle', fill: HOR, 'font-weight': 700 });
      const vessel = el('path', { d: 'M 650,372 C 760,352 880,372 980,374 C 1060,376 1110,374 1136,374', stroke: BLOOD, 'stroke-width': 26, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, P0);
      text(P0, 860, 342, '血液', { 'font-size': 22, fill: BLOOD, 'font-weight': 700 });
      const other = g(P0);
      el('rect', { x: 770, y: 430, width: 130, height: 76, rx: 16, fill: '#2b3f4d', stroke: '#4a6272', 'stroke-width': 2 }, other);
      text(other, 835, 476, '其他器官', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const target = el('rect', { x: 990, y: 430, width: 140, height: 76, rx: 16, fill: '#2b3f4d', stroke: HOR, 'stroke-width': 3 }, P0);
      text(P0, 1060, 476, '特定器官', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink, 'font-weight': 700 });
      const ok0 = g(P0, { opacity: 0 });
      S.pill(ok0, 1060, 546, '產生作用', { size: 22, color: HOR, edge: HOR });
      const vAt = along(vessel);
      const hs = Array.from({ length: 8 }, () => el('circle', { cx: 0, cy: 0, r: 7, fill: HOR, stroke: '#fff', 'stroke-width': 1.5, opacity: 0 }, P0));
      text(P0, 880, 618, '激素直接進入血液，只對特定器官作用', { 'font-size': 22, 'text-anchor': 'middle' });
      tl.addLabel('s0');
      S.show(tl, ductLbl, 's0+=0.4', 0.4);
      S.drive(tl, (u) => {
        sweat.forEach((d, i) => { const k = S.clamp(u * 1.6 - i * 0.3); d.setAttribute('cy', S.lerp(420, 210, k)); d.style.opacity = k > 0 && k < 1 ? 1 : 0; });
        drop.style.opacity = S.smoothstep(0.75, 0.95, u);
      }, 2.4, 's0+=0.8', 'none');
      S.drive(tl, (u) => {
        hs.forEach((h, i) => {
          const k = S.clamp(u * 1.8 - i * 0.1);
          let x, y;
          if (k < 0.15) { const f = k / 0.15; x = S.lerp(720 + (i - 4) * 8, 690 + i * 4, f); y = S.lerp(262, 364, f); }
          else if (k < 0.82) { [x, y] = vAt(S.lerp(0.04, 0.84, (k - 0.15) / 0.67)); y += ((i % 3) - 1) * 6; }
          else { const [vx, vy] = vAt(0.84), f = (k - 0.82) / 0.18; x = vx + (i % 3 - 1) * 10; y = S.lerp(vy, 462, f); }
          h.setAttribute('cx', x); h.setAttribute('cy', y);
          h.style.opacity = k > 0 && k < 0.999 ? 1 : 0;
        });
      }, 3.6, 's0+=1.4', 'none');
      tl.fromTo(target, { attr: { fill: '#2b3f4d' } }, { attr: { fill: '#5a3f7a' }, duration: 0.5, immediateRender: false }, 's0+=4.4');
      S.show(tl, ok0, 's0+=4.5', 0.4);

      // ===== 1 主要內分泌腺的位置 =====
      const P1 = g(root, { opacity: 0 });
      const BX = { x: -720, y: -82, s: 1.7 };
      const body = S.place(g(P1), BX);
      S.human(body, { fill: 'rgba(44,82,104,0.45)', sw: 1.6 });
      const G = glands(body);
      const B2S = (x, y) => [BX.x + x * BX.s, BX.y + y * BX.s];
      const marks = [
        [[601, 107], 140, '腦垂腺', GC.pit],
        [[588, 152], 210, '甲狀腺', GC.thy],
        [[611, 158], 280, '副甲狀腺', GC.para],
        [[624, 299], 400, '胰臟中的胰島', GC.isl],
        [[622, 326], 490, '腎上腺', GC.adr],
        [[612, 392], 600, '性腺（睪丸／卵巢）', GC.gon],
      ].map(([[bx, by], y, s, c]) => { const [tx, ty] = B2S(bx, by); return S.callout(P1, tx, ty, 520 + S.textWidth(s, 26) / 2 + 14, y, s, c, { size: 26 }); });
      const hint1 = text(P1, 1160, 60, '腺體的大小是示意＊', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute, opacity: 0 });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.4);
      marks.forEach((m, i) => S.show(tl, m, `s1+=${0.8 + i * 0.6}`, 0.4));
      S.show(tl, hint1, 's1+=0.8', 0.4);

      // ===== 2 激素與主要作用（人體縮小移到左邊） =====
      const P2 = g(root, { opacity: 0 });
      const rows = [
        ['腦垂腺', '生長激素等', '促進生長；並調控其他內分泌腺', GC.pit, G.pit],
        ['甲狀腺', '甲狀腺素', '促進代謝、影響生長發育（含碘）', GC.thy, G.thy],
        ['副甲狀腺', '副甲狀腺素', '調節血液中鈣的濃度', GC.para, G.para],
        ['胰島', '胰島素', '使血糖降低', GC.isl, G.isl],
        ['腎上腺', '腎上腺素', '緊急時使心跳加快、血糖上升', GC.adr, G.adr],
        ['性腺', '性激素', '促進生殖器官發育、第二性徵出現', GC.gon, G.gon],
      ];
      const XN = 400, XH = 556, XE = 744;
      text(P2, XN, 64, '內分泌腺', { 'font-size': 22, fill: C.mute });
      text(P2, XH, 64, '激素', { 'font-size': 22, fill: C.mute });
      text(P2, XE, 64, '主要作用', { 'font-size': 22, fill: C.mute });
      el('line', { x1: XN, y1: 80, x2: 1180, y2: 80, stroke: '#2b4252', 'stroke-width': 2 }, P2);
      const rowG = rows.map(([n, h, e, c], i) => {
        const r = g(P2, { opacity: 0 });
        const y = 136 + i * 96;
        el('rect', { x: XN - 14, y: y - 40, width: 1180 - XN + 14, height: 76, rx: 12, fill: 'rgba(255,255,255,0.03)', stroke: '#2b4252', 'stroke-width': 1.5 }, r);
        text(r, XN, y + 9, n, { 'font-size': 26, 'font-weight': 700, fill: c });
        text(r, XH, y + 8, h, { 'font-size': 24, fill: HOR, 'font-weight': 700 });
        text(r, XE, y + 8, e, { 'font-size': 22, fill: C.ink });
        return r;
      });
      tl.addLabel('s2');
      S.hide(tl, marks, 's2', 0.3);
      S.hide(tl, hint1, 's2', 0.3);
      S.move(tl, body, BX, { x: -510, y: -30, s: 1.18 }, 0.9, 's2+=0.2');
      S.show(tl, P2, 's2+=0.6', 0.3);
      const glowOn = (e, pos) => tl.fromTo(e, { opacity: 0.5 }, { opacity: 1, duration: 0.3, immediateRender: false }, pos);
      tl.set(rows.map((r) => r[4]), { opacity: 0.5 }, 's2+=0.6');
      rowG.forEach((r, i) => { S.show(tl, r, `s2+=${1.0 + i * 0.6}`, 0.4); glowOn(rows[i][4], `s2+=${1.0 + i * 0.6}`); });

      // ===== 3 分泌異常 =====
      const P3 = g(root, { opacity: 0 });
      const PX = [40, 420, 800];
      PX.forEach((x) => el('rect', { x, y: 40, width: 360, height: 610, rx: 18, ...FRAME }, P3));
      [['生長激素', GC.pit], ['甲狀腺素', GC.thy], ['胰島素', GC.isl]].forEach(([s, c], i) => text(P3, PX[i] + 180, 88, s, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: c }));
      // (a) 身高：同一個人形等比例縮放，頭和身體的比例一致
      text(P3, 220, 124, '幼年時分泌太少或太多', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      el('line', { x1: 60, y1: 556, x2: 380, y2: 556, stroke: C.ink2, 'stroke-width': 2 }, P3);
      const figs = [[98, 0.29, '侏儒症', '分泌太少'], [198, 0.4, '正常', ''], [318, 0.53, '巨人症', '分泌太多']].map(([cx, s, n, d], i) => {
        const f = g(P3, { opacity: i === 1 ? 1 : 0 });
        const hb = S.place(g(f), { x: cx - 600 * s, y: 556 - 702 * s, s });
        S.human(hb, { fill: i === 1 ? 'rgba(52,96,122,0.6)' : 'rgba(255,179,199,0.3)', stroke: i === 1 ? C.bodyEdge : GC.pit, sw: 2.4 / s });
        // 簡單的臉（眼睛、微笑），線條粗細不隨縮放變得太細
        const k = 1 / s;
        [589, 611].forEach((x) => el('circle', { cx: x, cy: 98, r: Math.max(3.4, 1.5 * k), fill: i === 1 ? '#cfe3ee' : '#ffd6e2' }, hb));
        el('path', { d: 'M 590,112 Q 600,120 610,112', fill: 'none', stroke: i === 1 ? '#cfe3ee' : '#ffd6e2', 'stroke-width': Math.max(2.6, 1.3 * k), 'stroke-linecap': 'round' }, hb);
        text(f, cx, 590, n, { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700, fill: i === 1 ? C.ink : GC.pit });
        if (d) text(f, cx, 620, d, { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
        return f;
      });
      // (b) 甲狀腺腫：友善的頭肩像（頭圓；脖子從下巴到和身體相接處約為臉長的 1/3）；甲狀腺在脖子前方，缺碘時腫大，脖子前面鼓起來
      const neck = g(P3);
      const SKN = '#f2b38a', SKN_E = '#ffdcc4', SKN_D = '#d98f68', HAIR = '#4a3426';
      el('path', { d: 'M 452,456 C 452,394 470,362 520,349 C 546,343 562,341 565,334 L 635,334 C 638,341 654,343 680,349 C 730,362 748,394 748,456 Z', fill: '#4f7896', stroke: '#8db6d2', 'stroke-width': 2 }, neck); // 衣服（肩膀）
      el('path', { d: 'M 564,276 C 566,300 566,318 563,336 Q 600,352 637,336 C 634,318 634,300 636,276 Z', fill: SKN }, neck); // 脖子（短）
      el('path', { d: 'M 563,334 C 566,318 566,302 565,290 M 637,334 C 634,318 634,302 635,290', fill: 'none', stroke: SKN_E, 'stroke-width': 2 }, neck);
      el('path', { d: 'M 563,336 Q 600,352 637,336', fill: 'none', stroke: '#8db6d2', 'stroke-width': 3, 'stroke-linecap': 'round' }, neck); // 領口
      [527, 673].forEach((x) => el('ellipse', { cx: x, cy: 222, rx: 11, ry: 18, fill: SKN, stroke: SKN_E, 'stroke-width': 2 }, neck)); // 耳朵
      el('path', { d: 'M 600,136 C 648,136 672,172 672,214 C 672,262 640,296 600,296 C 560,296 528,262 528,214 C 528,172 552,136 600,136 Z', fill: SKN, stroke: SKN_E, 'stroke-width': 2 }, neck); // 臉
      el('path', { d: 'M 525.6,222.9 C 516,161.1 549.6,124.6 602.4,124.6 C 657.6,124.6 686.4,163.4 674.4,222.9 C 667.2,195.4 652.8,177.1 631.2,168 C 607.2,181.7 571.2,184 547.2,177.1 C 537.6,190.9 530.4,206.9 525.6,222.9 Z', fill: HAIR }, neck); // 頭髮
      el('path', { d: 'M 559,207 Q 574,200 588,207 M 612,207 Q 626,200 641,207', fill: 'none', stroke: HAIR, 'stroke-width': 3, 'stroke-linecap': 'round' }, neck);
      [574, 626].forEach((x) => { el('ellipse', { cx: x, cy: 226, rx: 6, ry: 7.5, fill: '#3a2a20' }, neck); el('circle', { cx: x + 2, cy: 223, r: 2, fill: '#fff' }, neck); });
      el('path', { d: 'M 600,236 Q 595,248 602,252', fill: 'none', stroke: '#c98762', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, neck);
      [557, 643].forEach((x) => el('ellipse', { cx: x, cy: 257, rx: 11, ry: 6, fill: '#ff9aa8', opacity: 0.35 }, neck));
      el('path', { d: 'M 584,268 Q 600,280 616,268', fill: 'none', stroke: '#a0523c', 'stroke-width': 3, 'stroke-linecap': 'round' }, neck);
      // 腫起來的部分（皮膚）與裡面的甲狀腺（半透明，像透視一樣）
      const swell = el('path', { d: '', fill: SKN, opacity: 0 }, neck);
      const edge = el('path', { d: '', fill: 'none', stroke: SKN_D, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, neck);
      const gland = el('path', { d: '', fill: 'rgba(127,224,200,0.4)', stroke: GC.thy, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, neck);
      // 甲狀腺的形狀（像蝴蝶：左右兩葉，中間相連）
      const BF = [[0, -6], [8, -12], [18, -16], [26, -12], [28, 0], [26, 12], [18, 18], [8, 14], [0, 8], [-8, 14], [-18, 18], [-26, 12], [-28, 0], [-26, -12], [-18, -16], [-8, -12]];
      const SW = [[0, -10], [10, -14], [20, -16], [27, -11], [30, 0], [28, 12], [20, 19], [9, 20], [0, 17], [-9, 20], [-20, 19], [-28, 12], [-30, 0], [-27, -11], [-20, -16], [-10, -14]]; // 腫起來的皮膚輪廓
      const setGoiter = (k) => {
        const sx = 0.8 + 0.6 * k, sy = 0.7 + 0.3 * k, cy = 316 + 2 * k;
        const P = (T, f) => T.map(([x, y]) => [600 + x * sx * f, cy + y * sy * f]);
        gland.setAttribute('d', S.smoothPath(P(BF, 1)));
        // 腫起來的皮膚：比甲狀腺大一圈；上緣和脖子連在一起，只描外側和下緣
        const W = P(SW, 1.1), sm = S.smoothPath(W);
        swell.setAttribute('d', sm);
        const segs = sm.split('C').slice(1); // 每一段曲線（從第 i 點到第 i+1 點）
        edge.setAttribute('d', `M ${W[2][0].toFixed(1)},${W[2][1].toFixed(1)} ` + segs.slice(2, 14).map((c) => 'C' + c).join(' ').replace('Z', ''));
        swell.style.opacity = S.smoothstep(0, 0.2, k);
        edge.style.opacity = 0.85 * S.smoothstep(0.1, 0.6, k);
      };
      setGoiter(0);
      const thyLbl = S.callout(P3, 630, 314, 722, 300, '甲狀腺', GC.thy, { size: 22 });
      const iod = g(P3);
      text(iod, 600, 488, '缺碘 → 甲狀腺素不足', { 'font-size': 22, 'text-anchor': 'middle' });
      text(iod, 600, 522, '→ 甲狀腺腫大（大脖子）', { 'font-size': 22, 'text-anchor': 'middle', fill: GC.thy, 'font-weight': 700 });
      text(iod, 600, 576, '預防：食用加碘鹽、', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      text(iod, 600, 604, '海帶、紫菜等含碘食物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // (c) 糖尿病
      const dia = g(P3);
      el('rect', { x: 830, y: 166, width: 300, height: 104, rx: 50, fill: 'rgba(255,95,116,0.22)', stroke: BLOOD, 'stroke-width': 3 }, dia);
      text(dia, 848, 152, '血液', { 'font-size': 20, fill: BLOOD, 'font-weight': 700 });
      el('path', { d: hexD(9), transform: 'translate(1036,145)', fill: 'rgba(255,207,92,0.3)', stroke: C.sugar, 'stroke-width': 2.5 }, dia);
      text(dia, 1052, 152, '葡萄糖', { 'font-size': 20, fill: C.sugar });
      // 葡萄糖排在稍微錯開的格子上，不會互相重疊；一開始只有幾個（正常），之後越來越多（血糖太高）
      const rnd = S.rng(5), SP = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) SP.push([868 + c * 32 + (r ? 14 : 0) + (rnd() - 0.5) * 6, 200 + r * 38 + (rnd() - 0.5) * 6]);
      const ORDER = [1, 6, 10, 13, 3, 8, 15, 0, 12, 5, 9, 2, 14, 7, 11, 4];
      const sugars = ORDER.map((j, i) => el('path', { d: hexD(11), transform: `translate(${SP[j][0].toFixed(1)},${SP[j][1].toFixed(1)}) rotate(${((rnd() - 0.5) * 30).toFixed(0)})`, fill: 'rgba(255,207,92,0.3)', stroke: C.sugar, 'stroke-width': 3, opacity: i < 4 ? 1 : 0 }, dia));
      text(dia, 980, 320, '胰島素不足', { 'font-size': 22, 'text-anchor': 'middle' });
      text(dia, 980, 352, '→ 血糖太高', { 'font-size': 22, 'text-anchor': 'middle' });
      text(dia, 980, 400, '→ 糖尿病', { 'font-size': 26, 'text-anchor': 'middle', fill: C.sugar, 'font-weight': 700 });
      el('path', { d: 'M 980,450 C 950,500 945,540 980,556 C 1015,540 1010,500 980,450 Z', fill: 'rgba(255,230,120,0.4)', stroke: '#ffe68a', 'stroke-width': 3 }, dia);
      el('path', { d: hexD(10), transform: 'translate(980,526)', fill: 'rgba(255,207,92,0.3)', stroke: C.sugar, 'stroke-width': 3 }, dia);
      text(dia, 980, 598, '尿液中也會出現葡萄糖', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s3');
      S.hide(tl, [P1, P2], 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, figs[0], 's3+=0.9', 0.4);
      S.show(tl, figs[2], 's3+=1.4', 0.4);
      S.show(tl, thyLbl, 's3+=1.2', 0.4);
      S.drive(tl, setGoiter, 1.2, 's3+=2.0', 'power1.inOut');
      sugars.slice(4).forEach((h, i) => S.show(tl, h, `s3+=${3.0 + i * 0.12}`, 0.2));

      // ===== 4 神經系統 vs 內分泌系統 =====
      const P4 = g(root, { opacity: 0 });
      // 上：神經（快）
      text(P4, 60, 80, '神經系統', { 'font-size': 28, 'font-weight': 700, fill: NV });
      el('circle', { cx: 120, cy: 150, r: 34, fill: '#e8a0b4' }, P4);
      text(P4, 120, 158, '腦', { 'font-size': 22, 'text-anchor': 'middle', fill: '#3a1f28', 'font-weight': 700 });
      const nerveP = el('path', { d: 'M 156,150 L 1000,150', stroke: NV, 'stroke-width': 5 }, P4);
      const m1 = el('rect', { x: 1010, y: 116, width: 140, height: 68, rx: 14, fill: '#2b3f4d', stroke: NV, 'stroke-width': 2 }, P4);
      text(P4, 1080, 158, '肌肉', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
      const spk = el('circle', { cx: 0, cy: 150, r: 10, fill: NV, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, P4);
      text(P4, 580, 132, '電訊號沿著神經傳遞', { 'font-size': 22, 'text-anchor': 'middle', fill: NV });
      // 下：內分泌（慢）
      text(P4, 60, 250, '內分泌系統', { 'font-size': 28, 'font-weight': 700, fill: HOR });
      el('ellipse', { cx: 120, cy: 320, rx: 40, ry: 30, fill: 'rgba(197,140,255,0.3)', stroke: HOR, 'stroke-width': 3 }, P4);
      text(P4, 120, 328, '腺體', { 'font-size': 22, 'text-anchor': 'middle', fill: HOR, 'font-weight': 700 });
      const bv = el('path', { d: 'M 166,320 C 300,280 420,370 560,320 C 700,270 820,370 1000,320', stroke: BLOOD, 'stroke-width': 22, fill: 'none', opacity: 0.45, 'stroke-linecap': 'round' }, P4);
      const m2 = el('rect', { x: 1010, y: 286, width: 140, height: 68, rx: 14, fill: '#2b3f4d', stroke: HOR, 'stroke-width': 2 }, P4);
      text(P4, 1080, 328, '特定器官', { 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P4, 580, 380, '激素隨著血液運送', { 'font-size': 22, 'text-anchor': 'middle', fill: HOR });
      const bvAt = along(bv);
      const hs4 = Array.from({ length: 6 }, () => el('circle', { cx: 0, cy: 0, r: 7, fill: HOR, stroke: '#fff', 'stroke-width': 1.5, opacity: 0 }, P4));
      // 比較表
      const tb = g(P4, { opacity: 0 });
      const TY = 430, cols = [60, 330, 760];
      el('rect', { x: 40, y: TY, width: 1120, height: 270, rx: 16, ...FRAME }, tb);
      [['', '神經系統', '內分泌系統'], ['傳遞方式', '電訊號，沿神經傳遞', '激素，經血液運送'], ['速度', '快', '較慢'], ['作用時間', '短', '較長'], ['作用範圍', '較小、較精確', '較廣']].forEach((r, i) => {
        const y = TY + 46 + i * 52;
        r.forEach((s, j) => text(tb, cols[j], y, s, { 'font-size': i === 0 ? 24 : 24, fill: i === 0 ? [C.ink, NV, HOR][j] : j === 0 ? C.mute : C.ink, 'font-weight': i === 0 || j > 0 ? 700 : 400 }));
        if (i > 0) el('line', { x1: 56, y1: y - 34, x2: 1144, y2: y - 34, stroke: '#2b4252', 'stroke-width': 1.5 }, tb);
      });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.drive(tl, (u) => { spk.setAttribute('cx', S.lerp(156, 1000, u)); spk.style.opacity = u > 0 && u < 0.995 ? 1 : 0; }, 0.5, 's4+=0.9', 'none');
      tl.fromTo(m1, { attr: { fill: '#2b3f4d' } }, { attr: { fill: '#6a5a20' }, duration: 0.15, immediateRender: false }, 's4+=1.4');
      tl.to(m1, { attr: { fill: '#2b3f4d' }, duration: 0.4 }, 's4+=2.0');
      S.drive(tl, (u) => {
        hs4.forEach((h, i) => { const k = S.clamp(u * 1.4 - i * 0.08); const [x, y] = bvAt(k); h.setAttribute('cx', x); h.setAttribute('cy', y + ((i % 3) - 1) * 5); h.style.opacity = k > 0 && k < 0.999 ? 1 : 0; });
      }, 3, 's4+=0.9', 'none');
      tl.fromTo(m2, { attr: { fill: '#2b3f4d' } }, { attr: { fill: '#5a3f7a' }, duration: 0.6, immediateRender: false }, 's4+=3.4');
      S.show(tl, tb, 's4+=3.8', 0.5);

      // ===== 5 共同協調：突然受到驚嚇 =====
      const P5 = g(root, { opacity: 0 });
      const BB = { x: -530, y: -38, s: 1.3 };
      const b5 = S.place(g(P5), BB);
      S.human(b5, { fill: 'rgba(44,82,104,0.45)', sw: 1.8 });
      el('ellipse', { cx: 600, cy: 88, rx: 24, ry: 19, fill: '#e8a0b4' }, b5);
      el('line', { x1: 600, y1: 108, x2: 600, y2: 360, stroke: NV, 'stroke-width': 4, opacity: 0.8 }, b5);
      const heart = el('path', { d: 'M 612,252 C 596,240 594,224 604,220 C 610,218 613,224 613,226 C 614,222 619,216 626,220 C 634,228 626,242 612,252 Z', fill: BLOOD, stroke: '#ffd0d6', 'stroke-width': 1 }, b5);
      [[578, 345], [622, 342]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 8, ry: 13, fill: 'rgba(200,120,110,0.45)' }, b5));
      [[578, 329], [622, 326]].forEach(([x, y]) => el('path', { d: `M ${x - 7},${y + 4} Q ${x},${y - 9} ${x + 7},${y + 4} Z`, fill: GC.adr, stroke: '#fff', 'stroke-width': 0.6 }, b5));
      const nToHeart = el('path', { d: 'M 600,200 C 606,214 610,222 612,232', stroke: NV, 'stroke-width': 3, fill: 'none' }, b5);
      const nToAdr = el('path', { d: 'M 600,300 C 610,310 618,318 622,326', stroke: NV, 'stroke-width': 3, fill: 'none' }, b5);
      const vAdr = el('path', { d: 'M 630,328 C 650,300 648,260 626,240', stroke: BLOOD, 'stroke-width': 4, fill: 'none', opacity: 0.6 }, b5);
      const B5 = (x, y) => [BB.x + x * BB.s, BB.y + y * BB.s];
      const scare = g(P5, { opacity: 0 });
      S.pill(scare, 880, 50, '突然受到驚嚇！', { size: 26, color: C.hi, edge: C.hi });
      const c5 = [
        [B5(600, 88), 480, 90, '大腦察覺危險', '#e8a0b4'],
        [B5(612, 236), 480, 250, '心跳加快', BLOOD],
        [B5(622, 326), 480, 410, '腎上腺', GC.adr],
      ].map(([[tx, ty], x, y, s, c]) => S.callout(P5, tx, ty, x, y, s, c, { size: 22 }));
      text(c5[2], 480, 448, '分泌腎上腺素', { 'font-size': 20, 'text-anchor': 'middle', fill: GC.adr });
      const nAt1 = along(nToHeart), nAt2 = along(nToAdr), vAt5 = along(vAdr);
      const sp1 = el('circle', { r: 4, fill: NV, opacity: 0 }, b5), sp2 = el('circle', { r: 4, fill: NV, opacity: 0 }, b5);
      const hs5 = Array.from({ length: 5 }, () => el('circle', { r: 3, fill: HOR, stroke: '#fff', 'stroke-width': 0.8, opacity: 0 }, b5));
      // 心跳快慢的曲線（示意）
      const GX0 = 600, GX1 = 1150, GY0 = 520, GY1 = 170;
      const gr = g(P5, { opacity: 0 });
      el('line', { x1: GX0, y1: GY0, x2: GX1, y2: GY0, stroke: C.ink2, 'stroke-width': 2 }, gr);
      el('line', { x1: GX0, y1: GY0, x2: GX0, y2: GY1 - 20, stroke: C.ink2, 'stroke-width': 2 }, gr);
      text(gr, GX0 + 10, GY1 - 30, '心跳快慢＊', { 'font-size': 20, fill: C.mute });
      text(gr, GX1, GY0 + 32, '時間 →', { 'font-size': 20, 'text-anchor': 'end', fill: C.mute });
      el('line', { x1: 680, y1: GY0, x2: 680, y2: GY1, stroke: C.hi, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, gr);
      text(gr, 680, GY0 + 32, '受到驚嚇', { 'font-size': 20, 'text-anchor': 'middle', fill: C.hi });
      const hr = el('path', { d: `M ${GX0},470 L 680,470 C 690,470 692,250 712,240 C 760,226 860,232 900,250 C 960,290 1040,420 ${GX1},462`, stroke: BLOOD, 'stroke-width': 4, fill: 'none' }, gr);
      const a1 = g(P5, { opacity: 0 }), a2 = g(P5, { opacity: 0 });
      text(a1, 720, 214, '神經：幾乎立刻加快', { 'font-size': 22, fill: NV, 'font-weight': 700 });
      text(a2, 724, 316, '腎上腺素：', { 'font-size': 22, fill: GC.adr, 'font-weight': 700 });
      text(a2, 724, 346, '持續一段時間', { 'font-size': 22, fill: GC.adr, 'font-weight': 700 });
      text(a2, 724, 376, '才慢慢恢復', { 'font-size': 22, fill: GC.adr, 'font-weight': 700 });
      const sum5 = g(P5, { opacity: 0 });
      el('rect', { x: 600, y: 580, width: 560, height: 110, rx: 16, fill: 'rgba(255,209,102,0.06)', stroke: '#4a5a3a', 'stroke-width': 2 }, sum5);
      text(sum5, 880, 626, '神經：反應快、作用時間短', { 'font-size': 24, 'text-anchor': 'middle', fill: NV });
      text(sum5, 880, 664, '激素：作用較慢，但持續較久', { 'font-size': 24, 'text-anchor': 'middle', fill: HOR });
      tl.addLabel('s5');
      S.hide(tl, P4, 's5', 0.4);
      S.show(tl, P5, 's5+=0.3', 0.4);
      S.show(tl, scare, 's5+=0.6', 0.3);
      S.show(tl, c5[0], 's5+=0.9', 0.3);
      S.show(tl, gr, 's5+=0.9', 0.4);
      S.drive(tl, (u) => {
        [[sp1, nAt1], [sp2, nAt2]].forEach(([d, at]) => { const [x, y] = at(u); d.setAttribute('cx', x); d.setAttribute('cy', y); d.style.opacity = u > 0 && u < 0.995 ? 1 : 0; });
      }, 0.4, 's5+=1.4', 'none');
      S.show(tl, c5[1], 's5+=1.8', 0.3);
      S.drawOn(tl, hr, 4, 's5+=1.6', 'none');
      S.show(tl, a1, 's5+=2.0', 0.3);
      S.show(tl, c5[2], 's5+=2.4', 0.3);
      S.drive(tl, (u) => {
        hs5.forEach((h, i) => { const k = S.clamp(u * 1.5 - i * 0.12); const [x, y] = vAt5(k); h.setAttribute('cx', x); h.setAttribute('cy', y); h.style.opacity = k > 0 && k < 0.999 ? 1 : 0; });
      }, 1.6, 's5+=2.6', 'none');
      tl.fromTo(heart, { attr: { 'stroke-width': 1 } }, { attr: { 'stroke-width': 4 }, duration: 0.3, repeat: 5, yoyo: true, immediateRender: false }, 's5+=1.8');
      S.show(tl, a2, 's5+=3.6', 0.4);
      S.show(tl, sum5, 's5+=5.0', 0.5);

      return {
        tl,
        notes: [
          '＊示意：激素的顆粒畫得很大。激素（也稱為荷爾蒙）的量很少，卻能產生明顯的作用。',
          '＊示意：腺體畫得比實際大，位置也簡化了。副甲狀腺是甲狀腺後面的幾個小腺體；男性的性腺是睪丸，女性是卵巢。胰島分散在胰臟中。',
          '＊胰島也分泌升糖素，能使血糖升高（第六章「血糖恆定」會再學）。睪丸分泌男性激素、卵巢分泌女性激素，青春期時讓身體出現第二性徵。',
          '＊示意：身高差異是示意。成年後生長激素分泌太多，會造成肢端肥大症（補充）。甲狀腺素分泌太多會造成甲狀腺功能亢進：代謝太快、心跳快、怕熱、體重減輕。糖尿病也可能是身體對胰島素的反應變差（補充）。',
          '＊示意：速度和時間的差別是示意，用來比較兩者的不同。',
          '＊示意：心跳的曲線只是示意。腎上腺分泌腎上腺素，也受神經系統控制（補充）。',
        ],
        steps: [
          '<b>內分泌腺</b>沒有導管，分泌的<b>激素</b>直接進入<b>血液</b>，隨血液運送到全身，只對<b>特定的器官</b>產生作用。汗腺、唾腺等<b>外分泌腺</b>則經由<b>導管</b>送出分泌物。',
          '人體主要的內分泌腺：<b>腦垂腺</b>、<b>甲狀腺</b>、<b>副甲狀腺</b>、<b>胰島</b>（在胰臟中）、<b>腎上腺</b>和<b>性腺</b>（睪丸或卵巢）。',
          '各種內分泌腺分泌不同的激素：<b>生長激素</b>促進生長、<b>甲狀腺素</b>促進代謝、<b>胰島素</b>使血糖降低、<b>腎上腺素</b>在緊急時使心跳加快……',
          '激素太多或太少都會影響健康：幼年時<b>生長激素</b>太少會<b>侏儒症</b>、太多會<b>巨人症</b>；缺<b>碘</b>使<b>甲狀腺腫大</b>；<b>胰島素</b>不足，血糖太高，會造成<b>糖尿病</b>。',
          '<b>神經系統</b>以電訊號沿神經傳遞，反應<b>快</b>、作用時間<b>短</b>；<b>內分泌系統</b>以激素經血液運送，作用<b>較慢</b>，但<b>持續較久</b>、範圍較廣。',
          '兩個系統會<b>共同協調</b>。突然受到驚嚇時，神經讓心跳立刻加快；<b>腎上腺</b>分泌<b>腎上腺素</b>，經血液運送，讓心跳加快、血糖上升，持續一段時間才恢復。',
        ],
      };
    },
  });
})();
