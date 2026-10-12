import gsap from 'gsap';
import { portfolioData } from '../data/portfolioData.js';
import { cyberAudio } from './CyberAudio.js';

/**
 * BDPlaybackOverlay
 * Renders the diegetic Cyberpunk 2077 Braindance (BD) HUD visor overlay,
 * interactive timeline scrubber, and holographic past experience cards.
 */
export class BDPlaybackOverlay {
  constructor(options = {}) {
    this.container = null;
    this.onDisengageCallback = options.onDisengage || null;
    this.currentMode = 'EXPERIENCES'; // 'EXPERIENCES' | 'STATS'
    this.currentExpIndex = 0;
    this.experiences = portfolioData.experiences || [];
    this.stats = portfolioData.stats || [];

    this.createDOM();
  }

  createDOM() {
    let el = document.getElementById('bd-playback-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bd-playback-overlay';
      el.className = 'bd-overlay hidden';
      document.body.appendChild(el);
    }
    this.container = el;
    this.render();
  }

  render() {
    if (!this.container) return;

    const exp = this.experiences[this.currentExpIndex] || {};
    const totalExp = this.experiences.length;
    // Calculate exact percentage aligning with tick dots
    const progressPct = totalExp > 1 ? (this.currentExpIndex / (totalExp - 1)) * 100 : 100;

    this.container.innerHTML = `
      <!-- BD Visor Scanline & Optical Peripheral Mask -->
      <div class="bd-visor-mask">
        <div class="bd-visor-border top-left"></div>
        <div class="bd-visor-border top-right"></div>
        <div class="bd-visor-border bottom-left"></div>
        <div class="bd-visor-border bottom-right"></div>
        <div class="bd-visor-glitch-line"></div>
      </div>

      <!-- Top Telemetry Header -->
      <div class="bd-top-bar">
        <div class="bd-rec-badge">
          <span class="bd-rec-dot"></span>
          <span class="bd-rec-text">BRAINDANCE // MEMORY ARCHIVE</span>
          <span class="bd-timecode">[00:24:${String(this.currentExpIndex * 15 + 12).padStart(2, '0')}:88]</span>
        </div>

        <!-- Mode / Layer Tabs -->
        <div class="bd-layer-tabs">
          <button class="bd-tab-btn ${this.currentMode === 'EXPERIENCES' ? 'active' : ''}" data-mode="EXPERIENCES">
            <span class="tab-code">[01]</span> CAREER JOURNEY
          </button>
          <button class="bd-tab-btn ${this.currentMode === 'STATS' ? 'active' : ''}" data-mode="STATS">
            <span class="tab-code">[02]</span> OPERATIVE ATTRIBUTES
          </button>
        </div>

        <!-- Disengage Button -->
        <button class="bd-disengage-btn" id="btn-bd-disengage" title="Disengage Braindance (ESC)">
          <span class="btn-cross">✕</span>
          <span class="btn-label">DISENGAGE BD [ESC]</span>
        </button>
      </div>

      <!-- Center Holographic AR Content -->
      <div class="bd-center-stage">
        ${this.currentMode === 'EXPERIENCES' ? this.renderExperienceCard(exp, totalExp) : this.renderStatsMatrix()}
      </div>

      <!-- Bottom Timeline Deck (Only shown for EXPERIENCES, hidden for STATS) -->
      ${this.currentMode === 'EXPERIENCES' ? `
        <div class="bd-bottom-deck">
          <div class="bd-deck-controls">
            <button class="bd-ctrl-btn" id="bd-btn-prev" title="Previous Era (A / ◄)">
              <span>◄ REWIND</span>
            </button>
            <div class="bd-pause-badge" title="Manual Playback Mode">
              <span>❚❚</span>
            </div>
            <button class="bd-ctrl-btn" id="bd-btn-next" title="Next Era (D / ►)">
              <span>FAST-FORWARD ►</span>
            </button>
          </div>

          <!-- Interactive Scrubber Bar with Exact Dot Alignment -->
          <div class="bd-scrubber-track">
            <div class="bd-scrubber-rail">
              <div class="bd-scrubber-bg"></div>
              <div class="bd-scrubber-progress" style="width: ${progressPct}%"></div>
              <div class="bd-scrubber-ticks">
                ${this.experiences.map((e, idx) => {
                  const tickLeft = totalExp > 1 ? (idx / (totalExp - 1)) * 100 : 50;
                  return `
                    <div class="bd-scrubber-tick ${idx === this.currentExpIndex ? 'current' : ''} ${idx < this.currentExpIndex ? 'passed' : ''}" 
                         style="left: ${tickLeft}%"
                         data-index="${idx}" 
                         title="${e.period} - ${e.role}">
                      <span class="tick-label">${e.period.split(' ')[0]}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="bd-deck-hint">
            <span>NAVIGATION: ◄ / ► OR A / D KEYS // ESC TO DISENGAGE</span>
          </div>
        </div>
      ` : ''}
    `;

    this.bindEvents();
  }

  renderExperienceCard(exp, totalExp) {
    return `
      <div class="bd-memory-shard" id="bd-current-shard">
        <!-- Hologram Header Tag -->
        <div class="shard-header">
          <div class="shard-badges">
            <span class="badge-era" style="color:${exp.layerColor || '#00F0FF'}">${exp.period || ''}</span>
            <span class="badge-layer">${exp.layer || 'SYS_ARCH // 01'}</span>
          </div>
          <div class="shard-pagination">SHARD ${this.currentExpIndex + 1} OF ${totalExp}</div>
        </div>

        <!-- Role & Company -->
        <div class="shard-title-block">
          <h2 class="shard-role">${exp.role || 'Full Stack Engineer'}</h2>
          <div class="shard-org">
            <span class="org-icon">◈</span>
            <span class="org-name">${exp.company || 'Digital Forge'}</span>
            <span class="org-loc"> // ${exp.location || 'Remote'}</span>
          </div>
        </div>

        <!-- Summary -->
        <p class="shard-summary">${exp.summary || ''}</p>

        <!-- Key Contributions -->
        <div class="shard-highlights">
          <div class="highlights-label">// KEY MEMORY RECORDINGS:</div>
          <ul>
            ${(exp.highlights || []).map(h => `<li><span class="bullet">▹</span>${h}</li>`).join('')}
          </ul>
        </div>

        <!-- Tech Stack Chips -->
        <div class="shard-tech-stack">
          ${(exp.techStack || []).map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  renderStatsMatrix() {
    return `
      <div class="bd-stats-matrix" id="bd-current-shard">
        <div class="matrix-header">
          <span class="matrix-title">// OPERATIVE ATTRIBUTES &amp; NEURAL ATTRIBUTES</span>
          <span class="matrix-sub">SYS_DIAGNOSTICS: OPTIMAL (60 FPS)</span>
        </div>
        <div class="matrix-grid">
          ${this.stats.map(s => `
            <div class="matrix-card">
              <div class="card-head">
                <span class="card-attr">${s.attribute}</span>
                <span class="card-level">${s.level}<span class="level-max">/100</span></span>
              </div>
              <div class="card-bar-bg">
                <div class="card-bar-fill" style="width: ${s.level}%"></div>
              </div>
              <div class="card-sub">${s.sub}</div>
              <div class="card-desc">${s.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Mode tabs
    const tabBtns = this.container.querySelectorAll('.bd-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (mode && mode !== this.currentMode) {
          cyberAudio.playClick();
          this.currentMode = mode;
          this.render();
        }
      });
    });

    // Disengage
    const disengageBtn = this.container.querySelector('#btn-bd-disengage');
    if (disengageBtn) {
      disengageBtn.addEventListener('click', () => {
        cyberAudio.playBDDisengage();
        if (this.onDisengageCallback) this.onDisengageCallback();
      });
    }

    // Prev / Next
    const prevBtn = this.container.querySelector('#bd-btn-prev');
    const nextBtn = this.container.querySelector('#bd-btn-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        cyberAudio.playTick();
        this.prevShard();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        cyberAudio.playTick();
        this.nextShard();
      });
    }

