import type { GitHubRepository, RepositorySort } from "@/types/github";

type FilterRepositoriesParams = {
  repositories: GitHubRepository[];
  search: string;
  language: string;
  sortBy: RepositorySort;
};

export const getAvailableLanguages = (
  repositories: GitHubRepository[],
): string[] => {
  return Array.from(
    new Set(
      repositories
        .map((repository) => repository.language)
        .filter((language): language is string => language !== null),
    ),
  ).sort((a, b) => a.localeCompare(b));
};

export const filterAndSortRepositories = ({
  repositories,
  search,
  language,
  sortBy,
}: FilterRepositoriesParams): GitHubRepository[] => {
  const normalizedSearch = search.trim().toLowerCase();

  return repositories
    .filter((repository) => {
      const matchesSearch =
        repository.name.toLowerCase().includes(normalizedSearch) ||
        (repository.description?.toLowerCase().includes(normalizedSearch) ??
          false);

      const matchesLanguage =
        language === "ALL" || repository.language === language;

      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;

        case "forks":
          return b.forks_count - a.forks_count;

        case "name":
          return a.name.localeCompare(b.name);

        case "updated":
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });
};
