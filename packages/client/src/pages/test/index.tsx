import React from 'react'
import { useCreateStory } from '../../hooks/useSetup/useCreateStory'
import { Button } from '../../components/base'
import { useCreateDescriptiveLocation } from '../../hooks/useSetup/useCreateDescriptiveLocation'
import useGame from '../../hooks/useGame'
import { useCreatePaths } from '../../hooks/useSetup/useCreatePaths'
import { useCreateCharacter } from '../../hooks/useSetup/useCreateCharacter'
import { useCreateItem } from '../../hooks/useSetup/useCreateItem'

export const Test = () => {
  const createStory = useCreateStory()
  const createDescriptiveLocation = useCreateDescriptiveLocation()
  const createPath = useCreatePaths()
  const createCharacter = useCreateCharacter()
  const createItem = useCreateItem()

  const [ createdStory, setStory ] = React.useState<any>()
  const [ descriptiveLocation, setDescriptiveLocation ] = React.useState<any>()


  const {
    story,
  } = useGame()


  React.useEffect(() => {
    if (createStory.isSuccess) {
      setStory(createStory.data)
    }
  }, [ createStory.isSuccess ])


  React.useEffect(() => {
    if (createDescriptiveLocation.isSuccess) {
      console.info(createDescriptiveLocation.data)
      setDescriptiveLocation(createDescriptiveLocation.data)
    }
  }, [ createDescriptiveLocation.isSuccess])

  return (
    <div className={'p-20 flex flex-col gap-2'}>
      <div className={'flex gap-2'}>
        <Button onClick={() => createStory.mutate()}>
          Create Story
        </Button>
        <Button
          onClick={() => {
            createDescriptiveLocation.mutate(
              story ? {
                name: story.name,
                summary: story.summary,
              } : {
                name: createdStory.name,
                summary: createdStory.name,
              },
            )
          }}
        >
          Create Descriptive Location
        </Button>
        <Button
          onClick={() => {
            createPath.mutate({
              startingLocation: descriptiveLocation.startingLocation,
              toLocations: descriptiveLocation.toLocations,
              story: story
            })
          }}
        >
          Create Path
        </Button>
        <Button
          onClick={() => {
            createCharacter.mutate({
              characters: descriptiveLocation.descriptiveLocationData.elements.characters,
              startingLocation: descriptiveLocation.startingLocation
            })
          }}
        >
        Create Characters
        </Button>
        <Button
          onClick={() => {
            createItem.mutate({
              items: descriptiveLocation.descriptiveLocationData.elements.items,
              startingLocation: descriptiveLocation.startingLocation
            })
          }}
        >
         Create Items
        </Button>
      </div>
      <div className={'flex gap-2'}>
        <div>
          {JSON.stringify(createdStory)}
        </div>
        <div>
          {JSON.stringify(descriptiveLocation)}
        </div>
      </div>
    </div>
  )
}
