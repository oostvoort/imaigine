import React from 'react'
import Header from '../../components/shared/Header'
import Content from '../../components/shared/Content'
import Footer from '../../components/shared/Footer'
import LocationDialog from '../../components/LocationDialog'
import AnimalDialog from '../../components/AnimalDialog'
import ProfileDialog from '../../components/ProfileDialog'
import SettingsDialog from '../../components/SettingsDialog'
import HistoryDialog from '../../components/HistoryDialog'

const TARGETS = [ 'location', 'npc', 'item', 'animal' ] as const

const fakeData = {
  actions: [
    {
      id: '1',
      description: 'Explore surroundings'
    },
    {
      id: '2',
      description: 'Follow the nearest trail'
    },
    {
      id: '3',
      description: 'Succumb to panic'
    }
  ],
  content: {
    img: {
      src: "src/assets/RPG_40_masterpiece_best_quality_ultradetailed_illustration_no_0 (1).jpg"
    },
    text: "Alice opened her eyes, finding herself in Mystic Forest an unfamiliar land. " +
      "She stood at the foot of a towering mountain range known as the Everpeak Mountains, it's snow-capped peaks reaching for the heavens. " +
      "Nearby, a babbling river called the Silverstream flowed gracefully through the lush green fields." +
      "A friendly NPC named Eleanor the Dryad approached, offering a warm smile and a map of the realm." +
      "In the distance, Alice spotted a mystical artifact called the Crimson Crystal shimmering with ancient power," +
      "while a peculiar creature known as a Glimmerwing fluttered nearby, its iridescent wings captivating her gaze",
    targets: [
      {
        id: '1',
        name: 'Everpeak Mountains',
        type: TARGETS[0]
      },
      {
        id: '2',
        name: 'Silverstream',
        type: TARGETS[0]
      },
      {
        id: '3',
        name: 'Eleanor the Dryad',
        type: TARGETS[1]
      },
      {
        id: '4',
        name: 'Crimson Crystal',
        type: TARGETS[2]
      },
      {
        id: '5',
        name: 'Glimmerwing',
        type: TARGETS[3]
      }
    ]
  }
}

const Location = () => {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false)

  const [ isPlayerNavModalOpen, setIsPlayerNavModalOpen ] = React.useState<{
    profile: boolean,
    history: boolean,
    settings: boolean
  }>({
    profile: false,
    history: false,
    settings: false,
  })

  const [ target, setTarget ] = React.useState<any>({})

  const openPlayerNavModal = (modalType: string) => {
    setIsPlayerNavModalOpen(prevState => ({
      ...prevState,
      [modalType]: true
    }))
  }

  const closePlayerNavModal = (modalType: string) => {
    setIsPlayerNavModalOpen(prevState => ({
      ...prevState,
      [modalType]: false
    }))
  }

  const handleAction = (actionId: string) => {
    console.log('Player picked:', actionId)
  }

  return (
    <React.Fragment>
      <div className={'flex flex-col bg-[#273541]'}>
        <Header openModal={openPlayerNavModal} />
        <Content
          img={fakeData.content.img}
          text={fakeData.content.text}
          targets={fakeData.content.targets}
          onTarget={(target) => {
            setTarget({ target })
            setIsOpen(true)
          }}
        />
        <Footer actions={fakeData.actions} onAction={handleAction} />
      </div>
      {
        target && (
          <React.Fragment>
            {target.target?.type == 'location' &&
              <LocationDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} locationInfo={target} />}
            {(target.target?.type == 'animal' || target.target?.type == 'item') &&
              <AnimalDialog isOpen={isOpen} setOpen={value => setIsOpen(value)} itemInfo={target} />}
          </React.Fragment>
        )
      }
      {
        isPlayerNavModalOpen.profile && <ProfileDialog isOpen={true} setOpen={() => closePlayerNavModal('profile')} />
      }
      {
        isPlayerNavModalOpen.history && (
          <HistoryDialog isOpen={true} setOpen={() => closePlayerNavModal('history')} />
        )
      }
      {
        isPlayerNavModalOpen.settings && (
          <SettingsDialog
            name={'Alice'}
            privateKey={'********************************************************************************************************'}
            isOpen={true}
            setOpen={() => closePlayerNavModal('settings')}
          />
        )
      }
    </React.Fragment>
  )
}

export default Location
