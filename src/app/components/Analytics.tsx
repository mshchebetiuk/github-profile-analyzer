type AnalyticsProps = {
  totalStars: number;
  totalForks: number;
  topLanguage: string;
  languagesCount: number;
};

export default function Analytics({
  totalStars,
  totalForks,
  topLanguage,
  languagesCount,
}: AnalyticsProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Stars</p>
          <p className="mt-2 text-2xl font-bold">{totalStars}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Forks</p>
          <p className="mt-2 text-2xl font-bold">{totalForks}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Top Language</p>
          <p className="mt-2 text-2xl font-bold">{topLanguage}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Languages</p>
          <p className="mt-2 text-2xl font-bold">{languagesCount}</p>
        </div>
      </div>
    </section>
  );
}
