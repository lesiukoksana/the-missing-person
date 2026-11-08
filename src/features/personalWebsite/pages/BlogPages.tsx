import { useEffect } from 'react';
import { href } from '../../../app/router';
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from '../../../data/website/blog';
import { useDiscoverOnView, useDiscovery } from '../../../hooks/useDiscovery';
import { ServerNotFoundPage } from './ErrorPages';

export function BlogIndexPage() {
  return (
    <section>
      <h1>the blog</h1>
      <p className="eleanor-text">Newest first.  If you want it to make sense, start at the bottom.</p>
      <ul className="oldweb-blogroll">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <span className="oldweb-date">{post.date}</span>
            <a href={href(`/website/blog/${post.slug}`)}>{post.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BlogPostPage({ slug }: { slug: string }) {
  const post = BLOG_POSTS_BY_SLUG[slug];
  const { record } = useDiscovery();
  useDiscoverOnView(post?.evidence);

  useEffect(() => {
    if (post) record('flags', `read-post:${post.slug}`);
  }, [post, record]);

  if (!post) return <ServerNotFoundPage />;

  const index = BLOG_POSTS.indexOf(post);
  const newer = BLOG_POSTS[index - 1];
  const older = BLOG_POSTS[index + 1];

  return (
    <article className="oldweb-post">
      <h1>{post.title}</h1>
      <p className="oldweb-date">
        posted {post.date}
        {post.time && ` at ${post.time}`} by eleanor
      </p>
      <div className="eleanor-text oldweb-prose">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {post.links && (
        <ul className="oldweb-list oldweb-post__links">
          {post.links.map((link) => (
            <li key={link.to}>
              &raquo; <a href={href(link.to)}>{link.text}</a>
            </li>
          ))}
        </ul>
      )}

      <nav className="oldweb-pager" aria-label="More posts">
        {older ? <a href={href(`/website/blog/${older.slug}`)}>&laquo; older</a> : <span />}
        <a href={href('/website/blog')}>all posts</a>
        {newer ? <a href={href(`/website/blog/${newer.slug}`)}>newer &raquo;</a> : <span />}
      </nav>
    </article>
  );
}
