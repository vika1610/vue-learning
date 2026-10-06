# Подсказки · Неделя 6 · День 3 · Корзина

<details>
<summary>Подсказка 1 — намёк</summary>

- В корзине удобно хранить не весь товар, а только то, что нужно для показа и подсчёта, плюс количество.
- «Добавить» = найти позицию по `productId`. Нашлась — увеличить количество, нет — добавить новую.
- `$subscribe` вызывает твою функцию **каждый раз**, когда меняется state стора.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `find` по `productId` (неделя 0, день 3), `findIndex` + `splice` или `filter` — для удаления.
- Сумма: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`.
- `$subscribe` вызывается на **экземпляре** стора — например, в компоненте после `const cart = useCartStore()`:
  ```js
  cart.$subscribe((mutation, state) => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  })
  ```
- Восстановление: начальное значение state можно взять из `localStorage` (с защитой от пустого или испорченного значения — вспомни `parseJSONSafe`).

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
function addToCart(product) {
  const existing = items.value.find((item) => item.productId === product.id)
  if (existing) {
    // ?
  } else {
    items.value.push({ /* productId, title, price, quantity: 1 */ })
  }
}
```

Альтернатива `$subscribe` в setup-сторе: `watch(items, ..., { deep: true })` прямо внутри `defineStore`. Попробуй оба способа и выбери понятный тебе.

</details>
