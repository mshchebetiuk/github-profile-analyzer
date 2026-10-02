import { useState } from "react";

import {
  calculateActivityAnalytics,
  calculateLanguageStatistics,
  calculateProfileScore,
  calculateRepositoryAnalytics,
  calculateRepositoryInsights,
  calculateRepositoryQuality,
  calculateRepositoryHealth,
  calculatePortfolioReadiness,
  getTopRepositories,
  getRecommendations,
  generateProfileSummary,
  getRepositoryScoreBreakdown,
  getRepositoryAssessment,
  getRepositoryGrade,
  findBestRepository,
} from "@/utils/githubAnalytics";

import type {
  GitHubRepository,
  GitHubUser,
  RepositoryQualityResult,
} from "@/types/github";

type UseGitHubAnalyticsParams = {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  technologies: string[];
  repositoryQuality: RepositoryQualityResult[];
};

export const useGitHubAnalytics = ({
  user,
  repositories,
  technologies,
  repositoryQuality,
}: UseGitHubAnalyticsParams) => {
  const [currentTime] = useState(() => Date.now());

  const getRepositoryAnalysis = (repository: GitHubRepository) => {
    const breakdown = getRepositoryScoreBreakdown(
      repository,
      repositoryQuality,
      currentTime,
    );

    const quality = repositoryQuality.find(
      (item) => item.repository === repository.name,
    );

    const assessment = getRepositoryAssessment(
      repository,
      quality ?? null,
      currentTime,
    );

    const portfolioReadiness = calculatePortfolioReadiness(
      repository,
      quality ?? null,
      currentTime,
    );

    const repositoryGrade = getRepositoryGrade(portfolioReadiness.total);

    return {
      repository,
      score: breakdown.total,
      hasReadme: quality?.hasReadme ?? false,
      breakdown,
      readmeAnalysis: quality ?? null,
      assessment,
      portfolioReadiness,
      repositoryGrade,
    };
  };

  const { totalStars, totalForks, topLanguage, languagesCount } =
    calculateRepositoryAnalytics(repositories);

  const { repositoriesWithReadme, readmePercentage } =
    calculateRepositoryQuality(repositoryQuality);

  const { daysSinceLastActivity, recentlyActiveRepositories, activityStatus } =
    calculateActivityAnalytics(repositories, currentTime);

  const profileScore = calculateProfileScore({
    user,
    repositories,
    technologies,
    totalStars,
    readmePercentage,
    daysSinceLastActivity,
  });

  const recommendations = getRecommendations({
    user,
    repositories,
    technologies,
    totalStars,
    readmePercentage,
    daysSinceLastActivity,
  });

  const { repository: bestRepository, score: bestRepositoryScore } =
    findBestRepository(repositories, repositoryQuality, currentTime);

  const bestRepositoryQuality = bestRepository
    ? repositoryQuality.find(
        (quality) => quality.repository === bestRepository.name,
      )
    : undefined;

  const topRepositories = getTopRepositories(
    repositories,
    repositoryQuality,
    currentTime,
  );

  const languageStatistics = calculateLanguageStatistics(repositories);

  const repositoryInsights = calculateRepositoryInsights({
    repositories,
    currentTime,
  });

  const repositoryHealth = calculateRepositoryHealth({
    repositories,
    repositoryQuality,
    currentTime,
  });

  const profileSummary = generateProfileSummary({
    topLanguage,
    technologies,
    profileScore,
    healthScore: repositoryHealth.healthScore,
    bestRepository,
    daysSinceLastActivity,
    repositoriesWithoutReadme: repositoryHealth.repositoriesWithoutReadme,
    repositoriesWithoutDescription:
      repositoryHealth.repositoriesWithoutDescription,
  });

  return {
    currentTime,
    totalStars,
    totalForks,
    topLanguage,
    languagesCount,
    repositoriesWithReadme,
    readmePercentage,
    daysSinceLastActivity,
    recentlyActiveRepositories,
    activityStatus,
    profileScore,
    recommendations,
    bestRepository,
    bestRepositoryScore,
    bestRepositoryQuality,
    languageStatistics,
    repositoryInsights,
    topRepositories,
    repositoryHealth,
    profileSummary,
    getRepositoryAnalysis,
  };
};
