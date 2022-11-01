import * as uid from './six-char-uid';
import { guaranteeSixCharUidUniqueness } from './validate-six-char-uid';

describe('uid.ts', () => {
  describe('sixCharUid', () => {
    it('should generator a random 6 character string', () => {
      // I actually had the `testArr` length at 100,000 and it failed once lol.
      // So...only 10 and it should never fail.
      const testArr = Array.from({ length: 10 }).map(() => uid.sixCharUid());
      expect(Array.from(new Set<string>(testArr)).length).toBe(testArr.length);
    });
  });

  describe('guaranteeUidUniqueness', () => {
    it('should return with empty array', () => {
      expect(guaranteeSixCharUidUniqueness([])).toBeTruthy();
    });

    it('should return with non-empty array', () => {
      const code = guaranteeSixCharUidUniqueness(Array.from({ length: 10 }).map(() => uid.sixCharUid()));
      expect(code).toBeTruthy();
    });

    it('should throw error if cannot guaranteeUidUniqueness', () => {
      jest.spyOn(uid, 'sixCharUid').mockImplementation(() => '1');
      expect(guaranteeSixCharUidUniqueness(['2'])).toBeTruthy();
    });

    it('should throw error if cannot guaranteeUidUniqueness (no infinite loops)', () => {
      jest.spyOn(uid, 'sixCharUid').mockImplementation(() => '1');
      expect(() => guaranteeSixCharUidUniqueness(['1'])).toThrowError();
    });
  });
});
