import React from 'react'
import clsx from 'clsx'
import { Button } from '../../components/base/button'
import { Input } from '../../components/base/input'
import { Card, CardContent } from '../../components/base/card'
import imaigineIcon from '../../assets/img_imaigine_logo.svg'
import { useSearchParams } from 'react-router-dom'
import useSessionState from '../../hooks/useSessionState'

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

const colorPick = [
  'option-1',
  'option-2',
  'option-3',
  'option-4',
  'option-5',
  'option-6',
]

export default function CreatePlayerNew() {
  // indicator on what window / screen the user is on the setup wizard
  const [ searchParams, setSearchParams ] = useSearchParams()

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
  const [ selectedColor, setSeletedColor ] = React.useState(0)


  const step = React.useMemo(() => {
    return searchParams.get('step')
  }, [ searchParams ])

  React.useEffect(() => {
    if (!searchParams.get('step')) setSearchParams({ step: '1' })
  }, [])

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
        step == '1' && (
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">Let&apos;s create your character</p>
            <Card className="min-w-[500px]">
              <CardContent>
                <p className="text-accent-3 text-sm tracking-wide mb-1">Name:</p>
                <Input placeholder="Your character name" value={userInputsJsonParsed.name}
                       onChange={e => setUserInputs(prev => {
                         return JSON.stringify({
                             ...JSON.parse(prev),
                             name: e.target.value,
                           } as UserInputType,
                         )
                       })} className="mb-5 py-6" />
                <p className="text-accent-3 text-sm tracking-wide mb-1">Age Group:</p>
                <Input placeholder="Child, Young, Teen, Adult" className="mb-5 py-6" value={userInputsJsonParsed.ageGroup}
                       onChange={e => setUserInputs(prev => {
                         return JSON.stringify({
                             ...JSON.parse(prev),
                             ageGroup: e.target.value,
                           } as UserInputType,
                         )
                       })} />
                <p className="text-accent-3 text-sm tracking-wide mb-1">Gender Identity:</p>
                <Input placeholder="Male, Female, Nonbinary, Others" className="mb-5 py-6" value={userInputsJsonParsed.genderIdentity} onChange={e => setUserInputs(prev => {
                  return JSON.stringify({
                      ...JSON.parse(prev),
                      genderIdentity: e.target.value
                    } as UserInputType
                  )
                })} />
                <p className="text-accent-3 text-sm tracking-wide mb-2">Choose a color:</p>
                <div className="flex items-center justify-between">
                  {
                    colorPick.map((option, index) => (
                      <Button key={JSON.stringify({ option, index })} onClick={() => setSeletedColor(index)}
                              variant="ghost" className={clsx([
                        `w-7 h-9 rounded-full bg-${option} hover:bg-${option}/80`,
                        'border-2 border-transparent',
                        {
                          'w-7 h-9 border-2 border-black': index == selectedColor,
                        },
                      ])} />
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </section>
        )
      }
      {
        step == '2' && (
          <section className="flex flex-col gap-3">
            <p className="text-4xl font-jost font-bold text-white text-center">Your favorites?</p>
            <Card className="min-w-[500px]">
              <CardContent>
                <p className="text-accent-3 text-sm tracking-wide mb-1">Favorite Color:</p>
                <Input placeholder="ex. Blue, Red, Green, Rainbow" className="mb-5 py-6" />
                <p className="text-accent-3 text-sm tracking-wide mb-1">Favorite Food:</p>
                <Input placeholder="ex. Pizza, Pasta, " className="mb-5 py-6" />
                <p className="text-accent-3 text-sm tracking-wide mb-1">Favorite Animal:</p>
                <Input placeholder="ex. Dogs, Cats, Dragons, Unicorn" className="mb-5 py-6" />
              </CardContent>
            </Card>
          </section>
        )
      }
      <Button variant="accent" size="lg" className="min-w-[200px] rounded-full" onClick={() => {
        if (step == '1') setSearchParams({ step: '2' })
        if (step == '2') alert('Next page')
      }}>Next</Button>
    </div>
  )
}
