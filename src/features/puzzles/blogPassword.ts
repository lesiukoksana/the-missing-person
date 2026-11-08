const ANSWER = 'TYTOALBA';

export type PasswordResult = { correct: true } | { correct: false; feedback: string };

export function checkBlogPassword(input: string): PasswordResult {
  const guess = input.toUpperCase().replace(/[^A-Z]/g, '');

  if (guess === ANSWER) return { correct: true };
  if (guess === '') return { correct: false, feedback: 'You have to type something.' };
  if (guess === 'TYTO' || guess === 'ALBA') {
    return { correct: false, feedback: 'That’s half of it.' };
  }
  if (guess.includes('OWL')) {
    return { correct: false, feedback: 'Good guess.  Not what the word is, though.' };
  }
  return { correct: false, feedback: 'That’s not it.  Start at the beginning.' };
}
