// Модуль с утилитами. Всё, что нужно другим файлам, помечай словом export.

/**
 * Возвращает «другой» текст: если current равен a — вернуть b, иначе a.
 *
 * @param {string} current — текущий текст
 * @param {string} a — первый вариант
 * @param {string} b — второй вариант
 * @returns {string}
 */
export function toggleText(current, a, b) {
  // TODO: твой код здесь
}

/**
 * Делает первую букву строки заглавной.
 *
 * @param {string} str
 * @returns {string} например 'Привет' для 'привет'; '' для ''
 */
export function capitalize(str) {
  // TODO: твой код здесь
}

/**
 * Настраивает кнопку-переключатель:
 * сразу ставит на кнопку текст firstText, а при каждом клике
 * меняет текст между firstText и secondText.
 *
 * @param {HTMLButtonElement} button — кнопка на странице
 * @param {string} firstText — начальный текст
 * @param {string} secondText — текст после первого клика
 */
export function setupToggleButton(button, firstText, secondText) {
  // TODO: поставь начальный текст и добавь обработчик события click
}

/**
 * Товар.
 * - new Product(title, price) сохраняет title и price в полях объекта;
 * - getLabel() возвращает 'Название — цена ₽';
 * - applyDiscount(percent) уменьшает цену на percent процентов.
 */
export class Product {
  // TODO: constructor(title, price) { ... }

  // TODO: getLabel() { ... }

  // TODO: applyDiscount(percent) { ... }
}
