import { useMUD } from '../../MUDContext'
import { useMutation } from '@tanstack/react-query'

export const useCreateItems = () => {
  const {
    systemCalls: {
      createItems,
    },
  } = useMUD()

  return useMutation({
    mutationKey: [ 'setup-item' ],
    mutationFn: async (variables: any) => {
      return createItems(variables.items, variables.startingLocation)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.info("items", data)
      console.info('Done creating item/s')
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
