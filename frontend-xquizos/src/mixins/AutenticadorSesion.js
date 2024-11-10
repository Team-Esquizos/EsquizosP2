export default {
    mounted() {
        if (!localStorage.getItem('user') && !sessionStorage.getItem('user')) {
            this.$router.push({ name: 'Login' });
        }
    }
};