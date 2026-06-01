import Script from "next/script";
import testimonials from "@/data/testimonials.json";

export default function ReviewSchema() {
  const avgRating =
    testimonials.testimonials.reduce((sum, t) => sum + t.rating, 0) /
    testimonials.testimonials.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "ProfessionalService",
      name: "榕耀管顧 RongRise Consulting",
      description: "企業 AI 轉型、人才策略、ESG 永續顧問",
    },
    ratingValue: avgRating.toFixed(1),
    bestRating: "5",
    ratingCount: testimonials.testimonials.length,
    reviewCount: testimonials.testimonials.length,
  };

  return (
    <Script
      id="review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
