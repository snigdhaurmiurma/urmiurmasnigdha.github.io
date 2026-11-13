/**
 * AMBIENT NEURAL BACKGROUND CANVAS
 * Portfolio of Urmi Urma Snigdha - CSE Graduate · UI/UX Designer
 * Clean, lightweight, interactive particle mesh responding to subtle mouse movement
 */

(function () {
  'use strict';

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

  document.addEventListener('DOMContentLoaded', function () {
    initAmbientCanvas();
  });
})();
