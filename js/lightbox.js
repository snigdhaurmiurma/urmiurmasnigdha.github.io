/**
 * UNIVERSAL DETAIL MODAL & LIGHTBOX SYSTEM
 * Urmi Urma Snigdha Portfolio
 * Covers: Projects & Research, Achievements, Certifications, Blogs, Education, Beyond Design
 */

(function() {
  'use strict';

  function getOverlay() {
    var overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function openModal(contentHtml) {
    var modal = getOverlay();
    if (!modal) return;

    modal.innerHTML = '<div class="modal-content-card" onclick="event.stopPropagation();">' +
      '<button id="modal-global-close-btn" class="modal-close-btn" aria-label="Close modal">&times;</button>' +
      contentHtml +
      '</div>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    var closeBtn = document.getElementById('modal-global-close-btn');
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }

    modal.onclick = function(e) {
      if (e.target === modal) {
        closeModal();
      }
    };
  }

  function closeModal() {
    var modal = document.getElementById('global-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    modal.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // 1. Show Project & Research Case Study
  function showCaseStudy(projectId) {
    var data = window.PORTFOLIO_DATA || {};
    var project = (data.projects || []).find(function(p) { return p.id === projectId; });
    if (!project) return;

    var images = project.images && project.images.length ? project.images : [project.thumbnail];
    var currentSlide = 0;

    var toolsHtml = (project.tools || []).map(function(t) {
      var clean = t.replace(/^#/, '');
      return '<span class="project-tool-tag" style="font-size:0.82rem;padding:0.35rem 0.75rem;">' + clean + '</span>';
    }).join('');

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<span class="project-cat-badge" style="display:inline-block;margin-bottom:0.75rem;">' + project.categoryLabel + '</span>' +
      '<h2 style="font-size:1.85rem;color:var(--text-highlight);line-height:1.3;margin-bottom:0.5rem;">' + project.title + '</h2>' +
      '<p style="color:var(--text-muted);font-size:1rem;line-height:1.7;">' + project.summary + '</p>' +
      '</div>' +

      '<div style="position:relative;width:100%;aspect-ratio:16/10;border-radius:var(--radius-lg);overflow:hidden;background:#000;margin-bottom:1.75rem;border:1px solid var(--border-glass);">' +
      '<img id="slider-current-img" src="' + images[0] + '" alt="' + project.title + '" style="width:100%;height:100%;object-fit:contain;" />' +
      (images.length > 1 ?
        '<div style="position:absolute;bottom:1rem;right:1rem;display:flex;gap:0.5rem;">' +
        '<button id="prev-slide-btn" class="btn btn-secondary btn-small">&#8592; Prev</button>' +
        '<button id="next-slide-btn" class="btn btn-secondary btn-small">Next &#8594;</button>' +
        '</div>' : '') +
      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.75rem;">' +
      '<div style="background:rgba(255,255,255,0.03);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">' +
      '<h4 style="color:var(--accent-cyan);font-size:0.95rem;margin-bottom:0.4rem;font-weight:700;">🎯 Key Challenge</h4>' +
      '<p style="color:var(--text-muted);font-size:0.88rem;line-height:1.65;">' + (project.challenge || 'Designing an ergonomic, modern, and high-performance digital architecture.') + '</p>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.03);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">' +
      '<h4 style="color:var(--accent-teal);font-size:0.95rem;margin-bottom:0.4rem;font-weight:700;">💡 Engineering &amp; Design Solution</h4>' +
      '<p style="color:var(--text-muted);font-size:0.88rem;line-height:1.65;">' + (project.solution || 'Modular component architecture with high visual fidelity and robust execution.') + '</p>' +
      '</div>' +
      '</div>' +

      (project.impact ?
        '<div style="background:rgba(6,182,212,0.08);border:1px solid var(--border-accent);padding:1rem 1.25rem;border-radius:var(--radius-md);margin-bottom:1.75rem;">' +
        '<strong style="color:var(--accent-cyan);font-size:0.9rem;">Impact &amp; Results:</strong> <span style="color:var(--text-main);font-size:0.9rem;">' + project.impact + '</span>' +
        '</div>' : '') +

      '<div style="margin-bottom:2rem;">' +
      '<h4 style="color:var(--text-highlight);font-size:0.95rem;margin-bottom:0.6rem;">Tools &amp; Technologies Used</h4>' +
      '<div style="display:flex;gap:0.45rem;flex-wrap:wrap;">' + toolsHtml + '</div>' +
      '</div>' +

      '<div style="display:flex;gap:1rem;flex-wrap:wrap;">' +
      (project.behanceUrl ? '<a href="' + project.behanceUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-gradient"><span>Explore on External Link</span> &#8599;</a>' : '') +
      '<button class="btn btn-secondary" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close</button>' +
      '</div>';

    openModal(html);

    if (images.length > 1) {
      var prevBtn = document.getElementById('prev-slide-btn');
      var nextBtn = document.getElementById('next-slide-btn');
      var imgElem = document.getElementById('slider-current-img');

      if (prevBtn && nextBtn && imgElem) {
        prevBtn.onclick = function() {
          currentSlide = (currentSlide - 1 + images.length) % images.length;
          imgElem.src = images[currentSlide];
        };
        nextBtn.onclick = function() {
          currentSlide = (currentSlide + 1) % images.length;
          imgElem.src = images[currentSlide];
        };
      }
    }
  }

  
  // 2. Show Achievement Modal (With Multi-Photo Slider Support)
  function showAchievement(achId) {
    var data = window.PORTFOLIO_DATA || {};
    var ach = (data.achievements || []).find(function(a) { return a.id === achId; });
    if (!ach) return;

    var images = ach.images && ach.images.length ? ach.images : [ach.image];
    var currentSlide = 0;

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<span style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);margin-bottom:0.75rem;display:inline-block;padding:0.35rem 0.85rem;border-radius:var(--radius-full);font-size:0.75rem;font-weight:700;">' + ach.badge + '</span>' +
      '<h2 style="font-size:1.75rem;color:var(--text-highlight);line-height:1.3;margin-bottom:0.35rem;">' + ach.title + '</h2>' +
      '<div style="color:var(--accent-cyan);font-weight:600;font-size:0.95rem;margin-bottom:1.25rem;">' + ach.event + ' (' + ach.date + ')</div>' +
      
      '<div style="position:relative;width:100%;aspect-ratio:16/11;border-radius:var(--radius-lg);overflow:hidden;background:#000;margin-bottom:1.5rem;border:1px solid var(--border-glass);">' +
      '<img id="ach-slider-current-img" src="' + images[0] + '" alt="' + ach.title + '" style="width:100%;height:100%;object-fit:contain;" />' +
      (images.length > 1 ?
        '<div style="position:absolute;bottom:0.75rem;right:0.75rem;display:flex;gap:0.5rem;align-items:center;background:rgba(0,0,0,0.65);padding:0.35rem 0.75rem;border-radius:var(--radius-full);backdrop-filter:blur(8px);">' +
        '<span id="ach-slide-counter" style="font-size:0.75rem;font-family:var(--font-mono);color:#fff;margin-right:0.3rem;">1 / ' + images.length + '</span>' +
        '<button id="ach-prev-slide-btn" class="btn btn-secondary btn-small" style="padding:0.25rem 0.6rem;font-size:0.75rem;">&#8592; Prev</button>' +
        '<button id="ach-next-slide-btn" class="btn btn-secondary btn-small" style="padding:0.25rem 0.6rem;font-size:0.75rem;">Next &#8594;</button>' +
        '</div>' : '') +
      '</div>' +

      '<p style="color:var(--text-muted);font-size:1rem;line-height:1.75;margin-bottom:1.75rem;">' + ach.description + '</p>' +
      
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;">' +
      '<button class="btn btn-secondary" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close</button>' +
      '</div>' +
      '</div>';

    openModal(html);

    if (images.length > 1) {
      var prevBtn = document.getElementById('ach-prev-slide-btn');
      var nextBtn = document.getElementById('ach-next-slide-btn');
      var imgElem = document.getElementById('ach-slider-current-img');
      var counterElem = document.getElementById('ach-slide-counter');

      if (prevBtn && nextBtn && imgElem) {
        prevBtn.onclick = function() {
          currentSlide = (currentSlide - 1 + images.length) % images.length;
          imgElem.src = images[currentSlide];
          if (counterElem) counterElem.textContent = (currentSlide + 1) + ' / ' + images.length;
        };
        nextBtn.onclick = function() {
          currentSlide = (currentSlide + 1) % images.length;
          imgElem.src = images[currentSlide];
          if (counterElem) counterElem.textContent = (currentSlide + 1) + ' / ' + images.length;
        };
      }
    }
  }

  // 3. Show Certificate Modal
  function showCertificate(certId) {
    var data = window.PORTFOLIO_DATA || {};
    var cert = (data.certifications || []).find(function(c) { return c.id === certId; });
    if (!cert) return;

    var skillsHtml = (cert.skills || []).map(function(s) {
      var clean = s.replace(/^#/, '');
      return '<span class="project-tool-tag" style="font-size:0.8rem;padding:0.35rem 0.75rem;">' + clean + '</span>';
    }).join('');

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<span style="background:rgba(6,182,212,0.15);color:var(--accent-cyan);border:1px solid rgba(6,182,212,0.3);display:inline-block;margin-bottom:0.75rem;padding:0.35rem 0.85rem;border-radius:var(--radius-full);font-size:0.75rem;font-weight:700;">' + cert.badge + '</span>' +
      '<h2 style="font-size:1.75rem;color:var(--text-highlight);line-height:1.3;margin-bottom:0.35rem;">' + cert.title + '</h2>' +
      '<div style="color:var(--accent-cyan);font-weight:600;font-size:0.95rem;margin-bottom:1.25rem;">' + cert.issuer + ' · Issued ' + cert.issueDate + '</div>' +

      '<div style="width:100%;aspect-ratio:16/10;border-radius:var(--radius-lg);overflow:hidden;background:#000;margin-bottom:1.5rem;border:1px solid var(--border-glass);">' +
      '<img src="' + cert.image + '" alt="' + cert.title + '" style="width:100%;height:100%;object-fit:contain;" />' +
      '</div>' +

      '<p style="color:var(--text-muted);font-size:0.95rem;line-height:1.7;margin-bottom:1.25rem;">' + cert.description + '</p>' +
      (skillsHtml ? '<div style="margin-bottom:1.75rem;"><h4 style="color:var(--text-highlight);font-size:0.9rem;margin-bottom:0.5rem;font-weight:700;">Validated Competencies</h4><div style="display:flex;gap:0.4rem;flex-wrap:wrap;">' + skillsHtml + '</div></div>' : '') +

      '<div style="display:flex;gap:1rem;flex-wrap:wrap;">' +
      (cert.verifyUrl ? '<a href="' + cert.verifyUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-gradient"><span>Verify Official Credential</span> &#8599;</a>' : '') +
      '<button class="btn btn-secondary" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close</button>' +
      '</div>' +
      '</div>';

    openModal(html);
  }

  // 4. Show Blog Article Reader Modal
  function showBlog(blogId) {
    var data = window.PORTFOLIO_DATA || {};
    var blog = (data.blogs || []).find(function(b) { return b.id === blogId; });
    if (!blog && data.featuredBlog && data.featuredBlog.id === blogId) {
      blog = data.featuredBlog;
    }
    if (!blog) return;

    var tagsHtml = (blog.tags || []).map(function(t) {
      var clean = t.replace(/^#/, '');
      return '<span class="project-tool-tag">' + clean + '</span>';
    }).join('');

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">' +
      '<span class="project-cat-badge">' + (blog.category || 'Engineering Note') + '</span>' +
      '<span style="font-size:0.85rem;color:var(--text-dim);font-family:var(--font-mono);">' + blog.readTime + ' · ' + blog.date + '</span>' +
      '</div>' +
      '<h2 style="font-size:1.85rem;color:var(--text-highlight);line-height:1.35;margin-bottom:1.25rem;">' + blog.title + '</h2>' +
      '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.5rem;">' + tagsHtml + '</div>' +
      '<div style="font-size:1.02rem;color:var(--text-main);line-height:1.85;margin-bottom:2rem;border-left:3px solid var(--accent-cyan);padding-left:1.25rem;">' +
      (blog.content || '<p>' + blog.summary + '</p>') +
      '</div>' +
      '<div style="display:flex;gap:1rem;">' +
      '<a href="blog.html" class="btn btn-secondary btn-small">Open in Full Blog Page &#8599;</a>' +
      '<button class="btn btn-gradient btn-small" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close Article</button>' +
      '</div>' +
      '</div>';

    openModal(html);
  }

  // 5. Show Education Detail Modal
  function showEducation(eduId) {
    var data = window.PORTFOLIO_DATA || {};
    var edu = (data.education || []).find(function(e) { return e.id === eduId; });
    if (!edu) return;

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<span style="background:rgba(16,185,129,0.12);color:#10b981;border:1px solid rgba(16,185,129,0.35);padding:0.35rem 0.85rem;border-radius:var(--radius-full);font-size:0.78rem;font-weight:700;display:inline-block;margin-bottom:0.75rem;">' + edu.result + '</span>' +
      '<h2 style="font-size:1.75rem;color:var(--text-highlight);margin-bottom:0.35rem;">' + edu.degree + '</h2>' +
      '<div style="color:var(--accent-cyan);font-size:1.05rem;font-weight:600;margin-bottom:0.35rem;">' + edu.institution + ' · ' + edu.location + '</div>' +
      '<div style="font-size:0.85rem;font-family:var(--font-mono);color:var(--text-dim);margin-bottom:1.5rem;">Period: ' + edu.period + '</div>' +
      
      '<div style="background:rgba(255,255,255,0.03);padding:1.5rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);margin-bottom:1.75rem;">' +
      '<h4 style="color:var(--text-highlight);font-size:0.95rem;margin-bottom:0.5rem;font-weight:700;">Academic Highlights &amp; Leadership</h4>' +
      '<p style="color:var(--text-muted);font-size:0.92rem;line-height:1.7;">' + edu.details + '</p>' +
      '</div>' +

      '<div style="display:flex;gap:1rem;">' +
      '<a href="cv.html" class="btn btn-gradient btn-small">View Full CV &#8599;</a>' +
      '<button class="btn btn-secondary btn-small" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close</button>' +
      '</div>' +
      '</div>';

    openModal(html);
  }

  // 6. Show Beyond Design Detail Modal
  function showBeyond(beyondId) {
    var data = window.PORTFOLIO_DATA || {};
    var item = (data.beyondDesign || []).find(function(b) { return b.id === beyondId; });
    if (!item) return;

    var html = '<div style="margin-bottom:1.5rem;">' +
      '<div style="color:var(--accent-cyan);font-weight:700;font-size:0.85rem;text-transform:uppercase;margin-bottom:0.5rem;">' + item.category + '</div>' +
      '<h2 style="font-size:1.75rem;color:var(--text-highlight);line-height:1.3;margin-bottom:1rem;">' + item.title + '</h2>' +
      '<p style="color:var(--text-muted);font-size:1rem;line-height:1.75;margin-bottom:1.75rem;">' + item.description + '</p>' +
      '<button class="btn btn-gradient" onclick="window.PORTFOLIO_LIGHTBOX.closeModal()">Close</button>' +
      '</div>';

    openModal(html);
  }

  window.PORTFOLIO_LIGHTBOX = {
    showCaseStudy: showCaseStudy,
    showAchievement: showAchievement,
    showCertificate: showCertificate,
    showBlog: showBlog,
    showEducation: showEducation,
    showBeyond: showBeyond,
    closeModal: closeModal
  };
})();
