# Подсказки · Неделя 1 · День 5 · Калькулятор чаевых

<details>
<summary>Подсказка 1 — намёк</summary>

Начни с данных: какие значения вводит пользователь (это `ref`), а какие **получаются** из них (это `computed`)? Выпиши их на бумаге до кода.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Ввод: `bill`, `percent`, `people` — три `ref`.
- Вычисляемые: `tip` (зависит от `bill` и `percent`), `total` (от `bill` и `tip`), `perPerson` (от `total` и `people`).
- `computed` может использовать другие `computed` — через `.value`.
- Для кнопок: `@click="percent = 10"`, а подсветка — `:class="{ active: percent === 10 }"`.
- Числа из полей ввода: `v-model.number` (из недели 2) превращает строку в число.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
const tip = computed(() => bill.value * percent.value / 100)
const total = computed(() => /* ? */)
const perPerson = computed(() => people.value > 0 ? /* ? */ : null)
```

Форматирование — функция, которую можно вызвать прямо в шаблоне: `{{ formatPrice(total) }}`. Можешь скопировать свою `formatPrice` из недели 0.

Повторяющиеся кнопки процентов потом (неделя 2) сделаешь через `v-for` по массиву `[10, 15, 20]`. Сейчас можно написать три кнопки вручную.

</details>
