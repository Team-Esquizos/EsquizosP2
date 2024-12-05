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
            <h1 class="title" style="border-radius: 15px;">Gestor de Cursos Periodo</h1>
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
                    <input type="text" :id="key" v-model="cursoPeriodo[key]" class="form-control" :required="requiredFields.includes(key)" />
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
        <h3 style="border-radius: 15px;">Lista de Cursos Periodo</h3>
        <div class="d-flex">
            <button class="btn btn-primary" @click="toggleForm('add')"><i class="fa-solid fa-user-plus"></i> Agregar Curso</button>
            <!-- Botón de importar CSV -->
            <div class="ms-2">
                <input type="file" ref="fileInput" @change="onFileCurso" style="display: none;" accept=".csv" />
                <button class="btn btn-success" @click="triggerFileInput">
                    <i class="fa-solid fa-file-csv"></i> Importar desde CSV
                </button>

            </div>
            
        </div>
    </div>

    <div class="table-responsive" ref="tableContainer" style="border-radius: 15px; max-height: 300px; overflow-y: auto; position: relative;">
        <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
                <tr>
                    <th>Código curso</th>
                    <th>Rut del docente</th>
                    <th>Nombre</th>
                    <th>Sección</th>
                    <th>Semestre</th>
                    <th>Periodo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cursoPeriodo in cursosPeriodo" :key="cursoPeriodo.course[0]?.nombre + cursoPeriodo.course[0]?.seccion + cursoPeriodo.course[0]?.semestre">
                    <td class="align-middle">{{ cursoPeriodo.codCurso }}</td>
                    <td class="align-middle">{{ cursoPeriodo.codDocente }}</td>
                    <td class="align-middle">{{ cursoPeriodo.course[0]?.nombre }}</td>
                    <td class="align-middle">{{ cursoPeriodo.course[0]?.seccion }}</td>
                    <td class="align-middle">{{ cursoPeriodo.course[0]?.semestre }}</td>
                    <td class="align-middle">{{ cursoPeriodo.periodo }}</td>
                    <td class="align-middle">
                        <button @click="viewCurso(cursoPeriodo)" class="btn btn-sm btn-primary mx-1">
                            <i class="far fa-eye"></i>
                        </button>
                        <button @click="deleteCurso(cursoPeriodo.codCurso)" class="btn btn-sm btn-danger mx-1">
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

export default {
    name: 'GestorCursosPeriodo',
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
            cursoPeriodo: {
                codCurso: '',
                codDocente: '',
                alumnos: '',
                periodo: '',
            },
            cursosPeriodo: [],
            formVisible: false,
            isEditMode: false,
            formFields: {
                codCurso: 'Código del curso',
                codDocente: 'Rut del docente (opcional)',
                periodo: 'Año',
            },
            requiredFields: ['codCurso','periodo']
        };
    },
    created() {
        this.fetchCursos();
    },
    methods: {
        viewCurso(cursoPeriodo){
            console.log(cursoPeriodo.codCurso);
            this.$router.push({
                name: 'CursoPeriodo',
                params: {
                    nombre: cursoPeriodo.course[0].nombre,
                    seccion: cursoPeriodo.course[0].seccion,
                    semestre: cursoPeriodo.course[0].semestre,
                    codCurso: cursoPeriodo.codCurso,
                    periodo: cursoPeriodo.periodo
                }
            });
        },  
        goBack() {
            this.$router.push({
                name: 'VistaAdministrador'
            });
        },

        async fetchCursos() {
            try {
                const response = await axios.get('http://localhost:3333/api/courseInstance/get');
                this.cursosPeriodo = response.data.courseInstances;
                console.log(this.cursosPeriodo);
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
                await axios.post('http://localhost:3333/api/courseInstance/register', this.cursoPeriodo);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: 'Curso agregado',
                    text: 'El curso se ha agregado correctamente.',
                    confirmButton: 'Aceptar',
                    confirmButtonColor: '#3498db'
                });
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Curso duplicado',
                        text: 'El curso ya existe en el sistema.',
                        confirmButton: 'Aceptar',
                    confirmButtonColor: '#3498db'
                    });
                } else {
                    console.error('Error al agregar curso:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al agregar curso',
                        text: 'Ha ocurrido un error al agregar el curso.',
                        confirmButton: 'Aceptar',
                        confirmButtonColor: '#3498db'
                    });
                }
            }
        },
        async updateCurso() {
            try {
                await axios.put(`http://localhost:3333/api/courseInstance/update/${this.curso.codigo}`, this.curso);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: 'Curso actualizado',
                    text: 'El curso se ha actualizado correctamente.',
                    confirmButton: 'Aceptar',
                    confirmButtonColor: '#3498db'
                });
            } catch (error) {
                console.error('Error al actualizar Curso:', error);
            }
        },
        async deleteCurso(codCurso) {
            try {
                await axios.delete(`http://localhost:3333/api/courseInstance/remove/${codCurso}`);
                this.fetchCursos();
                Swal.fire({
                    icon: 'success',
                    title: 'Curso eliminado',
                    text: 'El curso se ha eliminado correctamente.',
                    confirmButton: 'Aceptar',
                    confirmButtonColor: '#3498db'
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
            this.$refs.fileInput.click();
        },

        handleAddFile() {
            this.$refs.fileInput.click();
        },
        onFileCurso(event) {
            this.selectedFile = event.target.files[0];
            //this.uploadFile();
            this.uploadCursoFile(); // Llama a la nueva función para enviar el archivo a importCurso
        },
        async uploadCursoFile() {
            console.log('Subir archivo de curso');
            if (!this.selectedFile) {
                this.message = "Por favor, selecciona un archivo primero.";
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                
                const response = await axios.post('http://localhost:3333/csv/importCurso', formData, {
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
    }
};
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
