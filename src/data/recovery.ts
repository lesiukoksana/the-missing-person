import type { Requirement } from '../types/game';
import type { EvidenceId } from './evidence';

/**
 * Files shared by File Recovery and the Terminal.
 * Status flow: deleted and corrupted files can be restored once their requirement is met.
 * Files inside reed_box stay encrypted until `unlock 0245` (Puzzle 4).
 */

export type FileStatus = 'recovered' | 'deleted' | 'corrupted' | 'encrypted';
export type FileFormat = 'text' | 'eleanor' | 'letter' | 'handwritten' | 'code' | 'log' | 'image';

export interface RecoveredFile {
  id: string;
  /** Path as the Terminal shows it, relative to the case folder. */
  path: string;
  type: string;
  size: string;
  modified: string;
  source: string;
  status: FileStatus;
  /** What the status line says about the file before it's restored. */
  statusNote: string;
  /** Needed before the file can be restored or read. Null means it can be restored now. */
  requirement: Requirement | null;
  /** Encrypted box files open automatically with the box. Others need the Restore action. */
  restoresWithBox?: boolean;
  /** Corrupted files that are rebuilt somewhere else in the game. */
  rebuiltElsewhere?: { label: string; to: string };
  /** Never opens. */
  sealed?: boolean;
  format: FileFormat;
  content: string;
  /** Extra description for images, and the art to show. */
  image?: 'blue-hour';
  evidence?: EvidenceId;
  /** A flag set the first time the file is read. */
  readFlag?: string;
}

const BOX: Requirement = { kind: 'puzzle', puzzle: 'terminalCode' };

