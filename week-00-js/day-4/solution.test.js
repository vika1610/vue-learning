// @vitest-environment jsdom
// Строка выше включает «браузер внутри Node» (jsdom), чтобы в тестах были document и кнопки.

import { describe, it, expect } from 'vitest'
import { toggleText, capitalize, setupToggleButton, Product } from './solution.js'

describe('toggleText', () => {
  it('меняет a на b', () => {
    expect(toggleText('Да', 'Да', 'Нет')).toBe('Нет')
  })

  it('меняет b на a', () => {
    expect(toggleText('Нет', 'Да', 'Нет')).toBe('Да')
  })
})

describe('capitalize', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalize('привет')).toBe('Привет')
    expect(capitalize('vue')).toBe('Vue')
  })

  it('не ломается на пустой строке', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('setupToggleButton', () => {
  it('сразу ставит первый текст', () => {
    const button = document.createElement('button')
    setupToggleButton(button, 'Вкл', 'Выкл')
    expect(button.textContent).toBe('Вкл')
  })

  it('переключает текст по клику туда и обратно', () => {
    const button = document.createElement('button')
    setupToggleButton(button, 'Вкл', 'Выкл')
    button.click()
    expect(button.textContent).toBe('Выкл')
    button.click()
    expect(button.textContent).toBe('Вкл')
  })
})

describe('Product', () => {
  it('сохраняет название и цену', () => {
    const mug = new Product('Кружка', 450)
    expect(mug.title).toBe('Кружка')
    expect(mug.price).toBe(450)
  })

  it('getLabel возвращает подпись', () => {
    expect(new Product('Кружка', 450).getLabel()).toBe('Кружка — 450 ₽')
  })

  it('applyDiscount уменьшает цену', () => {
    const mug = new Product('Кружка', 450)
    mug.applyDiscount(10)
    expect(mug.price).toBe(405)
    expect(mug.getLabel()).toBe('Кружка — 405 ₽')
  })

  it('у каждого товара свои данные', () => {
    const a = new Product('A', 100)
    const b = new Product('B', 200)
    a.applyDiscount(50)
    expect(b.price).toBe(200)
  })
})
