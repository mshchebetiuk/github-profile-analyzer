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
  calculateActivityAnalytics,
  calculateLanguageStatistics,
  calculateProfileComparison,
  calculateProfileScore,
  calculateRepositoryAnalytics,
  calculateRepositoryInsights,
  calculateRepositoryQuality,
  getRecommendations,
  findBestRepository,
} from "@/utils/githubAnalytics";

import type {
  GitHubUser,
  GitHubRepository,
  RepositoryQualityResult,
  RepositorySort,
} from "@/types/github";

import {
  filterAndSortRepositories,
  getAvailableLanguages,
} from "@/utils/repositoryFilter";

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
    ? repositoryQuality.find((item) => item.repository === bestRepository.name)
    : undefined;

  const languageStatistics = calculateLanguageStatistics(repositories);

  const {
    averageStars,
    averageForks,
    repositoriesWithoutDescription,
    inactiveRepositories,
  } = calculateRepositoryInsights({
    repositories,
    currentTime,
  });

  const availableLanguages = getAvailableLanguages(repositories);

  const filteredRepositories = filterAndSortRepositories({
    repositories,
    search: repositorySearch,
    language: languageFilter,
    sortBy,
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

  const {
    compareTotalStars,
    compareTotalForks,
    compareLanguagesCount,
    primaryWins,
    compareWins,
  } = calculateProfileComparison({
    primaryRepositories: repositories,
    compareRepositories,
    primaryFollowers: user?.followers ?? 0,
    compareFollowers: compareUser?.followers ?? 0,
    primaryTotalStars: totalStars,
    primaryTotalForks: totalForks,
    primaryLanguagesCount: languagesCount,
  });

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
              languagesCount={languagesCount}
              compareLanguagesCount={compareLanguagesCount}
              primaryWins={primaryWins}
              compareWins={compareWins}
            />

            <Analytics
              totalStars={totalStars}
              totalForks={totalForks}
              topLanguage={topLanguage}
              languagesCount={languagesCount}
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
