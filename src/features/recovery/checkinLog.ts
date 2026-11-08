import type { GameState } from '../../types/game';

/**
 * The dead man's switch log (canon sections 5 and 11). Every correct entry of the word adds a line,
 * including the player's own. The 2015-03-17 line is part of the unexplained remainder.
 */

const ELEANOR = '203.0.113.21    Firefox 32, Windows 7     ';
const SARAH_2014 = '203.0.113.33    Chrome 38, Windows 7      ';
const DANIEL = '203.0.113.77    Chrome 40, Ubuntu         ';
const EL_PHONE = '203.0.113.250   Android 4.4.2 (el-phone)  ';
const SARAH_2026 = '198.51.100.73   Firefox 130, Windows 11   ';
const PLAYER = 'local           case terminal (reader_0918)';

const HISTORY = [
  '# checkin.log  eleanorvale.example',
  '# date        time   address         client                    result',
  `2014-10-12  21:41  ${ELEANOR}ok`,
  `2014-10-15  22:10  ${ELEANOR}ok`,
  `2014-10-17  18:40  ${ELEANOR}ok`,
  `2014-10-19  09:12  ${SARAH_2014}ok`,
  `2014-11-17  21:02  ${DANIEL}ok`,
  `2014-12-17  21:00  ${DANIEL}ok`,
  `2015-01-17  21:01  ${DANIEL}ok`,
  `2015-02-17  21:03  ${DANIEL}ok`,
  `2015-03-17  04:12  ${EL_PHONE}ok`,
  `2015-04-17  21:00  ${DANIEL}ok`,
  '# 51 more lines from 203.0.113.77, 2015-05-17 to 2019-07-17, on the 17th of every month',
  `2017-06-02  13:27  203.0.113.140   Chrome 58, Windows 10     ok`,
  `2018-03-02  23:05  203.0.113.201   Chrome 64, Windows 10     ok`,
  `2019-08-17  21:00  ${DANIEL}ok`,
  '# 2019-09-01 00:00  host suspended (hosting unpaid)',
  '# 2026-10-17 20:31  host restored from backup',
  '2026-10-17  20:45  —               stage 1 posted: queue/stage1.txt (last check-in 2618 days ago)',
  `2026-10-23  23:52  ${SARAH_2026}ok    stage 2 cancelled`,
];

function stamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}  ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildCheckinLog(state: GameState) {
  const lines = [...HISTORY];

  state.checkIns.forEach((at) => {
    const date = new Date(at);
    if (!Number.isNaN(date.getTime())) lines.push(`${stamp(date)}  ${PLAYER}  ok`);
  });

  // Secret route only. Never explained.
  const last = state.checkIns[state.checkIns.length - 1];
  if (last && state.flags.includes('still-online')) {
    const after = new Date(new Date(last).getTime() + 60_000);
    lines.push(`${stamp(after)}  ${EL_PHONE}ok`);
  }

  if (state.checkIns.length > 0) {
    const next = new Date(state.checkIns[state.checkIns.length - 1]);
    next.setDate(next.getDate() + 30);
    lines.push(`# switch armed. next stage 1 if no check-in by ${stamp(next).slice(0, 10)}`);
  }

  return lines;
}
