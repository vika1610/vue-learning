# Подсказки · Неделя 2 · День 2 · Список покупок

<details>
<summary>Подсказка 1 — намёк</summary>

- Каждой покупке нужен уникальный `id` для `key`. Откуда его взять? (Вспомни `makeIdGenerator` из недели 0 или `Date.now()`.)
- Отправка формы по умолчанию перезагружает страницу. У Vue для этого есть короткий модификатор — найди его в разделе «Модификаторы событий».

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `<form @submit.prevent="addItem">` — `.prevent` делает то же, что `event.preventDefault()`.
- Добавить: `items.value.push({ id: ..., text: ..., bought: false })`, потом очистить поле.
- Пустую строку отсекай через `trim()`.
- Удалить: создай новый массив без этого элемента — `filter` по `id`.
- В обработчик можно передать аргумент: `@click="removeItem(item.id)"`.
- Счётчик: `computed` + `filter` по `!item.bought` + `length`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
function addItem() {
  const text = newItem.value.trim()
  if (!text) return
  items.value.push({ /* ? */ })
  newItem.value = ''
}

function removeItem(id) {
  items.value = items.value.filter(/* ? */)
}
```

Отметка «куплено»: `<input type="checkbox" v-model="item.bought" />` — да, `v-model` работает и со свойством объекта внутри `v-for`.

</details>
