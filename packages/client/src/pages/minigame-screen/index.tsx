import React from 'react'
import { clsx } from 'clsx'
import { Card } from '@/components/base/Card'
import { Button } from '@/components/base/Button'
import useQueue from '@/hooks/minigame/useQueue'
import { Entity } from '@latticexyz/recs'

export default function MinigameScreen(){
  const { battleQueue, setLocationEntity } = useQueue()

  const [isInsideBattle, setIsInsideBattle] = React.useState(false)

  React.useEffect(() => {
      setLocationEntity("0x0000000000000000000000000000000000000000000000000000000000000002" as Entity)
  }, [])

  React.useEffect(() => {
    if (battleQueue) {
      console.log("BATTLE QUEUE", battleQueue)
      if (battleQueue.playerId?.playerId) {
        setIsInsideBattle(true)
      }
    }
  }, [battleQueue])

  return(
    <React.Fragment>
      <div className={clsx(['max-w-[1920px] mx-auto max-h-[1080px] h-full w-full', 'overflow-hidden', 'relative flex justify-center items-center'])}>
        <div className={clsx(['h-[75%] max-w-[90%] w-full', 'relative', 'mt-[5rem]' ])}>
          <div className={clsx(['h-full', 'flex', 'gap-3' ])}>
            <div className={clsx(['w-[375px]', 'flex-none'])}>
              <Card className={clsx(['max-h-[684px] h-full', 'border border-accent rounded-2xl', 'bg-modal bg-cover bg-center bg-no-repeat'])}>
                <div className={clsx(['h-full', 'px-sm py-md', 'flex flex-col'])}>
                  <div className={clsx(['text-center'])}>
                    <p className={clsx(['text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]'])}>Time Limit</p>
                    <h1 className={clsx(['text-accent text-[76px] leading-[121px]', 'uppercase font-amiri'])}>01:00</h1>
                  </div>

                  {/*Player Card*/}
                  <div className={clsx(['max-h-[130px] h-full', 'relative', 'bg-option-13', 'rounded-lg'])}>
                    <div className={clsx(['flex items-center gap-2', 'm-sm'])}>
                      {/*Player Image*/}
                      <div className={clsx(['flex-none','w-[100px] h-[100px]', 'border border-[#2C3B47] rounded-full'])}>

                      </div>

                      {/*Player Status Win / Loss*/}
                      <div className={clsx(['flex items-center', 'w-full h-full'])}>
                        <div className={clsx(['flex flex-col w-full'])}>
                          <div className={clsx(['flex flex-row', 'text-[30px] text-left leading-[48px] text-accent', 'font-amiri'])}>
                            <h3 className={clsx(['basis-11/12', 'ml-md'])}>Win</h3>
                            <h3 className={clsx(['px-2', 'basis-1/12'])}>0</h3>
                          </div>

                          <div className={clsx(['flex flex-row', 'text-[30px] leading-[48px] text-dangerAccent', 'font-amiri'])}>
                            <h3 className={clsx(['basis-11/12', 'ml-md'])}>Loss</h3>
                            <h3 className={clsx(['px-2', 'basis-1/12'])}>0</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*Battle Points*/}
                    <div className={clsx(['w-full', 'absolute -bottom-[1.8rem] left-0', 'px-2'])}>
                      <div className={clsx(['flex justify-between', 'px-2', 'border border-accent rounded-lg', 'bg-[#16150A]', 'text-[14px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.28px]'])}>
                        <p>???</p>
                        <p>?BP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>


            <div className={clsx(['w-full h-full text-center', 'flex-1', 'relative'])}>
              <img src={'/src/assets/minigame/img_battle_chair.png'} alt={'Chair Icon'} className={clsx('absolute left-[50%] top-[39%] -translate-y-1/2 -translate-x-1/2 w-[740px] h-auto')}/>

              {
                isInsideBattle ?  <div className={clsx(['bg-lining bg-cover h-[64px] w-[980px] z-10 flex items-center justify-center gap-3', 'absolute mx-auto left-[50%] top-1/2 -translate-y-2/4 -translate-x-1/2'])}>
                  <img src={'src/assets/svg/hourglass.svg'} alt={'Hourglass Icon'} className={'animate-custom-spin h-[30px] w-[18px]'} />
                  <p className={clsx([ 'text-3xl font-amiri text-white mt-1.5' ])}>Waiting for the other player</p>
                </div> : null
              }

              <img src={'/src/assets/minigame/img_battle_table.png'} alt={'Chair Icon'} className={'absolute left-[50%] bottom-[14%] translate-y-1/2 -translate-x-1/2 w-[965px] h-auto'}/>
            </div>

            <div className={clsx(['w-[375px]', 'flex-none'])}>
              <Card className={clsx(['max-h-[678px] h-full', 'border border-accent rounded-2xl', 'bg-modal bg-cover bg-center bg-no-repeat'])}>
                <div className={clsx(['h-full', 'px-sm py-md', 'flex flex-col'])}>
                  <div className={clsx(['flex items-center justify-between'])}>
                    <p className={clsx(['text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]'])}>Battle Logs</p>
                    <Button size={'icon'} variant={'icon'}>
                      <img src={'/src/assets/minigame/icon_help.svg'} alt={'Guide Icon'} />
                    </Button>
                  </div>

                  <div className={clsx(['h-[648px]', 'overflow-y-auto', 'flex flex-col', 'mt-sm', 'rounded-lg bg-option-13', 'text-[20px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.4px]'])}>
                    <p className={clsx(['pt-sm px-3'])}>You've set up a battle camp.</p>
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
