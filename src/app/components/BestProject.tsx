import type { GitHubRepository } from "@/types/github";

type BestProjectProps = {
  repository: GitHubRepository | null;
  score: number;
  hasReadme: boolean;
};

export default function BestProject({
  repository,
  score,
  hasReadme,
}: BestProjectProps) {
  if (!repository) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Best Project</h2>

      <div className="rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:jusityf-between">
          <div>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noreeferrer"
              className="text-xl font-bold hover:underline"
            >
              {repository.name}
            </a>

            <p className="mt-2 text-gray-600">
              {repository.description ?? "No description"}
            </p>
          </div>

          <div className="shirnk-0">
            <span className="text-2xl font-bold">{score}</span>

            <span className="text-gray-500"> points</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
          {repository.language && <span>{repository.language}</span>}

          {hasReadme && <span>README ✓</span>}

          <span>⭐ {repository.stargazers_count}</span>

          <span>Forks: {repository.forks_count}</span>

          <span>
            Updated {new Date(repository.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </section>
  );
}
