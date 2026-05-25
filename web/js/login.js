import { inicializarAPI, obtener } from "./api.js";

function loginUser() {
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("emailError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";
    document.getElementById("emailDomainError").style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email.endsWith("@unab.edu.co")) {
      document.getElementById("emailDomainError").style.display = "block";
      document.getElementById("emailError").style.display = "none";
      return;
    }

    try {
      // Inicializar API
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

      sessionStorage.setItem("usuario_activo", JSON.stringify(user));
      
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
