# Конспект · Неделя 7 · День 1 — TypeScript: основы и Vue с `lang="ts"`

Зачем TypeScript → базовые типы → `interface` и `type` → подключить TypeScript к проекту → `<script setup lang="ts">` → типы `Habit` и `Category` → типизация props и emits → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: ru.vuejs.org → «Использование Vue с TypeScript»; typescriptlang.org → Handbook (на английском) или «TypeScript для начинающих» на любом русскоязычном ресурсе.

Шаги проекта — из [SPEC.md](../SPEC.md), неделя 7, день 1.

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Основы TypeScript** | часть 1 (зачем) → часть 2 (базовые типы) → часть 3 (`interface` и `type`) → упражнения в песочнице → 3 вопроса | 60 мин |
| **2. TypeScript в проекте** | часть 4 (подключение) → часть 5 (`lang="ts"`) → практика: типы `Habit` и `Category` | 60 мин |
| **3. Props, emits + Options API** | часть 6 (props и emits) → практика → часть 7 (Options API) | 60 мин |

---

# Занятие 1. Основы TypeScript

## Часть 1. Зачем TypeScript

Вспомни ошибки, которые ты ловила за курс:

| Ошибка | Когда заметила |
|---|---|
| передала `price="100"` вместо `:price="100"` — строка вместо числа | в консоли, предупреждение Vue |
| опечатка `book.titel` — пусто без ошибок | глазами, не сразу |
| `route.params.id === 42` — строка и число | долго искала, почему не находится |
| забыла `.value` у `ref` | при запуске |
| `find` вернул `undefined`, а код пошёл дальше | красная ошибка при запуске |

**TypeScript** (TS) — это JavaScript **с типами**. Ты пишешь, какого типа каждая переменная, параметр и поле, а редактор и компилятор проверяют это **до запуска**: подчёркивают ошибку красным прямо при наборе кода.

```ts
function formatPrice(price: number): string {
  return `${price.toFixed(2)} ₽`
}

formatPrice('100')   // ❌ подчёркнуто: Argument of type 'string' is not assignable to parameter of type 'number'
```

Плюсы:
- ошибки видны **сразу**, а не когда пользователь нажмёт кнопку;
- **подсказки** в редакторе: набираешь `habit.` — VS Code показывает все поля привычки;
- код **документирует сам себя**: по типам видно, что функция принимает и возвращает;
- безопасный **рефакторинг**: переименовала поле — TS покажет все места, где оно используется.

Это ответ на вопрос недели «Зачем TypeScript во Vue-проекте?».

### Важно знать

- браузер TypeScript **не понимает** — перед запуском типы просто **стираются**, и остаётся обычный JS. Это делает Vite;
- типы проверяются **только** при разработке (в редакторе и командой `vue-tsc`). Если данные с сервера придут не такими, как ты описала, TS этого не узнает;
- TS **постепенный**: можно переводить проект по одному файлу.

### Где попробовать

Песочница **typescriptlang.org/play**: пишешь слева, справа видишь ошибки и итоговый JS. Используй её для упражнений этого занятия.

---

## Часть 2. Базовые типы

### Аннотации

Тип пишется через двоеточие после имени:

```ts
let title: string = 'Зарядка'
let count: number = 3
let isDone: boolean = false
```

### Вывод типов

В большинстве случаев писать тип **не нужно** — TS выведет его сам:

```ts
let title = 'Зарядка'   // TS сам понял: string
title = 42              // ❌ Type 'number' is not assignable to type 'string'
```

Правило: **пиши типы у параметров функций и у сложных структур, а у простых переменных — пусть TS выводит сам.**

### Массивы

```ts
const dates: string[] = ['2026-11-04', '2026-11-05']
const counts: number[] = [1, 2, 3]
const dates2: Array<string> = []   // то же самое, другая запись
```

### Функции

```ts
function percent(done: number, total: number): number {
  return total === 0 ? 0 : (done / total) * 100
}

const isWeekend = (day: number): boolean => day === 0 || day === 6
```

Типы параметров и тип **возврата** (после скобок). Тип возврата TS тоже умеет выводить, но для публичных функций его полезно писать явно.

### Необязательные параметры и значения по умолчанию

```ts
function greet(name: string, greeting = 'Привет'): string {   // greeting: string — выведено
  return `${greeting}, ${name}!`
}

function log(message: string, level?: string) {   // ? — можно не передавать, тогда undefined
  console.log(level ?? 'info', message)
}
```

### `any` — «выключить проверку»

```ts
let data: any = 'что угодно'
data.foo.bar()   // TS молчит — и упадёт при запуске
```

`any` отключает проверку типов. Иногда без него никак (например, при постепенном переводе проекта), но **каждый `any` — дырка в защите**. Используй как можно реже. Если тип пока неизвестен — лучше `unknown` (с ним TS заставит проверить тип перед использованием).

---

## Часть 3. `interface` и `type` — описание объектов

### `interface`

