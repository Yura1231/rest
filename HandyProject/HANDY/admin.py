from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User , Event , Comment
from django.contrib.auth.models import Group

class CustomUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'is_special')}), 
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone_number', 'is_special')}),  
    )
    list_display = ('email', 'phone_number', 'first_name', 'last_name', 'is_active', 'is_staff')
    ordering = ('email',) 

admin.site.register(User, CustomUserAdmin)

@admin.register(Event)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'posted_by', 'is_approved')
    list_filter = ('is_approved', 'start_date')
    actions = ['approve_posts']

    def approve_posts(self, request, queryset):
        queryset.update(is_approved=True)
    approve_posts.short_description = "Схвалити вибрані пости"


# Спочатку розреєструємо, якщо вже було зареєстровано


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'recipient', 'text', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('author__email', 'recipient__email', 'text')  
    actions = ['delete_selected']

