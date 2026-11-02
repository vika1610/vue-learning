# Конспект · Неделя 2 · День 2 — Обработка событий и модификаторы

JS-разминка (события DOM, `preventDefault`, всплытие) → `v-on` / `@` → функция или выражение → аргументы и `$event` → модификаторы событий → модификаторы клавиш → добавление и удаление в списке → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «Обработка событий».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. События** | разминка → часть 1 (`@` подробно) → часть 2 (аргументы и `$event`) → часть 3 (модификаторы событий) → 3 вопроса | 60 мин |
| **2. Клавиши, списки + практика** | повтор → часть 4 (клавиши) → часть 5 (добавить/удалить/отметить) → 3 вопроса → задача «Список покупок» | 60 мин |
| **3. Options API** | повтор → часть 6 → 2 вопроса → бонус `ExerciseOptions.vue` | 60 мин |

---

# Занятие 1. События во Vue

## Разминка (10 мин): события DOM, `preventDefault`, всплытие

### `preventDefault` — отменить действие браузера по умолчанию

У некоторых событий есть **действие по умолчанию**: клик по ссылке открывает адрес, отправка формы **перезагружает страницу**. Отменить его можно так:

```js
form.addEventListener('submit', (event) => {
  event.preventDefault()   // страница не перезагрузится
  console.log('отправляем сами')
})
```

### Всплытие

Событие, случившееся на элементе, **всплывает** вверх по родителям. Что выведет клик по кнопке?

```html
<div id="card">
  <button id="like">❤️</button>
</div>
```

```js
document.getElementById('card').addEventListener('click', () => console.log('клик по карточке'))
document.getElementById('like').addEventListener('click', () => console.log('лайк'))
```

<details>
<summary>Ответ</summary>

Сначала `лайк`, потом `клик по карточке`. Событие сработало на кнопке и всплыло к родителю `div`.

Если клик по карточке открывает подробности товара, а кнопка ❤️ должна только поставить лайк, всплытие мешает: лайк заодно откроет карточку. Остановить всплытие можно через `event.stopPropagation()`.

Обе вещи — `preventDefault` и `stopPropagation` — во Vue делаются одним словом, через **модификаторы**. Сегодня ты их узнаешь.

</details>

---

## Часть 1. `v-on` и `@`

### Синтаксис

На дне 3 недели 1 ты уже использовала `@click`. Это короткая запись директивы `v-on`:

```vue
<button v-on:click="like">❤️</button>
<button @click="like">❤️</button>      <!-- то же самое, так пишут почти всегда -->
```

После `@` — **имя события**, без приставки `on`. Любое событие DOM:

| Событие | Когда |
|---|---|
| `@click` | клик |
| `@dblclick` | двойной клик |
| `@input` | ввод в поле (каждый символ) |
| `@change` | значение поля изменилось и фокус ушёл |
| `@submit` | отправка формы |
| `@keyup` / `@keydown` | клавиша отпущена / нажата |
| `@mouseenter` / `@mouseleave` | курсор вошёл в элемент / вышел из него |
| `@focus` / `@blur` | поле получило / потеряло фокус |

### Два вида обработчика

**1. Имя функции** — для всего, что длиннее одной операции:

```vue
<script setup>
import { ref } from 'vue'

const likes = ref(0)

function like() {
  likes.value++
  console.log('лайкнули')
}
</script>

<template>
  <button @click="like">❤️ {{ likes }}</button>
</template>
```

**2. Выражение прямо в шаблоне** — для одной короткой операции:

```vue
<button @click="likes++">❤️ {{ likes }}</button>
<button @click="isOpen = !isOpen">Меню</button>
```

Правило: **одна короткая операция — можно в шаблоне; больше — в функцию с понятным именем.**

### ⚠️ `onclick` — нет такого события

```vue
<button @onclick="like">   ✗ события «onclick» нет — молча не сработает
<button @click="like">     ✓
```

Ловушка из дня 4 недели 0: название события без `on`.

---

## Часть 2. Аргументы и `$event`

### Передать аргумент

```vue
<script setup>
import { ref } from 'vue'

const rating = ref(0)

function rate(stars) {
  rating.value = stars
}
</script>

<template>
  <button @click="rate(1)">⭐</button>
  <button @click="rate(3)">⭐⭐⭐</button>
  <button @click="rate(5)">⭐⭐⭐⭐⭐</button>
  <p>Оценка: {{ rating }}</p>
</template>
```

Со скобками и аргументом функция **не** вызывается сразу: Vue понимает, что это код для клика, и сам «заворачивает» его в функцию. Это главное отличие от `addEventListener`, где `fn()` вызывалась бы сразу.

