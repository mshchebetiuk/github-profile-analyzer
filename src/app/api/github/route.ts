import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      user,
      repositories,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
