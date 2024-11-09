<template>
  <head>
      <link rel="stylesheet" href="styles.css">
  </head>
  
  <body>
      <img src="../assets/Circuit.svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
      <div class="card">
          <h2>Login</h2>
          <h3>Ingresa tus credenciales</h3>
          <form class="form">
              <input type="text" placeholder="Usermane">
              <input type="text" placeholder="Password">
              <label>
                  <input type="checkbox">
                  <span class="checkbox-wrapper">
                      <span class="checkbox"></span>
                  </span>
                  <span class="checkbox-text">Recuerdame</span>
              </label>
              <button type="submit">Logearse</button>
          </form>
          <router-link to="/vistaAdministrador">Ir a Vista Administrador</router-link>
      </div>
  </body>
  </template>
  <script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        username: '',
        password: '',
        rememberMe: false
      };
    },
    methods: {
      login() {
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        console.log('Remember Me:', this.rememberMe);
      }
    }
  };
  </script>
  
  <script>
  
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
      height: 100vh;
      padding: 0 24px;
      background-size: cover;
      font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
      color: #f9f9f9;
      animation: rotate 6s infinite linear;
  }
  
  .card {
      width: 100%;
      margin: 0 20px;
      padding: 70px 30px 44px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.17);
      backdrop-filter: blur(10px);
  }
  
  @media (min-width: 448px) {
      .card {
          margin: 0;
          width: 70%;
          min-width: 400px;
      }
  }
  
  @media (min-width: 500px) {
      body {
          padding: 0;
      }
  }
  
  @media (min-width: 628px) {
      .card {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          padding: 0 44px;
          width: 50%;
          max-width: 500px;
          min-width: auto;
          display: flex;
          border-radius: 0;
          flex-direction: column;
          justify-content: center;
      }
  }
  
  .card>h2 {
      font-size: 36px;
      font-weight: 400;
      margin: 0 0 12px;
  }
  
  .card>h3 {
      color: rgba(255, 255, 255, 0.38);
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
  
  .form>button {
      cursor: pointer;
      width: 100%;
      height: 56px;
      padding: 0 16px;
      background: var(--color-primary);
      color: #f9f9f9;
      border: 0;
  }
  
  .form label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 6px 0 8px;
      color: rgba(255, 255, 255, 0.5);
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
  </style>
  