import Link from 'next/link';
import { getAllPosts } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import SubscriptionForm from '@/components/SubscriptionForm';

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white text-sm mb-4 inline-block px-3 py-1"
          >
            ← home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-4">Blog</h1>
          <p className="text-gray-300">
            a place for my thoughts
          </p>
        </div>

        {/* Subscription Form */}
        <div className="mb-12">
          <SubscriptionForm />
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {allPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
