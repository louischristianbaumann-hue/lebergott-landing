/**
 * Lebergott — Landing Page Scripts
 * Minimal, dependency-free, accessible JavaScript.
 */

(function () {
  'use strict';

  /* ─── Sticky Nav ─────────────────────────────────────────── */
  const navHeader = document.querySelector('.nav-header');

  function updateNav() {
    if (window.scrollY > 20) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Run once on load


  /* ─── Mobile Menu Toggle ─────────────────────────────────── */
  const navToggle  = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });

    // Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        navToggle.focus();
      }
    });
  }


  /* ─── Smooth Scroll for Nav Links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Account for sticky nav height
      const navHeight = navHeader ? navHeader.offsetHeight : 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', function onBlur() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', onBlur);
      });
    });
  });


  /* ─── Intersection Observer — Scroll Reveal ─────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to save resources
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: make all elements visible immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

}());
