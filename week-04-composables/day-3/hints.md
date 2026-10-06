# Подсказки · Неделя 4 · День 3 — старт проекта

<details>
<summary>Подсказка 1 — намёк</summary>

- Строки вида `"2026-10-05"` удобно сравнивать (`===`), искать в массиве (`includes`) и сортировать как обычные строки — их порядок совпадает с порядком дат. С объектами `Date` так не выйдет: два объекта с одной датой не равны через `===`.
- `toISOString()` переводит время в UTC — отсюда «вчерашняя» дата поздно вечером.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

Для `todayKey()` возьми год, месяц и день **в местном времени**: `getFullYear()`, `getMonth()` (осторожно: январь — это `0`!), `getDate()`. Месяц и день дополни нулём слева через `padStart`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(/* ? */).padStart(2, '0')
  const d = String(/* ? */).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toDateKey(new Date())
}
```

Функция `toDateKey(date)` для любой даты пригодится на неделе 6 при подсчёте серии.

</details>
