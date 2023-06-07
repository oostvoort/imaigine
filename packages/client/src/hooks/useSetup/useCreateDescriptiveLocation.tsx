import { useMutation } from '@tanstack/react-query'
import useGame from '../useGame'
import { useMUD } from '../../MUDContext'

export const useCreateDescriptiveLocation = () => {
  const {
    story
  } = useGame()

  const {
    systemCalls: {
      createDescriptiveLocation
    }
  } = useMUD()
  return useMutation({
    mutationKey: ['setup-starting-location', story],
    mutationFn: async (variables: any) => {
      return createDescriptiveLocation({
        story: !story ? {
          name: variables?.name,
          summary: variables?.summary,
        } : {
          name: story.name,
          summary: story.summary
        },
      })
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      // console.info('descriptive location', data)
      console.info("Done creating descriptive location!")
    },
    onError: (err) => {
      console.error(err)
    }
  })
}
