export function getDateDistanceDigits(future: Date, past: Date) {
  const distance = Math.abs(future.getTime() - past.getTime());

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function formatDistanceHMS(future: Date, past: Date): string {
  const { hours, minutes, seconds } = getDateDistanceDigits(future, past);
  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
}
