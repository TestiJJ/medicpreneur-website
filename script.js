/**
 * MEDICPRENEUR | Official Interactive Script
 * Based on Product Requirements Document (PRD v1.0)
 * Countdown Timer, Filter Systems, Modal Dialogs, Rolling Numbers, Form Validation & Spam Shield
 */

function initApp() {
  const initializers = [
    ['mobileDrawer', initMobileDrawer],
    ['navigation', initNavigation],
    ['scrollEffects', initScrollEffects],
    ['scrollAnimations', initScrollAnimations],
    ['rollingNumbers', initRollingNumbers],
    ['beninCountdown', initBeninSummitCountdown],
    ['filterSystems', initFilterSystems],
    ['faqAccordion', initFaqAccordion],
    ['statusToggles', initStatusToggles],
    ['applicationTrack', initApplicationTrackSelector],
    ['lightbox', initLightbox],
    ['eventModal', initEventModal],
    ['forms', initForms],
    ['curriculumTabs', initCurriculumTabs]
  ];

  initializers.forEach(([name, fn]) => {
    try {
      fn();
    } catch (err) {
      console.warn('Component init error for ' + name + ':', err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------------------------------
   1. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal-on-scroll, .what-card, .program-card, .course-card, .event-card, .chapter-card, .blog-card, .timeline-content-card'
  );
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   2. Animated Rolling Numbers
   -------------------------------------------------------------------------- */
function initRollingNumbers() {
  const counterElements = document.querySelectorAll('.stat-rolling-number');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.dataset.hasRolled) {
          el.dataset.hasRolled = 'true';
          animateRollingNumber(el);
          observer.unobserve(el);
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  counterElements.forEach(el => counterObserver.observe(el));
}

function animateRollingNumber(el) {
  const targetStr = el.getAttribute('data-target') || '0';
  const target = parseFloat(targetStr);
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  
  if (isNaN(target)) return;

  const duration = 2000;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(target * easeOutProgress);

    el.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    }
  }

  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   3. Scroll Effects (Header Shrink & Progress Bar)
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.querySelector('.navbar-wrapper');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && scrollHeight > 0) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Navigation & Active Page Detection
   -------------------------------------------------------------------------- */
function initNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-item, .drawer-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const targetFile = href.split('#')[0];
    if (targetFile === currentPath || (currentPath === '' && targetFile === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. Mobile Drawer Menu
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  let isClosing = false;

  function openDrawer() {
    if (isClosing) return;
    drawer.classList.remove('closing');
    drawer.classList.add('active');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 120);
    }
  }

  function closeDrawer() {
    if (!drawer.classList.contains('active') || isClosing) return;
    isClosing = true;
    drawer.classList.add('closing');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    setTimeout(() => {
      drawer.classList.remove('active');
      drawer.classList.remove('closing');
      isClosing = false;
    }, 260);
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
      toggleBtn.focus();
    });
  }

  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });

  // Auto close if user resizes beyond tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1180 && drawer.classList.contains('active')) {
      closeDrawer();
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   6. Live Countdown Timer: Benin City Summit (Nov 2026, PRD 6.7)
   -------------------------------------------------------------------------- */
function initBeninSummitCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Target: November 14, 2026, 09:00:00 WAT (West Africa Time = UTC+1)
  const targetDate = new Date('2026-11-14T09:00:00+01:00').getTime();

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minsEl.textContent = minutes.toString().padStart(2, '0');
    secsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   7. Filter Systems (Programs, Chapters, FAQ, Blog)
   -------------------------------------------------------------------------- */
