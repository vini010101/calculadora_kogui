
from django.contrib import admin
from django.urls import path
from .views import login, calcular, historico, criar_usuario
urlpatterns = [
    path('api/login/', login),
    path('api/calcular/', calcular),
    path('api/historico/', historico),
    path('api/usuarios/', criar_usuario),
]
