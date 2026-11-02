# Конспект · Неделя 1 · День 4 — `computed`, привязка классов и стилей

JS-разминка (чистые функции, объекты-словари) → `computed` → `computed` или функция → `computed` с `get` и `set` → `:class` → `:style` → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «Вычисляемые свойства», «Привязка классов и стилей».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. `computed`** | разминка → часть 1 (что такое `computed`) → часть 2 (`computed` или функция) → часть 3 (`get` и `set`) → 3 вопроса | 60 мин |
| **2. Классы, стили + практика** | повтор → часть 4 (`:class`) → часть 5 (`:style`) → 3 вопроса → задача «Конвертер + красный счётчик» | 60 мин |
| **3. Options API** | повтор → часть 6 → 2 вопроса → бонус `ExerciseOptions.vue` | 60 мин |

> Задача дня большая (две части). Если на занятии 2 не успеешь — доделай вторую часть в начале занятия 3, а Options API сдвинь. Это нормально.

---

# Занятие 1. Вычисляемые свойства

## Разминка (5 мин): чистые функции и объекты-словари

**Чистая функция** — функция, которая:
1. для одних и тех же аргументов **всегда** возвращает один и тот же результат;
2. **ничего не меняет** снаружи себя.

Какая из функций чистая?

```js
function addTax(price) {
  return price * 1.2
}

let total = 0
function addToTotal(price) {
  total += price
  return total
}
```

**Объект-словарь** — объект, где по ключу берут значение:

```js
const statusText = { new: 'Новый', done: 'Готово', late: 'Просрочен' }
const status = 'done'
statusText[status] // ?
```

<details>
<summary>Ответ</summary>

- `addTax` — чистая: результат зависит только от аргумента, снаружи ничего не меняется.
- `addToTotal` — **не** чистая: меняет внешнюю переменную `total`, и для одного аргумента возвращает разные результаты (5, потом 10, потом 15…).
- `statusText[status]` → `'Готово'`. Квадратные скобки, потому что ключ лежит в переменной (день 2 недели 0).

Обе идеи сегодня пригодятся: `computed` должен быть «чистым», а словари удобны для классов.

</details>

---

## Часть 1. `computed` — значения, которые вычисляются из других

### Проблема

```vue
<script setup>
import { ref } from 'vue'

const firstName = ref('Анна')
const lastName = ref('Иванова')
</script>

<template>
  <h1>{{ firstName + ' ' + lastName }}</h1>
  <p>Привет, {{ firstName + ' ' + lastName }}!</p>
  <p title="...">Профиль: {{ firstName + ' ' + lastName }}</p>
</template>
```

Одно и то же выражение повторяется трижды. Если формат поменяется (например, «Иванова А.»), придётся исправлять в трёх местах. И шаблон становится трудно читать.

### Решение: `computed`

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Анна')
const lastName = ref('Иванова')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>

<template>
  <h1>{{ fullName }}</h1>
  <p>Привет, {{ fullName }}!</p>
</template>
```

- `computed` нужно импортировать из `'vue'`, как `ref`;
- в `computed` передаётся **функция**, которая вычисляет и **возвращает** значение;
- внутри функции читаем ref-ы через `.value` — это ведь скрипт.

### `computed` сам пересчитывается

Главная магия: если `firstName` изменится, `fullName` **сам** пересчитается, и страница обновится. Ничего вызывать вручную не нужно.

Как Vue это понимает? Тот самый «охранник» из дня 3: пока функция `computed` выполняется, Vue запоминает, **какие реактивные данные она прочитала** (`firstName`, `lastName`). Это её **зависимости**. Изменилась любая зависимость — `computed` пересчитается.

```
firstName ──┐
            ├──► fullName ──► шаблон
lastName  ──┘
```

### `computed` — тоже ref

`computed` возвращает объект, похожий на ref: значение в `.value`.

```js
console.log(fullName.value) // 'Анна Иванова'
```

| Где | Как читать |
|---|---|
| в скрипте | `fullName.value` |
| в шаблоне | `fullName` |

То же правило, что у `ref`. Хорошая новость — ничего нового запоминать не надо.

### ⚠️ `computed` только для чтения

```js
fullName.value = 'Ольга Петрова'   // ✗ предупреждение: computed value is readonly
```

Обычный `computed` нельзя изменить напрямую: его значение **вычисляется** из зависимостей. Хочешь другое значение — меняй зависимости (`firstName`, `lastName`). Исключение — `computed` с `set`, это часть 3.

### `computed` от `computed`

Одни вычисляемые значения можно строить на других:

```js
const price = ref(1000)
const discount = ref(15)   // проценты

