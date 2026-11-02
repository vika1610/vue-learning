<!--
  Неделя 2 · День 5 · Таймер Pomodoro — БОНУС: версия Options API

  Та же задача, что в Exercise.vue, но в стиле Options API.
  Теория: theory.md, занятие 3.

  Условие:
  1. Оставшиеся секунды и флаг «идёт ли таймер» — в data();
     id интервала — служебное поле this.intervalId (заведи в created()).
  2. ММ:СС — в опции computed.
  3. Старт / пауза / сброс — методы. Внутри setInterval — только стрелка!
  4. «Перерыв!», когда время вышло.
  5. Уборка — в хуке unmounted(). Проверь кнопкой «⏏ Размонтировать».
  6. В mounted() выведи в консоль «Таймер готов».
-->
<script>
export default {
  // TODO: data() { return { ... } }
  // TODO: computed: { ... }
  // TODO: created() { ... }
  // TODO: mounted() { ... }
  // TODO: unmounted() { ... }
  // TODO: methods: { ... }
}
</script>

<template>
  <div class="pomodoro">
    <h1>Pomodoro (Options API)</h1>
    <!-- TODO: время и кнопки -->
  </div>
</template>

<style scoped>
.pomodoro {
  text-align: center;
}
</style>
