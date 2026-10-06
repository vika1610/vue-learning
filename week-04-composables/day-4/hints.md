# Подсказки · Неделя 4 · День 4 — форма и список

<details>
<summary>Подсказка 1 — намёк</summary>

Это та же схема, что в списке покупок недели 3: данные живут в общем родителе, форма шлёт событие `add`, список получает props.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `HabitForm` хранит **только** значения своих полей. `emit('add', { title, category })`.
- Родитель собирает полную привычку: `{ id: crypto.randomUUID(), title, category, doneDates: [], createdAt: todayKey() }`.
- `HabitList` получает prop `habits` и делает `v-for` по `HabitItem` с `:key="habit.id"`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
// App.vue
function addHabit({ title, category }) {
  habits.value.push({
    id: crypto.randomUUID(),
    title,
    category,
    doneDates: [],
    createdAt: /* ? */,
  })
}
```

Чтобы `HabitItem` позже мог передать наверх «отметить» или «удалить», заранее подумай: какой аргумент нужен родителю, чтобы найти привычку? (`id`.)

</details>
