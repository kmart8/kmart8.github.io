import Link from 'next/link';
import { ReadingYear } from '@/data/books';

interface ReadingPageProps {
  title: string;
  subtitle?: string;
  years: ReadingYear[];
}

export default function ReadingPage({ title, subtitle, years }: ReadingPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block px-3 py-1">
            ← home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
          {subtitle && (
            <p className="text-slate-300 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Years */}
        <div className="space-y-16">
          {years.map((yearData) => (
            <section key={yearData.year}>
              <h2 className="text-2xl font-bold text-white mb-6">{yearData.year}</h2>
              
              <div className="space-y-3">
                {yearData.books.map((book, bookIndex) => (
                  <div key={bookIndex} className="flex items-center text-slate-300">
                    {book.starred && (
                      <span className="text-amber-400 mr-2">★</span>
                    )}
                    <span className="flex-1">{book.title}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
