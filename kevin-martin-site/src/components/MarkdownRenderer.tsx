'use client';

import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown 
      components={{
        h1: ({children}) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
        h2: ({children}) => <h2 className="text-2xl font-semibold text-white mt-6 mb-3">{children}</h2>,
        h3: ({children}) => <h3 className="text-xl font-medium text-white mt-4 mb-2">{children}</h3>,
        p: ({children}) => <p className="mb-4">{children}</p>,
        ul: ({children}) => <ul className="ml-4 mb-4 space-y-1">{children}</ul>,
        ol: ({children}) => <ol className="ml-4 mb-4 space-y-1 list-decimal">{children}</ol>,
        li: ({children}) => <li className="mb-1">{children}</li>,
        strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({children}) => <em className="italic text-gray-400">{children}</em>,
        a: ({href, children}) => <a href={href} className="text-blue-400 hover:text-blue-300 underline transition-colors" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
