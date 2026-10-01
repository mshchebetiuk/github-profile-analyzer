import { describe, expect, it } from "vitest";
import { analyzeReadme, getReadmeRecommendations } from "./readmeAnalyzer";

describe("analyzeReadme", () => {
  it("return zero when README is missing", () => {
    const result = analyzeReadme(null);

    expect(result.hasReadme).toBe(false);
    expect(result.score).toBe(0);
  });

  it("returns maximum score for complete README", () => {
    const content = `
# GitHub Profile Analyzer

A web application that analyzes public GitHub
profiles, repositories, technologies, activity,
statistics, and repository documentation quality.

## Installation

Run pnpm install.

## Usage

Run pnpm dev.

## Technologies

Next.js, React, TypeScript.

## License

MIT License.
        `;

    const result = analyzeReadme(content);

    expect(result).toMatchObject({
      hasReadme: true,
      hasDescription: true,
      hasInstallation: true,
      hasUsage: true,
      hasTechnologies: true,
      hasLicense: true,
      score: 100,
    });
  });

  it("returns recommendations for missing README sections", () => {
    const analysis = analyzeReadme(`
# Test Project

This is a detailed project description that explains
what the application does and provides enough information
about the purpose of the project.

## Usage

Run the application and open it in the browser.
    `);

    const recommendations = getReadmeRecommendations(analysis);

    expect(recommendations).toContain("Add an Installation or Setup section.");
    expect(recommendations).toContain(
      "Add a Technologies or Tech Stack section.",
    );
    expect(recommendations).toContain("Add a License section.");
    expect(recommendations).not.toContain("Add a Usage section with examples.");
  });

  it("returns no recommendations for a complete README", () => {
    const analysis = analyzeReadme(`
# Test Project

This is a detailed description of the project that contains
enough information to explain what the application does
and why it exists.

## Installation

Install dependencies.

## Usage

Run the application.

## Technologies

TypeScript and Next.js.

## License

MIT
    `);

    expect(getReadmeRecommendations(analysis)).toEqual([]);
  });
});
