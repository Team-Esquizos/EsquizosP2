<template>
    <div class="range-slider">
      <label for="steps-range" class="label">
        Range steps
      </label>
      <input 
        id="steps-range" 
        type="range" 
        min="-5" 
        max="5" 
        :value="rangeValue" 
        step="2" 
        class="slider" 
        @input="updateRangeValue"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    computed: {
      rangeValue: {
        get() {
          return this.modelValue;
        },
        set(newValue) {
          this.$emit("update:modelValue", Number(newValue));
        },
      },
    },
    methods: {
      updateRangeValue(event) {
        this.rangeValue = event.target.value; // Emitir el evento automáticamente por el setter
      },
    },
  };
  </script>
  
  <style scoped>
  /* Mantén los estilos iguales */
  .range-slider {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .slider:hover {
    background: #ccc;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .value {
    font-size: 14px;
    color: #555;
  }
  </style>
  