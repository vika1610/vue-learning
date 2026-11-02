# Конспект · Неделя 6 · День 1 — Pinia: общее хранилище состояния

JS-разминка (объекты-хранилища, паттерн «одиночка») → зачем нужна Pinia → установка → `defineStore` в двух стилях → стор в компонентах → Vue DevTools → Options API: `mapState`, `mapActions`.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: pinia.vuejs.org → «Introduction», «Defining a Store». (Документация на английском; встроенный переводчик браузера справляется хорошо.)

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Зачем Pinia и как создать стор** | разминка → часть 1 (зачем) → часть 2 (установка) → часть 3 (`defineStore`) → 3 вопроса | 60 мин |
| **2. Стор в компонентах + практика** | повтор → часть 4 (использование) → часть 5 (DevTools) → часть 6 (ловушки) → задача «Счётчик в сторе» | 60 мин |
| **3. Options API** | повтор → часть 7 (`mapState`, `mapActions`) → 2 вопроса → бонус | 60 мин |

---

# Занятие 1. Зачем Pinia и как создать стор

## Разминка (10 мин): объекты-хранилища и паттерн «одиночка»

**Одиночка** (singleton) — объект, который существует в программе в **единственном** экземпляре, и все части программы работают именно с ним.

```js
// settings.js
export const settings = {
  theme: 'light',
  language: 'ru',
}
```

```js
// a.js
import { settings } from './settings.js'
settings.theme = 'dark'
```

```js
// b.js
import { settings } from './settings.js'
console.log(settings.theme)   // ?
```

<details>
<summary>Ответ</summary>

`'dark'` (если `a.js` выполнился раньше). Модуль выполняется **один раз** (день 4 недели 0), и все, кто его импортирует, получают **один и тот же** объект — по ссылке (день 2 недели 0). Это и есть одиночка.

Ты уже делала такое во Vue: `auth.js` с `isLoggedIn` на неделе 5 и `useHabits` с состоянием вне функции в проекте. Сегодня — инструмент, который делает это «по-взрослому».

</details>

---

## Часть 1. Зачем нужна Pinia

### Где ты уже сталкивалась с проблемой

| Неделя | Проблема | Как решали |
|---|---|---|
| 3 | данные нужны далёкому потомку | `provide` / `inject` |
| 4 | события через несколько этажей (`HabitItem` → `HabitList` → `App`) | пробрасывали вручную |
| 5 | «вошла ли» нужно хуку, меню и странице | `ref` в модуле `auth.js` |
| 5, проект | привычки нужны всем страницам | `useHabits` с состоянием вне функции |

Во всех случаях нужно **общее состояние приложения**: данные, которые нужны многим компонентам, не связанным как родитель и ребёнок.

### Что такое Pinia

**Pinia** — официальная библиотека для общего состояния во Vue. **Стор** (store, «хранилище») — это одиночка с:
- **состоянием** (state) — данными;
- **геттерами** (getters) — вычисляемыми значениями;
- **действиями** (actions) — функциями, которые меняют состояние.

Почему не просто `ref` в модуле, как в `auth.js`?
- **Vue DevTools**: видно состояние каждого стора, история изменений, можно менять значения руками;
- **порядок**: у всех сторов одинаковое устройство, сразу понятно, где что;
- **расширения**: плагины (например, сохранение в `localStorage`), правильная работа с горячей перезагрузкой, тестирование (неделя 7), серверный рендеринг (Nuxt, неделя 8).

> Название — от испанского *piña*, «ананас»: много отдельных ягод, собранных в один плод. Как сторы в приложении.

### Когда что использовать

Это ответ на вопрос недели «Когда данные стоит хранить в Pinia, а когда — в компоненте?»:

| Данные | Где |
|---|---|
| нужны **одному** компоненту (открыто ли меню, текст в поле формы) | в компоненте (`ref`) |
| нужны родителю и ребёнку | в родителе, ребёнку — props |
| нужны **многим** компонентам в разных частях приложения (корзина, пользователь, список привычек) | **Pinia** |

