import { useMutation } from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'
import {
  CreatePlayerProps,
  GeneratePlayerImageProps,
  GeneratePlayerImageResponse,
  GeneratePlayerProps,
  GeneratePlayerResponse,
} from '../../../../types'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from '@latticexyz/react'

export default function usePlayer() {
  const {
    components: {
      PlayerComponent,
      ConfigComponent,
      CharacterComponent,
      AliveComponent,
      ImageComponent,
      LocationComponent,
      KarmaPointsComponent,
      TravelComponent
    },

    network: {
      playerEntity
    },
  } = useMUD();

  const player = {
    player: useComponentValue(PlayerComponent, playerEntity),
    config: useComponentValue(ConfigComponent, playerEntity),
    character: useComponentValue(CharacterComponent, playerEntity),
    alive: useComponentValue(AliveComponent, playerEntity),
    image: useComponentValue(ImageComponent, playerEntity),
    location: useComponentValue(LocationComponent, playerEntity),
    karmaPoints: useComponentValue(KarmaPointsComponent, playerEntity),
    travel: useComponentValue(TravelComponent, playerEntity)
  }

  const generatePlayer = useMutation({
    mutationKey: [ 'generate-player' ],
    mutationFn: async (variables: GeneratePlayerProps) => {
      try {
        const response = await fetch(`${SERVER_API}/api/v1/generate-player`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        });

        const data = await response.json()
        return {
          ipfsHash: data.ipfsHash,
          visualSummary: data.visualSummary,
          locationId: data.locationId
        } as GeneratePlayerResponse
      } catch (error) {
        console.error('[generatePlayer]', generatePlayer)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.info('character', data)
      console.info('Done creating character/s')
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const generatePlayerImage = useMutation({
    mutationKey: [ 'generate-image' ],
    mutationFn: async (variables: GeneratePlayerImageProps) => {
      try {
        const response = await fetch(`${SERVER_API}/api/v1/generate-player-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        });

        const data = await response.json()
        return {
          imageIpfsHash: data.imageIpfsHash
        } as GeneratePlayerImageResponse
      } catch (error) {
        console.error('[generatePlayerImage]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.info('character-image', data)
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const createPlayer = useMutation({
    mutationKey: [ 'create-player' ],
    mutationFn: async (variables: CreatePlayerProps) => {
      try {
        await fetch(`${SERVER_API}/api/v1/create-player`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        })
      } catch (error) {
        console.error('[createPlayer]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onError: (err) => {
      console.error(err)
    },
  })

  return { generatePlayer, generatePlayerImage, createPlayer, player }
}