    // Scrubber ticks
    const ticks = this.container.querySelectorAll('.bd-scrubber-tick');
    ticks.forEach(t => {
      t.addEventListener('click', () => {
        const idx = parseInt(t.getAttribute('data-index'), 10);
        if (!isNaN(idx) && idx !== this.currentExpIndex) {
          cyberAudio.playTick();
          this.setShardIndex(idx);
        }
      });
    });
  }

  show() {
    if (!this.container) return;
    this.container.classList.remove('hidden');

    const shard = document.getElementById('bd-current-shard');
    if (shard) {
      gsap.fromTo(shard, 
        { opacity: 0, scale: 0.94, filter: 'blur(8px) brightness(2)' },
        { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.45, ease: 'power2.out' }
      );
    }
  }

  hide() {
    if (!this.container) return;
    gsap.to(this.container, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        this.container.classList.add('hidden');
        this.container.style.opacity = '1';
      }
    });
  }

  prevShard() {
    const total = this.experiences.length;
    this.currentExpIndex = (this.currentExpIndex - 1 + total) % total;
    this.animateShardTransition();
  }

  nextShard() {
    const total = this.experiences.length;
    this.currentExpIndex = (this.currentExpIndex + 1) % total;
    this.animateShardTransition();
  }

  setShardIndex(idx) {
    this.currentExpIndex = idx;
    this.animateShardTransition();
  }

  animateShardTransition() {
    this.render();
    const shard = document.getElementById('bd-current-shard');
    if (shard) {
      gsap.fromTo(shard,
        { opacity: 0, y: 15, filter: 'brightness(1.8)' },
        { opacity: 1, y: 0, filter: 'brightness(1)', duration: 0.35, ease: 'power2.out' }
      );
    }
  }
}
