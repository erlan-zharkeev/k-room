export const useHideMainLoader = () => {
  const hideMainLoader = () => {
    const loader = document.getElementById('app-loader')
    loader?.classList.add('app-loader--hide')
  }

  return {
    hideMainLoader
  }
}
