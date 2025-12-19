import { parseDate } from '@involvemint/shared/util';
import { createLogic } from '../repository';
import { addSeconds, differenceInSeconds, formatDistanceStrict } from 'date-fns';
import { ImConfig } from '../../config';
import { Poi } from './poi.model';

export enum PoiStatus {
  created,
  started,
  paused,
  stopped,
  submitted,
  approved,
  denied,
}

export const calculatePoiStatus = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    dateSubmitted: true;
    dateApproved: true;
    dateDenied: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  if (poi.dateDenied) {
    return PoiStatus.denied;
  }
  if (poi.dateApproved) {
    return PoiStatus.approved;
  }
  if (poi.dateSubmitted) {
    return PoiStatus.submitted;
  }
  if (poi.dateStopped) {
    return PoiStatus.stopped;
  }
  if (poi.pausedTimes.length > poi.resumedTimes.length) {
    return PoiStatus.paused;
  }
  if (
    poi.dateStarted ||
    (poi.pausedTimes.length > 0 &&
      poi.resumedTimes.length > 0 &&
      poi.pausedTimes.length === poi.resumedTimes.length)
  ) {
    return PoiStatus.started;
  }
  return PoiStatus.created;
});

/**
 * Calculates the total duration of the proof of impact including any pauses.
 * @param poi proof of impact.
 * @returns seconds.
 */
export const calcTotalPoiDuration = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  if (!poi.dateStarted) {
    throw new Error('Enrollee must first be clocked in to calculate total Poi duration.');
  }
  if (!poi.dateStopped) {
    throw new Error('Enrollee must first be clocked out to calculate total Poi duration.');
  }
  if (poi.pausedTimes.length > poi.resumedTimes.length) {
    throw new Error('Cannot calculate total duration on a currently currently paused Poi.');
  }

  const diffStartStop = differenceInSeconds(parseDate(poi.dateStopped), parseDate(poi.dateStarted));
  const pausedSeconds = calculateSecondsPoiWasPaused(poi);

  return diffStartStop - pausedSeconds;
});

export const calculatePoiDurationFromNow = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  if (!poi.dateStarted) {
    throw new Error('Enrollee must first be clocked in to calculate Poi duration from now.');
  }

  const now = new Date();
  let range = differenceInSeconds(now, parseDate(poi.dateStarted));
  if (poi.pausedTimes.length === 0) {
    return range;
  }

  if (poi.resumedTimes.length > poi.pausedTimes.length) {
    throw new Error('Cannot calculate duration from now on a currently paused Poi.');
  }

  for (let i = 0; i < poi.pausedTimes.length; i++) {
    const paused = poi.pausedTimes[i];
    const resumed = poi.resumedTimes[i];
    if (paused && !resumed) {
      range -= differenceInSeconds(now, parseDate(paused));
      break;
    }
    range -= differenceInSeconds(parseDate(resumed), parseDate(paused));
  }

  return range;
});

/**
 * @returns total seconds Poi timer was paused or `currentlyPaused` if timer is currently paused
 */
export const calculateSecondsPoiWasPaused = createLogic<Poi, { pausedTimes: true; resumedTimes: true }>()(
  (poi) => {
    if (poi.resumedTimes.length > poi.pausedTimes.length) {
      throw new Error('Cannot calculate paused seconds on a currently paused Poi.');
    }

    let pauseSeconds = 0;
    for (let i = 0; i < poi.pausedTimes.length; i++) {
      const paused = poi.pausedTimes[i];
      const resumed = poi.resumedTimes[i];
      pauseSeconds += differenceInSeconds(parseDate(resumed), parseDate(paused));
    }

    return pauseSeconds;
  }
);

export const calculatePoiMandatoryClockOutDate = createLogic<
  Poi,
  {
    dateStarted: true;
    pausedTimes: true;
    resumedTimes: true;
    enrollment: {
      project: {
        creditsEarned: true;
      };
    };
  }
>()((poi) => {
  if (!poi.dateStarted) {
    throw new Error('Poi must be started to calculate mandatory Clock Out Date.');
  }
  if (poi.pausedTimes.length > poi.resumedTimes.length) {
    throw new Error('Cannot calculate mandatory clock out date on a currently paused Poi.');
  }

  const SECONDS_IN_ONE_HOUR = 3600;
  const maxShiftSeconds =
    SECONDS_IN_ONE_HOUR * (poi.enrollment.project.creditsEarned / ImConfig.creditsPerHour);
  const poiCurrentDuration = calculateSecondsPoiWasPaused(poi);
  const secondsUntilClockOut = maxShiftSeconds + poiCurrentDuration;
  const mandatoryClockOutDate = addSeconds(parseDate(poi.dateStarted), secondsUntilClockOut);
  return mandatoryClockOutDate;
});

export const calculateCreditsEarnedForPoi = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  if (!poi.dateStarted || !poi.dateStopped) {
    throw new Error('Poi must be stopped to calculate Credits Earned.');
  }

  const seconds = calcTotalPoiDuration(poi);
  const secondsPerHour = 3600;
  const hours = seconds / secondsPerHour;
  const amount = ImConfig.creditsPerHour * hours;
  return Math.floor(amount);
});

export const isPoiInProgress = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    dateSubmitted: true;
    dateApproved: true;
    dateDenied: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  const status = calculatePoiStatus(poi);
  return status === PoiStatus.created || status === PoiStatus.started || status === PoiStatus.paused;
});

export const calculatePoiTimeWorked = createLogic<
  Poi,
  {
    dateStarted: true;
    dateStopped: true;
    dateDenied: true;
    pausedTimes: true;
    resumedTimes: true;
  }
>()((poi) => {
  let timeWorked = 'No submission time.';
  if (poi.dateStarted && poi.dateStopped && poi.pausedTimes.length === poi.resumedTimes.length) {
    const duration = calcTotalPoiDuration(poi);
    const now = new Date();
    timeWorked = formatDistanceStrict(addSeconds(now, duration), now);
  }
  return timeWorked;
});
