document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const tasksContainer = document.getElementById('tasks');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterPending = document.getElementById('filter-pending');

    // Function to fetch tasks from the external API
    function fetchTasks(filter = '') {
        axios.get('https://jsonplaceholder.typicode.com/todos')
            .then(response => {
                let tasks = response.data;
                // Apply filter if provided
                if (filter === 'completed') {
                    tasks = tasks.filter(task => task.completed);
                } else if (filter === 'pending') {
                    tasks = tasks.filter(task => !task.completed);
                }
                displayTasks(tasks);
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }
    // Function to display tasks in the DOM
    function displayTasks(tasks) {
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            taskItem.dataset.id = task.id; // Add data-id attribute for deletion
            taskItem.innerHTML = `

                <span>${task.title}</span>
                <div>
                    <button class="btn btn-sm ${task.completed ? 'btn-success' : 'btn-warning'}" onclick="toggleTask(${task.id}, this)">
                        ${task.completed ? 'Completed' : 'Pending'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id}, this)">Delete</button>
                </div>
            `;
            tasksContainer.appendChild(taskItem);
        });
    }

    // Event listener for the task form submission
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskName = taskNameInput.value;
        // Simulate adding a task (JSONPlaceholder does not support POST for todos)
        axios.post('https://jsonplaceholder.typicode.com/todos', { title: taskName, completed: false })
            .then(() => {
                fetchTasks();
                taskNameInput.value = '';
            })
            .catch(error => console.error('Error adding task:', error));
    });

    // Event listeners for filter buttons
    filterAll.addEventListener('click', () => fetchTasks());
    filterCompleted.addEventListener('click', () => fetchTasks('completed'));
    filterPending.addEventListener('click', () => fetchTasks('pending'));

    // Function to toggle the completion status of a task
    window.toggleTask = function (taskId, button) {
        // Simulate toggling a task (JSONPlaceholder does not support PUT for todos)
        axios.put(`https://jsonplaceholder.typicode.com/todos/${taskId}`, { completed: true })
            .then(() => {
                // Update button state locally
                button.classList.toggle('btn-warning');
                button.classList.toggle('btn-success');
                button.textContent = button.textContent === 'Pending' ? 'Completed' : 'Pending';
            })
            .catch(error => console.error('Error toggling task:', error));
    };

    // Function to delete a task
    window.deleteTask = function (taskId, button) {
        // Simulate deleting a task (JSONPlaceholder does not support DELETE for todos)
        axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`)
            .then(() => {
                // Remove task element from DOM
                const taskItem = button.closest('.list-group-item');
                tasksContainer.removeChild(taskItem);
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    // Initial fetch to load tasks when the page is loaded
    fetchTasks();
});               
