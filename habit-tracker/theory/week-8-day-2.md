# Конспект · Неделя 8 · День 2 — ПРОЕКТ: улучшения — VueUse, горячие клавиши, уведомления, анимации

Обзор VueUse → горячие клавиши → уведомления (тосты) → анимации `<Transition>` → анимация списка `<TransitionGroup>` → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: vueuse.org; ru.vuejs.org → «Transition», «TransitionGroup».

Шаги проекта — из [SPEC.md](../SPEC.md), неделя 8, день 2.

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. VueUse и горячие клавиши** | часть 1 (VueUse) → часть 2 (горячие клавиши) → практика | 60 мин |
| **2. Уведомления** | часть 3 (свои тосты) → практика | 60 мин |
| **3. Анимации + Options API** | часть 4 (`Transition`) → часть 5 (`TransitionGroup`) → практика → часть 6 | 60 мин |

---

# Занятие 1. VueUse и горячие клавиши

## Часть 1. VueUse — библиотека готовых композаблов

**VueUse** — коллекция из 200+ композаблов на все случаи жизни. Ты уже пользовалась одним — `useDark`. Посмотри, что ещё ты писала сама, и что там есть готовым:

| Ты писала | В VueUse |
|---|---|
| `useWindowWidth` (неделя 4, день 1) | `useWindowSize` |
| `useLocalStorage` (неделя 4, день 2) | `useLocalStorage` / `useStorage` |
| `useFetch` (неделя 4, день 1) | `useFetch` |
| таймер с `setInterval` + уборка (неделя 2, день 5) | `useIntervalFn`, `useTimeoutFn` |
| `addEventListener` + `removeEventListener` | `useEventListener` |

Хорошая новость: ты **понимаешь**, как они устроены внутри, потому что писала такие сама. VueUse — не магия, а аккуратно сделанные композаблы с теми же `ref`, `watch` и хуками.

Ещё полезные:

| Композабл | Что делает |
|---|---|
| `useTitle` | заголовок вкладки, реактивно |
| `onClickOutside` | клик **мимо** элемента — закрыть меню или модалку |
| `useClipboard` | копировать в буфер обмена |
| `useOnline` | есть ли интернет |
| `useMagicKeys`, `onKeyStroke` | горячие клавиши |

### ⚠️ Стоит ли заменять свои композаблы на VueUse

В **учебном** проекте — не обязательно: твои композаблы — часть портфолио, они показывают, что ты умеешь. А в **рабочих** проектах VueUse часто уже подключён, и лучше пользоваться им, чем писать заново. Теперь, встретив `useEventListener` или `useStorage` в рабочем коде, ты будешь знать, что это.

---

## Часть 2. Горячие клавиши

### `onKeyStroke`

```js
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('n', (event) => {
  event.preventDefault()
  openNewHabitForm()
})
```

Подписка на `keydown` на всём документе + автоматическая уборка при удалении компонента. То, что ты делала руками в неделе 2 (`addEventListener` в `onMounted` + `removeEventListener` в `onUnmounted`), — в одну строку.

### ⚠️ Не перехватывай клавиши при вводе текста

Если пользователь печатает «новая привычка» в поле, буква `n` не должна открывать форму! Проверь, где сейчас фокус:

```js
onKeyStroke('n', (event) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
  event.preventDefault()
  openNewHabitForm()
})
```

### Идеи для трекера

| Клавиша | Действие |
|---|---|
| `n` | фокус на поле «новая привычка» |
| `1`…`9` | отметить привычку с этим номером на странице «Сегодня» |
| `Esc` | закрыть модалку / отменить редактирование |
| `?` | показать подсказку со списком клавиш |

### Фокус на поле

Чтобы поставить курсор в поле, нужен доступ к **DOM-элементу**. Во Vue для этого есть **ссылка на элемент в шаблоне**:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const input = useTemplateRef<HTMLInputElement>('titleInput')

function focusTitle() {
  input.value?.focus()
}
</script>

