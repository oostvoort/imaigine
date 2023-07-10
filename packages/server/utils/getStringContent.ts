export function getStringContent(str: string): string | null {
  const openingIndex = str.indexOf("{");
  const closingIndex = str.lastIndexOf("}");

  if (openingIndex === -1 || closingIndex === -1 || openingIndex >= closingIndex) {
    return null;
  }

  return str.substring(openingIndex, closingIndex + 1);
}
