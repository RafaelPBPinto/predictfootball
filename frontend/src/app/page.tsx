import { fixturesApi } from '@/src/api/fixtures';
import FixtureList from '@/src/components/fixtures/FixtureList';
import { Fixture } from '@/src/types/fixture';

export default async function Home() {
  let fixtures: Fixture[] = [];
  let error = null;

  try {
    fixtures = await fixturesApi.getAll();
  } catch (err) {
    error = 'Failed to load fixtures';
    console.error(err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main>
      <FixtureList initialFixtures={fixtures} />
    </main>
  );
}
