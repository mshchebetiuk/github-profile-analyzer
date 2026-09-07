"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    console.log("GitHub username:", trimmedUsername);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-xl text-center">
        <h1>GitHub Profile Analyzer</h1>

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
            disabled={!username.trim()}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze
          </button>
        </form>
      </section>
    </main>
  );
}
