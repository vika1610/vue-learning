<!--
  Служебный компонент: меню задач. Трогать не нужно.

  Каждая задача запускается как ОТДЕЛЬНОЕ маленькое Vue-приложение.
  Если рядом с Exercise.vue лежит setup.js с функцией install(app),
  она вызывается до запуска — там на неделях 5 и 6 ты подключишь роутер и Pinia.

  Если рядом лежит ExerciseOptions.vue — это бонус: та же задача в стиле Options API.
  Она открывается по адресу ?ex=weekN/dayN&api=options (ссылка «Options API» в меню).
-->
<script setup>
import { createApp, onMounted, onUnmounted, ref } from 'vue'
import { exercises, weekTitles } from './exercises.js'

const components = import.meta.glob('./exercises/*/*/Exercise.vue')
const optionsComponents = import.meta.glob('./exercises/*/*/ExerciseOptions.vue')
const setups = import.meta.glob('./exercises/*/*/setup.js')

const params = new URLSearchParams(location.search)
const currentId = params.get('ex')
const isOptions = params.get('api') === 'options'
const current = exercises.find((ex) => ex.id === currentId)

const hasOptionsVersion = (id) => `./exercises/${id}/ExerciseOptions.vue` in optionsComponents

const weeks = Object.keys(weekTitles).map((week) => ({
  number: week,
  title: weekTitles[week],
  items: exercises.filter((ex) => String(ex.week) === week),
}))

const mountPoint = ref(null)
const error = ref('')
const unmounted = ref(false)
let exerciseApp = null

// Размонтировать задачу без перезагрузки страницы — чтобы проверить onUnmounted
function unmountExercise() {
  exerciseApp?.unmount()
  exerciseApp = null
  unmounted.value = true
}

onMounted(async () => {
  if (!current) return
  try {
    const loader = isOptions
      ? optionsComponents[`./exercises/${current.id}/ExerciseOptions.vue`]
      : components[`./exercises/${current.id}/Exercise.vue`]
    if (!loader) throw new Error(`Файл ${isOptions ? 'ExerciseOptions.vue' : 'Exercise.vue'} для этой задачи не найден`)
    const component = (await loader()).default
    exerciseApp = createApp(component)
    const setupLoader = setups[`./exercises/${current.id}/setup.js`]
    if (setupLoader) {
      const { install } = await setupLoader()
      await install?.(exerciseApp)
    }
    exerciseApp.mount(mountPoint.value)
  } catch (e) {
    error.value = String(e?.stack || e)
    console.error(e)
  }
})

onUnmounted(() => exerciseApp?.unmount())
</script>

<template>
  <div v-if="current" class="exercise-page">
    <header class="exercise-header">
      <a href="/">← Все задачи</a>
      <span>
        Неделя {{ current.week }} · День {{ current.day }} · {{ current.title }}
        <strong v-if="isOptions"> · Options API</strong>
      </span>
      <a v-if="isOptions" :href="`?ex=${current.id}`">→ версия &lt;script setup&gt;</a>
      <a v-else-if="hasOptionsVersion(current.id)" :href="`?ex=${current.id}&api=options`">→ версия Options API</a>
      <button v-if="!unmounted" class="unmount" @click="unmountExercise" title="Убрать задачу со страницы без перезагрузки — сработает onUnmounted">
        ⏏ Размонтировать
      </button>
      <a v-else :href="`?ex=${current.id}${isOptions ? '&api=options' : ''}`">↻ Запустить снова</a>
    </header>
    <pre v-if="error" class="error">{{ error }}</pre>
    <p v-if="unmounted" class="note">Задача размонтирована (сработал onUnmounted). Посмотри в консоль: не идут ли ещё сообщения?</p>
    <div ref="mountPoint" class="exercise"></div>
  </div>

  <main v-else class="menu">
    <h1>Задачи по Vue</h1>
    <p v-if="currentId" class="error">Задача «{{ currentId }}» не найдена.</p>
    <section v-for="week in weeks" :key="week.number">
      <h2>Неделя {{ week.number }} — {{ week.title }}</h2>
      <ul>
        <li v-for="ex in week.items" :key="ex.id">
          <a :href="`?ex=${ex.id}`">Неделя {{ ex.week }} · День {{ ex.day }} · {{ ex.title }}</a>
          <a v-if="hasOptionsVersion(ex.id)" class="options-link" :href="`?ex=${ex.id}&api=options`">Options API</a>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.menu {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
}
.menu li {
  margin: 6px 0;
}
.options-link {
  margin-left: 8px;
  font-size: 13px;
  padding: 1px 6px;
  border: 1px solid currentColor;
  border-radius: 4px;
}
.exercise-header {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #555;
}
.exercise {
  padding: 16px;
}
.unmount {
  margin-left: auto;
  font-size: 13px;
}
.note {
  padding: 0 16px;
  color: #555;
}
.error {
  color: #c62828;
  white-space: pre-wrap;
  padding: 0 16px;
}
</style>
