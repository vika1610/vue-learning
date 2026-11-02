# Конспект · Неделя 5 · День 2 — Динамические маршруты и загрузка данных

JS-разминка (шаблонные строки, `Promise.all`) → маршрут с параметром `:id` → `useRoute` → ссылки с параметрами → загрузка данных страницы → параллельные запросы → переиспользование компонента → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: router.vuejs.org/ru → «Динамические маршруты», «Получение данных».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Параметры маршрута** | разминка → часть 1 (`:id`) → часть 2 (`useRoute`) → часть 3 (ссылки) → 3 вопроса | 60 мин |
| **2. Загрузка данных + практика** | повтор → часть 4 (загрузка) → часть 5 (`Promise.all`) → часть 6 (тот же компонент) → задача «Блог» | 60 мин |
| **3. Options API** | (доделать блог, если нужно) → часть 7 → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. Параметры маршрута

## Разминка (10 мин): шаблонные строки и `Promise.all`

```js
const id = 7
const url = `https://jsonplaceholder.typicode.com/posts/${id}/comments`

const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms))

console.time('по очереди')
const a = await wait(1000, 'A')
const b = await wait(1000, 'B')
console.timeEnd('по очереди')     // ≈ ?

console.time('параллельно')
const [c, d] = await Promise.all([wait(1000, 'C'), wait(1000, 'D')])
console.timeEnd('параллельно')    // ≈ ?
```

<details>
<summary>Ответ</summary>

- `url` → `'https://jsonplaceholder.typicode.com/posts/7/comments'`.
- «по очереди» ≈ **2000 мс**: второй `await` ждёт, пока закончится первый.
- «параллельно» ≈ **1000 мс**: оба промиса запущены сразу, `Promise.all` ждёт, когда закончатся **оба**, и возвращает массив результатов `['C', 'D']`.

Запусти этот код в консоли браузера: на верхнем уровне консоли `await` работает (день 5 недели 0). Сегодня так будут загружаться пост и его комментарии.

</details>

---

## Часть 1. Маршрут с параметром

### Проблема

В блоге 100 постов. Создавать 100 маршрутов `/posts/1`, `/posts/2`… — абсурд. Нужен **один** маршрут для всех постов, а номер — переменная часть.

### Решение: `:параметр`

```js
const routes = [
  { path: '/', component: PostListPage },
  { path: '/posts/:id', component: PostPage },
]
```

Двоеточие `:id` значит: «здесь может быть что угодно, назови это `id`». Один маршрут обслуживает `/posts/1`, `/posts/42`, `/posts/hello`.

Можно несколько параметров:

```js
{ path: '/users/:userId/posts/:postId', component: UserPostPage }
```

---

## Часть 2. `useRoute` — где я и с какими параметрами

На странице нужно узнать, **какой** пост открыт:

```vue
<!-- pages/PostPage.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <h1>Пост №{{ route.params.id }}</h1>
</template>
```

- `useRoute()` — композабл из Vue Router (как твои `use…`) — возвращает **текущий маршрут**;
- `route.params` — объект с параметрами: `{ id: '42' }`.

Это ответ на вопрос недели «Как получить параметр `id` из адреса?».

### Что ещё есть в `route`

```js
route.path      // '/posts/42'
route.params    // { id: '42' }
route.query     // для /posts?sort=new → { sort: 'new' }
route.hash      // для /posts#comments → '#comments'
route.fullPath  // '/posts/42?sort=new#comments'
```

### ⚠️⚠️ Параметры — всегда строки

```js
route.params.id          // '42' — строка!
route.params.id === 42   // false 😱
```

Всё, что пришло из адреса, — **строка**, как значение `<input>` (день 5 недели 1). Если сравниваешь с числовыми `id` из данных:

```js
const post = posts.find((p) => p.id === Number(route.params.id))   // ✓
const post = posts.find((p) => p.id === route.params.id)           // ✗ никогда не найдёт
```

### ⚠️ `route` реактивный — не деструктурируй

```js
const { params } = useRoute()   // ⚠️ params зафиксируется на момент вызова
```

`route` — реактивный объект. Помнишь ловушку «деструктуризация `reactive` теряет реактивность»? Здесь та же история: работай через `route.params.id`.

---

## Часть 3. Ссылки с параметрами

### Строкой

```vue
<RouterLink :to="`/posts/${post.id}`">{{ post.title }}</RouterLink>
```

⚠️ Обрати внимание на **двоеточие** перед `to`: значение — JS-выражение (шаблонная строка), а не просто текст. Без `:` ссылка буквально уйдёт на адрес `` `/posts/${post.id}` ``.

### Объектом с именем маршрута

Маршрутам можно давать **имена**:

```js
{ path: '/posts/:id', name: 'post', component: PostPage }
```

```vue
<RouterLink :to="{ name: 'post', params: { id: post.id } }">{{ post.title }}</RouterLink>
```

Плюс: если завтра адрес поменяется на `/blog/:id`, ссылки по имени менять не придётся. Подробнее — на дне 3.

### Query-параметры

```vue
<RouterLink :to="{ path: '/', query: { page: 2 } }">Страница 2</RouterLink>
<!-- → /?page=2 -->
```

Удобно для фильтров, сортировки и номера страницы: в адресе, но не в пути.

---

### ✅ Проверь себя — занятие 1

1. Как объявить маршрут, который обслуживает `/products/1`, `/products/2` и так далее?
2. Как на странице узнать номер товара из адреса? Какого типа будет значение?
3. Почему `<RouterLink to="`/posts/${id}`">` не работает?

---

## 🛑 Конец занятия 1

5 минут на заметку.

Вопрос-повтор для следующего занятия: **почему `route.params.id === 42` даёт `false`, даже если в адресе `/posts/42`?**

---

# Занятие 2. Загрузка данных

## Часть 4. Загрузка данных на странице

Страница поста должна **загрузить** пост с сервера. Тут пригодится всё: три состояния (неделя 0), `ref` (неделя 1), `v-if` (неделя 2), композаблы (неделя 4).

### Простой вариант

```vue
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)
const loading = ref(false)
const error = ref(null)

