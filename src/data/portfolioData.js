/**
 * Portfolio Data Configuration
 * Edit this file to update projects, stats, bio, and contact information.
 * Placeholder image paths can be replaced with real image URLs or local files in public/
 */

export const portfolioData = {
  profile: {
    handle: "FELIX PALINGAN",
    codename: "V_NETRUNNER",
    fullName: "Almakius Felix Bariq Hekopung",
    title: "Full Stack Web Developer & Creative Engineer",
    affiliation: "Megabuilding H10, Little China, Watson",
    location: "Night City / Indonesia",
    status: "OPEN FOR CONTRACTS",
    bio: "Full Stack Web Developer with a strong passion for immersive web experiences, high-performance architecture, and interactive 3D WebGL interfaces. Building bleeding-edge software from front-end diegetic UIs to resilient distributed back-ends.",
    avatar: "/default.jpg",
    avatarPlaceholder: "/default.jpg"
  },

  stats: [
    {
      attribute: "TECHNICAL ABILITY",
      level: 95,
      sub: "JavaScript, TypeScript, PHP, Node.js, Python, SQL",
      description: "Mastery in core languages, REST/GraphQL APIs, and robust application architecture."
    },
    {
      attribute: "INTELLIGENCE",
      level: 92,
      sub: "System Architecture, DevOps, Database Optimization",
      description: "Designing scalable backend microservices, clean codebases, and fault-tolerant cloud systems."
    },
    {
      attribute: "REFLEXES",
      level: 90,
      sub: "Three.js, WebGL, Modern Frontend, GSAP, CSS Alchemy",
      description: "Rapid prototyping, creative frontends, rich interactive micro-animations, and 3D scenes."
    },
    {
      attribute: "COOL",
      level: 88,
      sub: "Problem Solving, Debugging Under Pressure, Git",
      description: "Calm under production incidents, precise triage, clean commit history, and team pair-programming."
    }
  ],

  projects: [
    {
      id: "iron-pixels",
      title: "IRONPIXELS",
      tabTitle: "01 // IRONPIXELS",
      tagline: "16-BIT GAMIFIED WORKOUT TRACKER & CO-OP RAID RPG",
      category: "Full Stack & PWA",
      year: "2025",
      status: "PRODUCTION READY // DEPLOYED",
      description: "Gamified fitness tracking PWA that fuses weightlifting routines with retro 16-bit MMORPG dungeon progression. Features authoritative Relative Volume Scoring (RVS), realtime multi-device Co-Op boss raids via Supabase WebSockets, and zero-latency Web Audio chiptune SFX.",
      tags: ["Next.js 15", "Supabase", "React 19", "TypeScript", "TailwindCSS", "Framer Motion", "WebSockets"],
      liveUrl: "https://iron-pixels.vercel.app",
      repoUrl: "https://github.com/felixpalingan/IronPixels",
      color: "#00FF66",
      metrics: {
        latency: "< 50ms WS",
        nodes: "Realtime Co-Op",
        security: "RLS & CAS Engine"
      },
      image: "/ironpixels_icon.png",
      imagePlaceholder: "/ironpixels_icon.png",
      preview: "/ironpixels_preview.png"
    },
    {
      id: "oit",
      title: "OIT",
      tabTitle: "02 // OIT",
      tagline: "HIGH-PERFORMANCE REAL-TIME WORKSPACE & WEBRTC CALLING",
      category: "Real-Time Comms & WebRTC",
      year: "2025",
      status: "PRODUCTION READY // DEPLOYED",
      description: "High-performance real-time communication platform engineered for high-velocity teams and tech communities. Features sub-100ms instant messaging via Supabase CDC, low-latency LiveKit Cloud SFU audio/video calling, 4-tier RBAC moderation, and an iconic dark glassmorphic UI.",
      tags: ["Next.js 16", "LiveKit WebRTC", "Supabase", "Zustand", "TypeScript", "TailwindCSS"],
      liveUrl: "https://oit-seven.vercel.app",
      repoUrl: "https://github.com/felixpalingan/Oit",
      color: "#FF5C00",
      metrics: {
        latency: "Sub-100ms CDC",
        nodes: "LiveKit SFU",
        security: "4-Tier RBAC"
      },
      image: "/oit_logo.png",
      imagePlaceholder: "/oit_logo.png",
      preview: "/oit_preview.png"
    }
  ],

  experiences: [
    {
      id: "exp-current",
      period: "2024 - PRESENT",
      role: "Lead Full Stack & Creative Engineer",
      company: "Digital Forge // Independent Operative",
      location: "Remote / Indonesia",
      layer: "CORE_ARCH // 01",
      layerColor: "#00F0FF",
      summary: "Architecting high-performance web applications, interactive 3D WebGL experiences, and fault-tolerant microservices.",
      highlights: [
        "Engineered immersive 3D web applications with Three.js & GLSL shaders running at 60 FPS across desktop and mobile.",
        "Built resilient REST & GraphQL APIs with Node.js and TypeScript serving thousands of daily active client requests.",
        "Streamlined automated CI/CD deployment pipelines using Docker, GitHub Actions, and cloud edge infrastructure."
      ],
      techStack: ["TypeScript", "Three.js", "React / Next.js", "Node.js", "PostgreSQL", "Docker"]
    },
    {
      id: "exp-2023",
      period: "2023 - 2024",
      role: "Full Stack Web Developer",
      company: "Nexus Labs // Tech Collective",
      location: "Jakarta, Indonesia",
      layer: "SYS_NET // 02",
      layerColor: "#FCEE09",
      summary: "Developed scalable multi-tenant client portals, responsive dashboard UIs, and real-time WebSocket data pipelines.",
      highlights: [
        "Created real-time event streaming dashboards processing high-frequency data streams with zero UI lag.",
        "Refactored legacy database schemas into optimized PostgreSQL models, slashing query latency by 45%.",
        "Collaborated with UI/UX teams to implement fluid micro-animations and WCAG-compliant design systems."
      ],
      techStack: ["React", "FastAPI / Python", "TailwindCSS", "PostgreSQL", "Redis", "WebSockets"]
    },
    {
      id: "exp-2022",
      period: "2022 - 2023",
      role: "Frontend & UI/UX Engineer",
      company: "CyberMatrix Studio",
      location: "Surabaya, Indonesia",
      layer: "RAW_VISUAL // 03",
      layerColor: "#FF0055",
      summary: "Focused on cutting-edge interactive web prototypes, design systems, and responsive single-page web applications.",
      highlights: [
        "Delivered 15+ production websites with custom GSAP transitions and pixel-perfect design alignment.",
        "Built modular component libraries with React and TypeScript, boosting team development velocity by 30%.",
        "Optimized web performance and Core Web Vitals to score 98+ on Google Lighthouse."
      ],
      techStack: ["JavaScript", "TypeScript", "GSAP", "HTML5 Canvas", "Vue.js", "REST APIs"]
    },
    {
      id: "exp-edu",
      period: "2020 - 2024",
      role: "Bachelor in Computer Science / Information Systems",
      company: "University Academic Academy",
      location: "Indonesia",
      layer: "FOUNDATION // 04",
      layerColor: "#00FF66",
      summary: "Comprehensive academic grounding in Data Structures, Algorithms, Software Engineering, and Database Architecture.",
      highlights: [
        "Graduated with High Honors focusing on Computer Networks, Distributed Systems, and Modern Web Tech.",
        "Led university developer workshops on Web Development, Git workflows, and UI engineering."
      ],
      techStack: ["Algorithms", "Data Structures", "System Design", "Database Systems", "OOP"]
    }
  ],

  contact: {
    email: "felixbariq@gmail.com",
    website: "https://portfolio-felix-bariq.vercel.app",
    github: "https://github.com/felixpalingan",
    linkedin: "https://www.linkedin.com/in/almakius-felix-bariq-hekopung/",
    linkedinId: "https://id.linkedin.com/in/almakius-felix-bariq-hekopung-a59695394",
    commFrequency: "98.7 MHz NET_CHANNEL",
    location: "Watson District, Megabuilding H10"
  }
};
