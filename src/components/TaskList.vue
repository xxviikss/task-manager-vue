<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Task from './Task.vue'
import { useTaskStore, TaskInterface } from '../stores/taskStore'

const taskStore = useTaskStore()
const tasks = computed(() => taskStore.tasks)

const emits = defineEmits<{
  (e: 'edit-task', task: TaskInterface): void
}>()

const loadTasks = async (query: string = '') => {
  await taskStore.loadTasks(query)
}

const handleDeleteTask = async (taskId: number) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId)
    await loadTasks()
  }
}

const handleToggleCompletion = async (taskId: number) => {
  await taskStore.toggleCompletion(taskId)
  await loadTasks()
}

const toggleEditModal = (task: TaskInterface) => {
  emits('edit-task', task)
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="list">
    <Task
      v-for="task in tasks"
      :key="task.id"
      :id="task.id"
      :title="task.title"
      :description="task.description"
      :dueDate="task.dueDate"
      :completed="task.completed"
      @delete-task="handleDeleteTask"
      @toggle-completion="handleToggleCompletion"
      @edit-task="toggleEditModal"
    />
  </div>
</template>

<style lang="sass" scoped>
.list
  display: flex
  flex-direction: column
  gap: 10px
  width: 100%
</style>
