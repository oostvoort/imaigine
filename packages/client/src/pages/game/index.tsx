import React from 'react'
import GridStoryLayout from '../../components/templates/GridStoryLayout'
import { clsx } from 'clsx'
import { Button, Progress } from '../../components/base'
import { motion } from 'framer-motion'
import CharacterConversationDialog from '../../components/CharacterConversationDialog'
import LocationInfoDialog from '../../components/LocationInfoDialog'
import useGame from '../../hooks/useGame'
import LoadingScreen from '../../components/shared/LoadingScreen'
import envs from '../../env'
import { generateIpfsImageLink } from '../../lib/utils'
import { useAtom } from 'jotai'
import { selectedCharacter_atom, selectedLocation_atom } from '../../atoms/globalAtoms'
import { ChevronLeft } from 'lucide-react'

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
  const { currentLocation, locations, characters } = useGame()

  const [selectedLocation, setLocationToSelect] = useAtom(selectedLocation_atom)
  const [selectedCharacter, setCharacterToSelect] = useAtom(selectedCharacter_atom)

  const [ isCharacterDialogOpen, setCharacterDialogOpen ] = React.useState<boolean>(false)
  const constrainsRef = React.useRef<HTMLDivElement>(null)

  if (!currentLocation || !locations) return <LoadingScreen message='Loading all locations...' />
  if (!characters) return <LoadingScreen message='Loading all characters...' />


  return (
    <>
      <GridStoryLayout>
        {/* Map / Visuals */}
        <div className="flex-[200px] flex justify-between [&>section]:border [&>section]:border-gray-900">
          <section className={clsx([
            "basis-6/12 flex flex-col z-10",
            "bg-cover bg-center bg-no-repeat aspect-auto overflow-hidden border border-primary"
          ])}>
            <img
              src={`${envs.API_IPFS_URL_PREFIX}/${currentLocation.image.value}`}
              alt={`main-map-${envs.API_IPFS_URL_PREFIX}/${currentLocation.image.value}`}
              className='object-contain object-cover h-full'
            />
          </section>
          {/* Game status */}
          <section className="basis-6/12 flex flex-col p-10 gap-5 w-[50%]">
            <motion.div
              className={clsx([
                "flex flex-col gap-2 overflow-hidden relative",
                "before:content-[''] before:block before:w-24 before:h-full before:absolute before:right-0 before:z-10 before-gradient"
              ])}
              ref={constrainsRef}
            >
              <p className="accent-title">Point of Interest</p>
              <motion.div className="flex items-center gap-4 w-max" drag="x" dragConstraints={constrainsRef}>
                {
                  locations.map((item, index) => {
                    return <div
                      key={JSON.stringify({ item, index })}
                      className={clsx([
                        'w-[100px] rounded-full shadow-2xl cursor-pointer overflow-hidden',
                        'rounded-xl w-[170px] h-[135px] relative',
                      ])}
                    >
                      <img
                        className='object-cover w-full h-full'
                        src={generateIpfsImageLink(item.image.value)} alt={JSON.stringify(item.image.value)}
                        draggable={false}
                        onClick={() => setLocationToSelect(item)}
                      />
                      {
                        // add condition when user is not at the start location
                        index == 0 && <div className='absolute bottom-2 left-0 bg-primary/80 px-3 py-2 rounded-r-lg flex items-center tracking-wide'><ChevronLeft className='-ml-3 w-5' /> Return</div>
                      }
                    </div>
                  })
                }
              </motion.div>
            </motion.div>
            <motion.div
              className="flex flex-col gap-2 overflow-hidden"
              ref={constrainsRef}
            >
              <p className="accent-title">Nearby Entities</p>
              <motion.div className="flex items-center gap-3 w-max" drag="x" dragConstraints={constrainsRef}>
                {
                  characters.map((item, index) => (
                    <img
                      className={clsx([
                        'w-[100px] h-[100px] rounded-full shadow-2xl cursor-pointer relative object-cover object-top'
                      ])}
                      key={JSON.stringify({ item, index })}
                      src={generateIpfsImageLink(item.image.value)} alt={JSON.stringify(item.image.value)}
                      draggable={false}
                      onClick={() => {
                        setCharacterToSelect(item)
                      }}
                    />
                  ))
                }
              </motion.div>
            </motion.div>

            {/*{*/}
            {/*  Object.entries(statsMockup).map(([ title, items ], idx) => (*/}
            {/*      <motion.div*/}
            {/*        key={JSON.stringify(title)}*/}
            {/*        className="flex flex-col gap-2 overflow-hidden"*/}
            {/*        ref={constrainsRef}*/}
            {/*      >*/}
            {/*        <p key={title} className="accent-title">{title}</p>*/}
            {/*        <motion.div className="flex items-center gap-3 w-max" drag="x" dragConstraints={constrainsRef}>*/}
            {/*          {*/}
            {/*            items.map((item, index) => (*/}
            {/*              <img*/}
            {/*                className={clsx([*/}
            {/*                  'w-[100px] rounded-full shadow-2xl cursor-pointer relative object-cover',*/}
            {/*                  {*/}
            {/*                    'rounded-xl w-[150px] h-[120px]': idx == 0,*/}
            {/*                  },*/}
            {/*                ])}*/}
            {/*                key={JSON.stringify({ item, index })}*/}
            {/*                onClick={() => {*/}
            {/*                  if (idx == 0) setMapDialogOpen(true)*/}
            {/*                  if (idx == 1) setCharacterDialogOpen(true)*/}
            {/*                }}*/}
            {/*                src={item.img} alt={JSON.stringify(item.img)}*/}
            {/*                draggable={false}*/}
            {/*              />*/}
            {/*            ))*/}
            {/*          }*/}
            {/*        </motion.div>*/}
            {/*      </motion.div>*/}
            {/*    ),*/}
            {/*  )*/}
            {/*}*/}
          </section>
        </div>
        {/* Narrative */}
        <div className="flex-1 flex justify-between [&>section]:border [&>section]:border-gray-900">
          <section className="basis-6/12 flex flex-col gap-3 p-10">
            <p className="accent-title">Narrative</p>
            <div className="h-min max-h-[300px] overflow-y-auto">
              <p className="leading-loose">{
                currentLocation.summary.value
              }</p>
            </div>
          </section>
          {/* Action container */}
          <section className={clsx([
            'basis-6/12 flex flex-col justify-start gap-5',
            'bg-action-section bg-cover bg-no-repeat',
            'p-10 relative',
          ])}>
            <div className="flex flex-col justify-start gap-5 mx-auto" style={{ width: 'min(70ch, 100% - 3rem)' }}>
              <Progress
                value={10}
                barColor="bg-red-700"
                className={clsx([
                  'bg-night border-2 border-red-700',
                  'absolute -rotate-180 h-[90%] w-3 inset-0 ml-3 my-auto',
                ])}
              />
              <Progress
                value={30}
                barColor="bg-blue-700"
                className={clsx([
                  'bg-night border-2 border-blue-700',
                  'absolute right-2 -rotate-180 h-[90%] w-3 inset-0 my-auto ml-auto mr-3',
                ])}
              />
              <p className="accent-title">Actions</p>
              <Button size="xl" className="tracking-wider">Find a vacant seat at the bar</Button>
              <Button size="xl" className="tracking-wider">Approach the musicians</Button>
              <Button size="xl" className="tracking-wider">Order a pint of ale from the barmaid</Button>
            </div>
          </section>
        </div>
      </GridStoryLayout>
      <CharacterConversationDialog isOpen={selectedCharacter !== null} setOpen={() => setCharacterToSelect(null)} />
      <LocationInfoDialog
        isOpen={selectedLocation !== null}
        setOpen={() => setLocationToSelect(null)}
      />
      {/*<LoadingScreen message={'Generating avatars..'} />*/}
    </>
  )
}
