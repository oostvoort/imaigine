import { useMutation } from '@tanstack/react-query'
import { IS_MOCK, SERVER_API } from '@/global/constants'
import {
  CreatePlayerProps,
  GeneratePlayerImageProps,
  GeneratePlayerImageResponse,
  GeneratePlayerProps,
  GeneratePlayerResponse,
} from '../../../../types'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from '@latticexyz/react'
import useIpfs from '@/hooks/useIpfs'

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
    id: playerEntity,
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
          body: JSON.stringify({ ...variables, mock: IS_MOCK}),
        });

        const data = await response.json()
        return {
          ipfsHash: data.ipfsHash,
          visualSummary: data.visualSummary,
          locationId: data.locationId,
          cellId: data.cellId
        } as GeneratePlayerResponse
      } catch (error) {
        console.error('[generatePlayer]', generatePlayer)
      }
    },
    retry: 5,
    retryDelay: 1000,
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
          body: JSON.stringify({ ...variables, mock: IS_MOCK}),
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

  const ipfsData = useIpfs<{name: string, description: string}>(player.config?.value ?? '')

  return { generatePlayer, generatePlayerImage, createPlayer, player, ipfsData }
}
