type RepositoryQualityProps = {
  repositoriesWithReadme: number;
  totalRepositories: number;
  readmePercentage: number;
};

export default function RepositoryQuality({
  repositoriesWithReadme,
  totalRepositories,
  readmePercentage,
}: RepositoryQualityProps) {
  if (totalRepositories === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Repository Quality</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Repositories with README</p>

          <p className="mt-2 text-2xl font-bold">
            {repositoriesWithReadme} / {totalRepositories}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">README Coverage</p>
          <p className="mt-2 text-2xl font-bold">{readmePercentage}%</p>
        </div>
      </div>
    </section>
  );
}
