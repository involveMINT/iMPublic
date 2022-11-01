import { differenceInSeconds } from 'date-fns';
import { calculatePoiStatus, PoiStatus } from '.';
import { ImConfig } from '../../config';
import { calculateCreditsEarnedForPoi, calculatePoiMandatoryClockOutDate } from './poi.logic';

const SECONDS_IN_ONE_HOUR = 3600;

describe('poi logic', () => {
  describe('calculatePoiStatus', () => {
    it('created', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.created);
    });
    it('started', () => {
      expect(
        calculatePoiStatus({
          dateStarted: new Date(),
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.started);
    });
    it('paused', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [new Date()],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.paused);
    });
    it('resumed', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [new Date()],
          resumedTimes: [new Date()],
        })
      ).toBe(PoiStatus.started);
    });
    it('stopped', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: new Date(),
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.stopped);
    });
    it('submitted', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: new Date(),
          dateApproved: undefined,
          dateDenied: undefined,
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.submitted);
    });
    it('approved', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: new Date(),
          dateDenied: undefined,
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.approved);
    });
    it('denied', () => {
      expect(
        calculatePoiStatus({
          dateStarted: undefined,
          dateStopped: undefined,
          dateSubmitted: undefined,
          dateApproved: undefined,
          dateDenied: new Date(),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(PoiStatus.denied);
    });
  });

  describe('calculatePoiMandatoryClockOutDate', () => {
    it('should work with no pauses', () => {
      const maxShiftEarnings = 1000;
      const dateStarted = new Date(2014, 6, 10, 12, 45, 0);
      const mandatoryClockOutDate = calculatePoiMandatoryClockOutDate({
        pausedTimes: [],
        resumedTimes: [],
        dateStarted,
        enrollment: {
          project: {
            creditsEarned: maxShiftEarnings,
          },
        },
      });
      const maxShiftSeconds = (SECONDS_IN_ONE_HOUR * maxShiftEarnings) / ImConfig.creditsPerHour;
      expect(differenceInSeconds(mandatoryClockOutDate, dateStarted)).toBe(maxShiftSeconds);
    });

    it('should work with one 10 second pause', () => {
      const maxShiftEarnings = 1000;
      const dateStarted = new Date(2014, 6, 10, 12, 45, 0);
      const mandatoryClockOutDate = calculatePoiMandatoryClockOutDate({
        dateStarted,
        pausedTimes: [new Date(2014, 6, 10, 12, 45, 10)],
        resumedTimes: [new Date(2014, 6, 10, 12, 45, 20)],
        enrollment: {
          project: {
            creditsEarned: maxShiftEarnings,
          },
        },
      });
      const maxShiftSeconds = (SECONDS_IN_ONE_HOUR * maxShiftEarnings) / ImConfig.creditsPerHour;
      expect(differenceInSeconds(mandatoryClockOutDate, dateStarted)).toBe(maxShiftSeconds + 10);
    });

    it('should be null if timer is paused', () => {
      const maxShiftEarnings = 1000;
      const dateStarted = new Date(2014, 6, 10, 12, 45, 0);
      expect(() =>
        calculatePoiMandatoryClockOutDate({
          dateStarted,
          pausedTimes: [new Date(2014, 6, 10, 12, 45, 10)],
          resumedTimes: [],
          enrollment: {
            project: {
              creditsEarned: maxShiftEarnings,
            },
          },
        })
      ).toThrow('Cannot calculate mandatory clock out date on a currently paused Poi.');
    });

    it('can calculate correct TC per hour', () => {
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(ImConfig.creditsPerHour);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600 / 2),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(ImConfig.creditsPerHour / 2);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600 / 6),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(ImConfig.creditsPerHour / 6);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 0),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(0);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 1),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(0);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(1);
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 5),
          pausedTimes: [],
          resumedTimes: [],
        })
      ).toBe(2);
      expect(() =>
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 5),
          pausedTimes: [new Date(2020, 0, 0, 0, 0, 0)],
          resumedTimes: [],
        })
      ).toThrow();
      expect(
        calculateCreditsEarnedForPoi({
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600),
          pausedTimes: [new Date(2020, 0, 0, 0, 0, 3600 / 2)],
          resumedTimes: [new Date(2020, 0, 0, 0, 0, 3600)],
        })
      ).toBe(ImConfig.creditsPerHour / 2);
    });
  });
});
