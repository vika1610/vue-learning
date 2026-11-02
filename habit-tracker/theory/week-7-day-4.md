# Конспект · Неделя 7 · День 4 — Тесты компонентов: Vue Test Utils, моки и асинхронность

Чем тест компонента отличается от теста функции → установка Vue Test Utils и `jsdom` → `mount` → найти элемент и кликнуть → проверить событие `emitted` → моки `vi.fn` → подмена `fetch` → асинхронные тесты → компонент со стором → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: test-utils.vuejs.org (на английском), vitest.dev → «Mocking».

Шаги проекта — из [SPEC.md](../SPEC.md), неделя 7, день 4: тест `HabitItem` — клик → событие.

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Первый тест компонента** | часть 1 (что проверяем) → часть 2 (установка) → часть 3 (`mount`, `find`, `text`) → часть 4 (клик и событие) → практика | 60 мин |
| **2. Моки и асинхронность** | часть 5 (`vi.fn`) → часть 6 (подмена `fetch`) → часть 7 (`await`) → практика | 60 мин |
| **3. Компонент со стором + Options API** | часть 8 (стор в тесте) → практика → часть 9 (Options API) | 60 мин |

---

# Занятие 1. Первый тест компонента

## Часть 1. Что проверяет тест компонента

Тест функции: «дала аргументы → получила результат». Тест **компонента**: «дала **props** и **действия пользователя** → увидела **разметку** и **события**».

```
props ──►  компонент  ──► что показано (текст, классы, элементы)
клики ──►             ──► какие события отправлены наверх
```

Это ответ на вопрос недели «Что проверяет unit-тест компонента?»: что компонент показывает при данных props и что он сообщает родителю в ответ на действия пользователя.

⚠️ Тест проверяет **поведение**, а не **устройство**. Не «у компонента есть `ref` с именем `isEditing`», а «после клика на ✎ появилось поле ввода». Тогда тест не сломается, если ты переименуешь внутреннюю переменную.

---

## Часть 2. Установка

```bash
npm install -D @vue/test-utils jsdom
```

- `@vue/test-utils` — официальная библиотека для тестов Vue-компонентов;
- `jsdom` — «браузер внутри Node»: в тестах появятся `document`, кнопки и клики. Ты уже встречала его в неделе 0: строка `// @vitest-environment jsdom` в тестах дней 4 и 5.

Чтобы не писать эту строку в каждом файле, включи `jsdom` для всех тестов в `vite.config.js`:

```js
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
  },
})
```

---

## Часть 3. `mount`, `find`, `text`

Пример — компонент `StarBadge.vue`, показывающий звёзды:

```vue
<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <span class="badge">{{ '⭐'.repeat(count) }}</span>
</template>
```

Тест:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarBadge from './StarBadge.vue'

describe('StarBadge', () => {
  it('показывает столько звёзд, сколько передали', () => {
    const wrapper = mount(StarBadge, {
      props: { count: 3 },
    })
    expect(wrapper.text()).toBe('⭐⭐⭐')
  })
})
```

- `mount(Компонент, { props })` — «отрисовать» компонент в `jsdom` и вернуть **обёртку** (`wrapper`) для проверок;
- `wrapper.text()` — весь текст компонента, как `textContent`.

### Что умеет обёртка

| Метод | Что делает |
|---|---|
| `wrapper.text()` | текст |
| `wrapper.html()` | HTML-разметка строкой |
| `wrapper.find('button')` | первый элемент по CSS-селектору (как `querySelector`) |
| `wrapper.findAll('li')` | все элементы (как `querySelectorAll`) |
| `.exists()` | найден ли элемент |
| `.classes()` | массив классов элемента |
| `.attributes('href')` | значение атрибута |
| `wrapper.setProps({...})` | поменять props (асинхронно — нужен `await`) |

### ⚠️ Селекторы для тестов

```ts
wrapper.find('.btn-primary.big')   // ⚠️ поменяешь стиль — тест сломается
wrapper.find('[data-test="toggle"]') // ✓ специальный атрибут только для тестов
```

```vue
<input type="checkbox" data-test="toggle">
```

Атрибут `data-test` не влияет на внешний вид и показывает: «этот элемент используется в тестах — не удаляй».

---

## Часть 4. Клик и проверка события

Главное для `HabitItem`: «клик по галочке → событие `toggle`».

Пример с компонентом-кнопкой лайка:

```vue
<!-- LikeButton.vue -->
<script setup lang="ts">
const emit = defineEmits<{ like: [] }>()
</script>

<template>
  <button data-test="like" @click="emit('like')">❤️</button>
