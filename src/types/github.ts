export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export type RepositoryQualityResult = {
  repository: string;
  hasReadme: boolean;
};

export type LanguageStatistic = {
  language: string;
  count: number;
  percentage: number;
};

export type RepositorySort = "updated" | "stars" | "forks" | "name";
