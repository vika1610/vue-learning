# Подсказки · Неделя 6 · День 2 · Магазин

<details>
<summary>Подсказка 1 — намёк</summary>

- Загрузка данных — это **action** (действие, может быть `async`). Вычисления из данных — **getters** (как `computed`).
- Подумай, где хранить выбранную категорию: она нужна только этому экрану — значит, может жить в компоненте, а не в сторе.

</details>

<details>
<summary>Подсказка 2 — конкретнее</summary>

- Уникальные категории: `new Set(...)` из массива категорий, потом обратно в массив `[...set]`.
- Средняя цена: `reduce` суммы, делённый на длину (осторожно с пустым массивом!).
- `storeToRefs(store)` превращает state и getters в ref-ы, которые можно деструктурировать. **Actions** берутся из стора напрямую: `const { fetchProducts } = store` — это можно.
- Фильтрованный список — `computed` в компоненте.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

```js
// в компоненте
const store = useProductsStore()
const { products, loading, error, categories } = storeToRefs(store)
const selected = ref('') // '' = все категории

const visible = computed(() =>
  selected.value ? products.value.filter(/* ? */) : products.value,
)

onMounted(() => store.fetchProducts())
```

Почему обычная деструктуризация ломает реактивность: ты получаешь **значение на момент деструктуризации**, а не «живую» связь со стором.

</details>
