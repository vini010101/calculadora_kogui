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

    if (response.ok) {
      alert('Usuário criado com sucesso!');
    } else {
      const data = await response.json();
      alert('Erro ao criar usuário: ' + JSON.stringify(data));
    }
  } catch (error) {
    //alert('Erro de conexão: ' + error.message);
  }
});
