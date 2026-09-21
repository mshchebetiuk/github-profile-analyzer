type ActivityProps = {
  activityStatus: string;
  daysSinceLastActivity: number | null;
  recentlyActiveRepositories: number;
};

export default function Activity({
  activityStatus,
  daysSinceLastActivity,
  recentlyActiveRepositories,
}: ActivityProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Activity</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Activity Status</p>

          <p className="mt-2 text-2xl font-bold">{activityStatus}</p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Last Activity</p>

          <p className="mt-2 text-xl font-bold">
            {daysSinceLastActivity !== null
              ? `${daysSinceLastActivity} days ago`
              : "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Active Repositories</p>

          <p className="mt-2 text-xl font-bold">{recentlyActiveRepositories}</p>
        </div>
      </div>
    </section>
  );
}
