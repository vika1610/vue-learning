# Подсказки · Неделя 3 · День 3

<details>
<summary>Подсказка 1 — намёк</summary>

Ребёнок как будто говорит: «Меня нажали!». А что с этим делать — решает родитель, потому что данные принадлежат ему.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- В ребёнке: `const emit = defineEmits(['toggle', 'remove'])`.
- Отправить: `@click="emit('remove')"` (в шаблоне можно писать и `$emit('remove')`).
- В родителе слушать как обычное событие: `<ShoppingItem @remove="..." @toggle="..." />`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<!-- родитель -->
<ShoppingItem
  v-for="item in items"
  :key="item.id"
  :text="item.text"
  :bought="item.bought"
  @toggle="item.bought = !item.bought"
  @remove="removeItem(item.id)"
/>
```

Почему нельзя менять props: если ребёнок изменит данные, родитель об этом не узнает, и при следующей перерисовке родитель «перезапишет» значение обратно. Источник правды должен быть один.

</details>