<template>
  <input ref="titleInput">
</template>
```

`ref="имя"` в шаблоне + `useTemplateRef('имя')` в скрипте (Vue 3.5) → `input.value` — настоящий `<input>`. Доступен **после** `onMounted` (неделя 2, день 5). В более старом коде пишут `const titleInput = ref(null)` с тем же именем, что в `ref="titleInput"`.

---

## 🛠 Практика, часть 1 (≈ 40 мин)

1. `npm install @vueuse/core` (если ещё не установлен для `useDark`).
2. Горячая клавиша `n` — фокус на поле новой привычки (с проверкой «не в поле ли курсор»).
3. `Esc` — отмена редактирования.
4. Бонус: `1`…`9` на «Сегодня»; подсказка по `?`.

## 🛑 Конец занятия 1

Вопрос-повтор для следующего занятия: **почему горячие клавиши нужно отключать, когда курсор в поле ввода?**

---

# Занятие 2. Уведомления

## Часть 3. Свои «тосты»

**Тост** (toast) — небольшое уведомление в углу экрана, которое само исчезает через пару секунд: «Привычка добавлена ✓», «Удалено».

Это отличная задача на всё, что ты прошла: общее состояние, компоненты, таймеры, анимация.

### Где живёт список уведомлений

Показать тост может **любой** компонент, а отображается список в **одном** месте. Значит — общее состояние: маленький стор (неделя 6).

```ts
// stores/toasts.ts
export const useToastsStore = defineStore('toasts', () => {
  const items = ref<{ id: number; text: string }[]>([])
  let nextId = 1

  function show(text: string, duration = 2500) {
    const id = nextId++
    items.value.push({ id, text })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  return { items, show, remove }
})
```

Узнаёшь? `nextId++` — генератор id из недели 0 (`makeIdGenerator`), `filter` по `id` — удаление из недели 2, `setTimeout` — неделя 2, день 5.

### Где показать

```vue
<!-- components/ToastList.vue, подключён один раз в App.vue -->
<script setup lang="ts">
import { useToastsStore } from '../stores/toasts'
const toasts = useToastsStore()
</script>

<template>
  <div class="toasts">
    <div v-for="t in toasts.items" :key="t.id" class="toast" @click="toasts.remove(t.id)">
      {{ t.text }}
    </div>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
```

### Вызвать

```ts
const toasts = useToastsStore()

function onAdd(input) {
  habitsStore.addHabit(input)
  toasts.show('Привычка добавлена ✓')
}
```

### ⚠️ Таймеры в сторе

`setTimeout` внутри стора не «уберётся» при удалении компонента — и не должен: тост должен исчезнуть, даже если страницу сменили. Здесь это правильно. Но если тост удалили кликом раньше, `setTimeout` всё равно вызовет `remove(id)` — ничего страшного, `filter` просто ничего не найдёт.

### Системные уведомления браузера (обзор)

Есть и настоящие уведомления операционной системы (Notification API, в VueUse — `useWebNotification`). Они требуют **разрешения** пользователя и работают, даже когда вкладка не активна — например, «Не забудь отметить привычки!». Это бонус для желающих.

---

## 🛠 Практика, часть 2 (≈ 45 мин)

1. Стор `toasts`.
2. `ToastList` в `App.vue`, позиция в углу.
3. Тосты при добавлении, удалении и отметке привычки.
4. Тёмная тема для тостов через CSS-переменные.

Коммит: «Трекер: горячие клавиши и уведомления».

## 🛑 Конец занятия 2

Вопрос-повтор для следующего занятия: **почему список тостов — в сторе, а не в компоненте?**

---

# Занятие 3. Анимации

## Часть 4. `<Transition>` — появление и исчезновение

Сейчас тосты и модалка появляются и исчезают **мгновенно**. `<Transition>` добавляет плавность:

```vue
<Transition name="fade">
  <p v-if="show">Привет!</p>
</Transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

Как это работает: когда элемент внутри `<Transition>` появляется или исчезает (`v-if`, `v-show`), Vue **сам** добавляет и убирает CSS-классы в нужные моменты:

```
появление:  .fade-enter-from  ──►  (переход)  ──►  обычное состояние
            opacity: 0              .fade-enter-active   opacity: 1

исчезновение: обычное  ──►  (переход)  ──►  .fade-leave-to
              opacity: 1   .fade-leave-active  opacity: 0  → элемент удаляется
```

`name="fade"` — приставка для классов. Можно сделать `slide`, `pop` — что угодно.

### ⚠️ Внутри `<Transition>` — один элемент

`<Transition>` анимирует **один** элемент или компонент. Для списков — `<TransitionGroup>` (часть 5).

### ⚠️ Анимация и `RouterView`

Анимировать смену страниц можно так:

```vue
<RouterView v-slot="{ Component }">
  <Transition name="fade" mode="out-in">
    <component :is="Component" />
  </Transition>
</RouterView>
```

`v-slot` у `RouterView` даёт текущий компонент страницы (это «слот с параметрами», о котором говорилось на неделе 3). `mode="out-in"` — сначала исчезает старая страница, потом появляется новая.

---

## Часть 5. `<TransitionGroup>` — анимация списка

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="habit in habits" :key="habit.id">{{ habit.title }}</li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.list-move {
  transition: transform 0.3s ease;   /* остальные элементы плавно сдвигаются */
}
```

- `tag="ul"` — какой тег будет обёрткой (по умолчанию её нет);
- `.list-move` — класс для элементов, которые **сдвигаются**, когда соседа удалили или добавили.

### ⚠️⚠️ Обязательно `:key` — и не индекс!

Помнишь неделю 2, день 1: «индекс в `key` сломает анимации»? Вот здесь это и проявляется. С `:key="index"` при удалении первой привычки Vue решит, что исчезла **последняя**, и анимация пойдёт не там. С `:key="habit.id"` — всё правильно.

---

## 🛠 Практика, часть 3 (≈ 35 мин)

1. `<Transition>` для модалки подтверждения удаления.
2. `<TransitionGroup>` для списка привычек и для тостов.
3. Бонус: анимация смены страниц.

Коммит: «Трекер: анимации».

---

## Часть 6. 📜 Как это в Options API

`<Transition>` и `<TransitionGroup>` — часть **шаблона**: одинаковы в обоих стилях.

Ссылка на элемент — через `this.$refs`:

```vue
<script>
export default {
  methods: {
    focusTitle() {
      this.$refs.titleInput.focus()
    },
  },
}
</script>

<template>
  <input ref="titleInput">
</template>
```

`this.$refs.имя` — DOM-элемент с `ref="имя"`. Это очень частая конструкция в рабочем коде на Options API.

Композаблы VueUse (`onKeyStroke`, `useDark`) — через `setup()` (неделя 4, день 1).

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| VueUse | готовые композаблы: `useStorage`, `useWindowSize`, `useEventListener`, `onClickOutside`… |
| `onKeyStroke('n', fn)` | горячая клавиша с автоматической уборкой |
| В поле ввода | горячие клавиши не перехватывать |
| `ref="x"` + `useTemplateRef('x')` | доступ к DOM-элементу после `onMounted` |
| Тосты | стор со списком + один `ToastList` + `setTimeout` для исчезновения |
| `<Transition name="x">` | классы `x-enter-from`, `x-enter-active`, `x-leave-to`… |
| Внутри `Transition` | один элемент |
| `<TransitionGroup tag="ul">` | анимация списка; `.x-move` для сдвига |
| `:key` в анимации | только `id`, не индекс |
| `RouterView v-slot` | анимация смены страниц |
| 📜 Options API | `this.$refs.x`; анимации те же; VueUse — через `setup()` |

## 🛑 Конец занятия 3 — день 2 недели 8 пройден

Напиши наставнику «проверь неделю 8 день 2» и сделай заметку.
