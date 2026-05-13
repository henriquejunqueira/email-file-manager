const api = 'http://localhost:3000/publicacoes';

const form = document.getElementById('recordForm');
const lista = document.getElementById('recordsList');
const searchInput = document.getElementById('searchCity');

// Variáveis de gerenciamento de estado
let currentDate = new Date();
let records = [];
let editingRecordId = null;

// Inicialização do sistema
async function initializeApp() {
  await carregarRegistros();
}

// Evento de pesquisa de cidades
searchInput.addEventListener('input', () => {
  pesquisarCidade(searchInput.value);
});

// Eventos de registro de cidades (editar e remover)
document.getElementById('recordList').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');

  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (!action || !id) return;

  // Se o botão clicado for o editar, chama o método de edição passando o id do registro
  if (action === 'edit') {
    editRecord(id);
  }

  // Se o botão clicado for o deletar, chama o método de remover passando o id do registro
  if (action === 'delete') {
    await deleteRecordConfirm(id);
  }
});

// Carrega os registros
async function carregarRegistros() {
  try {
    const resposta = await fetch(api);
    records = await resposta.json();
  } catch (error) {
    console.error(error);
    records = [];
    showAlert('Erro ao carregar registros', 'error');
  }
}

// Funções utilitárias

// Função de formatação da data
function formatData(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('pt-BR', options);
}

// Converte um objeto de data para uma string formatada e retorna a data no formato "AAAA-MM-DD"
function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

// Exibe uma mensagem de feedback visual para o usuário
function showAlert(message, type = 'success') {
  const alertEl = document.getElementById('alert');
  alertEl.textContent = message;
  alertEl.className = `alert show alert-${type}`;
  setTimeout(() => alertEl.classList.remove('show'), 3000);
}

// Gera um id alfanumérico juntando o tempo atual com uma sequência aleatória
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Define o órgão que será exibido na lista de registros na tela
function getOrganLabel(organ) {
  if (organ === 'PM') return 'PM';
  if (organ === 'CM') return 'CM';
  return '';
}

function updateRecordsCount() {
  const el = document.getElementById('recordsCount');
  if (el) {
    el.textContent = `${records.length} registros salvos`;
  }
}

// Funções de operação com dados

// Filtra a lista global de registros para retornar apenas os de uma data específica
function getRecordsForDate(date) {
  const dateKey = getDateKey(date);

  return records.filter((r) => {
    if (!r.date) return false;

    const recordDate = new Date(r.date);
    return getDateKey(recordDate) === dateKey;
  });
}

// Formata um objeto Date para o padrão DATETIME do MySQL (AAAA-MM-DD HH:mm:ss)
function formatDateToMySQL(date) {
  const pad = (n) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Envia um novo registro para a API
async function addRecord(cityName, organType, content, quantity) {
  const dataSelecionada = new Date(currentDate);

  const agora = Date();

  // Ajusta a data do calendário para ter o horário atual do relógio
  dataSelecionada.setHours(
    agora.getHours(),
    agora.getMinutes(),
    agora.getSeconds(),
  );

  const novo = {
    cityName,
    organType,
    content,
    quantity: parseInt(quantity),
    date: formatDateToMySQL(dataSelecionada),
  };

  // Envia para o servidor via método POST
  await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novo),
  });

  await carregarRegistros();
}

// Atualiza um registro existente
async function updateRecords(id, cityName, organType, content, quantity) {
  const registroOriginal = records.find((r) => r.id == id);

  if (!registroOriginal) return;

  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cityName,
      organType,
      content,
      quantity: parseInt(quantity),
      date: registroOriginal.date,
    }),
  });

  await carregarRegistros();
}

// Remove um registro do banco de dados
async function deleteRecord(id) {
  await fetch(`${api}/${id}`, {
    method: 'DELETE',
  });

  await carregarRegistros();
}

// Renderização

// Calcula e atualiza os números dos cards de resumo superiores
function updateSummary() {
  const dayRecords = getRecordsForDate(currentDate);
  const totalRecords = dayRecords.length;
  const totalQuantity = dayRecords.reduce((sum, r) => sum + r.quantity, 0);
  const uniqueCities = new Set(dayRecords.map((r) => r.cityName)).size;

  document.getElementById('totalRecords').textContent = totalRecords;
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalCities').textContent = uniqueCities;
  document.getElementById('summaryTotalRecords').textContent = totalRecords;
  document.getElementById('summaryTotalQuantity').textContent = totalQuantity;
  document.getElementById('summaryTotalCities').textContent = uniqueCities;
}

// Atualiza display de data
function updateDateDisplay() {
  document.getElementById('selectedDate').textContent = formatData(currentDate);
}

