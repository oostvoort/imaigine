import { useMutation } from '@tanstack/react-query'
import { useMUD } from '../../MUDContext'

export const useCreateCharacters = () => {
  const {
    systemCalls: {
      createCharacters,
    },
  } = useMUD()


  return useMutation({
    mutationKey: [ 'setup-characters' ],
    mutationFn: async (variables: any) => {
      return createCharacters(variables.characters, variables.startingLocation)
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.info('characters', data)
      console.info('Done creating character/s')
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
