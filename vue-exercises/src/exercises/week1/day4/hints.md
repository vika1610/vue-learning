# Подсказки · Неделя 1 · День 4 · Конвертер и красный счётчик

<details>
<summary>Подсказка 1 — намёк</summary>

- `computed` — это значение, которое **вычисляется** из других реактивных данных и пересчитывается само, когда они меняются.
- `:class` принимает объект: ключ — имя класса, значение — условие (true/false).

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `import { ref, computed } from 'vue'`
- `const fahrenheit = computed(() => /* формула через celsius.value */)`
- Поле: `<input type="number" v-model="celsius" />`. Обрати внимание: из поля может прийти строка. Проверь, что получится, если ввести число и прибавить 32. (Модификатор `.number` будет на неделе 2 — можешь подсмотреть.)
- Класс: `:class="{ negative: count < 0 }"`, а в `<style>` — `.negative { color: red; }`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

- Округление: `Math.round(x * 10) / 10` или `x.toFixed(1)`.
- Конвертация в обе стороны — computed с геттером и сеттером:
  ```js
  const fahrenheit = computed({
    get() { /* C → F */ },
    set(newF) { /* записать в celsius.value пересчёт F → C */ },
  })
  ```
  Тогда можно сделать второе поле `v-model="fahrenheit"`.
- Через стиль: `:style="{ color: count < 0 ? 'red' : '' }"`.

</details>
