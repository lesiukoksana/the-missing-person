import type { EvidenceId } from '../evidence';

export interface BlogLink {
  text: string;
  to: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  time?: string;
  paragraphs: string[];
  links?: BlogLink[];
  evidence?: EvidenceId;
}

/**
 * Eleanor's voice: two spaces after every full stop, "okay" and never "ok", no kisses.
 * The spacing is a clue, so it's preserved on screen with white-space: pre-wrap.
 * The first letters of the eight dated titles are Puzzle 1. Don't rename them.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'untitled',
    title: '(no title)',
    date: '17 October 2026',
    time: '20:45',
    paragraphs: ['I know you’re looking for me.  You shouldn’t be.'],
    evidence: 'post-2026',
  },
  {
    slug: 'almost-done',
    title: 'Almost done',
    date: '15 October 2014',
    paragraphs: [
      'It has been raining since lunch and the forecast says it means to carry on until Friday.  The Ashe is already the colour of tea.  I went down to the weir on my way home and took one photograph, and my shoes will be wet until approximately Christmas.',
      'I am nearly finished with the mill.  I know I have said that before.  M. has one last set of drawings for me, which is the reason I keep vanishing on Thursday evenings, and no, Sarah, it is not what you think.  He is seventy-one and he brings a flask.',
      'Mr Pryce has finally looked at the damp.  He looked at it for a long time.  He said, “That’s damp, that is,” and left.',
      'Work is busy with election leaflets for an election nobody seems to know about.  I have read the phrase “a fresh approach” so many times it has stopped being words.',
      'More soon.  I mean that.  There is one thing to tidy up and then I can go back to photographing things that are only sad because they are old.',
    ],
    links: [{ text: 'the weir, this afternoon', to: '/website/photos/weir-in-spate' }],
  },
  {
    slug: 'backups',
    title: 'Backups (a boring post)',
    date: '12 October 2014',
    paragraphs: [
      'This is a boring post and you may leave now.  Still here?  Fine.',
      'I have spent the weekend sorting out my computer, which I recommend to nobody.  New passwords on everything.  New email for anything that matters.  I found something on the laptop that should not have been there, and I have dealt with it, and that is all I am going to say about it on the internet.',
      'I have also finally done what everyone tells you to do and set up proper backups.  The site now looks after itself, more or less.  It runs a little job every fifteen minutes and as long as I keep turning up, it stays quiet.  This is the most responsible thing I have ever done.  I would like a certificate.',
      'A few people have asked how I remember my passwords, given I once lost a bicycle inside my own flat.  The answer is I don’t.  I keep the one that matters out where I can always find it, in a place I walk past every day, because nobody reads the top of anything.  First things first.',
      'The owl pictures are too big for the main gallery now so they have moved to their own page.  It is locked, sorry.  If you are supposed to get in, you will know how.',
    ],
    links: [{ text: 'the owl page', to: '/website/owls' }],
    evidence: 'blog-backups',
  },
  {
    slug: 'lost-afternoon',
    title: 'Lost afternoon at the station',
    date: '11 February 2014',
    paragraphs: [
      'I took the afternoon off to go and be a good citizen.  I want this on the record, as nobody else will ever put it there.',
      'You may recall the odd frames from the owl camera.  The inquest was last week and it came out as misadventure, and I sat with that for a few days and decided somebody official ought at least to look at them.  It took me a long time to be seen, and I got through most of a very old copy of a magazine about caravans.',
      'The officer in charge of the fire was a DI Reed, and he could not have been nicer about it.  He made the tea himself.  He went through every frame with me and pointed out how little you can really see.  Shapes, mostly.  Foxes do odd things to infrared.  He asked if I had kept copies, the way you would ask whether someone had remembered their umbrella, and he said he would need to hold on to the original card for the file.  I got a receipt, which I have already lost.',
      'He also asked how the owls were doing, which I thought was kind.',
      'So that is that.  It has been a month of people being reasonable at me.  D. and I are finished, as most of you know, and he has been very reasonable about it too.  He would still like me to know that he worries.  I know he does.',
      'I am going to go and look at something with no people in it.',
    ],
    evidence: 'blog-station',
  },
  {
    slug: 'after-the-fire',
    title: 'After the fire',
    date: '24 November 2013',
    paragraphs: [
      'You will have seen the Courier.  Harrow Mill went up in the small hours of Friday the fifteenth.  The drying loft is gone and most of the roof with it.  They had the road shut for a week.',
      'A man died in the boiler house.  For days the paper called him an “unidentified male”.  I think I know who it was.  I think it was the old boy who told me about the owls and warned me off the east end of the gallery.  I talked to him perhaps five times.  He never told me his name and I never asked, and I will be thinking about that for a while.',
      'They lifted the cordon yesterday.  I went back for the camera, assuming it would be a lump of plastic, but the wheel house is solid stone and it was all still there.  Camera fine.  Owls gone, and who would blame them.  I swapped the card and put it back anyway, in case they change their minds.',
      'I have been through the card now.  Five months of owls, and then, on the night itself, some odd frames.  Probably nothing.  Probably foxes.  Foxes that walk on two legs and carry torches, but there we are, I am not a naturalist.',
      'I did not take any pictures inside.  It did not seem right.  I took one from the yard, of the sky where the loft used to be.',
    ],
    links: [{ text: 'the loft, afterwards', to: '/website/photos/loft-afterwards' }],
    evidence: 'blog-after-fire',
  },
  {
    slug: 'owl-camera',
    title: 'Owl camera!',
    date: '17 June 2013',
    paragraphs: [
      'We have owls.  Actual owls.  Barn owls, Tyto alba if you want to be insufferable about it, which I do.  There is a pair in the wheel house at Harrow Mill, and that explains the pellets.',
      'So I have spent actual money on a TrailEye TC-12, which is a motion-triggered camera that hunters strap to trees.  Mine is strapped to a beam on the wheel house wall, looking out through the old doorway across the yard and with one eye on the owls’ ledge.  It takes a picture when anything warm moves and it writes the time on each one.',
      'Cal from camera club came along to hold the ladder.  He is seventeen and thinks everything is either sick or dead, and I can report the owl camera is sick.  He held the ladder for an hour and only looked at his phone twice, which I understand is a record for his age group.',
      'Small problem.  The camera’s clock is seven minutes fast and I cannot work out how to change it.  The manual is a single sheet, translated from Korean by someone who was angry.  I have decided I can live with it.  I will just have to remember that the owls are seven minutes earlier than they think they are.',
      'First pictures in a week or two, if nothing eats the camera.',
    ],
    evidence: 'blog-owl-camera',
  },
  {
    slug: 'things-people-leave',
    title: 'Things people leave behind',
    date: '16 March 2013',
    paragraphs: [
      'I finally got into Harrow Mill.  “Got into” sounds very daring.  There is a gap in the fence on Mill Road that a child made in about 1990 and everyone has been politely using ever since.',
      'It is enormous.  It shut in 2003 and it is as if somebody simply went home for the evening.  There is a calendar in the overlookers’ office.  There are mugs.  The roof is mostly a suggestion now.  I stayed for two hours and got one good photograph and a lot of pigeon on my coat.',
      'The best bit is the wheel house, right at the far end.  The wheel itself is long gone but there is a timber gallery running around the wall about twenty feet up, and underneath it is the pit, full of black water that goes off through a culvert to the river.  I dropped a stone in and did not hear it for longer than I liked.',
      'I also met the resident.  There is an old boy who sleeps somewhere around the boiler house.  He frightened the life out of me and then apologised for about ten minutes.  He worked there for nineteen years.  He told me the north side of the gallery is sound but not to go near the east end, and that the white pellets on the wheel house floor mean owls, and that the owls were there before he was.',
      'I have started asking at Local Studies about the old plans, and a very courteous man called M. has taken me on as a project.',
    ],
    links: [
      { text: 'the wheel house', to: '/website/photos/wheel-house' },
      { text: 'the pellets', to: '/website/photos/pellets' },
    ],
  },
  {
    slug: 'yellow-house',
    title: 'Yellow house on Weir Lane',
    date: '23 September 2012',
    paragraphs: [
      'I have moved!  All of four streets, but I have moved.  I now live at the top of the yellow house on Weir Lane, in what the advert described as a “characterful” flat, by which it meant the floor is not level.  If you put a marble down by the door it will meet you in the kitchen.',
      'The landlord is a Mr Pryce, who owns a great many keys and very few opinions.  There is a slight smell of damp, and when I mentioned it he said, “Old house,” as though that closed the matter.',
      'Daniel carried nearly everything up the stairs and only mentioned it eleven times.  He has taken a spare key, on the grounds that I have already locked myself out twice and I have lived here for two days.  He is not wrong, which is the most annoying thing about him.',
      'I can see the weir from the bathroom if I stand on the edge of the bath.  I will not be doing that often, as I have a healthy respect for water and no ability whatsoever to float.',
      'Monday it is back to Copperplate to print somebody’s wedding on the wrong shade of cream.  Life is very full.',
    ],
    links: [{ text: 'the house itself', to: '/website/photos/yellow-house' }],
  },
  {
    slug: 'testing',
    title: 'Testing, testing',
    date: '10 March 2012',
    paragraphs: [
      'First things first: hello.',
      'If you can read this then Daniel was right about the server and I owe him a pint.  If you cannot read this then none of this matters and I have been talking to myself, which, to be fair, is the plan either way.',
      'I am Eleanor.  I print things for a living and photograph things for no living at all.  This is where I am going to put the photographs, along with anything else I want to remember properly.  I have a terrible memory and I do not trust it.  I once told a whole dinner party a story about something that turned out to have happened to my sister, and I do not have a sister.  It was from a film.',
      'So I write things down.  Dates especially.  If it is on here with a date on it, you can believe it happened.',
      'I built the site myself, apart from the difficult parts, and you can tell.  Please sign the guestbook so I know somebody has seen it.  I wrote the guestbook myself as well, so please be gentle with it.',
    ],
    links: [{ text: 'sign the guestbook', to: '/website/guestbook' }],
  },
];

export const BLOG_POSTS_BY_SLUG = Object.fromEntries(
  BLOG_POSTS.map((post) => [post.slug, post]),
);
