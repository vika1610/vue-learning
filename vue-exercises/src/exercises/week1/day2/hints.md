# Подсказки · Неделя 1 · День 2 · Карточка профиля

<details>
<summary>Подсказка 1 — намёк</summary>

`{{ }}` работает только **внутри текста** тега. Для значений **атрибутов** (`src`, `href`, `title`, `alt`) нужна директива `v-bind`.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Полная запись: `v-bind:src="..."`, короткая: `:src="..."`. В кавычках — JS-выражение, а не строка.
- Сравни: `src="profile.avatar"` (буквально строка «profile.avatar») и `:src="profile.avatar"` (значение из данных).
- Шаблонная строка тоже выражение: `` :title="`Профиль: ${...}`" ``.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<script setup>
const profile = {
  name: '...',
  avatar: 'https://i.pravatar.cc/150?img=5',
  // ...
}
</script>

<template>
  <div class="card" :title="/* шаблонная строка */">
    <img :src="profile.avatar" :alt="/* ? */" />
    <p>{{ profile.online ? /* ? */ : /* ? */ }}</p>
  </div>
</template>
```

</details>
