import React from 'react'
import useGame from '../../hooks/useGame'
import { useMUD } from '../../MUDContext'
import { Button } from '../../components/base'
import { hexZeroPad } from 'ethers/lib/utils'
import { Entity } from 'types'

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
      leaveInteraction,
      playerTravelPath
    },
    network: {
      playerEntity,
    },
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
    if (!playerEntity) return

    // Get character details and if in an ongoing interaction for API
    const npc = characters.find((character) => character.entity == entityID)
    if (!npc) throw Error(`Unable to find NPC with ID ${entityID}`)

    const ongoingInteraction = interactions
      .find((interaction) => interaction.entity.entity == entityID)
    const otherParticipants = ongoingInteraction ? ongoingInteraction.otherParticipants : []

    await enterInteraction(entityID, {
      mode: "interactable",
      storySummary: story.summary.value,
      location: {
        name: currentLocation.name.value,
        summary: currentLocation.summary.value,
      },
      action: '',
      activeEntity: {
        isAlive: player.alive,
        summary: player.summary.value,
        name: player.name.value,
      },
      logHash: 'QmUmTf999j42nnTYh5hjvzLCuYA3AXPk4FK4LdXexjTXXY',
      otherEntities: [
        {
          name: npc?.name?.value ?? '',
          summary: npc?.summary?.value ?? '',
          isAlive: npc.alive,
        },
        ...otherParticipants.map((participant) => {
          return {
            name: participant.name,
            summary: participant.summary,
            isAlive: participant.alive,
          }
        }),
      ],
    }, [ playerEntity, ...otherParticipants.map(participant => hexZeroPad(participant.entity, 32)) ])
  }

  async function onClickSaveInteractionTest() {
    if (!playerEntity) return
    await saveInteraction({
      mode: "interactable",
      storySummary: story.summary.value,
      location: {
        name: currentLocation.name.value,
        summary: currentLocation.summary.value,
      },
      action: '',
      activeEntity: {
        isAlive: player.alive,
        summary: player.summary.value,
        name: player.name.value,
      },
      logHash: currentInteraction.logHash?.value ?? '',
      otherEntities: [
        {
          name: currentInteraction.entity.name,
          summary: currentInteraction.entity.name,
          isAlive: currentInteraction.entity.alive,
        },
        ...currentInteraction.otherParticipants.map(participant => {
          return {
            name: participant.name,
            summary: participant.summary,
            isAlive: participant.alive,
          }
        }),
      ],
    }, currentInteraction.entity.entity, [ playerEntity, ...currentInteraction.otherParticipants.map(participant => hexZeroPad(participant.entity, 32)) ])
  }

  async function onClickLeaveInteractionTest() {
    if (!playerEntity) return
    await leaveInteraction(currentInteraction.entity.entity, playerEntity)
  }

  async function onClickTravelTest(entityID: string) {
    await playerTravelPath(entityID)
  }

  return (
    <div className={'grid grid-cols-4 gap-4'}>
      <Card title={'DevTools'}>
        <div className={'grid gap-4'}>
          <Button size="xl" disabled={!!story} className={'w-64'}
                  onClick={() => onClickCreateStoryTest()}>CreateStoryTest</Button>
          <Button size="xl" disabled={!story || !!startingLocation} className={'w-64'}
                  onClick={() => onClickCreateStartingLocationTest()}>CreateStartingLocationTest</Button>
          <Button size="xl" disabled={!startingLocation} className={'w-64'}
                  onClick={() => onClickPlayerTest()}>CreatePlayerTest</Button>
          <Button size="xl" disabled={!startingLocation} className={'w-64'}
                  onClick={() => onClickNPCTest()}>CreateNPCTest</Button>
          <Button size="xl" disabled={!startingLocation || !currentInteraction} className={'w-64'}
                  onClick={() => onClickSaveInteractionTest()}>SaveInteractionTest</Button>
          <Button size="xl" disabled={!currentInteraction} className={'w-64'}
                  onClick={() => onClickLeaveInteractionTest()}>LeaveInteractionTest</Button>
        </div>
      </Card>

      <Card title={'Travel'}>
        {paths
          .map(path => {
            return (
              <div key={path.entity}>
                <div>{path.name.value}</div>
                <div>From {path.pathLocations?.[0]?.name?.value ?? ''} to {path.pathLocations?.[1]?.name?.value ?? ''}</div>
                <div className={'flex flex-row gap-x-2'}>
                  <Button size="xl" className={'w-64'}
                          onClick={() => onClickTravelTest(path.entity)}>
                    Travel
                  </Button>
                </div>
              </div>
            )
          })}
      </Card>
      <JSONCard title={'Paths'} data={paths} />
      <JSONCard title={'Current Location'} data={currentLocation} />
      <JSONCard title={'Current Interactions'} data={currentInteraction} />
      <Card title={'Interact'}>
        {characters.map(character =>
          (
            <div>
              {character.name.value}
              <div key={character.entity} className={'flex flex-row gap-x-2'}>
                <Button disabled={currentInteraction} size="xl" className={'w-64'}
                        onClick={() => onClickNPCInteractionTest(character.entity)}>
                  Interact
                </Button>
                <Button size={'xl'}
                        onClick={() => window.open(IPFS_URL_PREFIX + character.image.value, '_blank')}>👀</Button>
              </div>
            </div>
          ))}
      </Card>
      <JSONCard title={'Interactions'} data={interactions} />
      <JSONCard title={'Story'} data={story} />
      <JSONCard title={'Player'} data={player} />
      <JSONCard title={'Other Players'} data={otherPlayers} />
      <JSONCard title={'Starting Location'} data={startingLocation} />
      <JSONCard title={'Locations'} data={locations} />
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
    <div className="shadow-md rounded-lg p-2 max-h-[99vh] overflow-y-auto">
      <div className="font-bold text-xl mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

export default DEV
