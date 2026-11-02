# Конспект · Неделя 2 · День 3 — Формы и `v-model`

JS-разминка (формы и типы `input`) → что такое `v-model` и как он устроен → текстовые поля → чекбоксы, радиокнопки, списки → модификаторы `.trim`, `.number`, `.lazy` → форма целиком → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «Привязка к элементам форм».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. `v-model` и поля** | разминка → часть 1 (как устроен `v-model`) → часть 2 (текст) → часть 3 (чекбоксы, радио, select) → 3 вопроса | 60 мин |
| **2. Модификаторы, форма + практика** | повтор → часть 4 (модификаторы) → часть 5 (форма целиком) → 3 вопроса → задача «Форма регистрации» | 60 мин |
| **3. Options API** | повтор → часть 6 → 2 вопроса → бонус `ExerciseOptions.vue` | 60 мин |

---

# Занятие 1. `v-model` и поля формы

## Разминка (10 мин): формы и типы `input`

У `<input>` много типов. Каждый браузер показывает их по-своему и по-своему проверяет:

| `type` | Что это |
|---|---|
| `text` | обычный текст (по умолчанию) |
| `email` | email: браузер проверит наличие `@` при отправке, на телефоне — клавиатура с `@` |
| `password` | текст скрыт точками |
| `number` | число: стрелочки, на телефоне — цифровая клавиатура |
| `checkbox` | галочка: да или нет |
| `radio` | выбор одного из нескольких |
| `date` | дата с календариком |

Вопросы:

1. Что лежит в `input.value` у поля `type="number"`, если в нём `42`: число или строка?
2. Зачем у `<label>` атрибут `for`, а у `<input>` — `id`?

```html
<label for="email">Email</label>
<input id="email" type="email">
```

<details>
<summary>Ответ</summary>

1. **Строка** `'42'`. Даже у `type="number"` значение поля — всегда строка. Ловушка из дня 5 недели 1.
2. Так `label` **связан** с полем: клик по тексту «Email» ставит курсор в поле, а для чекбокса — ставит или снимает галочку. И программы для незрячих людей читают подпись поля. Другой способ связать — положить поле **внутрь** `<label>`:
   ```html
   <label>Email <input type="email"></label>
   ```

</details>

---

## Часть 1. Что такое `v-model`

### Двусторонняя связь

До сих пор данные шли **в одну сторону**: из `ref` на страницу (`{{ }}`, `:value`). Но в форме нужно и **обратно**: пользователь ввёл текст → он должен оказаться в `ref`.

`v-model` делает связь **двусторонней**:

```vue
<script setup>
import { ref } from 'vue'

const city = ref('Москва')
</script>

<template>
  <input v-model="city">
  <p>Вы выбрали: {{ city }}</p>
</template>
```

- поменяешь `city.value` в коде → изменится текст в поле;
- введёшь текст в поле → изменится `city.value`, а с ним и абзац под полем.

```
   ref ──────► поле ввода
       ◄──────
```

### Как он устроен внутри

`v-model` — это сокращение двух вещей, которые ты уже знаешь:

```vue
<input v-model="city">

<!-- то же самое вручную: -->
<input :value="city" @input="city = $event.target.value">
```

- `:value="city"` — данные **в** поле (`v-bind`, день 2 недели 1);
- `@input="..."` — при вводе забрать текст **из** поля в `ref` (событие и `$event`, вчерашний день).

Никакой магии — просто удобная запись. Это пригодится на неделе 3, когда будешь делать `v-model` для своих компонентов.

### ⚠️ `v-model` нужна реактивная переменная

```js
const city = 'Москва'         // ✗ обычная константа — поле не сможет её изменить
const city = ref('Москва')    // ✓
```

С обычной константой Vue выдаст ошибку или предупреждение: «присваивание константе». `v-model` всегда указывает на `ref`, поле `reactive` или поле в `data()`.

### ⚠️ `v-model` главнее атрибута `value`

```vue
<input v-model="city" value="Казань">   <!-- value будет проигнорирован -->
```

Начальное значение берётся **из данных**, а не из атрибута. Хочешь «Казань» по умолчанию — пиши `ref('Казань')`. То же с `checked` у чекбоксов и `selected` у `<option>`.

---

## Часть 2. Текстовые поля

### `input` и `textarea`

```vue
<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
</script>

<template>
  <input v-model="title" placeholder="Название">
  <textarea v-model="description" placeholder="Описание"></textarea>
  <p>Символов в описании: {{ description.length }}</p>
</template>
```

