/**
 * AMBIENT NEURAL BACKGROUND & CINEMATIC INTRO SHOWREEL
 * Portfolio of Urmi Urma Snigdha - CSE Graduate · UI/UX Designer
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DYNAMIC NEURAL MESH AMBIENT CANVAS (HERO BACKGROUND)
  // =========================================================================
  function initAmbientCanvas() {
    var canvas = document.getElementById('hero-ambient-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var particleCount = 45;
    var mouse = { x: -1000, y: -1000, radius: 120 };

    function resize() {
      var hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      var isLight = document.documentElement.classList.contains('light');
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: Math.random() * 2 + 1.2,
          baseColor: isLight ? 'rgba(2, 132, 199, ' : 'rgba(6, 182, 212, ',
          glowColor: isLight ? 'rgba(13, 148, 136, ' : 'rgba(34, 211, 238, '
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      var isLight = document.documentElement.classList.contains('light');

      // Update and draw particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (elastic push)
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var angle = Math.atan2(dy, dx);
          var force = (mouse.radius - dist) / mouse.radius;
          p.x -= Math.cos(angle) * force * 2.5;
          p.y -= Math.sin(angle) * force * 2.5;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor + (isLight ? '0.4)' : '0.65)');
        ctx.shadowColor = p.glowColor + (isLight ? '0.2)' : '0.5)');
        ctx.shadowBlur = isLight ? 4 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw constellation lines between nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            var alpha = (1 - dist2 / 110) * (isLight ? 0.18 : 0.28);
            ctx.strokeStyle = p.baseColor + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });

    var hero = canvas.parentElement;
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      hero.addEventListener('mouseleave', function () {
        mouse.x = -1000;
        mouse.y = -1000;
      });
    }

    resize();
    createParticles();
    animate();
  }

  // =========================================================================
  // 2. CINEMATIC INTRO VIDEO SHOWREEL (CANVAS VIDEO SYNTHESIZER)
  // =========================================================================
  var introPlayer = {
    modal: null,
    canvas: null,
    ctx: null,
    isPlaying: false,
    currentFrame: 0,
    totalFrames: 1800, // 60 seconds at 30 fps
    animId: null,
    scenes: [
      {
        id: 'hero',
        duration: 270, // 0 - 9s
        title: 'URMI URMA SNIGDHA',
        subtitle: 'B.Sc. in Computer Science & Engineering Graduate',
        highlight: 'United International University (UIU)',
        tag: 'PORTFOLIO SHOWREEL'
      },
      {
        id: 'award',
        duration: 330, // 9 - 20s
        title: '1ST PRIZE WINNER',
        subtitle: 'UIU Moving Canvas Challenge 2026 (BDT 50,000)',
        highlight: 'Official UIU Transit Bus Fleet Exterior Livery',
        tag: 'AWARDS & RECOGNITION'
      },
      {
        id: 'fundbridge',
        duration: 360, // 20 - 32s
        title: 'FUNDBRIDGE',
        subtitle: 'Distributed Micro-Finance & Anti-Predatory Lending Engine',
        highlight: 'AES-256-GCM Vault · Immutable SHA-256 Ledger · Double-Entry',
        tag: 'FEATURED FINTECH'
      },
      {
        id: 'medvision',
        duration: 300, // 32 - 42s
        title: 'MEDVISION-AI',
        subtitle: 'Microscopic Cellular Image Processing & Anomaly Segmentation',
        highlight: 'CLAHE · Otsu Thresholding · Distance Watershed · <145ms',
        tag: 'COMPUTER VISION'
      },
      {
        id: 'marketpulse',
        duration: 270, // 42 - 51s
        title: 'MARKETPULSE & DOCUQUERY',
        subtitle: 'Data Mining (Apriori & RFM) · Dense Vector RAG (FAISS)',
        highlight: '0.923 ROC-AUC Churn Classifier · 99.1% Factual Grounding',
        tag: 'DATA SCIENCE & NLP'
      },
      {
        id: 'contact',
        duration: 270, // 51 - 60s
        title: "LET'S BUILD TOGETHER",
        subtitle: 'Available Immediately for Full-Time & Remote Roles',
        highlight: 'urmiurmasnigdha@gmail.com · Dhaka, Bangladesh',
        tag: 'HIRE & COLLABORATE'
      }
    ],

    open: function () {
      var self = this;
      var overlay = document.getElementById('global-modal-overlay');
      if (!overlay) return;

      overlay.innerHTML = `
        <div class="intro-showreel-modal" onclick="event.stopPropagation();">
          <div class="intro-showreel-header">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span class="pulse-dot" style="background:#ef4444;box-shadow:0 0 8px #ef4444;"></span>
              <span style="font-family:var(--font-mono);font-size:0.8rem;color:#f87171;font-weight:700;">LIVE 4K PORTFOLIO SHOWREEL (60s)</span>
            </div>
            <button id="close-showreel-btn" class="modal-close-btn" style="position:static;width:32px;height:32px;font-size:1.2rem;">&times;</button>
          </div>

          <div class="intro-showreel-viewport" style="position:relative;background:#030712;aspect-ratio:16/9;overflow:hidden;border-radius:12px;border:1px solid rgba(6,182,212,0.3);">
            <canvas id="showreel-canvas" width="960" height="540" style="width:100%;height:100%;display:block;"></canvas>
            
            <!-- Watermark Tag -->
            <div style="position:absolute;top:16px;right:18px;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.65);padding:4px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(6px);">
              <span style="color:#22d3ee;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;">UIU CSE '26</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#e2e8f0;font-family:var(--font-mono);font-size:0.72rem;">URMI URMA SNIGDHA</span>
            </div>
          </div>

          <!-- Video Playback Scrub & Control Bar -->
          <div class="intro-showreel-controls" style="margin-top:1rem;display:flex;flex-direction:column;gap:0.75rem;">
            <!-- Progress Bar -->
            <div id="showreel-track" style="position:relative;height:6px;background:rgba(255,255,255,0.1);border-radius:999px;cursor:pointer;">
              <div id="showreel-progress" style="position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);border-radius:999px;width:0%;"></div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;gap:0.5rem;align-items:center;">
                <button id="showreel-play-btn" class="btn btn-gradient btn-small" style="padding:0.4rem 1rem;">
                  <span id="showreel-play-icon">⏸ Pause</span>
                </button>
                <button id="showreel-replay-btn" class="btn btn-secondary btn-small" style="padding:0.4rem 0.85rem;">
                  <span>↺ Replay</span>
                </button>
                <span id="showreel-time" style="font-family:var(--font-mono);font-size:0.8rem;color:#94a3b8;margin-left:0.5rem;">00:00 / 01:00</span>
              </div>

              <!-- Quick Scene Jumpers -->
              <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
                <button class="btn btn-secondary btn-small" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(0)">1. Intro</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(1)">2. UIU 1st Prize</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(2)">3. FundBridge</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(3)">4. MedVision</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(4)">5. Data Science</button>
              </div>
            </div>
          </div>
        </div>
      `;

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      self.canvas = document.getElementById('showreel-canvas');
      if (self.canvas) {
        self.ctx = self.canvas.getContext('2d');
      }

      document.getElementById('close-showreel-btn').onclick = function () {
        self.close();
      };
      document.getElementById('showreel-play-btn').onclick = function () {
        self.togglePlay();
      };
      document.getElementById('showreel-replay-btn').onclick = function () {
        self.currentFrame = 0;
        self.play();
      };

      document.getElementById('showreel-track').onclick = function (e) {
        var rect = this.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var pct = clickX / rect.width;
        self.currentFrame = Math.floor(pct * self.totalFrames);
        self.renderFrame();
      };

      self.currentFrame = 0;
      self.play();
    },

    close: function () {
      this.pause();
      var overlay = document.getElementById('global-modal-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.innerHTML = '';
      }
      document.body.style.overflow = '';
    },

    play: function () {
      var self = this;
      self.isPlaying = true;
      var icon = document.getElementById('showreel-play-icon');
      if (icon) icon.textContent = '⏸ Pause';

      function loop() {
        if (!self.isPlaying) return;
        self.currentFrame++;
        if (self.currentFrame >= self.totalFrames) {
          self.currentFrame = 0;
        }
        self.renderFrame();
        self.animId = requestAnimationFrame(loop);
      }
      cancelAnimationFrame(self.animId);
      self.animId = requestAnimationFrame(loop);
    },

    pause: function () {
      this.isPlaying = false;
      cancelAnimationFrame(this.animId);
      var icon = document.getElementById('showreel-play-icon');
      if (icon) icon.textContent = '▶ Play';
    },

    togglePlay: function () {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    jumpToScene: function (sceneIndex) {
      var frame = 0;
      for (var i = 0; i < sceneIndex && i < this.scenes.length; i++) {
        frame += this.scenes[i].duration;
      }
      this.currentFrame = frame;
      this.renderFrame();
      if (!this.isPlaying) this.play();
    },

    getCurrentScene: function () {
      var accumulated = 0;
      for (var i = 0; i < this.scenes.length; i++) {
        accumulated += this.scenes[i].duration;
        if (this.currentFrame < accumulated) {
          return {
            scene: this.scenes[i],
            index: i,
            sceneProgress: (this.currentFrame - (accumulated - this.scenes[i].duration)) / this.scenes[i].duration
          };
        }
      }
      return { scene: this.scenes[this.scenes.length - 1], index: this.scenes.length - 1, sceneProgress: 1 };
    },

    renderFrame: function () {
      if (!this.ctx || !this.canvas) return;
      var ctx = this.ctx;
      var w = this.canvas.width;
      var h = this.canvas.height;
      var f = this.currentFrame;

      if (!ctx.roundRect) {
        ctx.roundRect = function(rx, ry, rw, rh) {
          ctx.rect(rx, ry, rw, rh);
        };
      }

      // Update progress bar
      var pct = (f / this.totalFrames) * 100;
      var progressElem = document.getElementById('showreel-progress');
      if (progressElem) progressElem.style.width = pct + '%';

      var totalSec = Math.floor(f / 30);
      var secStr = (totalSec % 60 < 10 ? '0' : '') + (totalSec % 60);
      var minStr = (Math.floor(totalSec / 60) < 10 ? '0' : '') + Math.floor(totalSec / 60);
      var timeElem = document.getElementById('showreel-time');
      if (timeElem) timeElem.textContent = minStr + ':' + secStr + ' / 01:00';

      var sceneData = this.getCurrentScene();
      var scene = sceneData.scene;
      var sp = sceneData.sceneProgress;

      // Background cinematic mesh
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Dynamic animated grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      var gridOffset = (f * 0.75) % 40;
      for (var gx = gridOffset; gx < w; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (var gy = gridOffset; gy < h; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Ambient radial lighting
      var lightGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.6);
      lightGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      lightGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      lightGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, w, h);

      // Sine wave graphic at bottom
      ctx.beginPath();
      ctx.moveTo(0, h - 50);
      for (var sx = 0; sx < w; sx += 10) {
        var sy = h - 50 + Math.sin((sx + f * 4) * 0.015) * 16;
        ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Render Scene Content with smooth fade in/out
      var alpha = 1;
      if (sp < 0.12) alpha = sp / 0.12;
      else if (sp > 0.88) alpha = (1 - sp) / 0.12;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Category / Tag Badge
      ctx.save();
      ctx.translate(60, 110);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0, 0, 220, 32, 16);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 12px Space Grotesk, sans-serif';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(scene.tag, 16, 20);
      ctx.restore();

      // Main Scene Title
      ctx.font = '800 44px Space Grotesk, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
      ctx.shadowBlur = 18;
      ctx.fillText(scene.title, 60, 200);
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.font = '600 22px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(scene.subtitle, 60, 245);

      // Highlight Metric Card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(60, 280, w - 120, 75, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('⚡ ' + scene.highlight, 85, 326);

      // Scene specific visuals
      if (scene.id === 'award') {
        // Bus livery trophy graphics
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 14px Space Grotesk';
        ctx.fillText('🏆 UIU MOVING CANVAS CHAMPIONSHIP · BDT 50,000 OFFICIAL PRIZE', 85, 410);
      } else if (scene.id === 'fundbridge') {
        ctx.fillStyle = '#10b981';
        ctx.font = '13px JetBrains Mono';
        ctx.fillText('🔐 SHA-256 Tamper Audit: Verified Immutable · AES-256-GCM NID/KYC Vault', 85, 410);
      } else if (scene.id === 'medvision') {
        ctx.fillStyle = '#22d3ee';
        ctx.font = '13px JetBrains Mono';
        ctx.fillText('🔬 Automated Watershed Segmentation · 94.8% Precision in <145 ms', 85, 410);
      } else if (scene.id === 'marketpulse') {
        ctx.fillStyle = '#a78bfa';
        ctx.font = '13px JetBrains Mono';
        ctx.fillText('📊 0.923 ROC-AUC Churn Classifier · FAISS Sub-40ms Vector Semantic Search', 85, 410);
      }

      ctx.globalAlpha = 1;
    }
  };

  window.PORTFOLIO_INTRO = introPlayer;

  document.addEventListener('DOMContentLoaded', function () {
    initAmbientCanvas();

    var openBtn = document.getElementById('open-intro-video-btn');
    if (openBtn) {
      openBtn.onclick = function (e) {
        e.preventDefault();
        window.PORTFOLIO_INTRO.open();
      };
    }
  });
})();
