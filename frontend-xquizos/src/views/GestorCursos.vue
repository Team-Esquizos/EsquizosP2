<template>
<img src="../assets/fondogestor2.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
<navBar />

<div class="gestor-cursos-container container my-5" style="opacity: 0.9;">

    <!-- Contenedor principal para el botón y el título -->
    <div class="header-container container my-5">
        <div class="d-flex align-items-center">
            <!-- Botón de retroceso a la izquierda -->
            <button class="btn btn-secondary back-button" @click="goBack">
                <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
            </button>

            <!-- Título centrado -->
            <h1 class="title" style="border-radius: 15px;">Gestor de Cursos</h1>
        </div>
    </div>

    <!-- Modal del formulario para agregar/editar alumno -->
    <div v-if="formVisible" class="modal-overlay" @click.self="clearForm">
        <div class="modal-content">
            <form @submit.prevent="handleSubmit">
                <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Curso' : 'Agregar Curso' }}</h3>

                <!-- Campos del formulario -->
                <div class="form-group mb-3" v-for="(label, key) in formFields" :key="key">
                    <label :for="key">{{ label }}</label>
                    <input type="text" :id="key" v-model="curso[key]" class="form-control" :required="requiredFields.includes(key)" />
                </div>

                <!-- Botones de acción -->
                <div class="d-flex justify-content-between mt-4">
                    <button type="submit" class="btn btn-success">{{ isEditMode ? 'Actualizar' : 'Agregar' }}</button>
                    <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Lista de alumnos con el botón Agregar Alumno a la derecha del título -->
    <div class="d-flex align-items-center justify-content-between section-title mb-4">
        <h3 style="border-radius: 15px;">Lista de Cursos</h3>
        <div class="d-flex">
            <button class="btn btn-primary" @click="toggleForm('add')"><i class="fa-solid fa-user-plus"></i> Agregar Curso</button>
            <!-- Botón de importar CSV -->
            <div class="ms-2">
                <div>
                <input type="file" ref="fileInput" @change="onFileModulos" style="display: none;" accept=".xlsx" />
                <button class="btn btn-success" @click="triggerFileInput">
                    
                    <i class="fa-solid fa-file-"></i> Importar Modulos por excel
                </button>
                </div>
            </div>
            <div class="ms-2">
                <button class="btn btn-success" @click="GenerarExcel">
                    <i class="fa-solid fa-file-"></i> Exportar Cursos por excel
                </button>
            </div>

        </div>
    </div>

    <div class="table-responsive" ref="tableContainer" style="border-radius: 15px; ">
        <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
                <tr>
                    <th>Código</th>
                    <th>Carrera</th>
                    <th>Nombre</th>
                    <th>Semestre</th>
                    <th>Sección</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="curso in cursos" :key="curso.nombre + '-' + curso.seccion">
                    <td class="align-middle">{{ curso.codigo }}</td>
                    <td class="align-middle">{{ curso.carrera }}</td>
                    <td class="align-middle">{{ curso.nombre }}</td>
                    <td class="align-middle">{{ curso.semestre }}</td>
                    <td class="align-middle">{{ curso.seccion }}</td>
                    <td class="align-middle">
                        <button @click="viewCurso(curso)" class="btn btn-sm btn-primary mx-1">
                            <i class="far fa-eye"></i>
                        </button>
                        <button @click="toggleForm('edit', curso)" class="btn btn-sm btn-info mx-1">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button @click="deleteCurso(curso.nombre, curso.seccion)" class="btn btn-sm btn-danger mx-1">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import navBar from '@/components/AppNavbarAdm.vue';
