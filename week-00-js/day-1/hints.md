# Подсказки · Неделя 0 · День 1

Открывай по одной. Сначала попробуй сама после каждой!

<details>
<summary>Подсказка 1 — намёк</summary>

- `formatPrice`: у чисел есть метод `toLocaleString(язык, настройки)`. Язык для России — `'ru-RU'`. Попробуй в консоли браузера `(1234.5).toLocaleString('ru-RU')` — что не хватает?
- `greet`: параметры по умолчанию пишутся прямо в скобках функции через `=`.
- `describeType`: начни с оператора `typeof` и посмотри, какие значения он «путает».
- `isAdult`: стрелочная функция может сразу вернуть выражение без `return` и фигурных скобок.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `formatPrice`: во втором аргументе `toLocaleString` есть настройки `minimumFractionDigits` и `maximumFractionDigits`. А знак рубля проще всего дописать шаблонной строкой `` `${...} ₽` ``.
- `greet`: `function greet(name = 'гость', greeting = ...)`.
- `describeType`: `typeof null` возвращает `'object'`, а `typeof []` — тоже `'object'`. Значит `null` и массив надо проверить **до** `typeof`. Для массива есть `Array.isArray(value)`.
- `isAdult`: `(age, minAge = 18) => ...`

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

- `formatPrice`:
  ```js
  const formatted = price.toLocaleString('ru-RU', { /* две настройки про дробную часть: обе = 2 */ })
  return /* шаблонная строка с formatted и ₽ */
  ```
- `describeType`: порядок проверок: `null` → массив → `typeof`. Для результата `typeof` удобно сделать объект-словарь `{ string: 'строка', number: 'число', ... }` и брать перевод по ключу.

</details>
