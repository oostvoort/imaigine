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
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { activePage_atom, isLoading_atom, selectedPath_atom, triggerRender_atom } from '../../atoms/globalAtoms'
import { ChevronLeft } from 'lucide-react'
import { useMUD } from '../../MUDContext'
import { useMutationState, useIsMutating } from '@tanstack/react-query'
import { useEntityQuery } from '@latticexyz/react'
import { getComponentValue, getComponentValueStrict, Has } from '@latticexyz/recs'
import { hexValue, hexZeroPad } from 'ethers/lib/utils'
import useForceRerender from '../../hooks/useForceRerender'

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

export default function Game() {
  const [isLoading, setLoading] = useAtom(isLoading_atom)
  const forceRender = useForceRerender()
  const t = useAtomValue(triggerRender_atom)
  const setActivePage = useSetAtom(activePage_atom)
  const {
    systemCalls,
    network: {
      playerEntity
    }
  } = useMUD()
  const isMutating = useIsMutating({
    mutationKey: ['playerTravel']
  })
  const {
    currentLocation,
    locations,
    paths,
    characters,
    currentInteraction,
    player,
    interactions,
    story
  } = useGame()

  const [selectedLocation, setLocationToSelect] = useAtom(selectedPath_atom)
  const selectedCharacter = React.useMemo(() => {
    console.info("C", currentInteraction)
    return currentInteraction?.entity ?? null
  }, [currentInteraction])

  const constrainsRef = React.useRef<HTMLDivElement>(null)

  async function onClickNPCInteractionTest(entityID: string) {
    if (!playerEntity) return

    // Get character details and if in an ongoing interaction for API
    const npc = characters.find((character) => character.entity == entityID)
    if (!npc) throw Error(`Unable to find NPC with ID ${entityID}`)

    const ongoingInteraction = interactions
      .find((interaction) => interaction.entity.entity == entityID)
    const otherParticipants = ongoingInteraction ? ongoingInteraction.otherParticipants : []

    await systemCalls.enterInteraction(entityID, {
      mode: 'interactable',
      storySummary: story.summary.value,
      location: {
        name: currentLocation.name.value,
        summary: currentLocation.summary.value,
      },
      action: '',
      activeEntity: {
        isAlive: player.alive,
        summary: player.summary.value,
        name: player.name.value,
      },
      logHash: ongoingInteraction?.logHash?.value ?? '',
      otherEntities: [
        {
          name: npc?.name?.value ?? '',
          summary: npc?.summary?.value ?? '',
          isAlive: npc.alive,
        },
        ...otherParticipants.map((participant) => {
          return {
            name: participant.name,
            summary: participant.summary,
            isAlive: participant.alive,
          }
        }),
      ],
    }, [ playerEntity, ...otherParticipants.map(participant => hexZeroPad(participant.entity, 32)) ])
  }

  React.useEffect(() => {
    forceRender()
  }, [])


  if (isLoading) return <LoadingScreen message='Loading...' />
  if (isMutating) return <LoadingScreen message='Loading...' />
  // if (storySetup && storySetup.status != 'success' && storySetup.status != 'error') return <LoadingScreen message='Creating story...' />
  if (!currentLocation || !locations) return  <LoadingScreen message='Loading all locations...' />
  if (!characters) return <LoadingScreen message='Loading all characters...' />

  return (
    <React.Fragment key={JSON.stringify({
      isMutating,
      ...characters,
      ...paths
    })}>
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
          <section className="basis-6/12 flex flex-col p-10 gap-5 w-[100px]">
            <motion.div
              className={clsx([
                'flex flex-col gap-2 overflow-hidden relative',
                'before:content-[\'\'] before:block before:w-24 before:h-full before:absolute before:right-0 before:z-10 before-gradient',
              ])}
              ref={constrainsRef}
            >
              <p className="accent-title">Point of Interest</p>
              <motion.div className="flex items-center gap-4 w-max" drag="x" dragConstraints={constrainsRef}>
                {
                  paths.map((item, index) => {
                    return <div
                      key={JSON.stringify({ item, index })}
                      className={clsx([
                        'w-[100px] rounded-full shadow-2xl cursor-pointer overflow-hidden',
                        'rounded-xl w-[170px] h-[135px] relative',
                      ])}
                    >
                      <img
                        className='object-cover w-full h-full'
                        src={generateIpfsImageLink(currentLocation.entity == item?.pathLocations?.[0].entity ? item?.pathLocations?.[1]?.image?.value ?? '' : item?.pathLocations?.[0]?.image?.value ?? '')} alt={JSON.stringify(currentLocation.entity == item?.pathLocations?.[0].entity ? item?.pathLocations?.[1]?.image?.value ?? '' : item?.pathLocations?.[0]?.image?.value ?? '')}
                        draggable={false}
                        onClick={() => setLocationToSelect(item)}
                      />
                      {
                        // add condition when user is not at the start location
                        index == 0 && currentLocation.entity == item?.pathLocations?.[1].entity && <div className='absolute bottom-2 left-0 bg-primary/80 px-3 py-2 rounded-r-lg flex items-center tracking-wide'><ChevronLeft className='-ml-3 w-5' /> Return</div>
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
                    <button
                      key={JSON.stringify({ item, index })}
                      onClick={() => onClickNPCInteractionTest(item.entity)}
                    >
                      <img
                        className={clsx([
                          'w-[100px] h-[100px] rounded-full shadow-2xl cursor-pointer relative object-cover object-top'
                        ])}
                        key={JSON.stringify({ item, index })}
                        src={generateIpfsImageLink(item.image.value)}
                        alt={JSON.stringify(item.image.value)}
                        draggable={false}
                      />
                    </button>
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
              <p className="leading-loose text-xl">{
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
      <CharacterConversationDialog
        setOpen={() => selectedCharacter && systemCalls.leaveInteraction(selectedCharacter.entity, player.entity)}
      />
      <LocationInfoDialog
        isOpen={selectedLocation !== null}
        setOpen={() => setLocationToSelect(null)}
      />
    </React.Fragment>
  )
}
