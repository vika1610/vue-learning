# Конспект · Неделя 3 · День 2 — Компоненты и `props`

JS-разминка (деструктуризация параметров) → зачем делить на компоненты → свой компонент → `props` → типы, `required`, `default` → однонаправленный поток данных → список компонентов → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «Основы компонентов», «Входные параметры».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Компоненты и `props`** | разминка → часть 1 (зачем компоненты) → часть 2 (свой компонент) → часть 3 (`props`) → 3 вопроса | 60 мин |
| **2. Типы, правила + практика** | повтор → часть 4 (типы, `default`) → часть 5 (нельзя менять props) → часть 6 (список карточек) → задача `ProductCard` | 60 мин |
| **3. Options API** | повтор → часть 7 → 2 вопроса → бонус: `ProductCard` в Options API | 60 мин |

---

# Занятие 1. Компоненты и `props`

## Разминка (10 мин): деструктуризация параметров

```js
function describe({ title, price, inStock = true }) {
  return `${title}: ${price} ₽${inStock ? '' : ' (нет в наличии)'}`
}

describe({ title: 'Кружка', price: 450 })                 // ?
describe({ title: 'Чайник', price: 2000, inStock: false }) // ?
```

<details>
<summary>Ответ</summary>

1. `'Кружка: 450 ₽'` — `inStock` не передан, взялось значение по умолчанию `true`.
2. `'Чайник: 2000 ₽ (нет в наличии)'`.

Функция получает **объект с параметрами**, у некоторых есть значения по умолчанию. Компоненты с `props` устроены очень похоже: компонент получает набор входных параметров, у некоторых есть значения по умолчанию.

</details>

---

## Часть 1. Зачем делить интерфейс на компоненты

Представь страницу магазина: шапка, меню, фильтры, 20 карточек товаров, корзина, подвал. Если всё это написать в одном `App.vue`, получится файл на тысячу строк, в котором невозможно разобраться.

Компоненты позволяют:

- **разбить** страницу на понятные кусочки: `AppHeader`, `ProductCard`, `CartPanel`;
- **переиспользовать**: одна `ProductCard` — двадцать карточек с разными данными;
- **изолировать**: стили и логика карточки не мешают остальной странице.

Это как функции в JavaScript: вместо одного длинного кода — много маленьких функций с понятными именами, которые получают аргументы.

| Функции в JS | Компоненты во Vue |
|---|---|
| объявление функции | файл `ProductCard.vue` |
| вызов `describe(...)` | тег `<ProductCard ... />` |
| аргументы | **props** |
| возврат значения | события (`emits`, завтра) |

---

## Часть 2. Свой компонент

### Создать файл

`src/components/StarRating.vue`:

```vue
<script setup>
</script>

<template>
  <span class="stars">⭐⭐⭐⭐⭐</span>
</template>

<style scoped>
.stars { font-size: 20px; }
</style>
```

### Использовать в родителе

`src/App.vue`:

```vue
<script setup>
import StarRating from './components/StarRating.vue'
</script>

<template>
  <h1>Отзывы</h1>
  <StarRating />
  <StarRating />
</template>
```

Импортировала — используешь как тег. Можно сколько угодно раз.

### ⚠️ Самозакрывающийся тег и регистр

```vue
<StarRating />          ✓
<StarRating></StarRating> ✓ то же самое
<starrating />          ✗ в .vue-файле так не найдётся — имя должно совпадать с импортом
```

В `.vue`-файлах пиши имя компонента **так же, как в импорте**: `StarRating`. Самозакрывающийся `/>` допустим, если внутри ничего нет.

### Родитель и ребёнок

```
App.vue          ← родитель
└── StarRating   ← ребёнок
```

Компонент, внутри которого используют другой, называют **родителем**, а вложенный — **ребёнком** (дочерним компонентом). Эти слова будут постоянно встречаться в документации.

---

## Часть 3. `props` — входные параметры

Сейчас `StarRating` всегда показывает 5 звёзд. Хочется, чтобы родитель **сказал**, сколько.

### Объявить в ребёнке

