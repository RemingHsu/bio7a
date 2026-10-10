/* 4-3 行為與感應：本能行為與學習行為、行為幫助生存與繁殖、植物的向性、向光性的原因、觸發運動 */
(() => {
  const { el, g, text, C } = S;
  const FRAME = { fill: '#122230', stroke: '#2b4252', 'stroke-width': 2 };
  const STEM = '#7fcf5a', ROOT = '#e8d8b0', LEAF = '#5fbf4a', SOIL = '#4a3526', INN = '#ffd166', LRN = '#62d0c0';
  const rad = (d) => (d * Math.PI) / 180;

  // 會彎曲的莖或根：從 (x0,y0) 出發，方向由 a0 漸漸變成 a1（度，0＝右、-90＝上），彎曲集中在靠近尖端的部分
  function sprout(p, { color = STEM, width = 7, leaves = false } = {}) {
    const path = el('path', { d: '', stroke: color, 'stroke-width': width, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    const lv = leaves ? g(p) : null;
    if (lv) [-1, 1].forEach((s) => el('ellipse', { cx: 18, cy: s * 10, rx: 18, ry: 8, fill: LEAF, transform: `rotate(${s * 35})` }, lv));
    const set = (x0, y0, len, a0, a1) => {
      const N = 30; let x = x0, y = y0, d = `M ${x0.toFixed(1)},${y0.toFixed(1)}`, a = a0;
      for (let i = 1; i <= N; i++) {
        a = a0 + (a1 - a0) * S.smoothstep(0.25, 1, i / N);
        x += Math.cos(rad(a)) * (len / N); y += Math.sin(rad(a)) * (len / N);
        d += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
      }
      path.setAttribute('d', d);
      if (lv) lv.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)})`);
      return [x, y, a];
    };
    return { path, set };
  }
  const lamp = (p, x, y, dir = -1) => {
    const l = g(p);
    el('circle', { cx: x, cy: y, r: 22, fill: C.hi }, l);
    el('rect', { x: x - 10, y: y - 40, width: 20, height: 18, rx: 3, fill: '#8aa1ae' }, l);
    [-30, 0, 30].forEach((da) => { const a = rad((dir < 0 ? 180 : 0) + da + 20 * -dir); el('line', { x1: x + Math.cos(a) * 32, y1: y + Math.sin(a) * 32, x2: x + Math.cos(a) * 70, y2: y + Math.sin(a) * 70, stroke: C.hi, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '8 6' }, l); });
    return l;
  };

  S.register({
    id: 'behavior', section: '5-3', title: '行為與感應',
    build(root) {
      const tl = gsap.timeline({ paused: true });

      // ===== 0 本能行為與學習行為 =====
      const P0 = g(root);
      el('rect', { x: 40, y: 30, width: 540, height: 530, rx: 18, ...FRAME }, P0);
      el('rect', { x: 620, y: 30, width: 540, height: 530, rx: 18, ...FRAME }, P0);
      text(P0, 310, 78, '本能行為', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: INN });
      text(P0, 310, 114, '生下來就會，不必學習', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P0, 890, 78, '學習行為', { 'font-size': 32, 'text-anchor': 'middle', 'font-weight': 700, fill: LRN });
      text(P0, 890, 114, '經由經驗或練習才會', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      // 蜘蛛結網
      const web = g(P0);
      const WX = 175, WY = 290, WR = 100;
      const spokes = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.283; return el('line', { x1: WX, y1: WY, x2: WX + Math.cos(a) * WR, y2: WY + Math.sin(a) * WR, stroke: '#dfe8ee', 'stroke-width': 2 }, web); });
      let sd = '';
      for (let i = 0; i <= 300; i++) { const t = i / 300, a = t * 6.283 * 6, r = 14 + 82 * t; sd += `${i ? 'L' : 'M'} ${(WX + Math.cos(a) * r).toFixed(1)},${(WY + Math.sin(a) * r).toFixed(1)} `; }
      const spiral = el('path', { d: sd, stroke: '#dfe8ee', 'stroke-width': 1.6, fill: 'none' }, web);
      const spider = g(web);
      for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => el('path', { d: `M ${WX},${WY} l ${s * 16},${-12 + k * 8} l ${s * 9},${9 + k * 4}`, stroke: '#d9a040', 'stroke-width': 3, fill: 'none' }, spider));
      el('circle', { cx: WX, cy: WY + 13, r: 12, fill: '#d9a040' }, spider);
      el('circle', { cx: WX, cy: WY - 4, r: 8, fill: '#c08a30' }, spider);
      text(P0, 175, 450, '蜘蛛結網', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      // 嬰兒吸吮
      const baby = g(P0);
      el('circle', { cx: 430, cy: 290, r: 64, fill: C.skin }, baby);
      el('path', { d: 'M 400,232 C 410,214 440,214 446,234', stroke: '#8a5a3a', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, baby);
      [404, 446].forEach((x) => el('path', { d: `M ${x - 10},284 Q ${x},292 ${x + 10},284`, stroke: '#5a3a2a', 'stroke-width': 3.5, fill: 'none' }, baby));
      const cheeks = [398, 462].map((x) => el('ellipse', { cx: x, cy: 312, rx: 10, ry: 6, fill: '#ff9aa8', opacity: 0.6 }, baby));
      const bottle = g(baby, { transform: 'rotate(-28 470 320)' });
      el('path', { d: 'M 462,314 Q 468,306 478,310 L 486,312 L 486,328 L 478,330 Q 468,334 462,326 Z', fill: '#e8b070' }, bottle);
      el('rect', { x: 486, y: 306, width: 16, height: 28, rx: 3, fill: '#62a8ff' }, bottle);
      el('rect', { x: 502, y: 300, width: 64, height: 40, rx: 10, fill: 'rgba(240,248,255,0.85)', stroke: '#cfe8ff', 'stroke-width': 2 }, bottle);
      el('rect', { x: 504, y: 316, width: 60, height: 22, rx: 6, fill: '#fffbe8' }, bottle);
      text(P0, 445, 450, '嬰兒吸吮', { 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700 });
      // 狗聽口令坐下
      const dog = g(P0);
      const DX = 760;
      el('path', { d: `M ${DX + 40},404 C ${DX + 70},390 ${DX + 76},360 ${DX + 70},340`, stroke: '#a8783a', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, dog);
      el('ellipse', { cx: DX + 18, cy: 404, rx: 42, ry: 24, fill: '#b98a4a' }, dog);
      el('ellipse', { cx: DX, cy: 350, rx: 38, ry: 56, fill: '#c99a5a', transform: `rotate(-12 ${DX} 350)` }, dog);
      [DX - 26, DX - 6].forEach((x) => el('rect', { x, y: 370, width: 13, height: 58, rx: 6, fill: '#c99a5a' }, dog));
      el('circle', { cx: DX - 20, cy: 280, r: 32, fill: '#c99a5a' }, dog);
      el('ellipse', { cx: DX - 48, cy: 292, rx: 22, ry: 14, fill: '#d9b07a' }, dog);
      el('circle', { cx: DX - 68, cy: 287, r: 6, fill: '#2b2b2b' }, dog);
      el('circle', { cx: DX - 26, cy: 272, r: 4.5, fill: '#2b2b2b' }, dog);
      el('ellipse', { cx: DX + 2, cy: 278, rx: 11, ry: 26, fill: '#8a5a2a', transform: `rotate(18 ${DX + 2} 278)` }, dog);
      el('line', { x1: 690, y1: 430, x2: 830, y2: 430, stroke: '#4a6272', 'stroke-width': 3 }, dog);
      const cmd = g(P0, { opacity: 0 });
      el('rect', { x: 660, y: 168, width: 104, height: 46, rx: 14, fill: '#f4f1ea' }, cmd);
      el('path', { d: 'M 740,214 L 752,232 L 726,214 Z', fill: '#f4f1ea' }, cmd);
      text(cmd, 712, 200, '坐下！', { 'font-size': 24, 'text-anchor': 'middle', fill: '#13232b', 'font-weight': 700 });
      text(P0, 755, 470, '狗聽到口令坐下', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P0, 755, 502, '（訓練、獎勵）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      // 黑猩猩用樹枝取白蟻
      const chimp = g(P0);
      el('path', { d: 'M 1060,432 C 1070,360 1086,290 1100,250 Q 1108,236 1116,250 C 1128,300 1140,370 1150,432 Z', fill: '#a0704a', stroke: '#c9955f', 'stroke-width': 2 }, chimp);
      [[1100, 300], [1118, 352], [1092, 392]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 7, ry: 5, fill: '#3a2618' }, chimp));
      el('ellipse', { cx: 990, cy: 404, rx: 48, ry: 26, fill: '#3e2c20' }, chimp);
      el('ellipse', { cx: 990, cy: 350, rx: 38, ry: 52, fill: '#4a3424' }, chimp);
      el('circle', { cx: 972, cy: 276, r: 32, fill: '#4a3424' }, chimp);
      [944, 1000].forEach((x) => el('circle', { cx: x, cy: 272, r: 9, fill: '#c9a07a' }, chimp));
      el('ellipse', { cx: 974, cy: 286, rx: 20, ry: 18, fill: '#c9a07a' }, chimp);
      [966, 982].forEach((x) => el('circle', { cx: x, cy: 280, r: 3, fill: '#1a1a1a' }, chimp));
      el('path', { d: 'M 1004,330 Q 1040,330 1062,306', stroke: '#4a3424', 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }, chimp);
      const stick = g(chimp);
      el('line', { x1: 1046, y1: 318, x2: 1102, y2: 298, stroke: '#d9b07a', 'stroke-width': 4, 'stroke-linecap': 'round' }, stick);
      [[1060, 312], [1070, 309], [1080, 305]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y - 4, rx: 4, ry: 2.5, fill: '#f0e0c0' }, stick));
      text(P0, 1025, 470, '黑猩猩用樹枝取白蟻', { 'font-size': 24, 'text-anchor': 'middle', 'font-weight': 700 });
      text(P0, 1025, 502, '（觀察、模仿、練習）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const bot0 = g(P0, { opacity: 0 });
      text(bot0, 310, 612, '與生俱來，同種動物的表現大致相同', { 'font-size': 22, 'text-anchor': 'middle', fill: INN });
      text(bot0, 890, 612, '後天學來，每個個體可能不一樣', { 'font-size': 22, 'text-anchor': 'middle', fill: LRN });
      text(bot0, 600, 670, '很多行為同時有本能和學習的成分', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      tl.addLabel('s0');
      gsap.set([spider, baby, dog, chimp], { opacity: 0 });
      spokes.forEach((l, i) => S.drawOn(tl, l, 0.25, `s0+=${0.3 + i * 0.06}`));
      S.drawOn(tl, spiral, 1.8, 's0+=0.9', 'none');
      S.show(tl, spider, 's0+=2.4', 0.3);
      S.show(tl, baby, 's0+=1.2', 0.4);
      cheeks.forEach((c) => tl.fromTo(c, { attr: { rx: 10 } }, { attr: { rx: 13 }, duration: 0.3, repeat: 5, yoyo: true, immediateRender: false }, 's0+=1.6'));
      S.show(tl, dog, 's0+=2.8', 0.4);
      S.show(tl, cmd, 's0+=3.2', 0.3);
      S.show(tl, chimp, 's0+=3.8', 0.4);
      S.drive(tl, (u) => stick.setAttribute('transform', `translate(${(-14 * Math.sin(u * Math.PI * 3)).toFixed(1)},${(5 * Math.sin(u * Math.PI * 3)).toFixed(1)})`), 1.6, 's0+=4.2', 'none');
      S.show(tl, bot0, 's0+=5.0', 0.5);

      // ===== 1 行為幫助生存與繁殖 =====
      const P1 = g(root, { opacity: 0 });
      const X1 = [30, 325, 620, 915];
      const cards = [['覓食', '青蛙伸出舌頭', '捕捉昆蟲'], ['躲避敵害', '穿山甲遇到危險', '捲成一顆球'], ['求偶', '雄孔雀展開', '尾羽（開屏）'], ['育幼', '親鳥把食物', '餵給雛鳥']].map(([t, a, b], i) => {
        const c = g(P1, { opacity: 0 });
        el('rect', { x: X1[i], y: 30, width: 255, height: 520, rx: 18, ...FRAME }, c);
        text(c, X1[i] + 127, 78, t, { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: i < 2 ? INN : '#ff8fb1' });
        text(c, X1[i] + 127, 476, a, { 'font-size': 22, 'text-anchor': 'middle' });
        text(c, X1[i] + 127, 508, b, { 'font-size': 22, 'text-anchor': 'middle' });
        return c;
      });
      // 青蛙
      const FX = 140, FY = 330;
      const frog = cards[0];
      el('ellipse', { cx: FX, cy: FY, rx: 58, ry: 38, fill: '#5fae4a' }, frog);
      [[FX - 30, FY + 30], [FX + 34, FY + 30]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 24, ry: 10, fill: '#4f9a3a' }, frog));
      [[FX - 2, FY - 34], [FX + 34, FY - 32]].forEach(([x, y]) => { el('circle', { cx: x, cy: y, r: 14, fill: '#5fae4a' }, frog); el('circle', { cx: x, cy: y, r: 6, fill: '#1a1a1a' }, frog); });
      el('path', { d: `M ${FX + 10},${FY - 6} Q ${FX + 36},${FY + 4} ${FX + 56},${FY - 8}`, stroke: '#2f6a2a', 'stroke-width': 3, fill: 'none' }, frog);
      const tongue = el('path', { d: `M ${FX + 54},${FY - 8} C ${FX + 80},${FY - 30} ${FX + 100},${FY - 80} ${FX + 112},${FY - 120}`, stroke: '#ff7a8a', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, frog);
      const fly = g(frog);
      el('ellipse', { cx: FX + 114, cy: FY - 124, rx: 8, ry: 6, fill: '#2b2b2b' }, fly);
      [-1, 1].forEach((s) => el('ellipse', { cx: FX + 114 + s * 6, cy: FY - 132, rx: 6, ry: 9, fill: 'rgba(220,240,255,0.7)', transform: `rotate(${s * 30} ${FX + 114 + s * 6} ${FY - 132})` }, fly));
      // 穿山甲
      const pang = S.place(g(cards[1]), { x: 452, y: 310 });
      const pin = g(pang);
      el('circle', { cx: 0, cy: 0, r: 70, fill: '#8a6a4a' }, pin);
      for (let ring = 0; ring < 4; ring++) {
        const r = 20 + ring * 16, n = 6 + ring * 4;
        for (let k = 0; k < n; k++) { const a = (k / n) * 6.283 + ring * 0.3; const x = Math.cos(a) * r, y = Math.sin(a) * r; el('path', { d: 'M -9,-4 Q 0,10 9,-4', transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(0)})`, stroke: '#c9a070', 'stroke-width': 3, fill: 'none' }, pin); }
      }
      el('path', { d: 'M 52,40 C 30,74 -30,78 -58,44', stroke: '#6a4a30', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, pin);
      // 孔雀
      const PX = 747, PY = 400;
      const fan = g(cards[2]);
      const feathers = Array.from({ length: 13 }, () => {
        const f = g(fan);
        el('line', { x1: 0, y1: 0, x2: 0, y2: -120, stroke: '#3fa86a', 'stroke-width': 4 }, f);
        el('ellipse', { cx: 0, cy: -120, rx: 15, ry: 19, fill: '#2f8a5a' }, f);
        el('ellipse', { cx: 0, cy: -120, rx: 9, ry: 12, fill: '#d9b040' }, f);
        el('ellipse', { cx: 0, cy: -120, rx: 5, ry: 7, fill: '#1f4fa8' }, f);
        return f;
      });
      const setFan = (u) => feathers.forEach((f, i) => { const a = S.lerp(-6 + i, -62 + (i * 124) / 12, u); f.setAttribute('transform', `translate(${PX},${PY}) rotate(${a.toFixed(1)})`); });
      setFan(0);
      el('ellipse', { cx: PX, cy: PY + 10, rx: 22, ry: 34, fill: '#2a5fc0' }, cards[2]);
      el('path', { d: `M ${PX - 4},${PY - 16} C ${PX - 10},${PY - 40} ${PX - 4},${PY - 56} ${PX},${PY - 60}`, stroke: '#2a5fc0', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, cards[2]);
      el('circle', { cx: PX, cy: PY - 62, r: 10, fill: '#2a5fc0' }, cards[2]);
      [-6, 0, 6].forEach((dx) => el('line', { x1: PX, y1: PY - 70, x2: PX + dx, y2: PY - 86, stroke: '#2a5fc0', 'stroke-width': 2 }, cards[2]));
      el('path', { d: `M ${PX - 9},${PY - 62} l -10,3 l 10,3 Z`, fill: '#d9b040' }, cards[2]);
      // 親鳥餵雛鳥
      const NX = 1042;
      const nest = cards[3];
      [[NX - 34, 392], [NX, 384], [NX + 34, 392]].forEach(([x, y]) => {
        el('circle', { cx: x, cy: y, r: 17, fill: '#b8a890' }, nest);
        el('path', { d: `M ${x - 7},${y - 12} L ${x},${y - 34} L ${x + 7},${y - 12} Z`, fill: '#ffb35c' }, nest);
        el('circle', { cx: x - 6, cy: y - 2, r: 2.5, fill: '#1a1a1a' }, nest);
      });
      el('path', { d: `M ${NX - 86},404 Q ${NX},${470} ${NX + 86},404 Z`, fill: '#7a5a3a', stroke: '#a8805a', 'stroke-width': 3 }, nest);
      for (let k = 0; k < 5; k++) el('line', { x1: NX - 80 + k * 30, y1: 414 + (k % 2) * 6, x2: NX - 50 + k * 30, y2: 424 - (k % 2) * 6, stroke: '#a8805a', 'stroke-width': 2 }, nest);
      const parent = S.place(g(nest), { x: NX + 30, y: 200 });
      el('ellipse', { cx: 20, cy: 0, rx: 40, ry: 24, fill: '#8a6a4a' }, parent);
      el('path', { d: 'M 40,-10 L 80,-30 L 56,8 Z', fill: '#6a4a30' }, parent);
      el('circle', { cx: -16, cy: -12, r: 17, fill: '#8a6a4a' }, parent);
      el('circle', { cx: -20, cy: -16, r: 3, fill: '#1a1a1a' }, parent);
      el('path', { d: 'M -30,-6 L -52,4 L -30,2 Z', fill: '#ffb35c' }, parent);
      el('path', { d: 'M -50,4 q -6,10 0,18 q 6,8 0,16', stroke: '#ff8fa0', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, parent);
      const br1 = g(P1, { opacity: 0 });
      [[30, 580, '幫助生存（活下來）', INN], [620, 1170, '幫助繁殖（留下後代）', '#ff8fb1']].forEach(([x1, x2, s, c]) => {
        el('path', { d: `M ${x1 + 10},566 L ${x1 + 10},584 L ${x2 - 10},584 L ${x2 - 10},566`, stroke: c, 'stroke-width': 3, fill: 'none' }, br1);
        S.pill(br1, (x1 + x2) / 2, 628, s, { size: 26, color: c, edge: c });
      });
      tl.addLabel('s1');
      S.hide(tl, P0, 's1', 0.4);
      S.show(tl, P1, 's1+=0.3', 0.1);
      cards.forEach((c, i) => S.show(tl, c, `s1+=${0.4 + i * 0.5}`, 0.4));
      S.drawOn(tl, tongue, 0.3, 's1+=1.0', 'power2.out');
      tl.fromTo(tongue, { attr: { 'stroke-dashoffset': 0 } }, { attr: { 'stroke-dashoffset': tongue.getTotalLength() }, duration: 0.3, immediateRender: false }, 's1+=1.5');
      tl.fromTo(fly, { opacity: 1 }, { opacity: 0, duration: 0.1, immediateRender: false }, 's1+=1.5');
      S.drive(tl, (u) => pin.setAttribute('transform', `rotate(${(14 * Math.sin(u * Math.PI * 4) * (1 - u)).toFixed(1)})`), 1.4, 's1+=1.4', 'none');
      S.drive(tl, setFan, 1.2, 's1+=2.0', 'back.out(1.4)');
      S.move(tl, parent, { x: NX + 30, y: 200 }, { x: NX + 30, y: 290 }, 1.0, 's1+=2.6');
      S.show(tl, br1, 's1+=3.8', 0.5);

      // ===== 2 植物的向性 =====
      const P2 = g(root, { opacity: 0 });
      const X2 = [30, 325, 620, 915];
      const pans = [['莖的向光性', '莖朝光源彎曲'], ['根的向地性', '根向下、莖向上'], ['根的向水性', '根朝水多的地方長'], ['卷鬚的向觸性', '碰到支柱就纏繞']].map(([t, c], i) => {
        const pg = g(P2, { opacity: 0 });
        el('rect', { x: X2[i], y: 30, width: 255, height: 520, rx: 18, ...FRAME }, pg);
        text(pg, X2[i] + 127, 76, t, { 'font-size': 28, 'text-anchor': 'middle', 'font-weight': 700, fill: STEM });
        text(pg, X2[i] + 127, 512, c, { 'font-size': 22, 'text-anchor': 'middle' });
        return pg;
      });
      // (1) 向光性
      const c1 = 140;
      el('path', { d: `M ${c1 - 52},420 L ${c1 + 52},420 L ${c1 + 40},470 L ${c1 - 40},470 Z`, fill: '#b0703c' }, pans[0]);
      el('rect', { x: c1 - 56, y: 412, width: 112, height: 12, rx: 4, fill: '#7a4a24' }, pans[0]);
      lamp(pans[0], 250, 150, -1);
      const sp1 = sprout(pans[0], { leaves: true });
      // (2) 向地性
      const c2 = 452;
      el('rect', { x: 345, y: 110, width: 215, height: 350, rx: 10, fill: 'rgba(74,53,38,0.55)', stroke: '#6a5040', 'stroke-width': 2 }, pans[1]);
      const sp2 = sprout(pans[1], { leaves: true }), rt2 = sprout(pans[1], { color: ROOT, width: 5 });
      el('ellipse', { cx: c2, cy: 290, rx: 20, ry: 13, fill: '#d9b070', stroke: '#f0d8a0', 'stroke-width': 2 }, pans[1]);
      el('line', { x1: 365, y1: 140, x2: 365, y2: 220, stroke: C.ink2, 'stroke-width': 3 }, pans[1]);
      el('path', { d: 'M 365,226 l -7,-12 l 14,0 Z', fill: C.ink2 }, pans[1]);
      text(pans[1], 380, 186, '重力', { 'font-size': 20, fill: C.ink2 });
      // (3) 向水性
      el('rect', { x: 640, y: 170, width: 215, height: 290, rx: 10, fill: 'rgba(74,53,38,0.55)', stroke: '#6a5040', 'stroke-width': 2 }, pans[2]);
      el('ellipse', { cx: 812, cy: 410, rx: 46, ry: 36, fill: 'rgba(95,184,255,0.45)' }, pans[2]);
      text(pans[2], 812, 418, '水', { 'font-size': 24, 'text-anchor': 'middle', fill: C.water, 'font-weight': 700 });
      const sp3 = sprout(pans[2], { leaves: true }), rt3 = sprout(pans[2], { color: ROOT, width: 5 });
      // (4) 向觸性
      el('rect', { x: 1076, y: 120, width: 14, height: 350, rx: 4, fill: '#a07850' }, pans[3]);
      el('path', { d: 'M 960,470 C 970,420 980,360 1000,300 C 1010,270 1012,240 1010,210', stroke: STEM, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, pans[3]);
      [[992, 340, 20], [1004, 262, 25]].forEach(([x, y, r]) => el('ellipse', { cx: x - 22, cy: y, rx: 24, ry: 11, fill: LEAF, transform: `rotate(${r} ${x} ${y})` }, pans[3]));
      let td = 'M 1002,316 C 1030,312 1050,300 1066,296';
      for (let i = 0; i <= 80; i++) { const t = i / 80, a = t * 6.283 * 3.5; td += ` L ${(1083 - 18 * Math.cos(a)).toFixed(1)},${(296 - t * 130 + 6 * Math.sin(a)).toFixed(1)}`; }
      const tend = el('path', { d: td, stroke: '#a8e080', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, pans[3]);
      const days2 = text(P2, 1160, 600, '', { 'font-size': 22, 'text-anchor': 'end', fill: C.hi });
      const def2 = g(P2, { opacity: 0 });
      text(def2, 40, 600, '向性：受到單一方向的刺激，朝向或背向刺激的方向生長', { 'font-size': 26, fill: C.ink, 'font-weight': 700 });
      text(def2, 40, 644, '是生長造成的彎曲，反應比較慢（數小時到數天＊）', { 'font-size': 22, fill: C.mute });
      const grow2 = (u) => {
        sp1.set(c1, 412, S.lerp(70, 210, u), -90, S.lerp(-90, -42, u));
        sp2.set(c2 + 16, 286, S.lerp(16, 112, u), 0, S.lerp(0, -88, S.clamp(u * 1.2)));
        rt2.set(c2 - 16, 294, S.lerp(16, 120, u), 180, S.lerp(180, 92, S.clamp(u * 1.2)));
        sp3.set(720, 172, 30 + 18 * u, -90, -90); // 莖短一點，避免葉子碰到標題
        rt3.set(720, 176, S.lerp(20, 250, u), 90, S.lerp(90, 25, S.smoothstep(0.2, 1, u)));
        days2.textContent = u > 0 ? `第 ${Math.max(1, Math.round(u * 5))} 天＊` : '';
      };
      grow2(0);
      tl.addLabel('s2');
      S.hide(tl, P1, 's2', 0.4);
      S.show(tl, P2, 's2+=0.3', 0.1);
      pans.forEach((p, i) => S.show(tl, p, `s2+=${0.4 + i * 0.3}`, 0.4));
      S.drive(tl, grow2, 3.6, 's2+=1.0', 'none');
      S.drawOn(tl, tend, 3.2, 's2+=1.2', 'none');
      S.show(tl, def2, 's2+=4.6', 0.5);

      // ===== 3 向光性的原因 =====
      // 左：莖彎曲部分的放大圖；右上：整株盆栽的縮圖（框起來的部分就是左邊放大的地方）。兩張圖的光都從右上方來
      const P3 = g(root, { opacity: 0 });
      el('rect', { x: 30, y: 30, width: 610, height: 670, rx: 18, ...FRAME }, P3);
      text(P3, 54, 72, '莖的上段放大（示意）＊', { 'font-size': 20, fill: C.mute });
      const B3 = [300, 698], W3 = 120, ROWS = 7;
      const hw = (s, L) => W3 / 2 - 22 * (s / L); // 莖往上逐漸變細
      // 彎曲的莖：中線長 L、曲率 k（往右彎）
      const pt = (s, d, L, k) => {
        if (Math.abs(k) < 1e-6) return [B3[0] - d, B3[1] - s];
        const th = k * s;
        const cx = (1 - Math.cos(th)) / k, cy = -Math.sin(th) / k;
        return [B3[0] + cx - d * Math.cos(th), B3[1] + cy - d * Math.sin(th)];
      };
      const ghost = el('path', { d: `M ${B3[0] - W3 / 2},${B3[1]} L ${B3[0] - W3 / 2 + 22},${B3[1] - 380} L ${B3[0] + W3 / 2 - 22},${B3[1] - 380} L ${B3[0] + W3 / 2},${B3[1]}`, stroke: '#4a6272', 'stroke-width': 2, 'stroke-dasharray': '8 8', fill: 'none' }, P3);
      const cellsL = [], cellsR = [];
      for (let i = 0; i < ROWS; i++) {
        cellsL.push(el('path', { d: '', fill: 'rgba(127,207,90,0.28)', stroke: STEM, 'stroke-width': 2.5 }, P3));
        cellsR.push(el('path', { d: '', fill: 'rgba(127,207,90,0.16)', stroke: STEM, 'stroke-width': 2.5 }, P3));
      }
      // 莖頂：兩片張開的幼葉（V 字、斜向上）＋中間的芽，看起來就是植物的頂端
      const leafD = (len) => `M 0,0 C ${len * 0.25},${-len * 0.3} ${len * 0.7},${-len * 0.3} ${len},0 C ${len * 0.7},${len * 0.26} ${len * 0.25},${len * 0.24} 0,0 Z`;
      const apex = g(P3);
      const apexLeaves = [[-1, -140], [1, -40]].map(([sd, ang]) => {
        const lg = g(apex);
        el('path', { d: leafD(110), fill: LEAF, stroke: '#9be07a', 'stroke-width': 2 }, lg);
        el('path', { d: 'M 6,0 Q 55,-4 100,0', fill: 'none', stroke: '#3f8f35', 'stroke-width': 2, 'stroke-linecap': 'round' }, lg); // 葉脈
        return [lg, sd, ang];
      });
      el('path', { d: 'M 0,6 C -18,-4 -17,-28 -5,-42 C -3,-26 1,-10 0,6 Z', fill: '#a8e080', stroke: STEM, 'stroke-width': 2 }, apex); // 芽（摺起來的小葉）
      el('path', { d: 'M 0,6 C 17,-6 16,-28 6,-38 C 4,-24 0,-10 0,6 Z', fill: '#8fd468', stroke: STEM, 'stroke-width': 2 }, apex);
      const quad = (L, k, s0, s1, d0, d1) => { const P = [pt(s0, d0 * hw(s0, L), L, k), pt(s0, d1 * hw(s0, L), L, k), pt(s1, d1 * hw(s1, L), L, k), pt(s1, d0 * hw(s1, L), L, k)]; return `M ${P.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L ')} Z`; };
      // 太陽：圓＋短光芒；再畫幾條朝向莖的光線
      const sun = (p, x, y, r, dir, len, n = 3) => {
        const sg = g(p);
        for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; el('line', { x1: x + Math.cos(a) * (r + 5), y1: y + Math.sin(a) * (r + 5), x2: x + Math.cos(a) * (r + 13), y2: y + Math.sin(a) * (r + 13), stroke: C.hi, 'stroke-width': 3, 'stroke-linecap': 'round' }, sg); }
        el('circle', { cx: x, cy: y, r, fill: C.hi }, sg);
        const [dx, dy] = dir, nx = -dy, ny = dx;
        for (let i = 0; i < n; i++) {
          const o = (i - (n - 1) / 2) * r * 1.1, x1 = x + dx * (r + 22) + nx * o, y1 = y + dy * (r + 22) + ny * o, x2 = x1 + dx * len, y2 = y1 + dy * len;
          el('line', { x1, y1, x2: x2 - dx * 8, y2: y2 - dy * 8, stroke: C.hi, 'stroke-width': 3, 'stroke-dasharray': '7 6', 'stroke-linecap': 'round' }, sg);
          el('path', { d: `M ${x2},${y2} L ${x2 - dx * 12 + nx * 6},${y2 - dy * 12 + ny * 6} L ${x2 - dx * 12 - nx * 6},${y2 - dy * 12 - ny * 6} Z`, fill: C.hi }, sg);
        }
        return sg;
      };
      sun(P3, 580, 136, 22, [-0.72, 0.69], 58);
      text(P3, 580, 86, '光', { 'font-size': 24, 'text-anchor': 'middle', fill: C.hi, 'font-weight': 700 });
      // 標示：引線的端點跟著細胞移動
      const l3a = g(P3, { opacity: 0 }), l3b = g(P3, { opacity: 0 });
      const lnA = el('line', { x1: 183, y1: 470, x2: 270, y2: 508, stroke: STEM, 'stroke-width': 2.5 }, l3a);
      const dtA = el('circle', { cx: 270, cy: 508, r: 6, fill: STEM, stroke: C.bg, 'stroke-width': 2 }, l3a);
      S.pill(l3a, 130, 470, '背光側', { size: 26, color: STEM, edge: STEM });
      text(l3a, 130, 520, '細胞伸長較多', { 'font-size': 22, 'text-anchor': 'middle' });
      text(l3a, 130, 550, '（生長較快）', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      const lnB = el('line', { x1: 487, y1: 606, x2: 330, y2: 606, stroke: C.hi, 'stroke-width': 2.5 }, l3b);
      const dtB = el('circle', { cx: 330, cy: 606, r: 6, fill: C.hi, stroke: C.bg, 'stroke-width': 2 }, l3b);
      S.pill(l3b, 540, 606, '向光側', { size: 26, color: C.hi, edge: C.hi });
      text(l3b, 540, 656, '細胞伸長較少', { 'font-size': 22, 'text-anchor': 'middle' });
      const setStem3 = (u) => {
        const L = S.lerp(380, 430, u), k = S.lerp(0, 0.62 / 430, u);
        for (let i = 0; i < ROWS; i++) {
          const s0 = (L * i) / ROWS, s1 = (L * (i + 1)) / ROWS;
          cellsL[i].setAttribute('d', quad(L, k, s0, s1, 1, 0));
          cellsR[i].setAttribute('d', quad(L, k, s0, s1, 0, -1));
        }
        // 莖頂跟著莖轉；葉子只轉一半，保持斜向上
        const th = (k * L * 180) / Math.PI, [mx, my] = pt(L, 0, L, k);
        apex.setAttribute('transform', `translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${th.toFixed(1)})`);
        apexLeaves.forEach(([lg, sd, ang]) => lg.setAttribute('transform', `translate(${sd * 8},6) rotate(${(ang - th * 0.5).toFixed(1)})`));
        const sA = L * 0.5, sB = (L * 1.5) / ROWS;
        const [pa, qa] = pt(sA, hw(sA, L) / 2, L, k), [pb, qb] = pt(sB, -hw(sB, L) / 2, L, k);
        lnA.setAttribute('x2', pa.toFixed(1)); lnA.setAttribute('y2', qa.toFixed(1)); dtA.setAttribute('cx', pa.toFixed(1)); dtA.setAttribute('cy', qa.toFixed(1));
        lnB.setAttribute('x2', pb.toFixed(1)); lnB.setAttribute('y2', qb.toFixed(1)); dtB.setAttribute('cx', pb.toFixed(1)); dtB.setAttribute('cy', qb.toFixed(1));
      };
      // 縮圖：整株盆栽，莖彎向右上方的太陽
      const ins3 = g(P3);
      el('rect', { x: 800, y: 30, width: 370, height: 440, rx: 18, ...FRAME }, ins3);
      text(ins3, 985, 458, '整株植物', { 'font-size': 20, 'text-anchor': 'middle', fill: C.mute });
      sun(ins3, 1112, 86, 18, [-0.74, 0.67], 34, 2);
      el('path', { d: 'M 912,384 L 1008,384 L 996,434 L 924,434 Z', fill: '#b0703c' }, ins3);
      el('rect', { x: 904, y: 374, width: 112, height: 14, rx: 4, fill: '#7a4a24' }, ins3);
      el('ellipse', { cx: 960, cy: 376, rx: 50, ry: 5, fill: SOIL }, ins3);
      const PB = [960, 376];
      const leaf3 = (x, y, ang, len) => el('path', { d: `M 0,0 C ${len * 0.25},-${len * 0.3} ${len * 0.7},-${len * 0.3} ${len},0 C ${len * 0.7},${len * 0.26} ${len * 0.25},${len * 0.24} 0,0 Z`, fill: LEAF, stroke: '#9be07a', 'stroke-width': 1.2, transform: `translate(${x},${y}) rotate(${ang})` }, ins3);
      // 葉子從莖斜向上長：右邊的葉用負角度、左邊的葉朝左上
      [[42, 56], [98, 42]].forEach(([s, len]) => { leaf3(PB[0], PB[1] - s, -35, len); leaf3(PB[0], PB[1] - s, -145, len); });
      const stem3 = el('path', { d: '', stroke: STEM, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, ins3);
      const apex3 = g(ins3);
      const apex3Leaves = [-140, -40].map((ang, i) => { const lg = g(apex3); el('path', { d: leafD(26), fill: LEAF, stroke: '#9be07a', 'stroke-width': 1 }, lg); return [lg, i ? 2 : -2, ang]; });
      el('path', { d: 'M -5,3 Q -6,-6 0,-13 Q 6,-6 5,3 Z', fill: '#a8e080' }, apex3);
      const setPlant = (u) => {
        const Ls = S.lerp(230, 250, u), arc = 110, k = (0.62 * u) / arc, s0 = Ls - arc;
        let d = `M ${PB[0]},${PB[1]} L ${PB[0]},${PB[1] - s0}`, x = PB[0], y = PB[1] - s0, a = 0;
        for (let i = 1; i <= 20; i++) { const ds = arc / 20; a = k * ds * i; x += Math.sin(k * ds * (i - 0.5)) * ds; y -= Math.cos(k * ds * (i - 0.5)) * ds; d += ` L ${x.toFixed(1)},${y.toFixed(1)}`; }
        stem3.setAttribute('d', d);
        const ad = (a * 180) / Math.PI;
        apex3.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ad.toFixed(1)})`);
        apex3Leaves.forEach(([lg, dx, ang]) => lg.setAttribute('transform', `translate(${dx},2) rotate(${(ang - ad * 0.5).toFixed(1)})`));
      };
      // 放大框與連到左邊放大圖的虛線
      const zoom3 = g(P3, { opacity: 0 });
      el('rect', { x: 900, y: 104, width: 124, height: 146, rx: 6, fill: 'none', stroke: '#cfe3ee', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, zoom3);
      [[900, 104, 640, 30], [900, 250, 640, 700]].forEach(([x1, y1, x2, y2]) => el('line', { x1, y1, x2, y2, stroke: '#8aa1ae', 'stroke-width': 2, 'stroke-dasharray': '6 7' }, zoom3));
      const grow3 = (u) => { setStem3(u); setPlant(u); };
      grow3(0);
      const res3 = g(P3, { opacity: 0 });
      text(res3, 830, 524, '兩側生長的速度不同', { 'font-size': 26, fill: C.ink, 'font-weight': 700 });
      text(res3, 830, 566, '→ 莖彎向光源', { 'font-size': 26, fill: C.hi, 'font-weight': 700 });
      text(res3, 830, 620, '葉子能照到更多光，', { 'font-size': 22, fill: C.ink2 });
      text(res3, 830, 652, '有利於進行光合作用', { 'font-size': 22, fill: C.ink2 });
      tl.addLabel('s3');
      S.hide(tl, P2, 's3', 0.4);
      S.show(tl, P3, 's3+=0.3', 0.4);
      S.show(tl, zoom3, 's3+=0.6', 0.4);
      S.drive(tl, grow3, 3, 's3+=1.0', 'power1.inOut');
      S.show(tl, l3a, 's3+=1.6', 0.4);
      S.show(tl, l3b, 's3+=2.2', 0.4);
      S.show(tl, res3, 's3+=3.6', 0.5);
      void ghost;

      // ===== 4 觸發運動 =====
      const P4 = g(root, { opacity: 0 });
      el('rect', { x: 40, y: 30, width: 540, height: 420, rx: 18, ...FRAME }, P4);
      el('rect', { x: 620, y: 30, width: 540, height: 420, rx: 18, ...FRAME }, P4);
      text(P4, 310, 74, '含羞草', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: STEM });
      text(P4, 310, 108, '被碰觸後，小葉合起、葉柄下垂', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      text(P4, 890, 74, '捕蠅草', { 'font-size': 30, 'text-anchor': 'middle', 'font-weight': 700, fill: STEM });
      text(P4, 890, 108, '昆蟲碰觸葉片內側的細毛，葉片合起', { 'font-size': 22, 'text-anchor': 'middle', fill: C.ink2 });
      // 含羞草
      el('line', { x1: 120, y1: 430, x2: 120, y2: 150, stroke: '#8a5a3a', 'stroke-width': 8, 'stroke-linecap': 'round' }, P4);
      const MB = [120, 330];
      const mim = S.place(g(P4), { x: MB[0], y: MB[1] });
      el('line', { x1: 0, y1: 0, x2: 120, y2: -110, stroke: '#7a9a3a', 'stroke-width': 6, 'stroke-linecap': 'round' }, mim);
      el('ellipse', { cx: 6, cy: -5, rx: 9, ry: 7, fill: '#9aba4a' }, mim);
      el('line', { x1: 120, y1: -110, x2: 380, y2: -110, stroke: '#7a9a3a', 'stroke-width': 4, 'stroke-linecap': 'round' }, mim);
      const leaflets = [];
      for (let k = 0; k < 13; k++) [-1, 1].forEach((sd) => {
        const lf = g(mim);
        el('ellipse', { cx: 0, cy: sd * 20, rx: 7, ry: 20, fill: LEAF, stroke: '#3f8a3a', 'stroke-width': 1 }, lf);
        leaflets.push({ g: lf, x: 140 + k * 18.5, sd, k });
      });
      const setMim = (fold, droop) => {
        leaflets.forEach(({ g: lf, x, sd, k }) => {
          const f = S.clamp(fold * 1.6 - (12 - k) * 0.05); // 從尖端開始合起
          lf.setAttribute('transform', `translate(${x.toFixed(1)},-110) rotate(${(sd * -62 * f).toFixed(1)})`);
        });
        S.place(mim, { x: MB[0], y: MB[1], r: 30 * droop });
      };
      setMim(0, 0);
      const finger = g(P4, { opacity: 0 });
      el('path', { d: 'M 540,170 C 520,180 506,196 500,210 C 496,220 506,226 514,220 L 548,196 Z', fill: C.skin }, finger);
      // 捕蠅草
      const VB = [890, 330];
      el('path', { d: `M ${VB[0]},430 C ${VB[0] - 6},400 ${VB[0] - 4},370 ${VB[0]},${VB[1]}`, stroke: '#5f9a3a', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, P4);
      const lobeD = 'M 0,0 C -40,-6 -86,-44 -96,-108 C -60,-96 -20,-60 0,0 Z';
      const lobes = [1, -1].map((sx) => {
        const lb = g(P4);
        el('path', { d: lobeD, fill: '#7fbf4a', stroke: '#c04a3a', 'stroke-width': 3 }, lb);
        el('path', { d: 'M -10,-18 C -40,-40 -66,-70 -80,-100', stroke: '#d9604a', 'stroke-width': 10, fill: 'none', opacity: 0.6 }, lb);
        for (let i = 0; i < 7; i++) { const t = 0.3 + i * 0.1, x = -96 * t - 4, y = -108 * t * t; el('line', { x1: x, y1: y, x2: x - 14, y2: y - 10, stroke: '#a8e080', 'stroke-width': 2.5 }, lb); }
        return { g: lb, sx };
      });
      const setTrap = (u) => lobes.forEach(({ g: lb, sx }) => lb.setAttribute('transform', `translate(${VB[0]},${VB[1]}) scale(${sx},1) rotate(${S.lerp(-18, 34, u).toFixed(1)})`));
      setTrap(0);
      const bug = g(P4);
      el('ellipse', { cx: 0, cy: 0, rx: 10, ry: 7, fill: '#2b2b2b' }, bug);
      [-1, 1].forEach((s) => el('ellipse', { cx: s * 6, cy: -8, rx: 6, ry: 9, fill: 'rgba(220,240,255,0.7)', transform: `rotate(${s * 30} ${s * 6} -8)` }, bug));
      const fast4 = g(P4, { opacity: 0 });
      S.pill(fast4, 310, 410, '幾秒內就完成', { size: 22, color: C.hi, edge: C.hi });
      S.pill(fast4, 890, 410, '很快就合起', { size: 22, color: C.hi, edge: C.hi });
      // 比較表
      const tb4 = g(P4, { opacity: 0 });
      el('rect', { x: 40, y: 476, width: 1120, height: 224, rx: 16, ...FRAME }, tb4);
      const COLS = [60, 300, 740];
      [['', '向性', '觸發運動'], ['反應快慢', '慢（數小時到數天＊）', '快（幾秒內＊）'], ['和刺激的方向', '有關（朝向或背向刺激）', '無關'], ['原因', '兩側生長的速度不同', '細胞內水分改變（補充）']].forEach((r, i) => {
        const y = 516 + i * 52;
        r.forEach((s, j) => text(tb4, COLS[j], y, s, { 'font-size': 24, fill: i === 0 ? [C.ink, STEM, C.hi][j] : j === 0 ? C.mute : C.ink, 'font-weight': i === 0 || j > 0 ? 700 : 400 }));
        if (i > 0) el('line', { x1: 56, y1: y - 34, x2: 1144, y2: y - 34, stroke: '#2b4252', 'stroke-width': 1.5 }, tb4);
      });
      tl.addLabel('s4');
      S.hide(tl, P3, 's4', 0.4);
      S.show(tl, P4, 's4+=0.3', 0.4);
      S.show(tl, finger, 's4+=0.7', 0.3);
      S.drive(tl, (u) => setMim(u, S.smoothstep(0.5, 1, u)), 1.6, 's4+=1.1', 'power1.out');
      tl.fromTo(finger, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 's4+=1.3');
      S.drive(tl, (u) => { const x = S.lerp(1080, VB[0], u), y = S.lerp(160, 270, u) - Math.sin(u * Math.PI) * 40; bug.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`); }, 1.2, 's4+=0.7', 'power1.inOut');
      bug.setAttribute('transform', 'translate(1080,160)');
      S.drive(tl, setTrap, 0.3, 's4+=2.0', 'power3.in');
      tl.fromTo(bug, { opacity: 1 }, { opacity: 0.25, duration: 0.2, immediateRender: false }, 's4+=2.3');
      S.show(tl, fast4, 's4+=2.8', 0.4);
      S.show(tl, tb4, 's4+=3.4', 0.5);

      return {
        tl,
        notes: [
          '＊小黑猩猩會在一旁觀察成年黑猩猩用樹枝「釣」白蟻，再經過多次練習才學會。',
          '＊這些行為能幫助動物取得食物、躲避天敵、找到配偶和照顧後代，有利於生存和繁殖。',
          '＊示意：天數和彎曲的程度都是示意。莖對重力的反應是向上生長，稱為「背地性」；有些教材也提到根的「背光性」。',
          '＊示意：細胞畫得很大、數量很少。兩側生長快慢不同，和植物體內的激素分布不平均有關（補充：這種激素稱為生長素，高中才會學）。',
          '＊含羞草碰觸後，一段時間會再慢慢張開。有些教材把這類反應稱為「觸發運動」，也有教材（例如均一）的單元名稱用「局部感應」；捕蠅草的反應也稱為捕蟲運動。',
        ],
        steps: [
          '動物的行為可分為兩種：<b>本能行為</b>生下來就會，例如蜘蛛結網、嬰兒吸吮；<b>學習行為</b>要經過<b>經驗</b>或<b>練習</b>才會，例如狗聽口令坐下、黑猩猩用樹枝取白蟻。',
          '動物的行為能幫助<b>生存</b>和<b>繁殖</b>：例如<b>覓食</b>、<b>躲避敵害</b>、<b>求偶</b>和<b>育幼</b>。',
          '植物沒有神經，也能對環境產生感應。受到<b>單一方向</b>的刺激，朝向或背向刺激的方向<b>生長</b>，稱為<b>向性</b>：莖的<b>向光性</b>、根的<b>向地性</b>、<b>向水性</b>、卷鬚的<b>向觸性</b>。',
          '莖為什麼會向光彎曲？光從一側照過來時，莖<b>背光的一側</b>生長得比較快（細胞伸長較多），莖就彎向<b>光源</b>，葉子能照到更多光。',
          '<b>含羞草</b>被碰觸後，小葉很快合起、葉柄下垂；<b>捕蠅草</b>被昆蟲碰觸，葉片迅速合起。這類反應很<b>快</b>，方向和刺激的方向<b>無關</b>，稱為<b>觸發運動</b>。',
        ],
      };
    },
  });
})();
