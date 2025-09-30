import Link from 'next/link';
import { ReadingYear } from '@/data/reading';

interface ReadingPageProps {
  title: string;
  subtitle?: string;
  years: ReadingYear[];
}

export default function ReadingPage({ title, subtitle, years }: ReadingPageProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
          <Link href="/" className="text-gray-400 hover:text-white">
            ← home
          </Link>
        </div>

        {subtitle && (
          <p className="text-gray-300 mb-12">
            {subtitle}
          </p>
        )}

        {/* Years */}
        {years.map((yearData) => (
          <section key={yearData.year} className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">{yearData.year}</h2>
            
            <div className="space-y-1">
              {yearData.books.map((book, bookIndex) => (
                <div key={bookIndex} className="text-gray-400">
                  {book.starred && "★"}
                  {book.title}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Footer */}
        <div className="mt-12">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← home
          </Link>
        </div>
      </div>
    </div>
  );
}