async function load(id) {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    if (!res.ok) throw new Error(`статус ${res.status}`)
    user.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

load(route.params.id)
</script>

<template>
  <p v-if="loading">Загрузка…</p>
  <p v-else-if="error">Ошибка: {{ error }}</p>
  <article v-else-if="user">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </article>
</template>
```

Пример про **пользователя** `/users/:id`, а в задаче будет пост — по аналогии.

Узнаёшь? Это почти твой `useFetch`. Можно ли использовать его прямо здесь — `useFetch(\`.../users/${route.params.id}\`)`? Да, но с оговоркой — часть 6.

---

## Часть 5. Параллельные запросы

На странице поста нужно **два** запроса: сам пост и его комментарии. Они **не зависят** друг от друга, поэтому их можно отправить одновременно:

```js
const [userRes, todosRes] = await Promise.all([
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
  fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`),
])
```

- `Promise.all` получает **массив** промисов и возвращает промис с **массивом** результатов в том же порядке;
- деструктуризация массива (день 3 недели 0) раскладывает результаты по переменным;
- после этого у **каждого** ответа проверь `ok` и вызови `.json()`.

### ⚠️ `json()` тоже можно ждать параллельно

```js
const [user, todos] = await Promise.all([userRes.json(), todosRes.json()])
```

### ⚠️ Если один запрос упал

`Promise.all` отклоняется, как только **любой** промис упал. Значит, при ошибке комментариев не покажется и пост. Для учебного блога это нормально: один `catch` на всё. (Если нужно «показать то, что загрузилось», есть `Promise.allSettled` — пока достаточно знать, что он существует.)

---

## Часть 6. ⚠️ Тот же компонент — другие данные

Добавь на страницу поста ссылку «Следующий пост» (`/posts/2` → `/posts/3`). Кликни. Адрес поменялся… а пост на странице **остался старым**!

### Почему

Роутер видит, что `/posts/2` и `/posts/3` — **один и тот же** маршрут `/posts/:id` с тем же компонентом. Пересоздавать компонент незачем, поэтому роутер **переиспользует** его и просто меняет `route.params`. А код в `<script setup>` (и `load(route.params.id)`) выполняется **один раз** — при создании (день 5 недели 2). Второй раз он не запустится.

Это вопрос 5 из условия задачи.

### Решение: следить за параметром

Нужно действие в ответ на изменение данных — `watch` (день 4 недели 2):

```js
watch(
  () => route.params.id,      // поле реактивного объекта — через функцию!
  (id) => load(id),
  { immediate: true },        // и сразу при создании
)
```

- `() => route.params.id` — источник через функцию: `route` реактивный, а `route.params.id` сам по себе — просто строка (ловушка дня 4 недели 2);
- `immediate: true` — загрузить и при первом открытии. Тогда отдельный `load(route.params.id)` не нужен.

### А как же `useFetch`?

Если `useFetch(url)` принимает обычную строку, он загрузит данные **один раз** — та же проблема. Помнишь мини-задачу дня 1 недели 4: `useFetch`, который принимает `ref` или функцию с адресом и перезагружает при изменении (`toValue` + `watchEffect`)? Вот где она по-настоящему нужна:

```js
const { data: user } = useFetch(() => `https://jsonplaceholder.typicode.com/users/${route.params.id}`)
```

Если ты сделала эту мини-задачу — попробуй здесь. Если нет — `watch` выше тоже отличный вариант.

### Другой способ: `key` на `RouterView`

```vue
<RouterView :key="$route.fullPath" />
```

Помнишь, `key` говорит Vue, какой элемент какой (день 1 недели 2)? Если ключ меняется — компонент **пересоздаётся**. Работает, но пересоздаёт всю страницу при каждом изменении адреса. `watch` точнее.

---

## 🛠 Практика: «Блог на jsonplaceholder» (≈ 35 мин)

Открой `Exercise.vue` и `setup.js` рядом с этим файлом. Подсказки — в `hints.md`.

| Этап | Что сделать |
|---|---|
| 1 | роутер с двумя маршрутами и `RouterView` в `Exercise.vue` |
| 2 | список постов (можно первые 10–20: `?_limit=20`) со ссылками |
| 3 | страница поста: параметр, загрузка поста |
| 4 | комментарии параллельно через `Promise.all`, лоадер и ошибка |
| 5 | «← Ко всем постам» и «Следующий пост» — проверь часть 6 |

> Если час закончился на этапе 4 или 5 — продолжи на занятии 3.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 5 день 2» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему при переходе с `/posts/2` на `/posts/3` компонент не загрузил новый пост и как это исправить?**

---

# Занятие 3. 📜 Options API

## Часть 7. 📜 Динамические маршруты в Options API

### `this.$route.params`

**Composition API:**

```js
const route = useRoute()

