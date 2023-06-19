import * as dotenv from 'dotenv'
import pinataSDK from '@pinata/sdk'

dotenv.config()

export const sharedSettings = {
  sd_version: 'v1_5',
  num_images: 1,
  num_inference_steps: 30,    // between 30 and 60
  guidance_scale: 7,  // Must be between 1 and 20.
  scheduler: 'EULER_DISCRETE',
  tiling: false,
  public: false,
  controlNet: false,
}

export const promptTemplates: { [index: string]: any } = {
  character: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 640,
    height: 832,
    presetStyle: 'NONE',
    negative_prompt: 'two heads, two faces, poorly drawn hands, missing limbs, blurred, floating limbs, disconnected limbs, misshapen hands, blurry, out of focus, two different eyes, strange eyes, unclear eyes, watermarks, text, long neck',
    prompt: 'detailed illustration of %, a portrait, fantasy, rpg, medieval. lush illumination, concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration, face on golden ratio',
  },
  npc: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 640,
    height: 832,
    presetStyle: 'NONE',
    negative_prompt: 'two heads, two faces, poorly drawn hands, missing limbs, blurred, floating limbs, disconnected limbs, misshapen hands, blurry, out of focus, two different eyes, strange eyes, unclear eyes, watermarks, text, long neck',
    prompt: 'detailed illustration of %. Theme:  fantasy, rpg, medieval. Style: lush illumination, portrait, concept art, Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha, line-art illustration',
  },
  location: {
    ...sharedSettings,
    modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61',    // Rpg4.0
    width: 1088,
    height: 608,
    presetStyle: 'LEONARDO',
    negative_prompt: 'watermark, text',
    prompt: 'detailed illustration of %, a place, fantasy, rpg, medieval. concept art, trending on artstation, lush illumination, high contrast, vibrant, Greg Rutkowski, Artgerm, WLOP, line-art illustration',
  },
  item: {
    ...sharedSettings,
    modelId: '2d18c0af-374e-4391-9ca2-639f59837c85',    // Magic Items
    width: 768,
    height: 768,
    presetStyle: 'LEONARDO',
    promptMagic: true,
    negative_prompt: 'watermark, text, overlapping, fading, multiple items, cluttered background, person, animal, alive, eyes',
    prompt: 'ultra-detailed illustration of a %, an item, lush illumination, high contrast, front view, digital painting, game art, game item',

  },
}

export { generatePlayerImage, generateLocationImage, generateItemImage, generateNpcImage } from './executePrompt'

export const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
})