```vue
<!-- StarRating.vue -->
<script setup>
defineProps({
  count: Number,
})
</script>

<template>
  <span class="stars">
    <span v-for="n in count" :key="n">⭐</span>
  </span>
</template>
```

- `defineProps` — «макрос»: его **не нужно** импортировать, Vue знает его сам (как и `defineEmits` завтра);
- в объекте — имена параметров и их типы;
- в шаблоне props доступны **напрямую**: `count`.

### Передать из родителя

```vue
<!-- App.vue -->
<StarRating :count="5" />
<StarRating :count="3" />
<StarRating :count="1" />
```

Props передаются **как атрибуты** тега. Три тега — три разных компонента со своими данными.

### ⚠️⚠️ С двоеточием и без

Тот же урок, что `v-bind` на дне 2 недели 1, но здесь он становится **очень** важным:

```vue
<StarRating count="3" />    <!-- ✗ передана СТРОКА '3' -->
<StarRating :count="3" />   <!-- ✓ передано ЧИСЛО 3 -->
```

Без двоеточия в кавычках — строка. Vue заметит, что тип не совпадает с `Number`, и выдаст предупреждение в консоли: *Invalid prop: type check failed for prop "count". Expected Number with value 3, got String with value "3"*. А `v-for="n in '3'"` вообще переберёт **символы строки**.

Правило: **строку можно без `:`, всё остальное (числа, `true`/`false`, массивы, объекты, переменные) — только с `:`.**

```vue
<ProductCard title="Кружка" :price="450" :in-stock="true" :tags="['новинка']" />
```

### Props в скрипте

Если props нужны **в коде**, сохрани результат `defineProps`:

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: Number,
})

const label = computed(() => `${props.count} из 5`)
</script>
```

В скрипте — `props.count`, в шаблоне — просто `count`.

### ⚠️ Деструктуризация props

```js
const { count } = defineProps({ count: Number })
```

В **Vue 3.5** (и у тебя на работе 3.5) это **работает реактивно**: Vue сам переписывает `count` в `props.count`. Но в более старых версиях Vue 3 деструктуризация ломала реактивность, как у `reactive` (день 3 недели 1). Поэтому в рабочем коде и документации часто встречается `props.count`. Оба варианта тебе нужно узнавать. В курсе будем писать `props.count`: так понятнее, откуда значение.

---

### ✅ Проверь себя — занятие 1

1. Что такое props и с чем их можно сравнить в обычном JavaScript?
2. Чем отличаются `<StarRating count="4" />` и `<StarRating :count="4" />`?
3. Как обратиться к prop в шаблоне и как — в `<script setup>`?

---

## 🛑 Конец занятия 1

5 минут на заметку: «props — это как аргументы функции» своими словами.

Вопрос-повтор для следующего занятия: **почему число в prop нужно передавать с двоеточием?**

---

# Занятие 2. Типы, правила и практика

## Часть 4. Типы, `required`, `default`

### Подробное объявление

```js
defineProps({
  title: {
    type: String,
    required: true,           // без него — предупреждение в консоли
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,               // если не передали — будет 0
  },
  inStock: {
    type: Boolean,
    default: true,
  },
})
```

| Опция | Что значит |
|---|---|
| `type` | ожидаемый тип: `String`, `Number`, `Boolean`, `Array`, `Object`, `Function` |
| `required: true` | обязательный: если не передать — предупреждение |
| `default` | значение, если prop не передан |

Типы и `required` **не ломают** приложение, если нарушены, — Vue только предупреждает в консоли. Но эти предупреждения очень помогают найти ошибку. Привыкай смотреть в консоль.

### ⚠️ `default` для массива и объекта — функция

```js
tags: {
  type: Array,
  default: () => [],        // ✓ функция, которая возвращает новый массив
},
options: {
  type: Object,
  default: () => ({}),      // ✓ круглые скобки вокруг объекта (день 3 недели 0)
},
```

Почему функция? Если бы `default: []`, все экземпляры компонента получили бы **один и тот же** массив по ссылке. Та же история, что `data` — функция в Options API (день 1 недели 1).

### Булевы props — особый случай

```vue
<ProductCard title="Кружка" :price="450" in-stock />   <!-- inStock = true -->
<ProductCard title="Чайник" :price="2000" />            <!-- inStock = default -->
```

Если prop типа `Boolean`, то атрибут **без значения** означает `true`, как HTML-атрибут `disabled`.

### Имена: `camelCase` в скрипте, `kebab-case` в шаблоне

```js
defineProps({ inStock: Boolean })    // в скрипте — camelCase
```

```vue
<ProductCard in-stock />    <!-- в шаблоне родителя принято kebab-case -->
<ProductCard inStock />     <!-- тоже работает -->
```

Vue сам переводит `in-stock` ↔ `inStock`. В документации и рабочем коде встречаются оба варианта.

---

## Часть 5. ⚠️ Props нельзя менять в ребёнке

### Однонаправленный поток данных

Данные текут **сверху вниз**: родитель передаёт props ребёнку. Ребёнок их **только читает**.

```
App.vue (владеет данными)
   │  :price="450"
   ▼
