<script setup lang="ts">
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

// Определяем типы для свойств
interface TaskProps {
  id: number
  title: string
  description: string
  dueDate: string
  completed: boolean
}

const props = defineProps<TaskProps>()

const emits = defineEmits<{
  (e: 'delete-task', id: number): void
  (e: 'toggle-completion', id: number): void
  (e: 'edit-task', task: TaskProps): void
}>()

// Вычисляемое свойство для проверки, просрочена ли задача
const isOverdue = computed(() => {
  const today = new Date()
  return new Date(props.dueDate) < today && !props.completed
})

// Функция для удаления задачи с подтверждением
const deleteTask = () => {
  emits('delete-task', props.id)
}

// Функция для переключения состояния выполнения задачи
const toggleCompletion = () => {
  emits('toggle-completion', props.id)
}

// Функция для открытия модального окна редактирования
const openEditModal = () => {
  emits('edit-task', {
    id: props.id,
    title: props.title,
    description: props.description,
    dueDate: props.dueDate,
    completed: props.completed
  })
}
</script>

<template>
  <div class="task" :class="{ 'task--overdue': isOverdue }">
    <input type="checkbox" :checked="completed" @change="toggleCompletion" />
    <div class="task__info">
      <div class="info">
        <p class="info__title" :class="{ 'info__title--completed': completed }">{{ title }}</p>
        <p class="info__date">{{ dueDate }}</p>
      </div>
      <div class="buttons">
        <button @click="deleteTask">удалить</button>
        <button @click="openEditModal">редактировать</button>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.task
  display: flex
  flex-direction: row
  padding: 5px
  gap: 1rem
  background: #F1F1F1
  border-radius: 4px
  padding: 8px 10px 8px 10px

  &--overdue
    background: #FF7474

  & input
    border: 1px solid #9B9B9B

  &__info
    display: flex
    flex-direction: row
    flex: 1
    width: 90%
    justify-content: space-between
    gap: 10px

  .info
    display: flex
    flex-direction: column
    flex: 1

    &__title
      font-size: 20px
      font-weight: 600

      &--completed
        text-decoration: line-through

    &__date
      font-size: 12px

  .buttons
    display: flex
    flex-direction: row
    align-items: center
    gap: 4px
</style>
