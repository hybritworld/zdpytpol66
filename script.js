const introElement = document.getElementById('intro'); // Pobranie elementu o id 'intro'
const loginPanelElement = document.getElementById('login-panel'); // Pobranie elementu o id 'login-panel'
const loginForm = document.querySelector('#login-form'); // Pobranie elementu formularza o id 'login-form'

loginPanelElement.style.display = 'none'; // Ukrycie panelu logowania na początku

introElement.addEventListener('animationend', () => {
  introElement.style.display = 'none'; // Ukrycie elementu intro po zakończeniu animacji
  loginPanelElement.style.display = 'inherit'; // Wyświetlenie panelu logowania
  loginPanelElement.classList.add('login-fade-in'); // Dodanie klasy stylu do animacji
});

loginForm.addEventListener('submit', event => {
  event.preventDefault(); // Zapobieganie domyślnej akcji formularza (przeładowanie strony)

  const username = document.getElementById('username').value; // Pobranie wartości pola username
  const password = document.getElementById('password').value; // Pobranie wartości pola password

  if (username === 'sda123' && password === 'sda123') {
    sessionStorage.setItem('loggedIn', 'true'); // Ustawienie flagi zalogowania w sessionStorage
    window.location.href = 'secure-page.html'; // Przekierowanie użytkownika do strony zabezpieczonej
  } else {
    alert('Nieprawidłowy login lub hasło!'); // Wyświetlenie alertu w przypadku nieprawidłowych danych logowania
  }
});
