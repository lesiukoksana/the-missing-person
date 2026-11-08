import type { EvidenceId } from './evidence';

/**
 * Twelve years, 2012 to 2026 (canon section 5). An event appears once its `reveal` evidence is found,
 * or from the start when `reveal` is null. Conflicts list competing versions, each with its own source.
 * A conflict stays "disputed" until any `resolvedBy` evidence is found, and some never resolve.
 */

export type Category = 'life' | 'blog' | 'messages' | 'photos' | 'police' | 'disappearance' | 'digital';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'life', label: 'Eleanor’s life' },
  { id: 'blog', label: 'Blog posts' },
  { id: 'messages', label: 'Messages' },
  { id: 'photos', label: 'Photographs' },
  { id: 'police', label: 'Police' },
  { id: 'disappearance', label: 'The disappearance' },
  { id: 'digital', label: 'Later digital activity' },
];

export interface Version {
  claim: string;
  source: string;
  /** Null means this version is known from the start. */
  reveal: EvidenceId | null;
  reliable: boolean;
}

export interface Conflict {
  question: string;
  versions: Version[];
  resolvedBy: EvidenceId[];
  resolution: string;
  /** Title once resolved. */
  settled?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  category: Category;
  reveal: EvidenceId | null;
  /** For things nothing in the case can explain. */
  unexplained?: boolean;
  conflict?: Conflict;
  /** A later discovery that changes what this event says. */
  update?: { evidence: EvidenceId; title: string; description: string };
  links?: { label: string; to: string }[];
}

