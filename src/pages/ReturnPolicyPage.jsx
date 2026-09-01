import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, Truck, Mail, CheckCircle2 } from "lucide-react";
import Nav from "../components/Nav.jsx";
import { tokens } from "../tokens.js";

export default function ReturnPolicyPage() {
  useEffect(() => {
    document.title = "Return & Refund Policy | Indian Space Hub Store";
  }, []);

  const policies = [
    {
      icon: <RotateCcw size={22} style={{ color: tokens.accent }} />,
      title: "7-Day Return & Replacement Window",
      body: "We offer a hassle-free 7-day return and replacement policy from the date of delivery. If your product is damaged, defective, misprinted, or incorrect in size, we will replace it or issue a full refund at zero additional cost to you.",
    },
    {
      icon: <Truck size={22} style={{ color: tokens.accent }} />,
      title: "Free Return Pickup & Reverse Shipping",
      body: "For defective, damaged, or wrong items, reverse shipping is completely free. Our courier partner will pick up the package from your doorstep across India.",
    },
    {
      icon: <ShieldCheck size={22} style={{ color: tokens.accent }} />,
      title: "Pre-Order & Interest Registration Cancellation",
      body: "Since our products unlock through community interest goals, you pay zero money when registering interest. If you pre-order after a drop unlocks, you can cancel your order anytime before it is dispatched for a 100% instant refund.",
    },
    {
      icon: <CheckCircle2 size={22} style={{ color: tokens.accent }} />,
      title: "Refund Timeline (5–7 Business Days)",
      body: "Once your returned item is inspected at our facility, refunds are processed within 24 hours. Refunds will reflect in your original payment method (UPI, Bank Account, Credit/Debit Card) within 5 to 7 business days.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Email Us",
      desc: "Send an email to crew@indianspacehub.com with your order ID, photos of the product/issue, and your preference (Replacement or Refund).",
    },
    {
      step: "02",
      title: "Reverse Pickup",
      desc: "Our logistics team will arrange a free reverse pickup from your delivery address within 24–48 hours.",
    },
    {
      step: "03",
      title: "Inspection & Resolution",
      desc: "Upon receiving the item, we will immediately dispatch a brand-new replacement or initiate a full refund to your account.",
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
          <span style={{ color: tokens.ink }}>Return & Refund Policy</span>
        </nav>

        <h1
          className="text-[2.2rem] mb-4"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink, letterSpacing: "-0.02em" }}
        >
          Return & Refund Policy
        </h1>
        <p className="text-[15px] mb-12 max-w-2xl" style={{ color: tokens.inkMuted, lineHeight: 1.7 }}>
          At Indian Space Hub Store, customer satisfaction is our top priority. We stand behind the quality of our ISRO-inspired merchandise, scale models, and space gear.
        </p>

        {/* Policy Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {policies.map((p, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border flex flex-col gap-3"
              style={{ background: tokens.card, borderColor: tokens.line }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                style={{ background: tokens.accentSoft }}
              >
                {p.icon}
              </div>
              <h3 className="text-[16px] font-bold" style={{ color: tokens.ink }}>
                {p.title}
              </h3>
              <p className="text-[13.5px]" style={{ color: tokens.inkMuted, lineHeight: 1.7 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* How to Initiate Return */}
        <section className="mb-16 p-8 rounded-3xl border" style={{ background: tokens.card, borderColor: tokens.line }}>
          <h2
            className="text-[1.5rem] mb-6"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink }}
          >
            How to Initiate a Return or Exchange
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-[24px] font-black" style={{ color: tokens.accent }}>
                  {s.step}
                </span>
                <h4 className="text-[15px] font-bold" style={{ color: tokens.ink }}>
                  {s.title}
                </h4>
                <p className="text-[13px]" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions */}
        <section className="mb-16">
          <h3 className="text-[1.25rem] font-bold mb-4" style={{ color: tokens.ink }}>
            Return Conditions
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-[14px]" style={{ color: tokens.inkMuted, lineHeight: 1.7 }}>
            <li>Products must be unused, unwashed, and in their original packaging with tags intact.</li>
            <li>Return requests must be submitted within 7 days of receiving the order.</li>
            <li>Custom or personalized mission drops (if specified) are eligible for replacement in case of defect only.</li>
            <li>For size exchanges, we provide 1 free size exchange per order.</li>
          </ul>
        </section>

        {/* Contact CTA */}
        <div
          className="p-8 rounded-2xl border text-center flex flex-col items-center gap-4"
          style={{ background: tokens.paperSoft, borderColor: tokens.line }}
        >
          <Mail size={28} style={{ color: tokens.accent }} />
          <div>
            <h3 className="text-[18px] font-bold mb-1" style={{ color: tokens.ink }}>
              Need Help with a Return?
            </h3>
            <p className="text-[14px]" style={{ color: tokens.inkMuted }}>
              Our support crew is ready to assist you. Email us directly at:
            </p>
          </div>
          <a
            href="mailto:crew@indianspacehub.com"
            className="px-6 py-3 rounded-full text-[14px] font-bold transition-transform hover:-translate-y-0.5"
            style={{ background: tokens.ink, color: tokens.paper }}
          >
            crew@indianspacehub.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${tokens.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]" style={{ color: tokens.inkMuted }}>
          <div className="flex items-center gap-2.5">
            <img src="/indian_space_hub_logo.png" alt="Logo" className="h-5 w-5 object-contain" />
            <span style={{ fontFamily: "'Fraunces', serif", color: tokens.ink }}>Indian Space Hub Store</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="mailto:crew@indianspacehub.com" style={{ color: tokens.inkMuted }}>crew@indianspacehub.com</a>
            <Link to="/privacy" style={{ color: tokens.inkMuted }}>Privacy Policy</Link>
            <Link to="/contact" style={{ color: tokens.inkMuted }}>Contact</Link>
          </div>
          <span className="text-[12px]" style={{ color: tokens.inkFaint }}>© {new Date().getFullYear()} Indian Space Hub</span>
        </div>
      </footer>
    </div>
  );
}
