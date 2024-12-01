var datos = require('../Moduloseducativos/Modulosmodel.js');
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

        // Crear un mapa para agrupar los datos
        const groupedData = {};

        sheetData.forEach(row => {
            const key = `${row['Módulo']}-${row['Semestre']}-${row['Competencia']}`;
        
            if (!groupedData[key]) {
                groupedData[key] = {
                    Modulo: row['Módulo'], // Ajustar los nombres según las columnas del Excel
                    semestre: parseInt(row['Semestre'], 10), // Convertir a entero
                    Competencia: row['Competencia'],
                    Aprendizajes: [] // Crear un array para los aprendizajes
                };
            }
        
            // Agregar el aprendizaje y el tipo de saber al arreglo correspondiente
            groupedData[key].Aprendizajes.push({
                Aprendizaje: row['Aprendizaje'],
                TipoSaber: row['Tipo de saber']
            });
        });

        // Convertir el mapa a un arreglo
        const datosData = Object.values(groupedData);

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