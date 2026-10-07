(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ===== Preloader ===== */
  document.body.classList.add('is-loading');
  const finishLoading = () => {
    $('#preloader').classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  };
  window.addEventListener('load', () => setTimeout(finishLoading, 1300));
  setTimeout(finishLoading, 3500); // seguridad

  /* ===== Año ===== */
  $('#year').textContent = new Date().getFullYear();

  /* ===== Reveal al hacer scroll ===== */
  $$('.steps li').forEach((li, i) => li.style.setProperty('--i', i));
  $$('.grid .card, .swatches .swatch, .why__list li').forEach((el, i) =>
    el.style.setProperty('--d', `${(i % 6) * 0.08}s`));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ===== Header: fondo, ocultar al bajar, barra de progreso ===== */
  const header = $('#header');
  const bar = $('#progress');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-stuck', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !$('#nav').classList.contains('is-open'));
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    $$('[data-parallax]').forEach((el) => {
      el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.parallax)}px, 0)`;
    });
    lastY = y; ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ===== Menú móvil ===== */
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleNav = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleNav(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => toggleNav(false)));

  /* ===== Moneda 3D: canto con capas + inclinación con el mouse ===== */
  const coin = $('#coin');
  for (let i = -6; i <= 6; i++) {
    const edge = document.createElement('div');
    edge.className = 'coin__edge';
    edge.style.transform = `translateZ(${i}px)`;
    coin.insertBefore(edge, coin.firstChild);
  }
  const stage = $('#coinStage');
  if (fine && !reduce) {
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`;
    });
    stage.addEventListener('mouseleave', () => { stage.style.transform = ''; });
    stage.style.transition = 'transform .4s ease-out';
    stage.style.transformStyle = 'preserve-3d';
  }

  /* ===== Chispas de fundición ===== */
  const sparks = $('#sparks');
  if (!reduce) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 6 + Math.random() * 8 + 's';
      s.style.animationDelay = -Math.random() * 12 + 's';
      const size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size + 'px';
      sparks.appendChild(s);
    }
  }

  /* ===== Cursor personalizado ===== */
  const cursor = $('#cursor');
  if (fine) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY; cursor.style.opacity = 1;
    });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      const half = cursor.offsetWidth / 2;
      cursor.style.transform = `translate(${cx - half}px, ${cy - half}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a, button, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ===== Botones magnéticos ===== */
  if (fine && !reduce) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ===== Tarjetas: inclinación 3D y brillo que sigue al mouse ===== */
  if (fine && !reduce) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 8).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
})();
