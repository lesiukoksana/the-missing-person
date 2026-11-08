import type { PuzzleId } from '../../types/game';
import type { EvidenceId } from '../evidence';

export interface GuestbookEntry {
  id: string;
  name: string;
  /** ISO date used for ordering. Null means the post displays today's date. */
  isoDate: string | null;
  displayDate: string;
  message: string;
  uid: number;
  address: string;
  browser: string;
  revealAfter?: PuzzleId;
  revealFlag?: string;
  /** A note that this post was edited appears once this puzzle is solved. */
  editedAfter?: PuzzleId;
  evidence?: EvidenceId;
}

const UNKNOWN = 'UNKNOWN USER';

const ELEANOR_HOME = '203.0.113.21';
const DANIEL_HOME = '203.0.113.77';
const COURIER = '198.51.100.12 (ashfordcourier.example)';
const LIBRARY = '192.0.2.40 (ashford-lib-03)';

/** Canon section 7 says who really wrote each UNKNOWN USER post. Punctuation gives them away. */
export const GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'eleanor-first',
    name: 'eleanor',
    isoDate: '2012-03-10',
    displayDate: '10/03/2012',
    message: 'First!  Somebody has to be.',
    uid: 1,
    address: ELEANOR_HOME,
    browser: 'Firefox 10, Windows 7',
    editedAfter: 'emailReconstruction',
  },
  {
    id: 'daniel-pint',
    name: 'danielc',
    isoDate: '2012-03-12',
    displayDate: '12/03/2012',
    message: 'told you the server would hold, you still owe me that pint',
    uid: 2,
    address: DANIEL_HOME,
    browser: 'Chrome 17, Ubuntu',
  },
  {
    id: 'sarah-tiles',
    name: 'Sarah B',
    isoDate: '2012-03-14',
    displayDate: '14/03/2012',
    message: 'El — it’s very you. The tiled background is a crime — keep it.',
    uid: 3,
    address: COURIER,
    browser: 'IE 9, Windows 7',
  },
  {
    id: 'auntie-jan',
    name: 'Auntie Jan',
    isoDate: '2012-11-02',
    displayDate: '02/11/2012',
    message: 'Lovely pictures dear. Is that house damp? It looks damp. Your mother says hello.',
    uid: 0,
    address: '203.0.113.180',
    browser: 'IE 8, Windows XP',
  },
  {
    id: 'marcus-stockroom',
    name: 'Marcus H.',
    isoDate: '2013-04-09',
    displayDate: '09/04/2013',
    message:
      'Miss Vale, a pleasure to meet you at Local Studies. I believe I can lay my hands on the 1911 plans of Harrow Mill. I notice your visitors’ book shows the latest entries first. Last in, first out, as we used to say in the stockroom.',
    uid: 0,
    address: LIBRARY,
    browser: 'IE 8, Windows XP',
  },
  {
    id: 'cal-sick',
    name: 'cal_r',
    isoDate: '2013-06-20',
    displayDate: '20/06/2013',
    message: 'owl cam is sick. send me the first pics when you get them',
    uid: 0,
    address: '203.0.113.52',
    browser: 'Safari, iPhone',
  },
  {
    id: 'urbex-dave',
    name: 'urbexdave',
    isoDate: '2013-07-30',
    displayDate: '30/07/2013',
    message: 'Nice work on the mill shots. Been in there a couple of times myself. Watch that east gallery, its rotten.',
    uid: 0,
    address: '203.0.113.96',
    browser: 'Firefox 22, Windows 7',
  },
  {
    id: 'uu-testing',
    name: UNKNOWN,
    isoDate: '2013-09-07',
    displayDate: '07/09/2013',
    message: 'Testing.  Does anybody read these?',
    uid: 0,
    address: ELEANOR_HOME,
    browser: 'Firefox 23, Windows 7',
  },
  {
    id: 'sarah-after-fire',
    name: 'Sarah B',
    isoDate: '2013-11-26',
    displayDate: '26/11/2013',
    message: 'Saw your post — you knew him, didn’t you? Ring me — not the desk, my mobile.',
    uid: 3,
    address: COURIER,
    browser: 'IE 10, Windows 7',
  },
  {
    id: 'uu-passwords',
    name: UNKNOWN,
    isoDate: '2014-01-25',
    displayDate: '25/01/2014',
    message: 'He still knows your passwords.',
    uid: 0,
    address: COURIER,
    browser: 'IE 10, Windows 7',
  },
  {
    id: 'uu-first-things',
    name: UNKNOWN,
    isoDate: '2014-10-09',
    displayDate: '09/10/2014',
    message: 'First things first.  The word is where it has always been.',
    uid: 0,
    address: LIBRARY,
    browser: 'IE 8, Windows XP',
  },
  {
    id: 'sarah-please',
    name: 'Sarah B',
    isoDate: '2014-10-21',
    displayDate: '21/10/2014',
    message: 'El — please. If you can see this, ring me. If anyone’s seen her, the police number’s on the Courier site.',
    uid: 3,
    address: '203.0.113.33',
    browser: 'Chrome 38, Windows 7',
  },
  {
    id: 'concerned',
    name: 'concerned_in_ashford',
    isoDate: '2014-10-24',
    displayDate: '24/10/2014',
    message: 'Thinking of her family. Posters are up all along Bridge St if anyone wants to help with more.',
    uid: 0,
    address: '203.0.113.118',
    browser: 'Safari, iPad',
  },
  {
    id: 'uu-where',
    name: UNKNOWN,
    isoDate: '2014-11-16',
    displayDate: '16/11/2014',
    message: 'where are you',
    uid: 0,
    address: DANIEL_HOME,
    browser: 'Chrome 38, Ubuntu',
  },
  {
    id: 'uu-mill',
    name: UNKNOWN,
    isoDate: '2015-02-17',
    displayDate: '17/02/2015',
    message: 'i know someone was at the mill',
    uid: 0,
    address: DANIEL_HOME,
    browser: 'Chrome 40, Ubuntu',
    evidence: 'guestbook-threat',
  },
  {
    id: 'daniel-a-year',
    name: 'danielc',
    isoDate: '2015-10-17',
    displayDate: '17/10/2015',
    message: 'a year today, i still look at your owls',
    uid: 2,
    address: DANIEL_HOME,
    browser: 'Chrome 46, Ubuntu',
  },
  {
    id: 'uu-aldous',
    name: UNKNOWN,
    isoDate: '2016-11-15',
    displayDate: '15/11/2016',
    message: 'Peter Aldous had a sister. Nobody wrote to her.',
    uid: 0,
    address: LIBRARY,
    browser: 'IE 11, Windows 7',
  },
  {
    id: 'uu-every-year',
    name: UNKNOWN,
    isoDate: '2017-10-17',
    displayDate: '17/10/2017',
    message: 'I went back to look. I have gone back every year.',
    uid: 0,
    address: LIBRARY,
    browser: 'IE 11, Windows 7',
  },
  {
    id: 'forum-visitor',
    name: 'caseFilesAnon',
    isoDate: '2018-03-02',
    displayDate: '02/03/2018',
    message: 'Came here from the Ashford Lost thread. Has anyone actually got into the owl page? Someone over there says the password is on the site somewhere.',
    uid: 0,
    address: '203.0.113.201',
    browser: 'Chrome 64, Windows 10',
  },
  {
    id: 'uu-still-on',
    name: UNKNOWN,
    isoDate: '2019-07-30',
    displayDate: '30/07/2019',
    message: 'lol is this thing still on',
    uid: 0,
    address: '203.0.113.244',
    browser: 'Chrome 75, Android',
  },
  {
    id: 'uu-typed-it',
    name: UNKNOWN,
    isoDate: null,
    displayDate: '',
    message: 'You typed it. Everyone does.',
    uid: 0,
    address: '198.51.100.73',
    browser: 'Firefox 130, Windows 11',
    revealAfter: 'blogPassword',
  },
  {
    id: 'uu-read-again',
    name: UNKNOWN,
    isoDate: null,
    displayDate: '',
    message: 'So now you’ve read it. I’d ask you to read the switchboard log again — properly this time.',
    uid: 0,
    address: '198.51.100.73',
    browser: 'Firefox 130, Windows 11',
    revealAfter: 'emailReconstruction',
  },
  {
    id: 'uu-from-home',
    name: UNKNOWN,
    isoDate: null,
    displayDate: '',
    message: 'He always did say he’d attended from home.',
    uid: 0,
    address: '198.51.100.73',
    browser: 'Firefox 130, Windows 11',
    revealAfter: 'terminalCode',
  },
  {
    id: 'uu-first',
    name: UNKNOWN,
    isoDate: null,
    displayDate: '',
    message: 'Did you think you were the first?',
    uid: 0,
    address: '203.0.113.250',
    browser: 'Android 4.4.2 (el-phone)',
    revealFlag: 'read-checkin-log',
  },
];
