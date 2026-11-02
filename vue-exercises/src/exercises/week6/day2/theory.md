# Конспект · Неделя 6 · День 2 — `state`, `getters`, `actions` и `storeToRefs`

JS-разминка (`reduce`) → состояние подробно → геттеры подробно → действия, в том числе асинхронные → `storeToRefs` → что хранить в сторе, а что в компоненте → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: pinia.vuejs.org → «State», «Getters», «Actions».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Устройство стора** | разминка → часть 1 (state) → часть 2 (getters) → часть 3 (actions) → 3 вопроса | 60 мин |
| **2. `storeToRefs` + практика** | повтор → часть 4 (`storeToRefs`) → часть 5 (стор или компонент) → задача «Магазин» | 60 мин |
| **3. Options API** | (доделать, если нужно) → часть 6 → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. Устройство стора подробно

## Разминка (10 мин): `reduce`

```js
const books = [
  { title: 'Дюна', price: 900, genre: 'фантастика' },
  { title: 'Мастер и Маргарита', price: 600, genre: 'классика' },
  { title: 'Солярис', price: 700, genre: 'фантастика' },
]

const total = books.reduce((sum, b) => sum + b.price, 0)            // 1
const avg = total / books.length                                    // 2
const genres = [...new Set(books.map((b) => b.genre))]              // 3
const byGenre = books.reduce((acc, b) => {
  acc[b.genre] = (acc[b.genre] ?? 0) + 1
  return acc
}, {})                                                              // 4
```

<details>
<summary>Ответ</summary>

1. `2200`.
2. `733.33…` — ⚠️ и если массив пустой, будет `0 / 0` = `NaN`. Проверяй длину!
3. `['фантастика', 'классика']` — `Set` хранит только **уникальные** значения, а `[...set]` превращает его обратно в массив.
4. `{ фантастика: 2, классика: 1 }` — подсчёт по группам, который мы разбирали на неделе 0 «по листочку».

Все четыре — готовые геттеры для сегодняшнего магазина.

</details>

---

## Часть 1. `state` — состояние

### Что класть в state

Только **исходные** данные — то, что нельзя вычислить из другого:

```js
// setup-стор
const books = ref([])
const loading = ref(false)
const error = ref(null)
```

```js
// options-стор
state: () => ({
  books: [],
  loading: false,
  error: null,
}),
```

⚠️ Правило недели 1 работает и здесь: **не храни вычисляемое**. Количество книг, средняя цена, список жанров — это **геттеры**, а не state.

### Изменить несколько полей сразу: `$patch`

```js
store.$patch({ loading: false, error: null })
```

Одна запись в истории DevTools вместо двух. Удобно, но необязательно: можно менять и по одному полю.

### Сбросить к начальному: `$reset`

```js
store.$reset()   // вернуть state к тому, что вернула функция state()
```

⚠️ `$reset` есть **только у options-сторов**: Pinia снова вызывает `state()` и берёт свежий объект. У setup-сторов его нет — если нужно, напиши своё действие `reset()`.

---

## Часть 2. `getters` — вычисляемые значения

### Обычный геттер

```js
// setup
const count = computed(() => books.value.length)
const totalPrice = computed(() => books.value.reduce((sum, b) => sum + b.price, 0))
```

```js
// options
getters: {
  count: (state) => state.books.length,
  totalPrice: (state) => state.books.reduce((sum, b) => sum + b.price, 0),
},
```

Геттеры **кэшируются**, как `computed` (день 4 недели 1): пересчитываются только при изменении state.

### Геттер из геттера

```js
// setup
const averagePrice = computed(() => (count.value ? totalPrice.value / count.value : 0))
```

```js
// options — через this, поэтому обычная функция, не стрелка
getters: {
  averagePrice() {
    return this.count ? this.totalPrice / this.count : 0
  },
},
```

⚠️ В options-сторе: если геттер использует **другие геттеры**, нужен `this`, а значит — **обычная** функция. Стрелка `(state) => ...` получает только `state`.

### Геттер с параметром

Геттеры не принимают аргументы. Но можно вернуть **функцию**:

```js
// setup
const byGenre = computed(() => (genre) => books.value.filter((b) => b.genre === genre))

// использование
store.byGenre('фантастика')
```

⚠️ Такой геттер **не кэширует** результат для разных аргументов: каждый вызов функции — новый `filter`. Часто проще сделать фильтр в компоненте через свой `computed` (часть 5).

---

## Часть 3. `actions` — действия

