<template>
  <div class="estadistica-container">
    <navBar/>
    <div class="content">
      <div class="transparent-box">
        <h1 class="titulo">Estadísticas</h1>
        <div class="charts-and-stats">
          <div class="chart">
            <h2>Pesos por Periodo</h2>
            <canvas ref="barChart"></canvas>
          </div>
          <div class="statistics-box">
            <h3>Estadísticas</h3>
            <p> Según los datos recolectados del estudiante durante el periodo seleccionado, se ha determinado un "Estado de comportamiento" basado en los pesos de los comentarios que ha recibido por parte de l@s docentes.</p>
            <p>Estado del Estudiante: {{ studentStatus }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/AppNavbarAdm.vue';
import axios from 'axios';
import { 
  Chart, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Registra los controladores y elementos necesarios
Chart.register(
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend
);

export default {
  name: 'VistaEstadisticas',
  components: {
    navBar
  },
  props: ['matricula', 'periodo', 'codCurso'],
  
  data() {
    return {
      barChart: null,
      labels: [],
      positiveWeights: [],
      negativeWeights: [],
      studentStatus: ''
    };
  },
  methods: {
    async fetchComments(matricula, periodo, codCurso) {
      try {
        const response = await axios.get(`http://localhost:3333/api/comments/getFromMatricula/${matricula}/${codCurso}/${periodo}`);
        const comments = response.data.comments;
        console.log('Comentarios obtenidos:', comments);

        // Filtrar los pesos positivos y negativos
        const positiveWeights = comments.filter(comment => comment.peso > 0).map(comment => comment.peso);
        const negativeWeights = comments.filter(comment => comment.peso < 0).map(comment => comment.peso);

        // Sumar los pesos
        const totalPositiveWeight = positiveWeights.reduce((sum, peso) => sum + peso, 0);
        const totalNegativeWeight = negativeWeights.reduce((sum, peso) => sum + peso, 0);

        // Preparar datos para el gráfico
        this.labels = [periodo];
        this.positiveWeights = [totalPositiveWeight];
        this.negativeWeights = [totalNegativeWeight];

        this.calculateStatistics();
        this.renderBarChart();
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    },
    calculateStatistics() {
      const totalPositiveWeights = this.positiveWeights.reduce((a, b) => a + b, 0);
      const totalNegativeWeights = this.negativeWeights.reduce((a, b) => a + b, 0);

      if (totalNegativeWeights === 0) {
        this.studentStatus = 'excelente estudiante';
      } else if (totalPositiveWeights > Math.abs(totalNegativeWeights)) {
        this.studentStatus = 'buen estudiante';
      } else if (Math.abs(totalNegativeWeights) > totalPositiveWeights) {
        const difference = Math.abs(totalNegativeWeights) - totalPositiveWeights;
        if (difference < 3) {
          this.studentStatus = 'estudiante regular';
        } else {
          this.studentStatus = 'mal estudiante';
        }
      } else {
        this.studentStatus = 'estudiante regular';
      }
    },
    renderBarChart() {
      if (this.barChart) {
        this.barChart.destroy();
      }

      this.barChart = new Chart(this.$refs.barChart, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Pesos Positivos',
              data: this.positiveWeights,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Pesos Negativos',
              data: this.negativeWeights.map(value => Math.abs(value)), // Convertir a positivo para apilar
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Pesos por Periodo' }
          },
          scales: {
            x: { 
              stacked: true,
              title: {
                display: true,
                text: 'Periodos'
              }
            },
            y: { 
              stacked: true,
              title: {
                display: true,
                text: 'Pesos'
              }
            }
          }
        }
      });
    },
  },
  mounted() {
    this.fetchComments(this.matricula, this.periodo, this.codCurso);
  }
};
</script>

<style scoped>
.estadistica-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  background-color: var(--background);
  width: 100vw; /* Ocupa todo el ancho de la ventana */
  height: calc(100vh - 80px);
  overflow: hidden; /* Evita que el contenido se desborde */
}

.content {
  margin-top: 100px; /* Ajusta este valor según la altura de tu navbar */
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px); /* Ajusta la altura del contenido */
  width: 100%;
} 

.transparent-box {
  background-color: var(--background);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 90vw;
  height: 80vh;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Alinea el contenido hacia arriba */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.charts-and-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px; /* Espacio entre el gráfico y el cuadro de estadísticas */
}

.chart {
  width: 50%; /* Ajusta el ancho del gráfico */
  min-width: 250px;
  background-color: rgba(255, 255, 255, 0.9); /* Aumenta la opacidad */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.statistics-box {
  width: 35%;
  min-width: 250px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  text-align: center;
  height: 100%;
}

.statistics-box h3 {
  margin-top: 40px;
  margin-bottom: 100px;
  font-size: 2.0rem; /* Aumenta el tamaño de la fuente del título */
}

.statistics-box p {
  font-size: 1.5rem; /* Aumenta el tamaño de la fuente del texto */
  justify-content: center;
}

@media (max-width: 768px) {
  .charts-and-stats {
    flex-direction: column;
    align-items: center;
  }

  .chart, .statistics-box {
    width: 80%;
  }
}

.titulo {
  font-size: 3rem; /* Aumenta el tamaño de la fuente */
  font-weight: bold;
  color: #2c3e50;
  padding: 20px 30px;
  border: 3px solid #eaeaea;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin-top: 2vh;
  margin-bottom: 4vh;
  transition: transform 0.3s, box-shadow 0.3s;
}

.titulo:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.3);
}
</style>