import { useCreateStory } from '../../hooks/setup/useCreateStory'
import { useCreateDescriptiveLocation } from '../../hooks/setup/useCreateDescriptiveLocation'
import { Button } from '../../components/base'
import { useCreatePath } from '../../hooks/setup/useCreatePath'
import { useCreateCharacters } from '../../hooks/setup/useCreateCharacters'
import { useAtom } from 'jotai'
import {
  charactersEntities_atom,
  itemsEntities_atom,
  otherLocations_atom,
  startingLocation_atom,
} from '../../atoms/globalAtoms'
import { Entity } from '@latticexyz/recs'
import { useComponentValue } from '@latticexyz/react'
import React from 'react'
import { useMUD } from '../../MUDContext'
import { useCreateItems } from '../../hooks/setup/useCreateItems'

export const Gametest = () => {
  const createStory = useCreateStory()
  const createDescriptiveLocation = useCreateDescriptiveLocation()
  const createPath = useCreatePath()
  const createCharacters = useCreateCharacters()
  const createItems = useCreateItems()

  const [ startingLocation, setStartingLocation ] = useAtom(startingLocation_atom)
  const [ otherLocation, setOtherLocations ] = useAtom(otherLocations_atom)
  const [ charactersEntities, setCharactersEntities ] = useAtom(charactersEntities_atom)
  const [ itemsEntities, setItemsEntities ] = useAtom(itemsEntities_atom)

  React.useEffect(() => {
    if (createDescriptiveLocation.isSuccess) {
      console.info(createDescriptiveLocation.data)
      setStartingLocation(createDescriptiveLocation.data.startingLocation as Entity)
      setOtherLocations(createDescriptiveLocation.data.toLocations)
    }
  }, [ createDescriptiveLocation.isSuccess ])


  React.useEffect(() => {
    if (createCharacters.isSuccess) {
      console.info(createCharacters.data)
      setCharactersEntities(createCharacters.data)
    }
  }, [ createCharacters.isSuccess ])


  React.useEffect(() => {
    if (createItems.isSuccess) {
      console.info(createItems.data)
      setItemsEntities(createItems.data)
    }
  }, [ createItems.isSuccess ])

  return (
    <div className={'flex flex-col gap-2 p-10'}>
      <div className={'flex gap-5'}>
        <Button onClick={() => createStory.mutate()}>
          Create Story
        </Button>

        <Button onClick={() => {
          if (createStory.isSuccess) {
            console.info(createStory.data)
            createDescriptiveLocation.mutate({
              name: createStory.data.name,
              summary: createStory.data.summary,
            })
          }
        }}
                className={`${!createStory.isSuccess ? 'hidden' : ''}`}
        >
          Create Descriptive
        </Button>

        <Button onClick={() => {
          if (createStory.isSuccess && createDescriptiveLocation.isSuccess) {
            createPath.mutate({
              startingLocation: createDescriptiveLocation.data.startingLocation,
              toLocations: createDescriptiveLocation.data.toLocations,
              story: {
                name: createStory.data.name,
                summary: createStory.data.summary,
              },
            })
          }
        }}
                className={`${!createDescriptiveLocation.isSuccess ? 'hidden' : ''}`}
        >
          Create Path
        </Button>


        <Button onClick={() => {
          if (createStory.isSuccess && createDescriptiveLocation.isSuccess) {
            createCharacters.mutate({
              characters: createDescriptiveLocation.data.descriptiveLocationData.elements.characters,
              startingLocation: createDescriptiveLocation.data.startingLocation,
            })
          }
        }}
                className={`${!createDescriptiveLocation.isSuccess ? 'hidden' : ''}`}
        >
          Create Characters
        </Button>

        <Button onClick={() => {
          if (createStory.isSuccess && createDescriptiveLocation.isSuccess) {
            createItems.mutate({
              items: createDescriptiveLocation.data.descriptiveLocationData.elements.items,
              startingLocation: createDescriptiveLocation.data.startingLocation,
            })
          }
        }}
                className={`${!createDescriptiveLocation.isSuccess ? 'hidden' : ''}`}
        >
          Create Items
        </Button>

      </div>
      <div>
        {
          (startingLocation !== null && otherLocation !== null && charactersEntities !== null && itemsEntities !== null) && (
            <MainContent
              startingLocationEntity={startingLocation}
              otherLocations={otherLocation}
              characters={charactersEntities}
              items={itemsEntities}
            />
          )
        }
      </div>
    </div>
  )
}