ProductCard (только читает price)
```

### Что будет, если попробовать изменить

```js
const props = defineProps({ price: Number })

function applyDiscount() {
  props.price = props.price * 0.9   // ✗ предупреждение: Attempted to assign to readonly property
}
```

Vue запретит и предупредит. Это ответ на вопрос недели «Почему нельзя менять props внутри компонента?»:

1. **У данных один хозяин** — родитель. Если ребёнок поменяет копию, родитель об этом не узнает, и при следующей перерисовке родитель «перезапишет» значение обратно.
2. **Иначе непонятно, кто что поменял.** Если 20 компонентов могут менять общие данные, найти ошибку очень трудно.

### Что делать, если очень нужно

**Нужно значение, вычисленное из prop?** → `computed`:

```js
const finalPrice = computed(() => props.price * (1 - props.discount / 100))
```

**Нужно изменить данные?** → попросить родителя через **событие** (`emit`). Это завтрашняя тема.

**Нужно своё состояние, начиная со значения prop** (например, поле ввода с начальным текстом)? → свой `ref`:

```js
const localTitle = ref(props.title)   // дальше живёт отдельно от prop
```

### ⚠️ Объекты и массивы в props можно «случайно» изменить

```js
const props = defineProps({ product: Object })
props.product.price = 100   // ⚠️ Vue НЕ предупредит — но так делать нельзя
```

`props.product` нельзя заменить, а вот поле объекта внутри — можно, потому что объект передан **по ссылке** (день 2 недели 0). Vue этого не ловит. Но правило то же: **ребёнок не меняет данные родителя**, даже если технически может.

---

## Часть 6. Список компонентов

Главный сценарий: массив данных в родителе, по компоненту на каждый элемент.

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import ReviewCard from './components/ReviewCard.vue'

const reviews = ref([
  { id: 1, author: 'Аня', stars: 5, text: 'Отлично!' },
  { id: 2, author: 'Борис', stars: 3, text: 'Нормально' },
  { id: 3, author: 'Вера', stars: 4, text: 'Хорошо' },
])
</script>

<template>
  <div class="reviews">
    <ReviewCard
      v-for="review in reviews"
      :key="review.id"
      :author="review.author"
      :stars="review.stars"
      :text="review.text"
    />
  </div>
</template>
```

`v-for` и `:key` ставятся **на сам компонент**, как на `<li>`. Каждый `ReviewCard` получает свой отзыв.

### Передать все поля разом

Если имена props совпадают с полями объекта, можно передать **весь объект как атрибуты** — `v-bind` без аргумента (день 2 недели 1):

```vue
<ReviewCard v-for="review in reviews" :key="review.id" v-bind="review" />
```

Это то же, что `:id="review.id" :author="review.author" :stars="..." :text="..."`. Удобно, но менее явно: по шаблону не видно, какие props уходят.

### Или передать объект одним prop

```vue
<ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
```

```js
defineProps({ review: { type: Object, required: true } })
```

Тоже нормальный вариант. Минус — внутри компонента везде `review.author`, и по объявлению props не видно, какие поля нужны.

---

## 🛠 Практика: `ProductCard` с props (≈ 30 мин)

