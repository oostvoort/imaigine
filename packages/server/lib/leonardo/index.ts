import * as dotenv from 'dotenv'

dotenv.config()

export const sharedSettings = {
  sd_version: 'v1_5',
  num_images: 1,
  num_inference_steps: 30,    // between 30 and 60
  guidance_scale: 7,  // Must be between 1 and 20.
  scheduler: 'EULER_DISCRETE',
  presetStyle: 'NONE',
  tiling: false,
  public: false,
  promptMagic: false,
  controlNet: false,
}

export const promptTemplates = {
  character: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 640,
    height: 832,
    negative_prompt: 'two heads, two faces, floating limbs, disconnected limbs, watermark, text',
    prompt: 'detailed illustration of %. Theme:  fantasy, rpg, medieval. Style: lush illumination, portrait, concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration',
  },
  npc: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 640,
    height: 832,
    negative_prompt: 'two heads, two faces, floating limbs, disconnected limbs, watermark, text',
    prompt: 'detailed illustration of %. Theme:  fantasy, rpg, medieval. Style: lush illumination, portrait, concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration',
  },
  location: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 768,
    height: 768,
    negative_prompt: 'watermark, text',
    prompt: 'detailed illustration of %. Style: concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration',
  },
  item: {
    ...sharedSettings,
    modelId: '2d18c0af-374e-4391-9ca2-639f59837c85',    // Magic Items
    width: 768,
    height: 768,
    negative_prompt: 'watermark, text, overlapping, fading, multiple items, cluttered background, person, animal, alive, eyes',
    prompt: 'detailed illustration of single item only: %. Style: concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration',

  },
}

export { generatePlayerImage } from './executePrompt'

import pinataSDK from '@pinata/sdk'

export const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
})
