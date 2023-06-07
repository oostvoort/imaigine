import { useMutation } from '@tanstack/react-query'
import useGame from '../useGame'
import { useMUD } from '../../MUDContext'

export const useCreateStory = () => {
  const {
    story
  } = useGame()

  const {
    systemCalls: {
      createStory
    }
  } = useMUD()

  return useMutation({
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
    onSuccess: () => {
      console.info("Done creating story!")
    }
  })
}
