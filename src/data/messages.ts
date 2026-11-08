import type { Requirement } from '../types/game';
import type { EvidenceId } from './evidence';

/**
 * Correspondence assembled by whoever sent the player the case file (Sarah, though the game doesn't say so).
 * Voices: Eleanor uses two spaces after full stops and "okay". Daniel writes in lowercase with no apostrophes.
 * Sarah uses em dashes and corrects herself.
 */

export interface Attachment {
  name: string;
  to?: string;
}

export interface Message {
  id: string;
  from: string;
  to?: string;
  date: string;
  subject?: string;
  body: string;
  /** Who owns the bubble in an SMS thread. */
  mine?: boolean;
  deleted?: string;
  attachments?: Attachment[];
  /** Eleanor's own words. Spacing is preserved on screen. */
  eleanor?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  participants: string;
  kind: 'email' | 'sms' | 'reconstruction';
  source: string;
  sortDate: string;
  requirement: Requirement | null;
  evidence: EvidenceId[];
  /** Shown in the thread's "Source details". */
  details: [string, string][];
  detailsEvidence?: EvidenceId;
  messages: Message[];
}

export const THREADS: Thread[] = [
  {
    id: 'case-0917',
    title: 'Case #0917',
    participants: 'No sender',
    kind: 'email',
    source: 'Delivered to you',
    sortDate: '2026-11-02',
    requirement: null,
    evidence: ['msg-anonymous-note'],
    details: [
      ['Received', '02 Nov 2026, 03:12'],
      ['Sender', 'no-reply@relay.example (anonymous relay)'],
      ['Reply-To', 'none'],
    ],
    messages: [
      {
        id: 'note',
        from: 'no-reply@relay.example',
        to: 'reader_0918',
        date: '02 Nov 2026, 03:12',
        subject: 'Case #0917',
        body: `You don't know me. You posted on the Ashford Lost thread years ago — the one about the owl page — and you were the only person on there who sounded careful rather than excited.

Everything I have is in this file. The police records, her site, her mail, and what could be recovered from the rest. I haven't left out anything that matters.

Read it in whatever order you like. Don't contact me. Don't contact anyone in it. If you get to the end and think you know what happened, say so — there's a place for that.

Her site came back online on the 17th. I didn't write that post. I need you to know that before you start.`,
        attachments: [
          { name: 'Police Archive', to: '/archive' },
          { name: 'eleanorvale.example (restored copy)', to: '/website' },
        ],
      },
    ],
  },

  {
    id: 'eleanor-daniel',
    title: 'Eleanor and Daniel',
    participants: 'Eleanor Vale, Daniel Cross',
    kind: 'email',
    source: 'Eleanor’s old mailbox, restored from a 2019 server backup',
    sortDate: '2014-10-17',
    requirement: null,
    evidence: ['msg-keylogger', 'msg-daniel-deleted'],
    details: [
      ['Mailbox', 'eleanor@eleanorvale.example'],
      ['Restored from', 'Server backup, 17 Aug 2019 (made by D. Cross)'],
      ['Messages', '13 in thread, 3 deleted'],
    ],
    messages: [
      {
        id: 'live',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '09 Mar 2012, 23:48',
        subject: 'its live',
        body: 'its up. dns took forever. i put the guestbook on a cron job so it cant fall over and i made you an admin account, the password is on the fridge, dont lose the fridge',
      },
      {
        id: 'live-reply',
        from: 'Eleanor Vale',
        to: 'Daniel',
        date: '10 Mar 2012, 08:02',
        subject: 'Re: its live',
        body: 'It is perfect and I am never going to understand how it works.  Thank you.  The fridge is safe.',
        eleanor: true,
      },
      {
        id: 'clock',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '18 Jun 2013, 19:30',
        subject: 'owl cam',
        body: 'saw the owl post. those trail cams have rubbish clocks, if you want i can write you a script that fixes the timestamps when you import them. takes ten minutes',
      },
      {
        id: 'clock-reply',
        from: 'Eleanor Vale',
        to: 'Daniel',
        date: '18 Jun 2013, 21:12',
        subject: 'Re: owl cam',
        body: 'No thank you.  I like them wrong.  If I know how they are wrong, I know they are mine.',
        eleanor: true,
      },
      {
        id: 'after',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '20 Jan 2014, 01:16',
        subject: '(no subject)',
        body: 'i know you said not to email. i just want to say i get it, i was too much, i know i was. i will keep the hosting going, dont argue, you will forget to renew it and lose everything and then where will your owls go',
      },
      {
        id: 'after-reply',
        from: 'Eleanor Vale',
        to: 'Daniel',
        date: '20 Jan 2014, 12:40',
        subject: 'Re: (no subject)',
        body: 'Keep the hosting if you want to.  Give the key back when you are ready.  And please stop coming into the shop.',
        eleanor: true,
      },
      {
        id: 'wifi',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '22 Sep 2014, 22:05',
        subject: 'wifi',
        body: 'why did you change the wifi password. not angry just asking. the backups cant reach the laptop now so if it dies you lose everything, just so you know',
      },
      {
        id: 'found-it',
        from: 'Eleanor Vale',
        to: 'Daniel',
        date: '11 Oct 2014, 16:31',
        subject: 'I found it',
        body: 'I found the program on my laptop.  The one that writes down every key I press.\n\nDon’t explain.  I know what it is for and I know you will have a reason and I do not want to hear it.  It is gone now.\n\nLeave me alone, Daniel.  I mean properly this time.',
        eleanor: true,
      },
      {
        id: 'found-it-reply',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '11 Oct 2014, 16:58',
        subject: 'Re: I found it',
        body: 'its not what you think. i put it on in 2012 when you lost the whole photo folder, you asked me to back everything up, you dont remember. i never looked at it. el i never looked at it',
      },
      {
        id: 'deleted-1',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '17 Oct 2014, 20:58',
        body: '',
        deleted: 'Deleted 18 Oct 2014, 07:43, by admin account “daniel_admin”',
      },
      {
        id: 'deleted-2',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '17 Oct 2014, 21:44',
        body: '',
        deleted: 'Deleted 18 Oct 2014, 07:43, by admin account “daniel_admin”',
      },
      {
        id: 'deleted-3',
        from: 'Daniel Cross',
        to: 'Eleanor',
        date: '17 Oct 2014, 23:10',
        body: '',
        deleted: 'Deleted 18 Oct 2014, 07:44, by admin account “daniel_admin”',
      },
    ],
  },

  {
    id: 'eleanor-sarah',
    title: 'El',
    participants: 'Sarah Bennett, Eleanor Vale',
    kind: 'sms',
    source: 'Sarah Bennett’s phone, message export',
    sortDate: '2014-10-18',
    requirement: null,
    evidence: ['msg-midnight-text'],
    detailsEvidence: 'msg-sarah-gap',
    details: [
      ['Device', 'S. Bennett, 07700 900412'],
      ['Exported', '12 Apr 2026'],
      ['Messages in thread (export header)', '27'],
      ['Messages in this copy', '24'],
    ],
    messages: [
      { id: 's1', from: 'Sarah', date: '24 Nov 2013, 21:10', body: 'Just read your post. You knew him? The man in the boiler house?', mine: true },
      { id: 's2', from: 'El', date: '24 Nov 2013, 21:16', body: 'A bit.  He told me about the owls.  I never asked his name.', eleanor: true },
      { id: 's3', from: 'Sarah', date: '24 Nov 2013, 21:17', body: 'Want me to find out? I can — it’s literally my job.', mine: true },
      { id: 's4', from: 'El', date: '24 Nov 2013, 21:30', body: 'Yes.  No.  Later.', eleanor: true },
      { id: 's5', from: 'El', date: '11 Feb 2014, 17:40', body: 'Did the good citizen thing.  The detective made me tea.  He kept the card.', eleanor: true },
      { id: 's6', from: 'Sarah', date: '11 Feb 2014, 17:42', body: 'Kept it?? Did you get a receipt', mine: true },
      { id: 's7', from: 'El', date: '11 Feb 2014, 17:45', body: 'I got a receipt.  I have already lost the receipt.', eleanor: true },
      { id: 's8', from: 'El', date: '28 Sep 2014, 22:51', body: 'Can I show you something?  Not on here.  Not on email either.', eleanor: true },
      { id: 's9', from: 'Sarah', date: '28 Sep 2014, 22:53', body: 'That is the most sinister thing you’ve ever sent me — yes. When?', mine: true },
      { id: 's10', from: 'El', date: '28 Sep 2014, 23:20', body: 'Not yet.  Soon.  I need to be sure first.', eleanor: true },
      { id: 's11', from: 'El', date: '12 Oct 2014, 19:02', body: 'Anchor tomorrow?  One o’clock.  Bring nothing with a microphone in it.', eleanor: true },
      { id: 's12', from: 'Sarah', date: '12 Oct 2014, 19:03', body: 'So my phone, then. Fine — yes.', mine: true },
      { id: 's13', from: 'Sarah', date: '13 Oct 2014, 15:02', body: 'El, that’s — that’s a story. That’s an actual story. Who is it?', mine: true },
      { id: 's14', from: 'El', date: '13 Oct 2014, 15:10', body: 'Not yet.', eleanor: true },
      { id: 's15', from: 'Sarah', date: '13 Oct 2014, 15:11', body: 'Then let me do it properly. Right of reply, the lot. That’s how it works.', mine: true },
      { id: 's16', from: 'El', date: '13 Oct 2014, 15:40', body: 'Not yet, Sarah.', eleanor: true },
      {
        id: 's17',
        from: 'El',
        date: '17 Oct 2014, 19:15',
        body: 'If I don’t text by midnight read the last thing I sent you.  Not joking.  Probably joking.',
        eleanor: true,
      },
      { id: 's18', from: 'Sarah', date: '17 Oct 2014, 19:20', body: '?? What are you doing tonight', mine: true },
      { id: 's19', from: 'Sarah', date: '17 Oct 2014, 19:41', body: 'El', mine: true },
      { id: 's20', from: 'El', date: '17 Oct 2014, 22:04', body: 'need a few days. dont worry. dont tell D x' },
      { id: 's21', from: 'Sarah', date: '17 Oct 2014, 22:06', body: 'That’s not you. Ring me.', mine: true },
      { id: 's22', from: 'Sarah', date: '17 Oct 2014, 22:31', body: 'Please.', mine: true },
      { id: 's23', from: 'Sarah', date: '18 Oct 2014, 00:00', body: 'It’s midnight.', mine: true },
      { id: 's24', from: 'Sarah', date: '18 Oct 2014, 08:02', body: 'I’m outside yours. Nobody’s answering.', mine: true },
    ],
  },

  {
    id: 'deleted-email',
    title: '(no subject)',
    participants: 'Eleanor Vale, Sarah Bennett',
    kind: 'reconstruction',
    source: 'Ashford Courier mail archive, deleted items',
    sortDate: '2014-10-16',
    requirement: { kind: 'puzzle', puzzle: 'blogPassword' },
    evidence: [],
    details: [
      ['From', 'owls.eleanor@postbox.example (opened 11 Oct 2014)'],
      ['To', 's.bennett@ashfordcourier.example'],
      ['Sent', 'Thu 16 Oct 2014, 23:02'],
      ['Status', 'Deleted by recipient 21 Oct 2014. Body survives as 6 fragments'],
      ['Archive', 'Courier mail server, rescued 2018'],
    ],
    messages: [],
  },

  {
    id: 'courier-holt',
    title: 'Story — need ten minutes',
    participants: 'Sarah Bennett, Graham Holt',
    kind: 'email',
    source: 'Ashford Courier mail archive',
    sortDate: '2014-10-23',
    requirement: { kind: 'puzzle', puzzle: 'emailReconstruction' },
    evidence: ['msg-sarah-knew'],
    details: [
      ['Archive', 'Courier mail server, rescued 2018'],
      ['Thread', '2 messages'],
    ],
    messages: [
      {
        id: 'pitch',
        from: 'Sarah Bennett',
        to: 'Graham Holt',
        date: '23 Oct 2014, 09:14',
        subject: 'Story — need ten minutes',
        body: `Graham — I have wildlife-camera frames from the night of the Harrow Mill fire. They show an adult at the scene half an hour before the 999 call. The car at the gate is Tom Reed's.

The source who gave me the frames has been missing since Friday. Reed is running the search. I know how that sounds. I need ten minutes.`,
        attachments: [{ name: 'frames_0239_0240.zip (not preserved)' }],
      },
      {
        id: 'reply',
        from: 'Graham Holt',
        to: 'Sarah Bennett',
        date: '23 Oct 2014, 11:52',
        subject: 'Re: Story — need ten minutes',
        body: `Sarah. I've looked. I see a blurred man, half a number plate and a coincidence.

You're asking me to put a serving DI next to a dead man and a missing woman on the strength of a trail camera. We'd be sued into the river and we'd deserve it. Bring me something that isn't a shape. Until then, no.

And go home. You look awful.

G.`,
      },
    ],
  },

  {
    id: 'standards',
    title: 'Concern regarding an officer, Ashford Division',
    participants: 'Anonymous, Police Standards Unit',
    kind: 'email',
    source: 'Sarah Bennett’s personal mailbox',
    sortDate: '2015-04-02',
    requirement: { kind: 'puzzle', puzzle: 'emailReconstruction' },
    evidence: ['msg-complaint'],
    details: [
      ['Sender', 'a.concerned.source@freemail.example (created 08 Mar 2015)'],
      ['Mailbox owner', 'S. Bennett'],
    ],
    messages: [
      {
        id: 'complaint',
        from: 'a.concerned.source@freemail.example',
        to: 'Police Standards Unit, Westmarch Constabulary',
        date: '09 Mar 2015, 23:40',
        subject: 'Concern regarding an officer, Ashford Division',
        body: `I want to report a concern about the officer leading the search for Eleanor Vale (Case #0917).

I believe he was present at Harrow Mill on the night of the fire in November 2013, before the emergency call was made, and that Eleanor had evidence of this. I believe he knew she had it.

I can't give my name. I'm sorry. Please just look.`,
      },
      {
        id: 'response',
        from: 'Police Standards Unit',
        to: 'a.concerned.source@freemail.example',
        date: '02 Apr 2015, 10:03',
        subject: 'Re: Concern regarding an officer, Ashford Division',
        body: `Thank you for contacting the Standards Unit.

Your concern has been assessed. Enquiries were made with the officer concerned and with the division. No evidence was found to support the matters raised, and no further action will be taken.

If you have further information, you may contact us again. Anonymous reports are difficult to progress.`,
      },
    ],
  },

  {
    id: 'hollis-dunn',
    title: 'The late Mr Thomas Reed',
    participants: 'Hollis & Dunn Solicitors, Sarah Bennett',
    kind: 'email',
    source: 'Sarah Bennett’s personal mailbox',
    sortDate: '2026-03-20',
    requirement: { kind: 'puzzle', puzzle: 'emailReconstruction' },
    evidence: ['msg-solicitor-letter'],
    details: [
      ['From', 'p.dunn@hollisdunn.example'],
      ['Delivered with', 'One sealed metal box, by courier'],
      ['Note in the file', '“I scanned what was in the box and locked it with the same four digits. It seemed fair.”'],
    ],
    messages: [
      {
        id: 'letter',
        from: 'P. Dunn, Hollis & Dunn Solicitors',
        to: 'Ms S. Bennett',
        date: '20 Mar 2026, 10:15',
        subject: 'The late Mr Thomas Reed',
        body: `Dear Ms Bennett,

We act for the estate of the late Mr Thomas Reed, who died on 3 March 2026.

Mr Reed left instructions that a sealed box be delivered to you personally after his death. It is being delivered today by courier.

We have not opened the box and have no knowledge of its contents. It is secured with a four-digit combination lock. Mr Reed did not give us the combination. He left one instruction regarding it, which we reproduce exactly:

"The code is the minute I should have picked up the telephone."

Mr Reed asked us to add that you would understand, and that he was sorry it was you.

Yours sincerely,

P. Dunn
Hollis & Dunn Solicitors`,
        attachments: [{ name: 'reed_box (sealed, scanned copy in the Terminal)', to: '/terminal' }],
      },
    ],
  },

  {
    id: 'sarah-daniel',
    title: 'The backup',
    participants: 'Sarah Bennett, Daniel Cross',
    kind: 'email',
    source: 'Sarah Bennett’s personal mailbox',
    sortDate: '2026-04-05',
    requirement: { kind: 'puzzle', puzzle: 'blogPassword' },
    evidence: ['msg-daniel-backup'],
    details: [['Thread', '3 messages']],
    messages: [
      {
        id: 'ask',
        from: 'Sarah Bennett',
        to: 'Daniel Cross',
        date: '03 Apr 2026, 22:47',
        subject: '(no subject)',
        body: `Daniel — it's Sarah Bennett. I know. Twelve years.

I need the backup of her site — the last one you made before it went down. I'm not going to explain yet. Please.`,
      },
      {
        id: 'answer',
        from: 'Daniel Cross',
        to: 'Sarah Bennett',
        date: '05 Apr 2026, 06:10',
        subject: 'Re: (no subject)',
        body: 'i still have it. i never deleted anything, i couldnt. its about 4gb, ill send a link.\n\nsarah if this is about her i want to know. i have a kid now, i cant do another year like that one. whatever you find just tell me if it was me. if i could have done something',
        attachments: [{ name: 'eleanorvale_backup_2019-08-17.tar.gz (link expired)' }],
      },
      {
        id: 'promise',
        from: 'Sarah Bennett',
        to: 'Daniel Cross',
        date: '05 Apr 2026, 07:31',
        subject: 'Re: (no subject)',
        body: 'I will.',
      },
    ],
  },
];

THREADS.push({
  id: 'one-line',
  title: 'One line',
  participants: 'No sender',
  kind: 'email',
  source: 'Delivered to you',
  sortDate: '2026-11-03',
  requirement: {
    kind: 'flag',
    flag: 'read-annex-original',
    description: 'Arrives after you read the original Annex B.',
  },
  evidence: [],
  details: [
    ['Sender', 'no-reply@relay.example (anonymous relay)'],
    ['Received', 'After you read the original Annex B'],
  ],
  messages: [
    {
      id: 'confession',
      from: 'no-reply@relay.example',
      to: 'reader_0918',
      date: 'Today',
      subject: 'One line',
      body: `I built this for you because I can't read it straight anymore. Everything's here — except that one line, and I took that out in April and told myself it was to protect the source. I was the source.

The second you typed that password you did what I did. I'm not angry. It's the obvious thing to do. It's the only thing that looks like helping.`,
    },
  ],
});

export const THREADS_BY_ID = Object.fromEntries(THREADS.map((thread) => [thread.id, thread]));
