import { useEffect, useRef } from 'react';

// ─── Effect type ──────────────────────────────────────────────────────────────
export type BackgroundEffect =
  | 'rain' | 'thunderstorm' | 'snowfall' | 'sakura' | 'autumn-leaves'
  | 'starlight' | 'galaxy' | 'aurora' | 'eclipse' | 'meteor-shower'
  | 'golden-shine' | 'diamond-sparkle' | 'platinum-glow' | 'royal-purple' | 'obsidian'
  | 'mana-flow' | 'dragon-flame' | 'spirit-aura' | 'moonlight' | 'shadow-monarch'
  | 'neon-pulse' | 'glitch' | 'matrix' | 'hologram' | 'vaporwave';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const r  = (n: number) => Math.random() * n;
const rr = (a: number, b: number) => a + Math.random() * (b - a);
const mkDt = () => { let p = 0; return (t: number) => { const d = p ? Math.min(t - p, 0.05) : 0.016; p = t; return d; }; };
type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

// ─── GPU-optimised canvas wrapper ─────────────────────────────────────────────
function CanvasEffect({ make, opacity = 0.38 }: { make: () => DrawFn; opacity?: number }) {
  const ref   = useRef<HTMLCanvasElement>(null);
  const fnRef = useRef<DrawFn | null>(null);
  if (!fnRef.current) fnRef.current = make();

  useEffect(() => {
    const canvas = ref.current!;
    const parent = canvas.parentElement!;
    let w = 0, h = 0;
    const sync = () => { w = parent.clientWidth || 420; h = parent.clientHeight || 600; canvas.width = w; canvas.height = h; };
    sync();
    const ro = new ResizeObserver(sync); ro.observe(parent);
    let raf: number;
    const ctx = canvas.getContext('2d')!;
    const tick = (ms: number) => { ctx.clearRect(0, 0, w, h); if (w && h) fnRef.current!(ctx, w, h, ms / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none' }} />;
}

// ════════════════════════════════════════════════════════════════════════════════
// NATURE EFFECTS
// ════════════════════════════════════════════════════════════════════════════════

function makeRain(speed = 1): DrawFn {
  type D = { x: number; y: number; len: number; spd: number; a: number };
  const drops: D[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    if (!drops.length) for (let i = 0; i < 80; i++) drops.push({ x: r(w), y: r(h), len: 8 + r(18), spd: (150 + r(250)) * speed, a: 0.1 + r(0.4) });
    ctx.lineWidth = 0.8;
    for (const p of drops) {
      p.y += p.spd * d; if (p.y > h + p.len) { p.y = -p.len; p.x = r(w); }
      ctx.strokeStyle = `rgba(180,210,240,${p.a})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 0.8, p.y + p.len); ctx.stroke();
    }
  };
}

function makeThunderstorm(): DrawFn {
  const rain = makeRain(1.6); let nextFlash = rr(2, 5), flashEnd = -1; const dt = mkDt();
  return (ctx, w, h, t) => {
    dt(t); rain(ctx, w, h, t);
    if (t >= nextFlash && flashEnd < 0) { flashEnd = t + rr(0.05, 0.12); nextFlash = t + rr(3, 8); }
    if (flashEnd > 0 && t < flashEnd) { ctx.fillStyle = `rgba(255,255,230,${rr(0.1, 0.3)})`; ctx.fillRect(0, 0, w, h); }
    else if (flashEnd > 0 && t >= flashEnd) flashEnd = -1;
  };
}

function makeSnowfall(): DrawFn {
  type F = { x: number; y: number; r: number; vy: number; phase: number; sw: number; sf: number; a: number };
  const flakes: F[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    if (!flakes.length) for (let i = 0; i < 60; i++) flakes.push({ x: r(w), y: r(h), r: 1 + r(2.5), vy: 18 + r(32), phase: r(Math.PI * 2), sw: 22 + r(38), sf: 0.3 + r(0.5), a: 0.2 + r(0.6) });
    for (const f of flakes) {
      f.y += f.vy * d; f.x += Math.sin(t * f.sf + f.phase) * f.sw * d;
      if (f.y > h + 5) { f.y = -5; f.x = r(w); }
      ctx.globalAlpha = f.a; ctx.fillStyle = '#e8f4ff'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeSakura(): DrawFn {
  type P = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; sz: number; a: number; phase: number };
  const petals: P[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    if (!petals.length) for (let i = 0; i < 40; i++) petals.push({ x: r(w), y: r(h), vx: -(14 + r(22)), vy: 18 + r(28), rot: r(Math.PI * 2), vrot: rr(-0.8, 0.8), sz: 4 + r(6), a: 0.3 + r(0.5), phase: r(Math.PI * 2) });
    for (const p of petals) {
      p.x += (p.vx + Math.sin(t * 0.5 + p.phase) * 12) * d; p.y += p.vy * d; p.rot += p.vrot * d;
      if (p.y > h + 20 || p.x < -20) { p.x = w + r(40); p.y = r(h * 0.5); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a;
      ctx.fillStyle = '#ffb7c5'; ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * 0.55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };
}

function makeAutumnLeaves(): DrawFn {
  const COLS = ['#e8742a', '#d4420f', '#f5a623', '#c0392b', '#e67e22', '#f39c12'];
  type L = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; sz: number; a: number; col: string; phase: number };
  const leaves: L[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    if (!leaves.length) for (let i = 0; i < 35; i++) leaves.push({ x: r(w), y: r(h), vx: -(8 + r(18)), vy: 28 + r(36), rot: r(Math.PI * 2), vrot: rr(-1, 1), sz: 6 + r(8), a: 0.3 + r(0.5), col: COLS[Math.floor(r(COLS.length))], phase: r(Math.PI * 2) });
    for (const l of leaves) {
      l.x += (l.vx + Math.sin(t * 0.4 + l.phase) * 10) * d; l.y += l.vy * d; l.rot += l.vrot * d;
      if (l.y > h + 20 || l.x < -20) { l.x = w + r(30); l.y = -20; }
      ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.globalAlpha = l.a;
      ctx.fillStyle = l.col; ctx.beginPath(); ctx.ellipse(0, 0, l.sz * 0.6, l.sz, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// COSMIC EFFECTS
// ════════════════════════════════════════════════════════════════════════════════

function makeStarlight(): DrawFn {
  type S = { x: number; y: number; r: number; phase: number; spd: number; a: number };
  const stars: S[] = [];
  return (ctx, w, h, t) => {
    if (!stars.length) for (let i = 0; i < 80; i++) stars.push({ x: r(w), y: r(h), r: 0.5 + r(1.5), phase: r(Math.PI * 2), spd: 0.5 + r(1.5), a: 0.2 + r(0.7) });
    for (const s of stars) {
      const a = s.a * (0.3 + 0.7 * Math.abs(Math.sin(t * s.spd + s.phase)));
      ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeGalaxy(): DrawFn {
  const PCOLS = ['#a8d8ff', '#c9b8ff', '#ffb8d8', '#b8fff0'];
  type P = { ang: number; dist: number; spd: number; r: number; a: number; col: string };
  const pts: P[] = [];
  return (ctx, w, h, t) => {
    const cx = w / 2, cy = h / 2, rad = Math.min(w, h) * 0.45;
    if (!pts.length) for (let i = 0; i < 100; i++) { const dist = 10 + r(rad); pts.push({ ang: r(Math.PI * 2), dist, spd: (0.06 + r(0.22)) * (rad / (dist + 10)), r: 0.4 + r(1.5), a: 0.12 + r(0.6), col: PCOLS[Math.floor(r(PCOLS.length))] }); }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * 0.6);
    g.addColorStop(0, 'rgba(80,40,160,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (const p of pts) {
      p.ang += p.spd * 0.004;
      ctx.globalAlpha = p.a; ctx.fillStyle = p.col;
      ctx.beginPath(); ctx.arc(cx + Math.cos(p.ang) * p.dist, cy + Math.sin(p.ang) * p.dist * 0.45, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeMeteorShower(): DrawFn {
  type M = { x: number; y: number; len: number; spd: number; a: number; on: boolean };
  const meteors: M[] = []; let next = rr(0.4, 1.8); const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    if (t > next && meteors.filter(m => m.on).length < 6) { meteors.push({ x: r(w * 0.8) + w * 0.1, y: -20, len: 50 + r(80), spd: 350 + r(250), a: 0.5 + r(0.5), on: true }); next = t + rr(0.3, 1.5); }
    for (const m of meteors) {
      if (!m.on) continue; m.x -= m.spd * 0.55 * d; m.y += m.spd * d;
      if (m.y > h + m.len || m.x < -m.len) { m.on = false; continue; }
      const grad = ctx.createLinearGradient(m.x + m.len * 0.55, m.y - m.len * 0.55, m.x, m.y);
      grad.addColorStop(0, `rgba(255,255,240,${m.a})`); grad.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + m.len * 0.55, m.y - m.len * 0.55); ctx.stroke();
    }
  };
}

function makeDiamondSparkle(): DrawFn {
  type S = { x: number; y: number; sz: number; a: number; phase: number; spd: number };
  const sparkles: S[] = [];
  return (ctx, w, h, t) => {
    if (!sparkles.length) for (let i = 0; i < 30; i++) sparkles.push({ x: r(w), y: r(h), sz: 2 + r(5), a: 0.3 + r(0.6), phase: r(Math.PI * 2), spd: 0.6 + r(1.5) });
    for (const s of sparkles) {
      const intensity = Math.abs(Math.sin(t * s.spd + s.phase)); if (intensity < 0.08) continue;
      const sz = s.sz * intensity; ctx.globalAlpha = s.a * intensity; ctx.strokeStyle = '#ddeeff'; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - sz); ctx.lineTo(s.x, s.y + sz);
      ctx.moveTo(s.x - sz, s.y); ctx.lineTo(s.x + sz, s.y);
      ctx.moveTo(s.x - sz * 0.5, s.y - sz * 0.5); ctx.lineTo(s.x + sz * 0.5, s.y + sz * 0.5);
      ctx.moveTo(s.x + sz * 0.5, s.y - sz * 0.5); ctx.lineTo(s.x - sz * 0.5, s.y + sz * 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// ANIME / FANTASY EFFECTS
// ════════════════════════════════════════════════════════════════════════════════

function makeManaFlow(): DrawFn {
  const COLS = ['#7b68ee', '#6495ed', '#9370db', '#4169e1', '#8a2be2'];
  type P = { ang: number; dist: number; off: number; a: number; r: number; col: string };
  const pts: P[] = [];
  return (ctx, w, h, t) => {
    const cx = w / 2, cy = h / 2, rad = Math.min(w, h) * 0.42;
    if (!pts.length) for (let i = 0; i < 55; i++) pts.push({ ang: r(Math.PI * 2), dist: 15 + r(rad), off: r(Math.PI * 2), a: 0.2 + r(0.7), r: 1 + r(2), col: COLS[Math.floor(r(COLS.length))] });
    for (const p of pts) {
      const ang = p.ang + t * (0.25 + 0.3 / (p.dist * 0.01 + 1));
      const wb = Math.sin(t * 1.5 + p.off) * 12;
      ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(t * 2 + p.off));
      ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * (p.dist + wb), cy + Math.sin(ang) * (p.dist + wb) * 0.5, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeDragonFlame(): DrawFn {
  type P = { x: number; y: number; vx: number; vy: number; life: number; ml: number; r: number };
  const pts: P[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t);
    for (let i = 0; i < 3; i++) pts.push({ x: w / 2 + rr(-12, 12), y: h - 5, vx: rr(-22, 22), vy: rr(-85, -48), life: 0, ml: rr(0.7, 1.5), r: 2 + r(4) });
    for (const p of pts) { p.x += p.vx * d; p.y += p.vy * d; p.vx *= 0.97; p.life += d; }
    while (pts.length > 160) pts.shift();
    for (const p of pts) {
      if (p.life >= p.ml) continue; const prog = p.life / p.ml;
      ctx.globalAlpha = (1 - prog) * 0.7;
      ctx.fillStyle = `rgb(${Math.floor(80 + prog * 175)},${Math.floor(140 + prog * 115)},255)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - prog * 0.4), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeSpiritAura(): DrawFn {
  type P = { ang: number; spd: number; dist: number; life: number; ml: number; a: number; r: number };
  const pts: P[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t); const cx = w / 2, cy = h / 2;
    for (let i = 0; i < 2; i++) pts.push({ ang: r(Math.PI * 2), spd: 30 + r(70), dist: 0, life: 0, ml: rr(1, 2.2), a: 0.4 + r(0.5), r: 1 + r(2) });
    for (const p of pts) { p.dist += p.spd * d; p.life += d; }
    while (pts.length > 100) pts.shift();
    for (const p of pts) {
      if (p.life >= p.ml) continue; const prog = p.life / p.ml;
      ctx.globalAlpha = p.a * (1 - prog);
      ctx.fillStyle = `hsl(${190 + prog * 70},75%,72%)`;
      ctx.beginPath(); ctx.arc(cx + Math.cos(p.ang) * p.dist * 1.1, cy + Math.sin(p.ang) * p.dist * 0.6, p.r * (1 - prog * 0.3), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function makeShadowMonarch(): DrawFn {
  type P = { x: number; y: number; vx: number; vy: number; life: number; ml: number; r: number };
  const pts: P[] = []; const dt = mkDt();
  return (ctx, w, h, t) => {
    const d = dt(t); const cx = w / 2;
    for (let i = 0; i < 2; i++) pts.push({ x: cx + rr(-w / 2, w / 2), y: h + 5, vx: rr(-20, 20), vy: rr(-52, -25), life: 0, ml: rr(2, 3.8), r: 1.5 + r(3) });
    for (const p of pts) { p.x += p.vx * d; p.y += p.vy * d; p.vx *= 0.98; p.life += d; }
    while (pts.length > 120) pts.shift();
    for (const p of pts) {
      if (p.life >= p.ml) continue; const prog = p.life / p.ml;
      ctx.globalAlpha = (1 - prog) * 0.55; ctx.fillStyle = `hsl(${270 + prog * 25},55%,${12 + prog * 22}%)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    const g = ctx.createRadialGradient(cx, h, 0, cx, h, Math.min(w, h) * 0.7);
    g.addColorStop(0, `rgba(70,0,110,${0.06 + 0.04 * Math.sin(t)})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  };
}

function makeMatrix(): DrawFn {
  const CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01';
  const CW = 14;
  type Col = { y: number; spd: number; chars: string[]; a: number };
  let cols: Col[] = []; const dt = mkDt(); let prevN = 0;
  return (ctx, w, h, t) => {
    const d = dt(t); const nc = Math.floor(w / CW);
    if (nc !== prevN) { prevN = nc; cols = Array.from({ length: nc }, () => ({ y: r(h), spd: 55 + r(80), chars: Array.from({ length: 22 }, () => CHARS[Math.floor(r(CHARS.length))]), a: 0.25 + r(0.55) })); }
    ctx.font = `${CW - 2}px monospace`;
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i]; c.y += c.spd * d; if (c.y > h + 220) { c.y = -220; c.a = 0.2 + r(0.6); }
      for (let j = 0; j < c.chars.length; j++) {
        const cy = c.y - j * CW; if (cy < 0 || cy > h) continue;
        const br = Math.max(0, 1 - j / c.chars.length);
        ctx.globalAlpha = c.a * br; ctx.fillStyle = j === 0 ? '#fff' : `hsl(140,55%,${25 + br * 40}%)`;
        if (Math.random() < 0.005) c.chars[j] = CHARS[Math.floor(r(CHARS.length))];
        ctx.fillText(c.chars[j], i * CW, cy);
      }
    }
    ctx.globalAlpha = 1;
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// CSS EFFECTS
// ════════════════════════════════════════════════════════════════════════════════

function AuroraEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="abe-a1" /><div className="abe-a2" /><div className="abe-a3" />
      <style>{`
        .abe-a1,.abe-a2,.abe-a3{position:absolute;left:-50%;width:200%;border-radius:50%;filter:blur(40px);}
        .abe-a1{height:50%;top:-10%;background:linear-gradient(135deg,rgba(0,200,150,.4),rgba(100,0,200,.3));animation:abe1 8s ease-in-out infinite alternate;}
        .abe-a2{height:40%;top:15%;background:linear-gradient(135deg,rgba(0,120,255,.3),rgba(0,220,180,.35));animation:abe2 11s ease-in-out infinite alternate;}
        .abe-a3{height:35%;top:30%;background:linear-gradient(135deg,rgba(120,0,255,.25),rgba(0,180,120,.2));animation:abe3 14s ease-in-out infinite alternate;}
        @keyframes abe1{0%{transform:translateX(-10%) rotate(-3deg) scaleY(.8)}100%{transform:translateX(10%) rotate(3deg) scaleY(1.1)}}
        @keyframes abe2{0%{transform:translateX(10%) rotate(2deg)}100%{transform:translateX(-15%) rotate(-4deg)}}
        @keyframes abe3{0%{transform:translateX(5%) rotate(-2deg) scaleY(1.2)}100%{transform:translateX(-8%) rotate(3deg) scaleY(.9)}}
      `}</style>
    </div>
  );
}

function EclipseEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ebe-ring" />
      <style>{`
        .ebe-ring{width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(0,0,0,.9) 35%,rgba(255,140,0,.5) 56%,rgba(255,80,0,.2) 70%,transparent 85%);box-shadow:0 0 60px rgba(255,120,0,.4),0 0 120px rgba(255,80,0,.2);animation:ebe-pulse 4s ease-in-out infinite;}
        @keyframes ebe-pulse{0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(255,120,0,.4),0 0 120px rgba(255,80,0,.2)}50%{transform:scale(1.08);box-shadow:0 0 90px rgba(255,150,0,.5),0 0 160px rgba(255,100,0,.3)}}
      `}</style>
    </div>
  );
}

function GoldenShineEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="gse-base" /><div className="gse-sweep" />
      <style>{`
        .gse-base{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(180,120,0,.2) 0%,rgba(100,60,0,.1) 60%,transparent 100%);}
        .gse-sweep{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,215,0,.55) 50%,rgba(255,180,0,.3) 56%,transparent 72%);animation:gse-sweep 4s linear infinite;transform:translateX(-100%);}
        @keyframes gse-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
      `}</style>
    </div>
  );
}

function PlatinumGlowEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="pge-base" /><div className="pge-sweep" />
      <style>{`
        .pge-base{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(220,225,235,.22) 0%,rgba(160,170,180,.1) 60%,transparent 100%);animation:pge-pulse 5s ease-in-out infinite;}
        .pge-sweep{position:absolute;inset:0;background:linear-gradient(105deg,transparent 25%,rgba(255,255,255,.58) 50%,rgba(210,220,230,.35) 58%,transparent 72%);animation:pge-sweep 5s linear infinite;transform:translateX(-100%);}
        @keyframes pge-pulse{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes pge-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
      `}</style>
    </div>
  );
}

function RoyalPurpleEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }}>
      <div className="rpe-aura" />
      <style>{`
        .rpe-aura{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(120,0,200,.35) 0%,rgba(80,0,160,.2) 40%,rgba(40,0,80,.1) 70%,transparent 100%);animation:rpe-pulse 5s ease-in-out infinite;}
        @keyframes rpe-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.08);opacity:1}}
      `}</style>
    </div>
  );
}

function ObsidianEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="obe-base" /><div className="obe-ref" />
      <style>{`
        .obe-base{position:absolute;inset:0;background:linear-gradient(135deg,rgba(15,15,20,.9) 0%,rgba(30,30,40,.7) 50%,rgba(10,10,15,.9) 100%);}
        .obe-ref{position:absolute;inset:0;background:linear-gradient(135deg,transparent 20%,rgba(255,255,255,.04) 40%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.02) 60%,transparent 80%);animation:obe-drift 12s ease-in-out infinite alternate;}
        @keyframes obe-drift{0%{transform:translateX(-8%) translateY(-5%) rotate(-1deg)}100%{transform:translateX(8%) translateY(5%) rotate(1deg)}}
      `}</style>
    </div>
  );
}

function MoonlightEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
      <div className="mle-glow" />
      <style>{`
        .mle-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% -10%,rgba(180,200,255,.45) 0%,rgba(100,130,220,.2) 40%,rgba(40,60,120,.1) 70%,transparent 100%);animation:mle-pulse 6s ease-in-out infinite;}
        @keyframes mle-pulse{0%,100%{opacity:.8;transform:scaleX(1)}50%{opacity:1;transform:scaleX(1.05)}}
      `}</style>
    </div>
  );
}

function NeonPulseEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="npe-cyan" /><div className="npe-pink" />
      <style>{`
        .npe-cyan{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(0,255,255,.3) 0%,transparent 60%);animation:npe1 4s ease-in-out infinite alternate;}
        .npe-pink{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(255,0,200,.3) 0%,transparent 60%);animation:npe2 5s ease-in-out infinite alternate;}
        @keyframes npe1{0%{opacity:.5;transform:scale(.9)}100%{opacity:1;transform:scale(1.1)}}
        @keyframes npe2{0%{opacity:1;transform:scale(1.1)}100%{opacity:.5;transform:scale(.9)}}
      `}</style>
    </div>
  );
}

function GlitchEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="gle-s1" /><div className="gle-s2" /><div className="gle-s3" />
      <style>{`
        .gle-s1,.gle-s2,.gle-s3{position:absolute;left:0;right:0;}
        .gle-s1{height:3px;background:rgba(255,255,255,.8);animation:gs1 3s steps(1) infinite;}
        .gle-s2{height:2px;background:rgba(0,255,200,.7);animation:gs2 4.5s steps(1) infinite;}
        .gle-s3{height:2px;background:rgba(255,0,180,.6);animation:gs3 2.5s steps(1) infinite;}
        @keyframes gs1{0%{top:10%;opacity:1}10%{top:35%;opacity:0}20%{top:70%;opacity:1}30%{top:20%;opacity:0}40%{top:55%;opacity:1}50%{opacity:0}60%{top:80%;opacity:1}70%,100%{opacity:0}}
        @keyframes gs2{0%{top:25%;opacity:0}15%{top:60%;opacity:1}30%{opacity:0}45%{top:15%;opacity:1}60%{opacity:0}75%{top:75%;opacity:1}90%,100%{opacity:0}}
        @keyframes gs3{0%{top:50%;opacity:1}20%{opacity:0}35%{top:30%;opacity:1}55%{opacity:0}70%{top:85%;opacity:1}85%,100%{opacity:0}}
      `}</style>
    </div>
  );
}

function HologramEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="hoe-lines" /><div className="hoe-scan" />
      <style>{`
        .hoe-lines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,.04) 3px,rgba(0,200,255,.04) 4px);animation:hoe-flicker .15s steps(1) infinite;}
        .hoe-scan{position:absolute;left:0;right:0;height:30%;background:linear-gradient(180deg,transparent 0%,rgba(0,220,255,.12) 50%,transparent 100%);animation:hoe-scan 4s linear infinite;top:-30%;}
        @keyframes hoe-flicker{0%,90%{opacity:1}91%,93%{opacity:.7}94%,96%{opacity:1}97%,99%{opacity:.85}100%{opacity:1}}
        @keyframes hoe-scan{0%{transform:translateY(0)}100%{transform:translateY(500%)}}
      `}</style>
    </div>
  );
}

function VaporwaveEffect() {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="vwe-bg" />
      <style>{`
        .vwe-bg{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,120,180,.4),rgba(100,60,200,.4),rgba(60,180,255,.35),rgba(255,80,150,.4));background-size:400% 400%;animation:vwe-shift 8s ease-in-out infinite;}
        @keyframes vwe-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ROUTER
// ════════════════════════════════════════════════════════════════════════════════

export function ProfileBackgroundEffect({ effect }: { effect: BackgroundEffect }) {
  if (effect === 'rain')            return <CanvasEffect make={makeRain} />;
  if (effect === 'thunderstorm')    return <CanvasEffect make={makeThunderstorm} />;
  if (effect === 'snowfall')        return <CanvasEffect make={makeSnowfall} />;
  if (effect === 'sakura')          return <CanvasEffect make={makeSakura} />;
  if (effect === 'autumn-leaves')   return <CanvasEffect make={makeAutumnLeaves} />;
  if (effect === 'starlight')       return <CanvasEffect make={makeStarlight} />;
  if (effect === 'galaxy')          return <CanvasEffect make={makeGalaxy} />;
  if (effect === 'meteor-shower')   return <CanvasEffect make={makeMeteorShower} />;
  if (effect === 'diamond-sparkle') return <CanvasEffect make={makeDiamondSparkle} />;
  if (effect === 'mana-flow')       return <CanvasEffect make={makeManaFlow} />;
  if (effect === 'dragon-flame')    return <CanvasEffect make={makeDragonFlame} />;
  if (effect === 'spirit-aura')     return <CanvasEffect make={makeSpiritAura} />;
  if (effect === 'shadow-monarch')  return <CanvasEffect make={makeShadowMonarch} />;
  if (effect === 'matrix')          return <CanvasEffect make={makeMatrix} />;
  if (effect === 'aurora')          return <AuroraEffect />;
  if (effect === 'eclipse')         return <EclipseEffect />;
  if (effect === 'golden-shine')    return <GoldenShineEffect />;
  if (effect === 'platinum-glow')   return <PlatinumGlowEffect />;
  if (effect === 'royal-purple')    return <RoyalPurpleEffect />;
  if (effect === 'obsidian')        return <ObsidianEffect />;
  if (effect === 'moonlight')       return <MoonlightEffect />;
  if (effect === 'neon-pulse')      return <NeonPulseEffect />;
  if (effect === 'glitch')          return <GlitchEffect />;
  if (effect === 'hologram')        return <HologramEffect />;
  if (effect === 'vaporwave')       return <VaporwaveEffect />;
  return null;
}
