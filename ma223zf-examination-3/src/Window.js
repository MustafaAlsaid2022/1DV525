export class Window {
  constructor (id, title, h, w, doc, path) {
    this.id = id
    this.doc = doc
    this.height = h
    this.width = w
    this.title = title
    this.path = path
    this.viewString = this.buildViewString(path)
    this.view = this.createWindowView(this.doc)
  }

  addWindowToPage () {
    this.doc.body.appendChild(this.view)
    placeWindow(this)
    resizeObj(this)
    this.addCloseFunctionality()
    dragElement(this.view)
  }

  createWindowView (doc) {
    const div = doc.createElement('div')
    div.innerHTML = this.viewString.trim()
    return div.firstChild
  }

  addCloseFunctionality () {
    const closeButton = this.doc.getElementById(this.id + 'close')
    closeButton.addEventListener('click', () => {
      this.view.parentNode.removeChild(this.view)
    })
  }

  buildViewString () {
    return '<div win-id=\'' + this.id + '\' class="container container-fluid active">\n' +
      '    <div class="row">\n' +
      '        <div class="col-4">\n' +
      '            <span id=\'' + this.id + 'close\' class="dot " style="background:#ED594A;"></span>\n' +
      '        </div>\n' +
      '<div class=\'col-8 text-left\'><h5>' + this.title + '</h5></div>\n' +
      '\n' +
      '    <div class="content">\n' +
      '        <iframe  class="contentIframe" src="' + this.path + '"></iframe>\n' +
      '    </div>\n' +
      '</div> </div>'
  }
}
let xPos = 25
let yPos = 75

function placeBeside (e) {
  if (parseInt(e.view.style.top.replace('px', '')) + e.height > window.screen.height) {
    yPos = 40
    xPos += e.width / 2
    placeWindow(e)
  }
}

function placeWindow (e) {
  e.view.style.left = xPos + 'px'
  e.view.style.top = yPos + 'px'
  xPos = xPos + 25
  yPos = yPos + 25
  placeBeside(e)
}

function resizeObj (obj) {
  obj.view.style.height = obj.height + 'px'
  obj.view.style.width = obj.width + 'px'
}

function dragElement (elmnt) {
  var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
  if (document.getElementById(elmnt.id + 'header')) {
    /* if present, the header is where you move the DIV from: */
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV: */
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
  }

  function closeDragElement () {
    /* stop moving when mouse button is released: */
    document.onmouseup = null
    document.onmousemove = null
  }
}
