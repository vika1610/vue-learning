# Конспект · Неделя 7 · День 2 — TypeScript: объединения, дженерики и типизация композаблов и стора

Объединения и сужение типа → `null`, `undefined` и `?.` → дженерики → вспомогательные типы → типизация `ref` и `computed` → дженерик-композабл `useLocalStorage<T>` → стор на TypeScript → Options API.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Шаги проекта — из [SPEC.md](../SPEC.md), неделя 7, день 2: перевести композаблы и стор на TypeScript.

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Объединения и сужение** | часть 1 (объединения) → часть 2 (сужение) → часть 3 (`null` и `?.`) → упражнения | 60 мин |
| **2. Дженерики** | часть 4 (дженерики) → часть 5 (вспомогательные типы) → часть 6 (`ref` и `computed`) → упражнения | 60 мин |
| **3. Проект на TS + Options API** | часть 7 (`useLocalStorage<T>`) → часть 8 (стор) → практика → часть 9 (Options API) | 60 мин |

---

# Занятие 1. Объединения и сужение типа

## Часть 1. Объединения (union)

**Объединение** — «одно из нескольких»:

```ts
type Id = string | number

let id: Id = 42
id = 'abc'      // ✓
id = true       // ❌
```

Особенно полезны объединения **конкретных значений**:

```ts
type Theme = 'light' | 'dark'
type LoadState = 'idle' | 'loading' | 'success' | 'error'

function setTheme(theme: Theme) { /* ... */ }

setTheme('dark')    // ✓
setTheme('Dark')    // ❌ опечатка с большой буквы — TS поймает
```

Это лучше, чем просто `string`: TS знает **все** допустимые варианты, подсказывает их в редакторе и ловит опечатки.

---

## Часть 2. Сужение типа

Если переменная — объединение, TS не даст использовать то, что есть не у всех вариантов:

```ts
function show(id: string | number) {
  id.toUpperCase()   // ❌ у number нет toUpperCase
}
```

Нужно **сузить** тип — проверкой, после которой TS понимает, какой вариант остался:

```ts
function show(id: string | number) {
  if (typeof id === 'string') {
    return id.toUpperCase()     // ✓ здесь id: string
  }
  return id.toFixed(0)          // ✓ здесь id: number
}
```

Способы сужения — это обычные проверки JavaScript:

| Проверка | Сужает |
|---|---|
| `typeof x === 'string'` | примитивы (помнишь `describeType` из недели 0?) |
| `x === 'done'` | объединение значений |
| `Array.isArray(x)` | массив |
| `if (x)` | убирает `null`, `undefined`, `''`, `0` (falsy, неделя 2) |
| `'title' in x` | есть ли поле у объекта |

TS **понимает** код: после `if` с `return` он знает, что ниже первого варианта уже нет.

---

## Часть 3. `null`, `undefined` и `?.`

### `find` может не найти

```ts
const habit = habits.find((h) => h.id === id)   // тип: Habit | undefined
habit.title                                      // ❌ 'habit' is possibly 'undefined'
```

Это та самая ошибка «Cannot read properties of undefined», которую ты ловила при запуске. Теперь TS заметит её **заранее** и заставит обработать.

### Способы обработать

```ts
// 1. Ранний выход
if (!habit) return
habit.title          // ✓ здесь habit: Habit

// 2. Опциональная цепочка ?. — «если есть, то…»
habit?.title         // string | undefined — не упадёт

// 3. ?? — значение по умолчанию (уже знакома с недели 0)
habit?.title ?? 'Без названия'   // string
```

### ⚠️ `!` — «поверь мне, тут не undefined»

```ts
const habit = habits.find((h) => h.id === id)!
habit.title   // TS молчит
```

Восклицательный знак после выражения говорит TS: «я уверена, значение есть». TS перестаёт проверять. Если ты ошиблась — снова упадёт при запуске. Используй `!` только когда **точно** знаешь, а лучше — сделай проверку `if`.

### ⚠️ `as` — приведение типа

```ts
const data = JSON.parse(text) as Habit[]
```

`as` говорит «считай, что это `Habit[]`». TS **не проверяет**, правда ли это. Для данных из внешнего мира (`JSON.parse`, `fetch`) иногда без `as` не обойтись, но помни: это обещание, а не проверка.

---

### ✅ Проверь себя — занятие 1

В песочнице typescriptlang.org/play:

1. Напиши `function label(state: 'idle' | 'loading' | 'error'): string`, которая для каждого состояния возвращает русский текст. Что будет, если вызвать `label('done')`?
2. Есть `const user: { name: string } | undefined`. Напиши три способа безопасно получить имя.
3. Чем `habit!.title` опаснее, чем `habit?.title`?

