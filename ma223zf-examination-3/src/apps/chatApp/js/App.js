/**
 * Chat class - Handel the client side only; Initialize socket and handel recieving and sending of messages
 */

const id = 0
let socket
const msg = {
  // Format of the message
  type: 'message',
  data: '',
  username: '',
  channel: '',
  key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
}

function initSocket () {
  socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
  
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data)
    switch (message.type) {
      case 'notification':
        appendMessage(`[${getCurrentDate()}] ${message.data}`)
        break
      case 'message':
        appendMessage(
          `[${getCurrentDate()}] ${message.username} : ${message.data}`
        )
        break
      default:
        break
    }
  }
  socket.onclose = function (event) {
    console.log('Disconnected from WebSocket.')
  }

  socket.onerror = function (error) {
    console.log('WebSocket Error: ' + error)
  }
};

const closeSocket = () => {
  socket.close()
}

const CreateChatForm = () => {
  const ChatContainer = document.createElement('div')

  /*
   * Create header- with side button and user name
   */
  const barDiv = document.createElement('div')
  barDiv.style.display = 'none'
  barDiv.id = 'main' + id
  barDiv.className = 'main'
  /*
   * side button
   */
  const barBtn = document.createElement('input')
  barBtn.type = 'button'
  barBtn.className = 'openbtn'
  barBtn.value = '☰'
  barBtn.addEventListener('click', function (event) {
    const x = document.getElementById('mySidebar' + id)
    if (x.className !== 'sidebar opened') {
      x.className = 'sidebar opened'
    } else {
      x.className = 'sidebar closed'
    }
  })
  barDiv.appendChild(barBtn)
  // user name label
  const usrLabel = document.createElement('label')
  usrLabel.innerText = ''
  usrLabel.className = 'userNameLabel'
  usrLabel.id = 'userLabel' + id
  barDiv.appendChild(usrLabel)

  const sidebarDiv = document.createElement('div')
  sidebarDiv.id = 'mySidebar' + +id
  sidebarDiv.className = 'sidebar closed'
  // delete messages button
  const deleteBtn = document.createElement('label')
  deleteBtn.innerText = 'Delete messages'
  deleteBtn.className = 'deletetxt'
  // delete messages function
  deleteBtn.addEventListener('click', function (event) {
    document.getElementById('message-container' + id).innerHTML = ''
    const x = document.getElementById('mySidebar' + id)
    if (x.className !== 'sidebar opened') {
      x.className = 'sidebar opened'
    } else {
      x.className = 'sidebar closed'
    }
  })
  sidebarDiv.appendChild(deleteBtn)

  barDiv.appendChild(sidebarDiv)
  ChatContainer.appendChild(barDiv)
  // endOf Create header

  // Create user name form- the first form
  const userNDiv = document.createElement('div')
  userNDiv.className = 'UserName-container invisible box'
  userNDiv.id = 'UserName-container'
  userNDiv.style.display = 'block'
  // user name text input
  const userNtxt = document.createElement('input')
  userNtxt.className = 'userName-text textSubmit'
  userNtxt.id = 'nickTxt' + id
  userNtxt.type = 'text'
  userNtxt.autofocus = true
  userNtxt.placeholder = 'Enter your name'
  userNDiv.appendChild(userNtxt)
  // enter name buton
  const userNbtn = document.createElement('input')
  userNbtn.className = 'buttonSubmit'
  userNbtn.id = 'userNbtn' + id
  userNbtn.type = 'submit'
  userNbtn.value = 'Save'
  userNbtn.addEventListener('click', function (event) {
    const uname = document.getElementById('nickTxt' + id).value // take text in the text input
    if (uname !== '') {
      msg.username = uname
      userNDiv.style.display = 'none' // Make the user name form invisible after entering the name
      document.getElementById('ChatDiv' + id).style.display = 'block' // Make the chat form visible
      document.getElementById('main' + id).style.display = 'block'
      document.getElementById('userLabel' + id).innerText = uname // put the name entered in the header bar of the chats
      msgtxt.focus() // make the focus on message area
      initSocket() // initilize a socket
    }
  })
  // handel when the user press 'enter' on the user name text input
  userNtxt.addEventListener('keyup', function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault()
      // Trigger the button element with a click
      userNbtn.click()
    }
  })
  userNDiv.appendChild(userNbtn)
  ChatContainer.appendChild(userNDiv)
  // Create chat form
  const chatDiv = document.createElement('div')
  chatDiv.className = 'ChatDiv invisible'
  chatDiv.id = 'ChatDiv' + id
  chatDiv.style.display = 'none'
  // create container for all messages
  const msgDiv = document.createElement('div')
  msgDiv.className = 'message-container'
  msgDiv.id = 'message-container' + id
  chatDiv.appendChild(msgDiv)
  // Add message form; contains of button and message text input
  const sendForm = document.createElement('form')
  sendForm.id = 'send-container'
  // create message text input
  const msgtxt = document.createElement('input')
  msgtxt.className = 'textSubmit'
  msgtxt.id = 'message-input'
  msgtxt.type = 'text'
  msgtxt.placeholder = 'Write your message here...'
  sendForm.appendChild(msgtxt)
  // create enetr message button
  const msgbtn = document.createElement('input')
  msgbtn.className = 'buttonSubmit'
  msgbtn.id = 'msgBtn'
  msgbtn.type = 'submit'
  msgbtn.value = 'Send'
  sendForm.appendChild(msgbtn)
  chatDiv.appendChild(sendForm)
  // Send message button action
  sendForm.addEventListener('submit', (e) => {
    try {
      e.preventDefault()
      const message = msgtxt.value
      if (message !== '') {
        msg.data = message
        socket.send(JSON.stringify(msg))
      }
      msgtxt.value = ''
    } catch (err) {}
  })
  ChatContainer.appendChild(chatDiv)

  return ChatContainer
}
const body = document.querySelector('body')
body.appendChild(CreateChatForm())
/**
 * Add the message to the popup
 * @param {string} message - message recieved
 */
function appendMessage (message) {
  const messageElement = document.createElement('div') // create div for every message
  messageElement.className = 'MessageElement'
  messageElement.innerText = message
  const mesC = document.getElementById('message-container' + id)
  if (mesC == null) {
    closeSocket()
  } else {
    mesC.append(messageElement)
    mesC.scrollTop = mesC.scrollHeight
  }
}
/**
 * Get current date
 */
function getCurrentDate () {
  const currentDate = new Date()
  const day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate()
  const month =
    (currentDate.getMonth() + 1 < 10 ? '0' : '') + (currentDate.getMonth() + 1)
  const hour =
    (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours()
  const minute =
    (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes()
  return month + '-' + day + ' ' + hour + ':' + minute
}
