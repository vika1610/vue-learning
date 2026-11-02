<!--
  Неделя 2 · День 1 · Список задач — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Массив задач { id, text, done } и флаг видимости подсказки — в data().
  2. Список через v-for с :key, выполненные — зачёркнуты через :class.
  3. «Список пуст» через v-if / v-else.
  4. Кнопка «Показать подсказку» — метод в methods, меняющий флаг через this.
  5. Бонус: computed «осталось сделать» — сколько задач с done: false.
-->
<script>
export default {
  // TODO: data() { return { ... } }
  // TODO: computed: { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div>
    <h1>Список задач (Options API)</h1>
    <!-- TODO: список задач или сообщение «Список пуст» -->
    <!-- TODO: кнопка «Показать подсказку» и сама подсказка -->
  </div>
</template>

<style scoped>
/* TODO: стиль для выполненной задачи */
</style>
