# Конспект · Неделя 5 · День 3 — Вложенные маршруты, 404 и программная навигация

JS-разминка (обработка ошибок) → именованные маршруты → страница 404 → `useRouter`: `push`, `replace`, `back` → вложенные маршруты → «не найдено» внутри страницы → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: router.vuejs.org/ru → «Именованные маршруты», «Вложенные маршруты», «Программная навигация», «Сопоставление маршрутов» (catch-all / 404).

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Имена, 404, `useRouter`** | разминка → часть 1 (имена) → часть 2 (404) → часть 3 (`useRouter`) → 3 вопроса | 60 мин |
| **2. Вложенные маршруты + практика** | повтор → часть 4 (вложенные) → часть 5 («не найдено») → задача | 60 мин |
| **3. Options API** | (доделать, если нужно) → часть 6 → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. Имена маршрутов, 404 и `useRouter`

## Разминка (10 мин): обработка ошибок

Повтор дня 5 недели 0. Есть функция:

```js
async function loadPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!res.ok) throw new Error(`статус ${res.status}`)
  return res.json()
}
```

Что произойдёт при вызове `loadPost(9999)`? А `loadPost(1)` без интернета?

<details>
<summary>Ответ</summary>

- `loadPost(9999)`: сервер ответит **404**, `fetch` **не** выбросит ошибку сам, но `res.ok` будет `false`, и сработает **наш** `throw`. Сообщение: `статус 404`.
- Без интернета: `fetch` сам выбросит `TypeError: Failed to fetch`, до проверки `ok` дело не дойдёт.

Оба случая попадут в `catch`. Но **по-разному** их стоит показывать пользователю: «такого поста нет» и «нет связи, попробуйте позже» — разные ситуации. Сегодня научимся отличать «не найдено» от прочих ошибок.

</details>

---

## Часть 1. Именованные маршруты

```js
const routes = [
  { path: '/', name: 'home', component: PostListPage },
  { path: '/posts/:id', name: 'post', component: PostPage },
]
```

Ссылка по имени:

```vue
<RouterLink :to="{ name: 'post', params: { id: post.id } }">{{ post.title }}</RouterLink>
<RouterLink :to="{ name: 'home' }">На главную</RouterLink>
```

Зачем:
- **адрес можно поменять** в одном месте (`/posts/:id` → `/blog/:id`), а все ссылки продолжат работать;
- **не нужно склеивать строки** — меньше опечаток;
- параметры передаются объектом, и роутер сам их подставит.

### ⚠️ Имя и параметры должны совпадать с маршрутом

```vue
<RouterLink :to="{ name: 'post' }">           ✗ забыли params — ошибка: Missing required param 'id'
<RouterLink :to="{ name: 'posts', params: { id: 1 } }">   ✗ имени 'posts' нет
```

Ошибка навигации по несуществующему имени — красная, сразу видна в консоли. Это плюс: опечатку в имени заметить проще, чем в строке адреса.

---

## Часть 2. Страница 404

Если адрес не совпал ни с одним маршрутом, `RouterView` покажет **пустоту**. Нужна страница «Не найдено».

### Маршрут «всё остальное»

```js
import NotFoundPage from './pages/NotFoundPage.vue'

const routes = [
  { path: '/', name: 'home', component: PostListPage },
  { path: '/posts/:id', name: 'post', component: PostPage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]
```

`/:pathMatch(.*)*` — параметр с **регулярным выражением** (разминка дня 4 недели 2): `.*` — «любые символы, сколько угодно». Такой маршрут совпадёт с **любым** адресом.

Роутер выбирает **наиболее точное** совпадение, поэтому «ловушка всего» сработает только тогда, когда ничего другого не подошло. Но для читаемости её принято ставить **последней** в списке.

### Страница

```vue
<!-- pages/NotFoundPage.vue -->
<template>
  <h1>404 — страница не найдена</h1>
  <p>Такой страницы нет. Может, адрес с опечаткой?</p>
  <RouterLink :to="{ name: 'home' }">На главную</RouterLink>
</template>
```

Проверь: открой `#/abracadabra`.

---

## Часть 3. `useRouter` — программная навигация

`RouterLink` — переход по **клику на ссылку**. А если перейти нужно **из кода**: после отправки формы, после удаления, по кнопке «Назад»? Для этого есть сам роутер:

```js
import { useRouter } from 'vue-router'

const router = useRouter()
```

| Метод | Что делает |
|---|---|
| `router.push('/posts/1')` | перейти; запись добавится в историю (можно вернуться «Назад») |
| `router.push({ name: 'post', params: { id: 1 } })` | то же по имени |
| `router.replace(...)` | перейти, **заменив** текущую запись истории (вернуться «Назад» сюда нельзя) |
| `router.back()` | назад, как кнопка браузера |
| `router.forward()` | вперёд |
| `router.go(-2)` | на две страницы назад |

