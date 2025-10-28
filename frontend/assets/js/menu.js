document.addEventListener("DOMContentLoaded", () => {
  // Mapeamento dos ícones e suas páginas
  const links = {
    "usuario.svg": "profile.html",
    "caminhao.svg": "shipping.html",
    "documento.svg": "forms.html",
    "tetris.svg": "board.html",
    "pasta.svg": "repository.html",
    "caixa.svg": "tracking.html",
    "cadeado.svg": "access.html",
    "sair.svg": "index.html"
  };

  // Seleciona todas as imagens dentro dos itens do menu
  const icons = document.querySelectorAll(".menu-item img");

  icons.forEach(icon => {
    const fileName = icon.src.split("/").pop(); // pega só o nome do arquivo
    const targetPage = links[fileName];

    if (targetPage) {
      icon.addEventListener("click", (e) => {
        e.preventDefault(); // evita comportamento padrão
        window.location.href = targetPage; // redireciona
      });
    }
  });
});
