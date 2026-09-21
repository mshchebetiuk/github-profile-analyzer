import type {
  GitHubUser,
  GitHubRepository,
  RepositoryQualityResult,
  LanguageStatistic,
} from "@/types/github";

type ProfileScoreParams = {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  technologies: string[];
  totalStars: number;
  readmePercentage: number;
  daysSinceLastActivity: number | null;
};

type RecommendationsParams = {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  technologies: string[];
  totalStars: number;
  readmePercentage: number;
  daysSinceLastActivity: number | null;
};

type RepositoryInsightsParams = {
  repositories: GitHubRepository[];
  currentTime: number;
};

type RepositoryAnalytics = {
  totalStars: number;
  totalForks: number;
  topLanguage: string;
  languagesCount: number;
};

type ActivityAnalytics = {
  daysSinceLastActivity: number | null;
  recentlyActiveRepositories: number;
  activityStatus: string;
};

type RepositoryQualityAnalytics = {
  repositoriesWithReadme: number;
  readmePercentage: number;
};

type BestRepositoryResult = {
  repository: GitHubRepository | null;
  score: number;
};

type ProfileComparisonAnalytics = {
  compareTotalStars: number;
  compareTotalForks: number;
  compareLanguagesCount: number;
  primaryWins: number;
  compareWins: number;
};

type ProfileComparisonParams = {
  primaryRepositories: GitHubRepository[];
  compareRepositories: GitHubRepository[];
  primaryFollowers: number;
  compareFollowers: number;
  primaryTotalStars: number;
  primaryTotalForks: number;
  primaryLanguagesCount: number;
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

export const getRecommendations = ({
  user,
  repositories,
  technologies,
  totalStars,
  readmePercentage,
  daysSinceLastActivity,
}: RecommendationsParams) => {
  if (!user) return [];

  const recommendations: string[] = [];

  if (!user.name)
    recommendations.push("Add your real name to your GitHub profile.");
  if (!user.bio)
    recommendations.push(
      "Add a short bio describing your developer specialization.",
    );

  if (repositories.length < 3)
    recommendations.push(
      "Add more public repositories to demonstrate your skills.",
    );

  const repositoriesWithDescription = repositories.filter(
    (repository) => repository.description,
  ).length;

  if (
    repositories.length > 0 &&
    repositoriesWithDescription / repositories.length < 0.8
  ) {
    recommendations.push("Add descriptions to more of your repositories.");
  }

  if (technologies.length < 3) {
    recommendations.push("Show more technologies across your public projects.");
  }

  if (readmePercentage < 80)
    recommendations.push("Add README files to more repositories.");

  if (totalStars === 0)
    recommendations.push(
      "Build and share project that can attract GitHub stars.",
    );

  if (daysSinceLastActivity === null || daysSinceLastActivity > 30)
    recommendations.push(
      "Keep your GitHub profile active with recent project updates.",
    );

  return recommendations;
};

export const calculateRepositoryInsights = ({
  repositories,
  currentTime,
}: RepositoryInsightsParams) => {
  if (repositories.length === 0) {
    return {
      averageStars: 0,
      averageForks: 0,
      repositoriesWithoutDescription: 0,
      inactiveRepositories: 0,
    };
  }

  const totalStars = repositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0,
  );

  const totalForks = repositories.reduce(
    (total, repository) => total + repository.forks_count,
    0,
  );

  const averageStars = Number((totalStars / repositories.length).toFixed(1));

  const averageForks = Number((totalForks / repositories.length).toFixed(1));

  const repositoriesWithoutDescription = repositories.filter(
    (repository) => !repository.description,
  ).length;

  const inactiveRepositories = repositories.filter((repository) => {
    const updatedAt = new Date(repository.updated_at).getTime();

    const daysSinceUpdate = Math.floor(
      (currentTime - updatedAt) / (1000 * 60 * 60 * 24),
    );

    return daysSinceUpdate > 180;
  }).length;

  return {
    averageStars,
    averageForks,
    repositoriesWithoutDescription,
    inactiveRepositories,
  };
};

export const calculateLanguageStatistics = (
  repositories: GitHubRepository[],
): LanguageStatistic[] => {
  if (repositories.length === 0) return [];

  const languageCount: Record<string, number> = {};

  repositories.forEach((repository) => {
    if (!repository.language) return;

    languageCount[repository.language] =
      (languageCount[repository.language] ?? 0) + 1;
  });

  return Object.entries(languageCount)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / repositories.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateRepositoryAnalytics = (
  repositories: GitHubRepository[],
): RepositoryAnalytics => {
  const totalStars = repositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0,
  );

  const totalForks = repositories.reduce(
    (total, repository) => total + repository.forks_count,
    0,
  );

  const languageCount: Record<string, number> = {};

  repositories.forEach((repository) => {
    if (!repository.language) return;

    languageCount[repository.language] =
      (languageCount[repository.language] ?? 0) + 1;
  });

  const languages = Object.entries(languageCount);

  const topLanguage =
    languages.length > 0
      ? languages.reduce((top, current) =>
          current[1] > top[1] ? current : top,
        )[0]
      : "N/A";

  return {
    totalStars,
    totalForks,
    topLanguage,
    languagesCount: languages.length,
  };
};

