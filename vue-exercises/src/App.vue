<!--
  Служебный компонент: меню задач. Трогать не нужно.

  Каждая задача запускается как ОТДЕЛЬНОЕ маленькое Vue-приложение.
  Если рядом с Exercise.vue лежит setup.js с функцией install(app),
  она вызывается до запуска — там на неделях 5 и 6 ты подключишь роутер и Pinia.
-->
<script setup>
import { createApp, onMounted, onUnmounted, ref } from 'vue'
import { exercises, weekTitles } from './exercises.js'

const components = import.meta.glob('./exercises/*/*/Exercise.vue')
const setups = import.meta.glob('./exercises/*/*/setup.js')

const currentId = new URLSearchParams(location.search).get('ex')
const current = exercises.find((ex) => ex.id === currentId)

const weeks = Object.keys(weekTitles).map((week) => ({
  number: week,
  title: weekTitles[week],
  items: exercises.filter((ex) => String(ex.week) === week),
}))

const mountPoint = ref(null)
const error = ref('')
let exerciseApp = null

onMounted(async () => {
  if (!current) return
  try {
    const component = (await components[`./exercises/${current.id}/Exercise.vue`]()).default
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
      <span>Неделя {{ current.week }} · День {{ current.day }} · {{ current.title }}</span>
    </header>
    <pre v-if="error" class="error">{{ error }}</pre>
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
.error {
  color: #c62828;
  white-space: pre-wrap;
  padding: 0 16px;
}
</style>
