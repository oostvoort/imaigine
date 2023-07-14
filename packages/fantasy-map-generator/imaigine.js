/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded() {
  // Needed for route finding
  window.Routes.regenerate()

  console.log('Imaigine: hook_onMapLoaded')
  window.parent.postMessage({ cmd: 'FinishedLoadingMap', params: {} })
}

/**
 * Anything we want to run after the map was clicked.
 */
function hook_onMapClick(el, p) {
  console.log('Imaigine: hook_onMapClick', el, p)
  console.log('pack', pack)

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

function getCellInfo(cellId) {
 return  window.Routes.getCellInfo(cellId)
}

function getToRevealCells(fromCell, exploredCells) {
  // Find the nearest burg from fromCell
  const burg = getNextTown(fromCell, exploredCells) // get the nearest unexplored burg

  if (!burg.cell) return []
  const paths = findNearestPath(fromCell, burg.cell)
 // Combine nearest burg and path, then remove explored cell
 return [...new Set([...paths, ...[burg.cell]].filter(cell => !exploredCells.includes(cell)))]
}
function revealCells(toRevealCells) {
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

function deleteMarkerPlayer(markerId) {
  const element = document.getElementById(`marker${markerId}`);
  const marker = pack.markers.find(({i}) => i === markerId);
  if (!marker || !element) return

  Markers.deleteMarker(marker.i)
  element.remove();
}

function showPlayers(players) {
  let markerIds = []
  for (const player of players) {

    // adding player's marker
    const name = player.name
    const icon = name.charAt(0)

    // check if the cell has burg
    let x = 0
    let y = 0
    if (pack.cells.burg[player.cell] > 0){
      const burgId = pack.cells.burg[player.cell]
      x = Math.round(pack.burgs[burgId].x)
      y = Math.round(pack.burgs[burgId].y)
    } else{
      x = Math.round(pack.cells.p[player.cell][0])
      y = Math.round(pack.cells.p[player.cell][1])
    }

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
    markerIds.push(marker.i)
  }
  return markerIds
}

function getAllBurgs() {
  const locations = []

  for(const burg of pack.burgs){
    if (Object.keys(burg).length !== 0){
      locations.push({
        "cellNumber" : burg.cell,
        "name": burg.name
      })
    }
  }

  return locations
}

function focusMapOnPlayer(cellID, scale, travelling){
  focusOnPlayer(cellID, scale, travelling)
}

// from iframe
window.addEventListener('message', ({ data }) => {
  if (data.cmd === 'unFog') {

    hideCells(data.params.id)

  } else if (data.cmd === 'showPlayers') {

    showPlayers(data.params.players)

  } else if (data.cmd === 'showMyPlayer') {
    let travelling = false
    // Remove old marker if there is
    if (data.params.marker) {
      deleteMarkerPlayer(data.params.marker)
    }
    // Create myPlayer marker
    const id = (showPlayers([data.params.player]))[0]
    // Focus the map on Player's location
    if (data.params.screen === 4){
      travelling = true
    }
    console.log('trave', travelling)
    focusMapOnPlayer(data.params.player.cell, 24, travelling)
    // Send to parent the markerId
    window.parent.postMessage({ cmd: 'PlayerMarkerId', params: {id: id} })
    // Reveal cells
    hideCells('myFogId')
    revealCells(data.params.player.revealedCell)

  } else {
    console.log('else', data)
  }

})
