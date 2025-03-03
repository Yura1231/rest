from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from HANDY.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data  # DRF автоматично парсить JSON
        email = data.get('email')
        password = data.get('password')
        phone_number = data.get('phone_number')
        first_name = data.get('first_name')
        last_name = data.get('last_name', '')

        # Перевірка обов'язкових полів
        if not email or not password or not phone_number or not first_name:
            return Response({'error': 'Усі поля обов’язкові'}, status=status.HTTP_400_BAD_REQUEST)

        # Перевірка унікальності email та номера телефону
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Ця електронна пошта вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({'error': 'Цей номер телефону вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

        # Створення користувача через менеджер
        hashed_password = make_password(password)

        # Перевіряємо, чи існує користувач з таким же паролем
        for user in User.objects.all():
            if check_password(password, user.password):  # Порівнюємо збережений хеш із введеним паролем
                return Response({'error': 'Цей пароль вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

        # Створення користувача
        user = User.objects.create_user(
            phone_number=phone_number,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )

        return Response({'message': 'Користувач успішно зареєстрований'}, status=status.HTTP_201_CREATED)

    except ValueError:
        return Response({'error': 'Невірний формат JSON'}, status=status.HTTP_400_BAD_REQUEST)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({'error': 'Невірний email або пароль'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        'message': 'Вхід успішний',
        'access_token': access_token,
        'refresh_token': str(refresh)
    }, status=status.HTTP_200_OK)