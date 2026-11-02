# Конспект · Неделя 4 · День 1 — `<script setup>` подробно и композаблы

JS-разминка (замыкания, `async/await`, `try/catch`) → что на самом деле делает `<script setup>` → проблема повторяющейся логики → композабл → соглашения → `useFetch` → подводные камни → Options API: миксины и `setup()`.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «`<script setup>`», «Переиспользование кода: композаблы», «FAQ по Composition API».

Это день, ради которого придумали Composition API. Сегодня станет понятно, **зачем** нужны `ref` и функции вместо «полочек» Options API.

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. `<script setup>` и композаблы** | разминка → часть 1 (как устроен `<script setup>`) → часть 2 (проблема) → часть 3 (композабл) → часть 4 (соглашения) → 3 вопроса | 60 мин |
| **2. `useFetch` + практика** | повтор → часть 5 (асинхронный композабл) → часть 6 (ловушки) → задача `useFetch` | 60 мин |
| **3. Options API: миксины** | повтор → часть 7 (миксины и `setup()`) → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. `<script setup>` и композаблы

## Разминка (10 мин): замыкания, `async/await`, `try/catch`

Повтор недели 0. Что выведет код?

```js
function makeCounter() {
  let count = 0
  return {
    inc: () => ++count,
    get: () => count,
  }
}

const a = makeCounter()
const b = makeCounter()
a.inc()
a.inc()
b.inc()
console.log(a.get(), b.get())
```

<details>
<summary>Ответ</summary>

`2 1`. Каждый вызов `makeCounter()` создаёт **свою** переменную `count` в замыкании. `a` и `b` друг от друга не зависят.

Запомни этот пример: сегодня ты увидишь, что **композабл** — это почти то же самое, только вместо `let count` внутри лежит `ref`.

</details>

---

## Часть 1. Что на самом деле делает `<script setup>`

Ты уже два месяца пишешь `<script setup>`. Пора узнать, что за ним стоит.

### `<script setup>` — это функция `setup()`

Vue превращает этот код:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
function inc() { count.value++ }
</script>
```

примерно вот в такой:

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    function inc() { count.value++ }
    return { count, inc }   // всё, что вернули, доступно в шаблоне
  },
}
```

- весь код `<script setup>` — это **тело функции `setup()`**;
- функция выполняется **один раз** для **каждого** экземпляра компонента, при его создании (день 5 недели 2);
- Vue сам добавляет `return` со всеми переменными и функциями — поэтому они видны в шаблоне.

Отсюда «главное свойство `<script setup>`»: всё объявленное доступно в шаблоне, потому что Vue сам возвращает это из `setup()`.

### Почему у каждого компонента свои данные

Если на странице три `ProductCard`, функция `setup()` вызовется **три раза**, и каждый раз создаст **свои** `ref`. Ровно как `makeCounter()` из разминки: три вызова — три независимых счётчика.

### Макросы

`defineProps`, `defineEmits`, `defineModel`, `defineOptions` — это **макросы**: их не импортируют, потому что это не настоящие функции. Vue видит их при сборке и заменяет на опции компонента (`props`, `emits`…). Поэтому:

⚠️ Макросы можно использовать **только** на верхнем уровне `<script setup>`, не внутри функций и условий:

```js
if (something) {
  defineProps({ a: String })   // ✗ ошибка компиляции
}
```

---

## Часть 2. Проблема: повторяющаяся логика

Представь: в двух компонентах нужно отслеживать **ширину окна** (вспомни пример из дня 5 недели 2).

```vue
<!-- Header.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)
function onResize() { width.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
```

```vue
<!-- Gallery.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)
function onResize() { width.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
```

Одинаковые 5 строк в двух файлах. Нашла ошибку — исправляй в обоих. Нужно в третьем компоненте — копируй ещё раз.

В обычном JS одинаковый код выносят в **функцию**. Можно ли вынести в функцию код с `ref` и хуками? Да! Это и есть композабл.

---

## Часть 3. Композабл

### Выносим логику в функцию

```js
// src/composables/useWindowWidth.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowWidth() {
  const width = ref(window.innerWidth)

  function onResize() {
    width.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { width }
}
```

### Используем в компоненте

```vue
<!-- Header.vue -->
<script setup>
import { useWindowWidth } from '../composables/useWindowWidth.js'

const { width } = useWindowWidth()
</script>

<template>
  <p v-if="width < 600">📱 Мобильная версия</p>
</template>
```

