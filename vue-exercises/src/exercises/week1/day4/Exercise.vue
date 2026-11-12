<!--
  Неделя 1 · День 4 · Конвертер температур + красный счётчик

  Теория: конспект theory.md рядом с этим файлом (или ru.vuejs.org — «Вычисляемые свойства» (computed), «Привязка классов и стилей»).
  JS-разминка (10 мин): чистые функции, объекты как словари.

  Условие (две части):

  Часть 1. Конвертер °C ↔ °F.
  - Поле ввода для градусов Цельсия, рядом показывается значение в Фаренгейтах.
  - Фаренгейты считаются через computed: F = C × 9 / 5 + 32.
  - Связать поле ввода с ref поможет v-model (подробно — на неделе 2,
    пока достаточно знать: v-model="celsius" держит поле и ref одинаковыми).
  - Дополнительно: сделай конвертацию в обе стороны (подсказка: computed с get и set).

  Часть 2. Счётчик красный при значении < 0.
  - Скопируй свой счётчик из week1/day3.
  - Когда число меньше нуля, оно становится красным. Сделай через привязку класса :class.
  - Попробуй и второй способ — через :style.

  Подсказки — в файле hints.md рядом.
-->
<script setup>
import { computed, ref } from 'vue'
// TODO: часть 1 — ref для °C и computed для °F
const celsius = ref(0);
const fahrenheit = computed({
  get() {
    return celsius.value * 9 / 5 + 32
  },
  set(newF) {
    celsius.value = (newF - 32) * 5 / 9 
  },
})

// TODO: часть 2 — счётчик
const count = ref(0);

function upCount() {
  count.value++
}

function downCount() {
  count.value--
}

function clearCount() {
  count.value = 0
}
</script>

<template>
  <div>
    <h2>Конвертер температур</h2>
    <input type="number" v-model="celsius" placeholder="°C" />
    <div>{{ fahrenheit.toFixed(1) }} °F</div>
    <input type="number" v-model="fahrenheit" placeholder="°F" />
    <div>{{ celsius.toFixed(1) }} °C</div>

    <h2>Счётчик</h2>
    <span :class="{error: count < 0}">{{ count }}</span>
    <span :style="{color: count < 0 ? 'red' : 'green'}">{{ count }}</span>
    <button @click="upCount">+1</button>
    <button @click="downCount">-1</button>
    <button @click="clearCount">Сброс</button>
    <!-- TODO: число с условным классом и кнопки -->
  </div>
</template>

<style scoped>
.error {
  color: red;
}
/* TODO: класс для отрицательного числа */
</style>
