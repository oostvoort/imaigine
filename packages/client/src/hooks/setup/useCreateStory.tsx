import { useComponentValue } from '@latticexyz/react'
import { useMUD } from '../../MUDContext'
import { Entity, HasValue, runQuery } from '@latticexyz/recs'
import { useMutation } from '@tanstack/react-query'
import { isFormElement } from 'react-router-dom/dist/dom'

export const useCreateStory = () => {
  const {
    components: {
      StoryComponent,
      NameComponent,
      SummaryComponent
    },
    systemCalls: {
      createStory
    }
  } = useMUD()

  const storyComponent = useComponentValue(StoryComponent, "0x01" as Entity)
  const name = useComponentValue(NameComponent, "0x01" as Entity)
  const summary = useComponentValue(SummaryComponent, "0x01" as Entity)

  return useMutation({
    mutationKey: ['setup-story'],
    mutationFn: async () => {
      if (storyComponent !== undefined) {
        return {
          name: name?.value,
          summary: summary?.value
        }
      } else {
        const newStory = await createStory({
          theme: 'Fantasy',
          races: [ 'elf', 'goblin', 'human', 'nymph', 'dwarf', 'troll' ],
          currency: 'Gold',
        })

        return {
          name: newStory.name,
          summary: newStory.summary
        }
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: (data: any) => {
      // console.info({ data })
      console.info("Done creating story!")
    }
  })

}
