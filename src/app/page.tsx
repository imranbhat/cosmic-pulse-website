"use client";
import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

/* ════════════════════════════════════════════
   THEME SYSTEM
   ════════════════════════════════════════════ */
type Theme = "dark" | "light";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

/* ════════════════════════════════════════════
   THEME TOGGLE BUTTON
   ════════════════════════════════════════════ */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="theme-toggle w-10 h-10 rounded-full flex items-center justify-center border transition-colors"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-light)',
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════
   INFINITY LOGO
   ════════════════════════════════════════════ */
function InfinityLogo({ className = "", size = 48 }: { className?: string; size?: number }) {
  const colors = { start: "#a78bfa", mid: "#00f0ff", end: "#c084fc" };

  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" className={className} fill="none">
      <defs>
        <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="50%" stopColor={colors.mid} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M50 50 C50 25,20 20,20 50 C20 80,50 75,50 50 C50 25,80 20,80 50 C80 80,50 75,50 50"
        transform="translate(50,0) scale(1.2)"
        stroke="url(#infGrad)" strokeWidth="3.5" strokeLinecap="round"
        className="infinity-path" filter="url(#glow)"
      />
      <path
        d="M50 50 C50 25,20 20,20 50 C20 80,50 75,50 50 C50 25,80 20,80 50 C80 80,50 75,50 50"
        transform="translate(50,0) scale(1.2)"
        stroke="url(#infGrad)" strokeWidth="10" strokeLinecap="round"
        opacity="0.15" className="infinity-path"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════
   ANIMATED COUNTER
   ════════════════════════════════════════════ */
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const inc = end / (duration / 16);
          const timer = setInterval(() => {
            start += inc;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".section-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ════════════════════════════════════════════
   STAR FIELD — reduced count for performance
   ════════════════════════════════════════════ */
function StarField() {
  const { theme } = useTheme();
  const [layers, setLayers] = useState<{ x: number; y: number; size: number; opacity: number; delay: number; duration: number }[][]>([]);

  useEffect(() => {
    const makeStar = (count: number, maxSize: number) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * maxSize + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 2,
      }));
    setLayers([makeStar(40, 1.5), makeStar(20, 2), makeStar(10, 2.5)]);
  }, []);

  if (theme === "light" || layers.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {layers.map((stars, li) => (
        <div key={li} className="absolute inset-0">
          {stars.map((s, si) => (
            <div
              key={si}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                background: li === 2 ? '#c4b5fd' : li === 1 ? '#a5b4fc' : '#f0f4ff',
                opacity: s.opacity,
                animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                boxShadow: li === 2 ? `0 0 ${s.size * 4}px rgba(196,181,253,0.5)` : 'none',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   SHOOTING STARS
   ════════════════════════════════════════════ */
function ShootingStars() {
  const { theme } = useTheme();
  const [stars, setStars] = useState<{ top: string; left: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setStars(Array.from({ length: 3 }, (_, i) => ({
      top: Math.random() * 50 + '%',
      left: Math.random() * 40 + '%',
      delay: i * 4 + Math.random() * 2,
      duration: 2.5 + Math.random() * 1.5,
    })));
  }, []);

  if (theme === "light" || stars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   NEBULA CLOUDS
   ════════════════════════════════════════════ */
function NebulaClouds() {
  const { theme } = useTheme();
  if (theme === "light") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute rounded-full" style={{ top: '10%', left: '5%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'floatSlow 25s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ top: '50%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(30,64,175,0.06) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatSlow 30s ease-in-out 5s infinite' }} />
      <div className="absolute rounded-full" style={{ bottom: '10%', left: '30%', width: '450px', height: '450px', background: 'radial-gradient(ellipse, rgba(191,0,255,0.05) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatSlow 22s ease-in-out 3s infinite' }} />
    </div>
  );
}

/* ════════════════════════════════════════════
   LIGHT MODE DECORATIONS
   ════════════════════════════════════════════ */
function LightDecorations() {
  const { theme } = useTheme();
  if (theme !== "light") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large blurred orbs for depth */}
      <div className="absolute rounded-full" style={{ top: '-10%', right: '-8%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)', filter: 'blur(40px)', animation: 'floatSlow 20s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ bottom: '5%', left: '-8%', width: '550px', height: '550px', background: 'radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, rgba(8,145,178,0.03) 40%, transparent 70%)', filter: 'blur(40px)', animation: 'floatSlow 25s ease-in-out 3s infinite' }} />
      <div className="absolute rounded-full" style={{ top: '35%', left: '45%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(191,0,255,0.06) 0%, transparent 65%)', filter: 'blur(50px)', animation: 'floatSlow 22s ease-in-out 6s infinite' }} />
      <div className="absolute rounded-full" style={{ top: '10%', left: '20%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(67,97,238,0.07) 0%, transparent 70%)', filter: 'blur(35px)', animation: 'floatSlow 18s ease-in-out 2s infinite' }} />

      {/* Decorative rings */}
      <div className="absolute" style={{ top: '15%', right: '12%', width: '200px', height: '200px', border: '1px solid rgba(124,58,237,0.08)', borderRadius: '50%', animation: 'orbit 40s linear infinite' }} />
      <div className="absolute" style={{ bottom: '20%', left: '8%', width: '150px', height: '150px', border: '1px solid rgba(0,240,255,0.06)', borderRadius: '50%', animation: 'orbit 30s linear infinite reverse' }} />
    </div>
  );
}

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const d = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Solutions", href: "#solutions" },
    { label: "Products", href: "#products" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "shadow-2xl" : ""}`}
      style={{ background: scrolled ? 'var(--navbar-bg)' : 'transparent', backdropFilter: scrolled ? 'blur(30px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'none', borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group">
            <InfinityLogo size={44} />
            <div>
              <span className="text-xl font-bold tracking-tight font-display">
                <span className="text-heading">Cosmic</span><span className="gradient-text">Pulse</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-muted -mt-1">Beyond Infinity</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-body hover:text-heading transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-linear-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <ThemeToggle />
            <a href="#contact" className="btn-glow px-6 py-2.5 rounded-full bg-linear-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white">Get Started</a>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="text-heading" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden" style={{ background: 'var(--bg-surface-strong)', borderTop: '1px solid var(--border-subtle)', backdropFilter: 'blur(30px)' }}>
          <div className="px-6 py-4 space-y-3">
            {links.map((l) => (<a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-body hover:text-heading py-2 transition-colors">{l.label}</a>))}
            <a href="#contact" className="block text-center px-6 py-2.5 rounded-full bg-linear-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white">Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */
function Hero() {
  const { theme } = useTheme();
  const d = theme === "dark";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      {d && <div className="absolute inset-0 space-bg opacity-60" />}
      {d && <div className="absolute inset-0 nebula-bg" />}

      {/* Aurora bands (dark only) */}
      {d && <div className="aurora-band" style={{ top: '15%', left: '-25%', transform: 'rotate(-3deg)' }} />}
      {d && <div className="aurora-band" style={{ top: '65%', left: '-25%', transform: 'rotate(2deg)', animationDelay: '4s' }} />}

      {/* Planet with ring (dark only) */}
      {d && (
        <div className="absolute" style={{ top: '12%', right: '8%', width: '140px', height: '140px' }}>
          <div className="w-full h-full rounded-full" style={{
            background: 'radial-gradient(circle at 35% 35%, #4c1d95, #1e1b4b, #020010)',
            boxShadow: '0 0 60px rgba(124,58,237,0.3), 0 0 120px rgba(124,58,237,0.1), inset -20px -10px 30px rgba(0,0,0,0.6)',
            animation: 'planetPulse 6s ease-in-out infinite',
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
            width: '220px', height: '50px', border: '2px solid rgba(167,139,250,0.25)', borderRadius: '50%',
            transform: 'translate(-50%, -50%) rotateX(70deg)', animation: 'ringPulse 6s ease-in-out infinite',
          }} />
        </div>
      )}

      {/* Small planet (dark only) */}
      {d && (
        <div className="absolute" style={{ bottom: '18%', left: '6%', width: '60px', height: '60px' }}>
          <div className="w-full h-full rounded-full" style={{
            background: 'radial-gradient(circle at 40% 40%, #0e7490, #164e63, #020010)',
            boxShadow: '0 0 30px rgba(0,240,255,0.2)', animation: 'float 8s ease-in-out infinite',
          }} />
        </div>
      )}

      {/* Orbit rings (dark only) */}
      {d && (
        <>
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] border border-purple-500/[0.06] rounded-full" style={{ animation: 'orbit 30s linear infinite' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400/40" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] border border-cyan-500/[0.06] rounded-full" style={{ animation: 'orbit 22s linear infinite reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] border border-pink-500/[0.05] rounded-full" style={{ animation: 'orbit 18s linear infinite' }} />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8" style={{ borderColor: d ? 'rgba(124,58,237,0.2)' : 'var(--border-light)' }}>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ backgroundColor: 'var(--accent-cyan)' }} />
          <span className="text-sm text-body">Pioneering the Future of AI Agents</span>
        </div>

        <div className="flex justify-center mb-8" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <InfinityLogo size={130} />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[96px] font-black tracking-tight mb-4 font-display">
          <span className="block text-heading" style={{ textShadow: d ? '0 0 80px rgba(124,58,237,0.2)' : 'none' }}>Cosmic</span>
          <span className="block gradient-text">Pulse</span>
        </h1>

        <p className="text-lg md:text-xl uppercase tracking-[0.35em] mb-6 glow-text-cyan text-accent-cyan" style={{ opacity: 0.7 }}>Beyond Infinity</p>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-body leading-relaxed mb-10">
          We build autonomous AI agents that think, reason, and act — transforming enterprises
          with intelligent systems that go beyond automation into true cognitive partnership.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="#solutions" className="btn-glow px-8 py-4 rounded-full bg-linear-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg shadow-xl shadow-purple-900/30">Explore Our AI Solutions</a>
          <a href="#services" className="px-8 py-4 rounded-full font-medium transition-all text-heading" style={{ border: '1px solid var(--border-light)', background: d ? 'transparent' : 'var(--bg-surface)' }}>Our Services</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: 50, suffix: "+", label: "Clients" },
            { value: 99, suffix: "%", label: "Uptime Guarantee" },
            { value: 50, suffix: "M+", label: "AI Tasks Automated" },
            { value: 8, suffix: "+", label: "Countries Served" },
          ].map((s) => (
            <div key={s.label} className="text-center glass rounded-xl py-4 px-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-3xl md:text-4xl font-bold gradient-text font-display">
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: `linear-gradient(to top, var(--gradient-fade), transparent)` }} />
    </section>
  );
}

/* ════════════════════════════════════════════
   SERVICES
   ════════════════════════════════════════════ */
function Services() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const services = [
    { icon: "🤖", title: "AI Agent Development", description: "Custom autonomous AI agents that perceive, decide, and act across complex enterprise workflows with human-level reasoning.", gradient: "from-purple-500 to-violet-600" },
    { icon: "☁️", title: "Cloud & Infrastructure", description: "Scalable cloud architecture, DevOps automation, and infrastructure modernization built for AI-native workloads.", gradient: "from-cyan-500 to-blue-600" },
    { icon: "⚡", title: "Intelligent Automation", description: "End-to-end process automation powered by AI, from RPA to cognitive workflows that learn and adapt autonomously.", gradient: "from-pink-500 to-rose-600" },
    { icon: "🛡️", title: "Cybersecurity & AI Defense", description: "AI-driven threat detection, zero-trust architecture, and autonomous security operations center (SOC) solutions.", gradient: "from-emerald-500 to-teal-600" },
    { icon: "📊", title: "Data & Analytics", description: "Advanced analytics platforms, real-time data pipelines, and AI-powered business intelligence dashboards.", gradient: "from-amber-500 to-orange-600" },
    { icon: "📱", title: "Product Engineering", description: "Full-stack product development from ideation to launch — web, mobile, and AI-native SaaS platforms.", gradient: "from-violet-500 to-purple-600" },
  ];

  const techServices = [
    { logo: "☕", name: "Java & Spring Boot", desc: "Enterprise-grade microservices, Spring Cloud ecosystems, reactive programming, and high-performance distributed systems with Java 21+.", tags: ["Spring Boot", "Spring Cloud", "Hibernate", "Kafka", "Microservices"] },
    { logo: "🐍", name: "Python & AI/ML", desc: "Full-stack Python development — from Django/FastAPI backends to AI/ML pipelines with TensorFlow, PyTorch, and LangChain integrations.", tags: ["Django", "FastAPI", "TensorFlow", "PyTorch", "LangChain"] },
    { logo: "🔷", name: ".NET & C#", desc: "Enterprise .NET solutions with ASP.NET Core, Blazor, Azure-native architectures, and legacy modernization from .NET Framework to .NET 8+.", tags: ["ASP.NET Core", "Blazor", "Entity Framework", "Azure Functions", "MAUI"] },
    { logo: "🔵", name: "Go (Golang)", desc: "High-performance backends, cloud-native tools, Kubernetes operators, and CLI applications built with Go for maximum concurrency and speed.", tags: ["Gin", "gRPC", "Kubernetes Operators", "CLI Tools", "Microservices"] },
    { logo: "🟠", name: "AWS Cloud Services", desc: "Full AWS ecosystem — from Lambda serverless to EKS containers, SageMaker ML, and Well-Architected infrastructure-as-code deployments.", tags: ["Lambda", "EKS", "SageMaker", "CDK", "S3/DynamoDB"] },
    { logo: "🔴", name: "Google Cloud (GCP)", desc: "GCP-native solutions with Vertex AI, BigQuery analytics, Cloud Run serverless, GKE Kubernetes, and Anthos hybrid-cloud deployments.", tags: ["Vertex AI", "BigQuery", "Cloud Run", "GKE", "Pub/Sub"] },
    { logo: "🟦", name: "Microsoft Azure", desc: "Azure enterprise solutions — from Azure OpenAI Service to AKS, Cosmos DB, Azure DevOps pipelines, and hybrid cloud with Azure Arc.", tags: ["Azure OpenAI", "AKS", "Cosmos DB", "Azure DevOps", "Logic Apps"] },
    { logo: "⚛️", name: "React & Next.js", desc: "Modern frontend engineering with React 19, Next.js, server components, and full-stack TypeScript applications with edge-first architecture.", tags: ["React 19", "Next.js", "TypeScript", "Tailwind", "Vercel"] },
  ];

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {d && <div className="absolute inset-0 space-bg opacity-30" />}
      <div className="absolute inset-0 nebula-section" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-cyan mb-4">✦ What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Enterprise-Grade <span className="gradient-text">IT Services</span></h2>
          <p className="max-w-2xl mx-auto text-body text-lg">From AI agent development to cloud infrastructure, we deliver end-to-end technology solutions that propel your business beyond infinity.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service.title} className="section-animate gradient-border card-hover rounded-2xl p-8 group cursor-pointer" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br ${service.gradient} mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-heading transition-colors">{service.title}</h3>
              <p className="text-body leading-relaxed text-sm">{service.description}</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-accent-purple transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
          ))}
        </div>

        {/* ── Technology Services Grid ── */}
        <div className="mt-32 section-animate">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-amber mb-4">✦ Technology Expertise</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">
              Full-Stack <span className="gradient-text">Technology Services</span>
            </h2>
            <p className="max-w-2xl mx-auto text-body text-lg">
              Deep expertise across modern technology stacks — from enterprise Java to cloud-native Go, AI-powered Python to multi-cloud infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {techServices.map((ts, i) => (
              <div key={ts.name} className="section-animate gradient-border card-hover rounded-2xl p-6 group cursor-pointer" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="text-3xl mb-3">{ts.logo}</div>
                <h3 className="text-lg font-bold mb-2 text-heading transition-colors font-display">{ts.name}</h3>
                <p className="text-body text-xs leading-relaxed mb-4">{ts.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ts.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full text-body" style={{ background: 'var(--tag-bg)', border: '1px solid var(--tag-border)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   AI SOLUTIONS
   ════════════════════════════════════════════ */
function Solutions() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const solutions = [
    { tag: "⭐ Flagship", title: "Agentic AI Platform", description: "Deploy fleets of autonomous AI agents that collaborate, reason, and execute complex multi-step tasks across your enterprise systems.", features: ["Multi-agent orchestration", "Tool-use & API integration", "Memory & context management", "Human-in-the-loop controls", "Real-time monitoring dashboard"], gradient: "from-purple-600 via-violet-600 to-cyan-500" },
    { tag: "🏢 Enterprise", title: "Cognitive Process Automation", description: "Go beyond RPA with AI that understands documents, makes decisions, and handles exceptions — just like your best employees.", features: ["Document intelligence (OCR + NLU)", "Decision automation engine", "Exception handling AI", "Process mining & optimization", "Compliance & audit trails"], gradient: "from-cyan-500 via-blue-600 to-purple-600" },
    { tag: "🚀 Innovation", title: "AI Co-Pilot Suite", description: "Embed intelligent AI copilots into every workflow — from code generation to customer support to strategic planning.", features: ["Custom LLM fine-tuning", "RAG-powered knowledge base", "Multi-modal AI interactions", "Enterprise SSO & RBAC", "Usage analytics & ROI tracking"], gradient: "from-pink-500 via-purple-600 to-violet-600" },
  ];

  return (
    <section id="solutions" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--bg-body), var(--bg-alt), var(--bg-body))` }} />
      {d && <div className="absolute inset-0 space-bg opacity-20" />}
      <div className="absolute inset-0 nebula-section-alt" />

      {/* Constellation decoration (dark only) */}
      {d && (
        <svg className="absolute top-20 left-10 w-64 h-64 opacity-[0.08] pointer-events-none" viewBox="0 0 200 200">
          <circle cx="30" cy="40" r="2" fill="#a78bfa" /><circle cx="80" cy="20" r="1.5" fill="#a78bfa" /><circle cx="120" cy="60" r="2" fill="#c4b5fd" /><circle cx="160" cy="30" r="1.5" fill="#a78bfa" /><circle cx="100" cy="100" r="2" fill="#c4b5fd" />
          <line x1="30" y1="40" x2="80" y2="20" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" /><line x1="80" y1="20" x2="120" y2="60" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" /><line x1="120" y1="60" x2="160" y2="30" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" /><line x1="120" y1="60" x2="100" y2="100" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />
        </svg>
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-purple mb-4">✦ AI-Powered Solutions</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Agentic AI That <span className="gradient-text-alt">Thinks & Acts</span></h2>
          <p className="max-w-2xl mx-auto text-body text-lg">Our AI solutions go beyond simple automation. They reason, plan, and execute complex workflows autonomously — while keeping humans in control.</p>
        </div>
        <div className="space-y-8">
          {solutions.map((sol, i) => (
            <div key={sol.title} className="section-animate gradient-border card-hover rounded-2xl overflow-hidden" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-linear-to-r ${sol.gradient} mb-4`}>{sol.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-heading font-display">{sol.title}</h3>
                  <p className="text-body leading-relaxed mb-6">{sol.description}</p>
                  <a href="#contact" className="inline-flex items-center gap-2 text-accent-cyan transition-colors font-medium">Schedule a Demo <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>
                </div>
                <div className="w-full lg:w-auto lg:min-w-[320px]">
                  <div className="glass rounded-xl p-6">
                    <h4 className="text-sm uppercase tracking-wider text-muted mb-4">Key Capabilities</h4>
                    <ul className="space-y-3">{sol.features.map((f) => (<li key={f} className="flex items-center gap-3 text-sm text-body"><span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-400 to-cyan-400 shrink-0" />{f}</li>))}</ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRODUCTS
   ════════════════════════════════════════════ */
function Products() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const products = [
    { name: "PulseAgent", tagline: "Autonomous AI Workforce", description: "Enterprise-grade platform for deploying, managing, and monitoring AI agents at scale. Built with Python, LangChain, and multi-cloud support.", icon: "🤖", tech: ["Python", "LangChain", "AWS/GCP/Azure"] },
    { name: "NexusFlow", tagline: "Intelligent Workflow Engine", description: "Visual workflow builder powered by AI that automatically optimizes business processes. Java Spring Boot backend with React frontend.", icon: "⚡", tech: ["Java", "Spring Boot", "React", "Kafka"] },
    { name: "CogniSense", tagline: "AI Analytics Platform", description: "Real-time analytics with predictive AI that surfaces insights before you ask. Built on Go microservices and BigQuery.", icon: "📊", tech: ["Go", "BigQuery", "Python", "Next.js"] },
    { name: "ShieldAI", tagline: "Autonomous Cyber Defense", description: "AI-powered security platform that detects, responds, and adapts to threats in real-time. .NET Core backend with Azure Sentinel.", icon: "🛡️", tech: [".NET Core", "Azure", "Python ML", "Go"] },
    { name: "CloudForge", tagline: "Multi-Cloud Orchestrator", description: "Unified control plane to manage infrastructure across AWS, GCP, and Azure with AI-powered cost optimization and auto-scaling.", icon: "☁️", tech: ["Go", "Terraform", "AWS", "GCP", "Azure"] },
    { name: "CodePulse", tagline: "AI Dev Platform", description: "Full-stack AI-powered development platform with code generation, review, and deployment pipelines across Java, Python, Go, and .NET.", icon: "💻", tech: ["Python", "Java", "Go", ".NET", "React"] },
  ];

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      {d && <div className="absolute inset-0 space-bg opacity-25" />}
      <div className="absolute inset-0 nebula-section" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-emerald mb-4">✦ Our Products</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Products Built for the <span className="gradient-text">AI Era</span></h2>
          <p className="max-w-2xl mx-auto text-body text-lg">Our suite of AI-native products empowers enterprises to operate faster, smarter, and more autonomously.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div key={p.name} className="section-animate gradient-border card-hover rounded-2xl p-8 group" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4">{p.icon}</div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-heading font-display">{p.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full glass text-body">{p.tagline}</span>
              </div>
              <p className="text-body mb-4 text-sm">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-tag-bg)', border: '1px solid var(--accent-tag-border)', color: 'var(--accent-tag-text)' }}>{t}</span>
                ))}
              </div>
              <a href="#contact" className="text-sm font-semibold text-accent-cyan transition-colors">Request Access →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TECH STACK
   ════════════════════════════════════════════ */
function TechStack() {
  const { theme } = useTheme();
  const d = theme === "dark";
  const techs = ["OpenAI", "LangChain", "AWS", "Azure", "Google Cloud", "Kubernetes", "PyTorch", "TensorFlow", "Snowflake", "Databricks", "Docker", "Terraform"];
  return (
    <section className="relative py-20 overflow-hidden" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      {d && <div className="absolute inset-0 space-bg opacity-15" />}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-dim uppercase tracking-widest mb-10">✦ Powered By & Partnered With ✦</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {techs.map((t) => (<span key={t} className="text-muted hover:text-accent-purple transition-colors text-lg font-medium cursor-default font-display">{t}</span>))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   ABOUT
   ════════════════════════════════════════════ */
function About() {
  const { theme } = useTheme();
  const d = theme === "dark";
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--bg-body), var(--bg-alt), var(--bg-body))` }} />
      {d && <div className="absolute inset-0 space-bg opacity-20" />}
      <div className="absolute inset-0 nebula-section-alt" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="section-animate">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-purple mb-4">✦ Why CosmicPulse</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Where <span className="gradient-text">Innovation</span> Meets Execution</h2>
            <p className="text-body text-lg leading-relaxed mb-8">CosmicPulse was founded on a singular vision: to build AI systems that don&apos;t just assist — they autonomously drive outcomes. We combine deep AI research expertise with battle-tested engineering to deliver solutions that actually work in production.</p>
            <div className="space-y-6">
              {[
                { title: "AI-First DNA", desc: "Every solution is built with AI at its core, not bolted on as an afterthought." },
                { title: "Production-Ready", desc: "We ship systems that run at enterprise scale with 99.99% reliability." },
                { title: "Human-Centered AI", desc: "Our agents amplify human capability — they don't replace human judgment." },
                { title: "Continuous Innovation", desc: "We invest 30% of revenue in R&D to stay at the frontier of AI." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-sm">✦</div>
                  <div><h4 className="font-semibold text-heading mb-1">{item.title}</h4><p className="text-sm text-body">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-animate" style={{ transitionDelay: "0.2s" }}>
            <div className="relative glass rounded-3xl p-8 overflow-hidden">
              <div className="absolute inset-0" style={{ background: d ? 'linear-gradient(to bottom right, rgba(88,28,135,0.1), rgba(8,145,178,0.1))' : 'linear-gradient(to bottom right, rgba(124,58,237,0.03), rgba(8,145,178,0.03))' }} />
              <div className="relative space-y-6">
                {[
                  { label: "AI Models Deployed", value: "2,500+", trend: "+340% YoY" },
                  { label: "Average ROI for Clients", value: "12.4x", trend: "Within 6 months" },
                  { label: "Data Points Processed Daily", value: "8.7B", trend: "Real-time" },
                  { label: "Engineering Team", value: "400+", trend: "AI/ML specialists" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between p-4 rounded-xl transition-colors" style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)' }}>
                    <div><p className="text-sm text-body">{m.label}</p><p className="text-2xl font-bold gradient-text font-display">{m.value}</p></div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--stat-bg)', border: '1px solid var(--stat-border)', color: 'var(--stat-text)' }}>{m.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════ */
function Testimonials() {
  const { theme } = useTheme();
  const testimonials = [
    { quote: "CosmicPulse's AI agents reduced our document processing time by 94%. What used to take our team days now happens in minutes with higher accuracy.", author: "Sarah Chen", role: "CTO, FinanceFlow Global", avatar: "SC" },
    { quote: "The Agentic AI Platform transformed our customer service. AI agents now handle 80% of inquiries autonomously, and our CSAT scores have never been higher.", author: "Marcus Williams", role: "VP Operations, TechScale Inc.", avatar: "MW" },
    { quote: "Their cybersecurity AI detected and neutralized a zero-day threat that would have cost us millions. CosmicPulse doesn't just deliver — they protect.", author: "Dr. Aisha Patel", role: "CISO, MedSecure Health", avatar: "AP" },
  ];
  return (
    <section className="relative py-32 overflow-hidden">
      {theme === "dark" && <div className="absolute inset-0 space-bg opacity-25" />}
      <div className="absolute inset-0 nebula-section" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-cyan mb-4">✦ Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-heading">Trusted by <span className="gradient-text">Industry Leaders</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.author} className="section-animate gradient-border rounded-2xl p-8" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="flex gap-1 mb-4 text-accent-amber">★★★★★</div>
              <p className="text-body leading-relaxed mb-6 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                <div><p className="font-semibold text-heading text-sm">{t.author}</p><p className="text-xs text-muted">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA BANNER
   ════════════════════════════════════════════ */
function CTABanner() {
  const { theme } = useTheme();
  const d = theme === "dark";
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: d ? 'linear-gradient(to right, rgba(88,28,135,0.2), rgba(91,33,182,0.3), rgba(8,145,178,0.2))' : 'linear-gradient(to right, rgba(124,58,237,0.05), rgba(147,51,234,0.08), rgba(8,145,178,0.05))' }} />
      {d && <div className="absolute inset-0 space-bg opacity-30" />}
      {d && <div className="aurora-band" style={{ top: '30%', left: '-25%' }} />}
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center section-animate">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Ready to Go <span className="gradient-text">Beyond Infinity?</span></h2>
        <p className="text-body text-lg mb-10 max-w-2xl mx-auto">Join 500+ enterprises already leveraging CosmicPulse&apos;s AI Agentic technology to transform their operations and outpace the competition.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" className="btn-glow px-10 py-4 rounded-full bg-linear-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg">Book a Discovery Call</a>
          <a href="#solutions" className="px-8 py-4 rounded-full font-medium transition-all text-heading" style={{ border: '1px solid var(--border-light)', background: d ? 'transparent' : 'var(--bg-surface)' }}>See Our Solutions</a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CONTACT
   ════════════════════════════════════════════ */
function Contact() {
  const { theme } = useTheme();
  const d = theme === "dark";
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--bg-body), var(--bg-alt), var(--bg-body))` }} />
      {d && <div className="absolute inset-0 space-bg opacity-15" />}
      <div className="absolute inset-0 nebula-section-alt" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="section-animate">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-accent-cyan mb-4">✦ Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-heading">Let&apos;s Build the <span className="gradient-text">Future Together</span></h2>
            <p className="text-body text-lg mb-10">Whether you&apos;re exploring AI for the first time or scaling existing systems, our team is ready to help you achieve breakthrough results.</p>
            <div className="space-y-6">
              {[
                { icon: "📧", label: "Email", value: "hello@cosmicpulse.ai" },
                { icon: "📍", label: "Headquarters", value: "San Francisco, CA | London, UK | Bangalore, IN" },
                { icon: "📞", label: "Phone", value: "+1 (555) 0199" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div><p className="text-xs text-muted uppercase tracking-wider">{item.label}</p><p className="text-heading">{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-animate" style={{ transitionDelay: "0.2s" }}>
            <div className="gradient-border rounded-2xl p-8">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-body mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl text-heading placeholder-gray-500 focus:outline-none transition-colors" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl text-heading placeholder-gray-500 focus:outline-none transition-colors" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-body mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl text-heading placeholder-gray-500 focus:outline-none transition-colors" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm text-body mb-2">Company</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl text-heading placeholder-gray-500 focus:outline-none transition-colors" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} placeholder="Company name" />
                </div>
                <div>
                  <label className="block text-sm text-body mb-2">How can we help?</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl text-heading placeholder-gray-500 focus:outline-none transition-colors resize-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)' }} placeholder="Tell us about your project or challenge..." />
                </div>
                <button type="submit" className="w-full btn-glow py-4 rounded-xl bg-linear-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg border-0 cursor-pointer">Send Message</button>
                <p className="text-xs text-dim text-center">We&apos;ll respond within 24 hours. No spam, ever.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
function Footer() {
  const { theme } = useTheme();
  const d = theme === "dark";
  return (
    <footer className="relative pt-16 pb-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      {d && <div className="absolute inset-0 space-bg opacity-10" />}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <InfinityLogo size={36} />
              <span className="text-lg font-bold font-display"><span className="text-heading">Cosmic</span><span className="gradient-text">Pulse</span></span>
            </div>
            <p className="text-sm text-muted mb-4">Pioneering AI Agentic solutions that take businesses beyond infinity.</p>
            <div className="flex gap-3">
              {["X", "Li", "GH"].map((s) => (<a key={s} href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs text-body hover:text-heading transition-colors">{s}</a>))}
            </div>
          </div>
          {[
            { title: "Solutions", links: ["Agentic AI Platform", "Cognitive Automation", "AI Co-Pilot Suite", "Custom AI Development"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
            { title: "Resources", links: ["Documentation", "Case Studies", "API Reference", "Contact Sales"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-heading mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">{col.links.map((link) => (<li key={link}><a href="#" className="text-sm text-muted hover:text-body transition-colors">{link}</a></li>))}</ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs text-dim">&copy; {new Date().getFullYear()} CosmicPulse Technologies. All rights reserved.</p>
          <div className="flex gap-6">{["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (<a key={link} href="#" className="text-xs text-dim hover:text-body transition-colors">{link}</a>))}</div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
export default function Home() {
  useScrollReveal();
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}

function HomeContent() {
  const { theme } = useTheme();
  useScrollReveal();
  return (
    <main className="relative overflow-hidden noise-overlay" style={{ background: 'var(--bg-body)' }}>
      <StarField />
      <NebulaClouds />
      <ShootingStars />
      <LightDecorations />
      <Navbar />
      <Hero />
      <Services />
      <Solutions />
      <Products />
      <TechStack />
      <About />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
    </main>
  );
}
