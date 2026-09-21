import type { LanguageStatistic } from "@/types/github";

type LanguageStatisticsProps = {
  statistics: LanguageStatistic[];
};

export default function LanguageStatistics({
  statistics,
}: LanguageStatisticsProps) {
  if (statistics.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Language Statistics</h2>

      <div className="space-y-4">
        {statistics.map((item) => (
          <div
            key={item.language}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">{item.language}</span>

              <span className="text-sm text-gray-600">{item.percentage}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {item.count} repositories
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
