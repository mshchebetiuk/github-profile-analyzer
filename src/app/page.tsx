"use client";

import { FormEvent, useState } from "react";

import ProfileCard from "@/app/components/ProfileCard";
import Analytics from "@/app/components/Analytics";
import Technologies from "@/app/components/Technologies";
import LanguageStatistics from "@/app/components/LanguageStatistics";
import RepositoryInsights from "@/app/components/RepositoryInsights";
import RepositoryQuality from "@/app/components/RepositoryQuality";
import Activity from "@/app/components/Activity";
import BestProject from "@/app/components/BestProject";
import ProfileScore from "@/app/components/ProfileScore";
import Recommendations from "@/app/components/Recommendations";
import ProfileComparison from "@/app/components/ProfileComparison";
import Repositories from "@/app/components/Repositories";

import {
  calculateProfileScore,
  calculateRepositoryInsights,
  calculateRepositoryScore,
  getRecommendations,
} from "@/utils/githubAnalytics";

import type {
  GitHubUser,
  GitHubRepository,
  RepositoryQualityResult,
  RepositorySort,
} from "@/types/github";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [repositoryQuality, setRepositoryQuality] = useState<
    RepositoryQualityResult[]
  >([]);
  const [currentTime] = useState(() => Date.now());
  const [repositorySearch, setRepositorySearch] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<RepositorySort>("updated");
  const [visibleRepositories, setVisibleRepositories] = useState(6);
  const [compareUsername, setCompareUsername] = useState("");
  const [compareUser, setCompareUser] = useState<GitHubUser | null>(null);
  const [compareRepositories, setCompareRepositories] = useState<
    GitHubRepository[]
  >([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    try {
      setLoading(true);
      setError("");
      setUser(null);

      setRepositories([]);
      setTechnologies([]);
      setRepositoryQuality([]);
      setVisibleRepositories(6);

      const response = await fetch(
        `/api/github?username=${encodeURIComponent(trimmedUsername)}`,
      );

      const data = await response.json();
      const repositoryQualityData: RepositoryQualityResult[] =
        data.repositoryQuality;

      if (!response.ok)
        throw new Error(data.message ?? "Failed to analyze GitHub profile");

      const userData: GitHubUser = data.user;
      const repositoriesData: GitHubRepository[] = data.repositories;
      const technologiesData: string[] = data.technologies;

      setUser(userData);
      setRepositories(repositoriesData);
      setTechnologies(technologiesData);
      setRepositoryQuality(repositoryQualityData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }

    console.log("GitHub username:", trimmedUsername);
  };

  const handleCompare = async () => {
    const trimmedUsername = compareUsername.trim();

    if (!trimmedUsername) return;

    try {
      setCompareLoading(true);
      setCompareError("");
      setCompareUser(null);
      setCompareRepositories([]);

      const response = await fetch(
        `/api/github?username=${encodeURIComponent(trimmedUsername)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to load comparison profile");
      }

      setCompareUser(data.user);
      setCompareRepositories(data.repositories);
    } catch (error) {
      if (error instanceof Error) {
        setCompareError(error.message);
      } else {
        setCompareError("Something went wrong");
      }
    } finally {
      setCompareLoading(false);
    }
  };

  const totalStars = repositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0,
  );

  const totalForks = repositories.reduce(
    (total, repository) => total + repository.forks_count,
    0,
  );

  const languages = repositories
    .map((repository) => repository.language)
    .filter((language): language is string => language !== null);

  const uniqueLanguages = new Set(languages);

  const languageCount = languages.reduce<Record<string, number>>(
    (count, language) => {
      count[language] = (count[language] ?? 0) + 1;

      return count;
    },
    {},
  );

  const topLanguage =
    Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const repositoriesWithReadme = repositoryQuality.filter(
    (repository) => repository.hasReadme,
  ).length;

  const readmePercentage =
    repositoryQuality.length > 0
      ? Math.round((repositoriesWithReadme / repositoryQuality.length) * 100)
      : 0;

  const sortedRepositories = [...repositories].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const latestRepository = sortedRepositories[0];

  const lastActivityDate = latestRepository
    ? new Date(latestRepository.updated_at)
    : null;

  const daysSinceLastActivity = lastActivityDate
    ? Math.floor(
        (currentTime - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  const recentlyActiveRepositories = repositories.filter((repository) => {
    const updatedAt = new Date(repository.updated_at).getTime();

    const daysDifference = (currentTime - updatedAt) / (1000 * 60 * 60 * 24);

    return daysDifference <= 30;
  }).length;

  const activityStatus =
    daysSinceLastActivity === null
      ? "No activity"
      : daysSinceLastActivity <= 7
        ? "Very active"
        : daysSinceLastActivity <= 30
          ? "Active"
          : daysSinceLastActivity <= 90
            ? "Moderately active"
            : "Inactive";

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

  const bestRepository =
    repositories.length > 0
      ? repositories.reduce((best, repository) => {
          const currentScore = calculateRepositoryScore(
            repository,
            repositoryQuality,
            currentTime,
          );

          const bestScore = calculateRepositoryScore(
            best,
            repositoryQuality,
            currentTime,
          );

          return currentScore > bestScore ? repository : best;
        })
      : null;

  const bestRepositoryScore = bestRepository
    ? calculateRepositoryScore(bestRepository, repositoryQuality, currentTime)
    : 0;

  const bestRepositoryQuality = bestRepository
    ? repositoryQuality.find((item) => item.repository === bestRepository.name)
    : undefined;

  const totalRepositoriesWithLanguage = languages.length;

  const languageStatistics = Object.entries(languageCount)
    .map(([language, count]) => ({
      language,
      count,
      percentage:
        totalRepositoriesWithLanguage > 0
          ? Math.round((count / totalRepositoriesWithLanguage) * 100)
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const {
    averageStars,
    averageForks,
    repositoriesWithoutDescription,
    inactiveRepositories,
  } = calculateRepositoryInsights({
    repositories,
    currentTime,
  });

  const availableLanguages = Array.from(
    new Set(
      repositories
        .map((repository) => repository.language)
        .filter((language): language is string => Boolean(language)),
    ),
  ).sort();

  const filteredRepositories = repositories
    .filter((repository) => {
      const matchesSearch = repository.name
        .toLowerCase()
        .includes(repositorySearch.toLowerCase());

      const matchesLanguage =
        languageFilter === "All" || repository.language === languageFilter;

      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }

      if (sortBy === "forks") {
        return b.forks_count - a.forks_count;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

  const displayedRepositories = filteredRepositories.slice(
    0,
    visibleRepositories,
  );

  const hasMoreRepositories = visibleRepositories < filteredRepositories.length;

  const resetRepositoryFilters = () => {
    setRepositorySearch("");
    setLanguageFilter("All");
    setSortBy("updated");
    setVisibleRepositories(6);
  };

  const compareTotalStars = compareRepositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0,
  );

  const compareTotalForks = compareRepositories.reduce(
    (total, repository) => total + repository.forks_count,
    0,
  );

  const compareLanguage = new Set(
    compareRepositories
      .map((repository) => repository.language)
      .filter((language): language is string => language !== null),
  );

  const getMetricWinner = (primaryValue: number, compareValue: number) => {
    if (primaryValue > compareValue) return "primary";
    if (compareValue > primaryValue) return "compare";

    return "draw";
  };

  const comparisonResults = [
    getMetricWinner(repositories.length, compareRepositories.length),
    getMetricWinner(user?.followers ?? 0, compareUser?.followers ?? 0),
    getMetricWinner(totalStars, compareTotalStars),
    getMetricWinner(totalForks, compareTotalForks),
    getMetricWinner(uniqueLanguages.size, compareLanguage.size),
  ];

  const primaryWins = comparisonResults.filter(
    (result) => result === "primary",
  ).length;

  const compareWins = comparisonResults.filter(
    (result) => result === "compare",
  ).length;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-5xl">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">GitHub Profile Analyzer</h1>

          <p className="mb-8 text-gray-600">
            Analyze GitHub profiles, repositories, technologies and activity.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter GitHub username..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={compareUsername}
              onChange={(event) => {
                setCompareUsername(event.target.value);
              }}
              placeholder="Compare with GitHub username..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={handleCompare}
              disabled={!compareUsername.trim() || compareLoading}
              className="rounded-lg border border-black px-6 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {compareLoading ? "Comparing..." : "Compare"}
            </button>

            {compareError && (
              <p className="mt-4 text-center text-red-600">{compareError}</p>
            )}
          </div>
        </div>

        {error && <p className="mt-6 text-center text-red-600">{error}</p>}

        {user && (
          <>
            <ProfileCard user={user} />

            <ProfileComparison
              user={user}
              compareUser={compareUser}
              repositoriesCount={repositories.length}
              compareRepositoriesCount={compareRepositories.length}
              totalStars={totalStars}
              compareTotalStars={compareTotalStars}
              totalForks={totalForks}
              compareTotalForks={compareTotalForks}
              languagesCount={uniqueLanguages.size}
              compareLanguagesCount={compareLanguage.size}
              primaryWins={primaryWins}
              compareWins={compareWins}
            />

            <Analytics
              totalStars={totalStars}
              totalForks={totalForks}
              topLanguage={topLanguage}
              languagesCount={uniqueLanguages.size}
            />

            <Technologies technologies={technologies} />

            <LanguageStatistics statistics={languageStatistics} />

            <RepositoryInsights
              averageStars={averageStars}
              averageForks={averageForks}
              repositoriesWithoutDescription={repositoriesWithoutDescription}
              inactiveRepositories={inactiveRepositories}
            />

            <RepositoryQuality
              repositoriesWithReadme={repositoriesWithReadme}
              totalRepositories={repositoryQuality.length}
              readmePercentage={readmePercentage}
            />

            <Activity
              activityStatus={activityStatus}
              daysSinceLastActivity={daysSinceLastActivity}
              recentlyActiveRepositories={recentlyActiveRepositories}
            />

            <BestProject
              repository={bestRepository}
              score={bestRepositoryScore}
              hasReadme={bestRepositoryQuality?.hasReadme ?? false}
            />

            <ProfileScore score={profileScore} />

            <Recommendations recommendations={recommendations} />

            <Repositories
              repositories={repositories}
              filteredRepositories={filteredRepositories}
              displayedRepositories={displayedRepositories}
              availableLanguages={availableLanguages}
              repositorySearch={repositorySearch}
              languageFilter={languageFilter}
              sortBy={sortBy}
              hasMoreRepositories={hasMoreRepositories}
              visibleRepositories={visibleRepositories}
              onSearchChange={setRepositorySearch}
              onLanguageChange={setLanguageFilter}
              onSortChange={setSortBy}
              onReset={resetRepositoryFilters}
              onShowMore={() =>
                setVisibleRepositories((current) => current + 6)
              }
              onShowLess={() => setVisibleRepositories(6)}
            />
          </>
        )}
      </section>
    </main>
  );
}
