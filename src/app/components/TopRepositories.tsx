import type { GitHubRepository } from "@/types/github";

type TopRepository = {
  repository: GitHubRepository;
  score: number;
  hasReadme: boolean;
};

type TopRepositoriesProps = {
  repositories: TopRepository[];
};

export default function TopRepositories({
  repositories,
}: TopRepositoriesProps) {
  if (repositories.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Top Repositories</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {repositories.map(({ repository, score, hasReadme }, index) => (
          <article
            key={repository.id}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-gray-500">
                #{index + 1}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                {score} pts
              </span>
            </div>

            <a
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-lg font-semibold hover:underline"
            >
              {repository.name}
            </a>

            <p className="mt-2 min-h-10 text-sm text-gray-500">
              {repository.description ?? "No description provided."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-md bg-gray-100 px-2 py-1">
                ⭐ {repository.stargazers_count}
              </span>

              <span className="rounded-md bg-gray-100 px-2 py-1">
                🍴 {repository.forks_count}
              </span>

              <span className="rounded-md bg-gray-100 px-2 py-1">
                {repository.language ?? "Unknown"}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              README: {hasReadme ? "Yes" : "No"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