### Синхронные

```js
// setup
function addBook(book) {
  books.value.push(book)
}
```

```js
// options
actions: {
  addBook(book) {
    this.books.push(book)
  },
},
```

### Асинхронные — загрузка с сервера

Действие может быть `async`: это главное место для запросов к серверу.

```js
// setup-стор
async function fetchBooks() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://example.com/api/books')
    if (!res.ok) throw new Error(`статус ${res.status}`)
    books.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
```

Узнаёшь? Это твой `useFetch` (неделя 4) и `loadUsers` (неделя 0). Те же три состояния, тот же `try` / `catch` / `finally`. Разница только в том, что данные теперь лежат в **общем** сторе и видны всем компонентам.

### Не загружать повторно

Если зайти на страницу каталога, уйти и вернуться, `fetchBooks` вызовется снова. Простая защита:

```js
async function fetchBooks() {
  if (books.value.length) return   // уже загружено
  // ...
}
```

### ⚠️ Действие, а не прямое изменение — для логики

```js
// в компоненте:
store.books.push(newBook)         // работает
store.addBook(newBook)            // ✓ лучше, если при добавлении есть правила
```

Если однажды появится проверка («нельзя добавить книгу без названия»), она будет в **одном** месте — в действии, а не в десяти компонентах.

---

### ✅ Проверь себя — занятие 1

1. Почему количество товаров и список категорий — геттеры, а не поля state?
2. Почему в options-сторе геттер, который использует другой геттер, пишется обычной функцией, а не стрелкой?
3. Где лучше делать запрос на сервер — в компоненте или в действии стора? Почему?

---

## 🛑 Конец занятия 1

5 минут на заметку.

Вопрос-повтор для следующего занятия: **что будет со средней ценой, если массив товаров пустой, и как это предотвратить?**

---

# Занятие 2. `storeToRefs` и практика

## Часть 4. `storeToRefs` — деструктуризация без потерь

### Проблема

```js
const store = useBooksStore()
const { books, loading } = store   // ✗ books и loading — застывшие значения
```

Вчерашняя ловушка: стор — реактивный объект, и деструктуризация отрывает значения от «охранника». Это ответ на вопрос недели «Почему нельзя просто деструктурировать стор?».

### Решение

```js
import { storeToRefs } from 'pinia'

const store = useBooksStore()
const { books, loading, error, count } = storeToRefs(store)   // ✓ всё — ref
const { fetchBooks, addBook } = store                         // ✓ действия — напрямую
```

- `storeToRefs` превращает **state и getters** в отдельные `ref`, связанные со стором;
- **действия** — обычные функции, их деструктурируют **прямо из стора**, без `storeToRefs`.

После этого:
- в шаблоне — `{{ count }}`, `v-if="loading"` (без `.value`, как всегда с `ref`);
- в скрипте — `books.value`, `loading.value`.

### ⚠️ Действия через `storeToRefs` — не получатся

```js
const { fetchBooks } = storeToRefs(store)   // ✗ undefined — действий там нет
```

### Зачем вообще деструктурировать

Не обязательно! `store.books` и `store.fetchBooks()` — тоже прекрасно. Деструктуризация — для удобства, когда полей много и не хочется писать `store.` в каждой строке шаблона.

---

## Часть 5. Что в сторе, а что в компоненте

Задача дня — магазин с фильтром по категории. Где хранить **выбранную категорию**?

| Данные | Где | Почему |
|---|---|---|
| товары, загрузка, ошибка | стор | нужны каталогу, корзине, странице товара |
| список категорий, средняя цена | геттеры стора | вычисляются из товаров |
| выбранная в фильтре категория | **компонент** | нужна только этому экрану |
| отфильтрованные товары | `computed` в компоненте | зависит от выбора на экране |

```js
// компонент каталога
const store = useBooksStore()
const { books, genres } = storeToRefs(store)

const selected = ref('')   // '' — «все»

const visible = computed(() =>
  selected.value ? books.value.filter((b) => b.genre === selected.value) : books.value,
)

onMounted(() => store.fetchBooks())
```

Правило: **стор — для общего, компонент — для своего экрана**.

> Если однажды фильтр понадобится сохранять при переходах между страницами — его можно перенести в стор или в query-параметр адреса (неделя 5). Но не раньше, чем понадобится.

---

## 🛠 Практика: «Магазин» (≈ 35 мин)

