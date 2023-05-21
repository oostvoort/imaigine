export default async function api(endpoint: string, props: any) {
  try {
    const response = await fetch(import.meta.env.VITE_API_ENDPOINT + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props),
    })
    return await response.json()
  } catch (error) {
    console.error('apiRequest Error:', error)
  }
}
