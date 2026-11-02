<!--
  Неделя 1 · День 5 · Калькулятор чаевых — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Сумма счёта, процент и число людей — в data().
  2. Чаевые, итог и сумма на человека — в computed (computed может использовать
     другой computed через this.имя, без скобок).
  3. Форматирование денег — метод в methods (у него есть аргумент).
  4. Кнопки 10 / 15 / 20 % и подсветка выбранной через :class.
  5. 0 гостей — подсказка вместо суммы и красное поле.
-->
<script>
export default {
  // TODO: data() { return { ... } }
  // TODO: computed: { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div class="tip">
    <h1>Калькулятор чаевых (Options API)</h1>
    <!-- TODO: поля ввода, кнопки процентов, результаты -->
  </div>
</template>

<style scoped>
.tip {
  max-width: 360px;
}
/* TODO: стили для выбранной кнопки и ошибки */
</style>
