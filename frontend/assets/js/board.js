/* ===== Dados ===== */
const seed = {
  importacao: {
    maritima: [
      { id: 'INM_01', desc: 'Importação Geladeira' },
      { id: 'INM_02', desc: 'Importação Fogão' },
    ],
    aerea: [
      { id: 'INA_01', desc: 'Importação Geladeira' },
      { id: 'INA_02', desc: 'Importação Fogão' },
    ]
  },
  exportacao: {
    maritima: [
      { id: 'EXM_01', desc: 'Exportação Geladeira' },
      { id: 'EXM_02', desc: 'Exportação Fogão' },
    ],
    aerea: [
      { id: 'EXA_01', desc: 'Exportação Geladeira' },
      { id: 'EXA_02', desc: 'Exportação Fogão' },
    ]
  }
};

/* ===== NOVO: Checklists de cada tipo ===== */
const checklists = {
  importacao: {
    aerea: [
      "S.I Revisada/Recebida",
      "Reserva com Cia Aérea",
      "Carga Pronta",
      "Carga Coletada",
      "Carga Entregue: Aero Origem",
      "Tracking Feito",
      "LCL - Carga Solta Coletada",
      "Carga Entregue: Aero Destino"
    ],
    maritima: [
      "S.I Revisada/Recebida",
      "Reserva com Armador",
      "Carga Pronta",
      "Carga Coletada",
      "Carga Entregue: Porto Origem",
      "Tracking Feito",
      "FCL - Container Coletado",
      "LCL - Carga Solta Coletada",
      "Carga Entregue: Porto Destino"
    ]
  },
  exportacao: {
    aerea: [
      "Reserva com Cia Aérea",
      "Carga Pronta",
      "Carga Coletada",
      "Carga Entregue: Aero Origem",
      "AWB Entregue Cia Aérea",
      "DUE Liberada",
      "Tracking Feito",
      "Carga Entregue: Aero Destino",
      "LCL - Carga Solta Coletada"
    ],
    maritima: [
      "Reserva com Armador",
      "Carga Pronta",
      "Carga Coletada",
      "BL/Draft Entrege para Armador",
      "Carga Entregue: Porto Origem",
      "DUE Liberada",
      "Tracking Feito",
      "Carga Entregue: Porto Destino",
      "FCL - Container Coletado",
      "LCL - Carga Solta Coletada"
    ]
  }
};

let currentType = 'importacao';
const laneEls   = { maritima: document.getElementById('laneMaritima'), aerea: document.getElementById('laneAerea') };
const laneTitles= { maritima: document.getElementById('lane1Title'), aerea: document.getElementById('lane2Title') };

/* ===== Render ===== */
function render(){
  const data = seed[currentType];
  laneTitles.maritima.textContent = (currentType === 'importacao' ? 'Importação Marítima' : 'Exportação Marítima');
  laneTitles.aerea.textContent    = (currentType === 'importacao' ? 'Importação Aérea'    : 'Exportação Aérea');

  ['maritima','aerea'].forEach(key=>{
    laneEls[key].innerHTML = '';
    data[key].forEach(card => laneEls[key].appendChild(cardEl(card,key)));
  });

  applySearch();
}

function cardEl(card,laneKey){
  const el = document.createElement('article');
  el.className = 'card';
  el.tabIndex = 0;
  el.dataset.code = card.id;
  el.dataset.desc = card.desc.toLowerCase();
  el.dataset.lane = laneKey;
  el.innerHTML = `
    <div class="card-head">
      <span class="code">${card.id}</span>
      <span class="icons" aria-hidden="true">⚙︎ ＋</span>
    </div>
    <div class="desc">${card.desc}</div>
    <div class="foot" aria-hidden="true">📎</div>
  `;
  el.addEventListener('click', () => openPopover(card, laneKey, el));
  el.addEventListener('keydown', e => { if(e.key==='Enter') openPopover(card, laneKey, el); });
  return el;
}

/* ===== Pesquisa ===== */
const search = document.getElementById('search');
search.addEventListener('input', applySearch);
function applySearch(){
  const q = (search.value||'').trim().toLowerCase();
  document.querySelectorAll('.card').forEach(c=>{
    const hit = c.dataset.code.toLowerCase().includes(q) || c.dataset.desc.includes(q);
    c.style.display = hit ? '' : 'none';
  });
}

/* ===== Switch Importação/Exportação ===== */
const typeBtn = document.getElementById('typeBtn');
const typeMenu= document.getElementById('typeMenu');
const typeLbl = document.getElementById('typeLabel');

