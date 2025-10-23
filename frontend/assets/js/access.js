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

    // Atualiza o select com id e nome
    cliSel.innerHTML = '<option value="">Selecione</option>';
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id; // 👈 agora o value é o ID
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
  const clienteId = cliSel.value; // 👈 pega o ID, não o nome

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
        senhaHash: senha,            // ✅ nome correto conforme backend
        clienteId: Number(clienteId), // ✅ backend espera clienteId
        tipoUsuario: 'colaborador'    // ✅ nome correto
      })
    });

    if (!response.ok) throw new Error(await response.text());

    setFeedback('Usuário cadastrado com sucesso!');
    form.reset();

    // feedback desaparece após alguns segundos
    setTimeout(() => setFeedback(''), 4000);

  } catch (err) {
    console.error(err);
    setFeedback('Falha ao cadastrar. Tente novamente.', true);
  } finally {
    submitBtn.disabled = false;
  }
});

//FAZER A LOGICA DO CAMPO DE PROCESSO, P SABER SE O USUARIO TEM ACESSO P EXPORTAÇÃO, IMPORTAÇÃO OU AMBOS, MAS SO DA P FAZER DEPOIS QUE A LOGICA DO PROCESSO ESTIVER FEITA