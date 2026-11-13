<!--
  Неделя 1 · День 5 · Мини-проект: калькулятор чаевых

  Теория: конспект theory.md рядом с этим файлом (или повтор раздела «Основы» на ru.vuejs.org).
  JS-разминка (10 мин): повтор недели JS — деструктуризация, методы массивов.

  Условие:
  1. Три поля ввода: сумма счёта, процент чаевых, число людей.
  2. Через computed посчитай:
     - сумму чаевых;
     - итог (счёт + чаевые);
     - сумму на человека.
  3. Выведи результаты красиво: 2 знака после запятой и знак ₽
     (вспомни formatPrice из недели 0!).
  4. Быстрые кнопки процентов: 10 %, 15 %, 20 %. Выбранная кнопка подсвечена через :class.
  5. Если людей 0 или меньше — вместо суммы на человека покажи подсказку
     и подсвети поле красным (опять :class).

  Подсказки — в файле hints.md рядом.

  Проверь себя в конце недели:
  - Чем ref отличается от reactive?
  - Зачем в скрипте писать .value, а в шаблоне — нет?
  - Когда использовать computed, а когда метод?
  - Как добавить класс по условию?
-->
<script setup>
import { computed, ref } from 'vue'
const peopleAmount = ref(0);
const bill = ref(0);
const tipPercent = ref(10);

const tipsTotal = computed(() => {
  return bill.value * tipPercent.value / 100
});

const priceTotal = computed(() => {
  return bill.value + tipsTotal.value
});

const pricePerPerson = computed(() => {
  return peopleAmount.value > 0 ? priceTotal.value / peopleAmount.value : null
});

const isError = computed(() => {
  return peopleAmount.value === 0 || peopleAmount.value < 0
})

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₽`
}




// TODO: ref для суммы, процента и числа людей
// TODO: computed для чаевых, итога и суммы на человека
</script>

<template>
  <div class="tip">
    <h1>Калькулятор чаевых</h1>
    <input type="number" v-model.number="peopleAmount" placeholder="число людей" :class="{error: isError}">
    <input type="number" v-model.number="bill" placeholder="сумма счёта">
    <input type="number" v-model.number="tipPercent" placeholder="процент чаевых">
    <div>
      <button :class="{active: tipPercent === 10}" @click="tipPercent = 10">10%</button>
      <button :class="{active: tipPercent === 15}" @click="tipPercent = 15">15%</button>
      <button :class="{active: tipPercent === 20}" @click="tipPercent = 20">20%</button>
    </div>
    <div :class="{error: isError}">
      {{ peopleAmount > 0 ? formatPrice(pricePerPerson) : 'Укажите число людей' }}
    </div>
    <div>
      сумма чаевых: {{ formatPrice(tipsTotal) }}
    </div>
    <div>
      общий счет: {{ formatPrice(priceTotal) }}
    </div>
    <!-- TODO: поля ввода, кнопки процентов, результаты -->
  </div>
</template>

<style scoped>
.tip {
  max-width: 360px;
}

.error {
  color: red;
  border: 2px solid red;
}
.active {
  border: 2px solid blue;
}
/* TODO: стили для выбранной кнопки и ошибки */
</style>
