/* 場景 1：尺度之旅 — 人 → 胃 → 胃壁 → 細胞 → 細胞核 → DNA（連續放大） */
(() => {
  const { el, g, text, C } = S;

  S.register({
    id: 'scale', section: '2-3', title: '尺度之旅',
    build(root) {
      const W = S.scaleWorld(root, 'sc1');
      const { levels, huds, LV, zoom, extras, setSize, ladderY } = W;

      // ×1000 括號（總結用）
      const brackets = g(root, { opacity: 0 });
      [[1, 1e-3], [1e-3, 1e-6], [1e-6, 1e-9]].forEach(([a, b]) => {
        const y1 = ladderY(a), y2 = ladderY(b);
        el('path', { d: `M1062,${y1 + 3} h12 V${y2 - 3} h-12`, fill: 'none', stroke: C.hi, 'stroke-width': 3 }, brackets);
        text(brackets, 1084, (y1 + y2) / 2 + 8, '×1000', { 'font-size': 22, fill: C.hi, class: 'mono', 'font-weight': 700 });
      });
      const ratio = S.pill(g(root, { opacity: 0 }), W.CX, W.VP.y + W.VP.h - 44, '1.6 m ÷ 2 nm ＝ 8 億倍', { size: 30, color: C.hi, edge: C.hi });

      const tl = gsap.timeline({ paused: true });

      tl.addLabel('s0');
      S.drive(tl, () => setSize(LV[0].size), 0.01, 's0');
      tl.fromTo(levels[0].wrap, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 's0');
      S.show(tl, huds[0], 's0+=0.4');
      S.show(tl, levels[0].dim, 's0+=0.9', 0.6);

      for (let i = 0; i < 5; i++) {
        const L = 's' + (i + 1), A = levels[i], B = levels[i + 1];
        tl.addLabel(L);
        tl.fromTo(A.ring, { opacity: 0, scale: 1.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, L);
        S.hide(tl, [huds[i], ...extras(A)], L + '+=0.3', 0.4);
        S.hide(tl, A.ring, L + '+=0.75', 0.3);
        S.drive(tl, zoom(i), 2.6, L + '+=0.7', 'power2.inOut');
        S.show(tl, huds[i + 1], L + '+=3.2');
        extras(B).forEach((e, k) => S.show(tl, e, `${L}+=${3.4 + k * 0.35}`, 0.5));
      }

      // 總結：一路倒回去
      tl.addLabel('s6');
      S.hide(tl, [huds[5], ...extras(levels[5])], 's6', 0.3);
      for (let i = 4; i >= 0; i--) {
        const fn = zoom(i), o = { u: 1 };
        tl.fromTo(o, { u: 1 }, { u: 0, duration: 0.7, ease: 'power1.inOut', immediateRender: false, onUpdate: () => fn(o.u) }, `s6+=${0.3 + (4 - i) * 0.7}`);
      }
      S.show(tl, huds[0], 's6+=3.9');
      S.show(tl, brackets, 's6+=4.1', 0.6);
      tl.fromTo(brackets.children, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.12 }, 's6+=4.1');
      S.show(tl, ratio.parentNode, 's6+=4.6', 0.6);
      tl.to({}, { duration: 0.6 });

      return {
        tl,
        notes: [
          '＊約略值，身高依個人而不同。',
          '＊約略值，胃的大小依個人和吃了多少而不同。',
          '＊約略值，胃壁的厚度依部位而不同。',
          '＊約略值，細胞的大小依種類而不同。',
          '＊約略值，依細胞種類而不同。',
          '＊約略值。',
          '＊用約略值估算：1.6 m ÷ 2 nm ＝ 8 億。1 m = 1000 mm，1 mm = 1000 μm，1 μm = 1000 nm。',
        ],
        steps: [
          '從一位國中生出發：身高約 <b>1.6 m</b>＊，是一個完整的<b>個體</b>。胃在上腹部偏左。',
          '放大到胃：寬約 <b>15 cm</b>＊，是一個<b>器官</b>，用肉眼就看得到。',
          '放大胃壁（厚約 3 mm＊）：切面上有一層層不同的<b>組織</b>，要用顯微鏡才看得清楚。',
          '組織由許多<b>細胞</b>排列而成。一個細胞高約 <b>25 μm</b>＊（0.025 mm），40 個疊起來才有 1 mm。',
          '細胞裡還有更小的構造：<b>細胞核</b>寬約 5 μm＊，用光學顯微鏡就看得到；<b>粒線體</b>約 1～2 μm＊，要用電子顯微鏡才看得清楚。',
          '再放大到分子：<b>DNA</b> 寬約 <b>2 nm</b>＊，要用<b>電子顯微鏡</b>才看得到；水分子（約 0.3 nm＊）還更小。',
          '倒回來看，人的身高約是 DNA 寬度的 8 億倍＊。m、mm、μm、nm 之間每次差 <b>1000 倍</b>。',
        ],
      };
    },
  });
})();
