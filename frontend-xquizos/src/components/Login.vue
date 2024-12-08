<template>
    <div class="login-container">
        <img src="../assets/fondoblanco.jpg" class="background-image">
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
    </div>
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
            icon: "success",
            confirmButtonColor: "#007bff"
          });

          const storage = this.user.rememberMe ? localStorage : sessionStorage;
          storage.setItem('email', this.user.email);
          storage.setItem('user', data.username);
          storage.setItem('isAdmin', data.isAdmin);
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
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
}

.login-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    display: grid;
    place-items: center;
    color: #1a1a1a;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

.background-image{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    z-index: -1;
}

.card {
    width: 21%;
    margin: 0 20px 0 0; 
    padding: 70px 30px 44px;
    border-radius: 20px;
    border: 1px solid rgb(166, 165, 165);
    background-color: var(--background, rgba(255,255,255,0.9));
    box-sizing: border-box;
}

.card>h2 {
    font-size: 40px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 12px;
}

.card>h3 {
    color: #1a1a1a;
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
    border: 1px solid rgb(166, 165, 165);
}

.form>input {
    color: rgba(0, 0, 0, 0.96);
    background: rgba(255, 255, 255, 0.08);
    font-family: inherit;
    font-size: 16px;
    padding: 0 16px;
}

.form>input::placeholder {
    color: rgba(0, 0, 0, 0.38);
}

.form label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 6px 0 8px;
    color: rgb(0, 0, 0);
}

.form label input {
    scale: 0;
}

.form input:checked ~ .checkbox-wrapper .checkbox {
    transform: rotate(45deg);
    width: 14px;
    margin-left: 12px;
    margin-top: -2px;
    border-color: var(--color-primary, #007bff);
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
    border: 3px solid rgba(0, 0, 0, 0.18);
    border-radius: 6px;
    transition: all 0.375s;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.form > .button-container > button {
    border: 1px solid rgb(166, 165, 165);
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    width: 100%;
    color: white;
    background: linear-gradient(135deg, #007bff, #0056b3);
    border-radius: 13px;
    padding: 0.7rem 1.5rem;
    border: none;
    transition: all 0.5s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.form > .button-container > button:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.form > .button-container > button:active {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsivo */
@media (max-width: 600px) {
    .login-container {
        padding: 20px;
    }
    .card {
        width: 100%;
        max-width: 400px;
        padding: 40px 20px 30px;
        margin: 20px;
    }
    .card>h2 {
        font-size: 32px;
    }
    .card>h3 {
        font-size: 14px;
    }
    .form>input, .form > button {
        font-size: 14px;
        height: 48px;
    }
    .checkbox-wrapper {
        width: 24px;
        height: 24px;
    }
    .button-container {
        margin-top: 12px;
    }
}
@media(min-width: 601px) and (max-width: 1024px){
    .card {
        width: 60%;
        max-width: 600px;
        padding: 60px 40px 50px;
        margin: 20px;
    }
    .card>h2 {
        font-size: 36px;
    }
    .card>h3 {
        font-size: 15px;
    }
    .form>input, .form > button {
        font-size: 15px;
        height: 52px;
    }
    .checkbox-wrapper {
        width: 28px;
        height: 28px;
    }
    .button-container {
        margin-top: 14px;
    }
}
@media(min-width: 1025px){
    .card {
        width: 30%;
        max-width: 400px;
    }
}
</style>