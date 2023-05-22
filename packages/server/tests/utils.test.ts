import { cleanAiJsonAnswer } from '../lib/openai/utils'

describe('Test utils', function () {

  it('should properly clean AI answers with prefix', async function () {
    const answer = `Answer:{"name":"Gorog","summary":"Gorog agreed to help Yellena clean up the forge. In exchange for his help, he will receive a sword for free.","dialog":"That would be wonderful, Gorog! I'm sure the forge will be as good as new after you're finished.","inventoryChange":{"itemAdded":"Sword"},"goldChange":{"goldAdded":"0"},"actions":["Sweep the forge","Mop the floors","Clean the windows"]} Some more text after`

    const result = cleanAiJsonAnswer(answer)

    const json = JSON.parse(result)

  })
})
