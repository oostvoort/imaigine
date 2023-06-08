import { useMutation } from '@tanstack/react-query'
import { useMUD } from '../../MUDContext'

export const useCreateMyPlayer = () => {
  const {
    systemCalls: {
      createMyPlayer
    }
  } = useMUD()

  return useMutation({
    mutationKey: [ 'my-player' ],
    mutationFn: async (variables: any) => {
      return createMyPlayer(variables.name, variables.summary, variables.imageHash, variables.startingLocation)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: (data: any) => {
      // console.info(data)
      console.info('Created My Player!')
    },
  })

}
