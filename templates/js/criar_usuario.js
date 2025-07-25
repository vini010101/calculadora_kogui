document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const payload = {
    username: username,
    password: password
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/usuarios/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Resposta:', text);

    try {
      const data = JSON.parse(text);

      if (response.status === 201) {
        alert('✅ Usuário criado com sucesso!');
        document.getElementById('login-form').reset(); // limpa o formulário
      } else {
        alert('❌ Erro ao criar usuário:\n' + JSON.stringify(data, null, 2));
      }

    } catch (e) {
      alert('❌ Erro: resposta inválida do servidor:\n' + text);
    }

  } catch (error) {
    alert('🚫 Erro de conexão:\n' + error.message);
  }
});
