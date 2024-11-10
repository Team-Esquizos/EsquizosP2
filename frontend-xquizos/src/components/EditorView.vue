<!-- Editor.vue -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <h1>Gestión de Alumnos y Cursos</h1>
        
        <div>
            <h2>Alumnos</h2>
            <input v-model="newStudent" placeholder="Agregar nuevo alumno" />
            <button @click="addStudent">Agregar Alumno</button>
            <ul>
                <li v-for="(student, index) in students" :key="index">
                    {{ student }}
                    <button @click="removeStudent(index)">Eliminar</button>
                </li>
            </ul>
        </div>

        <div>
            <h2>Cursos</h2>
            <input v-model="newCourse" placeholder="Agregar nuevo curso" />
            <button @click="addCourse">Agregar Curso</button>
            <ul>
                <li v-for="(course, index) in courses" :key="index">
                    {{ course }}
                    <button @click="removeCourse(index)">Eliminar</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newStudent: '',
            students: [],
            newCourse: '',
            courses: []
        };
    },
    methods: {
        addStudent() {
            if (this.newStudent.trim() !== '') {
                this.students.push(this.newStudent);
                this.newStudent = '';
            }
        },
        removeStudent(index) {
            this.students.splice(index, 1);
        },
        addCourse() {
            if (this.newCourse.trim() !== '') {
                this.courses.push(this.newCourse);
                this.newCourse = '';
            }
        },
        removeCourse(index) {
            this.courses.splice(index, 1);
        }
    }
};
</script>

<style scoped>
h1, h2 {
    font-family: Arial, sans-serif;
}
input {
    margin-right: 10px;
}
button {
    margin-left: 10px;
}
</style>