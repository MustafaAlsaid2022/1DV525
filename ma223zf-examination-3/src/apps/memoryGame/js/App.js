import { Menu } from './Menu.js'

const menu = new Menu()
const gRow = window.localStorage.getItem('memoryGame_rowSize') || 2
const gCol = window.localStorage.getItem('memoryGame_columnSize') || 2
const section = document.querySelector('section')

function makeCards (rows, cols) {
  let j = 0
  for (let i = 0; i < (rows * cols); i++) {
    const card = document.createElement('div')
    card.setAttribute('data-name', `${(j + 1) % (rows * cols)}.png`)
    card.classList.add('memory-card')
    card.style.width = `calc(${100 / cols}% - 10px)`
    card.style.height = `calc(${100 / rows}% - 10px)`
    const frontImage = document.createElement('img')
    frontImage.setAttribute('src', `img/${(j + 1) % (rows * cols)}.png`)
    frontImage.classList.add('front-face')

    const backImage = document.createElement('img')
    backImage.setAttribute('src', 'img/0.svg')
    backImage.classList.add('back-face')
    card.appendChild(backImage)
    card.appendChild(frontImage)
    section.appendChild(card)

    j++
    if (j === (rows * cols / 2)) { j = 0 }
  }
  const cards = document.querySelectorAll('.memory-card')
  return cards
};

const cards = makeCards(gRow, gCol)
let hasFlippedCard = false
let lock = false
let firstCard
let secondCard

function flipCard () {
  if (lock) return
  this.classList.add('flip')
  if (!hasFlippedCard) {
    hasFlippedCard = true
    firstCard = this
    return
  }
  hasFlippedCard = false
  secondCard = this
  isMatching()
}

cards.forEach(card => {
  card.addEventListener('click', flipCard)
})

function isMatching () {
  const isEqual = firstCard.dataset.name === secondCard.dataset.name
  isEqual ? disableCards() : unflipCards()
}

function disableCards () {
  firstCard.removeEventListener('click', firstCard)
  secondCard.removeEventListener('click', secondCard)
}

function unflipCards () {
  lock = true
  setTimeout(() => {
    firstCard.classList.remove('flip')
    secondCard.classList.remove('flip')
    lock = false
  }, 1000)
}

(function shuffle () {
  cards.forEach(card => {
    const random = Math.floor(Math.random() * (gRow * gCol))
    card.style.order = random
  })
})()

function toggleMenu () {
  if (menu._modal.style.display === 'none') {
    menu._modal.style.display = 'block'
  } else {
    menu._modal.style.display = 'none'
  }
}

function changeGameSize () {
  const select = document.getElementById('gameSizeOption')
  if (select.selectedIndex !== 0) {
    const size = select.options[select.selectedIndex].value
    window.localStorage.setItem('memoryGame_rowSize', size.split('x')[0])
    window.localStorage.setItem('memoryGame_columnSize', size.split('x')[1])
    makeCards(gRow, gCol)
    window.location.reload()
  }
}

document.getElementById('changeGameSizeButton').addEventListener('click', changeGameSize)

menu._menuButton.addEventListener('click', toggleMenu)
window.onclick = function (event) {
  if (event.target === menu._modal) {
    menu._modal.style.display = 'none'
  }
}
