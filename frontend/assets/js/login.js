const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      // Salva o ID do usuário logado
      if (data?.id) localStorage.setItem('usuarioId', data.id);

      alert(data?.message || "Login realizado com sucesso!");

      // Redireciona para a página de perfil
      window.location.href = "/profile.html";
    } else {
      alert(data?.erro || "Email ou senha inválidos");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Erro ao tentar se conectar com o servidor.");
  }
});

