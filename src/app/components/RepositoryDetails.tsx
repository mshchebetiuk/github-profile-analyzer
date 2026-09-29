import type { GitHubRepository } from "@/types/github";

type RepositoryDetailsProps = {
  repository: GitHubRepository;
  score: number;
  hasReadme: boolean;
  onClose: () => void;
};

export default function RepositoryDetails({
  repository,
  score,
  hasReadme,
  onClose,
}: RepositoryDetailsProps) {
  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Repository Analytics</p>
          <h2 className="mt-1 text-2xl font-bold">{repository.name}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      <p className="mt-4 text-gray-600">
        {repository.description ?? "No description provided."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Project score</p>
          <p className="mt-1 text-xl font-bold">{score} pts</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Language</p>
          <p className="mt-1 font-semibold">
            {repository.language ?? "Unknown"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Stars</p>
          <p className="mt-1 text-xl font-bold">
            {repository.stargazers_count}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Forks</p>
          <p className="mt-1 text-xl font-bold">{repository.forks_count}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          README: {hasReadme ? "Yes" : "No"}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          Updated {new Date(repository.updated_at).toLocaleDateString()}
        </span>
      </div>

      <a
        href={repository.html_url}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block font-medium underline"
      >
        View repository on GitHub
      </a>
    </section>
  );
}
