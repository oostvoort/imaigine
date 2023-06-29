import { Button } from '@/components/base/Button'
import usePlayer from '@/hooks/v1/usePlayer'
import React from 'react'
import { GeneratePlayerResponse } from '../../../../types'
import { clsx } from 'clsx'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { useMUD } from '@/MUDContext'

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

  React.useEffect(() => {
    if (generatePlayer.isSuccess) {
      console.log(generatePlayer.data)
      setGeneratedPlayer(generatePlayer.data)
    }
  }, [ generatePlayer.isSuccess ])

  React.useEffect(() => {
    if (generatePlayerImage.isSuccess) {
      console.log(generatePlayerImage?.data?.imageIpfsHash)
      setGeneratedImage(generatePlayerImage.data.imageIpfsHash)
    }
  }, [ generatePlayerImage.isSuccess ])

  React.useEffect(() => {
    if (createPlayer.isSuccess) {
      console.log('createdPlayer', player)
    }
  }, [ createPlayer.isSuccess ])

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
      </div>
      <div className={'flex flex-col'}>
        <p>{JSON.stringify(generatedPlayer)}</p>
        <a href={`${IPFS_URL_PREFIX}/${generatedImage}`} target={'_blank'}>{generatedImage}</a>
      </div>
    </div>
  )
}
