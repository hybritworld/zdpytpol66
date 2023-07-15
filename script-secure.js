const loggedIn = sessionStorage.getItem('loggedIn');

// Sprawdzenie, czy użytkownik jest zalogowany
if (loggedIn !== 'true') {
  // Jeśli użytkownik nie jest zalogowany, przekierowanie na stronę logowania
  window.location.href = 'index.html';
}

// Pobranie elementów DOM
const introElement = document.getElementById('intro'); // Pobranie elementu o id 'intro'
const loginPanelElement = document.getElementById('login-panel'); // Pobranie elementu o id 'login-panel'
const taskList = document.querySelector('#task-list'); // Pobranie elementu listy zadań o id 'task-list'

// Ukrycie panelu logowania
loginPanelElement.style.display = 'none';

// Obsługa zdarzenia animacji
introElement.addEventListener('animationend', () => {
  // Po zakończeniu animacji, ukrycie elementu intro
  introElement.style.display = 'none';
  // Wyświetlenie panelu logowania
  loginPanelElement.style.display = 'inherit';
  loginPanelElement.classList.add('login-fade-in');
});

// Adres API
const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// Pobranie formularza zadań
const taskForm = document.getElementById('task-form'); // Pobranie elementu formularza o id 'task-form'
const nameInput = document.getElementById('name'); // Pobranie elementu input o id 'name'

// Pobranie listy zadań przy ładowaniu strony
fetchTasks();

// Obsługa zdarzenia dodawania zadania
taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Zatrzymanie domyślnego zachowania formularza, czyli przeładowania strony po kliknięciu przycisku submit

  const value = nameInput.value.trim();

  if (value !== '') {
    // Jeśli wartość inputu nie jest pusta, wykonaj dodawanie zadania
    await addTask(value);
    // Oczekiwanie na zakończenie dodawania zadania przed kontynuacją
  }
});

// Pobranie listy zadań z API
async function fetchTasks() {
  try {
    const response = await fetch(`${apiUrl}?_limit=5`);
    // Wywołanie funkcji fetch, aby pobrać dane z adresu API. _limit=5 oznacza, że zostaną pobrane tylko 5 zadań.
    // Wykorzystanie await oznacza, że wykonanie skryptu zostanie wstrzymane do momentu otrzymania odpowiedzi z serwera.

    const tasks = await response.json();
    // Odczytanie odpowiedzi jako JSON. Ponownie wykorzystanie await do oczekiwania na przetworzenie danych.

    clearTaskList();
    // Wyczyszczenie listy przed dodaniem nowych zadań

    tasks.forEach(task => addTaskToList(task));
    // Dodanie każdego zadania do listy
  } catch (error) {
    console.error('Wystąpił błąd z pobieraniem danych: ', error);
  }
}

