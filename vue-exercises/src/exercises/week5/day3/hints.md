# Подсказки · Неделя 5 · День 3 · 404 и вложенные маршруты

<details>
<summary>Подсказка 1 — намёк</summary>

- 404: нужен маршрут, который совпадает с **чем угодно**. В документации это называется catch-all и использует параметр с регулярным выражением.
- Вложенный маршрут — это `RouterView` **внутри** страницы, которая сама показана через `RouterView`.
- `useRoute()` — «где я сейчас» (читать). `useRouter()` — «пульт управления» (переходить, назад, вперёд).

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- 404: `{ path: '/:pathMatch(.*)*', component: NotFoundPage }`.
- Вложенность — через `children`:
  ```js
  {
    path: '/posts/:id',
    component: PostPage,
    children: [
      { path: 'comments', component: PostComments },
    ],
  }
  ```
  Путь ребёнка пишется **без** ведущего `/`.
- В `PostPage.vue` добавь свой `<RouterView />` — там появятся комментарии.
- «Назад»: `const router = useRouter()`, затем `router.back()`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

- Если пост не найден, jsonplaceholder возвращает **404**, значит `response.ok === false` — сделай отдельное состояние «не найдено». Или переведи пользователя на страницу 404: `router.replace({ name: 'not-found', ... })`.
- Где загружать комментарии? Вариант: `PostComments.vue` сам загружает их по `route.params.id` — параметр родителя доступен и ребёнку.
- Имя маршрута: `{ path: '/posts/:id', name: 'post', ... }` → `:to="{ name: 'post', params: { id: post.id } }"`.

</details>
