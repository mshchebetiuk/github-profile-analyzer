import type { GitHubRepository } from "@/types/github";

type RepositoryPaginationParams = {
  repositories: GitHubRepository[];
  visibleCount: number;
};

type RepositoryPaginationResult = {
  displayedRepositories: GitHubRepository[];
  hasMoreRepositories: boolean;
};

export const paginateRepositories = ({
  repositories,
  visibleCount,
}: RepositoryPaginationParams): RepositoryPaginationResult => {
  return {
    displayedRepositories: repositories.slice(0, visibleCount),
    hasMoreRepositories: visibleCount < repositories.length,
  };
};
