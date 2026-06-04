"use client";

import testimonials from "@/data/testimonials-en.json";

export default function TestimonialsEnSection() {
  return (
    <section className="section bg-white">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">Client Testimonials</span>
          <h2 className="heading-section text-dark mt-4">What Our Partners Say</h2>
          <div className="brand-divider brand-divider-center mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.testimonials.map((item) => (
            <div
              key={item.id}
              className="card relative"
            >
              <div className="absolute top-6 right-6 text-4xl text-primary/10 font-serif leading-none select-none">
                &ldquo;
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i} className="text-tertiary text-sm">★</span>
                ))}
              </div>

              <blockquote className="text-text-secondary text-body leading-relaxed mb-6 relative z-10">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{item.name}</p>
                  <p className="text-text-secondary text-xs">{item.role} · {item.company}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-medium whitespace-nowrap">
                    {item.project}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
