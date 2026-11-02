# Конспект · Неделя 6 · День 3 — Корзина: асинхронные действия, `$subscribe` и сохранение

JS-разминка (асинхронные функции, JSON + `localStorage`) → логика корзины → один стор использует другой → `$subscribe` → восстановление после перезагрузки → плагины Pinia → Options API → итоги недели.

> ⚠️ Отмечены **подводные камни** — места, где чаще всего ошибаются.

Официальная документация: pinia.vuejs.org → «Actions», «State» (раздел «Subscribing to the state»), «Plugins».

## 📅 План: 3 занятия по ~1 часу

| Занятие | Что делаем | ≈ Время |
|---|---|---|
| **1. Логика корзины** | разминка → часть 1 (модель) → часть 2 (действия и геттеры) → часть 3 (стор в сторе) → 3 вопроса | 60 мин |
| **2. Сохранение + практика** | повтор → часть 4 (`$subscribe`) → часть 5 (восстановление) → часть 6 (плагины) → задача «Корзина» | 60 мин |
| **3. Options API + итоги недели** | часть 7 → бонус → вопросы недели | 60 мин |

---

# Занятие 1. Логика корзины

## Разминка (10 мин): асинхронность и JSON + `localStorage`

```js
async function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const result = save('cart', [{ id: 1, qty: 2 }])
console.log(result)                                   // 1
console.log(JSON.parse(localStorage.getItem('cart'))) // 2
```

<details>
<summary>Ответ</summary>

1. `Promise {<fulfilled>: undefined}` — `async`-функция **всегда** возвращает промис (неделя 0, день 5), даже если внутри нет ни одного `await`.
2. `[{ id: 1, qty: 2 }]` — `setItem` синхронный, поэтому данные уже записаны.

Вывод: `localStorage` работает **синхронно**, `async` для него не нужен. А вот загрузка товаров с сервера — асинхронная, и её действие должно быть `async`.

</details>

---

## Часть 1. Модель корзины

Что хранить в корзине? Не весь товар целиком, а «позицию»:

```js
{
  productId: 5,
  title: 'Рюкзак',
  price: 2500,
  quantity: 2,
}
```

Почему не весь объект товара с картинкой, описанием, рейтингом:
- корзину будем сохранять в `localStorage` — меньше данных, меньше места;
- если товар потом подешевеет в каталоге, в корзине останется цена на момент добавления. (В настоящих магазинах это отдельный вопрос, но для учебного проекта так проще.)

`quantity` — главное новое поле. Из-за него «добавить в корзину» — это не просто `push`.

---

## Часть 2. Действия и геттеры корзины

### «Добавить»: есть ли уже?

Логика из подсказки к задаче:

```
есть ли позиция с этим productId?
├── да  → увеличить quantity
└── нет → добавить новую позицию с quantity: 1
```

Найти позицию — `find` (он возвращает **сам объект**, поэтому увеличение `quantity` изменит позицию прямо в массиве: ссылки, день 2 недели 0).

### «Уменьшить»: а если станет 0?

```
quantity > 1 → уменьшить
quantity = 1 → удалить позицию целиком
```

Иначе в корзине появится «0 × Рюкзак». Подумай, удобно ли здесь переиспользовать действие «удалить».

### Геттеры

| Геттер | Как посчитать |
|---|---|
| общее количество товаров | `reduce` по `quantity` |
| общая сумма | `reduce` по `price * quantity` |
| пуста ли корзина | `items.length === 0` |

Сумма через `reduce` — разминка вчерашнего дня. ⚠️ Начальное значение `0`! И помни про копейки (`89.91000000000001`, неделя 0, день 4): округлять — при выводе, а не в геттере.

---

## Часть 3. Один стор использует другой

Корзине иногда нужны данные каталога: например, проверить, что товар вообще существует. Сторы могут использовать друг друга:

```js
// stores/cart.js — setup-стор
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsStore } from './products.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function addById(productId) {
    const products = useProductsStore()      // ← вызвать ВНУТРИ функции
    const product = products.items.find((p) => p.id === productId)
    if (!product) return
    // ... добавить в корзину
  }

  return { items, addById }
})
```

⚠️ Вызывай `useProductsStore()` **внутри** действия или геттера, а не на верхнем уровне файла: тогда Pinia уже точно подключена (вчерашняя ловушка).

