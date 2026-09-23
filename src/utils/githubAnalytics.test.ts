import { describe, expect, it } from "vitest";

import {
  calculateActivityAnalytics,
  calculateRepositoryAnalytics,
  calculateRepositoryQuality,
  calculateProfileScore,
} from "./githubAnalytics";

import type { GitHubRepository } from "@/types/github";

describe("calculateRepositoryAnalytics", () => {
  it("calculates repository analytics correctly", () => {
    const repositories: GitHubRepository[] = [
      {
        id: 1,
        name: "project-one",
        description: "First project",
        html_url: "https://github.com/test/project-one",
        language: "TypeScript",
        stargazers_count: 10,
        forks_count: 3,
        updated_at: "2026-09-20T12:00:00Z",
      },
      {
        id: 2,
        name: "project-two",
        description: "Second project",
        html_url: "https://github.com/test/project-two",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 2,
        updated_at: "2026-09-21T12:00:00Z",
      },
      {
        id: 3,
        name: "project-three",
        description: null,
        html_url: "https://github.com/test/project-three",
        language: "JavaScript",
        stargazers_count: 2,
        forks_count: 1,
        updated_at: "2026-09-22T12:00:00Z",
      },
    ];

    const result = calculateRepositoryAnalytics(repositories);

    expect(result.totalStars).toBe(17);
    expect(result.totalForks).toBe(6);
    expect(result.topLanguage).toBe("TypeScript");
    expect(result.languagesCount).toBe(2);
  });

  it("handles an empty repository list", () => {
    const result = calculateRepositoryAnalytics([]);

    expect(result.totalStars).toBe(0);
    expect(result.totalForks).toBe(0);
    expect(result.topLanguage).toBe("N/A");
    expect(result.languagesCount).toBe(0);
  });
});

describe("calculateRepositoryQuality", () => {
  it("calculates README statistics correctly", () => {
    const repositoryQuality = [
      {
        repository: "project-one",
        hasReadme: true,
      },
      {
        repository: "project-two",
        hasReadme: true,
      },
      {
        repository: "project-three",
        hasReadme: false,
      },
      {
        repository: "project-four",
        hasReadme: false,
      },
    ];

    const result = calculateRepositoryQuality(repositoryQuality);

    expect(result.repositoriesWithReadme).toBe(2);
    expect(result.readmePercentage).toBe(50);
  });

  it("handles an empty repository quality list", () => {
    const result = calculateRepositoryQuality([]);

    expect(result.repositoriesWithReadme).toBe(0);
    expect(result.readmePercentage).toBe(0);
  });

  it("returns 100 percent when every repository has a README", () => {
    const repositoryQuality = [
      {
        repository: "project-one",
        hasReadme: true,
      },
      {
        repository: "project-two",
        hasReadme: true,
      },
    ];

    const result = calculateRepositoryQuality(repositoryQuality);

    expect(result.repositoriesWithReadme).toBe(2);
    expect(result.readmePercentage).toBe(100);
  });
});

describe("calculateActivityAnalytics", () => {
  const currentTime = new Date("2026-09-23T12:00:00Z").getTime();

  it("calculates activity for recently updated repositories", () => {
    const repositories: GitHubRepository[] = [
      {
        id: 1,
        name: "recent-project",
        description: "Recent project",
        html_url: "https://github.com/test/recent-project",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 5,
        updated_at: "2026-09-20T12:00:00Z",
      },
      {
        id: 2,
        name: "older-project",
        description: "Older project",
        html_url: "https://github.com/test/older-project",
        language: "JavaScript",
        stargazers_count: 2,
        forks_count: 0,
        updated_at: "2026-08-01T12:00:00Z",
      },
    ];

    const result = calculateActivityAnalytics(repositories, currentTime);

    expect(result.daysSinceLastActivity).toBe(3);
    expect(result.recentlyActiveRepositories).toBe(1);
  });

  it("handles an empty repositories list", () => {
    const result = calculateActivityAnalytics([], currentTime);

    expect(result.daysSinceLastActivity).toBeNull();
    expect(result.recentlyActiveRepositories).toBe(0);
  });
});

describe("calculateProfileScore", () => {
  it("returns 0 when user is null", () => {
    const result = calculateProfileScore({
      user: null,
      repositories: [],
      technologies: [],
      totalStars: 0,
      readmePercentage: 0,
      daysSinceLastActivity: null,
    });

    expect(result).toBe(0);
  });

  it("calculates score for a basic profile", () => {
    const user = {
      login: "test-user",
      name: "Test User",
      avatar_url: "https://github.com/test.png",
      bio: "Full-Stack Developer",
      public_repos: 3,
      followers: 1,
      following: 0,
      html_url: "https://github.com/test-user",
    };

    const repositories: GitHubRepository[] = [
      {
        id: 1,
        name: "project-one",
        description: "Project one",
        html_url: "https://github.com/test/project-one",
        language: "TypeScript",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2026-09-20T12:00:00Z",
      },
      {
        id: 2,
        name: "project-two",
        description: null,
        html_url: "https://github.com/test/project-two",
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2026-09-20T12:00:00Z",
      },
      {
        id: 3,
        name: "project-three",
        description: null,
        html_url: "https://github.com/test/project-three",
        language: "TypeScript",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2026-09-20T12:00:00Z",
      },
    ];

    const result = calculateProfileScore({
      user,
      repositories,
      technologies: ["React", "TypeScript", "Next.js"],
      totalStars: 1,
      readmePercentage: 50,
      daysSinceLastActivity: 10,
    });

    expect(result).toBe(60);
  });

  it("caps the profile score at 100", () => {
    const user = {
      login: "test-user",
      name: "Test user",
      avatar_url: "https://github.com/test.png",
      bio: "Full-Stack Developer",
      public_repos: 5,
      followers: 10,
      following: 5,
      html_url: "https://github.com/test-user",
    };

    const repositories: GitHubRepository[] = Array.from(
      { length: 5 },
      (_, index) => ({
        id: index + 1,
        name: `project-${index + 1}`,
        description: "Project description",
        html_url: `https://github.com/test/project-${index + 1}`,
        language: "TypeScript",
        stargazers_count: 10,
        forks_count: 2,
        updated_at: "2026-09-20T12:00:00Z",
      }),
    );

    const result = calculateProfileScore({
      user,
      repositories,
      technologies: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL"],
      totalStars: 50,
      readmePercentage: 100,
      daysSinceLastActivity: 3,
    });

    expect(result).toBe(100);
  });
});
