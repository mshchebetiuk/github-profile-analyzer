type ProfileScoreProps = {
  score: number;
};

export default function ProfileScore({ score }: ProfileScoreProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Profile Score</h2>

      <div className="rounded-xl border border-gray-200 p-6">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">{score}</span>

          <span className="mb-1 text-lg text-gray-500">/ 100</span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{
              width: `${score}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