watch(
  () => route.params.id,
  (id) => load(id),
  { immediate: true },
)
```

**Options API:**

```js
export default {
  data() {
    return { user: null, loading: false, error: null }
  },
  watch: {
    '$route.params.id': {
      handler(id) {
        this.load(id)
      },
      immediate: true,
    },
  },
  methods: {
    async load(id) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        if (!res.ok) throw new Error(`статус ${res.status}`)
        this.user = await res.json()
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
}
```

- путь к полю в `watch` — **строкой** `'$route.params.id'` (день 4 недели 2);
- `async` у метода — нормально: методы могут быть асинхронными. А вот `computed` и хуки делать `async` не стоит.

### Без `immediate`: `created` + `watch`

В рабочем коде часто встречается и такой вариант:

```js
created() {
  this.load(this.$route.params.id)
},
watch: {
  '$route.params.id'(id) {
    this.load(id)
  },
},
```

Это то же самое, что `immediate: true`, только в две части. Если в рабочем компоненте данные «не обновляются при переходе между похожими страницами», проверь: есть ли там наблюдатель за `$route`?

### Параметры как props

Есть способ вообще не трогать `$route` в компоненте — передать параметры **как props**:

```js
{ path: '/users/:id', component: UserPage, props: true }
```

```js
// UserPage.vue — работает одинаково в обоих стилях
defineProps({ id: String })     // Composition API
props: { id: String }           // Options API
```

Компонент становится проще и не зависит от роутера: его можно использовать и без маршрута. Наблюдать при этом нужно уже за prop: `watch(() => props.id, ...)` или `watch: { id(newId) {...} }`.

---

### ✅ Проверь себя — занятие 3

1. Как в Options API следить за изменением `id` в адресе?
2. Что даёт опция маршрута `props: true`?

---

## 🛠 Бонус-практика (≈ 20 мин)

Сделай `pages/PostPageOptions.vue` — страницу поста на Options API (`data`, `watch` на `'$route.params.id'` с `immediate`, `async`-метод `load`). Временно замени в `setup.js` компонент маршрута `/posts/:id` на неё и убедись, что всё работает так же, включая «Следующий пост». Потом верни как было.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `path: '/posts/:id'` | один маршрут для всех постов |
| `useRoute()` | текущий маршрут |
| `route.params.id` | параметр — всегда **строка** |
| `route.query` | `?a=1&b=2` → `{ a: '1', b: '2' }` |
| Не деструктурировать | `route` реактивный |
| Ссылка | `:to="\`/posts/${id}\`"` — с двоеточием |
| Ссылка по имени | `:to="{ name: 'post', params: { id } }"` |
| Параллельно | `await Promise.all([fetch(a), fetch(b)])` |
| Один упал | упал весь `Promise.all` |
| Тот же маршрут — другой `id` | компонент **переиспользуется** |
| Решение | `watch(() => route.params.id, load, { immediate: true })` |
| Или | `<RouterView :key="$route.fullPath" />` |
| `props: true` | параметры приходят как props |
| 📜 Options API | `this.$route.params.id`; `watch: { '$route.params.id': { handler, immediate } }` |

## 🛑 Конец занятия 3 — день 2 недели 5 пройден

Напиши наставнику «проверь неделю 5 день 2 Options API» и сделай заметку.
