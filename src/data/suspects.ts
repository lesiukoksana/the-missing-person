import type { EvidenceId } from './evidence';

/**
 * Suspect profiles. Everything beyond the opening line of each field is unlocked by evidence,
 * so the page never states more than the player has found. The last matching variant wins.
 */

export interface Variant {
  /** Shown once any of these is discovered. Empty means always. */
  requires: EvidenceId[];
  text: string;
}

export interface StatusVariant extends Variant {
  tone: 'neutral' | 'warning' | 'alarm' | 'cleared';
}

export interface Fact {
  evidence: EvidenceId;
  stance: 'for' | 'against';
  text: string;
}

export interface Suspect {
  id: string;
  name: string;
  initials: string;
  role: string;
  relationship: Variant[];
  motive: Variant[];
  whereabouts: Variant[];
  status: StatusVariant[];
  facts: Fact[];
  /** How the two kinds of fact are headed. */
  stanceLabels?: [string, string];
  /** Links to related records the player can open. */
  related: { label: string; to: string }[];
}

export const SUSPECTS: Suspect[] = [
  {
    id: 'daniel',
    name: 'Daniel Cross',
    initials: 'DC',
    role: 'Former partner · software developer',
    relationship: [
      { requires: [], text: 'Together from March 2011 to January 2014, when she ended it. He built her website and still managed it.' },
      {
        requires: ['msg-keylogger', 'rec-keylog'],
        text: 'Together from March 2011 to January 2014. After the break-up he kept her passwords, a key to her flat, and software on her laptop that recorded what she typed.',
      },
    ],
    motive: [
      { requires: [], text: 'Possibly jealousy. She ended the relationship and asked him to stop coming to her work.' },
      {
        requires: ['msg-keylogger'],
        text: 'She had just found his keylogger and told him to leave her alone “properly this time”. Six days later she was gone.',
      },
    ],
    whereabouts: [
      { requires: [], text: 'Says he was at home all evening on 17 October.' },
      { requires: ['doc-daniel-alibi'], text: 'Says he was at home working all evening. His proof is a code commit pushed at 20:47.' },
      {
        requires: ['doc-daniel-calls'],
        text: 'Says he was at home all evening and called her “a couple of times”. Phone records show five unanswered calls between 21:03 and 21:41. Nobody ever checked the commit.',
      },
    ],
    status: [
      { requires: [], text: 'Person of interest', tone: 'neutral' },
      { requires: ['doc-daniel-calls', 'msg-daniel-deleted', 'msg-keylogger'], text: 'Lied to the police', tone: 'warning' },
      {
        requires: ['box-reed-letter'],
        text: 'Not responsible for what happened at the mill. Responsible for plenty else.',
        tone: 'cleared',
      },
    ],
    facts: [
      { evidence: 'doc-daniel-key', stance: 'for', text: 'Still had a key to her flat nine months after they split up.' },
      { evidence: 'msg-keylogger', stance: 'for', text: 'Eleanor found a keylogger he had installed on her laptop.' },
      { evidence: 'rec-keylog', stance: 'for', text: 'The keylogger captured the owl password and synced it to his home address.' },
      { evidence: 'doc-daniel-calls', stance: 'for', text: 'Called her five times that night, after telling police they hadn’t really been in touch.' },
      { evidence: 'msg-daniel-deleted', stance: 'for', text: 'Three emails he sent that night were deleted from his admin account at 07:43 the next morning.' },
      { evidence: 'guestbook-threat', stance: 'for', text: '“i know someone was at the mill” was posted from his home address in February 2015.' },
      { evidence: 'bonfire-thumbnail', stance: 'for', text: 'Someone cropped him out of a photograph of an argument, on the same night as the guestbook post.' },
      { evidence: 'msg-daniel-backup', stance: 'against', text: 'In 2026 he handed over everything he had kept, and asked to be told “if it was me”.' },
      { evidence: 'plate-heritage', stance: 'against', text: 'The car seen at the mill belongs to someone else.' },
      { evidence: 'box-reed-letter', stance: 'against', text: 'Another man has written down that he was with Eleanor when she fell.' },
    ],
    related: [
      { label: 'Interview: Daniel Cross', to: '/archive/AD-14-0917-03' },
      { label: 'Eleanor and Daniel’s emails', to: '/messages/eleanor-daniel' },
    ],
  },

  {
    id: 'sarah',
    name: 'Sarah Bennett',
    initials: 'SB',
    role: 'Friend since school · reporter, Ashford Courier',
    relationship: [
      { requires: [], text: 'Eleanor’s closest friend. She reported Eleanor missing on 19 October 2014.' },
      {
        requires: ['msg-midnight-text'],
        text: 'Eleanor’s closest friend, and the person she trusted with her secret. “If I don’t text by midnight read the last thing I sent you.”',
      },
    ],
    motive: [
      { requires: [], text: 'None obvious. She is the one who raised the alarm.' },
      {
        requires: ['doc-sarah-call', 'msg-sarah-gap'],
        text: 'Something about 16 October that she doesn’t want on the record.',
      },
      {
        requires: ['box-annex-original', 'msg-sarah-knew'],
        text: 'Shame. She rang DI Reed for comment on Eleanor’s story the day before Eleanor vanished. Then she sat across from him in an interview and said nothing.',
      },
    ],
    whereabouts: [
      { requires: [], text: 'Not asked for an alibi.' },
      { requires: ['msg-midnight-text'], text: 'At home on 17 October, texting Eleanor until midnight. Outside Eleanor’s flat by 08:02 the next morning.' },
    ],
    status: [
      { requires: [], text: 'Witness', tone: 'neutral' },
      { requires: ['doc-sarah-call', 'msg-sarah-gap', 'doc-annex-redaction'], text: 'Hiding something', tone: 'warning' },
      { requires: ['box-annex-original', 'msg-sarah-knew'], text: 'Withheld evidence for twelve years', tone: 'alarm' },
    ],
    facts: [
      { evidence: 'doc-sarah-last-contact', stance: 'for', text: 'Told police her last contact with Eleanor was on 15 October.' },
      { evidence: 'doc-sarah-call', stance: 'for', text: 'Phone records show an eleven-minute call on 16 October.' },
      { evidence: 'msg-sarah-gap', stance: 'for', text: 'Her message export is missing three messages from 16 October.' },
      { evidence: 'doc-annex-redaction', stance: 'for', text: 'Someone blacked out a caller in the phone report in April 2026, months after Reed’s box reached her.' },
      { evidence: 'box-annex-original', stance: 'for', text: 'The blacked-out caller was her. She rang DI Reed’s direct line at 16:20 on 16 October.' },
      { evidence: 'msg-sarah-knew', stance: 'for', text: 'Named Reed to her editor the day after her interview, in which she named nobody.' },
      { evidence: 'doc-sarah-swimmer', stance: 'for', text: 'Insists Eleanor was a strong swimmer. Eleanor’s own site says otherwise.' },
      { evidence: 'doc-text-message', stance: 'against', text: 'Told police at once that the 22:04 text wasn’t Eleanor’s writing.' },
      { evidence: 'msg-complaint', stance: 'against', text: 'Sent an anonymous complaint to Police Standards in 2015. Nothing came of it.' },
    ],
    related: [
      { label: 'Interview: Sarah Bennett', to: '/archive/AD-14-0917-04' },
      { label: 'Eleanor and Sarah’s texts', to: '/messages/eleanor-sarah' },
    ],
  },

  {
    id: 'reed',
    name: 'Thomas Reed',
    initials: 'TR',
    role: 'Detective Inspector, Ashford Division (retired 2017)',
    relationship: [
      { requires: [], text: 'The senior officer in charge of the search for Eleanor.' },
      {
        requires: ['blog-station'],
        text: 'The senior officer in charge of the search for Eleanor. Eight months earlier she had handed him her owl-camera card, the original, in person.',
      },
      {
        requires: ['doc-reed-attended'],
        text: 'Led the search for Eleanor, and before that the inquiry into the Harrow Mill fire, the fire her camera recorded.',
      },
    ],
    motive: [
      { requires: [], text: 'None on record.' },
      { requires: ['frame-blue-hour', 'rec-frames'], text: 'Her camera recorded someone at the mill gate before the 999 call.' },
      {
        requires: ['doc-cal-home'],
        text: 'Her camera recorded someone at the mill on the night of the fire. Reed had a son, “C.”, who was kept home from school.',
      },
      {
        requires: ['box-reed-letter'],
        text: '“I did not know Peter Aldous was inside. I knew my son was outside.”',
      },
    ],
    whereabouts: [
      { requires: [], text: 'Never asked for an alibi.' },
      { requires: ['doc-phone-box'], text: 'Unknown. At 12:07 that day someone rang Eleanor from the phone box on Mill Road.' },
      { requires: ['box-reed-letter'], text: 'By his own account, on the wheel house gallery with Eleanor at about 20:40, and searching the water until 21:30.' },
    ],
    status: [
      { requires: [], text: 'Investigating officer', tone: 'neutral' },
      { requires: ['blog-station', 'doc-struck-note', 'doc-retyped-page'], text: 'Conflict of interest', tone: 'warning' },
      { requires: ['plate-heritage', 'doc-reed-car'], text: 'At the mill on the night of the fire', tone: 'alarm' },
      { requires: ['box-reed-letter'], text: 'With her when she disappeared, by his own account. Died 3 March 2026', tone: 'alarm' },
    ],
    facts: [
      { evidence: 'blog-station', stance: 'for', text: 'Kept the original card from Eleanor’s owl camera “for the file”.' },
      { evidence: 'doc-struck-note', stance: 'for', text: 'Struck out PC Marsh’s note about an email and initialled it.' },
      { evidence: 'doc-retyped-page', stance: 'for', text: 'The page of his inspection report that says the passport was gone was retyped and never stamped.' },
      { evidence: 'doc-reed-attended', stance: 'for', text: 'Says he attended the mill fire “from home” at 03:52.' },
      { evidence: 'doc-reed-car', stance: 'for', text: 'His own car is FX09 RDT.' },
      { evidence: 'plate-heritage', stance: 'for', text: 'FX09 RDT matches the car at the mill gate in Eleanor’s frame.' },
      { evidence: 'doc-phone-box', stance: 'for', text: 'Eleanor took a call from the Mill Road phone box at 12:07 on 17 October.' },
      { evidence: 'box-marsh-tally', stance: 'for', text: 'PC Marsh handed him a list showing the passport was in the drawer.' },
      { evidence: 'box-reed-letter', stance: 'for', text: 'His letter: “The gallery gave way at about 20.40. I searched until 21.30.”' },
      { evidence: 'doc-closure', stance: 'against', text: 'His superintendent signed off the closure. Nobody above him questioned it.' },
      { evidence: 'msg-complaint', stance: 'against', text: 'Police Standards looked into a complaint and found nothing.' },
      { evidence: 'box-reed-letter', stance: 'against', text: 'He says he didn’t push her. Nobody else was there to say otherwise.' },
    ],
    related: [
      { label: 'Investigator notes', to: '/archive/AD-14-0917-05' },
      { label: 'Eleanor’s blog: Lost afternoon at the station', to: '/website/blog/lost-afternoon' },
    ],
  },

  {
    id: 'unknown',
    name: 'UNKNOWN USER',
    initials: '??',
    role: 'Guestbook account',
    relationship: [
      { requires: [], text: 'Posted in Eleanor’s guestbook before she disappeared, and for years afterwards.' },
      { requires: ['guestbook-uid'], text: 'Not an account at all. Every post shows uid=0, the label Eleanor’s guestbook gave anyone who left the name blank.' },
    ],
    motive: [
      { requires: [], text: 'Unknown.' },
      { requires: ['guestbook-uid'], text: 'Several people, with several reasons. Read the punctuation.' },
    ],
    whereabouts: [
      { requires: [], text: 'Unknown.' },
      { requires: ['guestbook-uid'], text: 'Different addresses and browsers: a library terminal, a newsroom, a home in Ashford, a phone.' },
    ],
    status: [
      { requires: [], text: 'Unidentified', tone: 'neutral' },
      { requires: ['guestbook-uid'], text: 'Not one person', tone: 'warning' },
      { requires: ['site-checkin-log'], text: 'Still posting', tone: 'alarm' },
    ],
    facts: [
      { evidence: 'guestbook-threat', stance: 'for', text: '“i know someone was at the mill”, four months after she disappeared.' },
      { evidence: 'guestbook-uid', stance: 'against', text: 'The posts come from different places. Whoever “UNKNOWN USER” is, it isn’t one person.' },
      { evidence: 'site-checkin-log', stance: 'for', text: 'One address in the check-in log matches a post that appeared after you read it.' },
    ],
    related: [{ label: 'The guestbook', to: '/website/guestbook' }],
  },
];

