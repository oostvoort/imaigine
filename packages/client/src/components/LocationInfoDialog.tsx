import React from 'react'
import { Dialog as DialogCore, Button } from './base'
import { useAtomValue } from 'jotai'
import { isLoading_atom, selectedPath_atom } from '../atoms/globalAtoms'
import { useMUD } from '../MUDContext'
import { generateIpfsImageLink } from '../lib/utils'
import useGame from '../hooks/useGame'
import usePlayerTravel from '../hooks/useTravelPlayer'
import { useAtom } from 'jotai/index'

const { Dialog, DialogContent } = DialogCore

type Props = {
  isOpen: boolean
  setOpen: () => void
}

const LocationInfoDialog = ({ isOpen, setOpen }: Props) => {
  const [isLoading, setLoading] = useAtom(isLoading_atom)

  const {
    currentLocation,
  } = useGame()
  const location = useAtomValue(selectedPath_atom)
  const {
    systemCalls: {
      playerTravelPath,
    },
  } = useMUD()

  const playerTravel = usePlayerTravel()


  if (location == null) return <></>


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl">
        <section className="flex flex gap-6">
          <div className="flex-grow-0">
            <img
              src={generateIpfsImageLink(currentLocation.entity == location?.pathLocations?.[0].entity ? location?.pathLocations?.[1]?.image?.value ?? '' : location?.pathLocations?.[0]?.image?.value ?? '')}
              alt={generateIpfsImageLink(currentLocation.entity == location?.pathLocations?.[0].entity ? location?.pathLocations?.[1]?.image?.value ?? '' : location?.pathLocations?.[0]?.image?.value ?? '')}
              className="w-[300px] h-[300px] rounded-lg object-cover" />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-2xl text-primary-foreground font-jost">{location.name.value}</p>
            <p className="text-xl text-foreground leading-relaxed tracking-wide">{location.summary.value}</p>
            <Button onClick={() => {
              setLoading(true)
              playerTravel.mutate({ pathID: location?.entity })
              setOpen()
            }} size="xl" className="mt-auto">Travel to {currentLocation.entity == location?.pathLocations?.[0].entity ? location?.pathLocations?.[1]?.name?.value ?? '' : location?.pathLocations?.[0]?.name?.value ?? ''}</Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default LocationInfoDialog