</template>
```

```ts
it('отправляет like по клику', async () => {
  const wrapper = mount(LikeButton)

  await wrapper.find('[data-test="like"]').trigger('click')

  expect(wrapper.emitted('like')).toHaveLength(1)
})
```

- `trigger('click')` — «кликнуть». Можно и другие события: `'change'`, `'input'`, `'submit'`;
- `await` — после клика Vue обновляет разметку **асинхронно**. `trigger` возвращает промис, который дожидается обновления;
- `wrapper.emitted('like')` — массив **всех** отправленных событий `like`. Каждый элемент — массив аргументов `emit`.

### Проверить данные события

```ts
expect(wrapper.emitted('remove')).toEqual([['abc-123']])
//                                          └ первый вызов с аргументом 'abc-123'
```

### ⚠️ Забытый `await`

```ts
wrapper.find('button').trigger('click')      // ⚠️ без await
expect(wrapper.text()).toContain('Сохранено') // разметка ещё не обновилась — красный
```

Событие `emitted` запишется сразу, но **разметка** обновится только после `await`. Правило: **`await` перед каждым `trigger` и `setProps`**.

---

## 🛠 Практика, часть 1 (≈ 25 мин)

1. Установи Test Utils и `jsdom`, настрой `environment`.
2. `HabitItem.test.ts`: показывает название привычки (передай тестовую привычку в props).
3. Клик по галочке → событие `toggle` (или вызов стора — если `HabitItem` у тебя работает со стором напрямую, отложи до занятия 3).

## 🛑 Конец занятия 1

Вопрос-повтор для следующего занятия: **зачем `await` перед `trigger('click')`?**

---

# Занятие 2. Моки и асинхронные тесты

## Часть 5. `vi.fn` — функция-шпион

**Мок** (mock, «подделка») — фальшивая замена чего-то настоящего, чтобы тест был изолированным и предсказуемым.

`vi.fn()` создаёт **функцию-шпиона**: она ничего не делает, но запоминает, **как** её вызывали:

```ts
import { vi } from 'vitest'

const onSave = vi.fn()

onSave('Зарядка', 3)
onSave('Чтение')

expect(onSave).toHaveBeenCalledTimes(2)
expect(onSave).toHaveBeenCalledWith('Зарядка', 3)
expect(onSave).toHaveBeenLastCalledWith('Чтение')
```

Можно указать, что шпион вернёт:

```ts
const getToday = vi.fn().mockReturnValue('2026-11-05')
getToday()   // '2026-11-05'
```

Где пригодится: передать шпиона компоненту вместо настоящего обработчика, подменить зависимость функции, проверить, что функцию вызвали.

---

## Часть 6. Подмена `fetch`

Тесты **не должны ходить в интернет**: интернет бывает медленным и недоступным, а данные на сервере меняются. Поэтому `fetch` подменяют.

Ты уже видела это в тестах дня 5 недели 0:

```ts
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () => Promise.resolve([{ id: 1, title: 'Пост' }]),
}))
```

- `vi.stubGlobal('fetch', ...)` — подменить глобальную функцию;
- `mockResolvedValue(x)` — шпион возвращает **промис** с `x`, как настоящий `fetch`;
- ответ — объект с полями, которые использует твой код: `ok`, `status`, `json()`.

После тестов — вернуть всё как было:

```ts
afterEach(() => {
  vi.unstubAllGlobals()
})
```

### Проверить ошибку

```ts
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
// или «нет сети»:
vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
```

Открой `week-00-js/day-5/solution.test.js` — там все три варианта: успех, ошибка сервера, нет сети. Теперь ты понимаешь каждую строку.

---

## Часть 7. Асинхронные тесты

Если в тесте есть `await`, функция теста — `async`:

```ts
it('показывает пользователей после загрузки', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Аня' }]),
  }))

  const wrapper = mount(UserList)
  expect(wrapper.text()).toContain('Загрузка…')

  await flushPromises()

  expect(wrapper.text()).toContain('Аня')
})
```

`flushPromises` из `@vue/test-utils` — «дождаться, пока выполнятся все промисы»: подделанный `fetch`, `json()` и обновление разметки.

```ts
import { mount, flushPromises } from '@vue/test-utils'
```

### ⚠️ Тест без `await` «проходит», но ничего не проверяет

```ts
it('загружает', () => {        // ⚠️ не async
  const wrapper = mount(UserList)
  wrapper.vm.load().then(() => {
    expect(wrapper.text()).toContain('Аня')   // выполнится ПОСЛЕ окончания теста
  })
})
```

Тест закончится раньше, чем выполнится `expect` внутри `then`, и будет зелёным, даже если проверка неверна. Всегда `async` + `await`.

---

## 🛠 Практика, часть 2 (≈ 35 мин)

Выбери одно (или оба):
1. Тест компонента, который загружает данные (например, страница из недели 5 или твой компонент с `useFetch`): «Загрузка…» → данные; и случай ошибки.
2. Тест `HabitForm`: ввод в поле (`await input.setValue('Зарядка')`) → отправка формы (`await form.trigger('submit')`) → событие `add` с правильными данными; пустое название — события нет.

`setValue` — как `v-model`: вводит значение в поле и вызывает нужное событие.

## 🛑 Конец занятия 2

Вопрос-повтор для следующего занятия: **зачем в тестах подменяют `fetch`?**

---

# Занятие 3. Компонент со стором и Options API

## Часть 8. Компонент, который использует стор

Если компонент вызывает `useHabitsStore()`, при `mount` ему нужна **Pinia**. Её передают через `global.plugins`:

```ts
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach } from 'vitest'

