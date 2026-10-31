/**
 * Portfolio Data Configuration
 * Edit this file to update projects, stats, bio, and contact information.
 * Fully aligned with Almakius Felix Bariq Hekopung's official CV and achievements.
 */

export const portfolioData = {
  profile: {
    handle: "FELIX PALINGAN",
    codename: "V_NETRUNNER",
    fullName: "Almakius Felix Bariq Hekopung",
    title: "Full Stack Developer & Progressive Web Apps (PWA) / Mobile Specialist",
    affiliation: "Universitas Trisakti // OK OCE Indonesia",
    location: "Jakarta Timur, DKI Jakarta, Indonesia",
    status: "OPEN FOR FULL-STACK & PWA / MOBILE ROLES",
    bio: "Mahasiswa S1 Sistem Informasi Universitas Trisakti (Semester 7, IPK 3.72 / 4.00) berfokus pada rekayasa perangkat lunak Full Stack Web dan Progressive Web Apps (PWA) / Mobile. Berpengalaman sebagai Full-Stack Developer Intern di OK OCE Indonesia (okoce.net) mengembangkan ekosistem portal (Smart E-Ticket, Web Scanner kehadiran, integrasi Payment Gateway Finpay QRIS/VA, dan toko UMKM), membangun aplikasi mobile & web OK OCE EventIT (Capstone S1), serta 3 semester aktif sebagai Asisten Lab Informatika membimbing 50+ mahasiswa.",
    avatar: "/default.jpg",
    avatarPlaceholder: "/default.jpg"
  },

  stats: [
    {
      attribute: "TECHNICAL ABILITY",
      level: 96,
      sub: "PHP (CodeIgniter 4), TypeScript, Python (Flask), Dart (Flutter), SQL",
      description: "Penguasaan mendalam dalam rekayasa full-stack web, arsitektur RESTful API, aplikasi mobile cross-platform, dan integrasi backend modern."
    },
    {
      attribute: "INTELLIGENCE",
      level: 94,
      sub: "PWA Architecture, System Design, PostgreSQL/MySQL, Database Tuning",
      description: "Perancangan skema relasional skala multi-gudang, kalkulasi HPP/COGS, offline-first PWA caching, listener webhook idempoten, dan optimasi query."
    },
    {
      attribute: "REFLEXES",
      level: 92,
      sub: "Next.js 16, Supabase CDC, Three.js (WebGL), LiveKit WebRTC, Tailwind",
      description: "Rapid prototyping antarmuka responsif performa tinggi, perpesanan instan real-time sub-100ms, WebRTC audio/video mesh, dan grafis interaktif 3D 60 FPS."
    },
    {
      attribute: "COOL",
      level: 90,
      sub: "Problem Solving, Production Triage, Technical Mentoring, Git Workflows",
      description: "Tenang menghadapi insiden produksi, pengalaman Pemrograman Kompetitif (GEMASTIK), dan kepemimpinan dalam mengajar 50+ mahasiswa sebagai Asisten Lab."
    }
  ],

  projects: [
    {
      id: "okoce-eventit",
      title: "OK OCE EVENTIT",
      tabTitle: "01 // OK OCE EVENTIT",
      tagline: "INTEGRATED EVENT MANAGEMENT & MONITORING ECOSYSTEM",
      category: "Mobile App & Full Stack (Capstone)",
      year: "2026",
      status: "CAPSTONE S1 // COMPLETED",
      description: "Ekosistem manajemen event terpadu mobile-first untuk jaringan wirausaha OK OCE Indonesia. Memadukan aplikasi mobile Flutter untuk peserta UMKM & dashboard admin Flask REST API, registrasi akun berbasis OTP Fazpass, presensi digital QR Code (<3 detik), modul evaluasi kuis pre/post-test in-app, serta auto-generated Laporan Dampak organisasi.",
      tags: ["Flutter (Dart)", "Python (Flask v3)", "PostgreSQL", "Fazpass OTP", "Finpay QRIS/VA", "Dynamic QR", "LMS Mini"],
      liveUrl: "https://okoce.net",
      repoUrl: "https://github.com/felixpalingan",
      color: "#00F0FF",
      metrics: [
        { label: "CHECK-IN SPEED", val: "<3s Real-Time QR Presence", color: "#00FF66" },
        { label: "MOBILE ECOSYSTEM", val: "Flutter + Flask REST API", color: "#00F0FF" },
        { label: "MONITORING ANALYTICS", val: "LMS Mini & Impact Reports", color: "#FCEE09" }
      ],
      image: "/okoce_icon.png",
      imagePlaceholder: "/okoce_icon.png",
      preview: "/okoce_preview.png"
    },
    {
      id: "iron-pixels",
      title: "IRONPIXELS",
      tabTitle: "02 // IRONPIXELS",
      tagline: "16-BIT GAMIFIED WORKOUT TRACKER & CO-OP RAID RPG",
      category: "Full Stack & PWA",
      year: "2025",
      status: "PRODUCTION READY // DEPLOYED",
      description: "Aplikasi kebugaran Progressive Web App (PWA) yang memadukan rutinitas angkat beban dengan progresi dungeon MMORPG retro 16-bit. Dilengkapi kalkulasi Relative Volume Scoring (RVS), pertarungan boss Co-Op multi-device real-time via Supabase WebSockets, dan sintesis audio chiptune zero-latency native Web Audio API.",
      tags: ["Next.js 15", "Supabase", "React 19", "TypeScript", "TailwindCSS", "PWA", "WebSockets", "Web Audio API"],
      liveUrl: "https://iron-pixels.vercel.app",
      repoUrl: "https://github.com/felixpalingan/IronPixels",
      color: "#00FF66",
      metrics: [
        { label: "RVS VOLUME MATH", val: "Authoritative Score Engine", color: "#00FF66" },
        { label: "GUILD CO-OP RAIDS", val: "Multi-Device Boss Battles", color: "#00F0FF" },
        { label: "CHIPTUNE WEB AUDIO", val: "Zero-Latency Retro SFX", color: "#FCEE09" }
      ],
      image: "/ironpixels_icon.png",
      imagePlaceholder: "/ironpixels_icon.png",
      preview: "/ironpixels_preview.png"
    },
    {
      id: "oit",
      title: "OIT",
      tabTitle: "03 // OIT",
      tagline: "HIGH-PERFORMANCE REAL-TIME WORKSPACE & WEBRTC CALLING",
      category: "Real-Time Comms & WebRTC",
      year: "2025",
      status: "PRODUCTION READY // DEPLOYED",
      description: "Platform komunikasi kolaboratif real-time performa tinggi yang dirancang untuk tim pengembang dan komunitas tech. Dilengkapi pesan instan sub-100ms via Supabase CDC, panggilan suara/video grup latensi rendah via LiveKit Cloud SFU WebRTC, moderasi 4-tier RBAC, dan antarmuka dark glassmorphic responsif.",
      tags: ["Next.js 16", "LiveKit WebRTC", "Supabase CDC", "Zustand", "TypeScript", "TailwindCSS"],
      liveUrl: "https://oit-seven.vercel.app",
      repoUrl: "https://github.com/felixpalingan/Oit",
      color: "#FF5C00",
      metrics: [
        { label: "POSTGRES CDC STREAM", val: "Sub-100ms Instant Comms", color: "#FF5C00" },
        { label: "WEBRTC SFU CALLING", val: "LiveKit Audio/Video Mesh", color: "#00F0FF" },
        { label: "ROLE ARCHITECTURE", val: "4-Tier RBAC & Strict RLS", color: "#00FF66" }
      ],
      image: "/oit_logo.png",
      imagePlaceholder: "/oit_logo.png",
      preview: "/oit_preview.png"
    }
  ],

  experiences: [
    {
      id: "exp-okoce",
      period: "2026 (JUL - DES)",
      role: "Full-Stack Developer Intern",
      company: "OK OCE Indonesia (okoce.net)",
      location: "Jakarta, Indonesia (Hybrid / Onsite)",
      layer: "PROD_PLATFORM // 01",
      layerColor: "#00F0FF",
      summary: "Mengembangkan ekosistem portal komunitas wirausaha nasional: Smart E-Ticket Hub, Web Attendance Scanner, integrasi Payment Gateway Finpay QRIS/VA, dan toko UMKM multi-gudang.",
      highlights: [
        "Membangun Smart E-Ticket Hub & Web Attendance Scanner (/scanner) hardware-compatible (USB barcode & kamera HP Html5Qrcode) dengan 300ms live debounced manual search.",
        "Mengintegrasikan Finpay Payment Gateway untuk tiket event & bursa UMKM via QRIS (biaya admin 0.7%) dan Virtual Account dengan auto-polling AJAX real-time & listener webhook idempoten.",
        "Mengembangkan modul Toko UMKM (multi-gudang, kalkulasi HPP/COGS FIFO/Average, retur barang restock vs write-off) serta mesin komisi afiliasi dual-tier berparameter referral WhatsApp unik.",
        "Menerapkan security hardening: sanitasi input HtmlAman (pencegah XSS), proteksi CSRF pada seluruh endpoint AJAX, engine OTP email in-house, enkripsi JWT, dan Role-Based Access Control (RBAC)."
      ],
      techStack: ["PHP (CodeIgniter 4)", "MySQL", "JavaScript ES6+", "Tailwind CSS", "Finpay Gateway", "Html5Qrcode", "Git"]
    },
    {
      id: "exp-aslab",
      period: "2024 - SEKARANG",
      role: "Asisten Laboratorium (3 Semester Aktif)",
      company: "Jurusan Teknik Informatika, Universitas Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "ACADEMIC_LAB // 02",
      layerColor: "#00FF66",
      summary: "Membimbing dan menguji lebih dari 50+ mahasiswa pada 4 mata kuliah inti: Algoritma & Pemrograman, Analitik Data, Jaringan Komputer, dan Basis Data.",
      highlights: [
        "Algoritma & Pemrograman: Mengajar bahasa pemrograman Python, algoritma (Binary Search, Sorting, Greedy, DP), modul optimasi kode, dan logika pseudocode untuk 30+ mahasiswa per angkatan.",
        "Analitik Data: Membimbing praktikum data cleaning, clustering, dan Regresi Linier Berganda menggunakan Python (pandas, NumPy) serta dashboard BI (Power BI, Tableau, Looker Studio) untuk 20+ mahasiswa.",
        "Jaringan Komputer & Basis Data: Membimbing routing TCP/IP, packet sniffing Wireshark, perancangan skema relasional SQL/PostgreSQL, dan normalisasi data di Lab Sistem Keamanan & Lab Rekayasa Data.",
        "Mobile App Development: Membimbing rekayasa aplikasi cross-platform Flutter (Dart) terintegrasi dengan RESTful API Python Flask dan basis data PostgreSQL."
      ],
      techStack: ["Python (pandas, NumPy)", "Flask", "Flutter (Dart)", "PostgreSQL", "MySQL", "Power BI", "Tableau", "Wireshark"]
    },
    {
      id: "exp-org",
      period: "2024 - 2025",
      role: "Wakil Ketua PBK & Peserta GEMASTIK",
      company: "HIMP TIF Universitas Trisakti & Puspresnas",
      location: "Universitas Trisakti / Kemendikbudristek",
      layer: "LEADERSHIP & COMP // 03",
      layerColor: "#FCEE09",
      summary: "Memimpin program kerja departemen kemahasiswaan dan mewakili kampus dalam kompetisi pemrograman tingkat nasional (GEMASTIK XVII).",
      highlights: [
        "Membantu memimpin departemen PBK Himpunan Mahasiswa Teknik Informatika, mengoordinasikan program kerja, menyelenggarakan workshop coding, dan memfasilitasi komunikasi organisasi profesional.",
        "Peserta Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK) Divisi Pemrograman Kompetitif (Competitive Programming), menyelesaikan problem algoritma dan struktur data kompleks menggunakan C++."
      ],
      techStack: ["Leadership", "Competitive Programming", "C++", "Algorithms", "Data Structures", "Technical Mentoring", "Event Management"]
    },
    {
      id: "exp-edu",
      period: "2023 - SEKARANG",
      role: "Sarjana (S1) Sistem Informasi — Semester 7",
      company: "Universitas Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "FOUNDATION // 04",
      layerColor: "#FF0055",
      summary: "Mahasiswa tingkat akhir dengan IPK 3.72 / 4.00 (123 SKS selesai), skor TEPT 563.33 / 677, berfokus pada rekayasa Full Stack Web dan PWA / Mobile.",
      highlights: [
        "Meraih Indeks Prestasi Kumulatif (IPK) 3.72 dari skala 4.00 dengan predikat akademik Sangat Memuaskan (telah menyelesaikan 123 SKS).",
        "Skor Trisakti English Proficiency Test (TEPT): 563.33 / 677 dari KUIKK Universitas Trisakti (Listening: 58, Structure: 57, Reading: 54).",
        "Proyek Tugas Akhir / Capstone: OK OCE EventIT (Sistem Manajemen Event Terpadu & Digital Monitoring berbasis Flutter, Flask, dan PostgreSQL)."
      ],
      techStack: ["Information Systems", "System Analysis & Design", "Database Architecture", "Enterprise Systems", "Software Engineering"]
    }
  ],

  contact: {
    email: "felixbariq@gmail.com",
    phone: "0813-1352-7464",
    website: "https://portfolio-felix-bariq.vercel.app",
    github: "https://github.com/felixpalingan",
    linkedin: "https://www.linkedin.com/in/almakius-felix-bariq-hekopung/",
    linkedinId: "https://id.linkedin.com/in/almakius-felix-bariq-hekopung-a59695394",
    commFrequency: "98.7 MHz NET_CHANNEL",
    location: "Jakarta Timur, DKI Jakarta // Universitas Trisakti"
  }
};
