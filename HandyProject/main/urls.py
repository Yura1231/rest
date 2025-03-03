from django.contrib import admin
from django.urls import path
from HANDY.controllers.post_views import create_post, post_list, edit_post, delete_post
from HANDY.controllers.user_views import login, register

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('create_post/', create_post, name='create_post'),
    path('posts/', post_list, name='post_list'),
    path('edit_post/<int:pk>/', edit_post, name='edit_post'),
    path('delete_post/<int:pk>/', delete_post, name='delete_post'),
]
