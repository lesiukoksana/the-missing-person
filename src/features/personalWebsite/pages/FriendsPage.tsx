import { href } from '../../../app/router';
import { FRIENDS } from '../../../data/website/friends';
import { useDiscoverOnView } from '../../../hooks/useDiscovery';

export function FriendsPage() {
  useDiscoverOnView('friends-list');

  return (
    <section>
      <h1>friends</h1>
      <p className="eleanor-text">People and owls I have not yet managed to put off.</p>
      <ul className="oldweb-friends">
        {FRIENDS.map((friend) => (
          <li key={friend.id}>
            <h2>{friend.name}</h2>
            <p className="oldweb-date">{friend.tag}</p>
            <p className="eleanor-text">{friend.text}</p>
            {friend.profile && (
              <a className="oldweb-case-link" href={href('/suspects')}>
                Case file: open this person’s profile
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
