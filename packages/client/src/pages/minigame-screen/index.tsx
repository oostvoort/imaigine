import React from 'react'
import { clsx } from 'clsx'
import { Card, CardTimer, PlayerScoreBoard } from '@/components/base/Card'
import { Button } from '@/components/base/Button'
import { IPFS_URL_PREFIX } from '@/global/constants'
import usePlayer from '@/hooks/usePlayer'
// import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Template from '@/components/layouts/MainLayout'
import { Entity } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { getFromIPFS } from '@/global/utils'
import { useQuery } from '@tanstack/react-query'
import useGameState from '@/hooks/useGameState'
import usePlay from '@/hooks/minigame/usePlay'
import { BattleOptions } from '@/hooks/minigame/types/battle'

export default function MinigameScreen() {
  const { player } = usePlayer()
  const activeScreen = useGameState()
  const { playdata } = usePlay(player.location?.value as Entity)
  const { battleData, playerInfo, opponentInfo, onSelectOptions, lockIn } = useBattle(player.id as Entity)
  const [ selectedWeapon, setSelectedWeapon ] = React.useState<number>(3)
  // const [ countdown, setCountdown ] = React.useState<number>(10)

  const playerWaiting = playdata.opponent?.playerId === player.id
  const playersInMatch = playdata.opponent?.playerId !== player.id

  // React.useEffect(() => {
  //   if (playersInMatch) {
  //     const timer = setInterval(() => {
  //       setCountdown((prevCountdown) => {
  //         if (prevCountdown === 0) {
  //           clearInterval(timer) // Stop the timer when countdown reaches 0
  //           // Perform any actions or display a message when countdown reaches 0
  //           console.log('Countdown completed!')
  //         }
  //         return prevCountdown - 1
  //       })
  //     }, 1000)
  //
  //     return () => {
  //       clearInterval(timer)
  //     }
  //   }
  // }, [ playersInMatch ])


  const _opponentInfo = useQuery({
    queryKey: [ 'opponent-info', activeScreen, opponentInfo ],
    queryFn: async () => {
      if (!opponentInfo.config || !opponentInfo.image) throw new Error('opponent info query error: opponentInfo still undefined')
      const data = await (await getFromIPFS(opponentInfo.config.value as string)).json()
      console.log('minigame', 'Rerun')
      return {
        image: opponentInfo.image?.value,
        battlePoints: opponentInfo.battlePoints,
        name: data.name,
        description: data.description,
      }
    },
    enabled: Boolean(opponentInfo.config && opponentInfo.image),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  })

  const _playerInfo = useQuery({
    queryKey: [ 'player-info', activeScreen, playerInfo ],
    queryFn: async () => {
      if (!playerInfo.config || !playerInfo.image) throw new Error('player info query error: playerInfo still undefined')

      const data = await (await getFromIPFS(playerInfo.config.value as string)).json()
      return {
        image: playerInfo.image?.value,
        battlePoints: playerInfo.battlePoints ?? 0,
        name: data.name,
        description: data.description,
      }
    },
    enabled: Boolean(playerInfo.config && playerInfo.image),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  })

  // console.log('minigame playerInfo', playerInfo)
  // console.log('minigame opponentInfo', opponentInfo)
  console.log('minigame _opponentInfo', _opponentInfo.data)
  console.log('minigame _playerInfo', _playerInfo.data)
  console.log('minigame battleData', battleData)
  // console.log("minigame playerWaiting",  playerWaiting);
  // console.log("minigame playerInGame",  playersInMatch);
  // console.log('minigame countdown', countdown)

  const weapons = [
    {
      src: '/assets/minigame/icon_rps_sword.jpg',
      alt: 'Sword Icon',
      onClick: () => {
        setSelectedWeapon(0)
        onSelectOptions(BattleOptions.Sword)
      },
    },
    {
      src: '/assets/minigame/icon_rps_scroll.jpg',
      alt: 'Scroll Icon',
      onClick: () => {
        setSelectedWeapon(1)
        onSelectOptions(BattleOptions.Scroll)
      },
    },
    {
      src: '/assets/minigame/icon_rps_potion.jpg',
      alt: 'Potion Icon',
      onClick: () => {
        setSelectedWeapon(2)
        onSelectOptions(BattleOptions.Potion)
      },
    },
  ]

  return (
    <React.Fragment>
      <div
        className={clsx([ 'max-w-[1920px] mx-auto max-h-[1080px] h-full w-full', 'overflow-hidden', 'relative flex justify-center items-center' ])}>
        <div className={clsx([ 'h-[75%] max-w-[90%] w-full', 'relative', 'mt-[5rem]' ])}>
          <div className={clsx([ 'h-full', 'flex', 'gap-3' ])}>
            <div className={clsx([ 'w-[375px]', 'flex-none' ])}>
              <Card
                className={clsx([ 'max-h-[684px] h-full', 'border border-accent rounded-2xl', 'bg-modal bg-cover bg-center bg-no-repeat' ])}>
                <div className={clsx([ 'h-full', 'px-sm py-md', 'flex flex-col' ])}>
                  <CardTimer />

                  <div className={clsx([ 'mt-lg mb-md h-full', 'flex flex-col justify-between' ])}>
                    <PlayerScoreBoard
                      isLoading={_opponentInfo.isLoading}
                      name={_opponentInfo.data ? _opponentInfo.data.name : '???'}
                      imgSrc={`${IPFS_URL_PREFIX}/${_opponentInfo.data?.image}`}
                      battlePoints={_opponentInfo.isSuccess ? Number(_opponentInfo.data?.battlePoints) : '?'}
                    />

                    <PlayerScoreBoard
                      isLoading={_playerInfo.isLoading}
                      name={_playerInfo.data ? 'YOU' : '???'}
                      imgSrc={`${IPFS_URL_PREFIX}/${_playerInfo.data?.image}`}
                      battlePoints={_playerInfo.isSuccess ? Number(_playerInfo.data?.battlePoints) : '?'}
                    />
                  </div>
                  {/*End of Player Wrapper*/}
                </div>
              </Card>
            </div>

            <div className={clsx([ 'w-full h-full text-center', 'flex-1', 'relative' ])}>
              {/*Chair*/}
              <img src={'/assets/minigame/img_battle_chair.png'} alt={'Chair Icon'}
                   className={clsx('absolute left-1/2 top-[39%] -translate-y-1/2 -translate-x-1/2 w-[740px] h-auto')}
                   draggable={false} />

              {/*Opponent Image*/}
              {
                player.image?.value
                  ? <img src={`${IPFS_URL_PREFIX}/${player.image?.value}`} alt={''}
                         className={clsx([ 'h-[373px] w-[290px]', 'absolute left-1/2 top-[15%] -translate-y-1/2 -translate-x-1/2', 'rounded-3xl' ])}
                         draggable={false} />
                  :
                  <div
                    className={clsx([ 'h-[373px] w-[290px]', ' bg-[#485476]', 'absolute left-1/2 top-[15%] -translate-y-1/2 -translate-x-1/2', 'rounded-3xl' ])} />
              }

              {/*Table*/}
              <img src={'/assets/minigame/img_battle_table.png'} alt={'Chair Icon'}
                   className={'absolute left-1/2 bottom-[14%] translate-y-1/2 -translate-x-1/2 w-[965px] h-auto'}
                   draggable={false} />

              {/*Waiting for opponent*/}
              <Template.MinigameLayout.WaitingForOpponent
                className={clsx([ { hidden: !battleData.battle === undefined || !playerWaiting } ])}>
                {
                  battleData.battle === undefined || playerWaiting &&
                  <React.Fragment>
                    <div
                      className={clsx([ 'bg-lining bg-cover h-[64px] w-[980px] flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                      <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'}
                           className={'animate-custom-spin h-[30px] w-[18px]'} draggable={false} />
                      <p className={clsx([ 'text-3xl font-amiri text-white mt-1.5' ])}>Waiting for the other
                        player</p>

                      {/*Note*/}

                    </div>

                    <div
                      className={clsx([ 'hidden bg-noLining bg-cover h-[70px] w-[980px] flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-[62%] -translate-y-2/4 -translate-x-1/2' ])}>
                      <p
                        className={clsx([ 'text-sm text-accent text-center w-[720px]', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>
                        THERE ARE NO OTHER PLAYERS IN THE AREA. THIS MAY TAKE A WHILE. OR FOREVER. PLEASE CHECK YOUR
                          MAP FOR
                          INCOMING PLAYERS.
                        </p>
                      </div>
                    </React.Fragment>
                }


              </Template.MinigameLayout.WaitingForOpponent>

              {/*Choosing Weapon*/}
              <Template.MinigameLayout.ChooseWeapon className={clsx([ { hidden: !playersInMatch } ])}>
                <div
                  className={clsx([ 'h-[96px] w-[96px]', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                  {/*<CountdownCircleTimer*/}
                  {/*  isPlaying={true}*/}
                  {/*  duration={10}*/}
                  {/*  colors={'#FFBB00'}*/}
                  {/*  size={96}*/}
                  {/*  strokeWidth={10}*/}
                  {/*  trailColor={'#704E00'}*/}
                  {/*>*/}
                  {/*  {({ remainingTime }) => <p*/}
                  {/*    className={'text-[46px] leading-[121px] text-center text-[#FFBB00] font-amiri'}>{remainingTime}</p>}*/}
                  {/*</CountdownCircleTimer>*/}
                </div>

                <div
                  className={clsx([ 'hidden bg-lining bg-cover h-[64px] w-[980px] flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 bottom-[25%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'}
                       className={'animate-custom-spin h-[30px] w-[18px]'} draggable={false} />
                  <p className={clsx([ 'text-3xl font-amiri text-white mt-1.5' ])}>Waiting for opponent</p>
                </div>

                {/*<Button onClick={() => lockIn.mutateAsync()} variant={'neutral'} size={'btnWithBgImg'}*/}
                {/*        className={'absolute mx-auto left-1/2 bottom-[25%] -translate-y-2/4 -translate-x-1/2'}>Lock*/}
                {/*  In</Button>*/}


                <div
                  className={clsx([ 'flex gap-md', 'absolute left-1/2 -bottom-[10%] -translate-x-1/2 -translate-y-2/4' ])}>
                  {
                    weapons.map((weapon, key) => {
                      const isSelectedWeapon = selectedWeapon === key
                      return (
                        <button key={key} onClick={weapon.onClick}
                                className={clsx([ 'w-[160px] h-[160px]', 'rounded-full border border-[2px] border-[#2C3B47]', { 'border-[5px] border-option-9': isSelectedWeapon } ])}>
                          <img src={weapon.src} alt={weapon.alt} className={clsx([ 'rounded-full' ])}
                               draggable={false} />
                        </button>
                      )
                    })
                  }
                </div>
              </Template.MinigameLayout.ChooseWeapon>

              {/*Comparison of Weapons*/}
              <Template.MinigameLayout.MatchComparison className={'hidden'}>
                <div
                  className={clsx([ 'w-[136px] h-[136px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 top-[33%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <img src={'/assets/minigame/icon_rps_scroll.jpg'} alt={'Scroll Icon'}
                       className={clsx([ 'rounded-full' ])} draggable={false} />
                </div>

                <div
                  className={clsx([ 'w-[190px] h-[190px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 bottom-[10%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <img src={'/assets/minigame/icon_rps_sword.jpg'} alt={'Scroll Icon'}
                       className={clsx([ 'rounded-full' ])} draggable={false} />
                </div>

                <div
                  className={clsx([ 'bg-liningBig h-[134px] w-[980px] flex flex-col items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-[46%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <p className={clsx([ 'text-[68px]  text-option-8 ', 'font-amiri uppercase leading-[36px] mt-4' ])}>You
                    Win!</p>
                  <p
                    className={clsx([ 'text-sm text-accent', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>Next
                    Round Starts in 3...</p>
                </div>
              </Template.MinigameLayout.MatchComparison>

              {/*Status of match*/}
              <Template.MinigameLayout.MatchStatus className={'hidden'}>
                <div
                  className={clsx([ 'bg-liningBig h-[134px] w-[980px] flex flex-col items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                  <p
                    className={clsx([ 'text-[68px]  text-option-8 ', 'font-amiri uppercase leading-[36px] mt-4' ])}>Forfeit</p>
                  <p
                    className={clsx([ 'text-sm text-accent', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>{`You've earned 100 battle points!`}</p>
                </div>

                <div
                  className={clsx([ 'flex flex-col gap-md', 'absolute -bottom-[10%] left-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                  <Button variant={'neutral'} size={'btnWithBgImg'}>Wait for New Opponent</Button>
                  <Button variant={'neutral'} size={'btnWithBgImg'}>Leave Battle</Button>
                </div>
              </Template.MinigameLayout.MatchStatus>
            </div>

            <div className={clsx(['w-[375px]', 'flex-none'])}>
              <Card className={clsx(['max-h-[678px] h-full', 'border border-accent rounded-2xl', 'bg-modal bg-cover bg-center bg-no-repeat'])}>
                <div className={clsx(['h-full', 'px-sm py-md', 'flex flex-col'])}>
                  <div className={clsx(['flex items-center justify-between'])}>
                    <p className={clsx(['text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]'])}>Battle Logs</p>
                    <Button size={'icon'} variant={'icon'}>
                      <img src={'/assets/minigame/icon_help.svg'} alt={'Guide Icon'} />
                    </Button>
                  </div>

                  <div className={clsx(['h-[648px]', 'overflow-y-auto', 'flex flex-col', 'mt-sm', 'rounded-lg bg-option-13', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]'])}>
                    <p className={clsx([ 'pt-sm px-3' ])}>{`You've set up a battle camp.`}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
