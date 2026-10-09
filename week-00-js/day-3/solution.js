/**
 * Объединяет настройки: пользовательские перекрывают значения по умолчанию.
 * Не изменяет исходные объекты — возвращает новый.
 *
 * @param {object} defaults — настройки по умолчанию
 * @param {object} user — настройки пользователя
 * @returns {object} новый объект с объединёнными настройками
 */
export function mergeSettings(defaults, user) {
  return {...defaults, ...user};
}

/**
 * Возвращает товары дешевле 1000.
 *
 * @param {{ id: number, title: string, price: number }[]} products
 * @returns {{ id: number, title: string, price: number }[]}
 */
export function getCheapProducts(products) {
  return products.filter(item => item.price < 1000);
}

/**
 * Считает общую сумму цен всех товаров.
 *
 * @param {{ price: number }[]} products
 * @returns {number}
 */
export function getTotal(products) {
  return products.reduce((acc, item) => acc + item.price, 0);
}

/**
 * Возвращает НОВЫЙ массив товаров, отсортированный по цене по возрастанию.
 * Исходный массив не изменяется.
 *
 * @param {{ price: number }[]} products
 * @returns {{ price: number }[]}
 */
export function sortByPrice(products) {
  return [...products].sort((a, b) => a.price - b.price);
}

/**
 * Возвращает массив названий товаров.
 *
 * @param {{ title: string }[]} products
 * @returns {string[]}
 */
export function getTitles(products) {
  return products.map(item => item.title);
}

/**
 * Находит товар по id. Если не найден — undefined.
 *
 * @param {{ id: number }[]} products
 * @param {number} id
 * @returns {object | undefined}
 */
export function findById(products, id) {
  return products.find(item => item.id === id);
}

/**
 * Проверяет, есть ли хотя бы один товар дороже limit.
 *
 * @param {{ price: number }[]} products
 * @param {number} limit
 * @returns {boolean}
 */
export function hasExpensive(products, limit) {
  return products.some(item => item.price > limit);
}

/**
 * Складывает любое количество чисел. Без аргументов возвращает 0.
 * Используй rest-параметр.
 *
 * @param {...number} numbers
 * @returns {number}
 */
export function sum(...numbers) {
  return numbers.reduce((acc, item) => acc + item, 0);
}


/**
 * Возвращает подпись товара «Название — цена ₽».
 * Используй деструктуризацию в параметрах: function getLabel({ ... })
 *
 * @param {{ title: string, price: number }} product
 * @returns {string} например 'Кружка — 450 ₽'
 */
export function getLabel({title, price}) {
  return `${title} — ${price} ₽`;
}
