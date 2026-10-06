# Подсказки · Неделя 2 · День 5 · Таймер Pomodoro

<details>
<summary>Подсказка 1 — намёк</summary>

- Храни **одно число** — сколько секунд осталось. Минуты и секунды для показа вычисляются из него.
- `setInterval` возвращает id. Без этого id интервал потом не остановить.
- Компонент удаляется со страницы, а интервал — нет: он продолжит тикать в фоне, пока его явно не остановят.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `const secondsLeft = ref(25 * 60)`
- id интервала можно хранить в обычной переменной `let intervalId = null` — показывать его на экране не нужно. А вот «идёт ли таймер» удобно знать в шаблоне.
- ММ:СС: минуты — `Math.floor(s / 60)`, секунды — `s % 60`, ведущий ноль — `String(x).padStart(2, '0')`.
- `onUnmounted(() => { /* остановить интервал */ })`

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
function start() {
  if (intervalId) return // уже запущен
  intervalId = setInterval(() => {
    secondsLeft.value--
    if (secondsLeft.value <= 0) {
      // остановить и показать «Перерыв!»
    }
  }, 1000)
}

function pause() {
  clearInterval(intervalId)
  intervalId = null
}
```

`reset` = `pause` + вернуть секунды к началу.

Для заголовка вкладки подойдёт `watch` или `watchEffect` из вчерашнего урока.

</details>