const discountSum = computed(() => price.value * discount.value / 100)
const finalPrice = computed(() => price.value - discountSum.value)
```

`finalPrice` зависит от `price` и от `discountSum`, а `discountSum` — от `price` и `discount`. Поменяется `discount` — Vue по цепочке пересчитает и `discountSum`, и `finalPrice`.

---

## Часть 2. `computed` или обычная функция?

### Обе записи дают одинаковый результат

```vue
<script setup>
const fullNameFn = () => `${firstName.value} ${lastName.value}`
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>

<template>
  <p>{{ fullNameFn() }}</p>   <!-- функция: со скобками -->
  <p>{{ fullName }}</p>       <!-- computed: без скобок -->
</template>
```

На экране одно и то же. Так зачем нужен `computed`?

### Разница: кэширование

- **Функция** выполняется **каждый раз**, когда Vue перерисовывает компонент. Даже если её данные не менялись.
- **`computed`** **запоминает** результат (кэширует) и пересчитывает его, **только когда изменились его зависимости**.

```js
const now = computed(() => Date.now())
```

Этот `computed` вычислится один раз и **никогда** не обновится. `Date.now()` — не реактивная зависимость, Vue не знает, что время идёт. А функция `() => Date.now()` давала бы новое значение при каждой перерисовке.

### Когда что использовать

| Нужно | Используй |
|---|---|
| значение, которое **выводится из данных** (полное имя, сумма, отфильтрованный список) | `computed` |
| **действие** (по клику: добавить, удалить, отправить) | функция |
| вычисление **с аргументом** (`formatPrice(item.price)`) | функция |

Правило-мнемоника: **«`computed` — существительное, функция — глагол»**. `fullName`, `total`, `isValid` — это значения, `computed`. `addItem`, `reset`, `save` — действия, функции.

Это ответ на вопрос недели «Когда использовать `computed`, а когда метод?» 🙂

### ⚠️ `computed` должен быть «чистым»

Помнишь разминку? Функция внутри `computed` должна **только вычислять и возвращать**, ничего не меняя:

```js
// ✗ плохо: computed меняет другие данные
const total = computed(() => {
  orderCount.value++          // побочный эффект!
  return price.value * 2
})

// ✗ плохо: async в computed
const user = computed(async () => {
  return await fetch('...')   // вернётся промис, а не данные
})

// ✓ хорошо: только вычисление
const total = computed(() => price.value * 2)
```

Для «когда X изменилось — сделай Y» есть `watch` (неделя 2).

### ⚠️ Забытый `return`

```js
const fullName = computed(() => {
  `${firstName.value} ${lastName.value}`   // ✗ нет return — fullName будет undefined
})
```

Та же ловушка, что с `map` в дне 3 недели 0: с фигурными скобками `return` обязателен.

---

## Часть 3. `computed` с `get` и `set`

Иногда хочется, чтобы вычисляемое значение можно было и **записать**. Тогда в `computed` передают не функцию, а объект с двумя функциями:

```js
const firstName = ref('Анна')
const lastName = ref('Иванова')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    const [first, last] = newValue.split(' ')  // деструктуризация массива!
    firstName.value = first
    lastName.value = last
  },
})

fullName.value = 'Ольга Петрова'
// firstName.value → 'Ольга', lastName.value → 'Петрова'
```

- `get` — как обычный `computed`: «как вычислить значение»;
- `set` — «что сделать, когда в `computed` записали новое значение». Обычно — пересчитать и записать **исходные** данные.

Это прямое продолжение темы геттеров и сеттеров из разминки дня 3.

Где пригодится: в задаче дня есть дополнительное задание — конвертация в **обе** стороны. Подумай, что там будет `get`, а что — `set`.

> В задаче используется `v-model` для поля ввода. Подробно это неделя 2, а пока достаточно знать: `v-model="x"` держит значение поля и `x` одинаковыми. И `x` может быть даже `computed` с `get`/`set`.

---

### ✅ Проверь себя — занятие 1

1. Чем `computed` отличается от обычной функции, если на экране результат одинаковый?
2. Что не так: `const double = computed(() => { count.value * 2 })`?
3. Тебе нужно по клику очистить корзину. `computed` или функция? Почему?

---

## 🛑 Конец занятия 1

5 минут на заметку: что такое `computed`, чем он хорош и чем ограничен.

Вопрос-повтор для следующего занятия: **что значит «`computed` кэширует результат»?**

---

# Занятие 2. Привязка классов и стилей

## Часть 4. `:class` — классы по условию

### Простой `:class` со строкой

Классы — это тоже атрибут, поэтому с ними работает `v-bind`:

```vue
<script setup>
const theme = 'dark'
</script>

<template>
  <div :class="theme">...</div>   <!-- class="dark" -->
</template>
```

Но для классов у Vue есть синтаксис гораздо удобнее.

### Объект: класс → условие

```vue
<script setup>
import { ref } from 'vue'

