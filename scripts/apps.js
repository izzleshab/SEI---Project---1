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

  function main(currentTime) {
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / snakeSpeed) return
    
    lastRenderTime = currentTime
    
    update()
    draw(grid)
  }
  window.requestAnimationFrame(main)


  function update(){
  }

  
  

  function draw(grid){
    snakeBody.forEach(segment => {
      // const snakeElement = document.createElement('div')
      // snakeElement.style.gridRowStart = segment.x
      // snakeElement.classList.add('snake')
      // document.querySelector('[data-index="' + segment.x + '"]').classList.add('snake')
      let snakeCell = document.querySelector('[data-index="' + segment.x + '"]')
      snakeCell.innerHTML = 'X'
      snakeCell.
    })
  }

  






  // * EVENTS (Event listeners)




}
window.addEventListener('DOMContentLoaded', init)