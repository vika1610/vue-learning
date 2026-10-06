# Подсказки · Неделя 3 · День 5

<details>
<summary>Подсказка 1 — намёк</summary>

Начни с вопроса: **у кого живут данные?** Массив покупок нужен и для списка, и для счётчика, и форма добавляет в него — значит, он живёт в общем родителе (`ShoppingList`). Остальные компоненты получают props и шлют события.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `AddItemForm` хранит **только** текст поля (свой `ref`). При отправке: `emit('add', text)` и очистить поле.
- `ShoppingList` слушает `@add="addItem"` и сам создаёт объект покупки с `id`.
- `BaseButton`: класс по варианту — `` :class="`btn-${variant}`" `` или объект классов.
- Атрибуты, не объявленные в props, Vue сам вешает на **корневой** элемент компонента.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<!-- BaseButton.vue -->
<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
})
</script>

<template>
  <button :class="['btn', /* класс варианта */]">
    <slot />
  </button>
</template>
```

`provide('currency', '₽')` в предке и `const currency = inject('currency')` в потомке.

</details>
