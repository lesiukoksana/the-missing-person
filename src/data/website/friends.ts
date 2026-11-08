export interface Friend {
  id: string;
  name: string;
  tag: string;
  text: string;
  /** Links to the case's Suspects section. */
  profile: boolean;
}

export const FRIENDS: Friend[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    tag: 'since we were eleven',
    text: 'Reporter at the Courier.  Knows everything about everybody in Ashford and will tell you most of it.  The only person who has ever made me laugh during a funeral.  Knows where the bodies are buried, and has offered to write a very fair piece about them.',
    profile: true,
  },
  {
    id: 'daniel',
    name: 'Daniel',
    tag: 'built the hard parts of this site',
    text: 'Programmer.  Fixes things before you know they are broken, including some things that were not broken.  He is the reason any of this works, and he will tell you so.',
    profile: true,
  },
  {
    id: 'marcus',
    name: 'Marcus',
    tag: 'Local Studies, Thursdays',
    text: 'Volunteer at Ashford Local Studies.  Remembers everything that has ever happened on Mill Road, and owns a flask older than I am.  If you want a set of plans for anything in this town, bring biscuits.',
    profile: false,
  },
  {
    id: 'cal',
    name: 'Cal R.',
    tag: 'camera club',
    text: 'The only person under forty at Ashford Camera Club.  Holds ladders.  Has a good eye when he remembers he has one.  His dad drops him off and collects him and waits outside in the car, the whole two hours, reading the paper.',
    profile: false,
  },
  {
    id: 'owls',
    name: 'Margaret and Keith',
    tag: 'wheel house, Harrow Mill',
    text: 'Barn owls.  They do not know about this page.',
    profile: false,
  },
];
