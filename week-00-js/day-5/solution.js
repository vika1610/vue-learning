export const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

/**
 * Загружает пользователей по адресу url.
 * Если ответ сервера не ok — выбрасывает ошибку.
 *
 * @param {string} [url] — адрес, по умолчанию USERS_URL
 * @returns {Promise<object[]>} массив пользователей
 */
export async function loadUsers(url) {
  const response = await fetch(url ?? USERS_URL);
  if(response.ok) {
    return await response.json();
  } else {
    throw new Error(`ошибка ${response.status}`);
  }
}

/**
 * Возвращает массив имён пользователей.
 *
 * @param {{ name: string }[]} users
 * @returns {string[]}
 */
export function getNames(users) {
  return users.map(user => user.name);
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
  container.textContent = 'Загрузка…';
  try {
    const users = await loadUsers(url);
    const names = getNames(users);
    const ul = document.createElement('ul');
    for(const name of names) {
      const li = document.createElement('li');
      li.textContent = name;
      ul.appendChild(li);
    }
    container.textContent = '';
    container.appendChild(ul);
  } catch (error) {
    container.textContent = `Ошибка: ${error.message}`;
  }
}

/**
 * Возвращает промис, который выполнится через ms миллисекунд.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Разбирает JSON-строку. Если строка некорректная — возвращает fallback.
 *
 * @param {string} text
 * @param {*} fallback — значение на случай ошибки
 * @returns {*}
 */
export function parseJSONSafe(text, fallback) {
  try { 
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

/**
 * Превращает массив пользователей в JSON-строку, оставляя только id и name.
 *
 * @param {{ id: number, name: string }[]} users
 * @returns {string}
 */
export function toJSON(users) {
  const result = users.map(({id, name}) => ({ id, name }));
  return JSON.stringify(result);
}
