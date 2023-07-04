import React from 'react'
import { clsx } from 'clsx'
import ConversationDialog from '@/components/base/Dialog/FormDialog/ConversationDialog'
import { ButtonWrapper, Footer, HourglassLoader } from '@/components/base/Footer'
import { ButtonPropType } from '@/components/base/Dialog/FormDialog/DialogWidget'
import { Button, ButtonProps } from '@/components/base/Button'
import SubLayout from '@/components/layouts/MainLayout/SubLayout'
import usePlayer from '@/hooks/usePlayer'
import useLocation from '@/hooks/useLocation'
import useLocationInteraction from '@/hooks/useLocationInteraction'
import { IPFS_URL_PREFIX } from '@/global/constants'

export default function CurrentLocationScreen() {
  const { player } = usePlayer()
  const { location } = useLocation(player.location?.value ?? undefined)
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)

  const { generateLocationInteraction, createLocationInteraction } = useLocationInteraction()
  const isDataReady = !!player.config?.value && !!location.config?.value

  let variant: ButtonProps['variant']

  if (player && player.karmaPoints !== undefined) {
    const karmaPoints = player.karmaPoints.value;
    if (karmaPoints <= -15) {
      variant = 'evil';
    } else if (karmaPoints >= 15) {
      variant = 'good';
    } else {
      variant = 'neutral';
    }
  } else {
    variant = 'neutral';
  }

  React.useEffect( () => {
    if (isDataReady) {
      generateLocationInteraction.mutate()
      createLocationInteraction.mutate({ choiceId: 0 })
    }
  }, [isDataReady])

  const handleInteraction = (choiceId: number) => {
    createLocationInteraction.mutateAsync({choiceId})
      .then(() => generateLocationInteraction.mutate())
  }

  const buttonOptions: Array<ButtonPropType> = [
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.options.good.choice,
      variant: variant,
      size: 'btnWithBgImg',
      action: () => handleInteraction(3),
    },
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.options.neutral.choice,
      variant: variant,
      size: 'btnWithBgImg',
      action: () => handleInteraction(2),
    },
    {
      title: generateLocationInteraction.data && generateLocationInteraction.data?.options.evil.choice,
      variant: variant,
      size: 'btnWithBgImg',
      action: () => handleInteraction(1),
    },
  ]

  return (
    <React.Fragment>
      <SubLayout>
        <SubLayout.VisualSummaryLayout summary={generateLocationInteraction.data?.scenario}
                                       setIsOpen={() => setIsOpen(true)}>
          {
            location.imgHash === undefined  ?
              <div className={'bg-[#485476] flex items-center justify-center w-full h-full rounded-l-2xl animate-pulse'} >
                <div className={'border border-4 rounded-full p-10 text-center'}>
                  <img src={'src/assets/svg/ai-logo.svg'} alt={'AI Logo'} className={'h-10 w-10'}/>
                </div>
              </div>
              :
              <img
                src={`${IPFS_URL_PREFIX}/${location.imgHash.value}`}
                alt={'Location'}
                className={clsx([
                  'object-cover w-full h-full',
                  'rounded-l-2xl', '',
                ])}
              />
          }
        </SubLayout.VisualSummaryLayout>
      </SubLayout>
      <Footer>
        {
          generateLocationInteraction.isLoading || generateLocationInteraction.data === undefined ?
            <HourglassLoader>Loading Resources...</HourglassLoader>
            :
            <ButtonWrapper>
              {
                buttonOptions.map((btn, key) => (
                  <Button key={key} variant={btn.variant} size={btn.size} onClick={btn.action}>{btn.title}</Button>
                ))
              }
            </ButtonWrapper>
        }
      </Footer>
      <ConversationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} />
    </React.Fragment>
  )
}
