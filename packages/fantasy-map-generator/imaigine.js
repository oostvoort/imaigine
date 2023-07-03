/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded() {
  // Needed for route finding
  window.Routes.regenerate()

  console.log('Imaigine: hook_onMapLoaded')
  window.parent.postMessage({ cmd: 'FinishedLoadingMap', params: {} })

  // revealCells([ 558, 559, 560, 481,477,476,480,561,638, 637 ])
  console.log('nextTowns', getNextTowns(558))
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

  console.log("Clicked cell: ", i)

  if (grand.id === 'burgIcons') {

    // Get burgLabel element
    const burgElement = document.getElementById(`burgLabel${el.dataset.id}`)

    window.parent.postMessage({
      cmd: 'MapClicked', params: {
        locationId: i,
        name: burgElement.textContent,
      },
    })

    console.log('nextTowns', getNextTowns(i))

    //todo: add guard that will restrict for travel action only
    const travel = window.Routes.findNearestPath(i)
    if (travel) window.Routes.draw(travel)
  }

}


function revealCells(cells) {
  console.log('revealCells', cells)

  const path =
    'M' +
    cells
      .map(c => getPackPolygon(+c))
      .join('M') + 'Z'

  fog('myFogId', path)

}

function hideCells(id) {
  unfog('myFogId')
}


function getNextTowns(cellId) {

  return window.Routes.findNearestBurgs(cellId)
}

function showPlayers(players) {
  console.log('showPlayers', players)
  for (const player of players) {

    // adding player's marker
    const name = player.name
    const icon = name.charAt(0)
    const x = Math.round(pack.cells.p[player.cell][0])
    const y = Math.round(pack.cells.p[player.cell][1])
    const cell = player.cell
    const baseMarker = { type: 'player', icon: icon }
    const marker = Markers.add({ ...baseMarker, x, y, cell })

    // adding player's notes
    const notesSelect = document.getElementById('notesSelect')
    const id = `marker${marker.i}`
    const legend = player.legend
    const note = { id, name, legend }
    notes.push(note)
    notesSelect.options.add(new Option(id, id))

    const markersElement = document.getElementById('markers')
    const rescale = +markersElement.getAttribute('rescale')
    markersElement.insertAdjacentHTML('beforeend', drawMarker(marker, rescale))
  }
}


// from iframe
window.addEventListener('message', ({ data }) => {
  if (data.cmd === 'revealCells') {

    revealCells(data.params.cells)

  } else if (data.cmd === 'showPlayers') {

    showPlayers(data.params.players)

  } else if (data.cmd === 'getNextTowns') {

    getNextTowns(data.params.cellId)

  } else {
    console.log('else', data)
  }

})