В задаче дня проще: кнопка «В корзину» на карточке передаёт **весь товар** в `addToCart(product)`, и корзине не нужен каталог. Но знать, что сторы могут общаться, полезно — в проекте трекера это пригодится.

---

### ✅ Проверь себя — занятие 1

1. Почему «добавить в корзину» — это не просто `push`?
2. Что должно произойти, если уменьшить количество позиции, у которой `quantity` равно 1?
3. Где вызывать один стор внутри другого и почему?

---

## 🛑 Конец занятия 1

5 минут на заметку: схема «добавить: есть — увеличить, нет — создать».

Вопрос-повтор для следующего занятия: **почему сумму корзины считаем геттером, а не храним в state?**

---

# Занятие 2. Сохранение после перезагрузки

## Часть 4. `$subscribe` — подписка на изменения стора

```js
const cart = useCartStore()

cart.$subscribe((mutation, state) => {
  console.log('корзина изменилась', state.items)
})
```

`$subscribe` вызывает функцию **каждый раз**, когда меняется state стора:
- `state` — текущее состояние стора;
- `mutation` — информация о том, **что** изменилось (обычно не нужна).

Похоже на `watch` (день 4 недели 2) — и это действительно его «родственник». Только следит сразу за **всем** state стора, глубоко.

### Сохранить в `localStorage`

```js
cart.$subscribe((mutation, state) => {
  localStorage.setItem('shop:cart', JSON.stringify(state.items))
})
```

### Где вызвать `$subscribe`

**Вариант 1 — в компоненте** (как в подсказке к задаче):

```js
// Exercise.vue или главный компонент
const cart = useCartStore()
cart.$subscribe((mutation, state) => { /* сохранить */ })
```

⚠️ Подписка, сделанная в компоненте, по умолчанию **снимается**, когда компонент удаляется (как `watch`). Если компонент, который подписался, уйдёт со страницы — сохранение прекратится. Для корня приложения это не проблема, а для страницы — проблема. Чтобы подписка жила дальше, есть опция `{ detached: true }`.

**Вариант 2 — внутри setup-стора, через `watch`:**

```js
export const useCartStore = defineStore('cart', () => {
  const items = ref(/* восстановить */)

  watch(items, (value) => {
    localStorage.setItem('shop:cart', JSON.stringify(value))
  }, { deep: true })

  // ...
})
```

Плюс: стор сам заботится о своём сохранении, компонентам не нужно об этом помнить. Это тот же приём, что в твоём `useLocalStorage`. Кстати, его можно использовать **прямо внутри** setup-стора:

```js
const items = useLocalStorage('shop:cart', [])
```

Попробуй оба способа и выбери понятный тебе.

---

## Часть 5. Восстановление при запуске

Сохранять мало — нужно и **читать** при создании стора. Начальное значение state берём из `localStorage`:

```js
// setup-стор
const items = ref(parseJSONSafe(localStorage.getItem('shop:cart'), []))
```

```js
// options-стор
state: () => ({
  items: parseJSONSafe(localStorage.getItem('shop:cart'), []),
}),
```

`parseJSONSafe` — твоя функция из недели 0. Она защищает от испорченных данных (день 2 недели 4).

### Проверь

1. Добавь товары в корзину.
2. DevTools → Application → Local Storage: появилась строка `shop:cart`?
3. Перезагрузи страницу — корзина на месте?
4. Испорти значение вручную (например, `{abc`) и перезагрузи — страница не упала, корзина пустая?

---

## Часть 6. Плагины Pinia (обзор)

**Плагин** Pinia — функция, которая добавляет что-то **всем** сторам сразу. Например, сохранение в `localStorage` для каждого стора, где это включено.

Есть готовый популярный плагин `pinia-plugin-persistedstate`:

