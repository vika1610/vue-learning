<!--
  Неделя 1 · День 4 · Конвертер + красный счётчик — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Градусы Цельсия — в data(); Фаренгейты — в опции computed.
  2. Дополнительно: computed с get и set для обратной конвертации.
  3. Счётчик (из своей Options-версии дня 3): число в data(), кнопки — методы,
     красный цвет при значении < 0 через :class.
  4. Помни: computed объявляется как функция, а используется без скобок.
-->
<script>
export default {
  data() {
    return {
      celsius: 0,
      count: 0,
    }
  },
  computed: {
    fahrenheit: {
      get() {
        return this.celsius * 9 / 5 + 32
      },
      set(newF) {
        this.celsius = (newF - 32) * 5 / 9
      },
    }
  },
  methods: { 
   upCount() {
    this.count++
   },
   downCount() {
    this.count--
   },
   clearCount() {
    this.count = 0
   }
  }
}
</script>

<template>
  <div>
    <h2>Конвертер температур (Options API)</h2>
    <input type="number" v-model="celsius" placeholder="°C" />
    <div>{{ fahrenheit.toFixed(1) }} °F</div>
    <input type="number" v-model="fahrenheit" placeholder="°F" />
    <div>{{ celsius.toFixed(1) }} °C</div>
    <!-- TODO: поле ввода °C и результат в °F -->

    <h2>Счётчик (Options API)</h2>
    <!-- TODO: число с условным классом и кнопки -->
    <span :class="{error: count < 0}">{{ count }}</span>
    <span :style="{color: count < 0 ? 'red' : 'green'}">{{ count }}</span>
    <button @click="upCount">+1</button>
    <button @click="downCount">-1</button>
    <button @click="clearCount">Сброс</button>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
/* TODO: класс для отрицательного числа */
</style>
