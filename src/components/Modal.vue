<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['toggleModal', 'create-task', 'edit-task'])

const title = ref(props.task ? props.task.title : '')
const description = ref(props.task ? props.task.description : '')
const dueDate = ref(props.task ? props.task.dueDate : '')

const isEditMode = ref(!!props.task)

const handleSaveTask = () => {
  const newTask = {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    completed: props.task ? props.task.completed : false
  }
  if (isEditMode.value && props.task) {
    emit('edit-task', { ...newTask, id: props.task.id })
  } else {
    emit('create-task', newTask)
  }
}

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title
      description.value = newTask.description
      dueDate.value = newTask.dueDate
      isEditMode.value = true
    } else {
      title.value = ''
      description.value = ''
      dueDate.value = ''
      isEditMode.value = false
    }
  }
)
</script>

<template>
  <div class="modal">
    <div class="modal__content">
      <div class="modal__content__top">
        <button @click="emit('toggleModal')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.5 1.5L16.5 16.5" stroke="white" stroke-width="1.5" />
            <path d="M16.5 1.5L1.5 16.5" stroke="white" stroke-width="1.5" />
          </svg>
        </button>
      </div>
      <div class="modal__content__inputs">
        <div>
          <label for="title">Название</label><br />
          <input type="text" id="title" v-model="title" />
        </div>
        <div>
          <label for="description">Описание</label><br />
          <input type="text" id="description" v-model="description" />
        </div>
        <div>
          <label for="dueDate">Срок выполнения</label><br />
          <input type="date" id="dueDate" v-model="dueDate" />
        </div>
      </div>
      <div class="save">
        <button @click="handleSaveTask">
          {{ isEditMode ? 'Сохранить изменения' : 'Создать задачу' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.modal
  display: flex
  justify-content: center
  align-items: center
  position: absolute
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.3)

  &__content
    display: flex
    flex-direction: column
    justify-content: center
    background: white
    border: none
    border-radius: 6px
    width: 25%
    margin: 0 auto
    align-items: center
    padding-bottom: 50px

    &__top
      display: flex
      flex-direction: row
      justify-content: flex-end
      width: calc(100% - 20px)
      padding: 10px

      & button
        display: flex
        justify-content: center
        align-items: center
        padding: 7.5px

    &__inputs
      width: calc(100% - 60px)
      padding: 30px
      display: flex
      flex-direction: column
      margin-bottom: 30px
      gap: 12px

      & label
        font-size: 12px
        text-transform: uppercase
        color: #9B9B9B

      & input
        font-size: 16px
        font-weight: 500
        width: 100%
        height: 30px
        border-radius: 4px
        border: #9B9B9B 1px solid

.save
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  padding-top: 10px
</style>
