const formTask = document.getElementById("form-task");
const pendingList = document.getElementById("pending");
const completedList = document.getElementById("completed");

formTask.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const deadline = document.getElementById("task-deadline").value;
  const desc = document.getElementById("task-desc").value;

  addTask(title, desc, deadline, false);
  formTask.reset();
});

function addTask(title, desc, deadline, isCompleted = false) {
  const taskCard = document.createElement("div");
  taskCard.className = "col-12 col-md-6";
  taskCard.innerHTML = `
    <div class="card shadow-sm rounded-4 h-100 task-card">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${title}</h5>
        <p class="card-text text-muted">${desc || "Sin descripción"}</p>
        <p class="small"><i class="bi bi-calendar-event"></i> ${deadline}</p>
        <div class="mt-auto d-flex gap-2 flex-wrap">
          ${isCompleted 
            ? `<button class="btn btn-sm btn-outline-warning btn-pending"><i class="bi bi-arrow-counterclockwise"></i> Pendiente</button>` 
            : `<button class="btn btn-sm btn-outline-success btn-complete"><i class="bi bi-check-circle"></i> Completar</button>`
          }
          <button class="btn btn-sm btn-outline-danger btn-delete"><i class="">Eliminar</i></button>
        </div>
      </div>
    </div>
  `;

  // Acciones
  const btnComplete = taskCard.querySelector(".btn-complete");
  if (btnComplete) {
    btnComplete.addEventListener("click", () => {
      taskCard.remove();
      addTask(title, desc, deadline, true);
    });
  }

  const btnPending = taskCard.querySelector(".btn-pending");
  if (btnPending) {
    btnPending.addEventListener("click", () => {
      taskCard.remove();
      addTask(title, desc, deadline, false);
    });
  }

  taskCard.querySelector(".btn-delete").addEventListener("click", () => {
    taskCard.remove();
  });

  // Insertar en el contenedor correcto
  if (isCompleted) {
    completedList.appendChild(taskCard);
  } else {
    pendingList.appendChild(taskCard);
  }
}

const btnToggleTheme = document.getElementById("btn-toggle-theme");
const body = document.body;

// Revisar si ya había una preferencia guardada
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  body.classList.remove("light-mode");
  btnToggleTheme.innerHTML = `<i class="bi bi-sun"></i>`;
} else {
  body.classList.add("light-mode");
}

// Botón para cambiar tema
btnToggleTheme.addEventListener("click", () => {
  if (body.classList.contains("light-mode")) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    btnToggleTheme.innerHTML = `<i class="bi bi-sun"></i>`;
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    btnToggleTheme.innerHTML = `<i class="bi bi-moon"></i> Oscuro`;
    localStorage.setItem("theme", "light");
  }
});
