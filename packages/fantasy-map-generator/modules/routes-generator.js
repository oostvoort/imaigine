window.Routes = (function () {
  const getRoads = function () {
    TIME && console.time('generateMainRoads')
    const cells = pack.cells
    const burgs = pack.burgs.filter(b => b.i && !b.removed)
    const capitals = burgs.filter(b => b.capital).sort((a, b) => a.population - b.population)

    if (capitals.length < 2) return [] // not enough capitals to build main roads
    const paths = [] // array to store path segments

    // Outer loop of the capitals
    for (const b of capitals) {

      // Retrieve potential other capitals to connect to. Feature is the landmass.
      const connect = capitals.filter(c => c.feature === b.feature && c !== b)

      // Inner loop of capitals to connect with
      for (const t of connect) {

        // Find the path to the other capital
        const [ from, exit ] = findLandPath(b.cell, t.cell, true)

        // Generate the road segments needed, and use existing roads if possible.
        // restorePath writes to the cells.roads, so it "remembers"
        // TODO: Check if the segments are only NEW (not generated for other routes)
        const segments = restorePath(b.cell, exit, 'main', from)

        // Push the generated segments onto the paths, so they can be drawn later.
        segments.forEach(s => paths.push(s))
      }
    }

    // add roads to suitability score
    // https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#pack-object-2
    cells.i.forEach(i => (cells.s[i] += cells.road[i] / 2))

    TIME && console.timeEnd('generateMainRoads')
    return paths
  }

  const getTrails = function () {
    TIME && console.time('generateTrails')
    const cells = pack.cells
    const burgs = pack.burgs.filter(b => b.i && !b.removed)

    if (burgs.length < 2) return [] // not enough burgs to build trails

    let paths = [] // array to store path segments
    for (const f of pack.features.filter(f => f.land)) {
      const isle = burgs.filter(b => b.feature === f.i) // burgs on island
      if (isle.length < 2) continue

      isle.forEach(function (b, i) {
        let path = []
        if (!i) {
          // build trail from the first burg on island
          // to the farthest one on the same island or the closest road
          const farthest = d3.scan(isle, (a, c) => (c.y - b.y) ** 2 + (c.x - b.x) ** 2 - ((a.y - b.y) ** 2 + (a.x - b.x) ** 2))
          const to = isle[farthest].cell
          if (cells.road[to]) return
          const [ from, exit ] = findLandPath(b.cell, to, true)
          path = restorePath(b.cell, exit, 'small', from)
        } else {
          // build trail from all other burgs to the closest road on the same island
          if (cells.road[b.cell]) return
          const [ from, exit ] = findLandPath(b.cell, null, true)
          if (exit === null) return
          path = restorePath(b.cell, exit, 'small', from)
        }
        if (path) paths = paths.concat(path)
      })
    }

    TIME && console.timeEnd('generateTrails')
    return paths
  }

  const getSearoutes = function () {
    TIME && console.time('generateSearoutes')
    const { cells, burgs, features } = pack
    const allPorts = burgs.filter(b => b.port > 0 && !b.removed)

    if (!allPorts.length) return []

    const bodies = new Set(allPorts.map(b => b.port)) // water features with ports
    let paths = [] // array to store path segments
    const connected = [] // store cell id of connected burgs

    bodies.forEach(f => {
      const ports = allPorts.filter(b => b.port === f) // all ports on the same feature
      if (!ports.length) return

      if (features[f]?.border) addOverseaRoute(f, ports[0])

      // get inner-map routes
      for (let s = 0; s < ports.length; s++) {
        const source = ports[s].cell
        if (connected[source]) continue

        for (let t = s + 1; t < ports.length; t++) {
          const target = ports[t].cell
          if (connected[target]) continue

          const [ from, exit, passable ] = findOceanPath(target, source, true)
          if (!passable) continue

          const path = restorePath(target, exit, 'ocean', from)
          paths = paths.concat(path)

          connected[source] = 1
          connected[target] = 1
        }
      }
    })

    function addOverseaRoute(f, port) {
      const { x, y, cell: source } = port
      const dist = p => Math.abs(p[0] - x) + Math.abs(p[1] - y)
      const [ x1, y1 ] = [
        [ 0, y ],
        [ x, 0 ],
        [ graphWidth, y ],
        [ x, graphHeight ],
      ].sort((a, b) => dist(a) - dist(b))[0]
      const target = findCell(x1, y1)

      if (cells.f[target] === f && cells.h[target] < 20) {
        const [ from, exit, passable ] = findOceanPath(target, source, true)

        if (passable) {
          const path = restorePath(target, exit, 'ocean', from)
          paths = paths.concat(path)
          last(path).push([ x1, y1 ])
        }
      }
    }

    TIME && console.timeEnd('generateSearoutes')
    return paths
  }

  const draw = function (main, small, water) {
    TIME && console.time('drawRoutes')
    const { cells, burgs } = pack
    const { burg, p } = cells

    const getBurgCoords = b => [ burgs[b].x, burgs[b].y ]
    const getPathPoints = cells => cells.map(i => (Array.isArray(i) ? i : burg[i] ? getBurgCoords(burg[i]) : p[i]))
    const getPath = segment => round(lineGen(getPathPoints(segment)), 1)
    const getPathsHTML = (paths, type) => paths.map((path, i) => `<path id="${type}${i}" d="${getPath(path)}" />`).join('')

    lineGen.curve(d3.curveCatmullRom.alpha(0.1))
    roads.html(getPathsHTML(main, 'road'))
    trails.html(getPathsHTML(small, 'trail'))

    lineGen.curve(d3.curveBundle.beta(1))
    searoutes.html(getPathsHTML(water, 'searoute'))

    TIME && console.timeEnd('drawRoutes')
  }

  const findNearestBurgs = function (cellId) {

    const cells = pack.cells
    // const burgs = pack.burgs.filter(b => b.i && !b.removed)

    const roadType = cells.road[cellId]

    // Bail if the chosen cell is not on a road
    if (!roadType) {
      // TODO it would be nice to travel offroad..
      console.error('For now we don\'t support traveling outside of roads')
      return []
    }

    // Scan main roads
    for (const road of window.Routes.main) {
      let foundCell = false
      let connectedBurgs = [undefined, undefined]

      // Scan cells of main road
      for (let i = 0; i < road.length; i++) {

        // Current cell
        const cell = road[i]

        // Register whether we found the cell (to stop scanning other roads later)
        if(!foundCell) foundCell = (road[i] === cellId)


        if(
          cells.burg[cell] > 0      // this cell is a burg
          && road[i] !== cellId   // and it's not the one we're evaluating
        ){

          if(!foundCell){       // If we have not found the cell yet, it goes on the left
            connectedBurgs[0] = cell
          } else{               // Otherwise, on the right
            connectedBurgs[1] = cell
          }
        }

        if (
          foundCell             // We must have found the cell
          && (connectedBurgs[1] || i === road.length-1) // And the right burg, or reached the end
        ) {
          return connectedBurgs
        }
      }
    }

  }

  const regenerate = function () {
    routes.selectAll('path').remove()
    pack.cells.road = new Uint16Array(pack.cells.i.length)
    pack.cells.crossroad = new Uint16Array(pack.cells.i.length)
    window.Routes.main = getRoads()
    window.Routes.small = getTrails()
    window.Routes.water = getSearoutes()
    draw(window.Routes.main, window.Routes.small, window.Routes.water)
  }

  return { getRoads, getTrails, getSearoutes, draw, regenerate, findNearestBurgs }


  /**
   * Find a land path to a specific cell (exit), to a closest road (toRoad), or to all reachable cells (null, null)
   * @param start
   * @param exit
   * @param toRoad
   * @returns {*[][]|(*[]|*)[]}
   */
  function findLandPath(start, exit = null, toRoad = null) {
    // Get variable for cells
    const cells = pack.cells

    // Instantiate a queue that compares on the .p object property
    const queue = new PriorityQueue({ comparator: (a, b) => a.p - b.p })

    // initialize cost and from
    const cost = [],
      from = []

    // start the queue with the start cell
    queue.queue({ e: start, p: 0 })

    // Process the queue until it's empty
    while (queue.length) {

      // Get the highest priority item from the queue
      const next = queue.dequeue(),
        n = next.e,
        p = next.p

      // If its allowed to stop at an existing road instead of destination
      // and the current cell is a road, we're done and can return
      if (toRoad && cells.road[n]) return [ from, n ]

      // Loop the neighbouring cells of the current
      // https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model#grid-object
      for (const c of cells.c[n]) {

        // The code below evaluates which of the neighbouring cells is the most suitable for a road

        if (cells.h[c] < 20) continue // ignore water cells
        const stateChangeCost = cells.state && cells.state[c] !== cells.state[n] ? 400 : 0 // trails tend to lay within the same state
        const habitability = biomesData.habitability[cells.biome[c]]
        if (!habitability) continue // avoid inhabitable cells (eg. lava, glacier)
        const habitedCost = habitability ? Math.max(100 - habitability, 0) : 400 // routes tend to lay within populated areas
        const heightChangeCost = Math.abs(cells.h[c] - cells.h[n]) * 10 // routes tend to avoid elevation changes
        const heightCost = cells.h[c] > 80 ? cells.h[c] : 0 // routes tend to avoid mountainous areas
        const cellCoast = 10 + stateChangeCost + habitedCost + heightChangeCost + heightCost
        const totalCost = p + (cells.road[c] || cells.burg[c] ? cellCoast / 3 : cellCoast)

        // If the from[c] was already set (we evaluated already) or the cost is higher, continue
        if (from[c] || totalCost >= cost[c]) continue

        // Record this neighbour as a candidate
        from[c] = n

        // If c is the exit cell, we're done
        if (c === exit) return [ from, exit ]

        // Record the current cost so we can compare later
        cost[c] = totalCost

        // Queue this neighbour cell with cost as priority for processing next
        queue.queue({ e: c, p: totalCost })
      } // for neighbouring cells
    }

    // Done, return the intermediate froms and end cell
    return [ from, exit ]
  }


  /**
   * Generate the road segments needed, and use existing roads if possible.
   * @param start starting cell
   * @param end ending cell
   * @param type type of cell ("main", "ocean", "trail"??)
   * @param from array of cells with intermediate starting points (???)
   * @returns {*[]}
   */
  function restorePath(start, end, type, from) {
    // Get variable for cells
    const cells = pack.cells

    // initialize variable to store all segments;
    const path = []

    // Initialize variables to hold segment and cells being processed
    let segment = [],
      current = end,
      prev = end

    const score = type === 'main' ? 5 : 1 // to increase road score at cell

    if (type === 'ocean' || !cells.road[prev]) segment.push(end)
    if (!cells.road[prev]) cells.road[prev] = score

    for (let i = 0, limit = 1000; i < limit; i++) {
      if (!from[current]) break
      current = from[current]

      if (cells.road[current]) {
        if (segment.length) {
          segment.push(current)
          path.push(segment)
          if (segment[0] !== end) {
            cells.road[segment[0]] += score
            cells.crossroad[segment[0]] += score
          }
          if (current !== start) {
            cells.road[current] += score
            cells.crossroad[current] += score
          }
        }
        segment = []
        prev = current
      } else {
        if (prev) segment.push(prev)
        prev = null
        segment.push(current)
      }

      cells.road[current] += score
      if (current === start) break
    }

    if (segment.length > 1) path.push(segment)
    return path
  }

// find water paths
  function findOceanPath(start, exit = null, toRoute = null) {
    const cells = pack.cells,
      temp = grid.cells.temp
    const queue = new PriorityQueue({ comparator: (a, b) => a.p - b.p })
    const cost = [],
      from = []
    queue.queue({ e: start, p: 0 })

    while (queue.length) {
      const next = queue.dequeue(),
        n = next.e,
        p = next.p
      if (toRoute && n !== start && cells.road[n]) return [ from, n, true ]

      for (const c of cells.c[n]) {
        if (c === exit) {
          from[c] = n
          return [ from, exit, true ]
        }
        if (cells.h[c] >= 20) continue // ignore land cells
        if (temp[cells.g[c]] <= -5) continue // ignore cells with term <= -5
        const dist2 = (cells.p[c][1] - cells.p[n][1]) ** 2 + (cells.p[c][0] - cells.p[n][0]) ** 2
        const totalCost = p + (cells.road[c] ? 1 + dist2 / 2 : dist2 + (cells.t[c] ? 1 : 100))

        if (from[c] || totalCost >= cost[c]) continue;
        (from[c] = n), (cost[c] = totalCost)
        queue.queue({ e: c, p: totalCost })
      }
    }
    return [ from, exit, false ]
  }
})
()
