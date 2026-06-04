"use client";

import { useState } from "react";

export default function NewsletterEnSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="section bg-white">
      <div className="section-inner">
        <div className="max-w-2xl mx-auto text-center">
          <span className="tag mb-4">Newsletter</span>
          <h2 className="heading-section text-dark mt-4">Stay Updated on AI & ESG Trends</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 mb-8">
            Get curated insights on AI transformation, talent strategy, and ESG sustainability delivered to your inbox. No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-600 text-sm mt-3">✓ Thank you for subscribing!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm mt-3">Please enter a valid email address.</p>
          )}
        </div>
      </div>
    </section>
  );
}
