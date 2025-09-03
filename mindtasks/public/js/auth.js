const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");
const btnShowLogin = document.getElementById("show-login");
const btnShowRegister = document.getElementById("show-register");

// Mostrar/Ocultar formularios
btnShowLogin.addEventListener("click", () => {
  loginForm.classList.remove("d-none");
  registerForm.classList.add("d-none");
});
btnShowRegister.addEventListener("click", () => {
  registerForm.classList.remove("d-none");
  loginForm.classList.add("d-none");
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
  } else {
    alert(data.message || "Error al iniciar sesión");
  }
});

// Registro
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
  } else {
    alert(data.message || "Error al registrarse");
  }
});
