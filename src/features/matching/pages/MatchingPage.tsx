import { PageHeader } from '@/shared/components/PageHeader';
import { SuggestionsList } from '../components/SuggestionsList';

export function MatchingPage() {
  return (
    <>
      <PageHeader
        title="الشركاء المقترحون"
        description="أشخاص يعلّمونك ما تريد ويتعلّمون منك ما تتقنه."
      />
      <SuggestionsList />
    </>
  );
}
