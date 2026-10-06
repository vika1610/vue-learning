/**
 * Объединяет настройки: пользовательские перекрывают значения по умолчанию.
 * Не изменяет исходные объекты — возвращает новый.
 *
 * @param {object} defaults — настройки по умолчанию
 * @param {object} user — настройки пользователя
 * @returns {object} новый объект с объединёнными настройками
 */
export function mergeSettings(defaults, user) {
  // TODO: твой код здесь
}

/**
 * Возвращает товары дешевле 1000.
 *
 * @param {{ id: number, title: string, price: number }[]} products
 * @returns {{ id: number, title: string, price: number }[]}
 */
export function getCheapProducts(products) {
  // TODO: твой код здесь
}

/**
 * Считает общую сумму цен всех товаров.
 *
 * @param {{ price: number }[]} products
 * @returns {number}
 */
export function getTotal(products) {
  // TODO: твой код здесь
}

/**
 * Возвращает НОВЫЙ массив товаров, отсортированный по цене по возрастанию.
 * Исходный массив не изменяется.
 *
 * @param {{ price: number }[]} products
 * @returns {{ price: number }[]}
 */
export function sortByPrice(products) {
  // TODO: твой код здесь
}

/**
 * Возвращает массив названий товаров.
 *
 * @param {{ title: string }[]} products
 * @returns {string[]}
 */
export function getTitles(products) {
  // TODO: твой код здесь
}

/**
 * Находит товар по id. Если не найден — undefined.
 *
 * @param {{ id: number }[]} products
 * @param {number} id
 * @returns {object | undefined}
 */
export function findById(products, id) {
  // TODO: твой код здесь
}

/**
 * Проверяет, есть ли хотя бы один товар дороже limit.
 *
 * @param {{ price: number }[]} products
 * @param {number} limit
 * @returns {boolean}
 */
export function hasExpensive(products, limit) {
  // TODO: твой код здесь
}

/**
 * Складывает любое количество чисел. Без аргументов возвращает 0.
 * Используй rest-параметр.
 *
 * @param {...number} numbers
 * @returns {number}
 */
export function sum() {
  // TODO: добавь rest-параметр и посчитай сумму
}

/**
 * Возвращает подпись товара «Название — цена ₽».
 * Используй деструктуризацию в параметрах: function getLabel({ ... })
 *
 * @param {{ title: string, price: number }} product
 * @returns {string} например 'Кружка — 450 ₽'
 */
export function getLabel(product) {
  // TODO: твой код здесь
}
