from django.shortcuts import render, redirect, get_object_or_404
from HANDY.models import Event
from HANDY.forms import PostForm
from django.contrib import messages

def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пост успішно додано!')
            return redirect('post_list')
    else:
        form = PostForm()
    return render(request, 'posts/create_post.html', {'form': form})

def post_list(request):
    posts = Post.objects.all()
    return render(request, 'posts/post_list.html', {'posts': posts})

def edit_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пост успішно оновлено!')
            return redirect('post_list')
    else:
        form = PostForm(instance=post)
    return render(request, 'posts/edit_post.html', {'form': form})

def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.delete()
    messages.success(request, 'Пост успішно видалено!')
    return redirect('post_list')
