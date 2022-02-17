const quiz = document.addEventListener('DOMContentLoaded', function () {
  let NickName = ''
  let newUser = true

  window.localStorage.removeItem('CurrectPlayer')

  let Game = {
    'id': 1,
    'question': '',
    'nextURL': '',
    'message': ''
  }

  const quizContainer = document.getElementById('quiz')
  const resultsContainer = document.getElementById('results')
  const submitButton = document.getElementById('submit')
  const counterContainer = document.getElementById('counter')
  const doneContainer = document.getElementById('done-container')
  const GameDiv = document.getElementById('GameDiv')
  const userContainer = document.getElementById('UserName-container')

  userContainer.style.display = 'block'
  let startURL = 'https://courselab.lnu.se/quiz/question/1'
  let timer
  let elapsedTime
  let StoredPlayers = []

  document.getElementById('startOver').addEventListener('click', function () {
    doneContainer.style.display = 'none'
    document.getElementById('new-record').style.display = 'none'
    fetchQuestions(startURL)
    GameDiv.style.display = 'block'
    elapsedTime = 0
    timer = setInterval(countTimer, 1000)
  })

  document.getElementById('savePlayerName').addEventListener('click', function () {
    NickName = document.getElementById('nickTxt').value
    userContainer.style.display = 'none'
    fetchQuestions(startURL)
    elapsedTime = 0
    timer = setInterval(countTimer, 1000)
    GameDiv.style.display = 'block'
  })

  function postData (url, data) {
    // Default options are marked with *
    return window.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
        
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(response => response.json()) // parses response to JSON
  }

  function fetchQuestions (getUrl) {
    window.fetch(getUrl).then(function (response) {
      let contentType = response.headers.get('content-type')
      if (contentType.includes('application/json')) {
        return response.json()
      }
      throw new TypeError("Oops, we haven't got JSON!")
    })
      .then(function (myJson) {
        AddQuestion(myJson)
      })
      .catch(function (error) { console.log(error) })
  }

  let nextURL = ''
  function AddQuestion (jObject) {
    try {
      Game = jObject
      const output = []
      const answers = []
      nextURL = Game.nextURL
      if (Game.alternatives) {
        for (document.altIndex in Game.alternatives) {
          answers.push(
            `<label>
                            <input type="radio" name="question${Game.id}" value="${document.altIndex}">
                            ${Game.alternatives[document.altIndex]}
                            </label>`
          )
        }
      } else {
        answers.push(
          `<input type="text" id="answertxtBox" name="question${Game.id}" />`
        )
      }
      output.push(
        `<div >
                    <div class ="question"> ${Game.question} </div>
                     <div class ="answers"> ${answers.join('')} </div>
                    </div>`
      )
      quizContainer.innerHTML = output.join('')
      initializeClock()
    } catch (error) {
      console.log(error.message)
    }
  }

  function submitAnswer () {
    try {
      counterContainer.innerHTML = ''
      clearTimeout(interval)
      let answerValue
      if (document.getElementById('answertxtBox')) {
        answerValue = document.getElementById('answertxtBox').value
      } else {
        const answerContainers = quizContainer.querySelector('.answers')
        const selector = `input:checked`
        answerValue = (answerContainers.querySelector(selector) || {}).value
      }

      postData(nextURL, { answer: answerValue })
        .then(res => {
          Game = res
          console.log(res)
          if (Game.message !== 'Wrong answer') {
            // numCorrectAnswers++
            // console.log(Game.message)
            if (Game.nextURL) {
              fetchQuestions(Game.nextURL)
            } else {
              won()
            }
          } else {
            clearInterval(timer)
            resultsContainer.innerHTML = 'Game Over'
            showResultPage()
          }
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error))
    } catch (error) {
      console.log(error.message)
    }
  }
  submitButton.addEventListener('click', submitAnswer)

  function won () {
    // add padding 0 if minute and second is less then 10
    // display the elapsed time
    resultsContainer.innerHTML = "<b><span class='NickName'>" + NickName + '</span><br/>YOU WON!</b><br/><br/>YOUR SCORE:<br/>' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)

    clearTimeout(timer) // clear previous timeout
    clearInterval(timer) // cancels a timed, repeating action which was previously established

    StoredPlayers = localGet('TopPlayers') ? localGet('TopPlayers') : []
    currentPlayer = { Name: NickName, Score: elapsedTime }
    newUser = Boolean(!localGet('CurrectPlayer'))
    if (StoredPlayers.length === 0) {
      // Empty List
      StoredPlayers.push(currentPlayer)
      localStore('TopPlayers', StoredPlayers)
      localStore('CurrectPlayer', currentPlayer)
      document.getElementById('new-record').style.display = 'block'
    } else {
      // List Exits
      if (newUser) {
        // New User
        if (StoredPlayers.length < 5) {
          // List less than 5
          StoredPlayers.push(currentPlayer)
          StoredPlayers = StoredPlayers.sort((a, b) => a.Score - b.Score)
          localStore('TopPlayers', StoredPlayers)
          localStore('CurrectPlayer', currentPlayer)
          FindNewRecord(currentPlayer)
        } else if (elapsedTime < StoredPlayers[StoredPlayers.length - 1].Score) {
          // Score less than last record
          StoredPlayers.push(currentPlayer)
          StoredPlayers = StoredPlayers.sort((a, b) => a.Score - b.Score)
          StoredPlayers.pop()
          localStore('TopPlayers', StoredPlayers)
          localStore('CurrectPlayer', currentPlayer)
          FindNewRecord(currentPlayer)
        }
      } else {
        // Old User
        let oldScoredPlayer = localGet('CurrectPlayer')
        if (oldScoredPlayer && elapsedTime < oldScoredPlayer.Score) {
          // Same user New score
          StoredPlayers = PlayerScore(StoredPlayers, oldScoredPlayer, elapsedTime)
          localStore('TopPlayers', StoredPlayers)
          localStore('CurrectPlayer', currentPlayer)
          FindNewRecord(currentPlayer)
        }
        // User old score is better
      }
    }
    // show all winner list
    let headerWin = document.createElement('div')
    headerWin.className = 'NickName'
    headerWin.innerHTML = '<br/><br/>Top scores'
    resultsContainer.appendChild(headerWin)
    for (let k = 0; k < StoredPlayers.length; k++) {
      let player = document.createElement('div')
      player.className = 'Player'
      player.innerHTML = '<b>' +
            StoredPlayers[k].Name + '</b>   ' +
            ('0' + Math.floor(parseInt(StoredPlayers[k].Score) / 60)).slice(-2) + ':' + ('0' + parseInt(StoredPlayers[k].Score) % 60).slice(-2)
      resultsContainer.appendChild(player)
    }

    showResultPage()
  }

  function localStore (key, obj) {
    return window.localStorage.setItem(key, JSON.stringify(obj))
  }

  function localGet (key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  function PlayerScore (list, player, newScore) {
    for (let k = 0; k < list.length; k++) {
      if (list[k].Name === player.name && list[k].Score === player.Score) {
        list[k].Score = newScore
        return list.sort((a, b) => b.Score - a.Score)
      }
    }
    return list
  }

  function FindNewRecord (player) {
    let list = localGet('TopPlayers')
    for (let k = 0; k < list.length; k++) {
      if (list[k].Name === player.Name && list[k].Score === player.Score) {
        if (k === 0) {
          document.getElementById('new-record').style.display = 'block'
          break
        }
      }
    }
  }

  let currentPlayer

  let interval
  function initializeClock () {
    clearTimeout(interval)
    let remainingTime = 10
    clearInterval(interval)

    interval = setInterval(function () {
      counterContainer.innerHTML = 'Remaining time: ' + remainingTime + ' seconds'
      remainingTime--

      if (remainingTime === 0) {
        clearInterval(interval)
        resultsContainer.innerHTML = 'Game Over'
        showResultPage()
      }
    }, 1000)
  }
  function showResultPage () {
    quizContainer.innerHTML = ''
    doneContainer.style.display = 'block'
    GameDiv.style.display = 'none'
  }

  let minute
  let second
  function countTimer () {
    elapsedTime++
    // calculate the minutes and seconds from elapsed time
    minute = Math.floor(elapsedTime / 60)
    second = elapsedTime % 60
  }
})

module.exports = quiz
