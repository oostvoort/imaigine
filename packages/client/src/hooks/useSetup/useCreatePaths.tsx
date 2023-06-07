import { useMutation } from '@tanstack/react-query'
import useGame from '../useGame'
import { useMUD } from '../../MUDContext'

export const useCreatePaths = () => {
  const {
    story
  } = useGame()

  const {
    systemCalls: {
      createPath,
    }
  } = useMUD()


  return useMutation({
    mutationKey: ['setup-path', story],
    mutationFn: async (variables: any) => {
      return createPath(variables.startingLocation, variables.toLocations, variables.story)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      // console.info("paths data", data)
      console.info("Done creating paths")
    },
    onError: (err) => {
      console.error(err)
    }
  })
}
