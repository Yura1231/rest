document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');


    if (accessToken) {
    document.querySelectorAll('.auth-desktop a, .auth-mobile a').forEach(link => {
        if (link.href.includes('login') || link.href.includes('register-form')) {
            link.style.display = 'none';
        }
    });

    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('profile-btn').style.display = 'inline-block';
}
});
document.getElementById('logout-btn').addEventListener('click', function (event) {
event.preventDefault();
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
location.reload();
});

document.getElementById('profile-btn').addEventListener('click', function() {
    window.location.href = 'userProfile.html';
});