// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { loadUsers, getNames, renderUsers, delay, parseJSONSafe, toJSON, USERS_URL } from './solution.js'

const fakeUsers = [
  { id: 1, name: 'Leanne Graham', email: 'a@a.ru' },
  { id: 2, name: 'Ervin Howell', email: 'b@b.ru' },
]

// Подменяем fetch: тесты не ходят в интернет, а получают заранее заданный ответ
function mockFetchOk(data) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function mockFetchStatus(status) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: false, status, json: () => Promise.resolve({}) }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('loadUsers', () => {
  it('возвращает пользователей', async () => {
    mockFetchOk(fakeUsers)
    await expect(loadUsers(USERS_URL)).resolves.toEqual(fakeUsers)
  })

  it('по умолчанию обращается к USERS_URL', async () => {
    const fetchMock = mockFetchOk(fakeUsers)
    await loadUsers()
    expect(fetchMock).toHaveBeenCalledWith(USERS_URL)
  })

  it('выбрасывает ошибку, если ответ не ok', async () => {
    mockFetchStatus(404)
    await expect(loadUsers(USERS_URL)).rejects.toThrow()
  })
})

describe('getNames', () => {
  it('возвращает имена', () => {
    expect(getNames(fakeUsers)).toEqual(['Leanne Graham', 'Ervin Howell'])
  })
})

describe('renderUsers', () => {
  it('сразу показывает «Загрузка…»', () => {
    // fetch, который никогда не закончится — так видно состояние загрузки
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    const container = document.createElement('div')
    renderUsers(container, USERS_URL)
    expect(container.textContent).toBe('Загрузка…')
  })

  it('выводит список имён в <ul><li>', async () => {
    mockFetchOk(fakeUsers)
    const container = document.createElement('div')
    await renderUsers(container, USERS_URL)
    const items = [...container.querySelectorAll('ul li')].map((li) => li.textContent)
    expect(items).toEqual(['Leanne Graham', 'Ervin Howell'])
    expect(container.textContent).not.toContain('Загрузка')
  })

  it('показывает ошибку, если сервер ответил ошибкой', async () => {
    mockFetchStatus(500)
    const container = document.createElement('div')
    await renderUsers(container, USERS_URL)
    expect(container.textContent.startsWith('Ошибка')).toBe(true)
  })

  it('показывает ошибку, если нет сети', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const container = document.createElement('div')
    await renderUsers(container, USERS_URL)
    expect(container.textContent.startsWith('Ошибка')).toBe(true)
  })
})

describe('delay', () => {
  it('возвращает промис, который выполняется через ms', async () => {
    vi.useFakeTimers()
    let done = false
    delay(1000).then(() => {
      done = true
    })
    await vi.advanceTimersByTimeAsync(999)
    expect(done).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(done).toBe(true)
  })
})

describe('parseJSONSafe', () => {
  it('разбирает корректный JSON', () => {
    expect(parseJSONSafe('{"a":1}', null)).toEqual({ a: 1 })
  })

  it('возвращает fallback для некорректной строки', () => {
    expect(parseJSONSafe('не json', [])).toEqual([])
  })
})

describe('toJSON', () => {
  it('оставляет только id и name', () => {
    expect(toJSON(fakeUsers)).toBe('[{"id":1,"name":"Leanne Graham"},{"id":2,"name":"Ervin Howell"}]')
  })
})
