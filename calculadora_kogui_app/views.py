from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Operacao
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User






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

    # Retorne explicitamente JSON com status 200
    return Response({'resultado': res}, status=200)


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
