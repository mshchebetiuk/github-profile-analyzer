type RepositoryInsightsProps = {
  averageStars: number;
  averageForks: number;
  repositoriesWithoutDescription: number;
  inactiveRepositories: number;
};

export default function RepositoryInsights({
  averageStars,
  averageForks,
  repositoriesWithoutDescription,
  inactiveRepositories,
}: RepositoryInsightsProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Repository Insights</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Average Stars</p>

          <p className="mt-2 text-2xl font-bold">{averageStars}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Average Forks</p>

          <p className="mt-2 text-2xl font-bold">{averageForks}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Missing Descriptions</p>

          <p className="mt-2 text-2xl font-bold">
            {repositoriesWithoutDescription}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Inactive Repositories</p>
          <p className="mt-2 text-2xl font-bold">{inactiveRepositories}</p>
        </div>
      </div>
    </section>
  );
}