Мнемоника из дня 1: **`useRoute` — «где я», `useRouter` — «пульт»**. Одна буква разницы!

### Примеры

```js
// после сохранения формы — на страницу созданного
async function save() {
  const created = await createPost(form)
  router.push({ name: 'post', params: { id: created.id } })
}

// кнопка «Назад»
function goBack() {
  router.back()
}
```

### `push` или `replace`

- `push` — обычный переход: пользователь может вернуться;
- `replace` — когда **возвращаться не нужно**: например, после входа на сайт со страницы «Вход» нет смысла возвращаться на «Вход» кнопкой «Назад». Завтра это пригодится.

### ⚠️ `router.back()`, если истории нет

Если пользователь открыл пост **по прямой ссылке** (из закладки), «назад» уведёт его **с сайта** — на предыдущую вкладку или пустую страницу. Иногда лучше явная ссылка «Ко всем постам» (`RouterLink`), а иногда — «Назад». В задаче есть и то и другое — подумай, где что уместно.

---

### ✅ Проверь себя — занятие 1

1. Зачем давать маршрутам имена?
2. Как сделать, чтобы на любой несуществующий адрес показывалась страница 404?
3. Чем `router.push` отличается от `router.replace`? Приведи пример, когда нужен `replace`.

---

## 🛑 Конец занятия 1

5 минут на заметку.

Вопрос-повтор для следующего занятия: **чем `useRoute` отличается от `useRouter`?**

---

# Занятие 2. Вложенные маршруты и практика

## Часть 4. Вложенные маршруты

### Задача

На странице пользователя — вкладки «Профиль» и «Задачи». Шапка с именем видна всегда, а под ней — содержимое вкладки. И у каждой вкладки свой адрес:

```
/users/3            → шапка + профиль
/users/3/todos      → шапка + список задач
```

### `children`

```js
import UserPage from './pages/UserPage.vue'
import UserProfile from './pages/UserProfile.vue'
import UserTodos from './pages/UserTodos.vue'

const routes = [
  {
    path: '/users/:id',
    component: UserPage,
    children: [
      { path: '', name: 'user-profile', component: UserProfile },   // /users/3
      { path: 'todos', name: 'user-todos', component: UserTodos },  // /users/3/todos
    ],
  },
]
```

- `children` — маршруты **внутри** родительского;
- путь ребёнка пишется **без** `/` в начале: `'todos'`, а не `'/todos'`. Он **добавляется** к пути родителя;
- `path: ''` — ребёнок «по умолчанию», для `/users/3` без продолжения.

### Второй `RouterView` — внутри родителя

```vue
<!-- pages/UserPage.vue -->
<template>
  <header>
    <h1>Пользователь №{{ $route.params.id }}</h1>
    <nav>
      <RouterLink :to="{ name: 'user-profile', params: { id: $route.params.id } }">Профиль</RouterLink>
      <RouterLink :to="{ name: 'user-todos', params: { id: $route.params.id } }">Задачи</RouterLink>
    </nav>
  </header>

  <RouterView />   <!-- сюда — UserProfile или UserTodos -->
</template>
```

Получается «матрёшка»:

```
Exercise.vue:  <RouterView />  ──► UserPage
                                    <RouterView />  ──► UserProfile или UserTodos
```

Каждый уровень `children` — свой `RouterView` в компоненте-родителе.

### Параметры родителя доступны ребёнку

`UserTodos` может прочитать `route.params.id` через свой `useRoute()` — параметры **общие** для всей цепочки. Так вкладка «Задачи» сама загрузит задачи нужного пользователя.

### ⚠️ Ведущий `/` в пути ребёнка

```js
children: [
  { path: '/todos', component: UserTodos },   // ⚠️ это уже /todos от корня, а не /users/3/todos
]
```

### ⚠️ Забыла `RouterView` в родителе

Если у маршрута есть `children`, а в его компоненте нет `<RouterView />`, вложенные страницы **некуда** показать — будет только родитель.

---

## Часть 5. «Не найдено» внутри страницы

Адрес `/posts/9999` **совпадает** с маршрутом `/posts/:id`, поэтому страница 404 **не** покажется. Но такого поста нет: jsonplaceholder ответит 404.

Тут два варианта.

**1. Показать сообщение на самой странице.** Отличаем «не найдено» от других ошибок:

```js
const notFound = ref(false)

async function load(id) {
  notFound.value = false
  error.value = null
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
  if (res.status === 404) {
    notFound.value = true
    return
  }
  // ...
}
```

```vue
<p v-if="notFound">Такого пользователя нет 🤷</p>
```

**2. Перевести на страницу 404 через роутер:**