Открой `Exercise.vue` и `setup.js` рядом с этим файлом. Условие — в `Exercise.vue`, подсказки — в `hints.md`. API: `https://fakestoreapi.com/products`.

| Этап | Что сделать |
|---|---|
| 1 | Pinia в `setup.js`, стор `stores/products.js` с state |
| 2 | действие `fetchProducts` с загрузкой и ошибкой |
| 3 | вывод карточек; «Загрузка…» и ошибка |
| 4 | геттеры: категории, количество, средняя цена |
| 5 | фильтр `<select>` по категории в компоненте |
| 6 | `storeToRefs`, а потом — обычная деструктуризация, и посмотри, что сломается |

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 6 день 2» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему действия не нужно пропускать через `storeToRefs`?**

---

# Занятие 3. 📜 Options API

## Часть 6. 📜 Магазин на Options API

### Options-стор + `map…` в компоненте

Связка, которая чаще всего встречается в проектах на Options API:

```js
// stores/books.js — options-стор
export const useBooksStore = defineStore('books', {
  state: () => ({ books: [], loading: false, error: null }),
  getters: {
    genres: (state) => [...new Set(state.books.map((b) => b.genre))],
    count: (state) => state.books.length,
  },
  actions: {
    async fetchBooks() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch('https://example.com/api/books')
        if (!res.ok) throw new Error(`статус ${res.status}`)
        this.books = await res.json()
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
})
```

```js
// компонент каталога на Options API
import { mapState, mapActions } from 'pinia'
import { useBooksStore } from '../stores/books.js'

export default {
  data() {
    return { selected: '' }
  },
  computed: {
    ...mapState(useBooksStore, ['books', 'genres', 'loading', 'error']),
    visible() {
      return this.selected ? this.books.filter((b) => b.genre === this.selected) : this.books
    },
  },
  methods: {
    ...mapActions(useBooksStore, ['fetchBooks']),
  },
  mounted() {
    this.fetchBooks()
  },
}
```

Обрати внимание: **`mapState` — аналог `storeToRefs`**, а **`mapActions` — аналог деструктуризации действий**. Одна и та же идея в двух стилях:

| Composition API | Options API |
|---|---|
| `const { books } = storeToRefs(store)` | `computed: { ...mapState(useBooksStore, ['books']) }` |
| `const { fetchBooks } = store` | `methods: { ...mapActions(useBooksStore, ['fetchBooks']) }` |
| `books.value` | `this.books` |

### Переименовать при `mapState`

```js
...mapState(useBooksStore, {
  allBooks: 'books',                          // this.allBooks
  hasError: (store) => store.error !== null,  // своё вычисление
}),
```

### ⚠️ `this` в действиях options-стора — стор, а не компонент

```js
actions: {
  fetchBooks() {
    this.books = ...   // this — сам стор
  },
},
```

Внутри стора `this` — **стор**. У него нет `this.$route` или `this.$emit` компонента. Если действию нужен `id` из адреса — передай его аргументом: `store.fetchBook(route.params.id)`.

---

### ✅ Проверь себя — занятие 3

1. Что в Options API служит аналогом `storeToRefs`?
2. Можно ли внутри действия стора написать `this.$router.push('/')`? Почему?

---

## 🛠 Бонус-практика (≈ 20 мин)

Сделай `ShopOptions.vue` на Options API: `mapState` для товаров и категорий, `mapActions` для загрузки, фильтр — в `data` + `computed`, загрузка — в `mounted`. Подключи в `Exercise.vue` второй строкой и сравни с основной версией. Стор можно оставить тот же: компоненту не важно, setup-стор это или options-стор.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| state | только исходные данные; вычисляемое — в геттеры |
| `$patch({...})` | несколько полей одной записью |
| `$reset()` | только у options-сторов |
| Геттер | кэшируется, как `computed` |
| Геттер из геттера (options) | обычная функция с `this` |
| Геттер с параметром | вернуть функцию; без кэша |
| Действие | можно `async`; место для запросов |
| Повторная загрузка | `if (items.value.length) return` |
| `storeToRefs(store)` | state и getters → `ref` |
| Действия | из стора напрямую, не через `storeToRefs` |
| Стор или компонент | общее — стор; своё для экрана — компонент |
| 📜 Options API | `mapState` ≈ `storeToRefs`; `mapActions` ≈ деструктуризация действий; в сторе `this` — стор |

## 🛑 Конец занятия 3 — день 2 недели 6 пройден

Напиши наставнику «проверь неделю 6 день 2 Options API» и сделай заметку.
