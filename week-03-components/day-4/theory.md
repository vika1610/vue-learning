# Конспект · Неделя 3 · День 4 — `v-model` на компонентах и слоты

JS-разминка (spread для неизменяемых обновлений) → `v-model` на своём компоненте → `defineModel` → несколько `v-model` → слоты → именованные слоты → содержимое по умолчанию → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «v-model компонента», «Слоты».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. `v-model` компонента** | разминка → часть 1 (как устроен) → часть 2 (`defineModel`) → часть 3 (несколько моделей) → 3 вопроса → практика `BaseInput` | 60 мин |
| **2. Слоты + практика** | повтор → часть 4 (слоты) → часть 5 (именованные) → часть 6 (по умолчанию, ловушки) → практика `BaseModal` | 60 мин |
| **3. Options API** | повтор → часть 7 → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. `v-model` на своём компоненте

## Разминка (5 мин): spread для неизменяемых обновлений

«Неизменяемое обновление» — не менять объект, а создать **новый** с изменением:

```js
const user = { name: 'Аня', city: 'Москва' }

const moved = { ...user, city: 'Казань' }
const tags = ['vue', 'js']
const moreTags = [...tags, 'css']
```

Что в `user.city` и `tags.length` после этого кода?

<details>
<summary>Ответ</summary>

`user.city` — по-прежнему `'Москва'`, `tags.length` — `2`. Spread создал **новые** объект и массив, оригиналы не тронуты.

Этот приём пригодится, когда ребёнок хочет «изменить» объект родителя: он не меняет его, а отправляет родителю **новую версию** через событие.

</details>

---

## Часть 1. Как устроен `v-model` на компоненте

На неделе 2 ты узнала, что `v-model` на `<input>` — это `:value` + `@input`. На своём компоненте он устроен так же, только с другими именами:

```vue
<BaseInput v-model="email" />

<!-- то же самое вручную: -->
<BaseInput :modelValue="email" @update:modelValue="email = $event" />
```

- prop **`modelValue`** — значение **вниз**, к ребёнку;
- событие **`update:modelValue`** — новое значение **вверх**, к родителю.

Это ровно вчерашнее правило «props вниз, события вверх», только записанное короче. Никакой магии: родитель по-прежнему хозяин данных, а ребёнок только сообщает «пользователь ввёл вот это».

### Вручную, по-старому

Чтобы понять устройство, посмотри, как это пишется без сокращений:

```vue
<!-- SearchBox.vue -->
<script setup>
defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    placeholder="Поиск…"
  >
</template>
```

```vue
<!-- родитель -->
<SearchBox v-model="query" />
<p>Ищем: {{ query }}</p>
```

Так писали в Vue 3 до версии 3.4. И так до сих пор пишут в Options API (часть 7). В рабочем коде ты почти наверняка встретишь именно такой вариант.

---

## Часть 2. `defineModel` — то же самое коротко

С Vue 3.4 есть макрос `defineModel`:

```vue
<!-- SearchBox.vue -->
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" placeholder="Поиск…">
</template>
```

`defineModel()` возвращает `ref`, который:
- при **чтении** даёт значение, переданное родителем (`modelValue`);
- при **записи** отправляет родителю `update:modelValue`.

Внутри компонента с ним работаешь как с обычным `ref`: можно передать во вложенный `v-model`, читать `model.value`, записывать `model.value = ''`.

```js
function clear() {
  model.value = ''   // родитель получит update:modelValue с пустой строкой
}
```

### Тип и значение по умолчанию

```js
const model = defineModel({ type: String, default: '' })
```

Опции — те же, что у props: `type`, `required`, `default`.

### ⚠️ `defineModel` и данные родителя

`model.value = 'x'` **не меняет** данные родителя напрямую. Оно отправляет событие, и уже **родитель** через свой `v-model` обновляет данные. Если родитель забудет `v-model` и передаст обычный prop, значение в ребёнке «откатится» обратно. Правило «у данных один хозяин» по-прежнему работает.

### Обёртка вокруг поля с подписью и ошибкой

Главный сценарий для `defineModel` — свои **базовые** компоненты форм:

```vue
<!-- FieldText.vue -->
<script setup>
defineProps({
  label: String,
  hint: String,
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <input v-model="model">
    <small v-if="hint">{{ hint }}</small>
  </label>
</template>
```

```vue
<FieldText v-model="city" label="Город" hint="Например, Казань" />
```

В задаче дня похожий `BaseInput`, только вместо подсказки — текст ошибки, а рамка поля при ошибке красная.

---

## Часть 3. Несколько `v-model` и модификаторы

### Именованная модель

У компонента может быть **несколько** моделей. Тогда у каждой своё имя:

```vue
<!-- DateRange.vue -->
<script setup>
const from = defineModel('from')
const to = defineModel('to')
</script>

<template>
  <input type="date" v-model="from"> — <input type="date" v-model="to">
</template>
```

```vue
<DateRange v-model:from="startDate" v-model:to="endDate" />
```

Под капотом: props `from` и `to`, события `update:from` и `update:to`.

