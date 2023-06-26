import React  from 'react'
import imaigineIcon from '@/assets/logo/imaigine_logo.svg'
import { GenerateLocation, GeneratePlayerProps, GeneratePlayerResponse } from '@/global/types'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { Card, CardContent } from '@/components/base/Card'
import { camelCaseToTitle } from '@/global/utils'
import usePlayer from '@/hooks/usePlayer'
import BackgroundCarousel from '@/components/shared/BackgroundCarousel'
import LoadingScreen from '@/components/shared/LoadingScreen'
import LoadingStory from '@/components/shared/LoadingStory'
import { useAtom } from 'jotai'
import { activeScreen_atom, currentLoader_atom } from '@/global/states'
import useLocation from '@/hooks/useLocation'
import { useSetAtom } from 'jotai/index'

type SetupOptionType = Array<{
  label: string,
  store: keyof GeneratePlayerProps,
  options: Array<string>
}>

const setupOptions1: SetupOptionType = [
  {
    label: 'Select your Age Group',
    store: 'ageGroup',
    options: [ 'child', 'adolescent', 'youngAdult', 'adult', 'elderly' ],
  },
  {
    label: 'Select your Gender Identity',
    store: 'genderIdentity',
    options: [ 'male', 'female', 'nonbinary', 'others' ],
  },
]

const setupOptions2: SetupOptionType = [
  {
    label: 'Select your Race',
    store: 'race',
    options: [ 'human', 'elf', 'dwarf', 'orc', 'gnome', 'halfling' ],
  },
  {
    label: 'Skin Color',
    store: 'skinColor',
    options: [ 'light', 'tan', 'medium', 'dark', 'ebony' ],
  },
  {
    label: 'Select your Body Type',
    store: 'bodyType',
    options: [ 'slim', 'average', 'athletic', 'burly', 'plump' ],
  },
]

const colorPalette = [
  {
    'bg-option-1': 'green',
  },
  {
    'bg-option-2': 'brown',
  },
  {
    'bg-option-3': 'blue',
  },
  {
    'bg-option-4': 'white',
  },
  {
    'bg-option-5': 'yellow',
  },
  {
    'bg-option-6': 'gray',
  },
  {
    'bg-option-7': 'red',
  },
]

export default function CreateAvatarScreen() {
  const { generatePlayer, createPlayer } = usePlayer()

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
  const [ selectedAvatar, setSelectedAvatar ] = React.useState<number | null>(null)
  const [ avatarHash, setAvatarHash ] = React.useState<string>('')

  const [ isLoading, setIsLoading ] = React.useState<boolean>(false)
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

  const handleSelectAvatar = (index: number) => {
    if (!generatedPlayer) return
    setSelectedAvatar(index)
    setAvatarHash(generatedPlayer?.imgHashes[index])
  }

  const handleGeneratePlayer = async () => {
    setActiveLoader('loadingAvatar')
    setIsLoading(true)
    try {
      const player = await generatePlayer.mutateAsync(userInputs)
      setGeneratedPlayer({
        ipfsHash: player.ipfsHash,
        imgHashes: player.imgHashes,
        locationId: player.locationId,
      })
      setIsLoading(false)
      setStep(3)
    } catch (error) {
      console.error('[generatePlayer]', error)
    }
  }

  const handleCreatePlayer = async () => {
    try {
      if (!generatedPlayer) return
      await createPlayer.mutateAsync({
        config: generatedPlayer.ipfsHash,
        imgHash: avatarHash,
        locationId: generatedPlayer.locationId,
      })
      setActiveScreen('currentLocationScreen')
    } catch (error) {
      console.error()
    }
  }

  React.useEffect(() => {
    setUserInputs((prev: GeneratePlayerProps) => {
      return {
        ...prev,
        favColor: selectedColor.toString(),
      }
    })
  }, [ selectedColor ])

  return (
    <React.Fragment>
      {
        isLoading ? (
          <BackgroundCarousel>
            {activeLoader == 'loadingAvatar' && <LoadingScreen message={'Generating Avatars...'} />}
            {activeLoader == 'loadingStory' && <LoadingStory message={'Summary Story'} isLoading={false} />}
          </BackgroundCarousel>
        ) : (
          <div className={clsx([
            'mx-auto max-w-7xl my-[3rem]',
            'flex flex-col items-center gap-10',
          ])}>
            <section className={clsx('flex flex-col gap-2')}>
              <img
                src={imaigineIcon}
                alt={String(imaigineIcon)}
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
                  <p className={clsx('text-4xl text-white text-center font-jost font-bold')}>Choose your Avatar</p>
                  <Card className={clsx('min-w-[500px] shadow-2xl')}>
                    <CardContent className={clsx('flex w-full gap-3')}>
                      {
                        generatedPlayer?.imgHashes.map((avatar, index) => {
                          const isSelectedAvatar = selectedAvatar === index
                          return (
                            <img
                              key={index}
                              src={`${import.meta.env.VITE_IPFS_URL_PREFIX}/${avatar}`}
                              alt={avatar}
                              className={clsx([
                                'object-cover w-[22em] h-[26em] rounded-lg',
                                'transition duration-500 ease-in-out cursor-pointer',
                                `${selectedAvatar ? `${selectedAvatar === index ? 'ring-4 ring-yellow-300' : 'opacity-25'}` : ''}`,
                                isSelectedAvatar ? 'ring-4 ring-yellow-300' : selectedAvatar === null ? 'opacity-100' : 'opacity-25',
                              ])}
                              onClick={() => handleSelectAvatar(index)}
                              draggable={false}
                            />
                          )
                        })
                      }
                    </CardContent>
                  </Card>
                </section>
              )
            }
            <Button
              variant="accent"
              size="lg"
              className={clsx([
                'min-w-[360px] h-20 rounded-full',
                'text-xl tracking-wider',
                'rounded-full',
              ])}
              onClick={() => {
                if (step == 1) setStep(2)
                if (step == 2) handleGeneratePlayer()
                if (step == 3) handleCreatePlayer()
              }}
            >
              {step == 3 ? `LET'S GO!` : 'NEXT'}
            </Button>
            {
              step == 1 && (
                <p className={clsx([
                  'text-accent-1 text-sm text-xl',
                  'font-segoe tracking-wide mt-6 cursor-pointer',
                ])}
                   onClick={() => handleRandomCharacter()}
                >
                  Randomize All Feature
                </p>
              )
            }
          </div>
        )
      }
    </React.Fragment>
  )
}
