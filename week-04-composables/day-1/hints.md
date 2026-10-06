# Подсказки · Неделя 4 · День 1 — useFetch

<details>
<summary>Подсказка 1 — намёк</summary>

Ты уже писала загрузку с «Загрузка…» и ошибкой (неделя 0, день 5, и блог-подобные задачи). Композабл — это та же логика, но вынесенная из компонента в функцию, которая создаёт **свои** `ref` при каждом вызове.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Внутри `useFetch(url)`: три `ref`, асинхронная функция загрузки, вызов этой функции, `return { data, loading, error }`.
- Функцию загрузки можно вызвать сразу — `await` в самом `useFetch` не нужен: `ref` обновятся сами, когда ответ придёт.
- `finally` — удобное место, чтобы выключить `loading` и при успехе, и при ошибке.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      // fetch, проверка ok, data.value = ...
    } catch (e) {
      // ?
    } finally {
      // ?
    }
  }

  load()
  return { data, loading, error /* , refetch: load */ }
}
```

Почему `ref`, а не значения: если вернуть `data.value`, компонент получит `null` в момент вызова — и никогда не узнает, что данные пришли позже.

</details>
