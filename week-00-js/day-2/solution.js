/**
 * Создаёт счётчик. Число хранится в замыкании.
 *
 * @param {number} [start] — начальное значение, по умолчанию 0
 * @returns {{ inc: () => void, dec: () => void, value: () => number }}
 */
export function makeCounter(start = 0) {
  // TODO: заведи переменную для числа и верни объект с тремя методами
  let count = start
  return {
    inc() {
      count++
    },
    dec() {
      count--
    },
    value() {
      return count
    }
  }
}

/**
 * Создаёт генератор id: 'prefix-1', 'prefix-2', ...
 *
 * @param {string} prefix — префикс, например 'task'
 * @returns {() => string} функция, которая при каждом вызове возвращает новый id
 */
export function makeIdGenerator(prefix) {
  // TODO: твой код здесь
  let id = 0;
  return function() {
    id++;
    return `${prefix}-${id}`;
  }
}

/**
 * Возвращает поверхностную копию объекта (новый объект, те же свойства).
 *
 * @param {object} obj
 * @returns {object}
 */
export const copyObject = (obj) => Object.assign({}, obj);

/**
 * Возвращает глубокую копию объекта: вложенные объекты тоже копируются.
 *
 * @param {object} obj
 * @returns {object}
 */
export const deepCopy = (obj) => structuredClone(obj);
