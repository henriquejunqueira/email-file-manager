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
