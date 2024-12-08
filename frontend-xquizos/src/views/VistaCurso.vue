<template>
<img src="../assets/fondogestor2.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
    <div>
    <navBar />
    <div class="container mt-4">
        <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center">
                <h4 class="mb-0">
                <i class="bi bi-journal-bookmark-fill me-2"></i>
                {{ nombre }} // SECCIÓN {{ seccion }}
                </h4>
            </div>
            <div class="card-body">
                <h5 class="card-title text-center text-secondary">
                <i class="bi bi-calendar-event me-1"></i>
                Semestre dictado: {{ semestre }}
                </h5>
                <ul class="list-group list-group-flush mt-4">
                <li class="list-group-item">
                    <i class="bi bi-code me-2 text-primary"></i>
                    <strong>Código del Curso:</strong> {{ codCurso }}
                </li>
                </ul>
            </div>
            </div>
        </div>
        </div>
        </div>
        </div>

</template>

    
    
<script>
import navBar from "@/components/AppNavbarAdm.vue";
//import axios from "axios";

export default {
    name: "VistaCurso",
    components: { navBar },
    props: ["nombre", "seccion", "semestre", "codCurso"],
    data() {
        return {
            aprendizajes: []
        };
    },
    /*async created() {
        try {
            console.log("Curso RECIBIDO: ", this.codCurso);
            const learning = await axios.get("http://localhost:3333/api/teaching/get");
            console.log("DATOS RECIBIDOS: ", learning);
            this.aprendizajes = learning.data;

            
        } catch (error) {
            console.error("Error al obtener aprendizajes:", error);
        }

        this.fetchAprendizajes(); 
    },
    methods: {
        async fetchAprendizajes() {
            try {
            const response = await axios.get(`http://localhost:3333/api/courseInstance/get/students/${this.codCurso}/${this.periodo}`);
            if (response.data.status) {
                this.alumnos = response.data.students;
            } else {
                console.error(response.data.msg);
            }
            } catch (error) {
            console.error("Error al obtener alumnos:", error);
            }
        },
    },
    */
};
</script>


<style scoped>
.card {
    margin-top: 3vw;
    margin-bottom: 1vw;
}

.card-header {
    background: linear-gradient(45deg, #007bff, #4facfe);
}

.card-header h4 {
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.card-title {
    font-weight: 600;
}

.list-group-item {
    font-size: 1rem;
}

.list-group-item.selected {
    background-color: #007bff;
    color: white;
}

.btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
}

.btn-outline-danger:hover {
    background-color: #dc3545;
    color: #fff;
}

.card-footer {
    font-size: 0.85rem;
}

.text-primary {
    color: #007bff !important;
}

.text-center {
    text-align: center !important;
}

.text-danger {
    color: #dc3545;
}

.table td,
.table th {
    vertical-align: middle;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
}

.suggestion-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #ddd;
    background: #fff;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    z-index: 1000;
}

.suggestion-list li {
    padding: 10px;
    cursor: pointer;
}

.suggestion-list li:hover {
    background-color: #007bff;
    color: white;
}

</style>