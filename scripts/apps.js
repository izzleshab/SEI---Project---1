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
  const snakeSpeed = 2
  const snakeBody = [{ x: 100 }]
  let direction = ''
  let oldSnakeBody


  // * EXECUTABLES (Functions) 


  function createGrid() {
    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.setAttribute('data-index', i)
      cells.push(cell)
      grid.appendChild(cell)
    }
  }
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
    
    if (direction === 'up'){
      oldSnakeBody = snakeBody[0].x
      snakeBody.shift()
      if (snakeBody.length > 0){
        snakeBody.push({x: snakeBody[snakeBody.length-1] - width})
      } else {
        snakeBody.push({x: oldSnakeBody - width})
      }
    }
    if (direction === 'down'){
      oldSnakeBody = snakeBody[0].x
      snakeBody.shift()
      if (snakeBody.length > 0){
        snakeBody.push({x: snakeBody[snakeBody.length-1] + width})
      } else {
        snakeBody.push({x: oldSnakeBody + width})
      }
    }
    if (direction === 'left'){
      oldSnakeBody = snakeBody[0].x
      snakeBody.shift()
      if (snakeBody.length > 0){
        snakeBody.push({x: snakeBody[snakeBody.length-1] - 1})
      } else {
        snakeBody.push({x: oldSnakeBody - 1})
      }
    }
    if (direction === 'right'){
      oldSnakeBody = snakeBody[0].x
      snakeBody.shift()
      if (snakeBody.length > 0){
        snakeBody.push({x: snakeBody[snakeBody.length-1] + 1})
      } else {
        snakeBody.push({x: oldSnakeBody + 1})
      }
    }
    
  }

  
  

  function draw(){
    snakeBody.forEach(segment => {
      // const snakeElement = document.createElement('div')
      // snakeElement.style.gridRowStart = segment.x
      // snakeElement.classList.add('snake')
      // document.querySelector('[data-index="' + segment.x + '"]').classList.add('snake')
      let snakeCell = document.querySelector('[data-index="' + segment.x + '"]')
      snakeCell.innerHTML = 'X'
    })
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