```ts
interface Book {
  id: number
  title: string
  author: string
  year?: number          // необязательное поле
  readonly isbn: string  // нельзя менять после создания
}

const dune: Book = {
  id: 1,
  title: 'Дюна',
  author: 'Фрэнк Герберт',
  isbn: '978-5-17-100000-0',
}

dune.titel                 // ❌ Property 'titel' does not exist on type 'Book'. Did you mean 'title'?
dune.isbn = '...'          // ❌ Cannot assign to 'isbn' because it is a read-only property
```

Вот она, защита от `book.titel` из недели 1!

### `type`

```ts
type Book = {
  id: number
  title: string
}
```

Для объектов `type` и `interface` почти одинаковы. А вот **объединения** (union) можно сделать только через `type`:

```ts
type Status = 'new' | 'done' | 'archived'

let status: Status = 'done'
status = 'deleted'   // ❌ Type '"deleted"' is not assignable to type 'Status'
```

Тип-объединение из **строковых значений** — точный список допустимых вариантов. Подробнее — завтра.

### Что выбрать

Частая договорённость: **`interface` — для объектов** (моделей данных), **`type` — для объединений** и всего остального. Если на работе принято иначе — держись правил команды.

### Экспорт типов

```ts
// types/book.ts
export interface Book { /* ... */ }
export type Status = 'new' | 'done'
```

```ts
import type { Book, Status } from './types/book'
```

`import type` — импорт **только типа**: после стирания типов этой строки не останется.

---

### ✅ Проверь себя — занятие 1

Попробуй в песочнице typescriptlang.org/play:

1. Опиши `interface Movie` с полями `id` (число), `title` (строка), `rating` (число, необязательное).
2. Напиши функцию `getTitles(movies: Movie[]): string[]` и вызови её с массивом, где у одного фильма опечатка в поле. Что покажет TS?
3. Создай `type Size = 'S' | 'M' | 'L'` и попробуй присвоить переменной этого типа `'XL'`.

## 🛑 Конец занятия 1

5 минут на заметку: «зачем TS» своими словами.

Вопрос-повтор для следующего занятия: **чем `type` отличается от `interface` и что можно сделать только через `type`?**

---

# Занятие 2. TypeScript в проекте

## Часть 4. Подключить TypeScript к проекту

Проект трекера создан **без** TypeScript. Добавить его можно постепенно.

### Шаг 1. Пакеты

```bash
npm install -D typescript vue-tsc @vue/tsconfig
```

- `typescript` — сам компилятор;
- `vue-tsc` — проверка типов для `.vue`-файлов;
- `@vue/tsconfig` — готовые рекомендуемые настройки для Vue.

### Шаг 2. `tsconfig.json` в корне проекта

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "compilerOptions": {
    "allowJs": true
  }
}
```

`allowJs: true` — разрешить в проекте и `.js`, и `.ts` одновременно: можно переводить файлы по одному.

### Шаг 3. `env.d.ts` в корне проекта

```ts
/// <reference types="vite/client" />
```

Эта строка объясняет TypeScript особые возможности Vite (например, импорт `.css`).

### Шаг 4. Команда проверки в `package.json`

```json
"scripts": {
  "type-check": "vue-tsc --noEmit"
}
```

```bash
npm run type-check
```

Проверит **весь** проект и покажет все ошибки типов. ⚠️ Vite при `npm run dev` типы **не проверяет** — он их просто стирает. Ошибки видны в редакторе и по `type-check`.

> Если на каком-то шаге посыплются непонятные ошибки — не трать на это час. Пришли наставнику текст ошибки. Настройка — самая скучная часть TS, а не самая важная.

### Альтернатива

Создать **новый** проект `npm create vue@latest` **с** TypeScript и перенести в него свой код. Иногда это проще, а заодно видно, как create-vue настраивает TS «по умолчанию». Выбери сама.

---

## Часть 5. `<script setup lang="ts">`

Чтобы в компоненте включить TypeScript, достаточно добавить `lang="ts"`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const title = ref('')              // Ref<string> — выведено
const count = ref(0)               // Ref<number>
const doubled = computed(() => count.value * 2)   // ComputedRef<number>

count.value = 'много'              // ❌ Type 'string' is not assignable to type 'number'
</script>
```

Во многих случаях менять больше ничего не нужно: TS сам выведет типы `ref` и `computed`. А `.js`-файлы переименуй в `.ts` по одному (`utils/date.js` → `utils/date.ts`) и добавь типы параметрам.

⚠️ В импортах из `.ts`-файлов расширение обычно **не пишут**: `import { todayKey } from '../utils/date'`. Vite и TS найдут файл сами.

---

## 🛠 Практика: типы `Habit` и `Category` (≈ 30 мин)

1. Подключи TypeScript (часть 4).
2. Создай `src/types/habit.ts`:
   - `type Category` — объединение твоих категорий (или `string`, если категории свободные — подумай, что лучше для твоего проекта);
   - `interface Habit` — по модели данных из SPEC: `id`, `title`, `category`, `doneDates`, `createdAt`.
