
    async function calcular() {
      const numero1 = parseFloat(document.getElementById('numero1').value);
      const numero2 = parseFloat(document.getElementById('numero2').value);
      const operador = document.getElementById('operador').value;

      const res = await fetch('http://localhost:8000/api/calcular/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ numero1, numero2, operador })
      });

      const data = await res.json();
      document.getElementById('resultado').innerText = data.resultado;
      carregarHistorico();
    }

    async function carregarHistorico() {
      const res = await fetch('http://localhost:8000/api/historico/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const historico = await res.json();
      const lista = document.getElementById('historico');
      lista.innerHTML = '';
      historico.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.expressao} = ${item.resultado}`;
        lista.appendChild(li);
      });
    }
  