/**
 * Форматирует число как цену в рублях.
 * Ровно 2 знака после запятой, разряды через пробел, в конце « ₽».
 *
 * @param {number} price — цена, например 1234.5
 * @returns {string} например «1 234,50 ₽»
 */
export function formatPrice(price) {
  return `${price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₽`
}

/**
 * Возвращает приветствие.
 * Если имя не передано — «гость», если приветствие не передано — «Привет».
 *
 * @param {string} [name] — имя
 * @param {string} [greeting] — слово приветствия
 * @returns {string} например «Привет, Вика!»
 */
export function greet(name = 'гость', greeting = 'Привет') {
  // TODO: добавь параметры по умолчанию и верни шаблонную строку
  return `${greeting}, ${name}!`;
}

/**
 * Возвращает название типа значения по-русски:
 * 'строка', 'число', 'булево', 'undefined', 'null', 'массив', 'объект', 'функция'.
 *
 * @param {*} value — любое значение
 * @returns {string}
 */
export function describeType(value) {
  // TODO: твой код здесь
  const type = typeof value;
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'массив';
  }
  switch (type) {
    case 'string':
      return 'строка';
    case 'number':
      return 'число';
    case 'boolean':
      return 'булево';
    case 'undefined':
      return 'undefined';
    case 'object':
      return 'объект';
    case 'function':
      return 'функция';
    default:
      return type;
  }
}

/**
 * Проверяет, что возраст не меньше минимального (по умолчанию 18).
 * Перепиши как стрелочную функцию: export const isAdult = (...) => ...
 *
 * @param {number} age — возраст
 * @param {number} [minAge] — минимальный возраст, по умолчанию 18
 * @returns {boolean}
 */
export const isAdult = (age, minAge = 18) => age >= minAge
  // TODO: добавь параметры и верни результат сравнения
