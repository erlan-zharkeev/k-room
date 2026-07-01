;(function () {
  if (!('serviceWorker' in navigator)) return

  var hadController = Boolean(navigator.serviceWorker.controller)
  var reloadStarted = false

  var reloadOnControllerChange = function () {
    if (!hadController) {
      hadController = true
      return
    }

    if (reloadStarted) return

    reloadStarted = true
    window.location.reload()
  }

  var activateWaitingWorker = function (worker) {
    if (!worker || !hadController) return

    worker.postMessage({ type: 'SKIP_WAITING' })
  }

  var watchInstallingWorker = function (registration) {
    var worker = registration.installing

    if (!worker) return

    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed') {
        activateWaitingWorker(worker)
      }
    })
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.addEventListener('controllerchange', reloadOnControllerChange)

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(function (registration) {
        activateWaitingWorker(registration.waiting)

        registration.addEventListener('updatefound', function () {
          watchInstallingWorker(registration)
        })

        return registration.update()
      })
      .catch(function () {})
  })
})()
