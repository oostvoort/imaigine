import React from 'react'
import { useAtom } from 'jotai'
import { isLoading_atom } from '../atoms/globalAtoms'

export default function useForceRerender() {
  const [ state, setState ] = React.useState(0)
  const [isLoading, setLoading] = useAtom(isLoading_atom)

  console.log('forced', state)
  return () => {
    setLoading(true)
    setState(prev => prev += 1)
    setTimeout(() => {
      setState(prev => prev += 1)
      setLoading(false)
    }, 1000)
  }
}
