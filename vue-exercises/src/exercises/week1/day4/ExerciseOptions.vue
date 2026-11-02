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
  // TODO: data() { return { ... } }
  // TODO: computed: { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div>
    <h2>Конвертер температур (Options API)</h2>
    <!-- TODO: поле ввода °C и результат в °F -->

    <h2>Счётчик (Options API)</h2>
    <!-- TODO: число с условным классом и кнопки -->
  </div>
</template>

<style scoped>
/* TODO: класс для отрицательного числа */
</style>