Особенно полезно для «открыто / закрыто»:

```vue
<BaseModal v-model:open="isModalOpen">...</BaseModal>
```

### Модификаторы

```vue
<FieldText v-model.trim="name" />
```

Модификаторы на своём компоненте можно получить вторым значением `defineModel`:

```js
const [model, modifiers] = defineModel({
  set(value) {
    return modifiers.trim ? value.trim() : value
  },
})
```

Это продвинутый приём — нужен в мини-задаче дня. Если сложно, оставь её на потом.

---

### ✅ Проверь себя — занятие 1

1. Из каких prop и события состоит `v-model` на компоненте?
2. Что делает `model.value = ''` внутри компонента с `defineModel`? Меняет ли это данные родителя напрямую?
3. Как сделать у компонента две модели: `title` и `price`?

---

## 🛠 Практика, часть 1: `BaseInput` (≈ 20 мин)

Сделай `BaseInput` из [task.md](task.md): подпись, поле с `defineModel`, текст ошибки и красная рамка при ошибке. Проверь в `App.vue` с двумя полями и `<pre>` для данных.

## 🛑 Конец занятия 1

5 минут на заметку: «`v-model` = prop вниз + событие вверх» своими словами.

Вопрос-повтор для следующего занятия: **как `v-model` на компоненте связан с правилом «props вниз, события вверх»?**

---

# Занятие 2. Слоты

## Часть 4. Слоты — «дырка» для разметки родителя

### Проблема

Props передают **данные**: строки, числа, объекты. А если родитель хочет передать ребёнку **кусок разметки**: заголовок с иконкой, список, кнопки?

```vue
<InfoCard :content="'<b>Внимание!</b> ...'" />   ✗ строка с HTML не выведется как HTML
```

### Решение: `<slot>`

```vue
<!-- InfoCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
</style>
```

```vue
<!-- родитель -->
<InfoCard>
  <h3>⚠️ Внимание</h3>
  <p>Магазин закрыт на инвентаризацию до <b>понедельника</b>.</p>
</InfoCard>
```

Всё, что родитель написал **между** открывающим и закрывающим тегом компонента, Vue подставит на место `<slot />`. Ребёнок задаёт **рамку** (оформление, структуру), а родитель — **содержимое**.

Это ответ на вопрос недели «Для чего нужны слоты?»: чтобы один компонент-«рамка» мог показывать разное содержимое.

### Содержимое слота видит данные родителя

```vue
<!-- родитель -->
<script setup>
const shopName = 'Ромашка'
</script>

<template>
  <InfoCard>
    <p>Добро пожаловать в «{{ shopName }}»!</p>
  </InfoCard>
</template>
```

Разметка слота пишется **в родителе**, поэтому видит переменные **родителя**, а не ребёнка.

### ⚠️ Содержимое слота не видит данные ребёнка

```vue
<!-- InfoCard.vue -->
<script setup>
const cardId = 42
</script>
```

```vue
<!-- родитель -->
<InfoCard>
  <p>{{ cardId }}</p>   <!-- ✗ cardId — переменная ребёнка, родитель её не видит -->
</InfoCard>
```

Правило: **всё в шаблоне родителя видит только данные родителя**. Если ребёнку нужно отдать данные в слот — для этого есть «слоты с параметрами» (scoped slots). Их встретишь в UI-библиотеках на неделе 7: пока достаточно знать, что такое бывает.

---

## Часть 5. Именованные слоты

Если у компонента **несколько** мест для разметки, у слотов появляются имена:

```vue
<!-- PageSection.vue -->
<template>
  <section class="section">
    <header class="section-head">
      <slot name="title" />
    </header>
    <div class="section-body">
      <slot />              <!-- без имени = слот default -->
    </div>
    <footer class="section-foot">
      <slot name="actions" />
    </footer>
  </section>
</template>
```

Родитель заполняет их через `<template #имя>`:

```vue
<PageSection>
  <template #title>
    <h2>📦 Доставка</h2>
  </template>

  <p>Доставляем по городу за 2 часа.</p>
  <p>Бесплатно от 2000 ₽.</p>

  <template #actions>
    <button>Подробнее</button>
  </template>
</PageSection>
```

- `#title` — сокращение от `v-slot:title` (как `:` — от `v-bind`, `@` — от `v-on`);
- всё, что **вне** `<template #...>`, попадает в слот без имени (`default`);
- порядок `<template>` в родителе неважен: куда что встанет, решает разметка ребёнка.

### Явный `#default`

Слот без имени можно назвать и явно:

```vue
<template #default>
  <p>Основной текст</p>
</template>
```

---

## Часть 6. Содержимое по умолчанию и ловушки

### Запасное содержимое

Что внутри `<slot>` у ребёнка — показывается, **если родитель ничего не передал**:

```vue
<!-- PageSection.vue -->
<footer>
  <slot name="actions">
    <button>Закрыть</button>   <!-- по умолчанию -->
  </slot>
</footer>
```

```vue
<PageSection>...</PageSection>                        <!-- будет кнопка «Закрыть» -->
<PageSection><template #actions>Своя кнопка</template></PageSection>   <!-- будет «Своя кнопка» -->
```

