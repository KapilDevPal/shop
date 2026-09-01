import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ExternalLink, MessageCircle } from "lucide-react";
import Nav from "../components/Nav.jsx";
import { tokens } from "../tokens.js";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | Indian Space Hub Store";
  }, []);

  const faqs = [
    {
      q: "How do I know when a product will be available to buy?",
      a: "Register your interest on any product page. Once it crosses its community goal, you'll receive an email with pre-order details.",
    },
    {
      q: "Can I choose my size before registering interest?",
      a: "Yes! Select your preferred size on the product card or product page, then click 'Express Interest'. Your size preference is saved with your registration.",
    },
    {
      q: "Do I need to pay to register interest?",
      a: "No, registering interest is completely free. You only pay when the product is officially launched and you choose to purchase.",
    },
    {
      q: "Is my information shared with anyone?",
      a: "No. We only use your email to notify you about the product you registered for. Read our Privacy Policy for full details.",
    },
  ];

  return (
    <div style={{ background: tokens.paper, minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] mb-10" style={{ color: tokens.inkMuted }}>
          <Link to="/" style={{ color: tokens.inkMuted }} className="hover:text-stone-800">Store</Link>
          <span>/</span>
          <span style={{ color: tokens.ink }}>Contact</span>
        </nav>

        <h1
          className="text-[2.2rem] mb-4"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink, letterSpacing: "-0.02em" }}
        >
          Get in Touch
        </h1>
        <p className="text-[15px] mb-12 max-w-xl" style={{ color: tokens.inkMuted, lineHeight: 1.7 }}>
          We'd love to hear from you — whether it's a product question, partnership idea, or just saying hello.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Email card */}
          <a
            href="mailto:crew@indianspacehub.com"
            className="flex flex-col gap-4 p-7 rounded-2xl border transition-all hover:shadow-md group"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: tokens.accentSoft }}>
              <Mail size={22} style={{ color: tokens.accent }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider mb-1" style={{ color: tokens.inkFaint }}>
                Email Support
              </p>
              <p className="text-[16px] font-bold group-hover:underline" style={{ color: tokens.ink }}>
                crew@indianspacehub.com
              </p>
              <p className="text-[13px] mt-1.5" style={{ color: tokens.inkMuted }}>
                Product queries, bulk orders, and partnerships.
              </p>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/isro.unoffical"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-4 p-7 rounded-2xl border transition-all hover:shadow-md group"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: tokens.paperSoft }}>
              <Instagram size={22} style={{ color: tokens.ink }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider mb-1" style={{ color: tokens.inkFaint }}>
                Instagram
              </p>
              <p className="text-[16px] font-bold group-hover:underline" style={{ color: tokens.ink }}>
                @isro.unoffical
              </p>
              <p className="text-[13px] mt-1.5" style={{ color: tokens.inkMuted }}>
                Follow active mission drops and behind the scenes.
              </p>
            </div>
          </a>

          {/* LinkedIn Card */}
          <a
            href="https://www.linkedin.com/company/isro-indian-space-hub/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-4 p-7 rounded-2xl border transition-all hover:shadow-md group"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: tokens.paperSoft }}>
              <Linkedin size={22} style={{ color: tokens.ink }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider mb-1" style={{ color: tokens.inkFaint }}>
                LinkedIn
              </p>
              <p className="text-[16px] font-bold group-hover:underline" style={{ color: tokens.ink }}>
                Indian Space Hub
              </p>
              <p className="text-[13px] mt-1.5" style={{ color: tokens.inkMuted }}>
                Connect with our team & space community updates.
              </p>
            </div>
          </a>
        </div>


        {/* FAQ */}
        <section>
          <h2 className="text-[1.5rem] mb-6"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border" style={{ background: tokens.card, borderColor: tokens.line }}>
                <p className="text-[14.5px] font-bold mb-2" style={{ color: tokens.ink }}>{item.q}</p>
                <p className="text-[13.5px]" style={{ color: tokens.inkMuted, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: tokens.line }}>
          <p className="text-[13px]" style={{ color: tokens.inkMuted }}>
            Still need help?{" "}
            <a href="mailto:crew@indianspacehub.com" className="font-semibold" style={{ color: tokens.accent }}>
              Email our crew
            </a>{" "}
            and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
