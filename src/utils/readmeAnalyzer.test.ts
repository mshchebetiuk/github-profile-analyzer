import { describe, expect, it } from "vitest";
import { analyzeReadme } from "./readmeAnalyzer";

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
});
