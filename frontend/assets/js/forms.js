// Exibe nomes/quantidade dos arquivos selecionados e evita submit real por enquanto
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('anexo');
  const fileText = document.getElementById('fileText');
  const form = document.getElementById('procForm');

  if (input) {
    input.addEventListener('change', () => {
      if (!input.files || input.files.length === 0) {
        fileText.textContent = '';
        return;
      }
      if (input.files.length === 1) {
        fileText.textContent = input.files[0].name;
      } else {
        fileText.textContent = `${input.files.length} arquivos selecionados`;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // placeholder — aqui depois integramos com Python/Back-end
      alert('Formulário enviado (simulação).');
    });
  }
});
