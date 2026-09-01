import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import { tokens } from "../tokens.js";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Indian Space Hub Store";
  }, []);

  const sections = [
    {
      title: "Information We Collect",
      body: `When you register your interest in a product, we collect your name, email address, and optionally your phone number and preferred size. We use this information solely to notify you when a product drop is unlocked and to manage our pre-registration list.`,
    },
    {
      title: "How We Use Your Information",
      body: `Your information is used to: (1) send you notifications about product drop launches; (2) understand which sizes and products have the most demand; and (3) communicate updates about Indian Space Hub Store. We do not sell or rent your personal information to third parties.`,
    },
    {
      title: "Cookies & Analytics",
      body: `This store may use standard web cookies for session management and page analytics. No intrusive tracking or advertising cookies are used. You can disable cookies in your browser settings at any time without affecting core store functionality.`,
    },
    {
      title: "Data Retention",
      body: `We retain your interest registration data for up to 24 months from the date of submission, or until the associated product drop is completed. You may request deletion of your data at any time by emailing crew@indianspacehub.com.`,
    },
    {
      title: "Google Shopping & Third-Party Services",
      body: `Our products are listed on Google Shopping. By using this store, certain product information (name, price, images) may be publicly indexed by Google. No personal information is shared with Google Shopping. We use Google Search Console for website performance monitoring.`,
    },
    {
      title: "Your Rights",
      body: `You have the right to: access the personal data we hold about you; request correction or deletion of your data; withdraw consent to marketing communications at any time. To exercise these rights, contact us at crew@indianspacehub.com.`,
    },
    {
      title: "Contact Us",
      body: `If you have any questions about this Privacy Policy, please contact us at:\n\nEmail: crew@indianspacehub.com\nWebsite: https://indianspacehub.com\nStore: https://shop.indianspacehub.com`,
    },
  ];

  return (
    <div style={{ background: tokens.paper, minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] mb-10" style={{ color: tokens.inkMuted }}>
          <Link to="/" style={{ color: tokens.inkMuted }} className="hover:text-stone-800">Store</Link>
          <span>/</span>
          <span style={{ color: tokens.ink }}>Privacy Policy</span>
        </nav>

        <h1
          className="text-[2.2rem] mb-3"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink, letterSpacing: "-0.02em" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[14px] mb-10" style={{ color: tokens.inkMuted }}>
          Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[17px] font-bold mb-3" style={{ color: tokens.ink }}>
                {i + 1}. {s.title}
              </h2>
              <p className="text-[14.5px] whitespace-pre-line" style={{ color: tokens.inkMuted, lineHeight: 1.8 }}>
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: tokens.line }}>
          <p className="text-[13px]" style={{ color: tokens.inkMuted }}>
            Questions? Email us at{" "}
            <a href="mailto:crew@indianspacehub.com" className="font-semibold" style={{ color: tokens.accent }}>
              crew@indianspacehub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
