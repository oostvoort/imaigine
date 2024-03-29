import React from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { Card, CardContent } from '@/components/base/Card'
import { camelCaseToTitle } from '@/global/utils'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import LoadingScreen from '@/components/shared/LoadingScreen'
import LoadingStory from '@/components/shared/LoadingStory'
import { useAtom, useSetAtom } from 'jotai'
import { activeScreen_atom, currentLoader_atom, SCREENS } from '@/states/global'
import usePlayer from '@/hooks/v1/usePlayer'
import { GeneratePlayerProps, GeneratePlayerResponse } from '../../../../types'
import { colorPalette, IPFS_URL_PREFIX, setupOptions1, setupOptions2 } from '@/global/constants'
import { useMUD } from '@/MUDContext'
import Spinner from '@/components/base/Spinner'

export default function CreateAvatarScreen() {
  const {
    network: {
      playerEntity
    },
  } = useMUD()

  const { generatePlayer, generatePlayerImage, createPlayer, player} = usePlayer()

  const [ step, setStep ] = React.useState(1)
  const [ userInputs, setUserInputs ] = React.useState<GeneratePlayerProps>({
    ageGroup: '',
    genderIdentity: '',
    favColor: '',
    race: '',
    skinColor: '',
    bodyType: '',
  })
  const [ selectedColor, setSelectedColor ] = React.useState(colorPalette[0].toString())

  const [ generatedPlayer, setGeneratedPlayer ] = React.useState<GeneratePlayerResponse | null>(null)
  const [ imageHashes, setImageHashes ] = React.useState<Array<string>>([])

  const [ isLoading, setIsLoading ] = React.useState<boolean>(false)
  const [ isRegeneratingImage, setIsRegeneratingImage ] = React.useState<boolean>(false)
  const [ activeLoader, setActiveLoader ] = useAtom(currentLoader_atom)
  const setActiveScreen = useSetAtom(activeScreen_atom)

  const handleRandomCharacter = async () => {
    const getRandomOption = (options: Array<string>) => {
      const randomIndex = Math.floor(Math.random() * options.length)
      return options[randomIndex]
    }

    const randomColorIndex = Math.floor(Math.random() * colorPalette.length)
    const randomColor = Object.values(colorPalette[randomColorIndex])[0]

    const randomizedUserInputs = {
      ageGroup: getRandomOption(setupOptions1[0].options),
      genderIdentity: getRandomOption(setupOptions1[1].options),
      favColor: randomColor,
      race: getRandomOption(setupOptions2[0].options),
      skinColor: getRandomOption(setupOptions2[1].options),
      bodyType: getRandomOption(setupOptions2[2].options),
    }

    setUserInputs(randomizedUserInputs)
    await handleGeneratePlayer()
  }

  const handleGeneratePlayer = async () => {
    setActiveLoader('loadingAvatar')
    setIsLoading(true)

    const player = await generatePlayer.mutateAsync(userInputs)
    if (player) {
      setGeneratedPlayer({
        ipfsHash: player.ipfsHash,
        visualSummary: player.visualSummary,
        locationId: player.locationId,
        cellId: player.cellId
      })

      const imageHash = await generatePlayerImage.mutateAsync({ visualSummary: player.visualSummary })

      if (imageHash !== undefined) {
        setImageHashes(prevState => [...prevState, imageHash.imageIpfsHash])
        setIsLoading(false)
        setStep(3)
      }
    }
  }

  const handleGenerateImage = async (visualSummary: string) => {
    if (player) {
      const imageHash = await generatePlayerImage.mutateAsync({ visualSummary: visualSummary })
      if (imageHash !== undefined) {
        setImageHashes(prevState => [...prevState, imageHash.imageIpfsHash])
      }
    }
  }

  const handleCreatePlayer = async () => {
    if (!playerEntity) throw new Error('No player entity!')
    if (!generatedPlayer) throw new Error('No generated player!')
    if (imageHashes.length <= 0) throw new Error('No image hash!')
    await createPlayer.mutateAsync({
      playerId: playerEntity,
      imageIpfsHash: imageHashes[imageHashes.length - 1],
      locationId: generatedPlayer.locationId,
      ipfsHash: generatedPlayer.ipfsHash,
      cellId: generatedPlayer.cellId,
    })
  }

  React.useEffect(() => {
    setUserInputs((prev: GeneratePlayerProps) => {
      return {
        ...prev,
        favColor: selectedColor.toString(),
      }
    })
  }, [ selectedColor ])

  React.useEffect(() => {
    if (createPlayer.isSuccess) {
      setActiveScreen(SCREENS.CURRENT_LOCATION)
    }
  }, [ createPlayer.isSuccess ])

  return (
    <React.Fragment>
      {
        isLoading ? (
          <BackgroundCarousel>
            {activeLoader == 'loadingAvatar' && <LoadingScreen message={'Generating Avatar...'} />}
            {activeLoader == 'loadingStory' && <LoadingStory message={'Summary Story'} isLoading={false} />}
          </BackgroundCarousel>
        ) : (
          <div className={clsx([
            'mx-auto max-w-7xl my-[3rem]',
            'flex flex-col items-center gap-10',
          ])}>
            <section className={clsx('flex flex-col gap-2')}>
              <img
                src={"/assets/logo/imaigine_logo.svg"}
                alt={"imaigine icon"}
                className={clsx('aspect-auto w-[225px]')}
                draggable={false}
              />
              <p className={clsx([
                'text-sm text-center text-primary-foreground',
                'font-inkFree tracking-wide',
              ])}>
                Imagination Engine
              </p>
            </section>
            {
              step == 1 && (
                <section className={clsx('flex flex-col gap-3')}>
                  <p className={clsx(
                    'text-4xl text-white text-center leading-[48px]',
                    'font-segoeBold font-bold',
                  )}>
                    Let&apos;s create your character
                  </p>
                  <Card className={clsx('min-w-[500px] shadow-2xl')}>
                    <CardContent className={clsx('flex flex-col gap-8')}>
                      {
                        setupOptions1.map(item => (
                          <div key={JSON.stringify(item)} className={clsx('flex flex-col gap-2')}>
                            <p className={clsx('text-accent-3 text-lg tracking-wide font-segoe mb-1')}>{item.label}</p>
                            <div className={clsx('flex items-center gap-3')}>
                              {
                                item.options.map((option, index) => (
                                  <Button
                                    isHighlighted={userInputs[item.store] == option}
                                    key={index}
                                    variant="selective"
                                    size="lg"
                                    className={clsx('text-xl font-segoe py-7')}
                                    onClick={() => setUserInputs(prev => {
                                      return {
                                        ...prev,
                                        [item.store]: option,
                                      } as GeneratePlayerProps
                                    })}
                                  >
                                    {camelCaseToTitle(option)}
                                  </Button>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                      <div className={clsx('flex flex-col gap-2')}>
                        <p className={clsx('text-accent-3 text-lg font-segoe tracking-wide')}>Choose a color</p>
                        <div className={clsx('flex items-center justify-start gap-8')}>
                          {
                            colorPalette.map((color, index) => {
                              return (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  onClick={() => setSelectedColor(Object.values(color)[0])}
                                  className={clsx([
                                    `w-7 h-9 rounded-full ${Object.keys(color)[0]} hover:${Object.keys(color)[0]}/80`,
                                    'border-2 border-transparent',
                                    { 'w-7 h-9 border-2 border-black': Object.values(color)[0] == userInputs.favColor },
                                  ])}
                                />
                              )
                            })
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )
            }
            {
              step == 2 && (
                <section className={clsx('flex flex-col gap-3')}>
                  <p className={clsx('text-4xl text-white text-center font-jost font-bold')}>Describe your Character</p>
                  <Card className={clsx('min-w-[500px] shadow-2xl')}>
                    <CardContent className={clsx('flex flex-col gap-8')}>
                      {
                        setupOptions2.map(item => (
                          <div key={JSON.stringify(item)} className={clsx('flex flex-col gap-2')}>
                            <p className={clsx('text-accent-3 text-lg tracking-wide font-segoe mb-1')}>{item.label}</p>
                            <div className={clsx('flex items-center gap-3')}>
                              {
                                item.options.map((option, index) => (
                                  <Button
                                    isHighlighted={userInputs[item.store] == option}
                                    key={index}
                                    variant="selective"
                                    size="lg"
                                    className={clsx('font-segoe text-xl py-7')}
                                    onClick={() => {
                                      setUserInputs(prev => {
                                        return {
                                          ...prev,
                                          [item.store]: option,
                                        } as GeneratePlayerProps
                                      })
                                    }}
                                  >
                                    {camelCaseToTitle(option)}
                                  </Button>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                    </CardContent>
                  </Card>
                </section>
              )
            }
            {
              step == 3 && (
                <section className={clsx('flex flex-col gap-3')}>
                  <p className={clsx('text-4xl text-white text-center font-segoeBold font-bold')}>Your Avatar</p>
                  <Card className={clsx('min-w-[400px] shadow-2xl')}>
                    <CardContent className={clsx('flex w-full')}>
                      <img
                        src={`${IPFS_URL_PREFIX}/${imageHashes[imageHashes.length - 1]}`}
                        alt={'Avatar Img'}
                        className={clsx([
                          'object-cover w-[22em] h-[26em] rounded-lg',
                          'transition duration-500 ease-in-out cursor-pointer',
                        ])}
                        draggable={false}
                      />
                    </CardContent>
                  </Card>

                  <div
                    className={clsx([ 'w-full flex justify-center mt-md ease-in duration-300', { 'hidden ease-out duration-300': createPlayer.isLoading } ])}>
                    <Button
                      variant={'refresh'}
                      onClick={() => {
                        generatedPlayer && handleGenerateImage(generatedPlayer?.visualSummary)
                      }}
                      disabled={generatePlayerImage.isLoading}
                    >
                      <img
                        src={`/assets/svg/refresh.svg`}
                        alt={'Avatar Img'}
                        className={clsx([
                          'object-cover w-[22px] h-[22px]',
                          'mr-4 cursor-pointer',
                          `${isRegeneratingImage ? 'animate-loading-spin' : ''}`,
                        ])}
                        draggable={false}
                      />
                      {isRegeneratingImage ? 'Regenerating avatar' : 'Regenerate Avatar'}
                    </Button>
                  </div>

                </section>
              )
            }

            {
              !isRegeneratingImage && (
                <Button
                  variant="accent"
                  size="lg"
                  className={clsx([
                    'min-w-[360px] h-20 rounded-full',
                    'text-xl tracking-wider',
                    'rounded-full',
                    { '!cursor-not-allowed': createPlayer.isLoading },
                  ])}
                  disabled={createPlayer.isLoading}
                  onClick={() => {
                    if (step == 1) setStep(2)
                    if (step == 2) handleGeneratePlayer()
                    if (step == 3) handleCreatePlayer()
                  }}
                >
                  {
                    createPlayer.isLoading
                      ? <Spinner text={'Loading'}/>
                      : step == 3 ? `LET'S GO!` : 'NEXT'
                  }
                </Button>
              )
            }

            {
              step == 1 && (
                <p className={clsx([
                  'text-accent-1 text-sm text-xl',
                  'font-segoe tracking-wide mt-6 cursor-pointer',
                ])}
                   onClick={() => handleRandomCharacter()}
                >
                  Randomize All Features
                </p>
              )
            }
          </div>
        )
      }
    </React.Fragment>
  )
}