В задаче дня у `BaseModal` в `footer` по умолчанию кнопка «Закрыть».

### Не рисовать обёртку, если слот пустой

```vue
<header v-if="$slots.title">
  <slot name="title" />
</header>
```

`$slots` — объект с переданными слотами. `$slots.title` есть, только если родитель передал `#title`. Так можно не рисовать пустой `<header>`.

### ⚠️ Слот и props — что выбрать

| Нужно передать | Используй |
|---|---|
| простые данные (текст, число, флаг) | prop |
| разметку (теги, иконки, другие компоненты) | слот |

Пример: у кнопки текст обычно передают **слотом**, `<BaseButton>Купить</BaseButton>`, потому что туда может понадобиться иконка. А вариант оформления — **prop**: `variant="danger"`.

### ⚠️ `#имя` только на `<template>` или на самом компоненте

```vue
<PageSection>
  <h2 #title>Доставка</h2>   <!-- ✗ на обычном теге нельзя -->
</PageSection>
```

Для именованного слота нужна обёртка `<template #title>`.

### Модальное окно: два помощника

Для `BaseModal` в задаче пригодятся:
- **`@click.self`** на тёмной подложке — закрыть по клику мимо окна (модификатор из дня 2 недели 2);
- **`v-model:open`** — открытость окна, которой управляет родитель (часть 3).

---

## 🛠 Практика, часть 2: `BaseModal` (≈ 30 мин)

Сделай `BaseModal` из [task.md](task.md): три слота (`header`, `default`, `footer`), кнопка «Закрыть» по умолчанию, тёмная подложка, видимость управляется родителем. Подсказки — в [hints.md](hints.md).

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 3 день 4» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему разметка в слоте видит переменные родителя, а не ребёнка?**

---

# Занятие 3. 📜 Options API

## Часть 7. 📜 `v-model` компонента и слоты в Options API

### `v-model` без `defineModel`

В Options API макроса `defineModel` нет. Пишут «по-старому», через prop и событие:

**Composition API:**

```vue
<script setup>
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <input v-model="model">
</template>
```

**Options API:**

```vue
<script>
export default {
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>
```

### Удобный приём: `computed` с `get` и `set`

Чтобы внутри компонента можно было писать `v-model`, как с `defineModel`, в Options API делают `computed` с геттером и сеттером (день 4 недели 1):

```js
export default {
  props: { modelValue: String },
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
```

```vue
<input v-model="model">
```

`get` читает prop, `set` отправляет событие. По сути, ты вручную написала то, что делает `defineModel`. В рабочем коде этот приём встречается очень часто.

### Именованная модель

```js
props: { open: Boolean },
emits: ['update:open'],
methods: {
  close() {
    this.$emit('update:open', false)
  },
},
```

```vue
<BaseModal v-model:open="isOpen" />
```

### ⚠️ Во Vue 2 было иначе

Если в чужом коде встретишь prop `value` и событие `input` вместо `modelValue` и `update:modelValue` — это синтаксис **Vue 2**. Во Vue 3 имена поменялись. На работе у тебя Vue 3, но в старых библиотеках или скопированном коде такое бывает.

### Слоты — без изменений

`<slot>`, `<slot name="...">`, `<template #...>`, запасное содержимое — это шаблон. В Options API всё то же самое. Разница только в скрипте: `$slots` доступен как `this.$slots`.

```js
computed: {
  hasTitle() {
    return !!this.$slots.title
  },
},
```

`!!` превращает значение в `true` / `false` (два раза «не»): удобно для `computed`, который должен вернуть булево.

---

### ✅ Проверь себя — занятие 3

1. Какие prop и событие нужно объявить в Options API, чтобы на компоненте работал `v-model`?
2. Зачем в Options API делают `computed` с `get` и `set` для модели?

---

## 🛠 Бонус-практика (≈ 25 мин)

Сделай копию `BaseInputOptions.vue` в Options API: prop `modelValue`, событие `update:modelValue`, `computed` с `get`/`set`. Подключи её вместо `BaseInput` в одном поле и проверь, что `v-model` работает так же.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `v-model` на компоненте | `:modelValue` + `@update:modelValue` |
| `defineModel()` | `ref`, который читает prop и пишет событие |
| `model.value = x` | отправить родителю, а не поменять напрямую |
| `defineModel('open')` | именованная модель → `v-model:open` |
| `<slot />` | место для разметки родителя |
| `<slot name="x" />` | именованный слот |
| `<template #x>` | заполнить именованный слот |
| Содержимое внутри `<slot>` | показывается, если родитель ничего не передал |
| `$slots.x` | передан ли слот |
| Слот видит | данные **родителя** |
| Данные или разметка | prop или слот |
| 📜 Options API | `props: { modelValue }`, `emits: ['update:modelValue']`; `computed` с `get`/`set`; `this.$slots` |

## 🛑 Конец занятия 3 — день 4 недели 3 пройден

Напиши наставнику «проверь неделю 3 день 4 Options API» и сделай заметку.
