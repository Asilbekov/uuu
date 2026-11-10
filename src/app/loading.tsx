export default function Loading() {
  return (
    <main className="min-h-dvh bg-[#f7f5f0] p-5" aria-label="Загрузка" aria-busy="true">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="flex items-center justify-between py-3">
          <div className="h-9 w-24 rounded-xl bg-black/10" />
          <div className="h-9 w-36 rounded-full bg-black/5" />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="overflow-hidden rounded-3xl border border-black/5 bg-white">
              <div className="h-36 bg-black/5" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 rounded bg-black/10" />
                <div className="h-3 w-full rounded bg-black/5" />
                <div className="h-3 w-2/3 rounded bg-black/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
