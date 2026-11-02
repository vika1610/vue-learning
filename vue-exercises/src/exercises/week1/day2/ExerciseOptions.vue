<!--
  Неделя 1 · День 2 · Карточка профиля — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Объект профиля (имя, должность, аватар, ссылка, online) — поле в data().
  2. Аватар, ссылка и title карточки — через v-bind, как в основной версии.
  3. Вынеси подпись title («Профиль: …») в метод в methods.
     Внутри метода обращайся к данным через this.
  4. «в сети» / «не в сети» — через тернарный оператор.
-->
<script>
export default {
  // TODO: data() { return { profile: { ... } } }
  // TODO: methods: { ... }
}
</script>

<template>
  <div class="card">
    <!-- TODO: аватар, имя, должность, ссылка, статус -->
  </div>
</template>

<style scoped>
.card {
  max-width: 280px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  text-align: center;
}
.card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
</style>
