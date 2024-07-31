import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000/tasks'

export interface TaskInterface {
  id: number
  title: string
  description: string
  dueDate: string
  completed: boolean
}

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref<TaskInterface[]>([])

  const loadTasks = async (query: string = '') => {
    try {
      const response = await axios.get<TaskInterface[]>(
        `${API_URL}${query ? `?title_like=${query}` : ''}`
      )
      tasks.value = response.data
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }

  const createTask = async (task: Omit<TaskInterface, 'id'>) => {
    try {
      const response = await axios.post(API_URL, task)
      tasks.value.push({
        ...response.data,
        id: Number(response.data.id),
        dueDate: formatDate(new Date(response.data.dueDate))
      })
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`)
      tasks.value = tasks.value.filter((task) => task.id !== taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const toggleCompletion = async (taskId: number) => {
    const task = tasks.value.find((task) => task.id === taskId)
    if (task) {
      task.completed = !task.completed
      try {
        await axios.put(`${API_URL}/${taskId}`, task)
      } catch (error) {
        console.error('Failed to toggle task completion:', error)
      }
    }
  }

  const editTask = async (taskId: number | string, updatedTask: Partial<TaskInterface>) => {
    try {
      const response = await axios.patch(`${API_URL}/${taskId}`, updatedTask)
      const index = tasks.value.findIndex((task) => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...response.data }
      }
    } catch (error) {
      console.error('Failed to edit task:', error)
    }
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    tasks,
    loadTasks,
    createTask,
    deleteTask,
    toggleCompletion,
    editTask
  }
})