export const RECOVERY_FILES: RecoveredFile[] = [
  {
    id: 'shopping',
    path: 'recovery/shopping.txt',
    type: 'Text',
    size: '64 B',
    modified: '2014-10-16 08:12',
    source: 'Eleanor’s laptop (EX-0917-14/03)',
    status: 'recovered',
    statusNote: 'Intact',
    requirement: null,
    format: 'eleanor',
    content: 'milk\nbatteries (AA x8, camera)\nstamps\nring Mum back\nbin day is THURSDAY',
  },
  {
    id: 'mill-plans',
    path: 'recovery/harrow_1911_plans.tif',
    type: 'Image (scan)',
    size: '48.2 MB',
    modified: '2014-09-02 19:40',
    source: 'Eleanor’s laptop (EX-0917-14/03)',
    status: 'recovered',
    statusNote: 'Intact',
    requirement: null,
    format: 'image',
    content:
      'A scan of a 1911 architectural drawing of Harrow Mill, stamped “Ashford Local Studies, on loan”. The wheel house is marked at the north-east corner, with the gallery drawn at 21 ft. A pencil note in the margin, in Eleanor’s handwriting: “culvert → river, 40 yds”.',
  },
  {
    id: 'stage1',
    path: 'recovery/queue/stage1.txt',
    type: 'Text',
    size: '52 B',
    modified: '2014-10-12 21:40',
    source: 'Eleanor’s laptop (EX-0917-14/03), deleted folder',
    status: 'deleted',
    statusNote: 'Deleted 2014-10-23 09:44. Fully recoverable',
    requirement: null,
    format: 'eleanor',
    content: 'I know you’re looking for me.  You shouldn’t be.',
    evidence: 'rec-draft-post',
  },
  {
    id: 'keylog',
    path: 'recovery/fmba2_cache.dat',
    type: 'Data',
    size: '3.1 KB',
    modified: '2014-10-11 15:58',
    source: 'Eleanor’s laptop (EX-0917-14/03), unallocated space',
    status: 'deleted',
    statusNote: 'Deleted 2014-10-11 15:58 by the laptop’s owner. Partially recoverable',
    requirement: null,
    format: 'log',
    content: `FindMate Backup Agent 2 · keystroke cache · entries base64-encoded
-------------------------------------------------------------------
2014-09-14 21:03  url  ZWxlYW5vcnZhbGUuZXhhbXBsZS9vd2xz
2014-09-14 21:03  key  VFlUT0FMQkE=
2014-10-02 18:40  url  bWFpbC5wb3N0Ym94LmV4YW1wbGU=
2014-10-02 18:41  key  T2theS4gIEkgbG9vayBmb3J3YXJkIHRvIGl0Lg==
2014-10-11 15:58  ---  agent removed by user
-------------------------------------------------------------------
sync target: 203.0.113.77 (last sync 2014-09-21)`,
    evidence: 'rec-keylog',
  },
  {
    id: 'frames',
    path: 'recovery/owlcam/TE_0228-TE_0240.JPG',
    type: '13 images',
    size: '11.8 MB',
    modified: '2013-11-15 03:03',
    source: 'Eleanor’s laptop (EX-0917-14/03), deleted folder',
    status: 'deleted',
    statusNote:
      'Deleted 2014-10-23 09:41, by a local session on the seized laptop. The clusters were overwritten. The original card is in reed_box',
    requirement: BOX,
    format: 'image',
    image: 'blue-hour',
    content: `Recovered from the original TrailEye card, found in reed_box. Times are as the camera stamped them.

TE_0228.JPG  2013-11-15 02:19  three figures at the loft door, one carrying a light
TE_0233.JPG  2013-11-15 02:31  a glow inside the loft; the figures are running
TE_0239.JPG  2013-11-15 02:52  an adult in a long coat with a torch; a car at the gate, plate FX09 R…
TE_0240.JPG  2013-11-15 03:03  the adult leading a smaller figure away
(9 more frames: wind, smoke, nothing)

The 999 call was logged at 03:14.`,
    evidence: 'rec-frames',
  },
  {
    id: 'fragments',
    path: 'recovery/courier/16-10-14_2302.eml',
    type: 'Email',
    size: '1.2 KB',
    modified: '2014-10-21 22:15',
    source: 'Ashford Courier mail archive, deleted items',
    status: 'corrupted',
    statusNote: 'Deleted by recipient 2014-10-21. Body survives as 6 out-of-order fragments',
    requirement: null,
    rebuiltElsewhere: { label: 'Rebuild it in Messages & Emails', to: '/messages/deleted-email' },
    format: 'text',
    content: '',
  },
  {
    id: 'owls-zip',
    path: 'site_restore/owls.zip',
    type: 'Archive (encrypted)',
    size: '212 MB',
    modified: '2014-10-12 22:05',
    source: 'eleanorvale.example, server backup 2019-08-17',
    status: 'encrypted',
    statusNote: 'Encrypted. Queued for sending by checkin.php. The key is not in this file',
    requirement: BOX,
    sealed: true,
    format: 'text',
    content: '',
  },
  {
    id: 'checkin-php',
    path: 'site_restore/checkin.php',
    type: 'PHP script',
    size: '1.9 KB',
    modified: '2014-10-12 21:58',
    source: 'eleanorvale.example, server backup 2019-08-17',
    status: 'encrypted',
    statusNote: 'Stored beside reed_box by the sender, in the same locked folder',
    requirement: BOX,
    restoresWithBox: true,
    format: 'code',
    content: `<?php
// checkin.php  eleanor, 12/10/14
// If nobody types the word for 30 days: post the warning, wait 7, send everything.
// D has my passwords and sooner or later he'll go looking for me.
// So will anyone else who cares.
// If you're looking for me you'll find the word.  If you type the word it thinks I'm fine.
// So don't look.  Let it run.

$grace_days   = 30;
$warning_days = 7;
$payload      = 'owls.zip';
$recipients   = [
    's.bennett@ashfordcourier.example',
    'newsdesk@ashfordcourier.example',
    'complaints@westmarch-standards.example',
];

// runs every 15 minutes
$last = last_checkin();

if (days_since($last) > $grace_days && !posted('stage1')) {
    post_from_queue('queue/stage1.txt');
}

if (posted('stage1') && days_since(posted_at('stage1')) > $warning_days) {
    send_all($recipients, $payload);
}

// /owls/ calls this when the word is right
function checkin() {
    log_line(date('Y-m-d H:i'), $_SERVER['REMOTE_ADDR'], 'ok');
    clear('stage1');
}`,
    evidence: 'site-checkin-script',
    readFlag: 'read-checkin-php',
  },
  {
    id: 'checkin-log',
    path: 'site_restore/checkin.log',
    type: 'Log',
    size: '4.4 KB',
    modified: 'today',
    source: 'eleanorvale.example, live server',
    status: 'encrypted',
    statusNote: 'Stored beside reed_box by the sender, in the same locked folder',
    requirement: BOX,
    restoresWithBox: true,
    format: 'log',
    // Built at read time from canon data plus the player's own check-ins. See checkinLog.ts.
    content: '',
    evidence: 'site-checkin-log',
    readFlag: 'read-checkin-log',
  },
  {
    id: 'reed-letter',
    path: 'reed_box/letter.pdf',
    type: 'Letter (scan)',
    size: '210 KB',
    modified: '2026-02-11',
    source: 'reed_box, scanned by the sender',
    status: 'encrypted',
    statusNote: 'Inside reed_box.enc',
    requirement: BOX,
    restoresWithBox: true,
    format: 'letter',
    content: `Sarah. I have left this to you because you will know what it costs, and because I took your statement knowing what you knew, and we both let that stand.

I reached the mill at 02.45. I did not know Peter Aldous was inside. I knew my son was outside. That is the whole of it and I have had twelve years to find a better version.

On 17.10.14 I went to speak to Miss Vale. I had the card in my coat. I intend you to believe I would have given it to her. I have never been able to establish that for myself. The gallery gave way at about 20.40. I searched until 21.30. I did not find her. I have told myself that means what it must mean.

The last frame on the second card I cannot account for. I was at home by then. I have shown it to nobody.

Do what you think right. I never managed it.

T. Reed`,
    evidence: 'box-reed-letter',
  },
  {
    id: 'marsh-tally',
    path: 'reed_box/marsh_tally.jpg',
    type: 'Image (handwritten note)',
    size: '1.4 MB',
    modified: '2014-10-20',
    source: 'reed_box, scanned by the sender',
    status: 'encrypted',
    statusNote: 'Inside reed_box.enc',
    requirement: BOX,
    restoresWithBox: true,
    format: 'handwritten',
    content: `Weir Lane 20/10 — L.M.

Desk drawer (top): passport ✓ (exp. 2019) · bank cards ×2 ✓ · purse ✓
Bathroom: toothbrush ✓
Bedroom: phone charger — not found
Camera bag — not found
Hall: walking boots — not found
Coat hooks: grey wool coat ✓

Handed to DI Reed 11:35.`,
    evidence: 'box-marsh-tally',
  },
  {
    id: 'annex-original',
    path: 'reed_box/annex_b_original.tif',
    type: 'Image (scan)',
    size: '880 KB',
    modified: '2014-10-30',
    source: 'reed_box, scanned by the sender',
    status: 'encrypted',
    statusNote: 'Inside reed_box.enc',
    requirement: BOX,
    restoresWithBox: true,
    format: 'log',
    content: `ANNEX B: calls to Ashford Division from numbers on the subject's record
(original print, no redaction)

16.10.14  16:20  07700 900412 (S. BENNETT)  Direct line, DI 4471 T. REED  9m 03s

One match.`,
    evidence: 'box-annex-original',
    readFlag: 'read-annex-original',
  },
  {
    id: 'detached-photo',
    path: 'reed_box/photo_sb_supplied.jpg',
    type: 'Image (print, 6×4)',
    size: '2.2 MB',
    modified: '2014-08-23',
    source: 'reed_box, scanned by the sender',
    status: 'encrypted',
    statusNote: 'Inside reed_box.enc',
    requirement: BOX,
    restoresWithBox: true,
    format: 'image',
    content:
      'A colour print of Eleanor on the timber gallery in the Harrow Mill wheel house, north side, laughing, with one hand on the rail. On the back, in Sarah’s handwriting: “El, Harrow, Aug 14.” A police registry label: “Supplied by S. Bennett 19.10.14 — AD-14-0917-01.” This is the photograph missing from the case file.',
    evidence: 'box-photo',
  },
];

export const RECOVERY_BY_ID = Object.fromEntries(RECOVERY_FILES.map((file) => [file.id, file]));
