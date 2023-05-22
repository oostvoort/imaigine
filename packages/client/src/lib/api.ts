export default async function api(endpoint: string, props: any, maxAttempts = 5) {
  let attempts = 0
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(import.meta.env.VITE_API_ENDPOINT + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      })
      return await response.json()
    } catch (error) {
      attempts++
      console.log(`Attempt ${attempts} failed. Retrying...`)
    }
  }
}
