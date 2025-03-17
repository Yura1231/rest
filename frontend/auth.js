document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('access_token');

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const profileBtn = document.getElementById('profile-btn');
const modalBtn = document.getElementById('modal-btn-open');


const auth_separator = document.querySelectorAll('.auth-desktop .auth-separator, .auth-mobile .auth-separator');
const logout_separator = document.querySelectorAll('.auth-desktop .logout-separator, .auth-mobile .logout-separator');

if (accessToken) {

loginBtn.style.display = 'none';
registerBtn.style.display = 'none';


logoutBtn.style.display = 'inline-block';
profileBtn.style.display = 'inline-block';



auth_separator.forEach(auth_separator => auth_separator.style.display = 'none');
logout_separator.forEach(logout_separator => logout_separator.style.display = 'inline');
}else{
auth_separator.forEach(auth_separator => auth_separator.style.display = 'inline');
logout_separator.forEach(logout_separator => logout_separator.style.display = 'none');
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