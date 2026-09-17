import type {
  GitHubUser,
  GitHubRepository,
  RepositoryQualityResult,
} from "@/types/github";

type ProfileScoreParams = {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  technologies: string[];
  totalStars: number;
  readmePercentage: number;
  daysSinceLastActivity: number | null;
};

export const calculateProfileScore = ({
  user,
  repositories,
  technologies,
  totalStars,
  readmePercentage,
  daysSinceLastActivity,
}: ProfileScoreParams) => {
  if (!user) return 0;

  let score = 0;

  if (user.name) score += 10;
  if (user.bio) score += 10;

  if (repositories.length >= 3) score += 10;
  if (repositories.length >= 5) score += 10;

  const repositoriesWithDescription = repositories.filter(
    (repository) => repository.description,
  ).length;

  if (repositories.length > 0) {
    const descriptionRatio = repositoriesWithDescription / repositories.length;

    if (descriptionRatio >= 0.5) score += 10;
    if (descriptionRatio >= 0.8) score += 10;
  }

  if (technologies.length >= 3) score += 10;
  if (technologies.length >= 5) score += 10;

  if (user.followers >= 1) score += 5;
  if (user.followers >= 5) score += 5;

  if (totalStars >= 1) score += 5;
  if (totalStars >= 5) score += 5;

  if (readmePercentage >= 50) score += 5;
  if (readmePercentage >= 80) score += 5;

  if (daysSinceLastActivity !== null && daysSinceLastActivity <= 30) score += 5;

  return Math.min(score, 100);
};

export const calculateRepositoryScore = (
  repository: GitHubRepository,
  RepositoryQuality: RepositoryQualityResult[],
  currentTime: number,
) => {
  let score = 0;

  if (repository.description) score += 10;
  if (repository.language) score += 10;

  const quality = RepositoryQuality.find(
    (item) => item.repository === repository.name,
  );

  if (quality?.hasReadme) score += 20;

  score += Math.min(repository.stargazers_count * 2, 20);
  score += Math.min(repository.forks_count * 2, 20);

  const updatedAt = new Date(repository.updated_at).getTime();

  const daysSinceUpdate = Math.floor(
    (currentTime - updatedAt) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceUpdate <= 30) {
    score += 20;
  } else if (daysSinceUpdate <= 90) {
    score += 10;
  }

  return score;
};
