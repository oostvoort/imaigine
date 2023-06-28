/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapLoaded (){
  console.log("Imaigine: hook_onMapLoaded")
  window.parent.postMessage("FinishedLoadingMap")

}
/**
 * Anything we want to run after the map was loaded.
 */
function hook_onMapClick (el, p, cellId){
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
