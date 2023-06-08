import { useMutation } from '@tanstack/react-query'
import { GeneratePlayerCharacterProps } from 'types'
import api from '../../lib/api'

async function getThreeCharacters(props: GeneratePlayerCharacterProps) {
  return await api('/generatePlayerCharacter', props)
}

export const useCreateThreeCharacters = () => {

  return useMutation({
    mutationKey: [ 'my-characters' ],
    mutationFn: async (variables: any) => {
      return getThreeCharacters(
        variables
      )
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: (data: any) => {
      console.info(data)
      console.info('created 3 characters')
    },
  })

}
