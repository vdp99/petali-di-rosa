/* ============================================================
   PETALI DI ROSA — main.js
   Scroll reveal, header, menu, FAQ, cookie banner, form validation
   ============================================================ */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Sticky Header ---- */
  function initStickyHeader() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var hero = document.querySelector('.hero');
    var threshold = hero ? 80 : 10;

    function onScroll() {
      if (window.scrollY > threshold) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        if (hero) {
          nav.classList.add('nav--transparent');
          nav.classList.remove('nav--scrolled');
        }
      }
    }

    if (hero) {
      nav.classList.add('nav--transparent');
    } else {
      nav.classList.add('nav--scrolled');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Menu ---- */
  function initMobileMenu() {
    var hamburger = document.querySelector('.nav__hamburger');
    var mobileMenu = document.querySelector('.nav__mobile');
    var overlay = document.querySelector('.nav__overlay');

    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      if (overlay) {
        overlay.style.display = 'block';
        requestAnimationFrame(function () {
          overlay.classList.add('is-visible');
        });
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      if (overlay) {
        overlay.classList.remove('is-visible');
        setTimeout(function () { overlay.style.display = 'none'; }, 350);
      }
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---- FAQ Accordion ---- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- Smooth Scroll ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
          var top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- Hero BG Loaded ---- */
  function initHeroBg() {
    var bg = document.querySelector('.hero__bg');
    if (!bg) return;
    var bgUrl = getComputedStyle(bg).backgroundImage;
    if (!bgUrl || bgUrl === 'none') {
      bg.classList.add('is-loaded');
      return;
    }
    var url = bgUrl.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    var img = new Image();
    img.onload = function () { bg.classList.add('is-loaded'); };
    img.src = url;
  }

  /* ---- Cookie Banner ---- */
  function initCookieBanner() {
    var STORAGE_KEY = 'pdr_cookie_consent';
    var banner = document.querySelector('.cookie-banner');
    var modal = document.querySelector('.cookie-modal');

    if (!banner) return;

    var consent = null;
    try {
      consent = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {}

    if (!consent) {
      setTimeout(function () {
        banner.classList.add('is-visible');
      }, 800);
    }

    function saveConsent(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
      banner.classList.remove('is-visible');
      if (modal) modal.classList.remove('is-open');
    }

    var btnAccept = document.querySelector('.cookie-btn--accept');
    var btnNecessary = document.querySelector('.cookie-btn--necessary');
    var btnManage = document.querySelector('.cookie-btn--manage');

    if (btnAccept) {
      btnAccept.addEventListener('click', function () {
        saveConsent({ analytics: true, marketing: true, timestamp: Date.now() });
      });
    }

    if (btnNecessary) {
      btnNecessary.addEventListener('click', function () {
        saveConsent({ analytics: false, marketing: false, timestamp: Date.now() });
      });
    }

    if (btnManage && modal) {
      btnManage.addEventListener('click', function () {
        modal.classList.add('is-open');
      });

      var modalOverlay = modal.querySelector('.cookie-modal__overlay');
      if (modalOverlay) {
        modalOverlay.addEventListener('click', function () {
          modal.classList.remove('is-open');
        });
      }

      var btnSave = modal.querySelector('.cookie-btn--save');
      if (btnSave) {
        btnSave.addEventListener('click', function () {
          var analytics = modal.querySelector('#cookie-analytics');
          var marketing = modal.querySelector('#cookie-marketing');
          saveConsent({
            analytics: analytics ? analytics.checked : false,
            marketing: marketing ? marketing.checked : false,
            timestamp: Date.now()
          });
        });
      }

      var btnAcceptAll = modal.querySelector('.cookie-btn--accept-all');
      if (btnAcceptAll) {
        btnAcceptAll.addEventListener('click', function () {
          saveConsent({ analytics: true, marketing: true, timestamp: Date.now() });
        });
      }
    }
  }

  /* ---- Contact Form Validation ---- */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var successMsg = document.querySelector('.form-success');

    function showError(input, message) {
      input.classList.add('is-error');
      var group = input.closest('.form-group');
      if (group) {
        var err = group.querySelector('.form-error');
        if (err) {
          err.textContent = message;
          err.classList.add('is-visible');
        }
      }
    }

    function clearError(input) {
      input.classList.remove('is-error');
      var group = input.closest('.form-group');
      if (group) {
        var err = group.querySelector('.form-error');
        if (err) err.classList.remove('is-visible');
      }
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Clear errors on input
    form.querySelectorAll('.form-input, .form-textarea').forEach(function (field) {
      field.addEventListener('input', function () { clearError(this); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var nome = form.querySelector('#nome');
      var email = form.querySelector('#email');
      var messaggio = form.querySelector('#messaggio');
      var privacy = form.querySelector('#privacy');

      if (nome && !nome.value.trim()) {
        showError(nome, 'Inserisci il tuo nome e cognome.');
        valid = false;
      }

      if (email) {
        if (!email.value.trim()) {
          showError(email, 'Inserisci la tua email.');
          valid = false;
        } else if (!validateEmail(email.value.trim())) {
          showError(email, 'Inserisci un indirizzo email valido.');
          valid = false;
        }
      }

      if (messaggio && !messaggio.value.trim()) {
        showError(messaggio, 'Scrivi un messaggio.');
        valid = false;
      }

      if (privacy && !privacy.checked) {
        var privacyGroup = privacy.closest('.form-group') || privacy.parentElement;
        var err = privacyGroup ? privacyGroup.querySelector('.form-error') : null;
        if (err) {
          err.textContent = 'Devi accettare la Privacy Policy per inviare il modulo.';
          err.classList.add('is-visible');
        }
        valid = false;
      }

      if (valid) {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('is-visible');
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }

  /* ---- Active nav link ---- */
  function initActiveNav() {
    var currentPath = window.location.pathname;
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkPath = href.replace(/\/$/, '');
      var currPath = currentPath.replace(/\/$/, '').replace(/\/index\.html$/, '') || '/';

      if (
        href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath === '') ||
        href !== 'index.html' && currentPath.includes(href.replace('.html', ''))
      ) {
        link.classList.add('nav__link--active', 'nav__mobile-link--active');
      }
    });
  }

  /* ---- Blog Read More animation ---- */
  function initBlogCards() {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.willChange = 'transform';
      });
      card.addEventListener('mouseleave', function () {
        this.style.willChange = 'auto';
      });
    });
  }

  /* ---- Init all ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initHeroBg();
    initFaq();
    initCookieBanner();
    initContactForm();
    initActiveNav();
    initBlogCards();
  });

})();
