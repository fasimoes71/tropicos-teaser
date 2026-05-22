/* tropicOS — homepage temporária
   Hero + helix de ferramentas + texto rotativo de princípios */

const { useState, useEffect, useRef } = React;

// ── Tools (17) ────────────────────────────────────────────
const TOOLS = [
  { id: 'story-arc',         name: 'Story Arc Engine',         desc: 'Tensão narrativa em atos, batidas, escaladas e payoff.', img: 'assets/tools/story-arc.png' },
  { id: 'illustration-dna',  name: 'Illustration DNA',         desc: 'Decifra o DNA visual de uma marca em camadas.',          img: 'assets/tools/illustration-dna.png' },
  { id: 'voice',             name: 'Voice Intelligence',       desc: 'A voz da marca como gramática viva.',                    img: 'assets/tools/voice-intelligence.png' },
  { id: 'cultural',          name: 'Cultural Opportunities',   desc: 'Lê o presente, sugere onde pousar.',                     img: 'assets/tools/cultural-opportunities.png' },
  { id: 'oblique',           name: 'Oblique Catalyst',         desc: 'Provocações para tirar a ideia do eixo.',                img: 'assets/tools/oblique-catalyst.png' },
  { id: 'storyboard',        name: 'Storyboard',               desc: 'Do brief ao quadro a quadro.',                           img: 'assets/tools/storyboard.png' },
  { id: 'mockup',            name: 'Mockup Generator',         desc: 'Mockups fotorrealistas, do briefing ao asset.',          img: 'assets/tools/mockup-gen.png' },
  { id: 'layout',            name: 'Layout Generator',         desc: 'Composições editoriais a partir de um esqueleto.',       img: 'assets/tools/layout-generator.png' },
  { id: 'personas-ed',       name: 'Personas Editorial',       desc: 'Pessoas com rosto, voz e uma terça-feira.',              img: 'assets/tools/personas-editorial.png' },
  { id: 'personas',          name: 'Personas Creator',         desc: 'Personas construídas em camadas estratégicas.',          img: 'assets/tools/personas-creator.png' },
  { id: 'branded-persona',   name: 'Branded Persona Editorial',desc: 'A persona da marca, em formato editorial.',              img: 'assets/tools/branded-persona-editorial.png' },
  { id: 'comms',             name: 'Communication Journey',    desc: 'Mapeia a jornada do silêncio à conversa.',               img: 'assets/tools/communication-journey.png' },
  { id: 'battle',            name: 'Creative Battle',          desc: 'Coloca ideias frente a frente. Vence quem corta.',       img: 'assets/tools/creative-battle.png' },
  { id: 'strategy',          name: 'Creative Strategy',        desc: 'Da pergunta ao plano, em um movimento contínuo.',        img: 'assets/tools/creative-strategy.png' },
  { id: 'packshots',         name: 'Packshots',                desc: 'Embalagens prontas para campanha.',                      img: 'assets/tools/packshots.png' },
  { id: 'mapping',           name: 'Project Mapping',          desc: 'Topografia do projeto, do brief ao deliverable.',        img: 'assets/tools/project-mapping.png' },
  { id: 'moodboard',         name: 'Moodboard',                desc: 'Coleção de imagens organizada por intenção.',            img: 'assets/tools/cena-8.png' },
];

// ── Princípios (texto rotativo) ───────────────────────────
const PRINCIPLES = [
  'Estratégia, criatividade e conteúdo em fluxo contínuo, orquestrados por inteligência artificial.',
  'Estratégia: transformando cultura em oportunidade.',
  'Fricção criativa: transformando resistência em pensamento original.',
  'Conteúdo: escalando profundidade, não apenas volume.',
  'Jornada e Apresentação: seu atalho até a entrega.',
  'Um sistema fechado de inteligência e produção, onde estratégia e execução se informam continuamente.',
];

// ── Launch date ───────────────────────────────────────────
// 22 set 2026, 09:00 BRT — primavera no hemisfério sul.
const LAUNCH_DATE = new Date('2026-09-22T09:00:00-03:00');

