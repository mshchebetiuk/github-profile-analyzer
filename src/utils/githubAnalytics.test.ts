import { describe, expect, it } from "vitest";

import {
  calculateActivityAnalytics,
  calculateRepositoryAnalytics,
  calculateRepositoryQuality,
  calculateRepositoryHealth,
  calculateProfileScore,
  getTopRepositories,
  generateProfileSummary,
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

describe("getTopRepositories", () => {
  const currentTime = new Date("2026-09-24T12:00:00Z").getTime();

  const repositories: GitHubRepository[] = [
    {
      id: 1,
      name: "strong-project",
      description: "Strong project",
      html_url: "https://github.com/test/strong-project",
      language: "TypeScript",
      stargazers_count: 10,
      forks_count: 5,
      updated_at: "2026-09-20T12:00:00Z",
    },
    {
      id: 2,
      name: "medium-project",
      description: "Medium project",
      html_url: "https://github.com/test/medium-project",
      language: "JavaScript",
      stargazers_count: 2,
      forks_count: 1,
      updated_at: "2026-09-10T12:00:00Z",
    },
    {
      id: 3,
      name: "weak-project",
      description: "Weak project",
      html_url: "https://github.com/test/weak-project",
      language: null,
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2025-01-01T12:00:00Z",
    },
  ];

  const repositoryQuality = [
    {
      repository: "strong-project",
      hasReadme: true,
    },
    {
      repository: "medium-project",
      hasReadme: true,
    },
    {
      repository: "weak-project",
      hasReadme: false,
    },
  ];

  it("sorts repositories by score from highest to lowest", () => {
    const result = getTopRepositories(
      repositories,
      repositoryQuality,
      currentTime,
    );

    expect(result).toHaveLength(3);

    expect(result[0].repository.name).toBe("strong-project");

    expect(result[1].repository.name).toBe("medium-project");

    expect(result[2].repository.name).toBe("weak-project");

    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);

    expect(result[1].score).toBeGreaterThanOrEqual(result[2].score);
  });

  it("respects the repository limit", () => {
    const result = getTopRepositories(
      repositories,
      repositoryQuality,
      currentTime,
      2,
    );

    expect(result).toHaveLength(2);
    expect(result[0].repository.name).toBe("strong-project");
    expect(result[1].repository.name).toBe("medium-project");
  });

  it("returns an empty array when there are no repositories", () => {
    const result = getTopRepositories([], [], currentTime);

    expect(result).toEqual([]);
  });

  it("includes README information", () => {
    const result = getTopRepositories(
      repositories,
      repositoryQuality,
      currentTime,
    );

    const strongProject = result.find(
      (item) => item.repository.name === "strong-project",
    );

    const weakProject = result.find(
      (item) => item.repository.name === "weak-project",
    );

    expect(strongProject?.hasReadme).toBe(true);
    expect(weakProject?.hasReadme).toBe(false);
  });
});

describe("calculateRepositoryHealth", () => {
  const currentTime = new Date("2026-09-25T12:00:00Z").getTime();

  it("calculates repository health correctly", () => {
    const repositories: GitHubRepository[] = [
      {
        id: 1,
        name: "active-project",
        description: "Active project",
        html_url: "https://github.com/test/active-project",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 1,
        updated_at: "2026-09-20T12:00:00Z",
      },
      {
        id: 2,
        name: "stale-project",
        description: null,
        html_url: "https://github.com/test/stale-project",
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2025-01-01T12:00:00Z",
      },
    ];

    const repositoryQuality = [
      {
        repository: "active-project",
        hasReadme: true,
      },
      {
        repository: "stale-project",
        hasReadme: false,
      },
    ];

    const result = calculateRepositoryHealth({
      repositories,
      repositoryQuality,
      currentTime,
    });

    expect(result.activeRepositories).toBe(1);
    expect(result.staleRepositories).toBe(1);
    expect(result.repositoriesWithoutReadme).toBe(1);
    expect(result.repositoriesWithoutDescription).toBe(1);

    expect(result.healthScore).toBe(50);
  });

  it("returns 100 for a fully healthy repositories profile", () => {
    const repositories: GitHubRepository[] = [
      {
        id: 1,
        name: "project-one",
        description: "Project one",
        html_url: "https://github.com/test/project-one",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 1,
        updated_at: "2026-09-24T12:00:00Z",
      },
      {
        id: 2,
        name: "project-two",
        description: "Project two",
        html_url: "https://github.com/test/project-two",
        language: "JavaScript",
        stargazers_count: 3,
        forks_count: 1,
        updated_at: "2026-09-23T12:00:00Z",
      },
    ];

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

    const result = calculateRepositoryHealth({
      repositories,
      repositoryQuality,
      currentTime,
    });

    expect(result.healthScore).toBe(100);
    expect(result.activeRepositories).toBe(2);
    expect(result.staleRepositories).toBe(0);
    expect(result.repositoriesWithoutReadme).toBe(0);
    expect(result.repositoriesWithoutDescription).toBe(0);
  });

  it("handles an empty repository list", () => {
    const result = calculateRepositoryHealth({
      repositories: [],
      repositoryQuality: [],
      currentTime,
    });

    expect(result).toEqual({
      healthScore: 0,
      activeRepositories: 0,
      staleRepositories: 0,
      repositoriesWithoutReadme: 0,
      repositoriesWithoutDescription: 0,
    });
  });
});