let pinia: Pinia

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
})

it('показывает привычки из стора', () => {
  const store = useHabitsStore()
  store.addHabit({ title: 'Зарядка', category: 'Здоровье' })

  const wrapper = mount(TodayPage, {
    global: { plugins: [pinia] },
  })

  expect(wrapper.text()).toContain('Зарядка')
})
```

### Проверить, что вызвано действие

```ts
it('клик вызывает toggleToday', async () => {
  const store = useHabitsStore()
  const spy = vi.spyOn(store, 'toggleToday')   // шпион на настоящую функцию

  const wrapper = mount(HabitItem, {
    props: { habit: testHabit },
    global: { plugins: [pinia] },
  })
  await wrapper.find('[data-test="toggle"]').trigger('click')

  expect(spy).toHaveBeenCalledWith(testHabit.id)
})
```

`vi.spyOn(объект, 'метод')` — шпион **поверх** настоящего метода: можно проверить вызов.

> Есть и специальный пакет `@pinia/testing` с `createTestingPinia()`: он автоматически превращает все действия в шпионов. Удобно в больших проектах; для трекера хватит обычной Pinia.

### Роутер в тестах

Если компонент использует `RouterLink` или `useRoute`, ему нужен роутер. Самое простое — подменить `RouterLink` заглушкой:

```ts
mount(HabitItem, {
  props: { habit: testHabit },
  global: {
    plugins: [pinia],
    stubs: { RouterLink: true },   // RouterLink превратится в пустую заглушку
  },
})
```

`stubs` — подменить дочерние компоненты «пустышками», чтобы тест проверял **только** этот компонент.

---

## 🛠 Практика, часть 3 (≈ 30 мин)

1. Тест `HabitItem` со стором: клик → `toggleToday` с правильным `id` (если компонент работает со стором). Если `HabitItem` отправляет событие — тест из занятия 1 уже готов; тогда протестируй страницу «Сегодня».
2. `npm run test:run` — всё зелёное.

Коммит: «Трекер: тесты компонентов».

---

## Часть 9. 📜 Тесты компонентов на Options API

`mount`, `find`, `trigger`, `emitted` — **одинаковы** для обоих стилей: тест смотрит на поведение снаружи, ему всё равно, как компонент написан внутри. Это ещё одна причина тестировать поведение, а не устройство.

Отличия — когда тест лезет «внутрь»:

```ts
// Options API: данные и методы доступны через wrapper.vm
wrapper.vm.isEditing           // поле data()
wrapper.vm.startEdit()         // метод

// <script setup>: по умолчанию «закрыт» — wrapper.vm видит меньше
```

⚠️ Заглядывать в `wrapper.vm` — признак теста на **устройство**, а не на поведение. Лучше кликнуть по кнопке и проверить разметку.

### `this.$route` в Options API-компоненте

Компоненту, который читает `this.$route`, в тесте можно подсунуть **поддельный** маршрут через `global.mocks`:

```ts
mount(HabitPageOptions, {
  global: {
    mocks: {
      $route: { params: { id: 'abc' } },
      $router: { push: vi.fn() },
    },
  },
})
```

Это частый приём в рабочих проектах на Options API. Для `<script setup>` с `useRoute()` так не получится: там подменяют модуль `vue-router` через `vi.mock` или используют настоящий роутер с `createMemoryHistory`.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| Тест компонента | props и действия → разметка и события |
| Проверять | поведение, а не внутреннее устройство |
| Установка | `@vue/test-utils`, `jsdom`; `test.environment: 'jsdom'` |
| `mount(C, { props })` | отрисовать в тесте |
| `find` / `findAll` / `text()` | найти / все / текст |
| `data-test="..."` | стабильные селекторы для тестов |
| `await trigger('click')` | действие пользователя; `await` обязателен |
| `await setValue('x')` | ввод в поле |
| `emitted('name')` | массив вызовов события с аргументами |
| `vi.fn()` | шпион: `toHaveBeenCalledWith(...)` |
| `vi.spyOn(obj, 'm')` | шпион поверх настоящего метода |
| `vi.stubGlobal('fetch', ...)` | подмена `fetch`; потом `unstubAllGlobals` |
| `flushPromises()` | дождаться промисов |
| Стор в тесте | `global: { plugins: [pinia] }` |
| `stubs: { RouterLink: true }` | заглушки дочерних компонентов |
| 📜 Options API | тесты те же; `wrapper.vm` видит `data` и методы; `global.mocks` для `$route` |

## 🛑 Конец занятия 3 — день 4 недели 7 пройден

Напиши наставнику «проверь неделю 7 день 4» и сделай заметку.