### ⚠️ В `textarea` — только `v-model`, не `{{ }}`

```vue
<textarea>{{ description }}</textarea>     ✗ не будет двусторонней связи
<textarea v-model="description"></textarea> ✓
```

### `type` не меняет `v-model`

`email`, `password`, `search`, `tel`, `url` — для всех текстовых типов `v-model` работает одинаково. Тип влияет только на то, как браузер **показывает и проверяет** поле.

---

## Часть 3. Чекбоксы, радиокнопки, выпадающие списки

### Один чекбокс → `true` / `false`

```vue
<script setup>
import { ref } from 'vue'

const subscribe = ref(false)
</script>

<template>
  <label>
    <input type="checkbox" v-model="subscribe">
    Подписаться на новости
  </label>
  <p>{{ subscribe ? 'Подписка оформлена' : 'Без подписки' }}</p>
</template>
```

У одного чекбокса `v-model` связан не с `value`, а с **галочкой**: в `ref` лежит `true` или `false`. Vue сам понимает это по `type="checkbox"`.

### Несколько чекбоксов → массив

```vue
<script setup>
import { ref } from 'vue'

const toppings = ref([])   // ⚠️ начальное значение — массив!
</script>

<template>
  <label><input type="checkbox" value="сыр" v-model="toppings"> Сыр</label>
  <label><input type="checkbox" value="грибы" v-model="toppings"> Грибы</label>
  <label><input type="checkbox" value="оливки" v-model="toppings"> Оливки</label>
  <p>Выбрано: {{ toppings.join(', ') }}</p>
</template>
```

Если несколько чекбоксов связаны с **одним массивом**, в нём будут `value` отмеченных: `['сыр', 'оливки']`.

⚠️ Если начальное значение не массив, а `false` или `''`, Vue будет работать с ним как с одиночным чекбоксом, и все галочки станут ставиться и сниматься вместе.

### Радиокнопки → одно значение

```vue
<script setup>
import { ref } from 'vue'

const delivery = ref('courier')
</script>

<template>
  <label><input type="radio" value="courier" v-model="delivery"> Курьер</label>
  <label><input type="radio" value="pickup" v-model="delivery"> Самовывоз</label>
  <p>Способ доставки: {{ delivery }}</p>
</template>
```

В `ref` лежит `value` выбранной кнопки. Атрибут `name` у радиокнопок с `v-model` не обязателен: группу объединяет общая переменная.

### Выпадающий список `<select>`

```vue
<script setup>
import { ref } from 'vue'

const country = ref('')
const countries = ['Россия', 'Казахстан', 'Беларусь']
</script>

<template>
  <select v-model="country">
    <option disabled value="">Выберите страну</option>
    <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
  </select>
  <p>Страна: {{ country || 'не выбрана' }}</p>
</template>
```

- `v-model` на `<select>`, а не на `<option>`;
- `<option disabled value="">` — подсказка «Выберите…», которую нельзя выбрать снова;
- варианты удобно генерировать через `v-for`.

### ⚠️ Начальное значение `select`, которого нет среди вариантов

Если `country = ref('Франция')`, а такого `<option>` нет, список покажется **пустым**. Начальное значение должно совпадать с одним из `value` (или быть `''` для подсказки).

### Сводка: что лежит в `ref`

| Поле | В `ref` |
|---|---|
| `input` текстовый, `textarea` | строка |
| один `checkbox` | `true` / `false` |
| несколько `checkbox` с одним массивом | массив `value` отмеченных |
| `radio` | `value` выбранной |
| `select` | `value` выбранного `option` |

---

### ✅ Проверь себя — занятие 1

1. Как `v-model` устроен «под капотом»? Из каких двух вещей он состоит?
2. Что будет лежать в `ref` у одного чекбокса и у группы чекбоксов с общим массивом?
3. Почему `<input v-model="name" value="Аня">` не покажет «Аня»?

---

## 🛑 Конец занятия 1

5 минут на заметку: таблица «поле → что в `ref`» своими словами.

Вопрос-повтор для следующего занятия: **что такое двусторонняя связь и почему `{{ }}` её не даёт?**

---

# Занятие 2. Модификаторы и форма целиком

## Часть 4. Модификаторы `v-model`

### `.trim` — убрать пробелы по краям

```vue
<input v-model.trim="username">
```

Пользователь ввёл `'  anna  '` — в `ref` окажется `'anna'`. Особенно важно для имён, email и логинов: случайный пробел в конце — частая причина «не могу войти».

