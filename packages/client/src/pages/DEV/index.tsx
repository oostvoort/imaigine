import React from 'react'
import useGame from '../../hooks/useGame'
import { useMUD } from '../../MUDContext'
import { Button } from '../../components/base'

function DEV() {
  const {
    players,
    characters,
    locations,
    story,
    startingLocation,
  } = useGame()

  const {
    systemCalls: { createPlayer, createStory, createStartingLocation },
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
          genderIdentity: 'Male',
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
        </div>
      </Card>

      <JSONCard title={'Story'} data={story} />
      <JSONCard title={'Players'} data={players} />
      <JSONCard title={'Characters'} data={characters} />
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
    <div className="shadow-md rounded-lg p-4">
      <div className="font-bold text-xl mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

export default DEV
