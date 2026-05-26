import { ref } from 'vue'

export const useMessageDeleteDialog = () => {
  const isDeleteMessageDialogOpen = ref(false)

  const openDeleteMessageDialog = () => {
    isDeleteMessageDialogOpen.value = true
  }

  return {
    isDeleteMessageDialogOpen,
    openDeleteMessageDialog
  }
}
