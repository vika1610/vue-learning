# Подсказки · Неделя 2 · День 3 · Форма регистрации

<details>
<summary>Подсказка 1 — намёк</summary>

`v-model` для текстового поля связывает `value`, для чекбокса — `checked`. Писать это вручную не нужно: Vue сам выбирает, что связать, по типу поля.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `const form = reactive({ name: '', email: '', password: '', confirm: '', age: null, agree: false })`
- `<input v-model.trim="form.name" />`
- `<input type="checkbox" v-model="form.agree" />` → в данных `true` / `false`.
- `:disabled="..."` на кнопке — атрибут, значит `v-bind`.
- Обрати внимание на `.number`: без него `form.age` будет строкой, это видно в `<pre>` по кавычкам.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```vue
<form @submit.prevent="submit">
  <label>
    Имя
    <input v-model.trim="form.name" />
  </label>
  <!-- остальные поля -->
  <button :disabled="/* ? */">Зарегистрироваться</button>
</form>

<p v-if="submitted">Добро пожаловать, {{ /* ? */ }}!</p>
```

`submitted` — отдельный `ref(false)`, который `submit()` переключает в `true`.

Чтобы клик по тексту чекбокса тоже ставил галочку — оберни чекбокс и текст в `<label>`.

</details>
