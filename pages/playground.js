export default function Playground() {
  const colors = [
    "accent1",
    "accent2",
    "accent7",
    "success",
    "cyan",
    "blue500",
    "yellow100",
    "gray-50",
    "gray-500",
    "gray-700"
  ];

  const fontSizes = ["5xl", "6xl", "7xl", "8xl"];

  const shadows = ["small", "medium", "2xl"];

  return (
    <main className="min-h-screen bg-gray-50 p-10 space-y-10">
      <h1 className="text-4xl font-bold mb-6">Tailwind Playground</h1>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Colors</h2>
        <div className="flex flex-wrap gap-4">
          {colors.map(c => (
            <div
              key={c}
              className={`w-32 h-16 rounded flex items-center justify-center text-white font-bold bg-${c}`}
            >
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* Font Sizes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Font Sizes</h2>
        <div className="space-y-4">
          {fontSizes.map(f => (
            <p key={f} className={`text-${f} font-bold`}>
              {f} size text
            </p>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Shadows</h2>
        <div className="flex flex-wrap gap-6">
          {shadows.map(s => (
            <div
              key={s}
              className={`w-40 h-20 bg-white rounded p-4 shadow-${s} flex items-center justify-center`}
            >
              {s} shadow
            </div>
          ))}
        </div>
      </section>

      {/* Letter spacing & line height */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Letter spacing & Line height</h2>
        <p className="tracking-tighter leading-tight text-xl">
          This text uses tracking-tighter (-0.04em) and line-tight (1.2)
        </p>
      </section>

      {/* Typography plugin example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography Plugin</h2>
        <article className="prose lg:prose-xl">
          <h3>Example Heading</h3>
          <p>
            This paragraph is styled using the Tailwind Typography plugin. You can
            use all the <strong>prose</strong> classes for beautiful readable text.
          </p>
          <ul>
            <li>List item one</li>
            <li>List item two</li>
            <li>List item three</li>
          </ul>
        </article>
      </section>
    </main>
  );
}