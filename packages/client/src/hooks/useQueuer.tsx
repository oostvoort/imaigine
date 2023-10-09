import React from 'react'

/*
* This function queues any number collection that it will receive.
* It accepts an interval that the setInterval function will based.
* The first index will always get removed every (intervalTime) ms.
*
* @params:
*   intervalTime(optional): the interval time the setInterval will base
*
* @returns:
*   queued: The collection of numbers that are being on queued.
*   currentValue: The first index of the array, also the active state.
*   setQueued: any inputted number to this function will be incremented to the array state
* */
export default function useQueuer(intervalTime = 3000) {
  // State that will consist of queued states, preferrably to set this with enums
  const [queued, setQueued] = React.useState<number[]>([])

  // Once the component that calls this hook is mounted, interval will start in the background
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log('interval shifted')
      // removes the first index
      setQueued(prev => prev.slice(1))
    }, intervalTime)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    queued,
    currentValue: queued[0] ?? null,
    setQueued: (value: number) => setQueued(prev => [...prev, value]),
  }
}
