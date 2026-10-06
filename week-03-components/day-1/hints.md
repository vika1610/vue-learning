# Подсказки · Неделя 3 · День 1

<details>
<summary>Подсказка 1 — намёк</summary>

`main.js` — точка входа: он создаёт приложение из корневого компонента и «монтирует» его в элемент страницы из `index.html`. Найди эту связь — какой `id` у элемента?

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Если `npm create vue@latest` задаёт вопросы на английском: `Project name` — имя, `Add TypeScript?` — No, остальное — No (стрелками и Enter).
- Удаляя компоненты-примеры, удали и их **импорты** в `App.vue`, иначе Vite покажет ошибку «Failed to resolve import».
- Стили по умолчанию лежат в `src/assets/`. Их подключение — строка `import './assets/main.css'` в `main.js`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Минимальный `App.vue`:

```vue
<script setup>
</script>

<template>
  <h1>Мой магазин</h1>
</template>
```

Если DevTools не видит Vue — убедись, что страница открыта через `npm run dev` (а не собранная), и перезагрузи вкладку после установки расширения.

</details>
