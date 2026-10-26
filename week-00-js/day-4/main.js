// Главный скрипт страницы index.html.
// Он подключён как модуль, поэтому может импортировать функции из других файлов.

// TODO 1: импортируй setupToggleButton и capitalize из './solution.js'
import { setupToggleButton, capitalize } from './solution.js';

// TODO 2: найди кнопку на странице (у неё id="toggle")
const toggleButton = document.getElementById('toggle');

// TODO 3: вызови setupToggleButton для этой кнопки, например с текстами 'Светлая тема' и 'Тёмная тема'
setupToggleButton(toggleButton, 'Светлая тема', 'Тёмная тема');

// TODO 4 (по желанию): выведи в элемент с id="title" какой-нибудь текст через capitalize
const titleElement = document.getElementById('title');
titleElement.textContent = capitalize('привет, мир!');