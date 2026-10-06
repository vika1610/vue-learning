# Подсказки · Неделя 3 · День 2

<details>
<summary>Подсказка 1 — намёк</summary>

Props — это «параметры» компонента, как аргументы у функции. Родитель передаёт их через атрибуты, ребёнок объявляет, какие ждёт.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- В `<script setup>` props объявляются макросом `defineProps` — импортировать его не нужно.
- Объявление с типами:
  ```js
  const props = defineProps({
    title: { type: String, required: true },
    // ...
  })
  ```
- В шаблоне ребёнка props доступны напрямую: `{{ title }}`.
- Передача числа: `:price="1200"` (с двоеточием!). Без двоеточия придёт строка `"1200"`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В родителе:

```vue
<ProductCard
  v-for="product in products"
  :key="product.id"
  :title="product.title"
  :price="/* ? */"
  :image="/* ? */"
/>
```

Короткий способ передать все поля объекта сразу: `v-bind="product"` — попробуй и разберись, как это работает.

Значение по умолчанию: `inStock: { type: Boolean, default: true }`.

</details>
