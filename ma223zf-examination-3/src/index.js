import { Window } from './Window.js'

const apps = [
  {
    id: 0,
    name: 'Chat App',
    height: 350,
    width: 400,
    iconPath: '',
    path: 'src/apps/chatApp/index.html'
  },
  {
    id: 1,
    name: 'Memory Game',
    height: 500,
    width: 500,
    iconPath: '',
    path: 'src/apps/memoryGame/index.html'
  },

  {
    id: 2,
    name: 'Weather',
    height: 300,
    width: 400,
    iconPath: '',
    path: 'src/apps/weather/index.html'
  }
]

let windowId = 0
let activeWindow

/**
 * This method create the app icon element
 * @param app-represent an app data like
 * {
                    "id": 0,
                    "name": "Chat App",
                    "height": 350,
                    "width": 400,
                    "iconPath": "",
                    "path": "apps/chatApp/chat_app.html"
                }
 */
function addAppButton (app) {
  const button = document.createElement('button')
  button.textContent = app.name
  button.setAttribute('app-id', app.id)// to know which app will be run when the icon clicked//
  button.setAttribute('class', 'btn-success')
  document.getElementsByTagName('body')[0].appendChild(button)
  button.addEventListener('click', openApp)
}

/**
 * This method get the apps object
 * and for each object it generate a icon on the pwd main screen
 */
function getApps () {
  apps.forEach((app) => {
    addAppButton(app)
  })
}

function clickedWindow () {
  activeWindow.classList.remove('active')
  activeWindow = this
  activeWindow.classList.add('active')
}

/**
 *  This method run when the user click the app icon
 * @param e-represent the click action/event
 */
function openApp (e) {
  if (activeWindow) { activeWindow.classList.remove('active') }
  const appId = e.currentTarget.getAttribute('app-id')
  const app = apps[appId]
  const appWindow = new Window(windowId, app.name, app.height, app.width, document, app.path)
  appWindow.view.addEventListener('click', clickedWindow)
  activeWindow = appWindow.view
  appWindow.addWindowToPage()
  windowId = windowId + 1
}

window.localStorage.setItem('chatapp_username', '') // each time username deleted
getApps()
