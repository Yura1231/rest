from rest_framework import serializers
from .models import User
from .models import Event , Comment



class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author_name", "text", "created_at"]