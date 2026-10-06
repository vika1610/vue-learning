<!--
  Неделя 6 · День 2 · Магазин

  Теория: pinia.vuejs.org — «State», «Getters», «Actions», storeToRefs.
  JS-разминка (10 мин): reduce (повтор).

  API: https://fakestoreapi.com/products — массив товаров { id, title, price, image, category }.

  Условие:
  1. Стор stores/products.js:
     - state: товары, loading, error;
     - action fetchProducts() — загружает товары из API (с loading и error);
     - getters: categories (список уникальных категорий), количество товаров,
       средняя цена (через reduce).
  2. Компонент ProductList.vue (или прямо здесь): вызывает fetchProducts при монтировании
     и выводит карточки: картинка, название, цена.
  3. Пока грузится — «Загрузка…», при ошибке — сообщение.
  4. Фильтр по категории: выпадающий список <select> с категориями из getter.
  5. Достань данные из стора через storeToRefs и проверь, что реактивность
     сохраняется. Затем попробуй обычную деструктуризацию const { products } = store
     и посмотри, что сломается.

  Подсказки — в файле hints.md рядом.
-->
<script setup>
// TODO: используй стор товаров
</script>

<template>
  <div>
    <h1>Магазин</h1>
    <!-- TODO: фильтр, загрузка/ошибка, карточки товаров -->
  </div>
</template>

<style scoped>
/* TODO: сетка карточек */
</style>
