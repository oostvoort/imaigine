/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded() {
  // Needed for route finding
  window.Routes.regenerate()

  console.log('Imaigine: hook_onMapLoaded')
  window.parent.postMessage({ cmd: 'FinishedLoadingMap', params: {} })

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
    console.log("Clicked burg: ", i)
    if (pack.cells.burg[i] <= 0) return // check if cellId has burg

    // Get burgLabel element
    const burgElement = document.getElementById(`burgLabel${el.dataset.id}`)

    // Post message when Burg clicked
    window.parent.postMessage({
      cmd: 'BurgClicked', params: {
        locationId: i,
        name: burgElement.textContent,
      },
    })
  }

}
function findNearestPath(currenLocation, cellId) {
  return window.Routes.findNearestPath(currenLocation, cellId)
}
function moveMarker(item, index) {
  setTimeout(() => {
    showPlayers([{
      name: "Edward",
      cell: item,
      legend: 'A brave and honorable knight known for his swordsmanship.'
    }])
  }, index * 1000);
}
function revealCells(currentLocation, exploredCells) {
  console.log('player location', currentLocation)
  console.log('explored cells', exploredCells)
  let newExploredCells = [...exploredCells]
  let nearestBurgPath = []
  let toRevealCells = []

  // Find the nearest burg for each cells
  for (const c of exploredCells) {
    const burg = getNextTown(c, exploredCells) // get the nearest unexplored burg
    newExploredCells.push(burg.cell)  // push the nearest unexplored burg into newExploredCells
  }

  // Get the nearest path of nearest burg from player's current location
  for (const burg of newExploredCells) {
    if (burg !== currentLocation) {
      const paths = findNearestPath(currentLocation, burg)
      console.log(burg, paths)
      if (paths.length > 0) {
        nearestBurgPath = [...nearestBurgPath, ...paths[0]]
      }
    }
  }

  // Combined all cells for path reveal
  toRevealCells = [...new Set(newExploredCells.flatMap(cell => [...nearestBurgPath, cell]))];
  console.log('to reveal', toRevealCells)

  const path =
    'M' +
    toRevealCells
      .map(c => getPackPolygon(+c))
      .join('M') + 'Z'

  fog('myFogId', path)
}

function hideCells(id) {
  unfog('myFogId')
}

function getNextTown(cellId, exploredCells) {
  return window.Routes.findNearestBurgs(cellId, exploredCells)
}

function showPlayers(players) {
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

    revealCells(5033, data.params.cells)

  } else if (data.cmd === 'unFog') {

    hideCells(data.params.id)

  } else if (data.cmd === 'showPlayers') {

    showPlayers(data.params.players)

  } else if (data.cmd === 'showExploredCells') {

    hideCells('myFogId')
    revealCells(data.params.player.cell, data.params.cells)

  } else if (data.cmd === 'getNextTowns') {

    getNextTowns(data.params.cellId)

  } else {
    console.log('else', data)
  }

})
