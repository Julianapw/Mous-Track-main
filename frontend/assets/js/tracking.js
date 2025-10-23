// Função utilitária para formatar data (aaaa-mm-dd → dd/mm/aaaa)
function formatDate(dateStr) {
  if (!dateStr) return "00/00/0000";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Passos da timeline
const STEPS = [
  { key: "booking", label: "Booking Confirmado", city: "NYC" },
  { key: "loaded", label: "Navio Carregado", city: "NYC" },
  { key: "transit", label: "Em Trânsito", city: "" },
  { key: "delivered", "label": "Entregue", city: "SP" }
];

// Seletores principais
const tlSteps = document.querySelector(".timeline__steps");
const tlDates = document.querySelector(".timeline__dates");

// Caminho para o seu arquivo SVG
const EDIT_ICON_PATH = "assets/img/icons/data.svg"; // <-- Caminho do arquivo

// Monta a timeline (etapas + datas)
function renderStaticSteps() {
  // limpa
  tlSteps.innerHTML = "";
  tlDates.innerHTML = "";

  STEPS.forEach((s, i) => {
    // Cada etapa
    const li = document.createElement("li");
    li.className = "step";
    li.dataset.key = s.key;
    li.innerHTML = `
      <div class="step__dot" aria-hidden="true"></div>
      <div class="step__label">${s.label}</div>
      <div class="step__city">${s.city || "&nbsp;"}</div>
    `;
    tlSteps.appendChild(li);

    // Cada data com ícone editável (MODIFICADO)
    const dateDiv = document.createElement("div");
    dateDiv.className = "date-edit";
    dateDiv.innerHTML = `
      <span class="date-text">00/00/0000</span>
      <button class="edit-btn" title="Editar data" data-index="${i}">
        <img src="${EDIT_ICON_PATH}" alt="Editar Data" class="edit-icon-img"> 
      </button>
    `;
    tlDates.appendChild(dateDiv);
  });

  // Adiciona eventos
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    // Se você usa <img>, o evento pode ser disparado no <img> em vez do <button>.
    // Para garantir que funcione, vamos usar a função closest para encontrar o botão pai.
    btn.addEventListener("click", (e) => {
      // Pega o elemento que foi clicado (pode ser o <img>)
      const clickedElement = e.target;
      // Encontra o <button> pai que tem o atributo data-index
      const button = clickedElement.closest('.edit-btn');
      
      if (button) {
          enableDateEdit(button.dataset.index);
      } else {
          // Caso a pessoa clique exatamente no <button> e não na <img>
          enableDateEdit(clickedElement.dataset.index);
      }
    });
  });
}

// (O restante das funções formatDate, enableDateEdit, saveDateEdit permanecem inalteradas)
function enableDateEdit(index) {
  const container = tlDates.children[index];
  const textSpan = container.querySelector(".date-text");
  const oldText = textSpan.textContent === "00/00/0000" ? "" : textSpan.textContent;

  const input = document.createElement("input");
  input.type = "date";
  input.className = "date-input";
  if (oldText) {
    const [d, m, y] = oldText.split("/");
    input.value = `${y}-${m}-${d}`;
  }

  container.replaceChild(input, textSpan);
  input.focus();

  input.addEventListener("blur", () => saveDateEdit(index, input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
}

function saveDateEdit(index, value) {
  const container = tlDates.children[index];
  const newSpan = document.createElement("span");
  newSpan.className = "date-text";
  newSpan.textContent = value ? formatDate(value) : "00/00/0000";

  const oldInput = container.querySelector(".date-input");
  container.replaceChild(newSpan, oldInput);
}

// Inicializa ao carregar
document.addEventListener("DOMContentLoaded", renderStaticSteps);