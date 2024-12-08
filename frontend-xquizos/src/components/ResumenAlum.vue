<template>

  <div class="card">
    <section class="info-section">
      <div class="background-design">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="left-side">
        <div class="weather">
          <div>

          </div>
          <div>{{ matricula }}</div>
        </div>
        <div class="temperature"></div>
        <div class="range">{{ rut }}</div>
      </div>
      <div class="right-side">
        <div>
          <div class="hour"> {{ nombres }} </div>
          <div class="date">{{ apellidoP }} {{ apellidoM }}</div>
        </div>
        <div class="city">{{ fecIng}}</div>
      </div>
    </section>
    <section class="days-section">
      <button class="verde">
        <span class="day">TUE</span>
        <span class="icon-weather-day">
          
        </span>
      </button>
      <button class="amarillo">
        <span class="day">WED</span>
        <span class="icon-weather-day">
         
        </span>
      </button>
      <button class="rojo">
        <span class="day">THU</span>
        <span class="icon-weather-day">
          
        </span>
      </button>
    </section>
  </div>
  
  
  </template>
  
  <script>
  export default{
    props: {
      nombres: {
        type: String,
        required: true
      },
      apellidoP: {
        type: String,
        required:true
      },
      apellidoM: {
        type: String,
        required:true
      },
      rut: {
        type: String,
        required:true
      },
      matricula: {
        type: String,
        required:true
      },
      fecNac: {
        type: String,
        required:true
      },
      fecIng: {
        type: String,
        required:true
      },
    },
    created ()
    {console.log("Nombre alumno: ", this.nombres)}
      
  
  
  }
  </script>
  
  <style>
  /* From Uiverse.io by KSAplay */ 
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 180px;
    width: 280px;
    border-radius: 25px;
    background: lightgrey;
    overflow: hidden;
    transition: 100ms ease;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 4px;
  }
  
  /* ---------- Info section ---------- */
  
  .info-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 75%;
    color: white;
  }
  
  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    z-index: 1;
    padding-left: 18px;
  }
  
  button {
    display: block;
    border: none;
    background: transparent;
  }
  
  .weather {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
  
  .weather div {
    display: flex;
    align-items: center;
  }
  
  .weather div:nth-child(1) {
    width: 40%;
    height: auto;
  }
  
  .temperature {
    font-size: 34pt;
    font-weight: 500;
    line-height: 8%;
  }
  
  .right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    padding-right: 18px;
    z-index: 1;
  }
  
  .right-side > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .hour {
    font-size: 19pt;
    line-height: 1em;
  }
  
  .date {
    font-size: 15px;
  }
  
  /* ---------- Background ---------- */
  .background-design {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #ec7263;
    overflow: hidden;
  }
  
  .circle {
    background-color: #efc745;
  }
  
  .circle:nth-child(1) {
    position: absolute;
    top: -80%;
    right: -50%;
    width: 300px;
    height: 300px;
    opacity: 0.4;
    border-radius: 50%;
  }
  
  .circle:nth-child(2) {
    position: absolute;
    top: -70%;
    right: -30%;
    width: 210px;
    height: 210px;
    opacity: 0.4;
    border-radius: 50%;
  }
  
  .circle:nth-child(3) {
    position: absolute;
    top: -35%;
    right: -8%;
    width: 100px;
    height: 100px;
    opacity: 1;
    border-radius: 50%;
  }
  
  /* ---------- Days section ---------- */
  .days-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 25%;
    background-color: #a6a837be;
    gap: 2px;
    box-shadow: inset 0px 2px 5px #4d4e1f;
  }

  .verde {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: #16831f;
      box-shadow: inset 0px 2px 5px #0c3510;
      cursor: pointer;
      transition: 100ms ease;
      gap: 5px;
  }
  .amarillo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: #d4d64a;
      box-shadow: inset 0px 2px 5px #4d4e1f;
      cursor: pointer;
      transition: 100ms ease;
      gap: 5px;
  }
  .rojo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: #c73a3a;
      box-shadow: inset 0px 2px 5px #3b1414;
      cursor: pointer;
      transition: 100ms ease;
      gap: 5px;
  }
  
  .days-section button:hover {
    scale: 0.9;
    border-radius: 10px;
  }
  
  .days-section .day {
    font-size: 10pt;
    font-weight: 500;
    color: white;
    opacity: 0.7;
  }
  
  .icon-weather-day {
    display: flex;
    align-items: center;
    width: 20px;
    height: 100%;
  }
  
  
  </style>