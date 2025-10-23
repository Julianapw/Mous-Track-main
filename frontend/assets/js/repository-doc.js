// dados de exemplo (igual ao Figma)
const FOLDERS = {
  EX_01: {
    title: 'EX_01 - Exportação Geladeira',
    docs: [
      { name: 'Invoice.pdf',         created: '25/08/2025' },
      { name: 'Packaging_List.pdf',  created: '25/08/2025' },
      { name: 'Orçamento.pdf',       created: '25/08/2025' },
    ]
  },
  EX_02: {
    title: 'EX_02 - Exportação Fogão',
    docs: [
      { name: 'Invoice.pdf',         created: '25/08/2025' },
      { name: 'Romaneio.pdf',        created: '25/08/2025' },
      { name: 'Packing.pdf',         created: '25/08/2025' },
    ]
  },
  IN_01: {
    title: 'IN_01 - Importação peças automotivas',
    docs: [
      { name: 'Invoice.pdf',         created: '25/08/2025' },
      { name: 'Proforma.pdf',        created: '25/08/2025' },
    ]
  }
};

function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const id = (getParam('id') || 'EX_01').toUpperCase();
const folder = FOLDERS[id] || FOLDERS.EX_01;

const titleEl = document.getElementById('folderTitle');
const tbody   = document.getElementById('docsTbody');
const input   = document.getElementById('docSearch');

titleEl.textContent = folder.title;

function render(list){
  tbody.innerHTML = '';
  list.forEach(doc => {
    const tr = document.createElement('tr');
    tr.dataset.search = `${doc.name} ${doc.created}`.toLowerCase();
    tr.innerHTML = `
      <td class="col-icon" aria-hidden="true">
        <img src="assets/img/icons/documento.svg" width="16" height="16" alt="">
      </td>
      <td>${doc.name}</td>
      <td class="col-date">${doc.created}</td>
    `;
    tbody.appendChild(tr);
  });
}

render(folder.docs);

function filterDocs(){
  const q = (input.value || '').trim().toLowerCase();
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    tr.style.display = tr.dataset.search.includes(q) ? '' : 'none';
  });
}
input.addEventListener('input', filterDocs);
