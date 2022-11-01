export * from './format-distance';
import { parseISO } from 'date-fns';

type SingleType = Date | string;
type ArrType = SingleType[];

/** Guarantees Date objects. */
export function parseDate(dateInp: SingleType): Date;
/** Guarantees a Date object. */
export function parseDate(dateInp: ArrType): Date[];
export function parseDate(dateInp: ArrType | SingleType): Date[] | Date {
  const parse = (date: SingleType) => (date instanceof Date ? date : parseISO(date));

  if (Array.isArray(dateInp)) {
    return dateInp.map((d) => parse(d));
  }

  return parse(dateInp);
}
