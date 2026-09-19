# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + Vanilla JavaScript + Three.js + GSAP

## Users

Recruiters, hiring managers, engineering leaders, and potential clients evaluating Felix's technical depth, frontend craft, and full-stack problem-solving ability.

## Product Purpose

An interactive 3D portfolio website presenting Felix as a high-caliber Full Stack Web Developer. It replaces generic flat portfolios with an immersive, memorable experience inspired by V/David Martinez's apartment from Cyberpunk 2077, proving capability through the medium itself.

## Positioning

Unlike conventional static card-based portfolios, this site is a living 3D Netrunner workstation where each navigation choice physically relocates the user's perspective via real-time WebGL camera choreography, showcasing real projects directly on multi-monitor displays inside the 3D scene (Diegetic UI).

## Operating Context

- Evaluators viewing on desktop and laptop browsers seeking rapid proof of technical and visual excellence.
- Mobile viewers needing a responsive experience with intuitive touch controls.
- Visitors browsing projects, viewing source repositories on GitHub, and reaching out via email/social channels.

## Capabilities and Constraints

- **Four Cinematic Anchors**:
  - `[01] HOME`: Wide panoramic view of the Megabuilding H10 apartment with Night City skyline visible through blinds.
  - `[02] PROJECTS`: Zoom-in to the curved multi-monitor netrunner rig showcasing real projects with live links and previews.
  - `[03] STATS`: Pan to the cyberware/workbench showing profile, skills, and Cyberpunk-style attribute stats.
  - `[04] CONTACT`: Focus on the glowing Holo-communicator for instant messaging and links.
- **Diegetic UI**: Project mockups and interactive details rendered in-scene on 3D monitors.
- **Procedural 3D Environment**: Entire room built with Three.js procedural geometries and custom shaders—instant load time without heavy external 3D asset downloads.
- **Soundscape**: Web Audio API synthesized sci-fi sound effects and atmospheric ambient synthwave with an accessible mute toggle.

## Brand Commitments

- **Subject**: Felix (GitHub: `felixpalingan`)
- **Title**: Full Stack Web Developer
- **Theme**: Cyberpunk 2077 Megabuilding H10 Apartment (V / David Martinez)
- **Palette**: Cyber Yellow (`#FCEE09`), Neon Cyan (`#00F0FF`), Neon Pink/Magenta (`#FF003C`), Carbon Dark (`#0A0B10`)
- **Tone**: Bold, high-craft, futuristic, technical, and polished.

## Evidence on Hand

- Developer profile photo: `assets/foto-profil.jpg`
- Featured project mockups: `assets/mockup-okoce.png` (OK OCE), `assets/mockup-sis.png` (SIS Website)
- Active GitHub projects at `https://github.com/felixpalingan`:
  - `AI-Business-Health-Check`
  - `IronPixels` (TypeScript, live at `iron-pixels.vercel.app`)
  - `Oit` (TypeScript, live at `oit-seven.vercel.app`)
  - `Gamble` (JavaScript, live at `gamble-inky.vercel.app`)
  - `sis-website` (HTML/JS)
  - `Soundsort` (JavaScript)

## Product Principles

1. **Craft is the Proof**: The portfolio itself demonstrates mastery of real-time 3D, physics, shaders, audio, and responsive engineering.
2. **Diegetic Immersion**: Content lives inside the world (on screens and holograms) rather than breaking immersion with generic popups.
3. **Zero Friction**: 60 FPS performance, fast procedural loading, and accessible touch/keyboard fallbacks for all device tiers.
4. **Authenticity**: Every showcased project reflects real code and shipped artifacts from Felix's GitHub and client work.

## Accessibility & Inclusion

- Keyboard navigation accessible between all 4 sections.
- High-contrast text HUD over 3D canvas with readable fallback typography.
- Sound effects and ambient audio muted by default with prominent toggle control.
- `prefers-reduced-motion` compliance to soften camera travel for sensitive users.