Не нужно класть в стор **всё**. Стор — для по-настоящему общего.

---

## Часть 2. Установка и подключение

```bash
npm install pinia
```

(В `vue-exercises` уже установлена.)

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

Pinia — тоже плагин, как роутер. В своём проекте — в `main.js`, в `vue-exercises` — в `setup.js` рядом с задачей.

```js
// main.js своего проекта
createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

---

## Часть 3. `defineStore` — два стиля

Сторы принято класть в папку `stores/`, по файлу на стор. Пример — стор настроек плеера.

### Стиль «setup» — как `<script setup>`

```js
// stores/player.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // state
  const volume = ref(50)
  const isMuted = ref(false)

  // getters
  const effectiveVolume = computed(() => (isMuted.value ? 0 : volume.value))

  // actions
  function louder() {
    volume.value = Math.min(100, volume.value + 10)
  }
  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  return { volume, isMuted, effectiveVolume, louder, toggleMute }
})
```

Это **ровно композабл** (неделя 4): `ref` — состояние, `computed` — геттеры, функции — действия, `return` всего нужного. Только Pinia гарантирует, что функция выполнится **один раз** на всё приложение.

### Стиль «options» — как Options API

```js
// stores/player.js
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    volume: 50,
    isMuted: false,
  }),
  getters: {
    effectiveVolume: (state) => (state.isMuted ? 0 : state.volume),
  },
  actions: {
    louder() {
      this.volume = Math.min(100, this.volume + 10)
    },
    toggleMute() {
      this.isMuted = !this.isMuted
    },
  },
})
```

Это **почти Options API**: `state` — как `data()` (тоже функция!), `getters` — как `computed`, `actions` — как `methods` с `this`.

| | setup-стор | options-стор |
|---|---|---|
| Состояние | `ref(...)` | `state: () => ({ ... })` |
| Геттеры | `computed(...)` | `getters: { x: (state) => ... }` |
| Действия | функции | `actions: { x() { this... } }` |
| Не забыть | `return` всего | `state` — функция |

Оба стиля **равноправны** и работают одинаково. Выбери любой: если тебе ближе `<script setup>` — setup-стор; если хочешь потренировать Options API для работы — options-стор. В рабочих проектах встречаются оба.

### Соглашения

- имя функции — **`use…Store`**: `usePlayerStore`, `useCartStore`;
- первый аргумент — **уникальный id** стора: `'player'`, `'cart'`. Под этим именем стор виден в DevTools;
- файл — `stores/player.js`.

### ⚠️ setup-стор: забытый `return`

```js
export const usePlayerStore = defineStore('player', () => {
  const volume = ref(50)
  function louder() { volume.value += 10 }
  return { volume }   // ⚠️ louder не вернули — его не будет в сторе
})
```

Как в композабле: не вернула — не существует снаружи.

### ⚠️ options-стор: `state` — функция

```js
state: { volume: 50 },          // ✗
state: () => ({ volume: 50 }),  // ✓ функция, возвращающая объект; круглые скобки!
```

Та же история, что `data()` в Options API. И помни про `({ })` вокруг объекта в стрелке.

---

### ✅ Проверь себя — занятие 1

1. Какие данные стоит класть в Pinia, а какие — оставить в компоненте?
2. Из каких трёх частей состоит стор и чем они соответствуют `ref`, `computed` и функциям?
3. Чем setup-стор похож на композабл?

---

## 🛑 Конец занятия 1

5 минут на заметку: таблица «state / getters / actions ↔ ref / computed / функции».

Вопрос-повтор для следующего занятия: **что такое паттерн «одиночка» и как он связан со стором?**

---

# Занятие 2. Стор в компонентах

## Часть 4. Использовать стор

```vue
<!-- VolumeControls.vue -->
<script setup>
import { usePlayerStore } from '../stores/player.js'