Одна строка вместо пяти. В `Gallery.vue` — та же строка.

### Что такое композабл

> **Композабл** — функция, которая использует реактивность Vue (`ref`, `computed`, `watch`, хуки жизненного цикла) и возвращает реактивные данные и функции.

Сравни с обычной функцией:

| | Обычная функция | Композабл |
|---|---|---|
| Пример | `formatPrice(1234)` | `useWindowWidth()` |
| Что возвращает | **значение** (строку, число) | **реактивные** `ref`, `computed`, функции |
| Есть ли «живое» состояние | нет | да: данные меняются со временем, и компонент это видит |
| Хуки, `watch` | нет | могут быть |

Это ответ на вопрос недели «Чем композабл отличается от обычной функции?».

### Как это работает

Когда `useWindowWidth()` вызывается **внутри `<script setup>`**, его `onMounted` и `onUnmounted` регистрируются **для этого компонента** — как если бы ты написала их прямо в компоненте. Компонент появился — подписались, удалился — отписались.

А раз `<script setup>` — это `setup()`, которая выполняется для каждого экземпляра, то каждый компонент получает **свой** `width`. Ровно `makeCounter` из разминки.

---

## Часть 4. Соглашения

### Имя начинается с `use`

`useWindowWidth`, `useFetch`, `useLocalStorage`, `useTimer`. Так сразу видно, что это композабл, а не обычная функция. Так принято во всём мире Vue.

### Файлы — в `src/composables/`

```
src/
├── components/
├── composables/
│   ├── useWindowWidth.js
│   └── useFetch.js
└── utils/
    └── formatPrice.js     ← обычные функции без реактивности
```

### Возвращать объект из `ref`

```js
return { width }               // ✓ объект с ref
```

Тогда деструктуризация **не ломает** реактивность:

```js
const { width } = useWindowWidth()   // width — это ref, всё работает
```

### ⚠️ Почему композабл возвращает `ref`, а не значение

```js
// ✗ плохо
export function useWindowWidth() {
  const width = ref(window.innerWidth)
  // ...
  return width.value   // вернули ЧИСЛО в момент вызова
}

const w = useWindowWidth()   // 1280 — и навсегда 1280
```

Если вернуть `width.value`, компонент получит **число**, которое было в момент вызова. Окно изменится, `width` внутри композабла обновится, но компонент об этом **никогда** не узнает: у него просто число, без «охранника».

Это ответ на вопрос недели «Почему композабл возвращает `ref`, а не обычные значения?». И та же история, что «деструктуризация `reactive` теряет реактивность»: стоит достать примитив из реактивной коробки — связь пропадает.

### ⚠️ Вызывать композабл — на верхнем уровне `<script setup>`

```js
function onClick() {
  const { width } = useWindowWidth()   // ✗ хуки внутри зарегистрируются не вовремя
}
```

Композабл с хуками нужно вызывать **сразу** в `<script setup>`, как и сами хуки (день 5 недели 2). Не в обработчике клика, не в `setTimeout`, не после `await`.

---

### ✅ Проверь себя — занятие 1

1. Во что Vue превращает `<script setup>` и почему поэтому всё объявленное видно в шаблоне?
2. Что такое композабл и чем он отличается от обычной функции вроде `formatPrice`?
3. Почему `return width.value` из композабла — ошибка?

---

## 🛑 Конец занятия 1

5 минут на заметку: «композабл — это как `makeCounter`, только с `ref`» своими словами.

Вопрос-повтор для следующего занятия: **почему композабл возвращает `ref`, а не обычные значения?** (это вопрос недели)

---

# Занятие 2. Асинхронный композабл и практика

## Часть 5. Композабл для загрузки данных

Задача дня — `useFetch`. Разберём похожий, но **другой** композабл — загрузку с имитацией задержки, — чтобы увидеть все приёмы.

### Три состояния — три `ref`

Вспомни день 5 недели 0: любая загрузка — это «загрузка», «данные» или «ошибка». В композабле это три `ref`:

```js
// src/composables/useQuote.js — случайная цитата
import { ref } from 'vue'

export function useQuote() {
  const quote = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://dummyjson.com/quotes/random')
      if (!response.ok) throw new Error(`статус ${response.status}`)
      quote.value = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  load()                                   // загрузить сразу

  return { quote, loading, error, reload: load }
}
```