// Renderiza os registros
function renderRecords() {
  const dayRecords = getRecordsForDate(currentDate);
  const recordsList = document.getElementById('recordsList');

  if (dayRecords.length === 0) {
    recordsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon><i class="bi bi-mailbox"></i></div>
        <p>Nenhum registro para este dia</p>
      </div>
    `;

    return;
  }

  // Agrupa por cidade
  const grouped = {};
  dayRecords.forEach((record) => {
    if (!grouped[record.cityName]) {
      grouped[record.cityName] = [];
    }

    grouped[record.cityName].push(record);
  });

  let html = '';

  Object.entries(grouped).forEach(([cityName, cityRecords]) => {
    const totalQuantity = cityRecords.reduce((sum, r) => sum + r.quantity, 0);

    html += `
      <div class="sender-group">
        <div class="sender-header">
          <div>
            <div class="sender-name">${cityName}</div>
          </div>
          <div class="sender-stats">
            <div class="sender-stat">
              <span class="sender-stat-label">Total:</span>
              <span class="sender-stat-value">${totalQuantity}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    cityRecords.forEach((record) => {
      const time = new Date(record.date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const organLabel = getOrganLabel(record.organType);

      html += `
        <div class="record-item">
          <div class="record-info">
            <div class="record-time">${time} ${organLabel ? `[${organLabel}]` : ''}</div>
            <div class="record-content">${record.content}</div>
          </div>
          <div class="record-quantity">${record.quantity}</div>
          <div class="record-actions">
            <button class="btn-edit" data-action="edit" data-id="${record.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn-danger" data-action="delete" data-id="${record.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      `;
    });

    html += '</div>';
  });

  recordsList.innerHTML = html;
}

function render() {
  updateDateDisplay();
  updateSummary();
  renderRecords();
  updateRecordsCount();
}

// Manipuladores de eventos

// Captura os dados do formulário, valida e envia para o banco de dados
document.getElementById('recordForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Captura os valores dos inputs e remove espaços inúteis nas pontas (.trim())
  const cityName = document.getElementById('cityName').value.trim();
  const organType = document.getElementById('organType').value;
  const content = document.getElementById('content').value.trim();
  const quantity = document.getElementById('quantity').value;

  // Validação manual: Se algum campo obrigatório estiver vazio, para a execução
  if (!cityName || !content || !quantity) {
    showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  // Tenta salvar o registro na API
  await addRecord(cityName, organType, content, quantity);

  // Limpa o formulário após o salvamento
  document.getElementById('recordForm').reset();

  // Atualiza os dados locais e redesenha a interface para mostrar o novo item
  await carregarRegistros();
  render();

  // Exibe a notificação de sucesso para o usuário
  showAlert('Registro adicionado com sucesso!', 'success');
});

// Reseta o formulário e rola a página suavemente até ele
document.getElementById('newRecordBtn').addEventListener('click', () => {
  document.getElementById('recordForm').reset();
  document.getElementById('recordForm').scrollIntoView({ behavior: 'smooth' });
});

// Diminui um dia da data atual e atualiza a tela
document.getElementById('prevDayBtn').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  render();
});

// Aumenta um dia na data atual e atualiza a tela
document.getElementById('nextDayBtn').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
});

// Reseta a data do calendário para a data atual do computador
document.getElementById('todayBtn').addEventListener('click', () => {
  currentDate = new Date();
  render();
});

// Exportação XLSX
document.getElementById('exportXlsxBtn').addEventListener('click', () => {
  try {
    const dayRecords = getRecordsForDate(currentDate);

    if (dayRecords.length === 0) {
      showAlert('Nenhum registro para exportar', 'warning');
      return;
    }

    // Prepara os dados para XLSX
    const data = [
      ['Nome da Cidade', 'Órgão', 'Conteúdo Publicado', 'Quantidade'],
    ];

    dayRecords.forEach((record) => {
      data.push([
        record.cityName || '',
        record.organType || '',
        record.content || '',
        record.quantity || 0,
      ]);
    });

    // Cria um workbook
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Ajusta a largura das colunas
    ws['!cols'] = [
      { wch: 20 }, // Nome da Cidade
      { wch: 10 }, // Órgão
      { wch: 40 }, // Conteúdo Publicado
      { wch: 12 }, // Quantidade
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');

    // Gera nome do arquivo
    const dateStr = getDateKey(currentDate);
    const fileName = `registros-${dateStr}.xlsx`;

    // Baixa arquivo
    XLSX.writeFile(wb, fileName);
    showAlert('Arquivo XLSX exportado com sucesso!', 'success');
  } catch (error) {
    console.log('Erro ao exportar: ', error);
    showAlert('Erro ao exportar arquivo. Tente novamente.', 'error');
  }
});

// Edição de registro
function editRecord(recordId) {
  const record = records.find((r) => r.id == recordId);

  if (!record) return;

  editingRecordId = recordId;

  document.getElementById('editRecordId').value = recordId;
  document.getElementById('editCityName').value = record.cityName;
  document.getElementById('editOrganType').value = record.organType;
  document.getElementById('editContent').value = record.content;
  document.getElementById('editQuantity').value = record.quantity;

  document.getElementById('editModal').classList.add('active');
}

window.editRecord = editRecord;

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cityName = document.getElementById('editCityName').value.trim();
  const organType = document.getElementById('editOrganType').value;
  const content = document.getElementById('editContent').value.trim();
  const quantity = document.getElementById('editQuantity').value;

  if (!cityName || !content || !quantity) {
    showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  await updateRecord(editingRecordId, cityName, organType, content, quantity);
  document.getElementById('editModal').classList.remove('active');
  render();
  showAlert('Registro atualizado com sucesso!', 'success');
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('editModal'.classList.remove('active'));
});

document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editModal').classList.remove('active');
});

// Verifica se o usuário quer remover o registro
async function deleteRecordConfirm(recordId) {
  if (confirm('Tem certeza que deseja deletar este registro?')) {
    await deleteRecord(recordId);
    render();
    showAlert('Registro deletado com sucesso!', 'success');
  }
}
