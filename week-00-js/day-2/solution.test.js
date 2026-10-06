import { describe, it, expect } from 'vitest'
import { makeCounter, makeIdGenerator, copyObject, deepCopy } from './solution.js'

describe('makeCounter', () => {
  it('начинается с нуля', () => {
    expect(makeCounter().value()).toBe(0)
  })

  it('inc и dec меняют значение', () => {
    const counter = makeCounter()
    counter.inc()
    counter.inc()
    counter.dec()
    expect(counter.value()).toBe(1)
  })

  it('принимает стартовое значение', () => {
    expect(makeCounter(10).value()).toBe(10)
  })

  it('два счётчика не зависят друг от друга', () => {
    const a = makeCounter()
    const b = makeCounter()
    a.inc()
    a.inc()
    b.dec()
    expect(a.value()).toBe(2)
    expect(b.value()).toBe(-1)
  })

  it('число спрятано в замыкании, а не лежит в свойстве объекта', () => {
    const counter = makeCounter(5)
    const values = Object.values(counter)
    expect(values.every((v) => typeof v === 'function')).toBe(true)
  })
})

describe('makeIdGenerator', () => {
  it('выдаёт последовательные id', () => {
    const next = makeIdGenerator('task')
    expect(next()).toBe('task-1')
    expect(next()).toBe('task-2')
    expect(next()).toBe('task-3')
  })

  it('у разных генераторов свой счёт', () => {
    const tasks = makeIdGenerator('task')
    const users = makeIdGenerator('user')
    tasks()
    tasks()
    expect(users()).toBe('user-1')
  })
})

describe('copyObject', () => {
  it('возвращает новый объект с теми же свойствами', () => {
    const user = { name: 'Аня', age: 25 }
    const copy = copyObject(user)
    expect(copy).toEqual(user)
    expect(copy).not.toBe(user)
  })

  it('изменение копии не трогает оригинал', () => {
    const user = { name: 'Аня', age: 25 }
    const copy = copyObject(user)
    copy.name = 'Оля'
    expect(user.name).toBe('Аня')
  })
})

describe('deepCopy', () => {
  it('копирует вложенные объекты', () => {
    const user = { name: 'Аня', address: { city: 'Москва' }, tags: ['js'] }
    const copy = deepCopy(user)
    expect(copy).toEqual(user)
    expect(copy.address).not.toBe(user.address)
    expect(copy.tags).not.toBe(user.tags)
  })

  it('изменение вложенного объекта копии не трогает оригинал', () => {
    const user = { name: 'Аня', address: { city: 'Москва' } }
    const copy = deepCopy(user)
    copy.address.city = 'Казань'
    expect(user.address.city).toBe('Москва')
  })
})
