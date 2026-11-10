<!--
  Неделя 1 · День 3 · Счётчик

  Теория: конспект theory.md рядом с этим файлом (или ru.vuejs.org — «Основы реактивности»: ref, reactive).
  JS-разминка (10 мин): геттеры/сеттеры и Proxy (обзор) — так устроена реактивность.

  Условие:
  1. Число на экране и три кнопки: «+1», «−1», «Сброс».
  2. Значение хранится в ref.
  3. Кнопки меняют значение. Обработчик клика: @click="..." —
     он есть в примерах раздела «Основы реактивности»; подробно события будут на неделе 2.
  4. Дополнительно: сделай второй вариант — данные в reactive({ count: 0 }).
     Сравни, где нужен .value, а где нет.

  Подсказки — в файле hints.md рядом.
-->
<script setup>
import { ref } from 'vue'
import { reactive } from 'vue'

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




const countReactive = reactive({count: 0})

function upCountReactive() {
  countReactive.count++
}
function downCountReactive() {
  countReactive.count--
}
function clearCountReactive() {
  countReactive.count = 0
}
</script>

<template>
  <div>
    <h1>Счётчик</h1>
    <span>{{ count }}</span>
    <button @click="upCount">+1</button>
    <button @click="downCount">-1</button>
    <button @click="clearCount">Сброс</button>
  </div>
  <div>
    <h1>Счётчик reactive</h1>
    <span>{{ countReactive.count }}</span>
    <button @click="upCountReactive">+1</button>
    <button @click="downCountReactive">-1</button>
    <button @click="clearCountReactive">Сброс</button>
  </div>
</template>
