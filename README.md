Teste Técnico - API Calculadora com Autenticação Django REST Framework
Objetivo
Este projeto foi desenvolvido como teste técnico para avaliação de habilidades em backend Python, utilizando Django e Django REST Framework.

O sistema implementa uma API REST que permite:

Cadastro e autenticação de usuários via token;

Execução de operações matemáticas básicas (+, -, *, /);

Registro e consulta do histórico das operações realizadas por cada usuário autenticado.

Tecnologias e Ferramentas Utilizadas
Python 3.x

Django 4.x

Django REST Framework

Autenticação via Token DRF

Banco de dados SQLite (configuração padrão)

Funcionalidades Implementadas
Método	Endpoint	Descrição	Autenticação	Entrada JSON	Saída JSON / Status HTTP
POST	/criar_usuario	Criação de novo usuário	Não	{ "username": "...", "password": "..." }	201 sucesso ou 400 erro (dados inválidos)
POST	/login	Login e emissão de token de autenticação	Não	{ "username": "...", "password": "..." }	200 token ou 401 credenciais inválidas
POST	/calcular	Executa operação matemática e salva registro	Sim	{ "numero1": float, "numero2": float, "operador": "+-*/" }	200 resultado ou 400 operador inválido
GET	/historico	Retorna últimas 10 operações do usuário	Sim	Nenhum	200 lista JSON das operações

Implementação
Validação básica de dados e tratamento de erros mínimos para garantir funcionalidade.

Utilização do modelo User do Django para cadastro e autenticação.

Geração e controle de tokens via Django REST Framework.

Registro das operações matemáticas no banco, relacionando com o usuário autenticado.

Histórico limitado às 10 últimas operações, ordenadas pela data.

Instruções para Execução
Clone o repositório do teste técnico.

Configure e ative ambiente virtual Python.

Instale dependências:
pip install -r requirements.txt

Aplique migrações no banco de dados:
python manage.py migrate

Execute o servidor localmente:
python manage.py runserver
Utilize ferramentas como Postman para testar as rotas conforme tabela acima.

Para endpoints protegidos, utilize o token JWT retornado no login no cabeçalho da requisição:
Authorization: Token <token>
Observações
Projeto focado em atender os requisitos mínimos solicitados no teste técnico.

Código limpo e comentado para facilitar entendimento.

Possibilidade de melhorias em validações, segurança e documentação caso haja continuidade no desenvolvimento.

Uso de SQLite para facilitar setup e teste local.