const MainContent = ({ startingLocationEntity, otherLocations, characters, items }: {
  startingLocationEntity: Entity,
  otherLocations: Array<Entity>,
  characters: Array<Entity>,
  items: Array<Entity>
}) => {

  const {
    components: {
      NameComponent,
      SummaryComponent,
      ImageComponent,
    },
  } = useMUD()

  const startingLocationName = useComponentValue(NameComponent, startingLocationEntity)
  const startingLocationSummary = useComponentValue(SummaryComponent, startingLocationEntity)
  const startingLocationImage = useComponentValue(ImageComponent, startingLocationEntity)

  const firstLocationName = useComponentValue(NameComponent, otherLocations[0])
  const firstLocationSummary = useComponentValue(SummaryComponent, otherLocations[0])
  const firstLocationImage = useComponentValue(ImageComponent, otherLocations[0])

  const secondLocationName = useComponentValue(NameComponent, otherLocations[1])
  const secondLocationSummary = useComponentValue(SummaryComponent, otherLocations[1])
  const secondLocationImage = useComponentValue(ImageComponent, otherLocations[1])

  const firstCharacterName = useComponentValue(NameComponent, characters[0])
  const firstCharacterSummary = useComponentValue(SummaryComponent, characters[0])
  const firstCharacterImage = useComponentValue(ImageComponent, characters[0])

  const secondCharacterName = useComponentValue(NameComponent, characters[1])
  const secondCharacterSummary = useComponentValue(SummaryComponent, characters[1])
  const secondCharacterImage = useComponentValue(ImageComponent, characters[1])

  const firstItemName = useComponentValue(NameComponent, items[0])
  const firstItemSummary = useComponentValue(SummaryComponent, items[0])
  const firstItemImage = useComponentValue(ImageComponent, items[0])

  const secondItemName = useComponentValue(NameComponent, items[1])
  const secondItemSummary = useComponentValue(SummaryComponent, items[1])
  const secondItemImage = useComponentValue(ImageComponent, items[1])


  return (
    <div className={'flex flex-col gap-2 mt-10'}>
      <div>
        <img className={'aspect-square w-20 rounded-full'}
             src={`src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (1).jpg`} />
      </div>
      <div className={'flex gap-2'}>

        <div className={'p-2'}>
          <h1>{startingLocationName?.value}</h1>
          <img className={'aspect-square rounded-lg'}
               src={`src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg`} />
          <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${startingLocationImage?.value}`} target={"_blank"} rel="noreferrer">${startingLocationImage?.value} 👀</a>
        </div>
        <div className={'p-2'}>
          {startingLocationSummary?.value}
          <div className={'flex flex-col gap-2 p-2'}>
            <h1>Location/s</h1>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg`} />
              <div className={'flex flex-col gap-1'}>
                <p>{firstLocationName?.value}</p>
                <p>{firstLocationSummary?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${firstLocationImage?.value}`} target={"_blank"} rel="noreferrer">{firstLocationImage?.value} 👀</a>
              </div>
            </div>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg`} />
              <div className={'flex flex-col gap-1'}>
                <p>{secondLocationName?.value}</p>
                <p>{secondLocationSummary?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${secondLocationImage?.value}`} target={"_blank"} rel="noreferrer">{secondLocationImage?.value} 👀</a>
              </div>
            </div>
          </div>

          <div className={'flex flex-col gap-2 p-2'}>
            <h1>NPC/s</h1>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/blacksmith.jpeg`} />
              <div className={'flex flex-col gap-1'}>
                <p>{firstCharacterName?.value}</p>
                <p>{firstCharacterSummary?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${firstCharacterImage?.value}`} target={"_blank"} rel="noreferrer">{firstCharacterImage?.value} 👀</a>
              </div>
            </div>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/blacksmith.jpeg`} />
              <div className={'flex flex-col gap-1'}>
                <p>{secondCharacterName?.value}</p>
                <p>{secondCharacterSummary?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${secondCharacterImage?.value}`} target={"_blank"} rel="noreferrer">{secondCharacterImage?.value} 👀</a>
              </div>
            </div>
          </div>

          <div className={'flex flex-col gap-2 p-2'}>
            <h1>Item/s</h1>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/settings.png`} />
              <div className={"flex flex-col gap-1"}>
                <p>{firstItemName?.value}</p>
                <p>{firstItemSummary?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${firstItemImage?.value}`} target={"_blank"} rel="noreferrer">{firstItemImage?.value} 👀</a>
              </div>
            </div>
            <div className={'flex gap-2'}>
              <img className={'aspect-square w-32 rounded-lg'}
                   src={`src/assets/settings.png`} />
              <div className={"flex flex-col gap-1"}>
                <p>{secondItemName?.value}</p>
                <p>{secondItemSummary?.value}</p>
                <p>{secondItemImage?.value}</p>
                <a href={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${secondItemImage?.value}`} target={"_blank"} rel="noreferrer">{secondItemImage?.value} 👀</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
