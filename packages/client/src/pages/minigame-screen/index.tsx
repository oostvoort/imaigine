import React from 'react'
import { clsx } from 'clsx'
import { Card, CardTimer, PlayerScoreBoard } from '@/components/base/Card'
import { Button } from '@/components/base/Button'
import { IPFS_URL_PREFIX } from '@/global/constants'
import usePlayer from '@/hooks/usePlayer'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Template from '@/components/layouts/MainLayout'
import { Entity } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { formatTime, getFromIPFS } from '@/global/utils'
import { useQuery } from '@tanstack/react-query'
import usePlay from '@/hooks/minigame/usePlay'
import { BattleOptions } from '@/hooks/minigame/types/battle'
import { useAtom } from 'jotai'
import { countdown_atom, hash_options_set_value } from '@/states/minigame'
import useHistory from '@/hooks/minigame/useHistory'
import useLeave from '@/hooks/minigame/useLeave'
import { activeScreen_atom, SCREENS } from '@/states/global'
import DialogWidget from '@/components/base/Dialog/FormDialog/DialogWidget'
import { BattleGuide } from '@/components/base/Dialog/FormDialog/DialogContent/BattleGuide'


const useGetFromIPFS = (ipfsHash: string, key?: string) => {
  return useQuery(
    {
      queryKey: [ 'ipfs', ipfsHash, key ],
      queryFn: async () => await (await getFromIPFS(ipfsHash)).json() as {
        name: string,
        description: string,
        battlePoints: number,
        image: string,
        battleWinResult: number,
        battleLossResult: number,
      },
      enabled: !!ipfsHash,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  )
}

export default function MinigameScreen() {
  const { player } = usePlayer()
  const { getBattleResult, getWinnerInfo } = useHistory(player.id as Entity)
  const { playdata } = usePlay(player.location?.value as Entity)
  const { leave } = useLeave(player.location?.value as Entity)
  const {
    battleData,
    battleTime,
    playerInfo,
    opponentInfo,
    opponentBattleData,
    lockIn,
    rematch,
    setBattlePreResult,
    setLockBattle,
    onSelectOptions,
  } = useBattle(player.id as Entity)

  const [ , setActiveScreen ] = useAtom(activeScreen_atom)
  const [ , setHashAtom ] = useAtom(hash_options_set_value)
  const [ countdown, setCountdown ] = useAtom(countdown_atom)

  const [ selectedWeapon, setSelectedWeapon ] = React.useState<number>(3)
  const [ showWeapon, setShowWeapon ] = React.useState<boolean>(false)
  const [ showPrompt, setShowPrompt ] = React.useState<boolean>(false)
  const [ remainingTime, setRemainingTime ] = React.useState<number>(0)
  const [ isChooseWeaponComponent, setIsChooseWeaponComponent ] = React.useState<boolean>(true)
  const [ isMatchResultComponent, setIsMatchResultComponent ] = React.useState<boolean>(false)

  const [ key, setKey ] = React.useState<number>(0)
  const [ timerSeconds, setTimerSeconds ] = React.useState<number>(0)

  const playersInMatch = playdata.opponent?.playerId !== player.id
  const isWaitingForOpponent = battleData.battle?.opponent === undefined || battleData.battle?.opponent === '0x0000000000000000000000000000000000000000000000000000000000000000'

  const _opponentInfo = useGetFromIPFS(opponentInfo?.config?.value ?? '', 'opponent')
  const _playerInfo = useGetFromIPFS(playerInfo?.config?.value ?? '', 'player')

  const hasOpponentSelectedWeapon = opponentBattleData.battle?.hashedOption === '0x0000000000000000000000000000000000000000000000000000000000000000'

  if (_opponentInfo.isSuccess) {
    _opponentInfo.data.image = opponentInfo?.image?.value ?? ''
    _opponentInfo.data.battlePoints = Number(opponentInfo.battlePoints?.value ?? '0')
    _opponentInfo.data.battleWinResult = Number(opponentInfo.battleResults?.totalWins ?? '0')
    _opponentInfo.data.battleLossResult = Number(opponentInfo.battleResults?.totalLoses ?? '0')
  }

  if (_playerInfo.isSuccess) {
    _playerInfo.data.image = playerInfo?.image?.value ?? ''
    _playerInfo.data.battlePoints = Number(playerInfo.battlePoints?.value ?? '0')
    _playerInfo.data.battleWinResult = Number(playerInfo.battleResults?.totalWins ?? '0')
    _playerInfo.data.battleLossResult = Number(playerInfo.battleResults?.totalLoses ?? '0')
  }

  React.useEffect(() => {
    if (playersInMatch) {
      if (selectedWeapon !== 3 && !hasOpponentSelectedWeapon) {
        setIsChooseWeaponComponent(false)
        const currentTime = Math.floor(Date.now() / 1000)

        setLockBattle.mutateAsync().then(() => {
          setBattlePreResult.mutateAsync().then(() => {
            setShowWeapon(true)

            lockIn.mutate()

            const delayRoundResultPrompt = setTimeout(() => setShowPrompt(true), 1000)

            const nextRound = setTimeout(() => {
              setSelectedWeapon(3)
              setShowWeapon(false)
              setShowPrompt(false)
              setIsChooseWeaponComponent(true)

              setHashAtom({ key: '', data: BattleOptions.NONE, timestamp: 0 })
              rematch.mutateAsync(false).finally(() => {
                  setKey(prevkey => prevkey + 1)
              })
            }, 3000)

            localStorage.setItem('test', JSON.stringify(currentTime + 10))

            return () => {
              clearTimeout(delayRoundResultPrompt)
              clearTimeout(nextRound)
            }
          })
        })

        // const getTime = localStorage.getItem('test')
        //
        // if(Number(getTime) === currentTime){
        // }
      }
    }
  }, [ playersInMatch, selectedWeapon, hasOpponentSelectedWeapon ])

  // React.useEffect(() => {
  //   if (playersInMatch) {
  //     if (selectedWeapon !== 3 && !hasOpponentSelectedWeapon || countdown <= 1 && selectedWeapon !== 3 && !hasOpponentSelectedWeapon) {
  //       setIsChooseWeaponComponent(false)
  //
  //       setLockBattle.mutateAsync().then(() => {
  //         setBattlePreResult.mutateAsync().then(() => {
  //           setShowWeapon(true)
  //
  //           lockIn.mutate()
  //
  //           const delayRoundResultPromt = setTimeout(() => {
  //             setShowPrompt(true)
  //           }, 1000)
  //
  //           const nextRound = setTimeout(() => {
  //             setSelectedWeapon(3)
  //             setShowWeapon(false)
  //             setShowPrompt(false)
  //             setIsChooseWeaponComponent(true)
  //
  //             setHashAtom({ key: '', data: BattleOptions.NONE, timestamp: 0 })
  //             rematch.mutate(false)
  //           }, 4000)
  //
  //           return () => {
  //             clearTimeout(delayRoundResultPromt)
  //             clearTimeout(nextRound)
  //           }
  //         })
  //       })
  //     }
  //   }
  // }, [ playersInMatch, battleTime.end, selectedWeapon, hasOpponentSelectedWeapon ])

  // React.useEffect(() => {
  //   if(!playersInMatch) return
  //
  //   if (countdown == 1 && !hasOpponentSelectedWeapon) {
  //     //Forfeit
  //     lockIn.mutate()
  //     setSelectedWeapon(3)
  //     setShowWeapon(false)
  //     setShowPrompt(false)
  //     setCountdown(10)
  //     setHashAtom({ key: '', data: BattleOptions.NONE, timestamp: 0 })
  //     rematch.mutate(true)
  //     leave.mutate()
  //     setActiveScreen(SCREENS.CURRENT_LOCATION)
  //   }
  // }, [ countdown, hasOpponentSelectedWeapon ])

  React.useEffect(() => {
    if (!playersInMatch) setRemainingTime(0)

    if (playersInMatch) {
      const interval = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000)
        const timeDifference = battleTime.end - currentTime

        if (timeDifference > 0) {
          setRemainingTime(timeDifference)
        } else {
          setRemainingTime(0)
          clearInterval(interval)
          setIsMatchResultComponent(true)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [ battleTime.end, playersInMatch ])

  function handleLeaveBattle() {
    try {
      leave.mutate()
      setActiveScreen(SCREENS.CURRENT_LOCATION)
      setCountdown(10)
    } catch (e) {
      console.error(e)
    }
  }

  function displayGameResult() {
    // if (hasOpponentSelectedWeapon) return 'Forfeit'
    if (getBattleResult.isWin == 'Draw') return 'Draw'
    if (getBattleResult.isWin) return 'Victory!'
    if (!getBattleResult.isWin) return 'Defeat!'
  }

  function displayRoundResult(battleDataOutcome: number) {
    if (battleDataOutcome === 1) return 'You Win!'
    if (battleDataOutcome === 2) return 'You Lost!'
    if (battleDataOutcome === 3) return 'Draw'

    return ''
  }

  function displayWeapon(battleOption: number | undefined) {
    if (battleOption === 1) return '/assets/minigame/icon_rps_sword.jpg'
    if (battleOption === 2) return '/assets/minigame/icon_rps_scroll.jpg'
    if (battleOption === 3) return '/assets/minigame/icon_rps_potion.jpg'

    return ''
  }

  const weapons = [
    {
      src: '/assets/minigame/icon_rps_sword.jpg',
      alt: 'Sword Icon',
      onClick: async () => {
        setSelectedWeapon(0)
        await onSelectOptions(BattleOptions.Sword)
      },
    },
    {
      src: '/assets/minigame/icon_rps_scroll.jpg',
      alt: 'Scroll Icon',
      onClick: async () => {
        setSelectedWeapon(1)
        await onSelectOptions(BattleOptions.Scroll)
      },
    },
    {
      src: '/assets/minigame/icon_rps_potion.jpg',
      alt: 'Potion Icon',
      onClick: async () => {
        setSelectedWeapon(2)
        await onSelectOptions(BattleOptions.Potion)
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
                  <CardTimer timer={formatTime(remainingTime)} />

                  <div className={clsx([ ' mt-lg mb-md h-full', 'relative', 'flex flex-col justify-between' ])}>
                    <PlayerScoreBoard
                      isLoading={_opponentInfo.isLoading}
                      name={_opponentInfo.data ? _opponentInfo.data.name : '???'}
                      imgSrc={`${IPFS_URL_PREFIX}/${_opponentInfo.data?.image}`}
                      battlePoints={_opponentInfo.isSuccess ? Number(_opponentInfo.data?.battlePoints) : '?'}
                      win={_opponentInfo.isSuccess ? String(_opponentInfo.data?.battleWinResult) : '0'}
                      loss={_opponentInfo.isSuccess ? String(_opponentInfo.data?.battleLossResult) : '0'}
                    />

                    <div className={clsx([ 'w-full h-full', 'relative', 'mt-[1.8rem]' ])}>
                      <img src={'/assets/minigame/icon_battle.png'} alt={'Battle Icon'}
                           className={clsx([ 'w-[64px] h-[64px] object-cover', 'absolute left-1/2 top-1/2', { 'zoomHidden': isWaitingForOpponent }, { 'zoomActive': !isWaitingForOpponent } ])} />
                    </div>

                    <PlayerScoreBoard
                      isLoading={_playerInfo.isLoading}
                      name={_playerInfo.data ? 'YOU' : '???'}
                      imgSrc={`${IPFS_URL_PREFIX}/${_playerInfo.data?.image}`}
                      battlePoints={_playerInfo.isSuccess ? Number(_playerInfo.data?.battlePoints) : '?'}
                      win={_playerInfo.isSuccess ? String(_playerInfo.data?.battleWinResult) : '0'}
                      loss={_playerInfo.isSuccess ? String(_playerInfo.data?.battleLossResult) : '0'}
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
                  ? <img src={`${IPFS_URL_PREFIX}/${_opponentInfo.data?.image}`} alt={''}
                         className={clsx([ { 'hidden': _opponentInfo.data?.image === undefined }, 'h-[373px] w-[290px]', 'absolute left-1/2 top-[15%] -translate-y-1/2 -translate-x-1/2', 'rounded-3xl', { 'hidden': battleData.battle === undefined || isWaitingForOpponent } ])}
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
              <Template.MinigameLayout.WaitingForOpponent>
                {
                  isWaitingForOpponent || isWaitingForOpponent ?
                    <React.Fragment>
                      <div
                        className={clsx(['bg-lining bg-cover h-[64px] w-[980px]', 'flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                        <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'}
                             className={'animate-custom-spin h-[30px] w-[18px]'} draggable={false} />
                        <p className={clsx([ 'text-3xl font-amiri text-white mt-1.5', '' ])}>Waiting for the other
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
                    </React.Fragment> : null
                }
              </Template.MinigameLayout.WaitingForOpponent>


              {/*Comparison of Weapons*/}
              <Template.MinigameLayout.MatchComparison
                className={clsx([ { 'hidden': isChooseWeaponComponent || isMatchResultComponent } ])}>
                {/*Opponent Weapon*/}
                <div
                  className={clsx([ { 'zoomHidden': !showWeapon }, { 'zoomActive': showWeapon }, 'w-[136px] h-[136px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 top-[33%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <img src={displayWeapon(opponentBattleData.battlePreResults?.option)} alt={''} loading={'eager'}
                       className={clsx([ 'rounded-full' ])} draggable={false} />
                </div>

                {/*Player Weapon*/}
                <div
                  className={clsx([ { 'zoomHidden': !showWeapon }, { 'zoomActive': showWeapon }, 'w-[190px] h-[190px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 bottom-[10%] -translate-y-2/4 -translate-x-1/2' ])}>
                  <img src={displayWeapon(battleData.battlePreResults?.option)} alt={''}
                       className={clsx([ 'rounded-full' ])} draggable={false} />
                </div>

                <div
                  className={clsx([ { 'zoomHidden': !showPrompt }, { 'zoomActive': showPrompt }, 'bg-liningBig h-[134px] w-[980px] flex flex-col items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-[46%] ' ])}>
                  <p
                    className={clsx([ 'text-[68px]', 'font-amiri uppercase leading-[36px] mt-4', { 'text-dangerAccent': Number(battleData.battle?.outcome) === 2 }, { 'text-option-8': Number(battleData.battle?.outcome) !== 2 } ])}>{displayRoundResult(Number(battleData.battle?.outcome))}</p>
                  <p
                    className={clsx([ 'hidden text-sm text-accent', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>Next
                    Round Starts in 3...</p>
                </div>
              </Template.MinigameLayout.MatchComparison>

              {/*Status of match*/}
              <Template.MinigameLayout.MatchStatus
                className={clsx([ { 'zoomHidden relative': !playersInMatch || !isMatchResultComponent } ])}>
                <div
                  className={clsx([ 'bg-liningBig h-[134px] w-[980px] flex flex-col items-center justify-center gap-3', 'absolute left-1/2 top-1/2', { 'zoomHidden': !isMatchResultComponent }, { 'zoomActive': isMatchResultComponent } ])}>
                  <p
                    className={clsx([ 'text-[68px]  ', 'font-amiri uppercase leading-[36px] mt-4', { 'text-dangerAccent': !getBattleResult?.isWin }, { 'text-option-8': getBattleResult?.isWin || getBattleResult?.isWin == 'Draw' } ])}>{displayGameResult()}</p>
                  <p
                    className={clsx([ 'hidden text-sm text-accent', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>{`You've earned 100 battle points!`}</p>
                </div>

                <div
                  className={clsx([ 'flex flex-col gap-md', 'absolute -bottom-[10%] left-1/2', { 'zoomHidden': !isMatchResultComponent }, { 'zoomActive': isMatchResultComponent } ])}>
                  {/*<Button variant={'neutral'} size={'btnWithBgImg'} onClick={handleRematchBattle}>Rematch</Button>*/}
                  <div className={clsx([ { 'hidden': !isMatchResultComponent } ])}>
                    <Button variant={'neutral'} size={'btnWithBgImg'} onClick={handleLeaveBattle}>Leave Battle</Button>
                  </div>
                </div>
              </Template.MinigameLayout.MatchStatus>

              {/*Choosing Weapon*/}
              <Template.MinigameLayout.ChooseWeapon
                className={clsx([ { 'hidden': isWaitingForOpponent || !isChooseWeaponComponent || isMatchResultComponent } ])}>
                <div
                  className={clsx([ 'h-[96px] w-[96px]', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
                  {
                    playersInMatch &&
                    <CountdownCircleTimer
                      key={key}
                      isPlaying={true}
                      duration={10}

                      // onComplete={(totalElapsedTime) => {
                      //   setTotalElapsedTime(totalElapsedTime)
                      //   setCountdownRemainingTime(10)
                      // }}
                      onUpdate={(remainingTime) => {
                        setTimerSeconds(remainingTime)
                      }}

                      colors={'#FFBB00'}
                      size={96}
                      strokeWidth={10}
                      trailColor={'#704E00'}
                    >
                      {({ remainingTime }) => {
                        return (
                          <p
                            className={'text-[46px] leading-[121px] text-center text-[#FFBB00] font-amiri'}>{remainingTime}</p>
                        )
                      }
                      }
                    </CountdownCircleTimer>
                  }


                </div>

                <div
                  className={clsx([ 'bg-lining bg-cover h-[64px] w-[980px] flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 bottom-[25%] -translate-y-2/4 -translate-x-1/2', { 'hidden': selectedWeapon !== 3 && !hasOpponentSelectedWeapon } ])}>
                  <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'}
                       className={clsx([ 'animate-custom-spin h-[30px] w-[18px]', { hidden: !hasOpponentSelectedWeapon || selectedWeapon === 3 } ])}
                       draggable={false} />
                  <p
                    className={clsx([ 'text-3xl font-amiri text-white mt-1.5', { 'hidden': selectedWeapon !== 3 } ])}>{'Choose your weapon'}</p>
                  <p
                    className={clsx([ 'text-3xl font-amiri text-white mt-1.5', { 'hidden': selectedWeapon === 3 } ])}>{hasOpponentSelectedWeapon && 'Waiting for opponent'}</p>
                </div>

                <div
                  className={clsx([ 'flex gap-md', 'absolute left-1/2 -bottom-[10%] -translate-x-1/2 -translate-y-2/4' ])}>
                  {
                    weapons.map((weapon, key) => {
                      const isSelectedWeapon = selectedWeapon === key
                      return (
                        <button key={key} onClick={weapon.onClick} disabled={rematch.isLoading}
                                className={clsx([ 'w-[160px] h-[160px]', 'rounded-full border border-[2px] border-[#2C3B47]',
                                  { 'scale-100 opacity-100': selectedWeapon === 3 },
                                  { 'scale-100 opacity-100 border-[5px] border-option-9': isSelectedWeapon && selectedWeapon !== 3 },
                                  { 'scale-[0.8] opacity-50': rematch.isLoading },
                                ])}
                        >
                          <img src={weapon.src} alt={weapon.alt} className={clsx([ 'rounded-full' ])}
                               draggable={false} />
                        </button>
                      )
                    })
                  }
                </div>
              </Template.MinigameLayout.ChooseWeapon>
            </div>

            {/*Battle Logs*/}
            <div className={clsx(['w-[375px]', 'flex-none'])}>
              <Card className={clsx(['max-h-[678px] h-full', 'border border-accent rounded-2xl', 'bg-modal bg-cover bg-center bg-no-repeat'])}>
                <div className={clsx(['h-full', 'max-h-[678px] h-full overflow-y-auto', 'px-sm py-md', 'flex flex-col'])}>
                  <div className={clsx([ 'flex items-center justify-between', 'z-10' ])}>
                    <p
                      className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Battle
                      Logs</p>
                    <DialogWidget button={{
                      size: 'icon',
                      variant: 'icon',
                      imgSrc: '/assets/minigame/icon_help.svg',
                    }} isAvatar={false}>
                      <BattleGuide/>
                    </DialogWidget>
                  </div>

                  <div
                    className={clsx([ 'h-[648px]', 'overflow-y-auto', 'flex flex-col', 'mt-sm', 'rounded-lg bg-option-13', 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
                    {
                      getWinnerInfo.map(({ data }, index) => <p key={index}
                                                                className={clsx([ 'pt-sm px-3' ])}>  {`Round ${index + 1} ${data?.isDraw ? 'draw' : 'winner'} ${data?.isDraw ? '' : ':'} `}
                        <span
                          className={clsx([ { 'hidden': data?.isDraw } ])}>{player.id === data?.winnerId ? 'YOU' : data?.winnerInfo.name}</span>
                      </p>)
                    }
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
