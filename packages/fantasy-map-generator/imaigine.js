/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded() {
  console.log('Imaigine: hook_onMapLoaded')
  window.parent.postMessage('FinishedLoadingMap')

  // fogCells([ 558, 559, 560 ])
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



function fogCells(cells) {
  console.log('fogCells', cells)

  const path =
      "M" +
      cells
        .map(c => getPackPolygon(+c))
        .join("M") + "Z"

  fog('myFogId', path)

}

function unfogCells(id) {
  unfog('myFogId')
}


// from iframe
window.addEventListener('message', ({data}) => {
  if(data.cmd === "fog"){
    console.log("fog", data)
    fogCells(data.params.cells)
  }else{
    console.log("else", data)

  }

})
