export const locationSchema = {
  name: 'the name of the location',
  description: 'the generated description',
  visualSummary: 'a string of comma separated keywords describing the location',
}

export const playerCharacterSchema = {
  name: 'the name of the character',
  description: 'the generated description',
  visualSummary: 'a list of keywords describing the character',
}

export const nonPlayerCharacterSchema = {
  name: 'the name of the character',
  description: 'the generated description',
  initialMessage: 'the standard greeting message',
  visualSummary: 'a list of keywords describing the character',
}
export const storySchema = {
  name: 'the name of the world',
  description: 'the generated description',
}

export const locationInteractionSchema = {
  scenario: 'the scenario for player that must mention the npc on 5 sentences',
  goodChoice: "1 positive and benefit option that is shorten",
  evilChoice: "1 negative and harmful option that is shorten",
  neutralChoice: "1 neutral and balanced option that is shorten"
}
