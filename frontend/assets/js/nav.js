// Ativa o item correto da sidebar conforme o data-page do <body>
document.addEventListener('DOMContentLoaded', () => {
  const current = document.body.dataset.page; // ex.: "profile" ou "shipping"
  if (!current) return;

  document.querySelectorAll('.menu .menu-item').forEach(a => {
    const key = a.dataset.key;           // definido no HTML (data-key="profile", etc.)
    const isActive = key === current;
    a.classList.toggle('is-active', isActive);
    if (isActive) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
});
