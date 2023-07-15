const loggedIn = sessionStorage.getItem('loggedIn');

// Sprawdzenie, czy użytkownik jest zalogowany
if (loggedIn !== 'true') {
  // Przekierowanie użytkownika na stronę logowania
  window.location.href = 'index.html';
}

// Pobranie elementów DOM
const introElement = document.getElementById('intro');
const loginPanelElement = document.getElementById('login-panel');
const taskList = document.querySelector('#task-list');

// Ukrycie panelu logowania
loginPanelElement.style.display = 'none';

// Obsługa zdarzenia animacji
introElement.addEventListener('animationend', () => {
  introElement.style.display = 'none';
  loginPanelElement.style.display = 'inherit';
  loginPanelElement.classList.add('login-fade-in');
});

// Adres API
const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// Pobranie formularza zadań
const taskForm = document.getElementById('task-form');
const nameInput = document.getElementById('name');

// Pobranie listy zadań przy ładowaniu strony
fetchTasks();

// Obsługa zdarzenia dodawania zadania
taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const value = nameInput.value.trim();

  if (value !== '') {
    await addTask(value);
  }
});

// Pobranie listy zadań
async function fetchTasks() {
  try {
    const response = await fetch(`${apiUrl}?_limit=5`);
    const tasks = await response.json();

    clearTaskList();
    tasks.forEach(task => addTaskToList(task));
  } catch (error) {
    console.error('Wystąpił błąd z pobieraniem danych: ', error);
  }
}

// Dodanie zadania do listy
function addTaskToList(task) {
  const listItem = document.createElement('li');
  listItem.classList.add('mt-2', 'flex', 'items-center');

  const checkboxContainer = document.createElement('label');
  checkboxContainer.classList.add('flex', 'items-center');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.classList.add('form-checkbox', 'mr-2', 'h-5', 'w-5');
  checkbox.addEventListener('change', async () => {
    await updateTaskStatus(task.id, checkbox.checked);
    spanItem.classList.toggle('line-through', checkbox.checked);
  });

  checkboxContainer.appendChild(checkbox);
  listItem.appendChild(checkboxContainer);

  const spanItem = document.createElement('span');
  spanItem.textContent = task.title;
  spanItem.classList.add('text-white', 'flex-grow');
  spanItem.classList.toggle('line-through', task.completed);

  listItem.appendChild(spanItem);

  const editButton = createButton('Edytuj', 'bg-blue-500', 'hover:bg-blue-600', 'ml-2', 'py-1', 'px-2', 'rounded');
  editButton.addEventListener('click', async function () {
    await editTask(task.id, spanItem);
  });
  listItem.appendChild(editButton);

  const deleteButton = createButton('Usuń', 'bg-red-500', 'hover:bg-red-600', 'ml-2', 'py-1', 'px-2', 'rounded');
  deleteButton.addEventListener('click', async () => {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      await deleteTask(task.id);
      listItem.remove();
    }
  });
  listItem.appendChild(deleteButton);

  taskList.appendChild(listItem);
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
    addTaskToList(newTask);
    nameInput.value = '';
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
  } catch (error) {
    console.error('Wystąpił błąd z usunięciem danych: ', error);
  }
}

// Edycja zadania
async function editTask(id, spanItem) {
  const newName = prompt('Wprowadź nową nazwę zadania', spanItem.textContent);

  if (newName && newName.trim() !== '') {
    await updateTask(id, newName);
    spanItem.textContent = newName;
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
  } catch (error) {
    console.error('Wystąpił błąd z aktualizacją danych: ', error);
  }
}

// Wyczyszczenie listy zadań
function clearTaskList() {
    taskList.innerHTML = ''; // Wyczyszczenie zawartości listy poprzez przypisanie pustego stringa
  }
  
// Tworzenie przycisku
function createButton(text, ...classNames) {
const button = document.createElement('button'); // Utworzenie nowego elementu button
button.textContent = text; // Ustawienie tekstu w przycisku
button.classList.add(...classNames); // Dodanie klas stylów do przycisku
return button; // Zwrócenie utworzonego przycisku
}