import autenticadorSesion from '../mixins/AutenticadorSesion.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default {
    name: 'GestorCursos',
    mixins: [autenticadorSesion],
    components: {
        navBar
    },
    data() {
        return {
            cursos: [],
            curso: {
                codigo: '',
                carrera: '',
                nombre: '',
                semestre: '',
                seccion: ''
            },
            formVisible: false,
            isEditMode: false,
            formFields: {
                codigo: 'Código del curso',
                carrera: 'Carrera',
                nombre: 'Nombre Curso',
                semestre: 'Semestre',
                seccion: 'Sección'
            },
            requiredFields: ['codigo', 'carrera', 'nombre', 'semestre', 'seccion']
        };
    },
    created() {
        this.fetchCursos();
    },
    methods: {
        goBack() {
            this.$router.push({
                name: 'VistaAdministrador'
            });
        },

        async fetchCursos() {
            try {
                const response = await axios.get('http://localhost:3333/api/courses/get');
                this.cursos = response.data;
            } catch (error) {
                console.error('Error al obtener cursos:', error);
            }
        },
        toggleForm(mode, curso = {}) {
            this.isEditMode = mode === 'edit';
            this.curso = {
                ...curso
            };
            this.formVisible = !this.formVisible;
        },

        async handleSubmit() {
            if (this.isEditMode) {
                await this.updateCurso();
            } else {
                await this.addCurso();
            }
            this.clearForm();
        },

        async addCurso() {
            try {
                await axios.post('http://localhost:3333/api/courses/register', this.curso);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Curso agregado exitosamente.',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        // Código 409: Duplicado
                        Swal.fire({
                            icon: 'warning',
                            title: 'Registro duplicado',
                            text: 'El Curso ya está registrado. Verifica los datos.',
                            confirmButtonText: 'Entendido'
                        })
                    } else {
                        // Otros errores con respuesta del servidor
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response.data.message || 'Ocurrió un problema al agregar el Curso.',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                } else {
                    // Error sin respuesta del servidor (problemas de red, etc.)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar al servidor. Intenta nuevamente.',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        },
    
        async updateCurso() {
            try {
                await axios.put(`http://localhost:3333/api/courses/${this.curso.codigo}`, this.curso);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Curso actualizado exitosamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor  : '#2ecc71'
                });
            } catch (error) {
                console.error('Error al actualizar Curso:', error);
            }
        },
        async deleteCurso(nombre, seccion) {
            try {
                await axios.delete(`http://localhost:3333/api/courses/remove/${encodeURIComponent(nombre)}/${seccion}`);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Curso eliminado exitosamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor  : '#2ecc71'
                });
            } catch (error) {
                console.error('Error al eliminar Curso:', error);
            }
        },
        clearForm() {
            this.curso = {
                nombre: '',
                seccion: '',
                area: '',
                docente: ''
            };
            this.formVisible = false;
        },

        triggerFileInput() {
            console.log('Trigger file input');
            this.$refs.fileInput.click();
        },

        handleAddFile() {
            this.$refs.fileInput.click();
        },

        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
            //this.uploadFile();
            this.uploadCursoFile(); // Llama a la nueva función para enviar el archivo a importCurso
        },
       
        onFileModulos(event) {
            this.selectedFile = event.target.files[0];
            //this.uploadFile();
            this.uploadModulosFile(); // Llama a la nueva función para enviar el archivo a importCurso
        },

        async uploadModulosFile() {
            console.log('Subir archivo de curso');
            if (!this.selectedFile) {
                this.message = "Por favor, selecciona un archivo primero.";
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                const response = await axios.post('http://localhost:3333/csv/importModulos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });
                this.message = response.data.message;

                if (response.data.success) {
                    this.fetchCursos();
                } else {
                    console.error('Error en el archivo:', response.data.message);
                }

            } catch (error) {
                console.error('Error al subir el archivo de curso:', error);
            }
        },
        async GenerarExcel() {
            try {
                const response = await axios.get('http://localhost:3333/api/courses/get');
        
                // Asegúrate de que response.data tenga los datos en formato JSON
                const data = response.data;

                // Convertir los datos a una hoja de cálculo
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

                // Exportar el archivo Excel
                XLSX.writeFile(workbook, 'Cursos.xlsx');
            } catch (error) {
                console.error('Error al generar el Excel:', error);
            }
        },

        
    },
}
</script>

<style scoped>
.gestor-cursos-container {
    padding-top: 30px;
    padding-bottom: 50px;
}

.d-flex {
    justify-content: left;
}

.back-button {
    margin-right: 20px;
}

.title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2c3e50;
    padding: 15px;
    border: 2px solid #eaeaea;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    flex-grow: 1;
    /* Permite al título ocupar el espacio restante */
}

.section-title h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #34495e;
    padding: 10px;
    margin-bottom: 0;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.section-title h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #34495e;
    padding: 10px;
    border-bottom: 3px solid #3498db;
    margin-bottom: 20px;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.table td,
.table th {
    vertical-align: middle;
}

.img-fluid.rounded-circle {
    width: 50px;
    height: 50px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
}
</style>
