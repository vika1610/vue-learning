# Подсказки · Неделя 6 · День 1 · Счётчик в сторе

<details>
<summary>Подсказка 1 — намёк</summary>

Стор — это одно общее хранилище на всё приложение. Каждый компонент, который вызывает `useCounterStore()`, получает **тот же самый** объект — поэтому данные общие.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Подключение: `createPinia` из `'pinia'` и `app.use(...)` — так же, как роутер на прошлой неделе.
- У `defineStore` есть два стиля: «options» (`state`, `getters`, `actions`) и «setup» (функция с `ref`, `computed` и обычными функциями — как в `<script setup>`). Выбери любой; документация показывает оба.
- В компоненте: `const counter = useCounterStore()`, затем `counter.count`, `counter.increment()`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
// stores/counter.js — стиль setup
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => /* ? */)
  function increment() { /* ? */ }
  // ...
  return { count, double, increment /* , ... */ }
})
```

Не забудь вернуть из функции **всё**, что нужно компонентам.

</details>
