export interface Fragment {
  id: string;
  /** Recovered byte offset with unreadable digits shown as ?. A clue to the order. */
  offset: string;
  text: string;
}

/** In the correct order. Canon section 8, Puzzle 3. Eleanor's voice: two spaces after full stops. */
export const FRAGMENTS: Fragment[] = [
  {
    id: 'a',
    offset: '0x00??',
    text: 'You should have told me before you rang them, but I should have told you why it mattered, so we’ll call that even.',
  },
  { id: 'b', offset: '0x0?71', text: 'It’s him.  The man in the frame is Reed.  I’ve checked the plate twice.' },
  { id: 'c', offset: '0x00B?', text: 'You rang the one person in Ashford you couldn’t ring.' },
  {
    id: 'd',
    offset: '0x??E4',
    text: 'Don’t put this in writing anywhere else.  Don’t come round.  D still has my passwords so I’m doing this from the library in the morning if it doesn’t send.',
  },
  {
    id: 'e',
    offset: '0x01??',
    text: 'I have told him nothing, and I’ve got something set up that doesn’t need me to be brave.  First things first, like I said.',
  },
  { id: 'f', offset: '0x01D?', text: 'Okay.  Go to bed.  It’s only an owl camera.' },
];

export const SCRAMBLED_ORDER = ['d', 'f', 'a', 'c', 'e', 'b'];

export function countInPlace(order: string[]) {
  return order.filter((id, index) => FRAGMENTS[index]?.id === id).length;
}

export function isReconstructed(order: string[]) {
  return countInPlace(order) === FRAGMENTS.length && order.length === FRAGMENTS.length;
}
