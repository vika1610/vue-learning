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
  data() {
    return {
      peopleAmount: 0,
      bill: 0,
      tipPercent: 10,
    }
  },
  computed: {
    tipsTotal() {
      return this.bill * this.tipPercent / 100
    },

    priceTotal() {
      return this.bill + this.tipsTotal
    },

    pricePerPerson() {
      return this.peopleAmount > 0 ? this.priceTotal / this.peopleAmount : null
    },

    isError() {
      return this.peopleAmount === 0 || this.peopleAmount < 0
    },
  },
  methods: {
    formatPrice(price) {
      return `${price.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ₽`
    }
  }
}
</script>

<template>
  <div class="tip">
    <h1>Калькулятор чаевых (Options API)</h1>
    <input type="number" v-model.number="peopleAmount" placeholder="число людей" :class="{ error: isError }">
    <input type="number" v-model.number="bill" placeholder="сумма счёта">
    <input type="number" v-model.number="tipPercent" placeholder="процент чаевых">
    <div>
      <button :class="{ active: tipPercent === 10 }" @click="tipPercent = 10">10%</button>
      <button :class="{ active: tipPercent === 15 }" @click="tipPercent = 15">15%</button>
      <button :class="{ active: tipPercent === 20 }" @click="tipPercent = 20">20%</button>
    </div>
    <div :class="{ error: isError }">
      {{ peopleAmount > 0 ? formatPrice(pricePerPerson) : 'Укажите число людей' }}
    </div>
    <div>
      сумма чаевых: {{ formatPrice(tipsTotal) }}
    </div>
    <div>
      общий счет: {{ formatPrice(priceTotal) }}
    </div> <!-- TODO: поля ввода, кнопки процентов, результаты -->
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
