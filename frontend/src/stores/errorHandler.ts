import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useErrorHandler = defineStore('errorHandler', () => {
  const currentErrorStatus = ref<Error|unknown>();

  const showError = ref<boolean>(false)

  function setError(error:Error|unknown){
    currentErrorStatus.value = error
    showError.value = true
  }

  return {currentErrorStatus,showError,setError }
})
 