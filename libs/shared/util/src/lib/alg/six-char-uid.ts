/**
 * Generates a random 6 character uid made of of uppercase letters, lowercase letters, and numbers.
 *
 * @example
 * md03jf
 *
 * @remarks
 * Number of unique ids is: `(26 * 2 + 10)^6 ~ 56.8 Billion` \
 *
 * @return Unique ID
 */
export function sixCharUid(): string {
  const base62chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const uid: string[] = [];

  for (let i = 0; i < 6; i++) {
    uid[i] = base62chars[randomIntFromInterval(0, base62chars.length - 1)];
  }

  return uid.join('');
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
