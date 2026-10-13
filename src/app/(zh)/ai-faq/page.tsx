import AIFaqClient from "@/components/AIFaqClient";
import faqData from "@/data/ai-faq.json";
import type { AIFaqData } from "@/components/AIFaqClient";

export default function AIFaqPage() {
  return <AIFaqClient data={faqData as AIFaqData} />;
}
