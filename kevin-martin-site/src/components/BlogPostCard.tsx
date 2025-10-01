import Link from 'next/link';
import { BlogPost } from '@/data/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}.${day}.${year}`;
  };

  return (
    <article className="flex items-start justify-between">
      <div className="flex-1">
        <Link href={`/blog/${post.slug}`} className="text-lg font-medium">
          {post.title}
        </Link>
        <span className="text-gray-300"> - {post.excerpt}</span>
      </div>
      <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
        {formatDate(post.date)}
      </span>
    </article>
  );
}
