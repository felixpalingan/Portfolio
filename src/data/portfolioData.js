/**
 * Portfolio Data Configuration
 * Edit this file to update projects, stats, bio, and contact information.
 * Placeholder image paths can be replaced with real image URLs or local files in public/
 */

export const portfolioData = {
  profile: {
    handle: "FELIX PALINGAN",
    codename: "V_NETRUNNER",
    title: "Full Stack Web Developer & Creative Engineer",
    affiliation: "Megabuilding H10, Little China, Watson",
    location: "Night City / Indonesia",
    status: "OPEN FOR CONTRACTS",
    bio: "Full Stack Web Developer with a strong passion for immersive web experiences, high-performance architecture, and interactive 3D WebGL interfaces. Building bleeding-edge software from front-end diegetic UIs to resilient distributed back-ends.",
    avatarPlaceholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%230b0d14'/><polygon points='40,20 360,20 380,40 380,360 360,380 40,380 20,360 20,40' fill='none' stroke='%2300F0FF' stroke-width='4'/><circle cx='200' cy='160' r='60' fill='none' stroke='%23FCEE09' stroke-width='4'/><path d='M100 320 Q200 240 300 320' fill='none' stroke='%23FCEE09' stroke-width='4'/><text x='200' y='365' fill='%2300F0FF' font-family='monospace' font-size='18' text-anchor='middle' font-weight='bold'>OPERATIVE: FELIX</text></svg>"
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
      id: "holo-core",
      title: "Project: ARASAKA ICE-BREAKER",
      category: "Full Stack & WebGL",
      year: "2026",
      description: "High-performance security monitoring dashboard featuring real-time node telemetry, interactive 3D topology graph, and automated penetration testing visualizer.",
      tags: ["Three.js", "WebGL", "TypeScript", "Node.js", "WebSocket"],
      liveUrl: "https://github.com/felixpalingan",
      repoUrl: "https://github.com/felixpalingan",
      color: "#00F0FF",
      imagePlaceholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340' viewBox='0 0 600 340'><rect width='600' height='340' fill='%230b0d14'/><rect x='10' y='10' width='580' height='320' fill='none' stroke='%2300F0FF' stroke-dasharray='8 4' stroke-width='2'/><text x='300' y='150' fill='%2300F0FF' font-family='sans-serif' font-size='22' text-anchor='middle' font-weight='bold'>ARASAKA ICE-BREAKER</text><text x='300' y='185' fill='%23FCEE09' font-family='monospace' font-size='14' text-anchor='middle'>[TELEMETRY &amp; 3D TOPOLOGY]</text><text x='300' y='230' fill='%23888' font-family='monospace' font-size='12' text-anchor='middle'>PLACEHOLDER // REPLACE IN PORTFOLIODATA.JS</text></svg>"
    },
    {
      id: "trauma-net",
      title: "Project: TRAUMA DISPATCH V2",
      category: "Distributed Web App",
      year: "2025",
      description: "Emergency dispatch routing engine for rapid medical response. Real-time GPS triangulation, geospatial routing algorithms, and offline-first PWA architecture.",
      tags: ["React", "FastAPI", "PostgreSQL", "Leaflet", "TailwindCSS"],
      liveUrl: "https://github.com/felixpalingan",
      repoUrl: "https://github.com/felixpalingan",
      color: "#FF003C",
      imagePlaceholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340' viewBox='0 0 600 340'><rect width='600' height='340' fill='%2314070a'/><rect x='10' y='10' width='580' height='320' fill='none' stroke='%23FF003C' stroke-dasharray='8 4' stroke-width='2'/><text x='300' y='150' fill='%23FF003C' font-family='sans-serif' font-size='22' text-anchor='middle' font-weight='bold'>TRAUMA DISPATCH V2</text><text x='300' y='185' fill='%23FCEE09' font-family='monospace' font-size='14' text-anchor='middle'>[GEOSPATIAL ROUTING ENGINE]</text><text x='300' y='230' fill='%23888' font-family='monospace' font-size='12' text-anchor='middle'>PLACEHOLDER // REPLACE IN PORTFOLIODATA.JS</text></svg>"
    },
    {
      id: "kiroshi-hud",
      title: "Project: KIROSHI OPTICAL ENGINE",
      category: "Computer Vision & UI",
      year: "2025",
      description: "Browser-based object detection and real-time augmented HUD overlay using client-side WebAssembly models and hardware-accelerated canvas rendering.",
      tags: ["WebAssembly", "JavaScript", "Canvas API", "TensorFlow.js"],
      liveUrl: "https://github.com/felixpalingan",
      repoUrl: "https://github.com/felixpalingan",
      color: "#FCEE09",
      imagePlaceholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340' viewBox='0 0 600 340'><rect width='600' height='340' fill='%23141407'/><rect x='10' y='10' width='580' height='320' fill='none' stroke='%23FCEE09' stroke-dasharray='8 4' stroke-width='2'/><text x='300' y='150' fill='%23FCEE09' font-family='sans-serif' font-size='22' text-anchor='middle' font-weight='bold'>KIROSHI OPTICAL ENGINE</text><text x='300' y='185' fill='%2300F0FF' font-family='monospace' font-size='14' text-anchor='middle'>[CLIENT-SIDE WASM CV HUD]</text><text x='300' y='230' fill='%23888' font-family='monospace' font-size='12' text-anchor='middle'>PLACEHOLDER // REPLACE IN PORTFOLIODATA.JS</text></svg>"
    },
    {
      id: "nightcity-market",
      title: "Project: BLACK MARKET EXCHANGE",
      category: "Fintech & E-Commerce",
      year: "2024",
      description: "High-throughput marketplace platform supporting secure multi-currency transactions, idempotent payments, automated order matching, and webhooks.",
      tags: ["Next.js", "Prisma", "Redis", "Stripe API", "Docker"],
      liveUrl: "https://github.com/felixpalingan",
      repoUrl: "https://github.com/felixpalingan",
      color: "#00F0FF",
      imagePlaceholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340' viewBox='0 0 600 340'><rect width='600' height='340' fill='%230b0d14'/><rect x='10' y='10' width='580' height='320' fill='none' stroke='%2300F0FF' stroke-dasharray='8 4' stroke-width='2'/><text x='300' y='150' fill='%2300F0FF' font-family='sans-serif' font-size='22' text-anchor='middle' font-weight='bold'>BLACK MARKET EXCHANGE</text><text x='300' y='185' fill='%23FF003C' font-family='monospace' font-size='14' text-anchor='middle'>[FINTECH PAYMENT GATEWAY]</text><text x='300' y='230' fill='%23888' font-family='monospace' font-size='12' text-anchor='middle'>PLACEHOLDER // REPLACE IN PORTFOLIODATA.JS</text></svg>"
    }
  ],

  contact: {
    email: "felixbariq@gmail.com",
    github: "https://github.com/felixpalingan",
    linkedin: "https://linkedin.com/in/felixpalingan",
    commFrequency: "98.7 MHz NET_CHANNEL",
    location: "Watson District, Megabuilding H10"
  }
};
