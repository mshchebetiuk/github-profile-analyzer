type RepositoryHealthProps = {
  healthScore: number;
  activeRepositories: number;
  staleRepositories: number;
  repositoriesWithoutReadme: number;
  repositoriesWithoutDescription: number;
};

export default function RepositoryHealth({
  healthScore,
  activeRepositories,
  staleRepositories,
  repositoriesWithoutReadme,
  repositoriesWithoutDescription,
}: RepositoryHealthProps) {
  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Repository Health</h2>

          <p className="mt-1 text-sm text-gray-500">
            Custom score based on activity, README coverage and repository
            descriptions.
          </p>
        </div>

        <span className="text-2xl font-bold">{healthScore}/100</span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{
            width: `${healthScore}%`,
          }}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Active repositories</p>

          <p className="mt-1 text-2xl font-bold">{activeRepositories}</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Stale repositories</p>

          <p className="mt-1 text-2xl font-bold">{staleRepositories}</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Missing README</p>

          <p className="mt-1 text-2xl font-bold">{repositoriesWithoutReadme}</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Missing description</p>

          <p className="mt-1 text-2xl font-bold">
            {repositoriesWithoutDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
