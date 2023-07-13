const loggedIn = sessionStorage.getItem('loggedIn');

if (loggedIn !== 'true') {
    window.location.href = 'index.html';
}

const introElement = document.getElementById('intro');
const loginPanelElement = document.getElementById('login-panel');
const loginForm = document.querySelector('#login-form');
const taskList = document.querySelector('#task-list');

loginPanelElement.style.display = 'none';

introElement.addEventListener('animationend', () => {
    introElement.style.display = 'none';
    loginPanelElement.style.display = 'inherit';
    loginPanelElement.classList.add('login-fade-in');
});

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
const taskForm = document.getElementById('task-form');
const nameInput = document.getElementById('name');

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
        tasks.forEach(task => addTaskToList(task));
    } catch (error) {
        console.error('Wystąpił błąd z pobieraniem danych: ', error);
    }
}

function addTaskToList(task) {
    const listItem = document.createElement('li');
    const spanItem = document.createElement('span');

    listItem.classList.add('mt-2');
    spanItem.textContent = task.title;
    spanItem.classList.add('text-white');

    if (task.completed) {
        spanItem.classList.add('line-through');
    }

    listItem.appendChild(spanItem);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.classList.add('bg-red-500', 'hover:bg-red-600', 'ml-2', 'py-1', 'px-2', 'rounded');
    deleteButton.addEventListener('click', async () => {
        await deleteTask(task.id);
        listItem.remove();
    });

    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

// dodaj element na listę -> POST
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


// usuwanie elementu z listy -> DELETE
async function deleteTask(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Wystąpił błąd z usunięciem danych: ', error);
    }
}

// aktualizowanie zadania -> PATCH
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


fetchTasks();
