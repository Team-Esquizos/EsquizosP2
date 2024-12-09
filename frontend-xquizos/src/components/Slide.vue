<template>
  <div class="range-slider">
    <label for="steps-range" class="label">
      Valor acción
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
</style>