3. Переведи `utils/date.js` → `utils/date.ts` с типами параметров и возврата.
4. Запусти `npm run type-check`.

Коммит: «Трекер: TypeScript, типы Habit и Category».

## 🛑 Конец занятия 2

Вопрос-повтор для следующего занятия: **проверяет ли Vite типы при `npm run dev`? Как проверить весь проект?**

---

# Занятие 3. Типизация props и emits

## Часть 6. Props и emits с типами

### `defineProps` с типом

Вместо объекта с `type: String` — **дженерик-аргумент** с TypeScript-типом:

```vue
<script setup lang="ts">
import type { Habit } from '../types/habit'

const props = defineProps<{
  habit: Habit
  compact?: boolean        // необязательный
}>()
</script>
```

Это то же самое, что `defineProps({ habit: { type: Object, required: true }, compact: Boolean })`, но:
- тип `Habit` описывает **все поля** — `props.habit.titel` будет подчёркнуто;
- `?` — вместо `required: false`;
- в родителе `<HabitItem :habit="42" />` тоже будет ошибкой.

### Значения по умолчанию

В **Vue 3.5** — через деструктуризацию (день 2 недели 3):

```ts
const { habit, compact = false } = defineProps<{
  habit: Habit
  compact?: boolean
}>()
```

В более старом коде встретишь `withDefaults`:

```ts
const props = withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false,
})
```

### `defineEmits` с типом

```ts
const emit = defineEmits<{
  toggle: []                        // событие без данных
  remove: [id: string]              // с одним аргументом
  update: [id: string, changes: Partial<Habit>]
}>()

emit('remove', habit.id)   // ✓
emit('remove')             // ❌ Expected 2 arguments
emit('delete', habit.id)   // ❌ такого события нет
```

`Partial<Habit>` — встроенный тип «все поля `Habit`, но необязательные». Удобно для «изменений». Завтра будут ещё такие помощники.

### `defineModel` с типом

```ts
const model = defineModel<string>({ default: '' })
```

---

## 🛠 Практика (≈ 30 мин)

1. Переведи `HabitItem`, `HabitList`, `HabitForm` на `lang="ts"`.
2. Типизируй props через `defineProps<{...}>()` и события через `defineEmits<{...}>()`.
3. Специально передай неправильный prop в родителе — увидь ошибку. Потом исправь.
4. `npm run type-check` — без ошибок.

Коммит: «Трекер: типизированы props и emits».

---

## Часть 7. 📜 TypeScript в Options API

В Options API TypeScript тоже работает, но компонент оборачивают в **`defineComponent`** — так TS понимает, что внутри `this`:

```vue
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Habit } from '../types/habit'

export default defineComponent({
  props: {
    habit: { type: Object as PropType<Habit>, required: true },
    compact: { type: Boolean, default: false },
  },
  emits: {
    remove: (id: string) => true,   // тип аргумента события
  },
  data() {
    return { isEditing: false }
  },
  computed: {
    title(): string {               // ⚠️ тип возврата у computed — желательно явно
      return this.habit.title
    },
  },
  methods: {
    onRemove() {
      this.$emit('remove', this.habit.id)
    },
  },
})
</script>
```

Что заметно:
- **`defineComponent({...})`** вместо простого `{...}` — помогает TS вывести типы `this`. В рабочем проекте на TS ты увидишь его почти в каждом Options API-компоненте (это тот самый вариант из таблицы дня 1 недели 1);
- **`Object as PropType<Habit>`** — так сложный тип передают в `type` prop'а;
- **`emits` объектом**: ключ — имя события, значение — функция-«проверка» с типами аргументов;
- у `computed` в Options API TS иногда не может вывести тип сам — пишут `title(): string`.

В Composition API с `<script setup lang="ts">` всё это заметно короче — одна из причин, почему TS-проекты обычно переходят на Composition API.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| TypeScript | JS + типы; проверка до запуска; в браузере типы стёрты |
| `let x: number` | аннотация; часто TS выводит тип сам |
| `string[]` / `Array<string>` | массив |
| `(a: number): string` | типы параметров и возврата |
| `?` | необязательный параметр или поле |
| `any` | выключает проверку — избегать |
| `interface Habit { ... }` | описание объекта |
| `type S = 'a' \| 'b'` | объединение — только через `type` |
| `import type { X }` | импорт только типа |
| Подключение | `typescript`, `vue-tsc`, `@vue/tsconfig`, `tsconfig.json`, `env.d.ts` |
| Проверка | `vue-tsc --noEmit`; Vite типы не проверяет |
| `<script setup lang="ts">` | TS в компоненте |
| `defineProps<{ habit: Habit }>()` | типизированные props |
| `defineEmits<{ remove: [id: string] }>()` | типизированные события |
| `Partial<T>` | все поля необязательные |
| 📜 Options API | `defineComponent`, `Object as PropType<T>`, `emits` объектом, тип возврата у `computed` |

## 🛑 Конец занятия 3 — день 1 недели 7 пройден

Напиши наставнику «проверь неделю 7 день 1» и сделай заметку.
