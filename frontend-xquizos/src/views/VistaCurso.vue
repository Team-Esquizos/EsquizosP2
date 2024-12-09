<template>

    
    <!-- Contenedor de la tarjeta -->
    <div>
      <navBar />
      <div class="maincontent">
        <div class="gestor-docentes-container">
        <div class="container mt-4">
            <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg border-0">
                <!-- Encabezado de la tarjeta -->
                <div class="card-header bg-primary text-white text-center">
                    <h4 class="mb-0">
                    <i class="bi bi-journal-bookmark-fill me-2"></i>
                    {{ nombre }} // SECCIÓN {{ seccion }}
                    </h4>
                </div>
                <!-- Cuerpo de la tarjeta -->
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
    </div>
    </div>
  </template>
  
  <script>
  import navBar from "@/components/AppNavbarAdm.vue";
  
  export default {
    name: "VistaCurso",
    components: { navBar },
    props: ["nombre", "seccion", "semestre", "codCurso"],
    data() {
      return {
        aprendizajes: []
      };
    },
  };
  </script>
  
  <style scoped>
.maincontent {
    background-color: var(--background);
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow-x: hidden;
}

.gestor-docentes-container {
    max-width: 1200px;
    width: 100%;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
    position: relative;
}

.back-button {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    padding: 10px 20px;
    margin-right: 20px;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    color: #333;
}

.back-button:hover {
    background-color: #e2e6ea;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #333;
}

.title {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    padding: 15px;
    border: 2px solid #eaeaea;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
    padding: 10px;
    border-bottom: 3px solid #3498db;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.section-title h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.table-container {
    overflow-x: auto;
    border-radius: 10px;
}

.table {
    border-radius: 10px;
    overflow: hidden;
}

.table td,
.table th {
    vertical-align: middle;
    padding: 10px;
}

.img-fluid.rounded-circle {
    width: 50px;
    height: 50px;
    object-fit: cover;
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
}
.modal-lower {
  margin-top: 150px; /* Ajusta este valor según lo que necesites */
}
.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
}

body {
    background-size: cover;
    background-attachment: fixed;
}

html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}
.card {
  display: grid;
  
  width: 100%  ;
  margin-top: 3vw;
    margin-bottom: 1vw;
    margin: 0;
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
  