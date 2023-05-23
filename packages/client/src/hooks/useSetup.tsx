import { useMutation } from '@tanstack/react-query'
import { useMUD } from '../MUDContext'
import useGame from './useGame'

export default function useSetup() {
  const {
    systemCalls: {
      createStory,
      createStartingLocation,
      createPlayer
    }
  } = useMUD()

  const {
    story,
    startingLocation,
    player
  } = useGame()

  const createNPCMutate = useMutation({
    mutationKey: ['setup-npc', story],
    mutationFn: async (variables: any) => {
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
            name: variables.story.name,
            summary: variables.story.summary,
          },
          location: {
            name: variables.startingLocation.name,
            summary: variables.startingLocation.summary,
          },
        }
        , variables.startingLocation.entity)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data) => {
      createStartingLocationMutate.mutate(data)
    }
  })


  const createPlayerMutate = useMutation({
    mutationKey: ['setup-player', startingLocation],
    mutationFn: async (variables: any) => {
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
            name: variables.story.name,
            summary: variables.story.summary,
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
            name: variables.startingLocation.name,
            summary: variables.startingLocation.summary,
          },
          characterStory: {
            favColor: 'green',
          },
        }
        , variables.startingLocation.entity)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async () => {
      console.log('player created!')
    },
    onError: (err) => {
      console.error(err)
    }
  })


  const createStartingLocationMutate = useMutation({
    mutationKey: ['setup-starting-location', story],
    mutationFn: async (variables: any) => {
      console.log('variables inside starting location:' ,)
      return await createStartingLocation({
        story: {
          name: variables?.name,
          summary: variables?.summary,
      },
      })
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.log('onsuccess of starting location', { data })
      createPlayerMutate.mutate(data)
      createNPCMutate.mutate(data)
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const createStoryMutate = useMutation({
    mutationKey: ['setup-story', story],
    mutationFn: async () => {
      if (story) return story
      return await createStory({
        theme: 'Fantasy',
        races: [ 'elf', 'goblin', 'human', 'nymph', 'dwarf', 'troll' ],
        currency: 'Gold',
      })
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data) => {
      createStartingLocationMutate.mutate(data)
    }
  })


  return {
    createStoryMutate,
    createStartingLocationMutate,
    createPlayerMutate
  }
}
