import type { GitHubRepository, RepositoryQualityResult } from "@/types/github";
import { getReadmeRecommendations } from "@/utils/readmeAnalyzer";
import type { RepositoryAssessment } from "@/utils/githubAnalytics";

type RepositoryDetailsProps = {
  repository: GitHubRepository;
  score: number;
  hasReadme: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  readmeAnalysis: RepositoryQualityResult | null;
  assessment: RepositoryAssessment;
};

type ScoreBreakdown = {
  readme: number;
  description: number;
  language: number;
  stars: number;
  forks: number;
  activity: number;
  total: number;
};

export default function RepositoryDetails({
  repository,
  score,
  hasReadme,
  breakdown,
  readmeAnalysis,
  assessment,
  onClose,
}: RepositoryDetailsProps) {
  const metrics = [
    { label: "README", value: breakdown.readme, max: 20 },
    { label: "Description", value: breakdown.description, max: 10 },
    { label: "Language", value: breakdown.language, max: 10 },
    { label: "Stars", value: breakdown.stars, max: 20 },
    { label: "Forks", value: breakdown.forks, max: 20 },
    { label: "Activity", value: breakdown.activity, max: 20 },
  ];

  const readmeRecommendations = readmeAnalysis
    ? getReadmeRecommendations(readmeAnalysis)
    : [];

  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Repository Analytics</p>
          <h2 className="mt-1 text-2xl font-bold">{repository.name}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      <p className="mt-4 text-gray-600">
        {repository.description ?? "No description provided."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Project score</p>
          <p className="mt-1 text-xl font-bold">{score} pts</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Language</p>
          <p className="mt-1 font-semibold">
            {repository.language ?? "Unknown"}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Stars</p>
          <p className="mt-1 text-xl font-bold">
            {repository.stargazers_count}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Forks</p>
          <p className="mt-1 text-xl font-bold">{repository.forks_count}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          README: {hasReadme ? "Yes" : "No"}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          Updated {new Date(repository.updated_at).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Score Breakdown</h3>

        <p className="mt-1 text-sm text-gray-500">
          How the repository score is calculated.
        </p>

        <div className="mt-5 space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{metric.label}</span>
                <span className="font-medium">
                  {metric.value}/{metric.max}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {readmeAnalysis && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">README Quality</h3>

              <p className="mt-1 text-sm text-gray-500">
                Documentation quality based on README structure.
              </p>
            </div>

            <span className="text-xl font-bold">
              {readmeAnalysis.readmeScore}/100
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "README",
                passed: readmeAnalysis.hasReadme,
              },
              {
                label: "Description",
                passed: readmeAnalysis.hasDescription,
              },
              {
                label: "Installation",
                passed: readmeAnalysis.hasInstallation,
              },
              {
                label: "Usage",
                passed: readmeAnalysis.hasUsage,
              },
              {
                label: "Technologies",
                passed: readmeAnalysis.hasTechnologies,
              },
              {
                label: "License",
                passed: readmeAnalysis.hasLicense,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <span className="text-sm">{item.label}</span>

                <span
                  className={
                    item.passed
                      ? "font-medium text-green-600"
                      : "font-medium text-gray-400"
                  }
                >
                  {item.passed ? "✓ Found" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {readmeAnalysis && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">README Recommendations</h3>

          <p className="mt-1 text-sm text-gray-500">
            Suggestions for improving repository documentation.
          </p>

          {readmeRecommendations.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {readmeRecommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="rounded-lg bg-gray-50 p-3 text-sm"
                >
                  {recommendation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm font-medium text-green-600">
              ✓ README includes all recommended sections.
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Repository Assessment</h3>

        <p className="mt-1 text-sm text-gray-500">
          Strengths and areas that could improve this repository.
        </p>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-green-600">Strengths</h4>

            {assessment.strengths.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {assessment.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="rounded-lg bg-gray-50 p-3 text-sm"
                  >
                    ✓ {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No strengths detected yet.
              </p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Areas to improve</h4>

            {assessment.weaknesses.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {assessment.weaknesses.map((weakness) => (
                  <li
                    key={weakness}
                    className="rounded-lg bg-gray-50 p-3 text-sm"
                  >
                    • {weakness}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-green-600">
                ✓ No major improvements detected.
              </p>
            )}
          </div>
        </div>
      </div>

      <a
        href={repository.html_url}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block font-medium underline"
      >
        View repository on GitHub
      </a>
    </section>
  );
}
