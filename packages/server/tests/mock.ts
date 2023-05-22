import { CharacterPhysicalFeatures, CharacterStats, CharacterStory, GenerateStoryProps } from '../../types'

export const story = {
  name: 'Smokey Gold',
  summary: 'Fantasy and folklore mix in this dark and hazy world known as Smokey Gold. It is a world populated by goblin and elf, with a distinct currency known as gold in circulation. The smog that blots out the sky is a constant reminder of the decay and ruin that the inhabitants have to battle with day to day. Fights break out between enemies and allies for control of resources, and a sense of unrest is perpetually in the air. This dangerous, yet beautiful planet is a true testament of the fortitude of thegoblin and elf that inhabit it.',
}

export const location1 = {
  name: 'Rockweed Meadows',
  summary: 'Rockweed Meadows is a sprawling, windswept prairie located in Smokus, home to many of its goblins and elves. Despite it being an undeniably hazardous place, this otherwise uncivilized corner of the world is teeming with life. Its vast open world is the very center of its unique economy based on the use of gold and contains a considerable population. Unfortunately, due to its poverty level, its inhabitants are often left living in difficult circumstances. Despite the dangers present, brave adventurers can find rewards deep within the meadow, such as hidden secrets. Rockweed Meadows is a land of wonder and danger, testing those who dare to venture forth.  ',
}
export const location2 = {
  name: 'Golden Reach',
  summary: 'Golden Reach is a mountain settlement set amongst the smoky haze of Daerkoolf. Despite the ever-present struggles between goblins and elves, the two civilizations are bound together by the precious gold that flows through the mountain passes. An important trade hub for the planet, Golden Reach has been part of the economy since the earliest days of Daerkoolf, helping to bring wealth and stability to the region. The settlement has grown over the years, becoming a bustling metropolis with a middle class population and a very safe atmosphere. Both goblins and elves come to trade goods and services, unlocking the secrets of the hidden planet. Despite the unease between the two civilizations, Golden Reach remains an enduring symbol of stability in the darkened skies of Daerkoolf.',
}

export const player = {
  name: 'Gorog',
  summary: 'Gorog is a young goblin that lives in Golden Reach, a bustling mountain settlement amidst the smoky haze of Daerkoolf. Despite the ever-present struggles between goblins and elves, Gorog remains an enduring bridge to peace and stability in the region. Possessing unusual strength and a very appealing charisma, Gorog is an asset to the local economy who is eager to unlock the secrets of the hidden planet and gain more power and influence in the galaxy. He has a fat body type, is very tall, has non-bald hair and round shaped blue eyes, and his favorite color is blue.',
  initialMessage: 'Greetings! My name is Gorog.',
  closingMessage: 'Farewell!',
  visualSummary: 'Goblin, fat body type, very tall, non-bald hair, round shaped blue eyes, blue',
}

export const path = {
  name: 'Journey Through the Golden Valley',
  summary: 'Experience the peril and beauty of a journey through the Golden Valley, connecting Golden Reach to Rockweed Meadows! Venture through the edges of the legendary mountain passes and experience the never-ending struggles between goblins and elves. Set off on a thrilling expedition as you make your way through the rocky plains and turbulent rivers. Marvel at the sights of dazzling rivers and lush rolling hills, before entering the shared trade hub of Golden Reach. Meet some of its friendly locals and learn more about its fascinating culture and economy. Continue the journey and enter the mysterious Rockweed Meadows, fraught with danger, yet filled with secrets. Try your luck at escaping the powerful winds and deep crevasses of the meadows. This adventurous journey will test the fortitude of even the bravest adventurers, and promise a never-ending pursuit of glory and discovery. ',
}

export const physicalFeatures: CharacterPhysicalFeatures = {
  ageGroup: 'young',
  bodyType: 'fat',
  eyeColor: 'blue',
  eyeShape: 'round',
  genderIdentity: 'male',
  hairColor: 'bald',
  hairLength: 'none',
  hairType: 'none',
  height: 'very tall',
  race: 'goblin',
}

export const characterStats: CharacterStats = {
  charisma: 'very appealing',
  constitution: 'weak',
  dexterity: 'superfast',
  intelligence: 'mediocre',
  strength: 'mouse',
  wisdom: 'gandalf',
}
export const characterStory: CharacterStory = { favColor: 'blue' }
export const generateStoryProps: GenerateStoryProps = {
  currency: 'gold',
  races: [ 'goblin', 'elf' ],
  theme: 'dark fantasy',
  extraDescriptions: [ 'hazy smoky planet' ],
}
