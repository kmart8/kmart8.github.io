import BlogSection from '@/components/BlogSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-2xl font-semibold text-white mb-2">Kevin Martin</h1>
          <p className="text-gray-300">
            building platforms for secure data sharing{' '}
            <a 
              href="https://www.capitalone.com/tech/blog/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              @capital one
            </a> | fitness enthusiast | skier | builder
          </p>
        </div>

        {/* Blog */}
        <BlogSection />

        {/* Notes */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
          <div className="space-y-3">
            <div>
              <a href="/reading" className="text-gray-300 hover:text-white hover:underline">
                reading
              </a>
            </div>
            <div>
              <a href="#" className="text-gray-300 hover:text-white hover:underline">
                boston [soon]
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Contact</h2>
          <div className="flex space-x-6">
            <a 
              href="https://github.com/kmart8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              github
            </a>
            <a 
              href="https://www.linkedin.com/in/kevin-martin-ms-14a602116/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              linkedin
            </a>
            <a 
              href="mailto:kevinjskk19@gmail.com"
              className="text-gray-400 hover:text-white"
            >
              email
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
