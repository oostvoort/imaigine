import React from 'react'
import { clsx } from 'clsx'
import { Card, PlayerScoreBoard } from '@/components/base/Card'
import { IPFS_URL_PREFIX } from '@/global/constants'
import usePlayer from '@/hooks/usePlayer'
import Template from '@/components/layouts/MainLayout'
import { Entity } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { BATTLE_OPTIONS, BATTLE_OUTCOME } from '@/hooks/minigame/types/battle'
import useHistory from '@/hooks/minigame/useHistory'
import DialogWidget from '@/components/base/Dialog/FormDialog/DialogWidget'
import { BattleGuide } from '@/components/base/Dialog/FormDialog/DialogContent/BattleGuide'
import useGetFromIPFS from '@/hooks/useGetFromIPFS'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { constants } from 'ethers/lib.esm'

export default function MinigameScreen() {
  const { player } = usePlayer()
  const { getWinnerInfo } = useHistory(player.id as Entity)
  const { clearLogsHistory } = useHistory(player.id as Entity)

  const {
    battleData,
    opponentBattleData,
    playerInfo,
    opponentInfo,
    lockIn,
    rematch,
    validateBattle,
    onSelectOptions,
  } = useBattle(player.id as Entity)

  const _opponentInfo = useGetFromIPFS(opponentInfo?.config?.value ?? '', 'opponent')
  const _playerInfo = useGetFromIPFS(playerInfo?.config?.value ?? '', 'player')

  const [ selectedWeapon, setSelectedWeapon ] = React.useState<number>(BATTLE_OPTIONS.NONE)
  const [ resetCountdownTimerKey, setResetCountdownTimerKey ] = React.useState<number>(0)
  const [ roundTimer, setRoundTimer ] = React.useState<number>(20)

  const playerInQueue = !battleData.battle?.opponent
  const showPrompt = !!battleData.battle?.outcome
  const showWeapon = battleData.battle?.option && opponentBattleData.battle?.option
  const pendingSelection = !battleData.battle?.option
  const playerSelectedAWeapon = battleData.battle?.hashedOption !== constants.HashZero

  const FORFEIT_DEADLINE = 15

  React.useEffect(() => {
    if (roundTimer > 0) return
    if (battleData.battle?.outcome === 0 && battleData.battle?.option !== 0) {
      const validateBattleTimeout = setTimeout(() => {
        validateBattle.mutate()
        clearLogsHistory.mutate()
        setSelectedWeapon(BATTLE_OPTIONS.NONE)
      }, 1000 * FORFEIT_DEADLINE)

      return () => clearTimeout(validateBattleTimeout)
    }
  }, [ battleData.battle?.outcome, battleData.battle?.option, roundTimer ])

  React.useEffect(() => {
    if (showPrompt) {
      const _timer = setTimeout(async () => {
        setSelectedWeapon(BATTLE_OPTIONS.NONE)
        await rematch.mutateAsync()
      }, 3000)

      return () => {
        clearTimeout(_timer)
      }
    }
  }, [ showPrompt ])

  React.useEffect(() => {
    if (battleData.battle?.deadline || opponentBattleData.battle?.deadline) {
      setResetCountdownTimerKey(prevState => prevState + 1)
    }
  }, [ battleData.battle?.deadline, opponentBattleData.battle?.deadline ])

  function displayWeapon(battleOption?: number) {
    if (battleOption === BATTLE_OPTIONS.Sword) return '/assets/minigame/icon_rps_sword.jpg'
    if (battleOption === BATTLE_OPTIONS.Scroll) return '/assets/minigame/icon_rps_scroll.jpg'
    if (battleOption === BATTLE_OPTIONS.Potion) return '/assets/minigame/icon_rps_potion.jpg'
    return ''
  }

  function displayRoundLoader() {
    if (roundTimer <= 5) return 'Decrypting data'
    if (battleData.battle?.hashedOption !== constants.HashZero && opponentBattleData.battle?.hashedOption !== constants.HashZero) return 'Waiting to finish the round timer'
    if (playerSelectedAWeapon) return 'Waiting for opponent'
    return 'Choose your weapon'
  }

  const weapons = [
    {
      src: '/assets/minigame/icon_rps_sword.jpg',
      alt: 'Sword Icon',
      onClick: async () => {
        setSelectedWeapon(BATTLE_OPTIONS.Sword)
        await onSelectOptions(BATTLE_OPTIONS.Sword)
      },
    },
    {
      src: '/assets/minigame/icon_rps_scroll.jpg',
      alt: 'Scroll Icon',
      onClick: async () => {
        setSelectedWeapon(BATTLE_OPTIONS.Scroll)
        await onSelectOptions(BATTLE_OPTIONS.Scroll)
      },
    },
    {
      src: '/assets/minigame/icon_rps_potion.jpg',
      alt: 'Potion Icon',
      onClick: async () => {
        setSelectedWeapon(BATTLE_OPTIONS.Potion)
        await onSelectOptions(BATTLE_OPTIONS.Potion)
      },
    },
  ]

  return (
    <React.Fragment>
      {/*Timer and Player Info*/}
      <Card className={'minigame-card'}>
        {/*<CardTimer timer={formatTime(remainingGameTime)} />*/}
        <div
          className={
            clsx([
              'mt-lg mb-md h-full',
              'relative',
              'flex flex-col justify-between',
            ])}>

          <PlayerScoreBoard
            name={_opponentInfo.data ? _opponentInfo.data.name : '???'}
            imgSrc={_opponentInfo.data?.image}
            battlePoints={_opponentInfo.isSuccess ? Number(_opponentInfo.data?.battlePoints) : '?'}
            win={_opponentInfo.isSuccess ? String(_opponentInfo.data?.battleWinResult) : '0'}
            loss={_opponentInfo.isSuccess ? String(_opponentInfo.data?.battleLossResult) : '0'}
          />

          <div className={clsx([ 'w-full h-full', 'relative', 'mt-[1.8rem]' ])}>
            <img src={'/assets/minigame/icon_battle.png'}
                 alt={'Battle Icon'}
                 className={
                   clsx([
                     'w-[64px] h-[64px] object-cover',
                     'absolute left-1/2 top-1/2',
                     { 'zoomHidden': playerInQueue },
                     { 'zoomActive': !playerInQueue },
                   ])}
                 draggable={false}
                 loading={'eager'}
            />
          </div>

          {
            _playerInfo.isSuccess &&
            <PlayerScoreBoard
              name={'YOU'}
              imgSrc={_playerInfo.data?.image}
              battlePoints={Number(_playerInfo.data?.battlePoints) ?? '?'}
              win={String(_playerInfo.data?.battleWinResult) ?? '0'}
              loss={String(_playerInfo.data?.battleLossResult) ?? '0'}
            />
          }
        </div>
      </Card>

      <div
        className={clsx([ ' w-full h-full text-center', 'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 ' ])}>
        {/*Chair*/}
        <img
          src={'/assets/minigame/img_battle_chair.png'}
          alt={'Chair Icon'}
          className={clsx('absolute left-1/2 top-[39%] -translate-y-1/2 -translate-x-1/2 w-[740px] h-auto')}
          draggable={false}
        />

        {/*Opponent Image In Chair*/}
        {
          _opponentInfo.data?.image ?
            <img
              src={`${IPFS_URL_PREFIX}/${_opponentInfo.data?.image}`}
              alt={`Character image of ${_opponentInfo.data?.name}`}
              className={
                clsx([
                  'h-[373px] w-[290px]',
                  'absolute left-1/2 top-[15%] -translate-y-1/2 -translate-x-1/2',
                  'rounded-3xl',
                ])}
              draggable={false}
            /> : null
        }

        {/*Table*/}
        <img
          src={'/assets/minigame/img_battle_table.png'}
          alt={'Chair Icon'}
          className={'absolute left-1/2 bottom-[14%] translate-y-1/2 -translate-x-1/2 w-[965px] h-auto'}
          draggable={false}
        />

        {/*Waiting for opponent*/}
        <Template.MinigameLayout.WaitingForOpponent
          className={clsx([ { 'hidden': battleData.battle?.opponent } ])}>
          <>
            <div
              className={clsx([ 'bg-lining bg-cover h-[64px] w-[980px]', 'flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2' ])}>
              <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'}
                   className={'animate-custom-spin h-[30px] w-[18px]'} draggable={false} />
              <p className={clsx([ 'text-3xl font-amiri text-white mt-1.5', '' ])}>Waiting for the other
                player</p>
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
          </>
        </Template.MinigameLayout.WaitingForOpponent>

        {/*Comparison of Weapons*/}
        <Template.MinigameLayout.MatchComparison
          className={clsx([ { 'hidden': !showPrompt && !showWeapon } ])}>
          {/*Opponent Weapon*/}
          <div
            className={clsx([ { 'zoomHidden': !showWeapon }, { 'zoomActive': showWeapon }, 'w-[136px] h-[136px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 top-[33%] -translate-y-2/4 -translate-x-1/2', 'delay-[3000]' ])}>
            <img src={displayWeapon(opponentBattleData.battle?.option)} alt={''} loading={'eager'}
                 className={clsx([ 'rounded-full' ])} draggable={false}
                 placeholder={'/assets/minigame/icon_rps_sword.jpg'} />
          </div>

          {/*Player Weapon*/}
          <div
            className={clsx([ { 'zoomHidden': !showWeapon }, { 'zoomActive': showWeapon }, 'w-[190px] h-[190px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'absolute left-1/2 bottom-[10%] -translate-y-2/4 -translate-x-1/2' ])}>
            <img
              src={displayWeapon(battleData.battle?.option)}
              alt={''}
              className={clsx([ 'rounded-full' ])}
              draggable={false}
              loading={'eager'}
            />
          </div>

          <div
            className={clsx([ {
              'zoomHidden': !showPrompt,
              'zoomActive': showPrompt,
            }, 'bg-liningBig h-[134px] w-[980px] flex flex-col items-center justify-center gap-3', 'absolute mx-auto left-1/2 top-[46%] ' ])}>
            <p
              className={
                clsx([
                  'text-[68px]',
                  'font-amiri uppercase leading-[36px] mt-4',
                  { 'text-dangerAccent': Number(battleData.battle?.outcome) === BATTLE_OUTCOME['You Lose!'] },
                  { 'text-option-8': Number(battleData.battle?.outcome) !== BATTLE_OUTCOME['You Lose!'] } ])}
            >
              {BATTLE_OUTCOME[(Number(battleData.battle?.outcome))]}
            </p>
            <p
              className={clsx([ 'hidden text-sm text-accent', 'font-jost font-medium uppercase tracking-[1.4px]' ])}>Next
              Round Starts in 3...</p>
          </div>
        </Template.MinigameLayout.MatchComparison>

        {/*Choosing Weapon*/}
        <Template.MinigameLayout.ChooseWeapon
          className={clsx([
            { 'hidden': playerInQueue || showPrompt || showWeapon } ])}>
          <div
            className={clsx([ 'h-[96px] w-[96px]', 'absolute mx-auto left-1/2 top-1/2 -translate-y-2/4 -translate-x-1/2', { 'hidden': roundTimer <= 0 } ])}>
            {
              !playerInQueue &&
              <CountdownCircleTimer
                key={resetCountdownTimerKey}
                isPlaying={true}
                duration={20}
                onUpdate={(remainingTime) => {
                  setRoundTimer(remainingTime)
                }}
                onComplete={() => {
                  if (!playerInQueue) {
                    lockIn.mutate(selectedWeapon)
                  }
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
            className={clsx([ 'bg-lining bg-cover h-[64px] w-[980px] flex items-center justify-center gap-3', 'absolute mx-auto left-1/2 bottom-[25%] -translate-y-2/4 -translate-x-1/2', { 'hidden': showPrompt } ])}>
            <img
              src={'/assets/svg/hourglass.svg'}
              alt={'Hourglass Icon'}
              className={clsx([ 'animate-custom-spin h-[30px] w-[18px]' ])}
              draggable={false}
            />
            <p
              className={clsx([ 'text-3xl font-amiri text-white mt-1.5' ])}>{displayRoundLoader()}</p>
          </div>

          <div
            className={clsx([ 'flex gap-md', 'absolute left-1/2 -bottom-[10%] -translate-x-1/2 -translate-y-2/4', { 'hidden': roundTimer <= 0 } ])}>
            {
              weapons.map((weapon, key) => {
                const isSelectedWeapon = selectedWeapon === key + 1
                return (
                  <button key={key} onClick={weapon.onClick}
                          disabled={!pendingSelection || roundTimer <= 5}
                          className={clsx([ 'w-[160px] h-[160px]', 'rounded-full border border-[2px] border-[#2C3B47]', 'disabled:cursor-not-allowed',
                            { 'scale-100 opacity-100': selectedWeapon === BATTLE_OPTIONS.NONE },
                            { 'scale-125 opacity-100 border-[5px] border-option-9': isSelectedWeapon },
                            { 'opacity-50': !pendingSelection || roundTimer <= 5 },
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
      <Card className={'minigame-card'}>
        <div className={clsx([ 'flex items-center justify-between' ])}>
          <p
            className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Battle
            Logs</p>
          <DialogWidget
            button={{
              className: 'z-10',
              size: 'icon',
              variant: 'icon',
              imgSrc: '/assets/minigame/icon_help.svg',
            }}
            isAvatar={false}>
            <BattleGuide />
          </DialogWidget>
        </div>

        <div
          className={clsx([ 'h-[648px]', 'overflow-y-auto', 'flex flex-col', 'mt-sm', 'rounded-lg bg-option-13', 'text-[16px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]' ])}>
          {
            getWinnerInfo.map(({ data }, index) =>
              <p key={index}
                 className={clsx([ 'pt-sm px-3' ])}>
                {`Round ${index + 1} ${data?.isDraw ? 'draw' : 'winner'} ${data?.isDraw ? '' : ':'} `}
                <span className={clsx([ { 'hidden': data?.isDraw } ])}>
                    {player.id === data?.winnerId ? 'YOU' : data?.winnerInfo.name}
                  </span>
              </p>)
          }
        </div>
      </Card>
    </React.Fragment>
  )
}
