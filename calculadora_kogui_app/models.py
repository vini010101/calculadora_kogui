from django.db import models

from django.db import models
from django.contrib.auth.models import User





class Operacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    operador = models.CharField(max_length=1)  # + - * /
    numero1 = models.FloatField()
    numero2 = models.FloatField()
    resultado = models.FloatField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.numero1} {self.operador} {self.numero2} = {self.resultado}'
