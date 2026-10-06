# Подсказки · Неделя 4 · День 2 — useLocalStorage

<details>
<summary>Подсказка 1 — намёк</summary>

Задача делится на две половины: «прочитать при старте» (один раз) и «записывать при изменении» (каждый раз). Для второй половины ты на неделе 2 уже использовала нужный инструмент.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Старт: `localStorage.getItem(key)` вернёт `null`, если ключа нет. Иначе — строка, которую надо `JSON.parse`.
- Запись: `watch(state, (value) => localStorage.setItem(key, JSON.stringify(value)), { deep: true })`.
- Без `deep: true` изменение `items.value.push(...)` не попадёт в `localStorage` — проверь это сама!

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const state = ref(stored === null ? defaultValue : /* разобрать JSON безопасно */)

  watch(state, /* ? */, { deep: true })

  return state
}
```

</details>
