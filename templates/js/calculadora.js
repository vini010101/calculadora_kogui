let expressao = '';
let token = localStorage.getItem('authToken') || '';

function atualizarDisplay() {
  const display = document.getElementById('display');
  display.textContent = expressao || '0';
}

function inserirNumero(num) {
  expressao += num;
  atualizarDisplay();
}

function inserirOperador(op) {
  if (expressao.length === 0) return;
  const ultimo = expressao[expressao.length - 1];
  if ("+-*/".includes(ultimo)) return;
  expressao += op;
  atualizarDisplay();
}

function limpar() {
  expressao = '';
  atualizarDisplay();
}

function apagar() {
  expressao = expressao.slice(0, -1);
  atualizarDisplay();
}

function parseExpressao(exp) {
  const match = exp.match(/^(-?\d*\.?\d+)([\+\-\*\/])(-?\d*\.?\d+)$/);
  if (!match) return null;
  return {
    numero1: match[1],
    operador: match[2],
    numero2: match[3]
  };
}

async function calcular() {
  const dados = parseExpressao(expressao);
  if (!dados) {
    alert('Expressão inválida. Use formato: número operador número (ex: 2+3)');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/calcular/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      const erroData = await response.json();
      alert('Erro: ' + (erroData.erro || 'Erro desconhecido'));
      return;
    }

    const resultData = await response.json();
    const resultado = resultData.resultado;

    adicionarHistorico(`${expressao} = ${resultado}`);
    expressao = resultado.toString();
    atualizarDisplay();

    mostrarMensagem('Cálculo realizado e salvo com sucesso.', 'success');

    // Atualizar o histórico completo após salvar
    await carregarHistorico();

  } catch (error) {
    alert('Erro de conexão: ' + error.message);
  }
}

async function carregarHistorico() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/historico/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

   

    const dados = await response.json();

    const ul = document.getElementById('historico');
    ul.innerHTML = '';  // limpa histórico atual

    dados.forEach(op => {
      const li = document.createElement('li');
      // Exemplo: "12 + 5 = 17"
      li.textContent = `${op.expressao} = ${op.resultado}`;
      ul.appendChild(li);
    });

  } catch (error) {
    //alert('Erro ao carregar histórico: ' + error.message);
  }
}

function adicionarHistorico(texto) {
  const ul = document.getElementById('historico');
  const li = document.createElement('li');
  li.textContent = texto;
  ul.prepend(li);
}

function mostrarMensagem(texto, tipo) {
  const container = document.querySelector('.calc-container');
  let msg = document.createElement('div');
  msg.textContent = texto;
  msg.style.position = 'fixed';
  msg.style.top = '10px';
  msg.style.right = '10px';
  msg.style.padding = '10px 20px';
  msg.style.borderRadius = '5px';
  msg.style.color = '#fff';
  msg.style.fontWeight = 'bold';
  msg.style.zIndex = 1000;
  msg.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

  if (tipo === 'success') {
    msg.style.backgroundColor = '#28a745';
  } else if (tipo === 'error') {
    msg.style.backgroundColor = '#dc3545';
  } else {
    msg.style.backgroundColor = '#6c757d';
  }

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
}

window.onload = () => {
  atualizarDisplay();
  document.getElementById('calculadora').style.display = 'block';
  carregarHistorico();
};