### Аргумент из `v-for`

Чаще всего аргумент — это текущий элемент списка или его `id`:

```vue
<li v-for="comment in comments" :key="comment.id">
  {{ comment.text }}
  <button @click="removeComment(comment.id)">✕</button>
</li>
```

Каждая кнопка «знает» свой `comment.id`: переменная из `v-for` попадает в обработчик. Внутри это замыкание, тема дня 2 недели 0.

### Объект события: `event` и `$event`

Если обработчик указан **по имени**, Vue сам передаст в него объект события, как `addEventListener`:

```vue
<script setup>
function onInput(event) {
  console.log(event.target.value)   // текст в поле
}
</script>

<template>
  <input @input="onInput">
</template>
```

А если нужны **и** свой аргумент, **и** событие, используй специальную переменную `$event`:

```vue
<input @input="saveField('city', $event)">
```

```js
function saveField(name, event) {
  console.log(name, event.target.value)
}
```

`$event` — объект события, доступный только в шаблоне.

### ⚠️ С именем и со скобками — разница в `event`

```vue
<input @input="onInput">     <!-- onInput(event) — Vue передал событие -->
<input @input="onInput()">   <!-- onInput() — событие НЕ передано, внутри event = undefined -->
```

Если в функции нужен `event`, а ты вызываешь её со скобками, — передай `$event` явно.

---

## Часть 3. Модификаторы событий

**Модификатор** — суффикс через точку после имени события. Он меняет поведение обработчика без лишнего кода в функции.

### `.prevent` — отменить действие по умолчанию

```vue
<form @submit.prevent="send">
  <input>
  <button>Отправить</button>
</form>
```

То же, что `event.preventDefault()` в разминке: форма **не перезагрузит страницу**. Это ответ на вопрос недели «Что делает модификатор `.prevent`?».

### ⚠️⚠️ Форма без `.prevent` перезагружает страницу

```vue
<form @submit="send">   ✗ send выполнится, но страница сразу перезагрузится — все данные пропадут
```

Признак: ты нажимаешь кнопку, на мгновение что-то мелькает, и всё сбрасывается, а в консоли пусто (она тоже очистилась при перезагрузке). Почти всегда это забытый `.prevent`.

### Почему форма, а не просто кнопка

```vue
<!-- кнопка с @click -->
<input v-model="text">
<button @click="add">Добавить</button>

<!-- форма с @submit -->
<form @submit.prevent="add">
  <input v-model="text">
  <button>Добавить</button>
</form>
```

Второй вариант лучше: форма отправляется и по **клику на кнопку**, и по **Enter** в поле. Бесплатно, без отдельного обработчика клавиш. Кнопка внутри формы по умолчанию имеет `type="submit"`.

> ⚠️ Если в форме есть **другие** кнопки, которые не должны её отправлять (например, «Очистить»), им нужен `type="button"`: `<button type="button" @click="clear">`. Иначе они тоже отправят форму.

### `.stop` — остановить всплытие

```vue
<div class="card" @click="openDetails">
  <h3>{{ product.title }}</h3>
  <button @click.stop="like">❤️</button>
</div>
```

Клик по ❤️ поставит лайк и **не** откроет подробности. То же, что `event.stopPropagation()` в разминке.

### `.self` — только если кликнули именно по этому элементу

```vue
<div class="overlay" @click.self="closeModal">
  <div class="modal">…</div>
</div>
```

Модальное окно закроется по клику на тёмный фон вокруг, но **не** по клику внутри окна. Пригодится на неделе 3 для `Modal`.

### `.once` — сработать один раз

```vue
<button @click.once="showWelcome">Начать</button>
```

### Цепочки модификаторов

```vue
<a href="/delete" @click.prevent.stop="remove">Удалить</a>
```

Можно ставить несколько подряд.

---

### ✅ Проверь себя — занятие 1

1. Чем отличаются `@input="onInput"` и `@input="onInput()"`, если внутри функции используется `event`?
2. Что делает `.prevent` у `@submit`? Что будет без него?
3. В карточке товара клик по карточке открывает её, а внутри есть кнопка «В корзину». Как сделать, чтобы кнопка не открывала карточку?

---

## 🛑 Конец занятия 1

5 минут на заметку: что такое модификаторы и какие ты запомнила.

Вопрос-повтор для следующего занятия: **почему форма с `@submit.prevent` удобнее, чем кнопка с `@click`?**

---

# Занятие 2. Клавиши, работа со списком и практика

## Часть 4. Модификаторы клавиш

Для клавиатурных событий есть модификаторы с названиями клавиш:

