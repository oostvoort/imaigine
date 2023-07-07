import { Button } from '@/components/base/Button'
import usePlayer from '@/hooks/v1/usePlayer'
import React from 'react'
import { clsx } from 'clsx'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { useMUD } from '@/MUDContext'
import { GeneratePlayerResponse } from '../../../../types'
import useNPCInteraction from '@/hooks/useNPCInteraction'
import { useMap } from '@/hooks/v1/useMap'

export default function TestScreen() {
  const {
    network: {
      playerEntity
    },
  } = useMUD();


  const { generatePlayer, generatePlayerImage, createPlayer, player } = usePlayer()
  const [ generatedPlayer, setGeneratedPlayer ] = React.useState<GeneratePlayerResponse>({
    locationId: '',
    visualSummary: '',
    ipfsHash: '',
  } as GeneratePlayerResponse)
  const [ generatedImage, setGeneratedImage ] = React.useState<string>('')

  const { interactNPC, createNPCInteraction } = useNPCInteraction()

  const { players } = useMap()

  // console.info({players})
  // console.info({player})

  const npcId = "0x0000000000000000000000000000000000000000000000000000000000000002"

  React.useEffect(() => {
    if (generatePlayer.isSuccess) {
      console.log(generatePlayer.data)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setGeneratedPlayer(generatePlayer.data)
    }
  }, [ generatePlayer.isSuccess ])

  React.useEffect(() => {
    if (generatePlayerImage.isSuccess) {
      console.log(generatePlayerImage?.data?.imageIpfsHash)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setGeneratedImage(generatePlayerImage.data.imageIpfsHash)
    }
  }, [ generatePlayerImage.isSuccess ])

  React.useEffect(() => {
    if (createPlayer.isSuccess) {
      console.log('createdPlayer', player)
    }
  }, [ createPlayer.isSuccess ])

  React.useEffect(() => {
    if (createNPCInteraction.isSuccess) {
      console.log('createNPCInteraction', (createNPCInteraction.data).toNumber())

      if ((createNPCInteraction.data).toNumber() >= 1 && (createNPCInteraction.data).toNumber() <= 4) {
        if (!player.config) throw new Error('No generated Player')
        interactNPC.mutate({
          playerIpfsHash: [`${player.config.value}`],
          npcEntityId: npcId,
          npcIpfsHash: 'QmcNgZR321oGu1QKijDpEbbad9tpxAHRJiqFL7AnvKvJrf',
          playerEntityId: [`${playerEntity}`],
        })
      }

    }
  }, [ createNPCInteraction.isSuccess ])

  React.useEffect(() => {
    if (interactNPC.isSuccess) {
      console.log('interactNPC', interactNPC.data)
    }
  }, [ interactNPC.isSuccess ])


  return (
    <div className={clsx(['flex flex-col gap-8 pa-xl'])}>
      <div className={'flex gap-x-3'}>
        <Button variant={'neutral'} size={'xl'} onClick={() => generatePlayer.mutate({
          'ageGroup': 'young adult',
          'genderIdentity': 'female',
          'race': 'elf',
          'skinColor': 'light',
          'bodyType': 'average',
          'favColor': 'blue',
        })}>
          Generate Player
        </Button>
        <Button variant={'neutral'} size={'xl'} onClick={() => {
          if (!generatePlayer) throw new Error('No Generated Player')
          generatePlayerImage.mutate({ visualSummary: generatedPlayer.visualSummary })
        }}>
          Generate Image
        </Button>
        <Button variant={'neutral'} size={'xl'} onClick={() => {
          if (!generatePlayer) throw new Error('No generated Player')
          if (!generatedImage) throw new Error('No generated image')
          if (!playerEntity) throw new Error("No player entity!")

          createPlayer.mutate({
            "playerId": playerEntity,
            "ipfsHash": generatedPlayer.ipfsHash,
            "imageIpfsHash": generatedImage,
            "locationId": generatedPlayer.locationId
          })
        }}>
          Create Player
        </Button>
        <Button variant={'neutral'} size={'xl'} onClick={() => {
          if (!player.config) throw new Error('No generated Player')
          interactNPC.mutate({
            playerIpfsHash: [`${player.config.value}`],
            npcEntityId: '0x0000000000000000000000000000000000000000000000000000000000000002',
            npcIpfsHash: 'QmcNgZR321oGu1QKijDpEbbad9tpxAHRJiqFL7AnvKvJrf',
            playerEntityId: [`${playerEntity}`]
          })
        }}>
          NPC Interaction
        </Button>
      </div>
      <div className={'flex gap-x-3'}>
        <Button variant={'neutral'} size={'xl'} onClick={() => createNPCInteraction.mutate({
          choiceId: 1,
          npcId: '0x0000000000000000000000000000000000000000000000000000000000000002',
        })}>
          Choice 1
        </Button>
      </div>
      <div className={'flex flex-col'}>
        <p>{JSON.stringify(generatedPlayer)}</p>
        {/*<a href={`${IPFS_URL_PREFIX}/${generatedImage}`} target={'_blank'}>{generatedImage}</a>*/}
      </div>

      <div className={"flex gap-2"}>
        <p>NPC Interaction</p>
        <Button
          onClick={() => {
            createNPCInteraction.mutate({ choiceId: 0, npcId })
            if (!player.config) throw new Error('No generated Player')
            interactNPC.mutate({
              playerIpfsHash: [`${player.config.value}`],
              npcEntityId: npcId,
              npcIpfsHash: 'QmcNgZR321oGu1QKijDpEbbad9tpxAHRJiqFL7AnvKvJrf',
              playerEntityId: [`${playerEntity}`],
            })
          }}
        >
          Enter NPC Interaction
        </Button>
        <Button
          onClick={() => createNPCInteraction.mutate({ choiceId: 1, npcId })}
        >
          Good
        </Button>
        <Button
          onClick={() => createNPCInteraction.mutate({ choiceId: 2, npcId })}
        >
          Evil
        </Button>
        <Button
          onClick={() => createNPCInteraction.mutate({ choiceId: 3, npcId })}
        >
          Neutral
        </Button>
      </div>
    </div>
  )
}
