export const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

/**
 * Загружает пользователей по адресу url.
 * Если ответ сервера не ok — выбрасывает ошибку.
 *
 * @param {string} [url] — адрес, по умолчанию USERS_URL
 * @returns {Promise<object[]>} массив пользователей
 */
export async function loadUsers(url) {
  // TODO: fetch → проверить response.ok → вернуть разобранный JSON
}

/**
 * Возвращает массив имён пользователей.
 *
 * @param {{ name: string }[]} users
 * @returns {string[]}
 */
export function getNames(users) {
  // TODO: твой код здесь
}

/**
 * Показывает список имён пользователей в контейнере.
 * 1) сразу пишет «Загрузка…»;
 * 2) при успехе — <ul> с <li> для каждого имени;
 * 3) при ошибке — текст, начинающийся с «Ошибка».
 *
 * @param {HTMLElement} container — элемент, куда выводить
 * @param {string} [url] — адрес, по умолчанию USERS_URL
 * @returns {Promise<void>}
 */
export async function renderUsers(container, url) {
  // TODO: твой код здесь (не забудь try/catch)
}

/**
 * Возвращает промис, который выполнится через ms миллисекунд.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  // TODO: твой код здесь
}

/**
 * Разбирает JSON-строку. Если строка некорректная — возвращает fallback.
 *
 * @param {string} text
 * @param {*} fallback — значение на случай ошибки
 * @returns {*}
 */
export function parseJSONSafe(text, fallback) {
  // TODO: твой код здесь
}

/**
 * Превращает массив пользователей в JSON-строку, оставляя только id и name.
 *
 * @param {{ id: number, name: string }[]} users
 * @returns {string}
 */
export function toJSON(users) {
  // TODO: твой код здесь
}