```js
// main.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```js
// в сторе
defineStore('cart', () => { /* ... */ }, { persist: true })
```

И всё: стор сохраняется и восстанавливается сам. Сегодня делай **вручную** — чтобы понимать, что внутри. А в своём проекте можно попробовать плагин. Если увидишь `persist: true` в рабочем коде — теперь знаешь, что это.

---

## 🛠 Практика: «Корзина» (≈ 40 мин)

Открой `Exercise.vue` и `setup.js` рядом с этим файлом. Условие — в `Exercise.vue`, подсказки — в `hints.md`.

| Этап | Что сделать |
|---|---|
| 1 | скопируй магазин из `week6/day2` |
| 2 | стор `cart` с `items` и действиями добавить / уменьшить / удалить / очистить |
| 3 | геттеры: количество и сумма |
| 4 | кнопка «В корзину» на карточке, блок корзины, «Корзина пуста» |
| 5 | сохранение (`$subscribe` или `watch`) и восстановление |
| 6 | проверь по списку из части 5 |

## 🛑 Конец занятия 2

Напиши наставнику «проверь неделю 6 день 3» и сделай заметку.

Вопрос-повтор для следующего занятия: **почему подписка `$subscribe` в компоненте может перестать работать?**

---

# Занятие 3. 📜 Options API и итоги недели

## Часть 7. 📜 Корзина в Options API

### Options-стор корзины

```js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: parseJSONSafe(localStorage.getItem('shop:cart'), []),
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  },
  actions: {
    add(product) {
      const existing = this.items.find((i) => i.productId === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ productId: product.id, title: product.title, price: product.price, quantity: 1 })
      }
    },
    remove(productId) {
      this.items = this.items.filter((i) => i.productId !== productId)
    },
  },
})
```

### `$subscribe` в компоненте на Options API

```js
import { mapStores } from 'pinia'
import { useCartStore } from '../stores/cart.js'

export default {
  computed: {
    ...mapStores(useCartStore),   // → this.cartStore
  },
  created() {
    this.cartStore.$subscribe((mutation, state) => {
      localStorage.setItem('shop:cart', JSON.stringify(state.items))
    })
  },
}
```

`mapStores` даёт **весь стор** под именем `id + 'Store'`: для стора с id `'cart'` — `this.cartStore`. Удобно, когда нужен сам стор, а не отдельные поля: для `$subscribe`, `$patch`, `$reset`.

### Кнопка «В корзину» в карточке

```js
import { mapActions } from 'pinia'
import { useCartStore } from '../stores/cart.js'

export default {
  props: { product: { type: Object, required: true } },
  methods: {
    ...mapActions(useCartStore, { addToCart: 'add' }),   // переименовать: this.addToCart
  },
}
```

```vue
<button @click="addToCart(product)">В корзину</button>
```

`mapActions` с объектом позволяет **переименовать** действие для компонента: в сторе `add`, в компоненте — понятное `addToCart`.

---

## 🛠 Бонус-практика (≈ 20 мин)

Переделай стор корзины в **options-стиль** (если делала setup-стор) или в **setup-стиль** (если делала options). Компоненты при этом менять не нужно — проверь, что всё работает так же. Это лучшее доказательство, что два стиля стора равноправны.

---

## 🏁 Проверь себя в конце недели 6 (из плана)

Ответь своими словами, без конспектов:

1. Когда данные стоит хранить в Pinia, а когда — в компоненте?
2. Почему нельзя просто деструктурировать стор?
3. Чем getter отличается от action?

Пришли ответы наставнику. Дальше — два дня проекта: стор привычек.

---

## Шпаргалка

| Тема | Запомнить |
|---|---|
| Позиция корзины | `{ productId, title, price, quantity }` |
| Добавить | `find`: есть — `quantity++`, нет — `push` с `quantity: 1` |
| Уменьшить до 0 | удалить позицию |
| Сумма | геттер с `reduce`, начальное `0`; округлять при выводе |
| Стор в сторе | `useOtherStore()` внутри действия или геттера |
| `store.$subscribe((m, state) => ...)` | при любом изменении state |
| В компоненте | снимается при удалении компонента; `{ detached: true }` |
| В setup-сторе | `watch(..., { deep: true })` или `useLocalStorage` |
| Восстановить | начальное значение state из `localStorage` через `parseJSONSafe` |
| Плагин | `pinia-plugin-persistedstate`, `persist: true` |
| 📜 Options API | `mapStores` → `this.cartStore`; `$subscribe` в `created`; `mapActions` с переименованием |

## 🛑 Конец занятия 3 — день 3 недели 6 пройден

Напиши наставнику «проверь неделю 6 день 3 Options API» и пришли ответы на вопросы недели.
