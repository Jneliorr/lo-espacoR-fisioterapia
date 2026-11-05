(() => {
  'use strict';
  const config = window.SPACE_R_CONFIG;
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  const progress = document.querySelector('.scroll-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Menu permanece disponível sem JS por meio do fallback em <noscript>.
  function setMenu(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', open);
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  // Feche o menu quando o foco sai do header, sem aprisionar a navegação por teclado.
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  const mobile = window.matchMedia('(max-width: 767px)');
  mobile.addEventListener('change', () => setMenu(false));

  let scheduled = false;
  function updateScroll() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    header.classList.toggle('scrolled', window.scrollY > 20);
    scheduled = false;
  }
  function requestScrollUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  window.addEventListener('load', requestScrollUpdate, { once: true });
  if ('ResizeObserver' in window) new ResizeObserver(requestScrollUpdate).observe(document.body);
  updateScroll();

  document.querySelector('#year').textContent = new Date().getFullYear();
  if (config) {
    document.querySelectorAll('[data-contact]').forEach(link => {
      const number = config.whatsapp.replace(/\D/g, '');
      const service = link.dataset.service;
      const message = service
        ? `Olá! Conheci a Clínica Espaço R pelo site e gostaria de saber mais sobre ${service} e os horários disponíveis.`
        : config.message;
      link.href = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : config.instagram;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    if (config.tour360) {
      try {
        const url = new URL(config.tour360);
        if (url.protocol === 'https:') {
          document.querySelector('#tour-link').href = url.href;
          document.querySelector('#tour-block').hidden = false;
        }
      } catch { /* Uma URL incompleta não deve interromper a página. */ }
    }
  }

  try {
    if (!sessionStorage.getItem('space-r-welcomed') && !reducedMotion.matches) {
      sessionStorage.setItem('space-r-welcomed', '1');
      document.body.classList.add('show-welcome');
      setTimeout(() => document.body.classList.remove('show-welcome'), 1000);
    }
  } catch { /* Navegação privada ou armazenamento indisponível: sem abertura animada. */ }
})();
