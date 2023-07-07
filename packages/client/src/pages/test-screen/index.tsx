import { Button } from '@/components/base/Button'
import usePlayer from '@/hooks/v1/usePlayer'
import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { useMUD } from '@/MUDContext'
import { GeneratePlayerResponse } from '../../../../types'
import useNPCInteraction from '@/hooks/useNPCInteraction'
import { usePlayers } from '@/hooks/v1/usePlayers'
import useQueue from '@/hooks/minigame/useQueue'
import { Entity } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import useBetting from '@/hooks/minigame/useBetting'

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

  const { players } = usePlayers()


  // BATTLE QUEUE TESTING
  const { battleQueue, setQueue, setLocationEntity } = useQueue()

  useEffect(() => {
    setLocationEntity("0x0000000000000000000000000000000000000000000000000000000000000002" as Entity)
  }, [])

  useEffect(() => {
    if (battleQueue) {
      console.log("BATTLE QUEUE: ", battleQueue)
    }
  }, [battleQueue])

  const onCreateBattleQueue = async () => {
    try {
      await setQueue.mutateAsync({
        playerId: "0x0000000000000000000000000000000000000000000000000000000000000005",
        locationId: '0x0000000000000000000000000000000000000000000000000000000000000002',
      })
    } catch (error) {
      console.error(error)
    }
  }
  // BATTLE QUEUE TESTING

  // BATTLE MATCH TESTING
  const { playerId, locationId, setMatch, match } = useBattle()

  useEffect(() => {
      if (match) {
        console.log("BATTLE MATCH: ", match)
      }
  }, [match])

  const onCreateBattle = async () => {
      try {
          await setMatch.mutateAsync({
              playerId: playerId,
              locationId: locationId,
              opponentId: '0x0000000000000000000000000000000000000000000000000000000000000009',
          })
      } catch (error) {
          console.error(error)
      }
  }
  // BATTLE MATCH TESTING

  // BATTLE BETTING START TESTING
  const { OnClickOptions, setBetting, hashOptions } = useBetting()

  const onCreateBetting = async () => {
    await setBetting.mutateAsync({
      playerId: '0x0000000000000000000000000000000000000000000000000000000000000005',
      locationId: '0x0000000000000000000000000000000000000000000000000000000000000002',
      hashOption: hashOptions
    })
  }

  // BATTLE BETTING START TESTING


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
        <button
          onClick={onCreateBattleQueue}
        >
          Start Battle
        </button>
        <button
          onClick={onCreateBattle}
        >
          Start Match
        </button>
        <button
          onClick={() => OnClickOptions("Sword")}
        >
          CHOOSE OPTIONS
        </button>
        <button
          onClick={() => onCreateBetting()}
        >
          BET
        </button>
      </div>
    </div>
  )
}
