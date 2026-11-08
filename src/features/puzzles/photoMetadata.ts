export const SUSPECT_FIELD = 'DateTimeOriginal';

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

interface ParsedDate {
  year: number;
  month: number;
  day: number;
}

/** Reads the formats a player is likely to type: 15 Nov 2013, 15/11/2013, 2013-11-15, 2013:11:15. */
export function parseLooseDate(input: string): ParsedDate | null {
  const text = input.trim().toLowerCase().replace(/(\d)(st|nd|rd|th)\b/g, '$1');

  const named = text.match(/^(\d{1,2})[\s-]+([a-z]+)[\s,-]+(\d{4})$/);
  if (named) {
    const month = MONTHS.indexOf(named[2].slice(0, 3)) + 1;
    return month ? { year: Number(named[3]), month, day: Number(named[1]) } : null;
  }

  const monthFirst = text.match(/^([a-z]+)\s+(\d{1,2})[\s,]+(\d{4})$/);
  if (monthFirst) {
    const month = MONTHS.indexOf(monthFirst[1].slice(0, 3)) + 1;
    return month ? { year: Number(monthFirst[3]), month, day: Number(monthFirst[2]) } : null;
  }

  const yearFirst = text.match(/^(\d{4})[-/.:](\d{1,2})[-/.:](\d{1,2})$/);
  if (yearFirst) {
    return { year: Number(yearFirst[1]), month: Number(yearFirst[2]), day: Number(yearFirst[3]) };
  }

  const yearLast = text.match(/^(\d{1,2})[-/.:](\d{1,2})[-/.:](\d{4})$/);
  if (yearLast) {
    const first = Number(yearLast[1]);
    const second = Number(yearLast[2]);
    // 15 can't be a month, so 11/15/2013 is unambiguous here.
    return second > 12
      ? { year: Number(yearLast[3]), month: first, day: second }
      : { year: Number(yearLast[3]), month: second, day: first };
  }

  return null;
}

export type DateResult = { correct: true } | { correct: false; feedback: string };

export function checkTakenDate(input: string): DateResult {
  const date = parseLooseDate(input);

  if (!date) {
    return { correct: false, feedback: 'Enter a full date, such as 1 Jan 2013.' };
  }
  if (date.year === 2013 && date.month === 11 && date.day === 15) return { correct: true };
  if (date.year === 2013 && date.month === 10) {
    return { correct: false, feedback: 'That’s what the caption claims. What does the file say?' };
  }
  if (date.year === 2014 && date.month === 10 && date.day === 14) {
    return { correct: false, feedback: 'That’s when the file was edited, not when it was taken.' };
  }
  return { correct: false, feedback: 'That doesn’t match the time the shutter fired. Check the metadata again.' };
}
