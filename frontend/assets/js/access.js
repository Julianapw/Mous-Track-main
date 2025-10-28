// ======================
//  SIDEBAR DINÂMICA
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  sidebar.addEventListener("mouseenter", async () => {
    if (!sidebar.classList.contains("expanded")) {
      try {
        const resp = await fetch("menu.html");
        const html = await resp.text();
        sidebar.innerHTML = html;
        sidebar.classList.add("expanded");
      } catch (err) {
        console.error("Erro ao carregar menu.html:", err);
      }
    }
  });

  sidebar.addEventListener("mouseleave", () => {
    sidebar.classList.remove("expanded");
    sidebar.innerHTML = `
      <div class="logo-block">LOGO</div>
      <nav class="menu">
        <a href="profile.html" class="menu-item"><img src="assets/img/icons/usuario.svg" alt=""></a>
        <a href="shipping.html" class="menu-item"><img src="assets/img/icons/caminhao.svg" alt=""></a>
        <a href="forms.html" class="menu-item"><img src="assets/img/icons/documento.svg" alt=""></a>
        <a href="board.html" class="menu-item"><img src="assets/img/icons/tetris.svg" alt=""></a>
        <a href="repository.html" class="menu-item"><img src="assets/img/icons/pasta.svg" alt=""></a>
        <a href="tracking.html" class="menu-item"><img src="assets/img/icons/caixa.svg" alt=""></a>
        <a href="access.html" class="menu-item is-active"><img src="assets/img/icons/cadeado.svg" alt=""></a>
        <a href="chat.html" class="menu-item"><img src="assets/img/icons/comentario.svg" alt=""></a>
        <a href="#" class="menu-exit"><img src="assets/img/icons/sair.svg" alt=""></a>
      </nav>`;
  });
});

// ======================
//  LÓGICA DA PÁGINA DE ACESSO
// ======================

// Seleciona elementos do DOM
const form = document.getElementById('accForm');
const nameEl = document.getElementById('accName');
const emailEl = document.getElementById('accEmail');
const passEl = document.getElementById('accPass');
const cliSel = document.getElementById('accClient');
const feedbackEl = document.getElementById('accFeedback');
const genBtn = document.getElementById('btnGenPass');

// ---- Função de feedback ----
function setFeedback(msg, isError = false) {
  feedbackEl.textContent = msg;
  feedbackEl.style.color = isError ? 'red' : 'green';
}

// ---- GERA SENHA ----
function generatePassword(len = 12) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  const all = upper + lower + numbers + symbols;

  function pick(set) {
    return set[Math.floor(Math.random() * set.length)];
  }

  let pwd = pick(upper) + pick(lower) + pick(numbers) + pick(symbols);
  while (pwd.length < len) pwd += pick(all);

  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

genBtn.addEventListener('click', () => {
  passEl.value = generatePassword(12);
  setFeedback('Senha gerada automaticamente.');
});

// ---- CARREGAR CLIENTES ----
async function carregarClientes() {
  try {
    const resp = await fetch('http://localhost:8080/api/clientes');
    if (!resp.ok) throw new Error('Falha ao obter clientes');
    const clientes = await resp.json();

    cliSel.innerHTML = '<option value="">Selecione</option>';
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nome;
      cliSel.appendChild(opt);
    });
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
    setFeedback('Falha ao carregar clientes.', true);
  }
}

// ---- CHAMAR LOGO AO INICIAR ----
carregarClientes();

// ---- ENVIO DO FORMULÁRIO ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setFeedback('');

  const nome = nameEl.value.trim();
  const email = emailEl.value.trim();
  const senha = passEl.value.trim();
  const clienteId = cliSel.value;

  if (!nome || !email || !senha || !clienteId) {
    setFeedback('Preencha todos os campos.', true);
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setFeedback('Email inválido.', true);
    emailEl.focus();
    return;
  }

  const submitBtn = form.querySelector('.btn.primary');
  submitBtn.disabled = true;
  setFeedback('Enviando…');

  try {
    const response = await fetch('http://localhost:8080/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senhaHash: senha,
        clienteId: Number(clienteId),
        tipoUsuario: 'colaborador'
      })
    });

    if (!response.ok) throw new Error(await response.text());

    setFeedback('Usuário cadastrado com sucesso!');
    form.reset();
    setTimeout(() => setFeedback(''), 4000);

  } catch (err) {
    console.error(err);
    setFeedback('Falha ao cadastrar. Tente novamente.', true);
  } finally {
    submitBtn.disabled = false;
  }
});

// ⚙️ TODO: implementar lógica do campo de processo
// (para definir se o usuário tem acesso a exportação, importação ou ambos)


//FAZER A LOGICA DO CAMPO DE PROCESSO, P SABER SE O USUARIO TEM ACESSO P EXPORTAÇÃO, IMPORTAÇÃO OU AMBOS, MAS SO DA P FAZER DEPOIS QUE A LOGICA DO PROCESSO ESTIVER FEITA