import { GitHubRepository } from "@/types/github";

type GitHubErrorPayload = {
  message?: string;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type GitHubContentFile = {
  content: string;
};

type RepositoryQuality = {
  repository: string;
  hasReadme: boolean;
};

export class GitHubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "GitHubApiError";
    this.status = status;
  }
}

export const fetchGitHub = async (url: string, headers: HeadersInit) => {
  const response = await fetch(url, {
    headers,
  });

  if (response.ok) return response;

  const data = (await response.json().catch(() => ({}))) as GitHubErrorPayload;
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");

  if (response.status === 403 && remaining === "0") {
    const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : null;

    throw new GitHubApiError(
      resetAt
        ? `GitHub API rate limit exceeded. Try again after ${resetAt}.`
        : "GitHub API rate limit exceeded. Try again later.",
      429,
    );
  }

  if (response.status === 404) {
    throw new GitHubApiError("GitHub user not found.", 404);
  }

  throw new GitHubApiError(
    data.message ?? `GitHub API request failed with status ${response.status}.`,
    500,
  );
};

export const detectTechnologies = async (
  username: string,
  repositories: GitHubRepository[],
  headers: HeadersInit,
) => {
  const technologies = new Set<string>();

  for (const repository of repositories.slice(0, 10)) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repository.name}/contents/package.json`,
        { headers },
      );

      if (!response.ok) continue;

      const file: GitHubContentFile = await response.json();
      const content = Buffer.from(file.content, "base64").toString("utf-8");

      const packageJson: PackageJson = JSON.parse(content);

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if ("react" in dependencies) {
        technologies.add("React");
      }

      if ("next" in dependencies) {
        technologies.add("Next.js");
      }

      if ("typescript" in dependencies) {
        technologies.add("TypeScript");
      }

      if ("@prisma/client" in dependencies || "prisma" in dependencies) {
        technologies.add("Prisma");
      }

      if ("zod" in dependencies) {
        technologies.add("Zod");
      }

      if (
        "tailwindcss" in dependencies ||
        "@tailwindcss/postcss" in dependencies
      ) {
        technologies.add("Tailwind CSS");
      }

      if ("@tanstack/react-query" in dependencies) {
        technologies.add("TanStack Query");
      }

      if ("react-hook-form" in dependencies) {
        technologies.add("React Hook Form");
      }
    } catch {
      continue;
    }
  }

  return Array.from(technologies);
};

export const analyzeRepositoryQuality = async (
  username: string,
  repositories: GitHubRepository[],
  headers: HeadersInit,
) => {
  const results: RepositoryQuality[] = [];

  for (const repository of repositories.slice(0, 10)) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repository.name}/readme`,
        { headers },
      );

      results.push({
        repository: repository.name,
        hasReadme: response.ok,
      });
    } catch {
      results.push({
        repository: repository.name,
        hasReadme: false,
      });
    }
  }

  return results;
};
