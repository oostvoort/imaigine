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
  scenario: 'In the scenario, mention how the player sees the NPC, and how the past events shaped the scenario. Do not mention choices in the scenario.',
  goodChoice: "1 positive and benefit option that is shorten",
  evilChoice: "1 negative and harmful option that is shorten",
  neutralChoice: "1 neutral and balanced option that is shorten",
  goodEffect: "new scenario if the player choose the good choice, in 5 sentences",
  evilEffect: "new scenario if the player choose the evil choice, in 5 sentences",
  neutralEffect: "new scenario if the player choose the neutral choice, in 5 sentences",
}
