import React from 'react'
import imaigineIcon from '@/assets/logo/imaigine_logo.svg'
import { UserInputType } from '@/global/types'
import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import { Card, CardContent } from '@/components/base/Card'
import { camelCaseToTitle } from '@/global/utils'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'

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

const avatars = [ 'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg' ]

export default function CreateAvatarScreen() {
  const [ step, setStep ] = React.useState(1)
  const [ userInputs, setUserInputs ] = React.useState(JSON.stringify({
    ageGroup: '',
    genderIdentity: '',
    color: '',
    race: '',
    skinColor: '',
    bodyType: '',
  }))
  const [ selectedAvatar, setSelectedAvatar ] = React.useState<number | null>(null)

  const userInputsJsonParsed: UserInputType = React.useMemo(() => {
    return JSON.parse(userInputs)
  }, [ userInputs ])

  // this is only a temporary selector for the color
  const [ selectedColor, setSelectedColor ] = React.useState<typeof colorPicks[number]>(userInputsJsonParsed.color ?? colorPicks[0])

  // temporary effect for changing color pick
  React.useEffect(() => {
    setUserInputs(prev => {
      return JSON.stringify({
        ...JSON.parse(prev),
        color: selectedColor,
      } as UserInputType)
    })
  }, [ selectedColor ])

  const handleSelectAvatar = (index: number) => {
    setSelectedAvatar(index)
  }

  return (
    <div className={clsx([
      'mx-auto max-w-7xl my-[3rem]',
      'flex flex-col items-center gap-10',
    ])}>
      <ConversationDialog isOpen={true} setOpen={() => console.log('true')}/>

      <section className="flex flex-col gap-2">
        <img src={imaigineIcon} alt={String(imaigineIcon)} className="aspect-auto w-[225px]" />
        <p className="font-inkFree tracking-wider text-center text-sm text-primary-foreground">Imagination Engine</p>
      </section>
      {
        step == 1 && (
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-segoeBold font-bold text-white leading-[48px] text-center">Let&apos;s create
              your character</p>
            <Card className="min-w-[500px] shadow-2xl">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions1.map(item => (
                    <div key={JSON.stringify(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-lg tracking-wide font-segoe mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button isHighlighted={userInputsJsonParsed[item.store] == option}
                                    key={JSON.stringify({ item, option })}
                                    variant="selective"
                                    size="lg"
                                    className="font-segoe text-xl py-7"
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
                  <p className="text-accent-3 text-lg font-segoe tracking-wide">Choose a color</p>
                  <div className="flex items-center justify-start gap-8">
                    {
                      colorPicks.map(option => (
                        <Button key={`${option}-1`} onClick={() => setSelectedColor(option)}
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
            <p className="text-4xl font-jost font-bold text-white text-center">Describe your Character</p>
            <Card className="min-w-[500px] shadow-2xl">
              <CardContent className="flex flex-col gap-8">
                {
                  setupOptions2.map(item => (
                    <div key={JSON.stringify(item)} className="flex flex-col gap-2">
                      <p className="text-accent-3 text-lg tracking-wide font-segoe mb-1">{item.label}</p>
                      <div className="flex items-center gap-3">
                        {
                          item.options.map(option => (
                            <Button isHighlighted={userInputsJsonParsed[item.store] == option}
                                    key={JSON.stringify({ item, option })}
                                    variant="selective"
                                    size="lg"
                                    className="font-segoe text-xl py-7"
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
            <p className="text-4xl font-jost font-bold text-white text-center">Choose your Avatar</p>
            <Card className="min-w-[500px] shadow-2xl">
              <CardContent className="flex gap-3 w-full">
                {
                  avatars.map((avatar, index) => {
                    const isSelectedAvatar = selectedAvatar === index
                    return (
                      <img
                        key={index}
                        src={`/src/assets/avatar/${avatar}`}
                        alt={avatar}
                        className={clsx([
                          'object-cover w-[22em] h-[26em] rounded-lg',
                          'transition duration-500 ease-in-out cursor-pointer',
                          `${selectedAvatar ? `${selectedAvatar === index ? 'ring-4 ring-yellow-300' : 'opacity-25'}` : ''}`,
                          isSelectedAvatar ? 'ring-4 ring-yellow-300' : selectedAvatar === null ? 'opacity-100' : 'opacity-25',
                        ])}
                        onClick={() => handleSelectAvatar(index)}
                      />
                    )
                  })
                }
              </CardContent>
            </Card>
          </section>
        )
      }
      <Button variant="accent" size="lg" className="min-w-[360px] h-[80px] rounded-full tracking-wider text-xl"
              onClick={() => {
                if (step == 1) setStep(2)
                if (step == 2) setStep(3)
              }}>{step == 3 ? `LET'S GO!` : 'NEXT'}</Button>
      {
        step == 1 && (
          <p className="text-accent-1 font-segoe text-sm text-xl tracking-wide mt-6 cursor-pointer">Randomize All Feature</p>
        )
      }
    </div>
  )
}
