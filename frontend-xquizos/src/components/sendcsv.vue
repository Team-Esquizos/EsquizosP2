<template>
    <div>
      <h2>Subir Archivo CSV</h2>
      <input type="file" @change="onFileChange" accept=".csv" />
      <button @click="previewFile">Previsualizar</button>
      <button @click="uploadFile">Subir a MongoDB</button>
  
      <div v-if="previewData.length > 0">
        <h3>Vista Previa:</h3>
        <table border="1">
          <tr v-for="(row, index) in previewData" :key="index">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import autenticadorSesion from "@/mixins/AutenticadorSesion";
  
  export default {
    mixins: [autenticadorSesion],
    data() {
      return {
        file: null,
        previewData: [],
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
      },
      previewFile() {
        if (!this.file) return;
  
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result || '';
          const rows = text.split("\n").map((row) => row.split(","));
          this.previewData = rows;
        };
        reader.readAsText(this.file);
      },
      async uploadFile() {
        if (!this.file) return;
  
        const formData = new FormData();
        formData.append("file", this.file);
  
        try {
          const response = await axios.post("http://localhost:8080/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Archivo subido correctamente:", response.data);
        } catch (error) {
          console.error("Error al subir el archivo:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    font-family: Arial, sans-serif;
  }
  button {
    margin-top: 10px;
  }
  table {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
  }
  td {
    padding: 5px;
    border: 1px solid #ddd;
  }
  </style>
  