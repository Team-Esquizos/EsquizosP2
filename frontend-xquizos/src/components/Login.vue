<template>
    <head>
        <link rel="stylesheet" href="styles.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap">
    </head>
    
    <body>
        <img src="../assets/prueba3.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
        <div class="card">
            <h2><i class="fas fa-user"></i> Login</h2>
            <h3>Ingresa tus credenciales</h3>
            <form class="form" @submit.prevent="login">
                <input type="text" placeholder="Email" v-model="user.email" required />
                <input type="password" placeholder="Password" v-model="user.password" required />
                <label>
                    <input type="checkbox" v-model="user.rememberMe">
                    <span class="checkbox-wrapper">
                        <span class="checkbox"></span>
                    </span>
                    <span class="checkbox-text">Recuerdame</span>
                </label>
                <div class="button-container">
                    <button type="submit"><i class="fas fa-sign-in-alt"></i> Logearse</button>
                </div>
            </form>
           
        </div>
    </body>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import axios from 'axios';
  import '@fortawesome/fontawesome-free/css/all.css';
  
  export default {
    name: 'Login',
    data() {
      return {
        user: {
          email: '',
          password: '',
          rememberMe: false,
        },
        isAdmin: false,
        message: ''
      };
    },
    mounted() {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (storedUser) {
            axios.get(`http://localhost:3333/api/user/${storedUser}`)
                .then(({ data }) => {
                    if (data) {
                        this.user = data; 
                    }
                    if (data.isAdmin === 'true' || data.isAdmin === true) {
                        this.$router.push({ name: 'VistaAdministrador' });
                    } else {
                        this.$router.push({ name: 'VistaDocente' });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        } 

    },
    methods: {
      login() {
        axios.post("http://localhost:3333/api/user/login", {
          email: this.user.email,
          password: this.user.password
        })
        .then(({ data }) => {
          if (data.status === true) {
            Swal.fire({
              title: "Sesión iniciada",
              text: "Has iniciado sesión de forma exitosa",
              icon: "success"
            });
  
            const storage = this.user.rememberMe ? localStorage : sessionStorage;
            storage.setItem('email', this.user.email);
            storage.setItem('user', data.username);
            storage.setItem('isAdmin', data.isAdmin);
            console.log(data.rut)
            console.log(data    )
            storage.setItem('rut', data.rut);
  
            if (data.isAdmin === 'true' || data.isAdmin === true) {
                this.$router.push({ name: 'VistaAdministrador' });
            } else {
                this.$router.push({ name: 'VistaDocente' });
            }

          } else {
            Swal.fire({
              title: "Error al iniciar sesión",
              text: "Comprueba el correo o la contraseña",
              icon: "error"
            });
          }
        })
        .catch(err => {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "An error occurred. Try again.",
            icon: "error"
          });
        });
      },
    }
  };
  </script>
  

  
  <style scoped>
  ★ {
      box-sizing: border-box;
  }
  
  @keyframes rotate {
      100% {
          background-position: 25% 50%;
      }
  }
  
  :root {
      --color-primary: #3192e5;
  }
  
  body {
      display: grid;
      place-items: center;
      margin: 0;
      height: 90vh;
      color: #f9f9f9;
      background-color: rgba(255,255,255,0);
      padding: 0 24px;
      background-size: cover;
      font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
      animation: rotate 6s infinite linear;
  }
  
  .card {
      font-family: 'Montserrat', sans-serif;  
      width: 21%;
      margin: 0 20px;
      margin-right: 8px; /* Añade espacio entre el ícono y el texto */
      padding: 70px 30px 44px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.17);
      backdrop-filter: blur(10px);
      border: 1px solid rgb(166, 165, 165);
  }
  
  
  .card>h2 {
      font-size: 40px;
      font-weight: 400;
      color: rgb(244, 243, 243);
      margin: 0 0 12px;
  }
  
  .card>h3 {
      color: rgb(214, 212, 212);
      margin: 0 0 48px;
      font-size: 16px;
  }
  
  .form {
      width: 100%;
      margin: 0;
      display: grid;
      gap: 16px;
  }
  
  .form> :is(input, button) {
      width: 100%;
      height: 56px;
      border-radius: 6px;
      border: 0;
      border: 1px solid white;
  }
  
  .form>input {
      color: rgba(255, 255, 255, 0.96);
      background: rgba(255, 255, 255, 0.08);
      font-family: inherit;
      font-size: 16px;
      padding: 0 16px;
  }
  
  .form>input::placeholder {
      color: rgba(255, 255, 255, 0.38);
  }

  .form label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 6px 0 8px;
      color: white;
  }
  
  .form label input {
      scale: 0;
  }
  
  .form input:checked~.checkbox-wrapper .checkbox {
      transform: rotate(45deg);
      width: 14px;
      margin-left: 12px;
      margin-top: -2px;
      border-color: var(--color-primary);
      border-top-color: transparent;
      border-left-color: transparent;
      border-radius: 0;
  }
  
  .checkbox-wrapper {
      width: 32px;
      height: 32px;
  }
  
  .checkbox {
      display: block;
      width: inherit;
      height: inherit;
      border: 3px solid rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      transition: all 0.375s;
  }
  

    /* Estilos específicos para el botón */
    .button-container {
        display: flex;
        justify-content: center; /* Centrar el botón */
        margin-top: 16px; /* Separar el botón del checkbox */
    }

    .form > .button-container > button {
        cursor: pointer;
        width: 60%;
        height: 56px;
        padding: 0 16px;
        background: var(--color-primary);
        color: #f9f9f9;
        border: 1px solid white; /* Añadir borde blanco */
        border-radius: 6px; /* Borde redondeado */
    }

    /* Efecto hover para el botón */
    .form > .button-container > button:hover {
        background: rgba(255, 255, 255, 0.1);
    }
  </style>