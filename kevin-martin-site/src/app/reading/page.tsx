import ReadingPage from '@/components/ReadingPage';
import { readingData } from '@/data/reading';

export default function Reading() {
  return (
    <ReadingPage
      title="Reading/read"
      subtitle="I'd love to hear your recommendations."
      years={readingData}
    />
  );
}