Выполни задание из [task.md](task.md) в проекте `shop`. Подсказки — в [hints.md](hints.md).

Советы:
- сначала одна карточка с props, переданными вручную; потом — массив и `v-for`;
- открой консоль: нет ли предупреждений про типы props;
- для `formatPrice` — вынеси свою функцию из недели 0 в `src/utils/formatPrice.js` и импортируй в карточку.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 3 день 2» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему ребёнок не должен менять props и что делать вместо этого?**

---

# Занятие 3. 📜 Options API

## Часть 7. 📜 Props в Options API

### Опция `props`

**Composition API:**

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
})

const finalPrice = computed(() => props.price * (1 - props.discount / 100))
</script>
```

**Options API:**

```vue
<script>
export default {
  props: {
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  computed: {
    finalPrice() {
      return this.price * (1 - this.discount / 100)
    },
  },
}
</script>
```

Объект с описанием props — **тот же самый**. Разница в доступе:

| | Composition API | Options API |
|---|---|---|
| Объявить | `defineProps({ ... })` | опция `props: { ... }` |
| В скрипте | `props.price` | `this.price` |
| В шаблоне | `price` | `price` |

### ⚠️ Props и `data` — общий `this`

В Options API props, поля `data`, `computed` и `methods` — всё лежит на одном `this`. Поэтому **имена не должны совпадать**:

```js
export default {
  props: { title: String },
  data() {
    return { title: '' }   // ✗ конфликт имён — Vue предупредит
  },
}
```

### Своё состояние из prop

```js
export default {
  props: { title: String },
  data() {
    return {
      localTitle: this.title,   // ✓ в data() уже доступен this.title
    }
  },
}
```

### ⚠️ Короткая запись props массивом

В рабочем коде можно встретить:

```js
props: ['title', 'price'],
```

Это работает (как и `defineProps(['title', 'price'])`), но **без** проверки типов и значений по умолчанию. Подходит для быстрого прототипа, а в рабочем коде лучше объект с типами.

### Регистрация компонентов в родителе

Напоминание из вчерашнего дня: в Options API ребёнка нужно не только импортировать, но и добавить в `components`:

```vue
<script>
import ReviewCard from './components/ReviewCard.vue'

export default {
  components: { ReviewCard },
  data() {
    return { reviews: [/* ... */] }
  },
}
</script>
```

---

### ✅ Проверь себя — занятие 3

1. Перепиши мысленно в Options API: `const props = defineProps({ count: { type: Number, default: 5 } })` и `computed`, который возвращает `props.count * 2`.
2. Почему в Options API нельзя завести и prop `title`, и поле `title` в `data()`?

---

## 🛠 Бонус-практика: `ProductCard` в Options API (≈ 25 мин)

Создай рядом копию `ProductCardOptions.vue` — та же карточка, но в Options API: опция `props`, `computed` для цены со скидкой (если делала мини-задачу), `this.` в скрипте. Подключи её в `App.vue` второй строкой и сравни, что карточки выглядят одинаково.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| Компонент | файл `.vue`; импорт → тег `<ProductCard />` |
| Родитель / ребёнок | кто использует / кого используют |
| `defineProps({...})` | объявить props; импортировать не нужно |
| В шаблоне / скрипте | `price` / `props.price` |
| Строка | `title="Кружка"` |
| Число, булево, массив, переменная | только с `:` |
| `required: true` | обязательный |
| `default` | для массивов и объектов — функция `() => []` |
| Булев prop без значения | `true` |
| `in-stock` ↔ `inStock` | Vue переводит сам |
| Менять props в ребёнке | ✗ — `computed`, свой `ref` или событие родителю |
| Поля объекта в prop | технически можно изменить, но нельзя по правилам |
| `v-for` на компоненте | с `:key`, как на `<li>` |
| `v-bind="obj"` | все поля объекта как props |
| 📜 Options API | опция `props`; в скрипте `this.price`; не путать имена с `data` |

## 🛑 Конец занятия 3 — день 2 недели 3 пройден

Напиши наставнику «проверь неделю 3 день 2 Options API» и сделай заметку.
