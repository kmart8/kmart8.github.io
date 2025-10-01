import Link from 'next/link';
import { BlogPost } from '@/data/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="text-lg font-medium">
        {post.title}
      </Link>
      <span className="text-gray-300"> - {post.excerpt}</span>
    </article>
  );
}
