type RecommendationsProps = {
  recommendations: string[];
};

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Recommendations</h2>

      <div className="rounded-xl border border-gray-200 p-6">
        <ul className="space-y-3">
          {recommendations.map((recommendation) => (
            <li key={recommendation} className="flex gap-3 text-gray-700">
              <span></span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
