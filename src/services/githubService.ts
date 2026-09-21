import type {
  GitHubUser,
  GitHubRepository,
  RepositoryQualityResult,
} from "@/types/github";

export type GithubProfileResponse = {
  user: GitHubUser;
  repositories: GitHubRepository[];
  technologies: string[];
  repositoryQuality: RepositoryQualityResult[];
};

type GitHubErrorResponse = {
  error?: string;
};

export const fetchGitHubProfile = async (
  username: string,
): Promise<GithubProfileResponse> => {
  const response = await fetch(
    `/api/github?username=${encodeURIComponent(username.trim())}`,
  );

  const data = (await response.json()) as
    | GithubProfileResponse
    | GitHubErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Failed to fetch GitHub profile.",
    );
  }

  return data as GithubProfileResponse;
};
