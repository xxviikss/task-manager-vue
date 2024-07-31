<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { debounce } from 'lodash'

// Определяем типы для событий
const emit = defineEmits<{ (e: 'toggleModal'): void }>()

// Определяем тип для строки поиска
const searchQuery = ref<string>('')

// Используем хранилище задач
const taskStore = useTaskStore()

// Определяем функцию для поиска задач
const handleSearch = async (query: string) => {
  await taskStore.loadTasks(query)
}

// Определяем функцию для задержки выполнения поиска
const debouncedHandleSearch = debounce((query: string) => {
  handleSearch(query)
}, 300)

// Обработчик ввода для строки поиска
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  debouncedHandleSearch(target.value)
}
</script>

<template>
  <div class="header">
    <input
      @input="onInput"
      v-model="searchQuery"
      type="text"
      class="header__search"
      placeholder="Поиск"
    />
    <button @click="emit('toggleModal')">Добавить задачу</button>
  </div>
</template>

<style lang="sass" scoped>
.header
  display: flex
  flex-direction: row
  justify-content: space-between

  &__search
    font-size: 16px
    font-weight: 500
    width: 40%
    border-radius: 4px
    border: #9B9B9B 1px солидный
</style>
