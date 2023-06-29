/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded (){
  console.log("Imaigine: hook_onMapLoaded")
  window.parent.postMessage("FinishedLoadingMap")

  fogCells([558, 559, 560])
}

/**
 * Anything we want to run after the map was clicked.
 */
function hook_onMapClick (el, p){
  console.log("Imaigine: hook_onMapClick", el, p)

  const parent = el.parentElement;
  const grand = parent.parentElement;
  const great = grand.parentElement;


  const i = findCell(p[0], p[1]);

  if (grand.id === "burgIcons") {
    console.log('editor', pack)
    // Get burgLabel element
    const burgElement = document.getElementById(`burgLabel${el.dataset.id}`)

    window.parent.postMessage({
      locationId: i,
      name: burgElement.textContent
    })
  }
}

function fogCells(cells){
  console.log("fogCells", cells)
  const getPathPoints = cells => cells.map(i => (Array.isArray(i) ? i : burg[i] ? getBurgCoords(burg[i]) : p[i]));
  const getPath = segment => round(lineGen(getPathPoints(segment)), 1);
  fog("myFogId", cells)

}

function unfogCells(id){
  unfog("myFogId")
}
