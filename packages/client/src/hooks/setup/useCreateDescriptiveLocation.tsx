import { useMutation } from '@tanstack/react-query'
import { useMUD } from '../../MUDContext'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'

export const useCreateDescriptiveLocation = () => {
  const {
    systemCalls: {
      createDescriptiveLocation
    }
  } = useMUD()

  return useMutation({
    mutationKey: ['setup-descriptive-location'],
    mutationFn: async (variables: any) => {
      return createDescriptiveLocation({
        story: {
          name: variables.name,
          summary: variables.summary
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
