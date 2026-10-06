# Неделя 0 · День 3 — Деструктуризация, spread/rest, методы массивов

**Теория (20 мин):** деструктуризация, spread/rest; методы массивов `map`, `filter`, `find`, `some`, `reduce`, `sort`.
Читать: learn.javascript.ru → «Деструктурирующее присваивание», «Остаточные параметры и оператор расширения», «Методы массивов».

**Практика (35 мин):** решай задачи в `solution.js`, проверяй командой:

```bash
npm run test:day3
```

---

## Главная задача 1 (из плана): `mergeSettings(defaults, user)`

Объедини настройки по умолчанию и пользовательские. Пользовательские важнее.
**Исходные объекты менять нельзя!**

```js
const defaults = { theme: 'light', lang: 'ru', fontSize: 14 }
const user = { theme: 'dark' }

mergeSettings(defaults, user) // { theme: 'dark', lang: 'ru', fontSize: 14 }
defaults.theme               // всё ещё 'light'
```

## Главная задача 2 (из плана): массив товаров

```js
const products = [
  { id: 1, title: 'Кружка', price: 450 },
  { id: 2, title: 'Наушники', price: 3200 },
  { id: 3, title: 'Блокнот', price: 290 },
  { id: 4, title: 'Рюкзак', price: 2500 },
]
```

- `getCheapProducts(products)` — товары **дешевле 1000** → Кружка, Блокнот.
- `getTotal(products)` — **общая сумма** цен → 6440.
- `sortByPrice(products)` — новый массив, **отсортированный по цене** по возрастанию. Исходный массив не должен измениться!

---

## Мини-задача 1: `getTitles(products)`

Верни массив названий: `['Кружка', 'Наушники', 'Блокнот', 'Рюкзак']`.

## Мини-задача 2: `findById(products, id)` и `hasExpensive(products, limit)`

- `findById(products, 3)` → объект Блокнота; если не найден — `undefined`.
- `hasExpensive(products, 3000)` → `true`, если есть хоть один товар дороже `limit`.

## Мини-задача 3: `sum(...numbers)` и `getLabel(product)`

- `sum(1, 2, 3)` → `6`, `sum()` → `0`. Используй **rest-параметр**.
- `getLabel({ title: 'Кружка', price: 450 })` → `'Кружка — 450 ₽'`. Используй **деструктуризацию прямо в параметрах** функции.

---

✍️ В конце дня заполни заметку по шаблону `notes/template.md`.
