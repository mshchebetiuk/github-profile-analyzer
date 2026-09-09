import { NextRequest, NextResponse } from "next/server";

type GitHubRepository = {
  name: string;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type GitHubContentFile = {
  content: string;
};

async function detectTechnologies(
  username: string,
  repositories: GitHubRepository[],
  headers: HeadersInit,
) {
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

      if ("react" in dependencies) technologies.add("React");
      if ("next" in dependencies) technologies.add("Next.js");
      if ("typescript" in dependencies) technologies.add("TypeScript");

      if ("@prisma/client" in dependencies || "prisma" in dependencies)
        technologies.add("Prisma");
      if ("zod" in technologies) technologies.add("Zod");
      if ("tailwind" in technologies) technologies.add("Tailwind CSS");

      if ("@tanstack/react-query" in dependencies)
        technologies.add("TanStack Query");
      if ("react-hook-form" in dependencies)
        technologies.add("React Hook Form");
    } catch {
      continue;
    }
  }

  return Array.from(technologies);
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 },
    );
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers },
    );

    if (userResponse.status === 404) {
      return NextResponse.json(
        { message: "GitHub user not found" },
        { status: 404 },
      );
    }

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Failed to load GitHub user" },
        { status: userResponse.status },
      );
    }

    const user = await userResponse.json();

    const repositoriesResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`,
      { headers },
    );

    if (!repositoriesResponse.ok) {
      return NextResponse.json(
        { message: "Failed to load repositories" },
        { status: repositoriesResponse.status },
      );
    }

    const repositories = await repositoriesResponse.json();

    const technologies = await detectTechnologies(
      username,
      repositories,
      headers,
    );

    return NextResponse.json({
      user,
      repositories,
      technologies,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
