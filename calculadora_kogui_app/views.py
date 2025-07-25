# aqui importei as bibliotecas necessarias.
from rest_framework.response import Response
from rest_framework import status
from .models import Operacao
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


# Rota para criação de usuários.
# Espera dados no formato JSON contendo "username" e "password".
# - Se faltar algum campo, retorna erro 400.
# - Se o usuário já existir, também retorna erro 400.
# - Caso contrário, cria um novo usuário usando o modelo padrão do Django (User),
#   que já aplica hash na senha automaticamente.
@api_view(['POST'])
def criar_usuario(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'erro': 'Usuário e senha são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'erro': 'Usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'mensagem': f'Usuário {user.username} criado com sucesso.'}, status=status.HTTP_201_CREATED)



# Rota de autenticação (login).
# Recebe "username" e "password" via JSON.
# Se as credenciais forem válidas, retorna um token de autenticação.
# Caso contrário, retorna erro 401.
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


# Rota para realizar uma operação matemática (+, -, *, /).
# - Requer autenticação via token.
# - Recebe "numero1", "numero2" e "operador" via JSON.
# - Executa o cálculo e salva a operação no banco associada ao usuário autenticado.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calcular(request):
    data = request.data
    operador = data.get('operador')
    n1 = float(data.get('numero1'))
    n2 = float(data.get('numero2'))

    if operador == '+':
        res = n1 + n2
    elif operador == '-':
        res = n1 - n2
    elif operador == '*':
        res = n1 * n2
    elif operador == '/':
        res = n1 / n2 if n2 != 0 else 0
    else:
        return Response({'erro': 'Operador inválido'}, status=400)

    op = Operacao.objects.create(
        usuario=request.user,
        operador=operador,
        numero1=n1,
        numero2=n2,
        resultado=res
    )

    
    return Response({'resultado': res}, status=200)



# Rota para exibir o histórico das últimas 10 operações realizadas pelo usuário autenticado.
# Retorna uma lista contendo a expressão, resultado e data de cada operação.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico(request):
    ops = Operacao.objects.filter(usuario=request.user).order_by('-criado_em')[:10]
    dados = [
        {
            'expressao': f"{o.numero1} {o.operador} {o.numero2}",
            'resultado': o.resultado,
            'data': o.criado_em
        }
        for o in ops
    ]
    return Response(dados)
