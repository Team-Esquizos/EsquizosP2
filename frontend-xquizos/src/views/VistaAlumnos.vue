<template>
    <img src="../assets/fondogestor2.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
    <navBar />
    
    <div class="gestor-alumnos-container container my-5" style="opacity: 0.9;">
    
        <!-- Contenedor principal para el botón y el título -->
        <div class="header-container container my-5">
            <div class="d-flex align-items-center">
                <!-- Botón de retroceso a la izquierda -->
                <button class="btn btn-secondary back-button" @click="goBack">
                    <i class="fa-solid fa-circle-left"></i> Volver a los modulos
                </button>
                <button class="btn btn-primary" @click="GenerateExcel">Exportar Alumnos en Excel</button>
    
                <!-- Título centrado -->
                <h1 class="title" style="border-radius: 15px;">{{ nombreCurso }} -  {{ seccionCurso }}</h1>
            </div>
        </div>
    
    
        <div class="table-responsive" ref="tableContainer" style="border-radius: 15px; max-height: 300px; overflow-y: auto; position: relative;">
            <table class="table table-striped table-hover table-bordered text-center">
                <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
                    <tr>
                        <th>Foto</th>
                        <th>Nombre Completo</th>
                        <th>Rut</th>
                        <th>Fecha Nacimiento</th>
                        <th>Fecha Ingreso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="alumno in alumnos" :key="alumno.matricula">
                        <td class="align-middle">
                            <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" style="width: 50px; height: 50px;" />
                        </td>
                        <td class="align-middle">{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</td>
                        <td class="align-middle">{{ alumno.rut }}</td>
                        <td class="align-middle">{{ alumno.fecNac }}</td>
                        <td class="align-middle">{{ alumno.fecIng }}</td>
                        <td class="align-middle">
                            <!-- Botón de "más" más grande -->
                            <button type="button" class="btn btn-primary btn-sm mx-1" @click="toggleForm('add', alumno)">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <!-- Botón de vista de alumno -->
                            <button @click="goperfilalumno(alumno.matricula,alumno.nombres)" class="btn btn-sm btn-primary mx-1">
                                <i class="far fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Formulario modal -->
        <div v-if="formVisible" class="modal-overlay" @click.self="clearForm">
            <div class="modal-content">
            <form @submit.prevent="handleSubmit">
                <h3 class="text-center mb-4">Agregar Comentario</h3>

                <h1>{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</h1>
                <h2>{{ alumno.matricula }}</h2>

                <div class="flags-action-container">
                <div class="flags-container">
                    <flag 
                    :regularColor="'#00FF00'" 
                    :solidColor="'#006400'" 
                    :texto="'Buen comportamiento'" 
                    :checked="selectedFlag === 'buenComportamiento'"
                    @update:checked="updateSelectedFlag('buenComportamiento')"
                    v-model="newComment.flag"/>
                    <flag 
                    :regularColor="'#FFFF00'" 
                    :solidColor="'#FFD700'" 
                    :texto="'Advertencia'"
                    :checked="selectedFlag === 'advertencia'"
                    @update:checked="updateSelectedFlag('advertencia')" 
                    v-model="newComment.flag"/>
                    <flag 
                    :regularColor="'#FF0000'" 
                    :solidColor="'#8B0000'" 
                    :texto="'Mal comportamiento'" 
                    :checked="selectedFlag === 'malComportamiento'"
                    @update:checked="updateSelectedFlag('malComportamiento')"
                    v-model="newComment.flag"/>
                </div>
                <div class="action-value-container">
                    <Slide v-model="newComment.peso"/>
                    <p>Peso seleccionado: {{ newComment.peso }}</p>
                </div>
                </div>

                <div class="comment-container">
                <label for="comentario" >Comentario</label>
                <textarea id="comentario" v-model="newComment.comentario" class="form-control" placeholder="Escribe tu comentario aquí..." rows="4"></textarea>
                </div>

                <div class="d-flex justify-content-between mt-4">
                <button type="submit" class="btn btn-success" @click="addComment">Agregar comentario</button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
                </div>
            </form>
            </div>
        </div>
    </div>
</template>
    
    <script>
    import axios from 'axios';
    import navBar from '@/components/AppNavbarAdm.vue';
    import flag from '@/components/Flag.vue';
    import autenticadorSesion from '../mixins/AutenticadorSesion.js';
    import Slide from '@/components/Slide.vue';
    import * as XLSX from 'xlsx';

    export default {
        name: 'VistaAlumnos',
        mixins: [autenticadorSesion],
        props: ['nombreCurso, seccionCurso, codigo, periodo'], 
        mounted() {
        console.log(this.$route.params.nombreCurso);
        },
        components: {
            navBar,
            flag,
            Slide
        },
        computed: {
            userRole() {
            const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
            return isAdmin === 'true' ? 'Administrador' : 'Docente';
            },
            // Computed property para verificar si el usuario es admin
            isAdmin() {
            return localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
            }
        },
        data() {
            return {
                nombreCurso: '',
                seccionCurso: '',
                alumnos: [],
                alumno: {
                    nombres: '',
                    apellidoP: '',
                    apellidoM: '',
                    rut: '',
                    matricula: '',
                    fecNac: '',
                    fecIng: '',
                },
                newComment: {
                    matricula: '',
                    codDocente: '',
                    comentario: '',
                    peso: 0,
                    flag: '',
                },
                formVisible: false,
                isEditMode: false,
                selectedFlag: null, // Controla la flag seleccionada
                formFields: {
                    nombres: 'Nombres',
                    apellidoP: 'Apellido Paterno',
                    apellidoM: 'Apellido Materno',
                    rut: 'Rut',
                    matricula: 'Matricula',
                    fecNac: 'Fecha Nacimiento',
                    fecIng: 'Fecha Ingreso',
                },
                requiredFields: ['nombrePrimer', 'apellidoP', 'rut', 'matricula', 'fecNac', 'fecIng'],
                
            };
            
        },
        created() {
            this.nombreCurso = this.$route.params.nombreCurso || 'Sin nombre';
            this.seccionCurso = this.$route.params.seccionCurso || 'Sin sección';
            this.codigo = this.$route.params.codigo || 'Sin sección';
            this.periodo = this.$route.params.periodo || 'Sin sección';
            this.fetchAlumnos();
        },
        methods: {
            goperfilalumno(matricula, nombrePrimer) {
                console.log('Datos enviados:', matricula, nombrePrimer); // Debug para confirmar los valores
                this.$router.push({
                    name: 'PerfilAlumno',
                    params: {
                        matriculaalum: matricula,
                        nombrealum: nombrePrimer
                    }
                });
            },
            async addComment() {
                try {
                    this.newComment.matricula = this.alumno.matricula;
                    this.newComment.codDocente = localStorage.getItem('rut') || sessionStorage.getItem('rut');

                    await axios.post('http://localhost:3333/api/comments/add', this.newComment);
                    this.newComment = {};
                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            },
            goBack() {
                this.$router.push({
                    name: 'VistaDocente'
                });
            },
            async fetchAlumnos() {
                console.log(this.codigo, this.periodo)
                try {
                    const response = await axios.get(`http://localhost:3333/api/courseInstance/get/students/${this.codigo}/${this.periodo}`);
                    if (response.data.status) {
                    this.alumnos = response.data.students;
                    } else {
                    console.error(response.data.msg);
                    }
                } catch (error) {
                    console.error("Error al obtener alumnos:", error);
                }
            },
            toggleForm(mode, alumno = {}) {
                this.isEditMode = mode === 'edit';
                this.alumno = { ...alumno, valorAccion: '', comentario: '' };
                this.formVisible = true;
                this.selectedFlag = null;
            },
            handleSubmit() {
                console.log('Comentario agregado:', this.alumno);
                this.clearForm();
            },
            async addAlumno() {
                try {
                    await axios.post('http://localhost:3333/api/student/register', this.alumno);
                    this.fetchAlumnos();
                } catch (error) {
                    console.error('Error al agregar alumno:', error);
                }
            },
            async updateAlumno() {
                try {
                    await axios.put(`http://localhost:3333/api/student/${this.alumno.matricula}`, this.alumno);
                    this.fetchAlumnos();
                } catch (error) {
                    console.error('Error al actualizar alumno:', error);
                }
            },
            clearForm() {
                this.formVisible = false;
                this.selectedFlag = null; 
            },
            
    
            triggerFileInput() {
                this.$refs.fileInput.click();
            },
    
            handleAddFile() {
                this.$refs.fileInput.click();
            },
    
            onFileSelected(event) {
                this.selectedFile = event.target.files[0];
                //this.uploadFile();
                this.uploadAlumnoFile(); // Llama a la nueva función para enviar el archivo a importCurso
            },
    
            async uploadAlumnoFile() {
                console.log('Subir archivo de curso');
                if (!this.selectedFile) {
                    this.message = "Por favor, selecciona un archivo primero.";
                    return;
                }
    
                const formData = new FormData();
                formData.append('file', this.selectedFile);
    
                try {
                    const response = await axios.post('http://localhost:3333/csv/importEstudiante', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
    
                    });
                    this.message = response.data.message;
    
                    if (response.data.success) {
                        this.fetchAlumnos();
                    } else {
                        console.error('Error en el archivo:', response.data.message);
                    }
    
                } catch (error) {
                    console.error('Error al subir el archivo de curso:', error);
                }
            },
            mounted() {
                const nombreCurso = this.$route.params.nombre; 
                console.log(nombreCurso); 
            },
            updateSelectedFlag(flag) {
                this.selectedFlag = flag;
                this.newComment.flag = flag;
            },
            async GenerateExcel() {
                const camposExcluidos = ['_id', 'lista_de_acciones', '__v'];
                const filteredData = this.alumnos.map(obj =>
                    Object.fromEntries(Object.entries(obj).filter(([key]) => !camposExcluidos.includes(key)))
                );
                const ws = XLSX.utils.json_to_sheet(filteredData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
                
                const nombrearchivo = 'ALUMNOS DE '+this.nombreCurso+'.xlsx';
                XLSX.writeFile(wb, nombrearchivo);
            },
        }
    };
    </script>
    
    <style scoped>
    .gestor-alumnos-container {
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
    