## 🛑 Конец занятия 1

Вопрос-повтор для следующего занятия: **что такое «сужение типа» и какими проверками его делают?**

---

# Занятие 2. Дженерики

## Часть 4. Дженерики — типы-параметры

### Проблема

```ts
function first(arr: number[]): number | undefined {
  return arr[0]
}
```

Работает только для чисел. Для строк — писать ещё одну функцию? Для `Habit[]` — третью? А если написать `any[]`, потеряем тип результата.

### Решение: тип как параметр

```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

first([1, 2, 3])            // T = number → number | undefined
first(['a', 'b'])           // T = string → string | undefined
first(habits)               // T = Habit  → Habit | undefined
```

`<T>` — **типовой параметр**: «какой-то тип, назовём его `T`». TS сам подставит `T` по аргументу. Как обычный параметр функции, только для типа.

Это **дженерик** (generic, «обобщённый»). Ты уже пользовалась ими, не зная названия:

```ts
Array<string>          // массив строк
ref<number>(0)         // ref с числом
defineProps<{...}>()   // props с типом
Partial<Habit>         // все поля Habit необязательные
```

Угловые скобки `<...>` — всегда признак дженерика: «передаю тип».

---

## Часть 5. Вспомогательные типы

TypeScript умеет **строить новые типы из существующих**. Самые полезные:

```ts
interface Habit {
  id: string
  title: string
  category: string
  doneDates: string[]
  createdAt: string
}
```

| Тип | Что получится | Где пригодится |
|---|---|---|
| `Partial<Habit>` | все поля необязательные | изменения при редактировании |
| `Pick<Habit, 'title' \| 'category'>` | только эти поля | данные из формы |
| `Omit<Habit, 'id' \| 'doneDates' \| 'createdAt'>` | все, **кроме** этих | то же — данные из формы |
| `Record<string, number>` | объект «строка → число» | подсчёт по категориям `{ Здоровье: 3 }` |
| `Readonly<Habit>` | все поля только для чтения | данные, которые нельзя менять |

```ts
type HabitInput = Pick<Habit, 'title' | 'category'>

function addHabit(input: HabitInput): Habit {
  return {
    ...input,
    id: crypto.randomUUID(),
    doneDates: [],
    createdAt: todayKey(),
  }
}
```

Удобство: если в `Habit` поменяется тип `title`, `HabitInput` изменится **сам**.

---

## Часть 6. Типизация `ref` и `computed`

### Обычно — вывод типа

```ts
const count = ref(0)              // Ref<number>
const title = ref('')             // Ref<string>
const total = computed(() => count.value * 2)   // ComputedRef<number>
```

### Когда нужен явный тип

Когда **начальное** значение не говорит всего:

```ts
const habits = ref([])                    // ⚠️ Ref<never[]> — массив «ничего»
const habits = ref<Habit[]>([])           // ✓ массив привычек

const error = ref(null)                   // ⚠️ Ref<null> — навсегда null
const error = ref<string | null>(null)    // ✓ строка или null

const selected = ref<Habit>()             // Ref<Habit | undefined>
```

Правило: **пустой массив и `null` в начале — пиши тип явно.**

### `computed` с типом

```ts
const doneToday = computed<number>(() => habits.value.filter(/* ... */).length)
```

Обычно не нужно: TS выведет из того, что возвращает функция.

---

### ✅ Проверь себя — занятие 2

1. Напиши дженерик `function last<T>(arr: T[]): T | undefined`.
2. Почему `ref([])` без типа — плохая идея?
3. Как из `Habit` получить тип «только `title` и `category`»?

## 🛑 Конец занятия 2

Вопрос-повтор для следующего занятия: **что такое `<T>` в `function first<T>(arr: T[])`?**

---

# Занятие 3. Проект на TypeScript

## Часть 7. Дженерик-композабл `useLocalStorage<T>`

`useLocalStorage` работает с **любыми** данными: строкой темы, массивом привычек. Значит, это дженерик:

```ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // ... тот же код, что был
}
```

```ts
const theme = useLocalStorage('theme', 'light')            // Ref<string>
const habits = useLocalStorage<Habit[]>('habits', [])       // Ref<Habit[]>
```

- `T` выводится из `defaultValue`;
- для пустого массива укажи `T` явно — та же ловушка, что `ref([])`.

### ⚠️ `JSON.parse` возвращает `any`

