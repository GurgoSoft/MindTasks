// Mostrar fecha y hora actual con segundos
function updateDateTime() {
  const now = new Date();
  const optionsDate = { day: "numeric", month: "long", year: "numeric" };
  const dateStr = now.toLocaleDateString("es-ES", optionsDate);

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  document.getElementById("current-date").textContent =
    `${dateStr} – ${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Flatpickr calendario elegante
flatpickr("#task-deadline", {
  enableTime: true,
  dateFormat: "d-m-Y h:i K",
  time_24hr: false
});

// Modo oscuro / claro
const btnTheme = document.getElementById("btn-toggle-theme");
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = btnTheme.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.replace("bi-moon-fill", "bi-sun-fill");
  } else {
    icon.classList.replace("bi-sun-fill", "bi-moon-fill");
  }
});

// Cerrar sesión
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
});

// Manejo de tareas
const formTask = document.getElementById("form-task");
const pendingList = document.getElementById("pending");
const completedList = document.getElementById("completed");

formTask.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const deadline = document.getElementById("task-deadline").value;
  const desc = document.getElementById("task-desc").value;

  addTask(title, desc, deadline);
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
        <div class="mt-auto d-flex gap-2">
          ${isCompleted 
            ? `<button class="btn btn-sm btn-outline-warning btn-pending"><i class="bi bi-arrow-counterclockwise"></i> Pendiente</button>` 
            : `<button class="btn btn-sm btn-outline-success btn-complete"><i class="bi bi-check-circle"></i> Completar</button>`
          }
          <button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash"></i></button>
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

  if (isCompleted) {
    completedList.appendChild(taskCard);
  } else {
    pendingList.appendChild(taskCard);
  }
}
