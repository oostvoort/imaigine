import React from 'react'
import GridStoryLayout from '../../components/templates/grid_story_layout'
import { clsx } from 'clsx'
import { Button } from '../../components/base/button'
import { motion } from 'framer-motion'
import { useMUD } from '../../MUDContext'
import { useComponentValue, useEntityQuery } from '@latticexyz/react'
import { Has } from '@latticexyz/recs'
import { ethers } from 'ethers'


type Props = {
  mapHexImage: 'not-sure-about-the-type-of-this-yet',
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
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0.jpg',
      label: 'Land of Oz',
    },
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (2).jpg',
      label: 'Land of Oz',
    },
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0.jpg',
      label: 'Land of Oz',
    },
    {
      img: 'src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (2).jpg',
      label: 'Land of Oz',
    },
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
      img: 'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg',
      label: 'Doom Girl on the trailer',
    },
  ],
}

export default function Game() {
  const constrainsRef = React.useRef<HTMLDivElement>(null)

  const {
    components: { StoryActionComponent },
    systemCalls: { selectPlayerLocation }
  } = useMUD()

  // const entity = useEntityQuery([Has(StoryActionComponent)])
  //
  // React.useEffect(() => {
  //   console.log({ entity })
  // }, [entity])

  // locationOptionID = ethers.abi.encode("options.locations.${array_index}")

  return (
    <GridStoryLayout>
      {/* Map / Visuals */}
      <section className="flex flex-col z-10">
        <img className="h-auto max-h-[600px] aspect-video inset-0 m-auto"
             src="src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg"
             alt="Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0"
             draggable={false}
        />
      </section>
      {/* Game status */}
      <section className="flex flex-col p-10 gap-5">
        {
          Object.entries(statsMockup).map(([ title, items ], idx) => (
              <motion.div
                key={JSON.stringify(title)}
                className="flex flex-col gap-2 overflow-hidden"
                ref={constrainsRef}
              >
                <p key={title} className="font-bold tracking-wide font-jost text-accent">{title}</p>
                <motion.div className="flex items-center gap-8 w-max" drag="x" dragConstraints={constrainsRef}>
                  {
                    items.map((item, index) => (
                      <img onClick={() => {
                        if (idx == 0) selectPlayerLocation("0x860c0bc42877e4be14ccf6099ac139f3ccda212f736fdde471ee52695d5462fb"/*ethers.utils.formatBytes32String(ethers.utils.id("options.locations.0"))*/)
                      }} key={JSON.stringify({ item, index })} src={item.img} alt={JSON.stringify(item.img)}
                           className={clsx([
                             'w-[100px] rounded-full shadow-2xl cursor-pointer',
                             {
                               'rounded-xl w-[150px]': idx == 0,
                             },
                           ])}
                           draggable={false}
                      />
                    ))
                  }
                </motion.div>
              </motion.div>
            ),
          )
        }
      </section>
      {/* Narrative */}
      <section className="flex flex-col gap-3 p-10">
        <p className="font-bold tracking-wide font-jost text-accent">Narrative</p>
        <div className=' h-[200px] overflow-y-scroll'>
          <p className="leading-loose">Alice&apos;s weary footsteps echoed on the cobblestone streets as she entered the
            enchanting town of Lindwurm. The scent of blooming flowers filled the air, and the cheerful chatter of
            locals
            wafted through the bustling market square. Vibrant cottages with thatched roofs lined the winding streets,
            inviting her to explore further. The tranquil river flowed gracefully, reflecting the golden rays of the
            setting sun. Intrigued, Alice embraced the warmth of Lindwurm&apos;s welcoming atmosphere, her eyes sparkling
            with
            anticipation. This picturesque haven held the promise of new encounters, captivating stories, and a sense of
            belonging she had long yearned for.</p>
        </div>
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
