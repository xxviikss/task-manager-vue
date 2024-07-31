<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import Header from './components/Header.vue'
import Modal from './components/Modal.vue'
import { useTaskStore, TaskInterface } from './stores/taskStore'

const taskStore = useTaskStore()
const tasks = ref<TaskInterface[]>([])
const isModal = ref<boolean>(false)
const taskToEdit = ref<TaskInterface | null>(null)

function toggleModal(task: TaskInterface | null = null) {
  isModal.value = !isModal.value
  taskToEdit.value = task
}

const handleCreateTask = async (task: Omit<TaskInterface, 'id'>) => {
  await taskStore.createTask(task)
  tasks.value = taskStore.tasks
  toggleModal()
}

const handleEditTask = async (task: TaskInterface) => {
  await taskStore.editTask(task.id, task)
  tasks.value = taskStore.tasks
  toggleModal()
}
</script>

<template>
  <Modal
    v-if="isModal"
    :task="taskToEdit"
    @toggleModal="toggleModal"
    @create-task="handleCreateTask"
    @edit-task="handleEditTask"
  />
  <div class="main">
    <Header @toggleModal="toggleModal" />
    <TaskList @edit-task="toggleModal" />
  </div>
</template>

<style lang="sass">
.main
  display: flex
  flex-direction: column
  justify-self: center
  width: 50%
  padding: 53px 24px
  border: 1px solid red
  gap: 18px
  margin: 0 auto

button
  width: fit-content
  height: fit-content
  font-size: 16px
  text-transform: uppercase
  color: white
  background: #5451FF
  border: none
  padding: 4px
  border-radius: 2px
  font-weight: 600
  cursor: pointer
</style>