const isDone = ref(true)
const isUrgent = ref(false)
</script>

<template>
  <li :class="{ done: isDone, urgent: isUrgent }">Купить хлеб</li>
</template>

<style scoped>
.done { text-decoration: line-through; color: gray; }
.urgent { color: red; font-weight: bold; }
</style>
```

- **ключ** объекта — имя класса;
- **значение** — условие: если `true` (или truthy), класс добавляется, если `false` — нет.

Сейчас получится `<li class="done">`. Поменяется `isUrgent` на `true` — станет `class="done urgent"`. Реактивно, само собой.

Это и есть **объект-словарь из разминки**: «класс → включён ли он».

### Условие — любое выражение

```vue
<p :class="{ negative: balance < 0, big: balance > 1000000 }">{{ balance }}</p>
```

Значения в объекте — обычные JS-выражения: сравнения, логика, вызовы. Это ответ на вопрос недели «Как добавить класс по условию?».

### ⚠️ Имена классов с дефисом — в кавычках

```vue
<div :class="{ text-red: isError }">       ✗ синтаксическая ошибка: text-red не имя
<div :class="{ 'text-red': isError }">     ✓
```

В JS ключ объекта без кавычек не может содержать дефис. Знакомое правило из недели 0: `{ 'is read': true }`.

### Обычный `class` и `:class` вместе

```vue
<button class="btn" :class="{ active: isActive }">Кнопка</button>
<!-- получится class="btn active" или class="btn" -->
```

Постоянные классы — в обычный `class`, условные — в `:class`. Vue **склеит** их. Это не ошибка и не конфликт, а нормальная практика.

### Массив классов

Если классы приходят из переменных:

```vue
<script setup>
const size = 'large'
const color = 'blue'
</script>

<template>
  <div :class="[size, color]">...</div>   <!-- class="large blue" -->
</template>
```

В массиве можно и тернарный оператор: `:class="[size, isError ? 'error' : '']"`. И даже объект внутри массива: `:class="[size, { error: isError }]"`.

### Классы из `computed`

Если условий много, вынеси объект в `computed`, чтобы шаблон оставался чистым:

```js
const cardClasses = computed(() => ({
  done: isDone.value,
  urgent: isUrgent.value && !isDone.value,
}))
```

```vue
<li :class="cardClasses">...</li>
```

⚠️ Обрати внимание на `({ ... })` — круглые скобки вокруг объекта в стрелке, ловушка из дня 3 недели 0.

---

## Часть 5. `:style` — стили по условию

### Объект стилей

```vue
<script setup>
import { ref } from 'vue'

const fontSize = ref(18)
const color = ref('purple')
</script>

<template>
  <p :style="{ color: color, fontSize: fontSize + 'px' }">Текст</p>
</template>
```

- ключи — CSS-свойства;
- значения — JS-выражения.

### ⚠️ Имена свойств: `camelCase` или в кавычках

В CSS пишут `font-size`, но в JS-объекте дефис нельзя без кавычек:

```vue
<p :style="{ fontSize: '18px' }">         ✓ camelCase — так принято
<p :style="{ 'font-size': '18px' }">      ✓ тоже работает
<p :style="{ font-size: '18px' }">        ✗ синтаксическая ошибка
```

### ⚠️ Не забывай единицы измерения

```vue
<p :style="{ fontSize: 18 }">         ✗ не сработает: 18 чего?
<p :style="{ fontSize: 18 + 'px' }">  ✓
<p :style="{ fontSize: `${size}px` }"> ✓ шаблонная строка
```

### Стиль по условию

```vue
<p :style="{ color: balance < 0 ? 'red' : 'black' }">{{ balance }}</p>
```

### `:class` или `:style` — что выбрать?

**Почти всегда — `:class`.** Стили лучше держать в `<style>`, а в шаблоне только включать и выключать классы. Так проще менять дизайн и легче читать код.

`:style` нужен, когда значение **по-настоящему вычисляется** и его нельзя заранее описать классом: ширина прогресс-бара `width: percent + '%'`, цвет, который выбрал пользователь, позиция элемента.

---

### ✅ Проверь себя — занятие 2

1. Как добавить класс `error` к полю, только если `hasError` равно `true`?
2. В чём ошибка: `:class="{ is-active: active }"`?
3. Почему `:style="{ width: 50 }"` не работает, а `:style="{ width: '50%' }"` — работает?

---

## 🛠 Практика: «Конвертер температур + красный счётчик» (≈ 30 мин)

Открой `Exercise.vue` рядом с этим файлом. Задача из двух частей; подсказки — в `hints.md`.

Советы:
- **часть 1**: сначала простой `computed` (только °C → °F), потом, если будет время, — `get`/`set` для обратной стороны;
- обрати внимание, что из поля ввода может прийти **строка**: что будет, если к `'20'` прибавить 32? (подсказка в `hints.md`);
- **часть 2**: начни с `:class`, потом попробуй `:style` и сравни.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 1 день 4» и сделай заметку.

Вопрос-повтор для следующего занятия: **как с помощью объекта в `:class` включать и выключать классы?**

---

# Занятие 3. 📜 Options API

## Часть 6. 📜 `computed` и классы в Options API

### Опция `computed`

В Options API для вычисляемых значений есть отдельная «полочка» — `computed`:

**Composition API:**

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Анна')
const lastName = ref('Иванова')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>
```

