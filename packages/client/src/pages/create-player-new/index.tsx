import React from 'react'
import clsx from 'clsx'
import { Button } from '../../components/base/Button'
import { Card, CardContent } from '../../components/base/Card'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import useSessionState from '../../hooks/useSessionStorageState'
import { useSetAtom } from 'jotai'
import { activePage_atom } from '../../atoms/globalAtoms'
import { camelCaseToTitle } from '../../lib/utils'

type UserInputType = {
  ageGroup: string,
  genderIdentity: string,
  color: string,
  race: string,
  skinColor: string,
  bodyType: string,
  height: string,
  hairLength: string,
  hairType: string,
  hairColor: string,
  eyeShape: string,
  eyeColor: string,
}

type SetupOptionType = Array<{
  label: string,
  store: keyof UserInputType,
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
  {
    label: 'Select your Height',
    store: 'height',
    options: [ 'petite', 'short', 'average', 'tall', 'statesque' ],
  },
]

const setupOptions3: SetupOptionType = [
  {
    label: 'Select your Hair Length',
    store: 'hairLength',
    options: [ 'long', 'meduim', 'short', 'pixieCut', 'bald' ],
  },
  {
    label: 'Select your Hair Type',
    store: 'hairType',
    options: [ 'straight', 'wavy', 'curly' ],
  },
]

const setupOptions4: SetupOptionType = [
  {
    label: 'Select your Eye Shape',
    store: 'eyeShape',
    options: [ 'almond', 'round', 'hooded', 'upturned', 'monolid' ],
  },
]

const colorPicks = [
  'bg-option-1',
  'bg-option-2',
  'bg-option-3',
  'bg-option-4',
  'bg-option-5',
  'bg-option-6',
  'bg-option-7',
]

export default function CreatePlayerNew() {
  // indicator on what window / screen the user is on the setup wizard
  const [ step, setStep ] = React.useState(1)

  const setActivePage = useSetAtom(activePage_atom)

  const [ userInputs, setUserInputs ] = useSessionState('creation-values', JSON.stringify({
    ageGroup: '',
    genderIdentity: '',
    color: '',
    race: '',
    skinColor: '',
    bodyType: '',
    height: '',
    hairLength: '',
    hairType: '',
    hairColor: '',
    eyeShape: '',
    eyeColor: '',
  } as UserInputType))

  const userInputsJsonParsed: UserInputType = React.useMemo(() => {
    return JSON.parse(userInputs)
  }, [ userInputs ])

  // this is only a temporary selector for the color
  const [ selectedColor, setSeletedColor ] = React.useState<typeof colorPicks[number]>(userInputsJsonParsed.color ?? colorPicks[0])

  // temporary effect for changing color pick
  React.useEffect(() => {
    setUserInputs(prev => {
      return JSON.stringify({
        ...JSON.parse(prev),
        color: selectedColor,
      } as UserInputType)
    })
  }, [ selectedColor ])

  return (
    <div className={clsx([
      'mx-auto max-w-7xl my-[3rem]',
      'flex flex-col items-center gap-10',
    ])}>
      <section className="flex flex-col gap-2">
        <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[200px]" />
        <p className="font-rancho tracking-wider text-center">Imagination Engine</p>
      </section>
      {
        step == 1 && (
          <section className="flex flex-col gap-3"><p
            className="text-4xl font-jost font-bold text-white text-center">Let&apos;s create your character</p>
            <Card className="min-w-[500px]">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions1.map(item => (
                    <div key={JSON.stringify(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button isHighlighed={userInputsJsonParsed[item.store] == option}
                              key={JSON.stringify({item, option})}
                              variant="selective"
                              size="lg"
                              onClick={() => {
                                setUserInputs(prev => {
                                  return JSON.stringify({
                                    ...JSON.parse(prev),
                                    [item.store]: option,
                                  } as UserInputType)
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
                <div className="flex flex-col gap-2">
                  <p className="text-accent-3 text-sm tracking-wide mb-2">Choose a color:</p>
                  <div className="flex items-center justify-start gap-8">
                    {
                      colorPicks.map(option => (
                        <Button key={`${option}-1`} onClick={() => setSeletedColor(option)}
                                variant="ghost" className={clsx([
                          `w-7 h-9 rounded-full ${option} hover:${option}/80`,
                          'border-2 border-transparent',
                          {
                            'w-7 h-9 border-2 border-black': option == userInputsJsonParsed.color,
                          },
                        ])} />
                      ))
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
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">Descibe your Character</p>
            <Card className="min-w-[500px]">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions2.map(item => (
                    <div key={JSON.stringify(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button isHighlighed={userInputsJsonParsed[item.store] == option}
                              key={JSON.stringify({item, option})}
                              variant="selective"
                              size="lg"
                              onClick={() => {
                              setUserInputs(prev => {
                                return JSON.stringify({
                                  ...JSON.parse(prev),
                                  [item.store]: option,
                                } as UserInputType)
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
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">Describe the hair</p>
            <Card className="min-w-[500px]">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions3.map((item, index) => (
                    <div key={`${item}-2-${index}`} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button
                              isHighlighed={userInputsJsonParsed[item.store] == option}
                              key={JSON.stringify({item, option})}
                              variant="selective"
                              size="lg"
                              onClick={() => {
                                setUserInputs(prev => {
                                  return JSON.stringify({
                                    ...JSON.parse(prev),
                                    [item.store]: option,
                                  } as UserInputType)
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
                <div className="flex flex-col gap-2">
                  <p className="text-accent-3 text-sm tracking-wide mb-2">Choose your hair color:</p>
                  <div className="flex items-center justify-start gap-8">
                    {
                      colorPicks.map(option => (
                        <Button key={option} onClick={() => setSeletedColor(option)}
                                variant="ghost" className={clsx([
                          `w-7 h-9 rounded-full ${option} hover:${option}/80`,
                          'border-2 border-transparent',
                          {
                            'w-7 h-9 border-2 border-black': option == userInputsJsonParsed.color,
                          },
                        ])} />
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )
      }
      {
        step == 4 && (
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">And the Eyes?</p>
            <Card className="min-w-[500px]">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions4.map(item => (
                    <div key={String(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button
                              isHighlighed={userInputsJsonParsed[item.store] == option}
                              key={String(option)}
                              variant="selective"
                              size="lg"
                              onClick={() => {
                                setUserInputs(prev => {
                                  return JSON.stringify({
                                    ...JSON.parse(prev),
                                    [item.store]: option,
                                  } as UserInputType)
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
                <div className="flex flex-col gap-2">
                  <p className="text-accent-3 text-sm tracking-wide mb-2">Choose Eye Color</p>
                  <div className="flex items-center justify-start gap-8">
                    {
                      colorPicks.map(option => (
                        <Button key={option} onClick={() => setSeletedColor(option)}
                                variant="ghost" className={clsx([
                          `w-7 h-9 rounded-full ${option} hover:${option}/80`,
                          'border-2 border-transparent',
                          {
                            'w-7 h-9 border-2 border-black': option == userInputsJsonParsed.color,
                          },
                        ])} />
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )
      }
      <Button variant="accent" size="lg" className="mi{}n-w-[200px] rounded-full" onClick={() => {
        if (step == 1) setStep(2)
        if (step == 2) setStep(3)
        if (step == 3) setStep(4)
        if (step == 4) setActivePage('game')
      }}>{step == 4 ? 'Play' : 'Next'}</Button>
    </div>
  )
}
