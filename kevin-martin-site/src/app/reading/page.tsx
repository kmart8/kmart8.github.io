import ReadingPage from '@/components/ReadingPage';
import { readingData } from '@/data/reading';

export default function Reading() {
  return (
    <ReadingPage
      title="books i've read"
      subtitle="let me hear recommendations"
      years={readingData}
    />
  );
}