import ReadingPage from '@/components/ReadingPage';
import { readingData } from '@/data/books';

export default function Books() {
  return (
    <ReadingPage
      title="books i've read"
      subtitle="feel free to recommend some"
      years={readingData}
    />
  );
}

