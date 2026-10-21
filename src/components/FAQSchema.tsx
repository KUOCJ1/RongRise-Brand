
interface FAQSchemaProps {
  faq: {
    category: string;
    items: { q: string; a: string }[];
  }[];
}

export default function FAQSchema({ faq }: FAQSchemaProps) {
  const faqItems = faq.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    }))
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };

  return (
    <script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}></script>
  );
}
