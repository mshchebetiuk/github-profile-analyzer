type ProfileSummaryData = {
  primaryLanguage: string;
  technologiesCount: number;
  profileScore: number;
  healthScore: number;
  bestProject: string | null;
  strengths: string[];
  improvements: string[];
};

type ProfileSummaryProps = {
  summary: ProfileSummaryData;
};

export default function ProfileSummary({ summary }: ProfileSummaryProps) {
  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <div>
        <h2 className="text-2xl font-bold">Developer Profile Summary</h2>

        <p className="mt-1 text-sm text-gray-500">
          Summary generated from public GitHub profile analytics.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Primary language</p>

          <p className="mt-1 font-semibold">{summary.primaryLanguage}</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Technologies</p>

          <p className="mt-1 font-semibold">{summary.technologiesCount}</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Profile Score</p>

          <p className="mt-1 font-semibold">{summary.profileScore}/100</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Repository health</p>

          <p className="mt-1 font-semibold">{summary.healthScore}/100</p>
        </div>
      </div>

      {summary.bestProject && (
        <div className="mt-6 rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Best project</p>

          <p className="mt-1 font-semibold">{summary.bestProject}</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Strengths</h3>

          {summary.strengths.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {summary.strengths.map((strength) => (
                <li key={strength} className="flex gap-2 text-sm">
                  <span aria-hidden="true">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No major strengths detected yet.
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Areas to Improve</h3>

          {summary.improvements.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {summary.improvements.map((improvement) => (
                <li key={improvement} className="flex gap-2 text-sm">
                  <span aria-hidden="true">→</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No major improvements detected.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