export const calculateActivityAnalytics = (
  repositories: GitHubRepository[],
  currentTime: number,
): ActivityAnalytics => {
  if (repositories.length === 0) {
    return {
      daysSinceLastActivity: null,
      recentlyActiveRepositories: 0,
      activityStatus: "No activity",
    };
  }

  const sortedRepositories = [...repositories].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const latesetRepository = sortedRepositories[0];

  const lastActivityDate = new Date(latesetRepository.updated_at).getTime();

  const daysSinceLastActivity = Math.floor(
    (currentTime - lastActivityDate) / (1000 * 60 * 60 * 24),
  );

  const recentlyActiveRepositories = repositories.filter((repository) => {
    const updatedAt = new Date(repository.updated_at).getTime();

    const daysSinceUpdate = Math.floor(
      (currentTime - updatedAt) / (1000 * 60 * 60 * 24),
    );

    return daysSinceUpdate <= 30;
  }).length;

  let activityStatus = "Inactive";

  if (daysSinceLastActivity <= 7) {
    activityStatus = "Very Active";
  } else if (daysSinceLastActivity <= 30) {
    activityStatus = "Active";
  } else if (daysSinceLastActivity <= 90) {
    activityStatus = "Moderately Active";
  }

  return {
    daysSinceLastActivity,
    recentlyActiveRepositories,
    activityStatus,
  };
};

export const calculateRepositoryQuality = (
  repositoryQuality: RepositoryQualityResult[],
): RepositoryQualityAnalytics => {
  const repositoriesWithReadme = repositoryQuality.filter(
    (repository) => repository.hasReadme,
  ).length;

  const readmePercentage =
    repositoryQuality.length > 0
      ? Math.round((repositoriesWithReadme / repositoryQuality.length) * 100)
      : 0;

  return {
    repositoriesWithReadme,
    readmePercentage,
  };
};

export const findBestRepository = (
  repositories: GitHubRepository[],
  repositoryQuality: RepositoryQualityResult[],
  currentTime: number,
): BestRepositoryResult => {
  if (repositories.length === 0) {
    return {
      repository: null,
      score: 0,
    };
  }

  let bestRepository = repositories[0];

  let bestScore = calculateRepositoryScore(
    bestRepository,
    repositoryQuality,
    currentTime,
  );

  for (let i = 1; i < repositories.length; i++) {
    const repository = repositories[i];

    const score = calculateRepositoryScore(
      repository,
      repositoryQuality,
      currentTime,
    );

    if (score > bestScore) {
      bestRepository = repository;
      bestScore = score;
    }
  }

  return {
    repository: bestRepository,
    score: bestScore,
  };
};

export const calculateProfileComparison = ({
  primaryRepositories,
  compareRepositories,
  primaryFollowers,
  compareFollowers,
  primaryTotalStars,
  primaryTotalForks,
  primaryLanguagesCount,
}: ProfileComparisonParams): ProfileComparisonAnalytics => {
  const compareTotalStars = compareRepositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0,
  );

  const compareTotalForks = compareRepositories.reduce(
    (total, repository) => total + repository.forks_count,
    0,
  );

  const compareLanguages = new Set(
    compareRepositories
      .map((repository) => repository.language)
      .filter((language): language is string => language !== null),
  );

  const compareLanguagesCount = compareLanguages.size;

  const getWinner = (primaryValue: number, compareValue: number) => {
    if (primaryValue > compareValue) return "primary";
    if (compareValue > primaryValue) return "compare";

    return "draw";
  };

  const results = [
    getWinner(primaryRepositories.length, compareRepositories.length),
    getWinner(primaryFollowers, compareFollowers),
    getWinner(primaryTotalStars, compareTotalStars),
    getWinner(primaryTotalForks, compareTotalForks),
    getWinner(primaryLanguagesCount, compareLanguagesCount),
  ];

  const primaryWins = results.filter((result) => result === "primary").length;
  const compareWins = results.filter((result) => result === "compare").length;

  return {
    compareTotalStars,
    compareTotalForks,
    compareLanguagesCount,
    primaryWins,
    compareWins,
  };
};
