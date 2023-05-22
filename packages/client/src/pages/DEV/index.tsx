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
  } = useGame()

  const {
    systemCalls: { createPlayer, createStory, createStartingLocation },
  } = useMUD()

  async function onClickCreateLocationTest() {
    await createStartingLocation({
      story: {
        name: story.name.value,
        summary: story.summary.value,
      },
    })
  }

  return (
    <div className={'grid grid-cols-4 gap-4'}>
      <Card title={'DevTools'}>
        <Button size="xl" onClick={() => onClickCreateLocationTest()}>CreateLocationTest</Button>
      </Card>

      <JSONCard title={'Story'} data={story} />
      <JSONCard title={'Players'} data={players} />
      <JSONCard title={'Characters'} data={characters} />
      <JSONCard title={'Locations'} data={locations} />
    </div>
  )
}

function JSONText({ data }) {
  return <pre className="whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
      </pre>
}

function JSONCard({ title, data }) {
  return (
    <Card title={title}>
      <JSONText data={data} />
    </Card>
  )
}

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
