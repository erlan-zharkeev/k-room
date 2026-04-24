export const getViewPort = () => {
  const { innerWidth: width, innerHeight: height } = window

  return {
    width,
    height
  }
}
