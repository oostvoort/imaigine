import React from 'react'
import clsx from 'clsx'
import { Button } from '../../components/base/button'
import { Input } from '../../components/base/input'
import { Card, CardContent } from '../../components/base/card'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import useSessionState from '../../hooks/useSessionStorageState'
import { useSetAtom } from 'jotai'
import { activePage_atom } from '../../atoms/globalAtoms'
import { camelCaseToTitle } from '../../lib/utils'

type UserInputType = {
  name: string
  ageGroup: string
  genderIdentity: string
  color: string
  favColor: string
  favFood: string
  favAnimal: string
  skinColor: string,
  eyeShapeAndColor: string,
  noseType: string,
  hairTypeAndColor: string,
  facialExpression: string,
  otherFeatures: string
}

const setupOptions1 = [
  {
    label: 'Select your Age Group',
    options: ['child', 'adolescent', 'youngAdult', 'adult', 'elderly']
  },
  {
    label: 'Select your Gender Identity',
    options: ['male', 'female', 'nonbinary', 'others']
  },
]

const setupOptions2 = [
  {
    label: 'Select your Race',
    options: ['human', 'elf', 'dwarf', 'orc', 'gnome', 'halfling']
  },
  {
    label: 'Skin Color',
    options: ['light', 'tan', 'medium', 'dark', 'ebony']
  },
  {
    label: 'Select your Body Type',
    options: ['slim', 'average', 'athletic', 'burly', 'plump']
  },
  {
    label: 'Select your Height',
    options: ['petite', 'short', 'average', 'tall', 'statesque']
  }
]

const setupOptions3 = [
  {
    label: 'Select your Hair Length',
    options: ['long', 'meduim', 'short', 'pixieCut', 'bald']
  },
  {
    label: 'Select your Hair Type',
    options: ['straight', 'wavy', 'curly']
  }
]

const setupOptions4 = [
  {
    label: 'Select your Eye Shape',
    options: ['almond', 'round', 'hooded', 'upturned', 'monolid']
  }
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
    name: '',
    ageGroup: '',
    genderIdentity: '',
    color: '',
    favColor: '',
    favFood: '',
    favAnimal: '',
    skinColor: '',
    eyeShapeAndColor: '',
    noseType: '',
    hairTypeAndColor: '',
    facialExpression: '',
    otherFeatures: '',
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
                    <div key={String(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => <Button key={String(option)} variant="selective" size="lg">{ camelCaseToTitle(option) }</Button>)
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
        step == 2 && (
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">Descibe your Character</p>
            <Card className="min-w-[500px]">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions2.map(item => (
                    <div key={String(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => <Button key={String(option)} variant="selective" size="lg">{ camelCaseToTitle(option) }</Button>)
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
                  setupOptions3.map(item => (
                    <div key={String(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-sm tracking-wide mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => <Button key={String(option)} variant="selective" size="lg">{ camelCaseToTitle(option) }</Button>)
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
                          item.options.map(option => <Button key={String(option)} variant="selective" size="lg">{ camelCaseToTitle(option) }</Button>)
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
      <Button variant="accent" size="lg" className="min-w-[200px] rounded-full" onClick={() => {
        if (step == 1) setStep(2)
        if (step == 2) setStep(3)
        if (step == 3) setStep(4)
        if (step == 4) setActivePage('game')
      }}>{ step == 4 ? 'Play' : 'Next'}</Button>
    </div>
  )
}
