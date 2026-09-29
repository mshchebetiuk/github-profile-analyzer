import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGitHub } from "./githubApi";

describe("fetchGitHub", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns response when GitHub request succeds", async () => {
    const response = new Response(
      JSON.stringify({
        login: "test-user",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await fetchGitHub(
      "https://api.github.com/users/test-user",
      {},
    );

    expect(result.status).toBe(200);

    await expect(result.json()).resolves.toEqual({
      login: "test-user",
    });
  });

  it("throws 404 error when GitHub user is not found", async () => {
    const response = new Response(
      JSON.stringify({
        message: "Not Found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      fetchGitHub("https://api.github.com/users/unknown-user", {}),
    ).rejects.toMatchObject({
      name: "GitHubApiError",
      message: "GitHub user not found.",
      status: 404,
    });
  });

  it("throw 429 error when GitHub rate limit is exceeded", async () => {
    const response = new Response(
      JSON.stringify({
        message: "API rate limit exceeded",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": "1893456000",
        },
      },
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      fetchGitHub("https://api.github.com/users/test-user", {}),
    ).rejects.toMatchObject({
      name: "GitHubApiError",
      status: 429,
    });
  });

  it("throws 500 error when GitHub request fails", async () => {
    const response = new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      fetchGitHub("https://api.github.com/users/test-user", {}),
    ).rejects.toMatchObject({
      name: "GitHubApiError",
      message: "Internal Server Error",
      status: 500,
    });
  });
});
