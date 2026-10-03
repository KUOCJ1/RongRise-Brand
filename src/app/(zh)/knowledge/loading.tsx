export default function KnowledgeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="h-6 w-24 rounded-full bg-white/20 animate-pulse mb-4" />
          <div className="h-10 w-64 rounded-lg bg-white/20 animate-pulse mb-4" />
          <div className="h-5 w-96 max-w-full rounded-lg bg-white/15 animate-pulse" />
        </div>
      </section>

      {/* Filter skeleton */}
      <section className="bg-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
          <div className="h-10 w-full rounded-lg bg-bg-alt animate-pulse mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-bg-alt animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid skeleton */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-36 rounded-lg bg-bg-alt mb-4" />
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-16 rounded-full bg-bg-alt" />
                  <div className="h-4 w-16 rounded bg-bg-alt" />
                </div>
                <div className="h-5 w-full rounded bg-bg-alt mb-2" />
                <div className="h-5 w-3/4 rounded bg-bg-alt mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-bg-alt" />
                  <div className="h-4 w-5/6 rounded bg-bg-alt" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
