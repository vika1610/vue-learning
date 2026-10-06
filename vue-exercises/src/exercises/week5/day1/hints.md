# Подсказки · Неделя 5 · День 1 · Три страницы и меню

<details>
<summary>Подсказка 1 — намёк</summary>

Роутер — это «таблица»: адрес → какой компонент показать. `RouterView` — место, куда этот компонент подставляется, а `RouterLink` — ссылка, которая меняет адрес без перезагрузки страницы.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- В `setup.js` понадобятся `createRouter` и `createWebHashHistory` из `'vue-router'` и импорты твоих страниц.
- Маршрут — объект `{ path: '/about', component: AboutPage }`.
- Подключение — так же, как любой плагин Vue: `app.use(...)`.
- `<RouterLink to="/about">О проекте</RouterLink>`
- У активной ссылки RouterLink сам ставит класс `router-link-active` (и `router-link-exact-active` при точном совпадении).

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
// ...

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    // ...
  ],
})

export function install(app) {
  // ?
}
```

Почему у «Главной» класс активности есть всегда? Сравни `router-link-active` и `router-link-exact-active`.

</details>
