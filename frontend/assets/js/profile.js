const form = document.getElementById('perfilForm');
const senha = document.getElementById('senha');
const confirmar = document.getElementById('confirmar');
const telefone = document.getElementById('telefone');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // ID do usuário logado — salvo no login
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  // Validação básica
  if (senha.value !== confirmar.value) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    // Atualiza telefone
    await fetch(`http://localhost:8088/api/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefone: telefone.value })
    });

    // Atualiza senha (caso o campo tenha sido preenchido)
    if (senha.value.trim() !== "") {
      await fetch(`http://localhost:8088/api/usuarios/${usuarioId}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novaSenha: senha.value })
      });
    }

    alert("Informações atualizadas com sucesso!");
    senha.value = "";
    confirmar.value = "";
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar as informações.");
  }
});

document.getElementById('btnAlterarImagem').addEventListener('click', () => {
  alert("Função de alterar imagem ainda não implementada.");
});
