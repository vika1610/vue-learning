import { describe, it, expect } from 'vitest'
import { formatPrice, greet, describeType, isAdult } from './solution.js'

// toLocaleString ставит неразрывные пробелы — заменяем их на обычные,
// чтобы тест не зависел от вида пробела
const normalize = (str) => String(str).replace(/\s/g, ' ')

describe('formatPrice', () => {
  it('форматирует 1234.5 как «1 234,50 ₽»', () => {
    expect(normalize(formatPrice(1234.5))).toBe('1 234,50 ₽')
  })

  it('форматирует ноль', () => {
    expect(normalize(formatPrice(0))).toBe('0,00 ₽')
  })

  it('разделяет миллионы', () => {
    expect(normalize(formatPrice(1000000))).toBe('1 000 000,00 ₽')
  })

  it('округляет до двух знаков', () => {
    expect(normalize(formatPrice(99.999))).toBe('100,00 ₽')
    expect(normalize(formatPrice(5.1))).toBe('5,10 ₽')
  })
})

describe('greet', () => {
  it('здоровается по имени', () => {
    expect(greet('Вика')).toBe('Привет, Вика!')
  })

  it('принимает своё приветствие', () => {
    expect(greet('Вика', 'Добрый день')).toBe('Добрый день, Вика!')
  })

  it('без аргументов здоровается с гостем', () => {
    expect(greet()).toBe('Привет, гость!')
  })
})

describe('describeType', () => {
  it.each([
    ['текст', 'строка'],
    [42, 'число'],
    [NaN, 'число'],
    [true, 'булево'],
    [undefined, 'undefined'],
    [null, 'null'],
    [[1, 2], 'массив'],
    [{ a: 1 }, 'объект'],
    [() => {}, 'функция'],
  ])('%o → %s', (value, expected) => {
    expect(describeType(value)).toBe(expected)
  })
})

describe('isAdult', () => {
  it('20 лет — взрослый', () => {
    expect(isAdult(20)).toBe(true)
  })

  it('16 лет — нет', () => {
    expect(isAdult(16)).toBe(false)
  })

  it('ровно 18 — взрослый', () => {
    expect(isAdult(18)).toBe(true)
  })

  it('учитывает свой минимальный возраст', () => {
    expect(isAdult(16, 16)).toBe(true)
    expect(isAdult(20, 21)).toBe(false)
  })
})
