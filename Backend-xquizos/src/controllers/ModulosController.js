var datos = require('../learning/learningModel');
const XLSX = require("xlsx");
const fs = require('fs');
const mongoose = require("mongoose");

const importModulos = async (req, res) => {
    try {
        // Verificar si el archivo fue subido
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Por favor, sube un archivo Excel." });
        }

        // Leer el archivo Excel
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convertir la hoja a JSON

        console.log("Datos leídos del archivo Excel:", sheetData);

        // Crear un conjunto para almacenar aprendizajes únicos
        const aprendizajesSet = new Set();

        // Filtrar datos para eliminar aprendizajes repetidos
        const datosData = [];

        for (let row of sheetData) {
            const aprendizaje = row['Aprendizaje'];

            if (!aprendizajesSet.has(aprendizaje)) {
                aprendizajesSet.add(aprendizaje);

                datosData.push({
                    aprendizaje: aprendizaje,
                    tipoSaber: row['Tipo de saber']
                });
            }
        }

        // Insertar datos en MongoDB
        await datos.insertMany(datosData);
        console.log("Datos importados correctamente a la base de datos.");

        // Responder al cliente
        res.status(200).json({
            success: true,
            message: "Datos importados correctamente a la base de datos."
        });

        // Eliminar el archivo temporal
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error al eliminar el archivo:", err);
            } else {
                console.log("Archivo Excel eliminado.");
            }
        });
    } catch (error) {
        console.error("Error al importar datos desde Excel:", error);
        res.status(500).json({
            success: false,
            message: "Hubo un error al importar los datos.",
            error: error.message
        });
    }
};





module.exports = {
    importModulos
}