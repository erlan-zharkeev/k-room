export const useMainLoader = () => {
  const loader = document.getElementById('app-loader')

  const switchMainLoader = (status: 'hide' | 'show') => {
    const method = status === 'hide' ? 'add' : 'remove'
    loader?.classList[method]('app-loader--hide')
  }

  return {
    switchMainLoader
  }
}
