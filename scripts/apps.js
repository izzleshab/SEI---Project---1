function init() {
  // * ELEMENTS (Variables)(Elements which are displayed in the DOM)

  // * Header Elements
  const grid = document.querySelector('.grid') // Calls grid div from HTML
  const score = document.querySelector('.score') // Calls score id from HTML
  const header = document.querySelector('.header-score')
  header.innerHTML = 'CURRENT SCORE = ' // Current Score
  const playAgain = document.querySelector('.play-again')
  playAgain.style.display = 'none' // Hides the button until game over

  // * Grid Elements
  const width = 20 // This is actually width and height - kept naming convention consistent with the whack 'em all tutorial.
  const gridCellCount = width * width // This is actually width * height.
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
  const hitSound = document.getElementById('hit-sound')
  const playAgainSound = document.getElementById('play-again-audio')
  
  
  // * INVOKING FUNCTIONS HERE
  createGrid()
  checkKey() // Event that listens for keypress on arrow keys.
  generateFoodPosition()

  
  
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
    if (gameEnd === false) {
      update()
      draw() 
    } else {
      playAgain.style.display = 'block'
      header.innerHTML = 'GAME OVER! YOUR SCORE: '
    }
  }
  window.requestAnimationFrame(main)

  // Every game update is controlled by this function - updates the snakes position, food position, checks for collisions and checks for game end state. This is the heart and soul of the game.
  function update(){ // We need to update the movement before we do collision checks. 
    updateMovement()
    wallCollision() // Checks if we hit a wall. 
    selfCollision() // Checks if the snake hits itself. 
    foodInGameCollision() // Checks if the snake hits food.
  }


  // The job of the draw function is explicitly to draw the contents of the function. Draw functions should not contain any game logic. 
  function draw(){ 
    if (gameEnd === false) {
      snakeBody.forEach(segment => {
        const snakeCell = document.querySelector('[data-index="' + segment.x + '"]')
        if (snakeCell !== null) {
          snakeCell.style.backgroundColor = 'green'
        }
      }) 
      if (oldSnakeBody !== NaN) { // prevents blacking out grid elements before snake starts moving.
        const oldSnakeCell = document.querySelector('[data-index="' + oldSnakeBody + '"]')
        if (oldSnakeCell !== null) { //This fixed a bug where the food disappeared.
          oldSnakeCell.style.backgroundColor = 'black'
        }
      }
      if (foodObject !== -1) { //Should never be -1 unless update() cannot find a suitable location to draw food.
        const foodCell = document.querySelector('[data-index="' + foodObject + '"]')
        foodCell.style.backgroundColor = 'orange'
      } 
    } 
  }

  // Uses checkKey() direction to move the snakeBody. 
  // Removes the first element of the array and shifts it to the last element of the array with updated direction/movement.
  function updateMovement() { 
    if (direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right'){ // If any movement is happening: -
      if (snakeGrow === true) { // If the snake is growing - we do not want to remove the tail. 
        oldSnakeBody = NaN
        snakeGrow = false  
      } else { // Otherwise, remove the tail. 
        oldSnakeBody = snakeBody[0].x // Keep track of the old position, to recolour the tail. 
        snakeBody.shift()
      }
    }
    if (direction === 'up'){
      if (snakeBody.length > 0){ // If the default snake size was 1, and tail removed, use oldSnakeBody for head and its' movement.
        snakeBody.push({ x: getHead() - width }) // - width used here for up direction, as width is 20, -20 is one row division upwards.
      } else {
        snakeBody.push({ x: oldSnakeBody - width })
      }
    }
    if (direction === 'down'){
      if (snakeBody.length > 0){ 
        snakeBody.push({ x: getHead() + width }) // + width used here for down direction, as width is 20, +20 is one row division downwards.
      } else {
        snakeBody.push({ x: oldSnakeBody + width })
      }
    }
    if (direction === 'left'){
      if (snakeBody.length > 0){
        snakeBody.push({ x: getHead() - 1 }) // Divs are labelled '1, 2, 3' etc, so -1 moves snake in the negative direction (left).
      } else {
        snakeBody.push({ x: oldSnakeBody - 1 })
      }
    }
    if (direction === 'right'){
      if (snakeBody.length > 0){
        snakeBody.push({ x: getHead() + 1 }) // +1 moves snakes in the positive direction (right).
      } else {
        snakeBody.push({ x: oldSnakeBody + 1 })
      }
    }
  }

  function wallCollision(){ // Checks if we hit a wall.
    // left 
    //If the head position is at the FAR right (19) after moving left - the head has collided with a wall in its movement
    if (direction === 'left' && getHead() % width === (width - 1)) { // As width is 20, when head is at the far right (19), the next square it fills is the first one on the far left (20). So, when the head reaches position (19), collision must be detected when (20 - 1) is fulfilled, thus, the head will collide at position (19, 39, 59 etc) as any far left position (20 - 1, 40 -1, 60 - 1) will always return a collision at 19 when a multiple of 20 (20, 40, 60) has 1 square subtracted from it.
      gameEnd = true
    }
    if (getHead() === -1){// Fixed a bug where the snake would pass through the top left square as its' value was (-1) and not (19) bypassing the modulus.
      gameEnd = true
    }
    // right
    // If the head position is at the FAR left (0) after moving right - the head has collided with a wall in its movement
    // to determine far left, you modulus the width with remainder of 0
    // to determine far right you modulus the width with remainder of the width minus 1
    // in our case this would be 19
    if (direction === 'right' && getHead() % width === 0) {
      gameEnd = true
    }
    // top
    // If getHead is <0 a wall has been hit and the game ends.
    if (direction === 'up' && getHead() < 0 ) {
      gameEnd = true
    }
    // bottom 
    // If the value of getHead >= 400, a wall has been hit and the game ends.
    if (direction === 'down' && getHead() >= (width * width)) {
      gameEnd = true
    }
  }

  function selfCollision(){ // X is snake position, for loop goes through every part of the snake, checking if any part of the snake is equal to the head but not if head is equal to head.
    for (let i = 0; i < snakeBody.length; i++) {
      if (i === snakeBody.length - 1) // Checks if i value is equal to head. 
        return 
      else if (snakeBody[i].x === getHead()) // Checks if snakeBody is equal to head value.
        gameEnd = true
    }
  }

  // This method is used both at the starting initialisation and during the game. 
  function generateFoodPosition() {
    while (foodCollision() === true || foodObject === -1) { // While loop prevents food drawing ontop of snake. foodObject === -1 gets us into the loop for the start of the game.
      foodObject = Math.floor(Math.random() * (width * width)) 
    }
  } // If the food spawns on the snake, or at -1, generate a random position for the food between 0 and 400.

  // Checks if snake head is = to food position, if yes, collision is true, therefore, new food position generated.
  function foodCollision() { 
    let collision = false
    snakeBody.forEach(segment => {
      if (segment.x === foodObject) {
        collision = true
      }
    })
    return collision
  }


  // If food collision is true, a series of events will occur.
  function foodInGameCollision() {
    if (foodCollision() === true) {
      // Plays sound on food collision
      hitSound.src = './sounds/Hit.wav'
      hitSound.play()
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



  function getHead() {
    return snakeBody[snakeBody.length-1].x // Returns current cell number for the snake head.
  }

  // * EVENTS (Event listeners)

  // Activates movement on key press.
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