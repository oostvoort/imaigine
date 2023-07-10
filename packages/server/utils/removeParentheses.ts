export function removeParentheses(str: string): string {
  let output = '';
  let openCount = 0;

  for (const char of str) {
    if (char === '(') {
      openCount++;
    } else if (char === ')') {
      openCount--;
    } else if (openCount === 0) {
      output += char;
    }
  }

  return output;
}
