const tasktext = document.getElementById("taskinput");
const addBtn = document.getElementById("add-btn");
const todoContainer = document.getElementById("task-list");

// Load and display tasks on extension load
chrome.storage.sync.get(["tasks"], (res) => {
    const tasks = res.tasks || [];
    tasks.forEach((task, index) => {
        createTaskElement(task, index);
    });
});

// Add new task and save it
addBtn.addEventListener("click", () => {
    const text = tasktext.value;
    if (text) {
        chrome.storage.sync.get(["tasks"], (res) => {
            const tasks = res.tasks || [];

            // Check if there are already 5 tasks
            if (tasks.length >= 5) {
                alert("You can't add more than 5 tasks.");
                return; // Prevent adding more tasks
            }

            tasks.push(text);

            // Update storage with the new list of tasks
            chrome.storage.sync.set({ tasks }, () => {
                console.log(`Task added: ${text}`);

                // Create and append the new task to the DOM
                createTaskElement(text, tasks.length - 1);

                // Clear input after adding
                tasktext.value = "";
            });
        });
    }
});

// Function to create task element with delete button
function createTaskElement(task, index) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    const para = document.createElement('h2');
    para.innerText = task;

    const del = document.createElement('button');
    del.innerText = 'X';

    del.addEventListener('click', () => {
        // Remove task from the DOM
        todoContainer.removeChild(taskItem);

        // Remove task from chrome storage
        chrome.storage.sync.get(["tasks"], (res) => {
            const tasks = res.tasks || [];
            tasks.splice(index, 1); // Remove the task at the given index

            // Update the storage
            chrome.storage.sync.set({ tasks }, () => {
                console.log(`Task removed: ${task}`);
            });
        });
    });

    // Append the task text and delete button to the task item div
    taskItem.appendChild(para);
    taskItem.appendChild(del);

    // Append the task item div to the container
    todoContainer.appendChild(taskItem);
}
