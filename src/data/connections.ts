import type { EvidenceId } from './evidence';

/**
 * Puzzle 5 (canon section 8). A link holds when one card from `a` is connected to one card from `b`.
 * Several cards can stand for the same fact, so each side lists every card that carries it.
 */

export interface KeyLink {
  id: string;
  a: EvidenceId[];
  b: EvidenceId[];
  finding: string;
}

export const KEY_LINKS: KeyLink[] = [
  {
    id: 'before-the-call',
    a: ['frame-blue-hour', 'rec-frames'],
    b: ['doc-reed-attended'],
    finding: 'The camera puts someone at the mill gate before the 999 call. Reed’s notes say he attended “from home” at 03:52.',
  },
  {
    id: 'the-car',
    a: ['plate-partial', 'frame-blue-hour', 'rec-frames'],
    b: ['plate-heritage', 'doc-reed-car'],
    finding: 'The car at the gate on the night of the fire is FX09 RDT: DI Reed’s own car.',
  },
  {
    id: 'the-son',
    a: ['friends-list'],
    b: ['doc-cal-home'],
    finding: 'Cal R. from camera club, whose dad waits outside in the car. “C. kept home from school.” Reed had a son.',
  },
  {
    id: 'the-call',
    a: ['email-reconstructed', 'doc-sarah-call'],
    b: ['box-annex-original', 'doc-annex-redaction'],
    finding: 'Sarah rang Reed for comment at 16:20 on 16 October. That’s how he learned what Eleanor had.',
  },
  {
    id: 'the-meeting',
    a: ['doc-phone-box'],
    b: ['box-reed-letter'],
    finding: 'The 12:07 call came from the phone box on Mill Road. “On 17.10.14 I went to speak to Miss Vale.”',
  },
  {
    id: 'the-text',
    a: ['doc-text-message'],
    b: ['msg-midnight-text', 'rec-draft-post'],
    finding: 'Eleanor puts two spaces after every full stop and never signs with a kiss. She didn’t send the 22:04 text.',
  },
  {
    id: 'the-flat',
    a: ['box-marsh-tally'],
    b: ['doc-passport', 'doc-retyped-page'],
    finding: 'Marsh found the passport in the drawer. The retyped page says it was gone. The departure was built by hand.',
  },
];

export interface SideLink {
  a: EvidenceId[];
  b: EvidenceId[];
  finding: string;
}

/** True and worth knowing, but not part of the solution. */
export const SIDE_LINKS: SideLink[] = [
  {
    a: ['blog-owl-camera'],
    b: ['frame-blue-hour', 'rec-frames'],
    finding: 'The camera clock runs 7 minutes fast, so 02:52 on the frame is really 02:45.',
  },
  {
    a: ['doc-daniel-alibi'],
    b: ['doc-daniel-calls', 'msg-daniel-deleted'],
    finding: 'Daniel’s alibi doesn’t hold. That proves he lied, but not what he lied about.',
  },
  {
    a: ['doc-sarah-last-contact'],
    b: ['doc-sarah-call', 'msg-sarah-gap', 'email-reconstructed'],
    finding: 'Sarah lied about when she last spoke to Eleanor. Ask why, not just whether.',
  },
  {
    a: ['rec-keylog'],
    b: ['msg-keylogger'],
    finding: 'Daniel’s keylogger captured the owl password. He could have checked in any time he liked.',
  },
  {
    a: ['rec-draft-post', 'site-checkin-script'],
    b: ['post-2026'],
    finding: 'Eleanor wrote the 2026 post in 2014. Her switch published it.',
  },
  {
    a: ['doc-struck-note'],
    b: ['email-reconstructed', 'doc-sarah-last-contact'],
    finding: 'The email PC Marsh wrote down is the one Reed struck out.',
  },
  {
    a: ['doc-sarah-swimmer'],
    b: ['box-reed-letter'],
    finding: 'Reed searched the water for fifty minutes and found nothing. Sarah says Eleanor could swim. Her own site says she couldn’t.',
  },
  {
    a: ['guestbook-uid'],
    b: ['site-checkin-log'],
    finding: 'UNKNOWN USER was never one person. Neither is the list of people who kept typing the word.',
  },
];

export type Verdict = { kind: 'key'; link: KeyLink } | { kind: 'side'; finding: string } | { kind: 'none' };

function matches(link: { a: string[]; b: string[] }, from: string, to: string) {
  return (link.a.includes(from) && link.b.includes(to)) || (link.a.includes(to) && link.b.includes(from));
}

export function judgeConnection(from: string, to: string): Verdict {
  const key = KEY_LINKS.find((link) => matches(link, from, to));
  if (key) return { kind: 'key', link: key };
  const side = SIDE_LINKS.find((link) => matches(link, from, to));
  if (side) return { kind: 'side', finding: side.finding };
  return { kind: 'none' };
}

export function establishedKeyLinks(connections: { from: string; to: string }[]) {
  return KEY_LINKS.filter((link) => connections.some((connection) => matches(link, connection.from, connection.to)));
}
