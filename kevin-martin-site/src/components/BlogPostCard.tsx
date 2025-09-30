import Link from 'next/link';
import { BlogPost } from '@/data/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors mb-2">
          {post.title}
        </h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime}</span>
        </div>
      </Link>
    </article>
  );
}
