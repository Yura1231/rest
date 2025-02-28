from django.contrib import admin
from .models import User, Event, Comment, UserEventParticipation

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'is_staff', 'is_active']
    search_fields = ['email', 'phone_number']
    list_filter = ['is_staff', 'is_active']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'start_date', 'is_approved')
    list_filter = ('is_approved', 'category')
    search_fields = ('title', 'description', 'posted_by__first_name', 'posted_by__last_name')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'recipient', 'created_at')
    search_fields = ('author__first_name', 'recipient__first_name', 'text')

@admin.register(UserEventParticipation)
class UserEventParticipationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'is_confirmed')
    list_filter = ('is_confirmed',)