# Подсказки · Неделя 5 · День 4 · Закрытая страница

<details>
<summary>Подсказка 1 — намёк</summary>

- Навигационный хук — это функция, которую роутер вызывает **перед каждым** переходом. Она может разрешить переход, отменить его или перенаправить.
- `meta` — любые твои данные, прикреплённые к маршруту. Роутер сам их не использует — их читает твой хук.
- Где хранить «вошёл ли пользователь», чтобы это видели и хук, и страница входа, и меню? Пока Pinia нет — подойдёт маленький отдельный модуль (`auth.js`) с `ref` и функциями `login` / `logout`.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- `{ path: '/profile', component: () => import('./pages/ProfilePage.vue'), meta: { requiresAuth: true } }`
- ```js
  router.beforeEach((to) => {
    if (to.meta.requiresAuth && /* не вошла */) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  })
  ```
  Вернуть ничего (или `true`) = разрешить переход.
- На странице входа: `route.query.redirect` — куда вернуть, `router.push(...)` — перейти.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
// auth.js
import { ref } from 'vue'

export const isLoggedIn = ref(localStorage.getItem('loggedIn') === 'true')

export function login() {
  isLoggedIn.value = true
  localStorage.setItem('loggedIn', 'true')
}

// logout — по аналогии
```

После `logout()` на закрытой странице подумай: хук сам не сработает, ведь перехода не было. Что сделать? (`router.push('/')`.)

</details>
