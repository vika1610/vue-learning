<!--
  Неделя 1 · День 2 · Карточка профиля

  Теория: конспект theory.md рядом с этим файлом (или ru.vuejs.org — «Синтаксис шаблонов», директивы, v-bind).
  JS-разминка (10 мин): тернарный оператор, шаблонные строки.

  Условие:
  Сделай карточку профиля. Все данные — в одном объекте в <script setup>:
  имя, должность, ссылка на аватар, ссылка на сайт/GitHub.
  1. Аватар — <img>, у которого src и alt берутся из данных через v-bind.
  2. Ссылка — <a>, у которой href берётся из данных.
  3. У карточки атрибут title (всплывающая подсказка) — тоже из данных,
     собери его шаблонной строкой, например «Профиль: Анна».
  4. Добавь в данные поле online (true/false) и выведи «в сети» / «не в сети»
     через тернарный оператор.

  Картинка для аватара: например https://i.pravatar.cc/150?img=5

  Подсказки — в файле hints.md рядом.
-->
<script setup>
const user = {
  name: 'Vikky',
  position: 'front-end developer',
  imgSrc: 'https://i.pravatar.cc/150?img=5',
  link: 'https://github.com/vika1610/vue-learning',
  online: true,
}
</script>

<template>
  <div class="card" :title="`Профиль: ${user.name}`">
    <img :src="user.imgSrc" :alt="user.name">
    <p>{{ user.name }}</p>
    <p>{{ user.position }}</p>
    <a :href="user.link">мой GitHub</a>
    <p>{{ user.online ? 'в сети' : 'не в сети' }}</p>
  </div>
</template>

<style scoped>
.card {
  max-width: 280px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  text-align: center;
}
.card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
</style>
