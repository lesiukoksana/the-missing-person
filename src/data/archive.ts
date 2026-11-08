import type { Requirement } from '../types/game';
import type { EvidenceId } from './evidence';

/**
 * Police records for Case #0917. Canon section 9 lists what each one plants.
 * Inline marks are written as [[mark-id]] and defined in the document's `marks`.
 * Phone numbers use Ofcom's drama ranges (07700 900xxx, 01632 960xxx).
 */

export interface Mark {
  kind: 'redaction' | 'struck';
  /** What's under the strike. For a redaction, only its length is shown. */
  text: string;
  note: string;
  evidence?: EvidenceId;
}

export type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'fields'; rows: [string, string][] }
  | { kind: 'para'; text: string }
  | { kind: 'transcript'; lines: [string, string][] }
  | { kind: 'table'; columns: string[]; rows: string[][] }
  | { kind: 'handwritten'; text: string }
  | { kind: 'signature'; lines: string[] };

export interface DocPage {
  blocks: Block[];
  /** Registry receipt stamp. Null where a page was never stamped. */
  stamp: string | null;
  /** True for a page typed on a different machine from the rest. */
  retyped?: boolean;
}

export interface ArchiveDocument {
  id: string;
  title: string;
  date: string;
  author: string;
  department: string;
  classification: string;
  status: string;
  summary: string;
  requirement: Requirement | null;
  pages: DocPage[];
  details: [string, string][];
  /** Found by opening the document details, not just by reading. */
  detailsEvidence?: EvidenceId;
  evidence: EvidenceId[];
  marks: Record<string, Mark>;
  related: { label: string; to: string }[];
}

const RECEIVED = (date: string) => `RECEIVED — ASHFORD REGISTRY — ${date}`;

