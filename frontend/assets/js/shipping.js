// Seleção de elementos
const modalBtn = document.getElementById('modalBtn');
const modalMenu = document.getElementById('modalMenu');
const modalItems = modalMenu.querySelectorAll('li');

const formAereo = document.getElementById('formAereo');
const formMaritmo = document.getElementById('formMaritmo');

// ====================
// Dropdown do botão
// ====================
modalBtn.addEventListener('click', () => {
  modalMenu.hidden = !modalMenu.hidden;
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!modalBtn.contains(e.target) && !modalMenu.contains(e.target)) {
    modalMenu.hidden = true;
  }
});

// ====================
// Alternar formulários
// ====================
modalItems.forEach(item => {
  item.addEventListener('click', () => {
    // Atualiza label do botão
    document.getElementById('modalLabel').textContent = item.textContent;

    // Marca item ativo no menu
    modalItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Fecha dropdown
    modalMenu.hidden = true;

    // Alterna formulários
    formAereo.classList.remove('active');
    formMaritmo.classList.remove('active');

    if(item.dataset.modal === 'aereo') {
      formAereo.classList.add('active');
    } else {
      formMaritmo.classList.add('active');
    }
  });
});

// ====================
// Envio mínimo dos formulários
// ====================
[formAereo, formMaritmo].forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Exemplo de envio futuro:
    // const data = Object.fromEntries(new FormData(form).entries());
    // fetch('/api/shipping', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(r => r.ok ? alert('Documento gerado!') : alert('Erro ao gerar.'));

    alert(`Formulário ${form.id} enviado!`);
  });
});
