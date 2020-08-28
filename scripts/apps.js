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








  // * EVENTS (Event listeners)




}
window.addEventListener('DOMContentLoaded', init)