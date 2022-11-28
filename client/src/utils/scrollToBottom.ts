const scrollToBottom = () => {
  setTimeout(() => {
    const element = document.getElementById('message-list')?.querySelector('.ant-list-items')
    if (element == null) return
    element.scrollTop = element.scrollHeight + 1000
  })
}

export default scrollToBottom