// Dodanie zadania do listy
function addTaskToList(task) {
  const listItem = document.createElement('li');
  // Utworzenie nowego elementu <li>, który będzie reprezentował zadanie na liście

  listItem.classList.add('mt-2', 'flex', 'items-center');
  // Dodanie klas stylów do elementu <li>

  const checkboxContainer = document.createElement('label');
  // Utworzenie elementu <label> do przechowywania checkboxa

  checkboxContainer.classList.add('flex', 'items-center');
  // Dodanie klas stylów do kontenera checkboxa

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.classList.add('form-checkbox', 'mr-2', 'h-5', 'w-5');
  // Utworzenie i skonfigurowanie elementu <input> typu checkbox

  checkbox.addEventListener('change', async () => {
    await updateTaskStatus(task.id, checkbox.checked);
    // Wywołanie funkcji do aktualizacji stanu zadania po zmianie checkboxa

    spanItem.classList.toggle('line-through', checkbox.checked);
    // Dodanie/usunięcie przekreślenia w zależności od stanu checkboxa
  });

  checkboxContainer.appendChild(checkbox);
  // Dodanie checkboxa do kontenera

  listItem.appendChild(checkboxContainer);
  // Dodanie kontenera checkboxa do elementu <li>

  const spanItem = document.createElement('span');
  spanItem.textContent = task.title;
  // Utworzenie elementu <span> do wyświetlania nazwy zadania
  // Przypisanie wartości zadania jako tekst wewnątrz elementu <span>

  spanItem.classList.add('text-white', 'flex-grow');
  // Dodanie klas stylów do elementu <span>

  spanItem.classList.toggle('line-through', task.completed);
  // Dodanie przekreślenia, jeśli zadanie jest zakończone

  listItem.appendChild(spanItem);
  // Dodanie elementu <span> do elementu <li>

  const editButton = createButton('Edytuj', 'bg-blue-500', 'hover:bg-blue-600', 'ml-2', 'py-1', 'px-2', 'rounded');
  // Wywołanie funkcji createButton do utworzenia przycisku "Edytuj"
  // Przekazanie tekstów i klas stylów jako argumenty

  editButton.addEventListener('click', async function () {
    await editTask(task.id, spanItem);
    // Wywołanie funkcji do edycji zadania po kliknięciu przycisku "Edytuj"
  });

  listItem.appendChild(editButton);
  // Dodanie przycisku "Edytuj" do elementu <li>

  const deleteButton = createButton('Usuń', 'bg-red-500', 'hover:bg-red-600', 'ml-2', 'py-1', 'px-2', 'rounded');
  // Wywołanie funkcji createButton do utworzenia przycisku "Usuń"
  // Przekazanie tekstów i klas stylów jako argumenty

  deleteButton.addEventListener('click', async () => {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      await deleteTask(task.id);
      // Wywołanie funkcji do usunięcia zadania po potwierdzeniu
      listItem.remove();
      // Usunięcie elementu <li> z listy
    }
  });

  listItem.appendChild(deleteButton);
  // Dodanie przycisku "Usuń" do elementu <li>

  taskList.appendChild(listItem);
  // Dodanie elementu <li> do listy zadań
}

// Dodanie zadania do listy (zapytanie POST)
async function addTask(name) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        completed: false,
        title: name,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const newTask = await response.json();
    // Odczytanie odpowiedzi jako JSON

    addTaskToList(newTask);
    // Dodanie nowego zadania do listy
    nameInput.value = '';
    // Wyczyszczenie wartości inputu
  } catch (error) {
    console.error('Wystąpił błąd z wysłaniem danych: ', error);
  }
}

// Usunięcie zadania z listy (zapytanie DELETE)
async function deleteTask(id) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    // Wywołanie funkcji fetch z metodą DELETE, aby usunąć zadanie z serwera
  } catch (error) {
    console.error('Wystąpił błąd z usunięciem danych: ', error);
  }
}

// Edycja zadania
async function editTask(id, spanItem) {
  const newName = prompt('Wprowadź nową nazwę zadania', spanItem.textContent);
  // Wyświetlenie okna dialogowego z prośbą o wprowadzenie nowej nazwy zadania

  if (newName && newName.trim() !== '') {
    // Sprawdzenie, czy wprowadzono nową nazwę i czy nie jest pusta

    await updateTask(id, newName);
    // Wywołanie funkcji do aktualizacji zadania z nową nazwą
    spanItem.textContent = newName;
    // Zaktualizowanie tekstu w elemencie <span>
  }
}

// Aktualizacja zadania (zapytanie PATCH)
async function updateTask(id, name) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: name,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    // Wywołanie funkcji fetch z metodą PATCH, aby zaktualizować zadanie na serwerze
  } catch (error) {
    console.error('Wystąpił błąd z aktualizacją danych: ', error);
  }
}

// Aktualizacja stanu zadania (zapytanie PATCH)
async function updateTaskStatus(id, completed) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: completed,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    // Wywołanie funkcji fetch z metodą PATCH, aby zaktualizować stan zadania na serwerze
  } catch (error) {
    console.error('Wystąpił błąd z aktualizacją danych: ', error);
  }
}

// Wyczyszczenie listy zadań
function clearTaskList() {
  taskList.innerHTML = '';
  // Usunięcie zawartości listy poprzez przypisanie pustego stringa do innerHTML
}

// Tworzenie przycisku
function createButton(text, ...classNames) {
  const button = document.createElement('button');
  // Utworzenie nowego elementu <button>

  button.textContent = text;
  // Ustawienie tekstu przycisku

  button.classList.add(...classNames);
  // Dodanie klas stylów do przycisku za pomocą operatora spread

  return button;
  // Zwrócenie utworzonego przycisku
}