**Options API:**

```vue
<script>
export default {
  data() {
    return {
      firstName: 'Анна',
      lastName: 'Иванова',
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
  },
}
</script>
```

Шаблон в обоих случаях — `{{ fullName }}`, без скобок.

| | Composition API | Options API |
|---|---|---|
| Где объявить | `const x = computed(() => ...)` | опция `computed: { x() { ... } }` |
| Данные внутри | `firstName.value` | `this.firstName` |
| Прочитать в скрипте | `fullName.value` | `this.fullName` (без скобок!) |
| В шаблоне | `fullName` | `fullName` |

### ⚠️ `computed` в Options API — функция, но вызывается без скобок

```js
computed: {
  fullName() { return ... },   // объявлена как функция
},
methods: {
  greet() {
    return `Привет, ${this.fullName}`    // ✓ без скобок — это значение
    return `Привет, ${this.fullName()}`  // ✗ TypeError: this.fullName is not a function
  },
},
```

Объявляется как метод, а используется как **свойство**. Частая путаница при чтении чужого кода.

### `get` и `set` в Options API

```js
computed: {
  fullName: {
    get() {
      return `${this.firstName} ${this.lastName}`
    },
    set(newValue) {
      const [first, last] = newValue.split(' ')
      this.firstName = first
      this.lastName = last
    },
  },
},
```

Та же идея, что в Composition API, только данные через `this`.

### `computed` или `methods` в Options API

Разница та же, что в Composition API: `computed` кэширует результат, а метод вызывается заново при каждой перерисовке.

```vue
<p>{{ fullName }}</p>       <!-- computed: без скобок -->
<p>{{ getFullName() }}</p>  <!-- метод из methods: со скобками -->
```

В рабочем коде иногда встречается метод там, где лучше был бы `computed`. Это не ошибка, но если метод без аргументов просто что-то вычисляет из `data()`, его стоит сделать `computed`.

### ⚠️ Стрелка в `computed` — та же ловушка

```js
computed: {
  fullName: () => `${this.firstName} ${this.lastName}`,   // ✗ this не компонент
}
```

Как и в `methods`: **только обычные функции** (короткая запись `fullName() {}`).

### `:class` и `:style` — без изменений

Синтаксис `:class="{ done: isDone }"` и `:style="{ color: ... }"` — часть **шаблона**, поэтому в Options API он точно такой же. Объект классов можно вынести в `computed`:

```js
computed: {
  cardClasses() {
    return {
      done: this.isDone,
      urgent: this.isUrgent && !this.isDone,
    }
  },
},
```

---

### ✅ Проверь себя — занятие 3

1. Перепиши мысленно в Options API: `const total = computed(() => price.value * qty.value)`.
2. В методе Options API написано `this.total()`, где `total` объявлен в `computed`. Что произойдёт и почему?

---

## 🛠 Бонус-практика: конвертер в Options API (≈ 20 мин)

Открой `ExerciseOptions.vue` рядом с этим файлом. В меню задач — ссылка **«Options API»**.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `computed(() => ...)` | значение, вычисляемое из других данных |
| Пересчёт | сам, когда меняются зависимости |
| Кэширование | пока зависимости не изменились — берётся запомненное |
| `.value` у `computed` | в скрипте — да, в шаблоне — нет |
| Запись в `computed` | только если есть `set` |
| Внутри `computed` | только вычислить и вернуть; без побочных эффектов и `async` |
| `computed` или функция | значение (существительное) или действие (глагол) |
| `:class="{ cls: cond }"` | класс по условию |
| `:class="[a, b]"` | классы из переменных |
| `class` + `:class` | склеиваются |
| Класс с дефисом | `{ 'text-red': x }` |
| `:style="{ fontSize: '18px' }"` | camelCase и единицы измерения |
| `:class` или `:style` | почти всегда `:class` |
| 📜 Options API | опция `computed: { x() { return this... } }`; используется без скобок |

## 🛑 Конец занятия 3 — день 4 недели 1 пройден

Напиши наставнику «проверь неделю 1 день 4 Options API» и сделай заметку.
