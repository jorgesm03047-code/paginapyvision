/**
 * PyVision Solutions - Interactive Mechanics, Scroll Animations & Theme Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeroAnimations();
  initScrollReveal();
  initMockupTelemetry();
  initDownloadPage();
  initHashCopy();
  initMobileMenu();
  // Only enable 3D tilt on non-touch devices
  if (!('ontouchstart' in window)) {
    init3DTiltEffect();
  }
});

/**
 * 0. THEME TOGGLE (Light/Dark Mode)
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const mobileToggleBtn = document.getElementById('mobileThemeToggle');

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('pyvision-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('pyvision-theme', newTheme);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', toggleTheme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('pyvision-theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  });
}

/**
 * 1. HERO ENTRANCE ANIMATIONS (Staggered Fade-In)
 */
function initHeroAnimations() {
  const staggerItems = document.querySelectorAll('.hero-stagger');
  const mockupItem = document.querySelector('.mockup-fade');

  staggerItems.forEach((item) => {
    item.classList.add('animate');
  });

  if (mockupItem) {
    mockupItem.classList.add('animate');
  }
}

/**
 * 2. SCROLL REVEAL ANIMATIONS (IntersectionObserver for Tech Grid & Banner)
 */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealCards = document.querySelectorAll('.reveal-card, .reveal-slide');
  revealCards.forEach((element) => {
    revealObserver.observe(element);
  });
}

/**
 * 3. INTERACTIVE TELEMETRY MOCKUP & POSE SIMULATION CANVAS
 *    Uses key body landmarks for posture detection demo
 */
function initMockupTelemetry() {
  const canvas = document.getElementById('poseCanvas');
  const fpsElement = document.getElementById('fpsValue');
  const postureStatusElement = document.getElementById('postureStatus');
  const controlBtns = document.querySelectorAll('.control-btn');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let mode = 'posture';
  let angleOffset = 0;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawSkeleton() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    angleOffset += 0.03;
    const sway = Math.sin(angleOffset) * 6;
    const neckY = mode === 'alert' ? 140 + Math.sin(angleOffset * 3) * 12 : 120;

    // Head
    const headX = w / 2 + sway * 0.5;
    const headY = neckY - 45;

    // Neck
    const neckX = w / 2 + sway;

    // Shoulders
    const leftShoulderX = w / 2 - 65 + sway;
    const rightShoulderX = w / 2 + 65 + sway;
    const shoulderY = neckY + 30;

    // Elbows
    const leftElbowX = leftShoulderX - 35;
    const leftElbowY = shoulderY + 65;
    const rightElbowX = rightShoulderX + 35;
    const rightElbowY = shoulderY + 65;

    // Wrists
    const leftWristX = leftElbowX - 15;
    const leftWristY = leftElbowY + 50;
    const rightWristX = rightElbowX + 15;
    const rightWristY = rightElbowY + 50;

    // Spine / Torso
    const spineX = w / 2 + sway * 0.8;
    const spineY = shoulderY + 100;

    // Hip
    const leftHipX = w / 2 - 35 + sway * 0.6;
    const rightHipX = w / 2 + 35 + sway * 0.6;
    const hipY = spineY + 15;

    // Color Theme based on mode
    let strokeColor = '#7B2CBF';
    let jointColor = '#3B82F6';

    if (mode === 'alert') {
      strokeColor = '#EF4444';
      jointColor = '#F59E0B';
    } else if (mode === 'mesh') {
      strokeColor = '#38BDF8';
      jointColor = '#818CF8';
    }

    ctx.shadowBlur = 12;
    ctx.shadowColor = strokeColor;

    // Draw Skeleton Lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    // Head to Neck
    ctx.moveTo(headX, headY);
    ctx.lineTo(neckX, neckY);
    // Neck to Shoulders
    ctx.moveTo(neckX, neckY);
    ctx.lineTo(leftShoulderX, shoulderY);
    ctx.moveTo(neckX, neckY);
    ctx.lineTo(rightShoulderX, shoulderY);
    // Arms
    ctx.moveTo(leftShoulderX, shoulderY);
    ctx.lineTo(leftElbowX, leftElbowY);
    ctx.lineTo(leftWristX, leftWristY);
    ctx.moveTo(rightShoulderX, shoulderY);
    ctx.lineTo(rightElbowX, rightElbowY);
    ctx.lineTo(rightWristX, rightWristY);
    // Spine
    ctx.moveTo(neckX, neckY);
    ctx.lineTo(spineX, spineY);
    // Hips
    ctx.moveTo(spineX, spineY);
    ctx.lineTo(leftHipX, hipY);
    ctx.moveTo(spineX, spineY);
    ctx.lineTo(rightHipX, hipY);
    ctx.stroke();

    // Head circle
    ctx.beginPath();
    ctx.arc(headX, headY, 18, 0, Math.PI * 2);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw Joint Nodes
    const joints = [
      { x: neckX, y: neckY },
      { x: leftShoulderX, y: shoulderY },
      { x: rightShoulderX, y: shoulderY },
      { x: leftElbowX, y: leftElbowY },
      { x: rightElbowX, y: rightElbowY },
      { x: leftWristX, y: leftWristY },
      { x: rightWristX, y: rightWristY },
      { x: spineX, y: spineY },
      { x: leftHipX, y: hipY },
      { x: rightHipX, y: hipY }
    ];

    ctx.shadowBlur = 0;
    joints.forEach((joint) => {
      ctx.beginPath();
      ctx.arc(joint.x, joint.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = jointColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    });

    // Angle indicator for posture mode
    if (mode === 'posture' || mode === 'alert') {
      // Neck-Spine angle arc
      ctx.beginPath();
      ctx.arc(neckX, neckY, 25, Math.PI * 0.3, Math.PI * 0.7);
      ctx.strokeStyle = mode === 'alert' ? 'rgba(239,68,68,0.5)' : 'rgba(123,44,191,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Angle text
      const angleVal = mode === 'alert' ? (15 + Math.sin(angleOffset) * 5).toFixed(0) : (3 + Math.sin(angleOffset) * 2).toFixed(0);
      ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = mode === 'alert' ? '#EF4444' : '#A78BFA';
      ctx.fillText(angleVal + '°', neckX + 28, neckY + 8);
    }

    // If mesh mode, render analysis grid
    if (mode === 'mesh') {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      for (let i = 0; i < w; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 0; j < h; j += 25) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }
    }

    // Simulated FPS Counter
    if (fpsElement && Math.random() < 0.1) {
      fpsElement.innerText = (29.7 + Math.random() * 0.5).toFixed(1) + ' FPS';
    }

    requestAnimationFrame(drawSkeleton);
  }

  drawSkeleton();

  // Control Mode Toggle Handler
  controlBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      controlBtns.forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');
      mode = e.target.dataset.mode;

      if (postureStatusElement) {
        if (mode === 'alert') {
          postureStatusElement.innerText = '⚠ Inclinación detectada';
          postureStatusElement.style.color = '#EF4444';
        } else if (mode === 'mesh') {
          postureStatusElement.innerText = '◎ Análisis Biomecánico';
          postureStatusElement.style.color = '#38BDF8';
        } else {
          postureStatusElement.innerText = '✓ Postura Optimizada';
          postureStatusElement.style.color = '#4ADE80';
        }
      }
    });
  });
}

