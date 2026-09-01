import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Check, X, Loader2 } from "lucide-react";
import { tokens } from "../tokens.js";

/**
 * Reusable interest form modal used on both Home and ProductPage.
 */
export function InterestModal({ product, selectedSize, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        space_store_product_id: product.id,
        product_slug: product.slug,
        selected_size: selectedSize || undefined,
        quantity: 1,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
      style={{ background: "rgba(32,30,27,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full rounded-2xl p-7 relative shadow-2xl"
        style={{ background: tokens.card, maxWidth: "26rem", border: `1px solid ${tokens.line}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
          style={{ color: tokens.inkMuted }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: tokens.ink, marginBottom: 8 }}>
              Interest Registered 🚀
            </h3>
            <p className="text-[13.5px]" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              We'll email <strong style={{ color: tokens.ink }}>{form.email}</strong> when{" "}
              <strong style={{ color: tokens.ink }}>{product.name}</strong> is ready to ship
              {selectedSize ? ` in size ${selectedSize}` : ""}.
            </p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-full text-[13px] font-semibold" style={{ background: tokens.ink, color: tokens.paper }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: tokens.ink, marginBottom: 6 }}>
              Register Your Interest
            </h3>
            <p className="text-[13px] mb-5" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              Help unlock <strong style={{ color: tokens.ink }}>{product.name}</strong>
              {selectedSize ? ` (Size ${selectedSize})` : ""}. You'll be notified when pre-orders open.
            </p>
            {error && (
              <p className="text-[12.5px] mb-4 px-3 py-2 rounded-lg" style={{ background: "#F7E9E6", color: tokens.error }}>
                {error}
              </p>
            )}
            <div className="grid gap-3 mb-5">
              <input type="text" required placeholder="Full name *" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }} />
              <input type="email" required placeholder="Email address *" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }} />
              <input type="tel" placeholder="Phone / WhatsApp (optional)" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }} />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[13.5px] font-semibold"
              style={{ background: tokens.ink, color: tokens.paper, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : "Submit Interest Vote"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Product card used on the Home listing page.
 */
export function ProductCard({ product, onOpenInterest }) {
  const [selectedSize, setSelectedSize] = useState(product.available_sizes?.[0] || null);
  const required = product.min_interest_required || 0;
  const count = product.interests_count || 0;
  const pct = required > 0 ? Math.min(100, Math.round((count / required) * 100)) : 0;
  const goalReached = !!product.is_threshold_reached;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg"
      style={{ background: tokens.card, border: `1px solid ${goalReached ? tokens.accent : tokens.line}` }}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative" style={{ height: 210, background: tokens.paperSoft }}>
          {product.thumbnail_url || product.images?.[0] ? (
            <img src={product.thumbnail_url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl">🚀</div>
          )}
          {product.is_new && (
            <span className="absolute top-3 left-3 text-[10.5px] px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: product.color_accent || tokens.accent, color: "#fff", fontWeight: 700 }}>
              New drop
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] tracking-wide font-semibold uppercase" style={{ color: tokens.inkFaint }}>
            {product.eyebrow || product.category || "Merchandise"}
          </span>
          <span className="text-[14px] font-bold" style={{ color: tokens.ink }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="text-[15px] mb-1.5 hover:underline" style={{ color: tokens.ink, fontWeight: 600 }}>
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-[12.5px] mb-4 line-clamp-2" style={{ color: tokens.inkMuted, lineHeight: 1.55 }}>
            {product.description}
          </p>
        )}

        {/* Progress bar */}
        {required > 0 && (
          <div className="mb-4 mt-auto p-3 rounded-xl border" style={{ background: tokens.paperSoft, borderColor: tokens.line }}>
            <div className="flex items-center justify-between text-[11.5px] font-semibold mb-1.5" style={{ color: tokens.ink }}>
              <span>Interest Goal</span>
              <span>{count} / {required} ({pct}%)</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: "#E2DCD0" }}>
              <div className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%`, background: goalReached ? tokens.success : tokens.accent }} />
            </div>
            <span className="text-[11px]" style={{ color: goalReached ? tokens.success : tokens.inkMuted }}>
              {goalReached ? "🎉 Goal reached!" : `${required - count} more votes to unlock`}
            </span>
          </div>
        )}

        {/* Sizes */}
        {product.available_sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.available_sizes.map((s) => (
              <button key={s} type="button" onClick={() => setSelectedSize(s)}
                className="px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors duration-200"
                style={selectedSize === s
                  ? { background: tokens.ink, color: tokens.paper }
                  : { background: tokens.paperSoft, color: tokens.inkMuted, border: `1px solid ${tokens.line}` }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onOpenInterest(product, selectedSize)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium w-full justify-center shadow-sm hover:shadow transition-all"
          style={{ background: tokens.ink, color: tokens.paper }}
        >
          <Heart size={14} className="fill-current text-rose-400" /> Express Interest
        </button>
      </div>
    </div>
  );
}