```js
if (res.status === 404) {
  router.replace({
    name: 'not-found',
    params: { pathMatch: route.path.substring(1).split('/') },
    query: route.query,
    hash: route.hash,
  })
  return
}
```

`replace`, а не `push`: на неправильную страницу незачем возвращаться кнопкой «Назад». Длинная запись с `pathMatch` нужна, чтобы в адресе остался исходный путь. Это пример из документации Vue Router — можно скопировать как есть.

Первый вариант проще, второй — «правильнее». Выбери сама.

---

## 🛠 Практика: «404, “Назад” и вложенные маршруты» (≈ 35 мин)

Открой `Exercise.vue` и `setup.js` рядом с этим файлом. Условие — в `Exercise.vue`, подсказки — в `hints.md`.

| Этап | Что сделать |
|---|---|
| 1 | скопируй блог из `week5/day2`: `pages/`, роутер, `Exercise.vue` |
| 2 | имена маршрутов, хотя бы одна ссылка по имени |
| 3 | страница 404 — проверь `#/abracadabra` |
| 4 | кнопка «Назад» через `useRouter` |
| 5 | вложенная вкладка `/posts/:id/comments` со своим `RouterView` |
| 6 | «не найдено» для `/posts/9999` |

> Если час закончился раньше — продолжи на занятии 3.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 5 день 3» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему путь вложенного маршрута пишут без `/` в начале?**

---

# Занятие 3. 📜 Options API

## Часть 6. 📜 Навигация в Options API

### `this.$router` вместо `useRouter()`

| Composition API | Options API |
|---|---|
| `const router = useRouter()` | — (уже есть `this.$router`) |
| `router.push({ name: 'home' })` | `this.$router.push({ name: 'home' })` |
| `router.back()` | `this.$router.back()` |
| `const route = useRoute()` | — (уже есть `this.$route`) |
| `route.params.id` | `this.$route.params.id` |

```vue
<script>
export default {
  methods: {
    goBack() {
      this.$router.back()
    },
    openUser(id) {
      this.$router.push({ name: 'user-profile', params: { id } })
    },
  },
}
</script>

<template>
  <button @click="goBack">← Назад</button>
  <!-- в шаблоне можно и без метода: -->
  <button @click="$router.back()">← Назад</button>
</template>
```

### Таблица маршрутов, `children`, 404 — без изменений

Всё, что описано в `createRouter({ routes })`, не зависит от стиля компонентов. Вложенные маршруты, имена, `/:pathMatch(.*)*` — одинаковы.

### ⚠️ `this.$router` внутри стрелки и обычной функции

```js
methods: {
  saveAndGo() {
    setTimeout(() => this.$router.push('/'), 500)           // ✓
    setTimeout(function () { this.$router.push('/') }, 500) // ✗ this потерян
  },
},
```

Та же ловушка, что с `this.$emit`.

### В рабочем коде

Если ищешь, где в рабочем проекте делаются переходы, поиск по `$router.push` и `router.push` найдёт оба стиля. А таблица маршрутов обычно лежит в `src/router/index.js` — открой её, чтобы увидеть карту всего приложения.

---

### ✅ Проверь себя — занятие 3

1. Как в Options API сделать переход на страницу поста с `id = 5` по имени маршрута?
2. Нужно ли что-то менять в таблице маршрутов, если компоненты написаны на Options API?

---

## 🛠 Бонус-практика (≈ 20 мин)

Сделай `pages/NotFoundPageOptions.vue` на Options API: заголовок, текущий путь из `$route.fullPath` («Страницы `…` не существует») и две кнопки — «Назад» (`this.$router.back()`) и «На главную» (`this.$router.push({ name: 'home' })`). Подключи её в маршрут 404 вместо обычной.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `name: 'post'` | имя маршрута |
| Ссылка по имени | `:to="{ name: 'post', params: { id } }"` |
| 404 | `{ path: '/:pathMatch(.*)*', component: NotFound }` последним |
| `useRouter()` | пульт: `push`, `replace`, `back`, `go` |
| `push` / `replace` | с записью в историю / с заменой записи |
| `back()` | может увести с сайта, если открыли по прямой ссылке |
| `children` | вложенные маршруты; путь без `/` в начале |
| `path: ''` | ребёнок по умолчанию |
| Вложенный `RouterView` | в компоненте родительского маршрута |
| Параметры родителя | видны и в детях через `useRoute()` |
| `/posts/9999` | маршрут совпал — 404 нужно обработать на странице |
| 📜 Options API | `this.$router.push(...)`, `this.$router.back()`; в шаблоне `$router` |

## 🛑 Конец занятия 3 — день 3 недели 5 пройден

Напиши наставнику «проверь неделю 5 день 3 Options API» и сделай заметку.
