const taskText = document.getElementById("taskText");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const toggleTheme = document.getElementById("toggleTheme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addTaskBtn.onclick = () => {
  const text = taskText.value.trim();
  const date = taskDate.value;
  const category = taskCategory.value;

  if (text) {
    tasks.push({ text, date, category, completed: false, pinned: false });
    saveTasks();
    renderTasks();
    taskText.value = "";
    taskDate.value = "";
  }
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const query = searchTask.value.toLowerCase();
  const catFilter = filterCategory.value;
  const statusFilter = filterStatus.value;

  taskList.innerHTML = "";
  tasks
    .filter(task => 
      (task.text.toLowerCase().includes(query)) &&
      (catFilter === "All" || task.category === catFilter) &&
      (statusFilter === "All" || 
       (statusFilter === "Completed" && task.completed) ||
       (statusFilter === "Pending" && !task.completed) ||
       (statusFilter === "Pinned" && task.pinned))
    )
    .sort((a, b) => b.pinned - a.pinned)
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `${task.completed ? "completed" : ""} ${task.pinned ? "pinned" : ""}`;
      li.innerHTML = `
        <div>
          <strong>${task.text}</strong><br>
          <small>${task.category} | ${task.date}</small>
        </div>
        <div>
          <button onclick="toggleComplete(${index})">✔</button>
          <button onclick="togglePin(${index})">📌</button>
          <button onclick="editTask(${index})">✏</button>
          <button onclick="deleteTask(${index})">🗑</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
  renderTasks();
}

function togglePin(i) {
  tasks[i].pinned = !tasks[i].pinned;
  saveTasks();
  renderTasks();
}

function editTask(i) {
  const newText = prompt("Edit task:", tasks[i].text);
  if (newText !== null) {
    tasks[i].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(i) {
  if (confirm("Delete this task?")) {
    tasks.splice(i, 1);
    saveTasks();
    renderTasks();
  }
}

searchTask.oninput = renderTasks;
filterCategory.onchange = renderTasks;
filterStatus.onchange = renderTasks;

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
};

renderTasks();
