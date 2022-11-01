import { sixCharUid } from './six-char-uid';

/**
 * Guarantees a UID given an array of existing IDs.
 * @param existingIDs Array of existing ID values to compare new ID against.
 *
 * @return Guaranteed Unique ID from existing IDs.
 */
export function guaranteeSixCharUidUniqueness(existingIDs: string[]) {
  let uid = '';

  /** Maximum number of trys to prevent against infinite loop. */
  const maxTrys = existingIDs.length + 1;
  let trys = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (++trys > maxTrys) throw new Error('Could not validate unique handle.');

    let unique = true;
    uid = sixCharUid();
    for (const id of existingIDs) {
      if (id === uid) {
        unique = false;
        break;
      }
    }

    if (unique) break;
  }

  return uid;
}