```vue
<script setup>
import { useQuote } from '../composables/useQuote.js'

const { quote, loading, error, reload } = useQuote()
</script>

<template>
  <p v-if="loading">Загрузка…</p>
  <p v-else-if="error" class="error">Ошибка: {{ error }}</p>
  <blockquote v-else-if="quote">«{{ quote.quote }}» — {{ quote.author }}</blockquote>
  <button @click="reload">Ещё цитату</button>
</template>
```

### Разбор

- **`load()` без `await`** внутри композабла. Нам не нужно ждать: `ref` обновятся сами, когда ответ придёт, а компонент перерисуется. Сам композабл возвращает объект сразу.
- **`finally`** выключает «Загрузка…» при любом исходе — ответ на вопрос 5 из конспекта дня 5 недели 0.
- **`error.value = null`** в начале: при повторной загрузке старая ошибка не должна висеть.
- **`reload: load`** — вернули функцию под удобным именем. Компонент может перезагрузить данные.
- **В шаблоне** `v-if` / `v-else-if` (день 1 недели 2) показывают одно из трёх состояний.

Сравни с `renderUsers` из недели 0: там ты вручную меняла `textContent` в трёх местах. Здесь ты только меняешь три `ref`, а страница обновляется сама. Это и есть сила Vue.

### Композабл с параметром

`useFetch(url)` принимает адрес. Параметры композабла — как аргументы обычной функции:

```js
export function useJoke(category) {
  // ... fetch(`https://example.com/jokes/${category}`)
}
```

```js
const { data } = useJoke('programming')
```

Мини-задача дня — сделать, чтобы `useFetch` принимал и **`ref`** с адресом и перезагружал данные при его смене. Подсказка: функция `toValue` из `'vue'` достаёт значение и из `ref`, и из обычной строки, а `watchEffect` (день 4 недели 2) сам следит за тем, что прочитал.

---

## Часть 6. Подводные камни

### ⚠️ Один экземпляр — одни данные

```js
// ✗ состояние ВНЕ функции
const count = ref(0)
export function useCounter() {
  return { count }
}
```

Если объявить `ref` **снаружи** функции, все компоненты, вызвавшие `useCounter()`, получат **один и тот же** `count`. Иногда это и нужно (общее состояние — «самодельный стор»), но чаще это ошибка. Обычно всё состояние — **внутри** функции, и у каждого вызова своё.

> На неделе 6 Pinia решит задачу «общее состояние для всего приложения» правильно.

### ⚠️ `async`-композабл: не делай саму функцию `async`

```js
// ✗ плохо
export async function useQuote() {
  const quote = ref(null)
  quote.value = await (await fetch(...)).json()
  return { quote }
}

const { quote } = useQuote()   // ✗ useQuote() вернула ПРОМИС, деструктуризация даст undefined
```

`async`-функция всегда возвращает промис (неделя 0, день 5). Правильно: сам композабл **обычный**, а асинхронная функция `load` — **внутри** него.

### ⚠️ Хуки в композабле без компонента

Если вызвать композабл с `onMounted` **не** в `<script setup>` (например, в обычном `.js`-файле), Vue предупредит: хукам не к чему привязаться.

### Когда **не** нужен композабл

Если в функции нет `ref`, `computed`, `watch` или хуков — это **обычная утилита**: `formatPrice`, `todayKey`. Её кладут в `utils/` и не называют `use…`.

---

## 🛠 Практика: `useFetch` (≈ 35 мин)

Выполни задание из [task.md](task.md) в проекте `shop`. Подсказки — в [hints.md](hints.md).

Советы:
- сначала напиши композабл и подключи в **один** компонент, проверь три состояния (испорть адрес, чтобы увидеть ошибку);
- потом подключи во **второй** компонент с другим адресом — убедись, что у них разные данные;
- в Vue DevTools посмотри: у каждого компонента свои `data`, `loading`, `error`.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 4 день 1» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему сам композабл не должен быть `async`?**

---

# Занятие 3. 📜 Options API: миксины и `setup()`

## Часть 7. 📜 Как переиспользовали логику в Options API

### Проблема Options API

Логика одной фичи «размазана» по полочкам: данные в `data`, функции в `methods`, подписка в `mounted`, отписка в `unmounted`. Вынести её целиком в одну функцию нельзя — каждая часть живёт в своей опции.

### Миксины — решение из Options API

**Миксин** — объект с теми же опциями, что у компонента. Vue «подмешивает» его опции в компонент.

```js
// mixins/windowWidth.js
export const windowWidthMixin = {
  data() {
    return { width: window.innerWidth }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.width = window.innerWidth
    },
  },
}
```

```vue
<script>
import { windowWidthMixin } from '../mixins/windowWidth.js'

