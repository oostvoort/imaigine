/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded() {
  console.log('Imaigine: hook_onMapLoaded')
  window.parent.postMessage('FinishedLoadingMap')

  // revealCells([ 558, 559, 560, 481,477,476,480,561,638, 637 ])
}

/**
 * Anything we want to run after the map was clicked.
 */
function hook_onMapClick(el, p) {
  console.log('Imaigine: hook_onMapClick', el, p)

  const parent = el.parentElement
  const grand = parent.parentElement
  const great = grand.parentElement


  const i = findCell(p[0], p[1])

  if (grand.id === 'burgIcons') {
    console.log('editor', pack)
    // Get burgLabel element
    const burgElement = document.getElementById(`burgLabel${el.dataset.id}`)

    window.parent.postMessage({
      locationId: i,
      name: burgElement.textContent,
    })
  }
}



function revealCells(cells) {
  console.log('revealCells', cells)

  const path =
      "M" +
      cells
        .map(c => getPackPolygon(+c))
        .join("M") + "Z"

  fog('myFogId', path)

}

function hideCells(id) {
  unfog('myFogId')
}


// from iframe
window.addEventListener('message', ({data}) => {
  if(data.cmd === "revealCells"){
    console.log("revealCells", data)
    revealCells(data.params.cells)
  }else{
    console.log("else", data)

  }

})