function initFilterSystems() {
  // Programs Hub Filter
  const programFilterBtns = document.querySelectorAll('.program-filter-btn');
  const programCards = document.querySelectorAll('.program-filterable-card');

  if (programFilterBtns.length && programCards.length) {
    programFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        programFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        programCards.forEach(card => {
          const status = card.getAttribute('data-status');
          if (filter === 'all' || status === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Chapters Search & Region Filter
  const chapterSearchInput = document.getElementById('chapter-search');
  const chapterRegionBtns = document.querySelectorAll('.region-filter-btn');
  const chapterCards = document.querySelectorAll('.chapter-card');

  function filterChapters() {
    const query = (chapterSearchInput ? chapterSearchInput.value : '').toLowerCase().trim();
    const activeRegionBtn = document.querySelector('.region-filter-btn.active');
    const region = activeRegionBtn ? activeRegionBtn.getAttribute('data-region') : 'all';

    chapterCards.forEach(card => {
      const country = (card.getAttribute('data-country') || '').toLowerCase();
      const cardRegion = card.getAttribute('data-region') || '';
      const leadName = (card.querySelector('.lead-name')?.textContent || '').toLowerCase();

      const matchesQuery = !query || country.includes(query) || leadName.includes(query);
      const matchesRegion = region === 'all' || cardRegion === region;

      if (matchesQuery && matchesRegion) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (chapterSearchInput) {
    chapterSearchInput.addEventListener('input', filterChapters);
  }

  if (chapterRegionBtns.length) {
    chapterRegionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chapterRegionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterChapters();
      });
    });
  }

  // FAQ Category Filter & Search
  const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
  const faqSearchInput = document.getElementById('faq-search');
  const faqItems = document.querySelectorAll('.faq-item');

  function filterFaqs() {
    const query = (faqSearchInput ? faqSearchInput.value : '').toLowerCase().trim();
    const activeBtn = document.querySelector('.faq-category-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    faqItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      const question = (item.querySelector('.faq-question-btn')?.textContent || '').toLowerCase();
      const answer = (item.querySelector('.faq-answer')?.textContent || '').toLowerCase();

      const matchesCat = category === 'all' || itemCat === category;
      const matchesQuery = !query || question.includes(query) || answer.includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (faqCategoryBtns.length) {
    faqCategoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        faqCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterFaqs();
      });
    });
  }

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', filterFaqs);
  }
}

/* --------------------------------------------------------------------------
   8. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqBtns = document.querySelectorAll('.faq-question-btn');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Optional: close other open items in the same list
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) openItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Application Open/Closed Switcher (PRD 6.4 & 6.5)
   -------------------------------------------------------------------------- */
