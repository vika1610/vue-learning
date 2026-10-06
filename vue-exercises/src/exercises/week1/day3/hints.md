# Подсказки · Неделя 1 · День 3 · Счётчик

<details>
<summary>Подсказка 1 — намёк</summary>

Обычная переменная `let count = 0` меняется, но Vue об этом **не узнаёт** и не перерисовывает страницу. Чтобы Vue следил за значением, оберни его в `ref`.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `import { ref } from 'vue'`, затем `const count = ref(0)`.
- В `<script>` значение читается и меняется через `count.value`.
- В шаблоне `.value` писать **не нужно**: Vue «разворачивает» ref сам.
- Функции, объявленные в `<script setup>`, можно вызывать из `@click`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // изменить count.value
}
// decrement, reset — по аналогии
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+1</button>
</template>
```

Для простых действий можно писать выражение прямо в шаблоне: `@click="count++"`.

С `reactive`: `const state = reactive({ count: 0 })` и `state.count++` — без `.value`. Но `reactive` работает только с объектами.

</details>