export const SUBJECT: Suspect = {
  id: 'eleanor',
  name: 'Eleanor Vale',
  initials: 'EV',
  role: 'The missing person · 26 in October 2014',
  relationship: [{ requires: [], text: 'Amateur photographer and web designer. Printer at Copperplate Print, Bridge Street.' }],
  motive: [
    { requires: [], text: 'Could she have left on purpose? The official conclusion says so.' },
    { requires: ['rec-draft-post'], text: 'She wrote the 2026 post herself, in October 2014.' },
  ],
  whereabouts: [
    { requires: [], text: 'Last confirmed leaving work at 17:30 on Friday 17 October 2014.' },
    { requires: ['doc-phone-box'], text: 'Her phone was near Harrow Mill from 19:55, then at Ashford station at 21:52.' },
    { requires: ['box-reed-letter'], text: 'Fell from the wheel house gallery at Harrow Mill at about 20:40, according to the only witness. Never found.' },
  ],
  stanceLabels: ['Suggests she could have survived', 'Suggests she didn’t'],
  status: [
    { requires: [], text: 'Missing since 17 October 2014', tone: 'neutral' },
    { requires: ['box-reed-letter'], text: 'Missing. Presumed dead by the one man who was there', tone: 'alarm' },
  ],
  facts: [
    { evidence: 'doc-sarah-swimmer', stance: 'for', text: 'Sarah says she was a strong swimmer.' },
    { evidence: 'site-checkin-log', stance: 'for', text: 'Someone checked in from her phone on 17 March 2015.' },
    { evidence: 'box-reed-letter', stance: 'against', text: 'Reed searched the water for fifty minutes and found nobody.' },
  ],
  related: [{ label: 'Her website', to: '/website' }],
};

/** Evidence variants: the last one whose requirement is met wins. */
export function pick<T extends Variant>(variants: T[], discovered: string[]): T {
  return [...variants].reverse().find((variant) => variant.requires.length === 0 || variant.requires.some((id) => discovered.includes(id))) ?? variants[0];
}
