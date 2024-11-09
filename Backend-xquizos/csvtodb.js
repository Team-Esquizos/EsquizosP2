const fs = require('fs');
const csv = require('csv-parser');
const Usuario = require('./models/user');

const resultados = [];

fs.createReadStream('user.csv')
  .pipe(csv())
  .on('data', (fila) => {
    // Convierte los valores a tipos adecuados si es necesario
    resultados.push({
      nombre: fila.nombre,
      edad: parseInt(fila.edad, 10),
      email: fila.email,
    });
  })
  .on('end', async () => {
    try {
      // Guarda los resultados en MongoDB
      await Usuario.insertMany(resultados);
      console.log('Datos insertados en MongoDB');
    } catch (error) {
      console.error('Error al insertar los datos:', error);
    }
  });
