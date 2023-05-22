import React from 'react'
import useGame from '../../hooks/useGame'
import { useMUD } from '../../MUDContext'
import { Button } from '../../components/base'

const IPFS_URL_PREFIX = import.meta.env.VITE_IPFS_URL_PREFIX

function DEV() {
  const {
    player,
    otherPlayers,
    characters,
    locations,
    story,
    startingLocation,
    paths,
    currentLocation,
    currentInteraction,
    interactions,
  } = useGame()

  const {
    systemCalls: {
      createPlayer,
      createStory,
      createStartingLocation,
      createCharacter,
      enterInteraction,
      saveInteraction,
    },
    network: {
      playerEntity
    }
  } = useMUD()

  async function onClickCreateStoryTest() {
    await createStory({
      theme: 'Fantasy',
      races: [ 'elf', 'goblin', 'human', 'nymph', 'dwarf', 'troll' ],
      currency: 'Gold',
    })
  }

  async function onClickCreateStartingLocationTest() {
    await createStartingLocation({
      story: {
        name: story.name.value,
        summary: story.summary.value,
      },
    }, 5)
  }

  async function onClickPlayerTest() {
    await createPlayer({
        characterStats: {
          strength: 'Herculean',
          dexterity: 'Clumsy',
          constitution: 'Frail',
          intelligence: 'Ignorant',
          charisma: 'Foolish',
          wisdom: 'Awkward',
        },
        story: {
          name: story.name.value,
          summary: story.summary.value,
        },
        physicalFeatures: {
          ageGroup: 'Adult',
          genderIdentity: 'Female',
          race: 'Human',
          bodyType: 'Burly',
          height: 'Statuesque',
          hairLength: 'Bald',
          hairType: 'Wavy',
          hairColor: 'Red',
          eyeShape: 'Upturned',
          eyeColor: 'Red',
        },
        location: {
          name: startingLocation.name.value,
          summary: startingLocation.summary.value,
        },
        characterStory: {
          favColor: 'green',
        },
      }
      , startingLocation.entity)
  }

  async function onClickNPCTest() {
    await createCharacter({
        characterStats: {
          strength: 'Feeble',
          dexterity: 'Graceful',
          constitution: 'Sturdy',
          intelligence: 'Average',
          charisma: 'Foolish',
          wisdom: 'Charming',
        },
        story: {
          name: story.name.value,
          summary: story.summary.value,
        },
        location: {
          name: startingLocation.name.value,
          summary: startingLocation.summary.value,
        },
      }
      , startingLocation.entity)
  }


  async function onClickNPCInteractionTest(entityID: string) {
    await enterInteraction(entityID)
  }

  // async function onClickSaveInteractionTest() {
  //   await saveInteraction({
  //     location: {
  //       name: currentLocation.name.value,
  //       summary: currentLocation.summary.value,
  //     },
  //     action: "",
  //     activeEntity: playerEntity,
  //     logHash: "QmUmTf999j42nnTYh5hjvzLCuYA3AXPk4FK4LdXexjTXXY",
  //     otherEntities: [
  //       {
  //         name: currentInteraction.entity.name,
  //         summary: currentInteraction.entity.name,
  //         isAlive: currentInteraction.entity.alive
  //       }
  //     ]
  //   })
  // }

  return (
    <div className={'grid grid-cols-4 gap-4'}>
      <Card title={'DevTools'}>
        <div className={'grid gap-4'}>
          <Button size="xl" disabled={!!story} className={'w-64'}
                  onClick={() => onClickCreateStoryTest()}>CreateStoryTest</Button>
          <Button size="xl" disabled={!story} className={'w-64'}
                  onClick={() => onClickCreateStartingLocationTest()}>CreateStartingLocationTest</Button>
          <Button size="xl" disabled={!startingLocation} className={'w-64'}
                  onClick={() => onClickPlayerTest()}>CreatePlayerTest</Button>
          <Button size="xl" disabled={!startingLocation} className={'w-64'}
                  onClick={() => onClickNPCTest()}>CreateNPCTest</Button>
          <Button size="xl" disabled={!startingLocation} className={'w-64'}
                  onClick={() => onClickSaveInteractionTest()}>SaveInteractionTest</Button>
        </div>
      </Card>

      <JSONCard title={'Current Interactions'} data={currentInteraction} />
      <JSONCard title={'Interactions'} data={interactions} />
      <JSONCard title={'Story'} data={story} />
      <JSONCard title={'Player'} data={player} />
      <Card title={'NPCs'}>
        {characters.map(character => {

          return (
            <div key={character.entity} className={'flex flex-row gap-x-2'}>
              <Button size="xl" className={'w-64'} onClick={() => onClickNPCInteractionTest(character.entity)}>
                {character.name.value} {character.entity}
              </Button>
              <Button size={'xl'}
                      onClick={() => window.open(IPFS_URL_PREFIX + character.image.value, '_blank')}>👀</Button>
            </div>
          )
        })}

      </Card>
      <JSONCard title={'Current Location'} data={currentLocation} />
      <JSONCard title={'Other Players'} data={otherPlayers} />
      <JSONCard title={'Starting Location'} data={startingLocation} />
      <JSONCard title={'Locations'} data={locations} />
      <JSONCard title={'Paths'} data={paths} />
    </div>
  )
}

// 😂
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function JSONText({ data }) {
  return <pre className="whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
      </pre>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function JSONCard({ title, data }) {
  return (
    <Card title={title}>
      <JSONText data={data} />
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function Card({ title, children }) {
  return (
    <div className="shadow-md rounded-lg p-4">
      <div className="font-bold text-xl mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

export default DEV
