type TechnologiesProps = {
  technologies: string[];
};

export default function Technologies({ technologies }: TechnologiesProps) {
  if (technologies.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Technologies</h2>

      <div className="flex flex-wrap gap-3">
        {technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
          >
            {technology}
          </span>
        ))}
      </div>
    </section>
  );
}
