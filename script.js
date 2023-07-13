const introElement = document.getElementById('intro');
const loginPanelElement = document.getElementById('login-panel');
const loginForm = document.querySelector('#login-form');

loginPanelElement.style.display = 'none';

introElement.addEventListener('animationend', () => {
    introElement.style.display = 'none';
    loginPanelElement.style.display = 'inherit';
    loginPanelElement.classList.add('login-fade-in');
});

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'sda123' && password === 'sda123') {
        sessionStorage.setItem('loggedIn', 'true');
        window.location.href = 'secure-page.html';
    } else {
        alert('Nieprawidłowy login lub hasło!');
    }
});