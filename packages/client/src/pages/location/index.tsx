import Header from '../../components/shared/Header'
import Content from '../../components/shared/Content'
import Footer from '../../components/shared/Footer'

const TARGETS = ["location", "npc", "item", "animal"] as const

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

  const handleAction = (actionId: string) => {
    console.log('Player picked:', actionId)
  }

  return (
    <div className={"relative"}>
      <Header />
      <Content
        img={fakeData.content.img}
        text={fakeData.content.text}
        targets={fakeData.content.targets}
        onTarget={(target) => console.log({ target })}
      />
      <Footer actions={fakeData.actions} onAction={handleAction}/>
    </div>
  )
}

export default Location
