import { useGame } from '../../../store/GameContext';

export function AboutPage() {
  const { state } = useGame();
  // Egg 2. It changes after Puzzle 4, and nothing in the game ever points it out.
  const swimming = state.solvedPuzzles.includes('terminalCode')
    ? 'I couldn’t swim (long story).'
    : 'I can’t swim (long story).';

  return (
    <article>
      <h1>about me</h1>
      <div className="eleanor-text oldweb-prose">
        <p>Born April 1988.  Ashford, all my life, apart from one term at university in which I learned that I do not like university.</p>
        <p>By day I work at Copperplate Print on Bridge Street, where I set wedding invitations and put right other people’s apostrophes.  By evening I go and stand in old buildings until someone tells me to leave.</p>
        <p>I got into photography because of a box of slides I found in a skip when I was fifteen.  Somebody’s holidays, in the sixties, all of them labelled in very careful handwriting.  I still don’t know whose.  I think about those people more than I think about most people I have actually met.</p>
        <p>I built this website because I wanted somewhere to put things where they would stay put.  Things go missing around here: buildings, shops, whole streets.  Nobody writes it down, and five years later everyone remembers it differently and everyone is sure.</p>
      </div>

      <h2>things about me</h2>
      <ul className="oldweb-list oldweb-list--bullets eleanor-text">
        <li>Camera: a second-hand Halden K-40, held together with faith.</li>
        <li>Likes: mills, maps, owls, proper tea, correct dates.</li>
        <li>Dislikes: anyone who says “it’s only a website”.</li>
        <li>{swimming}</li>
        <li>I have never owned a car, and I walk everywhere.  It is how you notice things.</li>
        <li>I always know what the date is.  It is a sickness.</li>
      </ul>
    </article>
  );
}
