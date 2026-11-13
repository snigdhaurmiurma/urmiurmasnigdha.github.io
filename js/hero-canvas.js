/**
 * AMBIENT NEURAL BACKGROUND & ANIMATED CARTOON INTRO VIDEO
 * Portfolio of Urmi Urma Snigdha - CSE Graduate · UI/UX Designer
 * Features: Cartoon "Tell Me About Yourself" Video Presentation with Character Lip-Sync & Gestures
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
      if (!hero) return;
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

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var angle = Math.atan2(dy, dx);
          var force = (mouse.radius - dist) / mouse.radius;
          p.x -= Math.cos(angle) * force * 2.5;
          p.y -= Math.sin(angle) * force * 2.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor + (isLight ? '0.4)' : '0.65)');
        ctx.shadowColor = p.glowColor + (isLight ? '0.2)' : '0.5)');
        ctx.shadowBlur = isLight ? 4 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

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
  // 2. CARTOON ANIMATED INTRO VIDEO (TELL ME ABOUT YOURSELF)
  // =========================================================================
  var cartoonIntroPlayer = {
    canvas: null,
    ctx: null,
    isPlaying: false,
    soundEnabled: true,
    currentFrame: 0,
    totalFrames: 720, // 24 seconds at 30 fps
    animId: null,
    lastSceneSpoken: -1,

    scenes: [
      {
        id: 'intro',
        duration: 180, // 0 - 6s
        title: 'Hi there! I\'m Urmi! 👋',
        subtitle: 'B.Sc. in Computer Science & Engineering Graduate',
        speech: 'Hello there! I am Urmi Urma Snigdha — a fresh Computer Science and Engineering graduate from United International University, Dhaka!',
        bullets: [
          '🎓 United International University (UIU), Dhaka',
          '⚡ Bridging Engineering Architecture with Human-Centered Design',
          '🚀 Available Immediately for Full-Time & Remote Roles'
        ],
        action: 'wave'
      },
      {
        id: 'what-i-did',
        duration: 180, // 6 - 12s
        title: 'What I\'ve Built & Won 🏆',
        subtitle: '1st Prize University Bus Livery & Secure FinTech Engine',
        speech: 'I love solving real-world problems! I won 1st Prize in the UIU Moving Canvas competition for designing our official university transit bus fleet, and built FundBridge — a secure FinTech micro-loan platform!',
        bullets: [
          '🏆 1st Prize Winner · UIU Moving Canvas Challenge (BDT 50,000)',
          '🏦 Built FundBridge: AES-256-GCM Vault & Immutable SHA-256 Ledger',
          '🔬 MedVision-AI: Automated Cellular Watershed Segmentation Pipeline'
        ],
        action: 'present-trophy'
      },
      {
        id: 'skills',
        duration: 180, // 12 - 18s
        title: 'My Technical & Design Stack 💻',
        subtitle: 'Machine Learning, Computer Vision & Figma UI/UX Systems',
        speech: 'My engineering sweet spot is Machine Learning, Computer Vision, and full-stack software development — paired with intuitive, production-grade UI and UX design systems in Figma.',
        bullets: [
          '🧠 Machine Learning, Computer Vision & Vector RAG (Python, OpenCV, PyTorch)',
          '⚙️ Full-Stack Software: React, Node.js, Express, SQLite & PostgreSQL',
          '🎨 UI/UX Design Systems, Wireframing & Auto-Layout Prototyping in Figma'
        ],
        action: 'coding'
      },
      {
        id: 'cta',
        duration: 180, // 18 - 24s
        title: 'What I Want to Do Next 🚀',
        subtitle: 'Let\'s Connect & Build Something Impactful Together!',
        speech: 'I am ready to bring my energy, problem-solving mindset, and design excellence to an exciting full-time or remote team. Let\'s build something amazing together — email me!',
        bullets: [
          '🎯 Goal: Full-Time / Remote Software Engineering or UI/UX Role',
          '✉️ Direct Email: urmiurmasnigdha@gmail.com',
          '🤝 Let\'s connect and discuss opportunities!'
        ],
        action: 'peace-sign'
      }
    ],

    open: function () {
      var self = this;
      var overlay = document.getElementById('global-modal-overlay');
      if (!overlay) return;

      overlay.innerHTML = `
        <div class="intro-showreel-modal" onclick="event.stopPropagation();">
          <div class="intro-showreel-header">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span class="pulse-dot" style="background:#22d3ee;box-shadow:0 0 10px #22d3ee;"></span>
              <span style="font-family:var(--font-heading);font-size:0.92rem;color:var(--text-highlight);font-weight:700;">
                🎬 Animated Intro: "Tell Me About Yourself" (24s)
              </span>
            </div>
            <button id="close-showreel-btn" class="modal-close-btn" style="position:static;width:34px;height:34px;font-size:1.3rem;">&times;</button>
          </div>

          <!-- Video Viewport -->
          <div class="intro-showreel-viewport" style="position:relative;background:#050d1a;aspect-ratio:16/9;overflow:hidden;border-radius:14px;border:1px solid rgba(6,182,212,0.35);box-shadow:inset 0 0 40px rgba(0,0,0,0.8);">
            <canvas id="showreel-canvas" width="960" height="540" style="width:100%;height:100%;display:block;"></canvas>
            
            <!-- Watermark Pill -->
            <div style="position:absolute;top:16px;right:18px;display:flex;align-items:center;gap:8px;background:rgba(2,12,23,0.75);padding:5px 14px;border-radius:999px;border:1px solid rgba(6,182,212,0.3);backdrop-filter:blur(8px);">
              <span style="color:#22d3ee;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">UIU CSE '26</span>
              <span style="color:#64748b;">•</span>
              <span style="color:#ffffff;font-family:var(--font-heading);font-size:0.75rem;font-weight:600;">URMI SNIGDHA</span>
            </div>
          </div>

          <!-- Playback Scrub & Control Bar -->
          <div class="intro-showreel-controls" style="margin-top:1.15rem;display:flex;flex-direction:column;gap:0.75rem;">
            <!-- Progress Scrub Bar -->
            <div id="showreel-track" style="position:relative;height:7px;background:rgba(255,255,255,0.12);border-radius:999px;cursor:pointer;">
              <div id="showreel-progress" style="position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg, #06b6d4, #38bdf8, #10b981);border-radius:999px;width:0%;transition:width 0.1s linear;"></div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;gap:0.5rem;align-items:center;">
                <button id="showreel-play-btn" class="btn btn-gradient btn-small" style="padding:0.42rem 1.1rem;">
                  <span id="showreel-play-icon">⏸ Pause</span>
                </button>
                <button id="showreel-sound-btn" class="btn btn-secondary btn-small" style="padding:0.42rem 0.85rem;" title="Toggle Speech Voice Audio">
                  <span id="showreel-sound-icon">🔊 Voice: On</span>
                </button>
                <button id="showreel-replay-btn" class="btn btn-secondary btn-small" style="padding:0.42rem 0.85rem;">
                  <span>↺ Replay</span>
                </button>
                <span id="showreel-time" style="font-family:var(--font-mono);font-size:0.82rem;color:var(--text-muted);margin-left:0.35rem;">00:00 / 00:24</span>
              </div>

              <!-- Quick Scene Jumpers -->
              <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
                <button class="btn btn-secondary btn-small" style="font-size:0.75rem;padding:0.25rem 0.65rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(0)">1. Hi, I'm Urmi! 👋</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.75rem;padding:0.25rem 0.65rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(1)">2. What I've Done 🏆</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.75rem;padding:0.25rem 0.65rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(2)">3. Skills 💻</button>
                <button class="btn btn-secondary btn-small" style="font-size:0.75rem;padding:0.25rem 0.65rem;" onclick="window.PORTFOLIO_INTRO.jumpToScene(3)">4. Let's Talk! 🚀</button>
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
      document.getElementById('showreel-sound-btn').onclick = function () {
        self.toggleSound();
      };
      document.getElementById('showreel-replay-btn').onclick = function () {
        self.currentFrame = 0;
        self.lastSceneSpoken = -1;
        self.play();
      };

      document.getElementById('showreel-track').onclick = function (e) {
        var rect = this.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var pct = clickX / rect.width;
        self.currentFrame = Math.floor(pct * self.totalFrames);
        self.lastSceneSpoken = -1;
        self.renderFrame();
      };

      self.currentFrame = 0;
      self.lastSceneSpoken = -1;
      self.play();
    },

    close: function () {
      this.pause();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
          self.lastSceneSpoken = -1;
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      var icon = document.getElementById('showreel-play-icon');
      if (icon) icon.textContent = '▶ Play';
    },

    togglePlay: function () {
      if (this.isPlaying) {
        this.pause();
      } else {
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        this.play();
      }
    },

    toggleSound: function () {
      this.soundEnabled = !this.soundEnabled;
      var icon = document.getElementById('showreel-sound-icon');
      if (icon) {
        icon.textContent = this.soundEnabled ? '🔊 Voice: On' : '🔇 Voice: Muted';
      }
      if (!this.soundEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else if (this.soundEnabled) {
        this.lastSceneSpoken = -1;
      }
    },

    jumpToScene: function (sceneIndex) {
      var frame = 0;
      for (var i = 0; i < sceneIndex && i < this.scenes.length; i++) {
        frame += this.scenes[i].duration;
      }
      this.currentFrame = frame;
      this.lastSceneSpoken = -1;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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

    speakScene: function (sceneIndex) {
      if (!this.soundEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      var text = this.scenes[sceneIndex].speech;
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.15;

      var voices = window.speechSynthesis.getVoices();
      var femaleVoice = voices.find(function (v) {
        return (
          v.name.includes('Female') ||
          v.name.includes('Zira') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Google US English')
        );
      });
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      window.speechSynthesis.speak(utterance);
    },

    // =======================================================================
    // DRAW CARTOON URMI (PROCEDURAL VECTOR CHARACTER)
    // =======================================================================
    drawCartoonUrmi: function (ctx, cx, cy, f, action) {
      ctx.save();
      ctx.translate(cx, cy);

      // Subtle breathing float
      var breathY = Math.sin(f * 0.08) * 3;
      var isBlinking = (f % 110 >= 0 && f % 110 <= 6);
      var mouthOpen = Math.abs(Math.sin(f * 0.28)) * 8; // Lip-sync while speaking

      // 1. Long Dark Hair (Back)
      ctx.fillStyle = '#171311';
      ctx.beginPath();
      ctx.ellipse(0, 10 + breathY, 82, 105, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair strands falling on shoulders
      ctx.beginPath();
      ctx.moveTo(-75, 40 + breathY);
      ctx.quadraticCurveTo(-90, 140, -60, 210);
      ctx.lineTo(-40, 210);
      ctx.quadraticCurveTo(-60, 120, -50, 40 + breathY);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(75, 40 + breathY);
      ctx.quadraticCurveTo(90, 140, 60, 210);
      ctx.lineTo(40, 210);
      ctx.quadraticCurveTo(60, 120, 50, 40 + breathY);
      ctx.fill();

      // 2. Torso / Modern Tech Blazer
      ctx.fillStyle = '#065f46'; // Teal blazer
      ctx.beginPath();
      ctx.roundRect(-55, 115 + breathY, 110, 130, 20);
      ctx.fill();

      // Inner top
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-25, 115 + breathY);
      ctx.lineTo(0, 155 + breathY);
      ctx.lineTo(25, 115 + breathY);
      ctx.closePath();
      ctx.fill();

      // Collar accents
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-35, 115 + breathY);
      ctx.lineTo(0, 165 + breathY);
      ctx.lineTo(35, 115 + breathY);
      ctx.stroke();

      // 3. Neck
      ctx.fillStyle = '#fbd5b5';
      ctx.beginPath();
      ctx.roundRect(-16, 75 + breathY, 32, 45, 8);
      ctx.fill();

      // 4. Head / Face
      ctx.fillStyle = '#fce7d2';
      ctx.beginPath();
      ctx.ellipse(0, 45 + breathY, 60, 68, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rosy cheeks
      ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
      ctx.beginPath();
      ctx.arc(-34, 56 + breathY, 12, 0, Math.PI * 2);
      ctx.arc(34, 56 + breathY, 12, 0, Math.PI * 2);
      ctx.fill();

      // 5. Stylized Hair (Front Bangs & Soft Parting)
      ctx.fillStyle = '#1e1714';
      ctx.beginPath();
      ctx.moveTo(-60, 25 + breathY);
      ctx.quadraticCurveTo(-30, -32, 0, -22);
      ctx.quadraticCurveTo(35, -30, 60, 25 + breathY);
      ctx.quadraticCurveTo(20, -5, 0, 10 + breathY);
      ctx.quadraticCurveTo(-25, -2, -60, 25 + breathY);
      ctx.fill();

      // Soft side locks
      ctx.beginPath();
      ctx.moveTo(-58, 20 + breathY);
      ctx.quadraticCurveTo(-66, 70, -54, 110);
      ctx.quadraticCurveTo(-46, 70, -48, 30);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(58, 20 + breathY);
      ctx.quadraticCurveTo(66, 70, 54, 110);
      ctx.quadraticCurveTo(46, 70, 48, 30);
      ctx.fill();

      // 6. Eyes (Big Expressive Cartoon Eyes)
      if (isBlinking) {
        // Blinking lines
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-36, 42 + breathY);
        ctx.quadraticCurveTo(-24, 48 + breathY, -12, 42 + breathY);
        ctx.moveTo(12, 42 + breathY);
        ctx.quadraticCurveTo(24, 48 + breathY, 36, 42 + breathY);
        ctx.stroke();
      } else {
        // Left Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(-24, 40 + breathY, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(-23, 40 + breathY, 10, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8'; // Iris highlight
        ctx.beginPath();
        ctx.arc(-24, 43 + breathY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye sparkle reflections
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-26, 35 + breathY, 3.5, 0, Math.PI * 2);
        ctx.arc(-20, 44 + breathY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Right Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(24, 40 + breathY, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(23, 40 + breathY, 10, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(24, 43 + breathY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(22, 35 + breathY, 3.5, 0, Math.PI * 2);
        ctx.arc(28, 44 + breathY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyelashes & Brows
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-38, 30 + breathY);
        ctx.quadraticCurveTo(-24, 25 + breathY, -10, 31 + breathY);
        ctx.moveTo(10, 31 + breathY);
        ctx.quadraticCurveTo(24, 25 + breathY, 38, 30 + breathY);
        ctx.stroke();
      }

      // Small cute nose
      ctx.fillStyle = '#e2b395';
      ctx.beginPath();
      ctx.arc(0, 56 + breathY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 7. Expressive Lip-Sync Mouth
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      if (mouthOpen > 2) {
        ctx.ellipse(0, 72 + breathY, 9, Math.max(3, mouthOpen), 0, 0, Math.PI * 2);
        ctx.fill();
        // Teeth highlight
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-6, 68 + breathY, 12, 3.5);
      } else {
        ctx.arc(0, 70 + breathY, 8, 0.15, Math.PI - 0.15);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#be123c';
        ctx.stroke();
      }

      // 8. Animated Hand Gestures by Action
      if (action === 'wave') {
        // Cheerful Waving Hand
        var waveAngle = Math.sin(f * 0.22) * 0.35;
        ctx.save();
        ctx.translate(68, 120 + breathY);
        ctx.rotate(waveAngle);

        // Arm
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, -45);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#fce7d2';
        ctx.beginPath();
        ctx.arc(28, -50, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (action === 'peace-sign') {
        // Two-Finger Peace Sign
        ctx.save();
        ctx.translate(65, 120 + breathY);
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(22, -35);
        ctx.stroke();

        ctx.fillStyle = '#fce7d2';
        ctx.beginPath();
        ctx.arc(24, -40, 11, 0, Math.PI * 2);
        ctx.fill();

        // Peace fingers
        ctx.strokeStyle = '#fce7d2';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(21, -45);
        ctx.lineTo(16, -62);
        ctx.moveTo(27, -45);
        ctx.lineTo(32, -62);
        ctx.stroke();
        ctx.restore();
      } else if (action === 'coding') {
        // Holding glowing tablet / laptop
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-45, 160 + breathY, 90, 52, 6);
        ctx.fill();
        ctx.stroke();

        // Code screen glowing text
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText('const ai = true;', -36, 182 + breathY);
        ctx.fillText('buildFuture();', -36, 198 + breathY);
      } else if (action === 'present-trophy') {
        // Golden Trophy floating above hand
        var trophyY = Math.sin(f * 0.12) * 5;
        ctx.save();
        ctx.translate(75, 75 + trophyY + breathY);

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(-16, -18, 32, 28, 6);
        ctx.fill();

        ctx.fillRect(-6, 10, 12, 14);
        ctx.fillRect(-18, 24, 36, 6);

        // Star on trophy
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Space Grotesk';
        ctx.fillText('★', -5, 2);
        ctx.restore();
      }

      ctx.restore();
    },

    renderFrame: function () {
      if (!this.ctx || !this.canvas) return;
      var ctx = this.ctx;
      var w = this.canvas.width;
      var h = this.canvas.height;
      var f = this.currentFrame;

      // Update progress bar
      var pct = (f / this.totalFrames) * 100;
      var progressElem = document.getElementById('showreel-progress');
      if (progressElem) progressElem.style.width = pct + '%';

      var totalSec = Math.floor(f / 30);
      var secStr = (totalSec % 60 < 10 ? '0' : '') + (totalSec % 60);
      var timeElem = document.getElementById('showreel-time');
      if (timeElem) timeElem.textContent = '00:' + secStr + ' / 00:24';

      var sceneData = this.getCurrentScene();
      var scene = sceneData.scene;
      var sIdx = sceneData.index;

      // Trigger Web Speech Voice Audio on scene entry
      if (sIdx !== this.lastSceneSpoken && this.isPlaying) {
        this.lastSceneSpoken = sIdx;
        this.speakScene(sIdx);
      }

      // Background gradient (warm cozy studio aesthetic)
      var bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#061325');
      bgGrad.addColorStop(0.6, '#082038');
      bgGrad.addColorStop(1, '#030c18');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ambient geometric grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (var x = 0; x < w; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Floating ambient sparkles
      for (var sp = 0; sp < 12; sp++) {
        var sx = (sp * 85 + f * 1.2) % w;
        var sy = 70 + Math.sin((f + sp * 35) * 0.05) * 40;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.beginPath();
        ctx.arc(sx, sy, (sp % 3) + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Cartoon Urmi Character (Left side)
      this.drawCartoonUrmi(ctx, 220, 240, f, scene.action);

      // Speech Bubble / Dialogue Card (Right side)
      var bubbleX = 400;
      var bubbleY = 65;
      var bubbleW = 510;
      var bubbleH = 390;

      // Card Shadow & Glow
      ctx.fillStyle = 'rgba(3, 16, 30, 0.88)';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 18);
      ctx.fill();
      ctx.stroke();

      // Speech bubble pointer arrow pointing to Cartoon Urmi
      ctx.fillStyle = 'rgba(3, 16, 30, 0.88)';
      ctx.beginPath();
      ctx.moveTo(bubbleX, 220);
      ctx.lineTo(bubbleX - 22, 240);
      ctx.lineTo(bubbleX, 260);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.beginPath();
      ctx.moveTo(bubbleX, 220);
      ctx.lineTo(bubbleX - 22, 240);
      ctx.lineTo(bubbleX, 260);
      ctx.stroke();

      // Dialogue Header Pill
      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bubbleX + 28, bubbleY + 28, 220, 28, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 12px Space Grotesk, sans-serif';
      ctx.fillText('💬 TELL ME ABOUT YOURSELF', bubbleX + 42, bubbleY + 47);

      // Scene Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 26px Space Grotesk, sans-serif';
      ctx.fillText(scene.title, bubbleX + 28, bubbleY + 95);

      // Subtitle
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 15px Plus Jakarta Sans, sans-serif';
      ctx.fillText(scene.subtitle, bubbleX + 28, bubbleY + 125);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bubbleX + 28, bubbleY + 145);
      ctx.lineTo(bubbleX + bubbleW - 28, bubbleY + 145);
      ctx.stroke();

      // Key Highlights / Bullets
      var bulletStartY = bubbleY + 180;
      for (var b = 0; b < scene.bullets.length; b++) {
        var by = bulletStartY + b * 55;

        // Card backing for bullet
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bubbleX + 28, by - 18, bubbleW - 56, 44, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f0fdfa';
        ctx.font = '500 14px Plus Jakarta Sans, sans-serif';
        ctx.fillText(scene.bullets[b], bubbleX + 44, by + 9);
      }

      // Call to action button at bottom of Scene 4
      if (scene.id === 'cta') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bubbleX + 28, bubbleY + bubbleH - 58, bubbleW - 56, 38, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.fillText('✉️ EMAIL: urmiurmasnigdha@gmail.com', bubbleX + 75, bubbleY + bubbleH - 34);
      }
    }
  };

  window.PORTFOLIO_INTRO = cartoonIntroPlayer;

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