const player = usePlayerStore()
</script>

<template>
  <button @click="player.louder">🔊 Громче</button>
  <button @click="player.toggleMute">{{ player.isMuted ? '🔇' : '🔈' }}</button>
</template>
```

```vue
<!-- VolumeDisplay.vue -->
<script setup>
import { usePlayerStore } from '../stores/player.js'

const player = usePlayerStore()
</script>

<template>
  <p>Громкость: {{ player.effectiveVolume }}</p>
</template>
```

- `usePlayerStore()` возвращает **стор** — один и тот же объект в обоих компонентах;
- состояние, геттеры и действия — его **свойства**: `player.volume`, `player.effectiveVolume`, `player.louder()`;
- **без `.value`**: стор — реактивный объект (как `reactive`), он распаковывает `ref` сам. Это касается и шаблона, и скрипта.

Нажимаешь «Громче» в одном компоненте — число меняется в другом, хотя они не передают друг другу ни props, ни событий.

### Менять состояние

```js
player.louder()          // ✓ через действие — лучший способ
player.volume = 80       // ✓ можно и напрямую
```

Pinia разрешает менять state напрямую. Но если смена — это часть **логики** (проверки, ограничения, несколько полей сразу), лучше делать её в **действии**: тогда правила живут в одном месте.

Это ответ на вопрос недели «Чем getter отличается от action?»: **геттер вычисляет** значение из состояния (как `computed`, только чтение), а **действие меняет** состояние (как функция-обработчик).

---

## Часть 5. Vue DevTools: вкладка Pinia

Открой DevTools → вкладка **Vue** → раздел **Pinia** (или отдельная вкладка в новых версиях):
- список всех сторов по их id;
- текущее **состояние** и **геттеры** — меняются в реальном времени;
- значения можно **редактировать** прямо там — удобно для проверки интерфейса;
- в **Timeline** — история: какое действие когда вызвано и что поменяло.

Это одна из главных причин использовать Pinia вместо самодельного `ref` в модуле.

---

## Часть 6. Подводные камни

### ⚠️ Стор вызван до подключения Pinia

```js
// какой-то модуль, верхний уровень
const player = usePlayerStore()   // ✗ ошибка: getActivePinia() was called but there was no active Pinia
```

`usePlayerStore()` можно вызывать там, где Pinia уже подключена: в `<script setup>`, внутри функций, в навигационных хуках роутера. На верхнем уровне обычного модуля, который выполняется до `app.use(createPinia())`, — нельзя.

### ⚠️ Одинаковые id у двух сторов

```js
defineStore('store', ...)   // в cart.js
defineStore('store', ...)   // в user.js — ✗ они смешаются
```

Id должен быть **уникальным** и понятным: `'cart'`, `'user'`.

### ⚠️ Деструктуризация стора ломает реактивность

```js
const { volume } = usePlayerStore()   // ✗ volume — просто число в момент вызова
```

Стор — реактивный объект, а деструктуризация `reactive` теряет реактивность (день 3 недели 1). Пока работай через `player.volume`. Как правильно доставать поля — завтра (`storeToRefs`).

---

## 🛠 Практика: «Счётчик в сторе» (≈ 30 мин)

Открой `Exercise.vue` и `setup.js` рядом с этим файлом. Условие — в `Exercise.vue`, подсказки — в `hints.md`.

1. `app.use(createPinia())` в `setup.js`.
2. `stores/counter.js` — в любом из двух стилей (или в обоих!).
3. Два компонента: кнопки и дисплей.
4. Посмотри на стор во Vue DevTools и поменяй значение оттуда.

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 6 день 1» и сделай заметку.

Вопрос-повтор для следующего занятия: **чем геттер отличается от действия?**

---

# Занятие 3. 📜 Options API

## Часть 7. 📜 Pinia в компонентах на Options API

### Через `setup()`

Самый простой путь — тот же, что с композаблами (день 1 недели 4):

```js
import { usePlayerStore } from '../stores/player.js'

