const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

const inputError = document.getElementById("inputError");
const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

currentDate.textContent = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();


function addTask() {
    const text = taskInput.value.trim();

    inputError.textContent = "";

    if (text === "") {
        inputError.textContent = "Please enter a task before adding.";
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


function renderTasks() {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    pendingTasks.forEach(task => {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(task => {
        completedList.appendChild(createTaskElement(task));
    });

    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;

    pendingEmpty.style.display =
        pendingTasks.length === 0 ? "flex" : "none";

    completedEmpty.style.display =
        completedTasks.length === 0 ? "flex" : "none";
}


function createTaskElement(task) {
    const taskElement = document.createElement("div");

    taskElement.className = task.completed
        ? "task completed"
        : "task";

    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
        <button class="task-check" aria-label="Mark task complete">
            ${task.completed ? "✓" : ""}
        </button>

        <div class="task-content">
            <p class="task-text">${escapeHTML(task.text)}</p>
            <p class="task-time">
                Added ${task.createdAt}
                ${task.completedAt ? ` · Completed ${task.completedAt}` : ""}
            </p>
        </div>

        <div class="task-actions">
            <button class="edit-btn">EDIT</button>
            <button class="delete-btn">DELETE</button>
        </div>
    `;

    const checkButton = taskElement.querySelector(".task-check");
    const editButton = taskElement.querySelector(".edit-btn");
    const deleteButton = taskElement.querySelector(".delete-btn");

    checkButton.addEventListener("click", () => {
        toggleTask(task.id);
    });

    editButton.addEventListener("click", () => {
        editTask(task.id, taskElement);
    });

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    return taskElement;
}


function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed
                    ? new Date().toLocaleString()
                    : null
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


function editTask(id, taskElement) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const taskContent = taskElement.querySelector(".task-content");

    taskContent.innerHTML = `
        <input
            class="edit-input"
            type="text"
            value="${escapeHTML(task.text)}"
            autocomplete="off"
        >
        <p class="task-time">
            Added ${task.createdAt}
            ${task.completedAt ? ` · Completed ${task.completedAt}` : ""}
        </p>
    `;

    const editInput = taskContent.querySelector(".edit-input");

    editInput.focus();
    editInput.select();

    editInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            saveEditedTask(id, editInput.value);
        }

        if (event.key === "Escape") {
            renderTasks();
        }
    });

    editInput.addEventListener("blur", function() {
        saveEditedTask(id, editInput.value);
    });
}


function saveEditedTask(id, newText) {
    const text = newText.trim();

    if (text === "") {
        return;
    }

    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                text: text
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}