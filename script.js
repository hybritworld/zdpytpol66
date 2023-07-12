const introElement = document.getElementById('intro');
const loginPanelElement = document.getElementById('login-panel');

introElement.addEventListener('animationend', () => {
    introElement.style.display = 'none';
    loginPanelElement.classList.add('login-fade-in');
});