export const TIMELINE: TimelineEvent[] = [
  // 2012
  {
    id: 'site-launch',
    date: '2012-03-10',
    title: 'Eleanor launches her website',
    description: '“First things first: hello.” Daniel set up the server and the guestbook.',
    category: 'blog',
    reveal: null,
    links: [{ label: 'Testing, testing', to: '/website/blog/testing' }],
  },
  {
    id: 'weir-lane',
    date: '2012-09-23',
    title: 'Moves into 14B Weir Lane',
    description: 'The yellow house. Daniel carries the boxes and keeps a spare key.',
    category: 'life',
    reveal: null,
    links: [{ label: 'Yellow house on Weir Lane', to: '/website/blog/yellow-house' }],
  },

  // 2013
  {
    id: 'first-mill',
    date: '2013-03-16',
    title: 'First visit to Harrow Mill',
    description: 'Owl pellets in the wheel house. An old man sleeping in the boiler house warns her off the east end of the gallery.',
    category: 'blog',
    reveal: null,
    links: [{ label: 'Things people leave behind', to: '/website/blog/things-people-leave' }],
  },
  {
    id: 'owl-camera',
    date: '2013-06-17',
    title: 'The owl camera goes up',
    description: 'A TrailEye TC-12 on the wheel house wall, facing the yard. Cal from camera club holds the ladder. Its clock runs 7 minutes fast.',
    category: 'blog',
    reveal: 'blog-owl-camera',
    links: [{ label: 'Owl camera!', to: '/website/blog/owl-camera' }],
  },
  {
    id: 'bonfire',
    date: '2013-11-05',
    title: 'Bonfire night',
    description: 'Sarah photographs Eleanor at the rugby club bonfire.',
    category: 'photos',
    reveal: null,
    update: {
      evidence: 'bonfire-thumbnail',
      title: 'Bonfire night, and an argument',
      description: 'The full frame shows a second person pointing at Eleanor. The photo was cropped on 17 February 2015.',
    },
    links: [{ label: 'Bonfire night', to: '/website/photos/bonfire' }],
  },
  {
    id: 'fire',
    date: '2013-11-15',
    time: '03:14',
    title: 'Fire at Harrow Mill',
    description: 'The drying loft burns. A man dies in the boiler house. The 999 call comes from a public phone at 03:14.',
    category: 'police',
    reveal: 'blog-after-fire',
    update: {
      evidence: 'box-reed-letter',
      title: 'Fire at Harrow Mill. Peter Aldous dies',
      description: 'Peter Aldous, a former overlooker, dies of smoke in the boiler house. He might have lived if the call had come at 02:45.',
    },
    links: [{ label: 'After the fire', to: '/website/blog/after-the-fire' }],
  },
  {
    id: 'fire-arrival',
    date: '2013-11-15',
    title: 'When did DI Reed reach the mill?',
    description: 'Two records disagree about the night of the fire.',
    category: 'police',
    reveal: null,
    conflict: {
      question: 'When did DI Reed reach the mill?',
      versions: [
        { claim: '03:52, from home, after the scene was “in hand”', source: 'Reed’s daybook', reveal: 'doc-reed-attended', reliable: false },
        {
          claim: '02:45, at the gate: frame TE_0239 is stamped 02:52 by a clock that runs 7 minutes fast',
          source: 'Eleanor’s owl camera',
          reveal: 'frame-blue-hour',
          reliable: true,
        },
      ],
      resolvedBy: ['box-reed-letter'],
      resolution: 'Reed’s own letter: “I reached the mill at 02.45.”',
      settled: 'DI Reed reached the mill at 02:45, before the 999 call',
    },
  },
  {
    id: 'card-retrieved',
    date: '2013-11-23',
    title: 'Eleanor gets her camera card back',
    description: 'The cordon is lifted. Five months of owls, and “some odd frames” from the night of the fire.',
    category: 'life',
    reveal: 'blog-after-fire',
  },

  // 2014
  {
    id: 'breakup',
    date: '2014-01-19',
    title: 'Eleanor ends it with Daniel',
    description: 'He keeps the hosting, the logins and the key.',
    category: 'life',
    reveal: 'blog-station',
    links: [{ label: 'Eleanor and Daniel’s emails', to: '/messages/eleanor-daniel' }],
  },
  {
    id: 'inquest',
    date: '2014-02-06',
    title: 'Inquest into the fire: misadventure',
    description: 'The death is ruled an accident.',
    category: 'police',
    reveal: 'blog-station',
  },
  {
    id: 'station',
    date: '2014-02-11',
    title: 'Eleanor hands the original card to DI Reed',
    description: 'He makes the tea, says the frames show nothing, and keeps the card “for the file”.',
    category: 'police',
    reveal: 'blog-station',
    links: [{ label: 'Lost afternoon at the station', to: '/website/blog/lost-afternoon' }],
  },
  {
    id: 'heritage',
    date: '2014-09-13',
    title: 'Heritage Day',
    description: 'Eleanor photographs the old fire engine. A dark estate car is parked behind it.',
    category: 'photos',
    reveal: null,
    update: {
      evidence: 'plate-heritage',
      title: 'Heritage Day, and a number plate',
      description: 'The car behind the fire engine is FX09 RDT.',
    },
    links: [{ label: 'Heritage Day', to: '/website/photos/heritage-day' }],
  },
  {
    id: 'keylog-capture',
    date: '2014-09-14',
    time: '21:03',
    title: 'The keylogger captures the owl password',
    description: 'Eleanor types the word on her own site. The cache syncs to Daniel’s address.',
    category: 'digital',
    reveal: 'rec-keylog',
  },
  {
    id: 'keylog-found',
    date: '2014-10-11',
    title: 'Eleanor finds the keylogger',
    description: '“Leave me alone, Daniel. I mean properly this time.”',
    category: 'messages',
    reveal: 'msg-keylogger',
  },
  {
    id: 'backups',
    date: '2014-10-12',
    title: '“Backups (a boring post)”',
    description: 'She changes every password and sets up a job that runs “as long as I keep turning up”.',
    category: 'blog',
    reveal: null,
    update: {
      evidence: 'rec-draft-post',
      title: 'She writes the dead man’s switch, and its warning',
      description: 'stage1.txt is created at 21:40: “I know you’re looking for me.  You shouldn’t be.”',
    },
    links: [{ label: 'Backups (a boring post)', to: '/website/blog/backups' }],
  },
  {
    id: 'anchor',
    date: '2014-10-13',
    title: 'Eleanor shows Sarah the frames',
    description: 'At the Anchor café. She won’t say who is in them. “Not yet, Sarah.”',
    category: 'messages',
    reveal: 'msg-midnight-text',
  },
  {
    id: 'disguise',
    date: '2014-10-14',
    time: '22:31',
    title: 'Eleanor disguises a frame as “Blue hour”',
    description: 'She edits TE_0239 and posts it in her public gallery, dated October 2013.',
    category: 'photos',
    reveal: 'frame-blue-hour',
  },
  {
    id: 'last-post',
    date: '2014-10-15',
    title: 'Last blog post: “Almost done”',
    description: 'Rain all week, the Ashe rising. “There is one thing to tidy up.”',
    category: 'blog',
    reveal: null,
    links: [{ label: 'Almost done', to: '/website/blog/almost-done' }],
  },
  {
    id: 'last-contact',
    date: '2014-10-16',
    title: 'When did Sarah last speak to Eleanor?',
    description: 'Sarah’s account and the phone records disagree.',
    category: 'messages',
    reveal: null,
    conflict: {
      question: 'When did Sarah last speak to Eleanor?',
      versions: [
        { claim: 'Wednesday 15 October, by phone. “She was fine.”', source: 'Sarah’s statement', reveal: 'doc-sarah-last-contact', reliable: false },
        { claim: 'Thursday 16 October, 18:02, an eleven-minute call', source: 'Phone activity report', reveal: 'doc-sarah-call', reliable: true },
      ],
      resolvedBy: ['doc-sarah-call', 'email-reconstructed'],
      resolution: 'The phone records are independent. Sarah moved the date back a day.',
      settled: 'Sarah last spoke to Eleanor on 16 October, not the 15th',
    },
  },
  {
    id: 'call-to-reed',
    date: '2014-10-16',
    time: '16:20',
    title: 'Someone rings DI Reed’s direct line',
    description: 'A nine-minute call from a number on Eleanor’s phone record. The caller is blacked out.',
    category: 'police',
    reveal: 'doc-annex-redaction',
    update: {
      evidence: 'box-annex-original',
      title: 'Sarah rings DI Reed for comment',
      description: 'She puts Eleanor’s story to the officer in charge. She doesn’t know he is the man in the frame.',
    },
  },
  {
    id: 'email',
    date: '2014-10-16',
    time: '23:02',
    title: 'Eleanor emails Sarah: “It’s him.”',
    description: 'From a new account Daniel can’t read. Sarah deletes it five days later.',
    category: 'messages',
    reveal: 'email-reconstructed',
    links: [{ label: 'The rebuilt email', to: '/messages/deleted-email' }],
  },
  {
    id: 'phone-box',
    date: '2014-10-17',
    time: '12:07',
    title: 'A call from the Mill Road phone box',
    description: 'Six minutes. A public phone opposite the mill gate.',
    category: 'disappearance',
    reveal: 'doc-phone-box',
  },
  {
    id: 'last-seen',
    date: '2014-10-17',
    time: '17:30',
    title: 'Last confirmed sighting',
    description: 'Eleanor leaves Copperplate Print. A colleague remembers a green coat. Sarah says she would have worn the grey one.',
    category: 'disappearance',
    reveal: null,
    update: {
      evidence: 'box-marsh-tally',
      title: 'Last confirmed sighting, in the green coat',
      description: 'PC Marsh found the grey coat on its hook in the flat. The colleague was right.',
    },
  },
  {
    id: 'midnight',
    date: '2014-10-17',
    time: '19:15',
    title: '“If I don’t text by midnight…”',
    description: 'Eleanor’s last text that sounds like her.',
    category: 'messages',
    reveal: 'msg-midnight-text',
    links: [{ label: 'Eleanor and Sarah’s texts', to: '/messages/eleanor-sarah' }],
  },
  {
    id: 'where',
    date: '2014-10-17',
    title: 'Where did Eleanor go that evening?',
    description: 'The official story and the phone masts point different ways.',
    category: 'disappearance',
    reveal: null,
    conflict: {
      question: 'Where did Eleanor go that evening?',
      versions: [
        { claim: 'She left Ashford by train, 21:58, cash single to Marrowgate', source: 'Case closure statement', reveal: 'doc-closure', reliable: false },
        { claim: 'Her phone was at Harrow Mill from 19:55', source: 'Phone activity report, mast AS-114', reveal: 'doc-phone-box', reliable: true },
      ],
      resolvedBy: ['box-reed-letter'],
      resolution: 'Reed: “The gallery gave way at about 20.40.” Her phone reached the station without her.',
      settled: 'Eleanor went to Harrow Mill. Her phone went to the station without her',
    },
  },
  {
    id: 'fall',
    date: '2014-10-17',
    time: '20:40',
    title: 'The gallery gives way',
    description: 'In the wheel house, above the flooded pit. Reed searches until 21:30 and finds no one. He doesn’t call anyone.',
    category: 'disappearance',
    reveal: 'box-reed-letter',
  },
  {
    id: 'text',
    date: '2014-10-17',
    time: '22:04',
    title: 'Who sent the 22:04 text?',
    description: '“need a few days. dont worry. dont tell D x”',
    category: 'disappearance',
    reveal: 'doc-text-message',
    conflict: {
      question: 'Who sent the 22:04 text?',
      versions: [
        { claim: 'Eleanor, asking for time away', source: 'Case closure statement', reveal: 'doc-text-message', reliable: false },
        { claim: 'Not Eleanor: “not how she writes”, “never puts a kiss on anything”', source: 'Sarah, in the missing-person report', reveal: 'doc-text-message', reliable: true },
      ],
      resolvedBy: ['msg-midnight-text', 'rec-draft-post'],
      resolution: 'Three hours earlier she wrote “Not joking.  Probably joking.”: two spaces, full stops, no kiss.',
      settled: 'Eleanor didn’t send the 22:04 text',
    },
  },
  {
    id: 'deleted-emails',
    date: '2014-10-18',
    time: '07:43',
    title: 'Daniel deletes his emails from that night',
    description: 'Three messages, removed using his admin account.',
    category: 'messages',
    reveal: 'msg-daniel-deleted',
  },
  {
    id: 'reported',
    date: '2014-10-19',
    time: '11:30',
    title: 'Sarah reports Eleanor missing',
    description: 'PC Marsh writes down that Sarah’s worry began with an email. Someone strikes it out.',
    category: 'police',
    reveal: 'doc-text-message',
    links: [{ label: 'Missing-person report', to: '/archive/AD-14-0917-01' }],
  },
  {
    id: 'passport',
    date: '2014-10-20',
    title: 'Was the passport in the flat?',
    description: 'The search of 14B Weir Lane, three days later.',
    category: 'police',
    reveal: null,
    conflict: {
      question: 'Was her passport in the flat?',
      versions: [
        { claim: 'No. “Not located”, consistent with a planned departure', source: 'Inspection report, page 2', reveal: 'doc-passport', reliable: false },
        { claim: 'Yes. In the desk drawer, with her bank cards and purse', source: 'PC Marsh’s handwritten tally', reveal: 'box-marsh-tally', reliable: true },
      ],
      resolvedBy: ['box-marsh-tally'],
      resolution: 'Page 2 of the report was retyped and never stamped. Marsh handed her list to Reed at 11:35.',
      settled: 'Her passport was in the flat',
    },
  },
  {
    id: 'alibi',
    date: '2014-10-21',
    title: 'Was Daniel at home all evening?',
    description: 'Daniel is interviewed.',
    category: 'police',
    reveal: null,
    conflict: {
      question: 'Was Daniel at home all evening?',
      versions: [
        { claim: 'Yes. A code commit was pushed at 20:47', source: 'Daniel’s statement', reveal: 'doc-daniel-alibi', reliable: false },
        { claim: 'Unknown. A commit can be scheduled, and nobody ever checked it', source: 'Reed’s daybook: “Cross alibi: not verified”', reveal: 'doc-cal-home', reliable: false },
      ],
      resolvedBy: [],
      resolution: '',
    },
  },
  {
    id: 'interview-sarah',
    date: '2014-10-22',
    title: 'Sarah is interviewed by DI Reed',
    description: '“Is there anything else you’d like on the record, Miss Bennett?” “No.”',
    category: 'police',
    reveal: 'doc-sarah-last-contact',
    links: [{ label: 'Interview: Sarah Bennett', to: '/archive/AD-14-0917-04' }],
  },
  {
    id: 'laptop',
    date: '2014-10-23',
    time: '09:41',
    title: 'Files deleted from the seized laptop',
    description: 'During a “brief review for welfare indicators”. The laptop is imaged four days later.',
    category: 'police',
    reveal: 'rec-draft-post',
    links: [{ label: 'File Recovery', to: '/recovery' }],
  },
  {
    id: 'holt',
    date: '2014-10-23',
    title: 'Sarah takes the story to her editor',
    description: '“I see a blurred man, half a number plate and a coincidence.” He says no.',
    category: 'messages',
    reveal: 'msg-sarah-knew',
  },

  // 2015 to 2019
  {
    id: 'checkins',
    date: '2014-11-17',
    title: 'The monthly check-ins begin',
    description: 'Someone types the word on the 17th of every month, from Daniel’s address, until August 2019.',
    category: 'digital',
    reveal: 'site-checkin-log',
  },
  {
    id: 'threat',
    date: '2015-02-17',
    title: '“i know someone was at the mill”',
    description: 'UNKNOWN USER, from Daniel’s home address.',
    category: 'digital',
    reveal: 'guestbook-threat',
    links: [{ label: 'The guestbook', to: '/website/guestbook' }],
  },
  {
    id: 'complaint',
    date: '2015-03-09',
    title: 'An anonymous complaint to Police Standards',
    description: 'About the officer leading the search. No further action.',
    category: 'police',
    reveal: 'msg-complaint',
  },
  {
    id: 'el-phone',
    date: '2015-03-17',
    time: '04:12',
    title: 'A check-in from Eleanor’s phone',
    description: 'The one line in the log nobody can account for. Daniel was in hospital that night.',
    category: 'digital',
    reveal: 'site-checkin-log',
    unexplained: true,
  },
  {
    id: 'closure',
    date: '2016-03-11',
    title: 'Case closed: voluntary departure',
    description: 'File marked inactive on DI Reed’s recommendation.',
    category: 'police',
    reveal: 'doc-closure',
    links: [{ label: 'Case closure statement', to: '/archive/AD-16-0917-07' }],
  },
  {
    id: 'aldous-post',
    date: '2016-11-15',
    title: '“Peter Aldous had a sister.”',
    description: 'UNKNOWN USER, on the anniversary of the fire, from a library terminal.',
    category: 'digital',
    reveal: null,
  },
  {
    id: 'every-year',
    date: '2017-10-17',
    title: '“I went back to look. I have gone back every year.”',
    description: 'UNKNOWN USER, on the anniversary of her disappearance.',
    category: 'digital',
    reveal: null,
  },
  {
    id: 'offline',
    date: '2019-09-01',
    title: 'The site goes offline',
    description: 'The hosting is unpaid. The last check-in was fifteen days earlier, so the switch never fires.',
    category: 'digital',
    reveal: 'site-checkin-log',
  },

  // 2026
  {
    id: 'reed-dies',
    date: '2026-03-03',
    title: 'Thomas Reed dies',
    description: 'He leaves a sealed box to Sarah Bennett.',
    category: 'life',
    reveal: 'msg-solicitor-letter',
  },
  {
    id: 'backup',
    date: '2026-04-05',
    title: 'Daniel sends Sarah his backup of the site',
    description: '“whatever you find just tell me if it was me.”',
    category: 'messages',
    reveal: 'msg-daniel-backup',
  },
  {
    id: 'redaction',
    date: '2026-04-12',
    time: '14:22',
    title: 'A caller is blacked out of the phone report',
    description: 'A digital redaction added to a 2014 document, eleven and a half years later.',
    category: 'digital',
    reveal: 'doc-annex-redaction',
  },
  {
    id: 'new-post',
    date: '2026-10-17',
    time: '20:45',
    title: 'A new post on Eleanor’s site',
    description: '“I know you’re looking for me.  You shouldn’t be.”',
    category: 'digital',
    reveal: null,
    conflict: {
      question: 'When was the new post written?',
      versions: [
        { claim: 'Posted 17 October 2026, by “eleanor”', source: 'Eleanor’s blog', reveal: null, reliable: false },
        { claim: 'Written 12 October 2014, 21:40, as stage1.txt', source: 'Eleanor’s laptop, deleted folder', reveal: 'rec-draft-post', reliable: true },
      ],
      resolvedBy: ['site-checkin-script'],
      resolution: 'Her switch posted it, twelve years late, when the site was restored.',
      settled: 'The new post was written in 2014 and published by her switch',
    },
    links: [{ label: 'The post', to: '/website/blog/untitled' }],
  },
  {
    id: 'stage2',
    date: '2026-10-23',
    time: '23:52',
    title: 'Someone stops the switch',
    description: 'A check-in the night before everything would have been sent. Same address as three of this year’s guestbook posts.',
    category: 'digital',
    reveal: 'site-checkin-log',
  },
  {
    id: 'you',
    date: '2026-11-02',
    time: '03:12',
    title: 'The case file reaches you',
    description: '“I didn’t write that post. I need you to know that before you start.”',
    category: 'digital',
    reveal: 'msg-anonymous-note',
  },
];