function initStatusToggles() {
  const fellowshipToggle = document.getElementById('fellowship-status-toggle');
  const fellowshipOpenBox = document.getElementById('fellowship-open-container');
  const fellowshipClosedBox = document.getElementById('fellowship-closed-container');
  const fellowshipBadge = document.getElementById('fellowship-badge');

  if (fellowshipToggle && fellowshipOpenBox && fellowshipClosedBox) {
    fellowshipToggle.addEventListener('change', () => {
      if (fellowshipToggle.checked) {
        fellowshipOpenBox.style.display = 'block';
        fellowshipClosedBox.style.display = 'none';
        if (fellowshipBadge) {
          fellowshipBadge.className = 'status-badge open';
          fellowshipBadge.textContent = 'Applications Open';
        }
      } else {
        fellowshipOpenBox.style.display = 'none';
        fellowshipClosedBox.style.display = 'block';
        if (fellowshipBadge) {
          fellowshipBadge.className = 'status-badge closed';
          fellowshipBadge.textContent = 'Applications Closed';
        }
      }
    });
  }

  const ambassadorToggle = document.getElementById('ambassador-status-toggle');
  const ambassadorOpenBox = document.getElementById('ambassador-open-container');
  const ambassadorClosedBox = document.getElementById('ambassador-closed-container');
  const ambassadorBadge = document.getElementById('ambassador-badge');

  if (ambassadorToggle && ambassadorOpenBox && ambassadorClosedBox) {
    ambassadorToggle.addEventListener('change', () => {
      if (ambassadorToggle.checked) {
        ambassadorOpenBox.style.display = 'block';
        ambassadorClosedBox.style.display = 'none';
        if (ambassadorBadge) {
          ambassadorBadge.className = 'status-badge open';
          ambassadorBadge.textContent = 'Applications Open';
        }
      } else {
        ambassadorOpenBox.style.display = 'none';
        ambassadorClosedBox.style.display = 'block';
        if (ambassadorBadge) {
          ambassadorBadge.className = 'status-badge closed';
          ambassadorBadge.textContent = 'Applications Open Soon';
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. Application Track Selector (apply.html, PRD 6.13)
   -------------------------------------------------------------------------- */
function initApplicationTrackSelector() {
  const trackCards = document.querySelectorAll('.track-select-card');
  const trackSections = document.querySelectorAll('.track-form-section');

  if (!trackCards.length || !trackSections.length) return;

  trackCards.forEach(card => {
    card.addEventListener('click', () => {
      trackCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const targetTrack = card.getAttribute('data-track');
      trackSections.forEach(sec => {
        if (sec.id === targetTrack) {
          sec.style.display = 'block';
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // Check URL hash if specified (e.g. apply.html#fellowship)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchingCard = document.querySelector(`.track-select-card[data-track="${hash}-track"]`);
    if (matchingCard) matchingCard.click();
  }
}

/* --------------------------------------------------------------------------
   11. Lightbox for Flyers & Event Photos (PRD 6.7)
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightboxModal = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');

  if (!lightboxModal || !lightboxImg) return;

  const triggerElements = document.querySelectorAll('[data-lightbox]');
  triggerElements.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox');
      const caption = item.getAttribute('data-caption') || '';
      if (src) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
}

/* --------------------------------------------------------------------------
   12. Event Registration Modal (PRD 7.4)
   -------------------------------------------------------------------------- */
function initEventModal() {
  const modal = document.getElementById('event-register-modal');
  const eventTitleInput = document.getElementById('modal-event-title');
  const closeBtn = document.getElementById('modal-register-close');
  const modalBackdrop = document.getElementById('modal-register-backdrop');

  if (!modal) return;

  const registerButtons = document.querySelectorAll('.open-event-modal-btn');
  registerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event-name') || 'Upcoming Webinar';
      if (eventTitleInput) eventTitleInput.value = eventName;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
}

/* --------------------------------------------------------------------------
   13. Form Submission Handlers with Spam Protection & Toast Feedback
   -------------------------------------------------------------------------- */
function initForms() {
  const forms = document.querySelectorAll('form[data-medic-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check anti-spam honeypot field
      const honeypot = form.querySelector('.honeypot-field input');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected and blocked.');
        return;
      }

      // Check GDPR/Data Consent if present
      const consent = form.querySelector('input[type="checkbox"][name="consent"]');
      if (consent && !consent.checked) {
        showToast('Please agree to the data consent terms to proceed.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        form.reset();

        // Close any open modal
        const activeModal = document.querySelector('.modal-backdrop.active');
        if (activeModal) activeModal.classList.remove('active');
        document.body.style.overflow = '';

        const formType = form.getAttribute('data-medic-form') || 'submission';
        let successMsg = 'Thank you! Your submission has been received.';
        if (formType === 'newsletter') successMsg = 'Welcome to the MedicPreneur community newsletter!';
        if (formType === 'event') successMsg = 'You are registered! A calendar invite has been sent to your email (WAT timezone).';
        if (formType === 'partnership') successMsg = 'Thank you! Our partnerships team will review and reply within 48 hours.';
        if (formType === 'application') successMsg = 'Application received! Check your inbox for confirmation and next steps.';
        if (formType === 'chapter') successMsg = 'Chapter proposal received! We will reach out to schedule an onboarding call.';

        showToast(successMsg, 'success');
      }, 700);
    });
  });
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  if (type === 'error') toast.style.backgroundColor = '#991B1B';

  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* --------------------------------------------------------------------------
   14. Curriculum Timeline Tabs Handler
   -------------------------------------------------------------------------- */
function initCurriculumTabs() {
  const tabBtns = document.querySelectorAll('.curriculum-tab-btn');
  const panes = document.querySelectorAll('.curriculum-pane');
  if (!tabBtns.length || !panes.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}




