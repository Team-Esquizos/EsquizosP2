export default {
    created() {
        if (!localStorage.getItem('email') && !sessionStorage.getItem('email')) {
            this.$router.push('/');
        }
    }
};