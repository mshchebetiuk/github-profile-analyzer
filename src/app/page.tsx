"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

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

type RepositoryQuality = {
  repository: string;
  hasReadme: boolean;
};

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [repositoryQuality, setRepositoryQuality] = useState<
    RepositoryQuality[]
  >([]);
  const [currentTime] = useState(() => Date.now());
  const [repositorySearch, setRepositorySearch] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "forks" | "name">(
    "updated",
  );
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
      const repositoryQualityData: RepositoryQuality[] = data.repositoryQuality;

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

  const calculateProfileScore = () => {
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
      const descriptionRatio =
        repositoriesWithDescription / repositories.length;

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

    if (daysSinceLastActivity !== null && daysSinceLastActivity <= 30) {
      score += 5;
    }

    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  const getRecommendations = () => {
    if (!user) return [];

    const recommendations: string[] = [];

    if (!user.bio) recommendations.push("Add a bio to your GitHub profile.");
    if (repositories.length < 5)
      recommendations.push(
        "Add more public projects to demonstrate your skills.",
      );

    const repositoriesWithoutDescription = repositories.filter(
      (repository) => !repository.description,
    );

    if (repositoriesWithoutDescription.length > 0)
      recommendations.push(
        "Add descriptions to repositories that do not have one.",
      );
    if (technologies.length < 3)
      recommendations.push(
        "Show more technologies across your public projects.",
      );
    if (totalStars === 0)
      recommendations.push(
        "Improve project presentation to attract more GitHub engagement.",
      );

    if (recommendations.length === 0) {
      recommendations.push(
        "Your GitHub profile is well structured. Keep projects active and updated.",
      );
    }

    if (readmePercentage < 80) {
      recommendations.push("Add README files to more repositories.");
    }

    if (daysSinceLastActivity !== null && daysSinceLastActivity > 90) {
      recommendations.push("Update your pubilc project more regularly.");
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const calculateRepositoryScore = (repository: GitHubRepository) => {
    let score = 0;

    if (repository.description) score += 10;
    if (repository.language) score += 10;

    const quality = repositoryQuality.find(
      (item) => item.repository === repository.name,
    );

    if (quality?.hasReadme) score += 15;

    score += Math.min(repository.stargazers_count * 2, 20);
    score += Math.min(repository.forks_count * 2, 10);

    const updatedAt = new Date(repository.updated_at).getTime();

    const daysSinceUpdate = (currentTime - updatedAt) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate <= 30) {
      score += 20;
    } else if (daysSinceUpdate <= 90) {
      score += 10;
    }

    return score;
  };

  const bestRepository = repositories.reduce<GitHubRepository | null>(
    (best, repository) => {
      if (!best) return repository;

      const currentScore = calculateRepositoryScore(repository);
      const bestScore = calculateRepositoryScore(best);

      return currentScore > bestScore ? repository : best;
    },
    null,
  );

  const bestRepositoryScore = bestRepository
    ? calculateRepositoryScore(bestRepository)
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

  const averageStars =
    repositories.length > 0 ? Math.round(totalStars / repositories.length) : 0;

  const averageForks =
    repositories.length > 0 ? Math.round(totalForks / repositories.length) : 0;

  const repositoriesWithoutDescription = repositories.filter(
    (repository) => !repository.description,
  ).length;

  const inactiveRepositories = repositories.filter((repository) => {
    const updatedAt = new Date(repository.updated_at).getTime();

    const daysSinceUpdate = (currentTime - updatedAt) / (1000 * 60 * 60 * 24);

    return daysSinceUpdate > 90;
  }).length;

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
            <div className="mt-10 rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={112}
                  height={112}
                  className="rounded-full"
                />

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    {user.name ?? user.login}
                  </h2>

                  <p className="text-gray-500">@{user.login}</p>

                  {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}

                  <div className="mt-5 flex flex-wrap justify-center gap-5 sm:justify-start">
                    <div>
                      <span className="font-bold">{user.public_repos}</span>{" "}
                      Repositories
                    </div>

                    <div>
                      <span className="font-bold">{user.followers}</span>{" "}
                      Followers
                    </div>

                    <div>
                      <span className="font-bold">{user.following}</span>{" "}
                      Following
                    </div>
                  </div>

                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block font-medium underline"
                  >
                    Open GitHub profile
                  </a>
                </div>
              </div>
            </div>

            {user && compareUser && (
              <section className="mb-10">
                <h2 className="mb-5 text-2xl fonb-bold">Profile Comparison</h2>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="grid grid-cols-3 borer-b border-gray-200 p-4 font-bold">
                    <span>Metric</span>

                    <span className="text-center">@{user.login}</span>

                    <span className="text-center">@{compareUser.login}</span>
                  </div>

                  <div className="grid grid-cols-3 border-b border-gray-200 p-4">
                    <span>Repositories</span>
                    <span className="text-center">{repositories.length}</span>
                    <span className="text-center">
                      {compareRepositories.length}
                    </span>
                  </div>

                  <div className="grid grid-cols 3 border-b border-gray-200 p-4">
                    <span>Followers</span>
                    <span className="text-center">{user.followers}</span>
                    <span className="text-center">{compareUser.followers}</span>
                  </div>

                  <div className="grid grid-cols-3 border-b border-gray-200 p-4">
                    <span>Total Stars</span>
                    <span className="text-center">{totalStars}</span>
                    <span className="text-center">{compareTotalStars}</span>
                  </div>
                </div>

                <div className="gid grid-cols-3 border-b border-gray-200 p-4">
                  <span>Total Forks</span>
                  <span className="text-center">{totalForks}</span>
                  <span className="text-center">{compareTotalForks}</span>
                </div>

                <div className="grid grid-cols-3 p-4">
                  <span>Languages</span>
                  <span className="text-center">{uniqueLanguages.size}</span>
                  <span className="text-center">{compareLanguage.size}</span>
                </div>
              </section>
            )}

            {user && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Analytics</h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Stars</p>

                    <p className="mt-2 text-2xl font-bold">{totalStars}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Forks</p>

                    <p className="mt-2 text-2xl font-bold">{totalForks}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Top Language</p>

                    <p className="mt-2 text-2xl font-bold">{topLanguage}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Languages</p>

                    <div className="mt-2 text-2xl font-bold">
                      {uniqueLanguages.size}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {technologies.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Technologies</h2>

                <div className="flex flex-wrap gap-3">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {languageStatistics.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Language Statistics</h2>

                <div className="space-y-4">
                  {languageStatistics.map((item) => (
                    <div
                      key={item.language}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">{item.language}</span>

                        <span className="text-sm text-gray-500">
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.count} repositories
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {user && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Repository Insights</h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Average Stars</p>

                    <p className="mt-2 text-2xl font-bold">{averageStars}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Average Forks</p>

                    <p className="mt-2 text-2xl font-bold">{averageForks}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                      Missing Descriptions
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {repositoriesWithoutDescription}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                      Inactive Repositories
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {inactiveRepositories}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {repositoryQuality.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Repository Quality</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                      Repositories with README
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {repositoriesWithReadme} / {repositoryQuality.length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">README Coverage</p>

                    <p className="mt-2 text-2xl font-bold">
                      {readmePercentage}%
                    </p>
                  </div>
                </div>
              </section>
            )}

            {user && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Activity</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Activity Status</p>

                    <p className="mt-2 text-xl font-bold">{activityStatus}</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Last Activity</p>

                    <p className="mt-2 text-xl font-bold">
                      {daysSinceLastActivity !== null
                        ? `${daysSinceLastActivity} days ago`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Active Repositories</p>

                    <p className="mt-2 text-xl font-bold">
                      {recentlyActiveRepositories}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {bestRepository && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Best Project</h2>

                <div className="rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <a
                        href={bestRepository.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xl font-bold hover:underline"
                      >
                        {bestRepository.name}
                      </a>

                      <p className="mt-2 text-gray-600">
                        {bestRepository.description ?? "No description"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="text-2xl font-bold">
                        {bestRepositoryScore}
                      </span>

                      <span className="text-gray-500"> points</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
                    {bestRepository.language && (
                      <span>{bestRepository.language}</span>
                    )}

                    {bestRepositoryQuality?.hasReadme && <span>README ✓</span>}

                    <span>⭐ {bestRepository.stargazers_count}</span>

                    <span>Forks: {bestRepository.forks_count}</span>

                    <span>
                      Updated{" "}
                      {new Date(bestRepository.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {user && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Profile Score</h2>

                <div className="rounded-xl border border-gray-200 p-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold">{profileScore}</span>

                    <span className="mb-1 text-lg text-gray-500">/ 100</span>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-black transition-all"
                      style={{ width: `${profileScore}%` }}
                    />
                  </div>
                </div>
              </section>
            )}

            {user && (
              <section className="mt-10">
                <h2 className="mb-5 text-2xl font-bold">Recommendations</h2>

                <div className="rounded-xl border border-gray-200 p-6">
                  <ul className="space-y-3">
                    {recommendations.map((recommendation) => (
                      <li
                        key={recommendation}
                        className="flex gap-3 text-gray-700"
                      >
                        <span>•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section className="mt-10">
              <div className="mb-5 flex flex-col gap-4 md:flex-row">
                <input
                  type="text"
                  value={repositorySearch}
                  onChange={(e) => setRepositorySearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                />

                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
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
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as
                        | "updated"
                        | "stars"
                        | "forks"
                        | "name",
                    )
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3"
                >
                  <option value="updated">Recently updated</option>
                  <option value="stars">Most stars</option>
                  <option value="forks">Most forks</option>
                  <option value="name">Name</option>
                </select>

                <button
                  type="button"
                  onClick={resetRepositoryFilters}
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

                      <div className="mt-auto flex flex-wrap gap-3 pt-5 text-sm text-gray-600">
                        {repository.language && (
                          <span>{repository.language}</span>
                        )}

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
                      onClick={() =>
                        setVisibleRepositories((current) => current + 6)
                      }
                      className="rounded-lg bg-black px-6 py-3 font-medium text-white"
                    >
                      Show More
                    </button>
                  )}

                  {visibleRepositories > 6 && (
                    <button
                      type="button"
                      onClick={() => setVisibleRepositories(6)}
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
        )}
      </section>
    </main>
  );
}
