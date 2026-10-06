// Список всех задач для меню.
// Задача открывается по адресу /?ex=<id>, например /?ex=week1/day3
export const exercises = [
  { id: 'week1/day1', week: 1, day: 1, title: 'Первое приложение' },
  { id: 'week1/day2', week: 1, day: 2, title: 'Карточка профиля' },
  { id: 'week1/day3', week: 1, day: 3, title: 'Счётчик' },
  { id: 'week1/day4', week: 1, day: 4, title: 'Конвертер температур' },
  { id: 'week1/day5', week: 1, day: 5, title: 'Калькулятор чаевых' },

  { id: 'week2/day1', week: 2, day: 1, title: 'Список задач' },
  { id: 'week2/day2', week: 2, day: 2, title: 'Список покупок' },
  { id: 'week2/day3', week: 2, day: 3, title: 'Форма регистрации' },
  { id: 'week2/day4', week: 2, day: 4, title: 'Валидация и черновик' },
  { id: 'week2/day5', week: 2, day: 5, title: 'Таймер Pomodoro' },

  { id: 'week5/day1', week: 5, day: 1, title: 'Три страницы и меню' },
  { id: 'week5/day2', week: 5, day: 2, title: 'Блог' },
  { id: 'week5/day3', week: 5, day: 3, title: '404 и вложенные маршруты' },
  { id: 'week5/day4', week: 5, day: 4, title: 'Закрытая страница' },

  { id: 'week6/day1', week: 6, day: 1, title: 'Счётчик в сторе' },
  { id: 'week6/day2', week: 6, day: 2, title: 'Магазин' },
  { id: 'week6/day3', week: 6, day: 3, title: 'Корзина' },
]

export const weekTitles = {
  1: 'Основы Vue',
  2: 'Условия, списки, события, формы',
  5: 'Vue Router',
  6: 'Pinia',
}
