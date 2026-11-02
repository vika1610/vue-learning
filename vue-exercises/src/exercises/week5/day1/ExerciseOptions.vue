<!--
  Неделя 5 · День 1 · Три страницы и меню — БОНУС: версия Options API

  Та же рамка приложения, что в Exercise.vue, но в стиле Options API.
  Роутер — общий, из setup.js рядом (сначала сделай основную задачу).
  Теория: theory.md, занятие 3.

  Условие:
  1. Меню из трёх RouterLink и RouterView — как в основной версии.
  2. Строка «Вы на странице: …» — текущий путь из $route.
  3. Кнопка «На главную» — метод в methods, который делает переход через this.$router.
     Кнопку показывай, только если мы НЕ на главной (computed по this.$route.path).
-->
<script>
export default {
  // TODO: computed: { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div>
    <!-- TODO: меню из RouterLink, строка с текущим путём, кнопка «На главную», RouterView -->
    <p>Сначала подключи роутер в setup.js (основная задача), потом делай эту версию.</p>
  </div>
</template>
