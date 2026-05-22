import { inicializarAPI, obtener } from "./api.js";

function loginUser() {
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("emailError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Inicializar API (determina modo local/remoto automaticamente)
      await inicializarAPI();
      
      // Obtener usuarios usando la funcion unificada de api.js
      const usuarios = await obtener("usuarios");
      
      // Buscar usuario por email
      const user = usuarios.find(u => u.email === email);

      if (!user) {
        document.getElementById("emailError").style.display = "block";
        return;
      }

      if (user.password !== password) {
        document.getElementById("passwordError").style.display = "block";
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);

      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      
      if (urlParams.toString()) {
        window.location.href = `room_details.html?${urlParams.toString()}`;
      } else {
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error durante el inicio de sesion: " + error.message);
    }
  });
}

window.onload = loginUser;

document.addEventListener("DOMContentLoaded", () => {
  const signUpLink = document.querySelector(".signup-link a");
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.toString()) {
    signUpLink.href = `register.html?${urlParams.toString()}`;
  }
});