```vue
<input @keyup.enter="search">     <!-- Enter -->
<input @keyup.esc="clear">        <!-- Escape -->
<input @keydown.tab="next">       <!-- Tab -->
```

Самые частые: `.enter`, `.esc`, `.tab`, `.space`, `.delete` (Delete и Backspace), `.up`, `.down`, `.left`, `.right`.

Сочетания с системными клавишами:

```vue
<input @keyup.ctrl.enter="send">   <!-- Ctrl + Enter -->
```

### `@keyup` или `@keydown`

- `@keydown` — в момент **нажатия**. Срабатывает повторно, если держать клавишу;
- `@keyup` — в момент **отпускания**. Один раз.

Для «отправить по Enter» обычно используют `@keyup.enter`. Но помни: если поле внутри `<form>`, Enter и так отправит форму. Тогда `@keyup.enter` не нужен, иначе действие выполнится **дважды**.

---

## Часть 5. Добавить, удалить, отметить в списке

Это три действия, которые нужны почти в каждом приложении. Пример — гостевая книга с комментариями:

```vue
<script setup>
import { ref, computed } from 'vue'

const comments = ref([
  { id: 1, text: 'Отличный сайт!', liked: false },
  { id: 2, text: 'Жду продолжения', liked: true },
])
const newText = ref('')

// ДОБАВИТЬ
function addComment() {
  const text = newText.value.trim()
  if (!text) return                         // пустое не добавляем
  comments.value.push({ id: Date.now(), text, liked: false })
  newText.value = ''                        // очистить поле
}

// УДАЛИТЬ
function removeComment(id) {
  comments.value = comments.value.filter((c) => c.id !== id)
}

// ОТМЕТИТЬ
function toggleLike(comment) {
  comment.liked = !comment.liked
}

const likedCount = computed(() => comments.value.filter((c) => c.liked).length)
</script>

<template>
  <form @submit.prevent="addComment">
    <input v-model="newText" placeholder="Ваш комментарий">
    <button>Отправить</button>
  </form>

  <ul>
    <li v-for="comment in comments" :key="comment.id" :class="{ liked: comment.liked }">
      {{ comment.text }}
      <button type="button" @click="toggleLike(comment)">❤️</button>
      <button type="button" @click="removeComment(comment.id)">✕</button>
    </li>
  </ul>

  <p>Понравилось: {{ likedCount }}</p>
</template>
```

### Разбор

**Добавить:**
- `trim()` убирает пробелы по краям. Без него строка из одних пробелов прошла бы проверку `if (!text)`: помнишь, `' '` — truthy;
- `return` — ранний выход: если текста нет, дальше не идём;
- после добавления очищаем поле. Благодаря `v-model` поле на странице тоже очистится.

> `v-model="newText"` связывает поле ввода с `ref`. Подробно — завтра. Пока: что пользователь ввёл, то и лежит в `newText.value`.

**Удалить:**
- `filter` создаёт **новый** массив без удалённого элемента, и мы кладём его в `comments.value`. Vue замечает замену и обновляет список;
- удаляем **по `id`**, а не по индексу: id надёжнее, особенно если список отфильтрован или отсортирован.

**Отметить:**
- в функцию передан **сам объект** комментария из `v-for`. Мы меняем его поле, и Vue это замечает: объект лежит внутри реактивного массива, а `ref` делает реактивным содержимое на любую глубину;
- это работает именно потому, что объекты передаются **по ссылке** (день 2 недели 0): `comment` в функции — тот же объект, что в массиве.

**Счётчик:**
- `computed` + `filter` + `length`: из массива получаем число. Пересчитается сам при любом лайке.

### ⚠️ Удаление через `splice` и индекс — хрупко

```js
function remove(index) {
  comments.value.splice(index, 1)   // работает, но если список отфильтрован — удалит не тот элемент
}
```

Если на странице показан **отфильтрованный** список (например, только понравившиеся), индекс в нём не совпадает с индексом в исходном массиве. Удаление по `id` такой проблемы не имеет.

### ⚠️ Две кнопки в одной строке — не забудь `type="button"`

Если строки списка лежат **внутри** `<form>`, кнопки ❤️ и ✕ без `type="button"` начнут отправлять форму. В примере выше список вне формы, но привычка `type="button"` для «не отправляющих» кнопок спасает от странных багов.

---

### ✅ Проверь себя — занятие 2

1. Почему перед добавлением строки нужен `trim()`?
2. Почему удалять лучше по `id`, а не по индексу?
3. Функция `toggleLike(comment)` меняет `comment.liked`, хотя не трогает `comments.value`. Почему страница обновляется?

---

## 🛠 Практика: «Список покупок» (≈ 30 мин)

