<!--
  Неделя 2 · День 4 · Валидация и черновик — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Форма, «тронутые» поля и флаг попытки отправки — в data().
  2. Ошибки — объект в опции computed; «есть ли ошибки» — ещё один computed.
  3. Показ ошибки поля — метод в methods (у него есть аргумент).
  4. Черновик: опция watch с handler и deep: true (без паролей!).
  5. Восстановление черновика — в хуке created() (это завтрашняя тема, но здесь
     достаточно знать: created срабатывает, когда компонент создан).
-->
<script>
export default {
  // TODO: data() { return { ... } }
  // TODO: computed: { ... }
  // TODO: watch: { ... }
  // TODO: created() { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div>
    <h1>Регистрация с проверкой (Options API)</h1>
    <!-- TODO: форма с ошибками под полями -->
  </div>
</template>

<style scoped>
/* TODO: стиль для текста ошибки и поля с ошибкой */
</style>
