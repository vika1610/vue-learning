# Подсказки · Неделя 5 · День 2 · Блог

<details>
<summary>Подсказка 1 — намёк</summary>

- Часть адреса с двоеточием (`:id`) — **параметр**. Один маршрут обслуживает `/posts/1`, `/posts/2` и так далее.
- Загрузка данных со «Загрузка…» и ошибкой — ты это уже делала в неделе 0 (день 5) и, возможно, в `useFetch` на неделе 4.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Маршрут: `{ path: '/posts/:id', component: PostPage }`.
- В странице: `import { useRoute } from 'vue-router'`, `const route = useRoute()`, параметр — `route.params.id` (это **строка**).
- Ссылка с параметром: `` <RouterLink :to="`/posts/${post.id}`"> ``.
- `Promise.all([fetch(...), fetch(...)])` ждёт оба запроса сразу — быстрее, чем по очереди.
- Ответ на вопрос 5: компонент **не пересоздаётся** при смене только параметра, поэтому `onMounted` второй раз не вызовется. Как отследить изменение `route.params.id`? (вспомни неделю 2, день 4)

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
async function load(id) {
  loading.value = true
  error.value = ''
  try {
    const [postRes, commentsRes] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
      fetch(/* ? */),
    ])
    // проверить ok, достать json из обоих
  } catch (e) {
    // ...
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, (id) => load(id), { immediate: true })
```

`immediate: true` — запустить сразу, не дожидаясь первого изменения.

</details>