/**
 * 4. DOWNLOAD PAGE — OS Detection & Card Highlight
 */
function initDownloadPage() {
  const chip = document.getElementById('osDetectChip');
  const cardWindows = document.getElementById('cardWindows');
  const cardMacOS = document.getElementById('cardMacOS');
  const winBadge = document.getElementById('winRecommended');
  const macBadge = document.getElementById('macRecommended');

  if (!chip) return; // Not on download page

  const ua = navigator.userAgent.toLowerCase();
  const isMac = /mac os x|macintosh/.test(ua) && !/iphone|ipad/.test(ua);
  const isWindows = /windows/.test(ua);

  if (isMac) {
    chip.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> Tu sistema: macOS — Descarga recomendada disponible';
    chip.classList.add('detected-macos');
    if (cardMacOS) cardMacOS.classList.add('is-recommended');
    if (macBadge) macBadge.style.display = 'flex';
  } else if (isWindows) {
    chip.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg> Tu sistema: Windows — Descarga recomendada disponible';
    chip.classList.add('detected-windows');
    if (cardWindows) cardWindows.classList.add('is-recommended');
    if (winBadge) winBadge.style.display = 'flex';
  } else {
    chip.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg> Sistema Linux detectado — Versión en desarrollo';
  }
}

/**
 * 5. HASH COPY — Copy SHA-256 to clipboard with toast notification
 */
function initHashCopy() {
  const toast = document.getElementById('dlToast');
  const copyBtns = document.querySelectorAll('.dl-hash-copy');

  if (!copyBtns.length) return;

  let toastTimer;

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const hash = btn.dataset.hash;
      if (!hash) return;

      try {
        await navigator.clipboard.writeText(hash);

        // Visual feedback on button
        const origContent = btn.innerHTML;
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = origContent;
          btn.classList.remove('copied');
        }, 2000);

        // Show toast
        if (toast) {
          clearTimeout(toastTimer);
          toast.classList.add('show');
          toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
        }
      } catch (err) {
        // Fallback for environments without clipboard API
        console.warn('Clipboard API not available:', err);
      }
    });
  });
}

/**
 * 6. ADVANCED 3D TILT EFFECT (Magnetic Hover)
 */
function init3DTiltEffect() {
  const tiltElements = document.querySelectorAll('.tech-card, .ui-feature-box');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -5; // max rotation degrees
      const tiltY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = 'transform 0.1s ease';
      el.style.zIndex = '10';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s var(--ease-out-smooth)';
      el.style.zIndex = '1';
    });
  });
}

/**
 * 7. MOBILE MENU (Slide-in Panel with Overlay)
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileMenuClose');
  const panel = document.getElementById('mobileMenuPanel');
  const overlay = document.getElementById('mobileMenuOverlay');

  if (!toggleBtn || !panel || !overlay) return;

  function openMenu() {
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when a navigation link is clicked
  const navLinks = panel.querySelectorAll('.mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu if window resizes above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && panel.classList.contains('active')) {
      closeMenu();
    }
  });
}
