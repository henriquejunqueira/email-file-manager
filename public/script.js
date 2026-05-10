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