describe("generateProfileSummary", () => {
  it("generates strengths for a strong profile", () => {
    const bestRepository: GitHubRepository = {
      id: 1,
      name: "github-profile-analyzer",
      description: "GitHub profile analytics application",
      html_url: "https://github.com/github-profile-analyzer",
      language: "TypeScript",
      stargazers_count: 10,
      forks_count: 3,
      updated_at: "2026-09-24T12:00:00Z",
    };

    const result = generateProfileSummary({
      topLanguage: "TypeScript",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vitest",
      ],
      profileScore: 90,
      healthScore: 100,
      bestRepository,
      daysSinceLastActivity: 1,
      repositoriesWithoutReadme: 0,
      repositoriesWithoutDescription: 0,
    });

    expect(result.primaryLanguage).toBe("TypeScript");
    expect(result.technologiesCount).toBe(5);
    expect(result.profileScore).toBe(90);
    expect(result.healthScore).toBe(100);
    expect(result.bestProject).toBe("github-profile-analyzer");

    expect(result.strengths).toContain("Active repository maintenance");
    expect(result.strengths).toContain("Good README coverage");
    expect(result.strengths).toContain("All repositories have descriptions");
    expect(result.strengths).toContain("Diverse technology stack");
    expect(result.strengths).toContain("Strong overall profile completeness");
    expect(result.strengths).toContain("Strong repository health");

    expect(result.improvements).toEqual([]);
  });

  it("generates improvements for a weaker profile", () => {
    const result = generateProfileSummary({
      topLanguage: "JavaScript",
      technologies: ["React", "JavaScript"],
      profileScore: 45,
      healthScore: 40,
      bestRepository: null,
      daysSinceLastActivity: 120,
      repositoriesWithoutReadme: 2,
      repositoriesWithoutDescription: 3,
    });

    expect(result.primaryLanguage).toBe("JavaScript");
    expect(result.technologiesCount).toBe(2);
    expect(result.bestProject).toBeNull();

    expect(result.improvements).toContain("Update repositories more regularly");
    expect(result.improvements).toContain("Add README files to 2 repositories");
    expect(result.improvements).toContain("Add descriptions to 3 repositories");
    expect(result.improvements).toContain(
      "Show a broader technology stack in public projects",
    );
    expect(result.strengths).not.toContain(
      "Strong overall profile completeness",
    );
    expect(result.strengths).not.toContain("Strong repository health");
  });

  it("handles a minimal profile", () => {
    const result = generateProfileSummary({
      topLanguage: null,
      technologies: [],
      profileScore: 0,
      healthScore: 0,
      bestRepository: null,
      daysSinceLastActivity: null,
      repositoriesWithoutReadme: 0,
      repositoriesWithoutDescription: 0,
    });

    expect(result.primaryLanguage).toBe("Unknown");
    expect(result.technologiesCount).toBe(0);
    expect(result.profileScore).toBe(0);
    expect(result.healthScore).toBe(0);
    expect(result.bestProject).toBeNull();

    expect(result.improvements).toContain("Update repositories more regularly");
    expect(result.improvements).toContain(
      "Show a broader technology stack in public projects",
    );
  });
});
