/* 互動模型 B：擴散與滲透實驗室
   分子實驗：粒子做隨機運動（布朗運動），可調隔板、溶質大小、兩側數量、溫度。
   細胞實驗：紅血球／植物細胞放進不同濃度的溶液，體積依濃度差變化。
   任務：預測 → 實驗 → 比對結果 → （不對就調整再試）→ 下一個。 */
(() => {
  const K = {
    bg: '#0d1822', box: '#132433', edge: '#3b5466', ink: '#e8f0f2', mute: '#8aa1ae',
    water: '#5fb8ff', small: '#c9a8ff', large: '#ffcf5c', membrane: '#63d4bf', L: '#3987e5', R: '#d95926', na: '#ff9fb1', cl: '#7fe0a0',
    wall: '#d9c27c', rbc: '#c43a4f', nucleus: '#a796ff', chloro: '#6fce62', vac: '#62a8ff',
  };
  const W = 960, H = 540;

  // 溫度 → 擴散快慢（依水的黏度隨溫度變化估算，25 °C = 1）
  const visc = (T) => 2.414e-5 * Math.pow(10, 247.8 / (T + 273.15 - 140));
  const dFactor = (T) => ((T + 273.15) / 298.15) * (visc(25) / visc(T));
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  // ================= 分子實驗 =================
  function MolSim() {
    const X0 = 30, X1 = 930, YT = 64, YB = 510, XM = 480, NW = 200, H0 = 240, KPI = 2, KJ = 7.5, TAU = 0.12;
    // 擴散係數（px²/s）。1 px ≈ 0.36 μm 時，換算成真實值：水 2.6、氧 1.8、蔗糖 0.45、鈉離子 1.2、氯離子 1.8（×10⁻⁹ m²/s），
    // 和實測值（水 2.3、氧 2.1、蔗糖 0.52、鈉 1.33、氯 2.03）接近，所以「分子擴散」是真實速度。
    const D = { w: 20000, s: 14000, L: 3500, na: 9300, cl: 14200 }, RAD = { w: 3, s: 6, L: 10, na: 5, cl: 5 };
    const sim = { cfg: { membrane: 'none', solute: 'small', nL: 40, nR: 0, T: 25 }, parts: [], t: 0, hist: [], lv: [H0, H0], vol: [NW / 2, NW / 2], lastRec: -1 };
    sim.M_PER_PX = 3.6e-7; // 整個容器寬 900 px ≈ 0.32 mm
    const passes = (k) => k === 'w' || k === 's'; // 半透膜：水和小分子（像氧）可以通過；蔗糖、離子不行
    const surface = (side) => YB - sim.lv[side];
    const counts = () => {
      const c = { sL: 0, sR: 0, wL: 0, wR: 0, iL: 0, iR: 0 }; // i＝過不了膜的溶質粒子
      for (const p of sim.parts) {
        const left = p.x < XM;
        if (p.k === 'w') left ? c.wL++ : c.wR++;
        else { left ? c.sL++ : c.sR++; if (!passes(p.k)) left ? c.iL++ : c.iR++; }
      }
      return c;
    };
    sim.counts = counts;
    sim.reset = (cfg) => {
      Object.assign(sim.cfg, cfg || {});
      const { nL, nR, solute } = sim.cfg;
      sim.parts = []; sim.t = 0; sim.hist = []; sim.lastRec = -1; sim.lv = [H0, H0]; sim.vol = [NW / 2, NW / 2]; sim.fracR = 0;
      const add = (k, side) => {
        const r = RAD[k], xa = side ? XM + 8 + r : X0 + r, xb = side ? X1 - r : XM - 8 - r;
        sim.parts.push({ k, x: xa + Math.random() * (xb - xa), y: YB - r - Math.random() * (H0 - 2 * r), vx: 0, vy: 0 });
      };
      for (let i = 0; i < NW; i++) add('w', i % 2);
      if (solute === 'mix') {
        // 左邊蔗糖、右邊食鹽：每份食鹽（NaCl）在水中分成鈉離子和氯離子兩個粒子
        for (let i = 0; i < nL; i++) add('L', 0);
        for (let i = 0; i < nR; i++) { add('na', 1); add('cl', 1); }
      } else {
        const sk = solute === 'small' ? 's' : 'L';
        for (let i = 0; i < nL; i++) add(sk, 0);
        for (let i = 0; i < nR; i++) add(sk, 1);
      }
      record(true);
    };
    function record(force) {
      if (!force && sim.t - sim.lastRec < 0.25) return;
      sim.lastRec = sim.t;
      const c = counts();
      sim.hist.push({ t: sim.t, sL: c.sL, sR: c.sR, wL: (sim.vol[0] / NW) * 100, wR: (sim.vol[1] / NW) * 100 });
    }
    sim.step = (dt) => {
      const semi = sim.cfg.membrane === 'semi', f = dFactor(sim.cfg.T);
      for (const p of sim.parts) {
        const r = RAD[p.k], amp = Math.sqrt(2 * D[p.k] * f) / TAU;
        p.vx += (-p.vx / TAU) * dt + amp * Math.sqrt(dt) * gauss();
        p.vy += (-p.vy / TAU) * dt + amp * Math.sqrt(dt) * gauss();
        const ox = p.x;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (semi && (ox < XM) !== (p.x < XM)) {
          const from = ox < XM ? 0 : 1;
          // 水分子也會隨機穿過膜（兩個方向都有）；水位則由下面的「淨水流」決定
          const ok = passes(p.k) && (p.k !== 'w' || Math.random() < 0.15);
          const yTop = surface(1 - from) + r;
          if (!ok || p.y < yTop) { p.x = from ? XM + 6 + r : XM - 6 - r; p.vx = -p.vx * 0.5; }
        }
        if (p.x < X0 + r) { p.x = X0 + r; p.vx = Math.abs(p.vx); }
        if (p.x > X1 - r) { p.x = X1 - r; p.vx = -Math.abs(p.vx); }
        const top = semi ? surface(p.x < XM ? 0 : 1) + r : YB - H0 + r;
        if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); }
        if (p.y > YB - r) { p.y = YB - r; p.vy = -Math.abs(p.vy); }
      }
      // 滲透：淨水流 J ∝（兩邊滲透壓差 − 水位差造成的壓力）。
      // 滲透壓只看「過不了膜的溶質粒子」濃度（粒子數 ÷ 水量）；這些粒子留在原來那一邊，數量固定，
      // 所以 J 是平順的，水位只會朝一個方向變化，不會被分子的隨機漲落帶著忽高忽低。
      // 這一項的速度有加快：真實的 U 形管要幾十分鐘以上，水位差也會大得多。
      if (semi) {
        const c = counts();
        const half = NW / 2, pi = (n, w) => (KPI * n) / Math.max(1, w);
        const J = KJ * f * (pi(c.iL, sim.vol[0]) - pi(c.iR, sim.vol[1]) - (sim.vol[0] - sim.vol[1]) / half);
        sim.vol[0] += J * dt; sim.vol[1] -= J * dt;
        // 畫面上的水分子跟著水量走：哪一邊的水分子比水量多一個以上，就讓靠近膜的一個移到另一邊
        for (let guard = 0; guard < 4; guard++) {
          const cw = counts(), d = cw.wL - sim.vol[0];
          if (Math.abs(d) < 1) break;
          const toLeft = d < 0, yMin = surface(toLeft ? 0 : 1) + 3;
          let best = null, bd = 1e9;
          for (const p of sim.parts) if (p.k === 'w' && (p.x < XM) !== toLeft && p.y > yMin) { const dd = Math.abs(p.x - XM); if (dd < bd) { bd = dd; best = p; } }
          if (!best) break;
          best.x = toLeft ? XM - 10 : XM + 10; best.vx = toLeft ? -Math.abs(best.vx) : Math.abs(best.vx);
        }
      }
      // 水位由水量決定
      for (let s = 0; s < 2; s++) sim.lv[s] = semi ? Math.min(YB - YT - 6, (H0 * sim.vol[s]) / (NW / 2)) : H0;
      const c2 = counts();
      // 右邊溶質比例的平滑值（減少隨機漲落，用來計時）
      if (c2.sL + c2.sR) sim.fracR += (c2.sR / (c2.sL + c2.sR) - sim.fracR) * Math.min(1, dt / 0.6);
      sim.t += dt;
      record(false);
    };
    // k = 畫布座標 ÷ 螢幕像素。畫面縮得很小時（k 大），放大主要標籤、省略長說明（下方文字備註仍有）
    sim.draw = (g, k = 1) => {
      const f = Math.min(1.9, Math.max(1, k / 1.5)), narrow = k > 1.6;
      // 小字的最小字級：筆電上畫布約縮成 0.75 倍，小字放大到畫面上約 14.5 px（和互動舞台的最小字級差不多）；窄螢幕另外用 f 放大
      const fs = (b) => Math.max(b, narrow ? 0 : 14.5 * k);
      const semi = sim.cfg.membrane === 'semi';
      g.fillStyle = K.bg; g.fillRect(0, 0, W, H);
      g.fillStyle = K.box; g.strokeStyle = K.edge; g.lineWidth = 3;
      g.beginPath(); g.roundRect(X0 - 6, YT - 30, X1 - X0 + 12, YB - YT + 36, 14); g.fill(); g.stroke();
      for (let s = 0; s < 2; s++) {
        const xa = s ? XM : X0, xb = s ? X1 : XM, y = semi ? surface(s) : YB - H0;
        g.fillStyle = 'rgba(95,184,255,0.16)'; g.fillRect(xa, y, xb - xa, YB - y);
        g.strokeStyle = 'rgba(95,184,255,0.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(xa, y); g.lineTo(xb, y); g.stroke();
      }
      if (semi) {
        g.fillStyle = K.membrane;
        for (let y = YT - 26; y < YB; y += 34) { g.beginPath(); g.roundRect(XM - 5, y, 10, 22, 4); g.fill(); }
      }
      for (const p of sim.parts) {
        if (p.k === 'w') { g.fillStyle = 'rgba(95,184,255,0.85)'; g.beginPath(); g.arc(p.x, p.y, 3, 0, 6.283); g.fill(); }
        else if (p.k === 's') { g.fillStyle = K.small; g.beginPath(); g.arc(p.x, p.y, 6, 0, 6.283); g.fill(); }
        else if (p.k === 'na' || p.k === 'cl') {
          g.fillStyle = p.k === 'na' ? K.na : K.cl; g.beginPath(); g.arc(p.x, p.y, 5.5, 0, 6.283); g.fill();
          g.strokeStyle = '#0d1822'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(p.x - 3, p.y); g.lineTo(p.x + 3, p.y);
          if (p.k === 'na') { g.moveTo(p.x, p.y - 3); g.lineTo(p.x, p.y + 3); }
          g.stroke();
        } else {
          g.strokeStyle = K.large; g.lineWidth = 3; g.beginPath();
          for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; g[i ? 'lineTo' : 'moveTo'](p.x + Math.cos(a) * 9, p.y + Math.sin(a) * 9); }
          g.closePath(); g.stroke();
        }
      }
      g.font = `700 ${22 * f}px "Noto Sans TC", sans-serif`; g.textAlign = 'center';
      [['左邊', (X0 + XM) / 2, K.L], ['右邊', (XM + X1) / 2, K.R]].forEach(([n, x, col]) => {
        g.fillStyle = col; g.beginPath(); g.roundRect(x - 34 * f, 6, 68 * f, 30 * f, 15 * f); g.fill();
        g.fillStyle = '#ffffff'; g.fillText(n, x, 6 + 22 * f);
      });
      g.textAlign = 'right'; g.font = `500 ${fs(18 * f)}px "JetBrains Mono", monospace`; g.fillStyle = K.mute;
      const osmo = semi && sim.cfg.solute !== 'small';
      // 窄螢幕：時間改放左上角，避免和「右邊」標籤、比例尺擠在一起
      if (narrow) g.textAlign = 'left';
      g.fillText(`${sim.t.toFixed(1)} 秒${osmo ? '＊' : ''}`, narrow ? X0 - 4 : X1, 6 + 22 * f);
      // 比例尺：0.1 mm
      const bar = 1e-4 / sim.M_PER_PX, bx = X1 - 22, by = narrow ? YT + 34 + 17 * f : YT + 18;
      g.strokeStyle = K.ink; g.lineWidth = 3; g.beginPath();
      g.moveTo(bx - bar, by - 7); g.lineTo(bx - bar, by + 7); g.moveTo(bx - bar, by); g.lineTo(bx, by); g.moveTo(bx, by - 7); g.lineTo(bx, by + 7); g.stroke();
      g.textAlign = 'center'; g.fillStyle = K.ink; g.font = `700 ${fs(17 * f)}px "JetBrains Mono", monospace`;
      g.fillText('0.1 mm', bx - bar / 2, by - 12);
      if (!narrow) {
        // 字放大後比比例尺寬，改成靠右對齊比例尺的右端，才不會超出容器
        const nf = fs(15);
        g.font = `500 ${nf}px "Noto Sans TC", sans-serif`; g.fillStyle = K.mute; g.textAlign = 'right';
        g.fillText('容器寬約 0.32 mm・分子擴散為真實速度', bx, by + 10 + nf);
        if (osmo) { g.fillStyle = K.large; g.fillText('＊示意時間：水位變化已加快', bx, by + 18 + nf * 2.3); }
      }
      if (semi) { const mf = fs(16 * f); g.textAlign = 'center'; g.fillStyle = K.membrane; g.font = `500 ${mf}px "Noto Sans TC", sans-serif`; g.fillText('半透膜', XM, Math.min(H - 3, YB + 8 + mf * 0.9)); }
    };
    return sim;
  }

  // ================= 細胞實驗 =================
  function CellSim() {
    // 體積變化速率（每秒）。紅血球的水通道多，真實在清水中幾秒內就脹大、破裂，模擬約 3 秒；
    // 植物細胞真實要數十秒到幾分鐘才看得到細胞膜和細胞壁分開，這裡加快了（畫面標示「示意時間」）。
    const CX = 480, CY = 285, KR = { rbc: 0.25, plant: 0.08 };
    const sim = { cfg: { cell: 'rbc', cout: 1 }, V: 1, t: 0, burst: 0, hist: [], dots: [], lastRec: -1, salt: [] };
    for (let i = 0; i < 160; i++) sim.salt.push([20 + Math.random() * 920, 20 + Math.random() * 500, Math.random() * 6.28]);
    sim.reset = (cfg) => {
      Object.assign(sim.cfg, cfg || {});
      sim.V = 1; sim.t = 0; sim.burst = 0; sim.hist = []; sim.dots = []; sim.lastRec = -1;
      sim.hist.push({ t: 0, v: 100 });
    };
    const flow = () => {
      const cin = 1 / sim.V, wall = sim.cfg.cell === 'plant' ? 40 * Math.max(0, sim.V - 1) : 0;
      return cin - sim.cfg.cout - wall;
    };
    sim.flow = flow;
    sim.step = (dt) => {
      if (!sim.burst) {
        sim.V += KR[sim.cfg.cell] * flow() * dt;
        sim.V = Math.max(0.25, sim.V);
        if (sim.cfg.cell === 'rbc' && sim.V >= 1.55) sim.burst = sim.t || 0.01;
        // 水分子進出（兩個方向都有，淨方向看濃度差）
        const net = flow(), rIn = 5 * (1 + Math.max(0, net) * 3), rOut = 5 * (1 + Math.max(0, -net) * 3);
        if (Math.random() < rIn * dt) sim.dots.push({ a: Math.random() * 6.283, dir: 1, t0: sim.t });
        if (Math.random() < rOut * dt) sim.dots.push({ a: Math.random() * 6.283, dir: -1, t0: sim.t });
      }
      sim.dots = sim.dots.filter((d) => sim.t - d.t0 < 0.9);
      sim.t += dt;
      if (sim.t - sim.lastRec >= 0.2) { sim.lastRec = sim.t; sim.hist.push({ t: sim.t, v: sim.V * 100 }); }
    };
    sim.state = () => {
      const V = sim.V;
      if (sim.cfg.cell === 'rbc') {
        if (sim.burst) return { key: 'burst', text: '紅血球吸水脹大，最後脹破了' };
        if (V > 1.07) return { key: 'swell', text: '紅血球吸水脹大' };
        if (V < 0.93) return { key: 'shrink', text: '紅血球失水皺縮' };
        return { key: 'same', text: '紅血球維持原來的形狀' };
      }
      if (V < 0.85) return { key: 'plasmo', text: '細胞失水，細胞膜和細胞壁分開了' };
      if (V > 1.003) return { key: 'turgid', text: '細胞吸水變飽滿，細胞壁撐住，不會破' };
      if (V < 0.98) return { key: 'shrink', text: '細胞開始失水' };
      return { key: 'same', text: '細胞大致維持原狀' };
    };
    sim.draw = (g, k = 1) => {
      const f = Math.min(1.9, Math.max(1, k / 1.5)), narrow = k > 1.6;
      const fs = (b) => Math.max(b, narrow ? 0 : 14.5 * k); // 小字的最小字級（同上）
      const { cell, cout } = sim.cfg;
      g.fillStyle = K.bg; g.fillRect(0, 0, W, H);
      g.fillStyle = `rgba(95,184,255,${0.1 + 0.02 * (3 - Math.min(3, cout))})`; g.fillRect(14, 14, W - 28, H - 28);
      const ns = Math.round(Math.min(3, cout) * 50);
      g.fillStyle = 'rgba(242,245,247,0.55)';
      for (let i = 0; i < ns; i++) { const [x, y, a] = sim.salt[i]; g.save(); g.translate(x, y); g.rotate(a); g.fillRect(-3, -3, 6, 6); g.restore(); }
      const V = sim.V;
      let rx, ry; // 細胞膜位置（水分子進出用）
      if (cell === 'rbc') {
        const R = 115 * Math.sqrt(V);
        rx = ry = R;
        if (sim.burst) {
          const k = Math.min(1, (sim.t - sim.burst) / 1.5);
          const grd = g.createRadialGradient(CX, CY, 10, CX, CY, R * (1 + k * 1.2));
          grd.addColorStop(0, `rgba(196,58,79,${0.55 * (1 - k * 0.5)})`); grd.addColorStop(1, 'rgba(196,58,79,0)');
          g.fillStyle = grd; g.beginPath(); g.arc(CX, CY, R * (1 + k * 1.2), 0, 6.283); g.fill();
          g.strokeStyle = '#ff8094'; g.lineWidth = 4;
          for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.2, rr = R * (1 + k * 0.5); g.beginPath(); g.arc(CX + Math.cos(a) * k * 30, CY + Math.sin(a) * k * 30, rr, a, a + 0.5); g.stroke(); }
        } else {
          const amp = S.clamp((0.97 - V) * 0.45, 0, 0.14);
          g.beginPath();
          for (let i = 0; i <= 96; i++) { const a = (i / 96) * 6.283, r = R * (1 + amp * Math.cos(12 * a)); g[i ? 'lineTo' : 'moveTo'](CX + Math.cos(a) * r, CY + Math.sin(a) * r); }
          g.closePath(); g.fillStyle = K.rbc; g.fill(); g.strokeStyle = '#ff8094'; g.lineWidth = 4; g.stroke();
          const pal = S.clamp((1.3 - V) / 0.3, 0, 1);
          g.fillStyle = `rgba(232,110,132,${0.75 * pal})`; g.beginPath(); g.arc(CX, CY, R * 0.4, 0, 6.283); g.fill();
        }
      } else {
        const ww = 400, wh = 290;
        g.strokeStyle = K.wall; g.lineWidth = 16; g.beginPath(); g.roundRect(CX - ww / 2, CY - wh / 2, ww, wh, 30); g.stroke();
        const s = Math.sqrt(Math.min(1, V)), mw = (ww - 26) * s, mh = (wh - 26) * s;
        const pts = S.rectPts(CX, CY, mw, mh, 24 + (1 - s) * 90, 48);
        g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.closePath();
        g.fillStyle = '#17363d'; g.fill(); g.strokeStyle = K.membrane; g.lineWidth = 4; g.stroke(); // 細胞質不透明：外液的鹽不會畫進細胞裡
        const vv = Math.min(1.04, V);
        g.fillStyle = 'rgba(98,168,255,0.35)'; g.strokeStyle = K.vac; g.lineWidth = 2;
        g.beginPath(); g.ellipse(CX + 20 * s, CY + 5, Math.max(10, 140 * vv * s - 20 * (1 - vv)), Math.max(8, 85 * vv * s - 10 * (1 - vv)), 0, 0, 6.283); g.fill(); g.stroke();
        g.fillStyle = '#4b3d86'; g.strokeStyle = K.nucleus; g.beginPath(); g.arc(CX - mw / 2 + 42 * s + 8, CY - mh / 2 + 42 * s + 8, 26 * Math.max(0.7, s), 0, 6.283); g.fill(); g.stroke();
        g.fillStyle = '#2f7a2a'; g.strokeStyle = K.chloro;
        [[0.25, -1], [0.55, -1], [0.8, -1], [0.3, 1], [0.7, 1]].forEach(([fx, sy]) => {
          const x = CX - mw / 2 + mw * fx, y = CY + sy * (mh / 2 - 16 * s);
          g.beginPath(); g.ellipse(x, y, 20 * s + 4, 9 * s + 2, 0, 0, 6.283); g.fill(); g.stroke();
        });
        rx = mw / 2; ry = mh / 2;
        const lf = fs(18 * f);
        g.font = `500 ${lf}px "Noto Sans TC", sans-serif`; g.textAlign = 'left';
        g.fillStyle = K.wall; g.fillText('細胞壁', CX + ww / 2 + 16, CY - wh / 2 + 10);
        g.fillStyle = K.membrane; g.fillText('細胞膜', CX + ww / 2 + 16, CY - wh / 2 + 10 + Math.max(26 * f, lf * 1.35));
      }
      // 水分子進出
      g.fillStyle = K.water;
      for (const d of sim.dots) {
        const k = (sim.t - d.t0) / 0.9, f = d.dir > 0 ? 1.35 - k * 0.6 : 0.75 + k * 0.6;
        g.globalAlpha = Math.sin(Math.PI * k);
        g.beginPath(); g.arc(CX + Math.cos(d.a) * rx * f, CY + Math.sin(d.a) * ry * f, 4, 0, 6.283); g.fill();
      }
      g.globalAlpha = 1;
      g.font = '500 18px "JetBrains Mono", monospace'; g.textAlign = 'right'; g.fillStyle = K.mute;
      const note = narrow ? '' : cell === 'rbc' ? '＊示意時間（真實也在幾秒內）' : '＊示意時間（已加快）';
      // 時間和說明的底框：依放大後的字算大小
      const tf = fs(18 * f), nf = fs(15), tStr = `${sim.t.toFixed(1)} 秒＊`;
      g.font = `500 ${nf}px "Noto Sans TC", sans-serif`;
      const noteW = note ? g.measureText(note).width : 0;
      g.font = `500 ${tf}px "JetBrains Mono", monospace`;
      const nw = Math.max(noteW, g.measureText(tStr).width, 90 * f) + 20, tY = 22 + Math.max(20 * f, tf * 1.05);
      g.fillStyle = 'rgba(13,24,34,0.88)'; g.beginPath(); g.roundRect(W - 28 - nw + 10, 20, nw, note ? tY - 20 + nf * 1.75 : Math.max(34 * f, tf * 1.6), 10); g.fill();
      g.fillStyle = K.mute;
      g.fillText(tStr, W - 28, tY);
      if (note) { g.font = `500 ${nf}px "Noto Sans TC", sans-serif`; g.fillText(note, W - 28, tY + nf * 1.25); }
    };
    return sim;
  }

  // ================= 折線圖（SVG） =================
  function Chart(fig, { title, series, yMax, unit, ref }) {
    // 尺寸跟著根字級（rem）走：大螢幕字大、圖也高；小螢幕反之
    let VW = 520, VH = 170, M = { l: 34, r: 44, t: 10, b: 24 }, R = 16;
    fig.innerHTML = `<figcaption><span>${title}</span>${series.length > 1 ? `<span class="legend">${series.map((s) => `<span style="--c:var(${s.color})">${s.label}</span>`).join('')}</span>` : ''}</figcaption>
      <div class="chart"><svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${title}隨時間變化"></svg></div><div class="tip" hidden></div>`;
    const svg = fig.querySelector('svg'), tip = fig.querySelector('.tip');
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, a, p = svg) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    let data = [], xMax = 20, yTop = yMax;
    const X = (t) => M.l + (t / xMax) * (VW - M.l - M.r), Y = (v) => VH - M.b - (v / yTop) * (VH - M.t - M.b);
    const gGrid = mk('g', {}), gLines = mk('g', {}), gEnd = mk('g', {}), hair = mk('line', { stroke: 'var(--muted)', 'stroke-width': 1, opacity: 0, y1: M.t, y2: VH - M.b });
    const hit = mk('rect', { x: M.l, y: M.t, width: VW - M.l - M.r, height: VH - M.t - M.b, fill: 'transparent' });
    const paths = series.map((s) => mk('path', { fill: 'none', stroke: `var(${s.color})`, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gLines));
    function draw(d, yMaxNow, xUnit = '秒') {
      data = d; if (yMaxNow) yTop = yMaxNow;
      // 依實際寬度與根字級設定座標，讓字和線保持原本的螢幕大小
      R = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      VH = Math.round(R * 10.5); M = { l: R * 2.3, r: R * 2.9, t: R * 0.6, b: R * 1.6 };
      const w = Math.round(svg.getBoundingClientRect().width) || VW;
      VW = w; svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      for (const [k, v] of Object.entries({ x: M.l, y: M.t, width: VW - M.l - M.r, height: VH - M.t - M.b })) hit.setAttribute(k, v);
      hair.setAttribute('y1', M.t); hair.setAttribute('y2', VH - M.b);
      const tEnd = d.length ? d[d.length - 1].t : 0;
      xMax = Math.max(20, Math.ceil(tEnd / 10) * 10);
      gGrid.innerHTML = '';
      [0, 0.5, 1].forEach((f) => {
        const v = yTop * f, y = Y(v);
        mk('line', { x1: M.l, x2: VW - M.r, y1: y, y2: y, stroke: 'var(--grid)', 'stroke-width': 1 }, gGrid);
        const t = mk('text', { x: M.l - R * 0.4, y: y + R * 0.28, 'text-anchor': 'end' }, gGrid); t.textContent = Math.round(v);
      });
      if (ref != null) mk('line', { x1: M.l, x2: VW - M.r, y1: Y(ref), y2: Y(ref), stroke: 'var(--muted)', 'stroke-width': 1, 'stroke-dasharray': '4 4' }, gGrid);
      const step = xMax <= 30 ? 5 : 10;
      for (let t = 0; t <= xMax; t += step) { const x = mk('text', { x: X(t), y: VH - R * 0.35, 'text-anchor': 'middle' }, gGrid); x.textContent = t === xMax ? `${t} ${xUnit}` : t; }
      series.forEach((s, k) => { paths[k].setAttribute('d', d.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)},${Y(p[s.key]).toFixed(1)}`).join('')); });
      gEnd.innerHTML = '';
      if (d.length) {
        const last = d[d.length - 1];
        const ys = series.map((s) => Y(last[s.key]));
        const gap = R * 0.95;
        if (ys.length === 2 && Math.abs(ys[0] - ys[1]) < gap) { const m = (ys[0] + ys[1]) / 2, up = ys[0] <= ys[1] ? -1 : 1; ys[0] = m + (up * gap) / 2; ys[1] = m - (up * gap) / 2; }
        series.forEach((s, k) => {
          mk('circle', { cx: X(last.t), cy: Y(last[s.key]), r: 3.5, fill: `var(${s.color})`, stroke: 'var(--surface)', 'stroke-width': 2 }, gEnd);
          if (series.length > 1) { const t = mk('text', { x: X(last.t) + R * 0.45, y: ys[k] + R * 0.28, style: 'fill:var(--ink)' }, gEnd); t.textContent = s.label; }
        });
      }
    }
    hit.addEventListener('pointermove', (e) => {
      if (!data.length) return;
      const r = svg.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * VW;
      const t = ((x - M.l) / (VW - M.l - M.r)) * xMax;
      let best = data[0]; for (const p of data) if (Math.abs(p.t - t) < Math.abs(best.t - t)) best = p;
      hair.setAttribute('x1', X(best.t)); hair.setAttribute('x2', X(best.t)); hair.setAttribute('opacity', 1);
      tip.hidden = false;
      tip.innerHTML = '';
      const head = document.createElement('div'); head.textContent = `${best.t.toFixed(1)} 秒`; tip.appendChild(head);
      series.forEach((s) => {
        const row = document.createElement('div');
        const i = document.createElement('i'); i.style.background = `var(${s.color})`; row.appendChild(i);
        const b = document.createElement('b'); b.textContent = `${Math.round(best[s.key])}${unit}`; row.appendChild(b);
        row.appendChild(document.createTextNode(' ' + s.label)); tip.appendChild(row);
      });
      const fr = fig.getBoundingClientRect(), px = e.clientX - fr.left;
      tip.style.left = Math.min(px + 12, fr.width - tip.offsetWidth - 4) + 'px'; tip.style.top = '36px';
    });
    hit.addEventListener('pointerleave', () => { hair.setAttribute('opacity', 0); tip.hidden = true; });
    return { draw };
  }

  // ================= 任務 =================
  const OUT = { 清水: 0, 等濃度: 1, 濃鹽水: 3 };
  const ALL = [
    { mode: 'mol', key: 'diff', title: '擴散', setup: { membrane: 'none', solute: 'small', nL: 40, nR: 0, T: 25 },
      task: '左邊放入一群紫色小分子，右邊不放。', q: '過一段時間後，紫色分子會怎麼分布？', opts: ['都留在左邊', '左右兩邊差不多一樣多', '全部跑到右邊'], ans: 1,
      judge: (m) => { const c = m.counts(), bal = Math.abs(c.sL - c.sR) <= 0.15 * (c.sL + c.sR); return (m.t >= 8 && bal) || m.t >= 30 ? { ok: bal, text: `${m.t.toFixed(0)} 秒後，左邊 ${c.sL} 個、右邊 ${c.sR} 個` } : null; },
      why: '分子會不停地隨機運動，從濃度高的地方往濃度低的地方移動，最後兩邊差不多一樣多，這就是擴散作用。平衡後分子仍在動，只是兩邊進出的數量差不多。' },
    { mode: 'mol', key: 'semi', title: '半透膜的選擇性', setup: { membrane: 'semi', solute: 'large', nL: 40, nR: 0, T: 25 },
      task: '用半透膜隔開，左邊放黃色的蔗糖分子。', q: '黃色的蔗糖分子能跑到右邊嗎？', opts: ['能，最後兩邊一樣多', '不能，會一直留在左邊'], ans: 1,
      judge: (m) => m.t >= 10 && (() => { const c = m.counts(); return { ok: c.sR === 0, text: `右邊有 ${c.sR} 個蔗糖分子` }; })(),
      why: '這個半透膜讓水和某些小分子（如氧）通過，蔗糖、離子過不去。細胞膜也有選擇性：有些物質能通過，有些不能。' },
    { mode: 'mol', timeNote: '＊示意時間：水位變化已加快，真實要幾十分鐘以上。', key: 'osmo', title: '滲透作用', setup: { membrane: 'semi', solute: 'large', nL: 40, nR: 0, T: 25 },
      task: '同樣的設定，這次觀察「水」。', q: '過一段時間後，哪一邊的水位會比較高？', opts: ['左邊（有蔗糖的一邊）', '右邊（清水）', '兩邊一樣高'], ans: 0,
      judge: (m) => { const h = m.hist[m.hist.length - 1], up = h.wL - h.wR >= 10; return (m.t >= 12 && up) || m.t >= 30 ? { ok: up, text: `${m.t.toFixed(0)} 秒＊後，左邊水量 ${Math.round(h.wL)}%、右邊 ${Math.round(h.wR)}%` } : null; },
      why: '水分子兩個方向都會通過半透膜，但進入左邊的比較多：水會往「過不了膜的溶質粒子」濃度較高（水比較少）的一邊淨移動，所以左邊水位上升。這就是滲透作用。' },
    { mode: 'mol', timeNote: '＊示意時間：水位變化已加快，真實要幾十分鐘以上。', key: 'conc', title: '（補充）滲透看粒子濃度', setup: { membrane: 'semi', solute: 'mix', nL: 6, nR: 35, T: 25 },
      task: '左邊是 10% 蔗糖水，右邊是 10% 食鹽水，重量百分濃度一樣。預設的 6 個蔗糖分子和 35 份食鹽（氯化鈉）重量相同。', q: '水會往哪一邊移動？', opts: ['左邊（蔗糖水）', '右邊（食鹽水）', '水沒有淨移動（水位不變），因為一樣是 10%'], ans: 1,
      judge: (m) => { const h = m.hist[m.hist.length - 1], up = h.wR - h.wL >= 10; return (m.t >= 10 && up) || m.t >= 30 ? { ok: up, text: `${m.t.toFixed(0)} 秒＊後，左邊水量 ${Math.round(h.wL)}%、右邊 ${Math.round(h.wR)}%` } : null; },
      why: '一份食鹽比一個蔗糖分子輕很多，同樣重量的食鹽份數多很多，而且每份食鹽在水中會分成鈉離子和氯離子兩個粒子。用預設的數量時，右邊「過不了膜的粒子」（70 個離子）大約是左邊（6 個蔗糖分子）的 12 倍，所以水往食鹽水淨移動。判斷滲透方向要看溶質粒子的濃度，不能只看重量百分濃度。' },
    { mode: 'mol', key: 'temp', title: '溫度與擴散', twoRuns: true, setup: { membrane: 'none', solute: 'small', nL: 100, nR: 0, T: 8 },
      task: '在冷水和溫水中各做一次擴散實驗，比較哪一次的分子比較快擴散到右邊。', q: '溫度比較高時，擴散會？', opts: ['變快', '變慢', '不變'], ans: 0,
      why: '溫度越高，分子運動越快，擴散也越快。之後理化課會學到「溫度與分子運動」，是同一個道理。' },
    { mode: 'cell', timeNote: '＊示意時間：真實的紅血球也是幾秒內就有變化。', key: 'rbc', title: '紅血球', cell: 'rbc', outs: ['清水', '等濃度', '濃鹽水'],
      task: '找出讓紅血球維持原來形狀的溶液。', q: '要把紅血球放進哪一種溶液？', opts: ['清水', '和細胞內濃度相同的食鹽水（約 0.9%）', '濃鹽水'], ans: 1,
      goal: (s) => s.key === 'same', retry: '紅血球沒有維持原狀。換一種溶液再試一次。',
      why: '外面和細胞內的濃度相同時，水進出的量一樣多，紅血球就維持原狀。醫院打點滴用的「生理食鹽水」就是這個濃度。' },
    { mode: 'cell', timeNote: '＊示意時間：真實的植物細胞約需幾十秒到幾分鐘。', key: 'plant', title: '植物細胞', cell: 'plant', outs: ['清水', '濃鹽水'],
      task: '讓植物細胞的細胞膜和細胞壁分開。', q: '要把植物細胞放進哪一種溶液？', opts: ['清水', '濃鹽水'], ans: 1,
      goal: (s) => s.key === 'plasmo', retry: '想想看：要讓水「離開」細胞，外面要比較濃還是比較稀？換一種溶液再試一次。',
      why: '外面比細胞內濃，水會離開細胞，液胞縮小、細胞膜跟著縮，和細胞壁分開。青菜撒鹽變軟就是這個原因。' },
  ];

  // 拆成三個短的互動：每個只做 2～3 個任務，設定由任務自動完成
  const makeLab = (L) => S.registerLab({
    id: L.id, section: '2-2', title: L.title,
    mount(box) {
      const MISSIONS = L.keys.map((k) => ALL.find((m) => m.key === k));
      box.innerHTML = `
<style>
  .labB { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 0.9rem; align-items: start; }
  .labB .col { display: grid; gap: 0.9rem; min-width: 0; }
  .labB .pad { padding: 1rem 1.25rem; }
  @media (max-width: 900px) { .labB { grid-template-columns: 1fr; } }
</style>
<div class="labB">
  <div class="col">
    <div class="card">
      <div class="lab-stage"><canvas width="960" height="540" aria-label="模擬畫面"></canvas></div>
      <div class="pad"><p class="status-line" id="labB-status"></p><p class="footnote" id="labB-foot"></p></div>
    </div>
    <div class="card"><div class="charts" id="labB-charts"><figure id="labB-c1"></figure><figure id="labB-c2"></figure></div></div>
  </div>
  <div class="col">
    <div class="card pad" id="labB-mission"></div>
    <details class="card pad free" id="labB-free"><summary>自由探索：自己調整設定</summary>
      <div id="labB-ctl"></div>
      <div class="btn-row">
        <button class="ctl primary" type="button" id="labB-run"></button>
        <button class="ctl" type="button" id="labB-reset">重設</button>
      </div>
      <div id="labB-read" style="margin-top:0.9rem"></div>
    </details>
  </div>
</div>`;
      const $ = (id) => box.querySelector('#labB-' + id);
      const canvas = box.querySelector('canvas'), g = canvas.getContext('2d');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr; g.scale(dpr, dpr);

      const mol = MolSim(), cel = CellSim();
      let mode = L.mode, playing = false, raf = 0, lastT = 0, chartT = 0;
      mol.reset(); cel.reset();
      const sim = () => (mode === 'mol' ? mol : cel);

      // ---------- 控制項 ----------
      const seg = (id, label, opts, val) => `<div class="field"><div class="field-head"><span>${label}</span></div><div class="seg-ctl" role="group" aria-label="${label}" id="labB-${id}">${opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === val}">${t}</button>`).join('')}</div></div>`;
      const range = (id, label, min, max, val, ticks) => `<div class="field"><div class="field-head"><label for="labB-${id}">${label}</label><output id="labB-${id}-o"></output></div><input type="range" id="labB-${id}" min="${min}" max="${max}" step="1" value="${val}">${ticks ? `<div class="ticks">${ticks.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}</div>`;
      function drawControls() {
        const c = mode === 'mol' ? mol.cfg : cel.cfg;
        $('ctl').innerHTML = mode === 'mol'
          ? seg('mem', '中間隔板', [['none', '無隔板'], ['semi', '半透膜']], c.membrane)
            + seg('sol', '溶質', [['small', '小分子（像氧）'], ['large', '黃色溶質（像蔗糖）'], ['mix', '左蔗糖、右食鹽']], c.solute)
            + (c.solute === 'mix'
              ? range('nL', '左邊：蔗糖分子', 0, 100, c.nL) + range('nR', '右邊：食鹽（每份分成 2 個離子）', 0, 50, Math.min(50, c.nR))
              : range('nL', '左邊溶質數量', 0, 100, c.nL) + range('nR', '右邊溶質數量', 0, 100, c.nR))
            + range('T', '溫度', 5, 45, c.T, ['5 °C', '25 °C', '45 °C'])
          : seg('cell', '細胞', [['rbc', '紅血球'], ['plant', '植物細胞']], c.cell)
            + range('out', '外面的溶液', 0, 300, Math.round(c.cout * 100), ['清水', '和細胞內相同', '', '濃鹽水']);
        box.querySelectorAll('#labB-ctl .seg-ctl').forEach((sg) => sg.addEventListener('click', (e) => {
          const b = e.target.closest('button'); if (!b) return;
          const key = { 'labB-mem': 'membrane', 'labB-sol': 'solute', 'labB-cell': 'cell' }[sg.id];
          const patch = { [key]: b.dataset.v };
          if (key === 'solute' && b.dataset.v === 'mix' && mol.cfg.nR > 50) patch.nR = 50;
          setCfg(patch); drawControls();
        }));
        box.querySelectorAll('#labB-ctl input[type=range]').forEach((r) => r.addEventListener('input', () => {
          const key = { 'labB-nL': 'nL', 'labB-nR': 'nR', 'labB-T': 'T', 'labB-out': 'cout' }[r.id];
          setCfg({ [key]: key === 'cout' ? r.value / 100 : +r.value }, key === 'T' || key === 'cout');
        }));
        syncOutputs();
      }
      const outText = (v) => (v === 0 ? '清水' : v < 0.9 ? '比細胞內稀' : v <= 1.1 ? '和細胞內相同' : v < 2.2 ? '比細胞內濃' : '濃鹽水');
      function syncOutputs() {
        const o = (id, t) => { const e = $(id + '-o'); if (e) e.textContent = t; };
        if (mode === 'mol') {
          o('nL', `${mol.cfg.nL} 個`);
          o('nR', mol.cfg.solute === 'mix' ? `${mol.cfg.nR} 份（${mol.cfg.nR * 2} 個離子）` : `${mol.cfg.nR} 個`);
          o('T', `${mol.cfg.T} °C（擴散速度 ×${dFactor(mol.cfg.T).toFixed(1)}）`);
        }
        else o('out', outText(cel.cfg.cout) + (cel.cfg.cell === 'rbc' && Math.abs(cel.cfg.cout - 1) < 0.1 ? '（0.9% 食鹽水）' : ''));
      }
      // 改設定：溫度與外液濃度可以邊跑邊調，其餘會重新開始
      // （拖動滑桿時不重畫控制項，否則會中斷拖動）
      function setCfg(patch, live) {
        const s = sim();
        Object.assign(s.cfg, patch);
        if (!live) { s.reset(); setPlaying(false); missionAbort(); }
        else if (mode === 'cell' && !playing) s.reset();
        box.querySelectorAll('#labB-ctl .seg-ctl button').forEach((b) => {
          const key = { 'labB-mem': 'membrane', 'labB-sol': 'solute', 'labB-cell': 'cell' }[b.parentNode.id];
          b.setAttribute('aria-pressed', s.cfg[key] === b.dataset.v);
        });
        syncOutputs(); refreshCharts(); readout(); drawConv();
      }
      function setMode(m) {
        if (m === mode) return;
        mode = m; setPlaying(false);
        buildCharts(); drawControls(); readout(); drawConv();
      }
      function setPlaying(p) {
        playing = p;
        $('run').innerHTML = p ? '暫停' : sim().t > 0 ? '繼續' : (mode === 'cell' ? '放進溶液' : '開始');
      }
      $('run').addEventListener('click', () => setPlaying(!playing));
      $('reset').addEventListener('click', () => { sim().reset(); setPlaying(false); missionAbort(); refreshCharts(true); readout(); });

      // ---------- 讀數與說明 ----------
      // 模擬畫面下方的備註：時間是真實還是示意
      function footnote() {
        let t;
        if (mode === 'mol') {
          t = mol.cfg.membrane === 'semi' && mol.cfg.solute !== 'small'
            ? '＊示意時間：水位（滲透）的變化已加快，真實的 U 形管實驗要幾十分鐘到幾小時。分子本身的擴散仍是真實速度（容器寬約 0.32 mm）。'
            : '時間為真實速度：容器寬約 0.32 mm，分子擴散的快慢和真實相同。';
          t += ' 模擬裡的分子很少，所以兩邊的數量會小小起伏；真實溶液的分子多到數不清，看起來就是平順的變化。';
        } else {
          t = cel.cfg.cell === 'rbc'
            ? '＊示意時間：紅血球的水通道很多，真實放進清水中也是幾秒內就會吸水脹大、破裂，和這裡差不多。'
            : '＊示意時間：已加快。真實的植物細胞要幾十秒到幾分鐘，細胞膜才會和細胞壁分開。';
        }
        $('foot').textContent = t;
      }
      function readout() {
        footnote();
        if (mode === 'mol') {
          const c = mol.counts(), h = mol.hist[mol.hist.length - 1];
          const conc = (s, w) => (w ? ((s / w) * 100).toFixed(0) : '—');
          $('read').innerHTML = `<table class="tbl"><thead><tr><th></th><th>左邊</th><th>右邊</th></tr></thead><tbody>
            <tr><th>溶質粒子</th><td>${c.sL}</td><td>${c.sR}</td></tr>
            <tr><th>水量</th><td>${Math.round(h.wL)}%</td><td>${Math.round(h.wR)}%</td></tr>
            <tr><th>濃度＊</th><td>${conc(c.sL, mol.vol[0])}</td><td>${conc(c.sR, mol.vol[1])}</td></tr></tbody></table>
            <p class="m-hint" style="margin-top:0.4rem">＊每 100 個水分子中有幾個溶質粒子。滲透只看「過不了膜」的溶質粒子濃度；一份食鹽在水中分成 2 個離子。</p>`;
          const semi = mol.cfg.membrane === 'semi', big = mol.cfg.solute === 'large', diff = Math.abs(c.sL - c.sR), tot = c.sL + c.sR;
          const side = (a, b) => (a > b + 3 ? '左邊' : b > a + 3 ? '右邊' : '');
          let s;
          if (!tot) s = '目前沒有溶質，只有水分子在隨機運動。';
          else if (semi && mol.cfg.solute === 'mix') s = `食鹽在水中分成鈉離子（＋）和氯離子（－），同樣重量的粒子數比蔗糖多很多。蔗糖和這兩種離子都過不了這個半透膜，水往「過不了膜的粒子」比較濃的一邊淨移動${side(h.wL, h.wR) ? `，${side(h.wL, h.wR)}水位上升` : ''}。`;
          else if (!semi && mol.cfg.solute === 'mix') s = '沒有隔板時，蔗糖和離子都會擴散到整個容器，最後兩邊一樣濃。';
          else if (semi && !big && diff <= 0.2 * tot && mol.t > 1) s = '小分子也能通過半透膜，會擴散到兩邊，最後兩邊濃度相同；所以不會造成水位差，水位一直一樣高。';
          else if (semi && big) s = diff > 0 ? `蔗糖分子過不了半透膜，只能留在原來那一邊；水分子會往過不了膜的溶質粒子濃度較高（水比較少）的一邊淨移動，${h.wL > h.wR + 3 ? '左邊' : h.wR > h.wL + 3 ? '右邊' : ''}水位${Math.abs(h.wL - h.wR) > 3 ? '上升' : '開始改變'}。` : '兩邊的蔗糖分子一樣多，水進出的量差不多，水位不變。';
          else if (diff <= 0.2 * tot && mol.t > 1) s = '兩邊濃度已經差不多了。分子仍在動，但兩邊進出的數量差不多（動態平衡）。';
          else s = `溶質正從濃度高的${c.sL > c.sR ? '左邊' : '右邊'}往濃度低的${c.sL > c.sR ? '右邊' : '左邊'}擴散。${semi ? '小分子可以通過半透膜。' : ''}`;
          $('status').textContent = playing || mol.t > 0 ? s : '先在任務卡點選你的預測，實驗就會開始。';
        } else {
          const st = cel.state(), cin = 1 / cel.V, net = cel.flow();
          $('read').innerHTML = `<dl class="readout">
            <dt>細胞體積</dt><dd class="big">${Math.round(cel.V * 100)}%</dd>
            <dt>水的淨移動</dt><dd>${cel.burst ? '—' : Math.abs(net) < 0.03 ? '進出一樣多' : net > 0 ? '進入細胞' : '離開細胞'}</dd>
            <dt>濃度比較</dt><dd>細胞內 ${cin.toFixed(2)}，外面 ${cel.cfg.cout.toFixed(2)}</dd></dl>
            <p class="m-hint" style="margin-top:0.4rem">濃度以「和細胞內相同」＝ 1.00 表示，比的是溶質粒子的濃度（例如 0.9% 食鹽水約為 1.00）。</p>`;
          $('status').textContent = cel.t > 0 ? st.text + '。' + (cel.burst ? '' : net > 0.03 ? '外面比細胞內稀，水進入細胞。' : net < -0.03 ? '外面比細胞內濃，水離開細胞。' : '') : '先在任務卡點選你的預測，就會把細胞放進那種溶液。';
        }
      }

      // ---------- 換成真實大小：容器變大，擴散要多久 ----------
      // 兩邊差不多一樣多所需時間 ≈ 0.17 × 寬度² ÷ D（和模擬畫面的結果一致）
      const WIDTHS = [['一個細胞', 1e-5, '10 μm'], ['這個畫面', 3.2e-4, '0.32 mm'], ['1 cm', 1e-2, '1 cm'], ['一杯水', 0.1, '10 cm']];
      let convK = 1;
      const fmtT = (t) => (t < 1 ? `${t.toPrecision(1)} 秒` : t < 60 ? `${Math.round(t)} 秒` : t < 3600 ? `${(t / 60).toFixed(t < 600 ? 1 : 0)} 分鐘` : t < 86400 ? `${(t / 3600).toFixed(1)} 小時` : `${Math.round(t / 86400)} 天`);
      function drawConv() {
        const el = $('conv');
        if (!el) return;
        const big = mol.cfg.solute === 'large', D25 = big ? 5.2e-10 : 2.0e-9;
        const [name, L, lab] = WIDTHS[convK];
        const t = (0.17 * L * L) / (D25 * dFactor(25)); // 以室溫 25 °C 換算
        el.innerHTML = `<h3>換成真實大小</h3>
          <div class="seg-ctl" role="group" aria-label="容器寬度">${WIDTHS.map(([n, , l], k) => `<button type="button" data-k="${k}" aria-pressed="${k === convK}">${n}（${l}）</button>`).join('')}</div>
          <p class="status-line" style="min-height:0">容器寬 ${lab}、25 °C 的靜止水中，${big ? '蔗糖分子' : '小分子（像氧）'}擴散到兩邊差不多一樣多，大約要 <b>${fmtT(t)}</b>。</p>
          <p class="m-hint">寬度變成 10 倍，時間變成 100 倍。所以細胞要很小，大型動物也需要血液循環來運送物質。</p>`;
        el.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { convK = +b.dataset.k; drawConv(); }));
      }

      // ---------- 圖表 ----------
      let c1, c2;
      function buildCharts() {
        if (mode === 'mol') {
          $('c2').hidden = false; $('charts').style.gridTemplateColumns = '';
          c1 = Chart($('c1'), { title: '溶質粒子數', unit: ' 個', series: [{ key: 'sL', label: '左邊', color: '--series-l' }, { key: 'sR', label: '右邊', color: '--series-r' }] });
          c2 = Chart($('c2'), { title: '水量（占全部的 %）', unit: '%', yMax: 100, series: [{ key: 'wL', label: '左邊', color: '--series-l' }, { key: 'wR', label: '右邊', color: '--series-r' }] });
        } else {
          $('c2').hidden = true; $('charts').style.gridTemplateColumns = '1fr';
          c1 = Chart($('c1'), { title: '細胞體積（%，虛線＝原來大小）', unit: '%', yMax: 160, ref: 100, series: [{ key: 'v', label: '體積', color: '--accent' }] });
          c2 = null;
        }
        refreshCharts(true);
      }
      function refreshCharts() {
        if (mode === 'mol') {
          const n = mol.cfg.nL + (mol.cfg.solute === 'mix' ? 2 : 1) * mol.cfg.nR;
          const top = Math.max(10, Math.ceil(n / 10) * 10);
          const osmo = mol.cfg.membrane === 'semi' && mol.cfg.solute !== 'small';
          c1.draw(mol.hist, top); c2.draw(mol.hist, 100, osmo ? '秒＊' : '秒');
        } else c1.draw(cel.hist, 160, '秒＊');
      }

      // ---------- 任務 ----------
      // 流程：顯示任務（畫面自動設定好）→ 點預測 → 立刻開始實驗 → 結果與回饋 → 下一個
      let mi = 0, phase = 'predict', pred = -1, firstPred = [], runs = [], note = '', armed = false, judged = null;
      const mbox = $('mission');
      const TEMPS = [8, 42];
      function applySetup(m, extra) {
        if (m.mode !== mode) setMode(m.mode);
        if (m.mode === 'mol') mol.reset({ ...m.setup, ...(extra || {}) });
        else cel.reset({ cell: m.cell, cout: extra && extra.cout !== undefined ? extra.cout : 1 });
        setPlaying(false); drawControls(); refreshCharts(true); readout();
      }
      function start(extra) {
        const m = MISSIONS[mi];
        applySetup(m, extra);
        note = ''; armed = true; phase = 'running'; setPlaying(true); drawMission();
      }
      function missionAbort() { if (phase === 'running') { phase = runs.length ? 'ready' : 'predict'; armed = false; note = '你在「自由探索」改了設定，這次實驗先停下來；按下面的按鈕可以重新開始。'; drawMission(); } }
      function missionTick() {
        if (!armed || phase !== 'running') return;
        const m = MISSIONS[mi];
        if (m.twoRuns) {
          const bal = mol.fracR >= 0.3;
          if (bal || mol.t >= 45) {
            runs = runs.filter((r) => r.T !== mol.cfg.T);
            runs.push({ T: mol.cfg.T, t: mol.t, bal }); armed = false; setPlaying(false);
            const low = runs.find((r) => r.T <= 15), high = runs.find((r) => r.T >= 35);
            if (low && high) { judged = { ok: high.t < low.t, text: `${low.T} °C 用了 ${low.t.toFixed(1)} 秒，${high.T} °C 用了 ${high.t.toFixed(1)} 秒` }; phase = 'result'; }
            else phase = 'ready';
            drawMission();
          }
          return;
        }
        if (m.mode === 'cell') {
          if (cel.t >= 6 || cel.burst && cel.t - cel.burst > 1.2) {
            const s = cel.state(); armed = false; setPlaying(false);
            judged = { ok: m.goal(s), text: s.text }; phase = 'result'; drawMission();
          }
          return;
        }
        const r = m.judge(mol);
        if (r) { judged = r; armed = false; setPlaying(false); phase = 'result'; drawMission(); }
      }
      const dots = () => `<div class="dots" aria-hidden="true">${MISSIONS.map((_, k) => `<i class="${k < mi ? (firstPred[k] ? 'ok' : 'miss') : k === mi ? 'on' : ''}"></i>`).join('')}</div>`;
      function showMission() {
        const m = MISSIONS[mi];
        phase = 'predict'; pred = -1; runs = []; note = ''; judged = null; armed = false;
        if (m) applySetup(m);
        drawMission();
      }
      function drawMission() {
        if (mi >= MISSIONS.length) {
          const ok = firstPred.filter(Boolean).length;
          mbox.innerHTML = `<div class="mission-top"><h2>任務完成</h2>${dots()}</div>
            <p class="m-text">第一次就預測正確 <b>${ok} / ${MISSIONS.length}</b> 個。</p>
            <div class="fb ok"><strong>重點整理</strong>${L.summary}</div>
            ${L.conv ? '<div id="labB-conv" style="margin:0.6rem 0"></div>' : ''}
            <p class="m-hint">想自己試試其他設定，可以打開下面的「自由探索」。</p>
            <button class="ctl primary" type="button" id="labB-again">再做一次</button>`;
          mbox.querySelector('#labB-again').addEventListener('click', () => { mi = 0; firstPred = []; showMission(); });
          drawConv();
          $('free').open = true;
          return;
        }
        const m = MISSIONS[mi];
        let html = `<div class="mission-top"><h2>任務 ${mi + 1}：${m.title}</h2>${dots()}</div><p class="m-text">${m.task}</p>`;
        const lock = phase === 'running' || phase === 'result' || (m.twoRuns && phase !== 'predict');
        html += `<p class="m-hint" style="margin-bottom:0.25rem">${m.twoRuns ? '先預測' : '先預測，點選後就會開始實驗'}：${m.q}</p><div class="opts">${m.opts.map((o, k) => {
          const cls = phase === 'result' ? (k === m.ans ? 'right' : k === pred ? 'wrong' : '') : '';
          return `<button class="opt ${cls}" type="button" data-k="${k}" aria-pressed="${k === pred}" ${lock ? 'disabled' : ''}>${o}</button>`;
        }).join('')}</div>`;
        if (note) html += `<div class="fb bad"><strong>注意</strong>${note}</div>`;
        if (m.twoRuns && pred >= 0 && phase !== 'result') {
          html += `<p class="m-hint">兩個溫度各做一次，比較右邊的分子達到 3 成要多久：</p><div class="acts">${TEMPS.map((T) => {
            const r = runs.find((x) => x.T === T);
            return `<button class="ctl" type="button" data-t="${T}" aria-pressed="${!!r}" ${phase === 'running' ? 'disabled' : ''}>${T < 20 ? '冷水' : '溫水'} ${T} °C${r ? `：${r.bal ? r.t.toFixed(1) + ' 秒' : '超過 45 秒'}` : ''}</button>`;
          }).join('')}</div>`;
        } else if (phase === 'predict' && note) {
          html += `<div class="acts"><button class="ctl primary" type="button" id="labB-go">重新開始實驗</button></div>`;
        }
        if (phase === 'running') html += `<p class="m-hint">實驗進行中，觀察畫面和圖表……</p>`;
        if (phase === 'result') {
          const okPred = pred === m.ans;
          html += `<div class="fb ${judged.ok ? 'ok' : 'bad'}"><strong>${judged.ok ? (okPred ? '預測正確！' : '和你的預測不一樣') : '這次的結果不是任務要的'}</strong>
            實驗結果：${judged.text}<br>${judged.ok ? m.why : (m.retry || '')}${m.timeNote ? `<span class="footnote" style="display:block">${m.timeNote}</span>` : ''}</div>`;
          html += judged.ok
            ? `<button class="ctl primary" type="button" id="labB-next">${mi === MISSIONS.length - 1 ? '看結果' : '下一個任務'}</button>`
            : `<button class="ctl primary" type="button" id="labB-retry">換一個再試</button>`;
        }
        mbox.innerHTML = html;
        mbox.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
          pred = +b.dataset.k;
          if (firstPred[mi] === undefined) firstPred[mi] = pred === m.ans;
          if (m.twoRuns) { phase = 'ready'; note = ''; drawMission(); return; }
          start(m.mode === 'cell' ? { cout: OUT[m.outs[pred]] } : null);
        }));
        mbox.querySelectorAll('.acts [data-t]').forEach((b) => b.addEventListener('click', () => start({ T: +b.dataset.t })));
        const on = (id, fn) => { const e = mbox.querySelector('#labB-' + id); if (e) e.addEventListener('click', fn); };
        on('go', () => start(m.mode === 'cell' && pred >= 0 ? { cout: OUT[m.outs[pred]] } : null));
        on('retry', () => { phase = 'predict'; pred = -1; note = ''; judged = null; if (m.twoRuns) runs = []; applySetup(m); drawMission(); });
        on('next', () => { mi++; showMission(); });
      }

      // ---------- 主迴圈 ----------
      function frame(now) {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(1 / 30, (now - (lastT || now)) / 1000); lastT = now;
        if (playing) {
          const s = sim(), n = 2;
          for (let i = 0; i < n; i++) s.step(dt / n);
          missionTick();
          if (now - chartT > 250) { chartT = now; refreshCharts(); readout(); }
        }
        sim().draw(g, W / (canvas.clientWidth || W));
      }
      buildCharts(); drawControls(); setPlaying(false); readout(); showMission();
      const ro = new ResizeObserver(() => refreshCharts());
      ro.observe($('charts'));
      raf = requestAnimationFrame(frame);
      // 檢查用：不靠畫面更新，直接推進模擬 sec 秒
      S._labB = { mol, cel, run(sec) { const s = sim(); for (let i = 0; i < sec * 120; i++) { s.step(1 / 120); missionTick(); } refreshCharts(); readout(); s.draw(g, W / (canvas.clientWidth || W)); } };
      return { unmount() { cancelAnimationFrame(raf); ro.disconnect(); delete S._labB; } };
    },
  });

  makeLab({ id: 'lab-transport', title: '擴散實驗', mode: 'mol', keys: ['diff', 'temp'], conv: true,
    summary: '擴散：分子由濃度高往濃度低移動，最後分布均勻；溫度高，擴散比較快。距離變成 10 倍，擴散需要的時間變成 100 倍，所以細胞都很小。' });
  makeLab({ id: 'lab-osmosis', title: '滲透實驗', mode: 'mol', keys: ['semi', 'osmo', 'conc'],
    summary: '半透膜有選擇性：有些物質能通過，有些不能。滲透：水通過半透膜，往「過不了膜的溶質粒子」濃度較高（水比較少）的一邊淨移動。判斷方向要看粒子的濃度，不能只看重量百分濃度。' });
  makeLab({ id: 'lab-cells', title: '細胞放進溶液', mode: 'cell', keys: ['rbc', 'plant'],
    summary: '外面比細胞內稀：水進入細胞（紅血球會吸水脹大，最後破裂）。外面和細胞內一樣濃：維持原狀（0.9% 生理食鹽水）。外面比較濃：水離開細胞（植物細胞的細胞膜和細胞壁分開）。' });
})();
