import Link from 'next/link';
import { getRecentPosts } from '@/data/blog';
import BlogPostCard from './BlogPostCard';

export default function BlogSection() {
  const recentPosts = getRecentPosts(3);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Blog</h2>
        <Link 
          href="/blog" 
          className="text-sm text-gray-400 hover:text-white"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
