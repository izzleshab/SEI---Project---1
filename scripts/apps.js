function init() {
  // * ELEMENTS (Variables)(Elements which are displayed in the DOM)

  // * Header Elements
  const grid = document.querySelector('.grid')
  const start = document.querySelector('#start')
  const score = document.querySelector('#score')
  

  // * Grid Elements
  const width = 20
  const gridCellCount = width * width
  const cells = []

  // * Game Elements
  let lastRenderTime = 0
  const snakeSpeed = 4
  const snakeBody = [{ x: 100 }, { x: 101 }, { x: 102 }, { x: 103 }, { x: 104 }, { x: 105 }, { x: 106 }, { x: 107 }]
  let direction = ''
  let oldSnakeBody = NaN
  let gameEnd = false


  // * EXECUTABLES (Functions) 


  function createGrid() {
    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.setAttribute('data-index', i)
      cells.push(cell)
      grid.appendChild(cell)
    }
  }
  
  // * INVOKING FUNCTIONS HERE
  createGrid()
  checkKey()




  function main(currentTime) {
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / snakeSpeed) return
    
    lastRenderTime = currentTime
    
    update()
    draw()
  }
  window.requestAnimationFrame(main)

  function update(){
    updateMovement()
    wallCollision()
    selfCollision()
  }

  function draw(){
    if (gameEnd === false) {
      snakeBody.forEach(segment => {
        let snakeCell = document.querySelector('[data-index="' + segment.x + '"]')
        if (snakeCell !== null){
          snakeCell.innerHTML = 'X'
        }
      }) 
      if (oldSnakeBody !== NaN) {
        let oldSnakeCell = document.querySelector('[data-index="' + oldSnakeBody + '"]')
        if (oldSnakeCell !== null){
          oldSnakeCell.innerHTML = ''
        }
      }
    }
  }

  function updateMovement() {
    if (direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right'){
      oldSnakeBody = snakeBody[0].x
      snakeBody.shift()
    }
    if (direction === 'up'){
      if (snakeBody.length > 0){
        snakeBody.push({x: getHead() - width})
      } else {
        snakeBody.push({x: oldSnakeBody - width})
      }
    }
    if (direction === 'down'){
      if (snakeBody.length > 0){
        snakeBody.push({x: getHead() + width})
      } else {
        snakeBody.push({x: oldSnakeBody + width})
      }
    }
    if (direction === 'left'){
      if (snakeBody.length > 0){
        snakeBody.push({x: getHead() - 1})
      } else {
        snakeBody.push({x: oldSnakeBody - 1})
      }
    }
    if (direction === 'right'){
      if (snakeBody.length > 0){
        snakeBody.push({x: getHead() + 1})
      } else {
        snakeBody.push({x: oldSnakeBody + 1})
      }
    }
  }

  function wallCollision(){
    // left 
    if (direction === 'left' && getHead() % width === (width - 1)) {
      gameEnd = true
    }
    // right
    if (direction === 'right' && getHead() % width === 0) {
      gameEnd = true
    }
    // top
    if (direction === 'up' && getHead() < 0 ) {
      gameEnd = true
    }
    // bottom
    if (direction === 'down' && getHead() > (width * width)) {
      gameEnd = true
    }
  }

  function selfCollision(){
    for (let i = 0; i < snakeBody.length; i++) {
      if (i === snakeBody.length - 1)
        return 
      else if (snakeBody[i].x === getHead())
        gameEnd = true
    }
  }


  function foodCollision(){

  }


  function getHead() {
    return snakeBody[snakeBody.length-1].x
  }

  // * EVENTS (Event listeners)

  function checkKey() {
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 38){
        direction = 'up'
      } else if (e.keyCode === 40){
        direction = 'down'
      } else if (e.keyCode === 37){
        direction = 'left'
      } else if (e.keyCode === 39){
        direction = 'right'
      }
    })  
  }


}
window.addEventListener('DOMContentLoaded', init)