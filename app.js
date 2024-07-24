document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const tasksContainer = document.getElementById('tasks');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterPending = document.getElementById('filter-pending');

    // Function to fetch tasks
    function fetchTasks(filter = '') {
        axios.get(`/api/tasks?filter=${filter}`)
            .then(response => {
                displayTasks(response.data);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Function to display tasks
    function displayTasks(tasks) {
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('list-group-item');
            taskItem.innerHTML = `
                <span>${task.name}</span>
                <button class="btn btn-sm ${task.completed ? 'btn-success' : 'btn-warning'}" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Completed' : 'Pending'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            `;
            tasksContainer.appendChild(taskItem);
        });
    }

    // Add task form submit event
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskName = taskNameInput.value;
        axios.post('/api/tasks', { name: taskName })
            .then(() => {
                fetchTasks();
                taskNameInput.value = '';
            })
            .catch(error => console.error('Error adding task:', error));
    });

    // Filter button event listeners
    filterAll.addEventListener('click', () => fetchTasks());
    filterCompleted.addEventListener('click', () => fetchTasks('completed'));
    filterPending.addEventListener('click', () => fetchTasks('pending'));

    // Toggle task completion
    window.toggleTask = function (taskId) {
        axios.put(`/api/tasks/${taskId}/toggle`)
            .then(() => fetchTasks())
            .catch(error => console.error('Error toggling task:', error));
    };

    // Delete task
    window.deleteTask = function (taskId) {
        axios.delete(`/api/tasks/${taskId}`)
            .then(() => fetchTasks())
            .catch(error => console.error('Error deleting task:', error));
    };

    // Initial fetch
    fetchTasks();
});
