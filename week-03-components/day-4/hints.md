# Подсказки · Неделя 3 · День 4

<details>
<summary>Подсказка 1 — намёк</summary>

- `v-model` на компоненте — это просто prop + событие под капотом. `defineModel()` делает их за тебя и возвращает `ref`, который можно читать и менять.
- Слот — «дырка» в шаблоне компонента, которую заполняет родитель своей разметкой.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- В `BaseInput`: `const model = defineModel()`, а в шаблоне `<input v-model="model" />`.
- Остальные параметры — обычные props: `label`, `error`.
- Слоты: `<slot name="header" />`, `<slot />` (это `default`), `<slot name="footer">...здесь содержимое по умолчанию...</slot>`.
- В родителе: `<template #header>Заголовок</template>`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<!-- BaseModal.vue -->
<script setup>
const open = defineModel('open', { type: Boolean })
</script>

<template>
  <div v-if="open" class="backdrop">
    <div class="modal">
      <header><slot name="header" /></header>
      <slot />
      <footer>
        <slot name="footer">
          <button @click="/* ? */">Закрыть</button>
        </slot>
      </footer>
    </div>
  </div>
</template>
```

Использование: `<BaseModal v-model:open="isOpen">...</BaseModal>`.

Подложка: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: grid; place-items: center;`.

</details>
