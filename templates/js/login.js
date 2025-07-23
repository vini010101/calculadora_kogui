let token = '';

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      token = data.token;

      // Salva o token no localStorage para ser usado na próxima página
      localStorage.setItem('authToken', token);

      // Redireciona para calculadora.html
      window.location.href = '/templates/calculadora.html';
    } else {
      alert('Login falhou. Verifique usuário e senha.');
    }

  } catch (error) {
    alert('Erro de rede ou servidor: ' + error.message);
  }
});

 document.getElementById('btn-criar-usuario').addEventListener('click', () => {
      window.location.href = 'criar_usuario.html'; // ajuste o caminho se necessário
    });