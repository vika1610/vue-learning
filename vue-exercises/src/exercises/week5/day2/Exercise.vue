<!--
  Неделя 5 · День 2 · Блог на jsonplaceholder

  Теория: router.vuejs.org/ru — «Динамические маршруты» (:id), useRoute, загрузка данных.
  JS-разминка (10 мин): шаблонные строки, Promise.all.

  API:
  - список постов:     https://jsonplaceholder.typicode.com/posts
  - один пост:         https://jsonplaceholder.typicode.com/posts/1
  - комментарии поста: https://jsonplaceholder.typicode.com/posts/1/comments

  Условие:
  1. Страница списка ('/'): заголовки постов (можно первые 10–20),
     каждый — RouterLink на /posts/:id.
  2. Страница поста ('/posts/:id'): берёт id из адреса через useRoute,
     загружает пост и его комментарии ПАРАЛЛЕЛЬНО (Promise.all).
  3. Пока данные грузятся — лоадер «Загрузка…». При ошибке — сообщение.
  4. На странице поста — ссылка «← Ко всем постам».
  5. Проверь: что будет, если с одной страницы поста перейти на другую
     (например, добавь ссылку «Следующий пост»)? Обновятся ли данные?

  Подсказки — в файле hints.md рядом.
-->
<script setup>
</script>

<template>
  <div>
    <h1>Блог</h1>
    <!-- TODO: RouterView -->
  </div>
</template>
