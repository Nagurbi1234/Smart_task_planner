let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = document.getElementById("taskInput").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskTime = document.getElementById("taskTime").value;

  const editIndex = this.getAttribute("data-edit-index");

  if (editIndex !== null) {
    taskList[editIndex] = {
      ...taskList[editIndex],
      text: taskText,
      date: taskDate,
      time: taskTime,
    };
    this.removeAttribute("data-edit-index");
  } else {
    taskList.push({
      text: taskText,
      date: taskDate,
      time: taskTime,
      done: false,
    });
  }

  this.reset();
  renderTasks();
});

function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";

  const now = new Date();
  const reminderSound = document.getElementById("reminderSound");

  let filtered = taskList;

  if (currentFilter === "completed") {
    filtered = taskList.filter(task => task.done);
  } else if (currentFilter === "incomplete") {
    filtered = taskList.filter(task => !task.done);
  }

  filtered.forEach((task, index) => {
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const isDueSoon = !task.done && (taskDateTime - now < 60000 && taskDateTime - now > 0);

    if (isDueSoon) {
      reminderSound.play();
      alert(`Reminder: Task "${task.text}" is due soon!`);
    }

    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" onchange="toggleDone(${index})" ${task.done ? "checked" : ""}>
      <span class="task-text">${task.text} - ${formatDate(task.date)} ${task.time}</span>
      <div class="task-actions">
        <i class="fas fa-edit" onclick="editTask(${index})" title="Edit Task"></i>
        <i class="fas fa-trash" onclick="deleteTask(${index})" title="Delete Task"></i>
      </div>
    `;

    ul.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));
}

function toggleDone(index) {
  taskList[index].done = !taskList[index].done;
  renderTasks();
}

function deleteTask(index) {
  taskList.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const task = taskList[index];
  document.getElementById("taskInput").value = task.text;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskTime").value = task.time;

  document.getElementById("taskForm").setAttribute("data-edit-index", index);
}

function setFilter(filterType) {
  currentFilter = filterType;
  renderTasks();
}

function formatDate(dateStr) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

renderTasks();
