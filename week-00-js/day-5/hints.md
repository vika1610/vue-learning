# Подсказки · Неделя 0 · День 5

<details>
<summary>Подсказка 1 — намёк</summary>

- `fetch(url)` возвращает промис с объектом-ответом. Из ответа данные достаются ещё одним промисом — методом `json()`. Значит, `await` понадобится дважды.
- У ответа есть свойство `ok` (`true`, если статус 200–299). `fetch` **не** выбрасывает ошибку на 404 — проверять `ok` нужно самой.
- `renderUsers`: всё, что может «упасть», оберни в `try { ... } catch (error) { ... }`.
- `delay`: нужен `new Promise(...)` и `setTimeout`.
- `parseJSONSafe`: `JSON.parse` выбрасывает ошибку на некорректной строке.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `loadUsers(url = USERS_URL)`:
  ```js
  const response = await fetch(url)
  if (!response.ok) {
    // выбросить ошибку
  }
  // вернуть данные из response.json()
  ```
- `renderUsers`: порядок такой:
  1. `container.textContent = 'Загрузка…'` — **до** первого `await`;
  2. в `try`: загрузить, получить имена, собрать `<ul>`;
  3. в `catch`: `container.textContent = ...` с текстом ошибки.
- Список можно собрать двумя способами: строкой в `innerHTML` или через `document.createElement('li')` + `append`. Второй безопаснее.
- `toJSON`: сначала `map` в объекты `{ id, name }`, потом `JSON.stringify`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

- `delay`: `return new Promise((resolve) => setTimeout(/* что вызвать? */, ms))`.
- Создание списка:
  ```js
  const ul = document.createElement('ul')
  for (const name of names) {
    const li = document.createElement('li')
    li.textContent = name
    // добавить li в ul
  }
  container.textContent = '' // очистить «Загрузка…»
  // добавить ul в container
  ```
- `toJSON`: `users.map(({ id, name }) => /* ? */)` — деструктуризация из дня 3 пригодилась!

</details>
