"use client";
import { useState, useEffect, useRef } from "react";

/* ─── INFINITY LOGO COMPONENT ─── */
function InfinityLogo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 200 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#bf00ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50 50 C50 25, 20 20, 20 50 C20 80, 50 75, 50 50 C50 25, 80 20, 80 50 C80 80, 50 75, 50 50"
        transform="translate(50, 0) scale(1.2)"
        stroke="url(#infinityGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        className="infinity-path"
        filter="url(#glow)"
      />
      {/* Inner glow pulse */}
      <path
        d="M50 50 C50 25, 20 20, 20 50 C20 80, 50 75, 50 50 C50 25, 80 20, 80 50 C80 80, 50 75, 50 50"
        transform="translate(50, 0) scale(1.2)"
        stroke="url(#infinityGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.2"
        className="infinity-path"
      />
    </svg>
  );
}

/* ─── ANIMATED COUNTER ─── */
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
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

/* ─── SCROLL REVEAL HOOK ─── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".section-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── PARTICLE BACKGROUND ─── */
function ParticleField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#00f0ff" : "#bf00ff",
            opacity: Math.random() * 0.5 + 0.1,
            animation: `particle ${Math.random() * 20 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── NAVIGATION ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-2xl shadow-purple-900/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <InfinityLogo size={44} />
            <div>
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Cosmic<span className="gradient-text">Pulse</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 -mt-1">
                Beyond Infinity
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-gray-300 hover:text-white transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <a
              href="#contact"
              className="btn-glow px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-white/5">
          <div className="px-6 py-4 space-y-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-300 hover:text-white py-2"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block text-center px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-semibold"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO SECTION ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] radial-glow" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] radial-glow-cyan opacity-50" />

      {/* Orbiting rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-500/10 rounded-full animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-cyan-500/10 rounded-full animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm text-gray-300">Pioneering the Future of AI Agents</span>
        </div>

        {/* Logo Mark */}
        <div className="flex justify-center mb-8 animate-float">
          <InfinityLogo size={120} />
        </div>

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="block text-white">Cosmic</span>
          <span className="block gradient-text">Pulse</span>
        </h1>

        <p className="text-lg md:text-xl text-cyan-300/80 uppercase tracking-[0.3em] mb-6 animate-fade-in glow-text-cyan" style={{ animationDelay: "0.3s" }}>
          Beyond Infinity
        </p>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          We build autonomous AI agents that think, reason, and act — transforming enterprises
          with intelligent systems that go beyond automation into true cognitive partnership.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="#solutions"
            className="btn-glow px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg shadow-xl shadow-purple-900/30 hover:shadow-purple-900/50 transition-shadow"
          >
            Explore Our AI Solutions
          </a>
          <a
            href="#services"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-all"
          >
            Our Services
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.8s" }}>
          {[
            { value: 500, suffix: "+", label: "Enterprise Clients" },
            { value: 99, suffix: "%", label: "Uptime Guarantee" },
            { value: 50, suffix: "M+", label: "AI Tasks Automated" },
            { value: 35, suffix: "+", label: "Countries Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
    </section>
  );
}

/* ─── SERVICES SECTION ─── */
function Services() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "AI Agent Development",
      description: "Custom autonomous AI agents that perceive, decide, and act across complex enterprise workflows with human-level reasoning.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      title: "Cloud & Infrastructure",
      description: "Scalable cloud architecture, DevOps automation, and infrastructure modernization built for AI-native workloads.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "Intelligent Automation",
      description: "End-to-end process automation powered by AI, from RPA to cognitive workflows that learn and adapt autonomously.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Cybersecurity & AI Defense",
      description: "AI-driven threat detection, zero-trust architecture, and autonomous security operations center (SOC) solutions.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      title: "Data & Analytics",
      description: "Advanced analytics platforms, real-time data pipelines, and AI-powered business intelligence dashboards.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: "Product Engineering",
      description: "Full-stack product development from ideation to launch — web, mobile, and AI-native SaaS platforms.",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] radial-glow opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-cyan-400 mb-4">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Enterprise-Grade <span className="gradient-text">IT Services</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            From AI agent development to cloud infrastructure, we deliver end-to-end technology
            solutions that propel your business beyond infinity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="section-animate gradient-border card-hover rounded-2xl p-8 group cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-purple-400 group-hover:text-cyan-400 transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI SOLUTIONS SECTION ─── */
function Solutions() {
  const solutions = [
    {
      tag: "Flagship",
      title: "Agentic AI Platform",
      description: "Deploy fleets of autonomous AI agents that collaborate, reason, and execute complex multi-step tasks across your enterprise systems.",
      features: ["Multi-agent orchestration", "Tool-use & API integration", "Memory & context management", "Human-in-the-loop controls", "Real-time monitoring dashboard"],
      gradient: "from-purple-600 via-violet-600 to-cyan-500",
    },
    {
      tag: "Enterprise",
      title: "Cognitive Process Automation",
      description: "Go beyond RPA with AI that understands documents, makes decisions, and handles exceptions — just like your best employees.",
      features: ["Document intelligence (OCR + NLU)", "Decision automation engine", "Exception handling AI", "Process mining & optimization", "Compliance & audit trails"],
      gradient: "from-cyan-500 via-blue-600 to-purple-600",
    },
    {
      tag: "Innovation",
      title: "AI Co-Pilot Suite",
      description: "Embed intelligent AI copilots into every workflow — from code generation to customer support to strategic planning.",
      features: ["Custom LLM fine-tuning", "RAG-powered knowledge base", "Multi-modal AI interactions", "Enterprise SSO & RBAC", "Usage analytics & ROI tracking"],
      gradient: "from-pink-500 via-purple-600 to-violet-600",
    },
  ];

  return (
    <section id="solutions" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0a2e] to-[#0a0a1a]" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] radial-glow-cyan opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-purple-400 mb-4">
            AI-Powered Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Agentic AI That <span className="gradient-text-alt">Thinks & Acts</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Our AI solutions go beyond simple automation. They reason, plan, and execute
            complex workflows autonomously — while keeping humans in control.
          </p>
        </div>

        <div className="space-y-8">
          {solutions.map((sol, i) => (
            <div
              key={sol.title}
              className="section-animate gradient-border card-hover rounded-2xl overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${sol.gradient} mb-4`}>
                    {sol.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {sol.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{sol.description}</p>
                  <a href="#contact" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Schedule a Demo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
                <div className="w-full lg:w-auto lg:min-w-[320px]">
                  <div className="glass rounded-xl p-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Key Capabilities</h4>
                    <ul className="space-y-3">
                      {sol.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
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

/* ─── PRODUCTS SECTION ─── */
function Products() {
  const products = [
    {
      name: "PulseAgent",
      tagline: "Autonomous AI Workforce",
      description: "Enterprise-grade platform for deploying, managing, and monitoring AI agents at scale.",
      icon: "🤖",
      color: "purple",
    },
    {
      name: "NexusFlow",
      tagline: "Intelligent Workflow Engine",
      description: "Visual workflow builder powered by AI that automatically optimizes business processes.",
      icon: "⚡",
      color: "cyan",
    },
    {
      name: "CogniSense",
      tagline: "AI Analytics Platform",
      description: "Real-time analytics with predictive AI that surfaces insights before you ask.",
      icon: "📊",
      color: "pink",
    },
    {
      name: "ShieldAI",
      tagline: "Autonomous Cyber Defense",
      description: "AI-powered security platform that detects, responds, and adapts to threats in real-time.",
      icon: "🛡️",
      color: "emerald",
    },
  ];

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] radial-glow opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-emerald-400 mb-4">
            Our Products
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Products Built for the <span className="gradient-text">AI Era</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Our suite of AI-native products empowers enterprises to operate faster,
            smarter, and more autonomously.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <div
              key={product.name}
              className="section-animate gradient-border card-hover rounded-2xl p-8 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{product.icon}</div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {product.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full glass text-gray-400">
                  {product.tagline}
                </span>
              </div>
              <p className="text-gray-400 mb-6">{product.description}</p>
              <div className="flex items-center gap-4">
                <a href="#contact" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  Request Access
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <span className="text-xs text-gray-600">|</span>
                <span className="text-xs text-gray-500">Enterprise Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TECH STACK / PARTNERS ─── */
function TechStack() {
  const techs = [
    "OpenAI", "LangChain", "AWS", "Azure", "Google Cloud", "Kubernetes",
    "PyTorch", "TensorFlow", "Snowflake", "Databricks", "Docker", "Terraform",
  ];

  return (
    <section className="relative py-20 overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 uppercase tracking-widest mb-10">
          Powered By & Partnered With
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {techs.map((tech) => (
            <span
              key={tech}
              className="text-gray-500 hover:text-gray-300 transition-colors text-lg font-medium"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT / WHY US ─── */
function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0a2e] to-[#0a0a1a]" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] radial-glow opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="section-animate">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-purple-400 mb-4">
              Why CosmicPulse
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Where <span className="gradient-text">Innovation</span> Meets Execution
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              CosmicPulse was founded on a singular vision: to build AI systems that don&apos;t just
              assist — they autonomously drive outcomes. We combine deep AI research expertise
              with battle-tested engineering to deliver solutions that actually work in production.
            </p>

            <div className="space-y-6">
              {[
                { title: "AI-First DNA", desc: "Every solution is built with AI at its core, not bolted on as an afterthought." },
                { title: "Production-Ready", desc: "We ship systems that run at enterprise scale with 99.99% reliability." },
                { title: "Human-Centered AI", desc: "Our agents amplify human capability — they don't replace human judgment." },
                { title: "Continuous Innovation", desc: "We invest 30% of revenue in R&D to stay at the frontier of AI." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="section-animate relative" style={{ animationDelay: "0.2s" }}>
            <div className="relative glass rounded-3xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
              <div className="relative space-y-6">
                {/* Metric cards */}
                {[
                  { label: "AI Models Deployed", value: "2,500+", trend: "+340% YoY" },
                  { label: "Average ROI for Clients", value: "12.4x", trend: "Within 6 months" },
                  { label: "Data Points Processed Daily", value: "8.7B", trend: "Real-time" },
                  { label: "Engineering Team", value: "400+", trend: "AI/ML specialists" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                    <div>
                      <p className="text-sm text-gray-400">{metric.label}</p>
                      <p className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {metric.value}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                      {metric.trend}
                    </span>
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

/* ─── TESTIMONIALS ─── */
function Testimonials() {
  const testimonials = [
    {
      quote: "CosmicPulse's AI agents reduced our document processing time by 94%. What used to take our team days now happens in minutes with higher accuracy.",
      author: "Sarah Chen",
      role: "CTO, FinanceFlow Global",
      avatar: "SC",
    },
    {
      quote: "The Agentic AI Platform transformed our customer service. AI agents now handle 80% of inquiries autonomously, and our CSAT scores have never been higher.",
      author: "Marcus Williams",
      role: "VP Operations, TechScale Inc.",
      avatar: "MW",
    },
    {
      quote: "Their cybersecurity AI detected and neutralized a zero-day threat that would have cost us millions. CosmicPulse doesn't just deliver — they protect.",
      author: "Dr. Aisha Patel",
      role: "CISO, MedSecure Health",
      avatar: "AP",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 section-animate">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-cyan-400 mb-4">
            Client Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className="section-animate gradient-border rounded-2xl p-8"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─── */
function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-violet-900/40 to-cyan-900/40" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center section-animate">
        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Ready to Go <span className="gradient-text">Beyond Infinity?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Join 500+ enterprises already leveraging CosmicPulse&apos;s AI Agentic technology
          to transform their operations and outpace the competition.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="btn-glow px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg"
          >
            Book a Discovery Call
          </a>
          <a
            href="#solutions"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-all"
          >
            See Our Solutions
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT SECTION ─── */
function Contact() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0a2e] to-[#0a0a1a]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] radial-glow-cyan opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className="section-animate">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-cyan-400 mb-4">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Let&apos;s Build the <span className="gradient-text">Future Together</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Whether you&apos;re exploring AI for the first time or scaling existing systems,
              our team is ready to help you achieve breakthrough results.
            </p>

            <div className="space-y-6">
              {[
                { icon: "📧", label: "Email", value: "hello@cosmicpulse.ai" },
                { icon: "📍", label: "Headquarters", value: "San Francisco, CA | London, UK | Bangalore, IN" },
                { icon: "📞", label: "Phone", value: "+1 (555) 0199" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="section-animate" style={{ animationDelay: "0.2s" }}>
            <div className="gradient-border rounded-2xl p-8">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Work Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">How can we help?</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Tell us about your project or challenge..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-glow py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-semibold text-lg"
                >
                  Send Message
                </button>
                <p className="text-xs text-gray-600 text-center">
                  We&apos;ll respond within 24 hours. No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <InfinityLogo size={36} />
              <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Cosmic<span className="gradient-text">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Pioneering AI Agentic solutions that take businesses beyond infinity.
            </p>
            <div className="flex gap-3">
              {["X", "Li", "GH"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Solutions", links: ["Agentic AI Platform", "Cognitive Automation", "AI Co-Pilot Suite", "Custom AI Development"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
            { title: "Resources", links: ["Documentation", "Case Studies", "API Reference", "Contact Sales"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CosmicPulse Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a key={link} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  useScrollReveal();

  return (
    <main className="relative overflow-hidden noise-overlay">
      <ParticleField />
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
