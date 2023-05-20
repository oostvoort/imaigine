import GridStoryLayout from '../../components/templates/grid_story_layout'
import { clsx } from 'clsx'
import { Button } from '../../components/base/button'
import React from 'react'

type Props = {
  mapHex: 'not-sure-about-the-type-of-this-yet',
  gameStats: Record<string, Array<{
    label: string,
    img: string
  }>>,
  narration: string,
  actions: Array<{
    description: string,
    action: () => void
  }>
}
const statsMockup: Props['gameStats'] = {
  'Point of Interest': [
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0.jpg',
      label: 'Land of Oz',
    },
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (2).jpg',
      label: 'Land of Oz',
    },
  ],
  'Nearby NPC\'s': [
    {
      img: 'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0.jpg',
      label: 'Doom Girl on the trailer',
    },
    {
      img: 'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0.jpg',
      label: 'Doom Girl on the trailer',
    },
  ],
}


export default function Game() {

  return (
    <GridStoryLayout>
      {/* Map / Visuals */}
      <section className="flex flex-col">
        <img className="h-auto max-h-[600px] aspect-video inset-0 m-auto"
             src="src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg"
             alt="Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0" />
      </section>
      {/* Game status */}
      <section className="flex flex-col p-10 gap-5">
        {
          Object.entries(statsMockup).map(([ title, items ], idx) => (
              <div key={JSON.stringify(title)} className="flex flex-col gap-2">
                <p key={title} className="font-bold tracking-wide font-jost text-accent">{title}</p>
                <div className="flex items-center gap-8">
                  {
                    items.map((item, index) => (
                      <img key={JSON.stringify({ item, index })} src={item.img} alt={JSON.stringify(item.img)}
                           className={clsx([
                             'w-20 rounded-full shadow-2xl cursor-pointer',
                             {
                               "rounded-lg": idx == 0
                             }
                           ])} />
                    ))
                  }
                </div>
              </div>
            )
          )
        }
      </section>
      {/* Narrative */}
      <section className="flex flex-col gap-3 p-10">
        <p className="font-bold tracking-wide font-jost text-accent">Narrative</p>
        <p className="leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.</p>
      </section>
      {/* Action container */}
      <section className="flex flex-col justify-between gap-3 p-10">
        <p className="font-bold tracking-wide font-jost text-accent">Actions</p>
        <Button size="lg" className="uppercase tracking-wider">Action A</Button>
        <Button size="lg" className="uppercase tracking-wider">Action B</Button>
        <Button size="lg" className="uppercase tracking-wider">Action C</Button>
      </section>

    </GridStoryLayout>
  )
}
