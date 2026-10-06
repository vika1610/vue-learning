# Подсказки · Неделя 4 · День 5 — отметка, редактирование, сохранение

<details>
<summary>Подсказка 1 — намёк</summary>

- «Сделано сегодня» — это просто вопрос: «есть ли сегодняшняя дата в массиве `doneDates`?».
- Переключение = если есть — убрать, если нет — добавить.
- Для редактирования нужно знать, **какая** привычка сейчас редактируется. Достаточно хранить её `id` (или флаг внутри `HabitItem`).

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Проверка: `habit.doneDates.includes(todayKey())`.
- Убрать дату: `filter`. Добавить: `push` или spread.
- `HabitItem` не меняет привычку сам — он шлёт `toggle(id)`, `remove(id)`, `update(id, changes)`; меняет родитель.
- `const habits = useLocalStorage('habits', [])` — и всё, что работало с `ref([])`, продолжит работать.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
function toggleToday(id) {
  const habit = habits.value.find((h) => h.id === id)
  const today = todayKey()
  if (habit.doneDates.includes(today)) {
    habit.doneDates = habit.doneDates.filter(/* ? */)
  } else {
    // ?
  }
}

function updateHabit(id, changes) {
  const habit = habits.value.find((h) => h.id === id)
  Object.assign(habit, changes)
}
```

Редактирование внутри `HabitItem`: локальный `ref(false)` «режим редактирования» и локальные копии полей, чтобы «Отмена» ничего не испортила.

</details>
