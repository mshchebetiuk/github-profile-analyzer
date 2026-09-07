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

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    try {
      setLoading(true);
      setError("");
      setUser(null);

      const response = await fetch(
        `https://api.github.com/users/${trimmedUsername}`,
      );

      if (!response.ok) throw new Error("GitHub user not found");

      const data: GitHubUser = await response.json();
      setUser(data);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }

    console.log("GitHub username:", trimmedUsername);
  };

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
        )}
      </section>
    </main>
  );
}
