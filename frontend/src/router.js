import { renderHomePage } from './views/home.js'
import { renderUploadPage } from './views/upload.js'

function getRoute() {
  const hash = window.location.hash || '#/'
  const route = hash.replace(/^#\/?/, '')
  return route
}

function renderCurrentRoute() {
  const app = document.getElementById('app')
  const route = getRoute()

  switch (route) {
    case 'upload':
      renderUploadPage(app)
      break
    case '':
    case 'home':
    default:
      renderHomePage(app)
      break
  }
}

export function initRouter() {
  window.addEventListener('hashchange', renderCurrentRoute)
  window.addEventListener('load', renderCurrentRoute)
  // Render inicial por si el load ya ocurrió
  renderCurrentRoute()
}