(() => {
  'use strict';
  const items = Array.from(document.querySelectorAll('[data-gallery]'));
  const dialog = document.querySelector('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('#lightbox-image');
  const title = dialog.querySelector('#lightbox-title');
  const description = dialog.querySelector('#lightbox-description');
  const count = dialog.querySelector('#lightbox-count');
  const close = dialog.querySelector('#lightbox-close');
  let current = 0;
  let previousFocus = null;

  function render(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    image.src = item.href;
    image.alt = item.querySelector('img').alt;
    title.textContent = item.dataset.title;
    description.textContent = item.dataset.description;
    count.textContent = `${current + 1} / ${items.length}`;
  }
  items.forEach((item, index) => item.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previousFocus = item;
    render(index);
    dialog.showModal();
    document.body.classList.add('modal-open');
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('#lightbox-prev').addEventListener('click', () => render(current - 1));
  dialog.querySelector('#lightbox-next').addEventListener('click', () => render(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); render(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); render(current + 1); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    previousFocus?.focus();
  });
})();
