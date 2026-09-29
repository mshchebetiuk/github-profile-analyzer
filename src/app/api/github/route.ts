import { NextRequest, NextResponse } from "next/server";
import {
  analyzeRepositoryQuality,
  detectTechnologies,
  fetchGitHub,
  GitHubApiError,
} from "@/services/githubApi";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username is required." },
      { status: 400 },
    );
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const userResponse = await fetchGitHub(
      `https://api.github.com/users/${username}`,
      headers,
    );

    const user = await userResponse.json();

    const repositoriesResponse = await fetchGitHub(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`,
      headers,
    );

    const repositories = await repositoriesResponse.json();

    const technologies = await detectTechnologies(
      username,
      repositories,
      headers,
    );

    const repositoryQuality = await analyzeRepositoryQuality(
      username,
      repositories,
      headers,
    );

    return NextResponse.json({
      user,
      repositories,
      technologies,
      repositoryQuality,
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}