Открой `Exercise.vue` рядом с этим файлом. Подсказки — в `hints.md`.

Советы:
- начни с формы и добавления, проверь, что страница **не перезагружается** при Enter;
- потом — удаление, потом «куплено», потом счётчик;
- бонус с `@keyup.enter`: вспомни, что будет, если поле при этом остаётся внутри формы.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 2 день 2» и сделай заметку.

Вопрос-повтор для следующего занятия: **как удалить элемент из реактивного массива по `id`?**

---

# Занятие 3. 📜 Options API

## Часть 6. 📜 События в Options API

### Шаблон — тот же, обработчики — в `methods`

`@click`, `@submit.prevent`, `@keyup.enter`, `$event`, модификаторы — **всё это шаблон**, и в Options API пишется так же. Обработчики живут в опции `methods`.

**Composition API:**

```vue
<script setup>
import { ref } from 'vue'

const comments = ref([])
const newText = ref('')

function addComment() {
  const text = newText.value.trim()
  if (!text) return
  comments.value.push({ id: Date.now(), text, liked: false })
  newText.value = ''
}

function removeComment(id) {
  comments.value = comments.value.filter((c) => c.id !== id)
}
</script>
```

**Options API:**

```vue
<script>
export default {
  data() {
    return {
      comments: [],
      newText: '',
    }
  },
  methods: {
    addComment() {
      const text = this.newText.trim()
      if (!text) return
      this.comments.push({ id: Date.now(), text, liked: false })
      this.newText = ''
    },
    removeComment(id) {
      this.comments = this.comments.filter((c) => c.id !== id)
    },
  },
}
</script>
```

Шаблон одинаковый:

```vue
<form @submit.prevent="addComment">
  <input v-model="newText">
  <button>Отправить</button>
</form>
<li v-for="c in comments" :key="c.id">
  {{ c.text }} <button @click="removeComment(c.id)">✕</button>
</li>
```

### Объект события в методе

```js
methods: {
  onInput(event) {
    console.log(event.target.value)
  },
  saveField(name, event) {
    this.form[name] = event.target.value
  },
},
```

Всё как в Composition API: по имени — событие приходит само, со скобками — передавай `$event`.

### ⚠️ Подводный камень: `this` в обработчике, переданном «наружу»

```js
methods: {
  startListening() {
    window.addEventListener('resize', this.onResize)   // ✓ в Vue 3 методы привязаны к компоненту
  },
  onResize() {
    console.log(this.comments.length)   // this — компонент
  },
},
```

В Options API Vue заранее **привязывает** все методы к компоненту, поэтому `this` в них не теряется, даже если метод передан в `addEventListener` или `setTimeout`. Это отличие от обычных объектов из дня 4 недели 0, где `this` терялся. Но такой обработчик нужно не забыть **снять** в `unmounted`. Об этом — день 5.

### Как это выглядит в рабочем коде

Часто встречается запись `@click="$emit('...')"` — это события **компонента**, тема недели 3. А `this.$refs` — доступ к DOM-элементам, тоже позже.

---

### ✅ Проверь себя — занятие 3

1. Перепиши мысленно в Options API функцию `toggleLike(comment)` из части 5.
2. В шаблоне Options API-компонента написано `@submit.prevent="addComment"`. Где искать функцию `addComment`?

---

## 🛠 Бонус-практика: список покупок в Options API (≈ 20 мин)

Открой `ExerciseOptions.vue` рядом с этим файлом. В меню задач — ссылка **«Options API»**.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `@событие="..."` | короткая запись `v-on:событие`; без `on` в имени |
| Короткое действие | выражение в шаблоне: `@click="x++"` |
| Больше одной операции | функция: `@click="doIt"` |
| Аргумент | `@click="remove(item.id)"` — вызов не сразу, а по клику |
| Событие по имени | `@input="fn"` → `fn(event)` |
| Событие со скобками | `@input="fn('a', $event)"` |
| `.prevent` | `preventDefault`; у `@submit` — обязательно |
| `.stop` | остановить всплытие |
| `.self` | только по самому элементу |
| `.once` | один раз |
| `@keyup.enter` / `.esc` | клавиши |
| Форма | Enter и кнопка — одним `@submit.prevent` |
| Кнопка «не отправлять» | `type="button"` |
| Добавить | `trim()` → проверка → `push` → очистить поле |
| Удалить | `filter` по `id` |
| Отметить | поменять поле объекта из `v-for` |
| 📜 Options API | шаблон тот же; обработчики в `methods`, данные через `this.` |

## 🛑 Конец занятия 3 — день 2 недели 2 пройден

Напиши наставнику «проверь неделю 2 день 2 Options API» и сделай заметку.
