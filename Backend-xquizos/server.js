const express = require('express');
const mongoose = require('./mongooseConnection'); // Conexión a MongoDB
const Upload = require('./models/Upload'); // Importa el modelo
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Configuración de multer

// Ruta raíz para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Ruta para subir el archivo CSV y guardar en MongoDB
app.post('/api/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const results = [];

  fs.onFileChange(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Upload.insertMany(results); // Guarda en la colección 'upload'
        res.status(200).json({ message: 'Datos subidos correctamente' });
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        res.status(500).json({ message: 'Error al guardar los datos' });
      } finally {
        fs.unlinkSync(filePath); // Elimina el archivo temporal
      }
    });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
