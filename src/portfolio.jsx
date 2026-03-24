import { useState, useEffect, useRef } from "react";

const ACCENT = "#39FF14";
const ACCENT2 = "#00FFAA";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --accent: #39FF14;
    --accent2: #00FFAA;
    --bg: #080808;
    --bg2: #0f0f0f;
    --bg3: #161616;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --text: #f5f5f5;
    --muted: #888;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* NAV */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 20px 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.4s ease;
  }
  .nav.scrolled {
    background: rgba(8,8,8,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: 14px 60px;
  }
  .nav-logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
    text-decoration: none;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 36px; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta {
    background: var(--accent);
    color: #000 !important;
    padding: 10px 22px;
    border-radius: 2px;
    font-weight: 700 !important;
    font-size: 12px !important;
    letter-spacing: 1px !important;
  }
  .nav-cta:hover { background: var(--accent2) !important; color: #000 !important; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 60px 60px;
    position: relative;
    overflow: hidden;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(57,255,20,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,20,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black, transparent);
  }
  .hero-glow {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(57,255,20,0.08) 0%, transparent 70%);
    top: -200px; right: -100px;
    pointer-events: none;
  }
  .hero-glow2 {
    position: absolute;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,255,170,0.05) 0%, transparent 70%);
    bottom: 50px; left: 100px;
    pointer-events: none;
  }
  .hero-content { position: relative; max-width: 900px; }
  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(57,255,20,0.08);
    border: 1px solid rgba(57,255,20,0.2);
    color: var(--accent);
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .hero-tag::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .hero-name {
    font-size: clamp(52px, 8vw, 110px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -4px;
    color: var(--text);
    margin-bottom: 24px;
  }
  .hero-name .line2 {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.3);
  }
  .hero-headline {
    font-size: clamp(16px, 2vw, 21px);
    font-weight: 400;
    color: var(--muted);
    max-width: 560px;
    line-height: 1.6;
    margin-bottom: 48px;
    font-family: 'Space Mono', monospace;
  }
  .hero-headline span { color: var(--accent); }
  .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 16px 36px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(57,255,20,0.3); }
  .btn-secondary {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--glass-border);
    padding: 16px 36px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
  .hero-stats {
    display: flex;
    gap: 60px;
    margin-top: 80px;
    padding-top: 40px;
    border-top: 1px solid var(--glass-border);
  }
  .stat-num {
    font-size: 40px;
    font-weight: 800;
    color: var(--text);
    line-height: 1;
  }
  .stat-num span { color: var(--accent); }
  .stat-label {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 6px;
    font-family: 'Space Mono', monospace;
  }
  .scroll-line {
    position: absolute;
    bottom: 40px;
    left: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-family: 'Space Mono', monospace;
  }
  .scroll-line::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--accent);
    animation: extend 2s ease-in-out infinite;
  }
  @keyframes extend {
    0%, 100% { width: 40px; }
    50% { width: 70px; }
  }

  /* SECTION COMMONS */
  section { padding: 120px 60px; }
  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--accent);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-family: 'Space Mono', monospace;
  }
  .section-tag::before {
    content: '';
    width: 20px; height: 1px;
    background: var(--accent);
  }
  .section-title {
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    margin-bottom: 60px;
  }
  .section-title em { color: var(--accent); font-style: normal; }

  /* PROJECTS */
  .projects-bg { background: var(--bg); }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .project-card {
    background: var(--bg3);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
  }
  .project-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(57,255,20,0.03), transparent);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events:none
  }
  .project-card:hover { border-color: rgba(57,255,20,0.3); transform: translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(57,255,20,0.05); }
  .project-card:hover::before { opacity: 1; }
  .project-preview {
    height: 220px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .project-preview-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 72px;
    position: relative;
  }
  .project-preview-label {
    position: absolute;
    top: 16px; right: 16px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    color: var(--accent);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 100px;
    font-family: 'Space Mono', monospace;
  }
  .project-body { padding: 28px; }
  .project-title { font-size: 22px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.5px; }
  .project-desc { color: var(--muted); font-size: 14px; line-height: 1.6; margin-bottom: 20px; font-family: 'Space Mono', monospace; }
  .project-tech { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .tech-tag {
    background: rgba(57,255,20,0.06);
    border: 1px solid rgba(57,255,20,0.15);
    color: var(--accent);
    font-size: 11px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 2px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.5px;
  }
  .project-links { display: flex; gap: 12px; }
  .btn-sm {
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Syne', sans-serif;
    text-decoration: none;
    display: inline-block;
  }
  .btn-sm-primary { background: var(--accent); color: #000; border: none; }
  .btn-sm-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .btn-sm-ghost { background: transparent; color: var(--muted); border: 1px solid var(--glass-border); }
  .btn-sm-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* SKILLS */
  .skills-bg { background: var(--bg2); }
  .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .skill-card {
    background: var(--bg3);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    padding: 36px;
    transition: all 0.4s;
    position: relative;
    overflow: hidden;
  }
  .skill-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.4s;
  }
  .skill-card:hover { border-color: rgba(57,255,20,0.2); transform: translateY(-4px); }
  .skill-card:hover::after { transform: scaleX(1); }
  .skill-cat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    font-family: 'Space Mono', monospace;
  }
  .skill-cat-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
  .skill-list { display: flex; flex-direction: column; gap: 14px; }
  .skill-item { display: flex; flex-direction: column; gap: 6px; }
  .skill-name-row { display: flex; justify-content: space-between; }
  .skill-name { font-size: 13px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .skill-pct { font-size: 12px; color: var(--accent); font-family: 'Space Mono', monospace; }
  .skill-bar {
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 1px;
    overflow: hidden;
  }
  .skill-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 1px;
    transition: width 1.5s ease;
  }

  /* ABOUT */
  .about-bg { background: var(--bg); }
  .about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
  .about-visual {
    position: relative;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .about-img-frame {
    width: 320px; height: 400px;
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    background: var(--bg3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    position: relative;
    overflow: hidden;
  }
  .about-img-frame::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(57,255,20,0.05), transparent 60%);
  }
  .about-frame-deco {
    position: absolute;
    width: 320px; height: 400px;
    border: 1px solid rgba(57,255,20,0.2);
    border-radius: 8px;
    top: 20px; left: 20px;
  }
  .about-badge {
    position: absolute;
    bottom: 20px; right: 0;
    background: var(--accent);
    color: #000;
    padding: 16px 24px;
    border-radius: 4px;
    font-weight: 800;
    font-size: 14px;
    line-height: 1.3;
  }
  .about-text { max-width: 520px; }
  .about-bio {
    font-size: 16px;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 32px;
    font-family: 'Space Mono', monospace;
  }
  .about-bio strong { color: var(--text); font-weight: 400; }
  .about-highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
  .highlight-item {
    background: var(--bg3);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    padding: 20px;
    transition: border-color 0.3s;
  }
  .highlight-item:hover { border-color: rgba(57,255,20,0.3); }
  .highlight-icon { font-size: 24px; margin-bottom: 10px; }
  .highlight-label { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .highlight-val { font-size: 18px; font-weight: 700; color: var(--text); margin-top: 4px; }

  /* CONTACT */
  .contact-bg { background: var(--bg2); }
  .contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
  .contact-info h3 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
  .contact-info p { color: var(--muted); line-height: 1.7; font-family: 'Space Mono', monospace; font-size: 14px; margin-bottom: 40px; }
  .contact-links { display: flex; flex-direction: column; gap: 16px; }
  .contact-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: var(--bg3);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    text-decoration: none;
    color: var(--text);
    transition: all 0.3s;
  }
  .contact-link:hover { border-color: var(--accent); transform: translateX(6px); }
  .contact-link-icon {
    width: 40px; height: 40px;
    background: rgba(57,255,20,0.08);
    border: 1px solid rgba(57,255,20,0.15);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .contact-link-label { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .contact-link-val { font-size: 15px; font-weight: 600; margin-top: 2px; }
  .contact-form { background: var(--bg3); border: 1px solid var(--glass-border); border-radius: 8px; padding: 40px; }
  .form-row { margin-bottom: 20px; }
  .form-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; font-family: 'Space Mono', monospace; margin-bottom: 8px; display: block; }
  .form-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--glass-border);
    color: var(--text);
    padding: 14px 16px;
    border-radius: 4px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.3s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-textarea { resize: vertical; min-height: 120px; }
  .form-submit {
    width: 100%;
    background: var(--accent);
    color: #000;
    border: none;
    padding: 16px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s;
    margin-top: 8px;
  }
  .form-submit:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(57,255,20,0.3); }

  /* FOOTER */
  .footer {
    padding: 40px 60px;
    border-top: 1px solid var(--glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .footer-copy { font-size: 13px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .footer-copy span { color: var(--accent); }

  /* FADE-IN */
  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .fade-delay-1 { transition-delay: 0.1s; }
  .fade-delay-2 { transition-delay: 0.2s; }
  .fade-delay-3 { transition-delay: 0.3s; }
  .fade-delay-4 { transition-delay: 0.4s; }

  /* MARQUEE */
  .marquee-wrap { overflow: hidden; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); padding: 16px 0; background: var(--bg2); }
  .marquee { display: flex; gap: 0; animation: scroll 25s linear infinite; width: max-content; }
  .marquee-item { white-space: nowrap; padding: 0 40px; font-size: 13px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); font-family: 'Space Mono', monospace; }
  .marquee-item span { color: var(--accent); margin: 0 12px; }
  @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  @media (max-width: 900px) {
    section { padding: 80px 24px; }
    .nav { padding: 16px 24px; }
    .nav.scrolled { padding: 12px 24px; }
    .hero { padding: 120px 24px 60px; }
    .nav-links { display: none; }
    .projects-grid, .skills-grid { grid-template-columns: 1fr; }
    .about-layout, .contact-layout { grid-template-columns: 1fr; gap: 40px; }
    .about-visual { height: 300px; }
    .hero-stats { gap: 30px; flex-wrap: wrap; }
    .footer { padding: 30px 24px; }
    .scroll-line { display: none; }
  }
`;

const projects = [
  {
    id: 1,
    emoji: "🚀",
    label: "SaaS",
    bg: "linear-gradient(135deg, #0a1628 0%, #0d2137 100%)",
    accent: "#0066ff",
    title: "SaaS Landing Page",
    desc: "High-converting landing page with animated sections, pricing tables, and smooth UX that turns visitors into paying customers.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    demo: "https://huzaifamansoor489-ai.github.io/saas-landing-flowmind-ai/",
    github: "",
  },
  {
    id: 2,
    emoji: "📊",
    label: "Dashboard",
    bg: "linear-gradient(135deg, #0f1a0a 0%, #1a2e10 100%)",
    accent: "#39FF14",
    title: "SaaS Dashboard",
    desc: "Real-time analytics dashboard with dark mode, live charts, and user management — built for scale and speed.",
    tech: ["Next.js", "TypeScript", "Recharts", "Prisma"],
    demo: "https://huzaifamansoor489-ai.github.io/Dashboard-/",
    github: "",
  },
  {
    id: 3,
    emoji: "🏢",
    label: "Agency",
    bg: "linear-gradient(135deg, #1a0a0a 0%, #2e1010 100%)",
    accent: "#ff4500",
    title: "Agency Website",
    desc: "Bold, editorial-style agency site with scroll-driven animations, custom cursor, and a portfolio showcase system.",
    tech: ["React", "GSAP", "Three.js", "Sass"],
    demo: "https://huzaifamansoor489-ai.github.io/velora-agency-website/",
    github: "",
  },
  {
    id: 4,
    emoji: "📅",
    label: "Booking",
    bg: "linear-gradient(135deg, #0a0a1a 0%, #10102e 100%)",
    accent: "#a855f7",
    title: "Booking Website",
    desc: "Full-featured booking platform with calendar sync, payment integration, and automated email confirmations.",
    tech: ["Next.js", "Stripe", "Supabase", "Resend"],
    demo: "https://huzaifamansoor489-ai.github.io/zenflow-booking-website/",
    github: "",
  },
];

const skillCategories = [
  {
    label: "Frontend",
    title: "UI Engineering",
    icon: "◈",
    skills: [
      { name: "React / Next.js", pct: 95 },
      { name: "TypeScript", pct: 90 },
      { name: "Tailwind CSS", pct: 92 },
      { name: "Framer Motion", pct: 85 },
      { name: "Three.js / WebGL", pct: 75 },
    ],
  },
  {
    label: "Tools",
    title: "Dev Stack",
    icon: "◉",
    skills: [
      { name: "Git / GitHub", pct: 95 },
      { name: "Vite / Webpack", pct: 88 },
      { name: "Docker", pct: 78 },
      { name: "Figma / Zeplin", pct: 82 },
      { name: "Vercel / Netlify", pct: 92 },
    ],
  },
  {
    label: "AI Tools",
    title: "AI-Powered",
    icon: "◎",
    skills: [
      { name: "Claude / ChatGPT", pct: 94 },
      { name: "GitHub Copilot", pct: 90 },
      { name: "v0 / Cursor", pct: 88 },
      { name: "Midjourney", pct: 80 },
      { name: "ElevenLabs", pct: 72 },
    ],
  },
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function SkillBar({ name, pct }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setWidth(pct); io.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div className="skill-item" ref={ref}>
      <div className="skill-name-row">
        <span className="skill-name">{name}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const scrolled = useScrolled();
  useFadeIn();
  const [sent, setSent] = useState(false);

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#hero" className="nav-logo">HM<span>.</span></a>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#about">About</a>
          <a href="#contact" className="nav-cta">Hire Me</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-content">
          <div className="hero-tag fade-in">Available for projects</div>
          <h1 className="hero-name fade-in fade-delay-1">
            Huzaifa<br />
            <span className="line2">Mansoor</span>
          </h1>
          <p className="hero-headline fade-in fade-delay-2">
            I build <span>high-converting websites</span> and modern web interfaces that make brands stand out.
          </p>
          <div className="hero-btns fade-in fade-delay-3">
            <a href="#projects" className="btn-primary">View Work ↓</a>
            <a href="#contact" className="btn-secondary">Let's Talk</a>
          </div>
          <div className="hero-stats fade-in fade-delay-4">
            <div>
              <div className="stat-num">5<span>+</span></div>
              <div className="stat-label">Years exp.</div>
            </div>
            <div>
              <div className="stat-num">48<span>+</span></div>
              <div className="stat-label">Projects done</div>
            </div>
            <div>
              <div className="stat-num">30<span>+</span></div>
              <div className="stat-label">Happy clients</div>
            </div>
            <div>
              <div className="stat-num">99<span>%</span></div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
        <div className="scroll-line">Scroll to explore</div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {[...Array(2)].map((_, i) =>
            ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "GSAP", "Figma", "Supabase", "Vercel"].map((t) => (
              <span className="marquee-item" key={`${t}-${i}`}>{t}<span>✦</span></span>
            ))
          )}
        </div>
      </div>

      {/* PROJECTS */}
      <section className="projects-bg" id="projects">
        <div className="section-tag fade-in">Selected Work</div>
        <h2 className="section-title fade-in fade-delay-1">
          Projects that<br /><em>convert.</em>
        </h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className={`project-card fade-in fade-delay-${(i % 3) + 1}`} key={p.id}>
              <div className="project-preview" style={{ background: p.bg }}>
                <div className="project-preview-inner">{p.emoji}</div>
                <span className="project-preview-label">{p.label}</span>
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t) => <span className="tech-tag" key={t}>{t}</span>)}
                </div>
                <div className="project-links">
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sm btn-sm-primary"
                    onClick={(e) => { if (!p.demo || p.demo === "#") { e.preventDefault(); alert("Live demo link coming soon!"); } }}
                  >
                    Live Demo ↗
                  </a>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sm btn-sm-ghost"
                    onClick={(e) => { if (!p.github || p.github === "#") { e.preventDefault(); alert("GitHub link coming soon!"); } }}
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="skills-bg" id="skills">
        <div className="section-tag fade-in">My Toolkit</div>
        <h2 className="section-title fade-in fade-delay-1">
          Skills &amp;<br /><em>expertise.</em>
        </h2>
        <div className="skills-grid">
          {skillCategories.map((cat, i) => (
            <div className={`skill-card fade-in fade-delay-${i + 1}`} key={cat.label}>
              <div className="skill-cat-label">{cat.icon} {cat.label}</div>
              <div className="skill-cat-title">{cat.title}</div>
              <div className="skill-list">
                {cat.skills.map((s) => <SkillBar key={s.name} {...s} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-bg" id="about">
        <div className="about-layout">
          <div className="about-visual fade-in">
            <div className="about-img-frame">👨‍💻</div>
            <div className="about-frame-deco" />
            <div className="about-badge">
              Open to work<br />from anywhere 🌍
            </div>
          </div>
          <div className="about-text">
            <div className="section-tag fade-in">About Me</div>
            <h2 className="section-title fade-in fade-delay-1" style={{ marginBottom: 24 }}>
              The dev behind<br /><em>the work.</em>
            </h2>
            <p className="about-bio fade-in fade-delay-2">
              I'm <strong>Huzaifa Mansoor</strong>, a senior frontend engineer who specializes in crafting premium web experiences. With 5+ years shipping production-grade apps, I combine <strong>technical depth with design sensibility</strong> to deliver interfaces that users love and businesses trust.
            </p>
            <p className="about-bio fade-in fade-delay-3">
              I work with <strong>startups, agencies, and founders</strong> who want a product that looks as good as it performs. Every pixel is intentional. Every interaction is considered.
            </p>
            <div className="about-highlights fade-in fade-delay-4">
              {[
                { icon: "⚡", label: "Delivery time", val: "3-5 days" },
                { icon: "🎯", label: "Focus", val: "Frontend / UI" },
                { icon: "🌐", label: "Work mode", val: "Remote only" },
                { icon: "💬", label: "Response time", val: "< 2 hours" },
              ].map((h) => (
                <div className="highlight-item" key={h.label}>
                  <div className="highlight-icon">{h.icon}</div>
                  <div className="highlight-label">{h.label}</div>
                  <div className="highlight-val">{h.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-bg" id="contact">
        <div className="section-tag fade-in">Get In Touch</div>
        <div className="contact-layout">
          <div className="fade-in fade-delay-1">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Let's build<br /><em>together.</em>
            </h2>
            <div className="contact-info">
              <p>Have a project in mind? I'm selective with who I work with — so if you're here, let's talk. I respond within 2 hours.</p>
              <div className="contact-links">
                {[
                  { icon: "✉", label: "Email", val: "huzaifamansoor489@gmail.com", href: "mailto:huzaifamansoor489@gmail.com" },
                  { icon: "◈", label: "GitHub", val: "Huzaifamansoor489-AI", href: "https://github.com/huzaifamansoor489-AI" },
                  { icon: "◉", label: "LinkedIn", val: "-", href: "#" },
                ].map((l) => (
                  <a href={l.href} className="contact-link" key={l.label}>
                    <div className="contact-link-icon">{l.icon}</div>
                    <div>
                      <div className="contact-link-label">{l.label}</div>
                      <div className="contact-link-val">{l.val}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="contact-form fade-in fade-delay-2">
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 24, marginBottom: 8 }}>Message sent!</h3>
                <p style={{ color: "var(--muted)", fontFamily: "'Space Mono', monospace", fontSize: 14 }}>I'll get back to you within 2 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="form-row">
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Your name" />
                  </div>
                  <div className="form-row">
                    <label className="form-label">Email</label>
                    <input className="form-input" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label">Project type</label>
                  <select className="form-input" style={{ cursor: "pointer" }}>
                    <option value="">Select a project type...</option>
                    <option>Landing Page</option>
                    <option>SaaS Dashboard</option>
                    <option>Agency Website</option>
                    <option>Booking Platform</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label">Budget range</label>
                  <select className="form-input" style={{ cursor: "pointer" }}>
                    <option value="">Select budget range...</option>
                    <option>$500 – $1,500</option>
                    <option>$1,500 – $5,000</option>
                    <option>$5,000 – $15,000</option>
                    <option>$15,000+</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label">Message</label>
                  <textarea className="form-input form-textarea" placeholder="Tell me about your project..." />
                </div>
                <button className="form-submit" onClick={() => setSent(true)}>
                  Send Message →
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-copy">
          © 2026 <span>Huzaifa Mansoor</span>. Built with React + Tailwind.
        </div>
        <div className="footer-copy">
          Designed &amp; developed with <span>♥</span> and too much coffee.
        </div>
      </footer>
    </>
  );
}