Вчера ты делала `trim()` вручную перед добавлением в список. С `.trim` Vue делает это сам при каждом вводе.

### `.number` — превратить в число

```vue
<input type="number" v-model.number="age">
```

Строка `'25'` превратится в число `25`. Ты уже знакомилась с ним в калькуляторе чаевых.

⚠️ Если поле пустое или введено не число, `.number` оставит **строку** как есть (`''`). Поэтому перед вычислениями всё равно проверяй значение.

### `.lazy` — обновлять не на каждый символ

```vue
<input v-model.lazy="comment">
```

Обычный `v-model` обновляет данные **на каждый символ** (событие `input`). С `.lazy` — когда пользователь **закончил** ввод и ушёл из поля (событие `change`).

Пригодится, если на каждое изменение запускается что-то тяжёлое, или если показывать ошибку «слишком коротко» на каждый символ раздражает. Завтра, в задаче про валидацию, это может понадобиться.

### Вместе

```vue
<input v-model.trim.lazy="email">
```

---

## Часть 5. Форма целиком

### Данные формы — в одном объекте

Когда полей много, удобно держать их в одном `reactive`: данные одной формы лежат вместе, и не нужно писать `.value` у каждого поля.

```vue
<script setup>
import { reactive, ref, computed } from 'vue'

const order = reactive({
  name: '',
  phone: '',
  delivery: 'courier',
  comment: '',
  agree: false,
})

const submitted = ref(false)

const canSubmit = computed(() => order.agree && order.name !== '')

function submit() {
  submitted.value = true
}
</script>

<template>
  <form @submit.prevent="submit">
    <label>Имя <input v-model.trim="order.name"></label>
    <label>Телефон <input type="tel" v-model.trim="order.phone"></label>

    <label><input type="radio" value="courier" v-model="order.delivery"> Курьер</label>
    <label><input type="radio" value="pickup" v-model="order.delivery"> Самовывоз</label>

    <textarea v-model="order.comment"></textarea>

    <label><input type="checkbox" v-model="order.agree"> Согласна с условиями</label>

    <button :disabled="!canSubmit">Оформить</button>
  </form>

  <p v-if="submitted">Спасибо, {{ order.name }}! Заказ принят.</p>

  <pre>{{ order }}</pre>
</template>
```

### Разбор

- **`v-model="order.name"`** — с полем `reactive` работает так же, как с `ref`;
- **`:disabled="!canSubmit"`** — кнопка неактивна, пока условие не выполнено. `disabled` — атрибут, значит `:` (день 2 недели 1). Условие — в `computed` (день 4 недели 1);
- **`@submit.prevent`** — вчерашний модификатор, чтобы страница не перезагружалась;
- **`submitted`** — отдельный `ref`: показывает сообщение после отправки через `v-if`.

### `<pre>{{ order }}</pre>` — окно в данные

```vue
<pre>{{ order }}</pre>
```

Если вывести в `{{ }}` объект целиком, Vue покажет его как **JSON** (как `JSON.stringify` из дня 5 недели 0). Тег `<pre>` сохраняет переносы и отступы. Это удобнейший способ отладки формы: вводишь в поля и тут же видишь, что попадает в данные. Обрати внимание, где строки в кавычках, а где числа без кавычек: так видно, сработал ли `.number`.

Перед сдачей задачи такой `<pre>` обычно удаляют, а во время работы он очень помогает.

### ⚠️ Пароли не показывать

Если в форме есть пароль, **не выводи его** на странице после отправки, даже «для проверки». Это хорошая привычка безопасности, и в задаче это отдельное требование.

### ⚠️ `disabled` — защита только «для глаз»

```vue
<button :disabled="!canSubmit">Оформить</button>
```

`disabled` не даёт нажать кнопку (и пока единственная кнопка отправки неактивна, Enter в поле форму тоже не отправит). Но это защита только на странице: атрибут можно снять через DevTools, в форме может появиться вторая кнопка отправки, а функцию `submit` могут вызвать из другого места кода. Поэтому проверку стоит повторить и в самой функции:

```js
function submit() {
  if (!canSubmit.value) return
  submitted.value = true
}
```

---

### ✅ Проверь себя — занятие 2

1. Что положит `v-model.number` в данные, если поле пустое?
2. Чем `v-model.lazy` отличается от обычного `v-model`?
3. Зачем повторять проверку в функции `submit`, если кнопка уже `:disabled`?

---

## 🛠 Практика: «Форма регистрации» (≈ 30 мин)

