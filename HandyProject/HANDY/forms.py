from django import forms
from HANDY.models import Event

class PostForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'description', 'category', 'start_date', 'start_time',
        'end_time', 'posted_by', 'image', 'email', 'phone_number', 'location_short', 
        'location_full', 'people_needed', 'is_approved']


