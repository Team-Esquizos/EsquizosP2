<!-- Editor.vue -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="container">
        <h1>Gestión de Alumnos y Cursos</h1>

        <div class="section">
            <h2>Alumnos</h2>
            <div class="input-group">
                <input v-model="newStudent" placeholder="Agregar nuevo alumno" />
                <button @click="addStudent">Agregar Alumno</button>
            </div>
            <ul>
                <li v-for="(student, index) in students" :key="index">
                    {{ student }}
                    <button class="delete-button" @click="removeStudent(index)">Eliminar</button>
                </li>
            </ul>
        </div>

        <div class="section">
            <h2>Cursos</h2>
            <div class="input-group">
                <input v-model="newCourse" placeholder="Agregar nuevo curso" />
                <button @click="addCourse">Agregar Curso</button>
            </div>
            <ul>
                <li v-for="(course, index) in courses" :key="index">
                    {{ course }}
                    <button class="delete-button" @click="removeCourse(index)">Eliminar</button>
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
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.section {
    margin-bottom: 30px;
}

h2 {
    color: #555;
    margin-bottom: 10px;
}

.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.delete-button {
    background-color: #dc3545;
}

.delete-button:hover {
    background-color: #c82333;
}
</style>