export const ARCHIVE: ArchiveDocument[] = [
  {
    id: 'AD-14-0917-01',
    title: 'Missing-person report',
    date: '19.10.14',
    author: 'PC 2241 L. Marsh',
    department: 'Ashford Division, front counter',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Filed',
    summary: 'Sarah Bennett reports her friend missing, two days after anyone last saw her.',
    requirement: null,
    evidence: ['doc-text-message'],
    marks: {
      email: {
        kind: 'struck',
        text: 'RP states her concern arises from an email the MP sent her late on Thursday 16.10.14, which RP has not shown me and would not describe.',
        note: 'Struck through in a different pen from the rest of the report, and initialled “TR 20.10”.',
        evidence: 'doc-struck-note',
      },
    },
    related: [
      { label: 'Flat inspection report', to: '/archive/AD-14-0917-02' },
      { label: 'Phone activity report', to: '/archive/AD-14-0917-06' },
    ],
    details: [
      ['Pages', '2'],
      ['Received', '19.10.14 12:04'],
      ['Reviewed', 'DI T. Reed, 20.10.14'],
      ['Risk grading', 'Medium, reduced to Low on review'],
    ],
    pages: [
      {
        stamp: RECEIVED('19 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Report of a missing person' },
          {
            kind: 'fields',
            rows: [
              ['Reported', 'Sunday 19.10.14, 11:30, in person'],
              ['Reporting person (RP)', 'Sarah BENNETT, 26, friend. Reporter, Ashford Courier'],
              ['Missing person (MP)', 'Eleanor Margaret VALE'],
              ['Date of birth', '03.04.1988 (26)'],
              ['Address', '14B Weir Lane, Ashford'],
              ['Description', 'White female, 5′6″, slim, shoulder-length dark brown hair, usually tied back'],
              ['Clothing', 'Grey wool coat, dark jeans, walking boots (per RP, not witnessed)'],
              ['Occupation', 'Print setter, Copperplate Print, Bridge Street'],
              ['Last seen', 'Friday 17.10.14, 17:30, leaving work (colleague, by phone)'],
            ],
          },
          { kind: 'heading', text: 'Circumstances' },
          {
            kind: 'para',
            text: 'RP has been unable to contact the MP since Friday evening. Calls go straight to voicemail. RP attended the MP’s flat on Saturday and again this morning and got no answer. Lights off, curtains open.',
          },
          {
            kind: 'para',
            text: 'At 22:04 on Friday 17.10.14 the RP received a text message from the MP’s phone reading: “need a few days. dont worry. dont tell D x”. RP states “D” is likely Daniel CROSS, the MP’s ex-partner. RP states the message is “not how she writes” and that the MP “never puts a kiss on anything”.',
          },
          { kind: 'para', text: 'RP states she last spoke to the MP by telephone on Wednesday 15.10.14 and that the MP seemed well.' },
          { kind: 'para', text: '[[email]]' },
        ],
      },
      {
        stamp: RECEIVED('19 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Risk assessment' },
          {
            kind: 'fields',
            rows: [
              ['Vulnerability', 'None known'],
              ['Mental health', 'None known. RP describes MP as “the most organised person I know”'],
              ['Out of character?', 'Yes, per RP'],
              ['Initial grading', 'MEDIUM'],
            ],
          },
          {
            kind: 'para',
            text: 'Officer’s comment: RP was calm, but tense, and checked her phone throughout. I believe she knows more than she has told me, but I don’t believe she is lying about being worried.',
          },
          { kind: 'signature', lines: ['L. Marsh', 'PC 2241, 19.10.14'] },
          { kind: 'handwritten', text: 'Reviewed. Text message indicates voluntary absence. Regrade LOW. I will take this. — TR 20.10' },
        ],
      },
    ],
  },

  {
    id: 'AD-14-0917-02',
    title: 'Flat inspection report',
    date: '20.10.14',
    author: 'DI 4471 T. Reed',
    department: 'Ashford Division CID',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Filed',
    summary: 'A search of 14B Weir Lane, three days after Eleanor was last seen.',
    requirement: null,
    evidence: ['doc-passport', 'doc-daniel-key'],
    detailsEvidence: 'doc-retyped-page',
    marks: {},
    related: [
      { label: 'Missing-person report', to: '/archive/AD-14-0917-01' },
      { label: 'Eleanor’s blog: Yellow house on Weir Lane', to: '/website/blog/yellow-house' },
    ],
    details: [
      ['Pages', '3'],
      ['Registry stamps', 'p.1 yes · p.2 none · p.3 yes'],
      ['Typeface', 'p.1, p.3: Courier 10 pitch · p.2: different machine, 12 pitch'],
      ['Exhibits', 'EX-0917-14/01 to /04'],
      ['Also present', 'PC 2241 L. Marsh'],
    ],
    pages: [
      {
        stamp: RECEIVED('21 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Inspection of premises' },
          {
            kind: 'fields',
            rows: [
              ['Premises', '14B Weir Lane, Ashford (top floor flat)'],
              ['Date and time', 'Monday 20.10.14, 10:15 to 11:40'],
              ['Officers', 'DI 4471 T. Reed, PC 2241 L. Marsh'],
              ['Access', 'Front door opened by Daniel CROSS using his own key. CROSS states the MP gave him a key in 2012 and never asked for it back. Landlord (Mr G. Pryce) informed'],
            ],
          },
          {
            kind: 'para',
            text: 'Premises secure on arrival. No sign of forced entry or disturbance. Flat clean and tidy. Bed made. Kettle cold. Post on the mat dated 18.10.14 onwards. Small amount of food in the fridge, in date. Heating off.',
          },
          {
            kind: 'para',
            text: 'Living room used as a workspace. Large desk with a laptop computer (closed, powered down), printed photographs, maps of Ashford and a set of large architectural drawings marked “Harrow Mill, 1911”, on loan from Ashford Local Studies.',
          },
          {
            kind: 'para',
            text: 'Laptop computer seized for examination as EX-0917-14/03. CROSS asked whether he would be able to “get his stuff back off it”. He was told no.',
          },
        ],
      },
      {
        stamp: null,
        retyped: true,
        blocks: [
          { kind: 'heading', text: 'Personal effects' },
          {
            kind: 'para',
            text: 'A search was made for items a person would normally take if leaving voluntarily. The following could not be located at the premises:',
          },
          {
            kind: 'table',
            columns: ['Item', 'Finding'],
            rows: [
              ['Passport', 'Not located'],
              ['Toothbrush', 'Not located'],
              ['Mobile phone charger', 'Not located'],
              ['Camera bag (per RP)', 'Not located'],
              ['Purse and bank cards', 'Not located'],
            ],
          },
          {
            kind: 'para',
            text: 'The absence of the above items is consistent with a planned departure. The wardrobe contained a number of empty hangers.',
          },
        ],
      },
      {
        stamp: RECEIVED('21 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Exhibits' },
          {
            kind: 'table',
            columns: ['Ref', 'Item'],
            rows: [
              ['EX-0917-14/01', 'Diary, 2014, small, black'],
              ['EX-0917-14/02', 'Printed photographs (34), loose'],
              ['EX-0917-14/03', 'Laptop computer, silver, with power lead'],
              ['EX-0917-14/04', 'Spare door key, returned by D. CROSS at the scene'],
            ],
          },
          { kind: 'para', text: 'Premises secured at 11:40. Key retained.' },
          { kind: 'signature', lines: ['T. Reed', 'DI 4471, 20.10.14'] },
        ],
      },
    ],
  },

  {
    id: 'AD-14-0917-03',
    title: 'Interview: Daniel Cross',
    date: '21.10.14',
    author: 'DI 4471 T. Reed',
    department: 'Ashford Division CID',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Witness, voluntary',
    summary: 'The ex-partner explains where he was on Friday night. Mostly.',
    requirement: null,
    evidence: ['doc-daniel-alibi'],
    marks: {},
    related: [
      { label: 'Phone activity report', to: '/archive/AD-14-0917-06' },
      { label: 'Eleanor’s website: Friends', to: '/website/friends' },
    ],
    details: [
      ['Pages', '2'],
      ['Start', '21.10.14 14:05'],
      ['End', '21.10.14 14:52'],
      ['Also present', 'PC 2241 L. Marsh'],
      ['Recorded', 'Audio, transcribed 22.10.14'],
    ],
    pages: [
      {
        stamp: RECEIVED('22 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Witness interview transcript' },
          {
            kind: 'fields',
            rows: [
              ['Witness', 'Daniel CROSS, 29, software developer'],
              ['Relationship to MP', 'Former partner, March 2011 to January 2014'],
            ],
          },
          {
            kind: 'transcript',
            lines: [
              ['TR', 'Thank you for coming in, Mr Cross. This is voluntary, and you can leave whenever you like.'],
              ['DC', 'yeah. no, it’s fine. i want to help. has anyone actually looked for her yet or'],
              ['TR', 'That’s what we’re doing. When did you last speak to Eleanor?'],
              ['DC', 'properly? weeks ago. we weren’t really, we’d split up, you know that. i still did bits for her. her site, her email, i set all that up, i still had the logins because she’d have lost them otherwise. she loses everything.'],
              ['TR', 'You still had a key to her flat.'],
              ['DC', 'she gave me that. she locks herself out. that’s not, i didn’t use it. i only used it yesterday because you needed to get in.'],
              ['TR', 'Where were you on Friday evening, the seventeenth?'],
              ['DC', 'at home. working. all night. i pushed a release at quarter to nine, you can check that, it’s timestamped, it’s on the server, twenty forty-seven.'],
              ['TR', 'And you didn’t go out at all.'],
              ['DC', 'no.'],
            ],
          },
        ],
      },
      {
        stamp: RECEIVED('22 OCT 2014'),
        blocks: [
          {
            kind: 'transcript',
            lines: [
              ['TR', 'Did you try to call her on Friday?'],
              ['DC', 'later on. a couple of times. she didn’t pick up. she doesn’t always pick up for me now.'],
              ['TR', 'Why were you calling?'],
              ['DC', 'just. to check she was ok. she’d been weird for weeks. she changed her wifi and didn’t tell me. she had some project she was being really secretive about, photos, she wouldn’t show me.'],
              ['TR', 'What kind of photos?'],
              ['DC', 'i don’t know. that’s what i’m saying. owls, she said. old buildings. it’s always old buildings.'],
              ['TR', 'Did she ever talk about going away? Needing a break from Ashford?'],
              ['DC', 'no. she’d never just go. she wouldn’t go without telling sarah, she tells sarah everything.'],
              ['TR', 'Thank you, Mr Cross. That’s all for now.'],
              ['DC', 'is that it? are you going to look at the commit or'],
              ['TR', 'We’ll be in touch.'],
            ],
          },
          { kind: 'para', text: 'Interview concluded 14:52.' },
          { kind: 'handwritten', text: 'Alibi: commit 20.47. To verify. — TR' },
        ],
      },
    ],
  },

  {
    id: 'AD-14-0917-04',
    title: 'Interview: Sarah Bennett',
    date: '22.10.14',
    author: 'DI 4471 T. Reed',
    department: 'Ashford Division CID',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Witness, voluntary',
    summary: 'The friend who reported her missing, interviewed three days later.',
    requirement: { kind: 'documents', count: 1 },
    evidence: ['doc-sarah-last-contact', 'doc-sarah-swimmer'],
    marks: {},
    related: [
      { label: 'Missing-person report', to: '/archive/AD-14-0917-01' },
      { label: 'Eleanor’s website: About', to: '/website/about' },
    ],
    details: [
      ['Pages', '2'],
      ['Start', '22.10.14 10:00'],
      ['End', '22.10.14 10:41'],
      ['Also present', 'PC 2241 L. Marsh'],
      ['Recorded', 'Audio, transcribed 22.10.14'],
    ],
    pages: [
      {
        stamp: RECEIVED('23 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Witness interview transcript' },
          {
            kind: 'fields',
            rows: [
              ['Witness', 'Sarah BENNETT, 26, reporter, Ashford Courier'],
              ['Relationship to MP', 'Friend since school'],
            ],
          },
          {
            kind: 'transcript',
            lines: [
              ['TR', 'Miss Bennett. Thank you for coming in. I believe we’ve spoken before.'],
              ['SB', 'Once — months ago. About the mill fire.'],
              ['TR', 'Yes. I remember. When did you last speak to Eleanor?'],
              ['SB', 'Wednesday. The fifteenth. On the phone — she was fine. She was busy, she was always busy.'],
              ['TR', 'When you reported her missing, you told PC Marsh your concern came from an email.'],
              ['SB', 'I — no. I think I said that wrong. She’d sent me photos a while back. Owls. That’s all it was.'],
              ['TR', 'Do you still have it?'],
              ['SB', 'No. I clear my inbox. Everyone at the paper does.'],
              ['TR', 'The text message you received on Friday night. You said it wasn’t how she writes.'],
              ['SB', 'It isn’t. She’d never write “dont” — she’d rather die than leave an apostrophe out. She doesn’t put kisses on things.'],
              ['TR', 'People write differently when they’re upset.'],
              ['SB', 'Not her.'],
            ],
          },
        ],
      },
      {
        stamp: RECEIVED('23 OCT 2014'),
        blocks: [
          {
            kind: 'transcript',
            lines: [
              ['TR', 'I have to ask this, with the river as high as it is. Was Eleanor a confident swimmer?'],
              ['SB', 'Yes. Yes — we swam the weir every summer when we were kids. She’s a strong swimmer. Why are you asking me that?'],
              ['TR', 'It’s a standard question. Did she ever talk about wanting to get away? From Ashford, from Mr Cross?'],
              ['SB', 'From Daniel, maybe. Not from — no. She loves it here. She photographs it.'],
              ['TR', 'Is there anything else you’d like on the record, Miss Bennett?'],
              ['SB', '…'],
              ['SB', 'No.'],
            ],
          },
          { kind: 'para', text: 'Interview concluded 10:41.' },
          {
            kind: 'para',
            text: 'Note by PC Marsh: Witness became distressed after the question about swimming and asked to use the bathroom. She did not look at DI Reed again for the rest of the interview.',
          },
          { kind: 'signature', lines: ['T. Reed', 'DI 4471, 22.10.14'] },
        ],
      },
    ],
  },

  {
    id: 'AD-14-0917-05',
    title: 'Investigator notes',
    date: '20.10.14 to 11.03.16',
    author: 'DI 4471 T. Reed',
    department: 'Ashford Division CID',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Daybook extract',
    summary: 'DI Reed’s running notes on the case, transcribed from his daybook.',
    requirement: { kind: 'puzzle', puzzle: 'photoMetadata' },
    evidence: ['doc-reed-attended', 'doc-cal-home', 'doc-reed-car'],
    marks: {},
    related: [
      { label: 'Eleanor’s blog: Lost afternoon at the station', to: '/website/blog/lost-afternoon' },
      { label: 'Photo: Heritage Day', to: '/website/photos/heritage-day' },
      { label: 'Case closure statement', to: '/archive/AD-16-0917-07' },
    ],
    details: [
      ['Pages', '2'],
      ['Source', 'Daybook, DI T. Reed, transcribed by the registry 14.03.16'],
      ['Entries', '20.10.14 to 11.03.16'],
      ['Gaps', 'No entries 24.10.14 (pm) to 29.10.14'],
    ],
    pages: [
      {
        stamp: RECEIVED('14 MAR 2016'),
        blocks: [
          { kind: 'heading', text: 'Daybook extract: Case #0917 (VALE)' },
          {
            kind: 'table',
            columns: ['Date', 'Entry'],
            rows: [
              ['20.10.14 08.10', 'Assumed SIO. Staffing.'],
              ['20.10.14', 'C. kept home from school. Unwell.'],
              ['20.10.14 10.15', 'Weir Lane with PC Marsh. D. Cross attended with own key. Laptop seized. See inspection report.'],
              ['20.10.14', 'For completeness: MP previously presented wildlife camera images to me (11.02.14) re Harrow Mill fire (AD-13-1114). Reviewed at the time. Of no evidential value. Card retained on the fire file.'],
              ['20.10.14', 'For completeness: SIO in that matter was myself. Attended from home 03.52. Scene already in hand.'],
              ['21.10.14 14.05', 'Cross interviewed. Alibi: commit 20.47. To verify.'],
              ['22.10.14 10.00', 'Bennett interviewed. Nothing further.'],
              ['23.10.14 09.30', 'Laptop (EX/03) examined prior to imaging. Brief review for welfare indicators. No relevant material.'],
              ['24.10.14', 'Ashford station. CCTV out of service (maintenance 13.10 to 27.10). Ticket office: cash single to Marrowgate, 21.48, 17.10.14. Clerk cannot describe purchaser.'],
            ],
          },
        ],
      },
      {
        stamp: RECEIVED('14 MAR 2016'),
        blocks: [
          {
            kind: 'table',
            columns: ['Date', 'Entry'],
            rows: [
              ['30.10.14', 'Telecoms report received. Annex B noted.'],
              ['03.11.14', 'Copperplate (colleague, J. Ames) recalls MP in a green coat. RP said grey. Not resolved.'],
              ['10.11.14', 'Mileage claim: own vehicle FX09 RDT. Weir Lane, Ashford station, Copperplate. 14 miles.'],
              ['15.11.14', 'Anniversary. Mill Road closed for works. Diverted.'],
              ['12.01.15', 'Marrowgate enquiries negative. No bank activity. No phone activity since 22.06 17.10.14.'],
              ['09.03.15', 'Standards Unit forwarded an anonymous complaint re this office. Responded. No further action.'],
              ['11.03.16', 'Recommend file inactive. Voluntary departure the most probable explanation.'],
            ],
          },
          { kind: 'handwritten', text: 'Cross alibi: not verified.' },
        ],
      },
    ],
  },

  {
    id: 'AD-14-0917-06',
    title: 'Phone activity report',
    date: '30.10.14',
    author: 'A. Pryor, analyst',
    department: 'Telecoms & Data Unit',
    classification: 'OFFICIAL — SENSITIVE',
    status: 'Filed, with annex',
    summary: 'Calls, texts and mast data for Eleanor’s phone, 15 to 17 October 2014.',
    requirement: { kind: 'documents', count: 1 },
    evidence: ['doc-phone-box', 'doc-sarah-call', 'doc-daniel-calls'],
    marks: {
      caller: {
        kind: 'redaction',
        text: '07700 900412 (S. BENNETT)',
        note: 'This is not ink on the original. It’s a digital layer added to the scan: “Redaction applied 2026-04-12 14:22”. Someone blacked this out eleven and a half years after the report was written.',
        evidence: 'doc-annex-redaction',
      },
    },
    related: [
      { label: 'Missing-person report', to: '/archive/AD-14-0917-01' },
      { label: 'Interview: Sarah Bennett', to: '/archive/AD-14-0917-04' },
      { label: 'Interview: Daniel Cross', to: '/archive/AD-14-0917-03' },
      { label: 'Photo: Harrow Mill from Mill Road', to: '/website/photos/mill-road' },
    ],
    details: [
      ['Pages', '2'],
      ['Subject number', '07700 900176 (E. VALE)'],
      ['Period', '15.10.14 00:00 to 18.10.14 00:00'],
      ['Requested by', 'DI T. Reed, 21.10.14'],
      ['Annex B', 'Generated automatically by the unit, not by the requesting officer'],
      ['Scan', 'Scanned 2014. One digital redaction layer, 2026-04-12'],
    ],
    pages: [
      {
        stamp: RECEIVED('30 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Annex A: subject handset activity' },
          {
            kind: 'table',
            columns: ['Date', 'Time', 'Type', 'Other party', 'Duration'],
            rows: [
              ['15.10.14', '19:12', 'Call out', '07700 900412 (S. BENNETT)', '14m 02s'],
              ['16.10.14', '18:02', 'Call in', '07700 900412 (S. BENNETT)', '11m 40s'],
              ['17.10.14', '12:07', 'Call in', '01632 960418 (public call box, Mill Road)', '6m 11s'],
              ['17.10.14', '19:15', 'SMS out', '07700 900412 (S. BENNETT)', '—'],
              ['17.10.14', '19:55', 'Location', 'Mast AS-114, Mill Road sector', '—'],
              ['17.10.14', '21:03', 'Call in, unanswered', '07700 900233 (D. CROSS)', '—'],
              ['17.10.14', '21:09', 'Call in, unanswered', '07700 900233 (D. CROSS)', '—'],
              ['17.10.14', '21:16', 'Call in, unanswered', '07700 900233 (D. CROSS)', '—'],
              ['17.10.14', '21:30', 'Call in, unanswered', '07700 900233 (D. CROSS)', '—'],
              ['17.10.14', '21:41', 'Call in, unanswered', '07700 900233 (D. CROSS)', '—'],
              ['17.10.14', '21:52', 'Location', 'Mast AS-102, Ashford station', '—'],
              ['17.10.14', '22:04', 'SMS out', '07700 900412 (S. BENNETT)', '—'],
              ['17.10.14', '22:06', 'Last registration', 'Mast AS-102', '—'],
            ],
          },
          {
            kind: 'para',
            text: 'Analyst’s comment: Mast AS-114 covers Mill Road, including the former Harrow Mill site. Movement from AS-114 to AS-102 between 19:55 and 21:52 is consistent with travel by road or on foot. The handset has not registered on any network since 22:06 on 17.10.14.',
          },
        ],
      },
      {
        stamp: RECEIVED('30 OCT 2014'),
        blocks: [
          { kind: 'heading', text: 'Annex B: calls to Ashford Division from numbers on the subject’s record' },
          {
            kind: 'para',
            text: 'Generated automatically. Any number appearing in Annex A is checked against calls received by Ashford Division switchboard and direct lines, 10.10.14 to 18.10.14.',
          },
          {
            kind: 'table',
            columns: ['Date', 'Time', 'Caller', 'Received by', 'Duration'],
            rows: [['16.10.14', '16:20', '[[caller]]', 'Direct line, DI 4471 T. REED', '9m 03s']],
          },
          { kind: 'para', text: 'One match.' },
          { kind: 'signature', lines: ['A. Pryor', 'Analyst, Telecoms & Data Unit, 30.10.14'] },
        ],
      },
    ],
  },

  {
    id: 'AD-16-0917-07',
    title: 'Case closure statement',
    date: '11.03.16',
    author: 'Supt. G. Lowther, on the recommendation of DI T. Reed',
    department: 'Ashford Division',
    classification: 'OFFICIAL',
    status: 'Inactive',
    summary: 'The official explanation, seventeen months later.',
    requirement: { kind: 'documents', count: 3 },
    evidence: ['doc-closure'],
    marks: {},
    related: [
      { label: 'Flat inspection report', to: '/archive/AD-14-0917-02' },
      { label: 'Investigator notes', to: '/archive/AD-14-0917-05' },
    ],
    details: [
      ['Pages', '1'],
      ['Authorised', 'Supt. G. Lowther, 11.03.16'],
      ['Recommended by', 'DI T. Reed (SIO)'],
      ['Review', 'On receipt of new information only'],
    ],
    pages: [
      {
        stamp: RECEIVED('11 MAR 2016'),
        blocks: [
          { kind: 'heading', text: 'Case closure statement' },
          {
            kind: 'fields',
            rows: [
              ['Case', '#0917, VALE, Eleanor Margaret'],
              ['Reported missing', '19.10.14'],
              ['Status', 'INACTIVE'],
              ['Next of kin', 'Mrs R. VALE (mother). Informed 11.03.16'],
            ],
          },
          { kind: 'heading', text: 'Findings' },
          {
            kind: 'para',
            text: '1. The MP was last seen leaving her place of work at 17:30 on Friday 17.10.14. Her mobile phone was last active at Ashford railway station at 22:06 the same evening, shortly after a single ticket to Marrowgate was purchased with cash.',
          },
          {
            kind: 'para',
            text: '2. At 22:04 the MP sent a text message to a friend stating that she needed “a few days” and asking that her former partner not be told.',
          },
          {
            kind: 'para',
            text: '3. A search of the MP’s home found no sign of disturbance. Her passport and a number of personal items could not be located.',
          },
          {
            kind: 'para',
            text: '4. Enquiries with associates, financial institutions and the authorities in Marrowgate have not located the MP. No evidence of third-party involvement has been found. The MP’s former partner was interviewed, and the evidence is insufficient to support any further enquiry.',
          },
          { kind: 'heading', text: 'Conclusion' },
          {
            kind: 'para',
            text: 'On the evidence available, voluntary departure is the most probable explanation. The MP is an adult with the right to leave without informing others. The file is closed as inactive and will be reviewed on receipt of new information.',
          },
          { kind: 'signature', lines: ['G. Lowther', 'Superintendent, Ashford Division, 11.03.16'] },
        ],
      },
    ],
  },
];

export const ARCHIVE_BY_ID = Object.fromEntries(ARCHIVE.map((doc) => [doc.id, doc]));
