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
  return current === a ? b : a;
}

/**
 * Делает первую букву строки заглавной.
 *
 * @param {string} str
 * @returns {string} например 'Привет' для 'привет'; '' для ''
 */
export function capitalize(str) {
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
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
  button.textContent = firstText;
  button.addEventListener('click', () => {
    button.textContent = toggleText(button.textContent, firstText, secondText);
  });
}

/**
 * Товар.
 * - new Product(title, price) сохраняет title и price в полях объекта;
 * - getLabel() возвращает 'Название — цена ₽';
 * - applyDiscount(percent) уменьшает цену на percent процентов.
 */
export class Product {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  getLabel() { return `${this.title} — ${this.price} ₽`; }

  applyDiscount(percent) {
    this.price = this.price * (1 - percent / 100);
  }
}
