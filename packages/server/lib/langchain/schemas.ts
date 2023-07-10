import { z } from "zod"


export const npcInteractionZodSchema = z.object({
  response: z.string().describe("the npc response"),
  good: z.object({
    choice: z.string().describe("the player good choice"),
    response: z.string().describe("the player say to the npc in a good manner")
  }),
  evil: z.object({
    choice: z.string().describe("the player negative choice"),
    response: z.string().describe("the player say to the npc in a negative manner")
  }),
  neutral: z.object({
    choice: z.string().describe("the player neutral choice"),
    response: z.string().describe("the player say to the npc in a neutral manner")
  })
})
export const locationInteractionZodSchema = z.object({
  scenario: z.string().describe("In the scenario, how the past events shaped the scenario. Do not mention choices in the scenario."),
  good: z.object({
    choice: z.string().describe("1 positive and benefit option that is shorten"),
    effect: z.string().describe("new scenario if the player choose the good choice, in 5 sentences")
  }),
  evil: z.object({
    choice: z.string().describe("1 negative and harmful option that is shorten"),
    effect: z.string().describe("new scenario if the player choose the evil choice, in 5 sentences")
  }),
  neutral: z.object({
    choice: z.string().describe("1 neutral and balanced option that is shorten"),
    effect: z.string().describe("new scenario if the player choose the neutral choice, in 5 sentences")
  })
})
export const summaryZodSchema = z.object({
  summary: z.string().describe("summary of the text")
})

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
  scenario: 'In the scenario, how the past events shaped the scenario. Do not mention choices in the scenario.',
  goodChoice: '1 positive and benefit option that is shorten',
  evilChoice: '1 negative and harmful option that is shorten',
  neutralChoice: '1 neutral and balanced option that is shorten',
  goodEffect: 'new scenario if the player choose the good choice, in 5 sentences',
  evilEffect: 'new scenario if the player choose the evil choice, in 5 sentences',
  neutralEffect: 'new scenario if the player choose the neutral choice, in 5 sentences',
}
export const npcInteractionSchema = {
  response: 'NPC\'s new response make it look like the NPC is talking',
  goodChoice: 'The player makes a positive and beneficial action based on the npc response. Provide a short response for this choice in 3 to 5 words.',
  evilChoice: 'The player makes a negative and harmful action based on the npc response. Provide a short response for this choice in 3 to 5 words.',
  neutralChoice: 'The player makes a neutral and balanced action based on the npc response. Provide a short response for this choice in 3 to 5 words.',
  goodResponse: 'The player makes a positive and beneficial response based on the npc response',
  evilResponse: 'The player makes a negative and harmful response based on the npc response',
  neutralResponse: 'The player makes a neutral and balanced response based on the npc response',
}
