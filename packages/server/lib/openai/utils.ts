export function getRandomValue<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}


export function cleanAiJsonAnswer(str: string): string {
  // Discard everything before the first occurrence of {
  str = str.substring(str.indexOf('{'))

  // Trim any whitespace (not sure if this is needed)
  str = str.replace(/^\s+|\n/g, '').trimStart()
  return str
}
