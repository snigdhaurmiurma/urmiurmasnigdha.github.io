/**
 * MAIN LOGIC & RENDERING ENGINE (V10 Release)
 * Urmi Urma Snigdha Portfolio
 * Features: Robust Modal Triggers for All Sections, Search on Enter & Typing, No Hash Tags
 */

(function() {
  'use strict';

  var data = window.PORTFOLIO_DATA || {};

  function init() {
    initThemeToggle();
    initTypewriter();
    renderSkills();
    renderFilterPills();
    renderProjects('all');
    renderAchievements();
    renderEducation();
    renderCertificates();
    renderBlogSection();
    renderBeyondDesign();
    initMobileNav();
    initCopyButtons();
    initContactForm();
    initDhakaClock();
    initScrollSpy();
    initVisitorTracker();
    initGlobalModalDelegation();
  }

  // 1. Theme Switcher
  function initThemeToggle() {
    var toggleBtn = document.getElementById('theme-toggle-btn');
    var iconSpan = document.getElementById('theme-icon');
    if (!toggleBtn || !iconSpan) return;

    function updateIcon() {
      var isLight = document.documentElement.classList.contains('light');
      iconSpan.textContent = isLight ? '☀️' : '🌙';
    }

    updateIcon();

    toggleBtn.addEventListener('click', function() {
      var isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateIcon();
    });
  }

  // 2. Dynamic Typewriter Effect
  function initTypewriter() {
    var textElem = document.getElementById('typewriter-text');
    if (!textElem) return;

    var phrases = [
      'UI/UX & Product Designer',
      'AI & Data Science Researcher',
      'Graphic & Visual Identity Designer',
      'Freelancer.com Global Contest Champion'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 90;

    function typeLoop() {
      var currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        textElem.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        textElem.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
  }

  // 3. Render Compact Skills (No Hash Tags)
  function renderSkills() {
    var designContainer = document.getElementById('skills-design');
    var techContainer = document.getElementById('skills-technical');

    if (designContainer && data.skills && data.skills.design) {
      designContainer.innerHTML = data.skills.design.map(function(s) {
        var tagsHtml = s.tags.map(function(t) { return '<span class="project-tool-tag">' + t + '</span>'; }).join('');
        return '<div class="skill-badge-card">' +
          '<div class="skill-top-row"><span class="skill-name">' + s.name + '</span><span class="skill-level-tag">' + s.level + ' (' + s.levelPercent + ')</span></div>' +
          '<div class="skill-meter-track"><div class="skill-meter-fill" style="width:' + s.levelPercent + ';"></div></div>' +
          '<div class="skill-tags-row">' + tagsHtml + '</div></div>';
      }).join('');
    }

    if (techContainer && data.skills && data.skills.technical) {
      techContainer.innerHTML = data.skills.technical.map(function(s) {
        var tagsHtml = s.tags.map(function(t) { return '<span class="project-tool-tag">' + t + '</span>'; }).join('');
        return '<div class="skill-badge-card">' +
          '<div class="skill-top-row"><span class="skill-name">' + s.name + '</span><span class="skill-level-tag">' + s.level + ' (' + s.levelPercent + ')</span></div>' +
          '<div class="skill-meter-track"><div class="skill-meter-fill" style="width:' + s.levelPercent + ';background:var(--gradient-brand);"></div></div>' +
          '<div class="skill-tags-row">' + tagsHtml + '</div></div>';
      }).join('');
    }
  }

  // 4. Render Education with Detail Click Trigger
  function renderEducation() {
    var container = document.getElementById('education-grid');
    if (!container || !data.education) return;

    container.innerHTML = data.education.map(function(ed) {
      return '<div class="education-card" data-edu-id="' + ed.id + '" style="cursor:pointer;" title="Click to view detailed academic highlights">' +
        '<div class="edu-main-info">' +
          '<h3 class="edu-degree">' + ed.degree + '</h3>' +
          '<div class="edu-institution">' + ed.institution + ' · <span style="font-size:0.9rem;color:var(--text-muted);">' + ed.location + '</span></div>' +
          '<p class="edu-details">' + ed.details + '</p>' +
          '<div style="font-size:0.8rem;font-weight:600;color:var(--accent-cyan);margin-top:0.75rem;">View Full Academic Details &#8594;</div>' +
        '</div>' +
        '<div class="edu-meta-col">' +
          '<div class="edu-period-badge">' + ed.period + '</div>' +
          '<div class="edu-result-badge">' + ed.result + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 5. Render Projects & Research
  function renderFilterPills() {
    var container = document.getElementById('projects-filters');
    if (!container || !data.categories) return;

    container.innerHTML = data.categories.map(function(c, i) {
      var activeClass = i === 0 ? ' active' : '';
      return '<button class="filter-btn' + activeClass + '" data-filter="' + c.id + '">' + c.name + '</button>';
    }).join('');

    container.addEventListener('click', function(e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      var buttons = container.querySelectorAll('.filter-btn');
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  }

  function renderProjects(filterCategory) {
    var container = document.getElementById('projects-grid');
    if (!container || !data.projects) return;

    var filtered = (filterCategory === 'all' || !filterCategory) ?
      data.projects :
      data.projects.filter(function(p) { return p.category === filterCategory; });

    container.innerHTML = filtered.map(function(p) {
      var toolsHtml = p.tools.map(function(t) {
        return '<span class="project-tool-tag">' + t + '</span>';
      }).join('');

      return '<div class="project-card" data-project-id="' + p.id + '">' +
        '<div class="project-card-top">' +
          '<span class="project-cat-badge">' + p.categoryLabel + '</span>' +
          '<span style="font-size:0.8rem;font-weight:700;color:var(--accent-cyan);">Case Study &#8599;</span>' +
        '</div>' +
        '<h3 class="project-title">' + p.title + '</h3>' +
        '<p class="project-desc">' + p.summary + '</p>' +
        '<div class="project-tools-row">' + toolsHtml + '</div>' +
        '<div class="project-card-footer">' +
          '<span>View Interactive Breakdown &#8594;</span>' +
          '<span style="font-size:0.75rem;color:var(--text-dim);">Live Project</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 6. Render Achievements
  function renderAchievements() {
    var container = document.getElementById('achievements-grid');
    if (!container || !data.achievements) return;

    container.innerHTML = data.achievements.map(function(a) {
      return '<div class="achievement-card" data-ach-id="' + a.id + '">' +
        '<div style="width:100%;aspect-ratio:16/11;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:1.25rem;background:#000;">' +
          '<img src="' + a.image + '" alt="' + a.title + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />' +
        '</div>' +
        '<span style="display:inline-flex;padding:0.3rem 0.75rem;border-radius:var(--radius-full);font-size:0.72rem;font-weight:700;background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);margin-bottom:0.75rem;align-self:flex-start;">' + a.badge + '</span>' +
        '<h3 style="font-size:1.15rem;font-weight:700;color:var(--text-highlight);margin-bottom:0.4rem;">' + a.title + '</h3>' +
        '<div style="font-size:0.8rem;color:var(--accent-cyan);font-weight:600;margin-bottom:0.75rem;">' + a.event + ' (' + a.date + ')</div>' +
        '<p style="font-size:0.88rem;color:var(--text-muted);line-height:1.6;">' + a.description + '</p>' +
        '<div style="margin-top:auto;padding-top:1rem;font-size:0.8rem;color:#f59e0b;font-weight:600;">Click to view verification details &#8599;</div>' +
      '</div>';
    }).join('');
  }

  // 7. Render Certifications
  function renderCertificates() {
    var container = document.getElementById('certs-grid');
    if (!container || !data.certifications) return;

    container.innerHTML = data.certifications.map(function(c) {
      return '<div class="cert-card" data-cert-id="' + c.id + '">' +
        '<span style="display:inline-flex;padding:0.25rem 0.65rem;border-radius:var(--radius-full);font-size:0.7rem;font-weight:700;background:rgba(6,182,212,0.15);color:#38bdf8;border:1px solid rgba(6,182,212,0.3);margin-bottom:0.75rem;align-self:flex-start;">' + c.badge + '</span>' +
        '<h3 style="font-size:1.05rem;font-weight:700;color:var(--text-highlight);margin-bottom:0.35rem;">' + c.title + '</h3>' +
        '<div style="font-size:0.82rem;color:var(--accent-cyan);font-weight:600;margin-bottom:0.75rem;">' + c.issuer + ' · ' + c.issueDate + '</div>' +
        '<p style="font-size:0.84rem;color:var(--text-muted);line-height:1.55;margin-bottom:1rem;flex:1;">' + c.description + '</p>' +
        '<div style="font-size:0.8rem;font-weight:600;color:var(--accent-cyan);padding-top:0.75rem;border-top:1px solid var(--border-subtle);"><span>View Certificate &amp; Proof</span> &#8599;</div>' +
      '</div>';
    }).join('');
  }

  // 8. Workable Search Engine
  var activeBlogTag = 'All';
  var blogSearchQuery = '';

  function renderBlogSection() {
    var tagsBar = document.getElementById('blog-tags-bar');
    var featuredWrap = document.getElementById('blog-featured-wrap');
    var searchInput = document.getElementById('blog-search-input');
    var searchBtn = document.getElementById('blog-search-btn');
    var clearBtn = document.getElementById('search-clear-btn');

    var blogInfo = data.blogSectionInfo || {};
    var featured = data.featuredBlog;

    function executeSearch() {
      if (!searchInput) return;
      blogSearchQuery = searchInput.value.trim().toLowerCase();
      updateSearchStatusBar();
      applyBlogFilter();
    }

    if (searchInput) {
      searchInput.oninput = executeSearch;
      searchInput.onkeyup = function(e) {
        if (e.key === 'Enter') executeSearch();
      };
    }

    if (searchBtn) {
      searchBtn.onclick = executeSearch;
    }

    if (clearBtn) {
      clearBtn.onclick = function() {
        if (searchInput) searchInput.value = '';
        blogSearchQuery = '';
        updateSearchStatusBar();
        applyBlogFilter();
      };
    }

    // Render Filter Tags Bar (NO HASHTAGS)
    if (tagsBar && blogInfo.filterTags) {
      tagsBar.innerHTML = blogInfo.filterTags.map(function(t) {
        var cleanTag = t.replace(/^#/, '');
        var activeClass = (cleanTag === activeBlogTag) ? ' active' : '';
        return '<button class="filter-btn' + activeClass + '" data-blog-filter="' + cleanTag + '">' + cleanTag + '</button>';
      }).join('');

      tagsBar.onclick = function(e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        var buttons = tagsBar.querySelectorAll('.filter-btn');
        buttons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeBlogTag = btn.getAttribute('data-blog-filter');
        applyBlogFilter();
      };
    }

    // Render Featured Article Card
    if (featuredWrap && featured) {
      var featTags = (featured.tags || []).map(function(t) {
        var clean = t.replace(/^#/, '');
        return '<span class="project-tool-tag">' + clean + '</span>';
      }).join('');

      featuredWrap.innerHTML = '<div class="blog-featured-card" data-blog-id="' + featured.id + '">' +
        '<div class="blog-featured-meta">' +
          '<span class="blog-featured-pill">' + featured.badge + '</span>' +
          '<span style="font-size:0.85rem;font-family:var(--font-mono);color:var(--text-muted);">' + featured.date + ' • ' + featured.readTime + '</span>' +
        '</div>' +
        '<h3 style="font-size:1.65rem;font-weight:700;color:var(--text-highlight);margin-bottom:0.75rem;line-height:1.35;">' + featured.title + '</h3>' +
        '<p style="font-size:0.95rem;color:var(--text-muted);line-height:1.7;margin-bottom:1.5rem;">' + featured.summary + '</p>' +
        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem;">' + featTags + '</div>' +
        '<div style="font-size:0.9rem;font-weight:700;color:var(--accent-cyan);">Read Full Article &#8594;</div>' +
      '</div>';
    }

    applyBlogFilter();
  }

  function updateSearchStatusBar() {
    var statusBar = document.getElementById('search-status-bar');
    var statusText = document.getElementById('search-status-text');
    if (!statusBar || !statusText) return;

    if (blogSearchQuery) {
      statusBar.classList.add('show');
      statusText.textContent = 'Showing results matching: "' + blogSearchQuery + '"';
    } else {
      statusBar.classList.remove('show');
    }
  }

  function applyBlogFilter() {
    var gridContainer = document.getElementById('blog-grid');
    var featuredWrap = document.getElementById('blog-featured-wrap');
    if (!gridContainer || !data.blogs) return;

    var filtered = data.blogs.filter(function(b) {
      var matchesTag = (activeBlogTag === 'All') ||
        (b.tags && b.tags.some(function(t) { return t.toLowerCase().includes(activeBlogTag.toLowerCase()); })) ||
        (b.category && b.category.toLowerCase().includes(activeBlogTag.toLowerCase()));

      var matchesSearch = !blogSearchQuery ||
        b.title.toLowerCase().includes(blogSearchQuery) ||
        b.summary.toLowerCase().includes(blogSearchQuery) ||
        (b.tags && b.tags.some(function(t) { return t.toLowerCase().includes(blogSearchQuery); }));

      return matchesTag && matchesSearch;
    });

    if (featuredWrap) {
      if (blogSearchQuery && !data.featuredBlog.title.toLowerCase().includes(blogSearchQuery) && !data.featuredBlog.summary.toLowerCase().includes(blogSearchQuery)) {
        featuredWrap.style.display = 'none';
      } else {
        featuredWrap.style.display = 'block';
      }
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3.5rem 1.5rem;background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--radius-xl);">' +
        '<div style="font-size:1.75rem;margin-bottom:0.75rem;">🔍</div>' +
        '<h4 style="font-size:1.2rem;color:var(--text-highlight);margin-bottom:0.5rem;">No matching articles found</h4>' +
        '<p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:1.5rem;">Try searching for "Transformers", "RAG", "YOLO", or "Microservices"</p>' +
        '<button class="btn btn-gradient btn-small" onclick="document.getElementById(\'blog-search-input\').value=\'\';document.getElementById(\'blog-search-input\').dispatchEvent(new Event(\'input\'));">Reset Search</button>' +
        '</div>';
      return;
    }

    gridContainer.innerHTML = filtered.map(function(b) {
      var tagsHtml = (b.tags || []).map(function(t) {
        var clean = t.replace(/^#/, '');
        return '<span class="project-tool-tag">' + clean + '</span>';
      }).join('');

      return '<div class="blog-item-card" data-blog-id="' + b.id + '">' +
        '<div class="blog-item-meta">' + b.date + ' • ' + b.readTime + '</div>' +
        '<h4 class="blog-item-title">' + b.title + '</h4>' +
        '<p class="blog-item-desc">' + b.summary + '</p>' +
        '<div class="blog-item-tags">' + tagsHtml + '</div>' +
        '<div style="font-size:0.85rem;font-weight:600;color:var(--accent-cyan);margin-top:auto;">Read Post &#8594;</div>' +
      '</div>';
    }).join('');
  }

  // 9. Render Beyond Design
  function renderBeyondDesign() {
    var container = document.getElementById('beyond-grid');
    if (!container || !data.beyondDesign) return;

    container.innerHTML = data.beyondDesign.map(function(b) {
      return '<div class="beyond-card" data-beyond-id="' + b.id + '">' +
        '<div style="font-size:0.72rem;font-weight:700;color:var(--accent-cyan);text-transform:uppercase;margin-bottom:0.5rem;letter-spacing:0.05em;">' + b.category + '</div>' +
        '<h4 style="font-size:1.2rem;font-weight:700;color:var(--text-highlight);margin-bottom:0.65rem;">' + b.title + '</h4>' +
        '<p style="font-size:0.9rem;color:var(--text-muted);line-height:1.65;margin-bottom:1.25rem;flex:1;">' + b.description + '</p>' +
        '<div style="font-size:0.8rem;font-weight:600;color:var(--accent-cyan);padding-top:0.75rem;border-top:1px solid var(--border-subtle);">Explore Discipline &#8594;</div>' +
      '</div>';
    }).join('');
  }

  // 10. Universal Global Event Delegation (Guaranteeing every modal ALWAYS opens)
  function initGlobalModalDelegation() {
    document.addEventListener('click', function(e) {
      // 1. Projects
      var projectCard = e.target.closest('[data-project-id]');
      if (projectCard) {
        var pId = projectCard.getAttribute('data-project-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showCaseStudy) {
          window.PORTFOLIO_LIGHTBOX.showCaseStudy(pId);
        }
        return;
      }

      // 2. Achievements
      var achCard = e.target.closest('[data-ach-id]');
      if (achCard) {
        var aId = achCard.getAttribute('data-ach-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showAchievement) {
          window.PORTFOLIO_LIGHTBOX.showAchievement(aId);
        }
        return;
      }

      // 3. Certifications
      var certCard = e.target.closest('[data-cert-id]');
      if (certCard) {
        var cId = certCard.getAttribute('data-cert-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showCertificate) {
          window.PORTFOLIO_LIGHTBOX.showCertificate(cId);
        }
        return;
      }

      // 4. Blogs
      var blogCard = e.target.closest('[data-blog-id]');
      if (blogCard) {
        var bId = blogCard.getAttribute('data-blog-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showBlog) {
          window.PORTFOLIO_LIGHTBOX.showBlog(bId);
        }
        return;
      }

      // 5. Education
      var eduCard = e.target.closest('[data-edu-id]');
      if (eduCard) {
        var eId = eduCard.getAttribute('data-edu-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showEducation) {
          window.PORTFOLIO_LIGHTBOX.showEducation(eId);
        }
        return;
      }

      // 6. Beyond Design
      var beyondCard = e.target.closest('[data-beyond-id]');
      if (beyondCard) {
        var byId = beyondCard.getAttribute('data-beyond-id');
        if (window.PORTFOLIO_LIGHTBOX && window.PORTFOLIO_LIGHTBOX.showBeyond) {
          window.PORTFOLIO_LIGHTBOX.showBeyond(byId);
        }
        return;
      }
    });
  }

  // 11. Mobile Navigation
  function initMobileNav() {
    var toggleBtn = document.getElementById('mobile-nav-btn');
    var menu = document.getElementById('mobile-nav-menu');
    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove('show');
      }
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('show');
      });
    });
  }

  // 12. Copy Email
  function initCopyButtons() {
    var email = (data.profile && data.profile.email) || 'urmiurmasnigdha@gmail.com';
    var toast = document.getElementById('toast-msg');

    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg || 'Email copied to clipboard! ✨';
      toast.classList.add('show');
      setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }

    var heroCopyBtn = document.getElementById('hero-copy-email-btn');
    var contactCopyBtn = document.getElementById('copy-email-btn');

    [heroCopyBtn, contactCopyBtn].forEach(function(btn) {
      if (!btn) return;
      btn.addEventListener('click', function() {
        navigator.clipboard.writeText(email).then(function() {
          showToast('Copied: ' + email + ' ✨');
        }).catch(function() {
          showToast('Email: ' + email);
        });
      });
    });
  }

  
  
  // 13. Contact Form AJAX Delivery directly to urmiurmasnigdha@gmail.com
  function initContactForm() {
    var form = document.getElementById('portfolio-contact-form');
    var toast = document.getElementById('toast-msg');
    var submitBtn = document.getElementById('contact-submit-btn');
    var nameInput = document.getElementById('form-name');
    var formCard = document.querySelector('.contact-form-card');

    // Auto-focus and highlight form when "Let's Talk" is clicked
    document.querySelectorAll('a[href="#contact"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var contactSec = document.getElementById('contact');
        if (contactSec) {
          setTimeout(function() {
            if (nameInput) nameInput.focus();
            if (formCard) {
              formCard.classList.add('highlight-focus');
              setTimeout(function() {
                formCard.classList.remove('highlight-focus');
              }, 2000);
            }
          }, 450);
        }
      });
    });

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = document.getElementById('form-name').value;
      var email = document.getElementById('form-email').value;
      var subject = document.getElementById('form-subject').value;
      var message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.innerHTML = '<span>⏳ Sending to Urmi (urmiurmasnigdha@gmail.com)...</span>';
        submitBtn.disabled = true;
      }

      // Send directly to urmiurmasnigdha@gmail.com via FormSubmit AJAX API
      fetch('https://formsubmit.co/ajax/urmiurmasnigdha@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Subject: subject,
          Message: message,
          _subject: '🚀 New Project Inquiry from ' + name + ' (' + subject + ')'
        })
      })
      .then(function(response) { return response.json(); })
      .then(function(resData) {
        if (toast) {
          toast.textContent = '🎉 Thank you ' + name + '! Your message was delivered directly to urmiurmasnigdha@gmail.com. ✨';
          toast.classList.add('show');
          setTimeout(function() { toast.classList.remove('show'); }, 6000);
        }
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>✅ Message Sent to Urmi!</span>';
          setTimeout(function() {
            submitBtn.innerHTML = '<span>🚀 Send Message Directly</span> &#8594;';
            submitBtn.disabled = false;
          }, 3500);
        }
      })
      .catch(function(error) {
        console.warn('FormSubmit AJAX fallback, submitting natively:', error);
        form.submit();
      });
    });
  }



  // 14. Live Dhaka Clock
  function initDhakaClock() {
    var clockElem = document.getElementById('dhaka-clock');
    if (!clockElem) return;

    function update() {
      var now = new Date();
      var dhakaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
      var hours = String(dhakaTime.getHours()).padStart(2, '0');
      var mins = String(dhakaTime.getMinutes()).padStart(2, '0');
      var secs = String(dhakaTime.getSeconds()).padStart(2, '0');
      clockElem.textContent = hours + ':' + mins + ':' + secs + ' (GMT+6)';
    }

    update();
    setInterval(update, 1000);
  }

  // 15. Active Scroll Spy
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-item-link');

    window.addEventListener('scroll', function() {
      var scrollY = window.pageYOffset + 120;
      sections.forEach(function(sec) {
        var top = sec.offsetTop;
        var height = sec.offsetHeight;
        var id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


  // 16. Visitor Telemetry & Email Notification Engine
  function initVisitorTracker() {
    // Only send 1 alert per unique browsing session to avoid inbox clutter
    if (sessionStorage.getItem('urmi_visit_logged')) {
      return;
    }

    var referrer = document.referrer || 'Direct Visit (Typed URL or Bookmark)';
    if (referrer.includes('linkedin.com')) referrer = '💼 LinkedIn Profile / Post';
    else if (referrer.includes('behance.net')) referrer = '🎨 Behance Portfolio';
    else if (referrer.includes('github.com')) referrer = '🐙 GitHub Profile / Repo';
    else if (referrer.includes('facebook.com')) referrer = '👥 Facebook';
    else if (referrer.includes('google.com')) referrer = '🔍 Google Search';

    var deviceType = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? '📱 Mobile Device' : '💻 Desktop / Laptop';
    var pageTitle = document.title;
    var currentUrl = window.location.href;
    var screenRes = window.screen.width + 'x' + window.screen.height;

    // Fetch approximate location using free IP geolocation API
    fetch('https://ipapi.co/json/')
      .then(function(res) { return res.json(); })
      .then(function(loc) {
        var city = loc.city || 'Unknown City';
        var country = loc.country_name || 'Unknown Country';
        var org = loc.org || loc.asn || 'Internet Provider';

        sendVisitorAlert({
          Location: city + ', ' + country,
          IP_ISP: org,
          Referrer_Source: referrer,
          Device: deviceType + ' (' + navigator.platform + ')',
          Screen_Resolution: screenRes,
          Page_Visited: currentUrl,
          Timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' (Dhaka Time)'
        }, city + ', ' + country, referrer);
      })
      .catch(function() {
        // Fallback if IP API blocked
        sendVisitorAlert({
          Location: 'Location Private / VPN',
          Referrer_Source: referrer,
          Device: deviceType + ' (' + navigator.platform + ')',
          Screen_Resolution: screenRes,
          Page_Visited: currentUrl,
          Timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' (Dhaka Time)'
        }, 'Global Visitor', referrer);
      });

    function sendVisitorAlert(details, locationStr, sourceStr) {
      sessionStorage.setItem('urmi_visit_logged', 'true');

      // Silently dispatch visitor summary to urmiurmasnigdha@gmail.com
      fetch('https://formsubmit.co/ajax/urmiurmasnigdha@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: '👀 New Portfolio Visitor from ' + locationStr + ' via ' + sourceStr,
          _template: 'table',
          _captcha: 'false',
          Visitor_Summary: details
        })
      }).catch(function(e) {
        console.log('Analytics ping complete.');
      });
    }
  }
