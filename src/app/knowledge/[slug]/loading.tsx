export default function ArticleLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="h-5 w-32 rounded-full bg-white/20 animate-pulse mb-6" />
          <div className="flex gap-3 mb-4">
            <div className="h-6 w-16 rounded-full bg-white/20 animate-pulse" />
            <div className="h-5 w-20 rounded bg-white/15 animate-pulse" />
            <div className="h-5 w-24 rounded bg-white/15 animate-pulse" />
          </div>
          <div className="h-9 w-full max-w-lg rounded-lg bg-white/20 animate-pulse mb-3" />
          <div className="h-7 w-48 rounded-lg bg-white/15 animate-pulse" />
        </div>
      </section>

      {/* Article body skeleton */}
      <section className="py-8 md:py-12">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Tags */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 rounded-full bg-bg-alt animate-pulse" />
            ))}
          </div>

          {/* Content lines */}
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-full rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-full rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-bg-alt animate-pulse" />
            <div className="h-6 w-40 rounded bg-bg-alt animate-pulse mt-8" />
            <div className="h-4 w-full rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-full rounded bg-bg-alt animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-bg-alt animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