// ── Countdown hook ────────────────────────────────────────
function useCountdown(target) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const units = [
    { label: 'Dias',     n: days },
    { label: 'Horas',    n: hours },
    { label: 'Minutos',  n: minutes },
    { label: 'Segundos', n: seconds },
  ];
  return (
    <div className="countdown" aria-label="Contagem regressiva até o lançamento">
      {units.map(u => (
        <div className="countdown-unit" key={u.label}>
          <div className="countdown-num">{String(u.n).padStart(2, '0')}</div>
          <div className="countdown-label">{u.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Princípios rotativos ──────────────────────────────────
function PrinciplesTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % PRINCIPLES.length), 3600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="principle-stack" aria-live="polite">
      {PRINCIPLES.map((p, i) => (
        <div key={i}
             className={`principle ${i === idx ? 'active' : ''}`}>
          {p}
        </div>
      ))}
    </div>
  );
}

// ── Helix ─────────────────────────────────────────────────
// Cards travel as beads on a vertical 3D helix string.
// Each card has a "progress" s ∈ [0,1) — angle and Y derive from it.
function Helix({ count, speed, cardStyle }) {
  const items = TOOLS.slice(0, count);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, progress: 0 });
  const progressRef = useRef(0);
  const stageRef = useRef(null);

  // speed slider: 1–10 → units/sec 0.01–0.10. Default 4 → 25s/cycle.
  const unitsPerSec = (speed || 4) * 0.01;

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    let raf, last = performance.now();
    function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current && !draggingRef.current) {
        setProgress(p => (p + unitsPerSec * dt + 1) % 1);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [unitsPerSec]);

  // Pause only when the cursor is inside a small central zone (where the
  // front-most card sits). Lets the rest of the stage stay alive.
  function handleMouseMove(e) {
    if (draggingRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    pausedRef.current = Math.abs(dx) < 110 && Math.abs(dy) < 105;
  }
  function handleMouseLeave() {
    pausedRef.current = false;
  }

  // Drag to manually rotate.
  function handlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, progress: progressRef.current };
    try { stageRef.current.setPointerCapture(e.pointerId); } catch (_) {}
    stageRef.current.classList.add('dragging');
  }
  function handlePointerMove(e) {
    if (!draggingRef.current) return;
    const stageW = stageRef.current.clientWidth || 1;
    const dx = e.clientX - dragStartRef.current.x;
    const next = (dragStartRef.current.progress + dx / stageW) % 1;
    setProgress(((next % 1) + 1) % 1);
  }
  function handlePointerUp(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { stageRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
    stageRef.current.classList.remove('dragging');
  }

  const RADIUS = 360;            // px from axis

  return (
    <div className="helix-stage"
         ref={stageRef}
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
         onPointerDown={handlePointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}>
      <div className="helix">
        {items.map((tool, i) => {
          const sBase = (i / items.length + progress) % 1;
          const angle = sBase * 360;
          // depth normalised (0 back → 1 front)
          const rad = angle * Math.PI / 180;
          const zNorm = (Math.cos(rad) + 1) / 2;
          const opacity = 0.18 + 0.82 * zNorm;
          const scale = (0.72 + 0.28 * zNorm) * 0.8;
          const blur = Math.pow(1 - zNorm, 1.4) * 8;
          return (
            <div className="helix-card-wrap" key={tool.id}
                 style={{
                   transform: `rotateY(${angle}deg) translateZ(${RADIUS}px) rotateY(${-angle}deg) scale(${scale})`,
                   opacity,
                   filter: `blur(${blur}px)`,
                   zIndex: Math.round(zNorm * 1000),
                   marginTop: cardStyle === 'compact' ? -84 : -101,
                 }}>
              <ToolCard tool={tool} idx={i} cardStyle={cardStyle} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolCard({ tool, idx, cardStyle }) {
  if (cardStyle === 'compact') {
    return (
      <div className="tool-card compact">
        <div className="num">{String(idx + 1).padStart(2, '0')} / 17</div>
        <div className="meta">
          <div className="name">{tool.name}</div>
          <div className="desc">{tool.desc}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="tool-card">
      <div className="illo">
        <img src={tool.img} alt="" draggable="false" />
      </div>
      <div className="meta">
        <div className="eyebrow">Tool · {String(idx + 1).padStart(2, '0')}</div>
        <div className="name">{tool.name}</div>
        <div className="desc">{tool.desc}</div>
      </div>
    </div>
  );
}

// ── Tweaks defaults ───────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "count": 11,
  "speed": 4,
  "cardStyle": "illustrated"
}/*EDITMODE-END*/;

// ── App ───────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="page">
      <header className="top">
        <div className="top-mark">
          <img className="top-mark-wordmark" src="assets/logo-wordmark-greenmark.svg" alt="tropicOS" />
        </div>
        <div className="status-pill">
          <span className="dot"></span>
          <span>Em breve</span>
        </div>
      </header>

      <section className="hero">
        <h1>O novo sistema operacional<br />para marcas.</h1>
      </section>

      <section className="helix-section" aria-label="Catálogo de ferramentas em hélice">
        <Helix count={t.count} speed={t.speed} cardStyle={t.cardStyle} />
      </section>

      <section className="principles-section">
        <PrinciplesTicker />
      </section>

      <footer className="footer">
        <div className="cap">tropicOS · em construção · 2026</div>
        <div className="cap editorial">17 ferramentas, 4 módulos, um sistema.</div>
      </footer>

      <TweaksPanel>
        <TweakSection label="Hélice">
          <TweakSlider label="Cards visíveis" value={t.count}
                       min={6} max={17} step={1}
                       onChange={(v) => setTweak('count', v)} />
          <TweakSlider label="Velocidade" value={t.speed}
                       min={1} max={10} step={1}
                       onChange={(v) => setTweak('speed', v)} />
          <TweakRadio label="Estilo do card" value={t.cardStyle}
                      options={[
                        { value: 'illustrated', label: 'Com ilustração' },
                        { value: 'compact',     label: 'Só texto' },
                      ]}
                      onChange={(v) => setTweak('cardStyle', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
