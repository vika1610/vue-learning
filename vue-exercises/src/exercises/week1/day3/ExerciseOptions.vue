<!--
  Неделя 1 · День 3 · Счётчик — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Число на экране и три кнопки: «+1», «−1», «Сброс».
  2. Число хранится в data() — оно реактивно само, ref не нужен.
  3. Действия кнопок — методы в methods; внутри данные через this.
  4. Сравни с основной версией: где был .value, что стало вместо него?
-->
<script>
export default {
  data() { 
    return { 
      count: 0,
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
    <h1>Счётчик (Options API)</h1>
    <span>{{ count }}</span>
    <button @click="upCount">+1</button>
    <button @click="downCount">-1</button>
    <button @click="clearCount">Сброс</button>
  </div>
</template>
