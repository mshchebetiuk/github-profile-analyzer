type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

type SortBy = "updated" | "stars" | "forks" | "name";

type RepositoriesProps = {
  repositories: GitHubRepository[];
  filteredRepositories: GitHubRepository[];
  displayedRepositories: GitHubRepository[];
  availableLanguages: string[];

  repositorySearch: string;
  languageFilter: string;
  sortBy: SortBy;

  hasMoreRepositories: boolean;
  visibleRepositories: number;

  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSortChange: (value: SortBy) => void;
  onReset: () => void;
  onShowMore: () => void;
  onShowLess: () => void;
};

export default function Repositories({
  repositories,
  filteredRepositories,
  displayedRepositories,
  availableLanguages,
  repositorySearch,
  languageFilter,
  sortBy,
  hasMoreRepositories,
  visibleRepositories,
  onSearchChange,
  onLanguageChange,
  onSortChange,
  onReset,
  onShowMore,
  onShowLess,
}: RepositoriesProps) {
  return (
    <>
      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={repositorySearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
          />

          <select
            value={languageFilter}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3"
          >
            <option value="All">All languages</option>

            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="rounded-xl border border-gray-200 px-4 py-3"
          >
            <option value="updated">Recently updated</option>
            <option value="stars">Most stars</option>
            <option value="forks">Most forks</option>
            <option value="name">Name</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </section>

      {repositories.length === 0 && (
        <div className="mt-10 rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No public repositories found.</p>
        </div>
      )}

      {repositories.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Repositories</h2>

            <span className="text-sm text-gray-500">
              {filteredRepositories.length} of {repositories.length}{" "}
              repositories
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayedRepositories.map((repository) => (
              <article
                key={repository.id}
                className="flex min-h-44 flex-col rounded-xl border border-gray-200 p-5"
              >
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold hover:underline"
                >
                  {repository.name}
                </a>

                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {repository.description ?? "No description"}
                </p>

                <div className="mt-auto flex flex-wrap gap-5 pt-5 text-sm text-gray-600">
                  {repository.language && <span>{repository.language}</span>}

                  <span>⭐ {repository.stargazers_count}</span>

                  <span>Forks: {repository.forks_count}</span>
                </div>

                <span>
                  Updated:{" "}
                  {new Date(repository.updated_at).toLocaleDateString()}
                </span>
              </article>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            {hasMoreRepositories && (
              <button
                type="button"
                onClick={onShowMore}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white"
              >
                Show More
              </button>
            )}

            {visibleRepositories > 6 && (
              <button
                type="button"
                onClick={onShowLess}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium"
              >
                Show Less
              </button>
            )}
          </div>

          {filteredRepositories.length === 0 && (
            <div className="mt-6 rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">
                No repositories match the selected filters.
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
