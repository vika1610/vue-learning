import { describe, it, expect, beforeEach } from 'vitest'
import {
  mergeSettings,
  getCheapProducts,
  getTotal,
  sortByPrice,
  getTitles,
  findById,
  hasExpensive,
  sum,
  getLabel,
} from './solution.js'

let products

beforeEach(() => {
  products = [
    { id: 1, title: 'Кружка', price: 450 },
    { id: 2, title: 'Наушники', price: 3200 },
    { id: 3, title: 'Блокнот', price: 290 },
    { id: 4, title: 'Рюкзак', price: 2500 },
  ]
})

describe('mergeSettings', () => {
  it('пользовательские настройки перекрывают значения по умолчанию', () => {
    const defaults = { theme: 'light', lang: 'ru', fontSize: 14 }
    const user = { theme: 'dark' }
    expect(mergeSettings(defaults, user)).toEqual({ theme: 'dark', lang: 'ru', fontSize: 14 })
  })

  it('не изменяет исходные объекты', () => {
    const defaults = { theme: 'light', lang: 'ru' }
    const user = { theme: 'dark', fontSize: 16 }
    const result = mergeSettings(defaults, user)
    expect(result).toEqual({ theme: 'dark', lang: 'ru', fontSize: 16 })
    expect(defaults).toEqual({ theme: 'light', lang: 'ru' })
    expect(user).toEqual({ theme: 'dark', fontSize: 16 })
    expect(result).not.toBe(defaults)
    expect(result).not.toBe(user)
  })
})

describe('getCheapProducts', () => {
  it('возвращает товары дешевле 1000', () => {
    expect(getCheapProducts(products).map((p) => p.title)).toEqual(['Кружка', 'Блокнот'])
  })

  it('товар ровно за 1000 не считается дешёвым', () => {
    expect(getCheapProducts([{ id: 1, title: 'X', price: 1000 }])).toEqual([])
  })
})

describe('getTotal', () => {
  it('считает общую сумму', () => {
    expect(getTotal(products)).toBe(6440)
  })

  it('для пустого массива возвращает 0', () => {
    expect(getTotal([])).toBe(0)
  })
})

describe('sortByPrice', () => {
  it('сортирует по возрастанию цены', () => {
    expect(sortByPrice(products).map((p) => p.price)).toEqual([290, 450, 2500, 3200])
  })

  it('сортирует числа как числа, а не как строки', () => {
    const items = [{ price: 100 }, { price: 25 }, { price: 3 }]
    expect(sortByPrice(items).map((p) => p.price)).toEqual([3, 25, 100])
  })

  it('не изменяет исходный массив', () => {
    const before = products.map((p) => p.id)
    const sorted = sortByPrice(products)
    expect(sorted.map((p) => p.id)).toEqual([3, 1, 4, 2])
    expect(products.map((p) => p.id)).toEqual(before)
    expect(sorted).not.toBe(products)
  })
})

describe('getTitles', () => {
  it('возвращает названия', () => {
    expect(getTitles(products)).toEqual(['Кружка', 'Наушники', 'Блокнот', 'Рюкзак'])
  })
})

describe('findById', () => {
  it('находит товар', () => {
    expect(findById(products, 3)).toEqual({ id: 3, title: 'Блокнот', price: 290 })
  })

  it('возвращает undefined, если товара нет', () => {
    expect(findById(products, 1)).toBeDefined()
    expect(findById(products, 99)).toBeUndefined()
  })
})

describe('hasExpensive', () => {
  it('true, если есть товар дороже лимита', () => {
    expect(hasExpensive(products, 3000)).toBe(true)
  })

  it('false, если все дешевле', () => {
    expect(hasExpensive(products, 5000)).toBe(false)
  })
})

describe('sum', () => {
  it('складывает любое количество чисел', () => {
    expect(sum(1, 2, 3)).toBe(6)
    expect(sum(10)).toBe(10)
  })

  it('без аргументов возвращает 0', () => {
    expect(sum()).toBe(0)
  })
})

describe('getLabel', () => {
  it('собирает подпись товара', () => {
    expect(getLabel({ title: 'Кружка', price: 450 })).toBe('Кружка — 450 ₽')
  })
})