export default {
  mixins: [windowWidthMixin],
  // теперь у компонента есть this.width и метод onResize
}
</script>

<template>
  <p v-if="width < 600">📱 Мобильная версия</p>
</template>
```

### ⚠️ Почему миксины считаются устаревшими

Если ты встретишь миксины в рабочем коде, знай их проблемы:

| Проблема | Пример |
|---|---|
| **Неясно, откуда что взялось** | в шаблоне `{{ width }}`, а в компоненте его нет. Где он? В одном из пяти миксинов… |
| **Конфликты имён** | два миксина объявили `loading` — один молча перезапишет другой |
| **Нельзя передать параметр** | миксину не скажешь `useFetch('/users')` — только через данные компонента |
| **Нельзя использовать дважды** | два «экземпляра» одного миксина в одном компоненте невозможны |

Композаблы решают всё это:

```js
const { width } = useWindowWidth()          // явно видно, откуда width
const { data: users } = useFetch('/users')  // параметры и переименование
const { data: posts } = useFetch('/posts')  // два экземпляра без конфликтов
```

Миксины во Vue 3 **работают** и поддерживаются, но для нового кода официальная документация советует композаблы.

### Композабл внутри Options API: опция `setup()`

А можно ли использовать **композабл** в компоненте на Options API? Да, через функцию `setup()` — ту самую, во что превращается `<script setup>`:

```vue
<script>
import { useWindowWidth } from '../composables/useWindowWidth.js'

export default {
  setup() {
    const { width } = useWindowWidth()
    return { width }           // вернуть — чтобы было в шаблоне и в this
  },
  data() {
    return { title: 'Галерея' }
  },
  computed: {
    isMobile() {
      return this.width < 600  // ✓ то, что вернул setup, доступно через this
    },
  },
}
</script>
```

Это **переходный** вариант, о котором говорилось в дне 1 недели 1. Он часто встречается в проектах, которые постепенно переходят с Options API на Composition API. Если на работе захочешь использовать композабл в старом компоненте — вот как.

⚠️ Внутри `setup()` **нет `this`**: функция выполняется до создания остальных опций. Данные и методы Options API в `setup()` недоступны, а вот обратно — то, что вернул `setup()`, доступно через `this` в остальных опциях.

---

### ✅ Проверь себя — занятие 3

1. Назови две проблемы миксинов, которые решают композаблы.
2. Как использовать композабл `useFetch` в компоненте на Options API?

---

## 🛠 Бонус-практика (≈ 20 мин)

1. Напиши миксин `fetchMixin` с `data` (`data`, `loading`, `error`), методом `load(url)` и вызовом в `mounted` — и подключи в компонент на Options API. Почувствуй, где неудобно.
2. Потом в том же компоненте подключи свой `useFetch` через опцию `setup()`. Сравни.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `<script setup>` | тело функции `setup()`; Vue сам возвращает всё объявленное |
| `setup()` | выполняется один раз на каждый экземпляр компонента |
| Макросы `define…` | не импортируются; только на верхнем уровне |
| Композабл | функция с `ref` / `computed` / `watch` / хуками, возвращает реактивное |
| Имя | `useЧтоТо`; файл в `src/composables/` |
| Возвращать | объект из `ref`: `return { data, loading }` |
| `return x.value` | ✗ — компонент получит застывшее значение |
| Вызывать | на верхнем уровне `<script setup>` |
| Состояние | внутри функции — у каждого вызова своё |
| Асинхронность | композабл обычный, `async` — функция `load` внутри |
| Нет реактивности | это утилита в `utils/`, а не композабл |
| 📜 Миксины | `mixins: [obj]`; неясные источники, конфликты, нет параметров |
| 📜 `setup()` в Options API | вызвать композабл и `return` — доступно через `this`; в `setup` нет `this` |

## 🛑 Конец занятия 3 — день 1 недели 4 пройден

Напиши наставнику «проверь неделю 4 день 1 Options API» и сделай заметку.
