<template>
<div class="student-profile">
    <h1>Student Profile</h1>
    <div class="student-info">
        <p><strong>Name:</strong> {{ nombrealum }}</p>
        <p><strong>Matricula:</strong> {{ matriculaalum }}</p>
    </div>
</div>
</template>

<script>
export default {
    name: 'PerfilAlumno',
    props: ['matriculaalum', 'nombrealum'], // Declarar correctamente las props
    created() {
        console.log('matriculaalum:', this.matriculaalum);
        console.log('nombrealum:', this.nombrealum);
    },
};
</script>

<style scoped>
.student-profile {
    padding: 20px;
}

.student-info {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

.student-info p {
    margin: 5px 0;
}
</style>
