document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add');
    const inputBox = document.getElementById('input-box');
    const tasksContainer = document.querySelector('.tasks-box');
    const completedList = document.querySelector('.completed-tasks');
    const clearAllButton = document.querySelector('.clear');
    const pendingSection = document.getElementById('Pending');
    const completedSection = document.getElementById('Completed');
    
    // Function to add a new task
    function addTask(taskText, completed = false) {
        // Check if task with the same text already exists
        if (isTaskExists(taskText)) {
            alert('Task already exists!');
            return;
        }

        const newTask = document.createElement('li');
        newTask.classList.add('task');
        newTask.innerHTML = `
            <label><input type="checkbox" ${completed ? 'checked' : ''}><p>${taskText}</p></label>
            <div class="setting">
                <i class="fa-solid fa-ellipsis"></i>
                <ul class="task-menu">
                    <li class="edit-task"><i class="fa-solid fa-pen-to-square"></i>Edit</li>
                    <li class="delete-task"><i class="fa-solid fa-trash-can"></i>Delete</li>
                </ul>
            </div>
        `;
        if (completed) {
            newTask.querySelector('p').classList.add('completed');
            completedList.appendChild(newTask);
        } else {
            tasksContainer.appendChild(newTask);
        }
        attachTaskActions(newTask);
        inputBox.value = '';
        saveTasksToLocalStorage();
    }
    
    // Function to check if a task with the same text already exists
    function isTaskExists(taskText) {
        let taskExists = false;
        document.querySelectorAll('.task p').forEach(function(task) {
            if (task.textContent.trim() === taskText.trim()) {
                taskExists = true;
            }
        });
        return taskExists;
    }
    
    // Function to attach edit, delete, and move-to-completed actions to a task
    function attachTaskActions(taskElement) {
        const editButton = taskElement.querySelector('.edit-task');
        const deleteButton = taskElement.querySelector('.delete-task');
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        const taskText = taskElement.querySelector('p');
        
        // Edit task functionality
        editButton.addEventListener('click', function() {
            const newText = prompt('Edit task:', taskText.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskText.textContent = newText;
                saveTasksToLocalStorage();
            }
        });
        
        // Delete task functionality
        deleteButton.addEventListener('click', function() {
            taskElement.remove();
            saveTasksToLocalStorage();
        });
        
        // Checkbox click functionality
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskText.classList.add('completed');
                moveToCompleted(taskElement);
            } else {
                taskText.classList.remove('completed');
                moveBackToPending(taskElement);
            }
            saveTasksToLocalStorage();
        });
        
        // Clicking on task text to toggle completion status
        taskText.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                taskText.classList.add('completed');
                moveToCompleted(taskElement);
            } else {
                taskText.classList.remove('completed');
                moveBackToPending(taskElement);
            }
            saveTasksToLocalStorage();
        });
    }
    
    // Function to move task to Completed list
    function moveToCompleted(taskElement) {
        completedList.appendChild(taskElement);
    }
    
    // Function to move task back to Pending list
    function moveBackToPending(taskElement) {
        tasksContainer.appendChild(taskElement);
    }
    
    // Event listener for the add button
    addButton.addEventListener('click', function() {
        let taskText = inputBox.value.trim();
        if (taskText !== '') {
            addTask(taskText);
        } else {
            alert('Please enter a task!');
        }
    });
    
    // Event listener for the Clear All button
    clearAllButton.addEventListener('click', function() {
        tasksContainer.innerHTML = '';
        completedList.innerHTML = '';
        saveTasksToLocalStorage();
    });
    
    // Event listener for clicking on Pending section
    pendingSection.addEventListener('click', function() {
        tasksContainer.style.display = 'block';
        completedList.style.display = 'none';
    });
    
    // Event listener for clicking on Completed section
    completedSection.addEventListener('click', function() {
        tasksContainer.style.display = 'none';
        completedList.style.display = 'block';
    });
    
    // Function to save tasks to localStorage
    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll('.task').forEach(function(taskElement) {
            const taskText = taskElement.querySelector('p').textContent;
            const completed = taskElement.querySelector('input[type="checkbox"]').checked;
            tasks.push({ text: taskText, completed: completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to load tasks from localStorage
    function loadTasksFromLocalStorage() {
         // Retrieve tasks data from local storage under the key 'tasks'
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Iterate through each task in the retrieved tasks array
        tasks.forEach(function(task) {
        // Call the addTask function to display each task in the UI
            addTask(task.text, task.completed);
        });
    }
    
    // Load tasks from localStorage when the page loads
    loadTasksFromLocalStorage();

});