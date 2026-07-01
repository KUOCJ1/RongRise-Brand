import Link from "next/link";
import faqData from "@/data/faq-en.json";

export default function FAQEnSection() {
  return (
    <section className="section bg-surface">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">FAQ</span>
          <h2 className="heading-section text-text-primary mt-4">Frequently Asked Questions</h2>
          <div className="brand-divider brand-divider-center mt-4" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqData.faq.map((category, ci) => (
            <div key={ci}>
              <h3 className="heading-subsection text-text-primary mb-4">{category.category}</h3>
              <div className="space-y-4">
                {category.items.map((item, ii) => (
                  <div key={ii} className="card">
                    <p className="font-semibold text-text-primary mb-2">{item.q}</p>
                    <p className="text-text-secondary text-body">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
