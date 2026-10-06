/**
 * Создаёт счётчик. Число хранится в замыкании.
 *
 * @param {number} [start] — начальное значение, по умолчанию 0
 * @returns {{ inc: () => void, dec: () => void, value: () => number }}
 */
export function makeCounter(start) {
  // TODO: заведи переменную для числа и верни объект с тремя методами
}

/**
 * Создаёт генератор id: 'prefix-1', 'prefix-2', ...
 *
 * @param {string} prefix — префикс, например 'task'
 * @returns {() => string} функция, которая при каждом вызове возвращает новый id
 */
export function makeIdGenerator(prefix) {
  // TODO: твой код здесь
}

/**
 * Возвращает поверхностную копию объекта (новый объект, те же свойства).
 *
 * @param {object} obj
 * @returns {object}
 */
export function copyObject(obj) {
  // TODO: твой код здесь
}

/**
 * Возвращает глубокую копию объекта: вложенные объекты тоже копируются.
 *
 * @param {object} obj
 * @returns {object}
 */
export function deepCopy(obj) {
  // TODO: твой код здесь
}
