function init() {
  // * ELEMENTS (Variables)(Elements which are displayed in the DOM)

  // * Header Elements
  const grid = document.querySelector('.grid') // Calls grid div from HTML
  let score = document.querySelector('#score') // Calls score id from HTML
  

  // * Grid Elements
  const width = 20 
  const gridCellCount = width * width
  const cells = []

  // * Game Elements
  let lastRenderTime = 0 // 
  let snakeSpeed = 10
  const snakeBody = [{ x: 100 }, { x: 101 }, { x: 102 }]
  let direction = ''
  let oldSnakeBody = NaN
  let gameEnd = false
  let foodObject = -1
  let snakeGrow = false 


  
  
  // * INVOKING FUNCTIONS HERE
  createGrid()
  checkKey()
  generateFoodPosition()
  stopScroll()
  
  
  // * EXECUTABLES (Functions) 

  // Function which creates the grid or 'gameboard' for the game. 
  // Used example from Whack 'em all tutorial - could be improved in future by using a 2-d array, where a row + column are defined within a for loop.
  //columns = 20
  // rows = 20
  // for (let i=0; i<columns; i++){
  //     for (let j=0; j<rows; j++){
  //         //add new cell div at poisition i,j
  //     }
  // }
  // grid = [column, row]

  function createGrid() {
    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.setAttribute('data-index', i)
      cells.push(cell)
      grid.appendChild(cell)
    }
  }
  
  // Main game loop, contains the infinite refresh loop for the game, the speed for the snake, the update function and the draw function for the game. Found from Web Dev Simplified youtube video. 
  function main(currentTime) {
    window.requestAnimationFrame(main) // lines 58-65 could also be a while loop (set interval).
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000 // 59 + 60 are responsible for the draw speed and snake speed of the game.
    if (secondsSinceLastRender < 1 / snakeSpeed) return
    lastRenderTime = currentTime 
    update()
    draw() 
  }
  window.requestAnimationFrame(main)

  // Every game update is controlled by this function - updates the snakes position, food position, checks for collisions and checks for game end state. This is the heart and soul of the game.
  function update(){
    updateMovement()
    wallCollision()
    selfCollision()
    foodInGameCollision()
  }


  // The job of the draw function is explicitly to draw the contents of the function. Draw functions should not contain any game logic. 
  function draw(){
    if (gameEnd === false) { 
      snakeBody.forEach(segment => {
        let snakeCell = document.querySelector('[data-index="' + segment.x + '"]')
        snakeCell.style.backgroundColor = 'green'
      }) 
      if (oldSnakeBody !== NaN) {
        let oldSnakeCell = document.querySelector('[data-index="' + oldSnakeBody + '"]')
        if (oldSnakeCell !== null) {
          oldSnakeCell.style.backgroundColor = 'black'
        }
      }
      if (foodObject !== -1) {
        let foodCell = document.querySelector('[data-index="' + foodObject + '"]')
        foodCell.style.backgroundColor = 'yellow'
      } 
    } else {
      // End game screen
    }
  }

  // 
  function updateMovement() {
    if (direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right'){
      if (snakeGrow === true) {
        oldSnakeBody = NaN
        snakeGrow = false  
      } else { 
        oldSnakeBody = snakeBody[0].x
        snakeBody.shift()
      }
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

  function generateFoodPosition() {
    while (foodCollision() === true || foodObject === -1) {
      foodObject = Math.floor(Math.random() * (width * width))
    }
  }


  function foodCollision(){
    let collision = false
    snakeBody.forEach(segment => {
      if (segment.x === foodObject) {
        collision = true
      }
    })
    return collision
  }

  function foodInGameCollision() {
    if (foodCollision() === true) {
      // Point + 1 
      score.innerHTML++
      // increase snake speed
      snakeSpeed = snakeSpeed + 1
      // increase snake size
      snakeGrow = true 
      // randomise new food position
      generateFoodPosition()
      
    }
  }

  function stopScroll() {
    window.scrollTo(0, 0)
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