import { inicializarAPI, obtener, crear } from "./api.js";

const validateRegistration = (email, password, repeatPassword) => {
  const errors = {};

  if (!email.endsWith("@unab.edu.co")) {
    errors.emailDomain = true;
  }
  
  if (password !== repeatPassword) {
    errors.password = true;
  }
  
  return errors;
};

const handleRegistration = async (event) => {
  event.preventDefault();

  document.getElementById("emailError").style.display = "none";
  document.getElementById("emailDomainError").style.display = "none";
  document.getElementById("passwordError").style.display = "none";

  const formValues = {
    password: document.getElementById("password").value,
    repeatPassword: document.getElementById("repeatPassword").value,
    email: document.getElementById("email").value,
    name: document.getElementById("name").value
  };

  const errors = validateRegistration(formValues.email, formValues.password, formValues.repeatPassword);

  if (errors.emailDomain) {
    document.getElementById("emailDomainError").style.display = "block";
    return;
  }
  
  if (errors.password) {
    document.getElementById("passwordError").style.display = "block";
    return;
  }

  try {
    // Inicializar API
    await inicializarAPI();
    
    // Obtener usuarios usando la funcion unificada de api.js
    const usuarios = await obtener("usuarios");
    
    // Verificar si el email ya existe
    const userExists = usuarios.some(user => user.email === formValues.email);

    if (userExists) {
      document.getElementById("emailError").style.display = "block";
      return;
    }

    // Crear nuevo usuario usando la funcion unificada de api.js
    const nuevoUsuario = {
      nombre: formValues.name,
      email: formValues.email,
      password: formValues.password,
    };

    await crear("usuarios", nuevoUsuario);

    // Redirigir al login
    const urlParams = new URLSearchParams(window.location.search);
    const queryString = urlParams.toString();
    
    if (queryString) {
      window.location.href = `login.html?${queryString}`;
    } else {
      window.location.href = "login.html";
    }
    
  } catch (error) {
    console.error("Registration error:", error);
    alert("Error al crear usuario: " + error.message);
  }
};

const updateLoginLink = () => {
  const loginLink = document.querySelector(".login-link a");
  const queryString = window.location.search;
  
  if (queryString) {
    loginLink.href = `${loginLink.href}${queryString}`;
  }
};

window.onload = () => {
  document.getElementById("registrationForm").addEventListener("submit", handleRegistration);
  updateLoginLink();
};
