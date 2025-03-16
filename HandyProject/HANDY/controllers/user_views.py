from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from HANDY.models import User , Comment
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated , AllowAny
from django.core.files.base import ContentFile
import base64
import logging
from django.shortcuts import get_object_or_404
from HANDY.serializers import EventSerializer , CommentSerializer 
import uuid
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.urls import reverse
from django.conf import settings


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data  
        email = data.get('email')
        password = data.get('password')
        phone_number = data.get('phone_number')
        first_name = data.get('first_name')
        last_name = data.get('last_name', ''),
        description = data.get('description')

        
        if not email or not password or not phone_number or not first_name:
            return Response({'error': 'Усі поля обов’язкові'}, status=status.HTTP_400_BAD_REQUEST)

        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Ця електронна пошта вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({'error': 'Цей номер телефону вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

        
        hashed_password = make_password(password)

        
        for user in User.objects.all():
            if check_password(password, user.password):  
                return Response({'error': 'Цей пароль вже використовується'}, status=status.HTTP_400_BAD_REQUEST)

       
        user = User.objects.create_user(
            phone_number=phone_number,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            description=description
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




logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    if not user:
        logger.error("User not found")
        return Response({"detail": "User not found", "code": "user_not_found"}, status=status.HTTP_404_NOT_FOUND)

    profile_data = {
        
        'email': user.email,
        'phone_number': user.phone_number,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'description': user.description,
        'location_short': user.location_short,
        'is_active': user.is_active,
    }
    return Response(profile_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile_data = {
            'email': user.email,
            'phone_number': user.phone_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'description': user.description,
            'location_short': user.location_short,
            'is_active': user.is_active,
        }
        return Response(profile_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data
    
    
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.description = data.get('description', user.description)
    

    
    profile_picture = data.get('profile_picture')
    if profile_picture:
        format, imgstr = profile_picture.split(';base64,')
        ext = format.split('/')[-1]
        user.profile_picture.save(f"profile_{user.id}.{ext}", ContentFile(base64.b64decode(imgstr)), save=True)

    user.save()
    
    return Response({"message": "Профіль оновлено успішно!"}, status=status.HTTP_200_OK)








@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_comments(request, user_id):
    recipient = User.objects.get(id=user_id)

    if request.method == "GET":
        comments = Comment.objects.filter(recipient=recipient).order_by("-created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        text = request.data.get("text")
        if not text:
            return Response({"error": "Коментар не може бути порожнім"}, status=400)

        comment = Comment.objects.create(author=request.user, recipient=recipient, text=text)
        return Response({"message": "Коментар успішно додано!"}, status=201)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_commentsss(request):
    user = request.user  

    if request.method == "GET":
        comments = Comment.objects.filter(recipient=user).order_by("-created_at")  
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    


@api_view(['GET'])
def get_user_comments(request, user_id):
    comments = Comment.objects.filter(recipient_id=user_id)  
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)
