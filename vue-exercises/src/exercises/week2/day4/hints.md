# Подсказки · Неделя 2 · День 4 · Валидация и черновик

<details>
<summary>Подсказка 1 — намёк</summary>

- Ошибки **вычисляются** из данных формы — значит это `computed`, а не отдельные `ref`, которые нужно обновлять руками.
- Сохранение в `localStorage` — это **побочный эффект** («когда данные изменились — сделай что-то»). Для этого как раз `watch`.
- `localStorage` хранит только строки. Как превратить объект в строку и обратно?

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Простая проверка email: `/^\S+@\S+\.\S+$/.test(form.email)`. Цифра в пароле: `/\d/.test(...)`.
- ```js
  const errors = computed(() => ({
    name: form.name.length < 2 ? 'Минимум 2 символа' : '',
    // ...
  }))
  const hasErrors = computed(() => Object.values(errors.value).some(/* ? */))
  ```
- «Пользователь уже трогал поле»: модификатор `v-model.lazy` или событие `@blur` + объект `touched`.
- `watch(form, (newForm) => { ... }, { deep: true })`. Для `reactive` глубокое слежение включено по умолчанию, но явно указать полезно для понимания.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
const DRAFT_KEY = 'registration-draft'

// при запуске — восстановить
const saved = localStorage.getItem(DRAFT_KEY)
if (saved) {
  Object.assign(form, JSON.parse(saved))
}

// при изменении — сохранить без паролей
watch(form, () => {
  const { password, confirm, ...rest } = form // rest — всё, кроме паролей
  localStorage.setItem(DRAFT_KEY, /* ? */)
}, { deep: true })
```

Очистить: `localStorage.removeItem(DRAFT_KEY)` и сбросить поля формы.

Проверить, что сохранилось: DevTools → Application → Local Storage.

</details>
