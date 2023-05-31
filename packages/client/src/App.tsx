import React from 'react'
import MainLayout from './components/templates/MainLayout'
import Welcome from './pages/welcome'
import { useAtom, useAtomValue } from 'jotai'
import { activePage_atom } from './atoms/globalAtoms'
import CreatePlayerNew from './pages/create-player-new'
import Game from './pages/game'
import DEV from './pages/DEV'
import { useMUD } from './MUDContext'
import useGame from './hooks/useGame'
import usePlayerExisting from './hooks/usePlayerExisting'
import LoadingScreen from './components/shared/LoadingScreen'
import { ChooseAvatar } from './pages/choose-avatar'

export const App = () => {
  const [activePage, setActivePage] = useAtom(activePage_atom)


  const { data, isSuccess, isError, isLoading } = usePlayerExisting()

  // React.useEffect(() => {
  //   if (isLoading) console.log('CHECK FOR PLAYER: loading!!!')
  //   if (isError) return
  //   if (isSuccess) {
  //     console.log('CHECK FOR PLAYER: ', data)
  //     if (data) setActivePage('game')
  //   }
  // }, [data])
  //
  // console.log({ isLoading })

  if (isLoading) return <LoadingScreen message='Loading initial data...' />

  const tempImgLinks: string[] = [
    'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg',
    'src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0.jpg',
    'src/assets/Leonardo_Select_Adult_Female_Bluish_Asian_Elf_Long_white_wavy_0.jpg'
  ]


  return (
    <MainLayout>
      {
        activePage == 'welcome' && <Welcome />
      }
      {
        activePage == 'create' && <CreatePlayerNew />
      }
      {
        activePage == 'game' && <Game />
      }
      {
        activePage == 'dev' && <DEV />
      }
      {
        activePage == 'choose-avatar' && <ChooseAvatar avatars={tempImgLinks}/>
      }
    </MainLayout>
  );
};
