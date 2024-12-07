<template>
  <div class="estadistica-container">
    <navBar/>
    <div class="content">
      <div class="transparent-box">
          <h1 class="titulo">Estadísticas</h1>
        <div class="charts-container">
          <div class="chart">
            <h2>Gráfico de Barras Apiladas</h2>
            <canvas ref="barChart"></canvas>
          </div>
          <div class="chart">
            <h2>Gráfico Circular</h2>
            <canvas ref="pieChart"></canvas>
          </div>
          <div class="chart">
            <h2>Gráfico de Puntos</h2>
            <canvas ref="scatterChart"></canvas>
          </div>
        </div>
        <div class="statistics-box">
          <h3>Estadísticas</h3>
          <p>Promedio: {{ average }}</p>
          <p>Moda: {{ mode }}</p>
          <p>Desviación Estándar: {{ standardDeviation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/AppNavbarAdm.vue';
import { 
Chart, 
BarController, 
BarElement, 
PieController, 
ArcElement, 
ScatterController, 
PointElement,
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
PieController, 
ArcElement, 
ScatterController, 
PointElement,
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
data() {
  return {
    barChart: null,
    pieChart: null,
    scatterChart: null,
    dataValues: [12, 19, 3, 5, 2, 3], // Reemplaza con tus datos reales
    average: 0,
    mode: '',
    standardDeviation: 0
  };
},
methods: {
  calculateStatistics() {
    // Promedio
    const sum = this.dataValues.reduce((a, b) => a + b, 0);
    this.average = (sum / this.dataValues.length).toFixed(2);

    // Moda
    const frequency = {};
    let maxFreq = 0;
    let mode = [];
    this.dataValues.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
      }
    });
    for (const key in frequency) {
      if (frequency[key] === maxFreq) {
        mode.push(key);
      }
    }
    this.mode = mode.join(', ');

    // Desviación Estándar
    const mean = sum / this.dataValues.length;
    const sqDiff = this.dataValues.map(value => Math.pow(value - mean, 2));
    const avgSqDiff = sqDiff.reduce((a, b) => a + b, 0) / this.dataValues.length;
    this.standardDeviation = Math.sqrt(avgSqDiff).toFixed(2);
  },
  renderBarChart() {
    this.barChart = new Chart(this.$refs.barChart, {
      type: 'bar',
      data: {
        labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Morado', 'Naranja'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Dataset 2',
            data: [5, 10, 15, 20, 25, 30],
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
          title: { display: true, text: 'Gráfico de Barras Apiladas' }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  },
  renderPieChart() {
    this.pieChart = new Chart(this.$refs.pieChart, {
      type: 'pie',
      data: {
        labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Morado', 'Naranja'],
        datasets: [{
          label: 'Cantidad',
          data: this.dataValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Gráfico Circular' }
        }
      }
    });
  },
  renderScatterChart() {
    const scatterData = this.dataValues.map((value, index) => ({ x: index + 1, y: value }));
    this.scatterChart = new Chart(this.$refs.scatterChart, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Datos',
          data: scatterData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Gráfico de Puntos' }
        },
        scales: {
          x: { title: { display: true, text: 'Índice' } },
          y: { title: { display: true, text: 'Valor' } }
        }
      }
    });
  }
},
mounted() {
  this.calculateStatistics();
  this.renderBarChart();
  this.renderPieChart();
  this.renderScatterChart();
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
background-image: url('../assets/estadistica.jpg'); /* Ruta a tu imagen de fondo */
background-size: cover;
background-position: center;
background-repeat: no-repeat;
width: 100vw; /* Ocupa todo el ancho de la ventana */
/*height: calc(100vh - 60px);*/
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
background-color: rgba(255, 255, 255, 0.3);
padding: 20px;
border-radius: 10px;
text-align: center;
width: 90vw;
height: 90vh;
margin: 20px auto;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start; /* Alinea el contenido hacia arriba */
}

.centro {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-top: 250px;
}

#qualitativeChart {
width: 100%;
max-width: 600px;
height: 400px;
margin-top: 20px;
}

.charts-container {
display: flex;
justify-content: space-around;
flex-wrap: wrap;
width: 100%;
gap: 20px;
margin-bottom: 30px;
margin-top: 50px;
}

.chart {
width: 30%;
min-width: 250px;
background-color: rgba(255, 255, 255, 0.9); /* Aumenta la opacidad */
border: 1px solid #ccc;
border-radius: 8px;
padding: 15px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.statistics-box {
border: 1px solid #ccc;
border-radius: 8px;
padding: 20px;
width: 50%;
min-width: 300px;
background-color: #f9f9f9;
text-align: center;
}

.statistics-box h3 {
margin-bottom: 15px;
}

@media (max-width: 768px) {
.charts-container {
  flex-direction: column;
  align-items: center;
}

.chart {
  width: 80%;
}

.statistics-box {
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