"use client";

import { FormEvent, useState } from "react";

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

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    try {
      setLoading(true);
      setError("");
      setUser(null);

      const userResponse = await fetch(
        `https://api.github.com/users/${trimmedUsername}`,
      );

      if (!userResponse.ok) throw new Error("GitHub user not found");

      const userData: GitHubUser = await userResponse.json();

      const repositoriesResponse = await fetch(
        `https://api.github.com/users/${trimmedUsername}/repos?sort=updated&direction=desc&per_page=100`,
      );

      if (!repositoriesResponse.ok)
        throw new Error("Failed to load repositories");

      const repositoriesData: GitHubRepository[] =
        await repositoriesResponse.json();

      setUser(userData);
      setRepositories(repositoriesData);
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

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl">
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
        </div>

        {error && <p className="mt-6 text-center text-red-600">{error}</p>}

        {user && (
          <>
            <div className="mt-10 rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-28 w-28 rounded-full"
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
                    {repositories.length} repositories
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {repositories.map((repository) => (
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
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
