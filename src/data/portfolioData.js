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

  skills: [
    {
      category: "FRONTEND & PWA ENGINEERING",
      attribute: "FRONTEND & PWA ENGINEERING",
      level: 96,
      skills: ["Next.js (React)", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "PWA (Service Workers, Offline-First)", "HTML5 & Modern CSS", "Alpine.js", "GSAP Animations"],
      sub: "Next.js, TypeScript, Tailwind CSS, PWA, JavaScript (ES6+), HTML5/CSS3, Alpine.js, GSAP",
      description: "Rekayasa web modern responsif, Progressive Web Apps (PWA) dengan service workers & offline caching, state management, SSR/SSG, dan animasi micro-interaction performa tinggi 60 FPS."
    },
    {
      category: "BACKEND & RESTFUL ARCHITECTURE",
      attribute: "BACKEND & RESTFUL ARCHITECTURE",
      level: 94,
      skills: ["PHP (CodeIgniter 4)", "Python (Flask v3)", "RESTful API Design", "Node.js", "Webhooks & Idempotency", "JWT Authentication", "Role-Based Access Control (RBAC)"],
      sub: "PHP (CodeIgniter 4), Python (Flask), RESTful API, Webhooks, JWT, RBAC, Data Sanitization",
      description: "Pembangunan arsitektur backend robust, sanitasi keamanan ketat (pencegah XSS via HtmlAman & proteksi CSRF), listener webhook idempoten, dan otentikasi aman berbasis JWT/OTP."
    },
    {
      category: "MOBILE APP DEVELOPMENT",
      attribute: "MOBILE APP DEVELOPMENT",
      level: 92,
      skills: ["Flutter (Dart)", "Cross-Platform iOS/Android", "State Management (Provider/Riverpod)", "REST API Integration", "Hardware Scanner (Camera QR)", "Mini-LMS Modules"],
      sub: "Flutter (Dart), Cross-Platform Mobile, REST API, QR Attendance Scanner, Mini-LMS",
      description: "Rekayasa aplikasi mobile cross-platform interaktif (OK OCE EventIT) terintegrasi ke backend Flask/PostgreSQL, integrasi modul presensi QR Code real-time, dan modul kuis evaluasi."
    },
    {
      category: "DATABASE & DATA MODELING",
      attribute: "DATABASE & DATA MODELING",
      level: 93,
      skills: ["PostgreSQL", "MySQL / MariaDB", "Supabase", "ERD & Relational Modeling", "Normalisasi (1NF – 3NF/BCNF)", "Query Optimization & Indexing", "ACID Compliance"],
      sub: "PostgreSQL, MySQL, Supabase, Relational Modeling, Query Optimization, FIFO/Average HPP",
      description: "Perancangan skema relasional enterprise skala multi-gudang, kalkulasi HPP/COGS (FIFO & Average), penulisan query SQL kompleks (JOIN, subquery, stored procedure), dan tuning performa database."
    },
    {
      category: "PAYMENT GATEWAYS & INTEGRATIONS",
      attribute: "PAYMENT GATEWAYS & INTEGRATIONS",
      level: 92,
      skills: ["Finpay Gateway (QRIS & Virtual Account)", "Fazpass OTP Gateway", "Mailgun Bulk Email API", "Fonnte / WhatsApp Gateway API", "Html5Qrcode / Barcode Scanner"],
      sub: "Finpay (QRIS & VA), Fazpass OTP, Mailgun API, WhatsApp Gateway, Html5Qrcode Scanner",
      description: "Integrasi gateway pembayaran dengan kalkulasi biaya admin dinamis (0.7%), auto-polling AJAX status transaksi real-time, verifikasi OTP multi-channel, dan pemindai barcode USB/kamera."
    },
    {
      category: "REAL-TIME SYSTEMS & 3D WEBGL",
      attribute: "REAL-TIME SYSTEMS & 3D WEBGL",
      level: 90,
      skills: ["Three.js (WebGL)", "GLSL Shaders", "Supabase Realtime (CDC)", "LiveKit Cloud SFU (WebRTC Audio/Video)", "Web Audio API (Synthesizer)", "WebSockets"],
      sub: "Three.js (WebGL), Supabase CDC, LiveKit WebRTC, Web Audio API, WebSockets",
      description: "Pengembangan platform kolaborasi real-time sub-100ms (Oit), video/audio mesh calling latency rendah, rendering 3D diegetic Cyberpunk 60 FPS di browser, dan Web Audio chiptune synthesis."
    },
    {
      category: "DATA SCIENCE & ANALYTICS",
      attribute: "DATA SCIENCE & ANALYTICS",
      level: 88,
      skills: ["Python (pandas, NumPy)", "Power BI", "Tableau", "Looker Studio", "Exploratory Data Analysis (EDA)", "Linear Regression", "K-Means Clustering"],
      sub: "Python (pandas, NumPy), Power BI, Tableau, Looker Studio, EDA, Machine Learning Dasar",
      description: "Pembersihan dan transformasi data analitik, pemodelan statistik kuantitatif, analisis korelasi bisnis UMKM, dan perancangan executive dashboard interaktif multi-platform."
    },
    {
      category: "DEVOPS, SECURITY & TOOLS",
      attribute: "DEVOPS, SECURITY & TOOLS",
      level: 91,
      skills: ["Git & GitHub", "GitHub Actions (CI/CD)", "Postman API Testing", "Linux / VPS / SiteGround", "Wireshark Packet Analysis", "TCP/IP & VLSM Subnetting", "XSS & CSRF Hardening"],
      sub: "Git & GitHub Actions, Postman, Linux, Wireshark, TCP/IP, Network Security, XSS/CSRF Prevention",
      description: "Alur kerja version control standar industri, automasi pipeline deployment, pengujian endpoint API komprehensif, analisis paket jaringan OSI layer, dan hardening proteksi kerentanan web."
    },
    {
      category: "PROBLEM SOLVING & LEADERSHIP",
      attribute: "PROBLEM SOLVING & LEADERSHIP",
      level: 93,
      skills: ["Competitive Programming (C++)", "Algorithms & Data Structures", "Big-O Optimization", "Technical Mentoring", "Project Management", "Public Speaking"],
      sub: "Competitive Programming (C++), GEMASTIK XVII, Himpunan Leadership, Mentoring 50+ Mahasiswa",
      description: "Lulusan GEMASTIK XVII Pemrograman Kompetitif dengan penguasaan DP/Graph Theory/Greedy, pengalaman memimpin divisi organisasi (HIMP TIF), dan membimbing 50+ mahasiswa sebagai Asisten Laboratorium."
    }
  ],

  // Backward compatibility alias
  get stats() {
    return this.skills;
  },

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
      id: "exp-pendidikan",
      period: "Sep 2023 – Sekarang",
      tickLabel: "S1 Trisakti '23",
      role: "Sarjana (S1) Sistem Informasi — Semester 7",
      company: "Universitas Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "FOUNDATION // 01",
      layerColor: "#FF0055",
      summary: "Mahasiswa aktif tingkat akhir dengan IPK 3.72 / 4.00 (123 SKS selesai), skor TEPT 563.33 / 677, berfokus pada rekayasa Full Stack Web dan PWA / Mobile.",
      highlights: [
        "Indeks Prestasi Kumulatif (IPK): 3.72 dari skala 4.00 dengan predikat akademik Sangat Memuaskan (telah menyelesaikan 123 SKS hingga Semester 6).",
        "Kemampuan Bahasa Inggris (TEPT): Skor 563.33 / 677 dari KUIKK Universitas Trisakti.",
        "Proyek Tugas Akhir / Capstone: OK OCE EventIT (Arsitektur Ekosistem Manajemen Event & Monitoring Digital UMKM berbasis Flutter, Flask RESTful API, dan PostgreSQL)."
      ],
      techStack: ["Information Systems", "System Analysis & Design", "Database Architecture", "Enterprise Systems", "Software Engineering", "Full-Stack Development"]
    },
    {
      id: "exp-gemastik",
      period: "Jul 2024 – Agu 2024",
      tickLabel: "GEMASTIK '24",
      role: "Competitive Programmer (Divisi Pemrograman Kompetitif)",
      company: "GEMASTIK XVII — Puspresnas / Kemendikbudristek & Univ. Trisakti",
      location: "Universitas Trisakti / Kemendikbudristek",
      layer: "COMPETITION // 02",
      layerColor: "#FCEE09",
      summary: "Mewakili Universitas Trisakti dalam ajang Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK XVII) pada divisi Pemrograman Kompetitif.",
      highlights: [
        "Lolos seleksi internal kampus dan dipercaya sebagai kontingen resmi almamater pada Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK) ke-XVII tingkat nasional.",
        "Menyelesaikan problem algoritma tingkat lanjut mencakup Dynamic Programming, Graph Theory (BFS/DFS, Dijkstra), Greedy, Number Theory, dan struktur data kompleks.",
        "Mengoptimasi eksekusi algoritma dengan limitasi memori dan batas waktu eksekusi ketat (Time Limit Exceeded protection) menggunakan C++ modern."
      ],
      techStack: ["Competitive Programming", "C++", "Dynamic Programming", "Graph Theory", "Greedy Algorithms", "Data Structures"]
    },
    {
      id: "exp-pbk",
      period: "2024 – 2025",
      tickLabel: "PBK '24",
      role: "Wakil Ketua Departemen PBK",
      company: "Himpunan Mahasiswa Teknik Informatika (HIMP TIF) Universitas Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "LEADERSHIP // 03",
      layerColor: "#FCEE09",
      summary: "Membantu memimpin divisi Pengembangan Bakat & Kreativitas mahasiswa dalam penyelenggaraan program kerja teknologi, workshop coding, dan delegasi kompetisi.",
      highlights: [
        "Mengoordinasikan program kerja strategis departemen PBK untuk mendorong eksplorasi minat bakat riset teknologi dan kreativitas mahasiswa informatika.",
        "Menyelenggarakan workshop coding, webinar teknologi, dan study group intensif serta mengelola kolaborasi kepanitiaan lintas divisi himpunan.",
        "Memfasilitasi delegasi mahasiswa berprestasi ke ajang perlombaan teknologi informasi tingkat universitas maupun nasional."
      ],
      techStack: ["Leadership", "Project Management", "Event Organizing", "Public Speaking", "Team Coordination", "Technical Mentoring"]
    },
    {
      id: "exp-aslab-algo",
      period: "Sep 2024 – Jan 2025",
      tickLabel: "Algo '24",
      role: "Asisten Laboratorium — Algoritma & Pemrograman",
      company: "Lab Komputasi Dasar, Univ. Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "ACADEMIC_LAB // 04",
      layerColor: "#00FF66",
      summary: "Membimbing mahasiswa dalam fondasi komputasi logika, struktur data dasar, dan implementasi algoritma pemrograman menggunakan Python.",
      highlights: [
        "Mengajarkan logika pemrograman dasar, branching, looping, function modular, rekursi, dan formulasi pseudocode kepada 35+ mahasiswa semester awal.",
        "Membimbing implementasi algoritma pencarian (Linear, Binary Search) dan pengurutan (Bubble, Selection, Insertion, Merge Sort) serta evaluasi kompleksitas asimtotik Big-O.",
        "Menilai penulisan kode berstandar clean code, modularisasi arsitektur file skrip, dan melatih teknik debugging kode secara sistematis."
      ],
      techStack: ["Python", "Algorithms", "Data Structures", "Big-O Notation", "Code Optimization", "Clean Code Standards"]
    },
    {
      id: "exp-aslab-analitik",
      period: "Feb 2025 – Jul 2025",
      tickLabel: "Analitik '25",
      role: "Asisten Laboratorium — Analitik Data & Business Intelligence",
      company: "Lab Sains Data & Analitik, Univ. Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "ACADEMIC_LAB // 05",
      layerColor: "#00FF66",
      summary: "Membimbing praktikum analisis data eksploratif (EDA), pemodelan machine learning dasar, dan perancangan dashboard Business Intelligence interaktif.",
      highlights: [
        "Membimbing 25+ mahasiswa dalam data preprocessing, feature engineering, penanganan missing values, dan deteksi anomali/outlier menggunakan Python (pandas, NumPy).",
        "Memandu implementasi model statistik dan machine learning seperti Regresi Linier Berganda, K-Means Clustering, dan visualisasi data matplotlib/seaborn.",
        "Mengarahkan perancangan executive dashboard interaktif berbasis Power BI, Tableau, dan Looker Studio untuk insight performa bisnis berbasis data empiris."
      ],
      techStack: ["Python (pandas, NumPy)", "Power BI", "Tableau", "Looker Studio", "Machine Learning", "EDA", "Statistical Analysis"]
    },
    {
      id: "exp-aslab-jarkom",
      period: "Sep 2025 – Jan 2026",
      tickLabel: "Jarkom '25",
      role: "Asisten Laboratorium — Jaringan Komputer",
      company: "Lab Sistem Keamanan & Jaringan, Univ. Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "ACADEMIC_LAB // 06",
      layerColor: "#00FF66",
      summary: "Membimbing praktikum arsitektur protokol jaringan TCP/IP, subnetting VLSM/CIDR, routing statis & dinamis, serta packet analysis.",
      highlights: [
        "Membimbing 25+ mahasiswa dalam konfigurasi topologi jaringan komputer, routing protokol, serta perhitungan alokasi subnet IP address berbasis CIDR dan VLSM.",
        "Mengarahkan simulasi deep packet analysis menggunakan Wireshark untuk menganalisis 3-way handshake TCP, DNS query/response, HTTP/HTTPS traffic, dan isolasi bottleneck OSI layer.",
        "Melakukan asistensi konfigurasi perangkat jaringan (switch, router, DHCP server, NAT) dan pengujian latency serta throughput transmisi data."
      ],
      techStack: ["Wireshark", "Cisco Packet Tracer", "TCP/IP Suite", "Subnetting VLSM", "Routing Protocols", "Network Security"]
    },
    {
      id: "exp-aslab-mdi",
      period: "Sep 2025 – Jan 2026",
      tickLabel: "Basis Data '25",
      role: "Asisten Laboratorium — Manajemen Data & Informasi (Basis Data)",
      company: "Lab Rekayasa Data, Teknik Informatika Univ. Trisakti",
      location: "Jakarta Barat, DKI Jakarta",
      layer: "ACADEMIC_LAB // 07",
      layerColor: "#00FF66",
      summary: "Membimbing praktikum perancangan skema basis data relasional enterprise, query optimization, DDL/DML kompleks, dan normalisasi tabel.",
      highlights: [
        "Membimbing dan menguji 30+ mahasiswa dalam perancangan database relasional, pemodelan Entity-Relationship Diagram (ERD), dan normalisasi tabel hingga 3NF/BCNF.",
        "Melatih optimasi query SQL tingkat lanjut (JOIN kompleks, Indexing, Subquery, Window/Aggregate Functions, Stored Procedures) pada PostgreSQL dan MySQL.",
        "Mengevaluasi tugas laboratorium mingguan, menguji integritas transaksi data (ACID compliance), dan membimbing proyek perancangan database enterprise."
      ],
      techStack: ["PostgreSQL", "MySQL", "SQL (DDL/DML)", "Database Design", "ERD", "Query Optimization", "Relational Modeling"]
    },
    {
      id: "exp-okoce",
      period: "Jul 2026 – Des 2026",
      tickLabel: "OK OCE '26",
      role: "Full-Stack Developer Intern",
      company: "OK OCE Indonesia (okoce.net)",
      location: "Jakarta, Indonesia (Hybrid / Onsite)",
      layer: "PROD_PLATFORM // 08",
      layerColor: "#00F0FF",
      summary: "Mengembangkan ekosistem portal komunitas wirausaha nasional (okoce.net): Smart E-Ticket Hub, Web Attendance Scanner, integrasi Payment Gateway Finpay QRIS/VA, dan toko UMKM multi-gudang.",
      highlights: [
        "Membangun Smart E-Ticket Hub & Web Attendance Scanner (/scanner) hardware-compatible (USB barcode & kamera HP Html5Qrcode) dengan 300ms live debounced manual search.",
        "Mengintegrasikan Finpay Payment Gateway untuk tiket event & bursa UMKM via QRIS (biaya admin 0.7%) dan Virtual Account dengan auto-polling AJAX real-time & webhook callback listener idempoten.",
        "Mengembangkan modul Toko UMKM (multi-gudang, kalkulasi HPP/COGS FIFO/Average, retur barang restock vs write-off) serta mesin komisi afiliasi dual-tier berparameter referral WhatsApp unik.",
        "Menerapkan security hardening: sanitasi input HtmlAman (pencegah XSS), proteksi CSRF pada seluruh endpoint AJAX, engine OTP email in-house, enkripsi JWT, dan Role-Based Access Control (RBAC)."
      ],
      techStack: ["PHP (CodeIgniter 4)", "MySQL", "JavaScript ES6+", "Tailwind CSS", "Finpay Gateway", "Html5Qrcode", "Git"]
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