typeBtn.addEventListener('click', ()=> typeMenu.toggleAttribute('hidden'));
document.addEventListener('click', (e)=>{
  if(!typeBtn.contains(e.target) && !typeMenu.contains(e.target)){
    typeMenu.setAttribute('hidden','');
  }
});
typeMenu.querySelectorAll('li').forEach(li=>{
  li.addEventListener('click', ()=>{
    typeMenu.querySelectorAll('li').forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    currentType = li.dataset.type;
    typeLbl.textContent = li.textContent;
    typeMenu.setAttribute('hidden','');
    render();
  });
});

/* ===== Popover ===== */
const popover  = document.getElementById('cardPopover');
const pTitle   = document.getElementById('popTitle');
const pStart   = document.getElementById('pStart');
const pEnd     = document.getElementById('pEnd');
const pStatus  = document.getElementById('pStatus');
const pObs     = document.getElementById('pObs');
const pClose   = document.getElementById('pClose');
const pAdd     = document.getElementById('pAdd');
const docsBtn  = document.getElementById('docsMenuBtn');
const docsMenu = document.getElementById('docsMenu');
const mDelete  = document.getElementById('mDelete');

/* ===== NOVO: Container do checklist ===== */
const pChecklist = document.getElementById('pChecklist');

let popCardRef = null;
let popLaneRef = null;

/* ===== NOVO: Função para renderizar checklist ===== */
function renderChecklist(tipo, modal) {
  pChecklist.innerHTML = ""; // limpa antes
  const items = checklists[tipo][modal];
  items.forEach(item => {
    const label = document.createElement("label");
    label.className = "check";
    label.innerHTML = `
      <input type="checkbox" class="pCheck round">
      <span>${item}</span>
    `;
    pChecklist.appendChild(label);
  });
}

/* ===== Atualizado: openPopover ===== */
function openPopover(card, laneKey, cardEl){
  popCardRef = card;
  popLaneRef = laneKey;

  pTitle.textContent = `${card.id} - ${card.desc}`;
  pStart.value = ''; pEnd.value = ''; pStatus.value = 'Em andamento'; pObs.value = '';
  document.querySelectorAll('.pCheck').forEach(c=>c.checked=false);

  // Centraliza o popover na coluna
  const lane = cardEl.closest('.lane');
  const laneRect = lane.getBoundingClientRect();
  const boxWidth = 560; // deve bater com .pop-box
  const left = Math.round(laneRect.left + (laneRect.width - boxWidth)/2);
  const top  = Math.round(laneRect.top + 8);

  popover.style.left = `${left}px`;
  popover.style.top  = `${top}px`;
  popover.hidden = false;

  docsMenu.setAttribute('hidden','');

  // ===== NOVO: gera checklist conforme tipo/modal =====
  renderChecklist(currentType, laneKey);
}

/* ===== Fechar popover ===== */
pClose.addEventListener('click', ()=> popover.hidden = true);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') popover.hidden = true; });
document.addEventListener('click', e=>{
  if(!popover.hidden && !popover.contains(e.target) && !e.target.closest('.card')) {
    popover.hidden = true;
  }
});

/* Menu de documentos (⋯) */
docsBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  docsMenu.toggleAttribute('hidden');
});
document.addEventListener('click', (e)=>{
  if(!docsMenu.hidden && !docsMenu.contains(e.target) && e.target!==docsBtn){
    docsMenu.setAttribute('hidden','');
  }
});

/* Excluir via menu ⋯ */
mDelete.addEventListener('click', ()=>{
  if(!popCardRef) return;
  if(!confirm(`Excluir o card "${popCardRef.id}"?`)) return;
  const arr = seed[currentType][popLaneRef];
  const idx = arr.findIndex(c=>c.id===popCardRef.id);
  if(idx>=0) arr.splice(idx,1);
  popover.hidden = true;
  render();
});

/* Adicionar novo card no popover */
pAdd.addEventListener('click', ()=>{
  const prefix = (currentType==='importacao'
    ? (popLaneRef==='maritima'?'INM':'INA')
    : (popLaneRef==='maritima'?'EXM':'EXA'));
  const code = prompt('Código do card:', `${prefix}_`);
  if(!code) return;
  const desc = prompt('Descrição do card:', 'Descrição');
  seed[currentType][popLaneRef].push({ id: code.trim(), desc: (desc||'').trim() || '—' });
  render();
});

/* init */
render();
