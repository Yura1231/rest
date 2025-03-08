"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from HANDY.views import register , login , get_profile ,  update_profile  , user_comments , get_user_profile



urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('profile/', get_profile, name='login'),
    path('update-profile/', update_profile, name='update-profile'),
    path("comments/<int:user_id>/", user_comments, name="user-comments"),
    path("profile/<int:user_id>/", get_user_profile, name="get_user_profile"),
    
   
]