Открой `Exercise.vue` рядом с этим файлом. Подсказки — в `hints.md`.

Советы:
- **первым делом** добавь `<pre>{{ form }}</pre>` и проверяй каждое поле, которое подключаешь;
- проверь, что возраст с `.number` в `<pre>` выводится **без кавычек**;
- после отправки покажи приветствие, но **без паролей**.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 2 день 3» и сделай заметку.

Вопрос-повтор для следующего занятия: **какие три модификатора `v-model` ты знаешь и что делает каждый?**

---

# Занятие 3. 📜 Options API

## Часть 6. 📜 Формы в Options API

### `v-model` — тот же, данные — в `data()`

`v-model` и все модификаторы — это шаблон, поэтому пишутся одинаково. Объект формы лежит в `data()`.

**Composition API:**

```vue
<script setup>
import { reactive, ref, computed } from 'vue'

const order = reactive({ name: '', agree: false })
const submitted = ref(false)
const canSubmit = computed(() => order.agree && order.name !== '')

function submit() {
  if (!canSubmit.value) return
  submitted.value = true
}
</script>
```

**Options API:**

```vue
<script>
export default {
  data() {
    return {
      order: { name: '', agree: false },
      submitted: false,
    }
  },
  computed: {
    canSubmit() {
      return this.order.agree && this.order.name !== ''
    },
  },
  methods: {
    submit() {
      if (!this.canSubmit) return   // computed — без скобок и без .value
      this.submitted = true
    },
  },
}
</script>
```

Шаблон для обоих:

```vue
<form @submit.prevent="submit">
  <input v-model.trim="order.name">
  <input type="checkbox" v-model="order.agree">
  <button :disabled="!canSubmit">Оформить</button>
</form>
```

### Сравнение

| | Composition API | Options API |
|---|---|---|
| Объект формы | `reactive({ ... })` | поле в `data()` |
| `v-model` | `v-model="order.name"` | `v-model="order.name"` — то же |
| Прочитать в скрипте | `order.name` | `this.order.name` |
| `computed` в скрипте | `canSubmit.value` | `this.canSubmit` |

### Сбросить форму

Частая задача — очистить форму после отправки. В Options API удобно держать «пустую форму» в функции:

```js
function emptyOrder() {
  return { name: '', phone: '', agree: false }
}

export default {
  data() {
    return { order: emptyOrder() }
  },
  methods: {
    reset() {
      this.order = emptyOrder()   // ✓ в Options API можно заменить объект целиком
    },
  },
}
```

⚠️ Обрати внимание: в Options API **заменить** объект из `data()` целиком можно — Vue это заметит, потому что `this.order` — поле реактивного объекта компонента. А в Composition API с `reactive` так нельзя (ловушка 4 из дня 3 недели 1): там меняют поля через `Object.assign(order, emptyOrder())` или используют `ref` и `order.value = emptyOrder()`.

---

### ✅ Проверь себя — занятие 3

1. Перепиши мысленно в Options API: `const newsletter = ref(false)` и чекбокс `<input type="checkbox" v-model="newsletter">`. Что изменится в шаблоне?
2. Почему в Options API можно написать `this.order = emptyOrder()`, а в Composition API с `const order = reactive(...)` так делать нельзя?

---

## 🛠 Бонус-практика: форма регистрации в Options API (≈ 20 мин)

Открой `ExerciseOptions.vue` рядом с этим файлом. В меню задач — ссылка **«Options API»**.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `v-model` | двусторонняя связь поля и данных |
| Под капотом | `:value` + `@input` |
| Цель `v-model` | `ref`, поле `reactive` или поле в `data()` — не константа |
| Атрибуты `value` / `checked` | игнорируются — начальное значение из данных |
| Один чекбокс | `true` / `false` |
| Группа чекбоксов | массив; начальное значение `[]` |
| Радио, `select` | `value` выбранного |
| `<option disabled value="">` | подсказка «Выберите…» |
| `.trim` | убрать пробелы по краям |
| `.number` | число; пустое поле — `''` |
| `.lazy` | обновить после ухода из поля |
| Отладка | `<pre>{{ form }}</pre>` |
| `:disabled` | защита только на странице — проверяй и в функции |
| Пароли | не выводить на страницу |
| 📜 Options API | форма в `data()`; `this.form.name`; заменить объект целиком можно |

## 🛑 Конец занятия 3 — день 3 недели 2 пройден

Напиши наставнику «проверь неделю 2 день 3 Options API» и сделай заметку.