```ts
const saved = JSON.parse(text)   // any — TS ничего не знает
```

Внутри композабла это место, где придётся «пообещать» тип через `as T` или вернуть `unknown` и проверить. Для учебного проекта `as T` — нормально, но помни, что это обещание (часть 3).

Твоя `parseJSONSafe` тоже станет дженериком: `parseJSONSafe<T>(text: string | null, fallback: T): T`.

---

## Часть 8. Стор на TypeScript

### setup-стор

Отличная новость: setup-стор почти **не нужно** типизировать отдельно — TS выведет всё сам, если типизированы `ref`:

```ts
export const useHabitsStore = defineStore('habits', () => {
  const habits = useLocalStorage<Habit[]>('habit-tracker:habits', [])

  const categories = computed(() => [...new Set(habits.value.map((h) => h.category))])   // string[]

  function addHabit(input: HabitInput) { /* ... */ }
  function toggleToday(id: string) { /* ... */ }

  return { habits, categories, addHabit, toggleToday }
})
```

Типизируй: начальный `ref`, параметры функций. Остальное TS выведет. В компоненте `store.addHabit(42)` будет подчёркнуто.

### Подсчёт по категориям

```ts
const countByCategory = computed(() =>
  habits.value.reduce<Record<string, number>>((acc, h) => {
    acc[h.category] = (acc[h.category] ?? 0) + 1
    return acc
  }, {}),
)
```

`reduce<Record<string, number>>` — дженерик у `reduce`: «аккумулятор — объект строка → число». Без него TS решит, что `{}` — пустой объект без полей, и не даст писать `acc[h.category]`.

---

## 🛠 Практика (≈ 35 мин)

1. `useLocalStorage.js` → `.ts`, дженерик `<T>`.
2. `parseJSONSafe` — дженерик.
3. `stores/habits.js` → `.ts`; типы `HabitInput`, параметры действий.
4. `utils/streak.js` → `.ts`.
5. `npm run type-check` — без ошибок. Если ошибок много — исправляй по одной, начиная с первой.

Коммит: «Трекер: композаблы и стор на TypeScript».

---

## Часть 9. 📜 TypeScript в Options API

### Options-стор

```ts
interface State {
  habits: Habit[]
  selected: string | null
}

export const useHabitsStore = defineStore('habits', {
  state: (): State => ({
    habits: [],
    selected: null,
  }),
  getters: {
    total: (state) => state.habits.length,
    selectedHabit(): Habit | undefined {          // ⚠️ тип возврата явно, т.к. this
      return this.habits.find((h) => h.id === this.selected)
    },
  },
  actions: {
    add(input: HabitInput) {
      this.habits.push({ ...input, id: crypto.randomUUID(), doneDates: [], createdAt: todayKey() })
    },
  },
})
```

- `state: (): State => ({...})` — тип возврата функции `state`, иначе `[]` и `null` станут «пустыми» типами (часть 6);
- геттер, использующий `this`, требует **явный тип возврата** — как `computed` в Options API.

### Компонент на Options API

```ts
export default defineComponent({
  data() {
    return {
      error: null as string | null,   // ⚠️ приведение прямо в data
      items: [] as Habit[],
    }
  },
})
```

В `data()` Options API нет места для дженерика, поэтому начальное значение «уточняют» через `as`. Это частый приём в рабочих TS-проектах на Options API.

`mapState` и `mapActions` с типизированным стором выводят типы сами.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| `'a' \| 'b'` | объединение значений: TS знает все варианты |
| Сужение | `typeof`, `===`, `Array.isArray`, `if (x)`, `in` |
| `find` | возвращает `T \| undefined` — обработай |
| `?.` | безопасный доступ: если нет — `undefined` |
| `!` | «поверь мне» — опасно |
| `as T` | обещание без проверки |
| `<T>` | дженерик: тип-параметр |
| `Partial`, `Pick`, `Omit` | все необязательные / только эти / все кроме |
| `Record<K, V>` | объект «ключ → значение» |
| `ref<Habit[]>([])` | явный тип для пустого массива |
| `ref<string \| null>(null)` | явный тип для `null` |
| `useLocalStorage<T>` | дженерик-композабл |
| setup-стор | типизируй `ref` и параметры, остальное выведется |
| `reduce<Record<string, number>>` | тип аккумулятора |
| 📜 Options API | `state: (): State =>`; тип возврата у геттеров с `this`; `null as string \| null` в `data` |

## 🛑 Конец занятия 3 — день 2 недели 7 пройден

Напиши наставнику «проверь неделю 7 день 2» и сделай заметку.
