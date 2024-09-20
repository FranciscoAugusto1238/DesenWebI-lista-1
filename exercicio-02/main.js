const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskFilter = document.getElementById('task-filter');
const themeToggle = document.getElementById('theme-toggle');

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToList(task));
}

function addTaskToList(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${task.name}</span>
    <div>
      <button class="complete">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
      <button class="remove">Remover</button>
    </div>
  `;

  if (task.completed) {
    li.classList.add('completed');
  }

  li.querySelector('.complete').addEventListener('click', () => {
    task.completed = !task.completed;
    saveTasks();
    li.classList.toggle('completed');
    li.querySelector('.complete').textContent = task.completed ? 'Desmarcar' : 'Concluir';
  });

  li.querySelector('.remove').addEventListener('click', () => {
    li.classList.add('removing');
    setTimeout(() => {
      taskList.removeChild(li);
      removeTask(task);
    }, 300);
  });

  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = Array.from(taskList.children).map(li => {
    return {
      name: li.querySelector('span').textContent,
      completed: li.classList.contains('completed'),
    };
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.name !== taskToRemove.name);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('add-task').addEventListener('click', () => {
  const taskName = taskInput.value.trim();
  if (taskName) {
    const task = { name: taskName, completed: false };
    addTaskToList(task);
    saveTasks();
    taskInput.value = '';
  }
});

taskFilter.addEventListener('input', () => {
  const filterText = taskFilter.value.toLowerCase();
  Array.from(taskList.children).forEach(li => {
    const taskName = li.querySelector('span').textContent.toLowerCase();
    li.style.display = taskName.includes(filterText) ? '' : 'none';
  });
});

if (!localStorage.getItem('tasks')) {
  const initialTasks = [
    { name: 'Estudar JavaScript', completed: false },
    { name: 'Fazer exercícios de CSS', completed: true },
    { name: 'Assistir tutoriais de Vue.js', completed: false }
  ];
  localStorage.setItem('tasks', JSON.stringify(initialTasks));
}

loadTasks();

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.querySelectorAll('button, input').forEach(el => el.setAttribute('tabindex', '0'));
  }
});
