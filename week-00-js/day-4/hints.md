# Подсказки · Неделя 0 · День 4

<details>
<summary>Подсказка 1 — намёк</summary>

- Импорт выглядит как `import { имя1, имя2 } from './файл.js'` — путь обязательно с `./` и с `.js`.
- Найти элемент на странице: `document.querySelector(...)` или `document.getElementById(...)`.
- Подписаться на клик: у элемента есть метод `addEventListener`.
- `capitalize`: первый символ строки — `str[0]`, остаток — метод `slice`.
- Класс: поля задаются в `constructor` через `this.имя = значение`.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Текст кнопки читается и меняется через свойство `button.textContent`.
- `setupToggleButton`:
  1. записать `firstText` в `textContent`;
  2. `button.addEventListener('click', () => { /* поменять текст */ })`.
  Чтобы узнать «следующий» текст, передай текущий текст в свою `toggleText`.
- `capitalize`: у пустой строки `str[0]` — это `undefined`. Подумай, как проверить пустую строку в начале.
- `applyDiscount(percent)`: новая цена = цена × (1 − процент / 100).

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

- `main.js`:
  ```js
  import { setupToggleButton } from './solution.js'
  const button = document.getElementById(/* ? */)
  setupToggleButton(button, /* два текста */)
  ```
- Класс:
  ```js
  export class Product {
    constructor(title, price) {
      this.title = title
      // ...
    }
    getLabel() {
      return `...` // используй this.title и this.price
    }
  }
  ```

</details>
