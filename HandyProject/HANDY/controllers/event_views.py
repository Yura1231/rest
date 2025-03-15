from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from HANDY.models import User , UserEventParticipation, Event , Comment
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
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    
    if serializer.is_valid():
        event = serializer.save(posted_by=request.user)  # Збереження події з автором
        return Response({'message': 'Подія створена!', 'event_id': event.id}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_events(request):
    events = Event.objects.filter(posted_by=request.user)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, event_id):
    try:
        # Знайти подію за id
        event = get_object_or_404(Event, id=event_id)
    except Event.DoesNotExist:
        return Response({'detail': 'Подія не знайдена.'}, status=status.HTTP_404_NOT_FOUND)

    # Видалити подію
    event.delete()
    
    # Повертаємо відповідь після видалення
    return Response({'message': 'Подія успішно видалена!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_event_registration(request, event_id):
    """Перевірка, чи зареєстрований користувач на подію"""
    event = get_object_or_404(Event, id=event_id)  
    registered = UserEventParticipation.objects.filter(user=request.user, event=event).exists()  
    return JsonResponse({"registered": registered})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe_to_post(request, event_id):
    user = request.user
    event = get_object_or_404(Event, id=event_id)

   
    if UserEventParticipation.objects.filter(user=user, event=event).exists():
        return Response({"message": "Ви вже підписані на цей пост."}, status=400)

    
    subscription = UserEventParticipation.objects.create(user=user, event=event)
    return Response({"message": "Ви успішно підписалися на пост."}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unsubscribe(request, event_id):
    print(f"Отриманий токен: {request.headers.get('Authorization')}")  # Додано для перевірки

    event = get_object_or_404(Event, id=event_id)
    subscription = UserEventParticipation.objects.filter(user=request.user, event=event)

    if subscription.exists():
        subscription.delete()
        return JsonResponse({"message": "Ви відписалися від цієї події!"}, status=200)
    else:
        return JsonResponse({"message": "Ви не були підписані на цю подію."}, status=400)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_subscriptions(request):
    user = request.user

    # Отримати всі події, на які користувач підписався
    subscribed_events = Event.objects.filter(usereventparticipation__user=user)

    serializer = EventSerializer(subscribed_events, many=True)
    return Response(serializer.data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_subscription_email(request, event_id):
    user = request.user
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Подія не знайдена"}, status=404)

    # Генеруємо унікальний токен
    token = str(uuid.uuid4())

    # Зберігаємо токен у базі
    participation, created = UserEventParticipation.objects.get_or_create(
        user=user, event=event, defaults={"token": token}
    )

    # Якщо запис вже існує, оновлюємо токен
    if not created:
        participation.token = token
        participation.save()

    # Формуємо URL для підтвердження
    confirm_url = request.build_absolute_uri(
        reverse("confirm_subscription", kwargs={"token": token})
    )

    # Формуємо повідомлення
    subject = f"Підтвердження підписки на подію: {event.title}"
    message = f"""
    Ви отримали це повідомлення, бо хочете підписатися на подію: {event.title}.

    📅 Дата: {event.start_date} - {event.end_date}
    📍 Місце: {event.location_full}
    ℹ️ Опис: {event.description}

    Для підтвердження підписки натисніть на кнопку:
    {confirm_url}

    Якщо ви не надсилали цей запит, просто проігноруйте цей лист.
    """

    # Відправляємо email
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

    return Response({"message": "Лист з підтвердженням відправлено на вашу пошту."})


@api_view(["GET"])

def confirm_subscription(request, token):
    try:
        participation = UserEventParticipation.objects.get(token=token)
    except UserEventParticipation.DoesNotExist:
        return Response({"error": "Невірний або застарілий токен"}, status=400)

    if participation.is_confirmed:
        return Response({"message": "Ви вже підтвердили участь у події."})

    participation.is_confirmed = True
    participation.save()

    return Response({"message": "Ви успішно підтвердили участь у події!"})