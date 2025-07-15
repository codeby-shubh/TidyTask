document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('task-list');
    const form = document.querySelector('.input-area');
    const emptyImage = document.querySelector('.empty-image');
    const progressText = document.getElementById('progress');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateEmptyImageDisplay() {
        emptyImage.style.display = tasks.length === 0 ? 'block' : 'none';
    }

    function celebrateCompletion() {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: {
                    x: randomInRange(0.1, 0.9),
                    y: Math.random() - 0.2
                }
            }));
        }, 250);
    }

    function updateProgress() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;

        if (total === 0) {
            progressText.textContent = '';
        } else {
            progressText.textContent = `${completed} / ${total} tasks completed`;
        }

        if (total > 0 && completed === total) {
            celebrateCompletion();
        }
    }

    function createTaskElement(taskText, completed = false, index) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.index = index;

        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';
        leftSection.style.gap = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.classList.add('styled-checkbox');

        const span = document.createElement('span');
        span.textContent = taskText;
        span.style.flexGrow = '1';
        span.style.color = '#fff';
        span.style.fontWeight = '600';
        if (completed) {
            span.style.textDecoration = 'line-through';
            span.style.opacity = '0.6';
        }

        checkbox.addEventListener('change', () => {
            span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            span.style.opacity = checkbox.checked ? '0.6' : '1';
            tasks[li.dataset.index].completed = checkbox.checked;
            saveTasks();
            updateProgress();
        });

        leftSection.appendChild(checkbox);
        leftSection.appendChild(span);

        const rightSection = document.createElement('div');
        rightSection.style.display = 'flex';
        rightSection.style.gap = '10px';

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editBtn.style.background = 'transparent';
        editBtn.style.border = 'none';
        editBtn.style.color = '#ffc3a0';
        editBtn.style.cursor = 'pointer';
        editBtn.style.transition = '0.3s';

        editBtn.addEventListener('mouseover', () => {
            editBtn.style.transform = 'scale(1.1)';
        });
        editBtn.addEventListener('mouseout', () => {
            editBtn.style.transform = 'scale(1)';
        });

        editBtn.addEventListener('click', () => {
            const newTask = prompt('Edit your task:', span.textContent);
            if (newTask !== null && newTask.trim() !== '') {
                span.textContent = newTask.trim();
                tasks[li.dataset.index].text = newTask.trim();
                saveTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.color = '#ff6f91';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.transition = '0.3s';

        deleteBtn.addEventListener('mouseover', () => {
            deleteBtn.style.transform = 'scale(1.1)';
        });
        deleteBtn.addEventListener('mouseout', () => {
            deleteBtn.style.transform = 'scale(1)';
        });

        deleteBtn.addEventListener('click', () => {
            tasks.splice(li.dataset.index, 1);
            renderTaskList();
            saveTasks();
        });

        rightSection.appendChild(editBtn);
        rightSection.appendChild(deleteBtn);

        li.appendChild(leftSection);
        li.appendChild(rightSection);

        taskList.appendChild(li);
    }

    function renderTaskList() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.style.display = 'none';
        } else {
            taskList.style.display = 'block';
            tasks.forEach((task, i) => {
                createTaskElement(task.text, task.completed, i);
            });
        }

        updateEmptyImageDisplay();
        updateProgress();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTaskList();
        }
    });

    renderTaskList();
});
