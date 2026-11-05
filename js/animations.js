(() => {
  'use strict';
  const elements = document.querySelectorAll('.reveal');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || motion.matches) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 20px 0px' });

  // Adicionada somente depois de construir o observer: falhas preservam o conteúdo.
  document.documentElement.classList.add('motion-ready');
  elements.forEach(element => observer.observe(element));
  motion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    }
  });
})();
