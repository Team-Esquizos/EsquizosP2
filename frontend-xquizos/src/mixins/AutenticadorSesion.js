export default {
    created() {
        if (!localStorage.getItem('email') && !sessionStorage.getItem('email')) {
            this.$router.push('/');
        }
    },
    methods: {
        goBack() {
          if (window.history.length > 1) {
            this.$router.go(-1); // Vuelve a la página anterior
          } else {
            this.$router.push('/'); // Redirige al inicio si no hay historial
          }
        },
    },
};