export default {
  setup() {
    const player = usePlayerStore()
    return { player }
  },
  // в шаблоне: player.volume, player.louder()
  // в методах: this.player.louder()
}
```

### Помощники `map…`

Для Options API у Pinia есть функции, которые «раскладывают» стор по опциям компонента:

```js
import { mapState, mapActions } from 'pinia'
import { usePlayerStore } from '../stores/player.js'

export default {
  computed: {
    ...mapState(usePlayerStore, ['volume', 'effectiveVolume']),
  },
  methods: {
    ...mapActions(usePlayerStore, ['louder', 'toggleMute']),
  },
}
```

```vue
<template>
  <p>Громкость: {{ effectiveVolume }}</p>
  <button @click="louder">Громче</button>
</template>
```

- `mapState(стор, [имена])` → `computed`-свойства для **state и getters**. Только для чтения;
- `mapActions(стор, [имена])` → методы;
- `...` — spread (день 3 недели 0): помощник возвращает объект, и его свойства «раскладываются» внутрь `computed` / `methods` рядом с твоими.

Теперь `this.volume`, `this.louder()` работают как обычные свойства компонента.

### Ещё помощники

| Помощник | Куда | Что даёт |
|---|---|---|
| `mapState` | `computed` | state и getters для чтения |
| `mapWritableState` | `computed` | state, который можно **менять**: `this.volume = 80` |
| `mapActions` | `methods` | действия |
| `mapStores` | `computed` | весь стор: `this.playerStore` (имя + `Store`) |

### ⚠️ `mapState` — только для чтения

```js
computed: { ...mapState(usePlayerStore, ['volume']) },
methods: {
  reset() {
    this.volume = 50   // ✗ предупреждение: computed только для чтения
  },
},
```

Для записи — `mapWritableState` или (лучше) действие стора.

### В рабочем коде: Vuex

Если увидишь `this.$store`, `this.$store.commit(...)`, `mapGetters`, `mapMutations` — это **Vuex**, предшественник Pinia. Похоже, но есть «мутации» (`mutations`) — отдельный способ менять state, которого в Pinia нет. Pinia — официальная замена Vuex для Vue 3. Если на работе Vuex — подойди с этим к наставнику, разберём отличия.

---

### ✅ Проверь себя — занятие 3

1. Чем `mapState` отличается от `mapWritableState`?
2. Почему `...mapState(...)` пишется с тремя точками?

---

## 🛠 Бонус-практика (≈ 20 мин)

Сделай третий компонент `CounterOptions.vue` на Options API: показывает число и удвоенное значение через `mapState`, кнопки — через `mapActions`. Подключи рядом с двумя другими и убедись, что все три работают с одним стором.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| Pinia | общее состояние для многих компонентов |
| Когда | нужно многим и далёким компонентам; иначе — компонент / props |
| Подключить | `app.use(createPinia())` |
| `defineStore('id', () => {...})` | setup-стор: `ref`, `computed`, функции, `return` |
| `defineStore('id', { state, getters, actions })` | options-стор; `state` — функция |
| Имя | `use…Store`, файл в `stores/` |
| Использовать | `const s = useXStore()`; `s.field`, `s.action()` без `.value` |
| Геттер / действие | вычисляет / меняет |
| DevTools | состояние, правка, история действий |
| Деструктуризация стора | ✗ — завтра `storeToRefs` |
| 📜 Options API | `setup()` или `...mapState` в `computed`, `...mapActions` в `methods` |
| `this.$store` | это Vuex |

## 🛑 Конец занятия 3 — день 1 недели 6 пройден

Напиши наставнику «проверь неделю 6 день 1 Options API» и сделай заметку.
