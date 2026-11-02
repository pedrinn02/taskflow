const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filter = document.getElementById("filter");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const selectedFilter = filter.value;

  const filteredTasks = tasks.filter(function(task) {
    if (selectedFilter === "pending") {
      return !task.completed;
    }

    if (selectedFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  taskCount.textContent = tasks.length;

  emptyMessage.style.display =
    filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach(function(task) {
    const item = document.createElement("li");

    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function() {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.name;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Excluir";

    deleteButton.addEventListener("click", function() {
      tasks = tasks.filter(function(currentTask) {
        return currentTask.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteButton);

    taskList.appendChild(item);
  });
}

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const taskName = taskInput.value.trim();

  if (taskName === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();

  taskInput.value = "";

  renderTasks();
});

filter.addEventListener("change", renderTasks);

renderTasks();
